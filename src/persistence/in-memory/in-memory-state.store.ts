import type {
  StateEntry,
  StateStore,
} from '../../core/port/state-store.port.js';

export class InMemoryStateStore implements StateStore {
  private readonly entries = new Map<string, StateEntry>();

  async save(entry: StateEntry): Promise<void> {
    this.entries.set(entry.state, entry);
  }

  async consume(state: string): Promise<StateEntry | null> {
    const entry = this.entries.get(state);
    if (!entry) return null;
    this.entries.delete(state);
    if (entry.expiresAt <= Date.now()) return null;
    return entry;
  }
}
