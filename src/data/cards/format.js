import { calculateAttackDamage, calculateCardBlock } from '../../engine/math.js';
import { CARD_LIBRARY, getCardCharacter } from './library.js';

export function createCardInstance(state, cardId, upgraded = false) {
  const def = CARD_LIBRARY[cardId];
  if (!def) {
    throw new Error(`Unknown cardId: ${cardId}`);
  }
  state.nextUid = (state.nextUid ?? 1) + 1;
  return {
    instanceId: `card_${state.nextUid}`,
    cardId,
    upgraded: Boolean(upgraded && def.upgraded),
  };
}

export function canUpgradeCard(cardInstance) {
  if (!cardInstance) return false;
  const def = CARD_LIBRARY[cardInstance.cardId];
  if (!def || !def.upgraded || def.type === 'status' || def.type === 'curse') return false;
  if (def.infiniteUpgrade) return true;
  return !cardInstance.upgraded;
}

export function upgradeCardInstance(cardInstance) {
  if (!canUpgradeCard(cardInstance)) return false;
  const def = CARD_LIBRARY[cardInstance.cardId];
  if (def?.infiniteUpgrade) {
    const curLvl = Number.isInteger(cardInstance.upgradeLevel)
      ? Math.max(0, cardInstance.upgradeLevel)
      : cardInstance.upgraded
        ? 1
        : 0;
    cardInstance.upgradeLevel = curLvl + 1;
    cardInstance.upgraded = true;
    return true;
  }
  cardInstance.upgraded = true;
  return true;
}

export function canRemoveCard(cardInstance) {
  if (!cardInstance) return false;
  const def = CARD_LIBRARY[cardInstance.cardId];
  return Boolean(def && !def.unremovable && !def.base?.unremovable);
}

export function isStrikeCard(cardId) {
  const def = CARD_LIBRARY[cardId];
  return Boolean(def && (cardId.includes('strike') || def.name.includes('打击')));
}

export function countCombatStrikeCards(combat) {
  if (!combat) return 0;
  const all = [...(combat.hand || []), ...(combat.drawPile || []), ...(combat.discardPile || [])];
  return all.filter((c) => isStrikeCard(c.cardId)).length;
}

export function getCardStats(cardInstance) {
  const def = CARD_LIBRARY[cardInstance?.cardId];
  if (!def) {
    throw new Error(`Unknown cardId on instance: ${cardInstance?.cardId}`);
  }
  const upgradeLevel = def.infiniteUpgrade
    ? Number.isInteger(cardInstance.upgradeLevel)
      ? Math.max(0, cardInstance.upgradeLevel)
      : cardInstance.upgraded
        ? 1
        : 0
    : cardInstance.upgraded && def.upgraded
      ? 1
      : 0;
  const isUpgraded = upgradeLevel > 0 && Boolean(def.upgraded);
  const rawStats = isUpgraded ? { ...def.base, ...def.upgraded } : { ...def.base };
  if (def.infiniteUpgrade && upgradeLevel > 0) {
    rawStats.damage = 12 + (upgradeLevel * (upgradeLevel + 7)) / 2;
  }
  if (typeof cardInstance.combatDamageMod === 'number' && typeof rawStats.damage === 'number') {
    rawStats.damage = Math.max(0, rawStats.damage + cardInstance.combatDamageMod);
  }
  if (rawStats.ritualDamageGrowth && typeof cardInstance.ritualBonus === 'number' && typeof rawStats.damage === 'number') {
    rawStats.damage = Math.max(0, rawStats.damage + cardInstance.ritualBonus);
  }
  if (rawStats.isExpunger) {
    rawStats.hits = Math.max(1, Number.isFinite(cardInstance.expungerHits) ? Math.floor(cardInstance.expungerHits) : 1);
  }
  if (typeof cardInstance.combatBlockMod === 'number' && typeof rawStats.block === 'number') {
    rawStats.block = Math.max(0, rawStats.block + cardInstance.combatBlockMod);
  }
  if (rawStats.geneticBlockGrowth && typeof cardInstance.miscBonus === 'number' && typeof rawStats.block === 'number') {
    rawStats.block = Math.max(0, rawStats.block + cardInstance.miscBonus);
  }
  const costReduced = Boolean(
    isUpgraded &&
      typeof def.base.cost === 'number' &&
      typeof rawStats.cost === 'number' &&
      rawStats.cost < def.base.cost
  );
  const displayName =
    def.infiniteUpgrade && upgradeLevel >= 2
      ? `${def.name}+${upgradeLevel}`
      : isUpgraded
        ? `${def.name}+`
        : def.name;

  return {
    instanceId: cardInstance.instanceId,
    cardId: def.id,
    character: getCardCharacter(def),
    name: displayName,
    baseName: def.name,
    upgraded: isUpgraded,
    upgradeLevel,
    baseCost: def.base.cost,
    combatCost: typeof cardInstance.combatCost === 'number' ? cardInstance.combatCost : null,
    zeroCostUntilPlayed: Boolean(cardInstance.zeroCostUntilPlayed),
    retainedCostDiscount:
      typeof cardInstance.retainedCostDiscount === 'number'
        ? Math.max(0, cardInstance.retainedCostDiscount)
        : 0,
    costReduced,
    type: def.type,
    rarity: def.rarity,
    shopOnly: Boolean(def.shopOnly),
    specialCurse: Boolean(def.specialCurse),
    unremovable: Boolean(def.unremovable || rawStats.unremovable),
    price: def.price ?? 50,
    isShiv: Boolean(def.isShiv || rawStats.isShiv),
    unplayable: Boolean(def.unplayable || rawStats.unplayable),
    ethereal: Boolean(def.ethereal || rawStats.ethereal),
    innate: Boolean(def.innate || rawStats.innate),
    retain: Boolean(def.retain || rawStats.retain),
    ...rawStats,
    target: rawStats.target || def.target,
  };
}

export function getEffectiveCardCost(stats, player = null, combat = null) {
  if (
    stats.unplayable &&
    stats.type === 'status' &&
    Array.isArray(player?.relics) &&
    player.relics.includes('medical_kit')
  ) {
    return 0;
  }
  if (stats.unplayable || stats.cost === null) return null;
  if (stats.isXCost) return 'X';
  if (stats.zeroCostUntilPlayed) return 0;
  if (stats.type === 'skill' && (player?.statuses?.corruption ?? 0) > 0) {
    return 0;
  }
  if (stats.type === 'attack' && (player?.statuses?.freeAttackPower ?? 0) > 0) {
    return 0;
  }
  let base = typeof stats.combatCost === 'number' ? Math.max(0, stats.combatCost) : (stats.cost ?? 0);
  if (stats.retainedCostDiscount > 0) {
    base = Math.max(0, base - stats.retainedCostDiscount);
  }
  if (stats.reduceCostPerDiscardThisTurn && combat) {
    base = Math.max(0, base - (combat.discardedThisTurn ?? 0));
  }
  if (stats.reduceCostPerHpLossThisCombat && combat) {
    base = Math.max(0, base - (combat.hpLossCountThisCombat ?? 0));
  }
  if (stats.increaseCostPerHpLossThisCombat && combat) {
    base = Math.max(0, base + (combat.hpLossCountThisCombat ?? 0));
  }
  if (stats.reduceCostPerPowerPlayed && combat) {
    base = Math.max(0, base - (combat.powersPlayedThisCombat ?? 0));
  }
  return base;
}

/**
 * Single source of truth for flat per-hit attack bonuses (Accuracy on Shivs, Wrist Blade on 0-cost attacks, Strike Dummy, Vigor, Blizzard frost scaling).
 */
export function getCardAttackFlatBonus(stats, player = null, combat = null) {
  if (!stats || stats.type !== 'attack' || !player) return 0;
  let bonus = 0;
  if (stats.isShiv && (player.statuses?.accuracy ?? 0) > 0) {
    bonus += player.statuses.accuracy;
  }
  if ((player.statuses?.vigor ?? 0) > 0) {
    bonus += player.statuses.vigor;
  }
  if (stats.bonusDamagePerCombatMantra && combat && (combat.mantraGainedThisCombat ?? 0) > 0) {
    bonus += combat.mantraGainedThisCombat;
  }
  if (stats.damagePerFrostChanneled && combat) {
    const frostCount = combat.orbsChanneledByType?.frost ?? 0;
    if (frostCount > 0) {
      bonus += stats.damagePerFrostChanneled * frostCount;
    }
  }
  if (Array.isArray(player.relics) && player.relics.includes('strike_dummy') && isStrikeCard(stats.cardId)) {
    bonus += 3;
  }
  if (Array.isArray(player.relics) && player.relics.includes('wrist_blade')) {
    const effCost = getEffectiveCardCost(stats, player, combat);
    if (effCost === 0) {
      bonus += 4;
    }
  }
  return bonus;
}

const STANCE_NAMES_ZH = {
  neutral: '无姿态',
  calm: '平静',
  wrath: '愤怒',
  divinity: '神格',
};

const ORB_NAMES_ZH = {
  lightning: '闪电球',
  frost: '冰霜球',
  dark: '黑暗球',
  plasma: '等离子球',
};

