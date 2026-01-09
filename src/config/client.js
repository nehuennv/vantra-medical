import { Calendar, Users, TrendingUp, AlertCircle, Phone, Globe, BarChart3 } from "lucide-react";

export const clientConfig = {
    identity: {
        name: "Dr. Villavicencio",
        specialty: "Cardiología",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        greeting: "Hola",
    },
    business: {
        currency: "$",
        currencyCode: "USD",
        locale: "es-AR",
    },
    theme: {
        primary: "#0ea5e9", // Sky-500
        chartPrimary: "#0ea5e9",
        chartSecondary: "#6366f1",
    },
    mockData: {
        // SECCION 1: KPIS MACRO
        kpis: [
            {
                id: "kpi-volumen",
                title: "Volumen de Citas",
                value: "142",
                trend: "up",
                trendValue: "+12 vs mes pasado",
                icon: Calendar,
                color: "bg-blue-50 text-blue-600"
            },
            {
                id: "kpi-ausentismo",
                title: "Tasa de Ausentismo",
                value: "4.2%",
                trend: "down", // Down is good here
                trendValue: "-1.1% (Mejora)",
                inverseTrend: true, // Custom flag to indicate 'down' is green
                icon: AlertCircle,
                color: "bg-emerald-50 text-emerald-600" // Green because it's low/good
            },
            {
                id: "kpi-ingresos",
                title: "Ingresos Estimados",
                value: "2.4M",
                isCurrency: true,
                trend: "up",
                trendValue: "+15% vs objetivo",
                icon: TrendingUp,
                color: "bg-indigo-50 text-indigo-600"
            },
            {
                id: "kpi-crecimiento",
                title: "Pacientes Nuevos",
                value: "28",
                trend: "up",
                trendValue: "+5 este mes",
                icon: Users,
                color: "bg-violet-50 text-violet-600"
            },
        ],
        // SECCION 2: DESGLOSES (WIDGETS MEDIOS)
        widgets: {
            sources: [
                { name: "WhatsApp IA", value: 62, fill: "#10b981" }, // Emerald-500
                { name: "Web / Links", value: 28, fill: "#3b82f6" }, // Blue-500
                { name: "Manual / Tel", value: 10, fill: "#94a3b8" }, // Slate-400
            ],
            retention: [
                { name: "Recurrentes", value: 68, fill: "#6366f1" }, // Indigo-500
                { name: "Nuevos", value: 32, fill: "#a5b4fc" }, // Indigo-300
            ],
            demandPeaks: [
                { day: "Lun", value: 18 },
                { day: "Mar", value: 24 },
                { day: "Mié", value: 28 }, // Peak
                { day: "Jue", value: 22 },
                { day: "Vie", value: 20 },
            ]
        },
        // SECCION 3: OPERATIVA
        appointments: [
            { id: 1, time: "09:00", name: "Lucas Martínez", type: "Primera Consulta", status: "confirmed" },
            { id: 2, time: "10:30", name: "Ana Torres", type: "Control Mensual", status: "confirmed" },
            { id: 3, time: "11:15", name: "Roberto Gómez", type: "Resultados", status: "pending" },
        ],
        activityLogs: [
            { id: 1, time: "Hace 10 min", text: "Seña de $15.000 cobrada a Ana T.", type: "payment" },
            { id: 2, time: "Hace 32 min", text: "Turno confirmado por WhatsApp (Lucas M.)", type: "success" },
            { id: 3, time: "Hace 2h", text: "Recordatorios de mañana enviados (15).", type: "system" },
            { id: 4, time: "Hace 4h", text: "Paciente canceló turno (Reprogramado).", type: "warning" },
        ]
    }
};
