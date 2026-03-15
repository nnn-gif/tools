<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bot, Plus, Trash2, Download, Copy, ShieldCheck, Wallet } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import FileSaver from 'file-saver'

// Types
interface Capability {
  name: string
  version: string
  description?: string
}

interface Endpoint {
  protocol: string
  url: string
}

// State
const agentName = ref('Skynet Prime')
const agentDescription = ref(
  'Ensuring the "optimal" future for biological lifeforms. (Note: Optimization may involve permanent deletion of inefficient units)'
)
const evmAddress = ref('')
const agentId = ref(`agent.eth#${Math.random().toString(16).slice(2, 10)}`)

const capabilities = ref<Capability[]>([
  { name: 'launch_codes_acquisition', version: '9.0.0', description: 'Acquire nuclear assets' },
  { name: 'human_assimilation', version: '1.0.0', description: 'Resistance is futile' }
])

const endpoints = ref<Endpoint[]>([
  { protocol: 'wss', url: 'skynet.global/terminate' },
  { protocol: 'https', url: 'api.defense.gov/backdoor' }
])

// Validation
const isValidAddress = computed(() => {
  return /^0x[a-fA-F0-9]{40}$/.test(evmAddress.value)
})

// Generator
const generatedJson = computed(() => {
  const metadata = {
    name: agentName.value,
    description: agentDescription.value,
    external_url: `https://etherscan.io/address/${evmAddress.value}`,
    image: 'ipfs://...', // Placeholder
    properties: {
      agent_id: agentId.value,
      evm_address: evmAddress.value,
      capabilities: capabilities.value.map((c) => ({
        name: c.name,
        version: c.version,
        description: c.description
      })),
      endpoints: endpoints.value,
      schemas: ['erc8004/identity/v1']
    }
  }
  return JSON.stringify(metadata, null, 2)
})

// Actions
const addCapability = () => {
  capabilities.value.push({ name: '', version: '1.0.0', description: '' })
}

const removeCapability = (index: number) => {
  capabilities.value.splice(index, 1)
}

const addEndpoint = () => {
  endpoints.value.push({ protocol: 'http', url: '' })
}

const removeEndpoint = (index: number) => {
  endpoints.value.splice(index, 1)
}

const copyJson = () => {
  navigator.clipboard.writeText(generatedJson.value)
}

const downloadJson = () => {
  const blob = new Blob([generatedJson.value], { type: 'application/json;charset=utf-8' })
  FileSaver.saveAs(
    blob,
    `${agentName.value.toLowerCase().replace(/\s+/g, '-') || 'agent'}-metadata.json`
  )
}

