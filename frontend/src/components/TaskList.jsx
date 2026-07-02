import React from 'react';
import { Inbox } from 'lucide-react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onStatusToggle, onEdit, onDelete }) {
  return (
    <div className="tasks-container">
      <div className="tasks-list">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <TaskItem
              key={task._id}
              task={task}
              index={index}
              onStatusToggle={onStatusToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="no-tasks">
            <Inbox size={48} className="no-tasks-icon" />
            <div>
              <h3>No tasks found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Try adjusting your filters, or add a task to get started.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
