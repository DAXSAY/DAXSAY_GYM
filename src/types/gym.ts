export type MembershipStatus = 'active' | 'expiring_soon' | 'expired' | 'frozen';

export type MuscleGroup = 
  | 'pecho' 
  | 'espalda' 
  | 'cuadriceps' 
  | 'isquiotibiales_gluteos' 
  | 'hombros' 
  | 'biceps' 
  | 'triceps' 
  | 'core_abdomen' 
  | 'cardio_funcional';

export type FitnessObjective = 
  | 'hipertrofia' 
  | 'perdida_peso' 
  | 'fuerza' 
  | 'resistencia' 
  | 'tonificacion' 
  | 'salud_rehabilitacion';

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia' | 'yape_plin';

export interface MembershipPlan {
  id: string;
  name: string;
  durationMonths: number;
  durationDays: number;
  price: number;
  description: string;
  includesTrainer: boolean;
  features: string[];
  popular?: boolean;
}

export interface Member {
  id: string;
  dni: string;
  fullName: string;
  email: string;
  phone: string;
  photoUrl?: string;
  gender: 'M' | 'F' | 'Otro';
  birthDate: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalNotes?: string;
  objective: FitnessObjective;
  planId: string;
  planName: string;
  membershipStartDate: string;
  membershipEndDate: string;
  status: MembershipStatus;
  assignedTrainerId?: string;
  assignedRoutineId?: string;
  registrationDate: string;
  notes?: string;
  lastPaymentAmount?: number;
  lastPaymentDate?: string;
}

export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  photoUrl: string;
  bio: string;
  rating: number;
  availableSchedule: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: string[];
  equipment: 'mancuernas' | 'barra' | 'maquina' | 'polea' | 'peso_corporal' | 'kettlebell' | 'otro';
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  instructions: string;
  tips: string;
  targetSetsRepsDefault: string;
  videoUrl?: string; // e.g. YouTube demo link or mp4
  thumbnailUrl?: string;
}

export interface RoutineExercise {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: string;
  rir?: string;
  restSeconds: number;
  notes?: string;
  videoUrl?: string;
}

export interface RoutineDay {
  dayName: string; // e.g. "Día 1: Pecho y Tríceps (Empuje)"
  focus: string;
  notes?: string;
  exercises: RoutineExercise[];
}

export interface Routine {
  id: string;
  title: string;
  description: string;
  level: 'principiante' | 'intermedio' | 'avanzado';
  objective: FitnessObjective;
  trainerId?: string;
  trainerName?: string;
  targetStudentId?: string;
  targetStudentName?: string;
  days: RoutineDay[];
  createdDate: string;
}

export type ProductCategory = 'bebidas' | 'suplementos' | 'snacks' | 'accesorios' | 'ropa';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  brand: string;
  purchaseCost: number;
  salePrice: number;
  stock: number;
  minStockAlert: number;
  image?: string;
  barcode?: string;
  description: string;
}

export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'membership' 
  | 'pos_sale' 
  | 'personal_training' 
  | 'supplies' 
  | 'salary' 
  | 'maintenance' 
  | 'utilities' 
  | 'rent' 
  | 'marketing' 
  | 'staff_payroll'
  | 'equipment_breakdown'
  | 'free_expense'
  | 'other';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  description: string;
  relatedMemberId?: string;
  relatedMemberName?: string;
  items?: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  receiptNumber: string;
  // Extended expense specific fields
  staffId?: string;
  staffName?: string;
  hasTardinessDiscount?: boolean;
  tardinessDiscountAmount?: number;
  equipmentName?: string;
  breakdownDescription?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  expenseComment?: string;
}

export interface RenewalAlert {
  memberId: string;
  memberName: string;
  phone: string;
  email: string;
  planName: string;
  endDate: string;
  daysLeft: number; // positive = days until expiration, negative = days expired
  isExpired: boolean;
}

// Notification System Types
export type NotificationChannel = 'push' | 'email' | 'whatsapp' | 'sms';

export type NotificationCategory = 
  | 'renewal_reminder' 
  | 'class_notice' 
  | 'special_promo' 
  | 'general_alert' 
  | 'birthday';

export interface NotificationRule {
  id: string;
  name: string;
  category: NotificationCategory;
  enabled: boolean;
  channels: NotificationChannel[];
  triggerTiming: string; // e.g. "3 días antes del vencimiento"
  timingValueDays: number;
  templateTitle: string;
  templateBody: string;
  badgeTag: string;
}

export interface NotificationLog {
  id: string;
  recipientId?: string;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  category: NotificationCategory;
  channel: NotificationChannel;
  title: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'scheduled';
  targetAudience?: string;
}

export interface GymClassNotice {
  id: string;
  name: string;
  instructorName: string;
  schedule: string;
  room: string;
  registeredCount: number;
  capacity: number;
  date: string;
}

// --- NUTRITION MODULE TYPES ---
export interface MealItem {
  id: string;
  name: string;
  portion: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  notes?: string;
}

