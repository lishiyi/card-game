/**
 * Modal overlays:
 * - Meta / Ascension / Seeded Run / Run History (#meta-progression-modal)
 * - Settings: Audio Volume & Animation Speed (#settings-modal)
 * - Help: Keyword & Status Glossary + 3-Step Onboarding Tutorial (#help-glossary-modal)
 * - Deck / Draw / Discard / Exhaust / Smith / Shop Purge / Unclaimed Loot Alert
 */

import { CARD_LIBRARY, getCardStats } from '../../data/cards.js';
import { getCharacterDef } from '../../data/characters.js';
import { RELIC_LIBRARY } from '../../data/relics.js';
import {
  getUnclaimedImportantRewards,
  getUpgradableDeckCards,
} from '../../engine/game.js';
import {
  ASCENSION_DEFS,
  MAX_ASCENSION,
  UNLOCK_TIERS,
} from '../../engine/meta.js';
import { formatSeedCode } from '../../engine/rng.js';
import { getGlossaryEntries, TUTORIAL_STEPS } from '../glossary.js';
import { escapeHtml, renderCardHtml } from '../helpers.js';
import { ANIM_SPEED_OPTIONS } from '../settings.js';

function formatRunDate(ts) {
  if (!Number.isFinite(ts)) return '';
  try {
    const d = new Date(ts);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${mm}-${dd} ${hh}:${mi}`;
  } catch {
    return '';
  }
}

export function renderGlossaryItemsHtml(ui) {
  const entries = getGlossaryEntries();
  const cat = ui.glossaryCategory || 'all';
  const q = (ui.glossaryQuery || '').trim().toLowerCase();

  const filtered = entries.filter((item) => {
    if (cat !== 'all' && item.category !== cat) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  if (filtered.length === 0) {
    return '<p class="stage-subtitle">没有匹配的关键词或状态，请尝试其他搜索词。</p>';
  }

  return filtered
    .map((item) => {
      const toneCls =
        item.category === 'buffs'
          ? 'tone-buff'
          : item.category === 'debuffs'
            ? 'tone-debuff'
            : 'tone-mechanic';
      return `
        <article class="glossary-card ${toneCls}">
          <div class="glossary-card-head">
            <strong class="glossary-card-title">${escapeHtml(item.name)}</strong>
            <span class="glossary-card-tag">${escapeHtml(item.tag)}</span>
          </div>
          <p class="glossary-card-desc">${escapeHtml(item.description)}</p>
        </article>
      `;
    })
    .join('');
}

function renderMetaModal({ state, meta, ui }) {
  const maxTierXp = UNLOCK_TIERS[UNLOCK_TIERS.length - 1].xpRequired;
  const effectiveTier = meta.unlockAllOverride ? UNLOCK_TIERS.length : meta.unlockedTier ?? 0;
  const maxAscAllowed = meta.unlockAllOverride ? MAX_ASCENSION : meta.maxAscensionUnlocked ?? 0;
  const xpPct = meta.unlockAllOverride
    ? 100
    : Math.min(100, Math.round(((meta.xp ?? 0) / maxTierXp) * 100));
  const currentSeedCode = state ? formatSeedCode(state.seed) : '';
  const activeCharId = state?.characterId || ui.selectedCharacterId || meta.selectedCharacterId || 'ironclad';
  const activeCharDef = getCharacterDef(activeCharId);

  const ascensionButtonsHtml = ASCENSION_DEFS.map((def) => {
    const unlocked = def.level <= maxAscAllowed;
    const isSelected = (meta.selectedAscension ?? 0) === def.level;
    return `
      <button
        type="button"
        id="btn-select-ascension-${def.level}"
        class="ascension-btn ${isSelected ? 'active' : ''}"
        data-action="select-ascension"
        data-ascension="${def.level}"
        ${unlocked ? '' : 'disabled'}
      >
        <span class="choice-title">${escapeHtml(def.name)}${isSelected ? ' [已选]' : unlocked ? '' : ' [通关上一阶解锁]'}</span>
        <span class="choice-detail">${escapeHtml(def.description)}</span>
      </button>
    `;
  }).join('');

  const unlockTiersHtml = UNLOCK_TIERS.map((t) => {
    const isUnlocked = effectiveTier >= t.tier;
    const cardNames = t.cardIds.map((cid) => `【${CARD_LIBRARY[cid]?.name || cid}】`).join('、');
    const relicNames = t.relicIds.map((rid) => `【${RELIC_LIBRARY[rid]?.name || rid}】`).join('、');
    return `
      <div class="unlock-tier-card ${isUnlocked ? 'unlocked' : ''}">
        <div>
          <div style="font-weight:700;color:${isUnlocked ? 'var(--jade-upgrade)' : 'var(--text-ivory)'};">
            ${escapeHtml(t.title)} ${isUnlocked ? '（已解锁）' : `（需 ${t.xpRequired} XP）`}
          </div>
          <div style="font-size:0.81rem;color:var(--text-sand);margin-top:2px;">
            卡牌：${escapeHtml(cardNames)} · 遗物：${escapeHtml(relicNames)}
          </div>
        </div>
        <span style="font-size:0.78rem;font-family:var(--font-mono);color:${isUnlocked ? 'var(--jade-upgrade)' : 'var(--text-ash)'};">
          ${isUnlocked ? '✓ 已加入掉落池' : `${meta.xp ?? 0} / ${t.xpRequired} XP`}
        </span>
      </div>
    `;
  }).join('');

  const historyList = Array.isArray(meta.runHistory) ? meta.runHistory : [];
  const historyHtml =
    historyList.length === 0
      ? '<p class="stage-subtitle" style="margin:4px 0 0;">尚无已完成战绩记录。完成或折戟任意一局后，战绩与种子将自动保存在此。</p>'
      : `<div class="history-list" id="run-history-list">
          ${historyList
            .map((rec, idx) => {
              const isWin = rec.outcome === 'victory';
              const sCode = rec.seedCode || formatSeedCode(rec.seed);
              const dateLabel = formatRunDate(rec.timestamp);
              const recCharId = rec.characterId || 'ironclad';
              const recCharName = rec.characterName || getCharacterDef(recCharId).name;
              return `
                <div class="history-row ${isWin ? 'win' : 'loss'}" data-history-idx="${idx}">
                  <div class="history-main">
                    <span class="history-badge ${isWin ? 'win' : 'loss'}">${isWin ? '凯旋' : '折戟'}</span>
                    <span class="character-hud-pill char-${escapeHtml(recCharId)}">${escapeHtml(recCharName)}</span>
                    ${rec.isChallenge ? `<span class="history-badge challenge">挑战</span>` : ''}
                    <span class="history-floor">第 ${escapeHtml(rec.act ?? 1)} 幕 · F${escapeHtml(rec.floor ?? 1)}</span>
                    ${(rec.ascension ?? 0) > 0 ? `<span class="ascension-pill">进阶 ${escapeHtml(rec.ascension)}</span>` : ''}
                    <span class="history-meta">牌组 ${escapeHtml(rec.deckSize ?? 0)} · 遗物 ${escapeHtml(rec.relicCount ?? 0)} · 斩敌 ${escapeHtml(rec.enemiesSlain ?? 0)}</span>
                    ${dateLabel ? `<span class="history-date">${escapeHtml(dateLabel)}</span>` : ''}
                  </div>
                  <div class="history-actions">
                    <code class="seed-code-tag">${escapeHtml(sCode)}</code>
                    <button
                      type="button"
                      class="btn-stone btn-compact"
                      data-action="copy-seed"
                      data-seed-code="${escapeHtml(sCode)}"
                      data-ascension="${escapeHtml(rec.ascension ?? 0)}"
                      data-character-id="${escapeHtml(recCharId)}"
                    >复制链接</button>
                    <button
                      type="button"
                      class="btn-brass btn-compact"
                      data-action="replay-history-seed"
                      data-seed="${escapeHtml(rec.seed)}"
                      data-ascension="${escapeHtml(Math.min(maxAscAllowed, rec.ascension ?? 0))}"
                      data-character-id="${escapeHtml(recCharId)}"
                    >重玩种子</button>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>`;

  return `
    <div class="modal-backdrop" id="modal-backdrop" data-action="close-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-sheet" id="meta-progression-modal">
        <div class="modal-header">
          <div>
            <h2 id="modal-title" class="stage-heading">进阶挑战 · 种子开局 · 历史战绩</h2>
            <p class="stage-subtitle">累计攀登获取历练经验解锁高阶流派核心，输入种子或粘贴挑战链接与好友同图竞速，或回顾过往战绩。</p>
          </div>
          <button type="button" id="btn-close-modal" class="btn-stone" data-action="close-modal">关闭 (Esc)</button>
        </div>

        <div class="summary-stats" style="margin-top:0;">
          <span>总攀登场次：<strong>${escapeHtml(meta.runsPlayed ?? 0)}</strong></span>
          <span>凯旋通关：<strong>${escapeHtml(meta.victories ?? 0)}</strong></span>
          <span>最高推进总层数：<strong>${escapeHtml(meta.bestFloor ?? 0)} 层</strong></span>
          <span>累计击败敌人：<strong>${escapeHtml(meta.totalEnemiesSlain ?? 0)}</strong></span>
          <span>累计历练：<strong style="color:var(--jade-upgrade);">${escapeHtml(meta.xp ?? 0)} XP</strong></span>
        </div>

        <div class="meta-section">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
            <h3 style="margin:0;">用种子或挑战链接开局（当前角色：${escapeHtml(activeCharDef.name)}${currentSeedCode ? ` · 本局种子：${escapeHtml(currentSeedCode)}` : ''}）</h3>
            ${
              currentSeedCode
                ? `<button
                    type="button"
                    id="btn-copy-active-seed"
                    class="btn-stone btn-compact"
                    data-action="copy-seed"
                    data-seed-code="${escapeHtml(currentSeedCode)}"
                    data-ascension="${escapeHtml(state.ascension ?? 0)}"
                    data-character-id="${escapeHtml(activeCharId)}"
                  >
                    复制挑战链接
                  </button>`
                : ''
            }
          </div>
          <div class="seed-launcher-bar">
            <input
              type="text"
              id="seed-input-box"
              class="spire-input"
              placeholder="输入种子代码（如 S-16）或直接粘贴挑战链接（?seed=...&asc=...&char=...）"
              value="${escapeHtml(ui.seedInput || '')}"
              maxlength="240"
              aria-label="指定种子代码或挑战链接"
            />
            <button type="button" id="btn-start-seeded-run" class="btn-brass" data-action="start-seeded-run">
              以此种子开启【${escapeHtml(activeCharDef.name)} · 进阶 ${escapeHtml(meta.selectedAscension ?? 0)}】
            </button>
          </div>
        </div>

        <div class="meta-section">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
            <h3 style="margin:0;">选择下局【进阶难度】${state ? `（当前本局：进阶 ${escapeHtml(state.ascension ?? 0)}）` : ''}</h3>
            <button type="button" id="btn-start-ascension-run" class="btn-brass" data-action="start-ascension-run">
              以【${escapeHtml(activeCharDef.name)} · 进阶 ${escapeHtml(meta.selectedAscension ?? 0)}】开启新局
            </button>
          </div>
          <div class="ascension-grid">${ascensionButtonsHtml}</div>
        </div>

        <div class="meta-section">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
            <h3 style="margin:0;">历练觉醒解锁进度（已解锁 ${effectiveTier} / ${UNLOCK_TIERS.length} 阶）</h3>
            ${
              meta.unlockAllOverride && maxAscAllowed >= MAX_ASCENSION
                ? `<span style="font-size:0.8rem;color:var(--jade-upgrade);font-weight:700;">已开启全图鉴与全进阶</span>`
                : `<button type="button" id="btn-unlock-all-meta" class="btn-stone" data-action="toggle-unlock-all">一键解锁全部进阶与图鉴（测试用）</button>`
            }
          </div>
          <div class="xp-bar-track"><div class="xp-bar-fill" style="width: ${xpPct}%;"></div></div>
          <div class="unlock-tier-list">${unlockTiersHtml}</div>
        </div>

        <div class="meta-section">
          <h3>历史战绩编年史（最近 ${escapeHtml(historyList.length)} 场）</h3>
          ${historyHtml}
        </div>
      </div>
    </div>
  `;
}

function renderSettingsModal({ settings }) {
  const speedButtonsHtml = ANIM_SPEED_OPTIONS.map((opt) => {
    const active = settings.animSpeed === opt.id;
    return `
      <button
        type="button"
        id="btn-anim-speed-${escapeHtml(opt.id)}"
        class="btn-stone ${active ? 'btn-active-choice' : ''}"
        data-action="set-anim-speed"
        data-speed="${escapeHtml(opt.id)}"
      >
        ${escapeHtml(opt.label)}
      </button>
    `;
  }).join('');

  return `
    <div class="modal-backdrop" id="modal-backdrop" data-action="close-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-sheet modal-medium-sheet" id="settings-modal">
        <div class="modal-header">
          <div>
            <h2 id="modal-title" class="stage-heading">游戏设置</h2>
            <p class="stage-subtitle">自定义合成音效、音量大小、出牌与受击动画速度及飘字反馈（自动保存在本地）。</p>
          </div>
          <button type="button" id="btn-close-modal" class="btn-stone" data-action="close-modal">关闭 (Esc)</button>
        </div>

        <div class="settings-list">
          <div class="settings-row">
            <div>
              <div class="settings-label">战斗与界面音效</div>
              <div class="settings-desc">启用零外部依赖 Web Audio 实时合成音效（斩击、叠盾、破盾、铁砧锻造等）。</div>
            </div>
            <div style="display:flex;gap:8px;align-items:center;">
              <button
                type="button"
                id="btn-toggle-sound"
                class="${settings.soundEnabled ? 'btn-brass' : 'btn-stone'}"
                data-action="toggle-sound"
              >
                ${settings.soundEnabled ? '音效：已开启' : '音效：已静音'}
              </button>
              <button type="button" id="btn-test-sound" class="btn-stone" data-action="test-sound" ${settings.soundEnabled ? '' : 'disabled'}>
                试听
              </button>
            </div>
          </div>

          <div class="settings-row">
            <div>
              <div class="settings-label">主音量大小：<span id="settings-volume-label">${escapeHtml(settings.volume)}%</span></div>
              <div class="settings-desc">拖动滑块实时调节合成音效响度。</div>
            </div>
            <div class="settings-slider-wrap">
              <input
                type="range"
                id="input-sound-volume"
                min="0"
                max="100"
                step="5"
                value="${escapeHtml(settings.volume)}"
                aria-label="主音量百分比"
              />
            </div>
          </div>

          <div class="settings-row">
            <div>
              <div class="settings-label">动画速度</div>
              <div class="settings-desc">调节出牌飞行、受击震动、发牌与护盾击碎动画节奏。</div>
            </div>
            <div class="segmented-group">
              ${speedButtonsHtml}
            </div>
          </div>

          <div class="settings-row">
            <div>
              <div class="settings-label">伤害与格挡飘字</div>
              <div class="settings-desc">受击扣血、治疗回血、获得护盾与破盾时在角色上方弹出动态数字。</div>
            </div>
            <button
              type="button"
              id="btn-toggle-damage-numbers"
              class="${settings.showDamageNumbers ? 'btn-brass' : 'btn-stone'}"
              data-action="toggle-damage-numbers"
            >
              ${settings.showDamageNumbers ? '飘字：显示' : '飘字：隐藏'}
            </button>
          </div>

          <div class="settings-row">
            <div>
              <div class="settings-label">地图顶部新手提示条</div>
              <div class="settings-desc">恢复第 1 层出发前的新手快捷引导横幅。</div>
            </div>
            <button type="button" id="btn-reset-tutorial" class="btn-stone" data-action="reset-tutorial">
              重新开启新手提示
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderHelpModal({ ui }) {
  const activeTab = ui.helpTab || 'glossary';
  const activeCat = ui.glossaryCategory || 'all';

  let contentHtml = '';
  if (activeTab === 'tutorial') {
    const stepsHtml = TUTORIAL_STEPS.map(
      (s) => `
        <div class="tutorial-step-card">
          <span class="tutorial-step-badge">${escapeHtml(s.badge)}</span>
          <h3 class="tutorial-step-title">${escapeHtml(s.title)}</h3>
          <p class="tutorial-step-body">${escapeHtml(s.body)}</p>
        </div>
      `
    ).join('');

    contentHtml = `
      <div class="tutorial-grid">
        ${stepsHtml}
      </div>
      <div class="summary-stats" style="margin-top:16px;flex-direction:column;gap:6px;">
        <strong style="color:var(--accent-brass);">伤害与格挡速算公式（悬停敌人时手牌自动实时预览！）</strong>
        <span>• 攻击最终伤害 = 向下取整( (基础伤害 + 力量) × [自身虚弱 0.75] × [目标易伤 1.5，有纸蛙为 1.75] )</span>
        <span>• 技能最终格挡 = 向下取整( (基础格挡 + 敏捷) × [自身脆弱 0.75] )</span>
        <span>• 快捷键：战斗中按 <strong>1–9</strong> 出牌、<strong>E</strong> 结束回合、<strong>D</strong> 查看牌组、<strong>Esc</strong> 取消选中或关闭弹窗。手机端轻触遗物/状态/意图即可弹出详情！</span>
      </div>
    `;
  } else {
    const categories = [
      { id: 'all', label: '全部词条' },
      { id: 'mechanics', label: '核心机制' },
      { id: 'buffs', label: '正面状态' },
      { id: 'debuffs', label: '负面状态' },
    ];
    const catBtns = categories
      .map(
        (c) => `
          <button
            type="button"
            class="btn-stone btn-compact ${activeCat === c.id ? 'btn-active-choice' : ''}"
            data-action="set-glossary-cat"
            data-category="${escapeHtml(c.id)}"
          >${escapeHtml(c.label)}</button>
        `
      )
      .join('');

    contentHtml = `
      <div class="glossary-toolbar">
        <input
          type="search"
          id="input-glossary-search"
          class="spire-input"
          placeholder="搜索关键词（例如：力量、易伤、消耗、保留、壁垒...）"
          value="${escapeHtml(ui.glossaryQuery || '')}"
          aria-label="搜索关键词词典"
        />
        <div class="segmented-group">${catBtns}</div>
      </div>
      <div class="glossary-grid" id="glossary-results-container">
        ${renderGlossaryItemsHtml(ui)}
      </div>
    `;
  }

  return `
    <div class="modal-backdrop" id="modal-backdrop" data-action="close-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-sheet" id="help-glossary-modal">
        <div class="modal-header">
          <div>
            <h2 id="modal-title" class="stage-heading">尖塔百科 · 关键词词典与新手引导</h2>
            <p class="stage-subtitle">随时查阅所有卡牌词条、增益/减益状态结算规则与三步上手攻略。</p>
          </div>
          <button type="button" id="btn-close-modal" class="btn-stone" data-action="close-modal">关闭 (Esc)</button>
        </div>

        <div class="help-tab-bar" role="tablist">
          <button
            type="button"
            id="tab-help-glossary"
            class="btn-stone ${activeTab === 'glossary' ? 'btn-active-choice' : ''}"
            data-action="switch-help-tab"
            data-help-tab="glossary"
          >
            关键词与状态词典
          </button>
          <button
            type="button"
            id="tab-help-tutorial"
            class="btn-stone ${activeTab === 'tutorial' ? 'btn-active-choice' : ''}"
            data-action="switch-help-tab"
            data-help-tab="tutorial"
          >
            三步新手引导
          </button>
        </div>

        ${contentHtml}
      </div>
    </div>
  `;
}

export function renderModal({ state, meta, settings, ui }) {
  if (!ui.modal) return '';

  if (ui.modal === 'meta') {
    return renderMetaModal({ state, meta, ui });
  }

  if (ui.modal === 'settings') {
    return renderSettingsModal({ settings });
  }

  if (ui.modal === 'help') {
    return renderHelpModal({ ui });
  }

  if (ui.modal === 'confirm_challenge') {
    const req = ui.pendingChallenge;
    if (!req || !state) {
      ui.modal = null;
      return '';
    }
    const curSeed = formatSeedCode(state.seed);
    const curAct = state.act ?? 1;
    const curFloor = Math.max(0, state.floor ?? 0);
    const ascLabel = `进阶 ${req.ascension ?? 0}`;
    const reqCharDef = getCharacterDef(req.characterId);
    const curCharName = state.player?.name || getCharacterDef(state.characterId).name;
    return `
      <div class="modal-backdrop" id="modal-backdrop" data-action="decline-challenge" role="alertdialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="challenge-invite-desc">
        <div class="modal-sheet modal-confirm-sheet" id="challenge-invite-modal">
          <div class="modal-header">
            <div>
              <h2 id="modal-title" class="stage-heading" style="color: var(--accent-brass);">收到好友种子挑战邀请！</h2>
              <p id="challenge-invite-desc" class="stage-subtitle" style="margin-top:6px;font-size:0.92rem;color:var(--text-ivory);line-height:1.55;">
                挑战角色：<strong>${escapeHtml(reqCharDef.name)}</strong> · 目标种子：<strong style="font-family:var(--font-mono);color:var(--accent-brass);">${escapeHtml(req.seedCode)}</strong>
                · 难度：<strong>${escapeHtml(ascLabel)}</strong>（本局将临时对齐全图鉴卡池与目标进阶，不修改你的本地生涯解锁进度）。
              </p>
            </div>
          </div>
          <div class="challenge-current-save-note">
            你本地尚有一局进行中的存档（${escapeHtml(curCharName)} · 种子 <code>${escapeHtml(curSeed)}</code> · 第 ${escapeHtml(curAct)} 幕 · 第 ${escapeHtml(curFloor)} 层 · 生命 ${escapeHtml(state.player.hp)}/${escapeHtml(state.player.maxHp)}）。是否覆盖当前进度并接受挑战？
          </div>
          <div class="confirm-actions">
            <button type="button" id="btn-decline-challenge" class="btn-stone" data-action="decline-challenge">保留当前进度</button>
            <button type="button" id="btn-accept-challenge" class="btn-brass" data-action="accept-challenge">接受挑战并开新局 →</button>
          </div>
        </div>
      </div>
    `;
  }

  if (!state) return '';

  if (ui.modal === 'neow_action') {
    const action = state.neowState?.pendingAction;
    if (!action) {
      ui.modal = null;
      return '';
    }

    let cards = [];
    let showUpgradePreview = false;
    if (action.type === 'pick_card') {
      cards = action.cards || [];
    } else if (action.type === 'upgrade') {
      cards = getUpgradableDeckCards(state);
      showUpgradePreview = true;
    } else {
      cards = state.player.deck;
    }

    const cardsHtml =
      cards.length > 0
        ? cards
            .map((c) =>
              renderCardHtml(c, {
                idPrefix: 'neow-card',
                action: 'complete-neow-action',
                playable: true,
                disabled: false,
                showUpgradePreview,
              })
            )
            .join('')
        : '<p class="stage-subtitle">当前没有可选卡牌。</p>';

    const headerActions = [];
    if (action.type === 'pick_card') {
      headerActions.push(
        `<button type="button" id="btn-neow-skip-card" class="btn-stone" data-action="skip-neow-card">跳过卡牌</button>`
      );
    } else if (action.allowCancel) {
      headerActions.push(
        `<button type="button" id="btn-cancel-neow-action" class="btn-stone" data-action="cancel-neow-action">返回重选赐福 (Esc)</button>`
      );
    }

    return `
      <div class="modal-backdrop" id="modal-backdrop" data-action="${action.allowCancel ? 'cancel-neow-action' : 'noop'}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-sheet" id="neow-action-modal">
          <div class="modal-header">
            <div>
              <h2 id="modal-title" class="stage-heading">${escapeHtml(action.title)}</h2>
              ${action.subtitle ? `<p class="stage-subtitle">${escapeHtml(action.subtitle)}</p>` : ''}
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">${headerActions.join('')}</div>
          </div>
          <div class="card-showcase">${cardsHtml}</div>
        </div>
      </div>
    `;
  }

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
      return (
        sa.type.localeCompare(sb.type) ||
        String(sa.cost).localeCompare(String(sb.cost)) ||
        sa.cardId.localeCompare(sb.cardId)
      );
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
    subtitle = '底部预览中以绿色突出“升级后”及发生变化的数值与效果。点击卡牌即可完成锻造。';
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
