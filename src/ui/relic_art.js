/**
 * Complete bespoke inline SVG illustration library for all 103 relics in RELIC_LIBRARY.
 * Every relic is hand-crafted as a frameless floating silhouette on a 36x36 canvas with
 * a soft borderless ambient glow and unique `ra-*` gradient IDs (optionally scoped via
 * `options.scope` to prevent DOM ID collisions across HUD, Compendium, Shop, Reward, and Reports).
 */

function wrapRelicSvg(key, bg1, bg2, rim, inner) {
  return `<svg viewBox="0 0 36 36" width="36" height="36" class="relic-svg" data-relic-svg="${key}" aria-hidden="true"><defs><radialGradient id="ra-${key}-bg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${rim}" stop-opacity="0.24"/><stop offset="56%" stop-color="${bg1}" stop-opacity="0.11"/><stop offset="100%" stop-color="${bg2}" stop-opacity="0"/></radialGradient><linearGradient id="ra-${key}-rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${rim}" stop-opacity="0.22"/><stop offset="100%" stop-color="${bg2}" stop-opacity="0"/></linearGradient></defs><circle cx="18" cy="18" r="17" fill="url(#ra-${key}-bg)"/><g transform="translate(18 18) scale(1.24) translate(-18 -18)">${inner}</g></svg>`;
}

