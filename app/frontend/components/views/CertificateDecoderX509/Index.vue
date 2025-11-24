<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const certInput = ref(`-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAJC1HiIAZAiUMA0GCSqGSIb3Qk3AAAABBQAwPjELMAkG
A1UEBhMCTkwxETAPBgNVBAoMCFBvbGFyU1NMMRwwGgYDVQQDDBNQb2xhcnNzbCBU
ZXN0IEVDIENBMB4XDTE5MDIxMDE0NDQwMFoXDTI5MDIxMDE4NDQwMFowPjELMAkG
-----END CERTIFICATE-----`)

const decoded = computed(() => {
  const pem = certInput.value.trim()
  if (!pem) return null

  try {
    // Extract base64 content
    const base64Match = pem.match(/-----BEGIN CERTIFICATE-----\s*([\s\S]*?)\s*-----END CERTIFICATE-----/)
    if (!base64Match) {
      return { error: 'Invalid PEM format. Must include BEGIN/END CERTIFICATE markers.' }
    }

    const base64 = base64Match[1].replace(/\s/g, '')

    // Decode base64 to binary
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }

    // Basic ASN.1 DER parsing for X.509
    // This is a simplified parser - full X.509 parsing requires a proper ASN.1 library
    const info: Record<string, string> = {}

    info['Format'] = 'X.509 DER/PEM'
    info['Size'] = `${bytes.length} bytes`
    info['Base64 Length'] = `${base64.length} characters`

    // Try to extract some basic info from the DER structure
    // Look for common OIDs
    const hexString = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    // Common Name OID: 2.5.4.3 = 55 04 03
    const cnMatch = hexString.match(/5504030c([0-9a-f]{2})([0-9a-f]+)/i)
    if (cnMatch) {
      const len = parseInt(cnMatch[1], 16)
      const cnHex = cnMatch[2].slice(0, len * 2)
      const cn =
        cnHex
          .match(/.{2}/g)
          ?.map((h) => String.fromCharCode(parseInt(h, 16)))
          .join('') || ''
      info['Common Name (CN)'] = cn
    }

    // Organization OID: 2.5.4.10 = 55 04 0a
    const orgMatch = hexString.match(/55040a0c([0-9a-f]{2})([0-9a-f]+)/i)
    if (orgMatch) {
      const len = parseInt(orgMatch[1], 16)
      const orgHex = orgMatch[2].slice(0, len * 2)
      const org =
        orgHex
          .match(/.{2}/g)
          ?.map((h) => String.fromCharCode(parseInt(h, 16)))
          .join('') || ''
      info['Organization (O)'] = org
    }

    // Country OID: 2.5.4.6 = 55 04 06
    const countryMatch = hexString.match(/550406([0-9a-f]{2})([0-9a-f]{4})/i)
    if (countryMatch) {
      const countryHex = countryMatch[2]
      const country =
        countryHex
          .match(/.{2}/g)
          ?.map((h) => String.fromCharCode(parseInt(h, 16)))
          .join('') || ''
      info['Country (C)'] = country
    }

    // Look for validity dates (UTCTime starts with 17)
    const dateMatches = hexString.match(/17([0-9a-f]{2})([0-9a-f]+)/gi) || []
    if (dateMatches.length >= 2) {
      const parseUTCTime = (hex: string): string => {
        const bytes =
          hex
            .match(/.{2}/g)
            ?.map((h) => String.fromCharCode(parseInt(h, 16)))
            .join('') || ''
        if (bytes.length >= 12) {
          const year = parseInt(bytes.slice(0, 2))
          const fullYear = year >= 50 ? 1900 + year : 2000 + year
          return `${fullYear}-${bytes.slice(2, 4)}-${bytes.slice(4, 6)} ${bytes.slice(6, 8)}:${bytes.slice(8, 10)}:${bytes.slice(10, 12)} UTC`
        }
        return 'Unknown'
      }

      const notBefore = dateMatches[0].slice(4)
      const notAfter = dateMatches[1].slice(4)
      info['Not Before'] = parseUTCTime(notBefore)
      info['Not After'] = parseUTCTime(notAfter)
    }

    // SHA-256 fingerprint
    crypto.subtle.digest('SHA-256', bytes).then((hash) => {
      const fingerprint = Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
        .join(':')
      info['SHA-256 Fingerprint'] = fingerprint
    })

    return { info }
  } catch (e: any) {
    return { error: e.message || 'Failed to decode certificate' }
  }
})
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Certificate Decoder (X.509)</CardTitle>
        <CardDescription>Decode and inspect X.509 PEM certificates</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>PEM Certificate</Label>
          <Textarea
            v-model="certInput"
            placeholder="Paste PEM certificate here..."
            class="font-mono text-xs h-40 resize-none"
          />
        </div>

        <div v-if="decoded?.error" class="p-4 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-md">
          {{ decoded.error }}
        </div>

        <div v-else-if="decoded?.info" class="space-y-2">
          <Label>Certificate Information</Label>
          <div class="bg-muted rounded-md p-4 space-y-2">
            <div
              v-for="(value, key) in decoded.info"
              :key="key"
              class="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm border-b border-border pb-2 last:border-0"
            >
              <span class="text-muted-foreground font-medium">{{ key }}</span>
              <span class="font-mono text-xs break-all">{{ value }}</span>
            </div>
          </div>
          <p class="text-xs text-muted-foreground mt-2">
            Note: This is a basic decoder. For complete certificate analysis, use OpenSSL or a dedicated tool.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
