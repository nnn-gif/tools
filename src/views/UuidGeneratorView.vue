<script setup lang="ts">
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { Fingerprint, Copy, RefreshCw } from 'lucide-vue-next'

const count = ref(1)
const uuids = ref<string[]>([])

const generate = () => {
  uuids.value = Array.from({ length: count.value }, () => uuidv4())
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

const copyAll = () => {
  navigator.clipboard.writeText(uuids.value.join('\n'))
}

// Initial Generation
generate()
</script>

<template>
  <div class="flex flex-col h-full bg-background">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-3 border-b border-border">
      <h2 class="text-lg font-semibold flex items-center gap-2">
        <Fingerprint class="h-5 w-5" />
        UUID Generator
      </h2>
    </div>

    <!-- Main Content -->
    <div class="p-6 max-w-2xl mx-auto w-full">
        <!-- Controls -->
        <div class="flex items-end gap-4 mb-6">
            <div class="flex flex-col gap-1.5 flex-1">
                <label class="text-sm font-medium text-muted-foreground">Quantity</label>
                <input 
                    v-model.number="count" 
                    type="number" 
                    min="1" 
                    max="100" 
                    class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>
            <button 
                @click="generate" 
                class="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
            >
                <RefreshCw class="mr-2 h-4 w-4" />
                Generate
            </button>
             <button 
                @click="copyAll" 
                class="h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                :disabled="uuids.length === 0"
            >
                <Copy class="mr-2 h-4 w-4" />
                Copy All
            </button>
        </div>

        <!-- Output List -->
        <div class="space-y-2">
            <div 
                v-for="(uuid, index) in uuids" 
                :key="index"
                class="flex items-center justify-between p-3 rounded-md border border-border bg-card text-card-foreground shadow-sm hover:bg-muted/50 transition-colors group"
            >
                <code class="text-sm font-mono">{{ uuid }}</code>
                <button 
                    @click="copyToClipboard(uuid)"
                    class="text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Copy"
                >
                    <Copy class="h-4 w-4" />
                </button>
            </div>
        </div>
    </div>
  </div>
</template>
