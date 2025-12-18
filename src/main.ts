import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// Handle GitHub Pages 404.html redirects
// When 404.html redirects to index.html, restore the original path
const redirectPath = sessionStorage.getItem('_redirect_path')
if (redirectPath) {
  sessionStorage.removeItem('_redirect_path')
  // Use replaceState to set the correct path before Vue Router initializes
  window.history.replaceState(null, '', redirectPath)
}

createApp(App).use(router).mount('#app')
