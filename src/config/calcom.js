export const calComConfig = {
    // Replace with your actual Cal.com API Key
    // You can get this from https://app.cal.com/settings/developer/api-keys
    apiKey: import.meta.env.VITE_CALCOM_API_KEY || "YOUR_API_KEY_HERE",

    // The username or event type you want to book
    // e.g., 'acme/30min' or 'dr-villavicencio/consulta-medica'
    eventTypeId: import.meta.env.VITE_CALCOM_EVENT_TYPE_ID || "123456",

    // Base URL for Cal.com API (v1 is typical, v2 is in beta)
    baseUrl: "https://api.cal.com/v1"
};
