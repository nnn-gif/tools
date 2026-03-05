<script setup lang="ts">
import { ref, computed } from 'vue'
import { Hash, Copy, Check } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const input = ref('')
const outputFormat = ref('all')
const copied = ref<string | null>(null)

const hashText = async (text: string, algorithm: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

const hashes = computed(async () => {
  if (!input.value) return {}
  
  const algorithms: Record<string, string> = {
    'MD5': 'MD5', // Not available in Web Crypto, will use alternative
    'SHA-1': 'SHA-1',
    'SHA-256': 'SHA-256',
    'SHA-384': 'SHA-384',
    'SHA-512': 'SHA-512'
  }
  
  const results: Record<string, string> = {}
  
  // MD5 implementation (not in Web Crypto API)
  const md5 = (str: string): string => {
    const rotateLeft = (x: number, n: number) => (x << n) | (x >>> (32 - n))
    const addUnsigned = (x: number, y: number) => {
      const x8 = x & 0x80000000
      const y8 = y & 0x80000000
      const x4 = x & 0x40000000
      const y4 = y & 0x40000000
      const result = (x & 0x3FFFFFFF) + (y & 0x3FFFFFFF)
      if (x4 & y4) return result ^ 0x80000000 ^ x8 ^ y8
      if (x4 | y4) {
        if (result & 0x40000000) return result ^ 0xC0000000 ^ x8 ^ y8
        return result ^ 0x40000000 ^ x8 ^ y8
      }
      return result ^ x8 ^ y8
    }
    const F = (x: number, y: number, z: number) => (x & y) | (~x & z)
    const G = (x: number, y: number, z: number) => (x & z) | (y & ~z)
    const H = (x: number, y: number, z: number) => x ^ y ^ z
    const I = (x: number, y: number, z: number) => y ^ (x | ~z)
    const XX = (a: number, b: number, x: number, s: number, ac: number) => {
      a = addUnsigned(a, addUnsigned(addUnsigned(b, x), ac))
      return addUnsigned(rotateLeft(a, s), b)
    }
    
    const convertToWordArray = (str: string) => {
      const lWordCount = (str.length + 8 - (str.length + 8) % 64) / 64 + 1
      const lNumberOfWords = lWordCount * 16
      const lWordArray = new Array(lNumberOfWords - 1)
      let lWordIndex = 0
      let lBytePosition = 0
      let lByteCount = 0
      while (lByteCount < str.length) {
        lWordIndex = (lByteCount - (lByteCount % 4)) / 4
        lBytePosition = (lByteCount % 4) * 8
        lWordArray[lWordIndex] = lWordArray[lWordIndex] | (str.charCodeAt(lByteCount) << lBytePosition)
        lByteCount++
      }
      lWordIndex = (lByteCount - (lByteCount % 4)) / 4
      lBytePosition = (lByteCount % 4) * 8
      lWordArray[lWordIndex] = lWordArray[lWordIndex] | (0x80 << lBytePosition)
      lWordArray[lNumberOfWords - 2] = str.length << 3
      lWordArray[lNumberOfWords - 1] = str.length >>> 29
      return lWordArray
    }
    
    const wordToHex = (value: number) => {
      let hex = ''
      for (let i = 0; i <= 3; i++) {
        const byte = (value >>> (i * 8)) & 255
        hex += ('0' + byte.toString(16)).slice(-2)
      }
      return hex
    }
    
    const x = convertToWordArray(str)
    let a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476
    
    const S11 = 7, S12 = 12, S13 = 17, S14 = 22
    const S21 = 5, S22 = 9, S23 = 14, S24 = 20
    const S31 = 4, S32 = 11, S33 = 16, S34 = 23
    const S41 = 6, S42 = 10, S43 = 15, S44 = 21
    
    for (let k = 0; k < x.length; k += 16) {
      const AA = a, BB = b, CC = c, DD = d
      a = XX(a, b, c, d, x[k + 0], S11, 0xD76AA478)
      d = XX(d, a, b, c, x[k + 1], S12, 0xE8C7B756)
      c = XX(c, d, a, b, x[k + 2], S13, 0x242070DB)
      b = XX(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE)
      a = XX(a, b, c, d, x[k + 4], S11, 0xF57C0FAF)
      d = XX(d, a, b, c, x[k + 5], S12, 0x4787C62A)
      c = XX(c, d, a, b, x[k + 6], S13, 0xA8304613)
      b = XX(b, c, d, a, x[k + 7], S14, 0xFD469501)
      a = XX(a, b, c, d, x[k + 8], S11, 0x698098D8)
      d = XX(d, a, b, c, x[k + 9], S12, 0x8B44F7AF)
      c = XX(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1)
      b = XX(b, c, d, a, x[k + 11], S14, 0x895CD7BE)
      a = XX(a, b, c, d, x[k + 12], S11, 0x6B901122)
      d = XX(d, a, b, c, x[k + 13], S12, 0xFD987193)
      c = XX(c, d, a, b, x[k + 14], S13, 0xA679438E)
      b = XX(b, c, d, a, x[k + 15], S14, 0x49B40821)
      a = XX(a, b, c, d, x[k + 1], S21, 0xF61E2562)
      d = XX(d, a, b, c, x[k + 6], S22, 0xC040B340)
      c = XX(c, d, a, b, x[k + 11], S23, 0x265E5A51)
      b = XX(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA)
      a = XX(a, b, c, d, x[k + 5], S21, 0xD62F105D)
      d = XX(d, a, b, c, x[k + 10], S22, 0x2441453)
      c = XX(c, d, a, b, x[k + 15], S23, 0xD8A1E681)
      b = XX(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8)
      a = XX(a, b, c, d, x[k + 9], S21, 0x21E1CDE6)
      d = XX(d, a, b, c, x[k + 14], S22, 0xC33707D6)
      c = XX(c, d, a, b, x[k + 3], S23, 0xF4D50D87)
      b = XX(b, c, d, a, x[k + 8], S24, 0x455A14ED)
      a = XX(a, b, c, d, x[k + 13], S21, 0xA9E3E905)
      d = XX(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8)
      c = XX(c, d, a, b, x[k + 7], S23, 0x676F02D9)
      b = XX(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A)
      a = XX(a, b, c, d, x[k + 5], S31, 0xFFFA3942)
      d = XX(d, a, b, c, x[k + 8], S32, 0x8771F681)
      c = XX(c, d, a, b, x[k + 11], S33, 0x6D9D6122)
      b = XX(b, c, d, a, x[k + 14], S34, 0xFDE5380C)
      a = XX(a, b, c, d, x[k + 1], S31, 0xA4BEEA44)
      d = XX(d, a, b, c, x[k + 4], S32, 0x4BDECFA9)
      c = XX(c, d, a, b, x[k + 7], S33, 0xF6BB4B60)
      b = XX(b, c, d, a, x[k + 10], S34, 0xBEBFBC70)
      a = XX(a, b, c, d, x[k + 13], S31, 0x289B7EC6)
      d = XX(d, a, b, c, x[k + 0], S32, 0xEAA127FA)
      c = XX(c, d, a, b, x[k + 3], S33, 0xD4EF3085)
      b = XX(b, c, d, a, x[k + 6], S34, 0x4881D05)
      a = XX(a, b, c, d, x[k + 9], S31, 0xD9D4D039)
      d = XX(d, a, b, c, x[k + 12], S32, 0xE6DB99E5)
      c = XX(c, d, a, b, x[k + 15], S33, 0x1FA27CF8)
      b = XX(b, c, d, a, x[k + 2], S34, 0xC4AC5665)
      a = XX(a, b, c, d, x[k + 0], S41, 0xF4292244)
      d = XX(d, a, b, c, x[k + 7], S42, 0x432AFF97)
      c = XX(c, d, a, b, x[k + 14], S43, 0xAB9423A7)
      b = XX(b, c, d, a, x[k + 5], S44, 0xFC93A039)
      a = XX(a, b, c, d, x[k + 12], S41, 0x655B59C3)
      d = XX(d, a, b, c, x[k + 3], S42, 0x8F0CCC92)
      c = XX(c, d, a, b, x[k + 10], S43, 0xFFEFF47D)
      b = XX(b, c, d, a, x[k + 1], S44, 0x85845DD1)
      a = XX(a, b, c, d, x[k + 8], S41, 0x6FA87E4F)
      d = XX(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0)
      c = XX(c, d, a, b, x[k + 6], S43, 0xA3014314)
      b = XX(b, c, d, a, x[k + 13], S44, 0x4E0811A1)
      a = XX(a, b, c, d, x[k + 4], S41, 0xF7537E82)
      d = XX(d, a, b, c, x[k + 11], S42, 0xBD3AF235)
      c = XX(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB)
      b = XX(b, c, d, a, x[k + 9], S44, 0xEB86D391)
      a = addUnsigned(a, AA)
      b = addUnsigned(b, BB)
      c = addUnsigned(c, CC)
      d = addUnsigned(d, DD)
    }
    return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase()
  }
  
  results['MD5'] = md5(input.value)
  results['SHA-1'] = await hashText(input.value, 'SHA-1')
  results['SHA-256'] = await hashText(input.value, 'SHA-256')
  results['SHA-384'] = await hashText(input.value, 'SHA-384')
  results['SHA-512'] = await hashText(input.value, 'SHA-512')
  
  return results
})

const hashResults = ref<Record<string, string>>({})

const updateHashes = async () => {
  if (!input.value) {
    hashResults.value = {}
    return
  }
  hashResults.value = await hashes.value
}

const copyHash = (type: string) => {
  navigator.clipboard.writeText(hashResults.value[type])
  copied.value = type
  setTimeout(() => copied.value = null, 2000)
}
</script>

<template>
  <div class="container mx-auto px-6 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold flex items-center gap-3">
          <Hash class="w-8 h-8" />
          Hash Text
        </h1>
        <p class="text-muted-foreground mt-2">
          Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes.
        </p>
      </div>

      <!-- Input -->
      <Card class="mb-6">
        <CardHeader>
          <CardTitle>Input</CardTitle>
          <CardDescription>Enter text to hash</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            v-model="input"
            @input="updateHashes"
            placeholder="Enter text to hash..."
            class="w-full h-32 px-3 py-2 border rounded-md font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          ></textarea>
        </CardContent>
      </Card>

      <!-- Results -->
      <Card v-if="Object.keys(hashResults).length > 0">
        <CardHeader>
          <CardTitle>Hash Results</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div
            v-for="(hash, type) in hashResults"
            :key="type"
            class="p-4 bg-surface-hover rounded-lg border"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-semibold">{{ type }}</span>
              <Button @click="copyHash(type)" variant="ghost" size="sm">
                <component :is="copied === type ? Check : Copy" class="w-4 h-4" />
              </Button>
            </div>
            <div class="font-mono text-sm break-all">{{ hash }}</div>
          </div>
        </CardContent>
      </Card>

      <div v-else class="text-center py-16 text-muted-foreground">
        <Hash class="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Enter text above to generate hashes</p>
      </div>
    </div>
  </div>
</template>
