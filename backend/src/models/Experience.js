const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  roundName: { type: String, required: true },
  description: { type: String, default: '' },
  tips: { type: String, default: '' }
});

const experienceSchema = new mongoose.Schema(
  {
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    type: { 
      type: String, 
      enum: ['placement', 'internship'], 
      required: true 
    },
    company: { type: String, required: true },
    role: { type: String, required: true },
    packageOrStipend: { type: String, default: '' },
    rounds: [roundSchema],
    preparationTips: { type: String, default: '' },
    difficulty: { 
      type: String, 
      enum: ['easy', 'medium', 'hard'], 
      default: 'medium' 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Experience', experienceSchema);
