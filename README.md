# BunnyCDN Storage TypeScript Client

![GitHub](https://img.shields.io/github/license/bynarig/bunnycdn-storage-ts?style=flat-square) 
[![npm](https://img.shields.io/npm/v/bunnycdn-storage-ts?style=flat-square)](https://www.npmjs.com/package/bunnycdn-storage-ts)
[![Node.js Version](https://img.shields.io/node/v/bunnycdn-storage-ts?style=flat-square)](https://www.npmjs.com/package/bunnycdn-storage-ts)

A modern TypeScript client for the [BunnyCDN Storage API](https://bunnycdn.com/documentation/storage-api). This library provides a simple and type-safe way to interact with BunnyCDN Storage services.

## Features

- 🔄 Full TypeScript support with type definitions
- 🌐 Uses native Fetch API (no external dependencies)
- 📦 Supports both CommonJS and ESM
- 🔒 Type-safe API for BunnyCDN Storage operations
- 🌍 Region-specific storage endpoints

## Installation

```bash
# Using npm
npm install bunnycdn-storage-ts

# Using yarn
yarn add bunnycdn-storage-ts

# Using pnpm
pnpm add bunnycdn-storage-ts
```

## Usage

### Importing

```ts
// ESM
import BunnyStorage from 'bunnycdn-storage-ts';

// CommonJS
const BunnyStorage = require('bunnycdn-storage-ts').default;
```

### Initialization

```ts
// No region specified, defaults to Falkenstein (storage.bunnycdn.com)
const bunnyStorage = new BunnyStorage('API-KEY', 'STORAGE-ZONE-NAME');

// Specific region (ny.storage.bunnycdn.com)
const bunnyStorageRegion = new BunnyStorage('API-KEY', 'STORAGE-ZONE-NAME', 'ny');
```

### Available Regions

- `us` - United States
- `ny` - New York
- `la` - Los Angeles
- `sg` - Singapore
- `se` - Stockholm
- `br` - Brazil
- `jh` - Johannesburg
- `syd` - Sydney

### API Methods

#### List Files

```ts
// List all files in the storage zone
const files = await bunnyStorage.list();

// List files in a specific directory
const filesInDir = await bunnyStorage.list('/images');
```

#### Upload Files

```ts
// Upload a file from a file path
await bunnyStorage.upload('/path/to/local/file.jpg');

// Upload a file from a file path with a custom remote path
await bunnyStorage.upload('/path/to/local/file.jpg', 'remote/path/file.jpg');

// Upload a file from a Buffer
import { readFileSync } from 'fs';
const buffer = readFileSync('/path/to/local/file.jpg');
await bunnyStorage.upload(buffer, 'remote/path/file.jpg');
```

#### Download Files

```ts
// Download a file (default: text)
const textResponse = await bunnyStorage.download('file.txt');

// Download as ArrayBuffer
const binaryResponse = await bunnyStorage.download('file.jpg', 'arraybuffer');

// Download as Blob
const blobResponse = await bunnyStorage.download('file.jpg', 'blob');

// Download as JSON
const jsonResponse = await bunnyStorage.download('file.json', 'json');

// Download as Stream
const streamResponse = await bunnyStorage.download('file.mp4', 'stream');
```

#### Delete Files

```ts
// Delete a file
await bunnyStorage.delete('file.jpg');

// Delete a file in a subdirectory
await bunnyStorage.delete('/images/file.jpg');
```

### Error Handling

All methods throw errors for failed requests. It's recommended to use try/catch blocks:

```ts
try {
  const files = await bunnyStorage.list();
  console.log(files.data);
} catch (error) {
  console.error('Error listing files:', error.message);
}
```

## Response Format

All methods return a standardized response object:

```ts
interface FetchResponse<T = any> {
  data: T;                           // Response data
  status: number;                    // HTTP status code
  statusText: string;                // HTTP status text
  headers: Record<string, string>;   // Response headers
  config: any;                       // Request configuration
}
```

## Development

### Building

```bash
# Install dependencies
npm install

# Build both CommonJS and ESM versions
npm run build:all
```

## License

MIT

## Disclaimer

Note that this project and the maintainer(s) of this repository are in no way, shape or form affiliated with BunnyCDN.
