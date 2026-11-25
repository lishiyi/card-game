import { pickRandom, shuffled } from '../../engine/rng.js';

function deepFreeze(obj) {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    for (const val of Object.values(obj)) {
      deepFreeze(val);
    }
  }
  return obj;
}

export const GREMLIN_POOL = deepFreeze([
  'mad_gremlin',
  'fat_gremlin',
  'shield_gremlin',
  'sneaky_gremlin',
  'gremlin_wizard',
]);

// Canonical Slay the Spire Gremlin Gang weighted ticket bag:
// at most 2 Mad, 2 Sneaky, 2 Fat, 1 Shield, 1 Wizard per gang draw.
const GREMLIN_GANG_TICKETS = deepFreeze([
  'mad_gremlin',
  'mad_gremlin',
  'sneaky_gremlin',
  'sneaky_gremlin',
  'fat_gremlin',
  'fat_gremlin',
  'shield_gremlin',
  'gremlin_wizard',
]);

export function drawGremlinGang(state, count = 4, options = {}) {
  const existingCounts = new Map();
  if (Array.isArray(options.existingTemplateIds)) {
    for (const id of options.existingTemplateIds) {
      existingCounts.set(id, (existingCounts.get(id) ?? 0) + 1);
    }
  }
  const available = [];
  const usedFromExisting = new Map(existingCounts);
  for (const ticket of GREMLIN_GANG_TICKETS) {
    const cur = usedFromExisting.get(ticket) ?? 0;
    if (cur > 0) {
      usedFromExisting.set(ticket, cur - 1);
    } else {
      available.push(ticket);
    }
  }
  const bag = available.length >= count ? available : [...GREMLIN_GANG_TICKETS];
  return shuffled(state, bag).slice(0, count);
}

