<script setup lang="ts">
import { ref, watch } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { KeyRound, ShieldAlert } from 'lucide-vue-next'

const token = ref('')
const header = ref('')
const payload = ref('')
const error = ref('')

const decodeToken = () => {
  error.value = ''
  if (!token.value) {
    header.value = ''
    payload.value = ''
    return
  }

  try {
    const decodedHeader = jwtDecode(token.value, { header: true })
    const decodedPayload = jwtDecode(token.value)

    header.value = JSON.stringify(decodedHeader, null, 2)
    payload.value = JSON.stringify(decodedPayload, null, 2)
  } catch (e: any) {
    error.value = 'Invalid JWT: ' + e.message
    header.value = ''
    payload.value = ''
  }
}

watch(token, decodeToken)

const fillSample = () => {
    // A dummy JWT for testing
    token.value = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
</script>

<template>
  <div class="flex flex-col h-full bg-background">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-3 border-b border-border">
      <h2 class="text-lg font-semibold flex items-center gap-2">
        <KeyRound class="h-5 w-5" />
        JWT Debugger
      </h2>
      <button 
        @click="fillSample"
        class="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
      >
        Load Sample
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-500/10 text-red-600 dark:text-red-400 px-6 py-2 text-sm flex items-center gap-2">
      <ShieldAlert class="h-4 w-4" />
      {{ error }}
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col md:flex-row overflow-hidden">
        <!-- Input Column -->
        <div class="md:w-1/3 flex flex-col border-b md:border-b-0 md:border-r border-border h-1/2 md:h-full min-w-0">
            <div class="bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground border-b border-border">
                Encoded Token
            </div>
            <textarea
                v-model="token"
                class="flex-1 resize-none p-4 font-mono text-sm focus:outline-none bg-background text-foreground"
                placeholder="Paste JWT here..."
                spellcheck="false"
            ></textarea>
        </div>

        <!-- Output Column -->
        <div class="flex-1 flex flex-col h-1/2 md:h-full min-w-0 overflow-y-auto">
             <!-- Header Section -->
             <div class="flex-1 flex flex-col border-b border-border min-h-0">
                <div class="bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground border-b border-border">
                    Header
                </div>
                <pre class="flex-1 p-4 font-mono text-xs overflow-auto bg-background text-foreground">{{ header }}</pre>
             </div>

             <!-- Payload Section -->
             <div class="flex-[2] flex flex-col min-h-0">
                <div class="bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground border-b border-border">
                    Payload
                </div>
                <pre class="flex-1 p-4 font-mono text-xs overflow-auto bg-background text-foreground">{{ payload }}</pre>
             </div>
        </div>
    </div>
  </div>
</template>
