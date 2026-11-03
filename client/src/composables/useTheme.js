import { ref, computed } from 'vue'

const STORAGE_KEY = 'theme'

// Shared module-level state so every caller sees the same theme.
// index.html has already set data-theme before Vue mounts (avoids a flash of the
// wrong theme), so read the initial value from the DOM instead of recomputing it.
const theme = ref(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

const applyTheme = (value) => {
  theme.value = value
  document.documentElement.dataset.theme = value
}

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark')

  const toggleTheme = () => {
    const next = isDark.value ? 'light' : 'dark'
    applyTheme(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch (err) {
      // Storage can be unavailable (private mode); the toggle still works for this session
      console.warn('Could not persist theme:', err)
    }
  }

  return { theme, isDark, toggleTheme }
}
