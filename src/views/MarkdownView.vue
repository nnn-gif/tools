<script setup lang="ts">
import { ref } from 'vue'
import { Upload } from 'lucide-vue-next'
import Editor from '../components/Editor.vue'
import Preview from '../components/Preview.vue'
import ExportMenu from '../components/ExportMenu.vue'


const markdownText = ref<string>(`# Welcome to Markdown Tools

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
    markdownText.value = content
  }
  reader.readAsText(file)
}
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4 bg-muted/30">
    <!-- Toolbar -->
    <div class="flex items-center justify-between gap-4">
       <div class="font-bold text-lg text-foreground">
         Markdown Editor
       </div>
       <div class="flex items-center gap-2">
         <Button variant="outline" class="relative overflow-hidden">
            <Upload class="mr-2 h-4 w-4" />
            Upload MD
            <input 
              type="file" 
              accept=".md,.txt" 
              class="absolute inset-0 opacity-0 cursor-pointer"
              @change="handleFileUpload" 
            />
         </Button>
         <ExportMenu :markdown="markdownText" />
       </div>
    </div>

    <!-- Main Workspace -->
    <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
      <!-- Editor Pane -->
      <Card class="flex flex-col min-h-0 border-border overflow-hidden">
        <Editor v-model="markdownText" />
      </Card>

      <!-- Preview Pane -->
      <Card class="flex flex-col min-h-0 border-border overflow-hidden bg-background">
        <Preview :markdown="markdownText" />
      </Card>
    </div>
  </div>
</template>
