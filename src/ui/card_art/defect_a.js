// Bespoke 16:9 SVG card illustrations for Defect cards (part A: 24 cards).
import { wrapArtSvg } from './wrap.js';

export const DEFECT_CARD_ART_A = {
  zap: wrapArtSvg(
    'zap',
    'hsl(216, 66%, 19%)',
    'hsl(232, 62%, 7%)',
    `<circle cx="72" cy="30" r="30" fill="url(#ca-zap-aura)"/>
     <path d="M8 62 L30 50 L48 56 L72 30 L100 18 L122 10" fill="none" stroke="hsl(198, 92%, 62%)" stroke-width="1" opacity="0.38"/>
     <path d="M12 72 L24 52 L39 48 L48 52 L53 45 L58 47 L51 58 L41 64 L32 72 Z" fill="hsl(224, 52%, 10%)" opacity="0.72" transform="translate(2,2)"/>
     <path d="M10 72 L22 50 L37 46 L47 50 L53 43 L58 46 L50 57 L40 63 L31 72 Z" fill="url(#ca-zap-metal)" stroke="hsl(198, 86%, 68%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M22 50 L29 38 L34 40 L28 50 M33 46 L42 35 L46 38 L39 48" fill="url(#ca-zap-metal)" stroke="hsl(200, 88%, 74%)" stroke-width="1.1" stroke-linejoin="round"/>
     <path d="M18 65 L27 56 L35 58 M24 53 L31 52 L37 55" fill="none" stroke="hsl(190, 100%, 76%)" stroke-width="1.2" stroke-linecap="round"/>
     <path d="M28 58 L33 54 L31 61" fill="none" stroke="hsl(48, 100%, 78%)" stroke-width="1.1" stroke-linecap="round"/>
     <circle cx="72" cy="30" r="14.5" fill="url(#ca-zap-orb)" stroke="hsl(194, 100%, 84%)" stroke-width="1.4"/>
     <ellipse cx="72" cy="30" rx="22" ry="9" fill="none" stroke="hsl(192, 100%, 76%)" stroke-width="1.1" opacity="0.75" transform="rotate(-24 72 30)"/>
     <ellipse cx="72" cy="30" rx="20" ry="8" fill="none" stroke="hsl(48, 100%, 76%)" stroke-width="1" opacity="0.65" transform="rotate(28 72 30)"/>
     <path d="M40 44 L51 39 L48 34 L62 32" fill="none" stroke="hsl(192, 100%, 88%)" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M40 44 L51 39 L48 34 L62 32" fill="none" stroke="hsl(52, 100%, 96%)" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M78 22 L92 12 L90 19 L106 10 L118 6" fill="none" stroke="hsl(48, 100%, 78%)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M78 22 L92 12 L90 19 L106 10 L118 6" fill="none" stroke="hsl(54, 100%, 98%)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M84 34 L99 31 L95 39 L114 37 L124 44" fill="none" stroke="hsl(192, 100%, 76%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M75 43 L84 53 L79 56 L92 66" fill="none" stroke="hsl(46, 100%, 76%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M68 23 L73 29 L69 31 L75 38" fill="none" stroke="hsl(54, 100%, 98%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="54" cy="18" r="1.6" fill="hsl(52, 100%, 94%)"/>
     <circle cx="106" cy="24" r="1.8" fill="hsl(192, 100%, 86%)"/>
     <circle cx="96" cy="54" r="1.5" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(196, 100%, 62%, 0.30)',
    `<radialGradient id="ca-zap-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(194, 100%, 82%)" stop-opacity="0.88"/><stop offset="45%" stop-color="hsl(206, 98%, 56%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(226, 78%, 22%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-zap-orb" cx="42%" cy="38%" r="58%"><stop offset="0%" stop-color="hsl(54, 100%, 97%)"/><stop offset="38%" stop-color="hsl(48, 100%, 74%)"/><stop offset="76%" stop-color="hsl(196, 100%, 58%)"/><stop offset="100%" stop-color="hsl(218, 90%, 34%)"/></radialGradient><linearGradient id="ca-zap-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(210, 34%, 44%)"/><stop offset="52%" stop-color="hsl(218, 36%, 24%)"/><stop offset="100%" stop-color="hsl(228, 42%, 14%)"/></linearGradient>`
  ),

  dualcast: wrapArtSvg(
    'dualcast',
    'hsl(214, 68%, 19%)',
    'hsl(246, 58%, 8%)',
    `<path d="M26 20 L128 11 L128 31 L26 26 Z" fill="url(#ca-dualcast-beam1)" opacity="0.82"/>
     <path d="M26 48 L128 41 L128 61 L26 54 Z" fill="url(#ca-dualcast-beam2)" opacity="0.82"/>
     <path d="M24 23 L128 21" stroke="hsl(192, 100%, 96%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M24 51 L128 51" stroke="hsl(54, 100%, 96%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M22 28 Q14 37 22 46" fill="none" stroke="hsl(198, 96%, 72%)" stroke-width="2" stroke-linecap="round"/>
     <ellipse cx="52" cy="22" rx="4" ry="12" fill="none" stroke="hsl(192, 100%, 84%)" stroke-width="1.3" opacity="0.78"/>
     <ellipse cx="86" cy="21" rx="4.5" ry="14" fill="none" stroke="hsl(198, 96%, 76%)" stroke-width="1.1" opacity="0.58"/>
     <ellipse cx="52" cy="51" rx="4" ry="12" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.3" opacity="0.78"/>
     <ellipse cx="86" cy="51" rx="4.5" ry="14" fill="none" stroke="hsl(44, 100%, 72%)" stroke-width="1.1" opacity="0.58"/>
     <path d="M44 24 L52 35 L47 39 L58 49 M78 23 L72 34 L82 38 L76 49 M104 22 L112 34 L106 38 L114 49" fill="none" stroke="hsl(196, 100%, 86%)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
     <polygon points="10,23 22,12 34,23 22,34" fill="hsl(232, 58%, 10%)" opacity="0.7" transform="translate(1.5,2)"/>
     <polygon points="10,51 22,40 34,51 22,62" fill="hsl(232, 58%, 10%)" opacity="0.7" transform="translate(1.5,2)"/>
     <polygon points="10,23 22,12 34,23 22,34" fill="url(#ca-dualcast-prism1)" stroke="hsl(190, 100%, 88%)" stroke-width="1.4" stroke-linejoin="round"/>
     <polygon points="10,51 22,40 34,51 22,62" fill="url(#ca-dualcast-prism2)" stroke="hsl(50, 100%, 88%)" stroke-width="1.4" stroke-linejoin="round"/>
     <polygon points="17,23 22,17 27,23 22,29" fill="hsl(192, 100%, 96%)" opacity="0.88"/>
     <polygon points="17,51 22,45 27,51 22,57" fill="hsl(54, 100%, 96%)" opacity="0.88"/>
     <circle cx="34" cy="23" r="5" fill="url(#ca-dualcast-flare)"/>
     <circle cx="34" cy="51" r="5" fill="url(#ca-dualcast-flare)"/>
     <circle cx="68" cy="12" r="1.4" fill="hsl(192, 100%, 90%)"/>
     <circle cx="98" cy="62" r="1.6" fill="hsl(50, 100%, 88%)"/>
     <circle cx="118" cy="36" r="1.7" fill="hsl(194, 100%, 92%)"/>`,
    'hsla(198, 100%, 62%, 0.30)',
    `<linearGradient id="ca-dualcast-beam1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(192, 100%, 92%)"/><stop offset="45%" stop-color="hsl(196, 100%, 60%)"/><stop offset="100%" stop-color="hsl(214, 96%, 50%)" stop-opacity="0.25"/></linearGradient><linearGradient id="ca-dualcast-beam2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(54, 100%, 94%)"/><stop offset="45%" stop-color="hsl(44, 100%, 62%)"/><stop offset="100%" stop-color="hsl(28, 96%, 52%)" stop-opacity="0.25"/></linearGradient><linearGradient id="ca-dualcast-prism1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(188, 100%, 84%)"/><stop offset="55%" stop-color="hsl(206, 92%, 52%)"/><stop offset="100%" stop-color="hsl(228, 76%, 24%)"/></linearGradient><linearGradient id="ca-dualcast-prism2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 86%)"/><stop offset="55%" stop-color="hsl(42, 96%, 56%)"/><stop offset="100%" stop-color="hsl(268, 66%, 28%)"/></linearGradient><radialGradient id="ca-dualcast-flare" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="55%" stop-color="hsl(194, 100%, 76%)" stop-opacity="0.7"/><stop offset="100%" stop-color="hsl(210, 90%, 50%)" stop-opacity="0"/></radialGradient>`
  ),

  ball_lightning: wrapArtSvg(
    'ball_lightning',
    'hsl(208, 70%, 20%)',
    'hsl(228, 64%, 8%)',
    `<path d="M4 54 Q40 46 84 36 Q42 36 8 28 L0 36 L4 54 Z" fill="url(#ca-ball_lightning-wake)" opacity="0.72"/>
     <circle cx="84" cy="36" r="30" fill="url(#ca-ball_lightning-glow)"/>
     <path d="M10 38 L52 35 M6 47 L46 41 M18 28 L56 30" stroke="hsl(192, 100%, 80%)" stroke-width="1.3" stroke-linecap="round" opacity="0.65"/>
     <circle cx="84" cy="36" r="21" fill="none" stroke="hsl(196, 100%, 72%)" stroke-width="1.1" stroke-dasharray="5 3" opacity="0.72"/>
     <circle cx="84" cy="36" r="16.5" fill="url(#ca-ball_lightning-sphere)" stroke="hsl(52, 100%, 88%)" stroke-width="1.6"/>
     <circle cx="84" cy="36" r="9" fill="hsl(54, 100%, 96%)" opacity="0.88"/>
     <path d="M74 26 L80 34 L76 37 L84 44 M91 25 L86 33 L92 36 L87 45" fill="none" stroke="hsl(194, 100%, 66%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M68 29 L52 21 L57 16 L40 12" fill="none" stroke="hsl(192, 100%, 82%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M72 48 L56 56 L60 61 L42 66" fill="none" stroke="hsl(48, 100%, 78%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M96 24 L108 14 L105 21 L120 12" fill="none" stroke="hsl(50, 100%, 84%)" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M100 37 L113 34 L109 42 L124 41" fill="none" stroke="hsl(190, 100%, 84%)" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M92 50 L102 58 L97 62 L112 68" fill="none" stroke="hsl(196, 100%, 78%)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M100 37 L113 34 L109 42 L124 41" fill="none" stroke="hsl(54, 100%, 98%)" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M106 24 L110 26 L106 28 L104 32 L102 28 L98 26 L102 24 L104 20 Z" fill="hsl(54, 100%, 96%)"/>
     <circle cx="28" cy="22" r="1.6" fill="hsl(192, 100%, 86%)"/>
     <circle cx="32" cy="56" r="1.8" fill="hsl(48, 100%, 84%)"/>
     <circle cx="116" cy="54" r="1.6" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(194, 100%, 62%, 0.34)',
    `<radialGradient id="ca-ball_lightning-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)" stop-opacity="0.92"/><stop offset="46%" stop-color="hsl(196, 100%, 60%)" stop-opacity="0.46"/><stop offset="100%" stop-color="hsl(224, 84%, 24%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-ball_lightning-sphere" cx="44%" cy="40%" r="58%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="42%" stop-color="hsl(46, 100%, 72%)"/><stop offset="74%" stop-color="hsl(194, 100%, 58%)"/><stop offset="100%" stop-color="hsl(218, 92%, 34%)"/></radialGradient><linearGradient id="ca-ball_lightning-wake" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(214, 92%, 44%)" stop-opacity="0"/><stop offset="60%" stop-color="hsl(196, 100%, 62%)" stop-opacity="0.58"/><stop offset="100%" stop-color="hsl(50, 100%, 84%)" stop-opacity="0.92"/></linearGradient>`
  ),

  barrage: wrapArtSvg(
    'barrage',
    'hsl(224, 62%, 18%)',
    'hsl(252, 56%, 8%)',
    `<path d="M12 60 Q20 14 68 10" fill="none" stroke="hsl(196, 92%, 66%)" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.6"/>
     <circle cx="106" cy="48" r="22" fill="url(#ca-barrage-impact)"/>
     <path d="M56 16 L106 48" stroke="hsl(48, 100%, 72%)" stroke-width="3.6" stroke-linecap="round" opacity="0.55"/>
     <path d="M56 16 L106 48" stroke="hsl(54, 100%, 96%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M34 26 L106 48" stroke="hsl(192, 100%, 74%)" stroke-width="3.6" stroke-linecap="round" opacity="0.55"/>
     <path d="M34 26 L106 48" stroke="hsl(190, 100%, 96%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M22 44 L106 48" stroke="hsl(286, 96%, 68%)" stroke-width="3.6" stroke-linecap="round" opacity="0.55"/>
     <path d="M22 44 L106 48" stroke="hsl(298, 100%, 92%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M30 60 L106 48" stroke="hsl(26, 100%, 64%)" stroke-width="3.6" stroke-linecap="round" opacity="0.55"/>
     <path d="M30 60 L106 48" stroke="hsl(46, 100%, 94%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="56" cy="16" r="8" fill="url(#ca-barrage-lightning)" stroke="hsl(50, 100%, 88%)" stroke-width="1.2"/>
     <path d="M54 12 L57 16 L54 17 L58 21" fill="none" stroke="hsl(54, 100%, 98%)" stroke-width="1.3" stroke-linecap="round"/>
     <circle cx="34" cy="26" r="8" fill="url(#ca-barrage-frost)" stroke="hsl(190, 100%, 90%)" stroke-width="1.2"/>
     <polygon points="34,21 38,26 34,31 30,26" fill="hsl(192, 100%, 96%)" opacity="0.82"/>
     <circle cx="22" cy="44" r="8" fill="url(#ca-barrage-dark)" stroke="hsl(288, 96%, 78%)" stroke-width="1.2"/>
     <circle cx="22" cy="44" r="3.4" fill="hsl(266, 78%, 16%)" stroke="hsl(294, 100%, 82%)" stroke-width="0.9"/>
     <circle cx="30" cy="60" r="7.5" fill="url(#ca-barrage-plasma)" stroke="hsl(44, 100%, 86%)" stroke-width="1.2"/>
     <circle cx="30" cy="60" r="3.2" fill="hsl(52, 100%, 95%)"/>
     <path d="M106 31 L109 43 L121 40 L112 48 L122 57 L109 53 L105 65 L102 53 L91 56 L100 47 L92 38 L103 43 Z" fill="hsl(54, 100%, 95%)"/>
     <circle cx="78" cy="16" r="1.5" fill="hsl(50, 100%, 92%)"/>
     <circle cx="88" cy="62" r="1.6" fill="hsl(194, 100%, 88%)"/>`,
    'hsla(206, 96%, 60%, 0.28)',
    `<radialGradient id="ca-barrage-impact" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="45%" stop-color="hsl(196, 100%, 66%)" stop-opacity="0.65"/><stop offset="100%" stop-color="hsl(282, 86%, 46%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-barrage-lightning" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="hsl(54, 100%, 94%)"/><stop offset="55%" stop-color="hsl(46, 100%, 64%)"/><stop offset="100%" stop-color="hsl(204, 92%, 44%)"/></radialGradient><radialGradient id="ca-barrage-frost" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="hsl(192, 100%, 96%)"/><stop offset="55%" stop-color="hsl(196, 98%, 68%)"/><stop offset="100%" stop-color="hsl(214, 86%, 38%)"/></radialGradient><radialGradient id="ca-barrage-dark" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="hsl(296, 100%, 84%)"/><stop offset="55%" stop-color="hsl(276, 86%, 48%)"/><stop offset="100%" stop-color="hsl(258, 76%, 18%)"/></radialGradient><radialGradient id="ca-barrage-plasma" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="hsl(52, 100%, 94%)"/><stop offset="55%" stop-color="hsl(32, 100%, 58%)"/><stop offset="100%" stop-color="hsl(14, 90%, 34%)"/></radialGradient>`
  ),

  beam_cell: wrapArtSvg(
    'beam_cell',
    'hsl(204, 58%, 17%)',
    'hsl(340, 50%, 8%)',
    `<path d="M26 30 L128 24 L128 48 L26 42 Z" fill="url(#ca-beam_cell-beam)" opacity="0.72"/>
     <path d="M24 36 L128 36" stroke="hsl(346, 100%, 66%)" stroke-width="5.5" stroke-linecap="round" opacity="0.82"/>
     <path d="M24 36 L128 36" stroke="hsl(352, 100%, 94%)" stroke-width="2.2" stroke-linecap="round"/>
     <rect x="4" y="16" width="22" height="40" rx="4" fill="hsl(220, 48%, 10%)" opacity="0.7" transform="translate(1.5,2)"/>
     <rect x="4" y="16" width="22" height="40" rx="4" fill="url(#ca-beam_cell-housing)" stroke="hsl(196, 84%, 64%)" stroke-width="1.3"/>
     <path d="M10 16 V56 M16 20 V52" stroke="hsl(204, 48%, 48%)" stroke-width="1.2"/>
     <ellipse cx="26" cy="36" rx="7" ry="15" fill="url(#ca-beam_cell-lens)" stroke="hsl(192, 100%, 80%)" stroke-width="1.4"/>
     <ellipse cx="26" cy="36" rx="3.2" ry="7.5" fill="hsl(348, 100%, 86%)"/>
     <circle cx="92" cy="36" r="19" fill="none" stroke="hsl(192, 100%, 74%)" stroke-width="1.4" stroke-dasharray="10 5"/>
     <circle cx="92" cy="36" r="12" fill="none" stroke="hsl(348, 100%, 72%)" stroke-width="1.3"/>
     <path d="M92 12 V21 M92 51 V60 M68 36 H77 M107 36 H116" stroke="hsl(190, 100%, 82%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M77 21 L82 26 M107 21 L102 26 M77 51 L82 46 M107 51 L102 46" stroke="hsl(350, 100%, 78%)" stroke-width="1.3" stroke-linecap="round"/>
     <circle cx="92" cy="36" r="10" fill="url(#ca-beam_cell-hit)"/>
     <path d="M84 26 L92 36 L101 25 M86 47 L92 36 L104 45" fill="none" stroke="hsl(48, 100%, 88%)" stroke-width="1.2" stroke-linecap="round"/>
     <circle cx="48" cy="24" r="1.5" fill="hsl(192, 100%, 86%)"/>
     <circle cx="62" cy="50" r="1.6" fill="hsl(348, 100%, 84%)"/>
     <circle cx="114" cy="22" r="1.5" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(346, 98%, 58%, 0.30)',
    `<linearGradient id="ca-beam_cell-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(350, 100%, 86%)"/><stop offset="50%" stop-color="hsl(346, 100%, 58%)"/><stop offset="100%" stop-color="hsl(196, 100%, 60%)" stop-opacity="0.2"/></linearGradient><linearGradient id="ca-beam_cell-housing" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(208, 34%, 38%)"/><stop offset="50%" stop-color="hsl(218, 40%, 22%)"/><stop offset="100%" stop-color="hsl(226, 48%, 12%)"/></linearGradient><radialGradient id="ca-beam_cell-lens" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="hsl(354, 100%, 94%)"/><stop offset="48%" stop-color="hsl(346, 100%, 62%)"/><stop offset="100%" stop-color="hsl(202, 90%, 38%)"/></radialGradient><radialGradient id="ca-beam_cell-hit" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 97%)"/><stop offset="48%" stop-color="hsl(348, 100%, 66%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(346, 96%, 46%)" stop-opacity="0"/></radialGradient>`
  ),

  claw: wrapArtSvg(
    'claw',
    'hsl(208, 48%, 16%)',
    'hsl(226, 54%, 7%)',
    `<path d="M6 10 L122 10 L122 62 L6 62 Z" fill="url(#ca-claw-plate)" stroke="hsl(212, 34%, 28%)" stroke-width="1"/>
     <path d="M8 24 H120 M8 48 H120 M42 10 V62 M86 10 V62" stroke="hsl(216, 42%, 12%)" stroke-width="1.2" opacity="0.65"/>
     <circle cx="14" cy="16" r="1.4" fill="hsl(206, 36%, 42%)"/><circle cx="114" cy="16" r="1.4" fill="hsl(206, 36%, 42%)"/>
     <circle cx="14" cy="56" r="1.4" fill="hsl(206, 36%, 42%)"/><circle cx="114" cy="56" r="1.4" fill="hsl(206, 36%, 42%)"/>
     <path d="M98 6 Q64 20 18 52 Q58 30 104 12 Z" fill="url(#ca-claw-slash)" opacity="0.92"/>
     <path d="M110 14 Q74 30 26 62 Q70 40 116 20 Z" fill="url(#ca-claw-slash)" opacity="0.96"/>
     <path d="M116 28 Q84 44 46 68 Q84 52 122 35 Z" fill="url(#ca-claw-slash)" opacity="0.9"/>
     <path d="M99 8 Q62 24 22 50" fill="none" stroke="hsl(186, 100%, 96%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M111 16 Q72 34 30 60" fill="none" stroke="hsl(186, 100%, 98%)" stroke-width="2.5" stroke-linecap="round"/>
     <path d="M118 30 Q84 46 50 66" fill="none" stroke="hsl(186, 100%, 96%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M18 52 L10 58 L22 55 Z M26 62 L17 68 L30 64 Z M46 68 L38 72 L52 69 Z" fill="hsl(190, 100%, 90%)"/>
     <polygon points="50,18 58,15 55,24 47,23" fill="hsl(214, 38%, 28%)" stroke="hsl(188, 100%, 76%)" stroke-width="0.9"/>
     <polygon points="88,48 96,45 94,54 85,53" fill="hsl(214, 38%, 28%)" stroke="hsl(188, 100%, 76%)" stroke-width="0.9"/>
     <path d="M36 30 L28 24 M74 52 L82 60 M104 10 L114 5" stroke="hsl(186, 100%, 88%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="44" cy="40" r="1.6" fill="hsl(52, 100%, 94%)"/>
     <circle cx="80" cy="24" r="1.8" fill="hsl(186, 100%, 92%)"/>`,
    'hsla(188, 100%, 60%, 0.30)',
    `<linearGradient id="ca-claw-plate" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(212, 30%, 24%)"/><stop offset="52%" stop-color="hsl(218, 36%, 15%)"/><stop offset="100%" stop-color="hsl(226, 44%, 10%)"/></linearGradient><linearGradient id="ca-claw-slash" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(184, 100%, 92%)"/><stop offset="48%" stop-color="hsl(190, 100%, 58%)"/><stop offset="100%" stop-color="hsl(212, 96%, 46%)" stop-opacity="0.35"/></linearGradient>`
  ),

  cold_snap: wrapArtSvg(
    'cold_snap',
    'hsl(198, 70%, 20%)',
    'hsl(222, 64%, 9%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-cold_snap-glow)"/>
     <circle cx="64" cy="36" r="24" fill="none" stroke="hsl(192, 100%, 84%)" stroke-width="1.1" stroke-dasharray="4 3" opacity="0.62"/>
     <circle cx="64" cy="36" r="15" fill="none" stroke="hsl(188, 100%, 92%)" stroke-width="1" opacity="0.55"/>
     <polygon points="64,34 59,10 64,4 69,10" fill="url(#ca-cold_snap-ice)" stroke="hsl(190, 100%, 94%)" stroke-width="1"/>
     <polygon points="64,38 59,62 64,68 69,62" fill="url(#ca-cold_snap-ice)" stroke="hsl(190, 100%, 94%)" stroke-width="1"/>
     <polygon points="62,36 22,26 12,30 24,38" fill="url(#ca-cold_snap-ice)" stroke="hsl(192, 100%, 92%)" stroke-width="1"/>
     <polygon points="66,36 106,26 116,30 104,38" fill="url(#ca-cold_snap-ice)" stroke="hsl(192, 100%, 92%)" stroke-width="1"/>
     <polygon points="62,34 36,12 28,11 40,26" fill="url(#ca-cold_snap-ice2)" stroke="hsl(190, 100%, 94%)" stroke-width="1"/>
     <polygon points="66,34 92,12 100,11 88,26" fill="url(#ca-cold_snap-ice2)" stroke="hsl(190, 100%, 94%)" stroke-width="1"/>
     <polygon points="62,38 34,54 26,60 44,48" fill="url(#ca-cold_snap-ice2)" stroke="hsl(190, 100%, 94%)" stroke-width="1"/>
     <polygon points="66,38 94,54 102,60 84,48" fill="url(#ca-cold_snap-ice2)" stroke="hsl(190, 100%, 94%)" stroke-width="1"/>
     <polygon points="64,23 73,36 64,49 55,36" fill="url(#ca-cold_snap-core)" stroke="hsl(192, 100%, 98%)" stroke-width="1.3"/>
     <path d="M64 26 L68 36 L64 46 L60 36 Z" fill="hsl(194, 100%, 98%)" opacity="0.88"/>
     <polygon points="18,16 24,14 21,21" fill="hsl(190, 100%, 90%)"/>
     <polygon points="108,16 114,18 107,23" fill="hsl(190, 100%, 90%)"/>
     <polygon points="20,52 25,48 24,56" fill="hsl(194, 100%, 86%)"/>
     <polygon points="108,52 115,50 111,58" fill="hsl(194, 100%, 86%)"/>
     <circle cx="44" cy="12" r="1.5" fill="hsl(192, 100%, 96%)"/>
     <circle cx="86" cy="60" r="1.6" fill="hsl(192, 100%, 96%)"/>`,
    'hsla(192, 100%, 72%, 0.34)',
    `<radialGradient id="ca-cold_snap-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(192, 100%, 96%)" stop-opacity="0.9"/><stop offset="48%" stop-color="hsl(196, 98%, 68%)" stop-opacity="0.42"/><stop offset="100%" stop-color="hsl(216, 82%, 30%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-cold_snap-ice" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(190, 100%, 96%)"/><stop offset="52%" stop-color="hsl(196, 96%, 68%)"/><stop offset="100%" stop-color="hsl(214, 86%, 40%)"/></linearGradient><linearGradient id="ca-cold_snap-ice2" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(186, 100%, 90%)"/><stop offset="58%" stop-color="hsl(202, 92%, 58%)"/><stop offset="100%" stop-color="hsl(220, 78%, 32%)"/></linearGradient><radialGradient id="ca-cold_snap-core" cx="44%" cy="38%" r="58%"><stop offset="0%" stop-color="hsl(192, 100%, 99%)"/><stop offset="56%" stop-color="hsl(192, 100%, 78%)"/><stop offset="100%" stop-color="hsl(208, 92%, 48%)"/></radialGradient>`
  ),

  compile_driver: wrapArtSvg(
    'compile_driver',
    'hsl(196, 64%, 17%)',
    'hsl(232, 62%, 7%)',
    `<path d="M0 58 L128 58 M0 65 L128 65 M14 72 L38 50 M38 72 L52 50 M64 72 V50 M90 72 L76 50 M114 72 L90 50" stroke="hsl(192, 96%, 60%)" stroke-width="0.85" opacity="0.35"/>
     <rect x="10" y="10" width="22" height="14" rx="2" fill="hsl(202, 74%, 18%)" stroke="hsl(188, 100%, 70%)" stroke-width="1" opacity="0.82"/>
     <path d="M14 14 H28 M14 18 H23 M14 21 H26" stroke="hsl(186, 100%, 84%)" stroke-width="1.2" stroke-linecap="round"/>
     <rect x="96" y="10" width="22" height="14" rx="2" fill="hsl(202, 74%, 18%)" stroke="hsl(188, 100%, 70%)" stroke-width="1" opacity="0.82"/>
     <path d="M100 14 H114 M100 18 H110 M100 21 H114" stroke="hsl(50, 100%, 82%)" stroke-width="1.2" stroke-linecap="round"/>
     <path d="M16 40 H44 L54 36" fill="none" stroke="hsl(48, 100%, 72%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M16 50 H40 L54 40" fill="none" stroke="hsl(190, 100%, 76%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M112 40 H84 L74 36" fill="none" stroke="hsl(288, 96%, 72%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M112 50 H88 L74 40" fill="none" stroke="hsl(158, 96%, 70%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="16" cy="40" r="4.5" fill="hsl(48, 100%, 72%)" stroke="hsl(54, 100%, 94%)" stroke-width="1"/>
     <circle cx="16" cy="50" r="4.5" fill="hsl(192, 100%, 72%)" stroke="hsl(192, 100%, 96%)" stroke-width="1"/>
     <circle cx="112" cy="40" r="4.5" fill="hsl(286, 92%, 68%)" stroke="hsl(296, 100%, 90%)" stroke-width="1"/>
     <circle cx="112" cy="50" r="4.5" fill="hsl(162, 92%, 62%)" stroke="hsl(168, 100%, 90%)" stroke-width="1"/>
     <polygon points="64,16 80,26 80,46 64,56 48,46 48,26" fill="hsl(224, 62%, 10%)" opacity="0.72" transform="translate(1.5,2)"/>
     <polygon points="64,16 80,26 80,46 64,56 48,46 48,26" fill="url(#ca-compile_driver-core)" stroke="hsl(188, 100%, 84%)" stroke-width="1.5"/>
     <polygon points="64,23 73,29 73,43 64,49 55,43 55,29" fill="none" stroke="hsl(50, 100%, 82%)" stroke-width="1.1"/>
     <path d="M59 36 L63 32 M59 36 L63 40 M69 36 L65 32 M69 36 L65 40" stroke="hsl(54, 100%, 98%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M64 16 V6 M56 11 L64 5 L72 11" fill="none" stroke="hsl(188, 100%, 88%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="42" cy="18" r="1.5" fill="hsl(188, 100%, 90%)"/>
     <circle cx="86" cy="18" r="1.5" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(188, 100%, 58%, 0.28)',
    `<radialGradient id="ca-compile_driver-core" cx="50%" cy="46%" r="58%"><stop offset="0%" stop-color="hsl(186, 100%, 92%)"/><stop offset="48%" stop-color="hsl(196, 98%, 54%)"/><stop offset="100%" stop-color="hsl(234, 78%, 22%)"/></radialGradient>`
  ),

  ftl: wrapArtSvg(
    'ftl',
    'hsl(228, 70%, 19%)',
    'hsl(252, 66%, 7%)',
    `<path d="M0 16 L96 28 M0 28 L102 33 M0 44 L102 39 M0 58 L96 44" stroke="hsl(198, 96%, 72%)" stroke-width="1" opacity="0.45"/>
     <path d="M4 22 L116 34 L116 38 L4 50 Z" fill="url(#ca-ftl-streak)" opacity="0.88"/>
     <ellipse cx="42" cy="36" rx="8" ry="24" fill="none" stroke="hsl(196, 100%, 74%)" stroke-width="1.3" opacity="0.48"/>
     <ellipse cx="72" cy="36" rx="10" ry="29" fill="none" stroke="hsl(190, 100%, 82%)" stroke-width="1.5" opacity="0.65"/>
     <path d="M22 36 L34 26 L40 31 L36 36 L40 41 L34 46 Z" fill="hsl(204, 96%, 68%)" opacity="0.28"/>
     <path d="M46 36 L60 24 L68 30 L63 36 L68 42 L60 48 Z" fill="hsl(196, 100%, 76%)" opacity="0.52"/>
     <path d="M72 36 L88 22 L98 30 L92 36 L98 42 L88 50 Z" fill="url(#ca-ftl-head)" stroke="hsl(190, 100%, 96%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M12 36 L118 36" stroke="hsl(196, 100%, 98%)" stroke-width="3.2" stroke-linecap="round"/>
     <circle cx="106" cy="36" r="14" fill="url(#ca-ftl-flare)"/>
     <path d="M106 20 L108 33 L122 36 L108 39 L106 52 L104 39 L90 36 L104 33 Z" fill="hsl(192, 100%, 98%)"/>
     <path d="M18 14 L52 14 M10 60 L58 60 M64 12 L94 12 M70 62 L106 62" stroke="hsl(194, 100%, 88%)" stroke-width="1.3" stroke-linecap="round" opacity="0.72"/>
     <circle cx="28" cy="18" r="1.4" fill="hsl(52, 100%, 96%)"/>
     <circle cx="84" cy="16" r="1.6" fill="hsl(192, 100%, 96%)"/>
     <circle cx="52" cy="56" r="1.5" fill="hsl(198, 100%, 88%)"/>`,
    'hsla(198, 100%, 66%, 0.34)',
    `<linearGradient id="ca-ftl-streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(236, 90%, 48%)" stop-opacity="0"/><stop offset="52%" stop-color="hsl(198, 100%, 64%)" stop-opacity="0.65"/><stop offset="100%" stop-color="hsl(192, 100%, 96%)" stop-opacity="0.96"/></linearGradient><linearGradient id="ca-ftl-head" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(206, 98%, 58%)"/><stop offset="62%" stop-color="hsl(190, 100%, 86%)"/><stop offset="100%" stop-color="hsl(54, 100%, 98%)"/></linearGradient><radialGradient id="ca-ftl-flare" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 99%)"/><stop offset="45%" stop-color="hsl(192, 100%, 80%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(220, 96%, 54%)" stop-opacity="0"/></radialGradient>`
  ),

  go_for_the_eyes: wrapArtSvg(
    'go_for_the_eyes',
    'hsl(236, 52%, 16%)',
    'hsl(214, 62%, 7%)',
    `<path d="M52 10 Q86 2 118 14 L126 36 L118 62 Q86 70 54 58 L46 36 Z" fill="hsl(236, 46%, 10%)" stroke="hsl(224, 38%, 24%)" stroke-width="1.2"/>
     <path d="M58 38 Q86 15 114 38 Q86 60 58 38 Z" fill="hsl(352, 68%, 12%)" stroke="hsl(22, 86%, 56%)" stroke-width="1.6"/>
     <circle cx="86" cy="38" r="14" fill="url(#ca-go_for_the_eyes-iris)" stroke="hsl(44, 100%, 78%)" stroke-width="1.3"/>
     <path d="M86 27 L90 38 L86 49 L82 38 Z" fill="hsl(348, 80%, 10%)"/>
     <circle cx="86" cy="38" r="18" fill="url(#ca-go_for_the_eyes-flash)"/>
     <path d="M4 10 L86 38" stroke="hsl(194, 100%, 66%)" stroke-width="6" stroke-linecap="round" opacity="0.48"/>
     <path d="M4 10 L86 38" stroke="hsl(188, 100%, 96%)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="86" cy="38" r="9" fill="none" stroke="hsl(188, 100%, 84%)" stroke-width="1.3"/>
     <circle cx="86" cy="38" r="16" fill="none" stroke="hsl(194, 100%, 74%)" stroke-width="1" stroke-dasharray="5 3" opacity="0.72"/>
     <path d="M86 24 L88 35 L99 33 L90 39 L97 48 L86 42 L76 48 L82 39 L73 33 L84 35 Z" fill="hsl(190, 100%, 96%)"/>
     <path d="M62 18 L72 24 M110 20 L101 26 M62 56 L72 50 M110 56 L101 50" stroke="hsl(190, 100%, 80%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M22 16 L32 20 M38 22 L48 25" stroke="hsl(192, 100%, 88%)" stroke-width="1.2" stroke-linecap="round"/>
     <circle cx="34" cy="48" r="1.5" fill="hsl(192, 100%, 84%)"/>
     <circle cx="114" cy="14" r="1.6" fill="hsl(44, 100%, 86%)"/>`,
    'hsla(194, 100%, 60%, 0.30)',
    `<radialGradient id="ca-go_for_the_eyes-iris" cx="50%" cy="50%" r="54%"><stop offset="0%" stop-color="hsl(48, 100%, 88%)"/><stop offset="52%" stop-color="hsl(18, 98%, 54%)"/><stop offset="100%" stop-color="hsl(348, 86%, 28%)"/></radialGradient><radialGradient id="ca-go_for_the_eyes-flash" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(188, 100%, 98%)"/><stop offset="44%" stop-color="hsl(194, 100%, 68%)" stop-opacity="0.74"/><stop offset="100%" stop-color="hsl(214, 96%, 48%)" stop-opacity="0"/></radialGradient>`
  ),

  rebound: wrapArtSvg(
    'rebound',
    'hsl(206, 62%, 18%)',
    'hsl(230, 58%, 8%)',
    `<path d="M12 16 L84 36 L26 60" fill="none" stroke="hsl(194, 100%, 64%)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.42"/>
     <path d="M12 16 L84 36 L26 60" fill="none" stroke="url(#ca-rebound-trail)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
     <polygon points="84,10 108,22 108,50 84,62 72,50 72,22" fill="hsl(222, 58%, 10%)" opacity="0.68" transform="translate(2,2)"/>
     <polygon points="84,10 108,22 108,50 84,62 72,50 72,22" fill="url(#ca-rebound-shield)" stroke="hsl(188, 100%, 84%)" stroke-width="1.6" stroke-linejoin="round"/>
     <polygon points="85,18 101,26 101,46 85,54 77,46 77,26" fill="none" stroke="hsl(192, 100%, 92%)" stroke-width="1" opacity="0.72"/>
     <path d="M77 26 L101 46 M101 26 L77 46" stroke="hsl(190, 100%, 84%)" stroke-width="0.9" opacity="0.45"/>
     <circle cx="80" cy="36" r="13" fill="url(#ca-rebound-impact)"/>
     <path d="M80 26 L82 34 L90 36 L82 38 L80 46 L78 38 L70 36 L78 34 Z" fill="hsl(54, 100%, 96%)"/>
     <circle cx="26" cy="60" r="8" fill="url(#ca-rebound-bolt)" stroke="hsl(52, 100%, 92%)" stroke-width="1.3"/>
     <circle cx="26" cy="60" r="3.6" fill="hsl(56, 100%, 98%)"/>
     <path d="M36 52 L22 62 L38 64" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M52 24 L62 27 M58 46 L48 50" stroke="hsl(50, 100%, 88%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="44" cy="14" r="1.5" fill="hsl(192, 100%, 88%)"/>
     <circle cx="114" cy="18" r="1.6" fill="hsl(188, 100%, 92%)"/>
     <circle cx="64" cy="60" r="1.5" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(192, 100%, 62%, 0.30)',
    `<linearGradient id="ca-rebound-trail" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(192, 100%, 76%)"/><stop offset="52%" stop-color="hsl(52, 100%, 92%)"/><stop offset="100%" stop-color="hsl(46, 100%, 72%)"/></linearGradient><linearGradient id="ca-rebound-shield" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(188, 100%, 84%)" stop-opacity="0.72"/><stop offset="50%" stop-color="hsl(204, 92%, 48%)" stop-opacity="0.56"/><stop offset="100%" stop-color="hsl(226, 78%, 26%)" stop-opacity="0.82"/></linearGradient><radialGradient id="ca-rebound-impact" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 98%)"/><stop offset="48%" stop-color="hsl(190, 100%, 76%)" stop-opacity="0.74"/><stop offset="100%" stop-color="hsl(210, 96%, 50%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-rebound-bolt" cx="42%" cy="40%" r="58%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="55%" stop-color="hsl(46, 100%, 68%)"/><stop offset="100%" stop-color="hsl(196, 100%, 54%)"/></radialGradient>`
  ),

  streamline: wrapArtSvg(
    'streamline',
    'hsl(198, 66%, 18%)',
    'hsl(220, 62%, 8%)',
    `<path d="M6 66 Q48 48 118 10" fill="none" stroke="hsl(194, 100%, 68%)" stroke-width="10" stroke-linecap="round" opacity="0.22"/>
     <ellipse cx="40" cy="48" rx="7" ry="18" fill="none" stroke="hsl(192, 100%, 80%)" stroke-width="1.3" opacity="0.62" transform="rotate(-28 40 48)"/>
     <ellipse cx="66" cy="35" rx="8" ry="22" fill="none" stroke="hsl(188, 100%, 86%)" stroke-width="1.5" opacity="0.76" transform="rotate(-28 66 35)"/>
     <ellipse cx="92" cy="22" rx="6.5" ry="16" fill="none" stroke="hsl(192, 100%, 90%)" stroke-width="1.3" opacity="0.68" transform="rotate(-28 92 22)"/>
     <path d="M12 62 L92 18 L116 11 L99 28 L20 67 Z" fill="hsl(222, 58%, 10%)" opacity="0.7" transform="translate(2,2.5)"/>
     <path d="M12 61 L92 17 L117 10 L98 27 L20 66 Z" fill="url(#ca-streamline-lance)" stroke="hsl(188, 100%, 90%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M22 58 L110 13" stroke="hsl(190, 100%, 98%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M36 38 L52 37 L42 48 Z M52 54 L66 47 L56 59 Z" fill="hsl(198, 86%, 58%)" stroke="hsl(188, 100%, 88%)" stroke-width="0.9"/>
     <path d="M8 52 Q36 36 74 20 M24 68 Q62 52 104 30" fill="none" stroke="hsl(192, 100%, 84%)" stroke-width="1.3" stroke-linecap="round" opacity="0.74"/>
     <circle cx="114" cy="11" r="10" fill="url(#ca-streamline-tip)"/>
     <path d="M114 3 L116 10 L123 11 L116 13 L114 20 L112 13 L105 11 L112 10 Z" fill="hsl(54, 100%, 98%)"/>
     <circle cx="24" cy="24" r="1.5" fill="hsl(192, 100%, 88%)"/>
     <circle cx="96" cy="54" r="1.6" fill="hsl(188, 100%, 86%)"/>`,
    'hsla(192, 100%, 62%, 0.30)',
    `<linearGradient id="ca-streamline-lance" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(214, 72%, 34%)"/><stop offset="48%" stop-color="hsl(194, 98%, 62%)"/><stop offset="100%" stop-color="hsl(186, 100%, 96%)"/></linearGradient><radialGradient id="ca-streamline-tip" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 99%)"/><stop offset="48%" stop-color="hsl(190, 100%, 78%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(206, 94%, 48%)" stop-opacity="0"/></radialGradient>`
  ),

  sweeping_beam: wrapArtSvg(
    'sweeping_beam',
    'hsl(200, 66%, 17%)',
    'hsl(228, 62%, 8%)',
    `<path d="M18 36 L86 4 Q118 28 110 66 L18 36 Z" fill="url(#ca-sweeping_beam-fan)" opacity="0.78"/>
     <path d="M84 4 Q118 28 108 66" fill="none" stroke="hsl(188, 100%, 74%)" stroke-width="7" stroke-linecap="round" opacity="0.46"/>
     <path d="M84 4 Q118 28 108 66" fill="none" stroke="hsl(186, 100%, 96%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M18 36 L98 16 M18 36 L112 36 M18 36 L104 56" stroke="hsl(188, 100%, 88%)" stroke-width="1.2" opacity="0.62"/>
     <path d="M18 36 L108 62" stroke="hsl(190, 100%, 96%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M56 22 Q74 36 68 54 M74 14 Q96 34 88 60" fill="none" stroke="hsl(190, 100%, 84%)" stroke-width="1" stroke-dasharray="4 3" opacity="0.58"/>
     <polygon points="4,22 20,26 24,36 20,46 4,50" fill="hsl(222, 56%, 10%)" opacity="0.72" transform="translate(1.5,2)"/>
     <polygon points="4,22 20,26 24,36 20,46 4,50" fill="url(#ca-sweeping_beam-turret)" stroke="hsl(190, 100%, 78%)" stroke-width="1.3"/>
     <circle cx="19" cy="36" r="6" fill="url(#ca-sweeping_beam-emit)" stroke="hsl(186, 100%, 94%)" stroke-width="1.1"/>
     <path d="M108 62 L117 58 M108 62 L115 68 M112 34 L122 30 M96 14 L106 8" stroke="hsl(50, 100%, 88%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="114" cy="22" r="1.8" fill="hsl(188, 100%, 94%)"/>
     <circle cx="116" cy="48" r="1.7" fill="hsl(52, 100%, 94%)"/>
     <circle cx="54" cy="14" r="1.4" fill="hsl(192, 100%, 86%)"/>`,
    'hsla(190, 100%, 60%, 0.32)',
    `<linearGradient id="ca-sweeping_beam-fan" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsl(188, 100%, 94%)" stop-opacity="0.9"/><stop offset="56%" stop-color="hsl(194, 100%, 58%)" stop-opacity="0.52"/><stop offset="100%" stop-color="hsl(186, 100%, 88%)" stop-opacity="0.86"/></linearGradient><linearGradient id="ca-sweeping_beam-turret" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(208, 38%, 42%)"/><stop offset="55%" stop-color="hsl(218, 42%, 22%)"/><stop offset="100%" stop-color="hsl(228, 48%, 12%)"/></linearGradient><radialGradient id="ca-sweeping_beam-emit" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="hsl(56, 100%, 99%)"/><stop offset="55%" stop-color="hsl(188, 100%, 72%)"/><stop offset="100%" stop-color="hsl(208, 92%, 44%)"/></radialGradient>`
  ),

  charge_battery: wrapArtSvg(
    'charge_battery',
    'hsl(210, 60%, 18%)',
    'hsl(228, 56%, 8%)',
    `<circle cx="64" cy="36" r="29" fill="url(#ca-charge_battery-aura)"/>
     <ellipse cx="64" cy="59" rx="28" ry="7" fill="none" stroke="hsl(192, 100%, 72%)" stroke-width="1.2" opacity="0.65"/>
     <ellipse cx="64" cy="14" rx="22" ry="5.5" fill="none" stroke="hsl(48, 100%, 76%)" stroke-width="1.1" opacity="0.6"/>
     <rect x="44" y="13" width="40" height="46" rx="6" fill="hsl(224, 54%, 10%)" opacity="0.72" transform="translate(2,2)"/>
     <rect x="46" y="16" width="36" height="40" rx="4" fill="url(#ca-charge_battery-cell)" stroke="hsl(188, 100%, 84%)" stroke-width="1.4"/>
     <rect x="50" y="21" width="28" height="6" rx="1.5" fill="hsl(184, 100%, 88%)" opacity="0.88"/>
     <rect x="50" y="30" width="28" height="6" rx="1.5" fill="hsl(186, 100%, 92%)" opacity="0.94"/>
     <rect x="50" y="39" width="28" height="6" rx="1.5" fill="hsl(48, 100%, 82%)" opacity="0.92"/>
     <rect x="50" y="48" width="28" height="5" rx="1.5" fill="hsl(46, 100%, 74%)" opacity="0.82"/>
     <rect x="42" y="12" width="44" height="8" rx="3" fill="url(#ca-charge_battery-brass)" stroke="hsl(44, 96%, 76%)" stroke-width="1.1"/>
     <rect x="54" y="7" width="20" height="5" rx="2" fill="url(#ca-charge_battery-brass)" stroke="hsl(48, 100%, 82%)" stroke-width="1"/>
     <rect x="42" y="52" width="44" height="8" rx="3" fill="url(#ca-charge_battery-brass)" stroke="hsl(44, 96%, 76%)" stroke-width="1.1"/>
     <path d="M40 24 Q64 29 88 24 M40 36 Q64 41 88 36 M40 48 Q64 53 88 48" fill="none" stroke="hsl(38, 92%, 64%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M22 30 L34 26 L31 33 L42 32 M106 30 L94 26 L97 33 L86 32 M26 48 L36 44 L34 50 L44 48 M102 48 L92 44 L94 50 L84 48" fill="none" stroke="hsl(190, 100%, 84%)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="22" cy="20" r="1.6" fill="hsl(50, 100%, 90%)"/>
     <circle cx="106" cy="20" r="1.6" fill="hsl(190, 100%, 90%)"/>
     <circle cx="102" cy="58" r="1.5" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(188, 100%, 58%, 0.30)',
    `<radialGradient id="ca-charge_battery-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(186, 100%, 86%)" stop-opacity="0.82"/><stop offset="52%" stop-color="hsl(196, 100%, 56%)" stop-opacity="0.32"/><stop offset="100%" stop-color="hsl(224, 78%, 22%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-charge_battery-cell" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(206, 90%, 34%)"/><stop offset="50%" stop-color="hsl(188, 100%, 60%)"/><stop offset="100%" stop-color="hsl(206, 90%, 34%)"/></linearGradient><linearGradient id="ca-charge_battery-brass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(32, 66%, 32%)"/><stop offset="48%" stop-color="hsl(44, 90%, 62%)"/><stop offset="100%" stop-color="hsl(28, 62%, 26%)"/></linearGradient>`
  ),

  coolheaded: wrapArtSvg(
    'coolheaded',
    'hsl(194, 62%, 20%)',
    'hsl(216, 58%, 9%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-coolheaded-aura)"/>
     <circle cx="64" cy="36" r="26" fill="none" stroke="hsl(190, 100%, 84%)" stroke-width="1" stroke-dasharray="3 4" opacity="0.62"/>
     <circle cx="64" cy="36" r="19" fill="none" stroke="hsl(186, 100%, 90%)" stroke-width="1.2" opacity="0.72"/>
     <path d="M8 58 Q36 46 64 56 Q92 46 120 58 Q92 66 64 62 Q36 66 8 58 Z" fill="url(#ca-coolheaded-mist)" opacity="0.62"/>
     <path d="M18 64 Q48 54 64 62 Q82 54 110 64" fill="none" stroke="hsl(190, 100%, 90%)" stroke-width="1.2" opacity="0.6"/>
     <polygon points="64,12 84,24 84,48 64,60 44,48 44,24" fill="hsl(214, 62%, 12%)" opacity="0.62" transform="translate(1.5,2)"/>
     <polygon points="64,12 84,24 84,48 64,60 44,48 44,24" fill="url(#ca-coolheaded-prism)" stroke="hsl(188, 100%, 94%)" stroke-width="1.5" stroke-linejoin="round"/>
     <path d="M64 12 L64 60 M44 24 L84 48 M84 24 L44 48" stroke="hsl(190, 100%, 96%)" stroke-width="0.9" opacity="0.56"/>
     <polygon points="64,21 75,28 75,44 64,51 53,44 53,28" fill="url(#ca-coolheaded-core)" stroke="hsl(192, 100%, 98%)" stroke-width="1.1"/>
     <circle cx="64" cy="36" r="4.5" fill="hsl(192, 100%, 99%)"/>
     <path d="M24 22 V30 M20 26 H28 M21 23 L27 29 M27 23 L21 29" stroke="hsl(190, 100%, 92%)" stroke-width="1.1" stroke-linecap="round"/>
     <path d="M104 22 V30 M100 26 H108 M101 23 L107 29 M107 23 L101 29" stroke="hsl(190, 100%, 92%)" stroke-width="1.1" stroke-linecap="round"/>
     <circle cx="34" cy="46" r="1.6" fill="hsl(190, 100%, 94%)"/>
     <circle cx="94" cy="46" r="1.6" fill="hsl(190, 100%, 94%)"/>
     <circle cx="64" cy="7" r="1.6" fill="hsl(192, 100%, 96%)"/>`,
    'hsla(190, 100%, 74%, 0.30)',
    `<radialGradient id="ca-coolheaded-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(188, 100%, 94%)" stop-opacity="0.82"/><stop offset="50%" stop-color="hsl(194, 98%, 68%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(214, 78%, 26%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-coolheaded-prism" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(186, 100%, 94%)"/><stop offset="50%" stop-color="hsl(196, 94%, 64%)"/><stop offset="100%" stop-color="hsl(214, 86%, 38%)"/></linearGradient><radialGradient id="ca-coolheaded-core" cx="44%" cy="38%" r="58%"><stop offset="0%" stop-color="hsl(192, 100%, 99%)"/><stop offset="60%" stop-color="hsl(190, 100%, 78%)"/><stop offset="100%" stop-color="hsl(204, 92%, 52%)"/></radialGradient><linearGradient id="ca-coolheaded-mist" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(192, 100%, 88%)" stop-opacity="0.1"/><stop offset="50%" stop-color="hsl(190, 100%, 92%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(192, 100%, 88%)" stop-opacity="0.1"/></linearGradient>`
  ),

  hologram: wrapArtSvg(
    'hologram',
    'hsl(196, 62%, 16%)',
    'hsl(226, 62%, 7%)',
    `<polygon points="48,60 80,60 106,8 22,8" fill="url(#ca-hologram-cone)" opacity="0.62"/>
     <path d="M28 16 H100 M32 24 H96 M36 32 H92 M40 40 H88 M44 48 H84" stroke="hsl(186, 100%, 82%)" stroke-width="0.7" opacity="0.32"/>
     <polygon points="46,12 84,12 80,46 42,46" fill="url(#ca-hologram-card)" stroke="hsl(184, 100%, 88%)" stroke-width="1.5" stroke-linejoin="round"/>
     <polygon points="51,17 79,17 76,34 48,34" fill="hsl(190, 100%, 74%)" fill-opacity="0.22" stroke="hsl(186, 100%, 92%)" stroke-width="1"/>
     <polygon points="64,20 70,25.5 64,31 58,25.5" fill="hsl(186, 100%, 94%)" opacity="0.88"/>
     <path d="M51 38 H74 M50 42 H67" stroke="hsl(186, 100%, 90%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M36 14 L41 14 L41 19 M90 14 L85 14 L85 19 M34 44 L39 44 L39 39 M88 44 L83 44 L83 39" fill="none" stroke="hsl(188, 100%, 86%)" stroke-width="1.3"/>
     <ellipse cx="64" cy="61" rx="22" ry="6" fill="url(#ca-hologram-base)" stroke="hsl(192, 92%, 72%)" stroke-width="1.3"/>
     <ellipse cx="64" cy="59" rx="13" ry="3.4" fill="hsl(184, 100%, 88%)"/>
     <path d="M46 61 L50 67 H78 L82 61" fill="hsl(214, 42%, 18%)" stroke="hsl(196, 76%, 56%)" stroke-width="1.1"/>
     <rect x="26" y="26" width="4" height="4" fill="hsl(186, 100%, 88%)" opacity="0.72"/>
     <rect x="96" y="20" width="4" height="4" fill="hsl(186, 100%, 88%)" opacity="0.72"/>
     <rect x="94" y="38" width="3" height="3" fill="hsl(192, 100%, 84%)" opacity="0.65"/>
     <circle cx="32" cy="40" r="1.5" fill="hsl(186, 100%, 92%)"/>`,
    'hsla(186, 100%, 60%, 0.30)',
    `<linearGradient id="ca-hologram-cone" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(186, 100%, 82%)" stop-opacity="0.88"/><stop offset="60%" stop-color="hsl(194, 100%, 60%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(206, 96%, 48%)" stop-opacity="0.04"/></linearGradient><linearGradient id="ca-hologram-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(184, 100%, 84%)" stop-opacity="0.52"/><stop offset="55%" stop-color="hsl(196, 100%, 58%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(214, 90%, 42%)" stop-opacity="0.46"/></linearGradient><linearGradient id="ca-hologram-base" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(216, 44%, 22%)"/><stop offset="50%" stop-color="hsl(202, 54%, 44%)"/><stop offset="100%" stop-color="hsl(216, 44%, 22%)"/></linearGradient>`
  ),

  leap: wrapArtSvg(
    'leap',
    'hsl(220, 60%, 19%)',
    'hsl(242, 58%, 8%)',
    `<path d="M10 62 Q48 16 90 22" fill="none" stroke="url(#ca-leap-arc)" stroke-width="7" stroke-linecap="round" opacity="0.72"/>
     <path d="M12 61 Q50 18 89 23" fill="none" stroke="hsl(52, 100%, 94%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M0 72 V50 H14 V56 H24 V48 H38 V56 H48 V46 H64 V55 H76 V48 H92 V56 H104 V50 H118 V56 H128 V72 Z" fill="hsl(232, 48%, 12%)" stroke="hsl(198, 92%, 62%)" stroke-width="1.1"/>
     <path d="M4 52 H12 M26 50 H36 M50 48 H62 M78 50 H90 M106 52 H116" stroke="hsl(190, 100%, 78%)" stroke-width="1.3"/>
     <path d="M74 26 L88 18 L100 18 L94 28 L102 34 L94 37 L86 30 L76 34 Z" fill="hsl(232, 54%, 10%)" opacity="0.7" transform="translate(2,2)"/>
     <path d="M74 25 L88 17 L100 17 L94 27 L102 33 L94 36 L86 29 L76 33 Z" fill="url(#ca-leap-body)" stroke="hsl(192, 100%, 82%)" stroke-width="1.3" stroke-linejoin="round"/>
     <circle cx="95" cy="14" r="5" fill="url(#ca-leap-body)" stroke="hsl(192, 100%, 84%)" stroke-width="1.2"/>
     <path d="M95 13 H100" stroke="hsl(50, 100%, 86%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M74 30 L58 37 L66 26 Z" fill="url(#ca-leap-jet)"/>
     <path d="M78 21 L64 25 L71 17 Z" fill="url(#ca-leap-jet)" opacity="0.88"/>
     <circle cx="22" cy="18" r="1.4" fill="hsl(192, 100%, 92%)"/>
     <circle cx="44" cy="12" r="1.6" fill="hsl(52, 100%, 94%)"/>
     <circle cx="114" cy="16" r="1.6" fill="hsl(190, 100%, 90%)"/>
     <circle cx="112" cy="36" r="1.4" fill="hsl(50, 100%, 88%)"/>`,
    'hsla(198, 100%, 62%, 0.28)',
    `<linearGradient id="ca-leap-arc" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(214, 96%, 54%)" stop-opacity="0.12"/><stop offset="56%" stop-color="hsl(192, 100%, 68%)" stop-opacity="0.78"/><stop offset="100%" stop-color="hsl(48, 100%, 82%)" stop-opacity="0.96"/></linearGradient><linearGradient id="ca-leap-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(206, 56%, 48%)"/><stop offset="55%" stop-color="hsl(220, 56%, 24%)"/><stop offset="100%" stop-color="hsl(236, 58%, 14%)"/></linearGradient><linearGradient id="ca-leap-jet" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="52%" stop-color="hsl(42, 100%, 64%)"/><stop offset="100%" stop-color="hsl(192, 100%, 62%)" stop-opacity="0.15"/></linearGradient>`
  ),

  overclock: wrapArtSvg(
    'overclock',
    'hsl(14, 70%, 19%)',
    'hsl(246, 54%, 8%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-overclock-heat)"/>
     <path d="M18 52 A48 48 0 0 1 110 52" fill="none" stroke="hsl(214, 50%, 34%)" stroke-width="2.5" opacity="0.55"/>
     <path d="M84 16 A46 46 0 0 1 110 52" fill="none" stroke="hsl(6, 100%, 62%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M64 10 L69 16 L76 14 L78 21 L85 22 L84 29 L90 34 L86 40 L90 46 L83 50 L84 57 L77 57 L75 64 L68 61 L64 66 L60 61 L53 64 L51 57 L44 57 L45 50 L38 46 L42 40 L38 34 L44 29 L43 22 L50 21 L52 14 L59 16 Z" fill="hsl(348, 62%, 12%)" opacity="0.7" transform="translate(2,2)"/>
     <path d="M64 10 L69 16 L76 14 L78 21 L85 22 L84 29 L90 34 L86 40 L90 46 L83 50 L84 57 L77 57 L75 64 L68 61 L64 66 L60 61 L53 64 L51 57 L44 57 L45 50 L38 46 L42 40 L38 34 L44 29 L43 22 L50 21 L52 14 L59 16 Z" fill="url(#ca-overclock-gear)" stroke="hsl(44, 100%, 80%)" stroke-width="1.3" stroke-linejoin="round"/>
     <circle cx="64" cy="38" r="14" fill="hsl(14, 78%, 16%)" stroke="hsl(46, 100%, 82%)" stroke-width="1.5"/>
     <circle cx="64" cy="38" r="7" fill="url(#ca-overclock-core)"/>
     <circle cx="26" cy="24" r="9" fill="none" stroke="hsl(22, 94%, 58%)" stroke-width="2.4" stroke-dasharray="4 2.5"/>
     <circle cx="104" cy="50" r="8" fill="none" stroke="hsl(12, 96%, 60%)" stroke-width="2.2" stroke-dasharray="3.5 2.5"/>
     <path d="M64 38 L86 20" stroke="hsl(54, 100%, 96%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M36 22 L46 28 L42 33 L52 36 M94 14 L84 24 L90 27 L78 34 M92 52 L106 56 L101 62 L116 66 M34 52 L22 56 L26 62 L12 66" fill="none" stroke="hsl(190, 100%, 82%)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="18" cy="40" r="1.7" fill="hsl(48, 100%, 88%)"/>
     <circle cx="110" cy="24" r="1.8" fill="hsl(52, 100%, 94%)"/>
     <circle cx="96" cy="38" r="1.6" fill="hsl(190, 100%, 90%)"/>`,
    'hsla(18, 100%, 56%, 0.34)',
    `<radialGradient id="ca-overclock-heat" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 88%)" stop-opacity="0.88"/><stop offset="48%" stop-color="hsl(14, 100%, 54%)" stop-opacity="0.46"/><stop offset="100%" stop-color="hsl(348, 84%, 22%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-overclock-gear" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(46, 100%, 74%)"/><stop offset="48%" stop-color="hsl(14, 96%, 54%)"/><stop offset="100%" stop-color="hsl(352, 76%, 28%)"/></linearGradient><radialGradient id="ca-overclock-core" cx="44%" cy="40%" r="58%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="56%" stop-color="hsl(44, 100%, 68%)"/><stop offset="100%" stop-color="hsl(10, 96%, 48%)"/></radialGradient>`
  ),

  recursion: wrapArtSvg(
    'recursion',
    'hsl(232, 64%, 18%)',
    'hsl(268, 58%, 8%)',
    `<path d="M64 36 C44 10 14 14 14 36 C14 58 44 62 64 36 C84 10 114 14 114 36 C114 58 84 62 64 36 Z" fill="none" stroke="hsl(214, 90%, 42%)" stroke-width="10" opacity="0.34"/>
     <path d="M64 36 C44 10 14 14 14 36 C14 58 44 62 64 36 C84 10 114 14 114 36 C114 58 84 62 64 36 Z" fill="none" stroke="url(#ca-recursion-loop)" stroke-width="4.4" stroke-linecap="round"/>
     <path d="M64 36 C44 10 14 14 14 36 C14 58 44 62 64 36 C84 10 114 14 114 36 C114 58 84 62 64 36 Z" fill="none" stroke="hsl(190, 100%, 94%)" stroke-width="1.3" stroke-dasharray="10 6"/>
     <path d="M64 36 C49 20 26 22 26 36 C26 50 49 52 64 36 C79 20 102 22 102 36 C102 50 79 52 64 36 Z" fill="none" stroke="hsl(286, 94%, 74%)" stroke-width="1.1" opacity="0.62"/>
     <circle cx="64" cy="36" r="10" fill="url(#ca-recursion-nexus)"/>
     <path d="M36 15 L44 16 L39 22 M92 57 L84 56 L89 50" fill="none" stroke="hsl(50, 100%, 88%)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="94" cy="18" r="4.5" fill="hsl(286, 96%, 72%)" opacity="0.45"/>
     <circle cx="109" cy="27" r="6" fill="hsl(194, 100%, 70%)" opacity="0.7"/>
     <circle cx="34" cy="18" r="9.5" fill="url(#ca-recursion-orb)" stroke="hsl(52, 100%, 92%)" stroke-width="1.4"/>
     <circle cx="34" cy="18" r="4" fill="hsl(54, 100%, 98%)"/>
     <circle cx="22" cy="48" r="4.5" fill="hsl(192, 100%, 74%)" opacity="0.5"/>
     <circle cx="64" cy="36" r="3" fill="hsl(54, 100%, 98%)"/>
     <circle cx="14" cy="16" r="1.5" fill="hsl(190, 100%, 92%)"/>
     <circle cx="114" cy="58" r="1.6" fill="hsl(292, 100%, 88%)"/>`,
    'hsla(246, 96%, 64%, 0.30)',
    `<linearGradient id="ca-recursion-loop" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(188, 100%, 76%)"/><stop offset="48%" stop-color="hsl(50, 100%, 78%)"/><stop offset="100%" stop-color="hsl(286, 96%, 70%)"/></linearGradient><radialGradient id="ca-recursion-orb" cx="42%" cy="38%" r="58%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="50%" stop-color="hsl(192, 100%, 72%)"/><stop offset="100%" stop-color="hsl(268, 86%, 48%)"/></radialGradient><radialGradient id="ca-recursion-nexus" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 98%)"/><stop offset="50%" stop-color="hsl(192, 100%, 72%)" stop-opacity="0.58"/><stop offset="100%" stop-color="hsl(276, 86%, 44%)" stop-opacity="0"/></radialGradient>`
  ),

  stack: wrapArtSvg(
    'stack',
    'hsl(206, 56%, 18%)',
    'hsl(226, 58%, 8%)',
    `<path d="M64 4 V68" stroke="hsl(192, 100%, 72%)" stroke-width="1" stroke-dasharray="3 3" opacity="0.4"/>
     <polygon points="30,56 64,46 98,56 64,66" fill="url(#ca-stack-plate)" stroke="hsl(194, 92%, 68%)" stroke-width="1.3" stroke-linejoin="round"/>
     <polygon points="30,56 64,66 64,70 30,60" fill="hsl(220, 48%, 16%)" stroke="hsl(198, 80%, 54%)" stroke-width="0.9"/>
     <polygon points="98,56 64,66 64,70 98,60" fill="hsl(214, 46%, 22%)" stroke="hsl(198, 80%, 54%)" stroke-width="0.9"/>
     <polygon points="32,45 64,35 96,45 64,55" fill="url(#ca-stack-plate)" stroke="hsl(190, 100%, 76%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M36 47 L64 56 L92 47" fill="none" stroke="hsl(186, 100%, 86%)" stroke-width="1.6" opacity="0.88"/>
     <polygon points="34,34 64,24 94,34 64,44" fill="url(#ca-stack-plate)" stroke="hsl(188, 100%, 82%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M38 36 L64 45 L90 36" fill="none" stroke="hsl(186, 100%, 90%)" stroke-width="1.7" opacity="0.9"/>
     <polygon points="36,23 64,13 92,23 64,33" fill="url(#ca-stack-top)" stroke="hsl(186, 100%, 92%)" stroke-width="1.5" stroke-linejoin="round"/>
     <polygon points="48,23 64,17 80,23 64,29" fill="hsl(186, 100%, 94%)" opacity="0.65"/>
     <path d="M22 46 L22 20 M18 25 L22 18 L26 25 M106 46 L106 20 M102 25 L106 18 L110 25" fill="none" stroke="hsl(188, 100%, 78%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M64 13 V5 M58 9 L64 4 L70 9" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="16" cy="56" r="1.5" fill="hsl(190, 100%, 86%)"/>
     <circle cx="112" cy="56" r="1.5" fill="hsl(190, 100%, 86%)"/>
     <circle cx="88" cy="10" r="1.5" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(192, 100%, 60%, 0.28)',
    `<linearGradient id="ca-stack-plate" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(204, 48%, 42%)"/><stop offset="52%" stop-color="hsl(214, 52%, 26%)"/><stop offset="100%" stop-color="hsl(224, 56%, 15%)"/></linearGradient><linearGradient id="ca-stack-top" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(188, 100%, 74%)"/><stop offset="52%" stop-color="hsl(204, 84%, 44%)"/><stop offset="100%" stop-color="hsl(220, 68%, 24%)"/></linearGradient>`
  ),

  steam_barrier: wrapArtSvg(
    'steam_barrier',
    'hsl(194, 48%, 18%)',
    'hsl(216, 50%, 8%)',
    `<path d="M46 66 Q44 38 62 22 Q78 8 100 14 Q122 18 124 40 Q124 62 104 68 Z" fill="url(#ca-steam_barrier-cloud)" opacity="0.82"/>
     <circle cx="76" cy="28" r="18" fill="url(#ca-steam_barrier-puff)" opacity="0.88"/>
     <circle cx="96" cy="24" r="16" fill="url(#ca-steam_barrier-puff)" opacity="0.82"/>
     <circle cx="106" cy="44" r="17" fill="url(#ca-steam_barrier-puff)" opacity="0.86"/>
     <circle cx="78" cy="48" r="16" fill="url(#ca-steam_barrier-puff)" opacity="0.84"/>
     <path d="M58 26 Q74 12 96 14 Q116 18 118 40 Q116 58 98 64" fill="none" stroke="hsl(188, 100%, 96%)" stroke-width="1.8" stroke-linecap="round" opacity="0.82"/>
     <path d="M36 42 L68 30 M38 48 L74 44 M34 54 L68 58" stroke="hsl(186, 100%, 94%)" stroke-width="2" stroke-linecap="round" opacity="0.76"/>
     <path d="M0 36 H28 V68 H16 V46 H0 Z" fill="url(#ca-steam_barrier-brass)" stroke="hsl(40, 88%, 68%)" stroke-width="1.3"/>
     <rect x="26" y="32" width="8" height="18" rx="2" fill="url(#ca-steam_barrier-brass)" stroke="hsl(44, 96%, 76%)" stroke-width="1.2"/>
     <circle cx="20" cy="24" r="10" fill="none" stroke="hsl(14, 82%, 52%)" stroke-width="2.6"/>
     <path d="M20 14 V34 M10 24 H30 M13 17 L27 31 M27 17 L13 31" stroke="hsl(38, 86%, 62%)" stroke-width="1.6"/>
     <circle cx="20" cy="24" r="3.2" fill="hsl(44, 96%, 76%)"/>
     <path d="M68 20 Q82 26 76 38 M94 34 Q108 42 98 54" fill="none" stroke="hsl(190, 100%, 96%)" stroke-width="1.3" stroke-linecap="round" opacity="0.72"/>
     <circle cx="54" cy="18" r="1.6" fill="hsl(188, 100%, 96%)"/>
     <circle cx="116" cy="14" r="1.5" fill="hsl(190, 100%, 94%)"/>`,
    'hsla(190, 96%, 76%, 0.30)',
    `<radialGradient id="ca-steam_barrier-puff" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="hsl(190, 100%, 98%)"/><stop offset="56%" stop-color="hsl(194, 86%, 78%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(206, 68%, 48%)" stop-opacity="0.06"/></radialGradient><linearGradient id="ca-steam_barrier-cloud" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(190, 100%, 96%)" stop-opacity="0.86"/><stop offset="60%" stop-color="hsl(196, 84%, 70%)" stop-opacity="0.54"/><stop offset="100%" stop-color="hsl(210, 62%, 38%)" stop-opacity="0.22"/></linearGradient><linearGradient id="ca-steam_barrier-brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(44, 86%, 64%)"/><stop offset="52%" stop-color="hsl(32, 74%, 40%)"/><stop offset="100%" stop-color="hsl(24, 64%, 22%)"/></linearGradient>`
  ),

  turbo: wrapArtSvg(
    'turbo',
    'hsl(258, 64%, 18%)',
    'hsl(222, 66%, 7%)',
    `<circle cx="24" cy="36" r="24" fill="url(#ca-turbo-void)"/>
     <path d="M4 20 Q20 26 38 30 M4 36 H38 M4 52 Q20 46 38 42" fill="none" stroke="hsl(286, 100%, 74%)" stroke-width="2" stroke-linecap="round" opacity="0.82"/>
     <path d="M10 12 Q28 18 42 26 M10 60 Q28 54 42 46" fill="none" stroke="hsl(274, 96%, 64%)" stroke-width="1.3" stroke-linecap="round" opacity="0.65"/>
     <path d="M74 22 L128 10 L128 62 L74 50 Z" fill="url(#ca-turbo-exhaust)" opacity="0.88"/>
     <path d="M74 36 L128 36" stroke="hsl(54, 100%, 96%)" stroke-width="4" stroke-linecap="round"/>
     <polygon points="88,36 96,30 104,36 96,42" fill="hsl(190, 100%, 92%)" opacity="0.86"/>
     <polygon points="108,36 115,31 122,36 115,41" fill="hsl(52, 100%, 94%)" opacity="0.86"/>
     <path d="M36 16 L76 20 L82 36 L76 52 L36 56 L30 36 Z" fill="hsl(236, 56%, 10%)" opacity="0.72" transform="translate(2,2)"/>
     <path d="M36 16 L76 20 L82 36 L76 52 L36 56 L30 36 Z" fill="url(#ca-turbo-casing)" stroke="hsl(196, 94%, 74%)" stroke-width="1.5" stroke-linejoin="round"/>
     <ellipse cx="37" cy="36" rx="8" ry="18" fill="hsl(268, 66%, 14%)" stroke="hsl(286, 100%, 76%)" stroke-width="1.4"/>
     <path d="M37 20 L40 36 L37 52 M31 28 L43 44 M43 28 L31 44" stroke="hsl(292, 100%, 84%)" stroke-width="1.3"/>
     <circle cx="37" cy="36" r="3.4" fill="hsl(52, 100%, 94%)"/>
     <path d="M52 22 V50 M62 23 V49 M70 24 V48" stroke="hsl(192, 100%, 78%)" stroke-width="1.4" opacity="0.85"/>
     <path d="M84 18 L96 14 L92 22 L106 16 M84 54 L96 58 L92 50 L106 56" fill="none" stroke="hsl(190, 100%, 88%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="16" cy="26" r="1.6" fill="hsl(292, 100%, 88%)"/>
     <circle cx="18" cy="48" r="1.5" fill="hsl(280, 100%, 82%)"/>`,
    'hsla(276, 96%, 60%, 0.30)',
    `<radialGradient id="ca-turbo-void" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(288, 100%, 72%)" stop-opacity="0.88"/><stop offset="52%" stop-color="hsl(268, 88%, 44%)" stop-opacity="0.4"/><stop offset="100%" stop-color="hsl(252, 76%, 18%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-turbo-exhaust" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(54, 100%, 94%)"/><stop offset="42%" stop-color="hsl(192, 100%, 66%)"/><stop offset="100%" stop-color="hsl(214, 96%, 50%)" stop-opacity="0.16"/></linearGradient><linearGradient id="ca-turbo-casing" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(214, 44%, 44%)"/><stop offset="50%" stop-color="hsl(226, 48%, 22%)"/><stop offset="100%" stop-color="hsl(240, 56%, 12%)"/></linearGradient>`
  ),

  blizzard: wrapArtSvg(
    'blizzard',
    'hsl(202, 72%, 19%)',
    'hsl(226, 68%, 8%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-blizzard-eye)"/>
     <path d="M8 54 Q26 14 70 12 Q112 12 118 38 Q120 62 72 64 Q36 66 26 42 Q22 24 58 22 Q94 20 96 38 Q96 52 64 52 Q44 52 44 38" fill="none" stroke="url(#ca-blizzard-gale)" stroke-width="3.6" stroke-linecap="round"/>
     <path d="M14 24 Q44 6 88 10 M116 48 Q88 68 38 64" fill="none" stroke="hsl(190, 100%, 90%)" stroke-width="1.6" stroke-linecap="round" opacity="0.72"/>
     <polygon points="34,18 46,12 40,24" fill="url(#ca-blizzard-shard)" stroke="hsl(192, 100%, 96%)" stroke-width="0.9"/>
     <polygon points="84,12 98,10 92,20" fill="url(#ca-blizzard-shard)" stroke="hsl(192, 100%, 96%)" stroke-width="0.9"/>
     <polygon points="104,30 120,26 112,38" fill="url(#ca-blizzard-shard)" stroke="hsl(192, 100%, 96%)" stroke-width="0.9"/>
     <polygon points="88,54 102,58 90,64" fill="url(#ca-blizzard-shard)" stroke="hsl(192, 100%, 96%)" stroke-width="0.9"/>
     <polygon points="24,48 38,54 26,60" fill="url(#ca-blizzard-shard)" stroke="hsl(192, 100%, 96%)" stroke-width="0.9"/>
     <polygon points="12,32 26,28 20,39" fill="url(#ca-blizzard-shard)" stroke="hsl(192, 100%, 96%)" stroke-width="0.9"/>
     <polygon points="64,25 71,36 64,47 57,36" fill="hsl(190, 100%, 96%)" stroke="hsl(194, 100%, 74%)" stroke-width="1.2"/>
     <path d="M64 20 V52 M48 36 H80 M53 25 L75 47 M75 25 L53 47" stroke="hsl(192, 100%, 96%)" stroke-width="1.2" stroke-linecap="round" opacity="0.86"/>
     <circle cx="52" cy="16" r="1.5" fill="hsl(192, 100%, 98%)"/>
     <circle cx="110" cy="18" r="1.7" fill="hsl(192, 100%, 96%)"/>
     <circle cx="16" cy="58" r="1.6" fill="hsl(190, 100%, 94%)"/>
     <circle cx="76" cy="58" r="1.5" fill="hsl(192, 100%, 98%)"/>`,
    'hsla(194, 100%, 72%, 0.34)',
    `<radialGradient id="ca-blizzard-eye" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(192, 100%, 98%)" stop-opacity="0.88"/><stop offset="48%" stop-color="hsl(198, 100%, 66%)" stop-opacity="0.4"/><stop offset="100%" stop-color="hsl(220, 84%, 26%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-blizzard-gale" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(190, 100%, 96%)"/><stop offset="50%" stop-color="hsl(198, 98%, 68%)"/><stop offset="100%" stop-color="hsl(214, 92%, 48%)"/></linearGradient><linearGradient id="ca-blizzard-shard" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(190, 100%, 98%)"/><stop offset="58%" stop-color="hsl(198, 96%, 68%)"/><stop offset="100%" stop-color="hsl(216, 86%, 40%)"/></linearGradient>`
  ),

  bullseye: wrapArtSvg(
    'bullseye',
    'hsl(214, 62%, 17%)',
    'hsl(344, 52%, 8%)',
    `<circle cx="64" cy="36" r="28" fill="url(#ca-bullseye-glow)"/>
     <path d="M12 8 L46 26 M116 8 L82 26 M12 64 L46 46 M116 64 L82 46" stroke="hsl(190, 100%, 72%)" stroke-width="1.3" opacity="0.62"/>
     <circle cx="64" cy="36" r="26" fill="none" stroke="hsl(190, 100%, 74%)" stroke-width="1.6" stroke-dasharray="14 6"/>
     <circle cx="64" cy="36" r="19" fill="none" stroke="hsl(350, 100%, 68%)" stroke-width="1.4" stroke-dasharray="8 4"/>
     <circle cx="64" cy="36" r="12" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.5"/>
     <path d="M64 4 V20 M64 52 V68 M28 36 H48 M80 36 H100" stroke="hsl(188, 100%, 86%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M36 14 L42 14 L42 20 M92 14 L86 14 L86 20 M36 58 L42 58 L42 52 M92 58 L86 58 L86 52" fill="none" stroke="hsl(188, 100%, 84%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="64" cy="36" r="7.5" fill="url(#ca-bullseye-core)" stroke="hsl(52, 100%, 94%)" stroke-width="1.3"/>
     <circle cx="64" cy="36" r="2.8" fill="hsl(56, 100%, 99%)"/>
     <path d="M52 24 L56 28 M76 24 L72 28 M52 48 L56 44 M76 48 L72 44" stroke="hsl(350, 100%, 78%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="22" cy="36" r="1.6" fill="hsl(188, 100%, 88%)"/>
     <circle cx="106" cy="36" r="1.6" fill="hsl(188, 100%, 88%)"/>
     <circle cx="64" cy="36" r="22" fill="none" stroke="hsl(190, 100%, 86%)" stroke-width="0.7" opacity="0.42"/>`,
    'hsla(350, 98%, 58%, 0.30)',
    `<radialGradient id="ca-bullseye-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(352, 100%, 74%)" stop-opacity="0.84"/><stop offset="46%" stop-color="hsl(348, 96%, 54%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(216, 84%, 22%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-bullseye-core" cx="44%" cy="40%" r="58%"><stop offset="0%" stop-color="hsl(54, 100%, 98%)"/><stop offset="48%" stop-color="hsl(352, 100%, 66%)"/><stop offset="100%" stop-color="hsl(342, 92%, 38%)"/></radialGradient>`
  ),
};
