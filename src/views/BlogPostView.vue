<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-vue-next'
import { marked } from 'marked'

const route = useRoute()
const router = useRouter()

// Blog post content database
const blogPosts: Record<string, any> = {
  'privacy-first-tools': {
    id: 1,
    title: 'Building Privacy-First Developer Tools',
    date: '2026-03-01',
    readTime: '5 min',
    tags: ['Privacy', 'Development'],
    content: `
# Building Privacy-First Developer Tools

At Formatho, we believe that your data belongs to you. In an age where data collection has become the norm, we've chosen a different path.

## Why Privacy-First Matters

When you use online developer tools, you're often pasting sensitive information: API keys, configuration files, database credentials, and more. Traditional online tools send this data to external servers for processing, creating potential security risks.

Our approach is different: **all processing happens in your browser**.

## How We Do It

### Client-Side Processing
Every tool on Formatho runs 100% in your browser using JavaScript. This means:
- Your data never leaves your machine
- No server roundtrips mean instant results
- Works offline once loaded
- No accounts or tracking required

### No Data Collection
We don't store, log, or transmit any data you process. Period. Your privacy is built into our architecture, not bolted on as an afterthought.

## The Technical Implementation

Our tools leverage modern browser APIs and WebAssembly for performance-intensive operations:

\`\`\`javascript
// Example: All processing happens locally
const hashedValue = await crypto.subtle.digest('SHA-256', data)
// Your data never leaves the browser
\`\`\`

## Benefits for Developers

1. **Security**: Process sensitive data without worrying about server breaches
2. **Speed**: No network latency means instant results
3. **Reliability**: Works offline, no server downtime
4. **Trust**: Open-source code you can inspect yourself

## Try Our Tools

Ready to experience privacy-first development? Check out our suite of tools including:
- [JSON Formatter](/tools/json-lint)
- [JWT Debugger](/tools/jwt)
- [Hash Generator](/tools/hash-text)
- [Base64 Encoder](/tools/base64)

## Conclusion

Privacy isn't a feature—it's a fundamental right. By keeping all processing local, we ensure your data stays yours. This is the future of developer tools, and we're proud to be building it.

---

*Have questions? [Check out our About page](/tools/about) to learn more about our mission.*
    `
  },
  'agent-orchestrator-intro': {
    id: 2,
    title: 'Introducing Agent Orchestrator',
    date: '2026-02-15',
    readTime: '7 min',
    tags: ['AI', 'Productivity'],
    content: `
# Introducing Agent Orchestrator

We're excited to introduce Agent Orchestrator, our flagship desktop application that's redefining how developers work with AI agents.

## The Problem

As developers, we spend countless hours on repetitive tasks:
- Writing boilerplate code
- Reviewing pull requests
- Updating documentation
- Running tests and fixing bugs

What if you could delegate these tasks to AI workers that run in the background?

## What is Agent Orchestrator?

Agent Orchestrator is a desktop application that lets you:
- **Spin up AI workers** with simple text commands
- **Let them run tasks** autonomously in the background
- **Check results** when you're ready
- **Maintain full control** over what they do

### Key Features

1. **Natural Language Interface**: Describe what you need in plain English
2. **Autonomous Execution**: Agents work independently, you approve changes
3. **Local-First**: Runs on your machine, your code stays private
4. **Multi-Agent Workflows**: Coordinate multiple AI workers on complex tasks

## How It Works

\`\`\`bash
# Example command
"Review the PR, update the tests, and create a summary"

# Agent Orchestrator:
1. Fetches the PR
2. Analyzes code changes
3. Updates relevant tests
4. Generates documentation
5. Creates a summary report
\`\`\`

## Architecture

Agent Orchestrator uses a modular architecture:

- **Task Parser**: Understands natural language commands
- **Agent Manager**: Coordinates multiple AI workers
- **Tool Integration**: Connects with your dev tools (Git, GitHub, IDE)
- **Sandbox**: Safe execution environment for agent actions

## Use Cases

### 1. Code Review Automation
\`\`\`
"Review the authentication module for security issues"
\`\`\`
The agent analyzes code, checks for vulnerabilities, and suggests improvements.

### 2. Documentation Generation
\`\`\`
"Update the README with the new API endpoints"
\`\`\`
The agent reads your code and generates documentation automatically.

### 3. Refactoring Assistance
\`\`\`
"Convert class components to hooks in the dashboard"
\`\`\`
The agent identifies class components and modernizes them.

## Privacy & Security

Unlike cloud-based AI tools, Agent Orchestrator runs locally:
- Your code never leaves your machine
- No API keys stored on external servers
- Full audit trail of all agent actions
- You approve every change before it's applied

## Getting Started

Agent Orchestrator is currently in development. [Sign up for early access](/tools/agent-orchestrator) to be notified when it launches.

## The Future of Development

We believe AI agents will become an essential part of every developer's toolkit. Not to replace developers, but to amplify their capabilities and eliminate drudgery.

Agent Orchestrator is our vision for this future—one where you focus on creative problem-solving while AI handles the routine.

---

*Want to learn more about our mission? [Visit our About page](/tools/about).*
    `
  },
  'future-web-dev-tools': {
    id: 3,
    title: 'The Future of Web Development Tools',
    date: '2026-02-01',
    readTime: '6 min',
    tags: ['Web Dev', 'Trends'],
    content: `
# The Future of Web Development Tools

The landscape of web development tools is evolving rapidly. Let's explore the trends shaping the future and what they mean for developers.

## Current State of Developer Tools

Today's developer tools fall into three categories:

1. **Desktop Applications**: VS Code, Postman, Figma
2. **Web-Based Tools**: Online formatters, converters, debuggers
3. **CLI Tools**: Git, npm, docker

Each has tradeoffs between convenience, privacy, and functionality.

## Emerging Trends

### 1. Privacy-First Architecture

**The Problem**: Traditional online tools require sending data to external servers.

**The Future**: Client-side processing with WebAssembly and improved browser APIs.

\`\`\`javascript
// Future: High-performance client-side processing
const result = await wasmModule.process(largeDataset)
// Everything stays local
\`\`\`

### 2. AI-Powered Assistance

AI is transforming how we interact with tools:
- **Intelligent autocomplete** that understands context
- **Automated code review** with security analysis
- **Natural language interfaces** for complex operations

### 3. Local-First Development

The shift toward local-first is driven by:
- Privacy concerns
- Performance requirements
- Offline needs
- Data sovereignty regulations

### 4. Unified Tool Platforms

Instead of juggling dozens of specialized tools, developers are moving toward unified platforms that offer:
- Consistent interfaces
- Integrated workflows
- Shared configuration

## Technical Innovations Driving Change

### WebAssembly (Wasm)
Enables near-native performance in browsers:
\`\`\`
Traditional JS: ~100ms
Wasm: ~10ms
\`\`\`

### Web Components
Reusable, framework-agnostic UI components:
\`\`\`html
<json-formatter data={myData}></json-formatter>
\`\`\`

### Service Workers
Offline-first applications with intelligent caching.

## Predictions for 2026-2027

### 1. Hybrid Tools
Tools that work seamlessly online and offline:
- Sync when connected
- Work offline with cached data
- Merge changes intelligently

### 2. Collaborative Development
Real-time collaboration baked into every tool:
- Live editing sessions
- Shared debugging
- Collaborative code review

### 3. Intelligent Automation
AI agents that understand your workflow:
- Anticipate needs
- Suggest optimizations
- Automate repetitive tasks

## What This Means for Formatho

We're building toward this future with:
- **100% client-side processing** for privacy
- **Open-source transparency** for trust
- **AI agent integration** for productivity
- **Comprehensive tool suite** for convenience

## Preparing for the Future

To stay ahead:

1. **Embrace Client-Side Tools**: Prioritize privacy and performance
2. **Learn WebAssembly**: Understand when to use native-speed processing
3. **Think Local-First**: Design for offline capability
4. **Integrate AI**: Use AI assistants to boost productivity

## Conclusion

The future of web development tools is **private**, **powerful**, and **intelligent**. At Formatho, we're committed to building tools that embody these principles.

The best tools don't just solve problems—they anticipate them. They don't just work—they work *for* you.

---

*Explore our [privacy-first tools](/tools) and experience the future today.*
    `
  }
}

