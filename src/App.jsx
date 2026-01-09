import React, { useState } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { PatientsPage } from "@/pages/PatientsPage";
import { NewAppointmentPage } from "@/pages/NewAppointmentPage";
import { AgendaPage } from "@/pages/AgendaPage";
import { ThemeController } from "@/components/ThemeController";

function App() {
  const [currentPage, setCurrentPage] = useState('agenda');

  return (
    <>
      <ThemeController />
      <DashboardLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'patients' && <PatientsPage />}
        {currentPage === 'new-appointment' && <NewAppointmentPage onNavigate={setCurrentPage} />}
        {currentPage === 'agenda' && <AgendaPage />}

        {/* Placeholder for other pages */}
        {currentPage === 'messages' && <div className="p-8 text-slate-500">Mensajes Component (Coming Soon)</div>}
        {currentPage === 'settings' && <div className="p-8 text-slate-500">Settings Component (Coming Soon)</div>}
      </DashboardLayout>
    </>
  );
}

export default App;