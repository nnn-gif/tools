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

<div class="tools-links">

### Document Tools
- <a href="/">Markdown Editor</a> - Write and preview markdown with live rendering

### Converters
- <a href="/json-yaml">JSON to YAML Converter</a> - Convert between JSON and YAML formats instantly
- <a href="/json-csv">JSON to CSV Converter</a> - Transform JSON to CSV and vice versa

### Utilities
- <a href="/diff">Text Diff Tool</a> - Compare text and highlight differences
- <a href="/base64">Base64 Encoder & Decoder</a> - Encode and decode Base64 strings
- <a href="/jwt">JWT Decoder</a> - Decode and inspect JSON Web Tokens
- <a href="/sql">SQL Formatter</a> - Format and beautify SQL queries

### Generators
- <a href="/uuid">UUID Generator</a> - Generate unique identifiers in bulk
- <a href="/lorem">Lorem Ipsum Generator</a> - Create placeholder text for designs

### Linters
- <a href="/json-lint">JSON Linter & Validator</a> - Validate and format JSON with syntax checking
- <a href="/yaml-lint">YAML Linter & Validator</a> - Validate and format YAML with syntax checking

### Media Tools
- <a href="/image">Image Compressor</a> - Resize and compress images client-side

</div>

## 💡 Request New Tools

Have an idea for a tool that would make your workflow better? We'd love to hear from you!

**Submit your suggestions:**
- Open an issue on our [GitHub repository](https://github.com/nnn-gif/tools)
- Tweet us: [@heyformatho](https://twitter.com/heyformatho)

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
      <h1 class="text-3xl font-bold tracking-tight">Markdown Editor</h1>
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
