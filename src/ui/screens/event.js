/**
 * Unknown Event screen renderer (narrative choices, card upgrade/transform/purge sub-flows, and Library draft).
 */

import { EVENT_LIBRARY } from '../../data/events.js';
import { getUpgradableDeckCards } from '../../engine/game.js';
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

    bodyHtml = `
      <p class="stage-subtitle" style="margin-bottom:12px;">请选择要从牌组中永久移除的 1 张卡牌：</p>
      <div class="card-showcase">${deckHtml}</div>
      <button type="button" id="btn-cancel-event-purge" class="btn-stone" data-action="cancel-event-purge">返回重选</button>
    `;
  } else if (evState.pendingCardAction) {
    const isUpgrade = evState.pendingCardAction === 'upgrade';
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
        ${isUpgrade ? '请选择牌组中要永久强化的 1 张卡牌：' : '请选择牌组中要进行随机蜕变重塑的 1 张卡牌：'}
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
      <p class="stage-subtitle" style="margin-bottom:12px;">请从以下 3 卷武学手札中挑选 1 张加入你的牌组：</p>
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

    const choicesHtml = evDef.choices
      .map((ch) => {
        let blockedReason = '';
        if (
          (evDef.id === 'shining_light' && ch.id === 'enter_light' && state.player.hp <= 12) ||
          (evDef.id === 'thorn_reliquary' && ch.id === 'open_reliquary' && state.player.hp <= 8) ||
          (evDef.id === 'ancient_forge' && ch.id === 'overclock_forge' && state.player.hp <= 6) ||
          (evDef.id === 'golden_idol' && ch.id === 'smash_trap' && state.player.hp <= 14) ||
          (evDef.id === 'cursed_tome' && ch.id === 'read_final_chapter' && state.player.hp <= 14) ||
          (evDef.id === 'cursed_tome' && ch.id === 'skim_preface' && state.player.hp <= 5) ||
          (evDef.id === 'mushroom_grotto' && ch.id === 'refine_red_spore' && state.player.hp <= 7)
        ) {
          blockedReason = '（生命不足）';
        } else if (
          (evDef.id === 'ancient_forge' && ch.id === 'overclock_forge' && state.player.gold < 30) ||
          (evDef.id === 'potion_alchemist' && ch.id === 'buy_potions' && state.player.gold < 35)
        ) {
          blockedReason = '（金币不足）';
        } else if (evDef.id === 'potion_alchemist' && ch.id === 'buy_potions' && !hasEmptyPotion) {
          blockedReason = '（药水栏已满）';
        } else if (
          ((evDef.id === 'ancient_shrine' && ch.id === 'pray_purge') ||
            (evDef.id === 'living_wall' && ch.id === 'wall_forget')) &&
          state.player.deck.length <= 1
        ) {
          blockedReason = '（牌组过少）';
        } else if (evDef.id === 'living_wall' && ch.id === 'wall_grow' && upgradableCount === 0) {
          blockedReason = '（无可升级牌）';
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
            <span class="choice-detail">${escapeHtml(ch.detail)}</span>
          </button>
        `;
      })
      .join('');

    bodyHtml = `<div class="choice-stack">${choicesHtml}</div>`;
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
