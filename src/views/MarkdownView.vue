<script setup lang="ts">
import { ref } from 'vue'
import { Upload } from 'lucide-vue-next'
import Editor from '../components/Editor.vue'
import Preview from '../components/Preview.vue'
import ExportMenu from '../components/ExportMenu.vue'

const markdownText = ref<string>(`# Formatho
## The Privacy-First Online Text & Developer Utility Toolkit

<div style="display:flex; justify-content:center; gap:16px; margin:16px 0;">
  <img src="https://img.shields.io/badge/Privacy-First-blue" alt="Privacy First">
  <img src="https://img.shields.io/badge/open_source-MIT-green" alt="Open Source">
  <img src="https://img.shields.io/badge/Offline-Capable-orange" alt="Offline Capable">
</div>



*Formatho* is a fast, secure, privacy-first collection of *online text formatting tools, **developer utilities, and **content productivity tools* — built to solve everyday formatting, conversion, and debugging problems directly in your browser.

No sign-up.  
No uploads.  
No tracking.  

<span style="background-color: #2F5BEA; color: #ffffff; padding: 2px 7px; border-radius: 3px; font-weight: 500; letter-spacing: 0.01em;">
✨ Just tools that work ✨ 
</span>

---

## Why Formatho?
People search every day for *online text formatting tools, **developer utilities, and **privacy-safe converters*, such as:

### ✨ Features

*<span style="color:steelblue;">Format text online</span>*  
Clean, beautify, and normalize text.

*<span style="color:steelblue;">Fix JSON formatting</span>*  
Validate and prettify JSON files.

*<span style="color:steelblue;">SQL formatter online</span>*  
Readable and well-structured SQL queries.

*<span style="color:steelblue;">Markdown editor</span>*  
Live preview while editing.

*<span style="color:steelblue;">Compare text differences</span>*  
Quick and accurate diff tool.

*<span style="color:steelblue;">Base64 encode & decode</span>*  
Safe string encoding and decoding.

*<span style="color:steelblue;">JWT decode online</span>*  
Decode tokens without uploading.

*<span style="color:steelblue;">Developer tools without upload or tracking</span>*

*<span style="color:steelblue;">Offline formatting tools</span>*  
Runs entirely in the browser.

*<span style="color:steelblue;">Dillinger alternative</span>*  
More utilities with better privacy.




 

*Formatho is built for exactly those use cases.*

---

## 🧠 How It Works

- Type or paste your text/code on the left
- See formatted, validated, converted output instantly
- Everything runs *100% client-side*
- Your data *never leaves your device*

> This page itself is written in Markdown — just like Dillinger — but with a broader focus on *text utilities, converters, validators, and productivity tools*.

---

## 🔒 Privacy-First by Design

- *No Server Processing* – All tools run locally in your browser
- *Zero Data Collection* – No logs, no analytics, no tracking
- *Offline Capable* – Many tools work even without internet
- *Secure for Sensitive Data* – Ideal for tokens, configs, SQL, and logs

Perfect for developers, writers, analysts, and anyone handling sensitive text.

---

## 🛠️ Tools Available on Formatho

### ✍️ Text & Document Tools
- *Markdown Editor* – Online markdown editor with live preview  
- *Text Formatter Online* – Clean, beautify, and normalize text  
- *Text Diff Tool* – Compare text files and highlight differences  

### 🔁 Conversion Tools
- *JSON to YAML Converter* – Convert JSON to YAML instantly  
- *JSON to CSV Converter* – Transform JSON data into CSV format  
- *Base64 Encoder & Decoder* – Encode and decode Base64 strings  

### 🧪 Validation & Linting Tools
- *JSON Linter & Validator* – Validate, format, and debug JSON  
- *YAML Linter & Validator* – Fix YAML indentation and syntax issues  
- *JWT Decoder Online* – Decode and inspect JSON Web Tokens safely  

### 🧰 Developer Utilities
- *SQL Formatter Online* – Beautify and format SQL queries  
- *UUID Generator* – Generate unique identifiers in bulk  
- *Lorem Ipsum Generator* – Create placeholder content instantly  

### 🖼️ Media Utilities
- *Image Compressor* – Compress and resize images client-side  

---

## 📊 Tool Comparison (Why People Choose Formatho)

| Feature | Formatho | Typical Online Tools |
|------|--------|---------------------|
| Client-side processing | ✅ Yes | ❌ Often server-side |
| Works offline | ✅ Yes | ❌ No |
| No file upload required | ✅ Yes | ❌ Usually required |
| Privacy-safe for tokens & configs | ✅ Yes | ❌ Risky |
| Free forever | ✅ Yes | ⚠️ Limited |

---

## 💻 Built With Modern Web Tech

Formatho is built using modern, lightweight technologies for speed and reliability:

- Browser-native APIs
- Client-side rendering
- No backend dependency for core tools
- Optimized for Chrome, Firefox, Safari, Edge

---

## 🚀 Who Is Formatho For?

- Developers fixing JSON, SQL, YAML, JWTs
- Writers formatting markdown and text
- Product managers comparing text versions
- Designers generating placeholder content
- Anyone searching for *fast online formatting tools*

---

## 💡 Request New Tools

Have a tool idea? Missing a formatter or converter?

- Open an issue on GitHub  
- Reach out on *X/Twitter*: 
<a href="https://x.com/heyformatho"
   target="_blank"
   rel="noopener noreferrer"
   style="color: #1a73e8; font-weight: 600;">
  @heyformatho
</a>



Formatho grows based on real developer and creator needs.

---
← ← ← ← ← ← ← *Start using tools from the sidebar* ← ← ← ← ← ← ←
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
