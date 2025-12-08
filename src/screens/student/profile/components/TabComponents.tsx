import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Divider, Card, Button, TextInput, IconButton } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store/store';
import { updateMasterField } from '../../../../store/slices/student/studentSlice';
import { DropdownField } from './DropdownField';
import { formatDate, getDropdownValue } from '../utils/profileHelpers';
import { profileStyles } from '../profileStyles';
import { StudentProfileMaster } from '../../../../types/student/studentProfile.types';
import { StudentProfileSelectListData } from '../../../../types/student/studentProfile.types';

interface TabComponentsProps {
  profileData: StudentProfileMaster | null | undefined;
  selectLists: StudentProfileSelectListData | null | undefined;
  user: any;
  onTabChange: (tab: 'BASIC' | 'CONTACT' | 'QUALIFICATION' | 'DOCUMENT') => void;
  activeTab: 'BASIC' | 'CONTACT' | 'QUALIFICATION' | 'DOCUMENT';
}

export const BasicDetailsTab = ({ profileData, selectLists, user, onTabChange }: TabComponentsProps) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Existing Student - URN NO */}
      <Card style={profileStyles.card}>
        <Card.Content>
          <Text style={profileStyles.sectionTitle}>Existing Student?</Text>
          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>URN NO.</Text>
            <TextInput
              mode="outlined"
              value={profileData?.URNNO?.toString() || user?.URNNO?.toString() || ''}
              editable={false}
              style={profileStyles.input}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Personal Information */}
      <Card style={profileStyles.card}>
        <Card.Content>
          <Text style={profileStyles.sectionTitle}>Personal Information</Text>
          <Divider style={profileStyles.divider} />

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>User Email</Text>
            <TextInput
              mode="outlined"
              value={profileData?.Email1 || user?.Email || ''}
              editable={false}
              style={[profileStyles.input, profileStyles.disabledInput]}
            />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Password</Text>
            <TextInput
              mode="outlined"
              value="********"
              secureTextEntry
              editable={false}
              style={[profileStyles.input, profileStyles.disabledInput]}
            />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Conf Password</Text>
            <TextInput
              mode="outlined"
              value="********"
              secureTextEntry
              editable={false}
              style={[profileStyles.input, profileStyles.disabledInput]}
            />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Last Name</Text>
            <TextInput mode="outlined" value={profileData?.LastName || ''} style={profileStyles.input} />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>First Name</Text>
            <TextInput mode="outlined" value={profileData?.FirstName || ''} style={profileStyles.input} />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Father Name</Text>
            <TextInput mode="outlined" value={profileData?.FatherName || ''} style={profileStyles.input} />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Mother Name</Text>
            <TextInput mode="outlined" value={profileData?.MotherName || ''} style={profileStyles.input} />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Grand Father</Text>
            <TextInput
              mode="outlined"
              value={profileData?.GrandFatherName || ''}
              style={profileStyles.input}
            />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Aadhar No.</Text>
            <TextInput
              mode="outlined"
              value={profileData?.AdharID || ''}
              editable={false}
              style={[profileStyles.input, profileStyles.disabledInput]}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Basic Information */}
      <Card style={profileStyles.card}>
        <Card.Content>
          <Text style={profileStyles.sectionTitle}>Basic Information</Text>
          <Divider style={profileStyles.divider} />

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Birth Date</Text>
            <TextInput
              mode="outlined"
              value={formatDate(profileData?.DateOfBirth)}
              style={[profileStyles.input, profileStyles.disabledInput]}
              right={<TextInput.Icon icon="calendar" />}
              editable={false}
            />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Birth Place</Text>
            <TextInput
              mode="outlined"
              value={profileData?.BirthPlace || ''}
              style={[profileStyles.input, profileStyles.disabledInput]}
              editable={false}
            />
          </View>

          <DropdownField
            label="Birth Taluka"
            value={getDropdownValue('birthTaluka', profileData, selectLists)}
            options={selectLists?.TalukaList?.map((t) => ({ label: t.Taluka, value: t.Taluka })) || []}
            onSelect={(value) => {
              dispatch(updateMasterField({ field: 'BirthCity', value }));
            }}
          />

          <DropdownField
            label="Religion"
            value={getDropdownValue('religion', profileData, selectLists)}
            options={
              selectLists?.ReligionList?.filter((r) => r.ReligionName)?.map((r) => ({
                label: r.ReligionName,
                value: r.ReligionID,
              })) || []
            }
            onSelect={(value) => {
              dispatch(updateMasterField({ field: 'ReligionID', value }));
            }}
          />

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Caste</Text>
            <TextInput
              mode="outlined"
              value={profileData?.ReligionCast || ''}
              style={[profileStyles.input, profileStyles.disabledInput]}
              editable={false}
            />
          </View>

          <DropdownField
            label="Category"
            value={getDropdownValue('category', profileData, selectLists)}
            options={
              selectLists?.CategoryList?.filter((c: any) => c.CategoryName)?.map((c: any) => ({
                label: c.CategoryName,
                value: c.CategoryCode,
              })) || []
            }
            onSelect={(value) => {
              dispatch(updateMasterField({ field: 'CategoryCode', value }));
            }}
          />

          <DropdownField
            label="Minority Type"
            value={getDropdownValue('minority', profileData, selectLists)}
            options={selectLists?.MinorityList?.map((m) => ({ label: m.Minority, value: m.MinorityID })) || []}
            onSelect={(value) => {
              dispatch(updateMasterField({ field: 'MinorityID', value }));
            }}
          />

          <DropdownField
            label="Gender"
            value={getDropdownValue('gender', profileData, selectLists)}
            options={selectLists?.GenderList?.map((g) => ({ label: g.GenderName, value: g.Gender })) || []}
            onSelect={(value) => {
              dispatch(updateMasterField({ field: 'Gender', value }));
            }}
          />

          <DropdownField
            label="Blood Group"
            value={getDropdownValue('bloodGroup', profileData, selectLists)}
            options={selectLists?.BloodTypeList?.map((b) => ({ label: b.BloodGroup, value: b.BloodTypeID })) || []}
            onSelect={(value) => {
              dispatch(updateMasterField({ field: 'BloodTypeID', value }));
            }}
          />
        </Card.Content>
      </Card>

      {/* Other Information */}
      <Card style={profileStyles.card}>
        <Card.Content>
          <Text style={profileStyles.sectionTitle}>Other Information</Text>
          <Divider style={profileStyles.divider} />

          <DropdownField
            label="Is Handicap"
            value={getDropdownValue('handicap', profileData, selectLists)}
            options={[
              { label: 'NO', value: 0 },
              ...(selectLists?.HandiCapTypeList?.map((h: any) => ({
                label: h.HandicapType || 'YES',
                value: h.HandicapId,
              })) || []),
            ]}
            onSelect={(value) => {
              dispatch(updateMasterField({ field: 'HandicapId', value }));
              dispatch(updateMasterField({ field: 'ISHandicap', value: value !== 0 }));
            }}
          />

          <DropdownField
            label="Is Sport"
            value={getDropdownValue('sport', profileData, selectLists)}
            options={[
              { label: 'NA', value: 0 },
              ...(selectLists?.SportsList?.map((s) => ({ label: s.SportName, value: s.SportsID })) || []),
            ]}
            onSelect={(value) => {
              dispatch(updateMasterField({ field: 'SportId', value }));
              dispatch(updateMasterField({ field: 'ISSport', value: value !== 0 }));
            }}
          />

          <DropdownField
            label="Is SP Categ"
            value={getDropdownValue('spCategory', profileData, selectLists)}
            options={[
              { label: 'NA', value: 0 },
              ...(selectLists?.SpecialCategoryTypeList?.map((s) => ({
                label: s.SpecialCategory,
                value: s.SpecialCategoryID,
              })) || []),
            ]}
            onSelect={(value) => {
              dispatch(updateMasterField({ field: 'SpecialCategoryId', value }));
              dispatch(updateMasterField({ field: 'ISSpCategory', value: value !== 0 }));
            }}
          />
        </Card.Content>
      </Card>

      {/* Identification Information */}
      <Card style={profileStyles.card}>
        <Card.Content>
          <Text style={profileStyles.sectionTitle}>Identification Information</Text>
          <Divider style={profileStyles.divider} />

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Student Photo</Text>
            <View style={profileStyles.photoContainer}>
              {profileData?.PHOTO ? (
                <Text style={profileStyles.photoText}>Photo Uploaded</Text>
              ) : (
                <Text style={profileStyles.photoText}>No Photo</Text>
              )}
              <Button mode="outlined" style={profileStyles.uploadButton}>
                Choose File
              </Button>
            </View>
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Student Sign</Text>
            <View style={profileStyles.photoContainer}>
              {profileData?.MSIGN ? (
                <Text style={profileStyles.photoText}>Sign Uploaded</Text>
              ) : (
                <Text style={profileStyles.photoText}>No Sign</Text>
              )}
              <Button mode="outlined" style={profileStyles.uploadButton}>
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

