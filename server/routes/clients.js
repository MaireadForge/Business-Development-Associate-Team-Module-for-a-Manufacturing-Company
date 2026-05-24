const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Client = require('../models/Client');

// GET /api/clients - Get all clients
// Private
router.get('/', auth, async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ message: 'Server error fetching clients' });
  }
});

// POST /api/clients - Create a client
// Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, company, email, phone, industry, totalValue, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const newClient = new Client({
      name,
      company,
      email,
      phone,
      industry,
      totalValue,
      status: status || 'Active',
    });

    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (err) {
    console.error('Error creating client:', err);
    res.status(500).json({ message: 'Server error creating client' });
  }
});

// PUT /api/clients/:id - Update client
// Private
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(updatedClient);
  } catch (err) {
    console.error('Error updating client:', err);
    res.status(500).json({ message: 'Server error updating client' });
  }
});

// DELETE /api/clients/:id - Delete client
// Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);

    if (!deletedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).json({ message: 'Server error deleting client' });
  }
});

module.exports = router;
