const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');

let db = [];
const genId = () => Math.random().toString(36).slice(2, 9);
const offline = () => mongoose.connection.readyState !== 1;

router.get('/', async (req, res) => {
  const { status, priority, search } = req.query;
  const uid = req.headers['x-user-id'] || 'default';

  if (offline()) {
    let list = db.filter(t => t.userId === uid);
    if (status && status !== 'all') list = list.filter(t => t.status === status);
    if (priority && priority !== 'all') list = list.filter(t => t.priority === priority);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t => (t.title || '').toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q));
    }
    return res.json(list.sort((a, b) => b.createdAt - a.createdAt));
  }

  try {
    const q = { userId: uid };
    if (status && status !== 'all') q.status = status;
    if (priority && priority !== 'all') q.priority = priority;
    if (search) {
      q.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    const tasks = await Task.find(q).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const uid = req.headers['x-user-id'] || 'default';
  if (!title?.trim() || !dueDate) return res.status(400).json({ error: 'Missing title or due date' });

  if (offline()) {
    const task = {
      _id: genId(),
      userId: uid,
      title,
      description: description || '',
      status: status || 'pending',
      priority: priority || 'low',
      dueDate,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    db.unshift(task);
    return res.status(201).json(task);
  }

  try {
    const task = new Task({ userId: uid, title, description, status, priority, dueDate });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const uid = req.headers['x-user-id'] || 'default';

  if (offline()) {
    const task = db.find(t => t._id === req.params.id && t.userId === uid);
    if (!task) return res.status(404).json({ error: 'Not found' });
    
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    task.updatedAt = new Date();
    return res.json(task);
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, userId: uid });
    if (!task) return res.status(404).json({ error: 'Not found' });

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const uid = req.headers['x-user-id'] || 'default';

  if (offline()) {
    const idx = db.findIndex(t => t._id === req.params.id && t.userId === uid);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    db.splice(idx, 1);
    return res.json({ success: true });
  }

  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: uid });
    if (!task) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