export const ContactDetailsTab = ({ profileData, selectLists, user, onTabChange }: TabComponentsProps) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card style={profileStyles.card}>
        <Card.Content>
          <Text style={profileStyles.sectionTitle}>Contact Details</Text>
          <Divider style={profileStyles.divider} />

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Permanent Address</Text>
            <TextInput
              mode="outlined"
              value={profileData?.PAddress || ''}
              multiline
              numberOfLines={3}
              style={profileStyles.input}
            />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Permanent District</Text>
            <TextInput mode="outlined" value={profileData?.PDistrict || ''} style={profileStyles.input} />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Permanent State</Text>
            <TextInput mode="outlined" value={profileData?.PState || ''} style={profileStyles.input} />
          </View>

          <DropdownField
            label="Permanent Taluka"
            value={getDropdownValue('permanentTaluka', profileData, selectLists)}
            options={selectLists?.TalukaList?.map((t) => ({ label: t.Taluka, value: t.Taluka })) || []}
            onSelect={(value) => {
              dispatch(updateMasterField({ field: 'PTaluka', value }));
            }}
          />

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Permanent Pin Code</Text>
            <TextInput mode="outlined" value={profileData?.PPinCode || ''} style={profileStyles.input} />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Correspondence Address</Text>
            <TextInput
              mode="outlined"
              value={profileData?.CAddress || ''}
              multiline
              numberOfLines={3}
              style={profileStyles.input}
            />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Correspondence District</Text>
            <TextInput mode="outlined" value={profileData?.CDistrict || ''} style={profileStyles.input} />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Correspondence State</Text>
            <TextInput mode="outlined" value={profileData?.CState || ''} style={profileStyles.input} />
          </View>

          <DropdownField
            label="Correspondence Taluka"
            value={getDropdownValue('correspondenceTaluka', profileData, selectLists)}
            options={selectLists?.TalukaList?.map((t) => ({ label: t.Taluka, value: t.Taluka })) || []}
            onSelect={(value) => {
              dispatch(updateMasterField({ field: 'CTaluka', value }));
            }}
          />

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Correspondence Pin Code</Text>
            <TextInput mode="outlined" value={profileData?.CPinCode || ''} style={profileStyles.input} />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Mobile Number</Text>
            <TextInput
              mode="outlined"
              value={profileData?.MobileNo || user?.MobileNo || ''}
              style={profileStyles.input}
              keyboardType="phone-pad"
            />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Phone Number</Text>
            <TextInput
              mode="outlined"
              value={profileData?.PhoneNo || user?.PhoneNo || ''}
              style={profileStyles.input}
              keyboardType="phone-pad"
            />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Email 2</Text>
            <TextInput
              mode="outlined"
              value={profileData?.Email2 || ''}
              style={profileStyles.input}
              keyboardType="email-address"
            />
          </View>
        </Card.Content>
      </Card>

      <View style={profileStyles.buttonRow}>
        <Button mode="outlined" style={profileStyles.prevButton} onPress={() => onTabChange('BASIC')}>
          Previous
        </Button>
        <Button mode="contained" style={profileStyles.nextButton} onPress={() => onTabChange('QUALIFICATION')}>
          Next
        </Button>
      </View>
    </ScrollView>
  );
};

