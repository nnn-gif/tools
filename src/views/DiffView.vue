<script setup lang="ts">
import { ref, watch } from 'vue'
import * as Diff from 'diff'
import { FileDiff } from 'lucide-vue-next'

const originalText = ref('')
const modifiedText = ref('')
const diffResult = ref<any[]>([])

const computeDiff = () => {
  if (!originalText.value && !modifiedText.value) {
    diffResult.value = []
    return
  }
  
  // Use words or lines based on content? Defaulting to chars/words mix logic or just chars for now.
  // Let's use words for better readability usually, or lines for code.
  // Using diffWords for general text.
  const diffs = Diff.diffLines(originalText.value, modifiedText.value)
  diffResult.value = diffs
}

watch([originalText, modifiedText], computeDiff)

const fillSample = () => {
  originalText.value = `Hello World\nThis is a test file.\nIt has some lines.`
  modifiedText.value = `Hello World!\nThis is a test file.\nIt has changed lines.`
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-3 border-b border-border">
      <h2 class="text-lg font-semibold flex items-center gap-2">
        <FileDiff class="h-5 w-5" />
        Diff Checker
      </h2>
      <button 
        @click="fillSample"
        class="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
      >
        Load Sample
      </button>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Inputs Column -->
      <div class="flex-1 flex flex-col border-r border-border min-w-0">
        <div class="h-1/2 flex flex-col border-b border-border">
          <div class="bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground">Original Text</div>
          <textarea
            v-model="originalText"
            class="flex-1 resize-none p-4 font-mono text-sm focus:outline-none bg-background text-foreground"
            placeholder="Paste original text here..."
            spellcheck="false"
          ></textarea>
        </div>
        <div class="h-1/2 flex flex-col">
          <div class="bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground">Modified Text</div>
          <textarea
            v-model="modifiedText"
            class="flex-1 resize-none p-4 font-mono text-sm focus:outline-none bg-background text-foreground"
            placeholder="Paste modified text here..."
            spellcheck="false"
          ></textarea>
        </div>
      </div>

      <!-- Result Column -->
      <div class="flex-1 flex flex-col min-w-0 bg-muted/10">
        <div class="bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground">Difference</div>
        <div class="flex-1 overflow-auto p-4 font-mono text-sm whitespace-pre-wrap">
          <span 
            v-for="(part, index) in diffResult" 
            :key="index"
            :class="{
              'bg-green-500/20 text-green-700 dark:text-green-300': part.added,
              'bg-red-500/20 text-red-700 dark:text-red-300': part.removed,
              'text-muted-foreground': !part.added && !part.removed
            }"
          >{{ part.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
