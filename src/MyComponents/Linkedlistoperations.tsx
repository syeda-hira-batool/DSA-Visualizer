import type { LLNode, LLStep, LLOperation, ListTypeConfig } from './Types';

function mk(
  nodes: LLNode[],
  codeLine: number,
  note: string,
  pointerIndex: number | null = null,
  highlightIndex: number | null = null,
  newIndex: number | null = null
): LLStep {
  return { nodes: nodes.map((n) => ({ ...n })), codeLine, note, pointerIndex, highlightIndex, newIndex };
}

const toNodes = (arr: number[]): LLNode[] => arr.map((v, i) => ({ id: i, value: v }));
const nextId = (nodes: LLNode[]) => (nodes.length ? Math.max(...nodes.map((n) => n.id)) + 1 : 0);

/* ============================== SINGLY ================================= */

const sInsertBeginningCode = [
  'void insertAtBeginning(Node* &head, int val){',
  '    Node* newNode = new Node();',
  '    newNode->data = val;',
  '    newNode->next = head;',
  '    head = newNode;',
  '}',
];
function sInsertBeginning(initial: number[], value = 0): LLStep[] {
  let nodes = toNodes(initial);
  const steps: LLStep[] = [];
  steps.push(mk(nodes, 2, 'Allocate a new node.'));
  const newNode: LLNode = { id: nextId(nodes), value };
  steps.push(mk(nodes, 3, `newNode->data = ${value}.`));
  nodes = [newNode, ...nodes];
  steps.push(mk(nodes, 4, 'newNode->next = head (points to the old first node).', null, null, 0));
  steps.push(mk(nodes, 5, 'head = newNode — it is now the first node.', null, null, 0));
  return steps;
}

const sInsertPositionCode = [
  'void insertAtPosition(Node* &head, int val, int pos){',
  '    if(pos == 0){',
  '        insertAtBeginning(head, val);',
  '        return;',
  '    }',
  '    Node* temp = head;',
  '    for(int i = 0; i < pos - 1 && temp != NULL; i++){',
  '        temp = temp->next;',
  '    }',
  '    if(temp == NULL) return;',
  '    Node* newNode = new Node();',
  '    newNode->data = val;',
  '    newNode->next = temp->next;',
  '    temp->next = newNode;',
  '}',
];
function sInsertPosition(initial: number[], value = 0, position = 0): LLStep[] {
  const nodes = toNodes(initial);
  const steps: LLStep[] = [];
  const pos = Math.max(0, Math.min(position, nodes.length));
  if (pos === 0) {
    steps.push(mk(nodes, 2, 'pos == 0 → delegate to insertAtBeginning.'));
    const linked = [{ id: nextId(nodes), value }, ...nodes];
    steps.push(mk(linked, 3, 'New node becomes the head.', null, null, 0));
    return steps;
  }
  steps.push(mk(nodes, 6, 'temp = head.', 0));
  let tempIdx = 0;
  for (let i = 0; i < pos - 1; i++) {
    steps.push(mk(nodes, 7, `i = ${i} < pos - 1 (${pos - 1}) — keep going.`, tempIdx));
    tempIdx++;
    steps.push(mk(nodes, 8, `temp = temp->next (now at index ${tempIdx}).`, tempIdx));
  }
  steps.push(mk(nodes, 10, 'temp is valid — continue.', tempIdx));
  steps.push(mk(nodes, 11, 'Allocate newNode.', tempIdx));
  const newNode: LLNode = { id: nextId(nodes), value };
  steps.push(mk(nodes, 12, `newNode->data = ${value}.`, tempIdx));
  const insertAt = tempIdx + 1;
  const linked = [...nodes.slice(0, insertAt), newNode, ...nodes.slice(insertAt)];
  steps.push(mk(linked, 13, 'newNode->next = temp->next.', tempIdx, null, insertAt));
  steps.push(mk(linked, 14, 'temp->next = newNode — inserted.', tempIdx, null, insertAt));
  return steps;
}

