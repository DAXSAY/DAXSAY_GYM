import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  UserCheck, 
  UserX, 
  Clock, 
  MessageCircle, 
  RefreshCw, 
  Edit3, 
  Trash2, 
  ChevronRight, 
  Dumbbell, 
  Phone, 
  Mail, 
  Calendar, 
  IdCard, 
  HeartPulse, 
  Check, 
  ExternalLink,
  UserPlus,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { Member, FitnessObjective, PaymentMethod, MembershipStatus } from '../../types/gym';
import confetti from 'canvas-confetti';

interface MembersManagementProps {
  onOpenNewMemberModal: () => void;
  onOpenRenewalModalForMember?: (member: Member) => void;
}

export const MembersManagement: React.FC<MembersManagementProps> = ({
  onOpenNewMemberModal
}) => {
  const { 
    members, 
    plans, 
    trainers, 
    routines, 
    deleteMember, 
    updateMember,
    renewMembership, 
    assignTrainerToMember, 
    assignRoutineToMember,
    generateWhatsAppLink 
  } = useGym();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | MembershipStatus>('all');
  const [trainerFilter, setTrainerFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  // Modals inside component
  const [renewingMember, setRenewingMember] = useState<Member | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Edit member modal
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Filtered members list
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.dni.includes(searchTerm) ||
      member.phone.includes(searchTerm) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    const matchesTrainer = trainerFilter === 'all' || member.assignedTrainerId === trainerFilter;

    return matchesSearch && matchesStatus && matchesTrainer;
  });

  const getObjectiveLabel = (obj: FitnessObjective) => {
    switch (obj) {
      case 'hipertrofia': return '💪 Ganancia Muscular';
      case 'perdida_peso': return '🔥 Pérdida de Grasa';
      case 'fuerza': return '⚡ Fuerza Máxima';
      case 'tonificacion': return '✨ Tonificación';
      case 'resistencia': return '🏃 Resistencia & Cardio';
      case 'salud_rehabilitacion': return '🩺 Salud & Postura';
      default: return obj;
    }
  };

  const handleRenewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renewingMember || !selectedPlanId) return;

    renewMembership(renewingMember.id, selectedPlanId, paymentMethod, discountAmount);
    
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });

    setRenewingMember(null);
    setSelectedPlanId('');
    setDiscountAmount(0);
  };

  return (
    <div className="space-y-4 pb-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-[11px] font-bold uppercase tracking-wider mb-0.5">
            <Users className="w-3.5 h-3.5" />
            <span>Módulo de Alumnos</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900">
            Directorio de Alumnos ({members.length})
          </h1>
          <p className="text-xs text-gray-500">
            Control de altas, vigencia de cuotas, entrenador asignado y rutinas de entrenamiento.
          </p>
        </div>

        <button
          onClick={onOpenNewMemberModal}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all shrink-0 self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Nuevo Alumno</span>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por Nombre, DNI o Teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-xs text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
            }`}
          >
            Todos ({members.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-green-600 text-white'
                : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
            }`}
          >
            Activos ({members.filter(m => m.status === 'active').length})
          </button>
          <button
            onClick={() => setStatusFilter('expiring_soon')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              statusFilter === 'expiring_soon'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            Por Vencer ({members.filter(m => m.status === 'expiring_soon').length})
          </button>
          <button
            onClick={() => setStatusFilter('expired')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              statusFilter === 'expired'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
            }`}
          >
            Vencidos ({members.filter(m => m.status === 'expired').length})
          </button>
        </div>

        {/* Trainer Selector Filter */}
        <div className="w-full md:w-auto">
          <select
            value={trainerFilter}
            onChange={(e) => setTrainerFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-600"
          >
            <option value="all">Todos los Entrenadores</option>
            {trainers.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Members List Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                <th className="px-4 py-2.5">Alumno</th>
                <th className="px-4 py-2.5">DNI / Contacto</th>
                <th className="px-4 py-2.5">Plan Actual</th>
                <th className="px-4 py-2.5">Vencimiento</th>
                <th className="px-4 py-2.5">Entrenador & Rutina</th>
                <th className="px-4 py-2.5">Estado</th>
                <th className="px-4 py-2.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400 text-xs">
                    No se encontraron alumnos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredMembers.map(member => {
                  const assignedTrainer = trainers.find(t => t.id === member.assignedTrainerId);
                  const assignedRoutine = routines.find(r => r.id === member.assignedRoutineId);

                  return (
                    <tr key={member.id} className="hover:bg-gray-50/80 transition-colors group">
                      
                      {/* Name & Objective */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-600 shrink-0 text-xs">
                            {member.fullName.charAt(0)}
                          </div>
                          <div>
                            <button
                              onClick={() => setSelectedMember(member)}
                              className="font-bold text-slate-800 hover:text-blue-600 text-left transition-colors cursor-pointer"
                            >
                              {member.fullName}
                            </button>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {getObjectiveLabel(member.objective)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* DNI & Phone */}
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          <p className="font-mono text-slate-800 font-semibold">{member.dni}</p>
                          <p className="text-gray-500 text-[11px]">{member.phone}</p>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-800">{member.planName}</span>
                      </td>

                      {/* Expiration Date */}
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-mono text-slate-800 font-semibold">{member.membershipEndDate}</p>
                          <p className="text-[10px] text-gray-400">Inicio: {member.membershipStartDate}</p>
                        </div>
                      </td>

                      {/* Trainer & Routine */}
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Dumbbell className="w-3 h-3 text-blue-600" />
                            <span className="truncate max-w-[130px] font-medium">
                              {assignedTrainer ? assignedTrainer.name : 'Sin asignar'}
                            </span>
                          </div>
                          {assignedRoutine && (
                            <span className="inline-block text-[10px] px-1.5 py-0.2 bg-gray-100 text-gray-600 rounded border border-gray-200 truncate max-w-[140px]">
                              {assignedRoutine.title}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          member.status === 'active'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : member.status === 'expiring_soon'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {member.status === 'active' && <UserCheck className="w-3 h-3" />}
                          {member.status === 'expiring_soon' && <Clock className="w-3 h-3" />}
                          {member.status === 'expired' && <UserX className="w-3 h-3" />}
                          {member.status === 'active' ? 'Vigente' : member.status === 'expiring_soon' ? 'Por Vencer' : 'Vencido'}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* WhatsApp Direct Link */}
                          <a
                            href={generateWhatsAppLink(member)}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-green-50 hover:bg-green-600 text-green-700 hover:text-white rounded border border-green-200 transition-colors cursor-pointer"
                            title="Enviar WhatsApp al alumno"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>

                          {/* Quick Renew Button */}
                          <button
                            onClick={() => {
                              setRenewingMember(member);
                              setSelectedPlanId(member.planId || plans[1]?.id || plans[0]?.id);
                            }}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded font-medium text-[11px] border border-blue-200 transition-colors cursor-pointer flex items-center gap-1"
                            title="Renovar membresía"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Renovar</span>
                          </button>

                          {/* Profile View */}
                          <button
                            onClick={() => setSelectedMember(member)}
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded border border-gray-200 transition-colors cursor-pointer"
                            title="Ver ficha completa"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 shadow-2xl animate-in fade-in text-slate-800">
            
            <div className="flex items-start justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 font-extrabold text-xl flex items-center justify-center">
                  {selectedMember.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedMember.fullName}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono text-gray-500">DNI: {selectedMember.dni}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-blue-600 font-semibold">{getObjectiveLabel(selectedMember.objective)}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMember(null)}
                className="text-gray-400 hover:text-gray-700 p-1 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-4">
              
              {/* Membership Card */}
              <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Membresía</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                    selectedMember.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedMember.status === 'active' ? 'Vigente' : 'Vencido'}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900">{selectedMember.planName}</p>
                <div className="text-xs text-slate-600 space-y-1 pt-1">
                  <p>📅 Inicio: <span className="font-mono">{selectedMember.membershipStartDate}</span></p>
                  <p>⏳ Vencimiento: <span className="font-mono text-blue-700 font-bold">{selectedMember.membershipEndDate}</span></p>
                  {selectedMember.lastPaymentAmount && (
                    <p>💰 Último Pago: <span className="font-bold text-green-700">S/ {selectedMember.lastPaymentAmount}</span> ({selectedMember.lastPaymentDate})</p>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-200 space-y-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Contacto & Emergencia</span>
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{selectedMember.phone}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{selectedMember.email}</span>
                  </p>
                  <div className="pt-1 text-[11px] text-gray-500">
                    <p className="font-semibold text-slate-700">Contacto de Emergencia:</p>
                    <p>{selectedMember.emergencyContact.name} ({selectedMember.emergencyContact.relationship}) - {selectedMember.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>

              {/* Trainer & Routine Assignment */}
              <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-200 space-y-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Entrenador Personal</span>
                <select
                  value={selectedMember.assignedTrainerId || ''}
                  onChange={(e) => {
                    assignTrainerToMember(selectedMember.id, e.target.value);
                    setSelectedMember({ ...selectedMember, assignedTrainerId: e.target.value });
                  }}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs text-slate-800"
                >
                  <option value="">Sin Entrenador Asignado</option>
                  {trainers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>
                  ))}
                </select>

                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mt-1">Rutina Asignada</span>
                <select
                  value={selectedMember.assignedRoutineId || ''}
                  onChange={(e) => {
                    assignRoutineToMember(selectedMember.id, e.target.value);
                    setSelectedMember({ ...selectedMember, assignedRoutineId: e.target.value });
                  }}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs text-slate-800"
                >
                  <option value="">Sin Rutina Asignada</option>
                  {routines.map(r => (
                    <option key={r.id} value={r.id}>{r.title} ({r.level})</option>
                  ))}
                </select>
              </div>

              {/* Medical & Notes */}
              <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-200 space-y-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                  Salud & Observaciones
                </span>
                <p className="text-xs text-slate-600">
                  {selectedMember.medicalNotes || 'Sin restricciones médicas reportadas.'}
                </p>
                {selectedMember.notes && (
                  <p className="text-xs text-amber-800 pt-1 border-t border-gray-200">
                    <span className="font-semibold">Nota:</span> {selectedMember.notes}
                  </p>
                )}
              </div>

            </div>

            {/* Actions footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-200">
              <button
                onClick={() => {
                  if (confirm(`¿Estás seguro de eliminar al alumno ${selectedMember.fullName}?`)) {
                    deleteMember(selectedMember.id);
                    setSelectedMember(null);
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Eliminar Alumno
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={generateWhatsAppLink(selectedMember)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Contactar WhatsApp
                </a>

                <button
                  onClick={() => {
                    setRenewingMember(selectedMember);
                    setSelectedPlanId(selectedMember.planId || plans[1]?.id);
                    setSelectedMember(null);
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Renovar Membresía
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Renewal Quick Modal */}
      {renewingMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-5 shadow-2xl animate-in fade-in text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Renovación de Membresía</h3>
                <p className="text-xs text-gray-500 mt-0.5">Alumno: {renewingMember.fullName}</p>
              </div>
              <button 
                onClick={() => setRenewingMember(null)} 
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRenewSubmit} className="space-y-3.5 my-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Seleccionar Plan a Renovar</label>
                <div className="space-y-1.5">
                  {plans.map(p => (
                    <label 
                      key={p.id}
                      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                        selectedPlanId === p.id 
                          ? 'bg-blue-50 border-blue-600 text-blue-900' 
                          : 'bg-gray-50 border-gray-200 text-slate-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="renewalPlan"
                          value={p.id}
                          checked={selectedPlanId === p.id}
                          onChange={() => setSelectedPlanId(p.id)}
                          className="accent-blue-600"
                        />
                        <div>
                          <p className="text-xs font-bold">{p.name}</p>
                          <p className="text-[10px] text-gray-500">{p.durationDays} días de acceso</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-700">S/ {p.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Método de Pago</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="efectivo">💵 Efectivo</option>
                    <option value="yape_plin">📱 Yape / Plin</option>
                    <option value="tarjeta">💳 Tarjeta (POS)</option>
                    <option value="transferencia">🏦 Transferencia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Descuento (S/)</label>
                  <input
                    type="number"
                    min="0"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {selectedPlanId && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Total a Cobrar:</span>
                  <span className="text-sm font-bold text-green-700">
                    S/ {Math.max(0, (plans.find(p => p.id === selectedPlanId)?.price || 0) - discountAmount).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setRenewingMember(null)}
                  className="px-3 py-1.5 text-xs text-gray-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  Confirmar Renovación
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
