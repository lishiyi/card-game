/**
 * Non-combat Outpost & Progression screens: Treasure, Boss Relic Altar, Reward, Rest, Shop, and Game Over.
 */

import { CARD_LIBRARY, getCardCharacter } from '../../data/cards.js';
import { TOTAL_FLOORS } from '../../data/events.js';
import { POTION_LIBRARY, RELIC_LIBRARY, RELIC_TIER_LABELS } from '../../data/relics.js';
import { getDailyModifierDefs, hasDailyModifier } from '../../engine/daily.js';
import {
  getCurrentBossName,
  getCurrentPurgeCost,
  getUpgradableDeckCards,
} from '../../engine/game.js';
import { buildRunReportFromState } from '../../engine/meta.js';
import { formatSeedCode } from '../../engine/rng.js';
import { escapeHtml, renderCardHtml } from '../helpers.js';
import { getLootIconSvg } from '../icons.js';

export function renderTreasureScreen({ state }) {
  const ts = state.treasureState;
  if (!ts) return '';
  const hasCursedKey = state.player.relics.includes('cursed_key');
  const relicObj = ts.relicId ? RELIC_LIBRARY[ts.relicId] : null;
  const relicTierLabel = relicObj ? RELIC_TIER_LABELS[relicObj.tier] || '远古遗物' : '';
  const curseCard = ts.curseCardId
    ? state.player.deck.find((c) => c.instanceId === ts.curseCardId)
    : null;

  const chestBadgeHtml = ts.chestLabel
    ? `<span class="chest-tier-badge">${escapeHtml(ts.chestLabel)}</span>`
    : '';

  if (!ts.opened) {
    return `
      <section class="panel-stage" aria-labelledby="treasure-heading">
        <div class="stage-header">
          <div>
            <h2 id="treasure-heading" class="stage-heading">远古宝箱室${chestBadgeHtml}</h2>
            <p class="stage-subtitle">幽深石室中央摆放着一具${ts.chestLabel ? `<strong>${escapeHtml(ts.chestLabel)}</strong>` : '镶金古铜宝箱'}（小/中/大宝箱对应不同稀罕掉落权重），缝隙间溢出一缕温暖秘光。</p>
          </div>
          <button type="button" id="btn-skip-treasure" class="btn-stone" data-action="leave-treasure">
            跳过宝箱，继续前进 →
          </button>
        </div>

        ${
          hasCursedKey
            ? `<div class="toast-banner warn" style="margin-bottom:14px;">注意：你持有【诅咒钥匙】，开启宝箱时会将 1 张随机【诅咒】牌加入牌组（也可选择跳过宝箱直接离开）。</div>`
            : ''
        }

        <h3 class="reward-section-heading">远古秘宝（点击拿走）：</h3>
        <div class="loot-list treasure-loot-list">
          <button
            type="button"
            id="btn-open-treasure"
            class="loot-reward-card loot-kind-gold treasure-chest-cta"
            data-action="open-treasure"
            data-tooltip-title="开启远古宝箱 · 拿走秘宝"
            data-tooltip-tag="${hasCursedKey ? '会触发诅咒钥匙' : '必出遗物'}"
            data-tooltip-desc="${escapeHtml(
              `开启宝箱即可直接拿走 1 件随机遗物（并有概率附赠金币）${
                hasCursedKey ? '；因持有【诅咒钥匙】还会获得 1 张随机诅咒牌。' : '。'
              }`
            )}"
          >
            <span class="loot-icon-badge loot-badge-gold">${getLootIconSvg('chest')}</span>
            <span class="loot-card-body">
              <span class="loot-card-title">
                开启${escapeHtml(ts.chestLabel || '远古宝箱')} · 拿走宝物
                <span class="loot-sub-pill">${hasCursedKey ? '⚠ 触发诅咒钥匙' : '必出遗物'}</span>
              </span>
              <span class="loot-card-desc">
                获得 1 件随机遗物（并有概率附赠金币）${hasCursedKey ? '，但【诅咒钥匙】会塞入 1 张诅咒牌' : ''}
              </span>
            </span>
            <span class="loot-claim-cta">开启并拿走</span>
          </button>
        </div>
      </section>
    `;
  }

  return `
    <section class="panel-stage" aria-labelledby="treasure-heading">
      <div class="stage-header">
        <div>
          <h2 id="treasure-heading" class="stage-heading">远古宝箱${chestBadgeHtml} · 秘宝已收入囊中</h2>
          <p class="stage-subtitle">机括轻响，沉睡的远古秘宝已归你所有。</p>
        </div>
        <button type="button" id="btn-leave-treasure" class="btn-brass" data-action="leave-treasure">
          继续前进 →
        </button>
      </div>

      <div class="summary-stats" style="margin-bottom:14px;">
        <p style="margin:0;">${escapeHtml(ts.outcomeText)}</p>
      </div>

      <div class="loot-list" style="margin-bottom:16px;">
        ${
          relicObj
            ? `<div
                class="loot-reward-card loot-kind-relic loot-claimed"
                tabindex="0"
                data-tooltip-title="${escapeHtml(relicObj.name)}"
                data-tooltip-tag="${escapeHtml(relicTierLabel)}"
                data-tooltip-desc="${escapeHtml(relicObj.description)}"
                data-tooltip-tone="relic"
              >
                <span class="loot-icon-badge loot-badge-relic">${getLootIconSvg('relic')}</span>
                <span class="loot-card-body">
                  <span class="loot-card-title">
                    已装备遗物：${escapeHtml(relicObj.name)}
                    <span class="loot-sub-pill">${escapeHtml(relicTierLabel)}</span>
                  </span>
                  <span class="loot-card-desc">${escapeHtml(relicObj.description)}</span>
                </span>
                <span class="loot-claim-cta claimed">✓ 已拿走</span>
              </div>`
            : ''
        }
        ${
          ts.gold > 0
            ? `<div class="loot-reward-card loot-kind-gold loot-claimed">
                <span class="loot-icon-badge loot-badge-gold">${getLootIconSvg('gold')}</span>
                <span class="loot-card-body">
                  <span class="loot-card-title">附赠金币 +${escapeHtml(ts.gold)}</span>
                  <span class="loot-card-desc">已自动收入囊中，当前共持有 ${escapeHtml(state.player.gold)} 枚金币</span>
                </span>
                <span class="loot-claim-cta claimed">✓ 已拿走</span>
              </div>`
            : ''
        }
      </div>

      ${
        curseCard
          ? `<div class="card-showcase" id="treasure-curse-showcase">${renderCardHtml(curseCard, {
              idPrefix: 'treasure-curse-card',
              disabled: true,
            })}</div>`
          : ''
      }
    </section>
  `;
}

