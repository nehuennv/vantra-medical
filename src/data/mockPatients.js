export const mockPatients = [
    {
        id: "p-101",
        name: "Carlos Alberto Rodriguez",
        dni: "24.558.963",
        birthDate: "1975-04-12",
        insurance: "OSDE 210",
        contact: {
            email: "carlos.rod@gmail.com",
            phone: "+54 9 11 4569 8741",
            whatsapp_normalized: "5491145698741"
        },
        status: "active",
        tags: ["Hipertensión", "Control Anual"],
        medicalHistory: {
            pathological: "Hipertensión arterial diagnosticada en 2018. Antecedentes paternos de diabetes tipo 2.",
            currentIllness: "Paciente acude para control rutinario de presión arterial. Refiere cefaleas esporádicas matutinas.",
            medication: "Enalapril 10mg (1 comprimido diario).",
            files: []
        },
        last_visit: "2023-11-15",
        history: [
            { date: "2023-11-15T10:00:00", title: "Control Hipertensión", doctor: "Dr. Villavicencio", type: "Consulta", notes: "Presión arterial 13/8. Se mantiene medicación." },
            { date: "2023-05-10T09:30:00", title: "Chequeo Semestral", doctor: "Dr. Villavicencio", type: "Control", notes: "Laboratorio normal. Tensión controlada." },
            { date: "2022-11-01T11:00:00", title: "Consulta Inicial", doctor: "Dr. Villavicencio", type: "Ingreso", notes: "Apertura de historia clínica. Antecedentes cargados." }
        ],
        next_appointment: "2024-03-10T09:00:00",
        notes: "Buen apego al tratamiento. Se solicita laboratorio completo para próxima visita."
    },
    {
        id: "p-102",
        name: "Maria Fernanda Lopez",
        dni: "31.225.478",
        birthDate: "1985-09-23",
        insurance: "Swiss Medical",
        contact: {
            email: "mfer.lopez@hotmail.com",
            phone: "+54 9 11 5522 3366",
            whatsapp_normalized: "5491155223366"
        },
        status: "active",
        tags: ["Embarazo", "Semana 24"],
        medicalHistory: {
            pathological: "Sin antecedentes patológicos relevantes. Cirugía de apéndice en 2005.",
            currentIllness: "Control obstétrico de rutina. Cursando semana 24 de gestación sin complicaciones.",
            medication: "Ácido Fólico, Hierro.",
            files: [
                {
                    id: "f-001",
                    name: "Ecografía Obstétrica.pdf",
                    date: "2023-11-20T10:30:00",
                    note: "Feto único, latido cardíaco positivo."
                }
            ]
        },
        last_visit: "2023-12-05",
        history: [
            { date: "2023-12-05T15:00:00", title: "Control Semana 24", doctor: "Dra. Gomez", type: "Consulta", notes: "Latidos cardiofetales positivos. Altura uterina acorde." },
            { date: "2023-11-05T14:30:00", title: "Control Semana 20", doctor: "Dra. Gomez", type: "Control", notes: "Ecografía morfológica normal." },
            { date: "2023-09-15T10:00:00", title: "Confirmación Embarazo", doctor: "Dra. Gomez", type: "Ingreso", notes: "Test positivo. Se inicia ácido fólico." }
        ],
        next_appointment: "2024-01-15T15:30:00",
        notes: "Ecografía morfológica normal. Se indican vacunas antigripal y triple bacteriana acelular."
    },
    {
        id: "p-103",
        name: "Juan Pablo Martinez",
        dni: "40.112.334",
        birthDate: "1997-02-14",
        insurance: "Particular",
        contact: {
            email: "juanp.martinez@gmail.com",
            phone: "+54 9 11 2233 4455",
            whatsapp_normalized: "5491122334455"
        },
        status: "active",
        tags: ["Deportista", "Lesión"],
        medicalHistory: {
            pathological: "Asma bronquial leve intermitente.",
            currentIllness: "Esguince de tobillo grado 2 durante práctica de fútbol.",
            medication: "Ibuprofeno 400mg s.o.s dolor.",
            files: []
        },
        last_visit: "2024-01-02",
        history: [
            { date: "2024-01-02T16:00:00", title: "Urgencia Traumatología", doctor: "Dr. Perez", type: "Urgencia", notes: "Traatamiento inmediato esguince tobillo derecho." }
        ],
        next_appointment: "2024-01-12T10:15:00",
        notes: "Se indica reposo deportivo por 2 semanas y fisioterapia."
    },
    {
        id: "p-104",
        name: "Ana Sofia Benitez",
        dni: "18.445.667",
        birthDate: "1968-11-30",
        insurance: "PAMI",
        contact: {
            email: "ana.benitez68@yahoo.com",
            phone: "+54 9 11 6677 8899",
            whatsapp_normalized: "5491166778899"
        },
        status: "active",
        tags: ["Diabetes Tipo 2", "Artritis"],
        medicalHistory: {
            pathological: "Diabetes Tipo 2 (2010), Artritis Reumatoide, Hipotiroidismo.",
            currentIllness: "Consulta por dolor articular en manos y rodillas. Glucemia estable.",
            medication: "Metformina 850mg, Levotiroxina 100mcg.",
            files: [
                {
                    id: "f-002",
                    name: "Laboratorio Completo.pdf",
                    date: "2023-10-15T09:00:00",
                    note: "HbA1c 6.8%."
                },
                {
                    id: "f-003",
                    name: "Radiografía Rodilla.jpg",
                    date: "2023-10-18T14:20:00",
                    note: "Signos de artrosis moderada."
                }
            ]
        },
        last_visit: "2023-10-20",
        history: [],
        next_appointment: null,
        notes: "Pendiente traer resultados de densitometría ósea."
    },
    {
        id: "p-105",
        name: "Lucas Gabriel Torres",
        dni: "42.889.001",
        birthDate: "2000-07-07",
        insurance: "Galeno",
        contact: {
            email: "lucas.torres@outlook.com",
            phone: "+54 9 11 9988 7766",
            whatsapp_normalized: "5491199887766"
        },
        status: "inactive",
        tags: ["Alergia Penicilina"],
        medicalHistory: {
            pathological: "Alergia confirmada a la Penicilina.",
            currentIllness: "Faringitis viral.",
            medication: "Paracetamol 500mg.",
            files: []
        },
        last_visit: "2023-06-14",
        next_appointment: null,
        notes: "Paciente no regresó a control."
    },
    {
        id: "p-106",
        name: "Sofia Valentina Diaz",
        dni: "35.678.901",
        birthDate: "1990-05-22",
        insurance: "OSDE 310",
        contact: {
            email: "sofia.diaz@gmail.com",
            phone: "+54 9 11 3344 5566",
            whatsapp_normalized: "5491133445566"
        },
        status: "active",
        tags: ["Migraña"],
        medicalHistory: {
            pathological: "Migraña crónica con aura.",
            currentIllness: "Episodio agudo de migraña refractaria a analgésicos comunes.",
            medication: "Triptanos s.o.s.",
            files: []
        },
        last_visit: "2024-01-05",
        next_appointment: "2024-02-05T11:00:00",
        notes: "Se evalúa inicio de tratamiento preventivo con topiramato."
    },
    {
        id: "p-107",
        name: "Ricardo Manuel Gomez",
        dni: "20.123.456",
        birthDate: "1960-01-15",
        insurance: "PAMI",
        contact: {
            email: "ricardo.gomez@gmail.com",
            phone: "+54 9 11 4455 6677",
            whatsapp_normalized: "5491144556677"
        },
        status: "active",
        tags: ["Cardiopatía", "Marcapasos"],
        medicalHistory: {
            pathological: "Infarto agudo de miocardio en 2015. Colocación de marcapasos.",
            currentIllness: "Control cardiológico semestral. Disnea de esfuerzo leve.",
            medication: "Bisoprolol 2.5mg, Aspirina 100mg.",
            files: [
                {
                    id: "f-004",
                    name: "Electrocardiograma.pdf",
                    date: "2023-12-20T11:00:00",
                    note: "Ritmo sinusal, marcapasos funcionante."
                }
            ]
        },
        last_visit: "2023-12-28",
        next_appointment: "2024-06-20T09:30:00",
        notes: "Se solicita Holter 24hs para próximo control."
    },
    {
        id: "p-108",
        name: "Valentina Solange Perez",
        dni: "41.234.567",
        birthDate: "1998-11-05",
        insurance: "OSDE 210",
        contact: {
            email: "valen.perez@hotmail.com",
            phone: "+54 9 11 8899 0011",
            whatsapp_normalized: "5491188990011"
        },
        status: "active",
        tags: ["Ansiedad", "Estudiante"],
        medicalHistory: {
            pathological: "Trastorno de ansiedad generalizada.",
            currentIllness: "Consultas por palpitaciones y sensación de falta de aire en contexto de exámenes.",
            medication: "Clonazepam 0.5mg s.o.s.",
            files: []
        },
        last_visit: "2023-11-30",
        next_appointment: null,
        notes: "Se deriva a psicología para terapia cognitivo-conductual."
    },
    {
        id: "p-109",
        name: "Martin Ezequiel Ruiz",
        dni: "33.456.789",
        birthDate: "1988-03-20",
        insurance: "Particular",
        contact: {
            email: "martin.ruiz@yahoo.com.ar",
            phone: "+54 9 11 1234 5678",
            whatsapp_normalized: "5491112345678"
        },
        status: "active",
        tags: ["Dermatología", "Acné"],
        medicalHistory: {
            pathological: "Acné nódulo-quístico severo en adolescencia.",
            currentIllness: "Brote de acné en región dorsal y facial tras estrés laboral.",
            medication: "Isotretinoína 20mg (en curso).",
            files: [
                {
                    id: "f-005",
                    name: "Foto Clinica Facial.jpg",
                    date: "2024-01-02T16:00:00",
                    note: "Lesiones inflamatorias activas."
                }
            ]
        },
        last_visit: "2024-01-03",
        next_appointment: "2024-02-03T16:30:00",
        notes: "Control de laboratorio hepático y lipídico mensual obligatorio."
    },
    {
        id: "p-110",
        name: "Elena Beatriz Sosa",
        dni: "16.789.012",
        birthDate: "1955-08-30",
        insurance: "PAMI",
        contact: {
            email: "elena.sosa55@gmail.com",
            phone: "+54 9 11 8765 4321",
            whatsapp_normalized: "5491187654321"
        },
        status: "active",
        tags: ["Osteoporosis", "Fractura"],
        medicalHistory: {
            pathological: "Osteoporosis diagnosticada en 2010. Fractura de cadera en 2020.",
            currentIllness: "Dolor lumbar crónico agudizado.",
            medication: "Vitamina D3, Calcio, Alendronato semanal.",
            files: []
        },
        last_visit: "2023-09-15",
        next_appointment: "2024-01-20T10:00:00",
        notes: "Se sugiere densitometría de control anual."
    },
    {
        id: "p-111",
        name: "Federico Nicolas Silva",
        dni: "38.901.234",
        birthDate: "1994-06-12",
        insurance: "Swiss Medical",
        contact: {
            email: "fede.silva@gmail.com",
            phone: "+54 9 11 5678 1234",
            whatsapp_normalized: "5491156781234"
        },
        status: "active",
        tags: ["Celiaquía"],
        medicalHistory: {
            pathological: "Enfermedad Celíaca diagnosticada en infancia.",
            currentIllness: "Control anual. Asintomático con dieta estricta.",
            medication: "Suplementos vitamínicos intermitentes.",
            files: [
                {
                    id: "f-006",
                    name: "Endoscopia Digestiva.pdf",
                    date: "2023-08-10T08:00:00",
                    note: "Atrofia vellositaria Marsh 1 (mejoría respecto a previos)."
                }
            ]
        },
        last_visit: "2023-08-12",
        next_appointment: "2024-08-10T09:00:00",
        notes: "Buen estado nutricional. Continúa dieta libre de gluten."
    },
    {
        id: "p-112",
        name: "Camila Belen Ortiz",
        dni: "29.876.543",
        birthDate: "1982-12-01",
        insurance: "Galeno",
        contact: {
            email: "camila.ortiz@outlook.com",
            phone: "+54 9 11 4321 8765",
            whatsapp_normalized: "5491143218765"
        },
        status: "inactive",
        tags: ["Hipotiroidismo"],
        medicalHistory: {
            pathological: "Hipotiroidismo autoinmune (Hashimoto).",
            currentIllness: "Fatiga y aumento de peso. TSH elevada en último control externo.",
            medication: "Levotiroxina 75mcg.",
            files: []
        },
        last_visit: "2023-05-20",
        next_appointment: null,
        notes: "Paciente solicitó historia clínica para cambio de médico."
    }
];
