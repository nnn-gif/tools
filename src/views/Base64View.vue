<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Breadcrumb from '@/components/Breadcrumb.vue'

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
    <!-- Breadcrumb Navigation -->
    <Breadcrumb />
    
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

    <!-- Related Tools -->
    <div class="mt-8 p-6 bg-muted/20 rounded-lg border border-border">
      <h2 class="text-xl font-bold mb-4">Related Tools</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <a
          href="/hash-text"
          class="block p-4 rounded-lg border border-border hover:border-primary hover:bg-muted/30 transition-all"
        >
          <h3 class="font-semibold mb-2">Hash Generator</h3>
          <p class="text-sm text-muted-foreground">Generate MD5, SHA-1, SHA-256, SHA-512 hashes</p>
        </a>
        <a
          href="/encryption"
          class="block p-4 rounded-lg border border-border hover:border-primary hover:bg-muted/30 transition-all"
        >
          <h3 class="font-semibold mb-2">Text Encryption</h3>
          <p class="text-sm text-muted-foreground">Encrypt and decrypt text with various algorithms</p>
        </a>
        <a
          href="/jwt"
          class="block p-4 rounded-lg border border-border hover:border-primary hover:bg-muted/30 transition-all"
        >
          <h3 class="font-semibold mb-2">JWT Debugger</h3>
          <p class="text-sm text-muted-foreground">Decode and inspect JWT tokens</p>
        </a>
        <a
          href="/token-generator"
          class="block p-4 rounded-lg border border-border hover:border-primary hover:bg-muted/30 transition-all"
        >
          <h3 class="font-semibold mb-2">Token Generator</h3>
          <p class="text-sm text-muted-foreground">Generate secure random tokens</p>
        </a>
        <a
          href="/base64-file-converter"
          class="block p-4 rounded-lg border border-border hover:border-primary hover:bg-muted/30 transition-all"
        >
          <h3 class="font-semibold mb-2">Base64 File Converter</h3>
          <p class="text-sm text-muted-foreground">Encode/decode files to/from Base64</p>
        </a>
      </div>
    </div>
  </div>
</template>
