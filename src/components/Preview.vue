<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'

const props = defineProps<{
  markdown: string
}>()

const htmlContent = ref('')

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeHighlight)
  .use(rehypeStringify)

watchEffect(async () => {
  try {
    const file = await processor.process(props.markdown)
    htmlContent.value = String(file)
  } catch (err) {
    console.error('Markdown processing failed', err)
    htmlContent.value = '<p class="text-destructive">Error rendering markdown</p>'
  }
})
</script>

<template>
  <div class="h-full w-full overflow-auto bg-white p-8 dark:bg-[#0d1117]" id="preview-content">
    <article class="markdown-body bg-transparent" v-html="htmlContent"></article>
  </div>
</template>
