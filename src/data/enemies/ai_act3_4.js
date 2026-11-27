// Act 3 & Act 4 enemy intent AI handlers.

export const ACT3_4_ENEMY_AI_HANDLERS = {
  orb_walker(enemy, player, combat) {
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
  },

  spiker(enemy, player, combat) {
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
  },

  exploder(enemy, player, combat) {
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
            isNonAttack: true,
            skipGenericAscScaling: true,
            selfDestruct: true,
            summary: '意图：引爆能量核心，造成 30 点固定爆炸伤害后自我毁灭！',
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
  },

  repulsor(enemy, player, combat) {
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
  },

  maw(enemy, player, combat) {
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
  },

  giant_head(enemy, player, combat) {
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
  },

  nemesis(enemy, player, combat) {
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
  },

  reptomancer(enemy, player, combat) {
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
  },

  dagger(enemy, player, combat) {
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
  },

  time_eater(enemy, player, combat) {
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
  },

  awakened_one(enemy, player, combat) {
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
            addDrawCards: [{ cardId: 'void', count: 1 }],
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
  },

  donu(enemy, player, combat) {
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
  },

  deca(enemy, player, combat) {
    if (enemy.turnIndex % 2 === 0) {
      return [
        {
          probability: 1,
          intent: {
            id: 'deca_beam',
            name: '脉冲双击',
            type: 'attack',
            damage: 9,
            hits: 2,
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
          type: 'defend_debuff',
          allEnemiesBlock: 14,
          block: 14,
          addDiscardCards: [{ cardId: 'dazed', count: 2 }],
          summary: '意图：使全体友方单位获得 14 点格挡，并将 2 张【晕眩】洗入你的弃牌堆！',
        },
      },
    ];
  },

  darkling(enemy, player, combat) {
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
  },

  spire_growth(enemy, player, combat) {
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
  },

  transient(enemy, player, combat) {
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
  },

  writhing_mass(enemy, player, combat) {
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
    const filtered = enemy.lastMoveId
      ? pool.filter((item) => item.intent.id !== enemy.lastMoveId)
      : pool;
    const activePool = filtered.length > 0 ? filtered : pool;
    const totalProb = activePool.reduce((sum, item) => sum + item.probability, 0);
    return activePool.map((item) => ({
      ...item,
      probability: Number((item.probability / totalProb).toFixed(6)),
    }));
  },

  spire_shield(enemy, player, combat) {
    const cyclePos = (enemy.turnIndex ?? 0) % 3;
    const targetsFocus = (player?.maxOrbSlots ?? 0) > 0;
    const bashIntent = {
      id: 'shield_bash',
      name: '重盾猛击',
      type: 'attack_debuff',
      damage: 12,
      hits: 1,
      applyPlayerStatuses: targetsFocus ? { focus: -1 } : { strength: -1 },
      summary: targetsFocus
        ? '意图：造成 12 点伤害，并使你永久失去 1 点【集中】'
        : '意图：造成 12 点伤害，并使你永久失去 1 点【力量】',
    };
    const fortifyIntent = {
      id: 'shield_fortify',
      name: '加固壁垒',
      type: 'defend',
      block: 30,
      allEnemiesBlock: 30,
      summary: '意图：为全体敌方单位施加 30 点格挡',
    };
    const smashIntent = {
      id: 'shield_smash',
      name: '铁壁重压',
      type: 'attack_block',
      damage: 34,
      hits: 1,
      block: 34,
      summary: '意图：造成 34 点重击伤害，并获得 34 点格挡',
    };
    if (cyclePos === 0) {
      return [
        { probability: 0.5, intent: bashIntent },
        { probability: 0.5, intent: fortifyIntent },
      ];
    }
    if (cyclePos === 1) {
      return [
        {
          probability: 1,
          intent: enemy.lastMoveId === 'shield_bash' ? fortifyIntent : bashIntent,
        },
      ];
    }
    return [{ probability: 1, intent: smashIntent }];
  },

  spire_spear(enemy, player, combat) {
    const turn = enemy.turnIndex ?? 0;
    const asc = enemy.ascension ?? 0;
    const burnToDraw = asc >= 9;
    const burnStrikeIntent = burnToDraw
      ? {
          id: 'spear_burn_strike',
          name: '灼烧突刺',
          type: 'attack_debuff',
          damage: 6,
          hits: 2,
          skipGenericAscScaling: true,
          addDrawCards: [{ cardId: 'burn', count: 2 }],
          summary: '意图：造成 6×2 点伤害，并将 2 张【灼伤】洗入你的抽牌堆（高阶强化）',
        }
      : {
          id: 'spear_burn_strike',
          name: '灼烧突刺',
          type: 'attack_debuff',
          damage: 5,
          hits: 2,
          addDiscardCards: [{ cardId: 'burn', count: 2 }],
          summary: '意图：造成 5×2 点伤害，并将 2 张【灼伤】塞入你的弃牌堆',
        };
    const skewerIntent = {
      id: 'spear_skewer',
      name: '穿刺连击',
      type: 'attack',
      damage: 10,
      hits: 3,
      summary: '意图：发动 10×3 连续穿刺攻击',
    };
    const piercerIntent = {
      id: 'spear_piercer',
      name: '破阵号令',
      type: 'buff',
      applyAllEnemiesStatuses: { strength: 2 },
      summary: '意图：使全体敌方单位获得 2 点【力量】',
    };
    if (turn === 0) {
      return [{ probability: 1, intent: burnStrikeIntent }];
    }
    if (turn === 1) {
      return [{ probability: 1, intent: skewerIntent }];
    }
    const cyclePos = (turn - 2) % 3;
    if (cyclePos === 0) {
      return [{ probability: 1, intent: piercerIntent }];
    }
    if (cyclePos === 1) {
      return [{ probability: 1, intent: burnStrikeIntent }];
    }
    return [{ probability: 1, intent: skewerIntent }];
  },

  corrupt_heart(enemy, player, combat) {
    const turn = enemy.turnIndex ?? 0;
    const asc = enemy.ascension ?? 0;
    if (turn === 0) {
      return [
        {
          probability: 1,
          intent: {
            id: 'heart_debilitate',
            name: '衰弱诅咒',
            type: 'debuff',
            applyPlayerStatuses: { vulnerable: 2, weak: 2, frail: 2 },
            addDrawCards: [
              { cardId: 'dazed', count: 1 },
              { cardId: 'slimed', count: 1 },
              { cardId: 'wound', count: 1 },
              { cardId: 'burn', count: 1 },
              { cardId: 'void', count: 1 },
            ],
            summary:
              '意图：施加 2 层【易伤】、【虚弱】、【脆弱】，并将【晕眩】【黏液】【伤口】【灼伤】【虚空】各 1 张洗入你的抽牌堆！',
          },
        },
      ];
    }
    const bloodShotsHits = asc >= 9 ? 15 : 12;
    const echoDmg = asc >= 9 ? 45 : 40;
    const bloodShotsIntent = {
      id: 'heart_blood_shots',
      name: '血箭连射',
      type: 'attack',
      damage: 2,
      hits: bloodShotsHits,
      summary: `意图：连续发射 2×${bloodShotsHits} 支腐化血箭！`,
    };
    const echoIntent = {
      id: 'heart_echo',
      name: '回响重击',
      type: 'attack',
      damage: echoDmg,
      hits: 1,
      summary: `意图：释放 ${echoDmg} 点毁灭性单段重击！`,
    };
    const cyclePos = (turn - 1) % 3;
    if (cyclePos === 0) {
      return [
        { probability: 0.5, intent: bloodShotsIntent },
        { probability: 0.5, intent: echoIntent },
      ];
    }
    if (cyclePos === 1) {
      return [
        {
          probability: 1,
          intent: enemy.lastMoveId === 'heart_blood_shots' ? echoIntent : bloodShotsIntent,
        },
      ];
    }
    const buffIdx = enemy.heartBuffCount ?? 0;
    const extraDesc =
      buffIdx === 0
        ? '获得 2 层【人工制品】'
        : buffIdx === 1
          ? '【死亡律动】+1'
          : buffIdx === 2
            ? '获得【痛刺】（未格挡攻击塞入伤口）'
            : buffIdx === 3
              ? '额外获得 10 点【力量】'
              : '额外获得 50 点【力量】！';
    return [
      {
        probability: 1,
        intent: {
          id: 'heart_buff',
          name: '心脏脉动',
          type: 'buff',
          isHeartBuff: true,
          summary: `意图：清除负面力量，获得 2 点【力量】，并${extraDesc}`,
        },
      },
    ];
  },
};
