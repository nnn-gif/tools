<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import {
  FileCode,
  FileJson,
  FileDiff,
  Binary,
  KeyRound,
  Database,
  Fingerprint,
  Type,
  FileType,
  Image as ImageIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Network
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const route = useRoute()
const isHomePage = computed(() => route.name === 'home')

const storedState = localStorage.getItem('sidebarCollapsed')
const isCollapsed = ref(storedState === null ? true : storedState === 'true')

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  localStorage.setItem('sidebarCollapsed', String(isCollapsed.value))
}
</script>

<template>
  <div class="flex h-screen w-screen bg-background text-foreground overflow-hidden">
    <!-- Sidebar -->
    <aside
      v-if="!isHomePage"
      class="flex-shrink-0 border-r border-border bg-muted/10 transition-all duration-300 ease-in-out flex flex-col"
      :class="isCollapsed ? 'w-16' : 'w-64'"
    >
      <div
        class="flex h-14 items-center border-b border-border px-4 transition-all"
        :class="isCollapsed ? 'justify-center' : 'justify-between'"
      >
        <div
          class="flex items-center gap-2 font-bold text-lg overflow-hidden whitespace-nowrap"
          v-if="!isCollapsed"
        >
          <img src="/logo.png" alt="Formatho" class="h-8 w-8 rounded-lg flex-shrink-0" />
          Formatho
        </div>
        <!-- Logo for collapsed state -->
        <img v-else src="/logo.png" alt="Formatho" class="h-8 w-8 rounded-lg flex-shrink-0" />

        <Button
          v-if="!isCollapsed"
          variant="ghost"
          size="icon"
          @click="toggleSidebar"
          class="flex-shrink-0"
        >
          <PanelLeftClose class="h-5 w-5" />
        </Button>
      </div>

      <nav class="flex-1 overflow-y-auto p-4 space-y-6 overflow-x-hidden">
        <div>
          <h3
            class="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground h-4 transition-opacity duration-200"
            :class="isCollapsed ? 'opacity-0' : 'opacity-100'"
          >
            Document
          </h3>
          <div class="space-y-1">
            <RouterLink
              to="/markdown"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground transition-all group overflow-hidden whitespace-nowrap"
              :title="isCollapsed ? 'Markdown Editor' : ''"
            >
              <FileCode class="h-5 w-5 flex-shrink-0" />
              <span
                :class="isCollapsed ? 'opacity-0 w-0' : 'opacity-100'"
                class="transition-all duration-200"
                >Markdown Editor</span
              >
            </RouterLink>
            <RouterLink
              to="/bpmn"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground transition-all group overflow-hidden whitespace-nowrap"
              :title="isCollapsed ? 'BPMN Viewer' : ''"
            >
              <Network class="h-5 w-5 flex-shrink-0" />
              <span
                :class="isCollapsed ? 'opacity-0 w-0' : 'opacity-100'"
                class="transition-all duration-200"
                >BPMN Viewer</span
              >
            </RouterLink>
          </div>
        </div>

        <div>
          <h3
            class="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground h-4 transition-opacity duration-200"
            :class="isCollapsed ? 'opacity-0' : 'opacity-100'"
          >
            Converters
          </h3>
          <div class="space-y-1">
            <RouterLink
              to="/json-yaml"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground transition-all overflow-hidden whitespace-nowrap"
              :title="isCollapsed ? 'JSON <> YAML' : ''"
            >
              <FileJson class="h-5 w-5 flex-shrink-0" />
              <span
                :class="isCollapsed ? 'opacity-0 w-0' : 'opacity-100'"
                class="transition-all duration-200"
                >JSON &lt;&gt; YAML</span
              >
            </RouterLink>
            <RouterLink
              to="/json-csv"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground transition-all overflow-hidden whitespace-nowrap"
              :title="isCollapsed ? 'JSON <> CSV' : ''"
            >
              <FileJson class="h-5 w-5 flex-shrink-0" />
              <span
                :class="isCollapsed ? 'opacity-0 w-0' : 'opacity-100'"
                class="transition-all duration-200"
                >JSON &lt;&gt; CSV</span
              >
            </RouterLink>
          </div>
        </div>

        <div>
          <h3
            class="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground h-4 transition-opacity duration-200"
            :class="isCollapsed ? 'opacity-0' : 'opacity-100'"
          >
            Utilities
          </h3>
          <div class="space-y-1">
            <RouterLink
              to="/diff"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground transition-all overflow-hidden whitespace-nowrap"
              :title="isCollapsed ? 'Diff Checker' : ''"
            >
              <FileDiff class="h-5 w-5 flex-shrink-0" />
              <span
                :class="isCollapsed ? 'opacity-0 w-0' : 'opacity-100'"
                class="transition-all duration-200"
                >Diff Checker</span
              >
            </RouterLink>
            <RouterLink
              to="/base64"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground transition-all overflow-hidden whitespace-nowrap"
              :title="isCollapsed ? 'Base64' : ''"
            >
              <Binary class="h-5 w-5 flex-shrink-0" />
              <span
                :class="isCollapsed ? 'opacity-0 w-0' : 'opacity-100'"
                class="transition-all duration-200"
                >Base64</span
              >
            </RouterLink>
            <RouterLink
              to="/jwt"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground transition-all overflow-hidden whitespace-nowrap"
              :title="isCollapsed ? 'JWT Debugger' : ''"
            >
              <KeyRound class="h-5 w-5 flex-shrink-0" />
              <span
                :class="isCollapsed ? 'opacity-0 w-0' : 'opacity-100'"
                class="transition-all duration-200"
                >JWT Debugger</span
              >
            </RouterLink>
            <RouterLink
              to="/sql"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground transition-all overflow-hidden whitespace-nowrap"
              :title="isCollapsed ? 'SQL Formatter' : ''"
            >
              <Database class="h-5 w-5 flex-shrink-0" />
              <span
                :class="isCollapsed ? 'opacity-0 w-0' : 'opacity-100'"
                class="transition-all duration-200"
                >SQL Formatter</span
              >
            </RouterLink>
          </div>
        </div>

        <div>
          <h3
            class="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground h-4 transition-opacity duration-200"
            :class="isCollapsed ? 'opacity-0' : 'opacity-100'"
          >
            Generators
          </h3>
          <div class="space-y-1">
            <RouterLink
              to="/uuid"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground transition-all overflow-hidden whitespace-nowrap"
              :title="isCollapsed ? 'UUID' : ''"
            >
              <Fingerprint class="h-5 w-5 flex-shrink-0" />
              <span
                :class="isCollapsed ? 'opacity-0 w-0' : 'opacity-100'"
                class="transition-all duration-200"
                >UUID</span
              >
            </RouterLink>
            <RouterLink
              to="/lorem"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground transition-all overflow-hidden whitespace-nowrap"
              :title="isCollapsed ? 'Lorem Ipsum' : ''"
            >
              <Type class="h-5 w-5 flex-shrink-0" />
              <span
                :class="isCollapsed ? 'opacity-0 w-0' : 'opacity-100'"
                class="transition-all duration-200"
                >Lorem Ipsum</span
              >
            </RouterLink>
          </div>
        </div>

        <div>
          <h3
            class="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground h-4 transition-opacity duration-200"
            :class="isCollapsed ? 'opacity-0' : 'opacity-100'"
          >
            Media
          </h3>
          <div class="space-y-1">
            <RouterLink
              to="/image"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground transition-all overflow-hidden whitespace-nowrap"
              :title="isCollapsed ? 'Image Tools' : ''"
            >
              <ImageIcon class="h-5 w-5 flex-shrink-0" />
              <span
                :class="isCollapsed ? 'opacity-0 w-0' : 'opacity-100'"
                class="transition-all duration-200"
                >Image Tools</span
              >
            </RouterLink>
          </div>
        </div>

        <div>
          <h3
            class="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground h-4 transition-opacity duration-200"
            :class="isCollapsed ? 'opacity-0' : 'opacity-100'"
          >
            Linters
          </h3>
          <div class="space-y-1">
            <RouterLink
              to="/json-lint"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground transition-all overflow-hidden whitespace-nowrap"
              :title="isCollapsed ? 'JSON Linter' : ''"
            >
              <FileJson class="h-5 w-5 flex-shrink-0" />
              <span
                :class="isCollapsed ? 'opacity-0 w-0' : 'opacity-100'"
                class="transition-all duration-200"
                >JSON Linter</span
              >
            </RouterLink>
            <RouterLink
              to="/yaml-lint"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.router-link-active]:bg-secondary [&.router-link-active]:text-foreground transition-all overflow-hidden whitespace-nowrap"
              :title="isCollapsed ? 'YAML Linter' : ''"
            >
              <FileType class="h-5 w-5 flex-shrink-0" />
              <span
                :class="isCollapsed ? 'opacity-0 w-0' : 'opacity-100'"
                class="transition-all duration-200"
                >YAML Linter</span
              >
            </RouterLink>
          </div>
        </div>
      </nav>

      <!-- Footer Actions: Sidebar Toggle -->
      <div class="p-4 border-t border-border">
        <Button
          v-if="isCollapsed"
          variant="ghost"
          size="icon"
          @click="toggleSidebar"
          class="w-full"
        >
          <PanelLeftOpen class="h-5 w-5" />
        </Button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden bg-background">
      <RouterView />
    </main>
  </div>
</template>
