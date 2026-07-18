const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  // Main section
  churchName:    { type: String, default: 'ቃለ ሕይወት ባማ Choir መዘምራን' },
  tagline:       { type: String, default: 'Kale Hiwot Bama Choir' },
  description:   { type: String, default: '' },
  vision:        { type: String, default: '' },
  mission:       { type: String, default: '' },
  founded:       { type: String, default: '' },
  location:      { type: String, default: '' },
  phone:         { type: String, default: '' },
  email:         { type: String, default: '' },
  // Team members
  members: [{
    name:     { type: String },
    role:     { type: String },
    imageUrl: { type: String },
  }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('About', aboutSchema);
