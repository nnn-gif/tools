<script setup lang="ts">
import { ref } from 'vue'
import yaml from 'js-yaml'
import { FileJson, FileType } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const jsonInput = ref('')
const yamlInput = ref('')
const error = ref('')

const convertToYaml = () => {
    error.value = ''
    try {
        const obj = JSON.parse(jsonInput.value)
        yamlInput.value = yaml.dump(obj)
    } catch (e: any) {
        error.value = 'Invalid JSON: ' + e.message
    }
}

const convertToJson = () => {
    error.value = ''
    try {
        const obj = yaml.load(yamlInput.value)
        jsonInput.value = JSON.stringify(obj, null, 2)
    } catch (e: any) {
        error.value = 'Invalid YAML: ' + e.message
    }
}

// Sample data for quick testing
const fillSample = () => {
    jsonInput.value = JSON.stringify({
        name: "DevTools",
        version: 1.0,
        features: ["markdown", "json", "yaml"]
    }, null, 2)
    convertToYaml()
}
</script>

<template>
    <div class="h-full flex flex-col p-4 gap-4 bg-muted/30">
        <div class="flex items-center justify-between">
            <h2 class="text-3xl font-bold tracking-tight">JSON <-> YAML Converter</h2>
            <Button variant="ghost" @click="fillSample">Load Sample</Button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
            <!-- JSON Column -->
            <Card class="flex flex-col min-h-0">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium flex items-center gap-2">
                        <FileJson class="h-4 w-4" /> JSON
                    </CardTitle>
                    <Button size="sm" @click="convertToYaml">
                        To YAML ->
                    </Button>
                </CardHeader>
                <CardContent class="flex-1 min-h-0">
                    <Textarea 
                        v-model="jsonInput"
                        class="h-full resize-none font-mono"
                        placeholder='{"key": "value"}'
                    />
                </CardContent>
            </Card>

            <!-- YAML Column -->
            <Card class="flex flex-col min-h-0">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium flex items-center gap-2">
                        <FileType class="h-4 w-4" /> YAML
                    </CardTitle>
                    <Button size="sm" @click="convertToJson" variant="secondary">
                        <- To JSON
                    </Button>
                </CardHeader>
                <CardContent class="flex-1 min-h-0">
                    <Textarea 
                        v-model="yamlInput"
                        class="h-full resize-none font-mono"
                        placeholder="key: value"
                    />
                </CardContent>
            </Card>
        </div>
        
        <div v-if="error" class="p-4 text-sm text-destructive bg-destructive/10 rounded-md">
            {{ error }}
        </div>
    </div>
</template>

