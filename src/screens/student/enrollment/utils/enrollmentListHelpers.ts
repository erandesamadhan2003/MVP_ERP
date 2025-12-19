import { Platform, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import { PrintStudentMeritFormPayload } from '../../../../types/student/Enrollment.types';
import { PermissionsAndroid } from 'react-native';

export const openPdfFromBlob = async (base64String: string): Promise<void> => {
  try {
    // Remove data URI prefix if present
    const base64Data = base64String.includes(',') 
      ? base64String.split(',')[1] 
      : base64String;

    const timestamp = Date.now();
    const fileName = `MeritForm_${timestamp}.pdf`;
    
    // Save to Downloads folder
    const filePath =
      Platform.OS === 'android'
        ? `${RNFS.DownloadDirectoryPath}/${fileName}`
        : `${RNFS.DocumentDirectoryPath}/${fileName}`;

    // Write the PDF file
    await RNFS.writeFile(filePath, base64Data, 'base64');

    console.log('PDF saved successfully to:', filePath);

    // Show success message with file location
    Alert.alert(
      '✅ PDF Saved!',
      Platform.OS === 'android'
        ? `Your merit form has been saved to:\n\nDownloads/${fileName}\n\nYou can find it in your Files app.`
        : `Your merit form has been saved successfully.\n\nLocation: ${filePath}`,
      [{ text: 'OK', style: 'default' }]
    );

  } catch (error: any) {
    console.error('Error saving PDF:', error);
    Alert.alert(
      '❌ Error',
      `Failed to save PDF: ${error?.message || 'Unknown error'}`,
      [{ text: 'OK', style: 'cancel' }]
    );
    throw error;
  }
};

// Build the payload for PrintStudentMeritForm from an enrollment row
export const buildPrintPayload = (enrollment: any): PrintStudentMeritFormPayload => ({
  MeritEnrollMentID: enrollment.MeritEnrollMentID,
  MeritStudentInfoID: enrollment.MeritStudentInfoID,
  EnrollMentNo: enrollment.EnrollMentNo,
  URNNO: enrollment.URNNO,
  SectionID: enrollment.SectionID,
  CourseID: enrollment.CourseID,
  ClassID: enrollment.ClassID,
  InstituteName: enrollment.InstituteName,
  SectionName: enrollment.SectionName,
  ClassName: enrollment.ClassName,
});

export const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'This app needs access to your storage to save PDF files',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  }
  return true; // iOS doesn't need this permission
};