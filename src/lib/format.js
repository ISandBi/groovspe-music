export const mxn = (n) => `$${Number(n).toLocaleString('es-MX', { maximumFractionDigits: 0 })} MXN`;
export const clock = (s = 0) => {
  const t = Math.max(0, Math.floor(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};
export const compact = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)} k` : String(n));
