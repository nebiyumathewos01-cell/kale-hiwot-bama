const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleAmharic: { type: String },
  singer: { type: String },
  lyrics: { type: String, required: true },
  lyricsEnglish: { type: String },
  category: {
    type: String,
    enum: ['Praise', 'Worship', 'Hymn', 'Special'],
    default: 'Praise'
  },
  language: {
    type: String,
    enum: ['Amharic', 'English', 'Both'],
    default: 'Amharic'
  },
  songNumber: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Song', songSchema);
