import React, { useState } from 'react';
import { 
  Dumbbell, 
  Users, 
  CreditCard, 
  DollarSign, 
  UserCheck, 
  ClipboardList, 
  ShoppingBag, 
  Bell, 
  Plus, 
  Search, 
  Calendar,
  AlertTriangle,
  RefreshCw,
  Download,
  Flame,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import confetti from 'canvas-confetti';

export type NavTab = 
  | 'dashboard' 
  | 'members' 
  | 'memberships' 
  | 'finance' 
  | 'trainers' 
  | 'routines' 
  | 'nutrition'
  | 'measurements'
  | 'spinning'
  | 'attendances'
  | 'store' 
  | 'alerts';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenNewMemberModal: () => void;
  onOpenQuickSaleModal: () => void;
  onOpenNewExpenseModal: () => void;
  onOpenUserAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewMemberModal,
  onOpenQuickSaleModal,
  onOpenNewExpenseModal,
  onOpenUserAuthModal
}) => {
  const { renewalAlerts, lowStockProducts, members, exportDataJSON, resetToDefaults, currentUser, recordAttendance } = useGym();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchCheckIn, setSearchCheckIn] = useState('');
  const [checkInResult, setCheckInResult] = useState<{
    member?: any;
    found: boolean;
    status?: 'active' | 'expiring_soon' | 'expired';
    message: string;
  } | null>(null);

  const totalUrgentAlerts = renewalAlerts.length + lowStockProducts.length;

  const handleQuickCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCheckIn.trim()) return;

    const term = searchCheckIn.trim().toLowerCase();
    const foundMember = members.find(m => 
      m.dni.toLowerCase().includes(term) || 
      m.fullName.toLowerCase().includes(term)
    );

    if (foundMember) {
      setCheckInResult({
        found: true,
        member: foundMember,
        status: foundMember.status,
        message: foundMember.status === 'active' 
          ? `¡Acceso Autorizado! Membresía vigente hasta ${foundMember.membershipEndDate}` 
          : foundMember.status === 'expiring_soon'
          ? `⚠️ Acceso permitido. Membresía por vencer el ${foundMember.membershipEndDate}`
          : `⛔ Acceso Denegado. Membresía vencida el ${foundMember.membershipEndDate}`
      });

      if (foundMember.status === 'active') {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.1 }
        });
      }

      // Record in attendance log
      recordAttendance({
        userId: foundMember.id,
        userName: foundMember.fullName,
        userRole: 'student',
        userDni: foundMember.dni,
        type: 'in',
        status: foundMember.status === 'expired' ? 'warning' : 'authorized',
        checkInMethod: 'quick_pass',
        membershipPlan: foundMember.planName,
        notes: `Check-in rápido en barra superior (${foundMember.status})`
      });
    } else {
      setCheckInResult({
        found: false,
        message: 'No se encontró ningún alumno con ese DNI o nombre.'
      });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-6 py-2.5 text-slate-800 shadow-xs transition-all">
      <div className="w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand logo */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors">
              <Dumbbell className="w-4 h-4 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-blue-600 font-['Outfit',sans-serif]">
                  IRONCORE <span className="text-slate-900 font-light">GYM</span>
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-bold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200 rounded">
                  PRO
                </span>
              </div>
            </div>
          </div>

          {/* Mobile alerts icon */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={() => setActiveTab('alerts')}
              className="relative p-1.5 rounded-lg bg-gray-100 text-slate-700 hover:bg-gray-200"
            >
              <Bell className="w-4 h-4" />
              {totalUrgentAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {totalUrgentAlerts}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Quick Check-in bar (Receptionist fast entry) */}
        <div className="w-full md:w-80 lg:w-96 relative">
          <form onSubmit={handleQuickCheckIn} className="relative">
            <input
              type="text"
              placeholder="Check-in rápido (DNI o Nombre)..."
              value={searchCheckIn}
              onChange={(e) => setSearchCheckIn(e.target.value)}
              className="w-full pl-8 pr-20 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-xs text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-medium rounded transition-colors cursor-pointer"
            >
              Validar
            </button>
          </form>

          {/* Quick Check-in Result Popover */}
          {checkInResult && (
            <div className="absolute left-0 mt-2 w-80 lg:w-96 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 text-slate-800">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {checkInResult.status === 'active' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : checkInResult.status === 'expiring_soon' ? (
                    <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {checkInResult.member ? checkInResult.member.fullName : 'Resultado de búsqueda'}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">{checkInResult.message}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setCheckInResult(null)}
                  className="text-gray-400 hover:text-gray-700 text-xs px-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              {checkInResult.member && (
                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>DNI: <strong className="text-slate-800">{checkInResult.member.dni}</strong></span>
                  <span className="font-semibold text-blue-600">{checkInResult.member.planName}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action buttons, Avatars & Alerts */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          
          {/* Asistencias Quick Button */}
          <button
            onClick={() => setActiveTab('attendances')}
            className={`p-2 rounded-md transition-colors cursor-pointer border ${
              activeTab === 'attendances' 
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' 
                : 'bg-gray-100 hover:bg-gray-200 text-slate-700 border-gray-200'
            }`}
            title="Control de Asistencias (Alumnos & Personal)"
          >
            <UserCheck className="w-4 h-4" />
          </button>

          {/* Current User Session Switcher */}
          <div 
            onClick={onOpenUserAuthModal}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Haz clic para cambiar de usuario o iniciar sesión"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
              {currentUser.photoUrl ? (
                <img src={currentUser.photoUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
              ) : (
                currentUser.fullName.charAt(0)
              )}
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center space-x-1">
                <span className="font-extrabold text-[11px] text-slate-900 leading-tight">
                  {currentUser.fullName.split(' ')[0]}
                </span>
                <span className={`px-1 rounded text-[9px] font-black uppercase ${
                  currentUser.role === 'admin' 
                    ? 'bg-purple-100 text-purple-700' 
                    : currentUser.role === 'trainer' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {currentUser.role === 'student' ? 'Alumno' : currentUser.role === 'trainer' ? 'Coach' : 'Admin'}
                </span>
              </div>
            </div>
          </div>

          {/* Fast Sale */}
          <button
            onClick={onOpenQuickSaleModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-semibold shadow-xs transition-all cursor-pointer"
            title="Venta rápida en tienda / POS"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Venta POS</span>
          </button>

          {/* New Member */}
          <button
            onClick={onOpenNewMemberModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Nuevo Registro</span>
          </button>

          {/* Notifications Center button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-slate-700 border border-gray-200 transition-colors cursor-pointer"
              title="Centro de Alertas de Vencimiento"
            >
              <Bell className="w-4 h-4" />
              {totalUrgentAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                  {totalUrgentAlerts}
                </span>
              )}
            </button>

            {/* Notification drop */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in text-slate-800">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Alertas del Gimnasio</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded-full">
                    {totalUrgentAlerts} pendientes
                  </span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {renewalAlerts.length === 0 && lowStockProducts.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">¡Todo al día! No hay vencimientos urgentes ni falta de stock.</p>
                  ) : (
                    <>
                      {renewalAlerts.slice(0, 4).map(alert => (
                        <div 
                          key={alert.memberId}
                          onClick={() => {
                            setActiveTab('alerts');
                            setShowNotifications(false);
                          }}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                            alert.isExpired 
                              ? 'bg-red-50/60 border-red-200 hover:bg-red-50 text-red-900' 
                              : 'bg-amber-50/60 border-amber-200 hover:bg-amber-50 text-amber-900'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold">
                            <span>{alert.memberName}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-gray-200">
                              {alert.daysLeft < 0 ? `Venció hace ${Math.abs(alert.daysLeft)}d` : `Vence en ${alert.daysLeft}d`}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">Plan: {alert.planName} • Fin: {alert.endDate}</p>
                        </div>
                      ))}

                      {lowStockProducts.map(prod => (
                        <div 
                          key={prod.id}
                          onClick={() => {
                            setActiveTab('store');
                            setShowNotifications(false);
                          }}
                          className="p-2.5 rounded-lg border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-900 text-xs cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between font-semibold">
                            <span>Bajo Stock: {prod.name}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-yellow-300 text-yellow-800">
                              Quedan: {prod.stock}
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setActiveTab('alerts');
                      setShowNotifications(false);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  >
                    Ver todas las alertas →
                  </button>
                  <button
                    onClick={exportDataJSON}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                    title="Exportar copia de seguridad"
                  >
                    <Download className="w-3 h-3" /> Backup
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
