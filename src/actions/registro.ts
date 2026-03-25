'use server'

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { INSUMOS } from '@/lib/constants';

export async function salvarRegistroManual(formData: FormData) {
    const unidade = formData.get('unidade') as string;
    const periodo = formData.get('periodo') as string;
    const exames = parseInt(formData.get('exames') as string) || 0;
    const pacientes = parseInt(formData.get('pacientes') as string) || 0;

    if (!unidade || !periodo) {
        return { error: 'Unidade e Período são obrigatórios.' };
    }

    // Parse quantities array using naming q0, q1...
    const consumosToAdd = INSUMOS.map((ins, i) => {
        const qStr = formData.get(`q${i}`);
        const q = parseInt(qStr as string);
        if (q && q > 0) {
            return { insumoNome: ins.n, categoria: ins.c, quantidade: q };
        }
        return null;
    }).filter(Boolean) as any[];

    try {
        const existing = await db.registro.findUnique({
            where: { unidade_periodo: { unidade, periodo } }
        });

        if (existing) {
            // Overwrite
            await db.$transaction([
                db.consumo.deleteMany({ where: { registroId: existing.id } }),
                db.registro.update({
                    where: { id: existing.id },
                    data: {
                        exames,
                        pacientes,
                        origem: 'manual',
                        consumos: {
                            create: consumosToAdd
                        }
                    }
                })
            ]);
        } else {
            // Create new
            await db.registro.create({
                data: {
                    unidade,
                    periodo,
                    exames,
                    pacientes,
                    origem: 'manual',
                    consumos: {
                        create: consumosToAdd
                    }
                }
            });
        }

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Erro ao salvar o registro no banco de dados.' };
    }
}

export async function excluirRegistro(id: string) {
    try {
        await db.registro.delete({ where: { id } });
        revalidatePath('/');
        return { success: true };
    } catch (err) {
        return { error: 'Erro ao excluir' };
    }
}

export async function limparTodos() {
    try {
        await db.registro.deleteMany();
        revalidatePath('/');
        return { success: true };
    } catch (err) {
        return { error: 'Erro ao limpar dados' };
    }
}

// BULK IMPORT LOGIC
export async function importarLote(tipo: string, jsonList: any[]) {
    try {
        for (const linha of jsonList) {
            // Normalize chaves da planilha (remove espaços, minúsculo)
            const getCol = (names: string[]) => {
                const key = Object.keys(linha).find(k => names.includes(k.trim().toLowerCase()));
                return key ? linha[key] : null;
            };

            const unidadeRaw = getCol(['unidade', 'und', 'hospital', 'clinica']);
            const periodoRaw = getCol(['periodo', 'período', 'mes', 'mês', 'data']);

            if (!unidadeRaw || !periodoRaw) continue; // Pula linhas inválidas

            const unidade = unidadeRaw.toString().trim();
            const periodo = periodoRaw.toString().trim();

            // Busca ou cria o cabecalho (Unidade + Período)
            let registro = await db.registro.findUnique({
                where: { unidade_periodo: { unidade, periodo } }
            });

            if (!registro) {
                registro = await db.registro.create({
                    data: { unidade, periodo, exames: 0, pacientes: 0, origem: 'import' }
                });
            }

            // Dependendo do TIPO de aquivo subido, injeta os dados no registro base:
            if (tipo === 'pedidos') {
                const insumoStr = getCol(['insumo', 'item', 'material', 'produto']);
                const qtdStr = getCol(['qtd', 'quantidade', 'volume', 'total']);

                if (insumoStr && qtdStr !== null) {
                    const quantidade = Number(qtdStr);
                    // Procura a categoria no Insumo mapeado (fallback Padrão)
                    const mapeado = INSUMOS.find(i => i.n.toLowerCase() === insumoStr.toString().trim().toLowerCase());
                    const categoria = mapeado ? mapeado.c : 'Sem Categoria';

                    // Upsert Consumo
                    const existente = await db.consumo.findFirst({
                        where: { registroId: registro.id, insumoNome: insumoStr.toString().trim() }
                    });

                    if (existente) {
                        await db.consumo.update({
                            where: { id: existente.id },
                            data: { quantidade: existente.quantidade + quantidade }
                        });
                    } else {
                        await db.consumo.create({
                            data: {
                                registroId: registro.id,
                                insumoNome: insumoStr.toString().trim(),
                                categoria,
                                quantidade
                            }
                        });
                    }
                }
            }
            else if (tipo === 'exames') {
                const totalStr = getCol(['total', 'exames', 'qtd', 'quantidade']);
                if (totalStr !== null) {
                    await db.registro.update({
                        where: { id: registro.id },
                        data: { exames: registro.exames + Number(totalStr) }
                    });
                }
            }
            else if (tipo === 'pacientes') {
                const pacStr = getCol(['pacientes', 'atendimentos', 'total']);
                if (pacStr !== null) {
                    await db.registro.update({
                        where: { id: registro.id },
                        data: { pacientes: registro.pacientes + Number(pacStr) }
                    });
                }
            }
        }
        revalidatePath('/');
        return { success: true };
    } catch (e: any) {
        return { error: 'Falha na importação do arquivo: ' + e.message };
    }
}
