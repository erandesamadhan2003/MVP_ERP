import { api } from '../../api';

/* ================= MEMBER INFORMATION ================= */
export const getMemberInformation = async (payload: any) => {
  const res = await api.post('/Institute/Member/GetAllLibraryMember', payload);
  return res.data;
};

/* ================= STUDENT IDENTITY IMAGE ================= */
export const getStudentIdentityImage = async (URNNO: number) => {
  const res = await api.get(
    '/Institute/CirculationMaster/GetStudentIdentityImg',
    { params: { URNNO } },
  );
  return res.data;
};

/* ================= BOOK READING ROOM STATUS ================= */
export const getBookReadingRoomStatus = async (payload: any) => {
  const res = await api.post(
    '/Institute/BookReadingRoom/GetAllBookReadingRoomStatusList',
    payload,
  );
  return res.data;
};

/* ================= MEMBER BOOK DETAILS ================= */
export const getMemberBookDetails = async (payload: any) => {
  const res = await api.post(
    '/Institute/CirculationMaster/GetMemberBookDetails',
    payload,
  );
  return res.data;
};

/* ================= URN ADMISSION ================= */
export const getURNAdmissionDetails = async (URNNO: number | string) => {
  const res = await api.get(
    '/Institute/CirculationMaster/GetURNNOAdmission',
    { params: { URNNO } },
  );
  return res.data;
};

/* ================= URN FEE DUES ================= */
export const getURNDues = async (URNNO: number | string) => {
  const res = await api.get(
    '/Admission/Admission/GetURNDues',
    { params: { URNNO } },
  );
  return res.data;
};

/* ================= CLEARANCE CERTIFICATE ================= */
export const getMemberClearanceCertificate = async (payload: any) => {
  const res = await api.post(
    '/Institute/Member/GetMemberClearanceCertificate',
    payload,
  );
  return res.data;
};

