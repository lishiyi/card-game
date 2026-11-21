import { hasDailyModifier } from '../engine/daily.js';
import { getEnemyIntentPreview } from '../engine/math.js';
import { nextRandom, randomInt } from '../engine/rng.js';

function deepFreeze(obj) {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    for (const val of Object.values(obj)) {
      deepFreeze(val);
    }
  }
  return obj;
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
  acid_slime: {
    id: 'acid_slime',
    name: '酸液史莱姆',
    role: 'normal',
    artKey: 'acid_slime',
    hpRange: [28, 32],
    initialStatuses: {},
  },
  spike_slime: {
    id: 'spike_slime',
    name: '尖刺史莱姆',
    role: 'normal',
    artKey: 'spike_slime',
    hpRange: [28, 32],
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

  // === Act 1 Elites ===
  gremlin_nob: {
    id: 'gremlin_nob',
    name: '地精大块头',
    role: 'elite',
    artKey: 'gremlin_nob',
    hpRange: [72, 76],
    initialStatuses: {},
  },
  sentry: {
    id: 'sentry',
    name: '远古哨卫',
    role: 'elite',
    artKey: 'sentry',
    hpRange: [33, 37],
    initialStatuses: {},
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
    hpRange: [140, 140],
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
    initialStatuses: { barricade: 1 },
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
    initialStatuses: { metallicize: 4 },
  },
  the_collector: {
    id: 'the_collector',
    name: '暗影收藏家',
    role: 'boss',
    artKey: 'the_collector',
    hpRange: [185, 185],
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
    initialStatuses: {},
  },
  deca: {
    id: 'deca',
    name: '德卡',
    role: 'boss',
    artKey: 'deca',
    hpRange: [152, 152],
    initialStatuses: {},
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
        { templateId: 'spike_slime', customHp: 14, customName: '小型尖刺史莱姆' },
      ],
    },
    {
      id: 'louse_and_slime',
      name: '虱虫与史莱姆',
      enemies: [
        { templateId: 'red_louse' },
        { templateId: 'acid_slime', customHp: 16, customName: '小型酸液史莱姆' },
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
  ],
  hardNormal: [
    {
      id: 'fungi_pair',
      name: '毒孢菌丛',
      enemies: [{ templateId: 'fungi_beast' }, { templateId: 'fungi_beast' }],
    },
    {
      id: 'gremlin_pack',
      name: '地精袭扰小队',
      enemies: [
        { templateId: 'mad_gremlin' },
        { templateId: 'red_louse' },
        { templateId: 'green_louse' },
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
      id: 'looter_and_gremlin',
      name: '劫匪与狂怒地精',
      enemies: [{ templateId: 'looter', customHp: 39 }, { templateId: 'mad_gremlin', customHp: 17 }],
    },
    {
      id: 'jaw_worm_and_slime',
      name: '颚虫与虱虫',
      enemies: [{ templateId: 'jaw_worm' }, { templateId: 'green_louse' }],
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
      name: '精英：双子远古哨卫',
      enemies: [
        { templateId: 'sentry', variantIndex: 0 },
        { templateId: 'sentry', variantIndex: 1 },
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
      name: '精英：督军与捕奴手',
      enemies: [{ templateId: 'slaver_blue' }, { templateId: 'slaver_taskmaster' }],
    },
    {
      id: 'gremlin_leader_elite',
      name: '精英：地精首领',
      enemies: [
        { templateId: 'mad_gremlin', customHp: 17, isMinion: true },
        { templateId: 'gremlin_leader' },
        { templateId: 'mad_gremlin', customHp: 17, isMinion: true },
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
});

const STATUS_ZH_LABELS = Object.freeze({
  strength: '力量',
  dexterity: '敏捷',
  ritual: '仪式',
  enrage: '激怒',
  thorns: '荆棘',
  metallicize: '金属化',
  platedArmor: '多层护甲',
  weak: '虚弱',
  vulnerable: '易伤',
  frail: '脆弱',
  hex: '妖术',
  confused: '混乱',
  constricted: '缠绕',
});

const STATUS_CARD_ZH_LABELS = Object.freeze({
  dazed: '晕眩',
  slimed: '黏液',
  burn: '灼伤',
  wound: '伤口',
  parasite: '寄生',
});

function rebuildA9IntentSummary(intent) {
  const parts = [];
  if (typeof intent.damage === 'number' && intent.damage > 0) {
    const hits = intent.hits ?? 1;
    parts.push(hits > 1 ? `造成 ${intent.damage}×${hits} 点伤害` : `造成 ${intent.damage} 点伤害`);
  }
  if (typeof intent.allEnemiesBlock === 'number' && intent.allEnemiesBlock > 0) {
    parts.push(`使全体友方单位获得 ${intent.allEnemiesBlock} 点格挡`);
  } else if (typeof intent.block === 'number' && intent.block > 0) {
    parts.push(`获得 ${intent.block} 点格挡`);
  }
  if (intent.applyAllEnemiesStatuses) {
    const buffStr = Object.entries(intent.applyAllEnemiesStatuses)
      .map(([k, v]) => `${v} 点【${STATUS_ZH_LABELS[k] || k}】`)
      .join('、');
    if (buffStr) parts.push(`使全体友方单位获得 ${buffStr}`);
  }
  if (intent.applySelfStatuses) {
    const selfStr = Object.entries(intent.applySelfStatuses)
      .map(([k, v]) => `${v} ${k === 'strength' ? '点' : '层'}${STATUS_ZH_LABELS[k] || k}`)
      .join('与 ');
    if (selfStr) parts.push(`获得 ${selfStr}`);
  }
  if (intent.applyPlayerStatuses) {
    const pos = [];
    const neg = [];
    for (const [k, v] of Object.entries(intent.applyPlayerStatuses)) {
      const label = STATUS_ZH_LABELS[k] || k;
      if (v < 0) neg.push(`${Math.abs(v)} 点${label}`);
      else pos.push(`${v} 层${label}`);
    }
    if (pos.length > 0) parts.push(`给予玩家 ${pos.join('、')}`);
    if (neg.length > 0) parts.push(`使玩家失去 ${neg.join('与 ')}`);
  }
  if (Array.isArray(intent.addDiscardCards) && intent.addDiscardCards.length > 0) {
    const cardStr = intent.addDiscardCards
      .map((c) => `${c.count} 张【${STATUS_CARD_ZH_LABELS[c.cardId] || c.cardId}】`)
      .join('与 ');
    parts.push(`将 ${cardStr}洗入你的弃牌堆`);
  }
  if (Array.isArray(intent.addDrawCards) && intent.addDrawCards.length > 0) {
    const cardStr = intent.addDrawCards
      .map((c) => `${c.count} 张【${STATUS_CARD_ZH_LABELS[c.cardId] || c.cardId}】`)
      .join('与 ');
    parts.push(`将 ${cardStr}洗入你的抽牌堆`);
  }
  return parts.length > 0 ? `意图：${parts.join('，')}` : intent.summary;
}

const SWARM_NORMAL_IDS = new Set([
  'red_louse',
  'green_louse',
  'acid_slime',
  'spike_slime',
  'fungi_beast',
  'mad_gremlin',
  'byrd',
  'spiker',
  'exploder',
  'repulsor',
  'darkling',
]);

function applyAscensionIntentScaling(state, enemy, intent) {
  if (!intent) return intent;
  const asc = state?.ascension ?? 0;
  const isEliteOrBoss = enemy.role === 'elite' || enemy.role === 'boss';

  let bonus = 0;
  if (typeof intent.damage === 'number' && !intent.scalesWithPlayerHp) {
    const hits = Math.max(1, intent.hits ?? 1);
    if (enemy.role === 'normal') {
      const isSwarmer = SWARM_NORMAL_IDS.has(enemy.templateId);
      const rawBonus = asc >= 9 ? (isSwarmer ? 1 : 2) : asc >= 2 ? 1 : 0;
      bonus = hits >= 2 ? Math.min(1, rawBonus) : rawBonus;
    } else if (isEliteOrBoss) {
      const rawBonus = asc >= 9 ? 3 : asc >= 3 ? 2 : 0;
      bonus = hits >= 2 ? Math.min(1, rawBonus) : rawBonus;
    }
  }

  let next = bonus > 0 ? { ...intent, damage: intent.damage + bonus } : { ...intent };
  let mutatedNonDamage = false;

  if (asc >= 9) {
    if (typeof next.allEnemiesBlock === 'number' && next.allEnemiesBlock > 0) {
      next.allEnemiesBlock += 3;
      if (typeof next.block === 'number') {
        next.block += 3;
      }
      mutatedNonDamage = true;
    } else if (typeof next.block === 'number' && next.block > 0) {
      next.block += isEliteOrBoss ? 3 : 1;
      mutatedNonDamage = true;
    }

    if (next.applyAllEnemiesStatuses) {
      const scaledAll = { ...next.applyAllEnemiesStatuses };
      for (const [k, v] of Object.entries(scaledAll)) {
        if (typeof v === 'number' && v > 0) {
          scaledAll[k] = v + 1;
          mutatedNonDamage = true;
        }
      }
      next.applyAllEnemiesStatuses = scaledAll;
    }

    if (next.applySelfStatuses && (isEliteOrBoss || enemy.templateId === 'cultist')) {
      const scaledSelf = { ...next.applySelfStatuses };
      for (const [k, v] of Object.entries(scaledSelf)) {
        if (
          typeof v === 'number' &&
          v > 0 &&
          ['strength', 'ritual', 'enrage', 'thorns', 'metallicize'].includes(k) &&
          !(k === 'strength' && enemy.role === 'boss')
        ) {
          scaledSelf[k] = v + 1;
          mutatedNonDamage = true;
        }
      }
      next.applySelfStatuses = scaledSelf;
    }

    if (next.applyPlayerStatuses) {
      const scaledPlayer = { ...next.applyPlayerStatuses };
      for (const [k, v] of Object.entries(scaledPlayer)) {
        if (typeof v === 'number' && v < 0 && (k === 'strength' || k === 'dexterity')) {
          scaledPlayer[k] = v - 1;
          mutatedNonDamage = true;
        } else if (
          typeof v === 'number' &&
          v > 0 &&
          next.id !== 'skull_bash' &&
          ['weak', 'vulnerable', 'frail'].includes(k) &&
          (isEliteOrBoss || v >= 2)
        ) {
          scaledPlayer[k] = v + 1;
          mutatedNonDamage = true;
        }
      }
      next.applyPlayerStatuses = scaledPlayer;
    }

    if (Array.isArray(next.addDiscardCards) && next.addDiscardCards.length > 0) {
      next.addDiscardCards = next.addDiscardCards.map((entry) => ({
        ...entry,
        count: (entry.count ?? 1) + 1,
      }));
      mutatedNonDamage = true;
    }

    if (Array.isArray(next.addDrawCards) && next.addDrawCards.length > 0) {
      next.addDrawCards = next.addDrawCards.map((entry) => ({
        ...entry,
        count: (entry.count ?? 1) + 1,
      }));
      mutatedNonDamage = true;
    }

    if (mutatedNonDamage && next.summary && next.id !== 'dividing_flames' && next.id !== 'time_warp_heal') {
      next.summary = rebuildA9IntentSummary(next);
    }
  }

  return bonus === 0 && !mutatedNonDamage ? intent : next;
}

export function createEnemyInstance(state, spec) {
  const tpl = ENEMY_TEMPLATES[spec.templateId];
  if (!tpl) {
    throw new Error(`Unknown enemy templateId: ${spec.templateId}`);
  }
  state.nextUid = (state.nextUid ?? 1) + 1;

  const asc = state?.ascension ?? 0;
  let maxHp =
    typeof spec.customHp === 'number'
      ? Math.max(1, Math.floor(spec.customHp))
      : randomInt(state, tpl.hpRange[0], tpl.hpRange[1]);

  if (typeof spec.customHp !== 'number') {
    if (tpl.role === 'normal') {
      if (asc >= 9) maxHp = Math.round(maxHp * 1.12);
      else if (asc >= 2) maxHp = Math.round(maxHp * 1.07);
    } else if (tpl.role === 'elite' || tpl.role === 'boss') {
      if (asc >= 9) maxHp = Math.round(maxHp * 1.14);
      else if (asc >= 3) maxHp = Math.round(maxHp * 1.08);
    }
    if (hasDailyModifier(state, 'cursed_run')) {
      maxHp = Math.round(maxHp * 1.12);
    }
  }

  const statuses = { ...tpl.initialStatuses };
  if (asc >= 9) {
    if (tpl.id === 'lagavulin') statuses.metallicize = 6;
    if (tpl.id === 'the_guardian') statuses.modeShift = 28;
    if (tpl.id === 'louse_red' || tpl.id === 'louse_green') statuses.curlUp = 5;
    if (tpl.id === 'fungi_beast') statuses.sporeCloud = 3;
    if (tpl.id === 'red_slaver' || tpl.id === 'gremlin_angry') statuses.angry = 2;
    if (tpl.id === 'byrd') statuses.flight = 4;
    if (tpl.id === 'orb_walker') statuses.ritual = 3;
    if (tpl.id === 'spiker') statuses.thorns = 4;
    if (tpl.id === 'shelled_parasite') statuses.platedArmor = 14;
    if (tpl.id === 'awakened_one') {
      statuses.curiosity = 2;
      statuses.regenerating = 7;
    }
  }

  let initialBlock = statuses.metallicize ? statuses.metallicize : 0;
  if (typeof tpl.initialBlock === 'number' && tpl.initialBlock > 0) {
    initialBlock += tpl.initialBlock + (asc >= 9 ? (tpl.id === 'shelled_parasite' ? 2 : 6) : 0);
  }

  const enemy = {
    id: `enemy_${state.nextUid}`,
    templateId: tpl.id,
    name: spec.customName || tpl.name,
    role: spec.customRole || tpl.role,
    artKey: tpl.artKey,
    ascension: asc,
    hp: maxHp,
    maxHp,
    block: initialBlock,
    statuses,
    skipStatusTick: {},
    skipRitualThisTurn: false,
    turnIndex: 0,
    lastMoveId: null,
    variantIndex: spec.variantIndex ?? 0,
    mode: tpl.id === 'the_guardian' ? 'offensive' : 'normal',
    modeShiftMax: tpl.id === 'the_guardian' ? (asc >= 9 ? 28 : 25) : 0,
    malleableBase: tpl.malleableBase ?? 0,
    flightBase: tpl.id === 'byrd' ? (asc >= 9 ? 4 : 3) : 0,
    grounded: false,
    byrdGroundStep: 0,
    offensiveStep: 0,
    defensiveStep: 0,
    awakeTurnIndex: 0,
    multiStabUsed: 0,
    champPhase: 1,
    defensiveStanceCount: 0,
    champPhase2PendingAnger: false,
    champPhase2Step: 0,
    slowStacks: 0,
    unawakened: tpl.id === 'awakened_one',
    awakenedPhase: 1,
    pendingHaste: false,
    hasteUsed: false,
    darklingRegrowTurns: 0,
    implantUsed: false,
    tempStrengthRestore: 0,
    isMinion: Boolean(spec.isMinion || tpl.isMinion),
    intent: null,
  };

  enemy.intent = rollEnemyIntent(state, enemy);
  return enemy;
}

export function getGuardianDefensiveIntent(step) {
  if (step === 0) {
    return {
      id: 'roll_attack',
      name: '翻滚撞击',
      type: 'attack',
      damage: 8,
      hits: 1,
    };
  }
  return {
    id: 'twin_slam',
    name: '双刃猛击',
    type: 'attack_buff',
    damage: 6,
    hits: 2,
    exitDefensiveMode: true,
    summary: '意图：造成 6×2 点伤害，解除锋利外壳并切回进攻形态',
  };
}

export function getGuardianOffensiveIntent(step) {
  const normalized = ((step % 4) + 4) % 4;
  switch (normalized) {
    case 0:
      return {
        id: 'charging_up',
        name: '核心充能',
        type: 'defend',
        block: 8,
      };
    case 1:
      return {
        id: 'fierce_bash',
        name: '凶猛重击',
        type: 'attack',
        damage: 21,
        hits: 1,
      };
    case 2:
      return {
        id: 'vent_steam',
        name: '蒸汽喷射',
        type: 'debuff',
        applyPlayerStatuses: { weak: 2, vulnerable: 2 },
        summary: '意图：给予玩家 2 层虚弱与 2 层易伤',
      };
    default:
      return {
        id: 'whirlwind_boss',
        name: '旋风斩击',
        type: 'attack',
        damage: 4,
        hits: 4,
      };
  }
}

export function getEnemyIntentCandidates(enemy, player = null, combat = null) {
  switch (enemy.templateId) {
    case 'cultist': {
      if (enemy.turnIndex === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'incantation',
              name: '暗影吟唱',
              type: 'buff',
              applySelfStatuses: { ritual: 3 },
              skipRitualThisTurn: true,
              summary: '意图：获得 3 层仪式（后续每回合结束 +3 力量）',
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: {
            id: 'dark_strike',
            name: '暗黑打击',
            type: 'attack',
            damage: 6,
            hits: 1,
          },
        },
      ];
    }

    case 'jaw_worm': {
      if (enemy.turnIndex === 0) {
        return [
          {
            probability: 1,
            intent: { id: 'chomp', name: '猛咬', type: 'attack', damage: 11, hits: 1 },
          },
        ];
      }
      if (enemy.lastMoveId === 'bellow') {
        return [
          {
            probability: 0.55,
            intent: { id: 'thrash', name: '甩尾', type: 'attack_block', damage: 7, hits: 1, block: 5 },
          },
          {
            probability: 0.45,
            intent: { id: 'chomp', name: '猛咬', type: 'attack', damage: 11, hits: 1 },
          },
        ];
      }
      return [
        {
          probability: 0.35,
          intent: {
            id: 'bellow',
            name: '咆哮',
            type: 'defend_buff',
            block: 6,
            applySelfStatuses: { strength: 3 },
            summary: '意图：获得 6 点格挡与 3 点力量',
          },
        },
        {
          probability: 0.35,
          intent: {
            id: 'thrash',
            name: '甩尾',
            type: 'attack_block',
            damage: 7,
            hits: 1,
            block: 5,
          },
        },
        {
          probability: 0.3,
          intent: { id: 'chomp', name: '猛咬', type: 'attack', damage: 11, hits: 1 },
        },
      ];
    }

    case 'red_louse': {
      if (enemy.lastMoveId !== 'grow') {
        return [
          {
            probability: 0.3,
            intent: {
              id: 'grow',
              name: '蓄力膨胀',
              type: 'buff',
              applySelfStatuses: { strength: 3 },
              summary: '意图：获得 3 点力量',
            },
          },
          {
            probability: 0.7,
            intent: { id: 'bite', name: '啃咬', type: 'attack', damage: 6, hits: 1 },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: { id: 'bite', name: '啃咬', type: 'attack', damage: 6, hits: 1 },
        },
      ];
    }

    case 'green_louse': {
      if (enemy.lastMoveId !== 'spit_web') {
        return [
          {
            probability: 0.35,
            intent: {
              id: 'spit_web',
              name: '粘性蛛网',
              type: 'debuff',
              applyPlayerStatuses: { weak: 2 },
              summary: '意图：给予玩家 2 层虚弱',
            },
          },
          {
            probability: 0.65,
            intent: { id: 'bite', name: '啃咬', type: 'attack', damage: 6, hits: 1 },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: { id: 'bite', name: '啃咬', type: 'attack', damage: 6, hits: 1 },
        },
      ];
    }

    case 'acid_slime': {
      if (enemy.turnIndex % 3 === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'corrosive_spit',
              name: '腐蚀喷吐',
              type: 'attack_debuff',
              damage: 7,
              hits: 1,
              addDiscardCards: [{ cardId: 'slimed', count: 1 }],
            },
          },
        ];
      }
      if (enemy.turnIndex % 3 === 1) {
        return [
          {
            probability: 1,
            intent: {
              id: 'lick',
              name: '酸液舔舐',
              type: 'debuff',
              applyPlayerStatuses: { weak: 1 },
              summary: '意图：给予玩家 1 层虚弱',
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: { id: 'tackle', name: '撞击', type: 'attack', damage: 10, hits: 1 },
        },
      ];
    }

    case 'spike_slime': {
      if (enemy.turnIndex % 2 === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'flame_tackle',
              name: '尖刺冲撞',
              type: 'attack_debuff',
              damage: 8,
              hits: 1,
              addDiscardCards: [{ cardId: 'slimed', count: 1 }],
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: {
            id: 'lick_frail',
            name: '麻痹粘液',
            type: 'debuff',
            applyPlayerStatuses: { frail: 1 },
            summary: '意图：给予玩家 1 层脆弱',
          },
        },
      ];
    }

    case 'fungi_beast': {
      if (enemy.lastMoveId !== 'grow') {
        return [
          {
            probability: 0.35,
            intent: {
              id: 'grow',
              name: '菌丝膨胀',
              type: 'buff',
              applySelfStatuses: { strength: 3 },
              summary: '意图：获得 3 点力量',
            },
          },
          {
            probability: 0.65,
            intent: { id: 'bite', name: '毒菌啃咬', type: 'attack', damage: 6, hits: 1 },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: { id: 'bite', name: '毒菌啃咬', type: 'attack', damage: 6, hits: 1 },
        },
      ];
    }

    case 'slaver_blue': {
      if (enemy.lastMoveId !== 'rake') {
        return [
          {
            probability: 0.42,
            intent: {
              id: 'rake',
              name: '铁钩横扫',
              type: 'attack_debuff',
              damage: 7,
              hits: 1,
              applyPlayerStatuses: { weak: 1 },
            },
          },
          {
            probability: 0.58,
            intent: { id: 'stab', name: '长矛刺击', type: 'attack', damage: 12, hits: 1 },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: { id: 'stab', name: '长矛刺击', type: 'attack', damage: 12, hits: 1 },
        },
      ];
    }

    case 'looter': {
      if (enemy.turnIndex < 2) {
        return [
          {
            probability: 1,
            intent: { id: 'mug', name: '顺手牵羊', type: 'attack', damage: 10, hits: 1 },
          },
        ];
      }
      if (enemy.turnIndex === 2) {
        return [
          {
            probability: 1,
            intent: {
              id: 'lunge_guard',
              name: '闪身架势',
              type: 'defend_buff',
              block: 6,
              applySelfStatuses: { strength: 2 },
              summary: '意图：获得 6 点格挡与 2 点力量',
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent:
            enemy.turnIndex % 2 === 1
              ? { id: 'slash', name: '凶狠劈砍', type: 'attack', damage: 12, hits: 1 }
              : { id: 'feint', name: '虚晃突刺', type: 'attack_block', damage: 8, hits: 1, block: 6 },
        },
      ];
    }

    case 'mad_gremlin': {
      return [
        {
          probability: 1,
          intent: { id: 'scratch', name: '疯狂抓挠', type: 'attack', damage: 5, hits: 1 },
        },
      ];
    }

    case 'gremlin_nob': {
      if (enemy.turnIndex === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'bellow_enrage',
              name: '暴怒战吼',
              type: 'buff',
              applySelfStatuses: { enrage: 2 },
              summary: '意图：获得 2 层激怒（你每打出一张技能牌，大块头 +2 力量）',
            },
          },
        ];
      }
      if (enemy.turnIndex % 3 === 1) {
        return [
          {
            probability: 1,
            intent: {
              id: 'skull_bash',
              name: '碎颅头槌',
              type: 'attack_debuff',
              damage: 6,
              hits: 1,
              applyPlayerStatuses: { vulnerable: 2 },
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: { id: 'rush', name: '蛮力猛冲', type: 'attack', damage: 14, hits: 1 },
        },
      ];
    }

    case 'sentry': {
      const parity = (enemy.turnIndex + (enemy.variantIndex ?? 0)) % 2;
      if (parity === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'bolt',
              name: '能量干扰',
              type: 'debuff',
              addDiscardCards: [{ cardId: 'dazed', count: 2 }],
              summary: '意图：将 2 张【晕眩】洗入你的弃牌堆',
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: { id: 'beam', name: '聚能光束', type: 'attack', damage: 9, hits: 1 },
        },
      ];
    }

    case 'lagavulin': {
      if ((enemy.statuses?.asleep ?? 0) > 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'asleep_idle',
              name: '甲壳沉睡',
              type: 'sleep',
              summary: `意图：处于沉睡中（剩余 ${enemy.statuses.asleep} 回合；每回合获得金属化格挡，受到破甲生命伤害后立即惊醒并眩晕 1 回合）`,
            },
          },
        ];
      }
      if ((enemy.statuses?.stunned ?? 0) > 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'stunned',
              name: '惊醒眩晕',
              type: 'sleep',
              summary: '意图：刚被破甲惊醒并陷入眩晕，本回合无法行动！',
            },
          },
        ];
      }
      const awakeTurn = enemy.awakeTurnIndex ?? 0;
      if (awakeTurn % 3 === 2) {
        return [
          {
            probability: 1,
            intent: {
              id: 'siphon_soul',
              name: '灵魂虹吸',
              type: 'debuff',
              applyPlayerStatuses: { strength: -1, dexterity: -1 },
              summary: '意图：吸取灵魂，使你本场战斗失去 1 点力量与 1 点敏捷',
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: { id: 'claw_crush', name: '巨螯重击', type: 'attack', damage: 18, hits: 1 },
        },
      ];
    }

    case 'the_guardian': {
      return [
        {
          probability: 1,
          intent:
            enemy.mode === 'defensive'
              ? getGuardianDefensiveIntent(enemy.defensiveStep)
              : getGuardianOffensiveIntent(enemy.offensiveStep),
        },
      ];
    }

    case 'hexaghost': {
      if (enemy.turnIndex === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'activate_flames',
              name: '六魂苏醒',
              type: 'defend_buff',
              block: 5,
              summary: '意图：激活六团冥火并获得 5 点格挡，下回合按你的当前生命释放【分裂烈焰】！',
            },
          },
        ];
      }
      if (enemy.turnIndex === 1) {
        const dividerPerHit = Math.max(2, Math.floor((player?.hp ?? 48) / 14) + 1);
        return [
          {
            probability: 1,
            intent: {
              id: 'divider',
              name: '分裂烈焰',
              type: 'attack',
              damage: dividerPerHit,
              hits: 6,
              scalesWithPlayerHp: true,
            },
          },
        ];
      }
      const step = (enemy.turnIndex - 2) % 4;
      if (step === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'sear',
              name: '灼魂火球',
              type: 'attack_debuff',
              damage: 5,
              hits: 1,
              addDiscardCards: [{ cardId: 'burn', count: 1 }],
            },
          },
        ];
      }
      if (step === 1) {
        return [
          {
            probability: 1,
            intent: {
              id: 'flame_charge',
              name: '幽火连袭',
              type: 'attack',
              damage: 4,
              hits: 2,
            },
          },
        ];
      }
      if (step === 2) {
        return [
          {
            probability: 1,
            intent: {
              id: 'inflame_hex',
              name: '冥火升腾',
              type: 'defend_buff',
              block: 8,
              applySelfStatuses: { strength: 2 },
              summary: '意图：获得 8 点格挡与 2 点力量',
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: {
            id: 'inferno',
            name: '炼狱喷发',
            type: 'attack_debuff',
            damage: 2,
            hits: 6,
            addDiscardCards: [{ cardId: 'burn', count: 2 }],
          },
        },
      ];
    }

    case 'slime_boss': {
      if (enemy.hp > 0 && enemy.hp <= Math.floor(enemy.maxHp / 2)) {
        return [
          {
            probability: 1,
            intent: {
              id: 'split',
              name: '巨体分裂',
              type: 'buff',
              splitInto: ['acid_slime', 'spike_slime'],
              summary: '意图：分裂为巨型酸液史莱姆与巨型尖刺史莱姆（各自继承当前生命值）',
            },
          },
        ];
      }
      const step = enemy.turnIndex % 3;
      if (step === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'goop_spray',
              name: '剧毒粘液雨',
              type: 'debuff',
              addDiscardCards: [{ cardId: 'slimed', count: 3 }],
              summary: '意图：将 3 张【黏液】洗入你的弃牌堆',
            },
          },
        ];
      }
      if (step === 1) {
        return [
          {
            probability: 1,
            intent: {
              id: 'preparing',
              name: '庞然蓄力',
              type: 'defend',
              block: 8,
              summary: '意图：获得 8 点格挡并蓄力，下回合发动泰山压顶！',
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: {
            id: 'slime_crush',
            name: '泰山压顶',
            type: 'attack',
            damage: 30,
            hits: 1,
          },
        },
      ];
    }

    case 'centurion': {
      if (enemy.turnIndex % 3 === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'shield_wall',
              name: '铁盾壁垒',
              type: 'attack_block',
              damage: 8,
              hits: 1,
              block: 8,
            },
          },
        ];
      }
      if (enemy.turnIndex % 3 === 1) {
        return [
          {
            probability: 1,
            intent: {
              id: 'fury_mace',
              name: '链锤猛砸',
              type: 'attack',
              damage: 13,
              hits: 1,
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: {
            id: 'double_cleave',
            name: '连环斩',
            type: 'attack',
            damage: 6,
            hits: 2,
          },
        },
      ];
    }

    case 'mystic': {
      if (enemy.turnIndex % 3 === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'hex_chant',
              name: '凋零咒言',
              type: 'debuff',
              applyPlayerStatuses: { frail: 2, weak: 1 },
              summary: '意图：给予玩家 2 层脆弱与 1 层虚弱',
            },
          },
        ];
      }
      if (enemy.turnIndex % 3 === 1) {
        return [
          {
            probability: 1,
            intent: {
              id: 'arcane_bolt',
              name: '秘法冲击',
              type: 'attack',
              damage: 10,
              hits: 1,
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: {
            id: 'ward_blessing',
            name: '圣咏护佑',
            type: 'defend_buff',
            block: 8,
            applySelfStatuses: { strength: 2 },
            summary: '意图：获得 8 点格挡与 2 点力量',
          },
        },
      ];
    }

    case 'book_of_stabbing': {
      if (enemy.turnIndex % 3 === 2) {
        return [
          {
            probability: 1,
            intent: {
              id: 'big_stab',
              name: '穿心重刺',
              type: 'attack',
              damage: 21,
              hits: 1,
            },
          },
        ];
      }
      const stabs = 2 + (enemy.multiStabUsed ?? 0);
      return [
        {
          probability: 1,
          intent: {
            id: 'multi_stab',
            name: '狂乱连刺',
            type: 'attack',
            damage: 6,
            hits: stabs,
          },
        },
      ];
    }

    case 'slaver_taskmaster': {
      if (enemy.turnIndex % 2 === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'scouring_whip',
              name: '裂魂长鞭',
              type: 'attack_debuff',
              damage: 9,
              hits: 1,
              addDiscardCards: [{ cardId: 'wound', count: 1 }],
              applySelfStatuses: { strength: 1 },
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: {
            id: 'command_strike',
            name: '督军重斩',
            type: 'attack',
            damage: 14,
            hits: 1,
          },
        },
      ];
    }

    case 'byrd': {
      if (enemy.grounded || (enemy.statuses?.flight ?? 0) <= 0) {
        if ((enemy.byrdGroundStep ?? 0) === 0) {
          return [
            {
              probability: 1,
              intent: {
                id: 'byrd_headbutt',
                name: '落地头槌',
                type: 'attack',
                damage: 3,
                hits: 1,
              },
            },
          ];
        }
        return [
          {
            probability: 1,
            intent: {
              id: 'byrd_fly_up',
              name: '振翅升空',
              type: 'buff',
              restoreFlight: enemy.flightBase || 3,
              summary: `意图：重新起飞，恢复 ${enemy.flightBase || 3} 层【飞行】（攻击伤害减半）！`,
            },
          },
        ];
      }

      if (enemy.turnIndex === 0) {
        return [
          {
            probability: 0.65,
            intent: { id: 'byrd_peck', name: '迅捷啄击', type: 'attack', damage: 1, hits: 4 },
          },
          {
            probability: 0.35,
            intent: {
              id: 'byrd_caw',
              name: '刺耳鸣叫',
              type: 'buff',
              applySelfStatuses: { strength: 1 },
              summary: '意图：鸣叫鼓舞自身，获得 1 点力量',
            },
          },
        ];
      }

      const pool = [
        {
          weight: 0.5,
          intent: { id: 'byrd_peck', name: '迅捷啄击', type: 'attack', damage: 1, hits: 4 },
        },
        {
          weight: 0.3,
          intent: { id: 'byrd_swoop', name: '俯冲突袭', type: 'attack', damage: 11, hits: 1 },
        },
        {
          weight: 0.2,
          intent: {
            id: 'byrd_caw',
            name: '刺耳鸣叫',
            type: 'buff',
            applySelfStatuses: { strength: 1 },
            summary: '意图：鸣叫鼓舞自身，获得 1 点力量',
          },
        },
      ].filter((x) => !(enemy.lastMoveId === 'byrd_caw' && x.intent.id === 'byrd_caw'));
      const total = pool.reduce((s, x) => s + x.weight, 0) || 1;
      return pool.map((x) => ({ probability: x.weight / total, intent: x.intent }));
    }

    case 'spheric_guardian': {
      if (enemy.turnIndex === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'sphere_activate',
              name: '激活壁垒',
              type: 'defend',
              block: 18,
              summary: '意图：叠加 18 点永久【格挡】（拥有壁垒，格挡不会清零）',
            },
          },
        ];
      }
      if (enemy.turnIndex === 1) {
        return [
          {
            probability: 1,
            intent: {
              id: 'sphere_frail_beam',
              name: '脆弱脉冲',
              type: 'attack_debuff',
              damage: 10,
              hits: 1,
              applyPlayerStatuses: { frail: 3 },
            },
          },
        ];
      }
      if (enemy.turnIndex % 2 === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'sphere_slam',
              name: '双重碾压',
              type: 'attack',
              damage: 10,
              hits: 2,
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: {
            id: 'sphere_harden',
            name: '硬化冲撞',
            type: 'attack_block',
            damage: 10,
            hits: 1,
            block: 12,
          },
        },
      ];
    }

    case 'snake_plant': {
      if (enemy.turnIndex % 3 === 1) {
        return [
          {
            probability: 1,
            intent: {
              id: 'enfeebling_spores',
              name: '致弱孢子',
              type: 'debuff',
              applyPlayerStatuses: { weak: 2, frail: 2 },
              summary: '意图：释放麻痹孢子，给予玩家 2 层虚弱与 2 层脆弱',
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: {
            id: 'snake_chomp',
            name: '狂暴三连咬',
            type: 'attack',
            damage: 6,
            hits: 3,
          },
        },
      ];
    }

    case 'gremlin_leader': {
      const aliveMinions = combat?.enemies
        ? combat.enemies.filter((e) => e.hp > 0 && e.id !== enemy.id).length
        : enemy.turnIndex === 0
          ? 2
          : (enemy.lastKnownMinions ?? 1);

      if (aliveMinions === 0) {
        if (enemy.lastMoveId === 'leader_stab') {
          return [
            {
              probability: 1,
              intent: {
                id: 'leader_rally',
                name: '集结号角',
                type: 'buff',
                summonMinions: 'mad_gremlin',
                summonCount: 2,
                summonMax: 2,
                summonHp: 17,
                summary: '意图：吹响号角，召唤 2 名【狂怒地精】增援！',
              },
            },
          ];
        }
        return [
          {
            probability: 0.75,
            intent: {
              id: 'leader_rally',
              name: '集结号角',
              type: 'buff',
              summonMinions: 'mad_gremlin',
              summonCount: 2,
              summonMax: 2,
              summonHp: 17,
              summary: '意图：吹响号角，召唤 2 名【狂怒地精】增援！',
            },
          },
          {
            probability: 0.25,
            intent: { id: 'leader_stab', name: '统领三连斩', type: 'attack', damage: 6, hits: 3 },
          },
        ];
      }

      const pool = [
        {
          weight: aliveMinions >= 2 ? 0.55 : 0.45,
          intent: {
            id: 'leader_encourage',
            name: '鼓舞士气',
            type: 'defend_buff',
            allEnemiesBlock: 6,
            block: 6,
            applyAllEnemiesStatuses: { strength: 2 },
            summary: '意图：使全体敌方获得 2 点【力量】与 6 点格挡！',
          },
        },
        {
          weight: aliveMinions >= 2 ? 0.45 : 0.35,
          intent: { id: 'leader_stab', name: '统领三连斩', type: 'attack', damage: 6, hits: 3 },
        },
      ];
      if (aliveMinions < 2) {
        pool.push({
          weight: 0.2,
          intent: {
            id: 'leader_rally',
            name: '集结号角',
            type: 'buff',
            summonMinions: 'mad_gremlin',
            summonCount: 2,
            summonMax: 2,
            summonHp: 17,
            summary: '意图：吹响号角，补齐至多 2 名【狂怒地精】增援！',
          },
        });
      }
      const filtered = pool.filter((x) => x.intent.id !== enemy.lastMoveId);
      const activePool = filtered.length > 0 ? filtered : pool;
      const total = activePool.reduce((s, x) => s + x.weight, 0) || 1;
      return activePool.map((x) => ({ probability: x.weight / total, intent: x.intent }));
    }

    case 'bronze_automaton': {
      const step = enemy.turnIndex % 4;
      if (step === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'boost_core',
              name: '齿轮超频',
              type: 'defend_buff',
              block: 10,
              applySelfStatuses: { strength: 2 },
              summary: '意图：获得 10 点格挡与 2 点力量',
            },
          },
        ];
      }
      if (step === 1) {
        return [
          {
            probability: 1,
            intent: {
              id: 'flail_beams',
              name: '双联光束',
              type: 'attack',
              damage: 7,
              hits: 2,
            },
          },
        ];
      }
      if (step === 2) {
        return [
          {
            probability: 1,
            intent: {
              id: 'charge_hyper',
              name: '超能聚束',
              type: 'defend',
              block: 12,
              summary: '意图：获得 12 点格挡，下回合发射毁灭性的【超能光束】！',
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: {
            id: 'hyper_beam',
            name: '超能光束',
            type: 'attack',
            damage: 34,
            hits: 1,
          },
        },
      ];
    }

    case 'the_collector': {
      const step = enemy.turnIndex % 4;
      if (step === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'emerald_ward',
              name: '翠焰王座',
              type: 'defend_buff',
              block: 11,
              applySelfStatuses: { strength: 2 },
              summary: '意图：获得 11 点格挡与 2 点力量',
            },
          },
        ];
      }
      if (step === 1) {
        return [
          {
            probability: 1,
            intent: {
              id: 'fireball_col',
              name: '冥翠火球',
              type: 'attack',
              damage: 14,
              hits: 1,
            },
          },
        ];
      }
      if (step === 2) {
        return [
          {
            probability: 1,
            intent: {
              id: 'you_are_mine',
              name: '你属于我！',
              type: 'debuff',
              applyPlayerStatuses: { weak: 2, vulnerable: 2, frail: 2 },
              summary: '意图：施加王座大诅咒（2 层虚弱、2 层易伤、2 层脆弱）！',
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: {
            id: 'dark_volley',
            name: '暗影齐射',
            type: 'attack',
            damage: 7,
            hits: 3,
          },
        },
      ];
    }

    case 'the_champ': {
      const phase = enemy.champPhase ?? 1;
      if (phase >= 2 && enemy.champPhase2PendingAnger) {
        return [
          {
            probability: 1,
            intent: {
              id: 'champ_anger',
              name: '狂暴怒吼',
              type: 'buff',
              clearSelfDebuffs: true,
              applySelfStatuses: { strength: 6 },
              summary: '意图：震碎自身全部负面状态并获得 6 点力量，下回合必将施放【处决】！',
            },
          },
        ];
      }
      if (phase >= 2 && (enemy.champPhase2Step ?? 0) === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'champ_execute',
              name: '处决',
              type: 'attack',
              damage: 7,
              hits: 2,
            },
          },
        ];
      }
      if (phase === 1 && enemy.turnIndex % 4 === 3) {
        return [
          {
            probability: 1,
            intent: {
              id: 'champ_taunt',
              name: '轻蔑嘲讽',
              type: 'debuff',
              applyPlayerStatuses: { weak: 2, vulnerable: 2 },
              summary: '意图：轻蔑嘲讽玩家，施加 2 层虚弱与 2 层易伤',
            },
          },
        ];
      }

      const canDefensiveStance = (enemy.defensiveStanceCount ?? 0) < 2;
      const pool = [
        canDefensiveStance
          ? {
              weight: 0.15,
              intent: {
                id: 'defensive_stance',
                name: '铁壁架势',
                type: 'defend_buff',
                block: 10,
                applySelfStatuses: { metallicize: 3 },
                incrementDefensiveStance: true,
                summary: '意图：获得 10 点格挡与 3 层金属化',
              },
            }
          : null,
        {
          weight: canDefensiveStance ? 0.15 : 0.3,
          intent: {
            id: 'champ_gloat',
            name: '狂傲蓄势',
            type: 'buff',
            applySelfStatuses: { strength: 2 },
            summary: '意图：炫耀武勇并获得 2 点力量',
          },
        },
        {
          weight: 0.25,
          intent: {
            id: 'face_slap',
            name: '震面猛击',
            type: 'attack_debuff',
            damage: 9,
            hits: 1,
            applyPlayerStatuses: { frail: 2, vulnerable: 2 },
          },
        },
        {
          weight: 0.45,
          intent: {
            id: 'heavy_slash',
            name: '巨剑重劈',
            type: 'attack',
            damage: 13,
            hits: 1,
          },
        },
      ].filter((item) => item && item.intent.id !== enemy.lastMoveId);

      const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0) || 1;
      return pool.map((item) => ({
        probability: item.weight / totalWeight,
        intent: item.intent,
      }));
    }

    // === Act 3 Normal Enemies ===
    case 'orb_walker': {
      if (enemy.turnIndex % 2 === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'orb_laser',
              name: '激光灼烧',
              type: 'attack_debuff',
              damage: 10,
              hits: 1,
              addDiscardCards: [{ cardId: 'burn', count: 1 }],
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: { id: 'orb_claw', name: '机械利爪', type: 'attack', damage: 14, hits: 1 },
        },
      ];
    }

    case 'spiker': {
      const currentThorns = enemy.statuses?.thorns ?? 3;
      if (enemy.turnIndex % 2 === 1 && currentThorns < 7) {
        return [
          {
            probability: 1,
            intent: {
              id: 'spike_up',
              name: '倒刺生长',
              type: 'buff',
              applySelfStatuses: { thorns: 2 },
              summary: '意图：生长锋利倒刺，获得 2 层【荆棘】',
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: { id: 'spiker_cut', name: '荆棘穿刺', type: 'attack', damage: 7, hits: 1 },
        },
      ];
    }

    case 'exploder': {
      if ((enemy.statuses?.explosive ?? 0) <= 1 || enemy.turnIndex >= 2) {
        return [
          {
            probability: 1,
            intent: {
              id: 'explosive_detonate',
              name: '终极自爆',
              type: 'attack',
              damage: 30,
              hits: 1,
              selfDestruct: true,
              summary: '意图：引爆能量核心，造成 30 点伤害后自我毁灭！',
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: { id: 'exploder_slam', name: '冲撞', type: 'attack', damage: 9, hits: 1 },
        },
      ];
    }

    case 'repulsor': {
      if (enemy.turnIndex % 2 === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'repulse_daze',
              name: '斥力脉冲',
              type: 'debuff',
              addDrawCards: [{ cardId: 'dazed', count: 2 }],
              summary: '意图：将 2 张【晕眩】洗入你的抽牌堆！',
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: { id: 'repulsor_bash', name: '钝击', type: 'attack', damage: 11, hits: 1 },
        },
      ];
    }

    case 'maw': {
      if (enemy.turnIndex === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'maw_roar',
              name: '威慑咆哮',
              type: 'debuff',
              applyPlayerStatuses: { weak: 3, frail: 3 },
              summary: '意图：发出震耳咆哮，使你获得 3 层虚弱与 3 层脆弱',
            },
          },
        ];
      }
      const step = (enemy.turnIndex - 1) % 3;
      if (step === 0) {
        return [
          {
            probability: 1,
            intent: { id: 'maw_slam', name: '巨颚重砸', type: 'attack', damage: 22, hits: 1 },
          },
        ];
      }
      if (step === 1) {
        return [
          {
            probability: 1,
            intent: {
              id: 'maw_drool',
              name: '狂暴蓄势',
              type: 'buff',
              applySelfStatuses: { strength: 3 },
              summary: '意图：垂涎蓄力，获得 3 点力量',
            },
          },
        ];
      }
      const nomHits = Math.min(5, Math.floor(enemy.turnIndex / 2) + 1);
      return [
        {
          probability: 1,
          intent: { id: 'maw_nom', name: '疯狂啃噬', type: 'attack', damage: 5, hits: nomHits },
        },
      ];
    }

    // === Act 3 Elites ===
    case 'giant_head': {
      if (enemy.turnIndex < 3) {
        if (enemy.turnIndex % 2 === 1) {
          return [
            {
              probability: 1,
              intent: {
                id: 'head_glare',
                name: '凝视威压',
                type: 'debuff',
                applyPlayerStatuses: { weak: 1 },
                summary: `意图：沉重凝视，施加 1 层虚弱（还剩 ${3 - enemy.turnIndex} 回合觉醒重击）`,
              },
            },
          ];
        }
        return [
          {
            probability: 1,
            intent: {
              id: 'head_count',
              name: `低语倒数 (${3 - enemy.turnIndex})`,
              type: 'attack',
              damage: 13,
              hits: 1,
            },
          },
        ];
      }
      const escalateDmg = Math.min(60, 30 + (enemy.turnIndex - 3) * 5);
      return [
        {
          probability: 1,
          intent: {
            id: 'it_is_time',
            name: '终焉降临',
            type: 'attack',
            damage: escalateDmg,
            hits: 1,
          },
        },
      ];
    }

    case 'nemesis': {
      if (enemy.turnIndex === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'nemesis_tri_burn',
              name: '死灵灼魂',
              type: 'debuff',
              addDiscardCards: [{ cardId: 'burn', count: 3 }],
              summary: '意图：将 3 张【灼伤】塞入你的弃牌堆',
            },
          },
        ];
      }
      const nemPool = [
        {
          weight: 0.45,
          intent: {
            id: 'nemesis_debilitate',
            name: '衰弱连斩',
            type: 'attack_debuff',
            damage: 6,
            hits: 3,
            addDiscardCards: [{ cardId: 'burn', count: 2 }],
          },
        },
        {
          weight: 0.35,
          intent: {
            id: 'nemesis_scythe',
            name: '死神巨镰',
            type: 'attack',
            damage: 36,
            hits: 1,
          },
        },
        {
          weight: 0.2,
          intent: {
            id: 'nemesis_tri_burn',
            name: '死灵灼魂',
            type: 'debuff',
            addDiscardCards: [{ cardId: 'burn', count: 3 }],
            summary: '意图：将 3 张【灼伤】塞入你的弃牌堆',
          },
        },
      ].filter((item) => item.intent.id !== enemy.lastMoveId);
      const total = nemPool.reduce((s, x) => s + x.weight, 0) || 1;
      return nemPool.map((x) => ({ probability: x.weight / total, intent: x.intent }));
    }

    case 'reptomancer': {
      if (enemy.turnIndex === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'repto_summon',
              name: '召唤魔刃',
              type: 'buff',
              summonMinions: 'dagger',
              summonCount: 2,
              summary: '意图：召唤 2 把【魔刃飞刀】协同进攻！',
            },
          },
        ];
      }
      const step = enemy.turnIndex % 3;
      if (step === 1) {
        return [
          {
            probability: 1,
            intent: {
              id: 'snake_strike',
              name: '毒蛇二连击',
              type: 'attack_debuff',
              damage: 12,
              hits: 2,
              applyPlayerStatuses: { weak: 1 },
            },
          },
        ];
      }
      if (step === 2) {
        return [
          {
            probability: 1,
            intent: { id: 'big_bite', name: '致命噬咬', type: 'attack', damage: 28, hits: 1 },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: {
            id: 'repto_summon',
            name: '召唤魔刃',
            type: 'buff',
            summonMinions: 'dagger',
            summonCount: 2,
            summary: '意图：召唤 2 把【魔刃飞刀】协同进攻！',
          },
        },
      ];
    }

    case 'dagger': {
      if (enemy.turnIndex === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'dagger_stab',
              name: '飞刃穿刺',
              type: 'attack_debuff',
              damage: 9,
              hits: 1,
              addDiscardCards: [{ cardId: 'wound', count: 1 }],
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: {
            id: 'dagger_sacrifice',
            name: '牺牲斩',
            type: 'attack',
            damage: 22,
            hits: 1,
            selfDestruct: true,
          },
        },
      ];
    }

    // === Act 3 Bosses ===
    case 'time_eater': {
      if (enemy.pendingHaste && !enemy.hasteUsed) {
        return [
          {
            probability: 1,
            intent: {
              id: 'time_haste',
              name: '狂潮加速',
              type: 'buff',
              clearSelfDebuffs: true,
              healToHalfMax: true,
              summary: '意图：时间回溯！清除全部负面状态并恢复至 50% 生命！',
            },
          },
        ];
      }
      const tePool = [
        {
          weight: 0.45,
          intent: { id: 'reverberate', name: '时空震荡', type: 'attack', damage: 7, hits: 3 },
        },
        {
          weight: 0.35,
          intent: {
            id: 'head_slam',
            name: '重锤冲撞',
            type: 'attack_debuff',
            damage: 22,
            hits: 1,
            applyPlayerStatuses: { weak: 1 },
            addDiscardCards: [{ cardId: 'slimed', count: 2 }],
          },
        },
        {
          weight: 0.2,
          intent: {
            id: 'ripple',
            name: '时间涟漪',
            type: 'defend_buff',
            block: 18,
            applyPlayerStatuses: { weak: 1, vulnerable: 1, frail: 1 },
            summary: '意图：获得 18 点格挡，并对你施加虚弱、易伤与脆弱各 1 层',
          },
        },
      ].filter((x) => x.intent.id !== enemy.lastMoveId);
      const total = tePool.reduce((s, x) => s + x.weight, 0) || 1;
      return tePool.map((x) => ({ probability: x.weight / total, intent: x.intent }));
    }

    case 'awakened_one': {
      if (enemy.unawakened !== false) {
        if (enemy.turnIndex % 2 === 0) {
          return [
            {
              probability: 1,
              intent: { id: 'awakened_slash', name: '暗影裂爪', type: 'attack', damage: 16, hits: 1 },
            },
          ];
        }
        return [
          {
            probability: 1,
            intent: { id: 'soul_strike', name: '灵魂四连击', type: 'attack', damage: 5, hits: 4 },
          },
        ];
      }
      const p2Step = (enemy.awakeTurnIndex ?? 0) % 3;
      if (p2Step === 0) {
        return [
          {
            probability: 1,
            intent: { id: 'dark_echo', name: '幽冥回响', type: 'attack', damage: 25, hits: 1 },
          },
        ];
      }
      if (p2Step === 1) {
        return [
          {
            probability: 1,
            intent: {
              id: 'awakened_sludge',
              name: '腐朽淤泥',
              type: 'attack_debuff',
              damage: 15,
              hits: 1,
              addDiscardCards: [{ cardId: 'burn', count: 1 }, { cardId: 'dazed', count: 1 }],
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: { id: 'awakened_tackle', name: '觉醒猛扑', type: 'attack', damage: 8, hits: 3 },
        },
      ];
    }

    case 'donu': {
      if (enemy.turnIndex % 2 === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'circle_of_power',
              name: '力量法阵',
              type: 'buff',
              applyAllEnemiesStatuses: { strength: 3 },
              summary: '意图：使全体友方单位获得 3 点【力量】！',
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: { id: 'donu_beam', name: '光束齐射', type: 'attack', damage: 9, hits: 2 },
        },
      ];
    }

    case 'deca': {
      if (enemy.turnIndex % 2 === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'deca_beam',
              name: '脉冲双击',
              type: 'attack_debuff',
              damage: 9,
              hits: 2,
              addDiscardCards: [{ cardId: 'dazed', count: 2 }],
            },
          },
        ];
      }
      return [
        {
          probability: 1,
          intent: {
            id: 'square_of_protection',
            name: '守护方阵',
            type: 'defend',
            allEnemiesBlock: 14,
            block: 14,
            summary: '意图：使全体友方单位获得 14 点格挡！',
          },
        },
      ];
    }

    case 'chosen': {
      if (enemy.turnIndex === 0) {
        return [
          {
            probability: 1,
            intent: { id: 'chosen_poke', name: '连刺', type: 'attack', damage: 5, hits: 2 },
          },
        ];
      }
      if (enemy.turnIndex === 1) {
        return [
          {
            probability: 1,
            intent: {
              id: 'chosen_hex',
              name: '妖术诅咒',
              type: 'debuff',
              applyPlayerStatuses: { hex: 1 },
              summary: '意图：施加 1 层【妖术】（此后你每打出非攻击牌，洗 1 张【晕眩】进抽牌堆）！',
            },
          },
        ];
      }
      if (enemy.turnIndex % 2 === 0) {
        return [
          {
            probability: 0.5,
            intent: {
              id: 'chosen_debilitate',
              name: '削弱重击',
              type: 'attack_debuff',
              damage: 10,
              hits: 1,
              applyPlayerStatuses: { vulnerable: 2 },
            },
          },
          {
            probability: 0.5,
            intent: {
              id: 'chosen_drain',
              name: '汲能咒缚',
              type: 'buff',
              applySelfStatuses: { strength: 3 },
              applyPlayerStatuses: { weak: 3 },
              summary: '意图：自身获得 3 点力量，并给予你 3 层【虚弱】。',
            },
          },
        ];
      }
      return [
        {
          probability: 0.6,
          intent: { id: 'chosen_poke', name: '连刺', type: 'attack', damage: 5, hits: 2 },
        },
        {
          probability: 0.4,
          intent: { id: 'chosen_zap', name: '秘能强击', type: 'attack', damage: 16, hits: 1 },
        },
      ];
    }

    case 'shelled_parasite': {
      if ((enemy.statuses?.stunned ?? 0) > 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'stunned',
              name: '硬壳碎裂 · 眩晕',
              type: 'debuff',
              summary: '多层护甲已被击碎！本回合陷入眩晕无法行动。',
            },
          },
        ];
      }
      if (enemy.turnIndex === 0) {
        return [
          {
            probability: 0.5,
            intent: { id: 'parasite_double', name: '双连噬咬', type: 'attack', damage: 5, hits: 2 },
          },
          {
            probability: 0.5,
            intent: {
              id: 'parasite_suck',
              name: '吸血啃咬',
              type: 'attack_buff',
              damage: 9,
              hits: 1,
              lifesteal: true,
              summary: '意图：造成 9 点伤害，并回复等同于实际生命伤害的血量！',
            },
          },
        ];
      }
      const allowFell = enemy.lastMoveId !== 'parasite_fell';
      if (allowFell) {
        return [
          {
            probability: 0.4,
            intent: { id: 'parasite_double', name: '双连噬咬', type: 'attack', damage: 5, hits: 2 },
          },
          {
            probability: 0.4,
            intent: {
              id: 'parasite_suck',
              name: '吸血啃咬',
              type: 'attack_buff',
              damage: 9,
              hits: 1,
              lifesteal: true,
              summary: '意图：造成 9 点伤害，并回复等同于实际生命伤害的血量！',
            },
          },
          {
            probability: 0.2,
            intent: {
              id: 'parasite_fell',
              name: '重甲击倒',
              type: 'attack_debuff',
              damage: 15,
              hits: 1,
              applyPlayerStatuses: { frail: 2 },
            },
          },
        ];
      }
      return [
        {
          probability: 0.5,
          intent: { id: 'parasite_double', name: '双连噬咬', type: 'attack', damage: 5, hits: 2 },
        },
        {
          probability: 0.5,
          intent: {
            id: 'parasite_suck',
            name: '吸血啃咬',
            type: 'attack_buff',
            damage: 9,
            hits: 1,
            lifesteal: true,
            summary: '意图：造成 9 点伤害，并回复等同于实际生命伤害的血量！',
          },
        },
      ];
    }

    case 'snecko': {
      if (enemy.turnIndex === 0) {
        return [
          {
            probability: 1,
            intent: {
              id: 'perplexing_glare',
              name: '困惑凝视',
              type: 'debuff',
              applyPlayerStatuses: { confused: 1 },
              summary: '意图：施加【混乱】（此后抽到的每张牌费用随机重设为 0–3）！',
            },
          },
        ];
      }
      if (enemy.lastMoveId === 'tail_whip') {
        return [
          {
            probability: 1,
            intent: { id: 'snecko_bite', name: '毒牙啃咬', type: 'attack', damage: 14, hits: 1 },
          },
        ];
      }
      return [
        {
          probability: 0.6,
          intent: { id: 'snecko_bite', name: '毒牙啃咬', type: 'attack', damage: 14, hits: 1 },
        },
        {
          probability: 0.4,
          intent: {
            id: 'tail_whip',
            name: '神龙摆尾',
            type: 'attack_debuff',
            damage: 8,
            hits: 1,
            applyPlayerStatuses: { vulnerable: 2, weak: 2 },
          },
        },
      ];
    }

    case 'darkling': {
      const isMiddle = (enemy.variantIndex ?? 0) === 1;
      const hardenIntent = {
        id: 'darkling_harden',
        name: '暗影硬化',
        type: (enemy.ascension ?? 0) >= 2 ? 'defend_buff' : 'defend',
        block: 10,
        applySelfStatuses: (enemy.ascension ?? 0) >= 2 ? { strength: 1 } : undefined,
        summary:
          (enemy.ascension ?? 0) >= 2
            ? '意图：获得 10 点格挡与 1 点力量。'
            : '意图：获得 10 点格挡。',
      };
      const nipIntent = {
        id: 'darkling_nip',
        name: '暗影啃咬',
        type: 'attack',
        damage: 8,
        hits: 1,
      };
      const chompIntent = {
        id: 'darkling_chomp',
        name: '双颚撕咬',
        type: 'attack',
        damage: 6,
        hits: 2,
      };
      if (enemy.turnIndex === 0) {
        return isMiddle
          ? [
              { probability: 0.5, intent: nipIntent },
              { probability: 0.5, intent: hardenIntent },
            ]
          : [
              { probability: 0.5, intent: nipIntent },
              { probability: 0.5, intent: chompIntent },
            ];
      }
      if (isMiddle) {
        return enemy.lastMoveId === 'darkling_harden'
          ? [{ probability: 1, intent: nipIntent }]
          : [
              { probability: 0.5, intent: nipIntent },
              { probability: 0.5, intent: hardenIntent },
            ];
      }
      if (enemy.lastMoveId === 'darkling_chomp') {
        return [
          { probability: 0.55, intent: nipIntent },
          { probability: 0.45, intent: hardenIntent },
        ];
      }
      return [
        { probability: 0.4, intent: chompIntent },
        { probability: 0.35, intent: nipIntent },
        { probability: 0.25, intent: hardenIntent },
      ];
    }

    case 'spire_growth': {
      const playerConstricted = (player?.statuses?.constricted ?? 0) > 0;
      const constrictIntent = {
        id: 'sg_constrict',
        name: '藤蔓缠绕',
        type: 'debuff',
        applyPlayerStatuses: { constricted: 8 },
        summary: '意图：给予你 8 层【缠绕】（每回合结束受到 8 点可格挡伤害）！',
      };
      const quickTackle = {
        id: 'sg_tackle',
        name: '迅捷撞击',
        type: 'attack',
        damage: 14,
        hits: 1,
      };
      const smashIntent = {
        id: 'sg_smash',
        name: '重锤猛击',
        type: 'attack',
        damage: 20,
        hits: 1,
      };
      if (enemy.turnIndex === 0 && !playerConstricted) {
        return [{ probability: 1, intent: constrictIntent }];
      }
      if (!playerConstricted && enemy.lastMoveId !== 'sg_constrict') {
        return [
          { probability: 0.5, intent: constrictIntent },
          { probability: 0.5, intent: quickTackle },
        ];
      }
      if (enemy.lastMoveId === 'sg_smash') {
        return [{ probability: 1, intent: quickTackle }];
      }
      return [
        { probability: 0.5, intent: quickTackle },
        { probability: 0.5, intent: smashIntent },
      ];
    }

    case 'transient': {
      const step = Math.min(4, Math.max(0, enemy.turnIndex ?? 0));
      const baseDmg = 22 + step * 8;
      return [
        {
          probability: 1,
          intent: {
            id: 'transient_attack',
            name: '虚无重击',
            type: 'attack',
            damage: baseDmg,
            hits: 1,
          },
        },
      ];
    }

    case 'writhing_mass': {
      const pool = [
        {
          probability: 0.22,
          intent: { id: 'wm_heavy', name: '猛烈抽打', type: 'attack', damage: 26, hits: 1 },
        },
        {
          probability: 0.24,
          intent: { id: 'wm_flail', name: '触手连击', type: 'attack', damage: 7, hits: 3 },
        },
        {
          probability: 0.22,
          intent: {
            id: 'wm_guard',
            name: '硬甲反击',
            type: 'attack_defend',
            damage: 12,
            hits: 1,
            block: 12,
          },
        },
        {
          probability: 0.2,
          intent: {
            id: 'wm_wither',
            name: '枯萎侵蚀',
            type: 'attack_debuff',
            damage: 9,
            hits: 1,
            applyPlayerStatuses: { weak: 2, frail: 2 },
          },
        },
      ];
      if (!enemy.implantUsed && (enemy.turnIndex ?? 0) >= 1) {
        pool.push({
          probability: 0.12,
          intent: {
            id: 'wm_implant',
            name: '寄生植入',
            type: 'debuff',
            addCurseToDeck: 'parasite',
            summary: '⚠ 危险！将 1 张永久诅咒【寄生】植入你的牌组（用攻击牌触发【应激反应】可刷新意图躲避）！',
          },
        });
      }
      const totalProb = pool.reduce((sum, item) => sum + item.probability, 0);
      return pool.map((item) => ({
        ...item,
        probability: Number((item.probability / totalProb).toFixed(6)),
      }));
    }

    default:
      return [
        {
          probability: 1,
          intent: {
            id: 'basic_hit',
            name: '攻击',
            type: 'attack',
            damage: 6,
            hits: 1,
          },
        },
      ];
  }
}

