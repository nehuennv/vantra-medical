
const apiKey = "cal_live_26c6c86167a1b5bace9d707d2e0ca48a";

async function checkKey() {
    try {
        console.log("Checking API Key against /v1/event-types...");
        const response = await fetch(`https://api.cal.com/v1/event-types?apiKey=${apiKey}`);
        console.log(`Status: ${response.status} ${response.statusText}`);

        const text = await response.text();
        console.log("Body:", text);

    } catch (error) {
        console.error("Network Error:", error);
    }
}

checkKey();
