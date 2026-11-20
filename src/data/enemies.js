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
    hpRange: [19, 23],
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
    initialStatuses: { metallicize: 5 },
  },

  // === Act 1 Bosses (3 Random Bosses) ===
  the_guardian: {
    id: 'the_guardian',
    name: '尖塔守护者',
    role: 'boss',
    artKey: 'the_guardian',
    hpRange: [155, 155],
    initialStatuses: { modeShift: 25 },
  },
  hexaghost: {
    id: 'hexaghost',
    name: '六火亡魂',
    role: 'boss',
    artKey: 'hexaghost',
    hpRange: [160, 160],
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
    hpRange: [64, 70],
    initialStatuses: {},
  },
  mystic: {
    id: 'mystic',
    name: '秘术祭司',
    role: 'normal',
    artKey: 'mystic',
    hpRange: [44, 50],
    initialStatuses: {},
  },
  book_of_stabbing: {
    id: 'book_of_stabbing',
    name: '刺击魔典',
    role: 'elite',
    artKey: 'book_of_stabbing',
    hpRange: [112, 118],
    initialStatuses: {},
  },
  slaver_taskmaster: {
    id: 'slaver_taskmaster',
    name: '督军领主',
    role: 'elite',
    artKey: 'slaver_taskmaster',
    hpRange: [62, 66],
    initialStatuses: {},
  },
  bronze_automaton: {
    id: 'bronze_automaton',
    name: '青铜自动机',
    role: 'boss',
    artKey: 'bronze_automaton',
    hpRange: [215, 215],
    initialStatuses: { metallicize: 4 },
  },
  the_collector: {
    id: 'the_collector',
    name: '暗影收藏家',
    role: 'boss',
    artKey: 'the_collector',
    hpRange: [205, 205],
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
      enemies: [{ templateId: 'acid_slime' }, { templateId: 'spike_slime' }],
    },
    {
      id: 'fungi_pair',
      name: '毒孢菌丛',
      enemies: [{ templateId: 'fungi_beast' }, { templateId: 'fungi_beast' }],
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
      id: 'gremlin_pack',
      name: '地精袭扰小队',
      enemies: [
        { templateId: 'mad_gremlin' },
        { templateId: 'mad_gremlin' },
        { templateId: 'green_louse' },
      ],
    },
  ],
  hardNormal: [
    {
      id: 'louse_and_cultist',
      name: '祭司与护卫虫',
      enemies: [{ templateId: 'red_louse' }, { templateId: 'cultist' }],
    },
    {
      id: 'fungi_and_slaver',
      name: '菌兽与奴隶贩',
      enemies: [{ templateId: 'fungi_beast' }, { templateId: 'slaver_blue' }],
    },
    {
      id: 'looter_and_gremlin',
      name: '劫匪与狂怒地精',
      enemies: [{ templateId: 'looter' }, { templateId: 'mad_gremlin' }],
    },
    {
      id: 'jaw_worm_and_slime',
      name: '地底共生体',
      enemies: [{ templateId: 'jaw_worm' }, { templateId: 'spike_slime' }],
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
      id: 'mystic_and_looter',
      name: '暗巷秘教',
      enemies: [{ templateId: 'mystic' }, { templateId: 'looter' }],
    },
    {
      id: 'act2_fungi_pack',
      name: '变异菌群',
      enemies: [
        { templateId: 'fungi_beast' },
        { templateId: 'fungi_beast' },
        { templateId: 'spike_slime' },
      ],
    },
  ],
  act2Hard: [
    {
      id: 'centurion_and_mystic',
      name: '百夫长与秘术师',
      enemies: [{ templateId: 'centurion' }, { templateId: 'mystic' }],
    },
    {
      id: 'twin_slavers',
      name: '双煞捕奴队',
      enemies: [{ templateId: 'slaver_blue' }, { templateId: 'slaver_blue' }],
    },
    {
      id: 'cultist_and_centurion',
      name: '狂热圣殿卫',
      enemies: [{ templateId: 'cultist' }, { templateId: 'centurion' }],
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
      id: 'tri_sentries_elite',
      name: '精英：三连远古哨卫',
      enemies: [
        { templateId: 'sentry', variantIndex: 0 },
        { templateId: 'sentry', variantIndex: 1 },
        { templateId: 'sentry', variantIndex: 0 },
      ],
    },
  ],
  act2Boss: [
    {
      id: 'automaton_boss',
      name: '终幕首领：青铜自动机',
      enemies: [{ templateId: 'bronze_automaton' }],
    },
    {
      id: 'collector_boss',
      name: '终幕首领：暗影收藏家',
      enemies: [{ templateId: 'the_collector' }],
    },
  ],
});

function applyAscensionIntentScaling(state, enemy, intent) {
  if (!intent || typeof intent.damage !== 'number') return intent;
  const asc = state?.ascension ?? 0;
  let bonus = 0;
  if (asc >= 2 && enemy.role === 'normal') {
    bonus += 1;
  }
  if (asc >= 3 && (enemy.role === 'elite' || enemy.role === 'boss')) {
    bonus += 2;
  }
  if (bonus === 0) return intent;
  return {
    ...intent,
    damage: intent.damage + bonus,
  };
}

