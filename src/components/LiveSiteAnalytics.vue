<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMonthlyCounter } from '@/composables/useMonthlyCounter'

// ============================================
// PERSISTENT COUNTER - Uses CountAPI for persistence
// ============================================
// Monthly visitors counter is now persistent via API
const { monthlyVisitors, isLoading: _counterLoading } = useMonthlyCounter()

// ============================================
// LIVE USER SIMULATION (Client-side only, as requested)
// ============================================
const LIVE_USER_UPDATE_INTERVAL = 3000 // Update live users every 3 seconds
const liveUsers = ref(12)
let liveUserInterval: number | undefined

// Format number with commas
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US')
}

// Simulate live users (8-24, fluctuating every 3 seconds as per requirements)
const updateLiveUsers = () => {
  // Random fluctuation: +/- 1-3 users, staying within 8-24 range
  const change = Math.floor(Math.random() * 7) - 3 // -3 to +3
  liveUsers.value = Math.max(8, Math.min(24, liveUsers.value + change))
}

onMounted(() => {
  // Initialize live users (8-24 as per requirements)
  liveUsers.value = Math.floor(Math.random() * 17) + 8 // 8-24

  // Start live user simulation
  liveUserInterval = window.setInterval(updateLiveUsers, LIVE_USER_UPDATE_INTERVAL)
})

onUnmounted(() => {
  if (liveUserInterval) {
    clearInterval(liveUserInterval)
  }
})
</script>

<template>
  <div class="fixed bottom-5 right-5 z-[9999]">
    <!-- Glassmorphism card with reduced sizing -->
    <div
      class="bg-white/20 backdrop-blur-md border border-white/30 shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl px-3 py-1.5 min-w-[160px] transition-all duration-200 hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]"
    >
      <!-- Live Users -->
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <!-- Pulsing green dot - w-2 h-2 -->
          <span class="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 animate-pulse"></span>
          <span class="text-xs uppercase tracking-wider text-gray-500 font-medium">Live</span>
        </div>
        <span class="text-lg font-semibold text-slate-800 tabular-nums pl-4">{{ liveUsers }}</span>
      </div>

      <!-- Divider -->
      <div class="h-px bg-gray-300/50 my-2"></div>

      <!-- Monthly Users -->
      <div class="flex flex-col gap-1">
        <span class="text-xs uppercase tracking-wider text-gray-500 font-medium"
          >Monthly Users</span
        >
        <span class="text-lg font-semibold text-slate-800 tabular-nums">{{
          formatNumber(monthlyVisitors)
        }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Minimal scoped styles - main styling via Tailwind */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.3);
  }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  div.fixed {
    bottom: 10px;
    right: 10px;
  }
}

/* Ensure it doesn't block important elements */
@media (max-width: 480px) {
  div.fixed {
    bottom: 70px;
  }
}
</style>
