import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

// Páginas
import { DashboardPage } from '@/pages/DashboardPage';
import { AgendaPage } from '@/pages/AgendaPage';
import { PatientsPage } from '@/pages/PatientsPage';
import { AvailabilityPage } from '@/pages/AvailabilityPage';
import { NewAppointmentPage } from '@/pages/NewAppointmentPage';
import { SettingsPage } from '@/pages/SettingsPage';

function App() {
  return (
    <Routes>
      {/* Layout Principal que envuelve todo */}
      <Route element={<DashboardLayout />}>

        {/* Redirección: Si entra a raíz, va al dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Rutas Definidas */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/pacientes" element={<PatientsPage />} />
        <Route path="/disponibilidad" element={<AvailabilityPage />} />
        <Route path="/configuracion" element={<SettingsPage />} />

        {/* Sub-rutas o Modales en página completa si quisieras */}
        <Route path="/nuevo-turno" element={<NewAppointmentPage />} />

        {/* Placeholder para rutas no creadas aún */}
        <Route path="*" element={<div className="p-10 text-center text-slate-500">Página en construcción 🚧</div>} />

      </Route>
    </Routes>
  );
}

export default App;