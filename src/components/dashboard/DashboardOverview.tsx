import React from 'react';
import { 
  Users, 
  UserCheck, 
  AlertTriangle, 
  UserX, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  MessageCircle, 
  Dumbbell, 
  Sparkles,
  CreditCard,
  CheckCircle2,
  Calendar,
  Utensils,
  Activity,
  Bike
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { NavTab } from '../common/Header';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface DashboardOverviewProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenNewMemberModal: () => void;
  onOpenQuickSaleModal: () => void;
  onOpenNewExpenseModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  setActiveTab,
  onOpenNewMemberModal,
  onOpenQuickSaleModal,
  onOpenNewExpenseModal
}) => {
  const { 
    members, 
    metrics, 
    renewalAlerts, 
    transactions, 
    products, 
    trainers, 
    generateWhatsAppLink,
    renewMembership
  } = useGym();

  // Financial chart data breakdown
  const financialData = [
    { name: 'Membresías', total: metrics.membershipsRevenue, fill: '#f59e0b' },
    { name: 'Tienda / POS', total: metrics.posSalesTotal, fill: '#10b981' },
    { name: 'Egresos Totales', total: metrics.totalExpense, fill: '#f43f5e' }
  ];

  // Cashflow simulation over 4 weeks
  const cashflowTimeline = [
    { week: 'Sem 1', ingresos: 2150, egresos: 2500 },
    { week: 'Sem 2', ingresos: 1800, egresos: 1100 },
    { week: 'Sem 3', ingresos: 3200, egresos: 3200 },
    { week: 'Sem 4', ingresos: 2980, egresos: 350 }
  ];

  const recentTransactions = transactions.slice(0, 5);
  const urgentAlerts = renewalAlerts.slice(0, 4);

  return (
    <div className="space-y-4 pb-8">
      
      {/* KPI Metric Cards Grid - High Density Specs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Alumnos Activos */}
        <div 
          onClick={() => setActiveTab('members')}
          className="bg-white p-4 rounded-xl shadow-xs border border-gray-200 flex flex-col justify-between h-24 cursor-pointer hover:border-blue-400 transition-colors"
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Alumnos Activos</div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-800">{metrics.totalActiveMembers}</span>
            <span className="text-xs text-green-600 font-medium">+4% este mes</span>
          </div>
        </div>

        {/* Ingresos Totales */}
        <div 
          onClick={() => setActiveTab('finance')}
          className="bg-white p-4 rounded-xl shadow-xs border border-gray-200 flex flex-col justify-between h-24 cursor-pointer hover:border-blue-400 transition-colors"
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ingresos (Mes)</div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-800">S/ {(metrics.totalIncome || 0).toFixed(2)}</span>
            <span className="text-xs text-blue-600 font-medium">Cuotas + POS</span>
          </div>
        </div>

        {/* Egresos */}
        <div 
          onClick={() => setActiveTab('finance')}
          className="bg-white p-4 rounded-xl shadow-xs border border-gray-200 flex flex-col justify-between h-24 cursor-pointer hover:border-blue-400 transition-colors"
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Egresos (Mes)</div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-800">S/ {(metrics.totalExpense || 0).toFixed(2)}</span>
            <span className="text-xs text-slate-400 font-medium">Suministros/Local</span>
          </div>
        </div>

        {/* Vencimientos Urgentes */}
        <div 
          onClick={() => setActiveTab('alerts')}
          className="bg-white p-4 rounded-xl shadow-xs border border-red-100 flex flex-col justify-between h-24 bg-red-50/40 cursor-pointer hover:border-red-300 transition-colors"
        >
          <div className="text-xs font-semibold text-red-600 uppercase tracking-wider">Vencimientos (&le; 7 días)</div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-red-700">{renewalAlerts.length}</span>
            <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded uppercase font-bold">Alertas</span>
          </div>
        </div>

      </div>

      {/* Main Grid: High Density Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Table: Membresías Próximas a Vencer (from High Density layout) */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 flex flex-col overflow-hidden h-[340px]">
          <div className="p-3.5 px-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-tight flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Membresías Próximas a Vencer
            </h3>
            <button 
              onClick={() => setActiveTab('alerts')}
              className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              Ver todos ({renewalAlerts.length})
            </button>
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 sticky top-0 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-2 font-semibold uppercase text-[10px]">Alumno</th>
                  <th className="px-4 py-2 font-semibold uppercase text-[10px]">Membresía</th>
                  <th className="px-4 py-2 font-semibold uppercase text-[10px]">Fin</th>
                  <th className="px-4 py-2 font-semibold uppercase text-[10px] text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {renewalAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                      No hay membresías por vencer próximamente.
                    </td>
                  </tr>
                ) : (
                  renewalAlerts.slice(0, 6).map(alert => {
                    const memberObj = members.find(m => m.id === alert.memberId);
                    return (
                      <tr key={alert.memberId} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-4 py-2.5 font-medium text-slate-800">
                          {alert.memberName}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">
                          {alert.planName}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`font-semibold ${alert.isExpired ? 'text-red-600' : 'text-amber-600'}`}>
                            {alert.daysLeft < 0 ? `Vencido` : `${alert.daysLeft}d (${alert.endDate})`}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {memberObj ? (
                            <a
                              href={generateWhatsAppLink(memberObj)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded text-[11px] font-semibold text-slate-700 border border-gray-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-colors"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>Notificar</span>
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Flow Overview */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 flex flex-col overflow-hidden h-[340px]">
          <div className="p-3.5 px-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-tight flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-green-600" />
              Estructura Financiera (Ingresos vs Egresos)
            </h3>
            <button 
              onClick={() => setActiveTab('finance')}
              className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              Detalles
            </button>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `S/ ${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any) => [`S/ ${Number(value).toFixed(2)}`, 'Total']}
                  />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={40}>
                    {financialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#f43f5e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
              <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                <span className="text-[10px] text-gray-500 font-semibold uppercase">Membresías</span>
                <p className="text-xs font-bold text-blue-700">S/ {(metrics.membershipsRevenue || 0).toFixed(2)}</p>
              </div>
              <div className="bg-green-50/50 p-2 rounded-lg border border-green-100">
                <span className="text-[10px] text-gray-500 font-semibold uppercase">Tienda POS</span>
                <p className="text-xs font-bold text-green-700">S/ {(metrics.posSalesTotal || 0).toFixed(2)}</p>
              </div>
              <div className="bg-red-50/50 p-2 rounded-lg border border-red-100">
                <span className="text-[10px] text-gray-500 font-semibold uppercase">Gastos</span>
                <p className="text-xs font-bold text-red-700">S/ {(metrics.totalExpense || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Fitness, Nutrition & Spinning Studio Quick Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* Nutrición & Dietas */}
        <div 
          onClick={() => setActiveTab('nutrition')}
          className="bg-white p-4 rounded-xl shadow-xs border border-gray-200 hover:border-emerald-400 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Alimentación</span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Nutrición & Dietas
              </h4>
              <p className="text-[11px] text-slate-500">Pautas calóricas y macros</p>
            </div>
          </div>
          <span className="text-slate-400 group-hover:text-emerald-600 text-xs font-bold">&rarr;</span>
        </div>

        {/* Antropometría & Bioimpedancia */}
        <div 
          onClick={() => setActiveTab('measurements')}
          className="bg-white p-4 rounded-xl shadow-xs border border-gray-200 hover:border-indigo-400 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Evaluación Física</span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                Medidas & Bioimpedancia
              </h4>
              <p className="text-[11px] text-slate-500">Historial y comparativas</p>
            </div>
          </div>
          <span className="text-slate-400 group-hover:text-indigo-600 text-xs font-bold">&rarr;</span>
        </div>

        {/* Salón de Spinning */}
        <div 
          onClick={() => setActiveTab('spinning')}
          className="bg-white p-4 rounded-xl shadow-xs border border-gray-200 hover:border-cyan-400 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600">Ciclo Indoor</span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                Salón de Spinning
              </h4>
              <p className="text-[11px] text-slate-500">Croquis de sala & pases</p>
            </div>
          </div>
          <span className="text-slate-400 group-hover:text-cyan-600 text-xs font-bold">&rarr;</span>
        </div>

      </div>

      {/* Bottom POS Quick Bar - High Density Pattern */}
      <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 flex flex-wrap items-center gap-4 lg:gap-8">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1.5">Punto de Venta Rápido</div>
            <div className="flex flex-wrap gap-1.5">
              {products.slice(0, 4).map(prod => (
                <button
                  key={prod.id}
                  onClick={() => setActiveTab('store')}
                  className="bg-slate-800 border border-slate-700 text-white px-2.5 py-1 rounded text-xs hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  {prod.name} (S/ {(prod.salePrice ?? prod.purchaseCost ?? 0).toFixed(2)})
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block h-8 w-px bg-slate-800"></div>

          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Balance en Caja Hoy</div>
            <div className="text-base font-mono font-bold text-green-400">
              S/ {(metrics.netProfit || 0).toFixed(2)}
            </div>
          </div>
        </div>

        <button 
          onClick={() => setActiveTab('store')}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-transform active:scale-95 text-xs uppercase tracking-wider cursor-pointer"
        >
          Ir al Terminal POS &rarr;
        </button>
      </div>

    </div>
  );
};
