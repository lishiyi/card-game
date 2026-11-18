/**
 * Spire 16-Floor Climbing Route Map screen:
 * - Strictly non-crossing local-column (|Δcol| <= 1) top-to-bottom cubic Bezier S-curve paths
 * - 4-tier visual clarity (Active Gold Glow / Traveled Jade Trail / Reachable High-Contrast / Unreachable Dimmed)
 * - Hover-node connected path highlighting via data-from-node / data-to-node
 */

import { NODE_TYPE_META, TOTAL_FLOORS } from '../../data/events.js';
import { getAvailableNodeIds, getCurrentBossName } from '../../engine/game.js';
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

export function renderMapScreen({ state, settings, ui }) {
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

  // Must match .map-row height (42px) and .map-board gap (26px) with padding: 0
  const rowHeight = 42;
  const rowGap = 26;
  const nodeHalfH = 19;
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
                  ? '点击前往'
                  : `第 ${node.floor} 层`;

          const bossTooltip =
            node.type === 'boss'
              ? `data-tooltip-title="${escapeHtml(`本幕首领：${bossName}`)}" data-tooltip-tag="第 ${TOTAL_FLOORS} 层终战" data-tooltip-desc="${escapeHtml(`抵达第 ${TOTAL_FLOORS} 层后将迎战【${bossName}】，提前针对其机制构筑牌组！`)}"`
              : '';

          return `
            <button
              type="button"
              id="map-node-${escapeHtml(node.id)}"
              class="${cls}"
              style="left: ${coord.xPct}%;"
              data-node-type="${escapeHtml(node.type)}"
              data-action="select-node"
              data-node-id="${escapeHtml(node.id)}"
              ${bossTooltip}
              aria-disabled="${isAvailable ? 'false' : 'true'}"
            >
              <span class="node-icon-wrap node-type-${escapeHtml(node.type)}">${getNodeIconSvg(node.type)}</span>
              <span class="node-text">
                <span class="node-title">${escapeHtml(metaInfo.label)}</span>
                <span class="node-short-title">${escapeHtml(metaInfo.shortLabel)}</span>
                <span class="node-hint">${escapeHtml(statusNote)}</span>
              </span>
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

  const isAct2 = (state.act ?? 1) >= 2;
  const showNewbieBanner =
    !state.currentNodeId && (state.act ?? 1) === 1 && !settings?.tutorialDismissed;

  return `
    <section class="panel-stage" aria-labelledby="map-heading">
      <div class="stage-header">
        <div>
          <h2 id="map-heading" class="stage-heading">${isAct2 ? '第二幕 · 钢铁城邦攀登路线' : '尖塔攀登路线'}</h2>
          <p class="stage-subtitle">自下而上沿连线攀登（悬停任意节点可高亮其上下游路线）：第 1–5 层无精英稳步发育，第 9 层必遇远古宝箱，第 ${escapeHtml(TOTAL_FLOORS)} 层迎战首领【${escapeHtml(bossName)}】。</p>
        </div>
        ${
          state.restState?.lastAction
            ? `<span class="floor-indicator">上次营地：${escapeHtml(state.restState.lastAction)}</span>`
            : ''
        }
      </div>

      ${
        ui?.notice
          ? `<div class="toast-banner ${ui.noticeTone === 'warn' ? 'warn' : ''}" style="margin-bottom:12px;">${escapeHtml(ui.notice)}</div>`
          : ''
      }

      ${
        showNewbieBanner
          ? `<div class="newbie-guide-banner" id="newbie-guide-banner">
              <div class="newbie-guide-text">
                <strong>初入尖塔提示：</strong>从最底部 <strong>F1</strong> 任选一个发光节点出发！战斗中留意敌人的【本回合意图】与【下回合预测】，随时点击顶部【词典/引导】查阅力量、易伤、消耗等词条。
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

      <div class="map-board">
        <svg class="map-edges-svg" viewBox="0 0 1000 ${totalHeight}" preserveAspectRatio="none" aria-hidden="true">${edgePathsHtml}</svg>
        ${rowsHtml}
      </div>
    </section>
  `;
}
