<template>
  <div class="app-container">
    <div v-if="!token" class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>📋 Task Manager</h1>
          <p>Organize your work, boost your productivity</p>
        </div>

        <div class="auth-form">
          <div class="form-group">
            <label>Email Address</label>
            <input v-model="email" placeholder="your@email.com" type="email" class="form-input" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input v-model="password" placeholder="Enter password" type="password" class="form-input" />
          </div>
          <button @click="login" class="btn btn-primary btn-full">Sign In</button>
          <button @click="showRegister = !showRegister" class="btn btn-secondary btn-full">
            {{ showRegister ? 'Back to Login' : 'Create New Account' }}
          </button>

          <div v-if="showRegister" class="register-form">
            <div class="form-group">
              <label>Full Name</label>
              <input v-model="regName" placeholder="Your name" class="form-input" />
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input v-model="regEmail" placeholder="your@email.com" type="email" class="form-input" />
            </div>
            <div class="form-group">
              <label>Password</label>
              <input v-model="regPassword" placeholder="Create password" type="password" class="form-input" />
            </div>
            <button @click="register" class="btn btn-success btn-full">Create Account</button>
          </div>

          <div v-if="error" class="error-message">⚠️ {{ error }}</div>
        </div>
      </div>
    </div>

    <div v-else class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-left">
          <h1>📋 Task Manager</h1>
        </div>
        <div class="header-right">
          <span class="user-info">{{ userEmail }}</span>
          <button @click="logout" class="btn btn-outline">Logout</button>
        </div>
      </header>

      <main class="dashboard-main">
        <section class="projects-section">
          <div class="section-header">
            <h2>📂 Projects</h2>
          </div>

          <div class="create-project">
            <input v-model="projectName" placeholder="New project name..." class="form-input" />
            <button @click="createProject" class="btn btn-primary">+ Create</button>
          </div>

          <div v-if="projects.length" class="projects-grid">
            <div v-for="p in projects" :key="p.id" class="project-card" @click="openProject(p)">
              <div class="project-icon">📁</div>
              <h3>{{ p.name }}</h3>
              <p class="task-count">{{ tasksInProject(p.id).length }} tasks</p>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>🎯 No projects yet. Create one to get started!</p>
          </div>
        </section>

        <section v-if="activeProject" class="tasks-section">
          <div class="section-header">
            <h2>📝 {{ activeProject.name }}</h2>
            <button @click="activeProject = null" class="btn btn-outline btn-small">Back</button>
          </div>

          <div class="create-task">
            <input v-model="taskTitle" placeholder="New task..." class="form-input" />
            <select v-model="taskStatus" class="form-select">
              <option value="todo">📋 Todo</option>
              <option value="in_progress">🔄 In Progress</option>
              <option value="done">✅ Done</option>
            </select>
            <button @click="createTask" class="btn btn-primary">+ Add Task</button>
          </div>

          <div class="tasks-board">
            <div class="task-column">
              <div class="column-header">
                <h3>📋 Todo</h3>
                <span class="count">{{ tasksBy('todo').length }}</span>
              </div>
              <div class="tasks-list">
                <div v-for="t in tasksBy('todo')" :key="t.id" class="task-card todo">
                  <div class="task-content">
                    <p>{{ t.title }}</p>
                  </div>
                  <button @click="deleteTask(t.id)" class="btn-delete">×</button>
                </div>
                <div v-if="!tasksBy('todo').length" class="empty-column">No tasks</div>
              </div>
            </div>

            <div class="task-column">
              <div class="column-header">
                <h3>🔄 In Progress</h3>
                <span class="count">{{ tasksBy('in_progress').length }}</span>
              </div>
              <div class="tasks-list">
                <div v-for="t in tasksBy('in_progress')" :key="t.id" class="task-card in-progress">
                  <div class="task-content">
                    <p>{{ t.title }}</p>
                  </div>
                  <button @click="deleteTask(t.id)" class="btn-delete">×</button>
                </div>
                <div v-if="!tasksBy('in_progress').length" class="empty-column">No tasks</div>
              </div>
            </div>

            <div class="task-column">
              <div class="column-header">
                <h3>✅ Done</h3>
                <span class="count">{{ tasksBy('done').length }}</span>
              </div>
              <div class="tasks-list">
                <div v-for="t in tasksBy('done')" :key="t.id" class="task-card done">
                  <div class="task-content">
                    <p>{{ t.title }}</p>
                  </div>
                  <button @click="deleteTask(t.id)" class="btn-delete">×</button>
                </div>
                <div v-if="!tasksBy('done').length" class="empty-column">No tasks</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../api'