export function renderBossRewardScreen({ state, ui }) {
  const br = state.bossReward;
  if (!br) return '';
  const actCleared = br.actCleared ?? state.act ?? 1;
  const isAct2Altar = actCleared >= 2;
  const bossName = getCurrentBossName(state);
  const healRatioPct = (state.ascension ?? 0) >= 4 ? 65 : 75;
  const cardChoices = Array.isArray(br.cardChoices) ? br.cardChoices : [];

  const cardsHtml = cardChoices
    .map((card) =>
      renderCardHtml(card, {
        idPrefix: 'boss-reward-card',
        action: 'claim-boss-card',
        playable: !br.cardClaimed,
        selected: br.pickedCardId === card.instanceId,
        dimmed: br.cardClaimed && br.pickedCardId !== card.instanceId,
        disabled: br.cardClaimed,
      })
    )
    .join('');

  const relicsHtml = br.relicChoices
    .map((relicId) => {
      const r = RELIC_LIBRARY[relicId];
      if (!r) return '';
      const isPicked = br.pickedRelicId === relicId;
      const dimmed = Boolean(br.pickedRelicId) && !isPicked;
      return `
        <button
          type="button"
          id="boss-relic-${escapeHtml(relicId)}"
          class="boss-relic-card ${isPicked ? 'selected' : ''}"
          data-action="claim-boss-relic"
          data-relic-id="${escapeHtml(relicId)}"
          ${br.pickedRelicId ? 'disabled' : ''}
          style="${dimmed ? 'opacity:0.46;' : ''}"
        >
          <span class="choice-title">${isPicked ? '[已融合] ' : ''}${escapeHtml(r.name)}</span>
          <span style="font-size:0.73rem;color:hsl(18, 86%, 74%);font-weight:700;">首领遗物</span>
          <span class="choice-detail">${escapeHtml(r.description)}</span>
        </button>
      `;
    })
    .join('');

  const requiresAct3TwinBoss = (state.ascension ?? 0) >= 10;
  const proceedBtnId = isAct2Altar ? 'btn-proceed-act3' : 'btn-proceed-act2';
  const proceedLabel = isAct2Altar
    ? requiresAct3TwinBoss
      ? `踏入第三幕 · 深渊圣殿终末双王试炼（回复已损生命的 ${healRatioPct}%） →`
      : `继续攀登第三幕 · 深渊圣殿（回复已损生命的 ${healRatioPct}%） →`
    : `踏入第二幕 · 钢铁城邦（回复已损生命的 ${healRatioPct}%） →`;
  const settleBtnId = isAct2Altar ? 'btn-settle-act2' : 'btn-settle-act1';
  const settleLabel = requiresAct3TwinBoss
    ? '进阶 10 须击败第 3 幕终末双王方可凯旋'
    : isAct2Altar
      ? '在此双幕凯旋结算（第二幕通关）'
      : '在此凯旋结算（第一幕通关）';

  return `
    <section class="panel-stage" aria-labelledby="boss-reward-heading">
      <div class="stage-header">
        <div>
          <h2 id="boss-reward-heading" class="stage-heading" style="color: var(--jade-upgrade);">
            ${isAct2Altar ? '第二幕' : '第一幕'}首领告破！已击败【${escapeHtml(bossName)}】
          </h2>
          <p class="stage-subtitle">
            你已自动获得首领赏金 <strong>+${escapeHtml(br.bossGold)} 金币</strong>。请挑选 1 张金色【稀有】奖励卡牌（可选）与 1 件强大的【首领遗物】${
              requiresAct3TwinBoss
                ? `；进阶 10【终末双王】需攻克第 3 幕连战双首领方算破塔！`
                : `，随后选择继续攀登第 ${isAct2Altar ? '三' : '二'} 幕或在此凯旋结算！`
            }
          </p>
        </div>
      </div>

      ${ui.notice ? `<div class="toast-banner ${ui.noticeTone === 'warn' ? 'warn' : ''}" style="margin-bottom:12px;">${escapeHtml(ui.notice)}</div>` : ''}

      ${
        cardChoices.length > 0
          ? `<h3 style="margin:0 0 10px;font-size:0.95rem;color:hsl(43, 86%, 72%);">
              ${br.cardClaimed ? '已收入首领稀有卡牌：' : '首领稀有卡牌奖励（三选一 · 必出金色稀有牌，可跳过）：'}
            </h3>
            <div class="card-showcase" id="boss-reward-cards" style="margin-bottom:18px;">${cardsHtml}</div>`
          : ''
      }

      <h3 style="margin:0 0 8px;font-size:0.95rem;color:var(--text-sand);">
        ${br.pickedRelicId ? '已选取首领遗物：' : '首领遗物祭坛（三选一）：'}
      </h3>
      <div class="boss-relic-grid">${relicsHtml}</div>

      <div class="boss-actions-bar">
        <button type="button" id="${proceedBtnId}" class="btn-brass" data-action="proceed-next-act">
          ${proceedLabel}
        </button>
        <button type="button" id="${settleBtnId}" class="btn-stone" data-action="settle-victory" ${requiresAct3TwinBoss ? 'disabled' : ''}>
          ${settleLabel}
        </button>
      </div>
    </section>
  `;
}

