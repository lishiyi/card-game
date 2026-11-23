import { getEnemyIntentPreview } from '../../engine/math.js';
import { nextRandom } from '../../engine/rng.js';
import { ENEMY_TEMPLATES } from './templates.js';
import { applyAscensionIntentScaling } from './scaling.js';
import {
  ACT1_ENEMY_AI_HANDLERS,
  getGuardianDefensiveIntent,
  getGuardianOffensiveIntent,
} from './ai_act1.js';
import { ACT2_ENEMY_AI_HANDLERS } from './ai_act2.js';
import { ACT3_4_ENEMY_AI_HANDLERS } from './ai_act3_4.js';

export { getGuardianDefensiveIntent, getGuardianOffensiveIntent };

export const ENEMY_INTENT_HANDLERS = Object.freeze({
  ...ACT1_ENEMY_AI_HANDLERS,
  ...ACT2_ENEMY_AI_HANDLERS,
  ...ACT3_4_ENEMY_AI_HANDLERS,
});

export function getEnemyIntentCandidates(enemy, player = null, combat = null) {
  const handler = ENEMY_INTENT_HANDLERS[enemy.templateId];
  if (handler) {
    return handler(enemy, player, combat);
  }
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
    const childNames = curIntent.splitInto
      .map((cid) => ENEMY_TEMPLATES[cid]?.name || cid)
      .join('与');
    const detail = `分裂为${childNames}（各 ${splitHp} 点生命），分裂体将于下回合开始行动`;
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
          label: '双史莱姆行动',
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
  const nextEntangleUsed = Boolean(enemy.entangleUsed || curIntent?.markEntangleUsed);
  const nextStasisUsed = Boolean(enemy.stasisUsed || curIntent?.stasisSteal);
  const nextHeartBuffCount = (enemy.heartBuffCount ?? 0) + (curIntent?.isHeartBuff ? 1 : 0);

  if (curIntent?.isHeartBuff) {
    if ((simEnemyStatuses.strength ?? 0) < 0) {
      delete simEnemyStatuses.strength;
    }
    const bonusStr =
      (enemy.heartBuffCount ?? 0) === 3 ? 12 : (enemy.heartBuffCount ?? 0) >= 4 ? 52 : 2;
    simEnemyStatuses.strength = (simEnemyStatuses.strength ?? 0) + bonusStr;
  }

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
    entangleUsed: nextEntangleUsed,
    stasisUsed: nextStasisUsed,
    heartBuffCount: nextHeartBuffCount,
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
  const tplSplit = ENEMY_TEMPLATES[enemy.templateId]?.splitInto;
  if (enemy.templateId === 'the_guardian' && enemy.mode === 'offensive') {
    conditionalNote = '若本回合触发【形态转换】，将切换防御形态并使用【翻滚撞击】';
  } else if (
    Array.isArray(tplSplit) &&
    tplSplit.length > 0 &&
    (enemy.statuses?.splitThreshold ?? 0) > 0 &&
    enemy.hp > Math.floor(enemy.maxHp / 2)
  ) {
    const splitName =
      enemy.templateId === 'slime_boss'
        ? '巨体分裂'
        : enemy.templateId === 'acid_slime_l'
          ? '酸液分裂'
          : '尖刺分裂';
    conditionalNote = `若生命降至 ${Math.floor(enemy.maxHp / 2)} 或以下，下回合将打断行动改为【${splitName}】并继承当前生命值`;
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
  } else if (enemy.templateId === 'gremlin_wizard') {
    conditionalNote = '蓄力 2 回合后将释放 25 点高伤【终极冲击波】，优先集火击杀！';
  } else if (enemy.templateId === 'slaver_red' && !enemy.entangleUsed) {
    conditionalNote = '尚未施放【投网缠缚】（使你下回合无法打出攻击牌），可保留人工制品或防御牌应对！';
  } else if (enemy.templateId === 'gremlin_leader') {
    conditionalNote = '优先清理【地精】爪牙可迫使其消耗回合吹响【集结号角】而非强化全队！';
  } else if (enemy.templateId === 'bronze_automaton') {
    conditionalNote = '开场部署 2 台【青铜球】爪牙；击败本体后剩余青铜球会直接逃跑，击毁青铜球可夺回被封印卡牌！';
  } else if (enemy.templateId === 'bronze_orb') {
    conditionalNote = enemy.stasisCard
      ? '该青铜球已通过【静止力场】封印你的一张卡牌，击毁它即可立即归还手牌！'
      : '【静止力场】会封印你抽牌/弃牌堆中稀有度最高的一张牌，击毁后归还！';
  } else if (enemy.templateId === 'the_collector') {
    conditionalNote = '首回合召唤 2 名【火炬头】爪牙，第 4 回合施放【你属于我！】三重诅咒；击败本体后爪牙逃跑直接获胜！';
  } else if (enemy.templateId === 'hexaghost' && enemy.turnIndex === 0) {
    conditionalNote = '【分裂烈焰】每段伤害 = max(2, ⌊你当前生命 ÷ 14⌋ + 1)（随当前生命动态变化）';
  } else if (enemy.templateId === 'the_champ' && (enemy.champPhase ?? 1) === 1 && enemy.hp > Math.floor(enemy.maxHp / 2)) {
    conditionalNote = `若生命降至 ${Math.floor(enemy.maxHp / 2)} 或以下，下回合将施放【狂暴怒吼】（清负面 +6力量）`;
  } else if (enemy.templateId === 'time_eater' && !enemy.hasteUsed && enemy.hp > Math.floor(enemy.maxHp / 2)) {
    conditionalNote = `注意【时间扭曲】（剩 ${enemy.statuses?.timeWarp ?? 12} 张牌）；半血以下将触发回血加速`;
  } else if (enemy.templateId === 'awakened_one' && enemy.unawakened) {
    conditionalNote = `首次击倒后将触发【黑暗重生】复活进入 ${enemy.maxHp} 生命二阶段形态！`;
  } else if (enemy.templateId === 'spire_shield' || enemy.templateId === 'spire_spear') {
    conditionalNote =
      (player?.statuses?.surrounded ?? 0) > 0
        ? '【夹击】生效中：背侧敌人攻击伤害 +50%，对高威胁敌人打出单体攻击可转向面对它；优先击杀其中一人即可解除夹击！'
        : '夹击已解除，注意高额格挡与灼伤爆发！';
  } else if (enemy.templateId === 'corrupt_heart') {
    const remCap = enemy.statuses?.invincible ?? 0;
    const beat = enemy.statuses?.beatOfDeath ?? 1;
    conditionalNote = `【无敌】本回合剩余可承伤 ${remCap} 点（下回合重置为 ${enemy.invincibleMax || 200}）；【死亡律动】每出 1 张牌受 ${beat} 点可格挡伤害！`;
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
