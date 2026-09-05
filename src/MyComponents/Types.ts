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

/* ------------------------------ Linked lists ----------------------------- */

export interface LLNode {
  id: number;
  value: number;
}

export interface LLStep {
  nodes: LLNode[];
  /** node currently being visited while traversing */
  pointerIndex: number | null;
  /** secondary highlight: found node, node about to be unlinked, etc. */
  highlightIndex: number | null;
  /** index of a freshly-created node not yet linked in, or just linked */
  newIndex: number | null;
  codeLine: number;
  note: string;
}

export interface LLOperation {
  id: string;
  name: string;
  code: string[];
  needsValue: boolean;
  valueLabel?: string;
  needsPosition: boolean;
  generateSteps: (initial: number[], value?: number, position?: number) => LLStep[];
}

export interface ListTypeConfig {
  id: 'singly' | 'doubly';
  name: string;
  description: string;
  operations: LLOperation[];
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
  leetLinks: LeetLink[];
}