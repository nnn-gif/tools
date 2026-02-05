/**
 * Metadata Decoder for AgentScan
 * Decodes ABI-encoded metadata values from smart contract events using viem
 */

import { decodeAbiParameters } from 'viem'

export interface DecodedMetadata {
  key: string
  value: string
  type: string
  raw: string
  isAddress: boolean
  isReadable: boolean
}

/**
 * Decodes an ABI-encoded metadata value from the MetadataSet event
 * Event signature: MetadataSet(uint256 indexed agentId, string indexed metadataKey, string metadataKey, bytes metadataValue)
 *
 * The data field contains: (string metadataKey, bytes metadataValue)
 */
export function decodeMetadataValue(encodedValue: string): DecodedMetadata {
  // Remove 0x prefix if present
  const hex = encodedValue.replace('0x', '')

  // Default return for empty or invalid values
  if (!hex || hex.length < 128) {
    return {
      key: '',
      value: encodedValue,
      type: 'unknown',
      raw: encodedValue,
      isAddress: false,
      isReadable: false
    }
  }

  try {
    // Decode the ABI-encoded tuple (string, bytes)
    const decoded = decodeAbiParameters([{ type: 'string' }, { type: 'bytes' }], `0x${hex}`)

    const [key, valueBytes] = decoded as [string, `0x${string}`]
    const valueHex = valueBytes.replace('0x', '')

    // Determine the type of value
    let type = 'bytes'
    let value = valueHex
    let isAddress = false
    let isReadable = false

    // Check if it's an Ethereum address (20 bytes)
    if (valueHex.length === 40) {
      type = 'address'
      value = `0x${valueHex}`
      isAddress = true
      isReadable = true
    }
    // Check if it's a readable string
    else {
      try {
        // Try to decode as UTF-8
        const decodedStr = Buffer.from(valueHex, 'hex').toString('utf-8')
        // Check if it contains only printable ASCII characters
        if (/^[\x20-\x7E\s]*$/.test(decodedStr) && decodedStr.length > 0) {
          type = 'string'
          value = decodedStr
          isReadable = true
        }
      } catch {
        // Keep as bytes
        type = 'bytes'
      }
    }

    return {
      key,
      value,
      type,
      raw: encodedValue,
      isAddress,
      isReadable
    }
  } catch (error) {
    console.error('Failed to decode metadata value:', error)
    return {
      key: '',
      value: encodedValue,
      type: 'unknown',
      raw: encodedValue,
      isAddress: false,
      isReadable: false
    }
  }
}

/**
 * Formats a metadata value for display based on its type
 */
export function formatMetadataValue(decoded: DecodedMetadata): string {
  if (decoded.isAddress) {
    return decoded.value
  }
  if (decoded.type === 'string') {
    return decoded.value
  }
  return decoded.raw
}

/**
 * Truncates an address or long value for display
 */
export function truncateValue(value: string, maxLength = 20): string {
  if (!value || value.length <= maxLength) {
    return value
  }
  return `${value.slice(0, maxLength / 2 + 2)}...${value.slice(-maxLength / 2)}`
}

/**
 * Gets a human-readable type label
 */
export function getTypeLabel(decoded: DecodedMetadata): string {
  if (decoded.isAddress) return 'Ethereum Address'
  if (decoded.type === 'string') return 'String'
  if (decoded.type === 'bytes') return 'Bytes Data'
  return 'Unknown'
}

/**
 * Checks if a value is likely a URL
 */
export function isUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'ipfs:'
  } catch {
    return false
  }
}

/**
 * Formats IPFS URIs to gateway URLs
 */
export function formatIpfsUrl(value: string): string | null {
  if (value.startsWith('ipfs://')) {
    const ipfsHash = value.replace('ipfs://', '')
    return `https://ipfs.io/ipfs/${ipfsHash}`
  }
  return null
}

/**
 * Converts an Ethereum block number to approximate timestamp
 * Uses average block time of 12 seconds from Ethereum genesis (July 30, 2015)
 * Genesis block: 0 at timestamp 1438269973
 */
export function blockToTimestamp(blockNumber: number): Date {
  const GENESIS_BLOCK = 0
  const GENESIS_TIMESTAMP = 1438269973 // July 30, 2015, 3:46:13 PM UTC
  const AVERAGE_BLOCK_TIME = 12 // seconds per block (Ethereum mainnet)

  const blocksSinceGenesis = blockNumber - GENESIS_BLOCK
  const estimatedTimestamp = GENESIS_TIMESTAMP + blocksSinceGenesis * AVERAGE_BLOCK_TIME

  return new Date(estimatedTimestamp * 1000) // Convert to milliseconds
}

/**
 * Formats a block number to a human-readable date string
 */
export function formatBlockDate(blockNumber: number): string {
  const date = blockToTimestamp(blockNumber)
  return date.toLocaleString()
}