export function formatCardDescription(cardInstance, combatContext = null) {
  const stats = getCardStats(cardInstance);
  const player = combatContext?.player ?? null;
  const targetEnemy = combatContext?.targetEnemy ?? null;
  const combat = combatContext?.combat ?? null;

  let rawDamageBase = stats.damage ?? stats.exhaustAllHandDamageEach ?? null;
  let strikeBonusTotal = 0;
  if (typeof stats.bonusDamagePerStrike === 'number' && combat && typeof rawDamageBase === 'number') {
    strikeBonusTotal = stats.bonusDamagePerStrike * countCombatStrikeCards(combat);
    rawDamageBase += strikeBonusTotal;
  }
  const flatBonus = getCardAttackFlatBonus(stats, player, combat);
  let displayDamage = rawDamageBase;
  let damageState = 'normal';

  if (stats.useBlockAsDamage) {
    const baseFromBlock = player ? player.block : 0;
    displayDamage = player
      ? calculateAttackDamage(baseFromBlock, player, targetEnemy, { flatBonus })
      : 0;
    if (player && displayDamage > baseFromBlock) damageState = 'boosted';
    else if (player && displayDamage < baseFromBlock) damageState = 'reduced';
  } else if (stats.damageFromDrawPileSize) {
    const drawBase = combat ? (combat.drawPile?.length ?? 0) : 0;
    displayDamage = player
      ? calculateAttackDamage(drawBase, player, targetEnemy, { flatBonus })
      : drawBase;
    if (player && displayDamage > drawBase) damageState = 'boosted';
    else if (player && displayDamage < drawBase) damageState = 'reduced';
  } else if (typeof rawDamageBase === 'number') {
    if (player) {
      displayDamage = calculateAttackDamage(rawDamageBase, player, targetEnemy, {
        strengthMultiplier: stats.strengthMultiplier ?? 1,
        flatBonus,
      });
      const baselineDamage = stats.damage ?? rawDamageBase;
      if (displayDamage > baselineDamage) damageState = 'boosted';
      else if (displayDamage < baselineDamage) damageState = 'reduced';
    }
  }

  const discardBonusBlock =
    stats.blockFromDiscardSize && combat ? (combat.discardPile?.length ?? 0) : 0;
  const rawBlockBase =
    stats.blockPerX ??
    (typeof stats.block === 'number' ? stats.block + discardBonusBlock : null) ??
    stats.exhaustNonAttacksBlockEach ??
    null;
  let displayBlock = rawBlockBase;
  let blockState = 'normal';
  if (typeof rawBlockBase === 'number' && player) {
    displayBlock = calculateCardBlock(rawBlockBase, player);
    if (displayBlock > rawBlockBase) blockState = 'boosted';
    else if (displayBlock < rawBlockBase) blockState = 'reduced';
  }
  const displayWrathBonusBlock =
    typeof stats.wrathBonusBlock === 'number'
      ? player
        ? calculateCardBlock(stats.wrathBonusBlock, player)
        : stats.wrathBonusBlock
      : null;
  const displaySkillBonusBlock =
    typeof stats.drawSkillGainBlock === 'number'
      ? player
        ? calculateCardBlock(stats.drawSkillGainBlock, player)
        : stats.drawSkillGainBlock
      : null;
  if (displaySkillBonusBlock !== null && player) {
    if (displaySkillBonusBlock > stats.drawSkillGainBlock) blockState = 'boosted';
    else if (displaySkillBonusBlock < stats.drawSkillGainBlock && blockState === 'normal') blockState = 'reduced';
  }

  const hasSneckoSkull = Boolean(Array.isArray(player?.relics) && player.relics.includes('snecko_skull'));
  const poisonDisplay = (val) => (hasSneckoSkull ? val + 1 : val);
  const currentStance = combat?.stance ?? player?.stance ?? 'neutral';

  const parts = [];

  if (stats.innate) {
    parts.push('固有。');
  }
  if (stats.retain) {
    parts.push('保留。');
  }
  if (stats.requireAllHandAttacks) {
    parts.push('只有当手牌中全是攻击牌时才能打出。');
  }
  if (stats.requireEmptyDrawPile) {
    parts.push('只有当抽牌堆为空时才能打出。');
  }
  if (stats.requireOnlyAttackInHand) {
    parts.push('只有当本牌是手牌中唯一的攻击牌时才能打出。');
  }
  if (stats.unplayable) {
    if (
      stats.type === 'status' &&
      Array.isArray(player?.relics) &&
      player.relics.includes('medical_kit')
    ) {
      parts.push('【医药箱】可 0 费打出并消耗。');
    } else {
      parts.push('不能被打出。');
    }
  }
  if (stats.onDiscardGainEnergy) {
    parts.push(`每当你主动弃掉本牌时，获得 ${stats.onDiscardGainEnergy} 点能量。`);
  }
  if (stats.onDiscardDraw) {
    parts.push(`每当你主动弃掉本牌时，抽 ${stats.onDiscardDraw} 张牌。`);
  }
  if (stats.ethereal) {
    parts.push('虚无。');
  }
  if (stats.onDrawLoseEnergy) {
    parts.push(`抽到这张牌时，失去 ${stats.onDrawLoseEnergy} 点能量。`);
  }
  if (stats.normalityLimit) {
    parts.push(`在手牌中时，本回合最多只能打出 ${stats.normalityLimit} 张牌。`);
  }
  if (stats.painOnOtherCardPlay) {
    parts.push(`在手牌中时，每当你打出其他牌，失去 ${stats.painOnOtherCardPlay} 点生命。`);
  }
  if (stats.endOfTurnSelfDamage) {
    parts.push(`回合结束时若仍在手牌，受到 ${stats.endOfTurnSelfDamage} 点伤害。`);
  }
  if (stats.endOfTurnLoseHp) {
    parts.push(`回合结束时若仍在手牌，失去 ${stats.endOfTurnLoseHp} 点生命。`);
  }
  if (stats.endOfTurnWeak) {
    parts.push(`回合结束时若仍在手牌，获得 ${stats.endOfTurnWeak} 层虚弱。`);
  }
  if (stats.endOfTurnFrail) {
    parts.push(`回合结束时若仍在手牌，获得 ${stats.endOfTurnFrail} 层脆弱。`);
  }
  if (stats.endOfTurnCopyToDrawTop) {
    parts.push('回合结束时若仍在手牌，将 1 张【傲慢】置于抽牌堆顶。');
  }
  if (stats.onRemoveLoseMaxHp) {
    parts.push(`若从牌组中移除本牌，失去 ${stats.onRemoveLoseMaxHp} 点最大生命值。`);
  }
  if (stats.unremovable) {
    parts.push(
      stats.returnOnExhaust
        ? '无法从牌组中移除，且被消耗后会自动回到手牌。'
        : '无法从牌组中移除。'
    );
  }
  if (stats.loseHp) {
    parts.push(`失去 ${stats.loseHp} 点生命。`);
  }
  if (stats.healHp) {
    parts.push(`回复 ${stats.healHp} 点生命。`);
  }
  if (stats.gainEnergy) {
    parts.push(`获得 ${stats.gainEnergy} 点能量。`);
  }
  if (stats.addCardsToHand) {
    const tokenDef = CARD_LIBRARY[stats.addCardsToHand.cardId];
    const tokenName = tokenDef
      ? stats.addCardsToHand.upgraded
        ? `${tokenDef.name}+`
        : tokenDef.name
      : stats.addCardsToHand.cardId;
    if (stats.addCardsToHand.cardId === 'wound') {
      parts.push(`将 ${stats.addCardsToHand.count} 张【${tokenName}】加入手牌。`);
    }
  }
  if (stats.scry && stats.cardId === 'just_lucky') {
    parts.push(`预见 ${stats.scry}。`);
  }
  if (typeof stats.blockPerX === 'number') {
    parts.push(`获得 ${displayBlock} 点格挡 X 次。`);
  } else if (stats.blockFromDiscardSize) {
    const bonusNote = (stats.block ?? 0) > 0 ? ` + ${stats.block} ` : '';
    const liveNote = combat ? `（当前 ${displayBlock} 点）` : '';
    parts.push(`获得等同于弃牌堆牌数${bonusNote}的格挡${liveNote}。`);
  } else if (typeof stats.block === 'number') {
    if (stats.onlyBlockIfNoBlock) {
      const metNote = player ? (player.block === 0 ? '（当前无盾！）' : '（当前有盾）') : '';
      parts.push(`若当前没有任何格挡，获得 ${displayBlock} 点格挡${metNote}。`);
    } else if (stats.gainSameBlockNextTurn) {
      parts.push(`获得 ${displayBlock} 点格挡，并在下回合开始时再获得 ${displayBlock} 点格挡。`);
    } else {
      parts.push(`获得 ${displayBlock} 点格挡。`);
    }
  }
  if (stats.shrinkBlockOnPlay) {
    parts.push(`本场战斗每次打出后基础格挡 -${stats.shrinkBlockOnPlay}。`);
  }
  if (stats.geneticBlockGrowth) {
    parts.push(`每次打出后，本牌的格挡永久 +${stats.geneticBlockGrowth}（跨战斗保留）。`);
  }
  if (stats.reduceCostPerPowerPlayed) {
    parts.push('本场战斗每打出过 1 张能力牌，本牌费用 -1。');
  }
  if (typeof stats.wrathBonusBlock === 'number') {
    const activeTag = currentStance === 'wrath' ? '（当前已激活！）' : '';
    parts.push(`若处于【愤怒】姿态，再额外获得 ${displayWrathBonusBlock} 点格挡${activeTag}。`);
  }
  if (typeof stats.blockPerOtherHandCard === 'number') {
    const otherCount = combat ? Math.max(0, (combat.hand?.length ?? 1) - 1) : null;
    const estTotal =
      otherCount !== null && player
        ? calculateCardBlock(otherCount * stats.blockPerOtherHandCard, player)
        : null;
    const liveNote = estTotal !== null ? `（当前约 ${estTotal} 点）` : '';
    parts.push(`手牌中每有 1 张其他卡牌，获得 ${stats.blockPerOtherHandCard} 点格挡${liveNote}。`);
  }
  if (stats.retainScaleBlock) {
    parts.push(`每当本牌在回合结束被【保留】时，本场战斗格挡值永久 +${stats.retainScaleBlock}。`);
  }
  if (stats.retainScaleDamage) {
    parts.push(`每当本牌在回合结束被【保留】时，本场战斗伤害永久 +${stats.retainScaleDamage}。`);
  }
  if (stats.retainCostReduce) {
    parts.push(`每当本牌在回合结束被【保留】时，本场战斗费用永久 -${stats.retainCostReduce}。`);
  }
  if (stats.onExhaustGainEnergy) {
    parts.push(`若本牌被消耗，立即获得 ${stats.onExhaustGainEnergy} 点能量。`);
  }
  if (stats.autoExhaustOnDrawMiracles) {
    parts.push(`抽到此牌时自动消耗，并将 ${stats.autoExhaustOnDrawMiracles} 张【奇迹】加入手牌。`);
  }
  if (stats.playTopDrawAndExhaust) {
    parts.push('打出抽牌堆顶的 1 张牌并将其消耗。');
  }
  if (stats.shuffleDiscardIntoDraw) {
    parts.push('将弃牌堆洗入抽牌堆。');
  }
  if (stats.retrieveDiscardRetain) {
    parts.push(`从弃牌堆选择最多 ${stats.retrieveDiscardRetain} 张牌放入手牌并赋予本回合保留。`);
  }
  if (stats.retrieveDiscardToHand) {
    parts.push(`从弃牌堆选择 ${stats.retrieveDiscardToHand} 张牌加入手牌。`);
  }
  if (stats.retrieveExhaustToHand) {
    parts.push(`从消耗堆选择 ${stats.retrieveExhaustToHand} 张牌加入手牌。`);
  }
  if (stats.playFromDrawTwiceAndExhaust) {
    parts.push('从抽牌堆选择 1 张牌，将其连续打出 2 次并消耗。');
  }
  if (stats.pickFromDraw) {
    const typeLabel =
      stats.pickFromDrawType === 'skill'
        ? '技能'
        : stats.pickFromDrawType === 'attack'
          ? '攻击'
          : '';
    parts.push(`从抽牌堆选择 ${stats.pickFromDraw} 张${typeLabel}牌加入手牌。`);
  }
  if (stats.doubleBlock) {
    parts.push('将你当前的格挡值翻倍。');
  }
  if (stats.doubleEnergy) {
    parts.push('使你当前的能量翻倍。');
  }
  if (stats.energyPerDrawCards) {
    const curGain = combat ? Math.floor((combat.drawPile?.length ?? 0) / stats.energyPerDrawCards) : null;
    const note = curGain !== null ? `（当前 +${curGain} 能）` : '';
    parts.push(`抽牌堆每有 ${stats.energyPerDrawCards} 张牌，获得 1 点能量${note}。`);
  }
  if (stats.doubleStrength) {
    parts.push('将你当前的【力量】翻倍。');
  }
  if (stats.exhaustChooseHandForEnergy) {
    parts.push(`选择消耗 ${stats.exhaustChooseHandForEnergy} 张手牌，获得等同于其费用的能量。`);
  } else if (stats.exhaustUpToHandChoice) {
    parts.push(`选择并消耗手牌中最多 ${stats.exhaustUpToHandChoice} 张牌。`);
  } else if (stats.exhaustHandChoice) {
    parts.push(`从手牌中自选消耗 ${stats.exhaustHandChoice} 张牌。`);
  } else if (stats.exhaustHandRandom) {
    parts.push(
      stats.exhaustHandSmart
        ? '消耗 1 张手牌（优先状态或诅咒牌）。'
        : '随机消耗 1 张手牌。'
    );
  }
  if (stats.drawAfterExhaustChoice) {
    parts.push(`抽 ${stats.drawAfterExhaustChoice} 张牌。`);
  }
  if (stats.exhaustNonAttacksBlockEach) {
    parts.push(`消耗手牌中所有非攻击牌，每张获得 ${displayBlock} 点格挡。`);
  }
  if (stats.exhaustNonAttacksHand) {
    parts.push('消耗手牌中所有非攻击牌。');
  }
  if (stats.duplicateAttackOrPowerHandChoice) {
    parts.push(
      `选择手牌中 1 张攻击牌或能力牌，将 ${stats.duplicateAttackOrPowerHandChoice} 张它的复制品加入手牌。`
    );
  }
  if (stats.upgradeAllCombatCards) {
    parts.push('本场战斗中升级你的所有卡牌（手牌、抽牌堆与弃牌堆）。');
  } else if (stats.upgradeAllHand) {
    parts.push('本场战斗中升级所有手牌。');
  } else if (stats.upgradeHandChoice) {
    parts.push(`本场战斗中从手牌中自选升级 ${stats.upgradeHandChoice} 张牌。`);
  } else if (stats.upgradeHandRandom) {
    parts.push(`本场战斗中随机升级 ${stats.upgradeHandRandom} 张手牌。`);
  }
  if (stats.scry && stats.cardId !== 'just_lucky' && stats.type !== 'attack') {
    parts.push(`预见 ${stats.scry}。`);
  }
  if (stats.removeEnemyBlockBeforeDamage) {
    parts.push('移除目标的所有格挡。');
  }
  if (stats.exhaustAllHandDamageEach) {
    parts.push(`消耗所有手牌，每张对目标造成 ${displayDamage} 点伤害。`);
  } else if (stats.useBlockAsDamage) {
    const suffix = player ? `（当前 ${displayDamage} 点）` : '';
    parts.push(`造成等同于你当前格挡值的伤害${suffix}。`);
  } else if (stats.damageFromDrawPileSize) {
    const suffix = combat ? `（当前 ${displayDamage} 点）` : '';
    parts.push(`造成等同于你抽牌堆牌数的伤害${suffix}。`);
  } else if (stats.damagePerFrostChanneled) {
    const frostCnt = combat?.orbsChanneledByType?.frost ?? 0;
    const note = combat ? `（已充能 ${frostCnt} 冰，当前 ${displayDamage} 点）` : '';
    parts.push(`对所有敌人造成本场战斗已充能【冰霜球】数 × ${stats.damagePerFrostChanneled} 点伤害${note}。`);
  } else if (stats.hitsPerOrb && typeof stats.damage === 'number') {
    const orbCnt = player?.orbs?.length ?? 0;
    const note = player ? `（当前 ${orbCnt} 次）` : '';
    parts.push(`每有 1 个已充能的充能球，造成 ${displayDamage} 点伤害${note}。`);
  } else if (stats.hitsPerLightningChanneled && typeof stats.damage === 'number') {
    const lightCnt = combat?.orbsChanneledByType?.lightning ?? 0;
    const note = combat ? `（当前 ${lightCnt} 次）` : '';
    parts.push(`本场战斗每充能过 1 个【闪电球】，对随机敌人造成 ${displayDamage} 点伤害 1 次${note}。`);
  } else if (stats.hitsPerAttackPlayedThisTurn) {
    const playedNote = combat ? `（本回合已打 ${combat.attacksPlayedThisTurn ?? 0} 张）` : '';
    parts.push(`本回合每打出 1 张攻击牌，造成 ${displayDamage} 点伤害${playedNote}。`);
  } else if (stats.hitsPerAliveEnemy && typeof stats.damage === 'number') {
    const aliveCount = combat ? combat.enemies.filter((e) => e.hp > 0).length : null;
    const countNote = aliveCount !== null ? `（当前 ${aliveCount} 次）` : '';
    parts.push(`场上每有 1 名存活敌人，对目标造成 ${displayDamage} 点伤害${countNote}。`);
  } else if (stats.hitsPerHandSkill && typeof stats.damage === 'number') {
    const skillCount = combat
      ? combat.hand.filter((h) => h.instanceId !== stats.instanceId && getCardStats(h).type === 'skill').length
      : null;
    const countNote = skillCount !== null ? `（当前 ${skillCount} 次）` : '';
    parts.push(`手牌中每有 1 张技能牌，对目标造成 ${displayDamage} 点伤害${countNote}。`);
  } else if (stats.isExpunger && typeof stats.damage === 'number') {
    const hitCount = stats.hits ?? 1;
    parts.push(`造成 ${displayDamage} 点伤害 ${hitCount} 次。`);
  } else if (typeof stats.damage === 'number') {
    const targetPhrase = stats.randomEnemyHits
      ? '对随机一名敌人造成'
      : stats.target === 'all_enemies'
        ? '对所有敌人造成'
        : '造成';
    if (stats.isXCost) {
      parts.push(`${targetPhrase} ${displayDamage} 点伤害 X 次。`);
    } else if ((stats.hits ?? 1) > 1) {
      parts.push(`${targetPhrase} ${displayDamage} 点伤害 ${stats.hits} 次。`);
    } else {
      parts.push(`${targetPhrase} ${displayDamage} 点伤害。`);
    }
  }
  if (stats.combatDamageScaleOnPlay) {
    parts.push(`本场战斗每打出一次，本牌伤害 +${stats.combatDamageScaleOnPlay}。`);
  }
  if (stats.infiniteUpgrade) {
    parts.push('可以无限次升级。');
  }
  if (stats.copyOnDraw) {
    parts.push('每当你抽到此牌时，将 1 张复制品加入手牌。');
  }
  if (stats.increaseCostPerHpLossThisCombat) {
    const lostCount = combat?.hpLossCountThisCombat ?? 0;
    const note = combat && lostCount > 0 ? `（已增 ${lostCount} 费）` : '';
    parts.push(`本场战斗每失去 1 次生命，本牌费用 +1${note}。`);
  }
  if (stats.discardNonAttacksHand) {
    parts.push('弃掉手牌中所有非攻击牌。');
  }
  if (stats.ritualDamageGrowth) {
    parts.push(`斩杀时，本牌伤害永久 +${stats.ritualDamageGrowth}（跨战斗保留）。`);
  }
  if (stats.clawScale) {
    parts.push(`本场战斗中所有【爪击】伤害 +${stats.clawScale}。`);
  }
  if (stats.reduceSelfCostOnPlay) {
    parts.push(`本场战斗中此牌费用减少 ${stats.reduceSelfCostOnPlay}。`);
  }
  if (stats.drawPerUniqueOrb) {
    const uniq = player?.orbs ? new Set(player.orbs.map((o) => o.type)).size : null;
    const note = uniq !== null ? `（当前 ${uniq} 种）` : '';
    parts.push(`当前每有一种不同类型的充能球，抽 ${stats.drawPerUniqueOrb} 张牌${note}。`);
  }
  if (stats.drawIfCardsPlayedUnder) {
    const played = combat?.cardsPlayedThisTurn ?? 0;
    const metNote = combat ? (played < stats.drawIfCardsPlayedUnder ? '（已满足！）' : '（已超限）') : '';
    parts.push(`若本回合打出牌数少于 ${stats.drawIfCardsPlayedUnder} 张，抽 1 张牌${metNote}。`);
  }
  if (stats.weakIfEnemyAttacking) {
    parts.push(`若目标意图为攻击，给予 ${stats.weakIfEnemyAttacking} 层【虚弱】。`);
  }
  if (stats.drawAndDiscardNonZeroCost) {
    parts.push(`抽 ${stats.drawAndDiscardNonZeroCost} 张牌，将其中费用不为 0 的牌全部弃置。`);
  }
  if (stats.gainEnergyOnKill) {
    parts.push(`若击杀目标，获得 ${stats.gainEnergyOnKill} 点能量。`);
  }
  if (stats.retrieveAllZeroCostFromDiscard) {
    parts.push('将弃牌堆中所有费用为 0 的牌取回手牌。');
  }
  if (stats.addRandomPowerZeroCost) {
    parts.push('随机将 1 张故障机器人能力牌加入手牌，本回合其费用变为 0。');
  }
  if (stats.rebootDraw) {
    parts.push(`将所有手牌与弃牌堆洗入抽牌堆，然后抽 ${stats.rebootDraw} 张牌。`);
  }
  if (stats.gainOrbSlots) {
    parts.push(`获得 ${stats.gainOrbSlots} 个充能球槽位。`);
  }
  if (stats.removeOrbSlots) {
    parts.push(`失去 ${stats.removeOrbSlots} 个充能球槽位。`);
  }
  if (stats.channelOrb) {
    parts.push(`充能 1 个【${ORB_NAMES_ZH[stats.channelOrb] || stats.channelOrb}】。`);
  }
  if (Array.isArray(stats.channelOrbs) && stats.channelOrbs.length > 0) {
    const allSame = stats.channelOrbs.every((t) => t === stats.channelOrbs[0]);
    if (allSame) {
      parts.push(`充能 ${stats.channelOrbs.length} 个【${ORB_NAMES_ZH[stats.channelOrbs[0]] || stats.channelOrbs[0]}】。`);
    } else {
      parts.push(`依次充能 ${stats.channelOrbs.map((t) => `【${ORB_NAMES_ZH[t] || t}】`).join('、')}。`);
    }
  }
  if (stats.channelRandomOrbs) {
    parts.push(`充能 ${stats.channelRandomOrbs} 个随机充能球。`);
  }
  if (stats.channelFrostPerEnemy) {
    const aliveCnt = combat ? combat.enemies.filter((e) => e.hp > 0).length : null;
    const note = aliveCnt !== null ? `（当前 ${aliveCnt} 个）` : '';
    parts.push(`场上每有 1 名存活敌人，充能 1 个【冰霜球】${note}。`);
  }
  if (typeof stats.channelLightningX === 'number') {
    const xLabel = stats.channelLightningX > 0 ? `X+${stats.channelLightningX}` : 'X';
    parts.push(`充能 ${xLabel} 个【闪电球】。`);
  }
  if (stats.triggerAllDarkPassives) {
    parts.push('立即触发所有【黑暗球】的被动蓄能 1 次。');
  }
  if (stats.evokeFront) {
    parts.push(`激发队首的充能球 ${stats.evokeFront} 次。`);
  }
  if (typeof stats.evokeFrontX === 'number') {
    const xLabel = stats.evokeFrontX > 0 ? `X+${stats.evokeFrontX}` : 'X';
    parts.push(`激发队首的充能球 ${xLabel} 次。`);
  }
  if (stats.recursionFront) {
    parts.push('激发队首的充能球，并保留其数值重新充能至队尾。');
  }
  if (stats.fissionOrbs === 'remove') {
    parts.push('移除所有充能球，每个球为你提供 1 点能量并抽 1 张牌。');
  } else if (stats.fissionOrbs === 'evoke') {
    parts.push('激发所有充能球，每个球为你提供 1 点能量并抽 1 张牌！');
  }
  if (stats.scry && stats.cardId !== 'just_lucky' && stats.type === 'attack') {
    parts.push(`预见 ${stats.scry}。`);
  }
  if (stats.bonusDamagePerCombatMantra) {
    const gained = combat?.mantraGainedThisCombat ?? 0;
    const note = combat ? `（本场已获 ${gained} 点）` : '';
    parts.push(`本场战斗每获得 1 点【真言】，本牌额外造成 1 点伤害${note}。`);
  }
  if (stats.blockEqualUnblockedDamage) {
    parts.push('获得等同于本牌造成未格挡伤害量的格挡。');
  }
  if (stats.bonusDamagePerStrike) {
    parts.push(`牌组中每有 1 张名字含“打击”的牌，本牌伤害额外 +${stats.bonusDamagePerStrike}。`);
  }
  if (stats.damageDecayPerPlay) {
    parts.push(`本场战斗每次打出后基础伤害降低 ${stats.damageDecayPerPlay} 点。`);
  }
  if (stats.goldOnKill) {
    parts.push(`斩杀时，永久获得 ${stats.goldOnKill} 枚金币。`);
  }
  if (stats.maxHpOnKill) {
    parts.push(`斩杀时，永久提高 ${stats.maxHpOnKill} 点最大生命。`);
  }
  if (stats.fatalPermanentUpgrade) {
    parts.push('斩杀时，永久升级牌组中随机 1 张可升级卡牌。');
  }
  if (stats.judgmentThreshold) {
    parts.push(`若目标敌人当前生命值不高于 ${stats.judgmentThreshold} 点，立即将其生命值归零！`);
  }
  if (stats.applyMarkAndTrigger) {
    parts.push(`给予目标 ${stats.applyMarkAndTrigger} 层【印记】，随后所有敌人无视格挡失去等同于各自【印记】层数的生命。`);
  }
  if (stats.ifLastCardType) {
    const needLabel = stats.ifLastCardType.type === 'skill' ? '技能牌' : '攻击牌';
    const met = combat && combat.lastCardTypePlayed === stats.ifLastCardType.type;
    const activeNote = met ? '（已满足！）' : '';
    const effects = [];
    if (stats.ifLastCardType.applyEnemyStatuses?.vulnerable) {
      effects.push(`给予目标 ${stats.ifLastCardType.applyEnemyStatuses.vulnerable} 层易伤`);
    }
    if (stats.ifLastCardType.applyEnemyStatuses?.weak) {
      effects.push(`给予目标 ${stats.ifLastCardType.applyEnemyStatuses.weak} 层虚弱`);
    }
    if (stats.ifLastCardType.gainEnergy) {
      effects.push(`获得 ${stats.ifLastCardType.gainEnergy} 点能量`);
    }
    if (stats.ifLastCardType.draw) {
      effects.push(`抽 ${stats.ifLastCardType.draw} 张牌`);
    }
    parts.push(`若本场战斗上一张打出的是${needLabel}，${effects.join('并')}${activeNote}。`);
  }
  if (stats.ifTargetAttackingEnterStance) {
    const stName = STANCE_NAMES_ZH[stats.ifTargetAttackingEnterStance] || stats.ifTargetAttackingEnterStance;
    parts.push(`若目标的当前意图是攻击，进入【${stName}】姿态。`);
  }
  if (stats.ifInCalmDrawElseCalm) {
    const inCalmNote = currentStance === 'calm' ? '（当前在平静：将抽牌！）' : '';
    parts.push(`若当前处于【平静】姿态，抽 ${stats.ifInCalmDrawElseCalm} 张牌；否则进入【平静】姿态${inCalmNote}。`);
  }
  if (stats.ifInWrathVulnAllElseWrath) {
    const inWrathNote = currentStance === 'wrath' ? '（当前在愤怒：施加全体易伤！）' : '';
    parts.push(
      `若当前处于【愤怒】姿态，给予所有敌人 ${stats.ifInWrathVulnAllElseWrath} 层易伤；否则进入【愤怒】姿态${inWrathNote}。`
    );
  }
  if (stats.putTopDiscardToDraw) {
    parts.push('从弃牌堆选择 1 张牌置于抽牌堆顶。');
  }
  if (stats.reduceCostPerHpLossThisCombat) {
    const lostCount = combat?.hpLossCountThisCombat ?? 0;
    const note = combat && lostCount > 0 ? `（已减 ${lostCount} 费）` : '';
    parts.push(`本场战斗每失去 1 次生命，本牌费用永久 -1${note}。`);
  }
  if (stats.ifWeakBonusEnergy && stats.ifWeakDraw) {
    parts.push(`若目标处于【虚弱】状态，获得 ${stats.ifWeakBonusEnergy} 点能量并抽 ${stats.ifWeakDraw} 张牌。`);
  }
  if (stats.tempSingleEnemyStrengthLoss) {
    parts.push(`本回合使目标敌人临时失去 ${stats.tempSingleEnemyStrengthLoss} 点力量。`);
  }
  if (stats.plantBombDamage) {
    parts.push(`${stats.plantBombTurns || 3} 回合后的回合结束时，对所有敌人造成 ${stats.plantBombDamage} 点固定伤害！`);
  }
  if (stats.enterStance) {
    const stName = STANCE_NAMES_ZH[stats.enterStance] || stats.enterStance;
    parts.push(`进入【${stName}】姿态。`);
  }
  if (stats.exitStance) {
    parts.push('退出当前姿态。');
  }
  if (stats.gainMantra) {
    parts.push(`获得 ${stats.gainMantra} 点【真言】。`);
  }
  if (stats.returnOnStanceChange) {
    parts.push('每当你切换姿态时，将弃牌堆中的本牌返回手牌。');
  }
  if (stats.returnOnScry) {
    parts.push('每当你触发【预见】时，将弃牌堆中的本牌返回手牌。');
  }
  if (stats.shuffleSelfToDraw) {
    parts.push('打出后洗入抽牌堆。');
  }
  if (stats.bonusHitIfPoisoned) {
    parts.push(`若目标已【中毒】，则再造成 ${displayDamage} 点伤害。`);
  }
  if (stats.ifVulnerableBonusEnergy && stats.ifVulnerableDraw) {
    parts.push(`若目标处于【易伤】状态，获得 ${stats.ifVulnerableBonusEnergy} 点能量并抽 ${stats.ifVulnerableDraw} 张牌。`);
  }
  if (stats.spotWeaknessStrength) {
    parts.push(`若目标的当前意图是攻击，则获得 ${stats.spotWeaknessStrength} 点力量。`);
  }
  if (stats.refundEnergyIfDiscarded) {
    const activeNote = combat && (combat.discardedThisTurn ?? 0) > 0 ? '（已满足！）' : '';
    parts.push(`若本回合你曾主动弃过牌，回复 ${stats.refundEnergyIfDiscarded} 点能量${activeNote}。`);
  }
  if (stats.reduceCostPerDiscardThisTurn) {
    parts.push('本回合每主动弃掉 1 张牌，本牌费用 -1。');
  }
  if (stats.lifestealUnblocked) {
    parts.push('回复等同于未格挡伤害量的生命。');
  }
  if (stats.copySelfToDiscard) {
    parts.push('在弃牌堆中加入 1 张本牌的复制品。');
  }
  if (stats.strengthMultiplier && stats.strengthMultiplier > 1) {
    parts.push(`力量在该牌上发挥 ${stats.strengthMultiplier} 倍效果。`);
  }
  if (stats.bouncePoison && stats.bounces) {
    parts.push(`随机给予敌人 ${poisonDisplay(stats.bouncePoison)} 层中毒，共弹跳 ${stats.bounces} 次。`);
  }
  if (stats.multiplyPoison) {
    parts.push(
      stats.multiplyPoison >= 3
        ? '将目标当前的【中毒】层数变为 3 倍。'
        : '将目标当前的【中毒】层数翻倍。'
    );
  }
  if (stats.tempEnemyStrengthLoss) {
    parts.push(`本回合使所有敌人临时失去 ${stats.tempEnemyStrengthLoss} 点力量。`);
  }
  if (stats.xEnemyStrengthLoss && stats.xEnemyWeak) {
    const xLabel = stats.xBonus ? `X+${stats.xBonus}` : 'X';
    parts.push(`使目标失去 ${xLabel} 点力量并施加 ${xLabel} 层虚弱。`);
  }
  if (stats.applyEnemyStatuses) {
    const targetLabel = stats.target === 'all_enemies' ? '所有敌人' : '目标';
    if (stats.applyEnemyStatuses.poison) {
      parts.push(`给予${targetLabel} ${poisonDisplay(stats.applyEnemyStatuses.poison)} 层中毒。`);
    }
    if (stats.applyEnemyStatuses.corpseExplosion) {
      parts.push('目标死亡时，对所有存活敌人造成等同于其最大生命值的伤害。');
    }
    if (stats.applyEnemyStatuses.weak) {
      parts.push(`给予${targetLabel} ${stats.applyEnemyStatuses.weak} 层虚弱。`);
    }
    if (stats.applyEnemyStatuses.vulnerable) {
      parts.push(`给予${targetLabel} ${stats.applyEnemyStatuses.vulnerable} 层易伤。`);
    }
    if (stats.applyEnemyStatuses.lockOn) {
      parts.push(`给予${targetLabel} ${stats.applyEnemyStatuses.lockOn} 层【锁定】（充能球伤害 +50%）。`);
    }
    if (stats.applyEnemyStatuses.talkToTheHand) {
      parts.push(
        `本场战斗每当你攻击${targetLabel}时，获得 ${stats.applyEnemyStatuses.talkToTheHand} 点格挡。`
      );
    }
    if (stats.applyEnemyStatuses.choke) {
      parts.push(`本回合你每打出一张牌，目标额外失去 ${stats.applyEnemyStatuses.choke} 点生命。`);
    }
    if (typeof stats.applyEnemyStatuses.strength === 'number' && stats.applyEnemyStatuses.strength < 0) {
      parts.push(`使${targetLabel}失去 ${Math.abs(stats.applyEnemyStatuses.strength)} 点力量。`);
    }
  }
  if (stats.addCardsToHand && stats.addCardsToHand.cardId !== 'wound') {
    const tokenDef = CARD_LIBRARY[stats.addCardsToHand.cardId];
    const tokenName = tokenDef
      ? stats.addCardsToHand.upgraded
        ? `${tokenDef.name}+`
        : tokenDef.name
      : stats.addCardsToHand.cardId;
    parts.push(`将 ${stats.addCardsToHand.count} 张【${tokenName}】加入手牌。`);
  }
  if (Array.isArray(stats.addDrawCards)) {
    for (const spec of stats.addDrawCards) {
      const cName = CARD_LIBRARY[spec.cardId]?.name || spec.cardId;
      parts.push(`将 ${spec.count} 张【${cName}】洗入抽牌堆。`);
    }
  }
  if (Array.isArray(stats.addDiscardCards)) {
    for (const spec of stats.addDiscardCards) {
      const cName = CARD_LIBRARY[spec.cardId]?.name || spec.cardId;
      parts.push(`将 ${spec.count} 张【${cName}】放入弃牌堆。`);
    }
  }
  if (stats.obtainRandomPotion) {
    parts.push('随机获得 1 瓶药水。');
  }
  if (stats.gambleDiscardAll) {
    parts.push('弃掉所有手牌，然后抽取同等数量的牌。');
  }
  if (stats.discardAllForShivs) {
    parts.push(
      stats.shivUpgraded
        ? '弃掉所有手牌，每弃 1 张便将 1 张【小刀+】加入手牌。'
        : '弃掉所有手牌，每弃 1 张便将 1 张【小刀】加入手牌。'
    );
  }
  if (stats.drawUntilHandFull) {
    parts.push('抽牌直至你的手牌达到上限（10 张）。');
  } else if (stats.drawUpToHandSize) {
    parts.push(`抽牌直至你的手牌达到 ${stats.drawUpToHandSize} 张。`);
  } else if (stats.drawIfNoAttackInHand) {
    parts.push(`若手中没有任何攻击牌，抽 ${stats.drawIfNoAttackInHand} 张牌。`);
  } else if (stats.drawAttacksFromDrawPile) {
    parts.push(`从抽牌堆随机抽取最多 ${stats.drawAttacksFromDrawPile} 张攻击牌加入手牌。`);
  } else if (stats.draw) {
    if (stats.drawSkillGainBlock) {
      parts.push(`抽 ${stats.draw} 张牌；若抽到技能牌，再获得 ${displaySkillBonusBlock} 点格挡。`);
    } else {
      parts.push(`抽 ${stats.draw} 张牌。`);
    }
  }
  if (stats.discardRandomHand) {
    parts.push(`随机弃置 ${stats.discardRandomHand} 张手牌。`);
  }
  if (stats.discardHand) {
    parts.push(`选择并弃掉 ${stats.discardHand} 张手牌。`);
  }
  if (stats.putHandToDrawTopChoice) {
    parts.push(
      stats.setZeroCostUntilPlayedOnDrawTop
        ? `选择并将 ${stats.putHandToDrawTopChoice} 张手牌置于抽牌堆顶，直至打出前费用变为 0。`
        : `选择并将 ${stats.putHandToDrawTopChoice} 张手牌置于抽牌堆顶。`
    );
  }
  if (stats.putHandToDrawBottomChoice || stats.putHandToDrawBottomMultiChoice) {
    const qtyLabel = stats.putHandToDrawBottomMultiChoice
      ? '任意数量'
      : `${stats.putHandToDrawBottomChoice} 张`;
    parts.push(
      stats.setZeroCostUntilPlayedOnDrawBottom
        ? `选择将 ${qtyLabel}手牌置于抽牌堆底，直至打出前费用变为 0。`
        : `选择将 ${qtyLabel}手牌置于抽牌堆底。`
    );
  }
  if (stats.addRandomCardToHand) {
    const cfg = stats.addRandomCardToHand;
    const typeLabel = cfg.type === 'attack' ? '攻击牌' : cfg.type === 'skill' ? '技能牌' : '卡牌';
    const charLabel =
      cfg.character === 'ironclad'
        ? '铁甲战士'
        : cfg.character === 'silent'
          ? '静默猎手'
          : cfg.character === 'watcher'
            ? '观者'
            : cfg.character === 'defect'
              ? '故障机器人'
              : '';
    parts.push(
      `随机将 1 张${charLabel}${typeLabel}加入手牌${cfg.tempZeroCostTurn ? '，本回合费用变为 0' : ''}。`
    );
  }
  if (stats.discoverCardChoice) {
    const cfg = stats.discoverCardChoice;
    const poolLabel = cfg.pool === 'any_attack' ? '随机跨职业攻击牌' : '随机本职业卡牌';
    parts.push(
      `从 ${cfg.count || 3} 张${poolLabel}中选择 1 张加入手牌${cfg.tempZeroCostTurn ? '，本回合费用变为 0' : ''}。`
    );
  }
  if (stats.addRandomColorlessToHand) {
    parts.push(`随机将 ${stats.addRandomColorlessToHand} 张无色牌加入手牌。`);
  }
  if (stats.shuffleRandomZeroCostToDraw) {
    const cfg = stats.shuffleRandomZeroCostToDraw;
    const typeLabel = cfg.type === 'attack' ? '攻击牌' : '技能牌';
    parts.push(`将 ${cfg.count} 张随机本职业${typeLabel}洗入抽牌堆，它们在本场战斗中费用为 0。`);
  }
  if (stats.transmuteColorlessX) {
    parts.push(
      `随机将 X 张${stats.transmuteUpgraded ? '已升级的' : ''}无色牌加入手牌，本回合费用变为 0。`
    );
  }
  if (stats.randomHandZeroCostCombat) {
    parts.push('使随机 1 张手牌在本场战斗中费用变为 0。');
  }
  if (stats.capHandCostToOne) {
    parts.push(
      stats.capHandCostToOne === 'combat'
        ? '将当前手牌中所有费用高于 1 的卡牌在本场战斗中降至 1 费。'
        : '将当前手牌中所有费用高于 1 的卡牌在本回合内降至 1 费。'
    );
  }
  if (stats.zeroAllHandCostThisTurn) {
    parts.push('本回合内，手牌中所有卡牌费用变为 0。');
  }
  if (typeof stats.nextTurnDrawAndEnergyX === 'number') {
    const xExpr = stats.nextTurnDrawAndEnergyX > 0 ? `X+${stats.nextTurnDrawAndEnergyX}` : 'X';
    parts.push(`下回合抽 ${xExpr} 张牌并获得 ${xExpr} 点能量。`);
  }
  if (stats.nightmareHandChoice) {
    parts.push(`选择 1 张手牌，下回合开始时将 ${stats.nightmareHandChoice} 张它的复制品加入手牌。`);
  }
  if (typeof stats.collectMiracleTurnsX === 'number') {
    const xExpr = stats.collectMiracleTurnsX > 0 ? `X+${stats.collectMiracleTurnsX}` : 'X';
    parts.push(`在接下来 ${xExpr} 个回合开始时，将 1 张【奇迹+】加入手牌。`);
  }
  if (stats.wishChoice) {
    const w = stats.wishChoice;
    parts.push(
      `任选一项愿望：获得 ${w.platedArmor} 层多层护甲、${w.strength} 点力量，或获得 ${w.gold} 金币。`
    );
  }
  if (typeof stats.conjureExpungerX === 'number') {
    const xExpr = stats.conjureExpungerX > 0 ? `X+${stats.conjureExpungerX}` : 'X';
    parts.push(`将 1 张攻击次数为 ${xExpr} 的【灭除之刃】洗入抽牌堆。`);
  }
  if (stats.applySelfStatuses) {
    if (stats.applySelfStatuses.strength) {
      parts.push(`获得 ${stats.applySelfStatuses.strength} 点力量。`);
    }
    if (stats.applySelfStatuses.vigor) {
      parts.push(`你的下一张攻击牌额外造成 ${stats.applySelfStatuses.vigor} 点伤害。`);
    }
    if (stats.applySelfStatuses.dexterity) {
      parts.push(`获得 ${stats.applySelfStatuses.dexterity} 点敏捷。`);
    }
    if (stats.applySelfStatuses.energyDownEachTurn) {
      parts.push(`每回合开始时减少 ${stats.applySelfStatuses.energyDownEachTurn} 点能量。`);
    }
    if (stats.applySelfStatuses.tempStrengthDown) {
      parts.push(`本回合结束时，失去 ${stats.applySelfStatuses.tempStrengthDown} 点力量。`);
    }
    if (stats.applySelfStatuses.metallicize) {
      parts.push(`回合结束时，获得 ${stats.applySelfStatuses.metallicize} 点格挡。`);
    }
    if (stats.applySelfStatuses.demonForm) {
      parts.push(`每回合开始时，获得 ${stats.applySelfStatuses.demonForm} 点力量。`);
    }
    if (stats.applySelfStatuses.feelNoPain) {
      parts.push(`每当你消耗 1 张牌时，获得 ${stats.applySelfStatuses.feelNoPain} 点格挡。`);
    }
    if (stats.applySelfStatuses.darkEmbrace) {
      parts.push(`每当你消耗 1 张牌时，抽 ${stats.applySelfStatuses.darkEmbrace} 张牌。`);
    }
    if (stats.applySelfStatuses.barricade) {
      parts.push('你的格挡在回合开始时不再自动清零。');
    }
    if (stats.applySelfStatuses.blur) {
      parts.push('你的格挡在下回合开始时不会自动清零。');
    }
    if (stats.applySelfStatuses.energized) {
      parts.push(`下回合获得 ${stats.applySelfStatuses.energized} 点能量。`);
    }
    if (stats.applySelfStatuses.drawCardNextTurn) {
      parts.push(`下回合额外抽 ${stats.applySelfStatuses.drawCardNextTurn} 张牌。`);
    }
    if (stats.applySelfStatuses.evolve) {
      parts.push(`每当你抽到【状态】牌时，抽 ${stats.applySelfStatuses.evolve} 张牌。`);
    }
    if (stats.applySelfStatuses.fireBreathing) {
      parts.push(`每当你抽到【状态】或【诅咒】牌时，对所有敌人造成 ${stats.applySelfStatuses.fireBreathing} 点伤害。`);
    }
    if (stats.applySelfStatuses.rupture) {
      parts.push(`每当你从卡牌中失去生命时，获得 ${stats.applySelfStatuses.rupture} 点力量。`);
    }
    if (stats.applySelfStatuses.juggernaut) {
      parts.push(`每当你获得格挡时，对随机一名敌人造成 ${stats.applySelfStatuses.juggernaut} 点伤害。`);
    }
    if (stats.applySelfStatuses.thorns) {
      parts.push(`每当你被攻击时，反击攻击者 ${stats.applySelfStatuses.thorns} 点伤害。`);
    }
    if (stats.applySelfStatuses.burst) {
      parts.push(`本回合打出的下 ${stats.applySelfStatuses.burst} 张技能牌将额外再打出一次。`);
    }
    if (stats.applySelfStatuses.corruption) {
      parts.push('所有技能牌费用变为 0 点，但打出后将直接消耗。');
    }
    if (stats.applySelfStatuses.flameBarrier) {
      parts.push(`本回合每受一次攻击，反击 ${stats.applySelfStatuses.flameBarrier} 点伤害。`);
    }
    if (stats.applySelfStatuses.sadisticNature) {
      parts.push(`每当你对敌人施加 1 个负面状态时，对其造成 ${stats.applySelfStatuses.sadisticNature} 点伤害。`);
    }
    if (stats.applySelfStatuses.noxiousFumes) {
      parts.push(`每回合开始时，给予所有敌人 ${stats.applySelfStatuses.noxiousFumes} 层中毒。`);
    }
    if (stats.applySelfStatuses.accuracy) {
      parts.push(`【小刀】造成的伤害额外 +${stats.applySelfStatuses.accuracy}。`);
    }
    if (stats.applySelfStatuses.infiniteBlades) {
      parts.push(`每回合开始时，将 ${stats.applySelfStatuses.infiniteBlades} 张【小刀】加入手牌。`);
    }
    if (stats.applySelfStatuses.envenom) {
      parts.push(`每当你造成未格挡的攻击伤害时，给予目标 ${stats.applySelfStatuses.envenom} 层中毒。`);
    }
    if (stats.applySelfStatuses.afterImage) {
      parts.push(`每当你打出一张牌时，获得 ${stats.applySelfStatuses.afterImage} 点格挡。`);
    }
    if (stats.applySelfStatuses.thousandCuts) {
      parts.push(`每当你打出一张牌时，对所有敌人造成 ${stats.applySelfStatuses.thousandCuts} 点伤害。`);
    }
    if (stats.applySelfStatuses.intangible) {
      parts.push(`获得 ${stats.applySelfStatuses.intangible} 层【无实体】。`);
    }
    if (stats.applySelfStatuses.wraithForm) {
      parts.push(`每回合开始时，失去 ${stats.applySelfStatuses.wraithForm} 点敏捷。`);
    }
    if (stats.applySelfStatuses.toolsOfTheTrade) {
      parts.push(
        `每回合开始时，额外抽 ${stats.applySelfStatuses.toolsOfTheTrade} 张牌并弃掉 ${stats.applySelfStatuses.toolsOfTheTrade} 张手牌。`
      );
    }
    if (stats.applySelfStatuses.likeWater) {
      parts.push(`回合结束时若处于【平静】姿态，获得 ${stats.applySelfStatuses.likeWater} 点格挡。`);
    }
    if (stats.applySelfStatuses.mentalFortress) {
      parts.push(`每当你切换姿态时，获得 ${stats.applySelfStatuses.mentalFortress} 点格挡。`);
    }
    if (stats.applySelfStatuses.rushdown) {
      parts.push(`每当你进入【愤怒】姿态时，抽 ${stats.applySelfStatuses.rushdown} 张牌。`);
    }
    if (stats.applySelfStatuses.nirvana) {
      parts.push(`每次触发【预见】时至少获得 ${stats.applySelfStatuses.nirvana} 点格挡（每弃置 1 张牌提供 ${stats.applySelfStatuses.nirvana} 点）。`);
    }
    if (stats.applySelfStatuses.foresight) {
      parts.push(`每回合开始时，触发【预见 ${stats.applySelfStatuses.foresight}】。`);
    }
    if (stats.applySelfStatuses.devotion) {
      parts.push(`每回合开始时，获得 ${stats.applySelfStatuses.devotion} 点【真言】。`);
    }
    if (stats.applySelfStatuses.establishment) {
      parts.push(`每当手牌在回合结束被【保留】时，其本场战斗费用 -${stats.applySelfStatuses.establishment}。`);
    }
    if (stats.applySelfStatuses.devaForm) {
      parts.push('每回合开始时，获得不断递增的额外能量（+1、+2、+3…）。');
    }
    if (stats.applySelfStatuses.omega) {
      parts.push(`每回合结束时，对所有敌人造成 ${stats.applySelfStatuses.omega} 点固定伤害。`);
    }
    if (stats.applySelfStatuses.blasphemer) {
      parts.push('下个你的回合开始时，你将承受致命反噬伤害！');
    }
    if (stats.applySelfStatuses.simmeringFury) {
      parts.push(`下回合开始时进入【愤怒】姿态并额外抽 ${stats.applySelfStatuses.simmeringFury} 张牌。`);
    }
    if (stats.applySelfStatuses.artifact) {
      parts.push(`获得 ${stats.applySelfStatuses.artifact} 层【人工制品】。`);
    }
    if (stats.applySelfStatuses.vulnerable) {
      parts.push(`自身获得 ${stats.applySelfStatuses.vulnerable} 层【易伤】。`);
    }
    if (stats.applySelfStatuses.doubleTap) {
      parts.push(`本回合你打出的下 ${stats.applySelfStatuses.doubleTap} 张攻击牌额外再打出一次。`);
    }
    if (stats.applySelfStatuses.rage) {
      parts.push(`本回合你每打出 1 张攻击牌，获得 ${stats.applySelfStatuses.rage} 点格挡。`);
    }
    if (stats.applySelfStatuses.combust) {
      parts.push(`每回合结束时失去 1 点生命，对所有敌人造成 ${stats.applySelfStatuses.combust} 点伤害。`);
    }
    if (stats.applySelfStatuses.berserk) {
      parts.push(`每回合开始时额外获得 ${stats.applySelfStatuses.berserk} 点能量。`);
    }
    if (stats.applySelfStatuses.wellLaidPlans) {
      parts.push(`回合结束时，你可以选择保留手中最多 ${stats.applySelfStatuses.wellLaidPlans} 张牌。`);
    }
    if (stats.applySelfStatuses.phantasmal) {
      parts.push('下回合你打出的所有攻击牌造成双倍伤害！');
    }
    if (stats.applySelfStatuses.freeAttackPower) {
      parts.push(`你打出的下 ${stats.applySelfStatuses.freeAttackPower} 张攻击牌费用变为 0（跨回合保留）。`);
    }
    if (stats.applySelfStatuses.waveOfTheHand) {
      parts.push(`本回合你每获得 1 次格挡，给予所有敌人 ${stats.applySelfStatuses.waveOfTheHand} 层虚弱。`);
    }
    if (stats.applySelfStatuses.battleHymn) {
      parts.push(`每回合开始时将 ${stats.applySelfStatuses.battleHymn} 张【惩恶】加入手牌。`);
    }
    if (stats.applySelfStatuses.masterReality) {
      parts.push('战斗中新生成的卡牌将自动升级！');
    }
    if (stats.applySelfStatuses.panache) {
      parts.push(`每回合每累计打出 5 张牌，对所有敌人造成 ${stats.applySelfStatuses.panache} 点伤害。`);
    }
    if (stats.applySelfStatuses.buffer) {
      parts.push(`获得 ${stats.applySelfStatuses.buffer} 层【缓冲】（抵消接下来 ${stats.applySelfStatuses.buffer} 次生命值损失）。`);
    }
    if (typeof stats.applySelfStatuses.focus === 'number' && stats.applySelfStatuses.focus !== 0) {
      if (stats.applySelfStatuses.focus > 0) {
        parts.push(`获得 ${stats.applySelfStatuses.focus} 点【集中】。`);
      } else {
        parts.push(`失去 ${Math.abs(stats.applySelfStatuses.focus)} 点【集中】。`);
      }
    }
    if (stats.applySelfStatuses.biasedCognition) {
      parts.push(`每回合开始时，失去 ${stats.applySelfStatuses.biasedCognition} 点【集中】。`);
    }
    if (stats.applySelfStatuses.electro) {
      parts.push('你的【闪电球】改为攻击所有敌人。');
    }
    if (stats.applySelfStatuses.loop) {
      parts.push(`每回合开始时，额外触发队首充能球的被动效果 ${stats.applySelfStatuses.loop} 次。`);
    }
    if (stats.applySelfStatuses.heatsinks) {
      parts.push(`每当你打出 1 张能力牌，抽 ${stats.applySelfStatuses.heatsinks} 张牌。`);
    }
    if (stats.applySelfStatuses.storm) {
      parts.push(`每当你打出 1 张能力牌，充能 ${stats.applySelfStatuses.storm} 个【闪电球】。`);
    }
    if (stats.applySelfStatuses.staticDischarge) {
      parts.push(`每次受到未格挡的攻击伤害时，充能 ${stats.applySelfStatuses.staticDischarge} 个【闪电球】。`);
    }
    if (stats.applySelfStatuses.creativeAi) {
      parts.push(`每回合开始时，随机将 ${stats.applySelfStatuses.creativeAi} 张故障机器人能力牌加入手牌。`);
    }
    if (stats.applySelfStatuses.echoForm) {
      parts.push(`每回合打出的第 1 张牌会额外再打出一次。`);
    }
    if (stats.applySelfStatuses.selfRepair) {
      parts.push(`战斗胜利后，回复 ${stats.applySelfStatuses.selfRepair} 点生命。`);
    }
    if (stats.applySelfStatuses.helloWorld) {
      parts.push(`每回合开始时，将 ${stats.applySelfStatuses.helloWorld} 张随机普通故障机器人牌加入手牌。`);
    }
    if (stats.applySelfStatuses.amplify) {
      parts.push(`本回合打出的下 ${stats.applySelfStatuses.amplify} 张能力牌额外再打出一次。`);
    }
    if (stats.applySelfStatuses.equilibrium) {
      parts.push('本回合结束时保留所有手牌。');
    }
    if (stats.applySelfStatuses.rebound) {
      parts.push(`本回合打出的下 ${stats.applySelfStatuses.rebound} 张牌改为置于抽牌堆顶。`);
    }
    if (stats.applySelfStatuses.machineLearning) {
      parts.push(`每回合开始时，额外抽 ${stats.applySelfStatuses.machineLearning} 张牌。`);
    }
    if (stats.applySelfStatuses.brutality) {
      parts.push(`每回合开始时，失去 ${stats.applySelfStatuses.brutality} 点生命并抽 ${stats.applySelfStatuses.brutality} 张牌。`);
    }
    if (stats.applySelfStatuses.study) {
      parts.push(`每回合结束时，将 ${stats.applySelfStatuses.study} 张【洞见】洗入抽牌堆。`);
    }
    if (stats.applySelfStatuses.magnetism) {
      parts.push(`每回合开始时，将 ${stats.applySelfStatuses.magnetism} 张随机无色牌加入手牌。`);
    }
    if (stats.applySelfStatuses.mayhem) {
      parts.push(`每回合开始时，自动打出抽牌堆顶的 ${stats.applySelfStatuses.mayhem} 张牌。`);
    }
  }
  if (stats.applySelfStatusesAfter?.noDraw) {
    parts.push('本回合内不能再抽牌。');
  }
  if (stats.applySelfStatusesAfter?.noBlock) {
    parts.push(`接下来 ${stats.applySelfStatusesAfter.noBlock} 回合内无法从卡牌获得格挡。`);
  }
  if (stats.extraTurn) {
    parts.push('跳过敌方回合，立即开始你的下一个新回合！');
  }
  if (stats.endTurnAfter) {
    parts.push('立即结束你的回合。');
  }

  const corruptedExhaust =
    stats.type === 'skill' && !stats.exhaust && Boolean(player && (player.statuses?.corruption ?? 0) > 0);
  if (stats.exhaust || corruptedExhaust) {
    parts.push('消耗。');
  }

  const effectiveCost = getEffectiveCardCost(stats, player, combat);
  const corruptedZero =
    stats.type === 'skill' && Boolean(player && (player.statuses?.corruption ?? 0) > 0);
  const costRandomizedNow = typeof stats.combatCost === 'number' && !corruptedZero;
  const costIncreasedNow =
    typeof stats.cost === 'number' &&
    typeof effectiveCost === 'number' &&
    effectiveCost > stats.cost;
  const costReducedNow =
    !costIncreasedNow &&
    ((typeof stats.cost === 'number' &&
      typeof effectiveCost === 'number' &&
      effectiveCost < stats.cost) ||
      (!costRandomizedNow && stats.costReduced));

  return {
    text: parts.join(' '),
    displayDamage,
    displayBlock,
    damageState,
    blockState,
    displayCost: effectiveCost === null ? '—' : String(effectiveCost),
    costReducedNow,
    costIncreasedNow,
    costRandomizedNow,
  };
}

