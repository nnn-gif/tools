<script setup lang="ts">
import ToolLink from './ToolLink.vue'

export interface RelatedTool {
  name: string
  link: string
  description: string
}

interface Props {
  tools: RelatedTool[]
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Related Tools'
})
</script>

<template>
  <div v-if="props.tools && props.tools.length > 0" class="mt-8">
    <h3 v-if="props.title" class="text-lg font-semibold mb-4">{{ props.title }}</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      <div v-for="tool in props.tools" :key="tool.name">
        <ToolLink
          :name="tool.name"
          :to="tool.link"
          :description="tool.description"
        />
      </div>
    </div>
  </div>
</template>
