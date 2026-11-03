<template>
  <div class="app">
    <header class="top-nav">
      <div class="nav-container">
        <div class="logo">
          <h1>{{ t('nav.companyName') }}</h1>
          <span class="subtitle">{{ t('nav.subtitle') }}</span>
        </div>
        <nav class="nav-tabs">
          <router-link to="/" :class="{ active: $route.path === '/' }">
            {{ t('nav.overview') }}
          </router-link>
          <router-link to="/inventory" :class="{ active: $route.path === '/inventory' }">
            {{ t('nav.inventory') }}
          </router-link>
          <router-link to="/orders" :class="{ active: $route.path === '/orders' }">
            {{ t('nav.orders') }}
          </router-link>
          <router-link to="/spending" :class="{ active: $route.path === '/spending' }">
            {{ t('nav.finance') }}
          </router-link>
          <router-link to="/demand" :class="{ active: $route.path === '/demand' }">
            {{ t('nav.demandForecast') }}
          </router-link>
          <router-link to="/reports" :class="{ active: $route.path === '/reports' }">
            Reports
          </router-link>
        </nav>
        <ThemeToggle />
        <LanguageSwitcher />
        <ProfileMenu
          @show-profile-details="showProfileDetails = true"
          @show-tasks="showTasks = true"
        />
      </div>
    </header>
    <FilterBar />
    <main class="main-content">
      <router-view />
    </main>

    <ProfileDetailsModal
      :is-open="showProfileDetails"
      @close="showProfileDetails = false"
    />

    <TasksModal
      :is-open="showTasks"
      :tasks="tasks"
      @close="showTasks = false"
      @add-task="addTask"
      @delete-task="deleteTask"
      @toggle-task="toggleTask"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { api } from './api'
import { useAuth } from './composables/useAuth'
import { useI18n } from './composables/useI18n'
import FilterBar from './components/FilterBar.vue'
import ProfileMenu from './components/ProfileMenu.vue'
import ProfileDetailsModal from './components/ProfileDetailsModal.vue'
import TasksModal from './components/TasksModal.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import ThemeToggle from './components/ThemeToggle.vue'

export default {
  name: 'App',
  components: {
    FilterBar,
    ProfileMenu,
    ProfileDetailsModal,
    TasksModal,
    LanguageSwitcher,
    ThemeToggle
  },
  setup() {
    const { currentUser } = useAuth()
    const { t } = useI18n()
    const showProfileDetails = ref(false)
    const showTasks = ref(false)
    const apiTasks = ref([])

    // Merge mock tasks from currentUser with API tasks
    const tasks = computed(() => {
      return [...currentUser.value.tasks, ...apiTasks.value]
    })

    const loadTasks = async () => {
      try {
        apiTasks.value = await api.getTasks()
      } catch (err) {
        console.error('Failed to load tasks:', err)
      }
    }

    const addTask = async (taskData) => {
      try {
        const newTask = await api.createTask(taskData)
        // Add new task to the beginning of the array
        apiTasks.value.unshift(newTask)
      } catch (err) {
        console.error('Failed to add task:', err)
      }
    }

    const deleteTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const isMockTask = currentUser.value.tasks.some(t => t.id === taskId)

        if (isMockTask) {
          // Remove from mock tasks
          const index = currentUser.value.tasks.findIndex(t => t.id === taskId)
          if (index !== -1) {
            currentUser.value.tasks.splice(index, 1)
          }
        } else {
          // Remove from API tasks
          await api.deleteTask(taskId)
          apiTasks.value = apiTasks.value.filter(t => t.id !== taskId)
        }
      } catch (err) {
        console.error('Failed to delete task:', err)
      }
    }

    const toggleTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const mockTask = currentUser.value.tasks.find(t => t.id === taskId)

        if (mockTask) {
          // Toggle mock task status
          mockTask.status = mockTask.status === 'pending' ? 'completed' : 'pending'
        } else {
          // Toggle API task
          const updatedTask = await api.toggleTask(taskId)
          const index = apiTasks.value.findIndex(t => t.id === taskId)
          if (index !== -1) {
            apiTasks.value[index] = updatedTask
          }
        }
      } catch (err) {
        console.error('Failed to toggle task:', err)
      }
    }

    onMounted(loadTasks)

    return {
      t,
      showProfileDetails,
      showTasks,
      tasks,
      addTask,
      deleteTask,
      toggleTask
    }
  }
}
</script>

<style>
/* Theme tokens. data-theme is set on <html> by the inline script in index.html and
   useTheme.js. --c-* are status/tint colors whose light value is the original hex. */
:root {
  color-scheme: light;
  --surface: #ffffff; --surface-2: #f1f5f9; --bg-subtle: #f8fafc;
  --border: #e2e8f0; --border-strong: #cbd5e1;
  --text-strong: #0f172a; --text: #1e293b; --text-2: #475569; --text-muted: #64748b; --text-faint: #94a3b8;
  --accent-strong: #0f172a;
  --c-fecaca: #fecaca; --c-fef2f2: #fef2f2; --c-fee2e2: #fee2e2; --c-991b1b: #991b1b;
  --c-d1fae5: #d1fae5; --c-dcfce7: #dcfce7; --c-f0fdf4: #f0fdf4; --c-a7f3d0: #a7f3d0; --c-86efac: #86efac; --c-065f46: #065f46; --c-166534: #166534;
  --c-dbeafe: #dbeafe; --c-eff6ff: #eff6ff; --c-bfdbfe: #bfdbfe; --c-93c5fd: #93c5fd; --c-1e40af: #1e40af;
  --c-fffbeb: #fffbeb; --c-fed7aa: #fed7aa; --c-fef3c7: #fef3c7; --c-fcd34d: #fcd34d; --c-92400e: #92400e;
  --c-f5f3ff: #f5f3ff; --c-e0e7ff: #e0e7ff; --c-c4b5fd: #c4b5fd; --c-3730a3: #3730a3;
  --c-2563eb: #2563eb; --c-dc2626: #dc2626; --c-059669: #059669; --c-d97706: #d97706; --c-ea580c: #ea580c;
}

