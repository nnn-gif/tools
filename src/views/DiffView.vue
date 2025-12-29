<script setup lang="ts">
import { ref, watch } from 'vue'
import * as Diff from 'diff'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const originalText = ref('')
const modifiedText = ref('')
const diffResult = ref<any[]>([])

const computeDiff = () => {
  if (!originalText.value && !modifiedText.value) {
    diffResult.value = []
    return
  }
  const diffs = Diff.diffLines(originalText.value, modifiedText.value)
  diffResult.value = diffs
}

watch([originalText, modifiedText], computeDiff)

const fillSample = () => {
  originalText.value = `Hello World\nThis is a test file.\nIt has some lines.`
  modifiedText.value = `Hello World!\nThis is a test file.\nIt has changed lines.`
}
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4 bg-muted/30">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight">Diff Checker</h1>
      <Button variant="ghost" @click="fillSample">Load Sample</Button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
      <!-- Inputs Column -->
      <div class="flex flex-col gap-4 min-h-0">
        <Card class="flex-1 flex flex-col min-h-0">
          <CardHeader class="py-2">
            <CardTitle class="text-sm font-medium">Original Text</CardTitle>
          </CardHeader>
          <CardContent class="flex-1 min-h-0">
            <Textarea
              v-model="originalText"
              class="h-full resize-none font-mono"
              placeholder="Paste original text here..."
            />
          </CardContent>
        </Card>
        <Card class="flex-1 flex flex-col min-h-0">
          <CardHeader class="py-2">
            <CardTitle class="text-sm font-medium">Modified Text</CardTitle>
          </CardHeader>
          <CardContent class="flex-1 min-h-0">
            <Textarea
              v-model="modifiedText"
              class="h-full resize-none font-mono"
              placeholder="Paste modified text here..."
            />
          </CardContent>
        </Card>
      </div>

      <!-- Result Column -->
      <Card class="flex flex-col min-h-0 bg-muted/50">
        <CardHeader class="py-2">
          <CardTitle class="text-sm font-medium">Difference</CardTitle>
        </CardHeader>
        <CardContent class="flex-1 min-h-0 overflow-auto">
          <div class="font-mono text-sm whitespace-pre-wrap p-2">
            <span
              v-for="(part, index) in diffResult"
              :key="index"
              :class="{
                'bg-success/20 text-success': part.added,
                'bg-destructive/20 text-destructive': part.removed,
                'text-muted-foreground': !part.added && !part.removed
              }"
              >{{ part.value }}</span
            >
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
