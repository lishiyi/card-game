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
import { getStatusSvg } from './status_art.js';

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

export const CARD_KEYWORD_DEFS = Object.freeze({
  固有: '战斗第 1 回合必定出现在起手手牌中。',
  保留: '回合结束时若仍在手牌，不会进入弃牌堆，直接保留至下回合。',
  虚无: '回合结束时若仍在手牌，将自动消耗移出本场战斗。',
  消耗: '打出或触发消耗后移入消耗堆，本场战斗不再洗回抽牌堆。',
  不能被打出: '无法正常打出，仅能被弃置、消耗或由特定遗物处理。',
  斩杀: '仅当使用此牌彻底击败一名非【爪牙】敌人时触发效果（击杀爪牙、触发复活的暗影虫或一阶段觉醒者不会触发）。',
  预见: '检视抽牌堆顶对应张数的牌，并可任意勾选弃置。',
  真言: '每累计达到 10 点，立即消耗 10 点并进入【神格】姿态。',
  愤怒: '姿态：造成与受到的攻击伤害均变为双倍（×2）。',
  平静: '姿态：退出平静姿态时立即获得 2 点能量（紫色莲花为 3 点）。',
  神格: '姿态：进入时 +3 能量，本回合攻击伤害 ×3，下回合开始自动退出。',
  印记: '打出【点穴】时，所有带印记敌人无视格挡失去等同于印记层数的生命。',
  无实体: '受到的所有伤害降至 1 点（每回合结束减少 1 层）。',
  人工制品: '免疫接下来对应次数的负面状态。',
  中毒: '敌人回合开始时无视格挡失去等同于层数的生命，随后层数 -1。',
  易伤: '受到的攻击伤害提高 50%（每回合结束减少 1 层）。',
  虚弱: '造成的攻击伤害降低 25%（每回合结束减少 1 层）。',
  力量: '每 1 点力量使每次攻击伤害 +1（负值则减伤）。',
  敏捷: '每 1 点敏捷使卡牌提供的格挡 +1（负值则减甲）。',
  充能: '按从右到左的顺序填入充能球槽位；若槽位已满，则先自动【激发】最右侧队首充能球腾出空位。',
  激发: '移除并引爆最右侧的队首充能球（金框标示），立即触发其高额激发效果，其余充能球依次右移。',
  集中: '每 1 点集中使闪电/冰霜/黑暗球的被动与激发数值 +1（负值则降低，不影响等离子球）。',
  锁定: '带有锁定的敌人受到闪电球与黑暗球的伤害提高 50%（每回合结束减少 1 层）。',
  闪电球: '被动：回合结束对随机敌人造成 3 伤；激发：对随机敌人造成 8 伤（受集中与锁定加成）。',
  冰霜球: '被动：回合结束获得 2 格挡；激发：获得 5 格挡（受集中加成）。',
  黑暗球: '被动：回合结束自身蓄能 +6；激发：对当前生命最低的敌人造成累计伤害。',
  等离子球: '被动：回合开始 +1 能量；激发：立即 +2 能量（不受集中影响）。',
  小刀: '衍生攻击（0费）：造成 4 点伤害，消耗。',
  奇迹: '衍生技能（0费）：保留，获得 1 点能量，消耗。',
  惩恶: '衍生攻击（1费）：保留，造成 12 点伤害，消耗。',
  平安: '衍生技能（1费）：保留，获得 12 点格挡，消耗。',
  洞见: '衍生技能（0费）：保留，抽 2 张牌，消耗。',
  以暴易暴: '衍生攻击（0费）：保留，造成 20 点伤害，消耗。',
  贝塔: '衍生技能（2费）：将 1 张【欧米伽】洗入抽牌堆，消耗。',
  欧米伽: '衍生能力（3费）：每回合结束时对所有敌人造成 50 点伤害。',
});

const INLINE_KW_REGEX =
  /(不能被打出|人工制品|等离子球|闪电球|冰霜球|黑暗球|无实体|固有|保留|虚无|消耗|斩杀|预见|真言|愤怒|平静|神格|印记|充能|激发|集中|锁定|中毒|易伤|虚弱|力量|敏捷)/g;

export function formatCardDescHtml(text) {
  return escapeHtml(text).replace(
    INLINE_KW_REGEX,
    '<span class="card-kw-inline">$1</span>'
  );
}

