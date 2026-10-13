import React, { useState, useMemo } from 'react';
import { 
  HeartPulse, 
  Search, 
  Filter, 
  AlertTriangle, 
  Plus, 
  FileText, 
  User, 
  Calendar, 
  Clock, 
  Activity, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  Phone, 
  Share2, 
  Printer, 
  ChevronRight, 
  Stethoscope, 
  TrendingDown, 
  Zap, 
  Layers, 
  Info, 
  AlertCircle,
  Eye,
  Trash2,
  X
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { Member, PhysiotherapySessionRecord, BodyPainZone } from '../../types/gym';
import confetti from 'canvas-confetti';

const PAIN_ZONES: { id: BodyPainZone; label: string }[] = [
  { id: 'lumbar', label: 'Columna Lumbar' },
  { id: 'cervical', label: 'Columna Cervical' },
  { id: 'hombro', label: 'Hombro / Manguito Rotador' },
  { id: 'rodilla', label: 'Rodilla / Menisco / Rótula' },
  { id: 'cadera', label: 'Cadera / Pelvis / Psoas' },
  { id: 'tobillo_pie', label: 'Tobillo & Pie' },
  { id: 'columna_dorsal', label: 'Columna Dorsal' },
  { id: 'codo_muneca', label: 'Codo & Muñeca' },
  { id: 'muscular_general', label: 'Descarga Muscular General' }
];

const TREATMENT_TECHNIQUES = [
  'Electroterapia TENS analgésico',
  'Electroestimulación neuromuscular EMS',
  'Terapia manual miofascial / Masoterapia',
  'Punción seca ecoguiada',
  'Crioterapia / Crioterapia compresiva',
  'Termoterapia infrarroja profunda',
  'Kinesiotaping / Vendaje neuromuscular',
  'Ventosas neuromusculares (Cupping)',
  'Tracción / Descompresión vertebral',
  'Reeducación motriz & Ejercicios terapéuticos',
  'Estiramientos PNF asistidos'
];

export const PhysiotherapyModule: React.FC = () => {
  const { 
    members, 
    physioRecords, 
    addPhysioRecord, 
    deletePhysioRecord, 
    staffContracts, 
    currentUser 
  } = useGym();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRestrictionsOnly, setFilterRestrictionsOnly] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || '');
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<PhysiotherapySessionRecord | null>(null);

  // New Session Form State
  const [formMemberId, setFormMemberId] = useState('');
  const [formPhysioName, setFormPhysioName] = useState('Lic. Diego Morales Quintana');
  const [formDate, setFormDate] = useState('2026-08-30');
  const [formTime, setFormTime] = useState('10:00 AM');
  const [formReason, setFormReason] = useState('');
  const [formZone, setFormZone] = useState<BodyPainZone>('lumbar');
  const [formPainEVA, setFormPainEVA] = useState<number>(5);
  const [formPostural, setFormPostural] = useState('');
  const [formROM, setFormROM] = useState('');
  const [formFunctionalTests, setFormFunctionalTests] = useState('');
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([
    'Electroterapia TENS analgésico',
    'Terapia manual miofascial / Masoterapia'
  ]);
  const [formGymRestrictions, setFormGymRestrictions] = useState('');
  const [formHomeIndications, setFormHomeIndications] = useState('');
  const [formEvolutionNotes, setFormEvolutionNotes] = useState('');
  const [formNextAppt, setFormNextAppt] = useState('');

  // Physiotherapists available from staff contracts
  const availablePhysios = useMemo(() => {
    const list = staffContracts.filter(s => s.role === 'physiotherapist');
    if (list.length > 0) return list.map(s => s.fullName);
    return ['Lic. Diego Morales Quintana', 'Lic. Camila Vega Alvarado'];
  }, [staffContracts]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchSearch = 
        m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.dni.includes(searchTerm) ||
        m.phone.includes(searchTerm);

      const hasRestrictions = Boolean(m.medicalNotes && m.medicalNotes.trim().length > 0);
      const matchRestrictions = !filterRestrictionsOnly || hasRestrictions;

      return matchSearch && matchRestrictions;
    });
  }, [members, searchTerm, filterRestrictionsOnly]);

  const selectedMember = useMemo(() => {
    return members.find(m => m.id === selectedMemberId) || members[0];
  }, [members, selectedMemberId]);

  // Sessions for the selected member
  const memberSessions = useMemo(() => {
    if (!selectedMember) return [];
    return physioRecords
      .filter(r => r.memberId === selectedMember.id)
      .sort((a, b) => b.sessionNumber - a.sessionNumber);
  }, [physioRecords, selectedMember]);

  // Open modal with preselected member
  const handleOpenNewSession = (targetMember?: Member) => {
    const mem = targetMember || selectedMember;
    if (mem) {
      setFormMemberId(mem.id);
      setFormReason('');
      setFormPostural('');
      setFormROM('Movilidad activa conservada con ligera limitación final por dolor.');
      setFormFunctionalTests('');
      setFormGymRestrictions('');
      setFormHomeIndications('Aplicar frío o calor local 15 minutos según indicación.');
      setFormEvolutionNotes('');
      setFormPainEVA(5);
      setSelectedTreatments(['Electroterapia TENS analgésico', 'Terapia manual miofascial / Masoterapia']);
      setIsNewSessionModalOpen(true);
    }
  };

  const handleToggleTreatment = (treatment: string) => {
    setSelectedTreatments(prev => 
      prev.includes(treatment) 
        ? prev.filter(t => t !== treatment)
        : [...prev, treatment]
    );
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find(m => m.id === formMemberId);
    if (!mem) return;

    addPhysioRecord({
      memberId: mem.id,
      memberName: mem.fullName,
      memberDni: mem.dni,
      memberPhone: mem.phone,
      date: formDate,
      time: formTime,
      physiotherapistId: 'physio-active',
      physiotherapistName: formPhysioName,
      initialMedicalRestrictions: mem.medicalNotes || 'Sin restricciones médicas reportadas en la inscripción.',
      consultationReason: formReason.trim() || 'Consulta fisioterapéutica y evaluación musculoesquelética',
      affectedZone: formZone,
      painLevelEVA: formPainEVA,
      posturalEvaluation: formPostural.trim() || 'Evaluación postural dentro de parámetros normales sin asimetrías severas.',
      rangeOfMotion: formROM.trim() || 'Rango de movimiento funcional evaluado.',
      functionalTests: formFunctionalTests.trim() || 'Pruebas funcionales realizadas en sesión.',
      treatmentsApplied: selectedTreatments,
      gymWorkoutRestrictions: formGymRestrictions.trim() || 'Adaptar cargas según tolerancia al dolor.',
      homeIndications: formHomeIndications.trim() || 'Descanso activo e hidratación.',
      evolutionNotes: formEvolutionNotes.trim() || 'Sesión completada con buena respuesta del alumno.',
      nextAppointmentDate: formNextAppt || undefined
    });

    confetti({ particleCount: 45, spread: 60 });
    setIsNewSessionModalOpen(false);
  };

  const getEVABadge = (level: number) => {
    if (level === 0) return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', text: '0/10 Sin dolor' };
    if (level <= 3) return { bg: 'bg-green-100 text-green-800 border-green-300', text: `${level}/10 Leve` };
    if (level <= 6) return { bg: 'bg-amber-100 text-amber-800 border-amber-300', text: `${level}/10 Moderado` };
    if (level <= 8) return { bg: 'bg-orange-100 text-orange-800 border-orange-300', text: `${level}/10 Severo` };
    return { bg: 'bg-rose-100 text-rose-800 border-rose-300', text: `${level}/10 Intenso` };
  };

  const shareViaWhatsApp = (session: PhysiotherapySessionRecord) => {
    const text = encodeURIComponent(
      `*INFORME FISIOTERAPÉUTICO - GYMCONTROL*\n` +
      `👤 *Alumno:* ${session.memberName} (DNI: ${session.memberDni})\n` +
      `📅 *Fecha:* ${session.date} | Sesión #${session.sessionNumber}\n` +
      `👨‍⚕️ *Fisioterapeuta:* ${session.physiotherapistName}\n` +
      `🩺 *Motivo:* ${session.consultationReason}\n` +
      `⚡ *Nivel de Dolor:* ${session.painLevelEVA}/10 (EVA)\n` +
      `⛔ *Restricciones en Gimnasio:* ${session.gymWorkoutRestrictions}\n` +
      `🏠 *Pautas para el hogar:* ${session.homeIndications}\n` +
      `🗓️ *Próxima Cita:* ${session.nextAppointmentDate || 'Por programar'}`
    );
    const phone = session.memberPhone ? session.memberPhone.replace(/\D/g, '') : '';
    const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <HeartPulse className="w-4 h-4" />
              <span>Centro de Fisioterapia, Kinesiología & Rehabilitación</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Historial Clínico & Fisioterapia
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Base de datos integral de clientes con inspección inmediata de restricciones médicas y lesiones declaradas en la inscripción, evaluaciones biomecánicas, escala EVA e historial clínico por alumno.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleOpenNewSession()}
              className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Consulta / Ficha</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Client Database Selector) / Right Column (Clinical File & Evolution History) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: CLIENT DATABASE & SEARCH (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" />
                <span>Base de Datos de Alumnos</span>
              </h2>
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {filteredMembers.length} alumnos
              </span>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por nombre, DNI o teléfono..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Toggle: Only with medical restrictions */}
            <button
              onClick={() => setFilterRestrictionsOnly(!filterRestrictionsOnly)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors border mb-3 cursor-pointer ${
                filterRestrictionsOnly 
                  ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-3.5 h-3.5 ${filterRestrictionsOnly ? 'text-amber-600' : 'text-slate-400'}`} />
                <span>Solo con Restricciones Médicas</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-950 font-bold">
                {members.filter(m => m.medicalNotes && m.medicalNotes.trim().length > 0).length}
              </span>
            </button>

            {/* Students List */}
            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {filteredMembers.map(member => {
                const isSelected = selectedMember?.id === member.id;
                const hasRestrictions = Boolean(member.medicalNotes && member.medicalNotes.trim().length > 0);
                const sessionCount = physioRecords.filter(r => r.memberId === member.id).length;

                return (
                  <div
                    key={member.id}
                    onClick={() => setSelectedMemberId(member.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 ring-1 ring-blue-500 shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {member.photoUrl ? (
                          <img 
                            src={member.photoUrl} 
                            alt={member.fullName}
                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200" 
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                            {member.fullName.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {member.fullName}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            DNI: {member.dni} • {member.planName}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0 gap-1">
                        {sessionCount > 0 ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                            {sessionCount} {sessionCount === 1 ? 'sesión' : 'sesiones'}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Sin ficha</span>
                        )}
                      </div>
                    </div>

                    {/* Medical Restriction Warning Flag */}
                    {hasRestrictions && (
                      <div className="mt-2 text-[11px] font-medium text-amber-800 bg-amber-50/90 border border-amber-200/80 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{member.medicalNotes}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CLIENT CLINICAL VIEW & EVOLUTION HISTORY (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Active Member Medical Profile Card */}
          {selectedMember ? (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  {selectedMember.photoUrl ? (
                    <img
                      src={selectedMember.photoUrl}
                      alt={selectedMember.fullName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-sm">
                      {selectedMember.fullName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900">
                        {selectedMember.fullName}
                      </h3>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        selectedMember.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {selectedMember.status === 'active' ? 'Membresía Activa' : 'Membresía Inactiva'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      DNI: {selectedMember.dni} • Tel: {selectedMember.phone} • Plan: {selectedMember.planName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenNewSession(selectedMember)}
                    className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl font-semibold text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Registrar Sesión</span>
                  </button>
                </div>
              </div>

              {/* MEDICAL RESTRICTIONS FROM ENROLLMENT (HIGHLIGHTED BANNER) */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-rose-500/10 border-l-4 border-amber-500 p-4 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5 uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    Restricciones Médicas y Lesiones Declaradas al Inscribirse:
                  </span>
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Ficha de Ingreso
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white/70 p-2.5 rounded-lg border border-amber-200/60">
                  {selectedMember.medicalNotes && selectedMember.medicalNotes.trim().length > 0 
                    ? selectedMember.medicalNotes 
                    : 'ℹ️ No se registraron restricciones médicas ni lesiones previas al momento de la inscripción del alumno en recepción.'}
                </p>
                <div className="text-[11px] text-slate-500 flex flex-wrap gap-4 pt-1">
                  <span><strong>Contacto Emergencia:</strong> {selectedMember.emergencyContact?.name} ({selectedMember.emergencyContact?.relationship}) - {selectedMember.emergencyContact?.phone}</span>
                  <span><strong>Objetivo declarado:</strong> {selectedMember.objective}</span>
                </div>
              </div>

              {/* Clinical History of Sessions for this Student */}
              <div>
                <div className="flex items-center justify-between mb-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span>Historial Clínico Evolutivo ({memberSessions.length} {memberSessions.length === 1 ? 'Sesión' : 'Sesiones'})</span>
                  </h4>
                  {memberSessions.length > 0 && (
                    <span className="text-[11px] text-slate-500">
                      Última sesión: {memberSessions[0].date}
                    </span>
                  )}
                </div>

                {memberSessions.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <HeartPulse className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">Sin sesiones registradas aún</p>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-0.5">
                      Este alumno aún no cuenta con sesiones de fisioterapia o rehabilitación ingresadas.
                    </p>
                    <button
                      onClick={() => handleOpenNewSession(selectedMember)}
                      className="mt-3 inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Registrar Primera Sesión</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {memberSessions.map((session) => {
                      const evaBadge = getEVABadge(session.painLevelEVA);

                      return (
                        <div 
                          key={session.id} 
                          className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors bg-white shadow-xs space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                                #{session.sessionNumber}
                              </span>
                              <div>
                                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                  <span>{session.consultationReason}</span>
                                </h5>
                                <span className="text-[11px] text-slate-500">
                                  {session.date} a las {session.time} • Por {session.physiotherapistName}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Pain EVA Badge */}
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${evaBadge.bg}`}>
                                Dolor: {evaBadge.text}
                              </span>

                              {/* Zone Badge */}
                              <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full capitalize">
                                {session.affectedZone.replace('_', ' ')}
                              </span>
                            </div>
                          </div>

                          {/* Clinical Details Breakdown */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="space-y-1.5 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                              <p className="font-bold text-slate-700 flex items-center gap-1">
                                <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                                <span>Evaluación Postural & ROM:</span>
                              </p>
                              <p className="text-slate-600 text-[11px]">{session.posturalEvaluation}</p>
                              <p className="text-slate-600 text-[11px]"><strong>ROM:</strong> {session.rangeOfMotion}</p>
                              {session.functionalTests && (
                                <p className="text-slate-600 text-[11px]"><strong>Pruebas:</strong> {session.functionalTests}</p>
                              )}
                            </div>

                            <div className="space-y-1.5 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                              <p className="font-bold text-slate-700 flex items-center gap-1">
                                <Zap className="w-3.5 h-3.5 text-amber-600" />
                                <span>Técnicas y Tratamiento Aplicado:</span>
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {session.treatmentsApplied.map((t, idx) => (
                                  <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Gym Workout Restrictions & Home Guidelines */}
                          <div className="bg-rose-50/70 border border-rose-200/80 rounded-lg p-2.5 text-xs text-rose-900 space-y-1">
                            <span className="font-bold flex items-center gap-1.5 text-rose-800 text-[11px] uppercase tracking-wide">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                              Restricciones para el Gimnasio (Comunicar a Entrenadores):
                            </span>
                            <p className="text-[11px] text-slate-800 font-medium">
                              {session.gymWorkoutRestrictions || 'Sin restricciones restrictivas para el entrenamiento guiado.'}
                            </p>
                          </div>

                          {/* Evolution & Actions Bar */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[11px]">
                            <div className="text-slate-600">
                              <strong>Evolución:</strong> {session.evolutionNotes}
                              {session.nextAppointmentDate && (
                                <span className="ml-2 text-blue-600 font-semibold">
                                  • Próx. Cita: {session.nextAppointmentDate}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => shareViaWhatsApp(session)}
                                className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer"
                                title="Enviar resumen e indicaciones por WhatsApp"
                              >
                                <Share2 className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </button>
                              
                              <button
                                onClick={() => deletePhysioRecord(session.id)}
                                className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                                title="Eliminar registro"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200">
              <User className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-bold text-slate-700">Selecciona un alumno para revisar su historial</p>
              <p className="text-xs text-slate-500 mt-1">Usa el buscador lateral para elegir a un cliente.</p>
            </div>
          )}
        </div>
      </div>

      {/* EXTENSIVE NEW SESSION REGISTRATION MODAL */}
      {isNewSessionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider block">
                  Fisioterapia & Rehabilitación
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-cyan-400" />
                  Nueva Sesión / Ficha Clínica Exhaustiva
                </h3>
              </div>
              <button
                onClick={() => setIsNewSessionModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveSession} className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              
              {/* Patient Selector & Info Header */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-blue-50/60 p-4 rounded-xl border border-blue-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alumno / Paciente *
                  </label>
                  <select
                    value={formMemberId}
                    onChange={e => setFormMemberId(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.fullName} - DNI: {m.dni} ({m.planName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fisioterapeuta Tratante *
                  </label>
                  <select
                    value={formPhysioName}
                    onChange={e => setFormPhysioName(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {availablePhysios.map((name, i) => (
                      <option key={i} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                {/* Show Selected Member's Registration Medical Restrictions right inside the form */}
                <div className="sm:col-span-2 bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-900">
                  <span className="font-bold flex items-center gap-1.5 text-amber-800 text-[11px] mb-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    Restricciones de Inscripción Registradas para este Alumno:
                  </span>
                  <p className="font-medium text-slate-800 text-[11px]">
                    {members.find(m => m.id === formMemberId)?.medicalNotes || 'Sin restricciones médicas reportadas al inscribirse en el gimnasio.'}
                  </p>
                </div>
              </div>

              {/* Consultation Date, Time, Zone & Pain EVA */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fecha de Sesión *
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    required
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hora de Sesión *
                  </label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={e => setFormTime(e.target.value)}
                    placeholder="ej. 10:30 AM"
                    required
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Zona Corporal Afectada *
                  </label>
                  <select
                    value={formZone}
                    onChange={e => setFormZone(e.target.value as BodyPainZone)}
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {PAIN_ZONES.map(z => (
                      <option key={z.id} value={z.id}>{z.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pain Scale EVA Slider (0 - 10) */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-rose-600" />
                    <span>Nivel de Dolor - Escala Visual Analógica (EVA):</span>
                  </label>
                  <span className={`px-2.5 py-0.5 text-xs font-black rounded-full border ${getEVABadge(formPainEVA).bg}`}>
                    {formPainEVA} / 10 • {getEVABadge(formPainEVA).text}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={formPainEVA}
                  onChange={e => setFormPainEVA(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-600 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                  <span>0: Sin dolor</span>
                  <span>3: Leve</span>
                  <span>5: Moderado</span>
                  <span>7: Severo</span>
                  <span>10: Inhabilitante</span>
                </div>
              </div>

              {/* Motivo de Consulta & Diagnóstico Fisioterapéutico */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Motivo de Consulta / Diagnóstico Kinesiológico *
                </label>
                <input
                  type="text"
                  value={formReason}
                  onChange={e => setFormReason(e.target.value)}
                  placeholder="ej. Sobrecarga lumbar L4-L5 por sentadilla pesada, tendinopatía de la pata de ganso"
                  required
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Postural Analysis, ROM & Functional Tests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Evaluación Postural & Biomecánica
                  </label>
                  <textarea
                    rows={2}
                    value={formPostural}
                    onChange={e => setFormPostural(e.target.value)}
                    placeholder="ej. Hiperlordosis lumbar compensatoria, asimetría escapular, valgo de rodilla..."
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rango de Movimiento (ROM) & Pruebas
                  </label>
                  <textarea
                    rows={2}
                    value={formROM}
                    onChange={e => setFormROM(e.target.value)}
                    placeholder="ej. Flexión limitada al 70% por dolor; Test de Thomas positivo, Lasègue negativo..."
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Treatments Applied Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Técnicas y Procedimientos Aplicados en la Sesión
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {TREATMENT_TECHNIQUES.map((tech) => {
                    const isChecked = selectedTreatments.includes(tech);
                    return (
                      <button
                        type="button"
                        key={tech}
                        onClick={() => handleToggleTreatment(tech)}
                        className={`p-2 rounded-lg text-left text-xs font-medium border flex items-center justify-between transition-colors cursor-pointer ${
                          isChecked 
                            ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate pr-1 text-[11px]">{tech}</span>
                        {isChecked ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded border border-slate-300 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Restricciones para el Gimnasio & Pautas para Casa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-rose-800 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Restricciones de Entrenamiento en Gimnasio *</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formGymRestrictions}
                    onChange={e => setFormGymRestrictions(e.target.value)}
                    placeholder="ej. PROHIBIDO sentadillas con barra libre > 30kg. Reemplazar por prensa a 45° con apoyo lumbar."
                    required
                    className="w-full text-xs p-2 bg-rose-50/50 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 text-rose-950 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pautas para el Hogar & Próxima Cita
                  </label>
                  <textarea
                    rows={2}
                    value={formHomeIndications}
                    onChange={e => setFormHomeIndications(e.target.value)}
                    placeholder="ej. Hielo 15 min 2 veces al día. Estiramientos de psoas e isquiotibiales 3x30 seg."
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Evolution & Next Appointment */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Notas de Evolución & Respuesta Inmediata
                  </label>
                  <input
                    type="text"
                    value={formEvolutionNotes}
                    onChange={e => setFormEvolutionNotes(e.target.value)}
                    placeholder="ej. Dolor descendió de EVA 6 a EVA 2 al terminar la sesión. Marcha sin claudicación."
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fecha Próxima Cita
                  </label>
                  <input
                    type="date"
                    value={formNextAppt}
                    onChange={e => setFormNextAppt(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewSessionModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar e Integrar en Historial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
