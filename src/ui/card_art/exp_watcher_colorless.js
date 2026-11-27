// Bespoke 16:9 SVG card illustrations for expansion Watcher (incl. Expunger) and Colorless Uncommon/Rare cards.
import { wrapArtSvg } from './wrap.js';

export const EXP_WATCHER_COLORLESS_ART = {
  signature_move: wrapArtSvg(
    'signature_move',
    'hsl(274, 58%, 21%)',
    'hsl(306, 56%, 8%)',
    `<circle cx="80" cy="34" r="32" fill="url(#ca-signature_move-burst)"/>
     <circle cx="80" cy="34" r="25" fill="none" stroke="hsl(48, 98%, 74%)" stroke-width="1.3" stroke-dasharray="5 3" opacity="0.72"/>
     <circle cx="80" cy="34" r="18" fill="none" stroke="url(#ca-signature_move-lotus)" stroke-width="1.8" opacity="0.88"/>
     <path d="M80 10 Q86 21 80 34 Q74 21 80 10 Z M80 58 Q86 47 80 34 Q74 47 80 58 Z M56 34 Q67 28 80 34 Q67 40 56 34 Z M104 34 Q93 28 80 34 Q93 40 104 34 Z" fill="url(#ca-signature_move-lotus)" opacity="0.46"/>
     <path d="M63 17 Q74 23 80 34 Q69 28 63 17 Z M97 17 Q91 28 80 34 Q86 23 97 17 Z M63 51 Q69 40 80 34 Q74 45 63 51 Z M97 51 Q86 45 80 34 Q91 40 97 51 Z" fill="hsl(48, 100%, 82%)" opacity="0.42"/>
     <path d="M8 65 L74 36 L77 41 L12 69 Z" fill="hsl(286, 62%, 10%)" opacity="0.72" transform="translate(2,2.5)"/>
     <path d="M6 63 L74 34 L77 39 L10 68 Z" fill="url(#ca-signature_move-staff)" stroke="hsl(48, 100%, 84%)" stroke-width="1.1" stroke-linejoin="round"/>
     <path d="M12 64 L73 37" stroke="hsl(54, 100%, 96%)" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/>
     <path d="M16 54 Q36 58 46 43 Q58 29 74 34" fill="none" stroke="hsl(316, 94%, 72%)" stroke-width="2" stroke-linecap="round" opacity="0.82"/>
     <path d="M22 65 Q42 52 58 48 Q70 45 82 36" fill="none" stroke="hsl(46, 100%, 78%)" stroke-width="1.5" stroke-linecap="round" opacity="0.86"/>
     <circle cx="80" cy="34" r="11.5" fill="url(#ca-signature_move-palm)" stroke="hsl(52, 100%, 92%)" stroke-width="1.3"/>
     <path d="M74 39 L74 29 Q74 27 76 27 Q78 27 78 31 L78 25 Q78 23 80 23 Q82 23 82 30 L82 26 Q82 24 84 24 Q86 24 86 31 L86 29 Q86 27 88 28 Q89 29 87 36 L84 41 Q79 43 74 39 Z" fill="hsl(54, 100%, 96%)" stroke="hsl(38, 96%, 58%)" stroke-width="0.9" stroke-linejoin="round"/>
     <path d="M80 4 V11 M109 34 H118 M100 14 L106 8 M100 54 L106 60 M60 14 L54 8" stroke="hsl(50, 100%, 86%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="44,18 49,15 47,22 42,21" fill="hsl(326, 92%, 74%)" opacity="0.86"/>
     <polygon points="108,21 114,19 111,26 106,24" fill="hsl(48, 100%, 82%)" opacity="0.9"/>
     <polygon points="94,58 100,56 97,63 92,61" fill="hsl(312, 92%, 72%)" opacity="0.84"/>
     <circle cx="34" cy="32" r="1.8" fill="hsl(52, 100%, 92%)"/>
     <circle cx="114" cy="46" r="1.9" fill="hsl(48, 100%, 84%)"/>
     <circle cx="56" cy="59" r="1.5" fill="hsl(324, 96%, 78%)"/>`,
    'hsla(46, 100%, 64%, 0.34)',
    `<radialGradient id="ca-signature_move-burst" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)" stop-opacity="0.92"/><stop offset="42%" stop-color="hsl(44, 100%, 66%)" stop-opacity="0.52"/><stop offset="76%" stop-color="hsl(312, 92%, 58%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(276, 70%, 24%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-signature_move-staff" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(284, 62%, 34%)"/><stop offset="48%" stop-color="hsl(322, 86%, 62%)"/><stop offset="100%" stop-color="hsl(50, 100%, 86%)"/></linearGradient><linearGradient id="ca-signature_move-lotus" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="52%" stop-color="hsl(324, 96%, 70%)"/><stop offset="100%" stop-color="hsl(284, 82%, 52%)"/></linearGradient><radialGradient id="ca-signature_move-palm" cx="44%" cy="40%" r="58%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="58%" stop-color="hsl(42, 100%, 64%)"/><stop offset="100%" stop-color="hsl(312, 86%, 48%)"/></radialGradient>`
  ),
  foreign_influence: wrapArtSvg(
    'foreign_influence',
    'hsl(264, 54%, 20%)',
    'hsl(288, 52%, 8%)',
    `<polygon points="2,10 56,28 52,33 2,21" fill="url(#ca-foreign_influence-red)" opacity="0.88"/>
     <polygon points="2,32 50,34 50,40 2,42" fill="url(#ca-foreign_influence-green)" opacity="0.88"/>
     <polygon points="2,54 52,41 56,46 2,65" fill="url(#ca-foreign_influence-blue)" opacity="0.88"/>
     <path d="M12 16 L32 23 L29 26 L10 19 Z M25 18 L22 26" stroke="hsl(8, 100%, 84%)" stroke-width="1.3" fill="hsl(354, 96%, 64%)" stroke-linecap="round"/>
     <path d="M10 37 Q22 33 34 37 Q22 41 10 37 Z" fill="hsl(146, 100%, 74%)" stroke="hsl(152, 100%, 90%)" stroke-width="0.9"/>
     <polyline points="10,59 20,53 24,56 35,48" fill="none" stroke="hsl(198, 100%, 82%)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <polygon points="75,30 126,12 126,60 75,44" fill="url(#ca-foreign_influence-violet)" opacity="0.9"/>
     <path d="M77 35 L124 23 M78 37 L126 37 M77 39 L124 51" stroke="hsl(50, 100%, 88%)" stroke-width="1.2" opacity="0.72"/>
     <circle cx="64" cy="36" r="24" fill="none" stroke="hsl(46, 94%, 72%)" stroke-width="1" stroke-dasharray="3 3" opacity="0.62"/>
     <polygon points="64,13 84,52 44,52" fill="hsl(270, 62%, 10%)" opacity="0.72" transform="translate(2,2.5)"/>
     <polygon points="64,11 84,51 44,51" fill="url(#ca-foreign_influence-prism)" stroke="hsl(50, 100%, 88%)" stroke-width="1.5" stroke-linejoin="round"/>
     <polygon points="64,11 71,51 44,51" fill="hsla(292, 92%, 82%, 0.28)"/>
     <polygon points="64,11 84,51 71,51" fill="hsla(266, 68%, 22%, 0.42)"/>
     <line x1="64" y1="13" x2="64" y2="50" stroke="hsl(52, 100%, 94%)" stroke-width="1.1" opacity="0.8"/>
     <circle cx="64" cy="36" r="5.5" fill="hsl(54, 100%, 96%)" opacity="0.92"/>
     <circle cx="64" cy="36" r="9.5" fill="none" stroke="hsl(304, 100%, 82%)" stroke-width="1.2"/>
     <ellipse cx="101" cy="37" rx="5.5" ry="15" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.3" opacity="0.78"/>
     <path d="M112 22 L113.5 26 L117.5 27.5 L113.5 29 L112 33 L110.5 29 L106.5 27.5 L110.5 26 Z" fill="hsl(52, 100%, 94%)"/>
     <circle cx="94" cy="18" r="1.6" fill="hsl(304, 100%, 84%)"/>
     <circle cx="114" cy="49" r="1.7" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(286, 94%, 66%, 0.30)',
    `<linearGradient id="ca-foreign_influence-prism" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 94%)" stop-opacity="0.92"/><stop offset="46%" stop-color="hsl(288, 86%, 72%)" stop-opacity="0.76"/><stop offset="100%" stop-color="hsl(258, 68%, 34%)" stop-opacity="0.88"/></linearGradient><linearGradient id="ca-foreign_influence-red" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(352, 94%, 56%, 0.12)"/><stop offset="70%" stop-color="hsl(354, 96%, 62%)"/><stop offset="100%" stop-color="hsl(44, 100%, 86%)"/></linearGradient><linearGradient id="ca-foreign_influence-green" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(148, 92%, 48%, 0.12)"/><stop offset="70%" stop-color="hsl(148, 92%, 58%)"/><stop offset="100%" stop-color="hsl(146, 100%, 88%)"/></linearGradient><linearGradient id="ca-foreign_influence-blue" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(206, 94%, 56%, 0.12)"/><stop offset="70%" stop-color="hsl(204, 96%, 64%)"/><stop offset="100%" stop-color="hsl(194, 100%, 90%)"/></linearGradient><linearGradient id="ca-foreign_influence-violet" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(54, 100%, 94%)"/><stop offset="36%" stop-color="hsl(296, 94%, 70%)" stop-opacity="0.86"/><stop offset="100%" stop-color="hsla(276, 86%, 54%, 0.12)"/></linearGradient>`
  ),
  wreath_of_flame: wrapArtSvg(
    'wreath_of_flame',
    'hsl(292, 60%, 19%)',
    'hsl(334, 58%, 8%)',
    `<circle cx="64" cy="35" r="33" fill="url(#ca-wreath_of_flame-glow)"/>
     <ellipse cx="64" cy="64" rx="28" ry="5.5" fill="rgba(0,0,0,0.52)"/>
     <path d="M64 4 Q71 12 76 7 Q79 16 88 14 Q86 24 96 27 Q89 35 96 44 Q86 46 86 55 Q76 52 72 60 Q64 54 56 60 Q52 52 42 55 Q42 46 32 44 Q39 35 32 27 Q42 24 40 14 Q49 16 52 7 Q57 12 64 4 Z" fill="url(#ca-wreath_of_flame-fire)" stroke="hsl(46, 100%, 78%)" stroke-width="1.2" stroke-linejoin="round"/>
     <circle cx="64" cy="34" r="22" fill="hsl(298, 56%, 14%)" stroke="hsl(48, 100%, 84%)" stroke-width="1.4"/>
     <path d="M64 11 Q69 17 74 14 Q76 21 83 22 Q80 29 86 35 Q80 41 82 48 Q74 47 71 53 Q64 49 57 53 Q54 47 46 48 Q48 41 42 35 Q48 29 45 22 Q52 21 54 14 Q59 17 64 11 Z" fill="none" stroke="hsl(52, 100%, 90%)" stroke-width="1.4" opacity="0.86"/>
     <circle cx="64" cy="34" r="16.5" fill="url(#ca-wreath_of_flame-core)"/>
     <path d="M64 29 Q72 30 74 42 L84 57 Q87 63 77 64 L51 64 Q41 63 44 57 L54 42 Q56 30 64 29 Z" fill="hsl(288, 60%, 8%)" opacity="0.72" transform="translate(1.5,2)"/>
     <path d="M64 29 Q72 30 74 42 L84 57 Q87 63 77 64 L51 64 Q41 63 44 57 L54 42 Q56 30 64 29 Z" fill="url(#ca-wreath_of_flame-robe)" stroke="hsl(44, 96%, 72%)" stroke-width="1.2"/>
     <circle cx="64" cy="23.5" r="5.4" fill="url(#ca-wreath_of_flame-robe)" stroke="hsl(48, 100%, 82%)" stroke-width="1.1"/>
     <path d="M58.5 23 Q64 25 69.5 23" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M53 49 Q64 55 75 49" fill="none" stroke="hsl(46, 100%, 80%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="64" cy="48" r="3" fill="hsl(52, 100%, 92%)" stroke="hsl(32, 100%, 62%)" stroke-width="0.9"/>
     <path d="M22 26 Q28 18 32 10 M106 26 Q100 18 96 10" fill="none" stroke="hsl(334, 96%, 70%)" stroke-width="1.5" stroke-linecap="round" opacity="0.78"/>
     <path d="M20 50 Q26 42 28 34 M108 50 Q102 42 100 34" fill="none" stroke="hsl(42, 100%, 72%)" stroke-width="1.4" stroke-linecap="round" opacity="0.72"/>
     <polygon points="26,18 29,21 26,24 23,21" fill="hsl(50, 100%, 88%)"/>
     <polygon points="102,18 105,21 102,24 99,21" fill="hsl(50, 100%, 88%)"/>
     <circle cx="38" cy="10" r="1.8" fill="hsl(46, 100%, 84%)"/>
     <circle cx="90" cy="10" r="1.8" fill="hsl(342, 100%, 76%)"/>
     <circle cx="24" cy="56" r="1.5" fill="hsl(44, 100%, 80%)"/>
     <circle cx="104" cy="56" r="1.5" fill="hsl(328, 96%, 76%)"/>`,
    'hsla(34, 100%, 60%, 0.32)',
    `<radialGradient id="ca-wreath_of_flame-glow" cx="50%" cy="48%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 90%)" stop-opacity="0.82"/><stop offset="52%" stop-color="hsl(338, 96%, 56%)" stop-opacity="0.38"/><stop offset="100%" stop-color="hsl(292, 70%, 20%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-wreath_of_flame-fire" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(324, 92%, 52%)"/><stop offset="48%" stop-color="hsl(24, 100%, 58%)"/><stop offset="100%" stop-color="hsl(52, 100%, 88%)"/></linearGradient><linearGradient id="ca-wreath_of_flame-robe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(286, 54%, 34%)"/><stop offset="60%" stop-color="hsl(272, 54%, 18%)"/><stop offset="100%" stop-color="hsl(262, 58%, 10%)"/></linearGradient><radialGradient id="ca-wreath_of_flame-core" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="hsl(48, 100%, 84%)" stop-opacity="0.45"/><stop offset="100%" stop-color="hsl(312, 68%, 18%)" stop-opacity="0.92"/></radialGradient>`
  ),
  collect: wrapArtSvg(
    'collect',
    'hsl(268, 52%, 19%)',
    'hsl(246, 52%, 8%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-collect-aura)"/>
     <circle cx="64" cy="36" r="24" fill="none" stroke="hsl(46, 94%, 72%)" stroke-width="1" stroke-dasharray="3 3" opacity="0.58"/>
     <ellipse cx="64" cy="65" rx="22" ry="4.5" fill="rgba(0,0,0,0.52)"/>
     <path d="M52 64 L57 59 H71 L76 64 Z M61 50 H67 L68 59 H60 Z" fill="url(#ca-collect-chalice)" stroke="hsl(36, 86%, 34%)" stroke-width="1.1"/>
     <path d="M48 36 H80 Q79 51 64 52 Q49 51 48 36 Z" fill="hsl(268, 60%, 10%)" opacity="0.65" transform="translate(1.5,2)"/>
     <path d="M48 35 H80 Q79 50 64 51 Q49 50 48 35 Z" fill="url(#ca-collect-chalice)" stroke="hsl(52, 100%, 88%)" stroke-width="1.3"/>
     <ellipse cx="64" cy="35" rx="16" ry="3.4" fill="hsl(52, 100%, 92%)" stroke="hsl(46, 100%, 76%)" stroke-width="1.1"/>
     <path d="M4 50 L26 42 L38 45 L33 52 L6 61 Z" fill="url(#ca-collect-sleeve)" stroke="hsl(292, 76%, 68%)" stroke-width="1.1"/>
     <path d="M26 42 Q34 36 42 40 Q46 43 40 46 L31 48" fill="hsl(34, 48%, 74%)" stroke="hsl(276, 48%, 34%)" stroke-width="1"/>
     <path d="M124 50 L102 42 L90 45 L95 52 L122 61 Z" fill="url(#ca-collect-sleeve)" stroke="hsl(292, 76%, 68%)" stroke-width="1.1"/>
     <path d="M102 42 Q94 36 86 40 Q82 43 88 46 L97 48" fill="hsl(34, 48%, 74%)" stroke="hsl(276, 48%, 34%)" stroke-width="1"/>
     <path d="M30 22 Q46 24 58 34 M98 22 Q82 24 70 34 M64 10 V33" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.4" stroke-dasharray="2.5 2.5" opacity="0.82"/>
     <circle cx="64" cy="14" r="6.2" fill="url(#ca-collect-orb)" stroke="hsl(54, 100%, 95%)" stroke-width="1.1"/>
     <circle cx="40" cy="20" r="5" fill="url(#ca-collect-orb)" stroke="hsl(54, 100%, 94%)" stroke-width="1"/>
     <circle cx="88" cy="20" r="5" fill="url(#ca-collect-orb)" stroke="hsl(54, 100%, 94%)" stroke-width="1"/>
     <circle cx="53" cy="28" r="3.8" fill="url(#ca-collect-orb)" stroke="hsl(54, 100%, 95%)" stroke-width="0.9"/>
     <circle cx="75" cy="28" r="3.8" fill="url(#ca-collect-orb)" stroke="hsl(54, 100%, 95%)" stroke-width="0.9"/>
     <path d="M64 9.5 L65.4 12.6 L68.5 14 L65.4 15.4 L64 18.5 L62.6 15.4 L59.5 14 L62.6 12.6 Z" fill="hsl(56, 100%, 98%)"/>
     <path d="M40 16.5 L41 19 L43.5 20 L41 21 L40 23.5 L39 21 L36.5 20 L39 19 Z M88 16.5 L89 19 L91.5 20 L89 21 L88 23.5 L87 21 L84.5 20 L87 19 Z" fill="hsl(56, 100%, 97%)"/>
     <circle cx="24" cy="30" r="1.5" fill="hsl(48, 100%, 86%)"/>
     <circle cx="104" cy="30" r="1.5" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(46, 100%, 66%, 0.30)',
    `<radialGradient id="ca-collect-aura" cx="50%" cy="44%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)" stop-opacity="0.72"/><stop offset="52%" stop-color="hsl(44, 100%, 62%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(270, 68%, 24%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-collect-chalice" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 88%)"/><stop offset="48%" stop-color="hsl(42, 96%, 58%)"/><stop offset="100%" stop-color="hsl(282, 54%, 34%)"/></linearGradient><radialGradient id="ca-collect-orb" cx="38%" cy="34%" r="62%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="55%" stop-color="hsl(46, 100%, 68%)"/><stop offset="100%" stop-color="hsl(32, 94%, 46%)"/></radialGradient><linearGradient id="ca-collect-sleeve" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(284, 58%, 42%)"/><stop offset="100%" stop-color="hsl(262, 56%, 18%)"/></linearGradient>`
  ),
  study: wrapArtSvg(
    'study',
    'hsl(266, 48%, 18%)',
    'hsl(286, 50%, 7%)',
    `<polygon points="48,14 80,14 112,72 16,72" fill="url(#ca-study-cone)"/>
     <circle cx="64" cy="14" r="24" fill="url(#ca-study-lantern)"/>
     <line x1="64" y1="0" x2="64" y2="6" stroke="hsl(42, 84%, 68%)" stroke-width="1.6"/>
     <rect x="57" y="6" width="14" height="14" rx="4" fill="hsl(46, 100%, 80%)" stroke="hsl(34, 78%, 42%)" stroke-width="1.3"/>
     <path d="M56 7 H72 M56 19 H72 M64 7 V19" stroke="hsl(32, 72%, 34%)" stroke-width="1.1"/>
     <circle cx="64" cy="13" r="3" fill="hsl(56, 100%, 97%)"/>
     <circle cx="64" cy="34" r="20" fill="none" stroke="hsl(48, 96%, 76%)" stroke-width="0.9" stroke-dasharray="2.5 2.5" opacity="0.62"/>
     <polygon points="64,21 76,41 52,41" fill="none" stroke="hsl(296, 92%, 78%)" stroke-width="1" opacity="0.72"/>
     <polygon points="64,45 76,25 52,25" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1" opacity="0.62"/>
     <rect x="13" y="33" width="22" height="26" rx="2" transform="rotate(-12 24 46)" fill="url(#ca-study-scroll)" stroke="hsl(36, 74%, 44%)" stroke-width="1.1"/>
     <line x1="16" y1="41" x2="31" y2="38" stroke="hsl(276, 48%, 34%)" stroke-width="1.1"/>
     <line x1="17" y1="47" x2="32" y2="44" stroke="hsl(276, 48%, 34%)" stroke-width="1.1"/>
     <rect x="93" y="33" width="22" height="26" rx="2" transform="rotate(12 104 46)" fill="url(#ca-study-scroll)" stroke="hsl(36, 74%, 44%)" stroke-width="1.1"/>
     <line x1="97" y1="38" x2="112" y2="41" stroke="hsl(276, 48%, 34%)" stroke-width="1.1"/>
     <line x1="96" y1="44" x2="111" y2="47" stroke="hsl(276, 48%, 34%)" stroke-width="1.1"/>
     <rect x="44" y="35" width="40" height="29" rx="2.5" fill="hsl(274, 58%, 10%)" opacity="0.68" transform="translate(2,2.5)"/>
     <rect x="44" y="34" width="40" height="29" rx="2.5" fill="url(#ca-study-scroll)" stroke="url(#ca-study-gold)" stroke-width="1.4"/>
     <rect x="40" y="32" width="48" height="4.2" rx="2" fill="url(#ca-study-gold)" stroke="hsl(32, 76%, 30%)" stroke-width="0.9"/>
     <rect x="40" y="60.5" width="48" height="4.2" rx="2" fill="url(#ca-study-gold)" stroke="hsl(32, 76%, 30%)" stroke-width="0.9"/>
     <path d="M51 42 H77 M51 47 H73 M51 52 H77 M56 56 H72" stroke="hsl(282, 54%, 30%)" stroke-width="1.3" stroke-linecap="round"/>
     <circle cx="64" cy="49" r="4.2" fill="none" stroke="hsl(318, 86%, 56%)" stroke-width="1.2"/>
     <circle cx="38" cy="21" r="1.5" fill="hsl(52, 100%, 92%)"/>
     <circle cx="90" cy="21" r="1.5" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(40, 96%, 62%, 0.32)',
    `<radialGradient id="ca-study-lantern" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 95%)" stop-opacity="0.92"/><stop offset="48%" stop-color="hsl(42, 100%, 66%)" stop-opacity="0.45"/><stop offset="100%" stop-color="hsl(284, 70%, 24%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-study-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsla(46, 100%, 82%, 0.44)"/><stop offset="65%" stop-color="hsla(42, 92%, 62%, 0.16)"/><stop offset="100%" stop-color="hsla(276, 60%, 20%, 0)"/></linearGradient><linearGradient id="ca-study-scroll" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 72%, 90%)"/><stop offset="60%" stop-color="hsl(40, 56%, 76%)"/><stop offset="100%" stop-color="hsl(32, 46%, 58%)"/></linearGradient><linearGradient id="ca-study-gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(34, 82%, 44%)"/><stop offset="50%" stop-color="hsl(50, 100%, 84%)"/><stop offset="100%" stop-color="hsl(34, 82%, 44%)"/></linearGradient>`
  ),
  omniscience: wrapArtSvg(
    'omniscience',
    'hsl(254, 58%, 17%)',
    'hsl(284, 58%, 7%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-omniscience-aura)"/>
     <polyline points="8,14 24,10 38,18 64,8 90,18 104,10 120,14" fill="none" stroke="hsla(48, 100%, 84%, 0.45)" stroke-width="0.9"/>
     <polyline points="12,60 32,56 64,65 96,56 116,60" fill="none" stroke="hsla(296, 94%, 78%, 0.45)" stroke-width="0.9"/>
     <ellipse cx="64" cy="36" rx="46" ry="24" fill="none" stroke="hsl(48, 96%, 74%)" stroke-width="1" stroke-dasharray="4 3" opacity="0.58"/>
     <ellipse cx="20" cy="36" rx="11" ry="18" fill="url(#ca-omniscience-mirror)" stroke="url(#ca-omniscience-gold)" stroke-width="1.6"/>
     <rect x="15.5" y="29" width="9" height="14" rx="1.2" fill="hsla(52, 100%, 92%, 0.34)" stroke="hsl(52, 100%, 90%)" stroke-width="0.9"/>
     <ellipse cx="108" cy="36" rx="11" ry="18" fill="url(#ca-omniscience-mirror)" stroke="url(#ca-omniscience-gold)" stroke-width="1.6"/>
     <rect x="103.5" y="29" width="9" height="14" rx="1.2" fill="hsla(52, 100%, 92%, 0.34)" stroke="hsl(52, 100%, 90%)" stroke-width="0.9"/>
     <path d="M64 11 V17 M64 55 V61 M46 16 L50 21 M82 16 L78 21 M46 56 L50 51 M82 56 L78 51" stroke="hsl(48, 100%, 84%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M35 37 Q64 15 93 37 Q64 59 35 37 Z" fill="hsl(264, 64%, 9%)" opacity="0.72" transform="translate(1.5,2)"/>
     <path d="M36 36 Q64 14 92 36 Q64 58 36 36 Z" fill="hsl(264, 54%, 18%)" stroke="url(#ca-omniscience-gold)" stroke-width="2"/>
     <circle cx="64" cy="36" r="13.5" fill="url(#ca-omniscience-iris)" stroke="hsl(52, 100%, 90%)" stroke-width="1.3"/>
     <circle cx="64" cy="36" r="9.5" fill="none" stroke="hsla(54, 100%, 96%, 0.65)" stroke-width="0.9" stroke-dasharray="2 2"/>
     <path d="M64 25 L68.5 36 L64 47 L59.5 36 Z" fill="hsl(258, 68%, 10%)"/>
     <path d="M64 30 L65.5 34.5 L70 36 L65.5 37.5 L64 42 L62.5 37.5 L58 36 L62.5 34.5 Z" fill="hsl(54, 100%, 98%)"/>
     <circle cx="24" cy="10" r="1.8" fill="hsl(52, 100%, 92%)"/>
     <circle cx="64" cy="8" r="2.1" fill="hsl(54, 100%, 96%)"/>
     <circle cx="104" cy="10" r="1.8" fill="hsl(52, 100%, 92%)"/>
     <circle cx="32" cy="56" r="1.5" fill="hsl(298, 100%, 84%)"/>
     <circle cx="96" cy="56" r="1.5" fill="hsl(298, 100%, 84%)"/>`,
    'hsla(48, 100%, 68%, 0.34)',
    `<radialGradient id="ca-omniscience-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 94%)" stop-opacity="0.72"/><stop offset="48%" stop-color="hsl(292, 92%, 62%)" stop-opacity="0.32"/><stop offset="100%" stop-color="hsl(258, 68%, 18%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-omniscience-iris" cx="46%" cy="42%" r="58%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="42%" stop-color="hsl(44, 100%, 64%)"/><stop offset="80%" stop-color="hsl(290, 88%, 54%)"/><stop offset="100%" stop-color="hsl(258, 72%, 22%)"/></radialGradient><linearGradient id="ca-omniscience-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 92%)"/><stop offset="52%" stop-color="hsl(42, 96%, 60%)"/><stop offset="100%" stop-color="hsl(292, 74%, 44%)"/></linearGradient><linearGradient id="ca-omniscience-mirror" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(198, 92%, 82%, 0.65)"/><stop offset="55%" stop-color="hsla(276, 68%, 42%, 0.72)"/><stop offset="100%" stop-color="hsla(252, 62%, 18%, 0.92)"/></linearGradient>`
  ),
  wish: wrapArtSvg(
    'wish',
    'hsl(274, 52%, 19%)',
    'hsl(252, 54%, 8%)',
    `<circle cx="64" cy="12" r="22" fill="url(#ca-wish-star)"/>
     <polygon points="64,12 18,48 34,48" fill="hsla(152, 96%, 68%, 0.16)"/>
     <polygon points="64,12 54,44 74,44" fill="hsla(350, 96%, 68%, 0.18)"/>
     <polygon points="64,12 94,48 110,48" fill="hsla(46, 100%, 72%, 0.18)"/>
     <path d="M64 3 L66.5 9.5 L73 12 L66.5 14.5 L64 21 L61.5 14.5 L55 12 L61.5 9.5 Z" fill="hsl(54, 100%, 97%)"/>
     <ellipse cx="26" cy="61" rx="16" ry="3.8" fill="rgba(0,0,0,0.44)"/>
     <ellipse cx="64" cy="63" rx="18" ry="4.2" fill="rgba(0,0,0,0.48)"/>
     <ellipse cx="102" cy="61" rx="16" ry="3.8" fill="rgba(0,0,0,0.44)"/>
     <path d="M12 56 Q19 48 26 55 Q33 48 40 56 Q33 62 26 62 Q19 62 12 56 Z" fill="url(#ca-wish-lotus)" stroke="hsl(152, 94%, 76%)" stroke-width="1"/>
     <path d="M18 39 L26 35 L34 39 V47 Q34 53 26 56 Q18 53 18 47 Z" fill="url(#ca-wish-emerald)" stroke="hsl(148, 100%, 88%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M26 39 V52 M22 44 H30" stroke="hsl(146, 100%, 94%)" stroke-width="1.3" stroke-linecap="round"/>
     <path d="M49 58 Q56 49 64 56 Q72 49 79 58 Q72 64 64 64 Q56 64 49 58 Z" fill="url(#ca-wish-lotus)" stroke="hsl(350, 96%, 76%)" stroke-width="1.1"/>
     <path d="M64 30 Q72 39 71 48 Q70 55 64 56 Q58 55 57 48 Q56 39 64 30 Z" fill="url(#ca-wish-crimson)" stroke="hsl(42, 100%, 82%)" stroke-width="1.2"/>
     <path d="M64 39 Q68 44 67 51 Q64 54 61 51 Q60 44 64 39 Z" fill="hsl(52, 100%, 92%)"/>
     <path d="M88 56 Q95 48 102 55 Q109 48 116 56 Q109 62 102 62 Q95 62 88 56 Z" fill="url(#ca-wish-lotus)" stroke="hsl(48, 100%, 80%)" stroke-width="1"/>
     <ellipse cx="102" cy="52" rx="8.5" ry="3.4" fill="url(#ca-wish-gold)" stroke="hsl(34, 82%, 34%)" stroke-width="1"/>
     <ellipse cx="102" cy="47.5" rx="8.5" ry="3.4" fill="url(#ca-wish-gold)" stroke="hsl(34, 82%, 34%)" stroke-width="1"/>
     <ellipse cx="102" cy="43" rx="8.5" ry="3.4" fill="url(#ca-wish-gold)" stroke="hsl(54, 100%, 92%)" stroke-width="1.1"/>
     <circle cx="44" cy="24" r="1.5" fill="hsl(152, 100%, 86%)"/>
     <circle cx="84" cy="24" r="1.5" fill="hsl(48, 100%, 88%)"/>
     <circle cx="64" cy="25" r="1.4" fill="hsl(352, 100%, 84%)"/>
     <circle cx="16" cy="28" r="1.3" fill="hsl(50, 100%, 90%)"/>
     <circle cx="112" cy="28" r="1.3" fill="hsl(50, 100%, 90%)"/>`,
    'hsla(48, 100%, 72%, 0.32)',
    `<radialGradient id="ca-wish-star" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)" stop-opacity="0.95"/><stop offset="48%" stop-color="hsl(46, 100%, 72%)" stop-opacity="0.46"/><stop offset="100%" stop-color="hsl(276, 70%, 24%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-wish-emerald" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(148, 96%, 76%)"/><stop offset="56%" stop-color="hsl(156, 86%, 44%)"/><stop offset="100%" stop-color="hsl(166, 78%, 22%)"/></linearGradient><linearGradient id="ca-wish-crimson" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(348, 92%, 44%)"/><stop offset="55%" stop-color="hsl(14, 100%, 58%)"/><stop offset="100%" stop-color="hsl(50, 100%, 86%)"/></linearGradient><linearGradient id="ca-wish-gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(36, 88%, 42%)"/><stop offset="48%" stop-color="hsl(52, 100%, 86%)"/><stop offset="100%" stop-color="hsl(34, 86%, 36%)"/></linearGradient><linearGradient id="ca-wish-lotus" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(308, 72%, 72%)"/><stop offset="100%" stop-color="hsl(272, 58%, 28%)"/></linearGradient>`
  ),
  conjure_blade: wrapArtSvg(
    'conjure_blade',
    'hsl(278, 58%, 19%)',
    'hsl(254, 58%, 8%)',
    `<circle cx="64" cy="34" r="32" fill="url(#ca-conjure_blade-aura)"/>
     <path d="M12 22 Q36 10 52 28 Q64 42 78 24 Q94 8 116 20" fill="none" stroke="url(#ca-conjure_blade-vortex)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M16 54 Q40 60 54 42 Q64 28 76 44 Q90 60 112 52" fill="none" stroke="hsl(48, 100%, 76%)" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
     <ellipse cx="64" cy="48" rx="34" ry="8.5" fill="none" stroke="hsl(296, 94%, 74%)" stroke-width="1.3" stroke-dasharray="4 3" opacity="0.78"/>
     <ellipse cx="64" cy="48" rx="22" ry="5.5" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.3" opacity="0.88"/>
     <path d="M64 6 L72 19 L70 49 H58 L56 19 Z" fill="hsl(268, 66%, 10%)" opacity="0.68" transform="translate(2,2)"/>
     <path d="M64 5 L71 18 L69 48 H59 L57 18 Z" fill="url(#ca-conjure_blade-blade)" stroke="hsl(52, 100%, 92%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M64 8 V46" stroke="hsl(56, 100%, 98%)" stroke-width="2" stroke-linecap="round"/>
     <polygon points="48,22 54,18 53,27" fill="hsl(298, 96%, 76%)" stroke="hsl(52, 100%, 92%)" stroke-width="0.8"/>
     <polygon points="80,22 74,18 75,27" fill="hsl(298, 96%, 76%)" stroke="hsl(52, 100%, 92%)" stroke-width="0.8"/>
     <polygon points="44,35 53,33 50,40" fill="hsl(48, 100%, 82%)" opacity="0.9"/>
     <polygon points="84,35 75,33 78,40" fill="hsl(48, 100%, 82%)" opacity="0.9"/>
     <path d="M47 47 Q64 52 81 47 L76 52 Q64 56 52 52 Z" fill="url(#ca-conjure_blade-hilt)" stroke="hsl(52, 100%, 88%)" stroke-width="1.1"/>
     <rect x="61.5" y="52" width="5" height="11" rx="1.4" fill="hsl(280, 52%, 24%)" stroke="hsl(46, 98%, 74%)" stroke-width="1"/>
     <polygon points="64,61 68,65 64,69 60,65" fill="url(#ca-conjure_blade-hilt)" stroke="hsl(54, 100%, 94%)" stroke-width="1"/>
     <circle cx="64" cy="50" r="2.8" fill="hsl(56, 100%, 98%)"/>
     <circle cx="32" cy="28" r="1.8" fill="hsl(304, 100%, 82%)"/>
     <circle cx="96" cy="28" r="1.8" fill="hsl(304, 100%, 82%)"/>
     <circle cx="40" cy="58" r="1.5" fill="hsl(48, 100%, 86%)"/>
     <circle cx="88" cy="58" r="1.5" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(292, 96%, 66%, 0.32)',
    `<radialGradient id="ca-conjure_blade-aura" cx="50%" cy="44%" r="52%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)" stop-opacity="0.72"/><stop offset="48%" stop-color="hsl(296, 94%, 64%)" stop-opacity="0.38"/><stop offset="100%" stop-color="hsl(264, 70%, 20%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-conjure_blade-blade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="44%" stop-color="hsl(298, 94%, 76%)"/><stop offset="100%" stop-color="hsl(266, 78%, 46%)"/></linearGradient><linearGradient id="ca-conjure_blade-hilt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="55%" stop-color="hsl(42, 96%, 58%)"/><stop offset="100%" stop-color="hsl(28, 84%, 34%)"/></linearGradient><linearGradient id="ca-conjure_blade-vortex" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(296, 94%, 70%, 0.14)"/><stop offset="50%" stop-color="hsl(312, 96%, 76%)"/><stop offset="100%" stop-color="hsla(48, 100%, 78%, 0.14)"/></linearGradient>`
  ),
  expunger: wrapArtSvg(
    'expunger',
    'hsl(286, 62%, 18%)',
    'hsl(324, 58%, 7%)',
    `<circle cx="96" cy="20" r="28" fill="url(#ca-expunger-flare)"/>
     <path d="M12 20 Q52 10 92 34 Q68 20 18 32 Z" fill="url(#ca-expunger-wave)" opacity="0.76"/>
     <path d="M24 44 Q66 26 116 44 Q80 38 30 56 Z" fill="url(#ca-expunger-wave)" opacity="0.86"/>
     <path d="M40 62 Q82 48 122 58 Q88 57 46 68 Z" fill="url(#ca-expunger-wave)" opacity="0.68"/>
     <circle cx="33" cy="52" r="16" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.1" stroke-dasharray="3.5 2.5" opacity="0.68"/>
     <path d="M28 53 L103 10 L117 7 L107 20 L34 61 Z" fill="hsl(318, 68%, 10%)" opacity="0.74" transform="translate(2,2.5)"/>
     <path d="M27 51 L102 9 L118 6 L107 19 L33 59 Z" fill="url(#ca-expunger-blade)" stroke="hsl(54, 100%, 94%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M34 53 L111 10" stroke="hsl(56, 100%, 98%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M30 49 L99 11" stroke="hsl(314, 96%, 72%)" stroke-width="1.1" opacity="0.76"/>
     <path d="M18 39 L30 48 L43 62 L35 64 L26 53 L15 46 Z" fill="url(#ca-expunger-hilt)" stroke="hsl(54, 100%, 92%)" stroke-width="1.1" stroke-linejoin="round"/>
     <path d="M14 64 L27 54 L31 58 L18 68 Z" fill="hsl(286, 56%, 24%)" stroke="hsl(46, 98%, 74%)" stroke-width="1.1"/>
     <circle cx="15" cy="66" r="3.4" fill="url(#ca-expunger-hilt)" stroke="hsl(54, 100%, 94%)" stroke-width="1"/>
     <circle cx="31" cy="53" r="3" fill="hsl(56, 100%, 98%)"/>
     <path d="M111 4 L113 10 L119 12 L113 14 L111 20 L109 14 L103 12 L109 10 Z" fill="hsl(56, 100%, 98%)"/>
     <path d="M74 14 L75.5 18 L79.5 19.5 L75.5 21 L74 25 L72.5 21 L68.5 19.5 L72.5 18 Z" fill="hsl(52, 100%, 92%)"/>
     <path d="M96 42 L97.5 46 L101.5 47.5 L97.5 49 L96 53 L94.5 49 L90.5 47.5 L94.5 46 Z" fill="hsl(326, 100%, 82%)"/>
     <circle cx="52" cy="14" r="1.7" fill="hsl(50, 100%, 90%)"/>
     <circle cx="114" cy="34" r="1.9" fill="hsl(48, 100%, 86%)"/>
     <circle cx="68" cy="59" r="1.6" fill="hsl(316, 100%, 82%)"/>`,
    'hsla(50, 100%, 76%, 0.36)',
    `<linearGradient id="ca-expunger-blade" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(296, 86%, 62%)"/><stop offset="46%" stop-color="hsl(46, 100%, 80%)"/><stop offset="100%" stop-color="hsl(56, 100%, 98%)"/></linearGradient><linearGradient id="ca-expunger-wave" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(318, 96%, 66%, 0.1)"/><stop offset="54%" stop-color="hsl(48, 100%, 82%)" stop-opacity="0.88"/><stop offset="100%" stop-color="hsla(332, 96%, 64%, 0.14)"/></linearGradient><linearGradient id="ca-expunger-hilt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 92%)"/><stop offset="56%" stop-color="hsl(42, 98%, 58%)"/><stop offset="100%" stop-color="hsl(28, 84%, 34%)"/></linearGradient><radialGradient id="ca-expunger-flare" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)" stop-opacity="0.92"/><stop offset="46%" stop-color="hsl(44, 100%, 70%)" stop-opacity="0.46"/><stop offset="100%" stop-color="hsl(320, 92%, 48%)" stop-opacity="0"/></radialGradient>`
  ),
  mind_blast: wrapArtSvg(
    'mind_blast',
    'hsl(230, 44%, 19%)',
    'hsl(248, 48%, 8%)',
    `<polygon points="40,28 128,8 128,62 40,40" fill="url(#ca-mind_blast-beam)"/>
     <polygon points="41,31 128,21 128,47 41,37" fill="hsla(210, 100%, 94%, 0.56)"/>
     <line x1="42" y1="34" x2="128" y2="34" stroke="hsl(210, 100%, 98%)" stroke-width="2.6"/>
     <ellipse cx="64" cy="34" rx="5.5" ry="15" fill="none" stroke="hsl(206, 100%, 86%)" stroke-width="1.8" opacity="0.88"/>
     <ellipse cx="86" cy="34" rx="7" ry="21" fill="none" stroke="hsl(228, 94%, 78%)" stroke-width="1.6" opacity="0.78"/>
     <ellipse cx="109" cy="34" rx="8.5" ry="27" fill="none" stroke="hsl(246, 88%, 74%)" stroke-width="1.4" stroke-dasharray="5 3" opacity="0.68"/>
     <path d="M8 68 Q11 49 16 42 Q12 24 24 18 Q35 16 39 29 Q42 36 37 44 Q33 50 35 68 Z" fill="hsl(238, 48%, 10%)" opacity="0.72" transform="translate(2,2)"/>
     <path d="M7 68 Q10 49 15 42 Q11 24 23 18 Q34 16 38 29 Q41 36 36 44 Q32 50 34 68 Z" fill="url(#ca-mind_blast-head)" stroke="hsl(218, 48%, 72%)" stroke-width="1.2"/>
     <path d="M13 28 L17 14 L23 22 L30 11 L34 22 L40 17 L39 30 Q26 33 13 28 Z" fill="url(#ca-mind_blast-crown)" stroke="hsl(214, 100%, 92%)" stroke-width="1.1" stroke-linejoin="round"/>
     <circle cx="38" cy="34" r="11" fill="url(#ca-mind_blast-flare)"/>
     <polygon points="38,29 43,34 38,39 33,34" fill="hsl(206, 100%, 98%)" stroke="hsl(232, 92%, 72%)" stroke-width="1"/>
     <polyline points="48,26 62,21 70,25 88,16 102,20 120,12" fill="none" stroke="hsl(204, 100%, 90%)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
     <polyline points="48,42 64,47 74,43 92,52 106,48 122,56" fill="none" stroke="hsl(236, 100%, 82%)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
     <polygon points="94,12 101,10 99,16" fill="hsl(216, 46%, 78%)" opacity="0.82"/>
     <polygon points="112,56 119,53 116,61" fill="hsl(216, 46%, 78%)" opacity="0.82"/>
     <circle cx="75" cy="14" r="1.6" fill="hsl(204, 100%, 94%)"/>
     <circle cx="118" cy="24" r="1.8" fill="hsl(214, 100%, 94%)"/>
     <circle cx="76" cy="56" r="1.5" fill="hsl(234, 100%, 84%)"/>`,
    'hsla(214, 92%, 74%, 0.32)',
    `<linearGradient id="ca-mind_blast-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(208, 100%, 96%)"/><stop offset="44%" stop-color="hsl(228, 92%, 68%)" stop-opacity="0.78"/><stop offset="100%" stop-color="hsla(252, 86%, 54%, 0.14)"/></linearGradient><linearGradient id="ca-mind_blast-crown" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(212, 48%, 92%)"/><stop offset="52%" stop-color="hsl(224, 34%, 64%)"/><stop offset="100%" stop-color="hsl(238, 42%, 34%)"/></linearGradient><linearGradient id="ca-mind_blast-head" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(226, 32%, 44%)"/><stop offset="100%" stop-color="hsl(238, 42%, 16%)"/></linearGradient><radialGradient id="ca-mind_blast-flare" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(208, 100%, 98%)"/><stop offset="50%" stop-color="hsl(220, 100%, 76%)" stop-opacity="0.62"/><stop offset="100%" stop-color="hsl(244, 88%, 54%)" stop-opacity="0"/></radialGradient>`
  ),
  discovery: wrapArtSvg(
    'discovery',
    'hsl(198, 36%, 18%)',
    'hsl(222, 42%, 8%)',
    `<polygon points="48,38 118,4 128,58 50,45" fill="url(#ca-discovery-cone)"/>
     <path d="M52 56 Q72 48 92 54 Q108 58 126 48 L128 72 L46 72 Z" fill="hsla(188, 72%, 72%, 0.14)"/>
     <rect x="64" y="21" width="16" height="24" rx="2" transform="rotate(-14 72 33)" fill="url(#ca-discovery-card)" stroke="hsl(186, 94%, 84%)" stroke-width="1.2"/>
     <circle cx="72" cy="33" r="3.4" fill="none" stroke="hsl(196, 86%, 46%)" stroke-width="1.1"/>
     <rect x="83" y="16" width="17" height="26" rx="2" fill="hsl(216, 42%, 10%)" opacity="0.56" transform="translate(1.5,2)"/>
     <rect x="83" y="15" width="17" height="26" rx="2" fill="url(#ca-discovery-card)" stroke="hsl(48, 100%, 88%)" stroke-width="1.4"/>
     <path d="M91.5 22 L93 26.5 L97.5 28 L93 29.5 L91.5 34 L90 29.5 L85.5 28 L90 26.5 Z" fill="hsl(42, 96%, 54%)"/>
     <rect x="102" y="22" width="16" height="24" rx="2" transform="rotate(14 110 34)" fill="url(#ca-discovery-card)" stroke="hsl(186, 94%, 84%)" stroke-width="1.2"/>
     <path d="M112 29 A4.5 4.5 0 1 0 112 39 A3.4 3.4 0 1 1 112 29 Z" fill="hsl(214, 62%, 44%)"/>
     <ellipse cx="30" cy="62" rx="22" ry="4.5" fill="rgba(0,0,0,0.48)"/>
     <polygon points="8,54 25,47 28,54 11,61" fill="url(#ca-discovery-brass)" stroke="hsl(30, 70%, 24%)" stroke-width="1.1"/>
     <polygon points="22,46 39,39 43,48 26,55" fill="hsl(24, 42%, 28%)" stroke="hsl(42, 86%, 62%)" stroke-width="1.1"/>
     <polygon points="36,38 50,33 55,44 41,49" fill="url(#ca-discovery-brass)" stroke="hsl(48, 100%, 82%)" stroke-width="1.2"/>
     <line x1="25" y1="47" x2="28" y2="54" stroke="hsl(48, 100%, 84%)" stroke-width="1.6"/>
     <line x1="38" y1="39" x2="42" y2="48" stroke="hsl(48, 100%, 84%)" stroke-width="1.6"/>
     <ellipse cx="52.5" cy="38.5" rx="3.4" ry="5.8" transform="rotate(-22 52.5 38.5)" fill="url(#ca-discovery-lens)" stroke="hsl(186, 100%, 92%)" stroke-width="1.1"/>
     <path d="M62 12 L63.3 15.7 L67 17 L63.3 18.3 L62 22 L60.7 18.3 L57 17 L60.7 15.7 Z" fill="hsl(52, 100%, 92%)"/>
     <circle cx="114" cy="14" r="1.7" fill="hsl(186, 100%, 88%)"/>
     <circle cx="88" cy="49" r="1.5" fill="hsl(48, 100%, 84%)"/>
     <circle cx="64" cy="51" r="1.4" fill="hsl(188, 100%, 86%)"/>`,
    'hsla(42, 92%, 64%, 0.28)',
    `<linearGradient id="ca-discovery-brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(48, 96%, 84%)"/><stop offset="52%" stop-color="hsl(38, 86%, 54%)"/><stop offset="100%" stop-color="hsl(26, 72%, 26%)"/></linearGradient><linearGradient id="ca-discovery-cone" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsla(186, 100%, 86%, 0.68)"/><stop offset="58%" stop-color="hsla(46, 94%, 72%, 0.22)"/><stop offset="100%" stop-color="hsla(198, 76%, 52%, 0.04)"/></linearGradient><linearGradient id="ca-discovery-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(46, 54%, 94%)"/><stop offset="56%" stop-color="hsl(204, 34%, 78%)"/><stop offset="100%" stop-color="hsl(214, 34%, 52%)"/></linearGradient><radialGradient id="ca-discovery-lens" cx="42%" cy="38%" r="60%"><stop offset="0%" stop-color="hsl(182, 100%, 96%)"/><stop offset="65%" stop-color="hsl(188, 96%, 64%)"/><stop offset="100%" stop-color="hsl(206, 82%, 34%)"/></radialGradient>`
  ),
  enlightenment: wrapArtSvg(
    'enlightenment',
    'hsl(214, 34%, 18%)',
    'hsl(40, 36%, 9%)',
    `<circle cx="64" cy="22" r="34" fill="url(#ca-enlightenment-sun)"/>
     <polygon points="64,22 24,0 42,0" fill="hsla(50, 100%, 88%, 0.22)"/>
     <polygon points="64,22 86,0 104,0" fill="hsla(50, 100%, 88%, 0.22)"/>
     <polygon points="64,22 56,0 72,0" fill="hsla(54, 100%, 96%, 0.34)"/>
     <polygon points="64,22 0,24 0,38" fill="hsla(46, 100%, 80%, 0.16)"/>
     <polygon points="64,22 128,24 128,38" fill="hsla(46, 100%, 80%, 0.16)"/>
     <ellipse cx="64" cy="58" rx="40" ry="7.5" fill="none" stroke="url(#ca-enlightenment-ring)" stroke-width="1.3" opacity="0.68"/>
     <ellipse cx="64" cy="49" rx="30" ry="5.8" fill="none" stroke="url(#ca-enlightenment-ring)" stroke-width="1.5" opacity="0.82"/>
     <ellipse cx="64" cy="39" rx="22" ry="4.4" fill="none" stroke="hsl(52, 100%, 90%)" stroke-width="1.3" stroke-dasharray="4 2.5" opacity="0.88"/>
     <ellipse cx="64" cy="64" rx="18" ry="3.8" fill="rgba(0,0,0,0.44)"/>
     <polygon points="64,16 79,39 64,61 49,39" fill="hsl(220, 40%, 10%)" opacity="0.64" transform="translate(2,2)"/>
     <polygon points="64,15 78,38 64,60 50,38" fill="url(#ca-enlightenment-prism)" stroke="hsl(54, 100%, 95%)" stroke-width="1.4" stroke-linejoin="round"/>
     <polygon points="64,15 70,38 64,60 50,38" fill="url(#ca-enlightenment-facet)" opacity="0.72"/>
     <line x1="50" y1="38" x2="78" y2="38" stroke="hsl(54, 100%, 96%)" stroke-width="1.2" opacity="0.85"/>
     <line x1="64" y1="16" x2="64" y2="59" stroke="hsl(56, 100%, 98%)" stroke-width="1.4" opacity="0.9"/>
     <circle cx="64" cy="38" r="4.5" fill="hsl(56, 100%, 98%)"/>
     <path d="M26 22 L27.4 25.6 L31 27 L27.4 28.4 L26 32 L24.6 28.4 L21 27 L24.6 25.6 Z" fill="hsl(52, 100%, 94%)"/>
     <path d="M102 22 L103.4 25.6 L107 27 L103.4 28.4 L102 32 L100.6 28.4 L97 27 L100.6 25.6 Z" fill="hsl(52, 100%, 94%)"/>
     <circle cx="42" cy="48" r="1.6" fill="hsl(50, 100%, 90%)"/>
     <circle cx="86" cy="48" r="1.6" fill="hsl(50, 100%, 90%)"/>
     <circle cx="64" cy="9" r="2.2" fill="hsl(56, 100%, 98%)"/>`,
    'hsla(48, 100%, 72%, 0.34)',
    `<radialGradient id="ca-enlightenment-sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)" stop-opacity="0.92"/><stop offset="46%" stop-color="hsl(46, 100%, 70%)" stop-opacity="0.46"/><stop offset="100%" stop-color="hsl(216, 48%, 22%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-enlightenment-prism" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="48%" stop-color="hsl(198, 52%, 82%)"/><stop offset="100%" stop-color="hsl(218, 38%, 42%)"/></linearGradient><linearGradient id="ca-enlightenment-facet" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="52%" stop-color="hsl(46, 100%, 76%)"/><stop offset="100%" stop-color="hsl(194, 68%, 62%)"/></linearGradient><linearGradient id="ca-enlightenment-ring" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(48, 100%, 84%, 0.2)"/><stop offset="50%" stop-color="hsl(52, 100%, 92%)"/><stop offset="100%" stop-color="hsla(192, 92%, 78%, 0.2)"/></linearGradient>`
  ),
  forethought: wrapArtSvg(
    'forethought',
    'hsl(216, 30%, 19%)',
    'hsl(26, 38%, 8%)',
    `<circle cx="42" cy="34" r="24" fill="url(#ca-forethought-glow)"/>
     <circle cx="42" cy="34" r="21" fill="none" stroke="url(#ca-forethought-bronze)" stroke-width="2.6"/>
     <circle cx="42" cy="34" r="15.5" fill="none" stroke="hsl(42, 86%, 68%)" stroke-width="1.2" stroke-dasharray="3 2.5"/>
     <circle cx="42" cy="34" r="8.5" fill="hsla(216, 40%, 16%, 0.72)" stroke="url(#ca-forethought-bronze)" stroke-width="1.3"/>
     <line x1="21" y1="34" x2="63" y2="34" stroke="hsl(38, 76%, 56%)" stroke-width="1" opacity="0.72"/>
     <line x1="42" y1="13" x2="42" y2="55" stroke="hsl(38, 76%, 56%)" stroke-width="1" opacity="0.72"/>
     <line x1="29" y1="22" x2="55" y2="46" stroke="hsl(50, 100%, 86%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="42" cy="34" r="2.6" fill="hsl(50, 100%, 88%)"/>
     <rect x="86" y="13" width="24" height="3.2" rx="1.2" fill="url(#ca-forethought-bronze)" stroke="hsl(28, 70%, 26%)" stroke-width="0.9"/>
     <rect x="86" y="54" width="24" height="3.2" rx="1.2" fill="url(#ca-forethought-bronze)" stroke="hsl(28, 70%, 26%)" stroke-width="0.9"/>
     <path d="M90 16.5 H106 Q106 30 98 35 Q106 40 106 54 H90 Q90 40 98 35 Q90 30 90 16.5 Z" fill="hsla(202, 54%, 82%, 0.22)" stroke="hsl(192, 82%, 82%)" stroke-width="1.2"/>
     <path d="M92.5 24 H103.5 Q101 31 98 34 Q95 31 92.5 24 Z" fill="url(#ca-forethought-sand)"/>
     <path d="M91.5 53.5 Q98 43 104.5 53.5 Z" fill="url(#ca-forethought-sand)"/>
     <line x1="98" y1="34" x2="98" y2="49" stroke="hsl(48, 100%, 86%)" stroke-width="1.3" stroke-dasharray="1.8 1.5"/>
     <path d="M55 24 Q70 20 71 39" fill="none" stroke="hsl(186, 94%, 74%)" stroke-width="2.1" stroke-linecap="round"/>
     <polygon points="71,44 66.5,36 75.5,36" fill="hsl(184, 100%, 86%)"/>
     <rect x="57" y="46" width="22" height="15" rx="2" fill="hsl(220, 32%, 14%)" stroke="hsl(38, 66%, 54%)" stroke-width="1"/>
     <rect x="60" y="38" width="22" height="16" rx="2" fill="url(#ca-forethought-card)" stroke="hsl(52, 100%, 90%)" stroke-width="1.3"/>
     <line x1="65" y1="44" x2="77" y2="44" stroke="hsl(214, 42%, 34%)" stroke-width="1.2" stroke-linecap="round"/>
     <line x1="65" y1="48" x2="74" y2="48" stroke="hsl(188, 72%, 44%)" stroke-width="1.2" stroke-linecap="round"/>
     <circle cx="72" cy="14" r="1.5" fill="hsl(50, 100%, 88%)"/>
     <circle cx="115" cy="26" r="1.4" fill="hsl(186, 100%, 86%)"/>`,
    'hsla(38, 92%, 62%, 0.28)',
    `<linearGradient id="ca-forethought-bronze" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(46, 92%, 80%)"/><stop offset="52%" stop-color="hsl(34, 78%, 48%)"/><stop offset="100%" stop-color="hsl(24, 68%, 24%)"/></linearGradient><linearGradient id="ca-forethought-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="55%" stop-color="hsl(42, 98%, 64%)"/><stop offset="100%" stop-color="hsl(186, 86%, 54%)"/></linearGradient><linearGradient id="ca-forethought-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 56%, 94%)"/><stop offset="56%" stop-color="hsl(208, 30%, 76%)"/><stop offset="100%" stop-color="hsl(216, 32%, 48%)"/></linearGradient><radialGradient id="ca-forethought-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(42, 96%, 68%)" stop-opacity="0.46"/><stop offset="100%" stop-color="hsl(218, 44%, 16%)" stop-opacity="0"/></radialGradient>`
  ),
  jack_of_all_trades: wrapArtSvg(
    'jack_of_all_trades',
    'hsl(214, 28%, 20%)',
    'hsl(228, 36%, 8%)',
    `<ellipse cx="64" cy="36" rx="46" ry="26" fill="url(#ca-jack_of_all_trades-aura)"/>
     <path d="M22 46 Q24 14 64 14 Q104 14 106 46" fill="none" stroke="hsl(48, 92%, 74%)" stroke-width="1.3" stroke-dasharray="4 3" opacity="0.72"/>
     <path d="M32 52 Q42 26 64 26 Q86 26 96 52" fill="none" stroke="hsl(188, 86%, 72%)" stroke-width="1.1" stroke-dasharray="3 3" opacity="0.58"/>
     <path d="M16 41 L28 28 L31 32 L19 44 Z" fill="url(#ca-jack_of_all_trades-silver)" stroke="hsl(210, 42%, 90%)" stroke-width="1"/>
     <path d="M14 40 L20 46 M12 46 L16 42" stroke="url(#ca-jack_of_all_trades-bronze)" stroke-width="2.1" stroke-linecap="round"/>
     <circle cx="40" cy="20" r="6.8" fill="none" stroke="url(#ca-jack_of_all_trades-silver)" stroke-width="2.4" stroke-dasharray="3.2 1.8"/>
     <circle cx="40" cy="20" r="2.6" fill="hsl(220, 32%, 18%)" stroke="hsl(46, 94%, 74%)" stroke-width="1.1"/>
     <rect x="55" y="10" width="18" height="24" rx="2" fill="hsl(224, 34%, 10%)" opacity="0.58" transform="translate(1.5,2)"/>
     <rect x="55" y="9" width="18" height="24" rx="2" fill="url(#ca-jack_of_all_trades-card)" stroke="hsl(48, 100%, 88%)" stroke-width="1.3"/>
     <polygon points="64,15 69,21 64,27 59,21" fill="hsl(186, 92%, 58%)" stroke="hsl(52, 100%, 92%)" stroke-width="0.9"/>
     <path d="M81 15 L88 12 L95 15 V22 Q95 27 88 30 Q81 27 81 22 Z" fill="url(#ca-jack_of_all_trades-silver)" stroke="hsl(46, 94%, 76%)" stroke-width="1.1" stroke-linejoin="round"/>
     <line x1="88" y1="14" x2="88" y2="28" stroke="hsl(214, 42%, 34%)" stroke-width="1.1"/>
     <rect x="102" y="29" width="5" height="4" rx="1" fill="url(#ca-jack_of_all_trades-bronze)"/>
     <circle cx="104.5" cy="39" r="6.2" fill="hsl(182, 86%, 54%)" stroke="hsl(206, 86%, 88%)" stroke-width="1.2"/>
     <path d="M100 39 Q104.5 36 109 39 Q108 44 104.5 44 Q101 44 100 39 Z" fill="hsl(46, 100%, 74%)" opacity="0.86"/>
     <path d="M26 67 L37 54 L51 56 L45 68 Z" fill="hsl(224, 24%, 22%)" stroke="hsl(210, 34%, 68%)" stroke-width="1.1"/>
     <path d="M37 54 Q44 47 50 51 Q54 53 49 57 L41 59" fill="hsl(212, 26%, 72%)" stroke="hsl(222, 32%, 28%)" stroke-width="1"/>
     <path d="M102 67 L91 54 L77 56 L83 68 Z" fill="hsl(224, 24%, 22%)" stroke="hsl(210, 34%, 68%)" stroke-width="1.1"/>
     <path d="M91 54 Q84 47 78 51 Q74 53 79 57 L87 59" fill="hsl(212, 26%, 72%)" stroke="hsl(222, 32%, 28%)" stroke-width="1"/>
     <path d="M64 41 L65.5 45 L69.5 46.5 L65.5 48 L64 52 L62.5 48 L58.5 46.5 L62.5 45 Z" fill="hsl(52, 100%, 92%)"/>
     <circle cx="24" cy="18" r="1.5" fill="hsl(48, 100%, 88%)"/>
     <circle cx="104" cy="18" r="1.5" fill="hsl(186, 100%, 86%)"/>`,
    'hsla(192, 74%, 66%, 0.28)',
    `<linearGradient id="ca-jack_of_all_trades-silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(210, 42%, 94%)"/><stop offset="52%" stop-color="hsl(214, 22%, 68%)"/><stop offset="100%" stop-color="hsl(222, 26%, 34%)"/></linearGradient><linearGradient id="ca-jack_of_all_trades-bronze" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 96%, 82%)"/><stop offset="56%" stop-color="hsl(34, 82%, 48%)"/><stop offset="100%" stop-color="hsl(24, 70%, 24%)"/></linearGradient><linearGradient id="ca-jack_of_all_trades-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 60%, 94%)"/><stop offset="60%" stop-color="hsl(210, 28%, 78%)"/><stop offset="100%" stop-color="hsl(218, 30%, 50%)"/></linearGradient><radialGradient id="ca-jack_of_all_trades-aura" cx="50%" cy="46%" r="52%"><stop offset="0%" stop-color="hsl(188, 92%, 72%)" stop-opacity="0.34"/><stop offset="60%" stop-color="hsl(44, 92%, 64%)" stop-opacity="0.14"/><stop offset="100%" stop-color="hsl(222, 42%, 14%)" stop-opacity="0"/></radialGradient>`
  ),
  madness: wrapArtSvg(
    'madness',
    'hsl(296, 48%, 16%)',
    'hsl(344, 52%, 7%)',
    `<circle cx="64" cy="36" r="35" fill="url(#ca-madness-vortex)"/>
     <path d="M64 36 C74 30 78 44 64 49 C48 54 41 34 54 22 C70 10 92 22 88 44 C84 64 52 68 36 52 C20 36 28 10 56 6 C86 2 110 22 106 48" fill="none" stroke="hsl(334, 96%, 64%)" stroke-width="2.2" stroke-linecap="round" opacity="0.82"/>
     <path d="M64 36 C54 42 50 28 64 23 C80 18 87 38 74 50 C58 62 36 50 40 28 C44 8 76 4 92 20 C108 36 100 62 72 66" fill="none" stroke="hsl(288, 92%, 72%)" stroke-width="1.6" stroke-linecap="round" opacity="0.72"/>
     <polygon points="10,12 28,20 18,32 6,24" fill="url(#ca-madness-shard)" stroke="hsl(340, 96%, 70%)" stroke-width="0.9"/>
     <polygon points="116,14 102,24 114,34 124,22" fill="url(#ca-madness-shard)" stroke="hsl(292, 92%, 74%)" stroke-width="0.9"/>
     <polygon points="16,54 32,48 28,64 12,62" fill="url(#ca-madness-shard)" stroke="hsl(334, 92%, 68%)" stroke-width="0.9"/>
     <polygon points="108,52 120,60 104,66 98,56" fill="url(#ca-madness-shard)" stroke="hsl(288, 92%, 72%)" stroke-width="0.9"/>
     <polyline points="6,6 24,18 20,26 42,34" fill="none" stroke="url(#ca-madness-bolt)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
     <polyline points="122,8 102,20 107,28 84,36" fill="none" stroke="url(#ca-madness-bolt)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
     <polyline points="18,68 38,52 46,56 60,44" fill="none" stroke="hsl(344, 100%, 74%)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
     <polyline points="114,68 92,50 84,54 70,44" fill="none" stroke="hsl(296, 100%, 78%)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M46 35 Q64 21 82 35 Q64 51 46 35 Z" fill="hsl(338, 66%, 10%)" opacity="0.78" transform="translate(1.5,2)"/>
     <path d="M46 34 Q64 20 82 34 Q64 50 46 34 Z" fill="url(#ca-madness-eye)" stroke="hsl(344, 100%, 74%)" stroke-width="1.6"/>
     <circle cx="64" cy="34" r="6.8" fill="hsl(348, 96%, 48%)" stroke="hsl(296, 86%, 24%)" stroke-width="1.2"/>
     <polygon points="64,29 66.5,33 65,39 62.5,35 61.5,31" fill="hsl(280, 68%, 8%)"/>
     <circle cx="61.5" cy="31.5" r="1.6" fill="hsl(48, 100%, 94%)"/>
     <path d="M22 39 Q32 31 42 40 Q32 48 22 39 Z" fill="url(#ca-madness-eye)" stroke="hsl(294, 96%, 72%)" stroke-width="1.2"/>
     <circle cx="32" cy="39.5" r="3.4" fill="hsl(288, 72%, 14%)"/>
     <circle cx="31" cy="38.5" r="1.1" fill="hsl(52, 100%, 96%)"/>
     <path d="M86 28 Q96 20 106 29 Q96 37 86 28 Z" fill="url(#ca-madness-eye)" stroke="hsl(346, 98%, 72%)" stroke-width="1.2"/>
     <circle cx="96" cy="28.5" r="3.4" fill="hsl(344, 82%, 14%)"/>
     <circle cx="95" cy="27.5" r="1.1" fill="hsl(52, 100%, 96%)"/>`,
    'hsla(334, 96%, 56%, 0.30)',
    `<radialGradient id="ca-madness-vortex" cx="50%" cy="50%" r="52%"><stop offset="0%" stop-color="hsl(344, 96%, 54%)" stop-opacity="0.72"/><stop offset="48%" stop-color="hsl(296, 84%, 38%)" stop-opacity="0.46"/><stop offset="100%" stop-color="hsl(280, 64%, 10%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-madness-eye" cx="46%" cy="44%" r="58%"><stop offset="0%" stop-color="hsl(50, 90%, 95%)"/><stop offset="62%" stop-color="hsl(338, 86%, 82%)"/><stop offset="100%" stop-color="hsl(338, 88%, 54%)"/></radialGradient><linearGradient id="ca-madness-bolt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 94%)"/><stop offset="50%" stop-color="hsl(342, 100%, 72%)"/><stop offset="100%" stop-color="hsl(292, 96%, 68%)"/></linearGradient><linearGradient id="ca-madness-shard" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(312, 42%, 34%)"/><stop offset="100%" stop-color="hsl(286, 54%, 12%)"/></linearGradient>`
  ),
  panic_button: wrapArtSvg(
    'panic_button',
    'hsl(218, 22%, 18%)',
    'hsl(352, 34%, 8%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-panic_button-glow)"/>
     <path d="M38 18 A28 24 0 0 1 90 18" fill="none" stroke="hsl(356, 100%, 66%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M28 13 A39 32 0 0 1 100 13" fill="none" stroke="hsl(38, 100%, 68%)" stroke-width="1.6" stroke-dasharray="6 4" stroke-linecap="round" opacity="0.86"/>
     <path d="M18 28 Q22 20 28 16 M110 28 Q106 20 100 16" fill="none" stroke="hsl(356, 98%, 68%)" stroke-width="1.8" stroke-linecap="round"/>
     <rect x="10" y="54" width="108" height="14" rx="2" fill="hsl(220, 18%, 16%)" stroke="hsl(214, 18%, 46%)" stroke-width="1.2"/>
     <path d="M16 68 L24 54 H33 L25 68 Z M40 68 L48 54 H57 L49 68 Z M71 68 L79 54 H88 L80 68 Z M95 68 L103 54 H112 L104 68 Z" fill="hsl(44, 96%, 56%)" opacity="0.86"/>
     <polygon points="32,33 96,33 106,57 22,57" fill="hsl(220, 22%, 10%)" opacity="0.72" transform="translate(2,2)"/>
     <polygon points="32,32 96,32 105,56 23,56" fill="url(#ca-panic_button-steel)" stroke="hsl(212, 22%, 74%)" stroke-width="1.3" stroke-linejoin="round"/>
     <circle cx="34" cy="51" r="2" fill="hsl(214, 24%, 76%)" stroke="hsl(222, 24%, 22%)" stroke-width="0.9"/>
     <circle cx="94" cy="51" r="2" fill="hsl(214, 24%, 76%)" stroke="hsl(222, 24%, 22%)" stroke-width="0.9"/>
     <circle cx="38" cy="36" r="1.8" fill="hsl(214, 24%, 76%)" stroke="hsl(222, 24%, 22%)" stroke-width="0.9"/>
     <circle cx="90" cy="36" r="1.8" fill="hsl(214, 24%, 76%)" stroke="hsl(222, 24%, 22%)" stroke-width="0.9"/>
     <ellipse cx="64" cy="44" rx="24" ry="9" fill="hsl(222, 24%, 12%)" stroke="hsl(216, 18%, 54%)" stroke-width="1.3"/>
     <path d="M44 43 Q44 22 64 22 Q84 22 84 43 Q64 50 44 43 Z" fill="url(#ca-panic_button-red)" stroke="hsl(8, 100%, 84%)" stroke-width="1.3"/>
     <path d="M51 31 Q57 25 68 26" fill="none" stroke="hsla(14, 100%, 96%, 0.82)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M64 29 V37 M64 40 V41.5" stroke="hsl(48, 100%, 94%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M32 34 L16 14 L38 8 L46 31 Z" fill="url(#ca-panic_button-glass)" stroke="hsla(204, 86%, 88%, 0.72)" stroke-width="1.1"/>
     <line x1="22" y1="17" x2="36" y2="13" stroke="hsla(0, 0%, 100%, 0.65)" stroke-width="1.2" stroke-linecap="round"/>
     <circle cx="110" cy="18" r="1.8" fill="hsl(44, 100%, 82%)"/>
     <circle cx="18" cy="39" r="1.6" fill="hsl(356, 100%, 74%)"/>`,
    'hsla(356, 98%, 56%, 0.32)',
    `<linearGradient id="ca-panic_button-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 18%, 62%)"/><stop offset="52%" stop-color="hsl(218, 18%, 34%)"/><stop offset="100%" stop-color="hsl(222, 22%, 18%)"/></linearGradient><radialGradient id="ca-panic_button-red" cx="42%" cy="32%" r="64%"><stop offset="0%" stop-color="hsl(14, 100%, 82%)"/><stop offset="44%" stop-color="hsl(356, 98%, 54%)"/><stop offset="100%" stop-color="hsl(346, 90%, 24%)"/></radialGradient><radialGradient id="ca-panic_button-glow" cx="50%" cy="46%" r="50%"><stop offset="0%" stop-color="hsl(356, 100%, 62%)" stop-opacity="0.72"/><stop offset="56%" stop-color="hsl(12, 98%, 52%)" stop-opacity="0.24"/><stop offset="100%" stop-color="hsl(220, 30%, 12%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-panic_button-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(204, 84%, 92%, 0.42)"/><stop offset="100%" stop-color="hsla(212, 42%, 62%, 0.12)"/></linearGradient>`
  ),
  purity: wrapArtSvg(
    'purity',
    'hsl(206, 28%, 20%)',
    'hsl(222, 36%, 9%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-purity-halo)"/>
     <polygon points="44,0 84,0 96,72 32,72" fill="url(#ca-purity-beam)"/>
     <polygon points="55,0 73,0 78,72 50,72" fill="url(#ca-purity-core)"/>
     <ellipse cx="64" cy="54" rx="30" ry="6.5" fill="none" stroke="hsl(48, 86%, 92%)" stroke-width="1.3" opacity="0.78"/>
     <ellipse cx="64" cy="36" rx="22" ry="5" fill="none" stroke="hsl(192, 92%, 88%)" stroke-width="1.2" stroke-dasharray="4 2.5" opacity="0.78"/>
     <polygon points="8,62 28,44 38,54 22,68" fill="url(#ca-purity-curse)" stroke="hsl(282, 54%, 44%)" stroke-width="1.1"/>
     <polygon points="18,36 39,28 44,39 24,45" fill="url(#ca-purity-curse)" stroke="hsl(286, 56%, 48%)" stroke-width="1"/>
     <polygon points="120,60 98,43 90,54 106,68" fill="url(#ca-purity-curse)" stroke="hsl(282, 54%, 44%)" stroke-width="1.1"/>
     <polygon points="110,34 89,27 84,38 104,44" fill="url(#ca-purity-curse)" stroke="hsl(286, 56%, 48%)" stroke-width="1"/>
     <polygon points="41,45 48,40 49,49 43,51" fill="hsl(46, 62%, 88%)" stroke="hsl(0, 0%, 100%)" stroke-width="0.9" opacity="0.9"/>
     <polygon points="87,45 80,40 79,49 85,51" fill="hsl(46, 62%, 88%)" stroke="hsl(0, 0%, 100%)" stroke-width="0.9" opacity="0.9"/>
     <path d="M46 58 Q56 42 54 18 M82 58 Q72 42 74 18" fill="none" stroke="hsl(52, 100%, 96%)" stroke-width="1.5" stroke-linecap="round" opacity="0.82"/>
     <path d="M64 14 L66.2 21.8 L74 24 L66.2 26.2 L64 34 L61.8 26.2 L54 24 L61.8 21.8 Z" fill="hsl(0, 0%, 100%)"/>
     <path d="M42 20 L43.3 23.7 L47 25 L43.3 26.3 L42 30 L40.7 26.3 L37 25 L40.7 23.7 Z" fill="hsl(52, 100%, 96%)"/>
     <path d="M86 20 L87.3 23.7 L91 25 L87.3 26.3 L86 30 L84.7 26.3 L81 25 L84.7 23.7 Z" fill="hsl(52, 100%, 96%)"/>
     <circle cx="54" cy="48" r="2.2" fill="hsl(0, 0%, 100%)"/>
     <circle cx="74" cy="46" r="2" fill="hsl(0, 0%, 100%)"/>
     <circle cx="64" cy="59" r="2.4" fill="hsl(52, 100%, 96%)"/>
     <circle cx="34" cy="14" r="1.5" fill="hsl(192, 100%, 92%)"/>
     <circle cx="94" cy="14" r="1.5" fill="hsl(192, 100%, 92%)"/>`,
    'hsla(48, 86%, 88%, 0.34)',
    `<linearGradient id="ca-purity-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsla(52, 100%, 98%, 0.88)"/><stop offset="58%" stop-color="hsla(198, 72%, 90%, 0.44)"/><stop offset="100%" stop-color="hsla(210, 62%, 76%, 0.08)"/></linearGradient><linearGradient id="ca-purity-core" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsla(0, 0%, 100%, 0.96)"/><stop offset="65%" stop-color="hsla(50, 92%, 94%, 0.68)"/><stop offset="100%" stop-color="hsla(192, 82%, 88%, 0.12)"/></linearGradient><linearGradient id="ca-purity-curse" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(276, 36%, 24%)"/><stop offset="100%" stop-color="hsl(258, 44%, 10%)"/></linearGradient><radialGradient id="ca-purity-halo" cx="50%" cy="38%" r="52%"><stop offset="0%" stop-color="hsl(0, 0%, 100%)" stop-opacity="0.62"/><stop offset="56%" stop-color="hsl(194, 86%, 82%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(216, 44%, 18%)" stop-opacity="0"/></radialGradient>`
  ),
  chrysalis: wrapArtSvg(
    'chrysalis',
    'hsl(194, 42%, 17%)',
    'hsl(224, 46%, 8%)',
    `<circle cx="64" cy="38" r="32" fill="url(#ca-chrysalis-glow)"/>
     <path d="M22 6 Q64 13 106 5" fill="none" stroke="hsl(32, 34%, 34%)" stroke-width="2.6" stroke-linecap="round"/>
     <line x1="64" y1="9" x2="64" y2="19" stroke="hsl(182, 74%, 82%)" stroke-width="1.3"/>
     <path d="M58 34 Q36 12 14 19 Q10 34 26 42 Q16 52 28 60 Q46 60 58 46 Z" fill="url(#ca-chrysalis-wing)" stroke="hsl(182, 100%, 88%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M70 34 Q92 12 114 19 Q118 34 102 42 Q112 52 100 60 Q82 60 70 46 Z" fill="url(#ca-chrysalis-wing)" stroke="hsl(182, 100%, 88%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M55 36 Q38 24 22 25 M55 41 Q38 38 26 42 M56 44 Q42 50 32 55" fill="none" stroke="hsla(52, 100%, 92%, 0.72)" stroke-width="1" stroke-linecap="round"/>
     <path d="M73 36 Q90 24 106 25 M73 41 Q90 38 102 42 M72 44 Q86 50 96 55" fill="none" stroke="hsla(52, 100%, 92%, 0.72)" stroke-width="1" stroke-linecap="round"/>
     <circle cx="30" cy="28" r="3.4" fill="hsl(48, 100%, 84%)" stroke="hsl(186, 100%, 94%)" stroke-width="0.9"/>
     <circle cx="98" cy="28" r="3.4" fill="hsl(48, 100%, 84%)" stroke="hsl(186, 100%, 94%)" stroke-width="0.9"/>
     <circle cx="36" cy="51" r="2.4" fill="hsl(176, 100%, 86%)"/>
     <circle cx="92" cy="51" r="2.4" fill="hsl(176, 100%, 86%)"/>
     <path d="M64 19 Q77 25 75 43 Q73 59 64 65 Q55 59 53 43 Q51 25 64 19 Z" fill="hsl(214, 48%, 10%)" opacity="0.68" transform="translate(1.5,2)"/>
     <path d="M64 18 Q76 24 74 42 Q72 58 64 64 Q56 58 54 42 Q52 24 64 18 Z" fill="url(#ca-chrysalis-cocoon)" stroke="hsl(186, 86%, 84%)" stroke-width="1.3"/>
     <path d="M55 30 Q64 33 73 30 M54 40 Q64 43 74 40 M56 50 Q64 53 72 50" fill="none" stroke="hsla(186, 92%, 90%, 0.56)" stroke-width="1.1"/>
     <polygon points="64,20 67.5,36 64,61 60.5,36" fill="url(#ca-chrysalis-crack)"/>
     <polyline points="64,22 62,32 66,41 63,51 64,60" fill="none" stroke="hsl(54, 100%, 98%)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="22" cy="12" r="1.6" fill="hsl(178, 100%, 88%)"/>
     <circle cx="106" cy="12" r="1.6" fill="hsl(178, 100%, 88%)"/>
     <circle cx="48" cy="14" r="1.4" fill="hsl(50, 100%, 90%)"/>
     <circle cx="80" cy="14" r="1.4" fill="hsl(50, 100%, 90%)"/>`,
    'hsla(176, 94%, 66%, 0.32)',
    `<radialGradient id="ca-chrysalis-glow" cx="50%" cy="50%" r="52%"><stop offset="0%" stop-color="hsl(174, 100%, 90%)" stop-opacity="0.72"/><stop offset="52%" stop-color="hsl(186, 92%, 56%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(220, 56%, 16%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-chrysalis-cocoon" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(186, 62%, 82%)"/><stop offset="54%" stop-color="hsl(198, 46%, 46%)"/><stop offset="100%" stop-color="hsl(216, 48%, 22%)"/></linearGradient><linearGradient id="ca-chrysalis-wing" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(176, 96%, 84%, 0.78)"/><stop offset="55%" stop-color="hsla(198, 86%, 64%, 0.46)"/><stop offset="100%" stop-color="hsla(246, 68%, 54%, 0.24)"/></linearGradient><linearGradient id="ca-chrysalis-crack" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="50%" stop-color="hsl(174, 100%, 82%)"/><stop offset="100%" stop-color="hsl(48, 100%, 84%)"/></linearGradient>`
  ),
  secret_technique: wrapArtSvg(
    'secret_technique',
    'hsl(216, 30%, 19%)',
    'hsl(198, 42%, 8%)',
    `<polygon points="28,44 100,44 114,8 14,8" fill="url(#ca-secret_technique-holo)"/>
     <ellipse cx="64" cy="64" rx="44" ry="5" fill="rgba(0,0,0,0.48)"/>
     <rect x="24" y="38" width="80" height="24" rx="2.5" fill="hsl(218, 38%, 10%)" opacity="0.68" transform="translate(2,2)"/>
     <rect x="24" y="37" width="80" height="24" rx="2.5" fill="url(#ca-secret_technique-scroll)" stroke="hsl(210, 34%, 82%)" stroke-width="1.3"/>
     <rect x="17" y="34" width="8.5" height="30" rx="3" fill="url(#ca-secret_technique-metal)" stroke="hsl(46, 92%, 74%)" stroke-width="1.1"/>
     <rect x="102.5" y="34" width="8.5" height="30" rx="3" fill="url(#ca-secret_technique-metal)" stroke="hsl(46, 92%, 74%)" stroke-width="1.1"/>
     <circle cx="34" cy="51" r="5.5" fill="url(#ca-secret_technique-seal)" stroke="hsl(46, 100%, 82%)" stroke-width="1"/>
     <polyline points="31,48 34,51 37,54" fill="none" stroke="hsl(52, 100%, 94%)" stroke-width="1.2" stroke-linecap="round"/>
     <line x1="45" y1="45" x2="94" y2="45" stroke="hsl(212, 34%, 38%)" stroke-width="1.2" stroke-dasharray="6 3"/>
     <line x1="45" y1="51" x2="88" y2="51" stroke="hsl(192, 68%, 44%)" stroke-width="1.2"/>
     <line x1="45" y1="56" x2="76" y2="56" stroke="hsl(212, 34%, 38%)" stroke-width="1.1"/>
     <circle cx="64" cy="23" r="14" fill="none" stroke="hsl(186, 96%, 76%)" stroke-width="1.2" stroke-dasharray="3.5 2.5"/>
     <path d="M58 19 V14 A6 6 0 0 1 70 14 V16" fill="none" stroke="hsl(50, 100%, 86%)" stroke-width="2.1" stroke-linecap="round"/>
     <rect x="56.5" y="19" width="15" height="11.5" rx="2" fill="hsla(204, 62%, 20%, 0.86)" stroke="hsl(186, 100%, 86%)" stroke-width="1.3"/>
     <circle cx="64" cy="23.8" r="1.9" fill="hsl(52, 100%, 94%)"/>
     <line x1="64" y1="25.2" x2="64" y2="28.2" stroke="hsl(52, 100%, 94%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M26 29 Q38 17 48 21" fill="none" stroke="hsl(186, 96%, 78%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="51,22 44,18 45,25" fill="hsl(186, 100%, 90%)"/>
     <path d="M102 29 Q90 17 80 21" fill="none" stroke="hsl(186, 96%, 78%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="77,22 84,18 83,25" fill="hsl(186, 100%, 90%)"/>
     <circle cx="28" cy="14" r="1.6" fill="hsl(186, 100%, 88%)"/>
     <circle cx="100" cy="14" r="1.6" fill="hsl(50, 100%, 90%)"/>`,
    'hsla(186, 92%, 66%, 0.30)',
    `<linearGradient id="ca-secret_technique-scroll" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(210, 32%, 90%)"/><stop offset="56%" stop-color="hsl(212, 24%, 72%)"/><stop offset="100%" stop-color="hsl(218, 28%, 48%)"/></linearGradient><linearGradient id="ca-secret_technique-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(218, 26%, 32%)"/><stop offset="48%" stop-color="hsl(208, 36%, 82%)"/><stop offset="100%" stop-color="hsl(220, 28%, 24%)"/></linearGradient><linearGradient id="ca-secret_technique-holo" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsla(186, 100%, 74%, 0.42)"/><stop offset="56%" stop-color="hsla(194, 92%, 64%, 0.16)"/><stop offset="100%" stop-color="hsla(210, 82%, 52%, 0)"/></linearGradient><radialGradient id="ca-secret_technique-seal" cx="40%" cy="35%" r="62%"><stop offset="0%" stop-color="hsl(10, 96%, 68%)"/><stop offset="60%" stop-color="hsl(352, 86%, 44%)"/><stop offset="100%" stop-color="hsl(344, 78%, 22%)"/></radialGradient>`
  ),
};
