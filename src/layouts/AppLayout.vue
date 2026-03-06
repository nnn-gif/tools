<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import LiveSiteAnalytics from '@/components/LiveSiteAnalytics.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background">
    <Navbar />
    <main class="flex-1">
      <RouterView />
    </main>
    <Footer />
    
    <!-- Live Analytics Widget -->
    <LiveSiteAnalytics />
  </div>
</template>
