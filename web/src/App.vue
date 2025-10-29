<template>
  <router-view />
</template>

<script setup>
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f5f5;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  min-height: 100vh;
}

/* ===== Modern Theme Variables and Base Components ===== */
:root {
  --color-primary: #06dcff;
  --color-secondary: #b8ff00;
  --color-danger: #ef4444;
  --color-bg: #f5f7fb;
  --color-dark: #0a0e27;
  --color-gray: #64748b;
  --radius: 8px;
  --transition: 0.3s ease;
}

body {
  background: var(--color-bg);
  color: var(--color-dark);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: var(--radius);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform var(--transition), box-shadow var(--transition), background var(--transition);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-dark);
}

.btn-primary:hover {
  background: #00d9f5;
}

.btn-secondary {
  background: var(--color-secondary);
  color: var(--color-dark);
}

.btn-secondary:hover {
  background: #a3e600;
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
}

.btn-outline:hover {
  background: var(--color-primary);
  color: var(--color-dark);
}

.btn-danger {
  background: var(--color-danger);
  color: #fff;
}

.btn-danger:hover {
  background: #dc2626;
}

/* Form Inputs */
.form-input,
.form-select {
  padding: 0.65rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: var(--radius);
  background: #fff;
  color: var(--color-dark);
  font-size: 0.95rem;
  transition: border var(--transition), box-shadow var(--transition);
}

.form-input::placeholder {
  color: var(--color-gray);
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(6, 220, 255, 0.25);
}

/* Card Utility */
.card {
  background: #fff;
  border-radius: var(--radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.25rem;
}
</style>
