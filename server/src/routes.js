const express = require('express');
const { Project, Task, Comment } = require('./models');
const { authMiddleware, register, login } = require('./auth');

const router = express.Router();

router.get('/health', (req, res) => res.json({ ok: true }));

router.post('/auth/register', register);
router.post('/auth/login', login);

router.get('/projects', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.findAll({ where: { ownerId: req.userId } });
    res.json(projects);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/projects', authMiddleware, async (req, res) => {
  try {
    const project = await Project.create({ name: req.body.name, description: req.body.description, ownerId: req.userId });
    req.app.get('io').to(project.id).emit('project:created', project);
    res.status(201).json(project);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/projects/:projectId/tasks', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.ownerId !== req.userId) return res.status(403).json({ error: 'Unauthorized' });
    const tasks = await Task.findAll({ where: { projectId: req.params.projectId } });
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/projects/:projectId/tasks', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.ownerId !== req.userId) return res.status(403).json({ error: 'Unauthorized' });
    const task = await Task.create({
      projectId: req.params.projectId,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      assigneeId: req.body.assigneeId
    });
    req.app.get('io').to(req.params.projectId).emit('task:created', task);
    res.status(201).json(task);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/tasks/:taskId', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    const project = await Project.findByPk(task.projectId);
    if (project.ownerId !== req.userId) return res.status(403).json({ error: 'Unauthorized' });
    await task.update(req.body);
    req.app.get('io').to(task.projectId).emit('task:updated', task);
    res.json(task);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/tasks/:taskId', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    const project = await Project.findByPk(task.projectId);
    if (project.ownerId !== req.userId) return res.status(403).json({ error: 'Unauthorized' });
    await task.destroy();
    req.app.get('io').to(task.projectId).emit('task:deleted', task.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/tasks/:taskId/comments', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    const c = await Comment.create({ taskId: req.params.taskId, userId: req.userId, body: req.body.body });
    req.app.get('io').to(task.projectId).emit('comment:created', c);
    res.status(201).json(c);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;