import React from 'react';
import { View, ScrollView } from 'react-native';
import {
    Text,
    Divider,
    Card,
    Button,
    IconButton,
} from 'react-native-paper';
import { DropdownField } from '../../common/DropdownField';
import {
    formatDate,
    getDropdownValue,
} from '../../../screens/student/profile/utils/profileHelpers';
import { profileStyles } from '../../../screens/student/profile/profileStyles';
import { StudentProfileMaster } from '../../../types/student/studentProfile.types';
import { SelectLists } from '../../../types/student/SelectList.types';
import { InputField } from '../../common/InputField';

interface TabComponentsProps {
    profileData: StudentProfileMaster | null | undefined;
    selectLists: SelectLists | null | undefined;
    user: any;
    onTabChange: (
        tab: 'BASIC' | 'CONTACT' | 'QUALIFICATION' | 'DOCUMENT',
    ) => void;
    activeTab: 'BASIC' | 'CONTACT' | 'QUALIFICATION' | 'DOCUMENT';
}

export const BasicDetailsTab = ({
    profileData,
    selectLists,
    user,
    onTabChange,
}: TabComponentsProps) => {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            {/* Existing Student - URN NO */}
            <Card style={profileStyles.card}>
                <Card.Content>
                    <Text style={profileStyles.sectionTitle}>
                        Existing Student?
                    </Text>
                    <InputField
                        label="URN NO."
                        value={
                            profileData?.URNNO?.toString() ||
                            user?.URNNO?.toString() ||
                            ''
                        }
                        editable={false}
                    />
                </Card.Content>
            </Card>

            {/* Personal Information */}
            <Card style={profileStyles.card}>
                <Card.Content>
                    <Text style={profileStyles.sectionTitle}>
                        Personal Information
                    </Text>

                    <Divider style={profileStyles.divider} />

                    <InputField label="User Email" value={profileData?.Email1 || user?.Email || ''} editable={false} />
                    <InputField label="Password" value="********" secureTextEntry editable={false} />
                    <InputField label="Conf Password" value="********" secureTextEntry editable={false} />
                    <InputField label="Last Name" value={profileData?.LastName || ''} />
                    <InputField label="First Name" value={profileData?.FirstName || ''} />
                    <InputField label="Father Name" value={profileData?.FatherName || ''} />
                    <InputField label="Mother Name" value={profileData?.MotherName || ''} />
                    <InputField label="Grand Father" value={profileData?.GrandFatherName || ''} />
                    <InputField label="Aadhar No." value={profileData?.AdharID || ''} editable={false} />
                </Card.Content>
            </Card>

            {/* Basic Information */}
            <Card style={profileStyles.card}>
                <Card.Content>
                    <Text style={profileStyles.sectionTitle}>
                        Basic Information
                    </Text>
                    <Divider style={profileStyles.divider} />

                    <InputField label="Birth Date" value={formatDate(profileData?.DateOfBirth)} editable={false} icon="calendar" />
                    <InputField label="Birth Place" value={profileData?.BirthPlace || ''} editable={false} />

                    <DropdownField
                        label="Birth Taluka"
                        value={getDropdownValue(
                            'birthTaluka',
                            profileData,
                            selectLists,
                        )}
                        field="BirthCity"
                        listKey="TalukaList"
                        selectLists={selectLists}
                    />

                    <DropdownField
                        label="Religion"
                        value={getDropdownValue(
                            'religion',
                            profileData,
                            selectLists,
                        )}
                        field="ReligionID"
                        listKey="ReligionList"
                        selectLists={selectLists}
                    />

                    <InputField label="Caste" value={profileData?.ReligionCast || ''} editable={false} />

                    <DropdownField
                        label="Category"
                        value={getDropdownValue(
                            'category',
                            profileData,
                            selectLists,
                        )}
                        field="CategoryCode"
                        listKey="CategoryList"
                        selectLists={selectLists}
                    />

                    <DropdownField
                        label="Minority Type"
                        value={getDropdownValue(
                            'minority',
                            profileData,
                            selectLists,
                        )}
                        field="MinorityID"
                        listKey="MinorityList"
                        selectLists={selectLists}
                    />

                    <DropdownField
                        label="Gender"
                        value={getDropdownValue(
                            'gender',
                            profileData,
                            selectLists,
                        )}
                        field="Gender"
                        listKey="GenderList"
                        selectLists={selectLists}
                    />

                    <DropdownField
                        label="Blood Group"
                        value={getDropdownValue(
                            'bloodGroup',
                            profileData,
                            selectLists,
                        )}
                        field="BloodTypeID"
                        listKey="BloodTypeList"
                        selectLists={selectLists}
                    />
                </Card.Content>
            </Card>

            {/* Other Information */}
            <Card style={profileStyles.card}>
                <Card.Content>
                    <Text style={profileStyles.sectionTitle}>
                        Other Information
                    </Text>
                    <Divider style={profileStyles.divider} />

                    <DropdownField
                        label="Is Handicap"
                        value={getDropdownValue(
                            'handicap',
                            profileData,
                            selectLists,
                        )}
                        options={[
                            { label: 'NO', value: 0 },
                            ...(selectLists?.HandiCapTypeList?.map(
                                (h: any) => ({
                                    label: h.HandicapType || 'YES',
                                    value: h.HandicapId,
                                }),
                            ) || []),
                        ]}
                        field="HandicapId"
                        additionalFields={[
                            { field: 'ISHandicap', value: (v: any) => v !== 0 },
                        ]}
                    />

                    <DropdownField
                        label="Is Sport"
                        value={getDropdownValue(
                            'sport',
                            profileData,
                            selectLists,
                        )}
                        options={[
                            { label: 'NA', value: 0 },
                            ...(selectLists?.SportsList?.map((s: any) => ({
                                label: s.SportName,
                                value: s.SportsID,
                            })) || []),
                        ]}
                        field="SportId"
                        additionalFields={[
                            { field: 'ISSport', value: (v: any) => v !== 0 },
                        ]}
                    />

                    <DropdownField
                        label="Is SP Categ"
                        value={getDropdownValue(
                            'spCategory',
                            profileData,
                            selectLists,
                        )}
                        options={[
                            { label: 'NA', value: 0 },
                            ...(selectLists?.SpecialCategoryTypeList?.map(
                                (s: any) => ({
                                    label: s.SpecialCategory,
                                    value: s.SpecialCategoryID,
                                }),
                            ) || []),
                        ]}
                        field="SpecialCategoryId"
                        additionalFields={[
                            {
                                field: 'ISSpCategory',
                                value: (v: any) => v !== 0,
                            },
                        ]}
                    />
                </Card.Content>
            </Card>

            {/* Identification Information - Same as before */}
            <Card style={profileStyles.card}>
                <Card.Content>
                    <Text style={profileStyles.sectionTitle}>
                        Identification Information
                    </Text>
                    <Divider style={profileStyles.divider} />

                    <View style={profileStyles.fieldRow}>
                        <Text style={profileStyles.fieldLabel}>
                            Student Photo
                        </Text>
                        <View style={profileStyles.photoContainer}>
                            {profileData?.PHOTO ? (
                                <Text style={profileStyles.photoText}>
                                    Photo Uploaded
                                </Text>
                            ) : (
                                <Text style={profileStyles.photoText}>
                                    No Photo
                                </Text>
                            )}
                            <Button
                                mode="outlined"
                                style={profileStyles.uploadButton}
                            >
                                Choose File
                            </Button>
                        </View>
                    </View>

                    <View style={profileStyles.fieldRow}>
                        <Text style={profileStyles.fieldLabel}>
                            Student Sign
                        </Text>
                        <View style={profileStyles.photoContainer}>
                            {profileData?.MSIGN ? (
                                <Text style={profileStyles.photoText}>
                                    Sign Uploaded
                                </Text>
                            ) : (
                                <Text style={profileStyles.photoText}>
                                    No Sign
                                </Text>
                            )}
                            <Button
                                mode="outlined"
                                style={profileStyles.uploadButton}
                            >
                                Choose File
                            </Button>
                        </View>
                    </View>
                </Card.Content>
            </Card>

            <Button
                mode="contained"
                style={[profileStyles.nextButton, { margin: 30, padding: 5 }]}
                onPress={() => onTabChange('CONTACT')}
            >
                Next
            </Button>
        </ScrollView>
    );
};