function scopeSvgIds(svg, suffix) {
  if (!svg || !suffix) return svg;
  return svg
    .replace(/\bid="([^"]+)"/g, (_, id) => `id="${id}-${suffix}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${id}-${suffix})`);
}

export const RELIC_SVG_ART = Object.freeze({
  // === STARTER RELICS (3) ===
  burning_blood: wrapRelicSvg(
    'burning_blood',
    'hsl(6, 56%, 24%)',
    'hsl(352, 54%, 10%)',
    'hsl(24, 92%, 60%)',
    `<path d="M18 5.5 Q25 13 24 21.5 A6.6 6.6 0 1 1 12 21.5 Q11 13 18 5.5 Z" fill="hsl(22, 98%, 54%)" opacity="0.65"/>
     <path d="M18 8.5 Q23.5 16 22.8 22 A5.2 5.2 0 1 1 13.2 22 Q12.5 16 18 8.5 Z" fill="hsl(354, 90%, 48%)" stroke="hsl(44, 100%, 74%)" stroke-width="1.2"/>
     <path d="M15.8 18.5 Q16.8 15 18.8 14" fill="none" stroke="hsla(48, 100%, 92%, 0.78)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="11" cy="12" r="1.2" fill="hsl(42, 100%, 74%)"/><circle cx="25.5" cy="11" r="1.1" fill="hsl(28, 100%, 66%)"/>`
  ),
  ring_of_the_snake: wrapRelicSvg(
    'ring_of_the_snake',
    'hsl(154, 52%, 22%)',
    'hsl(176, 54%, 9%)',
    'hsl(148, 86%, 58%)',
    `<circle cx="18" cy="19" r="9.2" fill="none" stroke="hsl(152, 68%, 36%)" stroke-width="4.2"/>
     <circle cx="18" cy="19" r="9.2" fill="none" stroke="hsl(142, 92%, 64%)" stroke-width="1.3" stroke-dasharray="3 2.5"/>
     <path d="M13 10.5 Q18 6 23.5 10.5 Q21.5 14.5 18 14 Q14.5 14.5 13 10.5 Z" fill="hsl(146, 78%, 46%)" stroke="hsl(48, 92%, 72%)" stroke-width="1.1"/>
     <circle cx="16.2" cy="10.4" r="1.1" fill="hsl(48, 100%, 76%)"/><circle cx="19.8" cy="10.4" r="1.1" fill="hsl(48, 100%, 76%)"/>
     <path d="M18 14 L17 16.5 M18 14 L19.2 16.5" stroke="hsl(354, 92%, 62%)" stroke-width="0.9" stroke-linecap="round"/>`
  ),
  pure_water: wrapRelicSvg(
    'pure_water',
    'hsl(224, 54%, 24%)',
    'hsl(268, 52%, 10%)',
    'hsl(196, 94%, 72%)',
    `<path d="M18 6.5 Q25.5 16.5 24.5 22.5 A6.6 6.6 0 1 1 11.5 22.5 Q10.5 16.5 18 6.5 Z" fill="hsl(198, 92%, 58%)" stroke="hsl(286, 86%, 80%)" stroke-width="1.3"/>
     <path d="M18 11 Q21.5 17 21 21.5 A3.2 3.2 0 1 1 15 21.5 Q14.5 17 18 11 Z" fill="hsla(188, 100%, 88%, 0.6)"/>
     <path d="M14.5 20.5 Q15.2 17 17 15" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M25.5 9 L26.5 11.2 L28.8 12 L26.5 12.8 L25.5 15 L24.5 12.8 L22.2 12 L24.5 11.2 Z" fill="hsl(48, 100%, 82%)"/>`
  ),

  // === COMMON RELICS (25) ===
  vajra: wrapRelicSvg(
    'vajra',
    'hsl(38, 54%, 24%)',
    'hsl(24, 50%, 10%)',
    'hsl(46, 96%, 68%)',
    `<g transform="rotate(-38 18 18)">
       <rect x="16.3" y="8" width="3.4" height="20" rx="1.4" fill="hsl(44, 92%, 62%)" stroke="hsl(28, 60%, 24%)" stroke-width="0.9"/>
       <circle cx="18" cy="18" r="3.4" fill="hsl(48, 100%, 74%)" stroke="hsl(26, 62%, 26%)" stroke-width="1"/>
       <path d="M14 11 Q18 4 22 11 Q18 13 14 11 Z M14 25 Q18 32 22 25 Q18 23 14 25 Z" fill="none" stroke="hsl(46, 98%, 72%)" stroke-width="1.7" stroke-linejoin="round"/>
       <line x1="18" y1="5.5" x2="18" y2="30.5" stroke="hsl(194, 100%, 82%)" stroke-width="1.2"/>
     </g>`
  ),
  oddly_smooth_stone: wrapRelicSvg(
    'oddly_smooth_stone',
    'hsl(214, 28%, 24%)',
    'hsl(224, 28%, 10%)',
    'hsl(206, 46%, 72%)',
    `<ellipse cx="18" cy="19" rx="11.2" ry="8.5" transform="rotate(-12 18 19)" fill="hsl(212, 16%, 48%)" stroke="hsl(208, 34%, 78%)" stroke-width="1.3"/>
     <ellipse cx="17" cy="17.5" rx="8.5" ry="6" transform="rotate(-12 17 17.5)" fill="hsl(212, 18%, 62%)"/>
     <path d="M11 16.5 Q14.5 12.5 21.5 13" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="2" stroke-linecap="round" opacity="0.82"/>
     <circle cx="24" cy="15" r="1.2" fill="hsl(0, 0%, 100%)" opacity="0.8"/>`
  ),
  anchor: wrapRelicSvg(
    'anchor',
    'hsl(208, 44%, 22%)',
    'hsl(222, 46%, 10%)',
    'hsl(198, 72%, 68%)',
    `<circle cx="18" cy="9.5" r="2.6" fill="none" stroke="hsl(44, 86%, 66%)" stroke-width="1.8"/>
     <line x1="18" y1="12" x2="18" y2="27.5" stroke="hsl(210, 26%, 78%)" stroke-width="2.6" stroke-linecap="round"/>
     <line x1="12.5" y1="15.5" x2="23.5" y2="15.5" stroke="hsl(44, 84%, 64%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M9.5 21.5 Q11.5 28.5 18 28.5 Q24.5 28.5 26.5 21.5" fill="none" stroke="hsl(210, 30%, 82%)" stroke-width="2.5" stroke-linecap="round"/>
     <polygon points="8,22.5 10.5,18.5 12.5,22.5" fill="hsl(210, 34%, 88%)"/><polygon points="28,22.5 25.5,18.5 23.5,22.5" fill="hsl(210, 34%, 88%)"/>`
  ),
  bag_of_prep: wrapRelicSvg(
    'bag_of_prep',
    'hsl(28, 44%, 22%)',
    'hsl(20, 44%, 10%)',
    'hsl(38, 78%, 62%)',
    `<rect x="9.5" y="13.5" width="17" height="14.5" rx="3.2" fill="hsl(24, 52%, 36%)" stroke="hsl(38, 76%, 62%)" stroke-width="1.3"/>
     <path d="M9.5 17 Q18 22 26.5 17 V14 Q26.5 12 24.5 12 H11.5 Q9.5 12 9.5 14 Z" fill="hsl(28, 56%, 46%)" stroke="hsl(40, 82%, 68%)" stroke-width="1.1"/>
     <path d="M14 12 Q18 7.5 22 12" fill="none" stroke="hsl(34, 62%, 56%)" stroke-width="1.8"/>
     <rect x="15.8" y="17.8" width="4.4" height="4.2" rx="1" fill="hsl(44, 96%, 68%)" stroke="hsl(24, 54%, 24%)" stroke-width="0.9"/>
     <rect x="20" y="7.5" width="4.5" height="6" rx="0.8" transform="rotate(14 22 10)" fill="hsl(42, 42%, 88%)" stroke="hsl(204, 72%, 56%)" stroke-width="0.9"/>`
  ),
  lantern: wrapRelicSvg(
    'lantern',
    'hsl(24, 56%, 22%)',
    'hsl(10, 52%, 10%)',
    'hsl(42, 96%, 66%)',
    `<path d="M14 7.5 H22 M18 5.5 V8" stroke="hsl(42, 84%, 64%)" stroke-width="1.8" stroke-linecap="round"/>
     <ellipse cx="18" cy="18.5" rx="8.2" ry="9" fill="hsl(14, 88%, 48%)" stroke="hsl(44, 96%, 70%)" stroke-width="1.4"/>
     <ellipse cx="18" cy="18.5" rx="4.4" ry="7.8" fill="hsl(40, 100%, 66%)" opacity="0.85"/>
     <ellipse cx="18" cy="18.5" rx="2" ry="5.5" fill="hsl(52, 100%, 90%)"/>
     <rect x="13.5" y="9" width="9" height="2.4" rx="1" fill="hsl(24, 42%, 22%)" stroke="hsl(44, 86%, 66%)" stroke-width="0.8"/>
     <rect x="14" y="26.5" width="8" height="2.4" rx="1" fill="hsl(24, 42%, 22%)" stroke="hsl(44, 86%, 66%)" stroke-width="0.8"/>
     <line x1="18" y1="29" x2="18" y2="31.5" stroke="hsl(44, 94%, 68%)" stroke-width="1.8" stroke-linecap="round"/>`
  ),
  orichalcum: wrapRelicSvg(
    'orichalcum',
    'hsl(178, 42%, 22%)',
    'hsl(214, 42%, 10%)',
    'hsl(40, 82%, 66%)',
    `<polygon points="10,23 14,11 24,9 28,19 22,28 12,27" fill="hsl(174, 44%, 42%)" stroke="hsl(44, 90%, 72%)" stroke-width="1.4"/>
     <polygon points="14,11 24,9 21,18 12,18" fill="hsl(168, 62%, 62%)" opacity="0.85"/>
     <polygon points="24,9 28,19 21,18" fill="hsl(42, 86%, 64%)" opacity="0.72"/>
     <polygon points="10,23 12,18 21,18 22,28 12,27" fill="hsl(188, 48%, 26%)" opacity="0.78"/>
     <path d="M14.5 13 L21.5 11.5" stroke="hsl(0, 0%, 100%)" stroke-width="1.3" stroke-linecap="round" opacity="0.8"/>`
  ),
  bag_of_marbles: wrapRelicSvg(
    'bag_of_marbles',
    'hsl(268, 44%, 22%)',
    'hsl(228, 44%, 10%)',
    'hsl(286, 78%, 68%)',
    `<path d="M12 10 L15 13.5 H21 L24 10 L21.5 15 Q26 19.5 24 25.5 Q18 28.5 12 25.5 Q10 19.5 14.5 15 Z" fill="hsl(274, 42%, 34%)" stroke="hsl(44, 82%, 66%)" stroke-width="1.2"/>
     <circle cx="12" cy="24.5" r="3.4" fill="hsl(194, 96%, 60%)" stroke="hsl(0, 0%, 100%)" stroke-width="0.8"/>
     <circle cx="19" cy="26" r="3.4" fill="hsl(352, 92%, 58%)" stroke="hsl(48, 100%, 84%)" stroke-width="0.8"/>
     <circle cx="25" cy="23.5" r="3.1" fill="hsl(46, 98%, 62%)" stroke="hsl(0, 0%, 100%)" stroke-width="0.8"/>
     <circle cx="11" cy="23.5" r="1" fill="hsl(0,0%,100%)"/><circle cx="18" cy="25" r="1" fill="hsl(0,0%,100%)"/>`
  ),
  blood_vial: wrapRelicSvg(
    'blood_vial',
    'hsl(354, 52%, 22%)',
    'hsl(344, 48%, 10%)',
    'hsl(6, 86%, 64%)',
    `<rect x="15.5" y="6.5" width="5" height="3.2" rx="1" fill="hsl(30, 52%, 46%)" stroke="hsl(38, 66%, 72%)" stroke-width="0.9"/>
     <path d="M14.5 10 H21.5 V14.5 L24 22.5 A6 6 0 0 1 18 29 A6 6 0 0 1 12 22.5 L14.5 14.5 Z" fill="hsla(206, 44%, 82%, 0.22)" stroke="hsl(206, 46%, 84%)" stroke-width="1.3"/>
     <path d="M13.3 19.5 H22.7 L23.4 22.5 A5.2 5.2 0 0 1 18 28 A5.2 5.2 0 0 1 12.6 22.5 Z" fill="hsl(354, 90%, 48%)"/>
     <path d="M14.5 22.5 Q15 19.5 16.2 17" fill="none" stroke="hsla(0, 0%, 100%, 0.72)" stroke-width="1.2" stroke-linecap="round"/>`
  ),
  snecko_skull: wrapRelicSvg(
    'snecko_skull',
    'hsl(136, 48%, 20%)',
    'hsl(166, 48%, 9%)',
    'hsl(126, 92%, 62%)',
    `<path d="M10 15 Q18 7 26 15 L24 23 L21 25.5 H15 L12 23 Z" fill="hsl(44, 34%, 86%)" stroke="hsl(148, 42%, 24%)" stroke-width="1.3"/>
     <ellipse cx="14.2" cy="16.5" rx="2.3" ry="1.8" fill="hsl(146, 62%, 12%)"/><ellipse cx="21.8" cy="16.5" rx="2.3" ry="1.8" fill="hsl(146, 62%, 12%)"/>
     <circle cx="14.2" cy="16.5" r="1" fill="hsl(124, 100%, 66%)"/><circle cx="21.8" cy="16.5" r="1" fill="hsl(124, 100%, 66%)"/>
     <polygon points="13.5,24 15.2,30 16.6,24" fill="hsl(126, 96%, 64%)"/><polygon points="22.5,24 20.8,30 19.4,24" fill="hsl(126, 96%, 64%)"/>`
  ),
  damaru: wrapRelicSvg(
    'damaru',
    'hsl(282, 46%, 22%)',
    'hsl(340, 46%, 10%)',
    'hsl(44, 92%, 66%)',
    `<polygon points="10,9 26,9 20,18 26,27 10,27 16,18" fill="hsl(24, 58%, 42%)" stroke="hsl(44, 92%, 68%)" stroke-width="1.3" stroke-linejoin="round"/>
     <ellipse cx="18" cy="9.5" rx="7.6" ry="2.2" fill="hsl(42, 54%, 84%)" stroke="hsl(32, 62%, 38%)" stroke-width="1"/>
     <ellipse cx="18" cy="26.5" rx="7.6" ry="2.2" fill="hsl(42, 54%, 80%)" stroke="hsl(32, 62%, 38%)" stroke-width="1"/>
     <rect x="15.2" y="16.5" width="5.6" height="3" rx="1" fill="hsl(352, 86%, 52%)"/>
     <path d="M15 18 Q9 20 8.5 23.5 M21 18 Q27 16 27.5 12.5" fill="none" stroke="hsl(44, 96%, 72%)" stroke-width="1.1"/>
     <circle cx="8.5" cy="24" r="1.8" fill="hsl(48, 100%, 74%)"/><circle cx="27.5" cy="12" r="1.8" fill="hsl(48, 100%, 74%)"/>`
  ),
  strawberry: wrapRelicSvg(
    'strawberry',
    'hsl(354, 52%, 22%)',
    'hsl(14, 46%, 10%)',
    'hsl(354, 88%, 64%)',
    `<path d="M11 16 C10.5 11.5 14 10 18 11 C22 10 25.5 11.5 25 16 C24.5 22.5 20.5 27.5 18 28.5 C15.5 27.5 11.5 22.5 11 16 Z" fill="hsl(354, 88%, 48%)" stroke="hsl(12, 82%, 68%)" stroke-width="1.2"/>
     <path d="M12.5 12.5 L15.5 9.5 L18 12 L20.5 9.5 L23.5 12.5 L20 13.5 L18 11.8 L16 13.5 Z" fill="hsl(134, 72%, 44%)" stroke="hsl(124, 82%, 68%)" stroke-width="0.9"/>
     <circle cx="15" cy="17" r="0.9" fill="hsl(46, 100%, 76%)"/><circle cx="20.5" cy="16.5" r="0.9" fill="hsl(46, 100%, 76%)"/><circle cx="18" cy="21" r="0.9" fill="hsl(46, 100%, 76%)"/><circle cx="15.5" cy="23.5" r="0.9" fill="hsl(46, 100%, 76%)"/><circle cx="20.5" cy="23" r="0.9" fill="hsl(46, 100%, 76%)"/>`
  ),
  akabeko: wrapRelicSvg(
    'akabeko',
    'hsl(6, 56%, 22%)',
    'hsl(354, 52%, 10%)',
    'hsl(12, 92%, 62%)',
    `<ellipse cx="20.5" cy="21" rx="8" ry="5.5" fill="hsl(4, 84%, 46%)" stroke="hsl(44, 88%, 74%)" stroke-width="1.1"/>
     <circle cx="11.5" cy="17" r="4.8" fill="hsl(4, 88%, 50%)" stroke="hsl(44, 92%, 74%)" stroke-width="1.1"/>
     <path d="M8.5 13 Q7 9.5 10.5 10.5 M13.5 13 Q15 9.5 11.8 10.5" fill="none" stroke="hsl(44, 72%, 88%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="10.2" cy="16.5" r="1.1" fill="hsl(48, 100%, 84%)"/><circle cx="19" cy="20" r="1.4" fill="hsl(0, 0%, 96%)"/><circle cx="23" cy="22" r="1.2" fill="hsl(0, 0%, 96%)"/>
     <path d="M15 26 V29 M24 26 V29" stroke="hsl(4, 72%, 34%)" stroke-width="2.2" stroke-linecap="round"/>`
  ),
  happy_flower: wrapRelicSvg(
    'happy_flower',
    'hsl(42, 54%, 22%)',
    'hsl(134, 44%, 10%)',
    'hsl(48, 98%, 68%)',
    `<line x1="18" y1="22" x2="18" y2="30" stroke="hsl(132, 68%, 44%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M18 27 Q13 25 12 28 M18 26 Q23 24 24 27" fill="none" stroke="hsl(132, 74%, 52%)" stroke-width="1.8" stroke-linecap="round"/>
     <g fill="hsl(46, 98%, 62%)" stroke="hsl(32, 86%, 44%)" stroke-width="0.8">
       <circle cx="18" cy="9.5" r="3"/><circle cx="24" cy="12" r="3"/><circle cx="25.5" cy="18" r="3"/><circle cx="22.5" cy="23" r="2.8"/><circle cx="13.5" cy="23" r="2.8"/><circle cx="10.5" cy="18" r="3"/><circle cx="12" cy="12" r="3"/>
     </g>
     <circle cx="18" cy="16.8" r="5.2" fill="hsl(34, 72%, 34%)" stroke="hsl(48, 100%, 76%)" stroke-width="1.1"/>
     <circle cx="16.3" cy="15.8" r="0.9" fill="hsl(48, 100%, 88%)"/><circle cx="19.7" cy="15.8" r="0.9" fill="hsl(48, 100%, 88%)"/>
     <path d="M15.8 18.4 Q18 20.4 20.2 18.4" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.1" stroke-linecap="round"/>`
  ),
  nunchaku: wrapRelicSvg(
    'nunchaku',
    'hsl(24, 46%, 22%)',
    'hsl(214, 36%, 10%)',
    'hsl(38, 84%, 64%)',
    `<path d="M13 11 Q18 6.5 23 11" fill="none" stroke="hsl(210, 32%, 82%)" stroke-width="1.8" stroke-dasharray="2.4 1.6"/>
     <rect x="8.5" y="10.5" width="4.4" height="17" rx="1.6" transform="rotate(14 10.7 19)" fill="hsl(22, 58%, 38%)" stroke="hsl(40, 82%, 64%)" stroke-width="1.1"/>
     <rect x="23.1" y="10.5" width="4.4" height="17" rx="1.6" transform="rotate(-14 25.3 19)" fill="hsl(22, 58%, 38%)" stroke="hsl(40, 82%, 64%)" stroke-width="1.1"/>
     <line x1="10" y1="22" x2="13.5" y2="23" stroke="hsl(44, 92%, 72%)" stroke-width="1.3"/><line x1="22.5" y1="23" x2="26" y2="22" stroke="hsl(44, 92%, 72%)" stroke-width="1.3"/>`
  ),
  pen_nib: wrapRelicSvg(
    'pen_nib',
    'hsl(242, 42%, 22%)',
    'hsl(224, 44%, 10%)',
    'hsl(44, 88%, 68%)',
    `<g transform="rotate(36 18 18)">
       <path d="M18 6 L24.5 18.5 L21.5 27.5 H14.5 L11.5 18.5 Z" fill="hsl(42, 74%, 64%)" stroke="hsl(24, 52%, 24%)" stroke-width="1.2" stroke-linejoin="round"/>
       <path d="M18 6 L20.5 13 L18 16 L15.5 13 Z" fill="hsl(258, 72%, 22%)"/>
       <line x1="18" y1="7" x2="18" y2="18.5" stroke="hsl(242, 62%, 14%)" stroke-width="1.2"/>
       <circle cx="18" cy="19.5" r="1.8" fill="hsl(242, 62%, 14%)"/>
       <rect x="14.5" y="25" width="7" height="3.2" rx="1" fill="hsl(220, 24%, 26%)" stroke="hsl(46, 92%, 72%)" stroke-width="0.9"/>
     </g>`
  ),
  ceramic_fish: wrapRelicSvg(
    'ceramic_fish',
    'hsl(204, 52%, 24%)',
    'hsl(224, 52%, 10%)',
    'hsl(198, 88%, 74%)',
    `<path d="M9.5 18.5 Q14 11.5 22 14.5 Q25.5 16 26.5 18.5 Q25.5 21 22 22.5 Q14 25.5 9.5 18.5 Z" fill="hsl(204, 42%, 92%)" stroke="hsl(214, 72%, 44%)" stroke-width="1.3"/>
     <polygon points="24.5,18.5 30,13 28.8,18.5 30,24" fill="hsl(208, 76%, 56%)" stroke="hsl(212, 86%, 82%)" stroke-width="0.9"/>
     <path d="M14.5 15 Q17.5 18.5 14.5 22 M18.5 14.8 Q21 18.5 18.5 22.2" fill="none" stroke="hsl(214, 80%, 50%)" stroke-width="1.3" stroke-linecap="round"/>
     <circle cx="12.6" cy="17.6" r="1.2" fill="hsl(222, 74%, 22%)"/>`
  ),
  centennial_puzzle: wrapRelicSvg(
    'centennial_puzzle',
    'hsl(30, 48%, 22%)',
    'hsl(20, 46%, 10%)',
    'hsl(42, 86%, 64%)',
    `<polygon points="18,7.5 27.5,13 27.5,23.5 18,29 8.5,23.5 8.5,13" fill="hsl(28, 52%, 38%)" stroke="hsl(44, 92%, 70%)" stroke-width="1.3"/>
     <polygon points="18,7.5 27.5,13 18,18.5 8.5,13" fill="hsl(36, 62%, 52%)"/>
     <polygon points="18,18.5 27.5,13 27.5,23.5 18,29" fill="hsl(22, 50%, 28%)"/>
     <path d="M13 10.5 L22.5 16 M22.5 10.5 L13 16 M18 18.5 V29 M8.5 18.2 L18 23.8 L27.5 18.2" stroke="hsl(46, 94%, 72%)" stroke-width="1.1" opacity="0.85"/>`
  ),
  toy_ornithopter: wrapRelicSvg(
    'toy_ornithopter',
    'hsl(34, 46%, 22%)',
    'hsl(206, 42%, 10%)',
    'hsl(42, 88%, 68%)',
    `<path d="M18 18 L7 11.5 Q9.5 18.5 15 19.5 Z" fill="hsl(42, 62%, 78%)" stroke="hsl(30, 56%, 34%)" stroke-width="1.1"/>
     <path d="M18 18 L29 11.5 Q26.5 18.5 21 19.5 Z" fill="hsl(42, 62%, 78%)" stroke="hsl(30, 56%, 34%)" stroke-width="1.1"/>
     <path d="M15 20 L18 27.5 L21 20 Z" fill="hsl(34, 72%, 52%)" stroke="hsl(46, 92%, 74%)" stroke-width="1"/>
     <ellipse cx="18" cy="18" rx="2.6" ry="5.2" fill="hsl(26, 54%, 34%)" stroke="hsl(44, 92%, 68%)" stroke-width="1.1"/>
     <circle cx="18" cy="15" r="1.4" fill="hsl(148, 92%, 66%)"/>`
  ),
  meal_ticket: wrapRelicSvg(
    'meal_ticket',
    'hsl(352, 46%, 22%)',
    'hsl(28, 44%, 10%)',
    'hsl(44, 90%, 68%)',
    `<path d="M8 12.5 H28 V15.8 A2.2 2.2 0 0 0 28 20.2 V23.5 H8 V20.2 A2.2 2.2 0 0 0 8 15.8 Z" fill="hsl(42, 64%, 84%)" stroke="hsl(354, 74%, 48%)" stroke-width="1.3"/>
     <line x1="14.5" y1="13" x2="14.5" y2="23" stroke="hsl(354, 66%, 54%)" stroke-width="1" stroke-dasharray="1.8 1.4"/>
     <path d="M18.5 15 V21 M17.5 15 V17.5 M19.5 15 V17.5" stroke="hsl(354, 76%, 42%)" stroke-width="1.1" stroke-linecap="round"/>
     <path d="M23.2 15.2 C24.6 15.2 24.6 18 23.2 18.2 V21" fill="none" stroke="hsl(354, 76%, 42%)" stroke-width="1.2" stroke-linecap="round"/>`
  ),
  art_of_war: wrapRelicSvg(
    'art_of_war',
    'hsl(36, 48%, 22%)',
    'hsl(12, 46%, 10%)',
    'hsl(44, 90%, 66%)',
    `<rect x="10" y="10.5" width="16" height="15" rx="1.6" fill="hsl(40, 56%, 78%)" stroke="hsl(28, 54%, 32%)" stroke-width="1.2"/>
     <rect x="8.5" y="9" width="3.2" height="18" rx="1.4" fill="hsl(24, 58%, 36%)" stroke="hsl(44, 86%, 66%)" stroke-width="0.9"/>
     <rect x="24.3" y="9" width="3.2" height="18" rx="1.4" fill="hsl(24, 58%, 36%)" stroke="hsl(44, 86%, 66%)" stroke-width="0.9"/>
     <path d="M14.5 14 H21.5 M14.5 17.5 H21.5 M14.5 21 H19" stroke="hsl(18, 42%, 26%)" stroke-width="1.2" stroke-linecap="round"/>
     <circle cx="21.5" cy="21.5" r="2.1" fill="hsl(354, 84%, 48%)" stroke="hsl(44, 92%, 72%)" stroke-width="0.8"/>`
  ),
  preserved_insect: wrapRelicSvg(
    'preserved_insect',
    'hsl(36, 62%, 24%)',
    'hsl(22, 54%, 10%)',
    'hsl(44, 98%, 66%)',
    `<polygon points="18,6.5 27,13.5 25,25.5 18,29.5 11,25.5 9,13.5" fill="hsl(38, 92%, 52%)" stroke="hsl(48, 100%, 78%)" stroke-width="1.3"/>
     <ellipse cx="18" cy="18.5" rx="3.4" ry="5.5" fill="hsl(22, 48%, 14%)"/>
     <circle cx="18" cy="12.2" r="2" fill="hsl(22, 48%, 14%)"/>
     <path d="M14.8 15 L11.5 13 M14.6 18.5 L11 19 M15.2 22 L12 24.5 M21.2 15 L24.5 13 M21.4 18.5 L25 19 M20.8 22 L24 24.5" stroke="hsl(22, 52%, 14%)" stroke-width="1.1" stroke-linecap="round"/>
     <path d="M13 11.5 L17 9" stroke="hsla(52, 100%, 94%, 0.8)" stroke-width="1.4" stroke-linecap="round"/>`
  ),
  smiling_mask: wrapRelicSvg(
    'smiling_mask',
    'hsl(224, 30%, 22%)',
    'hsl(252, 34%, 10%)',
    'hsl(44, 78%, 72%)',
    `<path d="M10.5 13.5 Q18 7.5 25.5 13.5 Q26.5 22.5 18 28.5 Q9.5 22.5 10.5 13.5 Z" fill="hsl(42, 46%, 90%)" stroke="hsl(36, 52%, 44%)" stroke-width="1.3"/>
     <path d="M13 16.5 Q14.8 14.5 16.6 16.5 M19.4 16.5 Q21.2 14.5 23 16.5" fill="none" stroke="hsl(240, 32%, 18%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="13.2" cy="19.8" r="1.4" fill="hsla(354, 86%, 62%, 0.55)"/><circle cx="22.8" cy="19.8" r="1.4" fill="hsla(354, 86%, 62%, 0.55)"/>
     <path d="M13.5 21.5 Q18 25.8 22.5 21.5" fill="none" stroke="hsl(354, 76%, 46%)" stroke-width="1.6" stroke-linecap="round"/>`
  ),
  bronze_scales: wrapRelicSvg(
    'bronze_scales',
    'hsl(30, 50%, 22%)',
    'hsl(20, 48%, 10%)',
    'hsl(38, 86%, 62%)',
    `<path d="M9 17 L13.5 9.5 L18 17 L13.5 21.5 Z" fill="hsl(34, 66%, 46%)" stroke="hsl(46, 92%, 74%)" stroke-width="1.1"/>
     <path d="M18 17 L22.5 9.5 L27 17 L22.5 21.5 Z" fill="hsl(30, 62%, 42%)" stroke="hsl(46, 92%, 74%)" stroke-width="1.1"/>
     <path d="M12.5 24 L18 14.5 L23.5 24 L18 28.5 Z" fill="hsl(36, 74%, 54%)" stroke="hsl(48, 98%, 78%)" stroke-width="1.2"/>
     <line x1="18" y1="16.5" x2="18" y2="25.5" stroke="hsl(26, 56%, 22%)" stroke-width="1.1"/>`
  ),
  whetstone: wrapRelicSvg(
    'whetstone',
    'hsl(214, 28%, 22%)',
    'hsl(18, 36%, 10%)',
    'hsl(38, 86%, 66%)',
    `<polygon points="7.5,23.5 21,11.5 28.5,15.5 15,27.5" fill="hsl(212, 16%, 46%)" stroke="hsl(210, 28%, 78%)" stroke-width="1.3"/>
     <polygon points="7.5,23.5 15,27.5 15,29.5 7.5,25.5" fill="hsl(216, 18%, 26%)"/>
     <path d="M11 22 L24.5 10" stroke="hsl(46, 100%, 78%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M14 13 L11.5 9.5 M19 10.5 L18 6.5 M25.5 12 L29 10.5" stroke="hsl(36, 100%, 74%)" stroke-width="1.4" stroke-linecap="round"/>`
  ),
  war_paint: wrapRelicSvg(
    'war_paint',
    'hsl(212, 48%, 22%)',
    'hsl(352, 46%, 10%)',
    'hsl(196, 86%, 66%)',
    `<path d="M9.5 18 H26.5 C26.5 24.5 22.8 28 18 28 C13.2 28 9.5 24.5 9.5 18 Z" fill="hsl(26, 46%, 32%)" stroke="hsl(40, 74%, 60%)" stroke-width="1.2"/>
     <ellipse cx="18" cy="18" rx="8.4" ry="3.2" fill="hsl(200, 92%, 52%)" stroke="hsl(44, 86%, 72%)" stroke-width="1"/>
     <path d="M13 18 Q18 15.8 23 18" stroke="hsl(354, 92%, 58%)" stroke-width="2" fill="none" stroke-linecap="round"/>
     <line x1="21.5" y1="16.5" x2="27.5" y2="8.5" stroke="hsl(32, 54%, 52%)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="20.5" cy="17.5" r="1.8" fill="hsl(46, 98%, 70%)"/>`
  ),

  // === UNCOMMON RELICS (25) ===
  horn_cleat: wrapRelicSvg(
    'horn_cleat',
    'hsl(36, 44%, 22%)',
    'hsl(214, 42%, 10%)',
    'hsl(42, 86%, 66%)',
    `<rect x="11" y="21.5" width="14" height="4.8" rx="1.5" fill="hsl(32, 54%, 38%)" stroke="hsl(44, 88%, 68%)" stroke-width="1.1"/>
     <path d="M7.5 14.5 Q11.5 13 14.5 16.5 H21.5 Q24.5 13 28.5 14.5 L27 18.2 H9 Z" fill="hsl(42, 84%, 60%)" stroke="hsl(28, 56%, 24%)" stroke-width="1.1"/>
     <rect x="14.5" y="17.5" width="7" height="4.2" fill="hsl(36, 68%, 46%)"/>
     <circle cx="14" cy="23.9" r="1" fill="hsl(48, 96%, 80%)"/><circle cx="22" cy="23.9" r="1" fill="hsl(48, 96%, 80%)"/>`
  ),
  mercury_hourglass: wrapRelicSvg(
    'mercury_hourglass',
    'hsl(210, 38%, 22%)',
    'hsl(228, 42%, 10%)',
    'hsl(204, 72%, 78%)',
    `<rect x="10.5" y="7.5" width="15" height="2.4" rx="1" fill="hsl(42, 82%, 62%)"/><rect x="10.5" y="26.1" width="15" height="2.4" rx="1" fill="hsl(42, 82%, 62%)"/>
     <path d="M12.5 10 H23.5 L19.2 18 L23.5 26 H12.5 L16.8 18 Z" fill="hsla(206, 46%, 86%, 0.22)" stroke="hsl(206, 54%, 84%)" stroke-width="1.2"/>
     <polygon points="14.2,11.5 21.8,11.5 18,16.8" fill="hsl(208, 36%, 86%)"/>
     <polygon points="14,25 22,25 18,20.5" fill="hsl(206, 56%, 78%)"/>
     <line x1="18" y1="16.5" x2="18" y2="21.5" stroke="hsl(0, 0%, 100%)" stroke-width="1.3" stroke-dasharray="1.6 1.2"/>`
  ),
  meat_on_the_bone: wrapRelicSvg(
    'meat_on_the_bone',
    'hsl(12, 52%, 22%)',
    'hsl(354, 48%, 10%)',
    'hsl(24, 86%, 62%)',
    `<g transform="rotate(-32 18 18)">
       <rect x="7.5" y="16" width="21" height="4" rx="2" fill="hsl(42, 46%, 90%)" stroke="hsl(28, 34%, 44%)" stroke-width="0.9"/>
       <circle cx="8" cy="16.5" r="2.1" fill="hsl(42, 46%, 90%)"/><circle cx="8" cy="19.5" r="2.1" fill="hsl(42, 46%, 90%)"/>
       <circle cx="28" cy="16.5" r="2.1" fill="hsl(42, 46%, 90%)"/><circle cx="28" cy="19.5" r="2.1" fill="hsl(42, 46%, 90%)"/>
       <ellipse cx="18" cy="18" rx="8" ry="6.1" fill="hsl(10, 74%, 40%)" stroke="hsl(24, 78%, 62%)" stroke-width="1.2"/>
       <path d="M13 15.5 Q18 13.5 23 15.5" fill="none" stroke="hsla(36, 96%, 78%, 0.72)" stroke-width="1.5" stroke-linecap="round"/>
     </g>`
  ),
  eternal_feather: wrapRelicSvg(
    'eternal_feather',
    'hsl(168, 48%, 22%)',
    'hsl(216, 48%, 10%)',
    'hsl(46, 96%, 72%)',
    `<path d="M10 27.5 Q12 14 26.5 8 Q25 21 12.5 25.5 Z" fill="hsl(166, 78%, 52%)" stroke="hsl(46, 98%, 76%)" stroke-width="1.2"/>
     <path d="M13.5 23 Q17 15.5 24.5 10.5" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M9 28.5 L14 23.5" stroke="hsl(46, 94%, 76%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="11.5" cy="12" r="1.2" fill="hsl(48, 100%, 84%)"/><circle cx="25" cy="24" r="1.1" fill="hsl(164, 100%, 78%)"/>`
  ),
  paper_phrog: wrapRelicSvg(
    'paper_phrog',
    'hsl(136, 46%, 20%)',
    'hsl(164, 48%, 9%)',
    'hsl(126, 86%, 62%)',
    `<polygon points="18,9 26,18 22,25 14,25 10,18" fill="hsl(134, 62%, 52%)" stroke="hsl(118, 92%, 78%)" stroke-width="1.2" stroke-linejoin="round"/>
     <polygon points="18,9 26,18 18,19" fill="hsl(140, 62%, 40%)"/>
     <polygon points="10,18 7.5,25.5 13.5,24.5" fill="hsl(134, 58%, 44%)" stroke="hsl(118, 86%, 74%)" stroke-width="1"/>
     <polygon points="26,18 28.5,25.5 22.5,24.5" fill="hsl(134, 58%, 44%)" stroke="hsl(118, 86%, 74%)" stroke-width="1"/>
     <circle cx="15" cy="14.5" r="1.1" fill="hsl(48, 100%, 82%)"/><circle cx="21" cy="14.5" r="1.1" fill="hsl(48, 100%, 82%)"/>`
  ),
  shuriken: wrapRelicSvg(
    'shuriken',
    'hsl(214, 30%, 22%)',
    'hsl(226, 36%, 10%)',
    'hsl(206, 54%, 78%)',
    `<polygon points="18,6 21.5,14.5 30,18 21.5,21.5 18,30 14.5,21.5 6,18 14.5,14.5" fill="hsl(212, 22%, 74%)" stroke="hsl(216, 30%, 22%)" stroke-width="1.2" stroke-linejoin="round"/>
     <polygon points="18,6 21.5,14.5 18,18" fill="hsl(0, 0%, 96%)" opacity="0.72"/>
     <polygon points="30,18 21.5,21.5 18,18" fill="hsl(0, 0%, 96%)" opacity="0.55"/>
     <circle cx="18" cy="18" r="3" fill="hsl(224, 34%, 14%)" stroke="hsl(44, 86%, 68%)" stroke-width="1.1"/>`
  ),
  kunai: wrapRelicSvg(
    'kunai',
    'hsl(212, 32%, 22%)',
    'hsl(164, 38%, 10%)',
    'hsl(164, 72%, 68%)',
    `<g transform="rotate(42 18 18)">
       <polygon points="18,6.5 23.2,15.5 18,21 12.8,15.5" fill="hsl(208, 28%, 84%)" stroke="hsl(216, 30%, 24%)" stroke-width="1.2"/>
       <line x1="18" y1="7.5" x2="18" y2="20" stroke="hsl(0, 0%, 100%)" stroke-width="1.1" opacity="0.75"/>
       <rect x="16.6" y="20.5" width="2.8" height="5.5" rx="0.8" fill="hsl(354, 72%, 44%)"/>
       <circle cx="18" cy="28" r="2.3" fill="none" stroke="hsl(210, 32%, 80%)" stroke-width="1.5"/>
     </g>`
  ),
  pear: wrapRelicSvg(
    'pear',
    'hsl(86, 46%, 20%)',
    'hsl(132, 44%, 10%)',
    'hsl(82, 86%, 62%)',
    `<path d="M18 10.5 C21 10.5 21.5 14.5 23.5 18 C26 22 23.5 28 18 28 C12.5 28 10 22 12.5 18 C14.5 14.5 15 10.5 18 10.5 Z" fill="hsl(74, 78%, 52%)" stroke="hsl(56, 88%, 74%)" stroke-width="1.2"/>
     <path d="M18 10.5 V7.2" stroke="hsl(28, 54%, 38%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M18.5 8.5 Q23 6.5 24 10 Q21 11.2 18.5 8.5 Z" fill="hsl(132, 74%, 46%)"/>
     <path d="M14.5 20.5 Q14.5 17 16 14.5" fill="none" stroke="hsla(60, 100%, 92%, 0.72)" stroke-width="1.4" stroke-linecap="round"/>`
  ),
  ornamental_fan: wrapRelicSvg(
    'ornamental_fan',
    'hsl(352, 48%, 22%)',
    'hsl(26, 44%, 10%)',
    'hsl(44, 92%, 68%)',
    `<path d="M18 26.5 L7.5 14.5 A14 14 0 0 1 28.5 14.5 Z" fill="hsl(42, 68%, 84%)" stroke="hsl(44, 92%, 64%)" stroke-width="1.3"/>
     <path d="M18 26.5 L12.5 11.5 M18 26.5 V10.5 M18 26.5 L23.5 11.5" stroke="hsl(32, 54%, 44%)" stroke-width="0.9"/>
     <circle cx="18" cy="16.5" r="3.4" fill="hsl(354, 86%, 50%)"/>
     <circle cx="18" cy="26.5" r="1.8" fill="hsl(44, 96%, 68%)"/>`
  ),
  red_skull: wrapRelicSvg(
    'red_skull',
    'hsl(356, 62%, 22%)',
    'hsl(12, 54%, 10%)',
    'hsl(8, 96%, 60%)',
    `<path d="M11 17 A7 7.5 0 1 1 25 17 C25 20.5 23.2 22.2 22 23.5 V26.8 H14 V23.5 C12.8 22.2 11 20.5 11 17 Z" fill="hsl(356, 84%, 46%)" stroke="hsl(28, 96%, 68%)" stroke-width="1.2"/>
     <circle cx="15" cy="17.2" r="2.2" fill="hsl(20, 62%, 10%)"/><circle cx="21" cy="17.2" r="2.2" fill="hsl(20, 62%, 10%)"/>
     <circle cx="15" cy="17.2" r="1" fill="hsl(48, 100%, 72%)"/><circle cx="21" cy="17.2" r="1" fill="hsl(48, 100%, 72%)"/>
     <path d="M16 24 V26.8 M18 24 V26.8 M20 24 V26.8" stroke="hsl(20, 56%, 12%)" stroke-width="1.1"/>`
  ),
  mummified_hand: wrapRelicSvg(
    'mummified_hand',
    'hsl(36, 40%, 20%)',
    'hsl(268, 38%, 10%)',
    'hsl(42, 74%, 64%)',
    `<path d="M12.5 27 V17.5 Q12 13 14 13 V17 M15.5 17 V9.5 Q17.2 9.5 17.2 11.5 V17 M18.8 17 V9 Q20.5 9 20.5 11 V17 M22 17.5 V11.5 Q23.6 11.5 23.6 13.5 V21.5 Q23.6 26.5 18 27 Z" fill="hsl(38, 42%, 72%)" stroke="hsl(28, 40%, 28%)" stroke-width="1.1" stroke-linejoin="round"/>
     <path d="M13 19.5 L23 18 M13 22.5 L23 21.5 M13.5 25 L22 24.5" stroke="hsl(32, 34%, 44%)" stroke-width="1.1"/>
     <circle cx="18" cy="13.5" r="1.5" fill="hsl(288, 96%, 72%)"/>`
  ),
  teardrop_locket: wrapRelicSvg(
    'teardrop_locket',
    'hsl(214, 52%, 22%)',
    'hsl(264, 48%, 10%)',
    'hsl(194, 94%, 72%)',
    `<path d="M13 7 Q18 11 23 7" fill="none" stroke="hsl(44, 88%, 72%)" stroke-width="1.2"/>
     <path d="M18 10 Q24.5 17.5 24 22.5 A6 6 0 1 1 12 22.5 Q11.5 17.5 18 10 Z" fill="hsl(198, 86%, 50%)" stroke="hsl(46, 92%, 76%)" stroke-width="1.4"/>
     <circle cx="18" cy="22" r="2.8" fill="hsl(190, 100%, 84%)"/>
     <path d="M15.2 19.5 Q16 16.5 17.4 14.5" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.2" stroke-linecap="round"/>`
  ),
  duality: wrapRelicSvg(
    'duality',
    'hsl(274, 46%, 22%)',
    'hsl(224, 48%, 10%)',
    'hsl(46, 94%, 72%)',
    `<circle cx="18" cy="18" r="10.2" fill="hsl(268, 48%, 16%)" stroke="hsl(46, 94%, 70%)" stroke-width="1.4"/>
     <path d="M18 7.8 A10.2 10.2 0 0 1 18 28.2 A5.1 5.1 0 0 1 18 18 A5.1 5.1 0 0 0 18 7.8 Z" fill="hsl(44, 54%, 92%)"/>
     <circle cx="18" cy="13" r="1.8" fill="hsl(268, 52%, 18%)"/><circle cx="18" cy="23" r="1.8" fill="hsl(44, 72%, 90%)"/>`
  ),
  self_forming_clay: wrapRelicSvg(
    'self_forming_clay',
    'hsl(20, 48%, 22%)',
    'hsl(12, 46%, 10%)',
    'hsl(28, 82%, 62%)',
    `<path d="M9.5 21.5 Q9 12 17.5 10 Q25.5 10.5 26.5 19 Q26.5 26.5 18 27 Q10 27 9.5 21.5 Z" fill="hsl(18, 56%, 44%)" stroke="hsl(36, 78%, 64%)" stroke-width="1.3"/>
     <path d="M14 14.5 L18 12.5 L22 14.5 V19.5 C22 22.2 20 23.8 18 24.8 C16 23.8 14 22.2 14 19.5 Z" fill="hsl(26, 62%, 56%)" stroke="hsl(46, 94%, 74%)" stroke-width="1.1"/>`
  ),
  letter_opener: wrapRelicSvg(
    'letter_opener',
    'hsl(210, 38%, 22%)',
    'hsl(352, 38%, 10%)',
    'hsl(44, 88%, 68%)',
    `<rect x="8.5" y="15.5" width="16" height="11" rx="1.4" fill="hsl(42, 48%, 84%)" stroke="hsl(32, 46%, 44%)" stroke-width="1"/>
     <path d="M8.5 16 L16.5 21.5 L24.5 16" fill="none" stroke="hsl(32, 44%, 48%)" stroke-width="1"/>
     <polygon points="13,22 26.5,8.5 28,10 15.5,24" fill="hsl(210, 34%, 88%)" stroke="hsl(216, 36%, 28%)" stroke-width="1"/>
     <line x1="22.5" y1="10" x2="26.5" y2="14" stroke="hsl(44, 94%, 66%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="16.5" cy="21.5" r="1.7" fill="hsl(354, 84%, 48%)"/>`
  ),
  strike_dummy: wrapRelicSvg(
    'strike_dummy',
    'hsl(28, 46%, 22%)',
    'hsl(12, 46%, 10%)',
    'hsl(38, 84%, 62%)',
    `<line x1="18" y1="22" x2="18" y2="29" stroke="hsl(26, 46%, 36%)" stroke-width="2.6" stroke-linecap="round"/>
     <line x1="11" y1="17" x2="25" y2="17" stroke="hsl(30, 52%, 44%)" stroke-width="2.6" stroke-linecap="round"/>
     <circle cx="18" cy="10.5" r="3.4" fill="hsl(40, 56%, 72%)" stroke="hsl(26, 48%, 32%)" stroke-width="1.1"/>
     <rect x="13.5" y="14.5" width="9" height="9" rx="2" fill="hsl(38, 52%, 68%)" stroke="hsl(26, 48%, 32%)" stroke-width="1.1"/>
     <circle cx="18" cy="19" r="3" fill="none" stroke="hsl(354, 88%, 52%)" stroke-width="1.3"/><circle cx="18" cy="19" r="1.2" fill="hsl(354, 92%, 54%)"/>`
  ),
  sundial: wrapRelicSvg(
    'sundial',
    'hsl(38, 54%, 22%)',
    'hsl(26, 48%, 10%)',
    'hsl(46, 96%, 68%)',
    `<circle cx="18" cy="19" r="10.2" fill="hsl(36, 44%, 40%)" stroke="hsl(46, 92%, 70%)" stroke-width="1.4"/>
     <circle cx="18" cy="19" r="7.5" fill="none" stroke="hsl(46, 96%, 74%)" stroke-width="1" stroke-dasharray="1.5 2.4"/>
     <polygon points="18,9.5 23.5,20.5 18,19.5" fill="hsl(48, 100%, 74%)" stroke="hsl(28, 58%, 24%)" stroke-width="1"/>
     <polygon points="18,19.5 12.5,22 18,20.8" fill="hsl(24, 48%, 16%)" opacity="0.72"/>`
  ),
  pantograph: wrapRelicSvg(
    'pantograph',
    'hsl(38, 48%, 22%)',
    'hsl(24, 46%, 10%)',
    'hsl(44, 92%, 68%)',
    `<path d="M9 24 L16 10 L27 14 L20 28 Z" fill="none" stroke="hsl(44, 88%, 64%)" stroke-width="2" stroke-linejoin="round"/>
     <line x1="12.5" y1="17" x2="23.5" y2="21" stroke="hsl(44, 88%, 64%)" stroke-width="1.6"/>
     <circle cx="9" cy="24" r="1.8" fill="hsl(354, 90%, 56%)"/><circle cx="16" cy="10" r="1.8" fill="hsl(354, 90%, 56%)"/>
     <circle cx="27" cy="14" r="1.8" fill="hsl(354, 90%, 56%)"/><circle cx="20" cy="28" r="1.8" fill="hsl(48, 100%, 78%)"/>`
  ),
  paper_krane: wrapRelicSvg(
    'paper_krane',
    'hsl(168, 46%, 20%)',
    'hsl(214, 44%, 10%)',
    'hsl(152, 84%, 68%)',
    `<polygon points="7.5,14 17.5,16 14.5,23.5" fill="hsl(154, 38%, 88%)" stroke="hsl(164, 46%, 32%)" stroke-width="1"/>
     <polygon points="28.5,12 17.5,16 21.5,23.5" fill="hsl(156, 36%, 94%)" stroke="hsl(164, 46%, 32%)" stroke-width="1"/>
     <polygon points="14.5,23.5 18,17.5 21.5,23.5 18,26.5" fill="hsl(152, 68%, 54%)" stroke="hsl(164, 52%, 28%)" stroke-width="1"/>
     <path d="M13.5 16.5 L10 10.5 L7.5 12" fill="none" stroke="hsl(154, 42%, 90%)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`
  ),
  ninja_scroll: wrapRelicSvg(
    'ninja_scroll',
    'hsl(162, 50%, 18%)',
    'hsl(214, 48%, 9%)',
    'hsl(150, 88%, 62%)',
    `<g transform="rotate(-24 18 18)">
       <rect x="8" y="13.5" width="20" height="9" rx="2.5" fill="hsl(164, 52%, 30%)" stroke="hsl(150, 86%, 62%)" stroke-width="1.2"/>
       <rect x="7" y="12.5" width="2.8" height="11" rx="1.2" fill="hsl(42, 74%, 56%)"/><rect x="26.2" y="12.5" width="2.8" height="11" rx="1.2" fill="hsl(42, 74%, 56%)"/>
       <rect x="16.4" y="13.2" width="3.2" height="9.6" fill="hsl(354, 84%, 50%)"/>
       <circle cx="18" cy="18" r="2.2" fill="hsl(46, 98%, 74%)"/>
     </g>`
  ),
  gremlin_horn: wrapRelicSvg(
    'gremlin_horn',
    'hsl(16, 48%, 22%)',
    'hsl(352, 46%, 10%)',
    'hsl(40, 88%, 66%)',
    `<path d="M9.5 24 Q11 11 25.5 9.5 Q22 17 24.5 24 Q17 23.5 9.5 24 Z" fill="hsl(38, 48%, 80%)" stroke="hsl(24, 52%, 30%)" stroke-width="1.3"/>
     <ellipse cx="25" cy="16.5" rx="2.6" ry="7" fill="hsl(354, 68%, 24%)" stroke="hsl(44, 92%, 68%)" stroke-width="1.2"/>
     <path d="M13 18.5 Q15.5 18 16.5 23.2 M17.5 14.5 Q20 15.5 20.5 23.2" fill="none" stroke="hsl(354, 72%, 44%)" stroke-width="1.4"/>`
  ),
  singing_bowl: wrapRelicSvg(
    'singing_bowl',
    'hsl(38, 52%, 22%)',
    'hsl(24, 48%, 10%)',
    'hsl(46, 96%, 70%)',
    `<path d="M9 17.5 H27 C27 24 23 27.5 18 27.5 C13 27.5 9 24 9 17.5 Z" fill="hsl(42, 82%, 52%)" stroke="hsl(48, 98%, 78%)" stroke-width="1.3"/>
     <ellipse cx="18" cy="17.5" rx="9" ry="2.6" fill="hsl(34, 68%, 34%)" stroke="hsl(48, 96%, 76%)" stroke-width="1.1"/>
     <line x1="19" y1="17" x2="27" y2="10.5" stroke="hsl(24, 58%, 40%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M12.5 12 Q18 8.5 23.5 12" fill="none" stroke="hsl(194, 96%, 76%)" stroke-width="1.2" stroke-linecap="round"/>`
  ),
  melange: wrapRelicSvg(
    'melange',
    'hsl(282, 52%, 22%)',
    'hsl(24, 50%, 10%)',
    'hsl(296, 86%, 72%)',
    `<path d="M8.5 25.5 Q14 14 18 12 Q22 14 27.5 25.5 Z" fill="hsl(24, 82%, 44%)" stroke="hsl(42, 96%, 70%)" stroke-width="1.2"/>
     <path d="M12.5 25 Q16 17 18 15 Q20 17 23.5 25 Z" fill="hsl(288, 76%, 54%)" opacity="0.82"/>
     <circle cx="14" cy="11.5" r="1.4" fill="hsl(48, 100%, 78%)"/><circle cx="22.5" cy="11" r="1.6" fill="hsl(292, 98%, 78%)"/><circle cx="18" cy="8.5" r="1.2" fill="hsl(194, 100%, 82%)"/>`
  ),
  white_beast_statue: wrapRelicSvg(
    'white_beast_statue',
    'hsl(206, 30%, 24%)',
    'hsl(224, 34%, 10%)',
    'hsl(44, 48%, 84%)',
    `<rect x="11" y="25" width="14" height="3.2" rx="1" fill="hsl(40, 22%, 72%)" stroke="hsl(214, 24%, 36%)" stroke-width="1"/>
     <path d="M13 25 L14 16 L11.5 11.5 L15.5 12.5 L18 9 L20.5 12.5 L24.5 11.5 L22 16 L23 25 Z" fill="hsl(42, 32%, 90%)" stroke="hsl(216, 26%, 36%)" stroke-width="1.1" stroke-linejoin="round"/>
     <circle cx="16.2" cy="15" r="1" fill="hsl(148, 92%, 52%)"/><circle cx="19.8" cy="15" r="1" fill="hsl(148, 92%, 52%)"/>
     <circle cx="18" cy="20.5" r="2.3" fill="hsl(148, 86%, 50%)" stroke="hsl(48, 92%, 80%)" stroke-width="0.9"/>`
  ),
  darkstone_periapt: wrapRelicSvg(
    'darkstone_periapt',
    'hsl(274, 48%, 18%)',
    'hsl(248, 52%, 8%)',
    'hsl(292, 82%, 68%)',
    `<circle cx="18" cy="8.5" r="2" fill="none" stroke="hsl(212, 32%, 78%)" stroke-width="1.4"/>
     <polygon points="18,10.5 25,18.5 18,28.5 11,18.5" fill="hsl(268, 42%, 18%)" stroke="hsl(212, 36%, 78%)" stroke-width="1.3"/>
     <polygon points="18,13.5 22,18.5 18,24.5 14,18.5" fill="hsl(292, 84%, 52%)" opacity="0.72"/>
     <circle cx="18" cy="18.5" r="1.8" fill="hsl(354, 96%, 64%)"/>`
  ),

  // === RARE RELICS (22) ===
  captains_wheel: wrapRelicSvg(
    'captains_wheel',
    'hsl(30, 50%, 22%)',
    'hsl(206, 46%, 10%)',
    'hsl(44, 92%, 66%)',
    `<circle cx="18" cy="18" r="8.2" fill="none" stroke="hsl(28, 60%, 46%)" stroke-width="2.6"/>
     <circle cx="18" cy="18" r="8.2" fill="none" stroke="hsl(44, 90%, 68%)" stroke-width="0.9"/>
     <path d="M18 6.5 V29.5 M6.5 18 H29.5 M9.8 9.8 L26.2 26.2 M26.2 9.8 L9.8 26.2" stroke="hsl(36, 72%, 58%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="18" cy="18" r="3.2" fill="hsl(44, 94%, 64%)" stroke="hsl(24, 56%, 22%)" stroke-width="1.1"/>`
  ),
  torii: wrapRelicSvg(
    'torii',
    'hsl(6, 56%, 22%)',
    'hsl(352, 52%, 10%)',
    'hsl(12, 92%, 64%)',
    `<path d="M7.5 11.5 Q18 14.5 28.5 11.5 L27.5 14.5 H8.5 Z" fill="hsl(6, 86%, 50%)" stroke="hsl(24, 48%, 18%)" stroke-width="1"/>
     <rect x="9.5" y="16.5" width="17" height="2.4" fill="hsl(6, 84%, 48%)"/>
     <rect x="12" y="14.2" width="2.8" height="14" fill="hsl(6, 82%, 46%)" stroke="hsl(20, 48%, 20%)" stroke-width="0.8"/>
     <rect x="21.2" y="14.2" width="2.8" height="14" fill="hsl(6, 82%, 46%)" stroke="hsl(20, 48%, 20%)" stroke-width="0.8"/>
     <rect x="16.6" y="14" width="2.8" height="3.6" fill="hsl(44, 96%, 68%)"/>`
  ),
  charons_ashes: wrapRelicSvg(
    'charons_ashes',
    'hsl(14, 52%, 20%)',
    'hsl(276, 44%, 10%)',
    'hsl(32, 94%, 64%)',
    `<path d="M13 13 H23 L21.5 16 Q25 19.5 23 25 L21 27.5 H15 L13 25 Q11 19.5 14.5 16 Z" fill="hsl(24, 24%, 26%)" stroke="hsl(44, 88%, 68%)" stroke-width="1.3"/>
     <path d="M12.5 13 H23.5" stroke="hsl(44, 92%, 70%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M15 11 Q16 7.5 18 9.5 Q20 6.5 21.5 11" fill="none" stroke="hsl(22, 100%, 62%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="18" cy="21" r="2.2" fill="hsl(24, 98%, 58%)"/><circle cx="14" cy="8.5" r="1.1" fill="hsl(44, 100%, 74%)"/>`
  ),
  tungsten_rod: wrapRelicSvg(
    'tungsten_rod',
    'hsl(214, 30%, 24%)',
    'hsl(224, 34%, 10%)',
    'hsl(204, 62%, 78%)',
    `<g transform="rotate(-38 18 18)">
       <rect x="14.5" y="6.5" width="7" height="23" rx="2.2" fill="hsl(212, 18%, 60%)" stroke="hsl(206, 46%, 84%)" stroke-width="1.3"/>
       <line x1="16.6" y1="8.5" x2="16.6" y2="27.5" stroke="hsla(0, 0%, 100%, 0.72)" stroke-width="1.5" stroke-linecap="round"/>
       <line x1="14.5" y1="12" x2="21.5" y2="12" stroke="hsl(218, 28%, 32%)" stroke-width="1.1"/>
       <line x1="14.5" y1="24" x2="21.5" y2="24" stroke="hsl(218, 28%, 32%)" stroke-width="1.1"/>
     </g>`
  ),
  tough_bandages: wrapRelicSvg(
    'tough_bandages',
    'hsl(166, 38%, 20%)',
    'hsl(212, 38%, 10%)',
    'hsl(42, 62%, 78%)',
    `<ellipse cx="16.5" cy="18" rx="7.5" ry="9" fill="hsl(42, 42%, 86%)" stroke="hsl(32, 34%, 46%)" stroke-width="1.2"/>
     <ellipse cx="16.5" cy="18" rx="4.2" ry="5.5" fill="none" stroke="hsl(32, 32%, 56%)" stroke-width="1.1"/>
     <circle cx="16.5" cy="18" r="1.8" fill="hsl(30, 32%, 34%)"/>
     <path d="M21 24.5 L28 24.5 Q29.5 21 27 18.5 L22.5 18.5" fill="hsl(42, 44%, 82%)" stroke="hsl(32, 34%, 46%)" stroke-width="1.1"/>
     <path d="M24 20.5 L26 22.5 M26 20.5 L24 22.5" stroke="hsl(152, 72%, 44%)" stroke-width="1.2"/>`
  ),
  tingsha: wrapRelicSvg(
    'tingsha',
    'hsl(38, 52%, 22%)',
    'hsl(162, 42%, 10%)',
    'hsl(46, 96%, 70%)',
    `<path d="M12.5 13 Q18 7.5 23.5 13" fill="none" stroke="hsl(354, 82%, 52%)" stroke-width="1.6"/>
     <circle cx="12.5" cy="20" r="6" fill="hsl(44, 86%, 56%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.2"/>
     <circle cx="23.5" cy="20" r="6" fill="hsl(42, 82%, 52%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.2"/>
     <circle cx="12.5" cy="20" r="2" fill="hsl(32, 66%, 34%)"/><circle cx="23.5" cy="20" r="2" fill="hsl(32, 66%, 34%)"/>`
  ),
  the_specimen: wrapRelicSvg(
    'the_specimen',
    'hsl(136, 54%, 19%)',
    'hsl(172, 52%, 9%)',
    'hsl(126, 94%, 64%)',
    `<rect x="13.5" y="7" width="9" height="2.8" rx="1" fill="hsl(30, 48%, 42%)" stroke="hsl(42, 72%, 68%)" stroke-width="0.9"/>
     <rect x="11" y="10.2" width="14" height="17.8" rx="3.2" fill="hsla(138, 84%, 42%, 0.45)" stroke="hsl(152, 72%, 78%)" stroke-width="1.3"/>
     <path d="M14.5 22 Q19.5 20.5 18 16.5 Q16.5 13 20.5 13.5" fill="none" stroke="hsl(118, 100%, 72%)" stroke-width="2.4" stroke-linecap="round"/>
     <circle cx="20.5" cy="13.5" r="1.4" fill="hsl(48, 100%, 80%)"/>
     <circle cx="14.5" cy="15" r="1" fill="hsl(126, 100%, 84%)"/>`
  ),
  golden_eye: wrapRelicSvg(
    'golden_eye',
    'hsl(42, 56%, 22%)',
    'hsl(272, 48%, 10%)',
    'hsl(48, 98%, 72%)',
    `<path d="M6.5 18 Q18 8.5 29.5 18 Q18 27.5 6.5 18 Z" fill="hsl(44, 92%, 60%)" stroke="hsl(50, 100%, 84%)" stroke-width="1.3"/>
     <circle cx="18" cy="18" r="5" fill="hsl(276, 84%, 56%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.1"/>
     <circle cx="18" cy="18" r="2.2" fill="hsl(268, 66%, 12%)"/>
     <circle cx="16.8" cy="16.8" r="1" fill="hsl(0, 0%, 100%)"/>`
  ),
  mango: wrapRelicSvg(
    'mango',
    'hsl(34, 60%, 22%)',
    'hsl(12, 52%, 10%)',
    'hsl(44, 98%, 68%)',
    `<path d="M13 13 C17.5 8.5 24.5 10.5 25.5 17 C26.5 23.5 21 28 15.5 27.5 C10.5 27 9 20.5 13 13 Z" fill="hsl(38, 96%, 56%)" stroke="hsl(48, 100%, 78%)" stroke-width="1.2"/>
     <path d="M13 13 C17.5 8.5 24.5 10.5 24.8 16 C20.5 18 16 17.5 13 13 Z" fill="hsl(10, 92%, 54%)" opacity="0.72"/>
     <path d="M18.5 10 Q22 7 24.5 9.5 Q21.5 11.5 18.5 10 Z" fill="hsl(134, 74%, 46%)"/>
     <path d="M13.5 20.5 Q13.5 17 15.5 15" fill="none" stroke="hsla(52, 100%, 94%, 0.78)" stroke-width="1.4" stroke-linecap="round"/>`
  ),
  fossilized_helix: wrapRelicSvg(
    'fossilized_helix',
    'hsl(34, 44%, 22%)',
    'hsl(24, 42%, 10%)',
    'hsl(42, 74%, 68%)',
    `<circle cx="18" cy="18" r="10" fill="hsl(34, 38%, 54%)" stroke="hsl(44, 68%, 80%)" stroke-width="1.3"/>
     <path d="M18 18 C18 15.5 21 15.5 21 18 C21 21.5 15 22 14.5 18 C14 13 22.5 12 24 18 C25 23.5 17 26.5 12.5 23" fill="none" stroke="hsl(44, 64%, 88%)" stroke-width="2" stroke-linecap="round"/>`
  ),
  calipers: wrapRelicSvg(
    'calipers',
    'hsl(36, 46%, 22%)',
    'hsl(214, 42%, 10%)',
    'hsl(44, 88%, 68%)',
    `<circle cx="18" cy="9.5" r="2.6" fill="hsl(44, 92%, 64%)" stroke="hsl(26, 54%, 24%)" stroke-width="1.1"/>
     <path d="M16 11.5 Q8 18 14.5 27.5" fill="none" stroke="hsl(42, 84%, 66%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M20 11.5 Q28 18 21.5 27.5" fill="none" stroke="hsl(42, 84%, 66%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M11.5 19.5 H24.5" stroke="hsl(204, 78%, 74%)" stroke-width="1.3" stroke-dasharray="2 1.6"/>`
  ),
  incense_burner: wrapRelicSvg(
    'incense_burner',
    'hsl(192, 46%, 20%)',
    'hsl(252, 44%, 10%)',
    'hsl(186, 86%, 72%)',
    `<path d="M11 20 H25 L23 26.5 H13 Z" fill="hsl(34, 58%, 42%)" stroke="hsl(46, 90%, 68%)" stroke-width="1.2"/>
     <path d="M12 20 Q18 14 24 20 Z" fill="hsl(38, 66%, 52%)" stroke="hsl(46, 90%, 68%)" stroke-width="1.1"/>
     <path d="M18 15 Q14.5 11.5 18 9 Q21.5 7 18.5 5.5" fill="none" stroke="hsl(188, 96%, 80%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M14.5 14 Q12.5 11.5 14 9" fill="none" stroke="hsla(188, 96%, 80%, 0.65)" stroke-width="1.2" stroke-linecap="round"/>`
  ),
  dead_branch: wrapRelicSvg(
    'dead_branch',
    'hsl(28, 42%, 18%)',
    'hsl(148, 38%, 9%)',
    'hsl(38, 72%, 58%)',
    `<path d="M9 27.5 Q15 21 19 16 Q22.5 12 27 8.5" fill="none" stroke="hsl(26, 42%, 44%)" stroke-width="3" stroke-linecap="round"/>
     <path d="M16 19.5 L12.5 12.5 M20.5 15 L26.5 17" fill="none" stroke="hsl(26, 44%, 48%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M25.5 9.5 Q29 6.5 29 11 Q26.5 12 25.5 9.5 Z" fill="hsl(144, 92%, 56%)" stroke="hsl(48, 98%, 76%)" stroke-width="0.9"/>
     <circle cx="12.5" cy="12" r="1.5" fill="hsl(46, 98%, 72%)"/>`
  ),
  magic_flower: wrapRelicSvg(
    'magic_flower',
    'hsl(332, 54%, 22%)',
    'hsl(284, 48%, 10%)',
    'hsl(336, 94%, 72%)',
    `<g fill="hsl(336, 86%, 56%)" stroke="hsl(48, 96%, 78%)" stroke-width="1">
       <ellipse cx="18" cy="10.5" rx="3.5" ry="5"/><ellipse cx="25" cy="15.5" rx="5" ry="3.5" transform="rotate(-18 25 15.5)"/>
       <ellipse cx="22.5" cy="23.5" rx="3.5" ry="5" transform="rotate(-35 22.5 23.5)"/><ellipse cx="13.5" cy="23.5" rx="3.5" ry="5" transform="rotate(35 13.5 23.5)"/>
       <ellipse cx="11" cy="15.5" rx="5" ry="3.5" transform="rotate(18 11 15.5)"/>
     </g>
     <circle cx="18" cy="18" r="3.4" fill="hsl(48, 100%, 72%)" stroke="hsl(14, 86%, 48%)" stroke-width="1"/>`
  ),
  champion_belt: wrapRelicSvg(
    'champion_belt',
    'hsl(36, 54%, 22%)',
    'hsl(354, 48%, 10%)',
    'hsl(46, 96%, 70%)',
    `<rect x="7" y="14.5" width="22" height="7" rx="2" fill="hsl(16, 56%, 28%)" stroke="hsl(44, 88%, 64%)" stroke-width="1.2"/>
     <polygon points="18,11 24.5,18 18,25 11.5,18" fill="hsl(44, 94%, 60%)" stroke="hsl(26, 60%, 24%)" stroke-width="1.2"/>
     <polygon points="18,14.5 21,18 18,21.5 15,18" fill="hsl(354, 92%, 52%)" stroke="hsl(48, 100%, 84%)" stroke-width="0.9"/>`
  ),
  pocketwatch: wrapRelicSvg(
    'pocketwatch',
    'hsl(38, 52%, 22%)',
    'hsl(220, 44%, 10%)',
    'hsl(46, 94%, 70%)',
    `<circle cx="18" cy="7.5" r="2.2" fill="none" stroke="hsl(46, 92%, 70%)" stroke-width="1.4"/>
     <circle cx="18" cy="19.5" r="9.4" fill="hsl(44, 58%, 88%)" stroke="hsl(44, 90%, 62%)" stroke-width="2.2"/>
     <circle cx="18" cy="19.5" r="7" fill="none" stroke="hsl(36, 48%, 52%)" stroke-width="0.8" stroke-dasharray="1 2.6"/>
     <line x1="18" y1="19.5" x2="18" y2="14" stroke="hsl(222, 56%, 24%)" stroke-width="1.7" stroke-linecap="round"/>
     <line x1="18" y1="19.5" x2="22.5" y2="21" stroke="hsl(354, 78%, 48%)" stroke-width="1.3" stroke-linecap="round"/>
     <circle cx="18" cy="19.5" r="1.3" fill="hsl(44, 96%, 62%)"/>`
  ),
  thread_and_needle: wrapRelicSvg(
    'thread_and_needle',
    'hsl(204, 48%, 22%)',
    'hsl(232, 46%, 10%)',
    'hsl(198, 86%, 72%)',
    `<path d="M9 26 Q14 28.5 18.5 23.5 Q24 17.5 27.5 22 Q29 25 25 26.5" fill="none" stroke="hsl(196, 96%, 72%)" stroke-width="1.7" stroke-linecap="round"/>
     <line x1="9.5" y1="25.5" x2="26.5" y2="9.5" stroke="hsl(210, 32%, 88%)" stroke-width="2.2" stroke-linecap="round"/>
     <ellipse cx="24" cy="12" rx="1.6" ry="0.8" transform="rotate(-45 24 12)" fill="hsl(224, 48%, 14%)"/>`
  ),
  lizard_tail: wrapRelicSvg(
    'lizard_tail',
    'hsl(152, 52%, 20%)',
    'hsl(182, 52%, 9%)',
    'hsl(142, 92%, 62%)',
    `<path d="M9.5 24.5 Q12 11 22 10.5 Q27.5 10.5 27 16.5 Q26.5 22 20.5 21.5 Q16.5 21 17 17.5" fill="none" stroke="hsl(146, 78%, 48%)" stroke-width="4.4" stroke-linecap="round"/>
     <path d="M10.5 23.5 Q13 12 22 11.2 Q26.2 11.2 26 16" fill="none" stroke="hsl(48, 98%, 72%)" stroke-width="1.3" stroke-dasharray="2.4 2" stroke-linecap="round"/>
     <circle cx="9.5" cy="24.5" r="2.2" fill="hsl(354, 82%, 52%)" stroke="hsl(44, 90%, 76%)" stroke-width="0.9"/>`
  ),
  cloak_clasp: wrapRelicSvg(
    'cloak_clasp',
    'hsl(276, 48%, 22%)',
    'hsl(242, 46%, 10%)',
    'hsl(46, 94%, 72%)',
    `<path d="M9 18 Q13 11 18 15 Q23 11 27 18 Q23 25 18 21 Q13 25 9 18 Z" fill="hsl(44, 88%, 58%)" stroke="hsl(28, 56%, 24%)" stroke-width="1.2"/>
     <circle cx="18" cy="18" r="4.2" fill="hsl(284, 84%, 56%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.2"/>
     <circle cx="17" cy="17" r="1.2" fill="hsl(0, 0%, 100%)"/>`
  ),
  girya: wrapRelicSvg(
    'girya',
    'hsl(14, 44%, 20%)',
    'hsl(220, 34%, 10%)',
    'hsl(34, 86%, 64%)',
    `<path d="M13 15 V11.5 A5 4.5 0 0 1 23 11.5 V15" fill="none" stroke="hsl(214, 18%, 68%)" stroke-width="2.6" stroke-linecap="round"/>
     <circle cx="18" cy="21" r="7.5" fill="hsl(218, 16%, 28%)" stroke="hsl(38, 76%, 64%)" stroke-width="1.4"/>
     <path d="M13.5 19 A5 5 0 0 1 17.5 15.5" fill="none" stroke="hsla(0, 0%, 100%, 0.55)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M18 18 V24 M15 21 H21" stroke="hsl(22, 98%, 64%)" stroke-width="1.6" stroke-linecap="round"/>`
  ),
  shovel: wrapRelicSvg(
    'shovel',
    'hsl(32, 46%, 22%)',
    'hsl(22, 44%, 10%)',
    'hsl(42, 86%, 66%)',
    `<g transform="rotate(42 18 18)">
       <path d="M15 7 H21 M18 7 V18.5" stroke="hsl(28, 56%, 48%)" stroke-width="2.4" stroke-linecap="round"/>
       <path d="M13.5 18 H22.5 L21.5 25.5 L18 29 L14.5 25.5 Z" fill="hsl(210, 22%, 72%)" stroke="hsl(216, 28%, 26%)" stroke-width="1.2" stroke-linejoin="round"/>
       <line x1="18" y1="19" x2="18" y2="27" stroke="hsla(0, 0%, 100%, 0.65)" stroke-width="1.2"/>
     </g>`
  ),
  peace_pipe: wrapRelicSvg(
    'peace_pipe',
    'hsl(196, 44%, 20%)',
    'hsl(264, 42%, 10%)',
    'hsl(186, 82%, 70%)',
    `<path d="M8.5 22 L22 18.5 Q26.5 18 26.5 13.5 H22 V17.5" fill="none" stroke="hsl(24, 56%, 44%)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
     <rect x="21.5" y="13" width="5.5" height="5" rx="1.2" fill="hsl(20, 56%, 34%)" stroke="hsl(44, 86%, 68%)" stroke-width="1.1"/>
     <path d="M24 11 Q21.5 8.5 24.5 6.5 M27 10.5 Q29.5 8.5 27.5 6.5" fill="none" stroke="hsl(188, 92%, 80%)" stroke-width="1.3" stroke-linecap="round"/>`
  ),

  // === SHOP RELICS (8) ===
  membership_card: wrapRelicSvg(
    'membership_card',
    'hsl(42, 58%, 22%)',
    'hsl(226, 46%, 10%)',
    'hsl(46, 98%, 70%)',
    `<rect x="7" y="11" width="22" height="14" rx="2.4" fill="hsl(226, 44%, 22%)" stroke="hsl(46, 96%, 68%)" stroke-width="1.4"/>
     <rect x="7.6" y="14" width="20.8" height="3.2" fill="hsl(44, 92%, 60%)"/>
     <polygon points="12,11.5 13.5,8.5 15,11 16.5,8.5 18,11.5" fill="hsl(48, 100%, 74%)"/>
     <rect x="10" y="19.5" width="7" height="2.4" rx="0.8" fill="hsl(152, 86%, 60%)"/><circle cx="24" cy="20.7" r="2" fill="hsl(46, 96%, 72%)"/>`
  ),
  chemical_x: wrapRelicSvg(
    'chemical_x',
    'hsl(148, 52%, 20%)',
    'hsl(276, 48%, 10%)',
    'hsl(144, 94%, 64%)',
    `<path d="M15 7.5 H21 V12.5 L26.5 23 A4.2 4.2 0 0 1 22.8 28.5 H13.2 A4.2 4.2 0 0 1 9.5 23 L15 12.5 Z" fill="hsl(144, 84%, 40%)" stroke="hsl(152, 92%, 78%)" stroke-width="1.3"/>
     <path d="M15 19 L21 25 M21 19 L15 25" stroke="hsl(48, 100%, 80%)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="17" cy="14" r="1.2" fill="hsl(132, 100%, 82%)"/><circle cx="21" cy="9" r="1.2" fill="hsl(292, 96%, 74%)"/>`
  ),
  medical_kit: wrapRelicSvg(
    'medical_kit',
    'hsl(354, 48%, 22%)',
    'hsl(214, 38%, 10%)',
    'hsl(0, 82%, 74%)',
    `<path d="M14 11.5 V9.5 Q14 8 15.5 8 H20.5 Q22 8 22 9.5 V11.5" fill="none" stroke="hsl(212, 30%, 78%)" stroke-width="1.6"/>
     <rect x="8.5" y="11.5" width="19" height="15.5" rx="2.6" fill="hsl(42, 34%, 92%)" stroke="hsl(354, 72%, 52%)" stroke-width="1.3"/>
     <path d="M18 15 V23.5 M13.8 19.2 H22.2" stroke="hsl(354, 88%, 50%)" stroke-width="3.2" stroke-linecap="round"/>`
  ),
  orange_pellets: wrapRelicSvg(
    'orange_pellets',
    'hsl(28, 60%, 22%)',
    'hsl(198, 46%, 10%)',
    'hsl(32, 98%, 64%)',
    `<circle cx="18" cy="18" r="10.5" fill="none" stroke="hsla(194, 96%, 72%, 0.45)" stroke-width="1.2" stroke-dasharray="3 2.5"/>
     <ellipse cx="14" cy="14.5" rx="4.2" ry="2.6" transform="rotate(-24 14 14.5)" fill="hsl(28, 98%, 56%)" stroke="hsl(46, 100%, 80%)" stroke-width="1"/>
     <ellipse cx="22.5" cy="16" rx="4.2" ry="2.6" transform="rotate(20 22.5 16)" fill="hsl(22, 96%, 54%)" stroke="hsl(46, 100%, 80%)" stroke-width="1"/>
     <ellipse cx="17.5" cy="23" rx="4.4" ry="2.6" transform="rotate(-8 17.5 23)" fill="hsl(34, 100%, 58%)" stroke="hsl(48, 100%, 82%)" stroke-width="1"/>`
  ),
  lees_waffle: wrapRelicSvg(
    'lees_waffle',
    'hsl(36, 58%, 22%)',
    'hsl(22, 50%, 10%)',
    'hsl(44, 94%, 68%)',
    `<circle cx="18" cy="18" r="10.2" fill="hsl(36, 82%, 56%)" stroke="hsl(28, 64%, 34%)" stroke-width="1.4"/>
     <path d="M11.5 14 H24.5 M10.5 18 H25.5 M11.5 22 H24.5 M14 11.5 V24.5 M18 10.5 V25.5 M22 11.5 V24.5" stroke="hsl(26, 62%, 34%)" stroke-width="1.3"/>
     <rect x="15.2" y="15.2" width="5.6" height="5.6" rx="1.2" transform="rotate(14 18 18)" fill="hsl(50, 96%, 76%)" stroke="hsl(38, 76%, 46%)" stroke-width="0.9"/>`
  ),
  brimstone: wrapRelicSvg(
    'brimstone',
    'hsl(44, 62%, 22%)',
    'hsl(8, 56%, 10%)',
    'hsl(48, 100%, 66%)',
    `<polygon points="10,25.5 13,12.5 18,8 23.5,13 26.5,25.5" fill="hsl(50, 96%, 56%)" stroke="hsl(14, 94%, 52%)" stroke-width="1.3" stroke-linejoin="round"/>
     <polygon points="14,25.5 18,12 22,25.5" fill="hsl(54, 100%, 74%)"/>
     <path d="M18 15 V23 M15 20 H21 M14 23.5 Q18 26.5 22 23.5" fill="none" stroke="hsl(8, 92%, 44%)" stroke-width="1.4" stroke-linecap="round"/>`
  ),
  twisted_funnel: wrapRelicSvg(
    'twisted_funnel',
    'hsl(136, 52%, 18%)',
    'hsl(166, 52%, 9%)',
    'hsl(126, 94%, 60%)',
    `<path d="M9 11.5 Q18 8.5 27 11.5 L20.5 21 L21 28 L16.5 26.5 L15.5 21 Z" fill="hsl(148, 54%, 34%)" stroke="hsl(126, 94%, 66%)" stroke-width="1.2" stroke-linejoin="round"/>
     <ellipse cx="18" cy="11.5" rx="8.8" ry="2.6" fill="hsl(126, 92%, 50%)" stroke="hsl(118, 100%, 78%)" stroke-width="1"/>
     <path d="M13 15.5 Q18 18 22.5 15.5" fill="none" stroke="hsl(118, 100%, 74%)" stroke-width="1.2"/>
     <circle cx="18.8" cy="29.5" r="1.4" fill="hsl(124, 100%, 68%)"/>`
  ),
  clockwork_souvenir: wrapRelicSvg(
    'clockwork_souvenir',
    'hsl(38, 52%, 22%)',
    'hsl(214, 46%, 10%)',
    'hsl(46, 92%, 68%)',
    `<circle cx="14.5" cy="19.5" r="6" fill="none" stroke="hsl(44, 88%, 62%)" stroke-width="2.8" stroke-dasharray="2.6 1.8"/>
     <circle cx="14.5" cy="19.5" r="2.6" fill="hsl(200, 92%, 64%)" stroke="hsl(46, 98%, 78%)" stroke-width="1"/>
     <circle cx="23.5" cy="14" r="4.4" fill="none" stroke="hsl(206, 42%, 78%)" stroke-width="2.4" stroke-dasharray="2.2 1.6"/>
     <circle cx="23.5" cy="14" r="1.8" fill="hsl(44, 92%, 66%)"/>`
  ),

  // === EVENT RELICS (4) ===
  golden_idol_relic: wrapRelicSvg(
    'golden_idol_relic',
    'hsl(44, 62%, 24%)',
    'hsl(28, 54%, 10%)',
    'hsl(48, 100%, 72%)',
    `<rect x="11" y="25.5" width="14" height="3" rx="1" fill="hsl(36, 78%, 46%)" stroke="hsl(50, 100%, 80%)" stroke-width="1"/>
     <path d="M13.5 25.5 L14.5 16.5 L12.5 12 L18 8 L23.5 12 L21.5 16.5 L22.5 25.5 Z" fill="hsl(46, 94%, 58%)" stroke="hsl(28, 62%, 26%)" stroke-width="1.2" stroke-linejoin="round"/>
     <circle cx="16.2" cy="13.8" r="1.1" fill="hsl(26, 68%, 18%)"/><circle cx="19.8" cy="13.8" r="1.1" fill="hsl(26, 68%, 18%)"/>
     <path d="M15.5 20 H20.5 M18 17.5 V23" stroke="hsl(52, 100%, 88%)" stroke-width="1.3" stroke-linecap="round"/>`
  ),
  red_mask: wrapRelicSvg(
    'red_mask',
    'hsl(354, 62%, 22%)',
    'hsl(12, 54%, 10%)',
    'hsl(4, 94%, 62%)',
    `<path d="M9.5 13 Q18 7.5 26.5 13 L24.5 24 Q18 29 11.5 24 Z" fill="hsl(356, 86%, 46%)" stroke="hsl(44, 92%, 68%)" stroke-width="1.3"/>
     <path d="M12.5 15.5 L16.8 17.5 L13.2 19 Z M23.5 15.5 L19.2 17.5 L22.8 19 Z" fill="hsl(48, 100%, 76%)"/>
     <path d="M13.5 22.5 L15.5 21 L18 23 L20.5 21 L22.5 22.5" fill="none" stroke="hsl(46, 94%, 76%)" stroke-width="1.4" stroke-linecap="round"/>`
  ),
  enchiridion: wrapRelicSvg(
    'enchiridion',
    'hsl(352, 54%, 22%)',
    'hsl(268, 46%, 10%)',
    'hsl(46, 94%, 68%)',
    `<rect x="10" y="8.5" width="16.5" height="19" rx="2" fill="hsl(354, 68%, 36%)" stroke="hsl(46, 92%, 68%)" stroke-width="1.3"/>
     <rect x="10" y="8.5" width="3.5" height="19" rx="1" fill="hsl(350, 62%, 24%)" stroke="hsl(46, 86%, 62%)" stroke-width="0.9"/>
     <polygon points="20,13 21.3,16.5 25,17 22,19.4 23,23 20,21 17,23 18,19.4 15,17 18.7,16.5" fill="hsl(48, 100%, 76%)"/>`
  ),
  bloody_idol: wrapRelicSvg(
    'bloody_idol',
    'hsl(354, 62%, 22%)',
    'hsl(24, 50%, 10%)',
    'hsl(356, 96%, 62%)',
    `<rect x="11" y="25.5" width="14" height="3" rx="1" fill="hsl(354, 72%, 34%)" stroke="hsl(46, 92%, 68%)" stroke-width="1"/>
     <path d="M13.5 25.5 L14.5 16.5 L12.5 12 L18 8 L23.5 12 L21.5 16.5 L22.5 25.5 Z" fill="hsl(44, 86%, 54%)" stroke="hsl(354, 88%, 48%)" stroke-width="1.2" stroke-linejoin="round"/>
     <circle cx="16" cy="13.5" r="1.2" fill="hsl(354, 96%, 54%)"/><circle cx="20" cy="13.5" r="1.2" fill="hsl(354, 96%, 54%)"/>
     <path d="M16 14.8 V22.5 M20 14.8 V21.5" stroke="hsl(354, 96%, 50%)" stroke-width="1.6" stroke-linecap="round"/>`
  ),

  // === BOSS RELICS (16) ===
  black_blood: wrapRelicSvg(
    'black_blood',
    'hsl(352, 58%, 20%)',
    'hsl(276, 56%, 7%)',
    'hsl(354, 96%, 60%)',
    `<path d="M18 5.5 Q25.5 13 24.5 21.5 A6.8 6.8 0 1 1 11.5 21.5 Q10.5 13 18 5.5 Z" fill="hsl(354, 94%, 50%)" opacity="0.72"/>
     <path d="M18 8.5 Q23.2 16 22.6 22 A4.9 4.9 0 1 1 13.4 22 Q12.8 16 18 8.5 Z" fill="hsl(276, 42%, 10%)" stroke="hsl(356, 96%, 64%)" stroke-width="1.3"/>
     <path d="M15.8 19 Q16.8 15.5 18.8 14" fill="none" stroke="hsla(354, 100%, 76%, 0.78)" stroke-width="1.3" stroke-linecap="round"/>`
  ),
  ring_of_the_serpent: wrapRelicSvg(
    'ring_of_the_serpent',
    'hsl(152, 58%, 22%)',
    'hsl(182, 58%, 8%)',
    'hsl(46, 98%, 70%)',
    `<circle cx="18" cy="19.5" r="9.4" fill="none" stroke="hsl(44, 88%, 54%)" stroke-width="4.2"/>
     <circle cx="18" cy="19.5" r="9.4" fill="none" stroke="hsl(148, 96%, 60%)" stroke-width="1.8" stroke-dasharray="4 2"/>
     <path d="M11.5 11.5 Q18 5.5 24.5 11.5 L21 15.5 H15 Z" fill="hsl(146, 86%, 46%)" stroke="hsl(48, 100%, 76%)" stroke-width="1.2"/>
     <polygon points="15.5,9.5 18,6 20.5,9.5" fill="hsl(48, 100%, 76%)"/>
     <circle cx="16" cy="12" r="1.1" fill="hsl(48, 100%, 82%)"/><circle cx="20" cy="12" r="1.1" fill="hsl(48, 100%, 82%)"/>`
  ),
  holy_water: wrapRelicSvg(
    'holy_water',
    'hsl(44, 58%, 24%)',
    'hsl(228, 54%, 10%)',
    'hsl(48, 100%, 76%)',
    `<circle cx="18" cy="18" r="11" fill="none" stroke="hsla(48, 100%, 78%, 0.45)" stroke-width="1.2" stroke-dasharray="3 2.5"/>
     <path d="M18 6.5 Q25 16 24 22 A6.2 6.2 0 1 1 12 22 Q11 16 18 6.5 Z" fill="hsl(198, 98%, 68%)" stroke="hsl(48, 100%, 80%)" stroke-width="1.4"/>
     <path d="M18 11.5 L19.6 17 L24 18.5 L19.6 20 L18 25.5 L16.4 20 L12 18.5 L16.4 17 Z" fill="hsl(50, 100%, 92%)"/>`
  ),
  violet_lotus: wrapRelicSvg(
    'violet_lotus',
    'hsl(282, 56%, 22%)',
    'hsl(252, 54%, 10%)',
    'hsl(294, 94%, 74%)',
    `<path d="M18 7.5 Q22.5 14 21 22 H15 Q13.5 14 18 7.5 Z" fill="hsl(288, 86%, 62%)" stroke="hsl(48, 98%, 78%)" stroke-width="1.1"/>
     <path d="M10 15 Q15.5 15 17.5 23.5 H11.5 Q8.5 19.5 10 15 Z" fill="hsl(276, 78%, 50%)" stroke="hsl(294, 94%, 78%)" stroke-width="1"/>
     <path d="M26 15 Q20.5 15 18.5 23.5 H24.5 Q27.5 19.5 26 15 Z" fill="hsl(276, 78%, 50%)" stroke="hsl(294, 94%, 78%)" stroke-width="1"/>
     <ellipse cx="18" cy="24.5" rx="9" ry="2.4" fill="hsl(194, 94%, 64%)" opacity="0.72"/>
     <circle cx="18" cy="18" r="2.2" fill="hsl(50, 100%, 84%)"/>`
  ),
  wrist_blade: wrapRelicSvg(
    'wrist_blade',
    'hsl(164, 48%, 20%)',
    'hsl(216, 48%, 9%)',
    'hsl(150, 92%, 64%)',
    `<rect x="8.5" y="17.5" width="10.5" height="9.5" rx="2" transform="rotate(-18 13.7 22)" fill="hsl(214, 24%, 30%)" stroke="hsl(44, 86%, 66%)" stroke-width="1.2"/>
     <polygon points="16.5,19 28.5,8.5 26,15.5 19,21.5" fill="hsl(168, 42%, 90%)" stroke="hsl(148, 92%, 58%)" stroke-width="1.2"/>
     <line x1="18.5" y1="18.5" x2="27" y2="10.5" stroke="hsl(0, 0%, 100%)" stroke-width="1.2"/>`
  ),
  cursed_key: wrapRelicSvg(
    'cursed_key',
    'hsl(276, 54%, 20%)',
    'hsl(254, 56%, 8%)',
    'hsl(294, 90%, 68%)',
    `<circle cx="13" cy="15" r="5" fill="hsl(272, 46%, 24%)" stroke="hsl(44, 88%, 68%)" stroke-width="1.4"/>
     <circle cx="11.6" cy="14.5" r="1.1" fill="hsl(348, 96%, 64%)"/><circle cx="14.4" cy="14.5" r="1.1" fill="hsl(348, 96%, 64%)"/>
     <path d="M17.2 17.5 L27.5 25.5 M23 22 L21 25.5 M26 24.2 L24.5 27.5" stroke="hsl(44, 84%, 66%)" stroke-width="2.2" stroke-linecap="round"/>`
  ),
  velvet_choker: wrapRelicSvg(
    'velvet_choker',
    'hsl(342, 56%, 22%)',
    'hsl(276, 52%, 9%)',
    'hsl(346, 92%, 66%)',
    `<ellipse cx="18" cy="18.5" rx="10" ry="7.2" fill="none" stroke="hsl(346, 76%, 38%)" stroke-width="4.4"/>
     <ellipse cx="18" cy="18.5" rx="10" ry="7.2" fill="none" stroke="hsl(46, 92%, 68%)" stroke-width="1"/>
     <polygon points="18,22.5 21,25.5 18,28.5 15,25.5" fill="hsl(354, 94%, 56%)" stroke="hsl(48, 100%, 82%)" stroke-width="1"/>
     <circle cx="11" cy="22.5" r="1.2" fill="hsl(46, 98%, 74%)"/><circle cx="25" cy="22.5" r="1.2" fill="hsl(46, 98%, 74%)"/>`
  ),
  sacred_bark: wrapRelicSvg(
    'sacred_bark',
    'hsl(34, 52%, 22%)',
    'hsl(154, 46%, 10%)',
    'hsl(46, 96%, 70%)',
    `<path d="M11 8.5 Q18 6.5 25 8.5 L26.5 26.5 Q18 29 9.5 26.5 Z" fill="hsl(28, 52%, 34%)" stroke="hsl(46, 92%, 68%)" stroke-width="1.3"/>
     <path d="M18 10 V26 M18 14 L13.5 11.5 M18 17.5 L22.5 14.5 M18 21 L13.5 18.5 M18 23.5 L22.5 21" fill="none" stroke="hsl(164, 96%, 68%)" stroke-width="1.5" stroke-linecap="round"/>`
  ),
  runic_pyramid: wrapRelicSvg(
    'runic_pyramid',
    'hsl(40, 52%, 22%)',
    'hsl(220, 48%, 10%)',
    'hsl(46, 96%, 70%)',
    `<polygon points="18,7.5 28.5,26 7.5,26" fill="hsl(36, 56%, 40%)" stroke="hsl(48, 96%, 74%)" stroke-width="1.4" stroke-linejoin="round"/>
     <polygon points="18,7.5 28.5,26 18,26" fill="hsl(28, 50%, 26%)" opacity="0.72"/>
     <path d="M18 13.5 L21 19.5 H15 Z" fill="hsl(192, 100%, 72%)"/>
     <line x1="12.5" y1="23" x2="23.5" y2="23" stroke="hsl(192, 98%, 74%)" stroke-width="1.3" stroke-dasharray="2.5 1.8"/>`
  ),
  snecko_eye: wrapRelicSvg(
    'snecko_eye',
    'hsl(142, 54%, 20%)',
    'hsl(276, 48%, 10%)',
    'hsl(48, 98%, 68%)',
    `<path d="M6.5 18 Q18 7.5 29.5 18 Q18 28.5 6.5 18 Z" fill="hsl(46, 96%, 58%)" stroke="hsl(144, 92%, 62%)" stroke-width="1.4"/>
     <circle cx="18" cy="18" r="5.5" fill="hsl(136, 92%, 44%)" stroke="hsl(288, 90%, 66%)" stroke-width="1.1"/>
     <ellipse cx="18" cy="18" rx="1.6" ry="4.8" fill="hsl(260, 62%, 10%)"/>
     <circle cx="16" cy="15.8" r="1.2" fill="hsl(0, 0%, 100%)"/>`
  ),
  coffee_dripper: wrapRelicSvg(
    'coffee_dripper',
    'hsl(26, 54%, 22%)',
    'hsl(16, 50%, 10%)',
    'hsl(36, 90%, 64%)',
    `<polygon points="9.5,11 26.5,11 21,21.5 15,21.5" fill="hsl(28, 66%, 46%)" stroke="hsl(42, 92%, 70%)" stroke-width="1.3" stroke-linejoin="round"/>
     <line x1="11.5" y1="21.5" x2="24.5" y2="21.5" stroke="hsl(42, 92%, 70%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M18 23 Q20.2 26 18 28.2 Q15.8 26 18 23 Z" fill="hsl(24, 62%, 22%)" stroke="hsl(38, 92%, 68%)" stroke-width="1"/>
     <path d="M14.5 8.5 Q15.5 6.5 14.5 5.5 M20.5 8.5 Q21.5 6.5 20.5 5.5" fill="none" stroke="hsla(42, 96%, 84%, 0.72)" stroke-width="1.2" stroke-linecap="round"/>`
  ),
  philosophers_stone: wrapRelicSvg(
    'philosophers_stone',
    'hsl(352, 62%, 24%)',
    'hsl(276, 52%, 10%)',
    'hsl(46, 100%, 72%)',
    `<circle cx="18" cy="18" r="11.2" fill="none" stroke="hsla(46, 100%, 72%, 0.5)" stroke-width="1.2" stroke-dasharray="3 2.5"/>
     <polygon points="18,7 26.5,14 23.5,26.5 12.5,26.5 9.5,14" fill="hsl(352, 90%, 50%)" stroke="hsl(48, 100%, 80%)" stroke-width="1.3" stroke-linejoin="round"/>
     <polygon points="18,7 26.5,14 18,17 9.5,14" fill="hsl(8, 98%, 68%)" opacity="0.72"/>
     <polygon points="18,11.5 21.5,18 18,23.5 14.5,18" fill="hsl(48, 100%, 84%)" opacity="0.78"/>`
  ),
  runic_cube: wrapRelicSvg(
    'runic_cube',
    'hsl(12, 54%, 20%)',
    'hsl(228, 48%, 10%)',
    'hsl(34, 94%, 66%)',
    `<polygon points="18,7.5 27.5,13 27.5,23.5 18,29 8.5,23.5 8.5,13" fill="hsl(224, 34%, 20%)" stroke="hsl(44, 92%, 68%)" stroke-width="1.3"/>
     <polygon points="18,7.5 27.5,13 18,18.5 8.5,13" fill="hsl(220, 32%, 30%)"/>
     <path d="M18 18.5 V29 M18 18.5 L8.5 13 M18 18.5 L27.5 13" stroke="hsl(14, 96%, 60%)" stroke-width="1.3"/>
     <circle cx="18" cy="13" r="2" fill="hsl(24, 100%, 64%)"/><circle cx="13.2" cy="21" r="1.5" fill="hsl(46, 100%, 74%)"/><circle cx="22.8" cy="21" r="1.5" fill="hsl(46, 100%, 74%)"/>`
  ),
  hovering_kite: wrapRelicSvg(
    'hovering_kite',
    'hsl(158, 52%, 20%)',
    'hsl(198, 50%, 10%)',
    'hsl(148, 94%, 66%)',
    `<polygon points="18,6.5 27,16 18,24 9,16" fill="hsl(152, 74%, 44%)" stroke="hsl(46, 98%, 74%)" stroke-width="1.3" stroke-linejoin="round"/>
     <line x1="18" y1="6.5" x2="18" y2="24" stroke="hsl(46, 96%, 72%)" stroke-width="1.1"/><line x1="9" y1="16" x2="27" y2="16" stroke="hsl(46, 96%, 72%)" stroke-width="1.1"/>
     <path d="M18 24 Q21 26.5 16.5 28.5 Q14 29.8 18.5 30.5" fill="none" stroke="hsl(144, 96%, 70%)" stroke-width="1.6" stroke-linecap="round"/>`
  ),
  black_star: wrapRelicSvg(
    'black_star',
    'hsl(276, 52%, 20%)',
    'hsl(248, 58%, 7%)',
    'hsl(46, 96%, 70%)',
    `<polygon points="18,6.2 21.3,13.8 29.5,14.6 23.2,20 25,28.2 18,23.8 11,28.2 12.8,20 6.5,14.6 14.7,13.8" fill="hsl(262, 42%, 11%)" stroke="hsl(46, 98%, 72%)" stroke-width="1.4" stroke-linejoin="round"/>
     <polygon points="18,11.5 19.6,15.5 23.8,16 20.6,18.8 21.5,23 18,20.8 14.5,23 15.4,18.8 12.2,16 16.4,15.5" fill="hsl(288, 92%, 62%)" opacity="0.72"/>`
  ),
  slavers_collar: wrapRelicSvg(
    'slavers_collar',
    'hsl(8, 52%, 20%)',
    'hsl(222, 42%, 10%)',
    'hsl(18, 90%, 62%)',
    `<ellipse cx="18" cy="18.5" rx="9.5" ry="7.4" fill="none" stroke="hsl(214, 18%, 52%)" stroke-width="4"/>
     <ellipse cx="18" cy="18.5" rx="9.5" ry="7.4" fill="none" stroke="hsl(38, 72%, 66%)" stroke-width="0.9"/>
     <polygon points="18,8.5 19.8,11.5 16.2,11.5" fill="hsl(12, 92%, 60%)"/>
     <polygon points="7,18.5 10,16.8 10,20.2" fill="hsl(12, 92%, 60%)"/><polygon points="29,18.5 26,16.8 26,20.2" fill="hsl(12, 92%, 60%)"/>
     <rect x="15.5" y="24" width="5" height="3.2" rx="1" fill="hsl(44, 90%, 64%)" stroke="hsl(24, 54%, 22%)" stroke-width="0.9"/>`
  ),
});

