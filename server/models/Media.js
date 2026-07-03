const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  type:       { type: String, enum: ['image', 'video'], required: true },
  // base64 data URI (e.g. "data:image/jpeg;base64,...")
  data:       { type: String },
  mimeType:   { type: String },           // e.g. "image/jpeg", "video/mp4"
  fileName:   { type: String },           // original file name
  // video only: YouTube embed ID
  youtubeId:  { type: String },
  caption:    { type: String },
  sortOrder:  { type: Number, default: 0 },
  isActive:   { type: Boolean, default: true },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Media', mediaSchema);
