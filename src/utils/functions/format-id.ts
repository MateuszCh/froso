export function formatId(value: string): string {
    return value.replace(/\s+/g, '_').toLowerCase();
}
