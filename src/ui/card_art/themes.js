// Bespoke 16:9 SVG card illustrations for Colorless, Status, Curse, and Theme fallback cards.
import { wrapArtSvg } from './wrap.js';

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
  defect_strike: wrapArtSvg(
    'defect_strike',
    'hsl(206, 62%, 18%)',
    'hsl(226, 58%, 7%)',
    `<path d="M8 18 H32 L40 26 M120 54 H96 L88 46" fill="none" stroke="hsla(202, 82%, 62%, 0.34)" stroke-width="1.2"/>
     <path d="M10 60 Q48 44 114 14 L104 34 Q54 54 16 66 Z" fill="url(#ca-defect_strike-arc)" opacity="0.72"/>
     <path d="M18 56 L96 14 L112 10 L101 25 L26 62 Z" fill="url(#ca-defect_strike-beam)" stroke="hsl(192, 100%, 82%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M22 57 L105 14" stroke="hsl(52, 100%, 96%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M36 22 L46 28 L42 36 M82 48 L94 42 L90 54" fill="none" stroke="hsl(48, 100%, 72%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     <polygon points="14,50 28,46 24,58" fill="hsl(204, 92%, 64%)" opacity="0.82"/>
     <line x1="28" y1="62" x2="72" y2="44" stroke="hsla(192, 100%, 84%, 0.55)" stroke-width="1.3"/>
     <circle cx="102" cy="18" r="10" fill="url(#ca-defect_strike-flash)"/>
     <polygon points="102,6 105,15 114,18 105,21 102,30 99,21 90,18 99,15" fill="hsl(52, 100%, 94%)" opacity="0.9"/>
     <circle cx="52" cy="18" r="1.8" fill="hsl(192, 100%, 84%)"/><circle cx="88" cy="54" r="2" fill="hsl(48, 100%, 78%)"/>
     <circle cx="24" cy="24" r="1.6" fill="hsl(196, 100%, 78%)"/><circle cx="110" cy="44" r="1.6" fill="hsl(196, 100%, 78%)"/>`,
    'hsla(194, 98%, 58%, 0.32)',
    `<linearGradient id="ca-defect_strike-arc" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(214, 90%, 44%)" stop-opacity="0.18"/><stop offset="70%" stop-color="hsl(192, 100%, 62%)" stop-opacity="0.88"/><stop offset="100%" stop-color="hsl(50, 100%, 88%)" stop-opacity="0.96"/></linearGradient><linearGradient id="ca-defect_strike-beam" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(204, 94%, 58%)"/><stop offset="56%" stop-color="hsl(188, 100%, 76%)"/><stop offset="100%" stop-color="hsl(52, 100%, 96%)"/></linearGradient><radialGradient id="ca-defect_strike-flash" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 98%)"/><stop offset="52%" stop-color="hsl(192, 100%, 70%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(212, 92%, 44%)" stop-opacity="0"/></radialGradient>`
  ),
  defect_defend: wrapArtSvg(
    'defect_defend',
    'hsl(204, 58%, 18%)',
    'hsl(224, 56%, 7%)',
    `<ellipse cx="64" cy="36" rx="50" ry="26" fill="url(#ca-defect_defend-glow)"/>
     <path d="M12 24 H28 M12 48 H28 M100 24 H116 M100 48 H116" stroke="hsla(196, 92%, 68%, 0.42)" stroke-width="1.3" stroke-linecap="round"/>
     <polygon points="64,8 96,22 96,50 64,64 32,50 32,22" fill="hsla(202, 86%, 48%, 0.24)" stroke="url(#ca-defect_defend-rim)" stroke-width="2.2" stroke-linejoin="round"/>
     <polygon points="64,15 88,26 88,46 64,57 40,46 40,26" fill="hsla(194, 96%, 62%, 0.18)" stroke="hsl(190, 100%, 82%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M64 15 V57 M40 26 L88 46 M88 26 L40 46" stroke="hsla(192, 100%, 88%, 0.34)" stroke-width="1"/>
     <circle cx="64" cy="36" r="14" fill="none" stroke="hsla(192, 100%, 80%, 0.55)" stroke-width="1.2" stroke-dasharray="4 3"/>
     <circle cx="64" cy="36" r="8" fill="url(#ca-defect_defend-core)" stroke="hsl(48, 100%, 84%)" stroke-width="1.4"/>
     <circle cx="64" cy="36" r="3" fill="hsl(54, 100%, 96%)"/>
     <circle cx="32" cy="22" r="2.2" fill="hsl(192, 100%, 84%)"/><circle cx="96" cy="22" r="2.2" fill="hsl(192, 100%, 84%)"/>
     <circle cx="32" cy="50" r="2.2" fill="hsl(48, 100%, 78%)"/><circle cx="96" cy="50" r="2.2" fill="hsl(48, 100%, 78%)"/>`,
    'hsla(196, 94%, 60%, 0.28)',
    `<radialGradient id="ca-defect_defend-glow" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="hsla(194, 100%, 70%, 0.36)"/><stop offset="100%" stop-color="hsla(220, 72%, 14%, 0)"/></radialGradient><linearGradient id="ca-defect_defend-rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(188, 100%, 82%)"/><stop offset="55%" stop-color="hsl(204, 92%, 58%)"/><stop offset="100%" stop-color="hsl(46, 98%, 70%)"/></linearGradient><radialGradient id="ca-defect_defend-core" cx="44%" cy="40%" r="60%"><stop offset="0%" stop-color="hsl(52, 100%, 96%)"/><stop offset="55%" stop-color="hsl(192, 100%, 66%)"/><stop offset="100%" stop-color="hsl(216, 86%, 36%)"/></radialGradient>`
  ),
  defect_orb: wrapArtSvg(
    'defect_orb',
    'hsl(208, 60%, 18%)',
    'hsl(228, 56%, 7%)',
    `<ellipse cx="64" cy="36" rx="52" ry="26" fill="url(#ca-defect_orb-halo)"/>
     <ellipse cx="64" cy="36" rx="46" ry="18" fill="none" stroke="hsl(194, 96%, 68%)" stroke-width="1.5" opacity="0.68" transform="rotate(-14 64 36)"/>
     <ellipse cx="64" cy="36" rx="46" ry="18" fill="none" stroke="hsl(48, 96%, 72%)" stroke-width="1.2" opacity="0.52" stroke-dasharray="6 4" transform="rotate(14 64 36)"/>
     <circle cx="64" cy="36" r="18" fill="url(#ca-defect_orb-core)" stroke="hsl(48, 100%, 84%)" stroke-width="1.8"/>
     <circle cx="64" cy="36" r="12" fill="none" stroke="hsla(192, 100%, 88%, 0.52)" stroke-width="1.1"/>
     <circle cx="64" cy="36" r="7" fill="hsl(54, 100%, 96%)" opacity="0.78"/>
     <path d="M58 26 L67 34 L62 37 L70 46" fill="none" stroke="hsl(48, 100%, 86%)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="24" cy="30" r="3.6" fill="hsl(48, 100%, 74%)" stroke="hsl(54, 100%, 94%)" stroke-width="1"/>
     <circle cx="104" cy="42" r="3.6" fill="hsl(192, 100%, 74%)" stroke="hsl(190, 100%, 94%)" stroke-width="1"/>
     <circle cx="102" cy="22" r="3" fill="hsl(282, 86%, 68%)" stroke="hsl(286, 100%, 88%)" stroke-width="0.9"/>
     <circle cx="26" cy="50" r="3" fill="hsl(36, 100%, 68%)" stroke="hsl(48, 100%, 90%)" stroke-width="0.9"/>`,
    'hsla(194, 98%, 62%, 0.30)',
    `<radialGradient id="ca-defect_orb-core" cx="40%" cy="35%" r="62%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="50%" stop-color="hsl(194, 98%, 62%)"/><stop offset="100%" stop-color="hsl(224, 82%, 28%)"/></radialGradient><radialGradient id="ca-defect_orb-halo" cx="50%" cy="50%" r="54%"><stop offset="0%" stop-color="hsla(196, 100%, 68%, 0.34)"/><stop offset="100%" stop-color="hsla(224, 72%, 14%, 0)"/></radialGradient>`
  ),
  defect_power: wrapArtSvg(
    'defect_power',
    'hsl(212, 62%, 18%)',
    'hsl(240, 56%, 7%)',
    `<ellipse cx="64" cy="36" rx="52" ry="26" fill="url(#ca-defect_power-glow)"/>
     <path d="M12 36 H36 M92 36 H116 M64 4 V14 M64 58 V68" stroke="hsla(194, 92%, 72%, 0.48)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="64" cy="36" r="24" fill="none" stroke="hsl(46, 98%, 70%)" stroke-width="1.6" stroke-dasharray="5 3"/>
     <circle cx="64" cy="36" r="18" fill="none" stroke="hsla(194, 96%, 72%, 0.56)" stroke-width="1.1"/>
     <polygon points="64,12 84,36 64,60 44,36" fill="url(#ca-defect_power-core)" stroke="hsl(190, 100%, 84%)" stroke-width="1.6"/>
     <polygon points="64,19 76,36 64,53 52,36" fill="hsla(48, 100%, 82%, 0.24)" stroke="hsl(48, 100%, 82%)" stroke-width="1.1"/>
     <circle cx="64" cy="36" r="6.5" fill="hsl(48, 100%, 78%)" stroke="hsl(54, 100%, 96%)" stroke-width="1.2"/>
     <circle cx="64" cy="36" r="2.6" fill="hsl(54, 100%, 98%)"/>
     <circle cx="26" cy="20" r="2.2" fill="hsl(192, 100%, 82%)"/><circle cx="102" cy="20" r="2.2" fill="hsl(192, 100%, 82%)"/>
     <circle cx="26" cy="52" r="2.2" fill="hsl(48, 100%, 78%)"/><circle cx="102" cy="52" r="2.2" fill="hsl(48, 100%, 78%)"/>`,
    'hsla(46, 98%, 64%, 0.28)',
    `<radialGradient id="ca-defect_power-glow" cx="50%" cy="50%" r="54%"><stop offset="0%" stop-color="hsla(48, 100%, 72%, 0.3)"/><stop offset="100%" stop-color="hsla(224, 70%, 14%, 0)"/></radialGradient><linearGradient id="ca-defect_power-core" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(192, 100%, 72%, 0.62)"/><stop offset="100%" stop-color="hsla(222, 82%, 34%, 0.56)"/></linearGradient>`
  ),
});
