export function formatId(value: string): string {
    return (
        value &&
        value
            .trim()
            .replace(/\s+/g, '_')
            .toLowerCase()
    );
}
