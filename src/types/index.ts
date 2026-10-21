export type PilotAvatar = string; // id ikon pesawat, misal 'jet-biru'

export interface StudentProfile {
  name: string;
  avatar: PilotAvatar;
  stars: number;
  badges: string[];
  completedPrescriptions: number;
  completedProblems: number;
  quizScore: number | null;
}

export type ActiveTab = 'intro' | 'resep-dokter' | 'manfaat' | 'tabel-rimba' | 'soal-cerita' | 'kuis' | 'generator';

export interface StoryProblem {
  id: number;
  title: string;
  story: string;
  character: string;
  characterName: string;
  itemEmoji: string;
  itemName: string;
  groups: number; // A in A x B
  itemsPerGroup: number; // B in A x B
  containerName: string; // misal: "keranjang", "kantong", "piring"
  realWorldContext: string;
}

export interface QuizQuestion {
  id: number;
  type: 'concept' | 'doctor' | 'story' | 'repeated-add';
  question: string;
  explanation: string;
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  hint?: string;
  emoji: string;
}
