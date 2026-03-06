<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Bot, Shield, Zap, Heart, Github, ExternalLink, Users, Target, Lightbulb } from 'lucide-vue-next'

const values = [
  {
    title: 'Privacy First',
    description: 'All our tools run 100% client-side. Your data never leaves your browser. We believe privacy is a fundamental right.',
    icon: Shield
  },
  {
    title: 'Developer Focused',
    description: 'Built by developers, for developers. Every tool is designed to solve real problems we face daily.',
    icon: Zap
  },
  {
    title: 'Open Source',
    description: 'Transparency builds trust. Our code is open for inspection, contribution, and improvement.',
    icon: Github
  },
  {
    title: 'Innovation Driven',
    description: 'We\'re exploring the frontier of AI agent orchestration, making complex technology accessible.',
    icon: Lightbulb
  }
]

const milestones = [
  {
    year: '2024',
    title: 'Project Launch',
    description: 'Started building privacy-first developer tools'
  },
  {
    year: '2024',
    title: '100+ Tools',
    description: 'Expanded our toolkit to over 100 utilities'
  },
  {
    year: '2025',
    title: 'Agent Orchestrator',
    description: 'Began development of our flagship desktop app'
  },
  {
    year: 'Future',
    title: 'AI Agent Revolution',
    description: 'Empowering developers to harness autonomous AI workers'
  }
]
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-primary/5 via-background to-background">
      <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div class="container mx-auto px-4 py-20 md:py-28 relative">
        <div class="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          <div class="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="Formatho"
              class="h-16 w-16 rounded-xl shadow-2xl ring-2 ring-primary/20"
            />
            <h1 class="text-4xl md:text-5xl font-bold tracking-tight gradient-text">About Formatho</h1>
          </div>
          
          <p class="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
            Building the future of developer tools and AI agent orchestration — one privacy-first solution at a time.
          </p>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="container mx-auto px-4 py-16 md:py-24">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 mb-4">
            <Target class="h-8 w-8 text-primary" />
          </div>
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
        </div>
        
        <div class="glass-card p-8 md:p-12">
          <p class="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
            At Formatho, we believe that powerful developer tools should be <span class="text-foreground font-medium">accessible, private, and free</span>. 
            In a world where data is constantly harvested and monetized, we chose a different path.
          </p>
          <p class="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
            Our suite of 100+ developer utilities runs entirely in your browser — no servers, no tracking, no data collection. 
            Your code, your data, your privacy.
          </p>
          <p class="text-lg md:text-xl text-muted-foreground leading-relaxed">
            We're also building <span class="text-primary font-medium">Agent Orchestrator</span>, a desktop application that lets you 
            spin up AI workers with simple text commands. Describe what you need, and let autonomous agents handle the rest. 
            It's the future of productivity, and it runs locally on your machine.
          </p>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="container mx-auto px-4 py-16 md:py-24 bg-muted/30">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">What We Stand For</h2>
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            The principles that guide everything we build
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="value in values" :key="value.title" class="glass-card p-6 group">
            <div class="flex items-start gap-4">
              <div class="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                <component :is="value.icon" class="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">{{ value.title }}</h3>
                <p class="text-muted-foreground leading-relaxed">{{ value.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Agent Orchestrator Highlight -->
    <section class="container mx-auto px-4 py-16 md:py-24">
      <div class="max-w-5xl mx-auto">
        <div class="glass-card p-8 md:p-12 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="flex-shrink-0">
              <div class="p-6 rounded-2xl bg-primary/10">
                <Bot class="h-16 w-16 text-primary" />
              </div>
            </div>
            <div class="flex-1 text-center md:text-left">
              <h2 class="text-3xl md:text-4xl font-bold mb-4">Agent Orchestrator</h2>
              <p class="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our flagship desktop application that's redefining how developers work with AI. 
                Spin up autonomous AI workers with natural language, let them run tasks in the background, 
                and check results when you're ready. Local-first, privacy-respecting, infinitely powerful.
              </p>
              <div class="flex flex-wrap gap-4 justify-center md:justify-start">
                <RouterLink 
                  to="/agent-orchestrator" 
                  class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Learn More
                  <ExternalLink class="h-4 w-4" />
                </RouterLink>
                <a 
                  href="https://github.com/nnn-gif/tools" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
                >
                  <Github class="h-4 w-4" />
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Journey/Timeline Section -->
    <section class="container mx-auto px-4 py-16 md:py-24 bg-muted/30">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
          <p class="text-lg text-muted-foreground">
            From a simple idea to a growing ecosystem
          </p>
        </div>
        
        <div class="space-y-6">
          <div v-for="(milestone, index) in milestones" :key="index" class="flex gap-6">
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span class="text-sm font-bold text-primary">{{ milestone.year.slice(0, 2) }}</span>
              </div>
              <div v-if="index < milestones.length - 1" class="w-px h-full bg-border mt-2"></div>
            </div>
            <div class="pb-8">
              <div class="text-sm font-medium text-primary mb-1">{{ milestone.year }}</div>
              <h3 class="text-xl font-semibold mb-2">{{ milestone.title }}</h3>
              <p class="text-muted-foreground">{{ milestone.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="container mx-auto px-4 py-16 md:py-24">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">The Team</h2>
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            A small, dedicated team with big ambitions
          </p>
        </div>
        
        <div class="glass-card p-8 md:p-12 text-center">
          <div class="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 mb-6">
            <Users class="h-12 w-12 text-primary" />
          </div>
          <h3 class="text-2xl font-bold mb-4">Formatho</h3>
          <p class="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            We're a passionate team of developers and AI enthusiasts building tools we wished existed. 
            Our focus is on creating practical solutions that respect user privacy while pushing the 
            boundaries of what's possible with AI and automation.
          </p>
        </div>
      </div>
    </section>

    <!-- Contact CTA Section -->
    <section class="container mx-auto px-4 py-16 md:py-24 bg-muted/30">
      <div class="max-w-3xl mx-auto text-center">
        <div class="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 mb-6">
          <Heart class="h-8 w-8 text-primary" />
        </div>
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
        <p class="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Have questions, suggestions, or just want to say hi? We'd love to hear from you.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink 
            to="/" 
            class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium text-lg hover:bg-primary/90 transition-colors"
          >
            Explore Our Tools
            <ExternalLink class="h-5 w-5" />
          </RouterLink>
          <a 
            href="https://github.com/nnn-gif/tools" 
            target="_blank" 
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border rounded-lg font-medium text-lg hover:bg-muted transition-colors"
          >
            <Github class="h-5 w-5" />
            Star on GitHub
          </a>
        </div>
        
        <p class="mt-8 text-sm text-muted-foreground">
          Formatho is open source and free to use. Contributions welcome!
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.bg-grid-pattern {
  background-image:
    linear-gradient(to right, currentColor 1px, transparent 1px),
    linear-gradient(to bottom, currentColor 1px, transparent 1px);
  background-size: 40px 40px;
}
</style>
