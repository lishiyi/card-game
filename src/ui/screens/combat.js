/**
 * Combat arena, enemy current & next-turn intent prediction badges, hand tray, and log strip.
 */

import { canUpgradeCard, getCardStats } from '../../data/cards.js';
import { predictNextTurnIntents } from '../../data/enemies.js';
import { POTION_LIBRARY, STANCE_METADATA } from '../../data/relics.js';
import {
  canPlayCard,
  getActivePendingCardChoice,
  getAliveEnemies,
  hasPendingCardChoice,
  hasRelic,
} from '../../engine/combat.js';
import { getEnemyIntentPreview } from '../../engine/math.js';
import { isCardBonusConditionMet } from '../../engine/tactics.js';
import { escapeHtml, renderCardHtml, renderStatusesHtml } from '../helpers.js';
import { getCharacterSvg, getIntentIconSvg } from '../icons.js';

export function renderCombatScreen({ state, ui, settings, getPreviewTargetEnemy }) {
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
  const isConfirmingSelfCard = Boolean(selectedCardStats && selectedCardStats.target !== 'enemy');

  const playerHpPct = Math.max(
    0,
    Math.min(100, Math.round((state.player.hp / state.player.maxHp) * 100))
  );

  const enemiesHtml = combat.enemies
    .map((enemy) => {
      const hpPct = Math.max(0, Math.min(100, Math.round((enemy.hp / enemy.maxHp) * 100)));
      const isRegrowing = enemy.hp <= 0 && (enemy.darklingRegrowTurns ?? 0) > 0;
      const intentPreview = getEnemyIntentPreview(enemy, state.player);
      const nextPred =
        enemy.hp > 0
          ? predictNextTurnIntents(enemy, state.player, state.ascension ?? 0, combat)
          : { summaryText: '', tooltipLines: [] };

      const intentClass = isRegrowing
        ? 'buff'
        : intentPreview.isAttack
          ? 'attack'
          : intentPreview.type.startsWith('defend')
            ? 'defend'
            : 'buff';
      const targetable = enemy.hp > 0 && isTargetingEnemy;

      const combinedTooltipDesc =
        enemy.hp > 0 && intentPreview.detail
          ? nextPred.tooltipLines.length > 0
            ? `${intentPreview.detail}\n────────────\n下回合可能行动：\n${nextPred.tooltipLines.join('\n')}`
            : intentPreview.detail
          : isRegrowing && enemy.intent?.summary
            ? enemy.intent.summary
            : '';

      const intentLabelText =
        enemy.hp > 0
          ? intentPreview.label
          : isRegrowing
            ? enemy.intent?.name || `复苏中 (${enemy.darklingRegrowTurns}回合)`
            : '已击败';

      const enemyAuraClasses = [
        enemy.hp > 0 && enemy.block > 0 ? 'has-block' : '',
        enemy.hp > 0 && (enemy.statuses?.poison ?? 0) > 0 ? 'is-poisoned' : '',
        enemy.hp > 0 && ((enemy.statuses?.strength ?? 0) > 0 || (enemy.statuses?.ritual ?? 0) > 0)
          ? 'is-empowered'
          : '',
      ]
        .filter(Boolean)
        .join(' ');

      return `
        <div
          id="enemy-unit-${escapeHtml(enemy.id)}"
          class="fighter-unit ${enemy.hp <= 0 ? (isRegrowing ? 'regrowing' : 'dead') : ''} ${targetable ? 'enemy-targetable' : ''} ${enemyAuraClasses}"
          data-action="${enemy.hp > 0 ? 'click-enemy' : 'noop'}"
          data-enemy-id="${escapeHtml(enemy.id)}"
          role="${targetable ? 'button' : 'group'}"
          tabindex="${targetable ? '0' : '-1'}"
          aria-label="${escapeHtml(`${enemy.name} 生命 ${enemy.hp}/${enemy.maxHp}`)}"
        >
          <div class="intent-stack">
            <div class="intent-primary-row">
              <div
                class="intent-badge ${intentClass}"
                tabindex="0"
                ${
                  combinedTooltipDesc
                    ? `data-tooltip-title="${escapeHtml(enemy.intent?.name ? `行动意图：${enemy.intent.name}` : '敌方行动意图')}" data-tooltip-tag="${escapeHtml(enemy.name)}" data-tooltip-desc="${escapeHtml(combinedTooltipDesc)}"`
                    : ''
                }
              >
                ${enemy.hp > 0 || isRegrowing ? getIntentIconSvg(isRegrowing ? 'buff' : intentPreview.type) : ''}
                <span>${escapeHtml(intentLabelText)}</span>
              </div>
              ${
                enemy.hp > 0 && nextPred.tooltipLines.length > 0
                  ? `<button
                      type="button"
                      class="next-intent-trigger"
                      aria-label="${escapeHtml(`查看 ${enemy.name} 下回合意图预测`)}"
                      data-tooltip-title="${escapeHtml(`${enemy.name} · 下回合预测`)}"
                      data-tooltip-tag="行动预判"
                      data-tooltip-desc="${escapeHtml(nextPred.tooltipLines.join('\n'))}"
                    >🔮</button>`
                  : ''
              }
            </div>
            ${
              enemy.hp > 0 && nextPred.summaryText
                ? `<div
                    class="next-intent-hint"
                    tabindex="0"
                    data-tooltip-title="${escapeHtml(`${enemy.name} · 下回合预测`)}"
                    data-tooltip-tag="行动预判"
                    data-tooltip-desc="${escapeHtml(nextPred.tooltipLines.join('\n'))}"
                  >${escapeHtml(nextPred.summaryText)}</div>`
                : ''
            }
          </div>
          <div class="unit-figure-stage">
            <div class="unit-figure">
              ${getCharacterSvg(enemy.artKey, enemy.mode)}
            </div>
            <div class="combat-preview-badges" data-preview-badges="${escapeHtml(enemy.id)}" hidden></div>
          </div>
          <div class="unit-name-row">
            <span class="unit-name-text">${escapeHtml(enemy.name)}</span>
            ${
              enemy.block > 0
                ? `<span class="block-pill" tabindex="0" data-tooltip-title="${escapeHtml(`格挡 (${enemy.block})`)}" data-tooltip-tag="${escapeHtml(enemy.name)}" data-tooltip-desc="优先抵消受到的攻击伤害，下回合开始时清零（拥有壁垒时保留）。">盾 ${escapeHtml(enemy.block)}</span>`
                : ''
            }
          </div>
          <div class="hp-track">
            <div class="hp-fill ${enemy.block > 0 ? 'shielded' : ''}" style="width: ${hpPct}%;"></div>
            <div class="hp-preview-cut" data-preview-cut="${escapeHtml(enemy.id)}" style="left: 0%; width: 0%;"></div>
            <span class="hp-label">${isRegrowing ? `复苏倒计时 ${escapeHtml(enemy.darklingRegrowTurns)}` : `${escapeHtml(enemy.hp)} / ${escapeHtml(enemy.maxHp)}`}</span>
          </div>
          ${renderStatusesHtml(enemy, enemy.name)}
        </div>
      `;
    })
    .join('');

  const pendingChoice = getActivePendingCardChoice(combat);
  const isAnyPendingChoice = hasPendingCardChoice(combat);
  const pendingMode = pendingChoice?.mode || null;
  const isHandChoiceMode =
    pendingMode === 'discard' ||
    pendingMode === 'exhaust' ||
    pendingMode === 'upgrade' ||
    pendingMode === 'retain';
  const retainSelectedSet =
    pendingMode === 'retain' ? new Set(pendingChoice.selectedIds || []) : null;
  const retainEligibleSet =
    pendingMode === 'retain'
      ? new Set((pendingChoice.candidates || []).map((c) => c.instanceId))
      : null;
  const previewTarget = getPreviewTargetEnemy();
  const handHtml = combat.hand
    .map((card, idx) => {
      if (isHandChoiceMode) {
        if (pendingMode === 'retain') {
          const eligible = retainEligibleSet.has(card.instanceId);
          const isPicked = retainSelectedSet.has(card.instanceId);
          return renderCardHtml(card, {
            idPrefix: 'hand-card',
            action: eligible ? 'toggle-retain-card' : 'noop',
            playable: eligible,
            selected: isPicked,
            dimmed: !eligible,
            disabled: !eligible,
            retainSelectable: eligible,
            retainSelected: isPicked,
            hotkey: eligible && idx < 9 ? idx + 1 : undefined,
            combatContext: {
              player: state.player,
              targetEnemy: previewTarget,
              combat,
            },
          });
        }
        if (pendingMode === 'discard') {
          const cStats = getCardStats(card);
          const isDiscardSynergy = Boolean(cStats.onDiscardGainEnergy || cStats.onDiscardDraw);
          return renderCardHtml(card, {
            idPrefix: 'hand-card',
            action: 'discard-hand-card',
            playable: true,
            selected: false,
            dimmed: false,
            discardSelectable: true,
            discardSynergy: isDiscardSynergy,
            hotkey: idx < 9 ? idx + 1 : undefined,
            combatContext: {
              player: state.player,
              targetEnemy: previewTarget,
              combat,
            },
          });
        }
        if (pendingMode === 'exhaust') {
          return renderCardHtml(card, {
            idPrefix: 'hand-card',
            action: 'resolve-card-choice',
            playable: true,
            selected: false,
            dimmed: false,
            exhaustSelectable: true,
            hotkey: idx < 9 ? idx + 1 : undefined,
            combatContext: {
              player: state.player,
              targetEnemy: previewTarget,
              combat,
            },
          });
        }
        if (pendingMode === 'upgrade') {
          const upgradable = canUpgradeCard(card);
          return renderCardHtml(card, {
            idPrefix: 'hand-card',
            action: upgradable ? 'resolve-card-choice' : 'noop',
            playable: upgradable,
            selected: false,
            dimmed: !upgradable,
            disabled: !upgradable,
            upgradeSelectable: upgradable,
            showUpgradePreview: upgradable,
            hotkey: upgradable && idx < 9 ? idx + 1 : undefined,
            combatContext: {
              player: state.player,
              targetEnemy: previewTarget,
              combat,
            },
          });
        }
      }

      const check = canPlayCard(state, card.instanceId);
      const unplayableReason = check.playable
        ? ''
        : check.reason.includes('能量')
          ? 'energy'
          : check.reason.includes('天鹅绒颈圈')
            ? 'choker'
            : 'unplayable';
      const conditionMet = check.playable && isCardBonusConditionMet(state, card);
      return renderCardHtml(card, {
        idPrefix: 'hand-card',
        action: 'click-hand-card',
        playable: check.playable,
        conditionActive: conditionMet,
        selected: ui.selectedCardId === card.instanceId,
        dimmed: !check.playable,
        unplayableReason,
        hotkey: idx < 9 ? idx + 1 : undefined,
        dealIndex: idx,
        combatContext: {
          player: state.player,
          targetEnemy: previewTarget,
          combat,
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
  const latestLogMsg = combat.logs.length > 0 ? combat.logs[combat.logs.length - 1].message : '';

  let bannerText = ui.notice;
  let bannerDesktopHint = '';
  let bannerClass = ui.noticeTone === 'warn' ? 'warn' : '';
  if (pendingMode === 'retain') {
    const pickedLen = (pendingChoice.selectedIds || []).length;
    bannerText = `【${pendingChoice.sourceName}】请选择最多 ${pendingChoice.count} 张手牌保留至下回合（已选 ${pickedLen}/${pendingChoice.count}），完成后点击「确认保留」`;
    bannerDesktopHint = '（数字键 1–9 选择，Enter 确认并结束回合）';
    bannerClass = 'retain-prompt';
  } else if (pendingMode === 'discard') {
    bannerText = `【${pendingChoice.sourceName}】请选择 ${pendingChoice.remaining} 张手牌弃置`;
    bannerDesktopHint = '（点击手牌或按数字键 1–9）';
    bannerClass = 'discard-prompt';
  } else if (pendingMode === 'exhaust') {
    bannerText = `【${pendingChoice.sourceName}】请选择 ${pendingChoice.remaining} 张手牌消耗`;
    bannerDesktopHint = '（点击手牌或按数字键 1–9）';
    bannerClass = 'exhaust-prompt';
  } else if (pendingMode === 'upgrade') {
    bannerText = `【${pendingChoice.sourceName}】请选择 ${pendingChoice.remaining} 张手牌本场战斗升级`;
    bannerDesktopHint = '（点击手牌或按数字键 1–9）';
    bannerClass = 'upgrade-prompt';
  } else if (pendingMode === 'scry') {
    bannerText = `【${pendingChoice.sourceName}】正在预见抽牌堆顶 ${pendingChoice.count} 张卡牌……`;
    bannerClass = 'scry-prompt';
  } else if (pendingMode === 'discard_to_draw') {
    bannerText = `【${pendingChoice.sourceName}】请在弹窗中从弃牌堆选择 ${pendingChoice.remaining} 张牌置于抽牌堆顶……`;
    bannerClass = 'scry-prompt';
  } else if (pendingMode === 'retrieve_discard_retain') {
    bannerText = `【${pendingChoice.sourceName}】请在弹窗中从弃牌堆选择最多 ${pendingChoice.count} 张牌取回并保留……`;
    bannerClass = 'scry-prompt';
  } else if (isTargetingEnemy) {
    const itemName = selectedCardStats
      ? selectedCardStats.name
      : POTION_LIBRARY[state.player.potions[ui.selectedPotionSlot]]?.name;
    bannerText =
      selectedCardStats && aliveEnemies.length === 1 && settings?.mobileTapConfirm
        ? `已选中【${itemName}】，再次点击该牌或点击敌人即可打出`
        : `请点击一名敌人作为【${itemName}】的目标`;
    if (!(selectedCardStats && aliveEnemies.length === 1 && settings?.mobileTapConfirm)) {
      bannerDesktopHint = '（再次点击卡牌或按 Esc 取消）';
    }
    bannerClass = 'targeting';
  } else if (isConfirmingSelfCard) {
    bannerText = `已选中【${selectedCardStats.name}】，再次点击该牌或上滑至战场即可打出（点击别处取消）`;
    bannerClass = 'targeting';
  } else if (!bannerText) {
    bannerText = `第 ${combat.turn} 回合 · ${combat.encounterName}`;
    bannerDesktopHint = '（可点击或拖拽出牌，数字键 1-9 快速出牌，E 键结束回合）';
  }

  const enemyDensity = Math.min(3, Math.max(1, combat.enemies.length));
  const playerArtKey = state.player.artKey || state.characterId || 'ironclad';
  const mobileLogExpanded = Boolean(ui.mobileLogExpanded);
  const currentStance = combat.stance || state.player.stance || 'neutral';
  const stanceMeta = STANCE_METADATA[currentStance] || STANCE_METADATA.neutral;
  const calmExitEnergy = hasRelic(state, 'violet_lotus') ? 3 : 2;
  const stancePillText =
    currentStance === 'calm'
      ? `平静 · 出态 +${calmExitEnergy}能`
      : currentStance === 'wrath' || currentStance === 'divinity'
        ? stanceMeta.shortLabel
        : '';
  const totalEnemyAttackIncoming = aliveEnemies.reduce((sum, enemy) => {
    const preview = getEnemyIntentPreview(enemy, state.player);
    return sum + (preview.isAttack ? preview.totalDamage : 0);
  }, 0);
  const wrathUnblockedDanger =
    currentStance === 'wrath' &&
    combat.status === 'ongoing' &&
    totalEnemyAttackIncoming > (state.player.block ?? 0)
      ? totalEnemyAttackIncoming - (state.player.block ?? 0)
      : 0;

  const mobileChoiceHint =
    pendingMode === 'retain'
      ? `点选保留牌 (${(pendingChoice.selectedIds || []).length}/${pendingChoice.count}) 后确认`
      : pendingMode === 'discard'
        ? '点击下方手牌弃置'
        : pendingMode === 'exhaust'
          ? '点击下方手牌消耗'
          : pendingMode === 'upgrade'
            ? '点击下方手牌升级'
            : pendingMode === 'scry'
              ? '请在弹窗完成预见'
              : pendingMode === 'discard_to_draw' || pendingMode === 'retrieve_discard_retain'
                ? '请在弹窗从弃牌堆选牌'
                : settings?.mobileTapConfirm
                  ? '点选预览 · 再点/上滑出牌'
                  : '左右滑选牌 · 上滑拖出牌';

  const handTrayChoiceClass =
    pendingMode === 'retain'
      ? 'retain-selecting'
      : pendingMode === 'discard'
        ? 'discard-selecting'
        : pendingMode === 'exhaust'
          ? 'exhaust-selecting'
          : pendingMode === 'upgrade'
            ? 'upgrade-selecting'
            : '';

  const restartsSoFar = state.stats?.combatRestarts ?? 0;

  const playerAuraClasses = [
    currentStance !== 'neutral' ? `stance-${escapeHtml(currentStance)}` : '',
    state.player.block > 0 ? 'has-block' : '',
    (state.player.statuses?.poison ?? 0) > 0 ? 'is-poisoned' : '',
    (state.player.statuses?.strength ?? 0) > 0 || (state.player.statuses?.vigor ?? 0) > 0
      ? 'is-empowered'
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  return `
    <div class="toast-banner ${bannerClass}" id="combat-banner">${escapeHtml(bannerText)}${
      bannerDesktopHint ? `<span class="desktop-only-hint">${escapeHtml(bannerDesktopHint)}</span>` : ''
    }</div>
    ${
      wrathUnblockedDanger > 0
        ? `<div class="wrath-danger-banner" id="wrath-danger-banner" role="alert">⚠ 当前处于【愤怒姿态】：敌方双倍攻击将穿透格挡造成 <strong>${escapeHtml(wrathUnblockedDanger)}</strong> 点伤害！请先切换姿态、补盾或本回合斩杀</div>`
        : ''
    }

    <section class="combat-arena" id="combat-arena" data-enemy-count="${enemyDensity}" aria-label="战斗舞台">
      <div class="synergy-callout-bar" id="synergy-callout-bar" aria-live="polite" hidden></div>
      <div class="fighters-group player-side">
        <div class="fighter-unit ${playerAuraClasses}" id="player-unit" data-stance="${escapeHtml(currentStance)}">
          <div class="intent-stack">
            <div class="intent-badge">第 ${escapeHtml(combat.turn)} 回合</div>
            ${
              currentStance !== 'neutral'
                ? `<div
                    id="player-stance-pill"
                    class="stance-pill stance-${escapeHtml(currentStance)}"
                    tabindex="0"
                    data-tooltip-title="${escapeHtml(`当前姿态：${stanceMeta.name}`)}"
                    data-tooltip-tag="观者姿态"
                    data-tooltip-desc="${escapeHtml(stanceMeta.description)}"
                    data-tooltip-tone="${currentStance === 'wrath' ? 'debuff' : 'buff'}"
                  >${escapeHtml(stancePillText)}</div>`
                : ''
            }
          </div>
          <div class="unit-figure">${getCharacterSvg(playerArtKey)}</div>
          <div class="unit-name-row">
            <span class="unit-name-text">${escapeHtml(state.player.name)}</span>
            ${
              state.player.block > 0
                ? `<span id="player-block-pill" class="block-pill" tabindex="0" data-tooltip-title="${escapeHtml(`格挡 (${state.player.block})`)}" data-tooltip-tag="自身" data-tooltip-desc="优先抵消敌方攻击伤害，下回合开始时清零。">盾 ${escapeHtml(state.player.block)}</span>`
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

      <div class="fighters-group enemy-side">
        ${enemiesHtml}
      </div>
    </section>

    <section class="combat-dock" aria-label="手牌与能量控制区">
      <div class="dock-controls">
        <div class="pile-group dock-left-group">
          ${
            combat.status === 'ongoing'
              ? `<button
                  type="button"
                  id="btn-restart-combat"
                  class="btn-stone"
                  data-action="restart-combat"
                  ${
                    state.combatSnapshot
                      ? `data-tooltip-title="重启本场战斗" data-tooltip-tag="战斗操作${restartsSoFar > 0 ? ` · 本局已重启 ${restartsSoFar} 次` : ''}" data-tooltip-desc="放弃当前回合进度，恢复到本场战斗第 1 回合初始状态。重启次数将自动记入最终战报与历史记录。"`
                      : 'disabled'
                  }
                >
                  重启本场战斗${restartsSoFar > 0 ? ` (${restartsSoFar})` : ''}
                </button>`
              : ''
          }
          <button type="button" id="btn-draw-pile" class="btn-stone" data-action="open-modal" data-modal="draw">
            抽牌堆 (${escapeHtml(combat.drawPile.length)})
          </button>
          <div class="energy-orb" id="energy-orb" aria-label="当前能量">
            ${escapeHtml(state.player.energy)}/${escapeHtml(state.player.maxEnergy)}
            <span>能量</span>
          </div>
        </div>

        <div class="pile-group dock-right-group">
          ${
            pendingMode === 'retain'
              ? `<button
                  type="button"
                  id="btn-confirm-retain"
                  class="btn-brass retain-confirm-btn"
                  data-action="confirm-retain-choice"
                >
                  确认保留 (${escapeHtml((pendingChoice.selectedIds || []).length)}/${escapeHtml(pendingChoice.count)}) 并结束回合
                </button>`
              : `<button
                  type="button"
                  id="btn-end-turn"
                  class="btn-brass"
                  data-action="end-turn"
                  ${combat.phase !== 'player' || aliveEnemies.length === 0 || isAnyPendingChoice ? 'disabled' : ''}
                >
                  结束回合<span class="hotkey-hint"> (E)</span>
                </button>`
          }
          <button type="button" id="btn-discard-pile" class="btn-stone" data-action="open-modal" data-modal="discard">
            弃牌堆 (${escapeHtml(combat.discardPile.length)})
          </button>
          <button type="button" id="btn-exhaust-pile" class="btn-stone" data-action="open-modal" data-modal="exhaust">
            消耗堆 (${escapeHtml(combat.exhaustPile.length)})
          </button>
        </div>
      </div>

      <div class="mobile-hand-bar" id="mobile-hand-bar">
        <span class="mobile-hand-meta">手牌 ${escapeHtml(combat.hand.length)} / 10</span>
        <span class="mobile-hand-hint">${mobileChoiceHint}</span>
        <button
          type="button"
          id="btn-toggle-mobile-log"
          class="mobile-log-toggle"
          data-action="toggle-mobile-log"
          aria-expanded="${mobileLogExpanded ? 'true' : 'false'}"
        >
          ${mobileLogExpanded ? '收起日志 ▲' : '战斗日志 ▼'}
        </button>
      </div>

      <div class="hand-tray ${handTrayChoiceClass}" id="hand-tray">
        ${handHtml || '<p class="stage-subtitle">当前无手牌，请点击“结束回合”。</p>'}
      </div>

      <div class="combat-log ${mobileLogExpanded ? 'mobile-expanded' : ''}" id="combat-log" aria-live="polite">
        ${recentLogs}
      </div>
      ${
        !mobileLogExpanded && latestLogMsg
          ? `<div class="mobile-log-peek" id="mobile-log-peek" data-action="toggle-mobile-log">${escapeHtml(latestLogMsg)}</div>`
          : ''
      }
    </section>
  `;
}