export function renderRewardScreen({ state, ui }) {
  const rw = state.reward;
  if (!rw) return '';

  const goldCardHtml = !rw.goldClaimed
    ? `<button
        type="button"
        id="btn-claim-gold"
        class="loot-reward-card loot-kind-gold"
        data-action="claim-gold"
        data-tooltip-title="战利品金币 (+${escapeHtml(rw.gold)})"
        data-tooltip-tag="金币赏金"
        data-tooltip-desc="立即获得 ${escapeHtml(rw.gold)} 枚金币，可在神秘商人处购买卡牌、遗物、药水或净除废牌。"
      >
        <span class="loot-icon-badge loot-badge-gold">${getLootIconSvg('gold')}</span>
        <span class="loot-card-body">
          <span class="loot-card-title">
            战利品金币 +${escapeHtml(rw.gold)}
            <span class="loot-sub-pill">赏金</span>
          </span>
          <span class="loot-card-desc">收入囊中后可在商人处购置强力遗物、卡牌与净除服务</span>
        </span>
        <span class="loot-claim-cta">点击拾取</span>
      </button>`
    : `<div class="loot-reward-card loot-kind-gold loot-claimed" aria-live="polite">
        <span class="loot-icon-badge loot-badge-gold">${getLootIconSvg('gold')}</span>
        <span class="loot-card-body">
          <span class="loot-card-title">金币 +${escapeHtml(rw.gold)} 已收入囊中</span>
          <span class="loot-card-desc">当前共持有 ${escapeHtml(state.player.gold)} 枚金币</span>
        </span>
        <span class="loot-claim-cta claimed">✓ 已拾取</span>
      </div>`;

  const relicObj = rw.relicId ? RELIC_LIBRARY[rw.relicId] : null;
  const relicTierLabel = relicObj ? RELIC_TIER_LABELS[relicObj.tier] || '战利品遗物' : '';
  const relicCardHtml = relicObj
    ? !rw.relicClaimed
      ? `<button
          type="button"
          id="btn-claim-relic"
          class="loot-reward-card loot-kind-relic"
          data-action="claim-relic"
          data-tooltip-title="${escapeHtml(relicObj.name)}"
          data-tooltip-tag="${escapeHtml(relicTierLabel)}"
          data-tooltip-desc="${escapeHtml(relicObj.description)}"
          data-tooltip-tone="relic"
        >
          <span class="loot-icon-badge loot-badge-relic">${getLootIconSvg('relic')}</span>
          <span class="loot-card-body">
            <span class="loot-card-title">
              遗物：${escapeHtml(relicObj.name)}
              <span class="loot-sub-pill">${escapeHtml(relicTierLabel)}</span>
            </span>
            <span class="loot-card-desc">${escapeHtml(relicObj.description)}</span>
          </span>
          <span class="loot-claim-cta">点击拾取</span>
        </button>`
      : `<div class="loot-reward-card loot-kind-relic loot-claimed" aria-live="polite">
          <span class="loot-icon-badge loot-badge-relic">${getLootIconSvg('relic')}</span>
          <span class="loot-card-body">
            <span class="loot-card-title">已装备遗物：${escapeHtml(relicObj.name)}</span>
            <span class="loot-card-desc">${escapeHtml(relicObj.description)}</span>
          </span>
          <span class="loot-claim-cta claimed">✓ 已拾取</span>
        </div>`
    : '';

  const potionObj = rw.potionId ? POTION_LIBRARY[rw.potionId] : null;
  const emptyPotionSlots = state.player.potions.filter((p) => p === null).length;
  const potionCardHtml = potionObj
    ? !rw.potionClaimed
      ? `<button
          type="button"
          id="btn-claim-potion"
          class="loot-reward-card loot-kind-potion"
          data-action="claim-potion"
          data-tooltip-title="${escapeHtml(potionObj.name)}"
          data-tooltip-tag="战利品药水"
          data-tooltip-desc="${escapeHtml(potionObj.description)}"
          data-tooltip-tone="potion"
        >
          <span class="loot-icon-badge loot-badge-potion">${getLootIconSvg('potion')}</span>
          <span class="loot-card-body">
            <span class="loot-card-title">
              药水：${escapeHtml(potionObj.name)}
              <span class="loot-sub-pill">${emptyPotionSlots > 0 ? `空槽 ${emptyPotionSlots}/${state.player.potions.length}` : '药水栏已满'}</span>
            </span>
            <span class="loot-card-desc">${escapeHtml(potionObj.description)}</span>
          </span>
          <span class="loot-claim-cta">${emptyPotionSlots > 0 ? '点击拾取' : '先丢弃旧药水'}</span>
        </button>`
      : `<div class="loot-reward-card loot-kind-potion loot-claimed" aria-live="polite">
          <span class="loot-icon-badge loot-badge-potion">${getLootIconSvg('potion')}</span>
          <span class="loot-card-body">
            <span class="loot-card-title">已收入药水：${escapeHtml(potionObj.name)}</span>
            <span class="loot-card-desc">${escapeHtml(potionObj.description)}</span>
          </span>
          <span class="loot-claim-cta claimed">✓ 已拾取</span>
        </div>`
    : '';

  const cardsHtml = rw.cardChoices
    .map((card, idx) =>
      renderCardHtml(card, {
        idPrefix: 'reward-card',
        action: 'claim-card',
        playable: !rw.cardClaimed,
        selected: rw.pickedCardId === card.instanceId,
        dimmed: rw.cardClaimed && rw.pickedCardId !== card.instanceId,
        disabled: rw.cardClaimed,
        dealIndex: idx,
      })
    )
    .join('');

  const pityPct = Math.round((state.rarePityBonus ?? 0) * 100);

  return `
    <section class="panel-stage" aria-labelledby="reward-heading">
      <div class="stage-header">
        <div>
          <h2 id="reward-heading" class="stage-heading">战斗胜利 · 战利品结算</h2>
          <p class="stage-subtitle">点击下方战利品牌匾收入囊中，并从 3 张卡牌中挑选 1 张加入牌组（也可跳过卡牌以保持精简构筑）。</p>
        </div>
        <button type="button" id="btn-proceed-reward" class="btn-brass" data-action="proceed-reward">
          继续前进 →
        </button>
      </div>

      ${ui.notice ? `<div class="toast-banner ${ui.noticeTone === 'warn' ? 'warn' : ''}" style="margin-bottom:12px;">${escapeHtml(ui.notice)}</div>` : ''}

      <h3 class="reward-section-heading">掉落战利品（点击拾取）：</h3>
      <div class="loot-list">
        ${goldCardHtml}
        ${relicCardHtml}
        ${potionCardHtml}
      </div>

      <h3 class="reward-section-heading">
        ${rw.cardClaimed ? '已选择加入牌组的卡牌：' : '卡牌奖励（三选一）：'}
        ${pityPct > 0 ? `<span style="font-size:0.78rem;color:var(--accent-brass);font-weight:600;margin-left:8px;">稀有牌动态保底 +${pityPct}%</span>` : ''}
      </h3>
      <div class="card-showcase">${cardsHtml}</div>
    </section>
  `;
}

