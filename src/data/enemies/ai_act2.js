// Act 2 enemy intent AI handlers.
import { GREMLIN_POOL } from './templates.js';

export const ACT2_ENEMY_AI_HANDLERS = {
  centurion(enemy, player, combat) {
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
  },

  mystic(enemy, player, combat) {
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
  },

  book_of_stabbing(enemy, player, combat) {
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
  },

  slaver_taskmaster(enemy, player, combat) {
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
  },

  byrd(enemy, player, combat) {
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
  },

  spheric_guardian(enemy, player, combat) {
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
  },

  snake_plant(enemy, player, combat) {
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
  },

  gremlin_leader(enemy, player, combat) {
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
              summonMinions: GREMLIN_POOL,
              summonCount: 2,
              summonMax: 2,
              summary: '意图：吹响号角，随机召唤 2 名【地精】爪牙增援！',
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
            summonMinions: GREMLIN_POOL,
            summonCount: 2,
            summonMax: 2,
            summary: '意图：吹响号角，随机召唤 2 名【地精】爪牙增援！',
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
          summonMinions: GREMLIN_POOL,
          summonCount: 2,
          summonMax: 2,
          summary: '意图：吹响号角，随机补齐至多 2 名【地精】爪牙增援！',
        },
      });
    }
    const filtered = pool.filter((x) => x.intent.id !== enemy.lastMoveId);
    const activePool = filtered.length > 0 ? filtered : pool;
    const total = activePool.reduce((s, x) => s + x.weight, 0) || 1;
    return activePool.map((x) => ({ probability: x.weight / total, intent: x.intent }));
  },

  bronze_automaton(enemy, player, combat) {
    if (enemy.turnIndex === 0) {
      return [
        {
          probability: 1,
          intent: {
            id: 'spawn_orbs',
            name: '部署青铜球',
            type: 'buff',
            summonMinions: 'bronze_orb',
            summonCount: 2,
            summonMax: 2,
            summary: '意图：部署 2 台【青铜球】爪牙（会封印你的高稀有度卡牌并为首领提供格挡）！',
          },
        },
      ];
    }
    const step = (enemy.turnIndex - 1) % 6;
    if (step === 0 || step === 2) {
      return [
        {
          probability: 1,
          intent: {
            id: 'flail_beams',
            name: '双联连枷',
            type: 'attack',
            damage: 7,
            hits: 2,
          },
        },
      ];
    }
    if (step === 1 || step === 3) {
      return [
        {
          probability: 1,
          intent: {
            id: 'boost_core',
            name: '齿轮超频',
            type: 'defend_buff',
            block: 9,
            applySelfStatuses: { strength: 3 },
            summary: '意图：获得 9 点格挡与 3 点力量',
          },
        },
      ];
    }
    if (step === 4) {
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
    if ((enemy.ascension ?? 0) >= 9) {
      return [
        {
          probability: 1,
          intent: {
            id: 'boost_core',
            name: '齿轮超频',
            type: 'defend_buff',
            block: 9,
            applySelfStatuses: { strength: 3 },
            summary: '意图：进阶核心无冷却——获得 9 点格挡与 3 点力量！',
          },
        },
      ];
    }
    return [
      {
        probability: 1,
        intent: {
          id: 'automaton_stunned',
          name: '过载冷却',
          type: 'sleep',
          summary: '意图：发射超能光束后核心过载冷却，本回合无法行动！',
        },
      },
    ];
  },

  bronze_orb(enemy, player, combat) {
    if (!enemy.stasisUsed) {
      return [
        {
          probability: 0.75,
          intent: {
            id: 'orb_stasis',
            name: '静止力场',
            type: 'debuff',
            stasisSteal: true,
            summary: '意图：释放【静止力场】，封印你抽牌堆或弃牌堆中稀有度最高的一张牌（摧毁该青铜球后归还）！',
          },
        },
        {
          probability: 0.15,
          intent: {
            id: 'orb_support',
            name: '支援光束',
            type: 'defend',
            block: 8,
            supportBossBlock: true,
            summary: '意图：发射支援光束，为首领提供 8 点格挡',
          },
        },
        {
          probability: 0.1,
          intent: {
            id: 'orb_beam',
            name: '能量光束',
            type: 'attack',
            damage: 7,
            hits: 1,
          },
        },
      ];
    }
    if (enemy.lastMoveId === 'orb_beam') {
      return [
        {
          probability: 0.7,
          intent: {
            id: 'orb_support',
            name: '支援光束',
            type: 'defend',
            block: 8,
            supportBossBlock: true,
            summary: '意图：发射支援光束，为首领提供 8 点格挡',
          },
        },
        {
          probability: 0.3,
          intent: { id: 'orb_beam', name: '能量光束', type: 'attack', damage: 7, hits: 1 },
        },
      ];
    }
    return [
      {
        probability: 0.55,
        intent: {
          id: 'orb_support',
          name: '支援光束',
          type: 'defend',
          block: 8,
          supportBossBlock: true,
          summary: '意图：发射支援光束，为首领提供 8 点格挡',
        },
      },
      {
        probability: 0.45,
        intent: { id: 'orb_beam', name: '能量光束', type: 'attack', damage: 7, hits: 1 },
      },
    ];
  },

  the_collector(enemy, player, combat) {
    if (enemy.turnIndex === 0) {
      return [
        {
          probability: 1,
          intent: {
            id: 'collector_spawn',
            name: '召唤火炬头',
            type: 'buff',
            summonMinions: 'torch_head',
            summonCount: 2,
            summonMax: 2,
            summary: '意图：从冥火王座召唤 2 名【火炬头】爪牙！',
          },
        },
      ];
    }
    if (enemy.turnIndex === 3) {
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
    const aliveMinions = combat?.enemies
      ? combat.enemies.filter((e) => e.hp > 0 && e.id !== enemy.id).length
      : 2;
    const pool = [
      {
        weight: 0.45,
        intent: {
          id: 'fireball_col',
          name: '冥翠火球',
          type: 'attack',
          damage: 16,
          hits: 1,
        },
      },
      {
        weight: 0.3,
        intent: {
          id: 'emerald_ward',
          name: '翠焰王座',
          type: 'defend_buff',
          block: 12,
          applyAllEnemiesStatuses: { strength: 3 },
          summary: '意图：获得 12 点格挡，并使全体敌方获得 3 点【力量】！',
        },
      },
    ];
    if (aliveMinions < 2) {
      pool.push({
        weight: 0.25,
        intent: {
          id: 'collector_spawn',
          name: '召唤火炬头',
          type: 'buff',
          summonMinions: 'torch_head',
          summonCount: 2,
          summonMax: 2,
          summary: '意图：补齐至多 2 名【火炬头】爪牙！',
        },
      });
    }
    const filtered = pool.filter(
      (x) => !(x.intent.id === enemy.lastMoveId && x.intent.id !== 'fireball_col')
    );
    const activePool = filtered.length > 0 ? filtered : pool;
    const total = activePool.reduce((s, x) => s + x.weight, 0) || 1;
    return activePool.map((x) => ({ probability: x.weight / total, intent: x.intent }));
  },

  torch_head(enemy, player, combat) {
    return [
      {
        probability: 1,
        intent: {
          id: 'torch_tackle',
          name: '冥火冲撞',
          type: 'attack',
          damage: 7,
          hits: 1,
        },
      },
    ];
  },

  bandit_pointy(enemy, player, combat) {
    return [
      {
        probability: 1,
        intent: {
          id: 'pointy_stab',
          name: '双匕乱刺',
          type: 'attack',
          damage: 5,
          hits: 2,
        },
      },
    ];
  },

  bandit_romeo(enemy, player, combat) {
    if (enemy.turnIndex === 0) {
      return [
        {
          probability: 1,
          intent: {
            id: 'romeo_mock',
            name: '轻佻嘲弄',
            type: 'buff',
            summary: '意图：傲慢挑衅（“熊，上！”），本回合不造成伤害',
          },
        },
      ];
    }
    if (enemy.turnIndex % 2 === 1) {
      return [
        {
          probability: 1,
          intent: {
            id: 'agonizing_slash',
            name: '剧痛挥砍',
            type: 'attack_debuff',
            damage: 10,
            hits: 1,
            applyPlayerStatuses: { weak: 2 },
          },
        },
      ];
    }
    return [
      {
        probability: 1,
        intent: {
          id: 'cross_slash',
          name: '十字交叉斩',
          type: 'attack',
          damage: 15,
          hits: 1,
        },
      },
    ];
  },

  bandit_bear(enemy, player, combat) {
    if (enemy.turnIndex === 0) {
      return [
        {
          probability: 1,
          intent: {
            id: 'bear_hug',
            name: '熊抱窒息',
            type: 'debuff',
            applyPlayerStatuses: { dexterity: -2 },
            summary: '意图：凶猛熊抱，使你本场战斗永久失去 2 点【敏捷】！',
          },
        },
      ];
    }
    if (enemy.turnIndex % 2 === 1) {
      return [
        {
          probability: 1,
          intent: {
            id: 'bear_lunge',
            name: '重拳猛扑',
            type: 'attack_block',
            damage: 9,
            hits: 1,
            block: 9,
          },
        },
      ];
    }
    return [
      {
        probability: 1,
        intent: {
          id: 'bear_maul',
          name: '铁掌拍击',
          type: 'attack',
          damage: 18,
          hits: 1,
        },
      },
    ];
  },

  the_champ(enemy, player, combat) {
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
  },

  chosen(enemy, player, combat) {
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
  },

  shelled_parasite(enemy, player, combat) {
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
  },

  snecko(enemy, player, combat) {
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
  },
};
