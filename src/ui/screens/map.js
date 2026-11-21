/**
 * Spire 16-Floor Climbing Route Map screen:
 * - Strictly non-crossing local-column (|Δcol| <= 1) top-to-bottom cubic Bezier S-curve paths
 * - 4-tier visual clarity (Active Gold Glow / Traveled Jade Trail / Reachable High-Contrast / Unreachable Dimmed)
 * - Hover-node connected path highlighting via data-from-node / data-to-node
 */

import { NODE_TYPE_META, TOTAL_FLOORS } from '../../data/events.js';
import { getDailyModifierDefs } from '../../engine/daily.js';
import {
  getAvailableNodeIds,
  getCurrentBossName,
  hasPendingNeowBlessing,
} from '../../engine/game.js';
import { escapeHtml } from '../helpers.js';
import { getNodeIconSvg } from '../icons.js';

function computeReachableGraph(state) {
  const reachableNodes = new Set();
  const reachableEdges = new Set();
  if (!state?.map || state.map.length === 0) {
    return { reachableNodes, reachableEdges };
  }

  const byId = new Map();
  for (const row of state.map) {
    for (const node of row) {
      byId.set(node.id, node);
    }
  }

  const queue = [];
  if (!state.currentNodeId) {
    for (const startNode of state.map[0]) {
      reachableNodes.add(startNode.id);
      queue.push(startNode.id);
    }
  } else if (byId.has(state.currentNodeId)) {
    reachableNodes.add(state.currentNodeId);
    queue.push(state.currentNodeId);
  }

  while (queue.length > 0) {
    const uid = queue.shift();
    const u = byId.get(uid);
    if (!u) continue;
    for (const vid of u.nextIds) {
      reachableEdges.add(`${uid}->${vid}`);
      if (!reachableNodes.has(vid)) {
        reachableNodes.add(vid);
        queue.push(vid);
      }
    }
  }

  return { reachableNodes, reachableEdges };
}

const MAP_FILTER_TYPES = Object.freeze([
  { type: 'combat', label: '普通战斗' },
  { type: 'elite', label: '精英' },
  { type: 'rest', label: '篝火' },
  { type: 'shop', label: '商店' },
  { type: 'event', label: '事件' },
  { type: 'treasure', label: '宝箱' },
  { type: 'boss', label: '首领' },
]);

export function renderMapTypeFilterBar(state, activeType = null) {
  const counts = {};
  for (const row of state?.map || []) {
    for (const node of row) {
      counts[node.type] = (counts[node.type] || 0) + 1;
    }
  }

  const chipsHtml = MAP_FILTER_TYPES.filter((item) => (counts[item.type] || 0) > 0)
    .map((item) => {
      const isActive = activeType === item.type;
      const metaInfo = NODE_TYPE_META[item.type] || { label: item.label };
      return `
        <button
          type="button"
          class="map-type-filter-btn filter-type-${escapeHtml(item.type)} ${isActive ? 'active' : ''}"
          data-action="toggle-map-type-filter"
          data-filter-node-type="${escapeHtml(item.type)}"
          aria-pressed="${isActive ? 'true' : 'false'}"
          title="${escapeHtml(`高亮显示全部【${metaInfo.label}】房间（再次点击取消）`)}"
        >
          <span class="map-type-filter-icon node-type-${escapeHtml(item.type)}" aria-hidden="true">${getNodeIconSvg(item.type)}</span>
          <span class="map-type-filter-label">${escapeHtml(item.label)}</span>
          <span class="map-type-filter-count">${counts[item.type]}</span>
        </button>
      `;
    })
    .join('');

  return `
    <div class="map-type-filter-bar" role="toolbar" aria-label="按房间类型高亮地图节点">
      <span class="map-type-filter-heading">图例筛选：</span>
      <div class="map-type-filter-chips">${chipsHtml}</div>
    </div>
  `;
}

