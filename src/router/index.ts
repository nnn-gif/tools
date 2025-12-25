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
          component: MarkdownView,
          meta: {
            title: 'Markdown Editor',
            description:
              'Edit and preview Markdown files in real-time. Privacy-first markdown editor that runs 100% client-side in your browser.',
            keywords:
              'markdown editor, markdown preview, markdown viewer, github markdown, privacy-first'
          }
        },
        {
          path: 'json-yaml',
          name: 'json-yaml',
          component: () => import('../views/JsonYamlView.vue'),
          meta: {
            title: 'JSON to YAML Converter',
            description:
              'Convert JSON to YAML and YAML to JSON instantly. Free, privacy-first converter that processes data entirely in your browser.',
            keywords:
              'json to yaml, yaml to json, json converter, yaml converter, json yaml, privacy-first'
          }
        },
        {
          path: 'json-csv',
          name: 'json-csv',
          component: () => import('../views/JsonCsvView.vue'),
          meta: {
            title: 'JSON to CSV Converter',
            description:
              'Convert JSON to CSV and CSV to JSON format instantly. Free, client-side converter that keeps your data private.',
            keywords:
              'json to csv, csv to json, json converter, csv converter, json csv, privacy-first'
          }
        },
        {
          path: 'diff',
          name: 'diff',
          component: () => import('../views/DiffView.vue'),
          meta: {
            title: 'Text Diff Tool',
            description:
              'Compare two texts and see the differences highlighted. Free diff tool that runs entirely in your browser.',
            keywords:
              'diff tool, text diff, compare text, diff checker, text comparison, privacy-first'
          }
        },
        {
          path: 'base64',
          name: 'base64',
          component: () => import('../views/Base64View.vue'),
          meta: {
            title: 'Base64 Encoder & Decoder',
            description:
              'Encode and decode Base64 strings instantly. Free, privacy-first Base64 tool that processes data entirely in your browser.',
            keywords:
              'base64 encoder, base64 decoder, base64 encode, base64 decode, base64 converter, privacy-first'
          }
        },
        {
          path: 'jwt',
          name: 'jwt',
          component: () => import('../views/JwtView.vue'),
          meta: {
            title: 'JWT Decoder',
            description:
              'Decode and inspect JWT tokens instantly. View JWT header, payload, and signature. Privacy-first tool that runs in your browser.',
            keywords:
              'jwt decoder, jwt decode, jwt token decoder, jwt inspector, json web token, privacy-first'
          }
        },
        {
          path: 'sql',
          name: 'sql',
          component: () => import('../views/SqlFormatterView.vue'),
          meta: {
            title: 'SQL Formatter',
            description:
              'Format and beautify SQL queries instantly. Free SQL formatter that runs entirely in your browser. Supports multiple SQL dialects.',
            keywords:
              'sql formatter, sql beautifier, sql prettifier, format sql, sql formatter online, privacy-first'
          }
        },
        {
          path: 'uuid',
          name: 'uuid',
          component: () => import('../views/UuidGeneratorView.vue'),
          meta: {
            title: 'UUID Generator',
            description:
              'Generate UUIDs (Universally Unique Identifiers) instantly. Free UUID generator that creates v1, v4, and other UUID formats.',
            keywords:
              'uuid generator, generate uuid, uuid v4, uuid v1, unique identifier generator, privacy-first'
          }
        },
        {
          path: 'lorem',
          name: 'lorem',
          component: () => import('../views/LoremIpsumView.vue'),
          meta: {
            title: 'Lorem Ipsum Generator',
            description:
              'Generate Lorem Ipsum placeholder text instantly. Customize paragraphs, words, and sentences. Free text generator.',
            keywords:
              'lorem ipsum generator, placeholder text, dummy text generator, lorem ipsum, privacy-first'
          }
        },
        {
          path: 'image',
          name: 'image',
          component: () => import('../views/ImageCompressorView.vue'),
          meta: {
            title: 'Image Compressor',
            description:
              'Compress and optimize images instantly. Reduce image file size while maintaining quality. Privacy-first tool that processes images in your browser.',
            keywords:
              'image compressor, compress image, image optimizer, reduce image size, image compression, privacy-first'
          }
        },
        {
          path: 'json-lint',
          name: 'json-lint',
          component: () => import('../views/JsonLintView.vue'),
          meta: {
            title: 'JSON Linter & Validator',
            description:
              'Validate and lint JSON code instantly. Find syntax errors and format JSON. Free JSON validator that runs entirely in your browser.',
            keywords:
              'json linter, json validator, json formatter, validate json, json checker, privacy-first'
          }
        },
        {
          path: 'yaml-lint',
          name: 'yaml-lint',
          component: () => import('../views/YamlLintView.vue'),
          meta: {
            title: 'YAML Linter & Validator',
            description:
              'Validate and lint YAML code instantly. Find syntax errors and format YAML. Free YAML validator that runs entirely in your browser.',
            keywords:
              'yaml linter, yaml validator, yaml formatter, validate yaml, yaml checker, privacy-first'
          }
        },
        {
          path: 'bpmn',
          name: 'bpmn',
          component: () => import('../views/BpmnView.vue'),
          meta: {
            title: 'BPMN Viewer & PDF Exporter',
            description:
              'Visualize BPMN 2.0 diagrams and export them as PDF. Free, privacy-first BPMN viewer that runs entirely in your browser.',
            keywords:
              'bpmn viewer, bpmn to pdf, bpmn diagram, business process model, bpmn export, privacy-first'
          }
        }
      ]
    }
  ]
})

router.afterEach((to) => {
  // Update Title
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} | Formatho`
  }

  // Update Description
  const description = to.meta.description as string
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription && description) {
    metaDescription.setAttribute('content', description)
  }

  // Update Canonical URL
  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  const baseUrl = 'https://formatho.com'
  const path = to.path.endsWith('/') ? to.path.slice(0, -1) : to.path
  canonical.setAttribute('href', `${baseUrl}${path}`)
})

export default router
