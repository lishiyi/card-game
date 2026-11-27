// Act 1 enemy intent AI handlers and Guardian mode-shift cycle helpers.

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

export const ACT1_ENEMY_AI_HANDLERS = {
  cultist(enemy, player, combat) {
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
  },

  jaw_worm(enemy, player, combat) {
    if (enemy.turnIndex === 0 && !enemy.hordeMode) {
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
  },

  red_louse(enemy, player, combat) {
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
  },

  green_louse(enemy, player, combat) {
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
  },

  acid_slime_l(enemy, player, combat) {
    if (
      enemy.hp > 0 &&
      enemy.hp <= Math.floor(enemy.maxHp / 2) &&
      (enemy.statuses?.splitThreshold ?? 0) > 0
    ) {
      return [
        {
          probability: 1,
          intent: {
            id: 'split',
            name: '酸液分裂',
            type: 'buff',
            splitInto: ['acid_slime', 'acid_slime'],
            summary: '意图：分裂为 2 只中型酸液史莱姆（各自继承当前生命值）',
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
            id: 'corrosive_spit_l',
            name: '剧酸喷吐',
            type: 'attack_debuff',
            damage: 11,
            hits: 1,
            addDiscardCards: [{ cardId: 'slimed', count: 2 }],
          },
        },
      ];
    }
    if (step === 1) {
      return [
        {
          probability: 1,
          intent: {
            id: 'lick_l',
            name: '强酸舔舐',
            type: 'debuff',
            applyPlayerStatuses: { weak: 2 },
            summary: '意图：给予玩家 2 层虚弱',
          },
        },
      ];
    }
    return [
      {
        probability: 1,
        intent: { id: 'tackle_l', name: '巨体撞击', type: 'attack', damage: 16, hits: 1 },
      },
    ];
  },

  acid_slime(enemy, player, combat) {
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
  },

  acid_slime_s(enemy, player, combat) {
    if (enemy.turnIndex % 2 === 0) {
      return [
        {
          probability: 1,
          intent: {
            id: 'lick_s',
            name: '酸液轻舔',
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
        intent: { id: 'tackle_s', name: '轻撞', type: 'attack', damage: 3, hits: 1 },
      },
    ];
  },

  spike_slime_l(enemy, player, combat) {
    if (
      enemy.hp > 0 &&
      enemy.hp <= Math.floor(enemy.maxHp / 2) &&
      (enemy.statuses?.splitThreshold ?? 0) > 0
    ) {
      return [
        {
          probability: 1,
          intent: {
            id: 'split',
            name: '尖刺分裂',
            type: 'buff',
            splitInto: ['spike_slime', 'spike_slime'],
            summary: '意图：分裂为 2 只中型尖刺史莱姆（各自继承当前生命值）',
          },
        },
      ];
    }
    if (enemy.turnIndex % 2 === 0) {
      return [
        {
          probability: 1,
          intent: {
            id: 'flame_tackle_l',
            name: '巨刺冲撞',
            type: 'attack_debuff',
            damage: 16,
            hits: 1,
            addDiscardCards: [{ cardId: 'slimed', count: 2 }],
          },
        },
      ];
    }
    return [
      {
        probability: 1,
        intent: {
          id: 'lick_frail_l',
          name: '麻痹重液',
          type: 'debuff',
          applyPlayerStatuses: { frail: 2 },
          summary: '意图：给予玩家 2 层脆弱',
        },
      },
    ];
  },

  spike_slime(enemy, player, combat) {
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
  },

  spike_slime_s(enemy, player, combat) {
    return [
      {
        probability: 1,
        intent: { id: 'spike_tackle_s', name: '尖刺突撞', type: 'attack', damage: 5, hits: 1 },
      },
    ];
  },

  fungi_beast(enemy, player, combat) {
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
  },

  slaver_blue(enemy, player, combat) {
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
  },

  slaver_red(enemy, player, combat) {
    if (enemy.turnIndex === 0) {
      return [
        {
          probability: 1,
          intent: { id: 'stab_red', name: '三叉戟刺击', type: 'attack', damage: 13, hits: 1 },
        },
      ];
    }
    if (!enemy.entangleUsed) {
      const pool = [
        {
          weight: 0.25,
          intent: {
            id: 'entangle',
            name: '投网缠缚',
            type: 'debuff',
            applyPlayerStatuses: { entangled: 1 },
            markEntangleUsed: true,
            summary: '意图：抛出铁网施加【缠网】（下回合无法打出任何攻击牌）！',
          },
        },
        {
          weight: enemy.lastMoveId === 'scrape' ? 0.2 : 0.45,
          intent: {
            id: 'scrape',
            name: '倒钩撕裂',
            type: 'attack_debuff',
            damage: 8,
            hits: 1,
            applyPlayerStatuses: { vulnerable: 1 },
          },
        },
        {
          weight: enemy.lastMoveId === 'stab_red' ? 0.25 : 0.3,
          intent: { id: 'stab_red', name: '三叉戟刺击', type: 'attack', damage: 13, hits: 1 },
        },
      ];
      const total = pool.reduce((s, x) => s + x.weight, 0) || 1;
      return pool.map((x) => ({ probability: x.weight / total, intent: x.intent }));
    }
    if (enemy.lastMoveId !== 'scrape') {
      return [
        {
          probability: 0.55,
          intent: {
            id: 'scrape',
            name: '倒钩撕裂',
            type: 'attack_debuff',
            damage: 8,
            hits: 1,
            applyPlayerStatuses: { vulnerable: 1 },
          },
        },
        {
          probability: 0.45,
          intent: { id: 'stab_red', name: '三叉戟刺击', type: 'attack', damage: 13, hits: 1 },
        },
      ];
    }
    return [
      {
        probability: 1,
        intent: { id: 'stab_red', name: '三叉戟刺击', type: 'attack', damage: 13, hits: 1 },
      },
    ];
  },

  looter(enemy, player, combat) {
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
  },

  mad_gremlin(enemy, player, combat) {
    return [
      {
        probability: 1,
        intent: { id: 'scratch', name: '疯狂抓挠', type: 'attack', damage: 5, hits: 1 },
      },
    ];
  },

  fat_gremlin(enemy, player, combat) {
    const asc = enemy.ascension ?? 0;
    const debuffs = asc >= 9 ? { weak: 1, frail: 1 } : { weak: 1 };
    return [
      {
        probability: 1,
        intent: {
          id: 'fat_smash',
          name: '沉重拍击',
          type: 'attack_debuff',
          damage: 4,
          hits: 1,
          applyPlayerStatuses: debuffs,
        },
      },
    ];
  },

  shield_gremlin(enemy, player, combat) {
    const aliveAllies = combat?.enemies
      ? combat.enemies.filter((e) => e.hp > 0 && e.id !== enemy.id).length
      : 1;
    if (aliveAllies > 0) {
      return [
        {
          probability: 1,
          intent: {
            id: 'gremlin_protect',
            name: '举盾护卫',
            type: 'defend',
            block: 7,
            protectRandomAlly: true,
            summary: '意图：举起圆盾，为一名随机存活友方施加 7 点格挡',
          },
        },
      ];
    }
    return [
      {
        probability: 1,
        intent: { id: 'shield_bash', name: '盾牌猛击', type: 'attack', damage: 6, hits: 1 },
      },
    ];
  },

  sneaky_gremlin(enemy, player, combat) {
    return [
      {
        probability: 1,
        intent: { id: 'puncture', name: '卑劣偷袭', type: 'attack', damage: 9, hits: 1 },
      },
    ];
  },

  gremlin_wizard(enemy, player, combat) {
    const chargeStep = enemy.turnIndex % 3;
    if (chargeStep === 0) {
      return [
        {
          probability: 1,
          intent: {
            id: 'wizard_charge_1',
            name: '聚能吟唱',
            type: 'buff',
            summary: '意图：正在聚能蓄力（1/2），2 回合后将释放高伤【终极冲击波】！',
          },
        },
      ];
    }
    if (chargeStep === 1) {
      const blastDmg = 25 + ((enemy.ascension ?? 0) >= 2 ? 1 : 0);
      return [
        {
          probability: 1,
          intent: {
            id: 'wizard_charge_2',
            name: '魔力满溢',
            type: 'buff',
            summary: `意图：蓄力即将完成（2/2），下回合将释放【终极冲击波】（${blastDmg} 点伤害）！`,
          },
        },
      ];
    }
    return [
      {
        probability: 1,
        intent: {
          id: 'ultimate_blast',
          name: '终极冲击波',
          type: 'attack',
          damage: 25,
          hits: 1,
        },
      },
    ];
  },

  gremlin_nob(enemy, player, combat) {
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
      const vulnAmt = (enemy.ascension ?? 0) >= 9 ? 2 : 1;
      return [
        {
          probability: 1,
          intent: {
            id: 'skull_bash',
            name: '碎颅头槌',
            type: 'attack_debuff',
            damage: 6,
            hits: 1,
            applyPlayerStatuses: { vulnerable: vulnAmt },
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
  },

  sentry(enemy, player, combat) {
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
  },

  lagavulin(enemy, player, combat) {
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
  },

  the_guardian(enemy, player, combat) {
    return [
      {
        probability: 1,
        intent:
          enemy.mode === 'defensive'
            ? getGuardianDefensiveIntent(enemy.defensiveStep)
            : getGuardianOffensiveIntent(enemy.offensiveStep),
      },
    ];
  },

  hexaghost(enemy, player, combat) {
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
  },

  slime_boss(enemy, player, combat) {
    if (enemy.hp > 0 && enemy.hp <= Math.floor(enemy.maxHp / 2)) {
      return [
        {
          probability: 1,
          intent: {
            id: 'split',
            name: '巨体分裂',
            type: 'buff',
            splitInto: ['acid_slime_l', 'spike_slime_l'],
            summary: '意图：分裂为大型酸液史莱姆与大型尖刺史莱姆（各自继承当前生命值）',
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
            type: 'buff',
            summary: '意图：正在蓄力凝聚，下回合发动泰山压顶！',
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
          damage: 26,
          hits: 1,
        },
      },
    ];
  },
};
