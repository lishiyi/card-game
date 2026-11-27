/**
 * Persistent user preferences: Audio volume/mute, animation speed, floating numbers, and onboarding state.
 */

export const SETTINGS_STORAGE_KEY = 'sts_lite_settings_v1';

export const ANIM_SPEED_OPTIONS = Object.freeze([
  { id: 'normal', label: '标准 (1x)', scale: 1 },
  { id: 'fast', label: '快速 (2x)', scale: 0.45 },
  { id: 'off', label: '关闭动画', scale: 0 },
]);

export function createDefaultSettings() {
  return {
    soundEnabled: true,
    volume: 65,
    animSpeed: 'normal',
    showDamageNumbers: true,
    tutorialDismissed: false,
    mobileTapConfirm: false,
    showMechanicTips: true,
    seenMechanicTips: [],
  };
}

export function loadSettings(storage = globalThis?.window?.localStorage) {
  const base = createDefaultSettings();
  if (!storage) return base;
  try {
    const raw = storage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return base;
    const validSpeed = ANIM_SPEED_OPTIONS.some((o) => o.id === parsed.animSpeed)
      ? parsed.animSpeed
      : 'normal';
    const volume = Number.isFinite(parsed.volume)
      ? Math.max(0, Math.min(100, Math.round(parsed.volume)))
      : base.volume;
    const seenMechanicTips = Array.isArray(parsed.seenMechanicTips)
      ? [...new Set(parsed.seenMechanicTips.filter((id) => typeof id === 'string' && id.length > 0))]
      : [];
    return {
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : base.soundEnabled,
      volume,
      animSpeed: validSpeed,
      showDamageNumbers:
        typeof parsed.showDamageNumbers === 'boolean'
          ? parsed.showDamageNumbers
          : base.showDamageNumbers,
      tutorialDismissed: Boolean(parsed.tutorialDismissed),
      mobileTapConfirm: Boolean(parsed.mobileTapConfirm),
      showMechanicTips:
        typeof parsed.showMechanicTips === 'boolean'
          ? parsed.showMechanicTips
          : base.showMechanicTips,
      seenMechanicTips,
    };
  } catch {
    return base;
  }
}

export function saveSettings(settings, storage = globalThis?.window?.localStorage) {
  if (!storage || !settings) return;
  try {
    storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota errors
  }
}
