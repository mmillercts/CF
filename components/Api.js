const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Home = require('../models/Home');
const About = require('../models/About');
const Team = require('../models/Team');
const Development = require('../models/Development');
const Benefits = require('../models/Benefits');
const Documents = require('../models/Documents');
const Photos = require('../models/Photos');
const Calendar = require('../models/Calendar');

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Home
router.get('/home', verifyToken, async (req, res) => {
  try {
    const homeData = await Home.findOne();
    res.json({
      welcome: homeData?.welcome || [],
      quickLinks: homeData?.quickLinks || [],
      announcements: homeData?.announcements || [],
      role: req.user.role,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/home', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  try {
    const { title, description, icon, label, link, date, type } = req.body;
    const update = type === 'welcome' ? { welcome: { title, description } }
      : type === 'quickLink' ? { quickLinks: { icon, label, link } }
      : { announcements: { date, title, description } };
    await Home.updateOne({}, { $push: update }, { upsert: true });
    res.json({ message: 'Content added' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/home/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  try {
    const { id } = req.params;
    const { title, description, icon, label, link, date, type } = req.body;
    const update = type === 'welcome' ? { 'welcome.$.title': title, 'welcome.$.description': description }
      : type === 'quickLink' ? { 'quickLinks.$.icon': icon, 'quickLinks.$.label': label, 'quickLinks.$.link': link }
      : { 'announcements.$.date': date, 'announcements.$.title': title, 'announcements.$.description': description };
    await Home.updateOne({ [`${type}s._id`]: id }, { $set: update });
    res.json({ message: 'Content updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/home/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  try {
    const { id } = req.params;
    const { type } = req.body;
    await Home.updateOne({}, { $pull: { [`${type}s`]: { _id: id } } });
    res.json({ message: 'Content deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// About
router.get('/about', verifyToken, async (req, res) => {
  try {
    const data = await About.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/about', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  try {
    const { title, description } = req.body;
    const item = await About.create({ title, description });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/about/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    await About.findByIdAndUpdate(id, { title, description });
    res.json({ message: 'Content updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/about/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  try {
    await About.findByIdAndDelete(req.params.id);
    res.json({ message: 'Content deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Team
router.get('/team', verifyToken, async (req, res) => {
  try {
    const data = await Team.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/team', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  try {
    const { name, position, description, level, photo } = req.body;
    const teamMember = await Team.create({ name, position, description, level, photo });
    res.json(teamMember);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/team/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  try {
    const { id } = req.params;
    const { name, position, description, level, photo } = req.body;
    await Team.findByIdAndUpdate(id, { name, position, description, level, photo });
    res.json({ message: 'Team member updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/team/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Development
router.get('/development', verifyToken, async (req, res) => {
  try {
    const data = await Development.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/development', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  try {
    const { title, description, links } = req.body;
    const item = await Development.create({ title, description, links });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/development/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  try {
    const { id } = req.params;
    const { title, description, links } = req.body;
    await Development.findByIdAndUpdate(id, { title, description, links });
    res.json({ message: 'Content updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/development/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  try {
    await Development.findByIdAndDelete(req.params.id);
    res.json({ message: 'Content deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Benefits
router.get('/benefits', verifyToken, async (req, res) => {
  try {
    const data = await Benefits.findOne();
    res.json(data || { fullTime: [], partTime: [], manager: [] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/benefits', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  try {
    const { title, description, category } = req.body;
    await Benefits.updateOne({}, { $push: { [category]: { title, description } } }, { upsert: true });
    res.json({ message: 'Benefit added' });
  }