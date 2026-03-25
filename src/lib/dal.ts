import db from './db';
import { INSUMOS } from './constants';

export async function getDashboardStats() {
    const [unidadesDistintas, periodosDistintos, totalRegistros, totais] = await Promise.all([
        db.registro.findMany({ select: { unidade: true }, distinct: ['unidade'] }),
        db.registro.findMany({ select: { periodo: true }, distinct: ['periodo'] }),
        db.registro.count(),
        db.registro.aggregate({
            _sum: { exames: true, pacientes: true }
        })
    ]);

    const inDb = totalRegistros > 0;

    return {
        unidades: inDb ? unidadesDistintas.length : 24, // fallback to template value if empty
        periodos: periodosDistintos.length,
        exames: totais._sum.exames || 0,
        pacientes: totais._sum.pacientes || 0,
        registros: totalRegistros,
        insumosMapeados: INSUMOS.length
    };
}

export async function getConsumoPorCategoria() {
    const consumos = await db.consumo.groupBy({
        by: ['categoria'],
        _sum: {
            quantidade: true
        }
    });
    return consumos.map(c => ({ categoria: c.categoria, total: c._sum.quantidade || 0 }));
}

export async function getTopInsumos(limit = 10) {
    const tops = await db.consumo.groupBy({
        by: ['insumoNome'],
        _sum: { quantidade: true },
        orderBy: {
            _sum: { quantidade: 'desc' }
        },
        take: limit
    });
    return tops.map(t => ({ insumo: t.insumoNome, total: t._sum.quantidade || 0 }));
}

export async function getEvolucaoMensal() {
    const regs = await db.registro.findMany({
        select: { periodo: true, consumos: { select: { quantidade: true } } },
        orderBy: { periodo: 'asc' }
    });

    const map: Record<string, number> = {};
    for (const r of regs) {
        if (!map[r.periodo]) map[r.periodo] = 0;
        map[r.periodo] += r.consumos.reduce((s, c) => s + c.quantidade, 0);
    }

    return Object.entries(map).map(([periodo, total]) => ({ periodo, total }));
}

export async function getTodosRegistros() {
    return db.registro.findMany({
        include: { consumos: true },
        orderBy: { createdAt: 'desc' }
    });
}
