export const IPIFY_API_URL = 'https://api.ipify.org/?format=json';

// Fetch the public IP address with an optional timeout (ms).
// Returns an empty string on failure to make usage simpler for callers.
export const getIPAddress = async (timeoutMs = 3000): Promise<string> => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(IPIFY_API_URL, { signal: controller.signal });
        clearTimeout(id);
        if (!response.ok) {
            console.error(`Failed to fetch IP address: ${response.status}`);
            return '';
        }
        const data = await response.json();
        return data?.ip ?? '';
    } catch (error) {
        if ((error as any)?.name === 'AbortError') {
            console.error('IP fetch aborted due to timeout');
        } else {
            console.error('Error fetching IP address:', error);
        }
        return '';
    } finally {
        clearTimeout(id);
    }
};

// Validation helpers moved here so screens can reuse the same logic.
export const validateLogin = (payload: { UserName?: string; Password?: string }) => {
    const errors: Record<string, string> = {};
    const emailOrUser = (payload?.UserName || '').trim();
    const password = (payload?.Password || '').toString();

    if (!emailOrUser) {
        errors.UserName = 'Email or username is required';
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrUser) === false && emailOrUser.length < 3) {
        // allow short usernames but still require minimal length
        errors.UserName = 'Enter a valid email or username';
    }

    if (!password) {
        errors.Password = 'Password is required';
    } else if (password.length < 6) {
        errors.Password = 'Password must be at least 6 characters';
    }

    return { valid: Object.keys(errors).length === 0, errors };
};

export const validateRegister = (formData: Record<string, any>) => {
    const errors: Record<string, string> = {};
    const email = (formData?.email || '').trim();
    const password = (formData?.password || '').toString();
    const confirm = (formData?.confirmPassword || '').toString();
    const mobile = (formData?.mobileNo || '').toString().replace(/\D/g, '');
    const adhar = (formData?.adharID || '').toString().replace(/\D/g, '');

    if (!formData.userName || !formData.userName.trim()) {
        errors.userName = 'Username is required';
    }

    if (!email) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Enter a valid email';
    }

    if (!mobile) {
        errors.mobileNo = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(mobile)) {
        errors.mobileNo = 'Enter a valid 10-digit mobile number';
    }

    if (!adhar) {
        errors.adharID = 'Aadhar ID is required';
    } else if (!/^\d{12}$/.test(adhar)) {
        errors.adharID = 'Enter a valid 12-digit Aadhar ID';
    }

    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    if (!confirm) {
        errors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirm) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return { valid: Object.keys(errors).length === 0, errors };
};

export const defaultLoginPayload = () => ({
    CCode: '',
    UserName: '',
    Password: '',
    AceYear: new Date().toISOString(),
    UserAccessAddress: '',
    UserType: 12,
});


