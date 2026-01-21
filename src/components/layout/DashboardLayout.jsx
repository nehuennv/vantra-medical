import React from 'react';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';

export function DashboardLayout() {
    return (
        // CONTENEDOR BASE: Global Aura Background (bg-transparent para mostrar el gradiente del body)
        <div className="flex h-screen w-full overflow-hidden bg-transparent p-2 md:p-4 gap-3 md:gap-4 font-sans text-slate-900 selection:bg-primary/20 selection:text-primary">

            {/* SIDEBAR:
                Vive visualmente "sobre" el fondo base.
            */}
            <aside className="hidden lg:flex flex-col shrink-0 z-20">
                <Sidebar />
            </aside>

            {/* ISLA PRINCIPAL (Main Content Island):
                Usamos bg-slate-50 (Gris muy suave) para que las "White Cards" adentro resalten.
                Efecto "Ventana" con borde y sombra fuertes.
            */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white/50 overflow-hidden relative transition-all duration-300">

                {/* TopBar ahora vive DENTRO de la isla para mantener la consistencia visual */}
                <TopBar />

                {/* Área de Contenido Scrollable */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 scroll-smooth custom-scrollbar relative">
                    <div className="max-w-[1600px] mx-auto min-h-full animate-in fade-in duration-500 slide-in-from-bottom-4">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}