const sSearchCode = [
  'int search(Node* head, int key){',
  '    Node* temp = head;',
  '    int index = 0;',
  '    while(temp != NULL){',
  '        if(temp->data == key){',
  '            return index;',
  '        }',
  '        temp = temp->next;',
  '        index++;',
  '    }',
  '    return -1;',
  '}',
];
function sSearch(initial: number[], value = 0): LLStep[] {
  const nodes = toNodes(initial);
  const steps: LLStep[] = [];
  steps.push(mk(nodes, 2, 'temp = head.', nodes.length ? 0 : null));
  steps.push(mk(nodes, 3, 'index = 0.', nodes.length ? 0 : null));
  let idx = 0;
  while (idx < nodes.length) {
    steps.push(mk(nodes, 4, 'temp != NULL — keep searching.', idx));
    steps.push(mk(nodes, 5, `Compare temp->data (${nodes[idx].value}) with key (${value}).`, idx));
    if (nodes[idx].value === value) {
      steps.push(mk(nodes, 6, `Found! Return index ${idx}.`, idx, idx));
      return steps;
    }
    steps.push(mk(nodes, 8, 'temp = temp->next.', idx));
    idx++;
    steps.push(mk(nodes, 9, `index = ${idx}.`, idx < nodes.length ? idx : null));
  }
  steps.push(mk(nodes, 11, 'Reached NULL — value not found, return -1.', null));
  return steps;
}

const sDisplayCode = [
  'void display(Node* head){',
  '    Node* temp = head;',
  '    while(temp != NULL){',
  '        cout << temp->data << " -> ";',
  '        temp = temp->next;',
  '    }',
  '    cout << "NULL" << endl;',
  '}',
];
function sDisplay(initial: number[]): LLStep[] {
  const nodes = toNodes(initial);
  const steps: LLStep[] = [];
  steps.push(mk(nodes, 2, 'temp = head.', nodes.length ? 0 : null));
  for (let idx = 0; idx < nodes.length; idx++) {
    steps.push(mk(nodes, 3, 'temp != NULL — print and advance.', idx));
    steps.push(mk(nodes, 4, `Print ${nodes[idx].value}.`, idx, idx));
    steps.push(mk(nodes, 5, 'temp = temp->next.', idx + 1 < nodes.length ? idx + 1 : null));
  }
  steps.push(mk(nodes, 7, 'Reached NULL — print "NULL".', null));
  return steps;
}

const sDeleteFrontCode = [
  'void deleteAtFront(Node* &head){',
  '    if(head == NULL) return;',
  '    Node* temp = head;',
  '    head = head->next;',
  '    delete temp;',
  '}',
];
function sDeleteFront(initial: number[]): LLStep[] {
  let nodes = toNodes(initial);
  const steps: LLStep[] = [];
  if (nodes.length === 0) {
    steps.push(mk(nodes, 2, 'head == NULL — nothing to delete.'));
    return steps;
  }
  steps.push(mk(nodes, 3, 'temp = head.', 0));
  steps.push(mk(nodes, 4, 'head = head->next.', 0, 0));
  nodes = nodes.slice(1);
  steps.push(mk(nodes, 5, 'delete temp — old head removed.'));
  return steps;
}

