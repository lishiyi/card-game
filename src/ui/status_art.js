/**
 * Complete bespoke inline SVG icon library for all 97 combat statuses (buffs & debuffs)
 * in STATUS_METADATA, plus dedicated negative-polarity artwork for Strength and Dexterity.
 * Polarity is baked directly into each icon's own badge frame and backdrop so combat status
 * chips require no bulky outer pill frame:
 *   - Buffs:   smooth rounded-square emerald badge + deep jade backdrop
 *   - Debuffs: sharp beveled octagonal crimson badge + deep crimson backdrop
 */

const DEFAULT_DEBUFF_KEYS = new Set([
  'vulnerable',
  'weak',
  'frail',
  'poison',
  'corpseExplosion',
  'wraithForm',
  'tempStrengthDown',
  'noDraw',
  'confused',
  'stunned',
  'slow',
  'mark',
  'talkToTheHand',
  'blasphemer',
  'tempDexterityDown',
  'energyDownEachTurn',
  'choke',
  'hex',
  'constricted',
  'strength_down',
  'dexterity_down',
  'fallback_debuff',
]);

const POLARITY_FRAME_PALETTE = Object.freeze({
  buff: Object.freeze({
    bg1: 'hsl(152, 54%, 23%)',
    bg2: 'hsl(166, 62%, 8%)',
    rim: 'hsl(148, 84%, 56%)',
    innerGlow: 'hsla(148, 96%, 78%, 0.30)',
  }),
  debuff: Object.freeze({
    bg1: 'hsl(354, 62%, 24%)',
    bg2: 'hsl(344, 68%, 8%)',
    rim: 'hsl(4, 92%, 60%)',
    innerGlow: 'hsla(8, 100%, 76%, 0.28)',
  }),
});

const STATUS_INNER_ART = new Map();

function buildStatusSvg(key, inner, polarity = 'buff') {
  const pol = polarity === 'debuff' ? 'debuff' : 'buff';
  const pal = POLARITY_FRAME_PALETTE[pol];
  const frameShape =
    pol === 'debuff'
      ? `<polygon points="4.8,0.9 19.2,0.9 23.1,4.8 23.1,19.2 19.2,23.1 4.8,23.1 0.9,19.2 0.9,4.8" fill="url(#st-${key}-bg)" stroke="${pal.rim}" stroke-width="1.85" stroke-linejoin="round"/><polygon points="5.3,2.2 18.7,2.2 21.8,5.3 21.8,18.7 18.7,21.8 5.3,21.8 2.2,18.7 2.2,5.3" fill="none" stroke="${pal.innerGlow}" stroke-width="0.65"/>`
      : `<rect x="0.9" y="0.9" width="22.2" height="22.2" rx="5.8" fill="url(#st-${key}-bg)" stroke="${pal.rim}" stroke-width="1.85"/><rect x="2.2" y="2.2" width="19.6" height="19.6" rx="4.6" fill="none" stroke="${pal.innerGlow}" stroke-width="0.65"/>`;
  return `<svg viewBox="0 0 24 24" class="status-svg" data-status-svg="${key}" data-status-polarity="${pol}" aria-hidden="true"><defs><radialGradient id="st-${key}-bg" cx="34%" cy="28%" r="74%"><stop offset="0%" stop-color="${pal.bg1}"/><stop offset="100%" stop-color="${pal.bg2}"/></radialGradient></defs>${frameShape}<g transform="translate(12 12) scale(1.12) translate(-12 -12)">${inner}</g></svg>`;
}

function wrapStatusSvg(key, _bg1, _bg2, _rim, inner) {
  STATUS_INNER_ART.set(key, inner);
  const defaultPolarity = DEFAULT_DEBUFF_KEYS.has(key) ? 'debuff' : 'buff';
  return buildStatusSvg(key, inner, defaultPolarity);
}

