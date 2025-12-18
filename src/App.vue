<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useMeta } from './composables/useMeta'

// Initialize dynamic meta tags
useMeta()
</script>

<template>
  <RouterView />
</template>
