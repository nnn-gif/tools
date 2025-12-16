<script setup lang="ts">
import { ref } from 'vue'
import { Upload } from 'lucide-vue-next'
import Editor from '../components/Editor.vue'
import Preview from '../components/Preview.vue'
import ExportMenu from '../components/ExportMenu.vue'

const markdownText = ref<string>(`# Welcome to Formatho

Your privacy-first developer toolkit for everyday tasks.

## About Formatho

Formatho is a collection of essential developer tools designed to make your workflow faster and more efficient. All tools run **100% client-side** in your browser - your data never leaves your device.

## 🔒 Your Data is Safe

- **No Server Processing**: All operations happen locally in your browser
- **Zero Data Collection**: We don't store, track, or transmit your data
- **Complete Privacy**: Your sensitive information stays with you
- **Offline Capable**: Most tools work without an internet connection

## 🛠️ Available Tools

### Document Tools
- **Markdown Editor** - Write and preview markdown with live rendering

### Converters
- **JSON ↔ YAML** - Convert between JSON and YAML formats
- **JSON ↔ CSV** - Transform JSON to CSV and vice versa

### Utilities
- **Diff Checker** - Compare text and highlight differences
- **Base64 Encoder/Decoder** - Encode and decode Base64 strings
- **JWT Debugger** - Decode and inspect JSON Web Tokens
- **SQL Formatter** - Format and beautify SQL queries

### Generators
- **UUID Generator** - Generate unique identifiers in bulk
- **Lorem Ipsum** - Create placeholder text for designs

### Linters
- **JSON Linter** - Validate and format JSON with syntax checking
- **YAML Linter** - Validate and format YAML with syntax checking

### Media Tools
- **Image Compressor** - Resize and compress images client-side

## 💡 Request New Tools

Have an idea for a tool that would make your workflow better? We'd love to hear from you!

**Submit your suggestions:**
- Open an issue on our [GitHub repository](https://github.com/nnn-gif/tools)
- Email us at: hello@formatho.com
- Tweet us: [@formatho](https://twitter.com/formatho)

We're constantly adding new tools based on community feedback!

---

**Start using any tool from the sidebar** →
`)

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.size > 1024 * 1024) {
    // 1MB limit
    alert('File is too large. Max 1MB.')
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
      <div class="font-bold text-lg text-foreground">Markdown Editor</div>
      <div class="flex items-center gap-2">
        <Button variant="secondary" size="sm" class="relative overflow-hidden">
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