import { socket } from '../socket'

const token = ref('')
const email = ref('')
const password = ref('')
const regName = ref('')
const regEmail = ref('')
const regPassword = ref('')
const showRegister = ref(false)
const error = ref('')

const projects = ref([])
const activeProject = ref(null)
const tasks = ref([])

const projectName = ref('')
const taskTitle = ref('')
const taskStatus = ref('todo')

const userEmail = computed(() => email.value)

function setAuth() {
  if (!token.value) return
  api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  localStorage.setItem('token', token.value)
}

async function login() {
  try {
    error.value = ''
    const { data } = await api.post('/auth/login', { email: email.value, password: password.value })
    token.value = data.token
    setAuth()
    loadProjects()
  } catch (e) {
    error.value = e.response?.data?.error || 'Login failed'
  }
}

async function register() {
  try {
    error.value = ''
    const { data } = await api.post('/auth/register', { name: regName.value, email: regEmail.value, password: regPassword.value })
    token.value = data.token
    email.value = regEmail.value
    regName.value = ''
    regEmail.value = ''
    regPassword.value = ''
    showRegister.value = false
    setAuth()
    loadProjects()
  } catch (e) {
    error.value = e.response?.data?.error || 'Registration failed'
  }
}

function logout() {
  token.value = ''
  email.value = ''
  localStorage.removeItem('token')
  delete api.defaults.headers.common['Authorization']
  projects.value = []
  activeProject.value = null
  tasks.value = []
}

async function loadProjects() {
  try {
    const { data } = await api.get('/projects')
    projects.value = data
  } catch (e) {
    error.value = 'Failed to load projects'
  }
}

async function createProject() {
  try {
    if (!projectName.value) return
    const { data } = await api.post('/projects', { name: projectName.value })
    projects.value.push(data)
    projectName.value = ''
    error.value = ''
  } catch (e) {
    error.value = 'Failed to create project'
  }
}

async function openProject(p) {
  try {
    activeProject.value = p
    socket.emit('join:project', p.id)
    const { data } = await api.get(`/projects/${p.id}/tasks`)
    tasks.value = data
    error.value = ''
  } catch (e) {
    error.value = 'Failed to load tasks'
  }
}

async function createTask() {
  try {
    if (!activeProject.value || !taskTitle.value) return
    const { data } = await api.post(`/projects/${activeProject.value.id}/tasks`, { title: taskTitle.value, status: taskStatus.value })
    tasks.value.push(data)
    taskTitle.value = ''
    error.value = ''
  } catch (e) {
    error.value = 'Failed to create task'
  }
}

async function deleteTask(taskId) {
  try {
    await api.delete(`/tasks/${taskId}`)
    tasks.value = tasks.value.filter(t => t.id !== taskId)
    error.value = ''
  } catch (e) {
    error.value = 'Failed to delete task'
  }
}

function tasksBy(s) {
  return tasks.value.filter(t => t.status === s)
}

function tasksInProject(projectId) {
  return tasks.value.filter(t => t.projectId === projectId)
}

onMounted(() => {
  const savedToken = localStorage.getItem('token')
  if (savedToken) {
    token.value = savedToken
    setAuth()
    loadProjects()
  }
  socket.on('task:created', t => {
    if (activeProject.value && t.projectId === activeProject.value.id) tasks.value.push(t)
  })
  socket.on('task:updated', t => {
    if (!activeProject.value || t.projectId !== activeProject.value.id) return
    const i = tasks.value.findIndex(x => x.id === t.id)
    if (i !== -1) tasks.value[i] = t
  })
})
</script>

<style scoped>
* {
  transition: all 0.3s ease;
}

.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1a3e 25%, #2d0a4e 50%, #1a1a3e 75%, #0a0e27 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
}

.app-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  pointer-events: none;
  z-index: 0;
}

