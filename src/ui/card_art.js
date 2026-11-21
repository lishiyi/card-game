/**
 * Lightweight inline SVG card illustration system covering all 191 cards:
 * - 37 bespoke signature illustrations for iconic starter, special & rare cards
 * - 28 class-themed archetype illustrations mapped semantically across every remaining card
 * Uses wide framed 120×44 compositions with unique `ca-*` gradient IDs so cards look crisp
 * on both desktop and 390px mobile without bloating the standalone HTML bundle.
 */

function wrapArtSvg(key, bg1, bg2, inner, accent = 'rgba(255,255,255,0.12)') {
  return `<svg viewBox="0 0 120 44" class="card-art-svg" data-card-art="${key}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="ca-${key}-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${bg1}"/><stop offset="100%" stop-color="${bg2}"/></linearGradient></defs><rect width="120" height="44" fill="url(#ca-${key}-bg)"/><ellipse cx="60" cy="22" rx="46" ry="18" fill="${accent}"/>${inner}</svg>`;
}

export const SIGNATURE_CARD_ART = Object.freeze({
  // === P1 HEADLINE SIGNATURES ===
  double_tap: wrapArtSvg(
    'double_tap',
    'hsl(12, 62%, 22%)',
    'hsl(354, 52%, 10%)',
    `<path d="M26 34 L62 10 L70 16 L36 38 Z" fill="hsl(36, 94%, 66%)" opacity="0.55"/>
     <path d="M46 36 L86 8 L94 15 L56 40 Z" fill="hsl(42, 98%, 74%)" stroke="hsl(14, 86%, 46%)" stroke-width="1.4"/>
     <path d="M22 22 L44 12 M78 28 L98 20" stroke="hsl(44, 100%, 76%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(24, 96%, 54%, 0.24)'
  ),
  berserk: wrapArtSvg(
    'berserk',
    'hsl(354, 70%, 22%)',
    'hsl(10, 56%, 10%)',
    `<circle cx="60" cy="22" r="14" fill="hsl(354, 84%, 38%)" stroke="hsl(38, 96%, 64%)" stroke-width="1.8"/>
     <path d="M48 18 L57 22 L49 25 Z M72 18 L63 22 L71 25 Z" fill="hsl(48, 100%, 74%)"/>
     <path d="M22 14 L38 22 L24 32 M98 14 L82 22 L96 32" stroke="hsl(22, 98%, 62%)" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
    'hsla(356, 94%, 52%, 0.26)'
  ),
  phantasmal_killer: wrapArtSvg(
    'phantasmal_killer',
    'hsl(166, 54%, 18%)',
    'hsl(216, 48%, 9%)',
    `<path d="M36 38 Q40 12 60 10 Q80 12 84 38 Q72 30 60 36 Q48 30 36 38 Z" fill="hsl(162, 64%, 28%)" stroke="hsl(152, 90%, 66%)" stroke-width="1.5"/>
     <circle cx="53" cy="21" r="2.6" fill="hsl(148, 100%, 76%)"/><circle cx="67" cy="21" r="2.6" fill="hsl(148, 100%, 76%)"/>
     <path d="M22 30 L42 18 M98 30 L78 18" stroke="hsl(156, 94%, 68%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(156, 88%, 50%, 0.24)'
  ),
  die_die_die: wrapArtSvg(
    'die_die_die',
    'hsl(148, 48%, 16%)',
    'hsl(350, 52%, 10%)',
    `<path d="M20 12 L52 34 M60 8 L60 38 M100 12 L68 34" stroke="hsl(44, 88%, 74%)" stroke-width="2.6" stroke-linecap="round"/>
     <polygon points="52,34 45,25 56,28" fill="hsl(354, 92%, 62%)"/><polygon points="60,38 55,28 65,28" fill="hsl(148, 92%, 62%)"/><polygon points="68,34 64,28 75,25" fill="hsl(354, 92%, 62%)"/>`,
    'hsla(352, 86%, 52%, 0.22)'
  ),
  deus_ex_machina: wrapArtSvg(
    'deus_ex_machina',
    'hsl(276, 52%, 22%)',
    'hsl(42, 54%, 12%)',
    `<circle cx="60" cy="22" r="14" fill="hsl(44, 94%, 62%)" opacity="0.22"/>
     <polygon points="60,6 68,22 60,38 52,22" fill="hsl(46, 98%, 76%)" stroke="hsl(286, 82%, 66%)" stroke-width="1.5"/>
     <circle cx="34" cy="22" r="6" fill="hsl(46, 96%, 68%)"/><circle cx="86" cy="22" r="6" fill="hsl(46, 96%, 68%)"/>
     <path d="M20 22 H28 M92 22 H100" stroke="hsl(48, 100%, 82%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(46, 96%, 64%, 0.26)'
  ),
  master_reality: wrapArtSvg(
    'master_reality',
    'hsl(282, 56%, 22%)',
    'hsl(224, 52%, 10%)',
    `<ellipse cx="60" cy="22" rx="28" ry="12" fill="none" stroke="hsl(46, 96%, 68%)" stroke-width="1.8"/>
     <circle cx="60" cy="22" r="7" fill="hsl(288, 86%, 62%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.5"/>
     <circle cx="60" cy="22" r="2.6" fill="hsl(48, 100%, 88%)"/>
     <path d="M22 10 L32 16 M98 10 L88 16 M22 34 L32 28 M98 34 L88 28" stroke="hsl(296, 92%, 72%)" stroke-width="1.6"/>`,
    'hsla(286, 88%, 60%, 0.24)'
  ),
  through_violence: wrapArtSvg(
    'through_violence',
    'hsl(292, 62%, 22%)',
    'hsl(344, 58%, 10%)',
    `<path d="M16 32 L104 12" stroke="hsl(46, 100%, 82%)" stroke-width="3.6" stroke-linecap="round"/>
     <path d="M24 36 L98 16" stroke="hsl(312, 96%, 68%)" stroke-width="2" stroke-linecap="round"/>
     <polygon points="88,8 106,12 92,22" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(312, 92%, 58%, 0.26)'
  ),
  the_bomb: wrapArtSvg(
    'the_bomb',
    'hsl(24, 34%, 20%)',
    'hsl(12, 42%, 9%)',
    `<circle cx="56" cy="25" r="13" fill="hsl(220, 14%, 24%)" stroke="hsl(42, 76%, 64%)" stroke-width="1.8"/>
     <path d="M64 14 Q74 6 82 12" stroke="hsl(34, 64%, 64%)" stroke-width="2.2" fill="none"/>
     <circle cx="84" cy="13" r="4.5" fill="hsl(44, 100%, 68%)"/>
     <path d="M84 5 V9 M90 13 H94 M88 8 L91 6" stroke="hsl(22, 100%, 62%)" stroke-width="1.8" stroke-linecap="round"/>`,
    'hsla(32, 94%, 56%, 0.24)'
  ),
  // === IRONCLAD SIGNATURES ===
  bash: wrapArtSvg(
    'bash',
    'hsl(10, 56%, 22%)',
    'hsl(24, 48%, 12%)',
    `<path d="M26 35 Q48 16 74 10" stroke="hsl(36, 96%, 64%)" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.65"/>
     <path d="M36 36 L68 12 L78 20 L48 40 Z" fill="hsl(32, 22%, 72%)" stroke="hsl(24, 24%, 22%)" stroke-width="1.3"/>
     <circle cx="80" cy="18" r="10" fill="hsl(14, 72%, 44%)" stroke="hsl(40, 88%, 68%)" stroke-width="1.6"/>
     <path d="M72 8 L76 14 M88 9 L85 15 M92 22 L87 22 M64 26 L71 23" stroke="hsl(44, 100%, 72%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(18, 92%, 52%, 0.22)'
  ),
  demon_form: wrapArtSvg(
    'demon_form',
    'hsl(354, 68%, 22%)',
    'hsl(14, 54%, 10%)',
    `<path d="M40 38 Q42 18 60 14 Q78 18 80 38 Z" fill="hsl(356, 72%, 34%)" stroke="hsl(36, 92%, 62%)" stroke-width="1.4"/>
     <path d="M44 20 Q28 4 24 16 Q32 26 46 26 Z" fill="hsl(38, 66%, 76%)"/>
     <path d="M76 20 Q92 4 96 16 Q88 26 74 26 Z" fill="hsl(38, 66%, 76%)"/>
     <path d="M51 24 L57 27 L52 29 Z M69 24 L63 27 L68 29 Z" fill="hsl(48, 100%, 68%)"/>
     <path d="M18 38 Q22 24 28 32 Q32 22 36 38 M84 38 Q88 22 92 32 Q98 24 102 38" stroke="hsl(24, 98%, 58%)" stroke-width="2" fill="none"/>`,
    'hsla(8, 96%, 54%, 0.26)'
  ),
  corruption: wrapArtSvg(
    'corruption',
    'hsl(282, 54%, 20%)',
    'hsl(342, 48%, 10%)',
    `<path d="M20 36 Q42 10 60 22 Q78 34 100 10" stroke="hsl(292, 86%, 64%)" stroke-width="2.4" fill="none" opacity="0.7"/>
     <polygon points="60,6 74,22 60,38 46,22" fill="hsl(276, 56%, 24%)" stroke="hsl(312, 92%, 68%)" stroke-width="1.8"/>
     <path d="M52 20 Q60 12 68 20 Q60 32 52 20 Z" fill="hsl(338, 92%, 58%)"/>
     <circle cx="34" cy="14" r="2.2" fill="hsl(296, 94%, 72%)"/><circle cx="88" cy="30" r="2.6" fill="hsl(342, 92%, 64%)"/>`,
    'hsla(296, 86%, 54%, 0.22)'
  ),
  barricade: wrapArtSvg(
    'barricade',
    'hsl(214, 42%, 22%)',
    'hsl(224, 38%, 11%)',
    `<rect x="18" y="14" width="84" height="24" rx="2" fill="hsl(214, 24%, 34%)" stroke="hsl(40, 74%, 64%)" stroke-width="1.6"/>
     <path d="M18 14 L18 8 L30 8 L30 14 L44 14 L44 8 L56 8 L56 14 L68 14 L68 8 L80 8 L80 14 L92 14 L92 8 L102 8 L102 14" fill="hsl(214, 26%, 42%)" stroke="hsl(40, 72%, 62%)" stroke-width="1.4"/>
     <path d="M60 16 L71 20 V29 C71 34 66 37 60 39 C54 37 49 34 49 29 V20 Z" fill="hsl(204, 72%, 44%)" stroke="hsl(44, 92%, 72%)" stroke-width="1.5"/>`,
    'hsla(204, 86%, 58%, 0.2)'
  ),
  reaper: wrapArtSvg(
    'reaper',
    'hsl(352, 62%, 18%)',
    'hsl(268, 38%, 10%)',
    `<line x1="34" y1="39" x2="78" y2="8" stroke="hsl(32, 34%, 58%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M24 12 Q58 2 84 12 Q56 14 34 26 Z" fill="hsl(354, 90%, 60%)" stroke="hsl(42, 90%, 78%)" stroke-width="1.3"/>
     <circle cx="88" cy="28" r="4" fill="hsl(354, 92%, 58%)" opacity="0.8"/>
     <circle cx="96" cy="20" r="2.5" fill="hsl(354, 92%, 66%)" opacity="0.7"/>
     <circle cx="78" cy="34" r="2.2" fill="hsl(148, 86%, 58%)" opacity="0.85"/>`,
    'hsla(352, 92%, 52%, 0.24)'
  ),
  bludgeon: wrapArtSvg(
    'bludgeon',
    'hsl(16, 56%, 22%)',
    'hsl(26, 44%, 10%)',
    `<line x1="26" y1="36" x2="62" y2="16" stroke="hsl(28, 42%, 44%)" stroke-width="4.2" stroke-linecap="round"/>
     <rect x="58" y="6" width="26" height="18" rx="3" transform="rotate(-24 71 15)" fill="hsl(28, 20%, 62%)" stroke="hsl(42, 84%, 66%)" stroke-width="1.6"/>
     <path d="M78 36 L94 26 M84 39 L102 32 M68 38 L78 30" stroke="hsl(36, 98%, 64%)" stroke-width="2.2" stroke-linecap="round"/>`,
    'hsla(24, 94%, 52%, 0.24)'
  ),
  impervious: wrapArtSvg(
    'impervious',
    'hsl(206, 54%, 22%)',
    'hsl(222, 46%, 11%)',
    `<path d="M60 5 L82 12 V24 C82 33 72 38 60 41 C48 38 38 33 38 24 V12 Z" fill="hsl(204, 68%, 38%)" stroke="hsl(46, 92%, 72%)" stroke-width="2"/>
     <path d="M60 10 L74 15 V24 C74 30 68 34 60 36 C52 34 46 30 46 24 V15 Z" fill="hsl(196, 86%, 56%)" opacity="0.65"/>
     <path d="M60 13 V33 M50 22 H70" stroke="hsl(48, 100%, 84%)" stroke-width="2.2" stroke-linecap="round"/>`,
    'hsla(196, 94%, 62%, 0.24)'
  ),
  offering: wrapArtSvg(
    'offering',
    'hsl(354, 64%, 20%)',
    'hsl(12, 54%, 10%)',
    `<path d="M44 36 Q60 30 76 36 L72 40 H48 Z" fill="hsl(42, 74%, 54%)"/>
     <path d="M60 7 Q72 20 60 31 Q48 20 60 7 Z" fill="hsl(356, 92%, 54%)" stroke="hsl(44, 96%, 72%)" stroke-width="1.5"/>
     <circle cx="32" cy="22" r="5" fill="hsl(44, 96%, 64%)" opacity="0.85"/>
     <circle cx="88" cy="22" r="5" fill="hsl(44, 96%, 64%)" opacity="0.85"/>
     <path d="M32 14 V30 M88 14 V30" stroke="hsl(48, 100%, 82%)" stroke-width="1.4"/>`,
    'hsla(356, 94%, 52%, 0.24)'
  ),
  fiend_fire: wrapArtSvg(
    'fiend_fire',
    'hsl(14, 72%, 22%)',
    'hsl(352, 58%, 10%)',
    `<path d="M22 40 Q30 16 42 28 Q50 4 62 24 Q72 6 82 26 Q92 14 98 40 Z" fill="hsl(20, 96%, 52%)" stroke="hsl(46, 100%, 72%)" stroke-width="1.4"/>
     <path d="M36 40 Q46 22 60 16 Q74 22 84 40 Z" fill="hsl(44, 100%, 66%)" opacity="0.85"/>
     <circle cx="52" cy="28" r="2.4" fill="hsl(352, 82%, 18%)"/><circle cx="68" cy="28" r="2.4" fill="hsl(352, 82%, 18%)"/>`,
    'hsla(28, 100%, 56%, 0.28)'
  ),
  immolate: wrapArtSvg(
    'immolate',
    'hsl(22, 74%, 24%)',
    'hsl(6, 62%, 10%)',
    `<circle cx="60" cy="22" r="16" fill="hsl(18, 96%, 52%)" opacity="0.85"/>
     <circle cx="60" cy="22" r="9" fill="hsl(48, 100%, 74%)"/>
     <path d="M18 22 H36 M84 22 H102 M60 3 V11 M60 33 V41 M30 8 L42 15 M90 8 L78 15 M30 36 L42 29 M90 36 L78 29" stroke="hsl(44, 100%, 72%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(32, 100%, 58%, 0.28)'
  ),
  feed: wrapArtSvg(
    'feed',
    'hsl(352, 62%, 20%)',
    'hsl(12, 48%, 10%)',
    `<path d="M26 14 Q60 4 94 14 Q76 22 60 20 Q44 22 26 14 Z" fill="hsl(356, 72%, 44%)"/>
     <path d="M26 32 Q60 42 94 32 Q76 24 60 26 Q44 24 26 32 Z" fill="hsl(356, 72%, 44%)"/>
     <polygon points="36,15 41,24 46,15" fill="hsl(44, 62%, 92%)"/><polygon points="55,14 60,24 65,14" fill="hsl(44, 62%, 92%)"/><polygon points="74,15 79,24 84,15" fill="hsl(44, 62%, 92%)"/>
     <polygon points="45,32 50,23 55,32" fill="hsl(44, 62%, 92%)"/><polygon points="65,32 70,23 75,32" fill="hsl(44, 62%, 92%)"/>`,
    'hsla(356, 90%, 54%, 0.24)'
  ),

  // === SILENT SIGNATURES ===
  neutralize: wrapArtSvg(
    'neutralize',
    'hsl(162, 52%, 18%)',
    'hsl(186, 46%, 10%)',
    `<path d="M20 34 Q54 12 100 12" stroke="hsl(148, 92%, 62%)" stroke-width="2.4" fill="none" opacity="0.65"/>
     <polygon points="32,32 82,12 92,16 42,36" fill="hsl(164, 34%, 84%)" stroke="hsl(152, 82%, 48%)" stroke-width="1.3"/>
     <circle cx="92" cy="14" r="3" fill="hsl(136, 98%, 62%)"/>`,
    'hsla(148, 90%, 52%, 0.2)'
  ),
  wraith_form: wrapArtSvg(
    'wraith_form',
    'hsl(176, 54%, 18%)',
    'hsl(228, 48%, 10%)',
    `<path d="M38 40 Q42 10 60 8 Q78 10 82 40 Q70 34 60 40 Q50 34 38 40 Z" fill="hsla(166, 86%, 64%, 0.42)" stroke="hsl(166, 94%, 74%)" stroke-width="1.8"/>
     <circle cx="53" cy="21" r="2.6" fill="hsl(156, 100%, 84%)"/><circle cx="67" cy="21" r="2.6" fill="hsl(156, 100%, 84%)"/>
     <path d="M22 24 Q30 16 36 24 M84 24 Q90 16 98 24" stroke="hsl(172, 92%, 70%)" stroke-width="1.8" fill="none" opacity="0.7"/>`,
    'hsla(168, 94%, 60%, 0.24)'
  ),
  catalyst: wrapArtSvg(
    'catalyst',
    'hsl(136, 62%, 18%)',
    'hsl(164, 52%, 10%)',
    `<path d="M53 8 H67 V15 L78 33 A7 7 0 0 1 72 40 H48 A7 7 0 0 1 42 33 L53 15 Z" fill="hsl(134, 86%, 44%)" stroke="hsl(126, 98%, 74%)" stroke-width="1.6"/>
     <circle cx="56" cy="29" r="3" fill="hsl(118, 100%, 80%)"/><circle cx="66" cy="25" r="2.2" fill="hsl(118, 100%, 80%)"/>
     <path d="M28 22 H40 M34 16 V28 M80 22 H92 M86 16 V28" stroke="hsl(128, 98%, 68%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(130, 96%, 52%, 0.26)'
  ),
  corpse_explosion: wrapArtSvg(
    'corpse_explosion',
    'hsl(142, 54%, 18%)',
    'hsl(282, 46%, 11%)',
    `<polygon points="60,5 68,16 84,12 74,23 88,33 70,31 60,41 50,31 32,33 46,23 36,12 52,16" fill="hsl(132, 84%, 48%)" stroke="hsl(48, 98%, 70%)" stroke-width="1.5"/>
     <circle cx="60" cy="23" r="6" fill="hsl(288, 62%, 20%)"/><circle cx="58" cy="22" r="1.4" fill="hsl(126, 100%, 76%)"/><circle cx="62" cy="22" r="1.4" fill="hsl(126, 100%, 76%)"/>`,
    'hsla(134, 92%, 52%, 0.24)'
  ),
  glass_knife: wrapArtSvg(
    'glass_knife',
    'hsl(192, 54%, 20%)',
    'hsl(212, 48%, 11%)',
    `<polygon points="24,33 88,8 96,15 36,37" fill="hsl(192, 92%, 76%)" stroke="hsl(0, 0%, 100%)" stroke-width="1.4"/>
     <path d="M52 22 L62 18 M68 16 L78 12" stroke="hsl(0, 0%, 100%)" stroke-width="1.8" opacity="0.85"/>
     <polygon points="74,30 82,26 80,35" fill="hsl(192, 96%, 80%)" opacity="0.75"/>
     <polygon points="34,14 41,11 39,19" fill="hsl(192, 96%, 80%)" opacity="0.7"/>`,
    'hsla(192, 96%, 72%, 0.24)'
  ),
  blade_dance: wrapArtSvg(
    'blade_dance',
    'hsl(158, 52%, 18%)',
    'hsl(176, 46%, 10%)',
    `<polygon points="24,34 40,8 44,12 30,36" fill="hsl(164, 38%, 88%)" stroke="hsl(148, 86%, 58%)" stroke-width="1.2"/>
     <polygon points="46,36 56,7 62,10 52,37" fill="hsl(164, 38%, 88%)" stroke="hsl(148, 86%, 58%)" stroke-width="1.2"/>
     <polygon points="68,37 74,7 80,10 74,36" fill="hsl(164, 38%, 88%)" stroke="hsl(148, 86%, 58%)" stroke-width="1.2"/>
     <polygon points="88,35 96,10 101,14 94,37" fill="hsl(164, 38%, 88%)" stroke="hsl(148, 86%, 58%)" stroke-width="1.2"/>`,
    'hsla(154, 90%, 56%, 0.22)'
  ),
  noxious_fumes: wrapArtSvg(
    'noxious_fumes',
    'hsl(140, 56%, 18%)',
    'hsl(166, 48%, 10%)',
    `<circle cx="38" cy="28" r="12" fill="hsla(132, 86%, 50%, 0.45)"/>
     <circle cx="58" cy="20" r="14" fill="hsla(138, 90%, 54%, 0.5)"/>
     <circle cx="80" cy="27" r="12" fill="hsla(128, 86%, 48%, 0.45)"/>
     <circle cx="54" cy="18" r="3" fill="hsl(118, 100%, 78%)"/><circle cx="72" cy="22" r="2.4" fill="hsl(118, 100%, 78%)"/>`,
    'hsla(134, 92%, 52%, 0.24)'
  ),
  after_image: wrapArtSvg(
    'after_image',
    'hsl(168, 52%, 18%)',
    'hsl(198, 48%, 10%)',
    `<path d="M26 38 Q32 14 42 12 Q52 14 56 38 Z" fill="hsla(164, 82%, 58%, 0.28)" stroke="hsl(164, 86%, 64%)" stroke-width="1.2"/>
     <path d="M46 38 Q52 12 62 10 Q72 12 76 38 Z" fill="hsla(164, 86%, 60%, 0.48)" stroke="hsl(164, 92%, 72%)" stroke-width="1.4"/>
     <path d="M66 38 Q72 10 82 8 Q92 10 96 38 Z" fill="hsl(164, 68%, 36%)" stroke="hsl(152, 98%, 74%)" stroke-width="1.8"/>`,
    'hsla(164, 90%, 58%, 0.22)'
  ),
  adrenaline: wrapArtSvg(
    'adrenaline',
    'hsl(148, 58%, 18%)',
    'hsl(40, 52%, 12%)',
    `<polygon points="66,4 42,24 58,24 52,40 78,19 62,19" fill="hsl(48, 100%, 64%)" stroke="hsl(142, 96%, 66%)" stroke-width="1.5"/>
     <path d="M20 22 H34 M86 22 H100" stroke="hsl(142, 94%, 64%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(56, 98%, 56%, 0.24)'
  ),
  alchemize: wrapArtSvg(
    'alchemize',
    'hsl(164, 54%, 18%)',
    'hsl(272, 46%, 12%)',
    `<path d="M38 14 H46 V20 L52 34 A4 4 0 0 1 48 39 H36 A4 4 0 0 1 32 34 L38 20 Z" fill="hsl(146, 86%, 48%)" stroke="hsl(44, 90%, 72%)" stroke-width="1.3"/>
     <path d="M74 14 H82 V20 L88 34 A4 4 0 0 1 84 39 H72 A4 4 0 0 1 68 34 L74 20 Z" fill="hsl(286, 84%, 58%)" stroke="hsl(44, 90%, 72%)" stroke-width="1.3"/>
     <path d="M56 16 L60 8 L64 16 L60 22 Z" fill="hsl(46, 100%, 72%)"/>`,
    'hsla(176, 90%, 56%, 0.22)'
  ),

  // === WATCHER SIGNATURES ===
  eruption: wrapArtSvg(
    'eruption',
    'hsl(348, 66%, 22%)',
    'hsl(18, 58%, 10%)',
    `<path d="M24 40 L44 22 L60 26 L76 22 L96 40 Z" fill="hsl(350, 48%, 22%)" stroke="hsl(18, 86%, 58%)" stroke-width="1.4"/>
     <path d="M46 28 Q50 8 60 4 Q70 8 74 28 Q60 20 46 28 Z" fill="hsl(16, 98%, 56%)" stroke="hsl(48, 100%, 76%)" stroke-width="1.4"/>
     <circle cx="40" cy="14" r="2.4" fill="hsl(46, 100%, 72%)"/><circle cx="80" cy="12" r="2.2" fill="hsl(354, 98%, 68%)"/>`,
    'hsla(12, 98%, 54%, 0.28)'
  ),
  vigilance: wrapArtSvg(
    'vigilance',
    'hsl(198, 62%, 20%)',
    'hsl(224, 52%, 11%)',
    `<ellipse cx="60" cy="30" rx="38" ry="8" fill="none" stroke="hsl(194, 92%, 68%)" stroke-width="1.6" opacity="0.7"/>
     <ellipse cx="60" cy="30" rx="22" ry="4.5" fill="none" stroke="hsl(190, 98%, 78%)" stroke-width="1.4"/>
     <path d="M60 7 Q70 17 60 26 Q50 17 60 7 Z" fill="hsl(192, 92%, 62%)" stroke="hsl(48, 96%, 80%)" stroke-width="1.5"/>`,
    'hsla(194, 94%, 60%, 0.24)'
  ),
  blasphemy: wrapArtSvg(
    'blasphemy',
    'hsl(288, 64%, 20%)',
    'hsl(344, 58%, 10%)',
    `<circle cx="60" cy="22" r="15" fill="none" stroke="hsl(46, 100%, 68%)" stroke-width="2.2" stroke-dasharray="6 3"/>
     <polygon points="60,5 68,22 60,39 52,22" fill="hsl(352, 92%, 58%)" stroke="hsl(48, 100%, 78%)" stroke-width="1.5"/>
     <path d="M22 22 L42 22 M78 22 L98 22" stroke="hsl(296, 94%, 72%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(318, 96%, 56%, 0.28)'
  ),
  deva_form: wrapArtSvg(
    'deva_form',
    'hsl(276, 56%, 22%)',
    'hsl(42, 54%, 14%)',
    `<circle cx="60" cy="22" r="16" fill="hsla(46, 100%, 66%, 0.25)" stroke="hsl(46, 100%, 72%)" stroke-width="1.8"/>
     <path d="M60 4 L64 16 L78 14 L67 23 L74 36 L60 28 L46 36 L53 23 L42 14 L56 16 Z" fill="hsl(48, 100%, 70%)" stroke="hsl(288, 76%, 58%)" stroke-width="1.2"/>
     <circle cx="24" cy="22" r="4" fill="hsl(290, 92%, 70%)"/><circle cx="96" cy="22" r="4" fill="hsl(290, 92%, 70%)"/>`,
    'hsla(46, 100%, 60%, 0.26)'
  ),
  ragnarok: wrapArtSvg(
    'ragnarok',
    'hsl(268, 56%, 18%)',
    'hsl(12, 62%, 12%)',
    `<polygon points="34,4 22,22 30,22 24,39 42,18 33,18" fill="hsl(46, 100%, 68%)"/>
     <polygon points="62,3 48,23 58,23 52,41 72,18 62,18" fill="hsl(296, 96%, 72%)" stroke="hsl(48, 100%, 80%)" stroke-width="1.2"/>
     <polygon points="90,5 78,22 86,22 80,39 98,18 89,18" fill="hsl(14, 98%, 62%)"/>`,
    'hsla(296, 94%, 60%, 0.26)'
  ),
  vault: wrapArtSvg(
    'vault',
    'hsl(226, 56%, 20%)',
    'hsl(276, 52%, 12%)',
    `<path d="M18 34 Q60 2 102 34" stroke="hsl(46, 98%, 70%)" stroke-width="2.6" stroke-dasharray="5 3" fill="none"/>
     <circle cx="60" cy="22" r="12" fill="hsl(272, 62%, 30%)" stroke="hsl(46, 96%, 72%)" stroke-width="1.8"/>
     <path d="M60 14 V22 L66 25" stroke="hsl(192, 100%, 76%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(46, 96%, 62%, 0.22)'
  ),
  judgment: wrapArtSvg(
    'judgment',
    'hsl(266, 54%, 20%)',
    'hsl(38, 48%, 12%)',
    `<line x1="60" y1="6" x2="60" y2="38" stroke="hsl(46, 94%, 68%)" stroke-width="2.2"/>
     <line x1="30" y1="15" x2="90" y2="15" stroke="hsl(46, 94%, 68%)" stroke-width="2"/>
     <path d="M24 27 Q32 34 40 27 Z" fill="hsl(292, 86%, 66%)" stroke="hsl(46, 94%, 72%)" stroke-width="1.2"/>
     <path d="M80 27 Q88 34 96 27 Z" fill="hsl(292, 86%, 66%)" stroke="hsl(46, 94%, 72%)" stroke-width="1.2"/>
     <line x1="32" y1="15" x2="32" y2="27" stroke="hsl(46, 86%, 72%)" stroke-width="1.2"/>
     <line x1="88" y1="15" x2="88" y2="27" stroke="hsl(46, 86%, 72%)" stroke-width="1.2"/>`,
    'hsla(46, 96%, 62%, 0.22)'
  ),
  lesson_learned: wrapArtSvg(
    'lesson_learned',
    'hsl(276, 52%, 20%)',
    'hsl(152, 48%, 12%)',
    `<path d="M26 32 L58 28 V10 L26 14 Z M94 32 L62 28 V10 L94 14 Z" fill="hsl(42, 46%, 82%)" stroke="hsl(276, 52%, 44%)" stroke-width="1.4"/>
     <path d="M60 4 L64 12 L72 13 L66 19 L68 27 L60 22 L52 27 L54 19 L48 13 L56 12 Z" fill="hsl(148, 92%, 62%)" stroke="hsl(46, 98%, 74%)" stroke-width="1.2"/>`,
    'hsla(148, 90%, 56%, 0.22)'
  ),
  alpha: wrapArtSvg(
    'alpha',
    'hsl(274, 58%, 22%)',
    'hsl(224, 52%, 12%)',
    `<circle cx="60" cy="22" r="15" fill="none" stroke="hsl(292, 88%, 68%)" stroke-width="1.8"/>
     <text x="60" y="29" text-anchor="middle" font-size="22" font-weight="800" fill="hsl(46, 100%, 72%)" font-family="serif">α</text>`,
    'hsla(290, 92%, 62%, 0.24)'
  ),
  beta: wrapArtSvg(
    'beta',
    'hsl(282, 60%, 22%)',
    'hsl(240, 54%, 12%)',
    `<circle cx="60" cy="22" r="15" fill="none" stroke="hsl(46, 96%, 68%)" stroke-width="1.8"/>
     <text x="60" y="29" text-anchor="middle" font-size="22" font-weight="800" fill="hsl(294, 96%, 76%)" font-family="serif">β</text>`,
    'hsla(294, 92%, 64%, 0.26)'
  ),
  omega: wrapArtSvg(
    'omega',
    'hsl(344, 62%, 20%)',
    'hsl(272, 58%, 12%)',
    `<circle cx="60" cy="22" r="16" fill="hsla(46, 100%, 62%, 0.22)" stroke="hsl(46, 100%, 74%)" stroke-width="2"/>
     <text x="60" y="29" text-anchor="middle" font-size="22" font-weight="800" fill="hsl(48, 100%, 78%)" font-family="serif">Ω</text>`,
    'hsla(46, 100%, 62%, 0.3)'
  ),
  mental_fortress: wrapArtSvg(
    'mental_fortress',
    'hsl(258, 52%, 22%)',
    'hsl(198, 52%, 12%)',
    `<polygon points="60,5 86,16 80,37 40,37 34,16" fill="hsl(262, 52%, 30%)" stroke="hsl(194, 92%, 68%)" stroke-width="1.8"/>
     <circle cx="60" cy="23" r="8" fill="hsl(46, 96%, 66%)" opacity="0.85"/>
     <circle cx="60" cy="23" r="3.5" fill="hsl(264, 58%, 22%)"/>`,
    'hsla(196, 92%, 62%, 0.22)'
  ),
  miracle: wrapArtSvg(
    'miracle',
    'hsl(44, 66%, 24%)',
    'hsl(278, 48%, 14%)',
    `<path d="M60 4 L64 18 L80 22 L64 26 L60 40 L56 26 L40 22 L56 18 Z" fill="hsl(48, 100%, 76%)" stroke="hsl(0, 0%, 100%)" stroke-width="1.2"/>
     <circle cx="32" cy="14" r="2.2" fill="hsl(48, 100%, 84%)"/><circle cx="88" cy="30" r="2.2" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(48, 100%, 70%, 0.3)'
  ),

  // === COLORLESS SIGNATURES ===
  apotheosis: wrapArtSvg(
    'apotheosis',
    'hsl(42, 62%, 24%)',
    'hsl(214, 44%, 14%)',
    `<path d="M60 4 L67 16 L82 14 L71 24 L76 38 L60 30 L44 38 L49 24 L38 14 L53 16 Z" fill="hsl(48, 100%, 74%)" stroke="hsl(0, 0%, 100%)" stroke-width="1.4"/>
     <path d="M22 36 Q60 12 98 36" fill="none" stroke="hsl(148, 92%, 68%)" stroke-width="1.8" opacity="0.8"/>`,
    'hsla(48, 100%, 70%, 0.28)'
  ),
  hand_of_greed: wrapArtSvg(
    'hand_of_greed',
    'hsl(40, 64%, 22%)',
    'hsl(26, 52%, 11%)',
    `<circle cx="44" cy="24" r="9" fill="hsl(46, 94%, 56%)" stroke="hsl(48, 100%, 80%)" stroke-width="1.6"/>
     <circle cx="62" cy="20" r="10" fill="hsl(46, 96%, 60%)" stroke="hsl(48, 100%, 84%)" stroke-width="1.8"/>
     <circle cx="78" cy="26" r="8" fill="hsl(42, 88%, 50%)" stroke="hsl(48, 100%, 78%)" stroke-width="1.5"/>
     <text x="62" y="25" text-anchor="middle" font-size="13" font-weight="800" fill="hsl(28, 62%, 24%)">G</text>`,
    'hsla(46, 98%, 58%, 0.26)'
  ),
  apparition: wrapArtSvg(
    'apparition',
    'hsl(214, 44%, 20%)',
    'hsl(240, 42%, 10%)',
    `<path d="M40 39 Q44 10 60 8 Q76 10 80 39 Q70 33 60 39 Q50 33 40 39 Z" fill="hsla(210, 62%, 86%, 0.35)" stroke="hsl(206, 86%, 84%)" stroke-width="1.6"/>
     <circle cx="54" cy="20" r="2.2" fill="hsl(0, 0%, 100%)"/><circle cx="66" cy="20" r="2.2" fill="hsl(0, 0%, 100%)"/>`,
    'hsla(206, 84%, 78%, 0.22)'
  ),
});

