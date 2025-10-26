const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');
const crypto = require('crypto');

const generateId = () => crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');

const User = sequelize.define('User', {
  id: { type: DataTypes.STRING, defaultValue: generateId, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false }
});

const Project = sequelize.define('Project', {
  id: { type: DataTypes.STRING, defaultValue: generateId, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT }
});

const Task = sequelize.define('Task', {
  id: { type: DataTypes.STRING, defaultValue: generateId, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'todo' },
  priority: { type: DataTypes.STRING, defaultValue: 'medium' },
  dueDate: { type: DataTypes.DATE }
});

const Comment = sequelize.define('Comment', {
  id: { type: DataTypes.STRING, defaultValue: generateId, primaryKey: true },
  body: { type: DataTypes.TEXT, allowNull: false }
});

User.hasMany(Project, { foreignKey: 'ownerId' });
Project.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

Project.hasMany(Task, { foreignKey: 'projectId' });
Task.belongsTo(Project, { foreignKey: 'projectId' });

User.hasMany(Task, { foreignKey: 'assigneeId' });
Task.belongsTo(User, { as: 'assignee', foreignKey: 'assigneeId' });

Task.hasMany(Comment, { foreignKey: 'taskId' });
Comment.belongsTo(Task, { foreignKey: 'taskId' });

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { as: 'author', foreignKey: 'userId' });

module.exports = { sequelize, User, Project, Task, Comment };