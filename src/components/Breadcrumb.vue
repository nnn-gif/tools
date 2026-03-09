<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'
import { ChevronRight, Home } from 'lucide-vue-next'

const route = useRoute()

interface BreadcrumbItem {
  name: string
  path: string
  isLast: boolean
}

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = []

  // Always start with Home
  items.push({
    name: 'Home',
    path: '/',
    isLast: pathSegments.length === 0
  })

  // Build breadcrumb path
  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === pathSegments.length - 1

    // Format segment name
    let name = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    // Use route meta title for last segment if available
    if (isLast && route.meta.title) {
      name = route.meta.title as string
    }

    items.push({
      name,
      path: currentPath,
      isLast
    })
  })

  return items
})
</script>

<template>
  <nav v-if="breadcrumbs.length > 1" aria-label="Breadcrumb" class="container mx-auto px-4 py-3">
    <ol class="flex items-center gap-2 text-sm flex-wrap" role="list">
      <li v-for="(item, index) in breadcrumbs" :key="item.path" class="flex items-center gap-2">
        <!-- Separator -->
        <ChevronRight
          v-if="index > 0"
          class="w-4 h-4 text-muted-foreground/50"
          aria-hidden="true"
        />

        <!-- Breadcrumb Item -->
        <RouterLink
          v-if="!item.isLast"
          :to="item.path"
          class="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          <Home v-if="index === 0" class="w-4 h-4" aria-hidden="true" />
          <span>{{ index === 0 ? '' : item.name }}</span>
        </RouterLink>

        <!-- Current Page (not clickable) -->
        <span
          v-else
          class="text-foreground font-medium flex items-center gap-1"
          aria-current="page"
        >
          <Home v-if="index === 0" class="w-4 h-4" aria-hidden="true" />
          <span>{{ index === 0 ? 'Home' : item.name }}</span>
        </span>
      </li>
    </ol>
  </nav>
</template>
