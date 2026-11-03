<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :aria-pressed="isDark"
    @click="toggleTheme"
  >
    <!-- Sun icon shown in dark mode (click to go light), moon in light mode -->
    <svg v-if="isDark" width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M4.3 15.7l1.4-1.4M14.3 5.7l1.4-1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <svg v-else width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M16.5 11.5A6.5 6.5 0 0 1 8.5 3.5a6.5 6.5 0 1 0 8 8Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>
    <span class="theme-label">{{ isDark ? 'Light' : 'Dark' }}</span>
  </button>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  margin-right: 0.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-2);
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background: var(--bg-subtle);
  border-color: var(--border-strong);
}
</style>
