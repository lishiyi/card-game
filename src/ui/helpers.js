/**
 * Shared HTML escaping, card rendering, and status-chip rendering helpers.
 */

import {
  canUpgradeCard,
  formatCardDescription,
  formatUpgradePreview,
  getCardStats,
} from '../data/cards.js';
import { STATUS_METADATA } from '../data/relics.js';
import { getCardArtSvg } from './card_art.js';
import { getCardTypeIconSvg } from './icons.js';

export const CARD_TYPE_LABELS = Object.freeze({
  attack: '攻击',
  skill: '技能',
  power: '能力',
  status: '状态',
  curse: '诅咒',
});

export const RARITY_LABELS = Object.freeze({
  starter: '基础',
  common: '普通',
  uncommon: '罕见',
  rare: '稀有',
  special: '衍生',
  status: '状态',
  curse: '诅咒',
});

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderCardHtml(cardInstance, options = {}) {
  const stats = getCardStats(cardInstance);
  const combatCtx = options.combatContext ?? null;
  const desc = formatCardDescription(cardInstance, combatCtx);
  const idPrefix = options.idPrefix || 'card';
  const isColorless = stats.character === 'colorless';
  const extraClasses = [
    'game-card',
    `rarity-${stats.rarity}`,
    isColorless ? 'card-colorless' : '',
    options.playable ? 'playable' : '',
    options.selected ? 'selected-card' : '',
    options.dimmed ? 'unplayable-dim' : '',
    options.discardSelectable ? 'discard-selectable' : '',
    options.discardSynergy ? 'discard-synergy-card' : '',
    options.exhaustSelectable ? 'exhaust-selectable' : '',
    options.upgradeSelectable ? 'upgrade-selectable' : '',
    options.scrySelectable ? 'scry-selectable' : '',
    options.scryMarkedDiscard ? 'scry-marked-discard' : '',
    options.retainSelectable ? 'retain-selectable' : '',
    options.retainSelected ? 'retain-selected' : '',
    options.discardPickSelectable ? 'discard-pick-selectable' : '',
    options.discardPickSelected ? 'discard-pick-selected' : '',
    typeof options.dealIndex === 'number' ? 'card-deal-in' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const descToneClass =
    desc.damageState === 'boosted' || desc.blockState === 'boosted'
      ? 'boosted'
      : desc.damageState === 'reduced' || desc.blockState === 'reduced'
        ? 'reduced'
        : '';

  let upgradePreviewNote = '';
  if (options.showUpgradePreview && canUpgradeCard(cardInstance)) {
    const upgPreview = formatUpgradePreview(cardInstance, combatCtx);
    if (upgPreview) {
      const diffBodyHtml = (upgPreview.segments || [{ text: upgPreview.text, changed: true }])
        .map((seg) =>
          seg.changed
            ? `<span class="upgrade-diff-hl">${escapeHtml(seg.text)}</span>`
            : escapeHtml(seg.text)
        )
        .join('');
      upgradePreviewNote = `<div class="card-upgrade-preview"><span class="upgrade-diff-label">升级后</span>：${diffBodyHtml}</div>`;
    }
  }

  let costTooltipAttrs = '';
  if (desc.costIncreasedNow) {
    costTooltipAttrs = `data-tooltip-title="混乱增费" data-tooltip-tag="异蛇之眼 / 混乱" data-tooltip-desc="${escapeHtml(`受【混乱】影响，本牌当前费用由 ${stats.cost} 点随机提高至 ${desc.displayCost} 点。`)}" data-tooltip-tone="debuff"`;
  } else if (desc.costRandomizedNow && desc.costReducedNow) {
    costTooltipAttrs = `data-tooltip-title="混乱减费" data-tooltip-tag="异蛇之眼 / 混乱" data-tooltip-desc="${escapeHtml(`受【混乱】影响，本牌当前费用由 ${stats.cost} 点随机降至 ${desc.displayCost} 点！`)}" data-tooltip-tone="buff"`;
  } else if (desc.costRandomizedNow) {
    costTooltipAttrs = `data-tooltip-title="混乱随机费用" data-tooltip-tag="异蛇之眼 / 混乱" data-tooltip-desc="${escapeHtml(`受【混乱】影响，本牌本次抽取费用随机为 ${desc.displayCost} 点。`)}"`;
  } else if (stats.costReduced) {
    costTooltipAttrs = `data-tooltip-title="升级减费" data-tooltip-tag="卡牌强化" data-tooltip-desc="${escapeHtml(`升级后费用由 ${stats.baseCost} 点减少至 ${stats.cost} 点。`)}" data-tooltip-tone="buff"`;
  } else if (desc.costReducedNow) {
    costTooltipAttrs = `data-tooltip-title="临时减费" data-tooltip-tag="战斗增益" data-tooltip-desc="${escapeHtml(`受【腐化】或本回合弃牌减费影响，当前费用已降至 ${desc.displayCost} 点。`)}" data-tooltip-tone="buff"`;
  }

  const keywords = [
    stats.innate ? '固有' : '',
    stats.retain ? '保留' : '',
    stats.ethereal ? '虚无' : '',
    stats.exhaust ? '消耗' : '',
  ]
    .filter(Boolean)
    .join('·');

  const medKitActive =
    stats.unplayable &&
    stats.type === 'status' &&
    Boolean(combatCtx?.player?.relics?.includes('medical_kit'));

  const targetLabel = options.scrySelectable
    ? options.scryMarkedDiscard
      ? '✕ 将弃置'
      : '✓ 留在牌堆顶'
    : options.retainSelectable
      ? options.retainSelected
        ? '✦ 将保留'
        : '点击保留'
      : options.discardPickSelectable
        ? options.discardPickSelected
          ? '✦ 已选取回'
          : options.discardPickLabel || '点击选择'
        : options.exhaustSelectable
          ? '点击消耗'
          : options.upgradeSelectable
            ? '点击升级'
            : options.discardSelectable
              ? options.discardSynergy
                ? '✦ 弃置触发'
                : '点击弃置'
              : medKitActive
                ? '消耗打出'
                : stats.unplayable
                  ? '不可打出'
                  : stats.target === 'all_enemies'
                    ? '全体目标'
                    : stats.target === 'enemy'
                      ? '单体目标'
                      : '自身';

  const styleAttr =
    typeof options.dealIndex === 'number' ? `style="--card-idx: ${options.dealIndex};"` : '';

  const costBadgeClass = desc.costIncreasedNow
    ? 'cost-increased'
    : desc.costReducedNow
      ? 'upgraded'
      : '';

  const rarityText = isColorless
    ? `无色·${RARITY_LABELS[stats.rarity] || ''}`
    : RARITY_LABELS[stats.rarity] || '';

  return `
    <button
      type="button"
      id="${escapeHtml(`${idPrefix}-${cardInstance.instanceId}`)}"
      class="${extraClasses}"
      ${styleAttr}
      data-rarity="${escapeHtml(stats.rarity)}"
      data-character="${escapeHtml(stats.character)}"
      data-action="${escapeHtml(options.action || 'noop')}"
      data-instance-id="${escapeHtml(cardInstance.instanceId)}"
      ${options.unplayableReason ? `data-unplayable-reason="${escapeHtml(options.unplayableReason)}"` : ''}
      ${options.offerIndex !== undefined ? `data-offer-index="${options.offerIndex}"` : ''}
      ${options.disabled ? 'disabled' : ''}
    >
      <div>
        <div class="card-top">
          <span class="card-cost ${costBadgeClass}" ${costTooltipAttrs}>${escapeHtml(desc.displayCost)}</span>
          <span class="card-name ${stats.upgraded ? 'upgraded' : ''}">${escapeHtml(stats.name)}</span>
          ${
            typeof options.stackCount === 'number' && options.stackCount > 1
              ? `<span class="card-stack-badge">×${options.stackCount}</span>`
              : typeof options.hotkey === 'number'
                ? `<span class="card-hotkey">[${options.hotkey}]</span>`
                : ''
          }
        </div>
        <div class="card-banner type-${escapeHtml(stats.type)}">
          <span class="card-type-label">
            <span>${escapeHtml(CARD_TYPE_LABELS[stats.type] || stats.type)}</span>
            ${getCardTypeIconSvg(stats.type)}
          </span>
          <span class="rarity-badge rarity-${escapeHtml(stats.rarity)} ${isColorless ? 'badge-colorless' : ''}">${escapeHtml(rarityText)}</span>
        </div>
        <div class="card-art-frame char-${escapeHtml(stats.character)} type-${escapeHtml(stats.type)}" aria-hidden="true">${getCardArtSvg(cardInstance.cardId, stats, combatCtx?.player?.artKey || options.characterId || null)}</div>
        <div class="card-desc ${descToneClass}">${escapeHtml(desc.text)}</div>
      </div>
      ${
        upgradePreviewNote ||
        `<div class="card-footer">
          <span>${escapeHtml(targetLabel)}</span>
          <span>${escapeHtml(keywords)}</span>
        </div>`
      }
    </button>
  `;
}

export function renderStatusesHtml(entity, ownerLabel = '状态') {
  const entries = Object.entries(entity?.statuses || {}).filter(([, val]) => val !== 0);
  if (entries.length === 0) {
    return '<div class="status-row"></div>';
  }
  const chips = entries
    .map(([key, val]) => {
      const metaInfo = STATUS_METADATA[key] || {
        name: key,
        polarity: 'buff',
        describe: () => '',
      };
      const polarity =
        (key === 'strength' || key === 'dexterity') && val < 0 ? 'debuff' : metaInfo.polarity;
      const polarityLabel = polarity === 'debuff' ? '负面状态' : '正面状态';
      const displayVal = key === 'slow' ? `+${(entity?.slowStacks ?? 0) * 10}%` : `${val}`;
      const descText = metaInfo.describe(val, entity?.slowStacks ?? 0);
      return `<span
        class="status-chip ${escapeHtml(polarity)}"
        data-status-key="${escapeHtml(key)}"
        tabindex="0"
        data-tooltip-title="${escapeHtml(`${metaInfo.name} (${displayVal})`)}"
        data-tooltip-tag="${escapeHtml(`${ownerLabel} · ${polarityLabel}`)}"
        data-tooltip-desc="${escapeHtml(descText)}"
        data-tooltip-tone="${escapeHtml(polarity)}"
      >${escapeHtml(metaInfo.name)} ${escapeHtml(displayVal)}</span>`;
    })
    .join('');
  return `<div class="status-row">${chips}</div>`;
}