export function renderMapBoardHtml(state, { interactive = true, idPrefix = 'map-node' } = {}) {
  const availableIds = new Set(getAvailableNodeIds(state));
  const totalRows = state.map.length;
  const bossName = getCurrentBossName(state);
  const { reachableNodes, reachableEdges } = computeReachableGraph(state);

  const visitedEdgeSet = new Set(Array.isArray(state.visitedEdges) ? state.visitedEdges : []);
  // Fallback inference if an older saved state did not yet populate visitedEdges
  if (visitedEdgeSet.size === 0) {
    for (let r = 0; r < state.map.length - 1; r += 1) {
      const visitedCurr = state.map[r].find((n) => n.visited);
      const visitedNext = state.map[r + 1].find((n) => n.visited);
      if (visitedCurr && visitedNext && visitedCurr.nextIds.includes(visitedNext.id)) {
        visitedEdgeSet.add(`${visitedCurr.id}->${visitedNext.id}`);
      }
    }
  }

  // Must match .map-row height (52px) and .map-board gap (24px) with padding: 0
  const rowHeight = 52;
  const rowGap = 24;
  const nodeHalfH = 21;
  const totalHeight = totalRows * rowHeight + (totalRows - 1) * rowGap;

  const nodeCoords = new Map();
  state.map.forEach((row, rIdx) => {
    const topIdx = totalRows - 1 - rIdx;
    const centerY = topIdx * (rowHeight + rowGap) + rowHeight / 2;
    row.forEach((node, cIdx) => {
      const slotCol =
        typeof node.slotCol === 'number'
          ? node.slotCol
          : row.length === 1
            ? 1.5
            : (cIdx / Math.max(1, row.length - 1)) * 3;
      const xPct = Number((15 + (slotCol / 3) * 73).toFixed(2));
      const svgX = Number((xPct * 10).toFixed(1));
      nodeCoords.set(node.id, { xPct, svgX, centerY });
    });
  });

  // Sort edges by visual layer (unreachable -> reachable -> traveled -> active) so active & climbed routes always sit cleanly on top
  const edgeRecords = [];
  for (const row of state.map) {
    for (const node of row) {
      const from = nodeCoords.get(node.id);
      if (!from) continue;
      for (const nextId of node.nextIds) {
        const to = nodeCoords.get(nextId);
        if (!to) continue;
        const edgeKey = `${node.id}->${nextId}`;
        const isActive =
          state.currentNodeId === node.id && availableIds.has(nextId);
        const isTraveled = visitedEdgeSet.has(edgeKey);
        const isReachable = reachableEdges.has(edgeKey);

        let priority = 0;
        let stateClass = 'edge-unreachable';
        if (isActive) {
          priority = 3;
          stateClass = 'edge-active';
        } else if (isTraveled) {
          priority = 2;
          stateClass = 'edge-traveled';
        } else if (isReachable) {
          priority = 1;
          stateClass = 'edge-reachable';
        }

        const y1 = Number((from.centerY - nodeHalfH).toFixed(1));
        const y2 = Number((to.centerY + nodeHalfH).toFixed(1));
        const midY = Number(((y1 + y2) / 2).toFixed(1));
        const d = `M ${from.svgX} ${y1} C ${from.svgX} ${midY}, ${to.svgX} ${midY}, ${to.svgX} ${y2}`;

        edgeRecords.push({
          priority,
          stateClass,
          isActive,
          fromId: node.id,
          toId: nextId,
          d,
        });
      }
    }
  }

  edgeRecords.sort((a, b) => a.priority - b.priority);

  const edgePathsHtml = edgeRecords
    .map((e) => {
      const glowHtml = e.isActive
        ? `<path d="${e.d}" class="map-edge-glow" vector-effect="non-scaling-stroke" />`
        : '';
      return `${glowHtml}<path d="${e.d}" class="map-edge-path ${e.stateClass}" data-from-node="${escapeHtml(e.fromId)}" data-to-node="${escapeHtml(e.toId)}" vector-effect="non-scaling-stroke" />`;
    })
    .join('');

  const pendingNeow = hasPendingNeowBlessing(state);
  const rowsHtml = state.map
    .map((row, rIdx) => {
      const nodesHtml = row
        .map((node) => {
          const metaInfo = NODE_TYPE_META[node.type] || { label: node.type, shortLabel: node.type };
          const isAvailable = availableIds.has(node.id);
          const isCurrent = state.currentNodeId === node.id;
          const isUnreachable =
            Boolean(state.currentNodeId) && !node.visited && !reachableNodes.has(node.id);
          const coord = nodeCoords.get(node.id) || { xPct: 50 };
          const cls = [
            'map-node-btn',
            `node-kind-${node.type}`,
            node.visited ? 'visited' : '',
            isCurrent ? 'current-pos' : '',
            isAvailable ? 'available' : '',
            isUnreachable ? 'unreachable' : '',
          ]
            .filter(Boolean)
            .join(' ');

          const statusNote = isCurrent
            ? '当前位置'
            : node.visited
              ? '已通过'
              : node.type === 'boss'
                ? bossName
                : isAvailable
                  ? interactive
                    ? '点击前往'
                    : '下层可选'
                  : pendingNeow && node.floor === 1
                    ? '需先选赐福'
                    : `第 ${node.floor} 层`;

          const ariaLabel = `第 ${node.floor} 层 · ${metaInfo.label}（${statusNote}）`;
          const bossTooltip =
            node.type === 'boss'
              ? `data-tooltip-title="${escapeHtml(`本幕首领：${bossName}`)}" data-tooltip-tag="第 ${TOTAL_FLOORS} 层终战" data-tooltip-desc="${escapeHtml(`抵达第 ${TOTAL_FLOORS} 层后将迎战【${bossName}】，提前针对其机制构筑牌组！`)}"`
              : '';

          return `
            <button
              type="button"
              id="${escapeHtml(idPrefix)}-${escapeHtml(node.id)}"
              class="${cls}"
              style="left: ${coord.xPct}%;"
              data-node-type="${escapeHtml(node.type)}"
              data-action="${interactive ? 'select-node' : 'inspect-map-node'}"
              data-node-id="${escapeHtml(node.id)}"
              aria-label="${escapeHtml(ariaLabel)}"
              title="${escapeHtml(ariaLabel)}"
              ${bossTooltip}
              aria-disabled="${interactive && isAvailable ? 'false' : 'true'}"
            >
              <span class="node-icon-wrap node-type-${escapeHtml(node.type)}">${getNodeIconSvg(node.type)}</span>
              ${node.visited && !isCurrent ? '<span class="node-visited-check" aria-hidden="true">✓</span>' : ''}
            </button>
          `;
        })
        .join('');

      return `
        <div class="map-row">
          <span class="map-floor-tag">F${rIdx + 1}</span>
          ${nodesHtml}
        </div>
      `;
    })
    .join('');

  return `
    <div class="map-board ${interactive ? '' : 'map-readonly'}">
      <svg class="map-edges-svg" viewBox="0 0 1000 ${totalHeight}" preserveAspectRatio="none" aria-hidden="true">${edgePathsHtml}</svg>
      ${rowsHtml}
    </div>
  `;
}

