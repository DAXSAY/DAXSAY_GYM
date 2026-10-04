import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Member, 
  MembershipPlan, 
  Trainer, 
  Exercise, 
  Routine, 
  Product, 
  Transaction, 
  CartItem, 
  RenewalAlert,
  PaymentMethod,
  TransactionCategory,
  NotificationRule,
  NotificationLog,
  GymClassNotice,
  NotificationChannel,
  NotificationCategory,
  NutritionPlan,
  BodyAssessment,
  SpinningBike,
  SpinningSession,
  SpinningReservation,
  AppUser,
  UserRole,
  SpinningAccessCode,
  AttendanceRecord
} from '../types/gym';
import { 
  INITIAL_MEMBERS, 
  INITIAL_PLANS, 
  INITIAL_TRAINERS, 
  INITIAL_EXERCISES, 
  INITIAL_ROUTINES, 
  INITIAL_PRODUCTS, 
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATION_RULES,
  INITIAL_NOTIFICATION_LOGS,
  INITIAL_CLASSES,
  INITIAL_NUTRITION_PLANS,
  INITIAL_BODY_ASSESSMENTS,
  INITIAL_SPINNING_BIKES,
  INITIAL_SPINNING_SESSIONS,
  INITIAL_SPINNING_RESERVATIONS,
  INITIAL_USERS,
  INITIAL_SPINNING_ACCESS_CODES,
  INITIAL_ATTENDANCES
} from '../data/initialData';

interface GymContextType {
  // Data
  members: Member[];
  plans: MembershipPlan[];
  trainers: Trainer[];
  exercises: Exercise[];
  routines: Routine[];
  products: Product[];
  transactions: Transaction[];
  notificationRules: NotificationRule[];
  notificationLogs: NotificationLog[];
  classes: GymClassNotice[];
  nutritionPlans: NutritionPlan[];
  bodyAssessments: BodyAssessment[];
  spinningBikes: SpinningBike[];
  spinningSessions: SpinningSession[];
  spinningReservations: SpinningReservation[];
  users: AppUser[];
  currentUser: AppUser;
  spinningAccessCodes: SpinningAccessCode[];
  attendances: AttendanceRecord[];
  
