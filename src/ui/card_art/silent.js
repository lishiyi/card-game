// Bespoke 16:9 SVG card illustrations for Silent cards.
import { wrapArtSvg } from './wrap.js';

export const SILENT_CARD_ART = {
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
};
