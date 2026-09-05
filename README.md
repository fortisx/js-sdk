# FortisX JavaScript SDK

This guide shows how to interact with the API using the JavaScript client.

---

## Installation

```bash
npm install @fortisx/sdk
```

or

```bash
yarn add @fortisx/sdk
```

---

## Initialization

### Modern usage (ES Modules)

```js
import { API } from '@fortisx/sdk';

const api = new API('YOUR_API_KEY');
```

### Legacy usage (CommonJS)

```js
const { API } = require('@fortisx/sdk');

const api = new API('YOUR_API_KEY');
```

The constructor accepts either an API key string or an options object:

```js
const api = new API({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://api.fortisx.fi/v1',
  timeout: 10000,
});
```

**Constructor options**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `apiKey` | string | – | API key used for authorization |
| `baseUrl` | string | `https://api.fortisx.fi/v1` | Override if using a custom environment |
| `timeout` | number | `10000` | Request timeout in milliseconds |

---

## Methods

| Method | Arguments | Returns | Description |
|--------|-----------|---------|-------------|
| `get(endpoint, params?)` | `string`, `Record<string, unknown>?` | `Promise<any>` | Performs a GET request |
| `post(endpoint, data?)` | `string`, `unknown?` | `Promise<any>` | Performs a POST request |
| `put(endpoint, data?)` | `string`, `unknown?` | `Promise<any>` | Performs a PUT request |
| `delete(endpoint)` | `string` | `Promise<any>` | Performs a DELETE request |

Responses with an `application/json` content type are parsed as JSON. Other responses are returned as text.

---

## Error Handling

All methods return a `Promise`. HTTP errors, request timeouts, and network errors are thrown as `APIError` instances exported by the SDK.

| Field | Type | Description |
|--------|------|-------------|
| `message` | string | Short description of the error |
| `status` | number (optional) | HTTP status code; `408` for an SDK request timeout; undefined for network errors |
| `details` | `unknown` | Parsed error response body when available |

**Example:**

```js
import { API, APIError } from '@fortisx/sdk';

const api = new API('YOUR_API_KEY');

try {
  const res = await api.get('ping');
  console.log(res);
} catch (err) {
  if (err instanceof APIError) {
    console.error(`API error [${err.status ?? 'network'}]: ${err.message}`);
  } else {
    console.error('Unexpected error:', err);
  }
}
```

---

## Example: `/ping` Endpoint

```js
import { API } from '@fortisx/sdk';
// Or CommonJS usage
// const { API } = require('@fortisx/sdk');

const api = new API('YOUR_API_KEY');

async function check() {
  try {
    const res = await api.get('ping');
    console.log(res); // { status: 'ok' }
  } catch (err) {
    console.error(err);
  }
}

check();
```