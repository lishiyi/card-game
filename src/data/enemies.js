import { nextRandom, randomInt } from '../engine/rng.js';

export const ENEMY_TEMPLATES = Object.freeze({
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
  the_guardian: {
    id: 'the_guardian',
    name: '尖塔守护者',
    role: 'boss',
    artKey: 'the_guardian',
    hpRange: [135, 135],
    initialStatuses: { modeShift: 25 },
  },
});

export const ENCOUNTERS = Object.freeze({
  floor1: [
    { id: 'cultist_solo', name: '狂热仪式', enemies: [{ templateId: 'cultist' }] },
    { id: 'jaw_worm_solo', name: '地底颚虫', enemies: [{ templateId: 'jaw_worm' }] },
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
      id: 'louse_and_cultist',
      name: '祭司与护卫虫',
      enemies: [{ templateId: 'red_louse' }, { templateId: 'cultist' }],
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
  ],
  boss: [
    {
      id: 'guardian_boss',
      name: '首领：尖塔守护者',
      enemies: [{ templateId: 'the_guardian' }],
    },
  ],
});

export function createEnemyInstance(state, spec) {
  const tpl = ENEMY_TEMPLATES[spec.templateId];
  if (!tpl) {
    throw new Error(`Unknown enemy templateId: ${spec.templateId}`);
  }
  state.nextUid = (state.nextUid ?? 1) + 1;
  const maxHp = randomInt(state, tpl.hpRange[0], tpl.hpRange[1]);

  const enemy = {
    id: `enemy_${state.nextUid}`,
    templateId: tpl.id,
    name: spec.customName || tpl.name,
    role: tpl.role,
    artKey: tpl.artKey,
    hp: maxHp,
    maxHp,
    block: 0,
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

export function rollEnemyIntent(state, enemy) {
  const roll = nextRandom(state);

  switch (enemy.templateId) {
    case 'cultist': {
      if (enemy.turnIndex === 0) {
        return {
          id: 'incantation',
          name: '暗影吟唱',
          type: 'buff',
          applySelfStatuses: { ritual: 3 },
          skipRitualThisTurn: true,
          summary: '意图：获得 3 层仪式（后续每回合结束 +3 力量）',
        };
      }
      return {
        id: 'dark_strike',
        name: '暗黑打击',
        type: 'attack',
        damage: 6,
        hits: 1,
      };
    }

    case 'jaw_worm': {
      if (enemy.turnIndex === 0) {
        return {
          id: 'chomp',
          name: '猛咬',
          type: 'attack',
          damage: 11,
          hits: 1,
        };
      }
      if (enemy.lastMoveId === 'bellow') {
        return roll < 0.55
          ? { id: 'thrash', name: '甩尾', type: 'attack_block', damage: 7, hits: 1, block: 5 }
          : { id: 'chomp', name: '猛咬', type: 'attack', damage: 11, hits: 1 };
      }
      if (roll < 0.35) {
        return {
          id: 'bellow',
          name: '咆哮',
          type: 'defend_buff',
          block: 6,
          applySelfStatuses: { strength: 3 },
          summary: '意图：获得 6 点格挡与 3 点力量',
        };
      }
      if (roll < 0.7) {
        return {
          id: 'thrash',
          name: '甩尾',
          type: 'attack_block',
          damage: 7,
          hits: 1,
          block: 5,
        };
      }
      return {
        id: 'chomp',
        name: '猛咬',
        type: 'attack',
        damage: 11,
        hits: 1,
      };
    }

    case 'red_louse': {
      if (enemy.lastMoveId !== 'grow' && roll < 0.3) {
        return {
          id: 'grow',
          name: '蓄力膨胀',
          type: 'buff',
          applySelfStatuses: { strength: 3 },
          summary: '意图：获得 3 点力量',
        };
      }
      return {
        id: 'bite',
        name: '啃咬',
        type: 'attack',
        damage: 6,
        hits: 1,
      };
    }

    case 'green_louse': {
      if (enemy.lastMoveId !== 'spit_web' && roll < 0.35) {
        return {
          id: 'spit_web',
          name: '粘性蛛网',
          type: 'debuff',
          applyPlayerStatuses: { weak: 2 },
          summary: '意图：给予玩家 2 层虚弱',
        };
      }
      return {
        id: 'bite',
        name: '啃咬',
        type: 'attack',
        damage: 6,
        hits: 1,
      };
    }

    case 'acid_slime': {
      if (enemy.turnIndex % 3 === 0) {
        return {
          id: 'corrosive_spit',
          name: '腐蚀喷吐',
          type: 'attack_debuff',
          damage: 7,
          hits: 1,
          addDiscardCards: [{ cardId: 'slimed', count: 1 }],
        };
      }
      if (enemy.turnIndex % 3 === 1) {
        return {
          id: 'lick',
          name: '酸液舔舐',
          type: 'debuff',
          applyPlayerStatuses: { weak: 1 },
          summary: '意图：给予玩家 1 层虚弱',
        };
      }
      return {
        id: 'tackle',
        name: '撞击',
        type: 'attack',
        damage: 10,
        hits: 1,
      };
    }

    case 'spike_slime': {
      if (enemy.turnIndex % 2 === 0) {
        return {
          id: 'flame_tackle',
          name: '尖刺冲撞',
          type: 'attack_debuff',
          damage: 8,
          hits: 1,
          addDiscardCards: [{ cardId: 'slimed', count: 1 }],
        };
      }
      return {
        id: 'lick_frail',
        name: '麻痹粘液',
        type: 'debuff',
        applyPlayerStatuses: { frail: 1 },
        summary: '意图：给予玩家 1 层脆弱',
      };
    }

    case 'gremlin_nob': {
      if (enemy.turnIndex === 0) {
        return {
          id: 'bellow_enrage',
          name: '暴怒战吼',
          type: 'buff',
          applySelfStatuses: { enrage: 2 },
          summary: '意图：获得 2 层激怒（你每打出一张技能牌，大块头 +2 力量）',
        };
      }
      if (enemy.turnIndex % 3 === 1) {
        return {
          id: 'skull_bash',
          name: '碎颅头槌',
          type: 'attack_debuff',
          damage: 6,
          hits: 1,
          applyPlayerStatuses: { vulnerable: 2 },
        };
      }
      return {
        id: 'rush',
        name: '蛮力猛冲',
        type: 'attack',
        damage: 14,
        hits: 1,
      };
    }

    case 'sentry': {
      const parity = (enemy.turnIndex + (enemy.variantIndex ?? 0)) % 2;
      if (parity === 0) {
        return {
          id: 'bolt',
          name: '能量干扰',
          type: 'debuff',
          addDiscardCards: [{ cardId: 'dazed', count: 2 }],
          summary: '意图：将 2 张【晕眩】洗入你的弃牌堆',
        };
      }
      return {
        id: 'beam',
        name: '聚能光束',
        type: 'attack',
        damage: 9,
        hits: 1,
      };
    }

    case 'the_guardian': {
      if (enemy.mode === 'defensive') {
        return getGuardianDefensiveIntent(enemy.defensiveStep);
      }
      return getGuardianOffensiveIntent(enemy.offensiveStep);
    }

    default:
      return {
        id: 'basic_hit',
        name: '攻击',
        type: 'attack',
        damage: 6,
        hits: 1,
      };
  }
}
