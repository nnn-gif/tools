<script setup lang="ts">
import { inject, computed, type Ref } from 'vue'

interface TabsContentProps {
  value: string
}

const props = defineProps<TabsContentProps>()

const tabsContext = inject<{
  activeTab: Ref<string>
  setActiveTab: (value: string) => void
}>('tabs')

const isActive = computed(() => tabsContext?.activeTab.value === props.value)
</script>

<template>
  <div v-show="isActive" class="mt-2 ring-offset-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2">
    <slot />
  </div>
</template>
