const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, roles } = req.body;
    if (roles && !roles.every(role => ['host', 'guest'].includes(role))) {
      return res.status(400).json({ message: 'Invalid role(s) provided' });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
     const allowedRoles = ['host', 'guest'];

    // Normalize roles to always be an array
    if (!roles) {
      roles = ['guest']; // Default
    } else if (!Array.isArray(roles)) {
      roles = [roles]; // Convert single string to array
    }

    const filteredRoles = roles.filter(role => allowedRoles.includes(role));

    if (filteredRoles.length === 0) {
      return res.status(400).json({ message: 'Invalid role(s) provided' });
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: filteredRoles
    });

    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    const { password: _, ...userWithoutPassword } = user.toObject();
     res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'User Logged In Successfully', token, user: { id: user._id, name: user.name, email: user.email, role: user.role} });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};