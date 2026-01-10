
const apiKey = "cal_live_26c6c86167a1b5bace9d707d2e0ca48a";
const targetSlug = "protocolo-fotos-y-cefalo";

async function findEventId() {
    try {
        const response = await fetch(`https://api.cal.com/v1/event-types?apiKey=${apiKey}`);
        const data = await response.json();
        const match = (data.event_types || []).find(et => et.slug === targetSlug);

        if (match) {
            console.log("THE_ID_IS:" + match.id);
        } else {
            console.log("NOT_FOUND");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

findEventId();
