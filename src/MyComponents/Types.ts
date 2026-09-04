export interface SortStep {
  array: number[];
  /** indices currently being compared (highlighted) */
  comparing: number[];
  /** indices currently being swapped/overwritten (highlighted) */
  swapping: number[];
  /** indices that are in their final sorted position (highlighted) */
  sorted: number[];
  /** 1-indexed line number in the code panel that this step corresponds to */
  codeLine: number;
  /** short human description of what's happening on this step */
  note: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface LeetLink {
  title: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface AlgorithmConfig {
  id: string;
  name: string;
  shortDescription: string;
  timeComplexityBest: string;
  timeComplexityAvg: string;
  timeComplexityWorst: string;
  spaceComplexity: string;
  stable: boolean;
  code: string[]; // one string per line
  generateSteps: (arr: number[]) => SortStep[];
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
  leetLinks: LeetLink[];
}