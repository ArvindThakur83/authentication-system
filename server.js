const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/login_demo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'demoSecret',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const authRoutes = require('./routes/auth');
const { isAuthenticated } = require('./middleware/authMiddleware');

app.use('/', authRoutes);

// Pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views/home.html')));
app.get('/public', (req, res) => res.sendFile(path.join(__dirname, 'views/public.html')));
app.get('/private', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'views/private.html')));
app.get('/unauthorized', (req, res) => res.sendFile(path.join(__dirname, 'views/unauthorized.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
