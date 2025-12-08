import React, { useState } from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Divider, Card, IconButton, Button, ActivityIndicator } from 'react-native-paper';
import { useStudentProfile } from './hooks/useStudentProfile';
import {
  BasicDetailsTab,
  ContactDetailsTab,
  QualificationDetailsTab,
  DocumentDetailsTab,
} from './components/TabComponents';
import { profileStyles } from './profileStyles';

type TabType = 'BASIC' | 'CONTACT' | 'QUALIFICATION' | 'DOCUMENT';

export default function StudentProfile({ navigation }: any) {
  const { user, profile, profileData, selectLists, isLoading, errorMessage, setErrorMessage, retryFetch } =
    useStudentProfile();
  const [activeTab, setActiveTab] = useState<TabType>('BASIC');

  if (!user) {
    return (
      <View style={profileStyles.container}>
        <Text style={profileStyles.errorText}>No user data found. Please log in again.</Text>
      </View>
    );
  }

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={profileStyles.container}
    >
      {/* Header with back button */}
      <View style={profileStyles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} iconColor="#1649b2" />
        <Text style={profileStyles.headerTitle}>Student Profile</Text>
      </View>

      <Divider />

      {/* Error Message */}
      {errorMessage && (
        <Card style={[profileStyles.card, profileStyles.errorCard]}>
          <Card.Content>
            <Text style={profileStyles.errorText}>{errorMessage}</Text>
            <Button mode="contained" onPress={retryFetch} style={profileStyles.retryButton}>
              Retry
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <View style={profileStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#1649b2" />
          <Text style={profileStyles.loadingText}>Loading profile data...</Text>
        </View>
      )}

      {/* Tabs */}
      <View style={profileStyles.tabContainer}>
        <TouchableOpacity
          style={[profileStyles.tab, activeTab === 'BASIC' && profileStyles.activeTab]}
          onPress={() => setActiveTab('BASIC')}
        >
          <Text style={[profileStyles.tabText, activeTab === 'BASIC' && profileStyles.activeTabText]}>
            BASIC DETAILS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[profileStyles.tab, activeTab === 'CONTACT' && profileStyles.activeTab]}
          onPress={() => setActiveTab('CONTACT')}
        >
          <Text style={[profileStyles.tabText, activeTab === 'CONTACT' && profileStyles.activeTabText]}>
            CONTACT DETAILS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[profileStyles.tab, activeTab === 'QUALIFICATION' && profileStyles.activeTab]}
          onPress={() => setActiveTab('QUALIFICATION')}
        >
          <Text
            style={[profileStyles.tabText, activeTab === 'QUALIFICATION' && profileStyles.activeTabText]}
          >
            QUALIFICATION DETAILS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[profileStyles.tab, activeTab === 'DOCUMENT' && profileStyles.activeTab]}
          onPress={() => setActiveTab('DOCUMENT')}
        >
          <Text style={[profileStyles.tabText, activeTab === 'DOCUMENT' && profileStyles.activeTabText]}>
            DOCUMENT DETAILS
          </Text>
        </TouchableOpacity>
      </View>

      <Divider />

      {/* Tab Content */}
      <View style={profileStyles.tabContent}>{renderTabContent()}</View>
    </KeyboardAvoidingView>
  );
}

