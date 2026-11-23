/**
 * Run progression & outpost click action handlers: Neow blessings, map navigation,
 * treasure chests & Sapphire key, boss altar, combat rewards & Emerald key,
 * campfire actions & Ruby key, shop purchases, and mystery events.
 */

import { getCardStats } from '../../data/cards.js';
import {
  buyShopCard,
  buyShopColorlessCard,
  buyShopExclusiveRelic,
  buyShopPotion,
  buyShopPurge,
  buyShopRelic,
  cancelEventPurge,
  cancelNeowAction,
  chooseEventOption,
  chooseNeowOption,
  claimBossRelic,
  claimBossRewardCard,
  claimRewardCard,
  claimRewardEmeraldKey,
  claimRewardExtraRelic,
  claimRewardGold,
  claimRewardPotion,
  claimRewardRelic,
  claimTreasureRelic,
  claimTreasureSapphireKey,
  completeEventCardAction,
  completeEventPurge,
  completeNeowAction,
  continueFromEvent,
  digAtCampfire,
  hasPendingNeowBlessing,
  leaveRestSite,
  leaveShop,
  leaveTreasureRoom,
  liftAtCampfire,
  openTreasureChest,
  pickEventLibraryCard,
  proceedFromReward,
  proceedToNextAct,
  recallRubyKey,
  restHeal,
  restUpgradeCard,
  revealTreasureChest,
  selectMapNode,
  settleVictory,
  skipNeowCardOffer,
  tokeAtCampfire,
} from '../../engine/game.js';

function handleSettleVictory(ctx) {
  const { state, soundEngine } = ctx;
  const res = settleVictory(state);
  if (res.ok) soundEngine.play('victory');
  ctx.setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
  ctx.render();
}

