import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// Handle GitHub Pages 404.html redirects
// When 404.html redirects to index.html, restore the original path
// This must happen BEFORE Vue Router initializes so it sees the correct path
let redirectPath: string | null = null

// Try sessionStorage first (more reliable)
redirectPath = sessionStorage.getItem('_redirect_path')
if (redirectPath) {
  sessionStorage.removeItem('_redirect_path')
}

// Fallback to URL query parameter
if (!redirectPath) {
  const urlParams = new URLSearchParams(window.location.search)
  redirectPath = urlParams.get('_redirect')
  if (redirectPath) {
    // Clean up the URL by removing the query parameter
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.delete('_redirect')
    window.history.replaceState(null, '', newUrl.pathname + newUrl.search + newUrl.hash)
  }
}

// Apply the redirect path if we found one
if (redirectPath && redirectPath !== '/index.html' && redirectPath !== window.location.pathname) {
  // Use replaceState to set the correct path immediately
  // Vue Router will read window.location.pathname when it initializes
  window.history.replaceState(null, '', redirectPath)
}

createApp(App).use(router).mount('#app')
