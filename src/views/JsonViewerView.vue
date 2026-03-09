<script setup lang="ts">
import { ref, watch } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const jsonInput = ref('')
const jsonOutput = ref('')
const error = ref('')

const formatJson = () => {
  try {
    error.value = ''
    if (!jsonInput.value.trim()) {
      jsonOutput.value = ''
      return
    }
    const parsed = JSON.parse(jsonInput.value)
    jsonOutput.value = JSON.stringify(parsed, null, 2)
  } catch (e: any) {
    error.value = e.message || 'Invalid JSON'
  }
}

const minifyJson = () => {
  try {
    error.value = ''
    if (!jsonInput.value.trim()) {
      jsonOutput.value = ''
      return
    }
    const parsed = JSON.parse(jsonInput.value)
    jsonOutput.value = JSON.stringify(parsed)
  } catch (e: any) {
    error.value = e.message || 'Invalid JSON'
  }
}

const copyOutput = () => {
  navigator.clipboard.writeText(jsonOutput.value)
}

watch(jsonInput, formatJson)
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4 bg-muted/30">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight">JSON Viewer/Formatter</h1>
    </div>

    <div class="flex gap-2">
      <Button @click="formatJson">Format (Pretty)</Button>
      <Button @click="minifyJson" variant="outline">Minify</Button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
      <Card class="flex flex-col min-h-0">
        <CardHeader>
          <CardTitle>Input</CardTitle>
        </CardHeader>
        <CardContent class="flex-1 min-h-0">
          <Textarea
            v-model="jsonInput"
            class="h-full resize-none font-mono text-sm"
            placeholder="Enter JSON..."
          />
        </CardContent>
      </Card>

      <Card class="flex flex-col min-h-0">
        <CardHeader class="flex-row items-center justify-between">
          <CardTitle>Output</CardTitle>
          <Button variant="outline" size="sm" @click="copyOutput" :disabled="!jsonOutput"
            >Copy</Button
          >
        </CardHeader>
        <CardContent class="flex-1 min-h-0">
          <Textarea
            :model-value="jsonOutput"
            readonly
            class="h-full resize-none font-mono text-sm"
            placeholder="Formatted JSON will appear here..."
          />
        </CardContent>
      </Card>
    </div>

    <div v-if="error" class="p-4 text-sm text-destructive bg-destructive/10 rounded-md">
      {{ error }}
    </div>
  </div>
</template>