export const OUTPOST_ACTIONS = {
  // === Neow Floor 0 Blessing ===
  'choose-neow'(ctx, target) {
    const { ui, state, soundEngine } = ctx;
    const prevSeq = state?._relicPickupSeq || 0;
    const prevUpgradedCount = (state?.player?.deck || []).filter((c) => c.upgraded).length;
    const res = chooseNeowOption(state, target.dataset.optionId);
    if (!res.ok) {
      ctx.setNotice(res.reason, 'warn');
    } else if (res.pendingModal === 'neow_action') {
      ui.modal = 'neow_action';
      soundEngine.play('ui_click');
      ctx.setNotice('');
    } else {
      ui.modal = null;
      if (!ctx.maybeShowRelicUpgradeReveal(prevSeq)) {
        const nextUpgradedCount = (state?.player?.deck || []).filter((c) => c.upgraded).length;
        soundEngine.play(nextUpgradedCount > prevUpgradedCount ? 'smith' : 'upgrade');
        ctx.setNotice('');
      }
    }
    ctx.render();
  },

  'open-neow-pending'(ctx) {
    const { ui, state, soundEngine } = ctx;
    if (state.neowState?.pendingAction) {
      ui.modal = 'neow_action';
      soundEngine.play('ui_click');
      ctx.render();
    }
  },

  'complete-neow-action'(ctx, target) {
    const { ui, state, soundEngine } = ctx;
    const prevUpgradedCount = (state?.player?.deck || []).filter((c) => c.upgraded).length;
    const res = completeNeowAction(state, target.dataset.instanceId);
    if (!res.ok) {
      ctx.setNotice(res.reason, 'warn');
    } else if (res.resolved) {
      ui.modal = null;
      const nextUpgradedCount = (state?.player?.deck || []).filter((c) => c.upgraded).length;
      soundEngine.play(nextUpgradedCount > prevUpgradedCount ? 'smith' : 'upgrade');
      ctx.setNotice('');
    } else {
      soundEngine.play('card_attack');
      ctx.setNotice('');
    }
    ctx.render();
  },

  'skip-neow-card'(ctx) {
    const { ui, state, soundEngine } = ctx;
    const res = skipNeowCardOffer(state);
    if (res.ok) {
      ui.modal = null;
      soundEngine.play('ui_click');
      ctx.setNotice('');
    } else {
      ctx.setNotice(res.reason, 'warn');
    }
    ctx.render();
  },

  'cancel-neow-action'(ctx) {
    const { ui, state, soundEngine } = ctx;
    const res = cancelNeowAction(state);
    if (res.ok) {
      ui.modal = null;
      soundEngine.play('ui_click');
      ctx.setNotice('');
    } else {
      ctx.setNotice(res.reason, 'warn');
    }
    ctx.render();
  },

  // === Map Navigation & Inspection ===
  'select-node'(ctx, target) {
    const { ui, state, soundEngine } = ctx;
    const nodeId = target.dataset.nodeId;
    if (target.getAttribute('aria-disabled') === 'true') {
      const isTogglingOff = ui.inspectedMapNodeId === nodeId;
      ui.inspectedMapNodeId = isTogglingOff ? null : nodeId;
      ctx.hoveredMapNodeId = null;
      soundEngine.play('ui_click');
      if (target.dataset.tooltipDesc) {
        if (isTogglingOff || ctx.isTooltipPinnedTo(target)) {
          ctx.hideTooltip();
        } else {
          ctx.showTooltip(target, { pinned: true });
        }
      } else {
        ctx.hideTooltip();
      }
      if (
        hasPendingNeowBlessing(state) &&
        state.map[0]?.some((n) => n.id === nodeId)
      ) {
        ctx.setNotice('请先在上方【第 0 层 · 涅奥的鲸鱼赐福】中 4 选 1，选定后立即解锁第 1 层起点！', 'warn');
        ctx.render();
      } else {
        ctx.syncMapHighlights();
      }
      return;
    }
    ctx.clearMapInspectState({ clearTypeFilter: true });
    const res = selectMapNode(state, nodeId);
    if (res.ok) {
      if (state.screen === 'combat') {
        const role = state.combat?.role;
        soundEngine.play(role === 'boss' || role === 'elite' ? 'boss_intro' : 'card_draw');
      } else {
        soundEngine.play('ui_click');
      }
    } else {
      soundEngine.play('error');
    }
    ctx.setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
    ctx.render();
  },

  'inspect-map-node'(ctx, target) {
    const { ui, soundEngine } = ctx;
    const nodeId = target.dataset.nodeId;
    const isTogglingOff = ui.inspectedMapNodeId === nodeId;
    ui.inspectedMapNodeId = isTogglingOff ? null : nodeId;
    ctx.hoveredMapNodeId = null;
    soundEngine.play('ui_click');
    if (target.dataset.tooltipDesc) {
      if (isTogglingOff || ctx.isTooltipPinnedTo(target)) {
        ctx.hideTooltip();
      } else {
        ctx.showTooltip(target, { pinned: true });
      }
    } else {
      ctx.hideTooltip();
    }
    ctx.syncMapHighlights();
  },

  'toggle-map-type-filter'(ctx, target) {
    const { ui, soundEngine } = ctx;
    const filterType = target.dataset.filterNodeType || null;
    ui.mapTypeFilter = ui.mapTypeFilter === filterType ? null : filterType;
    ctx.hoveredMapTypeFilter = null;
    soundEngine.play('ui_click');
    ctx.syncMapHighlights();
  },

  // === Treasure Room & Sapphire Key ===
  'open-treasure'(ctx) {
    const { state, soundEngine } = ctx;
    const prevSeq = state?._relicPickupSeq || 0;
    const needsSapphireKey = !state.keys?.sapphire && (state.act ?? 1) <= 3;
    if (needsSapphireKey) {
      revealTreasureChest(state);
      soundEngine.play('chest_open');
      ctx.setNotice('');
    } else {
      openTreasureChest(state);
      if (!ctx.maybeShowRelicUpgradeReveal(prevSeq)) {
        soundEngine.play('chest_open');
        ctx.setNotice('');
      }
    }
    ctx.render();
  },

  'claim-treasure-relic'(ctx) {
    const { state, soundEngine } = ctx;
    const prevSeq = state?._relicPickupSeq || 0;
    const res = claimTreasureRelic(state);
    if (res.ok) {
      if (!ctx.maybeShowRelicUpgradeReveal(prevSeq)) {
        soundEngine.play('upgrade');
        ctx.setNotice('');
      }
    } else {
      soundEngine.play('error');
      ctx.setNotice(res.reason, 'warn');
    }
    ctx.render();
  },

  'claim-treasure-sapphire-key'(ctx) {
    const { state, soundEngine } = ctx;
    const res = claimTreasureSapphireKey(state);
    if (res.ok) {
      soundEngine.play('upgrade');
      ctx.setNotice('💎 已取得【蓝宝石钥匙】！（已放弃本宝箱遗物）');
    } else {
      soundEngine.play('error');
      ctx.setNotice(res.reason, 'warn');
    }
    ctx.render();
  },

  'leave-treasure'(ctx) {
    const { state, soundEngine } = ctx;
    leaveTreasureRoom(state);
    soundEngine.play('ui_click');
    ctx.setNotice('');
    ctx.render();
  },

  // === Boss Rewards & Act Transition ===
  'claim-boss-card'(ctx, target) {
    const { state, soundEngine } = ctx;
    const res = claimBossRewardCard(state, target.dataset.instanceId);
    if (res.ok) soundEngine.play('card_skill');
    ctx.setNotice(res.ok ? '已将首领稀有卡牌收入牌组！' : res.reason, res.ok ? 'normal' : 'warn');
    ctx.render();
  },

  'claim-boss-relic'(ctx, target) {
    const { state, soundEngine } = ctx;
    const res = claimBossRelic(state, target.dataset.relicId);
    if (res.ok) soundEngine.play('upgrade');
    ctx.setNotice(res.ok ? '已吸收首领遗物之力！' : res.reason, res.ok ? 'normal' : 'warn');
    ctx.render();
  },

  'proceed-next-act'(ctx) {
    const { state, soundEngine } = ctx;
    const res = proceedToNextAct(state);
    if (res.ok) soundEngine.play('victory');
    ctx.setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
    ctx.render();
  },

  'settle-victory': handleSettleVictory,
  'settle-act1-victory': handleSettleVictory,

  // === Combat Rewards & Emerald Key ===
  'claim-gold'(ctx) {
    const { state, soundEngine } = ctx;
    claimRewardGold(state);
    soundEngine.play('gold');
    ctx.setNotice('');
    ctx.render();
  },

  'claim-emerald-key'(ctx) {
    const { state, soundEngine } = ctx;
    const res = claimRewardEmeraldKey(state);
    if (res.ok) {
      soundEngine.play('upgrade');
      ctx.setNotice('💚 已取得【绿宝石钥匙】！');
    } else {
      soundEngine.play('error');
      ctx.setNotice(res.reason, 'warn');
    }
    ctx.render();
  },

  'claim-relic'(ctx) {
    const { state, soundEngine } = ctx;
    const prevSeq = state?._relicPickupSeq || 0;
    claimRewardRelic(state);
    if (!ctx.maybeShowRelicUpgradeReveal(prevSeq)) {
      soundEngine.play('upgrade');
      ctx.setNotice('');
    }
    ctx.render();
  },

  'claim-extra-relic'(ctx) {
    const { state, soundEngine } = ctx;
    const prevSeq = state?._relicPickupSeq || 0;
    claimRewardExtraRelic(state);
    if (!ctx.maybeShowRelicUpgradeReveal(prevSeq)) {
      soundEngine.play('upgrade');
      ctx.setNotice('');
    }
    ctx.render();
  },

  'claim-potion'(ctx) {
    const { state, soundEngine } = ctx;
    const res = claimRewardPotion(state);
    if (res.ok) soundEngine.play('potion');
    else soundEngine.play('error');
    ctx.setNotice(res.ok ? '' : res.reason, res.ok ? 'normal' : 'warn');
    ctx.render();
  },

  'claim-card'(ctx, target) {
    const { state, soundEngine } = ctx;
    const res = claimRewardCard(state, target.dataset.instanceId);
    if (res.ok) soundEngine.play('card_draw');
    ctx.setNotice(res.ok ? '已将该卡牌加入牌组！' : res.reason, res.ok ? 'normal' : 'warn');
    ctx.render();
  },

  'proceed-reward'(ctx) {
    const { ui, state, soundEngine } = ctx;
    const res = proceedFromReward(state);
    if (res.requiresConfirm) {
      ui.modal = 'confirm_skip_reward';
      ctx.setNotice(res.reason, 'warn');
    } else {
      ui.modal = null;
      soundEngine.play('ui_click');
      ctx.setNotice('');
    }
    ctx.render();
  },

  'confirm-proceed-reward'(ctx) {
    const { ui, state, soundEngine } = ctx;
    proceedFromReward(state, { force: true });
    ui.modal = null;
    soundEngine.play('ui_click');
    ctx.setNotice('');
    ctx.render();
  },

  'claim-important-and-proceed'(ctx) {
    const { ui, state, soundEngine } = ctx;
    let upgradePickup = null;
    if (state.reward) {
      if (!state.reward.goldClaimed && state.reward.gold > 0) {
        claimRewardGold(state);
      }
      if (state.reward.emeraldKey && !state.reward.emeraldKeyClaimed) {
        claimRewardEmeraldKey(state);
      }
      if (state.reward.relicId && !state.reward.relicClaimed) {
        const seqBefore = state._relicPickupSeq || 0;
        claimRewardRelic(state);
        if ((state._relicPickupSeq || 0) > seqBefore && state.lastRelicPickup?.upgradeType) {
          upgradePickup = state.lastRelicPickup;
        }
      }
      if (state.reward.extraRelicId && !state.reward.extraRelicClaimed) {
        const seqBefore = state._relicPickupSeq || 0;
        claimRewardExtraRelic(state);
        if ((state._relicPickupSeq || 0) > seqBefore && state.lastRelicPickup?.upgradeType) {
          upgradePickup = state.lastRelicPickup;
        }
      }
    }
    proceedFromReward(state, { force: true });
    ui.modal = null;
    if (upgradePickup) {
      ctx.showRelicUpgradePickup(upgradePickup);
    } else {
      soundEngine.play('gold');
      ctx.setNotice('');
    }
    ctx.render();
  },

  // === Campfire / Rest Site & Ruby Key ===
  'rest-heal'(ctx) {
    const { state, soundEngine } = ctx;
    const res = restHeal(state);
    if (res.ok) {
      soundEngine.play('heal');
      ctx.setNotice('');
    } else {
      soundEngine.play('error');
      ctx.setNotice(res.reason, 'warn');
    }
    ctx.render();
  },

  'rest-recall'(ctx) {
    const { state, soundEngine } = ctx;
    const res = recallRubyKey(state);
    if (res.ok) {
      soundEngine.play('upgrade');
      ctx.setNotice('❤️ 已通过营地「召回」取得【红宝石钥匙】！');
    } else {
      soundEngine.play('error');
      ctx.setNotice(res.reason, 'warn');
    }
    ctx.render();
  },

  'rest-lift'(ctx) {
    const { state, soundEngine } = ctx;
    const res = liftAtCampfire(state);
    if (res.ok) {
      soundEngine.play('buff');
      ctx.setNotice(`🏋️ 完成【壶铃】举重锻炼（${res.lifts}/3）！之后每场战斗初始获得 +${res.lifts} 点力量。`);
    } else {
      soundEngine.play('error');
      ctx.setNotice(res.reason, 'warn');
    }
    ctx.render();
  },

  'rest-dig'(ctx) {
    const { state, soundEngine } = ctx;
    const res = digAtCampfire(state);
    if (res.ok) {
      soundEngine.play('dig');
      ctx.setNotice(`⛏️ 使用【铲子】挖出了遗物【${res.relicName}】，点击下方牌匾即可拾取！`);
    } else {
      soundEngine.play('error');
      ctx.setNotice(res.reason, 'warn');
    }
    ctx.render();
  },

  'confirm-rest-toke'(ctx, target) {
    const { ui, state, soundEngine } = ctx;
    const res = tokeAtCampfire(state, target.dataset.instanceId);
    if (res.ok) {
      ui.modal = null;
      soundEngine.play('exhaust');
      ctx.setNotice(
        res.lostMaxHp > 0
          ? `🪈 已使用【宁静烟斗】永久移除 1 张卡牌（触发寄生虫诅咒：最大生命 -${res.lostMaxHp}）。`
          : '🪈 已使用【宁静烟斗】永久移除 1 张卡牌！'
      );
    } else {
      soundEngine.play('error');
      ctx.setNotice(res.reason, 'warn');
    }
    ctx.render();
  },

  'confirm-smith'(ctx, target) {
    const { ui, state, soundEngine } = ctx;
    const res = restUpgradeCard(state, target.dataset.instanceId);
    if (res.ok) {
      ui.modal = null;
      soundEngine.play('smith');
      ctx.setNotice('');
    } else {
      soundEngine.play('error');
      ctx.setNotice(res.reason, 'warn');
    }
    ctx.render();
  },

  'leave-rest'(ctx) {
    const { state, soundEngine } = ctx;
    leaveRestSite(state);
    soundEngine.play('ui_click');
    ctx.render();
  },

  // === Merchant Shop ===
  'buy-shop-card'(ctx, target) {
    const { state, soundEngine } = ctx;
    const res = buyShopCard(state, Number(target.dataset.offerIndex));
    if (res.ok) soundEngine.play('gold');
    else soundEngine.play('error');
    ctx.setNotice(res.ok ? '购买成功，卡牌已加入牌组！' : res.reason, res.ok ? 'normal' : 'warn');
    ctx.render();
  },

  'buy-shop-colorless-card'(ctx, target) {
    const { state, soundEngine } = ctx;
    const res = buyShopColorlessCard(state, Number(target.dataset.offerIndex));
    if (res.ok) soundEngine.play('upgrade');
    else soundEngine.play('error');
    ctx.setNotice(
      res.ok ? '已购入商店专属无色秘牌，卡牌已加入牌组！' : res.reason,
      res.ok ? 'normal' : 'warn'
    );
    ctx.render();
  },

  'buy-shop-relic'(ctx) {
    const { state, soundEngine } = ctx;
    const prevSeq = state?._relicPickupSeq || 0;
    const res = buyShopRelic(state);
    if (res.ok) {
      if (!ctx.maybeShowRelicUpgradeReveal(prevSeq)) {
        soundEngine.play('gold');
        ctx.setNotice('已购入遗物！');
      }
    } else {
      soundEngine.play('error');
      ctx.setNotice(res.reason, 'warn');
    }
    ctx.render();
  },

  'buy-shop-exclusive-relic'(ctx) {
    const { state, soundEngine } = ctx;
    const prevSeq = state?._relicPickupSeq || 0;
    const res = buyShopExclusiveRelic(state);
    if (res.ok) {
      if (!ctx.maybeShowRelicUpgradeReveal(prevSeq)) {
        soundEngine.play('upgrade');
        const msg =
          res.relicId === 'membership_card'
            ? '已购入【会员卡】！商店内其余所有在售商品与移除服务立享 50% 折扣！'
            : '已购入商店专属遗物！';
        ctx.setNotice(msg);
      }
    } else {
      soundEngine.play('error');
      ctx.setNotice(res.reason, 'warn');
    }
    ctx.render();
  },

  'buy-shop-potion'(ctx) {
    const { state, soundEngine } = ctx;
    const res = buyShopPotion(state);
    if (res.ok) soundEngine.play('gold');
    else soundEngine.play('error');
    ctx.setNotice(res.ok ? '已购入药水！' : res.reason, res.ok ? 'normal' : 'warn');
    ctx.render();
  },

  'confirm-shop-purge'(ctx, target) {
    const { ui, state, soundEngine } = ctx;
    const res = buyShopPurge(state, target.dataset.instanceId);
    if (res.ok) {
      ui.modal = null;
      soundEngine.play('exhaust');
      ctx.setNotice(
        res.lostMaxHp > 0
          ? `已永久移除 1 张卡牌（触发寄生虫诅咒：最大生命 -${res.lostMaxHp}）。`
          : '已永久移除 1 张卡牌！'
      );
    } else {
      soundEngine.play('error');
      ctx.setNotice(res.reason, 'warn');
    }
    ctx.render();
  },

  'leave-shop'(ctx) {
    const { state, soundEngine } = ctx;
    leaveShop(state);
    soundEngine.play('ui_click');
    ctx.setNotice('');
    ctx.render();
  },

  // === Mystery Events ===
  'choose-event'(ctx, target) {
    const { state, soundEngine } = ctx;
    const prevSeq = state?._relicPickupSeq || 0;
    const prevCurseCount = (state?.player?.deck || []).filter((c) => getCardStats(c)?.type === 'curse').length;
    const prevUpgradedCount = (state?.player?.deck || []).filter((c) => c.upgraded).length;
    const prevHp = state?.player?.hp ?? 0;
    const prevGold = state?.player?.gold ?? 0;
    const res = chooseEventOption(state, target.dataset.choiceId);
    if (res.ok) {
      if (!ctx.maybeShowRelicUpgradeReveal(prevSeq)) {
        const nextCurseCount = (state?.player?.deck || []).filter((c) => getCardStats(c)?.type === 'curse').length;
        const nextUpgradedCount = (state?.player?.deck || []).filter((c) => c.upgraded).length;
        const didEventUpgrade =
          (Array.isArray(state?.eventState?.upgradedCardIds) && state.eventState.upgradedCardIds.length > 0) ||
          nextUpgradedCount > prevUpgradedCount;
        if (state.screen === 'combat') {
          const role = state.combat?.role;
          soundEngine.play(role === 'boss' || role === 'elite' ? 'boss_intro' : 'card_draw');
        } else if (didEventUpgrade) {
          soundEngine.play('smith');
        } else if (nextCurseCount > prevCurseCount) {
          soundEngine.play('curse');
        } else if ((state?.player?.hp ?? 0) > prevHp) {
          soundEngine.play('heal');
        } else if ((state?.player?.gold ?? 0) > prevGold) {
          soundEngine.play('gold');
        } else {
          soundEngine.play('ui_click');
        }
        ctx.setNotice('');
      }
    } else {
      soundEngine.play('error');
      ctx.setNotice(res.reason, 'warn');
    }
    ctx.render();
  },

  'confirm-event-purge'(ctx, target) {
    const { state, soundEngine } = ctx;
    completeEventPurge(state, target.dataset.instanceId);
    soundEngine.play('exhaust');
    ctx.setNotice('');
    ctx.render();
  },

  'confirm-event-card-action'(ctx, target) {
    const { state, soundEngine } = ctx;
    completeEventCardAction(state, target.dataset.instanceId);
    soundEngine.play('smith');
    ctx.setNotice('');
    ctx.render();
  },

  'pick-event-library-card'(ctx, target) {
    const { state, soundEngine } = ctx;
    pickEventLibraryCard(state, target.dataset.instanceId);
    soundEngine.play('card_skill');
    ctx.setNotice('');
    ctx.render();
  },

  'cancel-event-purge'(ctx) {
    const { state, soundEngine } = ctx;
    cancelEventPurge(state);
    soundEngine.play('ui_click');
    ctx.setNotice('');
    ctx.render();
  },

  'continue-event'(ctx) {
    const { state, soundEngine } = ctx;
    continueFromEvent(state);
    soundEngine.play('ui_click');
    ctx.setNotice('');
    ctx.render();
  },
};
