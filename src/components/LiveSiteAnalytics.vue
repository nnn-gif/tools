<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// ============================================
// DATA HOOK - Easy to replace with API call
// ============================================
const INITIAL_VISITORS = 12847 // Starting count
const INCREMENT_INTERVAL = 5000 // Increment every 5 seconds

// State
const monthlyVisitors = ref(INITIAL_VISITORS)
let incrementInterval: number | undefined

// Format number with commas
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US')
}

// Smoothly increment visitors (simulating real-time traffic)
const incrementVisitors = () => {
  // Increment by random amount (1-3 visitors)
  const increment = Math.floor(Math.random() * 3) + 1
  monthlyVisitors.value += increment
}

onMounted(() => {
  // Start continuous increment - every 5 seconds
  incrementInterval = window.setInterval(incrementVisitors, INCREMENT_INTERVAL)
})

onUnmounted(() => {
  if (incrementInterval) {
    clearInterval(incrementInterval)
  }
})
</script>

<template>
  <div class="visitors-counter-widget">
    <div class="counter-card">
      <!-- Monthly Traffic Counter -->
      <div class="metric">
        <div class="metric-header">
          <span class="pulse-dot"></span>
          <span class="metric-label">Total Visitors This Month</span>
        </div>
        <div class="metric-value">
          <span class="number">{{ formatNumber(monthlyVisitors) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.visitors-counter-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.counter-card {
  /* Liquid Glass Effect */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 16px 24px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  min-width: 200px;
  transition: all 0.3s ease;
}

.counter-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.metric-label {
  font-size: 11px;
  color: hsl(var(--foreground) / 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: hsl(var(--primary));
  line-height: 1;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.number {
  font-variant-numeric: tabular-nums;
  transition: transform 0.3s ease;
}

/* Pulsing indicator dot */
.pulse-dot {
  width: 8px;
  height: 8px;
  background: hsl(142 76% 36%);
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.3);
  }
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .visitors-counter-widget {
    bottom: 10px;
    right: 10px;
  }

  .counter-card {
    padding: 12px 16px;
    min-width: 160px;
  }

  .metric-value {
    font-size: 22px;
  }

  .metric-label {
    font-size: 10px;
  }
}

/* Ensure it doesn't block important elements */
@media (max-width: 480px) {
  .visitors-counter-widget {
    /* Move above bottom navigation if present */
    bottom: 70px;
  }
}

/* Dark mode adjustment */
@media (prefers-color-scheme: dark) {
  .counter-card {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>
