import React from 'react';
import { BookOpen, CheckCircle2, Flame, AlertTriangle, Layers, Award } from 'lucide-react';
import { TrackerState, Subject, Topic, TopicState } from '../types';

interface StatsPanelProps {
  subjects: Subject[];
  state: TrackerState;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ subjects, state }) => {
  // Compute metrics
  const totalTopics = subjects.reduce((acc, sub) => acc + sub.topics.length, 0);
  
  const topicStatesList = Object.values(state.topicStates) as TopicState[];
  const completedCount = topicStatesList.filter(t => t.status === 'COMPLETED').length;
  const inProgressCount = topicStatesList.filter(t => t.status === 'IN_PROGRESS').length;
  const revisionCount = topicStatesList.filter(t => t.status === 'REVISION_NEEDED').length;
  const notStartedCount = totalTopics - completedCount - inProgressCount - revisionCount;

  const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // Find most studied subject
  const subjectProgresses = subjects.map(sub => {
    const subTopics = sub.topics;
    const subCompleted = subTopics.filter(t => state.topicStates[t.id]?.status === 'COMPLETED').length;
    const subPercent = subTopics.length > 0 ? Math.round((subCompleted / subTopics.length) * 100) : 0;
    return { name: sub.name, percent: subPercent, color: sub.color, completed: subCompleted, total: subTopics.length };
  });

  const topSubject = [...subjectProgresses].sort((a, b) => b.percent - a.percent)[0];

  return (
    <div id="stats-dashboard-container" className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Circle / Radial Progress card */}
      <div id="metric-progress-card" className="p-5 border border-[#141414] bg-white/40 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-serif-header text-[#141414] opacity-70 uppercase tracking-wider">Overall Syllabus</p>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-mono font-bold tracking-tight text-[#141414]">{progressPercent}%</span>
            <span className="text-xs font-serif-header opacity-60">Complete</span>
          </div>
          <p className="text-xs font-mono text-xs opacity-85">
            {completedCount}/{totalTopics} mastered
          </p>
        </div>
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Radial Progress Ring */}
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="26"
              className="stroke-neutral-300"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="32"
              cy="32"
              r="26"
              className="stroke-[#2A5A2A] transition-all duration-500 ease-out"
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={163.3}
              strokeDashoffset={163.3 - (163.3 * progressPercent) / 100}
            />
          </svg>
          <span className="absolute text-[11px] font-mono font-bold text-[#141414]">{progressPercent}%</span>
        </div>
      </div>

      {/* Streak Checker */}
      <div id="metric-streak-card" className="p-5 border border-[#141414] bg-white/40 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-serif-header text-[#141414] opacity-70 uppercase tracking-wider">Aspirant Streak</p>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-mono font-bold tracking-tight text-[#141414]">{state.streak} DAYS</span>
          </div>
          <p className="text-xs font-serif-header opacity-75">Maintain daily focus</p>
        </div>
        <div className="w-11 h-11 border border-[#141414] flex items-center justify-center text-[#141414] bg-transparent">
          <Flame className="w-5 h-5 fill-current" />
        </div>
      </div>

      {/* Topics Status Matrix */}
      <div id="metric-status-matrix" className="p-5 border border-[#141414] bg-white/40 md:col-span-2">
        <p className="text-xs font-serif-header text-[#141414] opacity-70 uppercase tracking-wider mb-3">Topic Checklist Status Map</p>
        <div className="grid grid-cols-4 gap-2">
          <div className="border border-[#141414] px-1 py-2 text-center bg-transparent">
            <div className="flex items-center justify-center text-[#2A5A2A] mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <p className="text-base font-bold font-mono text-[#141414]">{completedCount}</p>
            <p className="text-[9px] font-mono uppercase tracking-tight">Mastered</p>
          </div>

          <div className="border border-[#141414] px-1 py-2 text-center bg-transparent">
            <div className="flex items-center justify-center text-[#141414] mb-0.5">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <p className="text-base font-bold font-mono text-[#141414]">{inProgressCount}</p>
            <p className="text-[9px] font-mono uppercase tracking-tight">Studying</p>
          </div>

          <div className="border border-[#141414] px-1 py-1.5 text-center bg-transparent">
            <div className="flex items-center justify-center text-[#141414] mb-0.5">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <p className="text-base font-bold font-mono text-[#141414]">{revisionCount}</p>
            <p className="text-[9px] font-mono uppercase tracking-tight">Revision</p>
          </div>

          <div className="border border-[#141414] px-1 py-1.5 text-center bg-transparent">
            <div className="flex items-center justify-center text-[#141414] mb-0.5">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <p className="text-base font-bold font-mono text-[#141414]">{notStartedCount}</p>
            <p className="text-[9px] font-mono uppercase tracking-tight">Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
};