export function renderRestScreen({ state }) {
  const healPct = 30;
  const healAmount = Math.max(1, Math.floor(state.player.maxHp * (healPct / 100)));
  const upgradable = getUpgradableDeckCards(state);
  const featherHealed = state.restState?.featherHealed ?? 0;
  const hasCoffeeDripper = state.player.relics.includes('coffee_dripper');
  const hasMidas = hasDailyModifier(state, 'midas');

  return `
    <section class="panel-stage" aria-labelledby="rest-heading">
      <div class="stage-header">
        <div>
          <h2 id="rest-heading" class="stage-heading">篝火营地</h2>
          <p class="stage-subtitle">摇曳的火光驱散了尖塔寒意。你可以小憩恢复体力，或在铁砧上锻造升级一张卡牌。</p>
        </div>
      </div>

      ${
        featherHealed > 0
          ? `<div class="toast-banner" style="margin-bottom:14px;color:var(--jade-upgrade);">【永恒羽毛】共鸣：踏入营地时自动为你回复了 ${escapeHtml(featherHealed)} 点生命！</div>`
          : ''
      }

      <div class="choice-stack">
        <button
          type="button"
          id="btn-rest-heal"
          class="choice-btn"
          data-action="rest-heal"
          ${hasCoffeeDripper ? 'disabled' : ''}
        >
          <span class="choice-title">${
            hasCoffeeDripper
              ? '篝火休息（已禁用 · 咖啡滤滴器）'
              : `篝火休息（回复 ${escapeHtml(healAmount)} 点生命）`
          }</span>
          <span class="choice-detail">${
            hasCoffeeDripper
              ? '持有首领遗物【咖啡滤滴器】，无法在篝火营地通过休息回复生命（仍可铁砧锻造）。'
              : `回复最大生命值的 ${healPct}%（当前生命 ${escapeHtml(state.player.hp)} / ${escapeHtml(state.player.maxHp)}）。`
          }</span>
        </button>

        <button
          type="button"
          id="btn-rest-smith"
          class="choice-btn"
          data-action="open-modal"
          data-modal="smith"
          ${hasMidas || upgradable.length === 0 ? 'disabled' : ''}
        >
          <span class="choice-title">${
            hasMidas ? '铁砧锻造（已禁用 · 点金之手）' : '铁砧锻造（升级 1 张卡牌）'
          }</span>
          <span class="choice-detail">
            ${
              hasMidas
                ? '受每日挑战词条【点金之手】限制，本局无法在篝火锻造升级卡牌（可利用 +65% 赏金在商店强化构筑）。'
                : upgradable.length > 0
                  ? `从牌组中的 ${upgradable.length} 张可升级卡牌里选择 1 张永久强化。`
                  : '当前牌组中已没有可升级的卡牌。'
            }
          </span>
        </button>

        <button type="button" id="btn-rest-leave" class="btn-stone" style="align-self:flex-start;" data-action="leave-rest">
          直接离开营地
        </button>
      </div>
    </section>
  `;
}