function scopeStatusSvgIds(svg, suffix) {
  if (!svg || !suffix) return svg;
  const safe = String(suffix).replace(/[^a-zA-Z0-9_-]/g, '_');
  return svg
    .replace(/\bid="([^"]+)"/g, (_, id) => `id="${id}-${safe}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${id}-${safe})`);
}

export const STATUS_SVG_ART = Object.freeze({
  // === CORE STATS & BASIC DEBUFFS ===
  strength: wrapStatusSvg(
    'strength',
    'hsl(12, 62%, 26%)',
    'hsl(354, 58%, 11%)',
    'hsl(22, 92%, 58%)',
    `<path d="M6.5 17.5 C6.5 13 8.5 10.5 11.5 10.5 C13.2 10.5 14 11.4 14.4 12.2 L16.2 9.4 C17.1 8 18.8 8.6 18.4 10.4 L17.3 14.8 C16.8 16.8 15 18 12.6 18 H7.6 C6.9 18 6.5 17.8 6.5 17.5 Z" fill="hsl(18, 92%, 58%)" stroke="hsl(44, 100%, 78%)" stroke-width="1.1" stroke-linejoin="round"/>
     <path d="M12.2 5 L14.4 7.5 H13 V9.6 H11.4 V7.5 H10 Z" fill="hsl(46, 100%, 76%)"/>`
  ),
  dexterity: wrapStatusSvg(
    'dexterity',
    'hsl(156, 56%, 22%)',
    'hsl(180, 56%, 10%)',
    'hsl(148, 86%, 58%)',
    `<path d="M6 16.8 Q11 16.2 14.5 11.5 Q16.5 8.8 18.5 7.2 Q18 11.5 15.2 14.8 Q18.5 13.8 19.2 16.2 Q14.5 18.6 6 17.8 Z" fill="hsl(150, 86%, 54%)" stroke="hsl(142, 100%, 84%)" stroke-width="1.05" stroke-linejoin="round"/>
     <path d="M5.5 11.5 H10.5 M7 8.5 H11.5" stroke="hsl(168, 96%, 76%)" stroke-width="1.35" stroke-linecap="round"/>`
  ),
  vulnerable: wrapStatusSvg(
    'vulnerable',
    'hsl(354, 62%, 24%)',
    'hsl(344, 58%, 10%)',
    'hsl(6, 94%, 62%)',
    `<path d="M12 4.4 L18.4 6.8 V12.3 C18.4 16 15.5 18.6 12 19.8 C8.5 18.6 5.6 16 5.6 12.3 V6.8 Z" fill="hsl(354, 72%, 44%)" stroke="hsl(18, 96%, 72%)" stroke-width="1.15" stroke-linejoin="round"/>
     <path d="M12.6 5 L10.6 10.6 L13.8 12.4 L10.8 18.8" fill="none" stroke="hsl(48, 100%, 86%)" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/>`
  ),
  weak: wrapStatusSvg(
    'weak',
    'hsl(24, 58%, 22%)',
    'hsl(354, 54%, 10%)',
    'hsl(28, 92%, 62%)',
    `<path d="M7 6.5 L13.5 12.5 L11.5 14.5 L16.8 18.2" fill="none" stroke="hsl(34, 92%, 68%)" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M15.8 6.2 L17.8 8.2 M17.8 6.2 L15.8 8.2" stroke="hsl(354, 92%, 64%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M6 16.5 L10.5 16.5 L8.25 19.5 Z" fill="hsl(354, 92%, 62%)"/>`
  ),
  frail: wrapStatusSvg(
    'frail',
    'hsl(286, 54%, 22%)',
    'hsl(338, 52%, 10%)',
    'hsl(308, 86%, 68%)',
    `<path d="M12 4.8 L17.8 7.2 V11.5 L12 18.8 L6.2 11.5 V7.2 Z" fill="none" stroke="hsl(308, 84%, 72%)" stroke-width="1.35" stroke-dasharray="3.2 1.8"/>
     <polygon points="7.5,8 11.5,11 8.5,13.5" fill="hsl(324, 82%, 62%)"/><polygon points="16.5,8.5 13,12 16,15" fill="hsl(286, 80%, 66%)"/>
     <polygon points="11.5,15 13.5,17.2 10.5,18.8" fill="hsl(354, 88%, 64%)"/>`
  ),
  poison: wrapStatusSvg(
    'poison',
    'hsl(118, 56%, 20%)',
    'hsl(140, 56%, 9%)',
    'hsl(112, 92%, 56%)',
    `<path d="M12 4.6 Q17 10.6 16.6 14.4 A4.6 4.6 0 1 1 7.4 14.4 Q7 10.6 12 4.6 Z" fill="hsl(114, 90%, 48%)" stroke="hsl(96, 100%, 78%)" stroke-width="1.15"/>
     <circle cx="10.2" cy="14" r="1.1" fill="hsl(136, 62%, 14%)"/><circle cx="13.8" cy="14" r="1.1" fill="hsl(136, 62%, 14%)"/>
     <path d="M10.4 16.8 H13.6" stroke="hsl(136, 62%, 14%)" stroke-width="1.1" stroke-linecap="round"/>`
  ),
  corpseExplosion: wrapStatusSvg(
    'corpseExplosion',
    'hsl(104, 54%, 20%)',
    'hsl(14, 58%, 10%)',
    'hsl(76, 94%, 60%)',
    `<path d="M12 4 V6.2 M12 17.8 V20 M4 12 H6.2 M17.8 12 H20 M6.2 6.2 L7.8 7.8 M16.2 16.2 L17.8 17.8 M17.8 6.2 L16.2 7.8 M6.2 17.8 L7.8 16.2" stroke="hsl(34, 100%, 64%)" stroke-width="1.45" stroke-linecap="round"/>
     <circle cx="12" cy="12" r="4.5" fill="hsl(108, 86%, 50%)" stroke="hsl(48, 100%, 82%)" stroke-width="1"/>
     <circle cx="10.6" cy="11.5" r="0.95" fill="hsl(24, 52%, 10%)"/><circle cx="13.4" cy="11.5" r="0.95" fill="hsl(24, 52%, 10%)"/>`
  ),

  // === SILENT POWERS & TRIGGERS ===
  noxiousFumes: wrapStatusSvg(
    'noxiousFumes',
    'hsl(122, 52%, 20%)',
    'hsl(152, 54%, 9%)',
    'hsl(118, 86%, 58%)',
    `<circle cx="9.2" cy="14.5" r="3.4" fill="hsl(116, 74%, 44%)" opacity="0.88"/>
     <circle cx="14.8" cy="14.5" r="3.4" fill="hsl(124, 78%, 42%)" opacity="0.88"/>
     <circle cx="12" cy="11.2" r="4" fill="hsl(112, 88%, 54%)" stroke="hsl(96, 100%, 80%)" stroke-width="1"/>
     <path d="M8.5 7.2 Q10 5.5 11.5 6.8 M14.2 6.8 Q15.8 5.2 17 6.8" fill="none" stroke="hsl(106, 98%, 76%)" stroke-width="1.2" stroke-linecap="round"/>`
  ),
  accuracy: wrapStatusSvg(
    'accuracy',
    'hsl(158, 52%, 20%)',
    'hsl(190, 52%, 9%)',
    'hsl(152, 90%, 62%)',
    `<circle cx="12" cy="12" r="6.4" fill="none" stroke="hsl(152, 88%, 62%)" stroke-width="1.35"/>
     <path d="M12 4.2 V7.8 M12 16.2 V19.8 M4.2 12 H7.8 M16.2 12 H19.8" stroke="hsl(152, 92%, 72%)" stroke-width="1.35" stroke-linecap="round"/>
     <circle cx="12" cy="12" r="2.2" fill="hsl(46, 100%, 70%)"/>`
  ),
  infiniteBlades: wrapStatusSvg(
    'infiniteBlades',
    'hsl(166, 52%, 20%)',
    'hsl(204, 52%, 10%)',
    'hsl(156, 88%, 64%)',
    `<polygon points="12,4.5 13.8,14 12,16.5 10.2,14" fill="hsl(186, 40%, 92%)" stroke="hsl(156, 86%, 56%)" stroke-width="0.9"/>
     <polygon points="6.2,7.5 10.2,15 8.2,16.8 5.5,12" fill="hsl(168, 60%, 78%)" stroke="hsl(156, 80%, 50%)" stroke-width="0.8"/>
     <polygon points="17.8,7.5 18.5,12 15.8,16.8 13.8,15" fill="hsl(168, 60%, 78%)" stroke="hsl(156, 80%, 50%)" stroke-width="0.8"/>
     <line x1="12" y1="16.5" x2="12" y2="19.6" stroke="hsl(44, 92%, 66%)" stroke-width="1.7" stroke-linecap="round"/>`
  ),
  envenom: wrapStatusSvg(
    'envenom',
    'hsl(126, 54%, 20%)',
    'hsl(164, 52%, 9%)',
    'hsl(114, 92%, 58%)',
    `<polygon points="17.8,5.8 10.6,15 8.6,13 15.8,4.6" fill="hsl(190, 32%, 90%)" stroke="hsl(156, 54%, 34%)" stroke-width="0.9"/>
     <line x1="6.4" y1="17.2" x2="9.6" y2="14" stroke="hsl(42, 82%, 56%)" stroke-width="1.9" stroke-linecap="round"/>
     <path d="M16.5 12.2 Q18.4 15.2 18.2 16.8 A1.8 1.8 0 1 1 14.8 16.8 Q14.6 15.2 16.5 12.2 Z" fill="hsl(112, 96%, 54%)"/>`
  ),
  afterImage: wrapStatusSvg(
    'afterImage',
    'hsl(178, 52%, 22%)',
    'hsl(210, 52%, 10%)',
    'hsl(172, 92%, 66%)',
    `<path d="M8.5 7.5 L12.5 9 V14.5 L8.5 17.5 L5.5 14.5 V9 Z" fill="hsla(176, 86%, 62%, 0.42)" stroke="hsl(176, 92%, 72%)" stroke-width="1"/>
     <path d="M14.5 6.2 L18.8 8.2 V14.2 L14.5 18.4 L10.2 14.2 V8.2 Z" fill="hsl(174, 82%, 52%)" stroke="hsl(180, 100%, 88%)" stroke-width="1.15"/>`
  ),
  thousandCuts: wrapStatusSvg(
    'thousandCuts',
    'hsl(156, 54%, 20%)',
    'hsl(352, 48%, 10%)',
    'hsl(148, 92%, 62%)',
    `<path d="M5.5 16.5 Q12 10 18.5 6.2" fill="none" stroke="hsl(148, 96%, 68%)" stroke-width="1.7" stroke-linecap="round"/>
     <path d="M6.2 7.2 Q12.2 12 18.2 17.5" fill="none" stroke="hsl(44, 100%, 74%)" stroke-width="1.7" stroke-linecap="round"/>
     <path d="M5.2 11.8 Q12 11.2 18.8 12.5" fill="none" stroke="hsl(176, 100%, 82%)" stroke-width="1.4" stroke-linecap="round"/>`
  ),
  intangible: wrapStatusSvg(
    'intangible',
    'hsl(198, 46%, 26%)',
    'hsl(224, 48%, 11%)',
    'hsl(196, 94%, 82%)',
    `<path d="M12 5 C8.8 5 7 7.4 7 10.6 V18.2 L9.5 16.6 L12 18.4 L14.5 16.6 L17 18.2 V10.6 C17 7.4 15.2 5 12 5 Z" fill="hsla(198, 90%, 88%, 0.85)" stroke="hsl(196, 100%, 96%)" stroke-width="1.05" stroke-linejoin="round"/>
     <circle cx="10.2" cy="10.4" r="1.1" fill="hsl(224, 52%, 22%)"/><circle cx="13.8" cy="10.4" r="1.1" fill="hsl(224, 52%, 22%)"/>`
  ),
  wraithForm: wrapStatusSvg(
    'wraithForm',
    'hsl(274, 52%, 22%)',
    'hsl(248, 54%, 10%)',
    'hsl(288, 86%, 68%)',
    `<path d="M12 4.8 C8.6 4.8 6.8 7.5 7 11.2 L8.8 16.2 H15.2 L17 11.2 C17.2 7.5 15.4 4.8 12 4.8 Z" fill="hsl(274, 62%, 34%)" stroke="hsl(292, 88%, 74%)" stroke-width="1.1"/>
     <circle cx="10.2" cy="10.5" r="1.05" fill="hsl(148, 96%, 66%)"/><circle cx="13.8" cy="10.5" r="1.05" fill="hsl(148, 96%, 66%)"/>
     <path d="M9.5 17.2 L12 19.8 L14.5 17.2 Z" fill="hsl(354, 92%, 62%)"/>`
  ),
  toolsOfTheTrade: wrapStatusSvg(
    'toolsOfTheTrade',
    'hsl(160, 48%, 20%)',
    'hsl(28, 44%, 10%)',
    'hsl(44, 92%, 68%)',
    `<rect x="6" y="6.2" width="7.4" height="10.4" rx="1.4" fill="hsl(158, 56%, 36%)" stroke="hsl(44, 92%, 72%)" stroke-width="1.1"/>
     <path d="M11.5 16.5 L18 7.5" stroke="hsl(192, 42%, 90%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="17.8" cy="7.5" r="1.4" fill="hsl(148, 92%, 60%)"/>`
  ),
  wellLaidPlans: wrapStatusSvg(
    'wellLaidPlans',
    'hsl(164, 48%, 20%)',
    'hsl(204, 48%, 10%)',
    'hsl(156, 86%, 64%)',
    `<rect x="6.2" y="5.5" width="11.6" height="13" rx="2" fill="hsl(40, 48%, 78%)" stroke="hsl(156, 78%, 54%)" stroke-width="1.15"/>
     <path d="M8.8 12.2 L11.1 14.5 L15.6 9.5" fill="none" stroke="hsl(156, 82%, 30%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
  ),

  // === IRONCLAD POWERS & TRIGGERS ===
  metallicize: wrapStatusSvg(
    'metallicize',
    'hsl(210, 32%, 26%)',
    'hsl(220, 36%, 11%)',
    'hsl(204, 72%, 74%)',
    `<polygon points="12,4.6 18.2,8.2 18.2,15.8 12,19.4 5.8,15.8 5.8,8.2" fill="hsl(212, 26%, 62%)" stroke="hsl(204, 76%, 84%)" stroke-width="1.15"/>
     <polygon points="12,7.2 15.8,9.5 15.8,14.5 12,16.8 8.2,14.5 8.2,9.5" fill="hsl(212, 34%, 78%)" opacity="0.65"/>
     <line x1="9" y1="9" x2="15" y2="15" stroke="hsl(0, 0%, 100%)" stroke-width="1.1" opacity="0.7"/>`
  ),
  demonForm: wrapStatusSvg(
    'demonForm',
    'hsl(4, 66%, 24%)',
    'hsl(348, 62%, 10%)',
    'hsl(14, 96%, 60%)',
    `<path d="M6.5 6.2 Q7.5 10 9.5 10.4 L12 8.8 L14.5 10.4 Q16.5 10 17.5 6.2 Q18.8 10.5 16.5 13.5 C16.2 16.5 14.4 18.8 12 19.2 C9.6 18.8 7.8 16.5 7.5 13.5 Q5.2 10.5 6.5 6.2 Z" fill="hsl(4, 84%, 44%)" stroke="hsl(36, 98%, 68%)" stroke-width="1.05" stroke-linejoin="round"/>
     <polygon points="9.2,12.8 11.2,13.6 9.5,14.6" fill="hsl(48, 100%, 76%)"/><polygon points="14.8,12.8 12.8,13.6 14.5,14.6" fill="hsl(48, 100%, 76%)"/>`
  ),
  feelNoPain: wrapStatusSvg(
    'feelNoPain',
    'hsl(206, 52%, 22%)',
    'hsl(352, 48%, 10%)',
    'hsl(198, 88%, 68%)',
    `<path d="M12 5 L17.6 7.4 V12.2 C17.6 15.6 15.1 18.1 12 19.2 C8.9 18.1 6.4 15.6 6.4 12.2 V7.4 Z" fill="hsl(204, 72%, 44%)" stroke="hsl(196, 94%, 78%)" stroke-width="1.15"/>
     <path d="M12 8.2 Q14.4 11 14 13.5 A2 2 0 1 1 10 13.5 Q9.6 11 12 8.2 Z" fill="hsl(34, 100%, 66%)"/>`
  ),
  darkEmbrace: wrapStatusSvg(
    'darkEmbrace',
    'hsl(278, 56%, 22%)',
    'hsl(252, 58%, 9%)',
    'hsl(286, 88%, 70%)',
    `<rect x="8.6" y="6.2" width="6.8" height="10" rx="1.2" fill="hsl(282, 76%, 56%)" stroke="hsl(46, 100%, 78%)" stroke-width="1"/>
     <path d="M5.5 14 Q7 9 9.5 9.5 M18.5 14 Q17 9 14.5 9.5 M6.5 17.5 Q12 19.5 17.5 17.5" fill="none" stroke="hsl(288, 92%, 74%)" stroke-width="1.5" stroke-linecap="round"/>`
  ),
  barricade: wrapStatusSvg(
    'barricade',
    'hsl(208, 48%, 22%)',
    'hsl(220, 48%, 10%)',
    'hsl(198, 88%, 68%)',
    `<path d="M5.5 18.2 V8.5 H8 V10.8 H10.5 V8.5 H13.5 V10.8 H16 V8.5 H18.5 V18.2 Z" fill="hsl(206, 56%, 52%)" stroke="hsl(196, 96%, 82%)" stroke-width="1.1" stroke-linejoin="round"/>
     <line x1="6.2" y1="14.2" x2="17.8" y2="14.2" stroke="hsl(212, 48%, 24%)" stroke-width="1.1"/>`
  ),
  corruption: wrapStatusSvg(
    'corruption',
    'hsl(282, 58%, 22%)',
    'hsl(262, 60%, 9%)',
    'hsl(296, 90%, 68%)',
    `<path d="M12 4.4 Q17.6 9.5 16.8 14.8 A4.9 4.9 0 1 1 7.2 14.8 Q6.4 9.5 12 4.4 Z" fill="hsl(286, 84%, 48%)" stroke="hsl(304, 96%, 78%)" stroke-width="1.1"/>
     <path d="M12 9.4 Q14.6 12.6 14 15.2 A2.1 2.1 0 1 1 10 15.2 Q9.4 12.6 12 9.4 Z" fill="hsl(258, 54%, 14%)"/>`
  ),
  flameBarrier: wrapStatusSvg(
    'flameBarrier',
    'hsl(18, 64%, 24%)',
    'hsl(352, 58%, 10%)',
    'hsl(32, 98%, 62%)',
    `<circle cx="12" cy="12" r="6.8" fill="none" stroke="hsl(24, 98%, 58%)" stroke-width="2" stroke-dasharray="4 1.8"/>
     <path d="M12 6.8 Q15.4 10.6 14.8 14 A2.9 2.9 0 1 1 9.2 14 Q8.6 10.6 12 6.8 Z" fill="hsl(44, 100%, 66%)" stroke="hsl(10, 96%, 54%)" stroke-width="1"/>`
  ),
  sadisticNature: wrapStatusSvg(
    'sadisticNature',
    'hsl(338, 58%, 22%)',
    'hsl(276, 56%, 10%)',
    'hsl(344, 92%, 64%)',
    `<path d="M5.8 10.2 Q12 18.8 18.2 10.2 Q12 13.6 5.8 10.2 Z" fill="hsl(352, 92%, 58%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.05" stroke-linejoin="round"/>
     <path d="M9 11.6 L9.8 13.8 M12 12.2 L12 14.8 M15 11.6 L14.2 13.8" stroke="hsl(0, 0%, 100%)" stroke-width="1.15" stroke-linecap="round"/>
     <path d="M7.5 7.5 L10 9 M16.5 7.5 L14 9" stroke="hsl(46, 100%, 74%)" stroke-width="1.4" stroke-linecap="round"/>`
  ),
  evolve: wrapStatusSvg(
    'evolve',
    'hsl(16, 58%, 22%)',
    'hsl(270, 50%, 10%)',
    'hsl(36, 96%, 66%)',
    `<path d="M7.5 17.5 C7.5 13 16.5 11 16.5 6.5 M16.5 17.5 C16.5 13 7.5 11 7.5 6.5" fill="none" stroke="hsl(38, 98%, 66%)" stroke-width="1.75" stroke-linecap="round"/>
     <line x1="9" y1="8.5" x2="15" y2="8.5" stroke="hsl(14, 92%, 62%)" stroke-width="1.2"/><line x1="9" y1="15.5" x2="15" y2="15.5" stroke="hsl(14, 92%, 62%)" stroke-width="1.2"/>`
  ),
  fireBreathing: wrapStatusSvg(
    'fireBreathing',
    'hsl(14, 66%, 24%)',
    'hsl(354, 60%, 10%)',
    'hsl(26, 98%, 62%)',
    `<path d="M5.5 14.5 Q9.5 12 11.5 10.5 Q14.5 7.2 18.8 7.5 Q16.5 11.5 18.5 14 Q14.5 16.5 10.5 15.8 Q7.8 17.2 5.5 14.5 Z" fill="hsl(22, 98%, 54%)" stroke="hsl(48, 100%, 76%)" stroke-width="1.05" stroke-linejoin="round"/>
     <path d="M11.5 12.6 Q14.2 10.8 16.2 11.4 Q14.4 13.6 11.5 12.6 Z" fill="hsl(50, 100%, 84%)"/>`
  ),
  rupture: wrapStatusSvg(
    'rupture',
    'hsl(354, 64%, 22%)',
    'hsl(342, 60%, 9%)',
    'hsl(4, 94%, 62%)',
    `<path d="M12 5 Q16.8 10.8 16.2 14.6 A4.3 4.3 0 1 1 7.8 14.6 Q7.2 10.8 12 5 Z" fill="hsl(354, 88%, 48%)" stroke="hsl(24, 98%, 70%)" stroke-width="1.1"/>
     <path d="M12.6 8.2 L10.2 13 H12.4 L11.4 17.2 L14.4 12 H12.1 Z" fill="hsl(48, 100%, 76%)"/>`
  ),
  juggernaut: wrapStatusSvg(
    'juggernaut',
    'hsl(206, 48%, 22%)',
    'hsl(14, 52%, 10%)',
    'hsl(36, 94%, 66%)',
    `<path d="M12 5 L18 7.5 V12.5 L12 18.8 L6 12.5 V7.5 Z" fill="hsl(208, 42%, 44%)" stroke="hsl(40, 96%, 68%)" stroke-width="1.2"/>
     <polygon points="12,8 14.5,12 12,15.5 9.5,12" fill="hsl(18, 96%, 58%)"/><path d="M5 10.5 L3.2 10.5 M20.8 10.5 L19 10.5" stroke="hsl(46, 100%, 74%)" stroke-width="1.5" stroke-linecap="round"/>`
  ),
  rage: wrapStatusSvg(
    'rage',
    'hsl(8, 64%, 24%)',
    'hsl(206, 46%, 10%)',
    'hsl(18, 96%, 62%)',
    `<polygon points="12,4.4 14,9.2 19.2,9.2 15,12.5 16.6,17.8 12,14.6 7.4,17.8 9,12.5 4.8,9.2 10,9.2" fill="hsl(14, 94%, 54%)" stroke="hsl(48, 100%, 78%)" stroke-width="1" stroke-linejoin="round"/>`
  ),
  combust: wrapStatusSvg(
    'combust',
    'hsl(10, 64%, 24%)',
    'hsl(350, 58%, 10%)',
    'hsl(28, 98%, 62%)',
    `<circle cx="12" cy="13.2" r="4.8" fill="hsl(14, 96%, 52%)" stroke="hsl(48, 100%, 76%)" stroke-width="1.1"/>
     <path d="M12 5 V7.4 M7.2 7.4 L8.8 9 M16.8 7.4 L15.2 9 M5.6 13.2 H7.2 M16.8 13.2 H18.4" stroke="hsl(46, 100%, 74%)" stroke-width="1.45" stroke-linecap="round"/>`
  ),
  berserk: wrapStatusSvg(
    'berserk',
    'hsl(16, 62%, 24%)',
    'hsl(352, 58%, 10%)',
    'hsl(42, 98%, 68%)',
    `<polygon points="13.4,4.4 7.4,12.6 11.8,12.6 10.4,19.6 16.8,11 12.2,11" fill="hsl(44, 100%, 66%)" stroke="hsl(12, 94%, 50%)" stroke-width="1.05" stroke-linejoin="round"/>`
  ),

  // === TEMPORARY MODIFIERS, BLOCK, ENERGY & ATTACK BUFFS ===
  tempStrengthDown: wrapStatusSvg(
    'tempStrengthDown',
    'hsl(354, 58%, 22%)',
    'hsl(340, 56%, 10%)',
    'hsl(356, 90%, 64%)',
    `<path d="M7.5 6.5 H16.5 L12 11.8 L16.5 17.5 H7.5 L12 11.8 Z" fill="hsla(356, 78%, 54%, 0.45)" stroke="hsl(14, 92%, 70%)" stroke-width="1.15" stroke-linejoin="round"/>
     <path d="M12 13.2 V17.2 M10.2 15.4 L12 17.4 L13.8 15.4" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`
  ),
  tempDexterityDown: wrapStatusSvg(
    'tempDexterityDown',
    'hsl(344, 52%, 22%)',
    'hsl(214, 48%, 10%)',
    'hsl(352, 88%, 64%)',
    `<path d="M7.5 6.5 H16.5 L12 11.8 L16.5 17.5 H7.5 L12 11.8 Z" fill="hsla(176, 66%, 48%, 0.35)" stroke="hsl(354, 90%, 68%)" stroke-width="1.15" stroke-linejoin="round"/>
     <path d="M12 13.2 V17.2 M10.2 15.4 L12 17.4 L13.8 15.4" fill="none" stroke="hsl(172, 96%, 76%)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`
  ),
  gainStrengthEndTurn: wrapStatusSvg(
    'gainStrengthEndTurn',
    'hsl(142, 50%, 20%)',
    'hsl(38, 48%, 10%)',
    'hsl(142, 88%, 62%)',
    `<path d="M7.5 14.5 A5.5 5.5 0 1 1 16.5 14.5" fill="none" stroke="hsl(44, 96%, 68%)" stroke-width="1.7" stroke-linecap="round"/>
     <path d="M12 18.2 V9.4 M9.2 12.2 L12 9 L14.8 12.2" fill="none" stroke="hsl(142, 94%, 66%)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`
  ),
  noDraw: wrapStatusSvg(
    'noDraw',
    'hsl(354, 58%, 22%)',
    'hsl(240, 44%, 10%)',
    'hsl(354, 92%, 62%)',
    `<rect x="7.8" y="5.8" width="8.4" height="12.4" rx="1.4" fill="hsl(220, 22%, 34%)" stroke="hsl(40, 32%, 78%)" stroke-width="1.05"/>
     <line x1="5.5" y1="5.5" x2="18.5" y2="18.5" stroke="hsl(354, 96%, 60%)" stroke-width="2.3" stroke-linecap="round"/>`
  ),
  confused: wrapStatusSvg(
    'confused',
    'hsl(282, 54%, 22%)',
    'hsl(172, 48%, 10%)',
    'hsl(292, 88%, 70%)',
    `<path d="M12 12 C12 10.6 13.6 10.4 14 11.8 C14.5 13.6 12.5 15.2 10.6 14.6 C8.2 13.8 7.5 10.8 8.8 8.6 C10.4 5.8 14.6 5.6 16.8 8.2 C18.8 10.8 18 15.5 14.6 17.5" fill="none" stroke="hsl(48, 100%, 74%)" stroke-width="1.7" stroke-linecap="round"/>
     <circle cx="12" cy="12" r="1.4" fill="hsl(292, 96%, 72%)"/>`
  ),
  thorns: wrapStatusSvg(
    'thorns',
    'hsl(126, 48%, 18%)',
    'hsl(28, 46%, 10%)',
    'hsl(104, 84%, 58%)',
    `<polygon points="12,4.4 14.2,11.6 9.8,11.6" fill="hsl(104, 88%, 56%)" stroke="hsl(46, 98%, 76%)" stroke-width="0.9"/>
     <polygon points="5.2,10.5 11.4,13.4 8.2,17.2" fill="hsl(118, 78%, 48%)" stroke="hsl(46, 94%, 72%)" stroke-width="0.85"/>
     <polygon points="18.8,10.5 15.8,17.2 12.6,13.4" fill="hsl(118, 78%, 48%)" stroke="hsl(46, 94%, 72%)" stroke-width="0.85"/>
     <circle cx="12" cy="14" r="2.2" fill="hsl(32, 68%, 38%)"/>`
  ),
  blur: wrapStatusSvg(
    'blur',
    'hsl(194, 56%, 22%)',
    'hsl(220, 52%, 10%)',
    'hsl(190, 94%, 68%)',
    `<path d="M9.2 6 L13.5 7.8 V12.8 C13.5 15.6 11.4 17.6 9.2 18.4 C7 17.6 5.2 15.6 5.2 12.8 V7.8 Z" fill="hsla(192, 90%, 66%, 0.34)" stroke="hsla(192, 96%, 80%, 0.7)" stroke-width="1"/>
     <path d="M14.4 5.4 L18.8 7.4 V12.6 C18.8 15.6 16.6 17.8 14.4 18.8 C12.2 17.8 10 15.6 10 12.6 V7.4 Z" fill="hsl(192, 84%, 52%)" stroke="hsl(192, 100%, 88%)" stroke-width="1.15"/>`
  ),
  nextTurnBlock: wrapStatusSvg(
    'nextTurnBlock',
    'hsl(204, 54%, 22%)',
    'hsl(222, 50%, 10%)',
    'hsl(198, 92%, 68%)',
    `<path d="M10.5 6 L15.5 8 V12.6 C15.5 15.4 13.2 17.6 10.5 18.5 C7.8 17.6 5.5 15.4 5.5 12.6 V8 Z" fill="hsl(204, 78%, 50%)" stroke="hsl(196, 100%, 86%)" stroke-width="1.1"/>
     <path d="M14.5 14.5 H18.5 M16.8 12.4 L19 14.5 L16.8 16.6" fill="none" stroke="hsl(46, 100%, 74%)" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/>`
  ),
  energized: wrapStatusSvg(
    'energized',
    'hsl(42, 62%, 24%)',
    'hsl(26, 56%, 10%)',
    'hsl(46, 98%, 68%)',
    `<circle cx="12" cy="12" r="6.5" fill="hsl(42, 92%, 52%)" stroke="hsl(52, 100%, 86%)" stroke-width="1.2"/>
     <polygon points="12.8,7.4 9.2,12.5 11.8,12.5 11.2,16.8 14.8,11.5 12.2,11.5" fill="hsl(26, 62%, 14%)"/>`
  ),
  drawCardNextTurn: wrapStatusSvg(
    'drawCardNextTurn',
    'hsl(198, 52%, 22%)',
    'hsl(228, 50%, 10%)',
    'hsl(46, 94%, 68%)',
    `<rect x="5.8" y="6.2" width="7.8" height="11" rx="1.3" fill="hsl(198, 72%, 54%)" stroke="hsl(194, 100%, 86%)" stroke-width="1.05"/>
     <path d="M12.5 13.5 H18.6 M16.4 11.2 L18.8 13.5 L16.4 15.8" fill="none" stroke="hsl(46, 100%, 74%)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`
  ),
  burst: wrapStatusSvg(
    'burst',
    'hsl(158, 58%, 22%)',
    'hsl(188, 56%, 10%)',
    'hsl(148, 96%, 64%)',
    `<polygon points="12,4.4 14.4,9.6 19.6,12 14.4,14.4 12,19.6 9.6,14.4 4.4,12 9.6,9.6" fill="hsl(150, 92%, 56%)" stroke="hsl(48, 100%, 84%)" stroke-width="1.05" stroke-linejoin="round"/>
     <circle cx="12" cy="12" r="2.2" fill="hsl(50, 100%, 88%)"/>`
  ),
  vigor: wrapStatusSvg(
    'vigor',
    'hsl(36, 64%, 24%)',
    'hsl(14, 58%, 10%)',
    'hsl(46, 100%, 70%)',
    `<polygon points="12,4.5 14.8,11.5 12,15.5 9.2,11.5" fill="hsl(48, 100%, 72%)" stroke="hsl(18, 96%, 54%)" stroke-width="1.05"/>
     <path d="M6 12 H7.8 M16.2 12 H18 M7.4 7.4 L8.8 8.8 M16.6 7.4 L15.2 8.8 M12 15.5 V19.2" stroke="hsl(44, 100%, 74%)" stroke-width="1.5" stroke-linecap="round"/>`
  ),
  buffer: wrapStatusSvg(
    'buffer',
    'hsl(190, 56%, 24%)',
    'hsl(226, 54%, 10%)',
    'hsl(186, 96%, 74%)',
    `<polygon points="12,4.5 18.4,8.2 18.4,15.8 12,19.5 5.6,15.8 5.6,8.2" fill="hsla(188, 92%, 62%, 0.35)" stroke="hsl(186, 100%, 82%)" stroke-width="1.45"/>
     <circle cx="12" cy="12" r="3" fill="hsl(48, 100%, 78%)" opacity="0.9"/>`
  ),
  artifact: wrapStatusSvg(
    'artifact',
    'hsl(42, 58%, 24%)',
    'hsl(28, 54%, 10%)',
    'hsl(46, 98%, 70%)',
    `<circle cx="12" cy="12" r="5" fill="hsl(44, 90%, 58%)" stroke="hsl(50, 100%, 86%)" stroke-width="1.15"/>
     <path d="M12 4.5 V6.8 M12 17.2 V19.5 M4.5 12 H6.8 M17.2 12 H19.5 M6.8 6.8 L8.4 8.4 M15.6 15.6 L17.2 17.2 M17.2 6.8 L15.6 8.4 M6.8 17.2 L8.4 15.6" stroke="hsl(46, 98%, 74%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="12" cy="12" r="2" fill="hsl(28, 56%, 16%)"/>`
  ),
  platedArmor: wrapStatusSvg(
    'platedArmor',
    'hsl(34, 48%, 22%)',
    'hsl(212, 42%, 10%)',
    'hsl(42, 86%, 68%)',
    `<path d="M6.2 7.2 Q12 5.4 17.8 7.2 V10.4 Q12 12.2 6.2 10.4 Z" fill="hsl(40, 72%, 62%)" stroke="hsl(28, 54%, 22%)" stroke-width="0.9"/>
     <path d="M6.6 11.4 Q12 13.2 17.4 11.4 V14.6 Q12 16.4 6.6 14.6 Z" fill="hsl(206, 46%, 64%)" stroke="hsl(216, 46%, 22%)" stroke-width="0.9"/>
     <path d="M7.6 15.6 Q12 17.2 16.4 15.6 L12 19.4 Z" fill="hsl(40, 76%, 58%)" stroke="hsl(28, 54%, 22%)" stroke-width="0.9"/>`
  ),
  duplication: wrapStatusSvg(
    'duplication',
    'hsl(268, 54%, 24%)',
    'hsl(218, 52%, 10%)',
    'hsl(282, 92%, 74%)',
    `<rect x="5.6" y="7.4" width="7.2" height="10.2" rx="1.4" fill="hsl(266, 72%, 52%)" stroke="hsl(284, 96%, 80%)" stroke-width="1.05"/>
     <rect x="11.2" y="5.8" width="7.2" height="10.2" rx="1.4" fill="hsl(192, 82%, 54%)" stroke="hsl(48, 100%, 84%)" stroke-width="1.15"/>`
  ),
  doubleTap: wrapStatusSvg(
    'doubleTap',
    'hsl(12, 62%, 24%)',
    'hsl(352, 56%, 10%)',
    'hsl(24, 96%, 64%)',
    `<path d="M6 17.5 L14.5 6.5 M10 18 L18.5 7" stroke="hsl(44, 100%, 74%)" stroke-width="2.1" stroke-linecap="round"/>
     <path d="M5.5 14 L9.5 17.5 M9.5 14.5 L13.5 18" stroke="hsl(12, 96%, 58%)" stroke-width="1.6" stroke-linecap="round"/>`
  ),

  // === SILENT / COLORLESS / SPECIAL ===
  choke: wrapStatusSvg(
    'choke',
    'hsl(342, 58%, 22%)',
    'hsl(280, 52%, 10%)',
    'hsl(348, 92%, 64%)',
    `<ellipse cx="12" cy="12" rx="6.2" ry="4.4" fill="none" stroke="hsl(350, 90%, 62%)" stroke-width="2"/>
     <path d="M9 12 L15 12 M12 5.4 V8.4 M12 15.6 V18.6" stroke="hsl(46, 100%, 74%)" stroke-width="1.45" stroke-linecap="round"/>`
  ),
  phantasmal: wrapStatusSvg(
    'phantasmal',
    'hsl(166, 56%, 20%)',
    'hsl(258, 52%, 10%)',
    'hsl(154, 94%, 66%)',
    `<path d="M6 17.8 L17.6 6.2" stroke="hsl(156, 94%, 74%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M9.5 7.5 Q12 4.8 15.5 6.2 M16.5 12 Q18.8 14.5 16.5 17.2" fill="none" stroke="hsl(282, 88%, 74%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="15.5" cy="8.5" r="1.5" fill="hsl(48, 100%, 78%)"/>`
  ),
  doubleDamage: wrapStatusSvg(
    'doubleDamage',
    'hsl(10, 66%, 24%)',
    'hsl(348, 60%, 10%)',
    'hsl(44, 100%, 68%)',
    `<path d="M6.2 17.8 L17.8 6.2 M6.2 6.2 L17.8 17.8" stroke="hsl(46, 100%, 72%)" stroke-width="2.1" stroke-linecap="round"/>
     <circle cx="12" cy="12" r="2.6" fill="hsl(10, 96%, 56%)" stroke="hsl(50, 100%, 88%)" stroke-width="1"/>`
  ),
  freeAttackPower: wrapStatusSvg(
    'freeAttackPower',
    'hsl(38, 60%, 22%)',
    'hsl(214, 48%, 10%)',
    'hsl(46, 98%, 70%)',
    `<circle cx="12" cy="12" r="6.4" fill="none" stroke="hsl(46, 98%, 70%)" stroke-width="1.6"/>
     <path d="M8.2 15.8 L15.8 8.2" stroke="hsl(192, 92%, 78%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="15.8" cy="8.2" r="1.4" fill="hsl(48, 100%, 82%)"/>`
  ),
  panache: wrapStatusSvg(
    'panache',
    'hsl(42, 58%, 24%)',
    'hsl(286, 52%, 10%)',
    'hsl(46, 98%, 72%)',
    `<polygon points="12,4.4 13.8,9.4 19,9.6 14.9,12.9 16.4,18.2 12,15.1 7.6,18.2 9.1,12.9 5,9.6 10.2,9.4" fill="hsl(46, 100%, 66%)" stroke="hsl(292, 86%, 72%)" stroke-width="1" stroke-linejoin="round"/>`
  ),
  theBomb: wrapStatusSvg(
    'theBomb',
    'hsl(20, 56%, 22%)',
    'hsl(220, 44%, 10%)',
    'hsl(34, 98%, 64%)',
    `<circle cx="11.2" cy="13.8" r="5.2" fill="hsl(224, 24%, 22%)" stroke="hsl(36, 92%, 68%)" stroke-width="1.2"/>
     <path d="M14.2 9.2 Q16.2 6.8 18.2 7.2" fill="none" stroke="hsl(40, 82%, 68%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="18.4" cy="7.2" r="2" fill="hsl(44, 100%, 66%)"/>`
  ),
  hex: wrapStatusSvg(
    'hex',
    'hsl(296, 58%, 22%)',
    'hsl(264, 58%, 9%)',
    'hsl(308, 92%, 68%)',
    `<polygon points="12,4.6 18.2,15.8 5.8,15.8" fill="none" stroke="hsl(312, 92%, 68%)" stroke-width="1.35" stroke-linejoin="round"/>
     <polygon points="12,19.4 18.2,8.2 5.8,8.2" fill="none" stroke="hsl(282, 88%, 72%)" stroke-width="1.35" stroke-linejoin="round"/>
     <circle cx="12" cy="12" r="1.8" fill="hsl(354, 96%, 64%)"/>`
  ),
  constricted: wrapStatusSvg(
    'constricted',
    'hsl(348, 56%, 22%)',
    'hsl(126, 48%, 9%)',
    'hsl(354, 90%, 62%)',
    `<path d="M5.5 8.5 Q12 5.5 18.5 8.5 M5.5 12 Q12 9 18.5 12 M5.5 15.5 Q12 12.5 18.5 15.5" fill="none" stroke="hsl(132, 74%, 46%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M8.5 6.8 L7.5 9.8 M15.5 10.5 L16.5 13.5 M9.5 14 L8.5 17" stroke="hsl(354, 94%, 64%)" stroke-width="1.4" stroke-linecap="round"/>`
  ),
  energyDownEachTurn: wrapStatusSvg(
    'energyDownEachTurn',
    'hsl(286, 54%, 20%)',
    'hsl(346, 54%, 10%)',
    'hsl(352, 90%, 64%)',
    `<circle cx="12" cy="11.2" r="5.2" fill="hsl(276, 42%, 26%)" stroke="hsl(352, 90%, 66%)" stroke-width="1.2" stroke-dasharray="3 1.6"/>
     <path d="M12 8.2 V14.2 M9.8 12.2 L12 14.5 L14.2 12.2" fill="none" stroke="hsl(354, 96%, 68%)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`
  ),
  blasphemer: wrapStatusSvg(
    'blasphemer',
    'hsl(350, 68%, 22%)',
    'hsl(276, 62%, 9%)',
    'hsl(354, 98%, 64%)',
    `<ellipse cx="12" cy="6.6" rx="5.5" ry="1.8" fill="none" stroke="hsl(48, 100%, 72%)" stroke-width="1.2" stroke-dasharray="3.5 1.8"/>
     <circle cx="12" cy="13.8" r="4.8" fill="hsl(354, 86%, 48%)" stroke="hsl(48, 100%, 82%)" stroke-width="1"/>
     <circle cx="10.4" cy="13.4" r="1" fill="hsl(272, 54%, 10%)"/><circle cx="13.6" cy="13.4" r="1" fill="hsl(272, 54%, 10%)"/>`
  ),

  // === WATCHER POWERS, MANTRA & STANCE TRIGGERS ===
  mantra: wrapStatusSvg(
    'mantra',
    'hsl(278, 58%, 24%)',
    'hsl(246, 56%, 10%)',
    'hsl(286, 94%, 74%)',
    `<path d="M5.4 12 Q12 6 18.6 12 Q12 18 5.4 12 Z" fill="hsl(282, 82%, 52%)" stroke="hsl(46, 100%, 76%)" stroke-width="1.2"/>
     <circle cx="12" cy="12" r="2.6" fill="hsl(46, 100%, 72%)"/><circle cx="12" cy="12" r="1" fill="hsl(278, 72%, 22%)"/>`
  ),
  mark: wrapStatusSvg(
    'mark',
    'hsl(312, 56%, 22%)',
    'hsl(274, 56%, 10%)',
    'hsl(318, 94%, 68%)',
    `<circle cx="12" cy="12" r="5.6" fill="none" stroke="hsl(320, 94%, 68%)" stroke-width="1.4"/>
     <polygon points="12,5.6 14.5,12 12,18.4 9.5,12" fill="hsl(344, 96%, 62%)" stroke="hsl(48, 100%, 82%)" stroke-width="0.9"/>`
  ),
  talkToTheHand: wrapStatusSvg(
    'talkToTheHand',
    'hsl(288, 52%, 22%)',
    'hsl(214, 50%, 10%)',
    'hsl(44, 96%, 70%)',
    `<path d="M8.2 12.2 V7.6 M10.6 11.4 V6.2 M13 11.4 V6.4 M15.4 12.2 V7.8" stroke="hsl(46, 96%, 74%)" stroke-width="1.65" stroke-linecap="round"/>
     <rect x="7.4" y="11.2" width="9" height="6.8" rx="3" fill="hsl(42, 88%, 62%)" stroke="hsl(286, 72%, 44%)" stroke-width="1"/>`
  ),
  likeWater: wrapStatusSvg(
    'likeWater',
    'hsl(198, 58%, 24%)',
    'hsl(224, 56%, 10%)',
    'hsl(192, 96%, 72%)',
    `<path d="M12 5.2 Q16.8 11 16.4 14.8 A4.4 4.4 0 1 1 7.6 14.8 Q7.2 11 12 5.2 Z" fill="hsl(196, 92%, 58%)" stroke="hsl(188, 100%, 88%)" stroke-width="1.15"/>
     <path d="M8.8 14.8 Q12 16.8 15.2 14.8" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.25" stroke-linecap="round"/>`
  ),
  mentalFortress: wrapStatusSvg(
    'mentalFortress',
    'hsl(268, 54%, 24%)',
    'hsl(224, 54%, 10%)',
    'hsl(276, 92%, 74%)',
    `<path d="M6.2 17.8 V9.2 L9 11.6 L12 6.4 L15 11.6 L17.8 9.2 V17.8 Z" fill="hsl(272, 74%, 56%)" stroke="hsl(46, 100%, 78%)" stroke-width="1.1" stroke-linejoin="round"/>`
  ),
  rushdown: wrapStatusSvg(
    'rushdown',
    'hsl(10, 64%, 24%)',
    'hsl(274, 52%, 10%)',
    'hsl(24, 98%, 64%)',
    `<path d="M6.2 6.8 Q11 11 14 17.8 M10 5.6 Q14.2 10.2 17.6 16.2 M5.6 11.6 Q9 14.8 10.8 18.6" fill="none" stroke="hsl(24, 98%, 62%)" stroke-width="2" stroke-linecap="round"/>`
  ),
  nirvana: wrapStatusSvg(
    'nirvana',
    'hsl(278, 54%, 24%)',
    'hsl(204, 52%, 10%)',
    'hsl(292, 92%, 76%)',
    `<path d="M12 6.2 Q15 10.5 12 14.6 Q9 10.5 12 6.2 Z" fill="hsl(46, 100%, 74%)"/>
     <path d="M6.2 12.6 Q9.8 11.4 11.6 15.4 Q8.2 16.2 6.2 12.6 Z M17.8 12.6 Q14.2 11.4 12.4 15.4 Q15.8 16.2 17.8 12.6 Z" fill="hsl(292, 88%, 68%)"/>
     <path d="M6.8 17.6 Q12 19.6 17.2 17.6" fill="none" stroke="hsl(194, 96%, 76%)" stroke-width="1.4" stroke-linecap="round"/>`
  ),
  foresight: wrapStatusSvg(
    'foresight',
    'hsl(268, 56%, 24%)',
    'hsl(226, 54%, 10%)',
    'hsl(46, 98%, 72%)',
    `<path d="M5 12 Q12 6.2 19 12 Q12 17.8 5 12 Z" fill="hsl(266, 62%, 44%)" stroke="hsl(46, 100%, 76%)" stroke-width="1.15"/>
     <circle cx="12" cy="12" r="2.8" fill="hsl(194, 96%, 68%)"/><circle cx="12" cy="12" r="1.2" fill="hsl(48, 100%, 88%)"/>`
  ),
  devotion: wrapStatusSvg(
    'devotion',
    'hsl(282, 56%, 24%)',
    'hsl(38, 52%, 10%)',
    'hsl(46, 100%, 72%)',
    `<path d="M12 5.4 L13.8 9.2 L18 9.8 L15 12.6 L15.8 16.8 L12 14.8 L8.2 16.8 L9 12.6 L6 9.8 L10.2 9.2 Z" fill="hsl(46, 100%, 68%)" stroke="hsl(286, 86%, 72%)" stroke-width="1"/>
     <path d="M8.5 18.8 H15.5" stroke="hsl(292, 92%, 74%)" stroke-width="1.5" stroke-linecap="round"/>`
  ),
  establishment: wrapStatusSvg(
    'establishment',
    'hsl(262, 50%, 24%)',
    'hsl(224, 50%, 10%)',
    'hsl(44, 94%, 70%)',
    `<rect x="6.5" y="6.2" width="11" height="2.4" rx="0.8" fill="hsl(44, 92%, 68%)"/>
     <rect x="8.2" y="9" width="2.6" height="6.8" fill="hsl(270, 68%, 68%)"/><rect x="13.2" y="9" width="2.6" height="6.8" fill="hsl(270, 68%, 68%)"/>
     <rect x="6" y="16" width="12" height="2.4" rx="0.8" fill="hsl(44, 92%, 68%)"/>`
  ),
  devaForm: wrapStatusSvg(
    'devaForm',
    'hsl(44, 62%, 24%)',
    'hsl(274, 54%, 10%)',
    'hsl(48, 100%, 74%)',
    `<circle cx="12" cy="12" r="4.2" fill="hsl(46, 100%, 68%)" stroke="hsl(286, 88%, 74%)" stroke-width="1.1"/>
     <path d="M12 4.2 V6.4 M12 17.6 V19.8 M4.2 12 H6.4 M17.6 12 H19.8 M6.6 6.6 L8.2 8.2 M15.8 15.8 L17.4 17.4 M17.4 6.6 L15.8 8.2 M6.6 17.4 L8.2 15.8" stroke="hsl(48, 100%, 82%)" stroke-width="1.45" stroke-linecap="round"/>`
  ),
  omega: wrapStatusSvg(
    'omega',
    'hsl(286, 58%, 24%)',
    'hsl(18, 56%, 10%)',
    'hsl(46, 100%, 72%)',
    `<path d="M6.4 17.4 H9.6 C7.6 15.6 7 13.4 7.4 10.8 C8 7.8 10 6.2 12 6.2 C14 6.2 16 7.8 16.6 10.8 C17 13.4 16.4 15.6 14.4 17.4 H17.6" fill="none" stroke="hsl(46, 100%, 72%)" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>`
  ),
  simmeringFury: wrapStatusSvg(
    'simmeringFury',
    'hsl(8, 66%, 24%)',
    'hsl(280, 52%, 10%)',
    'hsl(18, 98%, 62%)',
    `<path d="M12 5 Q17.2 10.4 16.4 15 A4.6 4.6 0 1 1 7.6 15 Q6.8 10.4 12 5 Z" fill="hsl(10, 94%, 52%)" stroke="hsl(46, 100%, 76%)" stroke-width="1.1"/>
     <path d="M12 10.4 L14 14.2 H10 Z" fill="hsl(48, 100%, 80%)"/>`
  ),
  waveOfTheHand: wrapStatusSvg(
    'waveOfTheHand',
    'hsl(276, 54%, 22%)',
    'hsl(198, 52%, 10%)',
    'hsl(194, 94%, 72%)',
    `<path d="M6.2 15.5 Q10.5 11.5 14.5 12.5 Q17.2 13.2 18.8 10.2" fill="none" stroke="hsl(194, 96%, 72%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M6.2 11.2 Q10 7.4 14 8.4 Q16.6 9 18 6.4" fill="none" stroke="hsl(288, 92%, 74%)" stroke-width="1.75" stroke-linecap="round"/>`
  ),
  battleHymn: wrapStatusSvg(
    'battleHymn',
    'hsl(42, 60%, 24%)',
    'hsl(276, 52%, 10%)',
    'hsl(46, 100%, 72%)',
    `<path d="M10.2 16.2 V7.4 L17.4 5.8 V14.2" fill="none" stroke="hsl(46, 100%, 72%)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="8.6" cy="16.4" r="2.2" fill="hsl(46, 100%, 70%)"/><circle cx="15.8" cy="14.4" r="2.2" fill="hsl(286, 90%, 72%)"/>`
  ),
  masterReality: wrapStatusSvg(
    'masterReality',
    'hsl(272, 58%, 24%)',
    'hsl(214, 54%, 10%)',
    'hsl(48, 100%, 74%)',
    `<polygon points="12,4.8 18.2,12 12,19.2 5.8,12" fill="hsl(274, 76%, 54%)" stroke="hsl(48, 100%, 78%)" stroke-width="1.2"/>
     <path d="M12 8.8 V15.2 M8.8 12 H15.2" stroke="hsl(148, 96%, 72%)" stroke-width="1.85" stroke-linecap="round"/>`
  ),

  // === ENEMY MECHANICS & BOSS PASSIVES ===
  ritual: wrapStatusSvg(
    'ritual',
    'hsl(268, 56%, 22%)',
    'hsl(352, 56%, 10%)',
    'hsl(286, 90%, 68%)',
    `<path d="M12 5 Q16.5 9.8 15.8 14 A3.9 3.9 0 1 1 8.2 14 Q7.5 9.8 12 5 Z" fill="hsl(286, 86%, 58%)" stroke="hsl(46, 100%, 78%)" stroke-width="1.05"/>
     <path d="M7.2 18.6 H16.8" stroke="hsl(44, 96%, 70%)" stroke-width="1.8" stroke-linecap="round"/>`
  ),
  curlUp: wrapStatusSvg(
    'curlUp',
    'hsl(34, 52%, 22%)',
    'hsl(24, 50%, 10%)',
    'hsl(40, 88%, 64%)',
    `<path d="M12 12 C12 10.6 13.6 10.2 14.2 11.4 C15 13 13.6 15.2 11.4 15 C8.8 14.8 7.4 12.2 8.2 9.4 C9.2 6.4 13.2 5.4 16 7.4 C18.6 9.4 18.6 14 16 16.8 C13.2 19.2 8.2 18.8 6.2 15.6" fill="none" stroke="hsl(38, 86%, 66%)" stroke-width="1.9" stroke-linecap="round"/>`
  ),
  enrage: wrapStatusSvg(
    'enrage',
    'hsl(2, 68%, 24%)',
    'hsl(348, 64%, 10%)',
    'hsl(8, 98%, 62%)',
    `<path d="M6.4 9.5 L10.8 11.8 M17.6 9.5 L13.2 11.8" stroke="hsl(48, 100%, 76%)" stroke-width="1.85" stroke-linecap="round"/>
     <circle cx="9.2" cy="12.8" r="1.3" fill="hsl(48, 100%, 76%)"/><circle cx="14.8" cy="12.8" r="1.3" fill="hsl(48, 100%, 76%)"/>
     <path d="M7.6 16.8 Q12 14.4 16.4 16.8" fill="none" stroke="hsl(14, 98%, 66%)" stroke-width="1.75" stroke-linecap="round"/>
     <path d="M6.5 6.8 L8.5 5.6 M17.5 6.8 L15.5 5.6" stroke="hsl(8, 96%, 64%)" stroke-width="1.4" stroke-linecap="round"/>`
  ),
  modeShift: wrapStatusSvg(
    'modeShift',
    'hsl(204, 50%, 22%)',
    'hsl(32, 48%, 10%)',
    'hsl(42, 92%, 68%)',
    `<path d="M7 9.5 A6 6 0 0 1 17 9.5 M17 14.5 A6 6 0 0 1 7 14.5" fill="none" stroke="hsl(196, 94%, 72%)" stroke-width="1.7" stroke-linecap="round"/>
     <polygon points="17.6,6.8 18.2,10.5 14.6,9.8" fill="hsl(46, 100%, 72%)"/><polygon points="6.4,17.2 5.8,13.5 9.4,14.2" fill="hsl(46, 100%, 72%)"/>
     <circle cx="12" cy="12" r="2.1" fill="hsl(20, 92%, 58%)"/>`
  ),
  sharpHide: wrapStatusSvg(
    'sharpHide',
    'hsl(356, 56%, 22%)',
    'hsl(216, 44%, 10%)',
    'hsl(12, 92%, 64%)',
    `<polygon points="6,17 9,7 12,14 15,6.5 18,17" fill="hsl(10, 86%, 54%)" stroke="hsl(44, 100%, 80%)" stroke-width="1.15" stroke-linejoin="round"/>`
  ),
  sporeCloud: wrapStatusSvg(
    'sporeCloud',
    'hsl(296, 54%, 22%)',
    'hsl(268, 54%, 10%)',
    'hsl(304, 90%, 68%)',
    `<path d="M6 12.8 C6 8.2 8.8 6 12 6 C15.2 6 18 8.2 18 12.8 Z" fill="hsl(308, 82%, 54%)" stroke="hsl(324, 100%, 82%)" stroke-width="1.05"/>
     <rect x="10.2" y="12.8" width="3.6" height="5.4" rx="1.2" fill="hsl(42, 52%, 82%)"/>
     <circle cx="7" cy="16.8" r="1.1" fill="hsl(112, 92%, 58%)"/><circle cx="17" cy="16.4" r="1.1" fill="hsl(112, 92%, 58%)"/>`
  ),
  angry: wrapStatusSvg(
    'angry',
    'hsl(4, 66%, 24%)',
    'hsl(348, 60%, 10%)',
    'hsl(14, 96%, 62%)',
    `<path d="M12 4.8 L18.2 9.4 L16 17.8 H8 L5.8 9.4 Z" fill="hsl(4, 86%, 48%)" stroke="hsl(44, 100%, 74%)" stroke-width="1.1" stroke-linejoin="round"/>
     <path d="M8.6 10.6 L11.2 12 M15.4 10.6 L12.8 12 M9.4 15.2 H14.6" stroke="hsl(48, 100%, 84%)" stroke-width="1.5" stroke-linecap="round"/>`
  ),
  splitThreshold: wrapStatusSvg(
    'splitThreshold',
    'hsl(126, 54%, 20%)',
    'hsl(160, 52%, 9%)',
    'hsl(114, 90%, 58%)',
    `<circle cx="8.2" cy="12.5" r="3.4" fill="hsl(116, 84%, 50%)" stroke="hsl(96, 100%, 80%)" stroke-width="1"/>
     <circle cx="15.8" cy="12.5" r="3.4" fill="hsl(116, 84%, 50%)" stroke="hsl(96, 100%, 80%)" stroke-width="1"/>
     <path d="M12 5.4 V9 M12 15.8 V19" stroke="hsl(48, 100%, 76%)" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="2 1.5"/>`
  ),
  asleep: wrapStatusSvg(
    'asleep',
    'hsl(224, 48%, 22%)',
    'hsl(240, 52%, 10%)',
    'hsl(214, 86%, 72%)',
    `<path d="M6.4 9.5 H11.4 L6.4 14.5 H11.4" fill="none" stroke="hsl(206, 96%, 80%)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M13.2 6.4 H17.4 L13.2 10.6 H17.4" fill="none" stroke="hsl(46, 100%, 76%)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M13.8 14.5 Q16 17.5 18.2 14.5" fill="none" stroke="hsl(214, 72%, 68%)" stroke-width="1.4" stroke-linecap="round"/>`
  ),
  stunned: wrapStatusSvg(
    'stunned',
    'hsl(42, 58%, 24%)',
    'hsl(26, 54%, 10%)',
    'hsl(48, 100%, 72%)',
    `<ellipse cx="12" cy="12" rx="6.6" ry="3.6" fill="none" stroke="hsl(46, 98%, 72%)" stroke-width="1.35" transform="rotate(-18 12 12)"/>
     <polygon points="8,7.4 8.8,9.2 10.6,9.4 9.2,10.6 9.6,12.4 8,11.4 6.4,12.4 6.8,10.6 5.4,9.4 7.2,9.2" fill="hsl(50, 100%, 82%)"/>
     <polygon points="16.4,12.2 17,13.6 18.4,13.8 17.3,14.7 17.6,16.1 16.4,15.3 15.2,16.1 15.5,14.7 14.4,13.8 15.8,13.6" fill="hsl(42, 100%, 72%)"/>`
  ),
  painfulStabs: wrapStatusSvg(
    'painfulStabs',
    'hsl(354, 62%, 24%)',
    'hsl(342, 58%, 10%)',
    'hsl(8, 96%, 62%)',
    `<polygon points="17.8,5.6 9.8,16.4 7.4,14 15.4,4.8" fill="hsl(0, 0%, 92%)" stroke="hsl(354, 88%, 54%)" stroke-width="1"/>
     <circle cx="15.8" cy="15.8" r="2.2" fill="hsl(354, 92%, 54%)"/><circle cx="17.8" cy="12.2" r="1.2" fill="hsl(354, 92%, 60%)"/>`
  ),
  slow: wrapStatusSvg(
    'slow',
    'hsl(206, 52%, 22%)',
    'hsl(252, 52%, 10%)',
    'hsl(198, 92%, 70%)',
    `<circle cx="12" cy="12" r="6.6" fill="hsl(214, 48%, 30%)" stroke="hsl(196, 94%, 74%)" stroke-width="1.3"/>
     <path d="M12 7.4 V12.2 L15.4 14.4" fill="none" stroke="hsl(46, 100%, 74%)" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M16.2 15.8 L18.8 18.4" stroke="hsl(354, 92%, 64%)" stroke-width="1.6" stroke-linecap="round"/>`
  ),
  explosive: wrapStatusSvg(
    'explosive',
    'hsl(12, 66%, 24%)',
    'hsl(352, 62%, 10%)',
    'hsl(32, 100%, 64%)',
    `<circle cx="12" cy="13.2" r="5" fill="hsl(10, 92%, 48%)" stroke="hsl(48, 100%, 78%)" stroke-width="1.15"/>
     <path d="M12 5 V8 M8 6.4 L9.6 8.4 M16 6.4 L14.4 8.4" stroke="hsl(48, 100%, 76%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="12" cy="13.2" r="1.9" fill="hsl(52, 100%, 84%)"/>`
  ),
  timeWarp: wrapStatusSvg(
    'timeWarp',
    'hsl(186, 54%, 20%)',
    'hsl(274, 54%, 10%)',
    'hsl(180, 92%, 68%)',
    `<circle cx="12" cy="12" r="6.8" fill="hsl(268, 44%, 24%)" stroke="hsl(182, 92%, 70%)" stroke-width="1.3"/>
     <path d="M12 7.2 V12 L15.6 9.8" fill="none" stroke="hsl(46, 100%, 74%)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="12" cy="12" r="1.4" fill="hsl(182, 96%, 76%)"/>`
  ),
  curiosity: wrapStatusSvg(
    'curiosity',
    'hsl(192, 58%, 22%)',
    'hsl(268, 54%, 10%)',
    'hsl(188, 96%, 72%)',
    `<path d="M4.8 12 Q12 6 19.2 12 Q12 18 4.8 12 Z" fill="hsl(192, 92%, 58%)" stroke="hsl(48, 100%, 80%)" stroke-width="1.15"/>
     <circle cx="12" cy="12" r="2.7" fill="hsl(272, 62%, 22%)"/><circle cx="12.8" cy="11.2" r="0.95" fill="hsl(0, 0%, 100%)"/>`
  ),
  regenerating: wrapStatusSvg(
    'regenerating',
    'hsl(148, 56%, 20%)',
    'hsl(170, 56%, 9%)',
    'hsl(142, 92%, 62%)',
    `<path d="M12 18.4 C12 18.4 6.2 14.5 6.2 10.2 C6.2 7.8 8 6.2 10 6.2 C11.1 6.2 11.7 6.8 12 7.4 C12.3 6.8 12.9 6.2 14 6.2 C16 6.2 17.8 7.8 17.8 10.2 C17.8 14.5 12 18.4 12 18.4 Z" fill="hsl(146, 82%, 44%)" stroke="hsl(136, 100%, 80%)" stroke-width="1.1"/>
     <path d="M12 9.4 V14.6 M9.4 12 H14.6" stroke="hsl(0, 0%, 100%)" stroke-width="1.6" stroke-linecap="round"/>`
  ),
  flight: wrapStatusSvg(
    'flight',
    'hsl(200, 58%, 24%)',
    'hsl(224, 54%, 10%)',
    'hsl(194, 96%, 76%)',
    `<path d="M12 14.6 Q8.5 11.5 5 8.5 Q7.2 14 11.2 16.5 Z M12 14.6 Q15.5 11.5 19 8.5 Q16.8 14 12.8 16.5 Z" fill="hsl(196, 94%, 82%)" stroke="hsl(206, 86%, 62%)" stroke-width="1" stroke-linejoin="round"/>
     <path d="M12 7.2 V17.4" stroke="hsl(48, 100%, 76%)" stroke-width="1.5" stroke-linecap="round"/>`
  ),
  malleable: wrapStatusSvg(
    'malleable',
    'hsl(166, 56%, 20%)',
    'hsl(204, 52%, 10%)',
    'hsl(162, 92%, 64%)',
    `<path d="M12 5.2 C16 5.2 18.4 8 17.6 11.8 C16.8 15.6 15 18.6 12 18.8 C9 18.6 6.6 15.8 6.4 11.8 C6.2 8 8.4 5.2 12 5.2 Z" fill="hsl(164, 78%, 46%)" stroke="hsl(156, 100%, 82%)" stroke-width="1.2"/>
     <path d="M9.2 10.2 Q12 8.2 14.8 10.8 Q12 14.4 9.2 12.4" fill="none" stroke="hsl(46, 100%, 78%)" stroke-width="1.4" stroke-linecap="round"/>`
  ),
  lifeLink: wrapStatusSvg(
    'lifeLink',
    'hsl(276, 56%, 22%)',
    'hsl(248, 58%, 9%)',
    'hsl(288, 92%, 72%)',
    `<circle cx="7.8" cy="12" r="3" fill="hsl(282, 82%, 56%)" stroke="hsl(296, 100%, 84%)" stroke-width="1"/>
     <circle cx="16.2" cy="12" r="3" fill="hsl(282, 82%, 56%)" stroke="hsl(296, 100%, 84%)" stroke-width="1"/>
     <line x1="10.8" y1="12" x2="13.2" y2="12" stroke="hsl(46, 100%, 76%)" stroke-width="2" stroke-linecap="round"/>`
  ),
  reactive: wrapStatusSvg(
    'reactive',
    'hsl(292, 56%, 22%)',
    'hsl(258, 56%, 9%)',
    'hsl(304, 92%, 70%)',
    `<path d="M6.8 9.2 A6 6 0 0 1 17.2 9.2 M17.2 14.8 A6 6 0 0 1 6.8 14.8" fill="none" stroke="hsl(304, 92%, 70%)" stroke-width="1.7" stroke-linecap="round"/>
     <circle cx="12" cy="12" r="2.6" fill="hsl(46, 100%, 72%)"/><circle cx="12" cy="12" r="1.1" fill="hsl(282, 68%, 20%)"/>`
  ),
  shifting: wrapStatusSvg(
    'shifting',
    'hsl(198, 54%, 22%)',
    'hsl(268, 52%, 10%)',
    'hsl(192, 92%, 72%)',
    `<path d="M5.5 8.5 Q9 6 12 8.5 T18.5 8.5 M5.5 12.2 Q9 9.7 12 12.2 T18.5 12.2 M5.5 15.9 Q9 13.4 12 15.9 T18.5 15.9" fill="none" stroke="hsl(192, 96%, 76%)" stroke-width="1.7" stroke-linecap="round"/>`
  ),
  fading: wrapStatusSvg(
    'fading',
    'hsl(236, 48%, 22%)',
    'hsl(266, 54%, 9%)',
    'hsl(214, 88%, 74%)',
    `<path d="M7.6 5.6 H16.4 L12 11.8 L16.4 18.4 H7.6 L12 11.8 Z" fill="hsla(212, 86%, 72%, 0.42)" stroke="hsl(204, 96%, 82%)" stroke-width="1.2" stroke-linejoin="round"/>
     <circle cx="12" cy="15.8" r="1.3" fill="hsl(46, 100%, 78%)"/>`
  ),
});

