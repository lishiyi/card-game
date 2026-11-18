import {
  canUpgradeCard,
  formatCardDescription,
  formatUpgradePreview,
  getCardStats,
} from '../data/cards.js';
import { EVENT_LIBRARY, NODE_TYPE_META, TOTAL_FLOORS } from '../data/events.js';
import { POTION_LIBRARY, RELIC_LIBRARY, STATUS_METADATA } from '../data/relics.js';
import { canPlayCard, getAliveEnemies } from '../engine/combat.js';
import {
  buyShopCard,
  buyShopPotion,
  buyShopPurge,
  buyShopRelic,
  cancelEventPurge,
  chooseEventOption,
  claimRewardCard,
  claimRewardGold,
  claimRewardPotion,
  claimRewardRelic,
  completeEventPurge,
  continueFromEvent,
  createNewRun,
  discardPotion,
  getAvailableNodeIds,
  getUnclaimedImportantRewards,
  getUpgradableDeckCards,
  leaveRestSite,
  leaveShop,
  proceedFromReward,
  restHeal,
  restUpgradeCard,
  runEndTurn,
  runPlayCard,
  runRestartCombat,
  runUsePotion,
  selectMapNode,
} from '../engine/game.js';
import { getEnemyIntentPreview } from '../engine/math.js';
import {
  getCardTypeIconSvg,
  getCharacterSvg,
  getIntentIconSvg,
  getNodeIconSvg,
} from './icons.js';

const STORAGE_KEY = 'sts_lite_saved_run_v1';

const CARD_TYPE_LABELS = {
  attack: '攻击',
  skill: '技能',
  power: '能力',
  status: '状态',
};

const RARITY_LABELS = {
  starter: '基础',
  common: '普通',
  uncommon: '罕见',
  rare: '稀有',
  status: '状态',
};

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function loadSavedRun() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      parsed.player &&
      Array.isArray(parsed.player.deck) &&
      Array.isArray(parsed.map) &&
      parsed.map.length === TOTAL_FLOORS &&
      typeof parsed.screen === 'string'
    ) {
      return parsed;
    }
  } catch {
    // Ignore storage access or parse errors
  }
  return null;
}