.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.auth-card {
  background: linear-gradient(135deg, #1a1a3e 0%, #2d0a4e 50%, #1a1a3e 100%);
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  padding: 3rem;
  width: 100%;
  max-width: 420px;
  border: 2px solid #06dcff;
  backdrop-filter: blur(10px);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  font-size: 2.5rem;
  margin: 0;
  color: #06dcff;
  font-weight: 900;
}

.auth-header p {
  color: #06dcff;
  margin: 0.5rem 0 0;
  font-size: 0.95rem;
  font-weight: 500;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-input,
.form-select {
  padding: 0.75rem 1rem;
  border: 2px solid #475569;
  border-radius: 8px;
  font-size: 0.95rem;
  background: #0f172a;
  color: #e2e8f0;
  transition: all 0.3s ease;
}

.form-input::placeholder {
  color: #64748b;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #06b6d4;
  background: #1e293b;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.2);
}

.register-form {
  border-top: 2px solid #475569;
  padding-top: 1rem;
  margin-top: 0.5rem;
}

.error-message {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.btn-primary {
  background: #06dcff;
  color: #0a0e27;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-weight: 700;
}

.btn-primary:hover {
  background: #00d9f5;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.btn-secondary {
  background: #b8ff00;
  color: #0a0e27;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-weight: 700;
}

.btn-secondary:hover {
  background: #a3e600;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.btn-success {
  background: #ff6600;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-weight: 700;
}

.btn-success:hover {
  background: #ff5500;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.btn-outline {
  background: transparent;
  color: #06dcff;
  border: 2px solid #06dcff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.btn-outline:hover {
  background: rgba(6, 220, 255, 0.1);
  border-color: #06dcff;
  color: #06dcff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-full {
  width: 100%;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.dashboard-container {
  min-height: 100vh;
  padding: 2rem;
}

.dashboard-header {
  background: linear-gradient(135deg, #1a1a3e 0%, #2d0a4e 100%);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  border: 2px solid #06dcff;
  position: relative;
  z-index: 1;
}

.dashboard-header h1 {
  margin: 0;
  color: #06dcff;
  font-size: 1.8rem;
  font-weight: 900;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-info {
  color: #cbd5e1;
  font-weight: 500;
  font-size: 0.95rem;
}

.dashboard-main {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  color: #06dcff;
  font-size: 1.5rem;
  font-weight: 900;
}

.projects-section {
  margin-bottom: 3rem;
}

.create-project {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.create-project input {
  flex: 1;
  background: #1e293b;
  border: 2px solid #475569;
  color: #e2e8f0;
}

.create-project input::placeholder {
  color: #64748b;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.project-card {
  background: linear-gradient(135deg, #1a1a3e 0%, #2d0a4e 100%);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  border: 2px solid #06dcff;
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  border-color: #06dcff;
}

.project-card:hover::before {
  opacity: 0;
}

.project-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.project-card h3 {
  margin: 0.5rem 0;
  color: #06dcff;
  font-size: 1.1rem;
  font-weight: 700;
  position: relative;
  z-index: 1;
}

.task-count {
  margin: 0.5rem 0 0;
  color: #b8ff00;
  font-size: 0.9rem;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.empty-state {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%);
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  color: #cbd5e1;
  font-size: 1.1rem;
  border: 2px dashed rgba(6, 182, 212, 0.3);
}

.tasks-section {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(34, 197, 226, 0.2);
}

.create-task {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.create-task input,
.create-task select {
  background: #0f172a;
  border: 2px solid #475569;
  color: #e2e8f0;
}

.create-task input::placeholder {
  color: #64748b;
}

.tasks-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.task-column {
  background: #0f172a;
  border-radius: 14px;
  padding: 1rem;
  border: 1px solid #475569;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #475569;
}

.column-header h3 {
  margin: 0;
  color: #cbd5e1;
  font-size: 1rem;
  font-weight: 600;
}

.count {
  background: #06dcff;
  color: #0a0e27;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 900;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 100px;
}

.task-card {
  background: linear-gradient(135deg, #1a1a3e 0%, #2d0a4e 100%);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border-left: 5px solid #ddd;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  border-color: rgba(6, 220, 255, 0.3);
  transform: translateX(2px);
}

.task-card.todo {
  border-left-color: #ff6600;
}

.task-card.in-progress {
  border-left-color: #06dcff;
}

.task-card.done {
  border-left-color: #b8ff00;
  opacity: 0.9;
}

.task-card.done .task-content p {
  text-decoration: line-through;
  color: #64748b;
}

.task-content {
  flex: 1;
}

.task-content p {
  margin: 0;
  color: #e2e8f0;
  font-weight: 500;
}

.btn-delete {
  background: #ef4444;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
}

.btn-delete:hover {
  background: #dc2626;
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);
}

.empty-column {
  color: #64748b;
  text-align: center;
  padding: 1.5rem;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-right {
    width: 100%;
    justify-content: center;
    flex-direction: column;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .tasks-board {
    grid-template-columns: 1fr;
  }

  .create-project,
  .create-task {
    flex-direction: column;
  }

  .auth-card {
    padding: 2rem;
  }
}
</style>
