<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Github, Heart, Shield, Zap } from 'lucide-vue-next'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-border/50 bg-muted/30 mt-auto">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Brand -->
        <div class="space-y-4">
          <RouterLink to="/" class="flex items-center gap-3">
            <img src="/logo.png" alt="Formatho" class="h-8 w-8 rounded-lg" />
            <span class="text-lg font-bold gradient-text">Formatho</span>
          </RouterLink>
          <p class="text-sm text-muted-foreground leading-relaxed">
            Privacy-first developer tools that run 100% client-side. Your data stays in your
            browser.
          </p>
          <div class="flex items-center gap-4">
            <a
              href="https://github.com/nnn-gif/tools"
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Features -->
        <div>
          <h3 class="text-sm font-semibold mb-4">Features</h3>
          <ul class="space-y-3">
            <li class="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield class="w-4 h-4 text-primary" />
              100% Client-Side
            </li>
            <li class="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap class="w-4 h-4 text-primary" />
              Lightning Fast
            </li>
            <li class="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart class="w-4 h-4 text-primary" />
              Privacy First
            </li>
          </ul>
        </div>

        <!-- Popular Tools -->
        <div>
          <h3 class="text-sm font-semibold mb-4">Popular Tools</h3>
          <ul class="space-y-2">
            <li>
              <RouterLink
                to="/json-lint"
                class="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                JSON Linter
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/uuid"
                class="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                UUID Generator
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/base64"
                class="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Base64 Encoder
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/jwt"
                class="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                JWT Debugger
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Categories -->
        <div>
          <h3 class="text-sm font-semibold mb-4">Categories</h3>
          <ul class="space-y-2">
            <li>
              <RouterLink
                to="/"
                class="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Data Tools
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/"
                class="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Converters
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/"
                class="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                EVM Tools
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/"
                class="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Generators
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div
        class="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <p class="text-sm text-muted-foreground">
          © {{ currentYear }} Formatho. Built with
          <Heart class="w-4 h-4 inline text-red-500" />
          for developers.
        </p>
        <div class="flex items-center gap-6 text-sm text-muted-foreground">
          <RouterLink to="/" class="hover:text-primary transition-colors">
            Privacy Policy
          </RouterLink>
          <a
            href="https://github.com/nnn-gif/tools"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-primary transition-colors"
          >
            View Source
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
