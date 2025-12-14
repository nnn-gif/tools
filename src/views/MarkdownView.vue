<script setup lang="ts">
import { ref } from 'vue'
import { Upload } from 'lucide-vue-next'
import Editor from '../components/Editor.vue'
import Preview from '../components/Preview.vue'
import ExportMenu from '../components/ExportMenu.vue'

const markdown = ref<string>(`# Welcome to Markdown Tools

Start typing in the editor on the left to see the live preview on the right.

## Features
- **Live Preview**: See changes instantly
- **Export**: Download as PDF or DOCX
- **Clean UI**: Distraction-free writing environment

## Code Example
\`\`\`javascript
console.log("Hello, World!");
\`\`\`

## Lists
- Item 1
- Item 2
  - Subitem A
`)

const fileInputRef = ref<HTMLInputElement | null>(null)

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.size > 1024 * 1024) { // 1MB limit
    alert("File is too large. Max 1MB.")
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    markdown.value = content
  }
  reader.readAsText(file)
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Tool Header -->
    <header class="flex h-14 items-center justify-between border-b border-border px-6">
      <div class="flex items-center gap-2">
        <h2 class="text-lg font-semibold text-foreground">Markdown Editor</h2>
      </div>

      <div class="flex items-center gap-4">
        <input
          type="file"
          accept=".md,.markdown,.txt"
          class="hidden"
          ref="fileInputRef"
          @change="handleFileUpload"
        />
        <button
          @click="fileInputRef?.click()"
          class="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer"
          title="Upload Markdown File"
        >
          <Upload class="h-4 w-4" />
          <span class="hidden sm:inline">Import</span>
        </button>
        <ExportMenu :markdown="markdown" />
      </div>
    </header>

    <!-- Tool Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Editor Pane -->
      <div class="flex-1 border-r border-border">
        <Editor v-model="markdown" class="h-full" />
      </div>

      <!-- Preview Pane -->
      <div class="hidden flex-1 md:flex bg-muted/30">
        <Preview :markdown="markdown" class="h-full" />
      </div>
    </div>
  </div>
</template>
