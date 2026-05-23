import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Search, 
  RefreshCw, 
  Star, 
  Info, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  BookOpen
} from 'lucide-react';
import { Subject, Topic, TrackerState, TopicStatus, TopicState, CustomTodo } from '../types';

// Returns beautiful relevant math formulation/notes for common gate topics
const getFormulaSampleForTopic = (name: string): string => {
  const base = `## 📖 ${name} - GATE Prep Guide\n\n### ⚡ Core Concepts & Formulas\n`;
  
  if (name.includes('Notation')) {
    return base + `- **O(g(n))**: {f(n) | ∃ c, n0 > 0 s.t. 0 <= f(n) <= c*g(n) ∀ n >= n0} (Asymptotic Upper Bound)\n- **Ω(g(n))**: {f(n) | ∃ c, n0 > 0 s.t. 0 <= c*g(n) <= f(n) ∀ n >= n0} (Asymptotic Lower Bound)\n- **Θ(g(n))**: {f(n) | ∃ c1, c2, n0 s.t. c1*g(n) <= f(n) <= c2*g(n) ∀ n >= n0} (Tight Bound)\n- Order of growth: O(1) < O(log log n) < O(log n) < O(n^1/2) < O(n) < O(n log n) < O(n^2) < O(2^n) < O(n!)\n\n### 📝 Pro PYQ Tips:\n- Ignore low-order terms and constant coefficients.\n- Take log on both sides to compare very large complex towers e.g. n^1/3 vs (log n)^2000.`;
  }
  if (name.includes('Recurrence') || name.includes('Recurrence Relation')) {
    return base + `- **Master Theorem** for T(n) = a*T(n/b) + f(n), where a >= 1, b > 1:\n  Compare f(n) with n^(log_b a):\n  - **Case 1**: If f(n) = O(n^(log_b a - ε)) => T(n) = Θ(n^(log_b a))\n  - **Case 2**: If f(n) = Θ(n^(log_b a)) => T(n) = Θ(n^(log_b a) * log n)\n  - **Case 3**: If f(n) = Ω(n^(log_b a + ε)) and regular checking => T(n) = Θ(f(n))\n- **Linear Recurrences**: Solve using Characteristic Roots Method (r^2 - ar - b = 0).\n\n### ⚡ Quick Notes:\n- Look out for division by subtraction: T(n) = T(n-1) + O(1) => O(n), T(n) = T(n-1) + n => O(n^2).`;
  }
  if (name.includes('Parsing') || name.includes('Parser')) {
    return base + `- **Parsing Power**: LR(1) > LALR(1) > SLR(1) > LL(1)\n- **Conflicts**:\n  - LL(1) Parsing Table: Multiple entries in cell (unambiguous, no left recursion, no left factoring).\n  - LR Conflicts: Shift-Reduce (S-R) or Reduce-Reduce (R-R) conflicts in states.\n  - LALR(1) can introduce Reduce-Reduce conflicts when merging identical core LR(1) states, but NOT Shift-Reduce conflicts.\n\n### ⚡ Compiler Fact:\n- Number of states: LR(0) = SLR(1) <= LALR(1) <= LR(1).`;
  }
  if (name.includes('Process') || name.includes('CPU') || name.includes('Synchronization')) {
    return base + `- **Semaphore basics**:\n  - Mutual Exclusion condition: s.value initialized to 1.\n  - P(s) or Wait(s): while s <= 0 do skip; s = s - 1;\n  - V(s) or Signal(s): s = s + 1;\n- **Critical Section Requirements**:\n  1. Mutual Exclusion (Strictly mandatory)\n  2. Progress (Mandatory, no deadlocks)\n  3. Bounded Waiting (Optional, prevents starvation)`;
  }
  if (name.includes('SQL') || name.includes('Database') || name.includes('Relational')) {
    return base + `- **SQL Join Properties**: Inner Join, Left Outer, Right Outer, Full Outer Join.\n- **Tuple Relational Calculus (TRC)**: Non-procedural query language. {t | P(t)}\n- **Relational Algebra operators**: Selection (σ), Projection (π), Cartesian Product (×), Join (⨝), Division (÷).\n- Division operator (R ÷ S): Finds attributes in R that are associated with ALL elements in S (essential for "all" type questions).`;
  }
  if (name.includes('Graph') || name.includes('Trees') || name.includes('Tree') || name.includes('AVL')) {
    return base + `- **AVL Trees**: Strictly height-balanced BST. Balance Factor = |Height(Left) - Height(Right)| <= 1.\n- Rebalancing actions: LL, RR (single rotations); LR, RL (double rotations).\n- Height range for N nodes: O(log N). Maximum height ~ 1.44 log_2 N.\n- Minimum nodes in AVL tree of height h: N(h) = N(h-1) + N(h-2) + 1. (N(0)=1, N(1)=2).`;
  }
  
  return base + `- **Key definition**: Explain core terms for studies.\n- **Vital Properties**: Write theorems, memory bounds, or worst-case complexity here.\n- **Previous Papers PYQ Reference**: List years where this topic recurred (e.g., GATE 2018, 2022).\n\n### 🔍 Quick Revision Checklist\n1. Read online theory lectures/standard book definitions.\n2. Note standard formulas and edge-case exceptions.\n3. Solve at least 15 topic practice previous year questions.`;
};

