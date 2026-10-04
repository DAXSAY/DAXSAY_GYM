import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Check, 
  Edit3, 
  Trash2, 
  Users, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Dumbbell 
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { MembershipPlan } from '../../types/gym';

export const MembershipsPlans: React.FC = () => {
  const { plans, members, addPlan, updatePlan, deletePlan } = useGym();

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  const [name, setName] = useState('');
  const [durationDays, setDurationDays] = useState(30);
  const [price, setPrice] = useState(120);
  const [description, setDescription] = useState('');
  const [includesTrainer, setIncludesTrainer] = useState(false);
  const [popular, setPopular] = useState(false);
  const [featuresStr, setFeaturesStr] = useState('Acceso a sala de musculación\nCasillero de uso diario\nEvaluación física inicial');

  const handleOpenNew = () => {
    setEditingPlan(null);
    setName('');
    setDurationDays(30);
    setPrice(120);
    setDescription('Plan flexible con acceso a todas las máquinas y clases.');
    setIncludesTrainer(false);
    setPopular(false);
    setFeaturesStr('Acceso a sala de musculación\nCasillero de uso diario\nEvaluación física');
    setIsPlanModalOpen(true);
  };

  const handleOpenEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setDurationDays(plan.durationDays);
    setPrice(plan.price);
    setDescription(plan.description);
    setIncludesTrainer(plan.includesTrainer);
    setPopular(!!plan.popular);
    setFeaturesStr(plan.features.join('\n'));
    setIsPlanModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const features = featuresStr
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    if (editingPlan) {
      updatePlan(editingPlan.id, {
        name,
        durationDays,
        durationMonths: Math.round(durationDays / 30),
        price,
        description,
        includesTrainer,
        popular,
        features
      });
    } else {
      addPlan({
        name,
        durationDays,
        durationMonths: Math.round(durationDays / 30),
        price,
        description,
        includesTrainer,
        popular,
        features
      });
    }

    setIsPlanModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-[11px] font-bold uppercase tracking-wider mb-0.5">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Configuración de Tarifas & Membresías</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900">
            Planes de Membresía ({plans.length})
          </h1>
          <p className="text-xs text-gray-500">
            Define la duración en días, costo, beneficios y soporte con entrenador personal para cada tipo de suscripción.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0 self-start sm:self-auto transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Crear Nuevo Plan</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map(plan => {
          const subscribersCount = members.filter(m => m.planId === plan.id && m.status === 'active').length;

          return (
            <div 
              key={plan.id}
              className={`relative bg-white border rounded-xl p-4.5 flex flex-col justify-between transition-all shadow-xs ${
                plan.popular 
                  ? 'border-blue-600 ring-1 ring-blue-600/30' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-full shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  MÁS ELEGIDO
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(plan)}
                      className="p-1 text-gray-400 hover:text-slate-700 rounded-md hover:bg-gray-100 cursor-pointer"
                      title="Editar plan"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Estás seguro de eliminar el plan ${plan.name}?`)) {
                          deletePlan(plan.id);
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-rose-600 rounded-md hover:bg-gray-100 cursor-pointer"
                      title="Eliminar plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-1 min-h-[30px]">{plan.description}</p>

                {/* Price Display */}
                <div className="my-3.5 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] text-gray-500">Tarifa:</span>
                    <div className="text-2xl font-bold text-slate-900">
                      S/ {(plan.price || 0).toFixed(2)}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                    {plan.durationDays} días de acceso
                  </span>
                </div>

                {/* Features list */}
                <div className="space-y-2 mb-4 text-xs text-slate-600">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Beneficios Incluidos:</span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-green-50 text-green-700 border border-green-200 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                  {plan.includesTrainer && (
                    <div className="flex items-start gap-2 text-blue-700 font-semibold pt-1">
                      <Dumbbell className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>Incluye seguimiento con Entrenador Personal</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Subscribed Active Members footer */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>Alumnos Activos:</span>
                </div>
                <span className="font-bold text-slate-800 bg-gray-100 px-2 py-0.5 rounded-md">
                  {subscribersCount} inscritos
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Plan Create / Edit Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-5 shadow-2xl animate-in fade-in text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-sm font-bold text-slate-900">
                {editingPlan ? 'Editar Plan de Membresía' : 'Nuevo Plan de Membresía'}
              </h3>
              <button onClick={() => setIsPlanModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 my-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nombre del Plan *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Plan Trimestral Power"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Precio (S/) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Duración (Días) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Descripción Breve</label>
                <input
                  type="text"
                  placeholder="Breve reseña del público objetivo"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Beneficios (Uno por línea)</label>
                <textarea
                  rows={3}
                  value={featuresStr}
                  onChange={(e) => setFeaturesStr(e.target.value)}
                  placeholder="Acceso libre 7 días&#10;Casillero gratuito&#10;10% descuento en tienda"
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={includesTrainer}
                    onChange={(e) => setIncludesTrainer(e.target.checked)}
                    className="rounded accent-blue-600"
                  />
                  <span>Incluye Entrenador Personal asignado</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={popular}
                    onChange={(e) => setPopular(e.target.checked)}
                    className="rounded accent-blue-600"
                  />
                  <span>Destacar como "Más Elegido"</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-3 py-1.5 text-gray-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-xs cursor-pointer transition-all"
                >
                  {editingPlan ? 'Actualizar Plan' : 'Guardar Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