export const STATUS_NEGATIVE_SVG_ART = Object.freeze({
  strength: wrapStatusSvg(
    'strength_down',
    'hsl(352, 62%, 22%)',
    'hsl(342, 60%, 9%)',
    'hsl(354, 94%, 62%)',
    `<path d="M6.5 15.2 C6.5 11.5 8.5 9.2 11.4 9.2 C13 9.2 13.8 10 14.2 10.8 L16 8.2 C16.8 7 18.4 7.6 18 9.2 L17 13.2 C16.5 15 14.8 16 12.5 16 H7.6 Z" fill="hsl(354, 70%, 44%)" stroke="hsl(12, 92%, 70%)" stroke-width="1" stroke-linejoin="round"/>
     <path d="M12 19.6 L9.5 16.8 H11.2 V14.6 H12.8 V16.8 H14.5 Z" fill="hsl(356, 98%, 68%)"/>`
  ),
  dexterity: wrapStatusSvg(
    'dexterity_down',
    'hsl(348, 58%, 22%)',
    'hsl(220, 50%, 9%)',
    'hsl(354, 92%, 62%)',
    `<path d="M6 15.5 Q11 15 14.5 10.6 Q16.2 8.2 18 6.8 Q17.6 10.6 15 13.6 Q18 12.8 18.6 15 Q14 17 6 16.4 Z" fill="hsl(352, 66%, 44%)" stroke="hsl(14, 90%, 72%)" stroke-width="1" stroke-linejoin="round"/>
     <path d="M12 19.6 L9.5 16.8 H11.2 V14.6 H12.8 V16.8 H14.5 Z" fill="hsl(356, 98%, 68%)"/>`
  ),
});

