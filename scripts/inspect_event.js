
const apiKey = "cal_live_26c6c86167a1b5bace9d707d2e0ca48a";

async function checkEventOptions() {
    try {
        console.log("Fetching event types list again...");
        const response = await fetch(`https://api.cal.com/v1/event-types?apiKey=${apiKey}`);
        const data = await response.json();

        const targetId = 4249683;
        const match = (data.event_types || []).find(et => et.id === targetId);

        if (match) {
            console.log("FOUND EVENT TYPE:");
            console.log("ID:", match.id);
            console.log("Schedule ID:", match.scheduleId);
            console.log("Availability:", JSON.stringify(match.availability, null, 2));
        } else {
            console.log("Match not found in list.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

checkEventOptions();
