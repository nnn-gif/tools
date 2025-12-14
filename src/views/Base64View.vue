<script setup lang="ts">
import { ref } from 'vue'
import { Binary } from 'lucide-vue-next'

const inputText = ref('')
const base64Text = ref('')
const error = ref('')

const fillSample = () => {
    inputText.value = 'Hello World'
    onInputInput()
}

// Simple logic: editing one updates the other.
// To prevent loops, we track which field was focused or check equality.
// For simplicity, let's use explicit actions or just one-way for now? 
// Actually, separate inputs for "Encode This" and "Decode This" is often clearer, 
// OR a single UI where typing in left updates right and vice versa.

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
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-3 border-b border-border">
      <h2 class="text-lg font-semibold flex items-center gap-2">
        <Binary class="h-5 w-5" />
        Base64 Encoder/Decoder
      </h2>
      <button 
        @click="fillSample"
        class="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
      >
        Load Sample
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-500/10 text-red-600 dark:text-red-400 px-6 py-2 text-sm">
      {{ error }}
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Plain Text Pane -->
      <div class="flex-1 flex flex-col border-r border-border min-w-0">
        <div class="bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground border-b border-border">
          Plain Text
        </div>
        <textarea
          v-model="inputText"
          @input="onInputInput"
          class="flex-1 resize-none p-4 font-mono text-sm focus:outline-none bg-background text-foreground"
          placeholder="Type text to encode..."
          spellcheck="false"
        ></textarea>
      </div>

      <!-- Base64 Pane -->
      <div class="flex-1 flex flex-col min-w-0">
        <div class="bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground border-b border-border">
          Base64 Output
        </div>
        <textarea
          v-model="base64Text"
          @input="onBase64Input"
          class="flex-1 resize-none p-4 font-mono text-sm focus:outline-none bg-background text-foreground"
          placeholder="Type Base64 to decode..."
          spellcheck="false"
        ></textarea>
      </div>
    </div>
  </div>
</template>
