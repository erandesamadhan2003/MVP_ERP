import { SelectLists } from '../../../../types/student/SelectList.types';
import { StudentProfileMaster, StudentProfileUpdateInterface } from '../../../../types/student/studentProfile.types';

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
    selectLists: SelectLists | null | undefined,
): string => {
    if (!profileData || !selectLists) return '';

    switch (fieldName) {
        case 'gender':
            return (
                selectLists.GenderList?.find(
                    g => g.Gender === profileData.Gender,
                )?.GenderName || ''
            );
        case 'bloodGroup':
            return (
                selectLists.BloodTypeList?.find(
                    b => b.BloodTypeID === profileData.BloodTypeID,
                )?.BloodGroup || ''
            );
        case 'religion':
            return (
                selectLists.ReligionList?.find(
                    r => r.ReligionID === profileData.ReligionID,
                )?.ReligionName || ''
            );
        case 'category':
            return (
                selectLists.CategoryList?.find(
                    (c: any) => c.CategoryCode === profileData.CategoryCode,
                )?.Category || ''
            );
        case 'minority':
            return (
                selectLists.MinorityList?.find(
                    m => m.MinorityID === profileData.MinorityID,
                )?.Minority || ''
            );
        case 'handicap':
            return (
                selectLists.HandiCapTypeList?.find(
                    (h: any) => h.HandicapId === profileData.HandicapId,
                )?.HandicapID?.toString() || (profileData.ISHandicap ? 'YES' : 'NO')
            );
        case 'sport':
            return (
                selectLists.SportsList?.find(
                    s => s.SportsID === profileData.SportId,
                )?.SportName || (profileData.ISSport ? 'YES' : 'NA')
            );
        case 'spCategory':
            return (
                selectLists.SpecialCategoryTypeList?.find(
                    s => s.SpecialCategoryID === profileData.SpecialCategoryId,
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
                selectLists.PrevSectionList?.find(
                    s => s.SectionID === profileData.PrevSectionID,
                )?.SectionName || ''
            );
        default:
            return '';
    }
};

export const mapProfileToUpdatePayload = (
    profileData: StudentProfileMaster
): StudentProfileUpdateInterface => {
    return {
        MeritStudentInfoID: profileData.MeritStudentInfoID,
        MeritStudentMasterID: profileData.MeritStudentMasterID?.toString() || '',
        URNNO: profileData.URNNO,
        LastName: profileData.LastName,
        FirstName: profileData.FirstName,
        FatherName: profileData.FatherName || '',
        MotherName: profileData.MotherName || '',
        GrandFatherName: profileData.GrandFatherName || '',
        UserLogin: profileData.UserLogin || '',
        PasswordHash: profileData.PasswordHash || '',
        DateOfBirth: profileData.DateOfBirth,
        BirthPlace: profileData.BirthPlace || '',
        BirthCity: profileData.BirthCity || '',
        Gender: profileData.Gender,
        BloodTypeID: profileData.BloodTypeID,
        AdharID: profileData.AdharID || '',
        ReligionID: profileData.ReligionID,
        ReligionCast: profileData.ReligionCast || '',
        CategoryCode: profileData.CategoryCode,
        MinorityID: profileData.MinorityID,
        MobileNo: profileData.MobileNo || null,
        PhoneNo: profileData.PhoneNo || null,
        Email1: profileData.Email1 || '',
        Email2: profileData.Email2 || '',
        PAddress: profileData.PAddress || '',
        PTaluka: profileData.PTaluka || '',
        PDistrict: profileData.PDistrict || '',
        PState: profileData.PState || '',
        PPinCode: profileData.PPinCode || '',
        CAddress: profileData.CAddress || null,
        CTaluka: profileData.CTaluka || null,
        CDistrict: profileData.CDistrict || null,
        CState: profileData.CState || null,
        CPinCode: profileData.CPinCode || '',
        PrevBoardUniversityName: profileData.PrevBoardUniversityName || '',
        PrevCollegeName: profileData.PrevCollegeName || '',
        PrevPassingYear: profileData.PrevPassingYear || '',
        PrevSectionID: profileData.PrevSectionID,
        PrevCourseID: profileData.PrevCourseID || 0,
        PrevClassID: profileData.PrevClassID || 0,
        PrevGrade: profileData.PrevGrade || null,
        PrevMarks: profileData.PrevMarks,
        PrevGroupSubjectMarks: profileData.PrevGroupSubjectMarks || null,
        PrevOutOfGroupSubjectMarks: profileData.PrevOutOfGroupSubjectMarks || null,
        PrevGroupSubjectPerc: profileData.PrevGroupSubjectPerc || null,
        SubjectTypeID: profileData.SubjectTypeID || null,
        PrincipalSubjectID: profileData.PrincipalSubjectID || null,
        PrevOutOfMarks: profileData.PrevOutOfMarks || null,
        PrevPercentage: profileData.PrevPercentage,
        PrevSeatNumber: profileData.PrevSeatNumber || '',
        ISSport: profileData.ISSport,
        SportId: profileData.SportId,
        ISHandicap: profileData.ISHandicap,
        HandicapId: profileData.HandicapId,
        ISSpCategory: profileData.ISSpCategory,
        SpecialCategoryId: profileData.SpecialCategoryId,
        MotherInstitute: profileData.MotherInstitute,
    };
};