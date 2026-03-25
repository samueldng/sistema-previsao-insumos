'use client'

import React, { useState } from 'react';
import { Card, Button, Alert } from '@/components/ui';
import * as XLSX from 'xlsx';
import { importarLote } from '@/actions/registro';

export function UploadView() {
    const [status, setStatus] = useState<Record<string, string>>({});
    const [preview, setPreview] = useState<any[]>([]);
    const [activeTipo, setActiveTipo] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, tipo: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setStatus({ ...status, [tipo]: 'Lendo arquivo...' });

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                if (data.length > 0) {
                    setPreview(data);
                    setActiveTipo(tipo);
                    setStatus({ ...status, [tipo]: `✅ ${data.length} linhas lidas` });
                } else {
                    setStatus({ ...status, [tipo]: '❌ Arquivo vazio' });
                }
            } catch (err) {
                setStatus({ ...status, [tipo]: '❌ Erro ao ler planilha' });
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const confirmUpload = async () => {
        if (!activeTipo || preview.length === 0) return;
        setIsSaving(true);

        try {
            const res = await importarLote(activeTipo, preview);
            if (res.error) {
                alert(res.error);
            } else {
                alert('Planilha importada com sucesso e sincronizada com o banco de dados!');
                setPreview([]);
                setActiveTipo(null);
                window.location.reload(); // Recarrega para buscar do banco nos outros components
            }
        } catch (e) {
            alert('Erro de comunicação com o servidor.');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <>
            <Alert type="info">📋 Importe planilhas <strong>.xlsx</strong> ou <strong>.csv</strong>. O sistema mapeia colunas automaticamente. Colunas esperadas: <strong>Unidade · Período · Insumo · Quantidade</strong></Alert>

            <div className="upload-grid mb-4">
                <div>
                    <label className={`upload-zone ${status['pedidos'] ? 'has-data' : ''}`} style={{ display: 'block' }}>
                        <div className="upload-icon">📦</div>
                        <div className="upload-title">Pedidos / Consumo</div>
                        <div className="upload-hint">Histórico de insumos por unidade/período</div>
                        <div className="upload-status">{status['pedidos'] || 'Clique ou arraste o arquivo'}</div>
                        <input type="file" accept=".xlsx,.csv" onChange={e => handleUpload(e, 'pedidos')} />
                    </label>
                </div>
                <div>
                    <label className={`upload-zone ${status['exames'] ? 'has-data' : ''}`} style={{ display: 'block' }}>
                        <div className="upload-icon">🔬</div>
                        <div className="upload-title">Exames por Convênio</div>
                        <div className="upload-hint">Total de exames realizados por período</div>
                        <div className="upload-status">{status['exames'] || 'Clique ou arraste o arquivo'}</div>
                        <input type="file" accept=".xlsx,.csv" onChange={e => handleUpload(e, 'exames')} />
                    </label>
                </div>
                <div>
                    <label className={`upload-zone ${status['pacientes'] ? 'has-data' : ''}`} style={{ display: 'block' }}>
                        <div className="upload-icon">👥</div>
                        <div className="upload-title">Pacientes Atendidos</div>
                        <div className="upload-hint">Volume de atendimentos por unidade/período</div>
                        <div className="upload-status">{status['pacientes'] || 'Clique ou arraste o arquivo'}</div>
                        <input type="file" accept=".xlsx,.csv" onChange={e => handleUpload(e, 'pacientes')} />
                    </label>
                </div>
            </div>

            {preview.length > 0 && (
                <Card
                    title={`Pré-visualização de Importação (${preview.length} linhas)`}
                    headerContent={
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button size="sm" onClick={confirmUpload} disabled={isSaving}>{isSaving ? '⏳ Salvando...' : '✅ Salvar no Servidor'}</Button>
                            <Button size="sm" variant="danger" onClick={() => setPreview([])}>✕ Cancelar</Button>
                        </div>
                    }
                >
                    <div className="table-wrap" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    {Object.keys(preview[0] || {}).map(k => <th key={k}>{k}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {preview.slice(0, 15).map((p, i) => (
                                    <tr key={i}>
                                        {Object.values(p).map((val: any, tdIdx) => <td key={tdIdx}>{val}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {preview.length > 15 && <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '8px', textAlign: 'center' }}>+ {preview.length - 15} outras linhas detectadas não visíveis no preview.</div>}
                </Card>
            )}

            <Card title="Formato Esperado das Planilhas">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px' }}>
                    <div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, marginBottom: '8px' }}>PEDIDOS / CONSUMO</div>
                        <div className="table-wrap">
                            <table><thead><tr><th>Unidade</th><th>Período</th><th>Insumo</th><th>Qtd</th></tr></thead>
                                <tbody><tr><td>BIORIM</td><td>2025-01</td><td>Tubo Soro 5ml</td><td>500</td></tr><tr><td>BIORIM</td><td>2025-02</td><td>Luva P</td><td>300</td></tr></tbody></table>
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, marginBottom: '8px' }}>EXAMES POR CONVÊNIO</div>
                        <div className="table-wrap">
                            <table><thead><tr><th>Unidade</th><th>Período</th><th>Exames</th></tr></thead>
                                <tbody><tr><td>MATRIZ</td><td>2025-01</td><td>420</td></tr><tr><td>MATRIZ</td><td>2025-02</td><td>180</td></tr></tbody></table>
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, marginBottom: '8px' }}>PACIENTES ATENDIDOS</div>
                        <div className="table-wrap">
                            <table><thead><tr><th>Unidade</th><th>Período</th><th>Pacientes</th></tr></thead>
                                <tbody><tr><td>P.A</td><td>2025-01</td><td>380</td></tr><tr><td>P.A</td><td>2025-02</td><td>410</td></tr></tbody></table>
                        </div>
                    </div>
                </div>
            </Card>
        </>
    )
}
