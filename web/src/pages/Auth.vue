<template>
  <div>
    <h2>Login</h2>
    <div style="display:flex; gap:.5rem; align-items:center; margin-bottom:1rem;">
      <input v-model="email" placeholder="Email" />
      <input v-model="password" placeholder="Password" type="password" />
      <button @click="login">Login</button>
    </div>

    <h2>Register</h2>
    <div style="display:flex; gap:.5rem; align-items:center;">
      <input v-model="name" placeholder="Name" />
      <input v-model="regEmail" placeholder="Email" />
      <input v-model="regPassword" placeholder="Password" type="password" />
      <button @click="register">Register</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api, { setAuthToken } from '../api'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const name = ref('')
const regEmail = ref('')
const regPassword = ref('')

async function login() {
  const { data } = await api.post('/auth/login', { email: email.value, password: password.value })
  setAuthToken(data.token)
  router.push('/')
}

async function register() {
  const { data } = await api.post('/auth/register', { name: name.value, email: regEmail.value, password: regPassword.value })
  setAuthToken(data.token)
  router.push('/')
}
</script>
