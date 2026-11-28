/**
 * Lazy-loading facade for the inline SVG card illustration system covering all 361 cards
 * with 100% bespoke 16:9 artwork.
 *
 * Initial boot statically imports only the compact 33-card theme fallback bundle (`themes.js`),
 * deferring ~960 KB of per-class bespoke SVG chunks until a character is selected/played or
 * the compendium is opened. In standalone single-file HTML builds, `build-standalone.mjs`
 * synchronously pre-registers all chunks so zero network requests are needed.
 */
import { CARD_THEME_ART } from './card_art/themes.js';

export { CARD_THEME_ART };

export const CARD_ART_CHUNK_IDS = Object.freeze([
  'ironclad',
  'silent',
  'watcher',
  'defect',
  'hermit',
  'colorless',
]);

export const SIGNATURE_CARD_ART = {};

const loadedChunks = new Set();
const inflightChunks = new Map();
const artListeners = new Set();

export function registerCardArtChunk(chunkId, artMap) {
  let added = false;
  if (artMap && typeof artMap === 'object') {
    for (const [key, svg] of Object.entries(artMap)) {
      if (key && svg && !SIGNATURE_CARD_ART[key]) {
        SIGNATURE_CARD_ART[key] = svg;
        added = true;
      }
    }
  }
  if (chunkId) {
    loadedChunks.add(chunkId);
  }
  if (added) {
    for (const listener of artListeners) {
      try {
        listener(chunkId);
      } catch {
        // Ignore listener errors
      }
    }
  }
  return added;
}

export function onCardArtLoaded(listener) {
  if (typeof listener !== 'function') return () => {};
  artListeners.add(listener);
  return () => artListeners.delete(listener);
}

export function isCardArtChunkLoaded(chunkId) {
  return loadedChunks.has(chunkId);
}

export function getLoadedCardArtChunks() {
  return [...loadedChunks];
}

const CHUNK_LOADERS = {
  ironclad: async () => {
    const [baseMod, expMod] = await Promise.all([
      import('./card_art/ironclad.js'),
      import('./card_art/exp_iron_silent.js'),
    ]);
    registerCardArtChunk('ironclad', {
      ...baseMod.IRONCLAD_CARD_ART,
      ...expMod.EXP_IRON_SILENT_ART,
    });
  },
  silent: async () => {
    const [baseMod, expMod] = await Promise.all([
      import('./card_art/silent.js'),
      import('./card_art/exp_iron_silent.js'),
    ]);
    registerCardArtChunk('silent', {
      ...baseMod.SILENT_CARD_ART,
      ...expMod.EXP_IRON_SILENT_ART,
    });
  },
  watcher: async () => {
    const [baseMod, expMod] = await Promise.all([
      import('./card_art/watcher.js'),
      import('./card_art/exp_watcher_colorless.js'),
    ]);
    registerCardArtChunk('watcher', {
      ...baseMod.WATCHER_CARD_ART,
      ...expMod.EXP_WATCHER_COLORLESS_ART,
    });
  },
  defect: async () => {
    const mod = await import('./card_art/defect.js');
    registerCardArtChunk('defect', mod.DEFECT_CARD_ART);
  },
  hermit: async () => {
    const mod = await import('./card_art/hermit.js');
    registerCardArtChunk('hermit', mod.HERMIT_CARD_ART);
  },
  colorless: async () => {
    const [baseMod, expCurseMod, expWatchColorlessMod] = await Promise.all([
      import('./card_art/colorless_special.js'),
      import('./card_art/exp_colorless_curses.js'),
      import('./card_art/exp_watcher_colorless.js'),
    ]);
    registerCardArtChunk('colorless', {
      ...baseMod.COLORLESS_SPECIAL_CARD_ART,
      ...expCurseMod.EXP_COLORLESS_CURSES_ART,
      ...expWatchColorlessMod.EXP_WATCHER_COLORLESS_ART,
    });
  },
};

export function ensureCardArtChunkLoaded(chunkId) {
  const key = CHUNK_LOADERS[chunkId] ? chunkId : 'colorless';
  if (loadedChunks.has(key)) return Promise.resolve();
  if (inflightChunks.has(key)) return inflightChunks.get(key);
  const promise = Promise.resolve()
    .then(() => CHUNK_LOADERS[key]())
    .catch(() => {
      // Fall back silently to CARD_THEME_ART on transient network failure
    })
    .finally(() => {
      inflightChunks.delete(key);
    });
  inflightChunks.set(key, promise);
  return promise;
}