const sDeletePositionCode = [
  'void deleteAtPosition(Node* &head, int pos){',
  '    if(head == NULL) return;',
  '    if(pos == 0){',
  '        deleteAtFront(head);',
  '        return;',
  '    }',
  '    Node* temp = head;',
  '    for(int i = 0; i < pos - 1 && temp->next != NULL; i++){',
  '        temp = temp->next;',
  '    }',
  '    if(temp->next == NULL) return;',
  '    Node* toDelete = temp->next;',
  '    temp->next = toDelete->next;',
  '    delete toDelete;',
  '}',
];
function sDeletePosition(initial: number[], _value?: number, position = 0): LLStep[] {
  let nodes = toNodes(initial);
  const steps: LLStep[] = [];
  if (nodes.length === 0) {
    steps.push(mk(nodes, 2, 'head == NULL — nothing to delete.'));
    return steps;
  }
  const pos = Math.max(0, Math.min(position, nodes.length - 1));
  if (pos === 0) {
    steps.push(mk(nodes, 3, 'pos == 0 → delegate to deleteAtFront.'));
    steps.push(mk(nodes, 4, 'Remove the head node.', 0, 0));
    nodes = nodes.slice(1);
    steps.push(mk(nodes, 5, 'Old head deleted.'));
    return steps;
  }
  steps.push(mk(nodes, 7, 'temp = head.', 0));
  let tempIdx = 0;
  for (let i = 0; i < pos - 1; i++) {
    steps.push(mk(nodes, 8, `i = ${i} < pos - 1 (${pos - 1}) — keep going.`, tempIdx));
    tempIdx++;
    steps.push(mk(nodes, 9, `temp = temp->next (now at index ${tempIdx}).`, tempIdx));
  }
  steps.push(mk(nodes, 11, 'temp->next exists — continue.', tempIdx, tempIdx + 1));
  steps.push(mk(nodes, 12, 'toDelete = temp->next.', tempIdx, tempIdx + 1));
  const toDeleteIdx = tempIdx + 1;
  nodes = [...nodes.slice(0, toDeleteIdx), ...nodes.slice(toDeleteIdx + 1)];
  steps.push(mk(nodes, 13, 'temp->next = toDelete->next — bridged around it.', tempIdx));
  steps.push(mk(nodes, 14, 'delete toDelete.'));
  return steps;
}

const sDeleteEndCode = [
  'void deleteAtEnd(Node* &head){',
  '    if(head == NULL) return;',
  '    if(head->next == NULL){',
  '        delete head;',
  '        head = NULL;',
  '        return;',
  '    }',
  '    Node* temp = head;',
  '    while(temp->next->next != NULL){',
  '        temp = temp->next;',
  '    }',
  '    delete temp->next;',
  '    temp->next = NULL;',
  '}',
];
function sDeleteEnd(initial: number[]): LLStep[] {
  let nodes = toNodes(initial);
  const steps: LLStep[] = [];
  if (nodes.length === 0) {
    steps.push(mk(nodes, 2, 'head == NULL — nothing to delete.'));
    return steps;
  }
  if (nodes.length === 1) {
    steps.push(mk(nodes, 3, 'head->next == NULL — only one node.', 0));
    steps.push(mk(nodes, 4, 'delete head.', 0, 0));
    nodes = [];
    steps.push(mk(nodes, 5, 'head = NULL.'));
    return steps;
  }
  steps.push(mk(nodes, 8, 'temp = head.', 0));
  let tempIdx = 0;
  while (tempIdx < nodes.length - 2) {
    steps.push(mk(nodes, 9, 'temp->next->next != NULL — keep going.', tempIdx));
    tempIdx++;
    steps.push(mk(nodes, 10, `temp = temp->next (now at index ${tempIdx}).`, tempIdx));
  }
  steps.push(mk(nodes, 12, 'delete temp->next — last node removed.', tempIdx, nodes.length - 1));
  nodes = nodes.slice(0, -1);
  steps.push(mk(nodes, 13, 'temp->next = NULL.', tempIdx));
  return steps;
}

const singlyOperations: LLOperation[] = [
  { id: 'insert-beginning', name: 'Insert at the Beginning', code: sInsertBeginningCode, needsValue: true, needsPosition: false, generateSteps: sInsertBeginning },
  { id: 'insert-position', name: 'Insert at Any Position', code: sInsertPositionCode, needsValue: true, needsPosition: true, generateSteps: sInsertPosition },
  { id: 'search', name: 'Searching', code: sSearchCode, needsValue: true, valueLabel: 'value to search', needsPosition: false, generateSteps: sSearch },
  { id: 'display', name: 'Display', code: sDisplayCode, needsValue: false, needsPosition: false, generateSteps: sDisplay },
  { id: 'delete-front', name: 'Delete at Front', code: sDeleteFrontCode, needsValue: false, needsPosition: false, generateSteps: sDeleteFront },
  { id: 'delete-position', name: 'Delete at Any Position', code: sDeletePositionCode, needsValue: false, needsPosition: true, generateSteps: sDeletePosition },
  { id: 'delete-end', name: 'Deletion at the End', code: sDeleteEndCode, needsValue: false, needsPosition: false, generateSteps: sDeleteEnd },
];

