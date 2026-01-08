import React, { useState } from 'react';
import { Search, Plus, Filter, Download, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { mockPatients } from "../data/mockPatients";
import { PatientTable } from "../components/patients/PatientTable";
import { PatientDrawer } from "../components/patients/PatientDrawer";
import { motion, AnimatePresence } from "framer-motion";

export function PatientsPage() {
    // 1. Estados
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [patients] = useState(mockPatients);

    // Drawer states
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // 2. Lógica de Filtrado
    const filteredPatients = patients.filter(patient => {
        const matchesSearch =
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.contact.phone.includes(searchTerm) ||
            patient.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || patient.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const activeCount = patients.filter(p => p.status === 'active').length;

    // 3. Handlers
    const handlePatientClick = (patient) => {
        setSelectedPatient(patient);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setTimeout(() => setSelectedPatient(null), 300); // Wait for animation
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 200
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[1600px] mx-auto space-y-8 pb-12 will-change-transform"
        >

            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        <Users className="h-8 w-8 text-primary" />
                        Pacientes
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        Gestión inteligente de tu base de datos clínica.
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">
                            {activeCount} Activos
                        </span>
                    </p>
                </div>
                <Button className="h-10 px-6 rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white font-semibold transform hover:scale-105 transition-transform duration-200">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Paciente
                </Button>
            </motion.div>

            {/* Toolbar */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">

                {/* Search */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, DNI, teléfono..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative">
                        <select
                            className="appearance-none h-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-slate-50 transition-colors"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Todos los estados</option>
                            <option value="active">Activos</option>
                            <option value="inactive">Inactivos</option>
                            <option value="archived">Archivados</option>
                        </select>
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>

                    <Button variant="outline" className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl px-4">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                    </Button>
                </div>
            </motion.div>

            {/* TableContainer - We wrap PatientTable in a motion div to participate in stagger */}
            <motion.div variants={itemVariants}>
                <PatientTable
                    patients={filteredPatients}
                    onPatientClick={handlePatientClick}
                />
            </motion.div>

            {/* Drawer */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <PatientDrawer
                        isOpen={isDrawerOpen}
                        onClose={handleCloseDrawer}
                        patient={selectedPatient}
                    />
                )}
            </AnimatePresence>

        </motion.div>
    );
}
