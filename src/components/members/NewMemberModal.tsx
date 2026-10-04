import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  CreditCard, 
  Calendar, 
  Phone, 
  Mail, 
  IdCard, 
  HeartPulse, 
  Dumbbell, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { FitnessObjective, PaymentMethod } from '../../types/gym';
import confetti from 'canvas-confetti';

interface NewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewMemberModal: React.FC<NewMemberModalProps> = ({ isOpen, onClose }) => {
  const { plans, trainers, routines, addMember } = useGym();

  const todayStr = '2026-08-30';

  const [dni, setDni] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+51');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | 'Otro'>('M');
  const [birthDate, setBirthDate] = useState('2000-01-01');
  
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRel, setEmergencyRel] = useState('Familiar');

  const [medicalNotes, setMedicalNotes] = useState('');
  const [notes, setNotes] = useState('');
  const [objective, setObjective] = useState<FitnessObjective>('hipertrofia');

  const [selectedPlanId, setSelectedPlanId] = useState(plans[1]?.id || plans[0]?.id || '');
  const [startDate, setStartDate] = useState(todayStr);
  const [assignedTrainerId, setAssignedTrainerId] = useState('');
  const [assignedRoutineId, setAssignedRoutineId] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');

  if (!isOpen) return null;

  const currentPlan = plans.find(p => p.id === selectedPlanId);

  // Compute calculated end date
  const computeEndDate = () => {
    if (!currentPlan) return todayStr;
    const start = new Date(startDate || todayStr);
    const end = new Date(start);
    end.setDate(end.getDate() + currentPlan.durationDays);
    return end.toISOString().split('T')[0];
  };

  const calculatedEndDate = computeEndDate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !dni.trim() || !phone.trim() || !currentPlan) {
      alert('Por favor completa los campos obligatorios: Nombre, DNI, Teléfono y Plan.');
      return;
    }

    addMember({
      dni: dni.trim(),
      fullName: fullName.trim(),
      email: email.trim() || `${dni.trim()}@cliente.gymcontrol.com`,
      phone: phone.trim(),
      gender,
      birthDate,
      emergencyContact: {
        name: emergencyName || 'No especificado',
        phone: emergencyPhone || phone,
        relationship: emergencyRel || 'Familiar'
      },
      medicalNotes: medicalNotes.trim() || undefined,
      objective,
      planId: currentPlan.id,
      planName: currentPlan.name,
      membershipStartDate: startDate,
      membershipEndDate: calculatedEndDate,
      assignedTrainerId: assignedTrainerId || undefined,
      assignedRoutineId: assignedRoutineId || undefined,
      notes: notes.trim() || undefined,
      lastPaymentAmount: currentPlan.price,
      lastPaymentDate: startDate
    });

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom-3 text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Registro de Nuevo Alumno
              </h2>
              <p className="text-[11px] text-gray-500">Inscripción, asignación de plan y registro de pago inicial</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 text-xs">
          
          {/* Section 1: Personal Data */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5 mb-2.5">
              <IdCard className="w-3.5 h-3.5" />
              1. Datos Personales
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nombres y Apellidos *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez Ramos"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">DNI / Documento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 74829103"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. +51987654321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="alumno@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Género</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Fitness Objective & Health */}
          <div className="pt-2 border-t border-gray-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5 mb-2.5">
              <Dumbbell className="w-3.5 h-3.5" />
              2. Objetivo & Salud
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Objetivo de Entrenamiento</label>
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value as FitnessObjective)}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="hipertrofia">💪 Ganancia Muscular / Hipertrofia</option>
                  <option value="perdida_peso">🔥 Pérdida de Grasa / Peso</option>
                  <option value="fuerza">⚡ Aumento de Fuerza</option>
                  <option value="tonificacion">✨ Tonificación General</option>
                  <option value="resistencia">🏃 Resistencia Cardiovascular & Funcional</option>
                  <option value="salud_rehabilitacion">🩺 Salud & Postura / Rehabilitación</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Contacto de Emergencia</label>
                <input
                  type="text"
                  placeholder="Nombre y teléfono de familiar"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Restricciones Médicas / Lesiones</label>
                <input
                  type="text"
                  placeholder="Ej. Lesión previa en hombro derecho, hipertensión, asma, etc."
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Membership Plan & Staff Assignment */}
          <div className="pt-2 border-t border-gray-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5 mb-2.5">
              <CreditCard className="w-3.5 h-3.5" />
              3. Plan de Membresía & Asignaciones
            </span>

            {/* Plans choice */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2.5">
              {plans.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    selectedPlanId === p.id 
                      ? 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-600' 
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-xs">{p.name}</p>
                  <p className="text-[10px] text-gray-500">{p.durationDays} días</p>
                  <p className="text-blue-700 font-bold font-mono text-xs mt-0.5">S/ {p.price}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Fecha de Inicio</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Fecha Fin (Calculada)</label>
                <input
                  type="text"
                  disabled
                  value={calculatedEndDate}
                  className="w-full px-2.5 py-1.5 bg-gray-100 border border-gray-200 rounded-md text-blue-700 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Entrenador Personal Asignado</label>
                <select
                  value={assignedTrainerId}
                  onChange={(e) => setAssignedTrainerId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="">Opcional: Sin Asignar</option>
                  {trainers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Rutina Inicial Asignada</label>
                <select
                  value={assignedRoutineId}
                  onChange={(e) => setAssignedRoutineId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="">Opcional: Sin Rutina</option>
                  {routines.map(r => (
                    <option key={r.id} value={r.id}>{r.title} ({r.level})</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Método de Pago</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="efectivo">💵 Efectivo</option>
                  <option value="yape_plin">📱 Yape / Plin</option>
                  <option value="tarjeta">💳 Tarjeta Débito / Crédito</option>
                  <option value="transferencia">🏦 Transferencia Bancaria</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bottom Bar Summary */}
          {currentPlan && (
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Total a Pagar e Ingreso de Caja:</p>
                <p className="text-xs font-semibold text-slate-900">{currentPlan.name} • Vence: {calculatedEndDate}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-blue-700 font-mono">
                  S/ {(currentPlan?.price || 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-gray-500 hover:text-slate-800 font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-xs transition-all cursor-pointer"
            >
              Completar Inscripción
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
