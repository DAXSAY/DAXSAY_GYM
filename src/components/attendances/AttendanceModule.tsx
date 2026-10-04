import React, { useState, useMemo } from 'react';
import { 
  UserCheck, 
  Users, 
  Calendar, 
  Clock, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  QrCode, 
  ScanLine, 
  Download, 
  Printer, 
  Trash2, 
  GraduationCap, 
  Dumbbell, 
  ShieldCheck, 
  ArrowRightCircle, 
  ArrowLeftCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { AttendanceRecord, UserRole, Member, Trainer } from '../../types/gym';
import confetti from 'canvas-confetti';

export const AttendanceModule: React.FC = () => {
  const { 
    attendances, 
    recordAttendance, 
    deleteAttendance, 
    members, 
    trainers, 
    users,
    currentUser 
  } = useGym();

  // Search & Filters
  const [filterDate, setFilterDate] = useState('2026-08-30');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'trainer' | 'staff'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick punch input state
  const [quickInput, setQuickInput] = useState('');
  const [lastPunchResult, setLastPunchResult] = useState<{
    success: boolean;
    name: string;
    role: string;
    status: string;
    message: string;
    planOrRole?: string;
  } | null>(null);

  // Manual Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualUserType, setManualUserType] = useState<'member' | 'staff'>('member');
  const [manualSelectedId, setManualSelectedId] = useState('');
  const [manualPunchType, setManualPunchType] = useState<'in' | 'out'>('in');
  const [manualNotes, setManualNotes] = useState('');

  // Filtered Attendances list
  const filteredRecords = useMemo(() => {
    return attendances.filter(att => {
      const matchDate = !filterDate || att.date === filterDate;
      const matchRole = filterRole === 'all' || att.userRole === filterRole;
      const matchSearch = !searchQuery || 
        att.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        att.userDni.includes(searchQuery);
      return matchDate && matchRole && matchSearch;
    });
  }, [attendances, filterDate, filterRole, searchQuery]);

  // Daily statistics
  const stats = useMemo(() => {
    const todayRecords = attendances.filter(a => a.date === '2026-08-30');
    const studentsToday = todayRecords.filter(a => a.userRole === 'student' && a.type === 'in').length;
    const staffToday = todayRecords.filter(a => (a.userRole === 'trainer' || a.userRole === 'staff' || a.userRole === 'admin') && a.type === 'in').length;
    const warnings = todayRecords.filter(a => a.status === 'warning').length;

    return {
      totalToday: todayRecords.length,
      studentsToday,
      staffToday,
      warnings
    };
  }, [attendances]);

  // Handle Quick Punch by DNI or Name
  const handleQuickPunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    const query = quickInput.trim().toLowerCase();

    // 1. First check if it's a student/member
    const foundMember = members.find(m => 
      m.dni.toLowerCase() === query || 
      m.fullName.toLowerCase().includes(query)
    );

    if (foundMember) {
      const isExpired = foundMember.status === 'expired';
      const isExpiring = foundMember.status === 'expiring_soon';

      const status = isExpired ? 'warning' : isExpiring ? 'warning' : 'authorized';
      const notes = isExpired 
        ? `⛔ Membresía Vencida (${foundMember.membershipEndDate})` 
        : isExpiring 
        ? `⚠️ Vence pronto (${foundMember.membershipEndDate})` 
        : `Ingreso regular a sala`;

      recordAttendance({
        userId: foundMember.id,
        userName: foundMember.fullName,
        userRole: 'student',
        userDni: foundMember.dni,
        type: 'in',
        status: status,
        checkInMethod: 'dni_manual',
        membershipPlan: foundMember.planName,
        notes: notes
      });

      if (!isExpired) {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.2 } });
      }

      setLastPunchResult({
        success: !isExpired,
        name: foundMember.fullName,
        role: 'Alumno / Socio',
        status: foundMember.status,
        planOrRole: foundMember.planName,
        message: isExpired 
          ? `¡Atención! Membresía de ${foundMember.fullName} se encuentra vencida desde el ${foundMember.membershipEndDate}. Acercar a recepción.`
          : isExpiring
          ? `Acceso permitido. Recordar a ${foundMember.fullName} renovación (vence el ${foundMember.membershipEndDate}).`
          : `¡Acceso Concedido! Bienvenido ${foundMember.fullName.split(' ')[0]}.`
      });

      setQuickInput('');
      return;
    }

    // 2. Check if it's staff / trainer
    const foundTrainer = trainers.find(t => 
      t.name.toLowerCase().includes(query) || 
      t.phone.includes(query)
    );

    if (foundTrainer) {
      recordAttendance({
        userId: foundTrainer.id,
        userName: foundTrainer.name,
        userRole: 'trainer',
        userDni: '41239844',
        type: 'in',
        status: 'on_time',
        checkInMethod: 'barcode',
        notes: `Turno de instructor: ${foundTrainer.specialization}`
      });

      confetti({ particleCount: 20, spread: 50, origin: { y: 0.2 } });

      setLastPunchResult({
        success: true,
        name: foundTrainer.name,
        role: 'Entrenador / Staff',
        status: 'Puntual',
        planOrRole: foundTrainer.specialization,
        message: `¡Asistencia de Personal registrada! Turno iniciado para ${foundTrainer.name}.`
      });

      setQuickInput('');
      return;
    }

    // 3. Check AppUsers
    const foundUser = users.find(u => 
      u.fullName.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query)
    );

    if (foundUser) {
      recordAttendance({
        userId: foundUser.id,
        userName: foundUser.fullName,
        userRole: foundUser.role,
        userDni: '10982345',
        type: 'in',
        status: 'authorized',
        checkInMethod: 'quick_pass',
        notes: `Marcación de usuario: ${foundUser.role}`
      });

      confetti({ particleCount: 25, spread: 50, origin: { y: 0.2 } });

      setLastPunchResult({
        success: true,
        name: foundUser.fullName,
        role: foundUser.role,
        status: 'Autorizado',
        message: `¡Marcación exitosa para ${foundUser.fullName}!`
      });

      setQuickInput('');
      return;
    }

    // Not found
    setLastPunchResult({
      success: false,
      name: query,
      role: 'Desconocido',
      status: 'No encontrado',
      message: `No se encontró ningún alumno, entrenador o miembro del personal con "${query}".`
    });
  };

  // Submit Manual Punch Modal
  const handleSaveManualPunch = (e: React.FormEvent) => {
    e.preventDefault();

    if (manualUserType === 'member') {
      const member = members.find(m => m.id === manualSelectedId);
      if (!member) return;

      recordAttendance({
        userId: member.id,
        userName: member.fullName,
        userRole: 'student',
        userDni: member.dni,
        type: manualPunchType,
        status: member.status === 'expired' ? 'warning' : 'authorized',
        checkInMethod: 'dni_manual',
        membershipPlan: member.planName,
        notes: manualNotes.trim() || undefined
      });
    } else {
      const trainer = trainers.find(t => t.id === manualSelectedId);
      if (!trainer) return;

      recordAttendance({
        userId: trainer.id,
        userName: trainer.name,
        userRole: 'trainer',
        userDni: '41239844',
        type: manualPunchType,
        status: 'on_time',
        checkInMethod: 'quick_pass',
        notes: manualNotes.trim() || `Turno de ${trainer.specialization}`
      });
    }

    confetti({ particleCount: 30, spread: 60, origin: { y: 0.4 } });
    setIsManualModalOpen(false);
    setManualNotes('');
  };

  // Export to CSV
  const handleExportCSV = () => {
    let csv = 'ID,Fecha,Hora,Tipo,Usuario,Rol,DNI,Plan/Especialidad,Estado,Metodo,Notas\n';
    filteredRecords.forEach(r => {
      csv += `"${r.id}","${r.date}","${r.time}","${r.type === 'in' ? 'Entrada' : 'Salida'}","${r.userName}","${r.userRole}","${r.userDni}","${r.membershipPlan || ''}","${r.status}","${r.checkInMethod}","${r.notes || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `asistencias_gymcontrol_${filterDate || 'todas'}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Control de Asistencias & Puerta
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  En Vivo
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Marcaciones de entrada y salida para alumnos y personal del gimnasio (entrenadores, recepción y turnos).
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => {
              setManualSelectedId(members[0]?.id || '');
              setIsManualModalOpen(true);
            }}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Marcación Manual</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            title="Exportar reporte CSV"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Quick Punch Bar & Interactive Punch Box */}
      <div className="bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Form: Fast Punch by DNI or Search */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center space-x-2 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <ScanLine className="w-4 h-4 text-blue-400 animate-pulse" />
              <span>Escáner / Check-In Inmediato en Recepción</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">
              Ingresa el DNI o Nombre del Alumno o Personal
            </h2>

            <form onSubmit={handleQuickPunch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Escribe DNI o Nombre (Ej: 72345678, Alejandro Ramos, Carlos Mendoza)..."
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  className="w-full bg-white/10 hover:bg-white/15 focus:bg-white border border-white/20 focus:border-blue-400 text-white focus:text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm placeholder-slate-400 focus:outline-hidden transition-all shadow-inner font-semibold"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all cursor-pointer shrink-0 flex items-center space-x-1.5"
              >
                <span>Registrar</span>
                <ArrowRightCircle className="w-4 h-4" />
              </button>
            </form>

            {/* Quick 1-click punch buttons for fast testing */}
            <div className="pt-2 flex items-center flex-wrap gap-2 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold">Marcación rápida demo:</span>
              <button
                type="button"
                onClick={() => {
                  setQuickInput('Alejandro Ramos');
                }}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-blue-200 text-[11px] font-bold transition-colors cursor-pointer"
              >
                + Alejandro (Alumno)
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuickInput('Carlos Mendoza');
                }}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-200 text-[11px] font-bold transition-colors cursor-pointer"
              >
                + Carlos (Coach Spinning)
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuickInput('Mateo Quispe');
                }}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 text-[11px] font-bold transition-colors cursor-pointer"
              >
                + Mateo (Por vencer)
              </button>
            </div>
          </div>

          {/* Right Box: Live Result Card */}
          <div className="lg:col-span-5">
            {lastPunchResult ? (
              <div className={`p-4 rounded-xl border transition-all ${
                lastPunchResult.success 
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-100' 
                  : 'bg-rose-950/60 border-rose-500/50 text-rose-100'
              }`}>
                <div className="flex items-start space-x-3">
                  {lastPunchResult.success ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-7 h-7 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10">
                        {lastPunchResult.role}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300">
                        Hace un momento
                      </span>
                    </div>

                    <h4 className="font-black text-base text-white truncate">
                      {lastPunchResult.name}
                    </h4>

                    {lastPunchResult.planOrRole && (
                      <p className="text-xs text-blue-200 font-semibold mb-1">
                        {lastPunchResult.planOrRole}
                      </p>
                    )}

                    <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                      {lastPunchResult.message}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-slate-300 text-xs flex items-center space-x-3">
                <Info className="w-6 h-6 text-blue-400 shrink-0" />
                <p>
                  El sistema verifica en tiempo real el estado de membresía del alumno o el horario de turno del personal al momento de registrar su asistencia.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Metrics of the day */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Asistencias Hoy</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.totalToday}</p>
          <span className="text-[11px] text-slate-500 font-medium">Marcaciones registradas</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Alumnos en Sala</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{stats.studentsToday}</p>
          <span className="text-[11px] text-emerald-700 font-semibold">Socios entrenando</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Personal en Turno</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-600 mt-2">{stats.staffToday}</p>
          <span className="text-[11px] text-purple-700 font-semibold">Coaches & Staff activo</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Alertas de Membresía</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{stats.warnings}</p>
          <span className="text-[11px] text-amber-700 font-semibold">Por vencer / Vencidos hoy</span>
        </div>
      </div>

      {/* Filter Toolbar & Attendance Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center flex-wrap gap-2.5">
            <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-transparent focus:outline-hidden"
              />
            </div>

            {/* Role Filter Pills */}
            <div className="flex items-center bg-slate-200/60 p-1 rounded-xl">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'student', label: 'Alumnos' },
                { id: 'trainer', label: 'Entrenadores' },
                { id: 'staff', label: 'Personal Recepción' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterRole(f.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    filterRole === f.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Table */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar en el registro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="p-3.5 sm:px-5">Hora / Fecha</th>
                <th className="p-3.5">Tipo</th>
                <th className="p-3.5">Nombre / Usuario</th>
                <th className="p-3.5">Rol</th>
                <th className="p-3.5">DNI</th>
                <th className="p-3.5">Plan / Turno</th>
                <th className="p-3.5">Estado / Control</th>
                <th className="p-3.5">Método</th>
                <th className="p-3.5 text-right sm:px-5">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No se encontraron marcaciones para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(att => {
                  return (
                    <tr key={att.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 sm:px-5 font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{att.time}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">{att.date}</span>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        {att.type === 'in' ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1 w-max">
                            <ArrowRightCircle className="w-3 h-3 text-emerald-600" />
                            <span>Entrada</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200 flex items-center space-x-1 w-max">
                            <ArrowLeftCircle className="w-3 h-3 text-slate-500" />
                            <span>Salida</span>
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 font-bold text-slate-900">
                        {att.userName}
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        {att.userRole === 'student' ? (
                          <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>Alumno</span>
                          </span>
                        ) : att.userRole === 'trainer' ? (
                          <span className="text-blue-700 font-semibold flex items-center space-x-1">
                            <Dumbbell className="w-3.5 h-3.5" />
                            <span>Entrenador</span>
                          </span>
                        ) : att.userRole === 'admin' ? (
                          <span className="text-purple-700 font-semibold flex items-center space-x-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Admin</span>
                          </span>
                        ) : (
                          <span className="text-amber-700 font-semibold flex items-center space-x-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>Recepción</span>
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-slate-500 font-mono">
                        {att.userDni}
                      </td>

                      <td className="p-3.5 text-slate-600">
                        {att.membershipPlan || att.notes || 'General'}
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        {att.status === 'authorized' || att.status === 'on_time' ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1 w-max">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Puntual / Autorizado</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1 w-max">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{att.notes?.includes('venc') ? 'Membresía por vencer' : 'Alerta'}</span>
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 whitespace-nowrap text-slate-400 text-[11px]">
                        {att.checkInMethod === 'qr_app' ? 'QR App Móvil' : att.checkInMethod === 'barcode' ? 'Lector Barras' : 'DNI Manual'}
                      </td>

                      <td className="p-3.5 sm:px-5 text-right whitespace-nowrap">
                        <button
                          onClick={() => deleteAttendance(att.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Eliminar marcación"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Manual Check-in Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden text-slate-800">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    Registrar Marcación Manual
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Alumnos o Personal en recepción
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveManualPunch} className="p-5 space-y-4 text-xs">
              
              {/* Type Switcher: Member or Staff */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Tipo de Persona:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setManualUserType('member');
                      setManualSelectedId(members[0]?.id || '');
                    }}
                    className={`py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      manualUserType === 'member'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🎓 Alumno / Socio
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setManualUserType('staff');
                      setManualSelectedId(trainers[0]?.id || '');
                    }}
                    className={`py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      manualUserType === 'staff'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🏋️ Personal / Entrenador
                  </button>
                </div>
              </div>

              {/* User Dropdown */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Seleccionar {manualUserType === 'member' ? 'Alumno' : 'Personal'}:
                </label>
                <select
                  value={manualSelectedId}
                  onChange={(e) => setManualSelectedId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  {manualUserType === 'member' ? (
                    members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.fullName} (DNI: {m.dni} · {m.planName})
                      </option>
                    ))
                  ) : (
                    trainers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.specialization})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Entry or Exit */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Sentido de Marcación:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setManualPunchType('in')}
                    className={`py-2 rounded-xl border font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer ${
                      manualPunchType === 'in'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ArrowRightCircle className="w-3.5 h-3.5" />
                    <span>Entrada (Ingreso)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualPunchType('out')}
                    className={`py-2 rounded-xl border font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer ${
                      manualPunchType === 'out'
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ArrowLeftCircle className="w-3.5 h-3.5" />
                    <span>Salida</span>
                  </button>
                </div>
              </div>

              {/* Custom Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Observaciones / Notas (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej: Asiste a clase de spinning, o turno reemplazo..."
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Guardar Asistencia
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
