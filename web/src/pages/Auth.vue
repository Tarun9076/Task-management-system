<template>
  <div class="auth-container">
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../api'
import { useRouter } from 'vue-router'

const router = useRouter()

const token = ref('')
const email = ref('')
const password = ref('')
const regName = ref('')
const regEmail = ref('')
const regPassword = ref('')
const showRegister = ref(false)
const error = ref('')

const userEmail = computed(() => email.value)

function setAuth() {
  if (!token.value) return
  api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  localStorage.setItem('token', token.value)
  router.push('/dashboard')
}

async function login() {
  try {
    error.value = ''
    const { data } = await api.post('/auth/login', { email: email.value, password: password.value })
    token.value = data.token
    setAuth()
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
  } catch (e) {
    error.value = e.response?.data?.error || 'Registration failed'
  }
}

onMounted(() => {
  const savedToken = localStorage.getItem('token')
  if (savedToken) {
    token.value = savedToken
    setAuth()
  }
})
</script>

<style scoped>
* {
  transition: all 0.3s ease;
}

.auth-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1a3e 25%, #2d0a4e 50%, #1a1a3e 75%, #0a0e27 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
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

.btn-full {
  width: 100%;
}

@media (max-width: 768px) {
  .auth-card {
    padding: 2rem;
  }
}
</style>