export const CARD_THEME_ART = Object.freeze({
  // === IRONCLAD THEMES ===
  iron_slash: wrapArtSvg(
    'iron_slash',
    'hsl(8, 54%, 21%)',
    'hsl(20, 44%, 10%)',
    `<path d="M22 36 Q56 14 96 10" stroke="hsl(28, 96%, 64%)" stroke-width="3.2" stroke-linecap="round" fill="none" opacity="0.72"/>
     <polygon points="34,34 80,10 86,15 40,38" fill="hsl(36, 26%, 82%)" stroke="hsl(14, 46%, 32%)" stroke-width="1.3"/>
     <rect x="28" y="31" width="14" height="4" rx="1.5" transform="rotate(-28 35 33)" fill="hsl(42, 82%, 58%)"/>`,
    'hsla(14, 88%, 52%, 0.2)'
  ),
  iron_heavy: wrapArtSvg(
    'iron_heavy',
    'hsl(4, 58%, 22%)',
    'hsl(18, 48%, 10%)',
    `<polygon points="28,36 74,8 88,18 44,40" fill="hsl(32, 24%, 78%)" stroke="hsl(40, 76%, 60%)" stroke-width="1.5"/>
     <path d="M64 12 L94 6 M78 24 L100 22 M70 32 L88 36" stroke="hsl(36, 98%, 64%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(16, 92%, 52%, 0.24)'
  ),
  iron_whirlwind: wrapArtSvg(
    'iron_whirlwind',
    'hsl(12, 54%, 20%)',
    'hsl(28, 46%, 10%)',
    `<ellipse cx="60" cy="22" rx="40" ry="12" fill="none" stroke="hsl(34, 96%, 66%)" stroke-width="2.4" stroke-dasharray="22 8"/>
     <ellipse cx="60" cy="22" rx="24" ry="7" fill="none" stroke="hsl(14, 94%, 60%)" stroke-width="2.2" stroke-dasharray="14 6"/>
     <circle cx="60" cy="22" r="5" fill="hsl(44, 100%, 72%)"/>`,
    'hsla(24, 94%, 54%, 0.22)'
  ),
  iron_shield: wrapArtSvg(
    'iron_shield',
    'hsl(214, 42%, 20%)',
    'hsl(226, 40%, 10%)',
    `<path d="M60 6 L78 13 V24 C78 32 70 37 60 40 C50 37 42 32 42 24 V13 Z" fill="hsl(214, 46%, 36%)" stroke="hsl(42, 78%, 66%)" stroke-width="1.8"/>
     <path d="M60 12 V33 M50 22 H70" stroke="hsl(204, 86%, 76%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(206, 84%, 58%, 0.2)'
  ),
  iron_flame: wrapArtSvg(
    'iron_flame',
    'hsl(12, 64%, 22%)',
    'hsl(354, 52%, 10%)',
    `<path d="M60 5 Q76 18 68 35 Q60 39 52 35 Q44 18 60 5 Z" fill="hsl(20, 96%, 54%)" stroke="hsl(46, 100%, 72%)" stroke-width="1.4"/>
     <path d="M60 15 Q68 23 63 34 Q60 36 57 34 Q52 23 60 15 Z" fill="hsl(48, 100%, 72%)"/>
     <path d="M32 34 L38 18 L44 34 M76 34 L82 18 L88 34" stroke="hsl(36, 94%, 62%)" stroke-width="1.8" fill="none" opacity="0.6"/>`,
    'hsla(20, 96%, 54%, 0.24)'
  ),
  iron_blood: wrapArtSvg(
    'iron_blood',
    'hsl(352, 62%, 20%)',
    'hsl(8, 48%, 10%)',
    `<path d="M60 6 Q72 20 60 34 Q48 20 60 6 Z" fill="hsl(354, 88%, 50%)" stroke="hsl(40, 86%, 70%)" stroke-width="1.5"/>
     <path d="M36 18 Q42 26 36 33 Q30 26 36 18 Z" fill="hsl(354, 84%, 44%)" opacity="0.75"/>
     <path d="M84 18 Q90 26 84 33 Q78 26 84 18 Z" fill="hsl(354, 84%, 44%)" opacity="0.75"/>`,
    'hsla(354, 90%, 50%, 0.22)'
  ),
  iron_exhaust: wrapArtSvg(
    'iron_exhaust',
    'hsl(282, 42%, 18%)',
    'hsl(12, 44%, 10%)',
    `<path d="M30 36 Q46 16 60 22 Q74 28 90 10" stroke="hsl(28, 92%, 60%)" stroke-width="2" stroke-dasharray="4 3" fill="none"/>
     <polygon points="60,8 73,22 60,36 47,22" fill="hsl(286, 46%, 28%)" stroke="hsl(34, 92%, 64%)" stroke-width="1.6"/>
     <circle cx="38" cy="14" r="2" fill="hsl(36, 96%, 68%)"/><circle cx="82" cy="30" r="2.2" fill="hsl(292, 88%, 70%)"/>`,
    'hsla(292, 74%, 50%, 0.2)'
  ),
  iron_debuff: wrapArtSvg(
    'iron_debuff',
    'hsl(22, 54%, 20%)',
    'hsl(350, 44%, 10%)',
    `<circle cx="60" cy="22" r="14" fill="none" stroke="hsl(34, 92%, 60%)" stroke-width="2" stroke-dasharray="5 3"/>
     <path d="M44 10 L76 34 M76 10 L44 34" stroke="hsl(12, 92%, 60%)" stroke-width="2.4" stroke-linecap="round"/>`,
    'hsla(18, 90%, 52%, 0.22)'
  ),
  iron_power: wrapArtSvg(
    'iron_power',
    'hsl(32, 56%, 20%)',
    'hsl(10, 52%, 11%)',
    `<polygon points="60,4 78,22 60,40 42,22" fill="hsla(38, 92%, 58%, 0.28)" stroke="hsl(44, 96%, 68%)" stroke-width="1.8"/>
     <polygon points="60,11 69,22 60,33 51,22" fill="hsl(20, 96%, 56%)" stroke="hsl(48, 100%, 78%)" stroke-width="1.3"/>`,
    'hsla(38, 94%, 56%, 0.24)'
  ),

  // === SILENT THEMES ===
  silent_shiv: wrapArtSvg(
    'silent_shiv',
    'hsl(160, 50%, 18%)',
    'hsl(182, 46%, 10%)',
    `<polygon points="28,32 76,10 84,14 36,36" fill="hsl(164, 34%, 88%)" stroke="hsl(150, 86%, 56%)" stroke-width="1.3"/>
     <polygon points="48,36 90,14 96,18 54,39" fill="hsl(164, 34%, 82%)" stroke="hsl(150, 86%, 56%)" stroke-width="1.2" opacity="0.82"/>`,
    'hsla(152, 88%, 52%, 0.2)'
  ),
  silent_poison: wrapArtSvg(
    'silent_poison',
    'hsl(136, 56%, 18%)',
    'hsl(162, 50%, 9%)',
    `<path d="M54 8 H66 V14 L75 31 A6 6 0 0 1 70 39 H50 A6 6 0 0 1 45 31 L54 14 Z" fill="hsl(132, 80%, 40%)" stroke="hsl(126, 94%, 70%)" stroke-width="1.5"/>
     <circle cx="57" cy="28" r="2.6" fill="hsl(116, 100%, 78%)"/><circle cx="65" cy="24" r="2" fill="hsl(116, 100%, 78%)"/>
     <circle cx="36" cy="22" r="3" fill="hsla(132, 92%, 58%, 0.55)"/><circle cx="84" cy="18" r="2.5" fill="hsla(132, 92%, 58%, 0.55)"/>`,
    'hsla(132, 92%, 50%, 0.24)'
  ),
  silent_cloak: wrapArtSvg(
    'silent_cloak',
    'hsl(172, 48%, 18%)',
    'hsl(200, 44%, 10%)',
    `<path d="M60 6 L78 13 V24 C78 32 70 37 60 40 C50 37 42 32 42 24 V13 Z" fill="hsl(166, 52%, 30%)" stroke="hsl(154, 86%, 64%)" stroke-width="1.7"/>
     <path d="M26 28 Q60 12 94 28" fill="none" stroke="hsl(164, 88%, 68%)" stroke-width="1.8" opacity="0.7"/>`,
    'hsla(164, 86%, 54%, 0.2)'
  ),
  silent_discard: wrapArtSvg(
    'silent_discard',
    'hsl(178, 48%, 18%)',
    'hsl(214, 44%, 10%)',
    `<rect x="34" y="10" width="18" height="24" rx="2.5" transform="rotate(-14 43 22)" fill="hsl(170, 42%, 32%)" stroke="hsl(156, 84%, 64%)" stroke-width="1.3"/>
     <rect x="52" y="9" width="18" height="24" rx="2.5" fill="hsl(164, 48%, 38%)" stroke="hsl(46, 92%, 68%)" stroke-width="1.4"/>
     <rect x="68" y="12" width="18" height="24" rx="2.5" transform="rotate(14 77 24)" fill="hsl(178, 42%, 28%)" stroke="hsl(156, 84%, 64%)" stroke-width="1.3"/>`,
    'hsla(168, 86%, 56%, 0.2)'
  ),
  silent_agility: wrapArtSvg(
    'silent_agility',
    'hsl(156, 50%, 18%)',
    'hsl(192, 46%, 10%)',
    `<path d="M22 32 Q44 12 70 18 Q84 22 98 10" stroke="hsl(148, 94%, 64%)" stroke-width="2.4" stroke-linecap="round" fill="none"/>
     <path d="M28 38 Q52 20 88 26" stroke="hsl(176, 88%, 66%)" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.75"/>
     <polygon points="98,10 88,10 94,18" fill="hsl(148, 96%, 68%)"/>`,
    'hsla(156, 88%, 54%, 0.2)'
  ),
  silent_power: wrapArtSvg(
    'silent_power',
    'hsl(152, 54%, 18%)',
    'hsl(188, 48%, 10%)',
    `<polygon points="60,5 78,22 60,39 42,22" fill="hsla(148, 88%, 50%, 0.28)" stroke="hsl(144, 94%, 68%)" stroke-width="1.8"/>
     <circle cx="60" cy="22" r="6" fill="hsl(48, 98%, 68%)"/>`,
    'hsla(148, 90%, 54%, 0.22)'
  ),

  // === WATCHER THEMES ===
  watcher_wrath: wrapArtSvg(
    'watcher_wrath',
    'hsl(348, 60%, 20%)',
    'hsl(276, 48%, 12%)',
    `<path d="M60 5 Q74 16 68 34 Q60 39 52 34 Q46 16 60 5 Z" fill="hsl(354, 92%, 56%)" stroke="hsl(44, 98%, 72%)" stroke-width="1.5"/>
     <path d="M36 28 Q46 18 54 32 M84 28 Q74 18 66 32" stroke="hsl(16, 98%, 62%)" stroke-width="2" fill="none"/>`,
    'hsla(354, 94%, 56%, 0.24)'
  ),
  watcher_calm: wrapArtSvg(
    'watcher_calm',
    'hsl(198, 56%, 20%)',
    'hsl(258, 48%, 12%)',
    `<circle cx="60" cy="22" r="14" fill="hsla(194, 92%, 60%, 0.26)" stroke="hsl(194, 96%, 72%)" stroke-width="1.8"/>
     <path d="M24 28 Q42 22 60 28 Q78 34 96 28" stroke="hsl(192, 96%, 74%)" stroke-width="2" fill="none"/>
     <circle cx="60" cy="22" r="4.5" fill="hsl(190, 100%, 84%)"/>`,
    'hsla(194, 94%, 60%, 0.22)'
  ),
  watcher_divinity: wrapArtSvg(
    'watcher_divinity',
    'hsl(282, 54%, 22%)',
    'hsl(42, 52%, 14%)',
    `<circle cx="60" cy="22" r="14" fill="none" stroke="hsl(48, 100%, 72%)" stroke-width="2"/>
     <path d="M60 5 L64 17 L76 22 L64 27 L60 39 L56 27 L44 22 L56 17 Z" fill="hsl(292, 92%, 72%)" stroke="hsl(48, 100%, 78%)" stroke-width="1.2"/>`,
    'hsla(46, 100%, 64%, 0.26)'
  ),
  watcher_scry: wrapArtSvg(
    'watcher_scry',
    'hsl(268, 54%, 20%)',
    'hsl(216, 48%, 12%)',
    `<path d="M24 22 Q60 4 96 22 Q60 40 24 22 Z" fill="hsl(268, 48%, 26%)" stroke="hsl(292, 88%, 72%)" stroke-width="1.8"/>
     <circle cx="60" cy="22" r="8" fill="hsl(194, 94%, 62%)" stroke="hsl(46, 96%, 74%)" stroke-width="1.4"/>
     <circle cx="60" cy="22" r="3.2" fill="hsl(268, 60%, 16%)"/>`,
    'hsla(286, 92%, 64%, 0.24)'
  ),
  watcher_retain: wrapArtSvg(
    'watcher_retain',
    'hsl(274, 48%, 20%)',
    'hsl(38, 44%, 12%)',
    `<path d="M44 8 H76 L62 22 L76 36 H44 L58 22 Z" fill="hsla(46, 94%, 66%, 0.34)" stroke="hsl(46, 96%, 72%)" stroke-width="1.8"/>
     <line x1="60" y1="22" x2="60" y2="33" stroke="hsl(48, 100%, 78%)" stroke-width="2" stroke-dasharray="2 2"/>`,
    'hsla(46, 94%, 62%, 0.22)'
  ),
  watcher_martial: wrapArtSvg(
    'watcher_martial',
    'hsl(280, 52%, 20%)',
    'hsl(326, 46%, 12%)',
    `<path d="M24 32 Q54 14 94 12" stroke="hsl(294, 92%, 72%)" stroke-width="2.6" stroke-linecap="round" fill="none"/>
     <path d="M32 36 Q62 22 96 24" stroke="hsl(46, 96%, 70%)" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.8"/>
     <circle cx="88" cy="14" r="5" fill="hsl(46, 100%, 72%)" opacity="0.85"/>`,
    'hsla(292, 90%, 62%, 0.22)'
  ),
  watcher_mark: wrapArtSvg(
    'watcher_mark',
    'hsl(292, 54%, 20%)',
    'hsl(338, 48%, 11%)',
    `<circle cx="60" cy="22" r="14" fill="none" stroke="hsl(332, 92%, 66%)" stroke-width="1.8"/>
     <circle cx="60" cy="22" r="6" fill="hsl(332, 94%, 64%)"/>
     <path d="M60 4 V12 M60 32 V40 M42 22 H50 M70 22 H78" stroke="hsl(46, 96%, 72%)" stroke-width="1.8" stroke-linecap="round"/>`,
    'hsla(332, 92%, 58%, 0.24)'
  ),
  watcher_power: wrapArtSvg(
    'watcher_power',
    'hsl(276, 54%, 20%)',
    'hsl(242, 48%, 12%)',
    `<path d="M60 7 Q72 16 68 32 Q60 36 52 32 Q48 16 60 7 Z" fill="hsla(292, 88%, 68%, 0.4)" stroke="hsl(46, 96%, 72%)" stroke-width="1.6"/>
     <path d="M36 28 Q48 16 60 30 Q72 16 84 28" fill="none" stroke="hsl(292, 92%, 74%)" stroke-width="1.8"/>`,
    'hsla(286, 92%, 64%, 0.24)'
  ),

  // === COLORLESS / STATUS / CURSE THEMES ===
  colorless_strike: wrapArtSvg(
    'colorless_strike',
    'hsl(214, 22%, 24%)',
    'hsl(228, 22%, 12%)',
    `<polygon points="28,34 86,10 92,16 34,38" fill="hsl(42, 34%, 88%)" stroke="hsl(206, 46%, 74%)" stroke-width="1.4"/>
     <circle cx="88" cy="13" r="4" fill="hsl(48, 100%, 78%)" opacity="0.8"/>`,
    'hsla(210, 44%, 74%, 0.2)'
  ),
  colorless_arcane: wrapArtSvg(
    'colorless_arcane',
    'hsl(220, 26%, 24%)',
    'hsl(262, 26%, 12%)',
    `<polygon points="60,5 78,22 60,39 42,22" fill="hsla(46, 72%, 74%, 0.28)" stroke="hsl(46, 86%, 78%)" stroke-width="1.7"/>
     <circle cx="60" cy="22" r="5" fill="hsl(198, 92%, 78%)"/>`,
    'hsla(46, 72%, 72%, 0.2)'
  ),
  colorless_tactics: wrapArtSvg(
    'colorless_tactics',
    'hsl(216, 24%, 23%)',
    'hsl(232, 24%, 12%)',
    `<circle cx="60" cy="22" r="14" fill="none" stroke="hsl(44, 72%, 74%)" stroke-width="1.7"/>
     <path d="M60 11 L65 22 L60 33 L55 22 Z" fill="hsl(44, 86%, 76%)"/>
     <path d="M46 22 H74" stroke="hsl(208, 62%, 78%)" stroke-width="1.4"/>`,
    'hsla(212, 48%, 74%, 0.18)'
  ),
  status_burn: wrapArtSvg(
    'status_burn',
    'hsl(12, 58%, 20%)',
    'hsl(24, 34%, 10%)',
    `<path d="M60 6 Q74 18 68 35 Q60 39 52 35 Q46 18 60 6 Z" fill="hsl(16, 90%, 48%)" stroke="hsl(38, 96%, 64%)" stroke-width="1.4"/>
     <path d="M42 14 L78 32" stroke="hsl(0, 0%, 10%)" stroke-width="2.2" opacity="0.5"/>`,
    'hsla(14, 92%, 48%, 0.22)'
  ),
  status_daze: wrapArtSvg(
    'status_daze',
    'hsl(226, 26%, 20%)',
    'hsl(248, 28%, 10%)',
    `<path d="M40 22 Q50 10 60 22 Q70 34 80 22" stroke="hsl(212, 56%, 72%)" stroke-width="2.2" fill="none"/>
     <circle cx="46" cy="14" r="2.2" fill="hsl(206, 74%, 76%)"/><circle cx="74" cy="30" r="2.2" fill="hsl(206, 74%, 76%)"/>`,
    'hsla(216, 48%, 62%, 0.18)'
  ),
  curse_abyss: wrapArtSvg(
    'curse_abyss',
    'hsl(278, 48%, 16%)',
    'hsl(264, 52%, 8%)',
    `<path d="M46 24 A14 14 0 1 1 74 24 C74 29 71 32 68 34 V38 H52 V34 C49 32 46 29 46 24 Z" fill="hsl(274, 38%, 26%)" stroke="hsl(292, 76%, 62%)" stroke-width="1.6"/>
     <circle cx="55" cy="22" r="2.6" fill="hsl(342, 92%, 62%)"/><circle cx="65" cy="22" r="2.6" fill="hsl(342, 92%, 62%)"/>`,
    'hsla(292, 80%, 48%, 0.22)'
  ),
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
    return char === 'silent' ? 'silent_cloak' : char === 'watcher' ? 'watcher_calm' : 'iron_shield';
  }
  if (cardId === 'strike') {
    return char === 'silent' ? 'silent_shiv' : char === 'watcher' ? 'watcher_martial' : 'iron_slash';
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