export function createEnemyInstance(state, spec) {
  const tpl = ENEMY_TEMPLATES[spec.templateId];
  if (!tpl) {
    throw new Error(`Unknown enemy templateId: ${spec.templateId}`);
  }
  state.nextUid = (state.nextUid ?? 1) + 1;

  let maxHp =
    typeof spec.customHp === 'number'
      ? Math.max(1, Math.floor(spec.customHp))
      : randomInt(state, tpl.hpRange[0], tpl.hpRange[1]);

  if (typeof spec.customHp !== 'number') {
    const asc = state?.ascension ?? 0;
    if (asc >= 2 && tpl.role === 'normal') {
      maxHp = Math.round(maxHp * 1.12);
    } else if (asc >= 3 && (tpl.role === 'elite' || tpl.role === 'boss')) {
      maxHp = Math.round(maxHp * 1.15);
    }
    if (hasDailyModifier(state, 'cursed_run')) {
      maxHp = Math.round(maxHp * 1.12);
    }
  }

  const initialBlock = tpl.initialStatuses?.metallicize ? tpl.initialStatuses.metallicize : 0;

  const enemy = {
    id: `enemy_${state.nextUid}`,
    templateId: tpl.id,
    name: spec.customName || tpl.name,
    role: spec.customRole || tpl.role,
    artKey: tpl.artKey,
    ascension: state?.ascension ?? 0,
    hp: maxHp,
    maxHp,
    block: initialBlock,
    statuses: { ...tpl.initialStatuses },
    skipStatusTick: {},
    skipRitualThisTurn: false,
    turnIndex: 0,
    lastMoveId: null,
    variantIndex: spec.variantIndex ?? 0,
    mode: tpl.id === 'the_guardian' ? 'offensive' : 'normal',
    modeShiftMax: tpl.id === 'the_guardian' ? 25 : 0,
    offensiveStep: 0,
    defensiveStep: 0,
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
      damage: 9,
      hits: 1,
    };
  }
  return {
    id: 'twin_slam',
    name: '双刃猛击',
    type: 'attack_buff',
    damage: 8,
    hits: 2,
    exitDefensiveMode: true,
    summary: '意图：造成 8×2 点伤害，解除锋利外壳并切回进攻形态',
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
        block: 9,
      };
    case 1:
      return {
        id: 'fierce_bash',
        name: '凶猛重击',
        type: 'attack',
        damage: 26,
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
        damage: 5,
        hits: 4,
      };
  }
}

export function getEnemyIntentCandidates(enemy) {
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
      if (enemy.turnIndex === 0) {
        return [
          {
            probability: 1,
            intent: { id: 'shell_awaken', name: '甲壳苏醒', type: 'defend', block: 8 },
          },
        ];
      }
      if ((enemy.turnIndex - 1) % 3 === 2) {
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
          intent: { id: 'claw_crush', name: '巨螯重击', type: 'attack', damage: 16, hits: 1 },
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
              block: 6,
              summary: '意图：点燃六团鬼火并获得 6 点格挡，下回合释放六段烈焰连击！',
            },
          },
        ];
      }
      if (enemy.turnIndex === 1) {
        return [
          {
            probability: 1,
            intent: {
              id: 'divider',
              name: '分裂烈焰',
              type: 'attack',
              damage: 4,
              hits: 6,
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
              damage: 6,
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
              damage: 5,
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
              block: 10,
              applySelfStatuses: { strength: 2 },
              summary: '意图：获得 10 点格挡与 2 点力量',
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
            damage: 3,
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
              damage: 9,
              hits: 1,
              block: 10,
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
              damage: 15,
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
            damage: 7,
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
              damage: 11,
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
            block: 10,
            applySelfStatuses: { strength: 3 },
            summary: '意图：获得 10 点格挡与 3 点力量',
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
              type: 'attack_debuff',
              damage: 18,
              hits: 1,
              applyPlayerStatuses: { vulnerable: 2 },
            },
          },
        ];
      }
      const stabs = 2 + (enemy.turnIndex % 3);
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
              addDiscardCards: [{ cardId: 'dazed', count: 2 }],
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
              block: 12,
              applySelfStatuses: { strength: 3 },
              summary: '意图：获得 12 点格挡与 3 点力量',
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
              damage: 8,
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
              block: 14,
              summary: '意图：获得 14 点格挡，下回合发射毁灭性的【超能光束】！',
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
            damage: 38,
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
              block: 14,
              applySelfStatuses: { strength: 3 },
              summary: '意图：获得 14 点格挡与 3 点力量',
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
              damage: 16,
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
            damage: 8,
            hits: 3,
          },
        },
      ];
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

export function rollEnemyIntent(state, enemy) {
  const roll = nextRandom(state);
  const candidates = getEnemyIntentCandidates(enemy);
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

export function predictNextTurnIntents(enemy, player = null, ascensionOverride = undefined) {
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

  const simEnemy = {
    ...enemy,
    ascension: asc,
    statuses: simEnemyStatuses,
    turnIndex: (enemy.turnIndex ?? 0) + 1,
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

  const rawCandidates = getEnemyIntentCandidates(simEnemy);
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
