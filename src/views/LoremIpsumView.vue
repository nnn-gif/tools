<script setup lang="ts">
import { ref } from 'vue'
import { LoremIpsum } from 'lorem-ipsum'
import { Type, Copy, RefreshCw } from 'lucide-vue-next'

const count = ref(3)
const units = ref<'paragraphs' | 'sentences' | 'words'>('paragraphs')
const generatedText = ref('')

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
})

const generate = () => {
  if (units.value === 'paragraphs') {
    generatedText.value = lorem.generateParagraphs(count.value)
  } else if (units.value === 'sentences') {
    generatedText.value = lorem.generateSentences(count.value)
  } else {
    generatedText.value = lorem.generateWords(count.value)
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(generatedText.value)
}

// Initial Generation
generate()
</script>

<template>
  <div class="flex flex-col h-full bg-background">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-3 border-b border-border">
      <h2 class="text-lg font-semibold flex items-center gap-2">
        <Type class="h-5 w-5" />
        Lorem Ipsum Generator
      </h2>
    </div>

    <!-- Main Content -->
    <div class="p-6 max-w-3xl mx-auto w-full h-full flex flex-col">
        <!-- Controls -->
        <div class="bg-card border border-border rounded-lg p-4 mb-6 shadow-sm">
            <div class="flex flex-col md:flex-row gap-4 items-end">
                <div class="flex flex-col gap-1.5 flex-1">
                    <label class="text-sm font-medium text-muted-foreground">Count</label>
                    <input 
                        v-model.number="count" 
                        type="number" 
                        min="1" 
                        max="100" 
                        class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <div class="flex flex-col gap-1.5 flex-1">
                    <label class="text-sm font-medium text-muted-foreground">Units</label>
                    <select 
                        v-model="units" 
                        class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="paragraphs">Paragraphs</option>
                        <option value="sentences">Sentences</option>
                        <option value="words">Words</option>
                    </select>
                </div>
                <button 
                    @click="generate" 
                    class="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                >
                    <RefreshCw class="mr-2 h-4 w-4" />
                    Generate
                </button>
                <button 
                    @click="copyToClipboard" 
                    class="h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                    :disabled="!generatedText"
                >
                    <Copy class="mr-2 h-4 w-4" />
                    Copy
                </button>
            </div>
        </div>

        <!-- Output -->
        <div class="flex-1 min-h-0 border border-border rounded-lg bg-muted/10 relative overflow-hidden flex flex-col">
            <textarea 
                v-model="generatedText" 
                readonly
                class="flex-1 w-full h-full p-4 bg-transparent resize-none focus:outline-none text-foreground leading-relaxed"
            ></textarea>
        </div>
    </div>
  </div>
</template>
