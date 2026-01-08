import React from 'react';
import { Eye, MessageCircle } from 'lucide-react';

export function PatientTable({ patients, onPatientClick }) {



    return (
        <div className="w-full overflow-hidden bg-white rounded-xl shadow-sm border border-slate-200">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Paciente</th>
                        <th className="px-6 py-4">Identificación</th>
                        <th className="px-6 py-4">Cobertura</th>
                        <th className="px-6 py-4">Contacto</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {patients.map((patient) => (
                        <tr
                            key={patient.id}
                            onClick={() => onPatientClick(patient)}
                            className="group hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            {/* Paciente */}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm border border-slate-200 shadow-sm shrink-0">
                                        {patient.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">
                                            {patient.name}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* Identificación */}
                            <td className="px-6 py-4">
                                <p className="text-sm font-medium text-slate-700">{patient.dni || '-'}</p>
                            </td>

                            {/* Cobertura */}
                            <td className="px-6 py-4">
                                {patient.insurance === 'Particular' ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 shadow-sm">
                                        Particular
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 shadow-sm">
                                        {patient.insurance || 'Sin Cobertura'}
                                    </span>
                                )}
                            </td>

                            {/* Contacto Rápido */}
                            <td className="px-6 py-4">
                                <a
                                    href={`https://wa.me/${patient.contact.whatsapp_normalized}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors w-fit"
                                >
                                    <MessageCircle className="h-4 w-4 text-emerald-500" />
                                    <span>{patient.contact.phone.split(' ').slice(2).join(' ')}</span>
                                </a>
                            </td>

                            {/* Acciones */}
                            <td className="px-6 py-4 text-right">
                                <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-full transition-all" title="Ver Ficha">
                                    <Eye className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {patients.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-500 text-sm">No se encontraron pacientes para este filtro.</p>
                </div>
            )}
        </div>
    );
}
