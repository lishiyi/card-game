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

export function parseChallengeInput(rawInput, maxAscension = 10) {
  if (typeof rawInput === 'number' && Number.isFinite(rawInput)) {
    const seed = parseSeedInput(rawInput);
    return seed === null
      ? null
      : { seed, seedCode: formatSeedCode(seed), ascension: null, isUrlLike: false };
  }
  if (typeof rawInput !== 'string') {
    return null;
  }
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return null;
  }

  let params = null;
  let isUrlLike = false;

  if (/^https?:\/\//i.test(trimmed) || /^file:\/\//i.test(trimmed)) {
    try {
      params = new URL(trimmed).searchParams;
      isUrlLike = true;
    } catch {
      params = null;
    }
  } else if (trimmed.includes('seed=') || trimmed.includes('daily=')) {
    const queryIdx = trimmed.indexOf('?');
    const queryStr = queryIdx >= 0 ? trimmed.slice(queryIdx + 1) : trimmed;
    const hashIdx = queryStr.indexOf('#');
    const cleanQuery = hashIdx >= 0 ? queryStr.slice(0, hashIdx) : queryStr;
    params = new URLSearchParams(cleanQuery);
    isUrlLike = true;
  }

  if (params && params.has('daily')) {
    const rawDaily = (params.get('daily') || '').trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDaily)) {
      const seed = parseSeedInput(`DAILY:${rawDaily}:V1`);
      return {
        seed,
        seedCode: formatSeedCode(seed),
        ascension: null,
        characterId: null,
        isDaily: true,
        dailyDateKey: rawDaily,
        isUrlLike: true,
      };
    }
    return null;
  }

  if (params && params.has('seed')) {
    const seedRaw = params.get('seed');
    const seed = parseSeedInput(seedRaw);
    if (seed === null) return null;
    const ascRaw = params.get('asc') ?? params.get('ascension');
    let ascension = null;
    if (ascRaw !== null && ascRaw !== '' && /^-?\d+$/.test(ascRaw.trim())) {
      const parsedAsc = Number.parseInt(ascRaw.trim(), 10);
      if (Number.isFinite(parsedAsc)) {
        ascension = Math.max(0, Math.min(maxAscension, parsedAsc));
      }
    }
    const charRaw = params.get('char') ?? params.get('character');
    const characterId =
      typeof charRaw === 'string' && charRaw.trim()
        ? charRaw.trim().toLowerCase()
        : null;
    return {
      seed,
      seedCode: formatSeedCode(seed),
      ascension,
      characterId,
      isDaily: false,
      dailyDateKey: null,
      isUrlLike: true,
    };
  }

  if (isUrlLike) {
    return null;
  }

  const seed = parseSeedInput(trimmed);
  if (seed === null) return null;
  return {
    seed,
    seedCode: formatSeedCode(seed),
    ascension: null,
    characterId: null,
    isDaily: false,
    dailyDateKey: null,
    isUrlLike: false,
  };
}

export function buildChallengeUrl(
  baseHref,
  seed,
  ascension = 0,
  maxAscension = 10,
  characterId = null
) {
  const seedCode = formatSeedCode(seed);
  const safeAsc = Number.isFinite(Number(ascension))
    ? Math.max(0, Math.min(maxAscension, Math.floor(Number(ascension))))
    : 0;
  const safeChar =
    typeof characterId === 'string' && characterId.trim() && characterId.trim().toLowerCase() !== 'ironclad'
      ? characterId.trim().toLowerCase()
      : null;
  try {
    const url = new URL(baseHref);
    url.search = '';
    url.hash = '';
    url.searchParams.set('seed', seedCode);
    url.searchParams.set('asc', String(safeAsc));
    if (safeChar) {
      url.searchParams.set('char', safeChar);
    }
    return url.toString();
  } catch {
    return `?seed=${encodeURIComponent(seedCode)}&asc=${safeAsc}${safeChar ? `&char=${encodeURIComponent(safeChar)}` : ''}`;
  }
}

export function buildDailyChallengeUrl(baseHref, dateKey) {
  const safeDate = typeof dateKey === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateKey.trim())
    ? dateKey.trim()
    : '';
  if (!safeDate) return baseHref || '';
  try {
    const url = new URL(baseHref);
    url.search = '';
    url.hash = '';
    url.searchParams.set('daily', safeDate);
    return url.toString();
  } catch {
    return `?daily=${encodeURIComponent(safeDate)}`;
  }
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
