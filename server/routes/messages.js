const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// GET /api/messages - public (only active)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/messages/all - admin only (all messages)
router.get('/all', auth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error('Get all messages error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/messages - admin only
router.post('/', auth, async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error('Create message error:', err);
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/messages/:id - admin only
router.put('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!message) return res.status(404).json({ message: 'Message not found.' });
    res.json(message);
  } catch (err) {
    console.error('Update message error:', err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/messages/:id - admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found.' });
    res.json({ message: 'Message deleted successfully.' });
  } catch (err) {
    console.error('Delete message error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
