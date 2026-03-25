'use client'

import React, { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { UNIDADES } from '@/lib/constants';

export function ReportView({ dbRegistros }: { dbRegistros: any[] }) {
    const [unidade, setUnidade] = useState('todas');
    const [metodo, setMetodo] = useState('media');
    const [margem, setMargem] = useState(10);
    const [tipo, setTipo] = useState('mensal');
    const [relatorio, setRelatorio] = useState<any>(null);

    function gerarRelatorio() {
        const unitsData: any[] = [];
        let grandTotalItems = 0;
        let grandTotalExames = 0;

        let selectedUnidades = Array.from(new Set(dbRegistros.map(r => r.unidade)));
        if (unidade !== 'todas') {
            selectedUnidades = [unidade];
        }

        selectedUnidades.forEach(un => {
            const regs = dbRegistros.filter(r => r.unidade === un);
            if (regs.length === 0) return;

            let exames = 0;
            let pacientes = 0;
            const consumosMap: any = {};

            regs.forEach(r => {
                exames += r.exames;
                pacientes += r.pacientes;
                r.consumos?.forEach((c: any) => {
                    if (!consumosMap[c.insumoNome]) consumosMap[c.insumoNome] = { cat: c.categoria, qty: 0 };

                    let val = c.quantidade;
                    if (metodo === 'media') val = val / regs.length;

                    const fator = tipo === 'quinzenal' ? 0.5 : 1;
                    val = Math.max(0, Math.round(val * (1 + margem / 100) * fator));

                    consumosMap[c.insumoNome].qty += val;
                });
            });

            const itemsList = Object.entries(consumosMap).map(([k, v]: any) => ({
                id: k,
                cat: v.cat,
                qty: v.qty
            })).sort((a: any, b: any) => b.qty - a.qty);

            const totalUnit = itemsList.reduce((s, i) => s + i.qty, 0);
            if (totalUnit > 0) {
                grandTotalItems += totalUnit;
                grandTotalExames += exames;
                unitsData.push({ un, exames, pacientes, total: totalUnit, items: itemsList });
            }
        });

        if (unitsData.length === 0) return alert('Sem dados suficientes no banco para gerar esse relatório.');
        setRelatorio({ units: unitsData, general: { items: grandTotalItems, exames: grandTotalExames } });
    }

    function handleImprimir() {
        if (!relatorio) return alert('Gere o relatório primeiro.');
        window.print();
    }

    return (
        <>
            <div className="card no-print">
                <div className="card-header"><span className="card-title">Configurar Relatório Consolidado</span></div>
                <div className="form-grid mb-3">
                    <div className="form-group">
                        <label>Unidade</label>
                        <select value={unidade} onChange={e => setUnidade(e.target.value)}>
                            <option value="todas">Relatório Geral (Todas)</option>
                            {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Método</label>
                        <select value={metodo} onChange={e => setMetodo(e.target.value)}>
                            <option value="media">Média Simples</option>
                            <option value="maximo">Pico Máximo</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Margem (%)</label>
                        <input type="number" value={margem} onChange={e => setMargem(Number(e.target.value))} min="0" max="100" />
                    </div>
                    <div className="form-group">
                        <label>Tipo</label>
                        <select value={tipo} onChange={e => setTipo(e.target.value)}>
                            <option value="mensal">Mensal (30 dias)</option>
                            <option value="quinzenal">Quinzenal (15 dias)</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ alignSelf: 'flex-end', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <Button onClick={gerarRelatorio}>📋 Gerar</Button>
                        <Button variant="outline" onClick={handleImprimir}>🖨️ Imprimir</Button>
                    </div>
                </div>
            </div>

            <div id="relatorio-area">
                {!relatorio ? (
                    <div className="empty-state">
                        <div className="icon">📋</div>
                        <p>Configure e clique em <strong>Gerar Relatório</strong></p>
                    </div>
                ) : (
                    <div className="print-area" style={{ background: '#fff', padding: '40px', color: '#111', borderRadius: '12px' }}>

                        <div className="print-logo" style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #00c8a0', paddingBottom: '16px', marginBottom: '24px' }}>
                            <img src="/logo.png" alt="Laboratório Hemolab" style={{ height: '70px', objectFit: 'contain' }} />
                        </div>

                        <div className="print-section-title">📊 Resumo Operacional {unidade !== 'todas' ? `- ${unidade}` : 'Geral'}</div>
                        <table className="print-summary-table" style={{ width: '100%', marginBottom: '30px', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#1a2235', color: '#fff' }}>
                                    <th style={{ padding: '8px' }}>Métrica</th>
                                    <th style={{ padding: '8px' }}>Projeção</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Total Previsto de Insumos</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>{relatorio.general.items.toLocaleString('pt-BR')} ítens</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Base Estimada de Exames</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>{relatorio.general.exames.toLocaleString('pt-BR')}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="print-section-title">🏥 Detalhamento Consolidado</div>
                        {relatorio.units.map((u: any, idx: number) => (
                            <div key={idx} className="print-unit-section" style={{ marginBottom: '32px', breakInside: 'avoid' }}>
                                <div className="print-unit-head" style={{ background: '#1a2235', color: '#fff', padding: '8px 12px', fontWeight: 'bold' }}>
                                    {u.un} - {u.total.toLocaleString('pt-BR')} INSUMOS
                                </div>
                                <table className="print-unit-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                    <thead>
                                        <tr style={{ background: '#f5f5f5' }}>
                                            <th style={{ padding: '6px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Categ.</th>
                                            <th style={{ padding: '6px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Insumo</th>
                                            <th style={{ padding: '6px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Qtd. Prevista</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {u.items.map((it: any, i: number) => (
                                            <tr key={i}>
                                                <td style={{ padding: '4px 6px', borderBottom: '1px solid #eee', color: '#666' }}>{it.cat}</td>
                                                <td style={{ padding: '4px 6px', borderBottom: '1px solid #eee', fontWeight: 600 }}>{it.id}</td>
                                                <td style={{ padding: '4px 6px', borderBottom: '1px solid #eee', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#007755' }}>
                                                    {it.qty.toLocaleString('pt-BR')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
