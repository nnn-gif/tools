<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Bot,
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  FileText,
  Link
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { decodeMetadataValue, getTypeLabel, formatBlockDate } from '@/lib/metadataDecoder'

const API_BASE = 'https://api.formatho.com/api/v1'
const route = useRoute()
const router = useRouter()
const agentAddress = computed(() => route.params.address as string)

interface Agent {
  id: number
  chain_id: number
  address: string
  name?: string
  metadata?: {
    description?: string
  }
  first_seen: number
  last_updated: number
  active: boolean
  total_reputation?: number
  avg_score?: number
  created_at: string
  updated_at: string
}

interface ReputationRecord {
  id: number
  agent_id: number
  chain_id: number
  agent_address: string
  from_address: string
  event_type: string
  value: number
  block_number: number
  tx_hash: string
  log_index: number
  timestamp: string
  created_at: string
}

interface MetadataRecord {
  id: number
  agent_id: number
  chain_id: number
  agent_address: string
  metadata_key: string
  metadata_value: string
  block_number: number
  tx_hash: string
  log_index: number
  timestamp: string
  created_at: string
}

interface URIRecord {
  id: number
  agent_id: number
  chain_id: number
  agent_address: string
  uri: string
  block_number: number
  tx_hash: string
  log_index: number
  timestamp: string
  created_at: string
}

interface PaginatedResponse<T> {
  records: T[]
  pagination: {
    count: number
    limit: number
    offset: number
  }
}

const agent = ref<Agent | null>(null)
const reputationHistory = ref<ReputationRecord[]>([])
const metadataHistory = ref<MetadataRecord[]>([])
const uriHistory = ref<URIRecord[]>([])
const loading = ref(true)
const error = ref('')

// Computed property to decode metadata values
const decodedMetadataHistory = computed(() => {
  return metadataHistory.value.map((record) => ({
    ...record,
    decoded: decodeMetadataValue(record.metadata_value)
  }))
})

const fetchAgent = async () => {
  try {
    const response = await fetch(`${API_BASE}/agents/${agentAddress.value}`)
    if (!response.ok) throw new Error('Agent not found')
    agent.value = await response.json()
  } catch (e: any) {
    error.value = e.message
  }
}

const fetchReputationHistory = async () => {
  try {
    const response = await fetch(`${API_BASE}/agents/${agentAddress.value}/reputation`)
    if (response.ok) {
      const data: PaginatedResponse<ReputationRecord> = await response.json()
      reputationHistory.value = data.records
    }
  } catch (e: any) {
    console.error('Failed to fetch reputation history:', e)
  }
}

const fetchMetadataHistory = async () => {
  try {
    const response = await fetch(
      `${API_BASE}/agents/${agentAddress.value}/metadata-history?limit=20`
    )
    if (response.ok) {
      const data: PaginatedResponse<MetadataRecord> = await response.json()
      metadataHistory.value = data.records || []
    }
  } catch (e: any) {
    console.error('Failed to fetch metadata history:', e)
  }
}

const fetchURIHistory = async () => {
  try {
    const response = await fetch(`${API_BASE}/agents/${agentAddress.value}/uri-history?limit=20`)
    if (response.ok) {
      const data: PaginatedResponse<URIRecord> = await response.json()
      uriHistory.value = data.records || []
    }
  } catch (e: any) {
    console.error('Failed to fetch URI history:', e)
  }
}

const openEtherscan = (txHash: string) => {
  window.open(`https://etherscan.io/tx/${txHash}`, '_blank')
}

const openAddress = (address: string) => {
  window.open(`https://etherscan.io/address/${address}`, '_blank')
}

const shortenAddress = (address: string) => {
  if (!address || address === '0x0000000000000000000000000000000000000000') return 'N/A'
  return `${address.slice(0, 10)}...${address.slice(-8)}`
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr === '1970-01-01T00:00:00Z') return 'N/A'
  return new Date(dateStr).toLocaleString()
}

const getEventTypeIcon = (eventType: string) => {
  switch (eventType) {
    case 'NewFeedback':
      return CheckCircle
    case 'FeedbackUpdated':
      return AlertCircle
    default:
      return TrendingUp
  }
}

const getEventTypeColor = (eventType: string) => {
  switch (eventType) {
    case 'NewFeedback':
      return 'text-green-500'
    case 'FeedbackUpdated':
      return 'text-yellow-500'
    default:
      return 'text-blue-500'
  }
}

const getScoreVariant = (score: number) => {
  if (score >= 4) return 'success'
  if (score >= 3) return 'default'
  if (score >= 2) return 'secondary'
  return 'destructive'
}

