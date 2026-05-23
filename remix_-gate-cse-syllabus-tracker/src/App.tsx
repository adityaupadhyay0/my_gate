import React, { useState, useEffect } from 'react';
import { GraduationCap, Download, Upload, RefreshCw, BookOpen, Layers, Target, Trophy, Info, Database } from 'lucide-react';
import { INITIAL_SUBJECTS } from './data';
import { TrackerState, TopicState, GeneralTodo, TopicStatus, CustomTodo } from './types';
import { StatsPanel } from './components/StatsPanel';
import { SubjectAccordion } from './components/SubjectAccordion';

const LOCAL_STORAGE_KEY = 'gate_cse_study_tracker_state_v1';

const createInitialState = (): TrackerState => {
  return {
    topicStates: {},
    generalTodos: [],
    streak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0]
  };
};

export default function App() {
  const [state, setState] = useState<TrackerState>(createInitialState);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Load state from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as TrackerState;
        
        // Calculate Streak logic
        const todayStr = new Date().toISOString().split('T')[0];
        let currentStreak = parsed.streak !== undefined ? parsed.streak : 0;
        const lastDate = parsed.lastActiveDate;

        if (lastDate && lastDate !== todayStr) {
          const lastActiveTime = new Date(lastDate).getTime();
          const todayTime = new Date(todayStr).getTime();
          const diffDays = Math.round((todayTime - lastActiveTime) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            currentStreak += 1; // consecutive day
          } else if (diffDays > 1) {
            currentStreak = 0; // broke streak
          }
        }
        
        setState({
          ...parsed,
          streak: currentStreak,
          lastActiveDate: todayStr
        });
      } else {
        // No stored state, use default seeded state
        const initial = createInitialState();
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
        setState(initial);
      }
    } catch (e) {
      console.error('Error loading Gate Study Tracker state from LocalStorage:', e);
    }
  }, []);

  // Save state back to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Helper: Find current selected topic and its parent subject
  const currentSelection = React.useMemo(() => {
    if (!selectedTopicId) return null;
    for (const sub of INITIAL_SUBJECTS) {
      const topic = sub.topics.find((t) => t.id === selectedTopicId);
      if (topic) {
        return { topic, subject: sub };
      }
    }
    return null;
  }, [selectedTopicId]);

  // Handle direct checkboxes toggling (Square -> Completed)
  const handleToggleTopicStatus = (topicId: string) => {
    setState((prev) => {
      const current = prev.topicStates[topicId] || {
        id: topicId,
        status: 'NOT_STARTED',
        confidence: 0,
        notes: '',
        customTodos: []
      };

      const newStatus: TopicStatus = current.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';
      
      return {
        ...prev,
        topicStates: {
          ...prev.topicStates,
          [topicId]: {
            ...current,
            status: newStatus,
            confidence: newStatus === 'COMPLETED' && current.confidence === 0 ? 5 : current.confidence
          }
        }
      };
    });
  };

  // Quick cycle state
  const handleQuickStatusChange = (topicId: string, status: TopicStatus) => {
    setState((prev) => {
      const current = prev.topicStates[topicId] || {
        id: topicId,
        status: 'NOT_STARTED',
        confidence: 0,
        notes: '',
        customTodos: []
      };

      return {
        ...prev,
        topicStates: {
          ...prev.topicStates,
          [topicId]: {
            ...current,
            status,
            confidence: status === 'COMPLETED' && current.confidence === 0 ? 5 : current.confidence
          }
        }
      };
    });
  };

  // General field updater for topics
  const handleUpdateTopicState = (topicId: string, updates: Partial<TopicState>) => {
    setState((prev) => {
      const current = prev.topicStates[topicId] || {
        id: topicId,
        status: 'NOT_STARTED',
        confidence: 0,
        notes: '',
        customTodos: []
      };

      return {
        ...prev,
        topicStates: {
          ...prev.topicStates,
          [topicId]: {
            ...current,
            ...updates
          }
        }
      };
    });
  };

  // Add fine-grained subtask specifically for a topic
  const handleAddTopicSubTodo = (topicId: string, text: string) => {
    const newTodo: CustomTodo = {
      id: `sub-${Date.now()}`,
      text,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setState((prev) => {
      const current = prev.topicStates[topicId] || {
        id: topicId,
        status: 'IN_PROGRESS',
        confidence: 3,
        notes: '',
        customTodos: []
      };

      return {
        ...prev,
        topicStates: {
          ...prev.topicStates,
          [topicId]: {
            ...current,
            customTodos: [...current.customTodos, newTodo]
          }
        }
      };
    });
  };

  // Toggle fine-grained subtask checklist
  const handleToggleTopicSubTodo = (topicId: string, todoId: string) => {
    setState((prev) => {
      const current = prev.topicStates[topicId];
      if (!current) return prev;

      const updatedTodos = current.customTodos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      );

      return {
        ...prev,
        topicStates: {
          ...prev.topicStates,
          [topicId]: {
            ...current,
            customTodos: updatedTodos
          }
        }
      };
    });
  };

  // Delete fine-grained subtask
  const handleDeleteTopicSubTodo = (topicId: string, todoId: string) => {
    setState((prev) => {
      const current = prev.topicStates[topicId];
      if (!current) return prev;

      return {
        ...prev,
        topicStates: {
          ...prev.topicStates,
          [topicId]: {
            ...current,
            customTodos: current.customTodos.filter((t) => t.id !== todoId)
          }
        }
      };
    });
  };

  // Export progress configuration
  const handleExportPlan = () => {
    try {
      const dataStr = JSON.stringify(state, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `gate-cse-study-plan-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (e) {
      console.error('Failed to export study plan:', e);
    }
  };

  // Import study progress JSON config
  const handleImportPlan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    setImportError(null);
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          if (event.target?.result) {
            const importedState = JSON.parse(event.target.result as string) as TrackerState;
            
            // Basic validation
            if (importedState.topicStates && Array.isArray(importedState.generalTodos)) {
              setState({
                topicStates: importedState.topicStates || {},
                generalTodos: importedState.generalTodos || [],
                streak: importedState.streak || 0,
                lastActiveDate: importedState.lastActiveDate || new Date().toISOString().split('T')[0]
              });
              setImportError(null);
            } else {
              setImportError('Invalid backup file schema. Please verify JSON file format.');
            }
          }
        } catch (err) {
          setImportError('Failed to parse uploaded backup JSON configuration.');
        }
      };
    }
  };

  // Complete reset helper
  const handleResetState = () => {
    if (window.confirm('Are you absolutely sure you want to revert all topic studies, confidence states, notes, and custom tasks to factory defaults? This is non-reversible.')) {
      const freshState = createInitialState();
      setState(freshState);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(freshState));
      setSelectedTopicId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans antialiased pb-12 border-4 md:border-8 border-[#141414]">
      {/* Top Professional Banner */}
      <header className="border-b border-[#141414] bg-[#E4E3E0] sticky top-0 z-10 py-4 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 border border-[#141414] bg-[#141414] flex items-center justify-center text-[#E4E3E0]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold font-mono tracking-tight uppercase text-[#141414] flex items-center gap-1.5">
                CS_GATE_CSE_CURRICULUM_V1.12
              </h1>
              <p className="text-[11px] font-mono opacity-75">
                Topic-wise Preparation & PYQ Checklist
              </p>
            </div>
          </div>

          {/* Export / Revert controls */}
          <div className="flex items-center space-x-2 flex-wrap gap-2 sm:gap-0">
            {/* Reset */}
            <button
              onClick={handleResetState}
              className="px-3 py-1.5 text-xs text-[#141414] font-mono font-bold border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-all flex items-center space-x-1 bg-transparent cursor-pointer uppercase"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Full Reset</span>
            </button>

            {/* Export */}
            <button
              onClick={handleExportPlan}
              className="px-3 py-1.5 text-xs text-[#141414] font-mono font-bold border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-all flex items-center space-x-1 bg-transparent cursor-pointer uppercase"
              title="Download backup plan as JSON file font-bold border"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup JSON</span>
            </button>

            {/* Import file input wrapper */}
            <label className="px-3 py-1.5 text-xs text-[#141414] font-mono font-bold border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-all flex items-center space-x-1 bg-transparent cursor-pointer uppercase">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportPlan}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </header>

      {/* Main Study Desk Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
        {importError && (
          <div className="mb-4 p-3 border border-red-600 bg-red-100/10 text-red-700 text-xs font-mono font-bold uppercase">
            <span>⚠️ {importError}</span>
          </div>
        )}

        {/* Bento Board Stats Bar */}
        <StatsPanel subjects={INITIAL_SUBJECTS} state={state} />

        {/* Dynamic Study Grid */}
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-mono font-bold text-[#141414] uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#141414]/65" />
              <span>Syllabus Grid Engine ({INITIAL_SUBJECTS.length} Categories)</span>
            </h3>
          </div>
          
          <SubjectAccordion
            subjects={INITIAL_SUBJECTS}
            state={state}
            selectedTopicId={selectedTopicId}
            onSelectTopic={setSelectedTopicId}
            onToggleTopicStatus={handleToggleTopicStatus}
            onQuickStatusChange={handleQuickStatusChange}
            onUpdateState={handleUpdateTopicState}
            onAddSubTodo={handleAddTopicSubTodo}
            onToggleSubTodo={handleToggleTopicSubTodo}
            onDeleteSubTodo={handleDeleteTopicSubTodo}
          />
        </div>
      </main>

      {/* Footer conforming to specifications */}
      <footer className="max-w-7xl mx-auto px-4 md:px-6 mt-12 pt-6 border-t border-[#141414]">
        <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-[#141414] opacity-70 uppercase tracking-widest gap-2">
          <div>BUILD_ID: 8842-X9-ALPHA (GATE_CSE_MONITOR)</div>
          <div>USER: {localStorage.getItem('gate_username') || 'STUDENT@GATE_CSE'}</div>
          <div>LAST_COMPILED_TIME: 2026-05-23_12:13:28</div>
        </div>
      </footer>
    </div>
  );
}
