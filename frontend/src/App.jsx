import React, { useState, useEffect, useMemo } from 'react';
import { CheckSquare, Search } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from './utils/api';
import Dashboard from './components/Dashboard';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Toast from './components/Toast';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [wait, setWait] = useState(true);
  const [workspace, setWorkspace] = useState(api.getUser());
  const [tempWorkspace, setTempWorkspace] = useState(api.getUser());
  const [isEditingWorkspace, setIsEditingWorkspace] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  useEffect(() => {
    load();
  }, [workspace]);

  const load = async () => {
    try {
      setWait(true);
      const data = await api.get();
      setTasks(data);
    } catch (err) {
      notify(err.message || 'error loading tasks', 'error');
    } finally {
      setWait(false);
    }
  };

  const notify = (msg, type = 'success') => {
    setAlerts(prev => [...prev, { id: Date.now() + Math.random(), msg, type }]);
  };

  const dismiss = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const save = async (fields) => {
    try {
      if (editing) {
        const updated = await api.edit(editing._id, fields);
        setTasks(prev => prev.map(t => t._id === editing._id ? updated : t));
        notify('Task updated!');
        if (fields.status === 'completed' && editing.status !== 'completed') {
          confettiBurst();
        }
        setEditing(null);
      } else {
        const created = await api.add(fields);
        setTasks(prev => [created, ...prev]);
        notify('Task added!');
        if (fields.status === 'completed') confettiBurst();
      }
    } catch (err) {
      notify(err.message || 'save error', 'error');
    }
  };

  const toggle = async (task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const updated = await api.edit(task._id, { status: nextStatus });
      setTasks(prev => prev.map(t => t._id === task._id ? updated : t));
      if (nextStatus === 'completed') {
        notify('Task completed! 🎉');
        confettiBurst();
      } else {
        notify('Task pending.');
      }
    } catch (err) {
      notify(err.message || 'toggle error', 'error');
    }
  };

  const edit = (task) => {
    setEditing(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    try {
      await api.del(id);
      setTasks(prev => prev.filter(t => t._id !== id));
      notify('Task deleted', 'info');
      if (editing?._id === id) setEditing(null);
    } catch (err) {
      notify(err.message || 'delete error', 'error');
    }
  };

  const handleWorkspaceSubmit = (e) => {
    e.preventDefault();
    const val = tempWorkspace.trim();
    if (!val) return;
    const clean = val.replace(/[^a-zA-Z0-9_-]/g, '');
    api.setUser(clean);
    setWorkspace(clean);
    setTempWorkspace(clean);
    setIsEditingWorkspace(false);
    notify(`Workspace: ${clean}`);
  };

  const confettiBurst = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#8b5cf6', '#34d399', '#fb923c']
    });
  };

  const filtered = useMemo(() => {
    const weights = { high: 3, medium: 2, low: 1 };
    
    const matched = tasks.filter(t => {
      const title = t.title ? String(t.title).toLowerCase() : '';
      const desc = t.description ? String(t.description).toLowerCase() : '';
      const q = search.toLowerCase();
      return (title.includes(q) || desc.includes(q)) &&
        (statusFilter === 'all' || t.status === statusFilter) &&
        (priorityFilter === 'all' || t.priority === priorityFilter);
    });

    return [...matched].sort((a, b) => {
      if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'priority') return weights[b.priority] - weights[a.priority];
      return 0;
    });
  }, [tasks, search, statusFilter, priorityFilter, sortBy]);

  const bgParticles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => {
      const size = Math.random() * 140 + 40;
      const left = Math.random() * 100;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * -30;
      const rgb = i % 3 === 0 ? '239, 68, 68' : i % 3 === 1 ? '99, 102, 241' : '16, 185, 129';
      const opacity = i % 3 === 0 ? 0.22 : i % 3 === 1 ? 0.30 : 0.25;
      return (
        <div 
          key={i} 
          className="bg-particle" 
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            background: `radial-gradient(circle, rgba(${rgb}, ${opacity}) 0%, transparent 70%)`
          }}
        />
      );
    });
  }, []);

  return (
    <>
      <div className="bg-particles-container">{bgParticles}</div>
      <div className="app-container">
        <div className="toast-container">
          {alerts.map(a => (
            <Toast key={a.id} message={a.msg} type={a.type} onClose={() => dismiss(a.id)} />
          ))}
        </div>
        
        <header className="app-header">
          <div className="brand-bar">
            <div className="brand">
              <div className="brand-icon">
                <CheckSquare size={24} color="#ffffff" />
              </div>
              <h1 className="brand-name">FlowTask</h1>
            </div>

            <div className="workspace-switcher">
              {isEditingWorkspace ? (
                <form onSubmit={handleWorkspaceSubmit} className="workspace-form">
                  <input
                    type="text"
                    className="workspace-input"
                    value={tempWorkspace}
                    onChange={(e) => setTempWorkspace(e.target.value)}
                    placeholder="Workspace..."
                    maxLength={20}
                    autoFocus
                  />
                  <button type="submit" className="workspace-btn save">Save</button>
                  <button type="button" className="workspace-btn cancel" onClick={() => { setTempWorkspace(workspace); setIsEditingWorkspace(false); }}>✕</button>
                </form>
              ) : (
                <div className="workspace-badge" onClick={() => setIsEditingWorkspace(true)} title="Click to switch workspace">
                  <span className="workspace-badge-label">Workspace</span>
                  <span className="workspace-badge-val">{workspace}</span>
                </div>
              )}
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Keep track of your project workflows.
          </div>
        </header>
        
        <Dashboard tasks={tasks} />

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

        <div className="dashboard-layout">
          <aside>
            <TaskForm onSubmit={save} currentTask={editing} onCancel={() => setEditing(null)} />
          </aside>

          <main>
            {wait ? (
              <div className="spinner-wrapper">
                <div className="spinner"></div>
              </div>
            ) : (
              <TaskList
                tasks={filtered}
                onStatusToggle={toggle}
                onEdit={edit}
                onDelete={remove}
              />
            )}
          </main>
        </div>
      </div>
    </>
  );
}