onMounted(async () => {
  loading.value = true
  await Promise.all([
    fetchAgent(),
    fetchReputationHistory(),
    fetchMetadataHistory(),
    fetchURIHistory()
  ])
  loading.value = false
})
</script>

<template>
  <div class="h-full flex flex-col p-4 gap-4 bg-muted/30">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="sm" @click="router.push('/tools/agents')">
        <ArrowLeft class="h-4 w-4 mr-2" />
        Back
      </Button>
      <Bot class="h-8 w-8" />
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Agent Details</h1>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div
          class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
        ></div>
        <p class="text-muted-foreground">Loading agent details...</p>
      </div>
    </div>

    <!-- Error State -->
    <Card v-else-if="error" class="border-destructive">
      <CardContent class="pt-6">
        <p class="text-destructive">{{ error }}</p>
      </CardContent>
    </Card>

    <!-- Agent Details -->
    <div v-else-if="agent" class="flex-1 overflow-auto space-y-4">
      <!-- Main Info Card -->
      <Card>
        <CardHeader>
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <CardTitle class="text-xl mb-2 flex items-center gap-2">
                <Bot class="h-6 w-6 text-primary" />
                {{ agent.name || shortenAddress(agent.address) }}
                <Badge v-if="agent.active" variant="success">Active</Badge>
                <Badge v-else variant="secondary">Inactive</Badge>
              </CardTitle>
              <p class="text-sm text-muted-foreground font-mono">{{ agent.address }}</p>
              <p v-if="agent.metadata?.description" class="text-sm mt-2">
                {{ agent.metadata.description }}
              </p>
            </div>
            <Button variant="outline" size="sm" @click="openAddress(agent.address)">
              <ExternalLink class="h-4 w-4 mr-2" />
              Etherscan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div class="text-sm text-muted-foreground">Agent ID</div>
              <div class="text-lg font-semibold">#{{ agent.id }}</div>
            </div>
            <div>
              <div class="text-sm text-muted-foreground">Chain ID</div>
              <div class="text-lg font-semibold">{{ agent.chain_id }}</div>
            </div>
            <div v-if="agent.total_reputation !== undefined">
              <div class="text-sm text-muted-foreground">Total Reputation</div>
              <div class="text-lg font-semibold">{{ agent.total_reputation }}</div>
            </div>
            <div v-if="agent.avg_score !== undefined">
              <div class="text-sm text-muted-foreground">Average Score</div>
              <div class="text-lg font-semibold">{{ agent.avg_score.toFixed(2) }}</div>
            </div>
            <div>
              <div class="text-sm text-muted-foreground">First Seen</div>
              <div class="font-medium text-sm">Block {{ formatNumber(agent.first_seen) }}</div>
              <div class="text-xs text-muted-foreground">
                {{ formatBlockDate(agent.first_seen) }}
              </div>
            </div>
            <div>
              <div class="text-sm text-muted-foreground">Last Updated</div>
              <div class="font-medium text-sm">Block {{ formatNumber(agent.last_updated) }}</div>
              <div class="text-xs text-muted-foreground">
                {{ formatBlockDate(agent.last_updated) }}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Reputation History Card -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <TrendingUp class="h-5 w-5" />
            Reputation History
            <Badge variant="secondary" class="ml-2">{{ reputationHistory.length }} records</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="reputationHistory.length === 0" class="text-center py-8 text-muted-foreground">
            No reputation history available
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="record in reputationHistory"
              :key="record.id"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-2">
                    <component
                      :is="getEventTypeIcon(record.event_type)"
                      :class="['h-4 w-4', getEventTypeColor(record.event_type)]"
                    />
                    <span class="font-medium">{{ record.event_type }}</span>
                    <Badge :variant="getScoreVariant(record.value)">
                      Score: {{ record.value }}
                    </Badge>
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <div class="text-muted-foreground text-xs">From</div>
                      <div class="font-mono text-xs">{{ shortenAddress(record.from_address) }}</div>
                    </div>
                    <div>
                      <div class="text-muted-foreground text-xs">Block</div>
                      <div class="font-medium">{{ formatNumber(record.block_number) }}</div>
                    </div>
                    <div>
                      <div class="text-muted-foreground text-xs">Time</div>
                      <div class="font-medium text-xs">{{ formatDate(record.timestamp) }}</div>
                    </div>
                  </div>
                  <div class="mt-2 text-xs">
                    <span class="text-muted-foreground">TX: </span>
                    <span
                      class="font-mono cursor-pointer hover:text-primary"
                      @click="openEtherscan(record.tx_hash)"
                    >
                      {{ shortenAddress(record.tx_hash) }}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" @click="openEtherscan(record.tx_hash)">
                  <ExternalLink class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Metadata History Card -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <FileText class="h-5 w-5" />
            Metadata History
            <Badge variant="secondary" class="ml-2">{{ metadataHistory.length }} records</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="metadataHistory.length === 0" class="text-center py-8 text-muted-foreground">
            No metadata history available
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="record in decodedMetadataHistory"
              :key="record.id"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-2">
                    <FileText class="h-4 w-4 text-blue-500" />
                    <span class="font-mono text-sm font-medium">{{
                      record.decoded.key || record.metadata_key
                    }}</span>
                    <Badge variant="outline" class="text-xs">{{
                      getTypeLabel(record.decoded)
                    }}</Badge>
                  </div>

                  <!-- Decoded Value (Human Readable) -->
                  <div class="mb-2">
                    <div class="text-muted-foreground text-xs mb-1 flex items-center gap-1">
                      <CheckCircle class="h-3 w-3 text-green-500" />
                      Decoded Value
                    </div>
                    <div
                      class="font-mono text-sm bg-green-50 dark:bg-green-950/20 p-2 rounded border border-green-200 dark:border-green-800 break-all"
                    >
                      <span v-if="record.decoded.isAddress">
                        <a
                          :href="`https://etherscan.io/address/${record.decoded.value}`"
                          target="_blank"
                          rel="noopener"
                          class="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {{ record.decoded.value }}
                        </a>
                      </span>
                      <span v-else>{{ record.decoded.value || '(empty)' }}</span>
                    </div>
                  </div>

                  <!-- Raw Encoded Value -->
                  <div class="mb-2">
                    <details class="group">
                      <summary
                        class="text-muted-foreground text-xs mb-1 cursor-pointer hover:text-foreground flex items-center gap-1"
                      >
                        <AlertCircle class="h-3 w-3 text-orange-500" />
                        Raw ABI-Encoded Value
                        <span class="text-xs opacity-50">(click to expand)</span>
                      </summary>
                      <div
                        class="font-mono text-xs bg-muted p-2 rounded break-all max-h-32 overflow-y-auto mt-1"
                      >
                        {{ record.decoded.raw }}
                      </div>
                    </details>
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <div class="text-muted-foreground text-xs">Block</div>
                      <div class="font-medium">{{ formatNumber(record.block_number) }}</div>
                    </div>
                    <div>
                      <div class="text-muted-foreground text-xs">Time</div>
                      <div class="font-medium text-xs">{{ formatDate(record.timestamp) }}</div>
                    </div>
                  </div>
                  <div class="mt-2 text-xs">
                    <span class="text-muted-foreground">TX: </span>
                    <span
                      class="font-mono cursor-pointer hover:text-primary"
                      @click="openEtherscan(record.tx_hash)"
                    >
                      {{ shortenAddress(record.tx_hash) }}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" @click="openEtherscan(record.tx_hash)">
                  <ExternalLink class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- URI History Card -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Link class="h-5 w-5" />
            URI History
            <Badge variant="secondary" class="ml-2">{{ uriHistory.length }} records</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="uriHistory.length === 0" class="text-center py-8 text-muted-foreground">
            No URI history available
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="record in uriHistory"
              :key="record.id"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-2">
                    <Link class="h-4 w-4 text-green-500" />
                    <span class="font-medium">URI Update</span>
                  </div>
                  <div class="mb-2">
                    <div class="text-muted-foreground text-xs mb-1">URI</div>
                    <div class="font-mono text-xs bg-muted p-2 rounded break-all">
                      {{ record.uri || '(empty)' }}
                    </div>
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <div class="text-muted-foreground text-xs">Block</div>
                      <div class="font-medium">{{ formatNumber(record.block_number) }}</div>
                    </div>
                    <div>
                      <div class="text-muted-foreground text-xs">Time</div>
                      <div class="font-medium text-xs">{{ formatDate(record.timestamp) }}</div>
                    </div>
                  </div>
                  <div class="mt-2 text-xs">
                    <span class="text-muted-foreground">TX: </span>
                    <span
                      class="font-mono cursor-pointer hover:text-primary"
                      @click="openEtherscan(record.tx_hash)"
                    >
                      {{ shortenAddress(record.tx_hash) }}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" @click="openEtherscan(record.tx_hash)">
                  <ExternalLink class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