:root[data-theme='dark'] {
  color-scheme: dark; /* native inputs, selects and scrollbars follow the theme */
  --surface: #1e293b; --surface-2: #334155; --bg-subtle: #0f172a;
  --border: #334155; --border-strong: #475569;
  --text-strong: #f8fafc; --text: #e2e8f0; --text-2: #cbd5e1; --text-muted: #94a3b8; --text-faint: #64748b;
  --accent-strong: #475569; /* used as a button/bar background that carries white text */
  /* Light tints become dark tints; tint-colored text becomes light so status stays legible */
  --c-fecaca: #7f1d1d; --c-fef2f2: #3b1a1f; --c-fee2e2: #4c1d22; --c-991b1b: #fca5a5;
  --c-d1fae5: #064e3b; --c-dcfce7: #14532d; --c-f0fdf4: #12301f; --c-a7f3d0: #047857; --c-86efac: #166534; --c-065f46: #6ee7b7; --c-166534: #86efac;
  --c-dbeafe: #1e3a8a; --c-eff6ff: #172554; --c-bfdbfe: #1e40af; --c-93c5fd: #2563eb; --c-1e40af: #93c5fd;
  --c-fffbeb: #3a2a0c; --c-fed7aa: #7c2d12; --c-fef3c7: #78350f; --c-fcd34d: #b45309; --c-92400e: #fcd34d;
  --c-f5f3ff: #2e1f4f; --c-e0e7ff: #312e81; --c-c4b5fd: #5b21b6; --c-3730a3: #c7d2fe;
  --c-2563eb: #60a5fa; --c-dc2626: #f87171; --c-059669: #34d399; --c-d97706: #fbbf24; --c-ea580c: #fb923c;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: var(--bg-subtle);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.top-nav {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  height: 70px;
}

.nav-container > .nav-tabs {
  margin-left: auto;
  margin-right: 1rem;
}

.nav-container > .language-switcher {
  margin-right: 1rem;
}

.logo {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

.logo h1 {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--text-strong);
  letter-spacing: -0.025em;
}

.subtitle {
  font-size: 0.813rem;
  color: var(--text-muted);
  font-weight: 400;
  padding-left: 0.75rem;
  border-left: 1px solid var(--border);
}

.nav-tabs {
  display: flex;
  gap: 0.25rem;
}

.nav-tabs a {
  padding: 0.625rem 1.25rem;
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.938rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-tabs a:hover {
  color: var(--text-strong);
  background: var(--surface-2);
}

.nav-tabs a.active {
  color: var(--c-2563eb);
  background: var(--c-eff6ff);
}

.nav-tabs a.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--c-2563eb);
}

.main-content {
  flex: 1;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem 2rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-strong);
  margin-bottom: 0.375rem;
  letter-spacing: -0.025em;
}

.page-header p {
  color: var(--text-muted);
  font-size: 0.938rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--surface);
  padding: 1.25rem;
  border-radius: 10px;
  border: 1px solid var(--border);
  transition: all 0.2s ease;
}

.stat-card:hover {
  border-color: var(--border-strong);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.stat-label {
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.625rem;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-strong);
  letter-spacing: -0.025em;
}

.stat-card.warning .stat-value {
  color: var(--c-ea580c);
}

.stat-card.success .stat-value {
  color: var(--c-059669);
}

.stat-card.danger .stat-value {
  color: var(--c-dc2626);
}

.stat-card.info .stat-value {
  color: var(--c-2563eb);
}

.card {
  background: var(--surface);
  border-radius: 10px;
  padding: 1.25rem;
  border: 1px solid var(--border);
  margin-bottom: 1.25rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid var(--border);
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-strong);
  letter-spacing: -0.025em;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: var(--bg-subtle);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

th {
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  color: var(--text-2);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  padding: 0.5rem 0.75rem;
  border-top: 1px solid var(--surface-2);
  color: var(--text-2);
  font-size: 0.875rem;
}

tbody tr {
  transition: background-color 0.15s ease;
}

tbody tr:hover {
  background: var(--bg-subtle);
}

.badge {
  display: inline-block;
  padding: 0.313rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge.success {
  background: var(--c-d1fae5);
  color: var(--c-065f46);
}

.badge.warning {
  background: var(--c-fed7aa);
  color: var(--c-92400e);
}

.badge.danger {
  background: var(--c-fecaca);
  color: var(--c-991b1b);
}

.badge.info {
  background: var(--c-dbeafe);
  color: var(--c-1e40af);
}

.badge.increasing {
  background: var(--c-d1fae5);
  color: var(--c-065f46);
}

.badge.decreasing {
  background: var(--c-fecaca);
  color: var(--c-991b1b);
}

.badge.stable {
  background: var(--c-e0e7ff);
  color: var(--c-3730a3);
}

.badge.high {
  background: var(--c-fecaca);
  color: var(--c-991b1b);
}

.badge.medium {
  background: var(--c-fed7aa);
  color: var(--c-92400e);
}

.badge.low {
  background: var(--c-dbeafe);
  color: var(--c-1e40af);
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
  font-size: 0.938rem;
}

.error {
  background: var(--c-fef2f2);
  border: 1px solid var(--c-fecaca);
  color: var(--c-991b1b);
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 0.938rem;
}
</style>
