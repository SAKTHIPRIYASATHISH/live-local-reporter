const upload = require('../utils/cloudinary');
const router = require('express').Router();
const Issue = require('../models/Issue');
const verifyToken = require('../middleware/verifyToken');

// Upload image (must be before /:id route)
router.post('/upload', verifyToken, upload.single('image'), (req, res) => {
  console.log('File info:', req.file);
  if (!req.file) return res.status(400).json({ message: 'No file received' });
  res.json({ url: req.file.path });
});

// Get all issues
router.get('/', async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single issue
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('createdBy', 'name');
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create issue (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, category, location, images } = req.body;
    const issue = await Issue.create({
      title, description, category, location, images,
      createdBy: req.user.id
    });
    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upvote toggle
router.patch('/:id/upvote', verifyToken, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    const userId = req.user.id;
    const alreadyUpvoted = issue.upvotes.includes(userId);

    if (alreadyUpvoted) {
      issue.upvotes = issue.upvotes.filter(id => id.toString() !== userId);
    } else {
      issue.upvotes.push(userId);
    }

    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update status (admin only)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Admins only' });

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete issue (only creator can delete)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    if (issue.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await Issue.findByIdAndDelete(req.params.id);
    res.json({ message: 'Issue deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;