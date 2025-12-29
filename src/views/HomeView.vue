<script setup lang="ts">
import { RouterLink } from 'vue-router'
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
  Network
} from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const tools = [
  {
    category: 'Document',
    items: [
      {
        name: 'Markdown Editor',
        description:
          'Edit and preview Markdown files in real-time. Privacy-first markdown editor that runs 100% client-side.',
        icon: FileCode,
        route: '/markdown'
      },
      {
        name: 'BPMN Viewer',
        description:
          'Visualize BPMN 2.0 diagrams and export them as PDF. Free, privacy-first BPMN viewer.',
        icon: Network,
        route: '/bpmn'
      }
    ]
  },
  {
    category: 'Converters',
    items: [
      {
        name: 'JSON <> YAML',
        description:
          'Convert JSON to YAML and YAML to JSON instantly. Free, privacy-first converter.',
        icon: FileJson,
        route: '/json-yaml'
      },
      {
        name: 'JSON <> CSV',
        description:
          'Convert JSON to CSV and CSV to JSON format instantly. Free, client-side converter.',
        icon: FileJson,
        route: '/json-csv'
      }
    ]
  },
  {
    category: 'Utilities',
    items: [
      {
        name: 'Diff Checker',
        description: 'Compare two texts and see the differences highlighted. Free diff tool.',
        icon: FileDiff,
        route: '/diff'
      },
      {
        name: 'Base64',
        description: 'Encode and decode Base64 strings instantly. Free, privacy-first Base64 tool.',
        icon: Binary,
        route: '/base64'
      },
      {
        name: 'JWT Debugger',
        description:
          'Decode and inspect JWT tokens instantly. View JWT header, payload, and signature.',
        icon: KeyRound,
        route: '/jwt'
      },
      {
        name: 'SQL Formatter',
        description:
          'Format and beautify SQL queries instantly. Free SQL formatter with multiple dialects.',
        icon: Database,
        route: '/sql'
      }
    ]
  },
  {
    category: 'Generators',
    items: [
      {
        name: 'UUID',
        description:
          'Generate UUIDs (Universally Unique Identifiers) instantly. Supports v1, v4, and more.',
        icon: Fingerprint,
        route: '/uuid'
      },
      {
        name: 'Lorem Ipsum',
        description:
          'Generate Lorem Ipsum placeholder text instantly. Customize paragraphs, words, and sentences.',
        icon: Type,
        route: '/lorem'
      }
    ]
  },
  {
    category: 'Media',
    items: [
      {
        name: 'Image Tools',
        description:
          'Compress and optimize images instantly. Reduce image file size while maintaining quality.',
        icon: ImageIcon,
        route: '/image'
      }
    ]
  },
  {
    category: 'Linters',
    items: [
      {
        name: 'JSON Linter',
        description: 'Validate and lint JSON code instantly. Find syntax errors and format JSON.',
        icon: FileJson,
        route: '/json-lint'
      },
      {
        name: 'YAML Linter',
        description: 'Validate and lint YAML code instantly. Find syntax errors and format YAML.',
        icon: FileType,
        route: '/yaml-lint'
      }
    ]
  }
]
</script>

<template>
  <div class="flex flex-col h-full overflow-y-auto bg-background">
    <!-- Hero Section -->
    <section class="border-b border-border bg-muted/10">
      <div class="container mx-auto px-6 py-16 md:py-24">
        <div class="flex flex-col items-center text-center space-y-6">
          <div class="flex items-center gap-3">
            <img src="/logo.png" alt="Formatho" class="h-16 w-16 rounded-lg" />
            <h1 class="text-4xl md:text-5xl font-bold tracking-tight">Formatho</h1>
          </div>
          <p class="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            The Privacy-First Online Text & Developer Utility Toolkit
          </p>
          <p class="text-base md:text-lg text-muted-foreground max-w-xl">
            Fast, secure, privacy-first collection of online text formatting tools, developer
            utilities, and content productivity tools — built to solve everyday formatting,
            conversion, and debugging problems directly in your browser.
          </p>
          <div class="flex flex-wrap gap-2 justify-center mt-4">
            <span
              class="px-3 py-1 text-sm rounded-md bg-primary/10 text-primary border border-primary/20"
            >
              No sign-up
            </span>
            <span
              class="px-3 py-1 text-sm rounded-md bg-primary/10 text-primary border border-primary/20"
            >
              No uploads
            </span>
            <span
              class="px-3 py-1 text-sm rounded-md bg-primary/10 text-primary border border-primary/20"
            >
              No tracking
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Tools Section -->
    <section class="container mx-auto px-6 py-12">
      <div class="space-y-12">
        <div v-for="category in tools" :key="category.category" class="space-y-4">
          <h2 class="text-2xl font-semibold tracking-tight">{{ category.category }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <RouterLink
              v-for="tool in category.items"
              :key="tool.name"
              :to="tool.route"
              class="group"
            >
              <Card
                class="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer"
              >
                <CardHeader>
                  <div class="flex items-center gap-3 mb-2">
                    <component :is="tool.icon" class="h-6 w-6 text-primary flex-shrink-0" />
                    <CardTitle class="group-hover:text-primary transition-colors">
                      {{ tool.name }}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{{ tool.description }}</CardDescription>
                </CardContent>
              </Card>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
