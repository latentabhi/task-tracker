import React from 'react';
import { Pencil, Trash2, Calendar, AlertTriangle } from 'lucide-react';

export default function TaskItem({ task, index, onStatusToggle, onEdit, onDelete }) {
  const formatDate = (str) => {
    if (!str) return '';
    return new Date(str).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isOverdue = () => {
    if (task.status === 'completed' || !task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const overdue = isOverdue();
  const done = task.status === 'completed';

  return (
    <div 
      className={`task-card priority-${task.priority} ${done ? 'completed' : ''}`}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="task-checkbox-wrapper">
        <input 
          type="checkbox" 
          className="task-checkbox" 
          checked={done}
          onChange={() => onStatusToggle(task)}
        />
      </div>

      <div className="task-content">
        <div className="task-card-title">{task.title}</div>
        {task.description && <p className="task-card-description">{task.description}</p>}

        <div className="task-meta">
          <span className={`badge badge-priority-${task.priority}`}>{task.priority}</span>
          <span className={`badge badge-status-${task.status}`}>{task.status.replace('-', ' ')}</span>

          <div className={`meta-item ${overdue ? 'overdue-indicator' : ''}`}>
            {overdue ? <AlertTriangle size={13} /> : <Calendar size={13} />}
            <span>Due: {formatDate(task.dueDate)}</span>
            {overdue && <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>(Overdue)</span>}
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button className="action-btn edit-btn" onClick={() => onEdit(task)} title="Edit">
          <Pencil size={16} />
        </button>
        <button className="action-btn delete-btn" onClick={() => onDelete(task._id)} title="Delete">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