/* ============================== DOUBLY ================================== */

const dInsertBeginningCode = [
  'void insertAtBeginning(Node* &head, int val){',
  '    Node* newNode = new Node();',
  '    newNode->data = val;',
  '    newNode->next = head;',
  '    newNode->prev = NULL;',
  '    if(head != NULL){',
  '        head->prev = newNode;',
  '    }',
  '    head = newNode;',
  '}',
];
function dInsertBeginning(initial: number[], value = 0): LLStep[] {
  let nodes = toNodes(initial);
  const steps: LLStep[] = [];
  steps.push(mk(nodes, 2, 'Allocate newNode.'));
  const newNode: LLNode = { id: nextId(nodes), value };
  steps.push(mk(nodes, 3, `newNode->data = ${value}.`));
  const hadOldHead = nodes.length > 0;
  nodes = [newNode, ...nodes];
  steps.push(mk(nodes, 4, 'newNode->next = head.', null, null, 0));
  steps.push(mk(nodes, 5, 'newNode->prev = NULL.', null, null, 0));
  if (hadOldHead) {
    steps.push(mk(nodes, 7, 'head->prev = newNode.', 1, null, 0));
  }
  steps.push(mk(nodes, 9, 'head = newNode.', null, null, 0));
  return steps;
}

const dInsertPositionCode = [
  'void insertAtPosition(Node* &head, int val, int pos){',
  '    if(pos == 0){',
  '        insertAtBeginning(head, val);',
  '        return;',
  '    }',
  '    Node* temp = head;',
  '    for(int i = 0; i < pos - 1 && temp != NULL; i++){',
  '        temp = temp->next;',
  '    }',
  '    if(temp == NULL) return;',
  '    Node* newNode = new Node();',
  '    newNode->data = val;',
  '    newNode->next = temp->next;',
  '    newNode->prev = temp;',
  '    if(temp->next != NULL){',
  '        temp->next->prev = newNode;',
  '    }',
  '    temp->next = newNode;',
  '}',
];
function dInsertPosition(initial: number[], value = 0, position = 0): LLStep[] {
  const nodes = toNodes(initial);
  const steps: LLStep[] = [];
  const pos = Math.max(0, Math.min(position, nodes.length));
  if (pos === 0) {
    steps.push(mk(nodes, 2, 'pos == 0 → delegate to insertAtBeginning.'));
    const linked = [{ id: nextId(nodes), value }, ...nodes];
    steps.push(mk(linked, 3, 'New node becomes the head.', null, null, 0));
    return steps;
  }
  steps.push(mk(nodes, 6, 'temp = head.', 0));
  let tempIdx = 0;
  for (let i = 0; i < pos - 1; i++) {
    steps.push(mk(nodes, 7, `i = ${i} < pos - 1 (${pos - 1}) — keep going.`, tempIdx));
    tempIdx++;
    steps.push(mk(nodes, 8, `temp = temp->next (now at index ${tempIdx}).`, tempIdx));
  }
  steps.push(mk(nodes, 10, 'temp is valid — continue.', tempIdx));
  steps.push(mk(nodes, 11, 'Allocate newNode.', tempIdx));
  const newNode: LLNode = { id: nextId(nodes), value };
  steps.push(mk(nodes, 12, `newNode->data = ${value}.`, tempIdx));
  const insertAt = tempIdx + 1;
  const linked = [...nodes.slice(0, insertAt), newNode, ...nodes.slice(insertAt)];
  steps.push(mk(linked, 13, 'newNode->next = temp->next.', tempIdx, null, insertAt));
  steps.push(mk(linked, 14, 'newNode->prev = temp.', tempIdx, null, insertAt));
  if (insertAt < linked.length - 1) {
    steps.push(mk(linked, 16, 'temp->next->prev = newNode.', tempIdx, insertAt + 1));
  }
  steps.push(mk(linked, 18, 'temp->next = newNode — inserted.', tempIdx, null, insertAt));
  return steps;
}

