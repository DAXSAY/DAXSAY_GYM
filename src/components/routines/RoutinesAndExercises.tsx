import React, { useState } from 'react';
import { 
  Dumbbell, 
  Plus, 
  Search, 
  Filter, 
  Layers, 
  Sparkles, 
  Trash2, 
  Edit3, 
  Check, 
  ChevronRight, 
  Printer, 
  UserCheck, 
  HelpCircle, 
  Flame, 
  Award,
  Zap,
  Info,
  Clock,
  RotateCcw,
  Video,
  PlayCircle,
  ExternalLink,
  Eye,
  Timer,
  Play
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { 
  Exercise, 
  Routine, 
  MuscleGroup, 
  FitnessObjective, 
  RoutineDay, 
  RoutineExercise 
} from '../../types/gym';
import confetti from 'canvas-confetti';

export const RoutinesAndExercises: React.FC = () => {
  const { 
    exercises, 
    routines, 
    trainers, 
    members, 
    addExercise, 
    updateExercise, 
    deleteExercise,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    assignRoutineToMember
  } = useGym();

  const [activeSubTab, setActiveSubTab] = useState<'exercises' | 'routines' | 'builder'>('routines');

  // Exercise Filters
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all');
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [selectedExerciseModal, setSelectedExerciseModal] = useState<Exercise | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<{ url: string; title: string } | null>(null);

  // New Exercise Modal
  const [isNewExerciseOpen, setIsNewExerciseOpen] = useState(false);
  const [exName, setExName] = useState('');
  const [exMuscle, setExMuscle] = useState<MuscleGroup>('pecho');
  const [exEquipment, setExEquipment] = useState<any>('mancuernas');
  const [exDifficulty, setExDifficulty] = useState<any>('intermedio');
  const [exInstructions, setExInstructions] = useState('');
  const [exTips, setExTips] = useState('');
  const [exDefaultReps, setExDefaultReps] = useState('4 series x 10-12 reps');
  const [exVideoUrl, setExVideoUrl] = useState('');
  const [exThumbnailUrl, setExThumbnailUrl] = useState('');

  // Active Routine Viewer / Printable Modal
  const [viewingRoutine, setViewingRoutine] = useState<Routine | null>(null);

  // Routine Assign Modal
  const [assigningRoutine, setAssigningRoutine] = useState<Routine | null>(null);
  const [studentToAssignId, setStudentToAssignId] = useState('');

  // Routine Builder State
  const [routineTitle, setRoutineTitle] = useState('');
  const [routineDesc, setRoutineDesc] = useState('');
  const [routineLevel, setRoutineLevel] = useState<'principiante' | 'intermedio' | 'avanzado'>('intermedio');
  const [routineObjective, setRoutineObjective] = useState<FitnessObjective>('hipertrofia');
  const [routineTrainerId, setRoutineTrainerId] = useState(trainers[0]?.id || '');
  const [routineTargetMemberId, setRoutineTargetMemberId] = useState('');

  const [routineDays, setRoutineDays] = useState<RoutineDay[]>([
    {
      dayName: 'Día 1: Empuje (Pecho & Tríceps)',
      focus: 'Fuerza e hipertrofia pectoral',
      notes: 'Calentamiento de manguito rotador previo.',
      exercises: [
        { exerciseId: 'ex-1', exerciseName: 'Press de Banca Plano con Barra', muscleGroup: 'pecho', sets: 4, reps: '8-10', rir: 'RIR 2', restSeconds: 90, notes: 'Subir peso progresivo', videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg' },
        { exerciseId: 'ex-2', exerciseName: 'Press Inclinado con Mancuernas', muscleGroup: 'pecho', sets: 3, reps: '12', rir: 'RIR 1', restSeconds: 60, videoUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8' }
      ]
    },
    {
      dayName: 'Día 2: Tirón (Espalda & Bíceps)',
      focus: 'Dorsales y brazos',
      notes: 'Cuidar postura lumbar.',
      exercises: [
        { exerciseId: 'ex-6', exerciseName: 'Jalón al Pecho en Polea Alta', muscleGroup: 'espalda', sets: 4, reps: '10-12', rir: 'RIR 2', restSeconds: 75, videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc' },
        { exerciseId: 'ex-19', exerciseName: 'Curl de Bíceps con Barra Z', muscleGroup: 'biceps', sets: 3, reps: '12', rir: 'RIR 1', restSeconds: 60, videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo' }
      ]
    }
  ]);

  // Helper to extract clean youtube embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  // Exercise list filtering
  const filteredExercises = exercises.filter(ex => {
    const matchesMuscle = selectedMuscle === 'all' || ex.muscleGroup === selectedMuscle;
    const matchesSearch = 
      ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      ex.instructions.toLowerCase().includes(exerciseSearch.toLowerCase());
    return matchesMuscle && matchesSearch;
  });

  const muscleLabels: Record<MuscleGroup, string> = {
    pecho: 'Pecho / Pectorales',
    espalda: 'Espalda / Dorsales',
    cuadriceps: 'Cuádriceps',
    isquiotibiales_gluteos: 'Isquios & Glúteos',
    hombros: 'Hombros / Deltoides',
    biceps: 'Bíceps',
    triceps: 'Tríceps',
    core_abdomen: 'Core & Abdominales',
    cardio_funcional: 'Cardio & Funcional'
  };

  const handleCreateExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exName.trim() || !exInstructions.trim()) return;

    addExercise({
      name: exName.trim(),
      muscleGroup: exMuscle,
      equipment: exEquipment,
      difficulty: exDifficulty,
      instructions: exInstructions.trim(),
      tips: exTips.trim() || 'Mantener control del tempo excéntrico y rango de movimiento completo.',
      targetSetsRepsDefault: exDefaultReps,
      videoUrl: exVideoUrl.trim() || undefined,
      thumbnailUrl: exThumbnailUrl.trim() || undefined
    });

    setExName('');
    setExInstructions('');
    setExTips('');
    setExVideoUrl('');
    setExThumbnailUrl('');
    setIsNewExerciseOpen(false);

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Add new day to routine builder
  const handleAddDay = () => {
    const nextDayNum = routineDays.length + 1;
    setRoutineDays(prev => [
      ...prev,
      {
        dayName: `Día ${nextDayNum}: Entrenamiento Específico`,
        focus: 'Enfoque muscular principal',
        exercises: []
      }
    ]);
  };

  // Remove day from routine builder
  const handleRemoveDay = (dayIndex: number) => {
    setRoutineDays(prev => prev.filter((_, i) => i !== dayIndex));
  };

  // Add exercise to day in builder
  const handleAddExerciseToDay = (dayIndex: number, exerciseId: string) => {
    const exObj = exercises.find(e => e.id === exerciseId);
    if (!exObj) return;

    setRoutineDays(prev => {
      const updated = [...prev];
      updated[dayIndex].exercises.push({
        exerciseId: exObj.id,
        exerciseName: exObj.name,
        muscleGroup: exObj.muscleGroup,
        sets: 4,
        reps: '10-12',
        rir: 'RIR 1-2',
        restSeconds: 60,
        notes: 'Ejecución técnica estricta',
        videoUrl: exObj.videoUrl
      });
      return updated;
    });
  };

  // Remove exercise from day in builder
  const handleRemoveExerciseFromDay = (dayIndex: number, exIndex: number) => {
    setRoutineDays(prev => {
      const updated = [...prev];
      updated[dayIndex].exercises.splice(exIndex, 1);
      return updated;
    });
  };

  // Save routine from builder
  const handleSaveRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineTitle.trim()) {
      alert('Por favor asigna un título a la rutina.');
      return;
    }

    const trainerObj = trainers.find(t => t.id === routineTrainerId);
    const memberObj = members.find(m => m.id === routineTargetMemberId);

    addRoutine({
      title: routineTitle.trim(),
      description: routineDesc.trim() || 'Rutina personalizada diseñada en GymControl.',
      level: routineLevel,
      objective: routineObjective,
      trainerId: routineTrainerId || undefined,
      trainerName: trainerObj?.name,
      targetStudentId: routineTargetMemberId || undefined,
      targetStudentName: memberObj?.fullName,
      days: routineDays
    });

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });

    setActiveSubTab('routines');
  };

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningRoutine || !studentToAssignId) return;

    assignRoutineToMember(studentToAssignId, assigningRoutine.id);
    setAssigningRoutine(null);
    setStudentToAssignId('');

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-4">
      
      {/* Sub Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-blue-600" />
            <span>Módulo de Rutinas & Base de Datos de Ejercicios</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Base técnica de ejercicios con videos demostrativos, creador interactivo de rutinas y asignación directa a alumnos.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveSubTab('routines')}
            className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all ${
              activeSubTab === 'routines' ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-600 hover:text-slate-900'
            }`}
          >
            Rutinas ({routines.length})
          </button>

          <button
            onClick={() => setActiveSubTab('exercises')}
            className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeSubTab === 'exercises' ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-600 hover:text-slate-900'
            }`}
          >
            <span>Ejercicios & Videos</span>
            <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 text-[10px] rounded-full font-bold">
              {exercises.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('builder')}
            className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all flex items-center gap-1 ${
              activeSubTab === 'builder' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Crear Rutina</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: ROUTINES LIST */}
      {activeSubTab === 'routines' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {routines.map(routine => {
              const assignedStudent = members.find(m => m.id === routine.targetStudentId);
              const assignedTrainer = trainers.find(t => t.id === routine.trainerId);
              const totalExercises = routine.days.reduce((sum, d) => sum + d.exercises.length, 0);

              return (
                <div 
                  key={routine.id}
                  className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-4 flex flex-col justify-between transition-all shadow-xs group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                        {routine.level} • {routine.objective}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {routine.days.length} Días / sem
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-2 mb-1 group-hover:text-blue-600 transition-colors">
                      {routine.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                      {routine.description}
                    </p>

                    {/* Breakdown */}
                    <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-xs">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-gray-500">Total ejercicios:</span>
                        <span className="font-semibold">{totalExercises} ejercicios</span>
                      </div>
                      
                      {routine.trainerName && (
                        <div className="flex items-center justify-between text-slate-700">
                          <span className="text-gray-500">Coach:</span>
                          <span className="font-semibold text-blue-700">{routine.trainerName}</span>
                        </div>
                      )}

                      {assignedStudent ? (
                        <div className="flex items-center justify-between text-slate-700 pt-1 border-t border-gray-200">
                          <span className="text-gray-500">Asignada a:</span>
                          <span className="font-bold text-emerald-700">{assignedStudent.fullName}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-slate-700 pt-1 border-t border-gray-200">
                          <span className="text-gray-500">Tipo:</span>
                          <span className="text-gray-500 font-medium">Plantilla general</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-1">
                    <button
                      onClick={() => setViewingRoutine(routine)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-slate-800 text-xs font-semibold rounded-md flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Ver / Imprimir</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setAssigningRoutine(routine)}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md flex items-center gap-1 cursor-pointer shadow-2xs"
                        title="Asignar a un alumno"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Asignar</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar la rutina "${routine.title}"?`)) {
                            deleteRoutine(routine.id);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-rose-600 rounded cursor-pointer"
                        title="Eliminar rutina"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: EXERCISES DATABASE */}
      {activeSubTab === 'exercises' && (
        <div className="space-y-3">
          
          {/* Filter and Search bar */}
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar ejercicio, músculo o técnica..."
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            {/* Muscle Group Pill Selector */}
            <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <button
                onClick={() => setSelectedMuscle('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold shrink-0 cursor-pointer ${
                  selectedMuscle === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:text-slate-900'
                }`}
              >
                Todos ({exercises.length})
              </button>
              {Object.entries(muscleLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedMuscle(key)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold shrink-0 cursor-pointer ${
                    selectedMuscle === key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:text-slate-900'
                  }`}
                >
                  {label.split(' ')[0]}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsNewExerciseOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Ejercicio</span>
            </button>

          </div>

          {/* Exercise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredExercises.map(ex => (
              <div 
                key={ex.id}
                className="bg-white border border-gray-200 hover:border-gray-300 p-4 rounded-xl flex flex-col justify-between transition-all shadow-xs group"
              >
                <div>
                  {/* Thumbnail / Header */}
                  {ex.thumbnailUrl && (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-2.5 bg-gray-100 border border-gray-200">
                      <img 
                        src={ex.thumbnailUrl} 
                        alt={ex.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {ex.videoUrl && (
                        <button
                          onClick={() => setPreviewVideoUrl({ url: ex.videoUrl!, title: ex.name })}
                          className="absolute inset-0 bg-black/30 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer group/btn"
                        >
                          <div className="w-10 h-10 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover/btn:scale-110 transition-transform">
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          </div>
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                      {muscleLabels[ex.muscleGroup]}
                    </span>
                    <span className="text-[10px] text-gray-500 capitalize">
                      {ex.equipment.replace('_', ' ')} • {ex.difficulty}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2 mb-1">
                    {ex.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-2 leading-relaxed">
                    {ex.instructions}
                  </p>

                  {ex.tips && (
                    <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-800 flex items-start gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{ex.tips}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-mono text-[11px]">{ex.targetSetsRepsDefault}</span>
                  
                  <div className="flex items-center gap-2">
                    {ex.videoUrl && (
                      <button
                        onClick={() => setPreviewVideoUrl({ url: ex.videoUrl!, title: ex.name })}
                        className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer flex items-center gap-1"
                        title="Ver Video Demostración"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Video</span>
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedExerciseModal(ex)}
                      className="text-gray-600 hover:text-slate-900 font-semibold cursor-pointer"
                    >
                      Detalles →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* SUBTAB 3: ROUTINE BUILDER WIZARD */}
      {activeSubTab === 'builder' && (
        <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-xs space-y-5 text-slate-800">
          
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <div className="flex items-center gap-2 text-blue-600 text-[11px] font-bold uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Creador Interactivo de Rutinas para Entrenadores</span>
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Diseñar Programa Personalizado (Series, Reps, Descansos y Videos)
              </h2>
            </div>

            <button
              onClick={() => setActiveSubTab('routines')}
              className="text-xs text-gray-500 hover:text-slate-800 cursor-pointer"
            >
              Cancelar y Volver
            </button>
          </div>

          <form onSubmit={handleSaveRoutine} className="space-y-5">
            
            {/* General Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Título de la Rutina *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Rutina Hipertrofia Push-Pull-Legs 4 Días"
                  value={routineTitle}
                  onChange={(e) => setRoutineTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Objetivo del Alumno</label>
                <select
                  value={routineObjective}
                  onChange={(e) => setRoutineObjective(e.target.value as FitnessObjective)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="hipertrofia">Ganancia Muscular / Hipertrofia</option>
                  <option value="perdida_peso">Pérdida de Grasa / Definición</option>
                  <option value="fuerza">Fuerza Máxima</option>
                  <option value="tonificacion">Tonificación General</option>
                  <option value="resistencia">Resistencia & Acondicionamiento</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nivel</label>
                <select
                  value={routineLevel}
                  onChange={(e) => setRoutineLevel(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Descripción / Indicaciones Generales</label>
                <input
                  type="text"
                  placeholder="Ej. 4 días de entrenamiento a la semana. Descansar miércoles y domingos."
                  value={routineDesc}
                  onChange={(e) => setRoutineDesc(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Entrenador Responsable</label>
                <select
                  value={routineTrainerId}
                  onChange={(e) => setRoutineTrainerId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="">Seleccionar Entrenador...</option>
                  {trainers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.specialty})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Asignar a Alumno Directo (Opcional)</label>
                <select
                  value={routineTargetMemberId}
                  onChange={(e) => setRoutineTargetMemberId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="">Dejar como plantilla general</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.fullName} ({m.planName}) - {m.objective}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Days Section */}
            <div className="space-y-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>Días de Entrenamiento y Ejercicios Seleccionados</span>
                </h3>

                <button
                  type="button"
                  onClick={handleAddDay}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-blue-700 font-semibold rounded-md text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Día</span>
                </button>
              </div>

              <div className="space-y-3">
                {routineDays.map((day, dIdx) => (
                  <div key={dIdx} className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2">
                      <div className="flex items-center gap-2.5 flex-1">
                        <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          {dIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={day.dayName}
                          onChange={(e) => {
                            const updated = [...routineDays];
                            updated[dIdx].dayName = e.target.value;
                            setRoutineDays(updated);
                          }}
                          className="bg-transparent font-bold text-slate-900 text-xs sm:text-sm focus:outline-none border-b border-dashed border-gray-300 focus:border-blue-600 w-full sm:w-80"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Add Exercise to this Day dropdown */}
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddExerciseToDay(dIdx, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="px-2 py-1 bg-white border border-gray-300 rounded-md text-xs text-blue-700 font-semibold focus:outline-none"
                        >
                          <option value="">+ Seleccionar Ejercicio de Base de Datos...</option>
                          {exercises.map(ex => (
                            <option key={ex.id} value={ex.id}>{ex.name} ({ex.muscleGroup})</option>
                          ))}
                        </select>

                        {routineDays.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDay(dIdx)}
                            className="text-gray-400 hover:text-rose-600 text-xs px-1.5 py-0.5 cursor-pointer"
                            title="Eliminar este día"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Exercises in this Day */}
                    <div className="space-y-2">
                      {day.exercises.length === 0 ? (
                        <p className="text-xs text-gray-400 italic py-1.5">
                          No hay ejercicios en este día. Selecciona un ejercicio del menú para añadir series, repeticiones y descanso.
                        </p>
                      ) : (
                        day.exercises.map((ex, exIdx) => (
                          <div 
                            key={exIdx}
                            className="p-2.5 bg-white border border-gray-200 rounded-lg flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 text-xs shadow-2xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-gray-400 font-mono font-bold text-[11px]">{exIdx + 1}.</span>
                              <span className="font-bold text-slate-800 truncate">{ex.exerciseName}</span>
                              <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded uppercase border border-blue-100 shrink-0">
                                {ex.muscleGroup}
                              </span>
                              {ex.videoUrl && (
                                <button
                                  type="button"
                                  onClick={() => setPreviewVideoUrl({ url: ex.videoUrl!, title: ex.exerciseName })}
                                  className="text-blue-600 hover:text-blue-800 p-0.5 cursor-pointer shrink-0"
                                  title="Ver Video Demo"
                                >
                                  <PlayCircle className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            {/* Series, Reps, Rest, RIR Controls */}
                            <div className="flex items-center gap-2 flex-wrap text-[11px]">
                              <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                                <span className="text-gray-500 text-[10px]">Series:</span>
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={ex.sets}
                                  onChange={(e) => {
                                    const updated = [...routineDays];
                                    updated[dIdx].exercises[exIdx].sets = Number(e.target.value);
                                    setRoutineDays(updated);
                                  }}
                                  className="w-10 px-1 py-0.5 bg-white border border-gray-200 rounded text-center text-slate-900 font-mono font-bold text-xs"
                                />
                              </div>

                              <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                                <span className="text-gray-500 text-[10px]">Reps:</span>
                                <input
                                  type="text"
                                  value={ex.reps}
                                  placeholder="10-12"
                                  onChange={(e) => {
                                    const updated = [...routineDays];
                                    updated[dIdx].exercises[exIdx].reps = e.target.value;
                                    setRoutineDays(updated);
                                  }}
                                  className="w-14 px-1 py-0.5 bg-white border border-gray-200 rounded text-center text-slate-900 font-mono font-bold text-xs"
                                />
                              </div>

                              <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                                <span className="text-gray-500 text-[10px]">Descanso:</span>
                                <input
                                  type="number"
                                  step="15"
                                  value={ex.restSeconds}
                                  onChange={(e) => {
                                    const updated = [...routineDays];
                                    updated[dIdx].exercises[exIdx].restSeconds = Number(e.target.value);
                                    setRoutineDays(updated);
                                  }}
                                  className="w-12 px-1 py-0.5 bg-white border border-gray-200 rounded text-center text-slate-900 font-mono font-bold text-xs"
                                />
                                <span className="text-gray-400 text-[10px]">seg</span>
                              </div>

                              <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                                <span className="text-gray-500 text-[10px]">Esfuerzo:</span>
                                <input
                                  type="text"
                                  value={ex.rir || ''}
                                  placeholder="RIR 1-2"
                                  onChange={(e) => {
                                    const updated = [...routineDays];
                                    updated[dIdx].exercises[exIdx].rir = e.target.value;
                                    setRoutineDays(updated);
                                  }}
                                  className="w-14 px-1 py-0.5 bg-white border border-gray-200 rounded text-center text-slate-900 font-mono text-[11px]"
                                />
                              </div>

                              <input
                                type="text"
                                value={ex.notes || ''}
                                placeholder="Nota / indicación técnica..."
                                onChange={(e) => {
                                  const updated = [...routineDays];
                                  updated[dIdx].exercises[exIdx].notes = e.target.value;
                                  setRoutineDays(updated);
                                }}
                                className="w-36 px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-slate-800 text-[11px]"
                              />

                              <button
                                type="button"
                                onClick={() => handleRemoveExerciseFromDay(dIdx, exIdx)}
                                className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer"
                                title="Quitar ejercicio"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Routine Button */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setActiveSubTab('routines')}
                className="px-3.5 py-1.5 text-gray-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Rutina Completa</span>
              </button>
            </div>

          </form>

        </div>
      )}

      {/* Routine Detail / Print View Modal */}
      {viewingRoutine && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 shadow-2xl animate-in fade-in text-slate-800">
            
            <div className="flex items-start justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                  {viewingRoutine.level} • {viewingRoutine.objective}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{viewingRoutine.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{viewingRoutine.description}</p>
                {viewingRoutine.targetStudentName && (
                  <p className="text-xs text-blue-700 font-semibold mt-1">
                    Asignado a: {viewingRoutine.targetStudentName}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-1.5 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-md cursor-pointer"
                  title="Imprimir rutina para el alumno"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button onClick={() => setViewingRoutine(null)} className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer">✕</button>
              </div>
            </div>

            <div className="space-y-4 my-4 text-xs">
              {viewingRoutine.days.map((day, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl border border-gray-200 p-3.5">
                  <div className="flex items-center justify-between mb-2.5 border-b border-gray-200 pb-1.5">
                    <h4 className="font-bold text-blue-700 text-xs sm:text-sm">{day.dayName}</h4>
                    {day.focus && <span className="text-[11px] text-gray-500">{day.focus}</span>}
                  </div>

                  <div className="space-y-2">
                    {day.exercises.map((ex, eIdx) => (
                      <div key={eIdx} className="p-2.5 bg-white rounded-lg border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded accent-blue-600 w-3.5 h-3.5" title="Marcar al completar" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-900">{ex.exerciseName}</p>
                              {ex.videoUrl && (
                                <button
                                  onClick={() => setPreviewVideoUrl({ url: ex.videoUrl!, title: ex.exerciseName })}
                                  className="text-blue-600 hover:text-blue-800 text-[10px] font-semibold flex items-center gap-0.5 cursor-pointer"
                                >
                                  <PlayCircle className="w-3 h-3" />
                                  <span>Ver Demo</span>
                                </button>
                              )}
                            </div>
                            {ex.notes && <p className="text-[10px] text-gray-500">{ex.notes}</p>}
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-blue-700 font-bold">{ex.sets} series x {ex.reps}</span>
                          <span className="text-gray-500 text-[10px] ml-2">⏱ {ex.restSeconds}s descanso</span>
                          {ex.rir && <span className="text-amber-700 text-[10px] ml-2 font-semibold">({ex.rir})</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setViewingRoutine(null)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md text-xs cursor-pointer shadow-xs"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Routine Assignment Modal */}
      {assigningRoutine && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-5 shadow-2xl animate-in fade-in text-slate-800">
            <h3 className="text-sm font-bold text-slate-900 mb-0.5">
              Asignar Rutina a Alumno
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Rutina seleccionada: <span className="text-blue-700 font-bold">{assigningRoutine.title}</span>
            </p>

            <form onSubmit={handleConfirmAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Seleccionar Alumno</label>
                <select
                  required
                  value={studentToAssignId}
                  onChange={(e) => setStudentToAssignId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="">Seleccionar alumno de la lista...</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.planName}) - {m.objective}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setAssigningRoutine(null)}
                  className="px-3 py-1.5 text-gray-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-xs cursor-pointer"
                >
                  Confirmar Asignación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Exercise Modal */}
      {isNewExerciseOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full p-5 shadow-2xl animate-in fade-in text-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Añadir Nuevo Ejercicio a la Base de Datos</h3>
                <p className="text-[11px] text-gray-500">Con especificaciones técnicas y enlace a video de demostración</p>
              </div>
              <button onClick={() => setIsNewExerciseOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateExerciseSubmit} className="space-y-3 my-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nombre del Ejercicio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Press Militar con Barra de Pie"
                  value={exName}
                  onChange={(e) => setExName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Grupo Muscular Principal</label>
                  <select
                    value={exMuscle}
                    onChange={(e) => setExMuscle(e.target.value as MuscleGroup)}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    {Object.entries(muscleLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Equipamiento</label>
                  <select
                    value={exEquipment}
                    onChange={(e) => setExEquipment(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    <option value="mancuernas">Mancuernas</option>
                    <option value="barra">Barra Olímpica</option>
                    <option value="maquina">Máquina Guiada</option>
                    <option value="polea">Polea / Cables</option>
                    <option value="peso_corporal">Peso Corporal / Calistenia</option>
                    <option value="kettlebell">Kettlebell / Pesa Rusa</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Dificultad</label>
                  <select
                    value={exDifficulty}
                    onChange={(e) => setExDifficulty(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    <option value="principiante">Principiante</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Series / Reps Sugeridas</label>
                  <input
                    type="text"
                    placeholder="4 series x 10-12 reps"
                    value={exDefaultReps}
                    onChange={(e) => setExDefaultReps(e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Instrucciones de Ejecución *</label>
                <textarea
                  rows={2.5}
                  required
                  placeholder="Describe la postura inicial, fase concéntrica, excéntrica y respiración..."
                  value={exInstructions}
                  onChange={(e) => setExInstructions(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Consejo Biomecánico / Tip del Entrenador</label>
                <input
                  type="text"
                  placeholder="Ej. Mantener retracción escapular y evitar arquear la zona lumbar"
                  value={exTips}
                  onChange={(e) => setExTips(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              {/* Video URL (Optional) */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-blue-600" />
                  <span>Enlace a Video Demostrativo (Opcional - YouTube, Vimeo, MP4)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={exVideoUrl}
                  onChange={(e) => setExVideoUrl(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              {/* Thumbnail URL (Optional) */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">URL de Imagen de Miniatura (Opcional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={exThumbnailUrl}
                  onChange={(e) => setExThumbnailUrl(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsNewExerciseOpen(false)}
                  className="px-3 py-1.5 text-gray-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-xs cursor-pointer transition-all"
                >
                  Guardar Ejercicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Exercise Details Preview Modal */}
      {selectedExerciseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full p-5 shadow-2xl animate-in fade-in text-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {muscleLabels[selectedExerciseModal.muscleGroup]}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedExerciseModal.name}</h3>
              </div>
              <button onClick={() => setSelectedExerciseModal(null)} className="text-gray-400 hover:text-gray-700 cursor-pointer">✕</button>
            </div>

            <div className="my-3.5 space-y-3 text-xs">
              {/* Video Embed or Preview */}
              {selectedExerciseModal.videoUrl && (
                <div className="space-y-1.5">
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-black border border-gray-200 shadow-xs">
                    <iframe
                      src={getEmbedUrl(selectedExerciseModal.videoUrl) || ''}
                      title={selectedExerciseModal.name}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex justify-end">
                    <a
                      href={selectedExerciseModal.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <span>Abrir video en nueva pestaña</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-slate-800 mb-1">Instrucciones Técnicas:</h4>
                <p className="text-slate-600 leading-relaxed">{selectedExerciseModal.instructions}</p>
              </div>

              {selectedExerciseModal.tips && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                  <h4 className="font-semibold mb-0.5 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    Tip del Entrenador:
                  </h4>
                  <p>{selectedExerciseModal.tips}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-[11px]">
                <div>
                  <span className="text-gray-500 block">Equipo:</span>
                  <strong className="text-slate-800 capitalize">{selectedExerciseModal.equipment}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Dificultad:</span>
                  <strong className="text-slate-800 capitalize">{selectedExerciseModal.difficulty}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Sugerido:</span>
                  <strong className="text-slate-800">{selectedExerciseModal.targetSetsRepsDefault}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedExerciseModal(null)}
                className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-md text-xs font-semibold cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Video Preview Player Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-xl w-full p-4 shadow-2xl animate-in fade-in text-slate-800">
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">{previewVideoUrl.title} - Video Demostrativo</h3>
              </div>
              <button onClick={() => setPreviewVideoUrl(null)} className="text-gray-400 hover:text-gray-700 cursor-pointer">✕</button>
            </div>

            <div className="my-3">
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black border border-gray-200 shadow-md">
                <iframe
                  src={getEmbedUrl(previewVideoUrl.url) || ''}
                  title={previewVideoUrl.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
              <a
                href={previewVideoUrl.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <span>Ver en YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-slate-800 rounded-md font-semibold cursor-pointer"
              >
                Cerrar Video
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
