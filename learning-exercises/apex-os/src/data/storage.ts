// Small helpers for reading/writing JSON lists in localStorage safely.

export function loadList<T>(key: string, fallback: T[], migrate?: (item: T, index: number) => T): T[] {
    try {
        const saved = localStorage.getItem(key)
        if (saved === null) return fallback
        const parsed: unknown = JSON.parse(saved)
        if (!Array.isArray(parsed)) return fallback
        const items = parsed as T[]
        return migrate ? items.map(migrate) : items
    } catch {
        return fallback
    }
}

export function saveList<T>(key: string, items: T[]): void {
    localStorage.setItem(key, JSON.stringify(items))
}