const dSearchCode = [
  'int search(Node* head, int key){',
  '    Node* temp = head;',
  '    int index = 0;',
  '    while(temp != NULL){',
  '        if(temp->data == key){',
  '            return index;',
  '        }',
  '        temp = temp->next;',
  '        index++;',
  '    }',
  '    return -1;',
  '}',
];
function dSearch(initial: number[], value = 0): LLStep[] {
  return sSearch(initial, value); // identical traversal logic; separate code text above
}

const dDisplayCode = [
  'void display(Node* head){',
  '    Node* temp = head;',
  '    while(temp != NULL){',
  '        cout << temp->data << " <-> ";',
  '        temp = temp->next;',
  '    }',
  '    cout << "NULL" << endl;',
  '}',
];
function dDisplay(initial: number[]): LLStep[] {
  return sDisplay(initial);
}

const dDeleteFrontCode = [
  'void deleteAtFront(Node* &head){',
  '    if(head == NULL) return;',
  '    Node* temp = head;',
  '    head = head->next;',
  '    if(head != NULL){',
  '        head->prev = NULL;',
  '    }',
  '    delete temp;',
  '}',
];
function dDeleteFront(initial: number[]): LLStep[] {
  let nodes = toNodes(initial);
  const steps: LLStep[] = [];
  if (nodes.length === 0) {
    steps.push(mk(nodes, 2, 'head == NULL — nothing to delete.'));
    return steps;
  }
  steps.push(mk(nodes, 3, 'temp = head.', 0));
  steps.push(mk(nodes, 4, 'head = head->next.', 0, 0));
  const rest = nodes.slice(1);
  if (rest.length > 0) {
    steps.push(mk(nodes, 6, 'head->prev = NULL.', 1, 0));
  }
  nodes = rest;
  steps.push(mk(nodes, 8, 'delete temp — old head removed.'));
  return steps;
}

const dDeletePositionCode = [
  'void deleteAtPosition(Node* &head, int pos){',
  '    if(head == NULL) return;',
  '    Node* temp = head;',
  '    for(int i = 0; i < pos && temp != NULL; i++){',
  '        temp = temp->next;',
  '    }',
  '    if(temp == NULL) return;',
  '    if(temp->prev != NULL){',
  '        temp->prev->next = temp->next;',
  '    } else {',
  '        head = temp->next;',
  '    }',
  '    if(temp->next != NULL){',
  '        temp->next->prev = temp->prev;',
  '    }',
  '    delete temp;',
  '}',
];
function dDeletePosition(initial: number[], _value?: number, position = 0): LLStep[] {
  let nodes = toNodes(initial);
  const steps: LLStep[] = [];
  if (nodes.length === 0) {
    steps.push(mk(nodes, 2, 'head == NULL — nothing to delete.'));
    return steps;
  }
  const pos = Math.max(0, Math.min(position, nodes.length - 1));
  steps.push(mk(nodes, 3, 'temp = head.', 0));
  let tempIdx = 0;
  for (let i = 0; i < pos; i++) {
    steps.push(mk(nodes, 4, `i = ${i} < pos (${pos}) — keep going.`, tempIdx));
    tempIdx++;
    steps.push(mk(nodes, 5, `temp = temp->next (now at index ${tempIdx}).`, tempIdx));
  }
  steps.push(mk(nodes, 7, 'temp is valid — continue.', tempIdx, tempIdx));
  if (tempIdx > 0) {
    steps.push(mk(nodes, 9, 'temp->prev->next = temp->next.', tempIdx - 1, tempIdx));
  } else {
    steps.push(mk(nodes, 11, 'temp is head — head = temp->next.', null, tempIdx));
  }
  if (tempIdx < nodes.length - 1) {
    steps.push(mk(nodes, 14, 'temp->next->prev = temp->prev.', tempIdx + 1, tempIdx));
  }
  nodes = [...nodes.slice(0, tempIdx), ...nodes.slice(tempIdx + 1)];
  steps.push(mk(nodes, 16, 'delete temp.'));
  return steps;
}

