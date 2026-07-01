import React from 'react';
import { ListTodo, CheckCircle2, PlayCircle, Clock } from 'lucide-react';

export default function Dashboard({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { val: total, label: 'Total Tasks', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)', icon: ListTodo },
    { val: completed, label: `Completed (${pct}%)`, color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)', icon: CheckCircle2 },
    { val: inProgress, label: 'In Progress', color: '#a78bfa', bg: 'rgba(139, 92, 246, 0.15)', icon: PlayCircle },
    { val: pending, label: 'Pending', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)', icon: Clock }
  ];

  return (
    <div className="stats-grid">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div className="stat-card" key={idx}>
            <div className="stat-icon-wrapper" style={{ background: s.bg, color: s.color }}>
              <Icon size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{s.val}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
