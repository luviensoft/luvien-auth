export declare const STATE_STORE: unique symbol;
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
//# sourceMappingURL=state-store.port.d.ts.map