export interface NutritionMeal {
  id: string;
  name: string;
  time: string;
  items: MealItem[];
  totalCalories: number;
  totalProteins: number;
  totalCarbs: number;
  totalFats: number;
}

export interface NutritionPlan {
  id: string;
  title: string;
  targetStudentId?: string;
  targetStudentName?: string;
  objective: FitnessObjective;
  dailyCaloriesTarget: number;
  proteinsTargetGrams: number;
  carbsTargetGrams: number;
  fatsTargetGrams: number;
  waterLitersTarget: number;
  meals: NutritionMeal[];
  supplements?: string[];
  hydrationGuidelines?: string;
  recommendations: string;
  createdDate: string;
  trainerName?: string;
  active: boolean;
}

// --- ANTHROPOMETRIC & BIOIMPEDANCE TYPES ---
export interface AnthropometricPerimeters {
  neck: number;
  shoulders: number;
  chest: number;
  waist: number;
  abdomen: number;
  hip: number;
  bicepsRelaxedLeft: number;
  bicepsRelaxedRight: number;
  bicepsFlexedLeft: number;
  bicepsFlexedRight: number;
  forearm: number;
  thighSuperior: number;
  thighMid: number;
  calf: number;
}

export interface Skinfolds {
  triceps?: number;
  subscapular?: number;
  suprailiac?: number;
  abdominal?: number;
  thigh?: number;
  calf?: number;
}

export interface BioimpedanceData {
  bodyFatPercentage: number;
  bodyFatKg: number;
  muscleMassPercentage: number;
  muscleMassKg: number;
  leanMassKg: number;
  visceralFatLevel: number;
  totalBodyWaterPercentage: number;
  totalBodyWaterLiters: number;
  boneMassKg: number;
  basalMetabolicRateKcal: number;
  metabolicAge: number;
  physicalRatingScore?: number;
}

export interface BodyAssessment {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  time?: string;
  evaluatorTrainerName: string;
  
  weightKg: number;
  heightCm: number;
  bmi: number;
  bmiClassification: 'Bajo peso' | 'Normal' | 'Sobrepeso' | 'Obesidad I' | 'Obesidad II' | 'Obesidad III';
  
  waistHipRatio: number;
  waistHipRisk: 'Bajo' | 'Moderado' | 'Alto';
  waistHeightRatio: number;

  perimeters: AnthropometricPerimeters;
  skinfolds?: Skinfolds;
  bioimpedance: BioimpedanceData;
  
  notes?: string;
  targetGoalNotes?: string;
}

// --- SPINNING STUDIO & RESERVATIONS TYPES ---
export type BikeStatus = 'available' | 'reserved' | 'occupied' | 'maintenance';

export interface SpinningBike {
  id: string;
  bikeNumber: number;
  row: number;
  col: number;
  zone: 'front_stage' | 'center_mid' | 'elevated_back' | 'side_wing';
  model: string;
  hasPedalStraps: boolean;
  hasSpdClipless: boolean;
  notes?: string;
}

export interface SpinningSession {
  id: string;
  title: string;
  instructorId: string;
  instructorName: string;
  instructorPhoto?: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  intensity: 'moderada' | 'alta' | 'extrema';
  playlistGenre: string;
  maxCapacity: number;
  roomName: string;
  externalSessionPrice?: number; // S/. price for non-member visitor
}

export interface SpinningReservation {
  id: string;
  sessionId: string;
  bikeNumber: number;
  memberId: string;
  memberName: string;
  memberPhone?: string;
  memberEmail?: string;
  status: 'confirmed' | 'checked_in' | 'cancelled';
  reservedAt: string;
  checkInTime?: string;
  shoesRequirement?: 'calas_spd' | 'zapatilla_comun';
  specialNotes?: string;
  isExternalGuest?: boolean;
  paidAmount?: number;
  paymentMethod?: PaymentMethod;
  receiptNumber?: string;
  accessCodeUsed?: string;
}

// --- USER ROLES & AUTHENTICATION TYPES ---
export type UserRole = 'admin' | 'trainer' | 'student' | 'staff';

export interface AppUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  photoUrl?: string;
  memberId?: string;
  trainerId?: string;
  active: boolean;
}

// --- ATTENDANCE SYSTEM TYPES ---
export type AttendanceStatus = 
  | 'puntual' 
  | 'tarde' 
  | 'falta' 
  | 'permiso' 
  | 'on_time' 
  | 'late' 
  | 'authorized' 
  | 'warning';

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userDni: string;
  date: string;
  time: string;
  type: 'in' | 'out';
  status: AttendanceStatus;
  checkInMethod: 'qr_app' | 'dni_manual' | 'barcode' | 'quick_pass';
  notes?: string;
  membershipPlan?: string;
  // Specific required fields for splitting between staff & students and contract tracking
  category: 'staff' | 'student';
  contractId?: string;
  scheduledTime?: string;
  reason?: string; // Motivo en caso de tardanza, permiso o falta
  hoursWorked?: number;
}

