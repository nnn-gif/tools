<script setup lang="ts">
import { ref } from 'vue'
import yaml from 'js-yaml'
import { FileJson, FileType, ArrowRightLeft } from 'lucide-vue-next'

const jsonInput = ref('')
const yamlInput = ref('')
const error = ref('')

const convertToYaml = () => {
  error.value = ''
  try {
    const obj = JSON.parse(jsonInput.value)
    yamlInput.value = yaml.dump(obj)
  } catch (e: any) {
    error.value = 'Invalid JSON: ' + e.message
  }
}

const convertToJson = () => {
  error.value = ''
  try {
    const obj = yaml.load(yamlInput.value)
    jsonInput.value = JSON.stringify(obj, null, 2)
  } catch (e: any) {
    error.value = 'Invalid YAML: ' + e.message
  }
}

// Sample data for quick testing
const fillSample = () => {
  jsonInput.value = JSON.stringify({
    name: "DevTools",
    version: 1.0,
    features: ["markdown", "json", "yaml"]
  }, null, 2)
  convertToYaml()
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-3 border-b border-border">
      <h2 class="text-lg font-semibold flex items-center gap-2">
        <ArrowRightLeft class="h-5 w-5" />
        JSON <-> YAML Converter
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
          <div class="flex items-center gap-1"><FileJson class="h-3 w-3" /> JSON</div>
          <button @click="convertToYaml" class="bg-primary text-primary-foreground px-3 py-1 rounded text-xs hover:bg-primary/90 cursor-pointer">
            To YAML ->
          </button>
        </div>
        <textarea
          v-model="jsonInput"
          class="flex-1 resize-none p-4 font-mono text-sm focus:outline-none bg-background text-foreground"
          placeholder='{"key": "value"}'
          spellcheck="false"
        ></textarea>
      </div>

      <!-- YAML Pane -->
      <div class="flex-1 flex flex-col min-w-0">
        <div class="bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground flex justify-between items-center border-b border-border">
          <button @click="convertToJson" class="bg-primary text-primary-foreground px-3 py-1 rounded text-xs hover:bg-primary/90 cursor-pointer">
            <- To JSON
          </button>
          <div class="flex items-center gap-1">YAML <FileType class="h-3 w-3" /></div>
        </div>
        <textarea
          v-model="yamlInput"
          class="flex-1 resize-none p-4 font-mono text-sm focus:outline-none bg-background text-foreground"
          placeholder="key: value"
          spellcheck="false"
        ></textarea>
      </div>
    </div>
  </div>
</template>
