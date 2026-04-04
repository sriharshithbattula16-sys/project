// Mock data for the exam platform

export interface Question {
  id: string;
  text: string;
  type: "mcq" | "descriptive";
  options?: string[];
  correctAnswer?: string;
  marks: number;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  type: "mcq" | "descriptive";
  status: "draft" | "active" | "closed";
  duration: number; // minutes
  totalMarks: number;
  questionCount: number;
  questions: Question[];
  createdAt: string;
  attempts: number;
}

export interface StudentResult {
  examId: string;
  examTitle: string;
  subject: string;
  type: "mcq" | "descriptive";
  totalMarks: number;
  scoredMarks: number;
  totalQuestions: number;
  answered: number;
  correct: number;
  incorrect: number;
  skipped: number;
  completedAt: string;
  status: "evaluated" | "pending";
  questionResults?: {
    questionId: string;
    questionText: string;
    yourAnswer: string;
    correctAnswer?: string;
    marks: number;
    scored: number;
    feedback?: string;
  }[];
}

export const MOCK_EXAMS: Exam[] = [
  {
    id: "e1",
    title: "Photosynthesis & Plant Biology",
    subject: "Biology",
    type: "mcq",
    status: "active",
    duration: 30,
    totalMarks: 20,
    questionCount: 10,
    questions: [
      { id: "q1", text: "What is the primary pigment involved in photosynthesis?", type: "mcq", options: ["Chlorophyll", "Carotenoid", "Xanthophyll", "Anthocyanin"], correctAnswer: "Chlorophyll", marks: 2 },
      { id: "q2", text: "Where does the light-dependent reaction of photosynthesis occur?", type: "mcq", options: ["Stroma", "Thylakoid membrane", "Cell wall", "Nucleus"], correctAnswer: "Thylakoid membrane", marks: 2 },
      { id: "q3", text: "What is the byproduct of photosynthesis?", type: "mcq", options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"], correctAnswer: "Oxygen", marks: 2 },
      { id: "q4", text: "Which cycle fixes carbon dioxide into glucose?", type: "mcq", options: ["Krebs cycle", "Calvin cycle", "Nitrogen cycle", "Water cycle"], correctAnswer: "Calvin cycle", marks: 2 },
      { id: "q5", text: "What is the role of water in photosynthesis?", type: "mcq", options: ["Electron donor", "Electron acceptor", "Catalyst", "Inhibitor"], correctAnswer: "Electron donor", marks: 2 },
    ],
    createdAt: "2026-02-20",
    attempts: 24,
  },
  {
    id: "e2",
    title: "Organic Chemistry Fundamentals",
    subject: "Chemistry",
    type: "descriptive",
    status: "active",
    duration: 60,
    totalMarks: 50,
    questionCount: 5,
    questions: [
      { id: "q6", text: "Explain the mechanism of SN1 and SN2 reactions with examples.", type: "descriptive", marks: 10 },
      { id: "q7", text: "Describe the concept of aromaticity and Hückel's rule.", type: "descriptive", marks: 10 },
      { id: "q8", text: "What are functional group isomers? Provide three examples.", type: "descriptive", marks: 10 },
      { id: "q9", text: "Explain electrophilic aromatic substitution with the mechanism.", type: "descriptive", marks: 10 },
      { id: "q10", text: "Discuss the significance of chirality in pharmaceutical chemistry.", type: "descriptive", marks: 10 },
    ],
    createdAt: "2026-02-22",
    attempts: 18,
  },
  {
    id: "e3",
    title: "Newtonian Mechanics",
    subject: "Physics",
    type: "mcq",
    status: "closed",
    duration: 45,
    totalMarks: 30,
    questionCount: 15,
    questions: [],
    createdAt: "2026-02-10",
    attempts: 32,
  },
  {
    id: "e4",
    title: "Data Structures & Algorithms",
    subject: "Computer Science",
    type: "descriptive",
    status: "draft",
    duration: 90,
    totalMarks: 100,
    questionCount: 8,
    questions: [],
    createdAt: "2026-02-25",
    attempts: 0,
  },
];

export const MOCK_STUDENT_RESULTS: StudentResult[] = [
  {
    examId: "e1",
    examTitle: "Photosynthesis & Plant Biology",
    subject: "Biology",
    type: "mcq",
    totalMarks: 20,
    scoredMarks: 16,
    totalQuestions: 10,
    answered: 9,
    correct: 8,
    incorrect: 1,
    skipped: 1,
    completedAt: "2026-02-21",
    status: "evaluated",
    questionResults: [
      { questionId: "q1", questionText: "What is the primary pigment involved in photosynthesis?", yourAnswer: "Chlorophyll", correctAnswer: "Chlorophyll", marks: 2, scored: 2 },
      { questionId: "q2", questionText: "Where does the light-dependent reaction occur?", yourAnswer: "Thylakoid membrane", correctAnswer: "Thylakoid membrane", marks: 2, scored: 2 },
      { questionId: "q3", questionText: "What is the byproduct of photosynthesis?", yourAnswer: "Oxygen", correctAnswer: "Oxygen", marks: 2, scored: 2 },
      { questionId: "q4", questionText: "Which cycle fixes CO₂ into glucose?", yourAnswer: "Calvin cycle", correctAnswer: "Calvin cycle", marks: 2, scored: 2 },
      { questionId: "q5", questionText: "Role of water in photosynthesis?", yourAnswer: "Catalyst", correctAnswer: "Electron donor", marks: 2, scored: 0 },
    ],
  },
  {
    examId: "e3",
    examTitle: "Newtonian Mechanics",
    subject: "Physics",
    type: "mcq",
    totalMarks: 30,
    scoredMarks: 22,
    totalQuestions: 15,
    answered: 14,
    correct: 11,
    incorrect: 3,
    skipped: 1,
    completedAt: "2026-02-12",
    status: "evaluated",
  },
  {
    examId: "e2",
    examTitle: "Organic Chemistry Fundamentals",
    subject: "Chemistry",
    type: "descriptive",
    totalMarks: 50,
    scoredMarks: 0,
    totalQuestions: 5,
    answered: 5,
    correct: 0,
    incorrect: 0,
    skipped: 0,
    completedAt: "2026-02-23",
    status: "pending",
  },
];

export const GENERATED_QUESTIONS: Question[] = [
  { id: "gq1", text: "What is the net equation for photosynthesis?", type: "mcq", options: ["6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂", "C₆H₁₂O₆ → 6CO₂ + 6H₂O", "6O₂ + C₆H₁₂O₆ → 6CO₂ + 6H₂O", "None of the above"], correctAnswer: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂", marks: 2 },
  { id: "gq2", text: "Which organelle is responsible for photosynthesis?", type: "mcq", options: ["Mitochondria", "Chloroplast", "Ribosome", "Golgi body"], correctAnswer: "Chloroplast", marks: 2 },
  { id: "gq3", text: "CAM photosynthesis is found in which type of plants?", type: "mcq", options: ["Aquatic plants", "Desert plants", "Tropical plants", "Temperate plants"], correctAnswer: "Desert plants", marks: 2 },
  { id: "gq4", text: "What is the primary carbon fixation enzyme in the Calvin cycle?", type: "mcq", options: ["RuBisCO", "PEP carboxylase", "ATP synthase", "NADPH oxidase"], correctAnswer: "RuBisCO", marks: 2 },
  { id: "gq5", text: "Photorespiration occurs when RuBisCO binds with:", type: "mcq", options: ["CO₂", "O₂", "N₂", "H₂O"], correctAnswer: "O₂", marks: 2 },
];
