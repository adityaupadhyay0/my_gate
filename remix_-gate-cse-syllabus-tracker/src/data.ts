import { Subject } from './types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'algorithms',
    name: 'Algorithms',
    color: 'emerald',
    topics: [
      { id: 'algorithms-asymptotic-notation', name: 'Asymptotic Notation' },
      { id: 'algorithms-recurrence-relation', name: 'Recurrence Relation' },
      { id: 'algorithms-divide-and-conquer', name: 'Divide and Conquer' },
      { id: 'algorithms-sorting', name: 'Sorting' },
      { id: 'algorithms-greedy-technique', name: 'Greedy Technique' },
      { id: 'algorithms-minimum-spanning-tree', name: 'Minimum Spanning Tree' },
      { id: 'algorithms-shortest-path', name: 'Shortest Path' },
      { id: 'algorithms-graph-traversal', name: 'Graph Traversal' },
      { id: 'algorithms-dynamic-programming', name: 'Dynamic Programming' }
    ]
  },
  {
    id: 'data-structures',
    name: 'Data Structure',
    color: 'teal',
    topics: [
      { id: 'data-structures-array', name: 'Array' },
      { id: 'data-structures-link-list', name: 'Link List' },
      { id: 'data-structures-stack', name: 'Stack' },
      { id: 'data-structures-queue', name: 'Queue' },
      { id: 'data-structures-binary-tree', name: 'Binary Tree' },
      { id: 'data-structures-binary-search-tree', name: 'Binary Search Tree' },
      { id: 'data-structures-avl-tree', name: 'AVL Tree' },
      { id: 'data-structures-b-tree', name: 'B Tree' },
      { id: 'data-structures-b-plus-tree', name: 'B+ Tree' },
      { id: 'data-structures-heap-tree', name: 'Heap Tree' },
      { id: 'data-structures-n-ary-tree', name: 'n-ary Tree' },
      { id: 'data-structures-hashing', name: 'Hashing' }
    ]
  },
  {
    id: 'c-programming',
    name: 'C Programming',
    color: 'cyan',
    topics: [
      { id: 'c-programming-arithmetic-operation', name: 'Arithmetic Operation' },
      { id: 'c-programming-conditional-statement', name: 'Conditional Statement' },
      { id: 'c-programming-loops', name: 'Loops' },
      { id: 'c-programming-array-and-pointer', name: 'Array and Pointer' },
      { id: 'c-programming-function', name: 'Function' }
    ]
  },
  {
    id: 'compiler-design',
    name: 'Compiler Design',
    color: 'indigo',
    topics: [
      { id: 'compiler-design-lexical-analysis', name: 'Lexical Analysis' },
      { id: 'compiler-design-parsing', name: 'Parsing' },
      { id: 'compiler-design-syntax-directed-translation', name: 'Syntax-directed Translation' },
      { id: 'compiler-design-intermediate-code-generation', name: 'Intermediate Code Generation' },
      { id: 'compiler-design-runtime-environment', name: 'Runtime Environment' },
      { id: 'compiler-design-matching', name: 'Matching' }
    ]
  },
  {
    id: 'theory-of-computation',
    name: 'Theory of Computation',
    color: 'blue',
    topics: [
      { id: 'theory-of-computation-regular-expression', name: 'Regular Expression' },
      { id: 'theory-of-computation-regular-grammar', name: 'Regular Grammar' },
      { id: 'theory-of-computation-regular-language', name: 'Regular Language' },
      { id: 'theory-of-computation-finite-automata', name: 'Finite Automata' },
      { id: 'theory-of-computation-context-free-grammar', name: 'Context Free Grammar' },
      { id: 'theory-of-computation-context-free-language', name: 'Context Free Language' },
      { id: 'theory-of-computation-push-down-automata', name: 'Push-down Automata' },
      { id: 'theory-of-computation-recursive-language', name: 'Recursive Language' },
      { id: 'theory-of-computation-turing-machine', name: 'Turing Machine' },
      { id: 'theory-of-computation-undecidability', name: 'Undecidability' }
    ]
  },
  {
    id: 'operating-system',
    name: 'Operating System',
    color: 'violet',
    topics: [
      { id: 'operating-system-process', name: 'Process' },
      { id: 'operating-system-cpu-scheduling', name: 'CPU Scheduling' },
      { id: 'operating-system-process-synchronization', name: 'Process Synchronization' },
      { id: 'operating-system-deadlock', name: 'Deadlock' },
      { id: 'operating-system-memory-management', name: 'Memory Management' },
      { id: 'operating-system-file-systems', name: 'File Systems' },
      { id: 'operating-system-disk-scheduling', name: 'Disk Scheduling' },
      { id: 'operating-system-system-call', name: 'System Call' },
      { id: 'operating-system-thread', name: 'Thread' }
    ]
  },
  {
    id: 'computer-network',
    name: 'Computer Network',
    color: 'pink',
    topics: [
      { id: 'computer-network-osi-layer', name: 'OSI Layer' },
      { id: 'computer-network-physical-layer', name: 'Physical Layer' },
      { id: 'computer-network-data-link-layer', name: 'Data Link Layer' },
      { id: 'computer-network-network-layer-protocol', name: 'Network Layer Protocol' },
      { id: 'computer-network-transport-layer-protocol', name: 'Transport Layer Protocol' },
      { id: 'computer-network-application-layer-protocols', name: 'Application Layer Protocols' },
      { id: 'computer-network-network-security', name: 'Network Security' }
    ]
  },
  {
    id: 'computer-organization',
    name: 'Computer Organization',
    color: 'amber',
    topics: [
      { id: 'computer-organization-machine-instruction', name: 'Machine Instruction' },
      { id: 'computer-organization-addressing-modes', name: 'Addressing Modes' },
      { id: 'computer-organization-alu-data-path', name: 'ALU Data Path and Control Unit' },
      { id: 'computer-organization-io-interface', name: 'IO Interface' },
      { id: 'computer-organization-interrupt', name: 'Interrupt' },
      { id: 'computer-organization-pipeline-processor', name: 'Pipeline Processor' },
      { id: 'computer-organization-cache-memory', name: 'Cache Memory' },
      { id: 'computer-organization-secondary-storage', name: 'Secondary Storage' },
      { id: 'computer-organization-memory-chip-design', name: 'Memory Chip Design' }
    ]
  },
  {
    id: 'database-management-system',
    name: 'Database Management System',
    color: 'fuchsia',
    topics: [
      { id: 'database-management-system-er-model', name: 'ER Model' },
      { id: 'database-management-system-relational-schema', name: 'Relational Schema' },
      { id: 'database-management-system-relational-algebra', name: 'Relational Algebra' },
      { id: 'database-management-system-normal-form', name: 'Normal Form' },
      { id: 'database-management-system-transactions', name: 'Transactions' },
      { id: 'database-management-system-integrity-constraints', name: 'Integrity Constraints' },
      { id: 'database-management-system-sql', name: 'SQL' },
      { id: 'database-management-system-tuple-calculus', name: 'Tuple Calculus' },
      { id: 'database-management-system-file-system', name: 'File System' }
    ]
  },
  {
    id: 'discrete-mathematics',
    name: 'Discrete Mathematics',
    color: 'sky',
    topics: [
      { id: 'discrete-mathematics-propositional-logic', name: 'Propositional Logic' },
      { id: 'discrete-mathematics-set-theory', name: 'Set Theory' },
      { id: 'discrete-mathematics-relation', name: 'Relation' },
      { id: 'discrete-mathematics-functions', name: 'Functions' },
      { id: 'discrete-mathematics-lattice', name: 'Lattice' },
      { id: 'discrete-mathematics-group-theory', name: 'Group Theory' },
      { id: 'discrete-mathematics-graph-theory', name: 'Graph Theory' },
      { id: 'discrete-mathematics-planar-graph', name: 'Planar Graph' },
      { id: 'discrete-mathematics-combination', name: 'Combination' },
      { id: 'discrete-mathematics-probability-theory', name: 'Probability Theory' },
      { id: 'discrete-mathematics-recurrence', name: 'Recurrence' }
    ]
  },
  {
    id: 'digital-logic',
    name: 'Digital Logic',
    color: 'rose',
    topics: [
      { id: 'digital-logic-number-system', name: 'Number System' },
      { id: 'digital-logic-boolean-algebra', name: 'Boolean Algebra' },
      { id: 'digital-logic-combinational-circuit', name: 'Combinational Circuit' },
      { id: 'digital-logic-sequential-circuit', name: 'Sequential Circuit' }
    ]
  },
  {
    id: 'engineering-mathematics',
    name: 'Engineering Mathematics',
    color: 'purple',
    topics: [
      { id: 'engineering-mathematics-linear-algebra', name: 'Linear Algebra' },
      { id: 'engineering-mathematics-calculus', name: 'Calculus' },
      { id: 'engineering-mathematics-numerical-method', name: 'Numerical Method' }
    ]
  }
];
