const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
  },
  contactName: {
    type: String,
  },
  contactEmail: {
    type: String,
  },
  phone: {
    type: String,
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'],
    default: 'New',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  value: {
    type: Number,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Lead', leadSchema);