interface GatePattern {
  type: 'MCQ' | 'MSQ' | 'NAT';
  title: string;
  concept: string;
  tip: string;
}

const getGatePatternsForTopic = (subjectId: string, topicName: string): GatePattern[] => {
  const normSubject = subjectId.toLowerCase();
  const normTopic = topicName.toLowerCase();

  // 1. Algorithms
  if (normSubject.includes('algorithm')) {
    return [
      {
        type: 'MCQ',
        title: 'Asymptotic Ordering Bounds',
        concept: 'Comparing growth sequences of algebraic, logarithmic and exponential expressions (e.g. n^1.5 vs n log n, or n! vs 2^n towers).',
        tip: 'Apply log transitions onto compares. For recurrence analysis, remember order of limits.'
      },
      {
        type: 'MSQ',
        title: 'Graph Traversal Traps (DFS/BFS)',
        concept: 'Evaluating conditions of graph structure, topological sequencing, and tree-edge categorization (forward, backward, cross, tree edge properties).',
        tip: 'Active back-edges in directed graph traversal strictly state cycle presence. DFS properties differ by directed/undirected bounds.'
      },
      {
        type: 'NAT',
        title: 'Master Recurrence Exp Solving',
        concept: 'Determine numerical values or complexity orders using standard Master Theorem bounds on T(n) = a*T(n/b) + f(n).',
        tip: 'Carefully compute case parameters log_b(a). Watch for edge cases of Case 2 where extra log factor is introduced.'
      }
    ];
  }

  // 2. Data Structures
  if (normSubject.includes('structure')) {
    return [
      {
        type: 'MCQ',
        title: 'Traversals after Binary Node Deletions',
        concept: 'Locating trees state after inserting elements or running node deletions (by replacing with in-order predecessor or successor).',
        tip: 'Predecessor replacement differs from successor replacement. Verify other node paths to maintain BST constraints.'
      },
      {
        type: 'MSQ',
        title: 'Hash Collisions & Probing Bounds',
        concept: 'Evaluating exact properties of linear vs quadratic probing, double hashing, or chaining collision resolution schemes.',
        tip: 'Chaining is open hashing. MSQs often quiz the bounds of worst-case search lookup depths under uniform hashing.'
      },
      {
        type: 'NAT',
        title: 'Height Constraints & Node Counting',
        concept: 'Calculating maximum height or minimum valid nodes in self-balancing systems like AVL trees or B/B+ trees.',
        tip: 'Min nodes in AVL of height h is given by N(h) = N(h-1) + N(h-2) + 1. For B-trees, use ceil(m/2) limit on node occupancy.'
      }
    ];
  }

  // 3. C Programming
  if (normSubject.includes('c-programming') || normSubject.includes('c programming')) {
    return [
      {
        type: 'MCQ',
        title: 'Convoluted Pointer & Multidimensional Array Arithmetic',
        concept: 'Finding physical values or references written as complex pointer lookups, address mutations, or array offsets.',
        tip: 'Deconstruct postfix increments first. Observe that *(p++) is different from ++(*p).'
      },
      {
        type: 'MSQ',
        title: 'Lifetime Scope and Storage Modifiers',
        concept: 'Assessing scope properties, register allocation bounds, and lifetime behaviors of static, auto, register, register variables.',
        tip: 'Static variables survive context exits. Do not re-initialize on secondary run-throughs.'
      },
      {
        type: 'NAT',
        title: 'Deep Nested Recursion Tracing',
        concept: 'Computing final integer returns of complex recursive calls with integrated static counters or parameter mutations.',
        tip: 'Systematically draw execution frames on scrap space. Solve bottom-up from leaf sub-calls; do not count mentally.'
      }
    ];
  }

  // 4. Compiler Design
  if (normSubject.includes('compiler')) {
    return [
      {
        type: 'MCQ',
        title: 'LR Parsing Tables S-R & R-R Conflicts',
        concept: 'Tracing Shift-Reduce or Reduce-Reduce conflicts inside parsing tables for LR(0), SLR(1), LR(1), and LALR(1) states.',
        tip: 'Collapsing LR(1) lookaheads into LALR(1) may introduce Reduce-Reduce conflicts but never Shift-Reduce conflicts.'
      },
      {
        type: 'MSQ',
        title: 'S-Attributed and L-Attributed SDT',
        concept: 'Differentiating synthesize-only (S-attributed) semantic actions from left-to-right inherited actions (L-attributed schemes).',
        tip: 'S-Attributions complete at root synthesis. L-Attributed SDD allows inheriting only from parental or left fraternal siblings.'
      },
      {
        type: 'NAT',
        title: 'DFA State Counts in Parser Automata',
        concept: 'Deriving the precise state count in SLR(1) or Canonical LR(1) collections for a set of target grammar items.',
        tip: 'Augment the starter rule S\' -> S first. Standard LR(0) closure groups represent equivalent parsing conditions.'
      }
    ];
  }

  // 5. Theory of Computation
  if (normSubject.includes('theory') || normSubject.includes('computation')) {
    return [
      {
        type: 'MCQ',
        title: 'Chomsky Language Classification Bounds',
        concept: 'Evaluating if a custom set represents Regular, Context-Free, Context-Sensitive, or Recursively Enumerable systems.',
        tip: 'Regular languages have no stack memory. CFL allows single-variable matching. Multi-variable indexing matches Context-Sensitive.'
      },
      {
        type: 'MSQ',
        title: 'Closure Under Language Complements',
        concept: 'Proving or disproving operational closure sets (complements, intersections, reversions) of different grammar configurations.',
        tip: 'CFLs are closed under union and star, but NOT closed under intersection or complementation.'
      },
      {
        type: 'NAT',
        title: 'Minimal State DFA Construction',
        concept: 'Deriving the exact number of nodes required to construct the smallest possible state DFA accepting custom substring modulo checks.',
        tip: 'Identify and count dead-end trap states if undefined inputs violate regular rules. Do not omit the error state.'
      }
    ];
  }

  // 6. Operating System
  if (normSubject.includes('operating') || normSubject.includes('system')) {
    return [
      {
        type: 'MCQ',
        title: 'CS Synchronization & Peterson\'s Proving',
        concept: 'Analyzing variable constraints to verify critical section rules: Mutual Exclusion, Progress, and Bounded Waiting.',
        tip: 'Inspect step interleaving. Test if you can force progress loops to lock up or block secondary calls.'
      },
      {
        type: 'MSQ',
        title: 'Thread scheduling and Unix system calls',
        concept: 'Detecting process fork clones, signal interrupts, thread memory boundary sharing, or wait states.',
        tip: 'Fork execution generates 2^n leaf processes inside standard loops. Carefully check local index counters.'
      },
      {
        type: 'NAT',
        title: 'CPU Scheduling Waiting Index Calculations',
        concept: 'Determining total queue delays, response ratios, average waiting times, or turnaround scores under preemptive Gantt charts.',
        tip: 'Build absolute Gantt bars from starting time 0. Respect arrival delays and preemption intervals.'
      }
    ];
  }

  // 7. Computer Network
  if (normSubject.includes('network')) {
    return [
      {
        type: 'MCQ',
        title: 'IP CIDR Subnet Broadcast Masking',
        concept: 'Identifying network addresses, maximum valid hosts, or supernet groupings under specific prefix annotations.',
        tip: 'Always subtract 2 from host counts (first for Network ID and last to preserve Directed Broadcast).'
      },
      {
        type: 'MSQ',
        title: 'Layer Protocols State and Standard Mappings',
        concept: 'Comparing DNS, DNS query styles, DHCP, SMTP, or TCP 3-way handshakes to transport port limits.',
        tip: 'DNS handles UDP for speed but relies on TCP during larger zone exchanges. HTTP is stateless but rests on stateful TCP.'
      },
      {
        type: 'NAT',
        title: 'GBN/Selective sliding window efficiency',
        concept: 'Calculating line-rate utilization rates, perfect packet sequence ranges, or delay rates given physical transmission speed.',
        tip: 'Utilization = N / (1 + 2a), where a reflects prop-delay divided by transmission-delay. Unify all unit scales.'
      }
    ];
  }

  // 8. Computer Organization / Coa
  if (normSubject.includes('organization') || normSubject.includes('structure') || normSubject.includes('coa')) {
    return [
      {
        type: 'MCQ',
        title: 'Associative Cache Field Bit Sizing',
        concept: 'Decomposing CPU physical memory address paths into Cache fields: Tag, Set Index, and Word Line offsets.',
        tip: 'Set counts correspond to cache sets limit. Tag bits represent remaining slots of overall addresses.'
      },
      {
        type: 'MSQ',
        title: 'CPU Addressing Modes comparison',
        concept: 'Differentiating register-indirect, immediate, offset base, or program counter-relative execution boundaries.',
        tip: 'Relative addressing provides position-independence. Indirect mode accesses the pointer memory first.'
      },
      {
        type: 'NAT',
        title: 'Pipeline stalls and CPI Throughput',
        concept: 'Calculating clock cycles, delay hazard bubbles, pipeline speed-ups, or actual cycles per instruction (CPI).',
        tip: 'Ideal scalar pipelines assume CPI = 1. CPI_real is evaluated as 1 + (stall fraction * bubble length).'
      }
    ];
  }

  // 9. Database Management System
  if (normSubject.includes('database') || normSubject.includes('dbms')) {
    return [
      {
        type: 'MCQ',
        title: 'Highest Canonical Normal Form',
        concept: 'Deriving candidate keys from F-closure set and testing relation normalization rules (1NF, 2NF, 3NF, BCNF).',
        tip: 'Under BCNF, all dependency left-hand determinants must match superkeys. 3NF relaxes this to protect primeness on rights.'
      },
      {
        type: 'MSQ',
        title: 'Relational Calculus and Joins',
        concept: 'Verifying equivalence behaviors between relational projection queries or TRC predicate assertions.',
        tip: 'Review scope declarations of quantifiers. Relational division is equivalent to nested universal operators.'
      },
      {
        type: 'NAT',
        title: 'B/B+ Tree Fanout Block Size Bounds',
        concept: 'Solving disk physical limits to evaluate order or maximum elements inside leaf/non-leaf indexes.',
        tip: 'Non-leaf constraints: p * (child_ptr_size) + (p - 1) * (key_size) <= physical_block_bytes. Compute floor integers.'
      }
    ];
  }

  // 10. Discrete Mathematics
  if (normSubject.includes('discrete') || normSubject.includes('math')) {
    return [
      {
        type: 'MCQ',
        title: 'Lattice and Relation Properties',
        concept: 'Inspecting partial orders (Posets) to verify lattice definitions (least upper bound meets and greatest lower bound joins).',
        tip: 'Lattices require every item pair to hold discrete Meets and Joins. Complements match to boolean values.'
      },
      {
        type: 'MSQ',
        title: 'Graph Theory Planar Regions & Coloring',
        concept: 'Applying Euler region limits (vertices, regions, edges: E <= 3V - 6) or vertex/edge chromatic numbers.',
        tip: 'Planar systems avoid K_5 or K_3,3 sub-cliques. Non-planar bounds shift Euler equation indices.'
      },
      {
        type: 'NAT',
        title: 'Permutations & Inclusion-Exclusion Enumeration',
        concept: 'Evaluating discrete count assignments, binary combinations, or matching assignments bounded by filters.',
        tip: 'Apply standard division partitions for duplicating elements: n! / (p! * q!). Eliminate overlap configurations.'
      }
    ];
  }

  // Fallback defaults
  return [
    {
      type: 'MCQ',
      title: 'Conceptual Multiple Choice',
      concept: `Validating theoretical statements and logical boundaries of ${topicName} under test specifications.`,
      tip: 'Typically rewards process of elimination. Check corner values and infinite bounds.'
    },
    {
      type: 'MSQ',
      title: 'Multivariable Multiple Selection',
      concept: `Evaluating combinations of facts or equations about ${topicName} where one or multiple answers are correct.`,
      tip: 'No partial scores are given in GATE. Ensure each selected checkbox is fully backed by mathematical proof.'
    },
    {
      type: 'NAT',
      title: 'Numerical Answer Fill-Ins',
      concept: `Calculating exact integer values or precise float limits using formulas of ${topicName}.`,
      tip: 'Verify decimal rounding bounds (usually up to two digits). Check units conversion to avoid typos.'
    }
  ];
};

