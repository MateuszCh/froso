export function toId(value: any): number | undefined {
    const number = parseInt(value, 10);
    return number === 0 ? number : number || undefined;
}
