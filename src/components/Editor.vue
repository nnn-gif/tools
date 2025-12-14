<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="relative h-full w-full">
    <textarea
      class="h-full w-full resize-none bg-background p-4 font-mono text-sm leading-relaxed text-foreground focus:outline-none"
      placeholder="Type some markdown..."
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      spellcheck="false"
    />
  </div>
</template>
