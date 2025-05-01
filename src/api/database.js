import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

const MONGODB_URI = 'mongodb+srv://AbinayReddy2514:Reddy22@nutrienguide.mj8ynee.mongodb.net/';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'nutrienguide' // explicitly specify the DB name
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// SCHEMAS
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  age: Number,
  gender: String,
  height: Number,
  weight: Number,
  preferences: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// MODELS
const User = mongoose.model('User', userSchema);
const Profile = mongoose.model('Profile', profileSchema);

// ROUTES

// Signup
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = await User.create({ name, email, password });
    const token = `token-${Date.now()}`;
    res.json({ ...newUser.toObject(), token, password: undefined });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const token = `token-${Date.now()}`;
    res.json({ ...user.toObject(), token, password: undefined });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create Profile
app.post('/api/profile', async (req, res) => {
  try {
    const profile = await Profile.create(req.body);
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Profile
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Profile
app.put('/api/profile/:profileId', async (req, res) => {
  try {
    const updated = await Profile.findByIdAndUpdate(
      req.params.profileId,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mock Recommendation Route
app.get('/api/recommendations/:userId', (req, res) => {
  const mockRecommendation = {
    date: new Date().toISOString(),
    meals: [
      {
        name: 'Healthy Breakfast',
        category: 'breakfast',
        mealType: 'breakfast',
        foods: [
          { name: 'Oatmeal with berries', quantity: '1 bowl', calories: 350 },
          { name: 'Greek yogurt', quantity: '1 cup', calories: 150 }
        ],
        nutrients: {
          calories: 500,
          protein: 15,
          carbs: 65,
          fat: 12
        },
        ingredients: ['oatmeal', 'berries', 'Greek yogurt']
      }
    ],
    totalNutrients: {
      calories: 1670,
      protein: 95,
      carbs: 185,
      fat: 60
    }
  };

  res.json(mockRecommendation);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