export function renderShopScreen({ state, ui }) {
  const shop = state.shop;
  if (!shop) return '';

  const cardsHtml = shop.cards
    .map((offer, idx) => {
      const canAfford = !offer.sold && state.player.gold >= offer.price;
      return `
        <div class="shop-card-wrap">
          ${renderCardHtml(offer.card, {
            idPrefix: 'shop-card',
            action: 'buy-shop-card',
            offerIndex: idx,
            playable: canAfford,
            dimmed: offer.sold || !canAfford,
            disabled: offer.sold || !canAfford,
          })}
          <span class="price-tag ${offer.onSale ? 'sale' : ''}">
            ${offer.sold ? '已售罄' : `${offer.onSale ? '特惠 ' : ''}${offer.price} 金币`}
          </span>
        </div>
      `;
    })
    .join('');

  const colorlessOffers = Array.isArray(shop.colorlessCards) ? shop.colorlessCards : [];
  const colorlessHtml = colorlessOffers
    .map((offer, idx) => {
      const canAfford = !offer.sold && state.player.gold >= offer.price;
      return `
        <div class="shop-card-wrap">
          ${renderCardHtml(offer.card, {
            idPrefix: 'shop-colorless-card',
            action: 'buy-shop-colorless-card',
            offerIndex: idx,
            playable: canAfford,
            dimmed: offer.sold || !canAfford,
            disabled: offer.sold || !canAfford,
          })}
          <span class="price-tag colorless-price">
            ${offer.sold ? '已售罄' : `${offer.price} 金币`}
          </span>
        </div>
      `;
    })
    .join('');

  const relicOffer = shop.relicOffer;
  const relicDef = relicOffer ? RELIC_LIBRARY[relicOffer.relicId] : null;
  const shopRelicOffer = shop.shopRelicOffer;
  const shopRelicDef = shopRelicOffer ? RELIC_LIBRARY[shopRelicOffer.relicId] : null;
  const hasMembership = state.player.relics.includes('membership_card');
  const potionOffer = shop.potionOffer;
  const potionDef = potionOffer ? POTION_LIBRARY[potionOffer.potionId] : null;
  const nextPurgeCost = getCurrentPurgeCost({
    ...state,
    purgeCount: (state.purgeCount ?? 0) + 1,
  });

  return `
    <section class="panel-stage" aria-labelledby="shop-heading">
      <div class="stage-header">
        <div>
          <h2 id="shop-heading" class="stage-heading">神秘商人${hasMembership ? ' <span class="shop-member-badge">会员卡全场半价 (-50%)</span>' : ''}</h2>
          <p class="stage-subtitle">“欢迎来到我的地毯小铺，尖塔行者！看中什么尽管挑，商店专属无色秘牌与商店专属遗物也在货架上。”</p>
        </div>
        <button type="button" id="btn-leave-shop" class="btn-brass" data-action="leave-shop">
          离开商店 →
        </button>
      </div>

      ${ui.notice ? `<div class="toast-banner ${ui.noticeTone === 'warn' ? 'warn' : ''}" style="margin-bottom:12px;">${escapeHtml(ui.notice)}</div>` : ''}

      <div class="shop-section">
        <h3>精选职业卡牌</h3>
        <div class="card-showcase" id="shop-class-cards">${cardsHtml}</div>
      </div>

      ${
        colorlessOffers.length > 0
          ? `<div class="shop-section shop-colorless-section">
              <div class="shop-section-head">
                <h3>商店专属 · 无色秘牌</h3>
                <span class="shop-colorless-note">仅神秘商人出售（固定 1 张罕见 + 1 张稀有）</span>
              </div>
              <div class="card-showcase" id="shop-colorless-cards">${colorlessHtml}</div>
            </div>`
          : ''
      }

      <div class="shop-section">
        <h3>遗物 · 商店专属遗物 · 药水 · 牌组精简服务</h3>
        <div class="choice-stack">
          ${
            relicDef
              ? `<button type="button" id="btn-buy-relic" class="choice-btn" data-action="buy-shop-relic" ${relicOffer.sold || state.player.gold < relicOffer.price ? 'disabled' : ''}>
                  <span class="choice-title">${relicOffer.sold ? '[已售出] ' : ''}遗物：${escapeHtml(relicDef.name)}（${escapeHtml(relicOffer.price)} 金币 · ${escapeHtml(RELIC_TIER_LABELS[relicDef.tier] || '遗物')}）</span>
                  <span class="choice-detail">${escapeHtml(relicDef.description)}</span>
                </button>`
              : ''
          }
          ${
            shopRelicDef
              ? `<button type="button" id="btn-buy-shop-relic" class="choice-btn" data-action="buy-shop-exclusive-relic" ${shopRelicOffer.sold || state.player.gold < shopRelicOffer.price ? 'disabled' : ''}>
                  <span class="choice-title">${shopRelicOffer.sold ? '[已售出] ' : ''}[商店专属] ${escapeHtml(shopRelicDef.name)}（${escapeHtml(shopRelicOffer.price)} 金币）</span>
                  <span class="choice-detail">${escapeHtml(shopRelicDef.description)}</span>
                </button>`
              : ''
          }
          ${
            potionDef
              ? `<button type="button" id="btn-buy-potion" class="choice-btn" data-action="buy-shop-potion" ${potionOffer.sold || state.player.gold < potionOffer.price ? 'disabled' : ''}>
                  <span class="choice-title">${potionOffer.sold ? '[已售出] ' : ''}药水：${escapeHtml(potionDef.name)}（${escapeHtml(potionOffer.price)} 金币）</span>
                  <span class="choice-detail">${escapeHtml(potionDef.description)}</span>
                </button>`
              : ''
          }
          <button
            type="button"
            id="btn-shop-purge"
            class="choice-btn"
            data-action="open-modal"
            data-modal="shop_purge"
            ${shop.purgeUsed || state.player.gold < shop.purgeCost || state.player.deck.length <= 1 ? 'disabled' : ''}
          >
            <span class="choice-title">${shop.purgeUsed ? '[已使用] ' : ''}卡牌移除服务（${escapeHtml(shop.purgeCost)} 金币）</span>
            <span class="choice-detail">从牌组中永久移除 1 张基础、诅咒或冗余卡牌（每移除 1 次递增涨价，下次商店移除费用：${escapeHtml(nextPurgeCost)} 金币）。</span>
          </button>
        </div>
      </div>
    </section>
  `;
}

