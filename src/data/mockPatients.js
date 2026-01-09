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
        next_appointment: "2024-03-10",
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
            files: []
        },
        last_visit: "2023-12-05",
        next_appointment: "2024-01-15",
        notes: "Ecografía morfológica normal. Se indican vacunas antigripal y triple bacteriana acelular."
    },
    {
        id: "p-103",
        name: "Juan Pablo Martinez",
        dni: "18.447.112",
        birthDate: "1965-02-10",
        insurance: "Galeno Oro",
        contact: {
            email: "juanp.martinez@yahoo.com",
            phone: "+54 9 11 3698 7412",
            whatsapp_normalized: "5491136987412"
        },
        status: "active",
        tags: ["Diabetes Tipo 2", "Obesidad"],
        medicalHistory: {
            pathological: "Diabetes Tipo 2 dagnosticada en 2010. Obesidad grado 1.",
            currentIllness: "Dificultad para mantener niveles de glucemia estables. Polidipsia y poliuria ocasional.",
            medication: "Metformina 850mg (2 veces al día).",
            files: []
        },
        last_visit: "2023-11-28",
        next_appointment: "2024-02-05",
        notes: "Se refuerza pautas alimentarias. Se sugiere interconsulta con nutrición."
    },
    {
        id: "p-104",
        name: "Sofia Elena Gonzalez",
        dni: "42.369.874",
        birthDate: "2000-11-08",
        insurance: "Particular",
        contact: {
            email: "sofi.gonzalez2000@gmail.com",
            phone: "+54 9 11 9874 5632",
            whatsapp_normalized: "5491198745632"
        },
        status: "inactive",
        tags: ["Dermatología", "Acné"],
        medicalHistory: {
            pathological: "Niega alergias medicamentosas.",
            currentIllness: "Brote de acné en región facial y dorsal. Empeoramiento en periodos de estrés.",
            medication: "Peróxido de benzoilo tópico.",
            files: []
        },
        last_visit: "2023-09-10",
        next_appointment: null,
        notes: "Tratamiento suspendido por la paciente. No responde a llamados de seguimiento."
    },
    {
        id: "p-105",
        name: "Lucas Gabriel Sanchez",
        dni: "38.995.663",
        birthDate: "1994-07-15",
        insurance: "OMINT",
        contact: {
            email: "lucas.sanchez@outlook.com",
            phone: "+54 9 11 7412 5896",
            whatsapp_normalized: "5491174125896"
        },
        status: "active",
        tags: ["Traumatología", "Post-operatorio"],
        medicalHistory: {
            pathological: "Fractura de tibia en 2015.",
            currentIllness: "Dolor residual en rodilla derecha post-actividad física intensa.",
            medication: "Keterolac sublingual SOS.",
            files: []
        },
        last_visit: "2023-12-12",
        next_appointment: "2024-01-20",
        notes: "Se solicitó resonancia magnética. Pendiente informe."
    },
    {
        id: "p-106",
        name: "Ana Maria Perez",
        dni: "14.552.336",
        birthDate: "1960-05-25",
        insurance: "PAMI",
        contact: {
            email: "ana.m.perez@gmail.com",
            phone: "+54 9 11 2589 6314",
            whatsapp_normalized: "5491125896314"
        },
        status: "active",
        tags: ["Artrosis", "Geriatría"],
        medicalHistory: {
            pathological: "Histerectomía en 2008. Artrosis de cadera bilateral.",
            currentIllness: "Dolor mecánico en caderas que cede con el reposo. Rigidez matutina menor a 30 min.",
            medication: "Paracetamol 1g c/8hs si hay dolor.",
            files: []
        },
        last_visit: "2023-12-01",
        next_appointment: "2024-03-01",
        notes: "Se sugiere inicio de kinesiología motora."
    },
    {
        id: "p-107",
        name: "Martin Ezequiel Silva",
        dni: "29.874.125",
        birthDate: "1982-12-30",
        insurance: "OSDE 310",
        contact: {
            email: "martin.silva82@gmail.com",
            phone: "+54 9 11 6325 9874",
            whatsapp_normalized: "5491163259874"
        },
        status: "active",
        tags: ["Chequeo General"],
        medicalHistory: {
            pathological: "Tabaquismo social.",
            currentIllness: "Paciente asintomático. Solicita apto físico para iniciar gimnasio.",
            medication: "Ninguna.",
            files: []
        },
        last_visit: "2023-11-20",
        next_appointment: null,
        notes: "ECG normal. Ergometría pendiente."
    },
    {
        id: "p-108",
        name: "Laura Beatriz Gomez",
        dni: "26.335.774",
        birthDate: "1978-03-14",
        insurance: "Sancor Salud",
        contact: {
            email: "laura.gomez@yahoo.com.ar",
            phone: "+54 9 11 4477 8855",
            whatsapp_normalized: "5491144778855"
        },
        status: "archived",
        tags: ["Mudanza"],
        medicalHistory: {
            pathological: "Hipotiroidismo.",
            currentIllness: "Control de función tiroidea.",
            medication: "Levotiroxina 75mcg.",
            files: []
        },
        last_visit: "2023-08-15",
        next_appointment: null,
        notes: "Paciente se muda a otra provincia. Se entrega historia clínica."
    },
    {
        id: "p-109",
        name: "Pedro Alfonso Rodriguez",
        dni: "33.221.554",
        birthDate: "1988-01-20",
        insurance: "OSDE 410",
        contact: {
            email: "pedro.alf@gmail.com",
            phone: "+54 9 11 2233 4455",
            whatsapp_normalized: "5491122334455"
        },
        status: "active",
        tags: ["Deporte", "Lesión Meniscal"],
        medicalHistory: {
            pathological: "Sin antecedentes.",
            currentIllness: "Dolor en rodilla izquierda tras partido de fútbol.",
            medication: "Diclofenac gel.",
            files: []
        },
        last_visit: "2024-01-02",
        next_appointment: "2024-01-15",
        notes: "Evaluar necesidad de artroscopia."
    },
    {
        id: "p-110",
        name: "Valeria Soledad Mendez",
        dni: "40.112.334",
        birthDate: "1997-06-15",
        insurance: "Swiss Medical",
        contact: {
            email: "vale.mendez@hotmail.com",
            phone: "+54 9 11 9988 7766",
            whatsapp_normalized: "5491199887766"
        },
        status: "active",
        tags: ["Ginecología", "Control"],
        medicalHistory: {
            pathological: "SOP (Sindrome de Ovario Poliquístico).",
            currentIllness: "Irregularidad menstrual.",
            medication: "Anticonceptivos orales.",
            files: []
        },
        last_visit: "2023-11-10",
        next_appointment: "2024-05-10",
        notes: "Control semestral. Ecografía solicitada."
    },
    {
        id: "p-111",
        name: "Diego Armando Fernandez",
        dni: "20.555.888",
        birthDate: "1970-10-30",
        insurance: "Particular",
        contact: {
            email: "diego.f@yahoo.com",
            phone: "+54 9 11 1111 2222",
            whatsapp_normalized: "5491111112222"
        },
        status: "inactive",
        tags: ["Cardiología", "Arritmia"],
        medicalHistory: {
            pathological: "Antecedentes de infarto en 2015.",
            currentIllness: "Palpitaciones ocasionales.",
            medication: "Amiodarona 200mg.",
            files: []
        },
        last_visit: "2023-09-20",
        next_appointment: null,
        notes: "Paciente no asistió a su último turno."
    },
    {
        id: "p-112",
        name: "Cecilia Beatriz Krawczyk",
        dni: "16.447.225",
        birthDate: "1963-08-05",
        insurance: "PAMI",
        contact: {
            email: "ceci.k@gmail.com",
            phone: "+54 9 11 3333 4444",
            whatsapp_normalized: "5491133334444"
        },
        status: "active",
        tags: ["Oftalmología", "Cataratas"],
        medicalHistory: {
            pathological: "Hipertensión ocular.",
            currentIllness: "Disminución de agudeza visual progresiva.",
            medication: "Gotas Latanoprost.",
            files: []
        },
        last_visit: "2023-12-28",
        next_appointment: "2024-02-15",
        notes: "Programar cirugía de cataratas ojo derecho."
    },
    {
        id: "p-113",
        name: "Julian Alvarez",
        dni: "42.000.111",
        birthDate: "2000-01-31",
        insurance: "Medicus",
        contact: {
            email: "julian.spider@gmail.com",
            phone: "+54 9 11 5555 6666",
            whatsapp_normalized: "5491155556666"
        },
        status: "active",
        tags: ["Apto Físico", "Alto Rendimiento"],
        medicalHistory: {
            pathological: "Ninguno.",
            currentIllness: "Chequeo pre-temporada.",
            medication: "Suplementos proteicos.",
            files: []
        },
        last_visit: "2024-01-05",
        next_appointment: null,
        notes: "Estado físico excelente."
    },
    {
        id: "p-114",
        name: "Marta Elisabeth Quiroga",
        dni: "11.222.333",
        birthDate: "1954-04-22",
        insurance: "IOMA",
        contact: {
            email: "marta.qui@outlook.com",
            phone: "+54 9 11 7777 8888",
            whatsapp_normalized: "5491177778888"
        },
        status: "active",
        tags: ["Reumatología", "Artritis"],
        medicalHistory: {
            pathological: "Artritis Reumatoide seropositiva.",
            currentIllness: "Dolor e inflamación en articulaciones de manos.",
            medication: "Metotrexato semanal.",
            files: []
        },
        last_visit: "2023-11-30",
        next_appointment: "2024-01-30",
        notes: "Ajustar dosis si persiste inflamación."
    },
    {
        id: "p-115",
        name: "Esteban Quito",
        dni: "28.999.000",
        birthDate: "1981-12-12",
        insurance: "Galeno Plata",
        contact: {
            email: "esteban.q@gmail.com",
            phone: "+54 9 11 0000 1111",
            whatsapp_normalized: "5491100001111"
        },
        status: "active",
        tags: ["Gastritis", "Estrés"],
        medicalHistory: {
            pathological: "Gastritis erosiva antral.",
            currentIllness: "Acidez recurrente post-prandial.",
            medication: "Omeprazol 20mg.",
            files: []
        },
        last_visit: "2023-10-15",
        next_appointment: "2024-02-10",
        notes: "Dieta blanca estricta por 15 días."
    },
    {
        id: "p-116",
        name: "Romina Gaetani",
        dni: "25.666.777",
        birthDate: "1977-04-15",
        insurance: "OSDE 310",
        contact: {
            email: "romi.gae@yahoo.com",
            phone: "+54 9 11 2222 3333",
            whatsapp_normalized: "5491122223333"
        },
        status: "active",
        tags: ["Dermatología", "Control Lunares"],
        medicalHistory: {
            pathological: "Antecedentes familiares de melanoma.",
            currentIllness: "Control anual de nevos.",
            medication: "Protector solar 50+.",
            files: []
        },
        last_visit: "2023-12-10",
        next_appointment: "2024-12-10",
        notes: "Dermatoscopia digital realizada. Sin cambios significativos."
    },
    {
        id: "p-117",
        name: "Jorge Rial",
        dni: "14.888.999",
        birthDate: "1961-10-16",
        insurance: "Swiss Medical",
        contact: {
            email: "jorge.r@ciudad.com.ar",
            phone: "+54 9 11 4444 5555",
            whatsapp_normalized: "5491144445555"
        },
        status: "active",
        tags: ["Cardiología", "Stent"],
        medicalHistory: {
            pathological: "Colocación de Stent en 2010.",
            currentIllness: "Control cardiológico rutinario.",
            medication: "Aspirina 100mg, Atorvastatina.",
            files: []
        },
        last_visit: "2023-11-05",
        next_appointment: "2024-03-05",
        notes: "Prueba de esfuerzo satisfactoria."
    },
    {
        id: "p-118",
        name: "Luz Maria Olivera",
        dni: "45.111.222",
        birthDate: "2003-07-20",
        insurance: "Particular",
        contact: {
            email: "luz.oli@gmail.com",
            phone: "+54 9 11 6666 7777",
            whatsapp_normalized: "5491166667777"
        },
        status: "active",
        tags: ["Pediatría", "Transición"],
        medicalHistory: {
            pathological: "Asma bronquial leve.",
            currentIllness: "Broncoespasmo estacional.",
            medication: "Salbutamol a demanda.",
            files: []
        },
        last_visit: "2023-09-30",
        next_appointment: "2024-03-30",
        notes: "Espirometría normal. Continuar medicación SOS."
    },
    {
        id: "p-119",
        name: "Roberto Carlos Gomez",
        dni: "8.555.222",
        birthDate: "1950-02-14",
        insurance: "PAMI",
        contact: {
            email: "roberto.carlos@hotmail.com",
            phone: "+54 9 11 8888 9999",
            whatsapp_normalized: "5491188889999"
        },
        status: "active",
        tags: ["Urología", "Próstata"],
        medicalHistory: {
            pathological: "Hiperplasia Prostática Benigna.",
            currentIllness: "Nicturia frecuente.",
            medication: "Tamsulosina.",
            files: []
        },
        last_visit: "2023-10-25",
        next_appointment: "2024-04-25",
        notes: "PSA estable. Ecografía vesical con buen vaciado."
    },
    {
        id: "p-120",
        name: "Maria Laura Santillan",
        dni: "16.111.222",
        birthDate: "1962-03-15",
        insurance: "OSDE 410",
        contact: {
            email: "ml.santillan@tn.com.ar",
            phone: "+54 9 11 1234 1234",
            whatsapp_normalized: "5491112341234"
        },
        status: "active",
        tags: ["Estética", "Botox"],
        medicalHistory: {
            pathological: "Ninguno relevante.",
            currentIllness: "Consulta estética facial.",
            medication: "Ninguna.",
            files: []
        },
        last_visit: "2023-12-15",
        next_appointment: "2024-06-15",
        notes: "Aplicación de toxina botulínica en tercio superior."
    },
    {
        id: "p-121",
        name: "Facundo Arana",
        dni: "22.333.444",
        birthDate: "1972-03-31",
        insurance: "Swiss Medical",
        contact: {
            email: "facu.arana@gmail.com",
            phone: "+54 9 11 4321 4321",
            whatsapp_normalized: "5491143214321"
        },
        status: "active",
        tags: ["Traumatología", "Alpinismo"],
        medicalHistory: {
            pathological: "Edema pulmonar de altura (antecedente).",
            currentIllness: "Chequeo pre-ascenso Aconcagua.",
            medication: "Acetazolamida (profilaxis).",
            files: []
        },
        last_visit: "2023-11-15",
        next_appointment: null,
        notes: "Apto físico firmado. Se recomiendan pautas de aclimatación."
    },
    {
        id: "p-122",
        name: "Natalia Oreiro",
        dni: "26.999.888",
        birthDate: "1977-05-19",
        insurance: "Particular",
        contact: {
            email: "nati.oreiro@uruguay.com",
            phone: "+54 9 11 8765 8765",
            whatsapp_normalized: "5491187658765"
        },
        status: "active",
        tags: ["Nutrición", "Vegana"],
        medicalHistory: {
            pathological: "Anemia ferropénica leve (histórico).",
            currentIllness: "Control nutricional dieta plant-based.",
            medication: "Suplemento B12.",
            files: []
        },
        last_visit: "2023-10-01",
        next_appointment: "2024-04-01",
        notes: "Valores de B12 y Hierro en rango óptimo."
    },
    {
        id: "p-123",
        name: "Ricardo Darin",
        dni: "12.444.555",
        birthDate: "1957-01-16",
        insurance: "OSDE 510",
        contact: {
            email: "richard.darin@cine.ar",
            phone: "+54 9 11 5678 5678",
            whatsapp_normalized: "5491156785678"
        },
        status: "active",
        tags: ["Tabaco", "Control Pulmonar"],
        medicalHistory: {
            pathological: "Ex-tabaquista.",
            currentIllness: "Tos seca esporádica.",
            medication: "Jarabe antitusivo.",
            files: []
        },
        last_visit: "2023-09-15",
        next_appointment: "2024-03-15",
        notes: "Tomografía de tórax sin hallazgos patológicos."
    },
    {
        id: "p-124",
        name: "Guillermo Francella",
        dni: "11.555.666",
        birthDate: "1955-02-14",
        insurance: "Galeno Oro",
        contact: {
            email: "guille.f@gmail.com",
            phone: "+54 9 11 3456 3456",
            whatsapp_normalized: "5491134563456"
        },
        status: "active",
        tags: ["Oftalmología", "Presbicia"],
        medicalHistory: {
            pathological: "Uso de lentes multifocales.",
            currentIllness: "Fatiga visual nocturna.",
            medication: "Lágrimas artificiales.",
            files: []
        },
        last_visit: "2023-11-25",
        next_appointment: "2024-05-25",
        notes: "Se actualizó receta de anteojos."
    },
    {
        id: "p-125",
        name: "Susana Rinaldi",
        dni: "5.111.444",
        birthDate: "1945-12-25",
        insurance: "PAMI",
        contact: {
            email: "tana.rinaldi@tango.com",
            phone: "+54 9 11 9090 9090",
            whatsapp_normalized: "5491190909090"
        },
        status: "active",
        tags: ["Otorrino", "Audición"],
        medicalHistory: {
            pathological: "Hipoacusia leve bilateral.",
            currentIllness: "Control de audífonos.",
            medication: "Ninguna.",
            files: []
        },
        last_visit: "2023-08-20",
        next_appointment: "2024-02-20",
        notes: "Audiometría estable."
    },
    {
        id: "p-126",
        name: "Santiago del Moro",
        dni: "26.222.111",
        birthDate: "1978-02-09",
        insurance: "OSDE 410",
        contact: {
            email: "santi.delmoro@telefe.com",
            phone: "+54 9 11 7654 7654",
            whatsapp_normalized: "5491176547654"
        },
        status: "active",
        tags: ["Dermatología", "Rosácea"],
        medicalHistory: {
            pathological: "Piel sensible.",
            currentIllness: "Eritema facial ante cambios de temperatura.",
            medication: "Crema Metronidazol.",
            files: []
        },
        last_visit: "2023-12-05",
        next_appointment: "2024-06-05",
        notes: "Evitar exposición solar directa sin protección."
    },
    {
        id: "p-127",
        name: "Carolina Pampita Ardohain",
        dni: "26.555.444",
        birthDate: "1978-01-17",
        insurance: "Swiss Medical",
        contact: {
            email: "pampita@gmail.com",
            phone: "+54 9 11 2345 2345",
            whatsapp_normalized: "5491123452345"
        },
        status: "active",
        tags: ["Odontología", "Blanqueamiento"],
        medicalHistory: {
            pathological: "Ninguno.",
            currentIllness: "Estética dental.",
            medication: "Ninguna.",
            files: []
        },
        last_visit: "2023-11-12",
        next_appointment: "2024-05-12",
        notes: "Control post-blanqueamiento. Encías sanas."
    },
    {
        id: "p-128",
        name: "Marcelo Polino",
        dni: "17.333.222",
        birthDate: "1964-01-30",
        insurance: "Galeno Oro",
        contact: {
            email: "marcelo.polino@gmail.com",
            phone: "+54 9 11 6789 6789",
            whatsapp_normalized: "5491167896789"
        },
        status: "active",
        tags: ["Gastroenterología", "Colon Irritable"],
        medicalHistory: {
            pathological: "SII.",
            currentIllness: "Distensión abdominal frecuente.",
            medication: "Trimebutina.",
            files: []
        },
        last_visit: "2023-10-20",
        next_appointment: "2024-04-20",
        notes: "Se recomienda dieta FODMAP."
    },
    {
        id: "p-129",
        name: "Carmen Barbieri",
        dni: "11.999.888",
        birthDate: "1955-04-21",
        insurance: "Particular",
        contact: {
            email: "carmen.leona@gmail.com",
            phone: "+54 9 11 9876 5432",
            whatsapp_normalized: "5491198765432"
        },
        status: "active",
        tags: ["Neumonía", "Post-COVID"],
        medicalHistory: {
            pathological: "Internación por COVID en 2021.",
            currentIllness: "Fatiga residual leve.",
            medication: "Polivitamínicos.",
            files: []
        },
        last_visit: "2023-09-05",
        next_appointment: "2024-03-05",
        notes: "Capacidad pulmonar recuperada al 95%."
    },
    {
        id: "p-130",
        name: "Moria Casan",
        dni: "6.666.666",
        birthDate: "1946-08-16",
        insurance: "Particular",
        contact: {
            email: "la.one@moria.com",
            phone: "+54 9 11 1111 1111",
            whatsapp_normalized: "5491111111111"
        },
        status: "active",
        tags: ["Ortomolecular", "Anti-age"],
        medicalHistory: {
            pathological: "Ninguno.",
            currentIllness: "Tratamiento de revitalización celular.",
            medication: "Sueros ortomoleculares mensuales.",
            files: []
        },
        last_visit: "2023-12-23",
        next_appointment: "2024-01-23",
        notes: "Paciente refiere sentirse 'plena'. Continuar esquema."
    }
];
