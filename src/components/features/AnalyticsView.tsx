'use client'

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui';
import { UNIDADES, CATS } from '@/lib/constants';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function AnalyticsView({ topInsumos, consumoCategoria, dbRegistros }: any) {
    const [un, setUn] = useState('todas');
    const [cat, setCat] = useState('todas');

    // Filter top insumos by applying local filters since we do this client side for fast interaction
    const filteredTopInsumos = useMemo(() => {
        let validRegs = dbRegistros;
        if (un !== 'todas') validRegs = validRegs.filter((r: any) => r.unidade === un);

        const map: Record<string, number> = {};
        validRegs.forEach((r: any) => {
            r.consumos?.forEach((c: any) => {
                if (cat !== 'todas' && c.categoria !== cat) return;
                if (!map[c.insumoNome]) map[c.insumoNome] = 0;
                map[c.insumoNome] += c.quantidade;
            });
        });
        return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 15).map(x => ({ insumo: x[0], total: x[1] }));
    }, [un, cat, dbRegistros]);

    // Consumo comparativo: stacked bar
    const barData = useMemo(() => {
        const units = UNIDADES;
        const mappedCats = cat === 'todas' ? CATS.slice(0, 5) : [cat]; // Show max 5 cats if all

        const datasets = mappedCats.map((c, i) => {
            const colors = ['#00c8a0', '#0080ff', '#ff6b35', '#a855f7', '#facc15'];
            const data = units.map(u => {
                const regs = dbRegistros.filter((r: any) => r.unidade === u);
                let total = 0;
                regs.forEach((r: any) => {
                    r.consumos?.forEach((co: any) => {
                        if (co.categoria === c) total += co.quantidade;
                    });
                });
                return total;
            });
            return {
                label: c,
                data,
                backgroundColor: colors[i % colors.length]
            };
        });

        return { labels: units, datasets };
    }, [cat, dbRegistros]);

    const barOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { stacked: true, grid: { display: false }, ticks: { color: '#5a7090' } },
            y: { stacked: true, grid: { color: 'rgba(30,45,69,0.5)' }, ticks: { color: '#5a7090' } }
        },
        plugins: {
            legend: { position: 'bottom', labels: { color: '#5a7090' } }
        }
    };

    return (
        <>
            <div className="flex gap-3 mb-3 flex-wrap">
                <div className="form-group" style={{ flex: 1, minWidth: '170px' }}>
                    <label>Unidade</label>
                    <select value={un} onChange={e => setUn(e.target.value)}>
                        <option value="todas">Todas</option>
                        {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: '170px' }}>
                    <label>Categoria</label>
                    <select value={cat} onChange={e => setCat(e.target.value)}>
                        <option value="todas">Todas</option>
                        {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <Card title="Top 15 Insumos por Volume">
                    <div style={{ maxHeight: '380px', overflowY: 'auto', paddingRight: '8px' }}>
                        {filteredTopInsumos.length === 0 ? <div className="empty-state"><p>Sem dados processados</p></div> :
                            filteredTopInsumos.map((t: any, i: number) => {
                                const mx = filteredTopInsumos[0]?.total || 1;
                                const pct = Math.round(t.total / mx * 100);
                                return (
                                    <div key={i} style={{ padding: '7px 3px', borderBottom: '1px solid rgba(30,45,69,0.5)' }}>
                                        <div className="flex justify-between items-center" style={{ marginBottom: '2px' }}>
                                            <div style={{ fontSize: '11px', flex: 1, marginRight: '9px', fontFamily: `'Syne',sans-serif` }}>{i + 1}. {t.insumo}</div>
                                            <div style={{ fontFamily: `'DM Mono',monospace`, fontSize: '12px', color: 'var(--accent)' }}>{t.total.toLocaleString('pt-BR')}</div>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </Card>
                <Card title="Comparativo por Unidade (Filtrado)">
                    <div className="chart-container" style={{ height: '380px' }}>
                        <Bar data={barData} options={barOptions} />
                    </div>
                </Card>
            </div>
        </>
    )
}
