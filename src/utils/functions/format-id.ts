export function formatId(value: string): string {
    return value
        .trim()
        .replace(/\s+/g, '_')
        .toLowerCase();
}
