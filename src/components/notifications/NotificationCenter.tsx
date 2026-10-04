import React, { useState } from 'react';
import { 
  Bell, 
  BellRing, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Settings, 
  Send, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  Search, 
  Sliders, 
  Users, 
  Check,
  RefreshCw,
  Info
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { 
  NotificationRule, 
  NotificationLog, 
  NotificationChannel, 
  NotificationCategory,
  GymClassNotice,
  RenewalAlert 
} from '../../types/gym';
import confetti from 'canvas-confetti';

interface NotificationCenterProps {
  onOpenRenewModal?: (member: any) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = () => {
  const { 
    notificationRules, 
    notificationLogs, 
    classes, 
    renewalAlerts, 
    members, 
    updateNotificationRule, 
    toggleNotificationRule, 
    sendDirectNotification, 
    sendManualCampaign, 
    triggerRealWebNotification, 
    addClassNotice, 
    deleteClassNotice,
    renewMembership,
    clearNotificationLogs
  } = useGym();

  const [activeTab, setActiveTab] = useState<'rules' | 'alerts' | 'classes' | 'campaigns' | 'logs'>('rules');

  // Rule editing modal
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null);
  const [ruleTemplateTitle, setRuleTemplateTitle] = useState('');
  const [ruleTemplateBody, setRuleTemplateBody] = useState('');
  const [ruleChannels, setRuleChannels] = useState<NotificationChannel[]>([]);
  const [ruleDaysOffset, setRuleDaysOffset] = useState(3);
  const [ruleTimingStr, setRuleTimingStr] = useState('');

  // Campaign builder state
  const [campTitle, setCampTitle] = useState('');
  const [campCategory, setCampCategory] = useState<NotificationCategory>('special_promo');
  const [campAudience, setCampAudience] = useState<'all' | 'active' | 'expiring_soon' | 'expired'>('all');
  const [campChannels, setCampChannels] = useState<NotificationChannel[]>(['push', 'whatsapp']);
  const [campMessage, setCampMessage] = useState('¡Hola {{nombre}}! 🌟 Aprovecha esta semana un 20% de descuento en suplementos deportivos y renueva tu plan {{plan}} al mejor precio en recepción.');
  const [isSendingCampaign, setIsSendingCampaign] = useState(false);

  // Class Notice modal
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassInstructor, setNewClassInstructor] = useState('');
  const [newClassSchedule, setNewClassSchedule] = useState('');
  const [newClassRoom, setNewClassRoom] = useState('Sala Principal');
  const [newClassCapacity, setNewClassCapacity] = useState(25);
  const [newClassDate, setNewClassDate] = useState('2026-08-31');

  // Alert filter
  const [alertFilter, setAlertFilter] = useState<'all' | 'urgent' | 'warning' | 'expired'>('all');
  const [alertSearch, setAlertSearch] = useState('');

  // Log filter
  const [logChannelFilter, setLogChannelFilter] = useState<string>('all');
  const [viewingLogMessage, setViewingLogMessage] = useState<NotificationLog | null>(null);

  // Request browser push permission helper
  const handleRequestPushPermission = async () => {
    const granted = await triggerRealWebNotification(
      'GymControl - Notificaciones Activas',
      '¡Has habilitado las notificaciones push en tiempo real en tu navegador!'
    );
    if (granted) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.2 } });
    }
  };

  const handleOpenEditRule = (rule: NotificationRule) => {
    setEditingRule(rule);
    setRuleTemplateTitle(rule.templateTitle);
    setRuleTemplateBody(rule.templateBody);
    setRuleChannels(rule.channels);
    setRuleDaysOffset(rule.timingValueDays);
    setRuleTimingStr(rule.triggerTiming);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;

    updateNotificationRule(editingRule.id, {
      templateTitle: ruleTemplateTitle,
      templateBody: ruleTemplateBody,
      channels: ruleChannels,
      timingValueDays: ruleDaysOffset,
      triggerTiming: ruleTimingStr || `${ruleDaysOffset} días antes del vencimiento`
    });

    setEditingRule(null);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.5 } });
  };

  const handleToggleChannelInRule = (channel: NotificationChannel) => {
    if (ruleChannels.includes(channel)) {
      if (ruleChannels.length === 1) return; // keep at least 1
      setRuleChannels(ruleChannels.filter(c => c !== channel));
    } else {
      setRuleChannels([...ruleChannels, channel]);
    }
  };

  const handleToggleChannelInCampaign = (channel: NotificationChannel) => {
    if (campChannels.includes(channel)) {
      if (campChannels.length === 1) return;
      setCampChannels(campChannels.filter(c => c !== channel));
    } else {
      setCampChannels([...campChannels, channel]);
    }
  };

  // Launch campaign
  const handleSendCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campTitle.trim() || !campMessage.trim()) return;

    setIsSendingCampaign(true);
    setTimeout(() => {
      const count = sendManualCampaign({
        title: campTitle.trim(),
        message: campMessage.trim(),
        category: campCategory,
        targetAudience: campAudience,
        channels: campChannels
      });

      setIsSendingCampaign(false);
      confetti({ particleCount: 60, spread: 75, origin: { y: 0.5 } });
      alert(`¡Campaña enviada exitosamente a ${count} socios por [${campChannels.join(', ')}]!`);
      setActiveTab('logs');
    }, 350);
  };

  // Send single direct notification to student
  const handleSendDirect = (alert: RenewalAlert, channel: NotificationChannel) => {
    const member = members.find(m => m.id === alert.memberId);
    if (!member) return;

    const title = alert.isExpired ? '⚠️ Membresía Vencida - GymControl' : '⏰ Recordatorio de Renovación de Membresía';
    const msg = alert.isExpired 
      ? `Hola ${member.fullName}, tu membresía de ${member.planName} venció el ${member.membershipEndDate}. ¡Renueva hoy en GymControl y mantén tu disciplina!`
      : `Hola ${member.fullName}, tu membresía de ${member.planName} vencerá el ${member.membershipEndDate} (${alert.daysLeft} días restantes). ¡Te esperamos en recepción para renovar!`;

    sendDirectNotification(
      member.id,
      member.fullName,
      title,
      msg,
      'renewal_reminder',
      channel,
      member.phone,
      member.email
    );

    if (channel === 'whatsapp') {
      const cleanPhone = member.phone.replace(/\D/g, '');
      const encoded = encodeURIComponent(msg);
      window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`, '_blank');
    }

    confetti({ particleCount: 35, spread: 60, origin: { y: 0.5 } });
  };

  // Send class notice broadcast
  const handleBroadcastClassNotice = (cls: GymClassNotice) => {
    const title = `🥊 Recordatorio de Clase: ${cls.name}`;
    const msg = `¡Hola socio! Te recordamos tu clase de ${cls.name} con ${cls.instructorName} en ${cls.room} (${cls.schedule}). ¡Llega 10 min antes con tu hidratación!`;

    let sent = 0;
    const targetMembers = members.slice(0, 8);

    targetMembers.forEach(m => {
      sendDirectNotification(m.id, m.fullName, title, msg, 'class_notice', 'push');
      sendDirectNotification(m.id, m.fullName, title, msg, 'class_notice', 'email', undefined, m.email);
      sent++;
    });

    confetti({ particleCount: 45, spread: 60, origin: { y: 0.4 } });
    alert(`¡Aviso de clase enviado a ${sent} alumnos inscritos vía Push y Email!`);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim() || !newClassInstructor.trim()) return;

    addClassNotice({
      name: newClassName.trim(),
      instructorName: newClassInstructor.trim(),
      schedule: newClassSchedule.trim() || 'Lunes a Viernes 07:00 AM - 08:00 AM',
      room: newClassRoom,
      registeredCount: 0,
      capacity: newClassCapacity,
      date: newClassDate || '2026-08-31'
    });

    setNewClassName('');
    setNewClassInstructor('');
    setNewClassSchedule('');
    setIsNewClassModalOpen(false);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
  };

  // Filtered alerts
  const filteredAlerts = renewalAlerts.filter(a => {
    if (alertFilter === 'expired' && !a.isExpired) return false;
    if (alertFilter === 'urgent' && (a.isExpired || a.daysLeft > 3)) return false;
    if (alertFilter === 'warning' && (a.isExpired || a.daysLeft <= 3)) return false;

    const term = alertSearch.toLowerCase();
    return a.memberName.toLowerCase().includes(term) || a.phone.includes(term) || a.planName.toLowerCase().includes(term);
  });

  // Filtered logs
  const filteredLogs = notificationLogs.filter(log => {
    if (logChannelFilter === 'all') return true;
    return log.channel === logChannelFilter;
  });

  const getChannelBadge = (ch: NotificationChannel) => {
    switch(ch) {
      case 'whatsapp':
        return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold flex items-center gap-1"><MessageSquare className="w-3 h-3" /> WhatsApp</span>;
      case 'email':
        return <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-bold flex items-center gap-1"><Mail className="w-3 h-3" /> Email</span>;
      case 'push':
        return <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded text-[10px] font-bold flex items-center gap-1"><Smartphone className="w-3 h-3" /> Push Web</span>;
      default:
        return <span className="px-2 py-0.5 bg-gray-50 text-gray-700 border border-gray-200 rounded text-[10px] font-bold flex items-center gap-1">{ch}</span>;
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Banner / System Summary */}
      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-[11px] font-bold uppercase tracking-wider mb-0.5">
            <BellRing className="w-3.5 h-3.5" />
            <span>Sistema Multicanal de Notificaciones & Automatizaciones</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900">
            Centro de Notificaciones, Alertas de Renovación y Avisos de Clases
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configuración por el administrador para recordatorios automáticos de vencimiento, avisos de clases grupales y promociones especiales con envío por Push, Email y WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRequestPushPermission}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-slate-800 text-xs font-semibold rounded-md border border-gray-200 flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
            title="Activar permisos de notificaciones push en el navegador"
          >
            <Smartphone className="w-3.5 h-3.5 text-purple-600" />
            <span>Probar Push Web</span>
          </button>

          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-md">
            {renewalAlerts.length} Alertas Activas
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'rules' ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-blue-600" />
          <span>Reglas Automáticas (Admin)</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'alerts' ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Vencimientos Activos ({renewalAlerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'classes' ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>Avisos de Clases ({classes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'campaigns' ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-600 hover:text-slate-900'
          }`}
        >
          <Send className="w-3.5 h-3.5 text-purple-600" />
          <span>Promociones Especiales</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'logs' ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-slate-600" />
          <span>Historial de Envíos ({notificationLogs.length})</span>
        </button>

      </div>

      {/* TAB 1: AUTOMATIC NOTIFICATION RULES CONFIGURATION (ADMIN) */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="bg-blue-50/60 border border-blue-200 p-3.5 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
            <Settings className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Automatizaciones Configurables por el Administrador</p>
              <p className="text-blue-800 text-[11px] mt-0.5">
                El sistema evalúa el estado de membresías y clases para emitir recordatorios preventivos y promociones. Puedes ajustar los canales por regla (Push, Email, WhatsApp) y personalizar las plantillas dinámicas con <code className="bg-white/80 px-1 py-0.2 rounded border border-blue-200">{"{{nombre}}"}</code>, <code className="bg-white/80 px-1 py-0.2 rounded border border-blue-200">{"{{plan}}"}</code> y <code className="bg-white/80 px-1 py-0.2 rounded border border-blue-200">{"{{fecha_vencimiento}}"}</code>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {notificationRules.map(rule => (
              <div 
                key={rule.id}
                className={`bg-white border rounded-xl p-4 shadow-xs transition-all flex flex-col justify-between ${
                  rule.enabled ? 'border-gray-200 hover:border-gray-300' : 'border-gray-200 opacity-60 bg-gray-50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${rule.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                        {rule.badgeTag}
                      </span>
                    </div>

                    {/* Switch ON/OFF */}
                    <button
                      onClick={() => toggleNotificationRule(rule.id)}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                        rule.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {rule.enabled ? 'ACTIVA' : 'PAUSADA'}
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1">{rule.name}</h3>
                  <p className="text-xs text-gray-500 mb-2.5">
                    Disparo: <strong className="text-slate-800">{rule.triggerTiming}</strong>
                  </p>

                  <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 mb-3 text-xs">
                    <span className="text-gray-400 text-[10px] uppercase font-bold block mb-1">Título: "{rule.templateTitle}"</span>
                    <p className="text-slate-700 font-mono text-[11px] leading-relaxed italic">"{rule.templateBody}"</p>
                  </div>

                  {/* Channels */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-gray-100">
                    <span className="text-[11px] text-gray-400 mr-1">Canales:</span>
                    {rule.channels.map(ch => (
                      <span key={ch}>{getChannelBadge(ch)}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditRule(rule)}
                    className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-md cursor-pointer transition-colors"
                  >
                    Editar Configuración & Plantilla
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE RENEWAL ALERTS & DIRECT SEND */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          
          {/* Filters */}
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por socio, teléfono o plan..."
                value={alertSearch}
                onChange={(e) => setAlertSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto">
              <button
                onClick={() => setAlertFilter('all')}
                className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                  alertFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:text-slate-900'
                }`}
              >
                Todos ({renewalAlerts.length})
              </button>
              <button
                onClick={() => setAlertFilter('expired')}
                className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                  alertFilter === 'expired' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600 hover:text-slate-900'
                }`}
              >
                ⛔ Vencidos ({renewalAlerts.filter(a => a.isExpired).length})
              </button>
              <button
                onClick={() => setAlertFilter('urgent')}
                className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                  alertFilter === 'urgent' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:text-slate-900'
                }`}
              >
                ⚠️ Críticos 1-3 días ({renewalAlerts.filter(a => !a.isExpired && a.daysLeft <= 3).length})
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredAlerts.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200 p-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">¡No hay vencimientos pendientes en este filtro!</h3>
                <p className="text-xs text-gray-500 mt-0.5">Todos los socios tienen su membresía al día.</p>
              </div>
            ) : (
              filteredAlerts.map(alert => (
                <div 
                  key={alert.memberId}
                  className={`bg-white border rounded-xl p-4 shadow-xs flex flex-col justify-between transition-all ${
                    alert.isExpired 
                      ? 'border-rose-300' 
                      : alert.daysLeft <= 3 
                      ? 'border-amber-300' 
                      : 'border-gray-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        alert.isExpired 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                          : alert.daysLeft <= 3 
                          ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                          : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                      }`}>
                        {alert.isExpired ? (
                          <>
                            <XCircle className="w-3 h-3" />
                            Vencido hace {Math.abs(alert.daysLeft)}d
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            Vence en {alert.daysLeft} {alert.daysLeft === 1 ? 'día' : 'días'}
                          </>
                        )}
                      </span>

                      <span className="text-[11px] font-mono text-gray-500">{alert.endDate}</span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900">{alert.memberName}</h3>
                    <p className="text-xs text-blue-700 font-semibold mt-0.5">{alert.planName}</p>
                    <p className="text-xs text-gray-500 mt-1">Teléfono: <span className="font-mono text-slate-700">{alert.phone}</span></p>
                  </div>

                  {/* Actions: Send 1-click WhatsApp, Push, Email or Quick Renew */}
                  <div className="mt-3.5 pt-2.5 border-t border-gray-100 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSendDirect(alert, 'whatsapp')}
                        className="flex-1 py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-md flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        title="Enviar recordatorio pre-redactado por WhatsApp"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => handleSendDirect(alert, 'email')}
                        className="flex-1 py-1 px-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        title="Enviar correo de renovación"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Email</span>
                      </button>

                      <button
                        onClick={() => handleSendDirect(alert, 'push')}
                        className="py-1 px-2 bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold text-xs rounded-md flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        title="Enviar notificación Push a la app"
                      >
                        <Smartphone className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        const m = members.find(mem => mem.id === alert.memberId);
                        if (m) {
                          renewMembership(m.id, m.planId, 'efectivo');
                          confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
                        }
                      }}
                      className="w-full py-1 text-center bg-gray-100 hover:bg-gray-200 text-slate-800 text-[11px] font-semibold rounded cursor-pointer transition-colors"
                    >
                      ⚡ Renovar Plan 1-Clic
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* TAB 3: CLASS NOTICES & BROADCASTS */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Horarios de Clases Grupales & Avisos a Alumnos</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Envía recordatorios automáticos de clases, cambios de sala o anuncios especiales a los alumnos.
              </p>
            </div>

            <button
              onClick={() => setIsNewClassModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Clase / Aviso</span>
            </button>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {classes.map(cls => (
              <div 
                key={cls.id}
                className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-4 shadow-xs flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                      {cls.room}
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono">
                      Inscritos: {cls.registeredCount}/{cls.capacity}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-0.5">{cls.name}</h3>
                  <p className="text-xs text-blue-700 font-semibold mb-2">Coach: {cls.instructorName}</p>

                  <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{cls.schedule}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>Fecha: {cls.date}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleBroadcastClassNotice(cls)}
                    className="flex-1 py-1.5 px-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Notificar Alumnos</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar aviso de clase "${cls.name}"?`)) {
                        deleteClassNotice(cls.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded cursor-pointer"
                    title="Eliminar clase"
                  >
                    ✕
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 4: SPECIAL PROMOTIONS CAMPAIGN BUILDER */}
      {activeTab === 'campaigns' && (
        <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-xs space-y-4">
          <div className="border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2 text-purple-600 text-[11px] font-bold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Creador de Campañas & Promociones Especiales</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Enviar Mensaje Promocional Masivo Multicanal
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Envía ofertas especiales (Black Friday, 2x1, descuentos en tienda) segmentando por estado del alumno.
            </p>
          </div>

          <form onSubmit={handleSendCampaign} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Título de la Campaña *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 🔥 20% OFF en Renovación Semestral & Suplementos"
                  value={campTitle}
                  onChange={(e) => setCampTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Categoría</label>
                <select
                  value={campCategory}
                  onChange={(e) => setCampCategory(e.target.value as NotificationCategory)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="special_promo">Promoción Especial</option>
                  <option value="class_notice">Evento / Masterclass</option>
                  <option value="renewal_reminder">Campaña de Reenganche</option>
                  <option value="general_alert">Aviso General</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Audiencia Objetivo (Segmentación)</label>
                <select
                  value={campAudience}
                  onChange={(e) => setCampAudience(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="all">Todos los Alumnos Registrados ({members.length} socios)</option>
                  <option value="active">Sólo Socios Activos ({members.filter(m => m.status === 'active').length} socios)</option>
                  <option value="expiring_soon">Socios Próximos a Vencer ({members.filter(m => m.status === 'expiring_soon').length} socios)</option>
                  <option value="expired">Socios Vencidos / Inactivos ({members.filter(m => m.status === 'expired').length} socios)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Canales de Envío Simultáneos</label>
                <div className="flex items-center gap-2 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer bg-gray-50 px-2.5 py-1 rounded border border-gray-200">
                    <input
                      type="checkbox"
                      checked={campChannels.includes('push')}
                      onChange={() => handleToggleChannelInCampaign('push')}
                      className="rounded accent-purple-600"
                    />
                    <span className="font-semibold text-purple-800">Push Web</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer bg-gray-50 px-2.5 py-1 rounded border border-gray-200">
                    <input
                      type="checkbox"
                      checked={campChannels.includes('email')}
                      onChange={() => handleToggleChannelInCampaign('email')}
                      className="rounded accent-blue-600"
                    />
                    <span className="font-semibold text-blue-800">Email</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer bg-gray-50 px-2.5 py-1 rounded border border-gray-200">
                    <input
                      type="checkbox"
                      checked={campChannels.includes('whatsapp')}
                      onChange={() => handleToggleChannelInCampaign('whatsapp')}
                      className="rounded accent-emerald-600"
                    />
                    <span className="font-semibold text-emerald-800">WhatsApp</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-semibold">Cuerpo del Mensaje / Oferta *</label>
                <span className="text-[11px] text-gray-400">Usa {"{{nombre}}"} para personalizar</span>
              </div>
              <textarea
                rows={3}
                required
                value={campMessage}
                onChange={(e) => setCampMessage(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 font-mono text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSendingCampaign}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-md shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingCampaign ? 'Enviando Campaña...' : 'Disparar Campaña Masiva'}</span>
              </button>
            </div>

          </form>

        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-4 space-y-3">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Historial y Registro de Notificaciones Enviadas</h2>
              <p className="text-xs text-gray-500">Auditoría completa de mensajes automáticos y manuales disparados</p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-gray-500 mr-1">Filtrar:</span>
                {['all', 'whatsapp', 'email', 'push'].map(ch => (
                  <button
                    key={ch}
                    onClick={() => setLogChannelFilter(ch)}
                    className={`px-2.5 py-1 rounded capitalize font-semibold cursor-pointer ${
                      logChannelFilter === ch ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:text-slate-800'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>

              {notificationLogs.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('¿Limpiar historial de notificaciones?')) {
                      clearNotificationLogs();
                    }
                  }}
                  className="p-1 text-gray-400 hover:text-rose-600 cursor-pointer ml-2"
                  title="Limpiar registro"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold text-[11px]">
                  <th className="py-2.5 px-3">Fecha & Hora</th>
                  <th className="py-2.5 px-3">Destinatario</th>
                  <th className="py-2.5 px-3">Canal</th>
                  <th className="py-2.5 px-3">Categoría</th>
                  <th className="py-2.5 px-3">Título / Asunto</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      No hay registros de notificaciones en este filtro.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2.5 px-3 text-gray-500 font-mono text-[11px] whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{log.recipientName}</td>
                      <td className="py-2.5 px-3">{getChannelBadge(log.channel)}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 bg-gray-100 text-gray-700 rounded">
                          {log.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-800 font-medium max-w-[200px] truncate">{log.title}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 w-fit">
                          <Check className="w-3 h-3" />
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => setViewingLogMessage(log)}
                          className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                        >
                          Ver Mensaje
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Edit Notification Rule Modal */}
      {editingRule && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full p-5 shadow-2xl animate-in fade-in text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Configurar Regla: {editingRule.name}</h3>
                <p className="text-[11px] text-gray-500">Parámetros de disparo automático</p>
              </div>
              <button onClick={() => setEditingRule(null)} className="text-gray-400 hover:text-gray-700 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-3.5 my-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Días de Anticipación / Desfase</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={ruleDaysOffset}
                    onChange={(e) => setRuleDaysOffset(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Descripción del Disparo</label>
                  <input
                    type="text"
                    value={ruleTimingStr}
                    onChange={(e) => setRuleTimingStr(e.target.value)}
                    placeholder="Ej. 3 días antes del vencimiento"
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Canales Habilitados para esta Regla</label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer bg-gray-50 px-2.5 py-1 rounded border border-gray-200">
                    <input
                      type="checkbox"
                      checked={ruleChannels.includes('push')}
                      onChange={() => handleToggleChannelInRule('push')}
                      className="rounded accent-purple-600"
                    />
                    <span className="font-semibold text-purple-800">Push Web</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer bg-gray-50 px-2.5 py-1 rounded border border-gray-200">
                    <input
                      type="checkbox"
                      checked={ruleChannels.includes('email')}
                      onChange={() => handleToggleChannelInRule('email')}
                      className="rounded accent-blue-600"
                    />
                    <span className="font-semibold text-blue-800">Email</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer bg-gray-50 px-2.5 py-1 rounded border border-gray-200">
                    <input
                      type="checkbox"
                      checked={ruleChannels.includes('whatsapp')}
                      onChange={() => handleToggleChannelInRule('whatsapp')}
                      className="rounded accent-emerald-600"
                    />
                    <span className="font-semibold text-emerald-800">WhatsApp</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Título de la Notificación *</label>
                <input
                  type="text"
                  required
                  value={ruleTemplateTitle}
                  onChange={(e) => setRuleTemplateTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 font-semibold text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-semibold">Plantilla del Mensaje *</label>
                  <span className="text-[10px] text-gray-400">{"{{nombre}}"} | {"{{plan}}"} | {"{{fecha_vencimiento}}"}</span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={ruleTemplateBody}
                  onChange={(e) => setRuleTemplateBody(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="px-3 py-1.5 text-gray-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-xs cursor-pointer"
                >
                  Guardar Configuración
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Class Notice Modal */}
      {isNewClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-5 shadow-2xl animate-in fade-in text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-sm font-bold text-slate-900">Añadir Clase / Aviso Especial</h3>
              <button onClick={() => setIsNewClassModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-3 my-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nombre de la Clase *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Spinning Power Nocturno"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Instructor / Coach *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Carlos Vega"
                  value={newClassInstructor}
                  onChange={(e) => setNewClassInstructor(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Horario & Días *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Martes y Jueves 19:00 - 20:00"
                  value={newClassSchedule}
                  onChange={(e) => setNewClassSchedule(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Sala / Espacio</label>
                  <input
                    type="text"
                    value={newClassRoom}
                    onChange={(e) => setNewClassRoom(e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Capacidad Máxima</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={newClassCapacity}
                    onChange={(e) => setNewClassCapacity(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsNewClassModalOpen(false)}
                  className="px-3 py-1.5 text-gray-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-xs cursor-pointer"
                >
                  Guardar Clase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Full Log Message Modal */}
      {viewingLogMessage && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-5 shadow-2xl animate-in fade-in text-slate-800">
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{viewingLogMessage.title}</h3>
                <p className="text-[11px] text-gray-500">Destinatario: {viewingLogMessage.recipientName} ({viewingLogMessage.channel})</p>
              </div>
              <button onClick={() => setViewingLogMessage(null)} className="text-gray-400 hover:text-gray-700 cursor-pointer">✕</button>
            </div>

            <div className="my-4 p-3 bg-gray-50 rounded-lg border border-gray-200 font-mono text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
              {viewingLogMessage.message}
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100">
              <span>Fecha: {viewingLogMessage.timestamp}</span>
              <span className="font-bold text-emerald-600 uppercase">Estado: {viewingLogMessage.status}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
