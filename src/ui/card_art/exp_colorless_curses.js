// Bespoke 16:9 SVG card illustrations for Expansion Colorless Rare/Event Special (8) & Curse (10) cards.
import { wrapArtSvg } from './wrap.js';

export const EXP_COLORLESS_CURSES_ART = {
  secret_weapon: wrapArtSvg(
    'secret_weapon',
    'hsl(222, 34%, 17%)',
    'hsl(238, 38%, 7%)',
    `<ellipse cx="64" cy="36" rx="48" ry="28" fill="url(#ca-secret_weapon-beam)"/>
     <polygon points="34,42 74,42 108,0 44,0" fill="url(#ca-secret_weapon-beam)" opacity="0.62"/>
     <ellipse cx="46" cy="64" rx="34" ry="5.5" fill="rgba(0,0,0,0.52)"/>
     <polygon points="16,44 68,44 74,63 22,63" fill="url(#ca-secret_weapon-chest)" stroke="url(#ca-secret_weapon-gold)" stroke-width="1.4" stroke-linejoin="round"/>
     <polygon points="16,44 26,22 66,20 58,41" fill="hsl(228, 34%, 13%)" stroke="url(#ca-secret_weapon-gold)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M21 44 L25 63 M61 44 L66 63 M34 22 L29 42 M52 21 L47 41" stroke="url(#ca-secret_weapon-gold)" stroke-width="2" stroke-linecap="round"/>
     <rect x="40" y="48" width="9" height="8" rx="1.2" fill="url(#ca-secret_weapon-gold)" stroke="hsl(228, 38%, 12%)" stroke-width="0.9"/>
     <circle cx="44.5" cy="51.6" r="1.4" fill="hsl(228, 42%, 10%)"/>
     <polygon points="22,42 66,42 63,46 25,46" fill="hsl(188, 96%, 72%)" opacity="0.55"/>
     <polygon points="50,48 108,8 117,7 110,17 57,54" fill="rgba(0,0,0,0.44)" transform="translate(2 2)"/>
     <polygon points="49,47 108,8 117,7 110,17 56,53" fill="url(#ca-secret_weapon-blade)" stroke="hsl(192, 96%, 88%)" stroke-width="1.2" stroke-linejoin="round"/>
     <line x1="56" y1="47" x2="109" y2="12" stroke="hsl(186, 100%, 76%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M68 39 L73 36 M78 32 L83 29 M88 25 L93 22 M98 18 L103 15" stroke="hsl(52, 100%, 94%)" stroke-width="1.3" stroke-linecap="round"/>
     <path d="M40 39 L52 47 L63 59 L59 63 L49 52 L36 43 Z" fill="url(#ca-secret_weapon-gold)" stroke="hsl(28, 70%, 20%)" stroke-width="1"/>
     <line x1="35" y1="60" x2="50" y2="50" stroke="hsl(226, 26%, 22%)" stroke-width="4.4" stroke-linecap="round"/>
     <circle cx="34" cy="61" r="3" fill="url(#ca-secret_weapon-gold)" stroke="hsl(188, 100%, 84%)" stroke-width="0.9"/>
     <path d="M111 6 L113 11 L118 13 L113 15 L111 20 L109 15 L104 13 L109 11 Z" fill="hsl(54, 100%, 94%)"/>
     <path d="M84 44 L85.5 47.5 L89 49 L85.5 50.5 L84 54 L82.5 50.5 L79 49 L82.5 47.5 Z" fill="hsl(186, 100%, 86%)"/>
     <circle cx="94" cy="34" r="1.6" fill="hsl(48, 100%, 84%)"/>
     <circle cx="76" cy="14" r="1.4" fill="hsl(186, 100%, 86%)"/>`,
    'hsla(44, 96%, 62%, 0.28)',
    `<radialGradient id="ca-secret_weapon-beam" cx="56%" cy="46%" r="54%"><stop offset="0%" stop-color="hsla(186, 100%, 80%, 0.44)"/><stop offset="48%" stop-color="hsla(44, 96%, 62%, 0.22)"/><stop offset="100%" stop-color="hsla(224, 52%, 14%, 0)"/></radialGradient><linearGradient id="ca-secret_weapon-chest" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(224, 24%, 28%)"/><stop offset="55%" stop-color="hsl(230, 28%, 16%)"/><stop offset="100%" stop-color="hsl(236, 36%, 9%)"/></linearGradient><linearGradient id="ca-secret_weapon-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 86%)"/><stop offset="50%" stop-color="hsl(42, 92%, 54%)"/><stop offset="100%" stop-color="hsl(28, 76%, 28%)"/></linearGradient><linearGradient id="ca-secret_weapon-blade" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(214, 24%, 46%)"/><stop offset="52%" stop-color="hsl(204, 54%, 84%)"/><stop offset="100%" stop-color="hsl(186, 100%, 96%)"/></linearGradient>`
  ),
  transmutation: wrapArtSvg(
    'transmutation',
    'hsl(214, 42%, 17%)',
    'hsl(268, 44%, 8%)',
    `<circle cx="62" cy="36" r="30" fill="url(#ca-transmutation-core)"/>
     <circle cx="62" cy="36" r="26" fill="none" stroke="url(#ca-transmutation-gold)" stroke-width="1.8"/>
     <circle cx="62" cy="36" r="21" fill="none" stroke="hsla(46, 100%, 78%, 0.65)" stroke-width="1.1" stroke-dasharray="3.5 2.5"/>
     <polygon points="62,11 84,48 40,48" fill="none" stroke="url(#ca-transmutation-gold)" stroke-width="1.4" opacity="0.88"/>
     <polygon points="62,61 84,24 40,24" fill="none" stroke="hsla(186, 98%, 76%, 0.78)" stroke-width="1.3"/>
     <circle cx="62" cy="36" r="8" fill="hsla(48, 100%, 84%, 0.28)" stroke="hsl(50, 100%, 86%)" stroke-width="1.3"/>
     <circle cx="62" cy="36" r="3.4" fill="hsl(54, 100%, 96%)"/>
     <polygon points="10,26 23,19 29,29 19,36 11,33" fill="url(#ca-transmutation-ore)" stroke="hsl(218, 22%, 52%)" stroke-width="1.1"/>
     <polygon points="14,44 28,41 32,52 21,59 12,53" fill="url(#ca-transmutation-ore)" stroke="hsl(218, 22%, 48%)" stroke-width="1.1"/>
     <polygon points="27,31 35,28 38,37 30,40" fill="url(#ca-transmutation-ore)" stroke="hsl(44, 86%, 68%)" stroke-width="0.9"/>
     <path d="M24 27 Q42 26 56 34 M26 50 Q42 46 56 38" fill="none" stroke="url(#ca-transmutation-gold)" stroke-width="2" stroke-linecap="round"/>
     <path d="M68 33 Q80 22 93 20 M68 38 Q82 44 96 48" fill="none" stroke="hsl(186, 100%, 80%)" stroke-width="1.8" stroke-linecap="round"/>
     <polygon points="88,10 103,7 108,29 93,32" fill="url(#ca-transmutation-prism)" stroke="hsl(52, 100%, 92%)" stroke-width="1.3"/>
     <polygon points="99,24 115,27 110,49 94,46" fill="url(#ca-transmutation-prism)" stroke="hsl(186, 100%, 90%)" stroke-width="1.3"/>
     <polygon points="84,38 99,42 93,63 78,59" fill="url(#ca-transmutation-prism)" stroke="hsl(312, 100%, 86%)" stroke-width="1.3"/>
     <polygon points="97,17 100,20 97,23 94,20" fill="hsl(54, 100%, 96%)"/>
     <polygon points="105,34 108,37 104,40 101,37" fill="hsl(54, 100%, 96%)"/>
     <polygon points="89,48 92,51 88,54 85,51" fill="hsl(54, 100%, 96%)"/>
     <path d="M44 12 L45.5 15.5 L49 17 L45.5 18.5 L44 22 L42.5 18.5 L39 17 L42.5 15.5 Z" fill="hsl(52, 100%, 92%)"/>
     <circle cx="80" cy="14" r="1.7" fill="hsl(184, 100%, 88%)"/>
     <circle cx="76" cy="59" r="1.6" fill="hsl(312, 100%, 82%)"/>`,
    'hsla(44, 98%, 62%, 0.30)',
    `<radialGradient id="ca-transmutation-core" cx="50%" cy="50%" r="52%"><stop offset="0%" stop-color="hsla(52, 100%, 92%, 0.62)"/><stop offset="46%" stop-color="hsla(44, 96%, 58%, 0.28)"/><stop offset="100%" stop-color="hsla(266, 62%, 22%, 0)"/></radialGradient><linearGradient id="ca-transmutation-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 88%)"/><stop offset="52%" stop-color="hsl(42, 96%, 58%)"/><stop offset="100%" stop-color="hsl(30, 82%, 34%)"/></linearGradient><linearGradient id="ca-transmutation-ore" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(216, 18%, 46%)"/><stop offset="55%" stop-color="hsl(224, 20%, 26%)"/><stop offset="100%" stop-color="hsl(232, 24%, 13%)"/></linearGradient><linearGradient id="ca-transmutation-prism" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(186, 98%, 78%)"/><stop offset="50%" stop-color="hsl(48, 100%, 74%)"/><stop offset="100%" stop-color="hsl(308, 86%, 62%)"/></linearGradient>`
  ),
  metamorphosis: wrapArtSvg(
    'metamorphosis',
    'hsl(274, 40%, 16%)',
    'hsl(24, 42%, 8%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-metamorphosis-aura)"/>
     <path d="M56 0 Q60 8 64 14 Q68 8 72 0" fill="none" stroke="hsla(42, 82%, 74%, 0.56)" stroke-width="1.3"/>
     <polygon points="56,31 12,11 25,25 52,37" fill="url(#ca-metamorphosis-steel)" stroke="hsl(46, 100%, 86%)" stroke-width="1.1" stroke-linejoin="round"/>
     <polygon points="72,30 116,10 105,24 76,37" fill="url(#ca-metamorphosis-steel)" stroke="hsl(46, 100%, 86%)" stroke-width="1.1" stroke-linejoin="round"/>
     <polygon points="54,42 18,58 31,45 58,36" fill="url(#ca-metamorphosis-steel)" stroke="hsl(206, 62%, 84%)" stroke-width="1.1" stroke-linejoin="round"/>
     <polygon points="74,42 112,57 98,44 70,36" fill="url(#ca-metamorphosis-steel)" stroke="hsl(206, 62%, 84%)" stroke-width="1.1" stroke-linejoin="round"/>
     <polygon points="60,24 64,4 68,24" fill="url(#ca-metamorphosis-steel)" stroke="hsl(52, 100%, 92%)" stroke-width="1.1"/>
     <path d="M46 36 C45 21 54 13 62 13 L59 35 L62 60 C53 59 47 50 46 36 Z" fill="url(#ca-metamorphosis-shell)" stroke="hsl(38, 92%, 64%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M82 36 C83 21 74 13 66 13 L69 35 L66 60 C75 59 81 50 82 36 Z" fill="url(#ca-metamorphosis-shell)" stroke="hsl(38, 92%, 64%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M48 27 Q54 25 60 28 M47 38 Q54 36 59 39 M49 49 Q54 47 60 50" fill="none" stroke="hsl(286, 62%, 22%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M80 27 Q74 25 68 28 M81 38 Q74 36 69 39 M79 49 Q74 47 68 50" fill="none" stroke="hsl(286, 62%, 22%)" stroke-width="1.4" stroke-linecap="round"/>
     <polygon points="62,15 66,15 69,35 66,58 62,58 59,35" fill="url(#ca-metamorphosis-core)"/>
     <path d="M64 17 L64 56" stroke="hsl(54, 100%, 96%)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="36,33 43,31 41,38" fill="hsl(34, 78%, 48%)" stroke="hsl(48, 100%, 82%)" stroke-width="0.8"/>
     <polygon points="86,32 93,36 87,39" fill="hsl(284, 62%, 44%)" stroke="hsl(48, 100%, 82%)" stroke-width="0.8"/>
     <line x1="16" y1="13" x2="54" y2="32" stroke="hsl(0, 0%, 100%)" stroke-width="1.2" opacity="0.85"/>
     <line x1="112" y1="12" x2="74" y2="32" stroke="hsl(0, 0%, 100%)" stroke-width="1.2" opacity="0.85"/>
     <path d="M36 16 Q44 20 46 26 M92 16 Q84 20 82 26" fill="none" stroke="hsl(42, 100%, 74%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="32" cy="36" r="1.8" fill="hsl(48, 100%, 84%)"/>
     <circle cx="96" cy="36" r="1.8" fill="hsl(48, 100%, 84%)"/>
     <circle cx="48" cy="62" r="1.6" fill="hsl(28, 100%, 66%)"/>
     <circle cx="80" cy="62" r="1.6" fill="hsl(292, 94%, 74%)"/>`,
    'hsla(36, 98%, 58%, 0.30)',
    `<radialGradient id="ca-metamorphosis-aura" cx="50%" cy="50%" r="54%"><stop offset="0%" stop-color="hsla(46, 100%, 78%, 0.62)"/><stop offset="48%" stop-color="hsla(28, 96%, 52%, 0.28)"/><stop offset="100%" stop-color="hsla(276, 62%, 18%, 0)"/></radialGradient><linearGradient id="ca-metamorphosis-shell" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(38, 86%, 56%)"/><stop offset="50%" stop-color="hsl(282, 54%, 34%)"/><stop offset="100%" stop-color="hsl(268, 56%, 14%)"/></linearGradient><linearGradient id="ca-metamorphosis-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(204, 48%, 94%)"/><stop offset="55%" stop-color="hsl(214, 24%, 56%)"/><stop offset="100%" stop-color="hsl(224, 28%, 22%)"/></linearGradient><linearGradient id="ca-metamorphosis-core" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="55%" stop-color="hsl(40, 100%, 66%)"/><stop offset="100%" stop-color="hsl(20, 100%, 50%)"/></linearGradient>`
  ),
  magnetism: wrapArtSvg(
    'magnetism',
    'hsl(212, 46%, 18%)',
    'hsl(236, 46%, 8%)',
    `<ellipse cx="64" cy="36" rx="54" ry="28" fill="url(#ca-magnetism-field)"/>
     <ellipse cx="64" cy="36" rx="48" ry="22" fill="none" stroke="hsla(192, 98%, 74%, 0.34)" stroke-width="1.2" stroke-dasharray="5 4"/>
     <ellipse cx="64" cy="36" rx="34" ry="15" fill="none" stroke="hsla(192, 98%, 78%, 0.45)" stroke-width="1.1" stroke-dasharray="4 3"/>
     <path d="M56 17 L34 17 C16 17 16 55 34 55 L56 55 L56 44 L36 44 C28 44 28 28 36 28 L56 28 Z" fill="rgba(0,0,0,0.46)" transform="translate(2 2)"/>
     <path d="M56 17 L34 17 C16 17 16 55 34 55 L56 55 L56 44 L36 44 C28 44 28 28 36 28 L56 28 Z" fill="url(#ca-magnetism-body)" stroke="hsl(352, 82%, 68%)" stroke-width="1.4" stroke-linejoin="round"/>
     <rect x="53" y="16.5" width="14" height="12" rx="1.4" fill="url(#ca-magnetism-tip)" stroke="hsl(192, 100%, 88%)" stroke-width="1.2"/>
     <rect x="53" y="43.5" width="14" height="12" rx="1.4" fill="url(#ca-magnetism-tip)" stroke="hsl(192, 100%, 88%)" stroke-width="1.2"/>
     <path d="M33 21 C22 21 22 51 33 51" fill="none" stroke="hsla(356, 100%, 84%, 0.52)" stroke-width="1.6" stroke-linecap="round"/>
     <polyline points="67,22 76,27 70,34 78,41 67,49" fill="none" stroke="hsl(188, 100%, 92%)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
     <polyline points="67,24 85,18 93,21" fill="none" stroke="hsl(192, 100%, 78%)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
     <polyline points="67,48 84,53 95,48" fill="none" stroke="hsl(192, 100%, 78%)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
     <polyline points="75,34 89,36 98,35" fill="none" stroke="hsl(52, 100%, 88%)" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/>
     <polygon points="94,8 109,11 105,31 90,28" fill="url(#ca-magnetism-card)" stroke="hsl(190, 100%, 92%)" stroke-width="1.3"/>
     <polygon points="100,29 116,27 118,48 102,50" fill="url(#ca-magnetism-card)" stroke="hsl(190, 100%, 92%)" stroke-width="1.3"/>
     <polygon points="91,45 106,49 101,66 86,62" fill="url(#ca-magnetism-card)" stroke="hsl(190, 100%, 92%)" stroke-width="1.3"/>
     <path d="M97 18 L103 19 M106 38 L112 37 M94 55 L100 57" stroke="hsl(212, 86%, 24%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="68" cy="22" r="3" fill="hsl(188, 100%, 92%)"/>
     <circle cx="68" cy="49" r="3" fill="hsl(188, 100%, 92%)"/>
     <circle cx="84" cy="11" r="1.6" fill="hsl(50, 100%, 88%)"/>
     <circle cx="82" cy="60" r="1.6" fill="hsl(188, 100%, 88%)"/>`,
    'hsla(192, 98%, 62%, 0.30)',
    `<radialGradient id="ca-magnetism-field" cx="56%" cy="50%" r="54%"><stop offset="0%" stop-color="hsla(190, 100%, 76%, 0.44)"/><stop offset="56%" stop-color="hsla(214, 92%, 52%, 0.18)"/><stop offset="100%" stop-color="hsla(236, 62%, 14%, 0)"/></radialGradient><linearGradient id="ca-magnetism-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(352, 86%, 56%)"/><stop offset="52%" stop-color="hsl(348, 76%, 32%)"/><stop offset="100%" stop-color="hsl(340, 62%, 14%)"/></linearGradient><linearGradient id="ca-magnetism-tip" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(200, 42%, 96%)"/><stop offset="55%" stop-color="hsl(210, 26%, 68%)"/><stop offset="100%" stop-color="hsl(220, 28%, 34%)"/></linearGradient><linearGradient id="ca-magnetism-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(196, 68%, 92%)"/><stop offset="55%" stop-color="hsl(212, 42%, 64%)"/><stop offset="100%" stop-color="hsl(228, 44%, 32%)"/></linearGradient>`
  ),
  mayhem: wrapArtSvg(
    'mayhem',
    'hsl(14, 48%, 16%)',
    'hsl(268, 42%, 8%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-mayhem-vortex)"/>
     <path d="M12 48 C18 14 58 6 94 20 C118 30 116 58 84 64" fill="none" stroke="url(#ca-mayhem-wind)" stroke-width="5.5" stroke-linecap="round"/>
     <path d="M116 24 C108 58 68 66 34 52 C14 42 18 16 48 12" fill="none" stroke="url(#ca-mayhem-wind)" stroke-width="4" stroke-linecap="round" opacity="0.82"/>
     <polygon points="18,12 31,9 35,25 22,28" fill="url(#ca-mayhem-card)" stroke="hsl(48, 100%, 84%)" stroke-width="1.2"/>
     <polygon points="97,15 111,20 105,36 91,31" fill="url(#ca-mayhem-card)" stroke="hsl(352, 100%, 76%)" stroke-width="1.2"/>
     <polygon points="52,51 67,49 69,65 54,67" fill="url(#ca-mayhem-card)" stroke="hsl(288, 96%, 82%)" stroke-width="1.2"/>
     <path d="M26 24 L60 35 L55 41 L20 29 Z" fill="hsl(24, 46%, 24%)" stroke="hsl(38, 72%, 52%)" stroke-width="1"/>
     <path d="M35 16 Q49 23 48 39 Q37 37 29 30 Q35 23 35 16 Z" fill="url(#ca-mayhem-steel)" stroke="hsl(14, 96%, 72%)" stroke-width="1.2"/>
     <polygon points="104,11 66,34 71,39 109,18" fill="url(#ca-mayhem-steel)" stroke="hsl(48, 100%, 88%)" stroke-width="1.1"/>
     <path d="M97 9 L111 23" stroke="hsl(42, 86%, 58%)" stroke-width="3" stroke-linecap="round"/>
     <path d="M22 57 Q44 45 64 38 Q48 53 26 62 Z" fill="url(#ca-mayhem-steel)" stroke="hsl(352, 92%, 72%)" stroke-width="1.1"/>
     <polygon points="108,58 72,38 76,33 112,51" fill="url(#ca-mayhem-steel)" stroke="hsl(206, 72%, 82%)" stroke-width="1.1"/>
     <polygon points="64,21 68,31 79,28 71,36 80,45 68,41 64,51 60,41 48,45 57,36 49,28 60,31" fill="hsl(48, 100%, 86%)" stroke="hsl(20, 100%, 60%)" stroke-width="1"/>
     <circle cx="64" cy="36" r="5" fill="hsl(56, 100%, 96%)"/>
     <path d="M52 12 L58 22 M84 10 L76 22 M44 58 L54 46 M88 58 L78 46" stroke="hsl(36, 100%, 74%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="14,42 22,39 19,46" fill="hsl(26, 100%, 66%)"/>
     <polygon points="114,40 106,38 110,45" fill="hsl(352, 100%, 66%)"/>
     <circle cx="78" cy="14" r="1.8" fill="hsl(52, 100%, 90%)"/>
     <circle cx="38" cy="60" r="1.6" fill="hsl(352, 100%, 72%)"/>`,
    'hsla(24, 98%, 58%, 0.32)',
    `<radialGradient id="ca-mayhem-vortex" cx="50%" cy="50%" r="54%"><stop offset="0%" stop-color="hsla(42, 100%, 72%, 0.68)"/><stop offset="48%" stop-color="hsla(8, 96%, 48%, 0.34)"/><stop offset="100%" stop-color="hsla(272, 68%, 16%, 0)"/></radialGradient><linearGradient id="ca-mayhem-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(208, 36%, 94%)"/><stop offset="52%" stop-color="hsl(216, 20%, 54%)"/><stop offset="100%" stop-color="hsl(226, 24%, 20%)"/></linearGradient><linearGradient id="ca-mayhem-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(46, 92%, 78%)"/><stop offset="55%" stop-color="hsl(344, 72%, 44%)"/><stop offset="100%" stop-color="hsl(276, 56%, 22%)"/></linearGradient><linearGradient id="ca-mayhem-wind" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(352, 96%, 56%, 0.14)"/><stop offset="50%" stop-color="hsla(32, 100%, 66%, 0.68)"/><stop offset="100%" stop-color="hsla(292, 92%, 62%, 0.14)"/></linearGradient>`
  ),
  ritual_dagger: wrapArtSvg(
    'ritual_dagger',
    'hsl(348, 52%, 16%)',
    'hsl(264, 48%, 6%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-ritual_dagger-aura)"/>
     <circle cx="64" cy="36" r="24" fill="none" stroke="hsla(352, 94%, 56%, 0.42)" stroke-width="1.2" stroke-dasharray="6 4"/>
     <polygon points="64,12 85,48 43,48" fill="none" stroke="hsla(28, 96%, 62%, 0.34)" stroke-width="1"/>
     <path d="M12 64 L32 56 L96 56 L116 64 L128 72 L0 72 Z" fill="hsla(272, 42%, 10%, 0.72)"/>
     <path d="M56 32 Q68 18 82 14 Q96 10 110 8 Q104 20 88 26 Q74 32 62 42 Z" fill="url(#ca-ritual_dagger-fire)" opacity="0.72"/>
     <path d="M44 43 Q60 33 74 29 Q89 25 109 11 Q101 25 84 32 Q68 38 51 49 Z" fill="rgba(0,0,0,0.52)" transform="translate(2 2)"/>
     <path d="M43 42 Q60 32 74 28 Q90 24 110 10 Q101 25 84 32 Q68 38 50 48 Z" fill="url(#ca-ritual_dagger-obsidian)" stroke="hsl(352, 92%, 62%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M50 42 Q67 33 82 28 Q94 24 106 14" fill="none" stroke="url(#ca-ritual_dagger-fire)" stroke-width="2" stroke-linecap="round"/>
     <path d="M62 35 L65 39 M73 30 L76 34 M84 25 L87 29 M94 19 L97 22" stroke="hsl(44, 100%, 84%)" stroke-width="1.3" stroke-linecap="round"/>
     <path d="M35 33 Q44 37 47 45 Q52 54 61 57 Q49 56 43 48 Q38 41 35 33 Z" fill="url(#ca-ritual_dagger-gold)" stroke="hsl(24, 72%, 20%)" stroke-width="1.1" stroke-linejoin="round"/>
     <line x1="23" y1="59" x2="43" y2="46" stroke="hsl(344, 46%, 18%)" stroke-width="5.6" stroke-linecap="round"/>
     <path d="M27 56 L30 58 M32 52 L35 55 M37 49 L40 52" stroke="url(#ca-ritual_dagger-gold)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="46" cy="45" r="3.4" fill="hsl(352, 100%, 54%)" stroke="hsl(46, 100%, 80%)" stroke-width="1.1"/>
     <circle cx="21" cy="60" r="3.4" fill="url(#ca-ritual_dagger-gold)" stroke="hsl(352, 86%, 44%)" stroke-width="1"/>
     <path d="M74 24 Q79 14 86 17 Q82 22 84 26 Z" fill="url(#ca-ritual_dagger-fire)" opacity="0.88"/>
     <path d="M107 20 Q104 27 107 30 Q110 27 107 20 Z" fill="hsl(352, 98%, 54%)"/>
     <circle cx="96" cy="38" r="1.8" fill="hsl(36, 100%, 72%)"/>
     <circle cx="52" cy="18" r="1.6" fill="hsl(352, 100%, 66%)"/>
     <circle cx="88" cy="48" r="1.4" fill="hsl(44, 100%, 80%)"/>`,
    'hsla(352, 98%, 54%, 0.30)',
    `<radialGradient id="ca-ritual_dagger-aura" cx="56%" cy="44%" r="54%"><stop offset="0%" stop-color="hsla(352, 100%, 56%, 0.50)"/><stop offset="52%" stop-color="hsla(14, 96%, 44%, 0.22)"/><stop offset="100%" stop-color="hsla(268, 62%, 12%, 0)"/></radialGradient><linearGradient id="ca-ritual_dagger-obsidian" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(276, 36%, 12%)"/><stop offset="52%" stop-color="hsl(332, 34%, 26%)"/><stop offset="100%" stop-color="hsl(354, 72%, 62%)"/></linearGradient><linearGradient id="ca-ritual_dagger-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 82%)"/><stop offset="55%" stop-color="hsl(38, 86%, 48%)"/><stop offset="100%" stop-color="hsl(24, 74%, 22%)"/></linearGradient><linearGradient id="ca-ritual_dagger-fire" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(352, 100%, 52%)"/><stop offset="58%" stop-color="hsl(18, 100%, 58%)"/><stop offset="100%" stop-color="hsl(48, 100%, 86%)"/></linearGradient>`
  ),
  bite: wrapArtSvg(
    'bite',
    'hsl(236, 48%, 15%)',
    'hsl(348, 54%, 7%)',
    `<circle cx="94" cy="18" r="24" fill="url(#ca-bite-moon)"/>
     <circle cx="94" cy="18" r="10" fill="hsl(206, 68%, 94%)" opacity="0.88"/>
     <path d="M12 20 Q20 14 28 20 Q21 19 18 24 Q15 19 12 20 Z" fill="hsl(248, 48%, 10%)" opacity="0.8"/>
     <path d="M18 14 Q42 5 64 9 Q86 5 110 14 Q98 28 64 25 Q30 28 18 14 Z" fill="url(#ca-bite-gum)" stroke="hsl(350, 74%, 44%)" stroke-width="1.3"/>
     <path d="M26 62 Q48 68 64 65 Q80 68 102 62 Q86 55 64 57 Q42 55 26 62 Z" fill="url(#ca-bite-gum)" stroke="hsl(348, 68%, 36%)" stroke-width="1.2"/>
     <polygon points="52,18 60,19 56,30" fill="url(#ca-bite-fang)" stroke="hsl(232, 32%, 22%)" stroke-width="0.9"/>
     <polygon points="60,19 68,19 64,29" fill="url(#ca-bite-fang)" stroke="hsl(232, 32%, 22%)" stroke-width="0.9"/>
     <polygon points="68,19 76,18 72,30" fill="url(#ca-bite-fang)" stroke="hsl(232, 32%, 22%)" stroke-width="0.9"/>
     <path d="M36 16 L51 18 Q48 36 42 52 Q36 36 36 16 Z" fill="url(#ca-bite-fang)" stroke="hsl(214, 48%, 88%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M77 18 L92 16 Q92 36 86 52 Q80 36 77 18 Z" fill="url(#ca-bite-fang)" stroke="hsl(214, 48%, 88%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M40 20 Q41 34 42 46 M87 20 Q87 34 86 46" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M44 60 L52 59 L47 47 Z" fill="url(#ca-bite-fang)" stroke="hsl(228, 34%, 24%)" stroke-width="1"/>
     <path d="M76 59 L84 60 L81 47 Z" fill="url(#ca-bite-fang)" stroke="hsl(228, 34%, 24%)" stroke-width="1"/>
     <path d="M42 49 Q38 56 42 60 Q46 56 42 49 Z" fill="url(#ca-bite-blood)"/>
     <path d="M86 49 Q82 56 86 60 Q90 56 86 49 Z" fill="url(#ca-bite-blood)"/>
     <path d="M64 42 Q61 48 64 51 Q67 48 64 42 Z" fill="url(#ca-bite-blood)"/>
     <circle cx="40.8" cy="55.5" r="1.1" fill="hsl(354, 100%, 84%)"/>
     <circle cx="84.8" cy="55.5" r="1.1" fill="hsl(354, 100%, 84%)"/>
     <ellipse cx="64" cy="67" rx="34" ry="3.5" fill="hsla(352, 96%, 48%, 0.28)"/>
     <path d="M22 36 Q30 34 36 37 M92 37 Q98 34 106 36" fill="none" stroke="hsla(204, 82%, 86%, 0.42)" stroke-width="1.4" stroke-linecap="round"/>`,
    'hsla(352, 96%, 54%, 0.28)',
    `<radialGradient id="ca-bite-moon" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(204, 96%, 94%, 0.88)"/><stop offset="48%" stop-color="hsla(214, 78%, 74%, 0.30)"/><stop offset="100%" stop-color="hsla(236, 58%, 24%, 0)"/></radialGradient><linearGradient id="ca-bite-fang" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(44, 52%, 96%)"/><stop offset="56%" stop-color="hsl(212, 24%, 82%)"/><stop offset="100%" stop-color="hsl(228, 28%, 48%)"/></linearGradient><linearGradient id="ca-bite-blood" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(354, 100%, 64%)"/><stop offset="52%" stop-color="hsl(350, 94%, 44%)"/><stop offset="100%" stop-color="hsl(342, 86%, 22%)"/></linearGradient><linearGradient id="ca-bite-gum" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(344, 66%, 24%)"/><stop offset="100%" stop-color="hsl(338, 64%, 10%)"/></linearGradient>`
  ),
  jax: wrapArtSvg(
    'jax',
    'hsl(346, 44%, 15%)',
    'hsl(258, 38%, 7%)',
    `<ellipse cx="64" cy="36" rx="50" ry="26" fill="url(#ca-jax-glow)"/>
     <polyline points="10,48 22,42 28,50 38,38" fill="none" stroke="hsla(346, 100%, 64%, 0.55)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
     <polyline points="86,18 96,12 102,20 116,14" fill="none" stroke="hsla(346, 100%, 64%, 0.55)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
     <line x1="20" y1="15" x2="41" y2="27" stroke="url(#ca-jax-metal)" stroke-width="4.2" stroke-linecap="round"/>
     <path d="M13 21 L26 9" stroke="url(#ca-jax-metal)" stroke-width="4.2" stroke-linecap="round"/>
     <polygon points="39,18 85,43 75,60 29,35" fill="rgba(0,0,0,0.48)" transform="translate(2 2)"/>
     <polygon points="39,17 85,42 75,59 29,34" fill="url(#ca-jax-glass)" stroke="hsl(344, 62%, 78%)" stroke-width="1.3" stroke-linejoin="round"/>
     <polygon points="44,23 82,43 74,57 36,36" fill="url(#ca-jax-serum)"/>
     <line x1="42" y1="21" x2="79" y2="41" stroke="hsl(0, 0%, 100%)" stroke-width="1.6" stroke-linecap="round" opacity="0.72"/>
     <path d="M48 27 L45 32 M56 31 L53 36 M64 35 L61 40 M72 39 L69 44" stroke="hsla(0, 0%, 100%, 0.65)" stroke-width="1.2" stroke-linecap="round"/>
     <polygon points="26,33 38,14 43,17 31,36" fill="url(#ca-jax-metal)" stroke="hsl(346, 48%, 22%)" stroke-width="1"/>
     <polygon points="73,59 84,40 90,44 79,62" fill="url(#ca-jax-metal)" stroke="hsl(346, 48%, 22%)" stroke-width="1"/>
     <polygon points="86,47 96,52 93,57 83,52" fill="url(#ca-jax-metal)" stroke="hsl(344, 62%, 72%)" stroke-width="0.9"/>
     <line x1="94" y1="54" x2="114" y2="64" stroke="hsl(204, 54%, 92%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="54" cy="36" r="2.8" fill="hsl(352, 100%, 88%)" opacity="0.86"/>
     <circle cx="64" cy="43" r="2.1" fill="hsl(352, 100%, 90%)" opacity="0.86"/>
     <circle cx="71" cy="49" r="1.6" fill="hsl(52, 100%, 92%)"/>
     <path d="M115 62 Q112 67 115 70 Q118 67 115 62 Z" fill="hsl(348, 100%, 60%)"/>
     <path d="M58 14 Q62 8 68 13 Q72 18 76 11" fill="none" stroke="hsla(346, 100%, 72%, 0.68)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="48" cy="56" r="1.8" fill="hsl(348, 100%, 66%)"/>
     <circle cx="88" cy="26" r="1.6" fill="hsl(348, 100%, 74%)"/>`,
    'hsla(350, 100%, 56%, 0.34)',
    `<radialGradient id="ca-jax-glow" cx="54%" cy="52%" r="54%"><stop offset="0%" stop-color="hsla(348, 100%, 58%, 0.56)"/><stop offset="52%" stop-color="hsla(328, 96%, 44%, 0.24)"/><stop offset="100%" stop-color="hsla(262, 58%, 14%, 0)"/></radialGradient><linearGradient id="ca-jax-serum" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(342, 100%, 72%)"/><stop offset="48%" stop-color="hsl(350, 100%, 54%)"/><stop offset="100%" stop-color="hsl(330, 92%, 30%)"/></linearGradient><linearGradient id="ca-jax-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(42, 52%, 72%)"/><stop offset="55%" stop-color="hsl(28, 34%, 38%)"/><stop offset="100%" stop-color="hsl(232, 24%, 18%)"/></linearGradient><linearGradient id="ca-jax-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsla(340, 82%, 88%, 0.38)"/><stop offset="100%" stop-color="hsla(256, 48%, 22%, 0.54)"/></linearGradient>`
  ),
  injury: wrapArtSvg(
    'injury',
    'hsl(346, 36%, 14%)',
    'hsl(268, 32%, 6%)',
    `<ellipse cx="64" cy="36" rx="48" ry="26" fill="url(#ca-injury-haze)"/>
     <ellipse cx="62" cy="64" rx="34" ry="5.5" fill="rgba(0,0,0,0.52)"/>
     <path d="M24 58 L36 38 L58 34 L76 42 L68 62 L34 64 Z" fill="url(#ca-injury-iron)" stroke="hsl(264, 24%, 14%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M40 38 L46 21 L60 18 L75 23 L84 35 L74 44 L56 42 Z" fill="url(#ca-injury-iron)" stroke="hsl(264, 24%, 14%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M46 22 Q50 12 58 15 L58 24 M58 19 Q64 10 72 15 L69 25 M70 22 Q79 14 85 22 L78 32 M79 31 Q90 27 91 36 L78 41" fill="url(#ca-injury-iron)" stroke="hsl(260, 22%, 14%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M49 25 L56 32 L52 38 L61 45 M66 24 L61 32 L72 36" fill="none" stroke="hsl(352, 98%, 54%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M49 25 L56 32 L52 38 L61 45" fill="none" stroke="hsl(18, 100%, 76%)" stroke-width="0.9" stroke-linecap="round"/>
     <path d="M31 44 L69 38 L66 47 L28 53 Z" fill="url(#ca-injury-cloth)" stroke="hsl(344, 28%, 22%)" stroke-width="1"/>
     <path d="M26 53 L64 49 L62 58 L24 61 Z" fill="url(#ca-injury-cloth)" stroke="hsl(344, 28%, 22%)" stroke-width="1"/>
     <path d="M68 42 Q84 44 96 54 Q88 57 76 51 L65 47 Z" fill="url(#ca-injury-cloth)" stroke="hsl(344, 28%, 24%)" stroke-width="1"/>
     <path d="M42 42 Q50 40 56 47 Q48 51 39 48 Z" fill="url(#ca-injury-blood)" opacity="0.88"/>
     <path d="M34 52 Q44 50 51 57 Q42 60 33 58 Z" fill="url(#ca-injury-blood)" opacity="0.84"/>
     <path d="M77 45 Q84 47 88 52 Q82 53 75 49 Z" fill="url(#ca-injury-blood)" opacity="0.8"/>
     <polygon points="86,16 93,14 90,20" fill="url(#ca-injury-iron)" stroke="hsl(352, 86%, 56%)" stroke-width="0.8"/>
     <polygon points="34,26 40,24 38,30" fill="url(#ca-injury-iron)" stroke="hsl(352, 86%, 56%)" stroke-width="0.8"/>
     <path d="M55 58 Q53 64 55 67 Q58 64 55 58 Z" fill="url(#ca-injury-blood)"/>
     <path d="M78 57 Q76 62 78 65 Q80 62 78 57 Z" fill="url(#ca-injury-blood)"/>
     <circle cx="98" cy="30" r="1.6" fill="hsl(352, 92%, 56%)"/>
     <circle cx="24" cy="34" r="1.5" fill="hsl(352, 92%, 56%)"/>`,
    'hsla(352, 86%, 44%, 0.26)',
    `<radialGradient id="ca-injury-haze" cx="50%" cy="46%" r="54%"><stop offset="0%" stop-color="hsla(352, 90%, 44%, 0.42)"/><stop offset="56%" stop-color="hsla(328, 62%, 22%, 0.18)"/><stop offset="100%" stop-color="hsla(268, 44%, 8%, 0)"/></radialGradient><linearGradient id="ca-injury-iron" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(248, 12%, 44%)"/><stop offset="52%" stop-color="hsl(256, 14%, 24%)"/><stop offset="100%" stop-color="hsl(268, 20%, 11%)"/></linearGradient><linearGradient id="ca-injury-cloth" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(36, 20%, 74%)"/><stop offset="58%" stop-color="hsl(24, 14%, 48%)"/><stop offset="100%" stop-color="hsl(344, 24%, 26%)"/></linearGradient><linearGradient id="ca-injury-blood" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(352, 88%, 42%)"/><stop offset="100%" stop-color="hsl(344, 82%, 18%)"/></linearGradient>`
  ),
  normality: wrapArtSvg(
    'normality',
    'hsl(240, 14%, 17%)',
    'hsl(248, 18%, 7%)',
    `<ellipse cx="64" cy="36" rx="54" ry="26" fill="url(#ca-normality-mist)"/>
     <polygon points="22,20 46,16 52,54 28,58" fill="url(#ca-normality-card)" stroke="hsl(240, 12%, 48%)" stroke-width="1.3"/>
     <polygon points="82,16 106,20 100,58 76,54" fill="url(#ca-normality-card)" stroke="hsl(240, 12%, 48%)" stroke-width="1.3"/>
     <rect x="49" y="13" width="30" height="44" rx="2.4" fill="url(#ca-normality-card)" stroke="hsl(240, 14%, 56%)" stroke-width="1.4"/>
     <rect x="53" y="17" width="22" height="36" rx="1.4" fill="none" stroke="hsl(242, 12%, 34%)" stroke-width="1"/>
     <line x1="30" y1="28" x2="43" y2="26" stroke="hsl(240, 10%, 34%)" stroke-width="1.4"/>
     <line x1="85" y1="26" x2="98" y2="28" stroke="hsl(240, 10%, 34%)" stroke-width="1.4"/>
     <path d="M2 16 L126 56 M126 16 L2 56" fill="none" stroke="hsl(244, 18%, 10%)" stroke-width="6.5" stroke-linecap="round"/>
     <path d="M2 16 L126 56 M126 16 L2 56" fill="none" stroke="url(#ca-normality-iron)" stroke-width="4.4" stroke-dasharray="10 4" stroke-linecap="round"/>
     <path d="M4 15 L124 55 M124 15 L4 55" fill="none" stroke="hsla(228, 22%, 82%, 0.45)" stroke-width="1.1" stroke-dasharray="6 8" stroke-linecap="round"/>
     <path d="M55 34 V26 A9 9 0 0 1 73 26 V34" fill="none" stroke="hsl(244, 18%, 10%)" stroke-width="5.6"/>
     <path d="M55 34 V26 A9 9 0 0 1 73 26 V34" fill="none" stroke="url(#ca-normality-iron)" stroke-width="3.4"/>
     <rect x="50" y="33" width="28" height="24" rx="3" fill="rgba(0,0,0,0.48)" transform="translate(2 2)"/>
     <rect x="50" y="33" width="28" height="24" rx="3" fill="url(#ca-normality-iron)" stroke="hsl(240, 16%, 62%)" stroke-width="1.3"/>
     <circle cx="54" cy="37" r="1.2" fill="hsl(240, 14%, 72%)"/>
     <circle cx="74" cy="37" r="1.2" fill="hsl(240, 14%, 72%)"/>
     <circle cx="54" cy="53" r="1.2" fill="hsl(240, 14%, 72%)"/>
     <circle cx="74" cy="53" r="1.2" fill="hsl(240, 14%, 72%)"/>
     <circle cx="64" cy="42.5" r="3" fill="hsl(252, 24%, 10%)"/>
     <polygon points="62,44 66,44 67.2,51 60.8,51" fill="hsl(252, 24%, 10%)"/>
     <path d="M12 64 Q40 58 64 64 Q88 70 116 62" fill="none" stroke="hsla(262, 24%, 56%, 0.28)" stroke-width="1.6" stroke-linecap="round"/>`,
    'hsla(246, 20%, 54%, 0.22)',
    `<linearGradient id="ca-normality-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(240, 10%, 42%)"/><stop offset="56%" stop-color="hsl(244, 12%, 26%)"/><stop offset="100%" stop-color="hsl(248, 16%, 14%)"/></linearGradient><linearGradient id="ca-normality-iron" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(228, 14%, 64%)"/><stop offset="50%" stop-color="hsl(240, 12%, 38%)"/><stop offset="100%" stop-color="hsl(248, 16%, 16%)"/></linearGradient><radialGradient id="ca-normality-mist" cx="50%" cy="50%" r="54%"><stop offset="0%" stop-color="hsla(248, 22%, 52%, 0.28)"/><stop offset="100%" stop-color="hsla(248, 22%, 10%, 0)"/></radialGradient>`
  ),
  pain: wrapArtSvg(
    'pain',
    'hsl(340, 52%, 14%)',
    'hsl(282, 48%, 6%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-pain-pulse)"/>
     <circle cx="64" cy="36" r="26" fill="none" stroke="hsla(348, 96%, 56%, 0.34)" stroke-width="1.2" stroke-dasharray="4 4"/>
     <path d="M64 60 C44 48 36 34 40 22 C44 12 56 12 64 22 C72 12 84 12 88 22 C92 34 84 48 64 60 Z" fill="rgba(0,0,0,0.52)" transform="translate(2 2)"/>
     <path d="M64 59 C44 47 36 33 40 21 C44 11 56 11 64 21 C72 11 84 11 88 21 C92 33 84 47 64 59 Z" fill="url(#ca-pain-heart)" stroke="hsl(348, 96%, 62%)" stroke-width="1.5" stroke-linejoin="round"/>
     <path d="M54 22 Q60 32 58 46 M74 22 Q68 34 70 44" fill="none" stroke="hsla(352, 100%, 76%, 0.56)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M45 21 Q49 15 56 18" fill="none" stroke="hsla(352, 100%, 88%, 0.65)" stroke-width="1.7" stroke-linecap="round"/>
     <path d="M8 14 Q36 30 64 28 Q92 26 120 14" fill="none" stroke="url(#ca-pain-vine)" stroke-width="4" stroke-linecap="round"/>
     <path d="M6 54 Q34 36 64 42 Q94 48 122 34" fill="none" stroke="url(#ca-pain-vine)" stroke-width="4.2" stroke-linecap="round"/>
     <path d="M18 64 Q44 50 64 34 Q84 18 110 56" fill="none" stroke="url(#ca-pain-vine)" stroke-width="3.2" stroke-linecap="round"/>
     <polygon points="44,28 50,21 51,30" fill="hsl(338, 62%, 14%)" stroke="hsl(348, 94%, 58%)" stroke-width="0.9"/>
     <polygon points="78,27 84,19 85,29" fill="hsl(338, 62%, 14%)" stroke="hsl(348, 94%, 58%)" stroke-width="0.9"/>
     <polygon points="56,41 62,34 65,43" fill="hsl(338, 62%, 14%)" stroke="hsl(348, 94%, 58%)" stroke-width="0.9"/>
     <polygon points="73,45 81,40 77,50" fill="hsl(338, 62%, 14%)" stroke="hsl(348, 94%, 58%)" stroke-width="0.9"/>
     <polygon points="24,22 29,15 31,24" fill="hsl(338, 62%, 14%)" stroke="hsl(348, 86%, 52%)" stroke-width="0.8"/>
     <polygon points="100,40 107,35 104,45" fill="hsl(338, 62%, 14%)" stroke="hsl(348, 86%, 52%)" stroke-width="0.8"/>
     <path d="M48 31 Q46 37 48 39 Q50 37 48 31 Z" fill="hsl(352, 100%, 60%)"/>
     <path d="M77 48 Q75 54 77 57 Q79 54 77 48 Z" fill="hsl(352, 100%, 60%)"/>
     <path d="M64 59 Q61 65 64 68 Q67 65 64 59 Z" fill="hsl(352, 100%, 56%)"/>
     <polyline points="20,34 28,31 25,38" fill="none" stroke="hsl(352, 100%, 72%)" stroke-width="1.3" stroke-linecap="round"/>
     <polyline points="108,24 100,27 104,33" fill="none" stroke="hsl(352, 100%, 72%)" stroke-width="1.3" stroke-linecap="round"/>`,
    'hsla(348, 96%, 48%, 0.30)',
    `<radialGradient id="ca-pain-pulse" cx="50%" cy="48%" r="54%"><stop offset="0%" stop-color="hsla(350, 100%, 54%, 0.54)"/><stop offset="52%" stop-color="hsla(328, 88%, 34%, 0.24)"/><stop offset="100%" stop-color="hsla(282, 62%, 10%, 0)"/></radialGradient><radialGradient id="ca-pain-heart" cx="42%" cy="34%" r="64%"><stop offset="0%" stop-color="hsl(350, 96%, 56%)"/><stop offset="50%" stop-color="hsl(340, 82%, 28%)"/><stop offset="100%" stop-color="hsl(312, 66%, 11%)"/></radialGradient><linearGradient id="ca-pain-vine" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(338, 34%, 34%)"/><stop offset="50%" stop-color="hsl(312, 42%, 14%)"/><stop offset="100%" stop-color="hsl(276, 48%, 7%)"/></linearGradient>`
  ),
  shame: wrapArtSvg(
    'shame',
    'hsl(266, 42%, 15%)',
    'hsl(246, 48%, 6%)',
    `<ellipse cx="64" cy="40" rx="54" ry="26" fill="url(#ca-shame-abyss)"/>
     <path d="M12 18 Q22 12 32 18 Q22 24 12 18 Z" fill="hsl(262, 54%, 8%)" stroke="hsl(286, 76%, 58%)" stroke-width="1.1"/>
     <circle cx="22" cy="18" r="2.6" fill="hsl(44, 96%, 72%)"/>
     <path d="M96 18 Q106 12 116 18 Q106 24 96 18 Z" fill="hsl(262, 54%, 8%)" stroke="hsl(286, 76%, 58%)" stroke-width="1.1"/>
     <circle cx="106" cy="18" r="2.6" fill="hsl(44, 96%, 72%)"/>
     <path d="M18 35 Q26 30 34 35 Q26 40 18 35 Z" fill="hsl(262, 54%, 8%)" stroke="hsl(286, 68%, 48%)" stroke-width="1"/>
     <circle cx="26" cy="35" r="2" fill="hsl(296, 96%, 74%)"/>
     <path d="M94 35 Q102 30 110 35 Q102 40 94 35 Z" fill="hsl(262, 54%, 8%)" stroke="hsl(286, 68%, 48%)" stroke-width="1"/>
     <circle cx="102" cy="35" r="2" fill="hsl(296, 96%, 74%)"/>
     <path d="M44 22 C44 12 84 12 84 22 L82 44 C80 56 72 62 64 63 C56 62 48 56 46 44 Z" fill="rgba(0,0,0,0.52)" transform="translate(2 2)"/>
     <path d="M44 22 C44 12 84 12 84 22 L82 44 C80 56 72 62 64 63 C56 62 48 56 46 44 Z" fill="url(#ca-shame-mask)" stroke="hsl(268, 34%, 76%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M49 32 Q55 29 60 35 Q54 39 49 32 Z" fill="hsl(262, 62%, 9%)"/>
     <path d="M79 32 Q73 29 68 35 Q74 39 79 32 Z" fill="hsl(262, 62%, 9%)"/>
     <path d="M56 50 Q64 46 72 50" fill="none" stroke="hsl(262, 52%, 14%)" stroke-width="1.8" stroke-linecap="round"/>
     <polyline points="69,14 66,26 73,34 68,45 77,55" fill="none" stroke="hsl(262, 62%, 8%)" stroke-width="2" stroke-linejoin="round"/>
     <path d="M54 36 C50 48 44 56 30 62 Q48 68 62 64" fill="none" stroke="url(#ca-shame-mist)" stroke-width="4.2" stroke-linecap="round"/>
     <path d="M74 36 C78 48 84 56 98 62 Q80 68 66 64" fill="none" stroke="url(#ca-shame-mist)" stroke-width="4.2" stroke-linecap="round"/>
     <polygon points="84,56 92,53 89,61" fill="url(#ca-shame-mask)" stroke="hsl(266, 32%, 34%)" stroke-width="0.9"/>
     <polygon points="38,57 44,54 42,61" fill="url(#ca-shame-mask)" stroke="hsl(266, 32%, 34%)" stroke-width="0.9"/>
     <circle cx="48" cy="18" r="1.5" fill="hsl(296, 96%, 78%)" opacity="0.72"/>`,
    'hsla(286, 84%, 56%, 0.26)',
    `<linearGradient id="ca-shame-mask" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(252, 24%, 88%)"/><stop offset="56%" stop-color="hsl(258, 22%, 58%)"/><stop offset="100%" stop-color="hsl(264, 34%, 24%)"/></linearGradient><linearGradient id="ca-shame-mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsla(294, 98%, 74%, 0.88)"/><stop offset="55%" stop-color="hsla(278, 86%, 54%, 0.56)"/><stop offset="100%" stop-color="hsla(262, 72%, 28%, 0.08)"/></linearGradient><radialGradient id="ca-shame-abyss" cx="50%" cy="54%" r="54%"><stop offset="0%" stop-color="hsla(288, 86%, 48%, 0.36)"/><stop offset="100%" stop-color="hsla(248, 62%, 10%, 0)"/></radialGradient>`
  ),
  writhe: wrapArtSvg(
    'writhe',
    'hsl(286, 48%, 14%)',
    'hsl(262, 54%, 5%)',
    `<ellipse cx="64" cy="36" rx="58" ry="30" fill="url(#ca-writhe-fog)"/>
     <path d="M4 58 C24 38 42 64 64 46 C86 28 106 58 124 42" fill="none" stroke="hsl(276, 56%, 9%)" stroke-width="11" stroke-linecap="round"/>
     <path d="M4 58 C24 38 42 64 64 46 C86 28 106 58 124 42" fill="none" stroke="url(#ca-writhe-body)" stroke-width="7.6" stroke-linecap="round"/>
     <path d="M10 18 C32 42 46 8 68 28 C90 48 102 12 120 26" fill="none" stroke="hsl(276, 56%, 9%)" stroke-width="11" stroke-linecap="round"/>
     <path d="M10 18 C32 42 46 8 68 28 C90 48 102 12 120 26" fill="none" stroke="url(#ca-writhe-body)" stroke-width="7.6" stroke-linecap="round"/>
     <path d="M22 64 C36 22 62 62 78 24 C90 4 106 38 112 62" fill="none" stroke="hsl(276, 56%, 9%)" stroke-width="10" stroke-linecap="round"/>
     <path d="M22 64 C36 22 62 62 78 24 C90 4 106 38 112 62" fill="none" stroke="url(#ca-writhe-body)" stroke-width="6.8" stroke-linecap="round"/>
     <path d="M36 10 C56 32 34 52 64 40 C94 28 74 56 96 64" fill="none" stroke="url(#ca-writhe-body)" stroke-width="5.6" stroke-linecap="round"/>
     <path d="M12 17 C32 38 46 10 66 26 M26 56 C38 28 58 54 74 26 M84 36 C96 28 108 48 118 42" fill="none" stroke="url(#ca-writhe-sheen)" stroke-width="1.8" stroke-linecap="round"/>
     <ellipse cx="44" cy="24" rx="7" ry="4.5" transform="rotate(-18 44 24)" fill="url(#ca-writhe-body)" stroke="hsl(298, 92%, 62%)" stroke-width="1.1"/>
     <ellipse cx="88" cy="42" rx="7.5" ry="4.6" transform="rotate(14 88 42)" fill="url(#ca-writhe-body)" stroke="hsl(298, 92%, 62%)" stroke-width="1.1"/>
     <ellipse cx="64" cy="54" rx="6.5" ry="4" transform="rotate(-8 64 54)" fill="url(#ca-writhe-body)" stroke="hsl(312, 92%, 64%)" stroke-width="1"/>
     <circle cx="42" cy="23.5" r="1.5" fill="hsl(52, 100%, 74%)"/>
     <circle cx="46.5" cy="22.8" r="1.5" fill="hsl(52, 100%, 74%)"/>
     <circle cx="86" cy="41.2" r="1.6" fill="hsl(312, 100%, 74%)"/>
     <circle cx="90.5" cy="42.5" r="1.6" fill="hsl(312, 100%, 74%)"/>
     <circle cx="62" cy="53.5" r="1.4" fill="hsl(52, 100%, 74%)"/>
     <circle cx="66.5" cy="53.5" r="1.4" fill="hsl(52, 100%, 74%)"/>
     <circle cx="20" cy="38" r="2.2" fill="hsla(302, 96%, 68%, 0.65)"/>
     <circle cx="106" cy="16" r="2" fill="hsla(302, 96%, 68%, 0.62)"/>`,
    'hsla(298, 92%, 52%, 0.28)',
    `<radialGradient id="ca-writhe-fog" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="hsla(298, 92%, 46%, 0.44)"/><stop offset="56%" stop-color="hsla(276, 82%, 28%, 0.24)"/><stop offset="100%" stop-color="hsla(262, 62%, 8%, 0)"/></radialGradient><linearGradient id="ca-writhe-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(296, 62%, 42%)"/><stop offset="50%" stop-color="hsl(276, 56%, 22%)"/><stop offset="100%" stop-color="hsl(262, 62%, 9%)"/></linearGradient><linearGradient id="ca-writhe-sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(308, 100%, 80%, 0.24)"/><stop offset="50%" stop-color="hsl(304, 100%, 78%)"/><stop offset="100%" stop-color="hsla(286, 94%, 64%, 0.2)"/></linearGradient>`
  ),
  decay: wrapArtSvg(
    'decay',
    'hsl(288, 36%, 14%)',
    'hsl(152, 34%, 6%)',
    `<ellipse cx="70" cy="36" rx="54" ry="28" fill="url(#ca-decay-rot)"/>
     <path d="M16 54 Q34 46 58 50 L74 58 L64 66 Q38 64 14 66 Z" fill="url(#ca-decay-scroll)" stroke="hsl(34, 24%, 26%)" stroke-width="1.2"/>
     <path d="M22 57 L48 56 M20 61 L42 61" stroke="hsl(284, 34%, 22%)" stroke-width="1.1" stroke-linecap="round"/>
     <path d="M30 34 C28 18 40 10 54 12 C63 13 68 18 70 25 L62 29 L66 36 L58 40 L62 49 L56 54 L39 53 L35 45 Z" fill="rgba(0,0,0,0.50)" transform="translate(2 2)"/>
     <path d="M30 34 C28 18 40 10 54 12 C63 13 68 18 70 25 L62 29 L66 36 L58 40 L62 49 L56 54 L39 53 L35 45 Z" fill="url(#ca-decay-bone)" stroke="hsl(148, 42%, 34%)" stroke-width="1.2" stroke-linejoin="round"/>
     <ellipse cx="42" cy="32" rx="5.5" ry="4.5" fill="hsl(282, 54%, 8%)"/>
     <ellipse cx="56" cy="32" rx="4.8" ry="4.2" fill="hsl(282, 54%, 8%)"/>
     <circle cx="42" cy="32" r="2.2" fill="hsl(144, 96%, 58%)"/>
     <circle cx="56" cy="32" r="2" fill="hsl(144, 96%, 58%)"/>
     <polygon points="48,37 51,42 45,42" fill="hsl(282, 54%, 8%)"/>
     <path d="M41 47 V53 M46 47 V53 M51 47 V53" stroke="hsl(282, 48%, 12%)" stroke-width="1.5"/>
     <path d="M62 34 C76 28 88 38 106 24 C112 19 118 14 122 10" fill="none" stroke="url(#ca-decay-miasma)" stroke-width="5.2" stroke-linecap="round"/>
     <path d="M64 46 C82 44 92 54 114 40" fill="none" stroke="url(#ca-decay-miasma)" stroke-width="4" stroke-linecap="round"/>
     <polygon points="71,20 79,18 76,26" fill="url(#ca-decay-bone)" stroke="hsl(146, 76%, 56%)" stroke-width="0.8"/>
     <polygon points="74,34 83,31 80,39" fill="url(#ca-decay-bone)" stroke="hsl(292, 68%, 54%)" stroke-width="0.8"/>
     <polygon points="86,24 94,21 91,29" fill="hsl(148, 56%, 44%)" opacity="0.84"/>
     <polygon points="88,43 96,40 93,48" fill="hsl(292, 48%, 38%)" opacity="0.82"/>
     <circle cx="102" cy="18" r="2.4" fill="hsl(142, 96%, 62%)"/>
     <circle cx="110" cy="30" r="2" fill="hsl(298, 86%, 64%)"/>
     <circle cx="96" cy="54" r="2.2" fill="hsl(142, 96%, 58%)"/>
     <circle cx="78" cy="12" r="1.6" fill="hsl(142, 96%, 66%)"/>
     <circle cx="116" cy="48" r="1.5" fill="hsl(296, 86%, 64%)"/>`,
    'hsla(144, 78%, 44%, 0.26)',
    `<radialGradient id="ca-decay-rot" cx="56%" cy="46%" r="54%"><stop offset="0%" stop-color="hsla(144, 92%, 44%, 0.36)"/><stop offset="56%" stop-color="hsla(292, 74%, 30%, 0.24)"/><stop offset="100%" stop-color="hsla(282, 54%, 8%, 0)"/></radialGradient><linearGradient id="ca-decay-bone" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 28%, 78%)"/><stop offset="56%" stop-color="hsl(132, 18%, 44%)"/><stop offset="100%" stop-color="hsl(288, 30%, 20%)"/></linearGradient><linearGradient id="ca-decay-scroll" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(40, 26%, 56%)"/><stop offset="60%" stop-color="hsl(290, 22%, 28%)"/><stop offset="100%" stop-color="hsl(152, 32%, 14%)"/></linearGradient><linearGradient id="ca-decay-miasma" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(144, 92%, 52%, 0.72)"/><stop offset="56%" stop-color="hsla(294, 82%, 52%, 0.56)"/><stop offset="100%" stop-color="hsla(144, 92%, 52%, 0.08)"/></linearGradient>`
  ),
  ascenders_bane: wrapArtSvg(
    'ascenders_bane',
    'hsl(272, 48%, 14%)',
    'hsl(252, 54%, 5%)',
    `<circle cx="64" cy="24" r="30" fill="url(#ca-ascenders_bane-halo)"/>
     <circle cx="64" cy="24" r="20" fill="none" stroke="hsla(292, 96%, 72%, 0.36)" stroke-width="1.2" stroke-dasharray="5 3"/>
     <polygon points="4,72 22,42 36,72" fill="hsl(264, 42%, 9%)" opacity="0.86"/>
     <polygon points="92,72 108,40 124,72" fill="hsl(264, 42%, 9%)" opacity="0.86"/>
     <polygon points="36,72 52,38 56,42 64,28 72,42 76,38 92,72" fill="url(#ca-ascenders_bane-spire)" stroke="hsl(284, 62%, 44%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M52 72 L58 46 L64 36 L70 46 L76 72" fill="none" stroke="hsla(292, 94%, 74%, 0.44)" stroke-width="1.2"/>
     <path d="M64 46 V66 M58 54 H70" stroke="hsl(292, 96%, 68%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M64 3 C78 14 82 29 73 41 C69 46 59 46 55 41 C46 29 50 14 64 3 Z" fill="url(#ca-ascenders_bane-flame)" stroke="hsl(296, 100%, 78%)" stroke-width="1.2"/>
     <path d="M64 12 C72 20 72 32 64 39 C56 32 56 20 64 12 Z" fill="hsl(298, 100%, 92%)" opacity="0.9"/>
     <path d="M50 22 Q44 13 52 8 Q50 16 55 21 Z" fill="hsl(288, 96%, 64%)" opacity="0.82"/>
     <path d="M78 22 Q84 13 76 8 Q78 16 73 21 Z" fill="hsl(288, 96%, 64%)" opacity="0.82"/>
     <polygon points="64,15 76,27 64,39 52,27" fill="none" stroke="url(#ca-ascenders_bane-iron)" stroke-width="2.6" stroke-linejoin="round"/>
     <polygon points="64,15 76,27 64,39 52,27" fill="none" stroke="hsl(296, 100%, 84%)" stroke-width="0.9" stroke-linejoin="round"/>
     <path d="M46 27 H54 M74 27 H82 M64 11 V17 M64 37 V43" stroke="url(#ca-ascenders_bane-iron)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="64" cy="27" r="2.8" fill="hsl(312, 100%, 92%)"/>
     <circle cx="38" cy="22" r="1.8" fill="hsl(296, 100%, 78%)"/>
     <circle cx="90" cy="22" r="1.8" fill="hsl(296, 100%, 78%)"/>
     <circle cx="44" cy="36" r="1.4" fill="hsl(282, 100%, 76%)"/>
     <circle cx="84" cy="36" r="1.4" fill="hsl(282, 100%, 76%)"/>`,
    'hsla(288, 96%, 58%, 0.32)',
    `<radialGradient id="ca-ascenders_bane-halo" cx="50%" cy="50%" r="54%"><stop offset="0%" stop-color="hsla(296, 100%, 76%, 0.62)"/><stop offset="50%" stop-color="hsla(280, 92%, 46%, 0.28)"/><stop offset="100%" stop-color="hsla(256, 68%, 10%, 0)"/></radialGradient><linearGradient id="ca-ascenders_bane-spire" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(274, 34%, 28%)"/><stop offset="56%" stop-color="hsl(266, 40%, 15%)"/><stop offset="100%" stop-color="hsl(254, 48%, 7%)"/></linearGradient><linearGradient id="ca-ascenders_bane-flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(274, 92%, 38%)"/><stop offset="55%" stop-color="hsl(294, 98%, 62%)"/><stop offset="100%" stop-color="hsl(304, 100%, 88%)"/></linearGradient><linearGradient id="ca-ascenders_bane-iron" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(258, 22%, 72%)"/><stop offset="50%" stop-color="hsl(266, 26%, 32%)"/><stop offset="100%" stop-color="hsl(254, 36%, 12%)"/></linearGradient>`
  ),
  necronomicurse: wrapArtSvg(
    'necronomicurse',
    'hsl(280, 44%, 13%)',
    'hsl(168, 40%, 6%)',
    `<ellipse cx="64" cy="36" rx="54" ry="28" fill="url(#ca-necronomicurse-glow)"/>
     <path d="M24 44 Q18 20 34 12 Q30 28 38 38 Z" fill="url(#ca-necronomicurse-fire)" opacity="0.82"/>
     <path d="M102 44 Q110 18 92 10 Q96 26 88 38 Z" fill="url(#ca-necronomicurse-fire)" opacity="0.82"/>
     <path d="M52 24 Q64 2 76 24 Q64 18 52 24 Z" fill="url(#ca-necronomicurse-fire)" opacity="0.9"/>
     <polygon points="34,20 88,14 96,54 42,62" fill="rgba(0,0,0,0.55)" transform="translate(2 2)"/>
     <polygon points="36,54 90,46 95,55 41,63" fill="url(#ca-necronomicurse-pages)" stroke="hsl(154, 100%, 74%)" stroke-width="1.2"/>
     <polygon points="32,19 86,13 94,48 40,56" fill="url(#ca-necronomicurse-cover)" stroke="hsl(288, 52%, 44%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M35 24 L42 54" stroke="hsl(282, 46%, 12%)" stroke-width="3"/>
     <path d="M46 25 L54 24 M48 22 L49 27 M52 22 L53 26 M74 44 L84 42 M76 41 L78 46 M81 40 L83 45" stroke="hsl(38, 34%, 64%)" stroke-width="1.1" stroke-linecap="round"/>
     <circle cx="63" cy="34" r="9" fill="hsl(276, 48%, 12%)" stroke="hsl(156, 92%, 62%)" stroke-width="1.3"/>
     <path d="M59 32 A2 2 0 1 1 61 32 M65 32 A2 2 0 1 1 67 32" stroke="hsl(154, 100%, 74%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M59 38 H67 M61 36 V40 M65 36 V40" stroke="hsl(292, 92%, 72%)" stroke-width="1.2"/>
     <path d="M34 32 L92 26 M40 46 L94 40" fill="none" stroke="hsl(240, 18%, 10%)" stroke-width="5.2" stroke-linecap="round"/>
     <path d="M34 32 L92 26 M40 46 L94 40" fill="none" stroke="hsl(228, 16%, 56%)" stroke-width="2.8" stroke-dasharray="7 3" stroke-linecap="round"/>
     <rect x="86" y="34" width="10" height="11" rx="1.6" fill="hsl(232, 18%, 34%)" stroke="hsl(154, 96%, 72%)" stroke-width="1.1"/>
     <path d="M48 59 Q64 56 84 53" fill="none" stroke="hsl(152, 100%, 84%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M98 46 Q108 38 114 28" fill="none" stroke="url(#ca-necronomicurse-fire)" stroke-width="2.6" stroke-linecap="round"/>
     <circle cx="24" cy="52" r="2" fill="hsl(154, 100%, 70%)"/>
     <circle cx="106" cy="20" r="1.8" fill="hsl(294, 100%, 74%)"/>
     <circle cx="64" cy="8" r="1.8" fill="hsl(154, 100%, 82%)"/>`,
    'hsla(158, 92%, 48%, 0.28)',
    `<radialGradient id="ca-necronomicurse-glow" cx="50%" cy="48%" r="54%"><stop offset="0%" stop-color="hsla(154, 100%, 54%, 0.44)"/><stop offset="52%" stop-color="hsla(286, 86%, 40%, 0.24)"/><stop offset="100%" stop-color="hsla(276, 58%, 8%, 0)"/></radialGradient><linearGradient id="ca-necronomicurse-fire" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(286, 92%, 48%)"/><stop offset="52%" stop-color="hsl(156, 98%, 54%)"/><stop offset="100%" stop-color="hsl(148, 100%, 86%)"/></linearGradient><linearGradient id="ca-necronomicurse-cover" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(318, 34%, 28%)"/><stop offset="56%" stop-color="hsl(286, 38%, 18%)"/><stop offset="100%" stop-color="hsl(270, 48%, 9%)"/></linearGradient><linearGradient id="ca-necronomicurse-pages" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(156, 92%, 44%)"/><stop offset="55%" stop-color="hsl(150, 100%, 74%)"/><stop offset="100%" stop-color="hsl(292, 92%, 62%)"/></linearGradient>`
  ),
  curse_of_the_bell: wrapArtSvg(
    'curse_of_the_bell',
    'hsl(276, 44%, 14%)',
    'hsl(252, 46%, 6%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-curse_of_the_bell-aura)"/>
     <path d="M22 18 Q10 36 22 54 M32 23 Q22 36 32 49" fill="none" stroke="url(#ca-curse_of_the_bell-wave)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M106 18 Q118 36 106 54 M96 23 Q106 36 96 49" fill="none" stroke="url(#ca-curse_of_the_bell-wave)" stroke-width="2.4" stroke-linecap="round"/>
     <rect x="44" y="4" width="40" height="5" rx="1.5" fill="hsl(262, 32%, 14%)" stroke="hsl(38, 44%, 44%)" stroke-width="1"/>
     <path d="M58 9 Q64 16 70 9" fill="none" stroke="hsl(38, 52%, 52%)" stroke-width="2.4"/>
     <path d="M46 47 C48 26 52 15 64 15 C76 15 80 26 82 47 L88 53 H40 Z" fill="rgba(0,0,0,0.52)" transform="translate(2 2)"/>
     <path d="M46 46 C48 25 52 14 64 14 C76 14 80 25 82 46 L88 52 H40 Z" fill="url(#ca-curse_of_the_bell-bronze)" stroke="hsl(38, 56%, 56%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M47 36 H81 M43 48 H85" stroke="hsl(34, 48%, 26%)" stroke-width="1.6"/>
     <polyline points="72,22 66,31 71,38 64,46 69,52" fill="none" stroke="hsl(296, 100%, 74%)" stroke-width="2" stroke-linejoin="round"/>
     <ellipse cx="64" cy="52" rx="22" ry="4" fill="hsl(268, 56%, 10%)" stroke="hsl(38, 52%, 44%)" stroke-width="1"/>
     <circle cx="56" cy="55" r="4.5" fill="hsl(260, 26%, 22%)" stroke="hsl(296, 94%, 72%)" stroke-width="1.2"/>
     <path d="M52 54 C42 62 28 58 22 44 C18 34 26 26 32 34 C30 42 38 48 48 52 Z" fill="url(#ca-curse_of_the_bell-specter)"/>
     <path d="M76 54 C86 62 100 58 106 44 C110 34 102 26 96 34 C98 42 90 48 80 52 Z" fill="url(#ca-curse_of_the_bell-specter)"/>
     <circle cx="25.5" cy="34.5" r="1.3" fill="hsl(52, 100%, 88%)"/>
     <circle cx="28.5" cy="35" r="1.3" fill="hsl(52, 100%, 88%)"/>
     <circle cx="102.5" cy="34.5" r="1.3" fill="hsl(52, 100%, 88%)"/>
     <circle cx="99.5" cy="35" r="1.3" fill="hsl(52, 100%, 88%)"/>
     <path d="M52 22 Q54 32 51 44" fill="none" stroke="hsla(46, 86%, 82%, 0.45)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="56" cy="55" r="1.8" fill="hsl(312, 100%, 86%)"/>
     <circle cx="14" cy="36" r="1.6" fill="hsl(296, 100%, 74%)"/>
     <circle cx="114" cy="36" r="1.6" fill="hsl(296, 100%, 74%)"/>`,
    'hsla(292, 92%, 56%, 0.28)',
    `<radialGradient id="ca-curse_of_the_bell-aura" cx="50%" cy="48%" r="54%"><stop offset="0%" stop-color="hsla(294, 96%, 56%, 0.44)"/><stop offset="56%" stop-color="hsla(272, 82%, 32%, 0.22)"/><stop offset="100%" stop-color="hsla(252, 60%, 8%, 0)"/></radialGradient><linearGradient id="ca-curse_of_the_bell-bronze" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(42, 48%, 54%)"/><stop offset="48%" stop-color="hsl(34, 42%, 30%)"/><stop offset="100%" stop-color="hsl(168, 28%, 14%)"/></linearGradient><linearGradient id="ca-curse_of_the_bell-specter" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsla(286, 94%, 64%, 0.72)"/><stop offset="60%" stop-color="hsla(296, 96%, 76%, 0.48)"/><stop offset="100%" stop-color="hsla(272, 82%, 44%, 0.08)"/></linearGradient><linearGradient id="ca-curse_of_the_bell-wave" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsla(294, 98%, 74%, 0.18)"/><stop offset="50%" stop-color="hsl(298, 100%, 72%)"/><stop offset="100%" stop-color="hsla(274, 92%, 54%, 0.18)"/></linearGradient>`
  ),
  pride: wrapArtSvg(
    'pride',
    'hsl(278, 46%, 15%)',
    'hsl(254, 48%, 6%)',
    `<ellipse cx="64" cy="36" rx="52" ry="28" fill="url(#ca-pride-glow)"/>
     <path d="M32 54 L32 22 C32 7 96 7 96 22 L96 54 Z" fill="url(#ca-pride-mirror)" stroke="url(#ca-pride-gold)" stroke-width="2"/>
     <path d="M38 52 L38 24 C38 13 90 13 90 24 L90 52 Z" fill="none" stroke="hsla(296, 94%, 74%, 0.46)" stroke-width="1.1"/>
     <polygon points="50,36 53,24 59,30 64,19 69,30 75,24 78,36" fill="none" stroke="hsla(46, 100%, 76%, 0.34)" stroke-width="1.1"/>
     <polygon points="44,44 48,26 56,34 64,16 72,34 80,26 84,44" fill="none" stroke="hsla(296, 96%, 76%, 0.56)" stroke-width="1.3"/>
     <polygon points="0,54 128,54 128,72 0,72" fill="hsla(264, 52%, 8%, 0.78)"/>
     <line x1="8" y1="54" x2="120" y2="54" stroke="url(#ca-pride-gold)" stroke-width="1.4"/>
     <polygon points="35,54 41,28 53,39 64,14 75,39 87,28 93,54" fill="rgba(0,0,0,0.52)" transform="translate(2 2)"/>
     <polygon points="35,54 41,28 53,39 64,14 75,39 87,28 93,54" fill="url(#ca-pride-crown)" stroke="url(#ca-pride-gold)" stroke-width="1.6" stroke-linejoin="round"/>
     <polygon points="37,54 43,66 53,60 64,71 75,60 85,66 91,54" fill="url(#ca-pride-crown)" stroke="hsla(46, 96%, 72%, 0.44)" stroke-width="1" opacity="0.45"/>
     <rect x="35" y="48" width="58" height="6" rx="1.2" fill="url(#ca-pride-gold)" stroke="hsl(272, 48%, 16%)" stroke-width="1"/>
     <polyline points="56,35 62,43 59,53" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.5" stroke-linejoin="round"/>
     <polyline points="75,36 70,44 73,53" fill="none" stroke="hsl(296, 100%, 78%)" stroke-width="1.5" stroke-linejoin="round"/>
     <polygon points="64,34 68,40 64,46 60,40" fill="hsl(296, 98%, 68%)" stroke="hsl(52, 100%, 90%)" stroke-width="1"/>
     <circle cx="48" cy="51" r="2" fill="hsl(296, 98%, 70%)"/>
     <circle cx="64" cy="51" r="2.2" fill="hsl(52, 100%, 90%)"/>
     <circle cx="80" cy="51" r="2" fill="hsl(296, 98%, 70%)"/>
     <path d="M64 4 L66 10 L72 12 L66 14 L64 20 L62 14 L56 12 L62 10 Z" fill="hsl(52, 100%, 94%)"/>
     <path d="M22 22 L23.5 26.5 L28 28 L23.5 29.5 L22 34 L20.5 29.5 L16 28 L20.5 26.5 Z" fill="hsl(296, 100%, 82%)"/>
     <path d="M106 22 L107.5 26.5 L112 28 L107.5 29.5 L106 34 L104.5 29.5 L100 28 L104.5 26.5 Z" fill="hsl(48, 100%, 86%)"/>
     <line x1="40" y1="18" x2="54" y2="12" stroke="hsla(0, 0%, 100%, 0.42)" stroke-width="1.5" stroke-linecap="round"/>`,
    'hsla(44, 92%, 58%, 0.26)',
    `<radialGradient id="ca-pride-glow" cx="50%" cy="44%" r="54%"><stop offset="0%" stop-color="hsla(46, 100%, 72%, 0.44)"/><stop offset="52%" stop-color="hsla(292, 88%, 46%, 0.26)"/><stop offset="100%" stop-color="hsla(256, 60%, 8%, 0)"/></radialGradient><linearGradient id="ca-pride-crown" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(276, 36%, 34%)"/><stop offset="50%" stop-color="hsl(268, 42%, 17%)"/><stop offset="100%" stop-color="hsl(256, 52%, 8%)"/></linearGradient><linearGradient id="ca-pride-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 86%)"/><stop offset="52%" stop-color="hsl(42, 92%, 54%)"/><stop offset="100%" stop-color="hsl(28, 76%, 28%)"/></linearGradient><linearGradient id="ca-pride-mirror" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(276, 48%, 24%)"/><stop offset="55%" stop-color="hsl(262, 52%, 12%)"/><stop offset="100%" stop-color="hsl(252, 58%, 6%)"/></linearGradient>`
  ),
};
