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
  Info,
  Briefcase,
  HeartPulse,
  Utensils,
  Store,
  Wrench,
  AlertCircle,
  Check,
  X,
  FileText
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { AttendanceRecord, AttendanceStatus, UserRole, Member, StaffContract } from '../../types/gym';
import confetti from 'canvas-confetti';

export const AttendanceModule: React.FC = () => {
  const { 
    attendances, 
    recordAttendance, 
    deleteAttendance, 
    members, 
    staffContracts, 
    currentUser 
  } = useGym();

  // Primary Tab Separation: Personal de Trabajo vs Alumnos
  const [activeTab, setActiveTab] = useState<'staff' | 'students'>('staff');

  // Search & Filters
  const [filterDate, setFilterDate] = useState('2026-08-30');
  const [filterStatus, setFilterStatus] = useState<string>('all');
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

  // Manual Staff Check-In Modal
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [modalStaffId, setModalStaffId] = useState<string>(staffContracts[0]?.id || '');
  const [modalStaffStatus, setModalStaffStatus] = useState<AttendanceStatus>('puntual');
  const [modalStaffTime, setModalStaffTime] = useState('08:00 AM');
  const [modalStaffHours, setModalStaffHours] = useState<number>(8);
  const [modalStaffReason, setModalStaffReason] = useState('');
  const [modalStaffNotes, setModalStaffNotes] = useState('');

  // Manual Student Check-In Modal
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [modalStudentId, setModalStudentId] = useState<string>(members[0]?.id || '');
  const [modalStudentNotes, setModalStudentNotes] = useState('');

  // Separate Records by Category
  const staffRecords = useMemo(() => {
    return attendances.filter(a => {
      const isStaff = a.category === 'staff' || 
        a.userRole === 'trainer' || 
        a.userRole === 'staff' || 
        a.userRole === 'admin' ||
        staffContracts.some(s => s.fullName === a.userName || s.dni === a.userDni);
      
      const matchDate = !filterDate || a.date === filterDate;
      const matchStatus = filterStatus === 'all' || 
        a.status === filterStatus ||
        (filterStatus === 'puntual' && (a.status === 'puntual' || a.status === 'on_time' || a.status === 'authorized')) ||
        (filterStatus === 'tarde' && (a.status === 'tarde' || a.status === 'late')) ||
        (filterStatus === 'falta' && a.status === 'falta') ||
        (filterStatus === 'permiso' && a.status === 'permiso');
      
      const matchSearch = !searchQuery || 
        a.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.userDni.includes(searchQuery) ||
        (a.reason && a.reason.toLowerCase().includes(searchQuery.toLowerCase()));

      return isStaff && matchDate && matchStatus && matchSearch;
    });
  }, [attendances, staffContracts, filterDate, filterStatus, searchQuery]);

  const studentRecords = useMemo(() => {
    return attendances.filter(a => {
      const isStudent = a.category === 'student' || a.userRole === 'student';
      const matchDate = !filterDate || a.date === filterDate;
      const matchSearch = !searchQuery || 
        a.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.userDni.includes(searchQuery);

      return isStudent && matchDate && matchSearch;
    });
  }, [attendances, filterDate, searchQuery]);

  // Statistics for Staff
  const staffStats = useMemo(() => {
    const today = attendances.filter(a => a.category === 'staff' || a.userRole !== 'student');
    const puntual = today.filter(a => a.status === 'puntual' || a.status === 'on_time' || a.status === 'authorized').length;
    const tarde = today.filter(a => a.status === 'tarde' || a.status === 'late').length;
    const falta = today.filter(a => a.status === 'falta').length;
    const permiso = today.filter(a => a.status === 'permiso').length;

    return { total: today.length, puntual, tarde, falta, permiso };
  }, [attendances]);

  // Handle Quick Scanner / Punch
  const handleQuickPunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    const query = quickInput.trim().toLowerCase();

    // 1. Check if it's staff
    const foundStaff = staffContracts.find(s => 
      s.dni.toLowerCase() === query || 
      s.fullName.toLowerCase().includes(query)
    );

    if (foundStaff) {
      recordAttendance({
        userId: foundStaff.staffId,
        userName: foundStaff.fullName,
        userRole: foundStaff.role === 'trainer' ? 'trainer' : 'staff',
        userDni: foundStaff.dni,
        type: 'in',
        status: 'puntual',
        category: 'staff',
        contractId: foundStaff.id,
        scheduledTime: '08:00 AM - 04:00 PM',
        hoursWorked: 8,
        checkInMethod: 'quick_pass',
        notes: `Marcación de entrada para ${foundStaff.roleTitle}`
      });

      confetti({ particleCount: 40, spread: 60 });
      setLastPunchResult({
        success: true,
        name: foundStaff.fullName,
        role: 'Personal de Trabajo',
        status: 'Puntual',
        planOrRole: foundStaff.roleTitle,
        message: `¡Asistencia registrada para ${foundStaff.fullName}! Estado: Puntual.`
      });
      setQuickInput('');
      setActiveTab('staff');
      return;
    }

    // 2. Check if student
    const foundMember = members.find(m => 
      m.dni.toLowerCase() === query || 
      m.fullName.toLowerCase().includes(query)
    );

    if (foundMember) {
      const isExpired = foundMember.status === 'expired';
      recordAttendance({
        userId: foundMember.id,
        userName: foundMember.fullName,
        userRole: 'student',
        userDni: foundMember.dni,
        type: 'in',
        status: isExpired ? 'warning' : 'puntual',
        category: 'student',
        checkInMethod: 'qr_app',
        membershipPlan: foundMember.planName,
        notes: isExpired ? '⛔ Membresía Vencida' : 'Ingreso regular a sala de entrenamiento'
      });

      if (!isExpired) confetti({ particleCount: 30, spread: 50 });
      setLastPunchResult({
        success: !isExpired,
        name: foundMember.fullName,
        role: 'Alumno / Socio',
        status: isExpired ? 'Vencido' : 'Autorizado',
        planOrRole: foundMember.planName,
        message: isExpired 
          ? `¡Atención! Membresía de ${foundMember.fullName} se encuentra vencida.`
          : `¡Acceso concedido a ${foundMember.fullName}!`
      });
      setQuickInput('');
      setActiveTab('students');
      return;
    }

    alert('No se encontró alumno ni personal con ese DNI o nombre.');
  };

  // Submit Manual Staff Attendance
  const handleSaveStaffAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = staffContracts.find(s => s.id === modalStaffId) || staffContracts[0];
    if (!staff) return;

    recordAttendance({
      userId: staff.staffId,
      userName: staff.fullName,
      userRole: staff.role === 'trainer' ? 'trainer' : 'staff',
      userDni: staff.dni,
      type: 'in',
      status: modalStaffStatus,
      category: 'staff',
      contractId: staff.id,
      scheduledTime: `${modalStaffTime} - Jornada Asignada`,
      hoursWorked: modalStaffHours,
      reason: modalStaffReason.trim() || undefined,
      checkInMethod: 'dni_manual',
      notes: modalStaffNotes.trim() || `Registro manual en contrato: ${staff.contractDurationLabel}`
    });

    confetti({ particleCount: 40, spread: 60 });
    setIsStaffModalOpen(false);
    setModalStaffReason('');
    setModalStaffNotes('');
  };

  // Submit Manual Student Attendance
  const handleSaveStudentAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find(m => m.id === modalStudentId) || members[0];
    if (!mem) return;

    recordAttendance({
      userId: mem.id,
      userName: mem.fullName,
      userRole: 'student',
      userDni: mem.dni,
      type: 'in',
      status: mem.status === 'expired' ? 'warning' : 'puntual',
      category: 'student',
      checkInMethod: 'dni_manual',
      membershipPlan: mem.planName,
      notes: modalStudentNotes.trim() || 'Ingreso manual por recepción'
    });

    confetti({ particleCount: 30, spread: 50 });
    setIsStudentModalOpen(false);
    setModalStudentNotes('');
  };

  // Export CSV
  const handleExportCSV = () => {
    let csv = 'ID,Categoria,Fecha,Hora,Usuario,DNI,Estado,HorarioProgramado,HorasTrabajadas,Motivo,Notas\n';
    const list = activeTab === 'staff' ? staffRecords : studentRecords;
    list.forEach(r => {
      csv += `"${r.id}","${r.category || 'general'}","${r.date}","${r.time}","${r.userName}","${r.userDni}","${r.status}","${r.scheduledTime || ''}","${r.hoursWorked || 0}","${r.reason || ''}","${r.notes || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `asistencias_${activeTab}_gymcontrol_${filterDate}.csv`;
    link.click();
  };

  // Status Badge for Staff
  const getStaffStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'puntual':
      case 'on_time':
      case 'authorized':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          label: 'Puntual',
          icon: CheckCircle2
        };
      case 'tarde':
      case 'late':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          label: 'Tarde',
          icon: Clock
        };
      case 'falta':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          label: 'Falta',
          icon: XCircle
        };
      case 'permiso':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          label: 'Permiso',
          icon: Info
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          label: status,
          icon: CheckCircle2
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 rounded-2xl p-5 sm:p-6 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <UserCheck className="w-4 h-4" />
              <span>Control de Asistencias Dividido & Nómina</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Control de Asistencias
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Módulo dividido por separado: seguimiento de personal de trabajo con horas de contrato, estados de puntualidad (Puntual, Tarde, Falta, Permiso) y motivos; y control de acceso de alumnos.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => {
                if (activeTab === 'staff') setIsStaffModalOpen(true);
                else setIsStudentModalOpen(true);
              }}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{activeTab === 'staff' ? 'Registrar Asistencia Personal' : 'Registrar Ingreso Alumno'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Quick Punch Bar in Banner */}
        <form onSubmit={handleQuickPunch} className="mt-5 pt-4 border-t border-slate-800 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Escanear o ingresar DNI / Nombre para marcación rápida de entrada..."
              value={quickInput}
              onChange={e => setQuickInput(e.target.value)}
              className="w-full bg-slate-800/90 hover:bg-slate-800 border border-slate-700 focus:border-blue-400 text-white placeholder-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span>Marcar</span>
            <ArrowRightCircle className="w-4 h-4" />
          </button>
        </form>

        {lastPunchResult && (
          <div className={`mt-3 p-3 rounded-xl border text-xs flex items-center justify-between ${
            lastPunchResult.success 
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200' 
              : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>{lastPunchResult.name}</strong> ({lastPunchResult.role}) — {lastPunchResult.message}</span>
            </div>
            <button 
              onClick={() => setLastPunchResult(null)}
              className="text-white/60 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* PRIMARY TAB SWITCHER: PERSONAL DE TRABAJO vs ALUMNOS */}
      <div className="flex items-center gap-2 p-1 bg-slate-200/80 rounded-2xl w-full sm:w-max">
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'staff'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Personal de Trabajo ({staffRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'students'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Alumnos / Socios ({studentRecords.length})</span>
        </button>
      </div>

      {/* ---------------- SECTION 1: PERSONAL DE TRABAJO ---------------- */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          {/* Staff KPI Indicators for states */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase block">Puntuales Hoy</span>
                <span className="text-2xl font-extrabold text-emerald-950">{staffStats.puntual}</span>
              </div>
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-700 uppercase block">Tardanzas</span>
                <span className="text-2xl font-extrabold text-amber-950">{staffStats.tarde}</span>
                <span className="text-[10px] text-amber-600 block mt-0.5">Sujeto a descuento</span>
              </div>
              <Clock className="w-6 h-6 text-amber-600" />
            </div>

            <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-rose-700 uppercase block">Faltas Injustificadas</span>
                <span className="text-2xl font-extrabold text-rose-950">{staffStats.falta}</span>
                <span className="text-[10px] text-rose-600 block mt-0.5">Descuento de jornada</span>
              </div>
              <XCircle className="w-6 h-6 text-rose-600" />
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase block">Permisos Autorizados</span>
                <span className="text-2xl font-extrabold text-blue-950">{staffStats.permiso}</span>
                <span className="text-[10px] text-blue-600 block mt-0.5">Justificados</span>
              </div>
              <Info className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center flex-wrap gap-2">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={e => setFilterDate(e.target.value)}
                  className="font-bold text-slate-800 bg-transparent focus:outline-none"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="puntual">Puntual</option>
                <option value="tarde">Tarde</option>
                <option value="falta">Falta</option>
                <option value="permiso">Permiso</option>
              </select>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por colaborador, DNI o motivo..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Staff Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-4">Colaborador / Cargo</th>
                    <th className="py-3 px-3">DNI</th>
                    <th className="py-3 px-3">Hora Marcación</th>
                    <th className="py-3 px-3">Horario en Contrato</th>
                    <th className="py-3 px-3 text-center">Horas Efectivas</th>
                    <th className="py-3 px-3">Estado de Asistencia</th>
                    <th className="py-3 px-4">Motivo / Justificación</th>
                    <th className="py-3 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staffRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400">
                        No se encontraron registros de asistencia de personal para la fecha seleccionada.
                      </td>
                    </tr>
                  ) : (
                    staffRecords.map(rec => {
                      const badge = getStaffStatusBadge(rec.status);
                      const BadgeIcon = badge.icon;
                      const staffContract = staffContracts.find(s => s.dni === rec.userDni || s.fullName === rec.userName);

                      return (
                        <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-extrabold text-slate-900">{rec.userName}</div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {staffContract ? staffContract.roleTitle : rec.userRole} • {staffContract?.contractDurationLabel || 'Contrato Vigente'}
                            </div>
                          </td>

                          <td className="py-3 px-3 font-mono text-slate-600">
                            {rec.userDni}
                          </td>

                          <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-blue-600" />
                              <span>{rec.time}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block">{rec.date}</span>
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap text-slate-700 font-medium">
                            {rec.scheduledTime || staffContract?.assignedWeeklyHours ? `${staffContract?.assignedWeeklyHours}h sem` : '08:00 AM - 04:00 PM'}
                          </td>

                          <td className="py-3 px-3 text-center font-extrabold text-blue-700">
                            {rec.hoursWorked !== undefined ? `${rec.hoursWorked} hrs` : '8 hrs'}
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${badge.bg}`}>
                              <BadgeIcon className="w-3.5 h-3.5" />
                              <span>{badge.label}</span>
                            </span>
                          </td>

                          <td className="py-3 px-4 max-w-xs">
                            {rec.reason ? (
                              <div className="text-slate-800 bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-[11px] font-medium">
                                <strong>Motivo:</strong> {rec.reason}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px] italic">Sin incidencias registradas</span>
                            )}
                            {rec.notes && (
                              <span className="text-[10px] text-slate-500 block mt-0.5">{rec.notes}</span>
                            )}
                          </td>

                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => deleteAttendance(rec.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
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
        </div>
      )}

      {/* ---------------- SECTION 2: ALUMNOS / SOCIOS ---------------- */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          {/* Table for Students */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                Marcaciones de Alumnos ({studentRecords.length})
              </span>
              <span className="text-slate-500">
                Validación de membresía y control de torniquete / QR
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-4">Hora / Fecha</th>
                    <th className="py-3 px-4">Alumno</th>
                    <th className="py-3 px-3">DNI</th>
                    <th className="py-3 px-3">Plan de Membresía</th>
                    <th className="py-3 px-3">Estado de Acceso</th>
                    <th className="py-3 px-3">Método</th>
                    <th className="py-3 px-4">Observaciones</th>
                    <th className="py-3 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400">
                        No se encontraron ingresos de alumnos registrados para esta fecha.
                      </td>
                    </tr>
                  ) : (
                    studentRecords.map(rec => {
                      const isWarning = rec.status === 'warning' || (rec.notes && rec.notes.includes('venc'));
                      return (
                        <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-blue-600" />
                              <span>{rec.time}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block">{rec.date}</span>
                          </td>

                          <td className="py-3 px-4 font-extrabold text-slate-900">
                            {rec.userName}
                          </td>

                          <td className="py-3 px-3 font-mono text-slate-600">
                            {rec.userDni}
                          </td>

                          <td className="py-3 px-3 text-slate-700 font-medium">
                            {rec.membershipPlan || 'Plan Regular'}
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${
                              isWarning 
                                ? 'bg-amber-50 text-amber-800 border-amber-300' 
                                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            }`}>
                              {isWarning ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                              <span>{isWarning ? 'Atención / Vencimiento' : 'Acceso Concedido'}</span>
                            </span>
                          </td>

                          <td className="py-3 px-3 uppercase text-[10px] font-bold text-slate-500">
                            {rec.checkInMethod}
                          </td>

                          <td className="py-3 px-4 text-slate-600 text-[11px]">
                            {rec.notes || 'Ingreso regular a sala de pesas'}
                          </td>

                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => deleteAttendance(rec.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                              title="Eliminar"
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
        </div>
      )}

      {/* ---------------- MODAL: REGISTRAR ASISTENCIA DE PERSONAL ---------------- */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
            <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider block">
                  Control Laboral & Horas de Trabajo
                </span>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  Registrar Asistencia de Personal
                </h3>
              </div>
              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaffAttendance} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Colaborador / Personal de Trabajo *</label>
                <select
                  value={modalStaffId}
                  onChange={e => setModalStaffId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-xs font-semibold"
                >
                  {staffContracts.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} — {s.roleTitle} ({s.contractDurationLabel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status selection with Puntual, Tarde, Falta, Permiso */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Estado de Asistencia *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'puntual', label: 'Puntual', bg: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
                    { id: 'tarde', label: 'Tarde', bg: 'bg-amber-50 text-amber-800 border-amber-300' },
                    { id: 'falta', label: 'Falta', bg: 'bg-rose-50 text-rose-800 border-rose-300' },
                    { id: 'permiso', label: 'Permiso', bg: 'bg-blue-50 text-blue-800 border-blue-300' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setModalStaffStatus(item.id as any)}
                      className={`py-2 px-3 rounded-xl border text-center font-extrabold transition-all cursor-pointer ${
                        modalStaffStatus === item.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400'
                          : item.bg
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Hora de Entrada *</label>
                  <input
                    type="text"
                    value={modalStaffTime}
                    onChange={e => setModalStaffTime(e.target.value)}
                    placeholder="08:00 AM"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Horas Trabajadas Hoy *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="16"
                    value={modalStaffHours}
                    onChange={e => setModalStaffHours(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
              </div>

              {/* Motivo (Especially for Tarde, Falta, Permiso) */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Motivo de Incidencia / Justificación {modalStaffStatus !== 'puntual' && <span className="text-rose-600">*</span>}
                </label>
                <input
                  type="text"
                  required={modalStaffStatus !== 'puntual'}
                  value={modalStaffReason}
                  onChange={e => setModalStaffReason(e.target.value)}
                  placeholder={
                    modalStaffStatus === 'tarde'
                      ? 'Ej. Retraso de 20 minutos por congestión vehicular en Av. Javier Prado'
                      : modalStaffStatus === 'permiso'
                      ? 'Ej. Cita médica en Essalud autorizada por jefatura con constancia'
                      : modalStaffStatus === 'falta'
                      ? 'Ej. Inasistencia injustificada sin aviso previo'
                      : 'Opcional si es puntual'
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Observaciones adicionales para nómina</label>
                <textarea
                  rows={2}
                  value={modalStaffNotes}
                  onChange={e => setModalStaffNotes(e.target.value)}
                  placeholder="Se evaluará descuento correspondiente en liquidación de fin de mes..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar Marcación</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: REGISTRAR INGRESO ALUMNO ---------------- */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden my-6">
            <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block">
                  Acceso de Miembros
                </span>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-400" />
                  Registrar Ingreso de Alumno
                </h3>
              </div>
              <button
                onClick={() => setIsStudentModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudentAttendance} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Seleccionar Alumno *</label>
                <select
                  value={modalStudentId}
                  onChange={e => setModalStudentId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 text-xs"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} — DNI: {m.dni} ({m.planName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Notas de Recepción</label>
                <input
                  type="text"
                  value={modalStudentNotes}
                  onChange={e => setModalStudentNotes(e.target.value)}
                  placeholder="Ingreso regular a sala de musculación..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Validar Ingreso</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