const FALLBACK_RELIC_SVG = wrapRelicSvg(
  'fallback',
  'hsl(36, 46%, 22%)',
  'hsl(24, 44%, 10%)',
  'hsl(44, 88%, 68%)',
  `<polygon points="18,8 26,18 18,28 10,18" fill="hsl(42, 86%, 56%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.3"/>
   <circle cx="18" cy="18" r="3.2" fill="hsl(24, 48%, 16%)"/>`
);

export function getRelicSvg(relicId, options = {}) {
  let svg = RELIC_SVG_ART[relicId] || FALLBACK_RELIC_SVG;
  if (options.scope) {
    svg = scopeSvgIds(svg, options.scope);
  }
  if (options.className) {
    svg = svg.replace('class="relic-svg"', `class="relic-svg ${options.className}"`);
  }
  if (options.lootIcon) {
    svg = svg.replace('<svg ', '<svg data-loot-icon="relic" ');
  }
  return svg;
}

export function getUndiscoveredRelicSvg(scope = '') {
  const raw = `<svg viewBox="0 0 36 36" width="36" height="36" class="relic-svg relic-svg-undiscovered" data-relic-svg="undiscovered" aria-hidden="true"><circle cx="18" cy="18" r="16.5" fill="hsl(24, 16%, 13%)" stroke="hsla(36, 28%, 48%, 0.42)" stroke-width="1.3" stroke-dasharray="3 2.5"/><path d="M14.8 14.2 C14.8 11.8 16.4 10.6 18.2 10.6 C20.2 10.6 21.5 11.8 21.5 13.7 C21.5 15.2 20.6 16.1 19.3 17 C18.4 17.6 18 18.2 18 19.4" fill="none" stroke="hsla(38, 36%, 68%, 0.72)" stroke-width="2" stroke-linecap="round"/><circle cx="18" cy="23.4" r="1.4" fill="hsla(38, 36%, 68%, 0.72)"/></svg>`;
  return scope ? scopeSvgIds(raw, scope) : raw;
}
