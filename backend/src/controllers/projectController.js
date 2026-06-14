const { Project, Comment } = require('../models');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  const { search } = req.query;

  try {
    let projects = await Project.find().populate('uploadedBy', 'name email role department');

    if (search) {
      const searchTerm = search.toLowerCase();
      projects = projects.filter(proj => 
        proj.title.toLowerCase().includes(searchTerm) ||
        proj.description.toLowerCase().includes(searchTerm) ||
        proj.teamMembers.some(member => member.toLowerCase().includes(searchTerm))
      );
    }

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('uploadedBy', 'name email role department');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const comments = await Comment.find({ targetId: req.params.id }).populate('author', 'name email role');

    const projectObj = typeof project.toObject === 'function' ? project.toObject() : project;

    res.json({
      ...projectObj,
      comments: comments || []
    });
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new project showcase
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  const { title, description, githubLink, demoLink, teamMembers } = req.body;

  try {
    if (!title || !description) {
      return res.status(400).json({ message: 'Please provide title and description' });
    }

    const project = await Project.create({
      title,
      description,
      githubLink: githubLink || '',
      demoLink: demoLink || '',
      teamMembers: teamMembers || [],
      uploadedBy: req.user._id
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isCreator = project.uploadedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  deleteProject
};