interface InlineTopicEditorProps {
  topic: Topic;
  subject: Subject;
  topicState: TopicState;
  onUpdateState: (topicId: string, updates: Partial<TopicState>) => void;
  onAddSubTodo: (topicId: string, text: string) => void;
  onToggleSubTodo: (topicId: string, todoId: string) => void;
  onDeleteSubTodo: (topicId: string, todoId: string) => void;
}

const InlineTopicEditor: React.FC<InlineTopicEditorProps> = ({
  topic,
  subject,
  topicState,
  onUpdateState,
  onAddSubTodo,
  onToggleSubTodo,
  onDeleteSubTodo,
}) => {
  const [noteText, setNoteText] = useState(topicState.notes || '');
  const [todoInput, setTodoInput] = useState('');
  const [isSaved, setIsSaved] = useState(true);

  // Synchronize with parent state when selected topic changes
  useEffect(() => {
    setNoteText(topicState.notes || '');
    setIsSaved(true);
  }, [topic.id, topicState.notes]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNoteText(val);
    setIsSaved(false);
  };

  const handleSaveNotes = () => {
    onUpdateState(topic.id, { notes: noteText });
    setIsSaved(true);
  };

  const handleAddTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoInput.trim()) return;
    onAddSubTodo(topic.id, todoInput.trim());
    setTodoInput('');
  };

  const injectStudyTemplate = () => {
    const formulasSample = getFormulaSampleForTopic(topic.name);
    setNoteText(formulasSample);
    onUpdateState(topic.id, { notes: formulasSample });
    setIsSaved(true);
  };

  return (
    <div className="p-4 border-t border-[#141414] bg-neutral-100 text-[#141414] space-y-4">
      {/* Status Selection Buttons */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono font-bold uppercase tracking-wider block">
          Target Study Status
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'NOT_STARTED', label: 'Pending', active: 'bg-transparent text-[#141414] border-dashed font-bold border', inactive: 'opacity-50 bg-transparent border-dotted border-[#141414]/30' },
            { id: 'IN_PROGRESS', label: 'Studying', active: 'bg-[#141414] text-[#E4E3E0] font-bold', inactive: 'bg-white border-[#141414]/30 text-[#141414]/80' },
            { id: 'REVISION_NEEDED', label: 'Revision', active: 'bg-transparent border-[#141414] underline font-bold border', inactive: 'bg-white border-[#141414]/30 text-[#141414]/80' },
            { id: 'COMPLETED', label: 'Mastered', active: 'bg-transparent text-[#2A5A2A] border-[#2A5A2A] font-bold border-2', inactive: 'bg-white border-[#141414]/30 text-[#141414]/80' }
          ].map((st) => {
            const isActive = topicState.status === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onUpdateState(topic.id, { status: st.id as TopicStatus })}
                className={`px-2 py-1 text-[11px] rounded-none border text-center uppercase tracking-tight transition-all cursor-pointer font-mono font-bold outline-hidden ${
                  isActive ? st.active : `${st.inactive} border`
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Side: Confidence & Specific Checklist */}
        <div className="space-y-4">
          {/* Confidence Widget */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider block">
                Confidence / PYQ Mastery
              </label>
              <span className="text-[10px] font-mono font-bold text-[#141414]/70">
                {topicState.confidence ? `${topicState.confidence}/5 Stars` : 'Unrated'}
              </span>
            </div>
            <div className="flex items-center space-x-1 p-1 bg-white border border-[#141414] w-fit">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= topicState.confidence;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => onUpdateState(topic.id, { confidence: star })}
                    className="p-1 cursor-pointer outline-hidden hover:scale-110 transition-transform"
                  >
                    <span className={`text-lg font-mono leading-none ${isFilled ? 'text-amber-500 font-bold' : 'text-[#141414]/20'}`}>
                      ★
                    </span>
                  </button>
                );
              })}
              {topicState.confidence > 0 && (
                <button
                  type="button"
                  onClick={() => onUpdateState(topic.id, { confidence: 0 })}
                  className="text-[9px] font-mono text-[#141414] px-1.5 uppercase font-bold hover:underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Sub tasks list */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider block">
              Fine-grained Study Checklist
            </label>

            {/* Quick Add Form */}
            <form onSubmit={handleAddTodoSubmit} className="flex gap-1">
              <input
                type="text"
                placeholder="e.g. Solve 2022 PYQ, re-read slides..."
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                className="flex-1 px-2.5 py-1 text-xs border border-[#141414] rounded-none bg-white font-mono focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-3 py-1 text-xs border border-[#141414] bg-[#141414] text-[#E4E3E0] rounded-none font-mono font-bold uppercase hover:bg-transparent hover:text-[#141414] flex items-center space-x-0.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </form>

            {/* Task list list */}
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {topicState.customTodos.length === 0 ? (
                <p className="text-[11px] text-[#141414]/50 font-mono italic">No custom tasks added for this topic yet</p>
              ) : (
                topicState.customTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between p-1.5 rounded-none border border-[#141414]/30 bg-white hover:border-[#141414] transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => onToggleSubTodo(topic.id, todo.id)}
                      className="flex items-center space-x-2 flex-grow text-left cursor-pointer outline-hidden"
                    >
                      {todo.completed ? (
                        <div className="w-3 h-3 border border-[#141414] flex items-center justify-center font-mono font-bold text-[8px] text-[#141414]">✕</div>
                      ) : (
                        <div className="w-3 h-3 border border-[#141414]/40" />
                      )}
                      <span className={`text-xs font-mono text-[#141414] truncate max-w-[180px] sm:max-w-xs ${todo.completed ? 'line-through opacity-50 italic' : 'font-medium'}`}>
                        {todo.text}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteSubTodo(topic.id, todo.id)}
                      className="text-[#141414]/40 hover:text-red-600 p-0.5 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Study Notes */}
        <div className="space-y-1.5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider block">
                Study Notes & Key Formulas
              </label>
              
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={injectStudyTemplate}
                  className="text-[9px] font-mono font-bold border border-[#141414] bg-white text-[#141414] px-1.5 py-0.5 rounded-none flex items-center space-x-0.5 hover:bg-[#141414] hover:text-[#E4E3E0] cursor-pointer transition-colors"
                  title="Fill in standard equations and formula guides for this topic"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  <span>Auto formulas</span>
                </button>
                
                {!isSaved && (
                  <span className="text-[9px] font-mono text-amber-600 font-bold uppercase">
                    * unsaved
                  </span>
                )}
              </div>
            </div>

            <textarea
              rows={5}
              placeholder="Record complex constraints, PYQ insights, standard notes here..."
              value={noteText}
              onChange={handleNotesChange}
              className="w-full p-2 border border-[#141414] rounded-none text-xs font-mono bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleSaveNotes}
              className={`px-3 py-1 text-xs border border-[#141414] font-mono font-bold uppercase cursor-pointer transition-all ${
                isSaved 
                  ? 'bg-transparent text-[#141414]/50 border-[#141414]/20 cursor-not-allowed'
                  : 'bg-[#141414] text-[#E4E3E0] hover:bg-neutral-800'
              }`}
              disabled={isSaved}
            >
              <span>{isSaved ? 'Notes Saved' : 'Save Notes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Target GATE Question Styles Board */}
      <div className="border border-[#141414] bg-white p-4 space-y-3.5 rounded-none mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-[#141414]/35 pb-2">
          <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#141414] flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#141414]/70" />
            <span>EXAM_PATTERN: Target Question Types & Syllabus Blueprints</span>
          </h4>
          <span className="text-[9px] font-mono text-[#2A5A2A] uppercase bg-[#2A5A2A]/5 px-2 py-0.5 border border-[#2A5A2A]/30 font-bold max-w-fit">
            Standard 65-Question Format Matrix
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getGatePatternsForTopic(subject.id, topic.name).map((pt, idx) => {
            const formatStyles = {
              MCQ: 'border-blue-600 text-blue-700 bg-blue-50/5',
              MSQ: 'border-purple-600 text-purple-700 bg-purple-50/5',
              NAT: 'border-amber-700 text-amber-800 bg-amber-50/5'
            };

            return (
              <div 
                key={idx} 
                className="border border-[#141414]/20 bg-neutral-50 p-3.5 flex flex-col justify-between space-y-3 hover:border-[#141414] transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-none text-[9px] font-mono font-bold border uppercase tracking-wider ${formatStyles[pt.type]}`}>
                      {pt.type} Question
                    </span>
                    <span className="text-[9px] font-mono opacity-60">1-2 Marks</span>
                  </div>
                  
                  <h5 className="font-mono font-bold text-xs uppercase tracking-tight text-[#141414] border-b border-[#141414]/10 pb-1">
                    {pt.title}
                  </h5>
                  
                  <p className="text-[11px] font-sans text-[#141414]/85 leading-relaxed">
                    {pt.concept}
                  </p>
                </div>

                <div className="border-t border-[#141414]/10 pt-2.5 space-y-1.5 bg-[#141414]/[0.01]">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#141414] block">
                    ⚡ Topic Pro-Tip:
                  </span>
                  <p className="text-[10px] font-mono italic text-[#141414]/80 leading-normal">
                    {pt.tip}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface SubjectAccordionProps {
  subjects: Subject[];
  state: TrackerState;
  onSelectTopic: (topicId: string | null) => void;
  selectedTopicId: string | null;
  onToggleTopicStatus: (topicId: string) => void;
  onQuickStatusChange: (topicId: string, status: TopicStatus) => void;
  onUpdateState: (topicId: string, updates: Partial<TopicState>) => void;
  onAddSubTodo: (topicId: string, text: string) => void;
  onToggleSubTodo: (topicId: string, todoId: string) => void;
  onDeleteSubTodo: (topicId: string, todoId: string) => void;
}

export const SubjectAccordion: React.FC<SubjectAccordionProps> = ({
  subjects,
  state,
  onSelectTopic,
  selectedTopicId,
  onToggleTopicStatus,
  onQuickStatusChange,
  onUpdateState,
  onAddSubTodo,
  onToggleSubTodo,
  onDeleteSubTodo,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>(() => {
    // Keep first subject expanded by default to show clean layout
    if (subjects.length > 0) {
      return {
        [subjects[0].id]: true,
      };
    }
    return {};
  });
  
  const [statusFilter, setStatusFilter] = useState<'all' | 'COMPLETED' | 'IN_PROGRESS' | 'REVISION_NEEDED' | 'NOT_STARTED'>('all');
  const [confidenceFilter, setConfidenceFilter] = useState<number | 'all'>('all');

  const toggleSubject = (subjectId: string) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  const getStatusBadge = (status: TopicStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="inline-flex items-center px-1.5 py-0.5 rounded-none text-[10px] font-mono font-bold uppercase bg-transparent text-[#2A5A2A] border border-[#2A5A2A]">Mastered</span>;
      case 'IN_PROGRESS':
        return <span className="inline-flex items-center px-1.5 py-0.5 rounded-none text-[10px] font-mono font-medium uppercase bg-[#141414] text-[#E4E3E0] border border-[#141414]">Studying</span>;
      case 'REVISION_NEEDED':
        return <span className="inline-flex items-center px-1.5 py-0.5 rounded-none text-[10px] font-mono font-medium uppercase bg-transparent text-[#141414] border border-[#141414] border-dashed">Revision</span>;
      default:
        return <span className="inline-flex items-center px-1.5 py-0.5 rounded-none text-[10px] font-mono opacity-60 uppercase bg-transparent text-[#141414] border border-dashed border-[#141414]/40">Pending</span>;
    }
  };

  // Filter & Search Syllabus data
  const filteredSubjects = useMemo(() => {
    return subjects
      .map((subj) => {
        const matchingTopics = subj.topics.filter((topic) => {
          const topicState = state.topicStates[topic.id] || { status: 'NOT_STARTED', confidence: 0, notes: '', customTodos: [] };
          
          // Match search text
          const textMatch =
            topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            topicState.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
            topicState.customTodos.some(t => t.text.toLowerCase().includes(searchTerm.toLowerCase()));

          // Match status filter
          const statusMatch = statusFilter === 'all' || topicState.status === statusFilter;

          // Match confidence filter
          const confidenceMatch =
            confidenceFilter === 'all' ||
            (confidenceFilter === 0 && topicState.confidence === 0) ||
            (confidenceFilter === 1 && topicState.confidence >= 1 && topicState.confidence <= 2) ||
            (confidenceFilter === 3 && topicState.confidence >= 3 && topicState.confidence <= 4) ||
            (confidenceFilter === 5 && topicState.confidence === 5);

          return textMatch && statusMatch && confidenceMatch;
        });

        return {
          ...subj,
          topics: matchingTopics,
        };
      })
      .filter((subj) => subj.topics.length > 0);
  }, [subjects, state, searchTerm, statusFilter, confidenceFilter]);

  // Compute metrics for progress bars
  const subjectProgressMap = useMemo(() => {
    const map: Record<string, { completed: number; total: number; percent: number }> = {};
    subjects.forEach((subj) => {
      const total = subj.topics.length;
      const completed = subj.topics.filter(
        (t) => state.topicStates[t.id]?.status === 'COMPLETED'
      ).length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      map[subj.id] = { completed, total, percent };
    });
    return map;
  }, [subjects, state]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setConfidenceFilter('all');
  };

  return (
    <div id="subject-syllabus-pane" className="space-y-4">
      {/* Header toolbar */}
      <div id="syllabus-toolbar" className="p-4 border border-[#141414] bg-white/30 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#141414]" />
          <input
            type="text"
            placeholder="Search topics, subjects, formulas, or checkmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#141414] rounded-none text-xs font-mono bg-white focus:outline-hidden"
          />
        </div>

        {/* Filter Selection Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-mono font-bold text-[#141414] uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2 py-0.5 border border-[#141414] rounded-none bg-white text-xs font-mono text-[#141414] outline-hidden"
            >
              <option value="all">ALL STATUSES</option>
              <option value="NOT_STARTED">PENDING (NOT STARTED)</option>
              <option value="IN_PROGRESS">STUDYING (IN PROGRESS)</option>
              <option value="REVISION_NEEDED">NEEDS REVISION</option>
              <option value="COMPLETED">MASTERED (COMPLETED)</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-mono font-bold text-[#141414] uppercase">Confidence:</span>
            <select
              value={confidenceFilter}
              onChange={(e) => {
                const val = e.target.value;
                setConfidenceFilter(val === 'all' ? 'all' : parseInt(val));
              }}
              className="px-2 py-0.5 border border-[#141414] rounded-none bg-white text-xs font-mono text-[#141414] outline-hidden"
            >
              <option value="all">ALL LEVELS</option>
              <option value="0">UNRATED (0★)</option>
              <option value="1">LOW CONFIDENCE (1-2★)</option>
              <option value="3">DECENT MATCH (3-4★)</option>
              <option value="5">MASTERED (5★)</option>
            </select>
          </div>

          {(searchTerm !== '' || statusFilter !== 'all' || confidenceFilter !== 'all') && (
            <button
              onClick={clearFilters}
              className="text-xs text-[#141414] font-mono font-bold underline hover:no-underline flex items-center space-x-1 ml-auto cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>RESET FILTER</span>
            </button>
          )}
        </div>
      </div>

      {/* Topics & Subjects Lists */}
      <div id="accordion-container" className="space-y-3">
        {filteredSubjects.length === 0 ? (
          <div className="text-center py-10 bg-white/10 border border-[#141414] border-dashed">
            <Info className="w-8 h-8 text-[#141414] mx-auto mb-2" />
            <p className="text-sm font-serif-header text-[#141414]">No matching subjects or topics found</p>
            <p className="text-xs font-mono text-[#141414]/70 mt-1">Try resetting the filter criteria above.</p>
          </div>
        ) : (
          filteredSubjects.map((subj) => {
            const isExpanded = !!expandedSubjects[subj.id];
            const stats = subjectProgressMap[subj.id] || { completed: 0, total: 0, percent: 0 };

            return (
              <div
                key={subj.id}
                id={`subject-card-${subj.id}`}
                className="bg-white/30 rounded-none border border-[#141414] overflow-hidden"
              >
                {/* Subject Header */}
                <button
                  type="button"
                  onClick={() => toggleSubject(subj.id)}
                  className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-white/60 text-left transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-none bg-[#141414]" />
                      <h3 className="font-serif-header text-lg text-[#141414]">{subj.name}</h3>
                    </div>
                    {/* Subject Mini Progress bar row */}
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="w-24 bg-[#141414]/10 rounded-none h-1.5 overflow-hidden border border-[#141414]/30">
                        <div
                          className="h-full bg-[#141414] transition-all duration-300"
                          style={{ width: `${stats.percent}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-[#141414]/80 font-bold uppercase">
                        {stats.completed}/{stats.total} mastered ({stats.percent}%)
                      </span>
                    </div>
                  </div>

                  <div className="text-[#141414]">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </button>

                {/* Topics List drawer */}
                {isExpanded && (
                  <div className="border-t border-[#141414] bg-white/10 divide-y divide-[#141414]">
                    {subj.topics.map((topic) => {
                      const topicState = state.topicStates[topic.id] || {
                        status: 'NOT_STARTED',
                        confidence: 0,
                        notes: '',
                        customTodos: [],
                      };
                      const isSelected = selectedTopicId === topic.id;
                      const hasNotes = topicState.notes.trim().length > 0;
                      const todoLength = topicState.customTodos.length;
                      const completedTodoLength = topicState.customTodos.filter(t => t.completed).length;

                      return (
                        <div key={topic.id} className="flex flex-col">
                          {/* Inner Topic Header row */}
                          <div
                            id={`topic-row-${topic.id}`}
                            className={`flex items-center justify-between p-3 transition-colors text-left outline-hidden ${
                              isSelected
                                ? 'bg-[#141414] text-[#E4E3E0] font-bold border-l-4 border-[#2A5A2A]'
                                : 'hover:bg-white/40'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 flex-1 min-w-0 mr-3">
                              {/* Direct Checklist Toggle */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleTopicStatus(topic.id);
                                }}
                                className={`flex-shrink-0 cursor-pointer transition-colors p-0.5 rounded-none outline-hidden ${
                                  topicState.status === 'COMPLETED'
                                    ? 'text-[#2A5A2A]'
                                    : (isSelected ? 'text-[#E4E3E0]/40' : 'text-[#141414]/30')
                                }`}
                              >
                                {topicState.status === 'COMPLETED' ? (
                                  <div className="w-4 h-4 border border-current flex items-center justify-center font-bold font-mono text-[10px]">✕</div>
                                ) : (
                                  <div className="w-4 h-4 border border-current" />
                                )}
                              </button>

                              {/* Topic Name triggers select/toggle workspace */}
                              <button
                                type="button"
                                onClick={() => onSelectTopic(isSelected ? null : topic.id)}
                                className="w-full text-left flex-1 min-w-0 font-sans text-xs tracking-tight outline-hidden cursor-pointer"
                              >
                                <div className="flex items-center flex-wrap gap-1.5">
                                  <span className={`${
                                    topicState.status === 'COMPLETED' ? 'line-through opacity-60' : ''
                                  } ${isSelected ? 'text-[#E4E3E0]' : 'text-[#141414]'}`}>
                                    {topic.name}
                                  </span>
                                  {hasNotes && (
                                    <span className={`inline-flex items-center px-1 text-[9px] font-mono border rounded-none uppercase ${
                                      isSelected 
                                        ? 'bg-transparent text-[#E4E3E0] border-[#E4E3E0]/40' 
                                        : 'bg-transparent text-[#141414] border-[#141414]/30'
                                    }`}>
                                      Notes
                                    </span>
                                  )}
                                  {todoLength > 0 && (
                                    <span className={`inline-flex items-center px-1 text-[9px] font-mono border rounded-none uppercase ${
                                      isSelected 
                                        ? 'bg-transparent text-[#E4E3E0] border-[#E4E3E0]/40' 
                                        : 'bg-transparent text-[#141414] border-[#141414]/30'
                                    }`}>
                                      {completedTodoLength}/{todoLength} Todos
                                    </span>
                                  )}
                                </div>
                              </button>
                            </div>

                            {/* Options indicators */}
                            <div className="flex items-center space-x-2.5 flex-shrink-0">
                              {/* Confidence rating */}
                              {topicState.confidence > 0 && (
                                <div className="flex items-center space-x-0.5 text-amber-500 font-mono text-[10px]">
                                  <span>★</span>
                                  <span className={isSelected ? 'text-[#E4E3E0]' : 'text-[#141414]'}>{topicState.confidence}</span>
                                </div>
                              )}

                              {/* Status Badge clickable to quick cycle */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const statuses: TopicStatus[] = ['NOT_STARTED', 'IN_PROGRESS', 'REVISION_NEEDED', 'COMPLETED'];
                                  const currentIndex = statuses.indexOf(topicState.status);
                                  const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                                  onQuickStatusChange(topic.id, nextStatus);
                                }}
                                className="cursor-pointer transition-opacity hover:opacity-85 outline-hidden"
                                title="Click to cycle study status"
                              >
                                {getStatusBadge(topicState.status)}
                              </button>

                              {/* Save workspace trigger */}
                              <button
                                type="button"
                                onClick={() => onSelectTopic(isSelected ? null : topic.id)}
                                className={`font-mono text-[10px] uppercase font-bold cursor-pointer outline-hidden border px-1.5 py-0.5 transition-colors ${
                                  isSelected
                                    ? 'border-[#E4E3E0] bg-transparent text-[#E4E3E0] hover:bg-[#E4E3E0] hover:text-[#141414]'
                                    : 'border-[#141414] bg-white text-[#141414] hover:bg-[#141414] hover:text-white'
                                }`}
                              >
                                {isSelected ? 'Close' : 'Edit'}
                              </button>
                            </div>
                          </div>

                          {/* INLINE WORKSPACE EDITOR panel - renders right here! */}
                          {isSelected && (
                            <InlineTopicEditor
                              topic={topic}
                              subject={subj}
                              topicState={topicState}
                              onUpdateState={onUpdateState}
                              onAddSubTodo={onAddSubTodo}
                              onToggleSubTodo={onToggleSubTodo}
                              onDeleteSubTodo={onDeleteSubTodo}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