export function renderMapScreen({ state, settings, ui }) {
  const bossName = getCurrentBossName(state);
  const isAct2 = (state.act ?? 1) >= 2;
  const pendingNeow = hasPendingNeowBlessing(state);
  const showNewbieBanner =
    !state.currentNodeId && (state.act ?? 1) === 1 && !settings?.tutorialDismissed;

  let neowPanelHtml = '';
  let neowOutcomeHtml = '';
  if (pendingNeow && state.neowState) {
    const neow = state.neowState;
    const pendingAct = neow.pendingAction;
    const choicesHtml = neow.options
      .map((opt, idx) => {
        const disabled = Boolean(pendingAct && pendingAct.committed);
        return `
          <button
            type="button"
            id="neow-choice-${idx}"
            class="neow-choice-card neow-tier-${escapeHtml(opt.tier)}"
            data-action="choose-neow"
            data-option-id="${escapeHtml(opt.id)}"
            ${disabled ? 'disabled' : ''}
          >
            <span class="neow-choice-badge">${escapeHtml(opt.badge)}</span>
            <strong class="neow-choice-title">${escapeHtml(opt.title)}</strong>
            <span class="neow-choice-detail">${escapeHtml(opt.detail)}</span>
          </button>
        `;
      })
      .join('');

    neowPanelHtml = `
      <div class="neow-panel" id="neow-blessing-panel" aria-label="第 0 层鲸鱼赐福">
        <div class="neow-panel-header">
          <div class="neow-crest" aria-hidden="true">
            <svg viewBox="0 0 36 36" width="28" height="28">
              <path d="M5 22 Q11 8 24 11 Q31 13 32 19 Q26 23 19 23 Q12 23 7 26 Z" fill="hsl(198, 52%, 44%)" stroke="hsl(38, 72%, 62%)" stroke-width="1.6"/>
              <path d="M27 17 L34 12 L32 20 L34 25 L26 21 Z" fill="hsl(198, 46%, 34%)" stroke="hsl(38, 72%, 62%)" stroke-width="1.3"/>
              <circle cx="13" cy="16" r="1.7" fill="hsl(42, 92%, 72%)"/>
              <circle cx="17.5" cy="14.2" r="1.4" fill="hsl(42, 92%, 72%)"/>
              <circle cx="18.2" cy="18.4" r="1.4" fill="hsl(42, 92%, 72%)"/>
            </svg>
          </div>
          <div>
            <h3 class="neow-panel-title">第 0 层 · 涅奥的鲸鱼赐福（4 选 1）</h3>
            <p class="neow-panel-subtitle">你可以先向下浏览整张路线与第 ${escapeHtml(TOTAL_FLOORS)} 层首领【${escapeHtml(bossName)}】，选定一项开局赐福后立即解锁第 1 层起点！</p>
          </div>
          ${
            pendingAct
              ? `<button type="button" id="btn-resume-neow-pick" class="btn-brass btn-compact" data-action="open-neow-pending">继续完成赐福选牌 →</button>`
              : ''
          }
        </div>
        <div class="neow-choice-grid">${choicesHtml}</div>
      </div>
    `;
  } else if (
    !state.currentNodeId &&
    (state.act ?? 1) === 1 &&
    state.neowState?.resolved &&
    state.neowState.outcomeText
  ) {
    neowOutcomeHtml = `
      <div class="neow-outcome-banner neow-outcome-bottom" id="neow-outcome-banner" role="status" aria-live="polite">
        <div class="neow-outcome-head">
          <span class="neow-outcome-title"><span aria-hidden="true">🐋</span> <strong>鲸鱼赐福已生效</strong></span>
          <span class="neow-outcome-next-hint">↑ 点击上方 F1 发光节点出发</span>
        </div>
        <div class="neow-outcome-text">${escapeHtml(state.neowState.outcomeText)}</div>
      </div>
    `;
  }

  const dailyMods = state.dailyChallenge
    ? getDailyModifierDefs(state.dailyChallenge.modifierIds)
    : [];
  const dailyActiveBarHtml =
    dailyMods.length > 0
      ? `<div class="daily-active-strip" id="map-daily-modifiers" aria-label="每日挑战生效词条">
          <span class="daily-active-label">每日挑战 ${escapeHtml(state.dailyChallenge.dateKey)}（进阶 ${escapeHtml(state.ascension ?? 0)} · 无鲸鱼赐福）：</span>
          <div class="daily-mod-row">
            ${dailyMods
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
              .join('')}
          </div>
        </div>`
      : '';

  const act = state.act ?? 1;
  const actHeading =
    act >= 3 ? '第三幕 · 深渊圣殿攀登路线' : act >= 2 ? '第二幕 · 钢铁城邦攀登路线' : '尖塔攀登路线';
  return `
    <section class="panel-stage" aria-labelledby="map-heading">
      <div class="stage-header">
        <div>
          <h2 id="map-heading" class="stage-heading">${actHeading}</h2>
          <p class="stage-subtitle">自下而上沿连线攀登（点击或悬停任意房间可高亮其直接相连房间；点选下方图例可高亮全部同类房间）：第 1–5 层无精英稳步发育，第 9 层必遇远古宝箱，第 ${escapeHtml(TOTAL_FLOORS)} 层迎战首领【${escapeHtml(bossName)}】。</p>
        </div>
        ${
          state.restState?.lastAction
            ? `<span class="floor-indicator">上次营地：${escapeHtml(state.restState.lastAction)}</span>`
            : ''
        }
      </div>

      ${dailyActiveBarHtml}

      ${
        ui?.notice
          ? `<div class="toast-banner ${ui.noticeTone === 'warn' ? 'warn' : ''}" style="margin-bottom:12px;">${escapeHtml(ui.notice)}</div>`
          : ''
      }

      ${neowPanelHtml}

      ${
        showNewbieBanner
          ? `<div class="newbie-guide-banner" id="newbie-guide-banner">
              <div class="newbie-guide-text">
                <strong>初入尖塔提示：</strong>${
                  pendingNeow
                    ? '先完成上方 <strong>第 0 层鲸鱼赐福</strong>，再从最底部 <strong>F1</strong> 任选发光节点出发！'
                    : '直接从最底部 <strong>F1</strong> 任选发光节点出发！'
                }随时点击顶部【词典/引导】查阅力量、易伤、消耗、混乱等词条。
              </div>
              <div class="newbie-guide-actions">
                <button type="button" id="btn-open-tutorial" class="btn-brass btn-compact" data-action="open-help-tab" data-help-tab="tutorial">三步新手引导</button>
                <button type="button" id="btn-open-glossary-quick" class="btn-stone btn-compact" data-action="open-help-tab" data-help-tab="glossary">关键词词典</button>
                <button type="button" id="btn-dismiss-guide" class="btn-stone btn-compact" data-action="dismiss-tutorial" aria-label="关闭新手提示">不再提示 ×</button>
              </div>
            </div>`
          : ''
      }

      <div class="map-legend-strip" aria-hidden="true">
        <span class="map-legend-item"><i class="legend-swatch swatch-active"></i>当前可选路线</span>
        <span class="map-legend-item"><i class="legend-swatch swatch-traveled"></i>已攀登足迹</span>
        <span class="map-legend-item"><i class="legend-swatch swatch-reachable"></i>后续可达分支</span>
      </div>

      ${renderMapTypeFilterBar(state, ui?.mapTypeFilter || null)}

      ${renderMapBoardHtml(state, { interactive: true, idPrefix: 'map-node' })}

      ${neowOutcomeHtml}
    </section>
  `;
}
