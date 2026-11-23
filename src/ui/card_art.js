/**
 * Rich inline SVG card illustration system covering all 234 cards with 100% bespoke 16:9 artwork:
 * - 232 bespoke signature illustrations (100% of every non-shared card in CARD_LIBRARY)
 * - 6 class-specific hero illustrations for shared Strike & Defend (Ironclad / Silent / Watcher)
 * Uses tall framed 128×72 (16:9) miniature compositions with multi-layered scenes, custom metallic/glow
 * gradients, radial spotlights, parallax Spire depth silhouettes, etched corner filigree, and unique
 * `ca-*` IDs so every card renders vividly on desktop and 390px mobile.
 */

function wrapArtSvg(key, bg1, bg2, inner, accent = 'rgba(255,255,255,0.16)', defsExtra = '') {
  return `<svg viewBox="0 0 128 72" class="card-art-svg" data-card-art="${key}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="ca-${key}-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${bg1}"/><stop offset="100%" stop-color="${bg2}"/></linearGradient><radialGradient id="ca-${key}-spot" cx="50%" cy="44%" r="60%"><stop offset="0%" stop-color="${accent}"/><stop offset="68%" stop-color="rgba(0,0,0,0)"/><stop offset="100%" stop-color="rgba(0,0,0,0.22)"/></radialGradient><linearGradient id="ca-${key}-vig" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(255,248,230,0.09)"/><stop offset="18%" stop-color="rgba(0,0,0,0)"/><stop offset="76%" stop-color="rgba(0,0,0,0)"/><stop offset="100%" stop-color="rgba(0,0,0,0.42)"/></linearGradient>${defsExtra}</defs><rect width="128" height="72" fill="url(#ca-${key}-bg)"/><rect width="128" height="72" fill="url(#ca-${key}-spot)"/><path d="M0 72 L0 56 L14 48 L27 56 L42 44 L58 54 L74 45 L91 55 L108 47 L128 54 L128 72 Z" fill="rgba(0,0,0,0.2)"/><path d="M0 72 L0 63 L19 58 L39 64 L64 56 L88 63 L110 58 L128 62 L128 72 Z" fill="rgba(0,0,0,0.18)"/><path d="M-8 72 L38 0 L58 0 L12 72 Z" fill="rgba(255,255,255,0.04)"/>${inner}<rect width="128" height="72" fill="url(#ca-${key}-vig)"/><path d="M3 11 V3 H11 M125 11 V3 H117 M3 61 V69 H11 M125 61 V69 H117" fill="none" stroke="rgba(255,245,220,0.24)" stroke-width="0.9" stroke-linecap="square"/></svg>`;
}

export const SIGNATURE_CARD_ART = Object.freeze({
  double_tap: wrapArtSvg(
    'double_tap',
    'hsl(10, 66%, 20%)',
    'hsl(350, 56%, 8%)',
    `<circle cx="70" cy="36" r="34" fill="url(#ca-double_tap-glow)"/>
     <path d="M10 56 Q34 22 80 8 Q54 28 24 62 Z" fill="hsl(20, 96%, 54%)" opacity="0.26"/>
     <path d="M26 64 Q58 26 112 10 Q80 34 42 66 Z" fill="hsl(38, 100%, 62%)" opacity="0.34"/>
     <path d="M18 52 L66 10 L76 11 L68 21 L28 58 Z" fill="url(#ca-double_tap-ghost)" stroke="hsl(36, 100%, 74%)" stroke-width="0.9" opacity="0.72"/>
     <path d="M16 47 L31 61" stroke="hsl(28, 96%, 62%)" stroke-width="3.2" stroke-linecap="round" opacity="0.58"/>
     <path d="M40 58 L94 11 L107 10 L98 24 L52 64 Z" fill="rgba(0,0,0,0.42)" transform="translate(2,3)"/>
     <path d="M40 58 L94 11 L107 10 L98 24 L52 64 Z" fill="url(#ca-double_tap-blade)" stroke="hsl(16, 82%, 38%)" stroke-width="1.3"/>
     <path d="M46 57 L99 13" stroke="hsl(52, 100%, 96%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M51 60 L94 22" stroke="hsl(16, 76%, 36%)" stroke-width="1.1" opacity="0.65"/>
     <path d="M35 49 L55 66" stroke="url(#ca-double_tap-guard)" stroke-width="4.2" stroke-linecap="round"/>
     <path d="M44 58 L33 66" stroke="hsl(14, 56%, 24%)" stroke-width="4" stroke-linecap="round"/>
     <circle cx="32" cy="66" r="3" fill="hsl(42, 96%, 66%)" stroke="hsl(14, 72%, 28%)" stroke-width="1"/>
     <path d="M84 44 Q102 36 116 26 M12 36 Q26 26 42 18" stroke="hsl(44, 100%, 78%)" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.85"/>
     <circle cx="88" cy="14" r="2.2" fill="hsl(50, 100%, 90%)"/>
     <circle cx="110" cy="24" r="1.8" fill="hsl(36, 100%, 70%)"/>
     <circle cx="24" cy="24" r="1.7" fill="hsl(44, 100%, 76%)"/>`,
    'hsla(24, 96%, 54%, 0.28)',
    `<radialGradient id="ca-double_tap-glow" cx="56%" cy="48%" r="48%"><stop offset="0%" stop-color="hsl(38, 100%, 70%)" stop-opacity="0.55"/><stop offset="60%" stop-color="hsl(14, 92%, 44%)" stop-opacity="0.2"/><stop offset="100%" stop-color="hsl(352, 70%, 14%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-double_tap-ghost" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(12, 88%, 48%)" stop-opacity="0.28"/><stop offset="55%" stop-color="hsl(34, 98%, 66%)" stop-opacity="0.68"/><stop offset="100%" stop-color="hsl(48, 100%, 84%)" stop-opacity="0.82"/></linearGradient><linearGradient id="ca-double_tap-blade" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(24, 34%, 44%)"/><stop offset="48%" stop-color="hsl(40, 88%, 74%)"/><stop offset="100%" stop-color="hsl(50, 100%, 92%)"/></linearGradient><linearGradient id="ca-double_tap-guard" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(44, 92%, 70%)"/><stop offset="100%" stop-color="hsl(18, 72%, 34%)"/></linearGradient>`
  ),
  berserk: wrapArtSvg(
    'berserk',
    'hsl(352, 74%, 20%)',
    'hsl(8, 60%, 8%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-berserk-aura)"/>
     <path d="M22 66 Q20 40 34 26 Q38 10 52 18 Q64 4 76 18 Q90 10 94 26 Q108 40 106 66 Z" fill="url(#ca-berserk-fire)" opacity="0.48"/>
     <path d="M12 22 L32 32 L18 44 M116 22 L96 32 L110 44" stroke="hsl(28, 100%, 64%)" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M40 20 Q64 8 88 20 L92 48 L78 64 L50 64 L36 48 Z" fill="rgba(0,0,0,0.45)" transform="translate(2,3)"/>
     <path d="M40 20 Q64 8 88 20 L92 48 L78 64 L50 64 L36 48 Z" fill="url(#ca-berserk-helm)" stroke="hsl(34, 92%, 62%)" stroke-width="1.5"/>
     <path d="M44 20 L30 9 L37 28 Z M84 20 L98 9 L91 28 Z" fill="hsl(34, 52%, 72%)" stroke="hsl(14, 52%, 26%)" stroke-width="1"/>
     <path d="M64 13 L64 46 M44 29 L64 36 L84 29" stroke="hsl(38, 100%, 68%)" stroke-width="1.5" fill="none"/>
     <path d="M45 31 L59 36 L48 41 Z M83 31 L69 36 L80 41 Z" fill="hsl(48, 100%, 84%)" stroke="hsl(20, 100%, 54%)" stroke-width="0.9"/>
     <path d="M51 50 L56 46 L61 52 L67 52 L72 46 L77 50 L73 59 L55 59 Z" fill="hsl(354, 88%, 46%)" stroke="hsl(44, 100%, 72%)" stroke-width="1"/>
     <path d="M61 14 L57 25 L62 32 M75 43 L83 51" stroke="hsl(44, 100%, 78%)" stroke-width="1.3" fill="none" stroke-linecap="round"/>
     <ellipse cx="22" cy="54" rx="7" ry="4" transform="rotate(-24 22 54)" fill="none" stroke="url(#ca-berserk-iron)" stroke-width="2.6"/>
     <ellipse cx="106" cy="54" rx="7" ry="4" transform="rotate(24 106 54)" fill="none" stroke="url(#ca-berserk-iron)" stroke-width="2.6"/>
     <path d="M28 50 L36 46 M100 50 L92 46" stroke="hsl(48, 100%, 84%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="36" cy="14" r="2" fill="hsl(46, 100%, 80%)"/>
     <circle cx="94" cy="15" r="2.2" fill="hsl(36, 100%, 72%)"/>
     <circle cx="16" cy="36" r="1.6" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(358, 96%, 54%, 0.3)',
    `<radialGradient id="ca-berserk-aura" cx="50%" cy="48%" r="48%"><stop offset="0%" stop-color="hsl(32, 100%, 62%)" stop-opacity="0.62"/><stop offset="55%" stop-color="hsl(354, 90%, 42%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(350, 70%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-berserk-helm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(14, 34%, 38%)"/><stop offset="50%" stop-color="hsl(354, 56%, 22%)"/><stop offset="100%" stop-color="hsl(350, 48%, 11%)"/></linearGradient><linearGradient id="ca-berserk-fire" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(354, 92%, 44%)"/><stop offset="55%" stop-color="hsl(22, 100%, 58%)"/><stop offset="100%" stop-color="hsl(48, 100%, 82%)"/></linearGradient><linearGradient id="ca-berserk-iron" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 18%, 62%)"/><stop offset="100%" stop-color="hsl(220, 18%, 22%)"/></linearGradient>`
  ),
  phantasmal_killer: wrapArtSvg(
    'phantasmal_killer',
    'hsl(172, 54%, 15%)',
    'hsl(216, 54%, 7%)',
    `<ellipse cx="64" cy="36" rx="54" ry="30" fill="url(#ca-phantasmal_killer-aura)"/>
     <path d="M2 62 Q24 44 46 54 Q64 46 84 56 Q106 42 126 60 L126 72 L2 72 Z" fill="hsla(166, 68%, 22%, 0.36)"/>
     <path d="M22 66 Q26 24 46 14 Q62 24 64 66 Z" fill="hsla(156, 86%, 44%, 0.16)" stroke="hsla(152, 94%, 66%, 0.34)" stroke-width="0.9"/>
     <path d="M64 66 Q66 24 82 14 Q102 24 106 66 Z" fill="hsla(156, 86%, 44%, 0.16)" stroke="hsla(152, 94%, 66%, 0.34)" stroke-width="0.9"/>
     <path d="M34 67 Q36 22 64 9 Q92 22 94 67 Q79 58 64 65 Q49 58 34 67 Z" fill="url(#ca-phantasmal_killer-cloak)" stroke="hsl(188, 60%, 7%)" stroke-width="1.6"/>
     <path d="M40 60 Q44 26 64 13 Q84 26 88 60" fill="none" stroke="hsla(152, 92%, 68%, 0.45)" stroke-width="1"/>
     <path d="M51 24 Q64 13 77 24 L74 37 Q64 43 54 37 Z" fill="url(#ca-phantasmal_killer-mask)" stroke="hsl(186, 52%, 10%)" stroke-width="1.3"/>
     <path d="M53 20 Q46 11 49 7 Q54 12 58 17 M75 20 Q82 11 79 7 Q74 12 70 17" fill="hsl(154, 30%, 84%)" stroke="hsl(182, 48%, 12%)" stroke-width="1"/>
     <polygon points="56,28 62,30 57,33" fill="hsl(144, 100%, 74%)"/>
     <polygon points="72,28 66,30 71,33" fill="hsl(144, 100%, 74%)"/>
     <path d="M16 58 L54 34 L59 38 L22 62 Z" fill="url(#ca-phantasmal_killer-blade)" stroke="hsl(184, 58%, 10%)" stroke-width="1.1"/>
     <path d="M112 58 L74 34 L69 38 L106 62 Z" fill="url(#ca-phantasmal_killer-blade)" stroke="hsl(184, 58%, 10%)" stroke-width="1.1"/>
     <path d="M10 48 Q30 34 48 44 M118 48 Q98 34 80 44" fill="none" stroke="hsl(148, 100%, 76%)" stroke-width="1.4" stroke-linecap="round" opacity="0.8"/>
     <circle cx="28" cy="20" r="1.8" fill="hsl(148, 100%, 78%)" opacity="0.75"/>
     <circle cx="101" cy="22" r="2" fill="hsl(152, 100%, 78%)" opacity="0.7"/>
     <circle cx="64" cy="52" r="1.6" fill="hsl(146, 100%, 82%)"/>`,
    'hsla(154, 92%, 52%, 0.28)',
    `<radialGradient id="ca-phantasmal_killer-aura" cx="50%" cy="46%" r="48%"><stop offset="0%" stop-color="hsla(152, 96%, 62%, 0.36)"/><stop offset="100%" stop-color="hsla(170, 80%, 20%, 0)"/></radialGradient><linearGradient id="ca-phantasmal_killer-cloak" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(166, 54%, 26%)"/><stop offset="65%" stop-color="hsl(182, 50%, 14%)"/><stop offset="100%" stop-color="hsla(206, 58%, 8%, 0.15)"/></linearGradient><linearGradient id="ca-phantasmal_killer-mask" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(150, 34%, 92%)"/><stop offset="100%" stop-color="hsl(166, 30%, 60%)"/></linearGradient><linearGradient id="ca-phantasmal_killer-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(154, 100%, 88%)"/><stop offset="100%" stop-color="hsl(166, 86%, 46%)"/></linearGradient>`
  ),
  die_die_die: wrapArtSvg(
    'die_die_die',
    'hsl(352, 54%, 17%)',
    'hsl(180, 48%, 7%)',
    `<ellipse cx="64" cy="50" rx="56" ry="26" fill="url(#ca-die_die_die-impact)"/>
     <path d="M4 20 L124 62 M124 20 L4 62" stroke="hsla(352, 94%, 56%, 0.34)" stroke-width="4" stroke-linecap="round"/>
     <path d="M10 10 L58 50 L49 54 L14 18 Z" fill="url(#ca-die_die_die-steel)" stroke="hsl(210, 48%, 8%)" stroke-width="1.3"/>
     <path d="M12 12 L55 48" stroke="hsl(0, 0%, 100%)" stroke-width="0.9" opacity="0.8"/>
     <path d="M118 10 L70 50 L79 54 L114 18 Z" fill="url(#ca-die_die_die-steel)" stroke="hsl(210, 48%, 8%)" stroke-width="1.3"/>
     <path d="M116 12 L73 48" stroke="hsl(0, 0%, 100%)" stroke-width="0.9" opacity="0.8"/>
     <polygon points="64,62 56,14 64,7 72,14" fill="url(#ca-die_die_die-steel)" stroke="hsl(210, 48%, 8%)" stroke-width="1.4"/>
     <line x1="64" y1="9" x2="64" y2="57" stroke="hsl(180, 100%, 96%)" stroke-width="1"/>
     <rect x="55" y="12" width="18" height="3.5" rx="1.2" fill="hsl(40, 74%, 58%)" stroke="hsl(20, 50%, 12%)" stroke-width="0.9"/>
     <path d="M26 56 Q64 36 102 56 Q64 46 26 56 Z" fill="url(#ca-die_die_die-crimson)"/>
     <path d="M36 65 Q64 48 92 65" fill="none" stroke="hsl(142, 94%, 64%)" stroke-width="2" stroke-linecap="round"/>
     <polygon points="64,52 70,64 64,60 58,64" fill="hsl(44, 100%, 78%)"/>
     <path d="M26 38 L40 44 M102 38 L88 44 M44 66 L52 58 M84 66 L76 58" stroke="hsl(354, 98%, 68%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="38" cy="24" r="2" fill="hsl(354, 96%, 64%)"/>
     <circle cx="90" cy="24" r="2" fill="hsl(146, 94%, 62%)"/>
     <circle cx="64" cy="48" r="3" fill="hsl(48, 100%, 88%)"/>`,
    'hsla(352, 92%, 52%, 0.28)',
    `<radialGradient id="ca-die_die_die-impact" cx="50%" cy="68%" r="44%"><stop offset="0%" stop-color="hsla(354, 100%, 62%, 0.65)"/><stop offset="55%" stop-color="hsla(142, 90%, 46%, 0.25)"/><stop offset="100%" stop-color="hsla(350, 80%, 10%, 0)"/></radialGradient><linearGradient id="ca-die_die_die-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(186, 40%, 94%)"/><stop offset="55%" stop-color="hsl(192, 26%, 68%)"/><stop offset="100%" stop-color="hsl(204, 34%, 34%)"/></linearGradient><linearGradient id="ca-die_die_die-crimson" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(354, 96%, 64%)"/><stop offset="100%" stop-color="hsl(344, 82%, 34%)"/></linearGradient>`
  ),
  deus_ex_machina: wrapArtSvg(
    'deus_ex_machina',
    'hsl(262, 56%, 20%)',
    'hsl(284, 50%, 8%)',
    `<path d="M40 0 L88 0 L102 72 L26 72 Z" fill="url(#ca-deus_ex_machina-aura)" opacity="0.55"/>
     <path d="M0 16 Q18 22 30 10 Q42 22 52 14 L52 0 L0 0 Z M76 14 Q86 22 98 10 Q110 22 128 16 L128 0 L76 0 Z" fill="hsl(268, 48%, 12%)" opacity="0.72"/>
     <circle cx="64" cy="36" r="27" fill="none" stroke="hsl(44, 90%, 66%)" stroke-width="1.1" stroke-dasharray="4 3" opacity="0.65"/>
     <path d="M64 12 L68 17 L75 15 L76 21 L83 22 L81 28 L87 32 L83 38 L87 44 L81 48 L83 54 L76 55 L75 61 L68 59 L64 64 L60 59 L53 61 L52 55 L45 54 L47 48 L41 44 L45 38 L41 32 L47 28 L45 22 L52 21 L53 15 L60 17 Z" fill="hsl(274, 54%, 14%)" opacity="0.65" transform="translate(1.5,2)"/>
     <path d="M64 12 L68 17 L75 15 L76 21 L83 22 L81 28 L87 32 L83 38 L87 44 L81 48 L83 54 L76 55 L75 61 L68 59 L64 64 L60 59 L53 61 L52 55 L45 54 L47 48 L41 44 L45 38 L41 32 L47 28 L45 22 L52 21 L53 15 L60 17 Z" fill="none" stroke="url(#ca-deus_ex_machina-gold)" stroke-width="2.4" stroke-linejoin="round"/>
     <circle cx="64" cy="38" r="14" fill="hsl(272, 52%, 18%)" stroke="hsl(46, 96%, 72%)" stroke-width="1.4"/>
     <polygon points="64,20 75,38 64,56 53,38" fill="url(#ca-deus_ex_machina-core)" stroke="hsl(50, 100%, 90%)" stroke-width="1.1"/>
     <polygon points="64,25 69,38 64,45 59,38" fill="hsl(52, 100%, 96%)" opacity="0.82"/>
     <path d="M27 6 V31 M101 6 V31" stroke="hsl(44, 92%, 72%)" stroke-width="1.1" opacity="0.72"/>
     <circle cx="27" cy="40" r="8.5" fill="url(#ca-deus_ex_machina-core)" stroke="hsl(48, 100%, 84%)" stroke-width="1.4"/>
     <circle cx="101" cy="40" r="8.5" fill="url(#ca-deus_ex_machina-core)" stroke="hsl(48, 100%, 84%)" stroke-width="1.4"/>
     <path d="M27 33 L29 38 L34 40 L29 42 L27 47 L25 42 L20 40 L25 38 Z M101 33 L103 38 L108 40 L103 42 L101 47 L99 42 L94 40 L99 38 Z" fill="hsl(54, 100%, 96%)"/>
     <path d="M16 58 Q40 52 64 62 Q88 52 112 58" fill="none" stroke="hsl(46, 96%, 74%)" stroke-width="1.2" opacity="0.6"/>
     <circle cx="42" cy="18" r="1.5" fill="hsl(50, 100%, 92%)"/>
     <circle cx="86" cy="56" r="1.8" fill="hsl(46, 100%, 84%)"/>`,
    'hsla(46, 98%, 62%, 0.28)',
    `<radialGradient id="ca-deus_ex_machina-aura" cx="50%" cy="46%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 88%)" stop-opacity="0.85"/><stop offset="48%" stop-color="hsl(44, 96%, 60%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(276, 70%, 30%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-deus_ex_machina-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 86%)"/><stop offset="52%" stop-color="hsl(42, 94%, 60%)"/><stop offset="100%" stop-color="hsl(30, 82%, 38%)"/></linearGradient><radialGradient id="ca-deus_ex_machina-core" cx="42%" cy="36%" r="60%"><stop offset="0%" stop-color="hsl(52, 100%, 96%)"/><stop offset="55%" stop-color="hsl(45, 98%, 70%)"/><stop offset="100%" stop-color="hsl(288, 72%, 52%)"/></radialGradient>`
  ),
  master_reality: wrapArtSvg(
    'master_reality',
    'hsl(276, 58%, 20%)',
    'hsl(232, 54%, 8%)',
    `<path d="M6 20 Q36 8 64 18 T122 14 M6 54 Q38 64 64 52 T122 58" fill="none" stroke="hsl(282, 74%, 56%)" stroke-width="1" opacity="0.45"/>
     <ellipse cx="64" cy="36" rx="50" ry="20" fill="none" stroke="url(#ca-master_reality-ring)" stroke-width="1.4" opacity="0.72" transform="rotate(-14 64 36)"/>
     <ellipse cx="64" cy="36" rx="48" ry="18" fill="none" stroke="hsl(46, 96%, 72%)" stroke-width="1.2" opacity="0.62" transform="rotate(14 64 36)"/>
     <path d="M24 38 Q64 11 104 38 Q64 65 24 38 Z" fill="hsl(252, 62%, 10%)" opacity="0.72"/>
     <path d="M26 36 Q64 10 102 36 Q64 62 26 36 Z" fill="hsl(268, 56%, 18%)" stroke="url(#ca-master_reality-ring)" stroke-width="2"/>
     <circle cx="64" cy="36" r="14.5" fill="url(#ca-master_reality-iris)" stroke="hsl(48, 100%, 86%)" stroke-width="1.3"/>
     <path d="M64 25 L68 36 L64 47 L60 36 Z" fill="hsl(258, 66%, 12%)"/>
     <circle cx="61" cy="32" r="2.6" fill="hsl(52, 100%, 96%)"/>
     <polygon points="18,22 24,14 28,24 22,31" fill="url(#ca-master_reality-shard)" stroke="hsl(50, 100%, 88%)" stroke-width="0.9"/>
     <polygon points="104,48 110,38 116,50 109,59" fill="url(#ca-master_reality-shard)" stroke="hsl(50, 100%, 88%)" stroke-width="0.9"/>
     <polygon points="22,52 27,46 31,55 25,61" fill="hsl(292, 84%, 64%)" stroke="hsl(48, 100%, 84%)" stroke-width="0.9" opacity="0.88"/>
     <path d="M104 14 V22 M100 18 H108 M20 38 V44 M17 41 H23" stroke="hsl(152, 96%, 72%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M40 16 Q64 8 88 16 M40 56 Q64 64 88 56" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.2" opacity="0.7"/>
     <circle cx="96" cy="24" r="1.6" fill="hsl(50, 100%, 94%)"/>
     <circle cx="34" cy="58" r="1.6" fill="hsl(188, 96%, 78%)"/>`,
    'hsla(286, 92%, 62%, 0.28)',
    `<radialGradient id="ca-master_reality-iris" cx="46%" cy="44%" r="55%"><stop offset="0%" stop-color="hsl(50, 100%, 94%)"/><stop offset="38%" stop-color="hsl(44, 98%, 64%)"/><stop offset="78%" stop-color="hsl(292, 86%, 56%)"/><stop offset="100%" stop-color="hsl(264, 72%, 26%)"/></radialGradient><linearGradient id="ca-master_reality-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 84%)"/><stop offset="50%" stop-color="hsl(296, 92%, 72%)"/><stop offset="100%" stop-color="hsl(196, 92%, 72%)"/></linearGradient><linearGradient id="ca-master_reality-shard" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(172, 92%, 78%)"/><stop offset="55%" stop-color="hsl(46, 98%, 68%)"/><stop offset="100%" stop-color="hsl(286, 74%, 44%)"/></linearGradient>`
  ),
  through_violence: wrapArtSvg(
    'through_violence',
    'hsl(308, 64%, 20%)',
    'hsl(344, 58%, 8%)',
    `<path d="M8 62 L52 44 L44 58 L76 40 L118 26" fill="none" stroke="hsl(334, 72%, 44%)" stroke-width="1.3" opacity="0.45"/>
     <path d="M12 64 Q58 46 116 14 L106 34 Q58 56 18 68 Z" fill="url(#ca-through_violence-wake)" opacity="0.62"/>
     <circle cx="102" cy="18" r="22" fill="url(#ca-through_violence-flash)"/>
     <path d="M14 58 L98 14 L112 10 L103 24 L20 65 Z" fill="hsl(332, 64%, 14%)" opacity="0.72" transform="translate(2,3)"/>
     <path d="M12 56 L96 12 L114 9 L101 23 L19 63 Z" fill="url(#ca-through_violence-blade)" stroke="hsl(330, 96%, 68%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M18 57 L106 13" stroke="hsl(54, 100%, 97%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M22 44 L36 62 L30 65 L16 47 Z" fill="hsl(44, 96%, 66%)" stroke="hsl(286, 62%, 28%)" stroke-width="1.2"/>
     <path d="M36 16 Q60 22 86 12 M44 58 Q74 52 108 38" fill="none" stroke="hsl(322, 96%, 72%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="48,22 57,18 54,28 45,27" fill="hsl(282, 48%, 22%)" stroke="hsl(328, 92%, 68%)" stroke-width="1"/>
     <polygon points="78,46 88,43 85,53 75,51" fill="hsl(282, 48%, 22%)" stroke="hsl(44, 98%, 74%)" stroke-width="1"/>
     <polygon points="64,56 71,54 69,62 62,60" fill="hsl(312, 64%, 28%)" stroke="hsl(326, 94%, 72%)" stroke-width="0.9"/>
     <path d="M102 6 L104 15 L114 14 L106 20 L112 29 L102 22 L94 28 L98 18 L90 12 L99 14 Z" fill="hsl(52, 100%, 94%)"/>
     <path d="M28 28 L42 22 M86 58 L104 48" stroke="hsl(46, 100%, 82%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="62" cy="14" r="1.8" fill="hsl(48, 100%, 88%)"/>
     <circle cx="94" cy="38" r="2" fill="hsl(326, 98%, 76%)"/>`,
    'hsla(324, 96%, 58%, 0.30)',
    `<linearGradient id="ca-through_violence-blade" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(318, 94%, 64%)"/><stop offset="48%" stop-color="hsl(44, 100%, 76%)"/><stop offset="100%" stop-color="hsl(54, 100%, 96%)"/></linearGradient><linearGradient id="ca-through_violence-wake" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(344, 88%, 48%)" stop-opacity="0.15"/><stop offset="65%" stop-color="hsl(326, 98%, 62%)" stop-opacity="0.85"/><stop offset="100%" stop-color="hsl(46, 100%, 84%)" stop-opacity="0.95"/></linearGradient><radialGradient id="ca-through_violence-flash" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 97%)"/><stop offset="42%" stop-color="hsl(44, 100%, 68%)" stop-opacity="0.75"/><stop offset="100%" stop-color="hsl(328, 96%, 54%)" stop-opacity="0"/></radialGradient>`
  ),
  the_bomb: wrapArtSvg(
    'the_bomb',
    'hsl(24, 34%, 18%)',
    'hsl(14, 46%, 7%)',
    `<ellipse cx="90" cy="22" rx="28" ry="20" fill="url(#ca-the_bomb-spark)" opacity="0.45"/>
     <ellipse cx="54" cy="63" rx="26" ry="5.5" fill="rgba(0,0,0,0.52)"/>
     <path d="M12 66 Q32 58 58 63 Q86 67 116 61 L128 72 L0 72 Z" fill="rgba(0,0,0,0.28)"/>
     <path d="M62 20 L70 15 L76 23 L68 28 Z" fill="hsl(220, 14%, 28%)" stroke="hsl(36, 48%, 48%)" stroke-width="1.1"/>
     <circle cx="54" cy="41" r="21" fill="url(#ca-the_bomb-iron)" stroke="hsl(222, 22%, 12%)" stroke-width="1.5"/>
     <path d="M40 31 A16 16 0 0 1 56 23" fill="none" stroke="hsla(210, 42%, 86%, 0.55)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M68 27 A18 18 0 0 1 70 53" fill="none" stroke="url(#ca-the_bomb-rim)" stroke-width="2" stroke-linecap="round" opacity="0.88"/>
     <path d="M35 44 Q54 50 73 43" fill="none" stroke="hsl(222, 20%, 14%)" stroke-width="1.8"/>
     <path d="M71 19 Q82 9 93 18" fill="none" stroke="hsl(34, 48%, 54%)" stroke-width="3" stroke-linecap="round"/>
     <path d="M72 19 Q82 10 92 18" fill="none" stroke="hsl(46, 96%, 72%)" stroke-width="1.1" stroke-dasharray="2.4 2" stroke-linecap="round"/>
     <circle cx="94" cy="19" r="9.5" fill="url(#ca-the_bomb-spark)"/>
     <polygon points="94,7 96.5,15 105,13 98.5,19 104,26 96,23 93,31 91,22 83,23 89.5,18 85,11 92,15" fill="hsl(48, 100%, 84%)"/>
     <path d="M94 4 V8 M108 19 H114 M104 9 L109 6 M103 28 L108 32 M84 29 L80 33" stroke="hsl(34, 100%, 66%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="111" cy="12" r="1.6" fill="hsl(48, 100%, 82%)"/>
     <circle cx="106" cy="36" r="1.4" fill="hsl(26, 100%, 64%)"/>
     <circle cx="83" cy="37" r="1.3" fill="hsl(42, 100%, 74%)"/>`,
    'hsla(36, 98%, 56%, 0.30)',
    `<radialGradient id="ca-the_bomb-iron" cx="36%" cy="32%" r="68%"><stop offset="0%" stop-color="hsl(216, 18%, 54%)"/><stop offset="42%" stop-color="hsl(220, 18%, 24%)"/><stop offset="100%" stop-color="hsl(224, 24%, 9%)"/></radialGradient><radialGradient id="ca-the_bomb-spark" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="48%" stop-color="hsl(38, 100%, 60%)"/><stop offset="100%" stop-color="hsla(14, 100%, 48%, 0)"/></radialGradient><linearGradient id="ca-the_bomb-rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(44, 100%, 78%)"/><stop offset="100%" stop-color="hsl(18, 96%, 50%)"/></linearGradient>`
  ),
  bash: wrapArtSvg(
    'bash',
    'hsl(12, 58%, 21%)',
    'hsl(22, 46%, 9%)',
    `<circle cx="88" cy="48" r="34" fill="url(#ca-bash-impact)"/>
     <path d="M12 22 Q44 4 86 24 Q62 12 24 34 Z" fill="hsl(34, 98%, 62%)" opacity="0.42"/>
     <path d="M52 66 L70 50 L114 54 L120 68 Z" fill="hsl(20, 26%, 18%)" stroke="hsl(28, 76%, 46%)" stroke-width="1.2"/>
     <path d="M74 52 L82 62 L92 54 L99 65" stroke="hsl(44, 100%, 72%)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
     <path d="M18 14 L74 44" stroke="rgba(0,0,0,0.45)" stroke-width="8" stroke-linecap="round" transform="translate(2,3)"/>
     <path d="M18 14 L74 44" stroke="url(#ca-bash-shaft)" stroke-width="6.5" stroke-linecap="round"/>
     <path d="M24 14 L68 38" stroke="hsl(36, 72%, 62%)" stroke-width="1.2" stroke-linecap="round" opacity="0.65"/>
     <polygon points="84,18 90,29 102,25 94,36 106,44 93,47 95,59 83,51 72,58 75,45 64,39 76,34 73,22 83,28" fill="hsl(32, 34%, 68%)" stroke="hsl(18, 30%, 20%)" stroke-width="1.1"/>
     <circle cx="84" cy="39" r="14" fill="url(#ca-bash-mace)" stroke="hsl(36, 86%, 64%)" stroke-width="1.5"/>
     <path d="M75 31 Q82 25 91 30" stroke="hsl(48, 100%, 92%)" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.8"/>
     <circle cx="81" cy="38" r="2.2" fill="hsl(20, 88%, 54%)"/>
     <circle cx="89" cy="43" r="1.8" fill="hsl(20, 88%, 54%)"/>
     <path d="M60 56 L50 61 M106 32 L117 26 M108 50 L118 54 M88 12 L92 6" stroke="hsl(46, 100%, 76%)" stroke-width="2" stroke-linecap="round"/>
     <polygon points="55,48 61,44 63,51" fill="hsl(28, 34%, 52%)"/>
     <polygon points="106,60 113,56 111,64" fill="hsl(38, 96%, 66%)"/>
     <circle cx="64" cy="24" r="2" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(20, 94%, 52%, 0.28)',
    `<radialGradient id="ca-bash-impact" cx="72%" cy="68%" r="42%"><stop offset="0%" stop-color="hsl(48, 100%, 84%)" stop-opacity="0.85"/><stop offset="45%" stop-color="hsl(22, 98%, 54%)" stop-opacity="0.42"/><stop offset="100%" stop-color="hsl(10, 70%, 14%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-bash-mace" cx="38%" cy="32%" r="65%"><stop offset="0%" stop-color="hsl(212, 18%, 74%)"/><stop offset="55%" stop-color="hsl(216, 18%, 36%)"/><stop offset="100%" stop-color="hsl(220, 22%, 14%)"/></radialGradient><linearGradient id="ca-bash-shaft" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(26, 48%, 42%)"/><stop offset="100%" stop-color="hsl(18, 44%, 18%)"/></linearGradient>`
  ),
  demon_form: wrapArtSvg(
    'demon_form',
    'hsl(354, 72%, 21%)',
    'hsl(10, 58%, 7%)',
    `<path d="M8 70 Q14 38 24 44 Q28 18 40 34 Q48 10 64 6 Q80 10 88 34 Q100 18 104 44 Q114 38 120 70 Z" fill="url(#ca-demon_form-fire)" opacity="0.52"/>
     <path d="M22 68 Q28 42 48 36 L80 36 Q100 42 106 68 Z" fill="url(#ca-demon_form-body)" stroke="hsl(18, 92%, 52%)" stroke-width="1.3"/>
     <path d="M46 25 Q24 8 14 20 Q20 34 46 34 Z" fill="url(#ca-demon_form-horn)" stroke="hsl(18, 52%, 24%)" stroke-width="1.2"/>
     <path d="M82 25 Q104 8 114 20 Q108 34 82 34 Z" fill="url(#ca-demon_form-horn)" stroke="hsl(18, 52%, 24%)" stroke-width="1.2"/>
     <path d="M20 20 Q30 16 42 26 M108 20 Q98 16 86 26" stroke="hsl(48, 96%, 90%)" stroke-width="1.2" fill="none" opacity="0.75"/>
     <path d="M44 26 Q64 14 84 26 L80 48 L64 56 L48 48 Z" fill="url(#ca-demon_form-body)" stroke="hsl(34, 96%, 62%)" stroke-width="1.4"/>
     <path d="M50 32 L61 36 L52 40 Z M78 32 L67 36 L76 40 Z" fill="hsl(50, 100%, 84%)" stroke="hsl(22, 100%, 54%)" stroke-width="0.9"/>
     <path d="M55 47 L64 44 L73 47 L69 51 L59 51 Z" fill="hsl(42, 100%, 66%)"/>
     <polygon points="64,56 72,62 64,68 56,62" fill="hsl(46, 100%, 74%)" stroke="hsl(14, 96%, 48%)" stroke-width="1.2"/>
     <path d="M36 52 L50 58 M92 52 L78 58" stroke="hsl(24, 98%, 58%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M16 58 Q20 44 28 50 M112 58 Q108 44 100 50" stroke="hsl(42, 100%, 72%)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <circle cx="24" cy="12" r="2" fill="hsl(46, 100%, 80%)"/>
     <circle cx="104" cy="12" r="2" fill="hsl(46, 100%, 80%)"/>
     <circle cx="64" cy="11" r="2.2" fill="hsl(50, 100%, 88%)"/>
     <circle cx="14" cy="36" r="1.6" fill="hsl(28, 100%, 66%)"/>`,
    'hsla(8, 96%, 54%, 0.3)',
    `<linearGradient id="ca-demon_form-fire" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(354, 92%, 44%)"/><stop offset="55%" stop-color="hsl(22, 100%, 56%)"/><stop offset="100%" stop-color="hsl(48, 100%, 80%)"/></linearGradient><linearGradient id="ca-demon_form-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(356, 72%, 34%)"/><stop offset="55%" stop-color="hsl(352, 66%, 20%)"/><stop offset="100%" stop-color="hsl(348, 56%, 9%)"/></linearGradient><linearGradient id="ca-demon_form-horn" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(44, 72%, 86%)"/><stop offset="65%" stop-color="hsl(30, 52%, 56%)"/><stop offset="100%" stop-color="hsl(14, 46%, 24%)"/></linearGradient>`
  ),
  corruption: wrapArtSvg(
    'corruption',
    'hsl(278, 56%, 19%)',
    'hsl(332, 50%, 8%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-corruption-glow)"/>
     <path d="M8 58 Q30 14 64 36 Q98 58 120 14" stroke="hsl(292, 86%, 56%)" stroke-width="3.2" fill="none" opacity="0.52"/>
     <path d="M12 20 Q36 56 64 34 Q92 12 116 54" stroke="hsl(330, 92%, 56%)" stroke-width="2.2" fill="none" opacity="0.48"/>
     <polygon points="64,7 84,35 64,65 44,35" fill="rgba(0,0,0,0.48)" transform="translate(2,3)"/>
     <polygon points="64,7 84,35 64,65 44,35" fill="url(#ca-corruption-crystal)" stroke="hsl(312, 94%, 68%)" stroke-width="1.6"/>
     <polygon points="64,7 84,35 64,37" fill="hsl(296, 82%, 62%)" opacity="0.34"/>
     <path d="M54 33 Q64 20 74 33 Q64 52 54 33 Z" fill="hsl(334, 96%, 58%)" stroke="hsl(312, 100%, 82%)" stroke-width="1.2"/>
     <circle cx="64" cy="35" r="4" fill="hsl(326, 100%, 88%)"/>
     <path d="M64 10 L61 23 L66 28 M64 62 L67 48 L61 42 M46 35 L55 34 M82 35 L73 36" stroke="url(#ca-corruption-vein)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
     <path d="M24 44 Q38 40 46 32 M104 28 Q90 32 82 40" stroke="hsl(284, 78%, 34%)" stroke-width="3.4" fill="none" stroke-linecap="round"/>
     <path d="M24 44 Q38 40 46 32 M104 28 Q90 32 82 40" stroke="hsl(316, 98%, 72%)" stroke-width="1.1" fill="none" stroke-linecap="round"/>
     <polygon points="28,16 33,22 28,28 23,22" fill="hsl(298, 94%, 68%)" opacity="0.82"/>
     <polygon points="100,44 105,50 100,56 95,50" fill="hsl(334, 94%, 64%)" opacity="0.82"/>
     <circle cx="40" cy="14" r="2" fill="hsl(316, 100%, 80%)"/>
     <circle cx="92" cy="18" r="2.2" fill="hsl(292, 100%, 74%)"/>
     <circle cx="36" cy="58" r="1.8" fill="hsl(338, 98%, 68%)"/>`,
    'hsla(296, 88%, 54%, 0.28)',
    `<radialGradient id="ca-corruption-glow" cx="50%" cy="48%" r="48%"><stop offset="0%" stop-color="hsl(318, 96%, 62%)" stop-opacity="0.58"/><stop offset="55%" stop-color="hsl(282, 82%, 38%)" stop-opacity="0.26"/><stop offset="100%" stop-color="hsl(276, 60%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-corruption-crystal" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(288, 62%, 44%)"/><stop offset="50%" stop-color="hsl(274, 58%, 22%)"/><stop offset="100%" stop-color="hsl(332, 64%, 14%)"/></linearGradient><linearGradient id="ca-corruption-vein" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(326, 100%, 76%)"/><stop offset="100%" stop-color="hsl(286, 94%, 56%)"/></linearGradient>`
  ),
  barricade: wrapArtSvg(
    'barricade',
    'hsl(214, 34%, 20%)',
    'hsl(220, 44%, 9%)',
    `<ellipse cx="64" cy="48" rx="58" ry="38" fill="url(#ca-barricade-dome)"/>
     <path d="M12 64 A54 48 0 0 1 116 64" fill="none" stroke="hsl(44, 96%, 72%)" stroke-width="2" stroke-dasharray="6 3" opacity="0.65"/>
     <path d="M16 66 V22 H28 V30 H40 V16 H52 V24 H76 V16 H88 V30 H100 V22 H112 V66 Z" fill="rgba(0,0,0,0.42)" transform="translate(2,2)"/>
     <path d="M16 66 V22 H28 V30 H40 V16 H52 V24 H76 V16 H88 V30 H100 V22 H112 V66 Z" fill="url(#ca-barricade-stone)" stroke="hsl(214, 34%, 72%)" stroke-width="1.3"/>
     <path d="M16 38 H112 M16 52 H112 M34 38 V52 M94 38 V52" stroke="hsl(220, 28%, 16%)" stroke-width="1.2" opacity="0.7"/>
     <path d="M46 28 H82 V50 Q82 61 64 66 Q46 61 46 50 Z" fill="url(#ca-barricade-steel)" stroke="hsl(44, 96%, 72%)" stroke-width="1.8"/>
     <path d="M64 31 V63 M50 44 H78" stroke="hsl(42, 86%, 54%)" stroke-width="2.2"/>
     <circle cx="64" cy="44" r="5" fill="hsl(46, 100%, 78%)" stroke="hsl(24, 68%, 32%)" stroke-width="1.2"/>
     <path d="M42 18 H50 M78 18 H86 M18 24 H26 M102 24 H110" stroke="hsl(46, 94%, 84%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="52" cy="34" r="1.4" fill="hsl(48, 100%, 88%)"/>
     <circle cx="76" cy="34" r="1.4" fill="hsl(48, 100%, 88%)"/>
     <circle cx="26" cy="45" r="2" fill="hsl(32, 98%, 62%)"/>
     <circle cx="102" cy="45" r="2" fill="hsl(32, 98%, 62%)"/>`,
    'hsla(42, 86%, 56%, 0.24)',
    `<radialGradient id="ca-barricade-dome" cx="50%" cy="62%" r="54%"><stop offset="0%" stop-color="hsl(44, 96%, 68%)" stop-opacity="0.34"/><stop offset="72%" stop-color="hsl(206, 86%, 58%)" stop-opacity="0.16"/><stop offset="100%" stop-color="hsl(220, 60%, 14%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-barricade-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(214, 20%, 54%)"/><stop offset="55%" stop-color="hsl(218, 22%, 30%)"/><stop offset="100%" stop-color="hsl(222, 26%, 16%)"/></linearGradient><linearGradient id="ca-barricade-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(44, 88%, 74%)"/><stop offset="50%" stop-color="hsl(212, 26%, 64%)"/><stop offset="100%" stop-color="hsl(220, 26%, 26%)"/></linearGradient>`
  ),
  reaper: wrapArtSvg(
    'reaper',
    'hsl(348, 66%, 18%)',
    'hsl(268, 36%, 8%)',
    `<circle cx="58" cy="36" r="34" fill="url(#ca-reaper-glow)"/>
     <path d="M10 48 Q40 4 114 14 Q62 24 22 58 Z" fill="hsl(352, 94%, 54%)" opacity="0.32"/>
     <path d="M22 66 Q50 48 82 54 Q102 58 116 42" stroke="hsl(352, 96%, 62%)" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.72"/>
     <path d="M98 12 L52 66" stroke="rgba(0,0,0,0.48)" stroke-width="6.5" stroke-linecap="round" transform="translate(2,2)"/>
     <path d="M98 12 L52 66" stroke="url(#ca-reaper-haft)" stroke-width="5" stroke-linecap="round"/>
     <path d="M102 15 Q52 4 16 32 Q44 26 78 31 L92 22 Z" fill="rgba(0,0,0,0.46)" transform="translate(2,3)"/>
     <path d="M102 15 Q52 4 16 32 Q44 26 78 31 L92 22 Z" fill="url(#ca-reaper-blade)" stroke="hsl(352, 92%, 68%)" stroke-width="1.3"/>
     <path d="M96 16 Q54 9 20 30" stroke="hsl(0, 100%, 94%)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
     <polygon points="88,14 98,10 103,18 93,24" fill="hsl(42, 84%, 62%)" stroke="hsl(18, 62%, 26%)" stroke-width="1.1"/>
     <circle cx="44" cy="46" r="6" fill="hsl(352, 92%, 52%)" opacity="0.34"/>
     <circle cx="44" cy="46" r="3.2" fill="hsl(352, 100%, 72%)"/>
     <path d="M22 36 Q30 48 41 46 M68 42 Q56 48 47 46" stroke="hsl(354, 100%, 74%)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
     <circle cx="24" cy="44" r="2.2" fill="hsl(352, 98%, 64%)"/>
     <circle cx="88" cy="52" r="2.4" fill="hsl(352, 98%, 62%)"/>
     <circle cx="106" cy="36" r="1.8" fill="hsl(354, 100%, 76%)"/>`,
    'hsla(352, 94%, 52%, 0.28)',
    `<radialGradient id="ca-reaper-glow" cx="46%" cy="48%" r="48%"><stop offset="0%" stop-color="hsl(352, 96%, 56%)" stop-opacity="0.54"/><stop offset="65%" stop-color="hsl(342, 76%, 30%)" stop-opacity="0.2"/><stop offset="100%" stop-color="hsl(276, 50%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-reaper-blade" x1="0" y1="0" x2="1" y2="0.6"><stop offset="0%" stop-color="hsl(352, 94%, 64%)"/><stop offset="35%" stop-color="hsl(214, 24%, 84%)"/><stop offset="80%" stop-color="hsl(218, 22%, 44%)"/><stop offset="100%" stop-color="hsl(350, 74%, 36%)"/></linearGradient><linearGradient id="ca-reaper-haft" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(26, 38%, 40%)"/><stop offset="100%" stop-color="hsl(348, 42%, 14%)"/></linearGradient>`
  ),
  bludgeon: wrapArtSvg(
    'bludgeon',
    'hsl(16, 56%, 20%)',
    'hsl(8, 44%, 8%)',
    `<ellipse cx="72" cy="56" rx="48" ry="24" fill="url(#ca-bludgeon-blast)"/>
     <path d="M50 8 L66 28 M76 6 L84 26 M98 10 L96 28" stroke="hsl(36, 98%, 66%)" stroke-width="1.8" stroke-linecap="round" opacity="0.62"/>
     <path d="M16 66 L36 54 L66 60 L96 52 L116 66 Z" fill="hsl(16, 26%, 16%)" stroke="hsl(26, 78%, 48%)" stroke-width="1.3"/>
     <ellipse cx="74" cy="58" rx="34" ry="8" fill="none" stroke="hsl(42, 100%, 72%)" stroke-width="1.6" opacity="0.72"/>
     <path d="M16 12 L68 42" stroke="rgba(0,0,0,0.48)" stroke-width="9" stroke-linecap="round" transform="translate(2,3)"/>
     <path d="M16 12 L68 42" stroke="url(#ca-bludgeon-haft)" stroke-width="7.2" stroke-linecap="round"/>
     <path d="M52 24 L94 14 L106 46 L64 56 Z" fill="rgba(0,0,0,0.5)" transform="translate(2,3)"/>
     <path d="M52 24 L94 14 L106 46 L64 56 Z" fill="url(#ca-bludgeon-head)" stroke="hsl(34, 86%, 62%)" stroke-width="1.6"/>
     <path d="M56 26 L92 17" stroke="hsl(48, 100%, 90%)" stroke-width="2" stroke-linecap="round" opacity="0.82"/>
     <path d="M62 22 L74 54 M84 16 L96 48" stroke="hsl(38, 78%, 54%)" stroke-width="2.2"/>
     <polygon points="75,30 82,35 77,42 70,37" fill="hsl(22, 98%, 56%)" stroke="hsl(48, 100%, 82%)" stroke-width="0.9"/>
     <polygon points="34,50 42,45 44,54" fill="hsl(24, 30%, 44%)" stroke="hsl(38, 86%, 64%)" stroke-width="0.8"/>
     <polygon points="106,48 115,44 113,54" fill="hsl(24, 30%, 44%)" stroke="hsl(38, 86%, 64%)" stroke-width="0.8"/>
     <path d="M36 62 L52 56 M100 58 L116 62" stroke="hsl(46, 100%, 78%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="46" cy="40" r="2" fill="hsl(48, 100%, 86%)"/>
     <circle cx="110" cy="34" r="2.2" fill="hsl(34, 100%, 68%)"/>`,
    'hsla(24, 96%, 54%, 0.28)',
    `<radialGradient id="ca-bludgeon-blast" cx="56%" cy="76%" r="48%"><stop offset="0%" stop-color="hsl(48, 100%, 84%)" stop-opacity="0.82"/><stop offset="48%" stop-color="hsl(20, 96%, 52%)" stop-opacity="0.4"/><stop offset="100%" stop-color="hsl(8, 64%, 12%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-bludgeon-head" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(212, 18%, 68%)"/><stop offset="50%" stop-color="hsl(216, 16%, 34%)"/><stop offset="100%" stop-color="hsl(220, 20%, 14%)"/></linearGradient><linearGradient id="ca-bludgeon-haft" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(30, 56%, 46%)"/><stop offset="100%" stop-color="hsl(16, 48%, 18%)"/></linearGradient>`
  ),
  impervious: wrapArtSvg(
    'impervious',
    'hsl(212, 42%, 21%)',
    'hsl(226, 48%, 9%)',
    `<circle cx="64" cy="35" r="35" fill="url(#ca-impervious-flash)"/>
     <path d="M8 22 L38 30 M12 44 L38 42 M120 20 L90 30 M116 46 L90 44" stroke="hsl(356, 90%, 60%)" stroke-width="2" stroke-linecap="round" opacity="0.72"/>
     <path d="M38 11 L64 6 L90 11 V40 Q90 57 64 66 Q38 57 38 40 Z" fill="rgba(0,0,0,0.48)" transform="translate(2,3)"/>
     <path d="M38 11 L64 6 L90 11 V40 Q90 57 64 66 Q38 57 38 40 Z" fill="url(#ca-impervious-shield)" stroke="url(#ca-impervious-gold)" stroke-width="2.6"/>
     <path d="M44 16 L64 12 L84 16 V39 Q84 52 64 60 Q44 52 44 39 Z" fill="none" stroke="hsl(212, 38%, 84%)" stroke-width="1" opacity="0.6"/>
     <path d="M43 18 L66 13 L45 40 Z" fill="hsl(0, 0%, 100%)" opacity="0.18"/>
     <path d="M64 11 V61 M42 34 H86" stroke="url(#ca-impervious-gold)" stroke-width="3.2"/>
     <polygon points="64,24 72,34 64,44 56,34" fill="hsl(48, 100%, 84%)" stroke="hsl(26, 74%, 32%)" stroke-width="1.3"/>
     <path d="M37 30 L26 22 M37 30 L24 35 M91 30 L102 22 M91 30 L104 35" stroke="hsl(48, 100%, 86%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="38" cy="30" r="3" fill="hsl(50, 100%, 92%)"/>
     <circle cx="90" cy="30" r="3" fill="hsl(50, 100%, 92%)"/>
     <polygon points="18,16 25,19 21,25" fill="hsl(356, 94%, 66%)"/>
     <polygon points="110,15 103,18 107,24" fill="hsl(356, 94%, 66%)"/>
     <circle cx="64" cy="34" r="2.2" fill="hsl(0, 0%, 100%)"/>`,
    'hsla(44, 96%, 62%, 0.28)',
    `<radialGradient id="ca-impervious-flash" cx="50%" cy="46%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 84%)" stop-opacity="0.52"/><stop offset="60%" stop-color="hsl(206, 86%, 56%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(224, 60%, 12%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-impervious-shield" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(212, 32%, 78%)"/><stop offset="50%" stop-color="hsl(216, 28%, 46%)"/><stop offset="100%" stop-color="hsl(222, 32%, 22%)"/></linearGradient><linearGradient id="ca-impervious-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 82%)"/><stop offset="55%" stop-color="hsl(38, 90%, 56%)"/><stop offset="100%" stop-color="hsl(26, 72%, 30%)"/></linearGradient>`
  ),
  offering: wrapArtSvg(
    'offering',
    'hsl(348, 70%, 19%)',
    'hsl(330, 52%, 7%)',
    `<circle cx="64" cy="34" r="30" fill="none" stroke="hsl(352, 82%, 52%)" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.55"/>
     <path d="M40 44 Q28 24 44 8 Q48 24 54 38 Z M88 44 Q100 24 84 8 Q80 24 74 38 Z" fill="url(#ca-offering-energy)" opacity="0.62"/>
     <path d="M46 38 Q64 46 82 38 L76 52 Q64 56 52 52 Z" fill="rgba(0,0,0,0.45)" transform="translate(2,2)"/>
     <path d="M46 38 Q64 44 82 38 L76 52 Q64 56 52 52 Z" fill="url(#ca-offering-chalice)" stroke="hsl(42, 92%, 72%)" stroke-width="1.3"/>
     <path d="M60 53 H68 L74 65 H54 Z" fill="url(#ca-offering-chalice)" stroke="hsl(42, 86%, 66%)" stroke-width="1.2"/>
     <ellipse cx="64" cy="38" rx="18" ry="4.5" fill="hsl(352, 94%, 44%)" stroke="hsl(354, 100%, 70%)" stroke-width="1.2"/>
     <path d="M64 8 L69 24 L64 31 L59 24 Z" fill="url(#ca-offering-blade)" stroke="hsl(214, 34%, 88%)" stroke-width="0.9"/>
     <path d="M56 13 H72 M64 6 V13" stroke="hsl(42, 92%, 68%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M64 31 C61 35 61 37 64 38 C67 37 67 35 64 31 Z" fill="hsl(354, 100%, 60%)"/>
     <path d="M48 41 C45 47 45 52 48 53 C51 52 51 47 48 41 Z M80 41 C77 46 77 50 80 51 C83 50 83 46 80 41 Z" fill="hsl(352, 96%, 54%)"/>
     <circle cx="34" cy="22" r="3" fill="hsl(48, 100%, 82%)"/>
     <circle cx="94" cy="22" r="3" fill="hsl(48, 100%, 82%)"/>
     <circle cx="26" cy="38" r="2" fill="hsl(32, 100%, 66%)"/>
     <circle cx="102" cy="38" r="2" fill="hsl(32, 100%, 66%)"/>
     <path d="M34 65 H94" stroke="hsl(352, 62%, 34%)" stroke-width="2.2" stroke-linecap="round"/>`,
    'hsla(356, 96%, 54%, 0.28)',
    `<linearGradient id="ca-offering-energy" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(354, 96%, 52%)"/><stop offset="50%" stop-color="hsl(26, 100%, 60%)"/><stop offset="100%" stop-color="hsl(50, 100%, 86%)"/></linearGradient><linearGradient id="ca-offering-chalice" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(42, 78%, 68%)"/><stop offset="55%" stop-color="hsl(24, 52%, 34%)"/><stop offset="100%" stop-color="hsl(350, 44%, 14%)"/></linearGradient><linearGradient id="ca-offering-blade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(214, 24%, 84%)"/><stop offset="100%" stop-color="hsl(352, 88%, 52%)"/></linearGradient>`
  ),
  fiend_fire: wrapArtSvg(
    'fiend_fire',
    'hsl(14, 80%, 22%)',
    'hsl(352, 66%, 8%)',
    `<circle cx="64" cy="38" r="36" fill="url(#ca-fiend_fire-core)"/>
     <path d="M10 68 Q18 32 34 38 Q36 12 52 24 Q64 4 76 24 Q92 12 94 38 Q110 32 118 68 Z" fill="url(#ca-fiend_fire-flame)" opacity="0.62"/>
     <rect x="14" y="18" width="12" height="16" rx="1.5" transform="rotate(-18 20 26)" fill="url(#ca-fiend_fire-char)" stroke="hsl(34, 100%, 66%)" stroke-width="1.2"/>
     <rect x="102" y="16" width="12" height="16" rx="1.5" transform="rotate(20 108 24)" fill="url(#ca-fiend_fire-char)" stroke="hsl(34, 100%, 66%)" stroke-width="1.2"/>
     <path d="M36 44 Q38 18 64 14 Q90 18 92 44 L84 62 L64 66 L44 62 Z" fill="url(#ca-fiend_fire-flame)" stroke="hsl(48, 100%, 84%)" stroke-width="1.4"/>
     <path d="M44 22 Q28 6 24 18 Q32 28 45 30 Z M84 22 Q100 6 104 18 Q96 28 83 30 Z" fill="hsl(32, 100%, 64%)" stroke="hsl(48, 100%, 86%)" stroke-width="1"/>
     <path d="M46 31 L59 35 L49 41 Z M82 31 L69 35 L79 41 Z" fill="hsl(54, 100%, 96%)"/>
     <path d="M48 48 Q64 42 80 48 L75 61 Q64 56 53 61 Z" fill="hsl(354, 78%, 18%)" stroke="hsl(44, 100%, 74%)" stroke-width="1.1"/>
     <path d="M54 48 L56 54 L60 47 L64 55 L68 47 L72 54 L74 48" fill="none" stroke="hsl(50, 100%, 88%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M22 48 Q34 40 42 46 M106 48 Q94 40 86 46" stroke="hsl(48, 100%, 82%)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <circle cx="30" cy="54" r="2.2" fill="hsl(46, 100%, 80%)"/>
     <circle cx="98" cy="54" r="2.2" fill="hsl(46, 100%, 80%)"/>
     <circle cx="64" cy="9" r="2.5" fill="hsl(52, 100%, 92%)"/>
     <circle cx="44" cy="11" r="1.8" fill="hsl(34, 100%, 70%)"/>
     <circle cx="84" cy="11" r="1.8" fill="hsl(34, 100%, 70%)"/>`,
    'hsla(26, 100%, 56%, 0.34)',
    `<radialGradient id="ca-fiend_fire-core" cx="50%" cy="52%" r="48%"><stop offset="0%" stop-color="hsl(52, 100%, 88%)" stop-opacity="0.82"/><stop offset="48%" stop-color="hsl(22, 100%, 54%)" stop-opacity="0.46"/><stop offset="100%" stop-color="hsl(352, 74%, 12%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-fiend_fire-flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(356, 94%, 44%)"/><stop offset="50%" stop-color="hsl(24, 100%, 56%)"/><stop offset="100%" stop-color="hsl(50, 100%, 86%)"/></linearGradient><linearGradient id="ca-fiend_fire-char" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(22, 48%, 28%)"/><stop offset="100%" stop-color="hsl(350, 44%, 10%)"/></linearGradient>`
  ),
  immolate: wrapArtSvg(
    'immolate',
    'hsl(20, 82%, 21%)',
    'hsl(2, 68%, 8%)',
    `<circle cx="64" cy="44" r="40" fill="url(#ca-immolate-ring)"/>
     <ellipse cx="64" cy="56" rx="52" ry="12" fill="none" stroke="hsl(36, 100%, 68%)" stroke-width="1.8" opacity="0.65"/>
     <path d="M10 18 Q26 26 32 10 M118 18 Q102 26 96 10" stroke="hsl(12, 44%, 14%)" stroke-width="8" stroke-linecap="round" opacity="0.62"/>
     <path d="M36 62 Q40 34 32 16 Q48 24 52 6 Q64 20 76 6 Q80 24 96 16 Q88 34 92 62 Z" fill="url(#ca-immolate-pillar)"/>
     <path d="M48 62 Q52 38 46 22 Q58 30 64 12 Q70 30 82 22 Q76 38 80 62 Z" fill="hsl(48, 100%, 84%)" opacity="0.88"/>
     <path d="M56 62 Q60 40 64 24 Q68 40 72 62 Z" fill="hsl(56, 100%, 96%)"/>
     <path d="M4 70 L18 54 L42 60 L64 54 L86 60 L110 54 L124 70 Z" fill="url(#ca-immolate-ground)" stroke="hsl(28, 96%, 56%)" stroke-width="1.3"/>
     <path d="M22 66 L36 58 L46 65 M82 65 L92 58 L106 66" stroke="hsl(42, 100%, 68%)" stroke-width="1.5" fill="none"/>
     <path d="M20 46 Q28 32 38 38 M108 46 Q100 32 90 38" stroke="hsl(36, 100%, 68%)" stroke-width="2" fill="none" stroke-linecap="round"/>
     <circle cx="20" cy="28" r="2.4" fill="hsl(46, 100%, 82%)"/>
     <circle cx="108" cy="28" r="2.4" fill="hsl(46, 100%, 82%)"/>
     <circle cx="28" cy="14" r="1.8" fill="hsl(24, 100%, 64%)"/>
     <circle cx="100" cy="14" r="1.8" fill="hsl(24, 100%, 64%)"/>
     <circle cx="14" cy="42" r="1.7" fill="hsl(50, 100%, 86%)"/>
     <circle cx="114" cy="42" r="1.7" fill="hsl(50, 100%, 86%)"/>`,
    'hsla(32, 100%, 58%, 0.34)',
    `<radialGradient id="ca-immolate-ring" cx="50%" cy="62%" r="54%"><stop offset="0%" stop-color="hsl(52, 100%, 90%)" stop-opacity="0.82"/><stop offset="46%" stop-color="hsl(24, 100%, 54%)" stop-opacity="0.45"/><stop offset="100%" stop-color="hsl(4, 76%, 12%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-immolate-pillar" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(54, 100%, 92%)"/><stop offset="42%" stop-color="hsl(32, 100%, 60%)"/><stop offset="100%" stop-color="hsl(4, 94%, 44%)"/></linearGradient><linearGradient id="ca-immolate-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(14, 34%, 22%)"/><stop offset="100%" stop-color="hsl(6, 40%, 8%)"/></linearGradient>`
  ),
  feed: wrapArtSvg(
    'feed',
    'hsl(352, 70%, 19%)',
    'hsl(344, 58%, 8%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-feed-throat)"/>
     <circle cx="64" cy="36" r="18" fill="none" stroke="hsl(354, 100%, 66%)" stroke-width="1.4" opacity="0.58"/>
     <path d="M56 33 C56 28 62 28 64 32 C66 28 72 28 72 33 C72 39 64 44 64 44 C64 44 56 39 56 33 Z" fill="hsl(354, 100%, 62%)" stroke="hsl(44, 100%, 84%)" stroke-width="1.1"/>
     <path d="M18 14 Q64 2 110 14 L104 26 Q64 16 24 26 Z" fill="url(#ca-feed-jaw)" stroke="hsl(356, 92%, 62%)" stroke-width="1.3"/>
     <path d="M24 46 Q64 56 104 46 L110 58 Q64 70 18 58 Z" fill="url(#ca-feed-jaw)" stroke="hsl(356, 92%, 62%)" stroke-width="1.3"/>
     <polygon points="28,22 36,36 42,20" fill="url(#ca-feed-tooth)" stroke="hsl(350, 44%, 22%)" stroke-width="1"/>
     <polygon points="44,19 50,30 56,18" fill="url(#ca-feed-tooth)" stroke="hsl(350, 44%, 22%)" stroke-width="1"/>
     <polygon points="72,18 78,30 84,19" fill="url(#ca-feed-tooth)" stroke="hsl(350, 44%, 22%)" stroke-width="1"/>
     <polygon points="86,20 92,36 100,22" fill="url(#ca-feed-tooth)" stroke="hsl(350, 44%, 22%)" stroke-width="1"/>
     <polygon points="30,50 38,37 44,52" fill="url(#ca-feed-tooth)" stroke="hsl(350, 44%, 22%)" stroke-width="1"/>
     <polygon points="47,53 53,43 59,54" fill="url(#ca-feed-tooth)" stroke="hsl(350, 44%, 22%)" stroke-width="1"/>
     <polygon points="69,54 75,43 81,53" fill="url(#ca-feed-tooth)" stroke="hsl(350, 44%, 22%)" stroke-width="1"/>
     <polygon points="84,52 90,37 98,50" fill="url(#ca-feed-tooth)" stroke="hsl(350, 44%, 22%)" stroke-width="1"/>
     <path d="M12 36 H22 M106 36 H116" stroke="hsl(44, 100%, 76%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="36" cy="40" r="2" fill="hsl(354, 100%, 64%)"/>
     <circle cx="92" cy="32" r="2" fill="hsl(354, 100%, 64%)"/>`,
    'hsla(354, 96%, 52%, 0.3)',
    `<radialGradient id="ca-feed-throat" cx="50%" cy="50%" r="44%"><stop offset="0%" stop-color="hsl(354, 100%, 62%)" stop-opacity="0.72"/><stop offset="55%" stop-color="hsl(348, 86%, 32%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(342, 68%, 8%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-feed-jaw" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(354, 72%, 38%)"/><stop offset="100%" stop-color="hsl(346, 68%, 16%)"/></linearGradient><linearGradient id="ca-feed-tooth" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(44, 78%, 92%)"/><stop offset="100%" stop-color="hsl(32, 42%, 58%)"/></linearGradient>`
  ),
  neutralize: wrapArtSvg(
    'neutralize',
    'hsl(176, 52%, 17%)',
    'hsl(208, 52%, 8%)',
    `<circle cx="84" cy="34" r="30" fill="url(#ca-neutralize-damp)"/>
     <circle cx="84" cy="34" r="22" fill="none" stroke="hsla(164, 90%, 64%, 0.34)" stroke-width="1.2" stroke-dasharray="5 4"/>
     <circle cx="84" cy="34" r="14" fill="url(#ca-neutralize-threat)" stroke="hsl(14, 70%, 24%)" stroke-width="1.2" opacity="0.88"/>
     <path d="M74 24 L94 44 M94 22 L76 46" stroke="hsl(196, 52%, 10%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M12 58 Q56 48 112 16" fill="none" stroke="hsla(162, 98%, 68%, 0.45)" stroke-width="5" stroke-linecap="round"/>
     <path d="M22 57 L96 14 L106 15 L32 61 Z" fill="url(#ca-neutralize-steel)" stroke="hsl(204, 54%, 10%)" stroke-width="1.5"/>
     <path d="M28 56 L101 16" stroke="hsl(0, 0%, 100%)" stroke-width="1.1" opacity="0.88"/>
     <path d="M23 51 L37 64 L32 67 L19 54 Z" fill="hsl(40, 72%, 56%)" stroke="hsl(24, 50%, 14%)" stroke-width="1.1"/>
     <path d="M12 63 L25 55 L29 60 L16 68 Z" fill="hsl(166, 48%, 24%)" stroke="hsl(194, 52%, 10%)" stroke-width="1.1"/>
     <path d="M70 14 Q92 14 102 34 M68 52 Q88 54 102 42" fill="none" stroke="hsl(164, 96%, 68%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="88,24 94,18 92,27" fill="hsl(32, 96%, 68%)" opacity="0.85"/>
     <polygon points="96,42 104,45 95,48" fill="hsl(164, 96%, 72%)"/>
     <circle cx="106" cy="15" r="2.6" fill="hsl(160, 100%, 88%)"/>
     <circle cx="52" cy="24" r="1.6" fill="hsl(168, 96%, 76%)" opacity="0.75"/>`,
    'hsla(164, 86%, 50%, 0.26)',
    `<radialGradient id="ca-neutralize-damp" cx="68%" cy="46%" r="40%"><stop offset="0%" stop-color="hsla(164, 94%, 58%, 0.42)"/><stop offset="100%" stop-color="hsla(186, 80%, 18%, 0)"/></radialGradient><radialGradient id="ca-neutralize-threat" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(24, 92%, 64%)"/><stop offset="70%" stop-color="hsl(352, 74%, 40%)"/><stop offset="100%" stop-color="hsla(352, 70%, 18%, 0.1)"/></radialGradient><linearGradient id="ca-neutralize-steel" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(192, 24%, 44%)"/><stop offset="55%" stop-color="hsl(182, 40%, 86%)"/><stop offset="100%" stop-color="hsl(166, 80%, 94%)"/></linearGradient>`
  ),
  wraith_form: wrapArtSvg(
    'wraith_form',
    'hsl(174, 58%, 16%)',
    'hsl(222, 56%, 7%)',
    `<circle cx="64" cy="26" r="32" fill="url(#ca-wraith_form-moon)"/>
     <path d="M84 10 A16 16 0 1 0 100 32 A13 13 0 1 1 84 10 Z" fill="hsl(158, 72%, 86%)" opacity="0.65"/>
     <path d="M0 54 Q26 42 50 52 Q78 40 102 52 Q116 46 128 52 L128 72 L0 72 Z" fill="hsla(176, 76%, 34%, 0.24)"/>
     <path d="M26 64 Q34 28 54 14 Q64 9 74 14 Q94 28 102 64 Q86 50 76 66 Q64 52 52 66 Q42 50 26 64 Z" fill="url(#ca-wraith_form-ghost)" stroke="hsla(162, 100%, 84%, 0.65)" stroke-width="1.2"/>
     <path d="M44 58 Q46 24 64 15 Q82 24 84 58 Q74 48 64 58 Q54 48 44 58 Z" fill="url(#ca-wraith_form-core)"/>
     <path d="M54 24 Q64 15 74 24 L71 35 Q64 39 57 35 Z" fill="hsla(160, 68%, 88%, 0.85)" stroke="hsl(182, 58%, 16%)" stroke-width="1"/>
     <circle cx="60" cy="28" r="2.2" fill="hsl(158, 100%, 94%)"/>
     <circle cx="68" cy="28" r="2.2" fill="hsl(158, 100%, 94%)"/>
     <path d="M28 38 Q40 34 48 42 M100 38 Q88 34 80 42" fill="none" stroke="hsla(162, 100%, 84%, 0.78)" stroke-width="2" stroke-linecap="round"/>
     <path d="M16 26 H38 M88 46 H114 M14 48 H34" stroke="hsla(164, 100%, 82%, 0.55)" stroke-width="1.3" stroke-linecap="round"/>
     <path d="M52 44 Q64 40 76 44 M54 51 Q64 47 74 51" fill="none" stroke="hsla(160, 100%, 86%, 0.52)" stroke-width="1.3" stroke-linecap="round"/>
     <circle cx="24" cy="18" r="1.8" fill="hsl(160, 100%, 86%)" opacity="0.75"/>
     <circle cx="42" cy="60" r="2" fill="hsl(166, 98%, 76%)" opacity="0.7"/>
     <circle cx="92" cy="56" r="1.7" fill="hsl(162, 100%, 82%)" opacity="0.75"/>
     <circle cx="106" cy="26" r="1.5" fill="hsl(158, 100%, 88%)" opacity="0.7"/>`,
    'hsla(166, 94%, 58%, 0.30)',
    `<radialGradient id="ca-wraith_form-moon" cx="50%" cy="32%" r="42%"><stop offset="0%" stop-color="hsla(162, 100%, 86%, 0.42)"/><stop offset="55%" stop-color="hsla(170, 90%, 52%, 0.16)"/><stop offset="100%" stop-color="hsla(210, 60%, 10%, 0)"/></radialGradient><linearGradient id="ca-wraith_form-ghost" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsla(164, 92%, 74%, 0.88)"/><stop offset="55%" stop-color="hsla(174, 78%, 42%, 0.56)"/><stop offset="100%" stop-color="hsla(192, 74%, 20%, 0.04)"/></linearGradient><linearGradient id="ca-wraith_form-core" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(166, 62%, 22%)"/><stop offset="100%" stop-color="hsla(186, 60%, 12%, 0.1)"/></linearGradient>`
  ),
  catalyst: wrapArtSvg(
    'catalyst',
    'hsl(132, 62%, 15%)',
    'hsl(168, 56%, 7%)',
    `<ellipse cx="72" cy="40" rx="52" ry="30" fill="url(#ca-catalyst-flare)"/>
     <path d="M56 34 Q48 16 64 8 Q82 14 78 30 Q94 18 96 34" fill="none" stroke="hsla(108, 100%, 66%, 0.42)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M18 14 L34 6 L46 22 L38 28 L20 20 Z" fill="url(#ca-catalyst-glass)" stroke="hsl(148, 86%, 72%)" stroke-width="1.3"/>
     <path d="M24 17 L41 19 L38 26 L23 19 Z" fill="url(#ca-catalyst-acid)"/>
     <path d="M44 25 Q54 27 59 35" fill="none" stroke="hsl(104, 100%, 68%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M62 24 H82 V33 L95 52 A10 10 0 0 1 86 66 H58 A10 10 0 0 1 49 52 L62 33 Z" fill="url(#ca-catalyst-glass)" stroke="hsl(150, 74%, 14%)" stroke-width="1.8"/>
     <path d="M52 52 Q72 44 92 52 L93 55 A9 9 0 0 1 85 65 H59 A9 9 0 0 1 51 55 Z" fill="url(#ca-catalyst-acid)"/>
     <ellipse cx="72" cy="51" rx="19" ry="3.6" fill="hsl(96, 100%, 74%)" opacity="0.88"/>
     <path d="M60 35 L54 53 M65 26 V32" stroke="hsla(0, 0%, 100%, 0.65)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M66 46 Q72 24 74 10 M76 46 Q84 28 96 14 M62 47 Q52 32 46 24" fill="none" stroke="hsl(104, 100%, 72%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="66" cy="57" r="2.6" fill="hsl(92, 100%, 84%)"/>
     <circle cx="77" cy="55" r="2" fill="hsl(92, 100%, 84%)"/>
     <circle cx="72" cy="18" r="3" fill="hsl(102, 100%, 76%)"/>
     <circle cx="88" cy="24" r="2.2" fill="hsl(110, 100%, 74%)"/>
     <circle cx="102" cy="36" r="1.8" fill="hsl(98, 100%, 78%)"/>
     <rect x="60" y="21" width="24" height="4" rx="1.5" fill="hsl(146, 70%, 74%)" stroke="hsl(162, 58%, 14%)" stroke-width="1"/>`,
    'hsla(112, 98%, 54%, 0.32)',
    `<radialGradient id="ca-catalyst-flare" cx="58%" cy="54%" r="44%"><stop offset="0%" stop-color="hsla(104, 100%, 66%, 0.55)"/><stop offset="55%" stop-color="hsla(128, 94%, 44%, 0.24)"/><stop offset="100%" stop-color="hsla(156, 80%, 14%, 0)"/></radialGradient><linearGradient id="ca-catalyst-acid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(98, 100%, 66%)"/><stop offset="100%" stop-color="hsl(134, 92%, 34%)"/></linearGradient><linearGradient id="ca-catalyst-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(154, 80%, 92%, 0.42)"/><stop offset="100%" stop-color="hsla(160, 54%, 26%, 0.22)"/></linearGradient>`
  ),
  corpse_explosion: wrapArtSvg(
    'corpse_explosion',
    'hsl(124, 56%, 14%)',
    'hsl(350, 44%, 7%)',
    `<ellipse cx="64" cy="37" rx="58" ry="34" fill="url(#ca-corpse_explosion-nova)"/>
     <circle cx="64" cy="37" r="28" fill="none" stroke="hsla(96, 100%, 66%, 0.45)" stroke-width="2" stroke-dasharray="9 5"/>
     <path d="M64 4 L69 20 L88 9 L76 26 L112 20 L82 36 L116 50 L80 46 L94 66 L68 50 L64 68 L58 50 L34 66 L48 46 L12 50 L46 36 L16 20 L52 26 L40 9 L59 20 Z" fill="hsla(114, 98%, 54%, 0.32)"/>
     <path d="M46 34 Q46 15 62 14 L60 28 L52 38 Z" fill="url(#ca-corpse_explosion-bone)" stroke="hsl(144, 54%, 10%)" stroke-width="1.4"/>
     <path d="M67 14 Q83 16 83 34 L76 39 L67 27 Z" fill="url(#ca-corpse_explosion-bone)" stroke="hsl(144, 54%, 10%)" stroke-width="1.4"/>
     <path d="M52 44 L76 44 L72 54 L67 51 L64 55 L60 51 L56 54 Z" fill="url(#ca-corpse_explosion-bone)" stroke="hsl(144, 54%, 10%)" stroke-width="1.3"/>
     <ellipse cx="56" cy="29" rx="3.4" ry="4" fill="hsl(152, 60%, 8%)"/>
     <ellipse cx="73" cy="29" rx="3.4" ry="4" fill="hsl(152, 60%, 8%)"/>
     <path d="M64 12 L61 28 L66 36 L63 45" fill="none" stroke="hsl(74, 100%, 86%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M24 28 Q36 32 42 40 M104 28 Q92 32 86 40 M28 56 Q42 52 48 48 M100 56 Q86 52 80 48" fill="none" stroke="hsl(88, 52%, 82%)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="22,18 32,22 25,27" fill="hsl(88, 48%, 84%)" stroke="hsl(144, 52%, 12%)" stroke-width="0.9"/>
     <polygon points="106,18 96,23 103,28" fill="hsl(88, 48%, 84%)" stroke="hsl(144, 52%, 12%)" stroke-width="0.9"/>
     <circle cx="34" cy="14" r="2.6" fill="hsl(104, 100%, 66%)"/>
     <circle cx="96" cy="15" r="2.8" fill="hsl(104, 100%, 66%)"/>
     <circle cx="20" cy="44" r="2.2" fill="hsl(84, 100%, 72%)"/>
     <circle cx="108" cy="44" r="2.4" fill="hsl(84, 100%, 72%)"/>`,
    'hsla(108, 98%, 52%, 0.32)',
    `<radialGradient id="ca-corpse_explosion-nova" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(78, 100%, 80%)"/><stop offset="38%" stop-color="hsla(114, 98%, 50%, 0.72)"/><stop offset="76%" stop-color="hsla(138, 86%, 30%, 0.25)"/><stop offset="100%" stop-color="hsla(350, 70%, 10%, 0)"/></radialGradient><linearGradient id="ca-corpse_explosion-bone" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(86, 44%, 88%)"/><stop offset="100%" stop-color="hsl(120, 28%, 50%)"/></linearGradient>`
  ),
  glass_knife: wrapArtSvg(
    'glass_knife',
    'hsl(192, 56%, 16%)',
    'hsl(222, 54%, 8%)',
    `<ellipse cx="78" cy="28" rx="46" ry="26" fill="url(#ca-glass_knife-gleam)"/>
     <path d="M12 66 L114 6 M28 70 L122 16" stroke="hsla(186, 100%, 84%, 0.22)" stroke-width="2.2"/>
     <polygon points="44,44 110,9 94,28 52,48" fill="url(#ca-glass_knife-top)" stroke="hsl(204, 66%, 16%)" stroke-width="1.3"/>
     <polygon points="52,48 94,28 110,9 60,55" fill="url(#ca-glass_knife-bot)" stroke="hsl(204, 66%, 16%)" stroke-width="1.3"/>
     <polygon points="66,35 84,22 76,36 60,44" fill="hsla(0, 0%, 100%, 0.55)"/>
     <path d="M62 42 L72 34 L70 43 M80 28 L86 24 L89 29" fill="none" stroke="hsl(214, 70%, 20%)" stroke-width="1.1"/>
     <polygon points="36,38 56,57 50,62 32,44" fill="hsl(188, 90%, 84%)" stroke="hsl(208, 62%, 18%)" stroke-width="1.2"/>
     <polygon points="18,62 38,47 45,54 24,67" fill="url(#ca-glass_knife-bot)" stroke="hsl(188, 86%, 80%)" stroke-width="1.2"/>
     <polygon points="14,64 21,59 23,66 16,68" fill="hsl(184, 100%, 92%)"/>
     <polygon points="88,12 96,8 93,16" fill="hsl(184, 100%, 92%)" opacity="0.9"/>
     <polygon points="98,36 108,33 103,42" fill="hsl(172, 96%, 78%)" opacity="0.82"/>
     <polygon points="74,50 82,48 79,57" fill="hsl(188, 96%, 82%)" opacity="0.75"/>
     <polygon points="46,24 54,19 52,28" fill="hsl(184, 100%, 88%)" opacity="0.7"/>
     <path d="M108 5 V15 M103 10 H113 M68 25 V33 M64 29 H72" stroke="hsl(0, 0%, 100%)" stroke-width="1.3" stroke-linecap="round"/>
     <circle cx="94" cy="48" r="1.6" fill="hsl(176, 100%, 86%)"/>`,
    'hsla(186, 98%, 68%, 0.30)',
    `<linearGradient id="ca-glass_knife-top" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(190, 86%, 76%)"/><stop offset="55%" stop-color="hsl(184, 100%, 96%)"/><stop offset="100%" stop-color="hsl(166, 96%, 82%)"/></linearGradient><linearGradient id="ca-glass_knife-bot" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(192, 82%, 62%, 0.85)"/><stop offset="100%" stop-color="hsla(214, 72%, 28%, 0.9)"/></linearGradient><radialGradient id="ca-glass_knife-gleam" cx="76%" cy="28%" r="36%"><stop offset="0%" stop-color="hsla(184, 100%, 92%, 0.55)"/><stop offset="100%" stop-color="hsla(194, 90%, 40%, 0)"/></radialGradient>`
  ),
  blade_dance: wrapArtSvg(
    'blade_dance',
    'hsl(166, 56%, 16%)',
    'hsl(204, 54%, 8%)',
    `<ellipse cx="64" cy="36" rx="54" ry="28" fill="url(#ca-blade_dance-core)"/>
     <ellipse cx="64" cy="36" rx="46" ry="22" fill="none" stroke="url(#ca-blade_dance-ribbon)" stroke-width="2.6"/>
     <ellipse cx="64" cy="36" rx="32" ry="15" fill="none" stroke="hsla(162, 94%, 74%, 0.42)" stroke-width="1.3" stroke-dasharray="10 6"/>
     <path d="M58 36 Q64 26 70 36 Q64 46 58 36 Z" fill="hsla(152, 100%, 76%, 0.72)"/>
     <polygon points="48,14 78,10 68,18 52,18" fill="url(#ca-blade_dance-steel)" stroke="hsl(200, 56%, 10%)" stroke-width="1.2"/>
     <polygon points="94,18 115,34 102,34 90,23" fill="url(#ca-blade_dance-steel)" stroke="hsl(200, 56%, 10%)" stroke-width="1.2"/>
     <polygon points="104,46 80,62 84,52 98,44" fill="url(#ca-blade_dance-steel)" stroke="hsl(200, 56%, 10%)" stroke-width="1.2"/>
     <polygon points="62,62 34,54 44,50 60,55" fill="url(#ca-blade_dance-steel)" stroke="hsl(200, 56%, 10%)" stroke-width="1.2"/>
     <polygon points="14,38 30,18 33,27 22,38" fill="url(#ca-blade_dance-steel)" stroke="hsl(200, 56%, 10%)" stroke-width="1.2"/>
     <path d="M44 15 L52 16 M88 18 L94 21 M103 44 L108 42 M62 60 L69 61 M15 41 L19 36" stroke="hsl(148, 72%, 44%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M22 14 Q42 6 62 8 M108 58 Q88 66 66 64" fill="none" stroke="hsl(152, 100%, 74%)" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
     <circle cx="78" cy="10" r="2" fill="hsl(0, 0%, 100%)"/>
     <circle cx="115" cy="34" r="2" fill="hsl(154, 100%, 84%)"/>
     <circle cx="34" cy="54" r="1.8" fill="hsl(154, 100%, 84%)"/>
     <circle cx="64" cy="36" r="2.6" fill="hsl(150, 100%, 92%)"/>`,
    'hsla(156, 92%, 58%, 0.28)',
    `<radialGradient id="ca-blade_dance-core" cx="50%" cy="50%" r="44%"><stop offset="0%" stop-color="hsla(154, 100%, 66%, 0.36)"/><stop offset="100%" stop-color="hsla(186, 80%, 16%, 0)"/></radialGradient><linearGradient id="ca-blade_dance-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(172, 60%, 96%)"/><stop offset="60%" stop-color="hsl(188, 34%, 72%)"/><stop offset="100%" stop-color="hsl(204, 42%, 34%)"/></linearGradient><linearGradient id="ca-blade_dance-ribbon" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(152, 98%, 62%, 0.15)"/><stop offset="50%" stop-color="hsla(156, 100%, 72%, 0.85)"/><stop offset="100%" stop-color="hsla(180, 96%, 62%, 0.15)"/></linearGradient>`
  ),
  noxious_fumes: wrapArtSvg(
    'noxious_fumes',
    'hsl(134, 58%, 14%)',
    'hsl(166, 52%, 6%)',
    `<ellipse cx="64" cy="62" rx="60" ry="26" fill="url(#ca-noxious_fumes-vent)"/>
     <path d="M0 72 L0 56 L18 52 L34 58 L54 48 L74 58 L96 50 L114 58 L128 52 L128 72 Z" fill="hsl(168, 48%, 9%)"/>
     <path d="M8 64 Q4 40 22 36 Q26 20 44 24 Q54 8 72 16 Q88 8 98 26 Q118 24 118 44 Q124 58 112 66 Z" fill="url(#ca-noxious_fumes-plume2)" stroke="hsl(154, 62%, 12%)" stroke-width="1.3"/>
     <path d="M22 66 Q18 46 36 42 Q42 22 64 20 Q84 22 90 42 Q108 44 104 66 Z" fill="url(#ca-noxious_fumes-plume1)" stroke="hsl(148, 66%, 14%)" stroke-width="1.2"/>
     <path d="M46 32 Q54 24 64 26 Q74 24 82 32 Q80 42 72 44 L70 49 H58 L56 44 Q48 42 46 32 Z" fill="hsla(98, 100%, 72%, 0.42)"/>
     <circle cx="57" cy="34" r="3" fill="hsl(156, 62%, 11%)"/>
     <circle cx="71" cy="34" r="3" fill="hsl(156, 62%, 11%)"/>
     <path d="M60 44 V48 M64 44 V48 M68 44 V48" stroke="hsl(156, 62%, 11%)" stroke-width="1.3"/>
     <path d="M26 24 Q34 10 46 16 M84 14 Q96 6 106 18 M12 44 Q24 36 32 46" fill="none" stroke="hsl(104, 100%, 70%)" stroke-width="1.6" stroke-linecap="round" opacity="0.8"/>
     <path d="M38 66 H56 M70 66 H90" stroke="hsl(96, 100%, 66%)" stroke-width="2.4" stroke-linecap="round"/>
     <circle cx="28" cy="52" r="3.4" fill="hsl(106, 100%, 68%)" stroke="hsl(146, 66%, 20%)" stroke-width="0.9"/>
     <circle cx="96" cy="48" r="2.8" fill="hsl(106, 100%, 68%)" stroke="hsl(146, 66%, 20%)" stroke-width="0.9"/>
     <circle cx="48" cy="14" r="2" fill="hsl(98, 100%, 78%)" opacity="0.85"/>
     <circle cx="84" cy="18" r="2.2" fill="hsl(98, 100%, 78%)" opacity="0.8"/>
     <circle cx="110" cy="32" r="1.8" fill="hsl(110, 100%, 74%)" opacity="0.75"/>`,
    'hsla(118, 96%, 48%, 0.30)',
    `<linearGradient id="ca-noxious_fumes-plume1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsla(104, 98%, 62%, 0.78)"/><stop offset="100%" stop-color="hsla(142, 76%, 22%, 0.88)"/></linearGradient><linearGradient id="ca-noxious_fumes-plume2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsla(124, 92%, 48%, 0.7)"/><stop offset="100%" stop-color="hsla(162, 68%, 14%, 0.92)"/></linearGradient><radialGradient id="ca-noxious_fumes-vent" cx="50%" cy="88%" r="52%"><stop offset="0%" stop-color="hsla(100, 100%, 58%, 0.65)"/><stop offset="100%" stop-color="hsla(142, 80%, 14%, 0)"/></radialGradient>`
  ),
  after_image: wrapArtSvg(
    'after_image',
    'hsl(178, 56%, 16%)',
    'hsl(220, 56%, 8%)',
    `<path d="M4 22 H112 M8 38 H118 M2 54 H104" stroke="hsla(170, 96%, 68%, 0.22)" stroke-width="3" stroke-linecap="round"/>
     <path d="M16 62 L24 30 Q30 16 40 20 L48 34 L38 64 Z" fill="url(#ca-after_image-echo1)" stroke="hsla(176, 94%, 72%, 0.32)" stroke-width="1"/>
     <path d="M38 62 L46 28 Q54 14 64 18 L72 34 L62 64 Z" fill="url(#ca-after_image-echo2)" stroke="hsla(166, 96%, 76%, 0.55)" stroke-width="1.1"/>
     <path d="M58 64 L68 26 Q78 12 90 17 L98 36 L86 65 Q74 58 58 64 Z" fill="url(#ca-after_image-hero)" stroke="hsl(206, 62%, 8%)" stroke-width="1.6"/>
     <path d="M62 44 Q48 48 36 44 Q48 36 66 34 Z" fill="hsl(166, 60%, 34%)" stroke="hsl(198, 56%, 10%)" stroke-width="1.1"/>
     <path d="M77 18 Q84 15 88 23 L84 29 L76 26 Z" fill="hsl(158, 38%, 88%)" stroke="hsl(196, 54%, 12%)" stroke-width="1"/>
     <circle cx="84" cy="23" r="1.5" fill="hsl(152, 100%, 78%)"/>
     <polygon points="88,42 108,24 106,30 90,46" fill="hsl(178, 52%, 90%)" stroke="hsl(202, 58%, 12%)" stroke-width="1.1"/>
     <path d="M98 10 Q120 36 98 64" fill="none" stroke="url(#ca-after_image-shield)" stroke-width="3.6" stroke-linecap="round"/>
     <path d="M104 16 Q122 36 104 58" fill="none" stroke="hsl(164, 100%, 88%)" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/>
     <path d="M14 28 L34 28 M24 46 L52 46" stroke="hsl(168, 100%, 78%)" stroke-width="1.5" stroke-linecap="round" opacity="0.72"/>
     <circle cx="112" cy="24" r="2" fill="hsl(162, 100%, 88%)"/>
     <circle cx="114" cy="48" r="1.7" fill="hsl(168, 100%, 84%)"/>
     <circle cx="48" cy="16" r="1.5" fill="hsl(170, 96%, 76%)" opacity="0.7"/>`,
    'hsla(168, 94%, 60%, 0.28)',
    `<linearGradient id="ca-after_image-echo1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(178, 90%, 66%, 0.28)"/><stop offset="100%" stop-color="hsla(204, 72%, 34%, 0.08)"/></linearGradient><linearGradient id="ca-after_image-echo2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(166, 94%, 64%, 0.56)"/><stop offset="100%" stop-color="hsla(188, 72%, 28%, 0.2)"/></linearGradient><linearGradient id="ca-after_image-hero" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(164, 62%, 32%)"/><stop offset="100%" stop-color="hsl(194, 58%, 13%)"/></linearGradient><linearGradient id="ca-after_image-shield" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsla(162, 100%, 84%, 0.85)"/><stop offset="100%" stop-color="hsla(178, 96%, 54%, 0.2)"/></linearGradient>`
  ),
  adrenaline: wrapArtSvg(
    'adrenaline',
    'hsl(150, 64%, 15%)',
    'hsl(190, 58%, 7%)',
    `<ellipse cx="56" cy="40" rx="54" ry="30" fill="url(#ca-adrenaline-surge)"/>
     <polyline points="2,42 20,42 28,28 36,56 46,14 56,62 64,34 74,42 126,42" fill="none" stroke="hsl(126, 100%, 66%)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" opacity="0.88"/>
     <polyline points="2,42 20,42 28,28 36,56 46,14 56,62 64,34 74,42 126,42" fill="none" stroke="hsl(104, 100%, 88%)" stroke-width="0.9" stroke-linejoin="round"/>
     <polygon points="48,44 88,16 96,26 56,54" fill="hsla(164, 72%, 90%, 0.28)" stroke="hsl(168, 66%, 12%)" stroke-width="1.5"/>
     <polygon points="52,46 80,26 86,33 58,52" fill="url(#ca-adrenaline-serum)"/>
     <line x1="56" y1="43" x2="86" y2="21" stroke="hsla(0, 0%, 100%, 0.72)" stroke-width="1.2"/>
     <path d="M62 35 L65 39 M69 30 L72 34 M76 25 L79 29" stroke="hsl(172, 60%, 16%)" stroke-width="1.1"/>
     <polygon points="86,14 98,28 94,31 82,17" fill="url(#ca-adrenaline-brass)" stroke="hsl(24, 58%, 14%)" stroke-width="1.1"/>
     <line x1="93" y1="20" x2="108" y2="9" stroke="url(#ca-adrenaline-brass)" stroke-width="3.2" stroke-linecap="round"/>
     <line x1="103" y1="5" x2="113" y2="14" stroke="hsl(44, 92%, 74%)" stroke-width="2.8" stroke-linecap="round"/>
     <polygon points="48,44 55,53 45,56 42,51" fill="url(#ca-adrenaline-brass)" stroke="hsl(24, 58%, 14%)" stroke-width="1"/>
     <line x1="44" y1="53" x2="22" y2="66" stroke="hsl(174, 72%, 92%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M18 65 L28 56 M24 67 L32 64 M16 58 L24 62" stroke="hsl(114, 100%, 76%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="22" cy="65" r="3" fill="hsl(104, 100%, 84%)"/>
     <circle cx="64" cy="43" r="1.8" fill="hsl(98, 100%, 88%)"/>
     <circle cx="104" cy="54" r="2" fill="hsl(126, 100%, 74%)"/>`,
    'hsla(142, 100%, 56%, 0.34)',
    `<radialGradient id="ca-adrenaline-surge" cx="44%" cy="54%" r="46%"><stop offset="0%" stop-color="hsla(136, 100%, 66%, 0.52)"/><stop offset="60%" stop-color="hsla(152, 96%, 44%, 0.2)"/><stop offset="100%" stop-color="hsla(186, 80%, 12%, 0)"/></radialGradient><linearGradient id="ca-adrenaline-serum" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(114, 100%, 70%)"/><stop offset="100%" stop-color="hsl(148, 96%, 40%)"/></linearGradient><linearGradient id="ca-adrenaline-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(44, 90%, 74%)"/><stop offset="100%" stop-color="hsl(32, 72%, 38%)"/></linearGradient>`
  ),
  alchemize: wrapArtSvg(
    'alchemize',
    'hsl(182, 52%, 15%)',
    'hsl(232, 50%, 8%)',
    `<ellipse cx="64" cy="38" rx="56" ry="30" fill="url(#ca-alchemize-glow)"/>
     <rect x="0" y="60" width="128" height="12" fill="hsl(218, 42%, 9%)"/>
     <path d="M32 28 Q48 10 64 22 Q82 8 98 28" fill="none" stroke="hsla(186, 76%, 82%, 0.5)" stroke-width="2" stroke-linecap="round"/>
     <path d="M26 28 H36 V35 L43 52 A5 5 0 0 1 38 60 H24 A5 5 0 0 1 19 52 L26 35 Z" fill="hsla(192, 60%, 84%, 0.22)" stroke="hsl(206, 56%, 12%)" stroke-width="1.4"/>
     <path d="M21 51 H41 L39 59 H23 Z" fill="url(#ca-alchemize-cyan)"/>
     <path d="M56 18 H72 V29 L84 49 A9 9 0 0 1 76 63 H52 A9 9 0 0 1 44 49 L56 29 Z" fill="hsla(154, 70%, 88%, 0.24)" stroke="hsl(172, 60%, 10%)" stroke-width="1.6"/>
     <path d="M47 48 Q64 43 81 48 L77 62 H51 Z" fill="url(#ca-alchemize-green)"/>
     <rect x="57" y="13" width="14" height="5" rx="1.4" fill="hsl(32, 54%, 48%)" stroke="hsl(22, 50%, 14%)" stroke-width="1"/>
     <polygon points="98,28 110,45 98,61 86,45" fill="hsla(42, 74%, 88%, 0.22)" stroke="hsl(20, 56%, 14%)" stroke-width="1.4"/>
     <polygon points="98,38 108,46 98,59 88,46" fill="url(#ca-alchemize-amber)"/>
     <rect x="94" y="23" width="8" height="5" rx="1.2" fill="hsl(32, 54%, 48%)" stroke="hsl(22, 50%, 14%)" stroke-width="0.9"/>
     <path d="M54 34 L49 50 M26 38 L23 50 M93 40 L90 46" stroke="hsla(0, 0%, 100%, 0.72)" stroke-width="1.3" stroke-linecap="round"/>
     <circle cx="60" cy="54" r="2.2" fill="hsl(98, 100%, 84%)"/>
     <circle cx="69" cy="52" r="1.7" fill="hsl(98, 100%, 84%)"/>
     <circle cx="48" cy="14" r="2" fill="hsl(148, 100%, 76%)"/>
     <circle cx="84" cy="14" r="2.2" fill="hsl(46, 100%, 78%)"/>
     <circle cx="114" cy="24" r="1.7" fill="hsl(188, 100%, 80%)"/>`,
    'hsla(158, 92%, 56%, 0.28)',
    `<linearGradient id="ca-alchemize-green" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(116, 100%, 62%)"/><stop offset="100%" stop-color="hsl(148, 90%, 30%)"/></linearGradient><linearGradient id="ca-alchemize-cyan" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(188, 100%, 68%)"/><stop offset="100%" stop-color="hsl(214, 88%, 34%)"/></linearGradient><linearGradient id="ca-alchemize-amber" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(44, 100%, 66%)"/><stop offset="100%" stop-color="hsl(352, 86%, 40%)"/></linearGradient><radialGradient id="ca-alchemize-glow" cx="50%" cy="52%" r="48%"><stop offset="0%" stop-color="hsla(142, 96%, 56%, 0.36)"/><stop offset="100%" stop-color="hsla(216, 70%, 14%, 0)"/></radialGradient>`
  ),
  eruption: wrapArtSvg(
    'eruption',
    'hsl(342, 74%, 22%)',
    'hsl(312, 62%, 8%)',
    `<ellipse cx="64" cy="54" rx="54" ry="24" fill="url(#ca-eruption-core)"/>
     <path d="M20 56 Q34 20 64 14 Q94 20 108 56" fill="none" stroke="hsl(344, 92%, 58%)" stroke-width="1.5" opacity="0.52"/>
     <path d="M8 62 L28 53 L48 58 L64 52 L82 58 L102 52 L120 62 L124 72 L4 72 Z" fill="url(#ca-eruption-stone)" stroke="hsl(348, 86%, 54%)" stroke-width="1.2"/>
     <path d="M36 58 Q30 34 46 18 Q44 30 56 8 Q66 22 72 6 Q76 26 88 18 Q84 36 92 58 Z" fill="hsl(326, 76%, 18%)" opacity="0.65" transform="translate(2,2)"/>
     <path d="M36 58 Q30 34 46 18 Q44 30 56 8 Q66 22 72 6 Q76 26 88 18 Q84 36 92 58 Z" fill="url(#ca-eruption-plume)" stroke="hsl(44, 100%, 78%)" stroke-width="1.3"/>
     <path d="M48 58 Q46 38 60 22 Q64 32 68 18 Q76 36 78 58 Z" fill="hsl(48, 100%, 84%)" opacity="0.86"/>
     <path d="M56 58 Q58 42 64 32 Q70 42 72 58 Z" fill="hsl(54, 100%, 96%)"/>
     <path d="M18 60 L44 57 L58 64 M110 60 L84 57 L70 64" stroke="hsl(42, 100%, 74%)" stroke-width="1.9" fill="none" stroke-linecap="round"/>
     <path d="M16 42 Q28 32 36 22 M112 42 Q100 32 92 22" stroke="hsl(348, 98%, 68%)" stroke-width="2" fill="none" stroke-linecap="round"/>
     <polygon points="24,44 31,40 29,48" fill="hsl(292, 46%, 24%)" stroke="hsl(36, 98%, 68%)" stroke-width="0.9"/>
     <polygon points="98,42 106,46 97,49" fill="hsl(292, 46%, 24%)" stroke="hsl(36, 98%, 68%)" stroke-width="0.9"/>
     <circle cx="34" cy="14" r="2.1" fill="hsl(46, 100%, 82%)"/>
     <circle cx="96" cy="14" r="2.2" fill="hsl(44, 100%, 80%)"/>
     <circle cx="46" cy="10" r="1.4" fill="hsl(348, 100%, 76%)"/>
     <circle cx="84" cy="28" r="1.6" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(348, 98%, 56%, 0.32)',
    `<linearGradient id="ca-eruption-plume" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="32%" stop-color="hsl(36, 100%, 62%)"/><stop offset="70%" stop-color="hsl(344, 96%, 54%)"/><stop offset="100%" stop-color="hsl(304, 86%, 44%)"/></linearGradient><radialGradient id="ca-eruption-core" cx="50%" cy="76%" r="54%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="45%" stop-color="hsl(18, 98%, 56%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(338, 90%, 40%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-eruption-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(296, 42%, 22%)"/><stop offset="100%" stop-color="hsl(286, 48%, 10%)"/></linearGradient>`
  ),
  vigilance: wrapArtSvg(
    'vigilance',
    'hsl(204, 64%, 20%)',
    'hsl(226, 56%, 9%)',
    `<ellipse cx="64" cy="58" rx="52" ry="10" fill="none" stroke="hsl(194, 92%, 68%)" stroke-width="1.1" opacity="0.42"/>
     <ellipse cx="64" cy="59" rx="34" ry="6.5" fill="none" stroke="hsl(190, 100%, 82%)" stroke-width="1.3" opacity="0.65"/>
     <circle cx="64" cy="37" r="28" fill="url(#ca-vigilance-dome)" stroke="hsl(192, 96%, 78%)" stroke-width="1.6"/>
     <path d="M40 52 Q26 42 32 28 Q42 38 48 48 Z M88 52 Q102 42 96 28 Q86 38 80 48 Z" fill="hsl(218, 62%, 34%)" stroke="hsl(194, 92%, 76%)" stroke-width="1.1"/>
     <path d="M44 53 Q36 32 50 22 Q56 34 58 50 Z M84 53 Q92 32 78 22 Q72 34 70 50 Z" fill="url(#ca-vigilance-lotus)" stroke="hsl(192, 100%, 88%)" stroke-width="1.1"/>
     <path d="M52 54 Q48 30 64 16 Q80 30 76 54 Q64 58 52 54 Z" fill="url(#ca-vigilance-lotus)" stroke="hsl(190, 100%, 94%)" stroke-width="1.4"/>
     <path d="M64 21 Q69 34 64 49 Q59 34 64 21 Z" fill="hsl(50, 100%, 90%)" opacity="0.84"/>
     <circle cx="64" cy="39" r="3.4" fill="hsl(48, 100%, 82%)" stroke="hsl(194, 96%, 86%)" stroke-width="1"/>
     <path d="M22 44 Q18 20 40 11 M106 44 Q110 20 88 11" fill="none" stroke="hsl(42, 86%, 68%)" stroke-width="1.2" stroke-dasharray="2 3" opacity="0.82"/>
     <circle cx="24" cy="36" r="3.4" fill="url(#ca-vigilance-bead)" stroke="hsl(52, 100%, 92%)" stroke-width="0.8"/>
     <circle cx="28" cy="23" r="3.2" fill="url(#ca-vigilance-bead)" stroke="hsl(52, 100%, 92%)" stroke-width="0.8"/>
     <circle cx="38" cy="13" r="3" fill="url(#ca-vigilance-bead)" stroke="hsl(52, 100%, 92%)" stroke-width="0.8"/>
     <circle cx="104" cy="36" r="3.4" fill="url(#ca-vigilance-bead)" stroke="hsl(52, 100%, 92%)" stroke-width="0.8"/>
     <circle cx="100" cy="23" r="3.2" fill="url(#ca-vigilance-bead)" stroke="hsl(52, 100%, 92%)" stroke-width="0.8"/>
     <circle cx="90" cy="13" r="3" fill="url(#ca-vigilance-bead)" stroke="hsl(52, 100%, 92%)" stroke-width="0.8"/>
     <circle cx="64" cy="8" r="2.2" fill="hsl(190, 100%, 92%)"/>`,
    'hsla(192, 94%, 60%, 0.28)',
    `<radialGradient id="ca-vigilance-dome" cx="50%" cy="46%" r="52%"><stop offset="0%" stop-color="hsl(190, 100%, 90%)" stop-opacity="0.34"/><stop offset="68%" stop-color="hsl(198, 92%, 62%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(214, 88%, 54%)" stop-opacity="0.04"/></radialGradient><linearGradient id="ca-vigilance-lotus" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(192, 100%, 95%)"/><stop offset="55%" stop-color="hsl(198, 86%, 72%)"/><stop offset="100%" stop-color="hsl(236, 62%, 44%)"/></linearGradient><linearGradient id="ca-vigilance-bead" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 86%)"/><stop offset="100%" stop-color="hsl(32, 76%, 44%)"/></linearGradient>`
  ),
  blasphemy: wrapArtSvg(
    'blasphemy',
    'hsl(282, 58%, 18%)',
    'hsl(332, 58%, 8%)',
    `<circle cx="64" cy="28" r="34" fill="url(#ca-blasphemy-glow)"/>
     <path d="M64 26 L18 6 M64 26 L110 6 M64 26 L10 34 M64 26 L118 34 M64 26 L26 60 M64 26 L102 60" stroke="hsl(44, 96%, 68%)" stroke-width="1.1" opacity="0.34"/>
     <path d="M28 24 A36 14 0 0 1 60 12 M68 12 A36 14 0 0 1 100 24 M98 28 A36 14 0 0 1 69 37 M59 37 A36 14 0 0 1 30 28" fill="none" stroke="url(#ca-blasphemy-halo)" stroke-width="4.2" stroke-linecap="round"/>
     <path d="M58 10 L63 17 L69 10 M58 39 L64 33 L70 40" stroke="hsl(52, 100%, 92%)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
     <path d="M64 8 L72 28 L69 52 L64 67 L59 52 L56 28 Z" fill="hsl(276, 70%, 8%)" opacity="0.72" transform="translate(2.5,2)"/>
     <path d="M64 8 L71 26 L68 51 L64 66 L60 51 L57 26 Z" fill="url(#ca-blasphemy-blade)" stroke="hsl(312, 88%, 68%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M64 11 L67 28 L64 61 L61 28 Z" fill="hsl(292, 84%, 68%)" opacity="0.52"/>
     <path d="M64 13 V56" stroke="hsl(48, 100%, 88%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M48 25 Q64 32 80 25 L74 30 Q64 35 54 30 Z" fill="url(#ca-blasphemy-halo)" stroke="hsl(280, 60%, 16%)" stroke-width="1"/>
     <path d="M32 58 Q44 42 54 48 Q46 58 42 66 M96 58 Q84 42 74 48 Q82 58 86 66" fill="none" stroke="hsl(324, 92%, 56%)" stroke-width="2" stroke-linecap="round" opacity="0.78"/>
     <polygon points="44,14 50,11 48,18" fill="hsl(46, 100%, 76%)"/>
     <polygon points="82,13 88,16 81,19" fill="hsl(46, 100%, 76%)"/>
     <path d="M64 66 Q67 69 64 71 Q61 69 64 66 Z" fill="hsl(344, 96%, 62%)"/>
     <circle cx="38" cy="36" r="1.7" fill="hsl(48, 100%, 86%)"/>
     <circle cx="90" cy="36" r="1.7" fill="hsl(338, 96%, 68%)"/>`,
    'hsla(44, 98%, 58%, 0.28)',
    `<linearGradient id="ca-blasphemy-halo" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 88%)"/><stop offset="55%" stop-color="hsl(42, 98%, 58%)"/><stop offset="100%" stop-color="hsl(344, 92%, 52%)"/></linearGradient><linearGradient id="ca-blasphemy-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(286, 62%, 52%)"/><stop offset="48%" stop-color="hsl(274, 58%, 22%)"/><stop offset="100%" stop-color="hsl(262, 64%, 10%)"/></linearGradient><radialGradient id="ca-blasphemy-glow" cx="50%" cy="34%" r="48%"><stop offset="0%" stop-color="hsl(46, 100%, 82%)" stop-opacity="0.72"/><stop offset="52%" stop-color="hsl(326, 90%, 48%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(280, 70%, 16%)" stop-opacity="0"/></radialGradient>`
  ),
  deva_form: wrapArtSvg(
    'deva_form',
    'hsl(270, 58%, 22%)',
    'hsl(294, 52%, 9%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-deva_form-mandala)"/>
     <circle cx="64" cy="36" r="26" fill="none" stroke="hsl(48, 98%, 74%)" stroke-width="1.3" stroke-dasharray="3 2.5"/>
     <circle cx="64" cy="36" r="19" fill="none" stroke="hsl(50, 100%, 84%)" stroke-width="1.1" opacity="0.82"/>
     <path d="M64 6 L68 15 L78 9 L76 19 L88 18 L81 26 L93 32 L83 37 L92 46 L81 46 L86 56 L75 53 L75 63 L64 57 L53 63 L53 53 L42 56 L47 46 L36 46 L45 37 L35 32 L47 26 L40 18 L52 19 L50 9 L60 15 Z" fill="none" stroke="hsl(46, 98%, 72%)" stroke-width="1.1" opacity="0.62"/>
     <path d="M56 32 Q38 18 24 22 M72 32 Q90 18 104 22 M55 37 Q34 34 18 40 M73 37 Q94 34 110 40 M56 42 Q38 48 26 56 M72 42 Q90 48 102 56" fill="none" stroke="hsl(288, 86%, 72%)" stroke-width="3" stroke-linecap="round" opacity="0.82"/>
     <path d="M56 32 Q38 18 24 22 M72 32 Q90 18 104 22 M55 37 Q34 34 18 40 M73 37 Q94 34 110 40 M56 42 Q38 48 26 56 M72 42 Q90 48 102 56" fill="none" stroke="hsl(50, 100%, 88%)" stroke-width="1.1" stroke-linecap="round"/>
     <path d="M64 25 Q71 27 72 38 L78 51 Q84 56 76 61 L52 61 Q44 56 50 51 L56 38 Q57 27 64 25 Z" fill="hsl(272, 62%, 14%)" opacity="0.65" transform="translate(1.5,2)"/>
     <path d="M64 25 Q71 27 72 38 L78 51 Q84 56 76 61 L52 61 Q44 56 50 51 L56 38 Q57 27 64 25 Z" fill="url(#ca-deva_form-body)" stroke="hsl(50, 100%, 88%)" stroke-width="1.3"/>
     <circle cx="64" cy="19" r="5.5" fill="url(#ca-deva_form-body)" stroke="hsl(50, 100%, 90%)" stroke-width="1.2"/>
     <path d="M64 16 L66 19 L64 21 L62 19 Z" fill="hsl(54, 100%, 97%)"/>
     <circle cx="24" cy="22" r="4.2" fill="url(#ca-deva_form-orb)"/>
     <circle cx="104" cy="22" r="4.2" fill="url(#ca-deva_form-orb)"/>
     <circle cx="18" cy="40" r="3.6" fill="url(#ca-deva_form-orb)"/>
     <circle cx="110" cy="40" r="3.6" fill="url(#ca-deva_form-orb)"/>
     <circle cx="26" cy="56" r="3.2" fill="url(#ca-deva_form-orb)"/>
     <circle cx="102" cy="56" r="3.2" fill="url(#ca-deva_form-orb)"/>`,
    'hsla(46, 100%, 64%, 0.30)',
    `<radialGradient id="ca-deva_form-mandala" cx="50%" cy="48%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)" stop-opacity="0.88"/><stop offset="52%" stop-color="hsl(44, 98%, 62%)" stop-opacity="0.45"/><stop offset="100%" stop-color="hsl(286, 78%, 44%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-deva_form-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 88%)"/><stop offset="48%" stop-color="hsl(292, 82%, 68%)"/><stop offset="100%" stop-color="hsl(268, 64%, 28%)"/></linearGradient><radialGradient id="ca-deva_form-orb" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="hsl(56, 100%, 97%)"/><stop offset="60%" stop-color="hsl(46, 100%, 66%)"/><stop offset="100%" stop-color="hsl(32, 92%, 48%)"/></radialGradient>`
  ),
  ragnarok: wrapArtSvg(
    'ragnarok',
    'hsl(260, 56%, 19%)',
    'hsl(316, 52%, 8%)',
    `<path d="M0 0 H128 V16 Q112 22 96 15 Q80 23 64 16 Q46 23 30 15 Q16 21 0 15 Z" fill="url(#ca-ragnarok-cloud)"/>
     <path d="M4 60 L24 54 L44 59 L64 53 L84 59 L106 54 L124 61 L128 72 L0 72 Z" fill="hsl(268, 42%, 14%)" stroke="hsl(292, 74%, 56%)" stroke-width="1.1"/>
     <ellipse cx="64" cy="58" rx="46" ry="11" fill="url(#ca-ragnarok-impact)"/>
     <path d="M22 14 L16 32 L24 31 L18 55" fill="none" stroke="hsl(296, 92%, 64%)" stroke-width="4" stroke-linejoin="round" opacity="0.52"/>
     <path d="M22 14 L16 32 L24 31 L18 55" fill="none" stroke="url(#ca-ragnarok-bolt)" stroke-width="2" stroke-linejoin="round"/>
     <path d="M42 12 L36 30 L45 29 L38 56" fill="none" stroke="hsl(296, 92%, 64%)" stroke-width="4.4" stroke-linejoin="round" opacity="0.58"/>
     <path d="M42 12 L36 30 L45 29 L38 56" fill="none" stroke="url(#ca-ragnarok-bolt)" stroke-width="2.2" stroke-linejoin="round"/>
     <path d="M66 10 L56 32 L68 30 L59 58 L71 33 L62 34 L72 10 Z" fill="hsl(298, 92%, 62%)" opacity="0.65" transform="translate(1.5,1)"/>
     <path d="M65 9 L56 31 L67 29 L60 58 L70 32 L62 33 L71 9 Z" fill="url(#ca-ragnarok-bolt)" stroke="hsl(54, 100%, 96%)" stroke-width="0.9"/>
     <path d="M88 12 L82 30 L91 29 L85 56" fill="none" stroke="hsl(296, 92%, 64%)" stroke-width="4.4" stroke-linejoin="round" opacity="0.58"/>
     <path d="M88 12 L82 30 L91 29 L85 56" fill="none" stroke="url(#ca-ragnarok-bolt)" stroke-width="2.2" stroke-linejoin="round"/>
     <path d="M108 14 L103 32 L111 31 L106 55" fill="none" stroke="hsl(296, 92%, 64%)" stroke-width="4" stroke-linejoin="round" opacity="0.52"/>
     <path d="M108 14 L103 32 L111 31 L106 55" fill="none" stroke="url(#ca-ragnarok-bolt)" stroke-width="2" stroke-linejoin="round"/>
     <path d="M48 61 L60 58 L72 64 M28 59 L38 57 L45 63 M80 61 L87 57 L96 63" stroke="hsl(48, 100%, 82%)" stroke-width="1.3" fill="none"/>
     <polygon points="48,48 53,45 51,51" fill="hsl(276, 42%, 26%)" stroke="hsl(46, 98%, 74%)" stroke-width="0.8"/>
     <polygon points="75,46 80,49 74,51" fill="hsl(276, 42%, 26%)" stroke="hsl(46, 98%, 74%)" stroke-width="0.8"/>`,
    'hsla(46, 100%, 62%, 0.28)',
    `<linearGradient id="ca-ragnarok-bolt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="48%" stop-color="hsl(45, 100%, 68%)"/><stop offset="100%" stop-color="hsl(296, 94%, 66%)"/></linearGradient><linearGradient id="ca-ragnarok-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(268, 52%, 10%)"/><stop offset="100%" stop-color="hsl(278, 46%, 24%)"/></linearGradient><radialGradient id="ca-ragnarok-impact" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 95%)"/><stop offset="52%" stop-color="hsl(42, 100%, 62%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(312, 92%, 50%)" stop-opacity="0"/></radialGradient>`
  ),
  vault: wrapArtSvg(
    'vault',
    'hsl(238, 58%, 19%)',
    'hsl(274, 52%, 8%)',
    `<path d="M10 54 Q64 -2 118 54" fill="none" stroke="hsl(46, 96%, 74%)" stroke-width="1.3" stroke-dasharray="4 3" opacity="0.58"/>
     <circle cx="64" cy="42" r="24" fill="none" stroke="hsl(202, 86%, 72%)" stroke-width="0.9" opacity="0.38"/>
     <path d="M40 50 A22 22 0 1 0 88 50 A18 18 0 1 1 40 50 Z" fill="hsl(248, 62%, 10%)" opacity="0.6" transform="translate(1.5,2)"/>
     <path d="M40 50 A22 22 0 1 0 88 50 A18 18 0 1 1 40 50 Z" fill="url(#ca-vault-moon)" stroke="hsl(54, 100%, 96%)" stroke-width="1"/>
     <path d="M55 34 H73 M55 62 H73" stroke="hsl(46, 96%, 72%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M57 35 L71 35 L64 48 L71 61 L57 61 L64 48 Z" fill="url(#ca-vault-glass)" fill-opacity="0.32" stroke="hsl(48, 98%, 76%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M60 39 H68 L64 46 Z M60 59 H68 L64 53 Z" fill="hsl(46, 100%, 74%)"/>
     <path d="M18 46 Q42 18 68 20 Q50 26 26 52 Z" fill="url(#ca-vault-scarf)" opacity="0.88"/>
     <path d="M56 20 Q68 10 82 14 L88 22 L81 24 L75 18 L66 23 L70 30 L63 31 L59 24 L50 28 L47 23 Z" fill="hsl(268, 66%, 12%)" opacity="0.65" transform="translate(1.5,2)"/>
     <path d="M56 20 Q68 10 82 14 L88 22 L81 24 L75 18 L66 23 L70 30 L63 31 L59 24 L50 28 L47 23 Z" fill="hsl(284, 72%, 58%)" stroke="hsl(50, 100%, 90%)" stroke-width="1.1" stroke-linejoin="round"/>
     <circle cx="74" cy="11" r="3.4" fill="hsl(50, 100%, 90%)" stroke="hsl(286, 76%, 46%)" stroke-width="0.9"/>
     <path d="M88 18 Q102 22 110 34" fill="none" stroke="hsl(50, 100%, 88%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="22" cy="16" r="1.6" fill="hsl(50, 100%, 92%)"/>
     <circle cx="106" cy="14" r="1.8" fill="hsl(194, 96%, 82%)"/>
     <circle cx="64" cy="49.5" r="1.2" fill="hsl(52, 100%, 94%)"/>`,
    'hsla(48, 96%, 68%, 0.26)',
    `<linearGradient id="ca-vault-moon" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 94%)"/><stop offset="55%" stop-color="hsl(44, 96%, 72%)"/><stop offset="100%" stop-color="hsl(198, 86%, 68%)"/></linearGradient><linearGradient id="ca-vault-scarf" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(286, 86%, 56%)" stop-opacity="0.3"/><stop offset="55%" stop-color="hsl(312, 92%, 64%)"/><stop offset="100%" stop-color="hsl(48, 100%, 84%)"/></linearGradient><linearGradient id="ca-vault-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(46, 100%, 82%)"/><stop offset="50%" stop-color="hsl(204, 88%, 74%)"/><stop offset="100%" stop-color="hsl(44, 96%, 62%)"/></linearGradient>`
  ),
  judgment: wrapArtSvg(
    'judgment',
    'hsl(278, 56%, 19%)',
    'hsl(246, 54%, 8%)',
    `<path d="M22 68 V24 A42 20 0 0 1 106 24 V68" fill="none" stroke="hsl(276, 52%, 44%)" stroke-width="1.4" opacity="0.45"/>
     <circle cx="32" cy="42" r="20" fill="url(#ca-judgment-aura)"/>
     <path d="M48 64 H80 L74 59 H54 Z M64 14 V60" fill="url(#ca-judgment-gold)" stroke="url(#ca-judgment-gold)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M26 30 L102 18" stroke="url(#ca-judgment-gold)" stroke-width="3" stroke-linecap="round"/>
     <circle cx="64" cy="24" r="5" fill="hsl(274, 58%, 16%)" stroke="hsl(50, 100%, 86%)" stroke-width="1.5"/>
     <path d="M56 11 Q64 5 72 11 Q64 17 56 11 Z" fill="hsl(50, 100%, 88%)" stroke="hsl(286, 72%, 48%)" stroke-width="0.9"/>
     <path d="M28 31 L20 50 M28 31 L44 50 M100 19 L90 38 M100 19 L112 38" stroke="hsl(44, 92%, 72%)" stroke-width="1.2"/>
     <path d="M16 50 Q32 58 48 50 Z" fill="url(#ca-judgment-gold)" stroke="hsl(50, 100%, 88%)" stroke-width="1.1"/>
     <path d="M86 38 Q101 45 116 38 Z" fill="url(#ca-judgment-gold)" stroke="hsl(50, 100%, 88%)" stroke-width="1.1"/>
     <path d="M22 50 Q18 35 28 24 Q30 32 35 18 Q42 32 42 50 Z" fill="url(#ca-judgment-flame)" stroke="hsl(50, 100%, 88%)" stroke-width="1"/>
     <path d="M27 50 Q28 39 33 31 Q37 39 37 50 Z" fill="hsl(54, 100%, 95%)" opacity="0.88"/>
     <path d="M96 36 Q101 26 106 36 Q101 38 96 36 Z" fill="hsl(194, 92%, 80%)" opacity="0.72"/>
     <circle cx="24" cy="20" r="1.8" fill="hsl(312, 98%, 76%)"/>
     <circle cx="42" cy="22" r="1.5" fill="hsl(48, 100%, 86%)"/>
     <circle cx="101" cy="27" r="1.5" fill="hsl(194, 100%, 88%)"/>`,
    'hsla(294, 92%, 60%, 0.28)',
    `<linearGradient id="ca-judgment-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 88%)"/><stop offset="52%" stop-color="hsl(42, 94%, 58%)"/><stop offset="100%" stop-color="hsl(30, 80%, 34%)"/></linearGradient><linearGradient id="ca-judgment-flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="42%" stop-color="hsl(312, 96%, 64%)"/><stop offset="100%" stop-color="hsl(276, 88%, 48%)"/></linearGradient><radialGradient id="ca-judgment-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(308, 96%, 66%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(276, 70%, 24%)" stop-opacity="0"/></radialGradient>`
  ),
  lesson_learned: wrapArtSvg(
    'lesson_learned',
    'hsl(284, 50%, 20%)',
    'hsl(28, 54%, 10%)',
    `<circle cx="66" cy="34" r="30" fill="url(#ca-lesson_learned-glow)"/>
     <circle cx="64" cy="36" r="24" fill="none" stroke="hsl(44, 92%, 68%)" stroke-width="1.1" stroke-dasharray="3 3" opacity="0.58"/>
     <path d="M36 52 L54 44 L48 64 L32 60 Z M78 46 L96 52 L92 64 L74 60 Z" fill="hsl(276, 42%, 22%)" stroke="hsl(38, 86%, 62%)" stroke-width="1.2"/>
     <path d="M40 20 Q64 12 88 20 L84 52 Q64 46 44 52 Z" fill="hsl(274, 52%, 12%)" opacity="0.62" transform="translate(2,2)"/>
     <path d="M40 20 Q64 12 88 20 L84 52 Q64 46 44 52 Z" fill="url(#ca-lesson_learned-scroll)" stroke="hsl(36, 82%, 46%)" stroke-width="1.4"/>
     <rect x="37" y="17" width="4" height="36" rx="2" fill="hsl(32, 74%, 44%)" stroke="hsl(48, 100%, 82%)" stroke-width="0.8"/>
     <rect x="85" y="17" width="4" height="36" rx="2" fill="hsl(32, 74%, 44%)" stroke="hsl(48, 100%, 82%)" stroke-width="0.8"/>
     <path d="M16 58 Q56 38 110 12 L106 19 Q58 44 20 62 Z" fill="url(#ca-lesson_learned-slash)" stroke="hsl(52, 100%, 94%)" stroke-width="0.9"/>
     <path d="M64 23 V41 M55 32 H73" stroke="hsl(148, 92%, 52%)" stroke-width="4.4" stroke-linecap="round"/>
     <path d="M64 23 V41 M55 32 H73" stroke="hsl(52, 100%, 92%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M24 22 V30 M20 26 H28 M102 40 V48 M98 44 H106" stroke="hsl(150, 96%, 68%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M52 56 L64 64 L76 56" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="96" cy="22" r="2.2" fill="hsl(50, 100%, 90%)"/>
     <circle cx="30" cy="42" r="1.8" fill="hsl(44, 100%, 78%)"/>`,
    'hsla(44, 98%, 60%, 0.28)',
    `<linearGradient id="ca-lesson_learned-scroll" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 84%, 92%)"/><stop offset="65%" stop-color="hsl(42, 72%, 74%)"/><stop offset="100%" stop-color="hsl(32, 62%, 52%)"/></linearGradient><linearGradient id="ca-lesson_learned-slash" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(312, 92%, 62%)"/><stop offset="52%" stop-color="hsl(46, 100%, 76%)"/><stop offset="100%" stop-color="hsl(54, 100%, 96%)"/></linearGradient><radialGradient id="ca-lesson_learned-glow" cx="50%" cy="44%" r="48%"><stop offset="0%" stop-color="hsl(48, 100%, 88%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(36, 92%, 44%)" stop-opacity="0"/></radialGradient>`
  ),
  alpha: wrapArtSvg(
    'alpha',
    'hsl(234, 58%, 20%)',
    'hsl(262, 54%, 9%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-alpha-core)"/>
     <polygon points="64,7 92,55 36,55" fill="none" stroke="hsl(196, 92%, 72%)" stroke-width="1" opacity="0.42"/>
     <circle cx="64" cy="36" r="26" fill="none" stroke="url(#ca-alpha-ring)" stroke-width="2"/>
     <circle cx="64" cy="36" r="21.5" fill="none" stroke="hsl(48, 98%, 80%)" stroke-width="0.9" stroke-dasharray="2 3" opacity="0.65"/>
     <path d="M64 15 L81 55 H73.5 L69.5 45 H58.5 L54.5 55 H47 Z M60.8 39 H67.2 L64 29 Z" fill="hsl(248, 62%, 10%)" opacity="0.7" transform="translate(2,2.5)"/>
     <path d="M64 15 L81 55 H73.5 L69.5 45 H58.5 L54.5 55 H47 Z M60.8 39 H67.2 L64 29 Z" fill="url(#ca-alpha-rune)" stroke="hsl(54, 100%, 94%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M64 18 L74 44" stroke="hsl(56, 100%, 98%)" stroke-width="1.2" opacity="0.72"/>
     <path d="M18 36 H34 M94 36 H110" stroke="hsl(194, 96%, 78%)" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>
     <polygon points="64,4 66,8 64,12 62,8" fill="hsl(52, 100%, 94%)"/>
     <polygon points="64,60 66,64 64,68 62,64" fill="hsl(194, 98%, 84%)"/>
     <polygon points="24,20 26,23 24,26 22,23" fill="hsl(48, 100%, 88%)"/>
     <polygon points="104,48 106,51 104,54 102,51" fill="hsl(48, 100%, 88%)"/>
     <circle cx="32" cy="54" r="1.6" fill="hsl(194, 100%, 86%)"/>
     <circle cx="96" cy="18" r="1.6" fill="hsl(50, 100%, 90%)"/>`,
    'hsla(198, 94%, 64%, 0.26)',
    `<linearGradient id="ca-alpha-rune" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="52%" stop-color="hsl(46, 98%, 70%)"/><stop offset="100%" stop-color="hsl(34, 86%, 46%)"/></linearGradient><linearGradient id="ca-alpha-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(192, 100%, 84%)"/><stop offset="100%" stop-color="hsl(46, 98%, 72%)"/></linearGradient><radialGradient id="ca-alpha-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(196, 100%, 84%)" stop-opacity="0.45"/><stop offset="100%" stop-color="hsl(248, 70%, 24%)" stop-opacity="0"/></radialGradient>`
  ),
  beta: wrapArtSvg(
    'beta',
    'hsl(274, 60%, 22%)',
    'hsl(242, 56%, 9%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-beta-core)"/>
     <ellipse cx="64" cy="36" rx="44" ry="22" fill="none" stroke="url(#ca-beta-ring)" stroke-width="1.8" transform="rotate(-18 64 36)"/>
     <ellipse cx="64" cy="36" rx="44" ry="22" fill="none" stroke="hsl(46, 98%, 74%)" stroke-width="1.6" opacity="0.82" transform="rotate(18 64 36)"/>
     <circle cx="64" cy="36" r="24" fill="none" stroke="hsl(296, 92%, 74%)" stroke-width="1.1" stroke-dasharray="4 2.5"/>
     <path d="M51 15 H68 Q78 15 78 24 Q78 32 70 35 Q81 37 81 46 Q81 56 69 56 H51 Z M58 21 V32 H66 Q71 32 71 26.5 Q71 21 66 21 Z M58 38 V50 H67.5 Q73.5 50 73.5 44 Q73.5 38 67.5 38 Z" fill="hsl(264, 68%, 10%)" opacity="0.72" transform="translate(2,2.5)"/>
     <path d="M51 15 H68 Q78 15 78 24 Q78 32 70 35 Q81 37 81 46 Q81 56 69 56 H51 Z M58 21 V32 H66 Q71 32 71 26.5 Q71 21 66 21 Z M58 38 V50 H67.5 Q73.5 50 73.5 44 Q73.5 38 67.5 38 Z" fill="url(#ca-beta-rune)" stroke="hsl(54, 100%, 94%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M54 18 V53" stroke="hsl(56, 100%, 97%)" stroke-width="1.4" opacity="0.78"/>
     <path d="M16 36 L28 32 L24 40 L34 36 M94 36 L104 32 L100 40 L112 36" fill="none" stroke="hsl(298, 96%, 76%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="24" cy="22" r="2.8" fill="hsl(48, 100%, 84%)" stroke="hsl(294, 86%, 60%)" stroke-width="1"/>
     <circle cx="104" cy="50" r="2.8" fill="hsl(48, 100%, 84%)" stroke="hsl(294, 86%, 60%)" stroke-width="1"/>
     <circle cx="104" cy="22" r="2.6" fill="hsl(296, 96%, 76%)"/>
     <circle cx="24" cy="50" r="2.6" fill="hsl(296, 96%, 76%)"/>
     <polygon points="64,5 67,10 64,14 61,10" fill="hsl(52, 100%, 94%)"/>
     <polygon points="64,58 67,62 64,67 61,62" fill="hsl(52, 100%, 94%)"/>`,
    'hsla(294, 96%, 62%, 0.28)',
    `<linearGradient id="ca-beta-rune" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="48%" stop-color="hsl(44, 100%, 68%)"/><stop offset="100%" stop-color="hsl(312, 88%, 56%)"/></linearGradient><linearGradient id="ca-beta-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 84%)"/><stop offset="50%" stop-color="hsl(296, 94%, 68%)"/><stop offset="100%" stop-color="hsl(42, 98%, 62%)"/></linearGradient><radialGradient id="ca-beta-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(304, 96%, 68%)" stop-opacity="0.62"/><stop offset="65%" stop-color="hsl(276, 86%, 46%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(252, 70%, 16%)" stop-opacity="0"/></radialGradient>`
  ),
  omega: wrapArtSvg(
    'omega',
    'hsl(296, 66%, 22%)',
    'hsl(338, 60%, 9%)',
    `<ellipse cx="64" cy="36" rx="58" ry="34" fill="url(#ca-omega-corona)"/>
     <path d="M64 36 L6 6 M64 36 L122 6 M64 36 L4 36 M64 36 L124 36 M64 36 L8 66 M64 36 L120 66 M64 36 L42 2 M64 36 L86 2" stroke="hsl(48, 100%, 78%)" stroke-width="1.3" opacity="0.45"/>
     <ellipse cx="64" cy="36" rx="54" ry="26" fill="none" stroke="url(#ca-omega-ring)" stroke-width="1.6" transform="rotate(-10 64 36)"/>
     <ellipse cx="64" cy="36" rx="54" ry="26" fill="none" stroke="hsl(46, 100%, 76%)" stroke-width="1.4" opacity="0.78" transform="rotate(10 64 36)"/>
     <circle cx="64" cy="36" r="29" fill="none" stroke="hsl(50, 100%, 86%)" stroke-width="2" stroke-dasharray="6 2.5"/>
     <path d="M40 52 H52 Q42 44 42 32 A22 21 0 1 1 86 32 Q86 44 76 52 H88 V59 H69 V50 Q78 44 78 32 A14 13.5 0 1 0 50 32 Q50 44 59 50 V59 H40 Z" fill="hsl(316, 70%, 12%)" opacity="0.78" transform="translate(2,2.5)"/>
     <path d="M40 52 H52 Q42 44 42 32 A22 21 0 1 1 86 32 Q86 44 76 52 H88 V59 H69 V50 Q78 44 78 32 A14 13.5 0 1 0 50 32 Q50 44 59 50 V59 H40 Z" fill="url(#ca-omega-rune)" stroke="hsl(56, 100%, 96%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M48 31 A16 15.5 0 0 1 80 31" fill="none" stroke="hsl(56, 100%, 98%)" stroke-width="1.6" opacity="0.88"/>
     <polygon points="64,3 67,10 64,14 61,10" fill="hsl(54, 100%, 96%)"/>
     <polygon points="14,36 21,33 25,36 21,39" fill="hsl(52, 100%, 90%)"/>
     <polygon points="114,36 107,33 103,36 107,39" fill="hsl(52, 100%, 90%)"/>
     <circle cx="24" cy="18" r="2.6" fill="hsl(48, 100%, 86%)"/>
     <circle cx="104" cy="18" r="2.6" fill="hsl(48, 100%, 86%)"/>
     <circle cx="28" cy="58" r="2.2" fill="hsl(328, 98%, 72%)"/>
     <circle cx="100" cy="58" r="2.2" fill="hsl(328, 98%, 72%)"/>`,
    'hsla(46, 100%, 64%, 0.34)',
    `<linearGradient id="ca-omega-rune" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="42%" stop-color="hsl(46, 100%, 70%)"/><stop offset="100%" stop-color="hsl(24, 98%, 54%)"/></linearGradient><radialGradient id="ca-omega-corona" cx="50%" cy="48%" r="54%"><stop offset="0%" stop-color="hsl(54, 100%, 94%)" stop-opacity="0.92"/><stop offset="42%" stop-color="hsl(42, 100%, 60%)" stop-opacity="0.52"/><stop offset="76%" stop-color="hsl(326, 94%, 52%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(288, 70%, 16%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-omega-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="50%" stop-color="hsl(324, 96%, 68%)"/><stop offset="100%" stop-color="hsl(44, 100%, 64%)"/></linearGradient>`
  ),
  mental_fortress: wrapArtSvg(
    'mental_fortress',
    'hsl(248, 54%, 20%)',
    'hsl(214, 56%, 9%)',
    `<path d="M8 58 Q28 48 48 56 Q64 46 80 56 Q100 48 120 58" fill="none" stroke="hsl(202, 84%, 68%)" stroke-width="1.3" opacity="0.45"/>
     <polygon points="64,5 104,22 104,52 64,67 24,52 24,22" fill="url(#ca-mental_fortress-shield)" stroke="hsl(192, 98%, 78%)" stroke-width="1.8"/>
     <polygon points="64,10 98,25 98,49 64,62 30,49 30,25" fill="none" stroke="hsl(288, 88%, 74%)" stroke-width="1" stroke-dasharray="4 3" opacity="0.72"/>
     <path d="M38 50 L64 62 L90 50 L82 47 H46 Z" fill="hsl(256, 48%, 18%)" stroke="hsl(196, 86%, 70%)" stroke-width="1.1"/>
     <rect x="47" y="36" width="34" height="12" fill="url(#ca-mental_fortress-temple)" stroke="hsl(286, 72%, 68%)" stroke-width="1"/>
     <path d="M38 37 Q50 34 64 28 Q78 34 90 37 L84 40 H44 Z" fill="url(#ca-mental_fortress-roof)" stroke="hsl(52, 100%, 92%)" stroke-width="0.9"/>
     <rect x="53" y="24" width="22" height="9" fill="url(#ca-mental_fortress-temple)" stroke="hsl(286, 72%, 68%)" stroke-width="1"/>
     <path d="M45 25 Q54 22 64 14 Q74 22 83 25 L77 27 H51 Z" fill="url(#ca-mental_fortress-roof)" stroke="hsl(52, 100%, 92%)" stroke-width="0.9"/>
     <path d="M64 10 V15" stroke="hsl(50, 100%, 90%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M60 48 V41 A4 4 0 0 1 68 41 V48 Z" fill="hsl(48, 100%, 84%)"/>
     <path d="M24 22 L38 30 M104 22 L90 30 M24 52 L40 48 M104 52 L88 48" stroke="hsl(192, 98%, 80%)" stroke-width="1" opacity="0.58"/>
     <circle cx="24" cy="22" r="2.4" fill="hsl(192, 100%, 88%)"/>
     <circle cx="104" cy="22" r="2.4" fill="hsl(192, 100%, 88%)"/>
     <circle cx="64" cy="5" r="2.6" fill="hsl(50, 100%, 90%)"/>
     <circle cx="64" cy="67" r="2.4" fill="hsl(192, 100%, 88%)"/>`,
    'hsla(194, 92%, 62%, 0.28)',
    `<radialGradient id="ca-mental_fortress-shield" cx="50%" cy="46%" r="52%"><stop offset="0%" stop-color="hsl(194, 100%, 88%)" stop-opacity="0.28"/><stop offset="72%" stop-color="hsl(206, 92%, 62%)" stop-opacity="0.18"/><stop offset="100%" stop-color="hsl(278, 86%, 62%)" stop-opacity="0.34"/></radialGradient><linearGradient id="ca-mental_fortress-temple" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(282, 62%, 58%)"/><stop offset="100%" stop-color="hsl(258, 56%, 22%)"/></linearGradient><linearGradient id="ca-mental_fortress-roof" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 84%)"/><stop offset="100%" stop-color="hsl(34, 84%, 44%)"/></linearGradient>`
  ),
  miracle: wrapArtSvg(
    'miracle',
    'hsl(274, 48%, 22%)',
    'hsl(38, 62%, 11%)',
    `<path d="M44 0 L84 0 L106 72 L22 72 Z" fill="url(#ca-miracle-halo)" opacity="0.6"/>
     <path d="M0 24 Q18 16 32 24 Q42 18 48 26 L0 32 Z M128 24 Q110 16 96 24 Q86 18 80 26 L128 32 Z" fill="hsl(276, 48%, 28%)" opacity="0.58"/>
     <circle cx="64" cy="36" r="28" fill="url(#ca-miracle-halo)"/>
     <circle cx="64" cy="36" r="24" fill="none" stroke="hsl(50, 100%, 84%)" stroke-width="1.2" opacity="0.72"/>
     <circle cx="64" cy="36" r="17" fill="none" stroke="hsl(52, 100%, 90%)" stroke-width="1.1" stroke-dasharray="3 2.5"/>
     <path d="M42 52 Q52 44 64 56 Q76 44 86 52 Q74 62 64 62 Q54 62 42 52 Z" fill="url(#ca-miracle-petal)" stroke="hsl(52, 100%, 92%)" stroke-width="1.1"/>
     <path d="M64 11 L71 29 L89 36 L71 43 L64 61 L57 43 L39 36 L57 29 Z" fill="hsl(34, 80%, 24%)" opacity="0.55" transform="translate(1.5,2)"/>
     <path d="M64 11 L71 29 L89 36 L71 43 L64 61 L57 43 L39 36 L57 29 Z" fill="url(#ca-miracle-star)" stroke="hsl(56, 100%, 98%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M64 20 L68 32 L80 36 L68 40 L64 52 L60 40 L48 36 L60 32 Z" fill="hsl(56, 100%, 98%)" opacity="0.88"/>
     <path d="M22 46 Q34 40 42 46 M106 46 Q94 40 86 46" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.4" stroke-linecap="round"/>
     <polygon points="30,18 32,23 37,25 32,27 30,32 28,27 23,25 28,23" fill="hsl(52, 100%, 92%)"/>
     <polygon points="98,18 100,23 105,25 100,27 98,32 96,27 91,25 96,23" fill="hsl(52, 100%, 92%)"/>
     <circle cx="38" cy="56" r="1.9" fill="hsl(48, 100%, 86%)"/>
     <circle cx="90" cy="56" r="1.9" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(48, 100%, 66%, 0.34)',
    `<radialGradient id="ca-miracle-star" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="46%" stop-color="hsl(48, 100%, 74%)"/><stop offset="100%" stop-color="hsl(36, 94%, 48%)"/></radialGradient><radialGradient id="ca-miracle-halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)" stop-opacity="0.88"/><stop offset="55%" stop-color="hsl(44, 100%, 62%)" stop-opacity="0.36"/><stop offset="100%" stop-color="hsl(282, 70%, 30%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-miracle-petal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 94%)"/><stop offset="100%" stop-color="hsl(288, 68%, 62%)"/></linearGradient>`
  ),
  apotheosis: wrapArtSvg(
    'apotheosis',
    'hsl(224, 48%, 18%)',
    'hsl(38, 44%, 10%)',
    `<ellipse cx="64" cy="34" rx="48" ry="28" fill="hsla(44, 100%, 66%, 0.18)"/>
     <polygon points="48,0 80,0 98,72 30,72" fill="url(#ca-apotheosis-beam)"/>
     <polygon points="58,0 70,0 76,72 52,72" fill="hsla(52, 100%, 96%, 0.42)"/>
     <path d="M0 16 Q16 12 28 20 Q38 15 46 24 Q34 32 18 30 Q8 34 0 30 Z" fill="url(#ca-apotheosis-cloud)" opacity="0.88"/>
     <path d="M128 16 Q112 12 100 20 Q90 15 82 24 Q94 32 110 30 Q120 34 128 30 Z" fill="url(#ca-apotheosis-cloud)" opacity="0.88"/>
     <path d="M10 28 Q28 24 44 23 M118 28 Q100 24 84 23" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.2" opacity="0.72"/>
     <ellipse cx="64" cy="37" rx="22" ry="22" fill="none" stroke="hsla(48, 100%, 82%, 0.55)" stroke-width="1.3" stroke-dasharray="4 3"/>
     <polygon points="24,34 38,30 43,51 29,55" fill="url(#ca-apotheosis-card)" stroke="hsl(52, 100%, 90%)" stroke-width="1.1" opacity="0.86"/>
     <polygon points="90,30 104,34 99,55 85,51" fill="url(#ca-apotheosis-card)" stroke="hsl(52, 100%, 90%)" stroke-width="1.1" opacity="0.86"/>
     <rect x="53" y="21" width="22" height="32" rx="2.5" fill="url(#ca-apotheosis-card)" stroke="hsl(54, 100%, 96%)" stroke-width="1.6"/>
     <rect x="56" y="24" width="16" height="26" rx="1.4" fill="hsla(224, 48%, 16%, 0.42)" stroke="hsl(48, 100%, 80%)" stroke-width="0.9"/>
     <path d="M64 31 V43 M58 37 H70" stroke="hsl(142, 100%, 76%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M64 7 L66 13 L72 15 L66 17 L64 23 L62 17 L56 15 L62 13 Z" fill="hsl(54, 100%, 94%)"/>
     <path d="M35 20 L36.4 23.6 L40 25 L36.4 26.4 L35 30 L33.6 26.4 L30 25 L33.6 23.6 Z" fill="hsl(48, 100%, 86%)"/>
     <path d="M93 20 L94.4 23.6 L98 25 L94.4 26.4 L93 30 L91.6 26.4 L88 25 L91.6 23.6 Z" fill="hsl(48, 100%, 86%)"/>
     <path d="M46 61 V54 M64 65 V58 M82 61 V54" stroke="hsl(50, 100%, 86%)" stroke-width="1.4" stroke-linecap="round" opacity="0.78"/>`,
    'hsla(46, 100%, 68%, 0.34)',
    `<linearGradient id="ca-apotheosis-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsla(52, 100%, 96%, 0.94)"/><stop offset="52%" stop-color="hsla(44, 100%, 66%, 0.56)"/><stop offset="100%" stop-color="hsla(36, 94%, 48%, 0.08)"/></linearGradient><linearGradient id="ca-apotheosis-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(42, 62%, 52%)"/><stop offset="100%" stop-color="hsl(228, 44%, 16%)"/></linearGradient><linearGradient id="ca-apotheosis-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="50%" stop-color="hsl(42, 96%, 62%)"/><stop offset="100%" stop-color="hsl(32, 86%, 38%)"/></linearGradient>`
  ),
  hand_of_greed: wrapArtSvg(
    'hand_of_greed',
    'hsl(36, 48%, 16%)',
    'hsl(240, 32%, 8%)',
    `<ellipse cx="66" cy="36" rx="44" ry="26" fill="hsla(44, 100%, 56%, 0.16)"/>
     <path d="M8 72 Q26 56 50 61 Q74 52 100 60 Q114 57 126 72 Z" fill="hsl(32, 72%, 22%)" opacity="0.88"/>
     <ellipse cx="64" cy="64" rx="34" ry="6" fill="rgba(0,0,0,0.45)"/>
     <path d="M22 65 L34 45 L50 51 L41 69 Z" fill="url(#ca-hand_of_greed-gold)" stroke="hsl(28, 76%, 22%)" stroke-width="1.3"/>
     <path d="M35 45 L46 28 L66 26 L75 38 L62 52 L48 51 Z" fill="url(#ca-hand_of_greed-gold)" stroke="hsl(28, 76%, 20%)" stroke-width="1.3"/>
     <path d="M47 28 Q50 14 59 16 L61 28 M58 26 Q64 11 73 16 L71 30 M68 28 Q78 16 84 24 L76 37 M74 36 Q86 29 88 38 L74 46 M46 42 Q38 33 45 27" fill="url(#ca-hand_of_greed-gold)" stroke="hsl(26, 78%, 18%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M49 32 L63 30 M52 21 L57 20 M64 18 L70 19 M75 23 L80 25" stroke="hsl(54, 100%, 92%)" stroke-width="1.4" stroke-linecap="round" opacity="0.85"/>
     <polygon points="55,35 61,39 56,45 50,41" fill="url(#ca-hand_of_greed-gem)" stroke="hsl(52, 100%, 84%)" stroke-width="0.9"/>
     <ellipse cx="89" cy="46" rx="6.5" ry="4.5" transform="rotate(-18 89 46)" fill="url(#ca-hand_of_greed-coin)" stroke="hsl(30, 78%, 26%)" stroke-width="1"/>
     <ellipse cx="99" cy="54" rx="7" ry="4.6" transform="rotate(14 99 54)" fill="url(#ca-hand_of_greed-coin)" stroke="hsl(30, 78%, 26%)" stroke-width="1"/>
     <ellipse cx="80" cy="57" rx="6.5" ry="4.2" transform="rotate(-8 80 57)" fill="url(#ca-hand_of_greed-coin)" stroke="hsl(30, 78%, 26%)" stroke-width="1"/>
     <ellipse cx="95" cy="34" rx="5.5" ry="3.8" transform="rotate(24 95 34)" fill="url(#ca-hand_of_greed-coin)" stroke="hsl(30, 78%, 26%)" stroke-width="0.9"/>
     <polygon points="106,38 112,43 107,50 101,45" fill="url(#ca-hand_of_greed-gem)" stroke="hsl(50, 100%, 86%)" stroke-width="0.9"/>
     <polygon points="73,10 78,14 74,19 69,15" fill="hsl(154, 88%, 54%)" stroke="hsl(148, 100%, 84%)" stroke-width="0.8"/>
     <path d="M104 20 L105.6 24.4 L110 26 L105.6 27.6 L104 32 L102.4 27.6 L98 26 L102.4 24.4 Z" fill="hsl(54, 100%, 92%)"/>
     <path d="M31 20 L32.2 23.2 L35.5 24.5 L32.2 25.8 L31 29 L29.8 25.8 L26.5 24.5 L29.8 23.2 Z" fill="hsl(50, 100%, 88%)"/>`,
    'hsla(44, 100%, 58%, 0.30)',
    `<linearGradient id="ca-hand_of_greed-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 86%)"/><stop offset="48%" stop-color="hsl(42, 94%, 52%)"/><stop offset="100%" stop-color="hsl(28, 80%, 24%)"/></linearGradient><radialGradient id="ca-hand_of_greed-coin" cx="35%" cy="35%" r="65%"><stop offset="0%" stop-color="hsl(54, 100%, 88%)"/><stop offset="65%" stop-color="hsl(42, 96%, 52%)"/><stop offset="100%" stop-color="hsl(30, 82%, 30%)"/></radialGradient><linearGradient id="ca-hand_of_greed-gem" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(348, 100%, 74%)"/><stop offset="55%" stop-color="hsl(352, 88%, 46%)"/><stop offset="100%" stop-color="hsl(342, 80%, 22%)"/></linearGradient>`
  ),
  apparition: wrapArtSvg(
    'apparition',
    'hsl(216, 44%, 17%)',
    'hsl(232, 48%, 7%)',
    `<circle cx="92" cy="19" r="24" fill="url(#ca-apparition-moon)"/>
     <circle cx="92" cy="19" r="10.5" fill="hsl(202, 78%, 92%)" opacity="0.88"/>
     <path d="M0 58 Q30 50 64 56 Q96 62 128 52 L128 72 L0 72 Z" fill="hsla(210, 64%, 72%, 0.14)"/>
     <path d="M52 65 Q54 34 66 15 Q78 14 82 32 Q87 49 91 64 Q81 55 74 63 Q66 54 52 65 Z" fill="none" stroke="hsla(192, 94%, 82%, 0.32)" stroke-width="1.4"/>
     <path d="M36 67 Q40 36 48 18 Q58 7 68 18 Q77 36 80 65 Q70 55 62 65 Q53 55 46 66 Q41 61 36 67 Z" fill="url(#ca-apparition-cloak)" stroke="hsla(192, 100%, 88%, 0.72)" stroke-width="1.3"/>
     <path d="M51 24 Q58 13 65 24 Q62 32 58 33 Q54 32 51 24 Z" fill="hsla(228, 56%, 12%, 0.82)"/>
     <path d="M47 56 Q52 38 58 35 Q64 39 69 57" fill="none" stroke="hsla(192, 100%, 92%, 0.48)" stroke-width="1.5"/>
     <ellipse cx="55.2" cy="24.5" rx="2.1" ry="1.3" fill="hsl(186, 100%, 90%)"/>
     <ellipse cx="61.2" cy="24.5" rx="2.1" ry="1.3" fill="hsl(186, 100%, 90%)"/>
     <path d="M46 39 Q34 38 27 45 M70 39 Q82 36 89 42" fill="none" stroke="hsla(192, 96%, 86%, 0.62)" stroke-width="2" stroke-linecap="round"/>
     <path d="M8 46 Q40 34 68 43 Q96 52 122 36" fill="none" stroke="url(#ca-apparition-veil)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M16 56 Q48 48 76 54 Q102 60 120 48" fill="none" stroke="url(#ca-apparition-veil)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="30" cy="24" r="1.8" fill="hsl(190, 100%, 88%)" opacity="0.8"/>
     <circle cx="80" cy="48" r="1.5" fill="hsl(190, 100%, 88%)" opacity="0.72"/>
     <circle cx="40" cy="14" r="1.3" fill="hsl(200, 100%, 92%)" opacity="0.75"/>`,
    'hsla(194, 88%, 76%, 0.26)',
    `<radialGradient id="ca-apparition-moon" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(198, 96%, 94%, 0.92)"/><stop offset="46%" stop-color="hsla(204, 84%, 76%, 0.34)"/><stop offset="100%" stop-color="hsla(220, 64%, 40%, 0)"/></radialGradient><linearGradient id="ca-apparition-cloak" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsla(192, 92%, 90%, 0.84)"/><stop offset="54%" stop-color="hsla(208, 72%, 64%, 0.44)"/><stop offset="100%" stop-color="hsla(224, 54%, 34%, 0.04)"/></linearGradient><linearGradient id="ca-apparition-veil" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(194, 92%, 82%, 0)"/><stop offset="50%" stop-color="hsla(192, 96%, 86%, 0.58)"/><stop offset="100%" stop-color="hsla(210, 80%, 72%, 0)"/></linearGradient>`
  ),
  limit_break: wrapArtSvg(
    'limit_break',
    'hsl(16, 74%, 21%)',
    'hsl(350, 62%, 8%)',
    `<circle cx="64" cy="36" r="36" fill="url(#ca-limit_break-burst)"/>
     <path d="M50 66 L56 6 L72 6 L78 66 Z" fill="url(#ca-limit_break-beam)" opacity="0.72"/>
     <circle cx="64" cy="36" r="24" fill="none" stroke="hsl(46, 100%, 78%)" stroke-width="1.6" opacity="0.75"/>
     <path d="M64 6 L68 24 L86 14 L74 32 L96 36 L74 40 L86 58 L68 48 L64 66 L60 48 L42 58 L54 40 L32 36 L54 32 L42 14 L60 24 Z" fill="hsl(50, 100%, 88%)" opacity="0.88"/>
     <ellipse cx="20" cy="40" rx="9" ry="5" transform="rotate(-14 20 40)" fill="none" stroke="url(#ca-limit_break-chain)" stroke-width="3.2"/>
     <ellipse cx="34" cy="36" rx="9" ry="5" transform="rotate(16 34 36)" fill="none" stroke="url(#ca-limit_break-chain)" stroke-width="3.2"/>
     <path d="M42 32 L49 26 M43 40 L50 45" stroke="hsl(214, 28%, 82%)" stroke-width="2.4" stroke-linecap="round"/>
     <ellipse cx="108" cy="40" rx="9" ry="5" transform="rotate(14 108 40)" fill="none" stroke="url(#ca-limit_break-chain)" stroke-width="3.2"/>
     <ellipse cx="94" cy="36" rx="9" ry="5" transform="rotate(-16 94 36)" fill="none" stroke="url(#ca-limit_break-chain)" stroke-width="3.2"/>
     <path d="M86 32 L79 26 M85 40 L78 45" stroke="hsl(214, 28%, 82%)" stroke-width="2.4" stroke-linecap="round"/>
     <polygon points="48,14 54,18 47,21" fill="hsl(212, 24%, 76%)"/>
     <polygon points="80,52 86,56 79,59" fill="hsl(212, 24%, 76%)"/>
     <circle cx="64" cy="36" r="7" fill="hsl(56, 100%, 98%)"/>
     <circle cx="24" cy="18" r="2" fill="hsl(48, 100%, 84%)"/>
     <circle cx="104" cy="18" r="2" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(38, 100%, 60%, 0.34)',
    `<radialGradient id="ca-limit_break-burst" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 94%)" stop-opacity="0.92"/><stop offset="42%" stop-color="hsl(32, 100%, 60%)" stop-opacity="0.54"/><stop offset="100%" stop-color="hsl(352, 74%, 14%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-limit_break-beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(14, 96%, 50%)"/><stop offset="50%" stop-color="hsl(42, 100%, 72%)"/><stop offset="100%" stop-color="hsl(56, 100%, 94%)"/></linearGradient><linearGradient id="ca-limit_break-chain" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 20%, 74%)"/><stop offset="100%" stop-color="hsl(220, 22%, 24%)"/></linearGradient>`
  ),
  juggernaut: wrapArtSvg(
    'juggernaut',
    'hsl(18, 46%, 20%)',
    'hsl(220, 34%, 9%)',
    `<path d="M4 18 H68 M2 36 H58 M6 54 H70" stroke="url(#ca-juggernaut-trail)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M90 12 L106 8 L112 24 L98 28 Z M96 44 L114 42 L118 62 L100 64 Z" fill="hsl(216, 18%, 28%)" stroke="hsl(28, 72%, 52%)" stroke-width="1.2"/>
     <path d="M22 64 L32 22 L66 12 L94 34 L84 62 Z" fill="rgba(0,0,0,0.48)" transform="translate(2,3)"/>
     <path d="M22 64 L32 22 L66 12 L94 34 L84 62 Z" fill="url(#ca-juggernaut-armor)" stroke="url(#ca-juggernaut-trim)" stroke-width="1.8"/>
     <path d="M36 24 L65 15 L89 35" stroke="hsl(48, 100%, 88%)" stroke-width="1.6" fill="none" opacity="0.78"/>
     <polygon points="88,28 106,34 89,41" fill="hsl(44, 94%, 70%)" stroke="hsl(18, 62%, 28%)" stroke-width="1.1"/>
     <polygon points="62,13 76,6 75,18" fill="hsl(44, 92%, 68%)" stroke="hsl(18, 62%, 28%)" stroke-width="1"/>
     <path d="M42 36 L76 34 L72 44 L40 44 Z" fill="hsl(354, 72%, 14%)" stroke="hsl(38, 92%, 62%)" stroke-width="1.2"/>
     <path d="M56 38 L72 37 L68 42 L55 41 Z" fill="hsl(42, 100%, 72%)"/>
     <path d="M34 52 L78 52" stroke="url(#ca-juggernaut-trim)" stroke-width="2.6" stroke-linecap="round"/>
     <circle cx="44" cy="26" r="2" fill="hsl(46, 94%, 76%)"/>
     <circle cx="56" cy="23" r="2" fill="hsl(46, 94%, 76%)"/>
     <path d="M98 34 L118 28 M100 38 L120 44" stroke="hsl(46, 100%, 78%)" stroke-width="2" stroke-linecap="round"/>
     <polygon points="104,18 112,14 110,23" fill="hsl(36, 96%, 66%)"/>
     <circle cx="114" cy="36" r="2.2" fill="hsl(50, 100%, 88%)"/>`,
    'hsla(26, 94%, 54%, 0.28)',
    `<linearGradient id="ca-juggernaut-armor" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 22%, 72%)"/><stop offset="50%" stop-color="hsl(218, 22%, 36%)"/><stop offset="100%" stop-color="hsl(222, 28%, 16%)"/></linearGradient><linearGradient id="ca-juggernaut-trim" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(36, 78%, 48%)"/><stop offset="100%" stop-color="hsl(48, 100%, 80%)"/></linearGradient><linearGradient id="ca-juggernaut-trail" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(14, 92%, 48%)" stop-opacity="0"/><stop offset="100%" stop-color="hsl(34, 100%, 64%)" stop-opacity="0.72"/></linearGradient>`
  ),
  pommel_strike: wrapArtSvg(
    'pommel_strike',
    'hsl(24, 52%, 20%)',
    'hsl(14, 44%, 9%)',
    `<circle cx="88" cy="46" r="32" fill="url(#ca-pommel_strike-flash)"/>
     <circle cx="88" cy="46" r="22" fill="none" stroke="hsl(46, 100%, 76%)" stroke-width="1.6" stroke-dasharray="6 4" opacity="0.72"/>
     <path d="M12 14 L50 32 L44 40 L10 24 Z" fill="url(#ca-pommel_strike-steel)" stroke="hsl(216, 26%, 22%)" stroke-width="1.1"/>
     <path d="M14 19 L46 35" stroke="hsl(214, 34%, 90%)" stroke-width="1.2" opacity="0.8"/>
     <path d="M58 18 L34 52" stroke="rgba(0,0,0,0.45)" stroke-width="7.5" stroke-linecap="round" transform="translate(2,2)"/>
     <path d="M58 18 L34 52" stroke="url(#ca-pommel_strike-gold)" stroke-width="6.5" stroke-linecap="round"/>
     <path d="M49 34 L76 44" stroke="hsl(12, 48%, 22%)" stroke-width="9" stroke-linecap="round"/>
     <path d="M55 32 L52 41 M63 35 L60 44 M70 38 L67 47" stroke="hsl(34, 78%, 54%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="88,28 104,46 88,64 72,46" fill="rgba(0,0,0,0.45)" transform="translate(2,3)"/>
     <polygon points="88,28 104,46 88,64 72,46" fill="url(#ca-pommel_strike-gold)" stroke="hsl(20, 72%, 28%)" stroke-width="1.5"/>
     <polygon points="88,35 96,46 88,57 80,46" fill="hsl(354, 92%, 52%)" stroke="hsl(48, 100%, 84%)" stroke-width="1.1"/>
     <path d="M84 34 L94 42" stroke="hsl(52, 100%, 96%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M104 34 L118 26 M108 48 L120 50 M98 62 L108 68 M78 22 L84 12" stroke="hsl(48, 100%, 82%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="110" cy="38" r="2.2" fill="hsl(50, 100%, 90%)"/>
     <circle cx="72" cy="18" r="1.8" fill="hsl(42, 100%, 74%)"/>`,
    'hsla(36, 96%, 56%, 0.28)',
    `<radialGradient id="ca-pommel_strike-flash" cx="68%" cy="62%" r="42%"><stop offset="0%" stop-color="hsl(50, 100%, 88%)" stop-opacity="0.88"/><stop offset="50%" stop-color="hsl(32, 98%, 56%)" stop-opacity="0.38"/><stop offset="100%" stop-color="hsl(14, 68%, 14%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-pommel_strike-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 24%, 76%)"/><stop offset="100%" stop-color="hsl(218, 20%, 34%)"/></linearGradient><linearGradient id="ca-pommel_strike-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 84%)"/><stop offset="55%" stop-color="hsl(36, 86%, 54%)"/><stop offset="100%" stop-color="hsl(20, 68%, 26%)"/></linearGradient>`
  ),
  shrug_it_off: wrapArtSvg(
    'shrug_it_off',
    'hsl(216, 36%, 21%)',
    'hsl(224, 42%, 10%)',
    `<circle cx="74" cy="24" r="20" fill="url(#ca-shrug_it_off-spark)" opacity="0.62"/>
     <path d="M16 14 L56 26 M108 10 L76 24" stroke="hsl(354, 88%, 62%)" stroke-width="1.8" stroke-dasharray="4 3" opacity="0.65"/>
     <path d="M22 66 Q22 30 56 22 Q86 18 100 44 L92 66 Z" fill="rgba(0,0,0,0.45)" transform="translate(2,3)"/>
     <path d="M22 66 Q22 30 56 22 Q86 18 100 44 L92 66 Z" fill="url(#ca-shrug_it_off-plate)" stroke="url(#ca-shrug_it_off-trim)" stroke-width="2"/>
     <path d="M28 50 Q56 36 94 46" fill="none" stroke="url(#ca-shrug_it_off-trim)" stroke-width="2.2"/>
     <path d="M26 62 Q58 50 92 58" fill="none" stroke="url(#ca-shrug_it_off-trim)" stroke-width="2"/>
     <path d="M36 32 Q58 22 82 28" stroke="hsl(210, 48%, 94%)" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.82"/>
     <circle cx="42" cy="38" r="1.8" fill="hsl(46, 96%, 76%)"/>
     <circle cx="62" cy="34" r="1.8" fill="hsl(46, 96%, 76%)"/>
     <circle cx="80" cy="38" r="1.8" fill="hsl(46, 96%, 76%)"/>
     <path d="M74 22 L106 10 M74 22 L92 6" stroke="hsl(212, 34%, 86%)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="109,8 100,9 104,15" fill="hsl(44, 100%, 76%)"/>
     <path d="M56 24 L36 10" stroke="hsl(212, 34%, 84%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="74" cy="23" r="3.5" fill="hsl(52, 100%, 94%)"/>
     <path d="M68 15 L72 20 M82 20 L88 18 M75 29 L78 33" stroke="hsl(48, 100%, 84%)" stroke-width="1.6" stroke-linecap="round"/>`,
    'hsla(206, 84%, 58%, 0.24)',
    `<linearGradient id="ca-shrug_it_off-plate" x1="0" y1="0" x2="0.8" y2="1"><stop offset="0%" stop-color="hsl(212, 28%, 78%)"/><stop offset="50%" stop-color="hsl(218, 24%, 42%)"/><stop offset="100%" stop-color="hsl(222, 28%, 18%)"/></linearGradient><linearGradient id="ca-shrug_it_off-trim" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(44, 92%, 72%)"/><stop offset="100%" stop-color="hsl(26, 68%, 36%)"/></linearGradient><radialGradient id="ca-shrug_it_off-spark" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(50, 100%, 92%)"/><stop offset="100%" stop-color="hsl(36, 100%, 60%)" stop-opacity="0"/></radialGradient>`
  ),
  twin_strike: wrapArtSvg(
    'twin_strike',
    'hsl(6, 58%, 20%)',
    'hsl(350, 48%, 9%)',
    `<path d="M12 60 Q48 28 114 10 Q74 36 22 64 Z" fill="url(#ca-twin_strike-arc1)"/>
     <path d="M14 12 Q64 28 116 60 Q72 42 12 22 Z" fill="url(#ca-twin_strike-arc2)"/>
     <path d="M22 56 L86 14 L96 12 L90 22 L30 62 Z" fill="rgba(0,0,0,0.4)" transform="translate(2,2)"/>
     <path d="M22 56 L86 14 L96 12 L90 22 L30 62 Z" fill="url(#ca-twin_strike-steel)" stroke="hsl(36, 94%, 68%)" stroke-width="1.2"/>
     <path d="M28 57 L91 15" stroke="hsl(0, 0%, 100%)" stroke-width="1.3" stroke-linecap="round"/>
     <path d="M32 14 L96 52 L106 58 L94 60 L24 22 Z" fill="rgba(0,0,0,0.4)" transform="translate(2,2)"/>
     <path d="M32 14 L96 52 L106 58 L94 60 L24 22 Z" fill="url(#ca-twin_strike-steel)" stroke="hsl(16, 92%, 58%)" stroke-width="1.2"/>
     <path d="M30 18 L99 56" stroke="hsl(0, 0%, 100%)" stroke-width="1.3" stroke-linecap="round"/>
     <polygon points="64,22 68,33 78,36 68,39 64,50 60,39 50,36 60,33" fill="hsl(52, 100%, 92%)"/>
     <circle cx="64" cy="36" r="10" fill="none" stroke="hsl(42, 100%, 74%)" stroke-width="1.5" opacity="0.72"/>
     <circle cx="102" cy="18" r="2.4" fill="hsl(48, 100%, 84%)"/>
     <circle cx="106" cy="48" r="2.2" fill="hsl(32, 100%, 68%)"/>
     <circle cx="24" cy="38" r="2" fill="hsl(354, 96%, 64%)"/>
     <circle cx="52" cy="56" r="1.8" fill="hsl(46, 100%, 80%)"/>`,
    'hsla(16, 94%, 54%, 0.28)',
    `<linearGradient id="ca-twin_strike-arc1" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(354, 92%, 48%)" stop-opacity="0.18"/><stop offset="65%" stop-color="hsl(36, 100%, 66%)" stop-opacity="0.88"/><stop offset="100%" stop-color="hsl(54, 100%, 94%)"/></linearGradient><linearGradient id="ca-twin_strike-arc2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(212, 34%, 84%)" stop-opacity="0.22"/><stop offset="65%" stop-color="hsl(14, 96%, 58%)" stop-opacity="0.88"/><stop offset="100%" stop-color="hsl(50, 100%, 90%)"/></linearGradient><linearGradient id="ca-twin_strike-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 28%, 88%)"/><stop offset="100%" stop-color="hsl(218, 24%, 38%)"/></linearGradient>`
  ),
  cleave: wrapArtSvg(
    'cleave',
    'hsl(8, 62%, 21%)',
    'hsl(352, 50%, 9%)',
    `<polygon points="22,12 36,12 38,34 20,34" fill="hsl(350, 34%, 14%)" stroke="hsl(14, 52%, 34%)" stroke-width="1"/>
     <polygon points="18,42 36,42 34,64 16,64" fill="hsl(350, 34%, 14%)" stroke="hsl(14, 52%, 34%)" stroke-width="1"/>
     <polygon points="56,10 72,10 74,31 54,31" fill="hsl(350, 34%, 14%)" stroke="hsl(14, 52%, 34%)" stroke-width="1"/>
     <polygon points="58,41 76,41 74,64 56,64" fill="hsl(350, 34%, 14%)" stroke="hsl(14, 52%, 34%)" stroke-width="1"/>
     <polygon points="90,14 104,14 106,33 88,33" fill="hsl(350, 34%, 14%)" stroke="hsl(14, 52%, 34%)" stroke-width="1"/>
     <polygon points="92,43 108,43 106,62 90,62" fill="hsl(350, 34%, 14%)" stroke="hsl(14, 52%, 34%)" stroke-width="1"/>
     <path d="M6 48 Q56 16 122 30 Q68 38 10 56 Z" fill="url(#ca-cleave-wave)"/>
     <path d="M8 44 Q58 22 118 28" stroke="hsl(52, 100%, 94%)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
     <path d="M66 26 L112 22 L120 30 L106 38 L62 38 Z" fill="url(#ca-cleave-blade)" stroke="hsl(40, 96%, 72%)" stroke-width="1.3"/>
     <path d="M72 30 L114 28" stroke="hsl(0, 0%, 100%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M26 37 L44 37 M62 35 L80 35 M96 36 L112 36" stroke="hsl(48, 100%, 84%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="38" cy="36" r="2.2" fill="hsl(50, 100%, 88%)"/>
     <circle cx="74" cy="34" r="2.5" fill="hsl(50, 100%, 90%)"/>
     <circle cx="106" cy="36" r="2.2" fill="hsl(44, 100%, 78%)"/>`,
    'hsla(18, 96%, 54%, 0.3)',
    `<linearGradient id="ca-cleave-wave" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(354, 92%, 44%)" stop-opacity="0.18"/><stop offset="48%" stop-color="hsl(22, 100%, 58%)" stop-opacity="0.88"/><stop offset="100%" stop-color="hsl(52, 100%, 94%)"/></linearGradient><linearGradient id="ca-cleave-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 24%, 84%)"/><stop offset="100%" stop-color="hsl(220, 24%, 34%)"/></linearGradient>`
  ),
  clothesline: wrapArtSvg(
    'clothesline',
    'hsl(16, 52%, 21%)',
    'hsl(10, 46%, 9%)',
    `<circle cx="96" cy="36" r="30" fill="url(#ca-clothesline-wave)"/>
     <path d="M6 18 H82 M4 56 H86 M12 10 H58" stroke="hsl(36, 98%, 64%)" stroke-width="2" stroke-linecap="round" opacity="0.54"/>
     <path d="M98 14 Q118 36 98 58 M108 18 Q122 36 108 54" fill="none" stroke="hsl(44, 100%, 74%)" stroke-width="2.2" stroke-linecap="round" opacity="0.78"/>
     <path d="M8 26 L32 22 L42 28 L82 26 L94 22 L104 30 L102 46 L86 50 L42 46 L26 52 L8 48 Z" fill="rgba(0,0,0,0.45)" transform="translate(2,3)"/>
     <path d="M8 26 L32 22 L42 28 L82 26 L80 48 L42 46 L26 52 L8 48 Z" fill="url(#ca-clothesline-arm)" stroke="hsl(36, 82%, 60%)" stroke-width="1.5"/>
     <path d="M22 22 L38 14 L42 28 L30 34 Z" fill="url(#ca-clothesline-gold)" stroke="hsl(18, 62%, 24%)" stroke-width="1.2"/>
     <path d="M48 28 V46 M62 28 V46" stroke="url(#ca-clothesline-gold)" stroke-width="2.4"/>
     <path d="M80 24 L98 22 L106 31 L104 45 L88 50 L78 46 Z" fill="url(#ca-clothesline-arm)" stroke="hsl(44, 96%, 72%)" stroke-width="1.5"/>
     <path d="M16 30 L74 30" stroke="hsl(214, 42%, 92%)" stroke-width="1.6" stroke-linecap="round" opacity="0.78"/>
     <circle cx="96" cy="28" r="2.2" fill="hsl(48, 100%, 84%)"/>
     <circle cx="98" cy="36" r="2.2" fill="hsl(48, 100%, 84%)"/>
     <circle cx="96" cy="44" r="2.2" fill="hsl(48, 100%, 84%)"/>
     <path d="M108 26 L120 20 M110 38 L122 38 M108 48 L118 54" stroke="hsl(50, 100%, 88%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="72" cy="14" r="2" fill="hsl(46, 100%, 80%)"/>
     <circle cx="76" cy="60" r="1.8" fill="hsl(32, 100%, 66%)"/>`,
    'hsla(26, 94%, 54%, 0.28)',
    `<linearGradient id="ca-clothesline-arm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(214, 24%, 74%)"/><stop offset="55%" stop-color="hsl(218, 22%, 40%)"/><stop offset="100%" stop-color="hsl(222, 24%, 18%)"/></linearGradient><linearGradient id="ca-clothesline-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 96%, 78%)"/><stop offset="100%" stop-color="hsl(24, 70%, 30%)"/></linearGradient><radialGradient id="ca-clothesline-wave" cx="82%" cy="50%" r="36%"><stop offset="0%" stop-color="hsl(44, 100%, 80%)" stop-opacity="0.72"/><stop offset="60%" stop-color="hsl(18, 96%, 50%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(10, 60%, 14%)" stop-opacity="0"/></radialGradient>`
  ),
  iron_wave: wrapArtSvg(
    'iron_wave',
    'hsl(214, 42%, 20%)',
    'hsl(6, 52%, 10%)',
    `<circle cx="58" cy="36" r="34" fill="url(#ca-iron_wave-aura)"/>
     <path d="M44 58 Q74 62 114 48 Q88 30 116 14 Q74 10 48 34 Z" fill="url(#ca-iron_wave-blade)" opacity="0.86"/>
     <path d="M52 50 Q84 44 114 20" stroke="hsl(52, 100%, 92%)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
     <path d="M56 32 Q80 20 108 16" stroke="hsl(202, 100%, 84%)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
     <path d="M16 16 L36 11 L54 16 V39 Q54 53 35 62 Q16 53 16 39 Z" fill="rgba(0,0,0,0.48)" transform="translate(2,3)"/>
     <path d="M16 16 L36 11 L54 16 V39 Q54 53 35 62 Q16 53 16 39 Z" fill="url(#ca-iron_wave-shield)" stroke="hsl(44, 92%, 72%)" stroke-width="2"/>
     <path d="M35 15 V58 M20 35 H50" stroke="hsl(42, 86%, 60%)" stroke-width="2.2"/>
     <circle cx="35" cy="35" r="4.5" fill="hsl(48, 100%, 84%)" stroke="hsl(214, 42%, 28%)" stroke-width="1.2"/>
     <path d="M21 21 L34 17 L22 33 Z" fill="hsl(0, 0%, 100%)" opacity="0.24"/>
     <polygon points="94,20 118,16 106,34" fill="hsl(50, 100%, 88%)" opacity="0.88"/>
     <path d="M62 58 Q88 58 112 52" stroke="hsl(18, 98%, 62%)" stroke-width="2" fill="none" stroke-linecap="round"/>
     <circle cx="24" cy="14" r="1.8" fill="hsl(202, 100%, 82%)"/>
     <circle cx="96" cy="46" r="2.2" fill="hsl(46, 100%, 80%)"/>
     <circle cx="114" cy="34" r="2" fill="hsl(28, 100%, 68%)"/>`,
    'hsla(202, 86%, 56%, 0.24)',
    `<linearGradient id="ca-iron_wave-shield" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(208, 42%, 80%)"/><stop offset="55%" stop-color="hsl(214, 34%, 44%)"/><stop offset="100%" stop-color="hsl(222, 36%, 20%)"/></linearGradient><linearGradient id="ca-iron_wave-blade" x1="0" y1="0.8" x2="1" y2="0.2"><stop offset="0%" stop-color="hsl(204, 88%, 62%)"/><stop offset="50%" stop-color="hsl(22, 96%, 56%)"/><stop offset="100%" stop-color="hsl(48, 100%, 86%)"/></linearGradient><radialGradient id="ca-iron_wave-aura" cx="44%" cy="50%" r="46%"><stop offset="0%" stop-color="hsl(202, 92%, 64%)" stop-opacity="0.45"/><stop offset="65%" stop-color="hsl(14, 90%, 50%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(220, 50%, 10%)" stop-opacity="0"/></radialGradient>`
  ),
  body_slam: wrapArtSvg(
    'body_slam',
    'hsl(212, 34%, 20%)',
    'hsl(14, 48%, 9%)',
    `<circle cx="92" cy="36" r="34" fill="url(#ca-body_slam-shock)"/>
     <path d="M6 16 H44 M4 34 H36 M8 54 H46" stroke="hsl(34, 96%, 62%)" stroke-width="2.4" stroke-linecap="round" opacity="0.6"/>
     <ellipse cx="94" cy="36" rx="16" ry="28" fill="none" stroke="hsl(46, 100%, 78%)" stroke-width="2" opacity="0.78"/>
     <ellipse cx="102" cy="36" rx="12" ry="20" fill="none" stroke="hsl(22, 100%, 60%)" stroke-width="1.6" opacity="0.65"/>
     <path d="M24 62 L32 22 L66 12 L90 28 L80 62 Z" fill="rgba(0,0,0,0.48)" transform="translate(2,3)"/>
     <path d="M24 62 L32 22 L66 12 L90 28 L80 62 Z" fill="url(#ca-body_slam-plate)" stroke="url(#ca-body_slam-trim)" stroke-width="1.8"/>
     <path d="M54 14 L88 26 L78 44 L48 36 Z" fill="url(#ca-body_slam-plate)" stroke="hsl(46, 96%, 74%)" stroke-width="1.6"/>
     <path d="M58 17 L84 26" stroke="hsl(210, 48%, 94%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M54 38 L52 60 M34 46 L78 52" stroke="url(#ca-body_slam-trim)" stroke-width="2.2"/>
     <polygon points="86,24 98,22 90,34" fill="hsl(44, 96%, 74%)"/>
     <polygon points="104,14 114,18 108,26" fill="hsl(24, 30%, 42%)" stroke="hsl(42, 92%, 68%)" stroke-width="0.9"/>
     <polygon points="106,50 116,48 112,58" fill="hsl(24, 30%, 42%)" stroke="hsl(42, 92%, 68%)" stroke-width="0.9"/>
     <path d="M92 22 L116 10 M94 36 L120 36 M92 50 L116 62" stroke="hsl(50, 100%, 88%)" stroke-width="1.9" stroke-linecap="round"/>
     <circle cx="90" cy="36" r="4" fill="hsl(54, 100%, 96%)"/>`,
    'hsla(26, 94%, 56%, 0.28)',
    `<radialGradient id="ca-body_slam-shock" cx="76%" cy="50%" r="44%"><stop offset="0%" stop-color="hsl(50, 100%, 88%)" stop-opacity="0.82"/><stop offset="48%" stop-color="hsl(22, 98%, 54%)" stop-opacity="0.38"/><stop offset="100%" stop-color="hsl(14, 60%, 12%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-body_slam-plate" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(212, 24%, 74%)"/><stop offset="52%" stop-color="hsl(218, 22%, 38%)"/><stop offset="100%" stop-color="hsl(222, 26%, 16%)"/></linearGradient><linearGradient id="ca-body_slam-trim" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(46, 96%, 76%)"/><stop offset="100%" stop-color="hsl(24, 68%, 32%)"/></linearGradient>`
  ),
  thunderclap: wrapArtSvg(
    'thunderclap',
    'hsl(228, 48%, 18%)',
    'hsl(252, 42%, 8%)',
    `<circle cx="64" cy="36" r="35" fill="url(#ca-thunderclap-flash)"/>
     <circle cx="64" cy="36" r="24" fill="none" stroke="hsl(48, 100%, 76%)" stroke-width="1.5" opacity="0.65"/>
     <path d="M64 36 L50 18 L57 17 L44 6 M64 36 L78 18 L71 17 L84 6" stroke="url(#ca-thunderclap-bolt)" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M64 36 L48 52 L56 54 L42 66 M64 36 L80 52 L72 54 L86 66" stroke="url(#ca-thunderclap-bolt)" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M10 26 L44 24 L56 32 L54 44 L40 50 L10 46 Z" fill="url(#ca-thunderclap-iron)" stroke="hsl(46, 94%, 74%)" stroke-width="1.5"/>
     <path d="M118 26 L84 24 L72 32 L74 44 L88 50 L118 46 Z" fill="url(#ca-thunderclap-iron)" stroke="hsl(46, 94%, 74%)" stroke-width="1.5"/>
     <path d="M24 26 V48 M36 26 V48 M92 26 V48 M104 26 V48" stroke="hsl(228, 34%, 20%)" stroke-width="1.8"/>
     <path d="M16 30 H48 M80 30 H112" stroke="hsl(214, 54%, 92%)" stroke-width="1.4" opacity="0.72"/>
     <polygon points="64,14 68,31 80,36 68,41 64,58 60,41 48,36 60,31" fill="hsl(54, 100%, 94%)"/>
     <path d="M22 14 L34 20 L28 24 M106 14 L94 20 L100 24" stroke="hsl(46, 100%, 78%)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
     <circle cx="24" cy="58" r="2" fill="hsl(48, 100%, 84%)"/>
     <circle cx="104" cy="58" r="2" fill="hsl(48, 100%, 84%)"/>
     <circle cx="64" cy="36" r="5" fill="hsl(0, 0%, 100%)"/>`,
    'hsla(48, 100%, 64%, 0.3)',
    `<radialGradient id="ca-thunderclap-flash" cx="50%" cy="50%" r="48%"><stop offset="0%" stop-color="hsl(54, 100%, 94%)" stop-opacity="0.9"/><stop offset="45%" stop-color="hsl(44, 100%, 62%)" stop-opacity="0.42"/><stop offset="100%" stop-color="hsl(244, 60%, 14%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-thunderclap-iron" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(222, 32%, 72%)"/><stop offset="55%" stop-color="hsl(228, 28%, 36%)"/><stop offset="100%" stop-color="hsl(236, 32%, 16%)"/></linearGradient><linearGradient id="ca-thunderclap-bolt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="100%" stop-color="hsl(42, 100%, 60%)"/></linearGradient>`
  ),
  heavy_blade: wrapArtSvg(
    'heavy_blade',
    'hsl(10, 56%, 20%)',
    'hsl(356, 44%, 8%)',
    `<path d="M20 58 Q64 46 110 62" stroke="hsl(20, 96%, 52%)" stroke-width="4" fill="none" opacity="0.45"/>
     <path d="M44 6 L90 48 M28 18 L72 58" stroke="hsl(34, 98%, 62%)" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>
     <path d="M44 26 L94 64 L108 62 L106 48 L62 12 Z" fill="rgba(0,0,0,0.5)" transform="translate(2,3)"/>
     <path d="M44 26 L94 64 L108 62 L106 48 L62 12 Z" fill="url(#ca-heavy_blade-steel)" stroke="url(#ca-heavy_blade-edge)" stroke-width="1.8"/>
     <path d="M62 12 L106 48 L108 62 L52 19 Z" fill="hsl(214, 28%, 84%)" opacity="0.22"/>
     <path d="M54 20 L102 58" stroke="hsl(220, 24%, 14%)" stroke-width="4.2" stroke-linecap="round"/>
     <polygon points="62,26 67,26 66,31 61,31" fill="hsl(44, 100%, 74%)"/>
     <polygon points="75,36 80,36 79,41 74,41" fill="hsl(32, 100%, 64%)"/>
     <polygon points="88,46 93,46 92,51 87,51" fill="hsl(18, 100%, 58%)"/>
     <path d="M36 36 L68 6" stroke="url(#ca-heavy_blade-hilt)" stroke-width="6.5" stroke-linecap="round"/>
     <path d="M46 16 L24 8" stroke="hsl(14, 48%, 22%)" stroke-width="6" stroke-linecap="round"/>
     <circle cx="22" cy="8" r="4.2" fill="url(#ca-heavy_blade-hilt)" stroke="hsl(16, 60%, 24%)" stroke-width="1.2"/>
     <path d="M98 64 L118 58 M92 66 L108 68" stroke="hsl(46, 100%, 78%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="114" cy="44" r="2.2" fill="hsl(48, 100%, 86%)"/>
     <circle cx="30" cy="48" r="2" fill="hsl(28, 100%, 66%)"/>`,
    'hsla(18, 96%, 52%, 0.28)',
    `<linearGradient id="ca-heavy_blade-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 22%, 72%)"/><stop offset="50%" stop-color="hsl(218, 18%, 36%)"/><stop offset="100%" stop-color="hsl(222, 22%, 16%)"/></linearGradient><linearGradient id="ca-heavy_blade-edge" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 82%)"/><stop offset="50%" stop-color="hsl(20, 100%, 56%)"/><stop offset="100%" stop-color="hsl(354, 94%, 44%)"/></linearGradient><linearGradient id="ca-heavy_blade-hilt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(42, 86%, 68%)"/><stop offset="100%" stop-color="hsl(18, 62%, 26%)"/></linearGradient>`
  ),
  true_grit: wrapArtSvg(
    'true_grit',
    'hsl(24, 40%, 19%)',
    'hsl(268, 28%, 9%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-true_grit-glow)"/>
     <path d="M12 66 Q16 38 30 30 Q22 14 40 10" stroke="url(#ca-true_grit-smoke)" stroke-width="9" fill="none" stroke-linecap="round"/>
     <path d="M116 66 Q112 38 98 30 Q106 14 88 10" stroke="url(#ca-true_grit-smoke)" stroke-width="9" fill="none" stroke-linecap="round"/>
     <path d="M36 66 L40 24 Q64 8 88 24 L92 66 Z" fill="rgba(0,0,0,0.48)" transform="translate(2,3)"/>
     <path d="M36 66 L40 24 Q64 8 88 24 L92 66 Z" fill="url(#ca-true_grit-helm)" stroke="hsl(36, 76%, 58%)" stroke-width="1.6"/>
     <path d="M64 11 V58" stroke="hsl(42, 84%, 64%)" stroke-width="2.4"/>
     <path d="M44 33 H84 L80 42 H48 Z" fill="hsl(224, 34%, 10%)" stroke="hsl(36, 72%, 50%)" stroke-width="1.2"/>
     <path d="M49 36 L60 38 L50 40 Z M79 36 L68 38 L78 40 Z" fill="hsl(44, 100%, 74%)"/>
     <path d="M48 22 L58 29 M76 47 L85 55 M44 52 L54 49" stroke="hsl(224, 30%, 12%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M49 21 L59 28 M77 46 L86 54" stroke="hsl(44, 100%, 82%)" stroke-width="0.9" stroke-linecap="round"/>
     <path d="M42 56 Q64 62 86 56" fill="none" stroke="hsl(42, 82%, 62%)" stroke-width="2"/>
     <polygon points="18,44 24,40 26,48" fill="hsl(282, 54%, 44%)" opacity="0.72"/>
     <polygon points="104,24 110,20 112,28" fill="hsl(34, 96%, 62%)" opacity="0.82"/>
     <circle cx="26" cy="24" r="2" fill="hsl(46, 100%, 80%)"/>
     <circle cx="102" cy="48" r="2.2" fill="hsl(288, 76%, 68%)"/>`,
    'hsla(34, 88%, 54%, 0.24)',
    `<linearGradient id="ca-true_grit-helm" x1="0" y1="0" x2="0.8" y2="1"><stop offset="0%" stop-color="hsl(214, 22%, 72%)"/><stop offset="52%" stop-color="hsl(218, 20%, 38%)"/><stop offset="100%" stop-color="hsl(222, 24%, 16%)"/></linearGradient><linearGradient id="ca-true_grit-smoke" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(276, 48%, 34%)" stop-opacity="0.62"/><stop offset="100%" stop-color="hsl(286, 62%, 58%)" stop-opacity="0.1"/></linearGradient><radialGradient id="ca-true_grit-glow" cx="50%" cy="48%" r="48%"><stop offset="0%" stop-color="hsl(38, 96%, 62%)" stop-opacity="0.4"/><stop offset="100%" stop-color="hsl(268, 40%, 12%)" stop-opacity="0"/></radialGradient>`
  ),
  anger: wrapArtSvg(
    'anger',
    'hsl(2, 76%, 21%)',
    'hsl(348, 64%, 8%)',
    `<circle cx="64" cy="36" r="35" fill="url(#ca-anger-aura)"/>
     <path d="M18 66 Q20 34 36 32 Q38 10 56 20 Q64 4 74 20 Q92 10 94 32 Q110 34 112 66 Z" fill="url(#ca-anger-flame)" opacity="0.54"/>
     <path d="M22 50 L26 24 L48 20 L52 46 Z" fill="hsl(356, 86%, 46%)" stroke="hsl(38, 100%, 70%)" stroke-width="1" opacity="0.42"/>
     <path d="M76 50 L80 24 L102 20 L106 46 Z" fill="hsl(356, 86%, 46%)" stroke="hsl(38, 100%, 70%)" stroke-width="1" opacity="0.42"/>
     <path d="M46 66 L44 38 L42 22 L52 17 L64 16 L76 17 L86 22 L84 44 L80 66 Z" fill="rgba(0,0,0,0.48)" transform="translate(2,3)"/>
     <path d="M46 66 L44 38 L42 22 L52 17 L64 16 L76 17 L86 22 L84 44 L80 66 Z" fill="url(#ca-anger-fist)" stroke="hsl(42, 100%, 72%)" stroke-width="1.6"/>
     <path d="M52 18 V35 M64 17 V35 M76 18 V35" stroke="hsl(348, 66%, 16%)" stroke-width="2"/>
     <path d="M44 36 Q64 31 84 36 L82 46 Q64 41 46 46 Z" fill="hsl(24, 92%, 56%)" stroke="hsl(48, 100%, 84%)" stroke-width="1.1"/>
     <path d="M52 50 L58 58 L64 52 L70 59 L76 50" stroke="hsl(48, 100%, 82%)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
     <path d="M12 24 L26 30 M116 24 L102 30 M16 46 L30 44 M112 46 L98 44" stroke="hsl(46, 100%, 78%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="48" cy="24" r="2.2" fill="hsl(50, 100%, 88%)"/>
     <circle cx="64" cy="22" r="2.4" fill="hsl(50, 100%, 88%)"/>
     <circle cx="80" cy="24" r="2.2" fill="hsl(50, 100%, 88%)"/>
     <circle cx="28" cy="14" r="2" fill="hsl(42, 100%, 76%)"/>
     <circle cx="100" cy="14" r="2" fill="hsl(42, 100%, 76%)"/>`,
    'hsla(10, 98%, 54%, 0.34)',
    `<radialGradient id="ca-anger-aura" cx="50%" cy="48%" r="48%"><stop offset="0%" stop-color="hsl(42, 100%, 72%)" stop-opacity="0.74"/><stop offset="52%" stop-color="hsl(4, 96%, 48%)" stop-opacity="0.4"/><stop offset="100%" stop-color="hsl(348, 72%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-anger-flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(354, 94%, 44%)"/><stop offset="55%" stop-color="hsl(18, 100%, 56%)"/><stop offset="100%" stop-color="hsl(48, 100%, 84%)"/></linearGradient><linearGradient id="ca-anger-fist" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(16, 78%, 54%)"/><stop offset="55%" stop-color="hsl(354, 72%, 34%)"/><stop offset="100%" stop-color="hsl(348, 64%, 14%)"/></linearGradient>`
  ),
  flex: wrapArtSvg(
    'flex',
    'hsl(14, 68%, 21%)',
    'hsl(352, 54%, 9%)',
    `<circle cx="64" cy="34" r="34" fill="url(#ca-flex-burst)"/>
     <path d="M64 6 L64 16 M34 12 L42 20 M94 12 L86 20 M16 32 L26 34 M112 32 L102 34" stroke="hsl(46, 100%, 78%)" stroke-width="2" stroke-linecap="round" opacity="0.72"/>
     <path d="M18 62 Q18 36 38 32 Q50 20 68 24 Q78 26 82 36 L86 20 L102 18 L104 34 L94 46 Q88 60 66 60 Q46 62 34 62 Z" fill="rgba(0,0,0,0.48)" transform="translate(2,3)"/>
     <path d="M18 62 Q18 36 38 32 Q50 20 68 24 Q78 26 82 36 L86 20 L102 18 L104 34 L94 46 Q88 60 66 60 Q46 62 34 62 Z" fill="url(#ca-flex-arm)" stroke="hsl(40, 96%, 70%)" stroke-width="1.6"/>
     <path d="M46 31 Q60 22 74 30" stroke="hsl(48, 100%, 88%)" stroke-width="2" fill="none" stroke-linecap="round"/>
     <path d="M42 46 Q62 38 78 46" stroke="hsl(348, 66%, 20%)" stroke-width="1.8" fill="none"/>
     <path d="M52 38 L62 34 L68 40" stroke="hsl(48, 100%, 82%)" stroke-width="1.4" fill="none" stroke-linecap="round"/>
     <polygon points="82,36 98,38 94,52 78,48" fill="url(#ca-flex-bracer)" stroke="hsl(22, 62%, 24%)" stroke-width="1.3"/>
     <circle cx="90" cy="44" r="2.2" fill="hsl(354, 92%, 56%)"/>
     <path d="M88 22 L92 28 M96 21 L98 28" stroke="hsl(350, 62%, 22%)" stroke-width="1.4"/>
     <path d="M24 22 L30 14 L36 22 M96 58 L102 50 L108 58" fill="none" stroke="hsl(46, 100%, 80%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="62" cy="14" r="2.4" fill="hsl(52, 100%, 92%)"/>
     <circle cx="110" cy="22" r="2" fill="hsl(44, 100%, 76%)"/>
     <circle cx="16" cy="48" r="1.8" fill="hsl(32, 100%, 66%)"/>`,
    'hsla(36, 100%, 58%, 0.3)',
    `<radialGradient id="ca-flex-burst" cx="50%" cy="46%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 84%)" stop-opacity="0.72"/><stop offset="55%" stop-color="hsl(20, 96%, 52%)" stop-opacity="0.3"/><stop offset="100%" stop-color="hsl(352, 64%, 12%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-flex-arm" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(22, 82%, 60%)"/><stop offset="50%" stop-color="hsl(6, 74%, 40%)"/><stop offset="100%" stop-color="hsl(350, 62%, 18%)"/></linearGradient><linearGradient id="ca-flex-bracer" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(46, 94%, 76%)"/><stop offset="100%" stop-color="hsl(24, 68%, 32%)"/></linearGradient>`
  ),
  armaments: wrapArtSvg(
    'armaments',
    'hsl(28, 56%, 20%)',
    'hsl(16, 48%, 9%)',
    `<circle cx="64" cy="34" r="34" fill="url(#ca-armaments-glow)"/>
     <path d="M52 6 L76 6 L70 42 L58 42 Z" fill="hsl(48, 100%, 80%)" opacity="0.22"/>
     <path d="M18 42 L42 42 L42 40 L94 40 L110 44 L92 50 L84 54 L94 65 L34 65 L44 54 L36 48 Z" fill="rgba(0,0,0,0.48)" transform="translate(2,2)"/>
     <path d="M18 42 L42 42 L42 40 L94 40 L110 44 L92 50 L84 54 L94 65 L34 65 L44 54 L36 48 Z" fill="url(#ca-armaments-anvil)" stroke="hsl(38, 80%, 58%)" stroke-width="1.4"/>
     <path d="M24 38 L92 36 L104 39 L92 42 L24 41 Z" fill="url(#ca-armaments-blade)" stroke="hsl(22, 92%, 48%)" stroke-width="1.1"/>
     <path d="M40 16 L60 12 L72 28 L52 34 Z" fill="hsl(214, 22%, 44%)" stroke="hsl(46, 96%, 74%)" stroke-width="1.4"/>
     <path d="M62 24 L92 10" stroke="hsl(26, 52%, 34%)" stroke-width="5.2" stroke-linecap="round"/>
     <polygon points="62,28 65,34 72,37 65,40 62,46 59,40 52,37 59,34" fill="hsl(142, 88%, 74%)" stroke="hsl(48, 100%, 92%)" stroke-width="1"/>
     <path d="M42 26 Q30 16 20 24 M84 26 Q98 16 110 26 M48 34 L28 32 M84 34 L108 32" stroke="hsl(46, 100%, 78%)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
     <circle cx="20" cy="24" r="2.2" fill="hsl(50, 100%, 88%)"/>
     <circle cx="110" cy="26" r="2.2" fill="hsl(42, 100%, 74%)"/>
     <circle cx="32" cy="14" r="1.8" fill="hsl(32, 100%, 66%)"/>
     <circle cx="102" cy="14" r="1.8" fill="hsl(142, 92%, 72%)"/>
     <circle cx="62" cy="10" r="2" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(42, 98%, 58%, 0.28)',
    `<radialGradient id="ca-armaments-glow" cx="52%" cy="46%" r="48%"><stop offset="0%" stop-color="hsl(52, 100%, 88%)" stop-opacity="0.72"/><stop offset="52%" stop-color="hsl(34, 98%, 54%)" stop-opacity="0.3"/><stop offset="100%" stop-color="hsl(18, 60%, 12%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-armaments-anvil" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(214, 18%, 54%)"/><stop offset="55%" stop-color="hsl(220, 18%, 28%)"/><stop offset="100%" stop-color="hsl(224, 22%, 14%)"/></linearGradient><linearGradient id="ca-armaments-blade" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(44, 100%, 80%)"/><stop offset="55%" stop-color="hsl(52, 100%, 94%)"/><stop offset="100%" stop-color="hsl(24, 100%, 60%)"/></linearGradient>`
  ),
  sword_boomerang: wrapArtSvg(
    'sword_boomerang',
    'hsl(12, 54%, 20%)',
    'hsl(220, 38%, 9%)',
    `<ellipse cx="64" cy="36" rx="52" ry="24" transform="rotate(-12 64 36)" fill="none" stroke="url(#ca-sword_boomerang-trail)" stroke-width="4.5" opacity="0.72"/>
     <ellipse cx="64" cy="36" rx="44" ry="18" transform="rotate(-12 64 36)" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.3" stroke-dasharray="10 6" opacity="0.82"/>
     <path d="M18 46 L46 28 L52 34 L24 52 Z" fill="hsl(34, 96%, 64%)" opacity="0.34"/>
     <path d="M76 52 L106 34 L112 40 L82 58 Z" fill="hsl(34, 96%, 64%)" opacity="0.34"/>
     <circle cx="64" cy="36" r="19" fill="hsl(28, 96%, 54%)" opacity="0.18"/>
     <path d="M36 52 L84 18 L98 14 L92 26 L44 58 Z" fill="rgba(0,0,0,0.45)" transform="translate(2,3)"/>
     <path d="M36 52 L84 18 L98 14 L92 26 L44 58 Z" fill="url(#ca-sword_boomerang-blade)" stroke="hsl(44, 96%, 72%)" stroke-width="1.4"/>
     <path d="M42 53 L91 18" stroke="hsl(0, 0%, 100%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M34 42 L50 62" stroke="hsl(42, 92%, 66%)" stroke-width="4.2" stroke-linecap="round"/>
     <path d="M41 53 L28 62" stroke="hsl(14, 54%, 24%)" stroke-width="4" stroke-linecap="round"/>
     <circle cx="27" cy="63" r="2.8" fill="hsl(46, 96%, 72%)"/>
     <path d="M88 10 Q106 12 114 26 M40 62 Q20 60 14 46" stroke="hsl(50, 100%, 88%)" stroke-width="2" fill="none" stroke-linecap="round"/>
     <circle cx="112" cy="24" r="2.4" fill="hsl(52, 100%, 92%)"/>
     <circle cx="18" cy="30" r="2" fill="hsl(36, 100%, 72%)"/>
     <circle cx="96" cy="54" r="1.8" fill="hsl(46, 100%, 80%)"/>`,
    'hsla(24, 94%, 56%, 0.26)',
    `<linearGradient id="ca-sword_boomerang-trail" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(354, 92%, 52%)" stop-opacity="0.2"/><stop offset="50%" stop-color="hsl(32, 100%, 62%)" stop-opacity="0.82"/><stop offset="100%" stop-color="hsl(52, 100%, 92%)"/></linearGradient><linearGradient id="ca-sword_boomerang-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 32%, 90%)"/><stop offset="55%" stop-color="hsl(218, 22%, 48%)"/><stop offset="100%" stop-color="hsl(222, 26%, 22%)"/></linearGradient>`
  ),
  perfected_strike: wrapArtSvg(
    'perfected_strike',
    'hsl(356, 62%, 20%)',
    'hsl(24, 52%, 8%)',
    `<circle cx="64" cy="35" r="35" fill="url(#ca-perfected_strike-halo)"/>
     <circle cx="64" cy="35" r="24" fill="none" stroke="hsl(46, 100%, 80%)" stroke-width="1.4" opacity="0.7"/>
     <path d="M22 14 L46 50 L40 54 L16 18 Z" fill="url(#ca-perfected_strike-side)" stroke="hsl(44, 92%, 74%)" stroke-width="0.9"/>
     <path d="M106 14 L82 50 L88 54 L112 18 Z" fill="url(#ca-perfected_strike-side)" stroke="hsl(44, 92%, 74%)" stroke-width="0.9"/>
     <path d="M36 10 L54 52 L48 54 L30 12 Z" fill="url(#ca-perfected_strike-side)" stroke="hsl(48, 100%, 84%)" stroke-width="0.9"/>
     <path d="M92 10 L74 52 L80 54 L98 12 Z" fill="url(#ca-perfected_strike-side)" stroke="hsl(48, 100%, 84%)" stroke-width="0.9"/>
     <path d="M58 18 L70 18 L72 54 L64 66 L56 54 Z" fill="rgba(0,0,0,0.45)" transform="translate(2,2)"/>
     <path d="M58 18 L70 18 L72 54 L64 66 L56 54 Z" fill="url(#ca-perfected_strike-hero)" stroke="hsl(24, 82%, 34%)" stroke-width="1.3"/>
     <path d="M64 19 V62" stroke="hsl(0, 0%, 100%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M46 18 L64 23 L82 18 L78 14 L64 17 L50 14 Z" fill="hsl(46, 100%, 76%)" stroke="hsl(22, 74%, 28%)" stroke-width="1.1"/>
     <path d="M64 7 V16" stroke="hsl(14, 60%, 26%)" stroke-width="4.5" stroke-linecap="round"/>
     <circle cx="64" cy="7" r="3" fill="hsl(50, 100%, 86%)" stroke="hsl(22, 74%, 30%)" stroke-width="1"/>
     <polygon points="64,34 68,40 76,42 68,44 64,50 60,44 52,42 60,40" fill="hsl(0, 0%, 100%)" opacity="0.92"/>
     <circle cx="24" cy="48" r="2" fill="hsl(48, 100%, 84%)"/>
     <circle cx="104" cy="48" r="2" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(44, 100%, 64%, 0.34)',
    `<radialGradient id="ca-perfected_strike-halo" cx="50%" cy="46%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 94%)" stop-opacity="0.88"/><stop offset="48%" stop-color="hsl(40, 100%, 60%)" stop-opacity="0.4"/><stop offset="100%" stop-color="hsl(354, 68%, 12%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-perfected_strike-hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="50%" stop-color="hsl(42, 92%, 72%)"/><stop offset="100%" stop-color="hsl(28, 76%, 40%)"/></linearGradient><linearGradient id="ca-perfected_strike-side" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(214, 24%, 76%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(34, 82%, 52%)" stop-opacity="0.32"/></linearGradient>`
  ),
  clash: wrapArtSvg(
    'clash',
    'hsl(18, 64%, 20%)',
    'hsl(354, 48%, 9%)',
    `<circle cx="64" cy="34" r="34" fill="url(#ca-clash-star)"/>
     <path d="M22 58 L92 10 L102 10 L96 20 L30 64 Z" fill="url(#ca-clash-blade1)" stroke="hsl(218, 28%, 22%)" stroke-width="1.3"/>
     <path d="M28 59 L95 13" stroke="hsl(0, 0%, 100%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M106 58 L36 10 L26 10 L32 20 L98 64 Z" fill="url(#ca-clash-blade2)" stroke="hsl(14, 66%, 24%)" stroke-width="1.3"/>
     <path d="M100 59 L33 13" stroke="hsl(52, 100%, 96%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M16 48 L36 66" stroke="hsl(42, 86%, 64%)" stroke-width="4.4" stroke-linecap="round"/>
     <path d="M112 48 L92 66" stroke="hsl(42, 86%, 64%)" stroke-width="4.4" stroke-linecap="round"/>
     <polygon points="64,10 68,28 84,22 72,34 86,44 68,40 64,58 60,40 42,44 56,34 44,22 60,28" fill="hsl(52, 100%, 92%)"/>
     <circle cx="64" cy="34" r="6" fill="hsl(0, 0%, 100%)"/>
     <path d="M64 8 L64 4 M40 16 L32 10 M88 16 L96 10 M38 48 L26 52 M90 48 L102 52" stroke="hsl(48, 100%, 84%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="48" cy="54" r="2.2" fill="hsl(48, 100%, 86%)"/>
     <circle cx="80" cy="54" r="2.2" fill="hsl(48, 100%, 86%)"/>
     <circle cx="18" cy="28" r="1.8" fill="hsl(36, 100%, 72%)"/>
     <circle cx="110" cy="28" r="1.8" fill="hsl(36, 100%, 72%)"/>`,
    'hsla(36, 100%, 60%, 0.34)',
    `<radialGradient id="ca-clash-star" cx="50%" cy="46%" r="48%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)" stop-opacity="0.94"/><stop offset="44%" stop-color="hsl(32, 100%, 58%)" stop-opacity="0.48"/><stop offset="100%" stop-color="hsl(354, 68%, 12%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-clash-blade1" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(216, 22%, 34%)"/><stop offset="60%" stop-color="hsl(214, 30%, 80%)"/><stop offset="100%" stop-color="hsl(52, 100%, 94%)"/></linearGradient><linearGradient id="ca-clash-blade2" x1="1" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(14, 52%, 28%)"/><stop offset="60%" stop-color="hsl(36, 92%, 68%)"/><stop offset="100%" stop-color="hsl(54, 100%, 94%)"/></linearGradient>`
  ),
  whirlwind: wrapArtSvg(
    'whirlwind',
    'hsl(14, 54%, 20%)',
    'hsl(216, 40%, 9%)',
    `<polygon points="14,10 114,10 80,66 48,66" fill="url(#ca-whirlwind-vortex)"/>
     <ellipse cx="64" cy="15" rx="48" ry="8" fill="none" stroke="url(#ca-whirlwind-slash)" stroke-width="3.6"/>
     <ellipse cx="64" cy="28" rx="40" ry="7.5" fill="none" stroke="url(#ca-whirlwind-slash)" stroke-width="3.2"/>
     <ellipse cx="64" cy="41" rx="30" ry="6.5" fill="none" stroke="hsl(46, 100%, 78%)" stroke-width="2.6"/>
     <ellipse cx="64" cy="53" rx="20" ry="5" fill="none" stroke="hsl(214, 38%, 84%)" stroke-width="2.2"/>
     <ellipse cx="64" cy="63" rx="11" ry="3" fill="none" stroke="hsl(34, 100%, 70%)" stroke-width="1.8"/>
     <path d="M18 16 Q64 25 110 16 L118 11 L104 20 Q64 28 22 20 Z" fill="hsl(214, 36%, 90%)"/>
     <path d="M24 30 Q64 38 104 28 L94 35 Q64 42 32 34 Z" fill="hsl(48, 100%, 86%)"/>
     <path d="M40 44 Q64 50 88 42" stroke="hsl(0, 0%, 100%)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <path d="M64 10 V64" stroke="hsl(48, 100%, 90%)" stroke-width="1.2" opacity="0.45"/>
     <polygon points="10,20 20,16 17,24" fill="hsl(214, 34%, 86%)"/>
     <polygon points="118,22 108,18 111,26" fill="hsl(46, 100%, 80%)"/>
     <circle cx="24" cy="48" r="2.2" fill="hsl(36, 100%, 72%)"/>
     <circle cx="104" cy="46" r="2.2" fill="hsl(48, 100%, 84%)"/>
     <circle cx="38" cy="60" r="1.8" fill="hsl(214, 42%, 86%)"/>`,
    'hsla(26, 94%, 58%, 0.28)',
    `<linearGradient id="ca-whirlwind-vortex" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(42, 98%, 74%)" stop-opacity="0.52"/><stop offset="55%" stop-color="hsl(18, 92%, 52%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(214, 34%, 56%)" stop-opacity="0.16"/></linearGradient><linearGradient id="ca-whirlwind-slash" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(354, 92%, 52%)"/><stop offset="52%" stop-color="hsl(214, 34%, 88%)"/><stop offset="100%" stop-color="hsl(48, 100%, 86%)"/></linearGradient>`
  ),
  inflame: wrapArtSvg(
    'inflame',
    'hsl(12, 76%, 21%)',
    'hsl(354, 62%, 8%)',
    `<circle cx="64" cy="40" r="35" fill="url(#ca-inflame-core)"/>
     <path d="M26 62 Q16 36 36 22 Q40 32 46 28 Q50 10 64 6 Q78 10 82 28 Q88 32 92 22 Q112 36 102 62 Z" fill="url(#ca-inflame-fire)"/>
     <path d="M40 60 Q36 38 50 28 Q56 34 64 14 Q72 34 78 28 Q92 38 88 60 Z" fill="hsl(44, 100%, 74%)" opacity="0.9"/>
     <path d="M52 58 Q54 40 64 26 Q74 40 76 58 Z" fill="hsl(56, 100%, 94%)"/>
     <path d="M30 48 L48 56 L54 66 L34 66 Z M98 48 L80 56 L74 66 L94 66 Z" fill="url(#ca-inflame-plate)" stroke="hsl(32, 92%, 58%)" stroke-width="1.4"/>
     <path d="M46 58 Q64 52 82 58 L76 66 H52 Z" fill="hsl(354, 86%, 36%)" stroke="hsl(46, 100%, 78%)" stroke-width="1.2"/>
     <path d="M18 46 Q20 30 28 34 M110 46 Q108 30 100 34" stroke="hsl(36, 100%, 66%)" stroke-width="2" fill="none" stroke-linecap="round"/>
     <circle cx="24" cy="20" r="2.2" fill="hsl(48, 100%, 82%)"/>
     <circle cx="104" cy="20" r="2.2" fill="hsl(48, 100%, 82%)"/>
     <circle cx="46" cy="12" r="2" fill="hsl(52, 100%, 90%)"/>
     <circle cx="82" cy="12" r="2" fill="hsl(52, 100%, 90%)"/>
     <circle cx="18" cy="58" r="1.8" fill="hsl(22, 100%, 62%)"/>
     <circle cx="110" cy="58" r="1.8" fill="hsl(22, 100%, 62%)"/>`,
    'hsla(26, 100%, 56%, 0.34)',
    `<radialGradient id="ca-inflame-core" cx="50%" cy="56%" r="46%"><stop offset="0%" stop-color="hsl(54, 100%, 92%)" stop-opacity="0.86"/><stop offset="48%" stop-color="hsl(24, 100%, 54%)" stop-opacity="0.46"/><stop offset="100%" stop-color="hsl(354, 72%, 12%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-inflame-fire" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(356, 94%, 44%)"/><stop offset="48%" stop-color="hsl(22, 100%, 56%)"/><stop offset="100%" stop-color="hsl(52, 100%, 88%)"/></linearGradient><linearGradient id="ca-inflame-plate" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 18%, 46%)"/><stop offset="100%" stop-color="hsl(352, 44%, 14%)"/></linearGradient>`
  ),
  metallicize: wrapArtSvg(
    'metallicize',
    'hsl(214, 34%, 22%)',
    'hsl(224, 42%, 10%)',
    `<polygon points="64,6 96,20 96,52 64,66 32,52 32,20" fill="none" stroke="hsl(206, 68%, 74%)" stroke-width="1.4" opacity="0.48"/>
     <path d="M14 58 L46 10 M82 62 L114 14" stroke="hsl(206, 76%, 86%)" stroke-width="1.2" opacity="0.24"/>
     <path d="M40 66 L42 36 L44 16 L54 10 L64 8 L74 10 L84 16 L86 38 L82 66 Z" fill="rgba(0,0,0,0.48)" transform="translate(2,3)"/>
     <path d="M42 66 L44 46 L84 46 L82 66 Z" fill="url(#ca-metallicize-warm)" stroke="hsl(208, 36%, 72%)" stroke-width="1.3"/>
     <polygon points="42,46 44,16 54,10 64,22 64,46" fill="url(#ca-metallicize-chrome)" stroke="hsl(210, 46%, 88%)" stroke-width="1.2"/>
     <polygon points="86,46 84,16 74,10 64,22 64,46" fill="url(#ca-metallicize-facet)" stroke="hsl(210, 46%, 88%)" stroke-width="1.2"/>
     <polygon points="54,10 64,8 74,10 64,24" fill="hsl(208, 56%, 94%)" stroke="hsl(216, 28%, 42%)" stroke-width="1"/>
     <polygon points="48,34 64,26 80,34 64,48" fill="url(#ca-metallicize-chrome)" stroke="hsl(206, 62%, 90%)" stroke-width="1.2"/>
     <path d="M48 34 L64 26 L64 48 Z" fill="hsl(0, 0%, 100%)" opacity="0.28"/>
     <polygon points="24,30 30,24 34,34" fill="url(#ca-metallicize-chrome)" opacity="0.82"/>
     <polygon points="104,40 98,34 94,44" fill="url(#ca-metallicize-chrome)" opacity="0.82"/>
     <polygon points="52,18 54,22 58,24 54,26 52,30 50,26 46,24 50,22" fill="hsl(0, 0%, 100%)"/>
     <polygon points="80,14 81.5,17 85,18.5 81.5,20 80,23 78.5,20 75,18.5 78.5,17" fill="hsl(206, 100%, 92%)"/>
     <circle cx="30" cy="52" r="2" fill="hsl(208, 72%, 82%)"/>`,
    'hsla(206, 80%, 66%, 0.26)',
    `<linearGradient id="ca-metallicize-chrome" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(210, 40%, 94%)"/><stop offset="48%" stop-color="hsl(214, 24%, 56%)"/><stop offset="100%" stop-color="hsl(222, 28%, 22%)"/></linearGradient><linearGradient id="ca-metallicize-facet" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(216, 26%, 36%)"/><stop offset="100%" stop-color="hsl(206, 52%, 88%)"/></linearGradient><linearGradient id="ca-metallicize-warm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(214, 24%, 64%)"/><stop offset="100%" stop-color="hsl(6, 62%, 34%)"/></linearGradient>`
  ),
  battle_trance: wrapArtSvg(
    'battle_trance',
    'hsl(352, 54%, 17%)',
    'hsl(232, 42%, 8%)',
    `<ellipse cx="64" cy="36" rx="56" ry="30" fill="none" stroke="hsl(354, 84%, 52%)" stroke-width="1.5" opacity="0.45"/>
     <ellipse cx="64" cy="36" rx="44" ry="22" fill="none" stroke="hsl(38, 96%, 64%)" stroke-width="1.3" opacity="0.58"/>
     <rect x="20" y="10" width="16" height="22" rx="2" transform="rotate(-16 28 21)" fill="hsl(354, 52%, 24%)" stroke="hsl(44, 92%, 68%)" stroke-width="1.1" opacity="0.52"/>
     <rect x="92" y="10" width="16" height="22" rx="2" transform="rotate(16 100 21)" fill="hsl(354, 52%, 24%)" stroke="hsl(44, 92%, 68%)" stroke-width="1.1" opacity="0.52"/>
     <rect x="56" y="6" width="16" height="20" rx="2" fill="hsl(354, 56%, 28%)" stroke="hsl(48, 100%, 78%)" stroke-width="1.1" opacity="0.58"/>
     <path d="M18 24 L64 14 L110 24 L104 54 L64 64 L24 54 Z" fill="url(#ca-battle_trance-visor)" stroke="hsl(40, 82%, 62%)" stroke-width="1.6"/>
     <path d="M24 30 L64 38 L104 30 L98 46 L64 50 L30 46 Z" fill="hsl(236, 46%, 6%)" stroke="hsl(354, 72%, 44%)" stroke-width="1.2"/>
     <circle cx="44" cy="39" r="11" fill="url(#ca-battle_trance-eye)" opacity="0.72"/>
     <circle cx="84" cy="39" r="11" fill="url(#ca-battle_trance-eye)" opacity="0.72"/>
     <path d="M32 35 L55 40 L36 44 Z M96 35 L73 40 L92 44 Z" fill="hsl(50, 100%, 88%)" stroke="hsl(22, 100%, 56%)" stroke-width="1"/>
     <path d="M64 14 V62" stroke="hsl(42, 80%, 60%)" stroke-width="2"/>
     <path d="M12 38 H26 M102 38 H116" stroke="hsl(48, 100%, 82%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="44" cy="39" r="2.2" fill="hsl(0, 0%, 100%)"/>
     <circle cx="84" cy="39" r="2.2" fill="hsl(0, 0%, 100%)"/>`,
    'hsla(36, 96%, 56%, 0.28)',
    `<radialGradient id="ca-battle_trance-eye" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="55%" stop-color="hsl(26, 100%, 58%)"/><stop offset="100%" stop-color="hsl(354, 92%, 44%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-battle_trance-visor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(224, 24%, 44%)"/><stop offset="50%" stop-color="hsl(228, 28%, 20%)"/><stop offset="100%" stop-color="hsl(232, 34%, 10%)"/></linearGradient>`
  ),
  bloodletting: wrapArtSvg(
    'bloodletting',
    'hsl(350, 74%, 18%)',
    'hsl(342, 58%, 7%)',
    `<ellipse cx="64" cy="60" rx="44" ry="18" fill="url(#ca-bloodletting-energy)"/>
     <circle cx="64" cy="34" r="28" fill="none" stroke="hsl(352, 78%, 48%)" stroke-width="1.2" opacity="0.5"/>
     <path d="M18 14 Q52 10 88 26 L78 34 Q48 22 22 24 Z" fill="rgba(0,0,0,0.45)" transform="translate(2,2)"/>
     <path d="M18 14 Q52 10 88 26 L78 34 Q48 22 22 24 Z" fill="url(#ca-bloodletting-blade)" stroke="hsl(214, 34%, 84%)" stroke-width="1.1"/>
     <path d="M84 24 L106 16" stroke="hsl(20, 48%, 24%)" stroke-width="5.5" stroke-linecap="round"/>
     <path d="M80 18 L89 32" stroke="hsl(42, 86%, 64%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M40 24 Q58 26 76 32" stroke="hsl(354, 100%, 60%)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
     <path d="M52 28 C47 37 47 44 52 46 C57 44 57 37 52 28 Z" fill="url(#ca-bloodletting-blood)" stroke="hsl(354, 100%, 76%)" stroke-width="0.9"/>
     <path d="M68 33 C63 43 63 51 68 54 C73 51 73 43 68 33 Z" fill="url(#ca-bloodletting-blood)" stroke="hsl(354, 100%, 76%)" stroke-width="0.9"/>
     <path d="M36 27 C33 34 33 38 36 40 C39 38 39 34 36 27 Z" fill="url(#ca-bloodletting-blood)"/>
     <ellipse cx="62" cy="60" rx="28" ry="6" fill="hsl(352, 94%, 42%)" stroke="hsl(42, 100%, 74%)" stroke-width="1.4"/>
     <path d="M46 56 L38 44 M64 54 L64 40 M82 56 L92 44" stroke="hsl(46, 100%, 80%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="38" cy="44" r="2.4" fill="hsl(50, 100%, 88%)"/>
     <circle cx="92" cy="44" r="2.4" fill="hsl(50, 100%, 88%)"/>
     <circle cx="64" cy="60" r="3.2" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(354, 96%, 52%, 0.3)',
    `<linearGradient id="ca-bloodletting-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 28%, 88%)"/><stop offset="65%" stop-color="hsl(218, 22%, 44%)"/><stop offset="100%" stop-color="hsl(352, 92%, 52%)"/></linearGradient><linearGradient id="ca-bloodletting-blood" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(354, 100%, 62%)"/><stop offset="100%" stop-color="hsl(348, 92%, 34%)"/></linearGradient><radialGradient id="ca-bloodletting-energy" cx="50%" cy="84%" r="44%"><stop offset="0%" stop-color="hsl(48, 100%, 84%)" stop-opacity="0.82"/><stop offset="52%" stop-color="hsl(22, 100%, 54%)" stop-opacity="0.38"/><stop offset="100%" stop-color="hsl(346, 70%, 12%)" stop-opacity="0"/></radialGradient>`
  ),
  seeing_red: wrapArtSvg(
    'seeing_red',
    'hsl(356, 82%, 22%)',
    'hsl(346, 70%, 8%)',
    `<circle cx="64" cy="36" r="40" fill="url(#ca-seeing_red-glow)"/>
     <path d="M4 6 L28 20 M124 6 L100 20 M4 66 L28 52 M124 66 L100 52 M64 2 V16 M64 70 V56" stroke="hsl(358, 100%, 62%)" stroke-width="2.4" stroke-linecap="round" opacity="0.72"/>
     <path d="M12 22 L64 34 L116 22 L108 14 L64 24 L20 14 Z" fill="hsl(346, 72%, 12%)" stroke="hsl(358, 96%, 56%)" stroke-width="1.3"/>
     <circle cx="42" cy="38" r="16" fill="url(#ca-seeing_red-eye)" opacity="0.82"/>
     <circle cx="86" cy="38" r="16" fill="url(#ca-seeing_red-eye)" opacity="0.82"/>
     <path d="M22 30 L58 38 L30 48 Z" fill="hsl(50, 100%, 88%)" stroke="hsl(12, 100%, 54%)" stroke-width="1.5"/>
     <path d="M106 30 L70 38 L98 48 Z" fill="hsl(50, 100%, 88%)" stroke="hsl(12, 100%, 54%)" stroke-width="1.5"/>
     <circle cx="41" cy="38" r="3.6" fill="hsl(354, 96%, 44%)"/>
     <circle cx="87" cy="38" r="3.6" fill="hsl(354, 96%, 44%)"/>
     <path d="M16 40 L26 38 M112 40 L102 38 M34 52 L28 62 L38 64 M94 52 L100 62 L90 64" stroke="hsl(358, 100%, 68%)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
     <path d="M42 20 V56 M24 38 H60 M86 20 V56 M68 38 H104" stroke="hsl(52, 100%, 92%)" stroke-width="1.1" opacity="0.62"/>
     <circle cx="64" cy="54" r="3" fill="hsl(44, 100%, 78%)"/>
     <circle cx="16" cy="28" r="2" fill="hsl(358, 100%, 72%)"/>
     <circle cx="112" cy="28" r="2" fill="hsl(358, 100%, 72%)"/>`,
    'hsla(358, 100%, 56%, 0.36)',
    `<radialGradient id="ca-seeing_red-glow" cx="50%" cy="50%" r="52%"><stop offset="0%" stop-color="hsl(18, 100%, 64%)" stop-opacity="0.7"/><stop offset="55%" stop-color="hsl(356, 94%, 44%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(344, 78%, 8%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-seeing_red-eye" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="50%" stop-color="hsl(34, 100%, 64%)"/><stop offset="100%" stop-color="hsl(356, 96%, 50%)" stop-opacity="0"/></radialGradient>`
  ),
  uppercut: wrapArtSvg(
    'uppercut',
    'hsl(12, 62%, 20%)',
    'hsl(352, 50%, 9%)',
    `<circle cx="72" cy="18" r="28" fill="url(#ca-uppercut-flash)"/>
     <path d="M18 66 Q24 38 66 8 Q54 34 40 66 Z" fill="url(#ca-uppercut-arc)"/>
     <ellipse cx="72" cy="18" rx="28" ry="8" fill="none" stroke="hsl(46, 100%, 78%)" stroke-width="1.8" opacity="0.78"/>
     <path d="M44 64 L52 38 L46 22 L62 14 L80 18 L84 34 L72 44 L66 64 Z" fill="rgba(0,0,0,0.48)" transform="translate(2,3)"/>
     <path d="M44 64 L52 38 L46 22 L62 14 L80 18 L84 34 L72 44 L66 64 Z" fill="url(#ca-uppercut-gauntlet)" stroke="hsl(42, 94%, 70%)" stroke-width="1.6"/>
     <path d="M52 20 L58 32 M64 16 L68 30 M75 18 L77 31" stroke="hsl(222, 26%, 16%)" stroke-width="1.8"/>
     <polygon points="52,14 58,8 61,16" fill="hsl(46, 98%, 78%)"/>
     <polygon points="65,12 72,6 74,16" fill="hsl(46, 98%, 78%)"/>
     <path d="M50 42 L74 42 M48 54 L70 54" stroke="hsl(38, 86%, 60%)" stroke-width="2.2"/>
     <path d="M51 34 Q64 28 79 34" stroke="hsl(214, 42%, 92%)" stroke-width="1.6" fill="none"/>
     <path d="M36 16 L24 10 M92 14 L106 8 M96 28 L112 28" stroke="hsl(48, 100%, 84%)" stroke-width="2" stroke-linecap="round"/>
     <polygon points="94,18 102,16 99,24" fill="hsl(44, 82%, 86%)"/>
     <polygon points="32,26 39,22 38,30" fill="hsl(44, 82%, 86%)"/>
     <circle cx="88" cy="46" r="2.2" fill="hsl(36, 100%, 72%)"/>`,
    'hsla(28, 98%, 56%, 0.3)',
    `<linearGradient id="ca-uppercut-arc" x1="0" y1="1" x2="0.6" y2="0"><stop offset="0%" stop-color="hsl(354, 92%, 48%)" stop-opacity="0.22"/><stop offset="55%" stop-color="hsl(24, 100%, 58%)" stop-opacity="0.88"/><stop offset="100%" stop-color="hsl(52, 100%, 92%)"/></linearGradient><linearGradient id="ca-uppercut-gauntlet" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 24%, 76%)"/><stop offset="50%" stop-color="hsl(218, 22%, 40%)"/><stop offset="100%" stop-color="hsl(222, 26%, 16%)"/></linearGradient><radialGradient id="ca-uppercut-flash" cx="56%" cy="22%" r="36%"><stop offset="0%" stop-color="hsl(54, 100%, 94%)" stop-opacity="0.86"/><stop offset="55%" stop-color="hsl(28, 100%, 56%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(10, 70%, 14%)" stop-opacity="0"/></radialGradient>`
  ),
  feel_no_pain: wrapArtSvg(
    'feel_no_pain',
    'hsl(258, 38%, 20%)',
    'hsl(232, 42%, 9%)',
    `<circle cx="64" cy="36" r="35" fill="url(#ca-feel_no_pain-shield)"/>
     <path d="M22 58 Q20 14 64 8 Q108 14 106 58" fill="none" stroke="hsl(204, 88%, 74%)" stroke-width="2.2" opacity="0.74"/>
     <path d="M12 24 L34 32 M14 48 L36 44 M116 24 L94 32 M114 48 L92 44" stroke="hsl(352, 86%, 58%)" stroke-width="2" stroke-linecap="round" opacity="0.65"/>
     <path d="M34 66 L40 42 L50 36 L52 20 Q64 12 76 20 L78 36 L88 42 L94 66 Z" fill="rgba(0,0,0,0.46)" transform="translate(2,2)"/>
     <path d="M34 66 L40 42 L50 36 L52 20 Q64 12 76 20 L78 36 L88 42 L94 66 Z" fill="url(#ca-feel_no_pain-body)" stroke="hsl(206, 76%, 76%)" stroke-width="1.5"/>
     <path d="M54 26 H74" stroke="hsl(204, 100%, 84%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M46 42 L64 56 L82 42" fill="none" stroke="hsl(282, 88%, 72%)" stroke-width="2"/>
     <polygon points="64,39 72,48 64,58 56,48" fill="hsl(206, 86%, 72%)" stroke="hsl(284, 92%, 78%)" stroke-width="1.2"/>
     <path d="M28 32 Q36 22 44 26 M100 32 Q92 22 84 26" stroke="url(#ca-feel_no_pain-wisp)" stroke-width="3.2" fill="none" stroke-linecap="round"/>
     <circle cx="34" cy="32" r="2.8" fill="hsl(284, 96%, 78%)"/>
     <circle cx="94" cy="32" r="2.8" fill="hsl(284, 96%, 78%)"/>
     <circle cx="36" cy="44" r="2.2" fill="hsl(204, 96%, 82%)"/>
     <circle cx="92" cy="44" r="2.2" fill="hsl(204, 96%, 82%)"/>
     <circle cx="64" cy="10" r="2.2" fill="hsl(206, 100%, 88%)"/>`,
    'hsla(266, 82%, 62%, 0.26)',
    `<radialGradient id="ca-feel_no_pain-shield" cx="50%" cy="48%" r="50%"><stop offset="0%" stop-color="hsl(206, 90%, 70%)" stop-opacity="0.46"/><stop offset="58%" stop-color="hsl(274, 78%, 54%)" stop-opacity="0.24"/><stop offset="100%" stop-color="hsl(232, 50%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-feel_no_pain-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(216, 26%, 64%)"/><stop offset="55%" stop-color="hsl(226, 26%, 32%)"/><stop offset="100%" stop-color="hsl(236, 32%, 14%)"/></linearGradient><linearGradient id="ca-feel_no_pain-wisp" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(282, 82%, 58%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(204, 92%, 74%)" stop-opacity="0.2"/></linearGradient>`
  ),
  dark_embrace: wrapArtSvg(
    'dark_embrace',
    'hsl(276, 56%, 18%)',
    'hsl(256, 52%, 7%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-dark_embrace-core)"/>
     <circle cx="64" cy="36" r="22" fill="none" stroke="hsl(304, 88%, 68%)" stroke-width="1.2" opacity="0.54"/>
     <rect x="50" y="20" width="16" height="24" rx="2" transform="rotate(-12 58 32)" fill="hsl(282, 54%, 26%)" stroke="hsl(316, 98%, 76%)" stroke-width="1.2"/>
     <rect x="62" y="22" width="16" height="24" rx="2" transform="rotate(14 70 34)" fill="hsl(288, 56%, 30%)" stroke="hsl(316, 98%, 78%)" stroke-width="1.2"/>
     <path d="M10 18 Q28 8 44 20 Q28 32 48 56 Q28 64 12 46 Z" fill="url(#ca-dark_embrace-wing)" stroke="hsl(298, 92%, 68%)" stroke-width="1.5"/>
     <path d="M118 18 Q100 8 84 20 Q100 32 80 56 Q100 64 116 46 Z" fill="url(#ca-dark_embrace-wing)" stroke="hsl(298, 92%, 68%)" stroke-width="1.5"/>
     <path d="M36 24 L52 34 M34 40 L50 44 M92 24 L76 34 M94 40 L78 44" stroke="hsl(314, 96%, 76%)" stroke-width="1.8" stroke-linecap="round"/>
     <polygon points="64,26 71,36 64,46 57,36" fill="hsl(320, 100%, 78%)" stroke="hsl(0, 0%, 100%)" stroke-width="1"/>
     <path d="M22 58 Q64 70 106 58" fill="none" stroke="hsl(292, 86%, 58%)" stroke-width="2" opacity="0.65"/>
     <circle cx="64" cy="36" r="3" fill="hsl(0, 0%, 100%)"/>
     <circle cx="28" cy="14" r="2" fill="hsl(312, 100%, 78%)"/>
     <circle cx="100" cy="14" r="2" fill="hsl(312, 100%, 78%)"/>
     <circle cx="44" cy="60" r="1.8" fill="hsl(294, 96%, 74%)"/>
     <circle cx="84" cy="60" r="1.8" fill="hsl(294, 96%, 74%)"/>`,
    'hsla(294, 88%, 56%, 0.28)',
    `<radialGradient id="ca-dark_embrace-core" cx="50%" cy="50%" r="46%"><stop offset="0%" stop-color="hsl(316, 100%, 74%)" stop-opacity="0.72"/><stop offset="55%" stop-color="hsl(280, 84%, 40%)" stop-opacity="0.3"/><stop offset="100%" stop-color="hsl(258, 60%, 8%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-dark_embrace-wing" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(276, 58%, 34%)"/><stop offset="60%" stop-color="hsl(262, 54%, 18%)"/><stop offset="100%" stop-color="hsl(252, 54%, 8%)"/></linearGradient>`
  ),
  second_wind: wrapArtSvg(
    'second_wind',
    'hsl(206, 42%, 20%)',
    'hsl(264, 34%, 9%)',
    `<path d="M12 62 Q40 54 64 26 Q88 6 116 14" stroke="url(#ca-second_wind-wind)" stroke-width="5.5" fill="none" stroke-linecap="round" opacity="0.72"/>
     <path d="M16 44 Q48 66 86 42 Q104 30 118 36" stroke="url(#ca-second_wind-wind)" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.64"/>
     <rect x="16" y="48" width="11" height="14" rx="1.5" transform="rotate(-24 21 55)" fill="hsl(276, 44%, 26%)" stroke="hsl(292, 82%, 66%)" stroke-width="1" opacity="0.74"/>
     <polygon points="32,56 38,50 42,58" fill="hsl(284, 72%, 56%)" opacity="0.68"/>
     <path d="M44 16 L64 10 L84 16 V38 Q84 52 64 60 Q44 52 44 38 Z" fill="rgba(0,0,0,0.45)" transform="translate(2,3)"/>
     <path d="M44 16 L64 10 L84 16 V38 Q84 52 64 60 Q44 52 44 38 Z" fill="url(#ca-second_wind-shield)" stroke="hsl(46, 98%, 74%)" stroke-width="2"/>
     <path d="M49 20 L64 15 L50 36 Z" fill="hsl(0, 0%, 100%)" opacity="0.24"/>
     <path d="M54 38 L64 24 L74 38 M56 46 L64 35 L72 46" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M24 22 Q44 10 66 12 M78 58 Q100 54 114 42" stroke="hsl(198, 100%, 82%)" stroke-width="2" fill="none" stroke-linecap="round"/>
     <polygon points="98,16 114,12 104,24" fill="hsl(48, 100%, 86%)"/>
     <circle cx="94" cy="24" r="2.4" fill="hsl(50, 100%, 90%)"/>
     <circle cx="34" cy="28" r="2" fill="hsl(198, 96%, 78%)"/>
     <circle cx="106" cy="48" r="2" fill="hsl(46, 100%, 80%)"/>`,
    'hsla(42, 96%, 60%, 0.28)',
    `<linearGradient id="ca-second_wind-wind" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(278, 72%, 52%)" stop-opacity="0.34"/><stop offset="48%" stop-color="hsl(198, 92%, 64%)" stop-opacity="0.82"/><stop offset="100%" stop-color="hsl(48, 100%, 86%)"/></linearGradient><linearGradient id="ca-second_wind-shield" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(206, 42%, 86%)"/><stop offset="52%" stop-color="hsl(214, 30%, 48%)"/><stop offset="100%" stop-color="hsl(222, 32%, 22%)"/></linearGradient>`
  ),
  entrench: wrapArtSvg(
    'entrench',
    'hsl(216, 38%, 20%)',
    'hsl(226, 46%, 9%)',
    `<circle cx="64" cy="34" r="35" fill="url(#ca-entrench-glow)"/>
     <path d="M22 58 L28 16 L46 12 L48 58 Z M106 58 L100 16 L82 12 L80 58 Z" fill="url(#ca-entrench-wall2)" stroke="hsl(208, 56%, 74%)" stroke-width="1.3"/>
     <path d="M44 58 L46 12 L64 8 L82 12 L84 58 Z" fill="url(#ca-entrench-wall2)" stroke="hsl(44, 90%, 70%)" stroke-width="1.5"/>
     <path d="M16 62 L24 30 L56 26 L64 34 L72 26 L104 30 L112 62 Z" fill="rgba(0,0,0,0.48)" transform="translate(2,2)"/>
     <path d="M16 62 L24 30 L56 26 L64 34 L72 26 L104 30 L112 62 Z" fill="url(#ca-entrench-wall1)" stroke="hsl(44, 94%, 72%)" stroke-width="1.8"/>
     <path d="M28 58 L46 32 M100 58 L82 32 M64 34 V60" stroke="hsl(42, 84%, 56%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M54 24 L64 16 L74 24 M54 32 L64 24 L74 32" fill="none" stroke="hsl(202, 100%, 86%)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M6 68 L22 56 L50 62 L64 58 L78 62 L106 56 L122 68 Z" fill="hsl(222, 26%, 14%)" stroke="hsl(214, 34%, 44%)" stroke-width="1.2"/>
     <circle cx="30" cy="36" r="1.8" fill="hsl(48, 100%, 82%)"/>
     <circle cx="48" cy="34" r="1.8" fill="hsl(48, 100%, 82%)"/>
     <circle cx="80" cy="34" r="1.8" fill="hsl(48, 100%, 82%)"/>
     <circle cx="98" cy="36" r="1.8" fill="hsl(48, 100%, 82%)"/>
     <path d="M28 31 H52 M76 31 H100" stroke="hsl(0, 0%, 100%)" stroke-width="1.3" opacity="0.68"/>
     <circle cx="64" cy="10" r="2.2" fill="hsl(48, 100%, 88%)"/>`,
    'hsla(206, 86%, 58%, 0.26)',
    `<radialGradient id="ca-entrench-glow" cx="50%" cy="46%" r="50%"><stop offset="0%" stop-color="hsl(204, 96%, 68%)" stop-opacity="0.46"/><stop offset="65%" stop-color="hsl(216, 72%, 38%)" stop-opacity="0.18"/><stop offset="100%" stop-color="hsl(226, 56%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-entrench-wall2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(214, 24%, 64%)"/><stop offset="100%" stop-color="hsl(222, 28%, 22%)"/></linearGradient><linearGradient id="ca-entrench-wall1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(210, 34%, 82%)"/><stop offset="52%" stop-color="hsl(216, 26%, 46%)"/><stop offset="100%" stop-color="hsl(224, 30%, 20%)"/></linearGradient>`
  ),
  flame_barrier: wrapArtSvg(
    'flame_barrier',
    'hsl(14, 62%, 18%)',
    'hsl(222, 48%, 9%)',
    `<ellipse cx="64" cy="40" rx="58" ry="30" fill="url(#ca-flame_barrier-halo)"/>
     <path d="M8 68 Q16 32 30 44 Q36 16 48 34 Q64 6 80 34 Q92 16 98 44 Q112 32 120 68 Z" fill="url(#ca-flame_barrier-fire)" opacity="0.46"/>
     <path d="M22 66 Q30 38 42 46 Q52 22 64 14 Q76 22 86 46 Q98 38 106 66 Z" fill="url(#ca-flame_barrier-fire)" opacity="0.72"/>
     <path d="M64 14 L90 23 V40 C90 52 78 60 64 64 C50 60 38 52 38 40 V23 Z" fill="rgba(0,0,0,0.45)" transform="translate(2 2)"/>
     <path d="M64 13 L89 22 V39 C89 51 77 59 64 63 C51 59 39 51 39 39 V22 Z" fill="url(#ca-flame_barrier-steel)" stroke="hsl(42, 94%, 68%)" stroke-width="2"/>
     <path d="M64 18 L83 25 V38 C83 47 74 53 64 57 C54 53 45 47 45 38 V25 Z" fill="hsl(220, 44%, 18%)" stroke="hsl(24, 96%, 58%)" stroke-width="1.2"/>
     <path d="M64 21 Q74 33 70 48 Q64 52 58 48 Q54 33 64 21 Z" fill="url(#ca-flame_barrier-fire)"/>
     <path d="M64 29 Q69 37 66 46 Q64 48 62 46 Q59 37 64 29 Z" fill="hsl(52, 100%, 88%)"/>
     <path d="M44 24 L62 17" stroke="hsl(48, 100%, 86%)" stroke-width="1.5" stroke-linecap="round" opacity="0.75"/>
     <path d="M26 56 Q34 26 42 36 M102 56 Q94 26 86 36" fill="none" stroke="hsl(44, 100%, 74%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M16 32 L28 36 M112 32 L100 36 M20 20 L31 26 M108 20 L97 26" stroke="hsl(38, 100%, 76%)" stroke-width="1.6" stroke-linecap="round" opacity="0.85"/>
     <circle cx="24" cy="14" r="2.2" fill="hsl(48, 100%, 80%)"/><circle cx="104" cy="15" r="2" fill="hsl(32, 100%, 70%)"/>
     <circle cx="34" cy="60" r="1.8" fill="hsl(44, 100%, 78%)"/><circle cx="95" cy="59" r="1.9" fill="hsl(24, 100%, 66%)"/>`,
    'hsla(24, 98%, 56%, 0.30)',
    `<radialGradient id="ca-flame_barrier-halo" cx="50%" cy="54%" r="54%"><stop offset="0%" stop-color="hsla(34, 100%, 62%, 0.45)"/><stop offset="55%" stop-color="hsla(12, 96%, 46%, 0.18)"/><stop offset="100%" stop-color="hsla(12, 96%, 46%, 0)"/></radialGradient><linearGradient id="ca-flame_barrier-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 34%, 44%)"/><stop offset="50%" stop-color="hsl(218, 42%, 25%)"/><stop offset="100%" stop-color="hsl(224, 46%, 14%)"/></linearGradient><linearGradient id="ca-flame_barrier-fire" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(6, 94%, 48%)"/><stop offset="55%" stop-color="hsl(26, 100%, 58%)"/><stop offset="100%" stop-color="hsl(50, 100%, 82%)"/></linearGradient>`
  ),
  shockwave: wrapArtSvg(
    'shockwave',
    'hsl(22, 64%, 19%)',
    'hsl(352, 54%, 8%)',
    `<path d="M0 54 L26 48 L64 56 L102 48 L128 54 V72 H0 Z" fill="hsl(10, 44%, 11%)"/>
     <ellipse cx="64" cy="39" rx="58" ry="28" fill="url(#ca-shockwave-core)"/>
     <ellipse cx="64" cy="40" rx="54" ry="22" fill="none" stroke="hsla(36, 98%, 68%, 0.55)" stroke-width="1.8" stroke-dasharray="12 6"/>
     <ellipse cx="64" cy="40" rx="39" ry="16" fill="none" stroke="hsl(18, 96%, 58%)" stroke-width="2.4" stroke-dasharray="16 5"/>
     <ellipse cx="64" cy="40" rx="24" ry="10.5" fill="none" stroke="hsl(44, 100%, 74%)" stroke-width="2.6"/>
     <path d="M56 8 H72 L76 32 L64 42 L52 32 Z" fill="url(#ca-shockwave-iron)" stroke="hsl(42, 86%, 72%)" stroke-width="1.5"/>
     <path d="M59 12 H69 L71 30 L64 36 L57 30 Z" fill="hsl(26, 26%, 46%)" opacity="0.75"/>
     <polygon points="64,30 70,39 82,41 70,45 64,55 58,45 46,41 58,39" fill="hsl(50, 100%, 84%)" stroke="hsl(24, 100%, 56%)" stroke-width="1.2"/>
     <path d="M16 58 L38 46 L48 52 M112 58 L90 46 L80 52 M42 66 L58 54 M86 66 L70 54" fill="none" stroke="hsl(32, 100%, 66%)" stroke-width="1.8" stroke-linecap="round"/>
     <polygon points="22,26 30,22 28,31" fill="hsl(24, 34%, 44%)" stroke="hsl(38, 92%, 68%)" stroke-width="0.9"/>
     <polygon points="106,24 98,29 108,33" fill="hsl(24, 34%, 44%)" stroke="hsl(38, 92%, 68%)" stroke-width="0.9"/>
     <polygon points="32,60 40,56 37,65" fill="hsl(18, 42%, 34%)" stroke="hsl(34, 96%, 64%)" stroke-width="0.9"/>
     <polygon points="94,58 102,63 90,65" fill="hsl(18, 42%, 34%)" stroke="hsl(34, 96%, 64%)" stroke-width="0.9"/>
     <circle cx="18" cy="40" r="2.2" fill="hsl(48, 100%, 80%)"/><circle cx="110" cy="40" r="2.2" fill="hsl(48, 100%, 80%)"/>`,
    'hsla(28, 98%, 58%, 0.30)',
    `<radialGradient id="ca-shockwave-core" cx="50%" cy="52%" r="48%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="30%" stop-color="hsl(34, 100%, 62%)"/><stop offset="70%" stop-color="hsla(12, 94%, 48%, 0.4)"/><stop offset="100%" stop-color="hsla(12, 94%, 48%, 0)"/></radialGradient><linearGradient id="ca-shockwave-iron" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(30, 24%, 64%)"/><stop offset="55%" stop-color="hsl(20, 22%, 34%)"/><stop offset="100%" stop-color="hsl(14, 30%, 16%)"/></linearGradient>`
  ),
  ghostly_armor: wrapArtSvg(
    'ghostly_armor',
    'hsl(196, 54%, 17%)',
    'hsl(236, 52%, 8%)',
    `<ellipse cx="64" cy="36" rx="52" ry="30" fill="url(#ca-ghostly_armor-aura)"/>
     <path d="M12 62 Q34 46 52 58 Q74 68 94 52 Q108 42 120 56" fill="none" stroke="hsla(188, 96%, 76%, 0.35)" stroke-width="4" stroke-linecap="round"/>
     <path d="M18 20 Q42 10 64 16 Q86 10 110 20" fill="none" stroke="hsla(192, 92%, 78%, 0.28)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M36 22 Q24 24 22 36 Q32 38 40 34 Z" fill="url(#ca-ghostly_armor-plate)" stroke="url(#ca-ghostly_armor-rim)" stroke-width="1.4"/>
     <path d="M92 22 Q104 24 106 36 Q96 38 88 34 Z" fill="url(#ca-ghostly_armor-plate)" stroke="url(#ca-ghostly_armor-rim)" stroke-width="1.4"/>
     <path d="M40 16 Q64 9 88 16 L84 52 Q74 62 64 64 Q54 62 44 52 Z" fill="url(#ca-ghostly_armor-plate)" stroke="url(#ca-ghostly_armor-rim)" stroke-width="1.8" stroke-dasharray="9 2.5"/>
     <path d="M52 14 Q64 23 76 14" fill="none" stroke="hsl(186, 100%, 90%)" stroke-width="1.6"/>
     <path d="M47 28 L64 38 L81 28 M49 38 L64 47 L79 38 M52 48 L64 55 L76 48" fill="none" stroke="hsla(186, 100%, 88%, 0.85)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="64,21 69,29 64,35 59,29" fill="hsl(184, 100%, 92%)" opacity="0.9"/>
     <path d="M48 56 Q44 64 38 66 M64 62 V68 M80 56 Q84 64 90 66" fill="none" stroke="hsl(188, 98%, 78%)" stroke-width="1.6" stroke-linecap="round" opacity="0.72"/>
     <circle cx="28" cy="50" r="2.2" fill="hsl(186, 100%, 86%)" opacity="0.8"/><circle cx="100" cy="48" r="2.4" fill="hsl(186, 100%, 86%)" opacity="0.75"/>
     <circle cx="34" cy="14" r="1.6" fill="hsl(190, 100%, 92%)"/><circle cx="94" cy="13" r="1.8" fill="hsl(190, 100%, 92%)"/>`,
    'hsla(188, 96%, 64%, 0.28)',
    `<radialGradient id="ca-ghostly_armor-aura" cx="50%" cy="48%" r="50%"><stop offset="0%" stop-color="hsla(186, 100%, 76%, 0.38)"/><stop offset="65%" stop-color="hsla(202, 90%, 54%, 0.14)"/><stop offset="100%" stop-color="hsla(216, 80%, 30%, 0)"/></radialGradient><linearGradient id="ca-ghostly_armor-plate" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsla(186, 98%, 84%, 0.56)"/><stop offset="55%" stop-color="hsla(196, 86%, 54%, 0.34)"/><stop offset="100%" stop-color="hsla(224, 72%, 34%, 0.12)"/></linearGradient><linearGradient id="ca-ghostly_armor-rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(184, 100%, 92%)"/><stop offset="100%" stop-color="hsl(204, 92%, 64%)"/></linearGradient>`
  ),
  carnage: wrapArtSvg(
    'carnage',
    'hsl(354, 74%, 19%)',
    'hsl(6, 62%, 7%)',
    `<ellipse cx="72" cy="34" rx="54" ry="30" fill="url(#ca-carnage-burst)"/>
     <path d="M8 62 Q48 20 118 10" fill="none" stroke="url(#ca-carnage-slash)" stroke-width="7" stroke-linecap="round" opacity="0.65"/>
     <path d="M18 66 Q62 34 122 24" fill="none" stroke="hsl(354, 96%, 54%)" stroke-width="3" stroke-linecap="round" opacity="0.72"/>
     <path d="M26 56 L84 10 L102 12 L94 26 L44 63 Z" fill="rgba(0,0,0,0.48)" transform="translate(2 2)"/>
     <path d="M26 55 L84 9 L101 11 L93 25 L43 62 L39 54 L45 48 L35 46 Z" fill="url(#ca-carnage-blade)" stroke="hsl(44, 96%, 76%)" stroke-width="1.5"/>
     <path d="M40 50 L88 15" stroke="hsl(48, 100%, 88%)" stroke-width="1.8" stroke-linecap="round" opacity="0.88"/>
     <path d="M54 38 L60 30 L64 36 L72 26 L75 31" fill="none" stroke="hsl(350, 88%, 18%)" stroke-width="1.6" stroke-linejoin="round"/>
     <path d="M18 48 L44 66 L38 69 L14 53 Z" fill="hsl(40, 86%, 58%)" stroke="hsl(14, 64%, 22%)" stroke-width="1.2"/>
     <path d="M14 63 L26 55" stroke="hsl(354, 72%, 34%)" stroke-width="4.4" stroke-linecap="round"/>
     <path d="M74 42 L114 26 M80 54 L118 46" stroke="hsl(356, 98%, 62%)" stroke-width="2.6" stroke-linecap="round"/>
     <polygon points="104,18 118,16 108,27" fill="hsl(356, 98%, 62%)"/><polygon points="94,56 106,52 99,64" fill="hsl(354, 94%, 52%)"/>
     <circle cx="102" cy="11" r="3" fill="hsl(50, 100%, 88%)"/><circle cx="88" cy="36" r="2.2" fill="hsl(44, 100%, 76%)"/>`,
    'hsla(356, 98%, 54%, 0.32)',
    `<linearGradient id="ca-carnage-blade" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(352, 74%, 30%)"/><stop offset="48%" stop-color="hsl(356, 86%, 50%)"/><stop offset="85%" stop-color="hsl(16, 96%, 68%)"/><stop offset="100%" stop-color="hsl(48, 100%, 88%)"/></linearGradient><linearGradient id="ca-carnage-slash" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsla(352, 96%, 48%, 0.1)"/><stop offset="55%" stop-color="hsla(358, 100%, 58%, 0.85)"/><stop offset="100%" stop-color="hsl(44, 100%, 80%)"/></linearGradient><radialGradient id="ca-carnage-burst" cx="62%" cy="38%" r="48%"><stop offset="0%" stop-color="hsla(356, 100%, 56%, 0.44)"/><stop offset="100%" stop-color="hsla(356, 100%, 56%, 0)"/></radialGradient>`
  ),
  hemokinesis: wrapArtSvg(
    'hemokinesis',
    'hsl(352, 74%, 18%)',
    'hsl(338, 62%, 7%)',
    `<circle cx="38" cy="38" r="24" fill="none" stroke="hsla(354, 92%, 56%, 0.32)" stroke-width="1.6" stroke-dasharray="6 4"/>
     <circle cx="38" cy="38" r="15" fill="hsla(354, 96%, 46%, 0.24)" stroke="hsla(14, 96%, 66%, 0.55)" stroke-width="1.2"/>
     <path d="M12 52 Q30 14 58 34 Q82 54 112 18" fill="none" stroke="hsl(344, 88%, 22%)" stroke-width="9" stroke-linecap="round" opacity="0.6"/>
     <path d="M12 50 Q30 12 58 32 Q82 52 110 18" fill="none" stroke="url(#ca-hemokinesis-whip)" stroke-width="5.5" stroke-linecap="round"/>
     <path d="M16 48 Q32 15 58 31 Q82 48 108 19" fill="none" stroke="hsl(18, 100%, 76%)" stroke-width="1.6" stroke-linecap="round" opacity="0.9"/>
     <polygon points="96,15 119,12 106,31 105,21" fill="url(#ca-hemokinesis-whip)" stroke="hsl(44, 100%, 78%)" stroke-width="1.2"/>
     <circle cx="38" cy="38" r="10.5" fill="url(#ca-hemokinesis-orb)" stroke="hsl(42, 96%, 72%)" stroke-width="1.6"/>
     <path d="M34 33 Q38 29 42 33" fill="none" stroke="hsl(24, 100%, 90%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M64 12 Q70 20 64 26 Q58 20 64 12 Z" fill="hsl(354, 94%, 54%)" stroke="hsl(14, 100%, 74%)" stroke-width="0.9"/>
     <path d="M84 48 Q90 56 84 63 Q78 56 84 48 Z" fill="hsl(354, 92%, 48%)" stroke="hsl(14, 100%, 72%)" stroke-width="0.9"/>
     <path d="M22 14 Q26 20 22 25 Q18 20 22 14 Z" fill="hsl(354, 88%, 50%)" opacity="0.85"/>
     <circle cx="116" cy="14" r="2.2" fill="hsl(48, 100%, 84%)"/><circle cx="62" cy="54" r="1.8" fill="hsl(14, 100%, 72%)"/>`,
    'hsla(354, 98%, 54%, 0.30)',
    `<radialGradient id="ca-hemokinesis-orb" cx="38%" cy="35%" r="60%"><stop offset="0%" stop-color="hsl(12, 100%, 78%)"/><stop offset="45%" stop-color="hsl(354, 94%, 50%)"/><stop offset="100%" stop-color="hsl(344, 88%, 22%)"/></radialGradient><linearGradient id="ca-hemokinesis-whip" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(346, 86%, 34%)"/><stop offset="55%" stop-color="hsl(354, 96%, 54%)"/><stop offset="100%" stop-color="hsl(22, 100%, 74%)"/></linearGradient>`
  ),
  dropkick: wrapArtSvg(
    'dropkick',
    'hsl(18, 66%, 20%)',
    'hsl(352, 54%, 8%)',
    `<path d="M6 12 L94 46 M10 26 L86 52 M18 6 L98 36" stroke="url(#ca-dropkick-trail)" stroke-width="3.6" stroke-linecap="round" opacity="0.65"/>
     <path d="M6 38 L78 58" stroke="hsl(10, 96%, 56%)" stroke-width="2" stroke-linecap="round" opacity="0.55"/>
     <ellipse cx="94" cy="48" rx="22" ry="16" fill="hsla(34, 100%, 60%, 0.28)"/>
     <path d="M20 15 L72 34 L65 50 L14 31 Z" fill="url(#ca-dropkick-boot)" stroke="hsl(42, 92%, 70%)" stroke-width="1.5"/>
     <path d="M66 31 L88 39 L84 56 L58 51 Z" fill="url(#ca-dropkick-boot)" stroke="hsl(44, 96%, 76%)" stroke-width="1.6"/>
     <path d="M26 20 L68 36" stroke="hsl(48, 100%, 88%)" stroke-width="1.6" stroke-linecap="round" opacity="0.8"/>
     <path d="M44 25 L39 39 M58 30 L53 45" stroke="hsl(16, 48%, 18%)" stroke-width="1.8"/>
     <polygon points="94,24 98,40 116,42 101,49 109,64 93,54 80,62 87,47 76,38 91,40" fill="hsl(48, 100%, 80%)" stroke="hsl(16, 98%, 54%)" stroke-width="1.4"/>
     <path d="M84 22 Q104 34 94 64" fill="none" stroke="hsl(44, 100%, 76%)" stroke-width="2.2" stroke-linecap="round" opacity="0.85"/>
     <path d="M104 16 L118 22 M108 58 L120 62" stroke="hsl(36, 100%, 72%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="112" cy="30" r="2.2" fill="hsl(52, 100%, 88%)"/><circle cx="76" cy="61" r="2" fill="hsl(24, 100%, 68%)"/>`,
    'hsla(28, 98%, 56%, 0.30)',
    `<linearGradient id="ca-dropkick-boot" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(34, 28%, 74%)"/><stop offset="50%" stop-color="hsl(20, 28%, 40%)"/><stop offset="100%" stop-color="hsl(12, 42%, 18%)"/></linearGradient><linearGradient id="ca-dropkick-trail" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(36, 100%, 66%, 0.08)"/><stop offset="65%" stop-color="hsla(24, 100%, 58%, 0.78)"/><stop offset="100%" stop-color="hsl(50, 100%, 84%)"/></linearGradient>`
  ),
  spot_weakness: wrapArtSvg(
    'spot_weakness',
    'hsl(32, 58%, 18%)',
    'hsl(352, 50%, 8%)',
    `<path d="M24 14 Q64 6 104 14 L98 62 Q64 68 30 62 Z" fill="url(#ca-spot_weakness-armor)" stroke="hsl(28, 30%, 42%)" stroke-width="1.4" opacity="0.72"/>
     <path d="M36 18 L52 36 L44 58 M92 18 L76 36 L84 58" fill="none" stroke="hsl(14, 48%, 14%)" stroke-width="2"/>
     <circle cx="64" cy="36" r="25" fill="url(#ca-spot_weakness-core)"/>
     <path d="M44 24 L64 36 L86 22 M46 50 L64 36 L84 54" fill="none" stroke="hsl(10, 98%, 58%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="64" cy="36" r="22" fill="none" stroke="hsl(44, 96%, 68%)" stroke-width="2" stroke-dasharray="16 6"/>
     <circle cx="64" cy="36" r="13" fill="none" stroke="hsl(36, 100%, 72%)" stroke-width="1.5"/>
     <path d="M64 7 V21 M64 51 V65 M32 36 H49 M79 36 H96" stroke="hsl(48, 100%, 78%)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="64,27 71,36 64,45 57,36" fill="hsl(4, 98%, 56%)" stroke="hsl(50, 100%, 84%)" stroke-width="1.4"/>
     <circle cx="64" cy="36" r="3" fill="hsl(54, 100%, 94%)"/>
     <path d="M18 36 Q64 14 110 36 Q64 58 18 36 Z" fill="none" stroke="hsla(46, 100%, 74%, 0.45)" stroke-width="1.3"/>
     <circle cx="24" cy="20" r="1.8" fill="hsl(46, 100%, 76%)"/><circle cx="104" cy="52" r="2" fill="hsl(16, 100%, 66%)"/>`,
    'hsla(14, 96%, 54%, 0.28)',
    `<radialGradient id="ca-spot_weakness-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="40%" stop-color="hsl(6, 98%, 56%)"/><stop offset="100%" stop-color="hsla(354, 92%, 40%, 0)"/></radialGradient><linearGradient id="ca-spot_weakness-armor" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(22, 22%, 34%)"/><stop offset="100%" stop-color="hsl(220, 22%, 14%)"/></linearGradient>`
  ),
  disarm: wrapArtSvg(
    'disarm',
    'hsl(24, 52%, 18%)',
    'hsl(222, 46%, 9%)',
    `<circle cx="64" cy="36" r="26" fill="hsla(24, 100%, 56%, 0.2)"/>
     <path d="M52 7 L76 65" stroke="url(#ca-disarm-cut)" stroke-width="4.2" stroke-linecap="round"/>
     <path d="M46 10 L70 62" stroke="hsl(52, 100%, 88%)" stroke-width="1.4" stroke-linecap="round" opacity="0.8"/>
     <polygon points="18,48 56,33 53,42 58,47 24,59" fill="url(#ca-disarm-steel)" stroke="hsl(218, 28%, 22%)" stroke-width="1.4"/>
     <path d="M22 52 L53 40" stroke="hsl(48, 100%, 92%)" stroke-width="1.2" opacity="0.8"/>
     <rect x="14" y="45" width="6" height="19" rx="2" transform="rotate(-22 17 54)" fill="hsl(42, 86%, 60%)" stroke="hsl(24, 52%, 22%)" stroke-width="1.1"/>
     <line x1="9" y1="57" x2="17" y2="54" stroke="hsl(14, 56%, 32%)" stroke-width="3.6" stroke-linecap="round"/>
     <polygon points="71,24 108,11 114,17 104,24 75,35 76,29" fill="url(#ca-disarm-steel)" stroke="hsl(218, 28%, 22%)" stroke-width="1.4"/>
     <path d="M76 28 L106 16" stroke="hsl(48, 100%, 94%)" stroke-width="1.3" opacity="0.85"/>
     <path d="M56 33 L53 42 L58 47 M71 24 L76 29 L75 35" fill="none" stroke="hsl(28, 100%, 66%)" stroke-width="1.8" stroke-linecap="round"/>
     <polygon points="62,20 67,15 68,23" fill="hsl(40, 32%, 82%)"/><polygon points="56,52 63,55 58,61" fill="hsl(40, 32%, 82%)"/>
     <path d="M40 20 L52 28 M84 44 L98 52 M78 14 L86 9" stroke="hsl(44, 100%, 76%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="64" cy="36" r="3.5" fill="hsl(52, 100%, 92%)"/><circle cx="48" cy="18" r="1.8" fill="hsl(32, 100%, 70%)"/>`,
    'hsla(24, 96%, 56%, 0.28)',
    `<linearGradient id="ca-disarm-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(40, 28%, 90%)"/><stop offset="55%" stop-color="hsl(214, 20%, 62%)"/><stop offset="100%" stop-color="hsl(220, 26%, 34%)"/></linearGradient><linearGradient id="ca-disarm-cut" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 88%)"/><stop offset="50%" stop-color="hsl(24, 100%, 60%)"/><stop offset="100%" stop-color="hsl(4, 96%, 48%)"/></linearGradient>`
  ),
  evolve: wrapArtSvg(
    'evolve',
    'hsl(286, 56%, 18%)',
    'hsl(10, 52%, 8%)',
    `<circle cx="64" cy="36" r="28" fill="url(#ca-evolve-core)"/>
     <path d="M64 36 Q42 8 14 16 Q22 36 44 40 Q24 52 18 62 Q44 58 64 44 Z" fill="url(#ca-evolve-wing)" opacity="0.58" stroke="hsl(300, 92%, 72%)" stroke-width="1.2"/>
     <path d="M64 36 Q86 8 114 16 Q106 36 84 40 Q104 52 110 62 Q84 58 64 44 Z" fill="url(#ca-evolve-wing)" opacity="0.58" stroke="hsl(300, 92%, 72%)" stroke-width="1.2"/>
     <path d="M18 54 Q40 12 64 36 Q88 60 110 18" fill="none" stroke="hsl(296, 96%, 72%)" stroke-width="3" stroke-linecap="round"/>
     <path d="M18 18 Q40 60 64 36 Q88 12 110 54" fill="none" stroke="hsl(44, 100%, 72%)" stroke-width="3" stroke-linecap="round"/>
     <path d="M34 36 H46 M82 36 H94" stroke="hsla(48, 100%, 82%, 0.72)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="64,12 75,36 64,60 53,36" fill="hsl(286, 62%, 24%)" stroke="hsl(46, 100%, 78%)" stroke-width="1.8"/>
     <polygon points="64,20 70,36 64,52 58,36" fill="hsl(38, 100%, 72%)"/>
     <circle cx="64" cy="36" r="4.5" fill="hsl(54, 100%, 94%)"/>
     <circle cx="38" cy="36" r="3" fill="hsl(46, 100%, 78%)"/><circle cx="90" cy="36" r="3" fill="hsl(298, 98%, 78%)"/>
     <circle cx="24" cy="12" r="1.8" fill="hsl(48, 100%, 82%)"/><circle cx="104" cy="60" r="1.8" fill="hsl(298, 96%, 76%)"/>`,
    'hsla(294, 92%, 60%, 0.28)',
    `<radialGradient id="ca-evolve-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="45%" stop-color="hsl(296, 94%, 64%)"/><stop offset="100%" stop-color="hsla(286, 86%, 34%, 0)"/></radialGradient><linearGradient id="ca-evolve-wing" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(286, 68%, 34%)"/><stop offset="60%" stop-color="hsl(312, 86%, 56%)"/><stop offset="100%" stop-color="hsl(44, 100%, 74%)"/></linearGradient>`
  ),
  fire_breathing: wrapArtSvg(
    'fire_breathing',
    'hsl(10, 74%, 19%)',
    'hsl(350, 62%, 7%)',
    `<path d="M34 36 L124 6 Q110 24 126 36 Q110 48 124 66 Z" fill="url(#ca-fire_breathing-jet)" opacity="0.82"/>
     <path d="M36 36 L112 16 Q98 30 114 38 Q98 46 110 56 Z" fill="hsl(34, 100%, 60%)" opacity="0.88"/>
     <path d="M36 36 L94 26 Q84 36 94 46 Z" fill="hsl(50, 100%, 84%)"/>
     <path d="M10 58 Q12 22 26 18 L40 26 L34 35 L42 42 L30 56 Z" fill="url(#ca-fire_breathing-helm)" stroke="hsl(40, 88%, 64%)" stroke-width="1.5"/>
     <path d="M22 18 Q14 6 8 12 Q14 22 24 24 Z" fill="hsl(38, 60%, 74%)" stroke="hsl(22, 44%, 26%)" stroke-width="1.1"/>
     <path d="M26 28 L33 30 L27 33 Z" fill="hsl(52, 100%, 86%)"/>
     <path d="M46 28 Q72 18 100 22 M48 44 Q74 52 104 48" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
     <path d="M60 16 Q76 8 92 16 M64 56 Q80 64 98 56" fill="none" stroke="hsl(20, 100%, 62%)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="96" cy="14" r="2.4" fill="hsl(48, 100%, 82%)"/><circle cx="112" cy="28" r="2" fill="hsl(52, 100%, 90%)"/>
     <circle cx="104" cy="54" r="2.3" fill="hsl(32, 100%, 68%)"/><circle cx="78" cy="36" r="2.6" fill="hsl(54, 100%, 94%)"/>`,
    'hsla(24, 100%, 56%, 0.32)',
    `<linearGradient id="ca-fire_breathing-jet" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="35%" stop-color="hsl(36, 100%, 62%)"/><stop offset="75%" stop-color="hsl(14, 98%, 50%)"/><stop offset="100%" stop-color="hsla(2, 92%, 38%, 0.15)"/></linearGradient><linearGradient id="ca-fire_breathing-helm" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(22, 34%, 44%)"/><stop offset="55%" stop-color="hsl(356, 52%, 24%)"/><stop offset="100%" stop-color="hsl(350, 56%, 11%)"/></linearGradient>`
  ),
  rupture: wrapArtSvg(
    'rupture',
    'hsl(352, 72%, 18%)',
    'hsl(10, 58%, 7%)',
    `<path d="M8 12 H120 V62 H8 Z" fill="url(#ca-rupture-plate)" opacity="0.55"/>
     <path d="M12 58 L38 30 L56 42 L84 14 L116 44" fill="none" stroke="hsla(6, 100%, 54%, 0.45)" stroke-width="11" stroke-linejoin="round" stroke-linecap="round"/>
     <path d="M14 57 L38 30 L56 42 L84 14 L114 43" fill="none" stroke="url(#ca-rupture-magma)" stroke-width="4.4" stroke-linejoin="round" stroke-linecap="round"/>
     <path d="M16 56 L38 30 L56 42 L84 14 L112 42" fill="none" stroke="hsl(52, 100%, 90%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M56 42 L52 64 M84 14 L92 38 L106 60 M38 30 L28 12" fill="none" stroke="hsl(18, 100%, 62%)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
     <polygon points="56,42 66,18 70,38 58,46" fill="hsl(356, 98%, 58%)" stroke="hsl(48, 100%, 80%)" stroke-width="1.1"/>
     <polygon points="38,30 44,12 50,28" fill="hsl(14, 100%, 60%)" opacity="0.9"/>
     <polygon points="84,14 96,7 90,22" fill="hsl(46, 100%, 78%)"/>
     <polygon points="28,44 36,48 30,54" fill="hsl(354, 38%, 26%)" stroke="hsl(12, 92%, 56%)" stroke-width="0.9"/>
     <polygon points="74,44 82,40 80,50" fill="hsl(354, 38%, 26%)" stroke="hsl(12, 92%, 56%)" stroke-width="0.9"/>
     <circle cx="48" cy="18" r="2.2" fill="hsl(48, 100%, 84%)"/><circle cx="100" cy="24" r="2" fill="hsl(20, 100%, 66%)"/>
     <circle cx="66" cy="58" r="2" fill="hsl(356, 98%, 62%)"/>`,
    'hsla(4, 98%, 54%, 0.30)',
    `<linearGradient id="ca-rupture-magma" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(354, 96%, 48%)"/><stop offset="50%" stop-color="hsl(24, 100%, 62%)"/><stop offset="100%" stop-color="hsl(52, 100%, 88%)"/></linearGradient><linearGradient id="ca-rupture-plate" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(354, 34%, 22%)"/><stop offset="100%" stop-color="hsl(350, 44%, 10%)"/></linearGradient>`
  ),
  headbutt: wrapArtSvg(
    'headbutt',
    'hsl(18, 58%, 19%)',
    'hsl(220, 42%, 9%)',
    `<circle cx="64" cy="18" r="32" fill="url(#ca-headbutt-clash)"/>
     <path d="M38 22 Q18 10 12 24 Q22 36 40 36 Z" fill="hsl(38, 48%, 74%)" stroke="hsl(24, 34%, 24%)" stroke-width="1.3"/>
     <path d="M90 22 Q110 10 116 24 Q106 36 88 36 Z" fill="hsl(38, 48%, 74%)" stroke="hsl(24, 34%, 24%)" stroke-width="1.3"/>
     <path d="M36 58 Q36 18 64 16 Q92 18 92 58 L82 64 H46 Z" fill="rgba(0,0,0,0.45)" transform="translate(2 2)"/>
     <path d="M36 57 Q36 17 64 15 Q92 17 92 57 L82 63 H46 Z" fill="url(#ca-headbutt-helm)" stroke="hsl(42, 88%, 70%)" stroke-width="1.8"/>
     <path d="M44 36 H84 V43 H68 V58 H60 V43 H44 Z" fill="hsl(220, 34%, 11%)" stroke="hsl(40, 74%, 56%)" stroke-width="1.1"/>
     <path d="M48 39 H57 M71 39 H80" stroke="hsl(36, 100%, 68%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M48 24 Q64 19 80 24" fill="none" stroke="hsl(48, 100%, 90%)" stroke-width="1.6" stroke-linecap="round" opacity="0.82"/>
     <polygon points="64,6 68,14 78,13 70,20 75,27 64,22 53,27 58,20 50,13 60,14" fill="hsl(50, 100%, 84%)" stroke="hsl(20, 96%, 54%)" stroke-width="1.1"/>
     <path d="M32 10 L46 16 M96 10 L82 16 M22 44 L33 42 M106 44 L95 42" stroke="hsl(46, 100%, 78%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="26" cy="14" r="2" fill="hsl(48, 100%, 84%)"/><circle cx="102" cy="14" r="2" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(36, 98%, 60%, 0.28)',
    `<linearGradient id="ca-headbutt-helm" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(36, 26%, 78%)"/><stop offset="48%" stop-color="hsl(26, 22%, 44%)"/><stop offset="100%" stop-color="hsl(220, 26%, 18%)"/></linearGradient><radialGradient id="ca-headbutt-clash" cx="50%" cy="22%" r="44%"><stop offset="0%" stop-color="hsla(50, 100%, 88%, 0.8)"/><stop offset="45%" stop-color="hsla(28, 100%, 58%, 0.3)"/><stop offset="100%" stop-color="hsla(28, 100%, 58%, 0)"/></radialGradient>`
  ),
  combust: wrapArtSvg(
    'combust',
    'hsl(12, 74%, 20%)',
    'hsl(352, 62%, 8%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-combust-sun)"/>
     <circle cx="64" cy="36" r="29" fill="none" stroke="hsla(42, 100%, 72%, 0.42)" stroke-width="1.6" stroke-dasharray="9 5"/>
     <path d="M64 6 L72 22 L92 14 L82 32 L106 36 L82 44 L92 60 L72 50 L64 66 L56 50 L36 60 L46 44 L22 36 L46 32 L36 14 L56 22 Z" fill="url(#ca-combust-flare)" stroke="hsl(48, 100%, 82%)" stroke-width="1.3"/>
     <path d="M46 58 Q48 26 64 20 Q80 26 82 58 Q72 52 64 56 Q56 52 46 58 Z" fill="hsl(354, 58%, 18%)" stroke="hsl(36, 98%, 68%)" stroke-width="1.4" opacity="0.78"/>
     <circle cx="64" cy="36" r="12" fill="hsl(24, 100%, 58%)" stroke="hsl(50, 100%, 86%)" stroke-width="1.8"/>
     <circle cx="64" cy="36" r="6.5" fill="hsl(54, 100%, 94%)"/>
     <path d="M48 36 L64 36 L80 36 M54 27 L64 36 L74 27 M54 45 L64 36 L74 45" stroke="hsl(50, 100%, 86%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M16 18 Q24 28 18 42 M112 18 Q104 28 110 42" fill="none" stroke="hsl(26, 100%, 64%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="22" cy="14" r="2.2" fill="hsl(48, 100%, 82%)"/><circle cx="106" cy="14" r="2.2" fill="hsl(48, 100%, 82%)"/>
     <circle cx="24" cy="58" r="2" fill="hsl(18, 100%, 64%)"/><circle cx="104" cy="58" r="2" fill="hsl(18, 100%, 64%)"/>`,
    'hsla(24, 100%, 58%, 0.34)',
    `<radialGradient id="ca-combust-sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="32%" stop-color="hsl(42, 100%, 68%)"/><stop offset="68%" stop-color="hsl(14, 98%, 52%)"/><stop offset="100%" stop-color="hsla(354, 92%, 38%, 0)"/></radialGradient><linearGradient id="ca-combust-flare" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(4, 96%, 48%)"/><stop offset="55%" stop-color="hsl(28, 100%, 60%)"/><stop offset="100%" stop-color="hsl(52, 100%, 86%)"/></linearGradient>`
  ),
  intimidate: wrapArtSvg(
    'intimidate',
    'hsl(352, 66%, 18%)',
    'hsl(272, 48%, 8%)',
    `<ellipse cx="64" cy="34" rx="56" ry="30" fill="url(#ca-intimidate-glow)"/>
     <path d="M16 56 Q64 38 112 56" fill="none" stroke="hsla(8, 98%, 58%, 0.45)" stroke-width="3.6" stroke-linecap="round"/>
     <path d="M10 64 Q64 46 118 64" fill="none" stroke="hsla(352, 92%, 52%, 0.65)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M36 20 Q20 6 12 18 Q22 30 38 30 Z" fill="hsl(36, 42%, 68%)" stroke="hsl(352, 52%, 22%)" stroke-width="1.2"/>
     <path d="M92 20 Q108 6 116 18 Q106 30 90 30 Z" fill="hsl(36, 42%, 68%)" stroke="hsl(352, 52%, 22%)" stroke-width="1.2"/>
     <path d="M34 16 Q64 8 94 16 L88 54 L64 62 L40 54 Z" fill="url(#ca-intimidate-mask)" stroke="hsl(14, 88%, 54%)" stroke-width="1.6"/>
     <path d="M38 24 L59 33 L42 38 Z" fill="hsl(48, 100%, 76%)" stroke="hsl(16, 100%, 54%)" stroke-width="1"/>
     <path d="M90 24 L69 33 L86 38 Z" fill="hsl(48, 100%, 76%)" stroke="hsl(16, 100%, 54%)" stroke-width="1"/>
     <path d="M44 28 L55 33 M84 28 L73 33" stroke="hsl(54, 100%, 96%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M46 47 L52 43 L58 48 L64 42 L70 48 L76 43 L82 47" fill="none" stroke="hsl(42, 74%, 76%)" stroke-width="1.8" stroke-linejoin="round"/>
     <path d="M22 38 L32 34 M106 38 L96 34 M18 46 L28 44 M110 46 L100 44" stroke="hsl(12, 98%, 62%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="24" cy="24" r="1.8" fill="hsl(48, 100%, 82%)"/><circle cx="104" cy="24" r="1.8" fill="hsl(48, 100%, 82%)"/>`,
    'hsla(6, 96%, 54%, 0.28)',
    `<linearGradient id="ca-intimidate-mask" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(352, 54%, 30%)"/><stop offset="60%" stop-color="hsl(344, 52%, 17%)"/><stop offset="100%" stop-color="hsl(276, 48%, 10%)"/></linearGradient><radialGradient id="ca-intimidate-glow" cx="50%" cy="42%" r="52%"><stop offset="0%" stop-color="hsla(8, 100%, 56%, 0.36)"/><stop offset="100%" stop-color="hsla(276, 60%, 20%, 0)"/></radialGradient>`
  ),
  blood_for_blood: wrapArtSvg(
    'blood_for_blood',
    'hsl(352, 74%, 18%)',
    'hsl(8, 58%, 7%)',
    `<ellipse cx="64" cy="38" rx="52" ry="26" fill="hsla(354, 96%, 44%, 0.18)"/>
     <path d="M24 22 Q64 6 104 22" fill="none" stroke="url(#ca-blood_for_blood-arc)" stroke-width="2.4" stroke-dasharray="7 3"/>
     <path d="M24 54 Q64 68 104 54" fill="none" stroke="url(#ca-blood_for_blood-arc)" stroke-width="2.4"/>
     <path d="M34 15 Q48 34 34 54 Q20 34 34 15 Z" fill="url(#ca-blood_for_blood-drop)" stroke="hsl(42, 92%, 72%)" stroke-width="1.6"/>
     <path d="M30 29 Q32 23 36 21" fill="none" stroke="hsl(24, 100%, 88%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M94 11 Q112 34 94 59 Q76 34 94 11 Z" fill="url(#ca-blood_for_blood-drop)" stroke="hsl(46, 98%, 76%)" stroke-width="1.8"/>
     <path d="M88 28 Q91 20 96 18" fill="none" stroke="hsl(24, 100%, 90%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M50 36 H74 M67 28 L76 36 L67 44" fill="none" stroke="hsl(48, 100%, 80%)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
     <polygon points="62,18 66,26 62,32 58,26" fill="hsl(46, 100%, 80%)"/>
     <polygon points="62,42 66,48 62,56 58,48" fill="hsl(354, 96%, 56%)"/>
     <circle cx="18" cy="36" r="2.2" fill="hsl(354, 96%, 60%)"/><circle cx="112" cy="36" r="2.4" fill="hsl(46, 100%, 82%)"/>`,
    'hsla(354, 98%, 52%, 0.30)',
    `<linearGradient id="ca-blood_for_blood-drop" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(12, 100%, 72%)"/><stop offset="45%" stop-color="hsl(354, 94%, 50%)"/><stop offset="100%" stop-color="hsl(344, 88%, 22%)"/></linearGradient><linearGradient id="ca-blood_for_blood-arc" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(354, 96%, 54%)"/><stop offset="50%" stop-color="hsl(44, 100%, 76%)"/><stop offset="100%" stop-color="hsl(356, 98%, 58%)"/></linearGradient>`
  ),
  rage: wrapArtSvg(
    'rage',
    'hsl(6, 70%, 19%)',
    'hsl(216, 46%, 9%)',
    `<circle cx="64" cy="36" r="31" fill="url(#ca-rage-dome)" stroke="hsl(202, 92%, 72%)" stroke-width="1.6" stroke-dasharray="14 5"/>
     <path d="M16 58 Q26 24 42 36 Q52 10 64 20 Q76 10 86 36 Q102 24 112 58 Q88 46 64 56 Q40 46 16 58 Z" fill="hsl(16, 98%, 52%)" opacity="0.48"/>
     <path d="M40 16 L64 9 L88 16 V40 C88 52 76 59 64 63 C52 59 40 52 40 40 Z" fill="rgba(0,0,0,0.45)" transform="translate(2 2)"/>
     <path d="M40 15 L64 8 L88 15 V39 C88 51 76 58 64 62 C52 58 40 51 40 39 Z" fill="url(#ca-rage-shield)" stroke="hsl(46, 100%, 74%)" stroke-width="2"/>
     <path d="M47 20 L64 15 L81 20 V38 C81 47 73 53 64 56 C55 53 47 47 47 38 Z" fill="hsl(354, 76%, 24%)" stroke="hsl(24, 100%, 64%)" stroke-width="1.2"/>
     <path d="M50 26 L64 36 L78 26" fill="none" stroke="hsl(50, 100%, 86%)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M53 44 H75" stroke="hsl(48, 100%, 82%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M22 22 L36 30 M106 22 L92 30 M20 44 L34 42 M108 44 L94 42" stroke="hsl(44, 100%, 76%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="28" cy="14" r="2.2" fill="hsl(48, 100%, 84%)"/><circle cx="100" cy="14" r="2.2" fill="hsl(48, 100%, 84%)"/>
     <circle cx="30" cy="58" r="2" fill="hsl(200, 96%, 78%)"/><circle cx="98" cy="58" r="2" fill="hsl(200, 96%, 78%)"/>`,
    'hsla(12, 98%, 56%, 0.30)',
    `<linearGradient id="ca-rage-shield" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(14, 94%, 54%)"/><stop offset="55%" stop-color="hsl(356, 84%, 38%)"/><stop offset="100%" stop-color="hsl(348, 72%, 18%)"/></linearGradient><radialGradient id="ca-rage-dome" cx="50%" cy="50%" r="50%"><stop offset="60%" stop-color="hsla(202, 96%, 64%, 0)"/><stop offset="86%" stop-color="hsla(202, 96%, 68%, 0.32)"/><stop offset="100%" stop-color="hsla(44, 100%, 74%, 0.55)"/></radialGradient>`
  ),
  havoc: wrapArtSvg(
    'havoc',
    'hsl(284, 56%, 18%)',
    'hsl(14, 56%, 8%)',
    `<ellipse cx="64" cy="36" rx="54" ry="28" fill="url(#ca-havoc-vortex)"/>
     <path d="M12 58 Q36 8 64 34 Q92 60 116 12" fill="none" stroke="hsl(24, 100%, 62%)" stroke-width="3.6" stroke-linecap="round"/>
     <path d="M14 18 Q44 62 68 34 Q92 8 114 54" fill="none" stroke="hsl(294, 94%, 68%)" stroke-width="2.6" stroke-linecap="round" opacity="0.82"/>
     <rect x="46" y="13" width="36" height="46" rx="3.5" transform="rotate(-8 64 36)" fill="url(#ca-havoc-slab)" stroke="hsl(44, 98%, 74%)" stroke-width="1.8"/>
     <path d="M52 24 L74 48 M76 22 L50 50" stroke="hsl(28, 100%, 64%)" stroke-width="2.4" stroke-linecap="round"/>
     <polygon points="64,23 72,36 64,49 56,36" fill="hsl(24, 100%, 60%)" stroke="hsl(52, 100%, 88%)" stroke-width="1.4"/>
     <circle cx="64" cy="36" r="4.2" fill="hsl(54, 100%, 94%)"/>
     <polygon points="84,12 96,15 88,24" fill="hsl(288, 62%, 44%)" stroke="hsl(36, 100%, 72%)" stroke-width="1"/>
     <polygon points="32,48 42,52 34,60" fill="hsl(24, 96%, 56%)" opacity="0.88"/>
     <circle cx="26" cy="24" r="2.2" fill="hsl(48, 100%, 80%)"/><circle cx="102" cy="48" r="2.4" fill="hsl(296, 96%, 76%)"/>
     <circle cx="96" cy="28" r="1.8" fill="hsl(36, 100%, 74%)"/>`,
    'hsla(292, 92%, 58%, 0.28)',
    `<linearGradient id="ca-havoc-slab" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(288, 56%, 40%)"/><stop offset="60%" stop-color="hsl(282, 54%, 22%)"/><stop offset="100%" stop-color="hsl(14, 82%, 34%)"/></linearGradient><radialGradient id="ca-havoc-vortex" cx="50%" cy="50%" r="52%"><stop offset="0%" stop-color="hsla(30, 100%, 66%, 0.55)"/><stop offset="55%" stop-color="hsla(290, 92%, 54%, 0.24)"/><stop offset="100%" stop-color="hsla(284, 84%, 24%, 0)"/></radialGradient>`
  ),
  survivor: wrapArtSvg(
    'survivor',
    'hsl(168, 44%, 17%)',
    'hsl(206, 46%, 8%)',
    `<circle cx="34" cy="18" r="28" fill="url(#ca-survivor-moon)"/>
     <path d="M0 64 L22 52 L48 60 L82 54 L128 64 L128 72 L0 72 Z" fill="hsl(204, 42%, 8%)"/>
     <path d="M12 8 L4 22 M30 6 L20 24 M96 8 L86 26 M116 12 L106 30 M18 34 L10 48" stroke="hsla(176, 62%, 78%, 0.28)" stroke-width="1.1" stroke-linecap="round"/>
     <path d="M22 65 Q28 24 54 14 Q74 16 78 65 Z" fill="url(#ca-survivor-cloak)" stroke="hsl(200, 50%, 8%)" stroke-width="1.6"/>
     <path d="M44 21 Q54 14 64 21 L61 32 Q54 36 47 32 Z" fill="hsl(152, 24%, 84%)" stroke="hsl(198, 48%, 12%)" stroke-width="1.2"/>
     <polygon points="56,25 61,27 56,29" fill="hsl(148, 100%, 72%)"/>
     <path d="M58 22 Q86 24 96 42 Q86 64 60 66 Q50 46 58 22 Z" fill="url(#ca-survivor-shield)" stroke="hsl(206, 52%, 10%)" stroke-width="1.7"/>
     <path d="M62 27 Q83 29 90 42 Q83 59 63 61" fill="none" stroke="hsl(42, 68%, 62%)" stroke-width="1.4"/>
     <path d="M68 38 L84 48 M72 34 L82 40" stroke="hsl(196, 44%, 14%)" stroke-width="1.3" stroke-linecap="round"/>
     <circle cx="76" cy="44" r="3.4" fill="hsl(40, 68%, 58%)" stroke="hsl(24, 50%, 16%)" stroke-width="1"/>
     <path d="M92 34 L108 26 M95 42 L114 40 M92 50 L108 56" stroke="hsl(44, 100%, 76%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M96 18 Q106 36 96 58" fill="none" stroke="hsla(156, 94%, 66%, 0.55)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="106" cy="30" r="2" fill="hsl(46, 100%, 84%)"/>
     <circle cx="110" cy="44" r="1.7" fill="hsl(154, 96%, 74%)"/>`,
    'hsla(158, 76%, 50%, 0.25)',
    `<linearGradient id="ca-survivor-cloak" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(164, 48%, 30%)"/><stop offset="100%" stop-color="hsl(198, 46%, 12%)"/></linearGradient><linearGradient id="ca-survivor-shield" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(170, 26%, 64%)"/><stop offset="50%" stop-color="hsl(186, 28%, 36%)"/><stop offset="100%" stop-color="hsl(206, 36%, 18%)"/></linearGradient><radialGradient id="ca-survivor-moon" cx="28%" cy="22%" r="36%"><stop offset="0%" stop-color="hsla(162, 68%, 82%, 0.34)"/><stop offset="100%" stop-color="hsla(188, 60%, 16%, 0)"/></radialGradient>`
  ),
  shiv: wrapArtSvg(
    'shiv',
    'hsl(176, 48%, 16%)',
    'hsl(214, 52%, 7%)',
    `<ellipse cx="76" cy="30" rx="46" ry="24" fill="url(#ca-shiv-flash)"/>
     <path d="M6 62 L116 8 M16 66 L120 18" stroke="hsla(164, 96%, 68%, 0.28)" stroke-width="2.4" stroke-linecap="round"/>
     <polygon points="44,44 114,11 94,30 50,48" fill="url(#ca-shiv-top)" stroke="hsl(210, 56%, 9%)" stroke-width="1.3"/>
     <polygon points="50,48 94,30 114,11 58,54" fill="url(#ca-shiv-bot)" stroke="hsl(210, 56%, 9%)" stroke-width="1.3"/>
     <line x1="53" y1="45" x2="94" y2="23" stroke="hsl(204, 48%, 22%)" stroke-width="1.2"/>
     <line x1="56" y1="40" x2="108" y2="14" stroke="hsl(0, 0%, 100%)" stroke-width="1"/>
     <polygon points="39,39 54,56 49,60 35,44" fill="hsl(190, 22%, 62%)" stroke="hsl(212, 54%, 10%)" stroke-width="1.2"/>
     <polygon points="20,58 41,45 47,52 26,64" fill="hsl(158, 60%, 26%)" stroke="hsl(206, 54%, 10%)" stroke-width="1.3"/>
     <path d="M26 54 L32 60 M32 50 L38 56 M38 47 L43 53" stroke="hsl(148, 86%, 56%)" stroke-width="1.3"/>
     <circle cx="19" cy="63" r="4.6" fill="none" stroke="hsl(188, 30%, 74%)" stroke-width="2"/>
     <path d="M114 5 V17 M108 11 H120" stroke="hsl(0, 0%, 100%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M28 28 L52 18 M78 52 L104 40" stroke="hsl(158, 96%, 72%)" stroke-width="1.4" stroke-linecap="round" opacity="0.72"/>
     <circle cx="114" cy="11" r="2.2" fill="hsl(154, 100%, 92%)"/>
     <circle cx="84" cy="46" r="1.6" fill="hsl(162, 100%, 80%)"/>`,
    'hsla(166, 90%, 62%, 0.28)',
    `<linearGradient id="ca-shiv-top" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(188, 30%, 78%)"/><stop offset="55%" stop-color="hsl(178, 56%, 96%)"/><stop offset="100%" stop-color="hsl(0, 0%, 100%)"/></linearGradient><linearGradient id="ca-shiv-bot" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(206, 36%, 28%)"/><stop offset="100%" stop-color="hsl(188, 36%, 62%)"/></linearGradient><radialGradient id="ca-shiv-flash" cx="70%" cy="32%" r="36%"><stop offset="0%" stop-color="hsla(162, 100%, 74%, 0.42)"/><stop offset="100%" stop-color="hsla(192, 80%, 14%, 0)"/></radialGradient>`
  ),
  envenom: wrapArtSvg(
    'envenom',
    'hsl(138, 60%, 14%)',
    'hsl(172, 54%, 7%)',
    `<ellipse cx="74" cy="44" rx="52" ry="26" fill="url(#ca-envenom-glow)"/>
     <path d="M8 66 Q38 50 68 58 Q96 48 124 62 L124 72 L8 72 Z" fill="hsla(128, 86%, 30%, 0.28)"/>
     <path d="M52 10 L74 6 L78 18 L60 26 Z" fill="hsla(152, 62%, 82%, 0.25)" stroke="hsl(144, 86%, 68%)" stroke-width="1.3"/>
     <path d="M56 14 L74 11 L76 17 L60 23 Z" fill="url(#ca-envenom-venom)"/>
     <path d="M58 24 Q56 32 60 36 Q64 32 62 24 Z" fill="url(#ca-envenom-venom)"/>
     <polygon points="34,46 116,38 100,52 38,54" fill="url(#ca-envenom-steel)" stroke="hsl(192, 56%, 10%)" stroke-width="1.5"/>
     <line x1="40" y1="47" x2="111" y2="40" stroke="hsl(0, 0%, 100%)" stroke-width="1" opacity="0.82"/>
     <path d="M46 46 Q60 40 76 44 Q92 40 112 39 Q98 48 84 48 Q72 52 58 49 Z" fill="url(#ca-envenom-venom)" opacity="0.92"/>
     <rect x="29" y="38" width="5" height="22" rx="1.6" fill="hsl(40, 68%, 54%)" stroke="hsl(22, 52%, 14%)" stroke-width="1.1"/>
     <rect x="11" y="45" width="18" height="8" rx="2" fill="hsl(166, 48%, 22%)" stroke="hsl(192, 54%, 10%)" stroke-width="1.2"/>
     <path d="M68 50 Q66 58 69 62 Q72 58 70 50 Z" fill="hsl(104, 100%, 66%)"/>
     <path d="M90 48 Q88 55 91 59 Q94 55 92 48 Z" fill="hsl(104, 100%, 66%)"/>
     <path d="M74 34 Q80 22 90 26 M98 30 Q106 20 114 24" fill="none" stroke="hsl(110, 100%, 72%)" stroke-width="1.5" stroke-linecap="round" opacity="0.78"/>
     <circle cx="69" cy="65" r="2.2" fill="hsl(98, 100%, 74%)"/>
     <circle cx="91" cy="63" r="1.8" fill="hsl(98, 100%, 74%)"/>
     <circle cx="114" cy="39" r="2.4" fill="hsl(102, 100%, 84%)"/>`,
    'hsla(120, 98%, 50%, 0.30)',
    `<linearGradient id="ca-envenom-steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(188, 28%, 54%)"/><stop offset="60%" stop-color="hsl(174, 40%, 88%)"/><stop offset="100%" stop-color="hsl(144, 62%, 78%)"/></linearGradient><linearGradient id="ca-envenom-venom" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(98, 100%, 66%)"/><stop offset="100%" stop-color="hsl(132, 96%, 36%)"/></linearGradient><radialGradient id="ca-envenom-glow" cx="62%" cy="56%" r="44%"><stop offset="0%" stop-color="hsla(112, 100%, 56%, 0.44)"/><stop offset="100%" stop-color="hsla(156, 80%, 12%, 0)"/></radialGradient>`
  ),
  a_thousand_cuts: wrapArtSvg(
    'a_thousand_cuts',
    'hsl(168, 52%, 15%)',
    'hsl(348, 44%, 8%)',
    `<ellipse cx="64" cy="36" rx="50" ry="28" fill="url(#ca-a_thousand_cuts-center)"/>
     <path d="M6 12 Q64 26 122 58" fill="none" stroke="url(#ca-a_thousand_cuts-mint)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M122 12 Q64 28 6 60" fill="none" stroke="url(#ca-a_thousand_cuts-mint)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M16 66 Q62 34 114 8" fill="none" stroke="url(#ca-a_thousand_cuts-red)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M8 38 Q64 26 120 38" fill="none" stroke="hsl(158, 100%, 84%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M32 6 Q58 38 96 66" fill="none" stroke="hsl(150, 96%, 68%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M96 6 Q70 38 32 66" fill="none" stroke="hsl(150, 96%, 68%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M52 6 L76 66 M78 6 L50 66" stroke="hsla(162, 100%, 88%, 0.65)" stroke-width="1.3" stroke-linecap="round"/>
     <path d="M12 24 L116 48 M116 24 L12 48" stroke="hsla(352, 98%, 68%, 0.55)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M22 50 Q64 44 106 50" fill="none" stroke="hsl(154, 100%, 82%)" stroke-width="1.5" stroke-linecap="round"/>
     <polygon points="64,26 67,34 75,36 67,38 64,46 61,38 53,36 61,34" fill="hsl(0, 0%, 100%)" opacity="0.92"/>
     <circle cx="42" cy="24" r="2" fill="hsl(152, 100%, 84%)"/>
     <circle cx="86" cy="24" r="2" fill="hsl(354, 100%, 72%)"/>
     <circle cx="44" cy="48" r="1.8" fill="hsl(354, 100%, 72%)"/>
     <circle cx="84" cy="48" r="2" fill="hsl(152, 100%, 84%)"/>`,
    'hsla(156, 94%, 60%, 0.28)',
    `<linearGradient id="ca-a_thousand_cuts-mint" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(152, 100%, 86%, 0.1)"/><stop offset="50%" stop-color="hsl(152, 100%, 84%)"/><stop offset="100%" stop-color="hsla(164, 96%, 54%, 0.1)"/></linearGradient><linearGradient id="ca-a_thousand_cuts-red" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(352, 96%, 60%, 0.1)"/><stop offset="50%" stop-color="hsl(352, 100%, 66%)"/><stop offset="100%" stop-color="hsla(352, 96%, 60%, 0.1)"/></linearGradient><radialGradient id="ca-a_thousand_cuts-center" cx="50%" cy="50%" r="40%"><stop offset="0%" stop-color="hsla(152, 100%, 64%, 0.34)"/><stop offset="100%" stop-color="hsla(200, 60%, 10%, 0)"/></radialGradient>`
  ),
  storm_of_steel: wrapArtSvg(
    'storm_of_steel',
    'hsl(192, 50%, 16%)',
    'hsl(220, 54%, 8%)',
    `<path d="M18 6 Q64 2 114 8 L82 68 Q64 70 46 68 Z" fill="url(#ca-storm_of_steel-vortex)"/>
     <ellipse cx="64" cy="18" rx="46" ry="10" fill="none" stroke="hsla(180, 96%, 78%, 0.52)" stroke-width="1.8"/>
     <ellipse cx="64" cy="36" rx="34" ry="8" fill="none" stroke="hsla(168, 94%, 72%, 0.48)" stroke-width="1.6"/>
     <ellipse cx="64" cy="54" rx="22" ry="6" fill="none" stroke="hsla(186, 92%, 70%, 0.44)" stroke-width="1.4"/>
     <rect x="18" y="48" width="14" height="18" rx="2" transform="rotate(-18 25 57)" fill="hsl(208, 38%, 22%)" stroke="hsl(176, 72%, 62%)" stroke-width="1.1"/>
     <rect x="34" y="50" width="14" height="17" rx="2" transform="rotate(14 41 58)" fill="hsl(202, 40%, 26%)" stroke="hsl(166, 82%, 68%)" stroke-width="1.1"/>
     <polygon points="16,18 46,12 36,22 22,22" fill="url(#ca-storm_of_steel-blade)" stroke="hsl(214, 58%, 10%)" stroke-width="1.2"/>
     <polygon points="56,12 88,8 76,18 60,17" fill="url(#ca-storm_of_steel-blade)" stroke="hsl(214, 58%, 10%)" stroke-width="1.2"/>
     <polygon points="84,22 116,16 104,27 88,26" fill="url(#ca-storm_of_steel-blade)" stroke="hsl(214, 58%, 10%)" stroke-width="1.2"/>
     <polygon points="28,36 62,32 50,41 34,40" fill="url(#ca-storm_of_steel-blade)" stroke="hsl(214, 58%, 10%)" stroke-width="1.2"/>
     <polygon points="74,38 108,34 96,44 80,43" fill="url(#ca-storm_of_steel-blade)" stroke="hsl(214, 58%, 10%)" stroke-width="1.2"/>
     <polygon points="58,52 92,50 80,58 64,57" fill="url(#ca-storm_of_steel-blade)" stroke="hsl(214, 58%, 10%)" stroke-width="1.2"/>
     <path d="M10 30 Q36 22 64 28 Q94 34 120 26" fill="none" stroke="hsl(172, 100%, 82%)" stroke-width="1.5" stroke-linecap="round" opacity="0.78"/>
     <circle cx="46" cy="12" r="2" fill="hsl(0, 0%, 100%)"/>
     <circle cx="116" cy="16" r="2.1" fill="hsl(176, 100%, 88%)"/>
     <circle cx="96" cy="44" r="1.8" fill="hsl(166, 100%, 84%)"/>`,
    'hsla(184, 92%, 62%, 0.30)',
    `<linearGradient id="ca-storm_of_steel-vortex" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsla(182, 92%, 72%, 0.44)"/><stop offset="100%" stop-color="hsla(210, 66%, 22%, 0.08)"/></linearGradient><linearGradient id="ca-storm_of_steel-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(184, 70%, 96%)"/><stop offset="60%" stop-color="hsl(196, 36%, 72%)"/><stop offset="100%" stop-color="hsl(214, 46%, 32%)"/></linearGradient>`
  ),
  tools_of_the_trade: wrapArtSvg(
    'tools_of_the_trade',
    'hsl(172, 46%, 15%)',
    'hsl(28, 42%, 8%)',
    `<ellipse cx="66" cy="24" rx="58" ry="34" fill="url(#ca-tools_of_the_trade-lamp)"/>
     <path d="M10 14 H118 L122 64 H6 Z" fill="hsl(180, 32%, 14%)" stroke="hsl(32, 46%, 30%)" stroke-width="1.4"/>
     <line x1="12" y1="22" x2="116" y2="22" stroke="hsla(38, 62%, 52%, 0.35)" stroke-width="1" stroke-dasharray="4 3"/>
     <line x1="10" y1="57" x2="118" y2="57" stroke="hsla(38, 62%, 52%, 0.35)" stroke-width="1" stroke-dasharray="4 3"/>
     <polygon points="24,48 46,16 50,24 30,52" fill="url(#ca-tools_of_the_trade-blade)" stroke="hsl(204, 50%, 10%)" stroke-width="1.3"/>
     <path d="M17 56 L26 46 L31 50 L22 60 Z" fill="hsl(28, 56%, 30%)" stroke="hsl(20, 52%, 10%)" stroke-width="1.1"/>
     <path d="M58 18 H70 V26 L78 46 A6 6 0 0 1 72 56 H56 A6 6 0 0 1 50 46 L58 26 Z" fill="hsla(154, 68%, 88%, 0.24)" stroke="hsl(172, 56%, 10%)" stroke-width="1.5"/>
     <path d="M52 45 H76 L73 55 H55 Z" fill="url(#ca-tools_of_the_trade-vial)"/>
     <rect x="59" y="13" width="10" height="5" rx="1.2" fill="hsl(32, 56%, 48%)" stroke="hsl(22, 50%, 12%)" stroke-width="0.9"/>
     <line x1="56" y1="30" x2="53" y2="44" stroke="hsla(0, 0%, 100%, 0.72)" stroke-width="1.2" stroke-linecap="round"/>
     <circle cx="96" cy="36" r="13" fill="none" stroke="url(#ca-tools_of_the_trade-brass)" stroke-width="2.6"/>
     <circle cx="96" cy="36" r="8.5" fill="none" stroke="hsl(38, 72%, 44%)" stroke-width="1.4" stroke-dasharray="5 3"/>
     <path d="M96 23 L104 14 M96 23 L88 15" stroke="hsl(46, 94%, 76%)" stroke-width="2" stroke-linecap="round"/>
     <rect x="82" y="42" width="14" height="17" rx="1.8" transform="rotate(-10 89 50)" fill="hsl(168, 46%, 24%)" stroke="hsl(44, 86%, 68%)" stroke-width="1.1"/>
     <rect x="94" y="43" width="14" height="17" rx="1.8" transform="rotate(10 101 51)" fill="hsl(162, 50%, 30%)" stroke="hsl(150, 90%, 72%)" stroke-width="1.1"/>
     <circle cx="63" cy="50" r="1.8" fill="hsl(98, 100%, 84%)"/>
     <circle cx="46" cy="17" r="1.8" fill="hsl(0, 0%, 100%)"/>`,
    'hsla(42, 88%, 56%, 0.26)',
    `<radialGradient id="ca-tools_of_the_trade-lamp" cx="52%" cy="22%" r="54%"><stop offset="0%" stop-color="hsla(42, 98%, 68%, 0.38)"/><stop offset="100%" stop-color="hsla(180, 50%, 10%, 0)"/></radialGradient><linearGradient id="ca-tools_of_the_trade-blade" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(184, 24%, 60%)"/><stop offset="100%" stop-color="hsl(176, 48%, 94%)"/></linearGradient><linearGradient id="ca-tools_of_the_trade-vial" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(118, 98%, 58%)"/><stop offset="100%" stop-color="hsl(148, 86%, 30%)"/></linearGradient><linearGradient id="ca-tools_of_the_trade-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(46, 94%, 74%)"/><stop offset="100%" stop-color="hsl(30, 74%, 38%)"/></linearGradient>`
  ),
  burst: wrapArtSvg(
    'burst',
    'hsl(148, 66%, 16%)',
    'hsl(188, 56%, 7%)',
    `<ellipse cx="64" cy="36" rx="58" ry="34" fill="url(#ca-burst-core)"/>
     <path d="M64 2 V70 M4 36 H124 M18 8 L110 64 M110 8 L18 64" stroke="hsla(134, 100%, 74%, 0.28)" stroke-width="2.4" stroke-linecap="round"/>
     <circle cx="64" cy="36" r="29" fill="none" stroke="hsl(138, 100%, 66%)" stroke-width="2" opacity="0.72"/>
     <circle cx="64" cy="36" r="22" fill="none" stroke="hsl(52, 100%, 78%)" stroke-width="1.8" stroke-dasharray="10 4"/>
     <polygon points="64,6 71,24 94,14 80,30 104,36 80,42 94,58 71,48 64,66 57,48 34,58 48,42 24,36 48,30 34,14 57,24" fill="url(#ca-burst-star)" stroke="hsl(166, 66%, 12%)" stroke-width="1.5"/>
     <polygon points="64,16 69,30 82,26 73,36 82,46 69,42 64,56 59,42 46,46 55,36 46,26 59,30" fill="hsl(56, 100%, 84%)" opacity="0.9"/>
     <circle cx="64" cy="36" r="7.5" fill="hsl(58, 100%, 96%)"/>
     <path d="M16 20 L26 26 M112 20 L102 26 M16 52 L26 46 M112 52 L102 46" stroke="hsl(130, 100%, 76%)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="104,12 114,10 108,19" fill="hsl(52, 100%, 80%)"/>
     <polygon points="24,60 14,62 20,53" fill="hsl(52, 100%, 80%)"/>
     <circle cx="22" cy="14" r="2.2" fill="hsl(126, 100%, 78%)"/>
     <circle cx="106" cy="58" r="2.2" fill="hsl(126, 100%, 78%)"/>
     <circle cx="38" cy="10" r="1.7" fill="hsl(54, 100%, 86%)"/>
     <circle cx="90" cy="62" r="1.7" fill="hsl(54, 100%, 86%)"/>`,
    'hsla(138, 100%, 58%, 0.34)',
    `<radialGradient id="ca-burst-core" cx="50%" cy="50%" r="48%"><stop offset="0%" stop-color="hsl(56, 100%, 92%)"/><stop offset="32%" stop-color="hsl(130, 100%, 62%)"/><stop offset="68%" stop-color="hsla(154, 96%, 44%, 0.34)"/><stop offset="100%" stop-color="hsla(186, 80%, 12%, 0)"/></radialGradient><linearGradient id="ca-burst-star" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(64, 100%, 80%)"/><stop offset="50%" stop-color="hsl(136, 98%, 58%)"/><stop offset="100%" stop-color="hsl(162, 92%, 42%)"/></linearGradient>`
  ),
  malaise: wrapArtSvg(
    'malaise',
    'hsl(274, 50%, 15%)',
    'hsl(150, 52%, 7%)',
    `<ellipse cx="64" cy="36" rx="54" ry="30" fill="url(#ca-malaise-aura)"/>
     <path d="M0 0 H128 V18 Q98 30 64 20 Q30 30 0 18 Z" fill="hsla(274, 62%, 18%, 0.52)"/>
     <path d="M10 18 Q36 6 58 28 Q80 50 118 22" fill="none" stroke="url(#ca-malaise-curse)" stroke-width="4" stroke-linecap="round" opacity="0.72"/>
     <path d="M10 52 Q40 66 64 42 Q88 18 118 50" fill="none" stroke="url(#ca-malaise-curse)" stroke-width="3.6" stroke-linecap="round" opacity="0.72"/>
     <path d="M48 24 H80 L82 44 Q78 58 64 60 Q50 58 46 44 Z" fill="url(#ca-malaise-fist)" stroke="hsl(278, 56%, 10%)" stroke-width="1.6"/>
     <path d="M54 24 V38 M64 24 V39 M74 24 V38" stroke="hsl(278, 50%, 14%)" stroke-width="1.4"/>
     <path d="M46 38 Q64 46 82 38" fill="none" stroke="hsl(126, 96%, 60%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M44 48 Q64 36 84 48" fill="none" stroke="hsl(286, 86%, 62%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M58 28 L66 36 L60 46" fill="none" stroke="hsl(122, 100%, 70%)" stroke-width="1.4"/>
     <path d="M26 24 V44 M102 22 V42 M38 48 V64 M90 48 V64" stroke="hsla(130, 92%, 58%, 0.58)" stroke-width="1.8" stroke-linecap="round"/>
     <polygon points="26,48 22,41 30,41" fill="hsl(128, 96%, 62%)"/>
     <polygon points="102,46 98,39 106,39" fill="hsl(128, 96%, 62%)"/>
     <circle cx="52" cy="64" r="2.2" fill="hsl(352, 74%, 52%)" opacity="0.78"/>
     <circle cx="76" cy="65" r="2" fill="hsl(128, 96%, 64%)"/>
     <circle cx="64" cy="14" r="2" fill="hsl(286, 90%, 68%)"/>`,
    'hsla(138, 86%, 48%, 0.26)',
    `<radialGradient id="ca-malaise-aura" cx="50%" cy="48%" r="46%"><stop offset="0%" stop-color="hsla(130, 90%, 48%, 0.4)"/><stop offset="55%" stop-color="hsla(276, 72%, 34%, 0.28)"/><stop offset="100%" stop-color="hsla(268, 60%, 10%, 0)"/></radialGradient><linearGradient id="ca-malaise-fist" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(274, 24%, 46%)"/><stop offset="100%" stop-color="hsl(220, 26%, 20%)"/></linearGradient><linearGradient id="ca-malaise-curse" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(126, 94%, 56%)"/><stop offset="100%" stop-color="hsl(282, 82%, 52%)"/></linearGradient>`
  ),
  deadly_poison: wrapArtSvg(
    'deadly_poison',
    'hsl(130, 64%, 15%)',
    'hsl(166, 56%, 7%)',
    `<ellipse cx="64" cy="40" rx="52" ry="30" fill="url(#ca-deadly_poison-halo)"/>
     <path d="M58 14 Q42 6 32 18 Q24 26 16 20 M70 14 Q86 6 96 18 Q106 26 114 18" fill="none" stroke="hsla(114, 100%, 64%, 0.52)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M54 18 H74 V27 L88 45 A14 14 0 0 1 76 66 H52 A14 14 0 0 1 40 45 L54 27 Z" fill="url(#ca-deadly_poison-glass)" stroke="hsl(158, 66%, 10%)" stroke-width="1.8"/>
     <path d="M43 45 Q64 39 85 45 A12 12 0 0 1 75 64 H53 A12 12 0 0 1 43 45 Z" fill="url(#ca-deadly_poison-fluid)"/>
     <ellipse cx="64" cy="44" rx="20" ry="3.4" fill="hsl(98, 100%, 76%)" opacity="0.86"/>
     <rect x="55" y="10" width="18" height="8" rx="2" fill="hsl(30, 52%, 44%)" stroke="hsl(20, 50%, 14%)" stroke-width="1.2"/>
     <path d="M53 18 H75 V22 H53 Z" fill="hsl(138, 72%, 68%)" stroke="hsl(162, 60%, 12%)" stroke-width="1"/>
     <circle cx="58" cy="52" r="3" fill="hsl(158, 68%, 11%)"/>
     <circle cx="70" cy="52" r="3" fill="hsl(158, 68%, 11%)"/>
     <path d="M62 57 L64 54 L66 57 Z" fill="hsl(158, 68%, 11%)"/>
     <path d="M56 61 H72 M60 59 V63 M64 59 V63 M68 59 V63" stroke="hsl(158, 68%, 11%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M52 31 L45 48" stroke="hsla(0, 0%, 100%, 0.76)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M77 24 Q82 30 79 36 Q76 30 77 24 Z" fill="hsl(104, 100%, 68%)"/>
     <circle cx="30" cy="44" r="2.6" fill="hsl(110, 100%, 68%)" opacity="0.8"/>
     <circle cx="98" cy="42" r="2.8" fill="hsl(110, 100%, 68%)" opacity="0.8"/>
     <circle cx="92" cy="56" r="1.8" fill="hsl(98, 100%, 78%)"/>`,
    'hsla(122, 98%, 50%, 0.32)',
    `<radialGradient id="ca-deadly_poison-halo" cx="50%" cy="54%" r="44%"><stop offset="0%" stop-color="hsla(114, 100%, 58%, 0.52)"/><stop offset="100%" stop-color="hsla(156, 80%, 12%, 0)"/></radialGradient><linearGradient id="ca-deadly_poison-fluid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(104, 100%, 62%)"/><stop offset="100%" stop-color="hsl(138, 92%, 30%)"/></linearGradient><linearGradient id="ca-deadly_poison-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(146, 80%, 92%, 0.34)"/><stop offset="100%" stop-color="hsla(162, 62%, 18%, 0.36)"/></linearGradient>`
  ),
  poisoned_stab: wrapArtSvg(
    'poisoned_stab',
    'hsl(142, 58%, 16%)',
    'hsl(178, 54%, 7%)',
    `<ellipse cx="96" cy="22" rx="34" ry="24" fill="url(#ca-poisoned_stab-splat)"/>
     <path d="M6 66 L108 14 M18 68 L112 24" stroke="hsla(124, 96%, 60%, 0.3)" stroke-width="3" stroke-linecap="round"/>
     <polygon points="36,46 108,14 94,30 44,54" fill="url(#ca-poisoned_stab-blade)" stroke="hsl(192, 56%, 10%)" stroke-width="1.5"/>
     <line x1="42" y1="48" x2="103" y2="18" stroke="hsl(0, 0%, 100%)" stroke-width="1" opacity="0.82"/>
     <path d="M74 28 L108 14 L96 29 Q86 30 78 36 Z" fill="url(#ca-poisoned_stab-venom)" opacity="0.9"/>
     <polygon points="29,39 46,58 41,62 25,44" fill="hsl(40, 70%, 54%)" stroke="hsl(22, 52%, 12%)" stroke-width="1.2"/>
     <polygon points="12,58 31,46 37,54 18,65" fill="hsl(166, 52%, 22%)" stroke="hsl(194, 56%, 10%)" stroke-width="1.3"/>
     <path d="M98 16 Q112 10 118 20 M104 26 Q118 28 118 38 M88 12 Q92 4 102 6" fill="none" stroke="hsl(106, 100%, 66%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M84 36 Q82 46 86 50 Q90 46 88 36 Z" fill="url(#ca-poisoned_stab-venom)"/>
     <path d="M68 44 Q66 53 70 57 Q74 53 72 44 Z" fill="url(#ca-poisoned_stab-venom)"/>
     <circle cx="108" cy="14" r="3.4" fill="hsl(96, 100%, 82%)"/>
     <circle cx="114" cy="30" r="2.8" fill="hsl(108, 100%, 66%)"/>
     <circle cx="86" cy="58" r="2.2" fill="hsl(104, 100%, 70%)"/>
     <circle cx="70" cy="64" r="1.9" fill="hsl(104, 100%, 70%)"/>
     <circle cx="62" cy="20" r="1.8" fill="hsl(120, 100%, 72%)" opacity="0.8"/>`,
    'hsla(126, 96%, 52%, 0.30)',
    `<radialGradient id="ca-poisoned_stab-splat" cx="80%" cy="28%" r="36%"><stop offset="0%" stop-color="hsla(104, 100%, 62%, 0.62)"/><stop offset="100%" stop-color="hsla(148, 86%, 16%, 0)"/></radialGradient><linearGradient id="ca-poisoned_stab-blade" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(186, 30%, 54%)"/><stop offset="65%" stop-color="hsl(168, 48%, 90%)"/><stop offset="100%" stop-color="hsl(108, 100%, 72%)"/></linearGradient><linearGradient id="ca-poisoned_stab-venom" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(98, 100%, 68%)"/><stop offset="100%" stop-color="hsl(134, 96%, 36%)"/></linearGradient>`
  ),
  bane: wrapArtSvg(
    'bane',
    'hsl(136, 54%, 15%)',
    'hsl(348, 54%, 8%)',
    `<ellipse cx="64" cy="36" rx="54" ry="30" fill="url(#ca-bane-core)"/>
     <circle cx="64" cy="36" r="18" fill="hsla(138, 76%, 22%, 0.65)" stroke="hsl(114, 96%, 62%)" stroke-width="1.6"/>
     <path d="M56 30 Q64 20 72 30 Q74 44 64 50 Q54 44 56 30 Z" fill="hsl(118, 96%, 48%)" stroke="hsl(152, 64%, 12%)" stroke-width="1.2"/>
     <path d="M12 60 Q48 22 106 8 Q66 36 22 66 Z" fill="url(#ca-bane-slash1)" stroke="hsl(162, 64%, 10%)" stroke-width="1.3"/>
     <path d="M18 62 Q54 28 102 12" fill="none" stroke="hsl(88, 100%, 92%)" stroke-width="1.3" stroke-linecap="round"/>
     <path d="M20 8 Q72 22 116 60 Q72 38 14 16 Z" fill="url(#ca-bane-slash2)" stroke="hsl(350, 66%, 12%)" stroke-width="1.3"/>
     <path d="M22 13 Q68 28 110 56" fill="none" stroke="hsl(44, 100%, 88%)" stroke-width="1.2" stroke-linecap="round"/>
     <polygon points="64,26 68,34 76,36 68,38 64,46 60,38 52,36 60,34" fill="hsl(68, 100%, 90%)"/>
     <path d="M26 36 L40 36 M88 36 L102 36 M64 6 V16 M64 56 V66" stroke="hsl(114, 100%, 70%)" stroke-width="1.8" stroke-linecap="round" opacity="0.76"/>
     <circle cx="36" cy="54" r="2.6" fill="hsl(106, 100%, 66%)"/>
     <circle cx="92" cy="18" r="2.6" fill="hsl(354, 98%, 68%)"/>
     <circle cx="94" cy="54" r="2.4" fill="hsl(106, 100%, 66%)"/>
     <circle cx="34" cy="18" r="2.4" fill="hsl(354, 98%, 68%)"/>`,
    'hsla(126, 94%, 52%, 0.28)',
    `<linearGradient id="ca-bane-slash1" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(144, 92%, 44%)"/><stop offset="50%" stop-color="hsl(104, 100%, 72%)"/><stop offset="100%" stop-color="hsl(132, 96%, 54%)"/></linearGradient><linearGradient id="ca-bane-slash2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(352, 96%, 60%)"/><stop offset="50%" stop-color="hsl(12, 100%, 72%)"/><stop offset="100%" stop-color="hsl(344, 88%, 42%)"/></linearGradient><radialGradient id="ca-bane-core" cx="50%" cy="50%" r="44%"><stop offset="0%" stop-color="hsla(112, 100%, 60%, 0.56)"/><stop offset="55%" stop-color="hsla(352, 88%, 46%, 0.28)"/><stop offset="100%" stop-color="hsla(350, 70%, 10%, 0)"/></radialGradient>`
  ),
  cloak_and_dagger: wrapArtSvg(
    'cloak_and_dagger',
    'hsl(166, 54%, 16%)',
    'hsl(206, 52%, 8%)',
    `<ellipse cx="68" cy="36" rx="54" ry="30" fill="url(#ca-cloak_and_dagger-glow)"/>
     <path d="M12 60 Q28 16 58 10 Q74 10 82 28 L88 64 Q54 52 12 60 Z" fill="url(#ca-cloak_and_dagger-cloak)" stroke="hsl(206, 58%, 8%)" stroke-width="1.6"/>
     <path d="M40 16 Q56 8 68 18 Q62 32 48 34 Q38 28 40 16 Z" fill="hsl(196, 56%, 8%)" stroke="hsl(154, 72%, 56%)" stroke-width="1"/>
     <path d="M22 54 Q40 28 60 22 M34 56 Q52 34 72 28" fill="none" stroke="hsla(154, 86%, 64%, 0.42)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M14 58 Q50 50 86 62" fill="none" stroke="hsl(42, 82%, 62%)" stroke-width="1.4"/>
     <circle cx="54" cy="34" r="3.2" fill="hsl(42, 88%, 64%)" stroke="hsl(24, 56%, 16%)" stroke-width="1"/>
     <polygon points="58,50 116,18 102,34 64,54" fill="url(#ca-cloak_and_dagger-blade)" stroke="hsl(206, 58%, 10%)" stroke-width="1.4"/>
     <line x1="63" y1="50" x2="112" y2="21" stroke="hsl(0, 0%, 100%)" stroke-width="1"/>
     <polygon points="53,45 66,58 62,62 49,49" fill="hsl(42, 82%, 58%)" stroke="hsl(24, 54%, 14%)" stroke-width="1.1"/>
     <polygon points="40,58 55,49 60,55 45,64" fill="hsl(166, 48%, 22%)" stroke="hsl(202, 54%, 10%)" stroke-width="1.2"/>
     <path d="M116 12 V24 M110 18 H122" stroke="hsl(0, 0%, 100%)" stroke-width="1.3" stroke-linecap="round"/>
     <path d="M12 24 Q24 14 38 12" fill="none" stroke="hsla(154, 94%, 68%, 0.56)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="92" cy="48" r="2" fill="hsl(154, 96%, 72%)"/>
     <circle cx="24" cy="38" r="1.6" fill="hsl(160, 96%, 76%)" opacity="0.72"/>`,
    'hsla(156, 88%, 54%, 0.26)',
    `<linearGradient id="ca-cloak_and_dagger-cloak" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(162, 54%, 34%)"/><stop offset="55%" stop-color="hsl(178, 52%, 18%)"/><stop offset="100%" stop-color="hsl(206, 56%, 10%)"/></linearGradient><linearGradient id="ca-cloak_and_dagger-blade" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(188, 30%, 58%)"/><stop offset="55%" stop-color="hsl(176, 52%, 94%)"/><stop offset="100%" stop-color="hsl(0, 0%, 100%)"/></linearGradient><radialGradient id="ca-cloak_and_dagger-glow" cx="56%" cy="46%" r="48%"><stop offset="0%" stop-color="hsla(158, 92%, 56%, 0.3)"/><stop offset="100%" stop-color="hsla(204, 60%, 10%, 0)"/></radialGradient>`
  ),
  dagger_throw: wrapArtSvg(
    'dagger_throw',
    'hsl(172, 52%, 16%)',
    'hsl(208, 52%, 8%)',
    `<polygon points="4,36 74,18 66,36 74,54" fill="url(#ca-dagger_throw-wake)"/>
     <ellipse cx="32" cy="36" rx="7" ry="18" fill="none" stroke="hsla(158, 100%, 72%, 0.42)" stroke-width="1.6"/>
     <ellipse cx="52" cy="36" rx="9" ry="24" fill="none" stroke="hsla(162, 100%, 76%, 0.56)" stroke-width="1.8"/>
     <line x1="6" y1="24" x2="56" y2="26" stroke="hsl(154, 100%, 74%)" stroke-width="1.6" stroke-linecap="round" opacity="0.72"/>
     <line x1="6" y1="48" x2="56" y2="46" stroke="hsl(154, 100%, 74%)" stroke-width="1.6" stroke-linecap="round" opacity="0.72"/>
     <path d="M16 36 Q28 28 38 36 Q46 42 54 36" fill="none" stroke="hsl(148, 96%, 58%)" stroke-width="2.4" stroke-linecap="round"/>
     <circle cx="52" cy="36" r="4.5" fill="none" stroke="hsl(42, 82%, 62%)" stroke-width="1.8"/>
     <rect x="56" y="32.5" width="15" height="7" rx="1.6" fill="hsl(166, 52%, 24%)" stroke="hsl(204, 56%, 10%)" stroke-width="1.2"/>
     <polygon points="71,24 76,24 76,48 71,48" fill="hsl(42, 80%, 58%)" stroke="hsl(22, 54%, 14%)" stroke-width="1.1"/>
     <polygon points="76,27 120,36 76,36" fill="url(#ca-dagger_throw-blade)" stroke="hsl(208, 56%, 10%)" stroke-width="1.3"/>
     <polygon points="76,36 120,36 76,45" fill="hsl(192, 34%, 52%)" stroke="hsl(208, 56%, 10%)" stroke-width="1.3"/>
     <line x1="78" y1="36" x2="117" y2="36" stroke="hsl(0, 0%, 100%)" stroke-width="1.1"/>
     <path d="M120 29 V43 M113 36 H125" stroke="hsl(158, 100%, 92%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="96" cy="20" r="1.8" fill="hsl(156, 100%, 78%)"/>
     <circle cx="98" cy="52" r="1.8" fill="hsl(156, 100%, 78%)"/>`,
    'hsla(158, 94%, 58%, 0.28)',
    `<linearGradient id="ca-dagger_throw-blade" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(188, 30%, 54%)"/><stop offset="55%" stop-color="hsl(176, 56%, 94%)"/><stop offset="100%" stop-color="hsl(0, 0%, 100%)"/></linearGradient><linearGradient id="ca-dagger_throw-wake" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(156, 98%, 62%, 0.04)"/><stop offset="100%" stop-color="hsla(156, 100%, 74%, 0.65)"/></linearGradient>`
  ),
  acrobatics: wrapArtSvg(
    'acrobatics',
    'hsl(182, 54%, 17%)',
    'hsl(218, 52%, 8%)',
    `<path d="M0 72 L0 58 L20 50 L36 62 L62 52 L92 64 L112 48 L128 58 L128 72 Z" fill="hsl(214, 48%, 9%)"/>
     <path d="M8 62 Q40 8 68 24 Q94 40 122 10" fill="none" stroke="url(#ca-acrobatics-ribbon)" stroke-width="4.4" stroke-linecap="round"/>
     <path d="M12 66 Q44 16 70 30 Q94 44 120 18" fill="none" stroke="hsla(180, 100%, 84%, 0.45)" stroke-width="1.6" stroke-linecap="round"/>
     <rect x="18" y="34" width="11" height="15" rx="1.6" transform="rotate(-24 23 41)" fill="hsl(172, 48%, 26%)" stroke="hsl(158, 92%, 72%)" stroke-width="1.1"/>
     <rect x="86" y="36" width="11" height="15" rx="1.6" transform="rotate(14 91 43)" fill="hsl(172, 48%, 26%)" stroke="hsl(46, 96%, 76%)" stroke-width="1.1"/>
     <rect x="102" y="22" width="11" height="15" rx="1.6" transform="rotate(28 107 29)" fill="hsl(172, 48%, 26%)" stroke="hsl(158, 92%, 72%)" stroke-width="1.1"/>
     <path d="M36 30 Q48 16 64 20 Q52 28 42 36 Z" fill="hsl(158, 78%, 48%)" opacity="0.88"/>
     <path d="M54 24 Q64 12 76 18 L82 28 L72 34 L62 30 Z" fill="url(#ca-acrobatics-hero)" stroke="hsl(210, 56%, 9%)" stroke-width="1.4"/>
     <circle cx="74" cy="18" r="4.5" fill="hsl(156, 36%, 88%)" stroke="hsl(204, 52%, 12%)" stroke-width="1.1"/>
     <path d="M54 26 L44 38 M64 30 L74 42 M78 24 L88 18" stroke="hsl(166, 56%, 32%)" stroke-width="3.2" stroke-linecap="round"/>
     <circle cx="48" cy="14" r="2.2" fill="hsl(48, 100%, 80%)"/>
     <circle cx="96" cy="14" r="2" fill="hsl(168, 100%, 82%)"/>
     <circle cx="34" cy="54" r="1.8" fill="hsl(166, 100%, 78%)"/>
     <circle cx="76" cy="50" r="1.6" fill="hsl(46, 100%, 82%)"/>`,
    'hsla(170, 94%, 60%, 0.28)',
    `<linearGradient id="ca-acrobatics-ribbon" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsla(166, 98%, 62%, 0.16)"/><stop offset="50%" stop-color="hsl(166, 100%, 74%)"/><stop offset="100%" stop-color="hsla(186, 100%, 76%, 0.2)"/></linearGradient><linearGradient id="ca-acrobatics-hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(166, 56%, 34%)"/><stop offset="100%" stop-color="hsl(204, 54%, 12%)"/></linearGradient>`
  ),
  prepared: wrapArtSvg(
    'prepared',
    'hsl(174, 48%, 16%)',
    'hsl(212, 48%, 8%)',
    `<ellipse cx="68" cy="36" rx="52" ry="30" fill="url(#ca-prepared-glow)"/>
     <path d="M36 22 Q64 4 92 22 Q78 28 64 26 Q50 28 36 22 Z" fill="hsl(194, 52%, 11%)" stroke="hsla(156, 86%, 64%, 0.42)" stroke-width="1"/>
     <polygon points="54,15 60,17 55,19" fill="hsl(148, 100%, 76%)"/>
     <polygon points="74,15 68,17 73,19" fill="hsl(148, 100%, 76%)"/>
     <rect x="24" y="26" width="22" height="32" rx="3" transform="rotate(-16 35 42)" fill="url(#ca-prepared-drop)" stroke="hsl(198, 42%, 44%)" stroke-width="1.3" opacity="0.82"/>
     <path d="M24 44 L36 38" stroke="hsla(194, 52%, 62%, 0.42)" stroke-width="1.3" stroke-linecap="round"/>
     <rect x="52" y="24" width="24" height="35" rx="3" transform="rotate(-2 64 41)" fill="url(#ca-prepared-keep)" stroke="hsl(152, 92%, 72%)" stroke-width="1.5"/>
     <polygon points="64,32 70,41 64,50 58,41" fill="hsl(152, 96%, 66%)" opacity="0.72"/>
     <rect x="78" y="24" width="24" height="35" rx="3" transform="rotate(14 90 41)" fill="url(#ca-prepared-keep)" stroke="hsl(46, 94%, 74%)" stroke-width="1.6"/>
     <polygon points="90,32 95,41 90,50 85,41" fill="hsl(46, 100%, 76%)" opacity="0.82"/>
     <path d="M18 58 Q38 68 58 64" fill="none" stroke="hsla(202, 66%, 64%, 0.55)" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="4 3"/>
     <path d="M72 64 Q94 66 112 46" fill="none" stroke="hsl(152, 98%, 70%)" stroke-width="2" stroke-linecap="round"/>
     <polygon points="114,42 106,46 113,52" fill="hsl(46, 100%, 78%)"/>
     <circle cx="96" cy="18" r="2.2" fill="hsl(48, 100%, 84%)"/>
     <circle cx="44" cy="18" r="1.6" fill="hsl(162, 96%, 76%)"/>`,
    'hsla(164, 88%, 56%, 0.26)',
    `<linearGradient id="ca-prepared-keep" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(162, 62%, 38%)"/><stop offset="100%" stop-color="hsl(188, 56%, 16%)"/></linearGradient><linearGradient id="ca-prepared-drop" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(210, 34%, 26%)"/><stop offset="100%" stop-color="hsl(224, 42%, 12%)"/></linearGradient><radialGradient id="ca-prepared-glow" cx="56%" cy="44%" r="44%"><stop offset="0%" stop-color="hsla(160, 94%, 60%, 0.34)"/><stop offset="100%" stop-color="hsla(206, 60%, 10%, 0)"/></radialGradient>`
  ),
  backflip: wrapArtSvg(
    'backflip',
    'hsl(184, 54%, 17%)',
    'hsl(218, 52%, 8%)',
    `<path d="M12 58 Q64 50 116 62" fill="none" stroke="url(#ca-backflip-slash)" stroke-width="4.4" stroke-linecap="round"/>
     <path d="M22 61 Q64 55 108 64" fill="none" stroke="hsl(36, 100%, 78%)" stroke-width="1.2" stroke-linecap="round" opacity="0.72"/>
     <path d="M100 50 A34 24 0 1 0 32 36" fill="none" stroke="url(#ca-backflip-loop)" stroke-width="4.4" stroke-linecap="round"/>
     <path d="M94 48 A28 19 0 1 0 38 35" fill="none" stroke="hsla(176, 100%, 86%, 0.48)" stroke-width="1.5" stroke-linecap="round"/>
     <polygon points="24,28 31,44 43,33" fill="hsl(174, 100%, 80%)" stroke="hsl(204, 58%, 12%)" stroke-width="1.1"/>
     <path d="M62 20 Q74 10 86 20 Q76 28 66 26 Z" fill="hsl(158, 82%, 52%)" opacity="0.85"/>
     <path d="M52 24 Q62 14 72 22 L68 34 Q58 38 50 30 Z" fill="url(#ca-backflip-hero)" stroke="hsl(210, 58%, 10%)" stroke-width="1.4"/>
     <circle cx="52" cy="30" r="4.4" fill="hsl(158, 38%, 88%)" stroke="hsl(206, 54%, 12%)" stroke-width="1.1"/>
     <path d="M66 24 L78 16 M64 32 L76 38" stroke="hsl(166, 54%, 34%)" stroke-width="3" stroke-linecap="round"/>
     <path d="M14 48 Q26 42 38 48" fill="none" stroke="hsl(172, 100%, 82%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="88" cy="14" r="2.2" fill="hsl(48, 100%, 80%)"/>
     <circle cx="38" cy="16" r="1.9" fill="hsl(174, 100%, 86%)"/>
     <circle cx="104" cy="40" r="1.8" fill="hsl(166, 100%, 78%)"/>
     <circle cx="64" cy="44" r="1.7" fill="hsl(46, 100%, 82%)"/>`,
    'hsla(174, 96%, 60%, 0.28)',
    `<linearGradient id="ca-backflip-loop" x1="1" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsla(166, 96%, 56%, 0.16)"/><stop offset="55%" stop-color="hsl(172, 100%, 74%)"/><stop offset="100%" stop-color="hsl(188, 100%, 88%)"/></linearGradient><linearGradient id="ca-backflip-slash" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(352, 96%, 56%, 0.1)"/><stop offset="50%" stop-color="hsl(352, 96%, 62%)"/><stop offset="100%" stop-color="hsla(18, 96%, 58%, 0.15)"/></linearGradient><linearGradient id="ca-backflip-hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(166, 56%, 34%)"/><stop offset="100%" stop-color="hsl(206, 54%, 12%)"/></linearGradient>`
  ),
  dagger_spray: wrapArtSvg(
    'dagger_spray',
    'hsl(164, 56%, 16%)',
    'hsl(202, 52%, 8%)',
    `<ellipse cx="26" cy="38" rx="44" ry="30" fill="url(#ca-dagger_spray-launch)"/>
     <path d="M18 38 L86 8 M18 38 L112 20 M18 38 L120 38 M18 38 L112 54 M18 38 L86 66" stroke="hsla(154, 100%, 72%, 0.34)" stroke-width="1.8" stroke-linecap="round"/>
     <polygon points="44,24 88,8 78,18 48,28" fill="url(#ca-dagger_spray-steel)" stroke="hsl(202, 58%, 10%)" stroke-width="1.2"/>
     <polygon points="56,28 110,18 96,27 60,33" fill="url(#ca-dagger_spray-steel)" stroke="hsl(202, 58%, 10%)" stroke-width="1.2"/>
     <polygon points="62,34 120,38 104,43 62,41" fill="url(#ca-dagger_spray-steel)" stroke="hsl(202, 58%, 10%)" stroke-width="1.3"/>
     <polygon points="56,43 110,56 94,55 58,48" fill="url(#ca-dagger_spray-steel)" stroke="hsl(202, 58%, 10%)" stroke-width="1.2"/>
     <polygon points="42,48 86,65 72,62 46,53" fill="url(#ca-dagger_spray-steel)" stroke="hsl(202, 58%, 10%)" stroke-width="1.2"/>
     <polygon points="32,33 62,25 54,32 34,36" fill="hsl(154, 88%, 74%)" opacity="0.72"/>
     <polygon points="32,42 62,50 52,44 34,39" fill="hsl(154, 88%, 74%)" opacity="0.72"/>
     <circle cx="18" cy="38" r="6" fill="hsl(48, 100%, 82%)" stroke="hsl(154, 96%, 62%)" stroke-width="1.6"/>
     <circle cx="18" cy="38" r="2.8" fill="hsl(0, 0%, 100%)"/>
     <circle cx="88" cy="8" r="2" fill="hsl(0, 0%, 100%)"/>
     <circle cx="120" cy="38" r="2.2" fill="hsl(154, 100%, 88%)"/>
     <circle cx="110" cy="56" r="1.8" fill="hsl(154, 100%, 84%)"/>`,
    'hsla(156, 94%, 58%, 0.28)',
    `<radialGradient id="ca-dagger_spray-launch" cx="14%" cy="54%" r="48%"><stop offset="0%" stop-color="hsla(48, 100%, 78%, 0.65)"/><stop offset="45%" stop-color="hsla(154, 96%, 56%, 0.34)"/><stop offset="100%" stop-color="hsla(192, 80%, 14%, 0)"/></radialGradient><linearGradient id="ca-dagger_spray-steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(182, 34%, 58%)"/><stop offset="65%" stop-color="hsl(174, 56%, 94%)"/><stop offset="100%" stop-color="hsl(0, 0%, 100%)"/></linearGradient>`
  ),
  slice: wrapArtSvg(
    'slice',
    'hsl(158, 58%, 15%)',
    'hsl(194, 54%, 7%)',
    `<ellipse cx="72" cy="34" rx="50" ry="26" fill="url(#ca-slice-spark)"/>
     <path d="M44 26 A16 16 0 0 1 70 18 L56 32 Z" fill="hsl(200, 32%, 26%)" stroke="hsl(186, 36%, 56%)" stroke-width="1.2"/>
     <path d="M58 40 L76 26 A16 16 0 0 1 62 52 Z" fill="hsl(200, 32%, 22%)" stroke="hsl(186, 36%, 56%)" stroke-width="1.2"/>
     <path d="M6 62 Q52 24 122 10 Q66 36 16 66 Z" fill="url(#ca-slice-arc)"/>
     <path d="M12 61 Q56 28 118 12" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M22 65 Q66 42 114 26" fill="none" stroke="hsla(148, 100%, 74%, 0.56)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="88,16 120,10 104,22 92,22" fill="url(#ca-slice-blade)" stroke="hsl(204, 56%, 10%)" stroke-width="1.2"/>
     <polygon points="64,22 67,30 75,32 67,34 64,42 61,34 53,32 61,30" fill="hsl(52, 100%, 92%)"/>
     <path d="M50 16 L58 24 M74 40 L84 48" stroke="hsl(48, 100%, 80%)" stroke-width="1.7" stroke-linecap="round"/>
     <circle cx="38" cy="48" r="2" fill="hsl(148, 100%, 78%)"/>
     <circle cx="96" cy="36" r="2" fill="hsl(52, 100%, 84%)"/>
     <circle cx="118" cy="11" r="2.2" fill="hsl(0, 0%, 100%)"/>`,
    'hsla(148, 98%, 58%, 0.30)',
    `<linearGradient id="ca-slice-arc" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsla(152, 98%, 54%, 0.12)"/><stop offset="50%" stop-color="hsl(148, 100%, 66%)"/><stop offset="88%" stop-color="hsl(64, 100%, 88%)"/><stop offset="100%" stop-color="hsl(0, 0%, 100%)"/></linearGradient><radialGradient id="ca-slice-spark" cx="58%" cy="44%" r="36%"><stop offset="0%" stop-color="hsla(146, 100%, 72%, 0.44)"/><stop offset="100%" stop-color="hsla(186, 80%, 12%, 0)"/></radialGradient><linearGradient id="ca-slice-blade" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(188, 30%, 62%)"/><stop offset="100%" stop-color="hsl(0, 0%, 100%)"/></linearGradient>`
  ),
  sneaky_strike: wrapArtSvg(
    'sneaky_strike',
    'hsl(176, 52%, 14%)',
    'hsl(224, 56%, 6%)',
    `<ellipse cx="96" cy="34" rx="34" ry="26" fill="url(#ca-sneaky_strike-vital)"/>
     <path d="M0 72 L0 16 Q18 10 34 22 Q50 14 58 34 Q68 48 56 72 Z" fill="url(#ca-sneaky_strike-smoke)" stroke="hsla(168, 72%, 44%, 0.36)" stroke-width="1.2"/>
     <path d="M10 66 Q14 26 36 16 Q50 22 48 56 L30 66 Z" fill="hsl(198, 54%, 11%)" stroke="hsl(166, 62%, 34%)" stroke-width="1.2"/>
     <polygon points="28,28 38,30 30,33" fill="hsl(148, 100%, 74%)"/>
     <circle cx="96" cy="34" r="13" fill="none" stroke="hsl(46, 98%, 72%)" stroke-width="1.8" stroke-dasharray="6 3"/>
     <circle cx="96" cy="34" r="6" fill="hsl(46, 100%, 74%)" opacity="0.82"/>
     <polygon points="44,44 98,32 88,42 46,50" fill="url(#ca-sneaky_strike-blade)" stroke="hsl(214, 58%, 8%)" stroke-width="1.4"/>
     <line x1="48" y1="45" x2="94" y2="34" stroke="hsl(0, 0%, 100%)" stroke-width="1"/>
     <path d="M32 45 L46 43 L47 52 L33 53 Z" fill="hsl(172, 48%, 22%)" stroke="hsl(206, 56%, 9%)" stroke-width="1.2"/>
     <path d="M98 32 L114 20 M98 32 L116 36 M98 32 L108 48 M98 32 L88 18" stroke="hsl(48, 100%, 82%)" stroke-width="1.9" stroke-linecap="round"/>
     <path d="M10 56 Q28 46 42 56 Q56 66 74 58" fill="none" stroke="hsla(166, 78%, 48%, 0.42)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="112" cy="22" r="2.2" fill="hsl(148, 100%, 76%)"/>
     <circle cx="112" cy="46" r="2" fill="hsl(46, 100%, 82%)"/>
     <circle cx="72" cy="20" r="1.7" fill="hsl(156, 98%, 74%)"/>`,
    'hsla(160, 90%, 52%, 0.26)',
    `<linearGradient id="ca-sneaky_strike-smoke" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(186, 48%, 18%)"/><stop offset="100%" stop-color="hsl(222, 54%, 7%)"/></linearGradient><linearGradient id="ca-sneaky_strike-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(198, 34%, 34%)"/><stop offset="65%" stop-color="hsl(178, 48%, 88%)"/><stop offset="100%" stop-color="hsl(0, 0%, 100%)"/></linearGradient><radialGradient id="ca-sneaky_strike-vital" cx="78%" cy="42%" r="32%"><stop offset="0%" stop-color="hsl(46, 100%, 78%)"/><stop offset="45%" stop-color="hsla(152, 98%, 54%, 0.45)"/><stop offset="100%" stop-color="hsla(210, 60%, 10%, 0)"/></radialGradient>`
  ),
  flying_knee: wrapArtSvg(
    'flying_knee',
    'hsl(166, 56%, 16%)',
    'hsl(206, 52%, 8%)',
    `<ellipse cx="94" cy="28" rx="34" ry="26" fill="url(#ca-flying_knee-impact)"/>
     <polygon points="4,64 82,22 90,34 18,70" fill="url(#ca-flying_knee-trail)"/>
     <path d="M12 52 Q26 42 44 42 Q32 54 14 58 Z" fill="hsl(152, 78%, 48%)" opacity="0.88"/>
     <path d="M36 46 Q46 24 62 22 L72 34 L54 48 Z" fill="url(#ca-flying_knee-garb)" stroke="hsl(206, 58%, 9%)" stroke-width="1.5"/>
     <circle cx="58" cy="18" r="5" fill="hsl(156, 36%, 88%)" stroke="hsl(204, 54%, 11%)" stroke-width="1.2"/>
     <path d="M58 34 L86 24 L80 42 L68 50" fill="hsl(166, 54%, 30%)" stroke="hsl(206, 58%, 9%)" stroke-width="1.6" stroke-linejoin="round"/>
     <polygon points="80,22 92,26 84,35 76,30" fill="hsl(44, 86%, 64%)" stroke="hsl(24, 56%, 14%)" stroke-width="1.2"/>
     <path d="M48 44 L34 62" stroke="hsl(168, 52%, 26%)" stroke-width="4" stroke-linecap="round"/>
     <ellipse cx="94" cy="28" rx="11" ry="20" transform="rotate(-24 94 28)" fill="none" stroke="hsl(48, 100%, 78%)" stroke-width="2.2"/>
     <ellipse cx="102" cy="24" rx="14" ry="24" transform="rotate(-24 102 24)" fill="none" stroke="hsla(148, 100%, 70%, 0.65)" stroke-width="1.6"/>
     <path d="M92 24 L112 12 M96 32 L118 28 M92 38 L112 48" stroke="hsl(48, 100%, 84%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="90" cy="27" r="3.4" fill="hsl(52, 100%, 94%)"/>
     <circle cx="114" cy="18" r="2.2" fill="hsl(48, 100%, 84%)"/>
     <circle cx="114" cy="42" r="2" fill="hsl(148, 100%, 76%)"/>`,
    'hsla(152, 94%, 56%, 0.30)',
    `<radialGradient id="ca-flying_knee-impact" cx="76%" cy="38%" r="36%"><stop offset="0%" stop-color="hsl(50, 100%, 84%)"/><stop offset="45%" stop-color="hsla(146, 98%, 56%, 0.5)"/><stop offset="100%" stop-color="hsla(188, 70%, 12%, 0)"/></radialGradient><linearGradient id="ca-flying_knee-trail" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsla(156, 96%, 54%, 0.08)"/><stop offset="100%" stop-color="hsla(148, 100%, 72%, 0.72)"/></linearGradient><linearGradient id="ca-flying_knee-garb" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(164, 58%, 34%)"/><stop offset="100%" stop-color="hsl(204, 56%, 12%)"/></linearGradient>`
  ),
  quick_slash: wrapArtSvg(
    'quick_slash',
    'hsl(164, 58%, 16%)',
    'hsl(200, 54%, 8%)',
    `<line x1="4" y1="18" x2="88" y2="14" stroke="hsla(158, 100%, 78%, 0.34)" stroke-width="1.8" stroke-linecap="round"/>
     <line x1="2" y1="48" x2="76" y2="42" stroke="hsla(158, 100%, 78%, 0.34)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M8 46 Q54 22 120 14 Q64 34 12 52 Z" fill="url(#ca-quick_slash-streak)"/>
     <path d="M14 48 Q58 26 116 16" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M16 56 Q62 38 112 30" fill="none" stroke="hsl(152, 98%, 66%)" stroke-width="2.2" stroke-linecap="round" opacity="0.8"/>
     <polygon points="78,24 118,14 102,26 82,30" fill="url(#ca-quick_slash-blade)" stroke="hsl(202, 58%, 10%)" stroke-width="1.3"/>
     <rect x="64" y="27" width="14" height="5.5" rx="1.5" transform="rotate(-14 71 29)" fill="hsl(166, 52%, 24%)" stroke="hsl(202, 56%, 10%)" stroke-width="1.1"/>
     <rect x="86" y="42" width="16" height="22" rx="2.4" transform="rotate(14 94 53)" fill="hsl(168, 52%, 26%)" stroke="hsl(48, 96%, 76%)" stroke-width="1.4"/>
     <polygon points="94,48 98,53 94,58 90,53" fill="hsl(150, 100%, 74%)"/>
     <path d="M62 56 Q76 58 84 54" fill="none" stroke="hsl(48, 100%, 78%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M118 8 V20 M112 14 H124" stroke="hsl(0, 0%, 100%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="48" cy="30" r="2.2" fill="hsl(152, 100%, 84%)"/>
     <circle cx="108" cy="40" r="1.9" fill="hsl(48, 100%, 82%)"/>
     <circle cx="28" cy="38" r="1.6" fill="hsl(162, 100%, 80%)"/>`,
    'hsla(154, 96%, 60%, 0.28)',
    `<linearGradient id="ca-quick_slash-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(156, 100%, 66%, 0.06)"/><stop offset="55%" stop-color="hsl(154, 100%, 76%)"/><stop offset="100%" stop-color="hsl(0, 0%, 100%)"/></linearGradient><linearGradient id="ca-quick_slash-blade" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(186, 32%, 58%)"/><stop offset="100%" stop-color="hsl(0, 0%, 100%)"/></linearGradient>`
  ),
  sucker_punch: wrapArtSvg(
    'sucker_punch',
    'hsl(186, 42%, 15%)',
    'hsl(216, 46%, 7%)',
    `<path d="M0 72 L0 44 L44 26 L128 0 L128 36 L68 72 Z" fill="rgba(120,255,180,0.05)"/>
     <ellipse cx="94" cy="27" rx="26" ry="22" fill="url(#ca-sucker_punch-burst)"/>
     <path d="M96 58 Q106 42 114 14 L126 18 L122 68 Z" fill="hsl(210, 34%, 11%)" opacity="0.78"/>
     <path d="M6 68 L36 38 L58 34 L62 46 L26 70 Z" fill="url(#ca-sucker_punch-cloak)" stroke="hsl(154, 52%, 38%)" stroke-width="1"/>
     <path d="M36 42 Q48 34 62 31 L66 44 Q52 48 40 54 Z" fill="hsl(176, 22%, 22%)" stroke="hsl(164, 34%, 44%)" stroke-width="0.9"/>
     <path d="M56 30 L74 22 L84 26 L82 40 L64 46 L55 39 Z" fill="url(#ca-sucker_punch-fist)" stroke="hsl(168, 42%, 62%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M62 41 L81 36 L82 40 L64 46 Z" fill="rgba(4,12,16,0.48)"/>
     <path d="M69 24 L79 25 L80 34 M74 26 L75 36 M66 28 L68 38" fill="none" stroke="hsl(176, 34%, 18%)" stroke-width="1.2" stroke-linecap="round"/>
     <path d="M72 22 L83 25 L81 31" fill="none" stroke="hsl(48, 96%, 72%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
     <polygon points="88,26 96,12 97,23 111,17 101,28 115,35 99,34 102,47 92,35 84,42" fill="hsl(48, 100%, 76%)" opacity="0.92"/>
     <path d="M86 15 Q98 11 108 19 M91 45 Q104 44 113 34" fill="none" stroke="hsl(126, 92%, 64%)" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
     <path d="M12 52 L44 34 M16 62 L48 46 M26 26 L54 22" fill="none" stroke="hsl(164, 86%, 68%)" stroke-width="1.3" stroke-linecap="round" opacity="0.65"/>
     <circle cx="112" cy="12" r="2.2" fill="hsl(52, 100%, 82%)"/>
     <circle cx="116" cy="44" r="1.8" fill="hsl(124, 94%, 66%)"/>`,
    'hsla(46, 92%, 56%, 0.25)',
    `<linearGradient id="ca-sucker_punch-cloak" x1="0" y1="0.8" x2="1" y2="0.2"><stop offset="0%" stop-color="hsl(170, 42%, 12%)"/><stop offset="65%" stop-color="hsl(162, 46%, 24%)"/><stop offset="100%" stop-color="hsl(152, 54%, 34%)"/></linearGradient><linearGradient id="ca-sucker_punch-fist" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(156, 30%, 54%)"/><stop offset="50%" stop-color="hsl(172, 24%, 34%)"/><stop offset="100%" stop-color="hsl(204, 28%, 16%)"/></linearGradient><radialGradient id="ca-sucker_punch-burst" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(50, 100%, 84%)"/><stop offset="48%" stop-color="hsl(118, 92%, 58%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(152, 86%, 40%)" stop-opacity="0"/></radialGradient>`
  ),
  dodge_and_roll: wrapArtSvg(
    'dodge_and_roll',
    'hsl(184, 52%, 15%)',
    'hsl(216, 54%, 8%)',
    `<path d="M0 57 L128 53 L128 72 L0 72 Z" fill="rgba(6,16,24,0.6)"/>
     <path d="M18 0 L42 0 L28 56 L6 56 Z M90 0 L108 0 L98 54 L82 54 Z" fill="rgba(160,255,235,0.045)"/>
     <path d="M8 16 Q64 5 120 18" fill="none" stroke="hsl(354, 88%, 58%)" stroke-width="4.5" stroke-linecap="round" opacity="0.22"/>
     <path d="M10 17 Q64 7 118 17 L105 22 Q64 13 16 20 Z" fill="url(#ca-dodge_and_roll-blade)"/>
     <path d="M16 54 C14 28, 54 22, 84 30 C102 36, 100 58, 70 62 C44 65, 28 56, 32 42" fill="none" stroke="url(#ca-dodge_and_roll-trail)" stroke-width="4.2" stroke-linecap="round"/>
     <polygon points="94,48 106,46 98,58" fill="hsl(174, 100%, 82%)"/>
     <path d="M36 48 C36 33, 52 27, 68 31 C76 33, 82 40, 80 48 L68 54 C54 56, 42 54, 36 48 Z" fill="url(#ca-dodge_and_roll-cloak)" stroke="hsl(162, 88%, 64%)" stroke-width="1.2"/>
     <path d="M64 31 L78 33 L82 43 L70 46 Z" fill="hsl(176, 50%, 16%)" stroke="hsl(164, 92%, 70%)" stroke-width="1"/>
     <path d="M44 48 L56 44 L66 53 L50 56 Z" fill="hsl(196, 36%, 16%)" stroke="hsl(168, 72%, 56%)" stroke-width="0.9"/>
     <path d="M22 44 Q34 32 48 34 L38 42 Z" fill="hsl(158, 72%, 44%)" opacity="0.72"/>
     <path d="M10 61 Q32 58 54 63 M82 62 Q102 58 120 61" fill="none" stroke="hsl(174, 68%, 62%)" stroke-width="1.3" stroke-linecap="round" opacity="0.62"/>
     <circle cx="30" cy="59" r="3" fill="hsl(176, 42%, 52%)" opacity="0.42"/>
     <circle cx="104" cy="58" r="3.4" fill="hsl(172, 56%, 58%)" opacity="0.44"/>
     <circle cx="114" cy="17" r="2" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(168, 92%, 58%, 0.25)',
    `<linearGradient id="ca-dodge_and_roll-trail" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsl(168, 92%, 60%)" stop-opacity="0.14"/><stop offset="55%" stop-color="hsl(164, 94%, 62%)" stop-opacity="0.88"/><stop offset="100%" stop-color="hsl(186, 100%, 84%)"/></linearGradient><linearGradient id="ca-dodge_and_roll-cloak" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(156, 66%, 40%)"/><stop offset="55%" stop-color="hsl(172, 54%, 22%)"/><stop offset="100%" stop-color="hsl(204, 56%, 11%)"/></linearGradient><linearGradient id="ca-dodge_and_roll-blade" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(352, 86%, 56%)" stop-opacity="0.18"/><stop offset="55%" stop-color="hsl(200, 26%, 84%)"/><stop offset="100%" stop-color="hsl(356, 94%, 66%)"/></linearGradient>`
  ),
  piercing_wail: wrapArtSvg(
    'piercing_wail',
    'hsl(178, 56%, 15%)',
    'hsl(232, 50%, 8%)',
    `<ellipse cx="64" cy="37" rx="58" ry="34" fill="url(#ca-piercing_wail-scream)"/>
     <path d="M46 37 L128 4 L128 70 Z" fill="rgba(140,255,230,0.09)"/>
     <path d="M8 68 Q12 16 36 8 Q56 12 58 40 L52 68 Z" fill="url(#ca-piercing_wail-hood)" stroke="hsl(166, 74%, 56%)" stroke-width="1.2"/>
     <path d="M21 46 Q20 19 37 16 Q51 19 50 33 L46 43 L48 57 Q34 59 25 49 Z" fill="url(#ca-piercing_wail-skull)"/>
     <path d="M25 27 L35 29 L29 34 Z M41 29 L48 26 L46 33 Z" fill="hsl(226, 62%, 10%)"/>
     <circle cx="30" cy="30" r="1.4" fill="hsl(162, 100%, 88%)"/>
     <circle cx="44" cy="29.5" r="1.4" fill="hsl(162, 100%, 88%)"/>
     <path d="M34 39 Q46 36 53 46 Q46 56 33 50 Q30 44 34 39 Z" fill="hsl(228, 66%, 8%)" stroke="hsl(164, 100%, 78%)" stroke-width="1.4"/>
     <path d="M37 40 L39 44 L42 40 L45 44 L48 41" fill="none" stroke="hsl(164, 84%, 84%)" stroke-width="1.1" stroke-linejoin="round"/>
     <path d="M58 24 Q70 36 58 50" fill="none" stroke="hsl(164, 100%, 86%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M72 15 Q92 36 72 58" fill="none" stroke="hsl(166, 98%, 72%)" stroke-width="3" stroke-linecap="round" opacity="0.9"/>
     <path d="M89 8 Q114 36 89 65" fill="none" stroke="hsl(176, 94%, 64%)" stroke-width="2.6" stroke-linecap="round" opacity="0.72"/>
     <path d="M106 6 Q126 36 106 67" fill="none" stroke="hsl(186, 90%, 58%)" stroke-width="1.6" stroke-linecap="round" opacity="0.48"/>
     <path d="M50 40 L80 24 M52 44 L94 36 M50 48 L82 54" fill="none" stroke="hsl(162, 100%, 88%)" stroke-width="1.4" stroke-linecap="round"/>
     <polygon points="96,20 112,14 102,25" fill="hsl(164, 100%, 84%)" opacity="0.82"/>
     <polygon points="99,52 116,58 103,46" fill="hsl(164, 100%, 84%)" opacity="0.76"/>`,
    'hsla(164, 96%, 68%, 0.28)',
    `<radialGradient id="ca-piercing_wail-scream" cx="38%" cy="54%" r="64%"><stop offset="0%" stop-color="hsl(166, 100%, 90%)"/><stop offset="35%" stop-color="hsl(162, 94%, 60%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(186, 86%, 36%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-piercing_wail-hood" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(174, 50%, 26%)"/><stop offset="60%" stop-color="hsl(194, 50%, 14%)"/><stop offset="100%" stop-color="hsl(226, 56%, 7%)"/></linearGradient><linearGradient id="ca-piercing_wail-skull" x1="0" y1="0" x2="0.8" y2="1"><stop offset="0%" stop-color="hsl(162, 42%, 82%)"/><stop offset="65%" stop-color="hsl(174, 34%, 52%)"/><stop offset="100%" stop-color="hsl(196, 40%, 26%)"/></linearGradient>`
  ),
  deflect: wrapArtSvg(
    'deflect',
    'hsl(194, 46%, 17%)',
    'hsl(220, 50%, 8%)',
    `<path d="M16 72 L56 0 L84 0 L44 72 Z" fill="rgba(165,245,255,0.06)"/>
     <path d="M26 12 Q52 36 28 62" fill="none" stroke="hsl(174, 92%, 64%)" stroke-width="2" opacity="0.34"/>
     <path d="M36 10 Q66 36 38 64" fill="none" stroke="hsl(172, 96%, 70%)" stroke-width="3.2" opacity="0.46"/>
     <path d="M122 18 L66 35 L69 39 L124 24 Z" fill="url(#ca-deflect-incoming)"/>
     <path d="M64 35 L86 8 L96 10 L69 37 Z" fill="hsl(174, 88%, 70%)" opacity="0.42"/>
     <path d="M40 52 L69 10 L76 13 L50 56 Z" fill="url(#ca-deflect-dagger)" stroke="hsl(202, 42%, 22%)" stroke-width="0.9"/>
     <path d="M45 53 L72 12" fill="none" stroke="hsl(174, 100%, 92%)" stroke-width="1.3" stroke-linecap="round"/>
     <path d="M36 47 L56 59 L53 63 L33 51 Z" fill="hsl(166, 54%, 34%)" stroke="hsl(44, 84%, 64%)" stroke-width="0.9"/>
     <path d="M32 66 L42 54 L48 58 L39 69 Z" fill="hsl(178, 36%, 22%)" stroke="hsl(164, 62%, 48%)" stroke-width="0.9"/>
     <circle cx="64" cy="35" r="16" fill="url(#ca-deflect-spark)"/>
     <polygon points="64,21 67,31 78,28 69,36 79,44 67,39 64,50 61,39 50,43 59,35 51,26 61,31" fill="hsl(50, 100%, 88%)"/>
     <path d="M64 35 L92 14 M64 35 L98 48 M64 35 L48 18" fill="none" stroke="hsl(46, 100%, 76%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="96" cy="12" r="2.2" fill="hsl(48, 100%, 84%)"/>
     <circle cx="102" cy="50" r="1.8" fill="hsl(168, 96%, 76%)"/>`,
    'hsla(174, 90%, 58%, 0.25)',
    `<linearGradient id="ca-deflect-dagger" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(194, 24%, 44%)"/><stop offset="52%" stop-color="hsl(192, 32%, 86%)"/><stop offset="100%" stop-color="hsl(164, 88%, 74%)"/></linearGradient><linearGradient id="ca-deflect-incoming" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(214, 20%, 34%)"/><stop offset="70%" stop-color="hsl(204, 24%, 64%)"/><stop offset="100%" stop-color="hsl(354, 72%, 62%)"/></linearGradient><radialGradient id="ca-deflect-spark" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="45%" stop-color="hsl(44, 100%, 66%)" stop-opacity="0.82"/><stop offset="100%" stop-color="hsl(166, 94%, 56%)" stop-opacity="0"/></radialGradient>`
  ),
  heel_hook: wrapArtSvg(
    'heel_hook',
    'hsl(168, 44%, 15%)',
    'hsl(208, 48%, 8%)',
    `<path d="M0 54 L128 50 L128 72 L0 72 Z" fill="rgba(5,14,18,0.62)"/>
     <path d="M84 10 L102 10 L106 42 L114 60 L96 63 L90 42 Z" fill="hsl(212, 34%, 13%)" stroke="hsl(198, 28%, 26%)" stroke-width="0.9"/>
     <path d="M8 14 Q36 8 60 22 Q36 28 12 36 Z" fill="url(#ca-heel_hook-cloak)" stroke="hsl(152, 68%, 48%)" stroke-width="1"/>
     <path d="M12 62 C38 66, 78 60, 96 38 C82 50, 46 56, 18 52 Z" fill="url(#ca-heel_hook-arc)"/>
     <path d="M8 40 L48 36 L68 38 L78 30 L84 35 L76 50 L58 51 L10 52 Z" fill="url(#ca-heel_hook-boot)" stroke="hsl(154, 58%, 54%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M62 40 L78 30 L84 35 L76 50 L64 49 Z" fill="hsl(196, 28%, 68%)" stroke="hsl(172, 42%, 24%)" stroke-width="0.9"/>
     <polygon points="75,50 86,54 78,44" fill="hsl(48, 96%, 72%)"/>
     <path d="M40 38 L42 50 M52 38 L54 50" fill="none" stroke="hsl(44, 78%, 62%)" stroke-width="1.4" stroke-linecap="round"/>
     <polygon points="90,46 97,35 98,44 111,42 100,50 107,60 95,53 87,60 90,50 81,47" fill="hsl(52, 100%, 78%)"/>
     <path d="M82 26 Q98 18 112 24 M86 18 Q98 12 110 17" fill="none" stroke="hsl(118, 94%, 64%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M18 64 L44 63 M58 64 L78 60" fill="none" stroke="hsl(148, 84%, 62%)" stroke-width="1.3" stroke-linecap="round" opacity="0.65"/>
     <circle cx="106" cy="17" r="2.2" fill="hsl(52, 100%, 84%)"/>
     <circle cx="114" cy="54" r="1.8" fill="hsl(114, 96%, 64%)"/>`,
    'hsla(118, 86%, 54%, 0.25)',
    `<linearGradient id="ca-heel_hook-boot" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(164, 34%, 36%)"/><stop offset="55%" stop-color="hsl(188, 36%, 20%)"/><stop offset="100%" stop-color="hsl(216, 42%, 10%)"/></linearGradient><linearGradient id="ca-heel_hook-arc" x1="0" y1="0.8" x2="1" y2="0.2"><stop offset="0%" stop-color="hsl(152, 92%, 52%)" stop-opacity="0.14"/><stop offset="60%" stop-color="hsl(114, 94%, 58%)"/><stop offset="100%" stop-color="hsl(52, 100%, 78%)"/></linearGradient><linearGradient id="ca-heel_hook-cloak" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(158, 56%, 32%)"/><stop offset="100%" stop-color="hsl(188, 48%, 12%)"/></linearGradient>`
  ),
  flechettes: wrapArtSvg(
    'flechettes',
    'hsl(194, 48%, 15%)',
    'hsl(224, 52%, 8%)',
    `<path d="M0 72 L96 0 L128 0 L128 32 L46 72 Z" fill="rgba(130,255,235,0.06)"/>
     <path d="M4 34 L66 10 M6 54 L94 18 M18 68 L112 32" fill="none" stroke="url(#ca-flechettes-wake)" stroke-width="1.5" stroke-linecap="round"/>
     <polygon points="18,30 68,10 82,7 71,14 20,33" fill="url(#ca-flechettes-steel)" opacity="0.78"/>
     <polygon points="11,33 25,27 28,22 16,27 20,31 19,36 30,31 26,29" fill="url(#ca-flechettes-fletch)" opacity="0.8"/>
     <polygon points="22,51 96,20 114,14 100,26 24,55" fill="url(#ca-flechettes-steel)" stroke="hsl(206, 42%, 18%)" stroke-width="0.7"/>
     <path d="M26 52 L108 17" fill="none" stroke="hsl(174, 100%, 95%)" stroke-width="1.2" stroke-linecap="round"/>
     <polygon points="12,56 30,48 33,42 18,48 23,53 22,60 36,54 31,51" fill="url(#ca-flechettes-fletch)"/>
     <polygon points="36,63 106,36 121,31 109,41 38,66" fill="url(#ca-flechettes-steel)" opacity="0.92"/>
     <polygon points="27,67 44,60 46,55 33,60 37,64 36,69 48,64 44,62" fill="url(#ca-flechettes-fletch)"/>
     <polygon points="50,25 94,8 106,5 96,12 52,28" fill="url(#ca-flechettes-steel)" opacity="0.86"/>
     <polygon points="44,28 56,23 58,19 49,23 52,26 51,30 60,26 57,24" fill="url(#ca-flechettes-fletch)" opacity="0.86"/>
     <polygon points="114,14 116,8 118,14 124,16 118,18 116,24 114,18 108,16" fill="hsl(172, 100%, 90%)"/>
     <circle cx="121" cy="31" r="2.2" fill="hsl(154, 100%, 84%)"/>
     <circle cx="105" cy="6" r="1.8" fill="hsl(172, 100%, 86%)"/>`,
    'hsla(174, 94%, 62%, 0.25)',
    `<linearGradient id="ca-flechettes-steel" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(196, 30%, 42%)"/><stop offset="58%" stop-color="hsl(192, 34%, 88%)"/><stop offset="100%" stop-color="hsl(172, 100%, 90%)"/></linearGradient><linearGradient id="ca-flechettes-fletch" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(174, 82%, 34%)"/><stop offset="100%" stop-color="hsl(146, 96%, 64%)"/></linearGradient><linearGradient id="ca-flechettes-wake" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(170, 96%, 64%)" stop-opacity="0"/><stop offset="100%" stop-color="hsl(170, 100%, 78%)" stop-opacity="0.72"/></linearGradient>`
  ),
  bouncing_flask: wrapArtSvg(
    'bouncing_flask',
    'hsl(150, 54%, 14%)',
    'hsl(198, 50%, 7%)',
    `<path d="M0 56 L128 54 L128 72 L0 72 Z" fill="rgba(5,16,14,0.68)"/>
     <ellipse cx="26" cy="60" rx="18" ry="6" fill="url(#ca-bouncing_flask-glow)"/>
     <ellipse cx="64" cy="62" rx="22" ry="7" fill="url(#ca-bouncing_flask-glow)"/>
     <path d="M12 40 Q20 60 26 60 Q44 16 64 62 Q82 14 96 28 Q106 38 116 58" fill="none" stroke="hsl(114, 96%, 60%)" stroke-width="2" stroke-dasharray="4 3" stroke-linecap="round" opacity="0.8"/>
     <ellipse cx="26" cy="60" rx="11" ry="3.2" fill="none" stroke="hsl(106, 98%, 62%)" stroke-width="1.6"/>
     <ellipse cx="64" cy="62" rx="14" ry="3.8" fill="none" stroke="hsl(106, 100%, 66%)" stroke-width="1.8"/>
     <path d="M55 61 L51 52 M64 60 L65 49 M73 61 L78 53" fill="none" stroke="hsl(102, 100%, 68%)" stroke-width="1.6" stroke-linecap="round"/>
     <g transform="translate(88,28) rotate(24)">
     <rect x="-4.5" y="-21" width="9" height="6" rx="1.5" fill="hsl(32, 48%, 46%)" stroke="hsl(26, 46%, 24%)" stroke-width="0.9"/>
     <path d="M-5 -15 H5 L6 -7 C14 -4 16 7 12 13 C7 18 -7 18 -12 13 C-16 7 -14 -4 -6 -7 Z" fill="url(#ca-bouncing_flask-glass)" stroke="hsl(148, 92%, 72%)" stroke-width="1.2"/>
     <path d="M-11 2 Q-3 -3 11 4 C12 10 8 15 0 15 C-8 15 -13 10 -11 2 Z" fill="url(#ca-bouncing_flask-venom)"/>
     <path d="M-7 -4 Q-10 3 -6 10" fill="none" stroke="hsl(152, 100%, 92%)" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
     </g>
     <circle cx="88" cy="31" r="2.2" fill="hsl(90, 100%, 78%)"/>
     <circle cx="96" cy="14" r="2.5" fill="hsl(108, 100%, 68%)" opacity="0.82"/>
     <circle cx="64" cy="46" r="2" fill="hsl(102, 100%, 72%)"/>
     <circle cx="114" cy="57" r="3" fill="hsl(106, 98%, 62%)" opacity="0.72"/>`,
    'hsla(112, 96%, 54%, 0.28)',
    `<radialGradient id="ca-bouncing_flask-glass" cx="36%" cy="32%" r="68%"><stop offset="0%" stop-color="hsl(148, 86%, 78%)" stop-opacity="0.85"/><stop offset="48%" stop-color="hsl(142, 74%, 38%)" stop-opacity="0.65"/><stop offset="100%" stop-color="hsl(176, 68%, 16%)" stop-opacity="0.92"/></radialGradient><linearGradient id="ca-bouncing_flask-venom" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0%" stop-color="hsl(96, 100%, 66%)"/><stop offset="55%" stop-color="hsl(126, 94%, 46%)"/><stop offset="100%" stop-color="hsl(154, 88%, 26%)"/></linearGradient><radialGradient id="ca-bouncing_flask-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(104, 100%, 62%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(134, 92%, 40%)" stop-opacity="0"/></radialGradient>`
  ),
  crippling_cloud: wrapArtSvg(
    'crippling_cloud',
    'hsl(136, 48%, 13%)',
    'hsl(180, 48%, 6%)',
    `<ellipse cx="64" cy="46" rx="64" ry="26" fill="url(#ca-crippling_cloud-smoke1)"/>
     <circle cx="24" cy="48" r="22" fill="hsl(144, 58%, 16%)" opacity="0.86"/>
     <circle cx="104" cy="46" r="24" fill="hsl(148, 56%, 15%)" opacity="0.86"/>
     <path d="M22 54 C12 40, 22 20, 42 20 C48 8, 80 8, 86 20 C106 20, 116 40, 104 54 C96 64, 78 60, 64 66 C50 60, 30 64, 22 54 Z" fill="url(#ca-crippling_cloud-smoke2)" stroke="hsl(106, 94%, 56%)" stroke-width="1.2" opacity="0.92"/>
     <path d="M36 44 C36 22, 50 15, 64 15 C78 15, 92 22, 92 44 C86 52, 78 52, 74 60 L54 60 C50 52, 42 52, 36 44 Z" fill="hsl(148, 56%, 14%)" opacity="0.72"/>
     <ellipse cx="52" cy="34" rx="8.5" ry="6.5" fill="url(#ca-crippling_cloud-eye)"/>
     <ellipse cx="76" cy="34" rx="8.5" ry="6.5" fill="url(#ca-crippling_cloud-eye)"/>
     <path d="M48 34 L55 36 L51 31 Z M80 34 L73 36 L77 31 Z" fill="hsl(68, 100%, 88%)"/>
     <polygon points="64,39 60,47 68,47" fill="hsl(172, 62%, 8%)"/>
     <path d="M52 52 V59 M58 51 V60 M64 51 V61 M70 51 V60 M76 52 V59" fill="none" stroke="hsl(104, 96%, 64%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M12 24 Q24 14 38 18 M92 16 Q108 14 118 26 M10 64 Q36 56 54 66 M74 66 Q94 56 120 64" fill="none" stroke="hsl(108, 92%, 58%)" stroke-width="1.6" stroke-linecap="round" opacity="0.65"/>
     <circle cx="24" cy="18" r="2.2" fill="hsl(98, 100%, 66%)"/>
     <circle cx="106" cy="22" r="2.4" fill="hsl(104, 100%, 64%)"/>
     <circle cx="88" cy="64" r="2" fill="hsl(282, 76%, 66%)" opacity="0.8"/>`,
    'hsla(104, 96%, 52%, 0.28)',
    `<radialGradient id="ca-crippling_cloud-smoke1" cx="50%" cy="46%" r="54%"><stop offset="0%" stop-color="hsl(122, 82%, 38%)"/><stop offset="65%" stop-color="hsl(144, 68%, 22%)"/><stop offset="100%" stop-color="hsl(172, 62%, 10%)" stop-opacity="0.2"/></radialGradient><radialGradient id="ca-crippling_cloud-smoke2" cx="46%" cy="38%" r="55%"><stop offset="0%" stop-color="hsl(98, 98%, 62%)"/><stop offset="55%" stop-color="hsl(126, 88%, 38%)"/><stop offset="100%" stop-color="hsl(156, 70%, 16%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-crippling_cloud-eye" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(68, 100%, 84%)"/><stop offset="65%" stop-color="hsl(98, 100%, 54%)"/><stop offset="100%" stop-color="hsl(136, 92%, 32%)" stop-opacity="0"/></radialGradient>`
  ),
  accuracy: wrapArtSvg(
    'accuracy',
    'hsl(166, 46%, 15%)',
    'hsl(208, 50%, 8%)',
    `<line x1="64" y1="2" x2="64" y2="70" stroke="hsl(154, 86%, 56%)" stroke-width="0.9" opacity="0.4"/>
     <line x1="6" y1="36" x2="122" y2="36" stroke="hsl(154, 86%, 56%)" stroke-width="0.9" opacity="0.4"/>
     <circle cx="64" cy="36" r="28" fill="url(#ca-accuracy-target)" stroke="hsl(160, 74%, 52%)" stroke-width="1.5"/>
     <circle cx="64" cy="36" r="20" fill="none" stroke="hsl(168, 62%, 56%)" stroke-width="1.3" opacity="0.78"/>
     <circle cx="64" cy="36" r="12" fill="none" stroke="hsl(148, 86%, 60%)" stroke-width="1.6"/>
     <circle cx="64" cy="36" r="5.5" fill="hsl(354, 92%, 56%)" stroke="hsl(48, 100%, 76%)" stroke-width="1.2"/>
     <circle cx="64" cy="36" r="14" fill="url(#ca-accuracy-glow)"/>
     <path d="M64 36 L104 16 L98 24 L66 39 Z" fill="rgba(4,10,16,0.52)"/>
     <path d="M63 36 L98 10 L102 15 L65 38 Z" fill="url(#ca-accuracy-shiv)" stroke="hsl(206, 40%, 20%)" stroke-width="0.8"/>
     <path d="M65 35 L99 12" fill="none" stroke="hsl(164, 100%, 92%)" stroke-width="1.1"/>
     <path d="M97 9 L114 5 L116 10 L101 16 Z" fill="hsl(162, 56%, 30%)" stroke="hsl(46, 86%, 64%)" stroke-width="0.9"/>
     <polygon points="64,26 66,34 74,36 66,38 64,46 62,38 54,36 62,34" fill="hsl(52, 100%, 88%)"/>
     <path d="M24 36 H34 M94 36 H104 M64 4 V12 M64 60 V68" fill="none" stroke="hsl(148, 96%, 68%)" stroke-width="1.7" stroke-linecap="round"/>
     <circle cx="54" cy="26" r="1.7" fill="hsl(48, 100%, 82%)"/>`,
    'hsla(142, 92%, 56%, 0.25)',
    `<radialGradient id="ca-accuracy-target" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(354, 92%, 56%)"/><stop offset="32%" stop-color="hsl(164, 48%, 22%)"/><stop offset="68%" stop-color="hsl(186, 44%, 14%)"/><stop offset="100%" stop-color="hsl(214, 46%, 10%)"/></radialGradient><linearGradient id="ca-accuracy-shiv" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(172, 92%, 84%)"/><stop offset="48%" stop-color="hsl(198, 28%, 74%)"/><stop offset="100%" stop-color="hsl(208, 34%, 32%)"/></linearGradient><radialGradient id="ca-accuracy-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 88%)"/><stop offset="45%" stop-color="hsl(142, 96%, 60%)" stop-opacity="0.7"/><stop offset="100%" stop-color="hsl(152, 90%, 46%)" stop-opacity="0"/></radialGradient>`
  ),
  infinite_blades: wrapArtSvg(
    'infinite_blades',
    'hsl(162, 54%, 15%)',
    'hsl(214, 54%, 7%)',
    `<ellipse cx="64" cy="36" rx="58" ry="30" fill="url(#ca-infinite_blades-vortex)"/>
     <path d="M64 36 C78 14, 106 16, 106 36 C106 56, 78 58, 64 36 C50 14, 22 16, 22 36 C22 56, 50 58, 64 36 Z" fill="none" stroke="url(#ca-infinite_blades-ring)" stroke-width="3.6" opacity="0.9"/>
     <path d="M64 36 C76 20, 99 22, 99 36 C99 50, 76 52, 64 36 C52 20, 29 22, 29 36 C29 50, 52 52, 64 36 Z" fill="none" stroke="hsl(152, 100%, 84%)" stroke-width="1.2" opacity="0.65"/>
     <polygon points="64,6 68,26 64,31 60,26" fill="url(#ca-infinite_blades-blade)" stroke="hsl(186, 48%, 22%)" stroke-width="0.7"/>
     <polygon points="64,66 68,46 64,41 60,46" fill="url(#ca-infinite_blades-blade)" stroke="hsl(186, 48%, 22%)" stroke-width="0.7"/>
     <polygon points="34,12 46,27 42,31 31,20" fill="url(#ca-infinite_blades-blade)" opacity="0.9"/>
     <polygon points="94,12 82,27 86,31 97,20" fill="url(#ca-infinite_blades-blade)" opacity="0.9"/>
     <polygon points="34,60 46,45 42,41 31,52" fill="url(#ca-infinite_blades-blade)" opacity="0.88"/>
     <polygon points="94,60 82,45 86,41 97,52" fill="url(#ca-infinite_blades-blade)" opacity="0.88"/>
     <polygon points="10,36 28,32 32,36 28,40" fill="url(#ca-infinite_blades-blade)"/>
     <polygon points="118,36 100,32 96,36 100,40" fill="url(#ca-infinite_blades-blade)"/>
     <circle cx="64" cy="36" r="4.5" fill="hsl(150, 100%, 86%)"/>
     <circle cx="40" cy="36" r="2.2" fill="hsl(154, 100%, 80%)"/>
     <circle cx="88" cy="36" r="2.2" fill="hsl(154, 100%, 80%)"/>
     <circle cx="64" cy="8" r="1.8" fill="hsl(162, 100%, 92%)"/>`,
    'hsla(154, 96%, 58%, 0.28)',
    `<radialGradient id="ca-infinite_blades-vortex" cx="50%" cy="50%" r="54%"><stop offset="0%" stop-color="hsl(154, 100%, 74%)" stop-opacity="0.58"/><stop offset="55%" stop-color="hsl(168, 92%, 44%)" stop-opacity="0.24"/><stop offset="100%" stop-color="hsl(192, 84%, 20%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-infinite_blades-ring" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(168, 96%, 62%)"/><stop offset="50%" stop-color="hsl(140, 100%, 76%)"/><stop offset="100%" stop-color="hsl(172, 96%, 64%)"/></linearGradient><linearGradient id="ca-infinite_blades-blade" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0%" stop-color="hsl(166, 100%, 92%)"/><stop offset="55%" stop-color="hsl(192, 28%, 74%)"/><stop offset="100%" stop-color="hsl(182, 46%, 30%)"/></linearGradient>`
  ),
  finisher: wrapArtSvg(
    'finisher',
    'hsl(172, 42%, 14%)',
    'hsl(352, 50%, 8%)',
    `<path d="M12 16 L112 52 M14 50 L114 20" fill="none" stroke="url(#ca-finisher-slash)" stroke-width="2.2" stroke-linecap="round" opacity="0.48"/>
     <path d="M24 10 L102 62" fill="none" stroke="hsl(158, 92%, 62%)" stroke-width="2.8" stroke-linecap="round" opacity="0.38"/>
     <circle cx="64" cy="36" r="24" fill="url(#ca-finisher-core)"/>
     <path d="M40 20 L62 14 L56 54 L36 46 Z" fill="hsl(206, 26%, 20%)" stroke="hsl(172, 34%, 44%)" stroke-width="1.1"/>
     <path d="M72 18 L92 26 L88 52 L68 58 Z" fill="hsl(206, 26%, 20%)" stroke="hsl(352, 54%, 48%)" stroke-width="1.1"/>
     <path d="M98 6 L34 62 L28 66 L38 54 L90 5 Z" fill="url(#ca-finisher-blade)" stroke="hsl(50, 100%, 84%)" stroke-width="0.9"/>
     <path d="M94 8 L33 61" fill="none" stroke="hsl(52, 100%, 95%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M84 4 L106 20 L102 24 L80 8 Z" fill="hsl(166, 46%, 28%)" stroke="hsl(46, 92%, 66%)" stroke-width="0.9"/>
     <polygon points="64,14 68,31 88,36 68,41 64,58 60,41 40,36 60,31" fill="hsl(48, 100%, 86%)"/>
     <polygon points="48,28 38,24 44,34" fill="hsl(354, 96%, 64%)"/>
     <polygon points="82,44 96,49 84,38" fill="hsl(154, 94%, 64%)"/>
     <path d="M20 34 L38 36 M90 36 L112 38" fill="none" stroke="hsl(48, 100%, 80%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="24" cy="58" r="2.2" fill="hsl(354, 100%, 72%)"/>
     <circle cx="106" cy="14" r="2" fill="hsl(152, 100%, 76%)"/>`,
    'hsla(352, 94%, 56%, 0.28)',
    `<linearGradient id="ca-finisher-blade" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 90%)"/><stop offset="45%" stop-color="hsl(354, 94%, 64%)"/><stop offset="100%" stop-color="hsl(344, 84%, 34%)"/></linearGradient><linearGradient id="ca-finisher-slash" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(156, 92%, 58%)" stop-opacity="0.15"/><stop offset="50%" stop-color="hsl(154, 96%, 68%)"/><stop offset="100%" stop-color="hsl(354, 96%, 64%)"/></linearGradient><radialGradient id="ca-finisher-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(50, 100%, 92%)"/><stop offset="42%" stop-color="hsl(354, 96%, 58%)" stop-opacity="0.78"/><stop offset="100%" stop-color="hsl(346, 90%, 34%)" stop-opacity="0"/></radialGradient>`
  ),
  eviscerate: wrapArtSvg(
    'eviscerate',
    'hsl(354, 48%, 14%)',
    'hsl(188, 44%, 7%)',
    `<path d="M0 72 L0 36 L58 72 Z M74 0 L128 0 L128 38 Z" fill="url(#ca-eviscerate-mist)"/>
     <path d="M24 8 C54 14, 86 26, 114 44 C82 32, 52 21, 20 14 Z" fill="url(#ca-eviscerate-rip)"/>
     <path d="M12 20 C46 28, 82 40, 112 58 C78 48, 42 36, 10 28 Z" fill="url(#ca-eviscerate-rip)"/>
     <path d="M8 38 C38 45, 70 54, 96 66 C64 60, 34 52, 6 46 Z" fill="url(#ca-eviscerate-rip)"/>
     <path d="M22 11 C54 18, 84 29, 108 42" fill="none" stroke="hsl(46, 100%, 88%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M12 24 C46 33, 80 44, 106 56" fill="none" stroke="hsl(48, 100%, 92%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M10 42 C38 49, 68 57, 90 65" fill="none" stroke="hsl(46, 100%, 86%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M98 32 L119 46 L104 45 L108 38 Z" fill="url(#ca-eviscerate-claw)" stroke="hsl(354, 86%, 32%)" stroke-width="0.7"/>
     <path d="M94 46 L116 61 L100 59 L105 52 Z" fill="url(#ca-eviscerate-claw)" stroke="hsl(354, 86%, 32%)" stroke-width="0.7"/>
     <path d="M78 55 L100 68 L84 67 L89 60 Z" fill="url(#ca-eviscerate-claw)" stroke="hsl(354, 86%, 32%)" stroke-width="0.7"/>
     <circle cx="58" cy="22" r="2.2" fill="hsl(354, 98%, 64%)"/>
     <circle cx="72" cy="52" r="2.6" fill="hsl(354, 96%, 60%)"/>
     <circle cx="42" cy="58" r="2" fill="hsl(148, 92%, 58%)"/>
     <path d="M44 10 L54 16 M86 16 L98 24 M26 56 L38 64" fill="none" stroke="hsl(152, 86%, 60%)" stroke-width="1.3" stroke-linecap="round" opacity="0.65"/>`,
    'hsla(350, 92%, 54%, 0.28)',
    `<linearGradient id="ca-eviscerate-rip" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(354, 94%, 62%)" stop-opacity="0.18"/><stop offset="55%" stop-color="hsl(352, 98%, 62%)"/><stop offset="100%" stop-color="hsl(44, 100%, 84%)"/></linearGradient><linearGradient id="ca-eviscerate-claw" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(188, 28%, 84%)"/><stop offset="55%" stop-color="hsl(198, 24%, 56%)"/><stop offset="100%" stop-color="hsl(352, 88%, 54%)"/></linearGradient><linearGradient id="ca-eviscerate-mist" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(152, 86%, 48%)" stop-opacity="0.32"/><stop offset="100%" stop-color="hsl(354, 88%, 46%)" stop-opacity="0"/></linearGradient>`
  ),
  calculated_gamble: wrapArtSvg(
    'calculated_gamble',
    'hsl(166, 52%, 15%)',
    'hsl(216, 48%, 8%)',
    `<path d="M10 56 Q64 8 118 54" fill="none" stroke="url(#ca-calculated_gamble-gold)" stroke-width="1.3" stroke-dasharray="3 3" opacity="0.52"/>
     <ellipse cx="64" cy="56" rx="52" ry="12" fill="rgba(4,12,16,0.52)"/>
     <g transform="translate(30,50) rotate(-22)"><rect x="-10" y="-14" width="20" height="28" rx="2.2" fill="url(#ca-calculated_gamble-card)" stroke="hsl(156, 72%, 54%)" stroke-width="1.1"/></g>
     <g transform="translate(52,46) rotate(-7)"><rect x="-11" y="-15" width="22" height="30" rx="2.2" fill="url(#ca-calculated_gamble-card)" stroke="hsl(46, 92%, 66%)" stroke-width="1.3"/><polygon points="0,-7 5,0 0,7 -5,0" fill="hsl(150, 92%, 60%)"/></g>
     <g transform="translate(76,47) rotate(10)"><rect x="-11" y="-15" width="22" height="30" rx="2.2" fill="url(#ca-calculated_gamble-card)" stroke="hsl(48, 96%, 72%)" stroke-width="1.3"/><polygon points="0,-7 5,1 0,8 -5,1" fill="hsl(46, 98%, 68%)"/></g>
     <g transform="translate(98,51) rotate(24)"><rect x="-10" y="-14" width="20" height="28" rx="2.2" fill="url(#ca-calculated_gamble-card)" stroke="hsl(156, 72%, 54%)" stroke-width="1.1"/></g>
     <polygon points="44,12 56,17 44,23 32,17" fill="hsl(50, 74%, 90%)" stroke="hsl(172, 42%, 34%)" stroke-width="0.9"/>
     <polygon points="32,17 44,23 44,34 32,28" fill="url(#ca-calculated_gamble-die)" stroke="hsl(172, 42%, 34%)" stroke-width="0.9"/>
     <polygon points="44,23 56,17 56,28 44,34" fill="hsl(174, 34%, 34%)" stroke="hsl(172, 42%, 34%)" stroke-width="0.9"/>
     <circle cx="44" cy="17.5" r="1.6" fill="hsl(352, 86%, 52%)"/>
     <polygon points="84,9 95,14 84,20 73,14" fill="hsl(50, 78%, 92%)" stroke="hsl(172, 42%, 34%)" stroke-width="0.9"/>
     <polygon points="73,14 84,20 84,30 73,24" fill="url(#ca-calculated_gamble-die)" stroke="hsl(172, 42%, 34%)" stroke-width="0.9"/>
     <polygon points="84,20 95,14 95,24 84,30" fill="hsl(176, 36%, 32%)" stroke="hsl(172, 42%, 34%)" stroke-width="0.9"/>
     <path d="M38 25.5 h0.1 M80 14 h0.1 M88 14 h0.1" fill="none" stroke="hsl(166, 68%, 14%)" stroke-width="2.7" stroke-linecap="round"/>
     <path d="M50 25.5 h0.1 M89 22 h0.1" fill="none" stroke="hsl(50, 100%, 78%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M18 62 Q64 68 110 62" fill="none" stroke="url(#ca-calculated_gamble-gold)" stroke-width="1.4" stroke-linecap="round" opacity="0.72"/>`,
    'hsla(44, 92%, 58%, 0.25)',
    `<linearGradient id="ca-calculated_gamble-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(172, 42%, 28%)"/><stop offset="100%" stop-color="hsl(206, 48%, 12%)"/></linearGradient><linearGradient id="ca-calculated_gamble-die" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 62%, 90%)"/><stop offset="60%" stop-color="hsl(152, 30%, 66%)"/><stop offset="100%" stop-color="hsl(176, 36%, 36%)"/></linearGradient><linearGradient id="ca-calculated_gamble-gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(42, 92%, 56%)"/><stop offset="50%" stop-color="hsl(52, 100%, 82%)"/><stop offset="100%" stop-color="hsl(152, 92%, 62%)"/></linearGradient>`
  ),
  footwork: wrapArtSvg(
    'footwork',
    'hsl(168, 52%, 16%)',
    'hsl(206, 50%, 8%)',
    `<path d="M0 64 L44 52 L60 56 L16 72 Z M58 46 L114 34 L128 38 L78 52 Z" fill="rgba(8,22,26,0.58)"/>
     <ellipse cx="36" cy="58" rx="22" ry="7" fill="url(#ca-footwork-ring)"/>
     <ellipse cx="86" cy="40" rx="24" ry="7.5" fill="url(#ca-footwork-ring)"/>
     <path d="M8 62 C36 62, 48 42, 72 40 C94 38, 104 20, 122 14" fill="none" stroke="url(#ca-footwork-wind)" stroke-width="3.4" stroke-linecap="round"/>
     <path d="M16 54 C40 48, 56 30, 82 28 C98 26, 108 14, 120 10" fill="none" stroke="hsl(162, 100%, 82%)" stroke-width="1.3" stroke-linecap="round" opacity="0.65"/>
     <ellipse cx="36" cy="58" rx="14" ry="3.6" fill="none" stroke="hsl(150, 96%, 64%)" stroke-width="1.5"/>
     <ellipse cx="86" cy="40" rx="16" ry="4" fill="none" stroke="hsl(150, 100%, 70%)" stroke-width="1.7"/>
     <path d="M24 34 L36 32 L40 48 L50 53 L48 58 L28 56 L26 48 Z" fill="url(#ca-footwork-boot)" stroke="hsl(154, 72%, 56%)" stroke-width="1.1" stroke-linejoin="round"/>
     <path d="M74 14 L88 12 L90 29 L102 35 L99 40 L76 38 L75 28 Z" fill="url(#ca-footwork-boot)" stroke="hsl(152, 86%, 64%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M78 18 L86 19 M78 23 L87 24 M78 28 L88 29" fill="none" stroke="hsl(48, 92%, 70%)" stroke-width="1.2" stroke-linecap="round"/>
     <path d="M12 18 Q44 10 66 22 Q44 26 16 28 Z" fill="hsl(164, 54%, 24%)" opacity="0.72"/>
     <circle cx="62" cy="44" r="2" fill="hsl(148, 100%, 76%)"/>
     <circle cx="110" cy="24" r="2.2" fill="hsl(154, 100%, 82%)"/>
     <circle cx="52" cy="22" r="1.6" fill="hsl(166, 98%, 78%)"/>`,
    'hsla(154, 94%, 58%, 0.25)',
    `<linearGradient id="ca-footwork-wind" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(164, 90%, 54%)" stop-opacity="0.16"/><stop offset="55%" stop-color="hsl(148, 98%, 66%)"/><stop offset="100%" stop-color="hsl(174, 100%, 84%)"/></linearGradient><linearGradient id="ca-footwork-boot" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(162, 44%, 38%)"/><stop offset="58%" stop-color="hsl(186, 40%, 20%)"/><stop offset="100%" stop-color="hsl(214, 46%, 10%)"/></linearGradient><radialGradient id="ca-footwork-ring" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(146, 100%, 70%)" stop-opacity="0.6"/><stop offset="100%" stop-color="hsl(168, 92%, 44%)" stop-opacity="0"/></radialGradient>`
  ),
  leg_sweep: wrapArtSvg(
    'leg_sweep',
    'hsl(178, 52%, 15%)',
    'hsl(214, 52%, 8%)',
    `<path d="M0 53 L128 51 L128 72 L0 72 Z" fill="rgba(5,14,22,0.62)"/>
     <path d="M88 18 L104 12 L116 32 L106 44 L94 34 Z" fill="hsl(212, 34%, 13%)" stroke="hsl(200, 32%, 28%)" stroke-width="0.9"/>
     <circle cx="96" cy="12" r="5" fill="hsl(212, 34%, 14%)" stroke="hsl(200, 32%, 28%)" stroke-width="0.8"/>
     <path d="M96 42 L114 48 L108 58 L92 50 Z" fill="hsl(212, 32%, 15%)" stroke="hsl(200, 30%, 26%)" stroke-width="0.8"/>
     <path d="M12 56 C14 22, 46 12, 68 24 C50 28, 36 42, 32 58 Z" fill="url(#ca-leg_sweep-shield)"/>
     <path d="M24 26 L36 16 L46 24 L42 32 L26 32 Z" fill="hsl(164, 58%, 26%)" stroke="hsl(162, 86%, 62%)" stroke-width="1"/>
     <path d="M14 54 L26 30 L46 32 L42 52 L20 56 Z" fill="url(#ca-leg_sweep-cloak)" stroke="hsl(164, 78%, 56%)" stroke-width="1.1" stroke-linejoin="round"/>
     <path d="M38 45 L84 44 L92 49 L82 54 L36 53 Z" fill="hsl(182, 40%, 22%)" stroke="hsl(168, 80%, 60%)" stroke-width="1.1"/>
     <path d="M16 58 C46 66, 86 62, 108 46 C86 55, 48 56, 20 50 Z" fill="url(#ca-leg_sweep-arc)"/>
     <path d="M20 54 C52 60, 84 56, 104 46" fill="none" stroke="hsl(176, 100%, 90%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M14 24 Q34 10 62 18" fill="none" stroke="hsl(176, 98%, 74%)" stroke-width="2" stroke-linecap="round" opacity="0.82"/>
     <path d="M104 16 Q112 10 118 16 Q112 22 107 19" fill="none" stroke="hsl(282, 86%, 72%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="92,48 104,40 99,51 109,56 95,55" fill="hsl(172, 100%, 86%)"/>
     <circle cx="80" cy="62" r="2.1" fill="hsl(166, 96%, 72%)"/>`,
    'hsla(166, 92%, 56%, 0.26)',
    `<linearGradient id="ca-leg_sweep-arc" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsl(176, 92%, 58%)" stop-opacity="0.16"/><stop offset="52%" stop-color="hsl(164, 96%, 60%)"/><stop offset="100%" stop-color="hsl(182, 100%, 84%)"/></linearGradient><linearGradient id="ca-leg_sweep-cloak" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(158, 62%, 38%)"/><stop offset="65%" stop-color="hsl(178, 50%, 19%)"/><stop offset="100%" stop-color="hsl(214, 52%, 9%)"/></linearGradient><linearGradient id="ca-leg_sweep-shield" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(178, 100%, 76%)" stop-opacity="0.62"/><stop offset="100%" stop-color="hsl(166, 90%, 44%)" stop-opacity="0.06"/></linearGradient>`
  ),
  backstab: wrapArtSvg(
    'backstab',
    'hsl(182, 44%, 12%)',
    'hsl(232, 48%, 6%)',
    `<path d="M24 0 L52 0 L18 72 L0 72 Z" fill="rgba(140,240,220,0.06)"/>
     <path d="M52 68 L58 26 L70 20 L88 22 L98 30 L96 68 Z" fill="url(#ca-backstab-victim)" stroke="hsl(186, 36%, 38%)" stroke-width="1"/>
     <path d="M68 18 L77 8 L88 15 L85 23 L70 22 Z" fill="hsl(218, 36%, 16%)" stroke="hsl(178, 44%, 46%)" stroke-width="0.9"/>
     <path d="M59 27 Q74 22 92 29 M64 46 L90 48" fill="none" stroke="hsl(174, 54%, 56%)" stroke-width="1.1" opacity="0.5"/>
     <circle cx="60" cy="37" r="14" fill="url(#ca-backstab-glint)"/>
     <path d="M4 32 L24 30 L28 42 L6 46 Z" fill="hsl(172, 46%, 18%)" stroke="hsl(158, 66%, 44%)" stroke-width="1"/>
     <path d="M22 31 L30 31 L32 42 L23 42 Z" fill="hsl(182, 34%, 28%)" stroke="hsl(164, 58%, 54%)" stroke-width="0.9"/>
     <path d="M29 27 L34 27 L34 47 L29 47 Z" fill="hsl(44, 78%, 56%)" stroke="hsl(30, 56%, 24%)" stroke-width="0.8"/>
     <polygon points="34,34 61,34 61,40 34,40" fill="url(#ca-backstab-blade)"/>
     <polygon points="96,34 119,37 96,40" fill="url(#ca-backstab-blade)" stroke="hsl(352, 94%, 68%)" stroke-width="0.7"/>
     <line x1="35" y1="36" x2="59" y2="36" stroke="hsl(164, 100%, 88%)" stroke-width="1"/>
     <polygon points="60,26 63,35 72,37 63,39 60,48 57,39 48,37 57,35" fill="hsl(48, 100%, 86%)"/>
     <path d="M98 37 L116 29 M98 37 L116 45" fill="none" stroke="hsl(354, 96%, 64%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="118" cy="37" r="2.3" fill="hsl(354, 100%, 74%)"/>
     <circle cx="48" cy="45" r="1.8" fill="hsl(148, 94%, 58%)" opacity="0.8"/>`,
    'hsla(352, 88%, 52%, 0.24)',
    `<linearGradient id="ca-backstab-blade" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(196, 26%, 56%)"/><stop offset="68%" stop-color="hsl(188, 34%, 88%)"/><stop offset="100%" stop-color="hsl(352, 96%, 62%)"/></linearGradient><linearGradient id="ca-backstab-victim" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 34%, 24%)"/><stop offset="55%" stop-color="hsl(220, 38%, 12%)"/><stop offset="100%" stop-color="hsl(232, 44%, 7%)"/></linearGradient><radialGradient id="ca-backstab-glint" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(354, 100%, 78%)"/><stop offset="55%" stop-color="hsl(352, 92%, 52%)" stop-opacity="0.68"/><stop offset="100%" stop-color="hsl(352, 92%, 30%)" stop-opacity="0"/></radialGradient>`
  ),
  dash: wrapArtSvg(
    'dash',
    'hsl(176, 56%, 15%)',
    'hsl(214, 54%, 8%)',
    `<path d="M0 58 L128 56 L128 72 L0 72 Z" fill="rgba(5,16,24,0.58)"/>
     <path d="M4 20 H66 M0 34 H56 M8 48 H64 M14 60 H88" fill="none" stroke="hsl(170, 94%, 66%)" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>
     <path d="M26 52 L42 26 L56 24 L46 54 Z" fill="hsl(172, 82%, 52%)" opacity="0.24"/>
     <path d="M10 34 Q38 22 68 24 L56 36 Q32 36 12 42 Z" fill="hsl(158, 66%, 32%)" opacity="0.82"/>
     <path d="M44 56 L62 24 L82 26 L76 46 L62 50 L54 58 Z" fill="url(#ca-dash-cloak)" stroke="hsl(164, 88%, 64%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M68 24 L78 14 L89 20 L84 28 L72 28 Z" fill="hsl(174, 54%, 22%)" stroke="hsl(164, 92%, 68%)" stroke-width="1.1"/>
     <circle cx="83" cy="21" r="1.5" fill="hsl(160, 100%, 86%)"/>
     <path d="M78 32 L114 29 L98 37 Z" fill="url(#ca-dash-blade)"/>
     <path d="M72 44 L106 42 L92 49 Z" fill="url(#ca-dash-blade)" opacity="0.88"/>
     <path d="M76 8 C102 18, 118 30, 120 36 C118 42, 102 54, 76 64 C94 50, 102 42, 104 36 C102 30, 94 22, 76 8 Z" fill="url(#ca-dash-prow)"/>
     <path d="M84 12 C104 22, 116 32, 118 36 C116 40, 104 50, 84 60" fill="none" stroke="hsl(176, 100%, 90%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="118" cy="36" r="3" fill="hsl(176, 100%, 92%)"/>
     <circle cx="104" cy="18" r="1.8" fill="hsl(154, 100%, 78%)"/>
     <circle cx="104" cy="54" r="1.8" fill="hsl(154, 100%, 78%)"/>`,
    'hsla(168, 96%, 60%, 0.28)',
    `<linearGradient id="ca-dash-prow" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsl(174, 96%, 60%)" stop-opacity="0.06"/><stop offset="68%" stop-color="hsl(170, 96%, 62%)" stop-opacity="0.58"/><stop offset="100%" stop-color="hsl(178, 100%, 88%)"/></linearGradient><linearGradient id="ca-dash-cloak" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(158, 66%, 38%)"/><stop offset="60%" stop-color="hsl(178, 54%, 20%)"/><stop offset="100%" stop-color="hsl(214, 52%, 10%)"/></linearGradient><linearGradient id="ca-dash-blade" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(192, 34%, 64%)"/><stop offset="100%" stop-color="hsl(166, 100%, 90%)"/></linearGradient>`
  ),
  skewer: wrapArtSvg(
    'skewer',
    'hsl(184, 46%, 14%)',
    'hsl(222, 50%, 7%)',
    `<path d="M0 72 L106 0 L128 0 L128 22 L28 72 Z" fill="rgba(140,255,220,0.06)"/>
     <g transform="translate(38,48) rotate(-25)"><ellipse cx="0" cy="0" rx="8" ry="15" fill="url(#ca-skewer-ring)" stroke="hsl(354, 88%, 64%)" stroke-width="1.2"/></g>
     <g transform="translate(65,35) rotate(-25)"><ellipse cx="0" cy="0" rx="9" ry="17" fill="url(#ca-skewer-ring)" stroke="hsl(354, 92%, 68%)" stroke-width="1.3"/></g>
     <g transform="translate(92,22) rotate(-25)"><ellipse cx="0" cy="0" rx="7.5" ry="14" fill="url(#ca-skewer-ring)" stroke="hsl(354, 88%, 64%)" stroke-width="1.2"/></g>
     <polygon points="8,64 116,10 120,10 116,15 12,67" fill="url(#ca-skewer-lance)" stroke="hsl(208, 42%, 18%)" stroke-width="0.7"/>
     <line x1="11" y1="64" x2="117" y2="11" stroke="hsl(172, 100%, 94%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M10 56 L22 68 L18 70 L7 59 Z" fill="hsl(162, 56%, 32%)" stroke="hsl(46, 88%, 66%)" stroke-width="0.9"/>
     <circle cx="38" cy="48" r="8" fill="url(#ca-skewer-burst)"/>
     <circle cx="65" cy="35" r="10" fill="url(#ca-skewer-burst)"/>
     <circle cx="92" cy="22" r="8" fill="url(#ca-skewer-burst)"/>
     <path d="M31 37 Q40 46 45 59 M57 22 Q68 33 73 48 M85 11 Q94 20 99 33" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.5" stroke-linecap="round"/>
     <polygon points="118,11 121,5 123,11 127,13 122,15 120,20 118,15 113,13" fill="hsl(172, 100%, 90%)"/>
     <circle cx="52" cy="24" r="1.8" fill="hsl(354, 96%, 68%)"/>
     <circle cx="80" cy="46" r="1.8" fill="hsl(154, 96%, 68%)"/>`,
    'hsla(164, 88%, 54%, 0.25)',
    `<linearGradient id="ca-skewer-lance" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(196, 26%, 44%)"/><stop offset="52%" stop-color="hsl(190, 38%, 88%)"/><stop offset="100%" stop-color="hsl(166, 100%, 88%)"/></linearGradient><linearGradient id="ca-skewer-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(352, 78%, 54%)"/><stop offset="60%" stop-color="hsl(344, 62%, 28%)"/><stop offset="100%" stop-color="hsl(220, 44%, 14%)"/></linearGradient><radialGradient id="ca-skewer-burst" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(50, 100%, 88%)"/><stop offset="55%" stop-color="hsl(154, 94%, 58%)" stop-opacity="0.65"/><stop offset="100%" stop-color="hsl(168, 90%, 40%)" stop-opacity="0"/></radialGradient>`
  ),
  predator: wrapArtSvg(
    'predator',
    'hsl(158, 52%, 11%)',
    'hsl(204, 54%, 6%)',
    `<path d="M0 0 L24 0 L10 38 L0 58 Z M128 0 L104 0 L118 38 L128 58 Z" fill="hsl(192, 48%, 6%)" opacity="0.9"/>
     <path d="M28 60 L34 22 L64 7 L94 22 L100 60 Q80 48 64 56 Q48 48 28 60 Z" fill="url(#ca-predator-hood)" stroke="hsl(152, 74%, 42%)" stroke-width="1.2"/>
     <path d="M40 22 L32 7 L46 14 L64 9 L82 14 L96 7 L88 22 L76 28 L64 20 L52 28 Z" fill="hsl(158, 28%, 74%)" stroke="hsl(172, 42%, 24%)" stroke-width="0.9"/>
     <path d="M40 24 L64 20 L88 24 L82 44 L64 49 L46 44 Z" fill="hsl(206, 56%, 7%)"/>
     <ellipse cx="52" cy="31" rx="10" ry="6.5" fill="url(#ca-predator-eye)"/>
     <ellipse cx="76" cy="31" rx="10" ry="6.5" fill="url(#ca-predator-eye)"/>
     <path d="M45 29 L59 33 L49 35 Z M83 29 L69 33 L79 35 Z" fill="hsl(66, 100%, 88%)"/>
     <line x1="52" y1="29" x2="52" y2="35" stroke="hsl(174, 80%, 8%)" stroke-width="1.4"/>
     <line x1="76" y1="29" x2="76" y2="35" stroke="hsl(174, 80%, 8%)" stroke-width="1.4"/>
     <path d="M10 42 Q28 34 46 48 L36 66 L29 52 L22 65 L18 50 L8 59 Z" fill="url(#ca-predator-claw)" stroke="hsl(172, 54%, 20%)" stroke-width="0.9"/>
     <path d="M118 42 Q100 34 82 48 L92 66 L99 52 L106 65 L110 50 L120 59 Z" fill="url(#ca-predator-claw)" stroke="hsl(172, 54%, 20%)" stroke-width="0.9"/>
     <path d="M14 38 Q32 46 46 67 M114 38 Q96 46 82 67" fill="none" stroke="hsl(134, 98%, 62%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M36 31 L18 28 M92 31 L110 28" fill="none" stroke="hsl(114, 100%, 72%)" stroke-width="1.3" stroke-linecap="round" opacity="0.82"/>
     <circle cx="64" cy="61" r="2.2" fill="hsl(126, 98%, 68%)"/>`,
    'hsla(138, 96%, 54%, 0.28)',
    `<linearGradient id="ca-predator-hood" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(164, 48%, 22%)"/><stop offset="65%" stop-color="hsl(188, 50%, 11%)"/><stop offset="100%" stop-color="hsl(216, 54%, 5%)"/></linearGradient><radialGradient id="ca-predator-eye" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(62, 100%, 88%)"/><stop offset="52%" stop-color="hsl(122, 100%, 56%)"/><stop offset="100%" stop-color="hsl(152, 92%, 34%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-predator-claw" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(162, 100%, 86%)"/><stop offset="55%" stop-color="hsl(188, 34%, 60%)"/><stop offset="100%" stop-color="hsl(172, 70%, 26%)"/></linearGradient>`
  ),
  blur: wrapArtSvg(
    'blur',
    'hsl(188, 54%, 15%)',
    'hsl(234, 52%, 8%)',
    `<path d="M0 59 L128 59 L128 72 L0 72 Z" fill="rgba(6,14,28,0.6)"/>
     <path d="M8 22 H112 M4 38 H118 M12 52 H114" fill="none" stroke="hsl(178, 94%, 68%)" stroke-width="1.3" stroke-linecap="round" opacity="0.34"/>
     <path d="M12 63 L24 27 L34 11 L44 21 L42 36 L48 63 L34 55 Z" fill="url(#ca-blur-ghost1)" stroke="hsl(178, 92%, 72%)" stroke-width="0.8" opacity="0.72"/>
     <path d="M38 63 L50 25 L60 9 L70 19 L68 35 L74 63 L60 55 Z" fill="url(#ca-blur-ghost2)" stroke="hsl(174, 96%, 74%)" stroke-width="1"/>
     <path d="M64 64 L76 24 L86 8 L98 18 L96 36 L104 64 L88 55 L78 64 Z" fill="url(#ca-blur-hero)" stroke="hsl(168, 96%, 72%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M82 18 L95 17 L93 26 L81 24 Z" fill="hsl(214, 58%, 10%)"/>
     <circle cx="91" cy="21" r="1.6" fill="hsl(164, 100%, 88%)"/>
     <path d="M94 34 L117 24 L105 38 Z" fill="hsl(176, 92%, 84%)"/>
     <path d="M106 14 C118 24, 118 48, 106 58" fill="none" stroke="hsl(176, 100%, 78%)" stroke-width="2.2" stroke-linecap="round" opacity="0.82"/>
     <path d="M112 20 C122 28, 122 44, 112 52" fill="none" stroke="hsl(166, 94%, 68%)" stroke-width="1.4" stroke-linecap="round" opacity="0.54"/>
     <path d="M24 32 H76 M30 46 H82" fill="none" stroke="hsl(174, 100%, 82%)" stroke-width="1.6" stroke-linecap="round" opacity="0.58"/>
     <circle cx="24" cy="20" r="1.8" fill="hsl(178, 96%, 78%)" opacity="0.7"/>
     <circle cx="62" cy="14" r="2" fill="hsl(170, 100%, 84%)"/>`,
    'hsla(176, 94%, 64%, 0.26)',
    `<linearGradient id="ca-blur-ghost1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(180, 94%, 68%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(214, 84%, 38%)" stop-opacity="0.06"/></linearGradient><linearGradient id="ca-blur-ghost2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(172, 94%, 66%)" stop-opacity="0.56"/><stop offset="100%" stop-color="hsl(198, 74%, 26%)" stop-opacity="0.2"/></linearGradient><linearGradient id="ca-blur-hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(164, 68%, 40%)"/><stop offset="60%" stop-color="hsl(186, 56%, 20%)"/><stop offset="100%" stop-color="hsl(222, 58%, 10%)"/></linearGradient>`
  ),
  terror: wrapArtSvg(
    'terror',
    'hsl(270, 48%, 13%)',
    'hsl(208, 52%, 6%)',
    `<ellipse cx="64" cy="36" rx="58" ry="34" fill="url(#ca-terror-aura)"/>
     <path d="M36 68 Q34 14 64 8 Q94 14 92 68 Z" fill="hsl(242, 48%, 8%)" opacity="0.88"/>
     <path d="M4 68 L14 36 C16 20, 28 12, 42 18 C32 20, 25 26, 24 34 C31 28, 38 28, 44 33 C34 34, 28 38, 25 46 C33 42, 39 44, 42 50 C32 50, 24 56, 20 68 Z" fill="url(#ca-terror-claw)" stroke="hsl(286, 72%, 54%)" stroke-width="1"/>
     <path d="M124 68 L114 36 C112 20, 100 12, 86 18 C96 20, 103 26, 104 34 C97 28, 90 28, 84 33 C94 34, 100 38, 103 46 C95 42, 89 44, 86 50 C96 50, 104 56, 108 68 Z" fill="url(#ca-terror-claw)" stroke="hsl(286, 72%, 54%)" stroke-width="1"/>
     <ellipse cx="52" cy="33" rx="10" ry="9" fill="url(#ca-terror-eye)"/>
     <ellipse cx="76" cy="33" rx="10" ry="9" fill="url(#ca-terror-eye)"/>
     <path d="M44 32 Q52 24 60 33 Q52 41 44 32 Z M84 32 Q76 24 68 33 Q76 41 84 32 Z" fill="hsl(152, 86%, 88%)" stroke="hsl(282, 84%, 44%)" stroke-width="1.2"/>
     <circle cx="52" cy="33" r="1.9" fill="hsl(268, 78%, 8%)"/>
     <circle cx="76" cy="33" r="1.9" fill="hsl(268, 78%, 8%)"/>
     <path d="M48 54 C54 45, 74 45, 80 54 C74 62, 54 62, 48 54 Z" fill="hsl(274, 62%, 10%)" stroke="hsl(352, 88%, 58%)" stroke-width="1.2"/>
     <path d="M64 4 L60 16 L67 21 M36 8 L45 19 M92 8 L83 19 M42 62 L52 54 M86 62 L76 54" fill="none" stroke="hsl(352, 94%, 60%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M18 10 Q64 2 110 10" fill="none" stroke="hsl(284, 90%, 66%)" stroke-width="1.2" opacity="0.5"/>
     <circle cx="64" cy="23" r="1.8" fill="hsl(354, 96%, 66%)"/>`,
    'hsla(282, 86%, 54%, 0.26)',
    `<radialGradient id="ca-terror-aura" cx="50%" cy="46%" r="56%"><stop offset="0%" stop-color="hsl(286, 92%, 52%)" stop-opacity="0.48"/><stop offset="55%" stop-color="hsl(172, 74%, 22%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(226, 62%, 6%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-terror-claw" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(278, 44%, 26%)"/><stop offset="60%" stop-color="hsl(232, 48%, 12%)"/><stop offset="100%" stop-color="hsl(198, 54%, 6%)"/></linearGradient><radialGradient id="ca-terror-eye" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(62, 100%, 94%)"/><stop offset="56%" stop-color="hsl(148, 96%, 64%)"/><stop offset="100%" stop-color="hsl(284, 92%, 44%)" stop-opacity="0"/></radialGradient>`
  ),
  caltrops: wrapArtSvg(
    'caltrops',
    'hsl(198, 36%, 15%)',
    'hsl(220, 46%, 7%)',
    `<path d="M0 38 L128 38 L128 72 L0 72 Z" fill="url(#ca-caltrops-floor)"/>
     <path d="M18 0 L52 0 L94 72 L46 72 Z" fill="rgba(165,245,235,0.06)"/>
     <path d="M0 46 H128 M18 38 L4 72 M56 38 L48 72 M96 38 L108 72" fill="none" stroke="rgba(150,210,220,0.12)" stroke-width="1"/>
     <ellipse cx="72" cy="57" rx="22" ry="6.5" fill="rgba(2,6,12,0.68)"/>
     <ellipse cx="32" cy="52" rx="13" ry="4" fill="rgba(2,6,12,0.58)"/>
     <ellipse cx="104" cy="48" rx="10" ry="3.2" fill="rgba(2,6,12,0.52)"/>
     <polygon points="32,33 36,48 45,52 33,50 20,53 28,47" fill="url(#ca-caltrops-iron)" stroke="hsl(204, 34%, 70%)" stroke-width="0.8"/>
     <polygon points="104,33 107,44 114,48 104,46 94,49 101,44" fill="url(#ca-caltrops-iron)" stroke="hsl(204, 30%, 62%)" stroke-width="0.7" opacity="0.88"/>
     <polygon points="72,13 78,44 96,55 72,50 48,56 66,44" fill="url(#ca-caltrops-iron)" stroke="hsl(200, 32%, 78%)" stroke-width="1.1" stroke-linejoin="round"/>
     <polygon points="72,13 78,44 72,50" fill="rgba(6,12,20,0.44)"/>
     <polygon points="72,13 75,26 69,26" fill="url(#ca-caltrops-tip)"/>
     <path d="M72 14 L67 44 L49 55" fill="none" stroke="hsl(186, 72%, 90%)" stroke-width="1.2" stroke-linecap="round"/>
     <polygon points="72,7 73.8,12 79,13.5 73.8,15 72,20 70.2,15 65,13.5 70.2,12" fill="hsl(142, 100%, 84%)"/>
     <polygon points="32,29 33,33 37,34 33,35 32,39 31,35 27,34 31,33" fill="hsl(174, 100%, 86%)"/>
     <circle cx="104" cy="33" r="1.8" fill="hsl(166, 94%, 78%)"/>`,
    'hsla(166, 80%, 54%, 0.22)',
    `<linearGradient id="ca-caltrops-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(210, 32%, 15%)"/><stop offset="100%" stop-color="hsl(222, 42%, 7%)"/></linearGradient><linearGradient id="ca-caltrops-iron" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(196, 26%, 82%)"/><stop offset="48%" stop-color="hsl(206, 22%, 44%)"/><stop offset="100%" stop-color="hsl(218, 30%, 16%)"/></linearGradient><linearGradient id="ca-caltrops-tip" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(136, 100%, 72%)"/><stop offset="100%" stop-color="hsl(196, 26%, 62%)"/></linearGradient>`
  ),
  well_laid_plans: wrapArtSvg(
    'well_laid_plans',
    'hsl(168, 42%, 14%)',
    'hsl(208, 46%, 7%)',
    `<rect x="16" y="16" width="96" height="48" rx="4" fill="rgba(4,10,14,0.58)"/>
     <path d="M18 14 H110 C114 14 114 22 110 22 V58 C110 62 104 62 100 60 H18 C14 60 14 54 18 52 V14 Z" fill="url(#ca-well_laid_plans-parch)" stroke="hsl(30, 44%, 26%)" stroke-width="1.2"/>
     <rect x="12" y="12" width="7" height="48" rx="3.2" fill="hsl(34, 38%, 44%)" stroke="hsl(28, 46%, 22%)" stroke-width="1"/>
     <rect x="108" y="13" width="7" height="47" rx="3.2" fill="hsl(34, 38%, 44%)" stroke="hsl(28, 46%, 22%)" stroke-width="1"/>
     <path d="M26 24 H64 V44 H48 M54 24 V34 H78" fill="none" stroke="hsl(28, 40%, 34%)" stroke-width="1" opacity="0.65"/>
     <path d="M28 50 Q46 46 56 34 T84 36" fill="none" stroke="hsl(152, 86%, 32%)" stroke-width="2" stroke-dasharray="3.5 2.5" stroke-linecap="round"/>
     <circle cx="34" cy="48" r="8" fill="none" stroke="url(#ca-well_laid_plans-brass)" stroke-width="1.5"/>
     <polygon points="34,41 36,48 34,55 32,48" fill="hsl(156, 76%, 34%)"/>
     <path d="M80 31 L90 41 M90 31 L80 41" fill="none" stroke="hsl(352, 86%, 46%)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="96" cy="52" r="5" fill="hsl(352, 74%, 40%)" stroke="hsl(44, 86%, 64%)" stroke-width="0.9"/>
     <polygon points="84,36 102,12 107,16 86,38" fill="url(#ca-well_laid_plans-blade)" stroke="hsl(210, 38%, 22%)" stroke-width="0.8"/>
     <path d="M98 11 L111 19 L109 22 L96 14 Z" fill="url(#ca-well_laid_plans-brass)"/>
     <path d="M106 13 L114 6 L118 9 L110 16 Z" fill="hsl(166, 52%, 24%)" stroke="hsl(44, 84%, 64%)" stroke-width="0.8"/>
     <circle cx="56" cy="34" r="2.4" fill="hsl(148, 96%, 54%)"/>`,
    'hsla(42, 86%, 56%, 0.24)',
    `<linearGradient id="ca-well_laid_plans-parch" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(42, 46%, 76%)"/><stop offset="55%" stop-color="hsl(36, 36%, 58%)"/><stop offset="100%" stop-color="hsl(30, 34%, 38%)"/></linearGradient><linearGradient id="ca-well_laid_plans-blade" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(192, 34%, 86%)"/><stop offset="100%" stop-color="hsl(206, 32%, 40%)"/></linearGradient><linearGradient id="ca-well_laid_plans-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 96%, 74%)"/><stop offset="100%" stop-color="hsl(34, 78%, 42%)"/></linearGradient>`
  ),
  choke: wrapArtSvg(
    'choke',
    'hsl(276, 44%, 14%)',
    'hsl(188, 48%, 7%)',
    `<ellipse cx="64" cy="36" rx="48" ry="30" fill="rgba(160,60,220,0.12)"/>
     <path d="M44 6 C46 22, 54 30, 52 38 C50 48, 42 56, 40 68 H88 C86 56, 78 48, 76 38 C74 30, 82 22, 84 6 Z" fill="url(#ca-choke-throat)" stroke="hsl(278, 46%, 36%)" stroke-width="1.1"/>
     <path d="M18 24 C40 30, 86 38, 110 46" fill="none" stroke="url(#ca-choke-band)" stroke-width="3.6" stroke-linecap="round"/>
     <path d="M18 46 C42 38, 86 30, 110 24" fill="none" stroke="url(#ca-choke-band)" stroke-width="3.6" stroke-linecap="round"/>
     <path d="M46 36 C56 32, 72 32, 82 36 C72 41, 56 41, 46 36 Z" fill="none" stroke="hsl(152, 100%, 84%)" stroke-width="2"/>
     <path d="M44 26 Q64 32 84 26 M44 46 Q64 40 84 46" fill="none" stroke="hsl(284, 92%, 68%)" stroke-width="1.6" stroke-linecap="round" opacity="0.8"/>
     <rect x="10" y="19" width="8" height="32" rx="3" fill="url(#ca-choke-handle)" stroke="hsl(26, 48%, 18%)" stroke-width="0.9"/>
     <rect x="110" y="19" width="8" height="32" rx="3" fill="url(#ca-choke-handle)" stroke="hsl(26, 48%, 18%)" stroke-width="0.9"/>
     <path d="M26 36 L38 36 M33 31 L38 36 L33 41 M102 36 L90 36 M95 31 L90 36 L95 41" fill="none" stroke="hsl(150, 98%, 72%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     <polygon points="64,28 66,34 72,36 66,38 64,44 62,38 56,36 62,34" fill="hsl(52, 100%, 86%)"/>
     <circle cx="52" cy="36" r="2.2" fill="hsl(352, 96%, 64%)"/>
     <circle cx="76" cy="36" r="2.2" fill="hsl(352, 96%, 64%)"/>
     <circle cx="64" cy="18" r="1.8" fill="hsl(284, 96%, 72%)"/>`,
    'hsla(154, 88%, 52%, 0.25)',
    `<linearGradient id="ca-choke-throat" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(224, 38%, 10%)"/><stop offset="50%" stop-color="hsl(268, 34%, 22%)"/><stop offset="100%" stop-color="hsl(212, 42%, 9%)"/></linearGradient><linearGradient id="ca-choke-band" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(164, 92%, 44%)"/><stop offset="50%" stop-color="hsl(146, 100%, 74%)"/><stop offset="100%" stop-color="hsl(286, 86%, 64%)"/></linearGradient><linearGradient id="ca-choke-handle" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(44, 86%, 68%)"/><stop offset="100%" stop-color="hsl(26, 58%, 30%)"/></linearGradient>`
  ),
  riddle_with_holes: wrapArtSvg(
    'riddle_with_holes',
    'hsl(186, 42%, 14%)',
    'hsl(220, 48%, 7%)',
    `<ellipse cx="52" cy="36" rx="44" ry="32" fill="rgba(120,255,200,0.14)"/>
     <path d="M26 12 L84 8 L90 56 L58 66 L22 52 Z" fill="url(#ca-riddle_with_holes-plate)" stroke="hsl(196, 30%, 46%)" stroke-width="1.4"/>
     <path d="M28 16 L80 12 M26 48 L84 52" fill="none" stroke="rgba(180,225,235,0.22)" stroke-width="1"/>
     <polygon points="40,22 126,34 126,42 38,26" fill="url(#ca-riddle_with_holes-beam)"/>
     <polygon points="64,20 126,22 126,29 63,24" fill="url(#ca-riddle_with_holes-beam)"/>
     <polygon points="52,36 126,48 126,56 50,40" fill="url(#ca-riddle_with_holes-beam)"/>
     <polygon points="72,38 126,56 126,64 70,42" fill="url(#ca-riddle_with_holes-beam)"/>
     <polygon points="42,50 116,68 104,72 40,54" fill="url(#ca-riddle_with_holes-beam)"/>
     <circle cx="40" cy="24" r="4.2" fill="url(#ca-riddle_with_holes-hole)" stroke="hsl(208, 40%, 10%)" stroke-width="1.2"/>
     <circle cx="64" cy="22" r="3.8" fill="url(#ca-riddle_with_holes-hole)" stroke="hsl(208, 40%, 10%)" stroke-width="1.2"/>
     <circle cx="52" cy="38" r="4.8" fill="url(#ca-riddle_with_holes-hole)" stroke="hsl(208, 40%, 10%)" stroke-width="1.3"/>
     <circle cx="72" cy="40" r="4" fill="url(#ca-riddle_with_holes-hole)" stroke="hsl(208, 40%, 10%)" stroke-width="1.2"/>
     <circle cx="42" cy="52" r="3.8" fill="url(#ca-riddle_with_holes-hole)" stroke="hsl(208, 40%, 10%)" stroke-width="1.2"/>
     <polygon points="94,30 102,28 97,34" fill="hsl(166, 90%, 76%)"/>
     <polygon points="98,54 107,58 99,60" fill="hsl(52, 100%, 82%)"/>`,
    'hsla(156, 94%, 60%, 0.28)',
    `<linearGradient id="ca-riddle_with_holes-plate" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(204, 24%, 30%)"/><stop offset="60%" stop-color="hsl(214, 30%, 16%)"/><stop offset="100%" stop-color="hsl(224, 38%, 9%)"/></linearGradient><linearGradient id="ca-riddle_with_holes-beam" x1="0" y1="0" x2="1" y2="0.6"><stop offset="0%" stop-color="hsl(152, 100%, 88%)"/><stop offset="48%" stop-color="hsl(156, 98%, 62%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(172, 94%, 46%)" stop-opacity="0"/></linearGradient><radialGradient id="ca-riddle_with_holes-hole" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 94%)"/><stop offset="65%" stop-color="hsl(148, 100%, 62%)"/><stop offset="100%" stop-color="hsl(168, 90%, 34%)"/></radialGradient>`
  ),
  brilliance: wrapArtSvg(
    'brilliance',
    'hsl(42, 68%, 22%)',
    'hsl(282, 56%, 10%)',
    `<circle cx="42" cy="36" r="34" fill="url(#ca-brilliance-core)"/>
     <path d="M42 36 L6 8 M42 36 L14 66 M42 36 L34 4 M42 36 L44 68 M42 36 L72 6 M42 36 L74 66" stroke="hsl(48, 100%, 80%)" stroke-width="1.3" opacity="0.48"/>
     <polygon points="42,22 122,10 122,28 42,36" fill="hsl(192, 96%, 72%)" opacity="0.34"/>
     <polygon points="42,36 122,44 122,62 42,50" fill="hsl(316, 94%, 64%)" opacity="0.38"/>
     <polygon points="38,24 124,26 124,46 38,48" fill="url(#ca-brilliance-beam)"/>
     <polygon points="42,31 124,33 124,39 42,41" fill="hsl(56, 100%, 98%)" opacity="0.92"/>
     <circle cx="42" cy="36" r="19" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.4" stroke-dasharray="4 3"/>
     <polygon points="42,14 58,36 42,58 26,36" fill="hsl(282, 60%, 16%)" opacity="0.6" transform="translate(2,2)"/>
     <polygon points="42,14 58,36 42,58 26,36" fill="url(#ca-brilliance-prism)" stroke="hsl(56, 100%, 98%)" stroke-width="1.5" stroke-linejoin="round"/>
     <polygon points="42,22 50,36 42,50 34,36" fill="hsl(56, 100%, 98%)"/>
     <path d="M14 36 H26 M84 22 L106 16 M84 50 L106 56" stroke="hsl(52, 100%, 92%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="88" cy="36" r="3" fill="hsl(56, 100%, 98%)"/>
     <circle cx="106" cy="24" r="2" fill="hsl(190, 100%, 88%)"/>
     <circle cx="104" cy="50" r="2.2" fill="hsl(322, 98%, 76%)"/>`,
    'hsla(48, 100%, 68%, 0.34)',
    `<radialGradient id="ca-brilliance-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="44%" stop-color="hsl(46, 100%, 68%)"/><stop offset="100%" stop-color="hsl(292, 86%, 54%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-brilliance-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(54, 100%, 97%)"/><stop offset="55%" stop-color="hsl(46, 100%, 72%)"/><stop offset="100%" stop-color="hsl(312, 96%, 68%)" stop-opacity="0.2"/></linearGradient><linearGradient id="ca-brilliance-prism" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(192, 100%, 90%)"/><stop offset="50%" stop-color="hsl(50, 100%, 86%)"/><stop offset="100%" stop-color="hsl(316, 92%, 68%)"/></linearGradient>`
  ),
  devotion: wrapArtSvg(
    'devotion',
    'hsl(268, 52%, 19%)',
    'hsl(36, 54%, 9%)',
    `<path d="M44 0 L84 0 L98 72 L30 72 Z" fill="url(#ca-devotion-beam)"/>
     <path d="M12 68 V18 A52 24 0 0 1 116 18 V68" fill="none" stroke="hsl(278, 46%, 38%)" stroke-width="1.6" opacity="0.5"/>
     <rect x="8" y="61" width="112" height="11" fill="hsl(266, 44%, 13%)" stroke="hsl(40, 74%, 52%)" stroke-width="1"/>
     <circle cx="64" cy="21" r="14" fill="url(#ca-devotion-mantra)"/>
     <circle cx="64" cy="21" r="10.5" fill="none" stroke="hsl(50, 100%, 88%)" stroke-width="1.5"/>
     <polygon points="64,13 68,21 64,29 60,21" fill="hsl(54, 100%, 96%)"/>
     <path d="M42 61 Q44 46 54 41 Q64 38 72 44 L76 54 Q78 60 72 61 Z" fill="hsl(264, 60%, 9%)" opacity="0.65" transform="translate(2,1)"/>
     <path d="M41 61 Q43 45 54 40 Q64 37 71 44 L74 54 Q76 60 70 61 Z" fill="url(#ca-devotion-robe)" stroke="hsl(48, 96%, 76%)" stroke-width="1.3"/>
     <circle cx="58" cy="34" r="5.2" fill="url(#ca-devotion-robe)" stroke="hsl(50, 100%, 86%)" stroke-width="1.2"/>
     <path d="M64 44 L71 41 L69 48 Z" fill="hsl(48, 96%, 80%)"/>
     <path d="M88 61 L92 52 H104 L108 61 Z" fill="hsl(36, 72%, 44%)" stroke="hsl(48, 98%, 76%)" stroke-width="1.1"/>
     <path d="M98 51 Q92 40 100 30 Q106 20 96 10" fill="none" stroke="hsl(48, 94%, 84%)" stroke-width="1.6" stroke-linecap="round" opacity="0.72"/>
     <path d="M26 54 Q20 42 28 32 Q34 22 26 12" fill="none" stroke="hsl(288, 84%, 76%)" stroke-width="1.3" stroke-linecap="round" opacity="0.58"/>
     <circle cx="48" cy="18" r="1.7" fill="hsl(50, 100%, 90%)"/>
     <circle cx="80" cy="24" r="1.9" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(44, 98%, 62%, 0.28)',
    `<linearGradient id="ca-devotion-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 90%)" stop-opacity="0.72"/><stop offset="68%" stop-color="hsl(42, 96%, 60%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(36, 90%, 44%)" stop-opacity="0"/></linearGradient><linearGradient id="ca-devotion-robe" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(284, 62%, 44%)"/><stop offset="100%" stop-color="hsl(258, 56%, 14%)"/></linearGradient><radialGradient id="ca-devotion-mantra" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="52%" stop-color="hsl(45, 100%, 66%)"/><stop offset="100%" stop-color="hsl(36, 92%, 46%)" stop-opacity="0"/></radialGradient>`
  ),
  establishment: wrapArtSvg(
    'establishment',
    'hsl(246, 46%, 20%)',
    'hsl(272, 48%, 9%)',
    `<circle cx="64" cy="24" r="28" fill="url(#ca-establishment-glow)"/>
     <path d="M18 58 A46 46 0 0 1 110 58" fill="none" stroke="hsl(46, 92%, 72%)" stroke-width="1" stroke-dasharray="3 3" opacity="0.52"/>
     <rect x="14" y="58" width="100" height="9" rx="1.5" fill="url(#ca-establishment-stone)" stroke="hsl(44, 84%, 62%)" stroke-width="1.2"/>
     <rect x="24" y="51" width="80" height="7" rx="1" fill="url(#ca-establishment-stone)" stroke="hsl(278, 62%, 62%)" stroke-width="1.1"/>
     <rect x="30" y="26" width="14" height="25" fill="url(#ca-establishment-stone)" stroke="hsl(282, 62%, 64%)" stroke-width="1.1"/>
     <rect x="84" y="26" width="14" height="25" fill="url(#ca-establishment-stone)" stroke="hsl(282, 62%, 64%)" stroke-width="1.1"/>
     <path d="M26 26 H48 L45 21 H29 Z M80 26 H102 L99 21 H83 Z" fill="url(#ca-establishment-gold)" stroke="hsl(52, 100%, 90%)" stroke-width="0.9"/>
     <path d="M36 22 Q48 16 55 18 L52 27 Q44 25 36 26 Z M92 22 Q80 16 73 18 L76 27 Q84 25 92 26 Z" fill="url(#ca-establishment-stone)" stroke="hsl(46, 92%, 70%)" stroke-width="1.1"/>
     <polygon points="56,10 72,10 68,28 60,28" fill="hsl(268, 60%, 10%)" opacity="0.65" transform="translate(1.5,2)"/>
     <polygon points="56,10 72,10 68,28 60,28" fill="url(#ca-establishment-gold)" stroke="hsl(54, 100%, 96%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M64 31 V46 M58 40 L64 46 L70 40" fill="none" stroke="hsl(50, 100%, 86%)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M37 29 V48 M91 29 V48" stroke="hsl(46, 92%, 76%)" stroke-width="1" opacity="0.65"/>
     <polygon points="20,38 23,34 26,38 23,42" fill="hsl(48, 100%, 84%)"/>
     <polygon points="102,38 105,34 108,38 105,42" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(44, 94%, 60%, 0.26)',
    `<linearGradient id="ca-establishment-stone" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(266, 36%, 44%)"/><stop offset="100%" stop-color="hsl(252, 46%, 16%)"/></linearGradient><linearGradient id="ca-establishment-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="55%" stop-color="hsl(44, 96%, 62%)"/><stop offset="100%" stop-color="hsl(30, 82%, 38%)"/></linearGradient><radialGradient id="ca-establishment-glow" cx="50%" cy="32%" r="48%"><stop offset="0%" stop-color="hsl(48, 100%, 86%)" stop-opacity="0.74"/><stop offset="100%" stop-color="hsl(272, 70%, 24%)" stop-opacity="0"/></radialGradient>`
  ),
  scrawl: wrapArtSvg(
    'scrawl',
    'hsl(266, 48%, 19%)',
    'hsl(240, 52%, 8%)',
    `<path d="M12 16 Q38 8 64 14 M74 62 Q98 66 118 54" fill="none" stroke="hsl(286, 76%, 64%)" stroke-width="1.2" opacity="0.46"/>
     <path d="M14 54 Q36 42 58 48 Q84 54 108 32 L98 14 Q74 32 48 28 Q26 24 8 36 Z" fill="hsl(254, 58%, 10%)" opacity="0.68" transform="translate(2,3)"/>
     <path d="M14 54 Q36 42 58 48 Q84 54 108 32 L98 14 Q74 32 48 28 Q26 24 8 36 Z" fill="url(#ca-scrawl-scroll)" stroke="hsl(36, 72%, 46%)" stroke-width="1.4"/>
     <path d="M8 34 L16 56" stroke="hsl(34, 76%, 46%)" stroke-width="5" stroke-linecap="round"/>
     <path d="M97 13 L109 34" stroke="hsl(34, 76%, 46%)" stroke-width="5" stroke-linecap="round"/>
     <path d="M22 44 Q32 30 42 42 Q50 50 58 34 Q68 24 76 40 Q82 44 88 32" fill="none" stroke="url(#ca-scrawl-ink)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M24 44 Q34 32 42 41 Q50 48 58 35 Q67 26 76 39" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="1.1" stroke-linecap="round"/>
     <path d="M74 36 L114 8 L119 14 L80 42 Z" fill="url(#ca-scrawl-brush)" stroke="hsl(48, 96%, 80%)" stroke-width="1"/>
     <path d="M74 36 L81 42 L68 46 Q70 39 74 36 Z" fill="hsl(278, 72%, 18%)" stroke="hsl(46, 100%, 78%)" stroke-width="0.9"/>
     <path d="M68 46 Q62 49 58 46" fill="none" stroke="hsl(48, 100%, 88%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="62" cy="56" r="2.4" fill="hsl(292, 92%, 64%)"/>
     <circle cx="52" cy="59" r="1.5" fill="hsl(48, 100%, 84%)"/>
     <circle cx="84" cy="54" r="2" fill="hsl(288, 90%, 66%)"/>
     <circle cx="34" cy="18" r="1.8" fill="hsl(46, 100%, 84%)"/>
     <path d="M18 18 L24 22 M92 52 L98 48" stroke="hsl(48, 100%, 86%)" stroke-width="1.4" stroke-linecap="round"/>`,
    'hsla(46, 94%, 66%, 0.26)',
    `<linearGradient id="ca-scrawl-scroll" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(46, 78%, 92%)"/><stop offset="60%" stop-color="hsl(40, 62%, 76%)"/><stop offset="100%" stop-color="hsl(32, 52%, 56%)"/></linearGradient><linearGradient id="ca-scrawl-brush" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 82%)"/><stop offset="45%" stop-color="hsl(342, 72%, 44%)"/><stop offset="100%" stop-color="hsl(276, 62%, 22%)"/></linearGradient><linearGradient id="ca-scrawl-ink" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(276, 76%, 22%)"/><stop offset="62%" stop-color="hsl(292, 90%, 56%)"/><stop offset="100%" stop-color="hsl(48, 100%, 82%)"/></linearGradient>`
  ),
  spirit_shield: wrapArtSvg(
    'spirit_shield',
    'hsl(216, 62%, 20%)',
    'hsl(264, 54%, 9%)',
    `<circle cx="64" cy="36" r="31" fill="none" stroke="hsl(194, 92%, 70%)" stroke-width="1.1" opacity="0.45"/>
     <ellipse cx="64" cy="38" rx="46" ry="20" fill="none" stroke="hsl(282, 82%, 68%)" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.58"/>
     <rect x="14" y="24" width="13" height="19" rx="2" fill="url(#ca-spirit_shield-card)" stroke="hsl(192, 100%, 90%)" stroke-width="1.1" transform="rotate(-16 20 33)" opacity="0.86"/>
     <rect x="24" y="14" width="13" height="19" rx="2" fill="url(#ca-spirit_shield-card)" stroke="hsl(50, 100%, 88%)" stroke-width="1.1" transform="rotate(-8 30 23)" opacity="0.92"/>
     <rect x="91" y="14" width="13" height="19" rx="2" fill="url(#ca-spirit_shield-card)" stroke="hsl(50, 100%, 88%)" stroke-width="1.1" transform="rotate(8 97 23)" opacity="0.92"/>
     <rect x="101" y="24" width="13" height="19" rx="2" fill="url(#ca-spirit_shield-card)" stroke="hsl(192, 100%, 90%)" stroke-width="1.1" transform="rotate(16 107 33)" opacity="0.86"/>
     <path d="M64 11 L86 20 V38 Q86 55 64 65 Q42 55 42 38 V20 Z" fill="hsl(232, 64%, 10%)" opacity="0.68" transform="translate(2,2)"/>
     <path d="M64 11 L86 20 V38 Q86 55 64 65 Q42 55 42 38 V20 Z" fill="url(#ca-spirit_shield-aegis)" stroke="url(#ca-spirit_shield-rim)" stroke-width="2.2" stroke-linejoin="round"/>
     <path d="M64 18 L79 24 V37 Q79 49 64 57 Q49 49 49 37 V24 Z" fill="none" stroke="hsl(190, 100%, 94%)" stroke-width="1.2" opacity="0.85"/>
     <polygon points="64,25 71,36 64,47 57,36" fill="hsl(54, 100%, 94%)" stroke="hsl(194, 96%, 72%)" stroke-width="1"/>
     <path d="M24 52 Q36 58 46 56 M104 52 Q92 58 82 56" fill="none" stroke="hsl(192, 98%, 80%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="34" cy="50" r="2" fill="hsl(190, 100%, 90%)"/>
     <circle cx="94" cy="50" r="2" fill="hsl(190, 100%, 90%)"/>
     <circle cx="64" cy="6" r="1.8" fill="hsl(50, 100%, 92%)"/>`,
    'hsla(192, 96%, 62%, 0.28)',
    `<radialGradient id="ca-spirit_shield-aegis" cx="50%" cy="44%" r="54%"><stop offset="0%" stop-color="hsl(190, 100%, 94%)" stop-opacity="0.88"/><stop offset="52%" stop-color="hsl(198, 92%, 58%)" stop-opacity="0.58"/><stop offset="100%" stop-color="hsl(274, 78%, 44%)" stop-opacity="0.32"/></radialGradient><linearGradient id="ca-spirit_shield-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(192, 100%, 86%)"/><stop offset="100%" stop-color="hsl(278, 74%, 52%)"/></linearGradient><linearGradient id="ca-spirit_shield-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="100%" stop-color="hsl(192, 98%, 74%)"/></linearGradient>`
  ),
  smite: wrapArtSvg(
    'smite',
    'hsl(42, 66%, 22%)',
    'hsl(282, 56%, 10%)',
    `<rect x="44" y="0" width="40" height="72" fill="url(#ca-smite-beam)"/>
     <ellipse cx="64" cy="60" rx="44" ry="11" fill="url(#ca-smite-impact)"/>
     <ellipse cx="64" cy="60" rx="34" ry="7" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.6"/>
     <path d="M58 22 H70 L68 50 L64 62 L60 50 Z" fill="hsl(282, 62%, 14%)" opacity="0.65" transform="translate(2,2)"/>
     <path d="M58 22 H70 L68 50 L64 62 L60 50 Z" fill="url(#ca-smite-blade)" stroke="hsl(52, 100%, 94%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M64 24 V58" stroke="hsl(56, 100%, 99%)" stroke-width="1.6"/>
     <path d="M40 16 Q52 24 64 23 Q76 24 88 16 L80 26 Q64 29 48 26 Z" fill="hsl(44, 98%, 64%)" stroke="hsl(54, 100%, 94%)" stroke-width="1.2"/>
     <rect x="61.5" y="7" width="5" height="14" rx="2" fill="hsl(286, 62%, 34%)" stroke="hsl(48, 100%, 84%)" stroke-width="1.1"/>
     <circle cx="64" cy="7" r="3.4" fill="hsl(50, 100%, 86%)" stroke="hsl(34, 88%, 48%)" stroke-width="1"/>
     <path d="M26 56 L42 46 M102 56 L86 46 M32 36 L44 40 M96 36 L84 40" stroke="hsl(48, 100%, 84%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M18 62 L38 58 M110 62 L90 58" stroke="hsl(312, 94%, 70%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="48,54 52,48 54,56" fill="hsl(52, 100%, 92%)"/>
     <polygon points="80,54 76,48 74,56" fill="hsl(52, 100%, 92%)"/>
     <circle cx="34" cy="18" r="1.8" fill="hsl(50, 100%, 90%)"/>
     <circle cx="94" cy="18" r="1.8" fill="hsl(50, 100%, 90%)"/>`,
    'hsla(48, 100%, 66%, 0.34)',
    `<linearGradient id="ca-smite-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 96%)" stop-opacity="0.82"/><stop offset="65%" stop-color="hsl(44, 100%, 64%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(312, 92%, 56%)" stop-opacity="0.1"/></linearGradient><linearGradient id="ca-smite-blade" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(44, 100%, 72%)"/><stop offset="50%" stop-color="hsl(56, 100%, 98%)"/><stop offset="100%" stop-color="hsl(36, 94%, 56%)"/></linearGradient><radialGradient id="ca-smite-impact" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="48%" stop-color="hsl(46, 100%, 68%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(296, 88%, 50%)" stop-opacity="0"/></radialGradient>`
  ),
  safety: wrapArtSvg(
    'safety',
    'hsl(198, 58%, 20%)',
    'hsl(232, 52%, 9%)',
    `<path d="M12 62 A52 48 0 0 1 116 62 Z" fill="url(#ca-safety-dome)" stroke="hsl(192, 98%, 80%)" stroke-width="1.8"/>
     <path d="M22 62 A42 38 0 0 1 106 62" fill="none" stroke="hsl(48, 98%, 82%)" stroke-width="1.1" stroke-dasharray="4 3" opacity="0.72"/>
     <path d="M8 62 H120" stroke="hsl(194, 90%, 74%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M64 20 L84 28 V42 Q84 55 64 61 Q44 55 44 42 V28 Z" fill="hsl(224, 62%, 10%)" opacity="0.6" transform="translate(2,2)"/>
     <path d="M64 20 L84 28 V42 Q84 55 64 61 Q44 55 44 42 V28 Z" fill="url(#ca-safety-shield)" stroke="hsl(48, 98%, 78%)" stroke-width="2" stroke-linejoin="round"/>
     <circle cx="64" cy="40" r="14" fill="url(#ca-safety-lantern)"/>
     <path d="M64 29 Q70 36 68 46 Q64 49 60 46 Q58 36 64 29 Z" fill="hsl(52, 100%, 92%)" stroke="hsl(42, 96%, 64%)" stroke-width="1"/>
     <path d="M54 44 Q58 36 62 46 M74 44 Q70 36 66 46" fill="none" stroke="hsl(190, 100%, 90%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M18 46 Q26 38 34 44 M110 46 Q102 38 94 44" fill="none" stroke="hsl(194, 96%, 80%)" stroke-width="1.3" stroke-linecap="round" opacity="0.76"/>
     <polygon points="64,9 66,13 70,15 66,17 64,21 62,17 58,15 62,13" fill="hsl(52, 100%, 94%)"/>
     <circle cx="28" cy="24" r="1.8" fill="hsl(190, 100%, 90%)"/>
     <circle cx="100" cy="24" r="1.8" fill="hsl(190, 100%, 90%)"/>
     <circle cx="36" cy="54" r="1.6" fill="hsl(48, 100%, 86%)"/>
     <circle cx="92" cy="54" r="1.6" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(194, 94%, 64%, 0.28)',
    `<radialGradient id="ca-safety-dome" cx="50%" cy="62%" r="54%"><stop offset="0%" stop-color="hsl(50, 100%, 90%)" stop-opacity="0.46"/><stop offset="58%" stop-color="hsl(192, 96%, 68%)" stop-opacity="0.26"/><stop offset="100%" stop-color="hsl(214, 86%, 54%)" stop-opacity="0.06"/></radialGradient><linearGradient id="ca-safety-shield" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(194, 92%, 78%)"/><stop offset="56%" stop-color="hsl(208, 72%, 44%)"/><stop offset="100%" stop-color="hsl(228, 62%, 22%)"/></linearGradient><radialGradient id="ca-safety-lantern" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="58%" stop-color="hsl(44, 100%, 68%)"/><stop offset="100%" stop-color="hsl(36, 94%, 46%)" stop-opacity="0"/></radialGradient>`
  ),
  insight: wrapArtSvg(
    'insight',
    'hsl(228, 60%, 20%)',
    'hsl(268, 54%, 9%)',
    `<path d="M16 14 L32 22 L24 38 M112 14 L96 22 L104 38" fill="none" stroke="hsl(194, 92%, 76%)" stroke-width="1" opacity="0.48"/>
     <path d="M46 28 L82 28 L98 62 L30 62 Z" fill="url(#ca-insight-ray)"/>
     <circle cx="64" cy="26" r="22" fill="none" stroke="hsl(48, 96%, 78%)" stroke-width="1.1" stroke-dasharray="3 3" opacity="0.65"/>
     <path d="M28 27 Q64 6 100 27 Q64 48 28 27 Z" fill="hsl(248, 62%, 10%)" opacity="0.65" transform="translate(1.5,2)"/>
     <path d="M28 26 Q64 6 100 26 Q64 46 28 26 Z" fill="hsl(236, 56%, 18%)" stroke="hsl(192, 98%, 82%)" stroke-width="1.8"/>
     <circle cx="64" cy="26" r="11.5" fill="url(#ca-insight-iris)" stroke="hsl(50, 100%, 88%)" stroke-width="1.2"/>
     <circle cx="64" cy="26" r="4.2" fill="hsl(252, 68%, 12%)"/>
     <circle cx="61.5" cy="23.5" r="2.2" fill="hsl(54, 100%, 98%)"/>
     <path d="M32 54 Q48 48 64 56 Q80 48 96 54 L100 64 Q80 58 64 65 Q48 58 28 64 Z" fill="url(#ca-insight-book)" stroke="hsl(44, 92%, 68%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M64 56 V65 M38 56 Q50 53 60 58 M90 56 Q78 53 68 58" fill="none" stroke="hsl(228, 56%, 44%)" stroke-width="1.1"/>
     <circle cx="16" cy="14" r="2" fill="hsl(50, 100%, 92%)"/>
     <circle cx="32" cy="22" r="1.5" fill="hsl(192, 100%, 88%)"/>
     <circle cx="112" cy="14" r="2" fill="hsl(50, 100%, 92%)"/>
     <circle cx="96" cy="22" r="1.5" fill="hsl(192, 100%, 88%)"/>`,
    'hsla(192, 96%, 66%, 0.28)',
    `<radialGradient id="ca-insight-iris" cx="46%" cy="44%" r="54%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="38%" stop-color="hsl(190, 100%, 74%)"/><stop offset="78%" stop-color="hsl(226, 86%, 48%)"/><stop offset="100%" stop-color="hsl(264, 72%, 22%)"/></radialGradient><linearGradient id="ca-insight-book" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(50, 88%, 94%)"/><stop offset="100%" stop-color="hsl(204, 62%, 72%)"/></linearGradient><linearGradient id="ca-insight-ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(190, 100%, 88%)" stop-opacity="0.58"/><stop offset="100%" stop-color="hsl(48, 100%, 78%)" stop-opacity="0"/></linearGradient>`
  ),
  bowling_bash: wrapArtSvg(
    'bowling_bash',
    'hsl(284, 56%, 20%)',
    'hsl(18, 54%, 9%)',
    `<path d="M6 60 L122 52 L124 68 L4 68 Z" fill="hsl(274, 42%, 12%)" opacity="0.65"/>
     <path d="M8 42 L60 32 L60 52 L8 54 Z" fill="url(#ca-bowling_bash-trail)"/>
     <path d="M12 26 H44 M8 36 H36 M14 54 H48" stroke="hsl(46, 100%, 80%)" stroke-width="1.5" stroke-linecap="round" opacity="0.72"/>
     <circle cx="52" cy="42" r="14" fill="hsl(276, 62%, 10%)" opacity="0.6" transform="translate(2,2.5)"/>
     <circle cx="52" cy="42" r="13.5" fill="url(#ca-bowling_bash-orb)" stroke="hsl(52, 100%, 92%)" stroke-width="1.5"/>
     <path d="M44 36 Q52 30 60 36 M43 45 Q52 51 61 45" fill="none" stroke="hsl(282, 68%, 28%)" stroke-width="1.5"/>
     <path d="M74 26 L82 22 L87 46 L76 48 Z" fill="url(#ca-bowling_bash-pin)" stroke="hsl(46, 96%, 76%)" stroke-width="1.2" transform="rotate(16 80 35)"/>
     <path d="M90 18 L99 15 L103 40 L92 42 Z" fill="url(#ca-bowling_bash-pin)" stroke="hsl(312, 92%, 72%)" stroke-width="1.2" transform="rotate(32 96 28)"/>
     <path d="M102 36 L112 34 L115 58 L104 60 Z" fill="url(#ca-bowling_bash-pin)" stroke="hsl(46, 96%, 76%)" stroke-width="1.2" transform="rotate(44 108 47)"/>
     <path d="M66 36 L72 28 L73 37 L82 36 L74 42 L80 50 L71 45 L67 53 L68 43 L60 40 Z" fill="hsl(52, 100%, 94%)"/>
     <path d="M76 14 Q92 10 108 20 M84 56 Q98 62 114 58" fill="none" stroke="hsl(42, 100%, 74%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="88" cy="14" r="2" fill="hsl(48, 100%, 88%)"/>
     <circle cx="116" cy="28" r="1.8" fill="hsl(324, 96%, 72%)"/>
     <circle cx="72" cy="58" r="1.8" fill="hsl(44, 100%, 78%)"/>`,
    'hsla(38, 96%, 58%, 0.28)',
    `<radialGradient id="ca-bowling_bash-orb" cx="38%" cy="35%" r="60%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="46%" stop-color="hsl(42, 98%, 62%)"/><stop offset="100%" stop-color="hsl(288, 74%, 36%)"/></radialGradient><linearGradient id="ca-bowling_bash-trail" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(312, 92%, 58%)" stop-opacity="0.1"/><stop offset="62%" stop-color="hsl(40, 100%, 62%)" stop-opacity="0.78"/><stop offset="100%" stop-color="hsl(52, 100%, 90%)" stop-opacity="0.95"/></linearGradient><linearGradient id="ca-bowling_bash-pin" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(280, 44%, 52%)"/><stop offset="100%" stop-color="hsl(262, 52%, 18%)"/></linearGradient>`
  ),
  consecrate: wrapArtSvg(
    'consecrate',
    'hsl(276, 48%, 20%)',
    'hsl(32, 56%, 10%)',
    `<ellipse cx="64" cy="40" rx="54" ry="26" fill="url(#ca-consecrate-halo)"/>
     <path d="M16 62 Q64 52 112 62 L120 72 H8 Z" fill="hsl(272, 42%, 13%)" stroke="hsl(42, 82%, 56%)" stroke-width="1"/>
     <path d="M10 38 Q64 62 118 38 Q64 50 10 38 Z" fill="hsl(324, 72%, 22%)" opacity="0.58" transform="translate(0,4)"/>
     <path d="M8 34 Q64 62 120 34 Q64 47 8 34 Z" fill="url(#ca-consecrate-wave)" stroke="hsl(54, 100%, 94%)" stroke-width="1.3"/>
     <path d="M18 36 Q64 52 110 36" fill="none" stroke="hsl(56, 100%, 98%)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="64" cy="24" r="11" fill="none" stroke="url(#ca-consecrate-gold)" stroke-width="2.8"/>
     <rect x="62.5" y="34.5" width="3" height="28" rx="1.5" fill="url(#ca-consecrate-gold)"/>
     <circle cx="64" cy="24" r="4.5" fill="hsl(54, 100%, 96%)"/>
     <path d="M51 24 H55 M73 24 H77 M64 11 V15" stroke="hsl(52, 100%, 92%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M22 24 Q28 16 36 22 M106 24 Q100 16 92 22" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.5" stroke-linecap="round"/>
     <polygon points="30,44 33,38 36,44 33,47" fill="hsl(50, 100%, 90%)"/>
     <polygon points="98,44 95,38 92,44 95,47" fill="hsl(50, 100%, 90%)"/>
     <circle cx="46" cy="54" r="2" fill="hsl(46, 100%, 82%)"/>
     <circle cx="82" cy="54" r="2" fill="hsl(46, 100%, 82%)"/>`,
    'hsla(44, 98%, 62%, 0.30)',
    `<linearGradient id="ca-consecrate-wave" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(324, 92%, 62%)" stop-opacity="0.35"/><stop offset="32%" stop-color="hsl(44, 100%, 68%)"/><stop offset="50%" stop-color="hsl(56, 100%, 96%)"/><stop offset="68%" stop-color="hsl(44, 100%, 68%)"/><stop offset="100%" stop-color="hsl(324, 92%, 62%)" stop-opacity="0.35"/></linearGradient><radialGradient id="ca-consecrate-halo" cx="50%" cy="54%" r="52%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)" stop-opacity="0.82"/><stop offset="58%" stop-color="hsl(42, 98%, 58%)" stop-opacity="0.32"/><stop offset="100%" stop-color="hsl(278, 66%, 20%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-consecrate-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 88%)"/><stop offset="100%" stop-color="hsl(30, 82%, 40%)"/></linearGradient>`
  ),
  crush_joints: wrapArtSvg(
    'crush_joints',
    'hsl(318, 56%, 20%)',
    'hsl(268, 54%, 9%)',
    `<circle cx="64" cy="38" r="26" fill="url(#ca-crush_joints-impact)"/>
     <circle cx="64" cy="38" r="22" fill="none" stroke="hsl(344, 94%, 66%)" stroke-width="1.3" stroke-dasharray="5 3" opacity="0.65"/>
     <path d="M84 10 L70 30 Q62 34 68 41 L82 36 L98 16 Z" fill="url(#ca-crush_joints-bone)" stroke="hsl(272, 46%, 22%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M62 42 L74 44 L88 64 L74 66 L60 50 Z" fill="url(#ca-crush_joints-bone)" stroke="hsl(272, 46%, 22%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M64 31 L70 38 L64 45 L75 39" fill="none" stroke="hsl(348, 100%, 62%)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M12 24 L48 34 L58 38 L46 46 L10 38 Z" fill="hsl(280, 62%, 12%)" opacity="0.6" transform="translate(2,2)"/>
     <path d="M12 24 L46 33 L58 38 L45 45 L10 37 Z" fill="url(#ca-crush_joints-fist)" stroke="hsl(52, 100%, 92%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M44 33 L54 37 L44 43" fill="none" stroke="hsl(54, 100%, 96%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M62 24 L65 33 L74 30 L68 38 L78 44 L67 43 L65 53 L60 44 L52 47 L58 38 L52 30 L60 34 Z" fill="hsl(52, 100%, 94%)"/>
     <polygon points="88,36 96,32 94,40" fill="url(#ca-crush_joints-bone)" stroke="hsl(348, 96%, 68%)" stroke-width="0.9"/>
     <polygon points="94,48 103,49 97,55" fill="url(#ca-crush_joints-bone)" stroke="hsl(44, 98%, 74%)" stroke-width="0.9"/>
     <polygon points="52,55 58,52 56,60" fill="url(#ca-crush_joints-bone)" stroke="hsl(348, 96%, 68%)" stroke-width="0.9"/>
     <path d="M100 22 L114 16 M102 58 L116 64" stroke="hsl(46, 100%, 82%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="48" cy="18" r="1.9" fill="hsl(344, 98%, 74%)"/>`,
    'hsla(336, 94%, 58%, 0.28)',
    `<linearGradient id="ca-crush_joints-bone" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(46, 56%, 92%)"/><stop offset="55%" stop-color="hsl(276, 26%, 68%)"/><stop offset="100%" stop-color="hsl(264, 34%, 38%)"/></linearGradient><radialGradient id="ca-crush_joints-impact" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="46%" stop-color="hsl(344, 98%, 60%)" stop-opacity="0.82"/><stop offset="100%" stop-color="hsl(296, 86%, 40%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-crush_joints-fist" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 86%)"/><stop offset="55%" stop-color="hsl(318, 92%, 62%)"/><stop offset="100%" stop-color="hsl(278, 72%, 34%)"/></linearGradient>`
  ),
  cut_through_fate: wrapArtSvg(
    'cut_through_fate',
    'hsl(260, 58%, 20%)',
    'hsl(226, 56%, 8%)',
    `<path d="M10 18 Q36 22 50 32 M74 44 Q96 52 118 46 M14 34 Q30 38 42 42 M82 28 Q100 22 116 14" fill="none" stroke="url(#ca-cut_through_fate-thread)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M22 10 Q42 20 52 28 M76 48 Q90 58 106 66" fill="none" stroke="hsl(46, 98%, 74%)" stroke-width="1.2" opacity="0.72"/>
     <path d="M30 33 Q60 12 90 25 L48 45 Q38 42 30 33 Z" fill="hsl(252, 58%, 18%)" stroke="hsl(194, 96%, 78%)" stroke-width="1.6"/>
     <path d="M40 49 L96 27 Q98 37 94 42 Q66 58 40 49 Z" fill="hsl(252, 58%, 18%)" stroke="hsl(292, 88%, 72%)" stroke-width="1.6"/>
     <path d="M51 31 A12 12 0 0 1 73 28 L55 37 Z" fill="url(#ca-cut_through_fate-eye)"/>
     <path d="M57 42 L77 33 A12 12 0 0 1 57 42 Z" fill="url(#ca-cut_through_fate-eye)"/>
     <path d="M12 60 L108 11 L118 9 L111 19 L18 65 Z" fill="hsl(242, 68%, 10%)" opacity="0.65" transform="translate(2,2.5)"/>
     <path d="M12 59 L106 11 L118 8 L110 18 L17 64 Z" fill="url(#ca-cut_through_fate-slash)" stroke="hsl(54, 100%, 96%)" stroke-width="1.1" stroke-linejoin="round"/>
     <path d="M18 59 L111 12" stroke="hsl(56, 100%, 99%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M52 34 L46 28 M78 40 L84 46" stroke="hsl(48, 100%, 88%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="108,12 112,5 113,12 120,13 113,16 112,23 108,16 101,15" fill="hsl(56, 100%, 98%)"/>
     <circle cx="34" cy="58" r="2" fill="hsl(192, 100%, 88%)"/>
     <circle cx="88" cy="14" r="1.8" fill="hsl(48, 100%, 88%)"/>
     <circle cx="24" cy="24" r="1.5" fill="hsl(294, 96%, 76%)"/>`,
    'hsla(194, 96%, 66%, 0.28)',
    `<linearGradient id="ca-cut_through_fate-slash" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(192, 100%, 80%)"/><stop offset="52%" stop-color="hsl(54, 100%, 96%)"/><stop offset="100%" stop-color="hsl(46, 100%, 72%)"/></linearGradient><radialGradient id="ca-cut_through_fate-eye" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="48%" stop-color="hsl(194, 96%, 66%)"/><stop offset="100%" stop-color="hsl(278, 76%, 34%)"/></radialGradient><linearGradient id="ca-cut_through_fate-thread" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 84%)"/><stop offset="100%" stop-color="hsl(292, 88%, 66%)"/></linearGradient>`
  ),
  empty_fist: wrapArtSvg(
    'empty_fist',
    'hsl(236, 36%, 22%)',
    'hsl(258, 42%, 9%)',
    `<circle cx="76" cy="36" r="29" fill="url(#ca-empty_fist-void)"/>
     <path d="M52 16 A26 26 0 1 1 56 58" fill="none" stroke="url(#ca-empty_fist-enso)" stroke-width="3.2" stroke-linecap="round" opacity="0.78"/>
     <circle cx="78" cy="36" r="18" fill="none" stroke="hsl(210, 62%, 86%)" stroke-width="1.3" stroke-dasharray="5 3" opacity="0.68"/>
     <path d="M12 28 H44 L54 22 H68 Q76 22 76 30 V42 Q76 50 66 50 H52 L42 46 H12 Z" fill="hsl(252, 48%, 10%)" opacity="0.6" transform="translate(2,2.5)"/>
     <path d="M10 28 H44 L54 22 H68 Q76 22 76 30 V42 Q76 50 66 50 H52 L42 46 H10 Z" fill="url(#ca-empty_fist-fist)" stroke="hsl(48, 70%, 96%)" stroke-width="1.5" stroke-linejoin="round"/>
     <path d="M58 24 V34 M64 24 V35 M70 25 V35 M54 38 H72" stroke="hsl(252, 38%, 36%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M78 24 Q88 36 78 48 M86 18 Q98 36 86 54 M94 24 Q104 36 94 48" fill="none" stroke="hsl(50, 72%, 96%)" stroke-width="1.8" stroke-linecap="round" opacity="0.86"/>
     <path d="M10 22 Q26 16 38 20 M10 52 Q26 58 38 54" fill="none" stroke="hsl(334, 62%, 70%)" stroke-width="1.3" opacity="0.48"/>
     <path d="M102 18 Q112 24 116 34 M102 54 Q112 48 116 38" fill="none" stroke="hsl(198, 72%, 78%)" stroke-width="1.3" opacity="0.54"/>
     <circle cx="88" cy="14" r="1.8" fill="hsl(52, 80%, 96%)"/>
     <circle cx="108" cy="36" r="2.2" fill="hsl(52, 80%, 96%)"/>
     <circle cx="88" cy="58" r="1.8" fill="hsl(200, 86%, 86%)"/>`,
    'hsla(210, 48%, 82%, 0.24)',
    `<linearGradient id="ca-empty_fist-fist" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 46%, 96%)"/><stop offset="56%" stop-color="hsl(226, 36%, 74%)"/><stop offset="100%" stop-color="hsl(258, 36%, 40%)"/></linearGradient><radialGradient id="ca-empty_fist-void" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 60%, 96%)" stop-opacity="0.72"/><stop offset="56%" stop-color="hsl(206, 62%, 78%)" stop-opacity="0.24"/><stop offset="100%" stop-color="hsl(252, 48%, 22%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-empty_fist-enso" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 60%, 94%)"/><stop offset="100%" stop-color="hsl(204, 62%, 74%)"/></linearGradient>`
  ),
  flurry_of_blows: wrapArtSvg(
    'flurry_of_blows',
    'hsl(278, 58%, 20%)',
    'hsl(228, 54%, 9%)',
    `<circle cx="96" cy="36" r="24" fill="url(#ca-flurry_of_blows-burst)"/>
     <path d="M8 18 Q44 12 84 22 L76 28 Q42 20 8 24 Z" fill="url(#ca-flurry_of_blows-calm)"/>
     <path d="M12 52 Q48 58 88 46 L82 40 Q48 48 12 46 Z" fill="url(#ca-flurry_of_blows-wrath)"/>
     <path d="M10 34 Q54 28 102 36 L94 42 Q52 38 10 40 Z" fill="url(#ca-flurry_of_blows-wrath)" opacity="0.9"/>
     <path d="M22 24 L62 16 L70 22 L30 30 Z" fill="hsl(194, 96%, 76%)" opacity="0.56"/>
     <path d="M26 48 L68 56 L76 48 L34 42 Z" fill="hsl(326, 94%, 66%)" opacity="0.58"/>
     <ellipse cx="78" cy="20" rx="10" ry="6" fill="hsl(192, 100%, 88%)" stroke="hsl(52, 100%, 94%)" stroke-width="1.2" transform="rotate(-10 78 20)"/>
     <ellipse cx="82" cy="52" rx="10" ry="6" fill="hsl(334, 96%, 70%)" stroke="hsl(52, 100%, 94%)" stroke-width="1.2" transform="rotate(10 82 52)"/>
     <path d="M74 29 H96 Q104 29 104 36 Q104 43 96 43 H74 Z" fill="hsl(48, 100%, 84%)" stroke="hsl(56, 100%, 98%)" stroke-width="1.4"/>
     <path d="M98 22 L104 32 L116 28 L108 36 L116 45 L104 41 L98 51 L97 39 L88 36 L97 32 Z" fill="hsl(56, 100%, 96%)"/>
     <path d="M14 10 H44 M16 62 H48 M64 10 L82 14 M66 62 L84 58" stroke="hsl(48, 100%, 84%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="52" cy="26" r="2" fill="hsl(192, 100%, 90%)"/>
     <circle cx="56" cy="46" r="2" fill="hsl(334, 98%, 76%)"/>
     <circle cx="114" cy="16" r="1.8" fill="hsl(50, 100%, 92%)"/>`,
    'hsla(318, 94%, 60%, 0.28)',
    `<linearGradient id="ca-flurry_of_blows-calm" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(196, 96%, 68%)" stop-opacity="0.12"/><stop offset="72%" stop-color="hsl(192, 100%, 76%)"/><stop offset="100%" stop-color="hsl(52, 100%, 94%)"/></linearGradient><linearGradient id="ca-flurry_of_blows-wrath" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(326, 96%, 60%)" stop-opacity="0.12"/><stop offset="72%" stop-color="hsl(338, 98%, 64%)"/><stop offset="100%" stop-color="hsl(48, 100%, 88%)"/></linearGradient><radialGradient id="ca-flurry_of_blows-burst" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 97%)"/><stop offset="50%" stop-color="hsl(44, 100%, 66%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(308, 92%, 52%)" stop-opacity="0"/></radialGradient>`
  ),
  flying_sleeves: wrapArtSvg(
    'flying_sleeves',
    'hsl(276, 56%, 22%)',
    'hsl(246, 52%, 9%)',
    `<path d="M10 18 Q26 10 38 18 Q46 12 56 18 M76 58 Q92 50 104 58 Q112 52 122 58" fill="none" stroke="hsl(282, 66%, 72%)" stroke-width="1.3" opacity="0.46"/>
     <path d="M10 42 Q34 10 66 20 Q88 28 106 14 Q94 34 68 34 Q38 34 16 52 Z" fill="hsl(266, 62%, 10%)" opacity="0.58" transform="translate(2,2.5)"/>
     <path d="M10 40 Q34 10 66 20 Q88 28 106 14 Q94 33 68 32 Q38 32 16 50 Z" fill="url(#ca-flying_sleeves-silk1)" stroke="hsl(48, 100%, 82%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M16 40 Q40 18 70 25 Q88 29 102 18" fill="none" stroke="hsl(52, 100%, 94%)" stroke-width="1.3" opacity="0.82"/>
     <path d="M16 60 Q46 38 74 48 Q96 56 112 40 Q100 62 72 60 Q44 58 22 66 Z" fill="hsl(266, 62%, 10%)" opacity="0.58" transform="translate(2,2.5)"/>
     <path d="M16 58 Q46 38 74 48 Q96 56 112 40 Q100 61 72 58 Q44 56 22 64 Z" fill="url(#ca-flying_sleeves-silk2)" stroke="hsl(48, 100%, 84%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M24 58 Q50 45 76 52 Q94 57 108 44" fill="none" stroke="hsl(52, 100%, 94%)" stroke-width="1.3" opacity="0.82"/>
     <path d="M78 12 Q102 8 118 22 Q104 20 86 24 Z" fill="url(#ca-flying_sleeves-arc)"/>
     <path d="M84 36 Q108 32 120 48 Q106 46 90 48 Z" fill="url(#ca-flying_sleeves-arc)"/>
     <path d="M104 14 L118 22 M110 40 L120 48" stroke="hsl(56, 100%, 98%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="96" cy="28" r="2" fill="hsl(50, 100%, 92%)"/>
     <circle cx="48" cy="12" r="1.6" fill="hsl(292, 96%, 82%)"/>
     <circle cx="42" cy="64" r="1.8" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(292, 92%, 64%, 0.28)',
    `<linearGradient id="ca-flying_sleeves-silk1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(288, 72%, 86%)"/><stop offset="48%" stop-color="hsl(282, 74%, 56%)"/><stop offset="100%" stop-color="hsl(262, 62%, 26%)"/></linearGradient><linearGradient id="ca-flying_sleeves-silk2" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(268, 62%, 30%)"/><stop offset="52%" stop-color="hsl(296, 82%, 62%)"/><stop offset="100%" stop-color="hsl(50, 96%, 90%)"/></linearGradient><linearGradient id="ca-flying_sleeves-arc" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(48, 100%, 84%)" stop-opacity="0.2"/><stop offset="65%" stop-color="hsl(48, 100%, 78%)"/><stop offset="100%" stop-color="hsl(56, 100%, 98%)"/></linearGradient>`
  ),
  follow_up: wrapArtSvg(
    'follow_up',
    'hsl(280, 58%, 20%)',
    'hsl(36, 52%, 9%)',
    `<path d="M10 56 Q34 18 76 16" fill="none" stroke="hsl(292, 84%, 66%)" stroke-width="1.4" stroke-dasharray="4 3" opacity="0.58"/>
     <path d="M12 54 Q30 22 66 18 L58 28 Q34 32 18 58 Z" fill="url(#ca-follow_up-echo)" stroke="hsl(296, 90%, 76%)" stroke-width="1.1"/>
     <path d="M22 62 Q58 58 98 28" fill="none" stroke="hsl(46, 100%, 76%)" stroke-width="1.5" opacity="0.65"/>
     <circle cx="96" cy="28" r="22" fill="url(#ca-follow_up-orb)"/>
     <path d="M24 58 L84 26 L98 24 L89 36 L30 64 Z" fill="hsl(276, 62%, 12%)" opacity="0.62" transform="translate(2,2.5)"/>
     <path d="M22 57 L84 25 L99 23 L89 35 L29 63 Z" fill="url(#ca-follow_up-strike)" stroke="hsl(54, 100%, 96%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M30 57 L92 27" stroke="hsl(56, 100%, 99%)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="96" cy="28" r="10.5" fill="none" stroke="hsl(50, 100%, 88%)" stroke-width="1.8"/>
     <polygon points="96,17 100,25 108,28 100,31 96,39 92,31 84,28 92,25" fill="hsl(56, 100%, 98%)"/>
     <path d="M54 14 L66 12 M64 56 L82 48 M16 32 L26 24" stroke="hsl(48, 100%, 84%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="72" cy="14" r="2" fill="hsl(304, 96%, 78%)"/>
     <circle cx="114" cy="20" r="2.1" fill="hsl(50, 100%, 92%)"/>
     <circle cx="88" cy="54" r="1.8" fill="hsl(46, 100%, 82%)"/>`,
    'hsla(46, 98%, 62%, 0.30)',
    `<linearGradient id="ca-follow_up-echo" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(284, 82%, 52%)" stop-opacity="0.16"/><stop offset="100%" stop-color="hsl(304, 94%, 72%)" stop-opacity="0.72"/></linearGradient><linearGradient id="ca-follow_up-strike" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(36, 98%, 54%)"/><stop offset="56%" stop-color="hsl(48, 100%, 78%)"/><stop offset="100%" stop-color="hsl(56, 100%, 98%)"/></linearGradient><radialGradient id="ca-follow_up-orb" cx="42%" cy="38%" r="58%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="48%" stop-color="hsl(46, 100%, 66%)"/><stop offset="100%" stop-color="hsl(34, 94%, 44%)" stop-opacity="0"/></radialGradient>`
  ),
  just_lucky: wrapArtSvg(
    'just_lucky',
    'hsl(268, 54%, 20%)',
    'hsl(214, 52%, 9%)',
    `<path d="M18 22 Q34 12 46 22 Q34 32 18 22 Z" fill="hsl(252, 54%, 24%)" stroke="hsl(194, 96%, 78%)" stroke-width="1.3"/>
     <circle cx="32" cy="22" r="3.6" fill="hsl(192, 100%, 82%)"/>
     <path d="M24 44 Q42 62 56 48 Q72 22 98 34" fill="none" stroke="hsl(48, 100%, 80%)" stroke-width="1.8" stroke-dasharray="4 3" stroke-linecap="round"/>
     <circle cx="48" cy="52" r="14" fill="url(#ca-just_lucky-ward)" stroke="hsl(192, 100%, 84%)" stroke-width="1.6"/>
     <path d="M40 50 Q48 44 56 50" fill="none" stroke="hsl(190, 100%, 94%)" stroke-width="1.2" opacity="0.8"/>
     <rect x="52" y="20" width="22" height="22" rx="4" fill="hsl(262, 60%, 10%)" opacity="0.6" transform="rotate(-16 63 31) translate(2,2.5)"/>
     <rect x="52" y="20" width="22" height="22" rx="4" fill="url(#ca-just_lucky-die)" stroke="hsl(54, 100%, 96%)" stroke-width="1.4" transform="rotate(-16 63 31)"/>
     <circle cx="59" cy="27" r="1.8" fill="hsl(276, 66%, 24%)"/>
     <circle cx="67" cy="25" r="1.8" fill="hsl(276, 66%, 24%)"/>
     <circle cx="63" cy="31" r="1.9" fill="hsl(342, 92%, 52%)"/>
     <circle cx="59" cy="37" r="1.8" fill="hsl(276, 66%, 24%)"/>
     <circle cx="67" cy="35" r="1.8" fill="hsl(276, 66%, 24%)"/>
     <circle cx="98" cy="36" r="18" fill="url(#ca-just_lucky-spark)"/>
     <polygon points="98,20 102,32 114,36 102,40 98,52 94,40 82,36 94,32" fill="hsl(54, 100%, 94%)" stroke="hsl(344, 94%, 64%)" stroke-width="1.1"/>
     <polygon points="22,52 24,56 28,58 24,60 22,64 20,60 16,58 20,56" fill="hsl(50, 100%, 90%)"/>
     <circle cx="84" cy="16" r="2" fill="hsl(50, 100%, 92%)"/>`,
    'hsla(48, 98%, 64%, 0.28)',
    `<linearGradient id="ca-just_lucky-die" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 94%)"/><stop offset="56%" stop-color="hsl(44, 96%, 64%)"/><stop offset="100%" stop-color="hsl(32, 82%, 40%)"/></linearGradient><radialGradient id="ca-just_lucky-ward" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(192, 100%, 90%)" stop-opacity="0.58"/><stop offset="100%" stop-color="hsl(204, 92%, 56%)" stop-opacity="0.1"/></radialGradient><radialGradient id="ca-just_lucky-spark" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="55%" stop-color="hsl(342, 96%, 62%)" stop-opacity="0.62"/><stop offset="100%" stop-color="hsl(296, 80%, 34%)" stop-opacity="0"/></radialGradient>`
  ),
  sash_whip: wrapArtSvg(
    'sash_whip',
    'hsl(304, 58%, 20%)',
    'hsl(266, 54%, 8%)',
    `<path d="M12 22 Q44 6 82 18 M20 62 Q64 68 108 50" fill="none" stroke="hsl(312, 82%, 62%)" stroke-width="1.3" opacity="0.45"/>
     <circle cx="102" cy="24" r="20" fill="url(#ca-sash_whip-snap)"/>
     <path d="M12 58 Q30 66 44 46 Q56 26 42 20 Q28 16 32 34 Q36 52 68 46 Q92 42 102 24" fill="none" stroke="hsl(280, 68%, 10%)" stroke-width="9" stroke-linecap="round" opacity="0.6" transform="translate(2,3)"/>
     <path d="M12 58 Q30 66 44 46 Q56 26 42 20 Q28 16 32 34 Q36 52 68 46 Q92 42 102 24" fill="none" stroke="url(#ca-sash_whip-fabric)" stroke-width="7.2" stroke-linecap="round"/>
     <path d="M12 58 Q30 66 44 46 Q56 26 42 20 Q28 16 32 34 Q36 52 68 46 Q92 42 102 24" fill="none" stroke="url(#ca-sash_whip-trim)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M98 24 L112 14 L115 24 L106 32 Z" fill="url(#ca-sash_whip-trim)" stroke="hsl(54, 100%, 96%)" stroke-width="1"/>
     <path d="M90 12 Q104 8 114 16 M96 36 Q110 38 118 28" fill="none" stroke="hsl(50, 100%, 88%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M100 12 L103 21 L113 18 L106 25 L114 33 L103 28 L99 36 L98 26 L90 23 L98 20 Z" fill="hsl(56, 100%, 98%)"/>
     <path d="M62 28 Q74 22 86 24 M58 56 Q72 58 84 52" fill="none" stroke="hsl(326, 96%, 74%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="82" cy="14" r="1.9" fill="hsl(50, 100%, 92%)"/>
     <circle cx="116" cy="40" r="2" fill="hsl(46, 100%, 82%)"/>
     <circle cx="24" cy="44" r="1.6" fill="hsl(324, 96%, 76%)"/>`,
    'hsla(320, 94%, 60%, 0.28)',
    `<linearGradient id="ca-sash_whip-fabric" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(282, 66%, 30%)"/><stop offset="52%" stop-color="hsl(324, 90%, 54%)"/><stop offset="100%" stop-color="hsl(44, 100%, 72%)"/></linearGradient><linearGradient id="ca-sash_whip-trim" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 94%)"/><stop offset="100%" stop-color="hsl(38, 96%, 54%)"/></linearGradient><radialGradient id="ca-sash_whip-snap" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="48%" stop-color="hsl(46, 100%, 68%)" stop-opacity="0.74"/><stop offset="100%" stop-color="hsl(322, 94%, 54%)" stop-opacity="0"/></radialGradient>`
  ),
  crescendo: wrapArtSvg(
    'crescendo',
    'hsl(338, 70%, 22%)',
    'hsl(296, 58%, 9%)',
    `<ellipse cx="92" cy="36" rx="40" ry="30" fill="url(#ca-crescendo-glow)"/>
     <path d="M16 36 Q26 26 26 36 Q26 46 16 36 Z" fill="hsl(296, 86%, 68%)" opacity="0.7"/>
     <path d="M36 27 Q44 36 36 45" fill="none" stroke="hsl(326, 94%, 68%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M54 20 Q65 36 54 52" fill="none" stroke="hsl(344, 98%, 64%)" stroke-width="3" stroke-linecap="round"/>
     <path d="M74 13 Q88 36 74 59" fill="none" stroke="hsl(24, 100%, 66%)" stroke-width="3.6" stroke-linecap="round"/>
     <path d="M96 8 Q114 36 96 64" fill="none" stroke="hsl(48, 100%, 86%)" stroke-width="4.2" stroke-linecap="round"/>
     <path d="M112 10 L16 36 L112 62" fill="none" stroke="hsl(312, 70%, 14%)" stroke-width="5.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.62" transform="translate(1.5,2)"/>
     <path d="M112 10 L16 36 L112 62" fill="none" stroke="url(#ca-crescendo-wave)" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M112 10 L16 36 L112 62" fill="none" stroke="hsl(54, 100%, 96%)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M84 52 Q88 34 102 22 Q100 34 114 24 Q108 42 114 54 Q98 46 84 52 Z" fill="url(#ca-crescendo-flame)" opacity="0.82"/>
     <circle cx="116" cy="18" r="2.2" fill="hsl(52, 100%, 94%)"/>
     <circle cx="118" cy="36" r="2.6" fill="hsl(50, 100%, 90%)"/>
     <circle cx="116" cy="54" r="2.2" fill="hsl(46, 100%, 84%)"/>
     <circle cx="64" cy="14" r="1.6" fill="hsl(344, 98%, 74%)"/>
     <circle cx="64" cy="58" r="1.6" fill="hsl(344, 98%, 74%)"/>`,
    'hsla(346, 98%, 58%, 0.32)',
    `<linearGradient id="ca-crescendo-wave" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(296, 86%, 56%)"/><stop offset="48%" stop-color="hsl(344, 96%, 58%)"/><stop offset="100%" stop-color="hsl(50, 100%, 84%)"/></linearGradient><linearGradient id="ca-crescendo-flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(326, 92%, 48%)"/><stop offset="56%" stop-color="hsl(14, 98%, 58%)"/><stop offset="100%" stop-color="hsl(52, 100%, 92%)"/></linearGradient><radialGradient id="ca-crescendo-glow" cx="76%" cy="50%" r="48%"><stop offset="0%" stop-color="hsl(48, 100%, 88%)" stop-opacity="0.78"/><stop offset="56%" stop-color="hsl(344, 98%, 54%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(304, 70%, 16%)" stop-opacity="0"/></radialGradient>`
  ),
  empty_body: wrapArtSvg(
    'empty_body',
    'hsl(226, 42%, 20%)',
    'hsl(252, 44%, 9%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-empty_body-aura)"/>
     <path d="M10 58 Q36 50 64 56 Q92 62 118 54" fill="none" stroke="hsl(206, 66%, 78%)" stroke-width="1.3" opacity="0.48"/>
     <path d="M40 16 A27 27 0 1 1 36 48" fill="none" stroke="url(#ca-empty_body-enso)" stroke-width="3.2" stroke-linecap="round" opacity="0.82"/>
     <circle cx="64" cy="36" r="21" fill="none" stroke="hsl(200, 84%, 88%)" stroke-width="1" stroke-dasharray="3 3" opacity="0.65"/>
     <path d="M64 24 Q72 26 74 37 L82 48 Q86 55 76 58 H52 Q42 55 46 48 L54 37 Q56 26 64 24 Z" fill="url(#ca-empty_body-figure)" stroke="hsl(52, 82%, 96%)" stroke-width="1.4" stroke-linejoin="round"/>
     <circle cx="64" cy="18" r="5.5" fill="url(#ca-empty_body-figure)" stroke="hsl(52, 84%, 96%)" stroke-width="1.3"/>
     <path d="M56 36 Q64 41 72 36 M52 54 Q64 48 76 54" fill="none" stroke="hsl(54, 90%, 96%)" stroke-width="1.2" stroke-linecap="round" opacity="0.82"/>
     <path d="M40 60 Q54 54 64 60 Q74 66 88 60" fill="none" stroke="hsl(202, 88%, 88%)" stroke-width="1.8" stroke-linecap="round" opacity="0.78"/>
     <path d="M22 26 Q30 30 34 38 M26 42 Q32 46 38 46" fill="none" stroke="hsl(338, 72%, 72%)" stroke-width="1.4" stroke-linecap="round" opacity="0.54"/>
     <path d="M106 26 Q98 30 94 38 M102 42 Q96 46 90 46" fill="none" stroke="hsl(194, 88%, 78%)" stroke-width="1.4" stroke-linecap="round" opacity="0.62"/>
     <circle cx="24" cy="18" r="1.8" fill="hsl(336, 78%, 78%)" opacity="0.7"/>
     <circle cx="104" cy="18" r="1.8" fill="hsl(192, 92%, 82%)" opacity="0.78"/>
     <circle cx="64" cy="7" r="1.8" fill="hsl(52, 90%, 96%)"/>`,
    'hsla(204, 62%, 78%, 0.26)',
    `<linearGradient id="ca-empty_body-figure" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 72%, 96%)" stop-opacity="0.92"/><stop offset="56%" stop-color="hsl(204, 72%, 82%)" stop-opacity="0.58"/><stop offset="100%" stop-color="hsl(256, 54%, 44%)" stop-opacity="0.08"/></linearGradient><linearGradient id="ca-empty_body-enso" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 68%, 94%)"/><stop offset="55%" stop-color="hsl(198, 76%, 80%)"/><stop offset="100%" stop-color="hsl(276, 56%, 72%)"/></linearGradient><radialGradient id="ca-empty_body-aura" cx="50%" cy="46%" r="50%"><stop offset="0%" stop-color="hsl(204, 90%, 92%)" stop-opacity="0.46"/><stop offset="100%" stop-color="hsl(250, 50%, 20%)" stop-opacity="0"/></radialGradient>`
  ),
  evaluate: wrapArtSvg(
    'evaluate',
    'hsl(256, 56%, 20%)',
    'hsl(214, 58%, 10%)',
    `<circle cx="64" cy="34" r="32" fill="url(#ca-evaluate-halo)"/>
     <path d="M12 66 Q64 56 116 66 L128 72 H0 Z" fill="hsla(244, 54%, 14%, 0.65)"/>
     <path d="M24 58 Q64 10 104 58" fill="none" stroke="hsla(272, 74%, 72%, 0.22)" stroke-width="1.2" stroke-dasharray="3 3"/>
     <ellipse cx="64" cy="63" rx="22" ry="4" fill="hsla(240, 60%, 6%, 0.55)"/>
     <path d="M52 63 L60 56 H68 L76 63 Z" fill="url(#ca-evaluate-gold)" stroke="hsl(32, 68%, 24%)" stroke-width="1"/>
     <rect x="62" y="18" width="4" height="39" rx="1.6" fill="url(#ca-evaluate-gold)" stroke="hsl(32, 68%, 24%)" stroke-width="0.9"/>
     <path d="M24 27 Q64 19 104 27" fill="none" stroke="url(#ca-evaluate-gold)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M28 26 L21 44 M28 26 L37 44 M100 26 L91 44 M100 26 L107 44" stroke="hsla(46, 94%, 76%, 0.72)" stroke-width="1"/>
     <path d="M18 44 Q29 53 40 44 Z" fill="url(#ca-evaluate-gold)" stroke="hsl(32, 66%, 26%)" stroke-width="1"/>
     <path d="M88 44 Q99 53 110 44 Z" fill="url(#ca-evaluate-gold)" stroke="hsl(32, 66%, 26%)" stroke-width="1"/>
     <circle cx="29" cy="40" r="6.5" fill="url(#ca-evaluate-orb)" stroke="hsl(190, 100%, 84%)" stroke-width="1"/>
     <polygon points="99,31 106,39 99,45 92,39" fill="hsl(48, 100%, 82%)" stroke="hsl(286, 78%, 62%)" stroke-width="1.1"/>
     <path d="M57 18 Q64 11 71 18 Q64 25 57 18 Z" fill="hsl(276, 64%, 28%)" stroke="hsl(48, 100%, 80%)" stroke-width="1.2"/>
     <circle cx="64" cy="18" r="2.6" fill="hsl(192, 100%, 76%)"/>
     <circle cx="26" cy="38" r="1.4" fill="hsl(0, 0%, 100%)" opacity="0.88"/>
     <circle cx="46" cy="14" r="1.4" fill="hsl(48, 100%, 86%)"/>
     <circle cx="84" cy="15" r="1.2" fill="hsl(192, 100%, 84%)"/>`,
    'hsla(198, 94%, 62%, 0.28)',
    `<radialGradient id="ca-evaluate-halo" cx="50%" cy="46%" r="48%"><stop offset="0%" stop-color="hsla(46, 98%, 70%, 0.34)"/><stop offset="100%" stop-color="hsla(260, 70%, 20%, 0)"/></radialGradient><linearGradient id="ca-evaluate-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 84%)"/><stop offset="55%" stop-color="hsl(42, 92%, 58%)"/><stop offset="100%" stop-color="hsl(32, 76%, 34%)"/></linearGradient><radialGradient id="ca-evaluate-orb" cx="38%" cy="35%" r="65%"><stop offset="0%" stop-color="hsl(188, 100%, 92%)"/><stop offset="55%" stop-color="hsl(198, 94%, 58%)"/><stop offset="100%" stop-color="hsl(228, 76%, 30%)"/></radialGradient>`
  ),
  halt: wrapArtSvg(
    'halt',
    'hsl(338, 60%, 20%)',
    'hsl(248, 56%, 10%)',
    `<path d="M0 12 L70 20 V56 L0 64 Z" fill="hsla(344, 88%, 42%, 0.28)"/>
     <path d="M0 64 H128 V72 H0 Z" fill="hsla(252, 48%, 10%, 0.72)"/>
     <path d="M8 22 Q38 18 68 30 Q42 36 12 34 Z" fill="url(#ca-halt-wrath)" opacity="0.82"/>
     <path d="M6 48 Q36 38 68 42 Q40 54 10 56 Z" fill="url(#ca-halt-wrath)" opacity="0.72"/>
     <path d="M24 35 Q48 28 69 36 Q48 44 24 37 Z" fill="hsl(44, 100%, 76%)" opacity="0.9"/>
     <path d="M70 6 H96 Q106 36 96 66 H70 Z" fill="url(#ca-halt-wall)" opacity="0.58"/>
     <rect x="67" y="7" width="7" height="58" rx="3" fill="url(#ca-halt-gold)" stroke="hsl(32, 68%, 24%)" stroke-width="1"/>
     <line x1="69" y1="10" x2="69" y2="62" stroke="hsl(50, 100%, 94%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="88" cy="36" r="14" fill="hsla(194, 96%, 58%, 0.24)" stroke="hsl(190, 100%, 80%)" stroke-width="1.5"/>
     <path d="M84 30 V42 M88 27 V43 M92 29 V42 M80 35 L84 42 H93 L95 36" fill="none" stroke="hsl(48, 100%, 86%)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M67 24 Q55 15 48 10 M67 48 Q56 56 46 62" fill="none" stroke="hsl(22, 100%, 66%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M66 30 Q58 26 54 20 M66 42 Q58 46 53 53" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="44" cy="14" r="1.8" fill="hsl(348, 100%, 70%)"/>
     <circle cx="52" cy="58" r="1.6" fill="hsl(36, 100%, 74%)"/>
     <circle cx="109" cy="24" r="1.8" fill="hsl(192, 100%, 84%)"/>
     <circle cx="114" cy="48" r="1.4" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(344, 94%, 58%, 0.28)',
    `<linearGradient id="ca-halt-wrath" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsl(348, 96%, 54%)"/><stop offset="65%" stop-color="hsl(16, 98%, 58%)"/><stop offset="100%" stop-color="hsl(48, 100%, 82%)"/></linearGradient><linearGradient id="ca-halt-wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(48, 100%, 88%)"/><stop offset="35%" stop-color="hsl(192, 98%, 68%)"/><stop offset="100%" stop-color="hsla(210, 92%, 44%, 0.2)"/></linearGradient><linearGradient id="ca-halt-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 86%)"/><stop offset="50%" stop-color="hsl(42, 92%, 58%)"/><stop offset="100%" stop-color="hsl(32, 74%, 34%)"/></linearGradient>`
  ),
  prostrate: wrapArtSvg(
    'prostrate',
    'hsl(274, 54%, 20%)',
    'hsl(36, 54%, 11%)',
    `<circle cx="64" cy="30" r="34" fill="url(#ca-prostrate-sun)"/>
     <circle cx="64" cy="28" r="21" fill="none" stroke="hsla(48, 100%, 78%, 0.45)" stroke-width="1.2" stroke-dasharray="4 3"/>
     <circle cx="64" cy="28" r="13" fill="hsla(48, 100%, 76%, 0.24)" stroke="hsl(48, 100%, 84%)" stroke-width="1.4"/>
     <path d="M64 10 L67 24 L81 28 L67 32 L64 46 L61 32 L47 28 L61 24 Z" fill="hsl(50, 100%, 90%)" opacity="0.88"/>
     <path d="M0 54 H128 V72 H0 Z" fill="url(#ca-prostrate-floor)"/>
     <path d="M10 66 L36 54 M118 66 L92 54 M44 70 L54 54 M84 70 L74 54" stroke="hsla(44, 78%, 68%, 0.22)" stroke-width="1"/>
     <ellipse cx="64" cy="61" rx="34" ry="4.2" fill="hsla(256, 62%, 5%, 0.65)"/>
     <path d="M36 59 Q44 43 60 44 Q74 45 84 55 L96 58 Q99 60 95 61 H42 Q34 61 36 59 Z" fill="url(#ca-prostrate-robe)" stroke="hsl(46, 94%, 72%)" stroke-width="1.2"/>
     <circle cx="80" cy="54" r="4.8" fill="hsl(274, 48%, 22%)" stroke="hsl(48, 100%, 78%)" stroke-width="1.1"/>
     <path d="M40 54 Q52 46 69 48" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.5" stroke-linecap="round" opacity="0.86"/>
     <path d="M56 59 Q64 52 74 58" fill="none" stroke="hsl(292, 82%, 68%)" stroke-width="1.4" opacity="0.72"/>
     <path d="M22 14 L42 30 M106 14 L86 30" stroke="hsla(48, 100%, 82%, 0.34)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="34" cy="24" r="1.7" fill="hsl(48, 100%, 86%)"/>
     <circle cx="94" cy="22" r="1.9" fill="hsl(48, 100%, 88%)"/>
     <circle cx="48" cy="40" r="1.4" fill="hsl(46, 100%, 82%)"/>
     <circle cx="82" cy="38" r="1.4" fill="hsl(46, 100%, 82%)"/>`,
    'hsla(46, 98%, 62%, 0.32)',
    `<radialGradient id="ca-prostrate-sun" cx="50%" cy="38%" r="48%"><stop offset="0%" stop-color="hsl(48, 100%, 86%)"/><stop offset="42%" stop-color="hsla(42, 98%, 58%, 0.48)"/><stop offset="100%" stop-color="hsla(276, 62%, 22%, 0)"/></radialGradient><linearGradient id="ca-prostrate-robe" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(278, 56%, 34%)"/><stop offset="55%" stop-color="hsl(268, 54%, 18%)"/><stop offset="100%" stop-color="hsl(254, 52%, 10%)"/></linearGradient><linearGradient id="ca-prostrate-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(266, 38%, 22%)"/><stop offset="100%" stop-color="hsl(252, 44%, 9%)"/></linearGradient>`
  ),
  protect: wrapArtSvg(
    'protect',
    'hsl(232, 58%, 20%)',
    'hsl(268, 54%, 10%)',
    `<circle cx="64" cy="36" r="30" fill="none" stroke="hsla(192, 96%, 72%, 0.25)" stroke-width="1.2" stroke-dasharray="6 4"/>
     <path d="M10 66 Q64 58 118 66 L128 72 H0 Z" fill="hsla(248, 56%, 9%, 0.7)"/>
     <ellipse cx="64" cy="64" rx="26" ry="4" fill="hsla(244, 68%, 5%, 0.6)"/>
     <path d="M64 8 L90 17 V37 C90 52 78 60 64 65 C50 60 38 52 38 37 V17 Z" fill="url(#ca-protect-dome)" stroke="url(#ca-protect-gold)" stroke-width="2.2"/>
     <path d="M64 14 L83 21 V36 C83 47 74 54 64 58 C54 54 45 47 45 36 V21 Z" fill="url(#ca-protect-amethyst)" stroke="hsl(192, 100%, 78%)" stroke-width="1.2"/>
     <path d="M64 19 Q72 29 64 41 Q56 29 64 19 Z" fill="hsl(48, 100%, 84%)" stroke="hsl(34, 82%, 44%)" stroke-width="0.9"/>
     <path d="M51 35 Q58 31 64 42 Q70 31 77 35 Q70 46 64 48 Q58 46 51 35 Z" fill="hsla(192, 100%, 76%, 0.72)" stroke="hsl(48, 100%, 82%)" stroke-width="1"/>
     <path d="M44 21 Q54 17 64 14" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.6" stroke-linecap="round" opacity="0.72"/>
     <path d="M22 24 L31 28 M18 39 L30 39 M106 24 L97 28 M110 39 L98 39" stroke="hsl(192, 100%, 78%)" stroke-width="1.8" stroke-linecap="round" opacity="0.75"/>
     <polygon points="24,14 27,18 24,22 21,18" fill="hsl(48, 100%, 82%)"/>
     <polygon points="104,14 107,18 104,22 101,18" fill="hsl(48, 100%, 82%)"/>
     <circle cx="64" cy="31" r="2.6" fill="hsl(0, 0%, 100%)" opacity="0.9"/>
     <circle cx="32" cy="54" r="1.6" fill="hsl(192, 100%, 82%)"/>
     <circle cx="96" cy="54" r="1.6" fill="hsl(192, 100%, 82%)"/>`,
    'hsla(196, 96%, 62%, 0.30)',
    `<radialGradient id="ca-protect-dome" cx="50%" cy="38%" r="55%"><stop offset="0%" stop-color="hsla(190, 100%, 84%, 0.65)"/><stop offset="55%" stop-color="hsla(202, 92%, 48%, 0.42)"/><stop offset="100%" stop-color="hsla(262, 72%, 24%, 0.72)"/></radialGradient><linearGradient id="ca-protect-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 86%)"/><stop offset="50%" stop-color="hsl(42, 92%, 58%)"/><stop offset="100%" stop-color="hsl(30, 74%, 34%)"/></linearGradient><linearGradient id="ca-protect-amethyst" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(280, 68%, 48%)"/><stop offset="100%" stop-color="hsl(258, 62%, 22%)"/></linearGradient>`
  ),
  third_eye: wrapArtSvg(
    'third_eye',
    'hsl(268, 60%, 22%)',
    'hsl(216, 58%, 10%)',
    `<circle cx="64" cy="35" r="35" fill="url(#ca-third_eye-glow)"/>
     <circle cx="64" cy="35" r="27" fill="none" stroke="hsla(192, 100%, 76%, 0.3)" stroke-width="1.2"/>
     <circle cx="64" cy="35" r="36" fill="none" stroke="hsla(48, 96%, 72%, 0.22)" stroke-width="1" stroke-dasharray="5 4"/>
     <path d="M64 2 V13 M64 57 V70 M16 14 L34 25 M112 14 L94 25 M16 56 L34 45 M112 56 L94 45" stroke="hsla(48, 100%, 80%, 0.55)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M24 68 Q34 42 64 40 Q94 42 104 68 Z" fill="hsla(266, 52%, 14%, 0.72)" stroke="hsla(288, 72%, 62%, 0.45)" stroke-width="1.2"/>
     <path d="M20 35 Q64 9 108 35 Q64 61 20 35 Z" fill="hsl(258, 56%, 16%)" stroke="url(#ca-third_eye-lid)" stroke-width="2.2"/>
     <path d="M31 35 Q64 17 97 35 Q64 53 31 35 Z" fill="hsla(196, 86%, 72%, 0.24)"/>
     <circle cx="64" cy="35" r="13.5" fill="url(#ca-third_eye-iris)" stroke="hsl(48, 100%, 82%)" stroke-width="1.5"/>
     <ellipse cx="64" cy="35" rx="3.4" ry="8.5" fill="hsl(264, 72%, 14%)" stroke="hsl(190, 100%, 86%)" stroke-width="0.9"/>
     <circle cx="59" cy="30" r="2.6" fill="hsl(0, 0%, 100%)" opacity="0.92"/>
     <polygon points="18,35 23,31 28,35 23,39" fill="hsl(48, 100%, 82%)"/>
     <polygon points="100,35 105,31 110,35 105,39" fill="hsl(48, 100%, 82%)"/>
     <rect x="44" y="54" width="8" height="11" rx="1.4" transform="rotate(-14 48 59)" fill="hsla(286, 80%, 62%, 0.65)" stroke="hsl(48, 100%, 82%)" stroke-width="1"/>
     <rect x="60" y="55" width="8" height="11" rx="1.4" fill="hsla(192, 92%, 62%, 0.7)" stroke="hsl(48, 100%, 84%)" stroke-width="1"/>
     <rect x="76" y="54" width="8" height="11" rx="1.4" transform="rotate(14 80 59)" fill="hsla(286, 80%, 62%, 0.65)" stroke="hsl(48, 100%, 82%)" stroke-width="1"/>`,
    'hsla(192, 98%, 64%, 0.32)',
    `<radialGradient id="ca-third_eye-glow" cx="50%" cy="46%" r="52%"><stop offset="0%" stop-color="hsla(190, 100%, 82%, 0.45)"/><stop offset="55%" stop-color="hsla(282, 86%, 52%, 0.25)"/><stop offset="100%" stop-color="hsla(238, 60%, 14%, 0)"/></radialGradient><radialGradient id="ca-third_eye-iris" cx="46%" cy="44%" r="55%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="45%" stop-color="hsl(190, 100%, 66%)"/><stop offset="100%" stop-color="hsl(268, 84%, 38%)"/></radialGradient><linearGradient id="ca-third_eye-lid" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 84%)"/><stop offset="55%" stop-color="hsl(40, 92%, 56%)"/><stop offset="100%" stop-color="hsl(282, 74%, 44%)"/></linearGradient>`
  ),
  tranquility: wrapArtSvg(
    'tranquility',
    'hsl(204, 62%, 20%)',
    'hsl(240, 58%, 10%)',
    `<path d="M0 44 Q32 35 64 42 Q96 34 128 43 V48 H0 Z" fill="hsla(230, 52%, 14%, 0.78)"/>
     <rect x="0" y="45" width="128" height="27" fill="url(#ca-tranquility-pond)"/>
     <circle cx="64" cy="24" r="22" fill="hsla(192, 100%, 74%, 0.16)"/>
     <path d="M72 9 A15 15 0 1 0 72 39 A11.5 11.5 0 1 1 72 9 Z" fill="url(#ca-tranquility-moon)" stroke="hsl(190, 100%, 92%)" stroke-width="0.8"/>
     <circle cx="64" cy="25" r="7.5" fill="url(#ca-tranquility-orb)"/>
     <path d="M64 19 Q68 25 64 31 Q60 25 64 19 Z" fill="hsl(50, 100%, 94%)" opacity="0.92"/>
     <ellipse cx="64" cy="56" rx="28" ry="6.5" fill="none" stroke="hsla(190, 100%, 80%, 0.65)" stroke-width="1.3"/>
     <ellipse cx="64" cy="56" rx="15" ry="3.4" fill="hsla(190, 100%, 82%, 0.28)" stroke="hsl(188, 100%, 88%)" stroke-width="1.1"/>
     <path d="M54 49 H74 M58 53 H70 M60 61 H68" stroke="hsl(190, 100%, 88%)" stroke-width="1.3" stroke-linecap="round" opacity="0.72"/>
     <path d="M10 6 Q18 22 14 40 M20 6 Q25 18 23 32 M118 6 Q110 22 114 40" fill="none" stroke="hsla(196, 68%, 62%, 0.42)" stroke-width="1.4" stroke-linecap="round"/>
     <ellipse cx="14" cy="30" rx="2" ry="4" fill="hsla(188, 90%, 74%, 0.5)"/>
     <ellipse cx="114" cy="28" rx="2" ry="4" fill="hsla(188, 90%, 74%, 0.5)"/>
     <circle cx="34" cy="18" r="1.4" fill="hsl(52, 100%, 90%)"/>
     <circle cx="94" cy="16" r="1.6" fill="hsl(190, 100%, 88%)"/>
     <circle cx="42" cy="36" r="1.2" fill="hsl(192, 100%, 84%)"/>
     <circle cx="88" cy="38" r="1.3" fill="hsl(52, 100%, 88%)"/>`,
    'hsla(192, 98%, 66%, 0.30)',
    `<radialGradient id="ca-tranquility-moon" cx="42%" cy="40%" r="58%"><stop offset="0%" stop-color="hsl(52, 100%, 96%)"/><stop offset="65%" stop-color="hsl(190, 92%, 82%)"/><stop offset="100%" stop-color="hsl(206, 84%, 56%)"/></radialGradient><linearGradient id="ca-tranquility-pond" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(202, 74%, 26%)"/><stop offset="100%" stop-color="hsl(236, 64%, 11%)"/></linearGradient><radialGradient id="ca-tranquility-orb" cx="42%" cy="38%" r="60%"><stop offset="0%" stop-color="hsl(0, 0%, 100%)"/><stop offset="55%" stop-color="hsl(188, 100%, 72%)"/><stop offset="100%" stop-color="hsla(202, 94%, 50%, 0.2)"/></radialGradient>`
  ),
  pressure_points: wrapArtSvg(
    'pressure_points',
    'hsl(292, 62%, 20%)',
    'hsl(334, 58%, 10%)',
    `<circle cx="70" cy="36" r="31" fill="url(#ca-pressure_points-pulse)" opacity="0.65"/>
     <circle cx="70" cy="36" r="24" fill="none" stroke="hsla(322, 100%, 68%, 0.45)" stroke-width="1.3" stroke-dasharray="6 3"/>
     <circle cx="70" cy="36" r="15" fill="none" stroke="hsl(326, 100%, 74%)" stroke-width="1.6"/>
     <path d="M52 68 L55 34 Q56 26 63 24 Q63 14 70 12 Q77 14 77 24 Q84 26 85 34 L88 68 Z" fill="url(#ca-pressure_points-body)" stroke="hsla(304, 86%, 70%, 0.65)" stroke-width="1.3"/>
     <path d="M70 18 V62 M58 32 Q70 36 82 32 M60 48 Q70 52 80 48" fill="none" stroke="hsla(48, 100%, 76%, 0.65)" stroke-width="1.2" stroke-dasharray="2 2"/>
     <circle cx="70" cy="20" r="3" fill="hsl(322, 100%, 68%)" stroke="hsl(50, 100%, 90%)" stroke-width="1"/>
     <circle cx="60" cy="33" r="2.7" fill="hsl(322, 100%, 66%)" stroke="hsl(50, 100%, 88%)" stroke-width="0.9"/>
     <circle cx="80" cy="33" r="2.7" fill="hsl(322, 100%, 66%)" stroke="hsl(50, 100%, 88%)" stroke-width="0.9"/>
     <circle cx="70" cy="52" r="3.2" fill="hsl(322, 100%, 68%)" stroke="hsl(50, 100%, 90%)" stroke-width="1"/>
     <circle cx="70" cy="36" r="6.2" fill="url(#ca-pressure_points-pulse)" stroke="hsl(50, 100%, 92%)" stroke-width="1.3"/>
     <path d="M12 22 L42 32 L64 35 L40 39 L12 33 Z" fill="url(#ca-pressure_points-hand)" stroke="hsl(286, 62%, 28%)" stroke-width="1.1"/>
     <path d="M88 22 L108 16 M92 36 L114 36 M88 50 L108 56" stroke="hsl(324, 100%, 74%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="102" cy="26" r="1.8" fill="hsl(50, 100%, 88%)"/>
     <circle cx="98" cy="48" r="1.6" fill="hsl(322, 100%, 76%)"/>`,
    'hsla(318, 98%, 62%, 0.32)',
    `<radialGradient id="ca-pressure_points-pulse" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(50, 100%, 94%)"/><stop offset="40%" stop-color="hsl(320, 100%, 64%)"/><stop offset="100%" stop-color="hsla(304, 92%, 44%, 0)"/></radialGradient><linearGradient id="ca-pressure_points-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsla(276, 56%, 34%, 0.85)"/><stop offset="100%" stop-color="hsla(256, 60%, 14%, 0.92)"/></linearGradient><linearGradient id="ca-pressure_points-hand" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 96%, 86%)"/><stop offset="100%" stop-color="hsl(320, 86%, 64%)"/></linearGradient>`
  ),
  carve_reality: wrapArtSvg(
    'carve_reality',
    'hsl(276, 58%, 20%)',
    'hsl(232, 56%, 10%)',
    `<path d="M0 18 L48 24 M0 42 L34 46 M82 28 L128 22 M90 52 L128 48" stroke="hsla(282, 76%, 68%, 0.24)" stroke-width="1.1"/>
     <ellipse cx="64" cy="36" rx="34" ry="26" fill="url(#ca-carve_reality-core)"/>
     <path d="M18 65 Q54 34 108 6 Q76 42 26 67 Z" fill="url(#ca-carve_reality-rift)" stroke="hsl(48, 100%, 92%)" stroke-width="1.4"/>
     <path d="M26 63 Q60 36 102 10" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M64 18 L70 34 L64 52 L58 34 Z" fill="hsl(50, 100%, 88%)" stroke="hsl(34, 92%, 48%)" stroke-width="1.2"/>
     <rect x="59" y="48" width="10" height="3" rx="1" fill="hsl(44, 96%, 64%)"/>
     <path d="M16 20 Q42 30 78 52 L84 46 Q50 23 22 14 Z" fill="url(#ca-carve_reality-blade)" stroke="hsl(48, 100%, 84%)" stroke-width="1.3"/>
     <line x1="23" y1="18" x2="76" y2="48" stroke="hsl(0, 0%, 100%)" stroke-width="1.2" opacity="0.85"/>
     <polygon points="32,42 40,36 42,46" fill="hsl(274, 58%, 32%)" stroke="hsl(48, 100%, 78%)" stroke-width="0.9"/>
     <polygon points="86,44 96,38 92,50" fill="hsl(274, 58%, 32%)" stroke="hsl(48, 100%, 78%)" stroke-width="0.9"/>
     <polygon points="44,18 52,13 50,23" fill="hsl(268, 60%, 34%)" stroke="hsl(296, 92%, 78%)" stroke-width="0.9"/>
     <circle cx="96" cy="20" r="2.2" fill="hsl(50, 100%, 90%)"/>
     <circle cx="32" cy="56" r="1.9" fill="hsl(48, 100%, 84%)"/>
     <circle cx="108" cy="36" r="1.5" fill="hsl(296, 100%, 82%)"/>`,
    'hsla(46, 98%, 64%, 0.30)',
    `<linearGradient id="ca-carve_reality-rift" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(38, 100%, 56%)"/><stop offset="50%" stop-color="hsl(50, 100%, 90%)"/><stop offset="100%" stop-color="hsl(44, 100%, 64%)"/></linearGradient><linearGradient id="ca-carve_reality-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(296, 90%, 84%)"/><stop offset="55%" stop-color="hsl(274, 72%, 52%)"/><stop offset="100%" stop-color="hsl(248, 66%, 24%)"/></linearGradient><radialGradient id="ca-carve_reality-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(48, 100%, 86%, 0.75)"/><stop offset="100%" stop-color="hsla(40, 100%, 54%, 0)"/></radialGradient>`
  ),
  conclude: wrapArtSvg(
    'conclude',
    'hsl(298, 56%, 20%)',
    'hsl(246, 58%, 10%)',
    `<circle cx="64" cy="32" r="25" fill="url(#ca-conclude-eclipse)"/>
     <circle cx="64" cy="32" r="15.5" fill="hsl(258, 58%, 11%)" stroke="hsl(48, 100%, 80%)" stroke-width="1.3"/>
     <path d="M0 72 V56 L22 47 L46 55 L74 46 L104 56 L128 49 V72 Z" fill="hsla(256, 52%, 11%, 0.88)"/>
     <path d="M6 42 Q64 25 122 36 Q64 33 6 46 Z" fill="hsla(326, 96%, 60%, 0.62)"/>
     <path d="M8 40 Q64 27 120 35 Q64 31 8 42 Z" fill="url(#ca-conclude-slash)"/>
     <path d="M16 39 Q64 28 116 35" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M92 64 L96 42 Q100 35 106 39 L112 64 Z" fill="hsl(274, 52%, 18%)" stroke="hsl(46, 94%, 74%)" stroke-width="1.1"/>
     <circle cx="101" cy="34" r="4.2" fill="hsl(274, 50%, 16%)" stroke="hsl(48, 100%, 82%)" stroke-width="1"/>
     <path d="M84 44 L116 30" stroke="hsl(48, 100%, 82%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M36 20 L38 48 M64 14 L64 52 M86 22 L84 46" stroke="hsla(48, 100%, 86%, 0.25)" stroke-width="1.1" stroke-dasharray="3 3"/>
     <ellipse cx="26" cy="26" rx="3" ry="1.4" transform="rotate(-25 26 26)" fill="hsl(328, 100%, 76%)"/>
     <ellipse cx="48" cy="52" rx="3.2" ry="1.4" transform="rotate(20 48 52)" fill="hsl(48, 100%, 82%)"/>
     <ellipse cx="78" cy="18" rx="2.8" ry="1.3" transform="rotate(-18 78 18)" fill="hsl(326, 100%, 78%)"/>
     <circle cx="118" cy="35" r="2.6" fill="hsl(0, 0%, 100%)"/>`,
    'hsla(328, 92%, 60%, 0.28)',
    `<radialGradient id="ca-conclude-eclipse" cx="50%" cy="50%" r="50%"><stop offset="56%" stop-color="hsl(260, 62%, 10%)"/><stop offset="82%" stop-color="hsl(44, 100%, 70%)"/><stop offset="100%" stop-color="hsla(326, 94%, 56%, 0)"/></radialGradient><linearGradient id="ca-conclude-slash" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsla(322, 98%, 62%, 0.1)"/><stop offset="40%" stop-color="hsl(48, 100%, 88%)"/><stop offset="78%" stop-color="hsl(0, 0%, 100%)"/><stop offset="100%" stop-color="hsl(326, 100%, 68%)"/></linearGradient>`
  ),
  fear_no_evil: wrapArtSvg(
    'fear_no_evil',
    'hsl(224, 56%, 19%)',
    'hsl(344, 54%, 10%)',
    `<rect x="0" y="0" width="70" height="72" fill="url(#ca-fear_no_evil-evil)"/>
     <circle cx="88" cy="36" r="34" fill="url(#ca-fear_no_evil-calm)"/>
     <path d="M14 18 L24 22 L16 25 Z M32 16 L24 22 L33 23 Z" fill="hsl(354, 100%, 62%)"/>
     <path d="M8 52 Q26 30 56 34 L63 39 L48 42 L61 48 L42 49 L54 57 Q30 58 8 64 Z" fill="url(#ca-fear_no_evil-claw)" stroke="hsl(352, 92%, 58%)" stroke-width="1.3"/>
     <path d="M62 12 Q54 36 62 60" fill="none" stroke="hsl(190, 100%, 80%)" stroke-width="3" stroke-linecap="round"/>
     <path d="M67 16 Q60 36 67 56" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M80 65 L84 34 Q88 26 95 28 L104 65 Z" fill="hsl(246, 52%, 20%)" stroke="hsl(192, 96%, 76%)" stroke-width="1.3"/>
     <circle cx="91" cy="21" r="5" fill="hsl(246, 48%, 22%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.1"/>
     <path d="M84 34 L63 36" stroke="hsl(48, 100%, 88%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M62 24 L62 48 M50 36 H74" stroke="hsl(0, 0%, 100%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="62" cy="36" r="4.8" fill="hsl(190, 100%, 86%)" opacity="0.9"/>
     <path d="M46 24 L36 16 M48 52 L36 60" stroke="hsl(350, 96%, 64%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="106" cy="22" r="2" fill="hsl(190, 100%, 84%)"/>
     <circle cx="112" cy="46" r="1.6" fill="hsl(48, 100%, 86%)"/>
     <circle cx="42" cy="26" r="1.5" fill="hsl(354, 100%, 68%)"/>`,
    'hsla(194, 96%, 62%, 0.28)',
    `<linearGradient id="ca-fear_no_evil-evil" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsl(350, 74%, 22%)"/><stop offset="100%" stop-color="hsla(344, 62%, 12%, 0)"/></linearGradient><radialGradient id="ca-fear_no_evil-calm" cx="72%" cy="46%" r="48%"><stop offset="0%" stop-color="hsla(190, 100%, 76%, 0.52)"/><stop offset="100%" stop-color="hsla(210, 88%, 40%, 0)"/></radialGradient><linearGradient id="ca-fear_no_evil-claw" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(346, 62%, 28%)"/><stop offset="100%" stop-color="hsl(276, 54%, 12%)"/></linearGradient>`
  ),
  sands_of_time: wrapArtSvg(
    'sands_of_time',
    'hsl(258, 56%, 20%)',
    'hsl(34, 58%, 11%)',
    `<circle cx="64" cy="36" r="30" fill="none" stroke="hsla(46, 94%, 72%, 0.24)" stroke-width="1.2" stroke-dasharray="3 4"/>
     <ellipse cx="64" cy="36" rx="44" ry="12" transform="rotate(-16 64 36)" fill="none" stroke="hsla(286, 86%, 72%, 0.44)" stroke-width="1.5"/>
     <ellipse cx="64" cy="65" rx="22" ry="3.5" fill="hsla(256, 62%, 5%, 0.62)"/>
     <path d="M46 12 H82 Q82 28 67 36 Q82 44 82 60 H46 Q46 44 61 36 Q46 28 46 12 Z" fill="url(#ca-sands_of_time-glass)" stroke="hsl(48, 96%, 78%)" stroke-width="1.3"/>
     <path d="M51 22 H77 Q74 30 64 35 Q54 30 51 22 Z" fill="url(#ca-sands_of_time-sand)"/>
     <path d="M50 60 Q64 43 78 60 Z" fill="url(#ca-sands_of_time-sand)"/>
     <line x1="64" y1="35" x2="64" y2="52" stroke="hsl(52, 100%, 92%)" stroke-width="2" stroke-dasharray="3 1.5" stroke-linecap="round"/>
     <rect x="40" y="7" width="48" height="5.5" rx="2.4" fill="url(#ca-sands_of_time-gold)" stroke="hsl(28, 72%, 26%)" stroke-width="1"/>
     <rect x="40" y="59.5" width="48" height="5.5" rx="2.4" fill="url(#ca-sands_of_time-gold)" stroke="hsl(28, 72%, 26%)" stroke-width="1"/>
     <line x1="44" y1="12.5" x2="44" y2="59.5" stroke="url(#ca-sands_of_time-gold)" stroke-width="2.2"/>
     <line x1="84" y1="12.5" x2="84" y2="59.5" stroke="url(#ca-sands_of_time-gold)" stroke-width="2.2"/>
     <path d="M51 15 Q51 24 58 31 M51 56 Q51 47 58 41" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.3" stroke-linecap="round" opacity="0.72"/>
     <circle cx="24" cy="24" r="1.8" fill="hsl(48, 100%, 86%)"/>
     <circle cx="104" cy="22" r="2.1" fill="hsl(50, 100%, 90%)"/>
     <circle cx="30" cy="52" r="1.5" fill="hsl(292, 94%, 78%)"/>
     <circle cx="98" cy="48" r="1.7" fill="hsl(46, 100%, 84%)"/>`,
    'hsla(44, 98%, 64%, 0.32)',
    `<linearGradient id="ca-sands_of_time-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 88%)"/><stop offset="50%" stop-color="hsl(42, 94%, 58%)"/><stop offset="100%" stop-color="hsl(28, 76%, 32%)"/></linearGradient><linearGradient id="ca-sands_of_time-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(206, 94%, 82%, 0.45)"/><stop offset="50%" stop-color="hsla(266, 72%, 34%, 0.28)"/><stop offset="100%" stop-color="hsla(48, 100%, 84%, 0.35)"/></linearGradient><radialGradient id="ca-sands_of_time-sand" cx="50%" cy="55%" r="55%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="55%" stop-color="hsl(42, 100%, 62%)"/><stop offset="100%" stop-color="hsl(24, 92%, 44%)"/></radialGradient>`
  ),
  talk_to_the_hand: wrapArtSvg(
    'talk_to_the_hand',
    'hsl(236, 56%, 20%)',
    'hsl(284, 54%, 10%)',
    `<circle cx="72" cy="36" r="34" fill="url(#ca-talk_to_the_hand-wave)"/>
     <ellipse cx="76" cy="36" rx="28" ry="26" fill="none" stroke="hsla(190, 100%, 78%, 0.42)" stroke-width="1.4" stroke-dasharray="7 4"/>
     <ellipse cx="72" cy="36" rx="20" ry="19" fill="hsla(192, 98%, 62%, 0.16)" stroke="hsl(190, 100%, 82%)" stroke-width="1.8"/>
     <path d="M10 68 L28 46 L46 58 L32 72 Z" fill="hsl(278, 54%, 26%)" stroke="hsl(46, 92%, 70%)" stroke-width="1.3"/>
     <path d="M36 52 L42 30 Q43 26 47 28 L49 38 L52 17 Q54 13 58 16 L59 34 L63 14 Q66 11 69 15 L68 35 L74 18 Q77 16 79 20 L75 40 L84 32 Q88 31 87 36 L74 52 Q64 60 48 58 Z" fill="url(#ca-talk_to_the_hand-palm)" stroke="hsl(274, 58%, 24%)" stroke-width="1.4" stroke-linejoin="round"/>
     <circle cx="61" cy="43" r="6" fill="hsl(190, 100%, 78%)" stroke="hsl(48, 100%, 90%)" stroke-width="1.3"/>
     <circle cx="61" cy="43" r="2.4" fill="hsl(0, 0%, 100%)"/>
     <path d="M92 16 Q106 36 92 56 M100 12 Q117 36 100 60" fill="none" stroke="hsl(190, 100%, 80%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M88 22 Q98 36 88 50" fill="none" stroke="hsl(48, 100%, 86%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="108,24 113,28 108,32 103,28" fill="hsl(190, 100%, 84%)"/>
     <polygon points="110,44 114,48 110,52 106,48" fill="hsl(48, 100%, 84%)"/>
     <circle cx="24" cy="24" r="1.8" fill="hsl(292, 92%, 78%)"/>
     <circle cx="34" cy="16" r="1.4" fill="hsl(192, 100%, 82%)"/>`,
    'hsla(192, 98%, 64%, 0.30)',
    `<radialGradient id="ca-talk_to_the_hand-wave" cx="55%" cy="46%" r="50%"><stop offset="0%" stop-color="hsla(190, 100%, 84%, 0.56)"/><stop offset="65%" stop-color="hsla(198, 94%, 56%, 0.24)"/><stop offset="100%" stop-color="hsla(266, 76%, 34%, 0)"/></radialGradient><linearGradient id="ca-talk_to_the_hand-palm" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 90%)"/><stop offset="55%" stop-color="hsl(42, 90%, 66%)"/><stop offset="100%" stop-color="hsl(288, 62%, 44%)"/></linearGradient>`
  ),
  tantrum: wrapArtSvg(
    'tantrum',
    'hsl(338, 68%, 22%)',
    'hsl(284, 58%, 10%)',
    `<path d="M0 58 L26 52 L48 59 L78 51 L104 58 L128 53 V72 H0 Z" fill="hsl(278, 48%, 13%)" stroke="hsl(344, 88%, 54%)" stroke-width="1.2"/>
     <path d="M10 6 L46 42 L36 48 L4 14 Z" fill="url(#ca-tantrum-trail)"/>
     <path d="M46 4 L72 48 L60 52 L36 8 Z" fill="url(#ca-tantrum-trail)"/>
     <path d="M84 6 L102 44 L91 48 L74 10 Z" fill="url(#ca-tantrum-trail)"/>
     <path d="M32 38 L46 34 L50 45 L38 51 L30 46 Z" fill="url(#ca-tantrum-fist)" stroke="hsl(48, 100%, 86%)" stroke-width="1.3"/>
     <path d="M58 43 L74 39 L78 51 L65 57 L55 51 Z" fill="url(#ca-tantrum-fist)" stroke="hsl(48, 100%, 90%)" stroke-width="1.5"/>
     <path d="M86 38 L100 34 L104 45 L92 50 L84 45 Z" fill="url(#ca-tantrum-fist)" stroke="hsl(48, 100%, 86%)" stroke-width="1.3"/>
     <ellipse cx="66" cy="59" rx="38" ry="6" fill="none" stroke="hsl(342, 100%, 66%)" stroke-width="1.8"/>
     <ellipse cx="66" cy="59" rx="22" ry="3.4" fill="hsla(48, 100%, 78%, 0.45)"/>
     <polygon points="22,52 28,44 31,53" fill="hsl(288, 44%, 26%)" stroke="hsl(344, 90%, 64%)" stroke-width="1"/>
     <polygon points="104,50 112,42 114,52" fill="hsl(288, 44%, 26%)" stroke="hsl(344, 90%, 64%)" stroke-width="1"/>
     <polygon points="48,62 54,55 57,64" fill="hsl(292, 46%, 24%)" stroke="hsl(46, 98%, 74%)" stroke-width="0.9"/>
     <path d="M18 38 L10 30 M112 34 L120 26 M64 14 L64 26" stroke="hsl(48, 100%, 82%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="24" cy="24" r="2" fill="hsl(48, 100%, 86%)"/>
     <circle cx="106" cy="22" r="2" fill="hsl(344, 100%, 72%)"/>
     <circle cx="80" cy="62" r="1.8" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(344, 98%, 58%, 0.34)',
    `<linearGradient id="ca-tantrum-trail" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(328, 100%, 62%, 0.1)"/><stop offset="65%" stop-color="hsl(344, 100%, 58%)"/><stop offset="100%" stop-color="hsl(48, 100%, 86%)"/></linearGradient><radialGradient id="ca-tantrum-fist" cx="45%" cy="45%" r="55%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="50%" stop-color="hsl(342, 100%, 60%)"/><stop offset="100%" stop-color="hsl(296, 84%, 34%)"/></radialGradient>`
  ),
  wallop: wrapArtSvg(
    'wallop',
    'hsl(270, 56%, 20%)',
    'hsl(206, 58%, 11%)',
    `<path d="M0 57 H128 V72 H0 Z" fill="hsla(244, 52%, 11%, 0.8)"/>
     <circle cx="68" cy="56" r="32" fill="url(#ca-wallop-impact)"/>
     <path d="M22 57 A46 36 0 0 1 114 57" fill="none" stroke="hsl(190, 100%, 76%)" stroke-width="2" stroke-dasharray="10 4"/>
     <path d="M36 57 A32 25 0 0 1 100 57" fill="hsla(192, 98%, 62%, 0.18)" stroke="hsl(190, 100%, 84%)" stroke-width="1.8"/>
     <ellipse cx="68" cy="58" rx="34" ry="5.5" fill="none" stroke="hsl(48, 100%, 80%)" stroke-width="1.5"/>
     <path d="M18 10 Q42 20 62 46" fill="none" stroke="hsla(48, 100%, 80%, 0.48)" stroke-width="4" stroke-linecap="round"/>
     <path d="M38 6 L72 52 L65 57 L31 11 Z" fill="url(#ca-wallop-staff)" stroke="hsl(28, 72%, 24%)" stroke-width="1.2"/>
     <line x1="36" y1="10" x2="67" y2="52" stroke="hsl(52, 100%, 94%)" stroke-width="1.3" stroke-linecap="round" opacity="0.88"/>
     <circle cx="42" cy="18" r="5" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.6"/>
     <circle cx="34" cy="23" r="3.2" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.4"/>
     <path d="M68 42 L72 53 L83 56 L72 59 L68 68 L64 59 L53 56 L64 53 Z" fill="hsl(52, 100%, 92%)"/>
     <path d="M78 44 L98 28 M84 50 L108 42 M54 46 L34 36" stroke="hsl(48, 100%, 84%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="98" cy="24" r="2" fill="hsl(190, 100%, 86%)"/>
     <circle cx="28" cy="34" r="1.8" fill="hsl(190, 100%, 84%)"/>
     <circle cx="106" cy="48" r="1.6" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(44, 98%, 64%, 0.32)',
    `<linearGradient id="ca-wallop-staff" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 86%)"/><stop offset="48%" stop-color="hsl(38, 90%, 54%)"/><stop offset="100%" stop-color="hsl(278, 62%, 34%)"/></linearGradient><radialGradient id="ca-wallop-impact" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(0, 0%, 100%)"/><stop offset="38%" stop-color="hsl(46, 100%, 70%)"/><stop offset="76%" stop-color="hsla(192, 100%, 62%, 0.45)"/><stop offset="100%" stop-color="hsla(206, 92%, 44%, 0)"/></radialGradient>`
  ),
  weave: wrapArtSvg(
    'weave',
    'hsl(278, 56%, 20%)',
    'hsl(214, 56%, 11%)',
    `<path d="M6 36 C24 6 50 6 64 36 C78 66 104 66 122 36" fill="none" stroke="hsla(292, 92%, 68%, 0.26)" stroke-width="10" stroke-linecap="round"/>
     <path d="M6 36 C24 66 50 66 64 36 C78 6 104 6 122 36" fill="none" stroke="hsla(192, 98%, 64%, 0.26)" stroke-width="10" stroke-linecap="round"/>
     <path d="M10 36 C26 10 50 10 64 36 C78 62 102 62 118 36" fill="none" stroke="url(#ca-weave-violet)" stroke-width="4.4" stroke-linecap="round"/>
     <path d="M10 36 C26 62 50 62 64 36 C78 10 102 10 118 36" fill="none" stroke="url(#ca-weave-cyan)" stroke-width="4.4" stroke-linecap="round"/>
     <path d="M10 36 C26 10 50 10 64 36 C78 62 102 62 118 36" fill="none" stroke="hsl(48, 100%, 86%)" stroke-width="1.1" stroke-dasharray="10 6"/>
     <path d="M36 22 L52 14 L44 28 Z" fill="url(#ca-weave-blade)" stroke="hsl(276, 62%, 28%)" stroke-width="1"/>
     <path d="M92 50 L76 58 L84 44 Z" fill="url(#ca-weave-blade)" stroke="hsl(276, 62%, 28%)" stroke-width="1"/>
     <path d="M54 36 Q64 26 74 36 Q64 46 54 36 Z" fill="hsl(264, 62%, 18%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.4"/>
     <circle cx="64" cy="36" r="4.2" fill="hsl(190, 100%, 74%)"/>
     <circle cx="64" cy="36" r="1.6" fill="hsl(0, 0%, 100%)"/>
     <circle cx="34" cy="52" r="2.2" fill="hsl(190, 100%, 84%)"/>
     <circle cx="94" cy="20" r="2.2" fill="hsl(48, 100%, 86%)"/>
     <circle cx="16" cy="20" r="1.4" fill="hsl(304, 100%, 82%)"/>
     <circle cx="112" cy="54" r="1.4" fill="hsl(192, 100%, 82%)"/>`,
    'hsla(292, 92%, 64%, 0.28)',
    `<linearGradient id="ca-weave-violet" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(304, 96%, 76%)"/><stop offset="55%" stop-color="hsl(278, 84%, 54%)"/><stop offset="100%" stop-color="hsl(252, 74%, 34%)"/></linearGradient><linearGradient id="ca-weave-cyan" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(188, 100%, 84%)"/><stop offset="55%" stop-color="hsl(198, 94%, 56%)"/><stop offset="100%" stop-color="hsl(232, 78%, 36%)"/></linearGradient><linearGradient id="ca-weave-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(0, 0%, 100%)"/><stop offset="55%" stop-color="hsl(48, 96%, 76%)"/><stop offset="100%" stop-color="hsl(288, 76%, 54%)"/></linearGradient>`
  ),
  wheel_kick: wrapArtSvg(
    'wheel_kick',
    'hsl(294, 58%, 21%)',
    'hsl(244, 58%, 10%)',
    `<ellipse cx="64" cy="64" rx="42" ry="5" fill="hsla(256, 62%, 6%, 0.62)"/>
     <circle cx="64" cy="36" r="27" fill="none" stroke="hsla(316, 94%, 64%, 0.24)" stroke-width="8"/>
     <path d="M40 50 A26 26 0 1 1 88 26" fill="none" stroke="url(#ca-wheel_kick-arc)" stroke-width="7.5" stroke-linecap="round"/>
     <path d="M44 48 A22 22 0 1 1 85 24" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M68 12 A24 24 0 0 1 88 38" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.6" stroke-linecap="round" opacity="0.88"/>
     <path d="M52 44 L62 32 L78 24 L82 29 L66 40 L58 55 L50 53 Z" fill="url(#ca-wheel_kick-monk)" stroke="hsl(48, 100%, 80%)" stroke-width="1.2"/>
     <circle cx="56" cy="30" r="4.6" fill="hsl(274, 54%, 20%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.1"/>
     <path d="M54 36 Q42 38 34 30" fill="none" stroke="hsl(322, 96%, 68%)" stroke-width="2.4" stroke-linecap="round"/>
     <polygon points="84,18 96,24 86,32" fill="hsl(50, 100%, 90%)"/>
     <rect x="96" y="34" width="11" height="15" rx="1.8" transform="rotate(18 101 41)" fill="hsla(282, 78%, 54%, 0.72)" stroke="hsl(48, 100%, 84%)" stroke-width="1.2"/>
     <rect x="104" y="44" width="10" height="14" rx="1.8" transform="rotate(32 109 51)" fill="hsla(192, 94%, 60%, 0.68)" stroke="hsl(48, 100%, 84%)" stroke-width="1.1"/>
     <circle cx="24" cy="26" r="2" fill="hsl(48, 100%, 86%)"/>
     <circle cx="96" cy="14" r="1.8" fill="hsl(322, 100%, 76%)"/>
     <circle cx="34" cy="56" r="1.5" fill="hsl(48, 100%, 82%)"/>`,
    'hsla(318, 96%, 62%, 0.32)',
    `<linearGradient id="ca-wheel_kick-arc" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 88%)"/><stop offset="48%" stop-color="hsl(322, 100%, 64%)"/><stop offset="100%" stop-color="hsla(276, 86%, 46%, 0.15)"/></linearGradient><linearGradient id="ca-wheel_kick-monk" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(280, 62%, 34%)"/><stop offset="100%" stop-color="hsl(252, 62%, 12%)"/></linearGradient>`
  ),
  deceive_reality: wrapArtSvg(
    'deceive_reality',
    'hsl(262, 58%, 20%)',
    'hsl(204, 56%, 11%)',
    `<path d="M14 6 L54 66 M74 6 L114 66" stroke="hsla(192, 100%, 78%, 0.16)" stroke-width="6"/>
     <polygon points="18,16 46,10 50,58 22,64" fill="hsla(276, 68%, 36%, 0.42)" stroke="hsla(292, 92%, 74%, 0.72)" stroke-width="1.2"/>
     <polygon points="78,10 106,16 102,64 74,58" fill="hsla(204, 72%, 34%, 0.42)" stroke="hsla(190, 96%, 76%, 0.72)" stroke-width="1.2"/>
     <path d="M30 56 Q34 32 39 30 Q43 32 45 56 Z" fill="hsla(296, 88%, 70%, 0.35)"/>
     <path d="M84 56 Q88 32 92 30 Q97 32 99 56 Z" fill="hsla(190, 96%, 72%, 0.35)"/>
     <polygon points="44,8 84,8 88,64 40,64" fill="url(#ca-deceive_reality-glass)" stroke="hsl(48, 100%, 84%)" stroke-width="1.6"/>
     <line x1="48" y1="14" x2="64" y2="58" stroke="hsla(0, 0%, 100%, 0.38)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="64,19 77,27 77,44 64,53 51,44 51,27" fill="url(#ca-deceive_reality-ward)" stroke="hsl(50, 100%, 92%)" stroke-width="1.4"/>
     <polygon points="64,26 71,36 64,46 57,36" fill="hsl(258, 62%, 18%)" stroke="hsl(48, 100%, 86%)" stroke-width="1"/>
     <circle cx="64" cy="36" r="2.6" fill="hsl(0, 0%, 100%)"/>
     <polygon points="14,34 19,30 22,38" fill="hsl(190, 100%, 80%)" opacity="0.8"/>
     <polygon points="114,36 108,32 106,40" fill="hsl(296, 94%, 78%)" opacity="0.8"/>
     <circle cx="34" cy="22" r="1.6" fill="hsl(48, 100%, 86%)"/>
     <circle cx="94" cy="24" r="1.6" fill="hsl(190, 100%, 86%)"/>`,
    'hsla(278, 94%, 66%, 0.28)',
    `<linearGradient id="ca-deceive_reality-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(192, 100%, 84%, 0.56)"/><stop offset="50%" stop-color="hsla(284, 86%, 58%, 0.34)"/><stop offset="100%" stop-color="hsla(238, 72%, 24%, 0.65)"/></linearGradient><linearGradient id="ca-deceive_reality-ward" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 86%)"/><stop offset="55%" stop-color="hsl(190, 100%, 66%)"/><stop offset="100%" stop-color="hsl(274, 82%, 48%)"/></linearGradient>`
  ),
  empty_mind: wrapArtSvg(
    'empty_mind',
    'hsl(248, 44%, 20%)',
    'hsl(224, 50%, 10%)',
    `<path d="M0 16 Q24 36 18 64 L0 72 Z" fill="hsla(344, 84%, 52%, 0.18)"/>
     <path d="M128 16 Q104 36 110 64 L128 72 Z" fill="hsla(192, 92%, 58%, 0.18)"/>
     <circle cx="64" cy="36" r="28" fill="url(#ca-empty_mind-void)"/>
     <path d="M78 15 A23 23 0 1 0 85 45" fill="none" stroke="url(#ca-empty_mind-enso)" stroke-width="5.2" stroke-linecap="round"/>
     <path d="M76 16 A21 21 0 1 0 83 44" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.3" stroke-linecap="round" opacity="0.82"/>
     <path d="M84 44 Q88 37 86 30" fill="none" stroke="hsla(48, 92%, 82%, 0.55)" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="3 2"/>
     <circle cx="64" cy="36" r="10" fill="hsla(0, 0%, 100%, 0.14)" stroke="hsla(50, 100%, 92%, 0.45)" stroke-width="1"/>
     <rect x="18" y="38" width="12" height="17" rx="2" transform="rotate(-14 24 46)" fill="hsla(246, 44%, 28%, 0.72)" stroke="hsl(50, 100%, 88%)" stroke-width="1.2"/>
     <rect x="98" y="38" width="12" height="17" rx="2" transform="rotate(14 104 46)" fill="hsla(216, 48%, 28%, 0.72)" stroke="hsl(196, 94%, 84%)" stroke-width="1.2"/>
     <path d="M26 62 Q64 56 102 62" fill="none" stroke="hsla(210, 82%, 86%, 0.32)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="34" cy="20" r="1.6" fill="hsl(344, 92%, 74%)" opacity="0.65"/>
     <circle cx="96" cy="20" r="1.6" fill="hsl(192, 100%, 82%)" opacity="0.65"/>
     <circle cx="64" cy="36" r="2.2" fill="hsl(0, 0%, 100%)"/>
     <circle cx="48" cy="14" r="1.3" fill="hsl(50, 100%, 92%)"/>`,
    'hsla(206, 84%, 82%, 0.28)',
    `<radialGradient id="ca-empty_mind-void" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(50, 100%, 96%, 0.45)"/><stop offset="62%" stop-color="hsla(214, 72%, 74%, 0.16)"/><stop offset="100%" stop-color="hsla(236, 54%, 14%, 0)"/></radialGradient><linearGradient id="ca-empty_mind-enso" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 92%)"/><stop offset="55%" stop-color="hsl(210, 62%, 82%)"/><stop offset="100%" stop-color="hsla(44, 88%, 68%, 0.35)"/></linearGradient>`
  ),
  inner_peace: wrapArtSvg(
    'inner_peace',
    'hsl(206, 64%, 20%)',
    'hsl(244, 56%, 10%)',
    `<rect x="0" y="38" width="128" height="34" fill="url(#ca-inner_peace-water)"/>
     <circle cx="64" cy="34" r="26" fill="url(#ca-inner_peace-core)" opacity="0.58"/>
     <path d="M0 39 Q24 27 48 36 Q78 24 108 35 Q118 32 128 36 V40 H0 Z" fill="hsla(238, 52%, 14%, 0.72)"/>
     <ellipse cx="64" cy="54" rx="48" ry="11" fill="none" stroke="hsla(190, 100%, 78%, 0.35)" stroke-width="1.3"/>
     <ellipse cx="64" cy="52" rx="34" ry="8" fill="none" stroke="hsla(190, 100%, 82%, 0.62)" stroke-width="1.5"/>
     <ellipse cx="64" cy="50" rx="20" ry="4.8" fill="hsla(190, 100%, 80%, 0.24)" stroke="hsl(188, 100%, 88%)" stroke-width="1.3"/>
     <path d="M46 58 Q64 66 82 58 Q64 62 46 58 Z" fill="hsla(292, 82%, 72%, 0.28)"/>
     <path d="M64 46 Q42 46 34 36 Q48 34 64 44 Z" fill="url(#ca-inner_peace-petal)" stroke="hsl(190, 100%, 86%)" stroke-width="1"/>
     <path d="M64 46 Q86 46 94 36 Q80 34 64 44 Z" fill="url(#ca-inner_peace-petal)" stroke="hsl(190, 100%, 86%)" stroke-width="1"/>
     <path d="M64 46 Q48 34 46 21 Q58 26 64 42 Z" fill="url(#ca-inner_peace-petal)" stroke="hsl(50, 100%, 90%)" stroke-width="1"/>
     <path d="M64 46 Q80 34 82 21 Q70 26 64 42 Z" fill="url(#ca-inner_peace-petal)" stroke="hsl(50, 100%, 90%)" stroke-width="1"/>
     <path d="M64 14 Q74 28 64 46 Q54 28 64 14 Z" fill="hsl(52, 100%, 92%)" stroke="hsl(46, 94%, 64%)" stroke-width="1.2"/>
     <circle cx="64" cy="34" r="3.4" fill="hsl(48, 100%, 74%)"/>
     <circle cx="32" cy="18" r="1.6" fill="hsl(190, 100%, 88%)"/>
     <circle cx="96" cy="16" r="1.8" fill="hsl(50, 100%, 90%)"/>
     <circle cx="22" cy="48" r="1.4" fill="hsl(190, 100%, 84%)"/>
     <circle cx="106" cy="48" r="1.4" fill="hsl(190, 100%, 84%)"/>`,
    'hsla(190, 98%, 64%, 0.32)',
    `<linearGradient id="ca-inner_peace-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(202, 76%, 28%)"/><stop offset="100%" stop-color="hsl(242, 62%, 10%)"/></linearGradient><linearGradient id="ca-inner_peace-petal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 96%)"/><stop offset="55%" stop-color="hsl(296, 84%, 78%)"/><stop offset="100%" stop-color="hsl(194, 92%, 58%)"/></linearGradient><radialGradient id="ca-inner_peace-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(50, 100%, 92%)"/><stop offset="100%" stop-color="hsla(190, 100%, 66%, 0)"/></radialGradient>`
  ),
  pray: wrapArtSvg(
    'pray',
    'hsl(268, 56%, 20%)',
    'hsl(40, 54%, 11%)',
    `<polygon points="44,0 84,0 104,72 24,72" fill="url(#ca-pray-beam)"/>
     <circle cx="64" cy="20" r="14" fill="hsla(48, 100%, 82%, 0.28)" stroke="hsla(50, 100%, 88%, 0.62)" stroke-width="1.2"/>
     <path d="M64 8 L67 17 L76 20 L67 23 L64 32 L61 23 L52 20 L61 17 Z" fill="hsl(52, 100%, 94%)"/>
     <path d="M44 68 L52 44 Q55 30 63 24 L64 56 L50 68 Z" fill="url(#ca-pray-hand)" stroke="hsl(32, 68%, 24%)" stroke-width="1.2"/>
     <path d="M84 68 L76 44 Q73 30 65 24 L64 56 L78 68 Z" fill="url(#ca-pray-hand)" stroke="hsl(32, 68%, 24%)" stroke-width="1.2"/>
     <line x1="64" y1="25" x2="64" y2="56" stroke="hsl(52, 100%, 96%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M51 54 Q64 68 77 54" fill="none" stroke="hsl(44, 96%, 64%)" stroke-width="1.8" stroke-dasharray="1 4.2" stroke-linecap="round"/>
     <circle cx="53" cy="56" r="2.2" fill="hsl(46, 98%, 74%)" stroke="hsl(28, 70%, 26%)" stroke-width="0.8"/>
     <circle cx="64" cy="61" r="2.5" fill="hsl(48, 100%, 82%)" stroke="hsl(28, 70%, 26%)" stroke-width="0.8"/>
     <circle cx="75" cy="56" r="2.2" fill="hsl(46, 98%, 74%)" stroke="hsl(28, 70%, 26%)" stroke-width="0.8"/>
     <path d="M22 60 Q28 44 20 30 Q14 20 24 10" fill="none" stroke="hsla(292, 80%, 80%, 0.42)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M106 60 Q100 44 108 30 Q114 20 104 10" fill="none" stroke="hsla(292, 80%, 80%, 0.42)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="38" cy="28" r="1.7" fill="hsl(48, 100%, 86%)"/>
     <circle cx="90" cy="28" r="1.7" fill="hsl(48, 100%, 86%)"/>
     <circle cx="44" cy="46" r="1.3" fill="hsl(50, 100%, 90%)"/>
     <circle cx="84" cy="46" r="1.3" fill="hsl(50, 100%, 90%)"/>`,
    'hsla(46, 98%, 66%, 0.32)',
    `<linearGradient id="ca-pray-beam" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="hsla(50, 100%, 88%, 0.65)"/><stop offset="65%" stop-color="hsla(44, 98%, 62%, 0.24)"/><stop offset="100%" stop-color="hsla(276, 62%, 22%, 0)"/></linearGradient><linearGradient id="ca-pray-hand" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 90%)"/><stop offset="55%" stop-color="hsl(42, 86%, 64%)"/><stop offset="100%" stop-color="hsl(276, 56%, 32%)"/></linearGradient>`
  ),
  simmering_fury: wrapArtSvg(
    'simmering_fury',
    'hsl(330, 62%, 19%)',
    'hsl(14, 62%, 10%)',
    `<circle cx="64" cy="44" r="34" fill="url(#ca-simmering_fury-magma)"/>
     <path d="M0 60 H128 V72 H0 Z" fill="hsla(292, 46%, 9%, 0.85)"/>
     <path d="M40 42 Q34 22 48 12 Q46 24 54 32 Q60 12 68 8 Q68 24 76 32 Q84 18 90 14 Q92 28 84 42 Z" fill="url(#ca-simmering_fury-flame)" opacity="0.88"/>
     <path d="M52 40 Q56 26 64 16 Q72 26 74 40 Z" fill="hsl(48, 100%, 84%)" opacity="0.82"/>
     <path d="M36 40 H92 L84 62 Q64 68 44 62 Z" fill="url(#ca-simmering_fury-vessel)" stroke="hsl(22, 86%, 54%)" stroke-width="1.5"/>
     <ellipse cx="64" cy="40" rx="28" ry="5" fill="hsl(18, 100%, 58%)" stroke="hsl(46, 100%, 80%)" stroke-width="1.2"/>
     <path d="M48 45 L56 54 L52 62 M78 44 L71 53 L75 61 M63 45 L65 56" fill="none" stroke="hsl(46, 100%, 78%)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M24 38 Q30 26 24 14 M104 38 Q98 26 104 14" fill="none" stroke="hsla(344, 96%, 62%, 0.62)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="34" cy="22" r="2.1" fill="hsl(44, 100%, 76%)"/>
     <circle cx="94" cy="20" r="2.2" fill="hsl(16, 100%, 66%)"/>
     <circle cx="64" cy="28" r="2.4" fill="hsl(52, 100%, 92%)"/>
     <circle cx="42" cy="12" r="1.4" fill="hsl(344, 100%, 70%)"/>
     <circle cx="84" cy="10" r="1.5" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(12, 98%, 56%, 0.34)',
    `<radialGradient id="ca-simmering_fury-magma" cx="50%" cy="62%" r="52%"><stop offset="0%" stop-color="hsl(48, 100%, 84%)"/><stop offset="45%" stop-color="hsl(14, 100%, 56%)"/><stop offset="80%" stop-color="hsla(342, 96%, 44%, 0.42)"/><stop offset="100%" stop-color="hsla(292, 60%, 14%, 0)"/></radialGradient><linearGradient id="ca-simmering_fury-vessel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(288, 34%, 26%)"/><stop offset="100%" stop-color="hsl(276, 42%, 11%)"/></linearGradient><linearGradient id="ca-simmering_fury-flame" x1="0.5" y1="1" x2="0.5" y2="0"><stop offset="0%" stop-color="hsl(48, 100%, 82%)"/><stop offset="45%" stop-color="hsl(14, 100%, 56%)"/><stop offset="100%" stop-color="hsl(336, 98%, 54%)"/></linearGradient>`
  ),
  worship: wrapArtSvg(
    'worship',
    'hsl(276, 56%, 21%)',
    'hsl(42, 60%, 12%)',
    `<circle cx="64" cy="29" r="33" fill="url(#ca-worship-halo)"/>
     <path d="M64 29 L14 6 M64 29 L114 6 M64 29 L6 32 M64 29 L122 32" stroke="hsla(48, 100%, 82%, 0.28)" stroke-width="2.4"/>
     <rect x="14" y="10" width="9" height="58" fill="hsla(272, 48%, 14%, 0.72)" stroke="hsla(44, 78%, 60%, 0.35)" stroke-width="1"/>
     <rect x="105" y="10" width="9" height="58" fill="hsla(272, 48%, 14%, 0.72)" stroke="hsla(44, 78%, 60%, 0.35)" stroke-width="1"/>
     <circle cx="64" cy="28" r="16" fill="none" stroke="url(#ca-worship-gold)" stroke-width="2.2"/>
     <polygon points="64,7 68,22 83,28 68,34 64,49 60,34 45,28 60,22" fill="url(#ca-worship-gold)" stroke="hsl(52, 100%, 92%)" stroke-width="1"/>
     <circle cx="64" cy="28" r="6" fill="hsl(52, 100%, 94%)" stroke="hsl(286, 78%, 54%)" stroke-width="1.3"/>
     <path d="M32 66 L38 56 H90 L96 66 Z" fill="hsl(274, 48%, 22%)" stroke="url(#ca-worship-gold)" stroke-width="1.4"/>
     <rect x="44" y="49" width="40" height="7" rx="1.5" fill="url(#ca-worship-gold)" stroke="hsl(28, 70%, 26%)" stroke-width="1"/>
     <path d="M35 55 Q31 46 37 40 Q42 47 38 55 Z" fill="hsl(42, 100%, 72%)"/>
     <path d="M93 55 Q89 46 95 40 Q100 47 96 55 Z" fill="hsl(42, 100%, 72%)"/>
     <circle cx="44" cy="18" r="1.8" fill="hsl(52, 100%, 92%)"/>
     <circle cx="84" cy="18" r="1.8" fill="hsl(52, 100%, 92%)"/>
     <circle cx="34" cy="34" r="1.5" fill="hsl(48, 100%, 86%)"/>
     <circle cx="94" cy="34" r="1.5" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(46, 100%, 66%, 0.34)',
    `<radialGradient id="ca-worship-halo" cx="50%" cy="38%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="45%" stop-color="hsla(44, 100%, 62%, 0.52)"/><stop offset="100%" stop-color="hsla(276, 68%, 24%, 0)"/></radialGradient><linearGradient id="ca-worship-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 88%)"/><stop offset="50%" stop-color="hsl(42, 94%, 56%)"/><stop offset="100%" stop-color="hsl(28, 76%, 30%)"/></linearGradient>`
  ),
  fasting: wrapArtSvg(
    'fasting',
    'hsl(264, 48%, 18%)',
    'hsl(28, 52%, 10%)',
    `<polygon points="40,0 88,0 100,66 28,66" fill="hsla(44, 92%, 68%, 0.14)"/>
     <path d="M10 56 H118 L128 72 H0 Z" fill="hsla(258, 42%, 13%, 0.82)"/>
     <ellipse cx="64" cy="60" rx="28" ry="4.5" fill="hsla(260, 62%, 5%, 0.65)"/>
     <path d="M58 42 C46 28 52 16 64 8 C60 18 68 26 62 42 Z" fill="url(#ca-fasting-str)" opacity="0.9"/>
     <path d="M70 42 C82 28 76 16 64 8 C68 18 60 26 66 42 Z" fill="url(#ca-fasting-dex)" opacity="0.88"/>
     <path d="M36 40 H92 C92 54 79 61 64 61 C49 61 36 54 36 40 Z" fill="url(#ca-fasting-bowl)" stroke="hsl(44, 92%, 68%)" stroke-width="1.6"/>
     <ellipse cx="64" cy="40" rx="28" ry="5.2" fill="hsl(268, 46%, 14%)" stroke="hsl(48, 98%, 78%)" stroke-width="1.4"/>
     <path d="M42 46 Q52 55 68 56" fill="none" stroke="hsla(48, 100%, 84%, 0.55)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="104" cy="24" r="8" fill="hsla(266, 38%, 22%, 0.55)" stroke="hsla(44, 62%, 58%, 0.45)" stroke-width="1.2" stroke-dasharray="3 2"/>
     <path d="M100 20 L108 28 M108 20 L100 28" stroke="hsla(348, 84%, 64%, 0.65)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="46" cy="22" r="1.8" fill="hsl(22, 100%, 68%)"/>
     <circle cx="82" cy="22" r="1.8" fill="hsl(188, 100%, 78%)"/>
     <circle cx="64" cy="14" r="2.2" fill="hsl(52, 100%, 92%)"/>
     <circle cx="24" cy="34" r="1.4" fill="hsl(46, 98%, 78%)"/>`,
    'hsla(40, 96%, 60%, 0.28)',
    `<linearGradient id="ca-fasting-bowl" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(36, 56%, 44%)"/><stop offset="50%" stop-color="hsl(24, 52%, 22%)"/><stop offset="100%" stop-color="hsl(262, 48%, 12%)"/></linearGradient><linearGradient id="ca-fasting-str" x1="0.5" y1="1" x2="0.5" y2="0"><stop offset="0%" stop-color="hsl(48, 100%, 84%)"/><stop offset="55%" stop-color="hsl(18, 98%, 58%)"/><stop offset="100%" stop-color="hsl(344, 96%, 56%)"/></linearGradient><linearGradient id="ca-fasting-dex" x1="0.5" y1="1" x2="0.5" y2="0"><stop offset="0%" stop-color="hsl(50, 100%, 90%)"/><stop offset="55%" stop-color="hsl(188, 100%, 66%)"/><stop offset="100%" stop-color="hsl(276, 86%, 64%)"/></linearGradient>`
  ),
  foresight: wrapArtSvg(
    'foresight',
    'hsl(246, 58%, 20%)',
    'hsl(202, 58%, 10%)',
    `<path d="M0 64 Q24 52 46 58 Q74 48 98 58 Q114 52 128 60 V72 H0 Z" fill="hsla(246, 56%, 14%, 0.78)"/>
     <path d="M64 34 L16 14 M64 34 L112 14 M64 34 L118 44" stroke="hsla(190, 100%, 78%, 0.5)" stroke-width="1.6" stroke-dasharray="4 3"/>
     <circle cx="64" cy="34" r="24" fill="none" stroke="url(#ca-foresight-brass)" stroke-width="2"/>
     <ellipse cx="64" cy="34" rx="34" ry="12" transform="rotate(-18 64 34)" fill="none" stroke="url(#ca-foresight-brass)" stroke-width="1.6"/>
     <ellipse cx="64" cy="34" rx="34" ry="12" transform="rotate(18 64 34)" fill="none" stroke="hsla(192, 100%, 76%, 0.65)" stroke-width="1.3"/>
     <circle cx="64" cy="34" r="14" fill="url(#ca-foresight-lens)" stroke="hsl(48, 100%, 84%)" stroke-width="1.5"/>
     <path d="M53 34 Q64 25 75 34 Q64 43 53 34 Z" fill="hsl(258, 62%, 16%)" stroke="hsl(50, 100%, 88%)" stroke-width="1.1"/>
     <circle cx="64" cy="34" r="3.6" fill="hsl(190, 100%, 78%)"/>
     <circle cx="62" cy="32" r="1.4" fill="hsl(0, 0%, 100%)"/>
     <polygon points="18,14 22,10 26,14 22,18" fill="hsl(50, 100%, 88%)"/>
     <polygon points="106,14 110,10 114,14 110,18" fill="hsl(190, 100%, 86%)"/>
     <polygon points="112,44 116,40 120,44 116,48" fill="hsl(48, 100%, 86%)"/>
     <circle cx="24" cy="48" r="1.6" fill="hsl(48, 100%, 84%)"/>
     <circle cx="88" cy="14" r="1.4" fill="hsl(190, 100%, 86%)"/>`,
    'hsla(196, 98%, 64%, 0.30)',
    `<linearGradient id="ca-foresight-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 86%)"/><stop offset="55%" stop-color="hsl(42, 90%, 56%)"/><stop offset="100%" stop-color="hsl(28, 70%, 34%)"/></linearGradient><radialGradient id="ca-foresight-lens" cx="44%" cy="40%" r="58%"><stop offset="0%" stop-color="hsl(188, 100%, 94%)"/><stop offset="48%" stop-color="hsl(196, 98%, 62%)"/><stop offset="100%" stop-color="hsl(268, 82%, 36%)"/></radialGradient>`
  ),
  like_water: wrapArtSvg(
    'like_water',
    'hsl(198, 66%, 20%)',
    'hsl(228, 56%, 10%)',
    `<path d="M0 54 Q64 46 128 54 V72 H0 Z" fill="hsla(216, 64%, 14%, 0.85)"/>
     <path d="M6 12 C28 14 34 38 62 34 C90 30 96 52 124 48" fill="none" stroke="hsla(190, 100%, 72%, 0.28)" stroke-width="14" stroke-linecap="round"/>
     <ellipse cx="44" cy="54" rx="22" ry="11" fill="url(#ca-like_water-stone)" stroke="hsl(192, 92%, 68%)" stroke-width="1.2"/>
     <ellipse cx="86" cy="57" rx="18" ry="9" fill="url(#ca-like_water-stone)" stroke="hsl(192, 92%, 68%)" stroke-width="1.1"/>
     <ellipse cx="64" cy="48" rx="13" ry="7" fill="url(#ca-like_water-stone)" stroke="hsl(188, 100%, 76%)" stroke-width="1.1"/>
     <path d="M4 14 C28 14 34 40 62 34 C92 28 96 54 124 46" fill="none" stroke="url(#ca-like_water-stream)" stroke-width="6.5" stroke-linecap="round"/>
     <path d="M4 26 C26 24 38 52 68 44 C94 37 102 62 124 58" fill="none" stroke="url(#ca-like_water-stream)" stroke-width="4.2" stroke-linecap="round" opacity="0.86"/>
     <path d="M12 13 C30 14 36 37 62 32 C88 27 96 50 118 45" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.5" stroke-linecap="round" opacity="0.85"/>
     <path d="M32 48 Q42 44 54 47" fill="none" stroke="hsla(188, 100%, 88%, 0.65)" stroke-width="1.4" stroke-linecap="round"/>
     <ellipse cx="64" cy="64" rx="34" ry="4" fill="none" stroke="hsla(188, 100%, 82%, 0.55)" stroke-width="1.2"/>
     <path d="M52 22 Q54 16 56 22 A2 2 0 1 1 52 22 Z" fill="hsl(188, 100%, 88%)"/>
     <path d="M98 28 Q100 22 102 28 A2 2 0 1 1 98 28 Z" fill="hsl(188, 100%, 88%)"/>
     <circle cx="24" cy="36" r="2" fill="hsl(0, 0%, 100%)" opacity="0.85"/>
     <circle cx="80" cy="24" r="1.6" fill="hsl(188, 100%, 86%)"/>
     <circle cx="110" cy="34" r="1.4" fill="hsl(48, 100%, 88%)"/>`,
    'hsla(188, 100%, 64%, 0.32)',
    `<linearGradient id="ca-like_water-stream" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(184, 100%, 88%)"/><stop offset="50%" stop-color="hsl(196, 98%, 58%)"/><stop offset="100%" stop-color="hsl(216, 88%, 40%)"/></linearGradient><radialGradient id="ca-like_water-stone" cx="38%" cy="32%" r="65%"><stop offset="0%" stop-color="hsl(220, 32%, 44%)"/><stop offset="60%" stop-color="hsl(232, 34%, 22%)"/><stop offset="100%" stop-color="hsl(240, 40%, 11%)"/></radialGradient>`
  ),
  nirvana: wrapArtSvg(
    'nirvana',
    'hsl(274, 58%, 22%)',
    'hsl(208, 56%, 11%)',
    `<circle cx="64" cy="32" r="34" fill="url(#ca-nirvana-aura)"/>
     <circle cx="64" cy="31" r="25" fill="none" stroke="hsla(48, 100%, 84%, 0.52)" stroke-width="1.4"/>
     <circle cx="64" cy="31" r="31" fill="none" stroke="hsla(192, 100%, 78%, 0.34)" stroke-width="1.2" stroke-dasharray="4 3"/>
     <path d="M0 64 Q18 48 38 56 Q56 46 74 56 Q96 46 116 56 Q122 52 128 58 V72 H0 Z" fill="url(#ca-nirvana-cloud)" stroke="hsla(48, 100%, 84%, 0.36)" stroke-width="1.1"/>
     <path d="M64 46 Q38 45 28 33 Q46 31 64 43 Z" fill="url(#ca-nirvana-petal)" stroke="hsl(48, 100%, 86%)" stroke-width="1.1"/>
     <path d="M64 46 Q90 45 100 33 Q82 31 64 43 Z" fill="url(#ca-nirvana-petal)" stroke="hsl(48, 100%, 86%)" stroke-width="1.1"/>
     <path d="M64 45 Q44 33 42 18 Q56 24 64 41 Z" fill="url(#ca-nirvana-petal)" stroke="hsl(52, 100%, 92%)" stroke-width="1.1"/>
     <path d="M64 45 Q84 33 86 18 Q72 24 64 41 Z" fill="url(#ca-nirvana-petal)" stroke="hsl(52, 100%, 92%)" stroke-width="1.1"/>
     <path d="M64 10 Q75 26 64 46 Q53 26 64 10 Z" fill="hsl(52, 100%, 94%)" stroke="hsl(44, 96%, 62%)" stroke-width="1.3"/>
     <polygon points="64,23 69,30 64,37 59,30" fill="hsl(48, 100%, 74%)" stroke="hsl(0, 0%, 100%)" stroke-width="0.9"/>
     <ellipse cx="26" cy="20" rx="3.4" ry="1.5" transform="rotate(-24 26 20)" fill="hsl(48, 100%, 86%)"/>
     <ellipse cx="102" cy="20" rx="3.4" ry="1.5" transform="rotate(24 102 20)" fill="hsl(48, 100%, 86%)"/>
     <circle cx="22" cy="40" r="1.8" fill="hsl(190, 100%, 84%)"/>
     <circle cx="106" cy="40" r="1.8" fill="hsl(190, 100%, 84%)"/>
     <circle cx="44" cy="12" r="1.5" fill="hsl(52, 100%, 92%)"/>
     <circle cx="84" cy="12" r="1.5" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(48, 100%, 72%, 0.34)',
    `<radialGradient id="ca-nirvana-aura" cx="50%" cy="42%" r="52%"><stop offset="0%" stop-color="hsl(52, 100%, 94%)"/><stop offset="46%" stop-color="hsla(46, 100%, 68%, 0.44)"/><stop offset="80%" stop-color="hsla(192, 98%, 62%, 0.22)"/><stop offset="100%" stop-color="hsla(272, 64%, 20%, 0)"/></radialGradient><linearGradient id="ca-nirvana-petal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 96%)"/><stop offset="55%" stop-color="hsl(304, 88%, 80%)"/><stop offset="100%" stop-color="hsl(276, 74%, 52%)"/></linearGradient><linearGradient id="ca-nirvana-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(268, 48%, 36%)"/><stop offset="100%" stop-color="hsl(238, 54%, 14%)"/></linearGradient>`
  ),
  rushdown: wrapArtSvg(
    'rushdown',
    'hsl(332, 64%, 20%)',
    'hsl(272, 56%, 10%)',
    `<circle cx="96" cy="20" r="22" fill="url(#ca-rushdown-moon)"/>
     <path d="M52 54 L88 26 L128 52 V72 H52 Z" fill="hsla(272, 48%, 16%, 0.58)"/>
     <path d="M0 16 L36 32 L68 48 L112 66 L128 72 H0 Z" fill="url(#ca-rushdown-ridge)" stroke="hsla(340, 88%, 62%, 0.45)" stroke-width="1.2"/>
     <path d="M12 8 L66 30 M24 6 L84 28 M6 22 L48 40" stroke="hsla(48, 100%, 80%, 0.52)" stroke-width="2" stroke-linecap="round"/>
     <path d="M22 22 Q44 10 68 20 Q84 26 96 36 L104 42 L94 46 L102 54 L86 48 L74 38 L52 36 L36 46 L26 42 L38 30 Q26 28 22 22 Z" fill="url(#ca-rushdown-tiger)" stroke="hsl(48, 100%, 84%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M36 18 Q54 14 78 26" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="1.4" stroke-linecap="round" opacity="0.82"/>
     <path d="M46 18 L52 26 M58 18 L62 28 M69 22 L71 31" stroke="hsl(276, 68%, 16%)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="88,34 95,36 90,39" fill="hsl(52, 100%, 92%)"/>
     <path d="M98 44 L112 52 M94 49 L106 58 M102 38 L116 44" stroke="hsl(48, 100%, 86%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M16 18 Q28 8 44 12" fill="none" stroke="hsl(344, 100%, 66%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M62 12 L78 18 L72 22 L92 28" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="108" cy="24" r="2" fill="hsl(48, 100%, 86%)"/>
     <circle cx="34" cy="54" r="1.8" fill="hsl(344, 100%, 70%)"/>
     <circle cx="114" cy="58" r="1.6" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(348, 98%, 60%, 0.34)',
    `<radialGradient id="ca-rushdown-moon" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(48, 100%, 84%, 0.55)"/><stop offset="60%" stop-color="hsla(344, 96%, 56%, 0.28)"/><stop offset="100%" stop-color="hsla(276, 60%, 16%, 0)"/></radialGradient><linearGradient id="ca-rushdown-tiger" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 82%)"/><stop offset="48%" stop-color="hsl(334, 96%, 56%)"/><stop offset="100%" stop-color="hsl(278, 72%, 28%)"/></linearGradient><linearGradient id="ca-rushdown-ridge" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(274, 52%, 24%)"/><stop offset="100%" stop-color="hsl(258, 56%, 10%)"/></linearGradient>`
  ),
  indignation: wrapArtSvg(
    'indignation',
    'hsl(344, 64%, 21%)',
    'hsl(276, 56%, 11%)',
    `<path d="M64 38 L10 8 M64 38 L118 8 M64 38 L6 42 M64 38 L122 42" stroke="hsla(44, 100%, 76%, 0.25)" stroke-width="2.6"/>
     <path d="M34 66 Q24 38 42 18 Q46 30 54 24 Q60 6 64 5 Q68 6 74 24 Q82 30 86 18 Q104 38 94 66 Z" fill="url(#ca-indignation-flame)" opacity="0.88"/>
     <path d="M44 64 Q40 42 54 28 Q60 18 64 14 Q68 18 74 28 Q88 42 84 64 Z" fill="hsl(48, 100%, 82%)" opacity="0.72"/>
     <path d="M40 68 L48 42 Q64 35 80 42 L88 68 Z" fill="url(#ca-indignation-figure)" stroke="hsl(46, 98%, 74%)" stroke-width="1.4"/>
     <circle cx="64" cy="31" r="8.5" fill="hsl(276, 56%, 18%)" stroke="hsl(48, 100%, 80%)" stroke-width="1.3"/>
     <path d="M58 29 L62 31 L59 33 Z M70 29 L66 31 L69 33 Z" fill="hsl(52, 100%, 94%)"/>
     <path d="M48 48 L64 42 L80 48" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M12 24 L28 30 L22 36 L38 42" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M116 24 L100 30 L106 36 L90 42" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="24" cy="54" r="2" fill="hsl(344, 100%, 68%)"/>
     <circle cx="104" cy="54" r="2" fill="hsl(344, 100%, 68%)"/>
     <circle cx="44" cy="14" r="1.6" fill="hsl(50, 100%, 90%)"/>
     <circle cx="84" cy="14" r="1.6" fill="hsl(50, 100%, 90%)"/>`,
    'hsla(14, 98%, 58%, 0.32)',
    `<linearGradient id="ca-indignation-flame" x1="0.5" y1="1" x2="0.5" y2="0"><stop offset="0%" stop-color="hsl(48, 100%, 86%)"/><stop offset="48%" stop-color="hsl(14, 100%, 56%)"/><stop offset="100%" stop-color="hsl(340, 96%, 50%)"/></linearGradient><linearGradient id="ca-indignation-figure" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(282, 58%, 34%)"/><stop offset="100%" stop-color="hsl(264, 58%, 13%)"/></linearGradient>`
  ),
  sanctity: wrapArtSvg(
    'sanctity',
    'hsl(212, 58%, 22%)',
    'hsl(258, 54%, 11%)',
    `<circle cx="64" cy="34" r="34" fill="url(#ca-sanctity-light)"/>
     <path d="M30 68 V34 C30 14 48 6 64 6 C80 6 98 14 98 34 V68 Z" fill="hsla(216, 62%, 18%, 0.52)" stroke="url(#ca-sanctity-arch)" stroke-width="2"/>
     <path d="M38 68 V35 C38 20 52 13 64 13 C76 13 90 20 90 35 V68" fill="none" stroke="hsla(50, 100%, 88%, 0.58)" stroke-width="1.2"/>
     <circle cx="64" cy="35" r="15" fill="none" stroke="hsl(48, 100%, 86%)" stroke-width="1.5" stroke-dasharray="5 3"/>
     <circle cx="64" cy="35" r="9.5" fill="url(#ca-sanctity-pearl)" stroke="hsl(48, 100%, 86%)" stroke-width="1.3"/>
     <path d="M64 18 L66.5 32.5 L81 35 L66.5 37.5 L64 52 L61.5 37.5 L47 35 L61.5 32.5 Z" fill="hsl(0, 0%, 100%)" opacity="0.9"/>
     <path d="M46 66 L52 57 H76 L82 66 Z" fill="hsl(236, 48%, 26%)" stroke="hsl(48, 96%, 80%)" stroke-width="1.2"/>
     <path d="M56 57 Q64 51 72 57" fill="none" stroke="hsl(190, 100%, 86%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M16 24 Q22 20 26 28 Q20 30 16 24 Z" fill="hsl(52, 100%, 92%)" opacity="0.82"/>
     <path d="M112 24 Q106 20 102 28 Q108 30 112 24 Z" fill="hsl(52, 100%, 92%)" opacity="0.82"/>
     <circle cx="20" cy="48" r="1.7" fill="hsl(190, 100%, 88%)"/>
     <circle cx="108" cy="48" r="1.7" fill="hsl(190, 100%, 88%)"/>
     <circle cx="48" cy="22" r="1.4" fill="hsl(0, 0%, 100%)"/>
     <circle cx="80" cy="22" r="1.4" fill="hsl(0, 0%, 100%)"/>`,
    'hsla(48, 100%, 78%, 0.32)',
    `<radialGradient id="ca-sanctity-light" cx="50%" cy="44%" r="52%"><stop offset="0%" stop-color="hsl(52, 100%, 96%)"/><stop offset="48%" stop-color="hsla(192, 100%, 80%, 0.42)"/><stop offset="100%" stop-color="hsla(246, 62%, 20%, 0)"/></radialGradient><linearGradient id="ca-sanctity-arch" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 88%)"/><stop offset="55%" stop-color="hsl(194, 92%, 74%)"/><stop offset="100%" stop-color="hsl(268, 56%, 36%)"/></linearGradient><radialGradient id="ca-sanctity-pearl" cx="40%" cy="34%" r="62%"><stop offset="0%" stop-color="hsl(0, 0%, 100%)"/><stop offset="55%" stop-color="hsl(48, 92%, 86%)"/><stop offset="100%" stop-color="hsl(198, 86%, 64%)"/></radialGradient>`
  ),
  windmill_strike: wrapArtSvg(
    'windmill_strike',
    'hsl(284, 58%, 21%)',
    'hsl(238, 56%, 10%)',
    `<circle cx="64" cy="36" r="30" fill="none" stroke="hsla(296, 92%, 68%, 0.25)" stroke-width="5" stroke-dasharray="12 6"/>
     <circle cx="64" cy="36" r="20" fill="none" stroke="hsla(48, 100%, 78%, 0.32)" stroke-width="2" stroke-dasharray="8 5"/>
     <path d="M64 36 Q66 12 94 10 Q80 26 64 36 Z" fill="url(#ca-windmill_strike-blade)" stroke="hsl(52, 100%, 92%)" stroke-width="1.2"/>
     <path d="M64 36 Q62 60 34 62 Q48 46 64 36 Z" fill="url(#ca-windmill_strike-blade)" stroke="hsl(52, 100%, 92%)" stroke-width="1.2"/>
     <path d="M64 36 Q38 34 36 8 Q54 20 64 36 Z" fill="url(#ca-windmill_strike-violet)" stroke="hsl(308, 100%, 84%)" stroke-width="1.1"/>
     <path d="M64 36 Q90 38 92 64 Q74 52 64 36 Z" fill="url(#ca-windmill_strike-violet)" stroke="hsl(308, 100%, 84%)" stroke-width="1.1"/>
     <line x1="22" y1="54" x2="106" y2="18" stroke="hsl(46, 96%, 72%)" stroke-width="3.2" stroke-linecap="round"/>
     <line x1="26" y1="52" x2="102" y2="20" stroke="hsl(0, 0%, 100%)" stroke-width="1.1" stroke-linecap="round" opacity="0.86"/>
     <circle cx="64" cy="36" r="6.5" fill="hsl(48, 100%, 88%)" stroke="hsl(288, 78%, 48%)" stroke-width="1.6"/>
     <circle cx="64" cy="36" r="2.5" fill="hsl(0, 0%, 100%)"/>
     <path d="M98 14 L112 10 M30 58 L16 62 M24 22 L14 14 M104 50 L114 58" stroke="hsl(48, 100%, 84%)" stroke-width="1.7" stroke-linecap="round"/>
     <circle cx="110" cy="24" r="1.9" fill="hsl(50, 100%, 90%)"/>
     <circle cx="18" cy="46" r="1.9" fill="hsl(308, 100%, 80%)"/>`,
    'hsla(46, 98%, 64%, 0.32)',
    `<linearGradient id="ca-windmill_strike-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="50%" stop-color="hsl(42, 98%, 62%)"/><stop offset="100%" stop-color="hsla(296, 92%, 58%, 0.2)"/></linearGradient><linearGradient id="ca-windmill_strike-violet" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(312, 100%, 76%)"/><stop offset="55%" stop-color="hsl(282, 86%, 54%)"/><stop offset="100%" stop-color="hsla(252, 76%, 32%, 0.18)"/></linearGradient>`
  ),
  reach_heaven: wrapArtSvg(
    'reach_heaven',
    'hsl(246, 56%, 19%)',
    'hsl(282, 54%, 11%)',
    `<polygon points="48,0 80,0 74,72 54,72" fill="hsla(46, 100%, 72%, 0.24)"/>
     <path d="M0 32 Q18 22 36 30 Q46 34 48 44 Q32 54 0 50 Z" fill="url(#ca-reach_heaven-cloud)" stroke="hsla(48, 96%, 78%, 0.45)" stroke-width="1.2"/>
     <path d="M128 32 Q110 22 92 30 Q82 34 80 44 Q96 54 128 50 Z" fill="url(#ca-reach_heaven-cloud)" stroke="hsla(48, 96%, 78%, 0.45)" stroke-width="1.2"/>
     <path d="M0 64 Q36 58 64 62 Q92 58 128 64 V72 H0 Z" fill="hsla(266, 54%, 11%, 0.85)"/>
     <polygon points="64,4 73,22 68,22 69,68 59,68 60,22 55,22" fill="url(#ca-reach_heaven-beam)" stroke="hsl(38, 92%, 44%)" stroke-width="1.1"/>
     <line x1="64" y1="8" x2="64" y2="66" stroke="hsl(0, 0%, 100%)" stroke-width="2.2" stroke-linecap="round"/>
     <ellipse cx="64" cy="40" rx="22" ry="5" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.6"/>
     <ellipse cx="64" cy="26" rx="14" ry="3.5" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="1.4"/>
     <path d="M42 28 L30 22 L34 15 M86 28 L98 22 L94 15" fill="none" stroke="hsl(304, 96%, 76%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M52 10 L56 14 M76 10 L72 14" stroke="hsl(52, 100%, 94%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="26" cy="12" r="1.8" fill="hsl(52, 100%, 92%)"/>
     <circle cx="102" cy="12" r="1.8" fill="hsl(52, 100%, 92%)"/>
     <circle cx="46" cy="54" r="1.7" fill="hsl(48, 100%, 84%)"/>
     <circle cx="82" cy="54" r="1.7" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(46, 100%, 68%, 0.34)',
    `<linearGradient id="ca-reach_heaven-beam" x1="0.5" y1="1" x2="0.5" y2="0"><stop offset="0%" stop-color="hsl(38, 100%, 58%)"/><stop offset="55%" stop-color="hsl(48, 100%, 86%)"/><stop offset="100%" stop-color="hsl(0, 0%, 100%)"/></linearGradient><linearGradient id="ca-reach_heaven-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(256, 48%, 30%)"/><stop offset="100%" stop-color="hsl(248, 56%, 12%)"/></linearGradient>`
  ),
  wave_of_the_hand: wrapArtSvg(
    'wave_of_the_hand',
    'hsl(228, 54%, 20%)',
    'hsl(270, 54%, 11%)',
    `<path d="M42 18 Q70 8 92 22 T124 20" fill="none" stroke="hsla(192, 98%, 74%, 0.26)" stroke-width="9" stroke-linecap="round"/>
     <path d="M44 40 Q74 28 96 42 T124 40" fill="none" stroke="hsla(286, 86%, 70%, 0.26)" stroke-width="9" stroke-linecap="round"/>
     <path d="M46 18 Q72 8 92 22 T122 20" fill="none" stroke="url(#ca-wave_of_the_hand-wave)" stroke-width="3.6" stroke-linecap="round"/>
     <path d="M46 36 Q74 24 94 38 T122 36" fill="none" stroke="url(#ca-wave_of_the_hand-wave)" stroke-width="4.2" stroke-linecap="round"/>
     <path d="M44 54 Q72 44 92 56 T120 54" fill="none" stroke="url(#ca-wave_of_the_hand-wave)" stroke-width="3.4" stroke-linecap="round"/>
     <path d="M48 36 Q74 25 94 38 T120 36" fill="none" stroke="hsl(50, 100%, 90%)" stroke-width="1.1" stroke-linecap="round" opacity="0.82"/>
     <path d="M6 68 L14 34 Q22 26 36 30 L42 54 Q26 62 14 70 Z" fill="url(#ca-wave_of_the_hand-sleeve)" stroke="hsl(46, 94%, 74%)" stroke-width="1.4"/>
     <path d="M32 31 Q42 20 50 22 Q48 27 42 30 Q50 27 54 31 Q48 34 41 35 Q48 35 51 39 Q42 42 32 39 Z" fill="hsl(48, 96%, 86%)" stroke="hsl(274, 54%, 26%)" stroke-width="1.1"/>
     <path d="M16 42 Q26 36 36 44" fill="none" stroke="hsl(190, 100%, 82%)" stroke-width="1.3" opacity="0.72"/>
     <circle cx="88" cy="16" r="2.2" fill="hsl(190, 100%, 86%)"/>
     <circle cx="106" cy="30" r="2" fill="hsl(48, 100%, 86%)"/>
     <circle cx="84" cy="48" r="1.9" fill="hsl(296, 94%, 80%)"/>
     <circle cx="110" cy="54" r="1.5" fill="hsl(190, 100%, 84%)"/>`,
    'hsla(198, 94%, 64%, 0.28)',
    `<linearGradient id="ca-wave_of_the_hand-wave" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsl(188, 100%, 86%)"/><stop offset="55%" stop-color="hsl(278, 86%, 68%)"/><stop offset="100%" stop-color="hsla(202, 92%, 52%, 0.14)"/></linearGradient><linearGradient id="ca-wave_of_the_hand-sleeve" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(278, 62%, 38%)"/><stop offset="100%" stop-color="hsl(246, 58%, 16%)"/></linearGradient>`
  ),
  battle_hymn: wrapArtSvg(
    'battle_hymn',
    'hsl(276, 54%, 20%)',
    'hsl(32, 56%, 11%)',
    `<circle cx="60" cy="44" r="32" fill="url(#ca-battle_hymn-ring)"/>
     <circle cx="60" cy="44" r="24" fill="none" stroke="hsla(48, 100%, 80%, 0.42)" stroke-width="1.5" stroke-dasharray="7 4"/>
     <circle cx="60" cy="44" r="34" fill="none" stroke="hsla(296, 88%, 74%, 0.28)" stroke-width="1.2" stroke-dasharray="5 5"/>
     <rect x="10" y="7" width="108" height="6" rx="2" fill="hsl(344, 46%, 22%)" stroke="hsl(44, 92%, 64%)" stroke-width="1.1"/>
     <rect x="56" y="13" width="8" height="6" rx="1.5" fill="hsl(44, 92%, 60%)"/>
     <path d="M44 28 C44 19 52 17 60 17 C68 17 76 19 76 28 L83 54 H37 Z" fill="url(#ca-battle_hymn-bell)" stroke="hsl(30, 74%, 22%)" stroke-width="1.4"/>
     <ellipse cx="60" cy="54" rx="23" ry="4.6" fill="hsl(28, 62%, 16%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.3"/>
     <circle cx="60" cy="57" r="3.8" fill="hsl(48, 100%, 82%)" stroke="hsl(28, 70%, 24%)" stroke-width="1"/>
     <path d="M43 44 H77 M46 31 H74" stroke="hsl(48, 100%, 88%)" stroke-width="1.3" opacity="0.78"/>
     <path d="M49 23 Q46 36 43 48" fill="none" stroke="hsl(52, 100%, 94%)" stroke-width="1.6" stroke-linecap="round" opacity="0.72"/>
     <path d="M22 36 V24 L31 21 V33" fill="none" stroke="hsl(48, 100%, 86%)" stroke-width="1.7" stroke-linecap="round"/>
     <circle cx="20" cy="36" r="2.4" fill="hsl(48, 100%, 86%)"/>
     <circle cx="29" cy="33" r="2.4" fill="hsl(48, 100%, 86%)"/>
     <path d="M104 20 L108 38 L104 54 L100 38 Z" fill="hsl(50, 100%, 90%)" stroke="hsl(38, 96%, 54%)" stroke-width="1.1"/>
     <rect x="98" y="48" width="12" height="2.8" rx="1" fill="hsl(44, 96%, 64%)"/>
     <circle cx="94" cy="24" r="1.7" fill="hsl(296, 94%, 82%)"/>`,
    'hsla(44, 98%, 64%, 0.32)',
    `<linearGradient id="ca-battle_hymn-bell" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 84%)"/><stop offset="46%" stop-color="hsl(40, 88%, 52%)"/><stop offset="100%" stop-color="hsl(26, 72%, 24%)"/></linearGradient><radialGradient id="ca-battle_hymn-ring" cx="50%" cy="55%" r="50%"><stop offset="0%" stop-color="hsla(48, 100%, 84%, 0.5)"/><stop offset="100%" stop-color="hsla(40, 96%, 54%, 0)"/></radialGradient>`
  ),
  meditate: wrapArtSvg(
    'meditate',
    'hsl(216, 60%, 20%)',
    'hsl(264, 56%, 10%)',
    `<circle cx="64" cy="30" r="28" fill="url(#ca-meditate-halo)"/>
     <circle cx="64" cy="26" r="17" fill="none" stroke="hsl(190, 100%, 82%)" stroke-width="1.6"/>
     <ellipse cx="64" cy="61" rx="34" ry="5.5" fill="hsla(210, 82%, 44%, 0.24)" stroke="hsla(190, 100%, 80%, 0.55)" stroke-width="1.2"/>
     <ellipse cx="64" cy="40" rx="38" ry="12" transform="rotate(-12 64 40)" fill="none" stroke="hsla(46, 94%, 70%, 0.45)" stroke-width="1.2" stroke-dasharray="3 3"/>
     <circle cx="64" cy="21" r="6.2" fill="url(#ca-meditate-monk)" stroke="hsl(190, 100%, 84%)" stroke-width="1.2"/>
     <path d="M51 44 L56 30 Q64 26 72 30 L77 44 L88 51 Q76 56 64 55 Q52 56 40 51 Z" fill="url(#ca-meditate-monk)" stroke="hsl(190, 100%, 80%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M56 38 Q64 45 72 38" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="29" cy="46" r="3" fill="hsl(44, 98%, 68%)" stroke="hsl(28, 72%, 26%)" stroke-width="0.9"/>
     <circle cx="40" cy="34" r="2.6" fill="hsl(48, 100%, 78%)" stroke="hsl(28, 72%, 26%)" stroke-width="0.8"/>
     <circle cx="88" cy="46" r="2.6" fill="hsl(48, 100%, 78%)" stroke="hsl(28, 72%, 26%)" stroke-width="0.8"/>
     <circle cx="99" cy="34" r="3" fill="hsl(44, 98%, 68%)" stroke="hsl(28, 72%, 26%)" stroke-width="0.9"/>
     <circle cx="64" cy="51" r="2.8" fill="hsl(50, 100%, 86%)" stroke="hsl(28, 72%, 26%)" stroke-width="0.8"/>
     <circle cx="22" cy="20" r="1.6" fill="hsl(190, 100%, 86%)"/>
     <circle cx="106" cy="18" r="1.6" fill="hsl(190, 100%, 86%)"/>
     <circle cx="64" cy="10" r="1.8" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(192, 98%, 64%, 0.30)',
    `<radialGradient id="ca-meditate-halo" cx="50%" cy="38%" r="50%"><stop offset="0%" stop-color="hsla(190, 100%, 84%, 0.55)"/><stop offset="60%" stop-color="hsla(214, 90%, 54%, 0.2)"/><stop offset="100%" stop-color="hsla(262, 60%, 16%, 0)"/></radialGradient><linearGradient id="ca-meditate-monk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(274, 58%, 34%)"/><stop offset="100%" stop-color="hsl(248, 60%, 14%)"/></linearGradient>`
  ),
  master_of_strategy: wrapArtSvg(
    'master_of_strategy',
    'hsl(218, 28%, 20%)',
    'hsl(226, 36%, 9%)',
    `<ellipse cx="64" cy="28" rx="46" ry="22" fill="hsla(44, 88%, 62%, 0.14)"/>
     <polygon points="24,42 104,42 118,67 10,67" fill="url(#ca-master_of_strategy-board)" stroke="hsl(42, 56%, 52%)" stroke-width="1.2"/>
     <path d="M44 42 H64 L64 53 H39 Z M84 42 H104 L110 53 H87 Z M18 53 H39 L33 67 H10 Z M64 53 H87 L92 67 H64 Z" fill="hsla(224, 34%, 11%, 0.78)"/>
     <path d="M10 67 L118 67 L118 70 L10 70 Z" fill="hsl(36, 48%, 30%)"/>
     <path d="M88 45 L91 31 L88 28 H99 L96 31 L99 45 Z" fill="hsl(226, 26%, 18%)" stroke="hsl(218, 22%, 44%)" stroke-width="1"/>
     <ellipse cx="47" cy="57" rx="13" ry="4" fill="rgba(0,0,0,0.48)"/>
     <path d="M36 57 L39 51 L41 34 L37 26 L44 27 L47 22 L50 27 L57 26 L53 34 L55 51 L58 57 Z" fill="url(#ca-master_of_strategy-king)" stroke="hsl(220, 28%, 22%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M47 11 V22 M43 15 H51" stroke="hsl(46, 92%, 78%)" stroke-width="2.1" stroke-linecap="round"/>
     <path d="M42 52 L43.5 34 L41 28" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.4" opacity="0.72" stroke-linecap="round"/>
     <path d="M39 51 H55 M40 34 H54" stroke="hsl(42, 74%, 56%)" stroke-width="1.1"/>
     <ellipse cx="95" cy="57" rx="11" ry="4.2" fill="none" stroke="hsl(46, 100%, 72%)" stroke-width="1.3" stroke-dasharray="3 2"/>
     <path d="M56 26 Q82 14 96 48" fill="none" stroke="url(#ca-master_of_strategy-arrow)" stroke-width="3" stroke-linecap="round"/>
     <polygon points="97,54 89,45 101,44" fill="hsl(50, 100%, 84%)"/>
     <path d="M90 57 H100 M95 54 V60" stroke="hsl(48, 100%, 82%)" stroke-width="1.1"/>
     <circle cx="75" cy="21" r="1.7" fill="hsl(50, 100%, 88%)"/>
     <circle cx="88" cy="28" r="1.3" fill="hsl(46, 100%, 80%)"/>`,
    'hsla(44, 86%, 64%, 0.24)',
    `<linearGradient id="ca-master_of_strategy-board" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(218, 22%, 34%)"/><stop offset="100%" stop-color="hsl(222, 26%, 16%)"/></linearGradient><linearGradient id="ca-master_of_strategy-king" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(46, 48%, 94%)"/><stop offset="56%" stop-color="hsl(212, 22%, 72%)"/><stop offset="100%" stop-color="hsl(220, 26%, 34%)"/></linearGradient><linearGradient id="ca-master_of_strategy-arrow" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(46, 100%, 76%, 0.22)"/><stop offset="65%" stop-color="hsl(44, 100%, 66%)"/><stop offset="100%" stop-color="hsl(52, 100%, 88%)"/></linearGradient>`
  ),
  sadistic_nature: wrapArtSvg(
    'sadistic_nature',
    'hsl(342, 54%, 17%)',
    'hsl(292, 46%, 7%)',
    `<circle cx="64" cy="34" r="29" fill="hsla(348, 92%, 46%, 0.20)"/>
     <path d="M4 18 Q24 28 40 24 M124 18 Q104 28 88 24 M6 58 Q26 48 44 54 M122 58 Q102 48 84 54" fill="none" stroke="hsl(326, 44%, 18%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M10 14 L118 58 M118 14 L10 58" fill="none" stroke="url(#ca-sadistic_nature-chain)" stroke-width="4" stroke-dasharray="9 4" stroke-linecap="round"/>
     <path d="M22 19 L19 12 L27 17 M106 19 L109 12 L101 17 M24 52 L18 56 L24 46 M104 52 L110 56 L104 46" fill="hsl(346, 76%, 48%)"/>
     <path d="M64 46 Q59 56 64 69" fill="none" stroke="url(#ca-sadistic_nature-stem)" stroke-width="4.2" stroke-linecap="round"/>
     <polygon points="61,52 51,49 60,57" fill="hsl(344, 78%, 42%)"/>
     <polygon points="66,57 76,54 66,62" fill="hsl(344, 78%, 42%)"/>
     <path d="M44 33 Q42 16 64 14 Q86 16 84 33 Q82 48 64 49 Q46 48 44 33 Z" fill="hsl(340, 82%, 18%)" stroke="hsl(346, 86%, 44%)" stroke-width="1.2"/>
     <path d="M48 31 Q51 17 64 19 Q77 17 80 31 Q76 44 64 45 Q52 44 48 31 Z" fill="url(#ca-sadistic_nature-rose)"/>
     <path d="M55 31 Q57 22 65 23 Q73 25 71 34 Q68 41 60 39 Q54 36 58 29 Q62 25 67 29 Q68 33 63 34" fill="none" stroke="hsl(348, 100%, 74%)" stroke-width="1.7" stroke-linecap="round"/>
     <path d="M50 25 Q56 18 64 20 M78 26 Q73 19 66 20" fill="none" stroke="hsl(352, 100%, 84%)" stroke-width="1.2" opacity="0.72"/>
     <path d="M50 56 Q48 62 51 64 Q54 62 50 56 Z" fill="hsl(352, 96%, 54%)"/>
     <path d="M77 60 Q75 65 78 67 Q81 65 77 60 Z" fill="hsl(352, 96%, 54%)"/>
     <path d="M64 48 Q62 53 64 55 Q66 53 64 48 Z" fill="hsl(352, 100%, 64%)"/>
     <path d="M36 16 L37.3 19.7 L41 21 L37.3 22.3 L36 26 L34.7 22.3 L31 21 L34.7 19.7 Z" fill="hsl(354, 100%, 82%)"/>
     <path d="M92 46 L93.2 49.2 L96.5 50.5 L93.2 51.8 L92 55 L90.8 51.8 L87.5 50.5 L90.8 49.2 Z" fill="hsl(354, 100%, 82%)"/>`,
    'hsla(348, 92%, 52%, 0.28)',
    `<radialGradient id="ca-sadistic_nature-rose" cx="42%" cy="38%" r="62%"><stop offset="0%" stop-color="hsl(348, 98%, 62%)"/><stop offset="52%" stop-color="hsl(342, 86%, 34%)"/><stop offset="100%" stop-color="hsl(336, 78%, 14%)"/></radialGradient><linearGradient id="ca-sadistic_nature-chain" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(342, 22%, 62%)"/><stop offset="50%" stop-color="hsl(334, 24%, 30%)"/><stop offset="100%" stop-color="hsl(312, 30%, 12%)"/></linearGradient><linearGradient id="ca-sadistic_nature-stem" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(338, 46%, 24%)"/><stop offset="100%" stop-color="hsl(296, 44%, 10%)"/></linearGradient>`
  ),
  panache: wrapArtSvg(
    'panache',
    'hsl(214, 46%, 19%)',
    'hsl(246, 42%, 9%)',
    `<polygon points="18,0 74,0 112,72 48,72" fill="hsla(46, 100%, 70%, 0.10)"/>
     <path d="M12 58 Q36 16 74 28 Q106 38 118 14" fill="none" stroke="hsla(46, 100%, 70%, 0.34)" stroke-width="5.5" stroke-linecap="round"/>
     <path d="M14 58 Q38 18 74 29 Q106 38 117 15" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M18 63 L106 19" stroke="hsl(210, 42%, 88%)" stroke-width="2.1" stroke-linecap="round"/>
     <path d="M16 58 Q26 51 31 61 Q23 68 16 58 Z" fill="none" stroke="url(#ca-panache-gold)" stroke-width="2"/>
     <path d="M62 34 Q76 9 102 10 Q108 18 96 26 Q82 32 66 39 Z" fill="url(#ca-panache-plume)" stroke="hsl(48, 100%, 84%)" stroke-width="1.1"/>
     <path d="M65 36 Q81 18 100 13" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="1.3" stroke-linecap="round"/>
     <ellipse cx="56" cy="54" rx="30" ry="7.5" transform="rotate(-8 56 54)" fill="rgba(0,0,0,0.44)"/>
     <path d="M24 51 Q54 41 88 47 Q76 58 55 58 Q34 58 24 51 Z" fill="url(#ca-panache-hat)" stroke="url(#ca-panache-gold)" stroke-width="1.4"/>
     <path d="M38 48 L43 27 Q56 21 69 27 L72 45 Z" fill="url(#ca-panache-hat)" stroke="hsl(224, 48%, 54%)" stroke-width="1.1"/>
     <path d="M39 44 Q55 39 71 42 L72 46 Q55 43 38 48 Z" fill="url(#ca-panache-gold)"/>
     <rect x="52" y="40.5" width="7" height="5.5" rx="1" fill="hsl(228, 48%, 20%)" stroke="hsl(52, 100%, 86%)" stroke-width="1.2"/>
     <path d="M44 30 Q54 26 64 29" fill="none" stroke="hsla(214, 70%, 82%, 0.45)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M107 12 L108.8 16.2 L113 18 L108.8 19.8 L107 24 L105.2 19.8 L101 18 L105.2 16.2 Z" fill="hsl(52, 100%, 92%)"/>
     <path d="M24 22 L25.6 25.4 L29 27 L25.6 28.6 L24 32 L22.4 28.6 L19 27 L22.4 25.4 Z" fill="hsl(168, 100%, 80%)"/>
     <path d="M96 48 L97.3 51.2 L100.5 52.5 L97.3 53.8 L96 57 L94.7 53.8 L91.5 52.5 L94.7 51.2 Z" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(46, 98%, 66%, 0.28)',
    `<linearGradient id="ca-panache-hat" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(226, 48%, 38%)"/><stop offset="100%" stop-color="hsl(240, 52%, 14%)"/></linearGradient><linearGradient id="ca-panache-plume" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(176, 84%, 44%)"/><stop offset="56%" stop-color="hsl(166, 92%, 62%)"/><stop offset="100%" stop-color="hsl(48, 100%, 82%)"/></linearGradient><linearGradient id="ca-panache-gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(38, 86%, 46%)"/><stop offset="50%" stop-color="hsl(50, 100%, 82%)"/><stop offset="100%" stop-color="hsl(34, 80%, 38%)"/></linearGradient>`
  ),
  thinking_ahead: wrapArtSvg(
    'thinking_ahead',
    'hsl(210, 44%, 19%)',
    'hsl(228, 46%, 9%)',
    `<circle cx="52" cy="36" r="28" fill="hsla(194, 94%, 60%, 0.16)"/>
     <circle cx="52" cy="36" r="23" fill="none" stroke="hsla(44, 86%, 64%, 0.36)" stroke-width="1" stroke-dasharray="3 3"/>
     <ellipse cx="52" cy="36" rx="28" ry="11" transform="rotate(-24 52 36)" fill="none" stroke="url(#ca-thinking_ahead-brass)" stroke-width="1.3" opacity="0.8"/>
     <path d="M17 16 Q7 36 17 56 Q24 48 24 36 Q24 24 17 16 Z" fill="hsla(196, 86%, 62%, 0.32)" stroke="hsl(190, 96%, 78%)" stroke-width="1.6"/>
     <path d="M29 36 Q41 21 52 21 Q63 21 75 36 Q63 51 52 51 Q41 51 29 36 Z" fill="hsl(222, 46%, 14%)" stroke="url(#ca-thinking_ahead-brass)" stroke-width="1.7"/>
     <circle cx="52" cy="36" r="9.5" fill="url(#ca-thinking_ahead-orb)" stroke="hsl(190, 100%, 84%)" stroke-width="1"/>
     <circle cx="52" cy="36" r="4" fill="hsl(226, 62%, 12%)"/>
     <circle cx="49.5" cy="33.5" r="2" fill="hsl(0, 0%, 100%)"/>
     <path d="M74 36 L90 25 M74 36 L92 48" stroke="hsl(48, 100%, 78%)" stroke-width="1.2" stroke-dasharray="2.5 2.5"/>
     <polygon points="86,13 103,10 107,33 90,36" fill="url(#ca-thinking_ahead-card)" stroke="hsl(188, 100%, 88%)" stroke-width="1.3"/>
     <polygon points="94,35 111,38 106,61 89,58" fill="url(#ca-thinking_ahead-card)" stroke="hsl(48, 100%, 82%)" stroke-width="1.3"/>
     <path d="M93 21 L101 19 M94 26 L100 25 M98 46 L105 48 M97 51 L103 52" stroke="hsl(52, 100%, 92%)" stroke-width="1.3" stroke-linecap="round"/>
     <polygon points="52,11 54.5,17 49.5,17" fill="hsl(48, 96%, 76%)"/>
     <polygon points="52,61 54.5,55 49.5,55" fill="hsl(48, 96%, 76%)"/>
     <path d="M81 12 L82.3 15.2 L85.5 16.5 L82.3 17.8 L81 21 L79.7 17.8 L76.5 16.5 L79.7 15.2 Z" fill="hsl(50, 100%, 90%)"/>
     <circle cx="28" cy="56" r="1.6" fill="hsl(190, 100%, 84%)"/>`,
    'hsla(192, 92%, 62%, 0.26)',
    `<radialGradient id="ca-thinking_ahead-orb" cx="46%" cy="46%" r="54%"><stop offset="0%" stop-color="hsl(186, 100%, 88%)"/><stop offset="48%" stop-color="hsl(198, 92%, 52%)"/><stop offset="100%" stop-color="hsl(224, 68%, 22%)"/></radialGradient><linearGradient id="ca-thinking_ahead-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 96%, 78%)"/><stop offset="55%" stop-color="hsl(38, 82%, 48%)"/><stop offset="100%" stop-color="hsl(28, 66%, 24%)"/></linearGradient><linearGradient id="ca-thinking_ahead-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(192, 96%, 84%, 0.85)"/><stop offset="100%" stop-color="hsla(216, 72%, 44%, 0.45)"/></linearGradient>`
  ),
  violence: wrapArtSvg(
    'violence',
    'hsl(6, 52%, 18%)',
    'hsl(352, 48%, 8%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-violence-fury)"/>
     <polygon points="64,6 71,21 90,14 78,29 102,36 79,43 92,59 71,50 64,66 57,50 36,59 49,43 26,36 50,29 38,14 57,21" fill="hsla(356, 86%, 32%, 0.42)"/>
     <path d="M18 20 Q64 4 110 22" fill="none" stroke="url(#ca-violence-blood)" stroke-width="2.4" opacity="0.72" stroke-linecap="round"/>
     <path d="M22 55 L86 12 L97 19 L34 62 Z" fill="url(#ca-violence-steel)" stroke="hsl(356, 62%, 22%)" stroke-width="1.3"/>
     <path d="M15 62 L28 52 L34 59 L21 67 Z" fill="hsl(24, 48%, 24%)" stroke="hsl(40, 74%, 56%)" stroke-width="1.1"/>
     <path d="M26 15 L98 54 L90 63 L21 24 Z" fill="url(#ca-violence-steel)" stroke="hsl(356, 62%, 22%)" stroke-width="1.3"/>
     <path d="M94 52 L110 61 L105 67 L89 58 Z" fill="hsl(24, 48%, 24%)" stroke="hsl(40, 74%, 56%)" stroke-width="1.1"/>
     <path d="M58 10 L70 10 L67 52 L64 62 L61 52 Z" fill="url(#ca-violence-steel)" stroke="hsl(220, 26%, 16%)" stroke-width="1.2"/>
     <path d="M29 55 L88 15 M30 22 L90 54" stroke="hsl(0, 0%, 100%)" stroke-width="1.4" opacity="0.82" stroke-linecap="round"/>
     <path d="M51 35 L77 35" stroke="hsl(354, 100%, 62%)" stroke-width="2.4" stroke-linecap="round"/>
     <polygon points="64,26 67,33 75,36 67,39 64,46 61,39 53,36 61,33" fill="hsl(46, 100%, 84%)"/>
     <polygon points="24,38 32,35 28,43" fill="hsl(20, 96%, 62%)"/>
     <polygon points="103,32 95,35 100,41" fill="hsl(20, 96%, 62%)"/>
     <path d="M16 42 Q40 58 64 56 Q88 58 112 42" fill="none" stroke="url(#ca-violence-blood)" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
     <circle cx="44" cy="14" r="1.8" fill="hsl(44, 100%, 78%)"/>
     <circle cx="84" cy="58" r="1.7" fill="hsl(22, 100%, 68%)"/>`,
    'hsla(10, 96%, 54%, 0.30)',
    `<radialGradient id="ca-violence-fury" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(24, 100%, 62%, 0.68)"/><stop offset="56%" stop-color="hsla(356, 92%, 44%, 0.28)"/><stop offset="100%" stop-color="hsla(350, 80%, 20%, 0)"/></radialGradient><linearGradient id="ca-violence-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(210, 26%, 90%)"/><stop offset="50%" stop-color="hsl(216, 18%, 48%)"/><stop offset="100%" stop-color="hsl(222, 22%, 18%)"/></linearGradient><linearGradient id="ca-violence-blood" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(354, 96%, 56%)"/><stop offset="100%" stop-color="hsl(16, 100%, 60%)"/></linearGradient>`
  ),
  flash_of_steel: wrapArtSvg(
    'flash_of_steel',
    'hsl(208, 44%, 19%)',
    'hsl(224, 48%, 8%)',
    `<polygon points="0,56 96,0 128,0 26,72 0,72" fill="hsla(200, 96%, 76%, 0.11)"/>
     <path d="M14 50 Q52 14 116 12 Q78 32 32 58 Z" fill="url(#ca-flash_of_steel-slash)"/>
     <path d="M8 62 L24 51 L29 58 L13 69 Z" fill="hsl(222, 32%, 18%)" stroke="hsl(42, 62%, 56%)" stroke-width="1.2"/>
     <polygon points="36,48 114,12 103,23 41,54" fill="hsl(216, 26%, 32%)"/>
     <polygon points="34,45 114,12 97,16 36,48" fill="url(#ca-flash_of_steel-blade)" stroke="hsl(198, 90%, 92%)" stroke-width="0.9"/>
     <line x1="39" y1="47" x2="103" y2="17" stroke="hsl(218, 34%, 22%)" stroke-width="1.1"/>
     <line x1="35" y1="44" x2="112" y2="12" stroke="hsl(0, 0%, 100%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M27 39 L44 57" stroke="hsl(206, 36%, 78%)" stroke-width="3.4" stroke-linecap="round"/>
     <path d="M18 57 L34 49" stroke="hsl(222, 28%, 26%)" stroke-width="5.2" stroke-linecap="round"/>
     <circle cx="17" cy="58" r="3" fill="hsl(44, 78%, 64%)" stroke="hsl(220, 32%, 18%)" stroke-width="1"/>
     <circle cx="80" cy="27" r="14" fill="url(#ca-flash_of_steel-gleam)"/>
     <path d="M80 7 L82.4 24.6 L104 27 L82.4 29.4 L80 47 L77.6 29.4 L56 27 L77.6 24.6 Z" fill="hsl(0, 0%, 100%)"/>
     <path d="M18 28 L46 16 M74 56 L108 42" stroke="hsla(196, 100%, 86%, 0.56)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="98" cy="40" r="1.7" fill="hsl(196, 100%, 90%)"/>
     <circle cx="58" cy="14" r="1.5" fill="hsl(196, 100%, 90%)"/>`,
    'hsla(198, 96%, 76%, 0.32)',
    `<linearGradient id="ca-flash_of_steel-blade" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(214, 34%, 44%)"/><stop offset="52%" stop-color="hsl(202, 58%, 86%)"/><stop offset="100%" stop-color="hsl(0, 0%, 100%)"/></linearGradient><radialGradient id="ca-flash_of_steel-gleam" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(0, 0%, 100%)"/><stop offset="38%" stop-color="hsla(196, 100%, 78%, 0.85)"/><stop offset="100%" stop-color="hsla(206, 94%, 56%, 0)"/></radialGradient><linearGradient id="ca-flash_of_steel-slash" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsla(198, 96%, 74%, 0.04)"/><stop offset="58%" stop-color="hsla(194, 100%, 78%, 0.42)"/><stop offset="100%" stop-color="hsla(0, 0%, 100%, 0.88)"/></linearGradient>`
  ),
  finesse: wrapArtSvg(
    'finesse',
    'hsl(188, 38%, 19%)',
    'hsl(214, 42%, 9%)',
    `<ellipse cx="64" cy="36" rx="46" ry="24" fill="hsla(178, 88%, 62%, 0.14)"/>
     <path d="M12 52 C26 14 54 14 64 36 C74 58 102 58 116 20" fill="none" stroke="url(#ca-finesse-silk)" stroke-width="7.5" stroke-linecap="round"/>
     <path d="M10 18 L55 34 L34 20" fill="none" stroke="hsla(352, 74%, 56%, 0.64)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M40 57 Q44 26 68 18 Q58 38 66 56 Q52 60 40 57 Z" fill="hsla(190, 52%, 34%, 0.56)" stroke="url(#ca-finesse-silver)" stroke-width="1.5"/>
     <path d="M45 53 Q48 30 65 23" fill="none" stroke="hsl(46, 92%, 74%)" stroke-width="1.2" opacity="0.8"/>
     <line x1="24" y1="58" x2="108" y2="14" stroke="url(#ca-finesse-silver)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M21 52 Q34 45 38 56 Q28 65 21 52 Z" fill="none" stroke="hsl(46, 94%, 72%)" stroke-width="1.8"/>
     <circle cx="22" cy="59" r="2.6" fill="hsl(46, 96%, 76%)"/>
     <circle cx="62" cy="38" r="12" fill="url(#ca-finesse-spark)"/>
     <path d="M62 27 L64 36 L73 38 L64 40 L62 49 L60 40 L51 38 L60 36 Z" fill="hsl(52, 100%, 94%)"/>
     <path d="M18 48 C34 22 52 24 64 36 C76 48 94 50 112 24" fill="none" stroke="hsl(172, 100%, 86%)" stroke-width="1.5" stroke-linecap="round"/>
     <polygon points="94,40 107,38 110,55 97,57" fill="hsla(176, 86%, 76%, 0.36)" stroke="hsl(174, 96%, 84%)" stroke-width="1.2"/>
     <path d="M99 47 L105 46" stroke="hsl(52, 100%, 90%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="86" cy="20" r="1.7" fill="hsl(174, 100%, 88%)"/>
     <circle cx="42" cy="16" r="1.5" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(176, 86%, 68%, 0.26)',
    `<linearGradient id="ca-finesse-silk" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(172, 96%, 82%, 0.85)"/><stop offset="56%" stop-color="hsla(192, 84%, 56%, 0.44)"/><stop offset="100%" stop-color="hsla(212, 74%, 34%, 0.08)"/></linearGradient><linearGradient id="ca-finesse-silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(0, 0%, 100%)"/><stop offset="55%" stop-color="hsl(194, 34%, 76%)"/><stop offset="100%" stop-color="hsl(212, 34%, 36%)"/></linearGradient><radialGradient id="ca-finesse-spark" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 94%)"/><stop offset="50%" stop-color="hsla(174, 100%, 72%, 0.65)"/><stop offset="100%" stop-color="hsla(192, 92%, 52%, 0)"/></radialGradient>`
  ),
  dramatic_entrance: wrapArtSvg(
    'dramatic_entrance',
    'hsl(28, 52%, 18%)',
    'hsl(240, 38%, 8%)',
    `<circle cx="64" cy="33" r="34" fill="url(#ca-dramatic_entrance-burst)"/>
     <polygon points="64,34 20,0 44,0" fill="hsla(48, 100%, 84%, 0.22)"/>
     <polygon points="64,34 84,0 108,0" fill="hsla(48, 100%, 84%, 0.22)"/>
     <polygon points="64,34 128,16 128,40" fill="hsla(46, 100%, 78%, 0.18)"/>
     <polygon points="10,10 38,16 32,62 6,54" fill="url(#ca-dramatic_entrance-door)" stroke="hsl(38, 66%, 54%)" stroke-width="1.3"/>
     <polygon points="118,10 90,16 96,62 122,54" fill="url(#ca-dramatic_entrance-door)" stroke="hsl(38, 66%, 54%)" stroke-width="1.3"/>
     <path d="M12 24 L35 28 M10 44 L33 48 M116 24 L93 28 M118 44 L95 48" stroke="hsl(220, 18%, 22%)" stroke-width="2.2"/>
     <ellipse cx="64" cy="61" rx="32" ry="6" fill="none" stroke="hsl(44, 100%, 74%)" stroke-width="1.8" opacity="0.82"/>
     <path d="M56 26 Q38 30 30 50 Q48 48 61 44 Q78 52 96 46 Q84 28 70 25 Z" fill="url(#ca-dramatic_entrance-cape)" stroke="hsl(48, 100%, 80%)" stroke-width="1.2"/>
     <path d="M64 17 C68 17 70 21 67 25 L73 39 L67 57 L62 45 L55 56 L58 37 L53 26 L61 24 C59 20 61 17 64 17 Z" fill="hsl(236, 42%, 12%)" stroke="hsl(50, 100%, 86%)" stroke-width="1.3" stroke-linejoin="round"/>
     <polygon points="36,12 46,16 40,21" fill="hsl(30, 58%, 48%)"/>
     <polygon points="91,13 82,17 88,22" fill="hsl(30, 58%, 48%)"/>
     <polygon points="44,54 52,58 46,63" fill="hsl(42, 90%, 66%)"/>
     <polygon points="84,54 76,58 82,63" fill="hsl(42, 90%, 66%)"/>
     <path d="M64 6 L65.8 10.2 L70 12 L65.8 13.8 L64 18 L62.2 13.8 L58 12 L62.2 10.2 Z" fill="hsl(54, 100%, 96%)"/>
     <path d="M24 62 Q44 58 64 62 Q84 58 104 62" fill="none" stroke="hsla(48, 100%, 86%, 0.65)" stroke-width="1.4" stroke-linecap="round"/>`,
    'hsla(44, 100%, 66%, 0.34)',
    `<radialGradient id="ca-dramatic_entrance-burst" cx="50%" cy="44%" r="54%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="44%" stop-color="hsla(42, 100%, 64%, 0.72)"/><stop offset="100%" stop-color="hsla(24, 96%, 46%, 0)"/></radialGradient><linearGradient id="ca-dramatic_entrance-door" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(26, 46%, 34%)"/><stop offset="100%" stop-color="hsl(20, 44%, 13%)"/></linearGradient><linearGradient id="ca-dramatic_entrance-cape" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(352, 82%, 44%)"/><stop offset="100%" stop-color="hsl(246, 42%, 14%)"/></linearGradient>`
  ),
  blind: wrapArtSvg(
    'blind',
    'hsl(46, 36%, 20%)',
    'hsl(230, 34%, 8%)',
    `<polygon points="64,3 72,22 98,8 82,29 120,36 82,43 98,64 72,50 64,69 56,50 30,64 46,43 8,36 46,29 30,8 56,22" fill="hsla(48, 100%, 76%, 0.18)"/>
     <path d="M18 36 Q42 13 64 13 Q86 13 110 36 Q86 59 64 59 Q42 59 18 36 Z" fill="hsl(232, 34%, 11%)" stroke="hsl(46, 62%, 58%)" stroke-width="1.5"/>
     <path d="M24 36 Q44 18 64 18 Q84 18 104 36 Q84 54 64 54 Q44 54 24 36 Z" fill="url(#ca-blind-sclera)"/>
     <circle cx="64" cy="36" r="14" fill="hsl(232, 42%, 22%)" stroke="hsl(48, 86%, 72%)" stroke-width="1.4"/>
     <circle cx="64" cy="36" r="7.5" fill="hsl(234, 52%, 9%)"/>
     <path d="M24 26 Q64 10 104 26" fill="none" stroke="hsl(234, 42%, 10%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M26 48 Q64 62 102 48" fill="none" stroke="hsl(234, 42%, 10%)" stroke-width="2.6" stroke-linecap="round"/>
     <polygon points="10,58 112,8 118,16 16,66" fill="url(#ca-blind-beam)"/>
     <circle cx="64" cy="36" r="18" fill="url(#ca-blind-flash)"/>
     <path d="M64 8 L67.2 32.8 L96 36 L67.2 39.2 L64 64 L60.8 39.2 L32 36 L60.8 32.8 Z" fill="hsl(56, 100%, 98%)"/>
     <path d="M40 20 L88 52 M88 20 L40 52" stroke="hsla(54, 100%, 94%, 0.72)" stroke-width="1.3" stroke-linecap="round"/>
     <circle cx="34" cy="24" r="3" fill="none" stroke="hsla(52, 100%, 90%, 0.65)" stroke-width="1.2"/>
     <circle cx="94" cy="48" r="3.5" fill="none" stroke="hsla(52, 100%, 90%, 0.65)" stroke-width="1.2"/>
     <circle cx="96" cy="22" r="1.8" fill="hsl(56, 100%, 96%)"/>
     <circle cx="32" cy="50" r="1.8" fill="hsl(56, 100%, 96%)"/>`,
    'hsla(50, 100%, 82%, 0.34)',
    `<radialGradient id="ca-blind-flash" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(0, 0%, 100%)"/><stop offset="38%" stop-color="hsl(52, 100%, 78%)"/><stop offset="100%" stop-color="hsla(40, 100%, 54%, 0)"/></radialGradient><linearGradient id="ca-blind-beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(54, 100%, 96%, 0.15)"/><stop offset="50%" stop-color="hsla(54, 100%, 96%, 0.96)"/><stop offset="100%" stop-color="hsla(44, 100%, 68%, 0.15)"/></linearGradient><linearGradient id="ca-blind-sclera" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(48, 42%, 88%)"/><stop offset="100%" stop-color="hsl(228, 22%, 44%)"/></linearGradient>`
  ),
  trip: wrapArtSvg(
    'trip',
    'hsl(34, 34%, 19%)',
    'hsl(218, 32%, 9%)',
    `<path d="M0 50 L128 50 L128 72 L0 72 Z" fill="url(#ca-trip-ground)"/>
     <path d="M12 58 H38 M52 63 H84 M96 57 H120 M24 67 H56" stroke="rgba(0,0,0,0.34)" stroke-width="1.4" stroke-linecap="round"/>
     <ellipse cx="66" cy="59" rx="30" ry="6" fill="rgba(0,0,0,0.46)"/>
     <polygon points="15,44 21,42 23,60 17,61" fill="hsl(26, 46%, 30%)" stroke="hsl(36, 56%, 52%)" stroke-width="1"/>
     <polygon points="107,42 113,44 111,61 105,60" fill="hsl(26, 46%, 30%)" stroke="hsl(36, 56%, 52%)" stroke-width="1"/>
     <path d="M40 16 Q60 12 78 24 M34 24 Q52 21 68 32" fill="none" stroke="hsla(42, 92%, 72%, 0.42)" stroke-width="2" stroke-linecap="round"/>
     <path d="M52 10 L71 14 L63 40 L89 47 L85 57 L47 47 L52 34 Z" fill="url(#ca-trip-boot)" stroke="hsl(220, 26%, 12%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M57 14 L65 16 L60 36 L81 48" fill="none" stroke="hsla(210, 48%, 88%, 0.62)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M51 34 L64 38" stroke="hsl(36, 76%, 54%)" stroke-width="2"/>
     <path d="M20 51 L56 44 L108 51" fill="none" stroke="url(#ca-trip-rope)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M20 51 L56 44 L108 51" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="0.9" stroke-dasharray="3 2"/>
     <path d="M56 35 L58 42 L65 40 L60 46 L66 51 L58 49 L55 56 L54 48 L47 48 L53 44 L50 38 L55 42 Z" fill="hsl(46, 100%, 82%)"/>
     <polygon points="94,54 100,52 98,58" fill="hsl(32, 32%, 52%)"/>
     <polygon points="88,62 94,61 91,66" fill="hsl(32, 32%, 44%)"/>
     <circle cx="98" cy="46" r="2.4" fill="hsla(38, 46%, 72%, 0.65)"/>
     <circle cx="105" cy="41" r="1.6" fill="hsla(42, 76%, 76%, 0.72)"/>`,
    'hsla(38, 92%, 60%, 0.26)',
    `<linearGradient id="ca-trip-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(32, 24%, 26%)"/><stop offset="100%" stop-color="hsl(220, 26%, 11%)"/></linearGradient><linearGradient id="ca-trip-boot" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(216, 20%, 62%)"/><stop offset="48%" stop-color="hsl(220, 22%, 30%)"/><stop offset="100%" stop-color="hsl(224, 26%, 14%)"/></linearGradient><linearGradient id="ca-trip-rope" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(36, 72%, 44%)"/><stop offset="50%" stop-color="hsl(48, 100%, 78%)"/><stop offset="100%" stop-color="hsl(36, 72%, 44%)"/></linearGradient>`
  ),
  bandage_up: wrapArtSvg(
    'bandage_up',
    'hsl(156, 46%, 17%)',
    'hsl(178, 44%, 8%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-bandage_up-aura)"/>
     <ellipse cx="64" cy="62" rx="38" ry="6" fill="rgba(0,0,0,0.40)"/>
     <path d="M18 51 L88 19 L97 34 L27 64 Z" fill="url(#ca-bandage_up-linen)" stroke="hsl(36, 24%, 40%)" stroke-width="1.2"/>
     <path d="M22 25 L92 54 L84 65 L15 39 Z" fill="url(#ca-bandage_up-linen)" stroke="hsl(36, 24%, 40%)" stroke-width="1.2"/>
     <path d="M28 53 L86 27 M24 34 L82 56" stroke="hsla(34, 24%, 42%, 0.36)" stroke-width="1.2" stroke-dasharray="3 3"/>
     <path d="M88 30 L106 30 A7 14 0 0 1 106 58 L88 58 Z" fill="url(#ca-bandage_up-linen)" stroke="hsl(36, 26%, 38%)" stroke-width="1.2"/>
     <ellipse cx="88" cy="44" rx="6.5" ry="14" fill="hsl(40, 38%, 84%)" stroke="hsl(36, 26%, 40%)" stroke-width="1.2"/>
     <ellipse cx="88" cy="44" rx="3" ry="7.5" fill="none" stroke="hsl(36, 24%, 48%)" stroke-width="1.1"/>
     <path d="M24 27 L58 40" stroke="hsl(0, 0%, 100%)" stroke-width="1.4" opacity="0.72" stroke-linecap="round"/>
     <circle cx="55" cy="41" r="14" fill="hsla(146, 98%, 54%, 0.28)"/>
     <path d="M51 30 H59 V37 H66 V45 H59 V52 H51 V45 H44 V37 H51 Z" fill="url(#ca-bandage_up-cross)" stroke="hsl(136, 100%, 88%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M55 33 V49 M47 41 H63" stroke="hsl(132, 100%, 92%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M26 14 V22 M22 18 H30" stroke="hsl(142, 100%, 78%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M98 12 V20 M94 16 H102" stroke="hsl(142, 100%, 78%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="42" cy="14" r="1.7" fill="hsl(138, 100%, 86%)"/>
     <circle cx="76" cy="13" r="1.5" fill="hsl(138, 100%, 86%)"/>`,
    'hsla(146, 94%, 58%, 0.28)',
    `<radialGradient id="ca-bandage_up-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(146, 98%, 62%, 0.44)"/><stop offset="65%" stop-color="hsla(158, 86%, 42%, 0.16)"/><stop offset="100%" stop-color="hsla(170, 74%, 22%, 0)"/></radialGradient><linearGradient id="ca-bandage_up-linen" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(44, 52%, 95%)"/><stop offset="56%" stop-color="hsl(38, 34%, 76%)"/><stop offset="100%" stop-color="hsl(34, 26%, 48%)"/></linearGradient><linearGradient id="ca-bandage_up-cross" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(138, 100%, 78%)"/><stop offset="100%" stop-color="hsl(154, 92%, 42%)"/></linearGradient>`
  ),
  dark_shackles: wrapArtSvg(
    'dark_shackles',
    'hsl(268, 42%, 16%)',
    'hsl(240, 44%, 7%)',
    `<ellipse cx="64" cy="36" rx="48" ry="26" fill="url(#ca-dark_shackles-rune)" opacity="0.56"/>
     <path d="M0 16 Q22 24 34 16 M128 16 Q106 24 94 16 M0 60 Q26 52 44 64 M128 60 Q102 52 84 64" fill="none" stroke="hsla(276, 84%, 44%, 0.34)" stroke-width="2.4" stroke-linecap="round"/>
     <ellipse cx="26" cy="37" rx="14" ry="18" fill="none" stroke="url(#ca-dark_shackles-iron)" stroke-width="6.5"/>
     <ellipse cx="102" cy="37" rx="14" ry="18" fill="none" stroke="url(#ca-dark_shackles-iron)" stroke-width="6.5"/>
     <path d="M16 25 A12 16 0 0 1 28 21 M92 25 A12 16 0 0 1 104 21" fill="none" stroke="hsla(278, 86%, 82%, 0.56)" stroke-width="1.6" stroke-linecap="round"/>
     <ellipse cx="45" cy="37" rx="8.5" ry="5" fill="none" stroke="url(#ca-dark_shackles-iron)" stroke-width="3.6"/>
     <ellipse cx="83" cy="37" rx="8.5" ry="5" fill="none" stroke="url(#ca-dark_shackles-iron)" stroke-width="3.6"/>
     <path d="M55 34 V24 A9 9 0 0 1 73 24 V29" fill="none" stroke="url(#ca-dark_shackles-iron)" stroke-width="4.2" stroke-linecap="round"/>
     <rect x="50" y="32" width="28" height="25" rx="4" fill="url(#ca-dark_shackles-lock)" stroke="hsl(276, 62%, 58%)" stroke-width="1.4"/>
     <path d="M53 35 H75" stroke="hsla(270, 52%, 82%, 0.45)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M64 37.5 A3.6 3.6 0 1 0 64 44.7 A3.6 3.6 0 1 0 64 37.5 Z M62 43 L66 43 L67.5 52 L60.5 52 Z" fill="hsl(284, 100%, 78%)"/>
     <path d="M74 28 L79 24 L75 33" fill="none" stroke="hsl(286, 100%, 84%)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <ellipse cx="26" cy="37" rx="18" ry="22" fill="none" stroke="hsla(280, 96%, 68%, 0.42)" stroke-width="1.1" stroke-dasharray="4 3"/>
     <ellipse cx="102" cy="37" rx="18" ry="22" fill="none" stroke="hsla(280, 96%, 68%, 0.42)" stroke-width="1.1" stroke-dasharray="4 3"/>
     <circle cx="77" cy="21" r="2" fill="hsl(286, 100%, 88%)"/>
     <circle cx="64" cy="63" r="1.6" fill="hsl(282, 100%, 80%)"/>`,
    'hsla(278, 92%, 62%, 0.28)',
    `<linearGradient id="ca-dark_shackles-iron" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(258, 22%, 52%)"/><stop offset="48%" stop-color="hsl(254, 28%, 22%)"/><stop offset="100%" stop-color="hsl(248, 34%, 9%)"/></linearGradient><radialGradient id="ca-dark_shackles-rune" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(284, 100%, 82%)"/><stop offset="52%" stop-color="hsla(274, 96%, 56%, 0.45)"/><stop offset="100%" stop-color="hsla(266, 86%, 32%, 0)"/></radialGradient><linearGradient id="ca-dark_shackles-lock" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(256, 24%, 40%)"/><stop offset="100%" stop-color="hsl(248, 34%, 12%)"/></linearGradient>`
  ),
  panacea: wrapArtSvg(
    'panacea',
    'hsl(196, 52%, 19%)',
    'hsl(226, 46%, 9%)',
    `<circle cx="64" cy="28" r="27" fill="url(#ca-panacea-halo)"/>
     <circle cx="64" cy="28" r="20" fill="none" stroke="hsla(50, 100%, 84%, 0.56)" stroke-width="1.3"/>
     <path d="M64 4 V9 M38 28 H43 M85 28 H90 M45 10 L49 14 M83 10 L79 14" stroke="hsl(50, 100%, 84%)" stroke-width="1.4" stroke-linecap="round"/>
     <ellipse cx="64" cy="64" rx="22" ry="4.5" fill="rgba(0,0,0,0.44)"/>
     <path d="M47 63 L57 57 L60 47 H68 L71 57 L81 63 Z" fill="url(#ca-panacea-gold)" stroke="hsl(34, 72%, 24%)" stroke-width="1.2"/>
     <path d="M44 24 C34 24 33 37 44 39 M84 24 C94 24 95 37 84 39" fill="none" stroke="url(#ca-panacea-gold)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M44 21 H84 L80 39 C78 46 71 49 64 49 C57 49 50 46 48 39 Z" fill="hsla(192, 92%, 86%, 0.24)" stroke="hsl(190, 100%, 88%)" stroke-width="1.5"/>
     <path d="M47 28 H81 L78 39 C76 45 70 47 64 47 C58 47 52 45 50 39 Z" fill="url(#ca-panacea-elixir)"/>
     <ellipse cx="64" cy="28" rx="17" ry="3.4" fill="hsl(52, 100%, 92%)" opacity="0.92"/>
     <ellipse cx="64" cy="21" rx="20" ry="3.2" fill="none" stroke="url(#ca-panacea-gold)" stroke-width="1.8"/>
     <path d="M51 27 L53 42" stroke="hsl(0, 0%, 100%)" stroke-width="2" stroke-linecap="round" opacity="0.72"/>
     <path d="M64 25 Q60 17 65 11 Q69 17 64 25 Z" fill="hsla(52, 100%, 94%, 0.72)"/>
     <path d="M32 14 L33.4 17.6 L37 19 L33.4 20.4 L32 24 L30.6 20.4 L27 19 L30.6 17.6 Z" fill="hsl(52, 100%, 92%)"/>
     <path d="M96 14 L97.4 17.6 L101 19 L97.4 20.4 L96 24 L94.6 20.4 L91 19 L94.6 17.6 Z" fill="hsl(180, 100%, 86%)"/>
     <circle cx="58" cy="18" r="1.7" fill="hsl(176, 100%, 88%)"/>
     <circle cx="71" cy="15" r="1.5" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(48, 100%, 72%, 0.30)',
    `<radialGradient id="ca-panacea-halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(50, 100%, 84%, 0.65)"/><stop offset="56%" stop-color="hsla(182, 96%, 64%, 0.28)"/><stop offset="100%" stop-color="hsla(198, 86%, 40%, 0)"/></radialGradient><linearGradient id="ca-panacea-elixir" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 88%)"/><stop offset="48%" stop-color="hsl(176, 94%, 64%)"/><stop offset="100%" stop-color="hsl(198, 86%, 40%)"/></linearGradient><linearGradient id="ca-panacea-gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(36, 78%, 40%)"/><stop offset="50%" stop-color="hsl(50, 100%, 82%)"/><stop offset="100%" stop-color="hsl(34, 76%, 34%)"/></linearGradient>`
  ),
  burn: wrapArtSvg(
    'burn',
    'hsl(14, 76%, 20%)',
    'hsl(354, 62%, 7%)',
    `<circle cx="64" cy="38" r="34" fill="hsla(22, 100%, 54%, 0.24)"/>
     <path d="M0 57 L22 52 L42 58 L66 51 L92 58 L112 52 L128 57 L128 72 L0 72 Z" fill="url(#ca-burn-crust)"/>
     <path d="M16 66 L34 57 L52 65 L74 56 L96 66 L114 58" fill="none" stroke="hsl(32, 100%, 62%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M36 58 C26 42 36 22 50 18 C48 26 52 28 56 20 C62 8 72 6 70 18 C80 14 90 22 86 35 C95 34 98 48 88 58 Z" fill="hsla(352, 84%, 24%, 0.65)"/>
     <path d="M40 58 C31 44 40 26 54 20 C52 30 57 31 63 11 C71 21 75 28 82 22 C89 34 92 48 84 58 Z" fill="url(#ca-burn-outer)" stroke="hsl(42, 100%, 72%)" stroke-width="1"/>
     <path d="M49 58 C44 47 50 34 62 24 C67 33 70 36 74 32 C79 42 79 51 75 58 Z" fill="url(#ca-burn-core)"/>
     <path d="M57 58 C55 50 59 42 64 36 C69 43 71 50 69 58 Z" fill="hsl(58, 100%, 96%)"/>
     <polygon points="24,42 31,38 29,46" fill="hsl(14, 42%, 16%)" stroke="hsl(32, 100%, 64%)" stroke-width="1"/>
     <polygon points="98,38 105,35 103,43" fill="hsl(14, 42%, 16%)" stroke="hsl(32, 100%, 64%)" stroke-width="1"/>
     <path d="M28 30 Q22 20 30 11 M100 28 Q106 18 98 9" fill="none" stroke="hsl(38, 100%, 68%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="42" cy="14" r="2" fill="hsl(48, 100%, 82%)"/>
     <circle cx="88" cy="15" r="1.8" fill="hsl(36, 100%, 72%)"/>
     <circle cx="20" cy="24" r="1.5" fill="hsl(26, 100%, 64%)"/>
     <circle cx="108" cy="26" r="1.6" fill="hsl(46, 100%, 78%)"/>
     <circle cx="64" cy="6" r="1.6" fill="hsl(52, 100%, 88%)"/>`,
    'hsla(26, 100%, 56%, 0.34)',
    `<linearGradient id="ca-burn-outer" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(354, 90%, 34%)"/><stop offset="48%" stop-color="hsl(14, 98%, 52%)"/><stop offset="100%" stop-color="hsl(40, 100%, 68%)"/></linearGradient><linearGradient id="ca-burn-core" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(24, 100%, 54%)"/><stop offset="56%" stop-color="hsl(46, 100%, 72%)"/><stop offset="100%" stop-color="hsl(58, 100%, 95%)"/></linearGradient><linearGradient id="ca-burn-crust" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(14, 34%, 18%)"/><stop offset="100%" stop-color="hsl(354, 42%, 8%)"/></linearGradient>`
  ),
  wound: wrapArtSvg(
    'wound',
    'hsl(350, 56%, 16%)',
    'hsl(228, 32%, 8%)',
    `<ellipse cx="64" cy="36" rx="46" ry="26" fill="hsla(354, 92%, 42%, 0.22)"/>
     <path d="M12 10 L108 10 L114 58 L20 62 Z" fill="url(#ca-wound-armor)" stroke="hsl(218, 20%, 38%)" stroke-width="1.3"/>
     <circle cx="24" cy="19" r="2.4" fill="hsl(220, 18%, 16%)" stroke="hsl(212, 22%, 62%)" stroke-width="0.9"/>
     <circle cx="101" cy="19" r="2.4" fill="hsl(220, 18%, 16%)" stroke="hsl(212, 22%, 62%)" stroke-width="0.9"/>
     <circle cx="28" cy="54" r="2.4" fill="hsl(220, 18%, 16%)" stroke="hsl(212, 22%, 62%)" stroke-width="0.9"/>
     <circle cx="104" cy="52" r="2.4" fill="hsl(220, 18%, 16%)" stroke="hsl(212, 22%, 62%)" stroke-width="0.9"/>
     <path d="M22 14 L50 24 L66 30 L88 42 L106 55 L82 47 L60 40 L42 30 Z" fill="hsl(346, 84%, 11%)" stroke="hsl(212, 26%, 78%)" stroke-width="1.6" stroke-linejoin="round"/>
     <path d="M27 16 L52 26 L70 33 L90 45 L102 53 L80 45 L60 38 L44 29 Z" fill="url(#ca-wound-gash)"/>
     <path d="M40 24 L66 34 L88 46" fill="none" stroke="hsl(356, 100%, 66%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M48 16 L76 52" fill="none" stroke="hsl(352, 86%, 38%)" stroke-width="2" stroke-linecap="round" opacity="0.72"/>
     <path d="M45 31 Q43 44 46 53 Q49 58 46 66" fill="none" stroke="url(#ca-wound-blood)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M65 39 Q63 50 66 59 Q68 64 65 69" fill="none" stroke="url(#ca-wound-blood)" stroke-width="3.6" stroke-linecap="round"/>
     <path d="M84 47 Q83 56 86 63" fill="none" stroke="url(#ca-wound-blood)" stroke-width="2.8" stroke-linecap="round"/>
     <path d="M55 49 Q52 55 55 58 Q58 55 55 49 Z" fill="hsl(354, 96%, 48%)"/>
     <path d="M75 56 Q72 62 75 65 Q78 62 75 56 Z" fill="hsl(354, 96%, 48%)"/>
     <path d="M44 43 V49 M64 49 V56" stroke="hsl(356, 100%, 82%)" stroke-width="1" stroke-linecap="round" opacity="0.8"/>`,
    'hsla(354, 94%, 46%, 0.30)',
    `<linearGradient id="ca-wound-armor" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(216, 18%, 48%)"/><stop offset="52%" stop-color="hsl(222, 20%, 24%)"/><stop offset="100%" stop-color="hsl(228, 24%, 12%)"/></linearGradient><linearGradient id="ca-wound-blood" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(354, 98%, 54%)"/><stop offset="56%" stop-color="hsl(350, 90%, 32%)"/><stop offset="100%" stop-color="hsl(344, 84%, 14%)"/></linearGradient><linearGradient id="ca-wound-gash" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(348, 92%, 22%)"/><stop offset="50%" stop-color="hsl(354, 96%, 44%)"/><stop offset="100%" stop-color="hsl(344, 86%, 14%)"/></linearGradient>`
  ),
  dazed: wrapArtSvg(
    'dazed',
    'hsl(248, 52%, 20%)',
    'hsl(228, 56%, 8%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-dazed-vortex)"/>
     <ellipse cx="64" cy="36" rx="44" ry="18" transform="rotate(-16 64 36)" fill="none" stroke="hsla(256, 92%, 72%, 0.34)" stroke-width="1.4" stroke-dasharray="5 4"/>
     <ellipse cx="64" cy="36" rx="38" ry="14" transform="rotate(14 64 36)" fill="none" stroke="hsla(196, 100%, 76%, 0.38)" stroke-width="1.4"/>
     <path d="M64 36 C64 31 70 30 71 36 C72 44 60 47 55 40 C49 31 58 21 69 22 C83 23 87 40 77 50 C65 62 43 56 39 40 C35 23 50 10 69 11" fill="none" stroke="hsl(238, 64%, 14%)" stroke-width="5.6" stroke-linecap="round"/>
     <path d="M64 36 C64 31 70 30 71 36 C72 44 60 47 55 40 C49 31 58 21 69 22 C83 23 87 40 77 50 C65 62 43 56 39 40 C35 23 50 10 69 11" fill="none" stroke="url(#ca-dazed-spiral)" stroke-width="3" stroke-linecap="round"/>
     <path d="M64 36 C64 41 58 42 57 36 C56 28 68 25 73 32 C79 41 70 51 59 50 C45 49 41 32 51 22 C63 10 85 16 89 32 C93 49 78 62 59 61" fill="none" stroke="hsla(196, 100%, 82%, 0.62)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="64" cy="36" r="4.2" fill="hsl(278, 100%, 86%)"/>
     <path d="M26 24 Q34 14 46 14" fill="none" stroke="hsla(52, 100%, 84%, 0.56)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M102 48 Q94 58 82 58" fill="none" stroke="hsla(52, 100%, 84%, 0.56)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="24,25 26.5,31 33,31 28,35 30,41 24,37 18,41 20,35 15,31 21.5,31" fill="url(#ca-dazed-star)"/>
     <polygon points="103,18 105,23 110,23 106,26 107.5,31 103,28 98.5,31 100,26 96,23 101,23" fill="url(#ca-dazed-star)"/>
     <polygon points="94,48 95.6,52 100,52 96.5,54.5 97.8,58.5 94,56 90.2,58.5 91.5,54.5 88,52 92.4,52" fill="url(#ca-dazed-star)"/>
     <circle cx="38" cy="54" r="2" fill="hsl(196, 100%, 86%)"/>
     <circle cx="88" cy="14" r="1.8" fill="hsl(276, 100%, 86%)"/>
     <circle cx="48" cy="60" r="1.5" fill="hsl(52, 100%, 86%)"/>`,
    'hsla(264, 96%, 68%, 0.30)',
    `<radialGradient id="ca-dazed-vortex" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(268, 100%, 78%, 0.65)"/><stop offset="52%" stop-color="hsla(236, 86%, 46%, 0.28)"/><stop offset="100%" stop-color="hsla(228, 66%, 14%, 0)"/></radialGradient><linearGradient id="ca-dazed-spiral" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(196, 100%, 78%)"/><stop offset="52%" stop-color="hsl(262, 96%, 72%)"/><stop offset="100%" stop-color="hsl(292, 92%, 64%)"/></linearGradient><linearGradient id="ca-dazed-star" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 94%)"/><stop offset="100%" stop-color="hsl(44, 100%, 62%)"/></linearGradient>`
  ),
  slimed: wrapArtSvg(
    'slimed',
    'hsl(104, 54%, 17%)',
    'hsl(148, 50%, 7%)',
    `<ellipse cx="64" cy="38" rx="48" ry="26" fill="hsla(98, 96%, 50%, 0.18)"/>
     <path d="M0 0 H128 V14 Q116 14 114 27 Q112 34 107 26 Q103 14 90 16 Q82 18 80 32 Q76 38 72 28 Q68 13 54 14 Q44 15 41 26 Q37 33 33 23 Q28 13 16 16 Q10 18 8 28 Q4 32 0 24 Z" fill="url(#ca-slimed-drip)" opacity="0.82"/>
     <path d="M6 68 Q26 54 50 58 Q74 53 98 59 Q114 56 124 68 L128 72 L0 72 Z" fill="hsl(124, 72%, 22%)"/>
     <path d="M52 24 Q55 34 52 44 M78 24 Q74 36 78 48" fill="none" stroke="hsl(102, 90%, 46%)" stroke-width="4.6" stroke-linecap="round"/>
     <path d="M32 45 C24 34 36 22 50 25 C56 16 74 16 80 26 C95 24 104 36 96 47 C99 57 86 63 75 58 C68 65 56 64 50 58 C38 62 28 55 32 45 Z" fill="url(#ca-slimed-ooze)" stroke="hsl(126, 78%, 20%)" stroke-width="1.5"/>
     <path d="M36 51 C46 57 78 58 92 49 C84 58 68 61 52 57 C42 58 36 55 36 51 Z" fill="hsla(138, 78%, 14%, 0.45)"/>
     <path d="M40 34 Q46 26 56 28 M64 23 Q72 22 78 28" fill="none" stroke="hsl(78, 100%, 88%)" stroke-width="2.4" stroke-linecap="round" opacity="0.85"/>
     <circle cx="52" cy="40" r="6.5" fill="url(#ca-slimed-bubble)" stroke="hsl(122, 76%, 28%)" stroke-width="1"/>
     <circle cx="75" cy="43" r="5" fill="url(#ca-slimed-bubble)" stroke="hsl(122, 76%, 28%)" stroke-width="1"/>
     <circle cx="64" cy="31" r="3.4" fill="url(#ca-slimed-bubble)"/>
     <circle cx="50" cy="38" r="1.6" fill="hsl(0, 0%, 100%)" opacity="0.9"/>
     <circle cx="73.5" cy="41.5" r="1.3" fill="hsl(0, 0%, 100%)" opacity="0.9"/>
     <path d="M22 44 Q19 52 23 55 Q27 52 22 44 Z" fill="url(#ca-slimed-ooze)"/>
     <path d="M107 40 Q104 48 108 51 Q112 48 107 40 Z" fill="url(#ca-slimed-ooze)"/>
     <circle cx="34" cy="60" r="2.6" fill="url(#ca-slimed-bubble)"/>
     <circle cx="95" cy="61" r="2.2" fill="url(#ca-slimed-bubble)"/>`,
    'hsla(96, 98%, 54%, 0.30)',
    `<radialGradient id="ca-slimed-ooze" cx="38%" cy="32%" r="66%"><stop offset="0%" stop-color="hsl(86, 100%, 74%)"/><stop offset="50%" stop-color="hsl(104, 88%, 44%)"/><stop offset="100%" stop-color="hsl(132, 74%, 20%)"/></radialGradient><linearGradient id="ca-slimed-drip" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(124, 72%, 24%)"/><stop offset="68%" stop-color="hsl(102, 90%, 46%)"/><stop offset="100%" stop-color="hsl(86, 100%, 66%)"/></linearGradient><radialGradient id="ca-slimed-bubble" cx="34%" cy="30%" r="66%"><stop offset="0%" stop-color="hsl(78, 100%, 88%)"/><stop offset="56%" stop-color="hsl(98, 92%, 52%)"/><stop offset="100%" stop-color="hsl(126, 78%, 26%)"/></radialGradient>`
  ),
  void: wrapArtSvg(
    'void',
    'hsl(268, 54%, 14%)',
    'hsl(252, 62%, 5%)',
    `<ellipse cx="64" cy="36" rx="54" ry="30" fill="hsla(274, 90%, 40%, 0.20)"/>
     <path d="M6 10 L32 22 L24 30 M122 10 L96 22 L104 30 M8 64 L36 52 L30 44 M120 64 L92 52 L98 44" fill="none" stroke="hsla(282, 100%, 74%, 0.44)" stroke-width="1.3" stroke-linecap="round"/>
     <ellipse cx="64" cy="36" rx="38" ry="14" transform="rotate(-18 64 36)" fill="none" stroke="url(#ca-void-ring)" stroke-width="2" stroke-dasharray="14 5 7 4" opacity="0.82"/>
     <ellipse cx="64" cy="36" rx="28" ry="11" transform="rotate(20 64 36)" fill="none" stroke="hsla(282, 100%, 76%, 0.64)" stroke-width="1.6" stroke-dasharray="10 4"/>
     <circle cx="64" cy="36" r="22" fill="url(#ca-void-hole)"/>
     <circle cx="64" cy="36" r="12.5" fill="hsl(262, 84%, 3%)" stroke="hsl(286, 100%, 78%)" stroke-width="1.3"/>
     <path d="M22 26 Q42 22 52 33 M106 46 Q86 50 76 39" fill="none" stroke="url(#ca-void-ring)" stroke-width="2" stroke-linecap="round"/>
     <path d="M40 58 Q48 44 58 46 M88 14 Q80 28 70 26" fill="none" stroke="hsla(198, 100%, 78%, 0.66)" stroke-width="1.5" stroke-linecap="round"/>
     <polygon points="18,16 35,24 27,31" fill="url(#ca-void-shard)" stroke="hsl(286, 100%, 84%)" stroke-width="0.9"/>
     <polygon points="110,18 93,26 100,33" fill="url(#ca-void-shard)" stroke="hsl(286, 100%, 84%)" stroke-width="0.9"/>
     <polygon points="22,58 38,48 31,42" fill="url(#ca-void-shard)" stroke="hsl(198, 100%, 80%)" stroke-width="0.9"/>
     <polygon points="106,56 90,46 97,40" fill="url(#ca-void-shard)" stroke="hsl(198, 100%, 80%)" stroke-width="0.9"/>
     <circle cx="48" cy="18" r="1.7" fill="hsl(286, 100%, 86%)"/>
     <circle cx="80" cy="54" r="1.7" fill="hsl(198, 100%, 84%)"/>
     <circle cx="86" cy="20" r="1.4" fill="hsl(316, 100%, 80%)"/>`,
    'hsla(276, 98%, 58%, 0.32)',
    `<radialGradient id="ca-void-hole" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(260, 80%, 2%)"/><stop offset="54%" stop-color="hsl(264, 78%, 6%)"/><stop offset="76%" stop-color="hsl(280, 100%, 66%)"/><stop offset="100%" stop-color="hsla(266, 92%, 38%, 0)"/></radialGradient><linearGradient id="ca-void-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(196, 100%, 74%)"/><stop offset="50%" stop-color="hsl(284, 100%, 72%)"/><stop offset="100%" stop-color="hsl(316, 96%, 60%)"/></linearGradient><linearGradient id="ca-void-shard" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(282, 86%, 72%)"/><stop offset="100%" stop-color="hsl(258, 64%, 16%)"/></linearGradient>`
  ),
  clumsy: wrapArtSvg(
    'clumsy',
    'hsl(28, 28%, 17%)',
    'hsl(232, 22%, 8%)',
    `<ellipse cx="64" cy="52" rx="52" ry="18" fill="url(#ca-clumsy-dust)"/>
     <path d="M0 54 L128 54 L128 72 L0 72 Z" fill="hsla(228, 28%, 9%, 0.62)"/>
     <path d="M18 60 Q46 54 78 60 Q98 63 110 66 Q80 69 44 67 Q22 66 18 60 Z" fill="hsla(24, 34%, 14%, 0.72)"/>
     <ellipse cx="46" cy="57" rx="22" ry="5.5" fill="rgba(0,0,0,0.48)"/>
     <path d="M24 44 C24 30 40 24 54 30 L64 36 L66 32 L72 37 L63 48 L58 54 C46 60 24 56 24 44 Z" fill="url(#ca-clumsy-clay)" stroke="hsl(16, 46%, 14%)" stroke-width="1.4" stroke-linejoin="round"/>
     <ellipse cx="66" cy="40" rx="4.2" ry="7.5" transform="rotate(26 66 40)" fill="hsl(18, 42%, 12%)" stroke="hsl(24, 48%, 48%)" stroke-width="1.1"/>
     <path d="M38 30 L44 39 L40 46 L48 53" fill="none" stroke="hsl(18, 46%, 10%)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M30 37 Q37 30 47 32" fill="none" stroke="hsla(32, 68%, 74%, 0.56)" stroke-width="1.7" stroke-linecap="round"/>
     <polygon points="58,56 68,53 65,61" fill="url(#ca-clumsy-clay)" stroke="hsl(16, 44%, 14%)" stroke-width="0.9"/>
     <polygon points="48,60 55,62 50,66" fill="url(#ca-clumsy-clay)" stroke="hsl(16, 44%, 14%)" stroke-width="0.9"/>
     <path d="M98 14 L106 20 L82 47 L75 51 L78 43 Z" fill="url(#ca-clumsy-blade)" stroke="hsl(220, 24%, 14%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M95 12 L109 22 M101 16 L109 9" stroke="hsl(28, 44%, 38%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M84 16 Q92 22 86 30 M112 28 Q114 38 104 44" fill="none" stroke="hsla(38, 62%, 72%, 0.55)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="72" cy="54" r="3" fill="hsla(34, 34%, 64%, 0.45)"/>
     <circle cx="84" cy="58" r="2.2" fill="hsla(34, 34%, 64%, 0.38)"/>
     <circle cx="22" cy="52" r="2.2" fill="hsla(34, 34%, 64%, 0.35)"/>`,
    'hsla(32, 56%, 48%, 0.24)',
    `<radialGradient id="ca-clumsy-dust" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(34, 42%, 52%, 0.34)"/><stop offset="100%" stop-color="hsla(230, 26%, 12%, 0)"/></radialGradient><linearGradient id="ca-clumsy-clay" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(22, 52%, 54%)"/><stop offset="52%" stop-color="hsl(18, 46%, 32%)"/><stop offset="100%" stop-color="hsl(16, 42%, 14%)"/></linearGradient><linearGradient id="ca-clumsy-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(212, 18%, 78%)"/><stop offset="100%" stop-color="hsl(220, 22%, 30%)"/></linearGradient>`
  ),
  doubt: wrapArtSvg(
    'doubt',
    'hsl(252, 34%, 16%)',
    'hsl(232, 40%, 7%)',
    `<circle cx="64" cy="36" r="30" fill="hsla(268, 82%, 48%, 0.18)"/>
     <path d="M0 14 Q24 22 34 14 Q22 34 32 48 Q16 56 0 64 Z M128 14 Q104 22 94 14 Q106 34 96 48 Q112 56 128 64 Z" fill="url(#ca-doubt-smoke)"/>
     <polygon points="24,11 63,9 59,37 31,56 18,36" fill="url(#ca-doubt-mirror)" stroke="hsl(232, 24%, 72%)" stroke-width="1.3"/>
     <polygon points="67,10 106,15 110,44 69,40 64,25" fill="url(#ca-doubt-mirror)" stroke="hsl(232, 24%, 72%)" stroke-width="1.3"/>
     <polygon points="36,59 62,41 99,48 86,64 46,66" fill="url(#ca-doubt-mirror)" stroke="hsl(232, 24%, 66%)" stroke-width="1.2"/>
     <path d="M30 16 L44 26 M96 19 L82 32 M50 59 L68 51" stroke="hsla(0, 0%, 100%, 0.36)" stroke-width="2" stroke-linecap="round"/>
     <path d="M36 35 Q50 22 64 23 Q78 24 91 37 Q76 49 62 48 Q48 48 36 35 Z" fill="hsl(246, 52%, 10%)" stroke="hsl(268, 72%, 62%)" stroke-width="1.4"/>
     <path d="M42 35 Q52 26 63 27 Q74 28 85 37 Q73 45 62 44 Q51 44 42 35 Z" fill="hsl(240, 26%, 80%)" opacity="0.88"/>
     <circle cx="62" cy="36" r="8.5" fill="url(#ca-doubt-eye)"/>
     <ellipse cx="62" cy="36" rx="2.4" ry="6.8" fill="hsl(252, 72%, 7%)"/>
     <circle cx="60" cy="33" r="1.4" fill="hsl(52, 100%, 92%)"/>
     <path d="M78 21 Q86 16 94 22 Q86 27 78 21 Z" fill="hsl(248, 52%, 12%)" stroke="hsl(272, 76%, 64%)" stroke-width="0.9"/>
     <circle cx="86" cy="21.5" r="2.2" fill="hsl(276, 94%, 68%)"/>
     <path d="M64 8 L60 36 L34 57 M60 36 L104 45" fill="none" stroke="hsl(248, 58%, 7%)" stroke-width="2.4"/>
     <path d="M65 8 L61 36 L35 57 M61 36 L104 46" fill="none" stroke="hsla(216, 62%, 90%, 0.72)" stroke-width="0.9"/>
     <circle cx="24" cy="54" r="1.6" fill="hsl(276, 90%, 76%)"/>`,
    'hsla(268, 76%, 56%, 0.26)',
    `<linearGradient id="ca-doubt-mirror" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(224, 28%, 74%)"/><stop offset="48%" stop-color="hsl(242, 26%, 38%)"/><stop offset="100%" stop-color="hsl(252, 34%, 15%)"/></linearGradient><radialGradient id="ca-doubt-eye" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 96%, 72%)"/><stop offset="56%" stop-color="hsl(276, 88%, 54%)"/><stop offset="100%" stop-color="hsl(256, 68%, 18%)"/></radialGradient><linearGradient id="ca-doubt-smoke" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(262, 62%, 34%, 0.56)"/><stop offset="50%" stop-color="hsla(256, 54%, 22%, 0.10)"/><stop offset="100%" stop-color="hsla(262, 62%, 34%, 0.56)"/></linearGradient>`
  ),
  regret: wrapArtSvg(
    'regret',
    'hsl(262, 38%, 16%)',
    'hsl(236, 44%, 7%)',
    `<ellipse cx="64" cy="60" rx="50" ry="14" fill="hsla(266, 76%, 40%, 0.24)"/>
     <circle cx="50" cy="30" r="24" fill="hsla(272, 82%, 54%, 0.16)"/>
     <path d="M62 66 Q72 48 86 38 Q94 34 98 38" fill="none" stroke="hsl(264, 28%, 22%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M32 30 C30 14 42 8 54 10 C66 12 72 22 69 36 L64 46 L59 53 L43 51 L38 43 Z" fill="url(#ca-regret-skull)" stroke="hsl(252, 34%, 18%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M38 18 Q48 12 60 17" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.8" opacity="0.62" stroke-linecap="round"/>
     <path d="M39 29 Q44 26 48 31 Q44 36 39 33 Z" fill="hsl(252, 52%, 10%)"/>
     <path d="M54 31 Q59 27 64 31 Q62 36 55 35 Z" fill="hsl(252, 52%, 10%)"/>
     <polygon points="51,37 54,42 48,42" fill="hsl(252, 52%, 10%)"/>
     <path d="M44 47 V52 M49 47 V53 M54 48 V53 M58 48 V52" stroke="hsl(252, 42%, 16%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M42 33 Q40 46 37 57 M59 34 Q58 47 61 58" fill="none" stroke="url(#ca-regret-tear)" stroke-width="2.3" stroke-linecap="round"/>
     <path d="M36 59 Q33 64 36 67 Q39 64 36 59 Z" fill="url(#ca-regret-tear)"/>
     <path d="M62 59 Q59 64 62 67 Q65 64 62 59 Z" fill="url(#ca-regret-tear)"/>
     <path d="M84 36 C82 26 95 22 103 30 C108 37 104 48 94 47 C86 46 84 42 84 36 Z" fill="url(#ca-regret-rose)" stroke="hsl(342, 44%, 52%)" stroke-width="1.1"/>
     <path d="M89 35 Q94 30 99 35 Q96 42 90 40" fill="none" stroke="hsl(346, 56%, 62%)" stroke-width="1.2"/>
     <path d="M80 56 Q85 52 89 56 Q85 60 80 56 Z" fill="hsl(340, 44%, 38%)"/>
     <path d="M96 58 Q101 54 106 58 Q101 62 96 58 Z" fill="hsl(340, 44%, 32%)"/>`,
    'hsla(276, 82%, 60%, 0.26)',
    `<linearGradient id="ca-regret-skull" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(246, 26%, 86%)"/><stop offset="56%" stop-color="hsl(250, 22%, 52%)"/><stop offset="100%" stop-color="hsl(256, 30%, 22%)"/></linearGradient><linearGradient id="ca-regret-rose" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(344, 48%, 46%)"/><stop offset="55%" stop-color="hsl(24, 38%, 26%)"/><stop offset="100%" stop-color="hsl(260, 32%, 14%)"/></linearGradient><linearGradient id="ca-regret-tear" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(276, 100%, 84%)"/><stop offset="100%" stop-color="hsl(254, 92%, 52%)"/></linearGradient>`
  ),
  parasite: wrapArtSvg(
    'parasite',
    'hsl(326, 48%, 15%)',
    'hsl(272, 46%, 7%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-parasite-slime)"/>
     <path d="M6 16 Q22 28 34 26 M122 54 Q104 48 92 54 M12 62 Q28 54 40 58" fill="none" stroke="hsla(328, 76%, 34%, 0.48)" stroke-width="2" stroke-linecap="round"/>
     <path d="M36 16 C18 24 18 52 40 62 C52 67 74 66 88 58 C108 46 106 20 84 14 C72 10 52 10 36 16 Z" fill="hsl(282, 48%, 11%)" stroke="hsl(32, 22%, 34%)" stroke-width="1.3"/>
     <path d="M36 17 C20 26 22 50 42 60 L49 54 C35 46 33 30 45 23 Z" fill="url(#ca-parasite-bone)" stroke="hsl(24, 26%, 18%)" stroke-width="1.1"/>
     <path d="M88 15 C106 24 106 48 86 58 L79 52 C92 44 93 29 80 21 Z" fill="url(#ca-parasite-bone)" stroke="hsl(24, 26%, 18%)" stroke-width="1.1"/>
     <path d="M27 36 L36 39 M98 35 L90 38" stroke="hsl(276, 48%, 10%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M34 52 C46 60 66 56 64 42 C62 28 42 36 46 24 C50 13 76 14 86 24" fill="none" stroke="hsl(284, 56%, 12%)" stroke-width="12" stroke-linecap="round"/>
     <path d="M34 52 C46 60 66 56 64 42 C62 28 42 36 46 24 C50 13 76 14 86 24" fill="none" stroke="url(#ca-parasite-worm)" stroke-width="9" stroke-linecap="round"/>
     <path d="M40 55 L44 48 M52 57 L53 49 M61 48 L67 44 M54 35 L58 29 M46 24 L53 26 M61 16 L63 23 M74 16 L73 23" stroke="hsl(284, 56%, 14%)" stroke-width="1.7" stroke-linecap="round"/>
     <path d="M37 49 C47 55 61 52 60 42 M49 21 C56 15 73 16 82 22" fill="none" stroke="hsla(342, 100%, 78%, 0.64)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="88" cy="26" r="6.5" fill="hsl(334, 82%, 22%)" stroke="hsl(338, 92%, 62%)" stroke-width="1.3"/>
     <path d="M84 22 L87 25 M92 22 L89 25 M84 30 L87 27 M92 30 L89 27" stroke="hsl(44, 62%, 90%)" stroke-width="1.3" stroke-linecap="round"/>
     <path d="M84 32 Q98 34 112 28 M34 52 Q22 50 14 44" fill="none" stroke="hsl(332, 86%, 54%)" stroke-width="1.9" stroke-linecap="round"/>
     <polygon points="62,60 70,58 67,65" fill="url(#ca-parasite-bone)"/>
     <circle cx="102" cy="18" r="1.8" fill="hsl(334, 96%, 64%)"/>
     <circle cx="24" cy="24" r="1.6" fill="hsl(304, 92%, 66%)"/>`,
    'hsla(332, 88%, 48%, 0.28)',
    `<radialGradient id="ca-parasite-slime" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(332, 92%, 48%, 0.36)"/><stop offset="62%" stop-color="hsla(294, 78%, 32%, 0.16)"/><stop offset="100%" stop-color="hsla(274, 62%, 12%, 0)"/></radialGradient><linearGradient id="ca-parasite-bone" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(40, 34%, 84%)"/><stop offset="56%" stop-color="hsl(32, 22%, 48%)"/><stop offset="100%" stop-color="hsl(24, 24%, 20%)"/></linearGradient><linearGradient id="ca-parasite-worm" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(338, 86%, 54%)"/><stop offset="50%" stop-color="hsl(304, 68%, 30%)"/><stop offset="100%" stop-color="hsl(276, 58%, 13%)"/></linearGradient>`
  ),
  steadfast_guard: wrapArtSvg(
    'steadfast_guard',
    'hsl(212, 46%, 18%)',
    'hsl(26, 36%, 9%)',
    `<path d="M18 68 L38 46 H90 L110 68 Z" fill="url(#ca-steadfast_guard-stone)" stroke="hsl(36, 34%, 48%)" stroke-width="1.3"/>
     <path d="M28 66 L44 50 H84 L100 66" fill="none" stroke="hsl(34, 26%, 22%)" stroke-width="1.5"/>
     <path d="M10 36 Q64 4 118 36" fill="none" stroke="hsla(202, 94%, 72%, 0.34)" stroke-width="2.4" stroke-dasharray="10 5"/>
     <path d="M40 12 H88 V37 C88 49 77 57 64 62 C51 57 40 49 40 37 Z" fill="rgba(0,0,0,0.45)" transform="translate(2 2)"/>
     <path d="M40 11 H88 V36 C88 48 77 56 64 61 C51 56 40 48 40 36 Z" fill="url(#ca-steadfast_guard-shield)" stroke="hsl(44, 88%, 70%)" stroke-width="2"/>
     <path d="M46 17 H82 V35 C82 44 74 50 64 54 C54 50 46 44 46 35 Z" fill="hsl(216, 36%, 20%)" stroke="hsl(200, 86%, 72%)" stroke-width="1.2"/>
     <path d="M64 17 V53 M47 32 H81" stroke="hsl(200, 92%, 78%)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="64,23 72,32 64,41 56,32" fill="hsl(46, 98%, 72%)" stroke="hsl(24, 48%, 22%)" stroke-width="1.3"/>
     <circle cx="48" cy="19" r="1.6" fill="hsl(46, 96%, 78%)"/><circle cx="80" cy="19" r="1.6" fill="hsl(46, 96%, 78%)"/>
     <path d="M18 36 H34 M94 36 H110 M24 26 L34 29 M104 26 L94 29" stroke="hsl(44, 96%, 72%)" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
     <circle cx="24" cy="54" r="2" fill="hsl(44, 92%, 72%)"/><circle cx="104" cy="54" r="2" fill="hsl(44, 92%, 72%)"/>`,
    'hsla(204, 90%, 58%, 0.26)',
    `<linearGradient id="ca-steadfast_guard-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(30, 18%, 38%)"/><stop offset="100%" stop-color="hsl(24, 24%, 14%)"/></linearGradient><linearGradient id="ca-steadfast_guard-shield" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(210, 38%, 48%)"/><stop offset="55%" stop-color="hsl(216, 40%, 26%)"/><stop offset="100%" stop-color="hsl(222, 42%, 15%)"/></linearGradient>`
  ),
  wild_strike: wrapArtSvg(
    'wild_strike',
    'hsl(4, 68%, 19%)',
    'hsl(350, 58%, 8%)',
    `<path d="M8 62 Q44 14 118 10" fill="none" stroke="url(#ca-wild_strike-arc)" stroke-width="7.5" stroke-linecap="round" opacity="0.72"/>
     <path d="M16 66 Q60 28 122 22" fill="none" stroke="hsl(354, 96%, 54%)" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
     <path d="M22 57 L74 11 L90 21 L42 63 Z" fill="rgba(0,0,0,0.45)" transform="translate(2 2)"/>
     <path d="M22 56 L74 10 L89 20 L41 62 L39 51 L48 44 L36 41 Z" fill="url(#ca-wild_strike-blade)" stroke="hsl(6, 82%, 44%)" stroke-width="1.6"/>
     <path d="M35 50 L77 16" stroke="hsl(50, 100%, 92%)" stroke-width="1.5" stroke-linecap="round"/>
     <rect x="16" y="48" width="18" height="5" rx="1.6" transform="rotate(-34 25 50)" fill="hsl(42, 92%, 62%)" stroke="hsl(14, 58%, 22%)" stroke-width="1.1"/>
     <path d="M62 24 L98 20 L80 39 L112 42 L82 58" fill="none" stroke="hsl(44, 100%, 74%)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
     <polygon points="102,12 114,20 100,26" fill="hsl(354, 96%, 58%)" stroke="hsl(44, 100%, 78%)" stroke-width="1"/>
     <polygon points="20,18 34,24 22,34" fill="hsl(354, 94%, 54%)" stroke="hsl(16, 100%, 72%)" stroke-width="1"/>
     <polygon points="94,54 108,58 96,66" fill="hsl(354, 92%, 52%)"/>
     <circle cx="94" cy="14" r="2.4" fill="hsl(50, 100%, 86%)"/><circle cx="114" cy="36" r="2" fill="hsl(28, 100%, 70%)"/>`,
    'hsla(10, 98%, 54%, 0.30)',
    `<linearGradient id="ca-wild_strike-blade" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(26, 26%, 56%)"/><stop offset="55%" stop-color="hsl(38, 34%, 86%)"/><stop offset="100%" stop-color="hsl(48, 100%, 94%)"/></linearGradient><linearGradient id="ca-wild_strike-arc" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsla(4, 96%, 52%, 0.2)"/><stop offset="50%" stop-color="hsl(18, 100%, 60%)"/><stop offset="100%" stop-color="hsl(48, 100%, 82%)"/></linearGradient>`
  ),
  ambush_slash: wrapArtSvg(
    'ambush_slash',
    'hsl(356, 60%, 17%)',
    'hsl(232, 48%, 8%)',
    `<path d="M0 64 L48 44 L76 54 L128 38 V72 H0 Z" fill="hsl(236, 46%, 8%)" opacity="0.82"/>
     <circle cx="102" cy="18" r="30" fill="url(#ca-ambush_slash-flash)"/>
     <path d="M8 58 Q50 42 114 14" fill="none" stroke="url(#ca-ambush_slash-beam)" stroke-width="6.5" stroke-linecap="round"/>
     <path d="M16 64 Q60 48 120 26" fill="none" stroke="hsl(8, 96%, 58%)" stroke-width="2.6" stroke-linecap="round" opacity="0.84"/>
     <path d="M12 57 Q52 42 112 15" fill="none" stroke="hsl(54, 100%, 96%)" stroke-width="2" stroke-linecap="round"/>
     <polygon points="90,10 119,14 96,34 101,20" fill="hsl(48, 100%, 88%)" stroke="hsl(28, 96%, 56%)" stroke-width="1.3"/>
     <path d="M28 12 L33 24 L45 27 L33 30 L28 42 L23 30 L11 27 L23 24 Z" fill="hsl(46, 100%, 78%)" stroke="hsl(32, 92%, 52%)" stroke-width="1"/>
     <circle cx="28" cy="27" r="3.2" fill="hsl(54, 100%, 96%)"/>
     <path d="M56 14 L59 20 L65 22 L59 24 L56 30 L53 24 L47 22 L53 20 Z" fill="hsl(44, 100%, 82%)" opacity="0.85"/>
     <path d="M74 44 L98 38 M66 56 L92 50" stroke="hsl(42, 100%, 76%)" stroke-width="1.6" stroke-linecap="round" opacity="0.72"/>
     <circle cx="84" cy="14" r="2" fill="hsl(50, 100%, 90%)"/><circle cx="114" cy="40" r="1.8" fill="hsl(14, 100%, 66%)"/>`,
    'hsla(38, 98%, 60%, 0.28)',
    `<linearGradient id="ca-ambush_slash-beam" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsla(356, 94%, 54%, 0.1)"/><stop offset="45%" stop-color="hsl(38, 100%, 70%)"/><stop offset="100%" stop-color="hsl(52, 100%, 94%)"/></linearGradient><radialGradient id="ca-ambush_slash-flash" cx="82%" cy="22%" r="36%"><stop offset="0%" stop-color="hsla(48, 100%, 88%, 0.65)"/><stop offset="55%" stop-color="hsla(24, 98%, 58%, 0.22)"/><stop offset="100%" stop-color="hsla(24, 98%, 58%, 0)"/></radialGradient>`
  ),
  power_through: wrapArtSvg(
    'power_through',
    'hsl(208, 50%, 18%)',
    'hsl(354, 52%, 9%)',
    `<path d="M22 62 Q64 4 106 62" fill="none" stroke="hsla(198, 96%, 72%, 0.36)" stroke-width="4" stroke-linecap="round"/>
     <path d="M40 14 Q64 7 88 14 L84 56 Q64 65 44 56 Z" fill="rgba(0,0,0,0.48)" transform="translate(2 2)"/>
     <path d="M40 13 Q64 6 88 13 L84 55 Q64 64 44 55 Z" fill="url(#ca-power_through-shield)" stroke="hsl(44, 92%, 72%)" stroke-width="2"/>
     <path d="M46 18 Q64 13 82 18 L79 51 Q64 58 49 51 Z" fill="hsl(216, 42%, 20%)" stroke="hsl(198, 92%, 74%)" stroke-width="1.2"/>
     <path d="M64 16 V55 M48 34 H80" stroke="hsl(196, 98%, 80%)" stroke-width="2.4" stroke-linecap="round"/>
     <circle cx="64" cy="34" r="5" fill="hsl(46, 100%, 76%)" stroke="hsl(214, 46%, 18%)" stroke-width="1.4"/>
     <polygon points="10,24 41,34 16,44 24,34" fill="url(#ca-power_through-barb)" stroke="hsl(40, 96%, 74%)" stroke-width="1.1"/>
     <polygon points="118,24 87,34 112,44 104,34" fill="url(#ca-power_through-barb)" stroke="hsl(40, 96%, 74%)" stroke-width="1.1"/>
     <path d="M36 24 L43 34 L35 46 M92 24 L85 34 L93 46" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M22 14 L34 22 M106 14 L94 22 M20 56 L34 48 M108 56 L94 48" stroke="hsl(356, 94%, 62%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="38" cy="18" r="2" fill="hsl(50, 100%, 86%)"/><circle cx="90" cy="18" r="2" fill="hsl(50, 100%, 86%)"/>`,
    'hsla(202, 92%, 60%, 0.28)',
    `<linearGradient id="ca-power_through-shield" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(206, 48%, 50%)"/><stop offset="55%" stop-color="hsl(214, 46%, 28%)"/><stop offset="100%" stop-color="hsl(222, 46%, 14%)"/></linearGradient><linearGradient id="ca-power_through-barb" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(354, 88%, 36%)"/><stop offset="100%" stop-color="hsl(14, 100%, 64%)"/></linearGradient>`
  ),
  tactician: wrapArtSvg(
    'tactician',
    'hsl(184, 48%, 14%)',
    'hsl(224, 52%, 7%)',
    `<path d="M36 0 L92 0 L114 48 L14 48 Z" fill="rgba(130,255,195,0.06)"/>
     <polygon points="10,48 118,48 126,68 2,68" fill="url(#ca-tactician-board)" stroke="hsl(166, 62%, 44%)" stroke-width="1.1"/>
     <polygon points="28,48 52,48 48,58 20,58" fill="rgba(130,255,200,0.16)"/>
     <polygon points="76,48 100,48 106,58 80,58" fill="rgba(130,255,200,0.16)"/>
     <polygon points="48,58 80,58 84,68 44,68" fill="rgba(130,255,200,0.18)"/>
     <path d="M18 56 L36 52 L39 58 L22 62 Z" fill="hsl(206, 28%, 22%)" stroke="hsl(176, 36%, 44%)" stroke-width="0.9"/>
     <path d="M48 58 L54 50 C52 38, 54 24, 62 18 L72 22 L68 28 L76 34 L69 40 C69 46, 72 52, 76 58 Z" fill="url(#ca-tactician-piece)" stroke="hsl(48, 96%, 76%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M58 24 L65 21 L63 29" fill="none" stroke="hsl(52, 100%, 88%)" stroke-width="1.3" stroke-linecap="round"/>
     <path d="M30 50 Q52 24 88 26" fill="none" stroke="hsl(48, 98%, 72%)" stroke-width="1.6" stroke-dasharray="3 2.5" stroke-linecap="round"/>
     <circle cx="94" cy="24" r="14" fill="url(#ca-tactician-energy)"/>
     <circle cx="94" cy="24" r="6" fill="hsl(136, 100%, 72%)" stroke="hsl(54, 100%, 88%)" stroke-width="1.2"/>
     <path d="M116 12 Q102 12 96 18 M118 22 Q106 20 100 24" fill="none" stroke="hsl(166, 48%, 38%)" stroke-width="2.4" stroke-linecap="round"/>
     <polygon points="94,14 96,21 103,24 96,27 94,34 92,27 85,24 92,21" fill="hsl(58, 100%, 90%)"/>`,
    'hsla(148, 92%, 54%, 0.25)',
    `<linearGradient id="ca-tactician-board" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(188, 40%, 22%)"/><stop offset="100%" stop-color="hsl(220, 48%, 9%)"/></linearGradient><linearGradient id="ca-tactician-piece" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 96%, 76%)"/><stop offset="48%" stop-color="hsl(154, 78%, 48%)"/><stop offset="100%" stop-color="hsl(184, 62%, 18%)"/></linearGradient><radialGradient id="ca-tactician-energy" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(64, 100%, 88%)"/><stop offset="48%" stop-color="hsl(136, 98%, 56%)"/><stop offset="100%" stop-color="hsl(158, 92%, 36%)" stop-opacity="0"/></radialGradient>`
  ),
  reflex: wrapArtSvg(
    'reflex',
    'hsl(178, 56%, 15%)',
    'hsl(214, 54%, 8%)',
    `<path d="M6 22 H56 M2 34 H50 M10 44 H54" fill="none" stroke="hsl(172, 96%, 66%)" stroke-width="1.3" stroke-linecap="round" opacity="0.45"/>
     <polygon points="8,28 56,31 66,34 56,37 8,34 16,31" fill="url(#ca-reflex-blade)" stroke="hsl(210, 44%, 18%)" stroke-width="0.8"/>
     <circle cx="62" cy="34" r="14" fill="none" stroke="hsl(160, 100%, 74%)" stroke-width="2" opacity="0.65"/>
     <circle cx="62" cy="34" r="8" fill="none" stroke="hsl(54, 100%, 84%)" stroke-width="1.4"/>
     <path d="M74 68 L69 50 L54 39 L58 35 L68 41 L57 27 L63 24 L74 37 L77 32 L82 37 L84 52 L92 68 Z" fill="url(#ca-reflex-hand)" stroke="hsl(162, 88%, 68%)" stroke-width="1.1" stroke-linejoin="round"/>
     <path d="M46 8 L58 20 L52 24 L64 34" fill="none" stroke="url(#ca-reflex-bolt)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M78 52 L92 42 L88 50 L108 38" fill="none" stroke="url(#ca-reflex-bolt)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M84 19 Q98 9 116 17 Q100 25 84 19 Z" fill="hsl(164, 100%, 82%)" stroke="hsl(176, 86%, 56%)" stroke-width="1"/>
     <circle cx="100" cy="17.5" r="2.6" fill="hsl(188, 76%, 12%)"/>
     <circle cx="101" cy="16.5" r="1" fill="hsl(58, 100%, 94%)"/>
     <g transform="translate(106,54) rotate(14)"><rect x="-6" y="-8" width="12" height="16" rx="1.6" fill="hsl(174, 48%, 22%)" stroke="hsl(152, 92%, 64%)" stroke-width="1"/></g>
     <g transform="translate(115,50) rotate(24)"><rect x="-6" y="-8" width="12" height="16" rx="1.6" fill="hsl(174, 48%, 26%)" stroke="hsl(152, 96%, 72%)" stroke-width="1"/></g>
     <circle cx="62" cy="34" r="2.5" fill="hsl(56, 100%, 92%)"/>`,
    'hsla(162, 98%, 62%, 0.28)',
    `<linearGradient id="ca-reflex-bolt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(56, 100%, 88%)"/><stop offset="50%" stop-color="hsl(156, 100%, 66%)"/><stop offset="100%" stop-color="hsl(178, 96%, 56%)"/></linearGradient><linearGradient id="ca-reflex-blade" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(206, 26%, 36%)"/><stop offset="65%" stop-color="hsl(192, 36%, 86%)"/><stop offset="100%" stop-color="hsl(354, 90%, 64%)"/></linearGradient><linearGradient id="ca-reflex-hand" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(188, 44%, 14%)"/><stop offset="65%" stop-color="hsl(168, 44%, 32%)"/><stop offset="100%" stop-color="hsl(154, 62%, 50%)"/></linearGradient>`
  ),
  escape_plan: wrapArtSvg(
    'escape_plan',
    'hsl(194, 48%, 15%)',
    'hsl(226, 52%, 8%)',
    `<path d="M78 44 V20 C78 8, 108 8, 108 20 V44 Z" fill="url(#ca-escape_plan-moon)" stroke="hsl(186, 54%, 56%)" stroke-width="1.1"/>
     <polygon points="78,20 108,20 62,72 16,72" fill="rgba(150,245,235,0.08)"/>
     <circle cx="96" cy="20" r="6" fill="hsl(176, 94%, 88%)" opacity="0.88"/>
     <path d="M0 0 H74 V46 L128 46 V72 H0 Z" fill="rgba(6,14,24,0.34)"/>
     <path d="M36 52 L92 18" fill="none" stroke="hsl(40, 56%, 68%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M84 19 L94 17 L99 10 M94 17 L102 22 L95 26 M94 17 L88 11" fill="none" stroke="url(#ca-escape_plan-hook)" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M16 58 L30 34 L48 38 L42 62 Z" fill="hsl(168, 52%, 22%)" stroke="hsl(160, 82%, 58%)" stroke-width="1"/>
     <circle cx="24" cy="54" r="16" fill="url(#ca-escape_plan-smoke)"/>
     <circle cx="48" cy="58" r="18" fill="url(#ca-escape_plan-smoke)"/>
     <circle cx="68" cy="54" r="13" fill="url(#ca-escape_plan-smoke)" opacity="0.88"/>
     <path d="M12 50 C20 38, 42 40, 54 48 C64 42, 76 48, 78 58" fill="none" stroke="hsl(168, 92%, 74%)" stroke-width="1.5" stroke-linecap="round" opacity="0.72"/>
     <polygon points="94,13 96,17 100,18 96,19 94,23 92,19 88,18 92,17" fill="hsl(52, 100%, 88%)"/>
     <circle cx="62" cy="36" r="1.9" fill="hsl(168, 100%, 82%)"/>`,
    'hsla(170, 88%, 60%, 0.25)',
    `<linearGradient id="ca-escape_plan-moon" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="hsl(178, 92%, 82%)"/><stop offset="60%" stop-color="hsl(188, 74%, 44%)" stop-opacity="0.55"/><stop offset="100%" stop-color="hsl(214, 62%, 16%)" stop-opacity="0"/></linearGradient><radialGradient id="ca-escape_plan-smoke" cx="44%" cy="46%" r="56%"><stop offset="0%" stop-color="hsl(164, 56%, 58%)"/><stop offset="55%" stop-color="hsl(176, 48%, 30%)"/><stop offset="100%" stop-color="hsl(206, 52%, 12%)" stop-opacity="0.2"/></radialGradient><linearGradient id="ca-escape_plan-hook" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(190, 38%, 88%)"/><stop offset="100%" stop-color="hsl(208, 32%, 36%)"/></linearGradient>`
  ),
  concentrate: wrapArtSvg(
    'concentrate',
    'hsl(176, 52%, 14%)',
    'hsl(226, 54%, 7%)',
    `<circle cx="64" cy="39" r="32" fill="none" stroke="url(#ca-concentrate-ring)" stroke-width="1.1" opacity="0.34"/>
     <circle cx="64" cy="39" r="22" fill="none" stroke="url(#ca-concentrate-ring)" stroke-width="1.4" stroke-dasharray="6 4" opacity="0.58"/>
     <path d="M36 68 Q40 24 64 12 Q88 24 92 68 Z" fill="url(#ca-concentrate-hood)" stroke="hsl(162, 74%, 48%)" stroke-width="1.2"/>
     <path d="M52 24 Q64 15 76 24 Q72 34 64 35 Q56 34 52 24 Z" fill="hsl(214, 52%, 9%)" stroke="hsl(156, 80%, 58%)" stroke-width="0.9"/>
     <circle cx="64" cy="42" r="20" fill="url(#ca-concentrate-core)"/>
     <circle cx="64" cy="42" r="7.2" fill="hsl(66, 100%, 92%)" stroke="hsl(142, 100%, 66%)" stroke-width="1.4"/>
     <path d="M46 44 Q54 50 60 46 M82 44 Q74 50 68 46" fill="none" stroke="hsl(158, 76%, 62%)" stroke-width="2.4" stroke-linecap="round"/>
     <g transform="translate(20,26) rotate(-24)"><rect x="-6" y="-9" width="12" height="18" rx="1.6" fill="hsl(188, 42%, 18%)" stroke="hsl(156, 86%, 60%)" stroke-width="1" opacity="0.72"/></g>
     <g transform="translate(108,26) rotate(24)"><rect x="-6" y="-9" width="12" height="18" rx="1.6" fill="hsl(188, 42%, 18%)" stroke="hsl(156, 86%, 60%)" stroke-width="1" opacity="0.72"/></g>
     <g transform="translate(24,52) rotate(-14)"><rect x="-5" y="-8" width="10" height="16" rx="1.6" fill="hsl(188, 42%, 16%)" stroke="hsl(156, 86%, 56%)" stroke-width="0.9" opacity="0.58"/></g>
     <path d="M26 28 L52 40 M102 28 L76 40 M30 50 L54 44 M98 50 L74 44" fill="none" stroke="hsl(148, 100%, 74%)" stroke-width="1.4" stroke-linecap="round" opacity="0.76"/>
     <polygon points="64,30 66,40 76,42 66,44 64,54 62,44 52,42 62,40" fill="hsl(62, 100%, 92%)"/>
     <circle cx="64" cy="8" r="2" fill="hsl(148, 100%, 78%)"/>`,
    'hsla(146, 98%, 58%, 0.30)',
    `<radialGradient id="ca-concentrate-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(62, 100%, 94%)"/><stop offset="38%" stop-color="hsl(142, 100%, 64%)"/><stop offset="72%" stop-color="hsl(164, 94%, 40%)" stop-opacity="0.52"/><stop offset="100%" stop-color="hsl(188, 88%, 22%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-concentrate-hood" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(172, 46%, 24%)"/><stop offset="65%" stop-color="hsl(196, 48%, 13%)"/><stop offset="100%" stop-color="hsl(226, 52%, 7%)"/></linearGradient><linearGradient id="ca-concentrate-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(152, 100%, 74%)"/><stop offset="100%" stop-color="hsl(180, 92%, 52%)"/></linearGradient>`
  ),
  perseverance: wrapArtSvg(
    'perseverance',
    'hsl(232, 50%, 19%)',
    'hsl(272, 50%, 10%)',
    `<path d="M6 12 L42 26 M4 28 L38 40 M8 44 L36 54 M90 14 L124 26 M92 34 L124 44" stroke="hsla(204, 84%, 74%, 0.42)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M0 62 L24 56 L104 56 L128 62 V72 H0 Z" fill="hsla(248, 46%, 10%, 0.86)"/>
     <polygon points="44,64 49,18 64,9 79,18 84,64" fill="url(#ca-perseverance-stone)" stroke="hsl(46, 94%, 72%)" stroke-width="1.7" stroke-linejoin="round"/>
     <polygon points="49,18 64,9 64,64 44,64" fill="hsla(0, 0%, 100%, 0.08)"/>
     <path d="M47 29 H81 M46 41 H82 M45 53 H83" stroke="url(#ca-perseverance-gold)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M64 17 Q70 24 64 33 Q58 24 64 17 Z" fill="hsl(48, 100%, 86%)" stroke="hsl(32, 74%, 36%)" stroke-width="0.9"/>
     <path d="M42 22 C36 32 36 46 42 56" fill="none" stroke="hsl(190, 100%, 80%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M86 22 C92 32 92 46 86 56" fill="none" stroke="hsl(190, 100%, 80%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M36 28 L26 22 M36 40 L24 44 M38 50 L28 56" stroke="hsl(48, 100%, 84%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="64" cy="24" r="2.2" fill="hsl(0, 0%, 100%)"/>
     <circle cx="96" cy="24" r="1.8" fill="hsl(48, 100%, 86%)"/>
     <circle cx="102" cy="50" r="1.6" fill="hsl(190, 100%, 82%)"/>
     <circle cx="24" cy="16" r="1.5" fill="hsl(192, 100%, 84%)"/>`,
    'hsla(42, 94%, 60%, 0.28)',
    `<linearGradient id="ca-perseverance-stone" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(262, 34%, 38%)"/><stop offset="55%" stop-color="hsl(248, 38%, 22%)"/><stop offset="100%" stop-color="hsl(244, 44%, 11%)"/></linearGradient><linearGradient id="ca-perseverance-gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(48, 100%, 86%)"/><stop offset="50%" stop-color="hsl(42, 94%, 58%)"/><stop offset="100%" stop-color="hsl(192, 98%, 66%)"/></linearGradient>`
  ),
  reckless_charge: wrapArtSvg(
    'reckless_charge',
    'hsl(10, 68%, 19%)',
    'hsl(240, 42%, 8%)',
    `<path d="M8 22 H84 M6 36 H94 M12 50 H84 M18 60 H70" stroke="url(#ca-reckless_charge-wake)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M52 10 L114 36 L52 62 Q68 36 52 10 Z" fill="hsla(26, 100%, 60%, 0.28)"/>
     <polygon points="34,16 106,36 34,56 56,36" fill="rgba(0,0,0,0.45)" transform="translate(2 2)"/>
     <polygon points="34,15 106,36 34,57 56,36" fill="url(#ca-reckless_charge-wedge)" stroke="hsl(8, 84%, 44%)" stroke-width="1.8"/>
     <polygon points="56,26 96,36 56,46 66,36" fill="hsl(50, 100%, 88%)"/>
     <path d="M106 36 L120 22 M106 36 L122 36 M106 36 L120 50" stroke="hsl(50, 100%, 88%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M18 14 Q26 8 34 14 Q28 20 22 16" fill="none" stroke="hsl(206, 94%, 78%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M18 52 L20 57 L25 58 L20 59 L18 64 L16 59 L11 58 L16 57 Z" fill="hsl(206, 96%, 82%)"/>
     <path d="M36 6 L38 11 L43 12 L38 13 L36 18 L34 13 L29 12 L34 11 Z" fill="hsl(210, 94%, 80%)"/>
     <circle cx="96" cy="18" r="2.2" fill="hsl(48, 100%, 84%)"/><circle cx="96" cy="54" r="2.2" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(20, 98%, 56%, 0.30)',
    `<linearGradient id="ca-reckless_charge-wedge" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsl(8, 86%, 40%)"/><stop offset="55%" stop-color="hsl(32, 98%, 62%)"/><stop offset="100%" stop-color="hsl(52, 100%, 88%)"/></linearGradient><linearGradient id="ca-reckless_charge-wake" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsla(14, 98%, 52%, 0.05)"/><stop offset="70%" stop-color="hsla(28, 100%, 62%, 0.72)"/><stop offset="100%" stop-color="hsl(48, 100%, 86%)"/></linearGradient>`
  ),
  sentinel: wrapArtSvg(
    'sentinel',
    'hsl(210, 50%, 18%)',
    'hsl(280, 48%, 9%)',
    `<path d="M22 64 Q30 34 40 44 M106 64 Q98 34 88 44" fill="none" stroke="hsl(288, 92%, 68%)" stroke-width="3" stroke-linecap="round" opacity="0.72"/>
     <path d="M14 54 Q26 18 38 30 M114 54 Q102 18 90 30" fill="none" stroke="hsla(286, 94%, 72%, 0.45)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="64" cy="36" r="28" fill="none" stroke="hsla(196, 96%, 72%, 0.35)" stroke-width="1.6" stroke-dasharray="8 4"/>
     <path d="M64 10 L90 21 V40 C90 52 78 60 64 64 C50 60 38 52 38 40 V21 Z" fill="rgba(0,0,0,0.45)" transform="translate(2 2)"/>
     <path d="M64 9 L89 20 V39 C89 51 77 59 64 63 C51 59 39 51 39 39 V20 Z" fill="url(#ca-sentinel-shield)" stroke="hsl(46, 94%, 72%)" stroke-width="2"/>
     <path d="M64 15 L83 24 V38 C83 47 74 53 64 57 C54 53 45 47 45 38 V24 Z" fill="hsl(224, 46%, 18%)" stroke="hsl(196, 88%, 70%)" stroke-width="1.2"/>
     <polygon points="64,19 75,36 64,53 53,36" fill="url(#ca-sentinel-gem)" stroke="hsl(48, 100%, 84%)" stroke-width="1.5"/>
     <polygon points="64,26 69,36 64,46 59,36" fill="hsl(190, 100%, 94%)" opacity="0.85"/>
     <path d="M22 14 L25 20 L31 22 L25 24 L22 30 L19 24 L13 22 L19 20 Z" fill="hsl(48, 100%, 78%)"/>
     <path d="M106 14 L109 20 L115 22 L109 24 L106 30 L103 24 L97 22 L103 20 Z" fill="hsl(48, 100%, 78%)"/>
     <circle cx="28" cy="56" r="2" fill="hsl(292, 96%, 76%)"/><circle cx="100" cy="56" r="2" fill="hsl(292, 96%, 76%)"/>`,
    'hsla(202, 92%, 62%, 0.28)',
    `<linearGradient id="ca-sentinel-shield" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(212, 48%, 48%)"/><stop offset="55%" stop-color="hsl(220, 48%, 26%)"/><stop offset="100%" stop-color="hsl(268, 46%, 16%)"/></linearGradient><radialGradient id="ca-sentinel-gem" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="hsl(188, 100%, 94%)"/><stop offset="48%" stop-color="hsl(194, 98%, 62%)"/><stop offset="100%" stop-color="hsl(216, 86%, 34%)"/></radialGradient>`
  ),
  outmaneuver: wrapArtSvg(
    'outmaneuver',
    'hsl(186, 48%, 15%)',
    'hsl(220, 50%, 8%)',
    `<circle cx="102" cy="16" r="10" fill="hsl(172, 68%, 82%)" opacity="0.16"/>
     <path d="M96 9 A8 8 0 1 0 108 21 A6.5 6.5 0 1 1 96 9 Z" fill="hsl(166, 86%, 84%)" opacity="0.82"/>
     <polygon points="0,36 42,34 52,48 44,72 0,72" fill="url(#ca-outmaneuver-ledge)" stroke="hsl(176, 42%, 42%)" stroke-width="1.1"/>
     <path d="M48 66 L54 44 L64 40 L74 44 L76 66 Z" fill="hsl(214, 34%, 13%)" stroke="hsl(204, 30%, 28%)" stroke-width="0.9"/>
     <path d="M58 40 L63 32 L69 39 Z" fill="hsl(214, 34%, 15%)" stroke="hsl(204, 30%, 28%)" stroke-width="0.8"/>
     <path d="M12 35 L20 20 L30 12 L38 19 L34 27 L38 35 L26 32 L18 36 Z" fill="url(#ca-outmaneuver-cloak)" stroke="hsl(152, 88%, 62%)" stroke-width="1.1" stroke-linejoin="round"/>
     <path d="M22 18 Q10 15 4 23 Q12 24 20 25 Z" fill="hsl(154, 72%, 46%)"/>
     <path d="M36 20 C62 4, 98 16, 106 48" fill="none" stroke="url(#ca-outmaneuver-arc)" stroke-width="3.6" stroke-linecap="round"/>
     <polygon points="106,56 97,44 106,47 115,43" fill="hsl(50, 100%, 78%)"/>
     <path d="M44 25 C66 14, 90 24, 98 46" fill="none" stroke="hsl(150, 100%, 82%)" stroke-width="1.3" stroke-dasharray="4 3" stroke-linecap="round"/>
     <circle cx="64" cy="14" r="3.4" fill="hsl(136, 100%, 68%)" stroke="hsl(54, 100%, 88%)" stroke-width="1"/>
     <circle cx="88" cy="22" r="3.4" fill="hsl(136, 100%, 68%)" stroke="hsl(54, 100%, 88%)" stroke-width="1"/>
     <path d="M84 62 H120" fill="none" stroke="hsl(154, 86%, 58%)" stroke-width="1.4" stroke-linecap="round" opacity="0.58"/>`,
    'hsla(142, 92%, 56%, 0.25)',
    `<linearGradient id="ca-outmaneuver-ledge" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(194, 34%, 24%)"/><stop offset="100%" stop-color="hsl(220, 46%, 8%)"/></linearGradient><linearGradient id="ca-outmaneuver-arc" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsl(162, 94%, 58%)" stop-opacity="0.2"/><stop offset="55%" stop-color="hsl(142, 98%, 62%)"/><stop offset="100%" stop-color="hsl(50, 100%, 76%)"/></linearGradient><linearGradient id="ca-outmaneuver-cloak" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(156, 68%, 40%)"/><stop offset="100%" stop-color="hsl(188, 52%, 14%)"/></linearGradient>`
  ),
  all_out_attack: wrapArtSvg(
    'all_out_attack',
    'hsl(172, 46%, 14%)',
    'hsl(352, 48%, 8%)',
    `<ellipse cx="64" cy="36" rx="58" ry="30" fill="url(#ca-all_out_attack-core)"/>
     <ellipse cx="64" cy="36" rx="54" ry="18" fill="none" stroke="url(#ca-all_out_attack-vortex)" stroke-width="3.6" transform="rotate(-10 64 36)"/>
     <ellipse cx="64" cy="36" rx="44" ry="14" fill="none" stroke="hsl(354, 96%, 64%)" stroke-width="2.4" transform="rotate(14 64 36)" opacity="0.86"/>
     <ellipse cx="64" cy="36" rx="34" ry="11" fill="none" stroke="hsl(154, 100%, 80%)" stroke-width="1.8" transform="rotate(-4 64 36)"/>
     <path d="M46 61 L55 36 L48 26 L58 21 L64 10 L71 21 L80 26 L73 36 L82 61 L64 52 Z" fill="hsl(178, 52%, 17%)" stroke="hsl(154, 94%, 64%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M58 22 L64 17 L70 22 L64 26 Z" fill="hsl(216, 60%, 9%)"/>
     <polygon points="56,33 10,22 26,37" fill="url(#ca-all_out_attack-blade)"/>
     <polygon points="72,33 118,22 102,37" fill="url(#ca-all_out_attack-blade)"/>
     <polygon points="54,41 16,52 34,44" fill="hsl(354, 94%, 64%)" opacity="0.88"/>
     <polygon points="74,41 112,52 94,44" fill="hsl(154, 96%, 66%)" opacity="0.88"/>
     <g transform="translate(22,56) rotate(-28)"><rect x="-5.5" y="-7.5" width="11" height="15" rx="1.4" fill="hsl(210, 38%, 18%)" stroke="hsl(354, 88%, 62%)" stroke-width="1"/></g>
     <path d="M12 12 L28 22 M116 12 L100 22 M104 58 L118 66" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="62" cy="21" r="1.4" fill="hsl(152, 100%, 86%)"/>
     <circle cx="66" cy="21" r="1.4" fill="hsl(152, 100%, 86%)"/>
     <circle cx="116" cy="24" r="2.2" fill="hsl(50, 100%, 86%)"/>
     <circle cx="12" cy="24" r="2.2" fill="hsl(354, 100%, 72%)"/>`,
    'hsla(146, 92%, 54%, 0.28)',
    `<linearGradient id="ca-all_out_attack-vortex" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(152, 98%, 62%)"/><stop offset="50%" stop-color="hsl(176, 100%, 84%)"/><stop offset="100%" stop-color="hsl(354, 94%, 60%)"/></linearGradient><linearGradient id="ca-all_out_attack-blade" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(194, 34%, 72%)"/><stop offset="100%" stop-color="hsl(50, 100%, 88%)"/></linearGradient><radialGradient id="ca-all_out_attack-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(156, 100%, 76%)" stop-opacity="0.5"/><stop offset="60%" stop-color="hsl(354, 92%, 52%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(216, 60%, 10%)" stop-opacity="0"/></radialGradient>`
  ),
  expertise: wrapArtSvg(
    'expertise',
    'hsl(168, 44%, 14%)',
    'hsl(210, 48%, 7%)',
    `<path d="M24 0 L104 0 L120 72 L8 72 Z" fill="rgba(255,228,150,0.055)"/>
     <rect x="12" y="26" width="104" height="38" rx="5" fill="url(#ca-expertise-roll)" stroke="hsl(38, 62%, 44%)" stroke-width="1.3"/>
     <rect x="16" y="32" width="96" height="24" rx="3" fill="hsl(168, 42%, 14%)" stroke="hsl(158, 52%, 34%)" stroke-width="0.9"/>
     <rect x="21" y="18" width="9" height="26" rx="4" fill="url(#ca-expertise-vial)" stroke="hsl(146, 94%, 74%)" stroke-width="1"/>
     <path d="M40 12 L43 44 L38 44 Z M38 12 H45" fill="url(#ca-expertise-steel)" stroke="hsl(204, 34%, 26%)" stroke-width="0.7"/>
     <polygon points="56,9 61,28 58,44 54,44 51,28" fill="url(#ca-expertise-steel)" stroke="hsl(208, 38%, 22%)" stroke-width="0.8"/>
     <polygon points="73,10 79,26 75,38 71,38 67,26" fill="url(#ca-expertise-steel)" stroke="hsl(208, 38%, 22%)" stroke-width="0.8"/>
     <circle cx="73" cy="43" r="3.4" fill="none" stroke="hsl(46, 92%, 68%)" stroke-width="1.4"/>
     <circle cx="90" cy="30" r="7.5" fill="hsl(188, 36%, 24%)" stroke="hsl(166, 82%, 58%)" stroke-width="1.2"/>
     <rect x="101" y="18" width="9" height="26" rx="1.6" fill="hsl(42, 46%, 68%)" stroke="hsl(32, 54%, 34%)" stroke-width="1"/>
     <rect x="12" y="42" width="104" height="7" fill="hsl(28, 44%, 24%)" stroke="hsl(44, 78%, 58%)" stroke-width="1"/>
     <rect x="59" y="40.5" width="10" height="10" rx="1.5" fill="hsl(44, 88%, 60%)" stroke="hsl(28, 56%, 24%)" stroke-width="1"/>
     <polygon points="56,5 57.5,9 61,10.5 57.5,12 56,16 54.5,12 51,10.5 54.5,9" fill="hsl(52, 100%, 88%)"/>
     <circle cx="25" cy="24" r="1.8" fill="hsl(96, 100%, 82%)"/>
     <circle cx="92" cy="26" r="1.8" fill="hsl(170, 100%, 84%)"/>`,
    'hsla(46, 88%, 56%, 0.24)',
    `<linearGradient id="ca-expertise-roll" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(166, 46%, 22%)"/><stop offset="55%" stop-color="hsl(28, 36%, 20%)"/><stop offset="100%" stop-color="hsl(24, 42%, 11%)"/></linearGradient><linearGradient id="ca-expertise-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(188, 38%, 90%)"/><stop offset="55%" stop-color="hsl(202, 26%, 62%)"/><stop offset="100%" stop-color="hsl(214, 34%, 28%)"/></linearGradient><linearGradient id="ca-expertise-vial" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(104, 100%, 66%)"/><stop offset="100%" stop-color="hsl(148, 92%, 34%)"/></linearGradient>`
  ),
  swivel: wrapArtSvg(
    'swivel',
    'hsl(254, 56%, 20%)',
    'hsl(202, 58%, 10%)',
    `<ellipse cx="64" cy="60" rx="44" ry="7" fill="none" stroke="hsla(192, 98%, 74%, 0.32)" stroke-width="1.5" stroke-dasharray="8 4"/>
     <ellipse cx="64" cy="60" rx="26" ry="4.2" fill="hsla(246, 62%, 8%, 0.56)"/>
     <path d="M22 46 C20 22 46 12 72 16 C96 20 108 38 94 52 C80 64 46 62 34 52" fill="none" stroke="url(#ca-swivel-cloak)" stroke-width="6.5" stroke-linecap="round"/>
     <path d="M28 42 C30 22 54 18 76 24 C92 28 96 42 84 50 C72 58 48 56 42 48" fill="none" stroke="hsl(190, 100%, 80%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M56 58 L59 32 Q64 26 70 32 L73 58 Z" fill="hsl(264, 58%, 18%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.2"/>
     <circle cx="64" cy="21" r="5.2" fill="hsl(268, 54%, 20%)" stroke="hsl(190, 100%, 84%)" stroke-width="1.2"/>
     <path d="M30 20 A36 22 0 0 1 102 26" fill="none" stroke="url(#ca-swivel-gold)" stroke-width="3.2" stroke-linecap="round"/>
     <polygon points="104,27 94,20 96,31" fill="hsl(50, 100%, 90%)"/>
     <path d="M12 30 L24 34 L14 40" fill="none" stroke="hsl(190, 100%, 82%)" stroke-width="1.8" stroke-linecap="round"/>
     <polygon points="104,42 109,46 104,50 99,46" fill="hsl(48, 100%, 86%)"/>
     <circle cx="24" cy="18" r="1.8" fill="hsl(190, 100%, 84%)"/>
     <circle cx="110" cy="20" r="2.1" fill="hsl(50, 100%, 92%)"/>
     <circle cx="40" cy="60" r="1.5" fill="hsl(296, 92%, 78%)"/>`,
    'hsla(196, 96%, 64%, 0.30)',
    `<linearGradient id="ca-swivel-cloak" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(286, 86%, 66%)"/><stop offset="55%" stop-color="hsl(254, 72%, 44%)"/><stop offset="100%" stop-color="hsl(194, 96%, 56%)"/></linearGradient><linearGradient id="ca-swivel-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="55%" stop-color="hsl(44, 98%, 62%)"/><stop offset="100%" stop-color="hsla(36, 94%, 48%, 0.2)"/></linearGradient>`
  ),
  deep_breath: wrapArtSvg(
    'deep_breath',
    'hsl(198, 48%, 19%)',
    'hsl(222, 46%, 9%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-deep_breath-orb)"/>
     <path d="M0 62 L24 50 L48 59 L74 47 L102 58 L128 48 L128 72 L0 72 Z" fill="hsla(218, 44%, 12%, 0.55)"/>
     <path d="M12 42 C24 12 62 12 78 30 C92 46 112 40 118 22" fill="none" stroke="url(#ca-deep_breath-wind)" stroke-width="6" stroke-linecap="round"/>
     <path d="M116 32 C104 60 66 60 50 42 C36 26 16 32 10 50" fill="none" stroke="url(#ca-deep_breath-wind)" stroke-width="5" stroke-linecap="round"/>
     <path d="M22 39 C34 19 60 19 74 33 C84 43 102 42 110 28" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.4" stroke-linecap="round" opacity="0.82"/>
     <circle cx="64" cy="36" r="10.5" fill="hsla(186, 96%, 76%, 0.34)" stroke="hsl(182, 100%, 90%)" stroke-width="1.4"/>
     <circle cx="64" cy="36" r="4.5" fill="hsl(180, 100%, 94%)"/>
     <polygon points="34,13 45,10 48,24 37,27" fill="url(#ca-deep_breath-card)" stroke="hsl(182, 100%, 92%)" stroke-width="1.1"/>
     <polygon points="82,45 93,42 96,56 85,59" fill="url(#ca-deep_breath-card)" stroke="hsl(182, 100%, 92%)" stroke-width="1.1"/>
     <polygon points="97,15 108,18 104,31 93,28" fill="url(#ca-deep_breath-card)" stroke="hsl(182, 100%, 92%)" stroke-width="1.1" opacity="0.86"/>
     <path d="M74 16 Q82 12 88 18 Q81 20 74 16 Z" fill="hsl(176, 100%, 84%)" opacity="0.8"/>
     <path d="M40 54 Q48 50 54 56 Q47 58 40 54 Z" fill="hsl(176, 100%, 84%)" opacity="0.8"/>
     <circle cx="24" cy="24" r="1.7" fill="hsl(184, 100%, 92%)"/>
     <circle cx="106" cy="48" r="1.6" fill="hsl(184, 100%, 92%)"/>
     <circle cx="64" cy="14" r="1.4" fill="hsl(0, 0%, 100%)"/>`,
    'hsla(184, 92%, 72%, 0.28)',
    `<radialGradient id="ca-deep_breath-orb" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(182, 100%, 88%, 0.54)"/><stop offset="56%" stop-color="hsla(198, 90%, 58%, 0.22)"/><stop offset="100%" stop-color="hsla(216, 78%, 34%, 0)"/></radialGradient><linearGradient id="ca-deep_breath-wind" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(196, 92%, 74%, 0.14)"/><stop offset="50%" stop-color="hsla(180, 100%, 88%, 0.92)"/><stop offset="100%" stop-color="hsla(196, 92%, 74%, 0.14)"/></linearGradient><linearGradient id="ca-deep_breath-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(186, 86%, 90%)"/><stop offset="100%" stop-color="hsl(206, 62%, 52%)"/></linearGradient>`
  ),
  swift_strike: wrapArtSvg(
    'swift_strike',
    'hsl(212, 42%, 18%)',
    'hsl(228, 44%, 8%)',
    `<path d="M6 44 L76 18 M14 64 L96 34 M28 18 L86 6" stroke="hsla(202, 92%, 76%, 0.34)" stroke-width="1.5" stroke-linecap="round"/>
     <polygon points="8,58 106,18 112,24 18,65" fill="url(#ca-swift_strike-trail)"/>
     <ellipse cx="46" cy="44" rx="7" ry="18" transform="rotate(-21 46 44)" fill="none" stroke="hsla(46, 100%, 78%, 0.44)" stroke-width="1.6"/>
     <ellipse cx="76" cy="32" rx="6" ry="15" transform="rotate(-21 76 32)" fill="none" stroke="hsla(196, 100%, 84%, 0.62)" stroke-width="1.8"/>
     <polygon points="48,38 116,16 88,36 53,46" fill="hsl(220, 32%, 26%)"/>
     <polygon points="46,35 116,16 86,28 49,40" fill="url(#ca-swift_strike-blade)" stroke="hsl(0, 0%, 100%)" stroke-width="0.9"/>
     <line x1="14" y1="56" x2="112" y2="17" stroke="hsl(54, 100%, 94%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="110" cy="18" r="13" fill="url(#ca-swift_strike-impact)"/>
     <path d="M110 4 L112 15 L123 18 L112 21 L110 32 L108 21 L97 18 L108 15 Z" fill="hsl(56, 100%, 96%)"/>
     <path d="M22 44 L36 39 L30 51 M54 29 L68 24 L62 36" fill="none" stroke="hsl(46, 100%, 80%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M36 62 L66 50" stroke="hsl(42, 100%, 72%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="96" cy="38" r="1.8" fill="hsl(48, 100%, 86%)"/>
     <circle cx="88" cy="11" r="1.6" fill="hsl(200, 100%, 88%)"/>
     <circle cx="32" cy="59" r="1.5" fill="hsl(44, 100%, 78%)"/>`,
    'hsla(44, 98%, 68%, 0.28)',
    `<linearGradient id="ca-swift_strike-trail" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsla(204, 92%, 62%, 0.04)"/><stop offset="56%" stop-color="hsla(40, 100%, 64%, 0.62)"/><stop offset="100%" stop-color="hsl(54, 100%, 94%)"/></linearGradient><linearGradient id="ca-swift_strike-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(0, 0%, 100%)"/><stop offset="55%" stop-color="hsl(206, 42%, 78%)"/><stop offset="100%" stop-color="hsl(218, 36%, 34%)"/></linearGradient><radialGradient id="ca-swift_strike-impact" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 96%)"/><stop offset="48%" stop-color="hsla(40, 100%, 62%, 0.72)"/><stop offset="100%" stop-color="hsla(22, 96%, 50%, 0)"/></radialGradient>`
  ),
  good_instincts: wrapArtSvg(
    'good_instincts',
    'hsl(206, 46%, 19%)',
    'hsl(224, 48%, 9%)',
    `<circle cx="68" cy="37" r="32" fill="url(#ca-good_instincts-pulse)"/>
     <circle cx="68" cy="37" r="24" fill="none" stroke="hsla(194, 96%, 78%, 0.34)" stroke-width="1.2" stroke-dasharray="4 3"/>
     <ellipse cx="68" cy="64" rx="22" ry="4.5" fill="rgba(0,0,0,0.44)"/>
     <path d="M12 16 L43 27" stroke="hsl(354, 72%, 56%)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="46,28 38,22 40,30" fill="hsl(210, 26%, 78%)"/>
     <path d="M46 27 L32 10" stroke="hsl(48, 100%, 80%)" stroke-width="1.5" stroke-dasharray="3 2" stroke-linecap="round"/>
     <path d="M46 16 Q68 10 90 16 L88 41 C86 53 77 61 68 64 C59 61 50 53 48 41 Z" fill="url(#ca-good_instincts-shield)" stroke="url(#ca-good_instincts-rim)" stroke-width="2.2" stroke-linejoin="round"/>
     <path d="M68 13 L90 16 L88 41 C86 53 77 61 68 64 Z" fill="hsla(226, 56%, 12%, 0.34)"/>
     <path d="M51 20 Q60 17 67 17" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="2" stroke-linecap="round" opacity="0.72"/>
     <polygon points="68,24 76,36 68,48 60,36" fill="url(#ca-good_instincts-rim)" stroke="hsl(52, 100%, 92%)" stroke-width="1"/>
     <circle cx="68" cy="36" r="3.8" fill="hsl(194, 100%, 84%)"/>
     <path d="M45 19 L46.6 25.4 L53 27 L46.6 28.6 L45 35 L43.4 28.6 L37 27 L43.4 25.4 Z" fill="hsl(52, 100%, 94%)"/>
     <path d="M36 32 Q31 44 40 54 M98 22 Q105 36 96 52" fill="none" stroke="hsla(194, 100%, 82%, 0.62)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="29" cy="18" r="1.8" fill="hsl(50, 100%, 88%)"/>
     <circle cx="99" cy="16" r="1.6" fill="hsl(194, 100%, 88%)"/>`,
    'hsla(198, 92%, 68%, 0.28)',
    `<radialGradient id="ca-good_instincts-pulse" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(194, 100%, 76%, 0.44)"/><stop offset="60%" stop-color="hsla(206, 90%, 54%, 0.16)"/><stop offset="100%" stop-color="hsla(220, 74%, 28%, 0)"/></radialGradient><linearGradient id="ca-good_instincts-shield" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(202, 54%, 86%)"/><stop offset="50%" stop-color="hsl(212, 44%, 48%)"/><stop offset="100%" stop-color="hsl(224, 48%, 20%)"/></linearGradient><linearGradient id="ca-good_instincts-rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 84%)"/><stop offset="100%" stop-color="hsl(36, 78%, 42%)"/></linearGradient>`
  ),
  impatience: wrapArtSvg(
    'impatience',
    'hsl(18, 48%, 18%)',
    'hsl(242, 36%, 9%)',
    `<circle cx="56" cy="36" r="30" fill="url(#ca-impatience-aura)"/>
     <path d="M18 14 L26 20 M14 36 H22 M18 58 L26 52 M88 12 L82 18" stroke="hsla(38, 100%, 70%, 0.58)" stroke-width="2" stroke-linecap="round"/>
     <ellipse cx="52" cy="64" rx="22" ry="4.5" fill="rgba(0,0,0,0.44)"/>
     <path d="M40 15 Q40 29 53 35 Q40 42 36 57 L64 61 Q66 46 57 36 Q71 31 74 19 Z" fill="hsla(210, 48%, 84%, 0.18)" stroke="hsl(44, 72%, 78%)" stroke-width="1.4"/>
     <path d="M45 21 L68 24 Q63 32 55 35 Q49 30 45 21 Z" fill="url(#ca-impatience-sand)"/>
     <path d="M55 35 L51 54" stroke="hsl(48, 100%, 82%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M39 56 Q51 45 62 59 Z" fill="url(#ca-impatience-sand)"/>
     <polygon points="35,11 79,17 78,21 34,15" fill="url(#ca-impatience-brass)" stroke="hsl(26, 70%, 22%)" stroke-width="1"/>
     <polygon points="30,55 72,61 71,65 29,59" fill="url(#ca-impatience-brass)" stroke="hsl(26, 70%, 22%)" stroke-width="1"/>
     <path d="M62 24 L56 29 L61 31 L58 35" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="1.3" stroke-linecap="round"/>
     <polygon points="84,18 102,15 106,36 88,39" fill="hsla(36, 92%, 62%, 0.38)" stroke="hsl(46, 100%, 82%)" stroke-width="1.3"/>
     <polygon points="94,35 113,32 117,53 98,56" fill="hsla(24, 96%, 56%, 0.42)" stroke="hsl(46, 100%, 82%)" stroke-width="1.3"/>
     <path d="M74 27 H85 M80 45 H93" stroke="hsl(46, 100%, 82%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M26 24 L20 20 M24 31 L16 30" stroke="hsl(24, 100%, 66%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="52" cy="44" r="1.6" fill="hsl(52, 100%, 90%)"/>
     <circle cx="80" cy="56" r="1.5" fill="hsl(38, 100%, 74%)"/>`,
    'hsla(34, 98%, 58%, 0.30)',
    `<radialGradient id="ca-impatience-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(34, 100%, 60%, 0.44)"/><stop offset="62%" stop-color="hsla(14, 92%, 44%, 0.16)"/><stop offset="100%" stop-color="hsla(246, 56%, 16%, 0)"/></radialGradient><linearGradient id="ca-impatience-brass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(32, 74%, 36%)"/><stop offset="50%" stop-color="hsl(46, 98%, 74%)"/><stop offset="100%" stop-color="hsl(28, 70%, 28%)"/></linearGradient><linearGradient id="ca-impatience-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 84%)"/><stop offset="100%" stop-color="hsl(22, 98%, 50%)"/></linearGradient>`
  ),
});

export const CARD_THEME_ART = Object.freeze({
  iron_slash: wrapArtSvg(
    'iron_slash',
    'hsl(8, 66%, 20%)',
    'hsl(18, 54%, 8%)',
    `<ellipse cx="68" cy="34" rx="58" ry="32" fill="url(#ca-iron_slash-glow)"/>
     <path d="M0 64 L22 56 L46 61 L78 53 L106 59 L128 52 V72 H0 Z" fill="hsl(10, 44%, 9%)" opacity="0.72"/>
     <path d="M10 62 Q48 16 116 9" fill="none" stroke="url(#ca-iron_slash-arc)" stroke-width="9" stroke-linecap="round" opacity="0.78"/>
     <path d="M18 65 Q62 27 120 22" fill="none" stroke="hsl(8, 96%, 54%)" stroke-width="3.2" stroke-linecap="round" opacity="0.68"/>
     <path d="M14 59 Q50 19 112 11" fill="none" stroke="hsl(52, 100%, 90%)" stroke-width="2" stroke-linecap="round" opacity="0.92"/>
     <polygon points="32,54 90,11 104,11 98,23 42,61" fill="rgba(0,0,0,0.48)" transform="translate(2 2)"/>
     <polygon points="32,53 90,10 104,10 97,22 41,60" fill="url(#ca-iron_slash-blade)" stroke="hsl(16, 52%, 24%)" stroke-width="1.4"/>
     <polygon points="36,56 97,22 41,60" fill="hsl(18, 32%, 28%)" opacity="0.52"/>
     <line x1="39" y1="53" x2="96" y2="14" stroke="hsl(52, 100%, 94%)" stroke-width="1.5" opacity="0.9"/>
     <path d="M52 44 L61 38 M65 35 L74 29 M78 26 L86 21" stroke="hsl(22, 100%, 60%)" stroke-width="1.9" stroke-linecap="round"/>
     <path d="M23 45 L46 62 L41 66 L19 50 Z" fill="url(#ca-iron_slash-hilt)" stroke="hsl(18, 56%, 20%)" stroke-width="1.2"/>
     <line x1="16" y1="64" x2="31" y2="54" stroke="hsl(8, 62%, 28%)" stroke-width="4.5" stroke-linecap="round"/>
     <circle cx="15" cy="64" r="3.4" fill="hsl(354, 90%, 48%)" stroke="hsl(44, 96%, 70%)" stroke-width="1.2"/>
     <path d="M104 6 L106 11 L112 12 L106 14 L104 19 L102 14 L96 12 L102 11 Z" fill="hsl(52, 100%, 92%)"/>
     <circle cx="92" cy="36" r="2.2" fill="hsl(44, 100%, 78%)"/><circle cx="114" cy="28" r="1.9" fill="hsl(24, 100%, 66%)"/>
     <circle cx="62" cy="14" r="1.8" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(20, 98%, 56%, 0.32)',
    `<radialGradient id="ca-iron_slash-glow" cx="58%" cy="38%" r="54%"><stop offset="0%" stop-color="hsla(36, 100%, 66%, 0.44)"/><stop offset="52%" stop-color="hsla(12, 96%, 48%, 0.2)"/><stop offset="100%" stop-color="hsla(8, 90%, 30%, 0)"/></radialGradient><linearGradient id="ca-iron_slash-arc" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsla(6, 94%, 46%, 0.12)"/><stop offset="46%" stop-color="hsl(22, 100%, 58%)"/><stop offset="84%" stop-color="hsl(44, 100%, 76%)"/><stop offset="100%" stop-color="hsl(54, 100%, 94%)"/></linearGradient><linearGradient id="ca-iron_slash-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(46, 36%, 94%)"/><stop offset="48%" stop-color="hsl(32, 24%, 76%)"/><stop offset="100%" stop-color="hsl(18, 28%, 38%)"/></linearGradient><linearGradient id="ca-iron_slash-hilt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 98%, 74%)"/><stop offset="100%" stop-color="hsl(28, 76%, 40%)"/></linearGradient>`
  ),
  iron_heavy: wrapArtSvg(
    'iron_heavy',
    'hsl(4, 62%, 19%)',
    'hsl(18, 50%, 8%)',
    `<path d="M0 58 L38 52 L78 58 L128 50 V72 H0 Z" fill="hsl(10, 42%, 9%)"/>
     <circle cx="88" cy="48" r="26" fill="hsla(24, 100%, 56%, 0.24)"/>
     <path d="M22 14 L70 50" stroke="hsl(24, 38%, 34%)" stroke-width="5.2" stroke-linecap="round"/>
     <path d="M22 14 L70 50" stroke="hsl(38, 62%, 58%)" stroke-width="1.6" stroke-linecap="round" opacity="0.65"/>
     <path d="M44 26 L78 10 L102 36 L74 60 Z" fill="rgba(0,0,0,0.48)" transform="translate(2 2)"/>
     <path d="M44 25 L78 9 L101 35 L73 59 Z" fill="url(#ca-iron_heavy-head)" stroke="hsl(40, 84%, 64%)" stroke-width="1.6"/>
     <path d="M78 9 L101 35 L95 40 L74 16 Z" fill="url(#ca-iron_heavy-edge)"/>
     <path d="M56 27 L76 46" stroke="hsl(16, 46%, 18%)" stroke-width="2"/>
     <circle cx="64" cy="24" r="2.2" fill="hsl(44, 94%, 72%)"/><circle cx="58" cy="36" r="2.2" fill="hsl(44, 94%, 72%)"/>
     <path d="M84 56 L108 62 M98 44 L118 46 M94 24 L114 14 M64 60 L48 66" stroke="hsl(40, 100%, 72%)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="104,50 116,52 108,60" fill="hsl(24, 98%, 58%)"/><circle cx="102" cy="36" r="3" fill="hsl(52, 100%, 90%)"/>`,
    'hsla(18, 96%, 54%, 0.28)',
    `<linearGradient id="ca-iron_heavy-head" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(34, 24%, 76%)"/><stop offset="50%" stop-color="hsl(22, 22%, 44%)"/><stop offset="100%" stop-color="hsl(14, 32%, 18%)"/></linearGradient><linearGradient id="ca-iron_heavy-edge" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 84%)"/><stop offset="100%" stop-color="hsl(14, 98%, 54%)"/></linearGradient>`
  ),
  iron_whirlwind: wrapArtSvg(
    'iron_whirlwind',
    'hsl(14, 60%, 18%)',
    'hsl(354, 52%, 8%)',
    `<ellipse cx="64" cy="36" rx="56" ry="26" fill="url(#ca-iron_whirlwind-eye)" opacity="0.45"/>
     <ellipse cx="64" cy="46" rx="54" ry="15" fill="none" stroke="hsla(14, 96%, 56%, 0.45)" stroke-width="2.4" stroke-dasharray="28 10"/>
     <ellipse cx="64" cy="36" rx="50" ry="18" fill="none" stroke="url(#ca-iron_whirlwind-ring)" stroke-width="3.6" stroke-dasharray="38 12"/>
     <ellipse cx="64" cy="36" rx="34" ry="12" fill="none" stroke="hsl(38, 100%, 74%)" stroke-width="2.8" stroke-dasharray="24 8"/>
     <ellipse cx="64" cy="26" rx="44" ry="12" fill="none" stroke="hsla(46, 100%, 78%, 0.62)" stroke-width="2" stroke-dasharray="20 10"/>
     <path d="M18 28 Q64 8 112 28 L100 32 Q64 17 26 34 Z" fill="hsl(40, 34%, 86%)" stroke="hsl(22, 92%, 52%)" stroke-width="1.1"/>
     <path d="M110 44 Q64 64 16 44 L28 40 Q64 55 102 38 Z" fill="hsl(40, 34%, 86%)" stroke="hsl(22, 92%, 52%)" stroke-width="1.1"/>
     <circle cx="64" cy="36" r="10" fill="hsl(22, 100%, 56%)" stroke="hsl(50, 100%, 84%)" stroke-width="1.8"/>
     <circle cx="64" cy="36" r="4.8" fill="hsl(54, 100%, 96%)"/>
     <path d="M10 18 L24 22 M118 54 L104 50" stroke="hsl(46, 100%, 78%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="22" cy="56" r="2.2" fill="hsl(44, 100%, 80%)"/><circle cx="106" cy="16" r="2.2" fill="hsl(44, 100%, 80%)"/>`,
    'hsla(24, 96%, 56%, 0.28)',
    `<radialGradient id="ca-iron_whirlwind-eye" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="45%" stop-color="hsl(28, 100%, 58%)"/><stop offset="100%" stop-color="hsla(8, 94%, 44%, 0)"/></radialGradient><linearGradient id="ca-iron_whirlwind-ring" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(10, 96%, 52%)"/><stop offset="50%" stop-color="hsl(44, 100%, 76%)"/><stop offset="100%" stop-color="hsl(18, 98%, 56%)"/></linearGradient>`
  ),
  iron_shield: wrapArtSvg(
    'iron_shield',
    'hsl(214, 48%, 19%)',
    'hsl(8, 44%, 9%)',
    `<ellipse cx="64" cy="36" rx="58" ry="31" fill="url(#ca-iron_shield-ward)"/>
     <path d="M12 58 Q64 2 116 58" fill="none" stroke="hsla(198, 98%, 74%, 0.42)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M22 64 Q64 16 106 64" fill="none" stroke="hsla(44, 96%, 72%, 0.25)" stroke-width="1.6" stroke-dasharray="10 5"/>
     <path d="M64 9 L93 19 V39 C93 52 80 60 64 65 C48 60 35 52 35 39 V19 Z" fill="rgba(0,0,0,0.5)" transform="translate(2 2)"/>
     <path d="M64 8 L92 18 V38 C92 51 79 59 64 64 C49 59 36 51 36 38 V18 Z" fill="url(#ca-iron_shield-rim)" stroke="url(#ca-iron_shield-gold)" stroke-width="2.3"/>
     <path d="M64 14 L85 22 V37 C85 47 75 53 64 58 C53 53 43 47 43 37 V22 Z" fill="url(#ca-iron_shield-core)" stroke="hsl(42, 82%, 64%)" stroke-width="1.2"/>
     <path d="M44 23 L62 15 L62 34 L44 34 Z" fill="hsla(48, 100%, 92%, 0.14)"/>
     <path d="M64 14 V57 M43 35 H85" stroke="url(#ca-iron_shield-gold)" stroke-width="3.2" stroke-linecap="round"/>
     <circle cx="64" cy="35" r="7.5" fill="url(#ca-iron_shield-gold)" stroke="hsl(20, 52%, 18%)" stroke-width="1.5"/>
     <circle cx="64" cy="35" r="3.4" fill="hsl(52, 100%, 92%)"/>
     <circle cx="48" cy="24" r="1.5" fill="hsl(48, 100%, 82%)"/><circle cx="80" cy="24" r="1.5" fill="hsl(48, 100%, 82%)"/>
     <circle cx="48" cy="46" r="1.5" fill="hsl(48, 100%, 82%)"/><circle cx="80" cy="46" r="1.5" fill="hsl(48, 100%, 82%)"/>
     <path d="M14 22 L32 30 M12 40 L31 39 M114 22 L96 30 M116 40 L97 39" stroke="hsl(198, 98%, 78%)" stroke-width="2.1" stroke-linecap="round" opacity="0.82"/>
     <circle cx="24" cy="14" r="2" fill="hsl(48, 100%, 82%)"/><circle cx="104" cy="14" r="2" fill="hsl(48, 100%, 82%)"/>`,
    'hsla(204, 92%, 60%, 0.28)',
    `<radialGradient id="ca-iron_shield-ward" cx="50%" cy="48%" r="54%"><stop offset="0%" stop-color="hsla(200, 96%, 68%, 0.42)"/><stop offset="60%" stop-color="hsla(214, 88%, 48%, 0.16)"/><stop offset="100%" stop-color="hsla(214, 88%, 48%, 0)"/></radialGradient><linearGradient id="ca-iron_shield-rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(210, 38%, 52%)"/><stop offset="50%" stop-color="hsl(216, 42%, 30%)"/><stop offset="100%" stop-color="hsl(224, 44%, 14%)"/></linearGradient><linearGradient id="ca-iron_shield-core" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(6, 68%, 42%)"/><stop offset="55%" stop-color="hsl(358, 62%, 28%)"/><stop offset="100%" stop-color="hsl(352, 56%, 15%)"/></linearGradient><linearGradient id="ca-iron_shield-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 84%)"/><stop offset="50%" stop-color="hsl(42, 92%, 62%)"/><stop offset="100%" stop-color="hsl(28, 72%, 36%)"/></linearGradient>`
  ),
  iron_flame: wrapArtSvg(
    'iron_flame',
    'hsl(12, 68%, 20%)',
    'hsl(354, 56%, 8%)',
    `<path d="M22 66 Q30 32 46 44 Q54 16 64 8 Q74 16 82 44 Q98 32 106 66 Z" fill="hsl(12, 96%, 48%)" opacity="0.34"/>
     <path d="M36 62 H92 L84 68 H44 Z" fill="hsl(22, 24%, 24%)" stroke="hsl(38, 72%, 56%)" stroke-width="1.3"/>
     <path d="M64 8 Q88 26 80 56 Q72 64 64 64 Q56 64 48 56 Q40 26 64 8 Z" fill="url(#ca-iron_flame-outer)" stroke="hsl(46, 100%, 78%)" stroke-width="1.5"/>
     <path d="M64 21 Q78 36 72 56 Q68 61 64 61 Q60 61 56 56 Q50 36 64 21 Z" fill="url(#ca-iron_flame-inner)"/>
     <path d="M64 36 Q70 46 66 57 Q64 59 62 57 Q58 46 64 36 Z" fill="hsl(56, 100%, 96%)"/>
     <path d="M24 58 Q30 30 42 42 Q34 50 38 60 Z" fill="url(#ca-iron_flame-outer)" opacity="0.82"/>
     <path d="M104 58 Q98 30 86 42 Q94 50 90 60 Z" fill="url(#ca-iron_flame-outer)" opacity="0.82"/>
     <path d="M44 26 Q34 16 40 8 M84 26 Q94 16 88 8" fill="none" stroke="hsl(38, 100%, 74%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="32" cy="18" r="2.2" fill="hsl(48, 100%, 84%)"/><circle cx="96" cy="18" r="2.2" fill="hsl(48, 100%, 84%)"/>
     <circle cx="52" cy="12" r="1.7" fill="hsl(52, 100%, 90%)"/><circle cx="78" cy="14" r="1.9" fill="hsl(30, 100%, 70%)"/>`,
    'hsla(22, 98%, 56%, 0.30)',
    `<linearGradient id="ca-iron_flame-outer" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(356, 90%, 42%)"/><stop offset="52%" stop-color="hsl(18, 98%, 54%)"/><stop offset="100%" stop-color="hsl(44, 100%, 74%)"/></linearGradient><linearGradient id="ca-iron_flame-inner" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(28, 100%, 60%)"/><stop offset="60%" stop-color="hsl(48, 100%, 78%)"/><stop offset="100%" stop-color="hsl(56, 100%, 96%)"/></linearGradient>`
  ),
  iron_blood: wrapArtSvg(
    'iron_blood',
    'hsl(352, 66%, 18%)',
    'hsl(8, 52%, 8%)',
    `<ellipse cx="64" cy="59" rx="46" ry="9" fill="url(#ca-iron_blood-pool)" stroke="hsla(354, 94%, 60%, 0.55)" stroke-width="1.4"/>
     <ellipse cx="64" cy="59" rx="26" ry="5" fill="none" stroke="hsla(14, 100%, 72%, 0.6)" stroke-width="1.2"/>
     <circle cx="64" cy="34" r="26" fill="none" stroke="hsla(42, 86%, 66%, 0.3)" stroke-width="1.4" stroke-dasharray="10 5"/>
     <path d="M64 11 Q84 32 76 49 Q71 57 64 57 Q57 57 52 49 Q44 32 64 11 Z" fill="rgba(0,0,0,0.45)" transform="translate(2 2)"/>
     <path d="M64 10 Q84 31 76 48 Q71 56 64 56 Q57 56 52 48 Q44 31 64 10 Z" fill="url(#ca-iron_blood-drop)" stroke="hsl(42, 90%, 70%)" stroke-width="1.8"/>
     <path d="M57 32 Q59 22 65 18" fill="none" stroke="hsl(24, 100%, 90%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M30 22 Q39 34 30 46 Q21 34 30 22 Z" fill="url(#ca-iron_blood-drop)" stroke="hsl(40, 82%, 66%)" stroke-width="1.2" opacity="0.9"/>
     <path d="M98 22 Q107 34 98 46 Q89 34 98 22 Z" fill="url(#ca-iron_blood-drop)" stroke="hsl(40, 82%, 66%)" stroke-width="1.2" opacity="0.9"/>
     <path d="M40 52 Q52 46 64 52 Q76 46 88 52" fill="none" stroke="hsl(42, 90%, 68%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="44" cy="16" r="2" fill="hsl(14, 100%, 74%)"/><circle cx="84" cy="16" r="2" fill="hsl(14, 100%, 74%)"/>`,
    'hsla(354, 94%, 52%, 0.28)',
    `<linearGradient id="ca-iron_blood-drop" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0%" stop-color="hsl(12, 100%, 72%)"/><stop offset="42%" stop-color="hsl(354, 92%, 48%)"/><stop offset="100%" stop-color="hsl(344, 88%, 20%)"/></linearGradient><radialGradient id="ca-iron_blood-pool" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(354, 96%, 54%, 0.45)"/><stop offset="100%" stop-color="hsla(354, 96%, 54%, 0)"/></radialGradient>`
  ),
  iron_exhaust: wrapArtSvg(
    'iron_exhaust',
    'hsl(282, 46%, 17%)',
    'hsl(14, 48%, 8%)',
    `<ellipse cx="64" cy="36" rx="54" ry="28" fill="url(#ca-iron_exhaust-ash)"/>
     <path d="M16 62 Q40 24 64 36 Q88 48 112 12" fill="none" stroke="hsl(28, 96%, 62%)" stroke-width="2.6" stroke-dasharray="6 4" stroke-linecap="round"/>
     <path d="M24 52 Q48 16 74 28 Q94 38 114 22" fill="none" stroke="hsla(294, 92%, 72%, 0.55)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="64,12 86,36 64,60 42,36" fill="rgba(0,0,0,0.45)" transform="translate(2 2)"/>
     <polygon points="64,11 85,36 64,61 43,36" fill="url(#ca-iron_exhaust-seal)" stroke="hsl(36, 94%, 66%)" stroke-width="1.8"/>
     <path d="M52 24 L64 36 L78 24 M64 36 L58 52" fill="none" stroke="hsl(44, 100%, 78%)" stroke-width="1.8" stroke-linecap="round"/>
     <polygon points="82,16 94,12 90,25" fill="hsl(26, 98%, 60%)" stroke="hsl(48, 100%, 82%)" stroke-width="1"/>
     <polygon points="94,28 106,25 100,36" fill="hsl(292, 84%, 64%)" opacity="0.88"/>
     <polygon points="34,48 44,54 36,62" fill="hsl(284, 56%, 40%)" opacity="0.82"/>
     <circle cx="30" cy="20" r="2.2" fill="hsl(38, 100%, 74%)"/><circle cx="104" cy="14" r="2.4" fill="hsl(46, 100%, 82%)"/>
     <circle cx="96" cy="54" r="2.2" fill="hsl(294, 94%, 74%)"/>`,
    'hsla(292, 82%, 54%, 0.26)',
    `<linearGradient id="ca-iron_exhaust-seal" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(282, 52%, 24%)"/><stop offset="60%" stop-color="hsl(292, 56%, 38%)"/><stop offset="100%" stop-color="hsl(26, 98%, 58%)"/></linearGradient><radialGradient id="ca-iron_exhaust-ash" cx="56%" cy="44%" r="50%"><stop offset="0%" stop-color="hsla(290, 90%, 60%, 0.35)"/><stop offset="100%" stop-color="hsla(282, 70%, 20%, 0)"/></radialGradient>`
  ),
  iron_debuff: wrapArtSvg(
    'iron_debuff',
    'hsl(20, 58%, 18%)',
    'hsl(350, 48%, 8%)',
    `<circle cx="64" cy="36" r="28" fill="none" stroke="hsla(32, 94%, 62%, 0.42)" stroke-width="2" stroke-dasharray="8 4"/>
     <path d="M12 24 Q34 16 42 28 M116 48 Q94 56 86 44" fill="none" stroke="hsl(28, 32%, 44%)" stroke-width="3.6" stroke-linecap="round"/>
     <polygon points="38,14 61,14 58,34 36,36" fill="url(#ca-iron_debuff-plate)" stroke="hsl(36, 78%, 62%)" stroke-width="1.5"/>
     <polygon points="67,14 90,14 92,36 69,34" fill="url(#ca-iron_debuff-plate)" stroke="hsl(36, 78%, 62%)" stroke-width="1.5"/>
     <polygon points="36,40 59,39 61,60 44,56" fill="url(#ca-iron_debuff-plate)" stroke="hsl(36, 78%, 62%)" stroke-width="1.5"/>
     <polygon points="69,39 92,40 84,56 67,60" fill="url(#ca-iron_debuff-plate)" stroke="hsl(36, 78%, 62%)" stroke-width="1.5"/>
     <path d="M36 12 L92 60 M92 12 L36 60" stroke="url(#ca-iron_debuff-crack)" stroke-width="4.2" stroke-linecap="round"/>
     <path d="M40 15 L88 57 M88 15 L40 57" stroke="hsl(52, 100%, 88%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="64" cy="36" r="6" fill="hsl(12, 98%, 56%)" stroke="hsl(50, 100%, 86%)" stroke-width="1.5"/>
     <polygon points="24,46 31,42 29,51" fill="hsl(26, 46%, 48%)"/><polygon points="104,22 97,27 105,31" fill="hsl(26, 46%, 48%)"/>
     <circle cx="24" cy="14" r="2" fill="hsl(44, 100%, 76%)"/><circle cx="104" cy="58" r="2" fill="hsl(14, 100%, 64%)"/>`,
    'hsla(16, 94%, 52%, 0.28)',
    `<linearGradient id="ca-iron_debuff-plate" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(26, 36%, 48%)"/><stop offset="55%" stop-color="hsl(18, 38%, 28%)"/><stop offset="100%" stop-color="hsl(352, 46%, 14%)"/></linearGradient><linearGradient id="ca-iron_debuff-crack" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 80%)"/><stop offset="50%" stop-color="hsl(14, 98%, 56%)"/><stop offset="100%" stop-color="hsl(354, 94%, 50%)"/></linearGradient>`
  ),
  iron_power: wrapArtSvg(
    'iron_power',
    'hsl(30, 62%, 19%)',
    'hsl(8, 56%, 9%)',
    `<ellipse cx="64" cy="36" rx="56" ry="30" fill="url(#ca-iron_power-radiance)"/>
     <path d="M64 4 V68 M18 36 H110 M28 12 L100 60 M100 12 L28 60" stroke="hsla(44, 100%, 76%, 0.24)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M18 36 L44 22 L38 36 L44 50 Z M110 36 L84 22 L90 36 L84 50 Z" fill="hsl(26, 78%, 38%)" stroke="hsl(46, 98%, 74%)" stroke-width="1.3"/>
     <polygon points="64,8 92,36 64,64 36,36" fill="rgba(0,0,0,0.45)" transform="translate(2 2)"/>
     <polygon points="64,7 92,36 64,65 36,36" fill="hsl(14, 52%, 20%)" stroke="hsl(46, 100%, 74%)" stroke-width="2.2"/>
     <polygon points="64,15 83,36 64,57 45,36" fill="url(#ca-iron_power-crest)" stroke="hsl(50, 100%, 88%)" stroke-width="1.4"/>
     <polygon points="64,24 74,36 64,48 54,36" fill="hsl(52, 100%, 92%)"/>
     <path d="M46 36 L64 18 L64 36 Z" fill="hsla(54, 100%, 96%, 0.28)"/>
     <circle cx="26" cy="18" r="2.2" fill="hsl(48, 100%, 82%)"/><circle cx="102" cy="18" r="2.2" fill="hsl(48, 100%, 82%)"/>
     <circle cx="26" cy="54" r="2" fill="hsl(32, 100%, 70%)"/><circle cx="102" cy="54" r="2" fill="hsl(32, 100%, 70%)"/>`,
    'hsla(38, 98%, 58%, 0.30)',
    `<linearGradient id="ca-iron_power-crest" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 80%)"/><stop offset="52%" stop-color="hsl(30, 96%, 56%)"/><stop offset="100%" stop-color="hsl(8, 88%, 38%)"/></linearGradient><radialGradient id="ca-iron_power-radiance" cx="50%" cy="50%" r="52%"><stop offset="0%" stop-color="hsla(48, 100%, 78%, 0.45)"/><stop offset="100%" stop-color="hsla(24, 96%, 48%, 0)"/></radialGradient>`
  ),
  silent_shiv: wrapArtSvg(
    'silent_shiv',
    'hsl(158, 58%, 16%)',
    'hsl(190, 54%, 7%)',
    `<ellipse cx="66" cy="36" rx="58" ry="30" fill="url(#ca-silent_shiv-mist)"/>
     <path d="M0 62 Q30 48 64 56 Q98 64 128 50 V72 H0 Z" fill="hsla(172, 54%, 14%, 0.65)"/>
     <path d="M8 58 Q48 16 116 11" fill="none" stroke="url(#ca-silent_shiv-venom)" stroke-width="5.2" stroke-linecap="round" opacity="0.68"/>
     <path d="M22 65 Q68 34 122 25" fill="none" stroke="hsl(152, 96%, 58%)" stroke-width="2.6" stroke-linecap="round" opacity="0.58"/>
     <path d="M26 52 Q56 26 102 11 L107 18 Q68 37 36 58 Z" fill="rgba(0,0,0,0.48)" transform="translate(2 2)"/>
     <path d="M26 51 Q56 25 102 10 L107 17 Q68 36 36 57 Z" fill="url(#ca-silent_shiv-steel)" stroke="hsl(150, 86%, 48%)" stroke-width="1.3"/>
     <path d="M35 46 Q64 26 101 12" fill="none" stroke="url(#ca-silent_shiv-venom)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M40 53 Q68 34 103 16" fill="none" stroke="hsl(150, 100%, 96%)" stroke-width="1.2" opacity="0.82"/>
     <rect x="17" y="49" width="16" height="5" rx="1.8" transform="rotate(-30 25 51)" fill="hsl(32, 46%, 34%)" stroke="hsl(44, 86%, 64%)" stroke-width="1"/>
     <circle cx="15" cy="58" r="3.2" fill="none" stroke="hsl(44, 86%, 64%)" stroke-width="1.6"/>
     <path d="M46 58 Q74 38 112 24 L115 30 Q82 47 54 63 Z" fill="url(#ca-silent_shiv-steel)" stroke="hsl(152, 86%, 48%)" stroke-width="1.2" opacity="0.9"/>
     <path d="M54 55 Q80 40 111 26" fill="none" stroke="hsl(134, 100%, 68%)" stroke-width="1.6" stroke-linecap="round"/>
     <rect x="38" y="57" width="13" height="4.2" rx="1.4" transform="rotate(-26 44 59)" fill="hsl(30, 44%, 30%)" stroke="hsl(44, 82%, 62%)" stroke-width="0.9"/>
     <path d="M104 6 L106 11 L112 12 L106 14 L104 19 L102 14 L96 12 L102 11 Z" fill="hsl(136, 100%, 88%)"/>
     <path d="M88 38 Q92 44 88 49 Q84 44 88 38 Z" fill="hsl(132, 100%, 68%)"/><circle cx="72" cy="14" r="1.9" fill="hsl(140, 100%, 78%)"/>
     <circle cx="114" cy="40" r="2" fill="hsl(148, 100%, 74%)"/>`,
    'hsla(148, 96%, 54%, 0.30)',
    `<radialGradient id="ca-silent_shiv-mist" cx="56%" cy="46%" r="54%"><stop offset="0%" stop-color="hsla(148, 98%, 58%, 0.38)"/><stop offset="58%" stop-color="hsla(168, 86%, 34%, 0.16)"/><stop offset="100%" stop-color="hsla(186, 76%, 16%, 0)"/></radialGradient><linearGradient id="ca-silent_shiv-steel" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(168, 28%, 54%)"/><stop offset="55%" stop-color="hsl(162, 42%, 88%)"/><stop offset="100%" stop-color="hsl(148, 100%, 96%)"/></linearGradient><linearGradient id="ca-silent_shiv-venom" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(152, 92%, 44%)"/><stop offset="55%" stop-color="hsl(136, 100%, 64%)"/><stop offset="100%" stop-color="hsl(118, 100%, 84%)"/></linearGradient>`
  ),
  silent_poison: wrapArtSvg(
    'silent_poison',
    'hsl(134, 60%, 16%)',
    'hsl(166, 54%, 7%)',
    `<ellipse cx="64" cy="28" rx="52" ry="26" fill="url(#ca-silent_poison-fume)"/>
     <path d="M40 24 Q28 10 42 8 Q56 14 64 6 Q72 14 86 8 Q100 10 88 24" fill="none" stroke="hsla(124, 98%, 68%, 0.48)" stroke-width="2.8" stroke-linecap="round"/>
     <path d="M55 17 H73 V25 L86 50 A9 9 0 0 1 78 63 H50 A9 9 0 0 1 42 50 L55 25 Z" fill="rgba(0,0,0,0.45)" transform="translate(2 2)"/>
     <path d="M55 16 H73 V24 L86 49 A9 9 0 0 1 78 62 H50 A9 9 0 0 1 42 49 L55 24 Z" fill="hsla(160, 48%, 22%, 0.65)" stroke="hsl(136, 86%, 72%)" stroke-width="1.8"/>
     <path d="M51 35 Q64 31 77 35 L84 49 A7.5 7.5 0 0 1 77 60 H51 A7.5 7.5 0 0 1 44 49 Z" fill="url(#ca-silent_poison-liquid)"/>
     <rect x="57" y="10" width="14" height="6.5" rx="1.6" fill="hsl(32, 48%, 36%)" stroke="hsl(42, 72%, 62%)" stroke-width="1.1"/>
     <path d="M52 28 L47 46" stroke="hsl(126, 100%, 92%)" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
     <circle cx="58" cy="48" r="3.4" fill="hsl(114, 100%, 82%)"/><circle cx="70" cy="44" r="2.6" fill="hsl(114, 100%, 82%)"/>
     <circle cx="65" cy="54" r="2" fill="hsl(118, 100%, 88%)"/><circle cx="63" cy="30" r="2.2" fill="hsl(120, 100%, 78%)"/>
     <path d="M26 36 Q32 45 26 52 Q20 45 26 36 Z" fill="hsl(128, 96%, 56%)" opacity="0.8"/>
     <path d="M102 30 Q108 39 102 46 Q96 39 102 30 Z" fill="hsl(128, 96%, 56%)" opacity="0.8"/>`,
    'hsla(130, 96%, 52%, 0.28)',
    `<linearGradient id="ca-silent_poison-liquid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(118, 100%, 68%)"/><stop offset="55%" stop-color="hsl(134, 92%, 44%)"/><stop offset="100%" stop-color="hsl(154, 84%, 24%)"/></linearGradient><radialGradient id="ca-silent_poison-fume" cx="50%" cy="32%" r="52%"><stop offset="0%" stop-color="hsla(124, 100%, 64%, 0.36)"/><stop offset="100%" stop-color="hsla(146, 86%, 24%, 0)"/></radialGradient>`
  ),
  silent_cloak: wrapArtSvg(
    'silent_cloak',
    'hsl(172, 54%, 16%)',
    'hsl(206, 52%, 7%)',
    `<ellipse cx="64" cy="36" rx="58" ry="30" fill="url(#ca-silent_cloak-aura)"/>
     <path d="M8 38 Q40 14 64 22 Q88 14 120 38" fill="none" stroke="hsla(154, 96%, 68%, 0.45)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M12 52 Q44 36 64 46 Q84 36 116 52" fill="none" stroke="hsla(166, 92%, 68%, 0.32)" stroke-width="2" stroke-linecap="round"/>
     <path d="M18 62 Q28 20 64 11 Q100 20 110 62 Q86 50 64 62 Q42 50 18 62 Z" fill="rgba(0,0,0,0.48)" transform="translate(2 2)"/>
     <path d="M18 61 Q28 19 64 10 Q100 19 110 61 Q86 49 64 61 Q42 49 18 61 Z" fill="url(#ca-silent_cloak-fabric)" stroke="hsl(152, 86%, 58%)" stroke-width="1.7"/>
     <path d="M36 54 Q46 28 64 16 Q82 28 92 54" fill="none" stroke="hsla(154, 92%, 66%, 0.45)" stroke-width="1.5"/>
     <path d="M64 13 L86 24 V41 C86 52 76 59 64 63 C52 59 42 52 42 41 V24 Z" fill="url(#ca-silent_cloak-ward)" stroke="hsl(148, 96%, 68%)" stroke-width="2"/>
     <path d="M64 19 L80 27 V40 C80 48 72 54 64 57 C56 54 48 48 48 40 V27 Z" fill="hsl(178, 52%, 15%)" stroke="hsl(46, 90%, 70%)" stroke-width="1.1"/>
     <path d="M51 31 L77 45 M77 31 L51 45" stroke="hsl(48, 98%, 78%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M53 32 L75 44 M75 32 L53 44" stroke="hsl(150, 100%, 92%)" stroke-width="0.9" stroke-linecap="round"/>
     <polygon points="64,22 68,28 64,33 60,28" fill="hsl(48, 100%, 80%)" stroke="hsl(166, 56%, 18%)" stroke-width="1"/>
     <path d="M14 24 Q26 16 36 22 M114 24 Q102 16 92 22" fill="none" stroke="hsl(152, 98%, 72%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="24" cy="44" r="2" fill="hsl(148, 100%, 76%)"/><circle cx="104" cy="44" r="2" fill="hsl(148, 100%, 76%)"/>
     <circle cx="64" cy="9" r="2.2" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(158, 92%, 54%, 0.28)',
    `<radialGradient id="ca-silent_cloak-aura" cx="50%" cy="46%" r="54%"><stop offset="0%" stop-color="hsla(158, 94%, 56%, 0.36)"/><stop offset="60%" stop-color="hsla(182, 82%, 34%, 0.16)"/><stop offset="100%" stop-color="hsla(204, 72%, 16%, 0)"/></radialGradient><linearGradient id="ca-silent_cloak-fabric" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(168, 52%, 30%)"/><stop offset="55%" stop-color="hsl(176, 52%, 19%)"/><stop offset="100%" stop-color="hsl(198, 54%, 10%)"/></linearGradient><linearGradient id="ca-silent_cloak-ward" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(158, 66%, 44%)"/><stop offset="55%" stop-color="hsl(168, 60%, 26%)"/><stop offset="100%" stop-color="hsl(186, 58%, 14%)"/></linearGradient>`
  ),
  silent_discard: wrapArtSvg(
    'silent_discard',
    'hsl(180, 50%, 16%)',
    'hsl(216, 48%, 8%)',
    `<path d="M14 54 Q46 66 86 58 Q112 52 116 32" fill="none" stroke="url(#ca-silent_discard-swirl)" stroke-width="3" stroke-linecap="round"/>
     <path d="M16 20 Q48 8 92 14" fill="none" stroke="hsla(170, 92%, 68%, 0.45)" stroke-width="2" stroke-dasharray="6 4" stroke-linecap="round"/>
     <rect x="24" y="18" width="24" height="36" rx="3" transform="rotate(-22 36 36)" fill="hsl(182, 42%, 22%)" stroke="hsl(162, 82%, 58%)" stroke-width="1.3" opacity="0.72"/>
     <rect x="40" y="15" width="25" height="38" rx="3" transform="rotate(-8 52 34)" fill="url(#ca-silent_discard-card)" stroke="hsl(154, 90%, 66%)" stroke-width="1.5"/>
     <rect x="60" y="13" width="26" height="40" rx="3" transform="rotate(8 73 33)" fill="url(#ca-silent_discard-card)" stroke="hsl(46, 96%, 72%)" stroke-width="1.8"/>
     <rect x="82" y="19" width="24" height="36" rx="3" transform="rotate(24 94 37)" fill="hsl(184, 44%, 20%)" stroke="hsl(160, 86%, 62%)" stroke-width="1.3" opacity="0.82"/>
     <polygon points="73,23 79,33 73,43 67,33" fill="hsl(46, 98%, 74%)" stroke="hsl(168, 52%, 18%)" stroke-width="1"/>
     <path d="M46 28 H58 M46 36 H56" stroke="hsla(156, 96%, 78%, 0.7)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="108,24 120,28 111,38 112,30" fill="hsl(48, 100%, 82%)"/>
     <circle cx="24" cy="52" r="2" fill="hsl(156, 96%, 72%)"/><circle cx="102" cy="14" r="2" fill="hsl(48, 100%, 80%)"/>`,
    'hsla(166, 90%, 56%, 0.26)',
    `<linearGradient id="ca-silent_discard-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(164, 52%, 44%)"/><stop offset="60%" stop-color="hsl(176, 48%, 26%)"/><stop offset="100%" stop-color="hsl(200, 48%, 14%)"/></linearGradient><linearGradient id="ca-silent_discard-swirl" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(162, 94%, 64%, 0.1)"/><stop offset="65%" stop-color="hsl(152, 96%, 64%)"/><stop offset="100%" stop-color="hsl(48, 100%, 80%)"/></linearGradient>`
  ),
  silent_agility: wrapArtSvg(
    'silent_agility',
    'hsl(156, 54%, 16%)',
    'hsl(196, 50%, 8%)',
    `<path d="M0 64 L26 52 L54 58 L84 48 L128 56 V72 H0 Z" fill="hsl(194, 48%, 9%)" opacity="0.72"/>
     <path d="M10 56 Q44 18 78 30 Q94 36 112 14" fill="none" stroke="url(#ca-silent_agility-gale)" stroke-width="5.2" stroke-linecap="round"/>
     <path d="M16 64 Q52 34 86 42 Q100 45 116 32" fill="none" stroke="url(#ca-silent_agility-sub)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M14 42 Q38 14 68 20" fill="none" stroke="hsla(148, 100%, 78%, 0.65)" stroke-width="2" stroke-linecap="round"/>
     <polygon points="94,12 117,11 106,31 104,20" fill="hsl(148, 100%, 74%)" stroke="hsl(48, 100%, 86%)" stroke-width="1.3"/>
     <path d="M36 46 Q46 24 62 28 Q52 38 48 52 Z" fill="hsla(156, 94%, 58%, 0.34)" stroke="hsl(150, 96%, 72%)" stroke-width="1.2"/>
     <path d="M62 40 Q72 20 88 24 Q78 34 74 46 Z" fill="hsla(152, 96%, 64%, 0.52)" stroke="hsl(48, 100%, 82%)" stroke-width="1.2"/>
     <path d="M18 22 L30 18 M84 54 L104 48 M26 62 L44 56" stroke="hsl(166, 96%, 76%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="114" cy="14" r="2.6" fill="hsl(52, 100%, 92%)"/><circle cx="48" cy="14" r="2" fill="hsl(148, 100%, 78%)"/>
     <circle cx="96" cy="56" r="1.9" fill="hsl(172, 98%, 76%)"/>`,
    'hsla(154, 92%, 56%, 0.28)',
    `<linearGradient id="ca-silent_agility-gale" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsla(176, 86%, 54%, 0.18)"/><stop offset="55%" stop-color="hsl(150, 96%, 62%)"/><stop offset="100%" stop-color="hsl(52, 100%, 86%)"/></linearGradient><linearGradient id="ca-silent_agility-sub" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsla(186, 88%, 56%, 0.1)"/><stop offset="100%" stop-color="hsl(172, 94%, 72%)"/></linearGradient>`
  ),
  silent_power: wrapArtSvg(
    'silent_power',
    'hsl(150, 58%, 16%)',
    'hsl(192, 52%, 8%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-silent_power-core)" opacity="0.45"/>
     <path d="M22 14 L106 58 M106 14 L22 58" stroke="hsla(152, 92%, 64%, 0.34)" stroke-width="2" stroke-linecap="round"/>
     <path d="M20 36 Q40 14 64 16 Q88 14 108 36 Q88 58 64 56 Q40 58 20 36 Z" fill="none" stroke="hsla(148, 94%, 64%, 0.45)" stroke-width="1.6"/>
     <polygon points="64,9 92,36 64,63 36,36" fill="rgba(0,0,0,0.45)" transform="translate(2 2)"/>
     <polygon points="64,8 91,36 64,64 37,36" fill="url(#ca-silent_power-crest)" stroke="hsl(142, 96%, 70%)" stroke-width="2"/>
     <polygon points="64,16 82,36 64,56 46,36" fill="hsl(172, 58%, 16%)" stroke="hsl(46, 98%, 74%)" stroke-width="1.4"/>
     <circle cx="64" cy="36" r="10" fill="hsl(46, 100%, 68%)" stroke="hsl(142, 100%, 80%)" stroke-width="1.6"/>
     <polygon points="64,28 67,36 64,44 61,36" fill="hsl(174, 72%, 14%)"/>
     <circle cx="28" cy="18" r="2.2" fill="hsl(144, 100%, 76%)"/><circle cx="100" cy="18" r="2.2" fill="hsl(144, 100%, 76%)"/>
     <circle cx="28" cy="54" r="2" fill="hsl(48, 100%, 78%)"/><circle cx="100" cy="54" r="2" fill="hsl(48, 100%, 78%)"/>`,
    'hsla(146, 94%, 54%, 0.28)',
    `<linearGradient id="ca-silent_power-crest" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(146, 86%, 54%)"/><stop offset="55%" stop-color="hsl(164, 72%, 30%)"/><stop offset="100%" stop-color="hsl(190, 66%, 14%)"/></linearGradient><radialGradient id="ca-silent_power-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="55%" stop-color="hsl(142, 100%, 58%)"/><stop offset="100%" stop-color="hsla(154, 92%, 34%, 0)"/></radialGradient>`
  ),
  watcher_wrath: wrapArtSvg(
    'watcher_wrath',
    'hsl(348, 66%, 19%)',
    'hsl(276, 52%, 9%)',
    `<ellipse cx="64" cy="36" rx="58" ry="30" fill="url(#ca-watcher_wrath-aura)"/>
     <path d="M12 58 Q28 24 44 40 Q52 14 64 26 Q76 14 84 40 Q100 24 116 58" fill="none" stroke="hsla(354, 98%, 62%, 0.55)" stroke-width="3" stroke-linecap="round"/>
     <path d="M64 8 Q88 26 78 58 Q64 66 50 58 Q40 26 64 8 Z" fill="rgba(0,0,0,0.45)" transform="translate(2 2)"/>
     <path d="M64 7 Q88 25 78 57 Q64 65 50 57 Q40 25 64 7 Z" fill="url(#ca-watcher_wrath-flame)" stroke="hsl(48, 100%, 78%)" stroke-width="1.8"/>
     <path d="M64 20 Q76 34 70 54 Q64 59 58 54 Q52 34 64 20 Z" fill="hsl(48, 100%, 82%)"/>
     <polygon points="64,31 69,43 64,53 59,43" fill="hsl(54, 100%, 96%)"/>
     <path d="M22 48 Q34 26 48 48 M106 48 Q94 26 80 48" fill="none" stroke="hsl(20, 100%, 66%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M18 22 L38 30 M110 22 L90 30 M24 62 L44 56 M104 62 L84 56" stroke="hsl(44, 100%, 76%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="32" cy="14" r="2.2" fill="hsl(48, 100%, 84%)"/><circle cx="96" cy="14" r="2.2" fill="hsl(48, 100%, 84%)"/>
     <circle cx="20" cy="36" r="1.8" fill="hsl(338, 100%, 72%)"/><circle cx="108" cy="36" r="1.8" fill="hsl(338, 100%, 72%)"/>`,
    'hsla(354, 98%, 56%, 0.32)',
    `<linearGradient id="ca-watcher_wrath-flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(332, 92%, 44%)"/><stop offset="48%" stop-color="hsl(354, 98%, 56%)"/><stop offset="85%" stop-color="hsl(28, 100%, 66%)"/><stop offset="100%" stop-color="hsl(52, 100%, 90%)"/></linearGradient><radialGradient id="ca-watcher_wrath-aura" cx="50%" cy="48%" r="54%"><stop offset="0%" stop-color="hsla(354, 100%, 62%, 0.45)"/><stop offset="60%" stop-color="hsla(296, 86%, 44%, 0.2)"/><stop offset="100%" stop-color="hsla(276, 70%, 20%, 0)"/></radialGradient>`
  ),
  watcher_calm: wrapArtSvg(
    'watcher_calm',
    'hsl(200, 62%, 18%)',
    'hsl(264, 54%, 9%)',
    `<ellipse cx="64" cy="34" rx="58" ry="30" fill="url(#ca-watcher_calm-halo)"/>
     <path d="M0 50 H128 V72 H0 Z" fill="hsla(220, 64%, 14%, 0.56)"/>
     <circle cx="64" cy="32" r="24" fill="hsla(194, 96%, 64%, 0.12)" stroke="hsl(192, 100%, 78%)" stroke-width="1.6"/>
     <circle cx="64" cy="32" r="18" fill="none" stroke="hsla(46, 98%, 76%, 0.58)" stroke-width="1.2" stroke-dasharray="5 4"/>
     <ellipse cx="64" cy="56" rx="50" ry="8" fill="none" stroke="hsla(192, 100%, 78%, 0.45)" stroke-width="1.6"/>
     <ellipse cx="64" cy="56" rx="31" ry="4.8" fill="none" stroke="hsl(192, 100%, 84%)" stroke-width="1.8"/>
     <path d="M26 48 Q40 28 60 44 Q42 52 26 48 Z" fill="url(#ca-watcher_calm-side)" stroke="hsl(192, 100%, 84%)" stroke-width="1.2" opacity="0.88"/>
     <path d="M102 48 Q88 28 68 44 Q86 52 102 48 Z" fill="url(#ca-watcher_calm-side)" stroke="hsl(192, 100%, 84%)" stroke-width="1.2" opacity="0.88"/>
     <path d="M36 46 Q46 20 62 42 Q48 52 36 46 Z" fill="url(#ca-watcher_calm-petal)" stroke="hsl(48, 100%, 82%)" stroke-width="1.2"/>
     <path d="M92 46 Q82 20 66 42 Q80 52 92 46 Z" fill="url(#ca-watcher_calm-petal)" stroke="hsl(48, 100%, 82%)" stroke-width="1.2"/>
     <path d="M64 11 Q78 28 64 49 Q50 28 64 11 Z" fill="url(#ca-watcher_calm-petal)" stroke="hsl(48, 100%, 84%)" stroke-width="1.6"/>
     <circle cx="64" cy="31" r="6.8" fill="url(#ca-watcher_calm-orb)" stroke="hsl(48, 100%, 88%)" stroke-width="1.2"/>
     <path d="M12 58 Q38 51 64 58 Q90 65 116 58" fill="none" stroke="hsl(192, 100%, 78%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M26 65 Q64 59 102 65" fill="none" stroke="hsla(192, 100%, 82%, 0.45)" stroke-width="1.3" stroke-linecap="round"/>
     <circle cx="26" cy="18" r="2" fill="hsl(48, 100%, 86%)"/><circle cx="102" cy="18" r="2" fill="hsl(48, 100%, 86%)"/>
     <circle cx="42" cy="12" r="1.5" fill="hsl(190, 100%, 90%)"/><circle cx="86" cy="12" r="1.5" fill="hsl(190, 100%, 90%)"/>`,
    'hsla(194, 96%, 62%, 0.30)',
    `<radialGradient id="ca-watcher_calm-halo" cx="50%" cy="42%" r="54%"><stop offset="0%" stop-color="hsla(192, 100%, 76%, 0.44)"/><stop offset="56%" stop-color="hsla(266, 84%, 58%, 0.18)"/><stop offset="100%" stop-color="hsla(264, 70%, 20%, 0)"/></radialGradient><linearGradient id="ca-watcher_calm-petal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(292, 92%, 82%)"/><stop offset="55%" stop-color="hsl(276, 76%, 56%)"/><stop offset="100%" stop-color="hsl(226, 66%, 34%)"/></linearGradient><linearGradient id="ca-watcher_calm-side" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(192, 98%, 82%)"/><stop offset="100%" stop-color="hsl(224, 72%, 44%)"/></linearGradient><radialGradient id="ca-watcher_calm-orb" cx="42%" cy="38%" r="58%"><stop offset="0%" stop-color="hsl(0, 0%, 100%)"/><stop offset="50%" stop-color="hsl(190, 100%, 78%)"/><stop offset="100%" stop-color="hsl(214, 92%, 52%)"/></radialGradient>`
  ),
  watcher_divinity: wrapArtSvg(
    'watcher_divinity',
    'hsl(282, 58%, 20%)',
    'hsl(40, 56%, 11%)',
    `<ellipse cx="64" cy="36" rx="58" ry="32" fill="url(#ca-watcher_divinity-sun)"/>
     <path d="M64 4 V68 M12 36 H116 M24 10 L104 62 M104 10 L24 62" stroke="hsla(48, 100%, 82%, 0.3)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="64" cy="36" r="27" fill="none" stroke="hsl(48, 100%, 76%)" stroke-width="2"/>
     <circle cx="64" cy="36" r="21" fill="none" stroke="hsl(294, 92%, 74%)" stroke-width="1.3" stroke-dasharray="6 4"/>
     <path d="M64 7 L71 27 L93 36 L71 45 L64 65 L57 45 L35 36 L57 27 Z" fill="url(#ca-watcher_divinity-star)" stroke="hsl(50, 100%, 88%)" stroke-width="1.5"/>
     <path d="M44 16 L60 31 L84 16 L69 36 L84 56 L60 41 L44 56 L59 36 Z" fill="hsla(48, 100%, 80%, 0.55)"/>
     <polygon points="64,25 72,36 64,47 56,36" fill="hsl(52, 100%, 92%)" stroke="hsl(292, 92%, 68%)" stroke-width="1.3"/>
     <circle cx="64" cy="36" r="3.4" fill="hsl(288, 92%, 60%)"/>
     <circle cx="24" cy="20" r="2.2" fill="hsl(50, 100%, 88%)"/><circle cx="104" cy="20" r="2.2" fill="hsl(50, 100%, 88%)"/>
     <circle cx="24" cy="52" r="2" fill="hsl(294, 96%, 78%)"/><circle cx="104" cy="52" r="2" fill="hsl(294, 96%, 78%)"/>`,
    'hsla(48, 100%, 66%, 0.32)',
    `<radialGradient id="ca-watcher_divinity-sun" cx="50%" cy="50%" r="54%"><stop offset="0%" stop-color="hsl(54, 100%, 94%)"/><stop offset="38%" stop-color="hsla(46, 100%, 70%, 0.55)"/><stop offset="72%" stop-color="hsla(292, 92%, 58%, 0.24)"/><stop offset="100%" stop-color="hsla(282, 72%, 22%, 0)"/></radialGradient><linearGradient id="ca-watcher_divinity-star" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="50%" stop-color="hsl(294, 94%, 72%)"/><stop offset="100%" stop-color="hsl(44, 100%, 64%)"/></linearGradient>`
  ),
  watcher_scry: wrapArtSvg(
    'watcher_scry',
    'hsl(268, 56%, 18%)',
    'hsl(214, 52%, 9%)',
    `<ellipse cx="64" cy="36" rx="54" ry="26" fill="none" stroke="hsla(292, 92%, 72%, 0.28)" stroke-width="1.5" stroke-dasharray="10 5"/>
     <path d="M16 36 Q64 4 112 36 Q64 68 16 36 Z" fill="rgba(0,0,0,0.42)" transform="translate(2 2)"/>
     <path d="M16 36 Q64 6 112 36 Q64 66 16 36 Z" fill="url(#ca-watcher_scry-lid)" stroke="hsl(292, 92%, 74%)" stroke-width="2"/>
     <path d="M24 36 Q64 13 104 36 Q64 59 24 36 Z" fill="hsl(244, 56%, 16%)" stroke="hsl(48, 98%, 76%)" stroke-width="1.3"/>
     <circle cx="64" cy="36" r="15.5" fill="url(#ca-watcher_scry-iris)" stroke="hsl(48, 100%, 78%)" stroke-width="1.8"/>
     <circle cx="64" cy="36" r="11" fill="none" stroke="hsla(188, 100%, 88%, 0.65)" stroke-width="1.2" stroke-dasharray="4 3"/>
     <polygon points="64,23 68,36 64,49 60,36" fill="hsl(268, 72%, 12%)"/>
     <circle cx="59" cy="31" r="2.8" fill="hsl(0, 0%, 100%)" opacity="0.92"/>
     <path d="M64 6 V12 M44 10 L48 16 M84 10 L80 16 M64 60 V66 M44 62 L48 56 M84 62 L80 56" stroke="hsl(48, 100%, 80%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="16" cy="18" r="2" fill="hsl(192, 100%, 82%)"/><circle cx="112" cy="54" r="2" fill="hsl(294, 96%, 78%)"/>`,
    'hsla(286, 94%, 64%, 0.28)',
    `<radialGradient id="ca-watcher_scry-iris" cx="44%" cy="42%" r="56%"><stop offset="0%" stop-color="hsl(188, 100%, 90%)"/><stop offset="48%" stop-color="hsl(194, 98%, 58%)"/><stop offset="100%" stop-color="hsl(246, 78%, 28%)"/></radialGradient><linearGradient id="ca-watcher_scry-lid" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(276, 56%, 32%)"/><stop offset="100%" stop-color="hsl(236, 56%, 16%)"/></linearGradient>`
  ),
  watcher_retain: wrapArtSvg(
    'watcher_retain',
    'hsl(274, 52%, 18%)',
    'hsl(36, 48%, 10%)',
    `<circle cx="64" cy="36" r="29" fill="none" stroke="hsla(46, 98%, 74%, 0.34)" stroke-width="1.6" stroke-dasharray="9 5"/>
     <rect x="40" y="9" width="48" height="5" rx="2" fill="hsl(46, 94%, 68%)" stroke="hsl(282, 52%, 24%)" stroke-width="1.2"/>
     <rect x="40" y="58" width="48" height="5" rx="2" fill="hsl(46, 94%, 68%)" stroke="hsl(282, 52%, 24%)" stroke-width="1.2"/>
     <line x1="44" y1="14" x2="44" y2="58" stroke="hsl(292, 74%, 68%)" stroke-width="2"/>
     <line x1="84" y1="14" x2="84" y2="58" stroke="hsl(292, 74%, 68%)" stroke-width="2"/>
     <path d="M48 14 H80 Q80 30 66 36 Q80 42 80 58 H48 Q48 42 62 36 Q48 30 48 14 Z" fill="url(#ca-watcher_retain-glass)" stroke="hsl(48, 100%, 78%)" stroke-width="1.7"/>
     <polygon points="54,23 74,23 64,34" fill="url(#ca-watcher_retain-sand)"/>
     <polygon points="51,57 77,57 64,45" fill="url(#ca-watcher_retain-sand)"/>
     <line x1="64" y1="35" x2="64" y2="48" stroke="hsl(52, 100%, 90%)" stroke-width="2" stroke-dasharray="2.5 2"/>
     <path d="M52 19 Q53 26 59 31" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.4" stroke-linecap="round" opacity="0.72"/>
     <circle cx="24" cy="24" r="2.2" fill="hsl(48, 100%, 82%)"/><circle cx="104" cy="48" r="2.2" fill="hsl(48, 100%, 82%)"/>
     <circle cx="28" cy="50" r="1.7" fill="hsl(294, 96%, 78%)"/><circle cx="100" cy="22" r="1.7" fill="hsl(294, 96%, 78%)"/>`,
    'hsla(46, 98%, 64%, 0.28)',
    `<linearGradient id="ca-watcher_retain-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(292, 86%, 78%, 0.34)"/><stop offset="100%" stop-color="hsla(46, 96%, 68%, 0.2)"/></linearGradient><linearGradient id="ca-watcher_retain-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 88%)"/><stop offset="100%" stop-color="hsl(38, 96%, 56%)"/></linearGradient>`
  ),
  watcher_martial: wrapArtSvg(
    'watcher_martial',
    'hsl(280, 60%, 19%)',
    'hsl(330, 54%, 9%)',
    `<ellipse cx="76" cy="30" rx="56" ry="30" fill="url(#ca-watcher_martial-chi)"/>
     <path d="M10 60 Q50 18 114 14" fill="none" stroke="url(#ca-watcher_martial-sweep)" stroke-width="8" stroke-linecap="round" opacity="0.78"/>
     <path d="M18 66 Q60 36 120 34" fill="none" stroke="hsl(46, 100%, 74%)" stroke-width="3" stroke-linecap="round" opacity="0.82"/>
     <path d="M14 58 Q52 22 110 16" fill="none" stroke="hsl(54, 100%, 96%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M22 62 Q42 50 56 58 Q70 66 86 50" fill="none" stroke="hsl(296, 92%, 74%)" stroke-width="2.6" stroke-linecap="round" opacity="0.72"/>
     <line x1="18" y1="62" x2="94" y2="21" stroke="rgba(0,0,0,0.48)" stroke-width="6" stroke-linecap="round" transform="translate(2 2)"/>
     <line x1="18" y1="61" x2="94" y2="20" stroke="url(#ca-watcher_martial-staff)" stroke-width="4.6" stroke-linecap="round"/>
     <line x1="22" y1="59" x2="90" y2="22" stroke="hsl(54, 100%, 96%)" stroke-width="1.2" stroke-linecap="round" opacity="0.85"/>
     <path d="M84 22 Q98 7 110 22 Q98 30 84 22 Z" fill="url(#ca-watcher_martial-finial)" stroke="hsl(50, 100%, 88%)" stroke-width="1.5"/>
     <path d="M74 30 Q84 38 78 50 Q88 42 94 30" fill="none" stroke="hsl(46, 100%, 76%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="94" cy="20" r="6" fill="hsl(52, 100%, 92%)" stroke="hsl(296, 96%, 70%)" stroke-width="1.5"/>
     <path d="M104 7 L107 14 L114 16 L107 18 L104 25 L101 18 L94 16 L101 14 Z" fill="hsl(54, 100%, 96%)" opacity="0.92"/>
     <circle cx="44" cy="24" r="2.6" fill="hsl(48, 100%, 80%)"/><circle cx="58" cy="18" r="2.2" fill="hsl(296, 98%, 78%)"/>
     <circle cx="34" cy="34" r="2" fill="hsl(48, 100%, 82%)"/><circle cx="108" cy="44" r="2.2" fill="hsl(332, 96%, 72%)"/>`,
    'hsla(294, 94%, 64%, 0.30)',
    `<radialGradient id="ca-watcher_martial-chi" cx="70%" cy="28%" r="54%"><stop offset="0%" stop-color="hsla(50, 100%, 86%, 0.5)"/><stop offset="48%" stop-color="hsla(296, 96%, 64%, 0.26)"/><stop offset="100%" stop-color="hsla(280, 74%, 20%, 0)"/></radialGradient><linearGradient id="ca-watcher_martial-sweep" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsla(292, 92%, 62%, 0.14)"/><stop offset="52%" stop-color="hsl(312, 96%, 68%)"/><stop offset="86%" stop-color="hsl(48, 100%, 78%)"/><stop offset="100%" stop-color="hsl(54, 100%, 96%)"/></linearGradient><linearGradient id="ca-watcher_martial-staff" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(28, 72%, 44%)"/><stop offset="50%" stop-color="hsl(46, 94%, 72%)"/><stop offset="100%" stop-color="hsl(52, 100%, 88%)"/></linearGradient><linearGradient id="ca-watcher_martial-finial" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="55%" stop-color="hsl(296, 96%, 72%)"/><stop offset="100%" stop-color="hsl(338, 92%, 58%)"/></linearGradient>`
  ),
  watcher_mark: wrapArtSvg(
    'watcher_mark',
    'hsl(300, 56%, 17%)',
    'hsl(340, 52%, 8%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-watcher_mark-pulse)" opacity="0.52"/>
     <circle cx="64" cy="36" r="26" fill="none" stroke="hsla(332, 94%, 68%, 0.45)" stroke-width="1.8" stroke-dasharray="10 5"/>
     <circle cx="64" cy="36" r="18" fill="none" stroke="hsl(332, 96%, 68%)" stroke-width="2.2"/>
     <circle cx="64" cy="36" r="10" fill="hsl(332, 96%, 56%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.6"/>
     <polygon points="64,30 69,36 64,42 59,36" fill="hsl(52, 100%, 92%)"/>
     <polygon points="64,7 68,21 64,17 60,21" fill="hsl(46, 100%, 78%)"/>
     <polygon points="64,65 68,51 64,55 60,51" fill="hsl(46, 100%, 78%)"/>
     <polygon points="24,36 44,32 39,36 44,40" fill="hsl(46, 100%, 78%)"/>
     <polygon points="104,36 84,32 89,36 84,40" fill="hsl(46, 100%, 78%)"/>
     <path d="M34 14 L46 24 M94 14 L82 24 M34 58 L46 48 M94 58 L82 48" stroke="hsl(334, 96%, 72%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="28" cy="18" r="2" fill="hsl(48, 100%, 84%)"/><circle cx="100" cy="54" r="2" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(332, 96%, 60%, 0.30)',
    `<radialGradient id="ca-watcher_mark-pulse" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="40%" stop-color="hsl(332, 98%, 62%)"/><stop offset="100%" stop-color="hsla(312, 86%, 34%, 0)"/></radialGradient>`
  ),
  watcher_power: wrapArtSvg(
    'watcher_power',
    'hsl(276, 56%, 18%)',
    'hsl(240, 50%, 9%)',
    `<circle cx="64" cy="34" r="30" fill="url(#ca-watcher_power-orb)" opacity="0.48"/>
     <path d="M16 56 Q44 20 64 46 Q84 20 112 56" fill="none" stroke="hsl(294, 94%, 74%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M24 44 Q46 14 64 38 Q82 14 104 44" fill="none" stroke="hsla(48, 100%, 78%, 0.58)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M38 56 Q46 28 62 46 Q50 60 38 56 Z" fill="url(#ca-watcher_power-lotus)" stroke="hsl(46, 98%, 76%)" stroke-width="1.3"/>
     <path d="M90 56 Q82 28 66 46 Q78 60 90 56 Z" fill="url(#ca-watcher_power-lotus)" stroke="hsl(46, 98%, 76%)" stroke-width="1.3"/>
     <path d="M64 14 Q80 30 72 56 Q64 62 56 56 Q48 30 64 14 Z" fill="url(#ca-watcher_power-lotus)" stroke="hsl(48, 100%, 82%)" stroke-width="1.7"/>
     <circle cx="64" cy="36" r="8" fill="hsl(48, 100%, 76%)" stroke="hsl(294, 94%, 76%)" stroke-width="1.5"/>
     <circle cx="64" cy="36" r="3.6" fill="hsl(54, 100%, 96%)"/>
     <path d="M64 5 L66 10 L71 11 L66 12 L64 17 L62 12 L57 11 L62 10 Z" fill="hsl(52, 100%, 90%)"/>
     <circle cx="28" cy="22" r="2" fill="hsl(48, 100%, 82%)"/><circle cx="100" cy="22" r="2" fill="hsl(48, 100%, 82%)"/>`,
    'hsla(288, 94%, 64%, 0.28)',
    `<linearGradient id="ca-watcher_power-lotus" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(296, 94%, 78%)"/><stop offset="55%" stop-color="hsl(280, 74%, 48%)"/><stop offset="100%" stop-color="hsl(248, 66%, 24%)"/></linearGradient><radialGradient id="ca-watcher_power-orb" cx="50%" cy="44%" r="52%"><stop offset="0%" stop-color="hsl(54, 100%, 94%)"/><stop offset="52%" stop-color="hsl(46, 100%, 68%)"/><stop offset="100%" stop-color="hsla(292, 92%, 56%, 0)"/></radialGradient>`
  ),
  colorless_strike: wrapArtSvg(
    'colorless_strike',
    'hsl(214, 26%, 20%)',
    'hsl(230, 28%, 9%)',
    `<path d="M10 60 Q52 24 116 12" fill="none" stroke="url(#ca-colorless_strike-wake)" stroke-width="5.5" stroke-linecap="round" opacity="0.65"/>
     <path d="M22 65 Q68 38 120 26" fill="none" stroke="hsla(210, 62%, 78%, 0.45)" stroke-width="2" stroke-linecap="round"/>
     <polygon points="30,55 96,12 106,13 98,23 39,61" fill="rgba(0,0,0,0.44)" transform="translate(2 2)"/>
     <polygon points="30,54 96,11 106,12 98,22 39,60" fill="url(#ca-colorless_strike-blade)" stroke="hsl(206, 48%, 76%)" stroke-width="1.4"/>
     <line x1="38" y1="53" x2="99" y2="15" stroke="hsl(0, 0%, 100%)" stroke-width="1.5" opacity="0.9"/>
     <path d="M23 47 L42 62 L38 66 L19 51 Z" fill="hsl(44, 72%, 74%)" stroke="hsl(220, 28%, 24%)" stroke-width="1.1"/>
     <line x1="16" y1="64" x2="29" y2="55" stroke="hsl(216, 26%, 34%)" stroke-width="4" stroke-linecap="round"/>
     <path d="M104 6 L107 13 L114 15 L107 17 L104 24 L101 17 L94 15 L101 13 Z" fill="hsl(50, 100%, 92%)"/>
     <path d="M36 16 L38 22 L44 24 L38 26 L36 32 L34 26 L28 24 L34 22 Z" fill="hsl(200, 96%, 86%)" opacity="0.88"/>
     <circle cx="84" cy="40" r="2" fill="hsl(200, 96%, 86%)"/><circle cx="64" cy="14" r="1.8" fill="hsl(48, 100%, 88%)"/>`,
    'hsla(206, 56%, 76%, 0.24)',
    `<linearGradient id="ca-colorless_strike-blade" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(216, 20%, 54%)"/><stop offset="52%" stop-color="hsl(42, 32%, 90%)"/><stop offset="100%" stop-color="hsl(200, 100%, 96%)"/></linearGradient><linearGradient id="ca-colorless_strike-wake" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsla(206, 78%, 74%, 0.08)"/><stop offset="65%" stop-color="hsl(200, 92%, 82%)"/><stop offset="100%" stop-color="hsl(50, 100%, 92%)"/></linearGradient>`
  ),
  colorless_arcane: wrapArtSvg(
    'colorless_arcane',
    'hsl(222, 30%, 20%)',
    'hsl(262, 30%, 9%)',
    `<ellipse cx="64" cy="36" rx="54" ry="28" fill="url(#ca-colorless_arcane-glow)"/>
     <ellipse cx="64" cy="36" rx="44" ry="15" transform="rotate(-18 64 36)" fill="none" stroke="hsl(46, 86%, 76%)" stroke-width="1.6"/>
     <ellipse cx="64" cy="36" rx="44" ry="15" transform="rotate(18 64 36)" fill="none" stroke="hsla(200, 90%, 80%, 0.65)" stroke-width="1.5" stroke-dasharray="10 5"/>
     <polygon points="64,9 84,36 64,63 44,36" fill="rgba(0,0,0,0.44)" transform="translate(2 2)"/>
     <polygon points="64,8 84,36 64,64 44,36" fill="url(#ca-colorless_arcane-gem)" stroke="hsl(46, 88%, 78%)" stroke-width="1.9"/>
     <polygon points="64,8 84,36 64,36" fill="hsla(198, 100%, 94%, 0.28)"/>
     <line x1="44" y1="36" x2="84" y2="36" stroke="hsl(46, 92%, 80%)" stroke-width="1.2" opacity="0.72"/>
     <circle cx="64" cy="36" r="6.5" fill="hsl(196, 100%, 82%)" stroke="hsl(48, 100%, 88%)" stroke-width="1.4"/>
     <circle cx="64" cy="36" r="2.6" fill="hsl(0, 0%, 100%)"/>
     <circle cx="24" cy="22" r="2.2" fill="hsl(48, 100%, 84%)"/><circle cx="104" cy="50" r="2.2" fill="hsl(200, 100%, 86%)"/>
     <circle cx="104" cy="20" r="1.8" fill="hsl(48, 100%, 84%)"/><circle cx="24" cy="52" r="1.8" fill="hsl(200, 100%, 86%)"/>`,
    'hsla(46, 76%, 74%, 0.24)',
    `<linearGradient id="ca-colorless_arcane-gem" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(198, 96%, 84%)"/><stop offset="50%" stop-color="hsl(224, 52%, 44%)"/><stop offset="100%" stop-color="hsl(264, 48%, 24%)"/></linearGradient><radialGradient id="ca-colorless_arcane-glow" cx="50%" cy="50%" r="52%"><stop offset="0%" stop-color="hsla(198, 96%, 78%, 0.42)"/><stop offset="100%" stop-color="hsla(244, 60%, 24%, 0)"/></radialGradient>`
  ),
  colorless_tactics: wrapArtSvg(
    'colorless_tactics',
    'hsl(216, 26%, 20%)',
    'hsl(234, 28%, 9%)',
    `<path d="M12 36 H116 M64 4 V68" stroke="hsla(208, 66%, 78%, 0.26)" stroke-width="1.2" stroke-dasharray="4 4"/>
     <circle cx="64" cy="36" r="27" fill="url(#ca-colorless_tactics-dial)" stroke="hsl(44, 78%, 74%)" stroke-width="2"/>
     <circle cx="64" cy="36" r="21" fill="none" stroke="hsla(208, 72%, 78%, 0.52)" stroke-width="1.2" stroke-dasharray="3 3"/>
     <polygon points="48,20 64,31 80,20 69,36 80,52 64,41 48,52 59,36" fill="hsl(212, 46%, 68%)" opacity="0.82"/>
     <polygon points="64,11 71,36 64,61 57,36" fill="url(#ca-colorless_tactics-gold)" stroke="hsl(226, 36%, 18%)" stroke-width="1.1"/>
     <polygon points="39,36 64,29 89,36 64,43" fill="hsl(206, 68%, 82%)" stroke="hsl(226, 36%, 18%)" stroke-width="1.1"/>
     <polygon points="64,11 71,36 64,36" fill="hsl(52, 100%, 92%)"/>
     <circle cx="64" cy="36" r="5" fill="hsl(46, 96%, 78%)" stroke="hsl(224, 38%, 18%)" stroke-width="1.4"/>
     <circle cx="64" cy="36" r="2" fill="hsl(200, 100%, 92%)"/>
     <path d="M22 22 L32 28 M106 22 L96 28 M22 50 L32 44 M106 50 L96 44" stroke="hsl(208, 72%, 80%)" stroke-width="1.5" stroke-linecap="round" opacity="0.72"/>`,
    'hsla(212, 54%, 76%, 0.22)',
    `<linearGradient id="ca-colorless_tactics-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 96%, 86%)"/><stop offset="55%" stop-color="hsl(44, 76%, 64%)"/><stop offset="100%" stop-color="hsl(32, 52%, 38%)"/></linearGradient><radialGradient id="ca-colorless_tactics-dial" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(218, 34%, 28%)"/><stop offset="100%" stop-color="hsl(228, 34%, 13%)"/></radialGradient>`
  ),
  status_burn: wrapArtSvg(
    'status_burn',
    'hsl(10, 62%, 18%)',
    'hsl(20, 38%, 7%)',
    `<ellipse cx="64" cy="46" rx="56" ry="26" fill="url(#ca-status_burn-ash)"/>
     <path d="M0 58 Q32 46 64 56 Q96 66 128 52 V72 H0 Z" fill="hsl(14, 34%, 10%)"/>
     <path d="M36 22 Q48 8 64 14 Q80 8 92 22" fill="none" stroke="hsla(24, 24%, 38%, 0.55)" stroke-width="5" stroke-linecap="round"/>
     <path d="M64 10 Q86 26 78 56 Q64 64 50 56 Q42 26 64 10 Z" fill="url(#ca-status_burn-fire)" stroke="hsl(38, 98%, 68%)" stroke-width="1.6"/>
     <path d="M64 24 Q74 36 70 52 Q64 56 58 52 Q54 36 64 24 Z" fill="hsl(48, 100%, 76%)"/>
     <path d="M32 58 Q36 36 48 44 Q42 52 44 60 Z" fill="hsl(12, 92%, 44%)" opacity="0.82"/>
     <path d="M96 58 Q92 36 80 44 Q86 52 84 60 Z" fill="hsl(12, 92%, 44%)" opacity="0.82"/>
     <path d="M36 20 L92 54" stroke="hsl(0, 0%, 6%)" stroke-width="5.2" stroke-linecap="round" opacity="0.72"/>
     <path d="M38 21 L90 53" stroke="hsl(16, 100%, 58%)" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="6 4"/>
     <circle cx="28" cy="24" r="2" fill="hsl(32, 100%, 66%)"/><circle cx="100" cy="20" r="2.2" fill="hsl(44, 100%, 76%)"/>
     <circle cx="44" cy="60" r="1.8" fill="hsl(20, 100%, 60%)"/><circle cx="84" cy="58" r="1.8" fill="hsl(20, 100%, 60%)"/>`,
    'hsla(14, 96%, 50%, 0.28)',
    `<linearGradient id="ca-status_burn-fire" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(4, 92%, 38%)"/><stop offset="52%" stop-color="hsl(18, 98%, 52%)"/><stop offset="100%" stop-color="hsl(44, 100%, 74%)"/></linearGradient><radialGradient id="ca-status_burn-ash" cx="50%" cy="62%" r="54%"><stop offset="0%" stop-color="hsla(16, 98%, 50%, 0.42)"/><stop offset="100%" stop-color="hsla(12, 60%, 10%, 0)"/></radialGradient>`
  ),
  status_daze: wrapArtSvg(
    'status_daze',
    'hsl(226, 30%, 18%)',
    'hsl(250, 34%, 8%)',
    `<ellipse cx="64" cy="36" rx="56" ry="28" fill="url(#ca-status_daze-fog)"/>
     <ellipse cx="64" cy="36" rx="46" ry="20" fill="none" stroke="hsla(216, 62%, 74%, 0.32)" stroke-width="2" stroke-dasharray="8 6"/>
     <path d="M22 36 Q38 12 64 36 Q90 60 106 36" fill="none" stroke="url(#ca-status_daze-swirl)" stroke-width="3.6" stroke-linecap="round"/>
     <path d="M30 48 Q48 16 64 36 Q80 56 98 24" fill="none" stroke="hsla(256, 72%, 78%, 0.72)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M64 36 m-15 0 a15 15 0 1 1 28 7 a11 11 0 1 1 -21 -4 a7 7 0 1 1 12 2" fill="none" stroke="hsl(206, 90%, 84%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M32 14 L35 20 L41 22 L35 24 L32 30 L29 24 L23 22 L29 20 Z" fill="hsl(204, 92%, 84%)"/>
     <path d="M96 42 L99 48 L105 50 L99 52 L96 58 L93 52 L87 50 L93 48 Z" fill="hsl(204, 92%, 84%)"/>
     <path d="M92 12 L94 17 L99 18 L94 19 L92 24 L90 19 L85 18 L90 17 Z" fill="hsl(258, 86%, 82%)" opacity="0.88"/>
     <path d="M34 48 L36 53 L41 54 L36 55 L34 60 L32 55 L27 54 L32 53 Z" fill="hsl(258, 86%, 82%)" opacity="0.88"/>
     <circle cx="18" cy="24" r="2.2" fill="hsla(214, 72%, 80%, 0.65)"/><circle cx="110" cy="46" r="2.2" fill="hsla(214, 72%, 80%, 0.65)"/>`,
    'hsla(216, 58%, 66%, 0.24)',
    `<radialGradient id="ca-status_daze-fog" cx="50%" cy="50%" r="54%"><stop offset="0%" stop-color="hsla(224, 68%, 74%, 0.34)"/><stop offset="100%" stop-color="hsla(248, 48%, 18%, 0)"/></radialGradient><linearGradient id="ca-status_daze-swirl" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(204, 86%, 82%)"/><stop offset="55%" stop-color="hsl(228, 66%, 72%)"/><stop offset="100%" stop-color="hsl(268, 64%, 72%)"/></linearGradient>`
  ),
  curse_abyss: wrapArtSvg(
    'curse_abyss',
    'hsl(278, 52%, 14%)',
    'hsl(264, 58%, 5%)',
    `<ellipse cx="64" cy="36" rx="58" ry="30" fill="url(#ca-curse_abyss-void)"/>
     <path d="M4 14 Q26 24 38 38 M4 58 Q26 48 40 42 M124 14 Q102 24 90 38 M124 58 Q102 48 88 42" fill="none" stroke="hsl(284, 74%, 44%)" stroke-width="3" stroke-linecap="round" opacity="0.72"/>
     <path d="M10 36 Q28 28 38 36 M118 36 Q100 28 90 36" fill="none" stroke="hsl(332, 88%, 52%)" stroke-width="2" stroke-linecap="round" opacity="0.65"/>
     <path d="M40 37 A24 24 0 1 1 88 37 C88 46 82 51 77 54 V63 H51 V54 C46 51 40 46 40 37 Z" fill="rgba(0,0,0,0.55)" transform="translate(2 2)"/>
     <path d="M40 36 A24 24 0 1 1 88 36 C88 45 82 50 77 53 V62 H51 V53 C46 50 40 45 40 36 Z" fill="url(#ca-curse_abyss-skull)" stroke="hsl(292, 82%, 62%)" stroke-width="1.8"/>
     <ellipse cx="53" cy="35" rx="6.5" ry="5.5" fill="hsl(268, 64%, 8%)"/>
     <ellipse cx="75" cy="35" rx="6.5" ry="5.5" fill="hsl(268, 64%, 8%)"/>
     <polygon points="48,35 54,32 58,36 53,38" fill="hsl(346, 100%, 60%)"/>
     <polygon points="80,35 74,32 70,36 75,38" fill="hsl(346, 100%, 60%)"/>
     <polygon points="64,40 67,46 61,46" fill="hsl(268, 64%, 8%)"/>
     <path d="M56 54 V62 M64 53 V62 M72 54 V62" stroke="hsl(268, 64%, 8%)" stroke-width="1.8"/>
     <path d="M48 20 Q64 14 80 20" fill="none" stroke="hsla(294, 82%, 78%, 0.45)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="24" cy="18" r="2" fill="hsl(342, 96%, 60%)"/><circle cx="104" cy="18" r="2" fill="hsl(342, 96%, 60%)"/>`,
    'hsla(292, 86%, 48%, 0.28)',
    `<linearGradient id="ca-curse_abyss-skull" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(282, 34%, 44%)"/><stop offset="55%" stop-color="hsl(274, 42%, 24%)"/><stop offset="100%" stop-color="hsl(264, 52%, 11%)"/></linearGradient><radialGradient id="ca-curse_abyss-void" cx="50%" cy="46%" r="54%"><stop offset="0%" stop-color="hsla(332, 92%, 44%, 0.34)"/><stop offset="55%" stop-color="hsla(282, 84%, 30%, 0.22)"/><stop offset="100%" stop-color="hsla(264, 72%, 8%, 0)"/></radialGradient>`
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