function getRankCssClass(grade) {
  if (grade === 'S+') return 'rank-sp';
  if (grade === 'S') return 'rank-s';
  if (grade === 'A') return 'rank-a';
  if (grade === 'B') return 'rank-b';
  return 'rank-c';
}

export function renderGameOverScreen({ state, ui, ensureRunRecorded }) {
  const isWin = state.runOutcome === 'victory';
  const summary = ensureRunRecorded();
  const report = summary?.historyEntry || buildRunReportFromState(state);
  const seedCode = formatSeedCode(state.seed);
  const daily = state.dailyChallenge || null;
  const dailyMods = daily ? getDailyModifierDefs(daily.modifierIds) : [];

  const deckHtml = state.player.deck
    .map((c) => renderCardHtml(c, { idPrefix: 'final-card', disabled: true }))
    .join('');

  const actLabel = (state.act ?? 1) >= 2 ? `第 ${state.act} 幕 · ` : '';
  const bossName = getCurrentBossName(state);

  const unlockNotes = [];
  if (summary?.unlockedAscension) {
    unlockNotes.push(`解锁新难度：【进阶 ${summary.unlockedAscension}】！`);
  }
  if (summary?.newlyUnlockedTiers?.length > 0) {
    for (const tierDef of summary.newlyUnlockedTiers) {
      unlockNotes.push(`历练突破【${tierDef.title}】：${tierDef.summary}`);
    }
  }

  const deck = state.player.deck || [];
  const upgradedCount = deck.filter((c) => Boolean(c.upgraded)).length;
  const colorlessCount = deck.filter(
    (c) => getCardCharacter(CARD_LIBRARY[c.cardId]) === 'colorless'
  ).length;
  const attackCount = deck.filter((c) => CARD_LIBRARY[c.cardId]?.type === 'attack').length;
  const skillCount = deck.filter((c) => CARD_LIBRARY[c.cardId]?.type === 'skill').length;
  const powerCount = deck.filter((c) => CARD_LIBRARY[c.cardId]?.type === 'power').length;

  const breakdownHtml = (report.scoreBreakdown || [])
    .map(
      (item) => `
        <div class="score-breakdown-item">
          <span class="score-bd-label">${escapeHtml(item.label)}</span>
          <span class="score-bd-detail">${escapeHtml(item.detail)}</span>
          <strong class="score-bd-pts">+${escapeHtml(item.points)}</strong>
        </div>
      `
    )
    .join('');

  const relicsHtml = (state.player.relics || [])
    .map((id) => {
      const r = RELIC_LIBRARY[id];
      if (!r) return '';
      const tierLabel = RELIC_TIER_LABELS[r.tier] || '遗物';
      return `<span
        class="relic-badge tier-${escapeHtml(r.tier)}"
        tabindex="0"
        data-tooltip-title="${escapeHtml(r.name)}"
        data-tooltip-tag="${escapeHtml(tierLabel)}"
        data-tooltip-desc="${escapeHtml(r.description)}"
        data-tooltip-tone="relic"
      >${escapeHtml(r.name)}</span>`;
    })
    .join('');

  const dailyModsHtml = dailyMods
    .map(
      (mod) => `
        <span
          class="daily-mod-chip tone-${escapeHtml(mod.tone)}"
          tabindex="0"
          data-tooltip-title="${escapeHtml(mod.name)}"
          data-tooltip-tag="${escapeHtml(mod.shortTag)}"
          data-tooltip-desc="${escapeHtml(mod.description)}"
          data-tooltip-tone="${mod.tone === 'challenge' ? 'debuff' : 'buff'}"
        >${escapeHtml(mod.name)} · ${escapeHtml(mod.shortTag)}</span>
      `
    )
    .join('');

  return `
    <section class="panel-stage" id="gameover-screen" aria-labelledby="gameover-heading">
      <div class="stage-header">
        <div>
          <h2 id="gameover-heading" class="stage-heading" style="color: ${isWin ? 'var(--jade-upgrade)' : 'var(--rust-warn)'};">
            ${
              isWin
                ? (state.act ?? 1) >= 3
                  ? `👑 三幕终极登顶！你征服了深渊圣殿【${escapeHtml(bossName)}】！`
                  : `登顶凯旋！你征服了${(state.act ?? 1) >= 2 ? '双幕尖塔终战' : `【${escapeHtml(bossName)}】`}！`
                : '攀登折戟 · 征途落幕'
            }
          </h2>
          <p class="stage-subtitle">
            ${
              isWin
                ? (state.act ?? 1) >= 3
                  ? '深渊圣殿的远古守护神已在你面前陨落，完整的三幕登顶战绩与评分已永久镌刻进尖塔编年史。'
                  : '青铜核心与暗影枷锁轰然碎裂，你的战绩卡片与评分已镌刻进尖塔编年史。'
                : '尖塔吞没了无数挑战者，但每一次复盘与历练积累都会让你下一次走得更远。'
            }
          </p>
        </div>
        <div class="gameover-actions-bar">
          <button
            type="button"
            id="btn-copy-battle-report"
            class="btn-brass"
            data-action="copy-battle-report"
          >
            复制战绩卡
          </button>
          <button
            type="button"
            id="btn-gameover-copy-seed"
            class="btn-stone"
            data-action="copy-seed"
            data-seed-code="${escapeHtml(seedCode)}"
            data-ascension="${escapeHtml(state.ascension ?? 0)}"
            data-character-id="${escapeHtml(state.characterId || 'ironclad')}"
            data-daily-date="${escapeHtml(daily?.dateKey || '')}"
          >
            ${daily ? `分享今日挑战 (${escapeHtml(daily.dateKey)})` : `分享挑战链接 (${escapeHtml(seedCode)})`}
          </button>
          <button
            type="button"
            id="btn-replay-current-seed"
            class="btn-stone"
            data-action="${daily ? 'start-daily-challenge' : 'replay-history-seed'}"
            data-daily-date="${escapeHtml(daily?.dateKey || '')}"
            data-seed="${escapeHtml(state.seed)}"
            data-ascension="${escapeHtml(state.ascension ?? 0)}"
            data-character-id="${escapeHtml(state.characterId || 'ironclad')}"
          >
            ${daily ? '再战今日挑战' : '同种子再战'}
          </button>
          <button type="button" id="btn-gameover-meta" class="btn-stone" data-action="open-modal" data-modal="meta">
            战绩与进阶
          </button>
          <button type="button" id="btn-restart-gameover" class="btn-stone" data-action="new-run">
            选择角色再战
          </button>
        </div>
      </div>

      ${ui.notice ? `<div class="toast-banner" style="margin-bottom:12px;">${escapeHtml(ui.notice)}</div>` : ''}

      ${
        unlockNotes.length > 0
          ? `<div class="toast-banner" style="margin-bottom:12px;color:var(--jade-upgrade);font-weight:700;">${escapeHtml(unlockNotes.join(' '))}</div>`
          : ''
      }

      <div class="battle-report-card ${isWin ? 'report-win' : 'report-loss'}" id="battle-report-card">
        <div class="report-hero-row">
          <div class="report-identity">
            <div class="report-tags-row">
              <span class="character-hud-pill char-${escapeHtml(state.characterId || 'ironclad')}">${escapeHtml(state.player.name)}</span>
              ${daily ? `<span class="daily-pill">每日挑战 ${escapeHtml(daily.dateKey)}</span>` : ''}
              ${state.isChallengeRun && !daily ? `<span class="challenge-pill">好友种子挑战</span>` : ''}
              ${(state.ascension ?? 0) > 0 ? `<span class="ascension-pill">进阶 ${escapeHtml(state.ascension)}</span>` : ''}
              <code class="seed-code-tag">${escapeHtml(seedCode)}</code>
              ${summary?.xpGained > 0 ? `<span class="report-xp-pill">+${escapeHtml(summary.xpGained)} XP</span>` : ''}
            </div>
            <div class="report-meta-line">
              抵达 <strong>${escapeHtml(actLabel)}第 ${escapeHtml(Math.max(1, state.floor || 1))} / ${escapeHtml(TOTAL_FLOORS)} 层</strong>
              ${!isWin && report.defeatedBy ? ` · 败于 <strong style="color:var(--rust-warn);">${escapeHtml(report.defeatedBy)}</strong>` : ''}
            </div>
            ${dailyModsHtml ? `<div class="daily-mod-row" style="margin-top:6px;">${dailyModsHtml}</div>` : ''}
          </div>

          <div class="score-rank-badge ${getRankCssClass(report.grade)}" id="gameover-score-badge">
            <span class="score-rank-letter">${escapeHtml(report.grade)}</span>
            <div class="score-rank-meta">
              <span class="score-rank-label">战绩评分</span>
              <strong class="score-rank-value" id="gameover-score-value">${escapeHtml((report.score ?? 0).toLocaleString())}</strong>
            </div>
          </div>
        </div>

        <div class="report-stats-grid">
          <div class="report-stat-cell">
            <span class="report-stat-label">获胜战斗</span>
            <strong class="report-stat-val">${escapeHtml(report.combatsWon ?? 0)}${(report.perfectCombats ?? 0) > 0 ? ` <small class="stat-jade">(无伤 ${escapeHtml(report.perfectCombats)})</small>` : ''}</strong>
          </div>
          <div class="report-stat-cell">
            <span class="report-stat-label">精英 / 强敌</span>
            <strong class="report-stat-val">${escapeHtml(report.elitesSlain ?? 0)} / ${escapeHtml(report.enemiesSlain ?? 0)}</strong>
          </div>
          <div class="report-stat-cell">
            <span class="report-stat-label">总输出伤害</span>
            <strong class="report-stat-val">${escapeHtml((report.totalDamageDealt ?? 0).toLocaleString())}</strong>
          </div>
          <div class="report-stat-cell">
            <span class="report-stat-label">最高单次伤害</span>
            <strong class="report-stat-val">${escapeHtml((report.highestSingleHit ?? 0).toLocaleString())}</strong>
          </div>
          <div class="report-stat-cell">
            <span class="report-stat-label">累计格挡</span>
            <strong class="report-stat-val">${escapeHtml((report.totalBlockGained ?? 0).toLocaleString())}</strong>
          </div>
          <div class="report-stat-cell">
            <span class="report-stat-label">累计出牌</span>
            <strong class="report-stat-val">${escapeHtml((report.cardsPlayed ?? 0).toLocaleString())}</strong>
          </div>
        </div>

        ${
          breakdownHtml
            ? `<div class="score-breakdown-wrap">
                <div class="report-subhead">评分明细</div>
                <div class="score-breakdown-grid">${breakdownHtml}</div>
              </div>`
            : ''
        }

        <div class="report-relics-wrap">
          <div class="report-subhead">最终遗物（共 ${escapeHtml(state.player.relics.length)} 件）</div>
          <div class="report-relics-strip">${relicsHtml || '<span class="stage-subtitle">无</span>'}</div>
        </div>
      </div>

      <div class="deck-composition-header">
        <h3 style="margin:0;font-size:0.95rem;color:var(--text-sand);">
          最终牌组（共 ${escapeHtml(deck.length)} 张 · 已升级 ${escapeHtml(upgradedCount)} 张${colorlessCount > 0 ? ` · 无色 ${escapeHtml(colorlessCount)} 张` : ''}）
        </h3>
        <span class="deck-composition-pills">攻击 ${escapeHtml(attackCount)} · 技能 ${escapeHtml(skillCount)} · 能力 ${escapeHtml(powerCount)}</span>
      </div>
      <div class="card-showcase">${deckHtml}</div>
    </section>
  `;
}
