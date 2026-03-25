'use client'

import React, { useState } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { UNIDADES, INSUMOS } from '@/lib/constants';
import { salvarRegistroManual, excluirRegistro, limparTodos } from '@/actions/registro';

export function ManualView({ todosRegistros }: { todosRegistros: any[] }) {
    const [isPending, setIsPending] = useState(false);

    async function handleSalvar(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);
        const fd = new FormData(e.currentTarget);
        const res = await salvarRegistroManual(fd);
        setIsPending(false);
        if (res?.error) alert('⚠️ ' + res.error);
        else {
            alert('✅ Registro salvo!');
            (e.target as HTMLFormElement).reset();
        }
    }

    async function handleExcluir(id: string) {
        if (!confirm('Excluir este registro?')) return;
        await excluirRegistro(id);
    }

    async function handleLimpar() {
        if (!confirm('Apagar todos os registros do banco?')) return;
        await limparTodos();
    }

    return (
        <form onSubmit={handleSalvar}>
            <Card title="Identificação do Período">
                <div className="form-grid mb-3">
                    <div className="form-group">
                        <label>Unidade</label>
                        <select name="unidade" required defaultValue="">
                            <option value="" disabled>Selecione...</option>
                            {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Período (AAAA-MM)</label>
                        <input type="text" name="periodo" placeholder="ex: 2025-03" required />
                    </div>
                    <div className="form-group">
                        <label>Total de Exames</label>
                        <input type="number" name="exames" min="0" placeholder="0" />
                    </div>
                    <div className="form-group">
                        <label>Pacientes Atendidos</label>
                        <input type="number" name="pacientes" min="0" placeholder="0" />
                    </div>
                </div>
            </Card>

            <Card
                title="Quantidades Consumidas por Insumo"
                headerContent={
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" type="reset">⟳ Zerar</Button>
                        <Button type="submit" disabled={isPending}>{isPending ? '⏳ Salvando...' : '💾 Salvar Registro'}</Button>
                    </div>
                }
            >
                <div className="manual-scroll">
                    <table className="manual-table">
                        <thead><tr><th>#</th><th>Insumo</th><th>Categoria</th><th style={{ textAlign: 'right' }}>Quantidade</th></tr></thead>
                        <tbody>
                            {INSUMOS.map((ins, i) => {
                                const isFirstOfCat = i === 0 || INSUMOS[i - 1].c !== ins.c;
                                return (
                                    <React.Fragment key={i}>
                                        {isFirstOfCat && <tr className="cat-sep"><td colSpan={4}>{ins.c}</td></tr>}
                                        <tr>
                                            <td style={{ color: 'var(--muted)', fontSize: '10px' }}>{i + 1}</td>
                                            <td style={{ fontFamily: `'Syne',sans-serif`, fontSize: '11px' }}>{ins.n}</td>
                                            <td><span className="tag">{ins.c}</span></td>
                                            <td style={{ textAlign: 'right' }}>
                                                <input type="number" name={`q${i}`} min="0" placeholder="0" />
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card
                title="Histórico de Registros"
                headerContent={<Button variant="danger" size="sm" onClick={handleLimpar}>🗑 Limpar Todos</Button>}
            >
                {!todosRegistros || todosRegistros.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">📭</div>
                        <p>Sem registros cadastrados</p>
                    </div>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr><th>Unidade</th><th>Período</th><th>Exames</th><th>Pacientes</th><th>Itens</th><th>Origem</th><th></th></tr>
                            </thead>
                            <tbody>
                                {todosRegistros.map(r => {
                                    const total = r.consumos?.reduce((s: number, c: any) => s + c.quantidade, 0) || 0;
                                    return (
                                        <tr key={r.id}>
                                            <td style={{ fontWeight: 700, fontFamily: `'Syne',sans-serif` }}>{r.unidade}</td>
                                            <td>{r.periodo}</td>
                                            <td>{r.exames}</td>
                                            <td>{r.pacientes}</td>
                                            <td><Badge colorClass="bg-green">{total}</Badge></td>
                                            <td><Badge colorClass={r.origem === 'manual' ? 'bg-blue' : 'bg-orange'}>{r.origem}</Badge></td>
                                            <td><Button variant="danger" size="sm" onClick={() => handleExcluir(r.id)}>✕</Button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </form>
    )
}