export function extractCardKeywords(stats, descText = '') {
  const found = [];
  const seen = new Set();
  const add = (key, isTrait = false) => {
    if (!key || seen.has(key) || !CARD_KEYWORD_DEFS[key]) return;
    seen.add(key);
    found.push({ key, desc: CARD_KEYWORD_DEFS[key], isTrait });
  };

  if (stats?.innate) add('固有', true);
  if (stats?.retain) add('保留', true);
  if (stats?.ethereal) add('虚无', true);
  if (stats?.exhaust || descText.includes('消耗。')) add('消耗', true);
  if (
    stats?.fatal ||
    stats?.maxHpOnKill ||
    stats?.goldOnKill ||
    stats?.fatalPermanentUpgrade ||
    descText.includes('斩杀')
  ) {
    add('斩杀', true);
  }
  if (stats?.unplayable && descText.includes('不能被打出')) add('不能被打出', true);

  const mechanicChecks = [
    ['预见', () => Boolean(stats?.scry || stats?.applySelfStatuses?.foresight || descText.includes('预见'))],
    ['真言', () => descText.includes('真言')],
    ['愤怒', () => descText.includes('【愤怒】')],
    ['平静', () => descText.includes('【平静】')],
    ['神格', () => descText.includes('【神格】')],
    ['印记', () => descText.includes('【印记】')],
    ['闪电球', () => descText.includes('闪电球')],
    ['冰霜球', () => descText.includes('冰霜球')],
    ['黑暗球', () => descText.includes('黑暗球')],
    ['等离子球', () => descText.includes('等离子球')],
    ['充能', () => descText.includes('充能')],
    ['激发', () => descText.includes('激发')],
    ['集中', () => descText.includes('集中')],
    ['锁定', () => descText.includes('锁定')],
    ['无实体', () => descText.includes('无实体')],
    ['人工制品', () => descText.includes('人工制品')],
    ['中毒', () => descText.includes('中毒')],
    ['易伤', () => descText.includes('易伤')],
    ['虚弱', () => descText.includes('虚弱')],
    ['力量', () => descText.includes('力量')],
    ['敏捷', () => descText.includes('敏捷')],
  ];
  for (const [kw, testFn] of mechanicChecks) {
    if (testFn()) add(kw, false);
  }

  const tokenChecks = ['小刀', '奇迹', '惩恶', '平安', '洞见', '以暴易暴', '贝塔', '欧米伽'];
  for (const tok of tokenChecks) {
    if (descText.includes(`【${tok}`)) {
      add(tok, false);
    }
  }

  return found;
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
    options.conditionActive ? 'condition-active' : '',
    options.selected ? 'selected-card' : '',
    options.dimmed ? 'unplayable-dim' : '',
    options.discardSelectable ? 'discard-selectable' : '',
    options.discardSynergy ? 'discard-synergy-card' : '',
    options.exhaustSelectable ? 'exhaust-selectable' : '',
    options.upgradeSelectable ? 'upgrade-selectable' : '',
    options.drawTopSelectable || options.drawBottomSelectable || options.nightmareSelectable
      ? 'draw-top-selectable'
      : '',
    options.dualWieldSelectable ? 'upgrade-selectable' : '',
    options.scrySelectable ? 'scry-selectable' : '',
    options.scryMarkedDiscard ? 'scry-marked-discard' : '',
    options.retainSelectable || options.exhaustMultiSelectable || options.drawBottomMultiSelectable
      ? 'retain-selectable'
      : '',
    options.retainSelected || options.exhaustMultiSelected || options.drawBottomMultiSelected
      ? 'retain-selected'
      : '',
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
    costTooltipAttrs = `data-tooltip-title="临时减费" data-tooltip-tag="战斗增益" data-tooltip-desc="${escapeHtml(`受减费效果影响，当前费用已降至 ${desc.displayCost} 点。`)}" data-tooltip-tone="buff"`;
  }

  const extractedKeywords = extractCardKeywords(stats, desc.text);
  const traitKeys = extractedKeywords.filter((k) => k.isTrait && k.key !== '不能被打出').map((k) => k.key);
  let kwBadgeText = '';
  if (traitKeys.length > 0) {
    kwBadgeText = traitKeys.join('·');
  } else if (extractedKeywords.length === 1) {
    kwBadgeText = extractedKeywords[0].key === '不能被打出' ? '词条' : extractedKeywords[0].key;
  } else if (extractedKeywords.length > 1) {
    kwBadgeText = `词条(${extractedKeywords.length})`;
  }
  const kwTooltipDesc = extractedKeywords.map((k) => `• ${k.key}：${k.desc}`).join('\n');
  const kwTriggerHtml =
    extractedKeywords.length > 0
      ? `<span
          class="card-kw-trigger"
          tabindex="0"
          role="button"
          aria-label="${escapeHtml(`查看【${stats.name}】词条说明`)}"
          data-tooltip-title="${escapeHtml(`${stats.name} · 词条说明`)}"
          data-tooltip-tag="${escapeHtml(`共 ${extractedKeywords.length} 项`)}"
          data-tooltip-desc="${escapeHtml(kwTooltipDesc)}"
        ><span class="card-kw-trigger-text">${escapeHtml(kwBadgeText)}</span><span class="card-kw-qmark" aria-hidden="true">?</span></span>`
      : '';

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
      : options.exhaustMultiSelectable
        ? options.exhaustMultiSelected
          ? '✕ 将消耗'
          : '点击选消'
        : options.drawBottomMultiSelectable
          ? options.drawBottomMultiSelected
            ? '✦ 将置底'
            : '点击置底'
          : options.discardPickSelectable
            ? options.discardPickSelected
              ? '✦ 已选取回'
              : options.discardPickLabel || '点击选择'
            : options.exhaustSelectable
              ? '点击消耗'
              : options.upgradeSelectable
                ? '点击升级'
                : options.dualWieldSelectable
                  ? '点击复制'
                  : options.nightmareSelectable
                    ? '下回合×3'
                    : options.drawTopSelectable
                      ? '置于牌堆顶'
                      : options.drawBottomSelectable
                        ? '置于牌堆底'
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

  const actionName = options.action || 'noop';
  const isPassiveCard = actionName === 'noop';
  const disabledAttr =
    options.disabled && !isPassiveCard
      ? 'disabled'
      : options.disabled && isPassiveCard
        ? 'aria-disabled="true"'
        : '';
  const nameLenClass =
    stats.name.length >= 6 ? 'name-xcompact' : stats.name.length >= 5 ? 'name-compact' : '';

  return `
    <button
      type="button"
      id="${escapeHtml(`${idPrefix}-${cardInstance.instanceId}`)}"
      class="${extraClasses}${isPassiveCard ? ' card-passive' : ''}"
      ${styleAttr}
      data-rarity="${escapeHtml(stats.rarity)}"
      data-character="${escapeHtml(stats.character)}"
      data-action="${escapeHtml(actionName)}"
      data-instance-id="${escapeHtml(cardInstance.instanceId)}"
      ${options.conditionActive ? 'data-condition-active="true"' : ''}
      ${options.unplayableReason ? `data-unplayable-reason="${escapeHtml(options.unplayableReason)}"` : ''}
      ${options.offerIndex !== undefined ? `data-offer-index="${options.offerIndex}"` : ''}
      ${disabledAttr}
    >
      <div>
        <div class="card-top">
          <span class="card-cost ${costBadgeClass}" ${costTooltipAttrs}>${escapeHtml(desc.displayCost)}</span>
          <span class="card-name ${stats.upgraded ? 'upgraded' : ''} ${nameLenClass}">${escapeHtml(stats.name)}</span>
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
        <div class="card-desc ${descToneClass}">${formatCardDescHtml(desc.text)}</div>
      </div>
      ${upgradePreviewNote}
      ${
        upgradePreviewNote && !kwTriggerHtml
          ? ''
          : `<div class="card-footer">
              <span class="card-target-label">${escapeHtml(targetLabel)}</span>
              ${kwTriggerHtml}
            </div>`
      }
    </button>
  `;
}

