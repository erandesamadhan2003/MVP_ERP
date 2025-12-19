import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Checkbox,
    IconButton,
    Text,
    DataTable,
    Searchbar,
    Snackbar,
} from 'react-native-paper';
import SafeAreaWrapper from '../../../components/SafeAreaWrapper';
import { InputField } from '../../../components/common/InputField';
import { DropdownField } from '../../../components/common/DropdownField';
import { DatePickerField } from '../../../components/common/DatePickerField';
import { useExamForm } from './utils/examFormHelpers';
import { GroupedSubjects } from '../../../types/student/ExamForm.types';

interface ExamFormProps {
    navigation: any;
    route: any;
}

function ExamForm({ navigation, route }: ExamFormProps) {
    const { urnno } = route.params || { urnno: 654125 }; // Get URNNO from navigation params
    const { state, handlers } = useExamForm(urnno);
    
    const [subjectSearchQuery, setSubjectSearchQuery] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const {
        studentInfo,
        classList,
        selectedClass,
        examList,
        selectedExams,
        groupedSubjects,
        selectedSubjects,
        timeTableList,
        examYear,
        isLoading,
        error,
        expandedExams,
    } = state;

    const {
        onClassChange,
        onExamYearChange,
        onExamToggle,
        onSubjectToggle,
        onExamSectionToggle,
        handleSave,
        handlePrint,
    } = handlers;

    // Class dropdown options
    const classOptions = classList.map(cls => ({
        label: `${cls.ClassName} - ${cls.SectionName}`,
        value: cls.ClassID,
    }));


    // Filter subjects based on search
    const filteredGroupedSubjects = React.useMemo<GroupedSubjects>(() => {
        if (!subjectSearchQuery) return groupedSubjects;
        
        const filtered: GroupedSubjects = {};
        Object.entries(groupedSubjects).forEach(([examName, subjects]) => {
            const filteredSubjects = subjects.filter(
                subject =>
                    subject.SubjectDetails.toLowerCase().includes(
                        subjectSearchQuery.toLowerCase()
                    ) ||
                    subject.Paper.toLowerCase().includes(
                        subjectSearchQuery.toLowerCase()
                    )
            );
            if (filteredSubjects.length > 0) {
                filtered[examName] = filteredSubjects;
            }
        });
        return filtered;
    }, [groupedSubjects, subjectSearchQuery]);

    if (!studentInfo) {
        return (
            <SafeAreaWrapper>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" />
                    <Text style={styles.centeredText}>Loading student information...</Text>
                </View>
            </SafeAreaWrapper>
        );
    }

    return (
        <SafeAreaWrapper>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <IconButton
                            icon="arrow-left"
                            size={22}
                            onPress={() => navigation.goBack()}
                        />
                        <Text style={styles.title}>Examination Form Fill</Text>
                    </View>
                </View>

                {isLoading && (
                    <View style={styles.loadingBar}>
                        <ActivityIndicator size="small" />
                        <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                )}

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Examination Information Card */}
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text style={styles.sectionTitle}>Examination Information</Text>

                            <View style={styles.formRow}>
                                <View style={styles.formFieldSmall}>
                                    <Text style={styles.fieldLabel}>URNNO</Text>
                                    <InputField
                                        label=""
                                        value={String(studentInfo.URNNO)}
                                        editable={false}
                                    />
                                </View>
                                <View style={styles.formFieldLarge}>
                                    <Text style={styles.fieldLabel}>Student Name</Text>
                                    <InputField
                                        label=""
                                        value={studentInfo.FullName}
                                        editable={false}
                                    />
                                </View>
                            </View>

                            <View style={styles.formRow}>
                                <View style={styles.formField}>
                                    <Text style={styles.fieldLabel}>Class Name</Text>
                                    <DropdownField
                                        label=""
                                        value={
                                            selectedClass
                                                ? `${selectedClass.ClassName} - ${selectedClass.SectionName}`
                                                : ''
                                        }
                                        options={classOptions}
                                        onSelect={(classId) => {
                                            const selected = classList.find(
                                                c => c.ClassID === classId
                                            );
                                            if (selected) onClassChange(selected);
                                        }}
                                    />
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.fieldLabel}>Exam Eyear</Text>
                                    <DatePickerField
                                        label=""
                                        value={examYear}
                                        onDateChange={onExamYearChange}
                                    />
                                </View>
                            </View>

                            <View style={styles.examSelectionContainer}>
                                <Text style={styles.fieldLabel}>Select Exams</Text>
                                {examList.map(exam => (
                                    <TouchableOpacity
                                        key={exam.ExamNameID}
                                        style={styles.checkboxRow}
                                        onPress={() => onExamToggle(exam.ExamNameID)}
                                    >
                                        <Checkbox
                                            status={
                                                selectedExams.includes(exam.ExamNameID)
                                                    ? 'checked'
                                                    : 'unchecked'
                                            }
                                        />
                                        <Text style={styles.checkboxLabel}>
                                            {exam.NameOfExam}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.buttonRow}>
                                <Button
                                    mode="contained"
                                    onPress={async () => {
                                        const result = await handleSave();
                                        if (result) {
                                            setSnackbarMessage(
                                                result.success
                                                    ? 'Exam form saved successfully!'
                                                    : result.message || 'Failed to save'
                                            );
                                            setSnackbarVisible(true);
                                        }
                                    }}
                                    disabled={isLoading || selectedExams.length === 0}
                                    style={styles.saveButton}
                                >
                                    Save
                                </Button>
                                <Button
                                    mode="outlined"
                                    onPress={handlePrint}
                                    disabled={isLoading}
                                    style={styles.printButton}
                                >
                                    Print
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>

                    {/* Time Table Card */}
                    {timeTableList.length > 0 && (
                        <Card style={[styles.card, styles.cardSpacing]}>
                            <Card.Content>
                                <Text style={styles.sectionTitleAlt}>
                                    Examination Form Fill Time Table
                                </Text>
                                <DataTable>
                                    <DataTable.Header>
                                        <DataTable.Title>Section Name</DataTable.Title>
                                        <DataTable.Title>ExamYear</DataTable.Title>
                                        <DataTable.Title>Class Name</DataTable.Title>
                                        <DataTable.Title>Start Date</DataTable.Title>
                                        <DataTable.Title>End Date</DataTable.Title>
                                    </DataTable.Header>

                                    {timeTableList.map((item, index) => (
                                        <DataTable.Row key={index}>
                                            <DataTable.Cell>{item.SectionName}</DataTable.Cell>
                                            <DataTable.Cell>{item.ExamYear}</DataTable.Cell>
                                            <DataTable.Cell>{item.ClassName}</DataTable.Cell>
                                            <DataTable.Cell>{item.StartDate}</DataTable.Cell>
                                            <DataTable.Cell>{item.EndDate}</DataTable.Cell>
                                        </DataTable.Row>
                                    ))}
                                </DataTable>
                            </Card.Content>
                        </Card>
                    )}

                    {/* Subject Info Card */}
                    {Object.keys(groupedSubjects).length > 0 && (
                        <Card style={[styles.card, styles.cardSpacing]}>
                            <Card.Content>
                                <Text style={styles.sectionTitle}>Subject Info</Text>
                                
                                <Searchbar
                                    placeholder="Search subjects..."
                                    onChangeText={setSubjectSearchQuery}
                                    value={subjectSearchQuery}
                                    style={styles.searchBar}
                                />

                                {Object.entries(filteredGroupedSubjects).map(
                                    ([examName, subjects]) => (
                                        <View key={examName} style={styles.examGroup}>
                                            <TouchableOpacity
                                                style={styles.examGroupHeader}
                                                onPress={() => onExamSectionToggle(examName)}
                                            >
                                                <IconButton
                                                    icon={
                                                        expandedExams.includes(examName)
                                                            ? 'chevron-down'
                                                            : 'chevron-right'
                                                    }
                                                    size={20}
                                                />
                                                <Text style={styles.examGroupTitle}>
                                                    {examName} - {subjects.length} items
                                                </Text>
                                            </TouchableOpacity>

                                            {expandedExams.includes(examName) && (
                                                <View style={styles.subjectList}>
                                                    {subjects.map(subject => (
                                                        <TouchableOpacity
                                                            key={subject.SubjectCode}
                                                            style={styles.subjectRow}
                                                            onPress={() =>
                                                                onSubjectToggle(
                                                                    subject.SubjectCode
                                                                )
                                                            }
                                                        >
                                                            <Checkbox
                                                                status={
                                                                    selectedSubjects.includes(
                                                                        subject.SubjectCode
                                                                    )
                                                                        ? 'checked'
                                                                        : 'unchecked'
                                                                }
                                                            />
                                                            <View style={styles.subjectInfo}>
                                                                <Text
                                                                    style={
                                                                        styles.subjectDetails
                                                                    }
                                                                >
                                                                    {subject.SubjectDetails}
                                                                </Text>
                                                                {subject.Paper && (
                                                                    <Text
                                                                        style={
                                                                            styles.subjectPaper
                                                                        }
                                                                    >
                                                                        {subject.Paper}
                                                                    </Text>
                                                                )}
                                                            </View>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            )}
                                        </View>
                                    )
                                )}
                            </Card.Content>
                        </Card>
                    )}

                    {error && (
                        <Card style={[styles.card, styles.errorCard]}>
                            <Card.Content>
                                <Text style={styles.errorText}>{error}</Text>
                            </Card.Content>
                        </Card>
                    )}
                </ScrollView>

                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={3000}
                    action={{
                        label: 'OK',
                        onPress: () => setSnackbarVisible(false),
                    }}
                >
                    {snackbarMessage}
                </Snackbar>
            </View>
        </SafeAreaWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#08306b',
    },
    loadingBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        gap: 8,
    },
    loadingText: {
        fontSize: 13,
        color: '#555',
    },
    scrollContent: {
        paddingBottom: 24,
    },
    card: {
        backgroundColor: '#fff',
        elevation: 2,
    },
    cardSpacing: {
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1649b2',
        marginBottom: 12,
    },
    sectionTitleAlt: {
        fontSize: 16,
        fontWeight: '700',
        color: '#8B0000',
        marginBottom: 12,
    },
    formRow: {
        flexDirection: 'row',
        marginBottom: 12,
        gap: 12,
    },
    formField: {
        flex: 1,
    },
    formFieldSmall: {
        flex: 0.3,
    },
    formFieldLarge: {
        flex: 0.7,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    examSelectionContainer: {
        marginBottom: 16,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#333',
        marginLeft: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#1649b2',
    },
    printButton: {
        flex: 1,
    },
    searchBar: {
        marginBottom: 12,
        elevation: 0,
    },
    examGroup: {
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        overflow: 'hidden',
    },
    examGroupHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingVertical: 8,
        paddingRight: 12,
    },
    examGroupTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    subjectList: {
        paddingVertical: 8,
    },
    subjectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    subjectInfo: {
        flex: 1,
        marginLeft: 8,
    },
    subjectDetails: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    subjectPaper: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    errorCard: {
        backgroundColor: '#ffebee',
        marginTop: 16,
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 14,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    centeredText: {
        marginTop: 8,
        fontSize: 14,
        color: '#555',
    },
});

export default ExamForm;