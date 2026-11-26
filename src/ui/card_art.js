/**
 * Facade for the inline SVG card illustration system covering all 234 cards with 100% bespoke 16:9 artwork.
 * Splits character illustrations under `src/ui/card_art/` for maintainability while keeping full API parity.
 */
import { IRONCLAD_CARD_ART } from './card_art/ironclad.js';
import { SILENT_CARD_ART } from './card_art/silent.js';
import { WATCHER_CARD_ART } from './card_art/watcher.js';
import { DEFECT_CARD_ART } from './card_art/defect.js';
import { COLORLESS_SPECIAL_CARD_ART, CARD_THEME_ART } from './card_art/colorless_special.js';

export { CARD_THEME_ART };

export const SIGNATURE_CARD_ART = Object.freeze({
  ...IRONCLAD_CARD_ART,
  ...SILENT_CARD_ART,
  ...WATCHER_CARD_ART,
  ...DEFECT_CARD_ART,
  ...COLORLESS_SPECIAL_CARD_ART,
});

export function getCardArtKey(cardId, stats = {}, activeCharId = null) {
  if (cardId && SIGNATURE_CARD_ART[cardId]) {
    return cardId;
  }
  const type = stats.type || 'attack';
  const rawChar = stats.character || 'ironclad';
  const char = rawChar === 'shared' && activeCharId ? activeCharId : rawChar;

  if (type === 'curse') return 'curse_abyss';
  if (type === 'status') {
    return cardId === 'burn' || cardId === 'wound' ? 'status_burn' : 'status_daze';
  }
  if (char === 'colorless') {
    if (type === 'attack') return 'colorless_strike';
    if (type === 'power') return 'colorless_arcane';
    return 'colorless_tactics';
  }

  if (cardId === 'defend') {
    return char === 'silent'
      ? 'silent_cloak'
      : char === 'watcher'
        ? 'watcher_calm'
        : char === 'defect'
          ? 'defect_defend'
          : 'iron_shield';
  }
  if (cardId === 'strike') {
    return char === 'silent'
      ? 'silent_shiv'
      : char === 'watcher'
        ? 'watcher_martial'
        : char === 'defect'
          ? 'defect_strike'
          : 'iron_slash';
  }

  if (char === 'defect') {
    if (type === 'power') return 'defect_power';
    if (stats.channelOrb || stats.channelOrbs || stats.evokeFront) return 'defect_orb';
    if (type === 'skill' && (stats.block ?? 0) > 0) return 'defect_defend';
    return 'defect_strike';
  }

  if (char === 'watcher') {
    if (stats.applyMarkAndTrigger || cardId === 'pressure_points') return 'watcher_mark';
    if (
      stats.enterStance === 'wrath' ||
      stats.ifInWrathVulnAllElseWrath ||
      cardId === 'rushdown' ||
      cardId === 'tantrum' ||
      cardId === 'crescendo'
    ) {
      return 'watcher_wrath';
    }
    if (stats.enterStance === 'calm' || cardId === 'like_water' || cardId === 'inner_peace' || cardId === 'tranquility') {
      return 'watcher_calm';
    }
    if (
      stats.enterStance === 'divinity' ||
      (stats.gainMantra ?? 0) > 0 ||
      (stats.applySelfStatuses?.mantra_per_turn ?? 0) > 0 ||
      cardId === 'brilliance'
    ) {
      return 'watcher_divinity';
    }
    if ((stats.scry ?? 0) > 0 || (stats.applySelfStatuses?.nirvana ?? 0) > 0 || (stats.applySelfStatuses?.foresight ?? 0) > 0) {
      return 'watcher_scry';
    }
    if (
      stats.retain ||
      (stats.applySelfStatuses?.establishment ?? 0) > 0 ||
      (stats.applySelfStatuses?.study ?? 0) > 0 ||
      cardId === 'meditate' ||
      cardId === 'sands_of_time' ||
      cardId === 'windmill_strike'
    ) {
      return 'watcher_retain';
    }
    if (type === 'power') return 'watcher_power';
    if (type === 'skill' && (stats.block ?? 0) > 0) return 'watcher_calm';
    return 'watcher_martial';
  }

  if (char === 'silent') {
    if (
      (stats.applyEnemyStatuses?.poison ?? 0) > 0 ||
      (stats.applyAllEnemiesStatuses?.poison ?? 0) > 0 ||
      (stats.applySelfStatuses?.envenom ?? 0) > 0 ||
      cardId === 'bane'
    ) {
      return 'silent_poison';
    }
    if ((stats.addShivs ?? 0) > 0 || cardId === 'shiv' || cardId === 'accuracy' || cardId === 'infinite_blades') {
      return 'silent_shiv';
    }
    if (
      (stats.discard ?? 0) > 0 ||
      (stats.discardRandomHand ?? 0) > 0 ||
      stats.discardAllHand ||
      stats.onDiscardDraw ||
      stats.onDiscardEnergy ||
      cardId === 'acrobatics'
    ) {
      return 'silent_discard';
    }
    if (type === 'power') return 'silent_power';
    if (type === 'skill') {
      return (stats.block ?? 0) > 0 ? 'silent_cloak' : 'silent_agility';
    }
    return 'silent_shiv';
  }

  // Ironclad & shared starter strike/defend
  if (cardId === 'defend') {
    return char === 'silent' ? 'silent_cloak' : char === 'watcher' ? 'watcher_calm' : 'iron_shield';
  }
  if (cardId === 'strike') {
    return char === 'silent' ? 'silent_shiv' : char === 'watcher' ? 'watcher_martial' : 'iron_slash';
  }
  if (
    (stats.selfDamage ?? 0) > 0 ||
    (stats.heal ?? 0) > 0 ||
    stats.reduceCostPerHpLossThisCombat ||
    cardId === 'bloodletting' ||
    cardId === 'hemokinesis' ||
    cardId === 'rupture' ||
    cardId === 'combust'
  ) {
    return 'iron_blood';
  }
  if (
    stats.exhaustRandomHand ||
    stats.exhaustChooseHand ||
    stats.playTopDrawAndExhaust ||
    stats.onExhaustGainEnergy ||
    (stats.applySelfStatuses?.feel_no_pain ?? 0) > 0 ||
    (stats.applySelfStatuses?.dark_embrace ?? 0) > 0 ||
    cardId === 'burning_pact' ||
    cardId === 'second_wind'
  ) {
    return 'iron_exhaust';
  }
  if ((stats.applySelfStatuses?.strength ?? 0) > 0 || cardId === 'limit_break' || cardId === 'spot_weakness' || cardId === 'flex') {
    return 'iron_flame';
  }
  if (type === 'power') return 'iron_power';
  if (type === 'skill') {
    if ((stats.block ?? 0) > 0) return 'iron_shield';
    if (stats.applyEnemyStatuses || stats.applyAllEnemiesStatuses) return 'iron_debuff';
    return 'iron_flame';
  }
  if (stats.target === 'all_enemies') return 'iron_whirlwind';
  if ((stats.cost ?? 1) >= 2 || (stats.damage ?? 0) >= 14 || stats.damageFromBlock) return 'iron_heavy';
  return 'iron_slash';
}

export function getCardArtSvg(cardId, stats = {}, activeCharId = null) {
  const key = getCardArtKey(cardId, stats, activeCharId);
  return SIGNATURE_CARD_ART[key] || CARD_THEME_ART[key] || CARD_THEME_ART.iron_slash;
}
