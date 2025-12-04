export const IPIFY_API_URL = 'https://api.ipify.org/?format=json';

export const getIPAddress = async (): Promise<string | null> => {
    try {
        const response = await fetch(IPIFY_API_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch IP address: ${response.status}`);
        }
        const data = await response.json();
        return data?.ip ?? null;
    } catch (error) {
        console.error("Error fetching IP address:", error);
        return null;
    }
};  

