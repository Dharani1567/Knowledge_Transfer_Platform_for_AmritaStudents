const mongoose = require('mongoose');

const guidanceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    category: { 
      type: String, 
      enum: ['first_year', 'placement_prep', 'general_advice'], 
      default: 'general_advice' 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Guidance', guidanceSchema);
