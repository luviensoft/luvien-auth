export const STATE_STORE = Symbol('STATE_STORE');

export interface StateEntry {
  state: string;
  nonce: string;
  codeVerifier: string;
  redirectUri: string;
  providerId: string;
  createdAt: number;
  expiresAt: number;
}

export interface StateStore {
  save(entry: StateEntry): Promise<void>;
  consume(state: string): Promise<StateEntry | null>;
}
