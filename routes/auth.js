const express = require('express');
const path = require('path');
const router = express.Router();
const User = require('../models/User');

router.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../views/login.html')));
router.get('/register', (req, res) => res.sendFile(path.join(__dirname, '../views/register.html')));

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.send('User already exists');
    await User.create({ username, password });
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.send('Error registering user');
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    req.session.user = user;
    return res.redirect(req.session.redirectTo || '/private');
  }
  res.redirect('/unauthorized');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;