import { useCallback, useEffect, useState } from 'react';
import {
    getURNDuesForPayment,
    getPaymentBankInformation,
    getStudentPaymentPreview,
    getStudentPaymentGateway,
    getExamFeePayment,
    getStudentPaymentDetails,
    getBankIAgreeFiles,
} from '../../api/services/student/payment';
import { StudentPaymentPreview } from '../../types/student/Payment.types';

/* =========================================================
   1. URN Dues For Payment
========================================================= */
export const useURNDuesForPayment = (urnNo: string) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!urnNo) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getURNDuesForPayment(urnNo);
                setData(res);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [urnNo]);

    return { data, loading, error };
};

/* =========================================================
   2. Payment Bank Information
========================================================= */
export const usePaymentBankInformation = (
    cCode: string,
    aidedTypeId: number,
    sectionId: number,
) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!cCode || !aidedTypeId || !sectionId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getPaymentBankInformation(
                    cCode,
                    aidedTypeId,
                    sectionId,
                );
                setData(res);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [cCode, aidedTypeId, sectionId]);

    return { data, loading, error };
};

/* =========================================================
   3. Student Payment Preview (POST)
========================================================= */
export const useStudentPaymentPreview = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchPreview = useCallback(
        async (payload: StudentPaymentPreview) => {
            try {
                setLoading(true);
                const res = await getStudentPaymentPreview(payload);
                setData(res);
                return res;
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [], // ✅ stable reference forever
    );

    return { data, loading, error, fetchPreview };
};

/* =========================================================
   4. Student Payment Gateway
========================================================= */
export const useStudentPaymentGateway = (
    registrationId: string,
    applicationToken: string,
) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!registrationId || !applicationToken) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getStudentPaymentGateway(
                    registrationId,
                    applicationToken,
                );
                setData(res);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [registrationId, applicationToken]);

    return { data, loading, error };
};

/* =========================================================
   5. Exam Fee Payment
========================================================= */
export const useExamFeePayment = (urnNo: string) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!urnNo) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getExamFeePayment(urnNo);
                setData(res);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [urnNo]);

    return { data, loading, error };
};

/* =========================================================
   6. Student Payment Details
========================================================= */
export const useStudentPaymentDetails = (
    userId: string,
    applicationToken: string,
) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!userId || !applicationToken) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getStudentPaymentDetails(
                    userId,
                    applicationToken,
                );
                setData(res);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, applicationToken]);

    return { data, loading, error };
};


export const useBankIAgreeFiles = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchIAgreePdf = useCallback(
        async (merchantPaymentSettingsId: number) => {
            try {
                setLoading(true);
                const res = await getBankIAgreeFiles(
                    merchantPaymentSettingsId,
                );
                return res;
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return { fetchIAgreePdf, loading, error };
};