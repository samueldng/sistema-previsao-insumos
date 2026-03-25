'use client'

import React, { useMemo } from 'react';
import { StatCard, Card, Badge } from '@/components/ui';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export function DashboardView({ initialData }: { initialData: any }) {
    const { dbStats, consumoCategoria, topInsumos, todosRegistros } = initialData;

    const catData = {
        labels: consumoCategoria.map((c: any) => c.categoria),
        datasets: [{
            data: consumoCategoria.map((c: any) => c.total),
            backgroundColor: ['#00c8a0', '#0080ff', '#ff6b35', '#ff4d6d', '#facc15', '#a855f7', '#64748b', '#22c55e', '#eab308'],
            borderWidth: 0
        }]
    };

    const topData = {
        labels: topInsumos.map((t: any) => t.insumo),
        datasets: [{
            label: 'Consumo',
            data: topInsumos.map((t: any) => t.total),
            backgroundColor: 'rgba(0, 200, 160, 0.4)',
            borderColor: '#00c8a0',
            borderWidth: 1,
            borderRadius: 4
        }]
    };

    // Calculate Evolução Mensal natively based on records
    const evolucaoMensal = useMemo(() => {
        const map: Record<string, number> = {};
        todosRegistros.forEach((r: any) => {
            const t = r.consumos?.reduce((s: number, c: any) => s + c.quantidade, 0) || 0;
            if (!map[r.periodo]) map[r.periodo] = 0;
            map[r.periodo] += t;
        });
        const sorted = Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
        return {
            labels: sorted.map(i => i[0]),
            datasets: [{
                label: 'Volume Total',
                data: sorted.map(i => i[1]),
                backgroundColor: 'rgba(0, 128, 255, 0.2)',
                borderColor: '#0080ff',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        };
    }, [todosRegistros]);

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#5a7090', font: { family: "'Syne', sans-serif" } } }
        },
        scales: {
            y: { grid: { color: 'rgba(30,45,69,0.5)' }, ticks: { color: '#5a7090' } },
            x: { grid: { display: false }, ticks: { color: '#5a7090' } }
        }
    };

    const pieOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#5a7090', font: { family: "'Syne', sans-serif" } } }
        }
    };

    return (
        <>
            <div className="stats-grid">
                <StatCard label="Unidades" value={dbStats?.unidades || 0} sub="cadastradas" colorClass="c-green" />
                <StatCard label="Períodos" value={dbStats?.periodos || 0} sub="registrados" colorClass="c-blue" />
                <StatCard label="Exames" value={dbStats?.exames || 0} sub="acumulados" />
                <StatCard label="Pacientes" value={dbStats?.pacientes || 0} sub="atendimentos" colorClass="c-orange" />
                <StatCard label="Registros" value={dbStats?.registros || 0} sub="no sistema" />
                <StatCard label="Insumos" value={dbStats?.insumosMapeados || 65} sub="mapeados" colorClass="c-green" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <Card title="Por Categoria">
                    <div className="chart-container">
                        {consumoCategoria.length > 0 ? <Doughnut data={catData} options={pieOptions} /> : <div className="empty-state"><p>Sem dados</p></div>}
                    </div>
                </Card>
                <Card title="Top 10 Insumos">
                    <div className="chart-container">
                        {topInsumos.length > 0 ? <Bar data={topData} options={options} /> : <div className="empty-state"><p>Sem dados</p></div>}
                    </div>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Card title="Evolução Mensal">
                    <div className="chart-container chart-sm">
                        {evolucaoMensal.labels.length > 0 ? <Line data={evolucaoMensal} options={options} /> : <div className="empty-state"><p>Sem dados</p></div>}
                    </div>
                </Card>
                <Card title="Últimos Registros">
                    <div className="table-wrap" style={{ border: 'none' }}>
                        <table>
                            <thead>
                                <tr><th>Unidade</th><th>Período</th><th>Exames</th><th>Volume</th></tr>
                            </thead>
                            <tbody>
                                {todosRegistros.slice(0, 5).map((r: any) => {
                                    const t = r.consumos?.reduce((s: number, c: any) => s + c.quantidade, 0) || 0;
                                    return (
                                        <tr key={r.id}>
                                            <td style={{ fontWeight: 700 }}>{r.unidade}</td>
                                            <td>{r.periodo}</td>
                                            <td>{r.exames}</td>
                                            <td style={{ color: 'var(--accent)' }}>{t}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {todosRegistros.length === 0 && <div className="empty-state" style={{ padding: '20px' }}><p>Nenhum registro encontrado</p></div>}
                    </div>
                </Card>
            </div>
        </>
    )
}
