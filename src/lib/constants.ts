export const UNIDADES = ['MULTICLIN AA', 'BIORIM', 'CENTRO MEDICO', 'CLINICA RIBEIRO', 'DR SAUDE', 'MATERGIN', 'MATRIZ HEMOLAB', 'SANTA TEREZA', 'CIOMED BARRA DO CORDA', 'BOM LUGAR', 'CIOMED ESP', 'SÃO THIAGO ESP', 'DR PEDRO', 'BEM ESTAR LDP', 'DR MARK LDP', 'ULTRAMEDIC LDP', 'BEM ESTAR LDR', 'MAIS SAÚDE', 'MARIA BRAGA', 'DRA SAUDE', 'MULTICLIN SM', 'SÃO ROBERTO', 'SATUBINHA', 'VITALES'];

export type InsumoCat = 'Tubos de Coleta' | 'Punção e Coleta' | 'Kits de Coleta' | 'Ginecologia' | 'Testes Especializados' | 'EPIs e Segurança' | 'Insumos Técnicos';

export interface Insumo {
    c: string;
    n: string;
}

export const INSUMOS: Insumo[] = [
    { c: 'Tubos de Coleta', n: 'Tubo de Soro 3,5 ml' }, { c: 'Tubos de Coleta', n: 'Tubo de Soro 5,0 ml' },
    { c: 'Tubos de Coleta', n: 'Tubo de EDTA 2,0 ml' }, { c: 'Tubos de Coleta', n: 'Tubo de EDTA 4,0 ml' },
    { c: 'Tubos de Coleta', n: 'Tubo de Citrato 4,0 ml' }, { c: 'Tubos de Coleta', n: 'Tubo de Fluoreto 4,0 ml' },
    { c: 'Tubos de Coleta', n: 'Tubo de Heparina 4,0 ml (Verde)' }, { c: 'Tubos de Coleta', n: 'Tubo de Heparina 6,0 ml (Azul)' },
    { c: 'Tubos de Coleta', n: 'Tubo K2 EDTA Gel (Sexagem Fetal)' }, { c: 'Tubos de Coleta', n: 'Tubo Trace 6,0 ml' },
    { c: 'Tubos de Coleta', n: 'Tubo Soro Âmbar c/ Gel' }, { c: 'Tubos de Coleta', n: 'Tubo Âmbar EDTA' },
    { c: 'Tubos de Coleta', n: 'Tubo de Transporte' },
    { c: 'Punção e Coleta', n: 'Scalp 23G a Vácuo' }, { c: 'Punção e Coleta', n: 'Scalp 25G a Vácuo' },
    { c: 'Punção e Coleta', n: 'Agulha Vácuo 25x07 22G' }, { c: 'Punção e Coleta', n: 'Escalpe Seringa Infusão 23G' },
    { c: 'Punção e Coleta', n: 'Seringa 5ml' }, { c: 'Punção e Coleta', n: 'Seringa 10ml' }, { c: 'Punção e Coleta', n: 'Seringa 20ml' },
    { c: 'Punção e Coleta', n: 'Lanceta 28G x 1,8mm' }, { c: 'Punção e Coleta', n: 'Garrote em Tiras 45cm' },
    { c: 'Punção e Coleta', n: 'Algodão Hidrófilo 500g' }, { c: 'Punção e Coleta', n: 'Curativo Redondo (Blood Stop)' },
    { c: 'Punção e Coleta', n: 'Curativo Infantil' },
    { c: 'Kits de Coleta', n: 'Kit Urina Universal 12ml' }, { c: 'Kits de Coleta', n: 'Coletor Universal Estéril 80ml' },
    { c: 'Kits de Coleta', n: 'Coletor Universal Estéril 50ml' }, { c: 'Kits de Coleta', n: 'Coletor Urina 24h 2L' },
    { c: 'Kits de Coleta', n: 'Coletor Urina 24h 3L c/ HCl' }, { c: 'Kits de Coleta', n: 'Coletor Urina Infantil 100ml' },
    { c: 'Kits de Coleta', n: 'Salivette Cortisol' }, { c: 'Kits de Coleta', n: 'Swab Plástico' },
    { c: 'Kits de Coleta', n: 'Swab Stuart' }, { c: 'Kits de Coleta', n: 'Swab Amies' },
    { c: 'Kits de Coleta', n: 'Kit Citologia Líquida' },
    { c: 'Ginecologia', n: 'Espéculo Vaginal P' }, { c: 'Ginecologia', n: 'Espéculo Vaginal M' }, { c: 'Ginecologia', n: 'Espéculo Vaginal G' },
    { c: 'Ginecologia', n: 'Espátula de Ayres' }, { c: 'Ginecologia', n: 'Escova Cervical' },
    { c: 'Ginecologia', n: 'Lâmina Fosca 26x76mm' }, { c: 'Ginecologia', n: 'Fixador de Célula' },
    { c: 'Testes Especializados', n: 'Teste Tolerância Glicose' }, { c: 'Testes Especializados', n: 'Teste Tolerância Lactose' },
    { c: 'Testes Especializados', n: 'Teste do Pezinho' }, { c: 'Testes Especializados', n: 'Teste de Paternidade' },
    { c: 'Testes Especializados', n: 'Kit Toxicológico' }, { c: 'Testes Especializados', n: 'Kit Quantiferon' },
    { c: 'Testes Especializados', n: 'Tiras Glicose On Call Plus II' },
    { c: 'EPIs e Segurança', n: 'Máscara Tripla' }, { c: 'EPIs e Segurança', n: 'Touca Sanfonada' },
    { c: 'EPIs e Segurança', n: 'Luva de Procedimento Látex P' }, { c: 'EPIs e Segurança', n: 'Luva de Procedimento Látex M' },
    { c: 'EPIs e Segurança', n: 'Avental Descartável' }, { c: 'EPIs e Segurança', n: 'Saco Lixo Infectante 30L' },
    { c: 'EPIs e Segurança', n: 'Caixa Perfuro Cortante (Descartex)' },
    { c: 'Insumos Técnicos', n: 'Álcool Líquido 70%' }, { c: 'Insumos Técnicos', n: 'Álcool em Gel' },
    { c: 'Insumos Técnicos', n: 'Álcool 99%' }, { c: 'Insumos Técnicos', n: 'Lâmina de Bisturi N.22' },
    { c: 'Insumos Técnicos', n: 'Ponteira Amarela 200μl' }, { c: 'Insumos Técnicos', n: 'Gaze tipo Queijo' },
    { c: 'Insumos Técnicos', n: 'Papel Lençol para Maca' }, { c: 'Insumos Técnicos', n: 'Palitos de Picolé' },
    { c: 'Insumos Técnicos', n: 'Papel A4' },
];

// We can derive CATS from INSUMOS logic easily, or just hardcode it
export const CATS = Array.from(new Set(INSUMOS.map(i => i.c)));
export const CAT_COLORS = ['#00c8a0', '#0080ff', '#ff6b35', '#ff4d6d', '#a855f7', '#f59e0b', '#06b6d4'];

export const METODO_LABEL: Record<string, string> = {
    media: 'Média Simples',
    media3: 'Média 3 Per.',
    media6: 'Média 6 Per.',
    tendencia: 'Tendência Linear',
    maximo: 'Pico Máximo'
};
