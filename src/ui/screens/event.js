/**
 * Unknown Event screen renderer (narrative choices, card upgrade/transform/purge sub-flows, and Library draft).
 */

import {
  EVENT_LIBRARY,
  getEventChoicesForAscension,
  getEventTuning,
} from '../../data/events.js';
import { getUpgradableDeckCards, playerHasHeavyAttackCard } from '../../engine/game.js';
import { escapeHtml, renderCardHtml } from '../helpers.js';

export function renderEventScreen({ state, ui }) {
  const evState = state.eventState;
  const evDef = evState ? EVENT_LIBRARY[evState.eventId] : null;
  if (!evDef) return '';

  let bodyHtml = '';
  if (evState.pendingPurge) {
    const deckHtml = state.player.deck
      .map((c) =>
        renderCardHtml(c, {
          idPrefix: 'event-purge-card',
          action: 'confirm-event-purge',
          playable: true,
        })
      )
      .join('');

    const hpNote =
      (evState.purgeHpCost ?? 0) > 0 ? `（确认移除后将失去 ${evState.purgeHpCost} 点生命）` : '';

    bodyHtml = `
      <p class="stage-subtitle" style="margin-bottom:12px;">请选择要从牌组中永久移除的 1 张卡牌${escapeHtml(hpNote)}：</p>
      <div class="card-showcase">${deckHtml}</div>
      <button type="button" id="btn-cancel-event-purge" class="btn-stone" data-action="cancel-event-purge">返回重选</button>
    `;
  } else if (evState.pendingCardAction) {
    const isUpgrade = evState.pendingCardAction === 'upgrade';
    const isRareTransform = evState.pendingCardAction === 'transform_rare';
    const candidateCards = isUpgrade ? getUpgradableDeckCards(state) : state.player.deck;
    const cardsHtml = candidateCards
      .map((c) =>
        renderCardHtml(c, {
          idPrefix: 'event-action-card',
          action: 'confirm-event-card-action',
          playable: true,
          showUpgradePreview: isUpgrade,
        })
      )
      .join('');

    bodyHtml = `
      <p class="stage-subtitle" style="margin-bottom:12px;">
        ${
          isUpgrade
            ? '请选择牌组中要永久强化的 1 张卡牌：'
            : isRareTransform
              ? '请选择牌组中要定向蜕变为金色【稀有】牌的 1 张卡牌：'
              : '请选择牌组中要进行随机蜕变重塑的 1 张卡牌：'
        }
      </p>
      <div class="card-showcase">${cardsHtml}</div>
      <button type="button" id="btn-cancel-event-purge" class="btn-stone" data-action="cancel-event-purge">返回重选</button>
    `;
  } else if (Array.isArray(evState.libraryChoices)) {
    const libHtml = evState.libraryChoices
      .map((c) =>
        renderCardHtml(c, {
          idPrefix: 'event-library-card',
          action: 'pick-event-library-card',
          playable: true,
        })
      )
      .join('');

    bodyHtml = `
      <p class="stage-subtitle" style="margin-bottom:12px;">请从以下 3 张卡牌中挑选 1 张加入你的牌组：</p>
      <div class="card-showcase" id="event-library-choices">${libHtml}</div>
    `;
  } else if (evState.resolved) {
    const upgradedCards = (evState.upgradedCardIds || [])
      .map((id) => state.player.deck.find((c) => c.instanceId === id))
      .filter(Boolean);
    const addedCards = (evState.addedCardIds || [])
      .map((id) => state.player.deck.find((c) => c.instanceId === id))
      .filter(Boolean);

    const upgradedShowcaseHtml =
      upgradedCards.length > 0
        ? `<div class="card-showcase" id="event-upgraded-cards">${upgradedCards
            .map((c) =>
              renderCardHtml(c, {
                idPrefix: 'event-upgraded-card',
                action: 'noop',
              })
            )
            .join('')}</div>`
        : '';

    const addedShowcaseHtml =
      addedCards.length > 0
        ? `<div class="card-showcase" id="event-added-cards">${addedCards
            .map((c) =>
              renderCardHtml(c, {
                idPrefix: 'event-added-card',
                action: 'noop',
              })
            )
            .join('')}</div>`
        : '';

    bodyHtml = `
      <div class="summary-stats">
        <p style="margin:0;">${escapeHtml(evState.outcomeText)}</p>
      </div>
      ${upgradedShowcaseHtml}
      ${addedShowcaseHtml}
      <button type="button" id="btn-continue-event" class="btn-brass" data-action="continue-event">继续前进 →</button>
    `;
  } else {
    const hasEmptyPotion = state.player.potions.some((p) => p === null);
    const upgradableCount = getUpgradableDeckCards(state).length;
    const hasHeavyAttack = playerHasHeavyAttackCard(state);
    const hasGoldenIdol = state.player.relics.includes('golden_idol_relic');
    const evTune = getEventTuning(state.ascension ?? 0);
    const choicesList = getEventChoicesForAscension(evDef.id, state.ascension ?? 0);
    const oozeAttempts = evState.oozeAttempts ?? 0;
    const oozeHpCost = evTune.oozeBaseHpLoss + oozeAttempts;
    const oozeChancePct = Math.min(100, evTune.oozeBaseChancePct + oozeAttempts * 15);
    const altarShedCost = Math.max(
      1,
      Math.floor(state.player.maxHp * (evTune.altarShedHpPct / 100))
    );

    const choicesHtml = choicesList
      .map((ch) => {
        let detailText = ch.detail;
        if (evDef.id === 'scrap_ooze' && ch.id === 'reach_ooze') {
          detailText = `失去 ${oozeHpCost} 点生命，有 ${oozeChancePct}% 概率掏出 1 件随机遗物（失败可继续尝试，每次代价 +1 生命、成功率 +15%）。`;
        } else if (evDef.id === 'forgotten_altar' && ch.id === 'shed_blood_altar') {
          detailText = `失去 ${altarShedCost} 点当前生命（${evTune.altarShedHpPct}% 最大生命），永久获得 +${evTune.altarShedMaxHpGain} 最大生命并随机升级 1 张卡牌。`;
        }

        let blockedReason = '';
        if (
          (evDef.id === 'shining_light' && ch.id === 'enter_light' && state.player.hp <= evTune.shiningLightHpLoss) ||
          (evDef.id === 'thorn_reliquary' && ch.id === 'open_reliquary' && state.player.hp <= evTune.thornOpenHpLoss) ||
          (evDef.id === 'ancient_forge' && ch.id === 'overclock_forge' && state.player.hp <= evTune.forgeOverclockHpLoss) ||
          (evDef.id === 'golden_idol' && ch.id === 'smash_trap' && state.player.hp <= evTune.idolSmashHpLoss) ||
          (evDef.id === 'cursed_tome' && ch.id === 'read_final_chapter' && state.player.hp <= evTune.tomeFinalHpLoss) ||
          (evDef.id === 'cursed_tome' && ch.id === 'skim_preface' && state.player.hp <= evTune.tomeSkimHpLoss) ||
          (evDef.id === 'mushroom_grotto' && ch.id === 'refine_red_spore' && state.player.hp <= evTune.grottoRedHpLoss) ||
          (evDef.id === 'scrap_ooze' && ch.id === 'reach_ooze' && state.player.hp <= oozeHpCost) ||
          (evDef.id === 'wing_statue' && ch.id === 'pray_wing' && state.player.hp <= evTune.wingPrayHpLoss) ||
          (evDef.id === 'forgotten_altar' && ch.id === 'shed_blood_altar' && state.player.hp <= altarShedCost) ||
          (evDef.id === 'augmenter' && ch.id === 'augment_serum' && state.player.hp <= evTune.augmentSerumHpLoss) ||
          (evDef.id === 'sensory_stone' && ch.id === 'recall_2' && state.player.hp <= evTune.sensoryRecall2HpLoss) ||
          (evDef.id === 'sensory_stone' && ch.id === 'recall_3' && state.player.hp <= evTune.sensoryRecall3HpLoss) ||
          (evDef.id === 'winding_halls' && ch.id === 'embrace_madness' && state.player.hp <= evTune.windingMadnessHpLoss)
        ) {
          blockedReason = '（生命不足）';
        } else if (
          (evDef.id === 'ancient_forge' && ch.id === 'overclock_forge' && state.player.gold < evTune.forgeOverclockGold) ||
          (evDef.id === 'potion_alchemist' && ch.id === 'buy_potions' && state.player.gold < evTune.alchemistBuyGold)
        ) {
          blockedReason = '（金币不足）';
        } else if (evDef.id === 'potion_alchemist' && ch.id === 'buy_potions' && !hasEmptyPotion) {
          blockedReason = '（药水栏已满）';
        } else if (
          ((evDef.id === 'ancient_shrine' && ch.id === 'pray_purge') ||
            (evDef.id === 'living_wall' && ch.id === 'wall_forget') ||
            (evDef.id === 'wing_statue' && ch.id === 'pray_wing')) &&
          state.player.deck.length <= 1
        ) {
          blockedReason = '（牌组过少）';
        } else if (evDef.id === 'living_wall' && ch.id === 'wall_grow' && upgradableCount === 0) {
          blockedReason = '（无可升级牌）';
        } else if (evDef.id === 'wing_statue' && ch.id === 'destroy_wing' && !hasHeavyAttack) {
          blockedReason = '（需基础伤害≥10攻击牌）';
        } else if (evDef.id === 'forgotten_altar' && ch.id === 'offer_golden_idol' && !hasGoldenIdol) {
          blockedReason = '（需持有黄金神像）';
        }

        const isBlocked = Boolean(blockedReason);
        return `
          <button
            type="button"
            id="event-choice-${escapeHtml(ch.id)}"
            class="choice-btn"
            data-action="choose-event"
            data-choice-id="${escapeHtml(ch.id)}"
            ${isBlocked ? 'disabled' : ''}
          >
            <span class="choice-title">${escapeHtml(ch.label)}${escapeHtml(blockedReason)}</span>
            <span class="choice-detail">${escapeHtml(detailText)}</span>
          </button>
        `;
      })
      .join('');

    const retryNoteHtml = evState.lastAttemptNote
      ? `<div class="toast-banner warn" style="margin-bottom:10px;">${escapeHtml(evState.lastAttemptNote)}</div>`
      : '';
    bodyHtml = `${retryNoteHtml}<div class="choice-stack">${choicesHtml}</div>`;
  }

  return `
    <section class="panel-stage" aria-labelledby="event-heading">
      <div class="stage-header">
        <div>
          <h2 id="event-heading" class="stage-heading">未知事件 · ${escapeHtml(evDef.title)}</h2>
          <p class="stage-subtitle">${escapeHtml(evDef.description)}</p>
        </div>
        ${ui.notice ? `<span class="floor-indicator" style="color:var(--rust-warn);">${escapeHtml(ui.notice)}</span>` : ''}
      </div>
      ${bodyHtml}
    </section>
  `;
}
