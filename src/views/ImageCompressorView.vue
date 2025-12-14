<script setup lang="ts">
import { ref, computed } from 'vue'
import { Image as ImageIcon, Upload, Download } from 'lucide-vue-next'

const file = ref<File | null>(null)
const previewUrl = ref('')
const compressedUrl = ref('')
const quality = ref(0.8)
const scale = ref(100)
const originalSize = ref(0)
const compressedSize = ref(0)
const isProcessing = ref(false)

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const selected = target.files?.[0]
  if (!selected) return

  file.value = selected
  originalSize.value = selected.size
  previewUrl.value = URL.createObjectURL(selected)
  processImage()
}

const processImage = () => {
  if (!file.value) return
  isProcessing.value = true

  const img = new Image()
  img.src = previewUrl.value
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const width = img.width * (scale.value / 100)
    const height = img.height * (scale.value / 100)

    canvas.width = width
    canvas.height = height

    ctx?.drawImage(img, 0, 0, width, height)

    canvas.toBlob(
      (blob) => {
        if (!blob) return
        if (compressedUrl.value) URL.revokeObjectURL(compressedUrl.value)
        
        compressedUrl.value = URL.createObjectURL(blob)
        compressedSize.value = blob.size
        isProcessing.value = false
      },
      file.value?.type || 'image/jpeg',
      quality.value
    )
  }
}

const downloadCompressed = () => {
  if (!compressedUrl.value) return
  const link = document.createElement('a')
  link.href = compressedUrl.value
  link.download = `compressed_${file.value?.name}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const compressionRatio = computed(() => {
  if (originalSize.value === 0 || compressedSize.value === 0) return 0
  return Math.round((1 - compressedSize.value / originalSize.value) * 100)
})
</script>

<template>
  <div class="flex flex-col h-full bg-background">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-3 border-b border-border">
      <h2 class="text-lg font-semibold flex items-center gap-2">
        <ImageIcon class="h-5 w-5" />
        Image Compressor
      </h2>
    </div>

    <!-- Main Content -->
    <div class="p-6 h-full overflow-y-auto">
      <div v-if="!file" class="h-full flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg bg-muted/5">
        <div class="flex flex-col items-center gap-4 text-center">
          <div class="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
             <Upload class="h-8 w-8 text-muted-foreground" />
          </div>
          <div class="space-y-1">
            <h3 class="font-semibold text-lg">Upload an image</h3>
            <p class="text-sm text-muted-foreground">Drag and drop or click to upload</p>
          </div>
          <label class="cursor-pointer">
            <input type="file" accept="image/*" class="hidden" @change="handleFileUpload">
            <span class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Select File
            </span>
          </label>
        </div>
      </div>

      <div v-else class="flex flex-col lg:flex-row gap-6 h-full">
        <!-- Controls Column -->
        <div class="w-full lg:w-80 flex flex-col gap-6 shrink-0">
          <div class="rounded-lg border border-border bg-card p-4 shadow-sm">
            <h3 class="font-semibold mb-4">Settings</h3>
            
            <div class="space-y-6">
              <div class="space-y-2">
                <div class="flex justify-between">
                  <label class="text-sm font-medium">Quality</label>
                  <span class="text-sm text-muted-foreground">{{ Math.round(quality * 100) }}%</span>
                </div>
                <input 
                  type="range" 
                  v-model.number="quality" 
                  min="0.1" 
                  max="1" 
                  step="0.1" 
                  @input="processImage"
                  class="w-full"
                >
              </div>

              <div class="space-y-2">
                <div class="flex justify-between">
                  <label class="text-sm font-medium">Scale (Resize)</label>
                  <span class="text-sm text-muted-foreground">{{ scale }}%</span>
                </div>
                <input 
                  type="range" 
                  v-model.number="scale" 
                  min="10" 
                  max="100" 
                  step="10" 
                  @input="processImage"
                  class="w-full"
                >
              </div>
            </div>
          </div>

          <div class="rounded-lg border border-border bg-card p-4 shadow-sm space-y-4">
            <div class="flex justify-between items-center pb-4 border-b border-border">
              <span class="text-sm text-muted-foreground">Original</span>
              <span class="font-mono text-sm">{{ formatSize(originalSize) }}</span>
            </div>
            <div class="flex justify-between items-center pb-4 border-b border-border">
              <span class="text-sm text-muted-foreground">Compressed</span>
              <span class="font-mono text-sm font-bold text-green-600 dark:text-green-400">{{ formatSize(compressedSize) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-muted-foreground">Savings</span>
              <span class="font-mono text-sm font-bold">{{ compressionRatio }}%</span>
            </div>

            <button 
              @click="downloadCompressed"
              class="w-full mt-4 flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
              :disabled="isProcessing"
            >
              <Download class="h-4 w-4" />
              Download
            </button>
             <label class="block w-full mt-2 cursor-pointer">
                <input type="file" accept="image/*" class="hidden" @change="handleFileUpload">
                <span class="w-full flex items-center justify-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">
                  <Upload class="h-4 w-4" />
                  New Image
                </span>
            </label>
          </div>
        </div>

        <!-- Preview Column -->
        <div class="flex-1 min-h-0 bg-muted/10 border border-border rounded-lg flex items-center justify-center p-4 overflow-hidden relative">
           <div class="absolute inset-0 flex items-center justify-center pointer-events-none" v-if="isProcessing">
             <div class="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm font-medium animate-pulse">
               Processing...
             </div>
           </div>
           
           <div class="grid grid-cols-2 gap-4 w-full h-full max-w-4xl" v-if="previewUrl && compressedUrl">
              <div class="flex flex-col gap-2 min-h-0">
                  <span class="text-xs text-center font-medium text-muted-foreground uppercase">Original</span>
                  <div class="flex-1 relative border border-border rounded-lg overflow-hidden bg-checkerboard">
                      <img :src="previewUrl" class="absolute inset-0 w-full h-full object-contain">
                  </div>
              </div>
              <div class="flex flex-col gap-2 min-h-0">
                  <span class="text-xs text-center font-medium text-muted-foreground uppercase">Compressed</span>
                  <div class="flex-1 relative border border-border rounded-lg overflow-hidden bg-checkerboard">
                      <img :src="compressedUrl" class="absolute inset-0 w-full h-full object-contain">
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-checkerboard {
  background-image:
    linear-gradient(45deg, #808080 25%, transparent 25%),
    linear-gradient(-45deg, #808080 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #808080 75%),
    linear-gradient(-45deg, transparent 75%, #808080 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  background-color: #f0f0f0;
}
.dark .bg-checkerboard {
  background-color: #1a1a1a;
  background-image:
    linear-gradient(45deg, #333 25%, transparent 25%),
    linear-gradient(-45deg, #333 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #333 75%),
    linear-gradient(-45deg, transparent 75%, #333 75%);
}
</style>
