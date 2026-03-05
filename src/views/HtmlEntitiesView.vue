<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const inputText = ref('')
const encodedText = ref('')
const decodedText = ref('')

const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
  '©': '&copy;',
  '®': '&reg;',
  '™': '&trade;',
  '€': '&euro;',
  '£': '&pound;',
  '¥': '&yen;',
  '¢': '&cent;',
  '§': '&sect;',
  '¶': '&para;',
  '°': '&deg;',
  '±': '&plusmn;',
  '×': '&times;',
  '÷': '&divide;',
}

const encode = () => {
  let result = inputText.value
  for (const [char, entity] of Object.entries(htmlEntities)) {
    result = result.split(char).join(entity)
  }
  // Also encode other non-ASCII characters
  result = result.replace(/[^\x00-\x7F]/g, (char) => {
    return `&#${char.charCodeAt(0)};`
  })
  encodedText.value = result
}

const decode = () => {
  const doc = new DOMParser().parseFromString(inputText.value, 'text/html')
  decodedText.value = doc.documentElement.textContent || ''
}
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4 bg-muted/30">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight">HTML Entities Encoder/Decoder</h1>
    </div>

    <Card class="flex flex-col min-h-0">
      <CardHeader>
        <CardTitle>Input</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <Textarea
          v-model="inputText"
          rows="4"
          placeholder="Enter text to encode or decode..."
        />
        <div class="flex gap-2">
          <Button @click="encode">Encode</Button>
          <Button @click="decode" variant="secondary">Decode</Button>
        </div>
      </CardContent>
    </Card>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
      <Card class="flex flex-col min-h-0">
        <CardHeader>
          <CardTitle>Encoded</CardTitle>
        </CardHeader>
        <CardContent class="flex-1 min-h-0">
          <Textarea
            :model-value="encodedText"
            readonly
            class="h-full resize-none font-mono text-sm"
            placeholder="Encoded result..."
          />
        </CardContent>
      </Card>

      <Card class="flex flex-col min-h-0">
        <CardHeader>
          <CardTitle>Decoded</CardTitle>
        </CardHeader>
        <CardContent class="flex-1 min-h-0">
          <Textarea
            :model-value="decodedText"
            readonly
            class="h-full resize-none font-mono text-sm"
            placeholder="Decoded result..."
          />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
