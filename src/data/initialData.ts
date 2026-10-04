import { 
  Member, 
  MembershipPlan, 
  Trainer, 
  Exercise, 
  Routine, 
  Product, 
  Transaction,
  NotificationRule,
  NotificationLog,
  GymClassNotice,
  NutritionPlan,
  BodyAssessment,
  SpinningBike,
  SpinningSession,
  SpinningReservation,
  AppUser,
  SpinningAccessCode,
  AttendanceRecord
} from '../types/gym';

export const INITIAL_PLANS: MembershipPlan[] = [
  {
    id: 'plan-1',
    name: 'Pase Diario',
    durationMonths: 0,
    durationDays: 1,
    price: 15,
    description: 'Acceso total por 1 día a todas las instalaciones.',
    includesTrainer: false,
    features: ['Acceso a sala de pesas y cardio', 'Uso de vestuarios y duchas', 'Sin contrato']
  },
  {
    id: 'plan-2',
    name: 'Mensual Básico',
    durationMonths: 1,
    durationDays: 30,
    price: 120,
    description: 'Plan mensual ideal para comenzar tu cambio físico.',
    includesTrainer: false,
    features: ['Acceso ilimitado 7 días a la semana', 'Área de musculación y cardio', 'Evaluación física inicial', 'Casillero de uso diario']
  },
  {
    id: 'plan-3',
    name: 'Trimestral Pro',
    durationMonths: 3,
    durationDays: 90,
    price: 320,
    popular: true,
    description: 'Nuestro plan más elegido. Mayor constancia y descuento especial.',
    includesTrainer: true,
    features: ['Acceso ilimitado a todas las sedes', 'Asignación de rutina personalizada', '1 sesión semanal con entrenador personal', 'Acceso a clases grupales (Spinning, Funcional)', '10% de descuento en suplementos de tienda']
  },
  {
    id: 'plan-4',
    name: 'Semestral Power',
    durationMonths: 6,
    durationDays: 180,
    price: 580,
    description: 'Compromiso de mediano plazo para transformaciones reales.',
    includesTrainer: true,
    features: ['Acceso total ilimitado', 'Entrenador asignado con seguimiento quincenal', 'Plan nutricional sugerido', 'Congelamiento hasta por 30 días', '15% de descuento en tienda']
  },
  {
    id: 'plan-5',
    name: 'Anual VIP Black',
    durationMonths: 12,
    durationDays: 365,
    price: 990,
    description: 'La experiencia definitiva con todos los beneficios incluidos.',
    includesTrainer: true,
    features: ['Acceso VIP total y prioritario', 'Entrenador personal asignado continuo', 'Invita a un amigo 2 veces por mes', 'Congelamiento hasta por 60 días', 'Kit de bienvenida (Toalla + Shaker)', '20% de descuento en suplementos']
  }
];

export const INITIAL_TRAINERS: Trainer[] = [
  {
    id: 'trainer-1',
    name: 'Carlos Mendoza',
    specialization: 'Hipertrofia & Fuerza Máxima',
    phone: '+51987654321',
    email: 'carlos.mendoza@gymcontrol.com',
    photoUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&auto=format&fit=crop&q=80',
    bio: 'Certificado IFBB Pro Coach con más de 8 años guiando atletas y principiantes en ganancia muscular y recomposición corporal.',
    rating: 4.9,
    availableSchedule: 'Lun - Sáb: 6:00 AM - 2:00 PM'
  },
  {
    id: 'trainer-2',
    name: 'Sofía Valdivia',
    specialization: 'Pérdida de Grasa & Acondicionamiento',
    phone: '+51987112233',
    email: 'sofia.valdivia@gymcontrol.com',
    photoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format&fit=crop&q=80',
    bio: 'Licenciada en Ciencias del Deporte, especialista en HIIT, entrenamiento metabólico y nutrición aplicada.',
    rating: 5.0,
    availableSchedule: 'Lun - Vie: 2:00 PM - 10:00 PM'
  },
  {
    id: 'trainer-3',
    name: 'Mateo Ríos',
    specialization: 'Powerlifting & Calistenia',
    phone: '+51976543210',
    email: 'mateo.rios@gymcontrol.com',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Especialista en movilidad articular, técnica de levantamientos pesados (sentadilla, press banca, peso muerto) y dominadas lastradas.',
    rating: 4.8,
    availableSchedule: 'Lun - Sáb: 7:00 AM - 3:00 PM'
  },
  {
    id: 'trainer-4',
    name: 'Valeria Gómez',
    specialization: 'Glúteos, Piernas & Salud Postural',
    phone: '+51965432198',
    email: 'valeria.gomez@gymcontrol.com',
    photoUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&auto=format&fit=crop&q=80',
    bio: 'Entrenadora certificada en biomecánica enfocada en tren inferior y rehabilitación funcional de lesiones lumbares.',
    rating: 4.9,
    availableSchedule: 'Lun - Vie: 6:00 AM - 1:00 PM / 5:00 PM - 9:00 PM'
  }
];