export const ENEMY_TEMPLATES = deepFreeze({
  // === Act 1 Normal Enemies ===
  cultist: {
    id: 'cultist',
    name: '邪教徒',
    role: 'normal',
    artKey: 'cultist',
    hpRange: [48, 52],
    initialStatuses: {},
  },
  jaw_worm: {
    id: 'jaw_worm',
    name: '颚虫',
    role: 'normal',
    artKey: 'jaw_worm',
    hpRange: [40, 44],
    initialStatuses: {},
  },
  red_louse: {
    id: 'red_louse',
    name: '红虱虫',
    role: 'normal',
    artKey: 'red_louse',
    hpRange: [12, 15],
    initialStatuses: { curlUp: 4 },
  },
  green_louse: {
    id: 'green_louse',
    name: '绿虱虫',
    role: 'normal',
    artKey: 'green_louse',
    hpRange: [11, 14],
    initialStatuses: { curlUp: 4 },
  },
  acid_slime_l: {
    id: 'acid_slime_l',
    name: '大型酸液史莱姆',
    role: 'normal',
    artKey: 'acid_slime_l',
    hpRange: [65, 69],
    splitInto: ['acid_slime', 'acid_slime'],
    initialStatuses: { splitThreshold: 1 },
  },
  spike_slime_l: {
    id: 'spike_slime_l',
    name: '大型尖刺史莱姆',
    role: 'normal',
    artKey: 'spike_slime_l',
    hpRange: [64, 70],
    splitInto: ['spike_slime', 'spike_slime'],
    initialStatuses: { splitThreshold: 1 },
  },
  acid_slime: {
    id: 'acid_slime',
    name: '中型酸液史莱姆',
    role: 'normal',
    artKey: 'acid_slime',
    hpRange: [28, 32],
    initialStatuses: {},
  },
  spike_slime: {
    id: 'spike_slime',
    name: '中型尖刺史莱姆',
    role: 'normal',
    artKey: 'spike_slime',
    hpRange: [28, 32],
    initialStatuses: {},
  },
  acid_slime_s: {
    id: 'acid_slime_s',
    name: '小型酸液史莱姆',
    role: 'normal',
    artKey: 'acid_slime_s',
    hpRange: [8, 12],
    initialStatuses: {},
  },
  spike_slime_s: {
    id: 'spike_slime_s',
    name: '小型尖刺史莱姆',
    role: 'normal',
    artKey: 'spike_slime_s',
    hpRange: [10, 14],
    initialStatuses: {},
  },
  fungi_beast: {
    id: 'fungi_beast',
    name: '真菌兽',
    role: 'normal',
    artKey: 'fungi_beast',
    hpRange: [22, 26],
    initialStatuses: { sporeCloud: 2 },
  },
  slaver_blue: {
    id: 'slaver_blue',
    name: '蓝衣奴隶贩',
    role: 'normal',
    artKey: 'slaver_blue',
    hpRange: [44, 48],
    initialStatuses: {},
  },
  slaver_red: {
    id: 'slaver_red',
    name: '红衣奴隶贩',
    role: 'normal',
    artKey: 'slaver_red',
    hpRange: [46, 50],
    initialStatuses: {},
  },
  looter: {
    id: 'looter',
    name: '尖塔劫匪',
    role: 'normal',
    artKey: 'looter',
    hpRange: [42, 46],
    initialStatuses: {},
  },
  mad_gremlin: {
    id: 'mad_gremlin',
    name: '狂怒地精',
    role: 'normal',
    artKey: 'mad_gremlin',
    hpRange: [16, 19],
    initialStatuses: { angry: 1 },
  },
  fat_gremlin: {
    id: 'fat_gremlin',
    name: '胖地精',
    role: 'normal',
    artKey: 'fat_gremlin',
    hpRange: [13, 17],
    initialStatuses: {},
  },
  shield_gremlin: {
    id: 'shield_gremlin',
    name: '盾地精',
    role: 'normal',
    artKey: 'shield_gremlin',
    hpRange: [12, 15],
    initialStatuses: {},
  },
  sneaky_gremlin: {
    id: 'sneaky_gremlin',
    name: '狡猾地精',
    role: 'normal',
    artKey: 'sneaky_gremlin',
    hpRange: [10, 14],
    initialStatuses: {},
  },
  gremlin_wizard: {
    id: 'gremlin_wizard',
    name: '地精法师',
    role: 'normal',
    artKey: 'gremlin_wizard',
    hpRange: [21, 25],
    initialStatuses: {},
  },

  // === Act 1 Elites ===
  gremlin_nob: {
    id: 'gremlin_nob',
    name: '地精大块头',
    role: 'elite',
    artKey: 'gremlin_nob',
    hpRange: [68, 72],
    initialStatuses: {},
  },
  sentry: {
    id: 'sentry',
    name: '远古哨卫',
    role: 'elite',
    artKey: 'sentry',
    hpRange: [27, 31],
    initialStatuses: { artifact: 1 },
  },
  lagavulin: {
    id: 'lagavulin',
    name: '乐加维林',
    role: 'elite',
    artKey: 'lagavulin',
    hpRange: [84, 88],
    initialStatuses: { metallicize: 5, asleep: 3 },
  },

  // === Act 1 Bosses (3 Random Bosses) ===
  the_guardian: {
    id: 'the_guardian',
    name: '尖塔守护者',
    role: 'boss',
    artKey: 'the_guardian',
    hpRange: [135, 135],
    initialStatuses: { modeShift: 25 },
  },
  hexaghost: {
    id: 'hexaghost',
    name: '六火亡魂',
    role: 'boss',
    artKey: 'hexaghost',
    hpRange: [144, 144],
    initialStatuses: {},
  },
  slime_boss: {
    id: 'slime_boss',
    name: '史莱姆首领',
    role: 'boss',
    artKey: 'slime_boss',
    hpRange: [110, 110],
    splitInto: ['acid_slime_l', 'spike_slime_l'],
    initialStatuses: { splitThreshold: 1 },
  },

  // === Act 2 Enemies, Elites & Bosses ===
  centurion: {
    id: 'centurion',
    name: '城邦百夫长',
    role: 'normal',
    artKey: 'centurion',
    hpRange: [58, 64],
    initialStatuses: {},
  },
  mystic: {
    id: 'mystic',
    name: '秘术祭司',
    role: 'normal',
    artKey: 'mystic',
    hpRange: [40, 46],
    initialStatuses: {},
  },
  byrd: {
    id: 'byrd',
    name: '尖塔飞鸟',
    role: 'normal',
    artKey: 'byrd',
    hpRange: [26, 31],
    initialStatuses: { flight: 3 },
  },
  spheric_guardian: {
    id: 'spheric_guardian',
    name: '圆球守护者',
    role: 'normal',
    artKey: 'spheric_guardian',
    hpRange: [22, 26],
    initialBlock: 32,
    initialStatuses: { barricade: 1, artifact: 3 },
  },
  snake_plant: {
    id: 'snake_plant',
    name: '食人蛇花',
    role: 'normal',
    artKey: 'snake_plant',
    hpRange: [66, 72],
    malleableBase: 3,
    initialStatuses: { malleable: 3 },
  },
  chosen: {
    id: 'chosen',
    name: '天选者',
    role: 'normal',
    artKey: 'chosen',
    hpRange: [78, 86],
    initialStatuses: {},
  },
  shelled_parasite: {
    id: 'shelled_parasite',
    name: '带壳寄生虫',
    role: 'normal',
    artKey: 'shelled_parasite',
    hpRange: [52, 58],
    initialBlock: 10,
    initialStatuses: { platedArmor: 10 },
  },
  snecko: {
    id: 'snecko',
    name: '异蛇',
    role: 'normal',
    artKey: 'snecko',
    hpRange: [92, 102],
    initialStatuses: {},
  },
  bandit_pointy: {
    id: 'bandit_pointy',
    name: '强盗·尖刺',
    role: 'normal',
    artKey: 'bandit_pointy',
    hpRange: [28, 32],
    initialStatuses: {},
  },
  bandit_romeo: {
    id: 'bandit_romeo',
    name: '强盗·罗密欧',
    role: 'normal',
    artKey: 'bandit_romeo',
    hpRange: [34, 38],
    initialStatuses: {},
  },
  bandit_bear: {
    id: 'bandit_bear',
    name: '强盗·熊',
    role: 'normal',
    artKey: 'bandit_bear',
    hpRange: [36, 42],
    initialStatuses: {},
  },
  book_of_stabbing: {
    id: 'book_of_stabbing',
    name: '刺击魔典',
    role: 'elite',
    artKey: 'book_of_stabbing',
    hpRange: [112, 118],
    initialStatuses: { painfulStabs: 1 },
  },
  slaver_taskmaster: {
    id: 'slaver_taskmaster',
    name: '督军领主',
    role: 'elite',
    artKey: 'slaver_taskmaster',
    hpRange: [62, 66],
    initialStatuses: {},
  },
  gremlin_leader: {
    id: 'gremlin_leader',
    name: '地精首领',
    role: 'elite',
    artKey: 'gremlin_leader',
    hpRange: [128, 136],
    initialStatuses: {},
  },
  bronze_automaton: {
    id: 'bronze_automaton',
    name: '青铜自动机',
    role: 'boss',
    artKey: 'bronze_automaton',
    hpRange: [195, 195],
    initialStatuses: { metallicize: 4, artifact: 3 },
  },
  bronze_orb: {
    id: 'bronze_orb',
    name: '青铜球',
    role: 'normal',
    artKey: 'bronze_orb',
    hpRange: [32, 38],
    isMinion: true,
    initialStatuses: {},
  },
  the_collector: {
    id: 'the_collector',
    name: '暗影收藏家',
    role: 'boss',
    artKey: 'the_collector',
    hpRange: [185, 185],
    initialStatuses: {},
  },
  torch_head: {
    id: 'torch_head',
    name: '火炬头',
    role: 'normal',
    artKey: 'torch_head',
    hpRange: [30, 35],
    isMinion: true,
    initialStatuses: {},
  },
  the_champ: {
    id: 'the_champ',
    name: '钢铁勇士',
    role: 'boss',
    artKey: 'the_champ',
    hpRange: [240, 240],
    initialStatuses: {},
  },

  // === Act 3 Normal Enemies, Elites & Bosses ===
  orb_walker: {
    id: 'orb_walker',
    name: '圆球行者',
    role: 'normal',
    artKey: 'orb_walker',
    hpRange: [78, 84],
    initialStatuses: { ritual: 2 },
  },
  spiker: {
    id: 'spiker',
    name: '荆棘构装体',
    role: 'normal',
    artKey: 'spiker',
    hpRange: [44, 50],
    initialStatuses: { thorns: 3 },
  },
  exploder: {
    id: 'exploder',
    name: '自爆构装体',
    role: 'normal',
    artKey: 'exploder',
    hpRange: [34, 38],
    initialStatuses: { explosive: 3 },
  },
  repulsor: {
    id: 'repulsor',
    name: '斥力构装体',
    role: 'normal',
    artKey: 'repulsor',
    hpRange: [32, 36],
    initialStatuses: {},
  },
  maw: {
    id: 'maw',
    name: '深渊巨口',
    role: 'normal',
    artKey: 'maw',
    hpRange: [128, 136],
    initialStatuses: {},
  },
  darkling: {
    id: 'darkling',
    name: '暗影虫',
    role: 'normal',
    artKey: 'darkling',
    hpRange: [34, 40],
    initialStatuses: { lifeLink: 1 },
  },
  spire_growth: {
    id: 'spire_growth',
    name: '尖塔蔓生体',
    role: 'normal',
    artKey: 'spire_growth',
    hpRange: [120, 132],
    initialStatuses: {},
  },
  transient: {
    id: 'transient',
    name: '瞬息',
    role: 'normal',
    artKey: 'transient',
    hpRange: [420, 420],
    initialStatuses: { fading: 5, shifting: 1 },
  },
  writhing_mass: {
    id: 'writhing_mass',
    name: '蠕动之块',
    role: 'normal',
    artKey: 'writhing_mass',
    hpRange: [112, 122],
    malleableBase: 3,
    initialStatuses: { malleable: 3, reactive: 1 },
  },
  giant_head: {
    id: 'giant_head',
    name: '巨型石首',
    role: 'elite',
    artKey: 'giant_head',
    hpRange: [250, 250],
    initialStatuses: { slow: 1 },
  },
  nemesis: {
    id: 'nemesis',
    name: '复仇女神',
    role: 'elite',
    artKey: 'nemesis',
    hpRange: [155, 155],
    initialStatuses: {},
  },
  reptomancer: {
    id: 'reptomancer',
    name: '爬虫术士',
    role: 'elite',
    artKey: 'reptomancer',
    hpRange: [148, 148],
    initialStatuses: {},
  },
  dagger: {
    id: 'dagger',
    name: '魔刃飞刀',
    role: 'normal',
    artKey: 'dagger',
    isMinion: true,
    hpRange: [22, 26],
    initialStatuses: {},
  },
  time_eater: {
    id: 'time_eater',
    name: '时间吞噬者',
    role: 'boss',
    artKey: 'time_eater',
    hpRange: [245, 245],
    initialStatuses: { timeWarp: 12 },
  },
  awakened_one: {
    id: 'awakened_one',
    name: '觉醒者',
    role: 'boss',
    artKey: 'awakened_one',
    hpRange: [172, 172],
    initialStatuses: { curiosity: 1, regenerating: 6 },
  },
  donu: {
    id: 'donu',
    name: '多努',
    role: 'boss',
    artKey: 'donu',
    hpRange: [152, 152],
    initialStatuses: { artifact: 2 },
  },
  deca: {
    id: 'deca',
    name: '德卡',
    role: 'boss',
    artKey: 'deca',
    hpRange: [152, 152],
    initialStatuses: { artifact: 2 },
  },
  spire_shield: {
    id: 'spire_shield',
    name: '尖塔之盾',
    role: 'elite',
    artKey: 'spire_shield',
    hpRange: [110, 110],
    initialStatuses: { artifact: 1 },
  },
  spire_spear: {
    id: 'spire_spear',
    name: '尖塔之矛',
    role: 'elite',
    artKey: 'spire_spear',
    hpRange: [145, 145],
    initialStatuses: { artifact: 1 },
  },
  corrupt_heart: {
    id: 'corrupt_heart',
    name: '腐化之心',
    role: 'boss',
    artKey: 'corrupt_heart',
    hpRange: [500, 500],
    initialStatuses: { invincible: 180, beatOfDeath: 1 },
  },
});

