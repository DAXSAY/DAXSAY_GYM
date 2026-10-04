import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  BadgeDollarSign, 
  UserSquare2, 
  Dumbbell, 
  Store, 
  BellRing,
  RotateCcw,
  Sparkles,
  Utensils,
  Activity,
  Bike,
  UserCheck,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { NavTab } from './Header';
import { useGym } from '../../context/GymContext';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenUserAuthModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenUserAuthModal }) => {
  const { renewalAlerts, lowStockProducts, resetToDefaults, spinningReservations, currentUser, attendances } = useGym();
  const totalAlerts = renewalAlerts.length + lowStockProducts.length;

  const managementNav: { id: NavTab; code: string; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', code: 'DB', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', code: 'US', label: 'Alumnos', icon: Users },
    { id: 'trainers', code: 'TR', label: 'Entrenadores', icon: UserSquare2 },
    { id: 'memberships', code: 'MB', label: 'Planes & Tarifas', icon: CreditCard },
  ];

  const fitnessNav: { id: NavTab; code: string; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'routines', code: 'RT', label: 'Rutinas & Ejercicios', icon: Dumbbell },
    { id: 'nutrition', code: 'NT', label: 'Nutrición & Dietas', icon: Utensils },
    { id: 'measurements', code: 'MD', label: 'Medidas & Bioimpedancia', icon: Activity },
    { id: 'spinning', code: 'SP', label: 'Salón de Spinning', icon: Bike, badge: spinningReservations.length > 0 ? spinningReservations.length : undefined },
  ];

  const operationsNav: { id: NavTab; code: string; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'attendances', code: 'AS', label: 'Asistencias', icon: UserCheck },
    { id: 'store', code: 'SL', label: 'Ventas / POS', icon: Store, badge: lowStockProducts.length > 0 ? lowStockProducts.length : undefined },
    { id: 'finance', code: 'FN', label: 'Finanzas & Caja', icon: BadgeDollarSign },
    { id: 'alerts', code: 'AL', label: 'Notificaciones', icon: BellRing, badge: renewalAlerts.length > 0 ? renewalAlerts.length : undefined }
  ];

  return (
    <aside className="w-full lg:w-56 bg-slate-900 text-white min-h-full border-r border-slate-800 flex flex-col justify-between shrink-0 shadow-lg select-none">
      <div className="p-3 lg:p-4 space-y-4">
        
        {/* Module Group 1: Gestión */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1.5 flex items-center justify-between">
            <span>Gestión</span>
            <span className="text-[10px] text-slate-500 font-normal">Base</span>
          </div>
          <nav className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-1">
            {managementNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between space-x-2.5 p-2 rounded-lg text-xs lg:text-sm transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isActive 
                        ? 'bg-blue-400/25 text-white border border-blue-400/40' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.code}
                    </div>
                    <span className="truncate text-xs">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-extrabold rounded-full bg-red-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Module Group 2: Fitness & Nutrición */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1.5 pt-1 flex items-center justify-between">
            <span>Fitness & Salud</span>
            <span className="text-[10px] text-slate-500 font-normal">Pautas</span>
          </div>
          <nav className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-1">
            {fitnessNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between space-x-2.5 p-2 rounded-lg text-xs lg:text-sm transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isActive 
                        ? 'bg-blue-400/25 text-white border border-blue-400/40' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.code}
                    </div>
                    <span className="truncate text-xs">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-extrabold rounded-full bg-cyan-500 text-slate-950 font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Module Group 3: Operativo & Caja */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1.5 pt-1 flex items-center justify-between">
            <span>Operativo & Caja</span>
            <span className="text-[10px] text-slate-500 font-normal">Recepción</span>
          </div>
          <nav className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-1">
            {operationsNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between space-x-2.5 p-2 rounded-lg text-xs lg:text-sm transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isActive 
                        ? 'bg-blue-400/25 text-white border border-blue-400/40' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.code}
                    </div>
                    <span className="truncate text-xs">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-extrabold rounded-full bg-red-600 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Footer Info / User Switcher / Status */}
      <div className="p-3 lg:p-4 border-t border-slate-800 space-y-2 hidden lg:block">
        <div 
          onClick={onOpenUserAuthModal}
          className="bg-slate-800/90 hover:bg-slate-750 rounded-xl p-3 text-xs border border-slate-700/70 cursor-pointer transition-all hover:border-blue-500/50 group"
          title="Cambiar usuario o iniciar sesión"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">Usuario Activo</span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
              currentUser.role === 'admin' 
                ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50' 
                : currentUser.role === 'trainer'
                ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                : currentUser.role === 'staff'
                ? 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
                : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
            }`}>
              {currentUser.role === 'admin' ? 'Administrador' : currentUser.role === 'trainer' ? 'Entrenador' : currentUser.role === 'staff' ? 'Recepción' : 'Alumno'}
            </span>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              {currentUser.photoUrl ? (
                <img src={currentUser.photoUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
              ) : (
                currentUser.fullName.charAt(0)
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-slate-200 text-xs font-bold truncate group-hover:text-white transition-colors">
                {currentUser.fullName}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                @{currentUser.username}
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-blue-400 font-semibold group-hover:text-blue-300">
            <span>Cambiar sesión / Login</span>
            <span>→</span>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('¿Deseas restaurar los datos de ejemplo iniciales?')) {
              resetToDefaults();
            }
          }}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title="Restablecer datos a estado inicial"
        >
          <RotateCcw className="w-3 h-3" />
          Restablecer datos demo
        </button>
      </div>
    </aside>
  );
};