export function rollEnemyIntent(state, enemy, options = {}) {
  const rawCandidates = getEnemyIntentCandidates(enemy, state?.player ?? null, state?.combat ?? null);
  let candidates = rawCandidates;
  if (options.forceDifferentFromId && rawCandidates.length > 1) {
    const filtered = rawCandidates.filter((item) => item.intent?.id !== options.forceDifferentFromId);
    if (filtered.length > 0) {
      const sumProb = filtered.reduce((sum, item) => sum + item.probability, 0) || 1;
      candidates = filtered.map((item) => ({
        ...item,
        probability: item.probability / sumProb,
      }));
    }
  }
  const roll = nextRandom(state);
  let cumulative = 0;
  let chosen = candidates[candidates.length - 1].intent;
  for (const item of candidates) {
    cumulative = Number((cumulative + item.probability).toFixed(6));
    if (roll < cumulative) {
      chosen = item.intent;
      break;
    }
  }
  return applyAscensionIntentScaling(state, enemy, chosen);
}

export function predictNextTurnIntents(
  enemy,
  player = null,
  ascensionOverride = undefined,
  combat = null
) {
  if (!enemy || enemy.hp <= 0) {
    return {
      summaryText: '',
      tooltipLines: [],
      candidates: [],
      conditionalNote: '',
    };
  }

  const asc = ascensionOverride ?? enemy.ascension ?? 0;
  const curIntent = enemy.intent;

  if (curIntent && Array.isArray(curIntent.splitInto) && curIntent.splitInto.length > 0) {
    const splitHp = Math.max(1, enemy.hp);
    const detail = `分裂为巨型酸液史莱姆与巨型尖刺史莱姆（各 ${splitHp} 点生命），下回合分别施放腐蚀喷吐与尖刺冲撞`;
    return {
      summaryText: '下回合：分裂双史莱姆',
      tooltipLines: [`• 双体分裂行动：${detail}`],
      candidates: [
        {
          id: 'split_children',
          name: '双体分裂行动',
          probability: 1,
          pct: 100,
          type: 'attack_debuff',
          isAttack: true,
          totalDamage: 15,
          label: '双史莱姆攻击',
          detail,
        },
      ],
      conditionalNote: '',
    };
  }

  const simEnemyStatuses = { ...(enemy.statuses || {}) };
  const simEnemySkip = { ...(enemy.skipStatusTick || {}) };
  let simSkipRitual = Boolean(enemy.skipRitualThisTurn);

  if (curIntent?.clearSelfDebuffs) {
    for (const k of ['vulnerable', 'weak', 'frail', 'poison', 'corpseExplosion']) {
      delete simEnemyStatuses[k];
      delete simEnemySkip[k];
    }
    if ((simEnemyStatuses.strength ?? 0) < 0) {
      delete simEnemyStatuses.strength;
    }
  }

  if (curIntent?.applySelfStatuses) {
    for (const [k, v] of Object.entries(curIntent.applySelfStatuses)) {
      const prev = simEnemyStatuses[k] ?? 0;
      simEnemyStatuses[k] = prev + v;
    }
    if (curIntent.skipRitualThisTurn) {
      simSkipRitual = true;
    }
  }

  if ((simEnemyStatuses.ritual ?? 0) > 0) {
    if (simSkipRitual) {
      simSkipRitual = false;
    } else {
      simEnemyStatuses.strength = (simEnemyStatuses.strength ?? 0) + simEnemyStatuses.ritual;
    }
  }

  const simPlayerStatuses = { ...(player?.statuses || {}) };
  const simPlayerSkip = { ...(player?.skipStatusTick || {}) };
  if (curIntent?.applyPlayerStatuses) {
    for (const [k, v] of Object.entries(curIntent.applyPlayerStatuses)) {
      const prev = simPlayerStatuses[k] ?? 0;
      const next = prev + v;
      if (k === 'strength' || k === 'dexterity') {
        if (next === 0) delete simPlayerStatuses[k];
        else simPlayerStatuses[k] = next;
      } else if (next > 0) {
        simPlayerStatuses[k] = next;
        if (['vulnerable', 'weak', 'frail'].includes(k) && v > 0 && prev <= 0) {
          simPlayerSkip[k] = true;
        }
      }
    }
  }

  for (const key of ['vulnerable', 'weak', 'frail']) {
    if ((simEnemyStatuses[key] ?? 0) > 0) {
      if (simEnemySkip[key]) {
        delete simEnemySkip[key];
      } else if (simEnemyStatuses[key] - 1 <= 0) {
        delete simEnemyStatuses[key];
      } else {
        simEnemyStatuses[key] -= 1;
      }
    }
    if ((simPlayerStatuses[key] ?? 0) > 0) {
      if (simPlayerSkip[key]) {
        delete simPlayerSkip[key];
      } else if (simPlayerStatuses[key] - 1 <= 0) {
        delete simPlayerStatuses[key];
      } else {
        simPlayerStatuses[key] -= 1;
      }
    }
  }

  let nextMode = enemy.mode ?? 'normal';
  let nextOffensiveStep = enemy.offensiveStep ?? 0;
  let nextDefensiveStep = enemy.defensiveStep ?? 0;

  if (enemy.templateId === 'the_guardian') {
    if (curIntent?.exitDefensiveMode) {
      delete simEnemyStatuses.sharpHide;
      nextMode = 'offensive';
      nextOffensiveStep = 0;
    } else if (nextMode === 'defensive') {
      nextDefensiveStep += 1;
    } else {
      nextOffensiveStep = (((nextOffensiveStep + 1) % 4) + 4) % 4;
    }
  }

  let nextGrounded = Boolean(enemy.grounded);
  let nextByrdGroundStep = enemy.byrdGroundStep ?? 0;
  if (enemy.templateId === 'byrd') {
    if (curIntent?.id === 'stunned') {
      delete simEnemyStatuses.stunned;
      nextGrounded = true;
      nextByrdGroundStep = 0;
    } else if (curIntent?.restoreFlight) {
      simEnemyStatuses.flight = curIntent.restoreFlight;
      nextGrounded = false;
      nextByrdGroundStep = 0;
    } else if (nextGrounded) {
      nextByrdGroundStep += 1;
    }
  }

  let nextAwakeTurnIndex = enemy.awakeTurnIndex ?? 0;
  if (enemy.templateId === 'lagavulin') {
    if ((simEnemyStatuses.asleep ?? 0) > 0) {
      simEnemyStatuses.asleep -= 1;
      if (simEnemyStatuses.asleep <= 0) {
        delete simEnemyStatuses.asleep;
        delete simEnemyStatuses.metallicize;
        nextAwakeTurnIndex = 0;
      }
    } else if ((simEnemyStatuses.stunned ?? 0) > 0 || curIntent?.id === 'stunned') {
      delete simEnemyStatuses.stunned;
      nextAwakeTurnIndex = 0;
    } else {
      nextAwakeTurnIndex += 1;
    }
  } else if (enemy.templateId === 'awakened_one' && enemy.unawakened === false) {
    nextAwakeTurnIndex += 1;
  }

  const nextMultiStabUsed =
    enemy.templateId === 'book_of_stabbing' && curIntent?.id === 'multi_stab'
      ? (enemy.multiStabUsed ?? 0) + 1
      : (enemy.multiStabUsed ?? 0);

  let nextChampPhase = enemy.champPhase ?? 1;
  let nextChampPendingAnger = Boolean(enemy.champPhase2PendingAnger);
  let nextChampPhase2Step = enemy.champPhase2Step ?? 0;
  const nextDefensiveStanceCount =
    enemy.templateId === 'the_champ' && curIntent?.incrementDefensiveStance
      ? (enemy.defensiveStanceCount ?? 0) + 1
      : (enemy.defensiveStanceCount ?? 0);

  if (enemy.templateId === 'the_champ') {
    if (curIntent?.id === 'champ_anger') {
      nextChampPendingAnger = false;
      nextChampPhase2Step = 0;
    } else if (nextChampPhase === 1 && enemy.hp <= Math.floor(enemy.maxHp / 2)) {
      nextChampPhase = 2;
      nextChampPendingAnger = true;
    } else if (nextChampPhase >= 2) {
      nextChampPhase2Step = (nextChampPhase2Step + 1) % 3;
    }
  }

  let nextPendingHaste = Boolean(enemy.pendingHaste);
  let nextHasteUsed = Boolean(enemy.hasteUsed);
  if (enemy.templateId === 'time_eater') {
    if (curIntent?.id === 'time_haste') {
      nextPendingHaste = false;
      nextHasteUsed = true;
    } else if (!nextHasteUsed && enemy.hp <= Math.floor(enemy.maxHp / 2)) {
      nextPendingHaste = true;
    }
  }

  if ((simEnemyStatuses.explosive ?? 0) > 0 && !curIntent?.selfDestruct) {
    simEnemyStatuses.explosive = Math.max(1, simEnemyStatuses.explosive - 1);
  }
  if (enemy.templateId === 'shelled_parasite' && (simEnemyStatuses.stunned ?? 0) > 0) {
    delete simEnemyStatuses.stunned;
  }
  if (enemy.templateId === 'transient' && (enemy.statuses?.fading ?? 0) <= 1) {
    return {
      summaryText: '下回合：消逝离场',
      tooltipLines: ['• 【消逝】倒计时将在本回合结束后归零，瞬息自动消散并结束战斗！'],
      candidates: [],
      conditionalNote: '撑过本回合攻击即可直接获胜！',
    };
  }
  const nextImplantUsed = Boolean(enemy.implantUsed || curIntent?.id === 'wm_implant');

  const simEnemy = {
    ...enemy,
    ascension: asc,
    statuses: simEnemyStatuses,
    turnIndex: (enemy.turnIndex ?? 0) + 1,
    grounded: nextGrounded,
    byrdGroundStep: nextByrdGroundStep,
    awakeTurnIndex: nextAwakeTurnIndex,
    multiStabUsed: nextMultiStabUsed,
    champPhase: nextChampPhase,
    champPhase2PendingAnger: nextChampPendingAnger,
    champPhase2Step: nextChampPhase2Step,
    defensiveStanceCount: nextDefensiveStanceCount,
    pendingHaste: nextPendingHaste,
    hasteUsed: nextHasteUsed,
    implantUsed: nextImplantUsed,
    lastMoveId: curIntent?.id ?? enemy.lastMoveId ?? null,
    mode: nextMode,
    offensiveStep: nextOffensiveStep,
    defensiveStep: nextDefensiveStep,
  };

  const simPlayer = player
    ? {
        ...player,
        statuses: simPlayerStatuses,
      }
    : null;

  const rawCandidates = getEnemyIntentCandidates(simEnemy, simPlayer, combat);
  const candidates = rawCandidates.map((item) => {
    const scaled = applyAscensionIntentScaling({ ascension: asc }, simEnemy, item.intent);
    const preview = getEnemyIntentPreview({ ...simEnemy, intent: scaled }, simPlayer);
    const pct = Math.round(item.probability * 100);
    return {
      id: scaled.id,
      name: scaled.name || preview.label,
      probability: item.probability,
      pct,
      type: preview.type,
      isAttack: preview.isAttack,
      totalDamage: preview.totalDamage,
      label: preview.label,
      detail: preview.detail.replace(/^意图：/, ''),
    };
  });

  let conditionalNote = '';
  if (enemy.templateId === 'the_guardian' && enemy.mode === 'offensive') {
    conditionalNote = '若本回合触发【形态转换】，将切换防御形态并使用【翻滚撞击】';
  } else if (enemy.templateId === 'slime_boss' && enemy.hp > Math.floor(enemy.maxHp / 2)) {
    conditionalNote = `若生命降至 ${Math.floor(enemy.maxHp / 2)} 或以下，下回合改为【巨体分裂】`;
  } else if (enemy.templateId === 'lagavulin' && (enemy.statuses?.asleep ?? 0) > 0) {
    conditionalNote = '若本回合造成穿透格挡的生命伤害，将提前惊醒并眩晕 1 回合（跳过下次行动）';
  } else if (enemy.templateId === 'byrd' && (enemy.statuses?.flight ?? 0) > 0) {
    conditionalNote = `连续攻击命中 ${enemy.statuses.flight} 次即可击落【飞行】，使其本回合【眩晕】！`;
  } else if (enemy.templateId === 'snake_plant') {
    conditionalNote = `每次攻击都会触发【可塑护甲】（当前 +${enemy.statuses?.malleable ?? 3} 格挡且递增），重击或中毒更克制`;
  } else if (enemy.templateId === 'chosen') {
    conditionalNote = '中【妖术】后每打出技能或能力牌都会往抽牌堆洗入【晕眩】，优先集火速战速决！';
  } else if (enemy.templateId === 'shelled_parasite' && (enemy.statuses?.platedArmor ?? 0) > 0) {
    conditionalNote = `每次穿透格挡造成生命伤害会剥落 1 层【多层护甲】（剩 ${enemy.statuses.platedArmor} 层），归零时立即将其击晕 1 回合！`;
  } else if (enemy.templateId === 'snecko') {
    conditionalNote = '【混乱】会随机重设抽到卡牌的费用（0–3），高费大牌往往更占便宜！';
  } else if (enemy.templateId === 'darkling') {
    conditionalNote = '【生命链接】：须在 2 回合内同时击倒全部暗影虫，否则倒下者会恢复 50% 生命复活！';
  } else if (enemy.templateId === 'spire_growth') {
    conditionalNote = '【缠绕】会在你的回合结束造成可格挡伤害，务必留足护盾！';
  } else if (enemy.templateId === 'transient') {
    conditionalNote = `【游移】：每造成 1 点生命伤害即临时降低其 1 点力量！撑过剩余 ${enemy.statuses?.fading ?? 1} 回合即可自动获胜`;
  } else if (enemy.templateId === 'writhing_mass') {
    conditionalNote = '【应激反应】：每次攻击命中都会随机刷新本回合意图——看到危险重击或【寄生植入】时可用低费攻击牌刷走！';
  } else if (enemy.templateId === 'gremlin_leader') {
    conditionalNote = '优先清理【狂怒地精】爪牙可迫使其消耗回合吹响【集结号角】而非强化全队！';
  } else if (enemy.templateId === 'hexaghost' && enemy.turnIndex === 0) {
    conditionalNote = '【分裂烈焰】每段伤害 = max(2, ⌊你当前生命 ÷ 14⌋ + 1)（随当前生命动态变化）';
  } else if (enemy.templateId === 'the_champ' && (enemy.champPhase ?? 1) === 1 && enemy.hp > Math.floor(enemy.maxHp / 2)) {
    conditionalNote = `若生命降至 ${Math.floor(enemy.maxHp / 2)} 或以下，下回合将施放【狂暴怒吼】（清负面 +6力量）`;
  } else if (enemy.templateId === 'time_eater' && !enemy.hasteUsed && enemy.hp > Math.floor(enemy.maxHp / 2)) {
    conditionalNote = `注意【时间扭曲】（剩 ${enemy.statuses?.timeWarp ?? 12} 张牌）；半血以下将触发回血加速`;
  } else if (enemy.templateId === 'awakened_one' && enemy.unawakened) {
    conditionalNote = `首次击倒后将触发【黑暗重生】复活进入 ${enemy.maxHp} 生命二阶段形态！`;
  }

  let summaryText = '';
  if (candidates.length === 1) {
    const c = candidates[0];
    const shortVal = c.isAttack
      ? ` ${c.label}`
      : c.type.startsWith('defend')
        ? ` (${c.label})`
        : '';
    summaryText = `下回合：${c.name}${shortVal}`;
  } else {
    const parts = candidates.map((c) =>
      c.isAttack ? `${c.name}${c.label}(${c.pct}%)` : `${c.name}(${c.pct}%)`
    );
    summaryText = `下回合：${parts.join(' / ')}`;
  }

  const tooltipLines = candidates.map((c) => {
    const pctPrefix = candidates.length > 1 ? `[${c.pct}%] ` : '';
    return `• ${pctPrefix}${c.name}：${c.detail}`;
  });
  if (conditionalNote) {
    tooltipLines.push(`※ ${conditionalNote}`);
  }

  return {
    summaryText,
    tooltipLines,
    candidates,
    conditionalNote,
  };
}
