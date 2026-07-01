import React, { useState } from 'react';
import { Search, Inbox } from 'lucide-react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onStatusToggle, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  const weights = { high: 3, medium: 2, low: 1 };

  const filtered = tasks.filter(t => {
    const title = t.title ? String(t.title).toLowerCase() : '';
    const desc = t.description ? String(t.description).toLowerCase() : '';
    const q = search.toLowerCase();
    return (title.includes(q) || desc.includes(q)) &&
      (statusFilter === 'all' || t.status === statusFilter) &&
      (priorityFilter === 'all' || t.priority === priorityFilter);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
    if (sortBy === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'priority') return weights[b.priority] - weights[a.priority];
    return 0;
  });

  return (
    <div className="tasks-container">
      <div className="controls-panel">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filters-row">
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select className="filter-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <span className="sort-label">Sort By:</span>
          <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="dueDate">Due Date</option>
            <option value="createdAt">Date Created</option>
            <option value="title">Alphabetical</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      <div className="tasks-list">
        {sorted.length > 0 ? (
          sorted.map((task, index) => (
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
