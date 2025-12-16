<script setup lang="ts">
import { ref, watch } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle } from 'lucide-vue-next'
import * as yaml from 'js-yaml'

const yamlInput = ref('')
const error = ref<string | null>(null)
const isValid = ref(false)

const validateYAML = () => {
  if (!yamlInput.value.trim()) {
    error.value = null
    isValid.value = false
    return
  }

  try {
    yaml.load(yamlInput.value)
    error.value = null
    isValid.value = true
  } catch (e: any) {
    error.value = e.message
    isValid.value = false
  }
}

watch(yamlInput, validateYAML)

const fillSample = () => {
  yamlInput.value = `name: John Doe
age: 30
email: john@example.com
address:
  street: 123 Main St
  city: New York
hobbies:
  - reading
  - coding
  - hiking`
}
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4 bg-muted/30">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold tracking-tight">YAML Linter</h2>
      <Button variant="ghost" @click="fillSample">Load Sample</Button>
    </div>

    <Card class="flex-1 min-h-0 flex flex-col">
      <CardHeader class="pb-3">
        <CardTitle class="text-sm font-medium flex items-center gap-2">
          <div class="flex items-center gap-2">
            YAML Input
            <div v-if="yamlInput.trim()" class="flex items-center gap-1">
              <CheckCircle v-if="isValid" class="h-4 w-4 text-green-500" />
              <AlertCircle v-else class="h-4 w-4 text-red-500" />
              <span :class="isValid ? 'text-green-500' : 'text-red-500'" class="text-xs">
                {{ isValid ? 'Valid YAML' : 'Invalid YAML' }}
              </span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent class="flex-1 min-h-0 flex flex-col gap-2">
        <Textarea
          v-model="yamlInput"
          class="flex-1 resize-none font-mono text-sm"
          placeholder="key: value"
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
