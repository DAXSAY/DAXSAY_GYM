import React, { useState, useMemo } from 'react';
import { 
  Bike, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Flame, 
  Ticket, 
  CreditCard, 
  DollarSign, 
  Share2, 
  Printer, 
  Search, 
  Plus, 
  X, 
  Sparkles, 
  AlertCircle, 
  QrCode, 
  Radio, 
  Music, 
  UserCheck, 
  Volume2, 
  Fan, 
  Footprints,
  ExternalLink,
  ShieldCheck,
  Key,
  Smartphone,
  Copy,
  Check,
  MessageCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { SpinningSession, SpinningBike, SpinningReservation, PaymentMethod, Member, SpinningAccessCode } from '../../types/gym';
import confetti from 'canvas-confetti';

const INTENSITY_COLORS = {
  moderada: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  alta: 'bg-blue-100 text-blue-800 border-blue-300',
  extrema: 'bg-rose-100 text-rose-800 border-rose-300'
};

export const SpinningModule: React.FC = () => {
  const { 
    spinningBikes, 
    spinningSessions, 
    spinningReservations, 
    members, 
    trainers, 
    spinningAccessCodes,
    generateSpinningAccessCode,
    redeemSpinningAccessCode,
    currentUser,
    reserveSpinningBike, 
    cancelSpinningReservation, 
    checkInSpinningReservation, 
    toggleBikeMaintenance,
    addSpinningSession
  } = useGym();

  // Active Session Selected
  const [selectedSessionId, setSelectedSessionId] = useState<string>(spinningSessions[0]?.id || '');
  
  // Selected Bike for detail or booking
  const [selectedBikeNumber, setSelectedBikeNumber] = useState<number | null>(null);

  // Modals
  const [isExternalGuestModalOpen, setIsExternalGuestModalOpen] = useState(false);
  const [isMemberBookingModalOpen, setIsMemberBookingModalOpen] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [viewTicketReservation, setViewTicketReservation] = useState<SpinningReservation | null>(null);

  // YAPE & UNIQUE ACCESS CODES STATE (User & Reception flows)
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [redeemCodeInput, setRedeemCodeInput] = useState('');
  const [redeemSelectedBike, setRedeemSelectedBike] = useState<number>(1);
  const [redeemStudentName, setRedeemStudentName] = useState(currentUser?.role === 'student' ? currentUser.fullName : '');
  const [redeemStudentPhone, setRedeemStudentPhone] = useState(currentUser?.phone || '');
  const [redeemShoes, setRedeemShoes] = useState<'calas_spd' | 'zapatilla_comun'>('zapatilla_comun');

  const [isGenerateCodeModalOpen, setIsGenerateCodeModalOpen] = useState(false);
  const [genClientName, setGenClientName] = useState('');
  const [genClientPhone, setGenClientPhone] = useState('');
  const [genSessionId, setGenSessionId] = useState<string>('');
  const [genAmount, setGenAmount] = useState<number>(20);
  const [genNotes, setGenNotes] = useState('Comprobante Yape verificado por WhatsApp.');
  const [generatedSuccessCode, setGeneratedSuccessCode] = useState<SpinningAccessCode | null>(null);

  const [isCodesManagerOpen, setIsCodesManagerOpen] = useState(false);
  const [isYapeInstructionsModalOpen, setIsYapeInstructionsModalOpen] = useState(false);
  const [copyCodeFeedback, setCopyCodeFeedback] = useState<string | null>(null);

  // External Guest Form State
  const [extGuestName, setExtGuestName] = useState('');
  const [extGuestPhone, setExtGuestPhone] = useState('');
  const [extGuestEmail, setExtGuestEmail] = useState('');
  const [extGuestPrice, setExtGuestPrice] = useState<number>(20);
  const [extGuestPaymentMethod, setExtGuestPaymentMethod] = useState<PaymentMethod>('yape_plin');
  const [extGuestShoes, setExtGuestShoes] = useState<'calas_spd' | 'zapatilla_comun'>('zapatilla_comun');
  const [extGuestBikeNumber, setExtGuestBikeNumber] = useState<number>(1);
  const [extGuestNotes, setExtGuestNotes] = useState('');

  // Member Booking Form State
  const [memberBookingStudentId, setMemberBookingStudentId] = useState('');
  const [memberBookingShoes, setMemberBookingShoes] = useState<'calas_spd' | 'zapatilla_comun'>('zapatilla_comun');
  const [memberBookingBikeNumber, setMemberBookingBikeNumber] = useState<number>(1);
  const [memberBookingNotes, setMemberBookingNotes] = useState('');

  // New Session Form State
  const [newSessTitle, setNewSessTitle] = useState('🚴 Power Interval Ride');
  const [newSessInstructor, setNewSessInstructor] = useState('Carlos Mendoza');
  const [newSessDate, setNewSessDate] = useState('2026-08-30');
  const [newSessStartTime, setNewSessStartTime] = useState('07:00 PM');
  const [newSessEndTime, setNewSessEndTime] = useState('07:50 PM');
  const [newSessDuration, setNewSessDuration] = useState(50);
  const [newSessIntensity, setNewSessIntensity] = useState<'moderada' | 'alta' | 'extrema'>('alta');
  const [newSessGenre, setNewSessGenre] = useState('EDM & Rock Hi-Energy');
  const [newSessPrice, setNewSessPrice] = useState(20);

  // Current Selected Session
  const currentSession = useMemo(() => {
    return spinningSessions.find(s => s.id === selectedSessionId) || spinningSessions[0];
  }, [spinningSessions, selectedSessionId]);

  // Current Session Reservations
  const sessionReservations = useMemo(() => {
    if (!currentSession) return [];
    return spinningReservations.filter(r => r.sessionId === currentSession.id && r.status !== 'cancelled');
  }, [spinningReservations, currentSession]);

  // Bike Status Map
  const bikeStatusMap = useMemo(() => {
    const map = new Map<number, { status: 'available' | 'reserved' | 'checked_in' | 'external' | 'maintenance'; reservation?: SpinningReservation; bike: SpinningBike }>();

    spinningBikes.forEach(bike => {
      if (bike.notes && bike.notes.includes('mantenimiento')) {
        map.set(bike.bikeNumber, { status: 'maintenance', bike });
        return;
      }

      const res = sessionReservations.find(r => r.bikeNumber === bike.bikeNumber);
      if (res) {
        if (res.isExternalGuest) {
          map.set(bike.bikeNumber, { status: 'external', reservation: res, bike });
        } else if (res.status === 'checked_in') {
          map.set(bike.bikeNumber, { status: 'checked_in', reservation: res, bike });
        } else {
          map.set(bike.bikeNumber, { status: 'reserved', reservation: res, bike });
        }
      } else {
        map.set(bike.bikeNumber, { status: 'available', bike });
      }
    });

    return map;
  }, [spinningBikes, sessionReservations]);

  // Capacity stats
  const capacityStats = useMemo(() => {
    const total = spinningBikes.length;
    const reserved = sessionReservations.length;
    const available = Math.max(0, total - reserved);
    const pct = Math.round((reserved / (total || 1)) * 100);
    const externalCount = sessionReservations.filter(r => r.isExternalGuest).length;

    return { total, reserved, available, pct, externalCount };
  }, [spinningBikes, sessionReservations]);

  // Open Booking for a specific bike
  const handleBikeClick = (bikeNumber: number) => {
    const current = bikeStatusMap.get(bikeNumber);
    setSelectedBikeNumber(bikeNumber);

    if (!current || current.status === 'available') {
      // Prompt option or open member booking modal by default with this bike
      setMemberBookingBikeNumber(bikeNumber);
      setExtGuestBikeNumber(bikeNumber);
      setIsMemberBookingModalOpen(true);
    } else if (current.reservation) {
      setViewTicketReservation(current.reservation);
    }
  };

  // Open External Guest Modal
  const handleOpenExternalGuestModal = (presetBike?: number) => {
    // Find first available bike if not preset
    if (presetBike) {
      setExtGuestBikeNumber(presetBike);
    } else {
      const freeBike = spinningBikes.find(b => !sessionReservations.some(r => r.bikeNumber === b.bikeNumber));
      if (freeBike) setExtGuestBikeNumber(freeBike.bikeNumber);
    }
    setExtGuestName('');
    setExtGuestPhone('');
    setExtGuestEmail('');
    setExtGuestPrice(currentSession?.externalSessionPrice || 20);
    setExtGuestPaymentMethod('yape_plin');
    setExtGuestShoes('zapatilla_comun');
    setIsExternalGuestModalOpen(true);
  };

  // Submit External Guest Booking & Payment
  const handleSubmitExternalGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSession) return;

    const result = reserveSpinningBike({
      sessionId: currentSession.id,
      bikeNumber: Number(extGuestBikeNumber),
      memberId: `guest-${Date.now()}`,
      memberName: extGuestName,
      memberPhone: extGuestPhone,
      memberEmail: extGuestEmail,
      shoesRequirement: extGuestShoes,
      specialNotes: extGuestNotes,
      isExternalGuest: true,
      paidAmount: Number(extGuestPrice),
      paymentMethod: extGuestPaymentMethod
    });

    if (result.success && result.reservation) {
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      setIsExternalGuestModalOpen(false);
      setViewTicketReservation(result.reservation);
    } else {
      alert(result.message);
    }
  };

  // Submit Member Booking
  const handleSubmitMemberBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSession) return;

    const student = members.find(m => m.id === memberBookingStudentId);
    if (!student) {
      alert('Por favor selecciona un alumno de la lista.');
      return;
    }

    const result = reserveSpinningBike({
      sessionId: currentSession.id,
      bikeNumber: Number(memberBookingBikeNumber),
      memberId: student.id,
      memberName: student.fullName,
      memberPhone: student.phone,
      memberEmail: student.email,
      shoesRequirement: memberBookingShoes,
      specialNotes: memberBookingNotes,
      isExternalGuest: false
    });

    if (result.success && result.reservation) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      setIsMemberBookingModalOpen(false);
      setViewTicketReservation(result.reservation);
    } else {
      alert(result.message);
    }
  };

  // Create New Session
  const handleCreateNewSession = (e: React.FormEvent) => {
    e.preventDefault();
    const trainer = trainers.find(t => t.name === newSessInstructor);

    addSpinningSession({
      title: newSessTitle,
      instructorId: trainer?.id || 'trainer-1',
      instructorName: newSessInstructor,
      instructorPhoto: trainer?.photoUrl,
      date: newSessDate,
      startTime: newSessStartTime,
      endTime: newSessEndTime,
      durationMinutes: Number(newSessDuration),
      intensity: newSessIntensity,
      playlistGenre: newSessGenre,
      maxCapacity: 24,
      roomName: 'Studio Spinning Acústico - Piso 2',
      externalSessionPrice: Number(newSessPrice)
    });

    confetti({ particleCount: 30, spread: 50, origin: { y: 0.5 } });
    setIsNewSessionModalOpen(false);
  };

  // WhatsApp Ticket Sender
  const handleShareTicketWhatsApp = (res: SpinningReservation) => {
    let cleanPhone = res.memberPhone ? res.memberPhone.replace(/[^0-9]/g, '') : '';
    if (cleanPhone.length === 9 && !cleanPhone.startsWith('51')) {
      cleanPhone = '51' + cleanPhone;
    }

    let msg = `🚴 *PASE DE RESERVA - SALÓN DE SPINNING GYMCONTROL*\n`;
    msg += `¡Hola ${res.memberName.split(' ')[0]}!\n\n`;
    msg += `Tu bicicleta ha sido reservada con éxito:\n`;
    msg += `🎟️ *BICICLETA ASIGNADA: #${res.bikeNumber}*\n`;
    msg += `🔥 *Clase:* ${currentSession?.title || 'Clase de Spinning'}\n`;
    msg += `⏰ *Horario:* ${currentSession?.startTime} - ${currentSession?.endTime} (${currentSession?.date})\n`;
    msg += `👨‍🏫 *Instructor:* ${currentSession?.instructorName}\n`;
    msg += `📍 *Ubicación:* ${currentSession?.roomName}\n`;
    msg += `👟 *Calzado Requerido:* ${res.shoesRequirement === 'calas_spd' ? 'Pedal con Calas SPD' : 'Zapatilla deportiva convencional'}\n`;
    if (res.isExternalGuest) {
      msg += `💰 *Pase Visitante Pagado:* S/. ${res.paidAmount?.toFixed(2)} (${res.paymentMethod}) - Recibo: ${res.receiptNumber}\n`;
    }
    msg += `\n*Recomendaciones:* Llegar 10 minutos antes para ajustar sillín y manillar. Traer toalla de mano y botella de hidratación. 💧\n`;
    msg += `¡Nos vemos pedaleando en la sala! ⚡`;

    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // Code Validation Preview
  const matchedAccessCode = useMemo(() => {
    if (!redeemCodeInput.trim()) return null;
    const clean = redeemCodeInput.trim().toUpperCase();
    return spinningAccessCodes.find(c => c.code.toUpperCase() === clean) || null;
  }, [spinningAccessCodes, redeemCodeInput]);

  // Handle Redeem Access Code
  const handleRedeemAccessCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemCodeInput.trim()) {
      alert('Ingresa el código único proporcionado por tu entrenador o recepción.');
      return;
    }

    const studentName = redeemStudentName.trim() || (currentUser?.role === 'student' ? currentUser.fullName : matchedAccessCode?.issuedToName || 'Alumno');
    const studentPhone = redeemStudentPhone.trim() || currentUser?.phone || matchedAccessCode?.issuedToPhone;

    const result = redeemSpinningAccessCode(
      redeemCodeInput,
      Number(redeemSelectedBike),
      studentName,
      studentPhone
    );

    if (result.success && result.reservation) {
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 } });
      setIsRedeemModalOpen(false);
      setViewTicketReservation(result.reservation);
      setRedeemCodeInput('');
    } else {
      alert(result.message);
    }
  };

  // Handle Generate Code (Instructor / Reception)
  const handleGenerateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!genClientName.trim()) {
      alert('Ingresa el nombre del alumno o cliente.');
      return;
    }

    const targetSession = spinningSessions.find(s => s.id === genSessionId);

    const generated = generateSpinningAccessCode({
      sessionId: targetSession ? targetSession.id : undefined,
      sessionTitle: targetSession ? targetSession.title : undefined,
      issuedToName: genClientName.trim(),
      issuedToPhone: genClientPhone.trim() || undefined,
      isExternal: !members.some(m => m.fullName.toLowerCase() === genClientName.trim().toLowerCase()),
      amountPaid: Number(genAmount),
      paymentMethod: 'yape_plin',
      issuedByTrainerName: currentUser?.fullName || 'Carlos Mendoza',
      notes: genNotes.trim()
    });

    setGeneratedSuccessCode(generated);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
  };

  // WhatsApp sender for generated code
  const handleSendCodeWhatsApp = (codeItem: SpinningAccessCode) => {
    let cleanPhone = codeItem.issuedToPhone ? codeItem.issuedToPhone.replace(/[^0-9]/g, '') : '';
    if (cleanPhone.length === 9 && !cleanPhone.startsWith('51')) {
      cleanPhone = '51' + cleanPhone;
    }

    let msg = `🚴 *TU CÓDIGO ÚNICO DE RESERVA - SALÓN DE SPINNING*\n`;
    msg += `¡Hola ${codeItem.issuedToName.split(' ')[0]}!\n\n`;
    msg += `Confirmamos la recepción de tu pago por Yape (S/. ${codeItem.amountPaid.toFixed(2)}) ✅.\n\n`;
    msg += `🔑 *TU CÓDIGO ÚNICO ES:* *${codeItem.code}*\n`;
    if (codeItem.sessionTitle) {
      msg += `🔥 *Clase:* ${codeItem.sessionTitle}\n`;
    }
    msg += `\n*PASOS PARA RESERVAR TU BICICLETA EN EL CROQUIS:*\n`;
    msg += `1. Abre la aplicación de IronCore Gym e inicia sesión como alumno.\n`;
    msg += `2. Dirígete a la sección *"Salón de Spinning"* y haz clic en *"Canjear Código Único"*.\n`;
    msg += `3. Ingresa tu código *${codeItem.code}*, elige tu número de bicicleta en el croquis tipo cine ¡y confirma tu sitio sin salir de casa!\n\n`;
    msg += `¡Nos vemos pedaleando en la sala! ⚡💪`;

    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Fast Actions */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow-sm">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Salón de Spinning & Reservas
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 flex items-center space-x-1">
                  <Radio className="w-3 h-3 animate-pulse text-rose-600" />
                  <span>En Vivo</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Croquis interactivo estilo sala de cine con número de bicicleta, acceso por código único Yape y reserva remota.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Yape Redeem + Yape Pay + Instructor Codes + External Guest + Member Booking + New Session */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
          
          {/* BOTÓN DESTACADO: CANJEAR CÓDIGO ÚNICO (YAPE / REMOTO) */}
          <button
            onClick={() => {
              const freeBike = spinningBikes.find(b => !sessionReservations.some(r => r.bikeNumber === b.bikeNumber));
              if (freeBike) setRedeemSelectedBike(freeBike.bikeNumber);
              setIsRedeemModalOpen(true);
            }}
            className="flex items-center space-x-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Key className="w-4 h-4" />
            <span>🎟️ Canjear Código Yape</span>
          </button>

          {/* BOTÓN: PAGAR CON YAPE & PEDIR CÓDIGO */}
          <button
            onClick={() => setIsYapeInstructionsModalOpen(true)}
            className="flex items-center space-x-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-purple-600" />
            <span>📲 Pagar con Yape</span>
          </button>

          {/* BOTÓN INSTRUCTOR: GESTIONAR O EMITIR CÓDIGOS */}
          <button
            onClick={() => {
              setGenClientName('');
              setGenClientPhone('');
              setGenSessionId(currentSession?.id || '');
              setGeneratedSuccessCode(null);
              setIsGenerateCodeModalOpen(true);
            }}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
            title="Panel de instructor para confirmar comprobantes Yape y generar códigos"
          >
            <ShieldCheck className="w-4 h-4 text-slate-600" />
            <span>Emitir Código (Coach)</span>
          </button>

          {/* BOTÓN VISITANTES EXTERNOS */}
          <button
            onClick={() => handleOpenExternalGuestModal()}
            className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
          >
            <Ticket className="w-4 h-4" />
            <span>Pase en Caja</span>
          </button>

          <button
            onClick={() => {
              setMemberBookingStudentId(members[0]?.id || '');
              const freeBike = spinningBikes.find(b => !sessionReservations.some(r => r.bikeNumber === b.bikeNumber));
              if (freeBike) setMemberBookingBikeNumber(freeBike.bikeNumber);
              setIsMemberBookingModalOpen(true);
            }}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            title="Reserva directa alumno presencial"
          >
            <Users className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsNewSessionModalOpen(true)}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            title="Crear Nueva Sesión de Spinning"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* YAPE REMOTE BOOKING INFORMATIONAL BANNER */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg border border-blue-800/40">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <Key className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <h3 className="font-black text-sm sm:text-base text-white flex items-center space-x-2">
              <span>¿Pagaste tu sesión por Yape al Instructor?</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-yellow-400 text-slate-950">
                Pase Digital
              </span>
            </h3>
            <p className="text-xs text-blue-200 font-medium">
              Al confirmar tu pago, tu coach te entrega un <strong>código único</strong> (ej. <code className="bg-black/30 px-1 py-0.5 rounded text-yellow-300">YAPE-8421</code>). Canjéalo aquí para apartar tu número de bicicleta en el croquis desde tu celular sin tener que estar en el local.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => {
              const freeBike = spinningBikes.find(b => !sessionReservations.some(r => r.bikeNumber === b.bikeNumber));
              if (freeBike) setRedeemSelectedBike(freeBike.bikeNumber);
              setIsRedeemModalOpen(true);
            }}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <span>Canjear mi Código</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsCodesManagerOpen(true)}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Ver Códigos Emitidos ({spinningAccessCodes.length})
          </button>
        </div>
      </div>

      {/* Session Selector Strip & Capacity Gauge */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        
        {/* Sessions Horizontal Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 shrink-0">Sesiones Programadas:</span>
          {spinningSessions.map(session => {
            const isSelected = session.id === currentSession?.id;
            return (
              <button
                key={session.id}
                onClick={() => setSelectedSessionId(session.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-2 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>{session.startTime} - {session.title.split(' ')[1]}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full border ${INTENSITY_COLORS[session.intensity]}`}>
                  {session.intensity}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Session Info Banner */}
        {currentSession && (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 text-white">
            <div className="flex items-center space-x-3">
              {currentSession.instructorPhoto ? (
                <img
                  src={currentSession.instructorPhoto}
                  alt={currentSession.instructorName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                  COACH
                </div>
              )}
              <div>
                <div className="flex items-center space-x-2 mb-0.5">
                  <span className="text-xs text-blue-400 font-bold flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{currentSession.startTime} - {currentSession.endTime} ({currentSession.durationMinutes} min)</span>
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-300">{currentSession.date}</span>
                </div>
                <h3 className="text-base font-black text-white">
                  {currentSession.title}
                </h3>
                <p className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                  <span>Coach: <strong className="text-white">{currentSession.instructorName}</strong></span>
                  <span>•</span>
                  <span className="flex items-center space-x-1 text-slate-300">
                    <Music className="w-3 h-3 text-cyan-400" />
                    <span>{currentSession.playlistGenre}</span>
                  </span>
                </p>
              </div>
            </div>

            {/* Capacity gauge */}
            <div className="w-full md:w-64 bg-slate-800 p-3 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Ocupación de Sala:</span>
                <span className="font-black text-white">{capacityStats.reserved} / {capacityStats.total} bicis ({capacityStats.pct}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    capacityStats.pct > 85 ? 'bg-rose-500' : capacityStats.pct > 50 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${capacityStats.pct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                <span>{capacityStats.available} disponibles</span>
                {capacityStats.externalCount > 0 && (
                  <span className="text-amber-400 font-bold">{capacityStats.externalCount} visitantes externos</span>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* CINEMA-STYLE INTERACTIVE SEAT CROQUIS / SALÓN DE SPINNING */}
      <div className="bg-slate-950 rounded-3xl p-5 sm:p-8 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/10 blur-3xl pointer-events-none" />

        {/* Stage / Coach Screen Front */}
        <div className="max-w-2xl mx-auto mb-10 text-center space-y-3">
          
          {/* Cinema Screen / Metric Projection Bar */}
          <div className="relative">
            <div className="h-2 bg-linear-to-r from-blue-600 via-cyan-400 to-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.6)]" />
            <span className="inline-block mt-2 text-[10px] font-black uppercase tracking-widest text-cyan-300/80">
              PANTALLA DE PROYECCIÓN DE SALA & MÉTRICAS RPM
            </span>
          </div>

          {/* Coach Stage Pod */}
          <div className="inline-flex items-center justify-center p-3 px-6 rounded-2xl bg-linear-to-b from-slate-800 to-slate-900 border border-cyan-500/40 shadow-lg space-x-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <Bike className="w-4 h-4 animate-bounce" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-extrabold uppercase text-cyan-400 tracking-wider block">
                TARIMA PRINCIPAL DEL COACH
              </span>
              <p className="text-xs font-black text-white">
                Bici #00 · {currentSession?.instructorName || 'Coach'}
              </p>
            </div>
            <Volume2 className="w-4 h-4 text-slate-400" />
            <Fan className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-8 text-xs font-semibold text-slate-300">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-md bg-slate-800 border border-slate-600" />
            <span>Disponible</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-md bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
            <span>Socio Gym (Confirmado)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-md bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            <span>Check-in (En Sala)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-md bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.6)]" />
            <span>Visitante Externo (Pagado)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-md bg-slate-700 border border-slate-600" />
            <span>Mantenimiento</span>
          </div>
        </div>

        {/* Croquis Grid (4 Rows x 6 Cols) with Realistic Cinema Perspective */}
        <div className="max-w-4xl mx-auto space-y-6">
          
          {[1, 2, 3, 4].map(rowIndex => {
            const rowBikes = spinningBikes.filter(b => b.row === rowIndex);
            const rowLabels: Record<number, { name: string; desc: string }> = {
              1: { name: 'Fila A (Frontal)', desc: 'Sensación intensa al frente del coach' },
              2: { name: 'Fila B (Media Frontal)', desc: 'Zona central equilibrada' },
              3: { name: 'Fila C (Media Trasera)', desc: 'Excelente visibilidad' },
              4: { name: 'Fila D (Elevada)', desc: 'Tarima elevada con vista panorámica' }
            };

            return (
              <div key={rowIndex} className="space-y-2">
                
                {/* Row Header Indicator */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-2">
                  <span className="font-extrabold uppercase text-slate-300">
                    {rowLabels[rowIndex].name}
                  </span>
                  <span className="text-[10px] text-slate-500 hidden sm:inline">
                    {rowLabels[rowIndex].desc}
                  </span>
                </div>

                {/* Bikes in this row */}
                <div className="grid grid-cols-6 gap-2 sm:gap-3.5">
                  {rowBikes.map(bike => {
                    const info = bikeStatusMap.get(bike.bikeNumber);
                    const status = info?.status || 'available';
                    const res = info?.reservation;

                    let bgStyle = 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700';
                    let badgeLabel = 'LIBRE';
                    let badgeColor = 'bg-slate-700 text-slate-300';

                    if (status === 'reserved') {
                      bgStyle = 'bg-blue-600 text-white border-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.4)]';
                      badgeLabel = 'SOCIO';
                      badgeColor = 'bg-blue-800 text-blue-200';
                    } else if (status === 'checked_in') {
                      bgStyle = 'bg-amber-500 text-white border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]';
                      badgeLabel = 'CHECK-IN';
                      badgeColor = 'bg-amber-700 text-amber-100';
                    } else if (status === 'external') {
                      bgStyle = 'bg-purple-600 text-white border-purple-400 shadow-[0_0_12px_rgba(147,51,234,0.5)]';
                      badgeLabel = 'EXTERNO';
                      badgeColor = 'bg-purple-800 text-purple-200';
                    } else if (status === 'maintenance') {
                      bgStyle = 'bg-slate-700/50 text-slate-500 border-slate-700 opacity-60';
                      badgeLabel = 'TÉCNICO';
                      badgeColor = 'bg-slate-800 text-slate-400';
                    }

                    return (
                      <button
                        key={bike.id}
                        type="button"
                        onClick={() => handleBikeClick(bike.bikeNumber)}
                        className={`p-2.5 sm:p-3.5 rounded-2xl flex flex-col items-center justify-between min-h-[96px] sm:min-h-[110px] transition-all cursor-pointer transform hover:scale-105 active:scale-95 group relative ${bgStyle}`}
                      >
                        {/* Status pill */}
                        <span className={`text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${badgeColor}`}>
                          {badgeLabel}
                        </span>

                        {/* Bike Icon & Number */}
                        <div className="flex flex-col items-center my-1">
                          <Bike className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5 group-hover:animate-pulse" />
                          <span className="text-xs sm:text-sm font-black tracking-tight">
                            #{bike.bikeNumber.toString().padStart(2, '0')}
                          </span>
                        </div>

                        {/* Occupant Name or Call to Action */}
                        <div className="w-full text-center truncate">
                          {res ? (
                            <span className="text-[10px] sm:text-[11px] font-bold block truncate">
                              {res.memberName.split(' ')[0]}
                            </span>
                          ) : (
                            <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 block group-hover:text-cyan-300">
                              Reservar
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

              </div>
            );
          })}

        </div>

        {/* Room Atmosphere Footer */}
        <div className="max-w-4xl mx-auto mt-8 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Footprints className="w-4 h-4 text-slate-500" />
            <span>Pasillo central y accesos iluminados con señalización LED</span>
          </div>
          <div className="flex items-center space-x-2 text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Bicicletas Keiser M3i con calibración magnética</span>
          </div>
        </div>

      </div>

      {/* RESERVATIONS LOG & ATTENDANCE MANAGEMENT TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Lista de Asistencia & Reservas de la Sesión</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                {sessionReservations.length} inscritos
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Control de acceso para socios del gym y cobro comprobado para visitantes externos.
            </p>
          </div>
        </div>

        {sessionReservations.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
            Aún no hay reservas registradas para esta sesión. Haz clic en cualquier bicicleta disponible en el croquis o utiliza los botones de reserva superior.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Bici #</th>
                  <th className="py-2.5 px-3">Alumno / Visitante</th>
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3">Calzado</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3">Pago / Recibo</th>
                  <th className="py-2.5 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessionReservations.map(res => (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-black text-slate-900">
                      #{res.bikeNumber.toString().padStart(2, '0')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-900 block">{res.memberName}</span>
                      <span className="text-[11px] text-slate-500">{res.memberPhone || 'Sin teléfono'}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      {res.isExternalGuest ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                          Visitante Externo
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          Socio Gym
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {res.shoesRequirement === 'calas_spd' ? 'Calas SPD' : 'Zapatillas Normales'}
                    </td>
                    <td className="py-2.5 px-3">
                      {res.status === 'checked_in' ? (
                        <span className="flex items-center space-x-1 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>En Sala ({res.checkInTime?.split(' ')[1] || 'OK'})</span>
                        </span>
                      ) : (
                        <span className="text-slate-600 font-medium">Confirmada</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {res.isExternalGuest ? (
                        <div>
                          <strong className="text-emerald-700 font-bold">S/. {res.paidAmount?.toFixed(2)}</strong>
                          <span className="block text-[10px] text-slate-400">{res.paymentMethod} · {res.receiptNumber}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Incluido en Membresía</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {res.status !== 'checked_in' && (
                          <button
                            onClick={() => checkInSpinningReservation(res.id)}
                            className="px-2 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Check-in
                          </button>
                        )}
                        <button
                          onClick={() => setViewTicketReservation(res)}
                          className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                          title="Ver Ticket Digital"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleShareTicketWhatsApp(res)}
                          className="p-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 cursor-pointer"
                          title="Enviar por WhatsApp"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Cancelar la reserva de ${res.memberName} en la bici #${res.bikeNumber}?`)) {
                              cancelSpinningReservation(res.id);
                            }
                          }}
                          className="p-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                          title="Cancelar Reserva"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: EXTERNAL GUEST FAST CHECKOUT & RESERVATION */}
      {isExternalGuestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header with Ticket Style */}
            <div className="p-5 bg-linear-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base">
                    Pase de Sesión Spinning (Visitante Externo)
                  </h3>
                  <p className="text-xs text-amber-100">
                    Cobro inmediato en caja / POS y asignación de bicicleta.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExternalGuestModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitExternalGuest} className="p-5 space-y-4">
              
              {/* Bike & Price Pill */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">Bicicleta Asignada:</span>
                  <select
                    value={extGuestBikeNumber}
                    onChange={(e) => setExtGuestBikeNumber(Number(e.target.value))}
                    className="bg-white border border-amber-300 rounded-md px-2 py-1 text-xs font-black text-slate-900 mt-0.5"
                  >
                    {spinningBikes.map(b => {
                      const isOccupied = sessionReservations.some(r => r.bikeNumber === b.bikeNumber);
                      return (
                        <option key={b.id} value={b.bikeNumber} disabled={isOccupied}>
                          Bici #{b.bikeNumber} {isOccupied ? '(Ocupada)' : '(Disponible)'}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">Tarifa Pase Sesión:</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-slate-600">S/.</span>
                    <input
                      type="number"
                      step="1"
                      required
                      value={extGuestPrice}
                      onChange={(e) => setExtGuestPrice(Number(e.target.value))}
                      className="w-16 bg-white border border-amber-300 rounded-md px-2 py-1 text-sm font-black text-slate-900 text-right"
                    />
                  </div>
                </div>
              </div>

              {/* Guest Details */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo del Visitante *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez Delgado"
                  value={extGuestName}
                  onChange={(e) => setExtGuestName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="+51 987 654 321"
                    value={extGuestPhone}
                    onChange={(e) => setExtGuestPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email (opcional)</label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={extGuestEmail}
                    onChange={(e) => setExtGuestEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Método de Pago *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'yape_plin', label: 'Yape / Plin' },
                    { id: 'tarjeta', label: 'Tarjeta' },
                    { id: 'efectivo', label: 'Efectivo' }
                  ].map(pm => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setExtGuestPaymentMethod(pm.id as PaymentMethod)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        extGuestPaymentMethod === pm.id 
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs' 
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shoes Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Calzado</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setExtGuestShoes('zapatilla_comun')}
                    className={`py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      extGuestShoes === 'zapatilla_comun' 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    👟 Zapatilla Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => setExtGuestShoes('calas_spd')}
                    className={`py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      extGuestShoes === 'calas_spd' 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    🚴 Calas SPD de Ciclismo
                  </button>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsExternalGuestModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Cobrar S/. {extGuestPrice.toFixed(2)} y Confirmar Bici #{extGuestBikeNumber}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: GYM MEMBER BOOKING MODAL */}
      {isMemberBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-5 bg-blue-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Reservar Bici para Socio Gym</h3>
                  <p className="text-xs text-blue-100">Bicicleta #{memberBookingBikeNumber} asignada</p>
                </div>
              </div>
              <button
                onClick={() => setIsMemberBookingModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitMemberBooking} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Seleccionar Alumno Activo *</label>
                <select
                  required
                  value={memberBookingStudentId}
                  onChange={(e) => setMemberBookingStudentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value="">-- Seleccionar Socio --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} (DNI: {m.dni}) - {m.planName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Número de Bicicleta</label>
                <select
                  value={memberBookingBikeNumber}
                  onChange={(e) => setMemberBookingBikeNumber(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900"
                >
                  {spinningBikes.map(b => {
                    const isOccupied = sessionReservations.some(r => r.bikeNumber === b.bikeNumber);
                    return (
                      <option key={b.id} value={b.bikeNumber} disabled={isOccupied}>
                        Bicicleta #{b.bikeNumber} {isOccupied ? '(Ocupada)' : '(Libre)'}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Calzado del Alumno</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMemberBookingShoes('zapatilla_comun')}
                    className={`py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      memberBookingShoes === 'zapatilla_comun' 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    👟 Zapatilla Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => setMemberBookingShoes('calas_spd')}
                    className={`py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      memberBookingShoes === 'calas_spd' 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    🚴 Calas SPD
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notas especiales (opcional)</label>
                <input
                  type="text"
                  placeholder="Preferencia altura sillín, toalla..."
                  value={memberBookingNotes}
                  onChange={(e) => setMemberBookingNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsMemberBookingModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Confirmar Reserva Bici #{memberBookingBikeNumber}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 3: TICKET / BOARDING PASS VIEW */}
      {viewTicketReservation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Ticket Top */}
            <div className="bg-slate-900 p-5 text-white text-center relative">
              <button
                onClick={() => setViewTicketReservation(null)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center mx-auto mb-2 shadow-md">
                <Bike className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                PASE OFICIAL DE SALA
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                {currentSession?.title}
              </h3>
              <p className="text-xs text-slate-400">
                {currentSession?.date} · {currentSession?.startTime}
              </p>
            </div>

            {/* Big Bike Number Badge */}
            <div className="py-6 px-5 text-center bg-linear-to-b from-slate-50 to-white border-b border-dashed border-slate-300 relative">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                TU BICICLETA RESERVADA:
              </span>
              <div className="text-5xl font-black text-slate-900 tracking-tight my-1">
                #{viewTicketReservation.bikeNumber.toString().padStart(2, '0')}
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                {viewTicketReservation.memberName}
              </span>
            </div>

            {/* Ticket Details */}
            <div className="p-5 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Instructor:</span>
                <strong className="text-slate-800">{currentSession?.instructorName}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Ubicación:</span>
                <strong className="text-slate-800">Studio Spinning Piso 2</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Modalidad:</span>
                <span className="font-semibold text-slate-800">
                  {viewTicketReservation.isExternalGuest ? '🎟️ Visitante Externo' : 'Socio Activo Gym'}
                </span>
              </div>

              {viewTicketReservation.receiptNumber && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Comprobante Pago:</span>
                  <strong className="text-emerald-700">{viewTicketReservation.receiptNumber} (S/. {viewTicketReservation.paidAmount?.toFixed(2)})</strong>
                </div>
              )}

              {/* Mock QR */}
              <div className="pt-2 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-slate-100 border border-slate-300 rounded-xl p-2 flex items-center justify-center">
                  <QrCode className="w-20 h-20 text-slate-800" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-1">
                  ID: {viewTicketReservation.id}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center space-x-2">
              <button
                onClick={() => handleShareTicketWhatsApp(viewTicketReservation)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Enviar WhatsApp</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 4: CREATE NEW SPINNING SESSION */}
      {isNewSessionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">Crear Nueva Clase de Spinning</h3>
              <button
                onClick={() => setIsNewSessionModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewSession} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título de la Sesión</label>
                <input
                  type="text"
                  required
                  value={newSessTitle}
                  onChange={(e) => setNewSessTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Instructor</label>
                  <select
                    value={newSessInstructor}
                    onChange={(e) => setNewSessInstructor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium"
                  >
                    {trainers.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={newSessDate}
                    onChange={(e) => setNewSessDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hora Inicio</label>
                  <input
                    type="text"
                    value={newSessStartTime}
                    onChange={(e) => setNewSessStartTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hora Fin</label>
                  <input
                    type="text"
                    value={newSessEndTime}
                    onChange={(e) => setNewSessEndTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Intensidad</label>
                  <select
                    value={newSessIntensity}
                    onChange={(e) => setNewSessIntensity(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium"
                  >
                    <option value="moderada">Moderada</option>
                    <option value="alta">Alta</option>
                    <option value="extrema">Extrema</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Precio Pase Externo (S/.)</label>
                  <input
                    type="number"
                    value={newSessPrice}
                    onChange={(e) => setNewSessPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Estilo Musical / Playlist</label>
                <input
                  type="text"
                  value={newSessGenre}
                  onChange={(e) => setNewSessGenre(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsNewSessionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Publicar Clase
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 5: CANJEAR CÓDIGO ÚNICO (YAPE / ALUMNO REMOTO) */}
      {isRedeemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-linear-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Key className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <h3 className="font-black text-base">Canjear Código Único de Spinning</h3>
                  <p className="text-xs text-blue-100">Reserva tu bicicleta con tu código Yape o de recepción</p>
                </div>
              </div>
              <button
                onClick={() => setIsRedeemModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRedeemAccessCode} className="p-5 sm:p-6 space-y-4 text-xs">
              
              {/* Code Input & Live Verification */}
              <div>
                <label className="block font-black text-slate-800 uppercase tracking-wider mb-1">
                  Ingresa tu Código Único (ej: YAPE-8421, SPIN-9315) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Escribe tu código aquí..."
                    value={redeemCodeInput}
                    onChange={(e) => setRedeemCodeInput(e.target.value.toUpperCase())}
                    className="w-full bg-slate-50 border-2 border-blue-400 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-sm font-black tracking-wider text-slate-900 uppercase focus:outline-hidden"
                  />
                  {matchedAccessCode && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{matchedAccessCode.status === 'active' ? 'Válido' : matchedAccessCode.status === 'redeemed' ? 'Ya canjeado' : 'Expirado'}</span>
                    </span>
                  )}
                </div>

                {/* Live Code Details Card */}
                {matchedAccessCode ? (
                  <div className={`mt-2.5 p-3 rounded-xl border text-xs ${
                    matchedAccessCode.status === 'active' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}>
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span>Pase: {matchedAccessCode.code}</span>
                      <span>S/. {matchedAccessCode.amountPaid.toFixed(2)} ({matchedAccessCode.paymentMethod})</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Emitido a: <strong>{matchedAccessCode.issuedToName}</strong> por {matchedAccessCode.issuedByTrainerName}
                    </p>
                    {matchedAccessCode.sessionTitle && (
                      <p className="text-[11px] font-semibold text-blue-700 mt-0.5">
                        Clase asignada: {matchedAccessCode.sessionTitle}
                      </p>
                    )}
                  </div>
                ) : redeemCodeInput.length >= 4 ? (
                  <p className="text-[11px] text-amber-600 mt-1.5 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Verificando código... asegúrate de ingresarlo tal como te lo envió tu coach.</span>
                  </p>
                ) : null}
              </div>

              {/* Student Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tu Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Rodrigo Vargas"
                    value={redeemStudentName}
                    onChange={(e) => setRedeemStudentName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tu Celular (WhatsApp)</label>
                  <input
                    type="text"
                    placeholder="+51 987 654 321"
                    value={redeemStudentPhone}
                    onChange={(e) => setRedeemStudentPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium"
                  />
                </div>
              </div>

              {/* Bike Selector & Availability */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Elige tu Bicicleta en la Sala (1 a 24):
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                  {spinningBikes.map(b => {
                    const isOccupied = sessionReservations.some(r => r.bikeNumber === b.bikeNumber);
                    const isSelected = redeemSelectedBike === b.bikeNumber;

                    return (
                      <button
                        type="button"
                        key={b.id}
                        disabled={isOccupied}
                        onClick={() => setRedeemSelectedBike(b.bikeNumber)}
                        className={`p-2 rounded-lg font-black text-xs transition-all flex flex-col items-center justify-center cursor-pointer ${
                          isOccupied
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600 scale-105'
                            : 'bg-white text-slate-800 border border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        <Bike className="w-3.5 h-3.5 mb-0.5" />
                        <span>#{b.bikeNumber}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Has seleccionado la <strong className="text-blue-600">Bicicleta #{redeemSelectedBike}</strong>. Las tachadas ya fueron reservadas por otros alumnos.
                </p>
              </div>

              {/* Shoes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tipo de Calzado:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRedeemShoes('zapatilla_comun')}
                    className={`p-2 rounded-lg border font-bold text-xs cursor-pointer ${
                      redeemShoes === 'zapatilla_comun' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    👟 Zapatilla Convencional
                  </button>
                  <button
                    type="button"
                    onClick={() => setRedeemShoes('calas_spd')}
                    className={`p-2 rounded-lg border font-bold text-xs cursor-pointer ${
                      redeemShoes === 'calas_spd' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    🚴 Zapatillas con Calas SPD
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsRedeemModalOpen(false);
                    setIsYapeInstructionsModalOpen(true);
                  }}
                  className="text-purple-600 hover:text-purple-800 font-bold text-xs flex items-center space-x-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>¿No tienes código? Pagar por Yape</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsRedeemModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-sm transition-colors cursor-pointer flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar mi Reserva</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: GENERADOR DE CÓDIGOS (INSTRUCTOR / RECEPCIÓN) */}
      {isGenerateCodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-base">Generar Código Único de Pase (Yape)</h3>
                  <p className="text-xs text-slate-300">Para instructores tras verificar pantallazo de pago</p>
                </div>
              </div>
              <button
                onClick={() => setIsGenerateCodeModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs">
              {generatedSuccessCode ? (
                <div className="space-y-4 text-center py-2 animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Código Único Generado con Éxito</span>
                    <div className="mt-1 p-3 bg-slate-100 border-2 border-dashed border-blue-400 rounded-xl flex items-center justify-center space-x-3">
                      <span className="font-black text-2xl tracking-widest text-blue-900 font-mono">
                        {generatedSuccessCode.code}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedSuccessCode.code);
                          setCopyCodeFeedback(generatedSuccessCode.code);
                          setTimeout(() => setCopyCodeFeedback(null), 2000);
                        }}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                        title="Copiar código"
                      >
                        {copyCodeFeedback === generatedSuccessCode.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs">
                    El alumno <strong>{generatedSuccessCode.issuedToName}</strong> puede usar este código para reservar cualquier asiento desde la web o celular.
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                    <button
                      onClick={() => handleSendCodeWhatsApp(generatedSuccessCode)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Enviar Código por WhatsApp al Alumno</span>
                    </button>
                    <button
                      onClick={() => setGeneratedSuccessCode(null)}
                      className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                    >
                      Generar Otro Código
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleGenerateCode} className="space-y-3.5">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs">
                    💡 <strong>Instrucciones para el Instructor:</strong> Cuando un alumno o visitante te mande la captura del Yape por WhatsApp, completa este formulario para darle su código exclusivo de reserva de asiento.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nombre del Alumno / Cliente *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Rodrigo Vargas"
                        value={genClientName}
                        onChange={(e) => setGenClientName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Celular WhatsApp *</label>
                      <input
                        type="text"
                        placeholder="+51 987 654 321"
                        value={genClientPhone}
                        onChange={(e) => setGenClientPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Sesión Programada (Opcional):</label>
                      <select
                        value={genSessionId}
                        onChange={(e) => setGenSessionId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium"
                      >
                        <option value="">-- Válido para cualquier sesión --</option>
                        {spinningSessions.map(s => (
                          <option key={s.id} value={s.id}>{s.startTime} - {s.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Monto Pagado (S/.) *</label>
                      <input
                        type="number"
                        required
                        value={genAmount}
                        onChange={(e) => setGenAmount(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nota del Comprobante / Nro. Operación Yape</label>
                    <input
                      type="text"
                      value={genNotes}
                      onChange={(e) => setGenNotes(e.target.value)}
                      placeholder="Ej. Operación #981247. Captura recibida por WhatsApp."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsGenerateCodeModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Cerrar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-xs cursor-pointer flex items-center space-x-1.5"
                    >
                      <Key className="w-4 h-4 text-yellow-300" />
                      <span>Generar Código Único</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: GESTOR DE CÓDIGOS EMITIDOS (HISTORIAL) */}
      {isCodesManagerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Key className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Registro de Códigos Únicos Emitidos</h3>
                  <p className="text-xs text-slate-500">Historial de accesos por Yape y pases remotos</p>
                </div>
              </div>
              <button
                onClick={() => setIsCodesManagerOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Total códigos: {spinningAccessCodes.length}</span>
                <button
                  onClick={() => {
                    setIsCodesManagerOpen(false);
                    setIsGenerateCodeModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuevo Código</span>
                </button>
              </div>

              <div className="overflow-x-auto max-h-96 border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold text-[11px]">
                      <th className="p-3">Código</th>
                      <th className="p-3">Alumno / Cliente</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3">Sesión / Bici</th>
                      <th className="p-3">Emitido</th>
                      <th className="p-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {spinningAccessCodes.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-black text-blue-700">
                          {c.code}
                        </td>
                        <td className="p-3 font-bold text-slate-900">
                          {c.issuedToName}
                          {c.issuedToPhone && <span className="block text-[10px] text-slate-400">{c.issuedToPhone}</span>}
                        </td>
                        <td className="p-3">
                          {c.status === 'active' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                              Disponible
                            </span>
                          ) : c.status === 'redeemed' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700">
                              Canjeado
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800">
                              Expirado
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-600">
                          {c.redeemedBikeNumber ? (
                            <strong className="text-emerald-700">Bici #{c.redeemedBikeNumber}</strong>
                          ) : (
                            c.sessionTitle || 'Cualquier sesión'
                          )}
                        </td>
                        <td className="p-3 text-[11px] text-slate-400">
                          {c.issuedAt}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleSendCodeWhatsApp(c)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold transition-colors cursor-pointer"
                            title="Enviar instrucciones por WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: PAGAR CON YAPE & PEDIR CÓDIGO */}
      {isYapeInstructionsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-purple-700 text-white">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-base">Pagar Sesión por Yape</h3>
                  <p className="text-xs text-purple-100">Obtén tu código único para reservar tu bicicleta</p>
                </div>
              </div>
              <button
                onClick={() => setIsYapeInstructionsModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs text-center">
              
              {/* QR Code and Phone Details */}
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
                <div className="w-36 h-36 bg-white border-2 border-purple-300 rounded-xl mx-auto p-2 flex items-center justify-center shadow-xs">
                  <QrCode className="w-32 h-32 text-purple-900" />
                </div>
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Número Yape / Plin:</span>
                  <h4 className="font-black text-lg text-purple-950 font-mono tracking-wider">
                    987 654 321
                  </h4>
                  <p className="text-xs font-semibold text-slate-600">
                    A nombre de: <strong>Carlos Mendoza (Instructor Spinning)</strong>
                  </p>
                  <p className="text-xs font-bold text-purple-700 mt-1">
                    Monto por sesión individual: S/. 20.00
                  </p>
                </div>
              </div>

              {/* 4 Steps Guide */}
              <div className="text-left space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                <p className="font-black text-slate-900 text-xs mb-1">
                  📋 Pasos para reservar sin estar en el local:
                </p>
                <p>1️⃣ Realiza el Yape de <strong>S/. 20.00</strong> al número indicado.</p>
                <p>2️⃣ Toma una captura de pantalla (pantallazo) del Yape.</p>
                <p>3️⃣ Envíale la captura a tu entrenador por WhatsApp.</p>
                <p>4️⃣ Tu entrenador te dará un <strong>Código Único</strong> (ej. <code>YAPE-8421</code>).</p>
                <p>5️⃣ Inicia sesión en la app, ingresa tu código y ¡reserva tu bicicleta en el croquis!</p>
              </div>

              {/* Button WhatsApp */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    const msg = `Hola Coach Carlos, quiero reservar un asiento para la clase de Spinning en IronCore Gym. Ya realicé mi Yape de S/. 20, te adjunto el pantallazo para que me brindes mi CÓDIGO ÚNICO de reserva por favor. 🚴⚡`;
                    window.open(`https://wa.me/51987654321?text=${encodeURIComponent(msg)}`, '_blank');
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Pantallazo de Yape por WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    setIsYapeInstructionsModalOpen(false);
                    setIsRedeemModalOpen(true);
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl cursor-pointer"
                >
                  Ya tengo mi código → Canjear ahora
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

