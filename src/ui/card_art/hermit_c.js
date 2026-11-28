// Bespoke 16:9 SVG card illustrations for The Hermit (part C: 8 uncommon + 17 rare + 1 special curse = 26 cards).
import { wrapArtSvg } from './wrap.js';

export const HERMIT_CARD_ART_C = {
  shadow_cloak: wrapArtSvg(
    'shadow_cloak',
    'hsl(268, 52%, 17%)',
    'hsl(242, 48%, 7%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-shadow_cloak-aura)"/>
     <ellipse cx="64" cy="65" rx="46" ry="5.5" fill="hsla(0,0%,0%,0.54)"/>
     <path d="M18 62 Q34 22 54 14 L64 20 L74 14 Q94 22 110 62 Q86 52 64 60 Q42 52 18 62 Z" fill="hsl(252, 46%, 8%)" opacity="0.68" transform="translate(2,2)"/>
     <path d="M18 62 Q34 20 54 12 L64 18 L74 12 Q94 20 110 62 Q86 50 64 58 Q42 50 18 62 Z" fill="url(#ca-shadow_cloak-cloth)" stroke="hsl(282, 86%, 68%)" stroke-width="1.5" stroke-linejoin="round"/>
     <path d="M48 16 L58 26 L64 22 L70 26 L80 16 L72 10 L64 15 L56 10 Z" fill="hsl(258, 42%, 16%)" stroke="hsl(44, 88%, 68%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M40 30 Q52 44 46 56 M88 30 Q76 44 82 56 M64 22 V56" fill="none" stroke="hsl(274, 58%, 42%)" stroke-width="1.2" opacity="0.72"/>
     <circle cx="64" cy="23" r="2.6" fill="hsl(46, 98%, 74%)" stroke="hsl(28, 60%, 24%)" stroke-width="0.9"/>
     <path d="M10 46 Q20 34 32 42 Q26 52 38 56" fill="none" stroke="hsl(286, 92%, 72%)" stroke-width="1.7" stroke-linecap="round"/>
     <path d="M118 46 Q108 34 96 42 Q102 52 90 56" fill="none" stroke="hsl(286, 92%, 72%)" stroke-width="1.7" stroke-linecap="round"/>
     <path d="M24 20 L38 25 V37 C38 44 31 49 24 52 C17 49 10 44 10 37 V25 Z" fill="url(#ca-shadow_cloak-shield)" stroke="hsl(196, 94%, 76%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M24 25 L33 28 V36 C33 41 29 44 24 46 C19 44 15 41 15 36 V28 Z" fill="none" stroke="hsl(46, 98%, 78%)" stroke-width="0.9" stroke-dasharray="3 2"/>
     <path d="M104 20 L118 25 V37 C118 44 111 49 104 52 C97 49 90 44 90 37 V25 Z" fill="url(#ca-shadow_cloak-shield)" stroke="hsl(196, 94%, 76%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M104 25 L113 28 V36 C113 41 109 44 104 46 C99 44 95 41 95 36 V28 Z" fill="none" stroke="hsl(46, 98%, 78%)" stroke-width="0.9" stroke-dasharray="3 2"/>
     <circle cx="24" cy="35" r="2.2" fill="hsl(194, 100%, 88%)"/><circle cx="104" cy="35" r="2.2" fill="hsl(194, 100%, 88%)"/>
     <circle cx="44" cy="14" r="1.5" fill="hsl(292, 98%, 80%)"/><circle cx="84" cy="14" r="1.5" fill="hsl(292, 98%, 80%)"/>
     <circle cx="16" cy="56" r="1.4" fill="hsl(48, 100%, 84%)"/><circle cx="112" cy="56" r="1.4" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(282, 86%, 58%, 0.28)',
    `<radialGradient id="ca-shadow_cloak-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(284, 92%, 64%)" stop-opacity="0.68"/><stop offset="60%" stop-color="hsl(258, 72%, 34%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(242, 50%, 8%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-shadow_cloak-cloth" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(264, 44%, 30%)"/><stop offset="55%" stop-color="hsl(254, 46%, 18%)"/><stop offset="100%" stop-color="hsl(244, 52%, 10%)"/></linearGradient><linearGradient id="ca-shadow_cloak-shield" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(194, 96%, 72%, 0.48)"/><stop offset="55%" stop-color="hsla(276, 86%, 54%, 0.42)"/><stop offset="100%" stop-color="hsla(250, 62%, 22%, 0.65)"/></linearGradient>`
  ),

  shortfuse: wrapArtSvg(
    'shortfuse',
    'hsl(14, 68%, 19%)',
    'hsl(354, 54%, 8%)',
    `<circle cx="96" cy="20" r="24" fill="url(#ca-shortfuse-blast)"/>
     <ellipse cx="52" cy="63" rx="34" ry="5" fill="hsla(0,0%,0%,0.54)"/>
     <g transform="rotate(-18 52 42)">
       <rect x="26" y="20" width="46" height="44" rx="5" fill="hsl(8, 52%, 8%)" opacity="0.62" transform="translate(3,3)"/>
       <rect x="26" y="20" width="11" height="44" rx="4" fill="url(#ca-shortfuse-stick)" stroke="hsl(36, 86%, 64%)" stroke-width="1.2"/>
       <rect x="37" y="17" width="11" height="47" rx="4" fill="url(#ca-shortfuse-stick)" stroke="hsl(40, 90%, 68%)" stroke-width="1.2"/>
       <rect x="48" y="19" width="11" height="45" rx="4" fill="url(#ca-shortfuse-stick)" stroke="hsl(36, 86%, 64%)" stroke-width="1.2"/>
       <rect x="59" y="22" width="10" height="42" rx="4" fill="url(#ca-shortfuse-stick)" stroke="hsl(32, 78%, 56%)" stroke-width="1.1"/>
       <rect x="24" y="30" width="47" height="6" rx="1.5" fill="hsl(24, 34%, 20%)" stroke="hsl(44, 92%, 66%)" stroke-width="1.1"/>
       <rect x="24" y="49" width="47" height="6" rx="1.5" fill="hsl(24, 34%, 20%)" stroke="hsl(44, 92%, 66%)" stroke-width="1.1"/>
       <circle cx="32" cy="33" r="1.4" fill="hsl(48, 100%, 82%)"/><circle cx="62" cy="33" r="1.4" fill="hsl(48, 100%, 82%)"/>
       <circle cx="32" cy="52" r="1.4" fill="hsl(48, 100%, 82%)"/><circle cx="62" cy="52" r="1.4" fill="hsl(48, 100%, 82%)"/>
       <line x1="42" y1="22" x2="42" y2="28" stroke="hsla(50, 100%, 92%, 0.55)" stroke-width="1.2"/>
     </g>
     <path d="M52 21 Q66 10 80 18 Q88 22 95 19" fill="none" stroke="hsl(36, 48%, 62%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M52 21 Q66 10 80 18 Q88 22 95 19" fill="none" stroke="hsl(22, 42%, 28%)" stroke-width="1.2" stroke-dasharray="3 2.5"/>
     <polygon points="96,4 99,14 110,9 102,19 114,23 102,25 108,35 97,27 93,38 91,26 80,31 88,21 79,14 91,15" fill="url(#ca-shortfuse-spark)" stroke="hsl(54, 100%, 94%)" stroke-width="1"/>
     <circle cx="96" cy="20" r="4.2" fill="hsl(56, 100%, 96%)"/>
     <path d="M106 8 L118 4 M112 24 L122 26 M104 34 L114 42 M82 8 L74 4" stroke="hsl(46, 100%, 82%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="116" cy="14" r="1.7" fill="hsl(50, 100%, 90%)"/><circle cx="112" cy="38" r="1.6" fill="hsl(26, 100%, 68%)"/>
     <circle cx="78" cy="36" r="1.5" fill="hsl(44, 100%, 82%)"/>`,
    'hsla(36, 100%, 58%, 0.30)',
    `<radialGradient id="ca-shortfuse-blast" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 88%)" stop-opacity="0.92"/><stop offset="48%" stop-color="hsl(26, 100%, 58%)" stop-opacity="0.48"/><stop offset="100%" stop-color="hsl(10, 72%, 14%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-shortfuse-stick" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(4, 84%, 56%)"/><stop offset="55%" stop-color="hsl(356, 78%, 40%)"/><stop offset="100%" stop-color="hsl(348, 72%, 22%)"/></linearGradient><radialGradient id="ca-shortfuse-spark" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 96%)"/><stop offset="60%" stop-color="hsl(42, 100%, 66%)"/><stop offset="100%" stop-color="hsl(14, 100%, 52%)"/></radialGradient>`
  ),

  showdown: wrapArtSvg(
    'showdown',
    'hsl(32, 72%, 22%)',
    'hsl(16, 56%, 8%)',
    `<circle cx="64" cy="38" r="30" fill="url(#ca-showdown-sun)"/>
     <circle cx="64" cy="40" r="17" fill="hsl(48, 100%, 84%)" opacity="0.9"/>
     <path d="M64 8 V20 M34 14 L44 24 M94 14 L84 24 M16 32 L32 36 M112 32 L96 36" stroke="hsl(48, 100%, 84%)" stroke-width="1.3" stroke-linecap="round" opacity="0.68"/>
     <path d="M4 54 V24 L20 24 V32 L30 32 V54 Z" fill="hsl(18, 44%, 11%)" stroke="hsl(34, 62%, 38%)" stroke-width="1"/>
     <path d="M124 54 V22 L106 22 V30 L96 30 V54 Z" fill="hsl(18, 44%, 11%)" stroke="hsl(34, 62%, 38%)" stroke-width="1"/>
     <path d="M0 54 H128 V72 H0 Z" fill="url(#ca-showdown-dust)"/>
     <path d="M56 54 L26 72 M72 54 L102 72" stroke="hsl(38, 76%, 54%)" stroke-width="1.2" opacity="0.58"/>
     <path d="M24 22 L76 48 L72 55 L50 45 L44 64 L32 60 L38 40 L20 30 Z" fill="hsl(16, 48%, 8%)" opacity="0.62" transform="translate(1.5,2)"/>
     <path d="M104 22 L52 48 L56 55 L78 45 L84 64 L96 60 L90 40 L108 30 Z" fill="hsl(16, 48%, 8%)" opacity="0.62" transform="translate(-1.5,2)"/>
     <path d="M24 22 L76 48 L72 55 L50 45 L44 64 L32 60 L38 40 L20 30 Z" fill="url(#ca-showdown-gun)" stroke="hsl(46, 96%, 72%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M104 22 L52 48 L56 55 L78 45 L84 64 L96 60 L90 40 L108 30 Z" fill="url(#ca-showdown-gun)" stroke="hsl(46, 96%, 72%)" stroke-width="1.4" stroke-linejoin="round"/>
     <circle cx="48" cy="39" r="4.5" fill="hsl(218, 22%, 22%)" stroke="hsl(46, 96%, 72%)" stroke-width="1.2"/>
     <circle cx="80" cy="39" r="4.5" fill="hsl(218, 22%, 22%)" stroke="hsl(46, 96%, 72%)" stroke-width="1.2"/>
     <polygon points="64,34 67,41 74,44 67,47 64,54 61,47 54,44 61,41" fill="hsl(52, 100%, 92%)" stroke="hsl(24, 100%, 60%)" stroke-width="1"/>
     <circle cx="48" cy="39" r="1.5" fill="hsl(48, 100%, 84%)"/><circle cx="80" cy="39" r="1.5" fill="hsl(48, 100%, 84%)"/>
     <circle cx="20" cy="14" r="1.5" fill="hsl(48, 100%, 86%)"/><circle cx="108" cy="14" r="1.5" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(42, 100%, 62%, 0.34)',
    `<radialGradient id="ca-showdown-sun" cx="50%" cy="52%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 90%)" stop-opacity="0.9"/><stop offset="52%" stop-color="hsl(34, 100%, 58%)" stop-opacity="0.5"/><stop offset="100%" stop-color="hsl(18, 68%, 14%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-showdown-gun" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(216, 22%, 52%)"/><stop offset="52%" stop-color="hsl(220, 24%, 26%)"/><stop offset="100%" stop-color="hsl(24, 48%, 18%)"/></linearGradient><linearGradient id="ca-showdown-dust" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(28, 54%, 24%)"/><stop offset="100%" stop-color="hsl(16, 48%, 10%)"/></linearGradient>`
  ),

  snipe: wrapArtSvg(
    'snipe',
    'hsl(352, 58%, 18%)',
    'hsl(216, 46%, 8%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-snipe-bullseye)"/>
     <line x1="6" y1="10" x2="54" y2="32" stroke="url(#ca-snipe-beam)" stroke-width="2" stroke-linecap="round"/>
     <line x1="122" y1="62" x2="74" y2="40" stroke="url(#ca-snipe-beam)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="57" cy="36" r="22" fill="none" stroke="url(#ca-snipe-ring)" stroke-width="1.8"/>
     <circle cx="71" cy="36" r="22" fill="none" stroke="url(#ca-snipe-ring)" stroke-width="1.8"/>
     <circle cx="57" cy="36" r="15" fill="none" stroke="hsl(44, 96%, 72%)" stroke-width="0.9" stroke-dasharray="4 3"/>
     <circle cx="71" cy="36" r="15" fill="none" stroke="hsl(44, 96%, 72%)" stroke-width="0.9" stroke-dasharray="4 3"/>
     <circle cx="64" cy="36" r="10.5" fill="hsla(356, 92%, 44%, 0.42)" stroke="hsl(4, 100%, 66%)" stroke-width="1.8"/>
     <circle cx="64" cy="36" r="5.2" fill="hsl(2, 100%, 60%)" stroke="hsl(52, 100%, 92%)" stroke-width="1.1"/>
     <circle cx="64" cy="36" r="2" fill="hsl(56, 100%, 98%)"/>
     <line x1="64" y1="4" x2="64" y2="24" stroke="hsl(48, 100%, 82%)" stroke-width="1.4"/>
     <line x1="64" y1="48" x2="64" y2="68" stroke="hsl(48, 100%, 82%)" stroke-width="1.4"/>
     <line x1="22" y1="36" x2="52" y2="36" stroke="hsl(48, 100%, 82%)" stroke-width="1.4"/>
     <line x1="76" y1="36" x2="106" y2="36" stroke="hsl(48, 100%, 82%)" stroke-width="1.4"/>
     <path d="M26 20 L18 20 V28 M102 20 L110 20 V28 M26 52 L18 52 V44 M102 52 L110 52 V44" fill="none" stroke="hsl(4, 98%, 68%)" stroke-width="1.5" stroke-linecap="round"/>
     <line x1="42" y1="33" x2="42" y2="39" stroke="hsl(46, 100%, 78%)" stroke-width="1.2"/>
     <line x1="86" y1="33" x2="86" y2="39" stroke="hsl(46, 100%, 78%)" stroke-width="1.2"/>
     <circle cx="32" cy="14" r="1.5" fill="hsl(48, 100%, 86%)"/><circle cx="96" cy="58" r="1.5" fill="hsl(4, 100%, 70%)"/>`,
    'hsla(4, 98%, 56%, 0.30)',
    `<radialGradient id="ca-snipe-bullseye" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(4, 100%, 66%)" stop-opacity="0.82"/><stop offset="55%" stop-color="hsl(352, 86%, 40%)" stop-opacity="0.3"/><stop offset="100%" stop-color="hsl(216, 48%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-snipe-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 80%)"/><stop offset="55%" stop-color="hsl(36, 86%, 56%)"/><stop offset="100%" stop-color="hsl(212, 30%, 54%)"/></linearGradient><linearGradient id="ca-snipe-beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(4, 100%, 64%)" stop-opacity="0.18"/><stop offset="100%" stop-color="hsl(50, 100%, 88%)" stop-opacity="0.92"/></linearGradient>`
  ),

  spite: wrapArtSvg(
    'spite',
    'hsl(284, 50%, 17%)',
    'hsl(350, 48%, 7%)',
    `<circle cx="62" cy="36" r="30" fill="url(#ca-spite-aura)"/>
     <ellipse cx="56" cy="65" rx="34" ry="5" fill="hsla(0,0%,0%,0.54)"/>
     <path d="M16 68 L30 46 L38 40 L44 48 L56 44 L62 50 L48 64 L36 70 Z" fill="hsl(268, 36%, 14%)" stroke="hsl(292, 74%, 62%)" stroke-width="1.3" stroke-linejoin="round"/>
     <polygon points="44,18 62,14 66,34 52,42 40,32" fill="url(#ca-spite-curse)" stroke="hsl(354, 92%, 62%)" stroke-width="1.4" stroke-linejoin="round"/>
     <polygon points="56,36 72,30 76,50 60,54" fill="url(#ca-spite-curse)" stroke="hsl(294, 88%, 68%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M46 28 L68 38 M64 18 L52 46" stroke="hsl(52, 100%, 90%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M46 14 Q52 4 60 12 Q68 6 70 18" fill="none" stroke="hsl(352, 96%, 64%)" stroke-width="1.8" stroke-linecap="round"/>
     <polygon points="14,22 28,16 32,28 20,34" fill="url(#ca-spite-shard)" stroke="hsl(188, 100%, 84%)" stroke-width="1.2"/>
     <polygon points="10,40 24,36 26,48 14,50" fill="url(#ca-spite-shard)" stroke="hsl(188, 100%, 84%)" stroke-width="1.2"/>
     <polygon points="28,8 38,6 40,16 30,18" fill="url(#ca-spite-shard)" stroke="hsl(48, 100%, 86%)" stroke-width="1.1"/>
     <rect x="82" y="10" width="21" height="30" rx="2.8" transform="rotate(14 92 25)" fill="url(#ca-spite-card)" stroke="hsl(48, 100%, 82%)" stroke-width="1.5"/>
     <rect x="96" y="24" width="21" height="30" rx="2.8" transform="rotate(24 106 39)" fill="url(#ca-spite-card)" stroke="hsl(50, 100%, 86%)" stroke-width="1.5"/>
     <polygon points="92,19 95,25 92,31 89,25" fill="hsl(50, 100%, 88%)"/>
     <path d="M68 24 Q80 18 86 16 M72 38 Q86 36 96 34" fill="none" stroke="hsl(48, 100%, 80%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="58" cy="33" r="3.4" fill="hsl(54, 100%, 94%)"/>
     <circle cx="20" cy="14" r="1.5" fill="hsl(186, 100%, 84%)"/><circle cx="114" cy="16" r="1.6" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(296, 86%, 56%, 0.28)',
    `<radialGradient id="ca-spite-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(350, 96%, 60%)" stop-opacity="0.72"/><stop offset="56%" stop-color="hsl(288, 84%, 46%)" stop-opacity="0.3"/><stop offset="100%" stop-color="hsl(280, 50%, 8%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-spite-curse" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(286, 46%, 22%)"/><stop offset="100%" stop-color="hsl(350, 56%, 10%)"/></linearGradient><linearGradient id="ca-spite-shard" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(186, 100%, 78%)"/><stop offset="100%" stop-color="hsl(212, 84%, 44%)"/></linearGradient><linearGradient id="ca-spite-card" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(34, 54%, 34%)"/><stop offset="100%" stop-color="hsl(24, 50%, 16%)"/></linearGradient>`
  ),

  take_aim: wrapArtSvg(
    'take_aim',
    'hsl(28, 56%, 19%)',
    'hsl(214, 44%, 8%)',
    `<circle cx="102" cy="22" r="22" fill="url(#ca-take_aim-glow)"/>
     <path d="M6 66 L36 52 L74 58 L122 46 V72 H6 Z" fill="hsl(216, 36%, 10%)" opacity="0.68"/>
     <path d="M10 30 Q28 20 48 26 Q34 32 10 30 Z" fill="hsl(22, 36%, 16%)" stroke="hsl(40, 80%, 58%)" stroke-width="1.3"/>
     <path d="M16 26 L20 15 Q30 12 38 16 L41 25 Z" fill="hsl(22, 36%, 16%)" stroke="hsl(40, 80%, 58%)" stroke-width="1.2"/>
     <path d="M22 36 L34 34 L28 40 Z" fill="hsl(46, 100%, 78%)"/>
     <circle cx="29" cy="36" r="1.6" fill="hsl(12, 100%, 58%)"/>
     <path d="M14 68 L28 48 L48 44 L54 54 L38 68 Z" fill="hsl(24, 38%, 22%)" stroke="hsl(38, 72%, 56%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M36 46 L86 24 L90 33 L46 54 Z" fill="hsl(216, 34%, 10%)" opacity="0.64" transform="translate(2,2)"/>
     <path d="M36 46 L86 24 L90 33 L46 54 Z" fill="url(#ca-take_aim-barrel)" stroke="hsl(44, 92%, 70%)" stroke-width="1.5" stroke-linejoin="round"/>
     <line x1="42" y1="45" x2="84" y2="27" stroke="hsla(50, 100%, 92%, 0.65)" stroke-width="1.2"/>
     <polygon points="82,25 86,19 88,24" fill="hsl(48, 100%, 82%)" stroke="hsl(26, 60%, 24%)" stroke-width="0.8"/>
     <path d="M40 42 L44 37 L48 40" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.5" stroke-linecap="round"/>
     <line x1="34" y1="36" x2="114" y2="18" stroke="url(#ca-take_aim-beam)" stroke-width="2.2" stroke-dasharray="7 3" stroke-linecap="round"/>
     <circle cx="106" cy="20" r="10" fill="none" stroke="hsl(46, 100%, 78%)" stroke-width="1.4"/>
     <polygon points="106,13 109,20 106,27 103,20" fill="hsl(52, 100%, 92%)" stroke="hsl(22, 100%, 60%)" stroke-width="1"/>
     <line x1="106" y1="7" x2="106" y2="13" stroke="hsl(46, 100%, 82%)" stroke-width="1.2"/>
     <line x1="106" y1="27" x2="106" y2="33" stroke="hsl(46, 100%, 82%)" stroke-width="1.2"/>
     <circle cx="62" cy="14" r="1.4" fill="hsl(48, 100%, 84%)"/><circle cx="116" cy="36" r="1.5" fill="hsl(40, 100%, 74%)"/>`,
    'hsla(44, 98%, 60%, 0.28)',
    `<radialGradient id="ca-take_aim-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(50, 100%, 84%)" stop-opacity="0.78"/><stop offset="60%" stop-color="hsl(34, 96%, 54%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(214, 46%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-take_aim-barrel" x1="0" y1="0" x2="1" y2="0.5"><stop offset="0%" stop-color="hsl(214, 22%, 64%)"/><stop offset="55%" stop-color="hsl(218, 22%, 34%)"/><stop offset="100%" stop-color="hsl(220, 26%, 18%)"/></linearGradient><linearGradient id="ca-take_aim-beam" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(44, 100%, 74%)" stop-opacity="0.45"/><stop offset="100%" stop-color="hsl(54, 100%, 94%)" stop-opacity="0.96"/></linearGradient>`
  ),

  take_cover: wrapArtSvg(
    'take_cover',
    'hsl(26, 52%, 18%)',
    'hsl(212, 42%, 8%)',
    `<circle cx="54" cy="36" r="28" fill="url(#ca-take_cover-flash)"/>
     <ellipse cx="80" cy="65" rx="38" ry="5" fill="hsla(0,0%,0%,0.54)"/>
     <path d="M58 14 L112 18 L104 62 L52 60 Z" fill="hsl(18, 44%, 9%)" opacity="0.65" transform="translate(3,3)"/>
     <path d="M58 14 L112 18 L104 62 L52 60 Z" fill="url(#ca-take_cover-oak)" stroke="hsl(36, 76%, 56%)" stroke-width="1.6" stroke-linejoin="round"/>
     <line x1="56" y1="28" x2="109" y2="31" stroke="hsl(20, 48%, 14%)" stroke-width="1.4"/>
     <line x1="54" y1="43" x2="107" y2="46" stroke="hsl(20, 48%, 14%)" stroke-width="1.4"/>
     <line x1="108" y1="24" x2="122" y2="32" stroke="hsl(24, 44%, 24%)" stroke-width="3.6" stroke-linecap="round"/>
     <line x1="104" y1="52" x2="120" y2="58" stroke="hsl(24, 44%, 24%)" stroke-width="3.6" stroke-linecap="round"/>
     <path d="M62 22 L88 24 L84 54 L58 52 Z" fill="url(#ca-take_cover-iron)" stroke="hsl(44, 92%, 70%)" stroke-width="1.5" stroke-linejoin="round"/>
     <circle cx="65" cy="26" r="1.6" fill="hsl(46, 100%, 82%)"/><circle cx="83" cy="28" r="1.6" fill="hsl(46, 100%, 82%)"/>
     <circle cx="63" cy="48" r="1.6" fill="hsl(46, 100%, 82%)"/><circle cx="80" cy="50" r="1.6" fill="hsl(46, 100%, 82%)"/>
     <path d="M6 16 L54 28 L24 10" fill="none" stroke="hsl(46, 100%, 80%)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M4 34 L54 40 L20 50" fill="none" stroke="hsl(34, 100%, 68%)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M10 56 L52 50 L28 64" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <polygon points="56,28 50,23 58,24 62,18 61,27 68,29 60,32 58,38 55,31 48,32" fill="hsl(54, 100%, 94%)"/>
     <polygon points="54,40 48,37 55,37 58,32 58,39 64,41 57,43 56,49 53,43 47,44" fill="hsl(46, 100%, 86%)"/>
     <circle cx="38" cy="18" r="1.6" fill="hsl(48, 100%, 88%)"/><circle cx="34" cy="58" r="1.6" fill="hsl(32, 100%, 72%)"/>`,
    'hsla(38, 96%, 58%, 0.28)',
    `<radialGradient id="ca-take_cover-flash" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 84%)" stop-opacity="0.72"/><stop offset="60%" stop-color="hsl(28, 96%, 52%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(212, 46%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-take_cover-oak" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(28, 52%, 34%)"/><stop offset="100%" stop-color="hsl(20, 48%, 16%)"/></linearGradient><linearGradient id="ca-take_cover-iron" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 24%, 58%)"/><stop offset="55%" stop-color="hsl(216, 22%, 34%)"/><stop offset="100%" stop-color="hsl(220, 24%, 18%)"/></linearGradient>`
  ),

  virtue: wrapArtSvg(
    'virtue',
    'hsl(42, 62%, 21%)',
    'hsl(264, 44%, 9%)',
    `<polygon points="44,0 84,0 104,72 24,72" fill="url(#ca-virtue-beam)"/>
     <circle cx="64" cy="22" r="24" fill="url(#ca-virtue-sun)"/>
     <circle cx="64" cy="22" r="10" fill="hsl(54, 100%, 94%)" opacity="0.92"/>
     <path d="M0 16 Q16 6 32 14 Q42 8 50 18 L0 26 Z" fill="url(#ca-virtue-cloud)" stroke="hsl(274, 46%, 44%)" stroke-width="1"/>
     <path d="M128 16 Q112 6 96 14 Q86 8 78 18 L128 26 Z" fill="url(#ca-virtue-cloud)" stroke="hsl(274, 46%, 44%)" stroke-width="1"/>
     <ellipse cx="22" cy="48" rx="9" ry="5" transform="rotate(-14 22 48)" fill="none" stroke="hsl(282, 66%, 56%)" stroke-width="2.4"/>
     <ellipse cx="38" cy="44" rx="9" ry="5" transform="rotate(-10 38 44)" fill="none" stroke="hsl(286, 78%, 64%)" stroke-width="2.2"/>
     <ellipse cx="106" cy="48" rx="9" ry="5" transform="rotate(14 106 48)" fill="none" stroke="hsl(282, 66%, 56%)" stroke-width="2.4"/>
     <ellipse cx="90" cy="44" rx="9" ry="5" transform="rotate(10 90 44)" fill="none" stroke="hsl(286, 78%, 64%)" stroke-width="2.2"/>
     <path d="M46 42 L53 38 M47 47 L54 50 M82 42 L75 38 M81 47 L74 50" stroke="hsl(50, 100%, 86%)" stroke-width="1.8" stroke-linecap="round"/>
     <polygon points="64,34 68,42 76,44 68,46 64,54 60,46 52,44 60,42" fill="hsl(52, 100%, 92%)" stroke="hsl(42, 100%, 64%)" stroke-width="1.1"/>
     <path d="M36 64 Q64 56 92 64" fill="none" stroke="hsl(46, 100%, 78%)" stroke-width="1.6" stroke-linecap="round" opacity="0.78"/>
     <circle cx="54" cy="32" r="2" fill="hsl(54, 100%, 94%)"/><circle cx="74" cy="32" r="2" fill="hsl(54, 100%, 94%)"/>
     <circle cx="58" cy="56" r="1.8" fill="hsl(48, 100%, 88%)"/><circle cx="70" cy="56" r="1.8" fill="hsl(48, 100%, 88%)"/>
     <circle cx="48" cy="24" r="1.5" fill="hsl(50, 100%, 90%)"/><circle cx="80" cy="24" r="1.5" fill="hsl(50, 100%, 90%)"/>`,
    'hsla(48, 100%, 72%, 0.34)',
    `<linearGradient id="ca-virtue-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 90%)" stop-opacity="0.65"/><stop offset="55%" stop-color="hsl(44, 100%, 68%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(42, 92%, 52%)" stop-opacity="0.06"/></linearGradient><radialGradient id="ca-virtue-sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 96%)" stop-opacity="0.92"/><stop offset="58%" stop-color="hsl(44, 100%, 68%)" stop-opacity="0.42"/><stop offset="100%" stop-color="hsl(268, 48%, 14%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-virtue-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(268, 42%, 22%)"/><stop offset="100%" stop-color="hsl(260, 48%, 10%)"/></linearGradient>`
  ),

  adapt: wrapArtSvg(
    'adapt',
    'hsl(24, 68%, 19%)',
    'hsl(216, 40%, 8%)',
    `<circle cx="64" cy="48" r="28" fill="url(#ca-adapt-fire)"/>
     <ellipse cx="64" cy="65" rx="40" ry="5" fill="hsla(0,0%,0%,0.54)"/>
     <line x1="34" y1="64" x2="94" y2="56" stroke="hsl(22, 44%, 20%)" stroke-width="4.5" stroke-linecap="round"/>
     <line x1="34" y1="56" x2="94" y2="64" stroke="hsl(24, 48%, 26%)" stroke-width="4.5" stroke-linecap="round"/>
     <path d="M46 60 Q48 44 58 48 Q62 34 70 46 Q80 42 82 60 Z" fill="hsl(24, 100%, 56%)" stroke="hsl(46, 100%, 78%)" stroke-width="1"/>
     <path d="M54 60 Q58 46 64 52 Q68 42 74 60 Z" fill="hsl(50, 100%, 84%)"/>
     <rect x="14" y="22" width="20" height="28" rx="2.5" transform="rotate(-16 24 36)" fill="hsl(24, 46%, 22%)" stroke="hsl(32, 100%, 66%)" stroke-width="1.4"/>
     <rect x="94" y="22" width="20" height="28" rx="2.5" transform="rotate(16 104 36)" fill="hsl(24, 46%, 22%)" stroke="hsl(32, 100%, 66%)" stroke-width="1.4"/>
     <path d="M36 28 Q50 26 52 34 M92 28 Q78 26 76 34" fill="none" stroke="hsl(42, 100%, 76%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M44 12 L64 8 L84 12 L88 32 L64 44 L40 32 Z" fill="hsl(216, 36%, 10%)" opacity="0.62" transform="translate(2,2)"/>
     <path d="M44 12 L64 8 L84 12 L88 32 L64 44 L40 32 Z" fill="url(#ca-adapt-plate)" stroke="hsl(42, 94%, 70%)" stroke-width="1.6" stroke-linejoin="round"/>
     <path d="M43 22 H85 M47 32 H81 M64 10 V42" stroke="url(#ca-adapt-iron)" stroke-width="1.5"/>
     <circle cx="52" cy="17" r="1.7" fill="hsl(48, 100%, 84%)"/><circle cx="76" cy="17" r="1.7" fill="hsl(48, 100%, 84%)"/>
     <circle cx="54" cy="28" r="1.7" fill="hsl(48, 100%, 84%)"/><circle cx="74" cy="28" r="1.7" fill="hsl(48, 100%, 84%)"/>
     <circle cx="38" cy="14" r="1.6" fill="hsl(44, 100%, 82%)"/><circle cx="90" cy="14" r="1.6" fill="hsl(44, 100%, 82%)"/>
     <circle cx="64" cy="4" r="1.4" fill="hsl(52, 100%, 90%)"/>`,
    'hsla(32, 100%, 58%, 0.30)',
    `<radialGradient id="ca-adapt-fire" cx="50%" cy="62%" r="50%"><stop offset="0%" stop-color="hsl(44, 100%, 76%)" stop-opacity="0.86"/><stop offset="52%" stop-color="hsl(20, 100%, 52%)" stop-opacity="0.42"/><stop offset="100%" stop-color="hsl(216, 44%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-adapt-plate" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 24%, 60%)"/><stop offset="52%" stop-color="hsl(216, 22%, 34%)"/><stop offset="100%" stop-color="hsl(24, 58%, 26%)"/></linearGradient><linearGradient id="ca-adapt-iron" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(28, 100%, 64%)"/><stop offset="50%" stop-color="hsl(50, 100%, 88%)"/><stop offset="100%" stop-color="hsl(28, 100%, 64%)"/></linearGradient>`
  ),

  black_wind: wrapArtSvg(
    'black_wind',
    'hsl(354, 56%, 16%)',
    'hsl(232, 42%, 6%)',
    `<circle cx="74" cy="36" r="32" fill="url(#ca-black_wind-gale)"/>
     <path d="M0 72 V24 L18 32 L26 52 L38 72 Z" fill="hsl(236, 38%, 9%)" stroke="hsl(352, 54%, 34%)" stroke-width="1"/>
     <path d="M128 72 V18 L108 30 L102 50 L92 72 Z" fill="hsl(236, 38%, 9%)" stroke="hsl(352, 54%, 34%)" stroke-width="1"/>
     <path d="M10 50 Q44 12 88 26 Q106 32 122 14" fill="none" stroke="hsl(236, 32%, 12%)" stroke-width="7" stroke-linecap="round"/>
     <path d="M10 50 Q44 12 88 26 Q106 32 122 14" fill="none" stroke="url(#ca-black_wind-crimson)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M14 62 Q54 34 94 44 Q110 48 124 34" fill="none" stroke="hsl(236, 34%, 10%)" stroke-width="6" stroke-linecap="round"/>
     <path d="M14 62 Q54 34 94 44 Q110 48 124 34" fill="none" stroke="hsl(356, 94%, 60%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M36 58 L46 28 L58 32 L68 58 L54 54 L44 64 Z" fill="url(#ca-black_wind-cloak)" stroke="hsl(356, 86%, 64%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M38 28 Q50 22 62 28 Q50 32 38 28 Z" fill="hsl(238, 32%, 12%)" stroke="hsl(356, 84%, 60%)" stroke-width="1.2"/>
     <path d="M44 27 L47 19 H54 L56 27 Z" fill="hsl(238, 32%, 12%)" stroke="hsl(356, 84%, 60%)" stroke-width="1.1"/>
     <path d="M62 18 Q84 22 104 10" fill="none" stroke="hsl(8, 100%, 72%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M66 36 Q90 36 114 24" fill="none" stroke="hsl(352, 100%, 66%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M70 50 Q94 52 118 44" fill="none" stroke="hsl(24, 100%, 68%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="51" cy="38" r="2.2" fill="hsl(4, 100%, 62%)" stroke="hsl(50, 100%, 88%)" stroke-width="0.8"/>
     <circle cx="84" cy="18" r="1.7" fill="hsl(24, 100%, 72%)"/><circle cx="102" cy="36" r="1.7" fill="hsl(356, 100%, 68%)"/>
     <circle cx="28" cy="24" r="1.5" fill="hsl(14, 100%, 70%)"/><circle cx="88" cy="56" r="1.5" fill="hsl(356, 100%, 68%)"/>`,
    'hsla(356, 94%, 54%, 0.30)',
    `<radialGradient id="ca-black_wind-gale" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(356, 94%, 54%)" stop-opacity="0.62"/><stop offset="60%" stop-color="hsl(248, 42%, 16%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(232, 46%, 6%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-black_wind-crimson" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(354, 92%, 52%)"/><stop offset="55%" stop-color="hsl(18, 100%, 68%)"/><stop offset="100%" stop-color="hsl(350, 96%, 62%)"/></linearGradient><linearGradient id="ca-black_wind-cloak" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(240, 28%, 22%)"/><stop offset="100%" stop-color="hsl(352, 44%, 12%)"/></linearGradient>`
  ),

  dead_or_alive: wrapArtSvg(
    'dead_or_alive',
    'hsl(34, 56%, 20%)',
    'hsl(20, 50%, 8%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-dead_or_alive-glow)"/>
     <ellipse cx="66" cy="66" rx="44" ry="4.5" fill="hsla(0,0%,0%,0.54)"/>
     <path d="M26 10 L76 8 L80 58 L64 62 L52 58 L30 62 L24 38 Z" fill="hsl(18, 46%, 8%)" opacity="0.66" transform="translate(3,3)"/>
     <path d="M26 10 L76 8 L80 58 L64 62 L52 58 L30 62 L24 38 Z" fill="url(#ca-dead_or_alive-paper)" stroke="hsl(32, 68%, 42%)" stroke-width="1.5" stroke-linejoin="round"/>
     <line x1="34" y1="16" x2="68" y2="15" stroke="hsl(20, 58%, 24%)" stroke-width="2.4" stroke-linecap="round"/>
     <rect x="36" y="21" width="32" height="24" rx="1.5" fill="hsl(30, 44%, 72%)" stroke="hsl(22, 54%, 28%)" stroke-width="1.2"/>
     <path d="M40 31 Q52 25 64 31 Q52 34 40 31 Z" fill="hsl(22, 44%, 18%)"/>
     <path d="M46 30 L48 24 H56 L58 30 Z" fill="hsl(22, 44%, 18%)"/>
     <path d="M44 45 Q52 34 60 45 Z" fill="hsl(22, 44%, 18%)"/>
     <line x1="36" y1="51" x2="68" y2="50" stroke="hsl(20, 54%, 26%)" stroke-width="1.6" stroke-linecap="round"/>
     <line x1="42" y1="56" x2="62" y2="55" stroke="hsl(20, 54%, 26%)" stroke-width="1.3" stroke-linecap="round"/>
     <circle cx="71" cy="14" r="3.4" fill="hsl(216, 20%, 26%)" stroke="hsl(46, 98%, 74%)" stroke-width="1.3"/>
     <path d="M73 11 Q82 4 90 10 Q96 14 102 8" fill="none" stroke="hsla(36, 42%, 82%, 0.72)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M84 36 Q98 34 108 42 Q114 54 106 62 H82 Q74 54 84 36 Z" fill="hsl(28, 46%, 24%)" stroke="hsl(44, 92%, 66%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M88 30 L96 36 L104 30 L100 38 H92 Z" fill="hsl(28, 46%, 24%)" stroke="hsl(44, 92%, 66%)" stroke-width="1.2"/>
     <line x1="87" y1="38" x2="105" y2="38" stroke="hsl(46, 100%, 76%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="94" cy="52" r="4.5" fill="url(#ca-dead_or_alive-gold)" stroke="hsl(32, 74%, 36%)" stroke-width="1"/>
     <circle cx="104" cy="56" r="4" fill="url(#ca-dead_or_alive-gold)" stroke="hsl(32, 74%, 36%)" stroke-width="1"/>
     <circle cx="112" cy="48" r="1.6" fill="hsl(50, 100%, 88%)"/><circle cx="16" cy="24" r="1.5" fill="hsl(46, 100%, 82%)"/>`,
    'hsla(44, 96%, 60%, 0.28)',
    `<radialGradient id="ca-dead_or_alive-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(46, 100%, 76%)" stop-opacity="0.58"/><stop offset="100%" stop-color="hsl(22, 52%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-dead_or_alive-paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(40, 62%, 82%)"/><stop offset="60%" stop-color="hsl(34, 52%, 66%)"/><stop offset="100%" stop-color="hsl(28, 48%, 48%)"/></linearGradient><radialGradient id="ca-dead_or_alive-gold" cx="35%" cy="35%" r="65%"><stop offset="0%" stop-color="hsl(54, 100%, 92%)"/><stop offset="60%" stop-color="hsl(44, 100%, 62%)"/><stop offset="100%" stop-color="hsl(30, 82%, 38%)"/></radialGradient>`
  ),

  dissolve: wrapArtSvg(
    'dissolve',
    'hsl(182, 56%, 18%)',
    'hsl(216, 48%, 8%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-dissolve-mist)"/>
     <ellipse cx="64" cy="65" rx="44" ry="5.5" fill="hsla(0,0%,0%,0.5)"/>
     <path d="M12 60 Q28 46 44 54 Q58 62 72 52 Q92 42 116 58" fill="none" stroke="hsl(176, 94%, 66%)" stroke-width="2.2" stroke-linecap="round" opacity="0.78"/>
     <path d="M18 52 Q36 38 52 46 Q68 54 84 44 Q102 36 112 46" fill="none" stroke="url(#ca-dissolve-amber)" stroke-width="1.8" stroke-linecap="round" opacity="0.76"/>
     <polygon points="64,6 104,18 98,48 64,66 30,48 24,18" fill="hsla(182, 78%, 44%, 0.24)" stroke="hsl(178, 96%, 72%)" stroke-width="1.4" stroke-linejoin="round"/>
     <polygon points="64,12 94,22 89,45 64,59 39,45 34,22" fill="url(#ca-dissolve-shield)" stroke="hsl(182, 100%, 82%)" stroke-width="1.7" stroke-linejoin="round"/>
     <polygon points="64,19 83,26 80,42 64,52 48,42 45,26" fill="hsla(38, 96%, 62%, 0.22)" stroke="hsl(44, 100%, 78%)" stroke-width="1.4" stroke-linejoin="round"/>
     <line x1="64" y1="12" x2="64" y2="59" stroke="hsla(184, 100%, 92%, 0.55)" stroke-width="1.1"/>
     <line x1="36" y1="26" x2="92" y2="26" stroke="hsla(184, 100%, 92%, 0.45)" stroke-width="1"/>
     <polygon points="64,26 72,35 64,44 56,35" fill="hsl(46, 100%, 82%)" stroke="hsl(182, 100%, 88%)" stroke-width="1.2"/>
     <circle cx="64" cy="35" r="2.6" fill="hsl(54, 100%, 96%)"/>
     <path d="M14 26 L24 30 M114 26 L104 30 M18 38 L26 38 M110 38 L102 38" stroke="hsl(180, 96%, 76%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="22" cy="14" r="1.8" fill="hsl(178, 100%, 80%)"/><circle cx="106" cy="14" r="1.8" fill="hsl(44, 100%, 80%)"/>
     <circle cx="16" cy="48" r="1.6" fill="hsl(44, 100%, 78%)"/><circle cx="112" cy="48" r="1.6" fill="hsl(178, 100%, 80%)"/>
     <circle cx="46" cy="10" r="1.4" fill="hsl(50, 100%, 88%)"/><circle cx="82" cy="10" r="1.4" fill="hsl(50, 100%, 88%)"/>`,
    'hsla(176, 94%, 60%, 0.30)',
    `<radialGradient id="ca-dissolve-mist" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(178, 100%, 74%)" stop-opacity="0.75"/><stop offset="56%" stop-color="hsl(38, 96%, 56%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(216, 52%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-dissolve-shield" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(178, 96%, 76%, 0.56)"/><stop offset="55%" stop-color="hsla(192, 86%, 48%, 0.36)"/><stop offset="100%" stop-color="hsla(38, 92%, 52%, 0.42)"/></linearGradient><linearGradient id="ca-dissolve-amber" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(44, 100%, 76%)"/><stop offset="50%" stop-color="hsl(178, 100%, 76%)"/><stop offset="100%" stop-color="hsl(44, 100%, 76%)"/></linearGradient>`
  ),

  eternal_form: wrapArtSvg(
    'eternal_form',
    'hsl(274, 56%, 19%)',
    'hsl(34, 58%, 9%)',
    `<rect x="44" y="0" width="40" height="72" fill="url(#ca-eternal_form-pillar)"/>
     <circle cx="64" cy="34" r="30" fill="url(#ca-eternal_form-halo)"/>
     <circle cx="64" cy="30" r="21" fill="none" stroke="hsl(48, 100%, 80%)" stroke-width="1.3" stroke-dasharray="4 3"/>
     <circle cx="64" cy="30" r="14" fill="none" stroke="hsl(288, 94%, 76%)" stroke-width="1"/>
     <path d="M46 66 L54 34 L64 28 L74 34 L82 66 L64 56 Z" fill="url(#ca-eternal_form-body)" stroke="hsl(50, 100%, 86%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M48 24 Q64 16 80 24 Q64 29 48 24 Z" fill="hsl(46, 100%, 84%)" stroke="hsl(286, 86%, 68%)" stroke-width="1.1"/>
     <path d="M56 22 L59 13 Q64 10 69 13 L72 22 Z" fill="hsl(46, 100%, 84%)" stroke="hsl(286, 86%, 68%)" stroke-width="1"/>
     <circle cx="64" cy="38" r="3.4" fill="hsl(56, 100%, 96%)"/>
     <rect x="12" y="14" width="16" height="23" rx="2.5" transform="rotate(-18 20 25)" fill="url(#ca-eternal_form-card)" stroke="hsl(50, 100%, 86%)" stroke-width="1.4"/>
     <rect x="24" y="38" width="15" height="22" rx="2.5" transform="rotate(-8 31 49)" fill="url(#ca-eternal_form-card)" stroke="hsl(292, 94%, 78%)" stroke-width="1.3"/>
     <rect x="100" y="14" width="16" height="23" rx="2.5" transform="rotate(18 108 25)" fill="url(#ca-eternal_form-card)" stroke="hsl(50, 100%, 86%)" stroke-width="1.4"/>
     <rect x="89" y="38" width="15" height="22" rx="2.5" transform="rotate(8 96 49)" fill="url(#ca-eternal_form-card)" stroke="hsl(292, 94%, 78%)" stroke-width="1.3"/>
     <path d="M30 22 Q44 14 52 20 M98 22 Q84 14 76 20" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.2" stroke-linecap="round"/>
     <polygon points="64,4 66,8 70,9 66,10 64,14 62,10 58,9 62,8" fill="hsl(54, 100%, 94%)"/>
     <circle cx="38" cy="10" r="1.5" fill="hsl(50, 100%, 90%)"/><circle cx="90" cy="10" r="1.5" fill="hsl(50, 100%, 90%)"/>
     <circle cx="14" cy="54" r="1.5" fill="hsl(292, 98%, 80%)"/><circle cx="114" cy="54" r="1.5" fill="hsl(292, 98%, 80%)"/>`,
    'hsla(46, 100%, 70%, 0.34)',
    `<linearGradient id="ca-eternal_form-pillar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 86%)" stop-opacity="0.45"/><stop offset="55%" stop-color="hsl(286, 86%, 60%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(36, 92%, 50%)" stop-opacity="0.06"/></linearGradient><radialGradient id="ca-eternal_form-halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 88%)" stop-opacity="0.82"/><stop offset="56%" stop-color="hsl(286, 90%, 60%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(274, 56%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-eternal_form-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="52%" stop-color="hsl(42, 96%, 68%)"/><stop offset="100%" stop-color="hsl(282, 82%, 44%)"/></linearGradient><linearGradient id="ca-eternal_form-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(286, 76%, 48%)"/><stop offset="100%" stop-color="hsl(36, 78%, 34%)"/></linearGradient>`
  ),

  fatal_desire: wrapArtSvg(
    'fatal_desire',
    'hsl(346, 62%, 18%)',
    'hsl(278, 52%, 7%)',
    `<circle cx="64" cy="34" r="30" fill="url(#ca-fatal_desire-aura)"/>
     <ellipse cx="64" cy="65" rx="28" ry="4.5" fill="hsla(0,0%,0%,0.58)"/>
     <rect x="40" y="6" width="16" height="24" rx="2.4" transform="rotate(-22 48 18)" fill="hsl(348, 54%, 22%)" stroke="hsl(46, 98%, 76%)" stroke-width="1.3"/>
     <rect x="56" y="4" width="16" height="25" rx="2.4" fill="hsl(352, 62%, 28%)" stroke="hsl(50, 100%, 84%)" stroke-width="1.4"/>
     <rect x="72" y="6" width="16" height="24" rx="2.4" transform="rotate(22 80 18)" fill="hsl(348, 54%, 22%)" stroke="hsl(46, 98%, 76%)" stroke-width="1.3"/>
     <path d="M44 28 H84 Q82 48 64 50 Q46 48 44 28 Z" fill="url(#ca-fatal_desire-chalice)" stroke="hsl(48, 100%, 80%)" stroke-width="1.6" stroke-linejoin="round"/>
     <ellipse cx="64" cy="28" rx="20" ry="4.6" fill="url(#ca-fatal_desire-elixir)" stroke="hsl(48, 100%, 84%)" stroke-width="1.2"/>
     <path d="M59 50 H69 L67 60 L78 64 H50 L61 60 Z" fill="url(#ca-fatal_desire-chalice)" stroke="hsl(46, 96%, 76%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M48 30 Q44 40 48 48 M79 30 Q84 38 80 46" fill="none" stroke="hsl(352, 100%, 62%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M12 52 Q26 36 42 42 Q34 26 20 22" fill="none" stroke="hsl(288, 92%, 68%)" stroke-width="1.7" stroke-linecap="round"/>
     <path d="M116 52 Q102 36 86 42 Q94 26 108 22" fill="none" stroke="hsl(288, 92%, 68%)" stroke-width="1.7" stroke-linecap="round"/>
     <polygon points="28,38 33,34 31,41" fill="hsl(294, 96%, 76%)"/><polygon points="100,38 95,34 97,41" fill="hsl(294, 96%, 76%)"/>
     <polygon points="64,34 68,40 64,46 60,40" fill="hsl(352, 100%, 60%)" stroke="hsl(52, 100%, 90%)" stroke-width="0.9"/>
     <circle cx="48" cy="52" r="1.8" fill="hsl(354, 100%, 66%)"/><circle cx="80" cy="50" r="1.8" fill="hsl(354, 100%, 66%)"/>
     <circle cx="24" cy="14" r="1.5" fill="hsl(294, 98%, 78%)"/><circle cx="104" cy="14" r="1.5" fill="hsl(294, 98%, 78%)"/>`,
    'hsla(348, 96%, 56%, 0.30)',
    `<radialGradient id="ca-fatal_desire-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(350, 96%, 60%)" stop-opacity="0.74"/><stop offset="56%" stop-color="hsl(284, 82%, 44%)" stop-opacity="0.3"/><stop offset="100%" stop-color="hsl(278, 52%, 8%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-fatal_desire-chalice" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 98%, 78%)"/><stop offset="52%" stop-color="hsl(34, 84%, 48%)"/><stop offset="100%" stop-color="hsl(350, 68%, 26%)"/></linearGradient><radialGradient id="ca-fatal_desire-elixir" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(14, 100%, 76%)"/><stop offset="65%" stop-color="hsl(350, 96%, 50%)"/><stop offset="100%" stop-color="hsl(338, 88%, 28%)"/></radialGradient>`
  ),

  final_canter: wrapArtSvg(
    'final_canter',
    'hsl(276, 54%, 17%)',
    'hsl(22, 52%, 8%)',
    `<circle cx="68" cy="34" r="30" fill="url(#ca-final_canter-aura)"/>
     <ellipse cx="64" cy="64" rx="48" ry="5" fill="hsla(0,0%,0%,0.54)"/>
     <ellipse cx="34" cy="36" rx="22" ry="24" fill="none" stroke="hsl(288, 92%, 68%)" stroke-width="1.6" stroke-dasharray="5 3" opacity="0.78"/>
     <ellipse cx="94" cy="34" rx="20" ry="22" fill="none" stroke="hsl(288, 92%, 68%)" stroke-width="1.4" stroke-dasharray="4 3" opacity="0.72"/>
     <path d="M22 44 Q42 32 66 30 L84 22 L98 16 L104 22 L96 30 L84 36 L76 46 L48 48 Z" fill="url(#ca-final_canter-bone)" stroke="hsl(290, 92%, 78%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M52 35 L50 45 M58 34 L57 45 M65 33 L64 44 M72 34 L71 43" stroke="hsl(274, 48%, 18%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M10 38 Q26 26 42 34 Q24 40 16 48" fill="none" stroke="hsl(292, 96%, 76%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M74 22 Q64 12 50 18 Q62 22 70 28" fill="none" stroke="hsl(296, 98%, 80%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="96" cy="21" r="2" fill="hsl(44, 100%, 82%)"/>
     <path d="M44 48 L30 62 M54 47 L46 62 M74 44 L92 58 M80 38 L104 48" stroke="url(#ca-final_canter-bone)" stroke-width="3" stroke-linecap="round"/>
     <path d="M24 62 Q30 52 38 62 Z" fill="url(#ca-final_canter-hoof)"/>
     <path d="M40 62 Q46 53 54 62 Z" fill="url(#ca-final_canter-hoof)"/>
     <path d="M86 58 Q93 48 100 58 Z" fill="url(#ca-final_canter-hoof)"/>
     <path d="M98 48 Q106 38 112 50 Z" fill="url(#ca-final_canter-hoof)"/>
     <path d="M14 62 H112" stroke="hsl(32, 100%, 66%)" stroke-width="1.6" stroke-dasharray="8 4" stroke-linecap="round" opacity="0.72"/>
     <circle cx="20" cy="18" r="1.6" fill="hsl(292, 98%, 80%)"/><circle cx="114" cy="24" r="1.6" fill="hsl(44, 100%, 82%)"/>`,
    'hsla(290, 90%, 60%, 0.30)',
    `<radialGradient id="ca-final_canter-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(292, 92%, 64%)" stop-opacity="0.72"/><stop offset="58%" stop-color="hsl(28, 96%, 52%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(276, 54%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-final_canter-bone" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(294, 72%, 88%)"/><stop offset="55%" stop-color="hsl(274, 42%, 64%)"/><stop offset="100%" stop-color="hsl(264, 48%, 34%)"/></linearGradient><radialGradient id="ca-final_canter-hoof" cx="50%" cy="60%" r="55%"><stop offset="0%" stop-color="hsl(54, 100%, 94%)"/><stop offset="55%" stop-color="hsl(36, 100%, 60%)"/><stop offset="100%" stop-color="hsl(14, 100%, 48%)"/></radialGradient>`
  ),

  from_beyond: wrapArtSvg(
    'from_beyond',
    'hsl(258, 58%, 17%)',
    'hsl(188, 52%, 8%)',
    `<circle cx="40" cy="28" r="28" fill="url(#ca-from_beyond-rift)"/>
     <path d="M0 72 V54 L16 54 L24 44 L44 44 L54 56 L84 56 L96 46 L116 46 L128 56 V72 Z" fill="hsl(248, 42%, 9%)" stroke="hsl(186, 52%, 34%)" stroke-width="1"/>
     <polygon points="44,4 54,18 48,34 36,52 26,42 32,24 24,14" fill="url(#ca-from_beyond-void)" stroke="hsl(180, 100%, 82%)" stroke-width="1.8" stroke-linejoin="round"/>
     <polygon points="42,10 48,20 43,32 36,44 31,36 35,24" fill="hsl(182, 100%, 86%)" opacity="0.88"/>
     <path d="M22 10 L32 22 M56 12 L48 24 M18 36 L30 34 M48 42 L38 48" stroke="hsl(286, 94%, 74%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M44 20 Q72 12 114 18" fill="none" stroke="url(#ca-from_beyond-bolt)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M46 28 Q78 24 118 34" fill="none" stroke="url(#ca-from_beyond-bolt)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M42 36 Q72 38 110 50" fill="none" stroke="url(#ca-from_beyond-bolt)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M38 42 Q64 52 94 62" fill="none" stroke="hsl(288, 92%, 74%)" stroke-width="1.8" stroke-linecap="round"/>
     <polygon points="116,18 106,14 109,22" fill="hsl(180, 100%, 86%)"/>
     <polygon points="120,34 110,30 112,38" fill="hsl(180, 100%, 86%)"/>
     <polygon points="112,50 102,46 105,54" fill="hsl(180, 100%, 86%)"/>
     <circle cx="82" cy="14" r="2.2" fill="hsl(182, 100%, 88%)"/><circle cx="94" cy="30" r="2" fill="hsl(292, 98%, 80%)"/>
     <circle cx="76" cy="44" r="2" fill="hsl(182, 100%, 88%)"/><circle cx="14" cy="22" r="1.5" fill="hsl(182, 100%, 84%)"/>
     <circle cx="64" cy="8" r="1.5" fill="hsl(292, 98%, 82%)"/>`,
    'hsla(182, 96%, 60%, 0.30)',
    `<radialGradient id="ca-from_beyond-rift" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(180, 100%, 82%)" stop-opacity="0.86"/><stop offset="52%" stop-color="hsl(276, 88%, 54%)" stop-opacity="0.42"/><stop offset="100%" stop-color="hsl(258, 58%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-from_beyond-void" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(276, 84%, 34%)"/><stop offset="55%" stop-color="hsl(246, 68%, 14%)"/><stop offset="100%" stop-color="hsl(188, 92%, 38%)"/></linearGradient><linearGradient id="ca-from_beyond-bolt" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(182, 100%, 88%)"/><stop offset="58%" stop-color="hsl(284, 94%, 72%)"/><stop offset="100%" stop-color="hsl(178, 100%, 80%)"/></linearGradient>`
  ),

  gambit: wrapArtSvg(
    'gambit',
    'hsl(354, 58%, 18%)',
    'hsl(28, 52%, 8%)',
    `<circle cx="68" cy="34" r="30" fill="url(#ca-gambit-glow)"/>
     <ellipse cx="32" cy="62" rx="22" ry="5" fill="hsla(0,0%,0%,0.54)"/>
     <ellipse cx="28" cy="56" rx="14" ry="5" fill="url(#ca-gambit-chip)" stroke="hsl(48, 100%, 80%)" stroke-width="1.3"/>
     <ellipse cx="28" cy="49" rx="14" ry="5" fill="hsl(220, 24%, 22%)" stroke="hsl(48, 100%, 80%)" stroke-width="1.3"/>
     <ellipse cx="28" cy="42" rx="14" ry="5" fill="url(#ca-gambit-chip)" stroke="hsl(48, 100%, 80%)" stroke-width="1.3"/>
     <ellipse cx="28" cy="35" rx="14" ry="5" fill="hsl(42, 92%, 58%)" stroke="hsl(54, 100%, 92%)" stroke-width="1.3"/>
     <ellipse cx="44" cy="22" rx="9" ry="4" transform="rotate(-24 44 22)" fill="url(#ca-gambit-chip)" stroke="hsl(48, 100%, 84%)" stroke-width="1.2"/>
     <circle cx="62" cy="50" r="13" fill="url(#ca-gambit-steel)" stroke="hsl(44, 94%, 72%)" stroke-width="1.6"/>
     <circle cx="62" cy="50" r="2.6" fill="hsl(46, 98%, 76%)"/>
     <circle cx="62" cy="42" r="2.6" fill="hsl(46, 100%, 72%)"/><circle cx="69" cy="46" r="2.6" fill="hsl(220, 34%, 12%)"/>
     <circle cx="69" cy="54" r="2.6" fill="hsl(46, 100%, 72%)"/><circle cx="62" cy="58" r="2.6" fill="hsl(220, 34%, 12%)"/>
     <circle cx="55" cy="54" r="2.6" fill="hsl(46, 100%, 72%)"/><circle cx="55" cy="46" r="2.6" fill="hsl(220, 34%, 12%)"/>
     <path d="M56 14 Q92 4 114 26 Q116 44 86 48" fill="none" stroke="hsl(44, 100%, 76%)" stroke-width="2.4" stroke-linecap="round"/>
     <polygon points="82,48 92,43 91,53" fill="hsl(44, 100%, 78%)"/>
     <rect x="78" y="14" width="18" height="26" rx="2.5" transform="rotate(-12 87 27)" fill="url(#ca-gambit-card)" stroke="hsl(50, 100%, 86%)" stroke-width="1.4"/>
     <rect x="94" y="20" width="18" height="26" rx="2.5" transform="rotate(14 103 33)" fill="url(#ca-gambit-card)" stroke="hsl(52, 100%, 90%)" stroke-width="1.5"/>
     <polygon points="103,27 107,33 103,39 99,33" fill="hsl(52, 100%, 92%)"/>
     <circle cx="16" cy="18" r="1.5" fill="hsl(48, 100%, 86%)"/><circle cx="116" cy="56" r="1.6" fill="hsl(32, 100%, 72%)"/>`,
    'hsla(42, 98%, 60%, 0.30)',
    `<radialGradient id="ca-gambit-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(42, 100%, 72%)" stop-opacity="0.68"/><stop offset="56%" stop-color="hsl(354, 88%, 46%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(24, 52%, 8%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-gambit-chip" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(352, 82%, 44%)"/><stop offset="50%" stop-color="hsl(4, 92%, 58%)"/><stop offset="100%" stop-color="hsl(348, 76%, 32%)"/></linearGradient><linearGradient id="ca-gambit-card" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(24, 92%, 52%)"/><stop offset="100%" stop-color="hsl(352, 78%, 26%)"/></linearGradient><linearGradient id="ca-gambit-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 24%, 56%)"/><stop offset="100%" stop-color="hsl(220, 26%, 20%)"/></linearGradient>`
  ),

  heroic_bravado: wrapArtSvg(
    'heroic_bravado',
    'hsl(24, 62%, 20%)',
    'hsl(216, 44%, 8%)',
    `<circle cx="58" cy="36" r="30" fill="url(#ca-heroic_bravado-glow)"/>
     <ellipse cx="44" cy="66" rx="28" ry="4.5" fill="hsla(0,0%,0%,0.54)"/>
     <path d="M18 66 L30 28 L56 28 L66 66 L48 58 L30 66 Z" fill="url(#ca-heroic_bravado-coat)" stroke="hsl(38, 80%, 58%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M26 22 Q43 14 60 22 Q43 27 26 22 Z" fill="hsl(20, 36%, 16%)" stroke="hsl(44, 92%, 68%)" stroke-width="1.3"/>
     <path d="M35 21 L38 11 Q43 8 48 11 L51 21 Z" fill="hsl(20, 36%, 16%)" stroke="hsl(44, 92%, 68%)" stroke-width="1.2"/>
     <path d="M34 30 L52 30 L54 48 L43 54 L32 48 Z" fill="url(#ca-heroic_bravado-armor)" stroke="hsl(50, 100%, 84%)" stroke-width="1.5" stroke-linejoin="round"/>
     <line x1="43" y1="31" x2="43" y2="53" stroke="hsl(28, 62%, 26%)" stroke-width="1.3"/>
     <path d="M122 14 L56 32 L78 16" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M124 34 L58 40 L84 52" fill="none" stroke="hsl(34, 100%, 70%)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M120 56 L56 48 L82 64" fill="none" stroke="hsl(46, 100%, 80%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M116 24 L84 30 M118 44 L86 44" stroke="hsl(18, 100%, 64%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="58,34 52,30 59,30 62,23 63,31 71,32 63,36 62,43 58,37 51,38" fill="hsl(54, 100%, 94%)"/>
     <polygon points="56,46 51,43 57,43 60,38 60,45 67,47 60,49 58,55 55,49 49,50" fill="hsl(46, 100%, 86%)"/>
     <circle cx="96" cy="18" r="2" fill="hsl(50, 100%, 88%)"/><circle cx="102" cy="40" r="2" fill="hsl(46, 100%, 82%)"/>
     <circle cx="16" cy="36" r="1.5" fill="hsl(44, 100%, 80%)"/><circle cx="72" cy="10" r="1.6" fill="hsl(50, 100%, 88%)"/>`,
    'hsla(44, 100%, 64%, 0.32)',
    `<radialGradient id="ca-heroic_bravado-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 82%)" stop-opacity="0.78"/><stop offset="56%" stop-color="hsl(26, 98%, 54%)" stop-opacity="0.32"/><stop offset="100%" stop-color="hsl(216, 46%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-heroic_bravado-armor" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 88%)"/><stop offset="52%" stop-color="hsl(40, 96%, 58%)"/><stop offset="100%" stop-color="hsl(24, 72%, 34%)"/></linearGradient><linearGradient id="ca-heroic_bravado-coat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(22, 46%, 28%)"/><stop offset="100%" stop-color="hsl(14, 46%, 12%)"/></linearGradient>`
  ),

  high_noon: wrapArtSvg(
    'high_noon',
    'hsl(40, 74%, 22%)',
    'hsl(18, 58%, 8%)',
    `<circle cx="64" cy="24" r="34" fill="url(#ca-high_noon-sun)"/>
     <path d="M64 0 V10 M38 4 L46 14 M90 4 L82 14 M18 18 L34 24 M110 18 L94 24 M14 36 L34 34 M114 36 L94 34" stroke="hsl(50, 100%, 88%)" stroke-width="1.5" stroke-linecap="round" opacity="0.72"/>
     <path d="M0 72 V58 L28 50 L64 56 L100 48 L128 56 V72 Z" fill="hsl(18, 48%, 12%)" stroke="hsl(36, 72%, 44%)" stroke-width="1"/>
     <circle cx="64" cy="28" r="20" fill="hsla(32, 68%, 14%, 0.72)" stroke="url(#ca-high_noon-brass)" stroke-width="2.4"/>
     <circle cx="64" cy="28" r="16" fill="none" stroke="hsl(50, 100%, 84%)" stroke-width="0.9" stroke-dasharray="2.5 3.5"/>
     <line x1="64" y1="10" x2="64" y2="15" stroke="hsl(54, 100%, 96%)" stroke-width="2.2" stroke-linecap="round"/>
     <line x1="82" y1="28" x2="78" y2="28" stroke="hsl(48, 100%, 84%)" stroke-width="1.4"/>
     <line x1="64" y1="46" x2="64" y2="42" stroke="hsl(48, 100%, 84%)" stroke-width="1.4"/>
     <line x1="46" y1="28" x2="50" y2="28" stroke="hsl(48, 100%, 84%)" stroke-width="1.4"/>
     <polygon points="64,12 67,27 64,30 61,27" fill="hsl(54, 100%, 96%)" stroke="hsl(32, 86%, 44%)" stroke-width="0.8"/>
     <circle cx="64" cy="28" r="2.8" fill="hsl(48, 100%, 86%)" stroke="hsl(26, 68%, 24%)" stroke-width="1"/>
     <path d="M22 44 L66 56 L62 62 L44 57 L38 69 L28 66 L34 54 L20 50 Z" fill="url(#ca-high_noon-gun)" stroke="hsl(46, 96%, 72%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M106 44 L62 56 L66 62 L84 57 L90 69 L100 66 L94 54 L108 50 Z" fill="url(#ca-high_noon-gun)" stroke="hsl(46, 96%, 72%)" stroke-width="1.3" stroke-linejoin="round"/>
     <circle cx="44" cy="54" r="3.4" fill="hsl(216, 22%, 22%)" stroke="hsl(46, 96%, 74%)" stroke-width="1"/>
     <circle cx="84" cy="54" r="3.4" fill="hsl(216, 22%, 22%)" stroke="hsl(46, 96%, 74%)" stroke-width="1"/>
     <circle cx="24" cy="10" r="1.6" fill="hsl(52, 100%, 90%)"/><circle cx="104" cy="10" r="1.6" fill="hsl(52, 100%, 90%)"/>`,
    'hsla(48, 100%, 68%, 0.36)',
    `<radialGradient id="ca-high_noon-sun" cx="50%" cy="46%" r="52%"><stop offset="0%" stop-color="hsl(54, 100%, 94%)" stop-opacity="0.94"/><stop offset="50%" stop-color="hsl(40, 100%, 62%)" stop-opacity="0.52"/><stop offset="100%" stop-color="hsl(22, 72%, 14%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-high_noon-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 88%)"/><stop offset="55%" stop-color="hsl(40, 94%, 56%)"/><stop offset="100%" stop-color="hsl(26, 76%, 34%)"/></linearGradient><linearGradient id="ca-high_noon-gun" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 22%, 58%)"/><stop offset="100%" stop-color="hsl(220, 26%, 20%)"/></linearGradient>`
  ),

  magnum: wrapArtSvg(
    'magnum',
    'hsl(28, 66%, 19%)',
    'hsl(216, 46%, 8%)',
    `<circle cx="72" cy="30" r="28" fill="url(#ca-magnum-flash)"/>
     <ellipse cx="42" cy="64" rx="34" ry="5" fill="hsla(0,0%,0%,0.54)"/>
     <path d="M12 40 L26 36 L68 24 L70 36 L44 42 L34 62 L18 60 L24 44 Z" fill="hsl(216, 36%, 9%)" opacity="0.64" transform="translate(2,3)"/>
     <path d="M12 40 L26 36 L68 24 L70 36 L44 42 L34 62 L18 60 L24 44 Z" fill="url(#ca-magnum-steel)" stroke="hsl(46, 94%, 74%)" stroke-width="1.6" stroke-linejoin="round"/>
     <path d="M22 44 L34 42 L30 60 L18 58 Z" fill="url(#ca-magnum-grip)" stroke="hsl(36, 76%, 56%)" stroke-width="1.2" stroke-linejoin="round"/>
     <line x1="36" y1="34" x2="66" y2="27" stroke="hsla(52, 100%, 96%, 0.72)" stroke-width="1.5"/>
     <rect x="30" y="34" width="14" height="10" rx="2.5" transform="rotate(-14 37 39)" fill="hsl(216, 20%, 26%)" stroke="hsl(46, 96%, 74%)" stroke-width="1.3"/>
     <line x1="34" y1="36" x2="40" y2="41" stroke="hsl(46, 94%, 70%)" stroke-width="1.2"/>
     <polygon points="70,28 84,14 80,26 96,24 82,34 90,46 74,38 68,36" fill="hsl(52, 100%, 92%)" stroke="hsl(28, 100%, 62%)" stroke-width="1.1"/>
     <ellipse cx="80" cy="30" rx="7" ry="15" fill="none" stroke="hsl(46, 100%, 80%)" stroke-width="1.4" opacity="0.78"/>
     <path d="M88 14 H108 Q114 14 116 16 Q114 18 108 18 H88 Z" fill="url(#ca-magnum-brass)"/>
     <path d="M96 22 H116 Q122 22 124 24 Q122 26 116 26 H96 Z" fill="url(#ca-magnum-brass)"/>
     <path d="M92 30 H112 Q118 30 120 32 Q118 34 112 34 H92 Z" fill="url(#ca-magnum-brass)"/>
     <path d="M96 38 H116 Q122 38 124 40 Q122 42 116 42 H96 Z" fill="url(#ca-magnum-brass)"/>
     <path d="M88 46 H108 Q114 46 116 48 Q114 50 108 50 H88 Z" fill="url(#ca-magnum-brass)"/>
     <path d="M80 54 H100 Q106 54 108 56 Q106 58 100 58 H80 Z" fill="url(#ca-magnum-brass)"/>
     <circle cx="78" cy="10" r="1.6" fill="hsl(52, 100%, 90%)"/><circle cx="118" cy="10" r="1.5" fill="hsl(46, 100%, 84%)"/>`,
    'hsla(42, 100%, 62%, 0.32)',
    `<radialGradient id="ca-magnum-flash" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 94%)" stop-opacity="0.92"/><stop offset="52%" stop-color="hsl(30, 100%, 58%)" stop-opacity="0.48"/><stop offset="100%" stop-color="hsl(216, 46%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-magnum-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(210, 26%, 76%)"/><stop offset="52%" stop-color="hsl(216, 22%, 44%)"/><stop offset="100%" stop-color="hsl(220, 26%, 20%)"/></linearGradient><linearGradient id="ca-magnum-grip" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(24, 58%, 36%)"/><stop offset="100%" stop-color="hsl(16, 56%, 16%)"/></linearGradient><linearGradient id="ca-magnum-brass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(36, 92%, 52%)"/><stop offset="65%" stop-color="hsl(50, 100%, 82%)"/><stop offset="100%" stop-color="hsl(18, 100%, 62%)"/></linearGradient>`
  ),

  overwhelming_power: wrapArtSvg(
    'overwhelming_power',
    'hsl(12, 72%, 20%)',
    'hsl(350, 58%, 7%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-overwhelming_power-core)"/>
     <path d="M0 72 V58 L32 54 L64 60 L96 54 L128 58 V72 Z" fill="url(#ca-overwhelming_power-lava)"/>
     <circle cx="64" cy="36" r="24" fill="none" stroke="hsl(44, 100%, 76%)" stroke-width="1.6" stroke-dasharray="6 3" opacity="0.78"/>
     <circle cx="64" cy="36" r="15" fill="none" stroke="hsl(14, 100%, 64%)" stroke-width="1.3" opacity="0.82"/>
     <path d="M46 66 L54 34 L42 28 L46 22 L64 26 L82 22 L86 28 L74 34 L82 66 L64 56 Z" fill="hsl(352, 48%, 10%)" stroke="hsl(48, 100%, 84%)" stroke-width="1.5" stroke-linejoin="round"/>
     <path d="M52 20 Q64 14 76 20 Q64 24 52 20 Z" fill="hsl(352, 48%, 10%)" stroke="hsl(48, 100%, 84%)" stroke-width="1.2"/>
     <path d="M58 19 L60 12 H68 L70 19 Z" fill="hsl(352, 48%, 10%)" stroke="hsl(48, 100%, 84%)" stroke-width="1.1"/>
     <polygon points="64,28 69,36 64,44 59,36" fill="hsl(56, 100%, 96%)" stroke="hsl(24, 100%, 62%)" stroke-width="1.2"/>
     <polyline points="58,34 40,22 44,16 14,6" fill="none" stroke="url(#ca-overwhelming_power-bolt)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
     <polyline points="70,34 88,22 84,16 114,6" fill="none" stroke="url(#ca-overwhelming_power-bolt)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
     <polyline points="56,42 36,46 40,54 12,64" fill="none" stroke="url(#ca-overwhelming_power-bolt)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
     <polyline points="72,42 92,46 88,54 116,64" fill="none" stroke="url(#ca-overwhelming_power-bolt)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
     <polyline points="48,36 28,32 10,36" fill="none" stroke="hsl(52, 100%, 90%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     <polyline points="80,36 100,32 118,36" fill="none" stroke="hsl(52, 100%, 90%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="24" cy="18" r="1.8" fill="hsl(52, 100%, 90%)"/><circle cx="104" cy="18" r="1.8" fill="hsl(52, 100%, 90%)"/>
     <circle cx="24" cy="54" r="1.7" fill="hsl(18, 100%, 68%)"/><circle cx="104" cy="54" r="1.7" fill="hsl(18, 100%, 68%)"/>`,
    'hsla(36, 100%, 60%, 0.36)',
    `<radialGradient id="ca-overwhelming_power-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 92%)" stop-opacity="0.92"/><stop offset="48%" stop-color="hsl(22, 100%, 56%)" stop-opacity="0.54"/><stop offset="100%" stop-color="hsl(350, 62%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-overwhelming_power-lava" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(18, 86%, 34%)"/><stop offset="100%" stop-color="hsl(350, 56%, 10%)"/></linearGradient><linearGradient id="ca-overwhelming_power-bolt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(56, 100%, 96%)"/><stop offset="55%" stop-color="hsl(40, 100%, 68%)"/><stop offset="100%" stop-color="hsl(6, 100%, 60%)"/></linearGradient>`
  ),

  purgatory: wrapArtSvg(
    'purgatory',
    'hsl(8, 72%, 18%)',
    'hsl(286, 44%, 7%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-purgatory-sky)"/>
     <path d="M0 72 V14 L22 28 L28 52 L0 64 Z" fill="hsl(282, 34%, 10%)" stroke="hsl(14, 72%, 40%)" stroke-width="1.2"/>
     <path d="M128 72 V12 L106 28 L100 52 L128 64 Z" fill="hsl(282, 34%, 10%)" stroke="hsl(14, 72%, 40%)" stroke-width="1.2"/>
     <line x1="42" y1="22" x2="42" y2="48" stroke="hsl(20, 46%, 18%)" stroke-width="2"/>
     <line x1="36" y1="28" x2="48" y2="28" stroke="hsl(20, 46%, 18%)" stroke-width="1.8"/>
     <line x1="86" y1="20" x2="86" y2="48" stroke="hsl(20, 46%, 18%)" stroke-width="2"/>
     <line x1="80" y1="26" x2="92" y2="26" stroke="hsl(20, 46%, 18%)" stroke-width="1.8"/>
     <path d="M0 72 L0 48 Q16 24 30 42 Q42 16 58 38 Q68 10 82 36 Q96 18 110 42 Q120 30 128 46 V72 Z" fill="url(#ca-purgatory-flame)" stroke="hsl(40, 100%, 72%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M12 72 Q26 42 42 54 Q54 28 66 50 Q78 24 92 52 Q104 40 116 72 Z" fill="url(#ca-purgatory-core)"/>
     <path d="M22 32 Q32 22 40 28 M88 28 Q98 18 106 26" fill="none" stroke="hsl(354, 100%, 66%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="64" cy="48" r="5" fill="hsl(54, 100%, 92%)" opacity="0.86"/>
     <circle cx="62" cy="47" r="1.2" fill="hsl(8, 92%, 34%)"/><circle cx="66" cy="47" r="1.2" fill="hsl(8, 92%, 34%)"/>
     <circle cx="34" cy="14" r="1.7" fill="hsl(44, 100%, 82%)"/><circle cx="64" cy="10" r="1.9" fill="hsl(52, 100%, 90%)"/>
     <circle cx="94" cy="14" r="1.7" fill="hsl(32, 100%, 74%)"/><circle cx="52" cy="20" r="1.5" fill="hsl(18, 100%, 70%)"/>
     <circle cx="76" cy="20" r="1.5" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(20, 100%, 56%, 0.34)',
    `<radialGradient id="ca-purgatory-sky" cx="50%" cy="56%" r="54%"><stop offset="0%" stop-color="hsl(32, 100%, 66%)" stop-opacity="0.82"/><stop offset="52%" stop-color="hsl(4, 96%, 46%)" stop-opacity="0.44"/><stop offset="100%" stop-color="hsl(286, 48%, 8%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-purgatory-flame" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(44, 100%, 74%)"/><stop offset="48%" stop-color="hsl(14, 100%, 54%)"/><stop offset="100%" stop-color="hsl(350, 88%, 28%)"/></linearGradient><linearGradient id="ca-purgatory-core" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 92%)"/><stop offset="55%" stop-color="hsl(36, 100%, 62%)"/><stop offset="100%" stop-color="hsl(8, 96%, 42%)"/></linearGradient>`
  ),

  reprieve: wrapArtSvg(
    'reprieve',
    'hsl(152, 52%, 18%)',
    'hsl(34, 50%, 9%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-reprieve-heal)"/>
     <circle cx="64" cy="36" r="22" fill="none" stroke="hsl(150, 92%, 72%)" stroke-width="1.3" stroke-dasharray="5 3" opacity="0.76"/>
     <circle cx="64" cy="36" r="14" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.1" opacity="0.72"/>
     <path d="M64 0 V20" stroke="url(#ca-reprieve-rope)" stroke-width="4.4" stroke-linecap="round"/>
     <path d="M58 18 L64 24 L70 18 M60 22 L64 26 L68 22" fill="none" stroke="hsl(38, 72%, 62%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M64 38 V44 C50 44 48 60 64 62 C80 60 78 44 64 44" fill="none" stroke="url(#ca-reprieve-rope)" stroke-width="3.6" stroke-linecap="round"/>
     <rect x="60" y="39" width="8" height="7" rx="1.5" fill="hsl(34, 54%, 44%)" stroke="hsl(46, 92%, 74%)" stroke-width="1"/>
     <path d="M46 31 Q64 25 82 31" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="64,23 67,29 73,31 67,33 64,39 61,33 55,31 61,29" fill="hsl(54, 100%, 96%)" stroke="hsl(150, 96%, 68%)" stroke-width="1"/>
     <path d="M18 44 Q28 24 40 20 Q34 36 18 44 Z" fill="url(#ca-reprieve-feather)" stroke="hsl(50, 100%, 90%)" stroke-width="1.1"/>
     <line x1="18" y1="44" x2="38" y2="22" stroke="hsl(44, 96%, 72%)" stroke-width="1"/>
     <path d="M110 42 Q100 22 88 18 Q94 34 110 42 Z" fill="url(#ca-reprieve-feather)" stroke="hsl(50, 100%, 90%)" stroke-width="1.1"/>
     <line x1="110" y1="42" x2="90" y2="20" stroke="hsl(44, 96%, 72%)" stroke-width="1"/>
     <path d="M26 60 Q36 52 44 54 Q36 62 26 60 Z" fill="url(#ca-reprieve-feather)" stroke="hsl(150, 96%, 78%)" stroke-width="1"/>
     <circle cx="24" cy="18" r="1.7" fill="hsl(150, 100%, 80%)"/><circle cx="104" cy="18" r="1.7" fill="hsl(50, 100%, 88%)"/>
     <circle cx="96" cy="56" r="1.6" fill="hsl(150, 100%, 80%)"/><circle cx="48" cy="12" r="1.4" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(148, 92%, 60%, 0.30)',
    `<radialGradient id="ca-reprieve-heal" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 88%)" stop-opacity="0.82"/><stop offset="52%" stop-color="hsl(150, 88%, 52%)" stop-opacity="0.38"/><stop offset="100%" stop-color="hsl(34, 52%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-reprieve-rope" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(42, 68%, 68%)"/><stop offset="100%" stop-color="hsl(28, 52%, 34%)"/></linearGradient><linearGradient id="ca-reprieve-feather" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 94%)"/><stop offset="60%" stop-color="hsl(152, 92%, 74%)"/><stop offset="100%" stop-color="hsl(42, 96%, 62%)"/></linearGradient>`
  ),

  roughhouse: wrapArtSvg(
    'roughhouse',
    'hsl(28, 60%, 19%)',
    'hsl(214, 46%, 8%)',
    `<circle cx="76" cy="36" r="28" fill="url(#ca-roughhouse-impact)"/>
     <ellipse cx="64" cy="65" rx="44" ry="5" fill="hsla(0,0%,0%,0.52)"/>
     <path d="M84 12 L114 20 V42 C114 54 100 62 84 66 C68 62 54 54 54 42 V20 Z" fill="url(#ca-roughhouse-crest)" stroke="hsl(44, 96%, 72%)" stroke-width="1.6" stroke-linejoin="round"/>
     <path d="M84 19 L105 25 V40 C105 49 95 55 84 58 C73 55 63 49 63 40 V25 Z" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.1" stroke-dasharray="4 2.5"/>
     <circle cx="72" cy="36" r="19" fill="none" stroke="hsl(46, 100%, 80%)" stroke-width="2" stroke-dasharray="7 4"/>
     <circle cx="72" cy="36" r="11" fill="none" stroke="hsl(24, 100%, 66%)" stroke-width="1.6"/>
     <path d="M8 54 L36 32 L54 24 L66 30 L64 46 L48 54 L26 66 Z" fill="hsl(218, 36%, 10%)" opacity="0.64" transform="translate(2,2)"/>
     <path d="M8 54 L36 32 L54 24 L66 30 L64 46 L48 54 L26 66 Z" fill="url(#ca-roughhouse-iron)" stroke="hsl(46, 96%, 74%)" stroke-width="1.6" stroke-linejoin="round"/>
     <line x1="48" y1="28" x2="46" y2="44" stroke="hsl(216, 26%, 18%)" stroke-width="1.6"/>
     <line x1="56" y1="28" x2="54" y2="46" stroke="hsl(216, 26%, 18%)" stroke-width="1.6"/>
     <circle cx="52" cy="30" r="2.2" fill="hsl(48, 100%, 84%)"/><circle cx="60" cy="32" r="2.2" fill="hsl(48, 100%, 84%)"/>
     <circle cx="59" cy="41" r="2.2" fill="hsl(48, 100%, 84%)"/><circle cx="42" cy="36" r="2" fill="hsl(48, 100%, 84%)"/>
     <polygon points="74,24 78,32 88,33 80,39 84,48 75,43 68,49 70,39 63,34 72,33" fill="hsl(52, 100%, 92%)" stroke="hsl(26, 100%, 60%)" stroke-width="1.1"/>
     <path d="M12 22 L38 22 M8 32 L30 32 M94 14 L106 8 M96 58 L110 64" stroke="hsl(46, 100%, 80%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="24" cy="14" r="1.5" fill="hsl(48, 100%, 86%)"/><circle cx="116" cy="36" r="1.6" fill="hsl(44, 100%, 80%)"/>`,
    'hsla(40, 98%, 60%, 0.30)',
    `<radialGradient id="ca-roughhouse-impact" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 88%)" stop-opacity="0.86"/><stop offset="55%" stop-color="hsl(28, 100%, 56%)" stop-opacity="0.38"/><stop offset="100%" stop-color="hsl(214, 46%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-roughhouse-iron" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 24%, 66%)"/><stop offset="52%" stop-color="hsl(216, 22%, 34%)"/><stop offset="100%" stop-color="hsl(24, 48%, 22%)"/></linearGradient><linearGradient id="ca-roughhouse-crest" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsla(214, 34%, 42%, 0.72)"/><stop offset="100%" stop-color="hsla(218, 44%, 16%, 0.85)"/></linearGradient>`
  ),

  roundhouse_kick: wrapArtSvg(
    'roundhouse_kick',
    'hsl(34, 66%, 20%)',
    'hsl(346, 50%, 8%)',
    `<circle cx="76" cy="36" r="28" fill="url(#ca-roundhouse_kick-glow)"/>
     <path d="M12 50 C20 18 96 10 116 32 C122 40 102 58 58 60" fill="none" stroke="url(#ca-roundhouse_kick-arc)" stroke-width="5.2" stroke-linecap="round"/>
     <path d="M18 42 C34 22 92 18 110 34" fill="none" stroke="hsl(54, 100%, 94%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M26 30 L58 26 L68 38 L86 34 L90 44 L64 52 L54 44 L30 44 Z" fill="hsl(16, 48%, 9%)" opacity="0.62" transform="translate(2,2)"/>
     <path d="M26 30 L58 26 L68 38 L86 34 L90 44 L64 52 L54 44 L30 44 Z" fill="url(#ca-roundhouse_kick-boot)" stroke="hsl(44, 94%, 72%)" stroke-width="1.5" stroke-linejoin="round"/>
     <path d="M56 38 L66 46" stroke="hsl(44, 92%, 70%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="52" cy="48" r="5" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.5"/>
     <polygon points="52,41 53.5,46 58.5,48 53.5,50 52,55 50.5,50 45.5,48 50.5,46" fill="hsl(52, 100%, 92%)"/>
     <path d="M94 24 Q112 36 96 54" fill="none" stroke="hsl(48, 100%, 86%)" stroke-width="3" stroke-linecap="round"/>
     <path d="M102 22 Q120 36 104 56" fill="none" stroke="hsl(16, 100%, 66%)" stroke-width="1.8" stroke-linecap="round"/>
     <polygon points="34,12 36,17 41,17 37,20 38,25 34,22 30,25 31,20 27,17 32,17" fill="hsl(50, 100%, 84%)" stroke="hsl(28, 96%, 54%)" stroke-width="0.9"/>
     <polygon points="74,8 76,13 81,13 77,16 78,21 74,18 70,21 71,16 67,13 72,13" fill="hsl(52, 100%, 90%)" stroke="hsl(28, 96%, 54%)" stroke-width="0.9"/>
     <polygon points="108,10 110,15 115,15 111,18 112,23 108,20 104,23 105,18 101,15 106,15" fill="hsl(48, 100%, 82%)" stroke="hsl(28, 96%, 54%)" stroke-width="0.9"/>
     <path d="M18 58 Q64 68 112 58" fill="none" stroke="hsl(38, 92%, 64%)" stroke-width="1.4" stroke-dasharray="5 3" opacity="0.72"/>
     <circle cx="20" cy="24" r="1.6" fill="hsl(48, 100%, 86%)"/><circle cx="88" cy="58" r="1.7" fill="hsl(44, 100%, 80%)"/>`,
    'hsla(46, 100%, 64%, 0.32)',
    `<radialGradient id="ca-roundhouse_kick-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 82%)" stop-opacity="0.78"/><stop offset="56%" stop-color="hsl(18, 96%, 54%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(346, 52%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-roundhouse_kick-arc" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(352, 92%, 56%)" stop-opacity="0.25"/><stop offset="55%" stop-color="hsl(42, 100%, 70%)" stop-opacity="0.92"/><stop offset="100%" stop-color="hsl(54, 100%, 92%)" stop-opacity="0.96"/></linearGradient><linearGradient id="ca-roundhouse_kick-boot" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(26, 58%, 40%)"/><stop offset="55%" stop-color="hsl(20, 56%, 24%)"/><stop offset="100%" stop-color="hsl(14, 52%, 14%)"/></linearGradient>`
  ),

  impending_doom: wrapArtSvg(
    'impending_doom',
    'hsl(284, 54%, 15%)',
    'hsl(352, 58%, 6%)',
    `<circle cx="64" cy="28" r="34" fill="url(#ca-impending_doom-corona)"/>
     <circle cx="64" cy="36" r="30" fill="none" stroke="hsl(352, 96%, 58%)" stroke-width="1.4" stroke-dasharray="5 3" opacity="0.76"/>
     <circle cx="64" cy="36" r="22" fill="none" stroke="hsl(288, 90%, 66%)" stroke-width="1.2" opacity="0.72"/>
     <path d="M64 2 V10 M82 5 L76 13 M97 13 L86 20 M108 30 L93 32 M106 48 L92 44 M94 62 L84 53 M75 68 L71 58 M53 68 L57 58 M34 62 L44 53 M22 48 L36 44 M20 30 L35 32 M31 13 L42 20 M46 5 L52 13" stroke="hsl(354, 96%, 62%)" stroke-width="1.6" stroke-linecap="round" opacity="0.82"/>
     <circle cx="64" cy="24" r="13.5" fill="hsl(276, 56%, 7%)" stroke="hsl(354, 100%, 64%)" stroke-width="2.2"/>
     <circle cx="64" cy="24" r="15.5" fill="none" stroke="hsl(44, 100%, 74%)" stroke-width="0.9" opacity="0.72"/>
     <rect x="46" y="14" width="36" height="4" rx="1.2" fill="hsl(36, 72%, 44%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.1"/>
     <rect x="46" y="58" width="36" height="4" rx="1.2" fill="hsl(36, 72%, 44%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.1"/>
     <line x1="50" y1="18" x2="50" y2="58" stroke="hsl(42, 86%, 62%)" stroke-width="1.5"/>
     <line x1="78" y1="18" x2="78" y2="58" stroke="hsl(42, 86%, 62%)" stroke-width="1.5"/>
     <path d="M52 18 H76 Q74 32 64 38 Q54 32 52 18 Z" fill="url(#ca-impending_doom-glass)" stroke="hsl(292, 88%, 74%)" stroke-width="1.2"/>
     <path d="M64 38 Q74 44 76 58 H52 Q54 44 64 38 Z" fill="url(#ca-impending_doom-glass)" stroke="hsl(292, 88%, 74%)" stroke-width="1.2"/>
     <path d="M56 24 H72 Q70 31 64 36 Q58 31 56 24 Z" fill="url(#ca-impending_doom-sand)"/>
     <path d="M55 58 Q64 46 73 58 Z" fill="url(#ca-impending_doom-sand)"/>
     <line x1="64" y1="36" x2="64" y2="50" stroke="hsl(354, 100%, 66%)" stroke-width="1.6" stroke-dasharray="2.5 1.5"/>
     <polyline points="56,22 61,27 58,31 63,34" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
     <polyline points="72,46 68,50 71,54" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="22" cy="12" r="1.6" fill="hsl(354, 100%, 68%)"/><circle cx="106" cy="12" r="1.6" fill="hsl(354, 100%, 68%)"/>
     <circle cx="24" cy="60" r="1.5" fill="hsl(292, 98%, 78%)"/><circle cx="104" cy="60" r="1.5" fill="hsl(292, 98%, 78%)"/>`,
    'hsla(352, 96%, 54%, 0.32)',
    `<radialGradient id="ca-impending_doom-corona" cx="50%" cy="46%" r="52%"><stop offset="0%" stop-color="hsl(354, 100%, 62%)" stop-opacity="0.88"/><stop offset="52%" stop-color="hsl(288, 86%, 44%)" stop-opacity="0.42"/><stop offset="100%" stop-color="hsl(352, 60%, 8%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-impending_doom-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(292, 82%, 74%, 0.34)"/><stop offset="100%" stop-color="hsla(352, 76%, 34%, 0.24)"/></linearGradient><linearGradient id="ca-impending_doom-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(354, 100%, 66%)"/><stop offset="100%" stop-color="hsl(286, 86%, 44%)"/></linearGradient>`
  ),
};
