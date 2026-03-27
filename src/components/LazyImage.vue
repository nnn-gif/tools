<template>
  <div
    ref="containerRef"
    class="lazy-image-container"
    :style="containerStyle"
  >
    <!-- Placeholder while loading -->
    <div
      v-if="!isLoaded && !hasError"
      class="lazy-image-placeholder"
      :style="{ aspectRatio: `${width}/${height}` }"
    >
      <slot name="placeholder">
        <div class="skeleton-loader"></div>
      </slot>
    </div>

    <!-- Actual image -->
    <img
      v-show="isLoaded"
      ref="imageRef"
      :src="currentSrc"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="loading"
      :decoding="decoding"
      :class="['lazy-image', { 'fade-in': isLoaded }]"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- Error state -->
    <div
      v-if="hasError"
      class="lazy-image-error"
      :style="{ aspectRatio: `${width}/${height}` }"
    >
      <slot name="error">
        <div class="error-message">Failed to load image</div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  src: string
  alt: string
  width: number
  height: number
  loading?: 'lazy' | 'eager'
  decoding?: 'sync' | 'async' | 'auto'
  placeholder?: string
  rootMargin?: string
  threshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  decoding: 'async',
  placeholder: '',
  rootMargin: '50px',
  threshold: 0.1
})

const emit = defineEmits<{
  load: [Event]
  error: [Event]
  visible: []
}>()

const imageRef = ref<HTMLImageElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const isLoaded = ref(false)
const hasError = ref(false)
const isVisible = ref(false)
let observer: IntersectionObserver | null = null

// Container style to prevent layout shift
const containerStyle = computed(() => ({
  width: props.width ? `${props.width}px` : 'auto',
  height: props.height ? `${props.height}px` : 'auto',
  position: 'relative' as const,
  overflow: 'hidden'
}))

// Current image source
const currentSrc = computed(() => {
  if (props.loading === 'eager') {
    return props.src
  }
  return isVisible.value ? props.src : ''
})

// Handle image load
const handleLoad = (event: Event) => {
  isLoaded.value = true
  hasError.value = false
  emit('load', event)
}

// Handle image error
const handleError = (event: Event) => {
  hasError.value = true
  isLoaded.value = false
  emit('error', event)
}

// Setup intersection observer
onMounted(() => {
  if (props.loading === 'eager') {
    isVisible.value = true
    return
  }

  if ('IntersectionObserver' in window && containerRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            emit('visible')
            
            // Disconnect after first intersection
            if (observer) {
              observer.disconnect()
            }
          }
        })
      },
      {
        rootMargin: props.rootMargin,
        threshold: props.threshold
      }
    )

    observer.observe(containerRef.value)
  } else {
    // Fallback for browsers without IntersectionObserver
    isVisible.value = true
  }
})

// Cleanup observer
onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

// Watch for src changes
watch(() => props.src, () => {
  isLoaded.value = false
  hasError.value = false
  if (props.loading === 'eager') {
    isVisible.value = true
  }
})
</script>

<style scoped>
.lazy-image-container {
  display: inline-block;
  position: relative;
}

.lazy-image {
  display: block;
  max-width: 100%;
  height: auto;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.lazy-image.fade-in {
  opacity: 1;
}

.lazy-image-placeholder,
.lazy-image-error {
  width: 100%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skeleton-loader {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.error-message {
  color: #999;
  font-size: 14px;
  text-align: center;
  padding: 20px;
}
</style>
