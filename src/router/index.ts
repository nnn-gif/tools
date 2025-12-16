import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import MarkdownView from '../views/MarkdownView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'markdown',
          component: MarkdownView
        },
        {
          path: 'json-yaml',
          name: 'json-yaml',
          component: () => import('../views/JsonYamlView.vue')
        },
        {
          path: 'json-csv',
          name: 'json-csv',
          component: () => import('../views/JsonCsvView.vue')
        },
        {
          path: 'diff',
          name: 'diff',
          component: () => import('../views/DiffView.vue')
        },
        {
          path: 'base64',
          name: 'base64',
          component: () => import('../views/Base64View.vue')
        },
        {
          path: 'jwt',
          name: 'jwt',
          component: () => import('../views/JwtView.vue')
        },
        {
          path: 'sql',
          name: 'sql',
          component: () => import('../views/SqlFormatterView.vue')
        },
        {
          path: 'uuid',
          name: 'uuid',
          component: () => import('../views/UuidGeneratorView.vue')
        },
        {
          path: 'lorem',
          name: 'lorem',
          component: () => import('../views/LoremIpsumView.vue')
        },
        {
          path: 'image',
          name: 'image',
          component: () => import('../views/ImageCompressorView.vue')
        },
        {
          path: 'json-lint',
          name: 'json-lint',
          component: () => import('../views/JsonLintView.vue')
        },
        {
          path: 'yaml-lint',
          name: 'yaml-lint',
          component: () => import('../views/YamlLintView.vue')
        }
      ]
    }
  ]
})

export default router
