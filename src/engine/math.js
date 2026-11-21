/**
 * Core Slay-the-Spire combat math (single source of truth for execution and UI previews).
 */

export function calculateAttackDamage(baseDamage, attacker, defender = null, options = {}) {
  const safeBase = Number.isFinite(baseDamage) ? baseDamage : 0;
  const strMult = options.strengthMultiplier ?? 1;
  const strength = attacker?.statuses?.strength ?? 0;
  const bonus = options.flatBonus ?? 0;

  let raw = safeBase + strength * strMult + bonus;
  if (raw <= 0) {
    return 0;
  }

  if ((attacker?.statuses?.weak ?? 0) > 0) {
    raw *= 0.75;
  }

  if (defender && (defender?.statuses?.vulnerable ?? 0) > 0) {
    const hasPaperPhrog =
      Boolean(options.hasPaperPhrog) ||
      (Array.isArray(attacker?.relics) && attacker.relics.includes('paper_phrog'));
    raw *= hasPaperPhrog ? 1.75 : 1.5;
  }

  if (defender && (defender?.statuses?.slow ?? 0) > 0 && (defender?.slowStacks ?? 0) > 0) {
    raw *= 1 + 0.1 * defender.slowStacks;
  }

  if ((attacker?.statuses?.doubleDamage ?? 0) > 0) {
    raw *= 2;
  }

  const attackerStance = options.attackerStance ?? attacker?.stance ?? 'neutral';
  if (attackerStance === 'wrath') {
    raw *= 2;
  } else if (attackerStance === 'divinity') {
    raw *= 3;
  }

  const defenderStance = options.defenderStance ?? defender?.stance ?? 'neutral';
  if (defenderStance === 'wrath') {
    raw *= 2;
  }

  if (!options.ignoreFlight && defender && (defender?.statuses?.flight ?? 0) > 0) {
    raw *= 0.5;
  }

  return Math.max(0, Math.floor(raw));
}

export function calculateCardBlock(baseBlock, player) {
  const safeBase = Number.isFinite(baseBlock) ? baseBlock : 0;
  const dexterity = player?.statuses?.dexterity ?? 0;
  let raw = safeBase + dexterity;
  if (raw <= 0) {
    return 0;
  }

  if ((player?.statuses?.frail ?? 0) > 0) {
    raw *= 0.75;
  }

  return Math.max(0, Math.floor(raw));
}

export function getEnemyIntentPreview(enemy, player) {
  const intent = enemy?.intent;
  if (!intent || enemy.hp <= 0) {
    return {
      type: 'none',
      isAttack: false,
      hits: 0,
      perHitDamage: 0,
      totalDamage: 0,
      block: 0,
      label: '无行动',
      detail: '',
    };
  }

  const hits = intent.hits ?? 1;
  const isAttack = typeof intent.damage === 'number' && intent.damage >= 0;
  let perHitDamage = isAttack ? calculateAttackDamage(intent.damage, enemy, player) : 0;
  if (isAttack && perHitDamage > 1 && (player?.statuses?.intangible ?? 0) > 0) {
    perHitDamage = 1;
  }
  const totalDamage = perHitDamage * hits;
  const block = intent.block ?? 0;
  const hitText = hits > 1 ? `${perHitDamage}×${hits}` : `${perHitDamage}`;

  switch (intent.type) {
    case 'attack':
      return {
        type: intent.type,
        isAttack: true,
        hits,
        perHitDamage,
        totalDamage,
        block: 0,
        label: hitText,
        detail: hits > 1 ? `意图：攻击 ${perHitDamage} 点 × ${hits} 次（共 ${totalDamage} 点）` : `意图：造成 ${perHitDamage} 点攻击伤害`,
      };
    case 'attack_block':
      return {
        type: intent.type,
        isAttack: true,
        hits,
        perHitDamage,
        totalDamage,
        block,
        label: `${hitText} · 盾${block}`,
        detail: `意图：造成 ${hitText} 点伤害，并获得 ${block} 点格挡`,
      };
    case 'attack_debuff':
      return {
        type: intent.type,
        isAttack: true,
        hits,
        perHitDamage,
        totalDamage,
        block: 0,
        label: `${hitText} · 减益`,
        detail: `意图：造成 ${hitText} 点伤害，并施加负面效果`,
      };
    case 'attack_buff':
      return {
        type: intent.type,
        isAttack: true,
        hits,
        perHitDamage,
        totalDamage,
        block: 0,
        label: `${hitText} · 强化`,
        detail: `意图：造成 ${hitText} 点伤害，并获得强化或转换形态`,
      };
    case 'defend':
      return {
        type: intent.type,
        isAttack: false,
        hits: 0,
        perHitDamage: 0,
        totalDamage: 0,
        block,
        label: `格挡 ${block}`,
        detail: `意图：获得 ${block} 点格挡`,
      };
    case 'defend_buff':
      return {
        type: intent.type,
        isAttack: false,
        hits: 0,
        perHitDamage: 0,
        totalDamage: 0,
        block,
        label: `盾${block} · 强化`,
        detail: `意图：获得 ${block} 点格挡并提升自身属性`,
      };
    case 'buff':
      return {
        type: intent.type,
        isAttack: false,
        hits: 0,
        perHitDamage: 0,
        totalDamage: 0,
        block: 0,
        label: '强化',
        detail: intent.summary || '意图：施放增益效果',
      };
    case 'debuff':
      return {
        type: intent.type,
        isAttack: false,
        hits: 0,
        perHitDamage: 0,
        totalDamage: 0,
        block: 0,
        label: '干扰',
        detail: intent.summary || '意图：施加减益或塞入状态牌',
      };
    case 'sleep':
      return {
        type: intent.type,
        isAttack: false,
        hits: 0,
        perHitDamage: 0,
        totalDamage: 0,
        block: 0,
        label: intent.id === 'stunned' ? '眩晕' : '沉睡',
        detail: intent.summary || '意图：沉睡或眩晕中，本回合不会攻击',
      };
    default:
      return {
        type: intent.type || 'unknown',
        isAttack,
        hits,
        perHitDamage,
        totalDamage,
        block,
        label: isAttack ? hitText : '未知',
        detail: intent.summary || '意图未知',
      };
  }
}
