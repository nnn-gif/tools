<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const inputText = ref('')
const base64Text = ref('')
const error = ref('')

const fillSample = () => {
  inputText.value = 'Hello World'
  onInputInput()
}

const onInputInput = () => {
  try {
    base64Text.value = btoa(inputText.value)
    error.value = ''
  } catch (e) {
    // ignore
  }
}

const onBase64Input = () => {
  try {
    inputText.value = atob(base64Text.value)
    error.value = ''
  } catch (e) {
    error.value = 'Invalid Base64'
  }
}
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4 bg-muted/30">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight">Base64 Encoder/Decoder</h1>
      <Button variant="ghost" @click="fillSample">Load Sample</Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
      <!-- Plain Text Column -->
      <Card class="flex flex-col min-h-0">
        <CardHeader>
          <CardTitle class="text-sm font-medium">Plain Text</CardTitle>
        </CardHeader>
        <CardContent class="flex-1 min-h-0">
          <Textarea
            v-model="inputText"
            @input="onInputInput"
            class="h-full resize-none font-mono"
            placeholder="Type text to encode..."
          />
        </CardContent>
      </Card>

      <!-- Base64 Column -->
      <Card class="flex flex-col min-h-0">
        <CardHeader>
          <CardTitle class="text-sm font-medium">Base64 Output</CardTitle>
        </CardHeader>
        <CardContent class="flex-1 min-h-0">
          <Textarea
            v-model="base64Text"
            @input="onBase64Input"
            class="h-full resize-none font-mono"
            placeholder="Type Base64 to decode..."
          />
        </CardContent>
      </Card>
    </div>

    <div v-if="error" class="p-4 text-sm text-destructive bg-destructive/10 rounded-md">
      {{ error }}
    </div>
  </div>
</template>
