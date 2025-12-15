```
<script setup lang="ts">
import { Textarea } from '@/components/ui/textarea'

defineProps<{
  modelValue: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="h-full flex flex-col">
    <Textarea
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event as string)"
      class="flex-1 resize-none font-mono p-4 text-base focus-visible:ring-0 border-0 rounded-none bg-background text-foreground"
      placeholder="Type markdown here..."
    />
  </div>
</template>
```