export const ENCOUNTERS = deepFreeze({
  floor1: [
    { id: 'cultist_solo', name: '狂热仪式', enemies: [{ templateId: 'cultist' }] },
    { id: 'jaw_worm_solo', name: '地底颚虫', enemies: [{ templateId: 'jaw_worm' }] },
    {
      id: 'early_lice',
      name: '虱虫前哨',
      enemies: [{ templateId: 'red_louse' }, { templateId: 'green_louse' }],
    },
  ],
  normal: [
    {
      id: 'twin_lice',
      name: '双生虱虫',
      enemies: [{ templateId: 'red_louse' }, { templateId: 'green_louse' }],
    },
    {
      id: 'slime_duo',
      name: '泥沼双怪',
      enemies: [
        { templateId: 'acid_slime' },
        { templateId: 'spike_slime_s' },
      ],
    },
    {
      id: 'louse_and_slime',
      name: '虱虫与史莱姆',
      enemies: [
        { templateId: 'red_louse' },
        { templateId: 'acid_slime_s' },
      ],
    },
    {
      id: 'looter_solo',
      name: '暗巷劫掠',
      enemies: [{ templateId: 'looter' }],
    },
    {
      id: 'slaver_solo',
      name: '铁钩巡猎',
      enemies: [{ templateId: 'slaver_blue' }],
    },
    {
      id: 'red_slaver_solo',
      name: '红衣捕奴手',
      enemies: [{ templateId: 'slaver_red' }],
    },
  ],
  hardNormal: [
    {
      id: 'fungi_pair',
      name: '毒孢菌丛',
      enemies: [{ templateId: 'fungi_beast' }, { templateId: 'fungi_beast' }],
    },
    {
      id: 'gremlin_pack',
      name: '地精袭扰群',
      randomGremlinCount: 4,
      enemies: [
        { templateId: 'mad_gremlin' },
        { templateId: 'fat_gremlin' },
        { templateId: 'shield_gremlin' },
        { templateId: 'sneaky_gremlin' },
      ],
    },
    {
      id: 'louse_and_cultist',
      name: '祭司与护卫虫',
      enemies: [{ templateId: 'red_louse' }, { templateId: 'cultist', customHp: 44 }],
    },
    {
      id: 'fungi_and_slaver',
      name: '奴隶贩与虱虫',
      enemies: [{ templateId: 'slaver_blue', customHp: 40 }, { templateId: 'red_louse' }],
    },
    {
      id: 'red_slaver_and_slime',
      name: '红衣捕奴手与史莱姆',
      enemies: [{ templateId: 'slaver_red', customHp: 42 }, { templateId: 'acid_slime_s' }],
    },
    {
      id: 'looter_and_gremlin',
      name: '劫匪与地精搭档',
      enemies: [
        { templateId: 'looter', customHp: 39 },
        { templateId: 'mad_gremlin', templatePool: GREMLIN_POOL },
      ],
    },
    {
      id: 'jaw_worm_and_slime',
      name: '颚虫与虱虫',
      enemies: [{ templateId: 'jaw_worm' }, { templateId: 'green_louse' }],
    },
    {
      id: 'large_acid_slime_solo',
      name: '大型酸液史莱姆',
      enemies: [{ templateId: 'acid_slime_l' }],
    },
    {
      id: 'large_spike_slime_solo',
      name: '大型尖刺史莱姆',
      enemies: [{ templateId: 'spike_slime_l' }],
    },
    {
      id: 'slime_swarm_small',
      name: '史莱姆小队',
      enemies: [
        { templateId: 'spike_slime_s' },
        { templateId: 'acid_slime_s' },
        { templateId: 'spike_slime_s' },
        { templateId: 'acid_slime_s' },
      ],
    },
    {
      id: 'tri_lice_swarm',
      name: '三色甲虫群',
      enemies: [
        { templateId: 'red_louse' },
        { templateId: 'green_louse' },
        { templateId: 'red_louse' },
      ],
    },
  ],
  elite: [
    {
      id: 'gremlin_nob_elite',
      name: '精英：地精大块头',
      enemies: [{ templateId: 'gremlin_nob' }],
    },
    {
      id: 'twin_sentries_elite',
      name: '精英：远古哨卫阵列',
      enemies: [
        { templateId: 'sentry', variantIndex: 0 },
        { templateId: 'sentry', variantIndex: 1 },
        { templateId: 'sentry', variantIndex: 2 },
      ],
    },
    {
      id: 'lagavulin_elite',
      name: '精英：乐加维林',
      enemies: [{ templateId: 'lagavulin' }],
    },
  ],
  boss: [
    {
      id: 'guardian_boss',
      name: '首领：尖塔守护者',
      enemies: [{ templateId: 'the_guardian' }],
    },
    {
      id: 'hexaghost_boss',
      name: '首领：六火亡魂',
      enemies: [{ templateId: 'hexaghost' }],
    },
    {
      id: 'slime_boss_enc',
      name: '首领：史莱姆首领',
      enemies: [{ templateId: 'slime_boss' }],
    },
  ],

  // === Act 2 Pools ===
  act2Early: [
    {
      id: 'centurion_solo',
      name: '城邦巡逻卫',
      enemies: [{ templateId: 'centurion' }],
    },
    {
      id: 'byrd_flock',
      name: '尖塔飞鸟双翼',
      enemies: [{ templateId: 'byrd' }, { templateId: 'byrd' }],
    },
    {
      id: 'spheric_guardian_solo',
      name: '圆球守护者',
      enemies: [{ templateId: 'spheric_guardian' }],
    },
    {
      id: 'mystic_and_looter',
      name: '暗巷秘教',
      enemies: [
        { templateId: 'mystic', customHp: 35 },
        { templateId: 'looter', customHp: 35 },
      ],
    },
    {
      id: 'chosen_solo',
      name: '天选者巡猎',
      enemies: [{ templateId: 'chosen' }],
    },
    {
      id: 'shelled_parasite_solo',
      name: '带壳寄生虫',
      enemies: [{ templateId: 'shelled_parasite' }],
    },
  ],
  act2Hard: [
    {
      id: 'centurion_and_mystic',
      name: '百夫长与秘术师',
      enemies: [
        { templateId: 'centurion', customHp: 56 },
        { templateId: 'mystic', customHp: 38 },
      ],
    },
    {
      id: 'snake_plant_solo',
      name: '食人蛇花',
      enemies: [{ templateId: 'snake_plant' }],
    },
    {
      id: 'byrd_swarm',
      name: '尖塔飞鸟群',
      enemies: [{ templateId: 'byrd' }, { templateId: 'byrd' }, { templateId: 'byrd' }],
    },
    {
      id: 'spheric_and_cultist',
      name: '球盾与狂热者',
      enemies: [
        { templateId: 'spheric_guardian', customHp: 22 },
        { templateId: 'cultist', customHp: 42 },
      ],
    },
    {
      id: 'chosen_and_cultist',
      name: '天选者与邪教徒',
      enemies: [
        { templateId: 'chosen', customHp: 74 },
        { templateId: 'cultist', customHp: 46 },
      ],
    },
    {
      id: 'chosen_and_byrd',
      name: '天选者与尖塔飞鸟',
      enemies: [
        { templateId: 'chosen', customHp: 74 },
        { templateId: 'byrd' },
      ],
    },
    {
      id: 'parasite_and_fungi',
      name: '寄生虫与真菌兽',
      enemies: [
        { templateId: 'shelled_parasite', customHp: 54 },
        { templateId: 'fungi_beast' },
      ],
    },
    {
      id: 'snecko_solo',
      name: '异蛇巢穴',
      enemies: [{ templateId: 'snecko' }],
    },
  ],
  act2Elite: [
    {
      id: 'book_of_stabbing_elite',
      name: '精英：刺击魔典',
      enemies: [{ templateId: 'book_of_stabbing' }],
    },
    {
      id: 'slaver_taskmaster_elite',
      name: '精英：捕奴三人组',
      enemies: [
        { templateId: 'slaver_blue', customHp: 40 },
        { templateId: 'slaver_taskmaster', customHp: 56 },
        { templateId: 'slaver_red', customHp: 42 },
      ],
    },
    {
      id: 'gremlin_leader_elite',
      name: '精英：地精首领',
      randomGremlinMinions: 2,
      enemies: [
        { templateId: 'mad_gremlin', isMinion: true },
        { templateId: 'gremlin_leader' },
        { templateId: 'sneaky_gremlin', isMinion: true },
      ],
    },
  ],
  act2Boss: [
    {
      id: 'automaton_boss',
      name: '首领：青铜自动机',
      enemies: [{ templateId: 'bronze_automaton' }],
    },
    {
      id: 'collector_boss',
      name: '首领：暗影收藏家',
      enemies: [{ templateId: 'the_collector' }],
    },
    {
      id: 'champ_boss',
      name: '首领：钢铁勇士',
      enemies: [{ templateId: 'the_champ' }],
    },
  ],

  // === Act 3 Pools ===
  act3Early: [
    {
      id: 'orb_walker_solo',
      name: '圆球行者巡逻',
      enemies: [{ templateId: 'orb_walker' }],
    },
    {
      id: 'shapes_duo',
      name: '古代构装体群',
      enemies: [{ templateId: 'spiker' }, { templateId: 'repulsor' }],
    },
    {
      id: 'exploder_pair',
      name: '自爆斥力阵列',
      enemies: [{ templateId: 'exploder' }, { templateId: 'repulsor' }],
    },
    {
      id: 'darkling_trio',
      name: '暗影虫群',
      enemies: [
        { templateId: 'darkling', variantIndex: 0 },
        { templateId: 'darkling', variantIndex: 1 },
        { templateId: 'darkling', variantIndex: 2 },
      ],
    },
    {
      id: 'orb_and_repulsor',
      name: '行者与斥力阵列',
      enemies: [
        { templateId: 'orb_walker', customHp: 68 },
        { templateId: 'repulsor' },
      ],
    },
  ],
  act3Hard: [
    {
      id: 'shapes_trio',
      name: '三重古代构装体',
      enemies: [
        { templateId: 'spiker' },
        { templateId: 'exploder' },
        { templateId: 'repulsor' },
      ],
    },
    {
      id: 'maw_solo',
      name: '深渊巨口阻击',
      enemies: [{ templateId: 'maw' }],
    },
    {
      id: 'double_orb_walkers',
      name: '双生圆球行者',
      enemies: [
        { templateId: 'orb_walker', customHp: 70 },
        { templateId: 'orb_walker', customHp: 70 },
      ],
    },
    {
      id: 'jaw_worm_horde',
      name: '深层颚虫群',
      enemies: [
        { templateId: 'jaw_worm', hordeMode: true },
        { templateId: 'jaw_worm', hordeMode: true },
        { templateId: 'jaw_worm', hordeMode: true },
      ],
    },
    {
      id: 'spire_growth_solo',
      name: '尖塔蔓生体',
      enemies: [{ templateId: 'spire_growth' }],
    },
    {
      id: 'transient_solo',
      name: '瞬息幻影',
      enemies: [{ templateId: 'transient' }],
    },
    {
      id: 'writhing_mass_solo',
      name: '蠕动之块',
      enemies: [{ templateId: 'writhing_mass' }],
    },
  ],
  act3Elite: [
    {
      id: 'giant_head_elite',
      name: '精英：巨型石首',
      enemies: [{ templateId: 'giant_head' }],
    },
    {
      id: 'nemesis_elite',
      name: '精英：复仇女神',
      enemies: [{ templateId: 'nemesis' }],
    },
    {
      id: 'reptomancer_elite',
      name: '精英：爬虫术士',
      enemies: [{ templateId: 'reptomancer' }],
    },
  ],
  act3Boss: [
    {
      id: 'time_eater_boss',
      name: '第三幕首领：时间吞噬者',
      enemies: [{ templateId: 'time_eater' }],
    },
    {
      id: 'awakened_one_boss',
      name: '第三幕首领：觉醒者',
      enemies: [{ templateId: 'awakened_one' }],
    },
    {
      id: 'donu_deca_boss',
      name: '第三幕首领：多努与德卡',
      enemies: [{ templateId: 'donu' }, { templateId: 'deca' }],
    },
  ],
  act4Elite: [
    {
      id: 'spire_shield_and_spear',
      name: '第四幕精英：尖塔之盾与尖塔之矛',
      enemies: [{ templateId: 'spire_shield' }, { templateId: 'spire_spear' }],
    },
  ],
  act4Boss: [
    {
      id: 'corrupt_heart_boss',
      name: '终极首领：腐化之心',
      enemies: [{ templateId: 'corrupt_heart' }],
    },
  ],
});

export function resolveEncounterSpecs(state, encounter) {
  if (!encounter) return [];
  if (typeof encounter.randomGremlinCount === 'number' && encounter.randomGremlinCount > 0) {
    return drawGremlinGang(state, encounter.randomGremlinCount).map((templateId) => ({ templateId }));
  }
  if (typeof encounter.randomGremlinMinions === 'number' && encounter.randomGremlinMinions > 0) {
    const drawn = drawGremlinGang(state, encounter.randomGremlinMinions);
    let drawIdx = 0;
    return (encounter.enemies || []).map((spec) => {
      if (spec.isMinion && drawIdx < drawn.length) {
        const pickedId = drawn[drawIdx];
        drawIdx += 1;
        return { ...spec, templateId: pickedId, isMinion: true };
      }
      return spec;
    });
  }
  return (encounter.enemies || []).map((spec) => {
    if (Array.isArray(spec.templatePool) && spec.templatePool.length > 0) {
      return { ...spec, templateId: pickRandom(state, spec.templatePool) };
    }
    return spec;
  });
}
