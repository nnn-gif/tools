<script setup lang="ts">
import { ref } from 'vue'
import Papa from 'papaparse'
import { FileJson, FileSpreadsheet, ArrowRightLeft, Download } from 'lucide-vue-next'
import { saveAs } from 'file-saver'

const jsonInput = ref('')
const csvInput = ref('')
const error = ref('')

const convertToCsv = () => {
  error.value = ''
  try {
    const obj = JSON.parse(jsonInput.value)
    
    // Check if input is array of objects, if not wrap it
    const data = Array.isArray(obj) ? obj : [obj]
    
    csvInput.value = Papa.unparse(data)
  } catch (e: any) {
    error.value = 'Invalid JSON: ' + e.message
  }
}

const convertToJson = () => {
  error.value = ''
  try {
    const result = Papa.parse(csvInput.value, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    })
    
    if (result.errors && result.errors.length > 0) {
      error.value = 'CSV Error: ' + (result.errors?.[0]?.message || 'Unknown error')
      return
    }

    jsonInput.value = JSON.stringify(result.data, null, 2)
  } catch (e: any) {
    error.value = 'Conversion Error: ' + e.message
  }
}

const downloadCsv = () => {
  if (!csvInput.value) return
  const blob = new Blob([csvInput.value], { type: 'text/csv;charset=utf-8' })
  saveAs(blob, 'export.csv')
}

// Sample data
const fillSample = () => {
  jsonInput.value = JSON.stringify([
    { name: "John Doe", age: 30, city: "New York" },
    { name: "Jane Smith", age: 25, city: "London" },
    { name: "Bob Johnson", age: 35, city: "Paris" }
  ], null, 2)
  convertToCsv()
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-3 border-b border-border">
      <h2 class="text-lg font-semibold flex items-center gap-2">
        <ArrowRightLeft class="h-5 w-5" />
        JSON <-> CSV Converter
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
      <!-- JSON Pane -->
      <div class="flex-1 flex flex-col border-r border-border min-w-0">
        <div class="bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground flex justify-between items-center border-b border-border">
          <div class="flex items-center gap-1"><FileJson class="h-3 w-3" /> JSON (Array)</div>
          <button @click="convertToCsv" class="bg-primary text-primary-foreground px-3 py-1 rounded text-xs hover:bg-primary/90 cursor-pointer">
            To CSV ->
          </button>
        </div>
        <textarea
          v-model="jsonInput"
          class="flex-1 resize-none p-4 font-mono text-sm focus:outline-none bg-background text-foreground"
          placeholder='[{"name": "Alice", "age": 25}, ...]'
          spellcheck="false"
        ></textarea>
      </div>

      <!-- CSV Pane -->
      <div class="flex-1 flex flex-col min-w-0">
        <div class="bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground flex justify-between items-center border-b border-border">
          <button @click="convertToJson" class="bg-primary text-primary-foreground px-3 py-1 rounded text-xs hover:bg-primary/90 cursor-pointer">
            <- To JSON
          </button>
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1">CSV <FileSpreadsheet class="h-3 w-3" /></div>
            <button 
              @click="downloadCsv" 
              class="text-foreground hover:text-primary cursor-pointer" 
              title="Download CSV"
              v-if="csvInput"
            >
              <Download class="h-4 w-4" />
            </button>
          </div>
        </div>
        <textarea
          v-model="csvInput"
          class="flex-1 resize-none p-4 font-mono text-sm focus:outline-none bg-background text-foreground"
          placeholder="name,age,city..."
          spellcheck="false"
        ></textarea>
      </div>
    </div>
  </div>
</template>
