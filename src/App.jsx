import React, { useState } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { PatientsPage } from "@/pages/PatientsPage";
import { NewAppointmentPage } from "@/pages/NewAppointmentPage";
import { AgendaPage } from "@/pages/AgendaPage";
import { AvailabilityPage } from "@/pages/AvailabilityPage";
import { ThemeController } from "@/components/ThemeController";

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleNavigate = (page) => setCurrentPage(page);

  return (
    <>
      <ThemeController />
      <DashboardLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
        {currentPage === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
        {currentPage === 'patients' && <PatientsPage />}
        {currentPage === 'new-appointment' && <NewAppointmentPage onNavigate={handleNavigate} />}
        {currentPage === 'agenda' && <AgendaPage onNavigate={handleNavigate} />}
        {currentPage === 'availability' && <AvailabilityPage />}

        {/* Placeholder for other pages */}
        {currentPage === 'messages' && <div className="p-8 text-slate-500">Mensajes Component (Coming Soon)</div>}
        {currentPage === 'settings' && <div className="p-8 text-slate-500">Settings Component (Coming Soon)</div>}
      </DashboardLayout>
    </>
  );
}

export default App;