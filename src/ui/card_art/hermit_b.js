// Bespoke 16:9 SVG card illustrations for The Hermit (part B: 26 uncommon cards).
import { wrapArtSvg } from './wrap.js';

export const HERMIT_CARD_ART_B = {
  big_shot: wrapArtSvg(
    'big_shot',
    'hsl(18, 66%, 19%)',
    'hsl(12, 54%, 7%)',
    `<circle cx="86" cy="30" r="28" fill="url(#ca-big_shot-heat)"/>
     <path d="M6 62 L38 52 L74 58 L122 46 V70 H6 Z" fill="hsl(14, 42%, 9%)" opacity="0.68"/>
     <path d="M12 58 L72 30 L80 42 L26 68 Z" fill="hsl(12, 48%, 8%)" opacity="0.65"/>
     <path d="M10 54 L70 26 L78 38 L22 65 Z" fill="url(#ca-big_shot-barrel)" stroke="hsl(36, 92%, 68%)" stroke-width="1.6" stroke-linejoin="round"/>
     <line x1="18" y1="53" x2="66" y2="30" stroke="hsla(48, 100%, 90%, 0.6)" stroke-width="1.3" stroke-linecap="round"/>
     <line x1="24" y1="58" x2="72" y2="35" stroke="hsl(16, 72%, 24%)" stroke-width="1.2"/>
     <polygon points="62,28 68,20 71,26" fill="hsl(28, 86%, 62%)" stroke="hsl(48, 100%, 84%)" stroke-width="0.9"/>
     <ellipse cx="74" cy="32" rx="4.5" ry="7.2" transform="rotate(-26 74 32)" fill="hsl(24, 100%, 60%)" stroke="hsl(50, 100%, 90%)" stroke-width="1.4"/>
     <ellipse cx="74" cy="32" rx="2.2" ry="4" transform="rotate(-26 74 32)" fill="hsl(54, 100%, 95%)"/>
     <path d="M78 26 Q86 12 98 16 Q112 18 106 30 Q116 38 102 44 Q90 44 82 36" fill="hsla(24, 34%, 64%, 0.28)" stroke="hsl(32, 86%, 72%)" stroke-width="1.4"/>
     <path d="M84 22 Q92 8 108 10 Q118 14 114 24" fill="none" stroke="hsla(36, 92%, 76%, 0.56)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="96" cy="28" r="11" fill="none" stroke="hsl(44, 100%, 76%)" stroke-width="1.2" stroke-dasharray="4 2.5"/>
     <line x1="96" y1="13" x2="96" y2="21" stroke="hsl(48, 100%, 84%)" stroke-width="1.3"/>
     <line x1="96" y1="35" x2="96" y2="43" stroke="hsl(48, 100%, 84%)" stroke-width="1.3"/>
     <line x1="81" y1="28" x2="89" y2="28" stroke="hsl(48, 100%, 84%)" stroke-width="1.3"/>
     <line x1="103" y1="28" x2="111" y2="28" stroke="hsl(48, 100%, 84%)" stroke-width="1.3"/>
     <circle cx="88" cy="18" r="2" fill="hsl(48, 100%, 88%)"/><circle cx="114" cy="36" r="1.8" fill="hsl(22, 100%, 68%)"/>
     <circle cx="106" cy="54" r="1.6" fill="hsl(40, 100%, 78%)"/><circle cx="54" cy="18" r="1.5" fill="hsl(30, 100%, 72%)"/>`,
    'hsla(24, 100%, 58%, 0.30)',
    `<radialGradient id="ca-big_shot-heat" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(44, 100%, 78%)" stop-opacity="0.82"/><stop offset="52%" stop-color="hsl(14, 96%, 52%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(12, 64%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-big_shot-barrel" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(216, 22%, 28%)"/><stop offset="58%" stop-color="hsl(214, 20%, 44%)"/><stop offset="85%" stop-color="hsl(18, 92%, 52%)"/><stop offset="100%" stop-color="hsl(42, 100%, 74%)"/></linearGradient>`
  ),

  brawl: wrapArtSvg(
    'brawl',
    'hsl(30, 58%, 19%)',
    'hsl(316, 46%, 9%)',
    `<circle cx="72" cy="36" r="28" fill="url(#ca-brawl-burst)"/>
     <ellipse cx="64" cy="64" rx="44" ry="5" fill="hsla(0,0%,0%,0.5)"/>
     <path d="M10 26 Q34 22 54 36" fill="none" stroke="hsl(44, 98%, 74%)" stroke-width="2.6" stroke-linecap="round" opacity="0.78"/>
     <path d="M12 42 Q32 38 50 42" fill="none" stroke="hsl(316, 90%, 66%)" stroke-width="1.8" stroke-linecap="round" opacity="0.72"/>
     <path d="M12 30 L42 26 L54 32 L54 44 L40 48 L12 46 Z" fill="hsl(24, 42%, 28%)" stroke="hsl(40, 88%, 68%)" stroke-width="1.5" stroke-linejoin="round"/>
     <rect x="40" y="27" width="13" height="17" rx="3" fill="hsl(28, 52%, 44%)" stroke="hsl(44, 94%, 74%)" stroke-width="1.3"/>
     <line x1="44" y1="28" x2="44" y2="43" stroke="hsl(22, 46%, 22%)" stroke-width="1.2"/>
     <line x1="49" y1="28" x2="49" y2="43" stroke="hsl(22, 46%, 22%)" stroke-width="1.2"/>
     <polygon points="70,15 76,27 90,22 81,34 94,41 80,44 85,58 72,49 62,60 63,46 50,43 61,35 54,23 66,27" fill="hsl(314, 82%, 52%)" stroke="hsl(48, 100%, 86%)" stroke-width="1.3" stroke-linejoin="round"/>
     <polygon points="70,24 74,32 82,33 75,38 78,46 70,41 62,46 65,38 58,33 66,32" fill="hsl(46, 100%, 78%)"/>
     <circle cx="70" cy="36" r="3.4" fill="hsl(54, 100%, 96%)"/>
     <polygon points="92,16 116,10 118,16 96,22" fill="url(#ca-brawl-wood)" stroke="hsl(36, 78%, 62%)" stroke-width="1.1"/>
     <polygon points="96,46 118,54 114,61 92,52" fill="url(#ca-brawl-wood)" stroke="hsl(36, 78%, 62%)" stroke-width="1.1"/>
     <polygon points="88,26 112,28 110,33 88,31" fill="hsl(24, 52%, 34%)" stroke="hsl(38, 72%, 58%)" stroke-width="0.9"/>
     <path d="M98 36 L116 34 M86 10 L96 6 M84 62 L94 66" stroke="hsl(48, 100%, 82%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="108" cy="22" r="1.8" fill="hsl(318, 96%, 76%)"/><circle cx="104" cy="44" r="1.6" fill="hsl(48, 100%, 86%)"/>
     <circle cx="30" cy="16" r="1.5" fill="hsl(42, 98%, 74%)"/>`,
    'hsla(318, 88%, 56%, 0.28)',
    `<radialGradient id="ca-brawl-burst" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(44, 100%, 76%)" stop-opacity="0.78"/><stop offset="56%" stop-color="hsl(316, 86%, 50%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(316, 48%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-brawl-wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(30, 58%, 46%)"/><stop offset="100%" stop-color="hsl(18, 52%, 22%)"/></linearGradient>`
  ),

  cheat: wrapArtSvg(
    'cheat',
    'hsl(154, 42%, 15%)',
    'hsl(24, 54%, 8%)',
    `<circle cx="72" cy="34" r="28" fill="url(#ca-cheat-glow)"/>
     <ellipse cx="64" cy="64" rx="44" ry="5" fill="hsla(0,0%,0%,0.48)"/>
     <rect x="82" y="16" width="22" height="32" rx="3" transform="rotate(-10 93 32)" fill="hsl(24, 34%, 20%)" stroke="hsl(40, 70%, 54%)" stroke-width="1.2"/>
     <rect x="96" y="20" width="22" height="32" rx="3" transform="rotate(12 107 36)" fill="hsl(22, 36%, 18%)" stroke="hsl(40, 70%, 54%)" stroke-width="1.2"/>
     <path d="M8 46 L42 32 L54 50 L20 66 Z" fill="url(#ca-cheat-sleeve)" stroke="hsl(36, 72%, 56%)" stroke-width="1.5" stroke-linejoin="round"/>
     <path d="M36 35 L48 52" stroke="hsl(42, 86%, 68%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M40 38 L58 32 L64 40 L48 52 Z" fill="hsl(26, 44%, 34%)" stroke="hsl(40, 76%, 60%)" stroke-width="1.2" stroke-linejoin="round"/>
     <rect x="52" y="16" width="26" height="38" rx="3.5" transform="rotate(8 65 35)" fill="url(#ca-cheat-ace)" stroke="hsl(52, 100%, 88%)" stroke-width="1.8"/>
     <rect x="55.5" y="19.5" width="19" height="31" rx="2" transform="rotate(8 65 35)" fill="none" stroke="hsla(42, 82%, 34%, 0.55)" stroke-width="1"/>
     <polygon points="66,26 71,35 64,43 60,34" fill="hsl(24, 62%, 18%)" stroke="hsl(48, 100%, 84%)" stroke-width="0.9"/>
     <circle cx="59" cy="23" r="1.5" fill="hsl(24, 64%, 22%)"/><circle cx="71" cy="46" r="1.5" fill="hsl(24, 64%, 22%)"/>
     <path d="M28 52 Q48 44 64 38" fill="none" stroke="hsl(46, 100%, 78%)" stroke-width="2" stroke-dasharray="5 3" stroke-linecap="round"/>
     <path d="M34 26 Q54 12 80 18" fill="none" stroke="hsl(42, 100%, 72%)" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
     <path d="M52 56 Q76 62 100 54" fill="none" stroke="hsl(152, 82%, 62%)" stroke-width="1.3" stroke-linecap="round" opacity="0.72"/>
     <polygon points="78,12 80,16 84,18 80,20 78,24 76,20 72,18 76,16" fill="hsl(52, 100%, 92%)"/>
     <circle cx="42" cy="18" r="1.6" fill="hsl(48, 100%, 86%)"/><circle cx="114" cy="14" r="1.5" fill="hsl(44, 100%, 78%)"/>`,
    'hsla(44, 98%, 58%, 0.28)',
    `<radialGradient id="ca-cheat-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 78%)" stop-opacity="0.72"/><stop offset="60%" stop-color="hsl(154, 70%, 40%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(24, 54%, 8%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-cheat-ace" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="55%" stop-color="hsl(44, 96%, 68%)"/><stop offset="100%" stop-color="hsl(32, 84%, 46%)"/></linearGradient><linearGradient id="ca-cheat-sleeve" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(24, 42%, 30%)"/><stop offset="100%" stop-color="hsl(16, 46%, 14%)"/></linearGradient>`
  ),

  combo: wrapArtSvg(
    'combo',
    'hsl(36, 66%, 19%)',
    'hsl(214, 46%, 8%)',
    `<circle cx="64" cy="36" r="28" fill="url(#ca-combo-flash)"/>
     <path d="M64 36 C44 12 16 14 16 36 C16 58 44 60 64 36 C84 12 112 14 112 36 C112 58 84 60 64 36 Z" fill="none" stroke="hsl(36, 94%, 56%)" stroke-width="5.2" opacity="0.34"/>
     <path d="M64 36 C44 12 16 14 16 36 C16 58 44 60 64 36 C84 12 112 14 112 36 C112 58 84 60 64 36 Z" fill="none" stroke="hsl(46, 100%, 76%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M64 36 C44 12 16 14 16 36 C16 58 44 60 64 36 C84 12 112 14 112 36 C112 58 84 60 64 36 Z" fill="none" stroke="hsl(54, 100%, 94%)" stroke-width="0.9" stroke-dasharray="8 6"/>
     <path d="M22 22 L38 14 C44 13 48 16 48 20 C45 23 41 25 36 25 L24 27 Z" fill="url(#ca-combo-bullet)" stroke="hsl(52, 100%, 88%)" stroke-width="1.2" stroke-linejoin="round"/>
     <line x1="34" y1="16" x2="36" y2="25" stroke="hsl(28, 66%, 24%)" stroke-width="1.3"/>
     <path d="M106 50 L90 58 C84 59 80 56 80 52 C83 49 87 47 92 47 L104 45 Z" fill="url(#ca-combo-bullet)" stroke="hsl(52, 100%, 88%)" stroke-width="1.2" stroke-linejoin="round"/>
     <line x1="94" y1="56" x2="92" y2="47" stroke="hsl(28, 66%, 24%)" stroke-width="1.3"/>
     <circle cx="64" cy="36" r="12" fill="none" stroke="hsl(46, 100%, 78%)" stroke-width="1.5"/>
     <circle cx="64" cy="36" r="6.5" fill="none" stroke="hsl(18, 98%, 64%)" stroke-width="1.2"/>
     <line x1="64" y1="18" x2="64" y2="54" stroke="hsl(50, 100%, 86%)" stroke-width="1.2"/>
     <line x1="46" y1="36" x2="82" y2="36" stroke="hsl(50, 100%, 86%)" stroke-width="1.2"/>
     <polygon points="64,29 67,33 71,36 67,39 64,43 61,39 57,36 61,33" fill="hsl(54, 100%, 96%)"/>
     <circle cx="24" cy="52" r="1.8" fill="hsl(46, 100%, 82%)"/><circle cx="104" cy="20" r="1.8" fill="hsl(46, 100%, 82%)"/>
     <circle cx="46" cy="14" r="1.5" fill="hsl(52, 100%, 90%)"/><circle cx="82" cy="58" r="1.5" fill="hsl(52, 100%, 90%)"/>`,
    'hsla(42, 100%, 60%, 0.30)',
    `<radialGradient id="ca-combo-flash" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(50, 100%, 84%)" stop-opacity="0.8"/><stop offset="56%" stop-color="hsl(34, 96%, 54%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(214, 50%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-combo-bullet" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 86%)"/><stop offset="100%" stop-color="hsl(28, 86%, 44%)"/></linearGradient>`
  ),

  cursed_weapon: wrapArtSvg(
    'cursed_weapon',
    'hsl(282, 54%, 15%)',
    'hsl(348, 56%, 7%)',
    `<circle cx="68" cy="34" r="30" fill="url(#ca-cursed_weapon-aura)"/>
     <ellipse cx="64" cy="64" rx="44" ry="5" fill="hsla(0,0%,0%,0.55)"/>
     <path d="M16 54 L36 38 L104 20 L108 29 L56 44 L44 50 L32 64 L18 60 Z" fill="hsl(280, 46%, 8%)" opacity="0.68"/>
     <path d="M14 51 L34 35 L102 17 L106 26 L54 41 L42 47 L30 61 L16 57 Z" fill="url(#ca-cursed_weapon-gun)" stroke="hsl(296, 86%, 68%)" stroke-width="1.5" stroke-linejoin="round"/>
     <path d="M38 34 L34 25 L42 26 L44 33 Z" fill="hsl(350, 82%, 52%)" stroke="hsl(48, 100%, 84%)" stroke-width="1"/>
     <circle cx="48" cy="40" r="5" fill="hsl(276, 42%, 14%)" stroke="hsl(352, 86%, 58%)" stroke-width="1.3"/>
     <circle cx="48" cy="40" r="2" fill="hsl(354, 98%, 68%)"/>
     <path d="M36 46 Q46 54 54 44" fill="none" stroke="hsl(296, 82%, 68%)" stroke-width="1.3"/>
     <path d="M52 24 Q64 40 76 22 Q88 34 100 18" fill="none" stroke="hsl(292, 96%, 72%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M58 44 Q72 26 86 38 Q98 24 114 26" fill="none" stroke="hsl(352, 94%, 60%)" stroke-width="1.7" stroke-linecap="round"/>
     <polygon points="70,28 74,23 78,28 74,33" fill="hsl(354, 96%, 64%)" stroke="hsl(50, 100%, 88%)" stroke-width="0.9"/>
     <polygon points="88,23 91,19 94,23 91,27" fill="hsl(296, 98%, 76%)"/>
     <path d="M106 20 Q114 10 120 18 Q116 26 110 25 Z" fill="hsl(352, 96%, 58%)" stroke="hsl(44, 100%, 82%)" stroke-width="0.9"/>
     <path d="M64 12 L68 18 M68 12 L64 18 M84 44 L88 50 M88 44 L84 50" stroke="hsl(294, 96%, 76%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="24" cy="24" r="1.8" fill="hsl(352, 96%, 66%)"/><circle cx="114" cy="42" r="1.8" fill="hsl(294, 96%, 76%)"/>
     <circle cx="52" cy="14" r="1.5" fill="hsl(356, 98%, 70%)"/><circle cx="96" cy="54" r="1.6" fill="hsl(352, 96%, 66%)"/>`,
    'hsla(318, 86%, 52%, 0.30)',
    `<radialGradient id="ca-cursed_weapon-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(344, 94%, 56%)" stop-opacity="0.65"/><stop offset="58%" stop-color="hsl(286, 86%, 46%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(280, 56%, 8%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-cursed_weapon-gun" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(274, 34%, 18%)"/><stop offset="55%" stop-color="hsl(284, 32%, 30%)"/><stop offset="100%" stop-color="hsl(348, 60%, 34%)"/></linearGradient>`
  ),

  dead_mans_hand: wrapArtSvg(
    'dead_mans_hand',
    'hsl(268, 46%, 15%)',
    'hsl(206, 48%, 7%)',
    `<circle cx="64" cy="40" r="32" fill="url(#ca-dead_mans_hand-fire)"/>
     <ellipse cx="64" cy="66" rx="44" ry="5" fill="hsla(0,0%,0%,0.54)"/>
     <rect x="20" y="20" width="22" height="34" rx="2.5" transform="rotate(-22 31 37)" fill="url(#ca-dead_mans_hand-card)" stroke="hsl(174, 88%, 68%)" stroke-width="1.4"/>
     <rect x="38" y="14" width="22" height="34" rx="2.5" transform="rotate(-8 49 31)" fill="url(#ca-dead_mans_hand-card)" stroke="hsl(180, 92%, 76%)" stroke-width="1.5"/>
     <rect x="66" y="14" width="22" height="34" rx="2.5" transform="rotate(8 77 31)" fill="url(#ca-dead_mans_hand-card)" stroke="hsl(286, 88%, 74%)" stroke-width="1.5"/>
     <rect x="86" y="20" width="22" height="34" rx="2.5" transform="rotate(22 97 37)" fill="url(#ca-dead_mans_hand-card)" stroke="hsl(286, 84%, 68%)" stroke-width="1.4"/>
     <path d="M49 23 C45 27 43 31 46 33 C47.5 34 49 33 49 33 C49 33 50.5 34 52 33 C55 31 53 27 49 23 Z" fill="hsl(174, 96%, 68%)"/>
     <polygon points="49,33 47,38 51,38" fill="hsl(174, 96%, 68%)"/>
     <circle cx="30" cy="34" r="3" fill="hsl(286, 88%, 72%)"/><circle cx="33" cy="39" r="3" fill="hsl(286, 88%, 72%)"/>
     <circle cx="77" cy="27" r="3.4" fill="none" stroke="hsl(290, 94%, 78%)" stroke-width="1.6"/>
     <circle cx="76" cy="34" r="3.8" fill="none" stroke="hsl(290, 94%, 78%)" stroke-width="1.6"/>
     <circle cx="98" cy="33" r="3" fill="none" stroke="hsl(174, 94%, 72%)" stroke-width="1.5"/>
     <circle cx="96" cy="39" r="3.4" fill="none" stroke="hsl(174, 94%, 72%)" stroke-width="1.5"/>
     <path d="M16 64 Q26 42 38 54 Q50 32 64 52 Q78 32 90 54 Q102 42 112 64 Z" fill="hsla(176, 88%, 54%, 0.42)" stroke="hsl(174, 98%, 78%)" stroke-width="1.3"/>
     <path d="M28 64 Q44 46 64 58 Q84 46 100 64 Z" fill="hsla(288, 90%, 62%, 0.44)" stroke="hsl(292, 96%, 78%)" stroke-width="1.1"/>
     <circle cx="24" cy="14" r="1.6" fill="hsl(176, 98%, 78%)"/><circle cx="104" cy="14" r="1.6" fill="hsl(290, 98%, 78%)"/>
     <circle cx="64" cy="10" r="1.7" fill="hsl(180, 100%, 84%)"/>`,
    'hsla(176, 90%, 54%, 0.28)',
    `<radialGradient id="ca-dead_mans_hand-fire" cx="50%" cy="55%" r="52%"><stop offset="0%" stop-color="hsl(176, 96%, 64%)" stop-opacity="0.72"/><stop offset="58%" stop-color="hsl(286, 84%, 52%)" stop-opacity="0.3"/><stop offset="100%" stop-color="hsl(214, 52%, 8%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-dead_mans_hand-card" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(240, 26%, 22%)"/><stop offset="100%" stop-color="hsl(260, 32%, 11%)"/></linearGradient>`
  ),

  deadeye: wrapArtSvg(
    'deadeye',
    'hsl(18, 62%, 17%)',
    'hsl(8, 52%, 7%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-deadeye-glow)"/>
     <path d="M8 22 Q64 4 120 22 L114 30 Q64 16 14 30 Z" fill="hsl(18, 38%, 12%)" stroke="hsl(36, 68%, 48%)" stroke-width="1.2"/>
     <path d="M14 38 Q64 10 114 38 Q64 64 14 38 Z" fill="hsl(20, 36%, 13%)" stroke="hsl(40, 88%, 64%)" stroke-width="2" stroke-linejoin="round"/>
     <path d="M22 38 Q64 16 106 38 Q64 58 22 38 Z" fill="hsl(32, 46%, 20%)" stroke="hsla(48, 100%, 84%, 0.45)" stroke-width="1"/>
     <circle cx="64" cy="38" r="16" fill="url(#ca-deadeye-iris)" stroke="hsl(48, 100%, 84%)" stroke-width="1.6"/>
     <circle cx="64" cy="38" r="11" fill="none" stroke="hsl(24, 92%, 44%)" stroke-width="1" stroke-dasharray="3 2"/>
     <circle cx="64" cy="38" r="6" fill="hsl(12, 64%, 12%)" stroke="hsl(46, 100%, 76%)" stroke-width="1"/>
     <circle cx="64" cy="38" r="19" fill="none" stroke="hsl(8, 96%, 62%)" stroke-width="1.2" stroke-dasharray="6 4"/>
     <line x1="64" y1="12" x2="64" y2="28" stroke="hsl(8, 100%, 66%)" stroke-width="1.6" stroke-linecap="round"/>
     <line x1="64" y1="48" x2="64" y2="64" stroke="hsl(8, 100%, 66%)" stroke-width="1.6" stroke-linecap="round"/>
     <line x1="36" y1="38" x2="54" y2="38" stroke="hsl(8, 100%, 66%)" stroke-width="1.6" stroke-linecap="round"/>
     <line x1="74" y1="38" x2="92" y2="38" stroke="hsl(8, 100%, 66%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="64,31 67,38 64,45 61,38" fill="hsl(4, 100%, 60%)" stroke="hsl(54, 100%, 94%)" stroke-width="0.9"/>
     <circle cx="64" cy="38" r="2.1" fill="hsl(54, 100%, 96%)"/>
     <circle cx="70" cy="32" r="2.2" fill="hsla(52, 100%, 94%, 0.85)"/>
     <path d="M18 54 Q64 66 110 54" fill="none" stroke="hsl(34, 72%, 52%)" stroke-width="1.2" opacity="0.68"/>
     <circle cx="24" cy="14" r="1.5" fill="hsl(46, 100%, 84%)"/><circle cx="104" cy="14" r="1.5" fill="hsl(46, 100%, 84%)"/>`,
    'hsla(20, 100%, 58%, 0.30)',
    `<radialGradient id="ca-deadeye-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(44, 100%, 76%)" stop-opacity="0.72"/><stop offset="56%" stop-color="hsl(10, 94%, 48%)" stop-opacity="0.3"/><stop offset="100%" stop-color="hsl(8, 54%, 8%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-deadeye-iris" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 84%)"/><stop offset="58%" stop-color="hsl(38, 100%, 58%)"/><stop offset="100%" stop-color="hsl(14, 86%, 34%)"/></radialGradient>`
  ),

  desperado: wrapArtSvg(
    'desperado',
    'hsl(10, 68%, 20%)',
    'hsl(352, 56%, 8%)',
    `<circle cx="64" cy="30" r="25" fill="url(#ca-desperado-sun)"/>
     <path d="M6 62 L24 46 L46 52 L84 44 L106 50 L122 42 V70 H6 Z" fill="hsl(354, 46%, 11%)" opacity="0.75"/>
     <ellipse cx="64" cy="64" rx="40" ry="5" fill="hsla(0,0%,0%,0.52)"/>
     <path d="M40 58 L50 28 L78 28 L88 58 L74 54 L64 62 L54 54 Z" fill="url(#ca-desperado-cloak)" stroke="hsl(38, 92%, 68%)" stroke-width="1.5" stroke-linejoin="round"/>
     <path d="M46 21 Q64 15 82 21 Q64 26 46 21 Z" fill="hsl(16, 40%, 14%)" stroke="hsl(42, 92%, 68%)" stroke-width="1.3"/>
     <path d="M55 20 L58 11 Q64 9 70 11 L73 20 Z" fill="hsl(16, 40%, 14%)" stroke="hsl(42, 92%, 68%)" stroke-width="1.2"/>
     <path d="M56 33 L72 45 M58 43 L68 37" stroke="hsl(8, 96%, 62%)" stroke-width="1.3" stroke-linecap="round"/>
     <path d="M24 38 L46 34 L48 40 L26 44 Z" fill="hsl(214, 22%, 44%)" stroke="hsl(46, 96%, 76%)" stroke-width="1.2"/>
     <path d="M80 34 L102 38 L100 44 L78 40 Z" fill="hsl(214, 22%, 44%)" stroke="hsl(46, 96%, 76%)" stroke-width="1.2"/>
     <polygon points="22,40 10,32 16,40 8,46 18,45 14,53 24,44" fill="hsl(46, 100%, 82%)" stroke="hsl(16, 100%, 60%)" stroke-width="1"/>
     <polygon points="106,40 118,32 112,40 120,46 110,45 114,53 104,44" fill="hsl(46, 100%, 82%)" stroke="hsl(16, 100%, 60%)" stroke-width="1"/>
     <circle cx="20" cy="41" r="3" fill="hsl(54, 100%, 96%)"/><circle cx="108" cy="41" r="3" fill="hsl(54, 100%, 96%)"/>
     <path d="M12 64 Q30 56 46 62 M82 62 Q98 56 116 64" fill="none" stroke="hsl(28, 76%, 54%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="32" cy="18" r="1.6" fill="hsl(48, 100%, 86%)"/><circle cx="96" cy="18" r="1.6" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(14, 100%, 58%, 0.32)',
    `<radialGradient id="ca-desperado-sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(46, 100%, 82%)"/><stop offset="48%" stop-color="hsl(10, 96%, 56%)" stop-opacity="0.86"/><stop offset="100%" stop-color="hsl(352, 74%, 14%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-desperado-cloak" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(16, 46%, 24%)"/><stop offset="100%" stop-color="hsl(352, 46%, 10%)"/></linearGradient>`
  ),

  determination: wrapArtSvg(
    'determination',
    'hsl(32, 56%, 18%)',
    'hsl(220, 42%, 8%)',
    `<circle cx="64" cy="36" r="31" fill="url(#ca-determination-aura)"/>
     <ellipse cx="64" cy="64" rx="34" ry="5" fill="hsla(0,0%,0%,0.5)"/>
     <path d="M36 60 C34 26 44 12 64 12 C84 12 94 26 92 60 Z" fill="hsla(44, 96%, 62%, 0.16)" stroke="hsl(46, 100%, 76%)" stroke-width="1.8"/>
     <path d="M42 60 C40 30 48 18 64 18 C80 18 88 30 86 60" fill="none" stroke="hsla(52, 100%, 90%, 0.5)" stroke-width="1" stroke-dasharray="5 3"/>
     <path d="M50 60 L54 32 H74 L78 60 Z" fill="url(#ca-determination-body)" stroke="hsl(44, 94%, 70%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M48 27 Q64 21 80 27 Q64 31 48 27 Z" fill="hsl(22, 36%, 18%)" stroke="hsl(46, 96%, 72%)" stroke-width="1.3"/>
     <path d="M56 26 L58 18 Q64 16 70 18 L72 26 Z" fill="hsl(22, 36%, 18%)" stroke="hsl(46, 96%, 72%)" stroke-width="1.1"/>
     <line x1="10" y1="24" x2="34" y2="32" stroke="hsl(356, 94%, 58%)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="36,33 28,28 29,35" fill="hsl(356, 96%, 62%)"/>
     <line x1="118" y1="24" x2="94" y2="32" stroke="hsl(356, 94%, 58%)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="92,33 100,28 99,35" fill="hsl(356, 96%, 62%)"/>
     <path d="M12 46 Q24 52 34 46 M94 46 Q104 52 116 46" fill="none" stroke="hsl(352, 82%, 56%)" stroke-width="2" stroke-dasharray="4 2.5" stroke-linecap="round"/>
     <polygon points="36,33 41,28 39,35 43,39 36,38" fill="hsl(52, 100%, 92%)"/>
     <polygon points="92,33 87,28 89,35 85,39 92,38" fill="hsl(52, 100%, 92%)"/>
     <circle cx="64" cy="40" r="3" fill="hsl(50, 100%, 88%)" opacity="0.88"/>
     <circle cx="26" cy="14" r="1.6" fill="hsl(48, 100%, 84%)"/><circle cx="102" cy="14" r="1.6" fill="hsl(48, 100%, 84%)"/>
     <circle cx="44" cy="10" r="1.5" fill="hsl(52, 100%, 92%)"/><circle cx="84" cy="10" r="1.5" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(44, 100%, 60%, 0.30)',
    `<radialGradient id="ca-determination-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 82%)" stop-opacity="0.72"/><stop offset="62%" stop-color="hsl(36, 96%, 52%)" stop-opacity="0.24"/><stop offset="100%" stop-color="hsl(220, 48%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-determination-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(26, 46%, 30%)"/><stop offset="100%" stop-color="hsl(220, 34%, 14%)"/></linearGradient>`
  ),

  enervate: wrapArtSvg(
    'enervate',
    'hsl(186, 52%, 17%)',
    'hsl(26, 52%, 8%)',
    `<circle cx="48" cy="36" r="28" fill="url(#ca-enervate-orb)"/>
     <circle cx="98" cy="36" r="18" fill="none" stroke="hsl(34, 82%, 58%)" stroke-width="1.6" stroke-dasharray="6 3"/>
     <circle cx="98" cy="36" r="11" fill="hsla(20, 48%, 14%, 0.72)" stroke="hsl(186, 86%, 64%)" stroke-width="1.4"/>
     <path d="M90 24 L106 48 M106 24 L90 48" stroke="hsl(46, 100%, 80%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M62 36 L112 36" stroke="hsl(46, 100%, 78%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M100 32 L114 32 C118 32 121 34 123 36 C121 38 118 40 114 40 L100 40 Z" fill="url(#ca-enervate-bullet)" stroke="hsl(54, 100%, 90%)" stroke-width="1.1"/>
     <path d="M94 34 C78 14 54 14 36 32 C26 42 18 44 12 38" fill="none" stroke="hsl(182, 98%, 70%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M92 42 C74 58 54 56 38 42" fill="none" stroke="hsl(46, 100%, 76%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="52" cy="34" r="10" fill="hsla(182, 96%, 64%, 0.34)" stroke="hsl(182, 100%, 82%)" stroke-width="1.5"/>
     <circle cx="52" cy="34" r="5" fill="hsl(50, 100%, 88%)"/>
     <rect x="14" y="20" width="17" height="24" rx="2.5" transform="rotate(-14 22 32)" fill="hsl(190, 46%, 22%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.5"/>
     <polygon points="22,27 25,32 22,37 19,32" fill="hsl(48, 100%, 84%)"/>
     <polygon points="98,28 101,34 107,36 101,38 98,44 95,38 89,36 95,34" fill="hsl(52, 100%, 92%)"/>
     <circle cx="38" cy="18" r="1.7" fill="hsl(182, 100%, 82%)"/><circle cx="76" cy="20" r="1.6" fill="hsl(48, 100%, 86%)"/>
     <circle cx="70" cy="54" r="1.6" fill="hsl(182, 100%, 80%)"/><circle cx="26" cy="54" r="1.5" fill="hsl(44, 100%, 78%)"/>`,
    'hsla(182, 92%, 58%, 0.28)',
    `<radialGradient id="ca-enervate-orb" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(182, 100%, 74%)" stop-opacity="0.72"/><stop offset="56%" stop-color="hsl(44, 96%, 56%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(26, 52%, 8%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-enervate-bullet" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(36, 86%, 48%)"/><stop offset="100%" stop-color="hsl(52, 100%, 86%)"/></linearGradient>`
  ),

  eye_of_the_storm: wrapArtSvg(
    'eye_of_the_storm',
    'hsl(216, 46%, 16%)',
    'hsl(28, 54%, 9%)',
    `<circle cx="64" cy="36" r="24" fill="url(#ca-eye_of_the_storm-calm)"/>
     <ellipse cx="64" cy="36" rx="54" ry="29" fill="none" stroke="url(#ca-eye_of_the_storm-cyclone)" stroke-width="5.5" opacity="0.65"/>
     <ellipse cx="64" cy="36" rx="44" ry="24" fill="none" stroke="hsl(32, 62%, 54%)" stroke-width="2.4" stroke-dasharray="18 8" opacity="0.72"/>
     <ellipse cx="64" cy="36" rx="34" ry="19" fill="none" stroke="hsl(206, 82%, 68%)" stroke-width="1.8" stroke-dasharray="14 7" opacity="0.76"/>
     <path d="M12 14 L24 22 L18 28 L30 36" fill="none" stroke="hsl(196, 100%, 82%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M116 58 L104 50 L110 44 L98 36" fill="none" stroke="hsl(196, 100%, 82%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M108 12 L98 20 L104 24 L94 30" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M20 60 L30 52 L24 48 L34 42" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="64" cy="36" r="16" fill="hsla(216, 42%, 12%, 0.65)" stroke="hsl(46, 100%, 76%)" stroke-width="1.8"/>
     <circle cx="64" cy="36" r="9.5" fill="none" stroke="hsl(48, 100%, 86%)" stroke-width="1.1" stroke-dasharray="4 2.5"/>
     <line x1="64" y1="15" x2="64" y2="27" stroke="hsl(50, 100%, 88%)" stroke-width="1.5" stroke-linecap="round"/>
     <line x1="64" y1="45" x2="64" y2="57" stroke="hsl(50, 100%, 88%)" stroke-width="1.5" stroke-linecap="round"/>
     <line x1="43" y1="36" x2="55" y2="36" stroke="hsl(50, 100%, 88%)" stroke-width="1.5" stroke-linecap="round"/>
     <line x1="73" y1="36" x2="85" y2="36" stroke="hsl(50, 100%, 88%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="64" cy="36" r="3" fill="hsl(54, 100%, 96%)"/>
     <circle cx="42" cy="16" r="1.5" fill="hsl(46, 100%, 82%)"/><circle cx="86" cy="56" r="1.5" fill="hsl(196, 100%, 84%)"/>`,
    'hsla(44, 100%, 62%, 0.28)',
    `<radialGradient id="ca-eye_of_the_storm-calm" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 84%)" stop-opacity="0.78"/><stop offset="60%" stop-color="hsl(198, 84%, 56%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(216, 46%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-eye_of_the_storm-cyclone" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(204, 72%, 62%)"/><stop offset="50%" stop-color="hsl(32, 68%, 54%)"/><stop offset="100%" stop-color="hsl(208, 72%, 58%)"/></linearGradient>`
  ),

  flash_powder: wrapArtSvg(
    'flash_powder',
    'hsl(228, 48%, 12%)',
    'hsl(220, 42%, 6%)',
    `<circle cx="74" cy="32" r="34" fill="url(#ca-flash_powder-flare)"/>
     <circle cx="74" cy="32" r="24" fill="none" stroke="hsla(52, 100%, 92%, 0.45)" stroke-width="1.3" stroke-dasharray="5 4"/>
     <circle cx="74" cy="32" r="15" fill="none" stroke="hsla(48, 100%, 86%, 0.65)" stroke-width="1.2"/>
     <polygon points="74,4 79,23 98,12 85,27 116,32 85,37 98,52 79,41 74,60 69,41 50,52 63,37 38,32 63,27 50,12 69,23" fill="hsl(48, 100%, 86%)" stroke="hsl(56, 100%, 98%)" stroke-width="1" stroke-linejoin="round"/>
     <circle cx="74" cy="32" r="8.5" fill="hsl(58, 100%, 98%)"/>
     <line x1="26" y1="32" x2="122" y2="32" stroke="hsla(54, 100%, 96%, 0.72)" stroke-width="1.6" stroke-linecap="round"/>
     <line x1="74" y1="4" x2="74" y2="62" stroke="hsla(54, 100%, 96%, 0.72)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M16 54 Q18 40 28 42 L36 52 Q34 62 22 64 Z" fill="url(#ca-flash_powder-pouch)" stroke="hsl(38, 80%, 62%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M26 43 L34 38 L37 46" fill="none" stroke="hsl(44, 92%, 72%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M35 42 Q48 38 60 34" fill="none" stroke="hsl(50, 100%, 88%)" stroke-width="2" stroke-dasharray="2 3" stroke-linecap="round"/>
     <circle cx="22" cy="18" r="1.8" fill="hsl(54, 100%, 94%)"/><circle cx="38" cy="14" r="1.5" fill="hsl(48, 100%, 86%)"/>
     <circle cx="110" cy="14" r="1.9" fill="hsl(54, 100%, 94%)"/><circle cx="116" cy="48" r="1.8" fill="hsl(46, 100%, 82%)"/>
     <circle cx="96" cy="60" r="1.6" fill="hsl(52, 100%, 92%)"/><circle cx="48" cy="58" r="1.6" fill="hsl(48, 100%, 86%)"/>
     <circle cx="14" cy="32" r="1.5" fill="hsl(204, 92%, 82%)"/>`,
    'hsla(50, 100%, 72%, 0.34)',
    `<radialGradient id="ca-flash_powder-flare" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)" stop-opacity="0.95"/><stop offset="46%" stop-color="hsl(46, 100%, 72%)" stop-opacity="0.54"/><stop offset="100%" stop-color="hsl(224, 54%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-flash_powder-pouch" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(28, 52%, 38%)"/><stop offset="100%" stop-color="hsl(18, 48%, 16%)"/></linearGradient>`
  ),

  fully_loaded: wrapArtSvg(
    'fully_loaded',
    'hsl(26, 56%, 18%)',
    'hsl(214, 38%, 8%)',
    `<circle cx="68" cy="36" r="30" fill="url(#ca-fully_loaded-glow)"/>
     <ellipse cx="64" cy="64" rx="46" ry="5" fill="hsla(0,0%,0%,0.5)"/>
     <path d="M8 46 L64 14 L74 26 L18 58 Z" fill="hsl(22, 46%, 22%)" stroke="hsl(38, 78%, 58%)" stroke-width="1.5" stroke-linejoin="round"/>
     <rect x="18" y="34" width="6.5" height="16" rx="2" transform="rotate(-30 21 42)" fill="url(#ca-fully_loaded-brass)" stroke="hsl(52, 100%, 86%)" stroke-width="1"/>
     <rect x="29" y="28" width="6.5" height="16" rx="2" transform="rotate(-30 32 36)" fill="url(#ca-fully_loaded-brass)" stroke="hsl(52, 100%, 86%)" stroke-width="1"/>
     <rect x="40" y="22" width="6.5" height="16" rx="2" transform="rotate(-30 43 30)" fill="url(#ca-fully_loaded-brass)" stroke="hsl(52, 100%, 86%)" stroke-width="1"/>
     <rect x="51" y="16" width="6.5" height="16" rx="2" transform="rotate(-30 54 24)" fill="url(#ca-fully_loaded-brass)" stroke="hsl(52, 100%, 86%)" stroke-width="1"/>
     <path d="M90 12 L114 20 V38 C114 50 103 58 90 62 C77 58 66 50 66 38 V20 Z" fill="hsla(214, 30%, 24%, 0.78)" stroke="hsl(44, 94%, 70%)" stroke-width="1.6" stroke-linejoin="round"/>
     <circle cx="90" cy="36" r="19" fill="url(#ca-fully_loaded-steel)" stroke="hsl(46, 98%, 74%)" stroke-width="1.7"/>
     <circle cx="90" cy="36" r="4.2" fill="hsl(44, 92%, 62%)" stroke="hsl(24, 52%, 20%)" stroke-width="1"/>
     <circle cx="90" cy="24" r="3.8" fill="url(#ca-fully_loaded-brass)" stroke="hsl(52, 100%, 90%)" stroke-width="1"/>
     <circle cx="100.4" cy="30" r="3.8" fill="url(#ca-fully_loaded-brass)" stroke="hsl(52, 100%, 90%)" stroke-width="1"/>
     <circle cx="100.4" cy="42" r="3.8" fill="url(#ca-fully_loaded-brass)" stroke="hsl(52, 100%, 90%)" stroke-width="1"/>
     <circle cx="90" cy="48" r="3.8" fill="url(#ca-fully_loaded-brass)" stroke="hsl(52, 100%, 90%)" stroke-width="1"/>
     <circle cx="79.6" cy="42" r="3.8" fill="url(#ca-fully_loaded-brass)" stroke="hsl(52, 100%, 90%)" stroke-width="1"/>
     <circle cx="79.6" cy="30" r="3.8" fill="url(#ca-fully_loaded-brass)" stroke="hsl(52, 100%, 90%)" stroke-width="1"/>
     <polygon points="62,50 64,54 68,56 64,58 62,62 60,58 56,56 60,54" fill="hsl(52, 100%, 92%)"/>
     <circle cx="22" cy="18" r="1.6" fill="hsl(48, 100%, 86%)"/><circle cx="116" cy="14" r="1.6" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(42, 96%, 58%, 0.28)',
    `<radialGradient id="ca-fully_loaded-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(46, 100%, 76%)" stop-opacity="0.62"/><stop offset="100%" stop-color="hsl(214, 42%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-fully_loaded-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 86%)"/><stop offset="60%" stop-color="hsl(42, 94%, 60%)"/><stop offset="100%" stop-color="hsl(26, 76%, 36%)"/></linearGradient><linearGradient id="ca-fully_loaded-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 24%, 56%)"/><stop offset="100%" stop-color="hsl(218, 28%, 22%)"/></linearGradient>`
  ),

  gestalt: wrapArtSvg(
    'gestalt',
    'hsl(268, 56%, 16%)',
    'hsl(242, 54%, 7%)',
    `<circle cx="64" cy="28" r="32" fill="url(#ca-gestalt-rift)"/>
     <path d="M8 10 L32 20 L24 28 L44 34 M120 10 L96 20 L104 28 L84 34" fill="none" stroke="hsl(288, 92%, 74%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M16 42 L34 36 M112 42 L94 36" stroke="hsl(46, 100%, 78%)" stroke-width="1.3" stroke-linecap="round"/>
     <path d="M22 24 Q64 2 106 24 Q64 46 22 24 Z" fill="hsl(262, 56%, 12%)" stroke="hsl(48, 100%, 78%)" stroke-width="1.8" stroke-linejoin="round"/>
     <circle cx="64" cy="24" r="12" fill="url(#ca-gestalt-iris)" stroke="hsl(52, 100%, 88%)" stroke-width="1.3"/>
     <polygon points="64,14 68,24 64,34 60,24" fill="hsl(258, 62%, 10%)" stroke="hsl(50, 100%, 86%)" stroke-width="0.9"/>
     <circle cx="64" cy="24" r="2.2" fill="hsl(54, 100%, 96%)"/>
     <ellipse cx="64" cy="24" rx="22" ry="7" fill="none" stroke="hsla(292, 96%, 78%, 0.55)" stroke-width="1" stroke-dasharray="4 3"/>
     <path d="M36 66 C36 46 48 38 64 38 C80 38 92 46 92 66 Z" fill="hsla(282, 82%, 56%, 0.24)" stroke="hsl(46, 100%, 78%)" stroke-width="1.5"/>
     <path d="M44 66 C44 50 52 44 64 44 C76 44 84 50 84 66" fill="none" stroke="hsl(292, 92%, 76%)" stroke-width="1.1" stroke-dasharray="3 2.5"/>
     <path d="M55 66 L58 51 H70 L73 66 Z" fill="hsl(246, 36%, 14%)" stroke="hsl(44, 90%, 68%)" stroke-width="1.2"/>
     <path d="M53 50 Q64 46 75 50 Q64 53 53 50 Z" fill="hsl(246, 36%, 14%)" stroke="hsl(46, 94%, 72%)" stroke-width="1.1"/>
     <path d="M59 49 L61 44 H67 L69 49 Z" fill="hsl(246, 36%, 14%)" stroke="hsl(46, 94%, 72%)" stroke-width="1"/>
     <circle cx="18" cy="24" r="1.7" fill="hsl(292, 98%, 80%)"/><circle cx="110" cy="24" r="1.7" fill="hsl(292, 98%, 80%)"/>
     <circle cx="28" cy="56" r="1.6" fill="hsl(48, 100%, 84%)"/><circle cx="100" cy="56" r="1.6" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(286, 90%, 58%, 0.30)',
    `<radialGradient id="ca-gestalt-rift" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(290, 96%, 68%)" stop-opacity="0.72"/><stop offset="56%" stop-color="hsl(44, 96%, 56%)" stop-opacity="0.26"/><stop offset="100%" stop-color="hsl(244, 58%, 8%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-gestalt-iris" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 84%)"/><stop offset="52%" stop-color="hsl(288, 92%, 62%)"/><stop offset="100%" stop-color="hsl(260, 74%, 28%)"/></radialGradient>`
  ),

  ghostly_presence: wrapArtSvg(
    'ghostly_presence',
    'hsl(182, 54%, 15%)',
    'hsl(214, 48%, 7%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-ghostly_presence-aura)"/>
     <ellipse cx="64" cy="64" rx="34" ry="4.5" fill="hsla(180, 88%, 54%, 0.24)"/>
     <path d="M40 62 Q44 38 50 28 H78 Q84 38 88 62 L76 55 L64 64 L52 55 Z" fill="url(#ca-ghostly_presence-spirit)" stroke="hsl(178, 96%, 76%)" stroke-width="1.5" stroke-linejoin="round" opacity="0.82"/>
     <path d="M46 25 Q64 17 82 25 Q64 30 46 25 Z" fill="hsla(182, 72%, 44%, 0.48)" stroke="hsl(178, 98%, 80%)" stroke-width="1.4"/>
     <path d="M55 24 L58 14 Q64 11 70 14 L73 24 Z" fill="hsla(182, 72%, 44%, 0.52)" stroke="hsl(178, 98%, 80%)" stroke-width="1.2"/>
     <circle cx="59" cy="31" r="2.2" fill="hsl(46, 100%, 82%)"/><circle cx="69" cy="31" r="2.2" fill="hsl(46, 100%, 82%)"/>
     <path d="M10 22 L116 48 L108 52 L14 28 Z" fill="hsl(216, 20%, 62%)" stroke="hsl(200, 42%, 86%)" stroke-width="1.1" opacity="0.78"/>
     <path d="M118 22 L12 48 L20 52 L114 28 Z" fill="hsl(216, 20%, 56%)" stroke="hsl(200, 42%, 86%)" stroke-width="1.1" opacity="0.72"/>
     <ellipse cx="64" cy="39" rx="16" ry="7" fill="none" stroke="hsl(178, 100%, 80%)" stroke-width="1.6" stroke-dasharray="5 3"/>
     <ellipse cx="64" cy="39" rx="9" ry="4" fill="none" stroke="hsl(46, 100%, 80%)" stroke-width="1.2"/>
     <path d="M28 56 Q44 48 56 54 M72 54 Q84 48 100 56" fill="none" stroke="hsl(178, 96%, 72%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M36 16 Q46 20 44 28 M92 16 Q82 20 84 28" fill="none" stroke="hsl(44, 100%, 76%)" stroke-width="1.2" stroke-linecap="round" opacity="0.78"/>
     <circle cx="24" cy="14" r="1.7" fill="hsl(178, 100%, 82%)"/><circle cx="104" cy="14" r="1.7" fill="hsl(46, 100%, 82%)"/>
     <circle cx="20" cy="58" r="1.5" fill="hsl(178, 100%, 80%)"/><circle cx="108" cy="58" r="1.5" fill="hsl(46, 100%, 80%)"/>`,
    'hsla(178, 94%, 56%, 0.30)',
    `<radialGradient id="ca-ghostly_presence-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(178, 100%, 72%)" stop-opacity="0.72"/><stop offset="60%" stop-color="hsl(44, 96%, 58%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(214, 52%, 8%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-ghostly_presence-spirit" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(178, 92%, 68%)" stop-opacity="0.72"/><stop offset="60%" stop-color="hsl(190, 76%, 44%)" stop-opacity="0.46"/><stop offset="100%" stop-color="hsl(42, 92%, 58%)" stop-opacity="0.18"/></linearGradient>`
  ),

  golden_bullet: wrapArtSvg(
    'golden_bullet',
    'hsl(40, 68%, 19%)',
    'hsl(22, 58%, 8%)',
    `<circle cx="78" cy="34" r="30" fill="url(#ca-golden_bullet-halo)"/>
     <circle cx="82" cy="34" r="22" fill="none" stroke="hsl(50, 100%, 84%)" stroke-width="1.6" stroke-dasharray="6 3"/>
     <circle cx="82" cy="34" r="16" fill="none" stroke="hsl(42, 98%, 68%)" stroke-width="1"/>
     <path d="M18 48 L72 30 L92 26 C102 25 110 28 116 33 C111 39 104 44 95 45 L75 45 L22 57 Z" fill="hsl(22, 56%, 9%)" opacity="0.6"/>
     <path d="M16 44 L70 26 L90 22 C100 21 108 24 114 29 C109 35 102 40 93 41 L73 41 L20 53 Z" fill="url(#ca-golden_bullet-gold)" stroke="hsl(56, 100%, 92%)" stroke-width="1.6" stroke-linejoin="round"/>
     <line x1="25" y1="41" x2="29" y2="51" stroke="hsl(32, 74%, 28%)" stroke-width="1.8"/>
     <line x1="68" y1="27" x2="72" y2="41" stroke="hsl(32, 74%, 28%)" stroke-width="2"/>
     <path d="M36 42 L56 35 M40 46 L60 39" stroke="hsla(56, 100%, 96%, 0.72)" stroke-width="1.4" stroke-linecap="round"/>
     <polygon points="50,35 55,37 52,42 47,40" fill="hsl(56, 100%, 94%)"/>
     <circle cx="30" cy="18" r="6" fill="url(#ca-golden_bullet-gold)" stroke="hsl(54, 100%, 92%)" stroke-width="1.3"/>
     <circle cx="30" cy="18" r="3" fill="none" stroke="hsl(32, 72%, 34%)" stroke-width="0.9"/>
     <circle cx="48" cy="58" r="5.2" fill="url(#ca-golden_bullet-gold)" stroke="hsl(54, 100%, 92%)" stroke-width="1.2"/>
     <circle cx="48" cy="58" r="2.5" fill="none" stroke="hsl(32, 72%, 34%)" stroke-width="0.9"/>
     <circle cx="16" cy="28" r="4" fill="url(#ca-golden_bullet-gold)" stroke="hsl(54, 100%, 90%)" stroke-width="1"/>
     <polygon points="104,12 106,16 110,18 106,20 104,24 102,20 98,18 102,16" fill="hsl(56, 100%, 96%)"/>
     <polygon points="94,50 96,53 99,55 96,57 94,60 92,57 89,55 92,53" fill="hsl(52, 100%, 90%)"/>
     <circle cx="62" cy="14" r="1.6" fill="hsl(54, 100%, 94%)"/>`,
    'hsla(46, 100%, 62%, 0.34)',
    `<radialGradient id="ca-golden_bullet-halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 88%)" stop-opacity="0.86"/><stop offset="56%" stop-color="hsl(42, 98%, 56%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(22, 62%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-golden_bullet-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(56, 100%, 90%)"/><stop offset="48%" stop-color="hsl(44, 100%, 64%)"/><stop offset="100%" stop-color="hsl(30, 86%, 38%)"/></linearGradient>`
  ),

  grudge: wrapArtSvg(
    'grudge',
    'hsl(288, 56%, 16%)',
    'hsl(320, 52%, 7%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-grudge-vortex)"/>
     <ellipse cx="64" cy="36" rx="50" ry="26" fill="none" stroke="hsl(296, 92%, 66%)" stroke-width="2" stroke-dasharray="12 5" opacity="0.72"/>
     <ellipse cx="64" cy="36" rx="38" ry="20" fill="none" stroke="hsl(344, 92%, 62%)" stroke-width="1.6" stroke-dasharray="9 4" opacity="0.76"/>
     <path d="M10 36 L26 28 L22 36 L26 44 Z M118 36 L102 28 L106 36 L102 44 Z" fill="hsl(346, 94%, 60%)" opacity="0.82"/>
     <path d="M50 38 C50 22 55 15 64 15 C73 15 78 22 78 38 L73 48 H69 V43 H65 V48 H63 V43 H59 V48 H55 Z" fill="url(#ca-grudge-skull)" stroke="hsl(300, 96%, 80%)" stroke-width="1.5" stroke-linejoin="round"/>
     <ellipse cx="59" cy="31" rx="3.4" ry="4" fill="hsl(282, 62%, 10%)" stroke="hsl(350, 98%, 68%)" stroke-width="1"/>
     <ellipse cx="69" cy="31" rx="3.4" ry="4" fill="hsl(282, 62%, 10%)" stroke="hsl(350, 98%, 68%)" stroke-width="1"/>
     <circle cx="59" cy="31" r="1.4" fill="hsl(48, 100%, 88%)"/><circle cx="69" cy="31" r="1.4" fill="hsl(48, 100%, 88%)"/>
     <path d="M24 38 C24 28 28 24 34 24 C40 24 44 28 44 38 L40 44 H28 Z" fill="hsla(290, 78%, 48%, 0.68)" stroke="hsl(298, 96%, 78%)" stroke-width="1.2"/>
     <circle cx="31" cy="33" r="1.7" fill="hsl(352, 98%, 70%)"/><circle cx="37" cy="33" r="1.7" fill="hsl(352, 98%, 70%)"/>
     <path d="M84 38 C84 28 88 24 94 24 C100 24 104 28 104 38 L100 44 H88 Z" fill="hsla(290, 78%, 48%, 0.68)" stroke="hsl(298, 96%, 78%)" stroke-width="1.2"/>
     <circle cx="91" cy="33" r="1.7" fill="hsl(352, 98%, 70%)"/><circle cx="97" cy="33" r="1.7" fill="hsl(352, 98%, 70%)"/>
     <path d="M18 58 Q44 46 64 56 Q84 46 110 58" fill="none" stroke="hsl(294, 96%, 74%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="24" cy="14" r="1.7" fill="hsl(348, 98%, 70%)"/><circle cx="104" cy="14" r="1.7" fill="hsl(348, 98%, 70%)"/>`,
    'hsla(296, 90%, 56%, 0.32)',
    `<radialGradient id="ca-grudge-vortex" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(300, 96%, 68%)" stop-opacity="0.74"/><stop offset="56%" stop-color="hsl(344, 88%, 48%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(312, 54%, 8%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-grudge-skull" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(296, 78%, 68%)"/><stop offset="100%" stop-color="hsl(280, 60%, 26%)"/></linearGradient>`
  ),

  horror: wrapArtSvg(
    'horror',
    'hsl(272, 50%, 14%)',
    'hsl(338, 50%, 6%)',
    `<circle cx="64" cy="34" r="32" fill="url(#ca-horror-loom)"/>
     <path d="M38 42 C36 18 46 8 64 8 C82 8 92 18 90 42 L82 54 L76 62 H52 L46 54 Z" fill="url(#ca-horror-skull)" stroke="hsl(294, 82%, 68%)" stroke-width="1.6" stroke-linejoin="round"/>
     <ellipse cx="53" cy="32" rx="7" ry="8.5" fill="hsl(270, 56%, 8%)" stroke="hsl(326, 92%, 66%)" stroke-width="1.3"/>
     <ellipse cx="75" cy="32" rx="7" ry="8.5" fill="hsl(270, 56%, 8%)" stroke="hsl(326, 92%, 66%)" stroke-width="1.3"/>
     <circle cx="53" cy="32" r="2.3" fill="hsl(328, 100%, 76%)"/><circle cx="75" cy="32" r="2.3" fill="hsl(328, 100%, 76%)"/>
     <polygon points="64,38 68,45 60,45" fill="hsl(270, 56%, 8%)"/>
     <path d="M52 51 L56 56 L60 51 L64 57 L68 51 L72 56 L76 51" fill="none" stroke="hsl(324, 96%, 74%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M8 18 Q42 34 76 16 Q102 6 120 18" fill="none" stroke="hsl(286, 86%, 72%)" stroke-width="2.4" stroke-dasharray="6 3" stroke-linecap="round"/>
     <path d="M8 54 Q40 40 72 58 Q98 66 120 50" fill="none" stroke="hsl(286, 86%, 72%)" stroke-width="2.4" stroke-dasharray="6 3" stroke-linecap="round"/>
     <path d="M12 36 L28 32 L22 40 L34 44" fill="none" stroke="hsl(322, 96%, 68%)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M116 34 L100 30 L106 38 L94 42" fill="none" stroke="hsl(322, 96%, 68%)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="24" cy="24" r="2.6" fill="none" stroke="hsl(292, 90%, 74%)" stroke-width="1.3"/>
     <circle cx="104" cy="48" r="2.6" fill="none" stroke="hsl(292, 90%, 74%)" stroke-width="1.3"/>
     <circle cx="18" cy="10" r="1.5" fill="hsl(328, 100%, 76%)"/><circle cx="110" cy="62" r="1.5" fill="hsl(328, 100%, 76%)"/>`,
    'hsla(312, 88%, 52%, 0.30)',
    `<radialGradient id="ca-horror-loom" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(320, 92%, 58%)" stop-opacity="0.62"/><stop offset="60%" stop-color="hsl(276, 78%, 40%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(270, 56%, 6%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-horror-skull" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(276, 42%, 34%)"/><stop offset="100%" stop-color="hsl(272, 46%, 12%)"/></linearGradient>`
  ),

  lone_wolf: wrapArtSvg(
    'lone_wolf',
    'hsl(224, 48%, 16%)',
    'hsl(24, 46%, 8%)',
    `<circle cx="46" cy="26" r="24" fill="url(#ca-lone_wolf-moon)"/>
     <circle cx="46" cy="26" r="17" fill="hsl(44, 96%, 82%)" stroke="hsl(52, 100%, 92%)" stroke-width="1.2"/>
     <path d="M36 20 A12 12 0 0 1 50 15" fill="none" stroke="hsla(34, 62%, 52%, 0.36)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="52" cy="28" r="2.8" fill="hsla(34, 52%, 56%, 0.28)"/><circle cx="41" cy="31" r="2" fill="hsla(34, 52%, 56%, 0.24)"/>
     <path d="M6 68 L28 54 L52 58 L76 48 L122 56 V68 Z" fill="hsl(226, 36%, 12%)" opacity="0.72"/>
     <path d="M34 68 L62 46 L94 42 L122 52 V68 Z" fill="url(#ca-lone_wolf-ridge)" stroke="hsl(36, 72%, 52%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M68 46 L74 32 L78 24 L74 16 L81 20 L86 14 L87 23 L95 27 L91 33 L98 44 L88 45 L84 40 L78 46 Z" fill="hsl(224, 34%, 13%)" stroke="hsl(44, 92%, 72%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M94 37 Q105 34 110 42 Q103 45 96 44 Z" fill="hsl(224, 34%, 13%)" stroke="hsl(42, 86%, 66%)" stroke-width="1.2"/>
     <circle cx="84" cy="23" r="1.6" fill="hsl(48, 100%, 88%)"/>
     <path d="M77 33 L86 38 M79 37 L84 34" stroke="hsl(14, 96%, 64%)" stroke-width="1.2" stroke-linecap="round"/>
     <path d="M56 14 Q64 10 70 14 M52 20 Q60 17 66 20" fill="none" stroke="hsla(48, 100%, 88%, 0.65)" stroke-width="1.2" stroke-linecap="round"/>
     <circle cx="18" cy="14" r="1.5" fill="hsl(50, 100%, 90%)"/><circle cx="104" cy="14" r="1.6" fill="hsl(50, 100%, 90%)"/>
     <circle cx="114" cy="26" r="1.3" fill="hsl(46, 100%, 84%)"/><circle cx="24" cy="40" r="1.3" fill="hsl(44, 100%, 80%)"/>`,
    'hsla(44, 96%, 66%, 0.28)',
    `<radialGradient id="ca-lone_wolf-moon" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 88%)" stop-opacity="0.88"/><stop offset="62%" stop-color="hsl(36, 92%, 58%)" stop-opacity="0.3"/><stop offset="100%" stop-color="hsl(224, 52%, 12%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-lone_wolf-ridge" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(24, 46%, 26%)"/><stop offset="100%" stop-color="hsl(224, 38%, 11%)"/></linearGradient>`
  ),

  luck_of_the_draw: wrapArtSvg(
    'luck_of_the_draw',
    'hsl(38, 64%, 19%)',
    'hsl(158, 44%, 8%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-luck_of_the_draw-glow)"/>
     <ellipse cx="64" cy="64" rx="44" ry="5" fill="hsla(0,0%,0%,0.48)"/>
     <path d="M40 16 C36 38 44 58 64 58 C84 58 92 38 88 16 L80 18 C83 34 77 50 64 50 C51 50 45 34 48 18 Z" fill="url(#ca-luck_of_the_draw-shoe)" stroke="hsl(54, 100%, 90%)" stroke-width="1.5" stroke-linejoin="round"/>
     <circle cx="46" cy="32" r="1.4" fill="hsl(26, 62%, 22%)"/><circle cx="82" cy="32" r="1.4" fill="hsl(26, 62%, 22%)"/>
     <circle cx="52" cy="46" r="1.4" fill="hsl(26, 62%, 22%)"/><circle cx="76" cy="46" r="1.4" fill="hsl(26, 62%, 22%)"/>
     <rect x="44" y="18" width="17" height="26" rx="2.5" transform="rotate(-18 52 31)" fill="hsl(156, 46%, 24%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.3"/>
     <rect x="67" y="18" width="17" height="26" rx="2.5" transform="rotate(18 76 31)" fill="hsl(156, 46%, 24%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.3"/>
     <rect x="55" y="12" width="18" height="28" rx="2.5" fill="hsl(46, 98%, 74%)" stroke="hsl(56, 100%, 94%)" stroke-width="1.5"/>
     <polygon points="64,19 67,26 64,33 61,26" fill="hsl(154, 66%, 26%)"/>
     <rect x="14" y="28" width="17" height="17" rx="3" transform="rotate(-16 22 36)" fill="hsl(44, 88%, 72%)" stroke="hsl(54, 100%, 92%)" stroke-width="1.3"/>
     <circle cx="19" cy="33" r="1.4" fill="hsl(24, 62%, 20%)"/><circle cx="25" cy="39" r="1.4" fill="hsl(24, 62%, 20%)"/>
     <circle cx="22" cy="36" r="1.4" fill="hsl(24, 62%, 20%)"/>
     <rect x="97" y="28" width="17" height="17" rx="3" transform="rotate(16 105 36)" fill="hsl(44, 88%, 72%)" stroke="hsl(54, 100%, 92%)" stroke-width="1.3"/>
     <circle cx="102" cy="33" r="1.4" fill="hsl(24, 62%, 20%)"/><circle cx="108" cy="39" r="1.4" fill="hsl(24, 62%, 20%)"/>
     <polygon points="24,14 26,18 30,20 26,22 24,26 22,22 18,20 22,18" fill="hsl(54, 100%, 94%)"/>
     <polygon points="104,14 106,18 110,20 106,22 104,26 102,22 98,20 102,18" fill="hsl(54, 100%, 94%)"/>`,
    'hsla(46, 100%, 60%, 0.30)',
    `<radialGradient id="ca-luck_of_the_draw-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(50, 100%, 84%)" stop-opacity="0.76"/><stop offset="56%" stop-color="hsl(152, 78%, 44%)" stop-opacity="0.26"/><stop offset="100%" stop-color="hsl(158, 48%, 8%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-luck_of_the_draw-shoe" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 84%)"/><stop offset="55%" stop-color="hsl(40, 92%, 56%)"/><stop offset="100%" stop-color="hsl(28, 76%, 34%)"/></linearGradient>`
  ),

  maintenance: wrapArtSvg(
    'maintenance',
    'hsl(28, 52%, 18%)',
    'hsl(216, 40%, 8%)',
    `<circle cx="66" cy="34" r="30" fill="url(#ca-maintenance-lamp)"/>
     <rect x="6" y="54" width="116" height="14" rx="2" fill="hsl(22, 42%, 18%)" stroke="hsl(36, 68%, 48%)" stroke-width="1.3"/>
     <line x1="12" y1="60" x2="116" y2="60" stroke="hsl(20, 40%, 12%)" stroke-width="1.2"/>
     <circle cx="96" cy="30" r="15" fill="hsla(214, 28%, 22%, 0.72)" stroke="hsl(44, 92%, 68%)" stroke-width="1.6" stroke-dasharray="5 3"/>
     <circle cx="96" cy="30" r="8" fill="none" stroke="hsl(46, 98%, 78%)" stroke-width="1.3"/>
     <path d="M96 20 L104 24 V32 C104 37 100 40 96 42 C92 40 88 37 88 32 V24 Z" fill="hsla(42, 92%, 56%, 0.34)" stroke="hsl(50, 100%, 84%)" stroke-width="1.1"/>
     <path d="M16 54 L20 32 H30 L34 54 Z" fill="url(#ca-maintenance-oil)" stroke="hsl(48, 96%, 76%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M23 32 L25 21 L27 32 Z" fill="hsl(42, 92%, 68%)" stroke="hsl(52, 100%, 88%)" stroke-width="0.9"/>
     <circle cx="25" cy="17" r="2" fill="hsl(46, 100%, 80%)"/>
     <path d="M40 44 L84 30 L88 38 L58 48 L52 58 L42 55 Z" fill="url(#ca-maintenance-steel)" stroke="hsl(46, 96%, 76%)" stroke-width="1.5" stroke-linejoin="round"/>
     <circle cx="60" cy="42" r="4.8" fill="hsl(216, 22%, 24%)" stroke="hsl(44, 92%, 70%)" stroke-width="1.2"/>
     <circle cx="60" cy="42" r="1.8" fill="hsl(50, 100%, 88%)"/>
     <line x1="36" y1="24" x2="94" y2="14" stroke="hsl(44, 96%, 70%)" stroke-width="2.2" stroke-linecap="round"/>
     <rect x="88" y="11" width="11" height="5" rx="2" transform="rotate(-10 93 13)" fill="hsl(32, 76%, 54%)" stroke="hsl(52, 100%, 88%)" stroke-width="0.9"/>
     <polygon points="72,22 74,26 78,28 74,30 72,34 70,30 66,28 70,26" fill="hsl(54, 100%, 96%)"/>
     <polygon points="48,28 50,31 53,32 50,33 48,36 46,33 43,32 46,31" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(42, 94%, 58%, 0.28)',
    `<radialGradient id="ca-maintenance-lamp" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 80%)" stop-opacity="0.64"/><stop offset="100%" stop-color="hsl(216, 44%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-maintenance-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(212, 26%, 74%)"/><stop offset="56%" stop-color="hsl(216, 20%, 42%)"/><stop offset="100%" stop-color="hsl(24, 48%, 22%)"/></linearGradient><linearGradient id="ca-maintenance-oil" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(46, 96%, 64%)"/><stop offset="100%" stop-color="hsl(24, 78%, 32%)"/></linearGradient>`
  ),

  malice: wrapArtSvg(
    'malice',
    'hsl(338, 58%, 16%)',
    'hsl(276, 52%, 7%)',
    `<circle cx="78" cy="38" r="30" fill="url(#ca-malice-flame)"/>
     <ellipse cx="64" cy="64" rx="42" ry="5" fill="hsla(0,0%,0%,0.54)"/>
     <rect x="64" y="16" width="28" height="40" rx="3" transform="rotate(14 78 36)" fill="hsl(278, 44%, 14%)" stroke="hsl(350, 92%, 62%)" stroke-width="1.6"/>
     <rect x="68" y="20" width="20" height="32" rx="2" transform="rotate(14 78 36)" fill="none" stroke="hsla(294, 92%, 72%, 0.56)" stroke-width="1"/>
     <path d="M60 44 Q64 18 76 26 Q84 8 92 26 Q104 22 96 44 Q92 58 76 58 Q62 56 60 44 Z" fill="hsla(348, 92%, 52%, 0.42)" stroke="hsl(354, 98%, 68%)" stroke-width="1.4"/>
     <path d="M68 48 Q74 30 82 36 Q88 24 90 46 Q84 54 74 54 Z" fill="hsla(292, 94%, 64%, 0.52)"/>
     <path d="M12 16 L66 36" stroke="hsl(352, 96%, 64%)" stroke-width="3" stroke-linecap="round"/>
     <path d="M14 24 L56 38" stroke="hsl(292, 96%, 72%)" stroke-width="1.5" stroke-linecap="round"/>
     <polygon points="24,18 60,26 88,39 54,39 46,32" fill="url(#ca-malice-blade)" stroke="hsl(52, 100%, 88%)" stroke-width="1.2" stroke-linejoin="round"/>
     <polygon points="78,30 82,36 78,42 74,36" fill="hsl(50, 100%, 90%)" stroke="hsl(352, 98%, 60%)" stroke-width="1"/>
     <path d="M84 40 L114 48 M82 32 L110 22 M76 48 L96 62" stroke="hsl(354, 98%, 68%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M36 48 L48 42 L44 52 L56 48" fill="none" stroke="hsl(294, 96%, 74%)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="24" cy="42" r="1.7" fill="hsl(294, 98%, 78%)"/><circle cx="108" cy="14" r="1.8" fill="hsl(354, 98%, 70%)"/>
     <circle cx="114" cy="36" r="1.6" fill="hsl(48, 100%, 86%)"/><circle cx="52" cy="14" r="1.5" fill="hsl(354, 98%, 70%)"/>`,
    'hsla(348, 94%, 56%, 0.32)',
    `<radialGradient id="ca-malice-flame" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(352, 100%, 66%)" stop-opacity="0.78"/><stop offset="56%" stop-color="hsl(290, 90%, 50%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(276, 56%, 8%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-malice-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(294, 82%, 62%)"/><stop offset="55%" stop-color="hsl(350, 92%, 56%)"/><stop offset="100%" stop-color="hsl(46, 100%, 82%)"/></linearGradient>`
  ),

  midnight: wrapArtSvg(
    'midnight',
    'hsl(278, 52%, 15%)',
    'hsl(236, 54%, 7%)',
    `<circle cx="34" cy="22" r="24" fill="url(#ca-midnight-moon)"/>
     <path d="M38 10 A14 14 0 1 0 38 36 A11 11 0 1 1 38 10 Z" fill="hsl(344, 92%, 66%)" stroke="hsl(352, 100%, 84%)" stroke-width="1.2"/>
     <circle cx="76" cy="40" r="28" fill="url(#ca-midnight-ward)"/>
     <circle cx="76" cy="40" r="24" fill="none" stroke="hsl(290, 92%, 74%)" stroke-width="1.6" stroke-dasharray="6 3"/>
     <circle cx="76" cy="40" r="18" fill="none" stroke="hsl(46, 98%, 74%)" stroke-width="1.1"/>
     <polygon points="58,28 76,8 94,28" fill="hsl(252, 42%, 14%)" stroke="hsl(290, 82%, 68%)" stroke-width="1.4" stroke-linejoin="round"/>
     <rect x="61" y="28" width="30" height="40" fill="hsl(246, 38%, 12%)" stroke="hsl(290, 82%, 68%)" stroke-width="1.5"/>
     <circle cx="76" cy="42" r="10.5" fill="hsl(48, 96%, 84%)" stroke="hsl(40, 88%, 58%)" stroke-width="1.6"/>
     <line x1="76" y1="42" x2="76" y2="33.5" stroke="hsl(268, 62%, 16%)" stroke-width="2" stroke-linecap="round"/>
     <line x1="76" y1="42" x2="76" y2="36" stroke="hsl(348, 92%, 52%)" stroke-width="1.2" stroke-linecap="round"/>
     <circle cx="76" cy="42" r="1.6" fill="hsl(348, 96%, 54%)"/>
     <circle cx="76" cy="33" r="0.9" fill="hsl(268, 52%, 22%)"/><circle cx="85" cy="42" r="0.9" fill="hsl(268, 52%, 22%)"/>
     <circle cx="76" cy="51" r="0.9" fill="hsl(268, 52%, 22%)"/><circle cx="67" cy="42" r="0.9" fill="hsl(268, 52%, 22%)"/>
     <path d="M44 28 Q48 36 44 44 M108 28 Q104 36 108 44" fill="none" stroke="hsl(46, 100%, 80%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="16" cy="48" r="1.6" fill="hsl(292, 98%, 78%)"/><circle cx="114" cy="16" r="1.7" fill="hsl(48, 100%, 88%)"/>
     <circle cx="52" cy="14" r="1.4" fill="hsl(348, 98%, 76%)"/>`,
    'hsla(294, 88%, 56%, 0.28)',
    `<radialGradient id="ca-midnight-moon" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(346, 94%, 64%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(276, 56%, 10%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-midnight-ward" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(292, 92%, 64%)" stop-opacity="0.54"/><stop offset="65%" stop-color="hsl(46, 94%, 56%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(236, 54%, 8%)" stop-opacity="0"/></radialGradient>`
  ),

  no_holds_barred: wrapArtSvg(
    'no_holds_barred',
    'hsl(14, 68%, 20%)',
    'hsl(312, 46%, 8%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-no_holds_barred-blast)"/>
     <polygon points="34,36 122,8 118,36 122,64" fill="hsla(36, 100%, 64%, 0.28)"/>
     <polygon points="36,36 116,18 106,36 116,54" fill="hsla(46, 100%, 78%, 0.42)"/>
     <path d="M8 46 L40 28 L44 34 L12 52 Z" fill="url(#ca-no_holds_barred-barrel)" stroke="hsl(44, 94%, 72%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M12 54 L44 36 L48 42 L16 60 Z" fill="url(#ca-no_holds_barred-barrel)" stroke="hsl(44, 94%, 72%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M44 33 L118 14 M46 37 L122 36 M48 41 L118 58" stroke="hsl(50, 100%, 88%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M48 35 L112 24 M48 39 L112 48" stroke="hsl(318, 96%, 68%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M62 22 L76 36 L62 50 M84 16 L100 36 L84 56" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M16 20 Q28 10 42 18 Q54 14 56 24" fill="hsla(308, 30%, 56%, 0.32)" stroke="hsl(316, 78%, 72%)" stroke-width="1.3"/>
     <path d="M22 62 Q38 52 54 60 Q64 56 70 64" fill="hsla(308, 30%, 56%, 0.3)" stroke="hsl(316, 78%, 72%)" stroke-width="1.3"/>
     <polygon points="44,36 56,28 52,36 58,44 44,41" fill="hsl(56, 100%, 96%)"/>
     <polygon points="104,24 108,28 114,27 109,32 112,37 106,34 102,38 103,32 98,29 104,28" fill="hsl(318, 90%, 60%)" stroke="hsl(52, 100%, 90%)" stroke-width="0.9"/>
     <circle cx="94" cy="18" r="2.2" fill="hsl(54, 100%, 94%)"/><circle cx="110" cy="48" r="2.2" fill="hsl(54, 100%, 94%)"/>
     <circle cx="78" cy="54" r="1.8" fill="hsl(318, 96%, 74%)"/><circle cx="72" cy="16" r="1.8" fill="hsl(44, 100%, 80%)"/>`,
    'hsla(24, 100%, 60%, 0.34)',
    `<radialGradient id="ca-no_holds_barred-blast" cx="38%" cy="50%" r="58%"><stop offset="0%" stop-color="hsl(54, 100%, 92%)" stop-opacity="0.88"/><stop offset="48%" stop-color="hsl(18, 98%, 54%)" stop-opacity="0.44"/><stop offset="100%" stop-color="hsl(312, 52%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-no_holds_barred-barrel" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(218, 22%, 24%)"/><stop offset="70%" stop-color="hsl(214, 20%, 48%)"/><stop offset="100%" stop-color="hsl(34, 96%, 64%)"/></linearGradient>`
  ),

  ricochet: wrapArtSvg(
    'ricochet',
    'hsl(24, 62%, 19%)',
    'hsl(214, 42%, 8%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-ricochet-spark)"/>
     <polygon points="8,8 50,8 36,24 8,20" fill="url(#ca-ricochet-plate)" stroke="hsl(40, 82%, 64%)" stroke-width="1.4" stroke-linejoin="round"/>
     <polygon points="44,64 84,64 78,52 52,52" fill="url(#ca-ricochet-plate)" stroke="hsl(40, 82%, 64%)" stroke-width="1.4" stroke-linejoin="round"/>
     <polygon points="82,8 120,8 120,24 94,26" fill="url(#ca-ricochet-plate)" stroke="hsl(40, 82%, 64%)" stroke-width="1.4" stroke-linejoin="round"/>
     <circle cx="18" cy="14" r="1.5" fill="hsl(44, 96%, 74%)"/><circle cx="110" cy="14" r="1.5" fill="hsl(44, 96%, 74%)"/>
     <polyline points="10,48 34,24 64,52 94,26 118,52" fill="none" stroke="hsl(32, 100%, 58%)" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.42"/>
     <polyline points="10,48 34,24 64,52 94,26 118,52" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
     <polyline points="10,48 34,24 64,52 94,26 118,52" fill="none" stroke="hsl(56, 100%, 96%)" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>
     <polygon points="34,17 37,22 42,24 37,26 34,31 31,26 26,24 31,22" fill="hsl(52, 100%, 92%)" stroke="hsl(18, 100%, 60%)" stroke-width="0.9"/>
     <polygon points="64,45 67,50 72,52 67,54 64,59 61,54 56,52 61,50" fill="hsl(52, 100%, 92%)" stroke="hsl(18, 100%, 60%)" stroke-width="0.9"/>
     <polygon points="94,19 97,24 102,26 97,28 94,33 91,28 86,26 91,24" fill="hsl(52, 100%, 92%)" stroke="hsl(18, 100%, 60%)" stroke-width="0.9"/>
     <polygon points="106,38 119,53 111,52 103,44" fill="hsl(48, 100%, 80%)" stroke="hsl(56, 100%, 96%)" stroke-width="1"/>
     <path d="M26 32 L18 30 M74 44 L82 44 M86 16 L80 12" stroke="hsl(46, 100%, 82%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="48" cy="24" r="1.6" fill="hsl(48, 100%, 88%)"/><circle cx="78" cy="36" r="1.6" fill="hsl(32, 100%, 72%)"/>
     <circle cx="104" cy="58" r="1.6" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(36, 100%, 58%, 0.30)',
    `<radialGradient id="ca-ricochet-spark" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 82%)" stop-opacity="0.62"/><stop offset="100%" stop-color="hsl(214, 48%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-ricochet-plate" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 24%, 46%)"/><stop offset="100%" stop-color="hsl(22, 40%, 18%)"/></linearGradient>`
  ),

  scavenge: wrapArtSvg(
    'scavenge',
    'hsl(28, 56%, 18%)',
    'hsl(210, 42%, 8%)',
    `<circle cx="64" cy="34" r="30" fill="url(#ca-scavenge-glow)"/>
     <ellipse cx="64" cy="64" rx="44" ry="5" fill="hsla(0,0%,0%,0.52)"/>
     <polygon points="78,24 106,18 112,38 86,44" fill="hsl(214, 24%, 44%)" stroke="hsl(40, 82%, 64%)" stroke-width="1.4" stroke-linejoin="round"/>
     <line x1="86" y1="28" x2="104" y2="24" stroke="hsl(214, 24%, 20%)" stroke-width="1.3"/>
     <circle cx="102" cy="32" r="1.5" fill="hsl(46, 98%, 78%)"/>
     <path d="M24 30 H100 L106 60 Q64 68 18 60 Z" fill="url(#ca-scavenge-bag)" stroke="hsl(38, 80%, 60%)" stroke-width="1.6" stroke-linejoin="round"/>
     <path d="M26 30 Q64 38 98 30" fill="none" stroke="hsl(42, 86%, 66%)" stroke-width="1.4"/>
     <rect x="40" y="34" width="8" height="24" rx="1.5" fill="hsl(20, 46%, 18%)" stroke="hsl(42, 88%, 64%)" stroke-width="1.1"/>
     <rect x="78" y="34" width="8" height="24" rx="1.5" fill="hsl(20, 46%, 18%)" stroke="hsl(42, 88%, 64%)" stroke-width="1.1"/>
     <circle cx="38" cy="28" r="6" fill="url(#ca-scavenge-gold)" stroke="hsl(54, 100%, 92%)" stroke-width="1.2"/>
     <circle cx="49" cy="24" r="5.5" fill="url(#ca-scavenge-gold)" stroke="hsl(54, 100%, 92%)" stroke-width="1.2"/>
     <circle cx="76" cy="27" r="5.8" fill="url(#ca-scavenge-gold)" stroke="hsl(54, 100%, 92%)" stroke-width="1.2"/>
     <circle cx="24" cy="56" r="4.5" fill="url(#ca-scavenge-gold)" stroke="hsl(54, 100%, 90%)" stroke-width="1.1"/>
     <polygon points="64,9 68,18 78,18 71,24 75,34 64,28 53,34 57,24 50,18 60,18" fill="url(#ca-scavenge-gold)" stroke="hsl(56, 100%, 94%)" stroke-width="1.3" stroke-linejoin="round"/>
     <circle cx="64" cy="22" r="3" fill="hsl(56, 100%, 96%)"/>
     <polygon points="24,14 26,18 30,20 26,22 24,26 22,22 18,20 22,18" fill="hsl(54, 100%, 94%)"/>
     <circle cx="110" cy="14" r="1.6" fill="hsl(50, 100%, 88%)"/><circle cx="106" cy="54" r="1.6" fill="hsl(46, 100%, 82%)"/>`,
    'hsla(44, 100%, 60%, 0.30)',
    `<radialGradient id="ca-scavenge-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 82%)" stop-opacity="0.74"/><stop offset="100%" stop-color="hsl(210, 44%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-scavenge-bag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(26, 52%, 34%)"/><stop offset="100%" stop-color="hsl(18, 48%, 15%)"/></linearGradient><linearGradient id="ca-scavenge-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(56, 100%, 90%)"/><stop offset="56%" stop-color="hsl(44, 98%, 62%)"/><stop offset="100%" stop-color="hsl(30, 82%, 38%)"/></linearGradient>`
  ),
};
