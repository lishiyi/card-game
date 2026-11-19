/**
 * Playable character definitions (The Ironclad & The Silent).
 * Extensible registry driving starter deck, vitals, relics, potions, card pools, and theme accents.
 */

function deepFreeze(obj) {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    for (const val of Object.values(obj)) {
      deepFreeze(val);
    }
  }
  return obj;
}

export const DEFAULT_CHARACTER_ID = 'ironclad';

export const CHARACTER_LIBRARY = deepFreeze({
  ironclad: {
    id: 'ironclad',
    name: '铁甲战士',
    englishName: 'The Ironclad',
    title: '血火重甲的尖塔征服者',
    accentTheme: 'crimson',
    artKey: 'ironclad',
    maxHp: 80,
    asc4MaxHp: 75,
    startingGold: 99,
    maxEnergy: 3,
    starterRelic: 'burning_blood',
    bossStarterUpgrade: 'black_blood',
    starterPotion: 'fire_potion',
    archetypes: ['力量多段', '腐化消耗', '壁垒叠盾'],
    summary:
      '高血量与战后稳定回血的均衡战士。擅长叠加力量打出毁灭连击、围绕消耗牌触发联动，或筑起不破壁垒以盾反杀。',
    starterDeck: [
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
    ],
  },
  silent: {
    id: 'silent',
    name: '静默猎手',
    englishName: 'The Silent',
    title: '剧毒、飞刀与灵动过牌的暗影刺客',
    accentTheme: 'emerald',
    artKey: 'silent',
    maxHp: 70,
    asc4MaxHp: 65,
    startingGold: 99,
    maxEnergy: 3,
    starterRelic: 'ring_of_the_snake',
    bossStarterUpgrade: 'ring_of_the_serpent',
    starterPotion: 'poison_potion',
    archetypes: ['剧毒叠层', '小刀连击', '弃牌过牌'],
    summary:
      '起手多抽 2 张牌的敏捷猎手。可用剧毒与催化剂指数融化强敌、凭零费小刀高频触发连击，或借主动弃牌运转高速过牌引擎。',
    starterDeck: [
      'strike',
      'strike',
      'strike',
      'strike',
      'strike',
      'defend',
      'defend',
      'defend',
      'defend',
      'defend',
      'neutralize',
      'survivor',
    ],
  },
});

export const CHARACTER_IDS = deepFreeze(Object.keys(CHARACTER_LIBRARY));

export function normalizeCharacterId(characterId) {
  if (typeof characterId === 'string') {
    const key = characterId.trim().toLowerCase();
    if (CHARACTER_LIBRARY[key]) return key;
  }
  return DEFAULT_CHARACTER_ID;
}

export function getCharacterDef(characterId) {
  return CHARACTER_LIBRARY[normalizeCharacterId(characterId)];
}
