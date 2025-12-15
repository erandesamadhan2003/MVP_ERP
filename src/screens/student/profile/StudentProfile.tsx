import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import SafeAreaWrapper from '../../../components/SafeAreaWrapper';
import {
    Text,
    Divider,
    Card,
    IconButton,
    Button,
    ActivityIndicator,
} from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { UpdateStudentProfileData } from '../../../store/slices/student/studentSlice';
import { useStudentProfile } from '../../../hooks/student/useStudentProfile';
import {
    BasicDetailsTab,
    ContactDetailsTab,
    QualificationDetailsTab,
    DocumentDetailsTab,
} from '../../../components/student/Profile/TabComponents';
import { profileStyles } from './profileStyles';
import { mapProfileToUpdatePayload } from './utils/profileHelpers';

type TabType = 'BASIC' | 'CONTACT' | 'QUALIFICATION' | 'DOCUMENT';

export default function StudentProfile({ navigation }: any) {
    const dispatch = useDispatch<AppDispatch>();
    const {
        user,
        profile,
        profileData,
        selectLists,
        isLoading,
        errorMessage,
        setErrorMessage,
        retryFetch,
    } = useStudentProfile();
    const [activeTab, setActiveTab] = useState<TabType>('BASIC');
    const [isSaving, setIsSaving] = useState(false);

    if (!user) {
        return (
            <View style={profileStyles.container}>
                <Text style={profileStyles.errorText}>
                    No user data found. Please log in again.
                </Text>
            </View>
        );
    }

    const handleSaveProfile = async () => {
        if (!profileData) {
            Alert.alert('Error', 'No profile data available to save');
            return;
        }

        try {
            setIsSaving(true);

            // Map the Redux store data to StudentProfileUpdateInterface
            const updatePayload = mapProfileToUpdatePayload(profileData);

            await dispatch(UpdateStudentProfileData(updatePayload)).unwrap();

            Alert.alert('Success', 'Profile updated successfully');
        } catch (error: any) {
            const errorMsg = error?.message || error || 'Failed to update profile';
            Alert.alert('Error', errorMsg);
        } finally {
            setIsSaving(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'BASIC':
                return (
                    <BasicDetailsTab
                        profileData={profileData}
                        selectLists={selectLists}
                        user={user}
                        onTabChange={setActiveTab}
                        activeTab={activeTab}
                    />
                );
            case 'CONTACT':
                return (
                    <ContactDetailsTab
                        profileData={profileData}
                        selectLists={selectLists}
                        user={user}
                        onTabChange={setActiveTab}
                        activeTab={activeTab}
                    />
                );
            case 'QUALIFICATION':
                return (
                    <QualificationDetailsTab
                        profileData={profileData}
                        selectLists={selectLists}
                        user={user}
                        onTabChange={setActiveTab}
                        activeTab={activeTab}
                    />
                );
            case 'DOCUMENT':
                return (
                    <DocumentDetailsTab
                        profile={profile}
                        profileData={profileData}
                        selectLists={selectLists}
                        user={user}
                        onTabChange={setActiveTab}
                        activeTab={activeTab}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaWrapper style={profileStyles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={profileStyles.container}
            >
                {/* Header with back button and Save button */}
                <View style={[profileStyles.header, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                <IconButton
                    icon="arrow-left"
                    size={24}
                    onPress={() => navigation.goBack()}
                    iconColor="#1649b2"
                />
                <Text style={profileStyles.headerTitle}>Student Profile</Text>
                <Button
                    mode="contained-tonal"
                    onPress={handleSaveProfile}
                    loading={isSaving}
                    disabled={isSaving || isLoading}
                >
                    Update
                </Button>
            </View>
        
            <Divider />

            {/* Error Message */}
            {errorMessage && (
                <Card style={[profileStyles.card, profileStyles.errorCard]}>
                    <Card.Content>
                        <Text style={profileStyles.errorText}>
                            {errorMessage}
                        </Text>
                        <Button
                            mode="contained"
                            onPress={retryFetch}
                            style={profileStyles.retryButton}
                        >
                            Retry
                        </Button>
                    </Card.Content>
                </Card>
            )}

            {/* Loading Indicator */}
            {isLoading && (
                <View style={profileStyles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1649b2" />
                    <Text style={profileStyles.loadingText}>
                        Loading profile data...
                    </Text>
                </View>
            )}

            {/* Tabs */}
            <View style={profileStyles.tabContainer}>
                <TouchableOpacity
                    style={[
                        profileStyles.tab,
                        activeTab === 'BASIC' && profileStyles.activeTab,
                    ]}
                    onPress={() => setActiveTab('BASIC')}
                >
                    <Text
                        style={[
                            profileStyles.tabText,
                            activeTab === 'BASIC' &&
                                profileStyles.activeTabText,
                        ]}
                    >
                        BASIC DETAILS
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        profileStyles.tab,
                        activeTab === 'CONTACT' && profileStyles.activeTab,
                    ]}
                    onPress={() => setActiveTab('CONTACT')}
                >
                    <Text
                        style={[
                            profileStyles.tabText,
                            activeTab === 'CONTACT' &&
                                profileStyles.activeTabText,
                        ]}
                    >
                        CONTACT DETAILS
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        profileStyles.tab,
                        activeTab === 'QUALIFICATION' &&
                            profileStyles.activeTab,
                    ]}
                    onPress={() => setActiveTab('QUALIFICATION')}
                >
                    <Text
                        style={[
                            profileStyles.tabText,
                            activeTab === 'QUALIFICATION' &&
                                profileStyles.activeTabText,
                        ]}
                    >
                        QUALIFICATION DETAILS
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        profileStyles.tab,
                        activeTab === 'DOCUMENT' && profileStyles.activeTab,
                    ]}
                    onPress={() => setActiveTab('DOCUMENT')}
                >
                    <Text
                        style={[
                            profileStyles.tabText,
                            activeTab === 'DOCUMENT' &&
                                profileStyles.activeTabText,
                        ]}
                    >
                        DOCUMENT DETAILS
                    </Text>
                </TouchableOpacity>
            </View>

            <Divider />

                {/* Tab Content */}
                <View style={profileStyles.tabContent}>{renderTabContent()}</View>
            </KeyboardAvoidingView>
        </SafeAreaWrapper>
    );
}