function tokenizeUpgradeDiff(text) {
  return String(text || '').match(/(\d+|【[^】]+】|\s+|.)/g) || [];
}

function diffUpgradeDescriptionSegments(baseText, nextText) {
  const a = tokenizeUpgradeDiff(baseText);
  const b = tokenizeUpgradeDiff(nextText);
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));

  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      if (a[i] === b[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = dp[i + 1][j] >= dp[i][j + 1] ? dp[i + 1][j] : dp[i][j + 1];
      }
    }
  }

  const raw = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      raw.push({ text: b[j], changed: false });
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i += 1;
    } else {
      raw.push({ text: b[j], changed: true });
      j += 1;
    }
  }
  while (j < m) {
    raw.push({ text: b[j], changed: true });
    j += 1;
  }

  const merged = [];
  for (const item of raw) {
    if (merged.length > 0 && merged[merged.length - 1].changed === item.changed) {
      merged[merged.length - 1].text += item.text;
    } else {
      merged.push({ ...item });
    }
  }

  // Merge whitespace-only separator sandwiched between two changed segments (e.g. "变为 3")
  for (let k = 1; k < merged.length - 1; k += 1) {
    if (
      !merged[k].changed &&
      /^\s+$/.test(merged[k].text) &&
      merged[k - 1].changed &&
      merged[k + 1].changed
    ) {
      merged[k - 1].text += merged[k].text + merged[k + 1].text;
      merged.splice(k, 2);
      k -= 1;
    }
  }

  // Keep leading/trailing whitespace outside changed spans
  const clean = [];
  const pushSeg = (text, changed) => {
    if (!text) return;
    if (clean.length > 0 && clean[clean.length - 1].changed === changed) {
      clean[clean.length - 1].text += text;
    } else {
      clean.push({ text, changed });
    }
  };
  for (const seg of merged) {
    if (!seg.changed) {
      pushSeg(seg.text, false);
    } else {
      const mLead = seg.text.match(/^(\s*)(.*?)(\s*)$/s);
      pushSeg(mLead[1], false);
      pushSeg(mLead[2], true);
      pushSeg(mLead[3], false);
    }
  }
  return clean;
}

