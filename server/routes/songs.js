const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const auth = require('../middleware/auth');

// GET /api/songs - public
router.get('/', async (req, res) => {
  try {
    const { search, category, language } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { titleAmharic: { $regex: search, $options: 'i' } },
        { singer: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) filter.category = category;
    if (language) filter.language = language;

    const songs = await Song.find(filter).sort({ songNumber: 1, createdAt: -1 });
    res.json(songs);
  } catch (err) {
    console.error('Get songs error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/songs/:id - public
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found.' });
    res.json(song);
  } catch (err) {
    console.error('Get song error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/songs - admin only
router.post('/', auth, async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.status(201).json(song);
  } catch (err) {
    console.error('Create song error:', err);
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/songs/:id - admin only
router.put('/:id', auth, async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!song) return res.status(404).json({ message: 'Song not found.' });
    res.json(song);
  } catch (err) {
    console.error('Update song error:', err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/songs/:id - admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found.' });
    res.json({ message: 'Song deleted successfully.' });
  } catch (err) {
    console.error('Delete song error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
