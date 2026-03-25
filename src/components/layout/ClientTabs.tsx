'use client'

import React, { useState } from 'react';
import { DashboardView, UploadView, ManualView, ForecastView, AnalyticsView, ReportView } from '@/components/features';

export function ClientTabs({ initialData }: { initialData: any }) {
    const [activeTab, setActiveTab] = useState('dashboard');

    const tabs = [
        { id: 'dashboard', label: '📊 Dashboard' },
        { id: 'upload', label: '📁 Importar' },
        { id: 'manual', label: '✏️ Entrada Manual' },
        { id: 'previsao', label: '🔮 Previsão' },
        { id: 'ranking', label: '📈 Análises' },
        { id: 'relatorio', label: '📋 Relatório Consolidado' }
    ];

    return (
        <>
            <nav className="nav-tabs">
                {tabs.map(t => (
                    <div
                        key={t.id}
                        className={`tab ${activeTab === t.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(t.id)}
                    >
                        {t.label}
                    </div>
                ))}
            </nav>

            <main>
                <div className={`section ${activeTab === 'dashboard' ? 'active' : ''}`}>
                    <DashboardView initialData={initialData} />
                </div>
                <div className={`section ${activeTab === 'upload' ? 'active' : ''}`}>
                    <UploadView />
                </div>
                <div className={`section ${activeTab === 'manual' ? 'active' : ''}`}>
                    <ManualView todosRegistros={initialData.todosRegistros} />
                </div>
                <div className={`section ${activeTab === 'previsao' ? 'active' : ''}`}>
                    <ForecastView dbRegistros={initialData.todosRegistros} />
                </div>
                <div className={`section ${activeTab === 'ranking' ? 'active' : ''}`}>
                    <AnalyticsView
                        topInsumos={initialData.topInsumos}
                        consumoCategoria={initialData.consumoCategoria}
                        dbRegistros={initialData.todosRegistros}
                    />
                </div>
                <div className={`section ${activeTab === 'relatorio' ? 'active' : ''}`}>
                    <ReportView dbRegistros={initialData.todosRegistros} />
                </div>
            </main>
        </>
    )
}
