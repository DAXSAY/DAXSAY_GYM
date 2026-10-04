import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Dumbbell, 
  GraduationCap, 
  Users, 
  Plus, 
  LogIn, 
  LogOut, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Key, 
  Mail, 
  Phone, 
  IdCard,
  UserCheck
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { AppUser, UserRole } from '../../types/gym';
import confetti from 'canvas-confetti';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({ isOpen, onClose }) => {
  const { users, currentUser, setCurrentUser, loginAsUser, registerUser, members, trainers } = useGym();

  const [activeTab, setActiveTab] = useState<'switch' | 'register'>('switch');

  // Register Form State
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('student');
  const [newPhone, setNewPhone] = useState('');
  const [newDni, setNewDni] = useState('');
  const [linkedMemberId, setLinkedMemberId] = useState('');
  const [linkedTrainerId, setLinkedTrainerId] = useState('');

  if (!isOpen) return null;

  const handleSelectUser = (user: AppUser) => {
    setCurrentUser(user);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.2 } });
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim()) return;

    const username = newEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9._-]/g, '');

    const created = registerUser({
      username,
      fullName: newFullName.trim(),
      email: newEmail.trim(),
      role: newRole,
      phone: newPhone.trim() || undefined,
      memberId: newRole === 'student' ? (linkedMemberId || undefined) : undefined,
      trainerId: newRole === 'trainer' ? (linkedTrainerId || undefined) : undefined,
      active: true,
      photoUrl: newRole === 'student' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&auto=format&fit=crop&q=80'
    });

    setCurrentUser(created);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });
    onClose();
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-700 border border-purple-200 flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Administrador</span>
          </span>
        );
      case 'trainer':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-700 border border-blue-200 flex items-center space-x-1">
            <Dumbbell className="w-3 h-3" />
            <span>Entrenador / Coach</span>
          </span>
        );
      case 'student':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
            <GraduationCap className="w-3 h-3" />
            <span>Alumno / Socio</span>
          </span>
        );
      case 'staff':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-700 border border-amber-200 flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>Personal Recepción</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Sesión de Usuario & Acceso de Personal
              </h2>
              <p className="text-xs text-slate-500">
                Cambia de rol o inicia sesión como Alumno, Entrenador o Administrador.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active User Banner */}
        <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full border-2 border-white shadow-sm bg-blue-600 text-white font-black flex items-center justify-center text-base overflow-hidden">
              {currentUser.photoUrl ? (
                <img src={currentUser.photoUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
              ) : (
                currentUser.fullName.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-semibold">Sesión Actual:</span>
                {getRoleBadge(currentUser.role)}
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">
                {currentUser.fullName}
              </h3>
              <p className="text-[11px] text-slate-500">{currentUser.email}</p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Conectado</span>
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-5 pt-3">
          <button
            onClick={() => setActiveTab('switch')}
            className={`pb-2.5 px-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'switch'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Seleccionar Usuario / Rol ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`pb-2.5 px-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'register'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Crear Nuevo Usuario (Alumno / Personal)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {activeTab === 'switch' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-medium">
                Haz clic en cualquier usuario para cambiar de perfil instantáneamente y probar la experiencia de <strong>Alumno (reserva de spinning por código, historial propio)</strong> o de <strong>Personal / Instructor (validación de pagos, emisión de códigos y asistencias)</strong>:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {users.map(u => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleSelectUser(u)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 text-left ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                        {u.photoUrl ? (
                          <img src={u.photoUrl} alt={u.fullName} className="w-full h-full object-cover" />
                        ) : (
                          u.fullName.charAt(0)
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {u.fullName}
                          </h4>
                          {isCurrent && (
                            <span className="shrink-0 w-2 h-2 rounded-full bg-blue-600"></span>
                          )}
                        </div>
                        <div className="mb-1.5">{getRoleBadge(u.role)}</div>
                        <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                        {u.phone && (
                          <p className="text-[10px] text-slate-400">Tel: {u.phone}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-200 text-xs text-blue-900 font-medium flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Crea una cuenta para que un nuevo alumno pueda ingresar con su código único de spinning, o para nuevo personal (entrenadores, recepción) para el control de asistencias.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipo de Rol de Usuario *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { role: 'student', label: 'Alumno / Socio', icon: GraduationCap },
                      { role: 'trainer', label: 'Entrenador', icon: Dumbbell },
                      { role: 'staff', label: 'Recepción', icon: Users },
                      { role: 'admin', label: 'Administrador', icon: ShieldCheck }
                    ].map(item => (
                      <button
                        type="button"
                        key={item.role}
                        onClick={() => setNewRole(item.role as UserRole)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                          newRole === item.role
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Rodrigo Vargas Mendoza"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo Electrónico (Login) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rodrigo.vargas@gmail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teléfono / WhatsApp (para recepción de códigos)
                  </label>
                  <input
                    type="text"
                    placeholder="+51 987 654 321"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    DNI / Documento de Identidad (Asistencias)
                  </label>
                  <input
                    type="text"
                    placeholder="74839201"
                    value={newDni}
                    onChange={(e) => setNewDni(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                {newRole === 'student' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Vincular a Alumno Existente del Gimnasio (Opcional):
                    </label>
                    <select
                      value={linkedMemberId}
                      onChange={(e) => setLinkedMemberId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    >
                      <option value="">-- Crear como nuevo alumno no vinculado --</option>
                      {members.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.fullName} (DNI: {m.dni} · {m.planName})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {newRole === 'trainer' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Vincular a Entrenador Existente:
                    </label>
                    <select
                      value={linkedTrainerId}
                      onChange={(e) => setLinkedTrainerId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    >
                      <option value="">-- Seleccionar Entrenador --</option>
                      {trainers.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.specialization})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('switch')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Usuario e Iniciar Sesión</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