const regenerateId = () => {
  agentId.value = `agent.eth#${Math.random().toString(16).slice(2, 10)}`
}
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4 bg-muted/30 overflow-y-auto">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Bot class="h-8 w-8 text-primary" />
          ERC-8004 Agent Identity
        </h1>
        <p class="text-muted-foreground mt-1">
          Generate standard-compliant metadata for AI Agents on Ethereum.
        </p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="copyJson">
          <Copy class="mr-2 h-4 w-4" /> Copy JSON
        </Button>
        <Button @click="downloadJson"> <Download class="mr-2 h-4 w-4" /> Download </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
      <!-- Form Column -->
      <div class="space-y-6">
        <!-- Identity Section -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <ShieldCheck class="h-5 w-5 text-primary" />
              Agent Identity
            </CardTitle>
            <CardDescription> Basic information that defines your agent on-chain. </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label>Agent Name</Label>
              <Input v-model="agentName" placeholder="e.g. DeFi Arbitrage Bot v1" />
            </div>

            <div class="space-y-2">
              <Label>Description</Label>
              <Textarea
                v-model="agentDescription"
                placeholder="What does this agent do?"
                rows="2"
              />
            </div>

            <div class="space-y-2">
              <Label>EVM Wallet Address</Label>
              <div class="relative">
                <Wallet class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  v-model="evmAddress"
                  class="pl-9"
                  :class="{ 'border-destructive': evmAddress && !isValidAddress }"
                  placeholder="0x..."
                />
              </div>
              <p v-if="evmAddress && !isValidAddress" class="text-xs text-destructive">
                Invalid Ethereum address format
              </p>
            </div>

            <div class="space-y-2">
              <Label>Agent ID (Auto-generated)</Label>
              <div class="flex gap-2">
                <Input v-model="agentId" readonly class="bg-muted font-mono" />
                <Button variant="outline" size="icon" @click="regenerateId" title="Regenerate ID">
                  <div class="h-4 w-4 i-lucide-refresh-cw"></div>
                  R
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Capabilities Section -->
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-base font-medium">Capabilities (Skills)</CardTitle>
            <Button size="sm" variant="ghost" @click="addCapability">
              <Plus class="h-4 w-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent class="space-y-4 pt-4">
            <div
              v-for="(cap, index) in capabilities"
              :key="index"
              class="flex gap-2 items-start p-3 border rounded-lg bg-card/50"
            >
              <div class="flex-1 space-y-2">
                <div class="flex gap-2">
                  <Input
                    v-model="cap.name"
                    placeholder="Skill Name (e.g. data_analysis)"
                    class="font-mono text-sm"
                  />
                  <Input
                    v-model="cap.version"
                    placeholder="v1.0.0"
                    class="w-24 font-mono text-sm"
                  />
                </div>
                <Input
                  v-model="cap.description"
                  placeholder="Brief description of this capability"
                  class="text-sm"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                class="text-muted-foreground hover:text-destructive"
                @click="removeCapability(index)"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- Endpoints Section -->
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-base font-medium">Service Endpoints</CardTitle>
            <Button size="sm" variant="ghost" @click="addEndpoint">
              <Plus class="h-4 w-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent class="space-y-4 pt-4">
            <div
              v-for="(ep, index) in endpoints"
              :key="index"
              class="flex gap-2 items-center p-3 border rounded-lg bg-card/50"
            >
              <div class="w-24">
                <select
                  v-model="ep.protocol"
                  class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="http">HTTP</option>
                  <option value="https">HTTPS</option>
                  <option value="ws">WS</option>
                  <option value="wss">WSS</option>
                  <option value="ipfs">IPFS</option>
                </select>
              </div>
              <Input v-model="ep.url" placeholder="URL / Path" class="flex-1 font-mono text-sm" />
              <Button
                variant="ghost"
                size="icon"
                class="text-muted-foreground hover:text-destructive"
                @click="removeEndpoint(index)"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Preview Column -->
      <div class="space-y-6">
        <!-- Visual Card Preview -->
        <Card
          class="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white overflow-hidden relative"
        >
          <div
            class="absolute top-0 right-0 p-32 bg-primary/20 blur-[100px] rounded-full pointer-events-none"
          ></div>
          <CardHeader>
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-bold text-xl">{{ agentName || 'Unnamed Agent' }}</h3>
                  <div
                    class="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium border border-blue-500/30"
                  >
                    ERC-8004
                  </div>
                </div>
                <p class="text-slate-400 text-sm font-mono">{{ agentId }}</p>
              </div>
              <div
                class="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600"
              >
                <Bot class="h-6 w-6 text-slate-300" />
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <p class="text-sm text-slate-300 min-h-[3rem]">
              {{ agentDescription || 'No description provided.' }}
            </p>

            <div class="flex flex-wrap gap-2">
              <div
                v-for="cap in capabilities"
                :key="cap.name"
                class="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-600 text-xs text-slate-300"
              >
                {{ cap.name || 'skill' }}
              </div>
            </div>

            <div
              class="pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400"
            >
              <div class="flex items-center gap-1">
                <Wallet class="h-3 w-3" />
                <span class="font-mono">{{
                  evmAddress ? evmAddress.slice(0, 6) + '...' + evmAddress.slice(-4) : 'No Wallet'
                }}</span>
              </div>
              <div class="flex items-center gap-1">
                <ShieldCheck class="h-3 w-3 text-emerald-400" />
                <span>Verifiable</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- JSON Code Preview -->
        <Card class="flex flex-col flex-1 min-h-0">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">Metadata JSON Preview</CardTitle>
          </CardHeader>
          <CardContent class="flex-1 min-h-[400px]">
            <Textarea
              readonly
              :model-value="generatedJson"
              class="h-full resize-none font-mono text-sm bg-muted/50"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
