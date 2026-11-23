import { IRONCLAD_CARDS } from './ironclad.js';
import { SILENT_CARDS } from './silent.js';
import { WATCHER_CARDS } from './watcher.js';
import { COLORLESS_NEUTRAL_CARDS } from './colorless_neutral.js';

function deepFreeze(obj) {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    for (const value of Object.values(obj)) {
      deepFreeze(value);
    }
  }
  return obj;
}

export const CARD_LIBRARY = deepFreeze({
  ...IRONCLAD_CARDS,
  ...SILENT_CARDS,
  ...WATCHER_CARDS,
  ...COLORLESS_NEUTRAL_CARDS,
});

export function getCardCharacter(def) {
  if (!def) return 'ironclad';
  const resolved = !def.character && def.cardId && CARD_LIBRARY[def.cardId] ? CARD_LIBRARY[def.cardId] : def;
  if (resolved.character) return resolved.character;
  if (resolved.type === 'status' || resolved.type === 'curse') return 'neutral';
  return 'ironclad';
}

export function getRewardCardPools(characterId = 'ironclad') {
  const byChar = Object.values(CARD_LIBRARY).filter((c) => getCardCharacter(c) === characterId);
  return {
    common: byChar.filter((c) => c.rarity === 'common').map((c) => c.id),
    uncommon: byChar.filter((c) => c.rarity === 'uncommon').map((c) => c.id),
    rare: byChar.filter((c) => c.rarity === 'rare').map((c) => c.id),
  };
}

export function getColorlessCardPools() {
  const colorless = Object.values(CARD_LIBRARY).filter((c) => getCardCharacter(c) === 'colorless');
  const uncommon = colorless.filter((c) => c.rarity === 'uncommon').map((c) => c.id);
  const rare = colorless.filter((c) => c.rarity === 'rare').map((c) => c.id);
  return {
    uncommon,
    rare,
    all: [...uncommon, ...rare],
  };
}

export const COLORLESS_CARD_POOLS = deepFreeze(getColorlessCardPools());

export const REWARD_CARD_POOLS = deepFreeze(getRewardCardPools('ironclad'));

export const CURSE_CARD_IDS = deepFreeze(
  Object.values(CARD_LIBRARY)
    .filter((c) => c.type === 'curse')
    .map((c) => c.id)
);

export const STARTER_DECK_RECIPE = deepFreeze([
  'strike',
  'strike',
  'strike',
  'strike',
  'strike',
  'defend',
  'defend',
  'defend',
  'defend',
  'bash',
]);
