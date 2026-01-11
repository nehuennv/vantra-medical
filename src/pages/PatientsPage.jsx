import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Users, SlidersHorizontal } from 'lucide-react';
import { CreatePatientModal } from "@/components/patients/CreatePatientModal";
import { Button } from "@/components/ui/button";
import { mockPatients } from "../data/mockPatients";
import { PatientTable } from "../components/patients/PatientTable";
import { PatientDrawer } from "../components/patients/PatientDrawer";
import { motion, AnimatePresence } from "framer-motion";

export function PatientsPage() {
    // 1. Estados
    const [searchTerm, setSearchTerm] = useState("");
    const [filterInsurance, setFilterInsurance] = useState("all");
    const [patients, setPatients] = useState(mockPatients);

    // Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [patientToEdit, setPatientToEdit] = useState(null);

    // Pagination & Sorting State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [isLoading, setIsLoading] = useState(false);

    // Drawer states
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // 2. Lógica de Filtrado, Ordenamiento y Paginación
    const processedPatients = React.useMemo(() => {
        let result = [...patients];

        // Filtrado por búsqueda
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(patient =>
                patient.name.toLowerCase().includes(lowerTerm) ||
                patient.contact.email.toLowerCase().includes(lowerTerm) ||
                patient.contact.phone.includes(lowerTerm) ||
                (patient.dni && patient.dni.includes(lowerTerm))
            );
        }

        // Filtrado por Obra Social
        if (filterInsurance !== 'all') {
            const normalizedFilter = filterInsurance.replace('_', ' ');
            result = result.filter(patient =>
                patient.insurance?.toLowerCase().includes(normalizedFilter)
            );
        }

        // Ordenamiento
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (typeof aValue === 'string') aValue = aValue.toLowerCase();
                if (typeof bValue === 'string') bValue = bValue.toLowerCase();

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [patients, searchTerm, sortConfig, filterInsurance]);

    // Calcular totales
    const totalPages = Math.ceil(processedPatients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPatients = processedPatients.slice(startIndex, startIndex + itemsPerPage);

    // Efecto de carga simulada al cambiar filtros o página
    React.useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(timer);
    }, [searchTerm, currentPage, sortConfig]);

    // Resetear a pag 1 si cambia búsqueda
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const activeCount = patients.filter(p => p.status === 'active').length;

    // 3. Handlers
    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handlePatientClick = (patient) => {
        setSelectedPatient(patient);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setTimeout(() => setSelectedPatient(null), 300);
    };

    const handleEditPatient = (patient) => {
        // Close drawer first
        setIsDrawerOpen(false);
        // Set patient to edit and open modal
        setPatientToEdit(patient);
        setTimeout(() => setIsCreateModalOpen(true), 150);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        // Clean edit state after animation
        setTimeout(() => setPatientToEdit(null), 300);
    };

    const handleCreatePatient = (newPatient) => {
        if (patientToEdit) {
            // Update existant
            setPatients(prev => prev.map(p => p.id === newPatient.id ? newPatient : p));
        } else {
            // Create new
            setPatients(prev => [newPatient, ...prev]);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 200 } }
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
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl shadow-sm border border-primary/20">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        Pacientes
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        Gestión inteligente de tu base de datos clínica.
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">
                            {activeCount} Activos
                        </span>
                    </p>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="h-10 px-6 rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white font-semibold transform hover:scale-105 transition-transform duration-200"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Paciente
                </Button>
            </motion.div>

            {/* Toolbar */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
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
                <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
                    <div className="relative group w-full md:w-auto">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                            <Filter className="h-4 w-4" />
                        </div>
                        <select
                            className="w-full md:w-48 pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none appearance-none cursor-pointer text-slate-600"
                            value={filterInsurance}
                            onChange={(e) => setFilterInsurance(e.target.value)}
                        >
                            <option value="all">Todas</option>
                            <option value="particular">Particular</option>
                            <option value="osde">OSDE</option>
                            <option value="swiss_medical">Swiss Medical</option>
                            <option value="galeno">Galeno</option>
                            <option value="omint">Omint</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <SlidersHorizontal className="h-3 w-3" />
                        </div>
                    </div>
                    <Button variant="outline" className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl px-4 h-10 hidden sm:flex">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                    </Button>
                </div>
            </motion.div>

            {/* TableContainer */}
            <motion.div variants={itemVariants}>
                <PatientTable
                    patients={paginatedPatients}
                    isLoading={isLoading}
                    onPatientClick={handlePatientClick}
                    pagination={{
                        currentPage,
                        totalPages,
                        onPageChange: setCurrentPage,
                        totalItems: processedPatients.length,
                        startIndex: startIndex + 1,
                        endIndex: Math.min(startIndex + itemsPerPage, processedPatients.length)
                    }}
                />
            </motion.div>

            {/* Drawer */}
            <PatientDrawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                patient={selectedPatient}
                onEdit={handleEditPatient}
            />

            <CreatePatientModal
                isOpen={isCreateModalOpen}
                initialData={patientToEdit}
                onClose={handleCloseCreateModal}
                onSubmit={handleCreatePatient}
            />

        </motion.div >
    );
}
