// Bespoke 16:9 SVG card illustrations for Ironclad cards.
import { wrapArtSvg } from './wrap.js';

export const IRONCLAD_CARD_ART = {
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
  warcry: wrapArtSvg(
    'warcry',
    'hsl(12, 68%, 18%)',
    'hsl(352, 56%, 8%)',
    `<circle cx="44" cy="40" r="34" fill="url(#ca-warcry-aura)"/>
     <path d="M58 18 Q84 36 58 54" fill="none" stroke="hsl(42, 100%, 72%)" stroke-width="2.6" stroke-linecap="round" opacity="0.9"/>
     <path d="M72 11 Q104 36 72 61" fill="none" stroke="hsl(28, 100%, 62%)" stroke-width="2.4" stroke-linecap="round" opacity="0.82"/>
     <path d="M88 6 Q122 36 88 66" fill="none" stroke="hsl(10, 96%, 56%)" stroke-width="2" stroke-linecap="round" opacity="0.68"/>
     <path d="M16 44 C18 28 32 22 46 25 L62 15 L60 56 L44 48 C30 50 18 52 16 44 Z" fill="rgba(0,0,0,0.44)" transform="translate(2 2)"/>
     <path d="M16 43 C18 27 32 21 46 24 L62 14 L60 55 L44 47 C30 49 18 51 16 43 Z" fill="url(#ca-warcry-horn)" stroke="hsl(44, 96%, 72%)" stroke-width="1.8" stroke-linejoin="round"/>
     <ellipse cx="60" cy="34.5" rx="5.5" ry="19.5" fill="hsl(8, 72%, 14%)" stroke="hsl(44, 98%, 76%)" stroke-width="1.6"/>
     <ellipse cx="60" cy="34.5" rx="2.6" ry="11" fill="hsl(36, 100%, 64%)" opacity="0.85"/>
     <path d="M27 28 C30 34 30 42 27 47 M39 25 C42 33 42 41 39 47" fill="none" stroke="hsl(42, 92%, 68%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M68 35 L98 27 M69 35 L108 35 M68 35 L98 44" stroke="hsl(52, 100%, 90%)" stroke-width="1.8" stroke-linecap="round" opacity="0.88"/>
     <circle cx="98" cy="18" r="2.3" fill="hsl(48, 100%, 84%)"/><circle cx="112" cy="35" r="2.6" fill="hsl(38, 100%, 74%)"/><circle cx="102" cy="54" r="2" fill="hsl(18, 100%, 66%)"/>`,
    'hsla(26, 98%, 56%, 0.30)',
    `<linearGradient id="ca-warcry-horn" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(38, 84%, 64%)"/><stop offset="52%" stop-color="hsl(18, 78%, 40%)"/><stop offset="100%" stop-color="hsl(356, 62%, 22%)"/></linearGradient><radialGradient id="ca-warcry-aura" cx="42%" cy="52%" r="54%"><stop offset="0%" stop-color="hsla(44, 100%, 70%, 0.52)"/><stop offset="55%" stop-color="hsla(14, 96%, 52%, 0.24)"/><stop offset="100%" stop-color="hsla(352, 86%, 24%, 0)"/></radialGradient>`
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
  pummel: wrapArtSvg(
    'pummel',
    'hsl(4, 70%, 18%)',
    'hsl(350, 62%, 8%)',
    `<circle cx="96" cy="36" r="28" fill="url(#ca-pummel-impact)"/>
     <path d="M6 22 H54 M2 36 H62 M8 50 H56" stroke="url(#ca-pummel-trail)" stroke-width="3.4" stroke-linecap="round" opacity="0.78"/>
     <g opacity="0.45" transform="translate(-20 -10) scale(0.84)">
       <rect x="44" y="22" width="32" height="24" rx="7" fill="hsl(14, 76%, 36%)" stroke="hsl(36, 92%, 62%)" stroke-width="1.3"/>
     </g>
     <g opacity="0.52" transform="translate(-14 13) scale(0.86)">
       <rect x="44" y="22" width="32" height="24" rx="7" fill="hsl(6, 78%, 34%)" stroke="hsl(32, 92%, 58%)" stroke-width="1.3"/>
     </g>
     <path d="M36 27 H76 C83 27 88 31 88 38 C88 45 83 50 75 50 H36 C31 50 28 45 28 38 C28 32 31 27 36 27 Z" fill="rgba(0,0,0,0.46)" transform="translate(2 2)"/>
     <path d="M36 25 H76 C83 25 88 30 88 37 C88 44 83 49 75 49 H36 C31 49 28 44 28 37 C28 30 31 25 36 25 Z" fill="url(#ca-pummel-gauntlet)" stroke="hsl(42, 96%, 72%)" stroke-width="1.9" stroke-linejoin="round"/>
     <path d="M58 26 V48 M68 26 V48 M77 27 V47 M36 33 H54 M36 41 H54" stroke="hsl(354, 48%, 18%)" stroke-width="1.7" stroke-linecap="round"/>
     <path d="M88 37 L116 18 M90 37 L122 37 M88 37 L116 56 M86 24 L106 11 M86 50 L106 63" stroke="hsl(48, 100%, 84%)" stroke-width="2.1" stroke-linecap="round"/>
     <polygon points="88,28 100,37 88,46 93,37" fill="hsl(54, 100%, 94%)"/>
     <circle cx="114" cy="24" r="2.2" fill="hsl(44, 100%, 78%)"/><circle cx="118" cy="48" r="2.3" fill="hsl(20, 100%, 66%)"/>`,
    'hsla(14, 98%, 56%, 0.32)',
    `<linearGradient id="ca-pummel-gauntlet" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(38, 34%, 76%)"/><stop offset="48%" stop-color="hsl(14, 62%, 44%)"/><stop offset="100%" stop-color="hsl(352, 62%, 20%)"/></linearGradient><linearGradient id="ca-pummel-trail" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(4, 96%, 52%, 0)"/><stop offset="65%" stop-color="hsl(24, 100%, 62%)"/><stop offset="100%" stop-color="hsl(50, 100%, 88%)"/></linearGradient><radialGradient id="ca-pummel-impact" cx="50%" cy="50%" r="52%"><stop offset="0%" stop-color="hsla(52, 100%, 92%, 0.72)"/><stop offset="52%" stop-color="hsla(18, 98%, 56%, 0.34)"/><stop offset="100%" stop-color="hsla(356, 86%, 30%, 0)"/></radialGradient>`
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
};
