import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Ruler, 
  Scale, 
  Plus, 
  Search, 
  User, 
  Calendar, 
  TrendingDown, 
  TrendingUp, 
  Share2, 
  Printer, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Flame, 
  HeartPulse, 
  Droplet, 
  ChevronRight, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  X
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { useGym } from '../../context/GymContext';
import { BodyAssessment, Member, AnthropometricPerimeters, BioimpedanceData } from '../../types/gym';
import confetti from 'canvas-confetti';

export const MeasurementsModule: React.FC = () => {
  const { members, trainers, bodyAssessments, addBodyAssessment, deleteBodyAssessment } = useGym();

  // Active Member Selection
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || '');
  const [searchMemberQuery, setSearchMemberQuery] = useState('');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);

  // New Assessment Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [formMemberId, setFormMemberId] = useState<string>(members[0]?.id || '');
  const [activeBodyZone, setActiveBodyZone] = useState<'tronco' | 'cintura' | 'brazos' | 'piernas'>('cintura');
  const [activeFocusZone, setActiveFocusZone] = useState<string | null>(null);
  const [modalMemberSearch, setModalMemberSearch] = useState('');

  // Form Fields
  const [formDate, setFormDate] = useState('2026-08-30');
  const [formTime, setFormTime] = useState('09:00 AM');
  const [formEvaluator, setFormEvaluator] = useState('Carlos Mendoza');
  const [formWeight, setFormWeight] = useState<number>(75.0);
  const [formHeight, setFormHeight] = useState<number>(175);

  // Perimeters
  const [perimNeck, setPerimNeck] = useState<number>(38.0);
  const [perimShoulders, setPerimShoulders] = useState<number>(115.0);
  const [perimChest, setPerimChest] = useState<number>(98.0);
  const [perimWaist, setPerimWaist] = useState<number>(82.0);
  const [perimAbdomen, setPerimAbdomen] = useState<number>(86.0);
  const [perimHip, setPerimHip] = useState<number>(98.0);
  const [perimBicepsRelL, setPerimBicepsRelL] = useState<number>(33.0);
  const [perimBicepsRelR, setPerimBicepsRelR] = useState<number>(33.5);
  const [perimBicepsFlexL, setPerimBicepsFlexL] = useState<number>(36.0);
  const [perimBicepsFlexR, setPerimBicepsFlexR] = useState<number>(36.5);
  const [perimForearm, setPerimForearm] = useState<number>(28.5);
  const [perimThighSup, setPerimThighSup] = useState<number>(58.0);
  const [perimThighMid, setPerimThighMid] = useState<number>(54.0);
  const [perimCalf, setPerimCalf] = useState<number>(37.0);

  // Bioimpedance
  const [biaFatPct, setBiaFatPct] = useState<number>(18.0);
  const [biaMusclePct, setBiaMusclePct] = useState<number>(45.0);
  const [biaVisceral, setBiaVisceral] = useState<number>(6);
  const [biaWaterPct, setBiaWaterPct] = useState<number>(58.0);
  const [biaBoneKg, setBiaBoneKg] = useState<number>(3.1);
  const [biaBmr, setBiaBmr] = useState<number>(1720);
  const [biaMetabolicAge, setBiaMetabolicAge] = useState<number>(27);
  const [formNotes, setFormNotes] = useState('Evaluación de seguimiento. Buena respuesta al entrenamiento.');
  const [formGoals, setFormGoals] = useState('Continuar progresión en fuerza y mantener hidratación.');

  // Current Selected Member
  const selectedMember = useMemo(() => {
    return members.find(m => m.id === selectedMemberId) || members[0];
  }, [members, selectedMemberId]);

  // Current Member in Form
  const formMember = useMemo(() => {
    return members.find(m => m.id === formMemberId) || selectedMember;
  }, [members, formMemberId, selectedMember]);

  // Previous assessment for member in form
  const formMemberPreviousAssessment = useMemo(() => {
    const list = bodyAssessments
      .filter(a => a.memberId === formMemberId)
      .sort((a, b) => a.date.localeCompare(b.date));
    return list[list.length - 1] || null;
  }, [bodyAssessments, formMemberId]);

  // Assessments for this student sorted chronologically
  const memberAssessments = useMemo(() => {
    return bodyAssessments
      .filter(a => a.memberId === selectedMemberId)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [bodyAssessments, selectedMemberId]);

  // Current Active Detail Assessment (default to latest)
  const currentDetailAssessment = useMemo(() => {
    if (selectedAssessmentId) {
      const found = memberAssessments.find(a => a.id === selectedAssessmentId);
      if (found) return found;
    }
    return memberAssessments[memberAssessments.length - 1] || null;
  }, [memberAssessments, selectedAssessmentId]);

  // History Comparisons / Deltas (first vs last)
  const historicalDeltas = useMemo(() => {
    if (memberAssessments.length < 2) return null;
    const first = memberAssessments[0];
    const latest = memberAssessments[memberAssessments.length - 1];

    const weightDelta = Number((latest.weightKg - first.weightKg).toFixed(1));
    const fatPctDelta = Number((latest.bioimpedance.bodyFatPercentage - first.bioimpedance.bodyFatPercentage).toFixed(1));
    const muscleKgDelta = Number((latest.bioimpedance.muscleMassKg - first.bioimpedance.muscleMassKg).toFixed(1));
    const waistDelta = Number((latest.perimeters.waist - first.perimeters.waist).toFixed(1));
    const visceralDelta = latest.bioimpedance.visceralFatLevel - first.bioimpedance.visceralFatLevel;

    return {
      firstDate: first.date,
      latestDate: latest.date,
      evalCount: memberAssessments.length,
      weightDelta,
      fatPctDelta,
      muscleKgDelta,
      waistDelta,
      visceralDelta
    };
  }, [memberAssessments]);

  // Chart Dataset
  const chartData = useMemo(() => {
    return memberAssessments.map(a => ({
      date: a.date.substring(5), // MM-DD
      fullDate: a.date,
      peso: a.weightKg,
      grasaPct: a.bioimpedance.bodyFatPercentage,
      musculoKg: a.bioimpedance.muscleMassKg,
      cintura: a.perimeters.waist,
      cadera: a.perimeters.hip,
      pecho: a.perimeters.chest,
      brazo: a.perimeters.bicepsFlexedRight
    }));
  }, [memberAssessments]);

  // Auto-calculated fields in real-time for form
  const computedFormMetrics = useMemo(() => {
    const hM = formHeight / 100;
    const bmi = Number((formWeight / (hM * hM)).toFixed(2));
    let bmiClassification: BodyAssessment['bmiClassification'] = 'Normal';
    if (bmi < 18.5) bmiClassification = 'Bajo peso';
    else if (bmi < 25) bmiClassification = 'Normal';
    else if (bmi < 30) bmiClassification = 'Sobrepeso';
    else if (bmi < 35) bmiClassification = 'Obesidad I';
    else if (bmi < 40) bmiClassification = 'Obesidad II';
    else bmiClassification = 'Obesidad III';

    const waistHipRatio = Number((perimWaist / (perimHip || 1)).toFixed(2));
    let waistHipRisk: 'Bajo' | 'Moderado' | 'Alto' = 'Bajo';
    const isMale = selectedMember?.gender !== 'F';
    if (isMale) {
      if (waistHipRatio > 0.95) waistHipRisk = 'Alto';
      else if (waistHipRatio > 0.90) waistHipRisk = 'Moderado';
    } else {
      if (waistHipRatio > 0.85) waistHipRisk = 'Alto';
      else if (waistHipRatio > 0.80) waistHipRisk = 'Moderado';
    }

    const waistHeightRatio = Number((perimWaist / (formHeight || 1)).toFixed(2));
    const fatKg = Number(((formWeight * biaFatPct) / 100).toFixed(2));
    const muscleKg = Number(((formWeight * biaMusclePct) / 100).toFixed(2));
    const leanMassKg = Number((formWeight - fatKg).toFixed(2));
    const waterLiters = Number(((formWeight * biaWaterPct) / 100).toFixed(1));

    return {
      bmi,
      bmiClassification,
      waistHipRatio,
      waistHipRisk,
      waistHeightRatio,
      fatKg,
      muscleKg,
      leanMassKg,
      waterLiters
    };
  }, [formWeight, formHeight, perimWaist, perimHip, biaFatPct, biaMusclePct, biaWaterPct, selectedMember]);

  // Helper to load member metrics into the form
  const loadMemberValuesIntoForm = (memberId: string) => {
    const list = bodyAssessments
      .filter(a => a.memberId === memberId)
      .sort((a, b) => a.date.localeCompare(b.date));
    const latest = list[list.length - 1];

    if (latest) {
      setFormWeight(latest.weightKg);
      setFormHeight(latest.heightCm);
      setPerimNeck(latest.perimeters.neck);
      setPerimShoulders(latest.perimeters.shoulders);
      setPerimChest(latest.perimeters.chest);
      setPerimWaist(latest.perimeters.waist);
      setPerimAbdomen(latest.perimeters.abdomen);
      setPerimHip(latest.perimeters.hip);
      setPerimBicepsRelL(latest.perimeters.bicepsRelaxedLeft);
      setPerimBicepsRelR(latest.perimeters.bicepsRelaxedRight);
      setPerimBicepsFlexL(latest.perimeters.bicepsFlexedLeft);
      setPerimBicepsFlexR(latest.perimeters.bicepsFlexedRight);
      setPerimForearm(latest.perimeters.forearm);
      setPerimThighSup(latest.perimeters.thighSuperior);
      setPerimThighMid(latest.perimeters.thighMid);
      setPerimCalf(latest.perimeters.calf);

      setBiaFatPct(latest.bioimpedance.bodyFatPercentage);
      setBiaMusclePct(latest.bioimpedance.muscleMassPercentage);
      setBiaVisceral(latest.bioimpedance.visceralFatLevel);
      setBiaWaterPct(latest.bioimpedance.totalBodyWaterPercentage);
      setBiaBoneKg(latest.bioimpedance.boneMassKg);
      setBiaBmr(latest.bioimpedance.basalMetabolicRateKcal);
      setBiaMetabolicAge(latest.bioimpedance.metabolicAge);
    } else {
      // Default initial baseline for a new student
      setFormWeight(72.0);
      setFormHeight(172);
      setPerimNeck(37.5);
      setPerimShoulders(112.0);
      setPerimChest(96.0);
      setPerimWaist(81.0);
      setPerimAbdomen(85.0);
      setPerimHip(97.0);
      setPerimBicepsRelL(32.0);
      setPerimBicepsRelR(32.5);
      setPerimBicepsFlexL(35.0);
      setPerimBicepsFlexR(35.5);
      setPerimForearm(27.5);
      setPerimThighSup(56.0);
      setPerimThighMid(52.0);
      setPerimCalf(36.5);

      setBiaFatPct(19.5);
      setBiaMusclePct(43.0);
      setBiaVisceral(5);
      setBiaWaterPct(56.5);
      setBiaBoneKg(3.0);
      setBiaBmr(1680);
      setBiaMetabolicAge(25);
    }
  };

  // Open modal for new assessment
  const handleOpenNewAssessment = (initialMemberId?: string) => {
    const memId = initialMemberId || selectedMemberId || members[0]?.id || '';
    setFormMemberId(memId);
    loadMemberValuesIntoForm(memId);
    setFormDate(new Date().toISOString().split('T')[0]);
    setIsNewModalOpen(true);
  };

  // Save new assessment
  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMember = members.find(m => m.id === formMemberId) || selectedMember;
    if (!targetMember) return;

    const perimeters: AnthropometricPerimeters = {
      neck: Number(perimNeck),
      shoulders: Number(perimShoulders),
      chest: Number(perimChest),
      waist: Number(perimWaist),
      abdomen: Number(perimAbdomen),
      hip: Number(perimHip),
      bicepsRelaxedLeft: Number(perimBicepsRelL),
      bicepsRelaxedRight: Number(perimBicepsRelR),
      bicepsFlexedLeft: Number(perimBicepsFlexL),
      bicepsFlexedRight: Number(perimBicepsFlexR),
      forearm: Number(perimForearm),
      thighSuperior: Number(perimThighSup),
      thighMid: Number(perimThighMid),
      calf: Number(perimCalf)
    };

    const bioimpedance: BioimpedanceData = {
      bodyFatPercentage: Number(biaFatPct),
      bodyFatKg: computedFormMetrics.fatKg,
      muscleMassPercentage: Number(biaMusclePct),
      muscleMassKg: computedFormMetrics.muscleKg,
      leanMassKg: computedFormMetrics.leanMassKg,
      visceralFatLevel: Number(biaVisceral),
      totalBodyWaterPercentage: Number(biaWaterPct),
      totalBodyWaterLiters: computedFormMetrics.waterLiters,
      boneMassKg: Number(biaBoneKg),
      basalMetabolicRateKcal: Number(biaBmr),
      metabolicAge: Number(biaMetabolicAge),
      physicalRatingScore: biaVisceral <= 7 ? 6 : 4
    };

    addBodyAssessment({
      memberId: targetMember.id,
      memberName: targetMember.fullName,
      date: formDate,
      time: formTime,
      evaluatorTrainerName: formEvaluator,
      weightKg: Number(formWeight),
      heightCm: Number(formHeight),
      bmi: computedFormMetrics.bmi,
      bmiClassification: computedFormMetrics.bmiClassification,
      waistHipRatio: computedFormMetrics.waistHipRatio,
      waistHipRisk: computedFormMetrics.waistHipRisk,
      waistHeightRatio: computedFormMetrics.waistHeightRatio,
      perimeters,
      bioimpedance,
      notes: formNotes,
      targetGoalNotes: formGoals
    });

    // Keep active student in sync
    setSelectedMemberId(targetMember.id);

    confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
    setIsNewModalOpen(false);
  };

  // WhatsApp share report
  const handleShareWhatsApp = (assessment: BodyAssessment) => {
    let cleanPhone = selectedMember?.phone ? selectedMember.phone.replace(/[^0-9]/g, '') : '';
    if (cleanPhone.length === 9 && !cleanPhone.startsWith('51')) {
      cleanPhone = '51' + cleanPhone;
    }

    let msg = `📊 *INFORME DE EVALUACIÓN FÍSICA & BIOIMPEDANCIA*\n`;
    msg += `¡Hola ${selectedMember?.fullName.split(' ')[0]}!\n\n`;
    msg += `📅 *Fecha de Evaluación:* ${assessment.date} (${assessment.time || ''})\n`;
    msg += `👨‍🏫 *Evaluador:* ${assessment.evaluatorTrainerName}\n\n`;

    msg += `⚖️ *COMPOSICIÓN CORPORAL (BIOIMPEDANCIA):*\n`;
    msg += `• Peso Corporal: *${assessment.weightKg} kg* (IMC: ${assessment.bmi} - ${assessment.bmiClassification})\n`;
    msg += `• % Grasa Corporal: *${assessment.bioimpedance.bodyFatPercentage}%* (${assessment.bioimpedance.bodyFatKg} kg grasa)\n`;
    msg += `• Masa Muscular Esquelética: *${assessment.bioimpedance.muscleMassKg} kg* (${assessment.bioimpedance.muscleMassPercentage}%)\n`;
    msg += `• Grasa Visceral: *Nivel ${assessment.bioimpedance.visceralFatLevel}* (Saludable ≤ 9)\n`;
    msg += `• Agua Corporal Total: *${assessment.bioimpedance.totalBodyWaterPercentage}%* (${assessment.bioimpedance.totalBodyWaterLiters} L)\n`;
    msg += `• Edad Metabólica: *${assessment.bioimpedance.metabolicAge} años*\n\n`;

    msg += `📏 *MEDIDAS ANTROPOMÉTRICAS CLAVE:*\n`;
    msg += `• Cintura: ${assessment.perimeters.waist} cm | Abdomen: ${assessment.perimeters.abdomen} cm\n`;
    msg += `• Cadera / Glúteos: ${assessment.perimeters.hip} cm (ICC: ${assessment.waistHipRatio})\n`;
    msg += `• Pecho / Tórax: ${assessment.perimeters.chest} cm\n`;
    msg += `• Brazo Flexionado: ${assessment.perimeters.bicepsFlexedRight} cm (Der)\n`;
    msg += `• Muslo: ${assessment.perimeters.thighSuperior} cm\n\n`;

    if (historicalDeltas) {
      msg += `📈 *EVOLUCIÓN EN EL HISTORIAL:*\n`;
      msg += `• Variación de Peso: ${historicalDeltas.weightDelta > 0 ? '+' : ''}${historicalDeltas.weightDelta} kg\n`;
      msg += `• Variación % Grasa: ${historicalDeltas.fatPctDelta > 0 ? '+' : ''}${historicalDeltas.fatPctDelta}%\n`;
      msg += `• Variación Músculo: ${historicalDeltas.muscleKgDelta > 0 ? '+' : ''}${historicalDeltas.muscleKgDelta} kg\n`;
      msg += `• Reducción Cintura: ${historicalDeltas.waistDelta > 0 ? '+' : ''}${historicalDeltas.waistDelta} cm\n\n`;
    }

    msg += `💬 *Comentarios del Coach:*\n${assessment.notes || '¡Gran disciplina y constancia!'}\n\n`;
    msg += `¡Sigue con todo en GymControl! 💪🔥`;

    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.fullName.toLowerCase().includes(searchMemberQuery.toLowerCase()) ||
      m.dni.includes(searchMemberQuery)
    );
  }, [members, searchMemberQuery]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Medidas Antropométricas & Bioimpedancia
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Evaluaciones periódicas, composición corporal, comparativas de evolución e historial médico-deportivo.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleOpenNewAssessment}
          className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nueva Medición</span>
        </button>
      </div>

      {/* Main Grid: Student Selector Left + History & Details Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Student Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
            <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Seleccionar Alumno para ver Historial:</span>
            </label>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por DNI o nombre..."
                value={searchMemberQuery}
                onChange={(e) => setSearchMemberQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredMembers.map(member => {
              const isSelected = member.id === selectedMemberId;
              const evalCount = bodyAssessments.filter(a => a.memberId === member.id).length;

              return (
                <div
                  key={member.id}
                  onClick={() => {
                    setSelectedMemberId(member.id);
                    setSelectedAssessmentId(null);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/60 border-indigo-500 shadow-xs ring-1 ring-indigo-500'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {member.fullName}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        DNI: {member.dni} · {member.planName}
                      </p>
                    </div>

                    <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      evalCount > 0 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {evalCount} tomas
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Historical Analysis, Chart & Detailed Sheet */}
        <div className="lg:col-span-8 space-y-6">
          
          {selectedMember ? (
            <>
              {/* Member Summary Card with Historical Deltas */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      Historial Antropométrico & BIA
                    </span>
                    <h2 className="text-xl font-black text-slate-900 mt-1">
                      {selectedMember.fullName}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {selectedMember.gender === 'F' ? 'Mujer' : 'Varón'} · DNI {selectedMember.dni} · Tel: {selectedMember.phone}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Evaluaciones</span>
                    <span className="text-2xl font-black text-indigo-600">
                      {memberAssessments.length}
                    </span>
                  </div>
                </div>

                {/* Progress Deltas (Comparison of Evolution) */}
                {historicalDeltas ? (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                      <span>Evolución Temporal ({historicalDeltas.firstDate} ➔ {historicalDeltas.latestDate})</span>
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      
                      {/* Peso Delta */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-semibold block">Variación Peso</span>
                        <div className="flex items-center space-x-1 mt-0.5">
                          {historicalDeltas.weightDelta < 0 ? (
                            <ArrowDownRight className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-amber-600" />
                          )}
                          <span className={`text-base font-black ${
                            historicalDeltas.weightDelta < 0 ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            {historicalDeltas.weightDelta > 0 ? `+${historicalDeltas.weightDelta}` : historicalDeltas.weightDelta} kg
                          </span>
                        </div>
                      </div>

                      {/* Grasa % Delta */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-semibold block">% Grasa Corporal</span>
                        <div className="flex items-center space-x-1 mt-0.5">
                          {historicalDeltas.fatPctDelta < 0 ? (
                            <ArrowDownRight className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-rose-600" />
                          )}
                          <span className={`text-base font-black ${
                            historicalDeltas.fatPctDelta < 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}>
                            {historicalDeltas.fatPctDelta > 0 ? `+${historicalDeltas.fatPctDelta}` : historicalDeltas.fatPctDelta}%
                          </span>
                        </div>
                      </div>

                      {/* Músculo Kg Delta */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-semibold block">Masa Muscular</span>
                        <div className="flex items-center space-x-1 mt-0.5">
                          {historicalDeltas.muscleKgDelta > 0 ? (
                            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-slate-400" />
                          )}
                          <span className={`text-base font-black ${
                            historicalDeltas.muscleKgDelta > 0 ? 'text-emerald-700' : 'text-slate-700'
                          }`}>
                            {historicalDeltas.muscleKgDelta > 0 ? `+${historicalDeltas.muscleKgDelta}` : historicalDeltas.muscleKgDelta} kg
                          </span>
                        </div>
                      </div>

                      {/* Cintura Delta */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-semibold block">Cintura</span>
                        <div className="flex items-center space-x-1 mt-0.5">
                          {historicalDeltas.waistDelta < 0 ? (
                            <ArrowDownRight className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-amber-600" />
                          )}
                          <span className={`text-base font-black ${
                            historicalDeltas.waistDelta < 0 ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            {historicalDeltas.waistDelta > 0 ? `+${historicalDeltas.waistDelta}` : historicalDeltas.waistDelta} cm
                          </span>
                        </div>
                      </div>

                      {/* Grasa Visceral Delta */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-semibold block">Grasa Visceral</span>
                        <div className="flex items-center space-x-1 mt-0.5">
                          <span className="text-base font-black text-indigo-700">
                            {historicalDeltas.visceralDelta > 0 ? `+${historicalDeltas.visceralDelta}` : historicalDeltas.visceralDelta} nivel
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                    💡 Registra al menos dos evaluaciones en el tiempo para que el sistema calcule los avances, reducción de grasa y ganancia de masa magra de este alumno.
                  </div>
                )}

                {/* Evolution Chart with Recharts */}
                {chartData.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Gráfica de Evolución: Peso (kg) vs Masa Muscular (kg) vs % Grasa
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                          <Line type="monotone" dataKey="peso" name="Peso (kg)" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="musculoKg" name="Masa Muscular (kg)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="grasaPct" name="% Grasa Corporal" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="cintura" name="Cintura (cm)" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>

              {/* Assessment Timeline Buttons */}
              {memberAssessments.length > 0 && (
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  <span className="text-xs font-bold text-slate-500 shrink-0">Tomas del Alumno:</span>
                  {memberAssessments.map((a, idx) => {
                    const isSelected = (currentDetailAssessment?.id === a.id);
                    return (
                      <button
                        key={a.id}
                        onClick={() => setSelectedAssessmentId(a.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Toma #{idx + 1} ({a.date})
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Detailed Sheet of Selected Assessment */}
              {currentDetailAssessment ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  
                  {/* Sheet Header */}
                  <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2 text-xs text-blue-400 mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Evaluación del {currentDetailAssessment.date} {currentDetailAssessment.time && `a las ${currentDetailAssessment.time}`}</span>
                      </div>
                      <h3 className="text-lg font-black text-white">
                        Ficha Clínica Antropométrica & Bioimpedancia
                      </h3>
                      <p className="text-xs text-slate-400">
                        Evaluador: <strong className="text-white">{currentDetailAssessment.evaluatorTrainerName}</strong>
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleShareWhatsApp(currentDetailAssessment)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Enviar WhatsApp</span>
                      </button>

                      <button
                        onClick={() => window.print()}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                        title="Imprimir Ficha"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('¿Eliminar esta evaluación del historial?')) {
                            deleteBodyAssessment(currentDetailAssessment.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-red-900/40 hover:bg-red-800 text-red-300 text-xs cursor-pointer"
                        title="Eliminar Toma"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Sheet Content */}
                  <div className="p-5 sm:p-6 space-y-6">
                    
                    {/* General Metrics & Bioimpedance Highlights */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Peso & Estatura</span>
                        <div className="text-lg font-black text-slate-900 mt-0.5">
                          {currentDetailAssessment.weightKg} kg
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {currentDetailAssessment.heightCm} cm
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">IMC (OMS)</span>
                        <div className="text-lg font-black text-slate-900 mt-0.5">
                          {currentDetailAssessment.bmi}
                        </div>
                        <span className="text-[11px] font-semibold text-blue-600">
                          {currentDetailAssessment.bmiClassification}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">% Grasa Corporal</span>
                        <div className="text-lg font-black text-amber-600 mt-0.5">
                          {currentDetailAssessment.bioimpedance.bodyFatPercentage}%
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {currentDetailAssessment.bioimpedance.bodyFatKg} kg grasa
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Masa Muscular</span>
                        <div className="text-lg font-black text-emerald-600 mt-0.5">
                          {currentDetailAssessment.bioimpedance.muscleMassKg} kg
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {currentDetailAssessment.bioimpedance.muscleMassPercentage}% masa esquelética
                        </span>
                      </div>
                    </div>

                    {/* Section 1: Detailed Bioimpedance (BIA) Metrics */}
                    <div className="space-y-3">
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                        <Scale className="w-4 h-4 text-indigo-600" />
                        <span>Composición Corporal por Bioimpedancia Eléctrica (BIA)</span>
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                          <span className="text-[11px] text-slate-600">Grasa Visceral</span>
                          <p className="text-base font-black text-slate-900">
                            Nivel {currentDetailAssessment.bioimpedance.visceralFatLevel}
                          </p>
                          <span className="text-[10px] text-emerald-700 font-semibold">
                            {currentDetailAssessment.bioimpedance.visceralFatLevel <= 9 ? 'Rango Saludable (≤ 9)' : 'Nivel de Alerta (≥ 10)'}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                          <span className="text-[11px] text-slate-600">Agua Corporal Total</span>
                          <p className="text-base font-black text-slate-900">
                            {currentDetailAssessment.bioimpedance.totalBodyWaterPercentage}%
                          </p>
                          <span className="text-[10px] text-slate-500">
                            {currentDetailAssessment.bioimpedance.totalBodyWaterLiters} Litros hidratación
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                          <span className="text-[11px] text-slate-600">Masa Libre de Grasa (Magra)</span>
                          <p className="text-base font-black text-slate-900">
                            {currentDetailAssessment.bioimpedance.leanMassKg} kg
                          </p>
                          <span className="text-[10px] text-slate-500">
                            Masa ósea: {currentDetailAssessment.bioimpedance.boneMassKg} kg
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                          <span className="text-[11px] text-slate-600">Tasa Metabólica Basal (BMR)</span>
                          <p className="text-base font-black text-slate-900">
                            {currentDetailAssessment.bioimpedance.basalMetabolicRateKcal} kcal
                          </p>
                          <span className="text-[10px] text-slate-500">Gasto en reposo</span>
                        </div>

                        <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                          <span className="text-[11px] text-slate-600">Edad Metabólica</span>
                          <p className="text-base font-black text-slate-900">
                            {currentDetailAssessment.bioimpedance.metabolicAge} años
                          </p>
                          <span className="text-[10px] text-emerald-700 font-semibold">
                            Condición celular óptima
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                          <span className="text-[11px] text-slate-600">Índice Cintura - Cadera (ICC)</span>
                          <p className="text-base font-black text-slate-900">
                            {currentDetailAssessment.waistHipRatio}
                          </p>
                          <span className={`text-[10px] font-bold ${
                            currentDetailAssessment.waistHipRisk === 'Bajo' ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            Riesgo CV: {currentDetailAssessment.waistHipRisk}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Detailed Anthropometric Perimeters */}
                    <div className="space-y-3">
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                        <Ruler className="w-4 h-4 text-blue-600" />
                        <span>Perímetros Antropométricos (cm)</span>
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[11px]">Cuello:</span>
                          <strong className="text-slate-900 font-black">{currentDetailAssessment.perimeters.neck} cm</strong>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[11px]">Hombros:</span>
                          <strong className="text-slate-900 font-black">{currentDetailAssessment.perimeters.shoulders} cm</strong>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[11px]">Pecho / Tórax:</span>
                          <strong className="text-slate-900 font-black">{currentDetailAssessment.perimeters.chest} cm</strong>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[11px]">Cintura (mínima):</span>
                          <strong className="text-slate-900 font-black text-blue-600">{currentDetailAssessment.perimeters.waist} cm</strong>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[11px]">Abdomen (umbilical):</span>
                          <strong className="text-slate-900 font-black">{currentDetailAssessment.perimeters.abdomen} cm</strong>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[11px]">Cadera / Glúteos:</span>
                          <strong className="text-slate-900 font-black text-blue-600">{currentDetailAssessment.perimeters.hip} cm</strong>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[11px]">Bíceps Relajado (I / D):</span>
                          <strong className="text-slate-900 font-bold">{currentDetailAssessment.perimeters.bicepsRelaxedLeft} / {currentDetailAssessment.perimeters.bicepsRelaxedRight} cm</strong>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[11px]">Bíceps Flexionado (I / D):</span>
                          <strong className="text-slate-900 font-bold">{currentDetailAssessment.perimeters.bicepsFlexedLeft} / {currentDetailAssessment.perimeters.bicepsFlexedRight} cm</strong>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[11px]">Antebrazo:</span>
                          <strong className="text-slate-900 font-bold">{currentDetailAssessment.perimeters.forearm} cm</strong>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[11px]">Muslo Superior:</span>
                          <strong className="text-slate-900 font-bold">{currentDetailAssessment.perimeters.thighSuperior} cm</strong>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[11px]">Muslo Medio:</span>
                          <strong className="text-slate-900 font-bold">{currentDetailAssessment.perimeters.thighMid} cm</strong>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[11px]">Pantorrilla:</span>
                          <strong className="text-slate-900 font-bold">{currentDetailAssessment.perimeters.calf} cm</strong>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Notes & Goals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-600 block mb-1">Observaciones del Evaluador</span>
                        <p className="text-xs text-slate-800 leading-relaxed">
                          {currentDetailAssessment.notes || 'Sin anotaciones adicionales registradas.'}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-600 block mb-1">Objetivos Próxima Medición</span>
                        <p className="text-xs text-slate-800 leading-relaxed">
                          {currentDetailAssessment.targetGoalNotes || 'Mantener constancia y registrar avances en 4 semanas.'}
                        </p>
                      </div>
                    </div>

                  </div>

                </div>
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                  No hay evaluaciones registradas para este alumno. Presiona "Registrar Nueva Medición" para iniciar su historial.
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
              Selecciona un alumno para revisar su historial antropométrico y de bioimpedancia.
            </div>
          )}

        </div>

      </div>

      {/* MODAL: REGISTER NEW ASSESSMENT */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Nueva Evaluación Antropométrica & Bioimpedancia
                  </h3>
                  <p className="text-xs text-slate-500">
                    Registro de medidas corporales, composición BIA y evolución física
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAssessment} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              
              {/* INTERACTIVE STUDENT SELECTOR IN MODAL */}
              <div className="bg-linear-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200 p-4 rounded-2xl shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-700" />
                    <label className="text-xs font-black text-blue-900 uppercase tracking-wider">
                      Seleccionar Alumno a Evaluar *
                    </label>
                  </div>

                  {/* Search Alumno */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filtrar por nombre o DNI..."
                      value={modalMemberSearch}
                      onChange={(e) => setModalMemberSearch(e.target.value)}
                      className="w-full bg-white border border-blue-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Dropdown Selector */}
                <select
                  value={formMemberId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setFormMemberId(id);
                    loadMemberValuesIntoForm(id);
                  }}
                  className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  {members
                    .filter(m => !modalMemberSearch || 
                      m.fullName.toLowerCase().includes(modalMemberSearch.toLowerCase()) || 
                      m.dni.includes(modalMemberSearch)
                    )
                    .map(m => {
                      const prevCount = bodyAssessments.filter(a => a.memberId === m.id).length;
                      return (
                        <option key={m.id} value={m.id}>
                          {m.fullName} — DNI: {m.dni} · {m.planName} ({prevCount} tomas previas)
                        </option>
                      );
                    })}
                </select>

                {/* Selected Alumno Preview Card */}
                {formMember && (
                  <div className="bg-white/90 rounded-xl p-3 border border-blue-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-xs overflow-hidden">
                        {formMember.photoUrl ? (
                          <img src={formMember.photoUrl} alt={formMember.fullName} className="w-full h-full object-cover" />
                        ) : (
                          formMember.fullName.charAt(0)
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          {formMember.fullName}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          DNI: <strong className="text-slate-700">{formMember.dni}</strong> · Tel: {formMember.phone} · Plan: <span className="text-blue-700 font-semibold">{formMember.planName}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold">
                        Objetivo: {formMember.objective.replace('_', ' ').toUpperCase()}
                      </span>
                      {formMemberPreviousAssessment ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                          ✓ Última toma: {formMemberPreviousAssessment.date}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold">
                          ★ Primera evaluación
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Live Real-Time Comparison Evolution Box */}
                {formMemberPreviousAssessment && (
                  <div className="bg-white p-3 rounded-xl border border-indigo-100 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-extrabold text-indigo-950 flex items-center gap-1 shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Comparativa en vivo vs toma anterior ({formMemberPreviousAssessment.date}):</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded font-black text-[11px] ${
                      (formWeight - formMemberPreviousAssessment.weightKg) < 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      Peso: {(formWeight - formMemberPreviousAssessment.weightKg) > 0 ? '+' : ''}{(formWeight - formMemberPreviousAssessment.weightKg).toFixed(1)} kg
                    </span>
                    <span className={`px-2 py-0.5 rounded font-black text-[11px] ${
                      (biaFatPct - formMemberPreviousAssessment.bioimpedance.bodyFatPercentage) < 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      Grasa: {(biaFatPct - formMemberPreviousAssessment.bioimpedance.bodyFatPercentage) > 0 ? '+' : ''}{(biaFatPct - formMemberPreviousAssessment.bioimpedance.bodyFatPercentage).toFixed(1)}%
                    </span>
                    <span className={`px-2 py-0.5 rounded font-black text-[11px] ${
                      (biaMusclePct - formMemberPreviousAssessment.bioimpedance.muscleMassPercentage) > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      Músculo: {(biaMusclePct - formMemberPreviousAssessment.bioimpedance.muscleMassPercentage) > 0 ? '+' : ''}{(biaMusclePct - formMemberPreviousAssessment.bioimpedance.muscleMassPercentage).toFixed(1)}%
                    </span>
                    <span className={`px-2 py-0.5 rounded font-black text-[11px] ${
                      (perimWaist - formMemberPreviousAssessment.perimeters.waist) < 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      Cintura: {(perimWaist - formMemberPreviousAssessment.perimeters.waist) > 0 ? '+' : ''}{(perimWaist - formMemberPreviousAssessment.perimeters.waist).toFixed(1)} cm
                    </span>
                  </div>
                )}
              </div>
              
              {/* Evaluator, Date, Basic measures */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hora</label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Entrenador Evaluador</label>
                  <select
                    value={formEvaluator}
                    onChange={(e) => setFormEvaluator(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                  >
                    {trainers.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formWeight}
                    onChange={(e) => setFormWeight(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Real-time Calculated Preview */}
              <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-blue-900">Estatura:</span>
                  <input
                    type="number"
                    value={formHeight}
                    onChange={(e) => setFormHeight(Number(e.target.value))}
                    className="w-20 bg-white border border-blue-300 rounded-md px-2 py-1 text-xs font-bold"
                  />
                  <span className="text-slate-500">cm</span>
                </div>

                <div>
                  <span className="text-blue-900 font-bold">IMC Calculado:</span>{' '}
                  <strong className="text-blue-700 font-black">{computedFormMetrics.bmi}</strong>{' '}
                  <span className="px-2 py-0.5 rounded-full bg-blue-200/80 text-blue-800 text-[10px] font-bold">
                    {computedFormMetrics.bmiClassification}
                  </span>
                </div>

                <div>
                  <span className="text-blue-900 font-bold">Índice Cintura/Cadera:</span>{' '}
                  <strong className="text-blue-700 font-black">{computedFormMetrics.waistHipRatio}</strong>{' '}
                  <span className="text-slate-500 text-[11px]">(Riesgo {computedFormMetrics.waistHipRisk})</span>
                </div>
              </div>

              {/* Bioimpedance Inputs */}
              <div className="space-y-3">
                <h4 className="font-black text-xs uppercase tracking-wider text-indigo-700 flex items-center space-x-1.5">
                  <Scale className="w-4 h-4" />
                  <span>Datos de Báscula de Bioimpedancia (BIA)</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">% Grasa Corporal</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={biaFatPct}
                      onChange={(e) => setBiaFatPct(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold"
                    />
                    <span className="text-[10px] text-slate-400">= {computedFormMetrics.fatKg} kg de grasa</span>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">% Masa Muscular</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={biaMusclePct}
                      onChange={(e) => setBiaMusclePct(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold"
                    />
                    <span className="text-[10px] text-slate-400">= {computedFormMetrics.muscleKg} kg músculo</span>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Grasa Visceral (1 - 30)</label>
                    <input
                      type="number"
                      required
                      value={biaVisceral}
                      onChange={(e) => setBiaVisceral(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold"
                    />
                    <span className="text-[10px] text-slate-400">Saludable ≤ 9</span>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">% Agua Corporal</label>
                    <input
                      type="number"
                      step="0.1"
                      value={biaWaterPct}
                      onChange={(e) => setBiaWaterPct(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold"
                    />
                    <span className="text-[10px] text-slate-400">= {computedFormMetrics.waterLiters} Litros</span>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Masa Ósea (kg)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={biaBoneKg}
                      onChange={(e) => setBiaBoneKg(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Tasa Metabólica (kcal)</label>
                    <input
                      type="number"
                      value={biaBmr}
                      onChange={(e) => setBiaBmr(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Edad Metabólica</label>
                    <input
                      type="number"
                      value={biaMetabolicAge}
                      onChange={(e) => setBiaMetabolicAge(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold"
                    />
                  </div>

                  {/* Visceral Fat Visual Gauge */}
                  <div className="col-span-2 sm:col-span-4 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">Medidor Visual de Grasa Visceral:</span>
                      <span className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                        biaVisceral <= 9 ? 'bg-emerald-100 text-emerald-800' : biaVisceral <= 14 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        Nivel {biaVisceral} — {biaVisceral <= 9 ? 'Saludable (Bajo riesgo)' : biaVisceral <= 14 ? 'Alerta (Grasa visceral moderada)' : 'Peligro (Alto riesgo cardiovascular)'}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-500 w-[30%]" title="Saludable: 1 a 9"></div>
                      <div className="h-full bg-amber-400 w-[20%]" title="Alerta: 10 a 14"></div>
                      <div className="h-full bg-rose-500 w-[50%]" title="Alto riesgo: 15 a 30"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
                      <span>1 (Mínimo)</span>
                      <span>9 (Límite sano)</span>
                      <span>14 (Alerta)</span>
                      <span>30 (Crítico)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perimeters Inputs & Interactive Body Map */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <h4 className="font-black text-xs uppercase tracking-wider text-blue-700 flex items-center space-x-1.5">
                    <Ruler className="w-4 h-4" />
                    <span>Perímetros Antropométricos (cm) — Guía Corporal Interactiva</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    Haz clic en una zona para enfocar el valor:
                  </span>
                </div>

                {/* Interactive Zone Buttons Bar */}
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {[
                    { id: 'cuello', name: 'Cuello', val: `${perimNeck}cm` },
                    { id: 'hombros', name: 'Hombros', val: `${perimShoulders}cm` },
                    { id: 'pecho', name: 'Pecho', val: `${perimChest}cm` },
                    { id: 'cintura', name: 'Cintura', val: `${perimWaist}cm` },
                    { id: 'abdomen', name: 'Abdomen', val: `${perimAbdomen}cm` },
                    { id: 'cadera', name: 'Cadera', val: `${perimHip}cm` },
                    { id: 'biceps', name: 'Bíceps', val: `${perimBicepsFlexR}cm` },
                    { id: 'muslo', name: 'Muslo', val: `${perimThighSup}cm` },
                    { id: 'pantorrilla', name: 'Pantorrilla', val: `${perimCalf}cm` }
                  ].map(zone => (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setActiveFocusZone(activeFocusZone === zone.id ? null : zone.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                        activeFocusZone === zone.id
                          ? 'bg-blue-600 text-white shadow-xs scale-105'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <span>{zone.name}</span>
                      <span className={activeFocusZone === zone.id ? 'text-blue-100 font-black' : 'text-blue-600 font-extrabold'}>
                        {zone.val}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Cuello</label>
                    <input
                      type="number"
                      step="0.1"
                      value={perimNeck}
                      onChange={(e) => setPerimNeck(Number(e.target.value))}
                      className={`w-full border rounded-lg px-2.5 py-1.5 font-bold transition-all ${
                        activeFocusZone === 'cuello' ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Hombros</label>
                    <input
                      type="number"
                      step="0.1"
                      value={perimShoulders}
                      onChange={(e) => setPerimShoulders(Number(e.target.value))}
                      className={`w-full border rounded-lg px-2.5 py-1.5 font-bold transition-all ${
                        activeFocusZone === 'hombros' ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Pecho / Tórax</label>
                    <input
                      type="number"
                      step="0.1"
                      value={perimChest}
                      onChange={(e) => setPerimChest(Number(e.target.value))}
                      className={`w-full border rounded-lg px-2.5 py-1.5 font-bold transition-all ${
                        activeFocusZone === 'pecho' ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-blue-700 font-bold mb-1">Cintura mínima *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={perimWaist}
                      onChange={(e) => setPerimWaist(Number(e.target.value))}
                      className={`w-full border rounded-lg px-2.5 py-1.5 font-black text-blue-900 transition-all ${
                        activeFocusZone === 'cintura' ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-100' : 'border-blue-300 bg-blue-50/50'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Abdomen (ombligo)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={perimAbdomen}
                      onChange={(e) => setPerimAbdomen(Number(e.target.value))}
                      className={`w-full border rounded-lg px-2.5 py-1.5 font-bold transition-all ${
                        activeFocusZone === 'abdomen' ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-blue-700 font-bold mb-1">Cadera / Glúteos *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={perimHip}
                      onChange={(e) => setPerimHip(Number(e.target.value))}
                      className={`w-full border rounded-lg px-2.5 py-1.5 font-black text-blue-900 transition-all ${
                        activeFocusZone === 'cadera' ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-100' : 'border-blue-300 bg-blue-50/50'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Bíceps Relajado Der.</label>
                    <input
                      type="number"
                      step="0.1"
                      value={perimBicepsRelR}
                      onChange={(e) => setPerimBicepsRelR(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Bíceps Flexionado Der.</label>
                    <input
                      type="number"
                      step="0.1"
                      value={perimBicepsFlexR}
                      onChange={(e) => setPerimBicepsFlexR(Number(e.target.value))}
                      className={`w-full border rounded-lg px-2.5 py-1.5 font-bold transition-all ${
                        activeFocusZone === 'biceps' ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Muslo Superior</label>
                    <input
                      type="number"
                      step="0.1"
                      value={perimThighSup}
                      onChange={(e) => setPerimThighSup(Number(e.target.value))}
                      className={`w-full border rounded-lg px-2.5 py-1.5 font-bold transition-all ${
                        activeFocusZone === 'muslo' ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Pantorrilla</label>
                    <input
                      type="number"
                      step="0.1"
                      value={perimCalf}
                      onChange={(e) => setPerimCalf(Number(e.target.value))}
                      className={`w-full border rounded-lg px-2.5 py-1.5 font-bold transition-all ${
                        activeFocusZone === 'pantorrilla' ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Observaciones</label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Metas para la Próxima Toma</label>
                  <textarea
                    rows={2}
                    value={formGoals}
                    onChange={(e) => setFormGoals(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                  Guardar Evaluación en Historial
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
