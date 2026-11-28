// Bespoke 16:9 SVG card illustrations for The Hermit (part A: 23 starter + common cards).
import { wrapArtSvg } from './wrap.js';

export const HERMIT_CARD_ART_A = {
  snapshot: wrapArtSvg(
    'snapshot',
    'hsl(28, 62%, 20%)',
    'hsl(18, 56%, 8%)',
    `<circle cx="92" cy="32" r="26" fill="url(#ca-snapshot-flash)"/>
     <path d="M6 62 L36 52 L68 58 L122 48 V70 H6 Z" fill="hsl(18, 42%, 11%)" opacity="0.72"/>
     <path d="M12 48 L50 38 L54 46 L24 56 L16 68 L8 64 Z" fill="hsl(18, 44%, 8%)" opacity="0.68"/>
     <path d="M10 46 L48 36 L52 44 L22 54 L14 66 L6 62 Z" fill="url(#ca-snapshot-gun)" stroke="hsl(36, 72%, 64%)" stroke-width="1.2" stroke-linejoin="round"/>
     <line x1="16" y1="45" x2="44" y2="38" stroke="hsla(48, 100%, 90%, 0.55)" stroke-width="1"/>
     <circle cx="29" cy="46" r="5" fill="hsl(216, 20%, 24%)" stroke="hsl(42, 86%, 64%)" stroke-width="1.2"/>
     <circle cx="29" cy="46" r="1.8" fill="hsl(46, 98%, 74%)"/>
     <path d="M52 38 L114 26" stroke="hsl(46, 100%, 84%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M52 38 L114 26" stroke="hsl(54, 100%, 96%)" stroke-width="1.2" stroke-linecap="round"/>
     <circle cx="92" cy="30" r="15" fill="none" stroke="hsl(42, 98%, 68%)" stroke-width="1.4" stroke-dasharray="5 3"/>
     <circle cx="92" cy="30" r="8" fill="none" stroke="hsl(18, 96%, 64%)" stroke-width="1"/>
     <line x1="92" y1="11" x2="92" y2="21" stroke="hsl(44, 100%, 78%)" stroke-width="1.4"/>
     <line x1="92" y1="39" x2="92" y2="49" stroke="hsl(44, 100%, 78%)" stroke-width="1.4"/>
     <line x1="73" y1="30" x2="83" y2="30" stroke="hsl(44, 100%, 78%)" stroke-width="1.4"/>
     <line x1="101" y1="30" x2="111" y2="30" stroke="hsl(44, 100%, 78%)" stroke-width="1.4"/>
     <path d="M74 52 L92 58 L110 52 L106 64 Q92 70 78 64 Z" fill="hsla(42, 90%, 56%, 0.28)" stroke="hsl(44, 96%, 72%)" stroke-width="1.2"/>
     <circle cx="62" cy="22" r="1.6" fill="hsl(48, 100%, 88%)"/><circle cx="114" cy="18" r="1.4" fill="hsl(40, 100%, 76%)"/>`,
    'hsla(38, 96%, 58%, 0.28)',
    `<radialGradient id="ca-snapshot-flash" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 82%)" stop-opacity="0.82"/><stop offset="55%" stop-color="hsl(28, 96%, 54%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(18, 70%, 16%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-snapshot-gun" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(212, 24%, 66%)"/><stop offset="55%" stop-color="hsl(216, 20%, 34%)"/><stop offset="100%" stop-color="hsl(24, 48%, 22%)"/></linearGradient>`
  ),

  covet: wrapArtSvg(
    'covet',
    'hsl(276, 52%, 18%)',
    'hsl(26, 54%, 8%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-covet-glow)"/>
     <ellipse cx="64" cy="61" rx="34" ry="6" fill="hsla(0,0%,0%,0.48)"/>
     <path d="M36 8 Q64 20 92 8" fill="none" stroke="hsl(42, 80%, 60%)" stroke-width="1.6" stroke-dasharray="3 2"/>
     <ellipse cx="64" cy="36" rx="19" ry="21" fill="hsl(28, 44%, 22%)" stroke="url(#ca-covet-gold)" stroke-width="2"/>
     <ellipse cx="64" cy="36" rx="13" ry="15" fill="hsl(278, 46%, 14%)" stroke="hsl(42, 86%, 62%)" stroke-width="1.1"/>
     <path d="M52 24 Q64 18 76 24" fill="none" stroke="hsla(50, 100%, 90%, 0.6)" stroke-width="1.1"/>
     <path d="M14 58 Q32 41 48 44 L44 54 Q30 56 20 66 Z" fill="hsl(22, 34%, 24%)" stroke="hsl(36, 52%, 52%)" stroke-width="1.1"/>
     <path d="M114 58 Q96 41 80 44 L84 54 Q98 56 108 66 Z" fill="hsl(22, 34%, 24%)" stroke="hsl(36, 52%, 52%)" stroke-width="1.1"/>
     <path d="M24 46 L42 40 L45 45 L28 52 Z" fill="hsl(26, 36%, 28%)" stroke="hsl(42, 68%, 58%)" stroke-width="0.9"/>
     <path d="M104 46 L86 40 L83 45 L100 52 Z" fill="hsl(26, 36%, 28%)" stroke="hsl(42, 68%, 58%)" stroke-width="0.9"/>
     <path d="M56 36 Q64 22 72 36 Q64 50 56 36 Z" fill="hsl(286, 88%, 62%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.1"/>
     <circle cx="64" cy="36" r="3.2" fill="hsl(48, 100%, 92%)"/>
     <path d="M36 16 Q48 24 42 36 M92 16 Q80 24 86 36" fill="none" stroke="hsl(288, 92%, 72%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="28" cy="24" r="1.6" fill="hsl(292, 100%, 78%)"/><circle cx="100" cy="24" r="1.6" fill="hsl(292, 100%, 78%)"/>
     <circle cx="44" cy="58" r="1.4" fill="hsl(46, 100%, 80%)"/><circle cx="84" cy="58" r="1.4" fill="hsl(46, 100%, 80%)"/>`,
    'hsla(286, 84%, 58%, 0.26)',
    `<radialGradient id="ca-covet-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(288, 94%, 68%)" stop-opacity="0.72"/><stop offset="60%" stop-color="hsl(36, 90%, 48%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(270, 60%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-covet-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 82%)"/><stop offset="100%" stop-color="hsl(30, 76%, 40%)"/></linearGradient>`
  ),

  memento_curse: wrapArtSvg(
    'memento_curse',
    'hsl(274, 46%, 15%)',
    'hsl(344, 52%, 7%)',
    `<circle cx="64" cy="38" r="30" fill="url(#ca-memento_curse-mist)"/>
     <ellipse cx="64" cy="64" rx="28" ry="5" fill="hsla(0,0%,0%,0.55)"/>
     <path d="M40 6 Q64 20 88 6" fill="none" stroke="hsl(42, 74%, 62%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="64" cy="17" r="3" fill="none" stroke="hsl(42, 86%, 68%)" stroke-width="1.4"/>
     <ellipse cx="64" cy="40" rx="18" ry="21" fill="hsl(24, 38%, 18%)" stroke="hsl(40, 82%, 58%)" stroke-width="2"/>
     <ellipse cx="64" cy="40" rx="12" ry="15" fill="hsl(278, 52%, 12%)" stroke="hsl(352, 76%, 54%)" stroke-width="1.2"/>
     <path d="M53 26 L73 54 M71 29 L55 51" stroke="hsl(292, 92%, 68%)" stroke-width="1.6" stroke-linecap="round" opacity="0.82"/>
     <path d="M18 46 Q32 30 46 39 M110 46 Q96 30 82 39" fill="none" stroke="hsl(352, 86%, 58%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M24 22 Q36 28 44 26 M104 22 Q92 28 84 26" fill="none" stroke="hsl(288, 86%, 66%)" stroke-width="1.3" stroke-linecap="round"/>
     <polygon points="64,31 69,40 64,49 59,40" fill="hsl(354, 92%, 60%)" stroke="hsl(48, 100%, 84%)" stroke-width="1"/>
     <circle cx="64" cy="40" r="2.2" fill="hsl(52, 100%, 92%)"/>
     <circle cx="28" cy="54" r="1.7" fill="hsl(352, 96%, 66%)"/><circle cx="100" cy="54" r="1.7" fill="hsl(352, 96%, 66%)"/>
     <circle cx="34" cy="14" r="1.5" fill="hsl(292, 94%, 72%)"/><circle cx="94" cy="14" r="1.5" fill="hsl(292, 94%, 72%)"/>`,
    'hsla(286, 78%, 48%, 0.28)',
    `<radialGradient id="ca-memento_curse-mist" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(292, 82%, 52%)" stop-opacity="0.72"/><stop offset="65%" stop-color="hsl(350, 74%, 34%)" stop-opacity="0.24"/><stop offset="100%" stop-color="hsl(270, 50%, 8%)" stop-opacity="0"/></radialGradient>`
  ),

  body_armor: wrapArtSvg(
    'body_armor',
    'hsl(214, 36%, 18%)',
    'hsl(24, 44%, 9%)',
    `<circle cx="64" cy="36" r="29" fill="url(#ca-body_armor-glow)"/>
     <ellipse cx="64" cy="65" rx="34" ry="5" fill="hsla(0,0%,0%,0.5)"/>
     <path d="M42 16 L54 12 L66 20 L78 12 L90 16 L98 36 L90 64 H42 L34 36 Z" fill="hsl(220, 36%, 10%)" opacity="0.65"/>
     <path d="M40 14 L52 10 L64 18 L76 10 L88 14 L96 34 L88 62 H40 L32 34 Z" fill="url(#ca-body_armor-plate)" stroke="hsl(40, 86%, 66%)" stroke-width="1.8" stroke-linejoin="round"/>
     <path d="M42 26 H86 M40 42 H88 M42 54 H86 M64 18 V62" stroke="hsl(214, 24%, 20%)" stroke-width="1.4"/>
     <circle cx="50" cy="20" r="2" fill="hsl(44, 96%, 72%)"/><circle cx="78" cy="20" r="2" fill="hsl(44, 96%, 72%)"/>
     <circle cx="48" cy="34" r="2" fill="hsl(44, 96%, 72%)"/><circle cx="80" cy="34" r="2" fill="hsl(44, 96%, 72%)"/>
     <circle cx="50" cy="48" r="1.8" fill="hsl(44, 96%, 72%)"/><circle cx="78" cy="48" r="1.8" fill="hsl(44, 96%, 72%)"/>
     <path d="M14 25 L36 33 L18 40" fill="none" stroke="hsl(44, 100%, 78%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M114 41 L92 35 L110 26" fill="none" stroke="hsl(44, 100%, 78%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="37" cy="33" r="3.4" fill="hsl(48, 100%, 88%)" opacity="0.92"/>
     <circle cx="91" cy="35" r="2.6" fill="hsl(44, 100%, 82%)" opacity="0.88"/>`,
    'hsla(38, 86%, 56%, 0.26)',
    `<radialGradient id="ca-body_armor-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(42, 92%, 68%)" stop-opacity="0.45"/><stop offset="100%" stop-color="hsl(214, 40%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-body_armor-plate" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 24%, 56%)"/><stop offset="52%" stop-color="hsl(216, 22%, 34%)"/><stop offset="100%" stop-color="hsl(220, 26%, 18%)"/></linearGradient>`
  ),

  called_shot: wrapArtSvg(
    'called_shot',
    'hsl(22, 64%, 19%)',
    'hsl(12, 54%, 8%)',
    `<circle cx="84" cy="36" r="27" fill="url(#ca-called_shot-glow)"/>
     <path d="M8 62 L46 52 L84 58 L120 48 V70 H8 Z" fill="hsl(14, 42%, 10%)" opacity="0.65"/>
     <circle cx="84" cy="36" r="20" fill="none" stroke="hsl(44, 100%, 72%)" stroke-width="1.6"/>
     <circle cx="84" cy="36" r="14" fill="none" stroke="hsl(36, 94%, 64%)" stroke-width="1" stroke-dasharray="4 3"/>
     <circle cx="84" cy="36" r="8" fill="none" stroke="hsl(14, 98%, 62%)" stroke-width="1.4"/>
     <line x1="84" y1="10" x2="84" y2="62" stroke="hsl(46, 100%, 78%)" stroke-width="1.2" opacity="0.8"/>
     <line x1="58" y1="36" x2="110" y2="36" stroke="hsl(46, 100%, 78%)" stroke-width="1.2" opacity="0.8"/>
     <path d="M12 42 L48 34 L50 38 L34 44 L44 50 L20 52 Z" fill="hsl(28, 42%, 32%)" stroke="hsl(42, 86%, 68%)" stroke-width="1.3" stroke-linejoin="round"/>
     <rect x="18" y="42" width="12" height="5" rx="1.5" fill="hsl(24, 34%, 22%)" stroke="hsl(40, 76%, 58%)" stroke-width="0.9"/>
     <path d="M50 36 L82 36" stroke="hsl(48, 100%, 88%)" stroke-width="2.4" stroke-dasharray="6 4" stroke-linecap="round"/>
     <polygon points="84,29 88,36 84,43 80,36" fill="hsl(8, 100%, 62%)" stroke="hsl(52, 100%, 92%)" stroke-width="1"/>
     <circle cx="62" cy="20" r="1.6" fill="hsl(48, 100%, 84%)"/><circle cx="108" cy="18" r="1.5" fill="hsl(36, 100%, 74%)"/>
     <circle cx="106" cy="54" r="1.5" fill="hsl(20, 100%, 68%)"/>`,
    'hsla(24, 96%, 56%, 0.28)',
    `<radialGradient id="ca-called_shot-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(40, 100%, 74%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(14, 72%, 12%)" stop-opacity="0"/></radialGradient>`
  ),

  coalescence: wrapArtSvg(
    'coalescence',
    'hsl(166, 48%, 18%)',
    'hsl(28, 52%, 9%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-coalescence-glow)"/>
     <ellipse cx="64" cy="62" rx="38" ry="6" fill="hsla(0,0%,0%,0.48)"/>
     <rect x="34" y="18" width="24" height="34" rx="3" transform="rotate(-14 46 35)" fill="hsl(26, 36%, 22%)" stroke="hsl(44, 94%, 68%)" stroke-width="1.6"/>
     <rect x="70" y="18" width="24" height="34" rx="3" transform="rotate(14 82 35)" fill="hsl(26, 36%, 22%)" stroke="hsl(44, 94%, 68%)" stroke-width="1.6"/>
     <line x1="40" y1="26" x2="50" y2="24" stroke="hsl(44, 86%, 72%)" stroke-width="1.1"/>
     <line x1="78" y1="24" x2="88" y2="26" stroke="hsl(44, 86%, 72%)" stroke-width="1.1"/>
     <rect x="52" y="13" width="24" height="37" rx="3" fill="url(#ca-coalescence-card)" stroke="hsl(50, 100%, 82%)" stroke-width="1.8"/>
     <rect x="55" y="16" width="18" height="31" rx="2" fill="none" stroke="hsla(52, 100%, 92%, 0.48)" stroke-width="0.9"/>
     <path d="M26 55 Q64 67 102 55" fill="none" stroke="hsl(46, 98%, 74%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M32 50 Q64 60 96 50" fill="none" stroke="hsl(154, 92%, 68%)" stroke-width="1.3" stroke-linecap="round"/>
     <polygon points="64,22 68,30 76,31 70,37 71,45 64,41 57,45 58,37 52,31 60,30" fill="hsl(50, 100%, 86%)" opacity="0.92"/>
     <circle cx="24" cy="24" r="1.8" fill="hsl(152, 96%, 74%)"/><circle cx="104" cy="24" r="1.8" fill="hsl(48, 100%, 82%)"/>
     <circle cx="28" cy="42" r="1.4" fill="hsl(46, 100%, 78%)"/><circle cx="100" cy="42" r="1.4" fill="hsl(152, 96%, 74%)"/>`,
    'hsla(156, 84%, 54%, 0.25)',
    `<radialGradient id="ca-coalescence-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 78%)" stop-opacity="0.65"/><stop offset="55%" stop-color="hsl(158, 76%, 44%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(28, 50%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-coalescence-card" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(158, 52%, 34%)"/><stop offset="100%" stop-color="hsl(172, 54%, 16%)"/></linearGradient>`
  ),

  dive: wrapArtSvg(
    'dive',
    'hsl(206, 52%, 18%)',
    'hsl(24, 54%, 9%)',
    `<circle cx="96" cy="26" r="24" fill="url(#ca-dive-glow)"/>
     <path d="M10 14 L118 38 M14 26 L116 48 M8 38 L86 54" stroke="hsl(44, 100%, 76%)" stroke-width="1.8" stroke-linecap="round" opacity="0.7"/>
     <path d="M24 54 Q56 22 90 44 L76 60 Q50 50 28 62 Z" fill="hsl(16, 44%, 9%)" opacity="0.62"/>
     <path d="M22 52 Q54 20 88 42 L74 58 Q48 48 26 60 Z" fill="url(#ca-dive-cloak)" stroke="hsl(38, 86%, 64%)" stroke-width="1.6" stroke-linejoin="round"/>
     <path d="M36 46 Q56 32 76 46" fill="none" stroke="hsl(44, 96%, 72%)" stroke-width="1.4"/>
     <path d="M62 24 Q78 18 92 26 Q78 30 62 24 Z" fill="hsl(22, 36%, 22%)" stroke="hsl(40, 82%, 62%)" stroke-width="1.3"/>
     <path d="M69 23 L73 15 Q79 13 85 16 L87 24 Z" fill="hsl(22, 36%, 22%)" stroke="hsl(40, 82%, 62%)" stroke-width="1.1"/>
     <path d="M84 44 L106 38 L104 44 L88 50 Z" fill="hsl(214, 24%, 64%)" stroke="hsl(44, 96%, 76%)" stroke-width="1.1"/>
     <path d="M10 64 Q42 54 78 66 Q98 60 118 66" fill="none" stroke="hsl(32, 68%, 54%)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="108" cy="40" r="3.2" fill="hsl(48, 100%, 84%)"/>
     <circle cx="24" cy="18" r="1.6" fill="hsl(46, 100%, 82%)"/><circle cx="48" cy="14" r="1.4" fill="hsl(200, 96%, 78%)"/>
     <circle cx="102" cy="56" r="1.6" fill="hsl(36, 98%, 68%)"/>`,
    'hsla(34, 90%, 56%, 0.25)',
    `<radialGradient id="ca-dive-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(44, 100%, 76%)" stop-opacity="0.52"/><stop offset="100%" stop-color="hsl(206, 52%, 12%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-dive-cloak" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(20, 56%, 40%)"/><stop offset="100%" stop-color="hsl(10, 48%, 16%)"/></linearGradient>`
  ),

  feint: wrapArtSvg(
    'feint',
    'hsl(296, 48%, 18%)',
    'hsl(20, 50%, 8%)',
    `<circle cx="96" cy="42" r="24" fill="url(#ca-feint-glow)"/>
     <ellipse cx="64" cy="62" rx="44" ry="5.5" fill="hsla(0,0%,0%,0.5)"/>
     <path d="M18 56 Q36 22 56 34 L48 58 Z" fill="hsla(292, 64%, 44%, 0.34)" stroke="hsl(304, 86%, 72%)" stroke-width="1.2" stroke-dasharray="4 3"/>
     <path d="M24 28 Q38 22 52 28 Q38 33 24 28 Z" fill="hsla(292, 62%, 44%, 0.36)" stroke="hsl(304, 86%, 72%)" stroke-width="1"/>
     <path d="M54 56 Q72 20 94 32 L84 58 Z" fill="url(#ca-feint-body)" stroke="hsl(42, 92%, 68%)" stroke-width="1.6" stroke-linejoin="round"/>
     <path d="M62 24 Q76 18 90 24 Q76 29 62 24 Z" fill="hsl(24, 38%, 22%)" stroke="hsl(44, 90%, 66%)" stroke-width="1.2"/>
     <path d="M36 20 Q64 7 92 22" fill="none" stroke="hsl(316, 94%, 72%)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="94,22 85,17 88,26" fill="hsl(316, 94%, 72%)"/>
     <path d="M22 44 H52 M26 50 H50" stroke="hsl(304, 84%, 74%)" stroke-width="1.2" stroke-linecap="round" opacity="0.65"/>
     <polygon points="104,34 108,40 115,39 110,44 114,50 107,48 104,54 101,48 94,50 98,44 93,39 100,40" fill="hsl(322, 86%, 56%)" stroke="hsl(48, 100%, 86%)" stroke-width="1"/>
     <circle cx="104" cy="44" r="2.2" fill="hsl(52, 100%, 92%)"/>
     <circle cx="48" cy="14" r="1.5" fill="hsl(312, 96%, 78%)"/><circle cx="114" cy="24" r="1.5" fill="hsl(46, 100%, 80%)"/>`,
    'hsla(312, 84%, 56%, 0.26)',
    `<radialGradient id="ca-feint-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(318, 92%, 66%)" stop-opacity="0.62"/><stop offset="100%" stop-color="hsl(296, 50%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-feint-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(26, 48%, 38%)"/><stop offset="100%" stop-color="hsl(14, 44%, 16%)"/></linearGradient>`
  ),

  glare: wrapArtSvg(
    'glare',
    'hsl(352, 58%, 18%)',
    'hsl(24, 52%, 8%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-glare-glow)"/>
     <rect x="10" y="18" width="108" height="36" rx="18" fill="hsl(16, 42%, 10%)" stroke="hsl(38, 86%, 58%)" stroke-width="1.6"/>
     <rect x="14" y="22" width="100" height="28" rx="14" fill="none" stroke="hsla(44, 92%, 72%, 0.35)" stroke-width="0.9"/>
     <path d="M18 32 Q64 14 110 32" fill="none" stroke="hsl(28, 44%, 28%)" stroke-width="7" stroke-linecap="round"/>
     <path d="M22 30 Q64 16 106 30" fill="none" stroke="hsl(42, 82%, 58%)" stroke-width="1.3" stroke-linecap="round"/>
     <path d="M28 36 L54 41 L34 45 Z" fill="hsl(44, 100%, 72%)" stroke="hsl(54, 100%, 92%)" stroke-width="1"/>
     <path d="M100 36 L74 41 L94 45 Z" fill="hsl(44, 100%, 72%)" stroke="hsl(54, 100%, 92%)" stroke-width="1"/>
     <circle cx="42" cy="40" r="2.2" fill="hsl(4, 100%, 56%)"/><circle cx="86" cy="40" r="2.2" fill="hsl(4, 100%, 56%)"/>
     <path d="M10 10 L30 22 M118 10 L98 22 M10 62 L30 50 M118 62 L98 50" stroke="hsl(12, 96%, 62%)" stroke-width="1.8" stroke-linecap="round"/>
     <line x1="64" y1="6" x2="64" y2="15" stroke="hsl(42, 98%, 72%)" stroke-width="1.5" stroke-linecap="round"/>
     <line x1="64" y1="57" x2="64" y2="66" stroke="hsl(42, 98%, 72%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="22" cy="36" r="1.6" fill="hsl(14, 100%, 66%)"/><circle cx="106" cy="36" r="1.6" fill="hsl(14, 100%, 66%)"/>`,
    'hsla(12, 96%, 56%, 0.30)',
    `<radialGradient id="ca-glare-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(16, 100%, 64%)" stop-opacity="0.58"/><stop offset="100%" stop-color="hsl(352, 60%, 10%)" stop-opacity="0"/></radialGradient>`
  ),

  headshot: wrapArtSvg(
    'headshot',
    'hsl(4, 66%, 19%)',
    'hsl(18, 56%, 7%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-headshot-aura)"/>
     <path d="M46 46 C46 28 52 16 64 16 C76 16 82 28 82 46 L76 58 H52 Z" fill="hsl(20, 26%, 16%)" stroke="hsl(32, 46%, 44%)" stroke-width="1.4"/>
     <ellipse cx="64" cy="61" rx="22" ry="4.5" fill="hsla(0,0%,0%,0.5)"/>
     <circle cx="64" cy="34" r="21" fill="none" stroke="hsl(46, 100%, 74%)" stroke-width="1.8"/>
     <circle cx="64" cy="34" r="15" fill="none" stroke="hsl(36, 94%, 64%)" stroke-width="1" stroke-dasharray="4 3"/>
     <circle cx="64" cy="34" r="9.5" fill="none" stroke="hsl(4, 98%, 62%)" stroke-width="1.6"/>
     <line x1="64" y1="7" x2="64" y2="61" stroke="hsl(48, 100%, 82%)" stroke-width="1.4"/>
     <line x1="37" y1="34" x2="91" y2="34" stroke="hsl(48, 100%, 82%)" stroke-width="1.4"/>
     <polygon points="64,25 67,31 74,34 67,37 64,43 61,37 54,34 61,31" fill="hsl(52, 100%, 92%)" stroke="hsl(8, 100%, 58%)" stroke-width="1.2"/>
     <path d="M10 34 L38 34 M90 34 L118 34" stroke="hsl(42, 100%, 72%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M22 22 L38 28 M106 22 L90 28 M22 46 L38 40 M106 46 L90 40" stroke="hsl(14, 98%, 64%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="26" cy="14" r="1.6" fill="hsl(48, 100%, 86%)"/><circle cx="102" cy="14" r="1.6" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(8, 100%, 56%, 0.32)',
    `<radialGradient id="ca-headshot-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(38, 100%, 72%)" stop-opacity="0.78"/><stop offset="52%" stop-color="hsl(4, 96%, 50%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(14, 60%, 10%)" stop-opacity="0"/></radialGradient>`
  ),

  high_caliber: wrapArtSvg(
    'high_caliber',
    'hsl(34, 68%, 20%)',
    'hsl(16, 56%, 8%)',
    `<circle cx="72" cy="36" r="28" fill="url(#ca-high_caliber-glow)"/>
     <ellipse cx="64" cy="56" rx="46" ry="5.5" fill="hsla(0,0%,0%,0.48)"/>
     <path d="M16 50 L68 30 L90 28 C100 28 108 32 114 38 C108 44 100 48 90 48 L68 46 L16 50 Z" fill="hsl(18, 48%, 9%)" opacity="0.62"/>
     <path d="M14 48 L66 28 L88 26 C98 26 106 30 112 36 C106 42 98 46 88 46 L66 44 L14 48 Z" fill="url(#ca-high_caliber-brass)" stroke="hsl(50, 100%, 82%)" stroke-width="1.6" stroke-linejoin="round"/>
     <rect x="14" y="31" width="7" height="14" rx="1.5" fill="hsl(32, 66%, 34%)" stroke="hsl(48, 96%, 72%)" stroke-width="1.1"/>
     <line x1="66" y1="28" x2="66" y2="44" stroke="hsl(28, 66%, 24%)" stroke-width="2"/>
     <line x1="58" y1="29" x2="58" y2="43" stroke="hsl(30, 56%, 28%)" stroke-width="1.2"/>
     <path d="M24 34 H60" stroke="hsla(52, 100%, 94%, 0.65)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M90 12 L118 20 M94 60 L118 52 M14 18 L48 18 M10 58 L46 58" stroke="hsl(44, 100%, 76%)" stroke-width="1.8" stroke-linecap="round" opacity="0.82"/>
     <circle cx="114" cy="36" r="3" fill="hsl(54, 100%, 94%)"/><circle cx="102" cy="18" r="1.6" fill="hsl(48, 100%, 86%)"/>
     <circle cx="104" cy="54" r="1.6" fill="hsl(32, 100%, 72%)"/><circle cx="38" cy="14" r="1.4" fill="hsl(46, 100%, 84%)"/>`,
    'hsla(40, 100%, 60%, 0.30)',
    `<radialGradient id="ca-high_caliber-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 80%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(20, 62%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-high_caliber-brass" x1="0" y1="0" x2="1" y2="0.4"><stop offset="0%" stop-color="hsl(36, 76%, 44%)"/><stop offset="55%" stop-color="hsl(46, 98%, 72%)"/><stop offset="100%" stop-color="hsl(20, 88%, 54%)"/></linearGradient>`
  ),

  hole_up: wrapArtSvg(
    'hole_up',
    'hsl(28, 44%, 18%)',
    'hsl(18, 48%, 8%)',
    `<circle cx="64" cy="34" r="28" fill="url(#ca-hole_up-glow)"/>
     <rect x="14" y="42" width="100" height="12" rx="3" fill="hsl(24, 42%, 28%)" stroke="hsl(36, 68%, 54%)" stroke-width="1.4"/>
     <rect x="20" y="28" width="88" height="12" rx="3" fill="hsl(22, 38%, 24%)" stroke="hsl(36, 64%, 50%)" stroke-width="1.4"/>
     <rect x="34" y="54" width="60" height="10" rx="2" fill="hsl(20, 36%, 18%)" stroke="hsl(34, 52%, 44%)" stroke-width="1.2"/>
     <line x1="42" y1="28" x2="42" y2="40" stroke="hsl(18, 40%, 14%)" stroke-width="1.4"/>
     <line x1="86" y1="28" x2="86" y2="40" stroke="hsl(18, 40%, 14%)" stroke-width="1.4"/>
     <line x1="56" y1="42" x2="56" y2="54" stroke="hsl(18, 40%, 14%)" stroke-width="1.4"/>
     <path d="M48 26 Q64 10 80 26 Z" fill="hsl(20, 34%, 14%)" stroke="hsl(40, 74%, 58%)" stroke-width="1.3"/>
     <path d="M56 22 L61 23.5 L57 25 Z M72 22 L67 23.5 L71 25 Z" fill="hsl(44, 100%, 74%)"/>
     <path d="M12 14 L32 26 M116 14 L96 26" stroke="hsl(12, 92%, 62%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="34" cy="28" r="2.6" fill="hsl(48, 100%, 84%)"/><circle cx="94" cy="28" r="2.6" fill="hsl(48, 100%, 84%)"/>
     <circle cx="24" cy="48" r="1.5" fill="hsl(42, 86%, 68%)"/><circle cx="104" cy="48" r="1.5" fill="hsl(42, 86%, 68%)"/>`,
    'hsla(32, 74%, 48%, 0.24)',
    `<radialGradient id="ca-hole_up-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(36, 86%, 58%)" stop-opacity="0.45"/><stop offset="100%" stop-color="hsl(18, 48%, 10%)" stop-opacity="0"/></radialGradient>`
  ),

  itchy_trigger: wrapArtSvg(
    'itchy_trigger',
    'hsl(38, 64%, 19%)',
    'hsl(18, 56%, 8%)',
    `<circle cx="64" cy="36" r="29" fill="url(#ca-itchy_trigger-glow)"/>
     <path d="M26 24 H104 L100 36 H60 C58 48 68 58 82 58 H56 C40 58 34 46 36 36 H26 Z" fill="hsl(20, 46%, 9%)" opacity="0.65"/>
     <path d="M24 22 H102 L98 34 H58 C56 46 66 56 80 56 H54 C38 56 32 44 34 34 H24 Z" fill="hsl(214, 22%, 34%)" stroke="hsl(42, 92%, 68%)" stroke-width="1.6" stroke-linejoin="round"/>
     <line x1="28" y1="26" x2="96" y2="26" stroke="hsla(48, 100%, 90%, 0.45)" stroke-width="1.2"/>
     <circle cx="44" cy="28" r="2.2" fill="hsl(42, 88%, 64%)"/><circle cx="88" cy="28" r="2.2" fill="hsl(42, 88%, 64%)"/>
     <path d="M62 34 Q70 43 60 51" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="3" stroke-linecap="round"/>
     <path d="M44 38 L58 43 L48 50" fill="none" stroke="hsl(32, 88%, 64%)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M76 42 L94 38 L86 46 L106 44" fill="none" stroke="hsl(48, 100%, 80%)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M16 14 L26 20 M112 14 L102 20" stroke="hsl(46, 100%, 76%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="64" cy="43" r="3" fill="hsl(52, 100%, 92%)" opacity="0.88"/>
     <circle cx="96" cy="54" r="1.8" fill="hsl(44, 100%, 78%)"/><circle cx="24" cy="52" r="1.6" fill="hsl(36, 98%, 70%)"/>`,
    'hsla(42, 98%, 58%, 0.28)',
    `<radialGradient id="ca-itchy_trigger-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(46, 100%, 76%)" stop-opacity="0.68"/><stop offset="100%" stop-color="hsl(20, 60%, 10%)" stop-opacity="0"/></radialGradient>`
  ),

  low_profile: wrapArtSvg(
    'low_profile',
    'hsl(228, 38%, 16%)',
    'hsl(24, 42%, 8%)',
    `<circle cx="64" cy="36" r="28" fill="url(#ca-low_profile-aura)"/>
     <ellipse cx="64" cy="56" rx="46" ry="10" fill="hsla(0,0%,0%,0.56)"/>
     <path d="M20 50 Q64 18 108 50 L96 60 Q64 46 32 60 Z" fill="url(#ca-low_profile-cloak)" stroke="hsl(38, 72%, 58%)" stroke-width="1.5" stroke-linejoin="round"/>
     <path d="M36 52 Q64 38 92 52" fill="none" stroke="hsl(36, 62%, 48%)" stroke-width="1.2"/>
     <path d="M26 36 Q64 22 102 36 Q64 44 26 36 Z" fill="hsl(24, 34%, 18%)" stroke="hsl(40, 78%, 60%)" stroke-width="1.5"/>
     <path d="M48 34 L52 20 Q64 15 76 20 L80 34 Z" fill="hsl(24, 34%, 18%)" stroke="hsl(40, 78%, 60%)" stroke-width="1.4"/>
     <path d="M50 31 Q64 34 78 31" fill="none" stroke="hsl(44, 92%, 68%)" stroke-width="2"/>
     <circle cx="56" cy="44" r="2.2" fill="hsl(44, 100%, 74%)"/><circle cx="72" cy="44" r="2.2" fill="hsl(44, 100%, 74%)"/>
     <path d="M14 18 L34 22 M114 18 L94 22 M16 28 L30 30 M112 28 L98 30" stroke="hsl(282, 82%, 68%)" stroke-width="1.5" stroke-linecap="round" opacity="0.72"/>
     <circle cx="24" cy="14" r="1.6" fill="hsl(286, 92%, 74%)"/><circle cx="104" cy="14" r="1.6" fill="hsl(286, 92%, 74%)"/>`,
    'hsla(240, 56%, 48%, 0.25)',
    `<radialGradient id="ca-low_profile-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(278, 72%, 52%)" stop-opacity="0.45"/><stop offset="100%" stop-color="hsl(228, 42%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-low_profile-cloak" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(224, 30%, 28%)"/><stop offset="100%" stop-color="hsl(228, 36%, 12%)"/></linearGradient>`
  ),

  manifest: wrapArtSvg(
    'manifest',
    'hsl(278, 54%, 18%)',
    'hsl(198, 52%, 9%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-manifest-aura)"/>
     <ellipse cx="64" cy="65" rx="28" ry="4.5" fill="hsla(0,0%,0%,0.52)"/>
     <path d="M64 10 L96 22 V42 C96 54 81 62 64 66 C47 62 32 54 32 42 V22 Z" fill="hsla(276, 56%, 24%, 0.72)" stroke="hsl(292, 92%, 72%)" stroke-width="1.8" stroke-linejoin="round"/>
     <path d="M64 18 L84 26 V40 C84 48 75 54 64 58 C53 54 44 48 44 40 V26 Z" fill="none" stroke="hsl(46, 98%, 74%)" stroke-width="1.3" stroke-dasharray="4 2.5"/>
     <path d="M56 32 Q64 22 72 32 Q76 42 64 48 Q52 42 56 32 Z" fill="hsl(290, 90%, 64%)" stroke="hsl(50, 100%, 88%)" stroke-width="1.2"/>
     <circle cx="61" cy="35" r="1.8" fill="hsl(48, 100%, 92%)"/><circle cx="67" cy="35" r="1.8" fill="hsl(48, 100%, 92%)"/>
     <path d="M16 26 Q24 34 30 30 M112 26 Q104 34 98 30 M18 48 Q26 44 32 48 M110 48 Q102 44 96 48" fill="none" stroke="hsl(192, 92%, 68%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="22" cy="18" r="1.8" fill="hsl(292, 96%, 78%)"/><circle cx="106" cy="18" r="1.8" fill="hsl(292, 96%, 78%)"/>
     <circle cx="26" cy="56" r="1.6" fill="hsl(48, 100%, 82%)"/><circle cx="102" cy="56" r="1.6" fill="hsl(48, 100%, 82%)"/>`,
    'hsla(288, 86%, 58%, 0.30)',
    `<radialGradient id="ca-manifest-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(290, 96%, 72%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(268, 56%, 10%)" stop-opacity="0"/></radialGradient>`
  ),

  misfire: wrapArtSvg(
    'misfire',
    'hsl(16, 62%, 19%)',
    'hsl(220, 34%, 8%)',
    `<circle cx="76" cy="34" r="26" fill="url(#ca-misfire-smoke)"/>
     <path d="M18 46 L60 36 L64 44 L36 52 L30 64 L20 60 Z" fill="hsl(220, 34%, 10%)" opacity="0.64"/>
     <path d="M16 44 L58 34 L62 42 L34 50 L28 62 L18 58 Z" fill="hsl(214, 22%, 34%)" stroke="hsl(36, 72%, 60%)" stroke-width="1.4" stroke-linejoin="round"/>
     <circle cx="38" cy="43" r="4.5" fill="hsl(216, 20%, 24%)" stroke="hsl(40, 82%, 62%)" stroke-width="1.1"/>
     <path d="M58 34 L72 24 L68 36 L82 32 L70 42 L76 50 L60 42 Z" fill="hsl(32, 100%, 64%)" stroke="hsl(52, 100%, 90%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M78 24 Q92 14 104 22 Q114 30 102 42 Q110 52 94 56 Q80 56 76 46" fill="hsla(216, 18%, 68%, 0.34)" stroke="hsl(36, 48%, 74%)" stroke-width="1.4"/>
     <circle cx="94" cy="36" r="10" fill="hsla(216, 20%, 74%, 0.22)"/>
     <path d="M88 30 L96 38 M96 30 L88 38" stroke="hsl(4, 96%, 64%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M62 14 L66 22 M76 56 L82 64 M48 20 L54 26" stroke="hsl(44, 100%, 78%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="56" cy="14" r="1.6" fill="hsl(48, 100%, 88%)"/><circle cx="108" cy="16" r="1.6" fill="hsl(28, 100%, 68%)"/>`,
    'hsla(24, 92%, 54%, 0.28)',
    `<radialGradient id="ca-misfire-smoke" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(36, 100%, 70%)" stop-opacity="0.75"/><stop offset="65%" stop-color="hsl(214, 18%, 46%)" stop-opacity="0.3"/><stop offset="100%" stop-color="hsl(220, 30%, 10%)" stop-opacity="0"/></radialGradient>`
  ),

  pistol_whip: wrapArtSvg(
    'pistol_whip',
    'hsl(308, 48%, 18%)',
    'hsl(18, 52%, 8%)',
    `<circle cx="94" cy="46" r="24" fill="url(#ca-pistol_whip-glow)"/>
     <path d="M16 15 Q54 11 90 39" fill="none" stroke="hsl(42, 98%, 72%)" stroke-width="3.2" stroke-linecap="round" opacity="0.78"/>
     <path d="M12 24 Q48 20 82 45" fill="none" stroke="hsl(318, 92%, 66%)" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
     <path d="M18 33 Q44 30 70 49" fill="none" stroke="hsl(36, 94%, 64%)" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>
     <path d="M38 24 L78 42 L70 52 L50 44 L46 60 L34 56 L38 40 Z" fill="hsl(18, 46%, 9%)" opacity="0.62"/>
     <path d="M36 22 L76 40 L68 50 L48 42 L44 58 L32 54 L36 38 Z" fill="url(#ca-pistol_whip-steel)" stroke="hsl(44, 94%, 72%)" stroke-width="1.5" stroke-linejoin="round"/>
     <circle cx="52" cy="36" r="4.2" fill="hsl(216, 22%, 26%)" stroke="hsl(44, 90%, 66%)" stroke-width="1.1"/>
     <polygon points="94,34 100,42 110,41 103,48 108,57 98,53 94,62 90,53 80,57 85,48 78,41 88,42" fill="hsl(312, 82%, 54%)" stroke="hsl(50, 100%, 88%)" stroke-width="1.2" stroke-linejoin="round"/>
     <circle cx="94" cy="48" r="3.4" fill="hsl(52, 100%, 92%)"/>
     <path d="M108 24 L116 18 M112 48 L120 50 M82 20 L88 12" stroke="hsl(46, 100%, 80%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="72" cy="18" r="1.6" fill="hsl(318, 96%, 76%)"/><circle cx="114" cy="34" r="1.5" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(312, 86%, 56%, 0.28)',
    `<radialGradient id="ca-pistol_whip-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(318, 96%, 68%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(308, 48%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-pistol_whip-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 24%, 70%)"/><stop offset="100%" stop-color="hsl(24, 48%, 26%)"/></linearGradient>`
  ),

  quickdraw: wrapArtSvg(
    'quickdraw',
    'hsl(42, 66%, 20%)',
    'hsl(20, 56%, 8%)',
    `<circle cx="72" cy="34" r="28" fill="url(#ca-quickdraw-glow)"/>
     <path d="M8 20 H72 M12 32 H96 M8 46 H84 M14 56 H64" stroke="hsl(46, 100%, 76%)" stroke-width="1.8" stroke-linecap="round" opacity="0.72"/>
     <rect x="74" y="14" width="22" height="32" rx="3" transform="rotate(-12 85 30)" fill="hsl(26, 40%, 24%)" stroke="hsl(46, 98%, 74%)" stroke-width="1.5"/>
     <rect x="92" y="18" width="22" height="32" rx="3" transform="rotate(10 103 34)" fill="hsl(24, 42%, 28%)" stroke="hsl(50, 100%, 84%)" stroke-width="1.6"/>
     <polygon points="103,27 106,33 103,39 100,33" fill="hsl(48, 100%, 82%)"/>
     <path d="M24 46 L68 32 L72 40 L46 50 L38 64 L26 60 Z" fill="hsl(18, 48%, 9%)" opacity="0.62"/>
     <path d="M22 44 L66 30 L70 38 L44 48 L36 62 L24 58 Z" fill="url(#ca-quickdraw-gun)" stroke="hsl(46, 96%, 74%)" stroke-width="1.4" stroke-linejoin="round"/>
     <circle cx="44" cy="41" r="4.2" fill="hsl(216, 22%, 26%)" stroke="hsl(46, 94%, 72%)" stroke-width="1.1"/>
     <circle cx="72" cy="32" r="4.6" fill="hsl(50, 100%, 88%)"/>
     <circle cx="24" cy="14" r="1.6" fill="hsl(50, 100%, 86%)"/><circle cx="62" cy="14" r="1.5" fill="hsl(44, 100%, 80%)"/>
     <circle cx="88" cy="58" r="1.6" fill="hsl(36, 100%, 72%)"/>`,
    'hsla(44, 100%, 60%, 0.28)',
    `<radialGradient id="ca-quickdraw-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 78%)" stop-opacity="0.64"/><stop offset="100%" stop-color="hsl(24, 58%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-quickdraw-gun" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(44, 92%, 72%)"/><stop offset="55%" stop-color="hsl(214, 20%, 44%)"/><stop offset="100%" stop-color="hsl(24, 46%, 20%)"/></linearGradient>`
  ),

  roulette: wrapArtSvg(
    'roulette',
    'hsl(354, 58%, 18%)',
    'hsl(22, 54%, 8%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-roulette-glow)"/>
     <circle cx="64" cy="36" r="27" fill="hsl(220, 22%, 22%)" stroke="hsl(44, 96%, 68%)" stroke-width="2.2"/>
     <circle cx="64" cy="36" r="23" fill="none" stroke="hsla(48, 100%, 86%, 0.36)" stroke-width="1" stroke-dasharray="4 3"/>
     <circle cx="64" cy="36" r="6" fill="hsl(42, 86%, 56%)" stroke="hsl(24, 52%, 20%)" stroke-width="1.2"/>
     <circle cx="64" cy="18" r="5.4" fill="hsl(46, 98%, 68%)" stroke="hsl(28, 62%, 24%)" stroke-width="1.2"/>
     <circle cx="64" cy="18" r="2.2" fill="hsl(54, 100%, 94%)"/>
     <circle cx="79.5" cy="27" r="5.4" fill="hsl(224, 34%, 12%)" stroke="hsl(42, 70%, 54%)" stroke-width="1.2"/>
     <circle cx="79.5" cy="45" r="5.4" fill="hsl(224, 34%, 12%)" stroke="hsl(42, 70%, 54%)" stroke-width="1.2"/>
     <circle cx="64" cy="54" r="5.4" fill="hsl(224, 34%, 12%)" stroke="hsl(42, 70%, 54%)" stroke-width="1.2"/>
     <circle cx="48.5" cy="45" r="5.4" fill="hsl(224, 34%, 12%)" stroke="hsl(42, 70%, 54%)" stroke-width="1.2"/>
     <circle cx="48.5" cy="27" r="5.4" fill="hsl(224, 34%, 12%)" stroke="hsl(42, 70%, 54%)" stroke-width="1.2"/>
     <path d="M22 22 A46 46 0 0 1 42 10 M106 50 A46 46 0 0 1 86 62" fill="none" stroke="hsl(46, 100%, 76%)" stroke-width="2" stroke-linecap="round"/>
     <polygon points="43,10 35,8 38,15" fill="hsl(46, 100%, 78%)"/><polygon points="85,62 93,64 90,57" fill="hsl(46, 100%, 78%)"/>`,
    'hsla(358, 90%, 54%, 0.28)',
    `<radialGradient id="ca-roulette-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(358, 92%, 56%)" stop-opacity="0.58"/><stop offset="100%" stop-color="hsl(22, 54%, 8%)" stop-opacity="0"/></radialGradient>`
  ),

  spray_and_pray: wrapArtSvg(
    'spray_and_pray',
    'hsl(18, 66%, 20%)',
    'hsl(352, 52%, 8%)',
    `<circle cx="44" cy="36" r="24" fill="url(#ca-spray_and_pray-flash)"/>
     <path d="M12 44 L46 36 L48 44 L26 50 L20 62 L12 58 Z" fill="hsl(18, 48%, 9%)" opacity="0.62"/>
     <path d="M10 42 L44 34 L46 42 L24 48 L18 60 L10 56 Z" fill="hsl(214, 22%, 34%)" stroke="hsl(40, 88%, 64%)" stroke-width="1.4" stroke-linejoin="round"/>
     <circle cx="28" cy="41" r="4" fill="hsl(216, 20%, 24%)" stroke="hsl(42, 86%, 64%)" stroke-width="1.1"/>
     <path d="M48 36 L118 14 M48 36 L120 30 M48 36 L118 46 M48 36 L112 62" stroke="hsl(46, 100%, 78%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M52 36 L116 22 M52 36 L114 54" stroke="hsl(18, 100%, 64%)" stroke-width="1.6" stroke-linecap="round" opacity="0.82"/>
     <polygon points="48,36 58,30 55,36 60,42 48,39" fill="hsl(52, 100%, 92%)"/>
     <circle cx="102" cy="19" r="3" fill="hsl(52, 100%, 92%)"/><circle cx="110" cy="31" r="2.8" fill="hsl(44, 100%, 82%)"/>
     <circle cx="106" cy="45" r="3" fill="hsl(52, 100%, 92%)"/><circle cx="96" cy="56" r="2.6" fill="hsl(26, 100%, 70%)"/>
     <circle cx="82" cy="14" r="1.7" fill="hsl(48, 100%, 86%)"/><circle cx="78" cy="58" r="1.7" fill="hsl(32, 100%, 72%)"/>`,
    'hsla(24, 100%, 58%, 0.30)',
    `<radialGradient id="ca-spray_and_pray-flash" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(50, 100%, 86%)" stop-opacity="0.85"/><stop offset="100%" stop-color="hsl(18, 80%, 14%)" stop-opacity="0"/></radialGradient>`
  ),

  tracking_shot: wrapArtSvg(
    'tracking_shot',
    'hsl(36, 62%, 19%)',
    'hsl(198, 48%, 9%)',
    `<circle cx="92" cy="34" r="25" fill="url(#ca-tracking_shot-glow)"/>
     <path d="M8 62 L44 50 L82 58 L120 46 V70 H8 Z" fill="hsl(206, 42%, 10%)" opacity="0.65"/>
     <path d="M12 52 Q42 18 92 34" fill="none" stroke="hsl(46, 100%, 76%)" stroke-width="2.8" stroke-linecap="round"/>
     <path d="M12 52 Q42 18 92 34" fill="none" stroke="hsl(54, 100%, 96%)" stroke-width="1" stroke-linecap="round"/>
     <circle cx="92" cy="34" r="15" fill="none" stroke="hsl(46, 100%, 74%)" stroke-width="1.6"/>
     <circle cx="92" cy="34" r="10" fill="none" stroke="hsl(38, 92%, 64%)" stroke-width="0.9" stroke-dasharray="3 2"/>
     <circle cx="92" cy="34" r="5.5" fill="none" stroke="hsl(192, 98%, 74%)" stroke-width="1.4"/>
     <line x1="92" y1="14" x2="92" y2="54" stroke="hsl(46, 100%, 80%)" stroke-width="1.2"/>
     <line x1="72" y1="34" x2="112" y2="34" stroke="hsl(46, 100%, 80%)" stroke-width="1.2"/>
     <circle cx="92" cy="34" r="2.2" fill="hsl(54, 100%, 94%)"/>
     <circle cx="38" cy="33" r="2.4" fill="hsl(48, 100%, 88%)"/><circle cx="62" cy="27" r="2.2" fill="hsl(48, 100%, 88%)"/>
     <circle cx="24" cy="42" r="1.8" fill="hsl(192, 98%, 78%)"/>`,
    'hsla(42, 98%, 58%, 0.28)',
    `<radialGradient id="ca-tracking_shot-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 78%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(204, 56%, 12%)" stop-opacity="0"/></radialGradient>`
  ),

  vantage: wrapArtSvg(
    'vantage',
    'hsl(32, 58%, 20%)',
    'hsl(214, 48%, 9%)',
    `<circle cx="94" cy="22" r="18" fill="url(#ca-vantage-sun)"/>
     <path d="M8 66 L30 48 L56 54 L96 34 L120 44 V66 Z" fill="hsl(214, 34%, 14%)" opacity="0.72"/>
     <path d="M8 66 L44 34 L76 46 L120 22 V66 Z" fill="hsl(24, 38%, 18%)" stroke="hsl(36, 62%, 48%)" stroke-width="1.4"/>
     <path d="M36 36 L44 20 L52 36 Z" fill="hsl(22, 34%, 14%)" stroke="hsl(44, 92%, 68%)" stroke-width="1.3"/>
     <path d="M35 22 Q44 17 53 22" fill="none" stroke="hsl(44, 96%, 72%)" stroke-width="2"/>
     <path d="M40 20 L42 14 H46 L48 20 Z" fill="hsl(22, 34%, 14%)" stroke="hsl(44, 92%, 68%)" stroke-width="1"/>
     <path d="M52 28 L94 22" stroke="hsl(48, 100%, 84%)" stroke-width="1.6" stroke-dasharray="4 3"/>
     <circle cx="94" cy="22" r="7" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.2"/>
     <polygon points="88,48 96,38 104,48 99,48 99,58 93,58 93,48" fill="hsl(148, 86%, 58%)" stroke="hsl(52, 100%, 90%)" stroke-width="1"/>
     <polygon points="74,54 79,48 84,54 81,54 81,60 77,60 77,54" fill="hsl(46, 98%, 68%)" stroke="hsl(52, 100%, 92%)" stroke-width="0.9"/>
     <circle cx="24" cy="22" r="1.5" fill="hsl(48, 100%, 86%)"/><circle cx="64" cy="14" r="1.4" fill="hsl(44, 100%, 80%)"/>`,
    'hsla(40, 92%, 58%, 0.26)',
    `<radialGradient id="ca-vantage-sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(50, 100%, 88%)"/><stop offset="65%" stop-color="hsl(36, 98%, 58%)" stop-opacity="0.6"/><stop offset="100%" stop-color="hsl(28, 72%, 20%)" stop-opacity="0"/></radialGradient>`
  ),

  wide_open: wrapArtSvg(
    'wide_open',
    'hsl(352, 62%, 19%)',
    'hsl(24, 54%, 8%)',
    `<circle cx="64" cy="36" r="28" fill="url(#ca-wide_open-glow)"/>
     <ellipse cx="64" cy="62" rx="34" ry="5" fill="hsla(0,0%,0%,0.5)"/>
     <path d="M36 14 L56 20 L50 56 L32 48 Z" fill="hsl(214, 24%, 36%)" stroke="hsl(40, 82%, 64%)" stroke-width="1.5" stroke-linejoin="round"/>
     <path d="M92 14 L72 20 L78 56 L96 48 Z" fill="hsl(214, 24%, 36%)" stroke="hsl(40, 82%, 64%)" stroke-width="1.5" stroke-linejoin="round"/>
     <line x1="40" y1="26" x2="52" y2="28" stroke="hsl(42, 74%, 64%)" stroke-width="1.1"/>
     <line x1="88" y1="26" x2="76" y2="28" stroke="hsl(42, 74%, 64%)" stroke-width="1.1"/>
     <path d="M14 36 L42 36 M114 36 L86 36" stroke="hsl(46, 100%, 76%)" stroke-width="2" stroke-linecap="round"/>
     <polygon points="14,36 22,31 22,41" fill="hsl(46, 100%, 76%)"/><polygon points="114,36 106,31 106,41" fill="hsl(46, 100%, 76%)"/>
     <polygon points="64,18 70,30 82,36 70,42 64,54 58,42 46,36 58,30" fill="hsl(8, 98%, 60%)" stroke="hsl(52, 100%, 90%)" stroke-width="1.3"/>
     <circle cx="64" cy="36" r="3.6" fill="hsl(54, 100%, 96%)"/>
     <circle cx="26" cy="18" r="1.5" fill="hsl(48, 100%, 84%)"/><circle cx="102" cy="18" r="1.5" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(10, 96%, 56%, 0.30)',
    `<radialGradient id="ca-wide_open-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(14, 100%, 70%)" stop-opacity="0.78"/><stop offset="100%" stop-color="hsl(352, 60%, 10%)" stop-opacity="0"/></radialGradient>`
  ),
};