const FALLBACK_BUFF_SVG = wrapStatusSvg(
  'fallback_buff',
  'hsl(152, 52%, 22%)',
  'hsl(172, 52%, 10%)',
  'hsl(148, 88%, 62%)',
  `<path d="M12 5.4 L17.4 12 H13.8 V18.6 H10.2 V12 H6.6 Z" fill="hsl(148, 92%, 60%)"/>`
);

const FALLBACK_DEBUFF_SVG = wrapStatusSvg(
  'fallback_debuff',
  'hsl(354, 58%, 22%)',
  'hsl(340, 58%, 10%)',
  'hsl(354, 92%, 62%)',
  `<path d="M12 18.6 L17.4 12 H13.8 V5.4 H10.2 V12 H6.6 Z" fill="hsl(354, 92%, 62%)"/>`
);

export const STATUS_NO_COUNT_IF_ONE = Object.freeze(
  new Set([
    'barricade',
    'corruption',
    'noDraw',
    'confused',
    'stunned',
    'splitThreshold',
    'doubleDamage',
    'masterReality',
    'blasphemer',
    'lifeLink',
    'reactive',
    'shifting',
  ])
);

export function getStatusSvg(statusKey, options = {}) {
  const polarity = options.polarity === 'debuff' ? 'debuff' : 'buff';
  let svg;
  if (polarity === 'debuff' && STATUS_NEGATIVE_SVG_ART[statusKey]) {
    svg = STATUS_NEGATIVE_SVG_ART[statusKey];
  } else if (STATUS_INNER_ART.has(statusKey)) {
    svg = buildStatusSvg(statusKey, STATUS_INNER_ART.get(statusKey), polarity);
  } else {
    svg = polarity === 'debuff' ? FALLBACK_DEBUFF_SVG : FALLBACK_BUFF_SVG;
  }
  if (options.scope) {
    svg = scopeStatusSvgIds(svg, options.scope);
  }
  if (options.className) {
    svg = svg.replace('class="status-svg"', `class="status-svg ${options.className}"`);
  }
  return svg;
}
