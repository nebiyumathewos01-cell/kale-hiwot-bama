const express = require('express');
const router  = express.Router();
const About   = require('../models/About');
const auth    = require('../middleware/auth');

// GET /api/about — public
router.get('/', async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) about = await About.create({});
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/about — admin only (upsert)
router.put('/', auth, async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({ ...req.body, updatedAt: new Date() });
    } else {
      Object.assign(about, req.body);
      about.updatedAt = new Date();
      await about.save();
    }
    res.json(about);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
