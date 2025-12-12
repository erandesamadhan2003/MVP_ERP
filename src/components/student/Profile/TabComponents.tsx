import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import {
    Text,
    Divider,
    Card,
    Button,
    IconButton,
} from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { DropdownField } from '../../common/DropdownField';
import {
    formatDate,
    getDropdownValue,
} from '../../../screens/student/profile/utils/profileHelpers';
import { profileStyles } from '../../../screens/student/profile/profileStyles';
import { StudentProfileMaster, UploadFileType } from '../../../types/student/studentProfile.types';
import { SelectLists } from '../../../types/student/SelectList.types';
import { InputField } from '../../common/InputField';
import {
    UploadStudentPhoto,
    UploadStudentSign,
    UploadPassCertificate,
    UploadLCTCCertificate,
    UploadCasteCertificate,
    FetchStudentDocuments,
} from '../../../store/slices/student/studentSlice';
import { useImagePicker } from '../../../hooks/documentUpload/useImagePicker';
import { useDocumentPicker } from '../../../hooks/documentUpload/useDocumentPicker';
import { useUploader } from '../../../hooks/documentUpload/useUploader';
import { ImageUploadCard } from './ImageUploadCard';
import { DocumentUploadCard } from './DocumentUploadCard';

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
    const dispatch = useDispatch<AppDispatch>();
    const { pickImage } = useImagePicker();
    const { uploadFile } = useUploader();

    const [photoFile, setPhotoFile] = useState<UploadFileType | null>(null);
    const [signFile, setSignFile] = useState<UploadFileType | null>(null);
    const [photoUploading, setPhotoUploading] = useState(false);
    const [signUploading, setSignUploading] = useState(false);

    const choosePhoto = async () => {
        try {
            const image = await pickImage();
            if (image) setPhotoFile(image);
        } catch (err: any) {
            Alert.alert('Error', err?.toString() || 'Failed to pick photo');
        }
    };

    const chooseSign = async () => {
        try {
            const image = await pickImage();
            if (image) setSignFile(image);
        } catch (err: any) {
            Alert.alert('Error', err?.toString() || 'Failed to pick signature');
        }
    };

    const uploadPhoto = async () => {
        if (!photoFile || !user) {
            Alert.alert('Error', 'Please select a photo first');
            return;
        }

        try {
            setPhotoUploading(true);
            await uploadFile({
                thunk: UploadStudentPhoto,
                file: photoFile,
                profileData,
                user,
            });

            Alert.alert('Success', 'Photo uploaded successfully');
            setPhotoFile(null);
        } catch (error: any) {
            Alert.alert('Error', error ? String(error) : 'Failed to upload photo');
        } finally {
            setPhotoUploading(false);
        }
    };

    const uploadSign = async () => {
        if (!signFile || !user) {
            Alert.alert('Error', 'Please select a signature first');
            return;
        }

        try {
            setSignUploading(true);
            await uploadFile({
                thunk: UploadStudentSign,
                file: signFile,
                profileData,
                user,
            });

            Alert.alert('Success', 'Signature uploaded successfully');
            setSignFile(null);
        } catch (error: any) {
            Alert.alert('Error', error ? String(error) : 'Failed to upload signature');
        } finally {
            setSignUploading(false);
        }
    };

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
                        value={profileData?.URNNO?.toString() || user?.URNNO?.toString() || ''} 
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
                    <InputField label="Last Name" value={profileData?.LastName || ''} field="LastName" />
                    <InputField label="First Name" value={profileData?.FirstName || ''} field="FirstName" />
                    <InputField label="Father Name" value={profileData?.FatherName || ''} field="FatherName" />
                    <InputField label="Mother Name" value={profileData?.MotherName || ''} field="MotherName" />
                    <InputField label="Grand Father" value={profileData?.GrandFatherName || ''} field="GrandFatherName" />
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
                    <InputField label="Birth Place" value={profileData?.BirthPlace || ''} field="BirthPlace" />

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

                    <InputField label="Caste" value={profileData?.ReligionCast || ''} field="ReligionCast" />

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

            {/* Identification Information */}
            <Card style={profileStyles.card}>
                <Card.Content>
                    <Text style={profileStyles.sectionTitle}>
                        Identification Information
                    </Text>
                    <Divider style={profileStyles.divider} />

                    <ImageUploadCard
                        title="Student Photo"
                        file={photoFile}
                        uploaded={!!profileData?.PHOTO}
                        onChoose={choosePhoto}
                        onUpload={uploadPhoto}
                        uploading={photoUploading}
                    />

                    <ImageUploadCard
                        title="Student Sign"
                        file={signFile}
                        uploaded={!!profileData?.MSIGN}
                        onChoose={chooseSign}
                        onUpload={uploadSign}
                        uploading={signUploading}
                    />
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

                    <InputField label="Permanent Address" value={profileData?.PAddress || ''} multiline numberOfLines={3} field="PAddress" />
                    <InputField label="Permanent District" value={profileData?.PDistrict || ''} field="PDistrict" />
                    <InputField label="Permanent State" value={profileData?.PState || ''} field="PState" />

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

                    <InputField label="Permanent Pin Code" value={profileData?.PPinCode || ''} field="PPinCode" />
                    <InputField label="Correspondence Address" value={profileData?.CAddress || ''} multiline numberOfLines={3} field="CAddress" />
                    <InputField label="Correspondence District" value={profileData?.CDistrict || ''} field="CDistrict" />
                    <InputField label="Correspondence State" value={profileData?.CState || ''} field="CState" />

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

                    <InputField label="Correspondence Pin Code" value={profileData?.CPinCode || ''} field="CPinCode" />
                    <InputField label="Mobile Number" value={profileData?.MobileNo || user?.MobileNo || ''} keyboardType="phone-pad" field="MobileNo" />
                    <InputField label="Phone Number" value={profileData?.PhoneNo || user?.PhoneNo || ''} keyboardType="phone-pad" field="PhoneNo" />
                    <InputField label="Email 2" value={profileData?.Email2 || ''} keyboardType="email-address" field="Email2" />
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

                    <InputField label="Previous Board/University Name" value={profileData?.PrevBoardUniversityName || ''} field="PrevBoardUniversityName" />
                    <InputField label="Previous College Name" value={profileData?.PrevCollegeName || ''} field="PrevCollegeName" />
                    <InputField label="Previous Seat Number" value={profileData?.PrevSeatNumber || ''} field="PrevSeatNumber" />
                    <InputField label="Previous Passing Year" value={formatDate(profileData?.PrevPassingYear)} editable={false} />
                    <InputField label="Previous Percentage" value={profileData?.PrevPercentage?.toString() || ''} keyboardType="numeric" field="PrevPercentage" />
                    <InputField label="Previous Marks" value={profileData?.PrevMarks?.toString() || ''} keyboardType="numeric" field="PrevMarks" />
                    <InputField label="Previous Grade" value={profileData?.PrevGrade || ''} field="PrevGrade" />

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
    profileData,
    user,
    onTabChange,
}: TabComponentsProps & { profile: any }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { pickDocument } = useDocumentPicker();
    const { uploadFile } = useUploader();
    const documents = profile?.meritRegistrationMasterDocuments || [];

    const [marksheetFile, setMarksheetFile] = useState<UploadFileType | null>(null);
    const [lctcFile, setLctcFile] = useState<UploadFileType | null>(null);
    const [casteFile, setCasteFile] = useState<UploadFileType | null>(null);
    
    const [marksheetUploading, setMarksheetUploading] = useState(false);
    const [lctcUploading, setLctcUploading] = useState(false);
    const [casteUploading, setCasteUploading] = useState(false);

    const chooseDocument = async (type: 'marksheet' | 'lctc' | 'caste') => {
        try {
            const file = await pickDocument();
            if (!file) return;

            switch (type) {
                case 'marksheet':
                    setMarksheetFile(file);
                    break;
                case 'lctc':
                    setLctcFile(file);
                    break;
                case 'caste':
                    setCasteFile(file);
                    break;
            }
        } catch (err: any) {
            Alert.alert('Error', err?.toString() || 'Failed to pick document');
        }
    };

    const uploadDocument = async (type: 'marksheet' | 'lctc' | 'caste') => {
        let file = null;
        let setUploading: any = null;
        let uploadAction: any = null;

        switch (type) {
            case 'marksheet':
                file = marksheetFile;
                setUploading = setMarksheetUploading;
                uploadAction = UploadPassCertificate;
                break;
            case 'lctc':
                file = lctcFile;
                setUploading = setLctcUploading;
                uploadAction = UploadLCTCCertificate;
                break;
            case 'caste':
                file = casteFile;
                setUploading = setCasteUploading;
                uploadAction = UploadCasteCertificate;
                break;
        }

        if (!file || !user) {
            Alert.alert('Error', 'Please select a file first');
            return;
        }

        try {
            setUploading(true);
            await uploadFile({
                thunk: uploadAction,
                file,
                profileData,
                user,
                isCaste: type === 'caste',
            });

            // Fetch updated documents
            await dispatch(FetchStudentDocuments(user.UserID)).unwrap();

            Alert.alert('Success', `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`);
            
            // Clear the selected file
            switch (type) {
                case 'marksheet':
                    setMarksheetFile(null);
                    break;
                case 'lctc':
                    setLctcFile(null);
                    break;
                case 'caste':
                    setCasteFile(null);
                    break;
            }
        } catch (error: any) {
            Alert.alert('Error', error ? String(error) : `Failed to upload ${type}`);
        } finally {
            setUploading(false);
        }
    };

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

                    <DocumentUploadCard
                        label="Mark Sheet"
                        file={marksheetFile}
                        onChoose={() => chooseDocument('marksheet')}
                        onUpload={() => uploadDocument('marksheet')}
                        uploading={marksheetUploading}
                    />

                    <DocumentUploadCard
                        label="LC/TC Cert"
                        file={lctcFile}
                        onChoose={() => chooseDocument('lctc')}
                        onUpload={() => uploadDocument('lctc')}
                        uploading={lctcUploading}
                    />

                    <DocumentUploadCard
                        label="Caste Cert/Allotment Letter"
                        file={casteFile}
                        onChoose={() => chooseDocument('caste')}
                        onUpload={() => uploadDocument('caste')}
                        uploading={casteUploading}
                    />

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