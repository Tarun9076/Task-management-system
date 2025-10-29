import { createRouter, createWebHistory } from 'vue-router'
import Auth from './pages/Auth.vue'
import Dashboard from './pages/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/')
  } else if (to.name === 'Auth' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