function persistRun(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

export function mountSpireApp(rootEl) {
  let state = loadSavedRun() || createNewRun();

  rootEl.innerHTML = '';
  const stageRoot = document.createElement('div');
  const tooltipEl = document.createElement('div');
  tooltipEl.id = 'spire-tooltip';
  tooltipEl.className = 'spire-tooltip';
  tooltipEl.setAttribute('role', 'tooltip');
  tooltipEl.hidden = true;
  rootEl.append(stageRoot, tooltipEl);

  let activeTooltipAnchor = null;

  function hideTooltip() {
    activeTooltipAnchor = null;
    tooltipEl.hidden = true;
  }

  function positionTooltip(anchorEl) {
    if (!anchorEl || tooltipEl.hidden) return;
    const rect = anchorEl.getBoundingClientRect();
    const tipRect = tooltipEl.getBoundingClientRect();
    const margin = 10;

    let left = rect.left + rect.width / 2 - tipRect.width / 2;
    left = Math.max(margin, Math.min(window.innerWidth - tipRect.width - margin, left));

    let top = rect.bottom + 8;
    if (
      top + tipRect.height > window.innerHeight - margin &&
      rect.top - tipRect.height - 8 >= margin
    ) {
      top = rect.top - tipRect.height - 8;
    }

    tooltipEl.style.left = `${Math.round(left)}px`;
    tooltipEl.style.top = `${Math.round(top)}px`;
  }

  function showTooltip(anchorEl) {
    if (!anchorEl) {
      hideTooltip();
      return;
    }
    if (activeTooltipAnchor === anchorEl && !tooltipEl.hidden) {
      return;
    }
    const title = anchorEl.dataset.tooltipTitle || '';
    const tag = anchorEl.dataset.tooltipTag || '';
    const desc = anchorEl.dataset.tooltipDesc || '';
    const tone = anchorEl.dataset.tooltipTone || '';
    if (!desc) {
      hideTooltip();
      return;
    }

    activeTooltipAnchor = anchorEl;
    tooltipEl.innerHTML = `
      <div class="spire-tooltip-head">
        <span class="spire-tooltip-title ${tone ? `tone-${escapeHtml(tone)}` : ''}">${escapeHtml(title)}</span>
        ${tag ? `<span class="spire-tooltip-tag">${escapeHtml(tag)}</span>` : ''}
      </div>
      <p class="spire-tooltip-desc">${escapeHtml(desc)}</p>
    `;
    tooltipEl.hidden = false;
    positionTooltip(anchorEl);
  }

  const ui = {
    selectedCardId: null,
    selectedPotionSlot: null,
    hoveredEnemyId: null,
    modal: null, // { mode: 'deck' | 'draw' | 'discard' | 'exhaust' | 'smith' | 'shop_purge', title: string }
    notice: '',
    noticeTone: 'normal',
  };

  function clearCombatSelection() {
    ui.selectedCardId = null;
    ui.selectedPotionSlot = null;
    ui.hoveredEnemyId = null;
  }

  function setNotice(msg, tone = 'normal') {
    ui.notice = msg || '';
    ui.noticeTone = tone;
  }

  function sanitizeUiState() {
    if (state.screen !== 'combat' || !state.combat) {
      clearCombatSelection();
      return;
    }
    if (ui.selectedCardId && !state.combat.hand.some((c) => c.instanceId === ui.selectedCardId)) {
      ui.selectedCardId = null;
    }
    if (ui.selectedPotionSlot !== null && !state.player.potions[ui.selectedPotionSlot]) {
      ui.selectedPotionSlot = null;
    }
    if (
      ui.hoveredEnemyId &&
      !state.combat.enemies.some((e) => e.id === ui.hoveredEnemyId && e.hp > 0)
    ) {
      ui.hoveredEnemyId = null;
    }
  }

  function getPreviewTargetEnemy() {
    if (state.screen !== 'combat' || !state.combat) return null;
    const alive = getAliveEnemies(state.combat);
    if (ui.hoveredEnemyId) {
      const hovered = alive.find((e) => e.id === ui.hoveredEnemyId);
      if (hovered) return hovered;
    }
    if (alive.length === 1) return alive[0];
    return null;
  }

  function renderCardHtml(cardInstance, options = {}) {
    const stats = getCardStats(cardInstance);
    const combatCtx = options.combatContext ?? null;
    const desc = formatCardDescription(cardInstance, combatCtx);
    const idPrefix = options.idPrefix || 'card';
    const extraClasses = [
      'game-card',
      `rarity-${stats.rarity}`,
      options.playable ? 'playable' : '',
      options.selected ? 'selected-card' : '',
      options.dimmed ? 'unplayable-dim' : '',
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
        upgradePreviewNote = `<div class="card-upgrade-preview">升级后：${escapeHtml(upgPreview.text)}</div>`;
      }
    }

    const costTooltipAttrs = stats.costReduced
      ? `data-tooltip-title="升级减费" data-tooltip-tag="卡牌强化" data-tooltip-desc="${escapeHtml(`升级后费用由 ${stats.baseCost} 点减少至 ${stats.cost} 点。`)}" data-tooltip-tone="buff"`
      : '';

    return `
      <button
        type="button"
        id="${escapeHtml(`${idPrefix}-${cardInstance.instanceId}`)}"
        class="${extraClasses}"
        data-rarity="${escapeHtml(stats.rarity)}"
        data-action="${escapeHtml(options.action || 'noop')}"
        data-instance-id="${escapeHtml(cardInstance.instanceId)}"
        ${options.offerIndex !== undefined ? `data-offer-index="${options.offerIndex}"` : ''}
        ${options.disabled ? 'disabled' : ''}
      >
        <div>
          <div class="card-top">
            <span class="card-cost ${stats.costReduced ? 'upgraded' : ''}" ${costTooltipAttrs}>${escapeHtml(desc.displayCost)}</span>
            <span class="card-name ${stats.upgraded ? 'upgraded' : ''}">${escapeHtml(stats.name)}</span>
            ${typeof options.hotkey === 'number' ? `<span class="card-hotkey">[${options.hotkey}]</span>` : ''}
          </div>
          <div class="card-banner type-${escapeHtml(stats.type)}">
            <span class="card-type-label">
              <span>${escapeHtml(CARD_TYPE_LABELS[stats.type] || stats.type)}</span>
              ${getCardTypeIconSvg(stats.type)}
            </span>
            <span class="rarity-badge rarity-${escapeHtml(stats.rarity)}">${escapeHtml(RARITY_LABELS[stats.rarity] || '')}</span>
          </div>
          <div class="card-desc ${descToneClass}">${escapeHtml(desc.text)}</div>
        </div>
        ${
          upgradePreviewNote ||
          `<div class="card-footer">
            <span>${stats.target === 'all_enemies' ? '全体目标' : stats.target === 'enemy' ? '单体目标' : '自身'}</span>
            <span>${stats.exhaust ? '消耗' : ''}</span>
          </div>`
        }
      </button>
    `;
  }

  function renderStatusesHtml(entity, ownerLabel = '状态') {
    const entries = Object.entries(entity?.statuses || {}).filter(([, val]) => val !== 0);
    if (entries.length === 0) {
      return '<div class="status-row"></div>';
    }
    const chips = entries
      .map(([key, val]) => {
        const meta = STATUS_METADATA[key] || {
          name: key,
          polarity: 'buff',
          describe: () => '',
        };
        const polarity =
          (key === 'strength' || key === 'dexterity') && val < 0 ? 'debuff' : meta.polarity;
        const polarityLabel = polarity === 'debuff' ? '负面状态' : '正面状态';
        return `<span
          class="status-chip ${escapeHtml(polarity)}"
          tabindex="0"
          data-tooltip-title="${escapeHtml(`${meta.name} (${val})`)}"
          data-tooltip-tag="${escapeHtml(`${ownerLabel} · ${polarityLabel}`)}"
          data-tooltip-desc="${escapeHtml(meta.describe(val))}"
          data-tooltip-tone="${escapeHtml(polarity)}"
        >${escapeHtml(meta.name)} ${escapeHtml(val)}</span>`;
      })
      .join('');
    return `<div class="status-row">${chips}</div>`;
  }

  function renderTopHud() {
    const relicsHtml = state.player.relics
      .map((id) => {
        const r = RELIC_LIBRARY[id];
        if (!r) return '';
        return `<span
          class="relic-badge"
          tabindex="0"
          data-tooltip-title="${escapeHtml(r.name)}"
          data-tooltip-tag="${escapeHtml(r.tier === 'starter' ? '初始遗物' : '遗物')}"
          data-tooltip-desc="${escapeHtml(r.description)}"
          data-tooltip-tone="relic"
        >${escapeHtml(r.name)}</span>`;
      })
      .join('');

    const potionsHtml = state.player.potions
      .map((potionId, idx) => {
        if (!potionId) {
          return `
            <span
              class="potion-tooltip-anchor"
              tabindex="0"
              data-tooltip-title="空药水栏"
              data-tooltip-tag="药水栏位"
              data-tooltip-desc="最多可携带 2 瓶药水，可在战斗战利品或神秘商人处获得。"
            >
              <button type="button" id="potion-slot-${idx}" class="potion-slot" disabled>空药水栏</button>
            </span>
          `;
        }
        const pot = POTION_LIBRARY[potionId];
        const selected = ui.selectedPotionSlot === idx;
        const canDrink =
          state.screen === 'combat' &&
          state.combat?.status === 'ongoing' &&
          state.combat?.phase === 'player';
        const showDiscard =
          (state.screen === 'reward' && state.reward?.potionId && !state.reward.potionClaimed) ||
          state.screen === 'shop';
        const targetLabel = pot.target === 'enemy' ? '单体目标' : '自身';
        const stateHint = canDrink ? '点击饮用' : '战斗中可用';

        return `
          <span style="display:inline-flex;align-items:center;gap:3px;">
            <span
              class="potion-tooltip-anchor"
              tabindex="0"
              data-tooltip-title="${escapeHtml(pot.name)}"
              data-tooltip-tag="${escapeHtml(`药水 · ${targetLabel}（${stateHint}）`)}"
              data-tooltip-desc="${escapeHtml(pot.description)}"
              data-tooltip-tone="potion"
            >
              <button
                type="button"
                id="potion-slot-${idx}"
                class="potion-slot filled"
                data-action="use-potion"
                data-slot="${idx}"
                ${canDrink ? '' : 'disabled'}
                style="${selected ? 'outline: 2px solid var(--accent-brass);' : ''}"
              >
                ${escapeHtml(pot.name)}
              </button>
            </span>
            ${
              showDiscard
                ? `<button type="button" id="discard-potion-${idx}" class="potion-slot" data-action="discard-potion" data-slot="${idx}" data-tooltip-title="丢弃药水" data-tooltip-tag="药水管理" data-tooltip-desc="${escapeHtml(`丢弃【${pot.name}】以腾出药水栏位。`)}">×</button>`
                : ''
            }
          </span>
        `;
      })
      .join('');

    return `
      <header class="top-hud">
        <div class="brand-cluster">
          <h1 class="game-title">杀戮尖塔 · 简明版</h1>
          <span class="floor-indicator">第 ${escapeHtml(Math.max(1, state.floor || 1))} / ${escapeHtml(TOTAL_FLOORS)} 层</span>
        </div>

        <div class="vitals-cluster">
          <span class="vital-chip vital-hp" id="hud-player-hp">生命 ${escapeHtml(state.player.hp)} / ${escapeHtml(state.player.maxHp)}</span>
          <span class="vital-chip vital-gold" id="hud-player-gold">金币 ${escapeHtml(state.player.gold)}</span>
          <div class="relic-strip" aria-label="已拥有遗物">${relicsHtml}</div>
          <div class="potion-strip" aria-label="药水栏">${potionsHtml}</div>
        </div>

        <nav class="top-actions" aria-label="全局操作">
          <button type="button" id="btn-open-deck" class="btn-stone" data-action="open-modal" data-modal="deck">
            牌组 (${escapeHtml(state.player.deck.length)})
          </button>
          ${
            state.screen === 'combat' && state.combat?.status === 'ongoing'
              ? `<button
                  type="button"
                  id="btn-restart-combat"
                  class="btn-stone"
                  data-action="restart-combat"
                  ${
                    state.combatSnapshot
                      ? 'data-tooltip-title="重启本场战斗" data-tooltip-tag="战斗操作" data-tooltip-desc="放弃当前回合进度，恢复到本场战斗第 1 回合初始状态。"'
                      : 'disabled'
                  }
                >
                  重启本场战斗
                </button>`
              : ''
          }
          <button type="button" id="btn-new-run" class="btn-stone" data-action="new-run">
            新的一局
          </button>
        </nav>
      </header>
    `;
  }

  function renderMapScreen() {
    const availableIds = new Set(getAvailableNodeIds(state));
    const totalRows = state.map.length;

    const rowHeight = 38;
    const rowGap = 6;
    const totalHeight = totalRows * rowHeight + (totalRows - 1) * rowGap;

    const nodeCoords = new Map();
    state.map.forEach((row, rIdx) => {
      const topIdx = totalRows - 1 - rIdx;
      const yPct = (((topIdx * (rowHeight + rowGap) + rowHeight / 2) / totalHeight) * 100).toFixed(2);
      row.forEach((node, cIdx) => {
        const xPct = row.length === 1 ? 50 : cIdx === 0 ? 30 : 70;
        nodeCoords.set(node.id, { x: xPct, y: yPct });
      });
    });

    const edgeLines = [];
    for (const row of state.map) {
      for (const node of row) {
        const from = nodeCoords.get(node.id);
        for (const nextId of node.nextIds) {
          const to = nodeCoords.get(nextId);
          if (!from || !to) continue;
          const isActiveEdge = state.currentNodeId === node.id && availableIds.has(nextId);
          const stroke = isActiveEdge
            ? 'hsl(38, 68%, 56%)'
            : node.visited
              ? 'hsl(32, 18%, 36%)'
              : 'hsl(28, 10%, 25%)';
          const dash = isActiveEdge ? 'none' : '5 5';
          const width = isActiveEdge ? '2.6' : '1.8';
          edgeLines.push(
            `<line x1="${from.x}%" y1="${from.y}%" x2="${to.x}%" y2="${to.y}%" stroke="${stroke}" stroke-width="${width}" stroke-dasharray="${dash}" stroke-linecap="round" />`
          );
        }
      }
    }

    const rowsHtml = state.map
      .map((row, rIdx) => {
        const nodesHtml = row
          .map((node) => {
            const meta = NODE_TYPE_META[node.type] || { label: node.type, shortLabel: node.type };
            const isAvailable = availableIds.has(node.id);
            const isCurrent = state.currentNodeId === node.id;
            const cls = [
              'map-node-btn',
              `node-kind-${node.type}`,
              node.visited ? 'visited' : '',
              isAvailable ? 'available' : '',
            ]
              .filter(Boolean)
              .join(' ');

            const statusNote = isCurrent
              ? '当前位置'
              : node.visited
                ? '已通过'
                : isAvailable
                  ? '点击前往'
                  : `第 ${node.floor} 层`;

            return `
              <button
                type="button"
                id="map-node-${escapeHtml(node.id)}"
                class="${cls}"
                data-node-type="${escapeHtml(node.type)}"
                data-action="select-node"
                data-node-id="${escapeHtml(node.id)}"
                ${isAvailable ? '' : 'disabled'}
              >
                <span class="node-icon-wrap node-type-${escapeHtml(node.type)}">${getNodeIconSvg(node.type)}</span>
                <span class="node-text">
                  <span class="node-title">${escapeHtml(meta.label)}</span>
                  <span class="node-hint">${escapeHtml(statusNote)}</span>
                </span>
              </button>
            `;
          })
          .join('');

        return `
          <div class="map-row ${row.length === 2 ? 'two-cols' : ''}">
            <span class="map-floor-tag">F${rIdx + 1}</span>
            ${nodesHtml}
          </div>
        `;
      })
      .join('');

    return `
      <section class="panel-stage" aria-labelledby="map-heading">
        <div class="stage-header">
          <div>
            <h2 id="map-heading" class="stage-heading">尖塔攀登路线</h2>
            <p class="stage-subtitle">自下而上选择高亮节点前进，观察连线提前规划营地、商店与精英路线，在第 ${escapeHtml(TOTAL_FLOORS)} 层击败【尖塔守护者】通关。</p>
          </div>
          ${
            state.restState?.lastAction
              ? `<span class="floor-indicator">上次营地：${escapeHtml(state.restState.lastAction)}</span>`
              : ''
          }
        </div>
        <div class="map-board">
          <svg class="map-edges-svg" aria-hidden="true">${edgeLines.join('')}</svg>
          ${rowsHtml}
        </div>
      </section>
    `;
  }

  function renderCombatScreen() {
    const combat = state.combat;
    const aliveEnemies = getAliveEnemies(combat);
    const selectedCard = ui.selectedCardId
      ? combat.hand.find((c) => c.instanceId === ui.selectedCardId)
      : null;
    const selectedCardStats = selectedCard ? getCardStats(selectedCard) : null;
    const isTargetingEnemy =
      (selectedCardStats && selectedCardStats.target === 'enemy') ||
      (ui.selectedPotionSlot !== null &&
        POTION_LIBRARY[state.player.potions[ui.selectedPotionSlot]]?.target === 'enemy');

    const playerHpPct = Math.max(
      0,
      Math.min(100, Math.round((state.player.hp / state.player.maxHp) * 100))
    );

    const enemiesHtml = combat.enemies
      .map((enemy) => {
        const hpPct = Math.max(0, Math.min(100, Math.round((enemy.hp / enemy.maxHp) * 100)));
        const intentPreview = getEnemyIntentPreview(enemy, state.player);
        const intentClass = intentPreview.isAttack
          ? 'attack'
          : intentPreview.type.startsWith('defend')
            ? 'defend'
            : 'buff';
        const targetable = enemy.hp > 0 && isTargetingEnemy;

        return `
          <div
            id="enemy-unit-${escapeHtml(enemy.id)}"
            class="fighter-unit ${enemy.hp <= 0 ? 'dead' : ''} ${targetable ? 'enemy-targetable' : ''}"
            data-action="${enemy.hp > 0 ? 'click-enemy' : 'noop'}"
            data-enemy-id="${escapeHtml(enemy.id)}"
            role="${targetable ? 'button' : 'group'}"
            tabindex="${targetable ? '0' : '-1'}"
            aria-label="${escapeHtml(`${enemy.name} 生命 ${enemy.hp}/${enemy.maxHp}`)}"
          >
            <div
              class="intent-badge ${intentClass}"
              ${
                enemy.hp > 0 && intentPreview.detail
                  ? `data-tooltip-title="${escapeHtml(enemy.intent?.name ? `行动意图：${enemy.intent.name}` : '敌方行动意图')}" data-tooltip-tag="${escapeHtml(enemy.name)}" data-tooltip-desc="${escapeHtml(intentPreview.detail)}"`
                  : ''
              }
            >
              ${enemy.hp > 0 ? getIntentIconSvg(intentPreview.type) : ''}
              <span>${enemy.hp > 0 ? escapeHtml(intentPreview.label) : '已击败'}</span>
            </div>
            <div class="unit-figure">
              ${getCharacterSvg(enemy.artKey, enemy.mode)}
            </div>
            <div class="unit-name-row">
              <span>${escapeHtml(enemy.name)}</span>
              ${
                enemy.block > 0
                  ? `<span class="block-pill" data-tooltip-title="${escapeHtml(`格挡 (${enemy.block})`)}" data-tooltip-tag="${escapeHtml(enemy.name)}" data-tooltip-desc="优先抵消受到的攻击伤害，下回合开始时清零。">盾 ${escapeHtml(enemy.block)}</span>`
                  : ''
              }
            </div>
            <div class="hp-track">
              <div class="hp-fill ${enemy.block > 0 ? 'shielded' : ''}" style="width: ${hpPct}%;"></div>
              <span class="hp-label">${escapeHtml(enemy.hp)} / ${escapeHtml(enemy.maxHp)}</span>
            </div>
            ${renderStatusesHtml(enemy, enemy.name)}
          </div>
        `;
      })
      .join('');

    const previewTarget = getPreviewTargetEnemy();
    const handHtml = combat.hand
      .map((card, idx) => {
        const check = canPlayCard(state, card.instanceId);
        return renderCardHtml(card, {
          idPrefix: 'hand-card',
          action: 'click-hand-card',
          playable: check.playable,
          selected: ui.selectedCardId === card.instanceId,
          dimmed: !check.playable,
          hotkey: idx < 9 ? idx + 1 : undefined,
          combatContext: {
            player: state.player,
            targetEnemy: previewTarget,
          },
        });
      })
      .join('');

    const recentLogs = combat.logs
      .slice(-8)
      .reverse()
      .map(
        (entry) =>
          `<div class="log-entry"><span class="log-turn">[T${escapeHtml(entry.turn)}]</span><span>${escapeHtml(entry.message)}</span></div>`
      )
      .join('');

    let bannerText = ui.notice;
    let bannerClass = ui.noticeTone === 'warn' ? 'warn' : '';
    if (isTargetingEnemy) {
      const itemName = selectedCardStats
        ? selectedCardStats.name
        : POTION_LIBRARY[state.player.potions[ui.selectedPotionSlot]]?.name;
      bannerText = `请点击右侧一名敌人作为【${itemName}】的目标（再次点击卡牌或按 Esc 取消）`;
      bannerClass = 'targeting';
    } else if (!bannerText) {
      bannerText = `第 ${combat.turn} 回合 · ${combat.encounterName}（数字键 1-9 快速出牌，E 键结束回合）`;
    }

    return `
      <div class="toast-banner ${bannerClass}" id="combat-banner">${escapeHtml(bannerText)}</div>

      <section class="combat-arena" aria-label="战斗舞台">
        <div class="fighters-group">
          <div class="fighter-unit" id="player-unit">
            <div class="intent-badge">第 ${escapeHtml(combat.turn)} 回合</div>
            <div class="unit-figure">${getCharacterSvg('ironclad')}</div>
            <div class="unit-name-row">
              <span>${escapeHtml(state.player.name)}</span>
              ${
                state.player.block > 0
                  ? `<span class="block-pill" data-tooltip-title="${escapeHtml(`格挡 (${state.player.block})`)}" data-tooltip-tag="自身" data-tooltip-desc="优先抵消敌方攻击伤害，下回合开始时清零。">盾 ${escapeHtml(state.player.block)}</span>`
                  : ''
              }
            </div>
            <div class="hp-track">
              <div class="hp-fill ${state.player.block > 0 ? 'shielded' : ''}" style="width: ${playerHpPct}%;"></div>
              <span class="hp-label">${escapeHtml(state.player.hp)} / ${escapeHtml(state.player.maxHp)}</span>
            </div>
            ${renderStatusesHtml(state.player, '自身')}
          </div>
        </div>

        <div class="fighters-group">
          ${enemiesHtml}
        </div>
      </section>

      <section class="combat-dock" aria-label="手牌与能量控制区">
        <div class="dock-controls">
          <div class="pile-group">
            <button type="button" id="btn-draw-pile" class="btn-stone" data-action="open-modal" data-modal="draw">
              抽牌堆 (${escapeHtml(combat.drawPile.length)})
            </button>
            <div class="energy-orb" id="energy-orb" aria-label="当前能量">
              ${escapeHtml(state.player.energy)}/${escapeHtml(state.player.maxEnergy)}
              <span>能量</span>
            </div>
          </div>

          <div class="pile-group">
            <button
              type="button"
              id="btn-end-turn"
              class="btn-brass"
              data-action="end-turn"
              ${combat.phase !== 'player' || aliveEnemies.length === 0 ? 'disabled' : ''}
            >
              结束回合 (E)
            </button>
            <button type="button" id="btn-discard-pile" class="btn-stone" data-action="open-modal" data-modal="discard">
              弃牌堆 (${escapeHtml(combat.discardPile.length)})
            </button>
            <button type="button" id="btn-exhaust-pile" class="btn-stone" data-action="open-modal" data-modal="exhaust">
              消耗堆 (${escapeHtml(combat.exhaustPile.length)})
            </button>
          </div>
        </div>

        <div class="hand-tray" id="hand-tray">
          ${handHtml || '<p class="stage-subtitle">当前无手牌，请点击“结束回合”。</p>'}
        </div>

        <div class="combat-log" id="combat-log" aria-live="polite">
          ${recentLogs}
        </div>
      </section>
    `;
  }

  function renderRewardScreen() {
    const rw = state.reward;
    if (!rw) return '';

    const goldBtn = !rw.goldClaimed
      ? `<button type="button" id="btn-claim-gold" class="btn-stone" data-action="claim-gold">领取金币 (+${escapeHtml(rw.gold)})</button>`
      : `<span class="vital-chip" style="opacity:0.6;">金币已领取</span>`;

    const relicObj = rw.relicId ? RELIC_LIBRARY[rw.relicId] : null;
    const relicBtn =
      relicObj && !rw.relicClaimed
        ? `<button type="button" id="btn-claim-relic" class="btn-stone" data-action="claim-relic" data-tooltip-title="${escapeHtml(relicObj.name)}" data-tooltip-tag="战利品遗物" data-tooltip-desc="${escapeHtml(relicObj.description)}" data-tooltip-tone="relic">拾取遗物：${escapeHtml(relicObj.name)}</button>`
        : '';

    const potionObj = rw.potionId ? POTION_LIBRARY[rw.potionId] : null;
    const potionBtn =
      potionObj && !rw.potionClaimed
        ? `<button type="button" id="btn-claim-potion" class="btn-stone" data-action="claim-potion" data-tooltip-title="${escapeHtml(potionObj.name)}" data-tooltip-tag="战利品药水" data-tooltip-desc="${escapeHtml(potionObj.description)}" data-tooltip-tone="potion">拾取药水：${escapeHtml(potionObj.name)}</button>`
        : '';

    const cardsHtml = rw.cardChoices
      .map((card) =>
        renderCardHtml(card, {
          idPrefix: 'reward-card',
          action: 'claim-card',
          playable: !rw.cardClaimed,
          selected: rw.pickedCardId === card.instanceId,
          dimmed: rw.cardClaimed && rw.pickedCardId !== card.instanceId,
          disabled: rw.cardClaimed,
        })
      )
      .join('');

    return `
      <section class="panel-stage" aria-labelledby="reward-heading">
        <div class="stage-header">
          <div>
            <h2 id="reward-heading" class="stage-heading">战斗胜利 · 战利品结算</h2>
            <p class="stage-subtitle">收集战利品，并从以下 3 张卡牌中挑选 1 张加入你的牌组（也可跳过不拿以保持精简牌组）。</p>
          </div>
          <button type="button" id="btn-proceed-reward" class="btn-brass" data-action="proceed-reward">
            继续前进 →
          </button>
        </div>

        ${ui.notice ? `<div class="toast-banner ${ui.noticeTone === 'warn' ? 'warn' : ''}" style="margin-bottom:12px;">${escapeHtml(ui.notice)}</div>` : ''}

        <div class="loot-list">
          ${goldBtn}
          ${relicBtn}
          ${potionBtn}
        </div>

        <h3 style="margin:0 0 8px;font-size:0.95rem;color:var(--text-sand);">
          ${rw.cardClaimed ? '已选择加入牌组的卡牌：' : '卡牌奖励（三选一）：'}
        </h3>
        <div class="card-showcase">${cardsHtml}</div>
      </section>
    `;
  }

  function renderRestScreen() {
    const healAmount = Math.max(1, Math.floor(state.player.maxHp * 0.3));
    const upgradable = getUpgradableDeckCards(state);

    return `
      <section class="panel-stage" aria-labelledby="rest-heading">
        <div class="stage-header">
          <div>
            <h2 id="rest-heading" class="stage-heading">篝火营地</h2>
            <p class="stage-subtitle">摇曳的火光驱散了尖塔寒意。你可以小憩恢复体力，或在铁砧上锻造升级一张卡牌。</p>
          </div>
        </div>

        <div class="choice-stack">
          <button type="button" id="btn-rest-heal" class="choice-btn" data-action="rest-heal">
            <span class="choice-title">篝火休息（回复 ${escapeHtml(healAmount)} 点生命）</span>
            <span class="choice-detail">回复最大生命值的 30%（当前生命 ${escapeHtml(state.player.hp)} / ${escapeHtml(state.player.maxHp)}）。</span>
          </button>

          <button
            type="button"
            id="btn-rest-smith"
            class="choice-btn"
            data-action="open-modal"
            data-modal="smith"
            ${upgradable.length === 0 ? 'disabled' : ''}
          >
            <span class="choice-title">铁砧锻造（升级 1 张卡牌）</span>
            <span class="choice-detail">
              ${
                upgradable.length > 0
                  ? `从牌组中的 ${upgradable.length} 张可升级卡牌里选择 1 张永久强化。`
                  : '当前牌组中所有卡牌均已升级。'
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

  function renderShopScreen() {
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

    const relicOffer = shop.relicOffer;
    const relicDef = relicOffer ? RELIC_LIBRARY[relicOffer.relicId] : null;
    const potionOffer = shop.potionOffer;
    const potionDef = potionOffer ? POTION_LIBRARY[potionOffer.potionId] : null;

    return `
      <section class="panel-stage" aria-labelledby="shop-heading">
        <div class="stage-header">
          <div>
            <h2 id="shop-heading" class="stage-heading">神秘商人</h2>
            <p class="stage-subtitle">“欢迎来到我的地毯小铺，尖塔行者！看中什么尽管挑，概不赊账。”</p>
          </div>
          <button type="button" id="btn-leave-shop" class="btn-brass" data-action="leave-shop">
            离开商店 →
          </button>
        </div>

        ${ui.notice ? `<div class="toast-banner ${ui.noticeTone === 'warn' ? 'warn' : ''}" style="margin-bottom:12px;">${escapeHtml(ui.notice)}</div>` : ''}

        <div class="shop-section">
          <h3>精选卡牌</h3>
          <div class="card-showcase">${cardsHtml}</div>
        </div>

        <div class="shop-section">
          <h3>遗物 · 药水 · 牌组精简服务</h3>
          <div class="choice-stack">
            ${
              relicDef
                ? `<button type="button" id="btn-buy-relic" class="choice-btn" data-action="buy-shop-relic" ${relicOffer.sold || state.player.gold < relicOffer.price ? 'disabled' : ''}>
                    <span class="choice-title">${relicOffer.sold ? '[已售出] ' : ''}遗物：${escapeHtml(relicDef.name)}（${escapeHtml(relicOffer.price)} 金币）</span>
                    <span class="choice-detail">${escapeHtml(relicDef.description)}</span>
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
              <span class="choice-detail">从你的牌组中永久移除 1 张基础或冗余卡牌，提升核心卡上手率。</span>
            </button>
          </div>
        </div>
      </section>
    `;
  }

  function renderEventScreen() {
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
        <p class="stage-subtitle" style="margin-bottom:12px;">请选择要从牌组中永久净化的 1 张卡牌：</p>
        <div class="card-showcase">${deckHtml}</div>
        <button type="button" id="btn-cancel-event-purge" class="btn-stone" data-action="cancel-event-purge">返回重选</button>
      `;
    } else if (evState.resolved) {
      const upgradedCards = (evState.upgradedCardIds || [])
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

      bodyHtml = `
        <div class="summary-stats">
          <p style="margin:0;">${escapeHtml(evState.outcomeText)}</p>
        </div>
        ${upgradedShowcaseHtml}
        <button type="button" id="btn-continue-event" class="btn-brass" data-action="continue-event">继续前进 →</button>
      `;
    } else {
      const choicesHtml = evDef.choices
        .map((ch) => {
          let blockedReason = '';
          if (
            (evDef.id === 'shining_light' && ch.id === 'enter_light' && state.player.hp <= 12) ||
            (evDef.id === 'thorn_reliquary' && ch.id === 'open_reliquary' && state.player.hp <= 8) ||
            (evDef.id === 'ancient_forge' && ch.id === 'overclock_forge' && state.player.hp <= 6)
          ) {
            blockedReason = '（生命不足）';
          } else if (
            evDef.id === 'ancient_forge' &&
            ch.id === 'overclock_forge' &&
            state.player.gold < 30
          ) {
            blockedReason = '（金币不足）';
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
        </div>
        ${bodyHtml}
      </section>
    `;
  }

  function renderGameOverScreen() {
    const isWin = state.runOutcome === 'victory';
    const deckHtml = state.player.deck
      .map((c) => renderCardHtml(c, { idPrefix: 'final-card', disabled: true }))
      .join('');

    return `
      <section class="panel-stage" aria-labelledby="gameover-heading">
        <div class="stage-header">
          <div>
            <h2 id="gameover-heading" class="stage-heading" style="color: ${isWin ? 'var(--jade-upgrade)' : 'var(--rust-warn)'};">
              ${isWin ? '登顶凯旋！你击败了尖塔守护者！' : '攀登折戟 · 征途落幕'}
            </h2>
            <p class="stage-subtitle">
              ${
                isWin
                  ? '青铜核心轰然碎裂，通往更高塔层的封印终于开启。'
                  : '尖塔吞没了无数挑战者，但每一次轮回都会让你更熟悉敌人的破绽。'
              }
            </p>
          </div>
          <button type="button" id="btn-restart-gameover" class="btn-brass" data-action="new-run">
            再来一局
          </button>
        </div>

        <div class="summary-stats">
          <span>抵达层数：<strong>${escapeHtml(state.floor)} / ${escapeHtml(TOTAL_FLOORS)}</strong></span>
          <span>获胜战斗：<strong>${escapeHtml(state.stats.combatsWon)}</strong></span>
          <span>击败强敌：<strong>${escapeHtml(state.stats.enemiesSlain)}</strong></span>
          <span>打出卡牌：<strong>${escapeHtml(state.stats.cardsPlayed)}</strong></span>
          <span>剩余金币：<strong>${escapeHtml(state.player.gold)}</strong></span>
        </div>

        <h3 style="margin:12px 0 8px;font-size:0.95rem;color:var(--text-sand);">最终牌组（共 ${escapeHtml(state.player.deck.length)} 张）</h3>
        <div class="card-showcase">${deckHtml}</div>
      </section>
    `;
  }

  function renderModal() {
    if (!ui.modal) return '';

    if (ui.modal === 'confirm_skip_reward') {
      const check = getUnclaimedImportantRewards(state);
      if (!check.hasUnclaimed) {
        ui.modal = null;
        return '';
      }
      return `
        <div class="modal-backdrop" id="modal-backdrop" data-action="close-modal-backdrop" role="alertdialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="reward-skip-desc">
          <div class="modal-sheet modal-confirm-sheet" id="reward-unclaimed-modal">
            <div class="modal-header">
              <div>
                <h2 id="modal-title" class="stage-heading" style="color: var(--accent-brass);">还有战利品未拾取！</h2>
                <p id="reward-skip-desc" class="stage-subtitle" style="margin-top:6px;font-size:0.94rem;color:var(--text-ivory);">
                  ${escapeHtml(check.message)}
                </p>
              </div>
            </div>
            <div class="confirm-actions">
              <button type="button" id="btn-cancel-skip-reward" class="btn-stone" data-action="close-modal">返回拾取</button>
              <button type="button" id="btn-claim-and-proceed" class="btn-brass" data-action="claim-important-and-proceed">一键拾取并继续 →</button>
              <button type="button" id="btn-confirm-skip-reward" class="btn-stone btn-danger-subtle" data-action="confirm-proceed-reward">放弃并继续</button>
            </div>
          </div>
        </div>
      `;
    }

    let title = '牌组总览';
    let subtitle = '';
    let cards = [];
    let cardAction = 'noop';
    let playable = false;
    let showUpgradePreview = false;

    if (ui.modal === 'deck') {
      title = `当前总牌组（${state.player.deck.length} 张）`;
      cards = state.player.deck;
    } else if (ui.modal === 'draw' && state.combat) {
      title = `抽牌堆（${state.combat.drawPile.length} 张）`;
      subtitle = '为保持策略公平性，抽牌堆按类型与费用排序展示（非实际抽牌顺序）。';
      cards = [...state.combat.drawPile].sort((a, b) => {
        const sa = getCardStats(a);
        const sb = getCardStats(b);
        return sa.type.localeCompare(sb.type) || String(sa.cost).localeCompare(String(sb.cost)) || sa.cardId.localeCompare(sb.cardId);
      });
    } else if (ui.modal === 'discard' && state.combat) {
      title = `弃牌堆（${state.combat.discardPile.length} 张）`;
      cards = state.combat.discardPile;
    } else if (ui.modal === 'exhaust' && state.combat) {
      title = `消耗堆（${state.combat.exhaustPile.length} 张）`;
      cards = state.combat.exhaustPile;
    } else if (ui.modal === 'smith') {
      cards = getUpgradableDeckCards(state);
      title = `铁砧锻造 · 选择 1 张卡牌永久升级（可选 ${cards.length} 张）`;
      subtitle = '底部绿色文字显示升级后的效果预览。点击卡牌即可完成锻造。';
      cardAction = 'confirm-smith';
      playable = true;
      showUpgradePreview = true;
    } else if (ui.modal === 'shop_purge') {
      cards = state.player.deck;
      title = `移除卡牌（花费 ${state.shop?.purgeCost ?? 75} 金币）`;
      subtitle = '点击任意一张卡牌将其从牌组中永久移除。';
      cardAction = 'confirm-shop-purge';
      playable = true;
    }

    const cardsHtml =
      cards.length > 0
        ? cards
            .map((c) =>
              renderCardHtml(c, {
                idPrefix: 'modal-card',
                action: cardAction,
                playable,
                disabled: !playable,
                showUpgradePreview,
              })
            )
            .join('')
        : '<p class="stage-subtitle">此处当前没有任何卡牌。</p>';

    return `
      <div class="modal-backdrop" id="modal-backdrop" data-action="close-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-sheet">
          <div class="modal-header">
            <div>
              <h2 id="modal-title" class="stage-heading">${escapeHtml(title)}</h2>
              ${subtitle ? `<p class="stage-subtitle">${escapeHtml(subtitle)}</p>` : ''}
            </div>
            <button type="button" id="btn-close-modal" class="btn-stone" data-action="close-modal">关闭 (Esc)</button>
          </div>
          <div class="card-showcase">${cardsHtml}</div>
        </div>
      </div>
    `;
  }

  function render() {
    hideTooltip();
    sanitizeUiState();
    persistRun(state);

    let mainHtml = '';
    switch (state.screen) {
      case 'map':
        mainHtml = renderMapScreen();
        break;
      case 'combat':
        mainHtml = renderCombatScreen();
        break;
      case 'reward':
        mainHtml = renderRewardScreen();
        break;
      case 'rest':
        mainHtml = renderRestScreen();
        break;
      case 'shop':
        mainHtml = renderShopScreen();
        break;
      case 'event':
        mainHtml = renderEventScreen();
        break;
      case 'game_over':
        mainHtml = renderGameOverScreen();
        break;
      default:
        mainHtml = renderMapScreen();
    }

    stageRoot.innerHTML = `
      <div class="spire-shell">
        ${renderTopHud()}
        <main class="stage-viewport">
          ${mainHtml}
        </main>
      </div>
      ${renderModal()}
    `;
  }

  function handleHandCardInteraction(instanceId) {
    if (state.screen !== 'combat' || !state.combat) return;
    const card = state.combat.hand.find((c) => c.instanceId === instanceId);
    if (!card) return;

    ui.selectedPotionSlot = null;
    const check = canPlayCard(state, instanceId);
    if (!check.playable) {
      setNotice(check.reason, 'warn');
      render();
      return;
    }

    const stats = getCardStats(card);
    const alive = getAliveEnemies(state.combat);

    if (stats.target === 'enemy' && alive.length > 1) {
      ui.selectedCardId = ui.selectedCardId === instanceId ? null : instanceId;
      setNotice('');
      render();
      return;
    }

    const targetId = stats.target === 'enemy' ? alive[0]?.id ?? null : null;
    const res = runPlayCard(state, instanceId, targetId);
    clearCombatSelection();
    setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
    render();
  }

  function handleEnemyClick(enemyId) {
    if (state.screen !== 'combat' || !state.combat) return;

    if (ui.selectedCardId) {
      const res = runPlayCard(state, ui.selectedCardId, enemyId);
      clearCombatSelection();
      setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
      render();
      return;
    }

    if (ui.selectedPotionSlot !== null) {
      const res = runUsePotion(state, ui.selectedPotionSlot, enemyId);
      clearCombatSelection();
      setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
      render();
    }
  }

  rootEl.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    if (action === 'close-modal-backdrop' && event.target !== target) {
      return;
    }

    switch (action) {
      case 'new-run': {
        state = createNewRun();
        ui.modal = null;
        clearCombatSelection();
        setNotice('');
        render();
        break;
      }
      case 'restart-combat': {
        const res = runRestartCombat(state);
        if (res.ok) {
          ui.modal = null;
          clearCombatSelection();
          setNotice('已重启本场战斗，恢复至第 1 回合初始状态。');
        } else {
          setNotice(res.reason, 'warn');
        }
        render();
        break;
      }
      case 'open-modal': {
        ui.modal = target.dataset.modal || null;
        render();
        break;
      }
      case 'close-modal':
      case 'close-modal-backdrop': {
        ui.modal = null;
        render();
        break;
      }
      case 'select-node': {
        const res = selectMapNode(state, target.dataset.nodeId);
        setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'click-hand-card': {
        handleHandCardInteraction(target.dataset.instanceId);
        break;
      }
      case 'click-enemy': {
        handleEnemyClick(target.dataset.enemyId);
        break;
      }
      case 'end-turn': {
        clearCombatSelection();
        const res = runEndTurn(state);
        setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'use-potion': {
        const slot = Number(target.dataset.slot);
        const potionId = state.player.potions[slot];
        const pot = POTION_LIBRARY[potionId];
        if (!pot) break;

        ui.selectedCardId = null;
        const alive = state.combat ? getAliveEnemies(state.combat) : [];
        if (pot.target === 'enemy' && alive.length > 1) {
          ui.selectedPotionSlot = ui.selectedPotionSlot === slot ? null : slot;
          render();
          break;
        }
        const res = runUsePotion(state, slot, pot.target === 'enemy' ? alive[0]?.id : null);
        clearCombatSelection();
        setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'discard-potion': {
        discardPotion(state, Number(target.dataset.slot));
        setNotice('已丢弃一瓶药水。');
        render();
        break;
      }
      case 'claim-gold': {
        claimRewardGold(state);
        setNotice('');
        render();
        break;
      }
      case 'claim-relic': {
        claimRewardRelic(state);
        setNotice('');
        render();
        break;
      }
      case 'claim-potion': {
        const res = claimRewardPotion(state);
        setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'claim-card': {
        const res = claimRewardCard(state, target.dataset.instanceId);
        setNotice(res.ok ? '已将该卡牌加入牌组！' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'proceed-reward': {
        const res = proceedFromReward(state);
        if (res.requiresConfirm) {
          ui.modal = 'confirm_skip_reward';
          setNotice(res.reason, 'warn');
        } else {
          ui.modal = null;
          setNotice('');
        }
        render();
        break;
      }
      case 'confirm-proceed-reward': {
        proceedFromReward(state, { force: true });
        ui.modal = null;
        setNotice('');
        render();
        break;
      }
      case 'claim-important-and-proceed': {
        if (state.reward) {
          if (!state.reward.goldClaimed && state.reward.gold > 0) {
            claimRewardGold(state);
          }
          if (state.reward.relicId && !state.reward.relicClaimed) {
            claimRewardRelic(state);
          }
        }
        proceedFromReward(state, { force: true });
        ui.modal = null;
        setNotice('');
        render();
        break;
      }
      case 'rest-heal': {
        restHeal(state);
        setNotice('');
        render();
        break;
      }
      case 'confirm-smith': {
        const res = restUpgradeCard(state, target.dataset.instanceId);
        if (res.ok) {
          ui.modal = null;
          setNotice('');
        } else {
          setNotice(res.reason, 'warn');
        }
        render();
        break;
      }
      case 'leave-rest': {
        leaveRestSite(state);
        render();
        break;
      }
      case 'buy-shop-card': {
        const res = buyShopCard(state, Number(target.dataset.offerIndex));
        setNotice(res.ok ? '购买成功，卡牌已加入牌组！' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'buy-shop-relic': {
        const res = buyShopRelic(state);
        setNotice(res.ok ? '已购入遗物！' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'buy-shop-potion': {
        const res = buyShopPotion(state);
        setNotice(res.ok ? '已购入药水！' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'confirm-shop-purge': {
        const res = buyShopPurge(state, target.dataset.instanceId);
        if (res.ok) {
          ui.modal = null;
          setNotice('已永久移除 1 张卡牌！');
        } else {
          setNotice(res.reason, 'warn');
        }
        render();
        break;
      }
      case 'leave-shop': {
        leaveShop(state);
        setNotice('');
        render();
        break;
      }
      case 'choose-event': {
        const res = chooseEventOption(state, target.dataset.choiceId);
        setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
        render();
        break;
      }
      case 'confirm-event-purge': {
        completeEventPurge(state, target.dataset.instanceId);
        render();
        break;
      }
      case 'cancel-event-purge': {
        cancelEventPurge(state);
        render();
        break;
      }
      case 'continue-event': {
        continueFromEvent(state);
        render();
        break;
      }
      default:
        break;
    }
  });

  // Instant hover tooltips + selected card's live damage preview in-place (never detaches DOM nodes!)
  rootEl.addEventListener('mouseover', (event) => {
    const targetEl = event.target instanceof Element ? event.target : null;
    const tipAnchor = targetEl ? targetEl.closest('[data-tooltip-desc]') : null;
    if (tipAnchor) {
      showTooltip(tipAnchor);
    } else {
      hideTooltip();
    }

    if (state.screen !== 'combat' || !state.combat) return;
    const enemyEl = targetEl ? targetEl.closest('[data-enemy-id]') : null;
    const nextHover = enemyEl ? enemyEl.dataset.enemyId : null;
    if (nextHover === ui.hoveredEnemyId) return;
    ui.hoveredEnemyId = nextHover;

    if (ui.selectedCardId) {
      const selectedCard = state.combat.hand.find((c) => c.instanceId === ui.selectedCardId);
      const cardEl = rootEl.querySelector(`#hand-card-${CSS.escape(ui.selectedCardId)} .card-desc`);
      if (selectedCard && cardEl) {
        const desc = formatCardDescription(selectedCard, {
          player: state.player,
          targetEnemy: getPreviewTargetEnemy(),
        });
        cardEl.textContent = desc.text;
        cardEl.classList.toggle('boosted', desc.damageState === 'boosted' || desc.blockState === 'boosted');
        cardEl.classList.toggle('reduced', desc.damageState === 'reduced' || desc.blockState === 'reduced');
      }
    }
  });

  rootEl.addEventListener('mouseleave', () => {
    hideTooltip();
  });

  rootEl.addEventListener('focusin', (event) => {
    const targetEl = event.target instanceof Element ? event.target : null;
    const tipAnchor = targetEl ? targetEl.closest('[data-tooltip-desc]') : null;
    if (tipAnchor) {
      showTooltip(tipAnchor);
    }
  });

  rootEl.addEventListener('focusout', () => {
    hideTooltip();
  });

  window.addEventListener(
    'scroll',
    () => {
      if (activeTooltipAnchor && !tooltipEl.hidden) {
        positionTooltip(activeTooltipAnchor);
      }
    },
    true
  );

  window.addEventListener('resize', () => {
    hideTooltip();
  });

  rootEl.addEventListener('keydown', (event) => {
    if (
      (event.key === 'Enter' || event.key === ' ') &&
      event.target?.matches('[role="button"][data-action="click-enemy"]')
    ) {
      event.preventDefault();
      handleEnemyClick(event.target.dataset.enemyId);
    }
  });

  // Keyboard shortcuts: 1-9 play/select hand cards, E ends turn, D opens deck, Escape cancels
  window.addEventListener('keydown', (event) => {
    if (event.target && ['INPUT', 'TEXTAREA'].includes(event.target.tagName)) return;

    if (event.key === 'Escape') {
      if (ui.modal) {
        ui.modal = null;
        render();
      } else if (ui.selectedCardId || ui.selectedPotionSlot !== null) {
        clearCombatSelection();
        render();
      }
      return;
    }

    if (ui.modal) return;

    if (event.key === 'd' || event.key === 'D') {
      ui.modal = 'deck';
      render();
      return;
    }

    if (state.screen === 'combat' && state.combat?.phase === 'player') {
      if (event.key === 'e' || event.key === 'E') {
        event.preventDefault();
        clearCombatSelection();
        runEndTurn(state);
        render();
        return;
      }

      const num = Number(event.key);
      if (num >= 1 && num <= 9) {
        const card = state.combat.hand[num - 1];
        if (card) {
          handleHandCardInteraction(card.instanceId);
        }
      }
    }
  });

  render();
  return {
    getState: () => state,
    render,
    openModal: (modalName) => {
      ui.modal = modalName;
      render();
    },
  };
}