  // Member actions
  addMember: (memberData: Omit<Member, 'id' | 'registrationDate' | 'status'>) => void;
  updateMember: (id: string, memberData: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  renewMembership: (memberId: string, planId: string, paymentMethod: PaymentMethod, discount?: number) => void;
  assignTrainerToMember: (memberId: string, trainerId: string) => void;
  assignRoutineToMember: (memberId: string, routineId: string) => void;
  
  // Plan actions
  addPlan: (planData: Omit<MembershipPlan, 'id'>) => void;
  updatePlan: (id: string, planData: Partial<MembershipPlan>) => void;
  deletePlan: (id: string) => void;

  // Trainer actions
  addTrainer: (trainerData: Omit<Trainer, 'id'>) => void;
  updateTrainer: (id: string, trainerData: Partial<Trainer>) => void;
  deleteTrainer: (id: string) => void;

  // Exercise actions
  addExercise: (exerciseData: Omit<Exercise, 'id'>) => void;
  updateExercise: (id: string, exerciseData: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;

  // Routine actions
  addRoutine: (routineData: Omit<Routine, 'id' | 'createdDate'>) => void;
  updateRoutine: (id: string, routineData: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;

  // Product & Store POS actions
  addProduct: (productData: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (productId: string, newStock: number) => void;
  processPOSSale: (cart: CartItem[], paymentMethod: PaymentMethod, memberId?: string, customerName?: string) => Transaction;

  // Financial transactions
  addTransaction: (txData: Omit<Transaction, 'id' | 'receiptNumber'>) => void;
  deleteTransaction: (id: string) => void;

  // Notification actions & rules
  updateNotificationRule: (id: string, ruleData: Partial<NotificationRule>) => void;
  toggleNotificationRule: (id: string) => void;
  addNotificationLog: (log: Omit<NotificationLog, 'id' | 'timestamp'>) => void;
  sendDirectNotification: (data: { recipientId?: string; recipientName: string; recipientEmail?: string; recipientPhone?: string; category: NotificationCategory; channel: NotificationChannel; title: string; message: string; targetAudience?: string }) => void;
  sendManualCampaign: (campaign: { title: string; message: string; category: NotificationCategory; channels: NotificationChannel[]; targetAudience: string; specificMemberIds?: string[] }) => number;
  triggerRealWebNotification: (title: string, body: string) => void;
  clearNotificationLogs: () => void;

  // Classes actions
  addClassNotice: (classData: Omit<GymClassNotice, 'id'>) => void;
  deleteClassNotice: (id: string) => void;

  // Nutrition actions
  addNutritionPlan: (planData: Omit<NutritionPlan, 'id' | 'createdDate'>) => void;
  updateNutritionPlan: (id: string, planData: Partial<NutritionPlan>) => void;
  deleteNutritionPlan: (id: string) => void;

  // Body Assessment (Anthropometry & Bioimpedance) actions
  addBodyAssessment: (assessmentData: Omit<BodyAssessment, 'id'>) => void;
  updateBodyAssessment: (id: string, assessmentData: Partial<BodyAssessment>) => void;
  deleteBodyAssessment: (id: string) => void;
  getAssessmentsByMemberId: (memberId: string) => BodyAssessment[];

  // Spinning Studio & Reservation actions
  addSpinningSession: (sessionData: Omit<SpinningSession, 'id'>) => void;
  deleteSpinningSession: (id: string) => void;
  reserveSpinningBike: (data: {
    sessionId: string;
    bikeNumber: number;
    memberId: string;
    memberName: string;
    memberPhone?: string;
    memberEmail?: string;
    shoesRequirement?: 'calas_spd' | 'zapatilla_comun';
    specialNotes?: string;
    isExternalGuest?: boolean;
    paidAmount?: number;
    paymentMethod?: PaymentMethod;
  }) => { success: boolean; message: string; reservation?: SpinningReservation };
  cancelSpinningReservation: (reservationId: string) => void;
  checkInSpinningReservation: (reservationId: string) => void;
  toggleBikeMaintenance: (bikeId: string, notes?: string) => void;

  // User Authentication & Roles
  setCurrentUser: (user: AppUser) => void;
  loginAsUser: (userId: string) => void;
  registerUser: (userData: Omit<AppUser, 'id'>) => AppUser;

  // Spinning Access Codes (Unique access tokens for Yape/remote booking)
  generateSpinningAccessCode: (data: {
    sessionId?: string;
    sessionTitle?: string;
    issuedToName: string;
    issuedToPhone?: string;
    issuedToEmail?: string;
    memberId?: string;
    isExternal: boolean;
    amountPaid: number;
    paymentMethod: PaymentMethod;
    issuedByTrainerName: string;
    notes?: string;
  }) => SpinningAccessCode;
  redeemSpinningAccessCode: (codeStr: string, bikeNumber: number, overrideStudentName?: string, overrideStudentPhone?: string) => { success: boolean; message: string; reservation?: SpinningReservation };

  // Attendance actions
  recordAttendance: (data: Omit<AttendanceRecord, 'id' | 'date' | 'time'>) => { success: boolean; record: AttendanceRecord; message: string };
  deleteAttendance: (id: string) => void;

  // Computed alerts & metrics
  renewalAlerts: RenewalAlert[];
  lowStockProducts: Product[];
  metrics: {
    totalActiveMembers: number;
    expiringMembersCount: number;
    expiredMembersCount: number;
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    posSalesTotal: number;
    membershipsRevenue: number;
    activeNotificationRulesCount: number;
    totalSentNotifications: number;
  };

  // Utilities
  getMemberById: (id: string) => Member | undefined;
  getTrainerById: (id: string) => Trainer | undefined;
  getRoutineById: (id: string) => Routine | undefined;
  getPlanById: (id: string) => MembershipPlan | undefined;
  getProductById: (id: string) => Product | undefined;
  generateWhatsAppLink: (member: Member, customNote?: string) => string;
  resetToDefaults: () => void;
  exportDataJSON: () => void;
  importDataJSON: (jsonData: string) => boolean;
}

const GymContext = createContext<GymContextType | null>(null);

const STORAGE_KEYS = {
  MEMBERS: 'gymcontrol_members_v1',
  PLANS: 'gymcontrol_plans_v1',
  TRAINERS: 'gymcontrol_trainers_v1',
  EXERCISES: 'gymcontrol_exercises_v1',
  ROUTINES: 'gymcontrol_routines_v1',
  PRODUCTS: 'gymcontrol_products_v1',
  TRANSACTIONS: 'gymcontrol_transactions_v1',
  NOTIFICATION_RULES: 'gymcontrol_notification_rules_v1',
  NOTIFICATION_LOGS: 'gymcontrol_notification_logs_v1',
  CLASSES: 'gymcontrol_classes_v1',
  NUTRITION_PLANS: 'gymcontrol_nutrition_plans_v1',
  BODY_ASSESSMENTS: 'gymcontrol_body_assessments_v1',
  SPINNING_BIKES: 'gymcontrol_spinning_bikes_v1',
  SPINNING_SESSIONS: 'gymcontrol_spinning_sessions_v1',
  SPINNING_RESERVATIONS: 'gymcontrol_spinning_reservations_v1',
  USERS: 'gymcontrol_users_v1',
  CURRENT_USER: 'gymcontrol_current_user_v1',
  SPINNING_ACCESS_CODES: 'gymcontrol_spinning_access_codes_v1',
  ATTENDANCES: 'gymcontrol_attendances_v1'
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(`Error loading localStorage key: ${key}`, e);
  }
  return fallback;
}

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>(() => loadStorage(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS));
  const [plans, setPlans] = useState<MembershipPlan[]>(() => loadStorage(STORAGE_KEYS.PLANS, INITIAL_PLANS));
  const [trainers, setTrainers] = useState<Trainer[]>(() => loadStorage(STORAGE_KEYS.TRAINERS, INITIAL_TRAINERS));
  const [exercises, setExercises] = useState<Exercise[]>(() => loadStorage(STORAGE_KEYS.EXERCISES, INITIAL_EXERCISES));
  const [routines, setRoutines] = useState<Routine[]>(() => loadStorage(STORAGE_KEYS.ROUTINES, INITIAL_ROUTINES));
  const [products, setProducts] = useState<Product[]>(() => loadStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadStorage(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS));
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>(() => loadStorage(STORAGE_KEYS.NOTIFICATION_RULES, INITIAL_NOTIFICATION_RULES));
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>(() => loadStorage(STORAGE_KEYS.NOTIFICATION_LOGS, INITIAL_NOTIFICATION_LOGS));
  const [classes, setClasses] = useState<GymClassNotice[]>(() => loadStorage(STORAGE_KEYS.CLASSES, INITIAL_CLASSES));
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>(() => loadStorage(STORAGE_KEYS.NUTRITION_PLANS, INITIAL_NUTRITION_PLANS));
  const [bodyAssessments, setBodyAssessments] = useState<BodyAssessment[]>(() => loadStorage(STORAGE_KEYS.BODY_ASSESSMENTS, INITIAL_BODY_ASSESSMENTS));
  const [spinningBikes, setSpinningBikes] = useState<SpinningBike[]>(() => loadStorage(STORAGE_KEYS.SPINNING_BIKES, INITIAL_SPINNING_BIKES));
  const [spinningSessions, setSpinningSessions] = useState<SpinningSession[]>(() => loadStorage(STORAGE_KEYS.SPINNING_SESSIONS, INITIAL_SPINNING_SESSIONS));
  const [spinningReservations, setSpinningReservations] = useState<SpinningReservation[]>(() => loadStorage(STORAGE_KEYS.SPINNING_RESERVATIONS, INITIAL_SPINNING_RESERVATIONS));
  const [users, setUsers] = useState<AppUser[]>(() => loadStorage(STORAGE_KEYS.USERS, INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<AppUser>(() => loadStorage(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]));
  const [spinningAccessCodes, setSpinningAccessCodes] = useState<SpinningAccessCode[]>(() => loadStorage(STORAGE_KEYS.SPINNING_ACCESS_CODES, INITIAL_SPINNING_ACCESS_CODES));
  const [attendances, setAttendances] = useState<AttendanceRecord[]>(() => loadStorage(STORAGE_KEYS.ATTENDANCES, INITIAL_ATTENDANCES));

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(trainers));
  }, [trainers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATION_RULES, JSON.stringify(notificationRules));
  }, [notificationRules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATION_LOGS, JSON.stringify(notificationLogs));
  }, [notificationLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NUTRITION_PLANS, JSON.stringify(nutritionPlans));
  }, [nutritionPlans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BODY_ASSESSMENTS, JSON.stringify(bodyAssessments));
  }, [bodyAssessments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SPINNING_BIKES, JSON.stringify(spinningBikes));
  }, [spinningBikes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SPINNING_SESSIONS, JSON.stringify(spinningSessions));
  }, [spinningSessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SPINNING_RESERVATIONS, JSON.stringify(spinningReservations));
  }, [spinningReservations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SPINNING_ACCESS_CODES, JSON.stringify(spinningAccessCodes));
  }, [spinningAccessCodes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCES, JSON.stringify(attendances));
  }, [attendances]);

  // Real-time status recalculation for members based on current reference date
  const computeMemberStatus = (endDateStr: string): 'active' | 'expiring_soon' | 'expired' => {
    const today = new Date('2026-08-30'); // Using consistent system date context
    const end = new Date(endDateStr);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'expired';
    if (diffDays <= 7) return 'expiring_soon';
    return 'active';
  };

  // Helper getters
  const getMemberById = (id: string) => members.find(m => m.id === id);
  const getTrainerById = (id: string) => trainers.find(t => t.id === id);
  const getRoutineById = (id: string) => routines.find(r => r.id === id);
  const getPlanById = (id: string) => plans.find(p => p.id === id);
  const getProductById = (id: string) => products.find(p => p.id === id);

  // Add Member
  const addMember = (memberData: Omit<Member, 'id' | 'registrationDate' | 'status'>) => {
    const newId = `mem-${Date.now()}`;
    const todayStr = '2026-08-30';
    const status = computeMemberStatus(memberData.membershipEndDate);
    
    const newMember: Member = {
      ...memberData,
      id: newId,
      registrationDate: todayStr,
      status
    };

    setMembers(prev => [newMember, ...prev]);

    // Automatically record income transaction if payment amount provided
    if (memberData.lastPaymentAmount && memberData.lastPaymentAmount > 0) {
      const receiptNo = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'income',
        category: 'membership',
        amount: memberData.lastPaymentAmount,
        date: todayStr,
        paymentMethod: 'efectivo',
        description: `Inscripción y Membresía ${memberData.planName} - ${memberData.fullName}`,
        relatedMemberId: newId,
        relatedMemberName: memberData.fullName,
        receiptNumber: receiptNo
      };
      setTransactions(prev => [newTx, ...prev]);
    }
  };

  // Update Member
  const updateMember = (id: string, memberData: Partial<Member>) => {
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        const updated = { ...m, ...memberData };
        if (memberData.membershipEndDate) {
          updated.status = computeMemberStatus(memberData.membershipEndDate);
        }
        return updated;
      }
      return m;
    }));
  };

  // Delete Member
  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  // Renew Membership
  const renewMembership = (memberId: string, planId: string, paymentMethod: PaymentMethod, discount = 0) => {
    const member = members.find(m => m.id === memberId);
    const plan = plans.find(p => p.id === planId);
    if (!member || !plan) return;

    const today = new Date('2026-08-30');
    // If current end date is in the future, extend from end date, else start from today
    const currentEnd = new Date(member.membershipEndDate);
    const baseDate = currentEnd > today ? currentEnd : today;

    const newEnd = new Date(baseDate);
    newEnd.setDate(newEnd.getDate() + plan.durationDays);
    const newEndDateStr = newEnd.toISOString().split('T')[0];
    const todayStr = '2026-08-30';

    const finalAmount = Math.max(0, plan.price - discount);
    const receiptNo = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Update Member
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          planId: plan.id,
          planName: plan.name,
          membershipStartDate: todayStr,
          membershipEndDate: newEndDateStr,
          status: 'active',
          lastPaymentAmount: finalAmount,
          lastPaymentDate: todayStr
        };
      }
      return m;
    }));

    // Record Income Transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'income',
      category: 'membership',
      amount: finalAmount,
      date: todayStr,
      paymentMethod,
      description: `Renovación Membresía ${plan.name} - ${member.fullName}`,
      relatedMemberId: member.id,
      relatedMemberName: member.fullName,
      receiptNumber: receiptNo
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  // Assign Trainer
  const assignTrainerToMember = (memberId: string, trainerId: string) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, assignedTrainerId: trainerId } : m));
  };

  // Assign Routine
  const assignRoutineToMember = (memberId: string, routineId: string) => {
    const routine = routines.find(r => r.id === routineId);
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, assignedRoutineId: routineId } : m));
    
    if (routine) {
      const member = members.find(m => m.id === memberId);
      if (member) {
        setRoutines(prev => prev.map(r => r.id === routineId ? { ...r, targetStudentId: member.id, targetStudentName: member.fullName } : r));
      }
    }
  };

  // Plan management
  const addPlan = (planData: Omit<MembershipPlan, 'id'>) => {
    const newPlan: MembershipPlan = {
      ...planData,
      id: `plan-${Date.now()}`
    };
    setPlans(prev => [...prev, newPlan]);
  };

  const updatePlan = (id: string, planData: Partial<MembershipPlan>) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, ...planData } : p));
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  // Trainer management
  const addTrainer = (trainerData: Omit<Trainer, 'id'>) => {
    const newTrainer: Trainer = {
      ...trainerData,
      id: `trainer-${Date.now()}`
    };
    setTrainers(prev => [...prev, newTrainer]);
  };

  const updateTrainer = (id: string, trainerData: Partial<Trainer>) => {
    setTrainers(prev => prev.map(t => t.id === id ? { ...t, ...trainerData } : t));
  };

  const deleteTrainer = (id: string) => {
    setTrainers(prev => prev.filter(t => t.id !== id));
  };

  // Exercise management
  const addExercise = (exerciseData: Omit<Exercise, 'id'>) => {
    const newExercise: Exercise = {
      ...exerciseData,
      id: `ex-${Date.now()}`
    };
    setExercises(prev => [newExercise, ...prev]);
  };

  const updateExercise = (id: string, exerciseData: Partial<Exercise>) => {
    setExercises(prev => prev.map(e => e.id === id ? { ...e, ...exerciseData } : e));
  };

  const deleteExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  // Routine management
  const addRoutine = (routineData: Omit<Routine, 'id' | 'createdDate'>) => {
    const newRoutine: Routine = {
      ...routineData,
      id: `routine-${Date.now()}`,
      createdDate: '2026-08-30'
    };
    setRoutines(prev => [newRoutine, ...prev]);
  };

  const updateRoutine = (id: string, routineData: Partial<Routine>) => {
    setRoutines(prev => prev.map(r => r.id === id ? { ...r, ...routineData } : r));
  };

  const deleteRoutine = (id: string) => {
    setRoutines(prev => prev.filter(r => r.id !== id));
  };

  // Product management
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productData } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p));
  };

  // Process POS Store Sale
  const processPOSSale = (
    cart: CartItem[], 
    paymentMethod: PaymentMethod, 
    memberId?: string, 
    customerName?: string
  ): Transaction => {
    const todayStr = '2026-08-30';
    const totalAmount = cart.reduce((sum, item) => sum + (item.product.salePrice * item.quantity), 0);
    const receiptNo = `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const member = memberId ? members.find(m => m.id === memberId) : undefined;
    const clientLabel = member ? member.fullName : (customerName || 'Cliente General');

    const txItems = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.salePrice,
      total: item.product.salePrice * item.quantity
    }));

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'income',
      category: 'pos_sale',
      amount: totalAmount,
      date: todayStr,
      paymentMethod,
      description: `Venta POS Tienda (${cart.length} productos) - ${clientLabel}`,
      relatedMemberId: member?.id,
      relatedMemberName: clientLabel,
      items: txItems,
      receiptNumber: receiptNo
    };

    // Deduct stock for each sold item
    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(ci => ci.product.id === p.id);
      if (cartItem) {
        return {
          ...p,
          stock: Math.max(0, p.stock - cartItem.quantity)
        };
      }
      return p;
    }));

    // Add transaction
    setTransactions(prev => [newTx, ...prev]);

    return newTx;
  };

  // Add Income / Expense Transaction
  const addTransaction = (txData: Omit<Transaction, 'id' | 'receiptNumber'>) => {
    const prefix = txData.type === 'income' ? 'REC' : 'EGR';
    const receiptNo = `${prefix}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      receiptNumber: receiptNo
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Notification Rule Management
  const updateNotificationRule = (id: string, ruleData: Partial<NotificationRule>) => {
    setNotificationRules(prev => prev.map(r => r.id === id ? { ...r, ...ruleData } : r));
  };

  const toggleNotificationRule = (id: string) => {
    setNotificationRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const addNotificationLog = (logData: Omit<NotificationLog, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = `2026-08-30 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog: NotificationLog = {
      ...logData,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timeStr
    };
    setNotificationLogs(prev => [newLog, ...prev]);
  };

  const clearNotificationLogs = () => {
    setNotificationLogs([]);
  };

  // Real Web Push Trigger Simulation
  const triggerRealWebNotification = (title: string, body: string) => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(title, {
            body,
            icon: '/icon.png'
          });
        } catch (e) {
          console.log('Push notification shown in container sandbox');
        }
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            try {
              new Notification(title, { body, icon: '/icon.png' });
            } catch (e) {
              console.log('Push notification granted');
            }
          }
        });
      }
    }
  };

  // Send Direct Notification
  const sendDirectNotification = (data: {
    recipientId?: string;
    recipientName: string;
    recipientEmail?: string;
    recipientPhone?: string;
    category: NotificationCategory;
    channel: NotificationChannel;
    title: string;
    message: string;
    targetAudience?: string;
  }) => {
    const now = new Date();
    const timeStr = `2026-08-30 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog: NotificationLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      recipientId: data.recipientId,
      recipientName: data.recipientName,
      recipientEmail: data.recipientEmail,
      recipientPhone: data.recipientPhone,
      category: data.category,
      channel: data.channel,
      title: data.title,
      message: data.message,
      timestamp: timeStr,
      status: 'delivered',
      targetAudience: data.targetAudience
    };

    setNotificationLogs(prev => [newLog, ...prev]);

    if (data.channel === 'push') {
      triggerRealWebNotification(data.title, data.message);
    }
  };

  // Send Campaign
  const sendManualCampaign = (campaign: {
    title: string;
    message: string;
    category: NotificationCategory;
    channels: NotificationChannel[];
    targetAudience: string;
    specificMemberIds?: string[];
  }): number => {
    let targetMembers: Member[] = [];
    if (campaign.specificMemberIds && campaign.specificMemberIds.length > 0) {
      targetMembers = members.filter(m => campaign.specificMemberIds!.includes(m.id));
    } else if (campaign.targetAudience === 'active') {
      targetMembers = members.filter(m => computeMemberStatus(m.membershipEndDate) === 'active');
    } else if (campaign.targetAudience === 'expiring') {
      targetMembers = members.filter(m => computeMemberStatus(m.membershipEndDate) === 'expiring_soon');
    } else if (campaign.targetAudience === 'expired') {
      targetMembers = members.filter(m => computeMemberStatus(m.membershipEndDate) === 'expired');
    } else {
      targetMembers = members;
    }

    const now = new Date();
    const timeStr = `2026-08-30 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLogs: NotificationLog[] = [];

    targetMembers.forEach(member => {
      campaign.channels.forEach(channel => {
        // Interpolate variables
        let personalizedMsg = campaign.message
          .replace(/{{nombre}}/g, member.fullName)
          .replace(/{{plan}}/g, member.planName)
          .replace(/{{fecha_vencimiento}}/g, member.membershipEndDate)
          .replace(/{{telefono}}/g, member.phone)
          .replace(/{{email}}/g, member.email);

        newLogs.push({
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          recipientId: member.id,
          recipientName: member.fullName,
          recipientEmail: member.email,
          recipientPhone: member.phone,
          category: campaign.category,
          channel,
          title: campaign.title.replace(/{{nombre}}/g, member.fullName.split(' ')[0]),
          message: personalizedMsg,
          timestamp: timeStr,
          status: 'delivered',
          targetAudience: campaign.targetAudience
        });
      });
    });

    if (campaign.channels.includes('push')) {
      triggerRealWebNotification(campaign.title, campaign.message.replace(/{{nombre}}/g, 'Socio'));
    }

    setNotificationLogs(prev => [...newLogs, ...prev]);
    return targetMembers.length;
  };

  // Class notices management
  const addClassNotice = (classData: Omit<GymClassNotice, 'id'>) => {
    const newClass: GymClassNotice = {
      ...classData,
      id: `class-${Date.now()}`
    };
    setClasses(prev => [newClass, ...prev]);
  };

  const deleteClassNotice = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  // Computed Renewal Alerts
  const renewalAlerts = useMemo<RenewalAlert[]>(() => {
    const today = new Date('2026-08-30');
    const alerts: RenewalAlert[] = [];

    members.forEach(member => {
      const end = new Date(member.membershipEndDate);
      const diffTime = end.getTime() - today.getTime();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Show alerts for expired OR expiring within 7 days
      if (daysLeft <= 7) {
        alerts.push({
          memberId: member.id,
          memberName: member.fullName,
          phone: member.phone,
          email: member.email,
          planName: member.planName,
          endDate: member.membershipEndDate,
          daysLeft,
          isExpired: daysLeft < 0
        });
      }
    });

    // Sort by most urgent (expired first, then closest days)
    return alerts.sort((a, b) => a.daysLeft - b.daysLeft);
  }, [members]);

  // Low stock products
  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.stock <= p.minStockAlert);
  }, [products]);

  // Financial Metrics
  const metrics = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let posSalesTotal = 0;
    let membershipsRevenue = 0;

    transactions.forEach(t => {
      if (t.type === 'income') {
        totalIncome += t.amount;
        if (t.category === 'pos_sale') posSalesTotal += t.amount;
        if (t.category === 'membership') membershipsRevenue += t.amount;
      } else if (t.type === 'expense') {
        totalExpense += t.amount;
      }
    });

    const activeMembers = members.filter(m => computeMemberStatus(m.membershipEndDate) === 'active');
    const expiringMembers = members.filter(m => computeMemberStatus(m.membershipEndDate) === 'expiring_soon');
    const expiredMembers = members.filter(m => computeMemberStatus(m.membershipEndDate) === 'expired');
    const activeNotificationRulesCount = notificationRules.filter(r => r.enabled).length;

    return {
      totalActiveMembers: activeMembers.length,
      expiringMembersCount: expiringMembers.length,
      expiredMembersCount: expiredMembers.length,
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
      posSalesTotal,
      membershipsRevenue,
      activeNotificationRulesCount,
      totalSentNotifications: notificationLogs.length
    };
  }, [members, transactions, notificationRules, notificationLogs]);

  // WhatsApp reminder message builder
  const generateWhatsAppLink = (member: Member, customNote?: string): string => {
    const today = new Date('2026-08-30');
    const end = new Date(member.membershipEndDate);
    const diffTime = end.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let cleanPhone = member.phone.replace(/[^0-9]/g, '');
    if (!cleanPhone.startsWith('51') && cleanPhone.length === 9) {
      cleanPhone = '51' + cleanPhone; // Peru country code default if 9 digits
    }

    let message = '';
    if (daysLeft < 0) {
      message = `¡Hola ${member.fullName.split(' ')[0]}! 💪 Te saludamos de GymControl. Te recordamos que tu membresía (${member.planName}) venció el ${member.membershipEndDate}. ¡Renueva hoy mismo y no pierdas tu progreso en el entrenamiento! Consulta por nuestras promociones exclusivas. ${customNote ? `\n\nNota: ${customNote}` : ''}`;
    } else if (daysLeft === 0) {
      message = `¡Hola ${member.fullName.split(' ')[0]}! 🏋️‍♂️ Te saludamos de GymControl. Te informamos que tu membresía (${member.planName}) vence HOY ${member.membershipEndDate}. Puedes renovar en recepción o por transferencia/Yape. ¡Te esperamos para entrenar! ${customNote ? `\n\nNota: ${customNote}` : ''}`;
    } else {
      message = `¡Hola ${member.fullName.split(' ')[0]}! ⚡ Te saludamos de GymControl. Te informamos que a tu membresía (${member.planName}) le quedan ${daysLeft} días de vigencia (vence el ${member.membershipEndDate}). ¡Aprovecha para renovar con anticipación y seguir alcanzando tus metas! ${customNote ? `\n\nNota: ${customNote}` : ''}`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // --- NUTRITION ACTIONS ---
  const addNutritionPlan = (planData: Omit<NutritionPlan, 'id' | 'createdDate'>) => {
    const newPlan: NutritionPlan = {
      ...planData,
      id: `nutri-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setNutritionPlans(prev => [newPlan, ...prev]);
  };

  const updateNutritionPlan = (id: string, planData: Partial<NutritionPlan>) => {
    setNutritionPlans(prev => prev.map(p => p.id === id ? { ...p, ...planData } : p));
  };

  const deleteNutritionPlan = (id: string) => {
    setNutritionPlans(prev => prev.filter(p => p.id !== id));
  };

  // --- BODY ASSESSMENTS (ANTHROPOMETRY & BIOIMPEDANCE) ACTIONS ---
  const addBodyAssessment = (assessmentData: Omit<BodyAssessment, 'id'>) => {
    const newAssessment: BodyAssessment = {
      ...assessmentData,
      id: `eval-${Date.now()}`
    };
    setBodyAssessments(prev => [...prev, newAssessment]);
  };

  const updateBodyAssessment = (id: string, assessmentData: Partial<BodyAssessment>) => {
    setBodyAssessments(prev => prev.map(a => a.id === id ? { ...a, ...assessmentData } : a));
  };

  const deleteBodyAssessment = (id: string) => {
    setBodyAssessments(prev => prev.filter(a => a.id !== id));
  };

  const getAssessmentsByMemberId = (memberId: string): BodyAssessment[] => {
    return bodyAssessments
      .filter(a => a.memberId === memberId)
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  // --- SPINNING STUDIO & RESERVATION ACTIONS ---
  const addSpinningSession = (sessionData: Omit<SpinningSession, 'id'>) => {
    const newSession: SpinningSession = {
      ...sessionData,
      id: `spin-sess-${Date.now()}`
    };
    setSpinningSessions(prev => [...prev, newSession]);
  };

  const deleteSpinningSession = (id: string) => {
    setSpinningSessions(prev => prev.filter(s => s.id !== id));
    setSpinningReservations(prev => prev.filter(r => r.sessionId !== id));
  };

  const reserveSpinningBike = (data: {
    sessionId: string;
    bikeNumber: number;
    memberId: string;
    memberName: string;
    memberPhone?: string;
    memberEmail?: string;
    shoesRequirement?: 'calas_spd' | 'zapatilla_comun';
    specialNotes?: string;
    isExternalGuest?: boolean;
    paidAmount?: number;
    paymentMethod?: PaymentMethod;
  }) => {
    // Check if already reserved in this session
    const existing = spinningReservations.find(
      r => r.sessionId === data.sessionId && r.bikeNumber === data.bikeNumber && r.status !== 'cancelled'
    );
    if (existing) {
      return { success: false, message: `La bicicleta #${data.bikeNumber} ya se encuentra reservada por ${existing.memberName}.` };
    }

    // Check if member already has a bike in this session (only for regular members)
    if (!data.isExternalGuest) {
      const memberAlreadyReserved = spinningReservations.find(
        r => r.sessionId === data.sessionId && r.memberId === data.memberId && r.status !== 'cancelled'
      );
      if (memberAlreadyReserved) {
        return { success: false, message: `${data.memberName} ya tiene asignada la bicicleta #${memberAlreadyReserved.bikeNumber} en esta sesión.` };
      }
    }

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const dateStr = now.toISOString().split('T')[0];
    const receiptNumber = data.paidAmount && data.paidAmount > 0 
      ? `REC-SPIN-${Math.floor(1000 + Math.random() * 9000)}` 
      : undefined;

    const newReservation: SpinningReservation = {
      id: `res-spin-${Date.now()}`,
      sessionId: data.sessionId,
      bikeNumber: data.bikeNumber,
      memberId: data.memberId,
      memberName: data.memberName,
      memberPhone: data.memberPhone,
      memberEmail: data.memberEmail,
      status: 'confirmed',
      reservedAt: `${dateStr} ${timeStr}`,
      shoesRequirement: data.shoesRequirement || 'zapatilla_comun',
      specialNotes: data.specialNotes,
      isExternalGuest: data.isExternalGuest,
      paidAmount: data.paidAmount,
      paymentMethod: data.paymentMethod,
      receiptNumber
    };

    // If external guest paid for the session, automatically record in Gym finances as income!
    if (data.paidAmount && data.paidAmount > 0 && receiptNumber) {
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'income',
        category: 'pos_sale',
        amount: data.paidAmount,
        date: dateStr,
        paymentMethod: data.paymentMethod || 'yape_plin',
        description: `Pase de Sesión Spinning (Visitante Externo): ${data.memberName} - Bici #${data.bikeNumber}`,
        receiptNumber: receiptNumber,
        relatedMemberName: data.memberName
      };
      setTransactions(prev => [newTx, ...prev]);
    }

    setSpinningReservations(prev => [...prev, newReservation]);
    return { 
      success: true, 
      message: data.isExternalGuest 
        ? `¡Pago y reserva exitosa para ${data.memberName}! Bici #${data.bikeNumber} asignada con recibo ${receiptNumber || ''}.`
        : `¡Bicicleta #${data.bikeNumber} reservada exitosamente para ${data.memberName}!`, 
      reservation: newReservation 
    };
  };

  const cancelSpinningReservation = (reservationId: string) => {
    setSpinningReservations(prev => prev.filter(r => r.id !== reservationId));
  };

  const checkInSpinningReservation = (reservationId: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setSpinningReservations(prev => prev.map(r => r.id === reservationId ? {
      ...r,
      status: 'checked_in',
      checkInTime: `${now.toISOString().split('T')[0]} ${timeStr}`
    } : r));
  };

  const toggleBikeMaintenance = (bikeId: string, notes?: string) => {
    setSpinningBikes(prev => prev.map(b => {
      if (b.id === bikeId) {
        return {
          ...b,
          notes: notes !== undefined ? notes : (b.notes ? undefined : 'En revisión técnica / ajuste de resistencia')
        };
      }
      return b;
    }));
  };

  // --- USER AUTHENTICATION & PROFILES ---
  const loginAsUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const registerUser = (userData: Omit<AppUser, 'id'>): AppUser => {
    const newUser: AppUser = {
      ...userData,
      id: `usr-${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  // --- SPINNING ACCESS CODES (FOR YAPE SCREENSHOT PAYMENTS) ---
  const generateSpinningAccessCode = (data: {
    sessionId?: string;
    sessionTitle?: string;
    issuedToName: string;
    issuedToPhone?: string;
    issuedToEmail?: string;
    memberId?: string;
    isExternal: boolean;
    amountPaid: number;
    paymentMethod: PaymentMethod;
    issuedByTrainerName: string;
    notes?: string;
  }): SpinningAccessCode => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const prefix = data.paymentMethod === 'yape_plin' ? 'YAPE' : 'SPIN';
    const code = `${prefix}-${randomDigits}`;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const dateStr = now.toISOString().split('T')[0];

    const newCode: SpinningAccessCode = {
      id: `code-${Date.now()}`,
      code,
      sessionId: data.sessionId,
      sessionTitle: data.sessionTitle,
      issuedToName: data.issuedToName,
      issuedToPhone: data.issuedToPhone,
      issuedToEmail: data.issuedToEmail,
      memberId: data.memberId,
      isExternal: data.isExternal,
      amountPaid: data.amountPaid,
      paymentMethod: data.paymentMethod,
      status: 'active',
      issuedAt: `${dateStr} ${timeStr}`,
      issuedByTrainerName: data.issuedByTrainerName,
      notes: data.notes
    };

    // Also register an income transaction in gym finances since payment was validated
    if (data.amountPaid > 0) {
      const receiptNumber = `REC-${code}`;
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'income',
        category: 'pos_sale',
        amount: data.amountPaid,
        date: dateStr,
        paymentMethod: data.paymentMethod,
        description: `Pase Spinning / Código ${code} confirmado: ${data.issuedToName} (por ${data.issuedByTrainerName})`,
        receiptNumber: receiptNumber,
        relatedMemberName: data.issuedToName
      };
      setTransactions(prev => [newTx, ...prev]);
    }

    setSpinningAccessCodes(prev => [newCode, ...prev]);
    return newCode;
  };

  const redeemSpinningAccessCode = (
    codeStr: string, 
    bikeNumber: number, 
    overrideStudentName?: string, 
    overrideStudentPhone?: string
  ) => {
    const cleanCode = codeStr.trim().toUpperCase();
    const foundCode = spinningAccessCodes.find(c => c.code.toUpperCase() === cleanCode);

    if (!foundCode) {
      return { success: false, message: `El código "${cleanCode}" no existe o es inválido. Verifica con tu entrenador o recepción.` };
    }

    if (foundCode.status === 'redeemed') {
      return { success: false, message: `El código "${cleanCode}" ya fue canjeado el ${foundCode.redeemedAt || 'anteriormente'}.` };
    }

    if (foundCode.status === 'expired') {
      return { success: false, message: `El código "${cleanCode}" ha expirado.` };
    }

    // Determine target session (use code's session or the first available session)
    const targetSessionId = foundCode.sessionId || (spinningSessions[0] ? spinningSessions[0].id : '');
    if (!targetSessionId) {
      return { success: false, message: 'No hay sesiones de spinning disponibles actualmente para canjear este pase.' };
    }

    // Check if bike is available in that session
    const isOccupied = spinningReservations.some(
      r => r.sessionId === targetSessionId && r.bikeNumber === bikeNumber && r.status !== 'cancelled'
    );
    if (isOccupied) {
      return { success: false, message: `La bicicleta #${bikeNumber} ya está reservada para esta sesión. Por favor selecciona otro sitio en el croquis.` };
    }

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const dateStr = now.toISOString().split('T')[0];
    const occupantName = overrideStudentName || foundCode.issuedToName;
    const occupantPhone = overrideStudentPhone || foundCode.issuedToPhone;

    const newReservation: SpinningReservation = {
      id: `res-spin-${Date.now()}`,
      sessionId: targetSessionId,
      bikeNumber: bikeNumber,
      memberId: foundCode.memberId || `guest-${Date.now()}`,
      memberName: occupantName,
      memberPhone: occupantPhone,
      memberEmail: foundCode.issuedToEmail,
      status: 'confirmed',
      reservedAt: `${dateStr} ${timeStr}`,
      shoesRequirement: 'zapatilla_comun',
      isExternalGuest: foundCode.isExternal,
      paidAmount: foundCode.amountPaid,
      paymentMethod: foundCode.paymentMethod,
      receiptNumber: `REC-${cleanCode}`,
      accessCodeUsed: cleanCode,
      specialNotes: `Canjeado vía código ${cleanCode}. Verificado por ${foundCode.issuedByTrainerName}.`
    };

    // Mark code as redeemed
    setSpinningAccessCodes(prev => prev.map(c => c.id === foundCode.id ? {
      ...c,
      status: 'redeemed',
      redeemedAt: `${dateStr} ${timeStr}`,
      redeemedBikeNumber: bikeNumber
    } : c));

    setSpinningReservations(prev => [...prev, newReservation]);

    return {
      success: true,
      message: `¡Código ${cleanCode} canjeado con éxito! Bicicleta #${bikeNumber} reservada para ${occupantName}.`,
      reservation: newReservation
    };
  };

  // --- ATTENDANCE SYSTEM ACTIONS ---
  const recordAttendance = (data: Omit<AttendanceRecord, 'id' | 'date' | 'time'>) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newRecord: AttendanceRecord = {
      ...data,
      id: `att-${Date.now()}`,
      date: dateStr,
      time: timeStr
    };

    setAttendances(prev => [newRecord, ...prev]);

    return {
      success: true,
      record: newRecord,
      message: `¡Asistencia registrada para ${data.userName}!`
    };
  };

  const deleteAttendance = (id: string) => {
    setAttendances(prev => prev.filter(a => a.id !== id));
  };

  // Reset to initial mock datasets
  const resetToDefaults = () => {
    setMembers(INITIAL_MEMBERS);
    setPlans(INITIAL_PLANS);
    setTrainers(INITIAL_TRAINERS);
    setExercises(INITIAL_EXERCISES);
    setRoutines(INITIAL_ROUTINES);
    setProducts(INITIAL_PRODUCTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setNotificationRules(INITIAL_NOTIFICATION_RULES);
    setNotificationLogs(INITIAL_NOTIFICATION_LOGS);
    setClasses(INITIAL_CLASSES);
    setNutritionPlans(INITIAL_NUTRITION_PLANS);
    setBodyAssessments(INITIAL_BODY_ASSESSMENTS);
    setSpinningBikes(INITIAL_SPINNING_BIKES);
    setSpinningSessions(INITIAL_SPINNING_SESSIONS);
    setSpinningReservations(INITIAL_SPINNING_RESERVATIONS);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setSpinningAccessCodes(INITIAL_SPINNING_ACCESS_CODES);
    setAttendances(INITIAL_ATTENDANCES);
    localStorage.clear();
  };

  // Export JSON backup
  const exportDataJSON = () => {
    const backup = {
      version: '1.2',
      exportDate: new Date().toISOString(),
      members,
      plans,
      trainers,
      exercises,
      routines,
      products,
      transactions,
      notificationRules,
      notificationLogs,
      classes,
      nutritionPlans,
      bodyAssessments,
      spinningBikes,
      spinningSessions,
      spinningReservations,
      users,
      spinningAccessCodes,
      attendances
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gymcontrol_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const importDataJSON = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.members) setMembers(data.members);
      if (data.plans) setPlans(data.plans);
      if (data.trainers) setTrainers(data.trainers);
      if (data.exercises) setExercises(data.exercises);
      if (data.routines) setRoutines(data.routines);
      if (data.products) setProducts(data.products);
      if (data.transactions) setTransactions(data.transactions);
      if (data.notificationRules) setNotificationRules(data.notificationRules);
      if (data.notificationLogs) setNotificationLogs(data.notificationLogs);
      if (data.classes) setClasses(data.classes);
      if (data.nutritionPlans) setNutritionPlans(data.nutritionPlans);
      if (data.bodyAssessments) setBodyAssessments(data.bodyAssessments);
      if (data.spinningBikes) setSpinningBikes(data.spinningBikes);
      if (data.spinningSessions) setSpinningSessions(data.spinningSessions);
      if (data.spinningReservations) setSpinningReservations(data.spinningReservations);
      if (data.users) setUsers(data.users);
      if (data.spinningAccessCodes) setSpinningAccessCodes(data.spinningAccessCodes);
      if (data.attendances) setAttendances(data.attendances);
      return true;
    } catch (e) {
      console.error('Error importing backup JSON', e);
      return false;
    }
  };

  return (
    <GymContext.Provider value={{
      members,
      plans,
      trainers,
      exercises,
      routines,
      products,
      transactions,
      notificationRules,
      notificationLogs,
      classes,
      nutritionPlans,
      bodyAssessments,
      spinningBikes,
      spinningSessions,
      spinningReservations,
      users,
      currentUser,
      spinningAccessCodes,
      attendances,
      setCurrentUser,
      loginAsUser,
      registerUser,
      generateSpinningAccessCode,
      redeemSpinningAccessCode,
      recordAttendance,
      deleteAttendance,
      addMember,
      updateMember,
      deleteMember,
      renewMembership,
      assignTrainerToMember,
      assignRoutineToMember,
      addPlan,
      updatePlan,
      deletePlan,
      addTrainer,
      updateTrainer,
      deleteTrainer,
      addExercise,
      updateExercise,
      deleteExercise,
      addRoutine,
      updateRoutine,
      deleteRoutine,
      addProduct,
      updateProduct,
      deleteProduct,
      updateStock,
      processPOSSale,
      addTransaction,
      deleteTransaction,
      updateNotificationRule,
      toggleNotificationRule,
      addNotificationLog,
      sendDirectNotification,
      sendManualCampaign,
      triggerRealWebNotification,
      clearNotificationLogs,
      addClassNotice,
      deleteClassNotice,
      addNutritionPlan,
      updateNutritionPlan,
      deleteNutritionPlan,
      addBodyAssessment,
      updateBodyAssessment,
      deleteBodyAssessment,
      getAssessmentsByMemberId,
      addSpinningSession,
      deleteSpinningSession,
      reserveSpinningBike,
      cancelSpinningReservation,
      checkInSpinningReservation,
      toggleBikeMaintenance,
      renewalAlerts,
      lowStockProducts,
      metrics,
      getMemberById,
      getTrainerById,
      getRoutineById,
      getPlanById,
      getProductById,
      generateWhatsAppLink,
      resetToDefaults,
      exportDataJSON,
      importDataJSON
    }}>
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};

