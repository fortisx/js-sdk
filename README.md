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
import { API } from "@fortisx/sdk"

const api = new API("YOUR_API_KEY")
```

### Legacy usage (CommonJS)

```js
const { API } = require("@fortisx/sdk")

const api = new API("YOUR_API_KEY")
```

**Constructor options**

| Name | Type | Default | Description |
|------|------|----------|--------------|
| `apiKey` | string | – | API key used for authorization |
| `baseUrl` | string | `https://api.fortisx.fi/v1` | Override if using a custom environment |
| `timeout` | number | `10000` | Request timeout in milliseconds |

---

## Methods

| Method | Arguments | Returns | Description |
|--------|------------|----------|-------------|
| `get(endpoint, params?)` | `string`, `object?` | `Promise<object>` | Performs a GET request |
| `post(endpoint, data?)` | `string`, `object?` | `Promise<object>` | Performs a POST request |
| `put(endpoint, data?)` | `string`, `object?` | `Promise<object>` | Performs a PUT request |
| `delete(endpoint)` | `string` | `Promise<object>` | Performs a DELETE request |

---

## Error Handling

All methods return a `Promise`. When a network or server error occurs, an exception of type `APIError` is thrown.

```js
class APIError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.details = details;
  }
}
```

| Field | Type | Description |
|--------|------|-------------|
| `message` | string | Short description of the error |
| `status` | number | HTTP status code |
| `details` | object | Full response body if available |

**Example:**

```js
try {
  const res = await api.get("ping")
  console.log(res)
} catch (err) {
  if (err instanceof APIError) {
    console.error(`API error [${err.status}]: ${err.message}`)
  } else {
    console.error("Unexpected error:", err)
  }
}
```

---

## Example: `/ping` Endpoint

```js
import { API } from "@fortisx/sdk"
// Or CommonJS usage
// const { API } = require("@fortisx/sdk")

const api = new API("demo-key")

async function check() {
  try {
    const res = await api.get("ping")
    console.log(res) // { status: "ok" }
  } catch (err) {
    console.error(err)
  }
}

check()
```
