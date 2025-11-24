<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface IDInfo {
  type: string
  valid: boolean
  details: Record<string, string>
}

const idInput = ref('')

const analyzeID = computed((): IDInfo | null => {
  const id = idInput.value.trim()
  if (!id) return null

  // UUID v4 pattern
  const uuidV4Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (uuidV4Pattern.test(id)) {
    return {
      type: 'UUID v4',
      valid: true,
      details: {
        Version: '4 (Random)',
        Variant: 'RFC 4122',
        Format: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      }
    }
  }

  // UUID v1 pattern (time-based)
  const uuidV1Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (uuidV1Pattern.test(id)) {
    return {
      type: 'UUID v1',
      valid: true,
      details: {
        Version: '1 (Time-based)',
        Variant: 'RFC 4122'
      }
    }
  }

  // Generic UUID pattern
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (uuidPattern.test(id)) {
    const version = id.charAt(14)
    return {
      type: `UUID v${version}`,
      valid: true,
      details: {
        Version: version,
        Format: 'Standard UUID'
      }
    }
  }

  // ULID pattern (26 chars, Crockford's Base32)
  const ulidPattern = /^[0-9A-HJKMNP-TV-Z]{26}$/i
  if (ulidPattern.test(id)) {
    try {
      const timeChars = id.substring(0, 10)
      const base32Chars = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
      let timestamp = 0
      for (const char of timeChars.toUpperCase()) {
        timestamp = timestamp * 32 + base32Chars.indexOf(char)
      }
      const date = new Date(timestamp)
      return {
        type: 'ULID',
        valid: true,
        details: {
          Timestamp: date.toISOString(),
          'Time (ms)': timestamp.toString(),
          Random: id.substring(10)
        }
      }
    } catch {
      return { type: 'ULID', valid: false, details: { Error: 'Invalid ULID' } }
    }
  }

  // MongoDB ObjectId (24 hex chars)
  const objectIdPattern = /^[0-9a-f]{24}$/i
  if (objectIdPattern.test(id)) {
    const timestamp = parseInt(id.substring(0, 8), 16)
    const date = new Date(timestamp * 1000)
    return {
      type: 'MongoDB ObjectId',
      valid: true,
      details: {
        Timestamp: date.toISOString(),
        'Machine ID': id.substring(8, 14),
        'Process ID': id.substring(14, 18),
        Counter: id.substring(18, 24)
      }
    }
  }

  // Snowflake ID (numeric, typically 18-19 digits)
  const snowflakePattern = /^\d{17,19}$/
  if (snowflakePattern.test(id)) {
    const snowflake = BigInt(id)
    // Discord epoch: 1420070400000
    const discordTimestamp = Number((snowflake >> 22n) + 1420070400000n)
    const twitterTimestamp = Number((snowflake >> 22n) + 1288834974657n)
    return {
      type: 'Snowflake ID',
      valid: true,
      details: {
        'Discord Time': new Date(discordTimestamp).toISOString(),
        'Twitter Time': new Date(twitterTimestamp).toISOString(),
        'Worker ID': ((snowflake >> 17n) & 31n).toString(),
        'Process ID': ((snowflake >> 12n) & 31n).toString(),
        Sequence: (snowflake & 4095n).toString()
      }
    }
  }

  // NanoID pattern (21 chars by default, URL-safe)
  const nanoidPattern = /^[A-Za-z0-9_-]{21}$/
  if (nanoidPattern.test(id)) {
    return {
      type: 'NanoID (likely)',
      valid: true,
      details: {
        Length: '21 characters',
        Format: 'URL-safe Base64'
      }
    }
  }

  // CUID pattern
  const cuidPattern = /^c[a-z0-9]{24}$/
  if (cuidPattern.test(id)) {
    return {
      type: 'CUID',
      valid: true,
      details: {
        Prefix: 'c',
        Length: '25 characters'
      }
    }
  }

  return {
    type: 'Unknown',
    valid: false,
    details: {
      Length: id.length.toString(),
      Pattern: /^[0-9]+$/.test(id) ? 'Numeric' : /^[0-9a-f]+$/i.test(id) ? 'Hexadecimal' : 'Alphanumeric'
    }
  }
})
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>ID Analyzer</CardTitle>
        <CardDescription>Detect and analyze various ID formats (UUID, ULID, ObjectId, Snowflake, etc.)</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>Enter ID</Label>
          <Input v-model="idInput" placeholder="Paste any ID here..." class="font-mono" />
        </div>

        <div v-if="analyzeID" class="space-y-4">
          <div
            class="p-4 rounded-md"
            :class="analyzeID.valid ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'"
          >
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ analyzeID.valid ? '✓' : '?' }}</span>
              <div>
                <div class="font-semibold text-lg">{{ analyzeID.type }}</div>
                <div class="text-sm text-muted-foreground">
                  {{ analyzeID.valid ? 'Valid format detected' : 'Format could not be determined' }}
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <Label>Details</Label>
            <div class="bg-muted rounded-md p-4 space-y-2">
              <div v-for="(value, key) in analyzeID.details" :key="key" class="flex justify-between text-sm">
                <span class="text-muted-foreground">{{ key }}</span>
                <span class="font-mono">{{ value }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center text-muted-foreground py-8">Enter an ID to analyze</div>
      </CardContent>
    </Card>
  </div>
</template>
