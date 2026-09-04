import type { AlgorithmConfig, SortStep } from './Types';

const clone = (a: number[]) => [...a];

function mkStep(
  array: number[],
  codeLine: number,
  note: string,
  comparing: number[] = [],
  swapping: number[] = [],
  sorted: number[] = []
): SortStep {
  return { array: clone(array), codeLine, note, comparing, swapping, sorted: clone(sorted) };
}

/* ------------------------------- BUBBLE SORT ------------------------------ */

const bubbleCode = [
  'void bubbleSort(int arr[], int n){',
  '    int i, j;',
  '    for(i = 0; i < n - 1; i++){',
  '        bool isSwap = false;',
  '        for(j = 0; j < n - i - 1; j++){',
  '            if(arr[j] > arr[j + 1]){',
  '                swap(arr[j], arr[j + 1]);',
  '                isSwap = true;',
  '            }',
  '        }',
  '        if(isSwap == false){',
  '            return;',
  '        }',
  '    }',
  '}',
];

function bubbleSteps(input: number[]): SortStep[] {
  const arr = clone(input);
  const n = arr.length;
  const steps: SortStep[] = [];
  const sortedIdx: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    steps.push(mkStep(arr, 3, `Pass ${i + 1}: scan unsorted region.`, [], [], sortedIdx));
    let isSwap = false;
    steps.push(mkStep(arr, 4, 'Reset swap flag for this pass.', [], [], sortedIdx));
    for (let j = 0; j < n - i - 1; j++) {
      steps.push(mkStep(arr, 6, `Compare arr[${j}] and arr[${j + 1}].`, [j, j + 1], [], sortedIdx));
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        isSwap = true;
        steps.push(mkStep(arr, 7, `Swap: arr[${j}] and arr[${j + 1}] were out of order.`, [], [j, j + 1], sortedIdx));
      }
    }
    sortedIdx.unshift(n - 1 - i);
    steps.push(mkStep(arr, 11, isSwap ? 'Check if any swap happened this pass.' : 'No swaps happened — array is sorted.', [], [], sortedIdx));
    if (!isSwap) {
      steps.push(mkStep(arr, 12, 'Early exit: already sorted.', [], [], Array.from({ length: n }, (_, k) => k)));
      return steps;
    }
  }
  steps.push(mkStep(arr, 15, 'Sorting complete.', [], [], Array.from({ length: n }, (_, k) => k)));
  return steps;
}

/* -------------------------------- COMB SORT -------------------------------- */

const combCode = [
  'void combSort(int arr[], int n){',
  '    int gap = n;',
  '    bool swapped = true;',
  '    while(gap != 1 || swapped == true){',
  '        gap = (gap * 10) / 13;',
  '        if(gap < 1) gap = 1;',
  '        swapped = false;',
  '        for(int i = 0; i < n - gap; i++){',
  '            if(arr[i] > arr[i + gap]){',
  '                swap(arr[i], arr[i + gap]);',
  '                swapped = true;',
  '            }',
  '        }',
  '    }',
  '}',
];

