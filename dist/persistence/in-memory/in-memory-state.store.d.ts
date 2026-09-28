import type { StateEntry, StateStore } from '../../core/port/state-store.port.js';
export declare class InMemoryStateStore implements StateStore {
    private readonly entries;
    save(entry: StateEntry): Promise<void>;
    consume(state: string): Promise<StateEntry | null>;
}
//# sourceMappingURL=in-memory-state.store.d.ts.map