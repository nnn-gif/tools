<script setup lang="ts">
import { ref, watch } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle } from 'lucide-vue-next'

const jsonInput = ref('')
const error = ref<string | null>(null)
const isValid = ref(false)

const validateJSON = () => {
  if (!jsonInput.value.trim()) {
    error.value = null
    isValid.value = false
    return
  }

  try {
    JSON.parse(jsonInput.value)
    error.value = null
    isValid.value = true
  } catch (e: any) {
    error.value = e.message
    isValid.value = false
  }
}

watch(jsonInput, validateJSON)

const fillSample = () => {
  jsonInput.value = JSON.stringify(
    {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
      address: {
        street: '123 Main St',
        city: 'New York'
      }
    },
    null,
    2
  )
}
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4 bg-muted/30">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold tracking-tight">JSON Linter</h2>
      <Button variant="ghost" @click="fillSample">Load Sample</Button>
    </div>

    <Card class="flex-1 min-h-0 flex flex-col">
      <CardHeader class="pb-3">
        <CardTitle class="text-sm font-medium flex items-center gap-2">
          <div class="flex items-center gap-2">
            JSON Input
            <div v-if="jsonInput.trim()" class="flex items-center gap-1">
              <CheckCircle v-if="isValid" class="h-4 w-4 text-green-500" />
              <AlertCircle v-else class="h-4 w-4 text-red-500" />
              <span :class="isValid ? 'text-green-500' : 'text-red-500'" class="text-xs">
                {{ isValid ? 'Valid JSON' : 'Invalid JSON' }}
              </span>
            </div>
          </div>
        </CardTitle>
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
  </div>
</template>