export function formatUpgradePreview(cardInstance, combatContext = null) {
  if (!canUpgradeCard(cardInstance)) return null;

  const def = CARD_LIBRARY[cardInstance.cardId];
  const curLvl = def?.infiniteUpgrade
    ? Number.isInteger(cardInstance.upgradeLevel)
      ? Math.max(0, cardInstance.upgradeLevel)
      : cardInstance.upgraded
        ? 1
        : 0
    : 0;
  const baseCard = def?.infiniteUpgrade
    ? { ...cardInstance, upgraded: curLvl > 0, upgradeLevel: curLvl, combatCost: undefined }
    : { ...cardInstance, upgraded: false, combatCost: undefined };
  const nextCard = def?.infiniteUpgrade
    ? { ...cardInstance, upgraded: true, upgradeLevel: curLvl + 1, combatCost: undefined }
    : { ...cardInstance, upgraded: true, combatCost: undefined };
  const baseStats = getCardStats(baseCard);
  const nextStats = getCardStats(nextCard);
  const baseDesc = formatCardDescription(baseCard, combatContext);
  const nextDesc = formatCardDescription(nextCard, combatContext);

  const prefixParts = [];
  if (
    typeof baseStats.cost === 'number' &&
    typeof nextStats.cost === 'number' &&
    nextStats.cost < baseStats.cost
  ) {
    const reducedBy = baseStats.cost - nextStats.cost;
    prefixParts.push(`费用 ${baseStats.cost} → ${nextStats.cost}（减少 ${reducedBy} 点）。`);
  } else if (baseDesc.displayCost !== nextDesc.displayCost) {
    prefixParts.push(`费用 ${baseDesc.displayCost} → ${nextDesc.displayCost}。`);
  }
  if (baseStats.exhaust && !nextStats.exhaust) {
    prefixParts.push('不再消耗。');
  }
  if (baseStats.ethereal && !nextStats.ethereal) {
    prefixParts.push('不再虚无。');
  }
  const prefixText = prefixParts.join(' ');

  const descSegments = diffUpgradeDescriptionSegments(baseDesc.text, nextDesc.text);
  const segments = [];
  if (prefixText) {
    segments.push({ text: prefixText, changed: true });
    if (nextDesc.text) {
      segments.push({ text: ' ', changed: false });
    }
  }
  for (const seg of descSegments) {
    if (segments.length > 0 && segments[segments.length - 1].changed === seg.changed) {
      segments[segments.length - 1].text += seg.text;
    } else {
      segments.push(seg);
    }
  }

  return {
    text: prefixText ? `${prefixText} ${nextDesc.text}`.trim() : nextDesc.text,
    segments,
    costReduced: Boolean(
      typeof baseStats.cost === 'number' &&
        typeof nextStats.cost === 'number' &&
        nextStats.cost < baseStats.cost
    ),
    baseCost: baseDesc.displayCost,
    nextCost: nextDesc.displayCost,
  };
}
