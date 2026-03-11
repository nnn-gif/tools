<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  Play, 
  Pause, 
  Square as Stop, 
  Terminal, 
  Clock, 
  Activity,
  LogOut,
  RefreshCw,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-vue-next'

interface Agent {
  id: string
  name: string
  status: 'running' | 'stopped' | 'error' | 'idle'
  type: string
  lastActive: string
  tasksCompleted: number
  cpuUsage: number
  memoryUsage: number
  description: string
  llmProvider: string
  skills: string[]
}

interface Task {
  id: string
  title: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  duration?: number
  result?: string
}

const router = useRouter()
const route = useRoute()
const agentId = route.params.agentId as string

const agent = ref<Agent | null>(null)
const tasks = ref<Task[]>([])
const logs = ref<string[]>([])
const socket = ref<WebSocket | null>(null)
const isConnected = ref(false)
const showLogs = ref(true)
const showTasks = ref(true)
const autoScrollLogs = ref(true)

// Control actions
const isControlLoading = ref(false)

const connectWebSocket = () => {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  socket.value = new WebSocket(`${wsProtocol}//localhost:8080/ws/agent/${agentId}`)
  
  socket.value.onopen = () => {
    isConnected.value = true
    console.log('WebSocket connected for agent', agentId)
  }
  
  socket.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    handleWebSocketMessage(data)
  }
  
  socket.value.onerror = (error) => {
    console.error('WebSocket error:', error)
    isConnected.value = false
  }
  
  socket.value.onclose = () => {
    isConnected.value = false
    setTimeout(connectWebSocket, 3000)
  }
}

const handleWebSocketMessage = (data: any) => {
  switch(data.type) {
    case 'agent_updated':
      agent.value = data.payload
      break
    case 'log_added':
      logs.value.push(`[${new Date().toLocaleTimeString()}] ${data.message}`)
      if (autoScrollLogs.value && logs.value.length > 100) {
        logs.value.shift()
      }
      break
    case 'task_updated':
      const taskIndex = tasks.value.findIndex(t => t.id === data.taskId)
      if (taskIndex !== -1) {
        tasks.value[taskIndex] = { ...tasks.value[taskIndex], ...data.update }
      } else {
        tasks.value.unshift(data.task as Task)
      }
      break
  }
}

const getStatusColor = (status: Agent['status']) => {
  switch(status) {
    case 'running': return 'bg-green-500'
    case 'stopped': return 'bg-gray-500'
    case 'error': return 'bg-red-500'
    case 'idle': return 'bg-yellow-500'
    default: return 'bg-gray-500'
  }
}

