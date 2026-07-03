const express = require('express');
const router  = express.Router();
const Media   = require('../models/Media');
const auth    = require('../middleware/auth');

// GET /api/media — public (active only)
router.get('/', async (req, res) => {
  try {
    const items = await Media.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/media/all — admin: all including inactive
router.get('/all', auth, async (req, res) => {
  try {
    const items = await Media.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/media — admin
router.post('/', auth, async (req, res) => {
  try {
    const item = new Media(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/media/:id — admin
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Not found.' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/media/:id — admin
router.delete('/:id', auth, async (req, res) => {
  try {
    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
