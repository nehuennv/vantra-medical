
const apiKey = "cal_live_26c6c86167a1b5bace9d707d2e0ca48a";
const eventTypeId = "4249683"; // The ID we found

async function checkSlots() {
    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(); // +14 days

    console.log(`Checking slots for Event Type ID: ${eventTypeId}`);
    console.log(`Range: ${startDate} to ${endDate}`);

    const url = `https://api.cal.com/v1/slots?apiKey=${apiKey}&startTime=${startDate}&endTime=${endDate}&eventTypeId=${eventTypeId}`;

    try {
        const response = await fetch(url);

        console.log(`Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const text = await response.text();
            console.log("Error Body:", text);
            return;
        }

        const data = await response.json();
        console.log("Response Data Keys:", Object.keys(data));

        if (data.slots) {
            const days = Object.keys(data.slots);
            console.log(`Found slots for ${days.length} days.`);
            if (days.length > 0) {
                console.log("First day slots:", JSON.stringify(data.slots[days[0]], null, 2));
            } else {
                console.log("Slots object is empty.");
            }
        } else {
            console.log("No 'slots' key in response:", JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("Fetch error:", error);
    }
}

checkSlots();
