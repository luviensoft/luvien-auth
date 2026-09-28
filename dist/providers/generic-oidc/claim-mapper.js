export function pickByPath(obj, path) {
    return path.split('.').reduce((acc, key) => {
        if (acc &&
            typeof acc === 'object' &&
            key in acc) {
            return acc[key];
        }
        return undefined;
    }, obj);
}
export function extractRoles(claims, mapping) {
    if (!mapping?.roles)
        return [];
    const paths = Array.isArray(mapping.roles) ? mapping.roles : [mapping.roles];
    const out = new Set();
    for (const p of paths) {
        const value = pickByPath(claims, p);
        if (Array.isArray(value)) {
            for (const v of value)
                if (typeof v === 'string')
                    out.add(v);
        }
        else if (typeof value === 'string') {
            out.add(value);
        }
    }
    return [...out];
}
//# sourceMappingURL=claim-mapper.js.map