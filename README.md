# 🧪 Sistema de Previsão de Insumos - Hemolab

Sistema robusto, centralizado e seguro para previsibilidade logística, relatórios de consumo e projeção de estoque, desenvolvido primeiramente como um monólito HTML e refatorado inteiramente para **Next.js (App Router), Prisma ORM e SQLite**. O Layout é estritamente customizado utilizando a iconografia e identidade visual originais.

---

## 🛠️ Tecnologias
- **Frontend / Servidor:** Next.js (React 18+)
- **Banco de Dados:** SQLite hospedado localmente
- **Modelagem de Dados:** Prisma ORM
- **Visualização de Dados:** Chart.js com `react-chartjs-2`
- **Leitura Algorítmica de Planilhas:** biblioteca `xlsx`

---

## 🚀 Como Iniciar

1. Certifique-se de que o **Node.js** está instalado em seu computador.
2. Navegue até a pasta raiz do projeto pelo terminal:
   ```bash
   cd sistema-previsao-insumos
   ```
3. Instale as dependências estruturais:
   ```bash
   npm install
   ```
4. Atualize ou construa o banco de dados (SQLite local):
   ```bash
   npx prisma db push
   ```
5. Inicie o servidor de testes:
   ```bash
   npm run dev
   ```
6. Acesse `http://localhost:3000` em seu Google Chrome.

---

## 📋 Como funciona a Importação de Planilhas? (Importar)

A aba **Importar** permite injetar dados históricos brutos (meses ou anos de uso de insumos passados) rapidamente no banco de dados. Você não precisa mais recadastrar tudo. O processo de injeção é realizado **diretamente a partir de planilhas de Excel (`.xlsx`) ou Arquivos CSV (`.csv`)**.

O sistema possui uma inteligência "Tolerante a Nomes". Ele não obriga que a coluna tenha aquele *único* nome exato. Basta que a linha principal (o Titulo da Planilha) obedeça às colunas alvo esperadas para a seção.

O painel suporta **três caixas (arquivos) diferentes**, destinados ao agrupamento específico:

### 1. 📦 Pedidos / Consumo de Insumos (O mais importante)
Esta tabela carrega seu histórico de insumos consumidos.

- **Colunas Obrigatórias Esperadas:**
  - `Unidade` (ou *und, hospital, clinica*)
  - `Período` (ou *mes, data*) → Exemplo: `2025-01`
  - `Insumo` (ou *item, material, produto*) → O nome exato que está mapeado na biblioteca.
  - `Quantidade` (ou *qtd, total, volume*)
  
*Se a sua planilha do mês possui 200 elementos "Tubo Soro" numa mesma unidade e período, o sistema agrupará e incrementará esse total.*

### 2. 🔬 Exames por Convênio
Esta tabela injeta o "Volume Secundário", indicando quantos exames foram processados no mês.

- **Colunas Obrigatórias Esperadas:**
  - `Unidade`
  - `Período`
  - `Exames` (ou *total, qtd*)

### 3. 👥 Pacientes Atendidos
Esta tabela injeta o indicador humano "Tickets", mensurando quantos pacientes físicos passaram no balcão.

- **Colunas Obrigatórias Esperadas:**
  - `Unidade`
  - `Período`
  - `Pacientes` (ou *atendimentos, total*)

### Fluxo de Upload:

1. Acesse o sistema e entre na aba **"📁 Importar"**.
2. Identifique uma das três categorias e arraste seu arquivo `.xlsx` (ou clique para abrira caixa de arquivos do seu windows).
3. O Arquivo ficará **Verde** (indicando status *Lendo arquivo*).
4. Desça a página, você notará uma "Tabela de Visualização" renderizada na própria página com as 15 primeiras linhas de como o sistema capturou o documento. Isso protege você de subir informações quebradas!
5. Pressione **"✅ Salvar no Servidor"**. O sistema de ações do Next.js engolirá o pacote e transacionará todas as unidades dentro do Prisma SQLite, apagando o que for nulo, e concatenando as sobreposições.
6. Uma notificação saltará em sua tela confirmando o mapeamento, recarregando a página e repopulando nativamente todos os painéis e gráficos.

---

## 🔮 Conhecendo as Outras Abas Base

### 📊 Dashboard
Onde os gráficos reativos de `Chart.js` convertem todos os montantes injetados e importados de forma viva nos comparativos e no status lateral verde indicando que a comunicação `SQLite -> Next.js` está ativa.

### ✏️ Entrada Manual
Para um lançamento urgente onde baixar e reescrever sua planilha excel é "gastar bala de canhão", selecione de 0 até o infinito Insumos Mapeados no formato vertical preenchendo as caixas de texto lateral com as quantidades daquele período da Unidade X. Salvar enviará ele para o DB sem estressos.

### 🔮 Previsão
A Joia Algorítmica do sistema. Ele puxa o agrupamento total isolando a unidade do filtro e extrai o consumo passado de exames dividindo por períodos para construir uma régua de previsão confiando no método escolhido: *Média Simples* ou *Pico Máximo*.
Aplica em memória a sua percentagem de "Margem de Segurança" (de 0 a 100%) garantindo que o Hemolab nunca fique sem suprimentos no momento de stress.

### 📈 Análises (Ranking Mensal)
Cruza e lista em formato Top-15 Visual o peso logístico das saídas e queima de itens do estoque e compara "Bar on Bar" (Barras empilhadas) as unidades com maior gargalo divididas em sua exata fatia por categoria material.

### 📋 Relatório Consolidado
Permite destilar um documento de extração limpa a ser salvo como **PDF via Print** de todas as previsões ou da unidade escolhida, contendo um cabeçalho customizado oficial com o logo do *Dr. Alexson Carvalho* apto para liberação orçamentária no C-Level.
