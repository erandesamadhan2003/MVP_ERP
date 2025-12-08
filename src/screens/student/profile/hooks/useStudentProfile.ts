import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../store/store';
import {
  FetchStudentProfileSelectList,
  StudentDetails,
} from '../../../../store/slices/student/studentSlice';
import { fetchCoursesBySection } from '../../../../store/slices/student/CourseSlice';
import { fetchClassesByCourse } from '../../../../store/slices/student/ClassSlice';

/**
 * Custom hook for managing student profile data fetching and state
 */
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
  const { courses, loading: coursesLoading } = useSelector((state: RootState) => state.course);
  const { classes, loading: classesLoading } = useSelector((state: RootState) => state.class);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      // Validate user exists in store
      if (!user) {
        setErrorMessage('User data not found. Please log in again.');
        return;
      }

      // Validate UserID exists in user object
      const userID = user.UserID;
      if (!userID || typeof userID !== 'number') {
        setErrorMessage('UserID is missing or invalid. Please log in again.');
        return;
      }

      // Get ApplicationToken from user object (part of UserData interface)
      // Fallback to token from auth state if ApplicationToken is not in user object
      const applicationToken = (user as any)?.ApplicationToken || token;

      // Validate ApplicationToken exists and is valid
      if (!applicationToken || typeof applicationToken !== 'string' || applicationToken.trim().length === 0) {
        setErrorMessage('ApplicationToken is missing or invalid. Please log in again.');
        return;
      }

      setErrorMessage(null);

      try {
        // 1. Fetch Select Lists
        await dispatch(FetchStudentProfileSelectList()).unwrap();

        // 2. Fetch Student Details
        const studentDetailsResult = await dispatch(
          StudentDetails({
            UserID: userID,
            ApplicationToken: applicationToken,
          })
        ).unwrap();

        // 3. Get SectionID from student details or user
        const sectionID =
          studentDetailsResult?.meritRegistrationMaster?.PrevSectionID || user?.SectionID;
        if (sectionID) {
          // 4. Fetch Courses on Section
          await dispatch(fetchCoursesBySection(sectionID)).unwrap();
        }

        // 5. Get CourseID from student details or user
        const courseID =
          studentDetailsResult?.meritRegistrationMaster?.PrevCourseID || user?.CourseID;
        if (courseID) {
          // 6. Fetch Classes on Course
          await dispatch(fetchClassesByCourse(courseID)).unwrap();
        }
      } catch (error: any) {
        // Extract error message properly
        const errorMsg =
          error?.response?.data?.Message ||
          error?.message ||
          `Failed to fetch profile data${error?.response?.status ? ` (Status: ${error.response.status})` : ''}`;
        setErrorMessage(errorMsg);
      }
    };

    // Only fetch if user is available
    if (user) {
      fetchAllData();
    }
  }, [dispatch, user, token]);

  const retryFetch = async () => {
    setErrorMessage(null);
    const applicationToken = (user as any)?.ApplicationToken || token;
    if (!user?.UserID || !applicationToken) return;

    try {
      await dispatch(FetchStudentProfileSelectList()).unwrap();
      await dispatch(
        StudentDetails({
          UserID: user.UserID,
          ApplicationToken: applicationToken,
        })
      ).unwrap();
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  const isLoading = profileLoading || selectListsLoading || coursesLoading || classesLoading;
  const profileData = profile?.meritRegistrationMaster;

  return {
    user,
    profile,
    profileData,
    selectLists,
    courses,
    classes,
    isLoading,
    errorMessage,
    setErrorMessage,
    retryFetch,
  };
};

