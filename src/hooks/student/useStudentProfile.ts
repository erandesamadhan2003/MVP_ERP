import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import {
    FetchStudentProfileSelectList,
    StudentDetails,
} from '../../store/slices/student/studentSlice';
import { fetchCoursesBySection } from '../../store/slices/student/CourseSlice';
import { fetchClassesByCourse } from '../../store/slices/student/ClassSlice';

export const useStudentProfile = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.token);

    const {
        selectListsLoading,
        selectListsError,
        selectLists,
        loading: profileLoading,
        error: profileError,
        profile,
    } = useSelector((state: RootState) => state.student);

    const { courses, loading: coursesLoading } = useSelector(
        (state: RootState) => state.course,
    );

    const { classes, loading: classesLoading } = useSelector(
        (state: RootState) => state.class,
    );

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Prevent re-fetching if already initialized
        if (isInitialized) return;

        const fetchAllData = async () => {
            // Validate user exists in store
            if (!user) {
                setErrorMessage('User data not found. Please log in again.');
                return;
            }

            // Validate UserID exists in user object
            const userID = user.UserID;
            if (!userID || typeof userID !== 'number') {
                setErrorMessage(
                    'UserID is missing or invalid. Please log in again.',
                );
                return;
            }

            const applicationToken = user.ApplicationToken || token;

            if (
                !applicationToken ||
                typeof applicationToken !== 'string' ||
                applicationToken.trim().length === 0
            ) {
                setErrorMessage(
                    'ApplicationToken is missing or invalid. Please log in again.',
                );
                return;
            }

            setErrorMessage(null);

            try {
                // 1. Fetch Select Lists (parallel fetch for better performance)
                const selectListsPromise = dispatch(
                    FetchStudentProfileSelectList(),
                ).unwrap();

                // 2. Fetch Student Details
                const studentDetailsPromise = dispatch(
                    StudentDetails({
                        UserID: userID,
                        ApplicationToken: applicationToken,
                    }),
                ).unwrap();

                // Wait for both to complete
                const [, studentDetailsResult] = await Promise.all([
                    selectListsPromise,
                    studentDetailsPromise,
                ]);

                // 3. Get SectionID from student details or user
                const sectionID =
                    studentDetailsResult?.meritRegistrationMaster
                        ?.PrevSectionID || user?.SectionID;

                // 4. Get CourseID from student details or user
                const courseID =
                    studentDetailsResult?.meritRegistrationMaster
                        ?.PrevCourseID || user?.ClassID; // Note: UserData has ClassID, not CourseID

                // 5. Fetch Courses and Classes (can be done in parallel)
                const fetchPromises: Promise<any>[] = [];

                if (sectionID) {
                    fetchPromises.push(
                        dispatch(fetchCoursesBySection(sectionID)).unwrap(),
                    );
                }

                if (courseID) {
                    fetchPromises.push(
                        dispatch(fetchClassesByCourse(courseID)).unwrap(),
                    );
                }

                // Wait for courses and classes to load
                if (fetchPromises.length > 0) {
                    await Promise.all(fetchPromises);
                }

                // Mark as initialized to prevent re-fetching
                setIsInitialized(true);
            } catch (error: any) {
                // Extract error message properly
                const errorMsg =
                    error?.response?.data?.Message ||
                    error?.message ||
                    error ||
                    `Failed to fetch profile data${
                        error?.response?.status
                            ? ` (Status: ${error.response.status})`
                            : ''
                    }`;
                setErrorMessage(errorMsg);
                console.error('Profile fetch error:', error);
            }
        };

        // Only fetch if user is available
        if (user) {
            fetchAllData();
        }
    }, [dispatch, user, token, isInitialized]);

    const retryFetch = async () => {
        setErrorMessage(null);
        setIsInitialized(false); // Reset initialization flag

        if (!user?.UserID) {
            setErrorMessage('User ID not available. Please log in again.');
            return;
        }

        const applicationToken = user.ApplicationToken || token;

        if (!applicationToken) {
            setErrorMessage(
                'Application token not available. Please log in again.',
            );
            return;
        }

        try {
            // Retry fetching all data
            await dispatch(FetchStudentProfileSelectList()).unwrap();

            const studentDetailsResult = await dispatch(
                StudentDetails({
                    UserID: user.UserID,
                    ApplicationToken: applicationToken,
                }),
            ).unwrap();

            // Fetch dependent data
            const sectionID =
                studentDetailsResult?.meritRegistrationMaster?.PrevSectionID ||
                user?.SectionID;

            const courseID =
                studentDetailsResult?.meritRegistrationMaster?.PrevCourseID ||
                user?.ClassID;

            if (sectionID) {
                await dispatch(fetchCoursesBySection(sectionID)).unwrap();
            }

            if (courseID) {
                await dispatch(fetchClassesByCourse(courseID)).unwrap();
            }

            setIsInitialized(true);
        } catch (error: any) {
            const errorMsg =
                error?.response?.data?.Message ||
                error?.message ||
                error ||
                'Retry failed. Please try again.';
            setErrorMessage(errorMsg);
            console.error('Retry failed:', error);
        }
    };

    const isLoading =
        profileLoading ||
        selectListsLoading ||
        coursesLoading ||
        classesLoading;

    const profileData = profile?.meritRegistrationMaster;

    // Combine errors from all sources
    const combinedError =
        errorMessage || profileError || selectListsError || null;

    return {
        user,
        profile,
        profileData,
        selectLists,
        courses,
        classes,
        isLoading,
        errorMessage: combinedError,
        setErrorMessage,
        retryFetch,
        isInitialized,
    };
};
