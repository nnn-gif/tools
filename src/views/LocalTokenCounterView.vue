<script setup lang="ts">
// Note: AOS is initialized globally in main.ts to avoid conflicts
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div
        class="text-center mb-12"
        data-aos="fade-up"
        data-aos-duration="400"
      >
        <h1 class="text-4xl font-bold mb-4">Local Token Counter</h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Client-side LLM token counter. 100% private, no API calls.
        </p>
      </div>

      <!-- Tool Container -->
      <div
        class="glass-card p-8"
        data-aos="fade-up"
        data-aos-duration="400"
        data-aos-delay="100"
      >
        <div class="text-center py-12">
          <p class="text-muted-foreground">
            Tool loaded successfully. Implementation coming soon.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
