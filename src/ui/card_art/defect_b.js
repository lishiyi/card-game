// Bespoke 16:9 SVG card illustrations for Defect cards (part B: 24 cards).
import { wrapArtSvg } from './wrap.js';

export const DEFECT_CARD_ART_B = {
  doom_and_gloom: wrapArtSvg(
    'doom_and_gloom',
    'hsl(258, 58%, 17%)',
    'hsl(276, 62%, 6%)',
    `<ellipse cx="64" cy="36" rx="58" ry="26" fill="url(#ca-doom_and_gloom-corona)" opacity="0.88"/>
     <ellipse cx="64" cy="36" rx="52" ry="21" fill="none" stroke="hsl(276, 88%, 58%)" stroke-width="1.4" opacity="0.48"/>
     <ellipse cx="64" cy="36" rx="39" ry="15" fill="none" stroke="hsl(288, 96%, 72%)" stroke-width="1.2" stroke-dasharray="6 4" opacity="0.62"/>
     <path d="M6 26 Q34 10 64 16 Q94 10 122 26 M4 48 Q34 62 64 56 Q94 62 124 48" fill="none" stroke="url(#ca-doom_and_gloom-wave)" stroke-width="2.2" stroke-linecap="round" opacity="0.78"/>
     <path d="M12 14 L26 22 L20 27 L36 31 M116 14 L102 22 L108 27 L92 31 M10 58 L28 48 L24 43 L40 41 M118 58 L100 48 L104 43 L88 41" fill="none" stroke="hsl(282, 98%, 74%)" stroke-width="1.3" stroke-linejoin="round" opacity="0.82"/>
     <circle cx="64" cy="35" r="20.5" fill="url(#ca-doom_and_gloom-rim)" opacity="0.92"/>
     <circle cx="64" cy="35" r="17.5" fill="url(#ca-doom_and_gloom-void)" stroke="hsl(292, 98%, 76%)" stroke-width="1.3"/>
     <path d="M54 20 A17 17 0 0 1 78 46 A15.5 15.5 0 0 0 54 20 Z" fill="hsl(296, 100%, 92%)" opacity="0.88"/>
     <path d="M51 39 Q64 46 77 35 Q67 31 55 34" fill="none" stroke="hsl(272, 90%, 64%)" stroke-width="1.1" opacity="0.65"/>
     <path d="M0 64 L18 56 L36 63 L52 57 L64 62 L78 57 L96 63 L112 56 L128 64 L128 72 L0 72 Z" fill="hsl(264, 54%, 8%)" stroke="hsl(284, 88%, 58%)" stroke-width="1"/>
     <path d="M22 36 Q32 24 41 36 Q32 48 22 36 M106 36 Q96 24 87 36 Q96 48 106 36" fill="none" stroke="hsl(198, 96%, 70%)" stroke-width="1.4" opacity="0.68"/>
     <circle cx="18" cy="36" r="1.8" fill="hsl(292, 100%, 84%)"/>
     <circle cx="110" cy="36" r="1.8" fill="hsl(292, 100%, 84%)"/>
     <circle cx="44" cy="14" r="1.4" fill="hsl(196, 100%, 80%)"/>
     <circle cx="86" cy="56" r="1.5" fill="hsl(284, 100%, 80%)"/>`,
    'hsla(278, 94%, 58%, 0.30)',
    `<radialGradient id="ca-doom_and_gloom-corona" cx="50%" cy="48%" r="54%"><stop offset="0%" stop-color="hsl(292, 100%, 76%)" stop-opacity="0.9"/><stop offset="42%" stop-color="hsl(272, 92%, 48%)" stop-opacity="0.48"/><stop offset="100%" stop-color="hsl(260, 70%, 16%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-doom_and_gloom-rim" cx="58%" cy="42%" r="54%"><stop offset="56%" stop-color="hsl(276, 86%, 22%)"/><stop offset="86%" stop-color="hsl(288, 100%, 74%)"/><stop offset="100%" stop-color="hsl(274, 96%, 54%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-doom_and_gloom-void" cx="44%" cy="44%" r="58%"><stop offset="0%" stop-color="hsl(266, 62%, 4%)"/><stop offset="68%" stop-color="hsl(268, 66%, 9%)"/><stop offset="100%" stop-color="hsl(282, 86%, 34%)"/></radialGradient><linearGradient id="ca-doom_and_gloom-wave" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(198, 96%, 64%)" stop-opacity="0.2"/><stop offset="50%" stop-color="hsl(288, 100%, 78%)" stop-opacity="0.95"/><stop offset="100%" stop-color="hsl(198, 96%, 64%)" stop-opacity="0.2"/></linearGradient>`
  ),

  melter: wrapArtSvg(
    'melter',
    'hsl(214, 48%, 16%)',
    'hsl(18, 56%, 8%)',
    `<circle cx="84" cy="36" r="32" fill="url(#ca-melter-glow)"/>
     <path d="M68 12 L104 16 L110 42 L92 62 L68 56 L62 34 Z" fill="hsl(218, 40%, 10%)" opacity="0.72" transform="translate(2.5,2.5)"/>
     <path d="M68 12 L104 16 L110 42 L92 62 L68 56 L62 34 Z" fill="url(#ca-melter-iron)" stroke="hsl(210, 32%, 52%)" stroke-width="1.6" stroke-linejoin="round"/>
     <path d="M74 17 L99 20 L103 40 L90 55 L73 51 L69 34 Z" fill="none" stroke="hsl(214, 28%, 34%)" stroke-width="1.1"/>
     <circle cx="72" cy="18" r="1.4" fill="hsl(212, 34%, 64%)"/><circle cx="100" cy="21" r="1.4" fill="hsl(212, 34%, 64%)"/>
     <circle cx="104" cy="40" r="1.4" fill="hsl(212, 34%, 64%)"/><circle cx="91" cy="56" r="1.4" fill="hsl(212, 34%, 64%)"/>
     <path d="M84 36 L75 21 M84 36 L98 25 M84 36 L102 44 M84 36 L77 51 M84 36 L92 54" fill="none" stroke="hsl(26, 100%, 62%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M84 36 L76 23 M84 36 L96 27 M84 36 L99 43" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="0.8" stroke-linecap="round"/>
     <ellipse cx="83" cy="36" rx="10" ry="11.5" fill="url(#ca-melter-crater)" stroke="hsl(36, 100%, 72%)" stroke-width="1.3"/>
     <path d="M80 46 Q81 56 78 65 M86 45 Q88 55 85 68 M91 44 Q94 52 93 60" fill="none" stroke="hsl(28, 100%, 62%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="78" cy="66" r="2.2" fill="hsl(44, 100%, 78%)"/><circle cx="85" cy="68" r="1.7" fill="hsl(28, 100%, 64%)"/>
     <path d="M0 24 L18 27 L21 45 L0 48 Z" fill="hsl(214, 38%, 22%)" stroke="hsl(196, 86%, 64%)" stroke-width="1.3"/>
     <path d="M12 29 L82 32 L82 40 L12 43 Z" fill="url(#ca-melter-beam)"/>
     <path d="M14 34 L82 35 L82 37 L14 38 Z" fill="hsl(54, 100%, 97%)"/>
     <ellipse cx="26" cy="36" rx="2.5" ry="9" fill="none" stroke="hsl(194, 100%, 74%)" stroke-width="1.3" opacity="0.85"/>
     <ellipse cx="46" cy="36" rx="2.5" ry="7.5" fill="none" stroke="hsl(42, 100%, 78%)" stroke-width="1.2" opacity="0.78"/>
     <path d="M82 36 L70 20 M82 36 L68 50 M82 36 L112 28 M82 36 L116 44 M82 36 L62 28" stroke="hsl(44, 100%, 82%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="64" cy="18" r="1.7" fill="hsl(48, 100%, 90%)"/><circle cx="115" cy="24" r="1.6" fill="hsl(32, 100%, 72%)"/>
     <circle cx="62" cy="54" r="1.5" fill="hsl(46, 100%, 86%)"/>`,
    'hsla(28, 100%, 58%, 0.32)',
    `<radialGradient id="ca-melter-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 86%)" stop-opacity="0.92"/><stop offset="45%" stop-color="hsl(24, 100%, 54%)" stop-opacity="0.48"/><stop offset="100%" stop-color="hsl(14, 90%, 30%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-melter-iron" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 24%, 44%)"/><stop offset="52%" stop-color="hsl(218, 28%, 26%)"/><stop offset="100%" stop-color="hsl(222, 36%, 14%)"/></linearGradient><radialGradient id="ca-melter-crater" cx="46%" cy="46%" r="55%"><stop offset="0%" stop-color="hsl(54, 100%, 97%)"/><stop offset="50%" stop-color="hsl(36, 100%, 66%)"/><stop offset="100%" stop-color="hsl(12, 94%, 40%)"/></radialGradient><linearGradient id="ca-melter-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(192, 100%, 72%)"/><stop offset="28%" stop-color="hsl(44, 100%, 74%)"/><stop offset="76%" stop-color="hsl(28, 100%, 62%)"/><stop offset="100%" stop-color="hsl(52, 100%, 95%)"/></linearGradient>`
  ),

  rip_and_tear: wrapArtSvg(
    'rip_and_tear',
    'hsl(216, 48%, 15%)',
    'hsl(234, 52%, 7%)',
    `<path d="M8 6 L120 6 L124 66 L4 66 Z" fill="url(#ca-rip_and_tear-steel)" stroke="hsl(216, 34%, 30%)" stroke-width="1"/>
     <path d="M44 6 L38 66 M88 6 L94 66 M6 36 L122 36" stroke="hsl(222, 42%, 12%)" stroke-width="1.2" opacity="0.72"/>
     <circle cx="14" cy="12" r="1.4" fill="hsl(214, 30%, 44%)"/><circle cx="114" cy="12" r="1.4" fill="hsl(214, 30%, 44%)"/>
     <circle cx="12" cy="60" r="1.4" fill="hsl(214, 30%, 44%)"/><circle cx="116" cy="60" r="1.4" fill="hsl(214, 30%, 44%)"/>
     <circle cx="64" cy="36" r="24" fill="url(#ca-rip_and_tear-flash)"/>
     <path d="M18 10 Q48 24 88 58 L82 61 Q44 29 14 14 Z M28 6 Q60 22 102 56 L96 60 Q56 26 23 10 Z M10 18 Q40 34 74 63 L68 65 Q36 37 7 22 Z" fill="hsl(224, 54%, 8%)" opacity="0.88"/>
     <path d="M108 10 Q78 24 38 58 L44 61 Q82 29 112 14 Z M98 6 Q66 22 24 56 L30 60 Q70 26 103 10 Z M116 18 Q86 34 52 63 L58 65 Q90 37 119 22 Z" fill="hsl(224, 54%, 8%)" opacity="0.88"/>
     <path d="M15 11 Q50 26 96 60 M26 7 Q62 23 108 55 M9 20 Q42 36 80 64" fill="none" stroke="url(#ca-rip_and_tear-claw1)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M17 12 Q51 27 95 59 M27 8 Q62 23 106 54" fill="none" stroke="hsl(192, 100%, 94%)" stroke-width="1.2" stroke-linecap="round"/>
     <path d="M113 11 Q78 26 32 60 M102 7 Q66 23 20 55 M119 20 Q86 36 48 64" fill="none" stroke="url(#ca-rip_and_tear-claw2)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M111 12 Q77 27 33 59 M101 8 Q66 23 22 54" fill="none" stroke="hsl(52, 100%, 95%)" stroke-width="1.2" stroke-linecap="round"/>
     <path d="M64 20 L67 33 L80 36 L67 39 L64 52 L61 39 L48 36 L61 33 Z" fill="hsl(54, 100%, 96%)" opacity="0.92"/>
     <path d="M52 24 L42 14 M76 24 L86 14 M50 48 L38 56 M78 48 L92 56 M64 16 L64 8 M64 56 L64 66" stroke="hsl(44, 100%, 82%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="38" cy="20" r="1.8" fill="hsl(190, 100%, 86%)"/><circle cx="90" cy="20" r="1.8" fill="hsl(46, 100%, 84%)"/>
     <circle cx="40" cy="52" r="1.6" fill="hsl(46, 100%, 84%)"/><circle cx="88" cy="52" r="1.6" fill="hsl(190, 100%, 86%)"/>`,
    'hsla(192, 98%, 58%, 0.30)',
    `<linearGradient id="ca-rip_and_tear-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(216, 30%, 24%)"/><stop offset="50%" stop-color="hsl(220, 34%, 15%)"/><stop offset="100%" stop-color="hsl(228, 42%, 10%)"/></linearGradient><radialGradient id="ca-rip_and_tear-flash" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)" stop-opacity="0.95"/><stop offset="42%" stop-color="hsl(192, 100%, 66%)" stop-opacity="0.6"/><stop offset="100%" stop-color="hsl(216, 90%, 36%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-rip_and_tear-claw1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(196, 100%, 72%)" stop-opacity="0.2"/><stop offset="52%" stop-color="hsl(188, 100%, 72%)"/><stop offset="100%" stop-color="hsl(48, 100%, 86%)"/></linearGradient><linearGradient id="ca-rip_and_tear-claw2" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(44, 100%, 70%)" stop-opacity="0.25"/><stop offset="52%" stop-color="hsl(194, 100%, 76%)"/><stop offset="100%" stop-color="hsl(32, 100%, 70%)"/></linearGradient>`
  ),

  scrape: wrapArtSvg(
    'scrape',
    'hsl(206, 52%, 17%)',
    'hsl(226, 48%, 8%)',
    `<circle cx="62" cy="44" r="28" fill="url(#ca-scrape-flare)"/>
     <path d="M0 54 L128 38 L128 72 L0 72 Z" fill="url(#ca-scrape-alloy)" stroke="hsl(204, 42%, 44%)" stroke-width="1.3"/>
     <path d="M4 58 L124 43 M12 65 L124 51" stroke="hsl(214, 38%, 22%)" stroke-width="1.1"/>
     <path d="M8 55 L64 46" stroke="hsl(190, 100%, 74%)" stroke-width="2.8" stroke-linecap="round" opacity="0.88"/>
     <path d="M12 54 L63 46" stroke="hsl(52, 100%, 95%)" stroke-width="1.2" stroke-linecap="round"/>
     <path d="M12 24 L98 8 L108 16 L96 28 L89 24 L82 32 L75 28 L68 37 L61 33 L54 42 L47 38 L40 46 L26 42 Z" fill="hsl(222, 52%, 10%)" opacity="0.68" transform="translate(2,3)"/>
     <path d="M12 24 L98 8 L108 16 L96 28 L89 24 L82 32 L75 28 L68 37 L61 33 L54 42 L47 38 L40 46 L26 42 Z" fill="url(#ca-scrape-blade)" stroke="hsl(194, 96%, 76%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M22 28 L96 14" stroke="hsl(196, 100%, 92%)" stroke-width="1.4" stroke-linecap="round" opacity="0.85"/>
     <path d="M62 44 Q74 30 92 22 M62 44 Q82 38 104 34 M62 44 Q72 22 82 12 M62 44 Q86 46 112 45 M62 44 Q66 26 70 16" fill="none" stroke="url(#ca-scrape-sparks)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="62" cy="44" r="5.5" fill="hsl(54, 100%, 96%)"/>
     <circle cx="88" cy="24" r="4.2" fill="none" stroke="hsl(188, 100%, 78%)" stroke-width="1.5"/>
     <circle cx="104" cy="31" r="3.2" fill="none" stroke="hsl(46, 100%, 78%)" stroke-width="1.4"/>
     <circle cx="114" cy="20" r="2.5" fill="none" stroke="hsl(192, 100%, 84%)" stroke-width="1.2"/>
     <path d="M74 34 Q80 28 86 32 Q80 38 74 34" fill="none" stroke="hsl(48, 100%, 86%)" stroke-width="1.3"/>
     <circle cx="98" cy="18" r="1.6" fill="hsl(52, 100%, 94%)"/><circle cx="116" cy="40" r="1.7" fill="hsl(192, 100%, 84%)"/>
     <circle cx="76" cy="14" r="1.4" fill="hsl(46, 100%, 86%)"/>`,
    'hsla(188, 98%, 58%, 0.28)',
    `<radialGradient id="ca-scrape-flare" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 95%)" stop-opacity="0.95"/><stop offset="44%" stop-color="hsl(190, 100%, 66%)" stop-opacity="0.56"/><stop offset="100%" stop-color="hsl(210, 90%, 34%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-scrape-alloy" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(212, 26%, 32%)"/><stop offset="52%" stop-color="hsl(218, 34%, 20%)"/><stop offset="100%" stop-color="hsl(226, 44%, 11%)"/></linearGradient><linearGradient id="ca-scrape-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(200, 44%, 76%)"/><stop offset="48%" stop-color="hsl(210, 34%, 44%)"/><stop offset="100%" stop-color="hsl(194, 96%, 68%)"/></linearGradient><linearGradient id="ca-scrape-sparks" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="55%" stop-color="hsl(44, 100%, 72%)"/><stop offset="100%" stop-color="hsl(188, 100%, 76%)"/></linearGradient>`
  ),

  sunder: wrapArtSvg(
    'sunder',
    'hsl(212, 66%, 18%)',
    'hsl(232, 62%, 7%)',
    `<path d="M52 0 L76 0 L84 72 L44 72 Z" fill="url(#ca-sunder-fissure)" opacity="0.82"/>
     <path d="M24 22 L54 18 L58 68 L18 68 Z" fill="url(#ca-sunder-stone)" stroke="hsl(198, 92%, 68%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M104 22 L74 18 L70 68 L110 68 Z" fill="url(#ca-sunder-stone)" stroke="hsl(198, 92%, 68%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M32 32 H46 M36 42 H48 M30 52 H44 M82 32 H96 M80 42 H92 M84 52 H98" stroke="hsl(196, 82%, 52%)" stroke-width="1.1" opacity="0.55"/>
     <path d="M55 20 L58 34 L54 46 L59 64 M73 20 L70 34 L74 46 L69 64" fill="none" stroke="hsl(190, 100%, 84%)" stroke-width="1.8"/>
     <path d="M46 4 Q64 26 82 4 L72 60 L64 68 L56 60 Z" fill="url(#ca-sunder-blade)" stroke="hsl(188, 100%, 88%)" stroke-width="1.5" stroke-linejoin="round"/>
     <path d="M64 4 V66" stroke="hsl(54, 100%, 98%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M56 20 L64 28 L72 20 M57 34 L64 42 L71 34" fill="none" stroke="hsl(216, 84%, 28%)" stroke-width="1.4"/>
     <ellipse cx="64" cy="64" rx="46" ry="7" fill="none" stroke="hsl(192, 100%, 72%)" stroke-width="1.6" opacity="0.78"/>
     <polygon points="18,16 26,12 24,22" fill="hsl(218, 42%, 22%)" stroke="hsl(196, 94%, 72%)" stroke-width="0.9"/>
     <polygon points="110,16 102,12 104,22" fill="hsl(218, 42%, 22%)" stroke="hsl(196, 94%, 72%)" stroke-width="0.9"/>
     <polygon points="12,42 19,38 17,48" fill="hsl(218, 42%, 22%)" stroke="hsl(46, 98%, 74%)" stroke-width="0.9"/>
     <polygon points="116,42 109,38 111,48" fill="hsl(218, 42%, 22%)" stroke="hsl(46, 98%, 74%)" stroke-width="0.9"/>
     <path d="M40 10 L48 20 M88 10 L80 20 M32 58 L20 66 M96 58 L108 66" stroke="hsl(46, 100%, 82%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="38" cy="14" r="1.8" fill="hsl(48, 100%, 88%)"/><circle cx="90" cy="14" r="1.8" fill="hsl(48, 100%, 88%)"/>`,
    'hsla(194, 100%, 60%, 0.34)',
    `<linearGradient id="ca-sunder-fissure" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(190, 100%, 84%)" stop-opacity="0.9"/><stop offset="55%" stop-color="hsl(196, 100%, 62%)" stop-opacity="0.55"/><stop offset="100%" stop-color="hsl(46, 100%, 68%)" stop-opacity="0.85"/></linearGradient><linearGradient id="ca-sunder-stone" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(218, 34%, 28%)"/><stop offset="55%" stop-color="hsl(224, 42%, 17%)"/><stop offset="100%" stop-color="hsl(232, 50%, 10%)"/></linearGradient><linearGradient id="ca-sunder-blade" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(196, 100%, 62%)"/><stop offset="50%" stop-color="hsl(186, 100%, 88%)"/><stop offset="100%" stop-color="hsl(196, 100%, 62%)"/></linearGradient>`
  ),

  aggregate: wrapArtSvg(
    'aggregate',
    'hsl(218, 64%, 17%)',
    'hsl(236, 58%, 7%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-aggregate-aura)"/>
     <path d="M0 8 Q34 14 64 36 M0 36 Q32 30 64 36 M0 64 Q34 58 64 36 M128 8 Q94 14 64 36 M128 36 Q96 42 64 36 M128 64 Q94 58 64 36" fill="none" stroke="url(#ca-aggregate-cyan)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M14 0 Q42 18 64 36 M114 0 Q86 18 64 36 M14 72 Q42 54 64 36 M114 72 Q86 54 64 36" fill="none" stroke="url(#ca-aggregate-gold)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="64" cy="36" r="22" fill="none" stroke="hsl(192, 98%, 68%)" stroke-width="1.2" stroke-dasharray="6 4" opacity="0.72"/>
     <polygon points="64,16 81,26 81,46 64,56 47,46 47,26" fill="none" stroke="hsl(46, 100%, 74%)" stroke-width="1.5" opacity="0.84"/>
     <circle cx="64" cy="36" r="12.5" fill="url(#ca-aggregate-core)" stroke="hsl(52, 100%, 92%)" stroke-width="1.4"/>
     <path d="M64 19 L67 33 L81 36 L67 39 L64 53 L61 39 L47 36 L61 33 Z" fill="hsl(54, 100%, 97%)"/>
     <path d="M16 14 L26 19 M112 14 L102 19 M16 58 L26 53 M112 58 L102 53 M24 34 L36 35 M104 38 L92 37" stroke="hsl(50, 100%, 88%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="10" cy="11" r="2.1" fill="hsl(190, 100%, 82%)"/><circle cx="118" cy="11" r="2.1" fill="hsl(46, 100%, 80%)"/>
     <circle cx="10" cy="61" r="2.1" fill="hsl(46, 100%, 80%)"/><circle cx="118" cy="61" r="2.1" fill="hsl(190, 100%, 82%)"/>
     <circle cx="32" cy="10" r="1.7" fill="hsl(48, 100%, 88%)"/><circle cx="96" cy="62" r="1.7" fill="hsl(48, 100%, 88%)"/>
     <circle cx="96" cy="10" r="1.7" fill="hsl(192, 100%, 84%)"/><circle cx="32" cy="62" r="1.7" fill="hsl(192, 100%, 84%)"/>`,
    'hsla(44, 100%, 60%, 0.30)',
    `<radialGradient id="ca-aggregate-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(50, 100%, 92%)" stop-opacity="0.9"/><stop offset="46%" stop-color="hsl(192, 100%, 62%)" stop-opacity="0.46"/><stop offset="100%" stop-color="hsl(224, 80%, 24%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-aggregate-core" cx="46%" cy="44%" r="56%"><stop offset="0%" stop-color="hsl(54, 100%, 98%)"/><stop offset="50%" stop-color="hsl(44, 100%, 68%)"/><stop offset="100%" stop-color="hsl(194, 100%, 54%)"/></radialGradient><linearGradient id="ca-aggregate-cyan" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(192, 100%, 72%)" stop-opacity="0.25"/><stop offset="50%" stop-color="hsl(188, 100%, 82%)"/><stop offset="100%" stop-color="hsl(192, 100%, 72%)" stop-opacity="0.25"/></linearGradient><linearGradient id="ca-aggregate-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(46, 100%, 72%)" stop-opacity="0.25"/><stop offset="50%" stop-color="hsl(50, 100%, 88%)"/><stop offset="100%" stop-color="hsl(46, 100%, 72%)" stop-opacity="0.25"/></linearGradient>`
  ),

  auto_shields: wrapArtSvg(
    'auto_shields',
    'hsl(198, 62%, 17%)',
    'hsl(224, 58%, 7%)',
    `<path d="M64 60 L10 18 L118 18 Z" fill="url(#ca-auto_shields-beam)" opacity="0.58"/>
     <path d="M48 64 L54 54 H74 L80 64 Z" fill="hsl(214, 42%, 18%)" stroke="hsl(192, 96%, 68%)" stroke-width="1.3"/>
     <circle cx="64" cy="59" r="3.4" fill="hsl(188, 100%, 84%)" stroke="hsl(196, 100%, 96%)" stroke-width="1"/>
     <polygon points="64,12 80,21 80,39 64,48 48,39 48,21" fill="url(#ca-auto_shields-hex)" stroke="hsl(186, 100%, 86%)" stroke-width="1.8"/>
     <polygon points="64,17 75,23.5 75,36.5 64,43 53,36.5 53,23.5" fill="none" stroke="hsl(192, 100%, 92%)" stroke-width="0.9" opacity="0.72"/>
     <polygon points="34,18 46,24 46,40 34,47 22,40 22,25" fill="url(#ca-auto_shields-hex)" stroke="hsl(192, 98%, 74%)" stroke-width="1.5" opacity="0.88"/>
     <polygon points="94,18 106,25 106,40 94,47 82,40 82,24" fill="url(#ca-auto_shields-hex)" stroke="hsl(192, 98%, 74%)" stroke-width="1.5" opacity="0.88"/>
     <polygon points="12,26 20,30 20,43 12,47 6,42 6,31" fill="url(#ca-auto_shields-hex)" stroke="hsl(194, 96%, 68%)" stroke-width="1.2" opacity="0.62"/>
     <polygon points="116,26 122,31 122,42 116,47 108,43 108,30" fill="url(#ca-auto_shields-hex)" stroke="hsl(194, 96%, 68%)" stroke-width="1.2" opacity="0.62"/>
     <path d="M58 29 L64 23 L70 29 M58 35 L64 29 L70 35" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M22 14 L28 14 L28 20 M106 14 L100 14 L100 20 M14 52 L22 52 M106 52 L114 52" fill="none" stroke="hsl(46, 100%, 76%)" stroke-width="1.3" stroke-linecap="round"/>
     <path d="M20 30 H108 M26 36 H102" stroke="hsl(188, 100%, 88%)" stroke-width="0.6" stroke-dasharray="3 4" opacity="0.45"/>
     <circle cx="48" cy="21" r="1.6" fill="hsl(52, 100%, 94%)"/><circle cx="80" cy="21" r="1.6" fill="hsl(52, 100%, 94%)"/>
     <circle cx="64" cy="12" r="1.8" fill="hsl(186, 100%, 94%)"/>`,
    'hsla(188, 100%, 60%, 0.30)',
    `<linearGradient id="ca-auto_shields-beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(188, 100%, 76%)" stop-opacity="0.85"/><stop offset="62%" stop-color="hsl(196, 100%, 58%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(206, 90%, 40%)" stop-opacity="0"/></linearGradient><linearGradient id="ca-auto_shields-hex" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(186, 100%, 84%)" stop-opacity="0.58"/><stop offset="52%" stop-color="hsl(196, 96%, 54%)" stop-opacity="0.26"/><stop offset="100%" stop-color="hsl(214, 90%, 36%)" stop-opacity="0.44"/></linearGradient>`
  ),

  boot_sequence: wrapArtSvg(
    'boot_sequence',
    'hsl(214, 56%, 15%)',
    'hsl(228, 46%, 6%)',
    `<path d="M10 10 L36 10 L44 22 L44 50 L36 62 L10 62 Z M118 10 L92 10 L84 22 L84 50 L92 62 L118 62 Z" fill="url(#ca-boot_sequence-chassis)" stroke="hsl(208, 42%, 40%)" stroke-width="1.3"/>
     <path d="M18 22 H34 M18 30 H30 M18 42 H30 M18 50 H34 M110 22 H94 M110 30 H98 M110 42 H98 M110 50 H94" stroke="hsl(192, 94%, 66%)" stroke-width="1.4" stroke-linecap="round" opacity="0.76"/>
     <circle cx="64" cy="36" r="28" fill="url(#ca-boot_sequence-halo)"/>
     <circle cx="64" cy="36" r="25" fill="none" stroke="hsl(194, 96%, 62%)" stroke-width="1.5" stroke-dasharray="14 5 4 5" opacity="0.78"/>
     <circle cx="64" cy="36" r="20" fill="none" stroke="hsl(46, 100%, 74%)" stroke-width="1.3" stroke-dasharray="9 6" opacity="0.86"/>
     <path d="M46 18 L58 24 L52 34 Z M82 18 L70 24 L76 34 Z M82 54 L70 48 L76 38 Z M46 54 L58 48 L52 38 Z" fill="hsl(218, 38%, 22%)" stroke="hsl(198, 76%, 62%)" stroke-width="1"/>
     <circle cx="64" cy="36" r="14.5" fill="url(#ca-boot_sequence-eye)" stroke="hsl(186, 100%, 88%)" stroke-width="1.6"/>
     <circle cx="64" cy="36" r="8.2" fill="hsl(52, 100%, 96%)" stroke="hsl(44, 100%, 72%)" stroke-width="1.2"/>
     <circle cx="64" cy="36" r="3.4" fill="hsl(192, 100%, 62%)"/>
     <path d="M12 36 L116 36" stroke="url(#ca-boot_sequence-flare)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M64 6 V14 M64 58 V66 M44 36 H50 M78 36 H84" stroke="hsl(188, 100%, 84%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="22" cy="15" r="1.5" fill="hsl(152, 98%, 68%)"/><circle cx="28" cy="15" r="1.5" fill="hsl(46, 100%, 74%)"/>
     <circle cx="106" cy="57" r="1.5" fill="hsl(152, 98%, 68%)"/><circle cx="100" cy="57" r="1.5" fill="hsl(192, 100%, 78%)"/>`,
    'hsla(190, 100%, 60%, 0.32)',
    `<radialGradient id="ca-boot_sequence-halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(188, 100%, 86%)" stop-opacity="0.9"/><stop offset="48%" stop-color="hsl(198, 100%, 54%)" stop-opacity="0.44"/><stop offset="100%" stop-color="hsl(220, 80%, 20%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-boot_sequence-eye" cx="46%" cy="44%" r="56%"><stop offset="0%" stop-color="hsl(54, 100%, 98%)"/><stop offset="46%" stop-color="hsl(188, 100%, 72%)"/><stop offset="100%" stop-color="hsl(214, 92%, 34%)"/></radialGradient><linearGradient id="ca-boot_sequence-chassis" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(216, 30%, 26%)"/><stop offset="100%" stop-color="hsl(226, 40%, 12%)"/></linearGradient><linearGradient id="ca-boot_sequence-flare" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(190, 100%, 76%)" stop-opacity="0"/><stop offset="35%" stop-color="hsl(188, 100%, 88%)" stop-opacity="0.72"/><stop offset="50%" stop-color="hsl(54, 100%, 98%)" stop-opacity="0.95"/><stop offset="65%" stop-color="hsl(188, 100%, 88%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(190, 100%, 76%)" stop-opacity="0"/></linearGradient>`
  ),

  chaos: wrapArtSvg(
    'chaos',
    'hsl(244, 54%, 16%)',
    'hsl(268, 52%, 7%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-chaos-burst)"/>
     <path d="M12 12 Q36 8 64 36" fill="none" stroke="hsl(48, 100%, 66%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M116 12 Q92 8 64 36" fill="none" stroke="hsl(192, 100%, 74%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M12 60 Q36 64 64 36" fill="none" stroke="hsl(278, 94%, 64%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M116 60 Q92 64 64 36" fill="none" stroke="hsl(24, 100%, 64%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M24 22 L38 18 L46 28 L56 26 L64 36" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M104 22 Q88 26 78 24 Q70 30 64 36" fill="none" stroke="hsl(188, 100%, 92%)" stroke-width="1.3"/>
     <path d="M24 50 Q40 46 50 48 Q58 42 64 36" fill="none" stroke="hsl(292, 100%, 82%)" stroke-width="1.3"/>
     <path d="M104 50 Q88 46 78 48 Q70 42 64 36" fill="none" stroke="hsl(42, 100%, 88%)" stroke-width="1.3"/>
     <circle cx="24" cy="18" r="8.5" fill="url(#ca-chaos-lightning)" stroke="hsl(52, 100%, 90%)" stroke-width="1.3"/>
     <polygon points="104,10 112,18 104,26 96,18" fill="url(#ca-chaos-frost)" stroke="hsl(190, 100%, 92%)" stroke-width="1.3"/>
     <circle cx="24" cy="54" r="8.5" fill="url(#ca-chaos-dark)" stroke="hsl(286, 98%, 74%)" stroke-width="1.3"/>
     <circle cx="104" cy="54" r="8.5" fill="url(#ca-chaos-plasma)" stroke="hsl(40, 100%, 86%)" stroke-width="1.3"/>
     <polygon points="64,20 71,31 82,36 71,41 64,52 57,41 46,36 57,31" fill="hsl(54, 100%, 97%)" stroke="hsl(312, 98%, 76%)" stroke-width="1"/>
     <path d="M64 8 L66 18 M64 64 L62 54 M44 12 L52 22 M84 12 L76 22 M44 60 L52 50 M84 60 L76 50" stroke="hsl(52, 100%, 88%)" stroke-width="1.3" stroke-linecap="round"/>
     <circle cx="64" cy="36" r="4.5" fill="hsl(54, 100%, 98%)"/>`,
    'hsla(296, 94%, 64%, 0.30)',
    `<radialGradient id="ca-chaos-burst" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)" stop-opacity="0.95"/><stop offset="42%" stop-color="hsl(308, 96%, 64%)" stop-opacity="0.54"/><stop offset="76%" stop-color="hsl(196, 96%, 56%)" stop-opacity="0.26"/><stop offset="100%" stop-color="hsl(260, 70%, 16%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-chaos-lightning" cx="42%" cy="38%" r="58%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="56%" stop-color="hsl(46, 100%, 62%)"/><stop offset="100%" stop-color="hsl(32, 96%, 40%)"/></radialGradient><linearGradient id="ca-chaos-frost" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(190, 100%, 94%)"/><stop offset="56%" stop-color="hsl(194, 100%, 68%)"/><stop offset="100%" stop-color="hsl(212, 90%, 42%)"/></linearGradient><radialGradient id="ca-chaos-dark" cx="42%" cy="38%" r="58%"><stop offset="0%" stop-color="hsl(288, 96%, 72%)"/><stop offset="50%" stop-color="hsl(274, 86%, 32%)"/><stop offset="100%" stop-color="hsl(264, 70%, 10%)"/></radialGradient><radialGradient id="ca-chaos-plasma" cx="42%" cy="38%" r="58%"><stop offset="0%" stop-color="hsl(52, 100%, 94%)"/><stop offset="52%" stop-color="hsl(26, 100%, 60%)"/><stop offset="100%" stop-color="hsl(348, 92%, 44%)"/></radialGradient>`
  ),

  chill: wrapArtSvg(
    'chill',
    'hsl(202, 68%, 18%)',
    'hsl(222, 64%, 8%)',
    `<ellipse cx="64" cy="58" rx="64" ry="18" fill="url(#ca-chill-mist)" opacity="0.72"/>
     <circle cx="64" cy="35" r="28" fill="url(#ca-chill-glow)"/>
     <path d="M0 0 L24 14 L10 22 L0 32 Z M128 0 L104 14 L118 22 L128 32 Z M0 72 L22 56 L32 66 L44 72 Z M128 72 L106 56 L96 66 L84 72 Z" fill="url(#ca-chill-crystal)" opacity="0.62"/>
     <path d="M64 6 V64 M34 20 L94 50 M94 20 L34 50" stroke="hsl(192, 100%, 84%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M64 14 L57 8 M64 14 L71 8 M64 56 L57 62 M64 56 L71 62 M43 24 L35 28 M43 24 L42 15 M85 24 L93 28 M85 24 L86 15 M43 46 L35 42 M43 46 L42 55 M85 46 L93 42 M85 46 L86 55" fill="none" stroke="hsl(190, 100%, 92%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="64,17 79,26 79,44 64,53 49,44 49,26" fill="url(#ca-chill-core)" stroke="hsl(190, 100%, 94%)" stroke-width="1.5"/>
     <polygon points="64,23 74,29 74,41 64,47 54,41 54,29" fill="none" stroke="hsl(196, 100%, 98%)" stroke-width="1.1"/>
     <polygon points="64,27 70,35 64,43 58,35" fill="hsl(190, 100%, 96%)"/>
     <path d="M8 36 Q24 28 38 36 Q24 44 8 36 M120 36 Q104 28 90 36 Q104 44 120 36" fill="none" stroke="hsl(192, 100%, 80%)" stroke-width="1.2" opacity="0.68"/>
     <polygon points="22,30 26,35 22,40 18,35" fill="hsl(190, 100%, 88%)" opacity="0.86"/>
     <polygon points="106,30 110,35 106,40 102,35" fill="hsl(190, 100%, 88%)" opacity="0.86"/>
     <circle cx="32" cy="14" r="1.5" fill="hsl(190, 100%, 95%)"/><circle cx="96" cy="14" r="1.5" fill="hsl(190, 100%, 95%)"/>
     <circle cx="28" cy="56" r="1.6" fill="hsl(192, 100%, 90%)"/><circle cx="100" cy="56" r="1.6" fill="hsl(192, 100%, 90%)"/>`,
    'hsla(190, 100%, 76%, 0.32)',
    `<radialGradient id="ca-chill-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(190, 100%, 96%)" stop-opacity="0.88"/><stop offset="48%" stop-color="hsl(196, 100%, 66%)" stop-opacity="0.42"/><stop offset="100%" stop-color="hsl(214, 90%, 30%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-chill-crystal" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(188, 100%, 92%)"/><stop offset="55%" stop-color="hsl(196, 96%, 64%)"/><stop offset="100%" stop-color="hsl(212, 86%, 36%)"/></linearGradient><radialGradient id="ca-chill-core" cx="44%" cy="40%" r="58%"><stop offset="0%" stop-color="hsl(190, 100%, 96%)" stop-opacity="0.88"/><stop offset="55%" stop-color="hsl(196, 100%, 66%)" stop-opacity="0.52"/><stop offset="100%" stop-color="hsl(214, 92%, 38%)" stop-opacity="0.72"/></radialGradient><linearGradient id="ca-chill-mist" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(194, 100%, 84%)" stop-opacity="0.62"/><stop offset="100%" stop-color="hsl(204, 90%, 54%)" stop-opacity="0"/></linearGradient>`
  ),

  consume: wrapArtSvg(
    'consume',
    'hsl(232, 60%, 16%)',
    'hsl(264, 58%, 7%)',
    `<circle cx="84" cy="36" r="30" fill="url(#ca-consume-aura)"/>
     <path d="M18 14 Q48 16 78 34 M12 36 Q46 32 78 36 M18 58 Q48 56 78 38" fill="none" stroke="url(#ca-consume-vortex)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M26 22 Q52 24 76 35 M26 50 Q52 48 76 37" fill="none" stroke="hsl(46, 100%, 78%)" stroke-width="1.4" stroke-linecap="round" opacity="0.86"/>
     <circle cx="24" cy="36" r="14" fill="none" stroke="hsl(194, 90%, 68%)" stroke-width="2" stroke-dasharray="7 5" opacity="0.72"/>
     <polygon points="32,20 40,23 36,28" fill="hsl(192, 100%, 78%)"/><polygon points="36,44 45,42 40,49" fill="hsl(280, 96%, 72%)"/>
     <polygon points="48,26 56,28 52,33" fill="hsl(48, 100%, 84%)"/><polygon points="48,46 56,43 53,49" fill="hsl(192, 100%, 82%)"/>
     <path d="M52 36 Q84 12 118 36 Q84 60 52 36 Z" fill="hsl(248, 56%, 10%)" stroke="url(#ca-consume-rim)" stroke-width="2.2" stroke-linejoin="round"/>
     <path d="M58 36 Q84 18 112 36 Q84 54 58 36 Z" fill="hsl(236, 58%, 16%)" stroke="hsl(192, 96%, 74%)" stroke-width="1"/>
     <circle cx="84" cy="36" r="12.5" fill="url(#ca-consume-eye)" stroke="hsl(50, 100%, 88%)" stroke-width="1.4"/>
     <circle cx="84" cy="36" r="6.5" fill="hsl(232, 68%, 12%)" stroke="hsl(190, 100%, 84%)" stroke-width="1.1"/>
     <path d="M84 18 L86 33 L102 36 L86 39 L84 54 L82 39 L66 36 L82 33 Z" fill="hsl(54, 100%, 96%)" opacity="0.92"/>
     <circle cx="18" cy="24" r="1.5" fill="hsl(190, 100%, 86%)"/><circle cx="16" cy="48" r="1.6" fill="hsl(286, 100%, 78%)"/>
     <circle cx="114" cy="22" r="1.6" fill="hsl(48, 100%, 88%)"/><circle cx="112" cy="52" r="1.6" fill="hsl(190, 100%, 86%)"/>`,
    'hsla(198, 100%, 60%, 0.30)',
    `<radialGradient id="ca-consume-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 88%)" stop-opacity="0.9"/><stop offset="48%" stop-color="hsl(196, 100%, 58%)" stop-opacity="0.44"/><stop offset="100%" stop-color="hsl(268, 80%, 24%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-consume-vortex" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(280, 96%, 64%)" stop-opacity="0.25"/><stop offset="55%" stop-color="hsl(192, 100%, 72%)"/><stop offset="100%" stop-color="hsl(48, 100%, 88%)"/></linearGradient><radialGradient id="ca-consume-eye" cx="46%" cy="44%" r="56%"><stop offset="0%" stop-color="hsl(54, 100%, 98%)"/><stop offset="48%" stop-color="hsl(44, 100%, 66%)"/><stop offset="100%" stop-color="hsl(196, 100%, 48%)"/></radialGradient><linearGradient id="ca-consume-rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(190, 100%, 82%)"/><stop offset="52%" stop-color="hsl(48, 100%, 76%)"/><stop offset="100%" stop-color="hsl(286, 96%, 66%)"/></linearGradient>`
  ),

  darkness: wrapArtSvg(
    'darkness',
    'hsl(268, 60%, 14%)',
    'hsl(282, 58%, 5%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-darkness-halo)"/>
     <ellipse cx="64" cy="36" rx="46" ry="15" fill="none" stroke="hsl(282, 92%, 62%)" stroke-width="1.3" opacity="0.55" transform="rotate(-16 64 36)"/>
     <ellipse cx="64" cy="36" rx="44" ry="13" fill="none" stroke="hsl(296, 98%, 74%)" stroke-width="1.1" stroke-dasharray="7 5" opacity="0.68" transform="rotate(16 64 36)"/>
     <path d="M18 36 L30 28 L34 34 L46 26 M110 36 L98 44 L94 38 L82 46 M34 12 L46 20 L42 25 L52 24 M94 60 L82 52 L86 47 L76 48" fill="none" stroke="hsl(290, 100%, 78%)" stroke-width="1.8" stroke-linejoin="round"/>
     <path d="M18 36 L30 28 L34 34 L46 26 M110 36 L98 44 L94 38 L82 46" fill="none" stroke="hsl(300, 100%, 94%)" stroke-width="0.8" stroke-linejoin="round"/>
     <circle cx="64" cy="36" r="19" fill="url(#ca-darkness-core)" stroke="hsl(288, 100%, 74%)" stroke-width="1.8"/>
     <path d="M52 26 Q64 19 76 28 M50 42 Q64 51 78 40" fill="none" stroke="hsl(294, 100%, 84%)" stroke-width="1.2" opacity="0.72"/>
     <path d="M55 36 Q64 28 73 36 Q64 44 55 36" fill="none" stroke="hsl(274, 92%, 52%)" stroke-width="1.4" opacity="0.78"/>
     <path d="M40 24 L48 22 L46 31 L54 34 L45 41 L50 48 M88 48 L80 50 L82 41 L74 38 L83 31 L78 24" fill="none" stroke="hsl(284, 100%, 76%)" stroke-width="1.5" stroke-linejoin="round"/>
     <circle cx="24" cy="20" r="1.8" fill="hsl(294, 100%, 84%)"/><circle cx="104" cy="20" r="1.8" fill="hsl(284, 100%, 76%)"/>
     <circle cx="24" cy="54" r="1.6" fill="hsl(284, 100%, 76%)"/><circle cx="104" cy="54" r="1.8" fill="hsl(294, 100%, 84%)"/>
     <circle cx="64" cy="11" r="1.6" fill="hsl(296, 100%, 90%)"/><circle cx="64" cy="61" r="1.6" fill="hsl(296, 100%, 90%)"/>`,
    'hsla(278, 96%, 58%, 0.30)',
    `<radialGradient id="ca-darkness-halo" cx="50%" cy="50%" r="50%"><stop offset="32%" stop-color="hsl(288, 100%, 70%)" stop-opacity="0.88"/><stop offset="64%" stop-color="hsl(272, 92%, 44%)" stop-opacity="0.42"/><stop offset="100%" stop-color="hsl(268, 70%, 14%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-darkness-core" cx="44%" cy="42%" r="58%"><stop offset="0%" stop-color="hsl(270, 64%, 3%)"/><stop offset="64%" stop-color="hsl(272, 68%, 9%)"/><stop offset="88%" stop-color="hsl(282, 88%, 34%)"/><stop offset="100%" stop-color="hsl(294, 100%, 72%)"/></radialGradient>`
  ),

  double_energy: wrapArtSvg(
    'double_energy',
    'hsl(214, 62%, 17%)',
    'hsl(230, 56%, 7%)',
    `<circle cx="34" cy="36" r="24" fill="url(#ca-double_energy-glow)"/>
     <circle cx="94" cy="36" r="24" fill="url(#ca-double_energy-glow)"/>
     <path d="M34 36 Q50 22 64 36 Q78 50 94 36 M34 36 Q50 50 64 36 Q78 22 94 36" fill="none" stroke="url(#ca-double_energy-bridge)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M34 36 H94" stroke="hsl(54, 100%, 96%)" stroke-width="2.2"/>
     <circle cx="34" cy="36" r="18.5" fill="hsl(222, 46%, 12%)" stroke="hsl(194, 96%, 68%)" stroke-width="1.8"/>
     <circle cx="34" cy="36" r="14" fill="none" stroke="hsl(46, 100%, 74%)" stroke-width="1.4" stroke-dasharray="8 4"/>
     <circle cx="34" cy="36" r="9.5" fill="url(#ca-double_energy-core)" stroke="hsl(52, 100%, 92%)" stroke-width="1.3"/>
     <circle cx="94" cy="36" r="18.5" fill="hsl(222, 46%, 12%)" stroke="hsl(194, 96%, 68%)" stroke-width="1.8"/>
     <circle cx="94" cy="36" r="14" fill="none" stroke="hsl(46, 100%, 74%)" stroke-width="1.4" stroke-dasharray="8 4"/>
     <circle cx="94" cy="36" r="9.5" fill="url(#ca-double_energy-core)" stroke="hsl(52, 100%, 92%)" stroke-width="1.3"/>
     <path d="M34 10 V17 M34 55 V62 M8 36 H15 M94 10 V17 M94 55 V62 M113 36 H120" stroke="hsl(190, 100%, 82%)" stroke-width="1.8" stroke-linecap="round"/>
     <polygon points="64,25 70,36 64,47 58,36" fill="hsl(54, 100%, 96%)" stroke="hsl(44, 100%, 66%)" stroke-width="1.2"/>
     <path d="M34 29 L36 34 L41 36 L36 38 L34 43 L32 38 L27 36 L32 34 Z M94 29 L96 34 L101 36 L96 38 L94 43 L92 38 L87 36 L92 34 Z" fill="hsl(54, 100%, 98%)"/>
     <circle cx="20" cy="14" r="1.6" fill="hsl(48, 100%, 86%)"/><circle cx="108" cy="14" r="1.6" fill="hsl(48, 100%, 86%)"/>
     <circle cx="20" cy="58" r="1.6" fill="hsl(190, 100%, 84%)"/><circle cx="108" cy="58" r="1.6" fill="hsl(190, 100%, 84%)"/>`,
    'hsla(46, 100%, 62%, 0.32)',
    `<radialGradient id="ca-double_energy-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(50, 100%, 92%)" stop-opacity="0.9"/><stop offset="48%" stop-color="hsl(192, 100%, 60%)" stop-opacity="0.46"/><stop offset="100%" stop-color="hsl(220, 80%, 22%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-double_energy-core" cx="44%" cy="40%" r="58%"><stop offset="0%" stop-color="hsl(54, 100%, 98%)"/><stop offset="52%" stop-color="hsl(44, 100%, 66%)"/><stop offset="100%" stop-color="hsl(194, 100%, 54%)"/></radialGradient><linearGradient id="ca-double_energy-bridge" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(46, 100%, 74%)"/><stop offset="50%" stop-color="hsl(188, 100%, 84%)"/><stop offset="100%" stop-color="hsl(46, 100%, 74%)"/></linearGradient>`
  ),

  equilibrium: wrapArtSvg(
    'equilibrium',
    'hsl(208, 52%, 17%)',
    'hsl(226, 48%, 7%)',
    `<circle cx="64" cy="34" r="28" fill="url(#ca-equilibrium-aura)"/>
     <path d="M8 34 H120" stroke="hsl(192, 82%, 64%)" stroke-width="0.9" stroke-dasharray="3 4" opacity="0.42"/>
     <ellipse cx="64" cy="34" rx="22" ry="8" fill="none" stroke="url(#ca-equilibrium-bronze)" stroke-width="1.6" transform="rotate(-24 64 34)"/>
     <ellipse cx="64" cy="34" rx="22" ry="8" fill="none" stroke="url(#ca-equilibrium-bronze)" stroke-width="1.6" transform="rotate(24 64 34)"/>
     <circle cx="64" cy="34" r="14.5" fill="none" stroke="url(#ca-equilibrium-bronze)" stroke-width="2"/>
     <path d="M22 34 L106 34" stroke="url(#ca-equilibrium-bronze)" stroke-width="2.4" stroke-linecap="round"/>
     <circle cx="22" cy="34" r="2.6" fill="hsl(42, 92%, 74%)"/><circle cx="106" cy="34" r="2.6" fill="hsl(42, 92%, 74%)"/>
     <path d="M22 36 L14 52 M22 36 L30 52 M106 36 L98 52 M106 36 L114 52" stroke="hsl(190, 96%, 76%)" stroke-width="1" opacity="0.82"/>
     <path d="M11 52 Q22 59 33 52 Z M95 52 Q106 59 117 52 Z" fill="url(#ca-equilibrium-bronze)" stroke="hsl(46, 98%, 82%)" stroke-width="1"/>
     <polygon points="22,40 27,46 22,52 17,46" fill="url(#ca-equilibrium-crystal)" stroke="hsl(188, 100%, 92%)" stroke-width="1"/>
     <polygon points="106,40 111,46 106,52 101,46" fill="url(#ca-equilibrium-crystal)" stroke="hsl(188, 100%, 92%)" stroke-width="1"/>
     <polygon points="64,21 73,34 64,47 55,34" fill="url(#ca-equilibrium-crystal)" stroke="hsl(190, 100%, 94%)" stroke-width="1.3"/>
     <polygon points="64,26 68,34 64,42 60,34" fill="hsl(54, 100%, 96%)" opacity="0.88"/>
     <path d="M64 10 V17 M64 51 V62 M54 62 H74" stroke="url(#ca-equilibrium-bronze)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="22" cy="22" r="1.4" fill="hsl(190, 100%, 88%)"/><circle cx="106" cy="22" r="1.4" fill="hsl(190, 100%, 88%)"/>`,
    'hsla(186, 94%, 64%, 0.28)',
    `<radialGradient id="ca-equilibrium-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(188, 100%, 84%)" stop-opacity="0.72"/><stop offset="56%" stop-color="hsl(198, 92%, 50%)" stop-opacity="0.26"/><stop offset="100%" stop-color="hsl(222, 70%, 18%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-equilibrium-bronze" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(44, 96%, 82%)"/><stop offset="52%" stop-color="hsl(34, 76%, 54%)"/><stop offset="100%" stop-color="hsl(26, 62%, 34%)"/></linearGradient><linearGradient id="ca-equilibrium-crystal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(184, 100%, 92%)"/><stop offset="56%" stop-color="hsl(194, 100%, 62%)"/><stop offset="100%" stop-color="hsl(214, 90%, 38%)"/></linearGradient>`
  ),

  force_field: wrapArtSvg(
    'force_field',
    'hsl(206, 66%, 17%)',
    'hsl(226, 60%, 7%)',
    `<path d="M10 66 A54 48 0 0 1 118 66 Z" fill="url(#ca-force_field-dome)" stroke="hsl(188, 100%, 84%)" stroke-width="2"/>
     <path d="M18 66 L36 34 L64 20 L92 34 L110 66 M36 34 L92 34 M24 50 L104 50 M64 20 L48 50 L64 66 L80 50 Z M36 34 L48 50 L24 50 M92 34 L80 50 L104 50" fill="none" stroke="hsl(192, 100%, 82%)" stroke-width="1.1" opacity="0.78"/>
     <path d="M6 66 H122" stroke="hsl(188, 100%, 78%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="38" cy="27" r="14" fill="url(#ca-force_field-impact)"/>
     <circle cx="94" cy="26" r="12" fill="url(#ca-force_field-impact)"/>
     <circle cx="38" cy="27" r="7" fill="none" stroke="hsl(188, 100%, 92%)" stroke-width="1.4" opacity="0.88"/>
     <circle cx="94" cy="26" r="6" fill="none" stroke="hsl(188, 100%, 92%)" stroke-width="1.3" opacity="0.85"/>
     <path d="M4 10 L37 26 M8 24 L37 26" stroke="url(#ca-force_field-hit)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M124 8 L95 25 M120 22 L95 25" stroke="url(#ca-force_field-hit)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M38 27 L44 12 M38 27 L24 14 M38 27 L52 16 M94 26 L86 11 M94 26 L108 12" stroke="hsl(44, 100%, 82%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="38" cy="27" r="2.8" fill="hsl(54, 100%, 98%)"/><circle cx="94" cy="26" r="2.4" fill="hsl(54, 100%, 98%)"/>
     <circle cx="64" cy="20" r="1.8" fill="hsl(188, 100%, 94%)"/><circle cx="48" cy="50" r="1.5" fill="hsl(190, 100%, 88%)"/>
     <circle cx="80" cy="50" r="1.5" fill="hsl(190, 100%, 88%)"/><circle cx="20" cy="8" r="1.5" fill="hsl(32, 100%, 72%)"/>`,
    'hsla(190, 100%, 62%, 0.30)',
    `<radialGradient id="ca-force_field-dome" cx="50%" cy="68%" r="62%"><stop offset="0%" stop-color="hsl(194, 100%, 68%)" stop-opacity="0.16"/><stop offset="68%" stop-color="hsl(194, 100%, 58%)" stop-opacity="0.44"/><stop offset="100%" stop-color="hsl(186, 100%, 86%)" stop-opacity="0.72"/></radialGradient><radialGradient id="ca-force_field-impact" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)" stop-opacity="0.95"/><stop offset="48%" stop-color="hsl(32, 100%, 62%)" stop-opacity="0.56"/><stop offset="100%" stop-color="hsl(190, 100%, 66%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-force_field-hit" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(12, 98%, 58%)" stop-opacity="0.25"/><stop offset="60%" stop-color="hsl(32, 100%, 66%)"/><stop offset="100%" stop-color="hsl(54, 100%, 96%)"/></linearGradient>`
  ),

  fusion: wrapArtSvg(
    'fusion',
    'hsl(232, 56%, 16%)',
    'hsl(20, 62%, 8%)',
    `<circle cx="64" cy="36" r="36" fill="url(#ca-fusion-corona)"/>
     <path d="M64 2 V70 M16 36 H112 M26 10 L102 62 M102 10 L26 62" stroke="hsl(44, 100%, 74%)" stroke-width="1" opacity="0.34"/>
     <ellipse cx="64" cy="36" rx="48" ry="15" fill="none" stroke="url(#ca-fusion-ring)" stroke-width="2" transform="rotate(-26 64 36)"/>
     <ellipse cx="64" cy="36" rx="48" ry="15" fill="none" stroke="url(#ca-fusion-ring)" stroke-width="2" transform="rotate(26 64 36)"/>
     <path d="M46 24 Q52 10 64 14 Q74 8 80 22 Q94 28 84 42 Q88 56 72 54 Q62 64 50 52 Q36 48 44 36 Q38 26 46 24 Z" fill="hsl(28, 100%, 58%)" opacity="0.58"/>
     <circle cx="64" cy="36" r="16.5" fill="url(#ca-fusion-sun)" stroke="hsl(50, 100%, 90%)" stroke-width="1.6"/>
     <circle cx="64" cy="36" r="9" fill="hsl(54, 100%, 97%)" opacity="0.92"/>
     <path d="M52 32 Q64 24 76 34 M54 42 Q64 48 74 40" fill="none" stroke="hsl(34, 100%, 76%)" stroke-width="1.4" opacity="0.82"/>
     <ellipse cx="64" cy="36" rx="28" ry="26" fill="none" stroke="hsl(192, 100%, 76%)" stroke-width="1.1" stroke-dasharray="5 6" opacity="0.72"/>
     <circle cx="24" cy="18" r="2.6" fill="hsl(190, 100%, 84%)" stroke="hsl(54, 100%, 96%)" stroke-width="0.9"/>
     <circle cx="104" cy="54" r="2.6" fill="hsl(190, 100%, 84%)" stroke="hsl(54, 100%, 96%)" stroke-width="0.9"/>
     <circle cx="104" cy="18" r="2.2" fill="hsl(46, 100%, 84%)"/><circle cx="24" cy="54" r="2.2" fill="hsl(46, 100%, 84%)"/>
     <circle cx="42" cy="12" r="1.4" fill="hsl(52, 100%, 92%)"/><circle cx="88" cy="60" r="1.5" fill="hsl(36, 100%, 78%)"/>`,
    'hsla(36, 100%, 62%, 0.36)',
    `<radialGradient id="ca-fusion-corona" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 94%)" stop-opacity="0.95"/><stop offset="44%" stop-color="hsl(32, 100%, 58%)" stop-opacity="0.62"/><stop offset="76%" stop-color="hsl(14, 96%, 44%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(232, 70%, 16%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-fusion-sun" cx="44%" cy="40%" r="58%"><stop offset="0%" stop-color="hsl(54, 100%, 98%)"/><stop offset="48%" stop-color="hsl(44, 100%, 68%)"/><stop offset="82%" stop-color="hsl(24, 100%, 54%)"/><stop offset="100%" stop-color="hsl(8, 94%, 44%)"/></radialGradient><linearGradient id="ca-fusion-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(190, 100%, 78%)"/><stop offset="50%" stop-color="hsl(48, 100%, 84%)"/><stop offset="100%" stop-color="hsl(190, 100%, 78%)"/></linearGradient>`
  ),

  genetic_algorithm: wrapArtSvg(
    'genetic_algorithm',
    'hsl(182, 58%, 15%)',
    'hsl(214, 58%, 7%)',
    `<ellipse cx="64" cy="36" rx="54" ry="26" fill="url(#ca-genetic_algorithm-glow)"/>
     <polygon points="30,18 46,12 56,28 40,36" fill="url(#ca-genetic_algorithm-plate)" stroke="hsl(172, 92%, 62%)" stroke-width="1.3"/>
     <polygon points="56,28 74,20 84,38 66,46" fill="url(#ca-genetic_algorithm-plate)" stroke="hsl(186, 98%, 74%)" stroke-width="1.5"/>
     <polygon points="84,38 102,30 110,48 92,56" fill="url(#ca-genetic_algorithm-plate)" stroke="hsl(172, 92%, 62%)" stroke-width="1.3"/>
     <polygon points="44,44 62,38 70,54 52,62" fill="url(#ca-genetic_algorithm-plate)" stroke="hsl(164, 94%, 64%)" stroke-width="1.2" opacity="0.88"/>
     <path d="M10 56 C26 56, 30 22, 48 22 C66 22, 70 50, 88 50 C106 50, 110 16, 124 16" fill="none" stroke="hsl(162, 100%, 66%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M10 30 C26 30, 30 60, 48 60 C66 60, 70 16, 88 16 C106 16, 110 44, 124 44" fill="none" stroke="hsl(192, 100%, 74%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M22 44 L22 38 M38 30 L38 50 M48 22 L48 60 M58 28 L58 52 M78 36 L78 24 M88 50 L88 16 M98 44 L98 22 M114 26 L114 38" stroke="hsl(176, 100%, 88%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="48" cy="22" r="2.4" fill="hsl(52, 100%, 92%)"/><circle cx="48" cy="60" r="2.4" fill="hsl(190, 100%, 88%)"/>
     <circle cx="88" cy="16" r="2.4" fill="hsl(190, 100%, 88%)"/><circle cx="88" cy="50" r="2.4" fill="hsl(52, 100%, 92%)"/>
     <path d="M64 31 L70 34 L70 40 L64 43 L58 40 L58 34 Z" fill="hsl(164, 100%, 72%)" stroke="hsl(52, 100%, 94%)" stroke-width="1.1"/>
     <circle cx="16" cy="18" r="1.5" fill="hsl(164, 100%, 80%)"/><circle cx="114" cy="58" r="1.6" fill="hsl(190, 100%, 82%)"/>`,
    'hsla(164, 96%, 56%, 0.30)',
    `<radialGradient id="ca-genetic_algorithm-glow" cx="50%" cy="50%" r="54%"><stop offset="0%" stop-color="hsl(168, 100%, 70%)" stop-opacity="0.46"/><stop offset="60%" stop-color="hsl(192, 96%, 48%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(214, 70%, 16%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-genetic_algorithm-plate" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(198, 42%, 30%)"/><stop offset="55%" stop-color="hsl(210, 46%, 18%)"/><stop offset="100%" stop-color="hsl(222, 52%, 11%)"/></linearGradient>`
  ),

  glacier: wrapArtSvg(
    'glacier',
    'hsl(204, 72%, 20%)',
    'hsl(220, 68%, 8%)',
    `<path d="M0 14 Q32 4 64 16 Q96 26 128 10 L128 30 Q92 42 64 30 Q30 20 0 32 Z" fill="url(#ca-glacier-aurora)" opacity="0.56"/>
     <polygon points="8,72 34,26 56,50 64,14 82,42 104,24 124,72" fill="url(#ca-glacier-shadow)" stroke="hsl(194, 96%, 76%)" stroke-width="1.2" stroke-linejoin="round"/>
     <polygon points="64,14 78,44 64,72 50,48" fill="url(#ca-glacier-ice)"/>
     <polygon points="34,26 48,54 32,72 16,58" fill="url(#ca-glacier-ice)" opacity="0.88"/>
     <polygon points="104,24 118,60 98,72 86,48" fill="url(#ca-glacier-ice)" opacity="0.84"/>
     <path d="M64 14 L64 72 M34 26 L36 72 M104 24 L98 72" stroke="hsl(190, 100%, 95%)" stroke-width="1.3" opacity="0.78"/>
     <path d="M0 64 Q32 60 64 65 Q96 69 128 63 L128 72 L0 72 Z" fill="hsl(214, 74%, 12%)" opacity="0.72"/>
     <circle cx="30" cy="24" r="14" fill="url(#ca-glacier-aura)"/>
     <circle cx="98" cy="26" r="14" fill="url(#ca-glacier-aura)"/>
     <polygon points="30,13 39,18.5 39,29.5 30,35 21,29.5 21,18.5" fill="url(#ca-glacier-orb)" stroke="hsl(190, 100%, 96%)" stroke-width="1.5"/>
     <polygon points="30,18 35,24 30,30 25,24" fill="hsl(190, 100%, 97%)"/>
     <polygon points="98,15 107,20.5 107,31.5 98,37 89,31.5 89,20.5" fill="url(#ca-glacier-orb)" stroke="hsl(190, 100%, 96%)" stroke-width="1.5"/>
     <polygon points="98,20 103,26 98,32 93,26" fill="hsl(190, 100%, 97%)"/>
     <circle cx="14" cy="14" r="1.4" fill="hsl(190, 100%, 96%)"/><circle cx="50" cy="16" r="1.5" fill="hsl(190, 100%, 96%)"/>
     <circle cx="78" cy="12" r="1.4" fill="hsl(190, 100%, 96%)"/><circle cx="116" cy="16" r="1.5" fill="hsl(190, 100%, 96%)"/>`,
    'hsla(192, 100%, 76%, 0.32)',
    `<linearGradient id="ca-glacier-aurora" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(176, 98%, 68%)" stop-opacity="0.2"/><stop offset="50%" stop-color="hsl(192, 100%, 80%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(214, 96%, 68%)" stop-opacity="0.2"/></linearGradient><linearGradient id="ca-glacier-ice" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(190, 100%, 94%)"/><stop offset="52%" stop-color="hsl(198, 96%, 66%)"/><stop offset="100%" stop-color="hsl(214, 86%, 36%)"/></linearGradient><linearGradient id="ca-glacier-shadow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(204, 82%, 52%)"/><stop offset="100%" stop-color="hsl(220, 74%, 18%)"/></linearGradient><radialGradient id="ca-glacier-orb" cx="42%" cy="38%" r="58%"><stop offset="0%" stop-color="hsl(190, 100%, 98%)"/><stop offset="55%" stop-color="hsl(194, 100%, 70%)"/><stop offset="100%" stop-color="hsl(212, 92%, 44%)"/></radialGradient><radialGradient id="ca-glacier-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(190, 100%, 94%)" stop-opacity="0.88"/><stop offset="100%" stop-color="hsl(196, 100%, 62%)" stop-opacity="0"/></radialGradient>`
  ),

  recycle: wrapArtSvg(
    'recycle',
    'hsl(186, 58%, 16%)',
    'hsl(212, 56%, 7%)',
    `<circle cx="64" cy="36" r="28" fill="url(#ca-recycle-aura)"/>
     <rect x="10" y="22" width="18" height="26" rx="2.5" fill="hsl(212, 46%, 18%)" stroke="hsl(190, 92%, 70%)" stroke-width="1.3" transform="rotate(-10 19 35)"/>
     <path d="M14 29 H23 M15 35 H24 M16 41 H22" stroke="hsl(190, 100%, 80%)" stroke-width="1.1" transform="rotate(-10 19 35)"/>
     <rect x="28" y="26" width="4" height="4" fill="hsl(172, 100%, 74%)"/><rect x="33" y="34" width="3.5" height="3.5" fill="hsl(190, 100%, 82%)"/>
     <rect x="29" y="42" width="3" height="3" fill="hsl(162, 100%, 70%)"/>
     <path d="M64 16 L68 20 L74 18 L75 24 L81 26 L79 32 L84 36 L79 40 L81 46 L75 48 L74 54 L68 52 L64 56 L60 52 L54 54 L53 48 L47 46 L49 40 L44 36 L49 32 L47 26 L53 24 L54 18 L60 20 Z" fill="url(#ca-recycle-gear)" stroke="hsl(168, 100%, 78%)" stroke-width="1.3" stroke-linejoin="round"/>
     <circle cx="64" cy="36" r="9.5" fill="hsl(204, 58%, 12%)" stroke="hsl(182, 100%, 84%)" stroke-width="1.4"/>
     <path d="M51 18 A22 22 0 0 1 82 22" fill="none" stroke="hsl(158, 100%, 72%)" stroke-width="2.4" stroke-linecap="round"/>
     <polygon points="84,24 83,16 76,21" fill="hsl(158, 100%, 78%)"/>
     <path d="M84 44 A22 22 0 0 1 56 56" fill="none" stroke="hsl(186, 100%, 76%)" stroke-width="2.4" stroke-linecap="round"/>
     <polygon points="53,55 61,58 58,50" fill="hsl(186, 100%, 82%)"/>
     <path d="M44 42 A22 22 0 0 1 46 24" fill="none" stroke="hsl(48, 100%, 78%)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="48,21 41,24 47,29" fill="hsl(48, 100%, 84%)"/>
     <path d="M86 36 Q98 34 112 24 M86 36 Q100 38 116 42" fill="none" stroke="url(#ca-recycle-out)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="108" cy="25" r="5.5" fill="url(#ca-recycle-energy)" stroke="hsl(52, 100%, 94%)" stroke-width="1.2"/>
     <circle cx="114" cy="43" r="4" fill="url(#ca-recycle-energy)" stroke="hsl(52, 100%, 94%)" stroke-width="1"/>
     <circle cx="64" cy="36" r="4" fill="hsl(52, 100%, 94%)"/>`,
    'hsla(162, 96%, 56%, 0.30)',
    `<radialGradient id="ca-recycle-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(164, 100%, 76%)" stop-opacity="0.82"/><stop offset="56%" stop-color="hsl(188, 96%, 50%)" stop-opacity="0.32"/><stop offset="100%" stop-color="hsl(210, 80%, 18%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-recycle-gear" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(168, 86%, 48%)"/><stop offset="55%" stop-color="hsl(192, 78%, 34%)"/><stop offset="100%" stop-color="hsl(212, 68%, 22%)"/></linearGradient><radialGradient id="ca-recycle-energy" cx="42%" cy="38%" r="58%"><stop offset="0%" stop-color="hsl(54, 100%, 98%)"/><stop offset="54%" stop-color="hsl(46, 100%, 68%)"/><stop offset="100%" stop-color="hsl(164, 100%, 52%)"/></radialGradient><linearGradient id="ca-recycle-out" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(164, 100%, 74%)"/><stop offset="100%" stop-color="hsl(48, 100%, 80%)"/></linearGradient>`
  ),

  reinforced_body: wrapArtSvg(
    'reinforced_body',
    'hsl(212, 52%, 17%)',
    'hsl(226, 48%, 7%)',
    `<circle cx="64" cy="35" r="30" fill="url(#ca-reinforced_body-aura)"/>
     <path d="M16 14 L42 10 L54 22 L46 44 L22 38 Z M112 14 L86 10 L74 22 L82 44 L106 38 Z" fill="url(#ca-reinforced_body-metal)" stroke="hsl(202, 54%, 56%)" stroke-width="1.5" stroke-linejoin="round"/>
     <path d="M36 16 L64 12 L92 16 L88 46 L64 56 L40 46 Z" fill="url(#ca-reinforced_body-chest)" stroke="hsl(194, 96%, 72%)" stroke-width="1.6" stroke-linejoin="round"/>
     <path d="M44 52 L64 60 L84 52 L80 68 L64 72 L48 68 Z" fill="url(#ca-reinforced_body-metal)" stroke="hsl(202, 64%, 58%)" stroke-width="1.4"/>
     <path d="M22 22 L48 28 M106 22 L80 28 M38 36 L52 36 M76 36 L90 36 M48 56 L64 63 L80 56" fill="none" stroke="hsl(190, 100%, 78%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M22 22 L48 28 M106 22 L80 28" stroke="hsl(190, 100%, 96%)" stroke-width="0.9" stroke-linecap="round"/>
     <polygon points="64,21 76,28 76,41 64,48 52,41 52,28" fill="hsl(222, 54%, 12%)" stroke="hsl(188, 100%, 84%)" stroke-width="1.7"/>
     <polygon points="64,25 72,30 72,39 64,44 56,39 56,30" fill="url(#ca-reinforced_body-core)"/>
     <circle cx="64" cy="34.5" r="4" fill="hsl(54, 100%, 97%)"/>
     <circle cx="24" cy="17" r="1.4" fill="hsl(204, 48%, 74%)"/><circle cx="104" cy="17" r="1.4" fill="hsl(204, 48%, 74%)"/>
     <circle cx="42" cy="20" r="1.4" fill="hsl(204, 48%, 74%)"/><circle cx="86" cy="20" r="1.4" fill="hsl(204, 48%, 74%)"/>
     <circle cx="45" cy="43" r="1.4" fill="hsl(204, 48%, 74%)"/><circle cx="83" cy="43" r="1.4" fill="hsl(204, 48%, 74%)"/>
     <path d="M12 12 Q64 2 116 12" fill="none" stroke="hsl(188, 100%, 82%)" stroke-width="1.2" opacity="0.65"/>`,
    'hsla(196, 100%, 60%, 0.30)',
    `<radialGradient id="ca-reinforced_body-aura" cx="50%" cy="48%" r="50%"><stop offset="0%" stop-color="hsl(190, 100%, 84%)" stop-opacity="0.82"/><stop offset="56%" stop-color="hsl(204, 96%, 52%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(222, 76%, 18%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-reinforced_body-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(210, 28%, 48%)"/><stop offset="50%" stop-color="hsl(216, 34%, 28%)"/><stop offset="100%" stop-color="hsl(224, 42%, 14%)"/></linearGradient><linearGradient id="ca-reinforced_body-chest" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(206, 32%, 52%)"/><stop offset="52%" stop-color="hsl(216, 38%, 26%)"/><stop offset="100%" stop-color="hsl(224, 46%, 15%)"/></linearGradient><radialGradient id="ca-reinforced_body-core" cx="46%" cy="44%" r="56%"><stop offset="0%" stop-color="hsl(54, 100%, 98%)"/><stop offset="52%" stop-color="hsl(188, 100%, 72%)"/><stop offset="100%" stop-color="hsl(210, 96%, 44%)"/></radialGradient>`
  ),

  reprogram: wrapArtSvg(
    'reprogram',
    'hsl(338, 52%, 15%)',
    'hsl(232, 50%, 7%)',
    `<rect x="6" y="6" width="116" height="60" rx="3" fill="url(#ca-reprogram-board)" stroke="hsl(346, 54%, 34%)" stroke-width="1"/>
     <path d="M6 20 H26 L36 30 H48 M6 52 H24 L36 42 H48 M18 6 V16 L28 24" fill="none" stroke="hsl(198, 76%, 50%)" stroke-width="1.5" opacity="0.52"/>
     <path d="M122 18 H98 L86 30 H76 M122 54 H98 L86 42 H76 M108 6 V14 L92 26 M108 66 V58 L92 46 M64 6 V22 M64 50 V66" fill="none" stroke="url(#ca-reprogram-hot)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M36 30 L48 30 M36 42 L48 42" stroke="hsl(44, 100%, 76%)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="64" cy="36" r="22" fill="url(#ca-reprogram-glow)"/>
     <polygon points="54,22 74,22 80,28 80,44 74,50 54,50 48,44 48,28" fill="hsl(232, 44%, 12%)" stroke="url(#ca-reprogram-hot)" stroke-width="2"/>
     <rect x="55" y="28" width="18" height="16" rx="1.5" fill="url(#ca-reprogram-chip)" stroke="hsl(48, 100%, 84%)" stroke-width="1.2"/>
     <path d="M60 39 L64 33 L68 39 M60 35 L64 29 L68 35" fill="none" stroke="hsl(54, 100%, 96%)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="26" cy="20" r="2.2" fill="hsl(196, 86%, 62%)"/><circle cx="24" cy="52" r="2.2" fill="hsl(196, 86%, 62%)"/>
     <circle cx="98" cy="18" r="2.5" fill="hsl(48, 100%, 84%)" stroke="hsl(352, 98%, 60%)" stroke-width="1"/>
     <circle cx="98" cy="54" r="2.5" fill="hsl(48, 100%, 84%)" stroke="hsl(352, 98%, 60%)" stroke-width="1"/>
     <circle cx="64" cy="12" r="2.2" fill="hsl(354, 100%, 70%)"/><circle cx="64" cy="60" r="2.2" fill="hsl(46, 100%, 80%)"/>
     <path d="M38 24 L44 28 M38 48 L44 44 M84 22 L90 16" stroke="hsl(52, 100%, 92%)" stroke-width="1.5" stroke-linecap="round"/>`,
    'hsla(14, 98%, 58%, 0.30)',
    `<linearGradient id="ca-reprogram-board" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(226, 42%, 14%)"/><stop offset="56%" stop-color="hsl(268, 38%, 12%)"/><stop offset="100%" stop-color="hsl(344, 48%, 14%)"/></linearGradient><radialGradient id="ca-reprogram-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(44, 100%, 76%)" stop-opacity="0.84"/><stop offset="52%" stop-color="hsl(352, 96%, 54%)" stop-opacity="0.44"/><stop offset="100%" stop-color="hsl(338, 70%, 18%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-reprogram-hot" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(352, 98%, 62%)"/><stop offset="52%" stop-color="hsl(28, 100%, 64%)"/><stop offset="100%" stop-color="hsl(50, 100%, 82%)"/></linearGradient><linearGradient id="ca-reprogram-chip" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(350, 92%, 44%)"/><stop offset="100%" stop-color="hsl(24, 96%, 46%)"/></linearGradient>`
  ),

  skim: wrapArtSvg(
    'skim',
    'hsl(210, 62%, 17%)',
    'hsl(232, 56%, 7%)',
    `<path d="M44 4 L84 4 L122 68 L6 68 Z" fill="url(#ca-skim-cone)" opacity="0.54"/>
     <rect x="12" y="24" width="18" height="27" rx="2" fill="url(#ca-skim-card)" stroke="hsl(194, 88%, 68%)" stroke-width="1.2" transform="rotate(-12 21 37)" opacity="0.72"/>
     <rect x="31" y="20" width="20" height="30" rx="2" fill="url(#ca-skim-card)" stroke="hsl(188, 100%, 82%)" stroke-width="1.4" transform="rotate(-5 41 35)"/>
     <rect x="54" y="18" width="21" height="32" rx="2" fill="url(#ca-skim-card)" stroke="hsl(50, 100%, 86%)" stroke-width="1.6"/>
     <rect x="78" y="20" width="20" height="30" rx="2" fill="url(#ca-skim-card)" stroke="hsl(188, 100%, 82%)" stroke-width="1.4" transform="rotate(5 88 35)"/>
     <rect x="98" y="24" width="18" height="27" rx="2" fill="url(#ca-skim-card)" stroke="hsl(194, 88%, 68%)" stroke-width="1.2" transform="rotate(12 107 37)" opacity="0.72"/>
     <path d="M36 27 H46 M36 33 H44 M59 26 H70 M59 32 H68 M59 40 H66 M83 27 H93 M83 33 H91" stroke="hsl(190, 100%, 86%)" stroke-width="1.2" opacity="0.82"/>
     <path d="M8 38 L120 32" stroke="url(#ca-skim-beam)" stroke-width="4.2" stroke-linecap="round"/>
     <path d="M12 38 L116 32" stroke="hsl(54, 100%, 98%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M51 14 H56 M51 14 V19 M78 14 H73 M78 14 V19 M51 54 H56 M51 54 V49 M78 54 H73 M78 54 V49" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.4" stroke-linecap="round"/>
     <rect x="46" y="4" width="36" height="4.5" rx="2" fill="hsl(216, 44%, 20%)" stroke="hsl(190, 100%, 78%)" stroke-width="1.1"/>
     <circle cx="41" cy="36" r="2" fill="hsl(54, 100%, 96%)"/><circle cx="64" cy="35" r="2.6" fill="hsl(54, 100%, 98%)"/>
     <circle cx="88" cy="34" r="2" fill="hsl(54, 100%, 96%)"/>`,
    'hsla(188, 100%, 62%, 0.30)',
    `<linearGradient id="ca-skim-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(188, 100%, 84%)" stop-opacity="0.78"/><stop offset="68%" stop-color="hsl(196, 100%, 62%)" stop-opacity="0.24"/><stop offset="100%" stop-color="hsl(214, 90%, 36%)" stop-opacity="0"/></linearGradient><linearGradient id="ca-skim-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(196, 94%, 64%)" stop-opacity="0.46"/><stop offset="55%" stop-color="hsl(214, 72%, 26%)" stop-opacity="0.62"/><stop offset="100%" stop-color="hsl(226, 64%, 14%)" stop-opacity="0.78"/></linearGradient><linearGradient id="ca-skim-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(188, 100%, 78%)" stop-opacity="0.15"/><stop offset="28%" stop-color="hsl(188, 100%, 80%)" stop-opacity="0.92"/><stop offset="52%" stop-color="hsl(50, 100%, 90%)" stop-opacity="0.98"/><stop offset="76%" stop-color="hsl(188, 100%, 80%)" stop-opacity="0.92"/><stop offset="100%" stop-color="hsl(188, 100%, 78%)" stop-opacity="0.15"/></linearGradient>`
  ),

  tempest: wrapArtSvg(
    'tempest',
    'hsl(220, 64%, 17%)',
    'hsl(238, 60%, 7%)',
    `<ellipse cx="64" cy="14" rx="64" ry="18" fill="url(#ca-tempest-cloud)"/>
     <path d="M0 18 Q16 26 32 18 Q48 28 66 19 Q86 28 104 18 Q116 24 128 16 L128 0 L0 0 Z" fill="hsl(228, 56%, 12%)" stroke="hsl(202, 92%, 68%)" stroke-width="1.1"/>
     <path d="M12 22 L4 66 M36 22 L28 66 M92 22 L84 66 M118 22 L110 66" stroke="hsl(198, 86%, 72%)" stroke-width="0.7" opacity="0.34"/>
     <path d="M26 16 L18 32 L26 34 L16 54 M66 14 L56 31 L67 34 L52 58 M98 16 L106 30 L96 34 L108 54 M44 20 L49 34 L42 38 L46 50" fill="none" stroke="hsl(194, 100%, 66%)" stroke-width="4.2" stroke-linejoin="round" opacity="0.54"/>
     <path d="M26 16 L18 32 L26 34 L16 54 M66 14 L56 31 L67 34 L52 58 M98 16 L106 30 L96 34 L108 54 M44 20 L49 34 L42 38 L46 50" fill="none" stroke="url(#ca-tempest-bolt)" stroke-width="2" stroke-linejoin="round"/>
     <path d="M66 14 L56 31 L67 34 L52 58" fill="none" stroke="hsl(54, 100%, 98%)" stroke-width="1" stroke-linejoin="round"/>
     <path d="M0 72 L0 56 L12 52 L16 42 L22 54 L36 58 L46 46 L52 38 L58 48 L72 56 L82 44 L88 54 L102 48 L108 40 L114 52 L128 56 L128 72 Z" fill="hsl(232, 54%, 8%)" stroke="hsl(196, 98%, 74%)" stroke-width="1.2" stroke-linejoin="round"/>
     <circle cx="52" cy="56" r="10" fill="url(#ca-tempest-flash)"/>
     <circle cx="16" cy="52" r="7" fill="url(#ca-tempest-flash)"/>
     <circle cx="108" cy="52" r="7" fill="url(#ca-tempest-flash)"/>
     <circle cx="52" cy="56" r="2.6" fill="hsl(54, 100%, 98%)"/><circle cx="108" cy="52" r="2" fill="hsl(54, 100%, 96%)"/>
     <circle cx="16" cy="52" r="2" fill="hsl(54, 100%, 96%)"/>`,
    'hsla(198, 100%, 66%, 0.34)',
    `<radialGradient id="ca-tempest-cloud" cx="50%" cy="30%" r="62%"><stop offset="0%" stop-color="hsl(196, 100%, 82%)" stop-opacity="0.72"/><stop offset="56%" stop-color="hsl(218, 86%, 44%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(234, 70%, 14%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-tempest-bolt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="52%" stop-color="hsl(48, 100%, 74%)"/><stop offset="100%" stop-color="hsl(190, 100%, 82%)"/></linearGradient><radialGradient id="ca-tempest-flash" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 98%)" stop-opacity="0.95"/><stop offset="48%" stop-color="hsl(192, 100%, 72%)" stop-opacity="0.54"/><stop offset="100%" stop-color="hsl(214, 90%, 34%)" stop-opacity="0"/></radialGradient>`
  ),

  white_noise: wrapArtSvg(
    'white_noise',
    'hsl(212, 46%, 15%)',
    'hsl(232, 48%, 6%)',
    `<path d="M0 10 H128 M0 18 H128 M0 26 H128 M0 34 H128 M0 42 H128 M0 50 H128 M0 58 H128 M0 66 H128" stroke="hsl(196, 62%, 72%)" stroke-width="0.6" opacity="0.24"/>
     <rect x="6" y="13" width="28" height="3" fill="hsl(190, 100%, 76%)" opacity="0.34"/>
     <rect x="88" y="19" width="34" height="3.5" fill="hsl(312, 92%, 68%)" opacity="0.36"/>
     <rect x="14" y="49" width="38" height="3" fill="hsl(312, 92%, 68%)" opacity="0.32"/>
     <rect x="82" y="55" width="36" height="3.5" fill="hsl(188, 100%, 76%)" opacity="0.38"/>
     <rect x="18" y="28" width="12" height="2" fill="hsl(54, 100%, 92%)" opacity="0.64"/>
     <rect x="98" y="39" width="16" height="2.2" fill="hsl(54, 100%, 92%)" opacity="0.64"/>
     <path d="M2 36 L12 31 L18 42 L26 24 L33 46 L40 30 L48 39 L80 33 L88 44 L96 22 L104 45 L112 29 L119 40 L126 35" fill="none" stroke="hsl(188, 100%, 78%)" stroke-width="1.8" stroke-linejoin="round" opacity="0.86"/>
     <path d="M4 38 L14 34 L21 44 L28 28 L35 42 L43 33 L85 37 L92 46 L100 26 L108 42 L116 32 L124 38" fill="none" stroke="hsl(312, 96%, 72%)" stroke-width="1.1" stroke-linejoin="round" opacity="0.64"/>
     <circle cx="64" cy="36" r="24" fill="url(#ca-white_noise-aura)"/>
     <polygon points="64,16 80,26 80,46 64,56 48,46 48,26" fill="none" stroke="hsl(314, 96%, 68%)" stroke-width="1.5" opacity="0.58" transform="translate(-2.4,0)"/>
     <polygon points="64,16 80,26 80,46 64,56 48,46 48,26" fill="none" stroke="hsl(186, 100%, 78%)" stroke-width="1.5" opacity="0.68" transform="translate(2.4,0)"/>
     <polygon points="64,16 80,26 80,46 64,56 48,46 48,26" fill="url(#ca-white_noise-sigil)" stroke="hsl(50, 100%, 88%)" stroke-width="1.7"/>
     <circle cx="64" cy="36" r="10" fill="none" stroke="hsl(188, 100%, 92%)" stroke-width="1.2"/>
     <path d="M64 23 L67 33 L77 36 L67 39 L64 49 L61 39 L51 36 L61 33 Z" fill="hsl(54, 100%, 97%)"/>
     <rect x="28" y="16" width="3" height="2" fill="hsl(190, 100%, 92%)"/><rect x="94" y="12" width="3.5" height="2" fill="hsl(52, 100%, 92%)"/>
     <rect x="24" y="58" width="3.5" height="2" fill="hsl(190, 100%, 90%)"/><rect x="104" y="48" width="3" height="2" fill="hsl(312, 100%, 82%)"/>`,
    'hsla(186, 100%, 66%, 0.30)',
    `<radialGradient id="ca-white_noise-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 94%)" stop-opacity="0.9"/><stop offset="48%" stop-color="hsl(188, 100%, 68%)" stop-opacity="0.44"/><stop offset="100%" stop-color="hsl(226, 70%, 16%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-white_noise-sigil" cx="46%" cy="44%" r="58%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)" stop-opacity="0.82"/><stop offset="56%" stop-color="hsl(192, 100%, 58%)" stop-opacity="0.42"/><stop offset="100%" stop-color="hsl(224, 72%, 22%)" stop-opacity="0.68"/></radialGradient>`
  ),
};
