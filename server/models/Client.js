const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  industry: {
    type: String,
  },
  totalValue: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Client', clientSchema);
