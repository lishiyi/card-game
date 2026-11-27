// Bespoke 16:9 SVG card illustrations for expansion Ironclad (8) and Silent (9) cards.
import { wrapArtSvg } from './wrap.js';

export const EXP_IRON_SILENT_ART = {
  // === Ironclad (8) ===
  rampage: wrapArtSvg(
    'rampage',
    'hsl(354, 72%, 19%)',
    'hsl(342, 62%, 7%)',
    `<ellipse cx="66" cy="54" rx="54" ry="26" fill="url(#ca-rampage-aura)"/>
     <path d="M10 56 Q66 6 122 56" fill="none" stroke="url(#ca-rampage-wave)" stroke-width="3.2" stroke-linecap="round" opacity="0.62"/>
     <path d="M22 58 Q66 18 110 58" fill="none" stroke="url(#ca-rampage-wave)" stroke-width="4" stroke-linecap="round" opacity="0.82"/>
     <path d="M36 60 Q66 32 96 60" fill="none" stroke="hsl(50, 100%, 86%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M12 66 L44 58 L66 64 L92 56 L118 66 L100 71 L66 67 L32 71 Z" fill="hsl(346, 56%, 10%)" stroke="hsl(14, 100%, 56%)" stroke-width="1.2"/>
     <path d="M26 12 L74 58" stroke="rgba(0,0,0,0.46)" stroke-width="6" stroke-linecap="round" transform="translate(2,2)"/>
     <path d="M26 12 L74 58" stroke="hsl(18, 46%, 22%)" stroke-width="5.2" stroke-linecap="round"/>
     <path d="M52 24 C74 14, 96 22, 102 44 C86 52, 72 56, 62 54 C64 42, 58 34, 52 24 Z" fill="rgba(0,0,0,0.48)" transform="translate(2,3)"/>
     <path d="M52 24 C74 14, 96 22, 102 44 C86 52, 72 56, 62 54 C64 42, 58 34, 52 24 Z" fill="url(#ca-rampage-axe)" stroke="hsl(354, 90%, 48%)" stroke-width="1.5"/>
     <path d="M58 22 C76 16, 94 24, 100 44" fill="none" stroke="hsl(48, 100%, 88%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M46 34 C38 42, 42 52, 54 54 L58 46 Z" fill="url(#ca-rampage-axe)" stroke="hsl(354, 84%, 44%)" stroke-width="1.2"/>
     <rect x="44" y="25" width="12" height="5" rx="1.4" transform="rotate(44 50 27)" fill="hsl(42, 92%, 66%)" stroke="hsl(16, 62%, 22%)" stroke-width="1"/>
     <circle cx="25" cy="11" r="3.6" fill="hsl(44, 94%, 68%)" stroke="hsl(16, 64%, 22%)" stroke-width="1.1"/>
     <polygon points="68,46 72,54 82,56 72,58 68,66 64,58 54,56 64,54" fill="hsl(52, 100%, 92%)"/>
     <polygon points="18,44 26,38 24,48" fill="hsl(14, 94%, 58%)"/>
     <polygon points="108,36 116,42 106,46" fill="hsl(34, 100%, 66%)"/>
     <path d="M14 28 L20 22 L26 28 M102 22 L108 16 L114 22" fill="none" stroke="hsl(46, 100%, 78%)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="94" cy="16" r="2.2" fill="hsl(48, 100%, 86%)"/>
     <circle cx="34" cy="48" r="2" fill="hsl(18, 100%, 66%)"/>`,
    'hsla(8, 98%, 54%, 0.34)',
    `<radialGradient id="ca-rampage-aura" cx="52%" cy="74%" r="52%"><stop offset="0%" stop-color="hsl(48, 100%, 86%)" stop-opacity="0.82"/><stop offset="46%" stop-color="hsl(8, 98%, 52%)" stop-opacity="0.48"/><stop offset="100%" stop-color="hsl(344, 72%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-rampage-axe" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 24%, 76%)"/><stop offset="52%" stop-color="hsl(356, 46%, 36%)"/><stop offset="100%" stop-color="hsl(346, 60%, 16%)"/></linearGradient><linearGradient id="ca-rampage-wave" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(354, 94%, 48%)"/><stop offset="55%" stop-color="hsl(22, 100%, 58%)"/><stop offset="100%" stop-color="hsl(52, 100%, 88%)"/></linearGradient>`
  ),
  searing_blow: wrapArtSvg(
    'searing_blow',
    'hsl(18, 76%, 21%)',
    'hsl(356, 60%, 8%)',
    `<ellipse cx="70" cy="34" rx="54" ry="30" fill="url(#ca-searing_blow-heat)"/>
     <ellipse cx="96" cy="20" rx="22" ry="12" transform="rotate(-26 96 20)" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.3" stroke-dasharray="6 4" opacity="0.72"/>
     <path d="M36 44 Q42 18 58 26 Q66 6 82 18 Q94 4 108 14 Q98 30 88 34 Q74 44 48 54 Z" fill="url(#ca-searing_blow-flame)" opacity="0.78"/>
     <path d="M38 48 L96 10 L114 9 L106 25 L48 58 Z" fill="rgba(0,0,0,0.48)" transform="translate(2,3)"/>
     <polygon points="38,48 96,10 114,9 106,25 48,58" fill="url(#ca-searing_blow-blade)" stroke="hsl(14, 96%, 48%)" stroke-width="1.6"/>
     <line x1="45" y1="51" x2="108" y2="12" stroke="hsl(0, 0%, 100%)" stroke-width="2.4" stroke-linecap="round"/>
     <polygon points="58,41 64,37 66,41 60,45" fill="hsl(56, 100%, 96%)"/>
     <polygon points="74,31 80,27 82,31 76,35" fill="hsl(56, 100%, 96%)"/>
     <polygon points="90,21 96,17 98,21 92,25" fill="hsl(0, 0%, 100%)"/>
     <path d="M28 38 L52 64 L46 67 L24 42 Z" fill="hsl(220, 22%, 20%)" stroke="hsl(34, 98%, 62%)" stroke-width="1.3"/>
     <path d="M35 53 L18 63" stroke="hsl(16, 48%, 20%)" stroke-width="5.6" stroke-linecap="round"/>
     <circle cx="16" cy="64" r="4" fill="hsl(36, 94%, 64%)" stroke="hsl(14, 68%, 22%)" stroke-width="1.2"/>
     <path d="M62 12 L72 6 M92 42 L106 38 M26 24 L40 20 M78 52 L92 58" stroke="hsl(50, 100%, 86%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="114" cy="9" r="3.2" fill="hsl(0, 0%, 100%)"/>
     <circle cx="48" cy="14" r="2.2" fill="hsl(50, 100%, 86%)"/>
     <circle cx="108" cy="36" r="2.4" fill="hsl(38, 100%, 74%)"/>
     <circle cx="84" cy="56" r="2" fill="hsl(24, 100%, 64%)"/>
     <circle cx="24" cy="30" r="1.8" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(36, 100%, 60%, 0.36)',
    `<radialGradient id="ca-searing_blow-heat" cx="58%" cy="44%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 96%)" stop-opacity="0.88"/><stop offset="46%" stop-color="hsl(28, 100%, 56%)" stop-opacity="0.46"/><stop offset="100%" stop-color="hsl(354, 72%, 12%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-searing_blow-blade" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(8, 96%, 46%)"/><stop offset="48%" stop-color="hsl(36, 100%, 64%)"/><stop offset="82%" stop-color="hsl(54, 100%, 92%)"/><stop offset="100%" stop-color="hsl(0, 0%, 100%)"/></linearGradient><linearGradient id="ca-searing_blow-flame" x1="0" y1="1" x2="0.4" y2="0"><stop offset="0%" stop-color="hsl(356, 94%, 44%)"/><stop offset="55%" stop-color="hsl(24, 100%, 58%)"/><stop offset="100%" stop-color="hsl(52, 100%, 88%)"/></linearGradient>`
  ),
  sever_soul: wrapArtSvg(
    'sever_soul',
    'hsl(272, 48%, 17%)',
    'hsl(348, 54%, 8%)',
    `<ellipse cx="64" cy="36" rx="54" ry="30" fill="url(#ca-sever_soul-nebula)"/>
     <path d="M24 38 C20 20, 36 10, 56 14 C62 15, 66 20, 62 26 L38 44 C30 46, 26 44, 24 38 Z" fill="url(#ca-sever_soul-soul)" stroke="hsl(192, 92%, 82%)" stroke-width="1.2" opacity="0.9"/>
     <circle cx="42" cy="24" r="3" fill="hsl(274, 62%, 14%)"/>
     <circle cx="42" cy="24" r="1.4" fill="hsl(186, 100%, 90%)"/>
     <path d="M46 50 L74 30 C84 30, 92 38, 86 52 C80 62, 62 66, 48 60 Z" fill="url(#ca-sever_soul-soul)" stroke="hsl(292, 92%, 78%)" stroke-width="1.2" opacity="0.88"/>
     <circle cx="72" cy="46" r="2.8" fill="hsl(274, 62%, 14%)"/>
     <circle cx="72" cy="46" r="1.3" fill="hsl(312, 100%, 88%)"/>
     <path d="M18 22 Q26 8 42 8 M90 56 Q104 56 108 42" fill="none" stroke="hsl(190, 92%, 78%)" stroke-width="2" stroke-linecap="round" opacity="0.65"/>
     <path d="M8 62 Q58 34 120 8 Q72 44 18 68 Z" fill="url(#ca-sever_soul-arc)"/>
     <path d="M12 63 Q60 36 118 10" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="84,18 118,8 104,24 88,24" fill="url(#ca-sever_soul-blade)" stroke="hsl(352, 86%, 46%)" stroke-width="1.2"/>
     <polygon points="56,34 62,28 66,34 60,40" fill="hsl(52, 100%, 94%)"/>
     <polygon points="34,54 40,49 42,56" fill="hsl(312, 98%, 74%)"/>
     <polygon points="86,28 93,26 90,34" fill="hsl(190, 100%, 84%)"/>
     <path d="M44 38 L52 34 M68 36 L76 32" stroke="hsl(324, 100%, 80%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="26" cy="52" r="2.2" fill="hsl(190, 100%, 86%)"/>
     <circle cx="102" cy="36" r="2.2" fill="hsl(316, 100%, 78%)"/>
     <circle cx="64" cy="14" r="1.8" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(296, 92%, 62%, 0.30)',
    `<radialGradient id="ca-sever_soul-nebula" cx="50%" cy="50%" r="48%"><stop offset="0%" stop-color="hsl(308, 96%, 68%)" stop-opacity="0.52"/><stop offset="56%" stop-color="hsl(276, 78%, 38%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(348, 64%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-sever_soul-soul" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(188, 96%, 86%)"/><stop offset="55%" stop-color="hsl(278, 78%, 68%)"/><stop offset="100%" stop-color="hsl(314, 82%, 44%)"/></linearGradient><linearGradient id="ca-sever_soul-arc" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsla(352, 96%, 48%, 0.16)"/><stop offset="50%" stop-color="hsl(344, 98%, 58%)"/><stop offset="86%" stop-color="hsl(44, 100%, 82%)"/><stop offset="100%" stop-color="hsl(0, 0%, 100%)"/></linearGradient><linearGradient id="ca-sever_soul-blade" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(240, 24%, 30%)"/><stop offset="65%" stop-color="hsl(316, 62%, 78%)"/><stop offset="100%" stop-color="hsl(0, 0%, 100%)"/></linearGradient>`
  ),
  dual_wield: wrapArtSvg(
    'dual_wield',
    'hsl(8, 66%, 19%)',
    'hsl(350, 56%, 8%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-dual_wield-glow)"/>
     <path d="M10 48 Q26 10 64 14 Q98 18 118 48" fill="none" stroke="url(#ca-dual_wield-trail)" stroke-width="4" stroke-linecap="round" opacity="0.72"/>
     <path d="M12 24 Q34 58 64 58 Q94 58 116 24" fill="none" stroke="url(#ca-dual_wield-trail)" stroke-width="3.2" stroke-linecap="round" opacity="0.56"/>
     <path d="M30 56 L92 12 L106 10 L98 22 L38 62 Z" fill="rgba(0,0,0,0.44)" transform="translate(2,2)"/>
     <path d="M30 56 L92 12 L106 10 L98 22 L38 62 Z" fill="url(#ca-dual_wield-bladeL)" stroke="hsl(354, 86%, 40%)" stroke-width="1.3"/>
     <line x1="36" y1="57" x2="100" y2="14" stroke="hsl(52, 100%, 94%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M98 56 L36 12 L22 10 L30 22 L90 62 Z" fill="rgba(0,0,0,0.44)" transform="translate(-2,2)"/>
     <path d="M98 56 L36 12 L22 10 L30 22 L90 62 Z" fill="url(#ca-dual_wield-bladeR)" stroke="hsl(20, 86%, 40%)" stroke-width="1.3"/>
     <line x1="92" y1="57" x2="28" y2="14" stroke="hsl(0, 0%, 100%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M24 46 L42 64" stroke="hsl(44, 94%, 68%)" stroke-width="4.4" stroke-linecap="round"/>
     <path d="M104 46 L86 64" stroke="hsl(44, 94%, 68%)" stroke-width="4.4" stroke-linecap="round"/>
     <line x1="32" y1="57" x2="21" y2="65" stroke="hsl(14, 54%, 22%)" stroke-width="4.2" stroke-linecap="round"/>
     <line x1="96" y1="57" x2="107" y2="65" stroke="hsl(14, 54%, 22%)" stroke-width="4.2" stroke-linecap="round"/>
     <circle cx="20" cy="65" r="3" fill="hsl(46, 98%, 74%)"/>
     <circle cx="108" cy="65" r="3" fill="hsl(46, 98%, 74%)"/>
     <polygon points="64,22 68,32 78,36 68,40 64,50 60,40 50,36 60,32" fill="hsl(52, 100%, 92%)"/>
     <circle cx="64" cy="36" r="4" fill="hsl(0, 0%, 100%)"/>
     <circle cx="16" cy="28" r="2" fill="hsl(48, 100%, 84%)"/>
     <circle cx="112" cy="28" r="2" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(38, 100%, 60%, 0.32)',
    `<radialGradient id="ca-dual_wield-glow" cx="50%" cy="50%" r="48%"><stop offset="0%" stop-color="hsl(54, 100%, 94%)" stop-opacity="0.86"/><stop offset="50%" stop-color="hsl(20, 98%, 54%)" stop-opacity="0.4"/><stop offset="100%" stop-color="hsl(350, 70%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-dual_wield-bladeL" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(352, 54%, 30%)"/><stop offset="56%" stop-color="hsl(28, 86%, 68%)"/><stop offset="100%" stop-color="hsl(54, 100%, 94%)"/></linearGradient><linearGradient id="ca-dual_wield-bladeR" x1="1" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(216, 26%, 34%)"/><stop offset="56%" stop-color="hsl(40, 88%, 74%)"/><stop offset="100%" stop-color="hsl(0, 0%, 100%)"/></linearGradient><linearGradient id="ca-dual_wield-trail" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(354, 96%, 52%)"/><stop offset="50%" stop-color="hsl(48, 100%, 82%)"/><stop offset="100%" stop-color="hsl(354, 96%, 52%)"/></linearGradient>`
  ),
  infernal_blade: wrapArtSvg(
    'infernal_blade',
    'hsl(4, 78%, 18%)',
    'hsl(344, 68%, 6%)',
    `<ellipse cx="64" cy="58" rx="54" ry="24" fill="url(#ca-infernal_blade-magma)"/>
     <path d="M0 72 L0 56 L22 50 L44 58 L64 52 L84 58 L106 50 L128 56 L128 72 Z" fill="hsl(344, 48%, 9%)" stroke="hsl(14, 96%, 50%)" stroke-width="1.2"/>
     <path d="M18 68 L38 58 L54 64 M110 68 L90 58 L74 64 M48 68 L64 56 L80 68" fill="none" stroke="hsl(44, 100%, 74%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M36 62 Q28 36 46 24 Q48 34 54 30 Q58 10 64 4 Q70 10 74 30 Q80 34 82 24 Q100 36 92 62 Z" fill="url(#ca-infernal_blade-fire)" opacity="0.72"/>
     <path d="M56 44 L52 18 L64 6 L76 18 L72 44 L76 50 L64 46 L52 50 Z" fill="rgba(0,0,0,0.52)" transform="translate(2,2)"/>
     <path d="M56 44 L53 34 L50 28 L55 24 L53 16 L64 6 L75 16 L73 24 L78 28 L75 34 L72 44 Z" fill="url(#ca-infernal_blade-steel)" stroke="hsl(26, 100%, 64%)" stroke-width="1.4"/>
     <path d="M64 10 V42 M64 22 L56 17 M64 28 L72 23" stroke="hsl(52, 100%, 92%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M40 38 Q50 48 64 46 Q78 48 88 38 Q82 54 64 52 Q46 54 40 38 Z" fill="hsl(348, 56%, 16%)" stroke="hsl(38, 100%, 68%)" stroke-width="1.3"/>
     <polygon points="64,41 69,47 64,53 59,47" fill="hsl(358, 100%, 56%)" stroke="hsl(50, 100%, 88%)" stroke-width="1"/>
     <circle cx="64" cy="47" r="1.8" fill="hsl(56, 100%, 96%)"/>
     <rect x="61" y="52" width="6" height="14" rx="1.5" fill="hsl(350, 56%, 18%)" stroke="hsl(28, 96%, 58%)" stroke-width="1"/>
     <polygon points="24,38 30,32 32,42" fill="hsl(348, 42%, 14%)" stroke="hsl(18, 96%, 56%)" stroke-width="1"/>
     <polygon points="104,38 98,32 96,42" fill="hsl(348, 42%, 14%)" stroke="hsl(18, 96%, 56%)" stroke-width="1"/>
     <circle cx="38" cy="20" r="2.2" fill="hsl(48, 100%, 84%)"/>
     <circle cx="90" cy="20" r="2.2" fill="hsl(48, 100%, 84%)"/>
     <circle cx="22" cy="48" r="2" fill="hsl(22, 100%, 66%)"/>
     <circle cx="106" cy="48" r="2" fill="hsl(22, 100%, 66%)"/>`,
    'hsla(14, 100%, 54%, 0.36)',
    `<radialGradient id="ca-infernal_blade-magma" cx="50%" cy="76%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 90%)" stop-opacity="0.9"/><stop offset="48%" stop-color="hsl(12, 100%, 52%)" stop-opacity="0.52"/><stop offset="100%" stop-color="hsl(344, 78%, 8%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-infernal_blade-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(348, 34%, 26%)"/><stop offset="52%" stop-color="hsl(354, 74%, 38%)"/><stop offset="100%" stop-color="hsl(28, 100%, 62%)"/></linearGradient><linearGradient id="ca-infernal_blade-fire" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(354, 96%, 44%)"/><stop offset="55%" stop-color="hsl(20, 100%, 56%)"/><stop offset="100%" stop-color="hsl(52, 100%, 88%)"/></linearGradient>`
  ),
  burning_pact: wrapArtSvg(
    'burning_pact',
    'hsl(16, 62%, 18%)',
    'hsl(350, 56%, 8%)',
    `<ellipse cx="64" cy="36" rx="52" ry="30" fill="url(#ca-burning_pact-glow)"/>
     <path d="M24 62 Q18 32 34 26 Q38 10 56 18 Q68 4 82 18 Q102 12 98 34 Q112 42 102 62 Z" fill="url(#ca-burning_pact-flame)" opacity="0.68"/>
     <path d="M36 14 H92 L90 56 Q78 52 70 58 Q56 54 38 58 Z" fill="rgba(0,0,0,0.48)" transform="translate(2,3)"/>
     <path d="M36 14 H92 L90 55 Q80 48 72 56 Q58 50 48 57 Q42 54 38 57 Z" fill="url(#ca-burning_pact-parch)" stroke="hsl(20, 84%, 38%)" stroke-width="1.4"/>
     <rect x="30" y="10" width="68" height="6" rx="2.6" fill="hsl(26, 66%, 34%)" stroke="hsl(44, 92%, 68%)" stroke-width="1.1"/>
     <circle cx="29" cy="13" r="3.4" fill="hsl(44, 92%, 68%)" stroke="hsl(18, 62%, 22%)" stroke-width="1"/>
     <circle cx="99" cy="13" r="3.4" fill="hsl(44, 92%, 68%)" stroke="hsl(18, 62%, 22%)" stroke-width="1"/>
     <path d="M44 23 H74 M44 29 H68 M44 35 H62 M44 41 H58" stroke="hsl(352, 74%, 28%)" stroke-width="1.7" stroke-linecap="round"/>
     <circle cx="76" cy="37" r="10.5" fill="hsl(354, 90%, 38%)" stroke="hsl(46, 100%, 76%)" stroke-width="1.4"/>
     <polygon points="76,29 80,35 84,37 80,39 76,45 72,39 68,37 72,35" fill="hsl(52, 100%, 90%)"/>
     <circle cx="76" cy="37" r="2.2" fill="hsl(356, 98%, 54%)"/>
     <path d="M48 56 Q54 44 62 54 Q68 38 78 52 Q86 42 94 56 Q72 64 48 56 Z" fill="url(#ca-burning_pact-flame)"/>
     <path d="M56 56 Q66 44 74 54 Q80 48 86 56 Z" fill="hsl(54, 100%, 92%)"/>
     <polygon points="20,44 26,40 28,48" fill="hsl(350, 48%, 16%)" stroke="hsl(32, 100%, 66%)" stroke-width="0.9"/>
     <polygon points="104,24 110,20 112,28" fill="hsl(350, 48%, 16%)" stroke="hsl(46, 100%, 78%)" stroke-width="0.9"/>
     <circle cx="24" cy="24" r="2.2" fill="hsl(48, 100%, 84%)"/>
     <circle cx="106" cy="44" r="2.2" fill="hsl(34, 100%, 70%)"/>
     <circle cx="64" cy="7" r="2" fill="hsl(52, 100%, 90%)"/>`,
    'hsla(32, 100%, 58%, 0.32)',
    `<radialGradient id="ca-burning_pact-glow" cx="52%" cy="50%" r="48%"><stop offset="0%" stop-color="hsl(48, 100%, 82%)" stop-opacity="0.72"/><stop offset="52%" stop-color="hsl(14, 98%, 50%)" stop-opacity="0.38"/><stop offset="100%" stop-color="hsl(348, 68%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-burning_pact-parch" x1="0" y1="0" x2="0.8" y2="1"><stop offset="0%" stop-color="hsl(44, 78%, 84%)"/><stop offset="68%" stop-color="hsl(34, 62%, 58%)"/><stop offset="100%" stop-color="hsl(14, 68%, 26%)"/></linearGradient><linearGradient id="ca-burning_pact-flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(354, 96%, 44%)"/><stop offset="52%" stop-color="hsl(22, 100%, 58%)"/><stop offset="100%" stop-color="hsl(52, 100%, 88%)"/></linearGradient>`
  ),
  exhume: wrapArtSvg(
    'exhume',
    'hsl(352, 54%, 17%)',
    'hsl(268, 42%, 8%)',
    `<ellipse cx="64" cy="56" rx="52" ry="24" fill="url(#ca-exhume-rift)"/>
     <polygon points="36,62 50,8 78,8 92,62" fill="hsl(38, 100%, 74%)" opacity="0.16"/>
     <path d="M12 58 Q26 36 38 42 M116 58 Q102 36 90 42" fill="none" stroke="hsl(286, 76%, 62%)" stroke-width="3" stroke-linecap="round" opacity="0.58"/>
     <path d="M0 72 L0 58 L26 52 L44 60 L64 55 L84 60 L102 52 L128 58 L128 72 Z" fill="hsl(266, 34%, 10%)" stroke="hsl(288, 72%, 56%)" stroke-width="1.2"/>
     <path d="M26 66 L46 58 L64 64 L82 58 L102 66" fill="none" stroke="hsl(34, 100%, 66%)" stroke-width="2" stroke-linecap="round"/>
     <rect x="54" y="9" width="22" height="30" rx="2.6" transform="rotate(8 65 24)" fill="rgba(0,0,0,0.46)"/>
     <rect x="52" y="7" width="22" height="30" rx="2.6" transform="rotate(8 63 22)" fill="url(#ca-exhume-card)" stroke="hsl(50, 100%, 86%)" stroke-width="1.6"/>
     <polygon points="64,14 68,21 63,28 59,21" fill="hsl(54, 100%, 94%)"/>
     <path d="M48 68 L52 44 L45 34 L52 24 L59 29 L62 20 L69 27 L75 23 L80 34 L74 46 L76 68 Z" fill="rgba(0,0,0,0.48)" transform="translate(2,2)"/>
     <path d="M48 68 L52 44 L45 34 L52 24 L59 29 L63 22 L69 28 L75 24 L80 34 L74 46 L76 68 Z" fill="url(#ca-exhume-gauntlet)" stroke="hsl(40, 92%, 68%)" stroke-width="1.5" stroke-linejoin="round"/>
     <path d="M51 44 H75 M50 54 H76 M56 32 L68 34" stroke="hsl(44, 96%, 72%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M46 14 L36 8 M84 14 L94 8 M42 26 L30 24 M88 26 L100 24" stroke="hsl(48, 100%, 84%)" stroke-width="1.8" stroke-linecap="round"/>
     <polygon points="32,48 39,44 38,52" fill="hsl(272, 34%, 24%)" stroke="hsl(36, 94%, 64%)" stroke-width="0.9"/>
     <polygon points="96,48 89,44 90,52" fill="hsl(272, 34%, 24%)" stroke="hsl(36, 94%, 64%)" stroke-width="0.9"/>
     <circle cx="38" cy="18" r="2.2" fill="hsl(50, 100%, 88%)"/>
     <circle cx="92" cy="18" r="2.2" fill="hsl(50, 100%, 88%)"/>
     <circle cx="24" cy="40" r="1.9" fill="hsl(292, 92%, 74%)"/>
     <circle cx="104" cy="40" r="1.9" fill="hsl(292, 92%, 74%)"/>`,
    'hsla(26, 98%, 56%, 0.30)',
    `<radialGradient id="ca-exhume-rift" cx="50%" cy="76%" r="50%"><stop offset="0%" stop-color="hsl(46, 100%, 82%)" stop-opacity="0.78"/><stop offset="50%" stop-color="hsl(352, 92%, 48%)" stop-opacity="0.42"/><stop offset="100%" stop-color="hsl(270, 62%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-exhume-gauntlet" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 24%, 72%)"/><stop offset="54%" stop-color="hsl(222, 22%, 34%)"/><stop offset="100%" stop-color="hsl(352, 46%, 16%)"/></linearGradient><linearGradient id="ca-exhume-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(46, 100%, 74%)"/><stop offset="52%" stop-color="hsl(14, 96%, 52%)"/><stop offset="100%" stop-color="hsl(350, 84%, 34%)"/></linearGradient>`
  ),
  brutality: wrapArtSvg(
    'brutality',
    'hsl(354, 78%, 19%)',
    'hsl(342, 68%, 6%)',
    `<circle cx="64" cy="34" r="36" fill="url(#ca-brutality-aura)"/>
     <polygon points="64,4 72,18 90,10 86,26 106,24 94,38 110,48 90,50 96,64 76,56 64,68 52,56 32,64 38,50 18,48 34,38 22,24 42,26 38,10 56,18" fill="hsl(356, 94%, 44%)" opacity="0.28"/>
     <path d="M12 24 Q24 32 34 26 M116 24 Q104 32 94 26 M10 46 Q24 44 32 50 M118 46 Q104 44 96 50" fill="none" stroke="hsl(14, 100%, 62%)" stroke-width="2" stroke-linecap="round" opacity="0.78"/>
     <path d="M26 48 L22 18 L40 30 L50 12 L64 26 L78 12 L88 30 L106 18 L102 48 Q64 56 26 48 Z" fill="rgba(0,0,0,0.52)" transform="translate(2,3)"/>
     <path d="M26 48 L22 18 L40 30 L50 12 L64 26 L78 12 L88 30 L106 18 L102 48 Q64 56 26 48 Z" fill="url(#ca-brutality-crown)" stroke="hsl(38, 96%, 68%)" stroke-width="1.6" stroke-linejoin="round"/>
     <path d="M27 40 Q64 47 101 40 L102 48 Q64 55 26 48 Z" fill="hsl(346, 58%, 14%)" stroke="hsl(358, 96%, 58%)" stroke-width="1.2"/>
     <polygon points="64,33 70,42 64,51 58,42" fill="url(#ca-brutality-ruby)" stroke="hsl(52, 100%, 88%)" stroke-width="1.1"/>
     <polygon points="40,37 45,43 40,48 35,43" fill="url(#ca-brutality-ruby)" stroke="hsl(46, 100%, 82%)" stroke-width="0.9"/>
     <polygon points="88,37 93,43 88,48 83,43" fill="url(#ca-brutality-ruby)" stroke="hsl(46, 100%, 82%)" stroke-width="0.9"/>
     <path d="M40 52 C37 58 37 62 40 64 C43 62 43 58 40 52 Z" fill="url(#ca-brutality-ruby)"/>
     <path d="M64 55 C60 62 60 66 64 69 C68 66 68 62 64 55 Z" fill="url(#ca-brutality-ruby)" stroke="hsl(46, 100%, 82%)" stroke-width="0.8"/>
     <path d="M88 52 C85 58 85 62 88 64 C91 62 91 58 88 52 Z" fill="url(#ca-brutality-ruby)"/>
     <circle cx="64" cy="40" r="1.8" fill="hsl(0, 0%, 100%)"/>
     <circle cx="22" cy="16" r="2.2" fill="hsl(50, 100%, 88%)"/>
     <circle cx="106" cy="16" r="2.2" fill="hsl(50, 100%, 88%)"/>
     <circle cx="50" cy="10" r="2.2" fill="hsl(48, 100%, 86%)"/>
     <circle cx="78" cy="10" r="2.2" fill="hsl(48, 100%, 86%)"/>
     <circle cx="18" cy="58" r="2" fill="hsl(358, 100%, 66%)"/>
     <circle cx="110" cy="58" r="2" fill="hsl(358, 100%, 66%)"/>`,
    'hsla(358, 100%, 54%, 0.36)',
    `<radialGradient id="ca-brutality-aura" cx="50%" cy="48%" r="50%"><stop offset="0%" stop-color="hsl(44, 100%, 76%)" stop-opacity="0.72"/><stop offset="48%" stop-color="hsl(356, 98%, 48%)" stop-opacity="0.46"/><stop offset="100%" stop-color="hsl(342, 74%, 8%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-brutality-crown" x1="0" y1="0" x2="0.8" y2="1"><stop offset="0%" stop-color="hsl(214, 18%, 62%)"/><stop offset="52%" stop-color="hsl(354, 58%, 32%)"/><stop offset="100%" stop-color="hsl(346, 66%, 12%)"/></linearGradient><linearGradient id="ca-brutality-ruby" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(14, 100%, 72%)"/><stop offset="55%" stop-color="hsl(356, 100%, 52%)"/><stop offset="100%" stop-color="hsl(344, 92%, 28%)"/></linearGradient>`
  ),

  // === Silent (9) ===
  endless_agony: wrapArtSvg(
    'endless_agony',
    'hsl(152, 60%, 15%)',
    'hsl(198, 56%, 7%)',
    `<ellipse cx="52" cy="40" rx="50" ry="30" fill="url(#ca-endless_agony-glow)"/>
     <path d="M4 66 Q24 44 18 22 Q28 34 40 30 Q26 48 36 68 Z" fill="url(#ca-endless_agony-thorn)" stroke="hsl(136, 92%, 56%)" stroke-width="1.2"/>
     <path d="M10 56 Q34 38 62 46 Q42 52 24 68" fill="none" stroke="hsl(148, 86%, 44%)" stroke-width="2.4" stroke-linecap="round"/>
     <polygon points="36,36 74,8 66,22 40,40" fill="url(#ca-endless_agony-dagger)" opacity="0.48"/>
     <polygon points="42,46 92,64 78,62 44,50" fill="url(#ca-endless_agony-dagger)" opacity="0.48"/>
     <polygon points="40,34 98,10 84,24 44,40" fill="url(#ca-endless_agony-dagger)" stroke="hsl(196, 62%, 10%)" stroke-width="1.2"/>
     <line x1="45" y1="36" x2="94" y2="13" stroke="hsl(0, 0%, 100%)" stroke-width="1.1"/>
     <polygon points="46,38 118,32 100,42 46,44" fill="url(#ca-endless_agony-dagger)" stroke="hsl(196, 62%, 10%)" stroke-width="1.3"/>
     <line x1="50" y1="40" x2="113" y2="33" stroke="hsl(0, 0%, 100%)" stroke-width="1.2"/>
     <polygon points="42,44 104,58 88,58 44,48" fill="url(#ca-endless_agony-dagger)" stroke="hsl(196, 62%, 10%)" stroke-width="1.2"/>
     <line x1="46" y1="46" x2="98" y2="56" stroke="hsl(96, 100%, 92%)" stroke-width="1.1"/>
     <circle cx="38" cy="39" r="6" fill="hsl(154, 72%, 22%)" stroke="hsl(110, 100%, 74%)" stroke-width="1.5"/>
     <circle cx="38" cy="39" r="2.6" fill="hsl(88, 100%, 90%)"/>
     <path d="M52 24 Q74 28 84 44 M64 16 Q88 26 98 50" fill="none" stroke="hsl(116, 100%, 72%)" stroke-width="1.4" stroke-dasharray="5 3" stroke-linecap="round"/>
     <polygon points="18,16 26,20 18,24" fill="hsl(124, 96%, 62%)"/>
     <circle cx="98" cy="10" r="2.2" fill="hsl(96, 100%, 88%)"/>
     <circle cx="118" cy="32" r="2.4" fill="hsl(0, 0%, 100%)"/>
     <circle cx="104" cy="58" r="2" fill="hsl(124, 100%, 76%)"/>`,
    'hsla(134, 96%, 54%, 0.30)',
    `<radialGradient id="ca-endless_agony-glow" cx="38%" cy="54%" r="50%"><stop offset="0%" stop-color="hsl(112, 100%, 68%)" stop-opacity="0.62"/><stop offset="52%" stop-color="hsl(152, 92%, 38%)" stop-opacity="0.3"/><stop offset="100%" stop-color="hsl(198, 66%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-endless_agony-dagger" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsl(158, 72%, 32%)"/><stop offset="58%" stop-color="hsl(136, 96%, 68%)"/><stop offset="100%" stop-color="hsl(86, 100%, 92%)"/></linearGradient><linearGradient id="ca-endless_agony-thorn" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(198, 56%, 10%)"/><stop offset="100%" stop-color="hsl(152, 64%, 28%)"/></linearGradient>`
  ),
  masterful_stab: wrapArtSvg(
    'masterful_stab',
    'hsl(172, 54%, 15%)',
    'hsl(214, 56%, 7%)',
    `<circle cx="86" cy="36" r="28" fill="url(#ca-masterful_stab-flash)"/>
     <circle cx="86" cy="36" r="22" fill="none" stroke="hsl(154, 92%, 64%)" stroke-width="1.3" stroke-dasharray="6 4" opacity="0.72"/>
     <circle cx="86" cy="36" r="13" fill="none" stroke="hsl(48, 100%, 78%)" stroke-width="1.5"/>
     <polygon points="86,12 104,26 102,48 86,60 70,48 68,26" fill="url(#ca-masterful_stab-prism)" stroke="hsl(166, 100%, 84%)" stroke-width="1.4" opacity="0.86"/>
     <polygon points="86,18 96,36 86,54 76,36" fill="hsl(162, 100%, 88%)" opacity="0.46"/>
     <line x1="8" y1="42" x2="72" y2="30" stroke="hsl(162, 100%, 78%)" stroke-width="1.2" opacity="0.52"/>
     <line x1="12" y1="58" x2="76" y2="44" stroke="hsl(162, 100%, 78%)" stroke-width="1.2" opacity="0.52"/>
     <polygon points="32,45 120,27 116,32 34,51" fill="rgba(0,0,0,0.44)" transform="translate(1,3)"/>
     <polygon points="32,45 120,27 116,32 34,51" fill="url(#ca-masterful_stab-blade)" stroke="hsl(206, 58%, 10%)" stroke-width="1.2"/>
     <line x1="35" y1="47" x2="118" y2="29" stroke="hsl(0, 0%, 100%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M27 38 L37 56 L33 58 L23 40 Z" fill="hsl(44, 90%, 66%)" stroke="hsl(22, 58%, 18%)" stroke-width="1"/>
     <line x1="29" y1="48" x2="13" y2="52" stroke="hsl(172, 52%, 22%)" stroke-width="4.4" stroke-linecap="round"/>
     <circle cx="12" cy="52" r="3" fill="hsl(148, 96%, 68%)" stroke="hsl(44, 92%, 68%)" stroke-width="1.1"/>
     <polygon points="86,25 89,33 97,36 89,39 86,47 83,39 75,36 83,33" fill="hsl(0, 0%, 100%)"/>
     <polygon points="104,18 114,14 109,23" fill="hsl(164, 100%, 84%)"/>
     <polygon points="106,46 116,52 104,52" fill="hsl(48, 100%, 82%)"/>
     <circle cx="120" cy="27" r="2.2" fill="hsl(0, 0%, 100%)"/>
     <circle cx="62" cy="16" r="1.9" fill="hsl(154, 100%, 80%)"/>`,
    'hsla(160, 98%, 58%, 0.30)',
    `<radialGradient id="ca-masterful_stab-flash" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)" stop-opacity="0.92"/><stop offset="48%" stop-color="hsl(156, 100%, 62%)" stop-opacity="0.46"/><stop offset="100%" stop-color="hsl(214, 62%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-masterful_stab-prism" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(164, 96%, 76%)"/><stop offset="52%" stop-color="hsl(182, 74%, 44%)"/><stop offset="100%" stop-color="hsl(216, 62%, 18%)"/></linearGradient><linearGradient id="ca-masterful_stab-blade" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(190, 28%, 54%)"/><stop offset="60%" stop-color="hsl(174, 52%, 92%)"/><stop offset="100%" stop-color="hsl(0, 0%, 100%)"/></linearGradient>`
  ),
  distraction: wrapArtSvg(
    'distraction',
    'hsl(148, 54%, 15%)',
    'hsl(206, 54%, 7%)',
    `<circle cx="48" cy="40" r="26" fill="url(#ca-distraction-smoke)"/>
     <circle cx="24" cy="48" r="18" fill="url(#ca-distraction-smoke)" opacity="0.86"/>
     <circle cx="72" cy="52" r="18" fill="url(#ca-distraction-smoke)" opacity="0.82"/>
     <circle cx="54" cy="22" r="16" fill="url(#ca-distraction-smoke)" opacity="0.78"/>
     <path d="M26 56 Q30 22 48 14 Q64 20 66 54 Z" fill="url(#ca-distraction-decoy)" stroke="hsl(114, 100%, 74%)" stroke-width="1.3" stroke-dasharray="4 2"/>
     <path d="M38 22 Q48 16 56 23 Q53 31 47 32 Q40 31 38 22 Z" fill="hsl(196, 58%, 10%)"/>
     <circle cx="44" cy="25" r="1.8" fill="hsl(96, 100%, 84%)"/>
     <circle cx="51" cy="25" r="1.8" fill="hsl(96, 100%, 84%)"/>
     <circle cx="46" cy="58" r="8.5" fill="url(#ca-distraction-bomb)" stroke="hsl(112, 96%, 64%)" stroke-width="1.3"/>
     <rect x="42" y="46.5" width="8" height="4" rx="1.2" fill="hsl(42, 82%, 58%)" stroke="hsl(22, 54%, 16%)" stroke-width="0.9"/>
     <path d="M40 58 L46 55 L52 60" fill="none" stroke="hsl(104, 100%, 74%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M12 36 Q24 24 38 30 M58 38 Q72 28 84 36" fill="none" stroke="hsl(114, 100%, 70%)" stroke-width="1.8" stroke-linecap="round" opacity="0.76"/>
     <polygon points="122,12 88,28 96,29 124,16" fill="hsl(178, 52%, 90%)" stroke="hsl(204, 58%, 10%)" stroke-width="0.9"/>
     <polygon points="124,28 84,42 93,43 125,33" fill="hsl(178, 52%, 90%)" stroke="hsl(204, 58%, 10%)" stroke-width="0.9"/>
     <polygon points="118,46 88,54 96,55 120,50" fill="hsl(178, 52%, 90%)" stroke="hsl(204, 58%, 10%)" stroke-width="0.9"/>
     <line x1="106" y1="16" x2="78" y2="30" stroke="hsl(148, 100%, 76%)" stroke-width="1.2" opacity="0.7"/>
     <line x1="108" y1="33" x2="74" y2="44" stroke="hsl(148, 100%, 76%)" stroke-width="1.2" opacity="0.7"/>
     <circle cx="88" cy="28" r="2.2" fill="hsl(52, 100%, 90%)"/>
     <circle cx="84" cy="42" r="2.2" fill="hsl(112, 100%, 82%)"/>
     <circle cx="24" cy="18" r="2" fill="hsl(116, 100%, 76%)"/>`,
    'hsla(122, 92%, 52%, 0.30)',
    `<radialGradient id="ca-distraction-smoke" cx="46%" cy="46%" r="54%"><stop offset="0%" stop-color="hsl(116, 86%, 56%)" stop-opacity="0.74"/><stop offset="56%" stop-color="hsl(158, 58%, 28%)" stop-opacity="0.54"/><stop offset="100%" stop-color="hsl(204, 56%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-distraction-decoy" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(132, 96%, 68%)" stop-opacity="0.68"/><stop offset="100%" stop-color="hsl(174, 72%, 22%)" stop-opacity="0.22"/></linearGradient><radialGradient id="ca-distraction-bomb" cx="38%" cy="36%" r="62%"><stop offset="0%" stop-color="hsl(196, 26%, 46%)"/><stop offset="100%" stop-color="hsl(214, 42%, 12%)"/></radialGradient>`
  ),
  setup: wrapArtSvg(
    'setup',
    'hsl(166, 52%, 15%)',
    'hsl(214, 52%, 7%)',
    `<circle cx="64" cy="36" r="26" fill="url(#ca-setup-spring)"/>
     <line x1="8" y1="12" x2="120" y2="60" stroke="url(#ca-setup-wire)" stroke-width="1.4"/>
     <line x1="8" y1="60" x2="120" y2="12" stroke="url(#ca-setup-wire)" stroke-width="1.4"/>
     <line x1="14" y1="36" x2="114" y2="36" stroke="hsl(154, 100%, 76%)" stroke-width="1.2" stroke-dasharray="5 3" opacity="0.74"/>
     <circle cx="64" cy="36" r="16" fill="hsl(200, 48%, 12%)" stroke="hsl(44, 88%, 64%)" stroke-width="1.8"/>
     <circle cx="64" cy="36" r="11" fill="none" stroke="hsl(152, 98%, 66%)" stroke-width="1.5"/>
     <path d="M64 26 A10 10 0 1 1 55 40 A7 7 0 1 1 68 33 A4 4 0 1 1 62 38" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="2" stroke-linecap="round"/>
     <polygon points="18,16 54,28 46,35 16,22" fill="url(#ca-setup-kunai)" stroke="hsl(206, 58%, 10%)" stroke-width="1.2"/>
     <line x1="22" y1="19" x2="50" y2="30" stroke="hsl(0, 0%, 100%)" stroke-width="1"/>
     <circle cx="14" cy="17" r="3.4" fill="none" stroke="hsl(44, 92%, 68%)" stroke-width="1.5"/>
     <polygon points="110,56 74,44 82,37 112,50" fill="url(#ca-setup-kunai)" stroke="hsl(206, 58%, 10%)" stroke-width="1.2"/>
     <line x1="106" y1="53" x2="78" y2="42" stroke="hsl(0, 0%, 100%)" stroke-width="1"/>
     <circle cx="114" cy="55" r="3.4" fill="none" stroke="hsl(44, 92%, 68%)" stroke-width="1.5"/>
     <polygon points="64,14 68,21 60,21" fill="hsl(46, 94%, 70%)"/>
     <polygon points="64,58 68,51 60,51" fill="hsl(46, 94%, 70%)"/>
     <path d="M40 14 Q64 6 88 14 M40 58 Q64 66 88 58" fill="none" stroke="hsl(156, 100%, 74%)" stroke-width="1.5" stroke-dasharray="4 3" stroke-linecap="round"/>
     <circle cx="64" cy="36" r="2.8" fill="hsl(52, 100%, 92%)"/>
     <circle cx="110" cy="16" r="2.2" fill="hsl(152, 100%, 80%)"/>
     <circle cx="18" cy="56" r="2.2" fill="hsl(152, 100%, 80%)"/>`,
    'hsla(152, 94%, 56%, 0.28)',
    `<radialGradient id="ca-setup-spring" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(50, 100%, 86%)" stop-opacity="0.72"/><stop offset="52%" stop-color="hsl(152, 96%, 52%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(212, 60%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-setup-kunai" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(192, 32%, 54%)"/><stop offset="60%" stop-color="hsl(174, 56%, 92%)"/><stop offset="100%" stop-color="hsl(148, 100%, 78%)"/></linearGradient><linearGradient id="ca-setup-wire" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(156, 100%, 78%)" stop-opacity="0.35"/><stop offset="50%" stop-color="hsl(48, 100%, 82%)" stop-opacity="0.9"/><stop offset="100%" stop-color="hsl(156, 100%, 78%)" stop-opacity="0.35"/></linearGradient>`
  ),
  grand_finale: wrapArtSvg(
    'grand_finale',
    'hsl(160, 58%, 16%)',
    'hsl(232, 56%, 8%)',
    `<polygon points="48,0 80,0 112,72 16,72" fill="url(#ca-grand_finale-beam)"/>
     <ellipse cx="64" cy="64" rx="44" ry="8" fill="hsl(152, 96%, 62%)" opacity="0.28"/>
     <path d="M0 0 H30 Q22 24 14 42 Q20 56 8 72 H0 Z" fill="url(#ca-grand_finale-curtain)" stroke="hsl(46, 92%, 68%)" stroke-width="1.2"/>
     <path d="M128 0 H98 Q106 24 114 42 Q108 56 120 72 H128 Z" fill="url(#ca-grand_finale-curtain)" stroke="hsl(46, 92%, 68%)" stroke-width="1.2"/>
     <path d="M4 42 Q14 46 22 40 M124 42 Q114 46 106 40" fill="none" stroke="hsl(48, 100%, 78%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M18 32 Q64 4 110 28 Q68 20 26 42 Z" fill="url(#ca-grand_finale-crescent)"/>
     <path d="M110 46 Q64 68 18 44 Q62 56 102 36 Z" fill="url(#ca-grand_finale-crescent)"/>
     <path d="M22 33 Q64 11 106 28" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M106 45 Q64 62 22 44" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M54 62 L60 40 L52 30 L64 24 L76 30 L68 40 L74 62 L64 50 Z" fill="hsl(214, 52%, 10%)" stroke="hsl(152, 96%, 68%)" stroke-width="1.3" stroke-linejoin="round"/>
     <circle cx="64" cy="20" r="4.2" fill="hsl(158, 44%, 86%)" stroke="hsl(214, 54%, 10%)" stroke-width="1.1"/>
     <polygon points="64,6 66.5,12 73,14 66.5,16 64,22 61.5,16 55,14 61.5,12" fill="hsl(52, 100%, 92%)"/>
     <polygon points="34,16 39,14 38,20" fill="hsl(50, 100%, 82%)"/>
     <polygon points="94,16 89,14 90,20" fill="hsl(148, 100%, 74%)"/>
     <polygon points="32,56 38,54 36,60" fill="hsl(148, 100%, 76%)"/>
     <polygon points="96,56 90,54 92,60" fill="hsl(50, 100%, 82%)"/>
     <circle cx="46" cy="24" r="2" fill="hsl(52, 100%, 90%)"/>
     <circle cx="82" cy="24" r="2" fill="hsl(152, 100%, 84%)"/>
     <circle cx="44" cy="48" r="1.8" fill="hsl(152, 100%, 82%)"/>
     <circle cx="84" cy="48" r="1.8" fill="hsl(52, 100%, 88%)"/>`,
    'hsla(50, 100%, 66%, 0.34)',
    `<linearGradient id="ca-grand_finale-beam" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 88%)" stop-opacity="0.58"/><stop offset="55%" stop-color="hsl(154, 96%, 62%)" stop-opacity="0.24"/><stop offset="100%" stop-color="hsl(190, 82%, 34%)" stop-opacity="0.04"/></linearGradient><linearGradient id="ca-grand_finale-curtain" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(166, 58%, 26%)"/><stop offset="65%" stop-color="hsl(192, 56%, 14%)"/><stop offset="100%" stop-color="hsl(228, 60%, 7%)"/></linearGradient><linearGradient id="ca-grand_finale-crescent" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(150, 98%, 58%)"/><stop offset="50%" stop-color="hsl(52, 100%, 84%)"/><stop offset="100%" stop-color="hsl(168, 100%, 76%)"/></linearGradient>`
  ),
  unload: wrapArtSvg(
    'unload',
    'hsl(168, 52%, 15%)',
    'hsl(216, 56%, 7%)',
    `<ellipse cx="38" cy="36" rx="44" ry="30" fill="url(#ca-unload-burst)"/>
     <rect x="6" y="46" width="11" height="16" rx="1.6" transform="rotate(-22 11 54)" fill="hsl(186, 42%, 18%)" stroke="hsl(156, 84%, 58%)" stroke-width="1" opacity="0.62"/>
     <rect x="18" y="50" width="11" height="16" rx="1.6" transform="rotate(-8 23 58)" fill="hsl(186, 42%, 20%)" stroke="hsl(46, 94%, 72%)" stroke-width="1" opacity="0.72"/>
     <path d="M0 10 Q24 8 42 22 L28 34 Q14 26 0 32 Z" fill="url(#ca-unload-cloak)" stroke="hsl(154, 86%, 56%)" stroke-width="1.2"/>
     <path d="M0 64 Q24 64 42 50 L28 38 Q14 48 0 42 Z" fill="url(#ca-unload-cloak)" stroke="hsl(154, 86%, 56%)" stroke-width="1.2"/>
     <line x1="34" y1="36" x2="108" y2="8" stroke="hsl(146, 100%, 74%)" stroke-width="1.4" opacity="0.58"/>
     <line x1="34" y1="36" x2="122" y2="26" stroke="hsl(146, 100%, 74%)" stroke-width="1.4" opacity="0.58"/>
     <line x1="34" y1="36" x2="122" y2="48" stroke="hsl(146, 100%, 74%)" stroke-width="1.4" opacity="0.58"/>
     <line x1="34" y1="36" x2="104" y2="66" stroke="hsl(146, 100%, 74%)" stroke-width="1.4" opacity="0.58"/>
     <polygon points="52,24 98,8 88,18 55,28" fill="url(#ca-unload-knife)" stroke="hsl(206, 58%, 10%)" stroke-width="1.1"/>
     <polygon points="66,24 120,18 106,27 68,29" fill="url(#ca-unload-knife)" stroke="hsl(206, 58%, 10%)" stroke-width="1.1"/>
     <polygon points="54,34 114,34 98,40 54,39" fill="url(#ca-unload-knife)" stroke="hsl(206, 58%, 10%)" stroke-width="1.2"/>
     <polygon points="68,42 122,50 106,52 68,47" fill="url(#ca-unload-knife)" stroke="hsl(206, 58%, 10%)" stroke-width="1.1"/>
     <polygon points="50,47 98,64 84,62 52,52" fill="url(#ca-unload-knife)" stroke="hsl(206, 58%, 10%)" stroke-width="1.1"/>
     <polygon points="40,30 76,22 66,29 42,34" fill="hsl(144, 96%, 72%)" stroke="hsl(206, 58%, 10%)" stroke-width="1"/>
     <polygon points="40,42 78,52 66,48 42,45" fill="hsl(144, 96%, 72%)" stroke="hsl(206, 58%, 10%)" stroke-width="1"/>
     <polygon points="34,26 38,33 46,36 38,39 34,46 30,39 22,36 30,33" fill="hsl(52, 100%, 92%)"/>
     <circle cx="98" cy="8" r="2" fill="hsl(0, 0%, 100%)"/>
     <circle cx="120" cy="18" r="2" fill="hsl(148, 100%, 86%)"/>
     <circle cx="114" cy="34" r="2.2" fill="hsl(50, 100%, 88%)"/>
     <circle cx="122" cy="50" r="2" fill="hsl(148, 100%, 86%)"/>`,
    'hsla(142, 96%, 56%, 0.32)',
    `<radialGradient id="ca-unload-burst" cx="28%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 88%)" stop-opacity="0.82"/><stop offset="48%" stop-color="hsl(142, 98%, 54%)" stop-opacity="0.4"/><stop offset="100%" stop-color="hsl(212, 62%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-unload-cloak" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(168, 52%, 28%)"/><stop offset="100%" stop-color="hsl(214, 58%, 9%)"/></linearGradient><linearGradient id="ca-unload-knife" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsl(192, 32%, 52%)"/><stop offset="62%" stop-color="hsl(174, 58%, 92%)"/><stop offset="100%" stop-color="hsl(120, 100%, 88%)"/></linearGradient>`
  ),
  doppelganger: wrapArtSvg(
    'doppelganger',
    'hsl(168, 56%, 16%)',
    'hsl(224, 58%, 7%)',
    `<polygon points="56,0 72,0 68,72 60,72" fill="url(#ca-doppelganger-rift)"/>
     <ellipse cx="64" cy="36" rx="20" ry="30" fill="none" stroke="hsl(154, 100%, 74%)" stroke-width="1.3" stroke-dasharray="6 4" opacity="0.62"/>
     <path d="M12 66 Q16 26 36 14 Q48 16 52 34 L56 66 Z" fill="url(#ca-doppelganger-solid)" stroke="hsl(158, 78%, 56%)" stroke-width="1.3"/>
     <path d="M28 22 Q37 15 45 23 Q43 32 36 33 Q29 32 28 22 Z" fill="hsl(216, 62%, 8%)"/>
     <circle cx="40" cy="26" r="1.8" fill="hsl(48, 100%, 84%)"/>
     <polygon points="44,44 60,24 56,36 48,48" fill="hsl(186, 46%, 86%)" stroke="hsl(214, 58%, 10%)" stroke-width="1"/>
     <path d="M116 66 Q112 26 92 14 Q80 16 76 34 L72 66 Z" fill="url(#ca-doppelganger-mirror)" stroke="hsl(152, 100%, 78%)" stroke-width="1.4" stroke-dasharray="5 2"/>
     <path d="M100 22 Q91 15 83 23 Q85 32 92 33 Q99 32 100 22 Z" fill="hsl(178, 72%, 14%)"/>
     <circle cx="88" cy="26" r="1.8" fill="hsl(152, 100%, 88%)"/>
     <polygon points="84,44 68,24 72,36 80,48" fill="hsl(152, 100%, 82%)" stroke="hsl(188, 76%, 24%)" stroke-width="1" opacity="0.88"/>
     <line x1="64" y1="3" x2="64" y2="69" stroke="hsl(0, 0%, 100%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M54 20 L64 14 L74 20 M52 52 L64 58 L76 52" fill="none" stroke="hsl(154, 100%, 82%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="64,30 68,36 64,42 60,36" fill="hsl(52, 100%, 92%)"/>
     <polygon points="20,24 26,20 24,28" fill="hsl(156, 92%, 66%)" opacity="0.78"/>
     <polygon points="108,24 102,20 104,28" fill="hsl(156, 100%, 82%)" opacity="0.85"/>
     <circle cx="64" cy="10" r="2.2" fill="hsl(0, 0%, 100%)"/>
     <circle cx="64" cy="62" r="2.2" fill="hsl(152, 100%, 84%)"/>
     <circle cx="108" cy="46" r="1.8" fill="hsl(164, 100%, 82%)"/>`,
    'hsla(156, 100%, 62%, 0.32)',
    `<linearGradient id="ca-doppelganger-rift" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsl(162, 100%, 62%)" stop-opacity="0"/><stop offset="50%" stop-color="hsl(152, 100%, 82%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(162, 100%, 62%)" stop-opacity="0"/></linearGradient><linearGradient id="ca-doppelganger-solid" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(168, 52%, 28%)"/><stop offset="60%" stop-color="hsl(194, 54%, 15%)"/><stop offset="100%" stop-color="hsl(224, 58%, 8%)"/></linearGradient><linearGradient id="ca-doppelganger-mirror" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(152, 98%, 64%)" stop-opacity="0.62"/><stop offset="58%" stop-color="hsl(172, 86%, 40%)" stop-opacity="0.46"/><stop offset="100%" stop-color="hsl(196, 78%, 22%)" stop-opacity="0.22"/></linearGradient>`
  ),
  nightmare: wrapArtSvg(
    'nightmare',
    'hsl(274, 52%, 15%)',
    'hsl(188, 58%, 6%)',
    `<ellipse cx="64" cy="36" rx="54" ry="30" fill="url(#ca-nightmare-aura)"/>
     <path d="M6 16 Q26 24 38 38 Q22 50 8 62" fill="none" stroke="url(#ca-nightmare-tendril)" stroke-width="4.4" stroke-linecap="round"/>
     <path d="M122 16 Q102 24 90 38 Q106 50 120 62" fill="none" stroke="url(#ca-nightmare-tendril)" stroke-width="4.4" stroke-linecap="round"/>
     <path d="M16 6 Q36 16 46 28 M112 6 Q92 16 82 28" fill="none" stroke="hsl(132, 96%, 58%)" stroke-width="2" stroke-linecap="round" opacity="0.68"/>
     <rect x="14" y="28" width="13" height="19" rx="2" transform="rotate(-18 20 37)" fill="hsl(278, 52%, 20%)" stroke="hsl(136, 98%, 64%)" stroke-width="1.2" opacity="0.82"/>
     <rect x="101" y="28" width="13" height="19" rx="2" transform="rotate(18 107 37)" fill="hsl(278, 52%, 20%)" stroke="hsl(136, 98%, 64%)" stroke-width="1.2" opacity="0.82"/>
     <rect x="57" y="4" width="14" height="16" rx="2" fill="hsl(278, 54%, 22%)" stroke="hsl(296, 96%, 76%)" stroke-width="1.1" opacity="0.68"/>
     <path d="M40 24 L36 10 L49 20 L64 16 L79 20 L92 10 L88 24 L84 48 L64 62 L44 48 Z" fill="rgba(0,0,0,0.52)" transform="translate(2,3)"/>
     <path d="M40 24 L36 10 L49 20 L64 16 L79 20 L92 10 L88 24 L84 48 L64 62 L44 48 Z" fill="url(#ca-nightmare-mask)" stroke="hsl(292, 86%, 72%)" stroke-width="1.5" stroke-linejoin="round"/>
     <path d="M46 31 L59 35 L49 40 Z" fill="hsl(114, 100%, 68%)"/>
     <path d="M82 31 L69 35 L79 40 Z" fill="hsl(114, 100%, 68%)"/>
     <circle cx="52" cy="35" r="2" fill="hsl(0, 0%, 100%)"/>
     <circle cx="76" cy="35" r="2" fill="hsl(0, 0%, 100%)"/>
     <path d="M46 32 Q36 22 30 24 M82 32 Q92 22 98 24" fill="none" stroke="hsl(118, 100%, 74%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M62 44 L64 39 L66 44 Z" fill="hsl(274, 62%, 12%)"/>
     <path d="M51 49 Q64 56 77 49 M55 48 V53 M60 50 V55 M64 50 V56 M68 50 V55 M73 48 V53" fill="none" stroke="hsl(274, 66%, 10%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="28" cy="58" r="2.2" fill="hsl(124, 100%, 72%)"/>
     <circle cx="100" cy="58" r="2.2" fill="hsl(124, 100%, 72%)"/>
     <circle cx="64" cy="66" r="2" fill="hsl(296, 98%, 76%)"/>`,
    'hsla(142, 94%, 52%, 0.30)',
    `<radialGradient id="ca-nightmare-aura" cx="50%" cy="48%" r="50%"><stop offset="0%" stop-color="hsl(126, 100%, 60%)" stop-opacity="0.54"/><stop offset="52%" stop-color="hsl(282, 82%, 44%)" stop-opacity="0.38"/><stop offset="100%" stop-color="hsl(192, 68%, 8%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-nightmare-mask" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0%" stop-color="hsl(274, 34%, 82%)"/><stop offset="54%" stop-color="hsl(276, 36%, 46%)"/><stop offset="100%" stop-color="hsl(252, 46%, 18%)"/></linearGradient><linearGradient id="ca-nightmare-tendril" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(286, 86%, 54%)"/><stop offset="100%" stop-color="hsl(136, 96%, 52%)"/></linearGradient>`
  ),
  bullet_time: wrapArtSvg(
    'bullet_time',
    'hsl(176, 50%, 15%)',
    'hsl(228, 56%, 7%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-bullet_time-halo)"/>
     <ellipse cx="64" cy="36" rx="52" ry="26" fill="none" stroke="hsl(166, 96%, 68%)" stroke-width="1.3" stroke-dasharray="7 4" opacity="0.58"/>
     <circle cx="64" cy="36" r="24" fill="none" stroke="hsl(48, 100%, 76%)" stroke-width="1.5" opacity="0.78"/>
     <path d="M64 8 V13 M64 59 V64 M36 36 H41 M87 36 H92" stroke="hsl(50, 100%, 84%)" stroke-width="1.6" stroke-linecap="round"/>
     <rect x="48" y="10" width="32" height="5" rx="1.8" fill="url(#ca-bullet_time-gold)" stroke="hsl(26, 62%, 22%)" stroke-width="1.1"/>
     <rect x="48" y="57" width="32" height="5" rx="1.8" fill="url(#ca-bullet_time-gold)" stroke="hsl(26, 62%, 22%)" stroke-width="1.1"/>
     <path d="M52 15 H76 Q74 28 66 35 Q74 44 76 57 H52 Q54 44 62 35 Q54 28 52 15 Z" fill="hsla(176, 80%, 88%, 0.24)" stroke="hsl(48, 100%, 80%)" stroke-width="1.3"/>
     <polygon points="56,19 72,19 64,33" fill="url(#ca-bullet_time-gold)" opacity="0.88"/>
     <polygon points="64,45 73,56 55,56" fill="url(#ca-bullet_time-gold)"/>
     <line x1="64" y1="33" x2="64" y2="46" stroke="hsl(54, 100%, 92%)" stroke-width="1.6" stroke-dasharray="2 2" stroke-linecap="round"/>
     <polygon points="44,24 51,28 46,32" fill="hsl(174, 92%, 86%)" opacity="0.84"/>
     <polygon points="84,26 78,31 85,35" fill="hsl(174, 92%, 86%)" opacity="0.84"/>
     <polygon points="10,20 42,26 32,31 12,25" fill="url(#ca-bullet_time-dagger)" stroke="hsl(210, 58%, 10%)" stroke-width="1.1"/>
     <polygon points="118,20 86,26 96,31 116,25" fill="url(#ca-bullet_time-dagger)" stroke="hsl(210, 58%, 10%)" stroke-width="1.1"/>
     <polygon points="12,52 44,46 34,41 14,47" fill="url(#ca-bullet_time-dagger)" stroke="hsl(210, 58%, 10%)" stroke-width="1.1"/>
     <polygon points="116,52 84,46 94,41 114,47" fill="url(#ca-bullet_time-dagger)" stroke="hsl(210, 58%, 10%)" stroke-width="1.1"/>
     <ellipse cx="42" cy="26" rx="4" ry="8" fill="none" stroke="hsl(154, 100%, 80%)" stroke-width="1.2"/>
     <ellipse cx="86" cy="26" rx="4" ry="8" fill="none" stroke="hsl(154, 100%, 80%)" stroke-width="1.2"/>
     <circle cx="64" cy="36" r="3" fill="hsl(0, 0%, 100%)"/>
     <circle cx="30" cy="14" r="2" fill="hsl(52, 100%, 88%)"/>
     <circle cx="98" cy="58" r="2" fill="hsl(52, 100%, 88%)"/>`,
    'hsla(46, 100%, 62%, 0.34)',
    `<radialGradient id="ca-bullet_time-halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 92%)" stop-opacity="0.74"/><stop offset="48%" stop-color="hsl(164, 96%, 54%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(228, 62%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-bullet_time-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 88%)"/><stop offset="55%" stop-color="hsl(42, 92%, 60%)"/><stop offset="100%" stop-color="hsl(28, 72%, 34%)"/></linearGradient><linearGradient id="ca-bullet_time-dagger" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsl(190, 34%, 58%)"/><stop offset="58%" stop-color="hsl(172, 58%, 94%)"/><stop offset="100%" stop-color="hsl(148, 100%, 80%)"/></linearGradient>`
  ),
};
