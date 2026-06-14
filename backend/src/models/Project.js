const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    githubLink: { type: String, default: '' },
    demoLink: { type: String, default: '' },
    teamMembers: [{ type: String }],
    uploadedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
