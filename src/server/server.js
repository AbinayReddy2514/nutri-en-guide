
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use a secure environment variable

// MongoDB Connection
const MONGODB_URI = "mongodb+srv://abinayreddy2:reddy123@nguide.qffw4.mongodb.net/";

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  height: { type: Number }, // in cm
  weight: { type: Number }, // in kg
  dietaryPreferences: [String],
  healthGoals: [String],
  activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'very active'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', userSchema);
const Profile = mongoose.model('Profile', profileSchema);

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Routes
// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
app.get('/api/profiles/:userId', authenticateToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create profile
app.post('/api/profiles', authenticateToken, async (req, res) => {
  try {
    const { userId, age, gender, height, weight, dietaryPreferences, healthGoals, activityLevel } = req.body;
    
    // Check if profile already exists
    const existingProfile = await Profile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }
    
    // Create new profile
    const newProfile = new Profile({
      userId,
      age,
      gender,
      height,
      weight,
      dietaryPreferences,
      healthGoals,
      activityLevel
    });
    
    await newProfile.save();
    
    res.status(201).json(newProfile);
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
app.put('/api/profiles/:profileId', authenticateToken, async (req, res) => {
  try {
    const profile = await Profile.findByIdAndUpdate(
      req.params.profileId,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recommendations (this would integrate with the Gemini API)
app.get('/api/recommendations/:userId', authenticateToken, async (req, res) => {
  try {
    // In a real app, this would fetch the user's profile and use it to generate recommendations
    // For now, we'll just return a mock response
    res.json({
      date: new Date().toISOString().split('T')[0],
      meals: [],
      totalNutrients: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