export function ensureCharacterCardArtLoaded(charId = 'ironclad') {
  const normalized = CHUNK_LOADERS[charId] ? charId : 'ironclad';
  return Promise.all([
    ensureCardArtChunkLoaded(normalized),
    ensureCardArtChunkLoaded('colorless'),
  ]);
}

export function ensureAllCardArtLoaded() {
  return Promise.all(CARD_ART_CHUNK_IDS.map((id) => ensureCardArtChunkLoaded(id)));
}

function inferChunkForCard(cardId, stats = {}, activeCharId = null) {
  const rawChar = stats.character || activeCharId || 'ironclad';
  if (rawChar === 'hermit') return 'hermit';
  const type = stats.type || 'attack';
  if (type === 'curse' || type === 'status') return 'colorless';
  if (rawChar === 'colorless' || rawChar === 'neutral' || rawChar === 'special') return 'colorless';
  if (rawChar === 'shared') {
    return CHUNK_LOADERS[activeCharId] ? activeCharId : 'ironclad';
  }
  return CHUNK_LOADERS[rawChar] ? rawChar : 'colorless';
}

export function getCardArtKey(cardId, stats = {}, activeCharId = null) {
  if (cardId && SIGNATURE_CARD_ART[cardId]) {
    return cardId;
  }
  const type = stats.type || 'attack';
  const rawChar = stats.character || 'ironclad';
  const char = rawChar === 'shared' && activeCharId ? activeCharId : rawChar;

  if (type === 'curse') return 'curse_abyss';
  if (type === 'status') {
    return cardId === 'burn' || cardId === 'wound' ? 'status_burn' : 'status_daze';
  }
  if (char === 'colorless') {
    if (type === 'attack') return 'colorless_strike';
    if (type === 'power') return 'colorless_arcane';
    return 'colorless_tactics';
  }

  if (cardId === 'defend') {
    return char === 'silent'
      ? 'silent_cloak'
      : char === 'watcher'
        ? 'watcher_calm'
        : char === 'defect'
          ? 'defect_defend'
          : 'iron_shield';
  }
  if (cardId === 'strike') {
    return char === 'silent'
      ? 'silent_shiv'
      : char === 'watcher'
        ? 'watcher_martial'
        : char === 'defect'
          ? 'defect_strike'
          : 'iron_slash';
  }

  if (char === 'hermit') {
    if (type === 'power') return 'iron_power';
    if (type === 'skill' && (stats.block ?? 0) > 0) return 'iron_shield';
    if (type === 'skill') return 'colorless_tactics';
    return 'iron_slash';
  }

  if (char === 'defect') {
    if (type === 'power') return 'defect_power';
    if (stats.channelOrb || stats.channelOrbs || stats.evokeFront) return 'defect_orb';
    if (type === 'skill' && (stats.block ?? 0) > 0) return 'defect_defend';
    return 'defect_strike';
  }

  if (char === 'watcher') {
    if (stats.applyMarkAndTrigger || cardId === 'pressure_points') return 'watcher_mark';
    if (
      stats.enterStance === 'wrath' ||
      stats.ifInWrathVulnAllElseWrath ||
      cardId === 'rushdown' ||
      cardId === 'tantrum' ||
      cardId === 'crescendo'
    ) {
      return 'watcher_wrath';
    }
    if (stats.enterStance === 'calm' || cardId === 'like_water' || cardId === 'inner_peace' || cardId === 'tranquility') {
      return 'watcher_calm';
    }
    if (
      stats.enterStance === 'divinity' ||
      (stats.gainMantra ?? 0) > 0 ||
      (stats.applySelfStatuses?.mantra_per_turn ?? 0) > 0 ||
      cardId === 'brilliance'
    ) {
      return 'watcher_divinity';
    }
    if ((stats.scry ?? 0) > 0 || (stats.applySelfStatuses?.nirvana ?? 0) > 0 || (stats.applySelfStatuses?.foresight ?? 0) > 0) {
      return 'watcher_scry';
    }
    if (
      stats.retain ||
      (stats.applySelfStatuses?.establishment ?? 0) > 0 ||
      (stats.applySelfStatuses?.study ?? 0) > 0 ||
      cardId === 'meditate' ||
      cardId === 'sands_of_time' ||
      cardId === 'windmill_strike'
    ) {
      return 'watcher_retain';
    }
    if (type === 'power') return 'watcher_power';
    if (type === 'skill' && (stats.block ?? 0) > 0) return 'watcher_calm';
    return 'watcher_martial';
  }

  if (char === 'silent') {
    if (
      (stats.applyEnemyStatuses?.poison ?? 0) > 0 ||
      (stats.applyAllEnemiesStatuses?.poison ?? 0) > 0 ||
      (stats.applySelfStatuses?.envenom ?? 0) > 0 ||
      cardId === 'bane'
    ) {
      return 'silent_poison';
    }
    if ((stats.addShivs ?? 0) > 0 || cardId === 'shiv' || cardId === 'accuracy' || cardId === 'infinite_blades') {
      return 'silent_shiv';
    }
    if (
      (stats.discard ?? 0) > 0 ||
      (stats.discardRandomHand ?? 0) > 0 ||
      stats.discardAllHand ||
      stats.onDiscardDraw ||
      stats.onDiscardEnergy ||
      cardId === 'acrobatics'
    ) {
      return 'silent_discard';
    }
    if (type === 'power') return 'silent_power';
    if (type === 'skill') {
      return (stats.block ?? 0) > 0 ? 'silent_cloak' : 'silent_agility';
    }
    return 'silent_shiv';
  }

  // Ironclad & shared starter strike/defend
  if (cardId === 'defend') {
    return char === 'silent' ? 'silent_cloak' : char === 'watcher' ? 'watcher_calm' : 'iron_shield';
  }
  if (cardId === 'strike') {
    return char === 'silent' ? 'silent_shiv' : char === 'watcher' ? 'watcher_martial' : 'iron_slash';
  }
  if (
    (stats.selfDamage ?? 0) > 0 ||
    (stats.heal ?? 0) > 0 ||
    stats.reduceCostPerHpLossThisCombat ||
    cardId === 'bloodletting' ||
    cardId === 'hemokinesis' ||
    cardId === 'rupture' ||
    cardId === 'combust'
  ) {
    return 'iron_blood';
  }
  if (
    stats.exhaustRandomHand ||
    stats.exhaustChooseHand ||
    stats.playTopDrawAndExhaust ||
    stats.onExhaustGainEnergy ||
    (stats.applySelfStatuses?.feel_no_pain ?? 0) > 0 ||
    (stats.applySelfStatuses?.dark_embrace ?? 0) > 0 ||
    cardId === 'burning_pact' ||
    cardId === 'second_wind'
  ) {
    return 'iron_exhaust';
  }
  if ((stats.applySelfStatuses?.strength ?? 0) > 0 || cardId === 'limit_break' || cardId === 'spot_weakness' || cardId === 'flex') {
    return 'iron_flame';
  }
  if (type === 'power') return 'iron_power';
  if (type === 'skill') {
    if ((stats.block ?? 0) > 0) return 'iron_shield';
    if (stats.applyEnemyStatuses || stats.applyAllEnemiesStatuses) return 'iron_debuff';
    return 'iron_flame';
  }
  if (stats.target === 'all_enemies') return 'iron_whirlwind';
  if ((stats.cost ?? 1) >= 2 || (stats.damage ?? 0) >= 14 || stats.damageFromBlock) return 'iron_heavy';
  return 'iron_slash';
}

