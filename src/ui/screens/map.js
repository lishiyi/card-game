/**
 * Spire 16-Floor Climbing Route Map screen + non-blocking onboarding banner.
 */

import { NODE_TYPE_META, TOTAL_FLOORS } from '../../data/events.js';
import { getAvailableNodeIds, getCurrentBossName } from '../../engine/game.js';
import { escapeHtml } from '../helpers.js';
import { getNodeIconSvg } from '../icons.js';

export function renderMapScreen({ state, settings, ui }) {
  const availableIds = new Set(getAvailableNodeIds(state));
  const totalRows = state.map.length;
  const bossName = getCurrentBossName(state);

  const rowHeight = 40;
  const rowGap = 8;
  const totalHeight = totalRows * rowHeight + (totalRows - 1) * rowGap;

  const nodeCoords = new Map();
  state.map.forEach((row, rIdx) => {
    const topIdx = totalRows - 1 - rIdx;
    const yPct = (((topIdx * (rowHeight + rowGap) + rowHeight / 2) / totalHeight) * 100).toFixed(2);
    row.forEach((node, cIdx) => {
      const slotCol =
        typeof node.slotCol === 'number'
          ? node.slotCol
          : row.length === 1
            ? 1.5
            : (cIdx / Math.max(1, row.length - 1)) * 3;
      const xPct = Number((15 + (slotCol / 3) * 73).toFixed(2));
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
          const metaInfo = NODE_TYPE_META[node.type] || { label: node.type, shortLabel: node.type };
          const isAvailable = availableIds.has(node.id);
          const isCurrent = state.currentNodeId === node.id;
          const coord = nodeCoords.get(node.id) || { x: 50 };
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
              style="left: ${coord.x}%;"
              data-node-type="${escapeHtml(node.type)}"
              data-action="select-node"
              data-node-id="${escapeHtml(node.id)}"
              ${bossTooltip}
              ${isAvailable ? '' : 'disabled'}
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
          <p class="stage-subtitle">自下而上选择高亮节点前进：第 1–5 层无精英稳步发育，第 9 层必遇远古宝箱，第 ${escapeHtml(TOTAL_FLOORS)} 层迎战首领【${escapeHtml(bossName)}】。</p>
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

      <div class="map-board">
        <svg class="map-edges-svg" aria-hidden="true">${edgeLines.join('')}</svg>
        ${rowsHtml}
      </div>
    </section>
  `;
}