export const QualificationDetailsTab = ({ profileData, selectLists, onTabChange }: TabComponentsProps) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card style={profileStyles.card}>
        <Card.Content>
          <Text style={profileStyles.sectionTitle}>Qualification Details</Text>
          <Divider style={profileStyles.divider} />

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Previous Board/University Name</Text>
            <TextInput
              mode="outlined"
              value={profileData?.PrevBoardUniversityName || ''}
              style={profileStyles.input}
            />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Previous College Name</Text>
            <TextInput
              mode="outlined"
              value={profileData?.PrevCollegeName || ''}
              style={profileStyles.input}
            />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Previous Seat Number</Text>
            <TextInput mode="outlined" value={profileData?.PrevSeatNumber || ''} style={profileStyles.input} />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Previous Passing Year</Text>
            <TextInput
              mode="outlined"
              value={formatDate(profileData?.PrevPassingYear)}
              style={profileStyles.input}
            />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Previous Percentage</Text>
            <TextInput
              mode="outlined"
              value={profileData?.PrevPercentage?.toString() || ''}
              style={profileStyles.input}
              keyboardType="numeric"
            />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Previous Marks</Text>
            <TextInput
              mode="outlined"
              value={profileData?.PrevMarks?.toString() || ''}
              style={profileStyles.input}
              keyboardType="numeric"
            />
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Previous Grade</Text>
            <TextInput mode="outlined" value={profileData?.PrevGrade || ''} style={profileStyles.input} />
          </View>

          <DropdownField
            label="Previous Section"
            value={getDropdownValue('prevSection', profileData, selectLists)}
            options={selectLists?.PrevSectionList?.map((s) => ({ label: s.SectionName, value: s.SectionID })) || []}
            onSelect={(value) => {
              dispatch(updateMasterField({ field: 'PrevSectionID', value }));
            }}
          />
        </Card.Content>
      </Card>

      <View style={profileStyles.buttonRow}>
        <Button mode="outlined" style={profileStyles.prevButton} onPress={() => onTabChange('CONTACT')}>
          Previous
        </Button>
        <Button mode="contained" style={profileStyles.nextButton} onPress={() => onTabChange('DOCUMENT')}>
          Next
        </Button>
      </View>
    </ScrollView>
  );
};