const dDeleteEndCode = [
  'void deleteAtEnd(Node* &head){',
  '    if(head == NULL) return;',
  '    Node* temp = head;',
  '    while(temp->next != NULL){',
  '        temp = temp->next;',
  '    }',
  '    if(temp->prev != NULL){',
  '        temp->prev->next = NULL;',
  '    } else {',
  '        head = NULL;',
  '    }',
  '    delete temp;',
  '}',
];
function dDeleteEnd(initial: number[]): LLStep[] {
  let nodes = toNodes(initial);
  const steps: LLStep[] = [];
  if (nodes.length === 0) {
    steps.push(mk(nodes, 2, 'head == NULL — nothing to delete.'));
    return steps;
  }
  steps.push(mk(nodes, 3, 'temp = head.', 0));
  let tempIdx = 0;
  while (tempIdx < nodes.length - 1) {
    steps.push(mk(nodes, 4, 'temp->next != NULL — keep going.', tempIdx));
    tempIdx++;
    steps.push(mk(nodes, 5, `temp = temp->next (now at index ${tempIdx}).`, tempIdx));
  }
  if (tempIdx > 0) {
    steps.push(mk(nodes, 8, 'temp->prev->next = NULL.', tempIdx - 1, tempIdx));
  } else {
    steps.push(mk(nodes, 10, 'temp is head — head = NULL.', null, tempIdx));
  }
  nodes = nodes.slice(0, -1);
  steps.push(mk(nodes, 12, 'delete temp — last node removed.'));
  return steps;
}

const doublyOperations: LLOperation[] = [
  { id: 'insert-beginning', name: 'Insert at the Beginning', code: dInsertBeginningCode, needsValue: true, needsPosition: false, generateSteps: dInsertBeginning },
  { id: 'insert-position', name: 'Insert at Any Position', code: dInsertPositionCode, needsValue: true, needsPosition: true, generateSteps: dInsertPosition },
  { id: 'search', name: 'Searching', code: dSearchCode, needsValue: true, valueLabel: 'value to search', needsPosition: false, generateSteps: dSearch },
  { id: 'display', name: 'Display', code: dDisplayCode, needsValue: false, needsPosition: false, generateSteps: dDisplay },
  { id: 'delete-front', name: 'Delete at Front', code: dDeleteFrontCode, needsValue: false, needsPosition: false, generateSteps: dDeleteFront },
  { id: 'delete-position', name: 'Delete at Any Position', code: dDeletePositionCode, needsValue: false, needsPosition: true, generateSteps: dDeletePosition },
  { id: 'delete-end', name: 'Deletion at the End', code: dDeleteEndCode, needsValue: false, needsPosition: false, generateSteps: dDeleteEnd },
];

/* ============================ LIST CONFIGS =============================== */

