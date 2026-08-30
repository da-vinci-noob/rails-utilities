# 🛠️ Rails Utilities: Collection of Utilities

> A comprehensive collection of **60 developer utilities** built with Rails 8, Vue 3, and TailwindCSS 4. All tools run client-side in the browser for privacy and speed.

![Vue 3](https://img.shields.io/badge/vue-3-42b883?style=for-the-badge&logo=vue.js)
![Rails 8](https://img.shields.io/badge/rails-8-cc0000?style=for-the-badge&logo=ruby-on-rails)
![TailwindCSS 4](https://img.shields.io/badge/tailwind-4-38bdf8?style=for-the-badge&logo=tailwindcss)

---

## ✨ Features

- 🔒 **Privacy-first** - All utilities run client-side, your data never leaves your browser
- 🎨 **Dark Mode** - Beautiful dark theme by default
- ⌨️ **Command Center** - Launch any utility instantly with `Ctrl/⌘ + K`
- 📌 **Pinned & Recent** - Pin favorite tools and jump back to recently used ones
- 🧩 **Saved Snippets & History** - Save inputs per tool, with automatic recent history
- 💾 **Workspace Backup** - Export and import snippets, history, and preferences as JSON
- 🚀 **Onboarding** - Personalize your dashboard with your favorite categories on first run
- 📂 **Categorized** - Utilities organized in collapsible categories
- 📱 **Responsive** - Works on desktop, tablet, and mobile
- ⚡ **Fast** - No server round-trips for most operations

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/da-vinci-noob/rails-utilities.git
cd rails-utilities

# Install dependencies
bundle install
bun install

# Start the development server
bin/dev
```

---

## 📦 Tech Stack

- **Ruby on Rails 8** - Backend framework
- **Vue 3 + TypeScript** - Frontend framework
- **TailwindCSS 4** - Styling
- **shadcn/ui** - UI components
- **Vite** - Build tool

---

## 🧰 Utilities (60 Total)

### 🔐 Encoders/Decoders (6)

- **Base64 String Encode/Decode** - Encode and decode Base64 strings
- **URL Encode/Decode** - Encode and decode URLs
- **HTML Entity Encode/Decode** - Encode and decode HTML entities
- **Backslash Escape/Unescape** - Escape and unescape backslashes
- **Hex to ASCII** - Convert Hex to ASCII
- **ASCII to Hex** - Convert ASCII to Hex

### 📝 Formatters (9)

- **JSON Format/Validate** - Format and validate JSON data
- **HTML Beautify/Minify** - Beautify or minify HTML code
- **CSS Beautify/Minify** - Beautify or minify CSS code
- **JS Beautify/Minify** - Beautify or minify JavaScript code
- **ERB Beautify/Minify** - Beautify or minify ERB code
- **LESS Beautify/Minify** - Beautify or minify LESS code
- **SCSS Beautify/Minify** - Beautify or minify SCSS code
- **XML Beautify/Minify** - Beautify or minify XML code
- **SQL Formatter** - Format SQL queries

### 🔄 Converters (16)

- **Unix Time Converter** - Convert Unix timestamp to date and vice versa
- **YAML to JSON** - Convert YAML to JSON
- **JSON to YAML** - Convert JSON to YAML
- **Number Base Converter** - Convert numbers between bases
- **JSON to CSV** - Convert JSON to CSV
- **CSV to JSON** - Convert CSV to JSON
- **HTML to JSX** - Convert HTML to JSX
- **PHP to JSON** - Convert PHP array to JSON
- **JSON to PHP** - Convert JSON to PHP array
- **PHP Serializer** - Serialize PHP data
- **PHP Unserializer** - Unserialize PHP data
- **SVG to CSS** - Convert SVG to CSS background
- **cURL to Code** - Convert cURL to code snippets
- **JSON to Code** - Convert JSON to code structs
- **Timestamp Converter** - Convert Unix timestamps to dates and back
- **Unit Converter** - Convert length, mass, temperature, and data units

### 🎲 Generators (6)

- **UUID/ULID Generate/Decode** - Generate and decode UUIDs and ULIDs
- **Lorem Ipsum Generator** - Generate Lorem Ipsum text
- **QR Code Reader/Generator** - Read and generate QR codes
- **Random String Generator** - Generate random strings
- **File Generator** - Generate dummy files
- **Secret Generator** - Generate secure secrets

### 🔑 Crypto & Security (6)

- **JWT Debugger** - Decode and debug JWT tokens
- **Hash Generator** - Generate various hashes (MD5, SHA-1, SHA-256, etc.)
- **Certificate Decoder (X.509)** - Decode X.509 certificates
- **Key Pair Generator** - Generate RSA/ECDSA public/private key pairs
- **Password Strength** - Analyze password strength and estimate crack time

### 🖼️ Image Tools (3)

- **Base64 Image Encode/Decode** - Encode and decode Base64 images
- **Image Converter** - Convert images between PNG, JPEG, WebP formats
- **Image Operations** - Resize, rotate, and flip images

### 📄 Text Tools (4)

- **Text Diff Checker** - Compare two texts side by side
- **String Inspector** - Inspect string length, words, characters
- **String Case Converter** - Convert to camelCase, snake_case, etc.
- **Line Sort/Dedupe** - Sort and deduplicate lines

### 🔍 Parsers & Analyzers (5)

- **RegExp Tester** - Test regular expressions with highlighting
- **URL Parser** - Parse URLs into protocol, host, path, etc.
- **Cron Job Parser** - Parse and explain cron expressions
- **Color Converter** - Convert between HEX, RGB, HSL formats
- **ID Analyzer** - Analyze UUID, ULID, ObjectId, Snowflake IDs

### 🌐 Network (1)

- **DNS Lookup** - Perform DNS lookups via Cloudflare DoH

### 📦 Misc (4)

- **HTML Preview** - Live preview HTML code
- **Markdown Preview** - Live preview Markdown content
- **Compression Tools** - Gzip compress and decompress data
- **Pomodoro Timer** - Focus with timed work and break sessions

---

## 🧠 Workspace Features

Beyond the tools themselves, the app remembers how you work:

- **Command Center** (`Ctrl/⌘ + K`) - Fuzzy search by name, description, or category; recently used tools rank first.
- **Pinned tools** - Pin any utility from the dashboard gallery; filter to pinned-only.
- **Recently used** - Automatically tracked and shown on the dashboard.
- **Saved snippets** - Named, per-tool snapshots of inputs and outputs (JSON Format/Validate, Timestamp Converter, Unit Converter).
- **Recent history** - Each integrated tool keeps the last 20 inputs for instant restore.
- **Workspace backup** - Export all snippets, history, and preferences to a JSON file, and import them on any device.
- **First-run onboarding** - Pick your favorite categories once; the dashboard pins suggested tools for you.

All workspace data lives in `localStorage` — nothing is uploaded, no account needed.

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.