export const DocumentDetailsTab = ({ profile, onTabChange }: TabComponentsProps & { profile: any }) => {
  const documents = profile?.meritRegistrationMasterDocuments || [];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card style={profileStyles.card}>
        <Card.Content>
          <Text style={profileStyles.sectionTitle}>Document Details</Text>
          <Divider style={profileStyles.divider} />

          <Text style={profileStyles.noteText}>
            Note: Attach Prev MarkSheet, Prev Year LC/TC Certificate, Current Caste Certificate.
          </Text>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Mark Sheet</Text>
            <View style={profileStyles.uploadSection}>
              <Button mode="outlined" style={profileStyles.uploadButton}>
                Choose File
              </Button>
              <Text style={profileStyles.fileText}>No file chosen</Text>
              <Button mode="contained" style={profileStyles.uploadActionButton}>
                Upload
              </Button>
            </View>
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>LC/TC Cert</Text>
            <View style={profileStyles.uploadSection}>
              <Button mode="outlined" style={profileStyles.uploadButton}>
                Choose File
              </Button>
              <Text style={profileStyles.fileText}>No file chosen</Text>
              <Button mode="contained" style={profileStyles.uploadActionButton}>
                Upload
              </Button>
            </View>
          </View>

          <View style={profileStyles.fieldRow}>
            <Text style={profileStyles.fieldLabel}>Caste Cert/Allotment Letter</Text>
            <View style={profileStyles.uploadSection}>
              <Button mode="outlined" style={profileStyles.uploadButton}>
                Choose File
              </Button>
              <Text style={profileStyles.fileText}>No file chosen</Text>
              <Button mode="contained" style={profileStyles.uploadActionButton}>
                Upload
              </Button>
            </View>
          </View>

          {documents.length > 0 && (
            <View style={profileStyles.documentTable}>
              <View style={profileStyles.tableHeader}>
                <Text style={profileStyles.tableHeaderText}>Student Name</Text>
                <Text style={profileStyles.tableHeaderText}>Passing Certificate</Text>
                <Text style={profileStyles.tableHeaderText}>LC/TC Certificate</Text>
                <Text style={profileStyles.tableHeaderText}>Caste Certificate</Text>
              </View>
              {documents.map((doc: any, index: number) => (
                <View key={index} style={profileStyles.tableRow}>
                  <Text style={profileStyles.tableCell}>{doc.StudentName || 'N/A'}</Text>
                  <IconButton icon="eye" size={20} iconColor="#1649b2" />
                  <IconButton icon="eye" size={20} iconColor="#1649b2" />
                  <IconButton icon="eye" size={20} iconColor="#1649b2" />
                </View>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>

      <View style={profileStyles.buttonRow}>
        <Button mode="outlined" style={profileStyles.prevButton} onPress={() => onTabChange('QUALIFICATION')}>
          Previous
        </Button>
        <Button mode="contained" style={profileStyles.nextButton}>
          Course Enrollment
        </Button>
      </View>
    </ScrollView>
  );
};

