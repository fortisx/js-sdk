export interface APIOptions {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
}

export class API {
  private apiKey?: string;
  private baseUrl: string;
  private timeout: number;

  constructor(apiKeyOrOptions?: string | APIOptions) {
    if (typeof apiKeyOrOptions === 'string') {
      this.apiKey = apiKeyOrOptions;
      this.baseUrl = 'https://api.fortisx.fi/v1';
      this.timeout = 10000;
    } else {
      const opts = apiKeyOrOptions ?? {};
      this.apiKey = opts.apiKey;
      this.baseUrl = opts.baseUrl ?? 'https://api.fortisx.fi/v1';
      this.timeout = opts.timeout ?? 10000;
    }
  }

  private async request(
    method: string,
    endpoint: string,
    body?: unknown,
    params?: Record<string, unknown>,
  ): Promise<any> {
    const base = this.baseUrl.endsWith('/') ? this.baseUrl : this.baseUrl + '/';
    const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = new URL(path, base);

    if (method === 'GET' && params) {
      for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === null) continue;
        if (Array.isArray(v)) v.forEach((iv) => url.searchParams.append(k, String(iv)));
        else url.searchParams.set(k, String(v));
      }
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.apiKey) headers['Authorization'] = `Bearer ${this.apiKey}`;

    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), this.timeout);

    try {
      const res = await fetch(url.toString(), {
        method,
        headers,
        body: body !== undefined && method !== 'GET' ? JSON.stringify(body) : undefined,
        signal: (ctrl as any).signal,
      } as any);

      const contentType = res.headers.get('content-type') || '';
      const parse = async () =>
        contentType.includes('application/json') ? await res.json() : await res.text();
      const data = await parse();

      if (!res.ok) {
        throw new APIError(res.statusText || 'Request failed', res.status, data);
      }
      return data;
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        throw new APIError('Request timed out', 408);
      }
      if (err instanceof APIError) throw err;
      throw new APIError(err?.message || 'Network error');
    } finally {
      clearTimeout(t);
    }
  }

  // === Public API as in the docs ===
  get(endpoint: string, params?: Record<string, unknown>) {
    return this.request('GET', endpoint, undefined, params);
  }
  post(endpoint: string, data?: unknown) {
    return this.request('POST', endpoint, data);
  }
  put(endpoint: string, data?: unknown) {
    return this.request('PUT', endpoint, data);
  }
  delete(endpoint: string) {
    return this.request('DELETE', endpoint);
  }
}

export class APIError extends Error {
  status?: number;
  details?: unknown;
  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}
