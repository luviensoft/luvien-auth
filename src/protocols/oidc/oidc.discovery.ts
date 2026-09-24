import {
  ProviderUnavailableError,
  ConfigurationError,
} from '../../core/domain/errors.js';
import type { OidcDiscoveryDocument } from './oidc.types.js';

interface CacheEntry {
  doc: OidcDiscoveryDocument;
  expiresAt: number;
}

const DEFAULT_TTL_MS = 10 * 60 * 1000;

export class OidcDiscovery {
  private readonly issuerUrl: URL;

  private cache?: CacheEntry;
  private inflight?: Promise<OidcDiscoveryDocument>;

  constructor(
    private readonly issuer: string,
    private readonly allowInsecure: boolean = false,
    private readonly ttlMs: number = DEFAULT_TTL_MS,
  ) {
    this.issuerUrl = new URL(issuer);

    if (this.issuerUrl.protocol !== 'https:' && !allowInsecure) {
      throw new ConfigurationError(
        'OIDC issuer must use https (set allowInsecureRequests for local dev)',
        { issuer },
      );
    }
  }

  async get(): Promise<OidcDiscoveryDocument> {
    if (this.cache && this.cache.expiresAt > Date.now()) {
      return this.cache.doc;
    }

    if (this.inflight) {
      return this.inflight;
    }

    this.inflight = this.fetchDocument().finally(() => {
      this.inflight = undefined;
    });

    return this.inflight;
  }

  private async fetchDocument(): Promise<OidcDiscoveryDocument> {
    const url = new URL(
      '.well-known/openid-configuration',
      this.issuerUrl,
    ).toString();

    let res: Response;

    try {
      res = await fetch(url, {
        headers: {
          accept: 'application/json',
        },
      });
    } catch (err) {
      throw new ProviderUnavailableError('OIDC discovery fetch failed', {
        url,
        cause: (err as Error).message,
      });
    }

    if (!res.ok) {
      throw new ProviderUnavailableError('OIDC discovery returned non-2xx', {
        url,
        status: res.status,
      });
    }

    const doc = (await res.json()) as OidcDiscoveryDocument;

    if (
      !doc.issuer ||
      !doc.authorization_endpoint ||
      !doc.token_endpoint ||
      !doc.jwks_uri
    ) {
      throw new ConfigurationError('OIDC discovery document is malformed', {
        issuer: doc.issuer,
      });
    }

    if (doc.issuer !== this.issuer) {
      throw new ConfigurationError('OIDC issuer mismatch', {
        expected: this.issuer,
        actual: doc.issuer,
      });
    }

    this.cache = {
      doc,
      expiresAt: Date.now() + this.ttlMs,
    };

    return doc;
  }
}