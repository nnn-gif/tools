<script setup lang="ts">
import { ref } from 'vue'
import { format } from 'sql-formatter'
import { Database } from 'lucide-vue-next'

const inputSql = ref('')
const formattedSql = ref('')
const error = ref('')

const formatSql = () => {
  error.value = ''
  if (!inputSql.value) {
    formattedSql.value = ''
    return
  }

  try {
    formattedSql.value = format(inputSql.value, {
      language: 'sql',
      tabWidth: 2,
      keywordCase: 'upper',
    })
  } catch (e: any) {
    error.value = 'Formatting Error: ' + e.message
  }
}

const fillSample = () => {
    inputSql.value = "select id, name, email from users where active = 1 and (role = 'admin' or role = 'superadmin') order by created_at desc"
    formatSql()
}
</script>

<template>
  <div class="flex flex-col h-full bg-background">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-3 border-b border-border">
      <h2 class="text-lg font-semibold flex items-center gap-2">
        <Database class="h-5 w-5" />
        SQL Formatter
      </h2>
      <button 
        @click="fillSample"
        class="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
      >
        Load Sample
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-500/10 text-red-600 dark:text-red-400 px-6 py-2 text-sm">
      {{ error }}
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
        <!-- Input Column -->
        <div class="flex-1 flex flex-col border-r border-border min-w-0">
            <div class="bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground border-b border-border flex justify-between items-center">
                <span>Input SQL</span>
                <button @click="formatSql" class="bg-primary text-primary-foreground px-3 py-1 rounded text-xs hover:bg-primary/90 cursor-pointer">
                    Format ->
                </button>
            </div>
            <textarea
                v-model="inputSql"
                class="flex-1 resize-none p-4 font-mono text-sm focus:outline-none bg-background text-foreground"
                placeholder="SELECT * FROM table..."
                spellcheck="false"
            ></textarea>
        </div>

        <!-- Output Column -->
        <div class="flex-1 flex flex-col min-w-0">
             <div class="bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground border-b border-border">
                Formatted SQL
            </div>
            <pre class="flex-1 p-4 font-mono text-sm overflow-auto bg-background text-foreground whitespace-pre-wrap">{{ formattedSql }}</pre>
        </div>
    </div>
  </div>
</template>
