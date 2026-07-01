import React, { useState, useEffect } from 'react';
import { PlusCircle, Save } from 'lucide-react';

const today = () => new Date().toISOString().split('T')[0];

const defaultForm = () => ({
  title: '',
  description: '',
  status: 'pending',
  priority: 'low',
  dueDate: today(),
});

export default function TaskForm({ onSubmit, currentTask, onCancel }) {
  const [fields, setFields] = useState(defaultForm());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentTask) {
      setFields({
        title: currentTask.title,
        description: currentTask.description || '',
        status: currentTask.status,
        priority: currentTask.priority,
        dueDate: currentTask.dueDate ? new Date(currentTask.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFields(defaultForm());
    }
    setErrors({});
  }, [currentTask]);

  const changeField = (e) => {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!fields.title.trim()) errs.title = 'Title required';
    if (!fields.dueDate) errs.dueDate = 'Due date required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(fields);
    if (!currentTask) setFields(defaultForm());
  };

  return (
    <form className="task-form-container" onSubmit={submitForm}>
      <h2 className="form-title">{currentTask ? 'Edit Task' : 'New Task'}</h2>

      <div className="form-group">
        <label className="form-label">Title *</label>
        <input
          type="text"
          name="title"
          className="form-input"
          value={fields.title}
          onChange={changeField}
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-input form-textarea"
          value={fields.description}
          onChange={changeField}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Priority</label>
        <select name="priority" className="form-select" value={fields.priority} onChange={changeField}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Status</label>
        <select name="status" className="form-select" value={fields.status} onChange={changeField}>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Due Date *</label>
        <input
          type="date"
          name="dueDate"
          className="form-input"
          value={fields.dueDate}
          onChange={changeField}
        />
        {errors.dueDate && <span className="form-error">{errors.dueDate}</span>}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
          {currentTask ? <><Save size={18} /> Save</> : <><PlusCircle size={18} /> Add</>}
        </button>
        {currentTask && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
