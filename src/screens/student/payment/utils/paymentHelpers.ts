import { StudentPaymentPreview } from '../../../../types/student/Payment.types';

export const buildPaymentPreviewPayload = (dues: any): StudentPaymentPreview => ({
    AceYear: dues.AceYear,
    AidedTypeId: dues.AidedTypeID,
    AidedTypes: dues.AidedTypes,
    CCode: dues.CCODE,
    ClassID: dues.ClassID,
    ClassName: dues.ClassName,
    Concession: dues.Concession,
    Email1: '',
    EnrollMentDate: dues.TDATE,
    EnrollMentNo: '',
    FatherName: '',
    FeeType: dues.FeeType,
    FirstName: dues.TName,
    Gender: dues.Gender,
    LastName: '',
    MobileNo: dues.CONTACT,
    PaidFee: dues.PaidFee,
    PaymentDate: new Date().toISOString(),
    SectionID: dues.SectionID,
    TOTAL: dues.Fees,
    URNNO: dues.URNNO,
});

type SummaryRow = [label: string, value: string | number];
type FeeRow = [label: string, value: string, highlight?: boolean];

export const getDuesSummaryRows = (dues: any): SummaryRow[] => [
    ['Student', dues.TName],
    ['URN', dues.URNNO],
    ['Class', dues.ClassName],
    ['Academic Year', dues.AceYear],
    ['Aided Type', dues.AidedTypes],
    ['Concession', dues.Concession],
    ['Fee Type', dues.FeeType],
];

export const getFeeRows = (dues: any): FeeRow[] => [
    ['Total Fee', `₹ ${dues.Fees}`],
    ['Paid', `₹ ${dues.PaidFee}`],
    ['Payable', `₹ ${dues.Dues}`, true],
];
