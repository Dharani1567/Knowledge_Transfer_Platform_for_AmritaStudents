const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['notes', 'assignment', 'exam_paper'], 
      required: true 
    },
    courseCode: { type: String, required: true },
    description: { type: String, default: '' },
    fileUrl: { type: String, required: true },
    uploadedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'approved' // Automatically approved for easy prototype testing
    },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        score: { type: Number, min: 1, max: 5 }
      }
    ],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
