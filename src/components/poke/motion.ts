export const steps = (n: number) => (t: number) => Math.min(1, Math.ceil(t * n) / n);
