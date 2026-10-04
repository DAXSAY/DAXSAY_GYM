import React, { useState } from 'react';
import { 
  BadgeDollarSign, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  ArrowDownRight, 
  ArrowUpRight, 
  Calendar, 
  Receipt, 
  Trash2, 
  Download, 
  PieChart as PieIcon,
  CreditCard,
  Building,
  Wrench,
  Users2,
  PackageCheck
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { Transaction, TransactionType, TransactionCategory, PaymentMethod } from '../../types/gym';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';

interface FinanceModuleProps {
  onOpenNewExpenseModal: () => void;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({ onOpenNewExpenseModal }) => {
  const { transactions, addTransaction, deleteTransaction, metrics } = useGym();

  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom New Income modal
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeCategory, setIncomeCategory] = useState<TransactionCategory>('membership');
  const [incomeDesc, setIncomeDesc] = useState('');
  const [incomeMethod, setIncomeMethod] = useState<PaymentMethod>('efectivo');

  // Custom New Expense modal
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<TransactionCategory>('maintenance');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseMethod, setExpenseMethod] = useState<PaymentMethod>('transferencia');

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesSearch = 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.relatedMemberName && t.relatedMemberName.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesType && matchesCategory && matchesSearch;
  });

  // Calculate category aggregates for expenses
  const expenseCategoriesAgg: Record<string, number> = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      expenseCategoriesAgg[t.category] = (expenseCategoriesAgg[t.category] || 0) + t.amount;
    });

  const expensePieData = [
    { name: 'Alquiler', value: expenseCategoriesAgg['rent'] || 0, color: '#f43f5e' },
    { name: 'Sueldos / Honorarios', value: expenseCategoriesAgg['salary'] || 0, color: '#fb923c' },
    { name: 'Stock / Suplementos', value: expenseCategoriesAgg['supplies'] || 0, color: '#38bdf8' },
    { name: 'Servicios (Luz/Agua)', value: expenseCategoriesAgg['utilities'] || 0, color: '#a855f7' },
    { name: 'Mantenimiento', value: expenseCategoriesAgg['maintenance'] || 0, color: '#eab308' },
    { name: 'Otros', value: expenseCategoriesAgg['other'] || 0, color: '#64748b' }
  ].filter(item => item.value > 0);

  const getCategoryLabel = (cat: TransactionCategory) => {
    switch (cat) {
      case 'membership': return 'Membresía Alumno';
      case 'pos_sale': return 'Venta Tienda POS';
      case 'personal_training': return 'Personal Training';
      case 'rent': return 'Alquiler Local';
      case 'salary': return 'Sueldos Entrenadores';
      case 'supplies': return 'Compra de Suplementos';
      case 'utilities': return 'Servicios (Luz, Agua, Net)';
      case 'maintenance': return 'Mantenimiento Máquinas';
      case 'marketing': return 'Publicidad & Redes';
      default: return 'Otros Gastos';
    }
  };

  const handleCreateIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeAmount || isNaN(Number(incomeAmount)) || !incomeDesc) return;

    addTransaction({
      type: 'income',
      category: incomeCategory,
      amount: Number(incomeAmount),
      date: '2026-08-30',
      paymentMethod: incomeMethod,
      description: incomeDesc
    });

    setIncomeAmount('');
    setIncomeDesc('');
    setIsIncomeModalOpen(false);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseAmount || isNaN(Number(expenseAmount)) || !expenseDesc) return;

    addTransaction({
      type: 'expense',
      category: expenseCategory,
      amount: Number(expenseAmount),
      date: '2026-08-30',
      paymentMethod: expenseMethod,
      description: expenseDesc
    });

    setExpenseAmount('');
    setExpenseDesc('');
    setIsExpenseModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-[11px] font-bold uppercase tracking-wider mb-0.5">
            <BadgeDollarSign className="w-3.5 h-3.5" />
            <span>Finanzas & Flujo de Caja</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900">
            Ingresos, Egresos y Caja
          </h1>
          <p className="text-xs text-gray-500">
            Control contable del gimnasio: cobros de membresías, ventas en tienda, pago de sueldos y mantenimiento.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsIncomeModalOpen(true)}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar Ingreso</span>
          </button>
          
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar Gasto</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Total Incomes */}
        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Ingresos Totales</span>
            <div className="w-7 h-7 rounded-lg bg-green-50 text-green-700 border border-green-200 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-green-700">
              S/ {metrics.totalIncome.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Membresías S/ {metrics.membershipsRevenue} • Tienda S/ {metrics.posSalesTotal}
          </p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Egresos / Gastos</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-rose-700">
              S/ {metrics.totalExpense.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Alquiler, sueldos, mantenimiento y servicios
          </p>
        </div>

        {/* Net Profit */}
        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Utilidad Neta</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className={`text-2xl font-bold ${metrics.netProfit >= 0 ? 'text-blue-700' : 'text-rose-700'}`}>
              S/ {metrics.netProfit.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Margen operativo de la gestión actual
          </p>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Expenses by Category Breakdown Pie */}
        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-2">
            <PieIcon className="w-3.5 h-3.5 text-blue-600" />
            Distribución de Gastos
          </h3>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {expensePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px', color: '#0f172a' }}
                  formatter={(val: any) => [`S/ ${Number(val || 0).toFixed(2)}`, 'Monto']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 mt-1 divide-y divide-gray-100 text-[11px]">
            {expensePieData.map(item => (
              <div key={item.name} className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 truncate max-w-[140px]">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">S/ {(item.value || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions Ledger (Col 2-3) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Receipt className="w-3.5 h-3.5 text-blue-600" />
                Libro Mayor de Transacciones ({filteredTransactions.length})
              </h3>

              {/* Type Filter */}
              <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-md border border-gray-200 self-start sm:self-auto">
                <button
                  onClick={() => setTypeFilter('all')}
                  className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer ${typeFilter === 'all' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-gray-600 hover:text-slate-900'}`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setTypeFilter('income')}
                  className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer ${typeFilter === 'income' ? 'bg-green-600 text-white font-bold' : 'text-gray-600 hover:text-slate-900'}`}
                >
                  Ingresos
                </button>
                <button
                  onClick={() => setTypeFilter('expense')}
                  className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer ${typeFilter === 'expense' ? 'bg-rose-600 text-white font-bold' : 'text-gray-600 hover:text-slate-900'}`}
                >
                  Egresos
                </button>
              </div>
            </div>

            {/* Filter & Search */}
            <div className="mb-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2" />
                <input
                  type="text"
                  placeholder="Buscar por descripción, alumno o N° Comprobante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 bg-gray-50 border border-gray-300 rounded-md text-xs text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Transactions List */}
            <div className="max-h-96 overflow-y-auto space-y-1.5 pr-1">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  No hay transacciones que coincidan con la búsqueda.
                </div>
              ) : (
                filteredTransactions.map(t => (
                  <div 
                    key={t.id}
                    className="p-2.5 bg-gray-50/70 border border-gray-200 rounded-lg flex items-center justify-between gap-3 text-xs hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {t.type === 'income' ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">{t.description}</p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[10px] text-gray-500">
                          <span>{t.date}</span>
                          <span>•</span>
                          <span className="text-blue-700 font-medium">{getCategoryLabel(t.category)}</span>
                          <span>•</span>
                          <span className="font-mono">{t.receiptNumber}</span>
                          <span>•</span>
                          <span className="uppercase text-slate-600 font-semibold">{t.paymentMethod}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-bold ${
                        t.type === 'income' ? 'text-green-700' : 'text-rose-700'
                      }`}>
                        {t.type === 'income' ? '+' : '-'} S/ {(t.amount || 0).toFixed(2)}
                      </span>

                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar la transacción "${t.description}"?`)) {
                            deleteTransaction(t.id);
                          }
                        }}
                        className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Eliminar movimiento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* New Income Modal */}
      {isIncomeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-5 shadow-2xl animate-in fade-in text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Registrar Ingreso de Caja
              </h3>
              <button onClick={() => setIsIncomeModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateIncome} className="space-y-3 my-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Monto (S/) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="0.00"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 text-sm font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Categoría</label>
                <select
                  value={incomeCategory}
                  onChange={(e) => setIncomeCategory(e.target.value as TransactionCategory)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-800 focus:outline-none focus:border-blue-600"
                >
                  <option value="membership">Membresía / Cuota</option>
                  <option value="pos_sale">Venta de Suplementos / Tienda</option>
                  <option value="personal_training">Clase Personalizada</option>
                  <option value="other">Otro Ingreso Extra</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Descripción / Concepto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Pago clase privada de boxeo"
                  value={incomeDesc}
                  onChange={(e) => setIncomeDesc(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Método de Pago</label>
                <select
                  value={incomeMethod}
                  onChange={(e) => setIncomeMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-800 focus:outline-none focus:border-blue-600"
                >
                  <option value="efectivo">💵 Efectivo</option>
                  <option value="yape_plin">📱 Yape / Plin</option>
                  <option value="tarjeta">💳 Tarjeta POS</option>
                  <option value="transferencia">🏦 Transferencia</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsIncomeModalOpen(false)}
                  className="px-3 py-1.5 text-gray-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-xs cursor-pointer transition-all"
                >
                  Guardar Ingreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-5 shadow-2xl animate-in fade-in text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-600" />
                Registrar Egreso / Gasto
              </h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3 my-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Monto del Gasto (S/) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="0.00"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 text-sm font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Categoría del Egreso</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as TransactionCategory)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-800 focus:outline-none focus:border-blue-600"
                >
                  <option value="rent">Alquiler del Local</option>
                  <option value="salary">Sueldos y Honorarios</option>
                  <option value="utilities">Servicios Básicos (Luz, Agua, Internet)</option>
                  <option value="maintenance">Mantenimiento de Equipos / Máquinas</option>
                  <option value="supplies">Compra de Suplementos / Stock</option>
                  <option value="marketing">Publicidad / Impresiones</option>
                  <option value="other">Otro Gasto Operativo</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Detalle / Proveedor *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Pago técnico reparación polea alta"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Medio de Pago</label>
                <select
                  value={expenseMethod}
                  onChange={(e) => setExpenseMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-800 focus:outline-none focus:border-blue-600"
                >
                  <option value="transferencia">🏦 Transferencia Bancaria</option>
                  <option value="efectivo">💵 Efectivo de Caja Chica</option>
                  <option value="yape_plin">📱 Yape / Plin</option>
                  <option value="tarjeta">💳 Tarjeta Débito / Crédito</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-3 py-1.5 text-gray-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-md shadow-xs cursor-pointer transition-all"
                >
                  Registrar Salida
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
