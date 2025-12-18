<script setup lang="ts">
import { ref, watch } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, ArrowRight } from 'lucide-vue-next'

const jsonInput = ref('')
const jsonOutput = ref('')
const error = ref<string | null>(null)
const isValid = ref(false)

const validateJSON = () => {
  if (!jsonInput.value.trim()) {
    error.value = null
    isValid.value = false
    jsonOutput.value = ''
    return
  }

  try {
    JSON.parse(jsonInput.value)
    error.value = null
    isValid.value = true
  } catch (e: any) {
    error.value = e.message
    isValid.value = false
    jsonOutput.value = ''
  }
}

const formatJSON = () => {
  if (!isValid.value) return

  try {
    const parsed = JSON.parse(jsonInput.value)
    jsonOutput.value = JSON.stringify(parsed, null, 2)
  } catch (e: any) {
    error.value = e.message
  }
}

watch(jsonInput, validateJSON)

const fillSample = () => {
  jsonInput.value =
    '{"name":"John Doe","age":30,"email":"john@example.com","address":{"street":"123 Main St","city":"New York"}}'
  validateJSON()
}
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4 bg-muted/30">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight">JSON Linter</h1>
      <Button variant="ghost" @click="fillSample">Load Sample</Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
      <!-- Input Column -->
      <Card class="flex flex-col min-h-0">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium flex items-center gap-2">
            <div class="flex items-center gap-2">
              JSON Input
              <div v-if="jsonInput.trim()" class="flex items-center gap-1">
                <CheckCircle v-if="isValid" class="h-4 w-4 text-green-500" />
                <AlertCircle v-else class="h-4 w-4 text-red-500" />
                <span :class="isValid ? 'text-green-500' : 'text-red-500'" class="text-xs">
                  {{ isValid ? 'Valid' : 'Invalid' }}
                </span>
              </div>
            </div>
          </CardTitle>
          <Button size="sm" @click="formatJSON" :disabled="!isValid">
            Format <ArrowRight class="ml-1 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent class="flex-1 min-h-0 flex flex-col gap-2">
          <Textarea
            v-model="jsonInput"
            class="flex-1 resize-none font-mono text-sm"
            placeholder='{"key": "value"}'
          />
          <div
            v-if="error"
            class="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm"
          >
            <div class="font-semibold mb-1">Syntax Error:</div>
            {{ error }}
          </div>
        </CardContent>
      </Card>

      <!-- Output Column -->
      <Card class="flex flex-col min-h-0">
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium">Formatted Output</CardTitle>
        </CardHeader>
        <CardContent class="flex-1 min-h-0">
          <Textarea
            v-model="jsonOutput"
            class="h-full resize-none font-mono text-sm"
            placeholder="Formatted JSON will appear here..."
            readonly
          />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
