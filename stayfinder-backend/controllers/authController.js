const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "63d808115cb863",
    pass: "8c0a298a0b40c2"
  }
});

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

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // valid for 1 hour
    await user.save();

    // Reset URL
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "63d808115cb863",
        pass: "8c0a298a0b40c2"
      }
    });

    // Send the email
    await transporter.sendMail({
      to: email,
      from: '"StayFinder" <no-reply@stayfinder.com>',
      subject: "Reset Your Password",
      html: `
        <p>Hello ${user.name || ''},</p>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link will expire in 1 hour.</p>
        <br>
        <p>If you didn't request this, you can ignore this email.</p>
      `
    });

    res.json({ message: 'Password reset link sent!' });
  } catch (err) {
    console.error('❌ Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Find user with valid token and expiration
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password reset successfully. Please log in.' });
  } catch (err) {
    console.error('❌ Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};