/**
 * Deterministic 32-bit PRNG (Mulberry32) operating on serializable state.rngState.
 */

export function formatSeedCode(seed) {
  const normalized = typeof seed === 'number' && Number.isFinite(seed) ? (seed >>> 0) || 0x9e3779b9 : 0x9e3779b9;
  return `S-${normalized.toString(36).toUpperCase()}`;
}

export function parseSeedInput(rawInput) {
  if (typeof rawInput === 'number' && Number.isFinite(rawInput)) {
    return (rawInput >>> 0) || 0x9e3779b9;
  }
  if (typeof rawInput !== 'string') {
    return null;
  }
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return null;
  }
  if (/^S-[0-9A-Z]+$/i.test(trimmed)) {
    const parsed36 = Number.parseInt(trimmed.slice(2), 36);
    if (Number.isFinite(parsed36)) {
      return (parsed36 >>> 0) || 0x9e3779b9;
    }
  }
  if (/^\d+$/.test(trimmed)) {
    const parsed10 = Number(trimmed);
    if (Number.isFinite(parsed10)) {
      return (parsed10 >>> 0) || 0x9e3779b9;
    }
  }
  const upper = trimmed.toUpperCase();
  let h = 2166136261 >>> 0;
  for (let i = 0; i < upper.length; i += 1) {
    h ^= upper.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h || 0x9e3779b9;
}

export function normalizeSeed(seed) {
  const parsed = parseSeedInput(seed);
  if (parsed !== null) {
    return parsed;
  }
  return (Date.now() >>> 0) || 0x9e3779b9;
}

export function nextRandom(state) {
  let t = ((state.rngState >>> 0) + 0x6d2b79f5) >>> 0;
  state.rngState = t;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function randomInt(state, min, maxInclusive) {
  const lo = Math.ceil(Math.min(min, maxInclusive));
  const hi = Math.floor(Math.max(min, maxInclusive));
  if (lo === hi) return lo;
  return lo + Math.floor(nextRandom(state) * (hi - lo + 1));
}

export function pickRandom(state, items) {
  if (!Array.isArray(items) || items.length === 0) {
    return undefined;
  }
  const idx = Math.floor(nextRandom(state) * items.length);
  return items[idx];
}

export function shuffled(state, items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(nextRandom(state) * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

export function pickDistinct(state, items, count) {
  if (!Array.isArray(items) || items.length === 0 || count <= 0) {
    return [];
  }
  const pool = shuffled(state, items);
  return pool.slice(0, Math.min(count, pool.length));
}
