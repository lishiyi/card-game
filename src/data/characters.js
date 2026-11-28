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
    origin: 'vanilla',
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
    starterPotion: 'fury_potion',
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
    origin: 'vanilla',
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
  watcher: {
    id: 'watcher',
    origin: 'vanilla',
    name: '观者',
    englishName: 'The Watcher',
    title: '掌控姿态、真言与预见的盲眼圣僧',
    accentTheme: 'amethyst',
    artKey: 'watcher',
    maxHp: 72,
    asc4MaxHp: 68,
    startingGold: 99,
    maxEnergy: 3,
    starterRelic: 'pure_water',
    bossStarterUpgrade: 'holy_water',
    starterPotion: 'stance_potion',
    archetypes: ['姿态舞', '真言神格', '预见保留'],
    summary:
      '洞察命运的盲眼苦行僧。在【平静】蓄能与【愤怒】双倍爆发之间灵动切换，汇聚 10 点【真言】步入三倍伤害的【神格】，或以【预见】与【保留】精算斩杀。',
    starterDeck: [
      'strike',
      'strike',
      'strike',
      'strike',
      'defend',
      'defend',
      'defend',
      'defend',
      'eruption',
      'vigilance',
    ],
  },
  defect: {
    id: 'defect',
    origin: 'vanilla',
    name: '故障机器人',
    englishName: 'The Defect',
    title: '驾驭充能球、集中与机械协议的觉醒构装体',
    accentTheme: 'azure',
    artKey: 'defect',
    maxHp: 72,
    asc4MaxHp: 68,
    startingGold: 99,
    maxEnergy: 3,
    starterRelic: 'cracked_core',
    bossStarterUpgrade: 'frozen_core',
    starterPotion: 'potion_of_capacity',
    archetypes: ['充能球流', '集中冰盾', '零费连击'],
    summary:
      '重获自我意识的尖塔战斗构装体。引导闪电、冰霜、黑暗与等离子四类充能球协同作战，叠加【集中】放大攻防收益，或以零费技能与能力引擎高速运转。',
    starterDeck: [
      'strike',
      'strike',
      'strike',
      'strike',
      'defend',
      'defend',
      'defend',
      'defend',
      'zap',
      'dualcast',
    ],
  },
  hermit: {
    id: 'hermit',
    origin: 'expansion',
    expansionSource: 'Downfall',
    name: '亡命之徒',
    englishName: 'The Hermit',
    title: '精准枪术与诅咒驭暗的荒野孤胆枪手',
    accentTheme: 'amber',
    artKey: 'hermit',
    maxHp: 75,
    asc4MaxHp: 71,
    startingGold: 99,
    maxEnergy: 3,
    starterRelic: 'memento',
    bossStarterUpgrade: 'clasped_locket',
    starterPotion: 'tonic',
    archetypes: ['精准瞄准', '瘀伤爆发', '诅咒驭暗'],
    summary:
      '来自经典社区拓展 Downfall 的独行枪手。围绕手牌正中触发【精准】奇效、叠高【瘀伤】放大多段火力，或拥抱【诅咒】将其化为防御与爆发资源。',
    starterDeck: [
      'strike',
      'strike',
      'strike',
      'strike',
      'defend',
      'defend',
      'defend',
      'defend',
      'snapshot',
      'covet',
    ],
  },
});

export const CHARACTER_IDS = deepFreeze(Object.keys(CHARACTER_LIBRARY));

export const VANILLA_CHARACTER_IDS = deepFreeze(
  CHARACTER_IDS.filter((id) => CHARACTER_LIBRARY[id].origin !== 'expansion')
);

export const EXPANSION_CHARACTER_IDS = deepFreeze(
  CHARACTER_IDS.filter((id) => CHARACTER_LIBRARY[id].origin === 'expansion')
);

export function isExpansionCharacter(characterId) {
  if (typeof characterId !== 'string') return false;
  const key = characterId.trim().toLowerCase();
  return CHARACTER_LIBRARY[key]?.origin === 'expansion';
}

export function getEnabledCharacterIds(settings) {
  return settings?.enableExpansionCharacters ? CHARACTER_IDS : VANILLA_CHARACTER_IDS;
}

export function normalizeCharacterId(characterId) {
  if (typeof characterId === 'string') {
    const key = characterId.trim().toLowerCase();
    if (CHARACTER_LIBRARY[key]) return key;
  }
  return DEFAULT_CHARACTER_ID;
}

export function normalizeEnabledCharacterId(characterId, settings) {
  const normalized = normalizeCharacterId(characterId);
  const enabled = getEnabledCharacterIds(settings);
  return enabled.includes(normalized) ? normalized : enabled[0] || DEFAULT_CHARACTER_ID;
}

export function getCharacterDef(characterId) {
  return CHARACTER_LIBRARY[normalizeCharacterId(characterId)];
}
