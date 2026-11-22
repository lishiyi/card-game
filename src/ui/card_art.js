/**
 * Rich inline SVG card illustration system covering all 233 cards with 100% bespoke artwork:
 * - 231 bespoke signature illustrations (100% of every non-shared card in CARD_LIBRARY)
 * - 6 class-specific hero illustrations for shared Strike & Defend (Ironclad / Silent / Watcher)
 * Uses framed 120×44 compositions with radial spotlights, distant Spire depth silhouette,
 * etched corner filigree, rim speculars, and unique `ca-*` IDs so cards look vivid on desktop & 390px mobile.
 */

function wrapArtSvg(key, bg1, bg2, inner, accent = 'rgba(255,255,255,0.14)') {
  return `<svg viewBox="0 0 120 44" class="card-art-svg" data-card-art="${key}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="ca-${key}-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${bg1}"/><stop offset="100%" stop-color="${bg2}"/></linearGradient><radialGradient id="ca-${key}-spot" cx="50%" cy="46%" r="58%"><stop offset="0%" stop-color="${accent}"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><linearGradient id="ca-${key}-vig" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(255,248,230,0.1)"/><stop offset="22%" stop-color="rgba(0,0,0,0)"/><stop offset="76%" stop-color="rgba(0,0,0,0)"/><stop offset="100%" stop-color="rgba(0,0,0,0.36)"/></linearGradient></defs><rect width="120" height="44" fill="url(#ca-${key}-bg)"/><rect width="120" height="44" fill="url(#ca-${key}-spot)"/><path d="M0 44 L0 36 L14 31 L28 37 L46 29 L68 36 L88 30 L106 36 L120 32 L120 44 Z" fill="rgba(0,0,0,0.16)"/><path d="M-4 44 L36 0 L52 0 L12 44 Z" fill="rgba(255,255,255,0.045)"/>${inner}<rect width="120" height="44" fill="url(#ca-${key}-vig)"/><path d="M3 9 V3 H9 M117 9 V3 H111 M3 35 V41 H9 M117 35 V41 H111" fill="none" stroke="rgba(255,245,220,0.22)" stroke-width="0.9" stroke-linecap="square"/></svg>`;
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

  // === IRONCLAD BESPOKE EXPANSION ===
  limit_break: wrapArtSvg(
    'limit_break',
    'hsl(8, 72%, 22%)',
    'hsl(350, 62%, 9%)',
    `<path d="M18 22 H46 M74 22 H102" stroke="hsl(32, 34%, 64%)" stroke-width="4" stroke-dasharray="6 3"/>
     <path d="M46 14 L56 22 L46 30 M74 14 L64 22 L74 30" stroke="hsl(46, 100%, 74%)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
     <polygon points="60,5 68,22 60,39 52,22" fill="hsl(22, 100%, 58%)" stroke="hsl(48, 100%, 84%)" stroke-width="1.5"/>`,
    'hsla(26, 100%, 56%, 0.3)'
  ),
  juggernaut: wrapArtSvg(
    'juggernaut',
    'hsl(18, 52%, 22%)',
    'hsl(216, 42%, 10%)',
    `<path d="M32 36 L44 12 L60 7 L76 12 L88 36 Z" fill="hsl(214, 28%, 42%)" stroke="hsl(44, 86%, 68%)" stroke-width="1.8"/>
     <path d="M44 20 H76 M60 11 V34" stroke="hsl(26, 98%, 62%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M14 26 L30 20 M106 26 L90 20 M16 34 L28 30 M104 34 L92 30" stroke="hsl(44, 96%, 72%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(32, 92%, 56%, 0.26)'
  ),
  pommel_strike: wrapArtSvg(
    'pommel_strike',
    'hsl(16, 56%, 22%)',
    'hsl(28, 48%, 10%)',
    `<path d="M22 32 L68 16" stroke="hsl(34, 42%, 52%)" stroke-width="6" stroke-linecap="round"/>
     <circle cx="74" cy="15" r="8.5" fill="hsl(44, 92%, 62%)" stroke="hsl(26, 54%, 26%)" stroke-width="1.6"/>
     <path d="M84 8 L96 5 M88 18 L100 18 M84 26 L94 31" stroke="hsl(48, 100%, 78%)" stroke-width="2.2" stroke-linecap="round"/>`,
    'hsla(40, 96%, 58%, 0.26)'
  ),
  shrug_it_off: wrapArtSvg(
    'shrug_it_off',
    'hsl(212, 46%, 22%)',
    'hsl(226, 42%, 10%)',
    `<path d="M44 10 L60 6 L76 10 V24 C76 32 68 37 60 39 C52 37 44 32 44 24 Z" fill="hsl(212, 46%, 36%)" stroke="hsl(44, 84%, 68%)" stroke-width="1.8"/>
     <path d="M18 14 L40 20 L24 32 M102 14 L80 20 L96 32" stroke="hsl(198, 92%, 74%)" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    'hsla(204, 88%, 58%, 0.24)'
  ),
  twin_strike: wrapArtSvg(
    'twin_strike',
    'hsl(6, 58%, 22%)',
    'hsl(18, 50%, 10%)',
    `<path d="M20 34 L62 8" stroke="hsl(42, 98%, 74%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M36 37 L84 8" stroke="hsl(18, 96%, 60%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M56 36 L100 11" stroke="hsl(46, 100%, 82%)" stroke-width="2.2" stroke-linecap="round" opacity="0.75"/>`,
    'hsla(20, 96%, 56%, 0.26)'
  ),
  cleave: wrapArtSvg(
    'cleave',
    'hsl(8, 60%, 22%)',
    'hsl(354, 52%, 10%)',
    `<path d="M12 28 Q60 6 108 26" stroke="hsl(38, 100%, 74%)" stroke-width="4" fill="none" stroke-linecap="round"/>
     <path d="M18 33 Q60 15 102 31" stroke="hsl(12, 96%, 56%)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
     <polygon points="88,16 109,24 94,30" fill="hsl(48, 100%, 82%)"/>`,
    'hsla(18, 96%, 54%, 0.26)'
  ),
  clothesline: wrapArtSvg(
    'clothesline',
    'hsl(18, 56%, 22%)',
    'hsl(348, 48%, 10%)',
    `<path d="M14 24 H84" stroke="hsl(32, 34%, 76%)" stroke-width="6.5" stroke-linecap="round"/>
     <circle cx="88" cy="24" r="7.5" fill="hsl(18, 72%, 52%)" stroke="hsl(44, 92%, 70%)" stroke-width="1.6"/>
     <path d="M40 12 L52 17 M62 10 L70 16 M52 34 L62 30" stroke="hsl(42, 98%, 72%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(22, 94%, 54%, 0.24)'
  ),
  iron_wave: wrapArtSvg(
    'iron_wave',
    'hsl(210, 46%, 22%)',
    'hsl(12, 48%, 12%)',
    `<path d="M22 34 L56 10 L62 15 L28 38 Z" fill="hsl(38, 34%, 84%)" stroke="hsl(14, 72%, 52%)" stroke-width="1.3"/>
     <path d="M62 8 L86 14 V24 C86 31 78 36 68 38 C58 36 54 31 54 24 V14 Z" fill="hsl(210, 52%, 38%)" stroke="hsl(198, 86%, 72%)" stroke-width="1.7"/>`,
    'hsla(204, 84%, 56%, 0.24)'
  ),
  body_slam: wrapArtSvg(
    'body_slam',
    'hsl(214, 48%, 22%)',
    'hsl(26, 48%, 10%)',
    `<path d="M40 10 Q60 4 80 10 L86 30 Q60 38 34 30 Z" fill="hsl(214, 34%, 44%)" stroke="hsl(44, 90%, 70%)" stroke-width="2"/>
     <path d="M16 36 Q60 26 104 36" stroke="hsl(36, 98%, 68%)" stroke-width="2.6" fill="none"/>
     <path d="M24 38 L34 28 M96 38 L86 28" stroke="hsl(48, 100%, 76%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(36, 92%, 56%, 0.26)'
  ),
  thunderclap: wrapArtSvg(
    'thunderclap',
    'hsl(218, 54%, 22%)',
    'hsl(248, 48%, 10%)',
    `<polygon points="64,4 46,23 59,23 52,40 76,19 62,19" fill="hsl(48, 100%, 72%)" stroke="hsl(196, 98%, 74%)" stroke-width="1.5"/>
     <path d="M22 14 L38 22 L22 30 M98 14 L82 22 L98 30" stroke="hsl(198, 96%, 72%)" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    'hsla(48, 100%, 62%, 0.28)'
  ),
  heavy_blade: wrapArtSvg(
    'heavy_blade',
    'hsl(4, 64%, 22%)',
    'hsl(18, 52%, 10%)',
    `<polygon points="20,38 78,4 94,16 38,42" fill="hsl(32, 26%, 82%)" stroke="hsl(42, 86%, 64%)" stroke-width="1.8"/>
     <path d="M30 34 L82 11" stroke="hsl(18, 98%, 60%)" stroke-width="2.6" stroke-linecap="round"/>
     <circle cx="86" cy="11" r="4" fill="hsl(48, 100%, 80%)"/>`,
    'hsla(14, 96%, 54%, 0.28)'
  ),
  true_grit: wrapArtSvg(
    'true_grit',
    'hsl(214, 36%, 22%)',
    'hsl(20, 42%, 10%)',
    `<path d="M44 9 L76 9 L72 34 L60 40 L48 34 Z" fill="hsl(216, 26%, 34%)" stroke="hsl(38, 78%, 64%)" stroke-width="1.8"/>
     <path d="M52 15 L66 28 M68 14 L54 24" stroke="hsl(22, 98%, 62%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="88" cy="14" r="2.2" fill="hsl(34, 98%, 66%)"/><circle cx="94" cy="24" r="1.8" fill="hsl(22, 96%, 60%)"/>`,
    'hsla(26, 86%, 54%, 0.22)'
  ),
  anger: wrapArtSvg(
    'anger',
    'hsl(356, 74%, 22%)',
    'hsl(10, 62%, 9%)',
    `<path d="M30 14 L52 22 L32 30 M90 14 L68 22 L88 30" stroke="hsl(42, 100%, 70%)" stroke-width="2.8" fill="none" stroke-linecap="round"/>
     <path d="M46 12 Q60 22 74 12 M44 34 Q60 24 76 34" stroke="hsl(6, 98%, 58%)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
     <circle cx="60" cy="22" r="5" fill="hsl(48, 100%, 78%)"/>`,
    'hsla(4, 100%, 54%, 0.3)'
  ),
  flex: wrapArtSvg(
    'flex',
    'hsl(14, 62%, 22%)',
    'hsl(348, 52%, 10%)',
    `<path d="M32 34 Q32 14 54 14 Q68 14 72 24 L86 20 Q88 34 66 36 Z" fill="hsl(18, 82%, 52%)" stroke="hsl(44, 96%, 72%)" stroke-width="1.7"/>
     <path d="M52 7 L56 12 M64 6 L64 11 M76 9 L72 13" stroke="hsl(48, 100%, 76%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(24, 98%, 56%, 0.26)'
  ),
  armaments: wrapArtSvg(
    'armaments',
    'hsl(32, 54%, 22%)',
    'hsl(214, 40%, 10%)',
    `<path d="M34 33 H86 L78 24 H42 Z" fill="hsl(216, 22%, 38%)" stroke="hsl(42, 76%, 64%)" stroke-width="1.6"/>
     <rect x="52" y="8" width="18" height="10" rx="2" fill="hsl(42, 86%, 66%)" stroke="hsl(24, 48%, 22%)" stroke-width="1.3"/>
     <line x1="61" y1="18" x2="61" y2="27" stroke="hsl(28, 56%, 44%)" stroke-width="3.2"/>
     <path d="M38 14 L45 18 M82 14 L75 18" stroke="hsl(48, 100%, 76%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(40, 96%, 58%, 0.26)'
  ),
  sword_boomerang: wrapArtSvg(
    'sword_boomerang',
    'hsl(12, 56%, 22%)',
    'hsl(26, 48%, 10%)',
    `<ellipse cx="60" cy="22" rx="38" ry="12" fill="none" stroke="hsla(42, 98%, 70%, 0.55)" stroke-width="2" stroke-dasharray="14 6"/>
     <polygon points="34,12 52,8 48,17" fill="hsl(40, 42%, 88%)" stroke="hsl(14, 76%, 52%)" stroke-width="1.2"/>
     <polygon points="86,32 68,36 72,27" fill="hsl(40, 42%, 88%)" stroke="hsl(14, 76%, 52%)" stroke-width="1.2"/>
     <polygon points="56,16 68,22 56,28 52,22" fill="hsl(44, 96%, 72%)"/>`,
    'hsla(32, 94%, 56%, 0.24)'
  ),
  perfected_strike: wrapArtSvg(
    'perfected_strike',
    'hsl(356, 62%, 22%)',
    'hsl(24, 52%, 10%)',
    `<path d="M18 35 L58 8 M36 37 L78 8 M56 37 L96 8" stroke="hsl(38, 34%, 84%)" stroke-width="3" stroke-linecap="round"/>
     <path d="M18 35 L96 8" stroke="hsl(46, 100%, 74%)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="60" cy="22" r="8" fill="none" stroke="hsl(44, 98%, 72%)" stroke-width="1.8"/>`,
    'hsla(36, 98%, 58%, 0.28)'
  ),
  clash: wrapArtSvg(
    'clash',
    'hsl(8, 62%, 22%)',
    'hsl(220, 38%, 10%)',
    `<path d="M24 36 L86 8" stroke="hsl(40, 42%, 88%)" stroke-width="4" stroke-linecap="round"/>
     <path d="M96 36 L34 8" stroke="hsl(206, 38%, 84%)" stroke-width="4" stroke-linecap="round"/>
     <polygon points="60,11 64,19 72,22 64,25 60,33 56,25 48,22 56,19" fill="hsl(48, 100%, 78%)"/>`,
    'hsla(44, 100%, 62%, 0.28)'
  ),
  whirlwind: wrapArtSvg(
    'whirlwind',
    'hsl(16, 62%, 22%)',
    'hsl(214, 42%, 10%)',
    `<ellipse cx="60" cy="22" rx="44" ry="13" fill="none" stroke="hsl(38, 98%, 72%)" stroke-width="2.6" stroke-dasharray="26 8"/>
     <ellipse cx="60" cy="22" rx="28" ry="8" fill="none" stroke="hsl(14, 96%, 60%)" stroke-width="2.4" stroke-dasharray="16 6"/>
     <polygon points="20,16 34,12 28,22" fill="hsl(46, 100%, 82%)"/>
     <polygon points="100,28 86,32 92,22" fill="hsl(46, 100%, 82%)"/>`,
    'hsla(26, 98%, 56%, 0.28)'
  ),
  inflame: wrapArtSvg(
    'inflame',
    'hsl(10, 70%, 22%)',
    'hsl(352, 58%, 9%)',
    `<path d="M60 4 Q78 18 70 36 Q60 41 50 36 Q42 18 60 4 Z" fill="hsl(16, 98%, 54%)" stroke="hsl(46, 100%, 76%)" stroke-width="1.6"/>
     <path d="M60 14 Q69 24 64 35 Q60 37 56 35 Q51 24 60 14 Z" fill="hsl(50, 100%, 78%)"/>
     <path d="M34 36 Q40 20 46 32 M86 36 Q80 20 74 32" stroke="hsl(32, 98%, 62%)" stroke-width="2" fill="none"/>`,
    'hsla(22, 100%, 54%, 0.3)'
  ),
  metallicize: wrapArtSvg(
    'metallicize',
    'hsl(212, 34%, 24%)',
    'hsl(224, 34%, 10%)',
    `<polygon points="60,5 82,15 78,35 60,41 42,35 38,15" fill="hsl(214, 24%, 48%)" stroke="hsl(206, 52%, 82%)" stroke-width="1.8"/>
     <polygon points="60,5 82,15 60,23" fill="hsla(0,0%,100%,0.24)"/>
     <polygon points="60,23 78,35 60,41" fill="hsla(0,0%,0%,0.26)"/>`,
    'hsla(206, 62%, 68%, 0.24)'
  ),
  battle_trance: wrapArtSvg(
    'battle_trance',
    'hsl(268, 46%, 20%)',
    'hsl(352, 48%, 10%)',
    `<rect x="30" y="10" width="16" height="24" rx="2.5" transform="rotate(-14 38 22)" fill="hsl(352, 52%, 34%)" stroke="hsl(42, 86%, 66%)" stroke-width="1.3"/>
     <rect x="52" y="8" width="16" height="24" rx="2.5" fill="hsl(14, 62%, 40%)" stroke="hsl(48, 100%, 74%)" stroke-width="1.5"/>
     <rect x="74" y="10" width="16" height="24" rx="2.5" transform="rotate(14 82 22)" fill="hsl(352, 52%, 34%)" stroke="hsl(42, 86%, 66%)" stroke-width="1.3"/>`,
    'hsla(20, 92%, 56%, 0.24)'
  ),
  bloodletting: wrapArtSvg(
    'bloodletting',
    'hsl(352, 70%, 20%)',
    'hsl(6, 56%, 9%)',
    `<path d="M46 7 Q58 20 46 35 Q34 20 46 7 Z" fill="hsl(354, 92%, 52%)" stroke="hsl(44, 90%, 72%)" stroke-width="1.5"/>
     <polygon points="74,7 64,23 73,23 68,38 86,19 76,19" fill="hsl(46, 100%, 72%)" stroke="hsl(24, 96%, 54%)" stroke-width="1.2"/>`,
    'hsla(354, 94%, 52%, 0.28)'
  ),
  seeing_red: wrapArtSvg(
    'seeing_red',
    'hsl(354, 74%, 22%)',
    'hsl(4, 62%, 9%)',
    `<ellipse cx="60" cy="22" rx="34" ry="13" fill="hsl(354, 68%, 16%)" stroke="hsl(8, 96%, 60%)" stroke-width="1.8"/>
     <circle cx="60" cy="22" r="8" fill="hsl(6, 100%, 56%)" stroke="hsl(46, 100%, 76%)" stroke-width="1.5"/>
     <circle cx="60" cy="22" r="3" fill="hsl(52, 100%, 90%)"/>`,
    'hsla(6, 100%, 54%, 0.3)'
  ),
  uppercut: wrapArtSvg(
    'uppercut',
    'hsl(14, 64%, 22%)',
    'hsl(350, 52%, 10%)',
    `<path d="M36 38 Q48 20 66 10" stroke="hsl(38, 100%, 70%)" stroke-width="4" fill="none" stroke-linecap="round"/>
     <rect x="58" y="8" width="18" height="14" rx="5" fill="hsl(20, 76%, 54%)" stroke="hsl(46, 98%, 74%)" stroke-width="1.6"/>
     <path d="M80 8 L90 5 M82 17 L94 17 M76 26 L86 30" stroke="hsl(48, 100%, 78%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(24, 98%, 56%, 0.28)'
  ),
  feel_no_pain: wrapArtSvg(
    'feel_no_pain',
    'hsl(278, 48%, 20%)',
    'hsl(216, 46%, 10%)',
    `<path d="M60 6 L78 13 V24 C78 32 70 37 60 40 C50 37 42 32 42 24 V13 Z" fill="hsl(276, 46%, 30%)" stroke="hsl(204, 92%, 74%)" stroke-width="1.8"/>
     <path d="M24 32 Q36 16 44 22 M96 32 Q84 16 76 22" stroke="hsl(292, 90%, 70%)" stroke-width="2" fill="none" stroke-dasharray="4 3"/>`,
    'hsla(286, 86%, 58%, 0.24)'
  ),
  dark_embrace: wrapArtSvg(
    'dark_embrace',
    'hsl(276, 56%, 18%)',
    'hsl(258, 56%, 8%)',
    `<path d="M22 36 Q34 10 56 18 Q44 26 42 36 M98 36 Q86 10 64 18 Q76 26 78 36" fill="hsl(282, 54%, 28%)" stroke="hsl(294, 92%, 70%)" stroke-width="1.6"/>
     <rect x="52" y="10" width="16" height="24" rx="2.5" fill="hsl(268, 44%, 18%)" stroke="hsl(46, 96%, 72%)" stroke-width="1.5"/>`,
    'hsla(288, 90%, 56%, 0.26)'
  ),
  second_wind: wrapArtSvg(
    'second_wind',
    'hsl(202, 52%, 20%)',
    'hsl(224, 46%, 10%)',
    `<path d="M16 18 Q44 8 72 18 T104 14" stroke="hsl(196, 96%, 74%)" stroke-width="2.6" fill="none" stroke-linecap="round"/>
     <path d="M20 29 Q48 20 76 29 T104 26" stroke="hsl(44, 96%, 70%)" stroke-width="2.2" fill="none" stroke-linecap="round"/>
     <circle cx="88" cy="17" r="4" fill="hsl(192, 100%, 84%)"/>`,
    'hsla(198, 92%, 60%, 0.26)'
  ),
  entrench: wrapArtSvg(
    'entrench',
    'hsl(214, 52%, 22%)',
    'hsl(228, 50%, 10%)',
    `<path d="M26 36 V14 H38 V20 H50 V14 H70 V20 H82 V14 H94 V36 Z" fill="hsl(214, 44%, 34%)" stroke="hsl(44, 86%, 68%)" stroke-width="1.8"/>
     <path d="M40 36 V26 H80 V36" fill="hsl(204, 86%, 56%)" opacity="0.4"/>`,
    'hsla(206, 90%, 58%, 0.26)'
  ),
  flame_barrier: wrapArtSvg(
    'flame_barrier',
    'hsl(16, 68%, 22%)',
    'hsl(218, 46%, 10%)',
    `<path d="M60 7 L78 14 V24 C78 32 70 37 60 39 C50 37 42 32 42 24 V14 Z" fill="hsl(214, 42%, 28%)" stroke="hsl(42, 96%, 68%)" stroke-width="1.8"/>
     <path d="M26 36 Q32 10 44 26 M94 36 Q88 10 76 26 M60 4 Q68 15 60 28 Q52 15 60 4 Z" fill="hsl(20, 98%, 56%)" stroke="hsl(48, 100%, 76%)" stroke-width="1.3"/>`,
    'hsla(22, 98%, 56%, 0.3)'
  ),
  shockwave: wrapArtSvg(
    'shockwave',
    'hsl(24, 60%, 22%)',
    'hsl(350, 50%, 10%)',
    `<circle cx="60" cy="22" r="7" fill="hsl(46, 100%, 74%)"/>
     <circle cx="60" cy="22" r="15" fill="none" stroke="hsl(28, 98%, 64%)" stroke-width="2.4"/>
     <circle cx="60" cy="22" r="26" fill="none" stroke="hsl(12, 92%, 56%)" stroke-width="2" stroke-dasharray="10 5"/>
     <circle cx="60" cy="22" r="38" fill="none" stroke="hsla(38, 96%, 66%, 0.55)" stroke-width="1.6" stroke-dasharray="8 6"/>`,
    'hsla(28, 98%, 58%, 0.28)'
  ),
  ghostly_armor: wrapArtSvg(
    'ghostly_armor',
    'hsl(198, 48%, 20%)',
    'hsl(232, 46%, 10%)',
    `<path d="M40 12 Q60 6 80 12 L75 36 Q60 40 45 36 Z" fill="hsla(192, 90%, 76%, 0.28)" stroke="hsl(188, 98%, 78%)" stroke-width="1.8" stroke-dasharray="5 2"/>
     <path d="M48 18 L60 26 L72 18" stroke="hsl(190, 100%, 88%)" stroke-width="1.8" fill="none"/>`,
    'hsla(190, 94%, 64%, 0.26)'
  ),
  carnage: wrapArtSvg(
    'carnage',
    'hsl(354, 72%, 22%)',
    'hsl(8, 58%, 9%)',
    `<path d="M18 36 L68 6 L82 14 L34 40 Z" fill="hsl(354, 86%, 48%)" stroke="hsl(44, 96%, 72%)" stroke-width="1.6"/>
     <path d="M62 24 L98 10 M68 34 L102 26" stroke="hsl(356, 98%, 64%)" stroke-width="2.6" stroke-linecap="round"/>
     <circle cx="88" cy="18" r="3.5" fill="hsl(48, 100%, 78%)"/>`,
    'hsla(356, 98%, 54%, 0.3)'
  ),
  hemokinesis: wrapArtSvg(
    'hemokinesis',
    'hsl(352, 72%, 20%)',
    'hsl(338, 58%, 9%)',
    `<path d="M16 28 Q38 8 60 22 Q82 36 104 14" stroke="hsl(354, 96%, 56%)" stroke-width="4" fill="none" stroke-linecap="round"/>
     <path d="M22 33 Q44 16 64 26 Q84 36 100 20" stroke="hsl(14, 100%, 66%)" stroke-width="1.8" fill="none"/>
     <circle cx="60" cy="22" r="6" fill="hsl(356, 94%, 52%)" stroke="hsl(44, 98%, 76%)" stroke-width="1.4"/>`,
    'hsla(354, 96%, 52%, 0.28)'
  ),
  dropkick: wrapArtSvg(
    'dropkick',
    'hsl(18, 62%, 22%)',
    'hsl(352, 50%, 10%)',
    `<path d="M16 14 L74 28" stroke="hsl(42, 98%, 70%)" stroke-width="3.6" stroke-linecap="round"/>
     <path d="M22 24 L68 32" stroke="hsl(16, 96%, 58%)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="74,20 96,29 72,37" fill="hsl(46, 100%, 76%)" stroke="hsl(14, 82%, 44%)" stroke-width="1.4"/>`,
    'hsla(26, 98%, 56%, 0.26)'
  ),
  spot_weakness: wrapArtSvg(
    'spot_weakness',
    'hsl(34, 58%, 22%)',
    'hsl(354, 48%, 10%)',
    `<circle cx="60" cy="22" r="14" fill="none" stroke="hsl(44, 96%, 68%)" stroke-width="1.8"/>
     <circle cx="60" cy="22" r="6" fill="hsl(6, 96%, 56%)"/>
     <path d="M60 4 V12 M60 32 V40 M42 22 H50 M70 22 H78" stroke="hsl(48, 100%, 76%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(14, 96%, 54%, 0.26)'
  ),
  disarm: wrapArtSvg(
    'disarm',
    'hsl(22, 50%, 22%)',
    'hsl(220, 40%, 10%)',
    `<polygon points="24,30 56,18 52,26 28,35" fill="hsl(38, 30%, 82%)" stroke="hsl(24, 38%, 34%)" stroke-width="1.2"/>
     <polygon points="66,14 96,8 92,16 64,22" fill="hsl(38, 30%, 82%)" stroke="hsl(24, 38%, 34%)" stroke-width="1.2"/>
     <path d="M56 8 L64 36" stroke="hsl(14, 98%, 60%)" stroke-width="2.4" stroke-linecap="round"/>`,
    'hsla(20, 92%, 54%, 0.24)'
  ),
  evolve: wrapArtSvg(
    'evolve',
    'hsl(288, 52%, 20%)',
    'hsl(12, 48%, 10%)',
    `<path d="M26 32 Q42 10 60 22 Q78 34 94 12" stroke="hsl(296, 92%, 70%)" stroke-width="2.4" fill="none"/>
     <path d="M26 12 Q42 34 60 22 Q78 10 94 32" stroke="hsl(44, 98%, 70%)" stroke-width="2.4" fill="none"/>
     <circle cx="60" cy="22" r="5" fill="hsl(48, 100%, 82%)"/>`,
    'hsla(296, 88%, 58%, 0.26)'
  ),
  fire_breathing: wrapArtSvg(
    'fire_breathing',
    'hsl(10, 72%, 22%)',
    'hsl(350, 58%, 9%)',
    `<path d="M22 22 L96 8 Q84 22 96 36 Z" fill="hsl(20, 98%, 54%)" opacity="0.82"/>
     <path d="M24 22 L84 14 Q74 22 84 30 Z" fill="hsl(48, 100%, 74%)"/>
     <circle cx="24" cy="22" r="6" fill="hsl(354, 86%, 46%)" stroke="hsl(44, 96%, 70%)" stroke-width="1.4"/>`,
    'hsla(24, 100%, 56%, 0.3)'
  ),
  rupture: wrapArtSvg(
    'rupture',
    'hsl(352, 68%, 20%)',
    'hsl(12, 54%, 9%)',
    `<path d="M24 36 L44 18 L56 26 L76 8 L96 28" stroke="hsl(6, 98%, 58%)" stroke-width="3" fill="none" stroke-linejoin="round"/>
     <path d="M56 26 L60 40 M76 8 L72 24" stroke="hsl(46, 100%, 74%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(4, 98%, 54%, 0.28)'
  ),
  headbutt: wrapArtSvg(
    'headbutt',
    'hsl(18, 56%, 22%)',
    'hsl(220, 38%, 10%)',
    `<path d="M36 34 Q38 10 60 10 Q82 10 84 34 Z" fill="hsl(32, 24%, 64%)" stroke="hsl(42, 84%, 68%)" stroke-width="1.8"/>
     <path d="M40 16 L24 8 M80 16 L96 8 M60 4 V10" stroke="hsl(48, 100%, 76%)" stroke-width="2.4" stroke-linecap="round"/>`,
    'hsla(34, 94%, 58%, 0.26)'
  ),
  combust: wrapArtSvg(
    'combust',
    'hsl(12, 72%, 22%)',
    'hsl(352, 60%, 9%)',
    `<circle cx="60" cy="22" r="13" fill="hsl(14, 98%, 54%)" stroke="hsl(48, 100%, 78%)" stroke-width="1.8"/>
     <circle cx="60" cy="22" r="6" fill="hsl(52, 100%, 88%)"/>
     <path d="M60 3 V8 M60 36 V41 M36 22 H44 M76 22 H84 M43 9 L48 14 M77 9 L72 14 M43 35 L48 30 M77 35 L72 30" stroke="hsl(38, 100%, 70%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(22, 100%, 56%, 0.32)'
  ),
  intimidate: wrapArtSvg(
    'intimidate',
    'hsl(352, 62%, 20%)',
    'hsl(268, 44%, 10%)',
    `<path d="M32 14 L54 20 L36 26 Z M88 14 L66 20 L84 26 Z" fill="hsl(44, 100%, 68%)"/>
     <path d="M22 34 Q60 22 98 34" stroke="hsl(8, 96%, 58%)" stroke-width="2.4" fill="none"/>`,
    'hsla(8, 94%, 52%, 0.26)'
  ),
  blood_for_blood: wrapArtSvg(
    'blood_for_blood',
    'hsl(352, 70%, 20%)',
    'hsl(8, 56%, 9%)',
    `<path d="M40 9 Q50 22 40 35 Q30 22 40 9 Z" fill="hsl(354, 92%, 52%)" stroke="hsl(44, 92%, 70%)" stroke-width="1.4"/>
     <path d="M80 9 Q90 22 80 35 Q70 22 80 9 Z" fill="hsl(354, 92%, 52%)" stroke="hsl(44, 92%, 70%)" stroke-width="1.4"/>
     <path d="M52 22 H68 M63 17 L69 22 L63 27" stroke="hsl(46, 100%, 76%)" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    'hsla(354, 96%, 52%, 0.28)'
  ),
  rage: wrapArtSvg(
    'rage',
    'hsl(6, 70%, 22%)',
    'hsl(214, 42%, 10%)',
    `<path d="M44 10 L60 5 L76 10 V25 C76 32 68 37 60 39 C52 37 44 32 44 25 Z" fill="hsl(6, 82%, 44%)" stroke="hsl(46, 100%, 72%)" stroke-width="1.8"/>
     <path d="M52 18 L60 24 L68 18 M54 29 H66" stroke="hsl(48, 100%, 82%)" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    'hsla(12, 98%, 54%, 0.28)'
  ),
  havoc: wrapArtSvg(
    'havoc',
    'hsl(284, 54%, 20%)',
    'hsl(12, 52%, 10%)',
    `<path d="M24 34 Q42 8 60 22 Q78 36 96 10" stroke="hsl(24, 98%, 62%)" stroke-width="2.8" fill="none"/>
     <polygon points="60,6 72,22 60,38 48,22" fill="hsl(288, 62%, 34%)" stroke="hsl(46, 98%, 74%)" stroke-width="1.6"/>
     <circle cx="60" cy="22" r="4" fill="hsl(18, 100%, 66%)"/>`,
    'hsla(290, 88%, 56%, 0.26)'
  ),

  // === SILENT BESPOKE EXPANSION ===
  survivor: wrapArtSvg(
    'survivor',
    'hsl(166, 52%, 18%)',
    'hsl(198, 48%, 10%)',
    `<path d="M60 6 L79 13 V24 C79 32 70 37 60 40 C50 37 41 32 41 24 V13 Z" fill="hsl(164, 52%, 28%)" stroke="hsl(148, 92%, 68%)" stroke-width="1.8"/>
     <path d="M50 22 L58 29 L72 15" stroke="hsl(46, 98%, 74%)" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    'hsla(154, 90%, 54%, 0.26)'
  ),
  shiv: wrapArtSvg(
    'shiv',
    'hsl(162, 52%, 18%)',
    'hsl(190, 48%, 10%)',
    `<polygon points="24,32 88,10 96,15 34,37" fill="hsl(164, 44%, 92%)" stroke="hsl(148, 94%, 64%)" stroke-width="1.5"/>
     <line x1="34" y1="31" x2="86" y2="13" stroke="hsl(0, 0%, 100%)" stroke-width="1.4" opacity="0.7"/>
     <rect x="20" y="29" width="12" height="4" rx="1.5" transform="rotate(-22 26 31)" fill="hsl(42, 86%, 62%)"/>`,
    'hsla(152, 92%, 56%, 0.26)'
  ),
  envenom: wrapArtSvg(
    'envenom',
    'hsl(134, 62%, 18%)',
    'hsl(164, 54%, 9%)',
    `<polygon points="24,33 88,9 94,14 32,37" fill="hsl(152, 36%, 86%)" stroke="hsl(126, 96%, 64%)" stroke-width="1.4"/>
     <path d="M40 24 Q62 15 86 12" stroke="hsl(124, 100%, 62%)" stroke-width="3" fill="none" stroke-linecap="round"/>
     <path d="M56 26 Q53 34 56 37 Q59 34 56 26 Z M76 20 Q73 28 76 31 Q79 28 76 20 Z" fill="hsl(124, 100%, 66%)"/>`,
    'hsla(128, 98%, 52%, 0.28)'
  ),
  a_thousand_cuts: wrapArtSvg(
    'a_thousand_cuts',
    'hsl(154, 56%, 18%)',
    'hsl(350, 48%, 10%)',
    `<path d="M18 12 L52 34 M34 8 L70 36 M54 8 L90 36 M74 10 L104 30 M24 34 L60 10 M62 34 L98 10" stroke="hsl(150, 96%, 72%)" stroke-width="1.9" stroke-linecap="round"/>
     <circle cx="60" cy="22" r="5" fill="hsl(46, 100%, 78%)" opacity="0.85"/>`,
    'hsla(152, 94%, 56%, 0.28)'
  ),
  storm_of_steel: wrapArtSvg(
    'storm_of_steel',
    'hsl(188, 50%, 18%)',
    'hsl(216, 48%, 10%)',
    `<polygon points="18,14 40,22 22,26" fill="hsl(190, 48%, 90%)"/><polygon points="44,8 66,18 48,22" fill="hsl(190, 48%, 90%)"/>
     <polygon points="74,10 96,20 78,24" fill="hsl(190, 48%, 90%)"/><polygon points="32,28 56,34 38,39" fill="hsl(154, 86%, 72%)"/>
     <polygon points="66,26 92,34 72,38" fill="hsl(154, 86%, 72%)"/>`,
    'hsla(186, 92%, 60%, 0.28)'
  ),
  tools_of_the_trade: wrapArtSvg(
    'tools_of_the_trade',
    'hsl(166, 46%, 18%)',
    'hsl(32, 42%, 10%)',
    `<path d="M22 34 L50 10" stroke="hsl(164, 42%, 88%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M56 10 H64 V16 L71 32 A5 5 0 0 1 66 38 H54 A5 5 0 0 1 49 32 L56 16 Z" fill="hsl(132, 86%, 46%)" stroke="hsl(44, 92%, 70%)" stroke-width="1.3"/>
     <circle cx="88" cy="22" r="9" fill="none" stroke="hsl(44, 90%, 68%)" stroke-width="2" stroke-dasharray="4 3"/>`,
    'hsla(152, 88%, 54%, 0.26)'
  ),
  burst: wrapArtSvg(
    'burst',
    'hsl(148, 62%, 18%)',
    'hsl(186, 54%, 10%)',
    `<polygon points="60,4 67,16 82,12 72,22 84,32 68,28 60,40 52,28 36,32 48,22 38,12 53,16" fill="hsl(144, 94%, 58%)" stroke="hsl(48, 100%, 80%)" stroke-width="1.5"/>
     <circle cx="60" cy="22" r="5" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(142, 98%, 56%, 0.3)'
  ),
  malaise: wrapArtSvg(
    'malaise',
    'hsl(146, 52%, 16%)',
    'hsl(274, 48%, 10%)',
    `<path d="M24 30 Q42 8 60 22 Q78 36 96 14" stroke="hsl(138, 88%, 52%)" stroke-width="3" fill="none" opacity="0.8"/>
     <circle cx="60" cy="22" r="12" fill="hsl(276, 52%, 20%)" stroke="hsl(136, 92%, 62%)" stroke-width="1.8"/>
     <path d="M54 19 L66 25 M66 19 L54 25" stroke="hsl(134, 100%, 70%)" stroke-width="2.2" stroke-linecap="round"/>`,
    'hsla(142, 90%, 48%, 0.26)'
  ),
  deadly_poison: wrapArtSvg(
    'deadly_poison',
    'hsl(132, 62%, 18%)',
    'hsl(160, 54%, 9%)',
    `<path d="M53 7 H67 V14 L77 31 A6 6 0 0 1 71 39 H49 A6 6 0 0 1 43 31 L53 14 Z" fill="hsl(128, 88%, 42%)" stroke="hsl(118, 100%, 74%)" stroke-width="1.6"/>
     <circle cx="56" cy="26" r="2.2" fill="hsl(154, 62%, 12%)"/><circle cx="64" cy="26" r="2.2" fill="hsl(154, 62%, 12%)"/>
     <path d="M55 33 H65" stroke="hsl(154, 62%, 12%)" stroke-width="1.8"/>`,
    'hsla(128, 96%, 50%, 0.28)'
  ),
  poisoned_stab: wrapArtSvg(
    'poisoned_stab',
    'hsl(142, 58%, 18%)',
    'hsl(172, 52%, 9%)',
    `<polygon points="22,34 84,10 92,16 32,38" fill="hsl(156, 36%, 86%)" stroke="hsl(126, 94%, 64%)" stroke-width="1.4"/>
     <circle cx="88" cy="13" r="5.5" fill="hsl(126, 98%, 58%)" opacity="0.8"/>
     <circle cx="96" cy="22" r="2.6" fill="hsl(124, 100%, 66%)"/>`,
    'hsla(132, 94%, 52%, 0.26)'
  ),
  bane: wrapArtSvg(
    'bane',
    'hsl(136, 56%, 18%)',
    'hsl(348, 50%, 10%)',
    `<path d="M24 34 L76 8 M44 36 L96 10" stroke="hsl(128, 96%, 62%)" stroke-width="3.2" stroke-linecap="round"/>
     <circle cx="60" cy="22" r="9" fill="hsla(352, 90%, 48%, 0.35)" stroke="hsl(126, 98%, 68%)" stroke-width="1.6"/>`,
    'hsla(130, 94%, 52%, 0.26)'
  ),
  cloak_and_dagger: wrapArtSvg(
    'cloak_and_dagger',
    'hsl(166, 52%, 18%)',
    'hsl(198, 48%, 10%)',
    `<path d="M30 36 Q42 8 66 10 L74 36 Q52 32 30 36 Z" fill="hsl(164, 52%, 28%)" stroke="hsl(152, 86%, 64%)" stroke-width="1.6"/>
     <polygon points="56,30 96,10 100,15 62,34" fill="hsl(164, 44%, 92%)" stroke="hsl(44, 92%, 68%)" stroke-width="1.3"/>`,
    'hsla(156, 88%, 54%, 0.24)'
  ),
  dagger_throw: wrapArtSvg(
    'dagger_throw',
    'hsl(168, 52%, 18%)',
    'hsl(198, 48%, 10%)',
    `<path d="M14 22 H54" stroke="hsl(154, 94%, 64%)" stroke-width="2.2" stroke-dasharray="6 4"/>
     <polygon points="54,17 104,22 54,27 62,22" fill="hsl(164, 44%, 92%)" stroke="hsl(148, 92%, 64%)" stroke-width="1.4"/>`,
    'hsla(156, 90%, 54%, 0.24)'
  ),
  acrobatics: wrapArtSvg(
    'acrobatics',
    'hsl(178, 52%, 18%)',
    'hsl(214, 48%, 10%)',
    `<path d="M18 34 Q42 4 64 20 Q84 36 102 10" stroke="hsl(166, 94%, 68%)" stroke-width="2.8" fill="none" stroke-linecap="round"/>
     <circle cx="60" cy="18" r="6" fill="hsl(46, 96%, 70%)" stroke="hsl(164, 88%, 74%)" stroke-width="1.4"/>`,
    'hsla(170, 92%, 58%, 0.26)'
  ),
  prepared: wrapArtSvg(
    'prepared',
    'hsl(174, 46%, 18%)',
    'hsl(206, 44%, 10%)',
    `<rect x="34" y="10" width="20" height="26" rx="2.5" transform="rotate(-12 44 23)" fill="hsl(168, 46%, 30%)" stroke="hsl(154, 88%, 68%)" stroke-width="1.5"/>
     <rect x="64" y="10" width="20" height="26" rx="2.5" transform="rotate(12 74 23)" fill="hsl(174, 46%, 36%)" stroke="hsl(46, 96%, 72%)" stroke-width="1.5"/>`,
    'hsla(166, 86%, 56%, 0.24)'
  ),
  backflip: wrapArtSvg(
    'backflip',
    'hsl(182, 52%, 18%)',
    'hsl(216, 48%, 10%)',
    `<path d="M88 32 A26 16 0 1 0 34 26" stroke="hsl(172, 96%, 70%)" stroke-width="2.8" fill="none" stroke-linecap="round"/>
     <polygon points="30,19 32,31 42,25" fill="hsl(172, 98%, 74%)"/>
     <circle cx="62" cy="24" r="5" fill="hsl(46, 96%, 72%)"/>`,
    'hsla(174, 92%, 58%, 0.26)'
  ),
  dagger_spray: wrapArtSvg(
    'dagger_spray',
    'hsl(160, 54%, 18%)',
    'hsl(192, 48%, 10%)',
    `<polygon points="24,22 68,8 62,15" fill="hsl(164, 42%, 90%)"/><polygon points="24,22 88,16 78,22" fill="hsl(164, 42%, 90%)"/>
     <polygon points="24,22 86,28 76,22" fill="hsl(152, 84%, 72%)"/><polygon points="24,22 68,36 62,29" fill="hsl(152, 84%, 72%)"/>
     <circle cx="24" cy="22" r="4.5" fill="hsl(46, 98%, 72%)"/>`,
    'hsla(156, 90%, 54%, 0.26)'
  ),
  slice: wrapArtSvg(
    'slice',
    'hsl(156, 56%, 18%)',
    'hsl(186, 50%, 9%)',
    `<path d="M16 32 Q60 12 104 12" stroke="hsl(148, 98%, 70%)" stroke-width="3.6" fill="none" stroke-linecap="round"/>
     <path d="M22 36 Q64 20 98 18" stroke="hsl(46, 100%, 78%)" stroke-width="1.6" fill="none"/>`,
    'hsla(150, 94%, 56%, 0.26)'
  ),
  sneaky_strike: wrapArtSvg(
    'sneaky_strike',
    'hsl(170, 54%, 16%)',
    'hsl(214, 52%, 9%)',
    `<path d="M26 36 Q38 12 60 12 Q82 12 94 36" fill="hsla(166, 52%, 22%, 0.7)" stroke="hsl(154, 86%, 62%)" stroke-width="1.5"/>
     <polygon points="36,34 86,8 92,14 44,38" fill="hsl(164, 44%, 92%)" stroke="hsl(46, 96%, 70%)" stroke-width="1.3"/>`,
    'hsla(160, 88%, 54%, 0.24)'
  ),
  flying_knee: wrapArtSvg(
    'flying_knee',
    'hsl(156, 54%, 18%)',
    'hsl(188, 50%, 10%)',
    `<path d="M18 32 L54 14 L82 26" stroke="hsl(148, 94%, 64%)" stroke-width="4.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="84" cy="26" r="6" fill="hsl(46, 100%, 72%)"/>
     <path d="M92 16 L102 12 M94 26 L104 26 M92 35 L100 38" stroke="hsl(148, 98%, 72%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(150, 92%, 54%, 0.26)'
  ),
  quick_slash: wrapArtSvg(
    'quick_slash',
    'hsl(164, 54%, 18%)',
    'hsl(198, 48%, 10%)',
    `<path d="M14 28 L92 10" stroke="hsl(164, 56%, 90%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M26 35 L104 18" stroke="hsl(148, 96%, 64%)" stroke-width="2.2" stroke-linecap="round"/>
     <rect x="82" y="24" width="14" height="16" rx="2" fill="hsl(168, 44%, 30%)" stroke="hsl(46, 94%, 70%)" stroke-width="1.3"/>`,
    'hsla(156, 92%, 56%, 0.24)'
  ),
  sucker_punch: wrapArtSvg(
    'sucker_punch',
    'hsl(164, 48%, 18%)',
    'hsl(348, 44%, 10%)',
    `<circle cx="62" cy="22" r="11" fill="hsl(164, 54%, 34%)" stroke="hsl(46, 94%, 70%)" stroke-width="1.8"/>
     <path d="M18 22 H46 M78 14 L92 10 M80 22 H96 M78 30 L92 34" stroke="hsl(148, 94%, 66%)" stroke-width="2.2" stroke-linecap="round"/>`,
    'hsla(156, 86%, 52%, 0.24)'
  ),
  dodge_and_roll: wrapArtSvg(
    'dodge_and_roll',
    'hsl(176, 52%, 18%)',
    'hsl(210, 48%, 10%)',
    `<circle cx="44" cy="22" r="11" fill="none" stroke="hsl(172, 92%, 68%)" stroke-width="2.2" stroke-dasharray="18 6"/>
     <circle cx="76" cy="22" r="11" fill="none" stroke="hsl(46, 94%, 70%)" stroke-width="2.2" stroke-dasharray="18 6"/>
     <path d="M44 22 H76" stroke="hsl(164, 96%, 76%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(170, 90%, 56%, 0.24)'
  ),
  piercing_wail: wrapArtSvg(
    'piercing_wail',
    'hsl(186, 54%, 18%)',
    'hsl(252, 50%, 10%)',
    `<circle cx="34" cy="22" r="7" fill="hsl(188, 96%, 72%)"/>
     <path d="M48 12 Q58 22 48 32 M62 8 Q76 22 62 36 M78 5 Q96 22 78 39" stroke="hsl(184, 98%, 74%)" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
    'hsla(186, 96%, 58%, 0.28)'
  ),
  deflect: wrapArtSvg(
    'deflect',
    'hsl(176, 50%, 18%)',
    'hsl(206, 46%, 10%)',
    `<path d="M56 6 L66 38" stroke="hsl(164, 50%, 88%)" stroke-width="3.6" stroke-linecap="round"/>
     <path d="M22 14 L54 22 L28 34" stroke="hsl(44, 98%, 72%)" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="57" cy="22" r="4" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(168, 90%, 56%, 0.24)'
  ),
  heel_hook: wrapArtSvg(
    'heel_hook',
    'hsl(152, 54%, 18%)',
    'hsl(24, 46%, 10%)',
    `<path d="M22 30 Q48 34 68 18 Q80 10 92 18" stroke="hsl(44, 96%, 70%)" stroke-width="3.6" fill="none" stroke-linecap="round"/>
     <polygon points="88,10 100,20 84,24" fill="hsl(148, 96%, 68%)"/>`,
    'hsla(42, 94%, 56%, 0.24)'
  ),
  flechettes: wrapArtSvg(
    'flechettes',
    'hsl(166, 52%, 18%)',
    'hsl(202, 48%, 10%)',
    `<path d="M18 14 L82 14 M26 22 L96 22 M18 30 L82 30" stroke="hsl(164, 46%, 88%)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="82,11 92,14 82,17" fill="hsl(148, 96%, 68%)"/><polygon points="96,19 106,22 96,25" fill="hsl(46, 100%, 74%)"/>
     <polygon points="82,27 92,30 82,33" fill="hsl(148, 96%, 68%)"/>`,
    'hsla(156, 90%, 56%, 0.24)'
  ),
  bouncing_flask: wrapArtSvg(
    'bouncing_flask',
    'hsl(132, 62%, 18%)',
    'hsl(166, 54%, 9%)',
    `<path d="M18 34 Q36 8 54 28 Q72 8 92 26" stroke="hsl(126, 96%, 64%)" stroke-width="2.2" stroke-dasharray="4 3" fill="none"/>
     <circle cx="36" cy="18" r="6" fill="hsl(130, 88%, 46%)" stroke="hsl(118, 100%, 76%)" stroke-width="1.3"/>
     <circle cx="72" cy="16" r="6" fill="hsl(130, 88%, 46%)" stroke="hsl(118, 100%, 76%)" stroke-width="1.3"/>
     <circle cx="94" cy="26" r="5" fill="hsl(124, 100%, 62%)"/>`,
    'hsla(128, 96%, 52%, 0.28)'
  ),
  crippling_cloud: wrapArtSvg(
    'crippling_cloud',
    'hsl(138, 56%, 16%)',
    'hsl(268, 44%, 10%)',
    `<circle cx="42" cy="25" r="11" fill="hsla(134, 82%, 44%, 0.72)"/><circle cx="60" cy="19" r="14" fill="hsla(138, 86%, 48%, 0.8)"/>
     <circle cx="78" cy="25" r="11" fill="hsla(134, 82%, 44%, 0.72)"/>
     <circle cx="55" cy="18" r="2.2" fill="hsl(48, 100%, 74%)"/><circle cx="65" cy="18" r="2.2" fill="hsl(48, 100%, 74%)"/>`,
    'hsla(134, 92%, 48%, 0.28)'
  ),
  accuracy: wrapArtSvg(
    'accuracy',
    'hsl(154, 56%, 18%)',
    'hsl(192, 48%, 10%)',
    `<circle cx="60" cy="22" r="15" fill="none" stroke="hsl(148, 92%, 64%)" stroke-width="1.8"/>
     <circle cx="60" cy="22" r="8" fill="none" stroke="hsl(46, 98%, 70%)" stroke-width="1.6"/>
     <polygon points="32,34 62,20 64,23 36,37" fill="hsl(164, 48%, 92%)"/>
     <circle cx="60" cy="22" r="3" fill="hsl(48, 100%, 82%)"/>`,
    'hsla(150, 94%, 56%, 0.26)'
  ),
  infinite_blades: wrapArtSvg(
    'infinite_blades',
    'hsl(164, 54%, 18%)',
    'hsl(198, 50%, 10%)',
    `<path d="M34 22 C34 11 50 11 60 22 C70 33 86 33 86 22 C86 11 70 11 60 22 C50 33 34 33 34 22 Z" fill="none" stroke="hsl(152, 94%, 68%)" stroke-width="2.6"/>
     <polygon points="56,14 64,22 56,30 60,22" fill="hsl(48, 100%, 78%)"/>`,
    'hsla(156, 92%, 56%, 0.26)'
  ),
  finisher: wrapArtSvg(
    'finisher',
    'hsl(352, 58%, 20%)',
    'hsl(166, 48%, 10%)',
    `<path d="M22 10 L60 22 L22 34 M98 10 L60 22 L98 34" stroke="hsl(154, 92%, 68%)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
     <polygon points="60,6 68,22 60,38 52,22" fill="hsl(354, 92%, 60%)" stroke="hsl(48, 100%, 80%)" stroke-width="1.5"/>`,
    'hsla(354, 92%, 54%, 0.28)'
  ),
  eviscerate: wrapArtSvg(
    'eviscerate',
    'hsl(354, 60%, 20%)',
    'hsl(168, 48%, 10%)',
    `<path d="M22 32 Q50 10 80 12 M30 36 Q58 16 90 18 M38 39 Q66 22 98 24" stroke="hsl(354, 96%, 64%)" stroke-width="2.8" fill="none" stroke-linecap="round"/>`,
    'hsla(354, 94%, 56%, 0.28)'
  ),
  calculated_gamble: wrapArtSvg(
    'calculated_gamble',
    'hsl(174, 48%, 18%)',
    'hsl(40, 44%, 10%)',
    `<rect x="34" y="10" width="22" height="22" rx="4" transform="rotate(-10 45 21)" fill="hsl(44, 62%, 86%)" stroke="hsl(164, 64%, 44%)" stroke-width="1.5"/>
     <circle cx="40" cy="17" r="1.8" fill="hsl(170, 56%, 18%)"/><circle cx="50" cy="25" r="1.8" fill="hsl(170, 56%, 18%)"/><circle cx="45" cy="21" r="1.8" fill="hsl(354, 86%, 48%)"/>
     <rect x="64" y="12" width="22" height="22" rx="4" transform="rotate(10 75 23)" fill="hsl(166, 50%, 34%)" stroke="hsl(46, 94%, 70%)" stroke-width="1.5"/>
     <circle cx="71" cy="19" r="1.8" fill="hsl(48, 100%, 80%)"/><circle cx="79" cy="27" r="1.8" fill="hsl(48, 100%, 80%)"/>`,
    'hsla(46, 92%, 60%, 0.24)'
  ),
  footwork: wrapArtSvg(
    'footwork',
    'hsl(158, 54%, 18%)',
    'hsl(194, 48%, 10%)',
    `<path d="M18 32 Q42 14 66 22 Q86 28 102 10" stroke="hsl(148, 96%, 68%)" stroke-width="3" fill="none" stroke-linecap="round"/>
     <path d="M24 37 Q48 22 72 28 Q90 32 104 18" stroke="hsl(46, 98%, 72%)" stroke-width="2" fill="none" stroke-linecap="round"/>
     <polygon points="94,8 104,10 98,19" fill="hsl(148, 100%, 76%)"/>`,
    'hsla(152, 94%, 56%, 0.26)'
  ),
  leg_sweep: wrapArtSvg(
    'leg_sweep',
    'hsl(170, 52%, 18%)',
    'hsl(206, 48%, 10%)',
    `<path d="M16 30 Q60 38 104 20" stroke="hsl(154, 96%, 68%)" stroke-width="3.6" fill="none" stroke-linecap="round"/>
     <path d="M60 8 L74 14 V22 C74 28 67 32 60 34 C53 32 46 28 46 22 V14 Z" fill="hsla(166, 62%, 34%, 0.8)" stroke="hsl(46, 94%, 70%)" stroke-width="1.5"/>`,
    'hsla(160, 90%, 54%, 0.24)'
  ),
  backstab: wrapArtSvg(
    'backstab',
    'hsl(166, 52%, 16%)',
    'hsl(350, 54%, 9%)',
    `<polygon points="24,10 74,24 66,30 20,16" fill="hsl(164, 42%, 90%)" stroke="hsl(354, 92%, 62%)" stroke-width="1.4"/>
     <polygon points="74,24 98,32 70,32" fill="hsl(354, 94%, 58%)"/>
     <circle cx="74" cy="26" r="5" fill="hsla(354, 98%, 58%, 0.4)"/>`,
    'hsla(354, 92%, 54%, 0.26)'
  ),
  dash: wrapArtSvg(
    'dash',
    'hsl(166, 54%, 18%)',
    'hsl(204, 48%, 10%)',
    `<path d="M14 22 H62" stroke="hsl(154, 96%, 68%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M64 10 L96 22 L64 34 L72 22 Z" fill="hsl(46, 96%, 72%)" stroke="hsl(152, 92%, 64%)" stroke-width="1.5"/>`,
    'hsla(160, 92%, 56%, 0.26)'
  ),
  skewer: wrapArtSvg(
    'skewer',
    'hsl(158, 56%, 18%)',
    'hsl(192, 50%, 10%)',
    `<path d="M12 22 H96" stroke="hsl(164, 46%, 90%)" stroke-width="3.6" stroke-linecap="round"/>
     <polygon points="92,15 110,22 92,29" fill="hsl(148, 98%, 68%)"/>
     <circle cx="42" cy="22" r="7" fill="none" stroke="hsl(46, 96%, 70%)" stroke-width="1.8"/>
     <circle cx="68" cy="22" r="7" fill="none" stroke="hsl(46, 96%, 70%)" stroke-width="1.8"/>`,
    'hsla(152, 94%, 56%, 0.26)'
  ),
  predator: wrapArtSvg(
    'predator',
    'hsl(152, 54%, 16%)',
    'hsl(354, 48%, 9%)',
    `<path d="M30 16 L54 22 L34 28 Z M90 16 L66 22 L86 28 Z" fill="hsl(136, 100%, 62%)"/>
     <path d="M40 34 L46 28 L52 35 L60 28 L68 35 L74 28 L80 34" stroke="hsl(44, 52%, 90%)" stroke-width="2" fill="none"/>`,
    'hsla(140, 94%, 50%, 0.26)'
  ),
  blur: wrapArtSvg(
    'blur',
    'hsl(182, 52%, 18%)',
    'hsl(216, 50%, 10%)',
    `<ellipse cx="42" cy="22" rx="10" ry="14" fill="hsla(176, 88%, 64%, 0.24)" stroke="hsl(176, 88%, 68%)" stroke-width="1.3"/>
     <ellipse cx="60" cy="22" rx="10" ry="14" fill="hsla(176, 88%, 64%, 0.42)" stroke="hsl(176, 94%, 74%)" stroke-width="1.6"/>
     <ellipse cx="78" cy="22" rx="10" ry="14" fill="hsla(176, 88%, 64%, 0.72)" stroke="hsl(46, 96%, 76%)" stroke-width="1.8"/>`,
    'hsla(176, 92%, 58%, 0.26)'
  ),
  terror: wrapArtSvg(
    'terror',
    'hsl(276, 54%, 18%)',
    'hsl(352, 54%, 9%)',
    `<path d="M44 26 A16 15 0 1 1 76 26 L71 38 H49 Z" fill="hsl(42, 34%, 84%)" stroke="hsl(352, 86%, 56%)" stroke-width="1.6"/>
     <path d="M50 20 L57 23 L51 26 Z M70 20 L63 23 L69 26 Z" fill="hsl(354, 100%, 54%)"/>
     <path d="M54 32 H66" stroke="hsl(276, 48%, 18%)" stroke-width="2.2"/>`,
    'hsla(352, 92%, 52%, 0.28)'
  ),
  caltrops: wrapArtSvg(
    'caltrops',
    'hsl(166, 44%, 18%)',
    'hsl(214, 42%, 10%)',
    `<polygon points="36,14 44,32 28,32" fill="hsl(168, 36%, 80%)" stroke="hsl(150, 86%, 60%)" stroke-width="1.3"/>
     <polygon points="60,10 69,34 51,34" fill="hsl(168, 42%, 88%)" stroke="hsl(46, 94%, 70%)" stroke-width="1.4"/>
     <polygon points="84,14 92,32 76,32" fill="hsl(168, 36%, 80%)" stroke="hsl(150, 86%, 60%)" stroke-width="1.3"/>`,
    'hsla(156, 88%, 54%, 0.24)'
  ),
  well_laid_plans: wrapArtSvg(
    'well_laid_plans',
    'hsl(186, 48%, 18%)',
    'hsl(218, 46%, 10%)',
    `<rect x="28" y="9" width="64" height="26" rx="3" fill="hsl(42, 42%, 78%)" stroke="hsl(168, 72%, 56%)" stroke-width="1.6"/>
     <path d="M36 28 Q52 14 68 24 T84 16" stroke="hsl(166, 72%, 28%)" stroke-width="2" fill="none" stroke-dasharray="3 2"/>
     <path d="M81 13 L87 19 M87 13 L81 19" stroke="hsl(354, 88%, 50%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(176, 86%, 56%, 0.24)'
  ),
  choke: wrapArtSvg(
    'choke',
    'hsl(148, 50%, 16%)',
    'hsl(276, 48%, 10%)',
    `<path d="M26 22 Q44 8 60 22 Q76 36 94 22" stroke="hsl(142, 90%, 58%)" stroke-width="3.2" fill="none"/>
     <path d="M26 22 Q44 36 60 22 Q76 8 94 22" stroke="hsl(292, 86%, 64%)" stroke-width="2.4" fill="none"/>
     <circle cx="60" cy="22" r="6" fill="hsl(354, 92%, 58%)"/>`,
    'hsla(146, 88%, 50%, 0.26)'
  ),
  riddle_with_holes: wrapArtSvg(
    'riddle_with_holes',
    'hsl(162, 50%, 18%)',
    'hsl(206, 46%, 10%)',
    `<circle cx="36" cy="16" r="4" fill="hsl(210, 40%, 10%)" stroke="hsl(150, 94%, 66%)" stroke-width="1.4"/>
     <circle cx="56" cy="14" r="4.5" fill="hsl(210, 40%, 10%)" stroke="hsl(46, 98%, 72%)" stroke-width="1.4"/>
     <circle cx="76" cy="18" r="4" fill="hsl(210, 40%, 10%)" stroke="hsl(150, 94%, 66%)" stroke-width="1.4"/>
     <circle cx="46" cy="30" r="4" fill="hsl(210, 40%, 10%)" stroke="hsl(150, 94%, 66%)" stroke-width="1.4"/>
     <circle cx="68" cy="30" r="4.5" fill="hsl(210, 40%, 10%)" stroke="hsl(46, 98%, 72%)" stroke-width="1.4"/>`,
    'hsla(154, 92%, 56%, 0.24)'
  ),

  // === WATCHER BESPOKE EXPANSION ===
  brilliance: wrapArtSvg(
    'brilliance',
    'hsl(44, 68%, 24%)',
    'hsl(276, 52%, 12%)',
    `<circle cx="60" cy="22" r="10" fill="hsl(48, 100%, 78%)" stroke="hsl(292, 92%, 72%)" stroke-width="1.8"/>
     <path d="M60 3 V9 M60 35 V41 M30 22 H44 M76 22 H90 M40 8 L49 14 M80 8 L71 14 M40 36 L49 30 M80 36 L71 30" stroke="hsl(48, 100%, 80%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(48, 100%, 66%, 0.32)'
  ),
  devotion: wrapArtSvg(
    'devotion',
    'hsl(282, 58%, 22%)',
    'hsl(42, 54%, 12%)',
    `<path d="M44 36 Q48 16 60 8 Q72 16 76 36" fill="hsla(292, 86%, 62%, 0.35)" stroke="hsl(48, 100%, 76%)" stroke-width="1.8"/>
     <circle cx="60" cy="24" r="6" fill="hsl(48, 100%, 78%)"/>
     <path d="M32 34 Q46 22 60 34 Q74 22 88 34" stroke="hsl(294, 94%, 74%)" stroke-width="1.8" fill="none"/>`,
    'hsla(48, 98%, 64%, 0.28)'
  ),
  establishment: wrapArtSvg(
    'establishment',
    'hsl(272, 50%, 20%)',
    'hsl(38, 48%, 12%)',
    `<rect x="34" y="32" width="52" height="5" rx="1.5" fill="hsl(44, 86%, 62%)"/>
     <rect x="42" y="14" width="7" height="18" fill="hsl(44, 58%, 82%)" stroke="hsl(276, 48%, 42%)" stroke-width="1.1"/>
     <rect x="56.5" y="14" width="7" height="18" fill="hsl(44, 58%, 82%)" stroke="hsl(276, 48%, 42%)" stroke-width="1.1"/>
     <rect x="71" y="14" width="7" height="18" fill="hsl(44, 58%, 82%)" stroke="hsl(276, 48%, 42%)" stroke-width="1.1"/>
     <polygon points="34,14 60,5 86,14" fill="hsl(286, 62%, 44%)" stroke="hsl(46, 94%, 72%)" stroke-width="1.4"/>`,
    'hsla(46, 92%, 62%, 0.24)'
  ),
  scrawl: wrapArtSvg(
    'scrawl',
    'hsl(274, 48%, 20%)',
    'hsl(220, 44%, 10%)',
    `<rect x="32" y="8" width="44" height="28" rx="3" fill="hsl(44, 48%, 84%)" stroke="hsl(286, 68%, 62%)" stroke-width="1.5"/>
     <path d="M39 16 H68 M39 22 H64 M39 28 H58" stroke="hsl(272, 54%, 34%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M68 28 L94 8 L98 12 L72 32 Z" fill="hsl(294, 92%, 72%)" stroke="hsl(48, 100%, 78%)" stroke-width="1.2"/>`,
    'hsla(292, 90%, 62%, 0.26)'
  ),
  spirit_shield: wrapArtSvg(
    'spirit_shield',
    'hsl(198, 56%, 20%)',
    'hsl(274, 52%, 12%)',
    `<path d="M60 5 L82 14 V25 C82 33 72 38 60 41 C48 38 38 33 38 25 V14 Z" fill="hsla(194, 94%, 64%, 0.28)" stroke="hsl(192, 100%, 78%)" stroke-width="2"/>
     <path d="M60 12 L72 22 L60 32 L48 22 Z" fill="hsl(292, 92%, 72%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.3"/>`,
    'hsla(194, 96%, 62%, 0.28)'
  ),
  smite: wrapArtSvg(
    'smite',
    'hsl(42, 64%, 22%)',
    'hsl(286, 52%, 11%)',
    `<path d="M60 4 L68 26 L60 39 L52 26 Z" fill="hsl(48, 100%, 78%)" stroke="hsl(292, 88%, 68%)" stroke-width="1.5"/>
     <path d="M34 32 Q60 18 86 32" stroke="hsl(46, 100%, 74%)" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
    'hsla(48, 100%, 66%, 0.3)'
  ),
  safety: wrapArtSvg(
    'safety',
    'hsl(196, 54%, 20%)',
    'hsl(268, 48%, 11%)',
    `<circle cx="60" cy="22" r="15" fill="hsla(192, 94%, 64%, 0.24)" stroke="hsl(192, 100%, 76%)" stroke-width="2"/>
     <circle cx="60" cy="22" r="8" fill="none" stroke="hsl(48, 98%, 76%)" stroke-width="1.6" stroke-dasharray="4 3"/>
     <circle cx="60" cy="22" r="3" fill="hsl(190, 100%, 90%)"/>`,
    'hsla(194, 94%, 62%, 0.28)'
  ),
  insight: wrapArtSvg(
    'insight',
    'hsl(276, 54%, 22%)',
    'hsl(206, 50%, 11%)',
    `<path d="M24 22 Q60 4 96 22 Q60 40 24 22 Z" fill="hsl(274, 50%, 24%)" stroke="hsl(48, 98%, 74%)" stroke-width="1.8"/>
     <circle cx="60" cy="22" r="7.5" fill="hsl(192, 98%, 68%)"/>
     <circle cx="60" cy="22" r="3" fill="hsl(0, 0%, 100%)"/>`,
    'hsla(194, 96%, 64%, 0.28)'
  ),
  bowling_bash: wrapArtSvg(
    'bowling_bash',
    'hsl(286, 52%, 20%)',
    'hsl(342, 48%, 10%)',
    `<circle cx="34" cy="24" r="10" fill="hsl(292, 68%, 46%)" stroke="hsl(46, 96%, 72%)" stroke-width="1.6"/>
     <path d="M46 24 H66" stroke="hsl(48, 100%, 74%)" stroke-width="2.4" stroke-dasharray="5 3"/>
     <ellipse cx="76" cy="24" rx="4.5" ry="11" transform="rotate(14 76 24)" fill="hsl(44, 52%, 88%)" stroke="hsl(286, 54%, 38%)" stroke-width="1.2"/>
     <ellipse cx="90" cy="22" rx="4.5" ry="11" transform="rotate(28 90 22)" fill="hsl(44, 52%, 88%)" stroke="hsl(286, 54%, 38%)" stroke-width="1.2"/>`,
    'hsla(292, 90%, 60%, 0.26)'
  ),
  consecrate: wrapArtSvg(
    'consecrate',
    'hsl(280, 56%, 22%)',
    'hsl(42, 50%, 11%)',
    `<ellipse cx="60" cy="30" rx="42" ry="9" fill="hsla(46, 98%, 66%, 0.24)" stroke="hsl(48, 100%, 76%)" stroke-width="1.8"/>
     <path d="M42 28 V8 M60 30 V5 M78 28 V8" stroke="hsl(48, 100%, 80%)" stroke-width="2.4" stroke-linecap="round" opacity="0.85"/>`,
    'hsla(46, 100%, 64%, 0.28)'
  ),
  crush_joints: wrapArtSvg(
    'crush_joints',
    'hsl(338, 56%, 20%)',
    'hsl(276, 50%, 11%)',
    `<path d="M24 22 H54 M66 22 H96" stroke="hsl(44, 54%, 86%)" stroke-width="5.5" stroke-linecap="round"/>
     <polygon points="60,8 65,19 74,22 65,25 60,36 55,25 46,22 55,19" fill="hsl(352, 98%, 62%)" stroke="hsl(48, 100%, 80%)" stroke-width="1.3"/>`,
    'hsla(350, 96%, 56%, 0.28)'
  ),
  cut_through_fate: wrapArtSvg(
    'cut_through_fate',
    'hsl(276, 56%, 22%)',
    'hsl(214, 50%, 11%)',
    `<path d="M24 22 Q60 6 96 22 Q60 38 24 22 Z" fill="none" stroke="hsl(292, 86%, 70%)" stroke-width="1.5" opacity="0.7"/>
     <path d="M18 36 L102 8" stroke="hsl(192, 100%, 78%)" stroke-width="3.6" stroke-linecap="round"/>
     <path d="M24 38 L104 12" stroke="hsl(48, 100%, 78%)" stroke-width="1.6" stroke-linecap="round"/>`,
    'hsla(194, 96%, 64%, 0.28)'
  ),
  empty_fist: wrapArtSvg(
    'empty_fist',
    'hsl(268, 44%, 20%)',
    'hsl(218, 44%, 10%)',
    `<circle cx="60" cy="22" r="14" fill="none" stroke="hsl(44, 90%, 72%)" stroke-width="2" stroke-dasharray="20 6"/>
     <rect x="51" y="15" width="18" height="14" rx="4.5" fill="hsl(286, 54%, 44%)" stroke="hsl(48, 98%, 78%)" stroke-width="1.5"/>`,
    'hsla(286, 84%, 62%, 0.24)'
  ),
  flurry_of_blows: wrapArtSvg(
    'flurry_of_blows',
    'hsl(290, 56%, 20%)',
    'hsl(340, 50%, 10%)',
    `<path d="M16 14 H56 M24 22 H74 M16 30 H56" stroke="hsl(296, 94%, 72%)" stroke-width="2.4" stroke-linecap="round"/>
     <circle cx="64" cy="14" r="4.5" fill="hsl(46, 100%, 74%)"/><circle cx="84" cy="22" r="5.5" fill="hsl(352, 96%, 64%)"/>
     <circle cx="64" cy="30" r="4.5" fill="hsl(194, 96%, 70%)"/>`,
    'hsla(296, 92%, 62%, 0.28)'
  ),
  flying_sleeves: wrapArtSvg(
    'flying_sleeves',
    'hsl(282, 54%, 20%)',
    'hsl(250, 48%, 11%)',
    `<path d="M14 28 Q38 8 64 20 Q84 28 106 10" stroke="hsl(292, 90%, 74%)" stroke-width="4.5" fill="none" stroke-linecap="round" opacity="0.82"/>
     <path d="M16 36 Q42 18 68 28 Q88 36 106 20" stroke="hsl(46, 96%, 74%)" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
    'hsla(290, 92%, 62%, 0.26)'
  ),
  follow_up: wrapArtSvg(
    'follow_up',
    'hsl(288, 54%, 20%)',
    'hsl(32, 50%, 11%)',
    `<path d="M22 30 L56 12 M44 32 L78 14" stroke="hsl(294, 92%, 72%)" stroke-width="3" stroke-linecap="round"/>
     <polygon points="86,8 78,22 86,22 82,36 98,18 89,18" fill="hsl(48, 100%, 74%)"/>`,
    'hsla(44, 96%, 62%, 0.26)'
  ),
  just_lucky: wrapArtSvg(
    'just_lucky',
    'hsl(274, 52%, 20%)',
    'hsl(154, 46%, 11%)',
    `<circle cx="53" cy="17" r="6.5" fill="hsl(148, 86%, 48%)" stroke="hsl(48, 98%, 74%)" stroke-width="1.3"/>
     <circle cx="67" cy="17" r="6.5" fill="hsl(148, 86%, 48%)" stroke="hsl(48, 98%, 74%)" stroke-width="1.3"/>
     <circle cx="53" cy="29" r="6.5" fill="hsl(148, 86%, 48%)" stroke="hsl(48, 98%, 74%)" stroke-width="1.3"/>
     <circle cx="67" cy="29" r="6.5" fill="hsl(148, 86%, 48%)" stroke="hsl(48, 98%, 74%)" stroke-width="1.3"/>
     <circle cx="60" cy="23" r="3" fill="hsl(48, 100%, 82%)"/>`,
    'hsla(148, 92%, 56%, 0.26)'
  ),
  sash_whip: wrapArtSvg(
    'sash_whip',
    'hsl(290, 56%, 20%)',
    'hsl(344, 50%, 10%)',
    `<path d="M16 32 Q36 8 58 24 Q78 38 96 14" stroke="hsl(46, 98%, 72%)" stroke-width="3.6" fill="none" stroke-linecap="round"/>
     <path d="M22 34 Q42 14 60 27 Q78 38 94 18" stroke="hsl(338, 92%, 62%)" stroke-width="1.6" fill="none"/>
     <circle cx="98" cy="13" r="4.5" fill="hsl(48, 100%, 82%)"/>`,
    'hsla(46, 96%, 62%, 0.28)'
  ),
  crescendo: wrapArtSvg(
    'crescendo',
    'hsl(348, 66%, 22%)',
    'hsl(278, 52%, 11%)',
    `<path d="M20 22 L96 8 M20 22 L96 36" stroke="hsl(354, 96%, 62%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M52 22 L92 15 M52 22 L92 29" stroke="hsl(46, 100%, 74%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(354, 96%, 56%, 0.3)'
  ),
  empty_body: wrapArtSvg(
    'empty_body',
    'hsl(224, 46%, 20%)',
    'hsl(274, 46%, 11%)',
    `<path d="M60 7 L80 14 V25 C80 32 71 37 60 40 C49 37 40 32 40 25 V14 Z" fill="none" stroke="hsl(46, 92%, 74%)" stroke-width="2.2" stroke-dasharray="6 3"/>
     <circle cx="60" cy="22" r="5" fill="hsla(196, 92%, 74%, 0.4)" stroke="hsl(196, 96%, 78%)" stroke-width="1.4"/>`,
    'hsla(210, 88%, 62%, 0.24)'
  ),
  evaluate: wrapArtSvg(
    'evaluate',
    'hsl(214, 50%, 20%)',
    'hsl(272, 48%, 11%)',
    `<line x1="60" y1="7" x2="60" y2="36" stroke="hsl(46, 92%, 70%)" stroke-width="2.2"/>
     <line x1="34" y1="15" x2="86" y2="15" stroke="hsl(46, 92%, 70%)" stroke-width="2.2"/>
     <path d="M26 27 Q34 34 42 27 Z M78 27 Q86 34 94 27 Z" fill="hsl(194, 92%, 68%)"/>
     <path d="M34 15 L28 27 M34 15 L40 27 M86 15 L80 27 M86 15 L92 27" stroke="hsl(46, 86%, 72%)" stroke-width="1.2"/>`,
    'hsla(198, 90%, 60%, 0.24)'
  ),
  halt: wrapArtSvg(
    'halt',
    'hsl(348, 56%, 20%)',
    'hsl(206, 48%, 11%)',
    `<circle cx="60" cy="22" r="15" fill="hsla(352, 86%, 48%, 0.3)" stroke="hsl(46, 98%, 74%)" stroke-width="2"/>
     <rect x="52" y="13" width="16" height="18" rx="4" fill="hsl(44, 62%, 86%)" stroke="hsl(352, 84%, 52%)" stroke-width="1.4"/>
     <path d="M56 13 V19 M60 12 V19 M64 13 V19" stroke="hsl(276, 48%, 34%)" stroke-width="1.3"/>`,
    'hsla(354, 92%, 56%, 0.26)'
  ),
  prostrate: wrapArtSvg(
    'prostrate',
    'hsl(280, 52%, 22%)',
    'hsl(42, 48%, 12%)',
    `<ellipse cx="60" cy="34" rx="34" ry="6" fill="hsla(46, 96%, 66%, 0.25)" stroke="hsl(46, 96%, 72%)" stroke-width="1.4"/>
     <path d="M40 31 Q60 14 80 31" fill="hsl(286, 56%, 40%)" stroke="hsl(296, 92%, 74%)" stroke-width="1.8"/>
     <polygon points="60,6 64,14 60,20 56,14" fill="hsl(48, 100%, 80%)"/>`,
    'hsla(46, 96%, 62%, 0.26)'
  ),
  protect: wrapArtSvg(
    'protect',
    'hsl(202, 52%, 20%)',
    'hsl(270, 48%, 11%)',
    `<path d="M60 5 L80 12 V25 C80 33 71 38 60 40 C49 38 40 33 40 25 V12 Z" fill="hsl(204, 58%, 34%)" stroke="hsl(46, 96%, 74%)" stroke-width="2"/>
     <circle cx="60" cy="22" r="6" fill="hsl(48, 100%, 76%)"/>`,
    'hsla(198, 92%, 60%, 0.26)'
  ),
  third_eye: wrapArtSvg(
    'third_eye',
    'hsl(276, 58%, 22%)',
    'hsl(206, 52%, 11%)',
    `<path d="M22 22 Q60 3 98 22 Q60 41 22 22 Z" fill="hsl(274, 52%, 22%)" stroke="hsl(296, 94%, 74%)" stroke-width="2"/>
     <circle cx="60" cy="22" r="9" fill="hsl(192, 96%, 62%)" stroke="hsl(48, 100%, 78%)" stroke-width="1.6"/>
     <polygon points="60,15 63,22 60,29 57,22" fill="hsl(272, 68%, 14%)"/>`,
    'hsla(290, 94%, 64%, 0.28)'
  ),
  tranquility: wrapArtSvg(
    'tranquility',
    'hsl(198, 58%, 20%)',
    'hsl(252, 50%, 11%)',
    `<path d="M16 30 Q38 22 60 30 Q82 38 104 30" stroke="hsl(192, 98%, 74%)" stroke-width="2.4" fill="none"/>
     <path d="M44 26 Q52 10 60 18 Q68 10 76 26 Q60 30 44 26 Z" fill="hsl(294, 88%, 74%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.3"/>`,
    'hsla(194, 96%, 62%, 0.28)'
  ),
  pressure_points: wrapArtSvg(
    'pressure_points',
    'hsl(328, 60%, 20%)',
    'hsl(274, 52%, 10%)',
    `<circle cx="60" cy="22" r="14" fill="none" stroke="hsl(334, 96%, 68%)" stroke-width="1.8" stroke-dasharray="5 3"/>
     <circle cx="60" cy="22" r="6" fill="hsl(336, 98%, 62%)"/>
     <path d="M24 22 H44 M76 22 H96 M60 4 V11 M60 33 V40" stroke="hsl(46, 100%, 76%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(334, 96%, 58%, 0.28)'
  ),
  carve_reality: wrapArtSvg(
    'carve_reality',
    'hsl(286, 56%, 22%)',
    'hsl(40, 50%, 11%)',
    `<path d="M20 34 L82 8 L92 14 L32 39 Z" fill="hsl(48, 100%, 78%)" stroke="hsl(292, 90%, 66%)" stroke-width="1.5"/>
     <path d="M64 26 L94 34 M74 18 L100 22" stroke="hsl(296, 96%, 76%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(46, 98%, 64%, 0.28)'
  ),
  conclude: wrapArtSvg(
    'conclude',
    'hsl(344, 62%, 20%)',
    'hsl(276, 54%, 10%)',
    `<path d="M14 22 H106" stroke="hsl(48, 100%, 82%)" stroke-width="4" stroke-linecap="round"/>
     <path d="M36 8 L84 36 M84 8 L36 36" stroke="hsl(352, 96%, 62%)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="60" cy="22" r="6" fill="hsl(0, 0%, 100%)"/>`,
    'hsla(352, 96%, 58%, 0.3)'
  ),
  fear_no_evil: wrapArtSvg(
    'fear_no_evil',
    'hsl(198, 56%, 20%)',
    'hsl(344, 48%, 11%)',
    `<path d="M22 34 L62 10 L70 16 L30 38 Z" fill="hsl(192, 96%, 76%)" stroke="hsl(48, 100%, 78%)" stroke-width="1.3"/>
     <circle cx="80" cy="22" r="11" fill="hsla(194, 94%, 60%, 0.28)" stroke="hsl(192, 100%, 78%)" stroke-width="1.8"/>
     <circle cx="80" cy="22" r="4" fill="hsl(190, 100%, 90%)"/>`,
    'hsla(194, 96%, 62%, 0.28)'
  ),
  sands_of_time: wrapArtSvg(
    'sands_of_time',
    'hsl(40, 56%, 22%)',
    'hsl(274, 48%, 11%)',
    `<path d="M42 7 H78 L62 22 L78 37 H42 L58 22 Z" fill="hsla(46, 98%, 68%, 0.34)" stroke="hsl(46, 100%, 76%)" stroke-width="1.8"/>
     <polygon points="48,35 72,35 60,26" fill="hsl(46, 98%, 68%)"/>
     <line x1="60" y1="22" x2="60" y2="29" stroke="hsl(48, 100%, 84%)" stroke-width="1.8" stroke-dasharray="2 2"/>`,
    'hsla(46, 96%, 62%, 0.28)'
  ),
  talk_to_the_hand: wrapArtSvg(
    'talk_to_the_hand',
    'hsl(202, 54%, 20%)',
    'hsl(276, 50%, 11%)',
    `<rect x="49" y="13" width="22" height="20" rx="5" fill="hsl(44, 62%, 86%)" stroke="hsl(194, 96%, 72%)" stroke-width="1.8"/>
     <path d="M54 13 V21 M60 11 V21 M66 13 V21" stroke="hsl(274, 46%, 34%)" stroke-width="1.4"/>
     <circle cx="60" cy="22" r="16" fill="none" stroke="hsla(194, 96%, 74%, 0.55)" stroke-width="1.6"/>`,
    'hsla(194, 94%, 62%, 0.26)'
  ),
  tantrum: wrapArtSvg(
    'tantrum',
    'hsl(352, 72%, 22%)',
    'hsl(278, 52%, 10%)',
    `<path d="M22 32 L46 10 L56 26 L76 8 L98 30" stroke="hsl(354, 98%, 62%)" stroke-width="3.2" fill="none" stroke-linejoin="round"/>
     <circle cx="46" cy="10" r="3.5" fill="hsl(48, 100%, 78%)"/><circle cx="76" cy="8" r="3.5" fill="hsl(48, 100%, 78%)"/>`,
    'hsla(354, 98%, 56%, 0.3)'
  ),
  wallop: wrapArtSvg(
    'wallop',
    'hsl(282, 54%, 20%)',
    'hsl(204, 52%, 11%)',
    `<path d="M22 36 L68 12" stroke="hsl(44, 96%, 70%)" stroke-width="4.4" stroke-linecap="round"/>
     <circle cx="74" cy="12" r="8" fill="hsl(194, 96%, 64%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.8"/>
     <path d="M84 12 H102 M80 22 L96 30" stroke="hsl(192, 100%, 80%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(198, 94%, 60%, 0.28)'
  ),
  weave: wrapArtSvg(
    'weave',
    'hsl(278, 52%, 20%)',
    'hsl(204, 48%, 11%)',
    `<path d="M14 14 Q36 34 60 14 T106 14" stroke="hsl(292, 92%, 72%)" stroke-width="2.6" fill="none"/>
     <path d="M14 30 Q36 10 60 30 T106 30" stroke="hsl(194, 96%, 72%)" stroke-width="2.6" fill="none"/>`,
    'hsla(286, 90%, 62%, 0.26)'
  ),
  wheel_kick: wrapArtSvg(
    'wheel_kick',
    'hsl(286, 56%, 20%)',
    'hsl(340, 50%, 10%)',
    `<circle cx="60" cy="22" r="14" fill="none" stroke="hsl(294, 96%, 72%)" stroke-width="3" stroke-dasharray="22 8"/>
     <circle cx="60" cy="22" r="7" fill="none" stroke="hsl(48, 100%, 76%)" stroke-width="2"/>
     <polygon points="72,10 84,18 70,22" fill="hsl(48, 100%, 80%)"/>`,
    'hsla(294, 94%, 62%, 0.28)'
  ),
  deceive_reality: wrapArtSvg(
    'deceive_reality',
    'hsl(206, 54%, 20%)',
    'hsl(276, 50%, 11%)',
    `<polygon points="44,8 76,8 66,36 34,36" fill="hsla(194, 94%, 64%, 0.28)" stroke="hsl(192, 100%, 78%)" stroke-width="1.6"/>
     <polygon points="54,8 86,8 76,36 44,36" fill="hsla(292, 92%, 68%, 0.28)" stroke="hsl(48, 98%, 76%)" stroke-width="1.6"/>`,
    'hsla(198, 94%, 62%, 0.26)'
  ),
  empty_mind: wrapArtSvg(
    'empty_mind',
    'hsl(232, 48%, 20%)',
    'hsl(274, 48%, 11%)',
    `<circle cx="60" cy="22" r="14" fill="none" stroke="hsl(194, 96%, 76%)" stroke-width="2" stroke-dasharray="16 6"/>
     <circle cx="60" cy="22" r="6" fill="none" stroke="hsl(48, 100%, 80%)" stroke-width="1.8"/>`,
    'hsla(198, 92%, 64%, 0.24)'
  ),
  inner_peace: wrapArtSvg(
    'inner_peace',
    'hsl(198, 58%, 20%)',
    'hsl(260, 50%, 11%)',
    `<circle cx="60" cy="22" r="15" fill="hsla(194, 94%, 64%, 0.22)" stroke="hsl(194, 98%, 76%)" stroke-width="1.8"/>
     <path d="M60 11 Q68 20 60 31 Q52 20 60 11 Z" fill="hsl(192, 100%, 82%)"/>
     <path d="M46 25 Q54 18 60 28 Q66 18 74 25" stroke="hsl(48, 98%, 78%)" stroke-width="1.6" fill="none"/>`,
    'hsla(194, 96%, 62%, 0.28)'
  ),
  pray: wrapArtSvg(
    'pray',
    'hsl(282, 56%, 22%)',
    'hsl(42, 54%, 11%)',
    `<path d="M52 36 L58 10 L62 10 L68 36 Z" fill="hsl(48, 100%, 78%)" stroke="hsl(292, 86%, 66%)" stroke-width="1.4"/>
     <circle cx="60" cy="18" r="14" fill="none" stroke="hsla(48, 100%, 78%, 0.55)" stroke-width="1.5" stroke-dasharray="4 3"/>`,
    'hsla(48, 100%, 66%, 0.28)'
  ),
  simmering_fury: wrapArtSvg(
    'simmering_fury',
    'hsl(350, 68%, 22%)',
    'hsl(276, 52%, 10%)',
    `<path d="M36 34 Q48 16 60 24 Q72 12 84 34 Z" fill="hsl(354, 94%, 56%)" stroke="hsl(46, 100%, 76%)" stroke-width="1.5"/>
     <circle cx="48" cy="12" r="2.5" fill="hsl(48, 100%, 78%)"/><circle cx="72" cy="10" r="2.8" fill="hsl(24, 100%, 66%)"/>`,
    'hsla(354, 96%, 56%, 0.3)'
  ),
  worship: wrapArtSvg(
    'worship',
    'hsl(284, 58%, 22%)',
    'hsl(44, 56%, 12%)',
    `<circle cx="60" cy="22" r="15" fill="none" stroke="hsl(48, 100%, 76%)" stroke-width="2"/>
     <polygon points="60,6 64,17 76,22 64,27 60,38 56,27 44,22 56,17" fill="hsl(48, 100%, 78%)" stroke="hsl(292, 92%, 68%)" stroke-width="1.3"/>`,
    'hsla(48, 100%, 66%, 0.32)'
  ),
  fasting: wrapArtSvg(
    'fasting',
    'hsl(272, 50%, 20%)',
    'hsl(40, 48%, 11%)',
    `<path d="M38 24 Q60 36 82 24 H38 Z" fill="hsl(44, 72%, 58%)" stroke="hsl(48, 98%, 78%)" stroke-width="1.6"/>
     <path d="M52 18 Q54 10 58 14 M64 18 Q66 8 70 13" stroke="hsl(292, 92%, 76%)" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
    'hsla(46, 94%, 60%, 0.24)'
  ),
  foresight: wrapArtSvg(
    'foresight',
    'hsl(270, 56%, 22%)',
    'hsl(210, 52%, 11%)',
    `<path d="M26 22 Q60 6 94 22 Q60 38 26 22 Z" fill="none" stroke="hsl(194, 96%, 72%)" stroke-width="1.8"/>
     <circle cx="60" cy="22" r="6" fill="hsl(294, 94%, 72%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.4"/>
     <circle cx="38" cy="10" r="2" fill="hsl(48, 100%, 82%)"/><circle cx="82" cy="10" r="2" fill="hsl(48, 100%, 82%)"/>`,
    'hsla(286, 92%, 62%, 0.26)'
  ),
  like_water: wrapArtSvg(
    'like_water',
    'hsl(198, 58%, 20%)',
    'hsl(240, 50%, 11%)',
    `<path d="M12 20 Q36 10 60 20 T108 20" stroke="hsl(192, 100%, 74%)" stroke-width="2.6" fill="none"/>
     <path d="M12 31 Q36 21 60 31 T108 31" stroke="hsl(204, 96%, 68%)" stroke-width="2.2" fill="none" opacity="0.8"/>`,
    'hsla(194, 96%, 62%, 0.28)'
  ),
  nirvana: wrapArtSvg(
    'nirvana',
    'hsl(276, 56%, 22%)',
    'hsl(196, 52%, 11%)',
    `<path d="M60 7 Q72 16 66 32 Q60 36 54 32 Q48 16 60 7 Z" fill="hsl(294, 92%, 74%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.4"/>
     <path d="M36 28 Q48 16 60 32 Q72 16 84 28 Q70 36 60 34 Q50 36 36 28 Z" fill="hsla(192, 96%, 68%, 0.45)" stroke="hsl(192, 100%, 80%)" stroke-width="1.5"/>`,
    'hsla(288, 94%, 64%, 0.28)'
  ),
  rushdown: wrapArtSvg(
    'rushdown',
    'hsl(352, 68%, 22%)',
    'hsl(278, 52%, 10%)',
    `<path d="M16 14 L82 22 L16 30" stroke="hsl(354, 96%, 62%)" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M38 14 L102 22 L38 30" stroke="hsl(46, 100%, 74%)" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    'hsla(354, 98%, 56%, 0.3)'
  ),
  indignation: wrapArtSvg(
    'indignation',
    'hsl(350, 68%, 22%)',
    'hsl(280, 52%, 10%)',
    `<path d="M60 5 L76 35 H44 Z" fill="hsla(354, 94%, 56%, 0.55)" stroke="hsl(48, 100%, 76%)" stroke-width="1.8"/>
     <line x1="60" y1="15" x2="60" y2="25" stroke="hsl(48, 100%, 88%)" stroke-width="2.6" stroke-linecap="round"/>
     <circle cx="60" cy="30" r="1.8" fill="hsl(48, 100%, 88%)"/>`,
    'hsla(354, 96%, 56%, 0.28)'
  ),
  sanctity: wrapArtSvg(
    'sanctity',
    'hsl(202, 54%, 22%)',
    'hsl(44, 50%, 12%)',
    `<circle cx="60" cy="22" r="14" fill="hsla(48, 100%, 74%, 0.24)" stroke="hsl(48, 100%, 80%)" stroke-width="1.8"/>
     <path d="M60 11 V33 M49 22 H71" stroke="hsl(192, 100%, 84%)" stroke-width="2.6" stroke-linecap="round"/>`,
    'hsla(48, 100%, 66%, 0.28)'
  ),
  windmill_strike: wrapArtSvg(
    'windmill_strike',
    'hsl(286, 54%, 20%)',
    'hsl(38, 48%, 11%)',
    `<path d="M60 22 L60 6 L72 16 Z M60 22 L78 22 L68 34 Z M60 22 L60 38 L48 28 Z M60 22 L42 22 L52 10 Z" fill="hsl(46, 98%, 72%)" stroke="hsl(292, 86%, 64%)" stroke-width="1.2"/>
     <circle cx="60" cy="22" r="4" fill="hsl(0, 0%, 100%)"/>`,
    'hsla(46, 98%, 62%, 0.28)'
  ),
  reach_heaven: wrapArtSvg(
    'reach_heaven',
    'hsl(288, 56%, 22%)',
    'hsl(344, 50%, 11%)',
    `<path d="M60 38 V7 M48 18 L60 6 L72 18" stroke="hsl(48, 100%, 80%)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M36 30 Q60 18 84 30" stroke="hsl(296, 94%, 72%)" stroke-width="2" fill="none"/>`,
    'hsla(48, 100%, 66%, 0.28)'
  ),
  wave_of_the_hand: wrapArtSvg(
    'wave_of_the_hand',
    'hsl(274, 52%, 20%)',
    'hsl(198, 48%, 11%)',
    `<path d="M18 30 Q44 10 70 22 Q88 30 104 14" stroke="hsl(194, 96%, 72%)" stroke-width="3" fill="none" stroke-linecap="round"/>
     <path d="M22 36 Q48 18 74 28 Q90 36 104 22" stroke="hsl(294, 92%, 72%)" stroke-width="2" fill="none"/>`,
    'hsla(286, 92%, 62%, 0.26)'
  ),
  battle_hymn: wrapArtSvg(
    'battle_hymn',
    'hsl(282, 54%, 22%)',
    'hsl(42, 52%, 11%)',
    `<path d="M48 30 V10 L76 7 V25" stroke="hsl(48, 100%, 76%)" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="44" cy="30" r="5" fill="hsl(294, 94%, 72%)" stroke="hsl(48, 100%, 80%)" stroke-width="1.3"/>
     <circle cx="72" cy="25" r="5" fill="hsl(294, 94%, 72%)" stroke="hsl(48, 100%, 80%)" stroke-width="1.3"/>`,
    'hsla(48, 98%, 64%, 0.28)'
  ),
  meditate: wrapArtSvg(
    'meditate',
    'hsl(206, 56%, 20%)',
    'hsl(274, 52%, 11%)',
    `<circle cx="60" cy="22" r="15" fill="none" stroke="hsl(192, 98%, 74%)" stroke-width="1.6" stroke-dasharray="5 3"/>
     <circle cx="60" cy="14" r="4.5" fill="hsl(48, 100%, 78%)"/>
     <path d="M44 33 Q60 20 76 33 Q60 38 44 33 Z" fill="hsl(286, 62%, 44%)" stroke="hsl(192, 98%, 76%)" stroke-width="1.5"/>`,
    'hsla(194, 96%, 62%, 0.28)'
  ),

  // === COLORLESS BESPOKE EXPANSION ===
  master_of_strategy: wrapArtSvg(
    'master_of_strategy',
    'hsl(216, 30%, 24%)',
    'hsl(42, 42%, 12%)',
    `<path d="M46 36 H74 L68 18 L74 11 L65 13 L60 7 L55 13 L46 11 L52 18 Z" fill="hsl(46, 94%, 72%)" stroke="hsl(220, 38%, 22%)" stroke-width="1.5"/>
     <circle cx="32" cy="22" r="4" fill="hsl(204, 86%, 76%)" opacity="0.75"/><circle cx="88" cy="22" r="4" fill="hsl(204, 86%, 76%)" opacity="0.75"/>`,
    'hsla(46, 96%, 64%, 0.28)'
  ),
  sadistic_nature: wrapArtSvg(
    'sadistic_nature',
    'hsl(344, 48%, 20%)',
    'hsl(268, 44%, 10%)',
    `<path d="M36 16 L54 22 L40 27 Z M84 16 L66 22 L80 27 Z" fill="hsl(352, 96%, 64%)"/>
     <path d="M42 33 Q60 40 78 33" stroke="hsl(46, 94%, 78%)" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
    'hsla(352, 90%, 54%, 0.26)'
  ),
  panache: wrapArtSvg(
    'panache',
    'hsl(218, 32%, 24%)',
    'hsl(44, 44%, 12%)',
    `<path d="M24 34 Q48 8 94 10 Q74 28 38 36 Z" fill="hsl(46, 94%, 72%)" stroke="hsl(208, 62%, 82%)" stroke-width="1.5"/>
     <path d="M26 34 Q54 20 88 12" stroke="hsl(220, 42%, 22%)" stroke-width="1.6" fill="none"/>`,
    'hsla(46, 96%, 64%, 0.28)'
  ),
  thinking_ahead: wrapArtSvg(
    'thinking_ahead',
    'hsl(218, 34%, 24%)',
    'hsl(248, 38%, 11%)',
    `<rect x="34" y="10" width="22" height="26" rx="3" fill="hsl(216, 30%, 34%)" stroke="hsl(46, 92%, 74%)" stroke-width="1.5"/>
     <path d="M62 22 H84 M77 16 L85 22 L77 28" stroke="hsl(198, 96%, 76%)" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    'hsla(204, 88%, 64%, 0.26)'
  ),
  violence: wrapArtSvg(
    'violence',
    'hsl(356, 56%, 22%)',
    'hsl(220, 32%, 11%)',
    `<path d="M24 34 L62 8 M42 36 L82 8 M62 36 L98 10" stroke="hsl(44, 62%, 88%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M24 34 L98 10" stroke="hsl(354, 96%, 60%)" stroke-width="2.2" stroke-linecap="round"/>`,
    'hsla(354, 92%, 56%, 0.28)'
  ),
  flash_of_steel: wrapArtSvg(
    'flash_of_steel',
    'hsl(212, 30%, 24%)',
    'hsl(226, 30%, 11%)',
    `<path d="M12 30 L108 12" stroke="hsl(0, 0%, 100%)" stroke-width="3.4" stroke-linecap="round"/>
     <path d="M20 34 L100 18" stroke="hsl(204, 92%, 76%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="88" cy="16" r="5" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(206, 86%, 72%, 0.28)'
  ),
  finesse: wrapArtSvg(
    'finesse',
    'hsl(216, 30%, 24%)',
    'hsl(236, 32%, 11%)',
    `<path d="M20 30 Q48 6 76 22 Q90 30 102 14" stroke="hsl(204, 92%, 78%)" stroke-width="2.6" fill="none" stroke-linecap="round"/>
     <circle cx="60" cy="18" r="6" fill="none" stroke="hsl(46, 94%, 76%)" stroke-width="1.8"/>`,
    'hsla(204, 86%, 68%, 0.24)'
  ),
  dramatic_entrance: wrapArtSvg(
    'dramatic_entrance',
    'hsl(220, 32%, 24%)',
    'hsl(36, 44%, 11%)',
    `<polygon points="60,5 72,36 48,36" fill="hsla(48, 100%, 74%, 0.34)"/>
     <polygon points="60,8 66,22 60,34 54,22" fill="hsl(48, 100%, 80%)" stroke="hsl(214, 52%, 34%)" stroke-width="1.2"/>
     <path d="M24 34 L44 26 M96 34 L76 26" stroke="hsl(44, 94%, 74%)" stroke-width="2" stroke-linecap="round"/>`,
    'hsla(46, 96%, 66%, 0.28)'
  ),
  blind: wrapArtSvg(
    'blind',
    'hsl(222, 28%, 22%)',
    'hsl(246, 30%, 10%)',
    `<path d="M24 22 Q60 6 96 22 Q60 38 24 22 Z" fill="hsl(224, 30%, 20%)" stroke="hsl(210, 54%, 74%)" stroke-width="1.6"/>
     <line x1="34" y1="8" x2="86" y2="36" stroke="hsl(354, 92%, 62%)" stroke-width="2.8" stroke-linecap="round"/>`,
    'hsla(214, 56%, 64%, 0.22)'
  ),
  trip: wrapArtSvg(
    'trip',
    'hsl(218, 28%, 22%)',
    'hsl(32, 36%, 10%)',
    `<path d="M18 32 H102" stroke="hsl(42, 76%, 64%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M44 12 L68 28 M68 28 L86 24" stroke="hsl(206, 74%, 78%)" stroke-width="2.8" fill="none" stroke-linecap="round"/>`,
    'hsla(42, 82%, 60%, 0.22)'
  ),
  bandage_up: wrapArtSvg(
    'bandage_up',
    'hsl(152, 40%, 20%)',
    'hsl(214, 32%, 11%)',
    `<rect x="53" y="8" width="14" height="28" rx="3" fill="hsl(44, 56%, 90%)" stroke="hsl(148, 76%, 56%)" stroke-width="1.5"/>
     <rect x="46" y="15" width="28" height="14" rx="3" fill="hsl(44, 56%, 90%)" stroke="hsl(148, 76%, 56%)" stroke-width="1.5"/>`,
    'hsla(148, 86%, 54%, 0.26)'
  ),
  dark_shackles: wrapArtSvg(
    'dark_shackles',
    'hsl(258, 36%, 18%)',
    'hsl(232, 36%, 9%)',
    `<ellipse cx="44" cy="22" rx="11" ry="8" fill="none" stroke="hsl(216, 36%, 72%)" stroke-width="3.2"/>
     <ellipse cx="76" cy="22" rx="11" ry="8" fill="none" stroke="hsl(216, 36%, 72%)" stroke-width="3.2"/>
     <line x1="53" y1="22" x2="67" y2="22" stroke="hsl(286, 86%, 70%)" stroke-width="3.2"/>`,
    'hsla(276, 78%, 54%, 0.24)'
  ),
  panacea: wrapArtSvg(
    'panacea',
    'hsl(198, 48%, 22%)',
    'hsl(42, 46%, 11%)',
    `<path d="M53 7 H67 V14 L76 31 A6 6 0 0 1 70 39 H50 A6 6 0 0 1 44 31 L53 14 Z" fill="hsl(194, 92%, 62%)" stroke="hsl(48, 100%, 80%)" stroke-width="1.6"/>
     <path d="M60 20 V32 M54 26 H66" stroke="hsl(0, 0%, 100%)" stroke-width="2.2" stroke-linecap="round"/>`,
    'hsla(194, 96%, 64%, 0.28)'
  ),

  // === STATUS & CURSE BESPOKE ILLUSTRATIONS ===
  burn: wrapArtSvg(
    'burn',
    'hsl(10, 68%, 22%)',
    'hsl(352, 54%, 9%)',
    `<path d="M60 4 Q76 17 70 36 Q60 40 50 36 Q44 17 60 4 Z" fill="hsl(14, 96%, 50%)" stroke="hsl(44, 100%, 70%)" stroke-width="1.5"/>
     <path d="M60 15 Q68 24 63 34 Q60 36 57 34 Q52 24 60 15 Z" fill="hsl(48, 100%, 74%)"/>`,
    'hsla(16, 98%, 52%, 0.28)'
  ),
  wound: wrapArtSvg(
    'wound',
    'hsl(352, 58%, 18%)',
    'hsl(12, 42%, 9%)',
    `<path d="M24 34 L96 10" stroke="hsl(354, 92%, 52%)" stroke-width="5" stroke-linecap="round"/>
     <path d="M36 22 L42 32 M56 16 L62 28 M76 10 L82 22" stroke="hsl(42, 42%, 82%)" stroke-width="1.8" stroke-linecap="round"/>`,
    'hsla(354, 92%, 48%, 0.26)'
  ),
  dazed: wrapArtSvg(
    'dazed',
    'hsl(226, 36%, 20%)',
    'hsl(254, 38%, 10%)',
    `<ellipse cx="60" cy="22" rx="28" ry="10" fill="none" stroke="hsl(206, 74%, 74%)" stroke-width="1.8" stroke-dasharray="6 4"/>
     <polygon points="42,14 45,19 50,20 45,22 42,27 39,22 34,20 39,19" fill="hsl(48, 96%, 76%)"/>
     <polygon points="78,16 80,20 84,21 80,23 78,27 76,23 72,21 76,20" fill="hsl(204, 96%, 78%)"/>`,
    'hsla(210, 74%, 64%, 0.24)'
  ),
  slimed: wrapArtSvg(
    'slimed',
    'hsl(132, 58%, 18%)',
    'hsl(158, 52%, 9%)',
    `<path d="M20 14 Q42 8 60 14 Q78 8 100 14 Q96 28 84 26 Q78 38 70 28 Q60 40 50 28 Q40 36 34 26 Q22 28 20 14 Z" fill="hsl(128, 76%, 44%)" stroke="hsl(120, 96%, 68%)" stroke-width="1.5"/>
     <circle cx="46" cy="20" r="2.5" fill="hsla(0,0%,100%,0.35)"/><circle cx="72" cy="19" r="2" fill="hsla(0,0%,100%,0.35)"/>`,
    'hsla(128, 92%, 48%, 0.26)'
  ),
  clumsy: wrapArtSvg(
    'clumsy',
    'hsl(274, 46%, 16%)',
    'hsl(258, 50%, 8%)',
    `<path d="M28 32 Q44 10 60 22 Q76 34 92 12" stroke="hsl(286, 72%, 64%)" stroke-width="2.4" stroke-dasharray="5 3" fill="none"/>
     <circle cx="60" cy="22" r="9" fill="hsl(274, 42%, 24%)" stroke="hsl(338, 86%, 62%)" stroke-width="1.6"/>
     <path d="M56 18 L64 26 M64 18 L56 26" stroke="hsl(344, 94%, 66%)" stroke-width="2"/>`,
    'hsla(286, 78%, 48%, 0.24)'
  ),
  doubt: wrapArtSvg(
    'doubt',
    'hsl(278, 50%, 16%)',
    'hsl(260, 52%, 8%)',
    `<path d="M48 16 A12 10 0 1 1 66 24 C63 26 60 27 60 31" stroke="hsl(296, 92%, 70%)" stroke-width="3.2" fill="none" stroke-linecap="round"/>
     <circle cx="60" cy="36" r="2.6" fill="hsl(342, 94%, 64%)"/>`,
    'hsla(292, 84%, 52%, 0.24)'
  ),
  regret: wrapArtSvg(
    'regret',
    'hsl(276, 54%, 16%)',
    'hsl(344, 50%, 8%)',
    `<path d="M60 13 C52 6 38 12 42 23 C45 30 60 38 60 38 C60 38 75 30 78 23 C82 12 68 6 60 13 Z" fill="hsl(278, 48%, 26%)" stroke="hsl(342, 92%, 62%)" stroke-width="1.6"/>
     <path d="M60 13 L56 22 L63 27 L58 36" stroke="hsl(354, 100%, 66%)" stroke-width="2" fill="none"/>`,
    'hsla(344, 88%, 50%, 0.26)'
  ),
  parasite: wrapArtSvg(
    'parasite',
    'hsl(286, 52%, 16%)',
    'hsl(152, 46%, 8%)',
    `<path d="M22 26 Q38 10 58 22 Q78 34 98 18" stroke="hsl(298, 84%, 62%)" stroke-width="4.4" fill="none" stroke-linecap="round"/>
     <circle cx="94" cy="20" r="5" fill="hsl(346, 92%, 58%)" stroke="hsl(48, 100%, 76%)" stroke-width="1.3"/>
     <path d="M38 14 L34 8 M58 28 L56 35 M76 26 L78 33" stroke="hsl(140, 86%, 58%)" stroke-width="1.8" stroke-linecap="round"/>`,
    'hsla(296, 86%, 52%, 0.26)'
  ),
  // === 100% BESPOKE COMPLETION SET (REMAINING 19 CARDS) ===
  steadfast_guard: wrapArtSvg(
    'steadfast_guard',
    'hsl(214, 44%, 20%)',
    'hsl(24, 34%, 11%)',
    `<path d="M16 40 L34 33 L86 33 L104 40 Z" fill="hsl(26, 20%, 26%)" stroke="hsl(36, 36%, 44%)" stroke-width="1.2"/>
     <path d="M44 7 H76 V23 C76 31 68 36 60 39 C52 36 44 31 44 23 Z" fill="hsl(212, 34%, 34%)" stroke="hsl(44, 86%, 68%)" stroke-width="1.8"/>
     <path d="M48 11 H72 M60 11 V34" stroke="hsl(200, 88%, 78%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="60" cy="21" r="4.2" fill="hsl(46, 98%, 72%)" stroke="hsl(24, 44%, 22%)" stroke-width="1.2"/>
     <path d="M26 24 L36 24 M84 24 L94 24" stroke="hsl(44, 92%, 68%)" stroke-width="1.8" stroke-linecap="round" opacity="0.72"/>`,
    'hsla(204, 88%, 58%, 0.24)'
  ),
  wild_strike: wrapArtSvg(
    'wild_strike',
    'hsl(4, 66%, 22%)',
    'hsl(350, 56%, 10%)',
    `<path d="M14 38 Q48 12 104 8" stroke="hsl(18, 98%, 62%)" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.72"/>
     <path d="M22 36 L68 9 L80 18 L38 40 Z" fill="hsl(36, 30%, 84%)" stroke="hsl(6, 78%, 42%)" stroke-width="1.5"/>
     <path d="M62 14 L88 12 L74 26 L98 28 L76 36" fill="none" stroke="hsl(42, 100%, 72%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
     <polygon points="94,10 102,16 93,20" fill="hsl(354, 94%, 58%)"/>
     <polygon points="24,14 33,18 26,24" fill="hsl(354, 92%, 56%)" opacity="0.85"/>`,
    'hsla(10, 96%, 54%, 0.28)'
  ),
  ambush_slash: wrapArtSvg(
    'ambush_slash',
    'hsl(356, 62%, 20%)',
    'hsl(228, 44%, 10%)',
    `<path d="M10 34 Q42 26 98 10" stroke="hsl(44, 100%, 76%)" stroke-width="3.6" stroke-linecap="round" fill="none"/>
     <path d="M18 38 Q52 30 104 18" stroke="hsl(8, 96%, 60%)" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.8"/>
     <polygon points="88,6 108,10 92,22 95,13" fill="hsl(46, 100%, 86%)"/>
     <path d="M26 10 L30 18 L38 20 L30 22 L26 30 L22 22 L14 20 L22 18 Z" fill="hsl(46, 98%, 74%)" opacity="0.85"/>`,
    'hsla(36, 96%, 58%, 0.26)'
  ),
  power_through: wrapArtSvg(
    'power_through',
    'hsl(206, 48%, 20%)',
    'hsl(356, 48%, 11%)',
    `<path d="M40 9 Q60 4 80 9 L77 35 Q60 40 43 35 Z" fill="hsl(210, 42%, 34%)" stroke="hsl(44, 88%, 70%)" stroke-width="1.9"/>
     <path d="M60 11 V34 M47 22 H73" stroke="hsl(198, 94%, 78%)" stroke-width="2" stroke-linecap="round"/>
     <polygon points="14,14 36,20 20,26" fill="hsl(354, 92%, 58%)" stroke="hsl(38, 92%, 72%)" stroke-width="1"/>
     <polygon points="106,16 84,22 100,28" fill="hsl(354, 92%, 58%)" stroke="hsl(38, 92%, 72%)" stroke-width="1"/>
     <path d="M35 16 L40 22 L34 28 M85 16 L80 22 L86 28" stroke="hsl(46, 100%, 76%)" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
    'hsla(202, 88%, 58%, 0.24)'
  ),
  tactician: wrapArtSvg(
    'tactician',
    'hsl(164, 52%, 18%)',
    'hsl(206, 48%, 10%)',
    `<rect x="26" y="10" width="68" height="24" rx="3" fill="hsl(38, 36%, 24%)" stroke="hsl(44, 82%, 64%)" stroke-width="1.4"/>
     <path d="M34 16 H50 M34 22 H46 M34 28 H52" stroke="hsl(42, 62%, 72%)" stroke-width="1.5" stroke-linecap="round" opacity="0.75"/>
     <circle cx="72" cy="22" r="9.5" fill="hsla(152, 92%, 44%, 0.3)" stroke="hsl(148, 96%, 68%)" stroke-width="1.6"/>
     <polygon points="72,14 76,22 72,30 68,22" fill="hsl(48, 100%, 74%)"/>
     <path d="M84 12 L94 8 M86 32 L96 36" stroke="hsl(148, 96%, 68%)" stroke-width="1.6" stroke-linecap="round"/>`,
    'hsla(152, 92%, 52%, 0.24)'
  ),
  reflex: wrapArtSvg(
    'reflex',
    'hsl(158, 54%, 18%)',
    'hsl(198, 48%, 10%)',
    `<path d="M18 32 Q42 8 64 20 Q84 30 102 12" fill="none" stroke="hsl(148, 96%, 66%)" stroke-width="2.4" stroke-linecap="round"/>
     <rect x="34" y="11" width="17" height="23" rx="2.5" transform="rotate(-16 42 22)" fill="hsl(164, 46%, 26%)" stroke="hsl(152, 90%, 66%)" stroke-width="1.3"/>
     <rect x="52" y="9" width="17" height="23" rx="2.5" fill="hsl(156, 54%, 34%)" stroke="hsl(48, 98%, 74%)" stroke-width="1.5"/>
     <rect x="69" y="11" width="17" height="23" rx="2.5" transform="rotate(16 77 22)" fill="hsl(170, 46%, 26%)" stroke="hsl(152, 90%, 66%)" stroke-width="1.3"/>
     <circle cx="60.5" cy="20.5" r="3.2" fill="hsl(144, 100%, 78%)"/>`,
    'hsla(150, 92%, 54%, 0.24)'
  ),
  escape_plan: wrapArtSvg(
    'escape_plan',
    'hsl(176, 48%, 18%)',
    'hsl(218, 48%, 10%)',
    `<circle cx="34" cy="30" r="10" fill="hsla(172, 34%, 56%, 0.34)" stroke="hsl(168, 56%, 68%)" stroke-width="1.2"/>
     <circle cx="48" cy="33" r="8" fill="hsla(176, 32%, 52%, 0.3)"/>
     <path d="M24 34 L86 10" stroke="hsl(44, 86%, 72%)" stroke-width="2.2" stroke-dasharray="4 2" stroke-linecap="round"/>
     <path d="M82 12 L94 7 L90 19 M86 10 L96 15" fill="none" stroke="hsl(164, 86%, 82%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M54 24 Q62 12 72 22 Q64 28 54 24 Z" fill="hsl(158, 62%, 34%)" stroke="hsl(150, 90%, 68%)" stroke-width="1.3"/>`,
    'hsla(172, 84%, 56%, 0.22)'
  ),
  concentrate: wrapArtSvg(
    'concentrate',
    'hsl(166, 54%, 18%)',
    'hsl(214, 52%, 9%)',
    `<circle cx="60" cy="22" r="15" fill="none" stroke="hsl(152, 90%, 62%)" stroke-width="1.7" stroke-dasharray="6 3"/>
     <path d="M26 22 Q60 6 94 22 Q60 38 26 22 Z" fill="hsl(168, 52%, 22%)" stroke="hsl(148, 92%, 68%)" stroke-width="1.6"/>
     <circle cx="60" cy="22" r="6.5" fill="hsl(46, 98%, 66%)" stroke="hsl(152, 100%, 78%)" stroke-width="1.3"/>
     <circle cx="60" cy="22" r="2.4" fill="hsl(168, 62%, 14%)"/>
     <path d="M18 12 L28 17 M102 12 L92 17 M18 32 L28 27 M102 32 L92 27" stroke="hsl(48, 98%, 72%)" stroke-width="1.5" stroke-linecap="round"/>`,
    'hsla(154, 92%, 54%, 0.25)'
  ),
  perseverance: wrapArtSvg(
    'perseverance',
    'hsl(274, 54%, 20%)',
    'hsl(224, 50%, 11%)',
    `<circle cx="60" cy="22" r="16" fill="hsla(286, 84%, 56%, 0.2)" stroke="hsl(46, 96%, 72%)" stroke-width="1.8"/>
     <path d="M60 7 L74 14 V24 C74 31 68 36 60 39 C52 36 46 31 46 24 V14 Z" fill="hsl(276, 54%, 34%)" stroke="hsl(292, 92%, 76%)" stroke-width="1.6"/>
     <path d="M52 15 H68 L60 22 L68 29 H52 L60 22 Z" fill="hsl(46, 98%, 74%)" opacity="0.9"/>
     <path d="M24 22 H38 M82 22 H96" stroke="hsl(194, 94%, 72%)" stroke-width="1.8" stroke-linecap="round"/>`,
    'hsla(288, 88%, 62%, 0.25)'
  ),
  reckless_charge: wrapArtSvg(
    'reckless_charge',
    'hsl(10, 68%, 22%)',
    'hsl(354, 56%, 10%)',
    `<path d="M12 28 H84 M18 18 H72 M22 36 H76" stroke="hsl(28, 98%, 64%)" stroke-width="2.4" stroke-linecap="round" opacity="0.72"/>
     <polygon points="48,10 96,22 48,34 62,22" fill="hsl(38, 96%, 72%)" stroke="hsl(8, 88%, 48%)" stroke-width="1.6"/>
     <path d="M96 22 L106 14 M96 22 L108 22 M96 22 L106 30" stroke="hsl(48, 100%, 82%)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="28" cy="12" r="2.2" fill="hsl(206, 90%, 78%)"/><circle cx="38" cy="8" r="1.8" fill="hsl(48, 100%, 80%)"/>`,
    'hsla(18, 98%, 54%, 0.28)'
  ),
  sentinel: wrapArtSvg(
    'sentinel',
    'hsl(208, 48%, 20%)',
    'hsl(278, 44%, 11%)',
    `<path d="M60 6 L77 13 V24 C77 32 69 37 60 40 C51 37 43 32 43 24 V13 Z" fill="hsl(214, 48%, 34%)" stroke="hsl(46, 94%, 70%)" stroke-width="1.8"/>
     <polygon points="60,12 66,22 60,32 54,22" fill="hsl(194, 98%, 74%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.2"/>
     <path d="M24 34 Q32 20 40 28 M96 34 Q88 20 80 28" stroke="hsl(286, 92%, 70%)" stroke-width="2" fill="none" stroke-linecap="round"/>
     <circle cx="28" cy="14" r="2.4" fill="hsl(46, 100%, 76%)"/><circle cx="92" cy="14" r="2.4" fill="hsl(46, 100%, 76%)"/>`,
    'hsla(204, 90%, 60%, 0.25)'
  ),
  outmaneuver: wrapArtSvg(
    'outmaneuver',
    'hsl(152, 54%, 18%)',
    'hsl(204, 48%, 10%)',
    `<path d="M16 36 Q48 6 90 14" fill="none" stroke="hsl(148, 96%, 66%)" stroke-width="2.8" stroke-linecap="round"/>
     <polygon points="78,7 96,14 82,24 85,15" fill="hsl(48, 100%, 76%)"/>
     <path d="M46 36 L56 18 L64 26 L74 10" fill="none" stroke="hsl(48, 100%, 74%)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
     <polygon points="22,38 30,26 38,38" fill="hsl(172, 34%, 34%)" stroke="hsl(158, 60%, 56%)" stroke-width="1.1"/>`,
    'hsla(148, 94%, 56%, 0.24)'
  ),
  all_out_attack: wrapArtSvg(
    'all_out_attack',
    'hsl(148, 52%, 17%)',
    'hsl(352, 48%, 10%)',
    `<path d="M14 28 L104 10 M16 20 L102 24 M18 12 L98 36" stroke="hsl(150, 94%, 72%)" stroke-width="2.4" stroke-linecap="round"/>
     <polygon points="94,7 108,10 96,17" fill="hsl(46, 98%, 76%)"/>
     <polygon points="92,19 106,24 93,29" fill="hsl(146, 100%, 74%)"/>
     <polygon points="88,30 102,37 87,39" fill="hsl(356, 94%, 64%)"/>
     <rect x="26" y="25" width="12" height="15" rx="2" transform="rotate(-24 32 32)" fill="hsl(164, 44%, 28%)" stroke="hsl(46, 92%, 70%)" stroke-width="1.2" opacity="0.88"/>`,
    'hsla(152, 92%, 52%, 0.25)'
  ),
  expertise: wrapArtSvg(
    'expertise',
    'hsl(168, 52%, 18%)',
    'hsl(210, 48%, 10%)',
    `<rect x="26" y="13" width="14" height="22" rx="2" transform="rotate(-24 33 24)" fill="hsl(168, 44%, 28%)" stroke="hsl(152, 86%, 64%)" stroke-width="1.2"/>
     <rect x="40" y="10" width="14" height="22" rx="2" transform="rotate(-10 47 21)" fill="hsl(164, 48%, 32%)" stroke="hsl(152, 86%, 64%)" stroke-width="1.2"/>
     <rect x="54" y="8" width="14" height="22" rx="2" fill="hsl(158, 54%, 38%)" stroke="hsl(46, 96%, 72%)" stroke-width="1.5"/>
     <rect x="68" y="10" width="14" height="22" rx="2" transform="rotate(10 75 21)" fill="hsl(164, 48%, 32%)" stroke="hsl(152, 86%, 64%)" stroke-width="1.2"/>
     <rect x="81" y="13" width="14" height="22" rx="2" transform="rotate(24 88 24)" fill="hsl(168, 44%, 28%)" stroke="hsl(152, 86%, 64%)" stroke-width="1.2"/>
     <circle cx="61" cy="19" r="3" fill="hsl(48, 100%, 78%)"/>`,
    'hsla(156, 90%, 54%, 0.24)'
  ),
  swivel: wrapArtSvg(
    'swivel',
    'hsl(278, 56%, 21%)',
    'hsl(326, 48%, 11%)',
    `<ellipse cx="60" cy="22" rx="34" ry="13" fill="none" stroke="hsl(292, 92%, 74%)" stroke-width="2.4" stroke-dasharray="28 8"/>
     <ellipse cx="60" cy="22" rx="20" ry="8" fill="hsla(46, 96%, 68%, 0.22)" stroke="hsl(46, 98%, 74%)" stroke-width="1.8"/>
     <polygon points="88,12 99,18 89,25" fill="hsl(48, 100%, 80%)"/>
     <polygon points="32,32 21,26 31,19" fill="hsl(294, 96%, 76%)"/>
     <circle cx="60" cy="22" r="4.5" fill="hsl(50, 100%, 88%)"/>`,
    'hsla(292, 92%, 62%, 0.26)'
  ),
  deep_breath: wrapArtSvg(
    'deep_breath',
    'hsl(206, 36%, 22%)',
    'hsl(228, 38%, 11%)',
    `<path d="M16 26 Q38 10 60 22 Q82 34 104 16" fill="none" stroke="hsl(196, 86%, 78%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M22 32 Q46 18 66 26 Q86 34 100 24" fill="none" stroke="hsl(214, 72%, 82%)" stroke-width="1.6" stroke-linecap="round" opacity="0.72"/>
     <circle cx="60" cy="22" r="9.5" fill="hsla(198, 92%, 72%, 0.2)" stroke="hsl(46, 86%, 78%)" stroke-width="1.5" stroke-dasharray="4 3"/>
     <circle cx="60" cy="22" r="3.4" fill="hsl(194, 100%, 88%)"/>`,
    'hsla(198, 86%, 72%, 0.22)'
  ),
  swift_strike: wrapArtSvg(
    'swift_strike',
    'hsl(216, 28%, 24%)',
    'hsl(232, 30%, 11%)',
    `<path d="M14 34 L104 10" stroke="hsl(48, 92%, 84%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M22 38 L94 18" stroke="hsl(202, 88%, 78%)" stroke-width="2" stroke-linecap="round"/>
     <polygon points="90,6 108,10 94,19" fill="hsl(48, 100%, 90%)"/>
     <path d="M36 12 L39 18 L45 20 L39 22 L36 28 L33 22 L27 20 L33 18 Z" fill="hsl(200, 96%, 84%)" opacity="0.88"/>`,
    'hsla(206, 76%, 74%, 0.24)'
  ),
  good_instincts: wrapArtSvg(
    'good_instincts',
    'hsl(214, 30%, 23%)',
    'hsl(234, 30%, 11%)',
    `<path d="M56 7 L76 14 V24 C76 32 68 37 56 40 C44 37 36 32 36 24 V14 Z" fill="hsla(208, 62%, 44%, 0.42)" stroke="hsl(46, 92%, 76%)" stroke-width="1.8"/>
     <path d="M84 14 L104 8 M84 22 L106 22 M84 30 L102 36" stroke="hsl(200, 92%, 78%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="56" cy="22" r="5" fill="hsl(46, 98%, 78%)" stroke="hsl(210, 60%, 24%)" stroke-width="1.3"/>
     <path d="M20 22 Q28 14 36 22" fill="none" stroke="hsl(202, 88%, 80%)" stroke-width="1.8" stroke-linecap="round"/>`,
    'hsla(208, 72%, 72%, 0.22)'
  ),
  impatience: wrapArtSvg(
    'impatience',
    'hsl(220, 28%, 22%)',
    'hsl(344, 32%, 11%)',
    `<path d="M46 7 H74 L62 22 L74 37 H46 L58 22 Z" fill="hsla(44, 78%, 68%, 0.24)" stroke="hsl(46, 90%, 74%)" stroke-width="1.6"/>
     <path d="M60 12 L55 21 H64 L58 32" fill="none" stroke="hsl(14, 98%, 68%)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
     <rect x="20" y="13" width="15" height="20" rx="2" transform="rotate(-12 27 23)" fill="hsl(216, 32%, 34%)" stroke="hsl(46, 88%, 74%)" stroke-width="1.3"/>
     <rect x="85" y="13" width="15" height="20" rx="2" transform="rotate(12 92 23)" fill="hsl(216, 32%, 34%)" stroke="hsl(46, 88%, 74%)" stroke-width="1.3"/>`,
    'hsla(36, 84%, 66%, 0.24)'
  ),
});

