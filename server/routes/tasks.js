const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// GET /api/tasks - Get all tasks (populate assignedTo and lead)
// Private
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name')
      .populate('lead', 'title');
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// POST /api/tasks - Create a task
// Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, assignedTo, lead, dueDate, priority, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTask = new Task({
      title,
      description,
      assignedTo: assignedTo || req.user.id,
      lead,
      dueDate,
      priority,
      status: status || 'Todo',
    });

    const savedTask = await newTask.save();
    const populatedTask = await Task.findById(savedTask._id)
      .populate('assignedTo', 'name')
      .populate('lead', 'title');
    res.status(201).json(populatedTask);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Server error creating task' });
  }
});

// PUT /api/tasks/:id - Update task
// Private
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name')
      .populate('lead', 'title');

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Server error updating task' });
  }
});

// DELETE /api/tasks/:id - Delete task
// Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Server error deleting task' });
  }
});

module.exports = router;
