import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Platform,
    Alert,
} from 'react-native';
import * as XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {
    Text,
    IconButton,
    ActivityIndicator,
    Button,
    Card,
    Searchbar,
    Checkbox,
    Avatar,
    Divider,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { getStudentAttendanceList, saveStudentAttendance } from '../../../../api/services/faculty/eLearning';
import { StudentAttendanceListRequest, StudentAttendanceItem, SaveStudentAttendanceRequest } from '../../../../types/faculty/eLearning.types';
import SafeAreaWrapper from '../../../../components/SafeAreaWrapper';
import ScreenHeader from '../../../../components/common/ScreenHeader';
import { sanitizeFilename } from './utils';

export default function Attendance({ navigation, route }: any) {
    const { classDetails } = route.params;
    const user = useSelector((state: RootState) => state.auth.user);
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<StudentAttendanceItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set());
    const [refreshing, setRefreshing] = useState(false);

    const fetchStudents = useCallback(async () => {
        if (!user || !classDetails) return;
        setLoading(true);
        try {
            const requestData: StudentAttendanceListRequest = {
                AceYear: classDetails.AceYear.toString(),
                AttendanceDate: classDetails.LectureDate,
                CCode: classDetails.CCode.toString(),
                ClassId: classDetails.ClassID,
                ClassLectureScheduleDetailId: classDetails.ClassLectureScheduleDetailId,
                InstituteClassDivID: classDetails.InstituteClassDivID,
                SubjectCode: classDetails.SubjectCode,
                UserId: user.UserID?.toString() || '',
            };

            console.log('Fetching students with params:', requestData);
            const response = await getStudentAttendanceList(requestData);

            if (response.ResponseCode === 1 && Array.isArray(response.ResponseData)) {
                setStudents(response.ResponseData);
                // Initialize selected students based on IsPresent if needed, or default to all present/absent
                // For now, let's assume we start fresh or show existing status
                const presentStudents = new Set<number>();
                response.ResponseData.forEach((student: StudentAttendanceItem) => {
                    if (student.IsPresent) {
                        presentStudents.add(student.URNNO);
                    }
                });
                setSelectedStudents(presentStudents);
            } else {
                console.error('Invalid response format:', response);
                Alert.alert('Error', 'Failed to load student list.');
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            Alert.alert('Error', 'Something went wrong while fetching the student list.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user, classDetails]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchStudents();
    };

    const filteredStudents = useMemo(() => {
        if (!searchQuery) return students;
        return students.filter((student) =>
            student.StudentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.URNNO.toString().includes(searchQuery)
        );
    }, [students, searchQuery]);

    const toggleStudent = (urn: number) => {
        const newSelected = new Set(selectedStudents);
        if (newSelected.has(urn)) {
            newSelected.delete(urn);
        } else {
            newSelected.add(urn);
        }
        setSelectedStudents(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedStudents.size === filteredStudents.length) {
            setSelectedStudents(new Set());
        } else {
            const newSelected = new Set(selectedStudents);
            filteredStudents.forEach(s => newSelected.add(s.URNNO));
            setSelectedStudents(newSelected);
        }
    };

    const isPresentAll = useMemo(() => {
        return filteredStudents.length > 0 && filteredStudents.every(s => selectedStudents.has(s.URNNO));
    }, [filteredStudents, selectedStudents]);

    const exportToExcel = async () => {
        try {
            const data = students.map(s => ({
                'URN NO': s.URNNO,
                'Student Name': s.StudentName,
                'Roll No': s.RollNo || 'N/A',
                'Status': selectedStudents.has(s.URNNO) ? 'Present' : 'Absent',
                'Gender': s.Gender,
                'Contact': s.Contact,
                'Parent Contact': s.PContact || 'N/A',
                'Email': s.Email || 'N/A',
                'Division': s.Division,
                'Class Name': s.ClassName,
                'Section Name': s.SectionName || 'N/A',
                'Subject Name': s.SubjectName,
                'Employee Name': s.EmployeeName,
                'Attendance Date': s.AttendanceDate ? s.AttendanceDate.split('T')[0] : 'N/A',
                'In Time': s.InTime,
                'Out Time': s.OutTime,
                'Remark': s.Remark || '',
                'Ace Year': s.AceYear,
                'CCode': s.CCode,
                'Subject Code': s.SubjectCode,
                'Class ID': s.ClassId,
                'Section ID': s.SectionId,
                'Institute Class ID': s.InstituteClassDivID,
                'Schedule Detail ID': s.ClassLectureScheduleDetailId,
                'Employee ID': s.EmployeeID,
                'User ID': s.UserId || '',
                'Original Is Present': s.IsPresent ? 'Yes' : 'No', // From API
                'Attendance Details ID': s.AttendanceDetailsId,
                'Attendance Header ID': s.AttendanceHeaderId || '',
                'Add By': s.AddBy || '',
                'Add By Time': s.AddByTime || '',
                'Edit By': s.EditBy || '',
                'Edit By Time': s.EditByTime || '',
            }));

            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
            const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

            // Sanitize filename
            const paperName = sanitizeFilename(classDetails?.Paper || 'Subject');
            const dateStr = classDetails?.LectureDate?.split('T')[0] || 'Date';
            const fileName = `Attendance_${paperName}_${dateStr}.xlsx`;

            // Use CachesDirectoryPath for temporary files to avoid permission issues
            const path = `${RNFS.CachesDirectoryPath}/${fileName}`;

            await RNFS.writeFile(path, wbout, 'base64');

            await Share.open({
                url: `file://${path}`,
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                title: 'Attendance Report',
                subject: `Attendance Report - ${paperName}`,
                message: `Please find attached the attendance report for ${paperName} on ${dateStr}.`,
                failOnCancel: false,
            });
        } catch (error: any) {
            if (error.message !== 'User did not share') {
                console.log('Error exporting to excel:', error);
                Alert.alert('Error', 'Failed to export excel file.');
            }
        }
    };

    const handleSaveAttendance = async () => {
        if (!students.length) return;
        setLoading(true);
        try {
            const currentTime = new Date().toISOString();
            console.log('Starting Save Attendance for', students.length, 'students');

            const savePromises = students.map(student => {
                const request: SaveStudentAttendanceRequest = {
                    AttendanceDetailsId: 0,
                    AttendanceHeaderId: null,
                    InstituteClassDivID: classDetails.InstituteClassDivID,
                    ClassLectureScheduleDetailId: classDetails.ClassLectureScheduleDetailId,
                    EmployeeID: classDetails.EmployeeID,
                    UserId: user?.UserID?.toString() || '',
                    SubjectCode: classDetails.SubjectCode,
                    URNNO: student.URNNO,
                    SectionId: classDetails.SectionID,
                    ClassId: classDetails.ClassID,
                    IsPresent: selectedStudents.has(student.URNNO),
                    AttendanceDate: classDetails.LectureDate,
                    InTime: classDetails.ExpectedStartTime,
                    OutTime: classDetails.ExpectedEndTime,
                    Remark: null,
                    CCode: classDetails.CCode.toString(),
                    AceYear: classDetails.AceYear,
                    AddBy: user?.UserID?.toString() || '',
                    AddByTime: currentTime,
                    EditBy: user?.UserID?.toString() || '',
                    EditByTime: currentTime,
                };
                return saveStudentAttendance(request);
            });

            const results = await Promise.all(savePromises);

            results.forEach((res, index) => {
                console.log(`Student ${students[index].URNNO} Save Result:`, res);
            });

            const failedCount = results.filter(r => r.ResponseCode !== 1).length;

            if (failedCount === 0) {
                Alert.alert('Success', 'Attendance saved successfully for all students.');
            } else {
                Alert.alert('Partial Success', `${results.length - failedCount} students saved, ${failedCount} failed.`);
            }
        } catch (error) {
            console.error('Error saving attendance:', error);
            Alert.alert('Error', 'Failed to save attendance. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const renderStudentItem = ({ item }: { item: StudentAttendanceItem }) => {
        const isSelected = selectedStudents.has(item.URNNO);

        return (
            <TouchableOpacity onPress={() => toggleStudent(item.URNNO)} activeOpacity={0.7}>
                <View style={[styles.studentRow, isSelected && styles.studentRowSelected]}>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Android
                            status={isSelected ? 'checked' : 'unchecked'}
                            onPress={() => toggleStudent(item.URNNO)}
                            color="#1649b2"
                        />
                    </View>
                    <View style={styles.studentInfo}>
                        <Text style={styles.studentName}>{item.StudentName}</Text>
                        <Text style={styles.urnText}>URN: {item.URNNO}</Text>
                    </View>
                    <View style={styles.genderContainer}>
                        <Text style={styles.genderText}>{item.Gender}</Text>
                    </View>
                    <View style={styles.mobileContainer}>
                        <Text style={styles.mobileText}>{item.Contact}</Text>
                    </View>
                </View>
                <Divider />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaWrapper>
            <ScreenHeader
                title="Student Attendance"
                onBack={() => navigation.goBack()}
                rightAction={
                    <IconButton
                        icon="microsoft-excel"
                        iconColor="#1D6F42"
                        size={24}
                        onPress={exportToExcel}
                        style={{ marginRight: 8 }}
                    />
                }
            />

            <View style={styles.container}>
                {/* Search and Filter Bar */}
                <View style={styles.filterContainer}>
                    <Searchbar
                        placeholder="Search student..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchBar}
                        inputStyle={styles.searchInput}
                        iconColor="#666"
                    />
                </View>

                {/* Header Row */}
                <View style={styles.listHeader}>
                    <TouchableOpacity style={styles.headerCheckbox} onPress={handleSelectAll}>
                        <Checkbox.Android
                            status={isPresentAll ? 'checked' : 'unchecked'}
                            onPress={handleSelectAll}
                            color="#1649b2"
                        />
                    </TouchableOpacity>

                    <Text style={[styles.headerText, { flex: 2 }]}>Student Name</Text>
                    <Text style={[styles.headerText, { width: 50, textAlign: 'center' }]}>Gen</Text>
                    <Text style={[styles.headerText, { width: 100, textAlign: 'right' }]}>Mobile</Text>
                </View>
                <Divider bold />

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#1649b2" />
                        <Text style={styles.loadingText}>Loading students...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredStudents}
                        renderItem={renderStudentItem}
                        keyExtractor={(item) => item.URNNO.toString()}
                        contentContainerStyle={styles.listContent}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#1649b2']} />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No students found.</Text>
                            </View>
                        }
                    />
                )}

                {/* Footer Actions */}
                <View style={styles.footer}>
                    <View style={styles.statsContainer}>
                        <Text style={styles.statsText}>
                            Present: <Text style={{ fontWeight: 'bold', color: '#26C281' }}>{selectedStudents.size}</Text>
                            / {filteredStudents.length}
                        </Text>
                    </View>
                    <Button
                        mode="contained"
                        onPress={handleSaveAttendance}
                        loading={loading}
                        disabled={loading}
                        style={styles.saveButton}
                        labelStyle={styles.saveButtonLabel}
                    >
                        Save Attendance
                    </Button>
                </View>
            </View>
        </SafeAreaWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    filterContainer: {
        padding: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    searchBar: {
        elevation: 0,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        height: 44,
    },
    searchInput: {
        fontSize: 14,
        minHeight: 0,
    },
    listHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f8f9fa',
    },
    headerCheckbox: {
        width: 40,
        alignItems: 'flex-start',
    },
    headerText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#666',
    },
    listContent: {
        paddingBottom: 80,
    },
    studentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    studentRowSelected: {
        backgroundColor: '#f0f7ff',
    },
    checkboxContainer: {
        width: 40,
        alignItems: 'flex-start',
    },
    studentInfo: {
        flex: 2,
    },
    studentName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 2,
    },
    urnText: {
        fontSize: 12,
        color: '#888',
    },
    genderContainer: {
        width: 50,
        alignItems: 'center',
    },
    genderText: {
        fontSize: 14,
        color: '#444',
    },
    mobileContainer: {
        width: 100,
        alignItems: 'flex-end',
    },
    mobileText: {
        fontSize: 13,
        color: '#666',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#888',
        fontSize: 15,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 8,
    },
    statsContainer: {
        flex: 1,
    },
    statsText: {
        fontSize: 15,
        color: '#444',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#1649b2',
        borderRadius: 8,
        minWidth: 120,
    },
    saveButtonLabel: {
        fontSize: 14,
        fontWeight: '700',
        paddingVertical: 2,
    },
});
