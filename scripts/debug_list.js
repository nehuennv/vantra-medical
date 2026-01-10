
const apiKey = "cal_live_26c6c86167a1b5bace9d707d2e0ca48a";

async function listAll() {
    try {
        const response = await fetch(`https://api.cal.com/v1/event-types?apiKey=${apiKey}`);
        const data = await response.json();
        const types = data.event_types || [];
        console.log(`Found ${types.length} types.`);
        types.forEach(et => {
            console.log(`[${et.id}] Slug: ${et.slug} | ScheduleId: ${et.scheduleId}`);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

listAll();
