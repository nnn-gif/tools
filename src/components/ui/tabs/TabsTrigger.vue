<script setup lang="ts">
import { inject, computed, type Ref } from 'vue'

interface TabsTriggerProps {
  value: string
}

const props = defineProps<TabsTriggerProps>()

const tabsContext = inject<{
  activeTab: Ref<string>
  setActiveTab: (value: string) => void
}>('tabs')

const isActive = computed(() => tabsContext?.activeTab.value === props.value)

const handleClick = () => {
  tabsContext?.setActiveTab(props.value)
}
</script>

<template>
  <button
    @click="handleClick"
    :class="[
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-slate-900 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      isActive
        ? 'bg-slate-700 text-white shadow-sm'
        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
    ]"
  >
    <slot />
  </button>
</template>
