<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { 
  FileCode, 
  FileJson, 
  FileDiff, 
  Binary, 
  KeyRound, 
  Database,
  Fingerprint,
  Type,
  Image as ImageIcon
} from 'lucide-vue-next'
</script>

<template>
  <div class="flex h-screen w-screen bg-background text-foreground overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 flex-shrink-0 border-r border-border bg-muted/10">
      <div class="flex h-14 items-center border-b border-border px-6">
        <div class="flex items-center gap-2 font-bold text-lg">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Binary class="h-5 w-5" />
          </div>
          DevTools
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 class="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">Document</h3>
          <div class="space-y-1">
            <RouterLink to="/" class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground">
              <FileCode class="h-4 w-4" />
              Markdown Editor
            </RouterLink>
          </div>
        </div>

        <div>
          <h3 class="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">Converters</h3>
          <div class="space-y-1">
            <RouterLink to="/json-yaml" class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground">
              <FileJson class="h-4 w-4" />
              JSON <> YAML
            </RouterLink>
            <RouterLink to="/json-csv" class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground">
              <FileJson class="h-4 w-4" />
              JSON <> CSV
            </RouterLink>
          </div>
        </div>

        <div>
          <h3 class="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">Utilities</h3>
          <div class="space-y-1">
            <RouterLink to="/diff" class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground">
              <FileDiff class="h-4 w-4" />
              Diff Checker
            </RouterLink>
            <RouterLink to="/base64" class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground">
              <Binary class="h-4 w-4" />
              Base64
            </RouterLink>
            <RouterLink to="/jwt" class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground">
              <KeyRound class="h-4 w-4" />
              JWT Debugger
            </RouterLink>
            <RouterLink to="/sql" class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground">
              <Database class="h-4 w-4" />
              SQL Formatter
            </RouterLink>
          </div>
        </div>

        <div>
          <h3 class="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">Generators</h3>
          <div class="space-y-1">
            <RouterLink to="/uuid" class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground">
              <Fingerprint class="h-4 w-4" />
              UUID
            </RouterLink>
            <RouterLink to="/lorem" class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground">
              <Type class="h-4 w-4" />
              Lorem Ipsum
            </RouterLink>
          </div>
        </div>

        <div>
          <h3 class="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">Media</h3>
          <div class="space-y-1">
            <RouterLink to="/image" class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground">
              <ImageIcon class="h-4 w-4" />
              Image Tools
            </RouterLink>
          </div>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden bg-background">
      <RouterView />
    </main>
  </div>
</template>
