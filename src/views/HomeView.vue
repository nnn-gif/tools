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
  Network,
  Calculator,
  Hash,
  ShieldCheck
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
  },
  {
    category: 'Blockchain',
    items: [
      {
        name: 'EVM Unit Converter',
        description:
          'Convert between Wei, Gwei, and Ether instantly. Essential tool for Ethereum developers.',
        icon: Calculator,
        route: '/evm-converter'
      },
      {
        name: 'Keccak-256 Hasher',
        description:
          'Generate Keccak-256 hashes online. Secure, client-side hashing for Ethereum development.',
        icon: Hash,
        route: '/keccak256'
      },
      {
        name: 'Address Checksum',
        description:
          'Validate and checksum Ethereum addresses (EIP-55). Ensure correct address formatting.',
        icon: ShieldCheck,
        route: '/address-checksum'
      }
    ]
  }
]
</script>

<template>
  <div class="flex flex-col h-full overflow-y-auto bg-background">
    <!-- Hero Section -->
    <section
      class="border-b border-border bg-gradient-to-b from-muted/20 via-muted/10 to-background"
    >
      <div class="container mx-auto px-6 py-20 md:py-28">
        <div class="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <div class="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="Formatho"
              class="h-20 w-20 md:h-24 md:w-24 rounded-xl shadow-lg"
            />
            <h1
              class="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
            >
              Formatho
            </h1>
          </div>
          <p class="text-2xl md:text-3xl font-semibold text-foreground max-w-3xl leading-tight">
            The Privacy-First Online Text & Developer Utility Toolkit
          </p>
          <p class="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Fast, secure, privacy-first collection of online text formatting tools, developer
            utilities, and content productivity tools — built to solve everyday formatting,
            conversion, and debugging problems directly in your browser.
          </p>
          <div class="flex flex-wrap gap-3 justify-center mt-2">
            <span
              class="px-4 py-2 text-sm font-medium rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors"
            >
              No sign-up
            </span>
            <span
              class="px-4 py-2 text-sm font-medium rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors"
            >
              No uploads
            </span>
            <span
              class="px-4 py-2 text-sm font-medium rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors"
            >
              No tracking
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Tools Section -->
    <section class="container mx-auto px-6 py-12 md:py-16">
      <div class="space-y-16">
        <div v-for="category in tools" :key="category.category" class="space-y-6">
          <div class="flex items-center gap-3">
            <h2 class="text-3xl font-bold tracking-tight">{{ category.category }}</h2>
            <div class="flex-1 h-px bg-border"></div>
            <span class="text-sm text-muted-foreground font-medium">
              {{ category.items.length }} {{ category.items.length === 1 ? 'tool' : 'tools' }}
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RouterLink
              v-for="tool in category.items"
              :key="tool.name"
              :to="tool.route"
              class="group"
            >
              <Card
                class="h-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50 hover:-translate-y-1 cursor-pointer border-2"
              >
                <CardHeader>
                  <div class="flex items-start gap-4">
                    <div
                      class="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors"
                    >
                      <component :is="tool.icon" class="h-5 w-5 text-primary flex-shrink-0" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <CardTitle
                        class="group-hover:text-primary transition-colors text-lg leading-tight"
                      >
                        {{ tool.name }}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription class="leading-relaxed">{{ tool.description }}</CardDescription>
                </CardContent>
              </Card>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
