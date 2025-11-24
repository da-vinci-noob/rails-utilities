interface Utility {
  id: number
  title: string
  description: string
  icon: string
  status: string
  category: string
  createdAt: Date
}

export const categories = [
  'All',
  'Encoders/Decoders',
  'Formatters',
  'Converters',
  'Generators',
  'Crypto & Security',
  'Image Tools',
  'Text Tools',
  'Parsers & Analyzers',
  'Network',
  'Misc'
] as const

export const utilities: Utility[] = [
  // {
  //   id: 1,
  //   title: 'All Utilities',
  //   description: 'Browse all utilities in a gallery view',
  //   icon: 'https://api.iconify.design/lucide:layout-grid.svg',
  //   status: 'Stable',
  //   category: 'Misc',
  //   createdAt: new Date('2024-11-25')
  // },
  {
    id: 2,
    title: 'Unix Time Converter',
    description: 'Convert Unix timestamp to date and vice versa',
    icon: 'https://api.iconify.design/lucide:clock.svg',
    status: 'Stable',
    category: 'Converters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 3,
    title: 'JSON Format/Validate',
    description: 'Format and validate JSON data',
    icon: 'https://api.iconify.design/lucide:file-json.svg',
    status: 'Stable',
    category: 'Formatters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 4,
    title: 'Base64 String Encode/Decode',
    description: 'Encode and decode Base64 strings',
    icon: 'https://api.iconify.design/lucide:file-code.svg',
    status: 'Stable',
    category: 'Encoders/Decoders',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 5,
    title: 'Base64 Image Encode/Decode',
    description: 'Encode and decode Base64 images',
    icon: 'https://api.iconify.design/lucide:image.svg',
    status: 'Stable',
    category: 'Image Tools',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 6,
    title: 'JWT Debugger',
    description: 'Decode and debug JWT tokens',
    icon: 'https://api.iconify.design/lucide:shield-check.svg',
    status: 'Stable',
    category: 'Crypto & Security',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 7,
    title: 'RegExp Tester',
    description: 'Test regular expressions',
    icon: 'https://api.iconify.design/lucide:regex.svg',
    status: 'Stable',
    category: 'Parsers & Analyzers',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 8,
    title: 'URL Encode/Decode',
    description: 'Encode and decode URLs',
    icon: 'https://api.iconify.design/lucide:link.svg',
    status: 'Stable',
    category: 'Encoders/Decoders',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 9,
    title: 'URL Parser',
    description: 'Parse URLs into components',
    icon: 'https://api.iconify.design/lucide:link-2.svg',
    status: 'Stable',
    category: 'Parsers & Analyzers',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 10,
    title: 'HTML Entity Encode/Decode',
    description: 'Encode and decode HTML entities',
    icon: 'https://api.iconify.design/lucide:code.svg',
    status: 'Stable',
    category: 'Encoders/Decoders',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 11,
    title: 'Backslash Escape/Unescape',
    description: 'Escape and unescape backslashes',
    icon: 'https://api.iconify.design/lucide:slash.svg',
    status: 'Stable',
    category: 'Encoders/Decoders',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 12,
    title: 'UUID/ULID Generate/Decode',
    description: 'Generate and decode UUIDs and ULIDs',
    icon: 'https://api.iconify.design/lucide:fingerprint.svg',
    status: 'Stable',
    category: 'Generators',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 13,
    title: 'HTML Preview',
    description: 'Preview HTML code',
    icon: 'https://api.iconify.design/lucide:eye.svg',
    status: 'Stable',
    category: 'Misc',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 14,
    title: 'Text Diff Checker',
    description: 'Compare two texts',
    icon: 'https://api.iconify.design/lucide:git-compare.svg',
    status: 'Stable',
    category: 'Text Tools',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 15,
    title: 'YAML to JSON',
    description: 'Convert YAML to JSON',
    icon: 'https://api.iconify.design/lucide:file-json-2.svg',
    status: 'Stable',
    category: 'Converters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 16,
    title: 'JSON to YAML',
    description: 'Convert JSON to YAML',
    icon: 'https://api.iconify.design/lucide:file-text.svg',
    status: 'Stable',
    category: 'Converters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 17,
    title: 'Number Base Converter',
    description: 'Convert numbers between bases',
    icon: 'https://api.iconify.design/lucide:calculator.svg',
    status: 'Stable',
    category: 'Converters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 18,
    title: 'HTML Beautify/Minify',
    description: 'Beautify or minify HTML code',
    icon: 'https://api.iconify.design/lucide:file-code-2.svg',
    status: 'Stable',
    category: 'Formatters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 19,
    title: 'CSS Beautify/Minify',
    description: 'Beautify or minify CSS code',
    icon: 'https://api.iconify.design/lucide:palette.svg',
    status: 'Stable',
    category: 'Formatters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 20,
    title: 'JS Beautify/Minify',
    description: 'Beautify or minify JavaScript code',
    icon: 'https://api.iconify.design/lucide:file-js.svg',
    status: 'Stable',
    category: 'Formatters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 21,
    title: 'ERB Beautify/Minify',
    description: 'Beautify or minify ERB code',
    icon: 'https://api.iconify.design/lucide:file-code.svg',
    status: 'Stable',
    category: 'Formatters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 22,
    title: 'LESS Beautify/Minify',
    description: 'Beautify or minify LESS code',
    icon: 'https://api.iconify.design/lucide:palette.svg',
    status: 'Stable',
    category: 'Formatters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 23,
    title: 'SCSS Beautify/Minify',
    description: 'Beautify or minify SCSS code',
    icon: 'https://api.iconify.design/lucide:palette.svg',
    status: 'Stable',
    category: 'Formatters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 24,
    title: 'XML Beautify/Minify',
    description: 'Beautify or minify XML code',
    icon: 'https://api.iconify.design/lucide:file-code.svg',
    status: 'Stable',
    category: 'Formatters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 25,
    title: 'Lorem Ipsum Generator',
    description: 'Generate Lorem Ipsum text',
    icon: 'https://api.iconify.design/lucide:align-left.svg',
    status: 'Stable',
    category: 'Generators',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 26,
    title: 'QR Code Reader/Generator',
    description: 'Read and generate QR codes',
    icon: 'https://api.iconify.design/lucide:qr-code.svg',
    status: 'Stable',
    category: 'Generators',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 27,
    title: 'String Inspector',
    description: 'Inspect string details',
    icon: 'https://api.iconify.design/lucide:search.svg',
    status: 'Stable',
    category: 'Text Tools',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 28,
    title: 'JSON to CSV',
    description: 'Convert JSON to CSV',
    icon: 'https://api.iconify.design/lucide:table.svg',
    status: 'Stable',
    category: 'Converters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 29,
    title: 'CSV to JSON',
    description: 'Convert CSV to JSON',
    icon: 'https://api.iconify.design/lucide:file-json.svg',
    status: 'Stable',
    category: 'Converters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 30,
    title: 'Hash Generator',
    description: 'Generate various hashes',
    icon: 'https://api.iconify.design/lucide:hash.svg',
    status: 'Stable',
    category: 'Crypto & Security',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 31,
    title: 'HTML to JSX',
    description: 'Convert HTML to JSX',
    icon: 'https://api.iconify.design/lucide:code-2.svg',
    status: 'Stable',
    category: 'Converters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 32,
    title: 'Markdown Preview',
    description: 'Preview Markdown content',
    icon: 'https://api.iconify.design/lucide:file-text.svg',
    status: 'Stable',
    category: 'Misc',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 33,
    title: 'SQL Formatter',
    description: 'Format SQL queries',
    icon: 'https://api.iconify.design/lucide:database.svg',
    status: 'Stable',
    category: 'Formatters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 34,
    title: 'String Case Converter',
    description: 'Convert string case',
    icon: 'https://api.iconify.design/lucide:type.svg',
    status: 'Stable',
    category: 'Text Tools',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 35,
    title: 'Cron Job Parser',
    description: 'Parse Cron job expressions',
    icon: 'https://api.iconify.design/lucide:clock.svg',
    status: 'Stable',
    category: 'Parsers & Analyzers',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 36,
    title: 'Color Converter',
    description: 'Convert colors between formats',
    icon: 'https://api.iconify.design/lucide:palette.svg',
    status: 'Stable',
    category: 'Parsers & Analyzers',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 37,
    title: 'PHP to JSON',
    description: 'Convert PHP array to JSON',
    icon: 'https://api.iconify.design/lucide:file-json.svg',
    status: 'Stable',
    category: 'Converters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 38,
    title: 'JSON to PHP',
    description: 'Convert JSON to PHP array',
    icon: 'https://api.iconify.design/lucide:file-code.svg',
    status: 'Stable',
    category: 'Converters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 39,
    title: 'PHP Serializer',
    description: 'Serialize PHP data',
    icon: 'https://api.iconify.design/lucide:package.svg',
    status: 'Stable',
    category: 'Converters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 40,
    title: 'PHP Unserializer',
    description: 'Unserialize PHP data',
    icon: 'https://api.iconify.design/lucide:package-open.svg',
    status: 'Stable',
    category: 'Converters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 41,
    title: 'Random String Generator',
    description: 'Generate random strings',
    icon: 'https://api.iconify.design/lucide:shuffle.svg',
    status: 'Stable',
    category: 'Generators',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 42,
    title: 'SVG to CSS',
    description: 'Convert SVG to CSS background',
    icon: 'https://api.iconify.design/lucide:image.svg',
    status: 'Stable',
    category: 'Converters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 43,
    title: 'cURL to Code',
    description: 'Convert cURL to code snippets',
    icon: 'https://api.iconify.design/lucide:terminal.svg',
    status: 'Stable',
    category: 'Converters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 44,
    title: 'JSON to Code',
    description: 'Convert JSON to code structs',
    icon: 'https://api.iconify.design/lucide:code.svg',
    status: 'Stable',
    category: 'Converters',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 45,
    title: 'Certificate Decoder (X.509)',
    description: 'Decode X.509 certificates',
    icon: 'https://api.iconify.design/lucide:file-key.svg',
    status: 'Stable',
    category: 'Crypto & Security',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 46,
    title: 'Hex to ASCII',
    description: 'Convert Hex to ASCII',
    icon: 'https://api.iconify.design/lucide:binary.svg',
    status: 'Stable',
    category: 'Encoders/Decoders',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 47,
    title: 'ASCII to Hex',
    description: 'Convert ASCII to Hex',
    icon: 'https://api.iconify.design/lucide:binary.svg',
    status: 'Stable',
    category: 'Encoders/Decoders',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 48,
    title: 'Line Sort/Dedupe',
    description: 'Sort and deduplicate lines',
    icon: 'https://api.iconify.design/lucide:list.svg',
    status: 'Stable',
    category: 'Text Tools',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 49,
    title: 'Key Pair Generator',
    description: 'Generate public/private key pairs',
    icon: 'https://api.iconify.design/lucide:key.svg',
    status: 'Stable',
    category: 'Crypto & Security',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 50,
    title: 'ID Analyzer',
    description: 'Analyze and parse IDs',
    icon: 'https://api.iconify.design/lucide:search.svg',
    status: 'Stable',
    category: 'Parsers & Analyzers',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 51,
    title: 'DNS Lookup',
    description: 'Perform DNS lookups',
    icon: 'https://api.iconify.design/lucide:globe.svg',
    status: 'Stable',
    category: 'Network',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 52,
    title: 'File Generator',
    description: 'Generate dummy files',
    icon: 'https://api.iconify.design/lucide:file-plus.svg',
    status: 'Stable',
    category: 'Generators',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 53,
    title: 'Image Converter',
    description: 'Convert images between formats',
    icon: 'https://api.iconify.design/lucide:image.svg',
    status: 'Stable',
    category: 'Image Tools',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 54,
    title: 'Image Operations',
    description: 'Perform operations on images',
    icon: 'https://api.iconify.design/lucide:image-plus.svg',
    status: 'Stable',
    category: 'Image Tools',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 55,
    title: 'Compression Tools',
    description: 'Compress and decompress data',
    icon: 'https://api.iconify.design/lucide:archive.svg',
    status: 'Stable',
    category: 'Misc',
    createdAt: new Date('2024-11-25')
  },
  {
    id: 56,
    title: 'Secret Generator',
    description: 'Generate secure secrets',
    icon: 'https://api.iconify.design/lucide:lock.svg',
    status: 'Stable',
    category: 'Crypto & Security',
    createdAt: new Date('2024-11-25')
  }
]
