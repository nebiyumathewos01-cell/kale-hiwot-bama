const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ['Announcement', 'Prayer', 'Verse', 'Event'],
    default: 'Announcement'
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
