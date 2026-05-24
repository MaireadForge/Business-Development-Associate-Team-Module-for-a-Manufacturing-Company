require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');
const clientRoutes = require('./routes/clients');
const taskRoutes = require('./routes/tasks');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/tasks', taskRoutes);

const User = require('./models/User');
const auth = require('./middleware/auth');

app.get('/api/users', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'BDA Team Module API' });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
