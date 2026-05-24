const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Lead = require('../models/Lead');

// GET /api/leads - Get all leads (populate assignedTo name)
// Private
router.get('/', auth, async (req, res) => {
  try {
    const leads = await Lead.find().populate('assignedTo', 'name');
    res.json(leads);
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ message: 'Server error fetching leads' });
  }
});

// POST /api/leads - Create a lead
// Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, company, contactName, contactEmail, phone, status, assignedTo, value, notes } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newLead = new Lead({
      title,
      company,
      contactName,
      contactEmail,
      phone,
      status: status || 'New',
      assignedTo: assignedTo || req.user.id,
      value,
      notes,
    });

    const savedLead = await newLead.save();
    const populatedLead = await Lead.findById(savedLead._id).populate('assignedTo', 'name');
    res.status(201).json(populatedLead);
  } catch (err) {
    console.error('Error creating lead:', err);
    res.status(500).json({ message: 'Server error creating lead' });
  }
});

// PUT /api/leads/:id - Update lead (also used for status drag-drop)
// Private
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name');

    if (!updatedLead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(updatedLead);
  } catch (err) {
    console.error('Error updating lead:', err);
    res.status(500).json({ message: 'Server error updating lead' });
  }
});

// DELETE /api/leads/:id - Delete lead
// Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);

    if (!deletedLead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    console.error('Error deleting lead:', err);
    res.status(500).json({ message: 'Server error deleting lead' });
  }
});

module.exports = router;