// --- SPINNING ACCESS CODES (YAPE / RECEPTION VOUCHERS) ---
export interface SpinningAccessCode {
  id: string;
  code: string; // e.g. "SPIN-8421"
  sessionId?: string;
  sessionTitle?: string;
  issuedToName: string;
  issuedToPhone?: string;
  issuedToEmail?: string;
  memberId?: string;
  isExternal: boolean;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  status: 'active' | 'redeemed' | 'expired';
  issuedAt: string;
  redeemedAt?: string;
  redeemedBikeNumber?: number;
  issuedByTrainerName: string;
  notes?: string;
}

// --- STAFF CONTRACTS & HR TYPES ---
export type StaffRole = 
  | 'trainer' 
  | 'physiotherapist' 
  | 'nutritionist' 
  | 'receptionist' 
  | 'maintenance' 
  | 'manager';

export type ContractDuration = '3_months' | '6_months' | '1_year' | 'indefinite';
export type ContractStatus = 'active' | 'expiring_soon' | 'expired' | 'renewed';

export interface StaffContract {
  id: string;
  staffId: string;
  fullName: string;
  dni: string;
  role: StaffRole;
  roleTitle: string; // e.g. "Fisioterapeuta Especialista", "Lic. en Nutrición Deportiva", "Entrenador de Musculación", "Recepcionista y Caja"
  phone: string;
  email: string;
  photoUrl?: string;
  contractType: ContractDuration; // '3_months' | '6_months' | '1_year'
  contractDurationLabel: string; // e.g. "Contrato 3 Meses", "Contrato 6 Meses", "Contrato 1 Año"
  startDate: string;
  endDate: string;
  status: ContractStatus;
  monthlySalary: number;
  hourlyRate: number;
  assignedWeeklyHours: number;
  workedHoursThisMonth: number;
  workModality: 'full_time' | 'part_time' | 'hourly';
  department: 'Entrenamiento' | 'Fisioterapia' | 'Nutrición' | 'Recepción' | 'Operaciones';
  notes?: string;
  bankAccount?: string;
  lastPaymentDate?: string;
  paymentStatus: 'al_dia' | 'pendiente_mes';
  signedDocumentUrl?: string;
}

// --- PHYSIOTHERAPY CLINICAL HISTORY & EVALUATION TYPES ---
export type BodyPainZone = 
  | 'cervical' 
  | 'hombro' 
  | 'columna_dorsal' 
  | 'lumbar' 
  | 'cadera' 
  | 'rodilla' 
  | 'tobillo_pie' 
  | 'codo_muneca' 
  | 'muscular_general';

export interface PhysiotherapySessionRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberDni: string;
  memberPhone?: string;
  date: string;
  time: string;
  physiotherapistId: string;
  physiotherapistName: string;
  // Clinical fields & link with gym registration medical restrictions
  initialMedicalRestrictions: string; // Restricciones que se escribieron al inscribir al alumno
  consultationReason: string; // Diagnóstico inicial / Motivo de consulta
  affectedZone: BodyPainZone;
  painLevelEVA: number; // Escala EVA 0 a 10
  posturalEvaluation: string; // Evaluación postural y biomecánica
  rangeOfMotion: string; // Rango de movilidad articular (ROM)
  functionalTests: string; // Pruebas ortopédicas y funcionales realizadas
  treatmentsApplied: string[]; // Técnicas aplicadas (ej. Electroterapia TENS, Crioterapia, Punción seca, etc.)
  gymWorkoutRestrictions: string; // Restricciones específicas de ejercicio para el gimnasio
  homeIndications: string; // Pautas y estiramientos para casa
  evolutionNotes: string; // Notas de progreso y evolución clínica
  sessionNumber: number; // # de sesión en el historial
  nextAppointmentDate?: string;
}

// --- APPOINTMENT BOOKING & SCHEDULES (NUTRICIÓN & FISIOTERAPIA) ---
export type AppointmentStatus = 
  | 'por_atender' 
  | 'atendiendo' 
  | 'atendido' 
  | 'pospuesto' 
  | 'falta' 
  | 'scheduled' 
  | 'confirmed' 
  | 'completed' 
  | 'cancelled';

export interface AppointmentBooking {
  id: string;
  serviceType: 'nutrition' | 'physiotherapy';
  memberId: string;
  memberName: string;
  memberDni: string;
  memberPhone?: string;
  staffId: string;
  staffName: string;
  date: string;
  timeSlot: string; // e.g. "09:00 AM - 09:45 AM"
  durationMinutes: number;
  status: AppointmentStatus;
  reason: string;
  roomOrDesk: string;
  notes?: string;
  reminderSent?: boolean;
  dayOfWeek?: string;
  hasConflict?: boolean;
  conflictMessage?: string;
}

// --- STAFF PAYROLL & FINANCE ENTRY ---
export interface StaffPayrollEntry {
  id: string;
  contractId: string;
  staffName: string;
  role: StaffRole;
  department: string;
  month: string; // e.g. "Octubre 2026"
  baseSalary: number;
  workedHours: number;
  hourlyRate: number;
  bonusAmount: number;
  deductions: number;
  netPay: number;
  status: 'pending' | 'paid';
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  receiptNumber?: string;
}