export const linkedListTypes: ListTypeConfig[] = [
  {
    id: 'singly',
    name: 'Singly Linked List',
    description: 'Each node points only to the next node — traversal is one-directional.',
    operations: singlyOperations,
    quiz: [
      { question: 'What does each node in a singly linked list store?', options: ['Only data', 'Data and a pointer to the next node', 'Data and pointers to both neighbors', 'Only a pointer'], correctIndex: 1, explanation: 'A singly linked list node bundles a data field with a single "next" pointer.' },
      { question: 'What is the time complexity of inserting at the beginning?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctIndex: 0, explanation: 'You just allocate a node, point it at the old head, and update head — no traversal needed.' },
      { question: 'What is the time complexity of accessing the k-th element?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctIndex: 2, explanation: 'Unlike arrays, linked lists have no random access — you must walk from the head, node by node.' },
      { question: 'What does "head" represent?', options: ['The last node', 'A pointer to the first node (or NULL if empty)', 'The middle node', 'The total node count'], correctIndex: 1, explanation: 'head is the entry point into the list; everything is reached by following next pointers from it.' },
      { question: 'Why is deleting the last node O(n) in a singly linked list?', options: ['Because nodes are stored in an array', 'Because you must traverse from head to find the second-to-last node', 'Because deletion always requires sorting', 'It is actually O(1)'], correctIndex: 1, explanation: 'With no "prev" pointer, the only way to find the node just before the tail is to walk the whole list.' },
      { question: 'What must be updated after inserting a new node at the beginning?', options: ['Nothing', 'head, to point at the new node', 'Every node\'s data value', 'The tail pointer only'], correctIndex: 1, explanation: 'head has to be reassigned so it now points to the newly created first node.' },
      { question: 'What is the worst-case time complexity of searching for a value?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctIndex: 2, explanation: 'In the worst case (value at the end, or absent), every node must be visited.' },
      { question: 'What value marks the end of a singly linked list?', options: ['0', '-1', 'NULL / nullptr', 'The head itself'], correctIndex: 2, explanation: 'The last node\'s next pointer is set to NULL, signaling there is nothing after it.' },
      { question: 'What problem with arrays does a linked list solve?', options: ['Faster random access', 'Dynamic size without shifting elements on insertion', 'Better cache locality', 'Built-in sorting'], correctIndex: 1, explanation: 'Linked lists grow and shrink node by node — no need to resize or shift a contiguous block of memory.' },
      { question: 'What is the extra memory overhead per node compared to just storing the value?', options: ['None', 'One pointer (next)', 'Two pointers', 'A fixed 100 bytes'], correctIndex: 1, explanation: 'Each node needs one additional pointer field to link to the next node.' },
    ],
    flashcards: [
      { front: 'Singly Linked List — core idea', back: 'A chain of nodes where each node holds a value and a pointer to the next node; the list is only traversable forward.' },
      { front: 'Node structure', back: 'struct Node { int data; Node* next; };' },
      { front: 'Insert at beginning — complexity', back: 'O(1): allocate, point newNode->next at head, then reassign head.' },
      { front: 'Delete at end — complexity', back: 'O(n): must walk to the second-to-last node since there is no prev pointer.' },
      { front: 'Search — complexity', back: 'O(n) worst case — no random access, must traverse from head.' },
      { front: 'When to use a singly linked list', back: 'Frequent insertions/deletions at the front, or when memory for a prev pointer isn\'t worth the cost.' },
    ],
    leetLinks: [
      { title: 'Reverse Linked List', url: 'https://leetcode.com/problems/reverse-linked-list/', difficulty: 'Easy' },
      { title: 'Merge Two Sorted Lists', url: 'https://leetcode.com/problems/merge-two-sorted-lists/', difficulty: 'Easy' },
      { title: 'Remove Nth Node From End of List', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', difficulty: 'Medium' },
      { title: 'Linked List Cycle', url: 'https://leetcode.com/problems/linked-list-cycle/', difficulty: 'Easy' },
    ],
  },
  {
    id: 'doubly',
    name: 'Doubly Linked List',
    description: 'Each node points to both its next and previous neighbor — traversal works in both directions.',
    operations: doublyOperations,
    quiz: [
      { question: 'What does each node in a doubly linked list store?', options: ['Data and a next pointer only', 'Data, a next pointer, and a prev pointer', 'Only next and prev pointers', 'Data and an index'], correctIndex: 1, explanation: 'The defining feature is the extra "prev" pointer alongside data and next.' },
      { question: 'What capability does a doubly linked list have that a singly linked list does not?', options: ['O(1) random access', 'Traversal in both directions', 'Built-in sorting', 'No memory overhead'], correctIndex: 1, explanation: 'The prev pointer lets you walk backward from any node, not just forward.' },
      { question: 'What is the extra memory overhead per node compared to a singly linked list?', options: ['None', 'One additional pointer (prev)', 'Two additional pointers', 'A fixed-size array'], correctIndex: 1, explanation: 'Each node carries one more pointer field to reference the previous node.' },
      { question: 'If you already have a pointer to a node (not the head), what is the time complexity to delete it?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], correctIndex: 2, explanation: 'Because the node knows both its neighbors via next and prev, you can unlink it directly without searching.' },
      { question: 'What must be updated when inserting a node in the middle of a doubly linked list?', options: ['Only the new node\'s next pointer', 'Only the previous node\'s next pointer', 'Both neighboring nodes\' next and prev pointers', 'Nothing besides head'], correctIndex: 2, explanation: 'The new node links in on both sides, so the neighbor before and after both need pointer updates.' },
      { question: 'What is the time complexity of inserting at the beginning?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctIndex: 0, explanation: 'Just like a singly linked list, inserting at the front needs no traversal.' },
      { question: 'What is true about the head node\'s prev pointer?', options: ['It points to the tail', 'It is always NULL', 'It points to itself', 'It is undefined'], correctIndex: 1, explanation: 'Since there is nothing before the first node, its prev pointer is NULL.' },
      { question: 'What is true about the tail node\'s next pointer?', options: ['It points to head', 'It is always NULL', 'It points to itself', 'It is undefined'], correctIndex: 1, explanation: 'The last node has nothing after it, so its next pointer is NULL.' },
      { question: 'Why are doubly linked lists commonly used to implement an LRU cache?', options: ['They sort automatically', 'They allow O(1) removal of any node once located, combined with a hash map for lookup', 'They use less memory than arrays', 'They are always faster to search'], correctIndex: 1, explanation: 'Combining a hash map (for O(1) lookup) with a doubly linked list (for O(1) removal/reordering) is the classic LRU cache design.' },
      { question: 'Compared to a singly linked list with the same n nodes, how much extra space does a doubly linked list use?', options: ['None — same amount', 'O(n) extra, for the prev pointers', 'O(n²) extra', 'O(log n) extra'], correctIndex: 1, explanation: 'Each of the n nodes carries one additional pointer, so total extra space grows linearly with n.' },
    ],
    flashcards: [
      { front: 'Doubly Linked List — core idea', back: 'A chain of nodes where each node holds a value plus pointers to both the next AND previous node, enabling two-directional traversal.' },
      { front: 'Node structure', back: 'struct Node { int data; Node* next; Node* prev; };' },
      { front: 'Extra cost vs singly linked list', back: 'One more pointer per node (prev) — more memory, but enables backward traversal and O(1) deletion given a node pointer.' },
      { front: 'Insert at beginning — complexity', back: 'O(1): set newNode->next/prev, update old head->prev, then reassign head.' },
      { front: 'Deleting a known node — complexity', back: 'O(1), since the node already knows both neighbors via next and prev — no traversal needed to unlink it.' },
      { front: 'Classic use case', back: 'LRU cache: a doubly linked list (for O(1) reordering/removal) paired with a hash map (for O(1) lookup).' },
    ],
    leetLinks: [
      { title: 'Design Linked List', url: 'https://leetcode.com/problems/design-linked-list/', difficulty: 'Medium' },
      { title: 'LRU Cache', url: 'https://leetcode.com/problems/lru-cache/', difficulty: 'Medium' },
      { title: 'Flatten a Multilevel Doubly Linked List', url: 'https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/', difficulty: 'Medium' },
    ],
  },
];

export const getListTypeById = (id: string) => linkedListTypes.find((l) => l.id === id);