import { Header } from '@/components/layout/Header'
import { ClientTabs } from '@/components/layout/ClientTabs'
import { getDashboardStats, getTodosRegistros, getTopInsumos, getConsumoPorCategoria } from '@/lib/dal'

export default async function Page() {
  const [dbStats, todosRegistros, topInsumos, consumoCategoria] = await Promise.all([
    getDashboardStats(),
    getTodosRegistros(),
    getTopInsumos(15),
    getConsumoPorCategoria()
  ]);

  const initialData = {
    dbStats,
    todosRegistros,
    topInsumos,
    consumoCategoria
  };

  const dataStatus = todosRegistros.length > 0 ? 'Dados sincronizados' : 'Sem dados carregados';

  return (
    <div id="app">
      <Header dataStatus={dataStatus} />
      <ClientTabs initialData={initialData} />
    </div>
  )
}