export const INITIAL_EXERCISES: Exercise[] = [
  // PECHO
  {
    id: 'ex-1',
    name: 'Press de Banca Plano con Barra',
    muscleGroup: 'pecho',
    secondaryMuscles: ['Tríceps', 'Deltoides anterior'],
    equipment: 'barra',
    difficulty: 'intermedio',
    instructions: 'Acuéstate sobre el banco plano con los pies firmes en el suelo. Retrae las escápulas, desciende la barra de forma controlada al pecho medio y empuja explosivamente hacia arriba sin bloquear codos bruscamente.',
    tips: 'Mantén un arco lumbar natural y los codos en ángulo de 45-60 grados respecto al torso.',
    targetSetsRepsDefault: '4 series x 8-10 reps',
    videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-2',
    name: 'Press Inclinado con Mancuernas',
    muscleGroup: 'pecho',
    secondaryMuscles: ['Deltoides anterior', 'Tríceps'],
    equipment: 'mancuernas',
    difficulty: 'intermedio',
    instructions: 'Banco a 30-45 grados. Sube las mancuernas con control, estira el pectoral en el fondo y contrae arriba sin chocar las mancuernas.',
    tips: 'Excelente para enfatizar la porción clavicular del pectoral.',
    targetSetsRepsDefault: '4 series x 10-12 reps',
    videoUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-3',
    name: 'Aperturas en Poleas (Cruces)',
    muscleGroup: 'pecho',
    secondaryMuscles: ['Deltoides anterior'],
    equipment: 'polea',
    difficulty: 'principiante',
    instructions: 'Coloca las poleas a media o alta altura. Da un paso al frente con el torso levemente inclinado y junta las manos frente al pecho apretando 1 segundo.',
    tips: 'Mantén una ligera flexión constante de codos durante todo el recorrido.',
    targetSetsRepsDefault: '3 series x 12-15 reps',
    videoUrl: 'https://www.youtube.com/watch?v=taI4XduLpBe',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-4',
    name: 'Fondos en Paralelas para Pecho',
    muscleGroup: 'pecho',
    secondaryMuscles: ['Tríceps', 'Hombros'],
    equipment: 'peso_corporal',
    difficulty: 'avanzado',
    instructions: 'Inclina el torso 30 grados hacia adelante y baja hasta que los codos formen 90 grados, sintiendo el estiramiento en el pectoral.',
    tips: 'Evita descender en exceso si tienes molestias en el hombro.',
    targetSetsRepsDefault: '3 series x 8-12 reps',
    videoUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&auto=format&fit=crop&q=80'
  },

  // ESPALDA
  {
    id: 'ex-5',
    name: 'Dominadas Pronas (Pull-ups)',
    muscleGroup: 'espalda',
    secondaryMuscles: ['Bíceps', 'Braquial', 'Core'],
    equipment: 'peso_corporal',
    difficulty: 'avanzado',
    instructions: 'Agarre más ancho que los hombros. Tira con los codos hacia abajo llevando el pecho a la barra y desciende lentamente.',
    tips: 'No te balancees; activa la espalda antes de flexionar los brazos.',
    targetSetsRepsDefault: '4 series x 6-10 reps',
    videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-6',
    name: 'Jalón al Pecho en Polea Alta',
    muscleGroup: 'espalda',
    secondaryMuscles: ['Bíceps', 'Dorsal ancho'],
    equipment: 'polea',
    difficulty: 'principiante',
    instructions: 'Sujeta la barra ancha, reclina el torso 10 grados y lleva la barra hacia la parte superior del esternón sacando pecho.',
    tips: 'Imagina que tiras desde los codos, no desde las muñecas.',
    targetSetsRepsDefault: '4 series x 10-12 reps',
    videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-7',
    name: 'Remo con Barra Inclinado (Pendlay / Tradicional)',
    muscleGroup: 'espalda',
    secondaryMuscles: ['Erectores espinales', 'Trapecio', 'Bíceps'],
    equipment: 'barra',
    difficulty: 'intermedio',
    instructions: 'Espalda recta paralela o a 45 grados del suelo. Tira de la barra hacia el ombligo apretando las escápulas.',
    tips: 'Aprieta el abdomen para proteger la zona lumbar.',
    targetSetsRepsDefault: '4 series x 8-10 reps',
    videoUrl: 'https://www.youtube.com/watch?v=G8l_8chR5BE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-8',
    name: 'Remo Gironda en Polea Baja',
    muscleGroup: 'espalda',
    secondaryMuscles: ['Bíceps', 'Romboide'],
    equipment: 'polea',
    difficulty: 'principiante',
    instructions: 'Agarre en V, mantén la espalda erguida y lleva el agarre al abdomen manteniendo los codos pegados.',
    tips: 'Pausa de 1 segundo en la máxima contracción.',
    targetSetsRepsDefault: '3 series x 12 reps',
    videoUrl: 'https://www.youtube.com/watch?v=GZbfZ033f74',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80'
  },

  // CUADRICEPS Y PIERNAS
  {
    id: 'ex-9',
    name: 'Sentadilla Trasera con Barra (Back Squat)',
    muscleGroup: 'cuadriceps',
    secondaryMuscles: ['Glúteos', 'Isquiotibiales', 'Core'],
    equipment: 'barra',
    difficulty: 'intermedio',
    instructions: 'Barra sobre los trapecios. Desciende flexionando caderas y rodillas hasta romper el paralelo (90 grados) y sube con fuerza empujando el suelo.',
    tips: 'Mantén las rodillas alineadas con la punta de los pies y la mirada al frente.',
    targetSetsRepsDefault: '4 series x 6-8 reps',
    videoUrl: 'https://www.youtube.com/watch?v=bEv6CCg2BC8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-10',
    name: 'Prensa de Piernas 45 Grados',
    muscleGroup: 'cuadriceps',
    secondaryMuscles: ['Glúteos'],
    equipment: 'maquina',
    difficulty: 'principiante',
    instructions: 'Pies al ancho de hombros en la plataforma. Baja el peso flexionando rodillas sin despegar el coxis del respaldo y empuja sin bloquear las rodillas al final.',
    tips: 'Nunca bloquees las rodillas por completo en la extensión.',
    targetSetsRepsDefault: '4 series x 10-12 reps',
    videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-11',
    name: 'Extensión de Cuádriceps en Máquina',
    muscleGroup: 'cuadriceps',
    secondaryMuscles: [],
    equipment: 'maquina',
    difficulty: 'principiante',
    instructions: 'Ajusta el cojín sobre los tobillos. Extiende las piernas contrayendo los cuádriceps arriba durante 1 segundo y baja lentamente.',
    tips: 'Excelente ejercicio para aislamiento previo o finalizador.',
    targetSetsRepsDefault: '3 series x 12-15 reps',
    videoUrl: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-12',
    name: 'Búlgaras con Mancuernas',
    muscleGroup: 'cuadriceps',
    secondaryMuscles: ['Glúteos', 'Estabilizadores'],
    equipment: 'mancuernas',
    difficulty: 'avanzado',
    instructions: 'Un pie apoyado atrás en un banco y la pierna delantera adelantada. Desciende verticalmente hasta que la rodilla trasera roce el suelo.',
    tips: 'Inclinar un poco el torso potencia el trabajo de glúteo.',
    targetSetsRepsDefault: '3 series x 10 reps por pierna',
    videoUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&auto=format&fit=crop&q=80'
  },

  // ISQUIOS Y GLÚTEOS
  {
    id: 'ex-13',
    name: 'Hip Thrust con Barra (Empuje de Cadera)',
    muscleGroup: 'isquiotibiales_gluteos',
    secondaryMuscles: ['Isquios', 'Core'],
    equipment: 'barra',
    difficulty: 'intermedio',
    instructions: 'Espalda superior apoyada en un banco, barra acolchada sobre las caderas. Eleva la pelvis empujando con los talones hasta alinear torso y muslos.',
    tips: 'Apreta los glúteos en el tope 2 segundos y mete la barbilla al pecho.',
    targetSetsRepsDefault: '4 series x 8-12 reps',
    videoUrl: 'https://www.youtube.com/watch?v=SEdqd1n0cvg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-14',
    name: 'Peso Muerto Rumano con Mancuernas / Barra',
    muscleGroup: 'isquiotibiales_gluteos',
    secondaryMuscles: ['Erectores', 'Espalda alta'],
    equipment: 'barra',
    difficulty: 'intermedio',
    instructions: 'Rodillas semiflexionadas y fijas. Empuja las caderas hacia atrás sintiendo un gran estiramiento en los femorales y regresa contrayendo glúteos.',
    tips: 'La barra debe deslizarse rozando las piernas todo el tiempo.',
    targetSetsRepsDefault: '4 series x 10-12 reps',
    videoUrl: 'https://www.youtube.com/watch?v=JCXUYuzwNrM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-15',
    name: 'Curl Femoral Tumbado en Máquina',
    muscleGroup: 'isquiotibiales_gluteos',
    secondaryMuscles: ['Pantorrillas'],
    equipment: 'maquina',
    difficulty: 'principiante',
    instructions: 'Boca abajo con el rodillo en la parte posterior de los tobillos. Flexiona las rodillas llevando los talones a los glúteos de manera controlada.',
    tips: 'Mantén la pelvis pegada a la banca para no trampear con la zona lumbar.',
    targetSetsRepsDefault: '3 series x 12-15 reps',
    videoUrl: 'https://www.youtube.com/watch?v=1Tq3EDRy_yU',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80'
  },

  // HOMBROS
  {
    id: 'ex-16',
    name: 'Press Militar con Mancuernas Sentado',
    muscleGroup: 'hombros',
    secondaryMuscles: ['Tríceps', 'Trapecio'],
    equipment: 'mancuernas',
    difficulty: 'intermedio',
    instructions: 'Sentado con respaldo a 80-90 grados. Empuja las mancuernas por encima de la cabeza y bájalas a la altura de las orejas.',
    tips: 'Evita arquear excesivamente la zona lumbar.',
    targetSetsRepsDefault: '4 series x 8-10 reps',
    videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-17',
    name: 'Elevaciones Laterales con Mancuernas',
    muscleGroup: 'hombros',
    secondaryMuscles: ['Trapecio'],
    equipment: 'mancuernas',
    difficulty: 'principiante',
    instructions: 'De pie o sentado, eleva los brazos lateralmente con los codos ligeramente flexionados hasta la altura de los hombros.',
    tips: 'Lidera el movimiento con los codos y no uses impulso con el cuerpo.',
    targetSetsRepsDefault: '4 series x 12-15 reps',
    videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-18',
    name: 'Face Pulls en Polea Alta con Cuerda',
    muscleGroup: 'hombros',
    secondaryMuscles: ['Manguito rotador', 'Deltoides posterior', 'Trapecio'],
    equipment: 'polea',
    difficulty: 'principiante',
    instructions: 'Tira de la cuerda hacia la cara/ojos, rotando externamente los hombros de modo que los nudillos apunten hacia atrás.',
    tips: 'Fundamental para la salud y postura del hombro.',
    targetSetsRepsDefault: '3 series x 15 reps',
    videoUrl: 'https://www.youtube.com/watch?v=rep-qVOkqgk',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format&fit=crop&q=80'
  },

  // BÍCEPS & TRÍCEPS
  {
    id: 'ex-19',
    name: 'Curl de Bíceps con Barra Z',
    muscleGroup: 'biceps',
    secondaryMuscles: ['Antebrazos'],
    equipment: 'barra',
    difficulty: 'principiante',
    instructions: 'De pie con agarre supino en los ángulos de la barra Z. Flexiona los codos sin mover los hombros hacia adelante y baja en 2 segundos.',
    tips: 'La barra Z reduce la tensión en las muñecas.',
    targetSetsRepsDefault: '3 series x 10-12 reps',
    videoUrl: 'https://www.youtube.com/watch?v=in7PaeYlhrM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-20',
    name: 'Curl Martillo con Mancuernas',
    muscleGroup: 'biceps',
    secondaryMuscles: ['Braquial', 'Braquiorradial'],
    equipment: 'mancuernas',
    difficulty: 'principiante',
    instructions: 'Agarre neutro (palmas enfrentadas). Eleva las mancuernas para desarrollar el grosor del brazo.',
    tips: 'Puedes hacerlo alterno o simultáneo.',
    targetSetsRepsDefault: '3 series x 12 reps',
    videoUrl: 'https://www.youtube.com/watch?v=zC3nLlEvin4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-21',
    name: 'Extensiones de Tríceps en Polea Alta con Cuerda',
    muscleGroup: 'triceps',
    secondaryMuscles: [],
    equipment: 'polea',
    difficulty: 'principiante',
    instructions: 'Codos pegados a los costados. Empuja la cuerda hacia abajo y separa los extremos al final para máxima contracción.',
    tips: 'No muevas los codos de posición fija.',
    targetSetsRepsDefault: '4 series x 12-15 reps',
    videoUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-22',
    name: 'Press Francés con Mancuernas en Banco',
    muscleGroup: 'triceps',
    secondaryMuscles: [],
    equipment: 'mancuernas',
    difficulty: 'intermedio',
    instructions: 'Acuéstate en el banco con mancuernas en alto. Flexiona únicamente los codos bajando las mancuernas a los lados de la frente y extiende.',
    tips: 'Gran énfasis en la cabeza larga del tríceps.',
    targetSetsRepsDefault: '3 series x 10-12 reps',
    videoUrl: 'https://www.youtube.com/watch?v=d_KZxkY_0cM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80'
  },

  // CORE Y ABDOMEN
  {
    id: 'ex-23',
    name: 'Plancha Abdominal Isométrica (Plank)',
    muscleGroup: 'core_abdomen',
    secondaryMuscles: ['Glúteos', 'Hombros'],
    equipment: 'peso_corporal',
    difficulty: 'principiante',
    instructions: 'Apoyo en antebrazos y puntas de pie. Cuerpo en línea recta perfecta sin hundir ni elevar la cadera.',
    tips: 'Activa el transverso y glúteos activamente.',
    targetSetsRepsDefault: '3 series x 45-60 segundos',
    videoUrl: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-24',
    name: 'Elevaciones de Piernas Colgado en Barra',
    muscleGroup: 'core_abdomen',
    secondaryMuscles: ['Flexores de cadera'],
    equipment: 'peso_corporal',
    difficulty: 'avanzado',
    instructions: 'Colgado de la barra, eleva las piernas rectas o flexionadas hacia el pecho contrayendo el abdomen.',
    tips: 'Controla el descenso para no generar balanceo.',
    targetSetsRepsDefault: '3 series x 12-15 reps',
    videoUrl: 'https://www.youtube.com/watch?v=hdng3Nm1x_E',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-25',
    name: 'Rueda Abdominal (Ab Wheel Rollout)',
    muscleGroup: 'core_abdomen',
    secondaryMuscles: ['Dorsales', 'Hombros'],
    equipment: 'otro',
    difficulty: 'avanzado',
    instructions: 'De rodillas, rueda hacia adelante manteniendo la espalda ligeramente redondeada y regresa contrayendo el core.',
    tips: 'No permitas que la zona lumbar se arquee en la extensión.',
    targetSetsRepsDefault: '3 series x 8-12 reps',
    videoUrl: 'https://www.youtube.com/watch?v=rqiTPdK1c_I',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80'
  },

  // CARDIO Y FUNCIONAL
  {
    id: 'ex-26',
    name: 'Burpees con Salto',
    muscleGroup: 'cardio_funcional',
    secondaryMuscles: ['Pecho', 'Piernas', 'Core'],
    equipment: 'peso_corporal',
    difficulty: 'intermedio',
    instructions: 'Baja a posición de plancha, haz una flexión, recupera los pies y salta verticalmente con los brazos arriba.',
    tips: 'Ritmo constante para elevar la frecuencia cardíaca.',
    targetSetsRepsDefault: '4 series x 15 reps o 45 segs',
    videoUrl: 'https://www.youtube.com/watch?v=auBLPXO8Fww',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-27',
    name: 'Kettlebell Swings (Balanceo con Pesa Rusa)',
    muscleGroup: 'cardio_funcional',
    secondaryMuscles: ['Glúteos', 'Isquios', 'Espalda baja', 'Hombros'],
    equipment: 'kettlebell',
    difficulty: 'intermedio',
    instructions: 'Bisagra de cadera explosiva. El impulso viene de los glúteos e isquiotibiales, no de los brazos.',
    tips: 'Mantén la columna neutra durante toda la trayectoria.',
    targetSetsRepsDefault: '4 series x 20 reps',
    videoUrl: 'https://www.youtube.com/watch?v=sSESeQAir2M',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-28',
    name: 'Intervalos en Assault Bike / Remo Concept2',
    muscleGroup: 'cardio_funcional',
    secondaryMuscles: ['Cuerpo completo'],
    equipment: 'maquina',
    difficulty: 'intermedio',
    instructions: 'Sprints de 20 segundos a máxima intensidad seguidos de 40 segundos de pedaleo suave de recuperación.',
    tips: 'Ideal para acondicionamiento metabólico post-entrenamiento.',
    targetSetsRepsDefault: '8 a 10 rondas de intervalos',
    videoUrl: 'https://www.youtube.com/watch?v=gT8_qQe5W44',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=400&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_ROUTINES: Routine[] = [
  {
    id: 'routine-1',
    title: 'Rutina Hipertrofia PPL (Empuje, Tirón, Pierna)',
    description: 'Programa clásico enfocado en máxima ganancia de masa muscular con excelente frecuencia y volumen equilibrado.',
    level: 'intermedio',
    objective: 'hipertrofia',
    trainerId: 'trainer-1',
    trainerName: 'Carlos Mendoza',
    createdDate: '2026-08-01',
    days: [
      {
        dayName: 'Día 1: Empuje (Pecho, Hombro anterior/lateral, Tríceps)',
        focus: 'Pectorales y tríceps con énfasis en fuerza e hipertrofia',
        notes: 'Calentar 5 minutos antes y realizar series de aproximación en banca.',
        exercises: [
          { exerciseId: 'ex-1', exerciseName: 'Press de Banca Plano con Barra', muscleGroup: 'pecho', sets: 4, reps: '8-10', rir: 'RIR 1-2', restSeconds: 120, notes: 'Series pesadas' },
          { exerciseId: 'ex-2', exerciseName: 'Press Inclinado con Mancuernas', muscleGroup: 'pecho', sets: 4, reps: '10-12', rir: 'RIR 2', restSeconds: 90, notes: 'Enfoque en pecho superior' },
          { exerciseId: 'ex-16', exerciseName: 'Press Militar con Mancuernas Sentado', muscleGroup: 'hombros', sets: 3, reps: '10', rir: 'RIR 1', restSeconds: 90 },
          { exerciseId: 'ex-17', exerciseName: 'Elevaciones Laterales con Mancuernas', muscleGroup: 'hombros', sets: 4, reps: '15', rir: 'Fallo', restSeconds: 60, notes: 'Controlar la bajada' },
          { exerciseId: 'ex-21', exerciseName: 'Extensiones de Tríceps en Polea Alta con Cuerda', muscleGroup: 'triceps', sets: 4, reps: '12-15', rir: 'RIR 1', restSeconds: 60 }
        ]
      },
      {
        dayName: 'Día 2: Tirón (Espalda, Deltoides posterior, Bíceps)',
        focus: 'Dorsales, trapecios y flexores de codo',
        notes: 'Cuidar la retracción escapular en cada tirón.',
        exercises: [
          { exerciseId: 'ex-5', exerciseName: 'Dominadas Pronas (Pull-ups)', muscleGroup: 'espalda', sets: 4, reps: '6-8', rir: 'RIR 1', restSeconds: 120 },
          { exerciseId: 'ex-7', exerciseName: 'Remo con Barra Inclinado', muscleGroup: 'espalda', sets: 4, reps: '8-10', rir: 'RIR 2', restSeconds: 90 },
          { exerciseId: 'ex-6', exerciseName: 'Jalón al Pecho en Polea Alta', muscleGroup: 'espalda', sets: 3, reps: '12', rir: 'RIR 1', restSeconds: 75 },
          { exerciseId: 'ex-18', exerciseName: 'Face Pulls en Polea Alta con Cuerda', muscleGroup: 'hombros', sets: 3, reps: '15', rir: 'RIR 2', restSeconds: 60 },
          { exerciseId: 'ex-19', exerciseName: 'Curl de Bíceps con Barra Z', muscleGroup: 'biceps', sets: 3, reps: '10-12', rir: 'RIR 1', restSeconds: 60 },
          { exerciseId: 'ex-20', exerciseName: 'Curl Martillo con Mancuernas', muscleGroup: 'biceps', sets: 3, reps: '12', rir: 'RIR 1', restSeconds: 60 }
        ]
      },
      {
        dayName: 'Día 3: Pierna Completa & Abdomen',
        focus: 'Cuádriceps, glúteos, femorales y core',
        notes: 'Buena hidratación requerida para alta demanda energética.',
        exercises: [
          { exerciseId: 'ex-9', exerciseName: 'Sentadilla Trasera con Barra', muscleGroup: 'cuadriceps', sets: 4, reps: '6-8', rir: 'RIR 2', restSeconds: 150 },
          { exerciseId: 'ex-13', exerciseName: 'Hip Thrust con Barra', muscleGroup: 'isquiotibiales_gluteos', sets: 4, reps: '10-12', rir: 'RIR 1', restSeconds: 120 },
          { exerciseId: 'ex-10', exerciseName: 'Prensa de Piernas 45 Grados', muscleGroup: 'cuadriceps', sets: 3, reps: '12', rir: 'RIR 2', restSeconds: 90 },
          { exerciseId: 'ex-15', exerciseName: 'Curl Femoral Tumbado en Máquina', muscleGroup: 'isquiotibiales_gluteos', sets: 3, reps: '12-15', rir: 'RIR 1', restSeconds: 60 },
          { exerciseId: 'ex-23', exerciseName: 'Plancha Abdominal Isométrica', muscleGroup: 'core_abdomen', sets: 3, reps: '60s', restSeconds: 60 }
        ]
      }
    ]
  },
  {
    id: 'routine-2',
    title: 'Rutina Pérdida de Grasa & Tonificación Metabólica',
    description: 'Circuitos de fuerza combinados con trabajo cardiovascular de alta densidad para quemar calorías y tonificar.',
    level: 'principiante',
    objective: 'perdida_peso',
    trainerId: 'trainer-2',
    trainerName: 'Sofía Valdivia',
    createdDate: '2026-08-10',
    days: [
      {
        dayName: 'Día A: Full Body Funcional A',
        focus: 'Tren inferior y empujes con intervalos',
        exercises: [
          { exerciseId: 'ex-10', exerciseName: 'Prensa de Piernas 45 Grados', muscleGroup: 'cuadriceps', sets: 4, reps: '15', restSeconds: 60 },
          { exerciseId: 'ex-2', exerciseName: 'Press Inclinado con Mancuernas', muscleGroup: 'pecho', sets: 3, reps: '12', restSeconds: 60 },
          { exerciseId: 'ex-27', exerciseName: 'Kettlebell Swings', muscleGroup: 'cardio_funcional', sets: 4, reps: '20', restSeconds: 45 },
          { exerciseId: 'ex-24', exerciseName: 'Elevaciones de Piernas Colgado', muscleGroup: 'core_abdomen', sets: 3, reps: '12', restSeconds: 45 },
          { exerciseId: 'ex-28', exerciseName: 'Intervalos en Assault Bike', muscleGroup: 'cardio_funcional', sets: 6, reps: '30s on / 30s off', restSeconds: 60 }
        ]
      },
      {
        dayName: 'Día B: Full Body Funcional B',
        focus: 'Cadena posterior y tracciones',
        exercises: [
          { exerciseId: 'ex-14', exerciseName: 'Peso Muerto Rumano con Mancuernas', muscleGroup: 'isquiotibiales_gluteos', sets: 4, reps: '12', restSeconds: 60 },
          { exerciseId: 'ex-6', exerciseName: 'Jalón al Pecho en Polea Alta', muscleGroup: 'espalda', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'ex-12', exerciseName: 'Búlgaras con Mancuernas', muscleGroup: 'cuadriceps', sets: 3, reps: '10 c/u', restSeconds: 60 },
          { exerciseId: 'ex-26', exerciseName: 'Burpees con Salto', muscleGroup: 'cardio_funcional', sets: 4, reps: '12', restSeconds: 60 },
          { exerciseId: 'ex-23', exerciseName: 'Plancha Abdominal Isométrica', muscleGroup: 'core_abdomen', sets: 3, reps: '45s', restSeconds: 45 }
        ]
      }
    ]
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Agua Mineral San Mateo 750ml',
    category: 'bebidas',
    brand: 'San Mateo',
    purchaseCost: 1.5,
    salePrice: 3.5,
    stock: 48,
    minStockAlert: 15,
    description: 'Agua de manantial natural en botella deportiva.'
  },
  {
    id: 'prod-2',
    name: 'Gatorade Cool Blue 500ml',
    category: 'bebidas',
    brand: 'Gatorade',
    purchaseCost: 2.8,
    salePrice: 5.5,
    stock: 24,
    minStockAlert: 10,
    description: 'Bebida isotónica hidratante con electrolitos para reponer energía.'
  },
  {
    id: 'prod-3',
    name: 'Red Bull Energy Drink 250ml',
    category: 'bebidas',
    brand: 'Red Bull',
    purchaseCost: 4.5,
    salePrice: 8.0,
    stock: 18,
    minStockAlert: 8,
    description: 'Bebida energética para antes de entrenar.'
  },
  {
    id: 'prod-4',
    name: 'Proteína Whey Gold Standard 2 lbs (Chocolate)',
    category: 'suplementos',
    brand: 'Optimum Nutrition',
    purchaseCost: 120.0,
    salePrice: 175.0,
    stock: 12,
    minStockAlert: 4,
    description: '24g de proteína de suero aislada y concentrada por porción con BCAAs y glutamina.'
  },
  {
    id: 'prod-5',
    name: 'Proteína ISO 100 Dymatize 1.6 lbs (Vainilla)',
    category: 'suplementos',
    brand: 'Dymatize',
    purchaseCost: 145.0,
    salePrice: 210.0,
    stock: 6,
    minStockAlert: 3,
    description: 'Proteína 100% hidrolizada de máxima pureza, sin lactosa y de rápida absorción.'
  },
  {
    id: 'prod-6',
    name: 'Creatina Monohidratada Micronizada 300g',
    category: 'suplementos',
    brand: 'Universal Nutrition',
    purchaseCost: 55.0,
    salePrice: 89.0,
    stock: 14,
    minStockAlert: 5,
    description: 'Creatina ultra pura de grado farmacéutico para aumento de fuerza y volumen celular.'
  },
  {
    id: 'prod-7',
    name: 'Pre-Entreno C4 Original 30 Servicios (Fruit Punch)',
    category: 'suplementos',
    brand: 'Cellucor',
    purchaseCost: 70.0,
    salePrice: 110.0,
    stock: 8,
    minStockAlert: 3,
    description: 'Fórmula pre-workout con cafeína, beta-alanina y nitratos para máxima congestión.'
  },
  {
    id: 'prod-8',
    name: 'BCAA 2:1:1 Energy Powder 300g (Sandía)',
    category: 'suplementos',
    brand: 'Scivation Xtend',
    purchaseCost: 65.0,
    salePrice: 95.0,
    stock: 9,
    minStockAlert: 3,
    description: 'Aminoácidos ramificados para intra-entrenamiento y recuperación muscular.'
  },
  {
    id: 'prod-9',
    name: 'Barrita de Proteína Quest Bar 60g (Cookies & Cream)',
    category: 'snacks',
    brand: 'Quest Nutrition',
    purchaseCost: 6.5,
    salePrice: 12.0,
    stock: 35,
    minStockAlert: 10,
    description: '21g de proteína y menos de 1g de azúcar con deliciosa textura crocante.'
  },
  {
    id: 'prod-10',
    name: 'Barrita Proteica Power Crunch 40g',
    category: 'snacks',
    brand: 'Power Crunch',
    purchaseCost: 5.0,
    salePrice: 9.5,
    stock: 28,
    minStockAlert: 8,
    description: 'Barrita wafer proteica ligera y crujiente.'
  },
  {
    id: 'prod-11',
    name: 'Shaker Pro BlenderBottle 700ml con Mezclador',
    category: 'accesorios',
    brand: 'BlenderBottle',
    purchaseCost: 15.0,
    salePrice: 29.0,
    stock: 20,
    minStockAlert: 5,
    description: 'Vaso mezclador libre de BPA con bola batidora de acero inoxidable.'
  },
  {
    id: 'prod-12',
    name: 'Straps de Levantamiento de Algodón Acolchado',
    category: 'accesorios',
    brand: 'GymControl Gear',
    purchaseCost: 12.0,
    salePrice: 25.0,
    stock: 15,
    minStockAlert: 4,
    description: 'Correas resistentes para agarre en peso muerto y remos pesados.'
  },
  {
    id: 'prod-13',
    name: 'Cinturón Lumbar de Neopreno con Velcro',
    category: 'accesorios',
    brand: 'Harbinger',
    purchaseCost: 45.0,
    salePrice: 75.0,
    stock: 5,
    minStockAlert: 2,
    description: 'Soporte abdominal y lumbar para sentadillas y levantamientos pesados.'
  },
  {
    id: 'prod-14',
    name: 'Toalla Microfibra Deportiva GymControl',
    category: 'ropa',
    brand: 'GymControl',
    purchaseCost: 8.0,
    salePrice: 18.0,
    stock: 25,
    minStockAlert: 6,
    description: 'Toalla absorbente antibacteriana de secado ultra rápido.'
  },
  {
    id: 'prod-15',
    name: 'Camiseta Dry-Fit GymControl Performance',
    category: 'ropa',
    brand: 'GymControl',
    purchaseCost: 20.0,
    salePrice: 42.0,
    stock: 16,
    minStockAlert: 4,
    description: 'Camiseta transpirable de entrenamiento con tecnología anti-sudor.'
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem-1',
    dni: '74829103',
    fullName: 'Alejandro Ramos Silva',
    email: 'alejandro.ramos@gmail.com',
    phone: '+51987456123',
    gender: 'M',
    birthDate: '1995-04-12',
    emergencyContact: {
      name: 'Maria Silva (Madre)',
      phone: '+51987456100',
      relationship: 'Madre'
    },
    medicalNotes: 'Sin antecedentes relevantes. Apto médico al día.',
    objective: 'hipertrofia',
    planId: 'plan-3',
    planName: 'Trimestral Pro',
    membershipStartDate: '2026-06-01',
    membershipEndDate: '2026-09-01', // Expiring in 2 days from reference Aug 30, 2026
    status: 'expiring_soon',
    assignedTrainerId: 'trainer-1',
    assignedRoutineId: 'routine-1',
    registrationDate: '2025-06-01',
    notes: 'Entrena por las mañanas. Muy disciplinado.',
    lastPaymentAmount: 320,
    lastPaymentDate: '2026-06-01'
  },
  {
    id: 'mem-2',
    dni: '45892147',
    fullName: 'Lucía Fernández Torres',
    email: 'lucia.fernandez@hotmail.com',
    phone: '+51912345678',
    gender: 'F',
    birthDate: '1998-11-20',
    emergencyContact: {
      name: 'Jorge Fernandez',
      phone: '+51912345670',
      relationship: 'Padre'
    },
    medicalNotes: 'Molestia leve en rodilla izquierda en flexión profunda.',
    objective: 'perdida_peso',
    planId: 'plan-2',
    planName: 'Mensual Básico',
    membershipStartDate: '2026-08-01',
    membershipEndDate: '2026-08-31', // Expiring tomorrow!
    status: 'expiring_soon',
    assignedTrainerId: 'trainer-2',
    assignedRoutineId: 'routine-2',
    registrationDate: '2026-08-01',
    notes: 'Objetivo: bajar 4kg y mejorar resistencia cardiovascular.',
    lastPaymentAmount: 120,
    lastPaymentDate: '2026-08-01'
  },
  {
    id: 'mem-3',
    dni: '71239845',
    fullName: 'Rodrigo Morales Quispe',
    email: 'rodrigo.mq@gmail.com',
    phone: '+51998877665',
    gender: 'M',
    birthDate: '1992-07-15',
    emergencyContact: {
      name: 'Carla Morales',
      phone: '+51998877600',
      relationship: 'Hermana'
    },
    medicalNotes: 'Ninguna',
    objective: 'fuerza',
    planId: 'plan-4',
    planName: 'Semestral Power',
    membershipStartDate: '2026-05-15',
    membershipEndDate: '2026-11-15',
    status: 'active',
    assignedTrainerId: 'trainer-3',
    assignedRoutineId: 'routine-1',
    registrationDate: '2026-05-15',
    notes: 'Practicante de levantamiento de potencia.',
    lastPaymentAmount: 580,
    lastPaymentDate: '2026-05-15'
  },
  {
    id: 'mem-4',
    dni: '09876543',
    fullName: 'Camila Benitez Paredes',
    email: 'camila.benitez@outlook.com',
    phone: '+51965412389',
    gender: 'F',
    birthDate: '2001-02-28',
    emergencyContact: {
      name: 'Esteban Paredes',
      phone: '+51965412300',
      relationship: 'Tío'
    },
    medicalNotes: 'Asma leve inducida por ejercicio en frío. Lleva inhalador.',
    objective: 'tonificacion',
    planId: 'plan-5',
    planName: 'Anual VIP Black',
    membershipStartDate: '2026-01-10',
    membershipEndDate: '2027-01-10',
    status: 'active',
    assignedTrainerId: 'trainer-4',
    assignedRoutineId: 'routine-2',
    registrationDate: '2026-01-10',
    notes: 'Clienta VIP. Asiste a clases de spinning por las tardes.',
    lastPaymentAmount: 990,
    lastPaymentDate: '2026-01-10'
  },
  {
    id: 'mem-5',
    dni: '43928174',
    fullName: 'Diego Salazar Cárdenas',
    email: 'diego.salazar@yahoo.es',
    phone: '+51954321987',
    gender: 'M',
    birthDate: '1989-09-05',
    emergencyContact: {
      name: 'Rosa Cárdenas',
      phone: '+51954321900',
      relationship: 'Madre'
    },
    medicalNotes: 'Operación de menisco hace 4 años (totalmente recuperado).',
    objective: 'hipertrofia',
    planId: 'plan-2',
    planName: 'Mensual Básico',
    membershipStartDate: '2026-07-25',
    membershipEndDate: '2026-08-25', // Expired 5 days ago!
    status: 'expired',
    assignedTrainerId: 'trainer-1',
    registrationDate: '2026-02-10',
    notes: 'Pendiente de llamada para renovación con promoción trimestral.',
    lastPaymentAmount: 120,
    lastPaymentDate: '2026-07-25'
  },
  {
    id: 'mem-6',
    dni: '78291034',
    fullName: 'Mariana Chávez Rojas',
    email: 'mariana.chavez@gmail.com',
    phone: '+51933221100',
    gender: 'F',
    birthDate: '1996-12-04',
    emergencyContact: {
      name: 'Gonzalo Chávez',
      phone: '+51933221199',
      relationship: 'Hermano'
    },
    medicalNotes: 'Ninguna',
    objective: 'salud_rehabilitacion',
    planId: 'plan-3',
    planName: 'Trimestral Pro',
    membershipStartDate: '2026-07-01',
    membershipEndDate: '2026-10-01',
    status: 'active',
    assignedTrainerId: 'trainer-4',
    registrationDate: '2026-07-01',
    notes: 'Enfoque en postura y fortalecimiento de espalda baja.',
    lastPaymentAmount: 320,
    lastPaymentDate: '2026-07-01'
  },
  {
    id: 'mem-7',
    dni: '65432109',
    fullName: 'Gabriel Vega Montalvo',
    email: 'gabriel.vega@gmail.com',
    phone: '+51922334455',
    gender: 'M',
    birthDate: '1999-03-18',
    emergencyContact: {
      name: 'Silvia Montalvo',
      phone: '+51922334400',
      relationship: 'Madre'
    },
    medicalNotes: 'Ninguna',
    objective: 'resistencia',
    planId: 'plan-2',
    planName: 'Mensual Básico',
    membershipStartDate: '2026-07-28',
    membershipEndDate: '2026-08-28', // Expired 2 days ago!
    status: 'expired',
    assignedTrainerId: 'trainer-2',
    registrationDate: '2026-06-28',
    notes: 'Practica triatlón.',
    lastPaymentAmount: 120,
    lastPaymentDate: '2026-07-28'
  },
  {
    id: 'mem-8',
    dni: '87654321',
    fullName: 'Fiorella Castro Alarcón',
    email: 'fiorella.castro@gmail.com',
    phone: '+51911447788',
    gender: 'F',
    birthDate: '1994-08-30',
    emergencyContact: {
      name: 'David Alarcón',
      phone: '+51911447700',
      relationship: 'Esposo'
    },
    medicalNotes: 'Ninguna',
    objective: 'tonificacion',
    planId: 'plan-4',
    planName: 'Semestral Power',
    membershipStartDate: '2026-08-15',
    membershipEndDate: '2027-02-15',
    status: 'active',
    assignedTrainerId: 'trainer-4',
    registrationDate: '2026-08-15',
    notes: 'Recién inscrita este mes. Cumpleaños hoy 30 de agosto!',
    lastPaymentAmount: 580,
    lastPaymentDate: '2026-08-15'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // INGRESOS POR MEMBRESÍAS RECIENTES
  {
    id: 'tx-1',
    type: 'income',
    category: 'membership',
    amount: 580,
    date: '2026-08-15',
    paymentMethod: 'tarjeta',
    description: 'Membresía Semestral Power - Fiorella Castro Alarcón',
    relatedMemberId: 'mem-8',
    relatedMemberName: 'Fiorella Castro Alarcón',
    receiptNumber: 'REC-2026-0881'
  },
  {
    id: 'tx-2',
    type: 'income',
    category: 'membership',
    amount: 120,
    date: '2026-08-01',
    paymentMethod: 'yape_plin',
    description: 'Membresía Mensual Básico - Lucía Fernández Torres',
    relatedMemberId: 'mem-2',
    relatedMemberName: 'Lucía Fernández Torres',
    receiptNumber: 'REC-2026-0850'
  },
  {
    id: 'tx-3',
    type: 'income',
    category: 'membership',
    amount: 320,
    date: '2026-07-01',
    paymentMethod: 'transferencia',
    description: 'Membresía Trimestral Pro - Mariana Chávez Rojas',
    relatedMemberId: 'mem-6',
    relatedMemberName: 'Mariana Chávez Rojas',
    receiptNumber: 'REC-2026-0712'
  },

  // VENTAS EN TIENDA / POS
  {
    id: 'tx-4',
    type: 'income',
    category: 'pos_sale',
    amount: 264.0,
    date: '2026-08-28',
    paymentMethod: 'tarjeta',
    description: 'Venta POS Tienda: Proteína Whey Gold + Shaker BlenderBottle',
    items: [
      { productId: 'prod-4', productName: 'Proteína Whey Gold Standard 2 lbs', quantity: 1, unitPrice: 175.0, total: 175.0 },
      { productId: 'prod-6', productName: 'Creatina Monohidratada Micronizada 300g', quantity: 1, unitPrice: 89.0, total: 89.0 }
    ],
    receiptNumber: 'TKT-2026-1045'
  },
  {
    id: 'tx-5',
    type: 'income',
    category: 'pos_sale',
    amount: 23.0,
    date: '2026-08-29',
    paymentMethod: 'efectivo',
    description: 'Venta POS Tienda: 1x Gatorade + 1x Quest Bar + 1x Agua',
    items: [
      { productId: 'prod-2', productName: 'Gatorade Cool Blue 500ml', quantity: 1, unitPrice: 5.5, total: 5.5 },
      { productId: 'prod-9', productName: 'Barrita de Proteína Quest Bar 60g', quantity: 1, unitPrice: 12.0, total: 12.0 },
      { productId: 'prod-1', productName: 'Agua Mineral San Mateo 750ml', quantity: 1, unitPrice: 3.5, total: 3.5 },
      { productId: 'prod-1', productName: 'Agua Mineral San Mateo 750ml (extra)', quantity: 1, unitPrice: 2.0, total: 2.0 }
    ],
    receiptNumber: 'TKT-2026-1046'
  },
  {
    id: 'tx-6',
    type: 'income',
    category: 'pos_sale',
    amount: 110.0,
    date: '2026-08-30',
    paymentMethod: 'yape_plin',
    description: 'Venta POS Tienda: Pre-Entreno C4 Original',
    items: [
      { productId: 'prod-7', productName: 'Pre-Entreno C4 Original 30 Serv', quantity: 1, unitPrice: 110.0, total: 110.0 }
    ],
    receiptNumber: 'TKT-2026-1047'
  },

  // EGRESOS (GASTOS OPERATIVOS DEL GIMNASIO)
  {
    id: 'tx-7',
    type: 'expense',
    category: 'rent',
    amount: 2500.0,
    date: '2026-08-01',
    paymentMethod: 'transferencia',
    description: 'Alquiler del local comercial - Mes de Agosto',
    receiptNumber: 'FAC-ALQ-0826'
  },
  {
    id: 'tx-8',
    type: 'expense',
    category: 'salary',
    amount: 3200.0,
    date: '2026-08-15',
    paymentMethod: 'transferencia',
    description: 'Pago de honorarios y comisiones a entrenadores (Quincena)',
    receiptNumber: 'NOM-2026-15'
  },
  {
    id: 'tx-9',
    type: 'expense',
    category: 'utilities',
    amount: 480.0,
    date: '2026-08-10',
    paymentMethod: 'tarjeta',
    description: 'Servicio de Luz y Agua (Enel & Sedapal)',
    receiptNumber: 'REC-SERV-993'
  },
  {
    id: 'tx-10',
    type: 'expense',
    category: 'maintenance',
    amount: 350.0,
    date: '2026-08-20',
    paymentMethod: 'efectivo',
    description: 'Mantenimiento preventivo y engrase de caminadoras y poleas',
    receiptNumber: 'SERV-MANT-441'
  },
  {
    id: 'tx-11',
    type: 'expense',
    category: 'supplies',
    amount: 620.0,
    date: '2026-08-12',
    paymentMethod: 'transferencia',
    description: 'Reposición de stock suplementos y bebidas mayorista',
    receiptNumber: 'FAC-PROV-7712'
  }
];

export const INITIAL_CLASSES: GymClassNotice[] = [
  {
    id: 'class-1',
    name: 'Spinning Power Ride (Alta Intensidad)',
    instructorName: 'Diego Morales',
    schedule: 'Hoy 07:00 PM - 07:50 PM',
    room: 'Sala de Ciclismo Indoor - Piso 2',
    registeredCount: 18,
    capacity: 20,
    date: '2026-08-30'
  },
  {
    id: 'class-2',
    name: 'CrossFit & Functional Training WOD',
    instructorName: 'Carlos Mendoza',
    schedule: 'Hoy 06:30 PM - 07:30 PM',
    room: 'Box Funcional Principal',
    registeredCount: 15,
    capacity: 15,
    date: '2026-08-30'
  },
  {
    id: 'class-3',
    name: 'Powerlifting Técnico: Sentadilla y Banca',
    instructorName: 'Rodrigo "Toro" Silva',
    schedule: 'Mañana 08:00 AM - 09:30 AM',
    room: 'Zona de Racks y Plataformas',
    registeredCount: 8,
    capacity: 10,
    date: '2026-08-31'
  },
  {
    id: 'class-4',
    name: 'HIIT Quema Grasa & Core Abs',
    instructorName: 'Lucía Fernández',
    schedule: 'Mañana 06:00 PM - 06:50 PM',
    room: 'Sala Multiusos A',
    registeredCount: 12,
    capacity: 25,
    date: '2026-08-31'
  }
];

export const INITIAL_NOTIFICATION_RULES: NotificationRule[] = [
  {
    id: 'rule-renew-7d',
    name: 'Aviso Preventivo de Renovación (7 días antes)',
    category: 'renewal_reminder',
    enabled: true,
    channels: ['push', 'email', 'whatsapp'],
    triggerTiming: '7 días antes del vencimiento',
    timingValueDays: 7,
    templateTitle: '¡Tu membresía vence pronto! 🏋️‍♂️',
    templateBody: 'Hola {{nombre}}, te recordamos que tu plan {{plan}} vencerá en {{dias_restantes}} días (el {{fecha_vencimiento}}). Renueva con anticipación y mantén tu tarifa preferencial.',
    badgeTag: 'Preventivo'
  },
  {
    id: 'rule-renew-3d',
    name: 'Aviso Urgente de Renovación (3 días antes)',
    category: 'renewal_reminder',
    enabled: true,
    channels: ['push', 'email', 'whatsapp'],
    triggerTiming: '3 días antes del vencimiento',
    timingValueDays: 3,
    templateTitle: '⚠️ Quedan 3 días de tu membresía',
    templateBody: 'Hola {{nombre}}, tu plan {{plan}} está a punto de vencer este {{fecha_vencimiento}}. ¡Evita interrupciones en tu rutina y renueva en recepción o en línea hoy mismo!',
    badgeTag: 'Crítico'
  },
  {
    id: 'rule-renew-expired',
    name: 'Alerta de Membresía Vencida (Día 0 / Post-vencimiento)',
    category: 'renewal_reminder',
    enabled: true,
    channels: ['push', 'whatsapp'],
    triggerTiming: 'El día del vencimiento',
    timingValueDays: 0,
    templateTitle: 'Tu membresía ha vencido hoy ⛔',
    templateBody: 'Hola {{nombre}}, tu plan {{plan}} venció el {{fecha_vencimiento}}. ¡Te extrañamos en el gym! Acércate a renovar para seguir entrenando sin perder tu racha.',
    badgeTag: 'Vencido'
  },
  {
    id: 'rule-class-reminder',
    name: 'Recordatorio de Clase Reservada',
    category: 'class_notice',
    enabled: true,
    channels: ['push', 'whatsapp'],
    triggerTiming: '2 horas antes del inicio de la clase',
    timingValueDays: 0,
    templateTitle: '⏰ ¡Tu clase comienza en 2 horas!',
    templateBody: 'Hola {{nombre}}, tienes reservada la clase de {{clase}} con el coach {{instructor}} a las {{hora}} en {{sala}}. ¡Prepara tu toalla y botella de agua!',
    badgeTag: 'Clases'
  },
  {
    id: 'rule-class-cancel-notice',
    name: 'Aviso de Cambio o Nueva Clase Especial',
    category: 'class_notice',
    enabled: true,
    channels: ['push', 'email'],
    triggerTiming: 'Disparo manual / Evento de clase',
    timingValueDays: 0,
    templateTitle: '🔥 Masterclass Especial anunciada en GymControl',
    templateBody: '¡Hola {{nombre}}! Abrimos nuevas vacantes para la Masterclass de {{clase}} este fin de semana. ¡Reserva tu lugar antes de que se agoten los cupos!',
    badgeTag: 'Especial'
  },
  {
    id: 'rule-special-promo',
    name: 'Promoción Exclusiva en Tienda y Membresías Anuales',
    category: 'special_promo',
    enabled: true,
    channels: ['push', 'email', 'whatsapp'],
    triggerTiming: 'Campañas programadas / Fin de mes',
    timingValueDays: 0,
    templateTitle: '🎉 ¡Oferta Flash: 20% OFF en Suplementos & Planes!',
    templateBody: 'Hola {{nombre}}, por ser socio activo te regalamos 20% de descuento en proteínas ISO Whey, creatinas y renovación semestral. ¡Válido por 48 horas en recepción!',
    badgeTag: 'Promoción'
  },
  {
    id: 'rule-birthday',
    name: 'Felicitación de Cumpleaños + Shake Gratis',
    category: 'birthday',
    enabled: true,
    channels: ['push', 'email', 'whatsapp'],
    triggerTiming: 'El día del cumpleaños del alumno',
    timingValueDays: 0,
    templateTitle: '🎂 ¡Feliz Cumpleaños de parte del equipo GymControl!',
    templateBody: '¡Feliz día {{nombre}}! 🎉 Pasa hoy por la barra de nutrición para reclamar tu Protein Smoothie de regalo y un pase libre para tu mejor amigo.',
    badgeTag: 'Fidelización'
  }
];

export const INITIAL_NOTIFICATION_LOGS: NotificationLog[] = [
  {
    id: 'log-1',
    recipientId: 'mem-5',
    recipientName: 'Sofía Martínez',
    recipientEmail: 'sofia.martinez@example.com',
    recipientPhone: '+51 912 345 678',
    category: 'renewal_reminder',
    channel: 'push',
    title: '⚠️ Quedan 3 días de tu membresía',
    message: 'Hola Sofía Martínez, tu plan Mensual Básico vence el 2026-08-30. ¡Evita interrupciones en tu rutina y renueva hoy!',
    timestamp: '2026-08-29 09:15',
    status: 'delivered'
  },
  {
    id: 'log-2',
    recipientId: 'mem-2',
    recipientName: 'Valeria Quispe',
    recipientEmail: 'valeria.quispe@example.com',
    recipientPhone: '+51 987 123 456',
    category: 'renewal_reminder',
    channel: 'whatsapp',
    title: 'Aviso Preventivo de Renovación',
    message: '¡Hola Valeria! Tu membresía Trimestral vence en 5 días. Renueva con anticipación para no perder tus beneficios.',
    timestamp: '2026-08-28 16:30',
    status: 'read'
  },
  {
    id: 'log-3',
    recipientId: 'mem-4',
    recipientName: 'Gabriel Torres',
    recipientEmail: 'gabriel.torres@example.com',
    recipientPhone: '+51 999 888 777',
    category: 'renewal_reminder',
    channel: 'email',
    title: 'Tu membresía ha vencido hoy ⛔',
    message: 'Hola Gabriel, tu plan Mensual Básico venció el 2026-08-26. ¡Te esperamos en GymControl para reactivarla!',
    timestamp: '2026-08-27 10:00',
    status: 'sent'
  },
  {
    id: 'log-4',
    recipientName: 'Todos los Alumnos Activos (45 socios)',
    category: 'class_notice',
    channel: 'push',
    title: '🚴 Nueva Masterclass de Spinning Power Ride',
    message: 'Hoy a las 07:00 PM con Coach Diego Morales en Sala de Ciclismo Piso 2. Quedan 2 cupos disponibles.',
    timestamp: '2026-08-30 08:30',
    status: 'delivered',
    targetAudience: 'Alumnos Activos'
  },
  {
    id: 'log-5',
    recipientName: 'Comunidad GymControl (60 socios)',
    category: 'special_promo',
    channel: 'email',
    title: '🎉 Fin de Mes: 20% OFF en Proteínas y Creatinas',
    message: 'Aprovecha nuestra promoción flash en la tienda del gimnasio. Stock limitado en ISO Whey 100% y Creatina Creapure.',
    timestamp: '2026-08-29 18:00',
    status: 'read',
    targetAudience: 'Todos los Socios'
  }
];

// --- INITIAL NUTRITION PLANS ---
export const INITIAL_NUTRITION_PLANS: NutritionPlan[] = [
  {
    id: 'nutri-1',
    title: 'Plan Hipertrofia Limpia & Masa Muscular (2800 kcal)',
    targetStudentId: 'mem-1',
    targetStudentName: 'Alejandro Ramos Silva',
    objective: 'hipertrofia',
    dailyCaloriesTarget: 2800,
    proteinsTargetGrams: 180,
    carbsTargetGrams: 350,
    fatsTargetGrams: 75,
    waterLitersTarget: 3.5,
    trainerName: 'Carlos Mendoza',
    active: true,
    createdDate: '2026-06-15',
    supplements: ['Creatina Monohidratada 5g/día', 'Proteína Whey Isolate 30g post-entreno', 'Multivitamínico con desayuno', 'Omega 3 (2 cápsulas)'],
    hydrationGuidelines: 'Tomar al menos 800ml de agua durante la sesión de entrenamiento y 500ml al despertar.',
    recommendations: 'Priorizar carbohidratos complejos antes y después del entrenamiento de fuerza. Mantener descanso de 7-8 horas nocturnas.',
    meals: [
      {
        id: 'meal-1',
        name: 'Desayuno Anabólico',
        time: '07:30 AM',
        totalCalories: 680,
        totalProteins: 45,
        totalCarbs: 85,
        totalFats: 18,
        items: [
          { id: 'item-1', name: 'Avena en hojuelas cocida', portion: '100g', calories: 375, proteins: 13, carbs: 68, fats: 6, notes: 'Preparar con agua o leche de almendras' },
          { id: 'item-2', name: 'Huevos enteros revueltos', portion: '3 unidades', calories: 215, proteins: 19, carbs: 2, fats: 15, notes: 'Cocinar con rocío de aceite de oliva' },
          { id: 'item-3', name: 'Plátano de seda mediano', portion: '1 unidad (120g)', calories: 105, proteins: 1, carbs: 27, fats: 0.3 }
        ]
      },
      {
        id: 'meal-2',
        name: 'Media Mañana Energética',
        time: '11:00 AM',
        totalCalories: 380,
        totalProteins: 32,
        totalCarbs: 42,
        totalFats: 8,
        items: [
          { id: 'item-4', name: 'Yogurt Griego natural sin azúcar', portion: '200g', calories: 140, proteins: 20, carbs: 8, fats: 2 },
          { id: 'item-5', name: 'Almendras naturales tostadas', portion: '25g', calories: 145, proteins: 5, carbs: 5, fats: 12 },
          { id: 'item-6', name: 'Arándanos frescos', portion: '100g', calories: 57, proteins: 0.7, carbs: 14, fats: 0.3 }
        ]
      },
      {
        id: 'meal-3',
        name: 'Almuerzo Potente (Pre-Entreno)',
        time: '02:00 PM',
        totalCalories: 820,
        totalProteins: 55,
        totalCarbs: 110,
        totalFats: 18,
        items: [
          { id: 'item-7', name: 'Pechuga de pollo a la plancha', portion: '200g', calories: 330, proteins: 62, carbs: 0, fats: 7 },
          { id: 'item-8', name: 'Arroz blanco o jazmín cocido', portion: '250g', calories: 325, proteins: 6, carbs: 72, fats: 1 },
          { id: 'item-9', name: 'Camote horneado en rodajas', portion: '150g', calories: 130, proteins: 2, carbs: 30, fats: 0.2 },
          { id: 'item-10', name: 'Ensalada verde con espinaca y tomate', portion: '1 bol', calories: 45, proteins: 2, carbs: 8, fats: 0.5 }
        ]
      },
      {
        id: 'meal-4',
        name: 'Batido Post-Entreno Inmediato',
        time: '05:30 PM',
        totalCalories: 320,
        totalProteins: 32,
        totalCarbs: 38,
        totalFats: 3,
        items: [
          { id: 'item-11', name: 'Whey Protein Isolate 100%', portion: '1 scoop (32g)', calories: 125, proteins: 25, carbs: 2, fats: 1 },
          { id: 'item-12', name: 'Creatina Creapure', portion: '5g', calories: 0, proteins: 0, carbs: 0, fats: 0 },
          { id: 'item-13', name: 'Bebida de avena o miel pura', portion: '1 cucharada', calories: 65, proteins: 0, carbs: 17, fats: 0 }
        ]
      },
      {
        id: 'meal-5',
        name: 'Cena Reparadora',
        time: '08:30 PM',
        totalCalories: 600,
        totalProteins: 46,
        totalCarbs: 45,
        totalFats: 22,
        items: [
          { id: 'item-14', name: 'Filete de Salmón o Trucha al horno', portion: '180g', calories: 375, proteins: 36, carbs: 0, fats: 23 },
          { id: 'item-15', name: 'Papa amarilla cocida', portion: '150g', calories: 130, proteins: 3, carbs: 29, fats: 0.2 },
          { id: 'item-16', name: 'Brócoli y espárragos al vapor', portion: '150g', calories: 55, proteins: 4, carbs: 10, fats: 0.6 }
        ]
      }
    ]
  },
  {
    id: 'nutri-2',
    title: 'Plan Déficit Calórico Controlado & Definición (1850 kcal)',
    targetStudentId: 'mem-2',
    targetStudentName: 'Lucía Fernández Torres',
    objective: 'perdida_peso',
    dailyCaloriesTarget: 1850,
    proteinsTargetGrams: 140,
    carbsTargetGrams: 160,
    fatsTargetGrams: 55,
    waterLitersTarget: 3.0,
    trainerName: 'Sofía Valdivia',
    active: true,
    createdDate: '2026-08-05',
    supplements: ['L-Carnitina 1500mg antes de cardio', 'Whey Isolate sin lactosa', 'Té verde extracto en ayunas'],
    hydrationGuidelines: 'Mantener botella de 750ml con infusión fría de limón o té verde durante todo el día.',
    recommendations: 'Controlar sodio para evitar retención de líquidos. Todas las verduras de hoja verde son libres.',
    meals: [
      {
        id: 'meal-201',
        name: 'Desayuno Proteico Ligero',
        time: '08:00 AM',
        totalCalories: 380,
        totalProteins: 32,
        totalCarbs: 35,
        totalFats: 10,
        items: [
          { id: 'item-201', name: 'Tortilla de 3 claras y 1 huevo entero con espinacas', portion: '1 plato', calories: 160, proteins: 20, carbs: 2, fats: 6 },
          { id: 'item-202', name: 'Pan integral de masa madre', portion: '1 rebanada (40g)', calories: 100, proteins: 4, carbs: 19, fats: 1 },
          { id: 'item-203', name: 'Papaya picada fresca', portion: '150g', calories: 65, proteins: 1, carbs: 16, fats: 0.2 }
        ]
      },
      {
        id: 'meal-202',
        name: 'Almuerzo Saciente',
        time: '01:30 PM',
        totalCalories: 620,
        totalProteins: 48,
        totalCarbs: 60,
        totalFats: 16,
        items: [
          { id: 'item-204', name: 'Lomo fino magro a la plancha', portion: '160g', calories: 280, proteins: 38, carbs: 0, fats: 12 },
          { id: 'item-205', name: 'Quinua perlada cocida', portion: '140g', calories: 170, proteins: 6, carbs: 30, fats: 2.5 },
          { id: 'item-206', name: 'Palta / Aguacate hass', portion: '50g', calories: 80, proteins: 1, carbs: 4, fats: 7 },
          { id: 'item-207', name: 'Ensalada mixta abundante (pepino, tomate, lechuga)', portion: '1 bol', calories: 40, proteins: 2, carbs: 8, fats: 0.3 }
        ]
      },
      {
        id: 'meal-203',
        name: 'Merienda Control de Ansiedad',
        time: '05:00 PM',
        totalCalories: 260,
        totalProteins: 24,
        totalCarbs: 25,
        totalFats: 5,
        items: [
          { id: 'item-208', name: 'Batido Whey Isolate con agua', portion: '1 scoop', calories: 110, proteins: 24, carbs: 1, fats: 1 },
          { id: 'item-209', name: 'Manzana verde con canela', portion: '1 unidad', calories: 80, proteins: 0.4, carbs: 21, fats: 0.2 },
          { id: 'item-210', name: 'Nueces del Brasil', portion: '2 unidades', calories: 66, proteins: 1.4, carbs: 1.2, fats: 6.6 }
        ]
      },
      {
        id: 'meal-204',
        name: 'Cena Ligera & Antiinflamatoria',
        time: '08:00 PM',
        totalCalories: 450,
        totalProteins: 38,
        totalCarbs: 30,
        totalFats: 15,
        items: [
          { id: 'item-211', name: 'Filete de Pescado blanco (Merluza o Corvina)', portion: '200g', calories: 210, proteins: 36, carbs: 0, fats: 4 },
          { id: 'item-212', name: 'Calabacines y champiñones salteados en oliva', portion: '200g', calories: 110, proteins: 4, carbs: 8, fats: 6 },
          { id: 'item-213', name: 'Porción pequeña de choclo desgranado', portion: '80g', calories: 85, proteins: 3, carbs: 16, fats: 1 }
        ]
      }
    ]
  },
  {
    id: 'nutri-template-1',
    title: 'Plantilla Gimnasio: Fuerza & Rendimiento Deportivo (3200 kcal)',
    objective: 'fuerza',
    dailyCaloriesTarget: 3200,
    proteinsTargetGrams: 200,
    carbsTargetGrams: 420,
    fatsTargetGrams: 85,
    waterLitersTarget: 4.0,
    trainerName: 'Mateo Ríos',
    active: true,
    createdDate: '2026-05-10',
    supplements: ['Creatina 5g', 'Beta-Alanina 3g', 'Electrolitos con carbohidratos intra-entreno'],
    hydrationGuidelines: '4 litros diarios mínimo, incluyendo bebidas isotónicas en sesiones pesadas.',
    recommendations: 'Ideal para atletas de powerlifting y cross-training que necesitan mantener alta densidad glucogénica.',
    meals: [
      {
        id: 'meal-301',
        name: 'Desayuno Titán',
        time: '07:00 AM',
        totalCalories: 850,
        totalProteins: 52,
        totalCarbs: 110,
        totalFats: 22,
        items: [
          { id: 'item-301', name: 'Avena con leche descremada y plátano', portion: '120g avena', calories: 520, proteins: 20, carbs: 95, fats: 7 },
          { id: 'item-302', name: 'Huevos revueltos (4 unidades)', portion: '4 huevos', calories: 290, proteins: 24, carbs: 2, fats: 20 },
          { id: 'item-303', name: 'Jugo de naranja natural', portion: '250ml', calories: 115, proteins: 2, carbs: 26, fats: 0.5 }
        ]
      },
      {
        id: 'meal-302',
        name: 'Almuerzo Fuerza Total',
        time: '01:00 PM',
        totalCalories: 1050,
        totalProteins: 70,
        totalCarbs: 130,
        totalFats: 28,
        items: [
          { id: 'item-304', name: 'Carne magra de res / Bife', portion: '250g', calories: 480, proteins: 65, carbs: 0, fats: 22 },
          { id: 'item-305', name: 'Pasta integral con salsa de tomate natural', portion: '200g cocida', calories: 340, proteins: 12, carbs: 68, fats: 2 },
          { id: 'item-306', name: 'Puré de papa casero', portion: '150g', calories: 150, proteins: 3, carbs: 32, fats: 3 }
        ]
      },
      {
        id: 'meal-303',
        name: 'Cena de Recuperación Muscular',
        time: '08:30 PM',
        totalCalories: 850,
        totalProteins: 55,
        totalCarbs: 95,
        totalFats: 24,
        items: [
          { id: 'item-307', name: 'Pechuga de pavo o pollo al horno', portion: '220g', calories: 360, proteins: 50, carbs: 0, fats: 8 },
          { id: 'item-308', name: 'Arroz con choclo y lentejas', portion: '250g', calories: 380, proteins: 14, carbs: 75, fats: 3 },
          { id: 'item-309', name: 'Aceite de oliva virgen extra', portion: '1 cucharada', calories: 119, proteins: 0, carbs: 0, fats: 14 }
        ]
      }
    ]
  }
];

// --- INITIAL BODY ASSESSMENTS (ANTHROPOMETRIC & BIOIMPEDANCE HISTORY) ---
export const INITIAL_BODY_ASSESSMENTS: BodyAssessment[] = [
  // Alejandro Ramos: 3 assessments showing temporal evolution!
  {
    id: 'eval-mem1-01',
    memberId: 'mem-1',
    memberName: 'Alejandro Ramos Silva',
    date: '2026-05-02',
    time: '08:30 AM',
    evaluatorTrainerName: 'Carlos Mendoza',
    weightKg: 84.5,
    heightCm: 178,
    bmi: 26.67,
    bmiClassification: 'Sobrepeso',
    waistHipRatio: 0.88,
    waistHipRisk: 'Moderado',
    waistHeightRatio: 0.49,
    perimeters: {
      neck: 39.5,
      shoulders: 118.0,
      chest: 101.5,
      waist: 88.0,
      abdomen: 92.5,
      hip: 100.0,
      bicepsRelaxedLeft: 34.0,
      bicepsRelaxedRight: 34.5,
      bicepsFlexedLeft: 37.0,
      bicepsFlexedRight: 37.5,
      forearm: 29.5,
      thighSuperior: 60.5,
      thighMid: 57.0,
      calf: 38.0
    },
    skinfolds: {
      triceps: 14.5,
      subscapular: 16.0,
      suprailiac: 18.5,
      abdominal: 22.0,
      thigh: 15.0,
      calf: 11.0
    },
    bioimpedance: {
      bodyFatPercentage: 19.8,
      bodyFatKg: 16.73,
      muscleMassPercentage: 45.2,
      muscleMassKg: 38.2,
      leanMassKg: 64.5,
      visceralFatLevel: 8,
      totalBodyWaterPercentage: 56.4,
      totalBodyWaterLiters: 47.6,
      boneMassKg: 3.2,
      basalMetabolicRateKcal: 1795,
      metabolicAge: 32,
      physicalRatingScore: 5
    },
    notes: 'Evaluación inicial de ingreso. Buen potencial muscular pero con grasa visceral moderada.',
    targetGoalNotes: 'Bajar a 15% de grasa y ganar 2kg de masa magra pura en 3 meses.'
  },
  {
    id: 'eval-mem1-02',
    memberId: 'mem-1',
    memberName: 'Alejandro Ramos Silva',
    date: '2026-06-25',
    time: '09:00 AM',
    evaluatorTrainerName: 'Carlos Mendoza',
    weightKg: 82.8,
    heightCm: 178,
    bmi: 26.13,
    bmiClassification: 'Sobrepeso',
    waistHipRatio: 0.85,
    waistHipRisk: 'Bajo',
    waistHeightRatio: 0.47,
    perimeters: {
      neck: 39.8,
      shoulders: 120.0,
      chest: 103.0,
      waist: 84.5,
      abdomen: 88.0,
      hip: 99.0,
      bicepsRelaxedLeft: 34.8,
      bicepsRelaxedRight: 35.2,
      bicepsFlexedLeft: 38.0,
      bicepsFlexedRight: 38.5,
      forearm: 30.0,
      thighSuperior: 61.2,
      thighMid: 57.5,
      calf: 38.2
    },
    skinfolds: {
      triceps: 12.0,
      subscapular: 13.5,
      suprailiac: 15.0,
      abdominal: 17.5,
      thigh: 13.0,
      calf: 9.5
    },
    bioimpedance: {
      bodyFatPercentage: 17.2,
      bodyFatKg: 14.24,
      muscleMassPercentage: 47.1,
      muscleMassKg: 39.0,
      leanMassKg: 65.4,
      visceralFatLevel: 6,
      totalBodyWaterPercentage: 58.2,
      totalBodyWaterLiters: 48.2,
      boneMassKg: 3.25,
      basalMetabolicRateKcal: 1840,
      metabolicAge: 29,
      physicalRatingScore: 6
    },
    notes: 'Control a las 7 semanas. Excelente reducción de perímetro abdominal (-4.5 cm) e incremento de pecho y bíceps.',
    targetGoalNotes: 'Mantener superávit limpio y seguir apretando en sentadillas.'
  },
  {
    id: 'eval-mem1-03',
    memberId: 'mem-1',
    memberName: 'Alejandro Ramos Silva',
    date: '2026-08-20',
    time: '08:45 AM',
    evaluatorTrainerName: 'Carlos Mendoza',
    weightKg: 81.6,
    heightCm: 178,
    bmi: 25.75,
    bmiClassification: 'Sobrepeso',
    waistHipRatio: 0.83,
    waistHipRisk: 'Bajo',
    waistHeightRatio: 0.46,
    perimeters: {
      neck: 40.2,
      shoulders: 122.5,
      chest: 105.0,
      waist: 82.0,
      abdomen: 84.0,
      hip: 98.5,
      bicepsRelaxedLeft: 35.5,
      bicepsRelaxedRight: 36.0,
      bicepsFlexedLeft: 39.2,
      bicepsFlexedRight: 39.8,
      forearm: 30.5,
      thighSuperior: 62.0,
      thighMid: 58.0,
      calf: 38.5
    },
    skinfolds: {
      triceps: 10.0,
      subscapular: 11.5,
      suprailiac: 12.0,
      abdominal: 13.5,
      thigh: 11.0,
      calf: 8.5
    },
    bioimpedance: {
      bodyFatPercentage: 14.8,
      bodyFatKg: 12.08,
      muscleMassPercentage: 49.3,
      muscleMassKg: 40.2,
      leanMassKg: 66.8,
      visceralFatLevel: 5,
      totalBodyWaterPercentage: 60.1,
      totalBodyWaterLiters: 49.0,
      boneMassKg: 3.3,
      basalMetabolicRateKcal: 1895,
      metabolicAge: 25,
      physicalRatingScore: 7
    },
    notes: 'Transformación notable. Reducción global de 5% de grasa corporal y ganancia de 2kg netos de músculo esquelético.',
    targetGoalNotes: 'Consolidar en 14-15% y pasar a fase de fuerza máxima 5x5.'
  },

  // Lucía Fernández: 2 assessments showing weight loss and posture progress
  {
    id: 'eval-mem2-01',
    memberId: 'mem-2',
    memberName: 'Lucía Fernández Torres',
    date: '2026-08-02',
    time: '10:00 AM',
    evaluatorTrainerName: 'Sofía Valdivia',
    weightKg: 68.4,
    heightCm: 164,
    bmi: 25.43,
    bmiClassification: 'Sobrepeso',
    waistHipRatio: 0.81,
    waistHipRisk: 'Moderado',
    waistHeightRatio: 0.50,
    perimeters: {
      neck: 33.0,
      shoulders: 100.0,
      chest: 92.0,
      waist: 82.0,
      abdomen: 87.0,
      hip: 101.0,
      bicepsRelaxedLeft: 28.0,
      bicepsRelaxedRight: 28.5,
      bicepsFlexedLeft: 29.5,
      bicepsFlexedRight: 30.0,
      forearm: 23.5,
      thighSuperior: 58.5,
      thighMid: 54.0,
      calf: 36.0
    },
    bioimpedance: {
      bodyFatPercentage: 29.5,
      bodyFatKg: 20.18,
      muscleMassPercentage: 35.8,
      muscleMassKg: 24.5,
      leanMassKg: 45.2,
      visceralFatLevel: 7,
      totalBodyWaterPercentage: 49.5,
      totalBodyWaterLiters: 33.8,
      boneMassKg: 2.3,
      basalMetabolicRateKcal: 1380,
      metabolicAge: 32,
      physicalRatingScore: 4
    },
    notes: 'Evaluación de inicio. Refiere fatiga en cardio de moderada intensidad.',
    targetGoalNotes: 'Objetivo de 63kg en 3 meses y fortalecimiento de core.'
  },
  {
    id: 'eval-mem2-02',
    memberId: 'mem-2',
    memberName: 'Lucía Fernández Torres',
    date: '2026-08-28',
    time: '10:30 AM',
    evaluatorTrainerName: 'Sofía Valdivia',
    weightKg: 66.1,
    heightCm: 164,
    bmi: 24.58,
    bmiClassification: 'Normal',
    waistHipRatio: 0.77,
    waistHipRisk: 'Bajo',
    waistHeightRatio: 0.47,
    perimeters: {
      neck: 32.5,
      shoulders: 99.5,
      chest: 90.5,
      waist: 77.5,
      abdomen: 81.5,
      hip: 99.5,
      bicepsRelaxedLeft: 27.5,
      bicepsRelaxedRight: 28.0,
      bicepsFlexedLeft: 29.8,
      bicepsFlexedRight: 30.2,
      forearm: 23.5,
      thighSuperior: 56.8,
      thighMid: 52.5,
      calf: 35.5
    },
    bioimpedance: {
      bodyFatPercentage: 26.8,
      bodyFatKg: 17.71,
      muscleMassPercentage: 37.4,
      muscleMassKg: 24.7,
      leanMassKg: 45.8,
      visceralFatLevel: 5,
      totalBodyWaterPercentage: 51.8,
      totalBodyWaterLiters: 34.2,
      boneMassKg: 2.35,
      basalMetabolicRateKcal: 1405,
      metabolicAge: 27,
      physicalRatingScore: 5
    },
    notes: 'Progreso excelente en 4 semanas (-2.3 kg netos de grasa, cintura -4.5 cm). Cruzó al rango de IMC Normal!',
    targetGoalNotes: 'Continuar con sesiones de spinning y entrenamiento de fuerza.'
  }
];

// --- INITIAL SPINNING STUDIO SETUP (24 BIKES: 4 ROWS X 6 COLS) ---
export const INITIAL_SPINNING_BIKES: SpinningBike[] = [
  // Fila 1 - Frontal (Junto a la tarima del instructor)
  { id: 'bike-1', bikeNumber: 1, row: 1, col: 1, zone: 'side_wing', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-2', bikeNumber: 2, row: 1, col: 2, zone: 'front_stage', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-3', bikeNumber: 3, row: 1, col: 3, zone: 'front_stage', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-4', bikeNumber: 4, row: 1, col: 4, zone: 'front_stage', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-5', bikeNumber: 5, row: 1, col: 5, zone: 'front_stage', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-6', bikeNumber: 6, row: 1, col: 6, zone: 'side_wing', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },

  // Fila 2 - Media Frontal
  { id: 'bike-7', bikeNumber: 7, row: 2, col: 1, zone: 'side_wing', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-8', bikeNumber: 8, row: 2, col: 2, zone: 'center_mid', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-9', bikeNumber: 9, row: 2, col: 3, zone: 'center_mid', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-10', bikeNumber: 10, row: 2, col: 4, zone: 'center_mid', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-11', bikeNumber: 11, row: 2, col: 5, zone: 'center_mid', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-12', bikeNumber: 12, row: 2, col: 6, zone: 'side_wing', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },

  // Fila 3 - Media Trasera
  { id: 'bike-13', bikeNumber: 13, row: 3, col: 1, zone: 'side_wing', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-14', bikeNumber: 14, row: 3, col: 2, zone: 'center_mid', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-15', bikeNumber: 15, row: 3, col: 3, zone: 'center_mid', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-16', bikeNumber: 16, row: 3, col: 4, zone: 'center_mid', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-17', bikeNumber: 17, row: 3, col: 5, zone: 'center_mid', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-18', bikeNumber: 18, row: 3, col: 6, zone: 'side_wing', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },

  // Fila 4 - Elevada / Vista Panorámica Trasera
  { id: 'bike-19', bikeNumber: 19, row: 4, col: 1, zone: 'side_wing', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-20', bikeNumber: 20, row: 4, col: 2, zone: 'elevated_back', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-21', bikeNumber: 21, row: 4, col: 3, zone: 'elevated_back', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-22', bikeNumber: 22, row: 4, col: 4, zone: 'elevated_back', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-23', bikeNumber: 23, row: 4, col: 5, zone: 'elevated_back', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true },
  { id: 'bike-24', bikeNumber: 24, row: 4, col: 6, zone: 'side_wing', model: 'Keiser M3i Indoor Cycle', hasPedalStraps: true, hasSpdClipless: true }
];

// --- INITIAL SPINNING SESSIONS ---
export const INITIAL_SPINNING_SESSIONS: SpinningSession[] = [
  {
    id: 'spin-sess-1',
    title: '🚴 Power Climb HIIT Ride (Ascenso de Montaña)',
    instructorId: 'trainer-1',
    instructorName: 'Carlos Mendoza',
    instructorPhoto: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&auto=format&fit=crop&q=80',
    date: '2026-08-30',
    startTime: '07:00 AM',
    endTime: '07:50 AM',
    durationMinutes: 50,
    intensity: 'alta',
    playlistGenre: 'Rock & Electronic Bass Drive',
    maxCapacity: 24,
    roomName: 'Studio Spinning Acústico - Piso 2'
  },
  {
    id: 'spin-sess-2',
    title: '🔥 Cardio RPM Blast & Fat Burner',
    instructorId: 'trainer-2',
    instructorName: 'Sofía Valdivia',
    instructorPhoto: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format&fit=crop&q=80',
    date: '2026-08-30',
    startTime: '09:30 AM',
    endTime: '10:20 AM',
    durationMinutes: 50,
    intensity: 'extrema',
    playlistGenre: 'Electro Pop & Dance Mix',
    maxCapacity: 24,
    roomName: 'Studio Spinning Acústico - Piso 2'
  },
  {
    id: 'spin-sess-3',
    title: '⚡ Sunset Beats & Cadence Ride',
    instructorId: 'trainer-4',
    instructorName: 'Valeria Gómez',
    instructorPhoto: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&auto=format&fit=crop&q=80',
    date: '2026-08-30',
    startTime: '06:30 PM',
    endTime: '07:20 PM',
    durationMinutes: 50,
    intensity: 'alta',
    playlistGenre: 'Deep House & Techno Energy',
    maxCapacity: 24,
    roomName: 'Studio Spinning Acústico - Piso 2'
  },
  {
    id: 'spin-sess-4',
    title: '🌙 Night Express Sprint & Stamina',
    instructorId: 'trainer-3',
    instructorName: 'Mateo Ríos',
    instructorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    date: '2026-08-31',
    startTime: '07:30 PM',
    endTime: '08:15 PM',
    durationMinutes: 45,
    intensity: 'alta',
    playlistGenre: 'Drum & Bass Hi-Tempo',
    maxCapacity: 24,
    roomName: 'Studio Spinning Acústico - Piso 2'
  }
];

// --- INITIAL SPINNING RESERVATIONS ---
export const INITIAL_SPINNING_RESERVATIONS: SpinningReservation[] = [
  {
    id: 'res-spin-1',
    sessionId: 'spin-sess-1',
    bikeNumber: 3,
    memberId: 'mem-1',
    memberName: 'Alejandro Ramos Silva',
    memberPhone: '+51987456123',
    memberEmail: 'alejandro.ramos@gmail.com',
    status: 'checked_in',
    reservedAt: '2026-08-29 18:30',
    checkInTime: '2026-08-30 06:50 AM',
    shoesRequirement: 'calas_spd',
    specialNotes: 'Preferencia asiento altura 14.'
  },
  {
    id: 'res-spin-2',
    sessionId: 'spin-sess-1',
    bikeNumber: 4,
    memberId: 'mem-2',
    memberName: 'Lucía Fernández Torres',
    memberPhone: '+51912345678',
    memberEmail: 'lucia.fernandez@hotmail.com',
    status: 'checked_in',
    reservedAt: '2026-08-29 20:10',
    checkInTime: '2026-08-30 06:55 AM',
    shoesRequirement: 'zapatilla_comun'
  },
  {
    id: 'res-spin-3',
    sessionId: 'spin-sess-1',
    bikeNumber: 8,
    memberId: 'mem-3',
    memberName: 'Rodrigo Morales Quispe',
    memberPhone: '+51998877665',
    status: 'confirmed',
    reservedAt: '2026-08-29 21:00',
    shoesRequirement: 'calas_spd'
  },
  {
    id: 'res-spin-4',
    sessionId: 'spin-sess-1',
    bikeNumber: 9,
    memberId: 'mem-4',
    memberName: 'Camila Benitez Paredes',
    memberPhone: '+51965412389',
    status: 'confirmed',
    reservedAt: '2026-08-30 06:10',
    shoesRequirement: 'zapatilla_comun',
    specialNotes: 'Llevar toalla adicional.'
  },
  {
    id: 'res-spin-5',
    sessionId: 'spin-sess-1',
    bikeNumber: 15,
    memberId: 'mem-6',
    memberName: 'Mariana Chávez Rojas',
    memberPhone: '+51933221100',
    status: 'confirmed',
    reservedAt: '2026-08-30 06:20',
    shoesRequirement: 'zapatilla_comun'
  },
  {
    id: 'res-spin-6',
    sessionId: 'spin-sess-1',
    bikeNumber: 21,
    memberId: 'mem-5',
    memberName: 'Diego Salazar Cárdenas',
    memberPhone: '+51954321987',
    status: 'confirmed',
    reservedAt: '2026-08-29 19:45',
    shoesRequirement: 'zapatilla_comun'
  },
  // Reservas para la sesión de la tarde (spin-sess-3)
  {
    id: 'res-spin-7',
    sessionId: 'spin-sess-3',
    bikeNumber: 2,
    memberId: 'mem-4',
    memberName: 'Camila Benitez Paredes',
    memberPhone: '+51965412389',
    status: 'confirmed',
    reservedAt: '2026-08-30 07:00',
    shoesRequirement: 'zapatilla_comun'
  },
  {
    id: 'res-spin-8',
    sessionId: 'spin-sess-3',
    bikeNumber: 3,
    memberId: 'mem-2',
    memberName: 'Lucía Fernández Torres',
    memberPhone: '+51912345678',
    status: 'confirmed',
    reservedAt: '2026-08-30 07:15',
    shoesRequirement: 'zapatilla_comun'
  }
];

// --- INITIAL SYSTEM USERS (ADMIN, TRAINERS, STUDENTS) ---
export const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr-admin-1',
    username: 'admin',
    fullName: 'Carlos Gutiérrez (Administración)',
    email: 'admin@gymcontrol.com',
    role: 'admin',
    phone: '+51987000111',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'usr-trainer-1',
    username: 'carlos.coach',
    fullName: 'Carlos Mendoza (Coach Spinning & Fuerza)',
    email: 'carlos.mendoza@gymcontrol.com',
    role: 'trainer',
    trainerId: 'trainer-1',
    phone: '+51987654321',
    photoUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'usr-trainer-2',
    username: 'sofia.coach',
    fullName: 'Sofía Valdivia (Coach Nutrición & RPM)',
    email: 'sofia.valdivia@gymcontrol.com',
    role: 'trainer',
    trainerId: 'trainer-2',
    phone: '+51987112233',
    photoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'usr-student-1',
    username: 'alejandro.ramos',
    fullName: 'Alejandro Ramos Silva',
    email: 'alejandro.ramos@gmail.com',
    role: 'student',
    memberId: 'mem-1',
    phone: '+51987456123',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'usr-student-2',
    username: 'lucia.fernandez',
    fullName: 'Lucía Fernández Torres',
    email: 'lucia.fernandez@hotmail.com',
    role: 'student',
    memberId: 'mem-2',
    phone: '+51912345678',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    active: true
  }
];

// --- INITIAL SPINNING ACCESS CODES (FOR YAPE SCREENSHOT PAYMENTS) ---
export const INITIAL_SPINNING_ACCESS_CODES: SpinningAccessCode[] = [
  {
    id: 'code-1',
    code: 'YAPE-8421',
    sessionId: 'spin-sess-1',
    sessionTitle: '🚴 Power Climb HIIT Ride',
    issuedToName: 'Alejandro Ramos Silva',
    issuedToPhone: '+51987456123',
    memberId: 'mem-1',
    isExternal: false,
    amountPaid: 20,
    paymentMethod: 'yape_plin',
    status: 'active',
    issuedAt: '2026-08-30 08:00',
    issuedByTrainerName: 'Carlos Mendoza',
    notes: 'Comprobante Yape verificado por WhatsApp. Pase de sesión individual.'
  },
  {
    id: 'code-2',
    code: 'SPIN-9315',
    sessionId: 'spin-sess-3',
    sessionTitle: '⚡ Sunset Beats & Cadence Ride',
    issuedToName: 'Mariana Chávez Rojas',
    issuedToPhone: '+51933221100',
    memberId: 'mem-6',
    isExternal: false,
    amountPaid: 20,
    paymentMethod: 'yape_plin',
    status: 'active',
    issuedAt: '2026-08-30 08:15',
    issuedByTrainerName: 'Valeria Gómez',
    notes: 'Pago Yape confirmado por recepción. Puede canjear desde su casa.'
  },
  {
    id: 'code-3',
    code: 'PASE-7720',
    sessionId: 'spin-sess-2',
    sessionTitle: '🔥 Cardio RPM Blast',
    issuedToName: 'Renzo Morales (Invitado)',
    issuedToPhone: '+51955667788',
    isExternal: true,
    amountPaid: 20,
    paymentMethod: 'yape_plin',
    status: 'active',
    issuedAt: '2026-08-30 08:30',
    issuedByTrainerName: 'Sofía Valdivia',
    notes: 'Cliente externo. Pagó por Yape y mandó captura.'
  }
];

// --- INITIAL ATTENDANCE RECORDS (ALUMNOS & PERSONAL) ---
export const INITIAL_ATTENDANCES: AttendanceRecord[] = [
  {
    id: 'att-1',
    userId: 'mem-1',
    userName: 'Alejandro Ramos Silva',
    userRole: 'student',
    userDni: '72345678',
    date: '2026-08-30',
    time: '06:45 AM',
    type: 'in',
    status: 'authorized',
    checkInMethod: 'qr_app',
    membershipPlan: 'Plan Anual Black Iron',
    notes: 'Ingreso puntual sala de musculación'
  },
  {
    id: 'att-2',
    userId: 'usr-trainer-1',
    userName: 'Carlos Mendoza',
    userRole: 'trainer',
    userDni: '41239844',
    date: '2026-08-30',
    time: '06:50 AM',
    type: 'in',
    status: 'on_time',
    checkInMethod: 'barcode',
    notes: 'Apertura de turno mañana e instrucción de spinning'
  },
  {
    id: 'att-3',
    userId: 'mem-2',
    userName: 'Lucía Fernández Torres',
    userRole: 'student',
    userDni: '74567891',
    date: '2026-08-30',
    time: '07:12 AM',
    type: 'in',
    status: 'authorized',
    checkInMethod: 'dni_manual',
    membershipPlan: 'Plan Trimestral Estudiante',
    notes: 'Evaluación física programada'
  },
  {
    id: 'att-4',
    userId: 'usr-admin',
    userName: 'Admin Recepción Principal',
    userRole: 'admin',
    userDni: '10982345',
    date: '2026-08-30',
    time: '07:00 AM',
    type: 'in',
    status: 'on_time',
    checkInMethod: 'quick_pass',
    notes: 'Inicio de operaciones en caja'
  },
  {
    id: 'att-5',
    userId: 'mem-3',
    userName: 'Mateo Quispe Paredes',
    userRole: 'student',
    userDni: '71238945',
    date: '2026-08-30',
    time: '08:05 AM',
    type: 'in',
    status: 'warning',
    checkInMethod: 'dni_manual',
    membershipPlan: 'Plan Mensual Estándar',
    notes: '⚠️ Membresía por vencer en 3 días - notificado en pantalla'
  },
  {
    id: 'att-6',
    userId: 'usr-trainer-2',
    userName: 'Sofía Valdivia',
    userRole: 'trainer',
    userDni: '45671239',
    date: '2026-08-30',
    time: '08:00 AM',
    type: 'in',
    status: 'on_time',
    checkInMethod: 'qr_app',
    notes: 'Turno de nutrición y clase de spinning RPM'
  }
];