export const CARD_THEME_ART = Object.freeze({
  // === IRONCLAD THEMES (BESPOKE IRONCLAD STRIKE & DEFEND) ===
  iron_slash: wrapArtSvg(
    'iron_slash',
    'hsl(8, 60%, 22%)',
    'hsl(20, 48%, 10%)',
    `<path d="M16 37 Q54 11 102 8" stroke="hsl(28, 98%, 64%)" stroke-width="3.8" stroke-linecap="round" fill="none" opacity="0.78"/>
     <path d="M22 39 Q60 18 100 16" stroke="hsl(8, 96%, 56%)" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.62"/>
     <polygon points="32,35 84,8 92,14 40,39" fill="hsl(38, 32%, 86%)" stroke="hsl(14, 52%, 28%)" stroke-width="1.4"/>
     <line x1="40" y1="34" x2="84" y2="12" stroke="hsl(48, 100%, 88%)" stroke-width="1.2" opacity="0.8"/>
     <path d="M56 24 L62 21 M66 19 L72 16" stroke="hsl(22, 100%, 60%)" stroke-width="1.6" stroke-linecap="round"/>
     <rect x="26" y="30" width="16" height="4.5" rx="1.5" transform="rotate(-30 34 32)" fill="hsl(44, 92%, 62%)" stroke="hsl(24, 48%, 22%)" stroke-width="1"/>
     <circle cx="96" cy="12" r="2.4" fill="hsl(46, 100%, 82%)"/><circle cx="88" cy="24" r="1.8" fill="hsl(24, 100%, 66%)"/>`,
    'hsla(16, 94%, 54%, 0.26)'
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
    'hsl(214, 46%, 20%)',
    'hsl(8, 36%, 10%)',
    `<path d="M60 5 L80 12 V24 C80 33 71 38 60 41 C49 38 40 33 40 24 V12 Z" fill="hsl(214, 42%, 34%)" stroke="hsl(44, 86%, 68%)" stroke-width="1.9"/>
     <path d="M60 9 L75 14.5 V23.5 C75 30 68 34 60 36.5 C52 34 45 30 45 23.5 V14.5 Z" fill="hsl(8, 52%, 32%)" stroke="hsl(42, 74%, 60%)" stroke-width="1"/>
     <path d="M60 11 V34 M48 22 H72" stroke="hsl(44, 92%, 72%)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="60" cy="22" r="4.2" fill="hsl(46, 98%, 74%)" stroke="hsl(22, 46%, 20%)" stroke-width="1.2"/>
     <path d="M24 14 L34 19 M22 26 L34 25 M96 14 L86 19" stroke="hsl(200, 94%, 76%)" stroke-width="1.8" stroke-linecap="round" opacity="0.72"/>`,
    'hsla(204, 88%, 58%, 0.24)'
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

  // === SILENT THEMES (BESPOKE SILENT STRIKE & DEFEND) ===
  silent_shiv: wrapArtSvg(
    'silent_shiv',
    'hsl(158, 54%, 18%)',
    'hsl(186, 50%, 9%)',
    `<path d="M16 34 Q54 12 102 10" stroke="hsl(148, 96%, 62%)" stroke-width="2.4" stroke-linecap="round" fill="none" opacity="0.65"/>
     <path d="M24 34 Q48 16 86 9 L92 15 Q58 26 34 38 Z" fill="hsl(164, 38%, 88%)" stroke="hsl(150, 90%, 54%)" stroke-width="1.3"/>
     <path d="M36 28 Q58 18 86 12" stroke="hsl(136, 100%, 72%)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
     <path d="M44 37 Q66 24 98 16 L102 21 Q74 31 52 40 Z" fill="hsl(164, 34%, 78%)" stroke="hsl(150, 86%, 54%)" stroke-width="1.2" opacity="0.88"/>
     <rect x="20" y="32" width="12" height="3.8" rx="1.4" transform="rotate(-24 26 34)" fill="hsl(32, 54%, 44%)"/>
     <circle cx="96" cy="12" r="2.2" fill="hsl(132, 100%, 76%)"/>`,
    'hsla(150, 92%, 52%, 0.24)'
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
    'hsl(172, 52%, 18%)',
    'hsl(204, 48%, 9%)',
    `<path d="M22 36 Q38 14 60 11 Q82 14 98 36 Q78 28 60 36 Q42 28 22 36 Z" fill="hsl(168, 48%, 22%)" stroke="hsl(152, 84%, 58%)" stroke-width="1.5"/>
     <path d="M60 6 L77 13 V24 C77 32 69 37 60 40 C51 37 43 32 43 24 V13 Z" fill="hsla(166, 58%, 32%, 0.88)" stroke="hsl(150, 92%, 68%)" stroke-width="1.7"/>
     <path d="M52 19 L68 25 M68 19 L52 25" stroke="hsl(48, 92%, 74%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M18 24 Q60 8 102 24" fill="none" stroke="hsl(156, 92%, 70%)" stroke-width="1.7" opacity="0.72"/>`,
    'hsla(160, 88%, 54%, 0.24)'
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

  // === WATCHER THEMES (BESPOKE WATCHER STRIKE & DEFEND) ===
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
    'hsl(200, 58%, 20%)',
    'hsl(264, 52%, 11%)',
    `<circle cx="60" cy="21" r="15" fill="hsla(194, 94%, 60%, 0.2)" stroke="hsl(194, 98%, 74%)" stroke-width="1.8"/>
     <path d="M60 8 Q68 17 60 28 Q52 17 60 8 Z" fill="hsl(288, 84%, 68%)" stroke="hsl(46, 98%, 76%)" stroke-width="1.2"/>
     <path d="M46 21 Q54 17 60 27 Q66 17 74 21" fill="none" stroke="hsl(192, 100%, 82%)" stroke-width="1.7" stroke-linecap="round"/>
     <path d="M18 32 Q39 27 60 32 Q81 37 102 32" stroke="hsl(192, 98%, 74%)" stroke-width="1.9" fill="none" stroke-linecap="round"/>
     <circle cx="60" cy="18" r="2.6" fill="hsl(50, 100%, 92%)"/>`,
    'hsla(194, 96%, 62%, 0.26)'
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
    'hsl(280, 56%, 21%)',
    'hsl(328, 50%, 11%)',
    `<path d="M16 34 Q52 14 98 11" stroke="hsl(294, 94%, 74%)" stroke-width="3.2" stroke-linecap="round" fill="none" opacity="0.82"/>
     <path d="M26 38 Q58 24 98 24" stroke="hsl(46, 98%, 72%)" stroke-width="2.1" stroke-linecap="round" fill="none" opacity="0.85"/>
     <line x1="22" y1="36" x2="86" y2="14" stroke="hsl(42, 86%, 64%)" stroke-width="3.4" stroke-linecap="round"/>
     <path d="M86 14 Q96 7 100 18 Q90 19 86 14 Z" fill="hsl(294, 94%, 74%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.3"/>
     <circle cx="88" cy="14" r="4" fill="hsl(50, 100%, 88%)"/>`,
    'hsla(292, 92%, 64%, 0.26)'
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