export const ContactDetailsTab = ({
    profileData,
    selectLists,
    user,
    onTabChange,
}: TabComponentsProps) => {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Card style={profileStyles.card}>
                <Card.Content>
                    <Text style={profileStyles.sectionTitle}>
                        Contact Details
                    </Text>
                    <Divider style={profileStyles.divider} />

                    <InputField label="Permanent Address" value={profileData?.PAddress || ''} multiline numberOfLines={3} />
                    <InputField label="Permanent District" value={profileData?.PDistrict || ''} />
                    <InputField label="Permanent State" value={profileData?.PState || ''} />

                    <DropdownField
                        label="Permanent Taluka"
                        value={getDropdownValue(
                            'permanentTaluka',
                            profileData,
                            selectLists,
                        )}
                        field="PTaluka"
                        listKey="TalukaList"
                        selectLists={selectLists}
                    />

                    <InputField label="Permanent Pin Code" value={profileData?.PPinCode || ''} />
                    <InputField label="Correspondence Address" value={profileData?.CAddress || ''} multiline numberOfLines={3} />
                    <InputField label="Correspondence District" value={profileData?.CDistrict || ''} />
                    <InputField label="Correspondence State" value={profileData?.CState || ''} />

                    <DropdownField
                        label="Correspondence Taluka"
                        value={getDropdownValue(
                            'correspondenceTaluka',
                            profileData,
                            selectLists,
                        )}
                        field="CTaluka"
                        listKey="TalukaList"
                        selectLists={selectLists}
                    />

                    <InputField label="Correspondence Pin Code" value={profileData?.CPinCode || ''} />
                    <InputField label="Mobile Number" value={profileData?.MobileNo || user?.MobileNo || ''} keyboardType="phone-pad" />
                    <InputField label="Phone Number" value={profileData?.PhoneNo || user?.PhoneNo || ''} keyboardType="phone-pad" />
                    <InputField label="Email 2" value={profileData?.Email2 || ''} keyboardType="email-address" />
                </Card.Content>
            </Card>

            <View style={profileStyles.buttonRow}>
                <Button
                    mode="outlined"
                    style={profileStyles.prevButton}
                    onPress={() => onTabChange('BASIC')}
                >
                    Previous
                </Button>
                <Button
                    mode="contained"
                    style={profileStyles.nextButton}
                    onPress={() => onTabChange('QUALIFICATION')}
                >
                    Next
                </Button>
            </View>
        </ScrollView>
    );
};

