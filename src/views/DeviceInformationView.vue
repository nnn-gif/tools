<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const deviceInfo = ref({
  userAgent: '',
  platform: '',
  vendor: '',
  language: '',
  cookieEnabled: false,
  onLine: false,
  screenWidth: 0,
  screenHeight: 0,
  colorDepth: 0,
  pixelRatio: 1,
  hardwareConcurrency: 0,
  deviceMemory: 0,
  maxTouchPoints: 0,
  timezone: '',
  connection: {
    effectiveType: '',
    downlink: 0,
    rtt: 0
  }
})

onMounted(() => {
  const nav = navigator as any
  deviceInfo.value = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    vendor: navigator.vendor,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    screenWidth: screen.width,
    screenHeight: screen.height,
    colorDepth: screen.colorDepth,
    pixelRatio: window.devicePixelRatio,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: nav.deviceMemory || 0,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    connection: {
      effectiveType: nav.connection?.effectiveType || 'Unknown',
      downlink: nav.connection?.downlink || 0,
      rtt: nav.connection?.rtt || 0
    }
  }
})
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4 bg-muted/30">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight">Device Information</h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Browser -->
      <Card>
        <CardHeader>
          <CardTitle class="text-sm">Browser</CardTitle>
        </CardHeader>
        <CardContent class="space-y-2 text-sm">
          <div><span class="text-muted-foreground">Vendor:</span> {{ deviceInfo.vendor }}</div>
          <div><span class="text-muted-foreground">Language:</span> {{ deviceInfo.language }}</div>
          <div><span class="text-muted-foreground">Cookies:</span> {{ deviceInfo.cookieEnabled ? 'Enabled' : 'Disabled' }}</div>
          <div><span class="text-muted-foreground">Online:</span> {{ deviceInfo.onLine ? 'Yes' : 'No' }}</div>
        </CardContent>
      </Card>

      <!-- Screen -->
      <Card>
        <CardHeader>
          <CardTitle class="text-sm">Screen</CardTitle>
        </CardHeader>
        <CardContent class="space-y-2 text-sm">
          <div><span class="text-muted-foreground">Resolution:</span> {{ deviceInfo.screenWidth }} x {{ deviceInfo.screenHeight }}</div>
          <div><span class="text-muted-foreground">Color Depth:</span> {{ deviceInfo.colorDepth }}-bit</div>
          <div><span class="text-muted-foreground">Pixel Ratio:</span> {{ deviceInfo.pixelRatio }}x</div>
        </CardContent>
      </Card>

      <!-- Hardware -->
      <Card>
        <CardHeader>
          <CardTitle class="text-sm">Hardware</CardTitle>
        </CardHeader>
        <CardContent class="space-y-2 text-sm">
          <div><span class="text-muted-foreground">Platform:</span> {{ deviceInfo.platform }}</div>
          <div><span class="text-muted-foreground">CPU Cores:</span> {{ deviceInfo.hardwareConcurrency }}</div>
          <div><span class="text-muted-foreground">Memory:</span> {{ deviceInfo.deviceMemory || 'Unknown' }} GB</div>
          <div><span class="text-muted-foreground">Touch Points:</span> {{ deviceInfo.maxTouchPoints }}</div>
        </CardContent>
      </Card>

      <!-- Network -->
      <Card>
        <CardHeader>
          <CardTitle class="text-sm">Network</CardTitle>
        </CardHeader>
        <CardContent class="space-y-2 text-sm">
          <div><span class="text-muted-foreground">Type:</span> {{ deviceInfo.connection.effectiveType }}</div>
          <div><span class="text-muted-foreground">Downlink:</span> {{ deviceInfo.connection.downlink }} Mbps</div>
          <div><span class="text-muted-foreground">RTT:</span> {{ deviceInfo.connection.rtt }} ms</div>
        </CardContent>
      </Card>

      <!-- Timezone -->
      <Card>
        <CardHeader>
          <CardTitle class="text-sm">Location & Time</CardTitle>
        </CardHeader>
        <CardContent class="space-y-2 text-sm">
          <div><span class="text-muted-foreground">Timezone:</span> {{ deviceInfo.timezone }}</div>
        </CardContent>
      </Card>
    </div>

    <!-- User Agent -->
    <Card>
      <CardHeader>
        <CardTitle class="text-sm">User Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="p-3 rounded bg-muted font-mono text-xs break-all">
          {{ deviceInfo.userAgent }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>