const getStatusBadgeColor = (status: Agent['status']) => {
  switch(status) {
    case 'running': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'stopped': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'idle': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getTaskStatusColor = (status: Task['status']) => {
  switch(status) {
    case 'pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'running': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

const formatDuration = (seconds?: number) => {
  if (!seconds) return '-'
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`
  return `${Math.round(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`
}

const loadAgentData = async () => {
  try {
    const response = await fetch(`/api/agents/${agentId}`)
    if (response.ok) {
      agent.value = await response.json()
    } else {
      // Fallback to simulated data
      simulateAgentData()
    }
  } catch (error) {
    console.error('Failed to load agent:', error)
    simulateAgentData()
  }
}

const loadTasks = async () => {
  try {
    const response = await fetch(`/api/agents/${agentId}/tasks`)
    if (response.ok) {
      tasks.value = await response.json()
    } else {
      // Fallback to simulated data
      simulateTaskData()
    }
  } catch (error) {
    console.error('Failed to load tasks:', error)
    simulateTaskData()
  }
}

const simulateAgentData = () => {
  agent.value = {
    id: agentId,
    name: 'Content Writer Agent',
    status: 'running',
    type: 'content',
    lastActive: new Date().toISOString(),
    tasksCompleted: 42,
    cpuUsage: 35,
    memoryUsage: 128,
    description: 'Specializes in creating high-quality blog posts and articles optimized for SEO.',
    llmProvider: 'OpenAI',
    skills: ['content-writing', 'seo-optimization', 'research']
  }
}

const simulateTaskData = () => {
  tasks.value = [
    { id: '1', title: 'Write blog post about AI agents', status: 'completed', createdAt: new Date(Date.now() - 3600000).toISOString(), completedAt: new Date(Date.now() - 1800000).toISOString(), duration: 1800, result: 'Blog post published successfully' },
    { id: '2', title: 'Research competitor analysis', status: 'running', createdAt: new Date(Date.now() - 900000).toISOString(), duration: 900 },
    { id: '3', title: 'Update documentation', status: 'pending', createdAt: new Date().toISOString() },
    { id: '4', title: 'Generate SEO keywords', status: 'failed', createdAt: new Date(Date.now() - 7200000).toISOString(), completedAt: new Date(Date.now() - 6300000).toISOString(), duration: 900000, result: 'API rate limit exceeded' },
  ]
}

const loadLogs = async () => {
  try {
    const response = await fetch(`/api/agents/${agentId}/logs?limit=100`)
    if (response.ok) {
      logs.value = await response.json()
    } else {
      // Fallback to simulated data
      simulateLogs()
    }
  } catch (error) {
    console.error('Failed to load logs:', error)
    simulateLogs()
  }
}

const simulateLogs = () => {
  logs.value = [
    '[05:15:32] Agent started successfully',
    '[05:15:33] Connected to OpenAI API',
    '[05:15:45] Loading skill: content-writing',
    '[05:16:02] Skill loaded successfully',
    '[05:16:15] Agent ready, waiting for tasks...',
    '[05:30:22] Task received: Write blog post about AI agents',
    '[05:30:25] Starting task execution...',
    '[05:45:30] Content generation in progress...',
    '[05:55:15] SEO optimization completed',
    '[06:00:32] Task completed successfully',
  ]
}

// Control actions
const startAgent = async () => {
  if (isControlLoading.value) return
  isControlLoading.value = true
  
  try {
    const response = await fetch(`/api/agents/${agentId}/start`, { method: 'POST' })
    if (response.ok) {
      agent.value!.status = 'running' as Agent['status']
      addLog('Agent started successfully')
    }
  } catch (error) {
    console.error('Failed to start agent:', error)
    addLog('Error starting agent', true)
  } finally {
    isControlLoading.value = false
  }
}

const pauseAgent = async () => {
  if (isControlLoading.value) return
  isControlLoading.value = true
  
  try {
    const response = await fetch(`/api/agents/${agentId}/pause`, { method: 'POST' })
    if (response.ok) {
      agent.value!.status = 'idle' as Agent['status']
      addLog('Agent paused')
    }
  } catch (error) {
    console.error('Failed to pause agent:', error)
    addLog('Error pausing agent', true)
  } finally {
    isControlLoading.value = false
  }
}

const stopAgent = async () => {
  if (isControlLoading.value) return
  isControlLoading.value = true
  
  try {
    const response = await fetch(`/api/agents/${agentId}/stop`, { method: 'POST' })
    if (response.ok) {
      agent.value!.status = 'stopped' as Agent['status']
      addLog('Agent stopped')
    }
  } catch (error) {
    console.error('Failed to stop agent:', error)
    addLog('Error stopping agent', true)
  } finally {
    isControlLoading.value = false
  }
}

const restartAgent = async () => {
  if (isControlLoading.value) return
  isControlLoading.value = true
  
  try {
    await stopAgent()
    setTimeout(() => startAgent(), 1000)
    addLog('Agent restarted')
  } catch (error) {
    console.error('Failed to restart agent:', error)
    addLog('Error restarting agent', true)
  } finally {
    isControlLoading.value = false
  }
}

const addLog = (message: string, isError = false) => {
  const timestamp = new Date().toLocaleTimeString()
  logs.value.unshift(`[${timestamp}] ${isError ? 'ERROR: ' : ''}${message}`)
}

const clearLogs = () => {
  logs.value = []
}

const refreshData = async () => {
  await loadAgentData()
  await loadTasks()
  await loadLogs()
}

onMounted(() => {
  connectWebSocket()
  simulateAgentData()
  simulateTaskData()
  simulateLogs()
  
  // Simulate real-time updates
  const interval = setInterval(() => {
    if (agent.value && agent.value.status === 'running') {
      agent.value.cpuUsage = Math.floor(Math.random() * 30) + 20
      agent.value.memoryUsage = Math.floor(Math.random() * 50) + 100
    }
  }, 5000)
  
  onUnmounted(() => clearInterval(interval))
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.close()
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <button 
        @click="router.back()"
        class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>
      
      <!-- Connection Status -->
      <div class="flex items-center gap-3">
        <span 
          :class="[
            'w-2 h-2 rounded-full', 
            isConnected ? 'bg-green-500' : 'bg-red-500'
          ]"
          title="Connection status"
        ></span>
        
        <!-- Control Buttons -->
        <button
          @click="startAgent"
          :disabled="isControlLoading || agent?.status === 'running'"
          class="p-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
          title="Start Agent"
        >
          <Play class="w-5 h-5" />
        </button>
        
        <button
          @click="pauseAgent"
          :disabled="isControlLoading || agent?.status !== 'running'"
          class="p-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
          title="Pause Agent"
        >
          <Pause class="w-5 h-5" />
        </button>
        
        <button
          @click="stopAgent"
          :disabled="isControlLoading || agent?.status === 'stopped'"
          class="p-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
          title="Stop Agent"
        >
          <Stop class="w-5 h-5" />
        </button>
        
        <button
          @click="refreshData"
          :disabled="isControlLoading"
          class="p-2 rounded-lg bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white transition-colors"
          title="Refresh"
        >
          <RefreshCw class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Agent Info Card -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <div :class="[getStatusColor(agent?.status || 'idle'), 'w-12 h-12 rounded-lg flex items-center justify-center']">
            <Activity class="w-6 h-6 text-white" />
          </div>
          
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ agent?.name }}</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">{{ agent?.description }}</p>
            
            <div class="flex items-center gap-2 mt-3">
              <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusBadgeColor(agent?.status || 'idle')]">
                {{ agent?.status }}
              </span>
              
              <span class="text-sm text-gray-500 dark:text-gray-400 capitalize">{{ agent?.type }}</span>
            </div>
          </div>
        </div>
        
        <!-- Resource Usage -->
        <div class="flex items-center gap-6">
          <div class="text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">CPU</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ agent?.cpuUsage }}%</p>
          </div>
          
          <div class="text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">Memory</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ agent?.memoryUsage }}MB</p>
          </div>
          
          <div class="text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">Tasks</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ agent?.tasksCompleted }}</p>
          </div>
        </div>
      </div>
      
      <!-- Agent Details -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">LLM Provider</p>
          <p class="font-medium text-gray-900 dark:text-white mt-1">{{ agent?.llmProvider }}</p>
        </div>
        
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Skills</p>
          <div class="flex flex-wrap gap-2 mt-2">
            <span 
              v-for="skill in agent?.skills" 
              :key="skill"
              class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {{ skill }}
            </span>
          </div>
        </div>
        
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Last Active</p>
          <p class="font-medium text-gray-900 dark:text-white mt-1">{{ formatTime(agent?.lastActive || '') }}</p>
        </div>
      </div>
    </div>

    <!-- Logs and Tasks Split View -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Live Logs -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div 
          @click="showLogs = !showLogs"
          class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
        >
          <div class="flex items-center gap-2">
            <Terminal class="w-5 h-5 text-blue-600" />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Live Logs</h2>
          </div>
          
          <button @click.stop="showLogs = !showLogs" class="text-gray-400 hover:text-gray-600">
            <template v-if="showLogs">
              <ChevronDown class="w-5 h-5" />
            </template>
            <template v-else>
              <ChevronUp class="w-5 h-5" />
            </template>
          </button>
        </div>
        
        <div v-if="showLogs" class="p-0">
          <!-- Log Actions -->
          <div class="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
            <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="autoScrollLogs"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Auto-scroll
            </label>
            
            <button 
              @click="clearLogs"
              class="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              Clear Logs
            </button>
          </div>
          
          <div 
            class="p-4 font-mono text-xs overflow-y-auto max-h-96 space-y-1 bg-gray-950 text-green-400"
            :class="{ 'auto-scroll': autoScrollLogs }"
          >
            <div v-for="(log, index) in logs.slice().reverse()" :key="index">
              {{ log }}
            </div>
            
            <div v-if="logs.length === 0" class="text-gray-500 text-center py-8">
              No logs yet. Start the agent to see activity.
            </div>
          </div>
        </div>
      </div>

      <!-- Task History -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div 
          @click="showTasks = !showTasks"
          class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
        >
          <div class="flex items-center gap-2">
            <Clock class="w-5 h-5 text-purple-600" />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Task History</h2>
          </div>
          
          <button @click.stop="showTasks = !showTasks" class="text-gray-400 hover:text-gray-600">
            <template v-if="showTasks">
              <ChevronDown class="w-5 h-5" />
            </template>
            <template v-else>
              <ChevronUp class="w-5 h-5" />
            </template>
          </button>
        </div>
        
        <div v-if="showTasks" class="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
          <div 
            v-for="task in tasks" 
            :key="task.id"
            class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <div class="flex items-start justify-between mb-2">
              <p class="font-medium text-gray-900 dark:text-white">{{ task.title }}</p>
              
              <span :class="['px-2 py-1 rounded-full text-xs font-medium', getTaskStatusColor(task.status)]">
                {{ task.status }}
              </span>
            </div>
            
            <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{{ formatTime(task.createdAt) }}</span>
              
              <template v-if="task.duration">
                <span>Duration: {{ formatDuration(task.duration) }}</span>
              </template>
            </div>
            
            <div v-if="task.result" class="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded text-xs font-mono overflow-x-auto">
              <p class="text-gray-600 dark:text-gray-400 mb-1">Result:</p>
              {{ task.result }}
            </div>
          </div>
          
          <div v-if="tasks.length === 0" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
            No tasks yet.
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Button -->
    <button 
      @click="$router.push('/agent-orchestrator/config')"
      class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
    >
      <Settings class="w-5 h-5" />
      Configure Agent Settings
    </button>
  </div>
</template>

<style scoped>
.auto-scroll {
  scroll-behavior: smooth;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.dark .overflow-y-auto::-webkit-scrollbar-track {
  background: #1e293b;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #475569;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