export const QualificationDetailsTab = ({
    profileData,
    selectLists,
    onTabChange,
}: TabComponentsProps) => {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Card style={profileStyles.card}>
                <Card.Content>
                    <Text style={profileStyles.sectionTitle}>
                        Qualification Details
                    </Text>
                    <Divider style={profileStyles.divider} />

                    <InputField label="Previous Board/University Name" value={profileData?.PrevBoardUniversityName || ''} />
                    <InputField label="Previous College Name" value={profileData?.PrevCollegeName || ''} />
                    <InputField label="Previous Seat Number" value={profileData?.PrevSeatNumber || ''} />
                    <InputField label="Previous Passing Year" value={formatDate(profileData?.PrevPassingYear)}/>
                    <InputField label="Previous Percentage" value={profileData?.PrevPercentage?.toString() || ''} keyboardType="numeric" />
                    <InputField label="Previous Marks" value={profileData?.PrevMarks?.toString() || ''} keyboardType="numeric" />
                    <InputField label="Previous Grade" value={profileData?.PrevGrade || ''} />

                    <DropdownField
                        label="Previous Section"
                        value={getDropdownValue(
                            'prevSection',
                            profileData,
                            selectLists,
                        )}
                        field="PrevSectionID"
                        listKey="PrevSectionList"
                        selectLists={selectLists}
                    />
                </Card.Content>
            </Card>

            <View style={profileStyles.buttonRow}>
                <Button
                    mode="outlined"
                    style={profileStyles.prevButton}
                    onPress={() => onTabChange('CONTACT')}
                >
                    Previous
                </Button>
                <Button
                    mode="contained"
                    style={profileStyles.nextButton}
                    onPress={() => onTabChange('DOCUMENT')}
                >
                    Next
                </Button>
            </View>
        </ScrollView>
    );
};

