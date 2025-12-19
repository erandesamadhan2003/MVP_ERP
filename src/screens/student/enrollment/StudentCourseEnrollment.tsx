import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    IconButton,
    Snackbar,
    Text,
} from 'react-native-paper';
import SafeAreaWrapper from '../../../components/SafeAreaWrapper';
import { DropdownField } from '../../../components/common/DropdownField';
import { InputField } from '../../../components/common/InputField';
import { DatePickerField } from '../../../components/common/DatePickerField';
import { useCourseEnrollment } from './utils/courseEnrollmentHelpers';

const StudentCourseEnrollment = ({ navigation }: any) => {
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const { state, handlers, saveSuccess, resetSaveState } =
        useCourseEnrollment();

    const {
        talukaOptions,
        instituteOptions,
        sectionOptions,
        courseOptions,
        classOptions,
        mediumOptions,
        selectedTaluka,
        selectedInstituteCCode,
        selectedSectionId,
        selectedCourseId,
        selectedClassId,
        selectedMediumId,
        classIsDirect,
        bankDetails,
        canSave,
        isBusy,
        error,
        hasAuthUser,
    } = state;

    const {
        onTalukaChange,
        onInstituteChange,
        onSectionChange,
        onCourseChange,
        onClassChange,
        onMediumChange,
        onBankDetailChange,
        handleSave,
        clearError,
    } = handlers;

    useEffect(() => {
        if (saveSuccess) {
            setSnackbarVisible(true);
            setTimeout(() => {
                resetSaveState();
                navigation.replace('EnrollmentList');
            }, 800);
        }
    }, [saveSuccess]);

    if (!hasAuthUser) {
        return (
            <SafeAreaWrapper>
                <View style={styles.centered}>
                    <ActivityIndicator />
                    <Text>Please login to continue</Text>
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
                        <Text style={styles.title}>Course Enrollment</Text>
                    </View>
                </View>

                {isBusy && (
                    <View style={styles.loading}>
                        <ActivityIndicator />
                        <Text style={styles.loadingText}>
                            Processing, please wait...
                        </Text>
                    </View>
                )}

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 24 }}
                >
                    {/* COURSE SELECTION */}
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text style={styles.sectionTitle}>
                                Select Course Preferences
                            </Text>

                            <DropdownField
                                label="Taluka"
                                value={selectedTaluka}
                                options={talukaOptions}
                                onSelect={onTalukaChange}
                            />

                            <DropdownField
                                label="Institute"
                                value={
                                    instituteOptions.find(
                                        o => o.value === selectedInstituteCCode,
                                    )?.label || ''
                                }
                                options={instituteOptions}
                                onSelect={onInstituteChange}
                                disabled={!selectedTaluka}
                            />

                            <DropdownField
                                label="Section"
                                value={
                                    sectionOptions.find(
                                        o => o.value === selectedSectionId,
                                    )?.label || ''
                                }
                                options={sectionOptions}
                                onSelect={onSectionChange}
                                disabled={!selectedInstituteCCode}
                            />

                            <DropdownField
                                label="Course"
                                value={
                                    courseOptions.find(
                                        o => o.value === selectedCourseId,
                                    )?.label || ''
                                }
                                options={courseOptions}
                                onSelect={onCourseChange}
                                disabled={!selectedSectionId}
                            />

                            <DropdownField
                                label="Class"
                                value={
                                    classOptions.find(
                                        o => o.value === selectedClassId,
                                    )?.label || ''
                                }
                                options={classOptions}
                                onSelect={onClassChange}
                                disabled={!selectedCourseId}
                            />

                            {mediumOptions.length > 0 && (
                                <DropdownField
                                    label="Medium"
                                    value={
                                        mediumOptions.find(
                                            o => o.value === selectedMediumId,
                                        )?.label || ''
                                    }
                                    options={mediumOptions}
                                    onSelect={onMediumChange}
                                />
                            )}
                        </Card.Content>
                    </Card>

                    {/* BANK DETAILS */}
                    {classIsDirect === false && (
                        <Card style={[styles.card, styles.mt]}>
                            <Card.Content>
                                <Text style={styles.sectionTitle}>
                                    Bank Account Details
                                </Text>

                                <View style={styles.row}>
                                    <View style={styles.col}>
                                        <InputField
                                            label="Bank Name *"
                                            value={bankDetails.BankName}
                                            onChangeText={text =>
                                                onBankDetailChange(
                                                    'BankName',
                                                    text,
                                                )
                                            }
                                        />
                                    </View>
                                    <View style={styles.col}>
                                        <InputField
                                            label="Branch Name *"
                                            value={bankDetails.BankBranchName}
                                            onChangeText={text =>
                                                onBankDetailChange(
                                                    'BankBranchName',
                                                    text,
                                                )
                                            }
                                        />
                                    </View>
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.col}>
                                        <InputField
                                            label="Bank Account No. *"
                                            value={bankDetails.BankAccountNo}
                                            keyboardType="numeric"
                                            onChangeText={text =>
                                                onBankDetailChange(
                                                    'BankAccountNo',
                                                    text,
                                                )
                                            }
                                        />
                                    </View>
                                    <View style={styles.col}>
                                        <InputField
                                            label="IFSC Code *"
                                            value={bankDetails.IFSCODE}
                                            onChangeText={text =>
                                                onBankDetailChange(
                                                    'IFSCODE',
                                                    text,
                                                )
                                            }
                                        />
                                    </View>
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.col}>
                                        <InputField
                                            label="Student Saral ID (18 digits) *"
                                            value={bankDetails.UDISE}
                                            keyboardType="numeric"
                                            onChangeText={text => {
                                                if (text.length <= 18) {
                                                    onBankDetailChange(
                                                        'UDISE',
                                                        text,
                                                    );
                                                }
                                            }}
                                        />
                                    </View>
                                    <View style={styles.col}>
                                        <InputField
                                            label="APAAR ID (ABCID) *"
                                            value={bankDetails.ABCID}
                                            onChangeText={text =>
                                                onBankDetailChange(
                                                    'ABCID',
                                                    text,
                                                )
                                            }
                                        />
                                    </View>
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.colThird}>
                                        <InputField
                                            label="Annual Income *"
                                            value={bankDetails.AnnualIncome}
                                            keyboardType="numeric"
                                            onChangeText={text =>
                                                onBankDetailChange(
                                                    'AnnualIncome',
                                                    text,
                                                )
                                            }
                                        />
                                    </View>
                                    <View style={styles.colThird}>
                                        <InputField
                                            label="No. of Siblings *"
                                            value={bankDetails.NoOfSibling}
                                            keyboardType="numeric"
                                            onChangeText={text =>
                                                onBankDetailChange(
                                                    'NoOfSibling',
                                                    text,
                                                )
                                            }
                                        />
                                    </View>
                                    <View style={styles.colThird}>
                                        <InputField
                                            label="Ward No *"
                                            value={bankDetails.SiblingWardNo}
                                            onChangeText={text =>
                                                onBankDetailChange(
                                                    'SiblingWardNo',
                                                    text,
                                                )
                                            }
                                        />
                                    </View>
                                </View>

                                <View style={styles.colThird}>
                                    <InputField
                                        label="PAN No *"
                                        value={bankDetails.PANNO}
                                        onChangeText={text =>
                                            onBankDetailChange(
                                                'PANNO',
                                                text.toUpperCase(),
                                            )
                                        }
                                    />
                                </View>
                                <View style={styles.row}>
                                    <View style={styles.colThird}>
                                        <DatePickerField
                                            label="Father DOB *"
                                            value={bankDetails.FatherDoB}
                                            onDateChange={date =>
                                                onBankDetailChange(
                                                    'FatherDoB',
                                                    date,
                                                )
                                            }
                                        />
                                    </View>
                                    <View style={styles.colThird}>
                                        <DatePickerField
                                            label="Mother DOB *"
                                            value={bankDetails.MotherDoB}
                                            onDateChange={date =>
                                                onBankDetailChange(
                                                    'MotherDoB',
                                                    date,
                                                )
                                            }
                                        />
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                    )}

                    {/* ACTION BUTTONS */}
                    <View style={styles.buttonRow}>
                        <Button
                            mode="outlined"
                            style={styles.button}
                            onPress={() => navigation.goBack()}
                        >
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            style={styles.button}
                            disabled={!canSave || isBusy}
                            onPress={handleSave}
                        >
                            Save
                        </Button>
                    </View>
                </ScrollView>

                <Snackbar
                    visible={snackbarVisible || !!error}
                    onDismiss={() => {
                        setSnackbarVisible(false);
                        clearError();
                    }}
                    duration={4000}
                >
                    {error || 'Enrollment saved successfully'}
                </Snackbar>
            </View>
        </SafeAreaWrapper>
    );
};

export default StudentCourseEnrollment;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#08306b',
    },
    loading: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    loadingText: {
        marginLeft: 8,
        fontSize: 13,
    },
    card: {
        backgroundColor: '#fff',
    },
    mt: {
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1649b2',
        marginBottom: 8,
    },

    row: {
        flexDirection: 'row',
    },
    col: {
        flex: 1,
        minWidth: 0,
        paddingHorizontal: 6,
    },
    colThird: {
        flex: 1,
        minWidth: 0,
        paddingHorizontal: 6,
    },

    buttonRow: {
        flexDirection: 'row',
        marginTop: 16,
    },
    button: {
        flex: 1,
        marginHorizontal: 6,
    },

    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
