import { StudentProfileSelectListData } from '../../../types/student/studentProfile.types';
import { StudentProfileMaster } from '../../../types/student/studentProfile.types';

/**
 * Format date string to DD-MM-YYYY format
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD-MM-YYYY format
  } catch {
    return dateString;
  }
};

/**
 * Get display value for dropdown fields based on field name
 */
export const getDropdownValue = (
  fieldName: string,
  profileData: StudentProfileMaster | null | undefined,
  selectLists: StudentProfileSelectListData | null | undefined
): string => {
  if (!profileData || !selectLists) return '';

  switch (fieldName) {
    case 'gender':
      return selectLists.GenderList?.find((g) => g.Gender === profileData.Gender)?.GenderName || '';
    case 'bloodGroup':
      return selectLists.BloodTypeList?.find((b) => b.BloodTypeID === profileData.BloodTypeID)?.BloodGroup || '';
    case 'religion':
      return selectLists.ReligionList?.find((r) => r.ReligionID === profileData.ReligionID)?.ReligionName || '';
    case 'category':
      return selectLists.CategoryList?.find((c: any) => c.CategoryCode === profileData.CategoryCode)?.CategoryName || '';
    case 'minority':
      return selectLists.MinorityList?.find((m) => m.MinorityID === profileData.MinorityID)?.Minority || '';
    case 'handicap':
      return (
        selectLists.HandiCapTypeList?.find((h: any) => h.HandicapId === profileData.HandicapId)?.HandicapType ||
        (profileData.ISHandicap ? 'YES' : 'NO')
      );
    case 'sport':
      return (
        selectLists.SportsList?.find((s) => s.SportsID === profileData.SportId)?.SportName ||
        (profileData.ISSport ? 'YES' : 'NA')
      );
    case 'spCategory':
      return (
        selectLists.SpecialCategoryTypeList?.find(
          (s) => s.SpecialCategoryID === profileData.SpecialCategoryId
        )?.SpecialCategory || (profileData.ISSpCategory ? 'YES' : 'NA')
      );
    case 'birthTaluka':
      return profileData.BirthCity || '';
    case 'permanentTaluka':
      return profileData.PTaluka || '';
    case 'correspondenceTaluka':
      return profileData.CTaluka || '';
    case 'prevSection':
      return (
        selectLists.PrevSectionList?.find((s) => s.SectionID === profileData.PrevSectionID)?.SectionName || ''
      );
    default:
      return '';
  }
};

