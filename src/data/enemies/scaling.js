// Ascension 9 enemy intent scaling & localized summary rebuilding.

const STATUS_ZH_LABELS = Object.freeze({
  strength: '力量',
  dexterity: '敏捷',
  ritual: '仪式',
  enrage: '激怒',
  thorns: '荆棘',
  metallicize: '金属化',
  platedArmor: '多层护甲',
  artifact: '人工制品',
  beatOfDeath: '死亡律动',
  painfulStabs: '痛苦刺击',
  weak: '虚弱',
  vulnerable: '易伤',
  frail: '脆弱',
  hex: '妖术',
  confused: '混乱',
  constricted: '缠绕',
  entangled: '缠网',
  stasis: '静止力场',
});

const STATUS_CARD_ZH_LABELS = Object.freeze({
  dazed: '晕眩',
  slimed: '黏液',
  burn: '灼伤',
  wound: '伤口',
  void: '虚空',
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
  } else if (intent.protectRandomAlly && typeof intent.block === 'number' && intent.block > 0) {
    parts.push(`为一名随机存活友方施加 ${intent.block} 点格挡`);
  } else if (intent.supportBossBlock && typeof intent.block === 'number' && intent.block > 0) {
    parts.push(`为首领提供 ${intent.block} 点格挡`);
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
  'acid_slime_s',
  'spike_slime_s',
  'fungi_beast',
  'mad_gremlin',
  'fat_gremlin',
  'shield_gremlin',
  'sneaky_gremlin',
  'gremlin_wizard',
  'byrd',
  'bronze_orb',
  'torch_head',
  'bandit_pointy',
  'spiker',
  'exploder',
  'repulsor',
  'darkling',
]);

export function applyAscensionIntentScaling(state, enemy, intent) {
  if (!intent) return intent;
  if (enemy.templateId === 'corrupt_heart' || intent.skipGenericAscScaling) {
    return intent;
  }
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
      next.allEnemiesBlock += 2;
      if (typeof next.block === 'number') {
        next.block += 2;
      }
      mutatedNonDamage = true;
    } else if (typeof next.block === 'number' && next.block > 0) {
      next.block += isEliteOrBoss ? 2 : 1;
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

    if (isEliteOrBoss && Array.isArray(next.addDiscardCards) && next.addDiscardCards.length > 0) {
      next.addDiscardCards = next.addDiscardCards.map((entry) => ({
        ...entry,
        count: (entry.count ?? 1) + 1,
      }));
      mutatedNonDamage = true;
    }

    if (isEliteOrBoss && Array.isArray(next.addDrawCards) && next.addDrawCards.length > 0) {
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