function combSteps(input: number[]): SortStep[] {
  const arr = clone(input);
  const n = arr.length;
  const steps: SortStep[] = [];
  let gap = n;
  let swapped = true;

  steps.push(mkStep(arr, 2, `Start with gap = n = ${n}.`));
  while (gap !== 1 || swapped) {
    steps.push(mkStep(arr, 4, `Loop while gap != 1 or a swap happened.`));
    gap = Math.floor((gap * 10) / 13);
    if (gap < 1) gap = 1;
    steps.push(mkStep(arr, 5, `Shrink gap to ${gap} (÷ 1.3).`));
    swapped = false;
    steps.push(mkStep(arr, 7, 'Reset swapped flag.'));
    for (let i = 0; i < n - gap; i++) {
      steps.push(mkStep(arr, 9, `Compare arr[${i}] and arr[${i + gap}] (gap = ${gap}).`, [i, i + gap]));
      if (arr[i] > arr[i + gap]) {
        [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
        swapped = true;
        steps.push(mkStep(arr, 10, `Swap arr[${i}] and arr[${i + gap}].`, [], [i, i + gap]));
      }
    }
  }
  steps.push(mkStep(arr, 15, 'Sorting complete (gap = 1, no more swaps).', [], [], Array.from({ length: n }, (_, k) => k)));
  return steps;
}

/* ----------------------------- INSERTION SORT ------------------------------ */

const insertionCode = [
  'void insertionSort(int arr[], int n){',
  '    int i, j, key;',
  '    for(i = 1; i < n; i++){',
  '        key = arr[i];',
  '        j = i - 1;',
  '        while(j >= 0 && arr[j] > key){',
  '            arr[j + 1] = arr[j];',
  '            j--;',
  '        }',
  '        arr[j + 1] = key;',
  '    }',
  '}',
];

function insertionSteps(input: number[]): SortStep[] {
  const arr = clone(input);
  const n = arr.length;
  const steps: SortStep[] = [];

  steps.push(mkStep(arr, 3, 'First element is trivially sorted.', [], [], [0]));
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    steps.push(mkStep(arr, 4, `Pick key = arr[${i}] = ${key}.`, [i]));
    let j = i - 1;
    steps.push(mkStep(arr, 5, `Start comparing from j = ${j}.`, [j]));
    while (j >= 0 && arr[j] > key) {
      steps.push(mkStep(arr, 6, `arr[${j}] = ${arr[j]} > key (${key}) — shift right.`, [j]));
      arr[j + 1] = arr[j];
      steps.push(mkStep(arr, 7, `Shift arr[${j}] into position ${j + 1}.`, [], [j + 1]));
      j--;
    }
    arr[j + 1] = key;
    const sortedPrefix = Array.from({ length: i + 1 }, (_, k) => k);
    steps.push(mkStep(arr, 10, `Insert key at position ${j + 1}.`, [], [j + 1], sortedPrefix));
  }
  steps.push(mkStep(arr, 12, 'Sorting complete.', [], [], Array.from({ length: n }, (_, k) => k)));
  return steps;
}

/* ----------------------------- SELECTION SORT ------------------------------ */

const selectionCode = [
  'void selectionSort(int arr[], int n){',
  '    int i, j, minIdx;',
  '    for(i = 0; i < n - 1; i++){',
  '        minIdx = i;',
  '        for(j = i + 1; j < n; j++){',
  '            if(arr[j] < arr[minIdx]){',
  '                minIdx = j;',
  '            }',
  '        }',
  '        if(minIdx != i){',
  '            swap(arr[i], arr[minIdx]);',
  '        }',
  '    }',
  '}',
];

function selectionSteps(input: number[]): SortStep[] {
  const arr = clone(input);
  const n = arr.length;
  const steps: SortStep[] = [];
  const sortedIdx: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push(mkStep(arr, 4, `Assume arr[${i}] is the minimum so far.`, [i], [], sortedIdx));
    for (let j = i + 1; j < n; j++) {
      steps.push(mkStep(arr, 6, `Compare arr[${j}] with current min arr[${minIdx}].`, [j, minIdx], [], sortedIdx));
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push(mkStep(arr, 7, `New minimum found at index ${minIdx}.`, [minIdx], [], sortedIdx));
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      steps.push(mkStep(arr, 11, `Swap arr[${i}] with the minimum at arr[${minIdx}].`, [], [i, minIdx], sortedIdx));
    }
    sortedIdx.push(i);
    steps.push(mkStep(arr, 12, `Index ${i} is now in its final position.`, [], [], sortedIdx));
  }
  sortedIdx.push(n - 1);
  steps.push(mkStep(arr, 14, 'Sorting complete.', [], [], Array.from({ length: n }, (_, k) => k)));
  return steps;
}

/* -------------------------------- SHELL SORT -------------------------------- */

const shellCode = [
  'void shellSort(int arr[], int n){',
  '    int i, j, gap, temp;',
  '    for(gap = n/2; gap > 0; gap /= 2){',
  '        for(i = gap; i < n; i++){',
  '            temp = arr[i];',
  '            for(j = i; j >= gap && arr[j-gap] > temp; j -= gap){',
  '                arr[j] = arr[j - gap];',
  '            }',
  '            arr[j] = temp;',
  '        }',
  '    }',
  '}',
];