export function renderStatusesHtml(entity, ownerLabel = '状态') {
  const entries = Object.entries(entity?.statuses || {}).filter(
    ([key, val]) => val !== 0 || (key === 'invincible' && (entity?.invincibleMax ?? 0) > 0)
  );
  if (entries.length === 0) {
    return '<div class="status-row"></div>';
  }
  const entityScope = entity?.id || (ownerLabel === '自身' ? 'player' : 'unit');
  const chips = entries
    .map(([key, val]) => {
      const metaInfo = STATUS_METADATA[key] || {
        name: key,
        polarity: 'buff',
        describe: () => '',
      };
      const polarity =
        (key === 'strength' || key === 'dexterity' || key === 'focus') && val < 0
          ? 'debuff'
          : metaInfo.polarity;
      const polarityLabel = polarity === 'debuff' ? '负面状态' : '正面状态';
      const displayVal = key === 'slow' ? `+${(entity?.slowStacks ?? 0) * 10}%` : `${val}`;
      let descText = metaInfo.describe(val, entity?.slowStacks ?? 0);
      if (key === 'stasis' && entity?.stasisCard) {
        const stolenName = getCardStats(entity.stasisCard)?.name || entity.stasisCard.cardId;
        descText = `已封印你的卡牌【${stolenName}】：击败该单位后立即归还至你的手牌！`;
      }
      const hideCount = key !== 'slow' && key !== 'invincible' && val === 1;
      const svgMarkup = getStatusSvg(key, { polarity, scope: entityScope });
      return `<span
        class="status-chip ${escapeHtml(polarity)}${hideCount ? ' icon-only' : ''}"
        data-status-key="${escapeHtml(key)}"
        tabindex="0"
        aria-label="${escapeHtml(`${metaInfo.name} ${displayVal}`)}"
        data-tooltip-title="${escapeHtml(`${metaInfo.name} (${displayVal})`)}"
        data-tooltip-tag="${escapeHtml(`${ownerLabel} · ${polarityLabel}`)}"
        data-tooltip-desc="${escapeHtml(descText)}"
        data-tooltip-tone="${escapeHtml(polarity)}"
      ><span class="status-icon" aria-hidden="true">${svgMarkup}</span>${
        hideCount ? '' : `<span class="status-val">${escapeHtml(displayVal)}</span>`
      }</span>`;
    })
    .join('');
  return `<div class="status-row">${chips}</div>`;
}