const slug = computed(() => route.params.slug as string)
const post = ref<any>(null)
const loading = ref(true)
const error = ref(false)

onMounted(() => {
  // Simulate loading for better UX
  setTimeout(() => {
    if (blogPosts[slug.value]) {
      post.value = blogPosts[slug.value]
      loading.value = false
    } else {
      error.value = true
      loading.value = false
    }
  }, 300)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const goBack = () => {
  router.push('/blogs')
}
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-20">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p class="mt-4 text-muted-foreground">Loading article...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <h1 class="text-3xl font-bold mb-4">Article Not Found</h1>
      <p class="text-muted-foreground mb-6">
        The blog post you're looking for doesn't exist or has been removed.
      </p>
      <button
        @click="goBack"
        class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
      >
        <ArrowLeft class="w-4 h-4" />
        Back to Blog
      </button>
    </div>

    <!-- Blog Post Content -->
    <article v-else class="max-w-4xl mx-auto">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        Back to Blog
      </button>

      <!-- Header -->
      <header class="mb-12">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">{{ post.title }}</h1>

        <!-- Meta -->
        <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <div class="flex items-center gap-1">
            <Calendar class="w-4 h-4" />
            {{ formatDate(post.date) }}
          </div>
          <div class="flex items-center gap-1">
            <Clock class="w-4 h-4" />
            {{ post.readTime }} read
          </div>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="inline-flex items-center gap-1 px-3 py-1 text-sm bg-primary/10 text-primary rounded-md"
          >
            <Tag class="w-3 h-3" />
            {{ tag }}
          </span>
        </div>
      </header>

      <!-- Content -->
      <div class="glass-card p-8 md:p-12">
        <div class="prose prose-neutral dark:prose-invert max-w-none">
          <div v-html="marked(post.content)" class="blog-content"></div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-12 pt-8 border-t border-border">
        <button
          @click="goBack"
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <ArrowLeft class="w-4 h-4" />
          Back to Blog
        </button>
      </div>
    </article>
  </div>
</template>

<style scoped>
.blog-content {
  @apply text-foreground leading-relaxed;
}

.blog-content :deep(h1) {
  @apply text-3xl font-bold mt-8 mb-4 text-foreground;
}

.blog-content :deep(h2) {
  @apply text-2xl font-bold mt-8 mb-4 text-foreground;
}

.blog-content :deep(h3) {
  @apply text-xl font-semibold mt-6 mb-3 text-foreground;
}

.blog-content :deep(p) {
  @apply mb-4 text-muted-foreground;
}

.blog-content :deep(ul),
.blog-content :deep(ol) {
  @apply my-4 ml-6;
}

.blog-content :deep(li) {
  @apply mb-2 text-muted-foreground;
}

.blog-content :deep(code) {
  @apply bg-muted px-2 py-1 rounded text-sm font-mono;
}

.blog-content :deep(pre) {
  @apply bg-muted p-4 rounded-lg overflow-x-auto my-6;
}

.blog-content :deep(pre code) {
  @apply bg-transparent p-0;
}

.blog-content :deep(a) {
  @apply text-primary hover:underline;
}

.blog-content :deep(blockquote) {
  @apply border-l-4 border-primary pl-4 my-6 italic text-muted-foreground;
}

.blog-content :deep(strong) {
  @apply font-semibold text-foreground;
}
</style>