export const DocumentDetailsTab = ({
    profile,
    onTabChange,
}: TabComponentsProps & { profile: any }) => {
    const documents = profile?.meritRegistrationMasterDocuments || [];

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Card style={profileStyles.card}>
                <Card.Content>
                    <Text style={profileStyles.sectionTitle}>
                        Document Details
                    </Text>
                    <Divider style={profileStyles.divider} />

                    <Text style={profileStyles.noteText}>
                        Note: Attach Prev MarkSheet, Prev Year LC/TC
                        Certificate, Current Caste Certificate.
                    </Text>

                    <View style={profileStyles.fieldRow}>
                        <Text style={profileStyles.fieldLabel}>Mark Sheet</Text>
                        <View style={profileStyles.uploadSection}>
                            <Button
                                mode="outlined"
                                style={profileStyles.uploadButton}
                            >
                                Choose File
                            </Button>
                            <Text style={profileStyles.fileText}>
                                No file chosen
                            </Text>
                            <Button
                                mode="contained"
                                style={profileStyles.uploadActionButton}
                            >
                                Upload
                            </Button>
                        </View>
                    </View>

                    <View style={profileStyles.fieldRow}>
                        <Text style={profileStyles.fieldLabel}>LC/TC Cert</Text>
                        <View style={profileStyles.uploadSection}>
                            <Button
                                mode="outlined"
                                style={profileStyles.uploadButton}
                            >
                                Choose File
                            </Button>
                            <Text style={profileStyles.fileText}>
                                No file chosen
                            </Text>
                            <Button
                                mode="contained"
                                style={profileStyles.uploadActionButton}
                            >
                                Upload
                            </Button>
                        </View>
                    </View>

                    <View style={profileStyles.fieldRow}>
                        <Text style={profileStyles.fieldLabel}>
                            Caste Cert/Allotment Letter
                        </Text>
                        <View style={profileStyles.uploadSection}>
                            <Button
                                mode="outlined"
                                style={profileStyles.uploadButton}
                            >
                                Choose File
                            </Button>
                            <Text style={profileStyles.fileText}>
                                No file chosen
                            </Text>
                            <Button
                                mode="contained"
                                style={profileStyles.uploadActionButton}
                            >
                                Upload
                            </Button>
                        </View>
                    </View>

                    {documents.length > 0 && (
                        <View style={profileStyles.documentTable}>
                            <View style={profileStyles.tableHeader}>
                                <Text style={profileStyles.tableHeaderText}>
                                    Student Name
                                </Text>
                                <Text style={profileStyles.tableHeaderText}>
                                    Passing Certificate
                                </Text>
                                <Text style={profileStyles.tableHeaderText}>
                                    LC/TC Certificate
                                </Text>
                                <Text style={profileStyles.tableHeaderText}>
                                    Caste Certificate
                                </Text>
                            </View>
                            {documents.map((doc: any, index: number) => (
                                <View
                                    key={index}
                                    style={profileStyles.tableRow}
                                >
                                    <Text style={profileStyles.tableCell}>
                                        {doc.StudentName || 'N/A'}
                                    </Text>
                                    <IconButton
                                        icon="eye"
                                        size={20}
                                        iconColor="#1649b2"
                                    />
                                    <IconButton
                                        icon="eye"
                                        size={20}
                                        iconColor="#1649b2"
                                    />
                                    <IconButton
                                        icon="eye"
                                        size={20}
                                        iconColor="#1649b2"
                                    />
                                </View>
                            ))}
                        </View>
                    )}
                </Card.Content>
            </Card>

            <View style={profileStyles.buttonRow}>
                <Button
                    mode="outlined"
                    style={profileStyles.prevButton}
                    onPress={() => onTabChange('QUALIFICATION')}
                >
                    Previous
                </Button>
                <Button mode="contained" style={profileStyles.nextButton}>
                    Course Enrollment
                </Button>
            </View>
        </ScrollView>
    );
};
