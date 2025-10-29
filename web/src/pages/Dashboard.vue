<template>
  <div class="app-container">
    <div class="dashboard-container">
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
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select v-model="taskPriority" class="form-select">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
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
                <div v-for="t in tasksBy('todo')" :key="t.id" :class="['task-card', 'todo', t.priority]">
                  <template v-if="editingTask && editingTask.id === t.id">
                    <div class="edit-task-form">
                      <input v-model="editingTask.title" class="form-input" />
                      <select v-model="editingTask.status" class="form-select">
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      <select v-model="editingTask.priority" class="form-select">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <button @click="saveTaskEdit" class="btn btn-primary">Save</button>
                      <button @click="cancelTaskEdit" class="btn btn-outline">Cancel</button>
                    </div>
                  </template>
                  <template v-else>
                    <div class="task-content">
                      <h3>{{ t.title }}</h3>
                      <p>Priority: {{ t.priority }}</p>
                    </div>
                    <div class="task-actions">
                      <button @click="editTask(t)" class="btn-edit">✏️</button>
                      <button @click="deleteTask(t.id)" class="btn-delete">×</button>
                    </div>
                  </template>
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
                <div v-for="t in tasksBy('in_progress')" :key="t.id" :class="['task-card', 'in-progress', t.priority]">
                  <template v-if="editingTask && editingTask.id === t.id">
                    <div class="edit-task-form">
                      <input v-model="editingTask.title" class="form-input" />
                      <select v-model="editingTask.status" class="form-select">
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      <select v-model="editingTask.priority" class="form-select">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <button @click="saveTaskEdit" class="btn btn-primary">Save</button>
                      <button @click="cancelTaskEdit" class="btn btn-outline">Cancel</button>
                    </div>
                  </template>
                  <template v-else>
                    <div class="task-content">
                      <h3>{{ t.title }}</h3>
                      <p>Priority: {{ t.priority }}</p>
                    </div>
                    <div class="task-actions">
                      <button @click="editTask(t)" class="btn-edit">✏️</button>
                      <button @click="deleteTask(t.id)" class="btn-delete">×</button>
                    </div>
                  </template>
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
                <div v-for="t in tasksBy('done')" :key="t.id" :class="['task-card', 'done', t.priority]">
                  <template v-if="editingTask && editingTask.id === t.id">
                    <div class="edit-task-form">
                      <input v-model="editingTask.title" class="form-input" />
                      <select v-model="editingTask.status" class="form-select">
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      <select v-model="editingTask.priority" class="form-select">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <button @click="saveTaskEdit" class="btn btn-primary">Save</button>
                      <button @click="cancelTaskEdit" class="btn btn-outline">Cancel</button>
                    </div>
                  </template>
                  <template v-else>
                    <div class="task-content">
                      <h3>{{ t.title }}</h3>
                      <p>Priority: {{ t.priority }}</p>
                    </div>
                    <div class="task-actions">
                      <button @click="editTask(t)" class="btn-edit">✏️</button>
                      <button @click="deleteTask(t.id)" class="btn-delete">×</button>
                    </div>
                  </template>
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
import { useRouter } from 'vue-router'

const router = useRouter()

const token = ref('')
const userEmail = ref('')

const projects = ref([])
const activeProject = ref(null)
const tasks = ref([])

const projectName = ref('')
const taskTitle = ref('')
const taskStatus = ref('todo')
const taskPriority = ref('medium')

const editingTask = ref(null)

const editTask = (task) => {
  editingTask.value = { ...task };
};

const cancelTaskEdit = () => {
  editingTask.value = null;
};

const saveTaskEdit = async () => {
  if (editingTask.value) {
    try {
      await api.patch(`/tasks/${editingTask.value.id}`, editingTask.value)
      const index = tasks.value.findIndex(t => t.id === editingTask.value.id)
      if (index !== -1) {
        tasks.value[index] = { ...editingTask.value }
      }
      editingTask.value = null
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }
}

function setAuth() {
  if (!token.value) return
  api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  localStorage.setItem('token', token.value)
}

function logout() {
  token.value = ''
  userEmail.value = ''
  localStorage.removeItem('token')
  delete api.defaults.headers.common['Authorization']
  projects.value = []
  activeProject.value = null
  tasks.value = []
  router.push('/')
}

async function loadProjects() {
  try {
    const { data } = await api.get('/projects')
    projects.value = data
  } catch (e) {
    console.error('Failed to load projects', e)
    // Handle error, e.g., redirect to login if token is invalid
    if (e.response && e.response.status === 401) {
      logout()
    }
  }
}

async function createProject() {
  try {
    if (!projectName.value) return
    const { data } = await api.post('/projects', { name: projectName.value })
    projects.value.push(data)
    projectName.value = ''
  } catch (e) {
    console.error('Failed to create project', e)
  }
}

async function openProject(p) {
  try {
    activeProject.value = p
    socket.emit('join:project', p.id)
    const { data } = await api.get(`/projects/${p.id}/tasks`)
    tasks.value = data
  } catch (e) {
    console.error('Failed to load tasks', e)
  }
}

async function createTask() {
  if (!activeProject.value || !taskTitle.value) return
  try {
    await api.post(`/projects/${activeProject.value.id}/tasks`, {
      title: taskTitle.value,
      status: taskStatus.value,
      priority: taskPriority.value
    })
    // rely on socket event to append task to list
    taskTitle.value = ''
    taskStatus.value = 'todo'
    taskPriority.value = 'medium'
  } catch (e) {
    console.error('Failed to create task', e)
  }
}

async function deleteTask(taskId) {
  try {
    await api.delete(`/tasks/${taskId}`)
    tasks.value = tasks.value.filter(t => t.id !== taskId)
  } catch (e) {
    console.error('Failed to delete task', e)
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
    // Decode token to get user email (assuming JWT for now)
    try {
      const base64Url = savedToken.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      userEmail.value = JSON.parse(jsonPayload).email
    } catch (e) {
      console.error("Failed to decode token", e)
      logout()
    }
    loadProjects()
  }

  socket.on('task:created', t => {
    if (!(activeProject.value && t.projectId === activeProject.value.id)) return
    const exists = tasks.value.some(task => task.id === t.id)
    if (!exists) tasks.value.push(t)
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

.task-card.low {
  border-left: 5px solid #4CAF50;
}

.task-card.medium {
  border-left: 5px solid #FFC107;
}

.task-card.high {
  border-left: 5px solid #F44336;
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

.edit-task-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.edit-task-form .form-input,
.edit-task-form .form-select {
  padding: 0.5rem;
  border: 2px solid #475569;
  border-radius: 4px;
  width: 100%;
  background: #0f172a;
  color: #e2e8f0;
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
}
.task-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit {
  background: #3b82f6;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background-color 0.2s;
  padding: 0;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
}

.btn-edit:hover {
  background: #2563eb;
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.4);
}

.empty-column {
  color: #64748b;
  text-align: center;
  padding: 1.5rem;
  font-size: 0.9rem;
}

.form-input,
.form-select {
  padding: 0.5rem;
  border: 2px solid #475569;
  border-radius: 4px;
  width: 100%;
  background: #0f172a;
  color: #e2e8f0;
}

.edit-task-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.edit-task-form .form-input,
.edit-task-form .form-select {
  padding: 0.5rem;
  border: 2px solid #475569;
  border-radius: 4px;
  width: 100%;
  background: #0f172a;
  color: #e2e8f0;
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
}
</style>