function shellStepsFn(input: number[]): SortStep[] {
  const arr = clone(input);
  const n = arr.length;
  const steps: SortStep[] = [];

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push(mkStep(arr, 3, `New gap = ${gap}.`));
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      steps.push(mkStep(arr, 5, `temp = arr[${i}] = ${temp}.`, [i]));
      let j = i;
      while (j >= gap && arr[j - gap] > temp) {
        steps.push(mkStep(arr, 6, `arr[${j - gap}] > temp — shift it forward.`, [j - gap]));
        arr[j] = arr[j - gap];
        steps.push(mkStep(arr, 7, `Move arr[${j - gap}] into slot ${j}.`, [], [j]));
        j -= gap;
      }
      arr[j] = temp;
      steps.push(mkStep(arr, 9, `Place temp into slot ${j}.`, [], [j]));
    }
  }
  steps.push(mkStep(arr, 12, 'Sorting complete.', [], [], Array.from({ length: n }, (_, k) => k)));
  return steps;
}

/* --------------------------------------------------------------------------- */

export const sortingAlgorithms: AlgorithmConfig[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    shortDescription: 'Repeatedly swap adjacent elements that are out of order until the array bubbles into place.',
    timeComplexityBest: 'O(n)',
    timeComplexityAvg: 'O(n²)',
    timeComplexityWorst: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: true,
    code: bubbleCode,
    generateSteps: bubbleSteps,
    quiz: [
      { question: 'What is the worst-case time complexity of Bubble Sort?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], correctIndex: 2, explanation: 'Bubble Sort compares every pair in nested loops, giving O(n²) in the worst case.' },
      { question: 'What does the "isSwap" flag optimize?', options: ['Memory usage', 'Early exit when array is already sorted', 'Number of comparisons per pass', 'Recursion depth'], correctIndex: 1, explanation: 'If no swaps occur in a pass, the array is sorted, so the algorithm can return early — giving a best case of O(n).' },
      { question: 'Is Bubble Sort a stable sorting algorithm?', options: ['Yes', 'No', 'Only for integers', 'Only with the flag optimization'], correctIndex: 0, explanation: 'Bubble Sort only swaps adjacent elements when strictly out of order, so equal elements keep their relative order.' },
      { question: 'What is the space complexity of Bubble Sort?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctIndex: 0, explanation: 'It sorts in place, using only a constant amount of extra memory for swapping.' },
      { question: 'After the first pass of Bubble Sort on an unsorted array, where does the largest element end up?', options: ['At index 0', 'At the last index', 'Somewhere in the middle', 'It is unpredictable'], correctIndex: 1, explanation: 'Each full pass "bubbles" the current largest unsorted element to the end of the array.' },
      { question: 'How many comparisons does Bubble Sort make in the worst case for an array of size n?', options: ['n', 'n log n', 'n(n-1)/2', '2n'], correctIndex: 2, explanation: 'The nested loops produce n(n-1)/2 comparisons in the worst case.' },
      { question: 'What best-case input gives Bubble Sort O(n) time (with the swap-flag optimization)?', options: ['A reverse-sorted array', 'A randomly shuffled array', 'An already sorted array', 'An array of duplicates only'], correctIndex: 2, explanation: 'On an already sorted array, the first pass makes zero swaps, so the algorithm exits immediately.' },
      { question: 'Which loop in the code controls how many elements are already "settled" at the end?', options: ['The while loop', 'The outer for loop variable i', 'The inner for loop variable j', 'There is no such tracking'], correctIndex: 1, explanation: 'As i increases, n - i - 1 shrinks the inner loop range, since the last i elements are already sorted.' },
      { question: 'What kind of algorithm is Bubble Sort, based on comparisons?', options: ['A comparison-based sort', 'A non-comparison (counting) sort', 'A divide-and-conquer sort', 'A hashing-based sort'], correctIndex: 0, explanation: 'Bubble Sort directly compares pairs of elements, making it a comparison sort like Insertion and Selection Sort.' },
      { question: 'Which line performs the actual element swap in the given code?', options: ['bool isSwap = false;', 'if(arr[j] > arr[j+1])', 'swap(arr[j], arr[j+1]);', 'for(j = 0; j < n-i-1; j++)'], correctIndex: 2, explanation: 'The swap() call physically exchanges the two adjacent out-of-order elements.' },
    ],
    flashcards: [
      { front: 'Bubble Sort — core idea', back: 'Repeatedly step through the array, swapping adjacent elements if they are in the wrong order, until no swaps are needed.' },
      { front: 'Bubble Sort — time complexity', back: 'Best: O(n) with early-exit optimization. Average & Worst: O(n²).' },
      { front: 'Bubble Sort — space complexity', back: 'O(1) — sorts in place.' },
      { front: 'Bubble Sort — stability', back: 'Stable: equal elements never cross each other during swaps.' },
      { front: 'Why "Bubble"?', back: 'Because larger elements "bubble up" to the end of the array with each pass.' },
      { front: 'Key optimization', back: 'A boolean flag that tracks whether any swap occurred in a pass — if not, the array is sorted and the loop can exit early.' },
      { front: 'When is Bubble Sort a reasonable choice?', back: 'For tiny arrays, nearly-sorted data, or teaching purposes — rarely for production use on large datasets.' },
    ],
    leetLinks: [
      { title: 'Sort an Array', url: 'https://leetcode.com/problems/sort-an-array/', difficulty: 'Medium' },
      { title: 'Sort Colors', url: 'https://leetcode.com/problems/sort-colors/', difficulty: 'Medium' },
      { title: 'Check if Array Is Sorted and Rotated', url: 'https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/', difficulty: 'Easy' },
    ],
  },
  {
    id: 'comb-sort',
    name: 'Comb Sort',
    shortDescription: 'An improvement over Bubble Sort that eliminates "turtles" (small values near the end) by comparing elements with a shrinking gap.',
    timeComplexityBest: 'O(n log n)',
    timeComplexityAvg: 'O(n² / 2^p)',
    timeComplexityWorst: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: false,
    code: combCode,
    generateSteps: combSteps,
    quiz: [
      { question: 'What problem in Bubble Sort does Comb Sort try to fix?', options: ['Too much memory usage', 'Slow handling of small values near the end ("turtles")', 'Instability', 'Recursive stack overflow'], correctIndex: 1, explanation: 'Small values stuck near the end of the array take many passes to move in Bubble Sort — Comb Sort fixes this with larger initial gaps.' },
      { question: 'What is the typical shrink factor used to reduce the gap in Comb Sort?', options: ['1.3', '2.0', '0.5', '3.0'], correctIndex: 0, explanation: 'A shrink factor of ~1.3 (gap = gap * 10 / 13) is empirically shown to work well.' },
      { question: 'What is the minimum value the gap can take before the algorithm behaves like Bubble Sort?', options: ['0', '1', '2', 'n/2'], correctIndex: 1, explanation: 'Once gap = 1, Comb Sort performs adjacent comparisons just like Bubble Sort.' },
      { question: 'Is Comb Sort a stable sorting algorithm?', options: ['Yes, always', 'No, because it swaps distant elements', 'Only when gap = 1', 'Only for sorted input'], correctIndex: 1, explanation: 'Comparing and swapping elements that are far apart can change the relative order of equal elements, making it unstable.' },
      { question: 'What is the worst-case time complexity of Comb Sort?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n!)'], correctIndex: 2, explanation: 'In the worst case Comb Sort still degrades to O(n²), though this is rare in practice.' },
      { question: 'What condition keeps the outer while loop running in Comb Sort?', options: ['gap > n', 'gap != 1 OR a swap happened', 'gap == 0', 'The array has duplicates'], correctIndex: 1, explanation: 'The loop continues until the gap has shrunk to 1 AND a full pass makes no swaps.' },
      { question: 'What is the space complexity of Comb Sort?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], correctIndex: 0, explanation: 'Like Bubble Sort, it sorts in place using constant extra space.' },
      { question: 'How does the initial gap compare to the array size n?', options: ['gap starts at 1', 'gap starts at n', 'gap starts at n/2', 'gap starts at log(n)'], correctIndex: 1, explanation: 'The gap starts equal to n and shrinks by the factor 1.3 each iteration until it reaches 1.' },
      { question: 'Comb Sort is best described as a variation of which algorithm?', options: ['Merge Sort', 'Bubble Sort', 'Quick Sort', 'Heap Sort'], correctIndex: 1, explanation: 'Comb Sort is essentially Bubble Sort with a shrinking comparison gap instead of always comparing adjacent elements.' },
      { question: 'What data pattern is Comb Sort particularly good at fixing quickly, compared to Bubble Sort?', options: ['A single very large value near the start', 'A single very small value near the end', 'Duplicate values throughout', 'Already-sorted arrays'], correctIndex: 1, explanation: 'These small trailing values ("turtles") take many adjacent swaps in Bubble Sort, but Comb Sort moves them quickly using large gaps.' },
    ],
    flashcards: [
      { front: 'Comb Sort — core idea', back: 'Like Bubble Sort, but compares elements that are gap apart, shrinking the gap by ~1.3× each pass until gap = 1.' },
      { front: 'Comb Sort — the "turtle" problem', back: 'A small value near the end of the array that takes many passes to move with plain Bubble Sort; large gaps fix this quickly.' },
      { front: 'Comb Sort — shrink factor', back: 'Typically 1.3, i.e. gap = (gap * 10) / 13.' },
      { front: 'Comb Sort — stability', back: 'Not stable — distant swaps can reorder equal elements.' },
      { front: 'Comb Sort — time complexity', back: 'Average roughly O(n² / 2ᵖ) where p is the number of increments; worst case O(n²).' },
      { front: 'Comb Sort — when gap = 1', back: 'It becomes exactly equivalent to a single Bubble Sort pass.' },
    ],
    leetLinks: [
      { title: 'Sort an Array', url: 'https://leetcode.com/problems/sort-an-array/', difficulty: 'Medium' },
      { title: 'Sort Array By Parity', url: 'https://leetcode.com/problems/sort-array-by-parity/', difficulty: 'Easy' },
    ],
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    shortDescription: 'Builds the sorted array one element at a time, inserting each new element into its correct position.',
    timeComplexityBest: 'O(n)',
    timeComplexityAvg: 'O(n²)',
    timeComplexityWorst: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: true,
    code: insertionCode,
    generateSteps: insertionSteps,
    quiz: [
      { question: 'What is the main idea of Insertion Sort?', options: ['Divide the array and merge sorted halves', 'Repeatedly find the minimum and place it at the front', 'Grow a sorted prefix by inserting each new element into place', 'Compare elements at a shrinking gap'], correctIndex: 2, explanation: 'Insertion Sort keeps a sorted prefix and inserts each subsequent element into its correct position within it.' },
      { question: 'What input gives Insertion Sort its best-case O(n) performance?', options: ['A reverse-sorted array', 'An already sorted array', 'A random array', 'An array of all equal elements only if large'], correctIndex: 1, explanation: 'On sorted input, the inner while loop never executes, so only one comparison per element is needed.' },
      { question: 'Is Insertion Sort stable?', options: ['Yes', 'No', 'Only for sorted arrays', 'Only for small arrays'], correctIndex: 0, explanation: 'It only shifts elements strictly greater than the key, so equal elements retain their original relative order.' },
      { question: 'In the code, what does the variable "key" represent?', options: ['The smallest element found so far', 'The element currently being inserted into the sorted prefix', 'The gap between compared elements', 'The final sorted array'], correctIndex: 1, explanation: '"key" holds the value being pulled out and inserted into its correct spot among the already-sorted elements.' },
      { question: 'What is the worst-case time complexity of Insertion Sort?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], correctIndex: 2, explanation: 'On a reverse-sorted array, every new element must shift past all previously sorted elements, giving O(n²).' },
      { question: 'Which everyday activity is Insertion Sort often compared to?', options: ['Shuffling a deck of cards', 'Sorting playing cards in your hand', 'Searching a phone book', 'Stacking boxes'], correctIndex: 1, explanation: 'Just like sorting a hand of cards, you take one card and insert it into its correct position among the already-sorted cards.' },
      { question: 'What is the space complexity of Insertion Sort?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctIndex: 0, explanation: 'It sorts in place, needing only a constant amount of extra space for the key variable.' },
      { question: 'What condition keeps the inner while loop shifting elements?', options: ['j >= 0 and arr[j] > key', 'j < n and arr[j] < key', 'i < n', 'arr[j] == key'], correctIndex: 0, explanation: 'Elements greater than the key are shifted one position to the right until the correct insertion point is found.' },
      { question: 'Is Insertion Sort typically efficient for small or nearly-sorted arrays?', options: ['Yes, it performs very well', 'No, it is always slow', 'Only for arrays of size > 1000', 'Only when the array is reversed'], correctIndex: 0, explanation: 'Because its best case is O(n) and overhead is low, Insertion Sort is often used for small or nearly-sorted arrays, and inside hybrid algorithms.' },
      { question: 'How many elements are guaranteed sorted before the i-th iteration of the outer loop begins?', options: ['1', 'i', 'n', '0'], correctIndex: 1, explanation: 'The first i elements form a sorted prefix by the time the outer loop reaches index i.' },
    ],
    flashcards: [
      { front: 'Insertion Sort — core idea', back: 'Grow a sorted prefix of the array one element at a time by inserting each new element where it belongs.' },
      { front: 'Insertion Sort — analogy', back: 'Sorting a hand of playing cards: pick up one card and slot it into the right place among the cards you already hold.' },
      { front: 'Insertion Sort — time complexity', back: 'Best: O(n) (already sorted). Average & Worst: O(n²).' },
      { front: 'Insertion Sort — stability', back: 'Stable — only strictly greater elements are shifted.' },
      { front: 'Insertion Sort — space complexity', back: 'O(1), in-place.' },
      { front: 'When is Insertion Sort a good choice?', back: 'Small arrays, nearly-sorted data, or as the base case in hybrid sorts like Timsort.' },
    ],
    leetLinks: [
      { title: 'Sort an Array', url: 'https://leetcode.com/problems/sort-an-array/', difficulty: 'Medium' },
      { title: 'Insertion Sort List', url: 'https://leetcode.com/problems/insertion-sort-list/', difficulty: 'Medium' },
      { title: 'Insert Interval', url: 'https://leetcode.com/problems/insert-interval/', difficulty: 'Medium' },
    ],
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    shortDescription: 'Repeatedly selects the minimum element from the unsorted region and moves it to the front.',
    timeComplexityBest: 'O(n²)',
    timeComplexityAvg: 'O(n²)',
    timeComplexityWorst: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: false,
    code: selectionCode,
    generateSteps: selectionSteps,
    quiz: [
      { question: 'What is the core idea of Selection Sort?', options: ['Insert each element into a sorted prefix', 'Repeatedly find the minimum of the unsorted region and swap it to the front', 'Divide the array and merge halves', 'Compare elements at a shrinking gap'], correctIndex: 1, explanation: 'Selection Sort scans the unsorted part for the minimum element and swaps it into place at the front.' },
      { question: 'What is the time complexity of Selection Sort in the BEST case?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], correctIndex: 2, explanation: 'Selection Sort always scans the remaining unsorted elements to find the minimum, regardless of input order, so even the best case is O(n²).' },
      { question: 'Is Selection Sort stable?', options: ['Yes, always', 'No, the swap can reorder equal elements', 'Only for sorted arrays', 'Only if no duplicates exist'], correctIndex: 1, explanation: 'Swapping the found minimum with arr[i] can jump it past equal elements, breaking stability (though a stable variant exists).' },
      { question: 'How many swaps does Selection Sort perform in the worst case for an array of size n?', options: ['O(n²)', 'O(n)', 'O(n log n)', 'O(1)'], correctIndex: 1, explanation: 'Unlike Bubble Sort, Selection Sort does at most one swap per outer loop iteration — O(n) swaps total, even though comparisons are O(n²).' },
      { question: 'What does "minIdx" track in the algorithm?', options: ['The last sorted index', 'The index of the smallest element found so far in the unsorted region', 'The gap size', 'The pivot index'], correctIndex: 1, explanation: 'minIdx is updated whenever a smaller element is found while scanning the unsorted region.' },
      { question: 'What is the space complexity of Selection Sort?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctIndex: 0, explanation: 'It sorts in place with only a few extra variables, giving constant space.' },
      { question: 'Why might Selection Sort be preferred over Bubble Sort despite having the same big-O time?', options: ['It uses less memory', 'It performs far fewer swaps, useful when writes are costly', 'It is stable', 'It is recursive'], correctIndex: 1, explanation: 'Selection Sort makes only O(n) swaps versus Bubble Sort\'s potential O(n²) swaps, which matters when write operations are expensive.' },
      { question: 'After the i-th iteration of the outer loop, which elements are guaranteed to be in final sorted position?', options: ['None', 'The first i+1 elements', 'The last i elements', 'All elements'], correctIndex: 1, explanation: 'Each outer loop iteration places one more minimum element correctly at the front, growing the sorted prefix.' },
      { question: 'What triggers the swap in the outer loop?', options: ['Always swap, every iteration', 'Only if minIdx != i', 'Only if the array has duplicates', 'Only on the last iteration'], correctIndex: 1, explanation: 'If the minimum is already at index i, no swap is necessary — the code checks minIdx != i before swapping.' },
      { question: 'Selection Sort is best suited for which scenario?', options: ['Huge datasets needing speed', 'Situations where memory writes are expensive and array is small', 'Sorting linked lists efficiently', 'External sorting of massive files'], correctIndex: 1, explanation: 'Its low number of swaps makes it useful when write/swap operations are costly, even though comparisons remain O(n²).' },
    ],
    flashcards: [
      { front: 'Selection Sort — core idea', back: 'Repeatedly find the minimum of the remaining unsorted elements and swap it into the front of the unsorted region.' },
      { front: 'Selection Sort — time complexity', back: 'O(n²) in best, average, and worst cases — it always scans the full unsorted region.' },
      { front: 'Selection Sort — number of swaps', back: 'At most O(n) swaps total — far fewer than Bubble Sort.' },
      { front: 'Selection Sort — stability', back: 'Not stable by default (swapping can reorder equal elements).' },
      { front: 'Selection Sort — space complexity', back: 'O(1), sorts in place.' },
      { front: 'When to use Selection Sort', back: 'When minimizing the number of swaps matters more than minimizing comparisons (e.g. costly writes), on small arrays.' },
    ],
    leetLinks: [
      { title: 'Sort an Array', url: 'https://leetcode.com/problems/sort-an-array/', difficulty: 'Medium' },
      { title: 'Kth Largest Element in an Array', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', difficulty: 'Medium' },
    ],
  },
  {
    id: 'shell-sort',
    name: 'Shell Sort',
    shortDescription: 'A generalization of Insertion Sort that first sorts elements far apart, then progressively reduces the gap.',
    timeComplexityBest: 'O(n log n)',
    timeComplexityAvg: 'O(n^1.3) (gap dependent)',
    timeComplexityWorst: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: false,
    code: shellCode,
    generateSteps: shellStepsFn,
    quiz: [
      { question: 'Shell Sort is a generalization of which algorithm?', options: ['Selection Sort', 'Insertion Sort', 'Merge Sort', 'Heap Sort'], correctIndex: 1, explanation: 'Shell Sort performs gap-based insertion sort passes, starting with large gaps and shrinking to 1 (a plain Insertion Sort pass).' },
      { question: 'How does Shell Sort typically initialize its gap?', options: ['gap = 1', 'gap = n', 'gap = n / 2', 'gap = log(n)'], correctIndex: 2, explanation: 'A common strategy starts with gap = n/2 and halves it each iteration until it reaches 0.' },
      { question: 'What happens when the gap becomes 1 in Shell Sort?', options: ['The algorithm terminates immediately', 'It performs a standard Insertion Sort pass', 'It restarts from the largest gap', 'It becomes Bubble Sort'], correctIndex: 1, explanation: 'With gap = 1, comparing arr[j-gap] to arr[j] is exactly a normal adjacent-element Insertion Sort pass.' },
      { question: 'Is Shell Sort a stable sorting algorithm?', options: ['Yes, always', 'No, elements can jump past equal elements across large gaps', 'Only when gap = 1', 'Only for sorted input'], correctIndex: 1, explanation: 'Because elements far apart get swapped directly, equal elements can change relative order, making Shell Sort unstable.' },
      { question: 'What is the worst-case time complexity of Shell Sort (with typical gap sequences)?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n!)'], correctIndex: 2, explanation: 'With a simple halving gap sequence, the worst case remains O(n²), though better gap sequences can improve this.' },
      { question: 'What is the main benefit of using large gaps early in Shell Sort?', options: ['It uses less memory', 'It moves out-of-place elements long distances quickly, reducing later work', 'It guarantees stability', 'It avoids all comparisons'], correctIndex: 1, explanation: 'Large gaps let far-apart elements move toward their correct position quickly, so later smaller-gap passes do much less work.' },
      { question: 'What is the space complexity of Shell Sort?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], correctIndex: 0, explanation: 'Like Insertion Sort, it sorts in place using only a few extra variables.' },
      { question: 'In the code, what does the innermost while-like for-loop do?', options: ['Finds the minimum of the array', 'Shifts elements that are gap apart to make room for temp', 'Merges two sorted halves', 'Computes the next gap'], correctIndex: 1, explanation: 'It shifts arr[j-gap] into arr[j] while arr[j-gap] is greater than temp, exactly like Insertion Sort but with a gap instead of 1.' },
      { question: 'Which gap sequence choice can significantly affect Shell Sort\'s performance?', options: ['It never matters, always O(n²)', 'Better sequences like Knuth\'s or Sedgewick\'s can reduce time complexity below O(n²)', 'Only random gap sequences work', 'Gaps must always be even numbers'], correctIndex: 1, explanation: 'Researchers have found gap sequences (e.g. Knuth: 3k+1, or Sedgewick\'s) that yield sub-quadratic worst-case performance.' },
      { question: 'Shell Sort is often used as a practical alternative to which pair of algorithms for medium-sized arrays?', options: ['Merge Sort and Quick Sort, due to simplicity and low overhead', 'Radix Sort and Counting Sort', 'BFS and DFS', 'Binary Search and Linear Search'], correctIndex: 0, explanation: 'For medium-sized data, Shell Sort can outperform simple O(n²) sorts while avoiding the recursion overhead of Merge/Quick Sort.' },
    ],
    flashcards: [
      { front: 'Shell Sort — core idea', back: 'A gap-based generalization of Insertion Sort: sort elements far apart first, then shrink the gap until it reaches 1.' },
      { front: 'Shell Sort — typical gap sequence', back: 'Start at gap = n/2, then halve it each round: n/2, n/4, ..., 1.' },
      { front: 'Shell Sort — time complexity', back: 'Depends on the gap sequence; commonly around O(n^1.3) average, O(n²) worst case with simple halving.' },
      { front: 'Shell Sort — stability', back: 'Not stable — distant swaps can reorder equal elements.' },
      { front: 'Shell Sort — space complexity', back: 'O(1), in-place.' },
      { front: 'Shell Sort — why it helps over plain Insertion Sort', back: 'Large initial gaps move far-out-of-place elements quickly, so the final gap = 1 pass has much less work to do.' },
    ],
    leetLinks: [
      { title: 'Sort an Array', url: 'https://leetcode.com/problems/sort-an-array/', difficulty: 'Medium' },
      { title: 'Sort List', url: 'https://leetcode.com/problems/sort-list/', difficulty: 'Medium' },
    ],
  },
];

export const getAlgorithmById = (id: string) => sortingAlgorithms.find((a) => a.id === id);