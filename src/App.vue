<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useMeta } from './composables/useMeta'
import { useStructuredData } from './composables/useStructuredData'

// Initialize dynamic meta tags
useMeta()

// Initialize structured data (JSON-LD)
useStructuredData()
</script>

<template>
  <RouterView />
</template>
