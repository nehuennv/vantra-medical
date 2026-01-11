import React from 'react';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom'; // <--- Importamos Outlet

export function DashboardLayout() {
    // Ya no necesitamos props de navegación aquí, el Router se encarga
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Sidebar Fija */}
            <Sidebar />

            {/* Contenedor Principal */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Área de Contenido Scrollable */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 scroll-smooth relative">
                    <div className="max-w-[1600px] mx-auto h-full flex flex-col gap-6 animate-in fade-in duration-500 slide-in-from-bottom-2">
                        {/* AQUÍ EL ROUTER RENDERIZA LA PÁGINA CORRESPONDIENTE */}
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}