export function getCardArtSvg(cardId, stats = {}, activeCharId = null) {
  if (cardId && cardId !== 'strike' && cardId !== 'defend' && !SIGNATURE_CARD_ART[cardId]) {
    const chunkId = inferChunkForCard(cardId, stats, activeCharId);
    if (!loadedChunks.has(chunkId)) {
      ensureCardArtChunkLoaded(chunkId);
    }
  }
  const key = getCardArtKey(cardId, stats, activeCharId);
  return SIGNATURE_CARD_ART[key] || CARD_THEME_ART[key] || CARD_THEME_ART.iron_slash;
}

export function patchRenderedCardArtFrames(rootEl) {
  if (!rootEl || typeof rootEl.querySelectorAll !== 'function') return 0;
  let patched = 0;
  const frames = rootEl.querySelectorAll('.card-art-frame[data-card-art-id]');
  for (const frame of frames) {
    const cardId = frame.dataset.cardArtId;
    if (!cardId || cardId === 'strike' || cardId === 'defend') continue;
    const svg = SIGNATURE_CARD_ART[cardId];
    if (!svg) continue;
    const currentSvg = frame.querySelector('.card-art-svg');
    if (currentSvg && currentSvg.dataset.cardArt === cardId) continue;
    frame.innerHTML = svg;
    patched += 1;
  }
  return patched;
}
