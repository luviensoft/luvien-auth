export class InMemoryStateStore {
    entries = new Map();
    async save(entry) {
        this.entries.set(entry.state, entry);
    }
    async consume(state) {
        const entry = this.entries.get(state);
        if (!entry)
            return null;
        this.entries.delete(state);
        if (entry.expiresAt <= Date.now())
            return null;
        return entry;
    }
}
//# sourceMappingURL=in-memory-state.store.js.map