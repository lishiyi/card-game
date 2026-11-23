// Bespoke 16:9 SVG card illustrations for Watcher cards.
import { wrapArtSvg } from './wrap.js';

export const WATCHER_CARD_ART = {
  deus_ex_machina: wrapArtSvg(
    'deus_ex_machina',
    'hsl(262, 56%, 20%)',
    'hsl(284, 50%, 8%)',
    `<path d="M40 0 L88 0 L102 72 L26 72 Z" fill="url(#ca-deus_ex_machina-aura)" opacity="0.55"/>
     <path d="M0 16 Q18 22 30 10 Q42 22 52 14 L52 0 L0 0 Z M76 14 Q86 22 98 10 Q110 22 128 16 L128 0 L76 0 Z" fill="hsl(268, 48%, 12%)" opacity="0.72"/>
     <circle cx="64" cy="36" r="27" fill="none" stroke="hsl(44, 90%, 66%)" stroke-width="1.1" stroke-dasharray="4 3" opacity="0.65"/>
     <path d="M64 12 L68 17 L75 15 L76 21 L83 22 L81 28 L87 32 L83 38 L87 44 L81 48 L83 54 L76 55 L75 61 L68 59 L64 64 L60 59 L53 61 L52 55 L45 54 L47 48 L41 44 L45 38 L41 32 L47 28 L45 22 L52 21 L53 15 L60 17 Z" fill="hsl(274, 54%, 14%)" opacity="0.65" transform="translate(1.5,2)"/>
     <path d="M64 12 L68 17 L75 15 L76 21 L83 22 L81 28 L87 32 L83 38 L87 44 L81 48 L83 54 L76 55 L75 61 L68 59 L64 64 L60 59 L53 61 L52 55 L45 54 L47 48 L41 44 L45 38 L41 32 L47 28 L45 22 L52 21 L53 15 L60 17 Z" fill="none" stroke="url(#ca-deus_ex_machina-gold)" stroke-width="2.4" stroke-linejoin="round"/>
     <circle cx="64" cy="38" r="14" fill="hsl(272, 52%, 18%)" stroke="hsl(46, 96%, 72%)" stroke-width="1.4"/>
     <polygon points="64,20 75,38 64,56 53,38" fill="url(#ca-deus_ex_machina-core)" stroke="hsl(50, 100%, 90%)" stroke-width="1.1"/>
     <polygon points="64,25 69,38 64,45 59,38" fill="hsl(52, 100%, 96%)" opacity="0.82"/>
     <path d="M27 6 V31 M101 6 V31" stroke="hsl(44, 92%, 72%)" stroke-width="1.1" opacity="0.72"/>
     <circle cx="27" cy="40" r="8.5" fill="url(#ca-deus_ex_machina-core)" stroke="hsl(48, 100%, 84%)" stroke-width="1.4"/>
     <circle cx="101" cy="40" r="8.5" fill="url(#ca-deus_ex_machina-core)" stroke="hsl(48, 100%, 84%)" stroke-width="1.4"/>
     <path d="M27 33 L29 38 L34 40 L29 42 L27 47 L25 42 L20 40 L25 38 Z M101 33 L103 38 L108 40 L103 42 L101 47 L99 42 L94 40 L99 38 Z" fill="hsl(54, 100%, 96%)"/>
     <path d="M16 58 Q40 52 64 62 Q88 52 112 58" fill="none" stroke="hsl(46, 96%, 74%)" stroke-width="1.2" opacity="0.6"/>
     <circle cx="42" cy="18" r="1.5" fill="hsl(50, 100%, 92%)"/>
     <circle cx="86" cy="56" r="1.8" fill="hsl(46, 100%, 84%)"/>`,
    'hsla(46, 98%, 62%, 0.28)',
    `<radialGradient id="ca-deus_ex_machina-aura" cx="50%" cy="46%" r="50%"><stop offset="0%" stop-color="hsl(48, 100%, 88%)" stop-opacity="0.85"/><stop offset="48%" stop-color="hsl(44, 96%, 60%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(276, 70%, 30%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-deus_ex_machina-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 86%)"/><stop offset="52%" stop-color="hsl(42, 94%, 60%)"/><stop offset="100%" stop-color="hsl(30, 82%, 38%)"/></linearGradient><radialGradient id="ca-deus_ex_machina-core" cx="42%" cy="36%" r="60%"><stop offset="0%" stop-color="hsl(52, 100%, 96%)"/><stop offset="55%" stop-color="hsl(45, 98%, 70%)"/><stop offset="100%" stop-color="hsl(288, 72%, 52%)"/></radialGradient>`
  ),
  master_reality: wrapArtSvg(
    'master_reality',
    'hsl(276, 58%, 20%)',
    'hsl(232, 54%, 8%)',
    `<path d="M6 20 Q36 8 64 18 T122 14 M6 54 Q38 64 64 52 T122 58" fill="none" stroke="hsl(282, 74%, 56%)" stroke-width="1" opacity="0.45"/>
     <ellipse cx="64" cy="36" rx="50" ry="20" fill="none" stroke="url(#ca-master_reality-ring)" stroke-width="1.4" opacity="0.72" transform="rotate(-14 64 36)"/>
     <ellipse cx="64" cy="36" rx="48" ry="18" fill="none" stroke="hsl(46, 96%, 72%)" stroke-width="1.2" opacity="0.62" transform="rotate(14 64 36)"/>
     <path d="M24 38 Q64 11 104 38 Q64 65 24 38 Z" fill="hsl(252, 62%, 10%)" opacity="0.72"/>
     <path d="M26 36 Q64 10 102 36 Q64 62 26 36 Z" fill="hsl(268, 56%, 18%)" stroke="url(#ca-master_reality-ring)" stroke-width="2"/>
     <circle cx="64" cy="36" r="14.5" fill="url(#ca-master_reality-iris)" stroke="hsl(48, 100%, 86%)" stroke-width="1.3"/>
     <path d="M64 25 L68 36 L64 47 L60 36 Z" fill="hsl(258, 66%, 12%)"/>
     <circle cx="61" cy="32" r="2.6" fill="hsl(52, 100%, 96%)"/>
     <polygon points="18,22 24,14 28,24 22,31" fill="url(#ca-master_reality-shard)" stroke="hsl(50, 100%, 88%)" stroke-width="0.9"/>
     <polygon points="104,48 110,38 116,50 109,59" fill="url(#ca-master_reality-shard)" stroke="hsl(50, 100%, 88%)" stroke-width="0.9"/>
     <polygon points="22,52 27,46 31,55 25,61" fill="hsl(292, 84%, 64%)" stroke="hsl(48, 100%, 84%)" stroke-width="0.9" opacity="0.88"/>
     <path d="M104 14 V22 M100 18 H108 M20 38 V44 M17 41 H23" stroke="hsl(152, 96%, 72%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M40 16 Q64 8 88 16 M40 56 Q64 64 88 56" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.2" opacity="0.7"/>
     <circle cx="96" cy="24" r="1.6" fill="hsl(50, 100%, 94%)"/>
     <circle cx="34" cy="58" r="1.6" fill="hsl(188, 96%, 78%)"/>`,
    'hsla(286, 92%, 62%, 0.28)',
    `<radialGradient id="ca-master_reality-iris" cx="46%" cy="44%" r="55%"><stop offset="0%" stop-color="hsl(50, 100%, 94%)"/><stop offset="38%" stop-color="hsl(44, 98%, 64%)"/><stop offset="78%" stop-color="hsl(292, 86%, 56%)"/><stop offset="100%" stop-color="hsl(264, 72%, 26%)"/></radialGradient><linearGradient id="ca-master_reality-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 84%)"/><stop offset="50%" stop-color="hsl(296, 92%, 72%)"/><stop offset="100%" stop-color="hsl(196, 92%, 72%)"/></linearGradient><linearGradient id="ca-master_reality-shard" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(172, 92%, 78%)"/><stop offset="55%" stop-color="hsl(46, 98%, 68%)"/><stop offset="100%" stop-color="hsl(286, 74%, 44%)"/></linearGradient>`
  ),
  through_violence: wrapArtSvg(
    'through_violence',
    'hsl(308, 64%, 20%)',
    'hsl(344, 58%, 8%)',
    `<path d="M8 62 L52 44 L44 58 L76 40 L118 26" fill="none" stroke="hsl(334, 72%, 44%)" stroke-width="1.3" opacity="0.45"/>
     <path d="M12 64 Q58 46 116 14 L106 34 Q58 56 18 68 Z" fill="url(#ca-through_violence-wake)" opacity="0.62"/>
     <circle cx="102" cy="18" r="22" fill="url(#ca-through_violence-flash)"/>
     <path d="M14 58 L98 14 L112 10 L103 24 L20 65 Z" fill="hsl(332, 64%, 14%)" opacity="0.72" transform="translate(2,3)"/>
     <path d="M12 56 L96 12 L114 9 L101 23 L19 63 Z" fill="url(#ca-through_violence-blade)" stroke="hsl(330, 96%, 68%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M18 57 L106 13" stroke="hsl(54, 100%, 97%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M22 44 L36 62 L30 65 L16 47 Z" fill="hsl(44, 96%, 66%)" stroke="hsl(286, 62%, 28%)" stroke-width="1.2"/>
     <path d="M36 16 Q60 22 86 12 M44 58 Q74 52 108 38" fill="none" stroke="hsl(322, 96%, 72%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="48,22 57,18 54,28 45,27" fill="hsl(282, 48%, 22%)" stroke="hsl(328, 92%, 68%)" stroke-width="1"/>
     <polygon points="78,46 88,43 85,53 75,51" fill="hsl(282, 48%, 22%)" stroke="hsl(44, 98%, 74%)" stroke-width="1"/>
     <polygon points="64,56 71,54 69,62 62,60" fill="hsl(312, 64%, 28%)" stroke="hsl(326, 94%, 72%)" stroke-width="0.9"/>
     <path d="M102 6 L104 15 L114 14 L106 20 L112 29 L102 22 L94 28 L98 18 L90 12 L99 14 Z" fill="hsl(52, 100%, 94%)"/>
     <path d="M28 28 L42 22 M86 58 L104 48" stroke="hsl(46, 100%, 82%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="62" cy="14" r="1.8" fill="hsl(48, 100%, 88%)"/>
     <circle cx="94" cy="38" r="2" fill="hsl(326, 98%, 76%)"/>`,
    'hsla(324, 96%, 58%, 0.30)',
    `<linearGradient id="ca-through_violence-blade" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(318, 94%, 64%)"/><stop offset="48%" stop-color="hsl(44, 100%, 76%)"/><stop offset="100%" stop-color="hsl(54, 100%, 96%)"/></linearGradient><linearGradient id="ca-through_violence-wake" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(344, 88%, 48%)" stop-opacity="0.15"/><stop offset="65%" stop-color="hsl(326, 98%, 62%)" stop-opacity="0.85"/><stop offset="100%" stop-color="hsl(46, 100%, 84%)" stop-opacity="0.95"/></linearGradient><radialGradient id="ca-through_violence-flash" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 97%)"/><stop offset="42%" stop-color="hsl(44, 100%, 68%)" stop-opacity="0.75"/><stop offset="100%" stop-color="hsl(328, 96%, 54%)" stop-opacity="0"/></radialGradient>`
  ),
  eruption: wrapArtSvg(
    'eruption',
    'hsl(342, 74%, 22%)',
    'hsl(312, 62%, 8%)',
    `<ellipse cx="64" cy="54" rx="54" ry="24" fill="url(#ca-eruption-core)"/>
     <path d="M20 56 Q34 20 64 14 Q94 20 108 56" fill="none" stroke="hsl(344, 92%, 58%)" stroke-width="1.5" opacity="0.52"/>
     <path d="M8 62 L28 53 L48 58 L64 52 L82 58 L102 52 L120 62 L124 72 L4 72 Z" fill="url(#ca-eruption-stone)" stroke="hsl(348, 86%, 54%)" stroke-width="1.2"/>
     <path d="M36 58 Q30 34 46 18 Q44 30 56 8 Q66 22 72 6 Q76 26 88 18 Q84 36 92 58 Z" fill="hsl(326, 76%, 18%)" opacity="0.65" transform="translate(2,2)"/>
     <path d="M36 58 Q30 34 46 18 Q44 30 56 8 Q66 22 72 6 Q76 26 88 18 Q84 36 92 58 Z" fill="url(#ca-eruption-plume)" stroke="hsl(44, 100%, 78%)" stroke-width="1.3"/>
     <path d="M48 58 Q46 38 60 22 Q64 32 68 18 Q76 36 78 58 Z" fill="hsl(48, 100%, 84%)" opacity="0.86"/>
     <path d="M56 58 Q58 42 64 32 Q70 42 72 58 Z" fill="hsl(54, 100%, 96%)"/>
     <path d="M18 60 L44 57 L58 64 M110 60 L84 57 L70 64" stroke="hsl(42, 100%, 74%)" stroke-width="1.9" fill="none" stroke-linecap="round"/>
     <path d="M16 42 Q28 32 36 22 M112 42 Q100 32 92 22" stroke="hsl(348, 98%, 68%)" stroke-width="2" fill="none" stroke-linecap="round"/>
     <polygon points="24,44 31,40 29,48" fill="hsl(292, 46%, 24%)" stroke="hsl(36, 98%, 68%)" stroke-width="0.9"/>
     <polygon points="98,42 106,46 97,49" fill="hsl(292, 46%, 24%)" stroke="hsl(36, 98%, 68%)" stroke-width="0.9"/>
     <circle cx="34" cy="14" r="2.1" fill="hsl(46, 100%, 82%)"/>
     <circle cx="96" cy="14" r="2.2" fill="hsl(44, 100%, 80%)"/>
     <circle cx="46" cy="10" r="1.4" fill="hsl(348, 100%, 76%)"/>
     <circle cx="84" cy="28" r="1.6" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(348, 98%, 56%, 0.32)',
    `<linearGradient id="ca-eruption-plume" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="32%" stop-color="hsl(36, 100%, 62%)"/><stop offset="70%" stop-color="hsl(344, 96%, 54%)"/><stop offset="100%" stop-color="hsl(304, 86%, 44%)"/></linearGradient><radialGradient id="ca-eruption-core" cx="50%" cy="76%" r="54%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="45%" stop-color="hsl(18, 98%, 56%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(338, 90%, 40%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-eruption-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(296, 42%, 22%)"/><stop offset="100%" stop-color="hsl(286, 48%, 10%)"/></linearGradient>`
  ),
  vigilance: wrapArtSvg(
    'vigilance',
    'hsl(204, 64%, 20%)',
    'hsl(226, 56%, 9%)',
    `<ellipse cx="64" cy="58" rx="52" ry="10" fill="none" stroke="hsl(194, 92%, 68%)" stroke-width="1.1" opacity="0.42"/>
     <ellipse cx="64" cy="59" rx="34" ry="6.5" fill="none" stroke="hsl(190, 100%, 82%)" stroke-width="1.3" opacity="0.65"/>
     <circle cx="64" cy="37" r="28" fill="url(#ca-vigilance-dome)" stroke="hsl(192, 96%, 78%)" stroke-width="1.6"/>
     <path d="M40 52 Q26 42 32 28 Q42 38 48 48 Z M88 52 Q102 42 96 28 Q86 38 80 48 Z" fill="hsl(218, 62%, 34%)" stroke="hsl(194, 92%, 76%)" stroke-width="1.1"/>
     <path d="M44 53 Q36 32 50 22 Q56 34 58 50 Z M84 53 Q92 32 78 22 Q72 34 70 50 Z" fill="url(#ca-vigilance-lotus)" stroke="hsl(192, 100%, 88%)" stroke-width="1.1"/>
     <path d="M52 54 Q48 30 64 16 Q80 30 76 54 Q64 58 52 54 Z" fill="url(#ca-vigilance-lotus)" stroke="hsl(190, 100%, 94%)" stroke-width="1.4"/>
     <path d="M64 21 Q69 34 64 49 Q59 34 64 21 Z" fill="hsl(50, 100%, 90%)" opacity="0.84"/>
     <circle cx="64" cy="39" r="3.4" fill="hsl(48, 100%, 82%)" stroke="hsl(194, 96%, 86%)" stroke-width="1"/>
     <path d="M22 44 Q18 20 40 11 M106 44 Q110 20 88 11" fill="none" stroke="hsl(42, 86%, 68%)" stroke-width="1.2" stroke-dasharray="2 3" opacity="0.82"/>
     <circle cx="24" cy="36" r="3.4" fill="url(#ca-vigilance-bead)" stroke="hsl(52, 100%, 92%)" stroke-width="0.8"/>
     <circle cx="28" cy="23" r="3.2" fill="url(#ca-vigilance-bead)" stroke="hsl(52, 100%, 92%)" stroke-width="0.8"/>
     <circle cx="38" cy="13" r="3" fill="url(#ca-vigilance-bead)" stroke="hsl(52, 100%, 92%)" stroke-width="0.8"/>
     <circle cx="104" cy="36" r="3.4" fill="url(#ca-vigilance-bead)" stroke="hsl(52, 100%, 92%)" stroke-width="0.8"/>
     <circle cx="100" cy="23" r="3.2" fill="url(#ca-vigilance-bead)" stroke="hsl(52, 100%, 92%)" stroke-width="0.8"/>
     <circle cx="90" cy="13" r="3" fill="url(#ca-vigilance-bead)" stroke="hsl(52, 100%, 92%)" stroke-width="0.8"/>
     <circle cx="64" cy="8" r="2.2" fill="hsl(190, 100%, 92%)"/>`,
    'hsla(192, 94%, 60%, 0.28)',
    `<radialGradient id="ca-vigilance-dome" cx="50%" cy="46%" r="52%"><stop offset="0%" stop-color="hsl(190, 100%, 90%)" stop-opacity="0.34"/><stop offset="68%" stop-color="hsl(198, 92%, 62%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(214, 88%, 54%)" stop-opacity="0.04"/></radialGradient><linearGradient id="ca-vigilance-lotus" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(192, 100%, 95%)"/><stop offset="55%" stop-color="hsl(198, 86%, 72%)"/><stop offset="100%" stop-color="hsl(236, 62%, 44%)"/></linearGradient><linearGradient id="ca-vigilance-bead" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 86%)"/><stop offset="100%" stop-color="hsl(32, 76%, 44%)"/></linearGradient>`
  ),
  blasphemy: wrapArtSvg(
    'blasphemy',
    'hsl(282, 58%, 18%)',
    'hsl(332, 58%, 8%)',
    `<circle cx="64" cy="28" r="34" fill="url(#ca-blasphemy-glow)"/>
     <path d="M64 26 L18 6 M64 26 L110 6 M64 26 L10 34 M64 26 L118 34 M64 26 L26 60 M64 26 L102 60" stroke="hsl(44, 96%, 68%)" stroke-width="1.1" opacity="0.34"/>
     <path d="M28 24 A36 14 0 0 1 60 12 M68 12 A36 14 0 0 1 100 24 M98 28 A36 14 0 0 1 69 37 M59 37 A36 14 0 0 1 30 28" fill="none" stroke="url(#ca-blasphemy-halo)" stroke-width="4.2" stroke-linecap="round"/>
     <path d="M58 10 L63 17 L69 10 M58 39 L64 33 L70 40" stroke="hsl(52, 100%, 92%)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
     <path d="M64 8 L72 28 L69 52 L64 67 L59 52 L56 28 Z" fill="hsl(276, 70%, 8%)" opacity="0.72" transform="translate(2.5,2)"/>
     <path d="M64 8 L71 26 L68 51 L64 66 L60 51 L57 26 Z" fill="url(#ca-blasphemy-blade)" stroke="hsl(312, 88%, 68%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M64 11 L67 28 L64 61 L61 28 Z" fill="hsl(292, 84%, 68%)" opacity="0.52"/>
     <path d="M64 13 V56" stroke="hsl(48, 100%, 88%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M48 25 Q64 32 80 25 L74 30 Q64 35 54 30 Z" fill="url(#ca-blasphemy-halo)" stroke="hsl(280, 60%, 16%)" stroke-width="1"/>
     <path d="M32 58 Q44 42 54 48 Q46 58 42 66 M96 58 Q84 42 74 48 Q82 58 86 66" fill="none" stroke="hsl(324, 92%, 56%)" stroke-width="2" stroke-linecap="round" opacity="0.78"/>
     <polygon points="44,14 50,11 48,18" fill="hsl(46, 100%, 76%)"/>
     <polygon points="82,13 88,16 81,19" fill="hsl(46, 100%, 76%)"/>
     <path d="M64 66 Q67 69 64 71 Q61 69 64 66 Z" fill="hsl(344, 96%, 62%)"/>
     <circle cx="38" cy="36" r="1.7" fill="hsl(48, 100%, 86%)"/>
     <circle cx="90" cy="36" r="1.7" fill="hsl(338, 96%, 68%)"/>`,
    'hsla(44, 98%, 58%, 0.28)',
    `<linearGradient id="ca-blasphemy-halo" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 88%)"/><stop offset="55%" stop-color="hsl(42, 98%, 58%)"/><stop offset="100%" stop-color="hsl(344, 92%, 52%)"/></linearGradient><linearGradient id="ca-blasphemy-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(286, 62%, 52%)"/><stop offset="48%" stop-color="hsl(274, 58%, 22%)"/><stop offset="100%" stop-color="hsl(262, 64%, 10%)"/></linearGradient><radialGradient id="ca-blasphemy-glow" cx="50%" cy="34%" r="48%"><stop offset="0%" stop-color="hsl(46, 100%, 82%)" stop-opacity="0.72"/><stop offset="52%" stop-color="hsl(326, 90%, 48%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(280, 70%, 16%)" stop-opacity="0"/></radialGradient>`
  ),
  deva_form: wrapArtSvg(
    'deva_form',
    'hsl(270, 58%, 22%)',
    'hsl(294, 52%, 9%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-deva_form-mandala)"/>
     <circle cx="64" cy="36" r="26" fill="none" stroke="hsl(48, 98%, 74%)" stroke-width="1.3" stroke-dasharray="3 2.5"/>
     <circle cx="64" cy="36" r="19" fill="none" stroke="hsl(50, 100%, 84%)" stroke-width="1.1" opacity="0.82"/>
     <path d="M64 6 L68 15 L78 9 L76 19 L88 18 L81 26 L93 32 L83 37 L92 46 L81 46 L86 56 L75 53 L75 63 L64 57 L53 63 L53 53 L42 56 L47 46 L36 46 L45 37 L35 32 L47 26 L40 18 L52 19 L50 9 L60 15 Z" fill="none" stroke="hsl(46, 98%, 72%)" stroke-width="1.1" opacity="0.62"/>
     <path d="M56 32 Q38 18 24 22 M72 32 Q90 18 104 22 M55 37 Q34 34 18 40 M73 37 Q94 34 110 40 M56 42 Q38 48 26 56 M72 42 Q90 48 102 56" fill="none" stroke="hsl(288, 86%, 72%)" stroke-width="3" stroke-linecap="round" opacity="0.82"/>
     <path d="M56 32 Q38 18 24 22 M72 32 Q90 18 104 22 M55 37 Q34 34 18 40 M73 37 Q94 34 110 40 M56 42 Q38 48 26 56 M72 42 Q90 48 102 56" fill="none" stroke="hsl(50, 100%, 88%)" stroke-width="1.1" stroke-linecap="round"/>
     <path d="M64 25 Q71 27 72 38 L78 51 Q84 56 76 61 L52 61 Q44 56 50 51 L56 38 Q57 27 64 25 Z" fill="hsl(272, 62%, 14%)" opacity="0.65" transform="translate(1.5,2)"/>
     <path d="M64 25 Q71 27 72 38 L78 51 Q84 56 76 61 L52 61 Q44 56 50 51 L56 38 Q57 27 64 25 Z" fill="url(#ca-deva_form-body)" stroke="hsl(50, 100%, 88%)" stroke-width="1.3"/>
     <circle cx="64" cy="19" r="5.5" fill="url(#ca-deva_form-body)" stroke="hsl(50, 100%, 90%)" stroke-width="1.2"/>
     <path d="M64 16 L66 19 L64 21 L62 19 Z" fill="hsl(54, 100%, 97%)"/>
     <circle cx="24" cy="22" r="4.2" fill="url(#ca-deva_form-orb)"/>
     <circle cx="104" cy="22" r="4.2" fill="url(#ca-deva_form-orb)"/>
     <circle cx="18" cy="40" r="3.6" fill="url(#ca-deva_form-orb)"/>
     <circle cx="110" cy="40" r="3.6" fill="url(#ca-deva_form-orb)"/>
     <circle cx="26" cy="56" r="3.2" fill="url(#ca-deva_form-orb)"/>
     <circle cx="102" cy="56" r="3.2" fill="url(#ca-deva_form-orb)"/>`,
    'hsla(46, 100%, 64%, 0.30)',
    `<radialGradient id="ca-deva_form-mandala" cx="50%" cy="48%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)" stop-opacity="0.88"/><stop offset="52%" stop-color="hsl(44, 98%, 62%)" stop-opacity="0.45"/><stop offset="100%" stop-color="hsl(286, 78%, 44%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-deva_form-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 88%)"/><stop offset="48%" stop-color="hsl(292, 82%, 68%)"/><stop offset="100%" stop-color="hsl(268, 64%, 28%)"/></linearGradient><radialGradient id="ca-deva_form-orb" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="hsl(56, 100%, 97%)"/><stop offset="60%" stop-color="hsl(46, 100%, 66%)"/><stop offset="100%" stop-color="hsl(32, 92%, 48%)"/></radialGradient>`
  ),
  ragnarok: wrapArtSvg(
    'ragnarok',
    'hsl(260, 56%, 19%)',
    'hsl(316, 52%, 8%)',
    `<path d="M0 0 H128 V16 Q112 22 96 15 Q80 23 64 16 Q46 23 30 15 Q16 21 0 15 Z" fill="url(#ca-ragnarok-cloud)"/>
     <path d="M4 60 L24 54 L44 59 L64 53 L84 59 L106 54 L124 61 L128 72 L0 72 Z" fill="hsl(268, 42%, 14%)" stroke="hsl(292, 74%, 56%)" stroke-width="1.1"/>
     <ellipse cx="64" cy="58" rx="46" ry="11" fill="url(#ca-ragnarok-impact)"/>
     <path d="M22 14 L16 32 L24 31 L18 55" fill="none" stroke="hsl(296, 92%, 64%)" stroke-width="4" stroke-linejoin="round" opacity="0.52"/>
     <path d="M22 14 L16 32 L24 31 L18 55" fill="none" stroke="url(#ca-ragnarok-bolt)" stroke-width="2" stroke-linejoin="round"/>
     <path d="M42 12 L36 30 L45 29 L38 56" fill="none" stroke="hsl(296, 92%, 64%)" stroke-width="4.4" stroke-linejoin="round" opacity="0.58"/>
     <path d="M42 12 L36 30 L45 29 L38 56" fill="none" stroke="url(#ca-ragnarok-bolt)" stroke-width="2.2" stroke-linejoin="round"/>
     <path d="M66 10 L56 32 L68 30 L59 58 L71 33 L62 34 L72 10 Z" fill="hsl(298, 92%, 62%)" opacity="0.65" transform="translate(1.5,1)"/>
     <path d="M65 9 L56 31 L67 29 L60 58 L70 32 L62 33 L71 9 Z" fill="url(#ca-ragnarok-bolt)" stroke="hsl(54, 100%, 96%)" stroke-width="0.9"/>
     <path d="M88 12 L82 30 L91 29 L85 56" fill="none" stroke="hsl(296, 92%, 64%)" stroke-width="4.4" stroke-linejoin="round" opacity="0.58"/>
     <path d="M88 12 L82 30 L91 29 L85 56" fill="none" stroke="url(#ca-ragnarok-bolt)" stroke-width="2.2" stroke-linejoin="round"/>
     <path d="M108 14 L103 32 L111 31 L106 55" fill="none" stroke="hsl(296, 92%, 64%)" stroke-width="4" stroke-linejoin="round" opacity="0.52"/>
     <path d="M108 14 L103 32 L111 31 L106 55" fill="none" stroke="url(#ca-ragnarok-bolt)" stroke-width="2" stroke-linejoin="round"/>
     <path d="M48 61 L60 58 L72 64 M28 59 L38 57 L45 63 M80 61 L87 57 L96 63" stroke="hsl(48, 100%, 82%)" stroke-width="1.3" fill="none"/>
     <polygon points="48,48 53,45 51,51" fill="hsl(276, 42%, 26%)" stroke="hsl(46, 98%, 74%)" stroke-width="0.8"/>
     <polygon points="75,46 80,49 74,51" fill="hsl(276, 42%, 26%)" stroke="hsl(46, 98%, 74%)" stroke-width="0.8"/>`,
    'hsla(46, 100%, 62%, 0.28)',
    `<linearGradient id="ca-ragnarok-bolt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="48%" stop-color="hsl(45, 100%, 68%)"/><stop offset="100%" stop-color="hsl(296, 94%, 66%)"/></linearGradient><linearGradient id="ca-ragnarok-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(268, 52%, 10%)"/><stop offset="100%" stop-color="hsl(278, 46%, 24%)"/></linearGradient><radialGradient id="ca-ragnarok-impact" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 95%)"/><stop offset="52%" stop-color="hsl(42, 100%, 62%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(312, 92%, 50%)" stop-opacity="0"/></radialGradient>`
  ),
  vault: wrapArtSvg(
    'vault',
    'hsl(238, 58%, 19%)',
    'hsl(274, 52%, 8%)',
    `<path d="M10 54 Q64 -2 118 54" fill="none" stroke="hsl(46, 96%, 74%)" stroke-width="1.3" stroke-dasharray="4 3" opacity="0.58"/>
     <circle cx="64" cy="42" r="24" fill="none" stroke="hsl(202, 86%, 72%)" stroke-width="0.9" opacity="0.38"/>
     <path d="M40 50 A22 22 0 1 0 88 50 A18 18 0 1 1 40 50 Z" fill="hsl(248, 62%, 10%)" opacity="0.6" transform="translate(1.5,2)"/>
     <path d="M40 50 A22 22 0 1 0 88 50 A18 18 0 1 1 40 50 Z" fill="url(#ca-vault-moon)" stroke="hsl(54, 100%, 96%)" stroke-width="1"/>
     <path d="M55 34 H73 M55 62 H73" stroke="hsl(46, 96%, 72%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M57 35 L71 35 L64 48 L71 61 L57 61 L64 48 Z" fill="url(#ca-vault-glass)" fill-opacity="0.32" stroke="hsl(48, 98%, 76%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M60 39 H68 L64 46 Z M60 59 H68 L64 53 Z" fill="hsl(46, 100%, 74%)"/>
     <path d="M18 46 Q42 18 68 20 Q50 26 26 52 Z" fill="url(#ca-vault-scarf)" opacity="0.88"/>
     <path d="M56 20 Q68 10 82 14 L88 22 L81 24 L75 18 L66 23 L70 30 L63 31 L59 24 L50 28 L47 23 Z" fill="hsl(268, 66%, 12%)" opacity="0.65" transform="translate(1.5,2)"/>
     <path d="M56 20 Q68 10 82 14 L88 22 L81 24 L75 18 L66 23 L70 30 L63 31 L59 24 L50 28 L47 23 Z" fill="hsl(284, 72%, 58%)" stroke="hsl(50, 100%, 90%)" stroke-width="1.1" stroke-linejoin="round"/>
     <circle cx="74" cy="11" r="3.4" fill="hsl(50, 100%, 90%)" stroke="hsl(286, 76%, 46%)" stroke-width="0.9"/>
     <path d="M88 18 Q102 22 110 34" fill="none" stroke="hsl(50, 100%, 88%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="22" cy="16" r="1.6" fill="hsl(50, 100%, 92%)"/>
     <circle cx="106" cy="14" r="1.8" fill="hsl(194, 96%, 82%)"/>
     <circle cx="64" cy="49.5" r="1.2" fill="hsl(52, 100%, 94%)"/>`,
    'hsla(48, 96%, 68%, 0.26)',
    `<linearGradient id="ca-vault-moon" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 94%)"/><stop offset="55%" stop-color="hsl(44, 96%, 72%)"/><stop offset="100%" stop-color="hsl(198, 86%, 68%)"/></linearGradient><linearGradient id="ca-vault-scarf" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(286, 86%, 56%)" stop-opacity="0.3"/><stop offset="55%" stop-color="hsl(312, 92%, 64%)"/><stop offset="100%" stop-color="hsl(48, 100%, 84%)"/></linearGradient><linearGradient id="ca-vault-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(46, 100%, 82%)"/><stop offset="50%" stop-color="hsl(204, 88%, 74%)"/><stop offset="100%" stop-color="hsl(44, 96%, 62%)"/></linearGradient>`
  ),
  judgment: wrapArtSvg(
    'judgment',
    'hsl(278, 56%, 19%)',
    'hsl(246, 54%, 8%)',
    `<path d="M22 68 V24 A42 20 0 0 1 106 24 V68" fill="none" stroke="hsl(276, 52%, 44%)" stroke-width="1.4" opacity="0.45"/>
     <circle cx="32" cy="42" r="20" fill="url(#ca-judgment-aura)"/>
     <path d="M48 64 H80 L74 59 H54 Z M64 14 V60" fill="url(#ca-judgment-gold)" stroke="url(#ca-judgment-gold)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M26 30 L102 18" stroke="url(#ca-judgment-gold)" stroke-width="3" stroke-linecap="round"/>
     <circle cx="64" cy="24" r="5" fill="hsl(274, 58%, 16%)" stroke="hsl(50, 100%, 86%)" stroke-width="1.5"/>
     <path d="M56 11 Q64 5 72 11 Q64 17 56 11 Z" fill="hsl(50, 100%, 88%)" stroke="hsl(286, 72%, 48%)" stroke-width="0.9"/>
     <path d="M28 31 L20 50 M28 31 L44 50 M100 19 L90 38 M100 19 L112 38" stroke="hsl(44, 92%, 72%)" stroke-width="1.2"/>
     <path d="M16 50 Q32 58 48 50 Z" fill="url(#ca-judgment-gold)" stroke="hsl(50, 100%, 88%)" stroke-width="1.1"/>
     <path d="M86 38 Q101 45 116 38 Z" fill="url(#ca-judgment-gold)" stroke="hsl(50, 100%, 88%)" stroke-width="1.1"/>
     <path d="M22 50 Q18 35 28 24 Q30 32 35 18 Q42 32 42 50 Z" fill="url(#ca-judgment-flame)" stroke="hsl(50, 100%, 88%)" stroke-width="1"/>
     <path d="M27 50 Q28 39 33 31 Q37 39 37 50 Z" fill="hsl(54, 100%, 95%)" opacity="0.88"/>
     <path d="M96 36 Q101 26 106 36 Q101 38 96 36 Z" fill="hsl(194, 92%, 80%)" opacity="0.72"/>
     <circle cx="24" cy="20" r="1.8" fill="hsl(312, 98%, 76%)"/>
     <circle cx="42" cy="22" r="1.5" fill="hsl(48, 100%, 86%)"/>
     <circle cx="101" cy="27" r="1.5" fill="hsl(194, 100%, 88%)"/>`,
    'hsla(294, 92%, 60%, 0.28)',
    `<linearGradient id="ca-judgment-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 88%)"/><stop offset="52%" stop-color="hsl(42, 94%, 58%)"/><stop offset="100%" stop-color="hsl(30, 80%, 34%)"/></linearGradient><linearGradient id="ca-judgment-flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="42%" stop-color="hsl(312, 96%, 64%)"/><stop offset="100%" stop-color="hsl(276, 88%, 48%)"/></linearGradient><radialGradient id="ca-judgment-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(308, 96%, 66%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(276, 70%, 24%)" stop-opacity="0"/></radialGradient>`
  ),
  lesson_learned: wrapArtSvg(
    'lesson_learned',
    'hsl(284, 50%, 20%)',
    'hsl(28, 54%, 10%)',
    `<circle cx="66" cy="34" r="30" fill="url(#ca-lesson_learned-glow)"/>
     <circle cx="64" cy="36" r="24" fill="none" stroke="hsl(44, 92%, 68%)" stroke-width="1.1" stroke-dasharray="3 3" opacity="0.58"/>
     <path d="M36 52 L54 44 L48 64 L32 60 Z M78 46 L96 52 L92 64 L74 60 Z" fill="hsl(276, 42%, 22%)" stroke="hsl(38, 86%, 62%)" stroke-width="1.2"/>
     <path d="M40 20 Q64 12 88 20 L84 52 Q64 46 44 52 Z" fill="hsl(274, 52%, 12%)" opacity="0.62" transform="translate(2,2)"/>
     <path d="M40 20 Q64 12 88 20 L84 52 Q64 46 44 52 Z" fill="url(#ca-lesson_learned-scroll)" stroke="hsl(36, 82%, 46%)" stroke-width="1.4"/>
     <rect x="37" y="17" width="4" height="36" rx="2" fill="hsl(32, 74%, 44%)" stroke="hsl(48, 100%, 82%)" stroke-width="0.8"/>
     <rect x="85" y="17" width="4" height="36" rx="2" fill="hsl(32, 74%, 44%)" stroke="hsl(48, 100%, 82%)" stroke-width="0.8"/>
     <path d="M16 58 Q56 38 110 12 L106 19 Q58 44 20 62 Z" fill="url(#ca-lesson_learned-slash)" stroke="hsl(52, 100%, 94%)" stroke-width="0.9"/>
     <path d="M64 23 V41 M55 32 H73" stroke="hsl(148, 92%, 52%)" stroke-width="4.4" stroke-linecap="round"/>
     <path d="M64 23 V41 M55 32 H73" stroke="hsl(52, 100%, 92%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M24 22 V30 M20 26 H28 M102 40 V48 M98 44 H106" stroke="hsl(150, 96%, 68%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M52 56 L64 64 L76 56" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="96" cy="22" r="2.2" fill="hsl(50, 100%, 90%)"/>
     <circle cx="30" cy="42" r="1.8" fill="hsl(44, 100%, 78%)"/>`,
    'hsla(44, 98%, 60%, 0.28)',
    `<linearGradient id="ca-lesson_learned-scroll" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 84%, 92%)"/><stop offset="65%" stop-color="hsl(42, 72%, 74%)"/><stop offset="100%" stop-color="hsl(32, 62%, 52%)"/></linearGradient><linearGradient id="ca-lesson_learned-slash" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(312, 92%, 62%)"/><stop offset="52%" stop-color="hsl(46, 100%, 76%)"/><stop offset="100%" stop-color="hsl(54, 100%, 96%)"/></linearGradient><radialGradient id="ca-lesson_learned-glow" cx="50%" cy="44%" r="48%"><stop offset="0%" stop-color="hsl(48, 100%, 88%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(36, 92%, 44%)" stop-opacity="0"/></radialGradient>`
  ),
  alpha: wrapArtSvg(
    'alpha',
    'hsl(234, 58%, 20%)',
    'hsl(262, 54%, 9%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-alpha-core)"/>
     <polygon points="64,7 92,55 36,55" fill="none" stroke="hsl(196, 92%, 72%)" stroke-width="1" opacity="0.42"/>
     <circle cx="64" cy="36" r="26" fill="none" stroke="url(#ca-alpha-ring)" stroke-width="2"/>
     <circle cx="64" cy="36" r="21.5" fill="none" stroke="hsl(48, 98%, 80%)" stroke-width="0.9" stroke-dasharray="2 3" opacity="0.65"/>
     <path d="M64 15 L81 55 H73.5 L69.5 45 H58.5 L54.5 55 H47 Z M60.8 39 H67.2 L64 29 Z" fill="hsl(248, 62%, 10%)" opacity="0.7" transform="translate(2,2.5)"/>
     <path d="M64 15 L81 55 H73.5 L69.5 45 H58.5 L54.5 55 H47 Z M60.8 39 H67.2 L64 29 Z" fill="url(#ca-alpha-rune)" stroke="hsl(54, 100%, 94%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M64 18 L74 44" stroke="hsl(56, 100%, 98%)" stroke-width="1.2" opacity="0.72"/>
     <path d="M18 36 H34 M94 36 H110" stroke="hsl(194, 96%, 78%)" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>
     <polygon points="64,4 66,8 64,12 62,8" fill="hsl(52, 100%, 94%)"/>
     <polygon points="64,60 66,64 64,68 62,64" fill="hsl(194, 98%, 84%)"/>
     <polygon points="24,20 26,23 24,26 22,23" fill="hsl(48, 100%, 88%)"/>
     <polygon points="104,48 106,51 104,54 102,51" fill="hsl(48, 100%, 88%)"/>
     <circle cx="32" cy="54" r="1.6" fill="hsl(194, 100%, 86%)"/>
     <circle cx="96" cy="18" r="1.6" fill="hsl(50, 100%, 90%)"/>`,
    'hsla(198, 94%, 64%, 0.26)',
    `<linearGradient id="ca-alpha-rune" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="52%" stop-color="hsl(46, 98%, 70%)"/><stop offset="100%" stop-color="hsl(34, 86%, 46%)"/></linearGradient><linearGradient id="ca-alpha-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(192, 100%, 84%)"/><stop offset="100%" stop-color="hsl(46, 98%, 72%)"/></linearGradient><radialGradient id="ca-alpha-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(196, 100%, 84%)" stop-opacity="0.45"/><stop offset="100%" stop-color="hsl(248, 70%, 24%)" stop-opacity="0"/></radialGradient>`
  ),
  beta: wrapArtSvg(
    'beta',
    'hsl(274, 60%, 22%)',
    'hsl(242, 56%, 9%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-beta-core)"/>
     <ellipse cx="64" cy="36" rx="44" ry="22" fill="none" stroke="url(#ca-beta-ring)" stroke-width="1.8" transform="rotate(-18 64 36)"/>
     <ellipse cx="64" cy="36" rx="44" ry="22" fill="none" stroke="hsl(46, 98%, 74%)" stroke-width="1.6" opacity="0.82" transform="rotate(18 64 36)"/>
     <circle cx="64" cy="36" r="24" fill="none" stroke="hsl(296, 92%, 74%)" stroke-width="1.1" stroke-dasharray="4 2.5"/>
     <path d="M51 15 H68 Q78 15 78 24 Q78 32 70 35 Q81 37 81 46 Q81 56 69 56 H51 Z M58 21 V32 H66 Q71 32 71 26.5 Q71 21 66 21 Z M58 38 V50 H67.5 Q73.5 50 73.5 44 Q73.5 38 67.5 38 Z" fill="hsl(264, 68%, 10%)" opacity="0.72" transform="translate(2,2.5)"/>
     <path d="M51 15 H68 Q78 15 78 24 Q78 32 70 35 Q81 37 81 46 Q81 56 69 56 H51 Z M58 21 V32 H66 Q71 32 71 26.5 Q71 21 66 21 Z M58 38 V50 H67.5 Q73.5 50 73.5 44 Q73.5 38 67.5 38 Z" fill="url(#ca-beta-rune)" stroke="hsl(54, 100%, 94%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M54 18 V53" stroke="hsl(56, 100%, 97%)" stroke-width="1.4" opacity="0.78"/>
     <path d="M16 36 L28 32 L24 40 L34 36 M94 36 L104 32 L100 40 L112 36" fill="none" stroke="hsl(298, 96%, 76%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="24" cy="22" r="2.8" fill="hsl(48, 100%, 84%)" stroke="hsl(294, 86%, 60%)" stroke-width="1"/>
     <circle cx="104" cy="50" r="2.8" fill="hsl(48, 100%, 84%)" stroke="hsl(294, 86%, 60%)" stroke-width="1"/>
     <circle cx="104" cy="22" r="2.6" fill="hsl(296, 96%, 76%)"/>
     <circle cx="24" cy="50" r="2.6" fill="hsl(296, 96%, 76%)"/>
     <polygon points="64,5 67,10 64,14 61,10" fill="hsl(52, 100%, 94%)"/>
     <polygon points="64,58 67,62 64,67 61,62" fill="hsl(52, 100%, 94%)"/>`,
    'hsla(294, 96%, 62%, 0.28)',
    `<linearGradient id="ca-beta-rune" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="48%" stop-color="hsl(44, 100%, 68%)"/><stop offset="100%" stop-color="hsl(312, 88%, 56%)"/></linearGradient><linearGradient id="ca-beta-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 84%)"/><stop offset="50%" stop-color="hsl(296, 94%, 68%)"/><stop offset="100%" stop-color="hsl(42, 98%, 62%)"/></linearGradient><radialGradient id="ca-beta-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(304, 96%, 68%)" stop-opacity="0.62"/><stop offset="65%" stop-color="hsl(276, 86%, 46%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(252, 70%, 16%)" stop-opacity="0"/></radialGradient>`
  ),
  omega: wrapArtSvg(
    'omega',
    'hsl(296, 66%, 22%)',
    'hsl(338, 60%, 9%)',
    `<ellipse cx="64" cy="36" rx="58" ry="34" fill="url(#ca-omega-corona)"/>
     <path d="M64 36 L6 6 M64 36 L122 6 M64 36 L4 36 M64 36 L124 36 M64 36 L8 66 M64 36 L120 66 M64 36 L42 2 M64 36 L86 2" stroke="hsl(48, 100%, 78%)" stroke-width="1.3" opacity="0.45"/>
     <ellipse cx="64" cy="36" rx="54" ry="26" fill="none" stroke="url(#ca-omega-ring)" stroke-width="1.6" transform="rotate(-10 64 36)"/>
     <ellipse cx="64" cy="36" rx="54" ry="26" fill="none" stroke="hsl(46, 100%, 76%)" stroke-width="1.4" opacity="0.78" transform="rotate(10 64 36)"/>
     <circle cx="64" cy="36" r="29" fill="none" stroke="hsl(50, 100%, 86%)" stroke-width="2" stroke-dasharray="6 2.5"/>
     <path d="M40 52 H52 Q42 44 42 32 A22 21 0 1 1 86 32 Q86 44 76 52 H88 V59 H69 V50 Q78 44 78 32 A14 13.5 0 1 0 50 32 Q50 44 59 50 V59 H40 Z" fill="hsl(316, 70%, 12%)" opacity="0.78" transform="translate(2,2.5)"/>
     <path d="M40 52 H52 Q42 44 42 32 A22 21 0 1 1 86 32 Q86 44 76 52 H88 V59 H69 V50 Q78 44 78 32 A14 13.5 0 1 0 50 32 Q50 44 59 50 V59 H40 Z" fill="url(#ca-omega-rune)" stroke="hsl(56, 100%, 96%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M48 31 A16 15.5 0 0 1 80 31" fill="none" stroke="hsl(56, 100%, 98%)" stroke-width="1.6" opacity="0.88"/>
     <polygon points="64,3 67,10 64,14 61,10" fill="hsl(54, 100%, 96%)"/>
     <polygon points="14,36 21,33 25,36 21,39" fill="hsl(52, 100%, 90%)"/>
     <polygon points="114,36 107,33 103,36 107,39" fill="hsl(52, 100%, 90%)"/>
     <circle cx="24" cy="18" r="2.6" fill="hsl(48, 100%, 86%)"/>
     <circle cx="104" cy="18" r="2.6" fill="hsl(48, 100%, 86%)"/>
     <circle cx="28" cy="58" r="2.2" fill="hsl(328, 98%, 72%)"/>
     <circle cx="100" cy="58" r="2.2" fill="hsl(328, 98%, 72%)"/>`,
    'hsla(46, 100%, 64%, 0.34)',
    `<linearGradient id="ca-omega-rune" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="42%" stop-color="hsl(46, 100%, 70%)"/><stop offset="100%" stop-color="hsl(24, 98%, 54%)"/></linearGradient><radialGradient id="ca-omega-corona" cx="50%" cy="48%" r="54%"><stop offset="0%" stop-color="hsl(54, 100%, 94%)" stop-opacity="0.92"/><stop offset="42%" stop-color="hsl(42, 100%, 60%)" stop-opacity="0.52"/><stop offset="76%" stop-color="hsl(326, 94%, 52%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(288, 70%, 16%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-omega-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="50%" stop-color="hsl(324, 96%, 68%)"/><stop offset="100%" stop-color="hsl(44, 100%, 64%)"/></linearGradient>`
  ),
  mental_fortress: wrapArtSvg(
    'mental_fortress',
    'hsl(248, 54%, 20%)',
    'hsl(214, 56%, 9%)',
    `<path d="M8 58 Q28 48 48 56 Q64 46 80 56 Q100 48 120 58" fill="none" stroke="hsl(202, 84%, 68%)" stroke-width="1.3" opacity="0.45"/>
     <polygon points="64,5 104,22 104,52 64,67 24,52 24,22" fill="url(#ca-mental_fortress-shield)" stroke="hsl(192, 98%, 78%)" stroke-width="1.8"/>
     <polygon points="64,10 98,25 98,49 64,62 30,49 30,25" fill="none" stroke="hsl(288, 88%, 74%)" stroke-width="1" stroke-dasharray="4 3" opacity="0.72"/>
     <path d="M38 50 L64 62 L90 50 L82 47 H46 Z" fill="hsl(256, 48%, 18%)" stroke="hsl(196, 86%, 70%)" stroke-width="1.1"/>
     <rect x="47" y="36" width="34" height="12" fill="url(#ca-mental_fortress-temple)" stroke="hsl(286, 72%, 68%)" stroke-width="1"/>
     <path d="M38 37 Q50 34 64 28 Q78 34 90 37 L84 40 H44 Z" fill="url(#ca-mental_fortress-roof)" stroke="hsl(52, 100%, 92%)" stroke-width="0.9"/>
     <rect x="53" y="24" width="22" height="9" fill="url(#ca-mental_fortress-temple)" stroke="hsl(286, 72%, 68%)" stroke-width="1"/>
     <path d="M45 25 Q54 22 64 14 Q74 22 83 25 L77 27 H51 Z" fill="url(#ca-mental_fortress-roof)" stroke="hsl(52, 100%, 92%)" stroke-width="0.9"/>
     <path d="M64 10 V15" stroke="hsl(50, 100%, 90%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M60 48 V41 A4 4 0 0 1 68 41 V48 Z" fill="hsl(48, 100%, 84%)"/>
     <path d="M24 22 L38 30 M104 22 L90 30 M24 52 L40 48 M104 52 L88 48" stroke="hsl(192, 98%, 80%)" stroke-width="1" opacity="0.58"/>
     <circle cx="24" cy="22" r="2.4" fill="hsl(192, 100%, 88%)"/>
     <circle cx="104" cy="22" r="2.4" fill="hsl(192, 100%, 88%)"/>
     <circle cx="64" cy="5" r="2.6" fill="hsl(50, 100%, 90%)"/>
     <circle cx="64" cy="67" r="2.4" fill="hsl(192, 100%, 88%)"/>`,
    'hsla(194, 92%, 62%, 0.28)',
    `<radialGradient id="ca-mental_fortress-shield" cx="50%" cy="46%" r="52%"><stop offset="0%" stop-color="hsl(194, 100%, 88%)" stop-opacity="0.28"/><stop offset="72%" stop-color="hsl(206, 92%, 62%)" stop-opacity="0.18"/><stop offset="100%" stop-color="hsl(278, 86%, 62%)" stop-opacity="0.34"/></radialGradient><linearGradient id="ca-mental_fortress-temple" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(282, 62%, 58%)"/><stop offset="100%" stop-color="hsl(258, 56%, 22%)"/></linearGradient><linearGradient id="ca-mental_fortress-roof" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 84%)"/><stop offset="100%" stop-color="hsl(34, 84%, 44%)"/></linearGradient>`
  ),
  miracle: wrapArtSvg(
    'miracle',
    'hsl(274, 48%, 22%)',
    'hsl(38, 62%, 11%)',
    `<path d="M44 0 L84 0 L106 72 L22 72 Z" fill="url(#ca-miracle-halo)" opacity="0.6"/>
     <path d="M0 24 Q18 16 32 24 Q42 18 48 26 L0 32 Z M128 24 Q110 16 96 24 Q86 18 80 26 L128 32 Z" fill="hsl(276, 48%, 28%)" opacity="0.58"/>
     <circle cx="64" cy="36" r="28" fill="url(#ca-miracle-halo)"/>
     <circle cx="64" cy="36" r="24" fill="none" stroke="hsl(50, 100%, 84%)" stroke-width="1.2" opacity="0.72"/>
     <circle cx="64" cy="36" r="17" fill="none" stroke="hsl(52, 100%, 90%)" stroke-width="1.1" stroke-dasharray="3 2.5"/>
     <path d="M42 52 Q52 44 64 56 Q76 44 86 52 Q74 62 64 62 Q54 62 42 52 Z" fill="url(#ca-miracle-petal)" stroke="hsl(52, 100%, 92%)" stroke-width="1.1"/>
     <path d="M64 11 L71 29 L89 36 L71 43 L64 61 L57 43 L39 36 L57 29 Z" fill="hsl(34, 80%, 24%)" opacity="0.55" transform="translate(1.5,2)"/>
     <path d="M64 11 L71 29 L89 36 L71 43 L64 61 L57 43 L39 36 L57 29 Z" fill="url(#ca-miracle-star)" stroke="hsl(56, 100%, 98%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M64 20 L68 32 L80 36 L68 40 L64 52 L60 40 L48 36 L60 32 Z" fill="hsl(56, 100%, 98%)" opacity="0.88"/>
     <path d="M22 46 Q34 40 42 46 M106 46 Q94 40 86 46" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.4" stroke-linecap="round"/>
     <polygon points="30,18 32,23 37,25 32,27 30,32 28,27 23,25 28,23" fill="hsl(52, 100%, 92%)"/>
     <polygon points="98,18 100,23 105,25 100,27 98,32 96,27 91,25 96,23" fill="hsl(52, 100%, 92%)"/>
     <circle cx="38" cy="56" r="1.9" fill="hsl(48, 100%, 86%)"/>
     <circle cx="90" cy="56" r="1.9" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(48, 100%, 66%, 0.34)',
    `<radialGradient id="ca-miracle-star" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="46%" stop-color="hsl(48, 100%, 74%)"/><stop offset="100%" stop-color="hsl(36, 94%, 48%)"/></radialGradient><radialGradient id="ca-miracle-halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)" stop-opacity="0.88"/><stop offset="55%" stop-color="hsl(44, 100%, 62%)" stop-opacity="0.36"/><stop offset="100%" stop-color="hsl(282, 70%, 30%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-miracle-petal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 94%)"/><stop offset="100%" stop-color="hsl(288, 68%, 62%)"/></linearGradient>`
  ),
  brilliance: wrapArtSvg(
    'brilliance',
    'hsl(42, 68%, 22%)',
    'hsl(282, 56%, 10%)',
    `<circle cx="42" cy="36" r="34" fill="url(#ca-brilliance-core)"/>
     <path d="M42 36 L6 8 M42 36 L14 66 M42 36 L34 4 M42 36 L44 68 M42 36 L72 6 M42 36 L74 66" stroke="hsl(48, 100%, 80%)" stroke-width="1.3" opacity="0.48"/>
     <polygon points="42,22 122,10 122,28 42,36" fill="hsl(192, 96%, 72%)" opacity="0.34"/>
     <polygon points="42,36 122,44 122,62 42,50" fill="hsl(316, 94%, 64%)" opacity="0.38"/>
     <polygon points="38,24 124,26 124,46 38,48" fill="url(#ca-brilliance-beam)"/>
     <polygon points="42,31 124,33 124,39 42,41" fill="hsl(56, 100%, 98%)" opacity="0.92"/>
     <circle cx="42" cy="36" r="19" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.4" stroke-dasharray="4 3"/>
     <polygon points="42,14 58,36 42,58 26,36" fill="hsl(282, 60%, 16%)" opacity="0.6" transform="translate(2,2)"/>
     <polygon points="42,14 58,36 42,58 26,36" fill="url(#ca-brilliance-prism)" stroke="hsl(56, 100%, 98%)" stroke-width="1.5" stroke-linejoin="round"/>
     <polygon points="42,22 50,36 42,50 34,36" fill="hsl(56, 100%, 98%)"/>
     <path d="M14 36 H26 M84 22 L106 16 M84 50 L106 56" stroke="hsl(52, 100%, 92%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="88" cy="36" r="3" fill="hsl(56, 100%, 98%)"/>
     <circle cx="106" cy="24" r="2" fill="hsl(190, 100%, 88%)"/>
     <circle cx="104" cy="50" r="2.2" fill="hsl(322, 98%, 76%)"/>`,
    'hsla(48, 100%, 68%, 0.34)',
    `<radialGradient id="ca-brilliance-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="44%" stop-color="hsl(46, 100%, 68%)"/><stop offset="100%" stop-color="hsl(292, 86%, 54%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-brilliance-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(54, 100%, 97%)"/><stop offset="55%" stop-color="hsl(46, 100%, 72%)"/><stop offset="100%" stop-color="hsl(312, 96%, 68%)" stop-opacity="0.2"/></linearGradient><linearGradient id="ca-brilliance-prism" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(192, 100%, 90%)"/><stop offset="50%" stop-color="hsl(50, 100%, 86%)"/><stop offset="100%" stop-color="hsl(316, 92%, 68%)"/></linearGradient>`
  ),
  devotion: wrapArtSvg(
    'devotion',
    'hsl(268, 52%, 19%)',
    'hsl(36, 54%, 9%)',
    `<path d="M44 0 L84 0 L98 72 L30 72 Z" fill="url(#ca-devotion-beam)"/>
     <path d="M12 68 V18 A52 24 0 0 1 116 18 V68" fill="none" stroke="hsl(278, 46%, 38%)" stroke-width="1.6" opacity="0.5"/>
     <rect x="8" y="61" width="112" height="11" fill="hsl(266, 44%, 13%)" stroke="hsl(40, 74%, 52%)" stroke-width="1"/>
     <circle cx="64" cy="21" r="14" fill="url(#ca-devotion-mantra)"/>
     <circle cx="64" cy="21" r="10.5" fill="none" stroke="hsl(50, 100%, 88%)" stroke-width="1.5"/>
     <polygon points="64,13 68,21 64,29 60,21" fill="hsl(54, 100%, 96%)"/>
     <path d="M42 61 Q44 46 54 41 Q64 38 72 44 L76 54 Q78 60 72 61 Z" fill="hsl(264, 60%, 9%)" opacity="0.65" transform="translate(2,1)"/>
     <path d="M41 61 Q43 45 54 40 Q64 37 71 44 L74 54 Q76 60 70 61 Z" fill="url(#ca-devotion-robe)" stroke="hsl(48, 96%, 76%)" stroke-width="1.3"/>
     <circle cx="58" cy="34" r="5.2" fill="url(#ca-devotion-robe)" stroke="hsl(50, 100%, 86%)" stroke-width="1.2"/>
     <path d="M64 44 L71 41 L69 48 Z" fill="hsl(48, 96%, 80%)"/>
     <path d="M88 61 L92 52 H104 L108 61 Z" fill="hsl(36, 72%, 44%)" stroke="hsl(48, 98%, 76%)" stroke-width="1.1"/>
     <path d="M98 51 Q92 40 100 30 Q106 20 96 10" fill="none" stroke="hsl(48, 94%, 84%)" stroke-width="1.6" stroke-linecap="round" opacity="0.72"/>
     <path d="M26 54 Q20 42 28 32 Q34 22 26 12" fill="none" stroke="hsl(288, 84%, 76%)" stroke-width="1.3" stroke-linecap="round" opacity="0.58"/>
     <circle cx="48" cy="18" r="1.7" fill="hsl(50, 100%, 90%)"/>
     <circle cx="80" cy="24" r="1.9" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(44, 98%, 62%, 0.28)',
    `<linearGradient id="ca-devotion-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 90%)" stop-opacity="0.72"/><stop offset="68%" stop-color="hsl(42, 96%, 60%)" stop-opacity="0.22"/><stop offset="100%" stop-color="hsl(36, 90%, 44%)" stop-opacity="0"/></linearGradient><linearGradient id="ca-devotion-robe" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(284, 62%, 44%)"/><stop offset="100%" stop-color="hsl(258, 56%, 14%)"/></linearGradient><radialGradient id="ca-devotion-mantra" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="52%" stop-color="hsl(45, 100%, 66%)"/><stop offset="100%" stop-color="hsl(36, 92%, 46%)" stop-opacity="0"/></radialGradient>`
  ),
  establishment: wrapArtSvg(
    'establishment',
    'hsl(246, 46%, 20%)',
    'hsl(272, 48%, 9%)',
    `<circle cx="64" cy="24" r="28" fill="url(#ca-establishment-glow)"/>
     <path d="M18 58 A46 46 0 0 1 110 58" fill="none" stroke="hsl(46, 92%, 72%)" stroke-width="1" stroke-dasharray="3 3" opacity="0.52"/>
     <rect x="14" y="58" width="100" height="9" rx="1.5" fill="url(#ca-establishment-stone)" stroke="hsl(44, 84%, 62%)" stroke-width="1.2"/>
     <rect x="24" y="51" width="80" height="7" rx="1" fill="url(#ca-establishment-stone)" stroke="hsl(278, 62%, 62%)" stroke-width="1.1"/>
     <rect x="30" y="26" width="14" height="25" fill="url(#ca-establishment-stone)" stroke="hsl(282, 62%, 64%)" stroke-width="1.1"/>
     <rect x="84" y="26" width="14" height="25" fill="url(#ca-establishment-stone)" stroke="hsl(282, 62%, 64%)" stroke-width="1.1"/>
     <path d="M26 26 H48 L45 21 H29 Z M80 26 H102 L99 21 H83 Z" fill="url(#ca-establishment-gold)" stroke="hsl(52, 100%, 90%)" stroke-width="0.9"/>
     <path d="M36 22 Q48 16 55 18 L52 27 Q44 25 36 26 Z M92 22 Q80 16 73 18 L76 27 Q84 25 92 26 Z" fill="url(#ca-establishment-stone)" stroke="hsl(46, 92%, 70%)" stroke-width="1.1"/>
     <polygon points="56,10 72,10 68,28 60,28" fill="hsl(268, 60%, 10%)" opacity="0.65" transform="translate(1.5,2)"/>
     <polygon points="56,10 72,10 68,28 60,28" fill="url(#ca-establishment-gold)" stroke="hsl(54, 100%, 96%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M64 31 V46 M58 40 L64 46 L70 40" fill="none" stroke="hsl(50, 100%, 86%)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M37 29 V48 M91 29 V48" stroke="hsl(46, 92%, 76%)" stroke-width="1" opacity="0.65"/>
     <polygon points="20,38 23,34 26,38 23,42" fill="hsl(48, 100%, 84%)"/>
     <polygon points="102,38 105,34 108,38 105,42" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(44, 94%, 60%, 0.26)',
    `<linearGradient id="ca-establishment-stone" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(266, 36%, 44%)"/><stop offset="100%" stop-color="hsl(252, 46%, 16%)"/></linearGradient><linearGradient id="ca-establishment-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="55%" stop-color="hsl(44, 96%, 62%)"/><stop offset="100%" stop-color="hsl(30, 82%, 38%)"/></linearGradient><radialGradient id="ca-establishment-glow" cx="50%" cy="32%" r="48%"><stop offset="0%" stop-color="hsl(48, 100%, 86%)" stop-opacity="0.74"/><stop offset="100%" stop-color="hsl(272, 70%, 24%)" stop-opacity="0"/></radialGradient>`
  ),
  scrawl: wrapArtSvg(
    'scrawl',
    'hsl(266, 48%, 19%)',
    'hsl(240, 52%, 8%)',
    `<path d="M12 16 Q38 8 64 14 M74 62 Q98 66 118 54" fill="none" stroke="hsl(286, 76%, 64%)" stroke-width="1.2" opacity="0.46"/>
     <path d="M14 54 Q36 42 58 48 Q84 54 108 32 L98 14 Q74 32 48 28 Q26 24 8 36 Z" fill="hsl(254, 58%, 10%)" opacity="0.68" transform="translate(2,3)"/>
     <path d="M14 54 Q36 42 58 48 Q84 54 108 32 L98 14 Q74 32 48 28 Q26 24 8 36 Z" fill="url(#ca-scrawl-scroll)" stroke="hsl(36, 72%, 46%)" stroke-width="1.4"/>
     <path d="M8 34 L16 56" stroke="hsl(34, 76%, 46%)" stroke-width="5" stroke-linecap="round"/>
     <path d="M97 13 L109 34" stroke="hsl(34, 76%, 46%)" stroke-width="5" stroke-linecap="round"/>
     <path d="M22 44 Q32 30 42 42 Q50 50 58 34 Q68 24 76 40 Q82 44 88 32" fill="none" stroke="url(#ca-scrawl-ink)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M24 44 Q34 32 42 41 Q50 48 58 35 Q67 26 76 39" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="1.1" stroke-linecap="round"/>
     <path d="M74 36 L114 8 L119 14 L80 42 Z" fill="url(#ca-scrawl-brush)" stroke="hsl(48, 96%, 80%)" stroke-width="1"/>
     <path d="M74 36 L81 42 L68 46 Q70 39 74 36 Z" fill="hsl(278, 72%, 18%)" stroke="hsl(46, 100%, 78%)" stroke-width="0.9"/>
     <path d="M68 46 Q62 49 58 46" fill="none" stroke="hsl(48, 100%, 88%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="62" cy="56" r="2.4" fill="hsl(292, 92%, 64%)"/>
     <circle cx="52" cy="59" r="1.5" fill="hsl(48, 100%, 84%)"/>
     <circle cx="84" cy="54" r="2" fill="hsl(288, 90%, 66%)"/>
     <circle cx="34" cy="18" r="1.8" fill="hsl(46, 100%, 84%)"/>
     <path d="M18 18 L24 22 M92 52 L98 48" stroke="hsl(48, 100%, 86%)" stroke-width="1.4" stroke-linecap="round"/>`,
    'hsla(46, 94%, 66%, 0.26)',
    `<linearGradient id="ca-scrawl-scroll" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(46, 78%, 92%)"/><stop offset="60%" stop-color="hsl(40, 62%, 76%)"/><stop offset="100%" stop-color="hsl(32, 52%, 56%)"/></linearGradient><linearGradient id="ca-scrawl-brush" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 82%)"/><stop offset="45%" stop-color="hsl(342, 72%, 44%)"/><stop offset="100%" stop-color="hsl(276, 62%, 22%)"/></linearGradient><linearGradient id="ca-scrawl-ink" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(276, 76%, 22%)"/><stop offset="62%" stop-color="hsl(292, 90%, 56%)"/><stop offset="100%" stop-color="hsl(48, 100%, 82%)"/></linearGradient>`
  ),
  spirit_shield: wrapArtSvg(
    'spirit_shield',
    'hsl(216, 62%, 20%)',
    'hsl(264, 54%, 9%)',
    `<circle cx="64" cy="36" r="31" fill="none" stroke="hsl(194, 92%, 70%)" stroke-width="1.1" opacity="0.45"/>
     <ellipse cx="64" cy="38" rx="46" ry="20" fill="none" stroke="hsl(282, 82%, 68%)" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.58"/>
     <rect x="14" y="24" width="13" height="19" rx="2" fill="url(#ca-spirit_shield-card)" stroke="hsl(192, 100%, 90%)" stroke-width="1.1" transform="rotate(-16 20 33)" opacity="0.86"/>
     <rect x="24" y="14" width="13" height="19" rx="2" fill="url(#ca-spirit_shield-card)" stroke="hsl(50, 100%, 88%)" stroke-width="1.1" transform="rotate(-8 30 23)" opacity="0.92"/>
     <rect x="91" y="14" width="13" height="19" rx="2" fill="url(#ca-spirit_shield-card)" stroke="hsl(50, 100%, 88%)" stroke-width="1.1" transform="rotate(8 97 23)" opacity="0.92"/>
     <rect x="101" y="24" width="13" height="19" rx="2" fill="url(#ca-spirit_shield-card)" stroke="hsl(192, 100%, 90%)" stroke-width="1.1" transform="rotate(16 107 33)" opacity="0.86"/>
     <path d="M64 11 L86 20 V38 Q86 55 64 65 Q42 55 42 38 V20 Z" fill="hsl(232, 64%, 10%)" opacity="0.68" transform="translate(2,2)"/>
     <path d="M64 11 L86 20 V38 Q86 55 64 65 Q42 55 42 38 V20 Z" fill="url(#ca-spirit_shield-aegis)" stroke="url(#ca-spirit_shield-rim)" stroke-width="2.2" stroke-linejoin="round"/>
     <path d="M64 18 L79 24 V37 Q79 49 64 57 Q49 49 49 37 V24 Z" fill="none" stroke="hsl(190, 100%, 94%)" stroke-width="1.2" opacity="0.85"/>
     <polygon points="64,25 71,36 64,47 57,36" fill="hsl(54, 100%, 94%)" stroke="hsl(194, 96%, 72%)" stroke-width="1"/>
     <path d="M24 52 Q36 58 46 56 M104 52 Q92 58 82 56" fill="none" stroke="hsl(192, 98%, 80%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="34" cy="50" r="2" fill="hsl(190, 100%, 90%)"/>
     <circle cx="94" cy="50" r="2" fill="hsl(190, 100%, 90%)"/>
     <circle cx="64" cy="6" r="1.8" fill="hsl(50, 100%, 92%)"/>`,
    'hsla(192, 96%, 62%, 0.28)',
    `<radialGradient id="ca-spirit_shield-aegis" cx="50%" cy="44%" r="54%"><stop offset="0%" stop-color="hsl(190, 100%, 94%)" stop-opacity="0.88"/><stop offset="52%" stop-color="hsl(198, 92%, 58%)" stop-opacity="0.58"/><stop offset="100%" stop-color="hsl(274, 78%, 44%)" stop-opacity="0.32"/></radialGradient><linearGradient id="ca-spirit_shield-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(192, 100%, 86%)"/><stop offset="100%" stop-color="hsl(278, 74%, 52%)"/></linearGradient><linearGradient id="ca-spirit_shield-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="100%" stop-color="hsl(192, 98%, 74%)"/></linearGradient>`
  ),
  smite: wrapArtSvg(
    'smite',
    'hsl(42, 66%, 22%)',
    'hsl(282, 56%, 10%)',
    `<rect x="44" y="0" width="40" height="72" fill="url(#ca-smite-beam)"/>
     <ellipse cx="64" cy="60" rx="44" ry="11" fill="url(#ca-smite-impact)"/>
     <ellipse cx="64" cy="60" rx="34" ry="7" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.6"/>
     <path d="M58 22 H70 L68 50 L64 62 L60 50 Z" fill="hsl(282, 62%, 14%)" opacity="0.65" transform="translate(2,2)"/>
     <path d="M58 22 H70 L68 50 L64 62 L60 50 Z" fill="url(#ca-smite-blade)" stroke="hsl(52, 100%, 94%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M64 24 V58" stroke="hsl(56, 100%, 99%)" stroke-width="1.6"/>
     <path d="M40 16 Q52 24 64 23 Q76 24 88 16 L80 26 Q64 29 48 26 Z" fill="hsl(44, 98%, 64%)" stroke="hsl(54, 100%, 94%)" stroke-width="1.2"/>
     <rect x="61.5" y="7" width="5" height="14" rx="2" fill="hsl(286, 62%, 34%)" stroke="hsl(48, 100%, 84%)" stroke-width="1.1"/>
     <circle cx="64" cy="7" r="3.4" fill="hsl(50, 100%, 86%)" stroke="hsl(34, 88%, 48%)" stroke-width="1"/>
     <path d="M26 56 L42 46 M102 56 L86 46 M32 36 L44 40 M96 36 L84 40" stroke="hsl(48, 100%, 84%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M18 62 L38 58 M110 62 L90 58" stroke="hsl(312, 94%, 70%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="48,54 52,48 54,56" fill="hsl(52, 100%, 92%)"/>
     <polygon points="80,54 76,48 74,56" fill="hsl(52, 100%, 92%)"/>
     <circle cx="34" cy="18" r="1.8" fill="hsl(50, 100%, 90%)"/>
     <circle cx="94" cy="18" r="1.8" fill="hsl(50, 100%, 90%)"/>`,
    'hsla(48, 100%, 66%, 0.34)',
    `<linearGradient id="ca-smite-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 96%)" stop-opacity="0.82"/><stop offset="65%" stop-color="hsl(44, 100%, 64%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(312, 92%, 56%)" stop-opacity="0.1"/></linearGradient><linearGradient id="ca-smite-blade" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(44, 100%, 72%)"/><stop offset="50%" stop-color="hsl(56, 100%, 98%)"/><stop offset="100%" stop-color="hsl(36, 94%, 56%)"/></linearGradient><radialGradient id="ca-smite-impact" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="48%" stop-color="hsl(46, 100%, 68%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(296, 88%, 50%)" stop-opacity="0"/></radialGradient>`
  ),
  safety: wrapArtSvg(
    'safety',
    'hsl(198, 58%, 20%)',
    'hsl(232, 52%, 9%)',
    `<path d="M12 62 A52 48 0 0 1 116 62 Z" fill="url(#ca-safety-dome)" stroke="hsl(192, 98%, 80%)" stroke-width="1.8"/>
     <path d="M22 62 A42 38 0 0 1 106 62" fill="none" stroke="hsl(48, 98%, 82%)" stroke-width="1.1" stroke-dasharray="4 3" opacity="0.72"/>
     <path d="M8 62 H120" stroke="hsl(194, 90%, 74%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M64 20 L84 28 V42 Q84 55 64 61 Q44 55 44 42 V28 Z" fill="hsl(224, 62%, 10%)" opacity="0.6" transform="translate(2,2)"/>
     <path d="M64 20 L84 28 V42 Q84 55 64 61 Q44 55 44 42 V28 Z" fill="url(#ca-safety-shield)" stroke="hsl(48, 98%, 78%)" stroke-width="2" stroke-linejoin="round"/>
     <circle cx="64" cy="40" r="14" fill="url(#ca-safety-lantern)"/>
     <path d="M64 29 Q70 36 68 46 Q64 49 60 46 Q58 36 64 29 Z" fill="hsl(52, 100%, 92%)" stroke="hsl(42, 96%, 64%)" stroke-width="1"/>
     <path d="M54 44 Q58 36 62 46 M74 44 Q70 36 66 46" fill="none" stroke="hsl(190, 100%, 90%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M18 46 Q26 38 34 44 M110 46 Q102 38 94 44" fill="none" stroke="hsl(194, 96%, 80%)" stroke-width="1.3" stroke-linecap="round" opacity="0.76"/>
     <polygon points="64,9 66,13 70,15 66,17 64,21 62,17 58,15 62,13" fill="hsl(52, 100%, 94%)"/>
     <circle cx="28" cy="24" r="1.8" fill="hsl(190, 100%, 90%)"/>
     <circle cx="100" cy="24" r="1.8" fill="hsl(190, 100%, 90%)"/>
     <circle cx="36" cy="54" r="1.6" fill="hsl(48, 100%, 86%)"/>
     <circle cx="92" cy="54" r="1.6" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(194, 94%, 64%, 0.28)',
    `<radialGradient id="ca-safety-dome" cx="50%" cy="62%" r="54%"><stop offset="0%" stop-color="hsl(50, 100%, 90%)" stop-opacity="0.46"/><stop offset="58%" stop-color="hsl(192, 96%, 68%)" stop-opacity="0.26"/><stop offset="100%" stop-color="hsl(214, 86%, 54%)" stop-opacity="0.06"/></radialGradient><linearGradient id="ca-safety-shield" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(194, 92%, 78%)"/><stop offset="56%" stop-color="hsl(208, 72%, 44%)"/><stop offset="100%" stop-color="hsl(228, 62%, 22%)"/></linearGradient><radialGradient id="ca-safety-lantern" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="58%" stop-color="hsl(44, 100%, 68%)"/><stop offset="100%" stop-color="hsl(36, 94%, 46%)" stop-opacity="0"/></radialGradient>`
  ),
  insight: wrapArtSvg(
    'insight',
    'hsl(228, 60%, 20%)',
    'hsl(268, 54%, 9%)',
    `<path d="M16 14 L32 22 L24 38 M112 14 L96 22 L104 38" fill="none" stroke="hsl(194, 92%, 76%)" stroke-width="1" opacity="0.48"/>
     <path d="M46 28 L82 28 L98 62 L30 62 Z" fill="url(#ca-insight-ray)"/>
     <circle cx="64" cy="26" r="22" fill="none" stroke="hsl(48, 96%, 78%)" stroke-width="1.1" stroke-dasharray="3 3" opacity="0.65"/>
     <path d="M28 27 Q64 6 100 27 Q64 48 28 27 Z" fill="hsl(248, 62%, 10%)" opacity="0.65" transform="translate(1.5,2)"/>
     <path d="M28 26 Q64 6 100 26 Q64 46 28 26 Z" fill="hsl(236, 56%, 18%)" stroke="hsl(192, 98%, 82%)" stroke-width="1.8"/>
     <circle cx="64" cy="26" r="11.5" fill="url(#ca-insight-iris)" stroke="hsl(50, 100%, 88%)" stroke-width="1.2"/>
     <circle cx="64" cy="26" r="4.2" fill="hsl(252, 68%, 12%)"/>
     <circle cx="61.5" cy="23.5" r="2.2" fill="hsl(54, 100%, 98%)"/>
     <path d="M32 54 Q48 48 64 56 Q80 48 96 54 L100 64 Q80 58 64 65 Q48 58 28 64 Z" fill="url(#ca-insight-book)" stroke="hsl(44, 92%, 68%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M64 56 V65 M38 56 Q50 53 60 58 M90 56 Q78 53 68 58" fill="none" stroke="hsl(228, 56%, 44%)" stroke-width="1.1"/>
     <circle cx="16" cy="14" r="2" fill="hsl(50, 100%, 92%)"/>
     <circle cx="32" cy="22" r="1.5" fill="hsl(192, 100%, 88%)"/>
     <circle cx="112" cy="14" r="2" fill="hsl(50, 100%, 92%)"/>
     <circle cx="96" cy="22" r="1.5" fill="hsl(192, 100%, 88%)"/>`,
    'hsla(192, 96%, 66%, 0.28)',
    `<radialGradient id="ca-insight-iris" cx="46%" cy="44%" r="54%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="38%" stop-color="hsl(190, 100%, 74%)"/><stop offset="78%" stop-color="hsl(226, 86%, 48%)"/><stop offset="100%" stop-color="hsl(264, 72%, 22%)"/></radialGradient><linearGradient id="ca-insight-book" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(50, 88%, 94%)"/><stop offset="100%" stop-color="hsl(204, 62%, 72%)"/></linearGradient><linearGradient id="ca-insight-ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(190, 100%, 88%)" stop-opacity="0.58"/><stop offset="100%" stop-color="hsl(48, 100%, 78%)" stop-opacity="0"/></linearGradient>`
  ),
  bowling_bash: wrapArtSvg(
    'bowling_bash',
    'hsl(284, 56%, 20%)',
    'hsl(18, 54%, 9%)',
    `<path d="M6 60 L122 52 L124 68 L4 68 Z" fill="hsl(274, 42%, 12%)" opacity="0.65"/>
     <path d="M8 42 L60 32 L60 52 L8 54 Z" fill="url(#ca-bowling_bash-trail)"/>
     <path d="M12 26 H44 M8 36 H36 M14 54 H48" stroke="hsl(46, 100%, 80%)" stroke-width="1.5" stroke-linecap="round" opacity="0.72"/>
     <circle cx="52" cy="42" r="14" fill="hsl(276, 62%, 10%)" opacity="0.6" transform="translate(2,2.5)"/>
     <circle cx="52" cy="42" r="13.5" fill="url(#ca-bowling_bash-orb)" stroke="hsl(52, 100%, 92%)" stroke-width="1.5"/>
     <path d="M44 36 Q52 30 60 36 M43 45 Q52 51 61 45" fill="none" stroke="hsl(282, 68%, 28%)" stroke-width="1.5"/>
     <path d="M74 26 L82 22 L87 46 L76 48 Z" fill="url(#ca-bowling_bash-pin)" stroke="hsl(46, 96%, 76%)" stroke-width="1.2" transform="rotate(16 80 35)"/>
     <path d="M90 18 L99 15 L103 40 L92 42 Z" fill="url(#ca-bowling_bash-pin)" stroke="hsl(312, 92%, 72%)" stroke-width="1.2" transform="rotate(32 96 28)"/>
     <path d="M102 36 L112 34 L115 58 L104 60 Z" fill="url(#ca-bowling_bash-pin)" stroke="hsl(46, 96%, 76%)" stroke-width="1.2" transform="rotate(44 108 47)"/>
     <path d="M66 36 L72 28 L73 37 L82 36 L74 42 L80 50 L71 45 L67 53 L68 43 L60 40 Z" fill="hsl(52, 100%, 94%)"/>
     <path d="M76 14 Q92 10 108 20 M84 56 Q98 62 114 58" fill="none" stroke="hsl(42, 100%, 74%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="88" cy="14" r="2" fill="hsl(48, 100%, 88%)"/>
     <circle cx="116" cy="28" r="1.8" fill="hsl(324, 96%, 72%)"/>
     <circle cx="72" cy="58" r="1.8" fill="hsl(44, 100%, 78%)"/>`,
    'hsla(38, 96%, 58%, 0.28)',
    `<radialGradient id="ca-bowling_bash-orb" cx="38%" cy="35%" r="60%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="46%" stop-color="hsl(42, 98%, 62%)"/><stop offset="100%" stop-color="hsl(288, 74%, 36%)"/></radialGradient><linearGradient id="ca-bowling_bash-trail" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(312, 92%, 58%)" stop-opacity="0.1"/><stop offset="62%" stop-color="hsl(40, 100%, 62%)" stop-opacity="0.78"/><stop offset="100%" stop-color="hsl(52, 100%, 90%)" stop-opacity="0.95"/></linearGradient><linearGradient id="ca-bowling_bash-pin" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(280, 44%, 52%)"/><stop offset="100%" stop-color="hsl(262, 52%, 18%)"/></linearGradient>`
  ),
  consecrate: wrapArtSvg(
    'consecrate',
    'hsl(276, 48%, 20%)',
    'hsl(32, 56%, 10%)',
    `<ellipse cx="64" cy="40" rx="54" ry="26" fill="url(#ca-consecrate-halo)"/>
     <path d="M16 62 Q64 52 112 62 L120 72 H8 Z" fill="hsl(272, 42%, 13%)" stroke="hsl(42, 82%, 56%)" stroke-width="1"/>
     <path d="M10 38 Q64 62 118 38 Q64 50 10 38 Z" fill="hsl(324, 72%, 22%)" opacity="0.58" transform="translate(0,4)"/>
     <path d="M8 34 Q64 62 120 34 Q64 47 8 34 Z" fill="url(#ca-consecrate-wave)" stroke="hsl(54, 100%, 94%)" stroke-width="1.3"/>
     <path d="M18 36 Q64 52 110 36" fill="none" stroke="hsl(56, 100%, 98%)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="64" cy="24" r="11" fill="none" stroke="url(#ca-consecrate-gold)" stroke-width="2.8"/>
     <rect x="62.5" y="34.5" width="3" height="28" rx="1.5" fill="url(#ca-consecrate-gold)"/>
     <circle cx="64" cy="24" r="4.5" fill="hsl(54, 100%, 96%)"/>
     <path d="M51 24 H55 M73 24 H77 M64 11 V15" stroke="hsl(52, 100%, 92%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M22 24 Q28 16 36 22 M106 24 Q100 16 92 22" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.5" stroke-linecap="round"/>
     <polygon points="30,44 33,38 36,44 33,47" fill="hsl(50, 100%, 90%)"/>
     <polygon points="98,44 95,38 92,44 95,47" fill="hsl(50, 100%, 90%)"/>
     <circle cx="46" cy="54" r="2" fill="hsl(46, 100%, 82%)"/>
     <circle cx="82" cy="54" r="2" fill="hsl(46, 100%, 82%)"/>`,
    'hsla(44, 98%, 62%, 0.30)',
    `<linearGradient id="ca-consecrate-wave" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(324, 92%, 62%)" stop-opacity="0.35"/><stop offset="32%" stop-color="hsl(44, 100%, 68%)"/><stop offset="50%" stop-color="hsl(56, 100%, 96%)"/><stop offset="68%" stop-color="hsl(44, 100%, 68%)"/><stop offset="100%" stop-color="hsl(324, 92%, 62%)" stop-opacity="0.35"/></linearGradient><radialGradient id="ca-consecrate-halo" cx="50%" cy="54%" r="52%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)" stop-opacity="0.82"/><stop offset="58%" stop-color="hsl(42, 98%, 58%)" stop-opacity="0.32"/><stop offset="100%" stop-color="hsl(278, 66%, 20%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-consecrate-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 88%)"/><stop offset="100%" stop-color="hsl(30, 82%, 40%)"/></linearGradient>`
  ),
  crush_joints: wrapArtSvg(
    'crush_joints',
    'hsl(318, 56%, 20%)',
    'hsl(268, 54%, 9%)',
    `<circle cx="64" cy="38" r="26" fill="url(#ca-crush_joints-impact)"/>
     <circle cx="64" cy="38" r="22" fill="none" stroke="hsl(344, 94%, 66%)" stroke-width="1.3" stroke-dasharray="5 3" opacity="0.65"/>
     <path d="M84 10 L70 30 Q62 34 68 41 L82 36 L98 16 Z" fill="url(#ca-crush_joints-bone)" stroke="hsl(272, 46%, 22%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M62 42 L74 44 L88 64 L74 66 L60 50 Z" fill="url(#ca-crush_joints-bone)" stroke="hsl(272, 46%, 22%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M64 31 L70 38 L64 45 L75 39" fill="none" stroke="hsl(348, 100%, 62%)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M12 24 L48 34 L58 38 L46 46 L10 38 Z" fill="hsl(280, 62%, 12%)" opacity="0.6" transform="translate(2,2)"/>
     <path d="M12 24 L46 33 L58 38 L45 45 L10 37 Z" fill="url(#ca-crush_joints-fist)" stroke="hsl(52, 100%, 92%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M44 33 L54 37 L44 43" fill="none" stroke="hsl(54, 100%, 96%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M62 24 L65 33 L74 30 L68 38 L78 44 L67 43 L65 53 L60 44 L52 47 L58 38 L52 30 L60 34 Z" fill="hsl(52, 100%, 94%)"/>
     <polygon points="88,36 96,32 94,40" fill="url(#ca-crush_joints-bone)" stroke="hsl(348, 96%, 68%)" stroke-width="0.9"/>
     <polygon points="94,48 103,49 97,55" fill="url(#ca-crush_joints-bone)" stroke="hsl(44, 98%, 74%)" stroke-width="0.9"/>
     <polygon points="52,55 58,52 56,60" fill="url(#ca-crush_joints-bone)" stroke="hsl(348, 96%, 68%)" stroke-width="0.9"/>
     <path d="M100 22 L114 16 M102 58 L116 64" stroke="hsl(46, 100%, 82%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="48" cy="18" r="1.9" fill="hsl(344, 98%, 74%)"/>`,
    'hsla(336, 94%, 58%, 0.28)',
    `<linearGradient id="ca-crush_joints-bone" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(46, 56%, 92%)"/><stop offset="55%" stop-color="hsl(276, 26%, 68%)"/><stop offset="100%" stop-color="hsl(264, 34%, 38%)"/></linearGradient><radialGradient id="ca-crush_joints-impact" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="46%" stop-color="hsl(344, 98%, 60%)" stop-opacity="0.82"/><stop offset="100%" stop-color="hsl(296, 86%, 40%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-crush_joints-fist" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 86%)"/><stop offset="55%" stop-color="hsl(318, 92%, 62%)"/><stop offset="100%" stop-color="hsl(278, 72%, 34%)"/></linearGradient>`
  ),
  cut_through_fate: wrapArtSvg(
    'cut_through_fate',
    'hsl(260, 58%, 20%)',
    'hsl(226, 56%, 8%)',
    `<path d="M10 18 Q36 22 50 32 M74 44 Q96 52 118 46 M14 34 Q30 38 42 42 M82 28 Q100 22 116 14" fill="none" stroke="url(#ca-cut_through_fate-thread)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M22 10 Q42 20 52 28 M76 48 Q90 58 106 66" fill="none" stroke="hsl(46, 98%, 74%)" stroke-width="1.2" opacity="0.72"/>
     <path d="M30 33 Q60 12 90 25 L48 45 Q38 42 30 33 Z" fill="hsl(252, 58%, 18%)" stroke="hsl(194, 96%, 78%)" stroke-width="1.6"/>
     <path d="M40 49 L96 27 Q98 37 94 42 Q66 58 40 49 Z" fill="hsl(252, 58%, 18%)" stroke="hsl(292, 88%, 72%)" stroke-width="1.6"/>
     <path d="M51 31 A12 12 0 0 1 73 28 L55 37 Z" fill="url(#ca-cut_through_fate-eye)"/>
     <path d="M57 42 L77 33 A12 12 0 0 1 57 42 Z" fill="url(#ca-cut_through_fate-eye)"/>
     <path d="M12 60 L108 11 L118 9 L111 19 L18 65 Z" fill="hsl(242, 68%, 10%)" opacity="0.65" transform="translate(2,2.5)"/>
     <path d="M12 59 L106 11 L118 8 L110 18 L17 64 Z" fill="url(#ca-cut_through_fate-slash)" stroke="hsl(54, 100%, 96%)" stroke-width="1.1" stroke-linejoin="round"/>
     <path d="M18 59 L111 12" stroke="hsl(56, 100%, 99%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M52 34 L46 28 M78 40 L84 46" stroke="hsl(48, 100%, 88%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="108,12 112,5 113,12 120,13 113,16 112,23 108,16 101,15" fill="hsl(56, 100%, 98%)"/>
     <circle cx="34" cy="58" r="2" fill="hsl(192, 100%, 88%)"/>
     <circle cx="88" cy="14" r="1.8" fill="hsl(48, 100%, 88%)"/>
     <circle cx="24" cy="24" r="1.5" fill="hsl(294, 96%, 76%)"/>`,
    'hsla(194, 96%, 66%, 0.28)',
    `<linearGradient id="ca-cut_through_fate-slash" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(192, 100%, 80%)"/><stop offset="52%" stop-color="hsl(54, 100%, 96%)"/><stop offset="100%" stop-color="hsl(46, 100%, 72%)"/></linearGradient><radialGradient id="ca-cut_through_fate-eye" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="48%" stop-color="hsl(194, 96%, 66%)"/><stop offset="100%" stop-color="hsl(278, 76%, 34%)"/></radialGradient><linearGradient id="ca-cut_through_fate-thread" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 84%)"/><stop offset="100%" stop-color="hsl(292, 88%, 66%)"/></linearGradient>`
  ),
  empty_fist: wrapArtSvg(
    'empty_fist',
    'hsl(236, 36%, 22%)',
    'hsl(258, 42%, 9%)',
    `<circle cx="76" cy="36" r="29" fill="url(#ca-empty_fist-void)"/>
     <path d="M52 16 A26 26 0 1 1 56 58" fill="none" stroke="url(#ca-empty_fist-enso)" stroke-width="3.2" stroke-linecap="round" opacity="0.78"/>
     <circle cx="78" cy="36" r="18" fill="none" stroke="hsl(210, 62%, 86%)" stroke-width="1.3" stroke-dasharray="5 3" opacity="0.68"/>
     <path d="M12 28 H44 L54 22 H68 Q76 22 76 30 V42 Q76 50 66 50 H52 L42 46 H12 Z" fill="hsl(252, 48%, 10%)" opacity="0.6" transform="translate(2,2.5)"/>
     <path d="M10 28 H44 L54 22 H68 Q76 22 76 30 V42 Q76 50 66 50 H52 L42 46 H10 Z" fill="url(#ca-empty_fist-fist)" stroke="hsl(48, 70%, 96%)" stroke-width="1.5" stroke-linejoin="round"/>
     <path d="M58 24 V34 M64 24 V35 M70 25 V35 M54 38 H72" stroke="hsl(252, 38%, 36%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M78 24 Q88 36 78 48 M86 18 Q98 36 86 54 M94 24 Q104 36 94 48" fill="none" stroke="hsl(50, 72%, 96%)" stroke-width="1.8" stroke-linecap="round" opacity="0.86"/>
     <path d="M10 22 Q26 16 38 20 M10 52 Q26 58 38 54" fill="none" stroke="hsl(334, 62%, 70%)" stroke-width="1.3" opacity="0.48"/>
     <path d="M102 18 Q112 24 116 34 M102 54 Q112 48 116 38" fill="none" stroke="hsl(198, 72%, 78%)" stroke-width="1.3" opacity="0.54"/>
     <circle cx="88" cy="14" r="1.8" fill="hsl(52, 80%, 96%)"/>
     <circle cx="108" cy="36" r="2.2" fill="hsl(52, 80%, 96%)"/>
     <circle cx="88" cy="58" r="1.8" fill="hsl(200, 86%, 86%)"/>`,
    'hsla(210, 48%, 82%, 0.24)',
    `<linearGradient id="ca-empty_fist-fist" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 46%, 96%)"/><stop offset="56%" stop-color="hsl(226, 36%, 74%)"/><stop offset="100%" stop-color="hsl(258, 36%, 40%)"/></linearGradient><radialGradient id="ca-empty_fist-void" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 60%, 96%)" stop-opacity="0.72"/><stop offset="56%" stop-color="hsl(206, 62%, 78%)" stop-opacity="0.24"/><stop offset="100%" stop-color="hsl(252, 48%, 22%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-empty_fist-enso" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 60%, 94%)"/><stop offset="100%" stop-color="hsl(204, 62%, 74%)"/></linearGradient>`
  ),
  flurry_of_blows: wrapArtSvg(
    'flurry_of_blows',
    'hsl(278, 58%, 20%)',
    'hsl(228, 54%, 9%)',
    `<circle cx="96" cy="36" r="24" fill="url(#ca-flurry_of_blows-burst)"/>
     <path d="M8 18 Q44 12 84 22 L76 28 Q42 20 8 24 Z" fill="url(#ca-flurry_of_blows-calm)"/>
     <path d="M12 52 Q48 58 88 46 L82 40 Q48 48 12 46 Z" fill="url(#ca-flurry_of_blows-wrath)"/>
     <path d="M10 34 Q54 28 102 36 L94 42 Q52 38 10 40 Z" fill="url(#ca-flurry_of_blows-wrath)" opacity="0.9"/>
     <path d="M22 24 L62 16 L70 22 L30 30 Z" fill="hsl(194, 96%, 76%)" opacity="0.56"/>
     <path d="M26 48 L68 56 L76 48 L34 42 Z" fill="hsl(326, 94%, 66%)" opacity="0.58"/>
     <ellipse cx="78" cy="20" rx="10" ry="6" fill="hsl(192, 100%, 88%)" stroke="hsl(52, 100%, 94%)" stroke-width="1.2" transform="rotate(-10 78 20)"/>
     <ellipse cx="82" cy="52" rx="10" ry="6" fill="hsl(334, 96%, 70%)" stroke="hsl(52, 100%, 94%)" stroke-width="1.2" transform="rotate(10 82 52)"/>
     <path d="M74 29 H96 Q104 29 104 36 Q104 43 96 43 H74 Z" fill="hsl(48, 100%, 84%)" stroke="hsl(56, 100%, 98%)" stroke-width="1.4"/>
     <path d="M98 22 L104 32 L116 28 L108 36 L116 45 L104 41 L98 51 L97 39 L88 36 L97 32 Z" fill="hsl(56, 100%, 96%)"/>
     <path d="M14 10 H44 M16 62 H48 M64 10 L82 14 M66 62 L84 58" stroke="hsl(48, 100%, 84%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="52" cy="26" r="2" fill="hsl(192, 100%, 90%)"/>
     <circle cx="56" cy="46" r="2" fill="hsl(334, 98%, 76%)"/>
     <circle cx="114" cy="16" r="1.8" fill="hsl(50, 100%, 92%)"/>`,
    'hsla(318, 94%, 60%, 0.28)',
    `<linearGradient id="ca-flurry_of_blows-calm" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(196, 96%, 68%)" stop-opacity="0.12"/><stop offset="72%" stop-color="hsl(192, 100%, 76%)"/><stop offset="100%" stop-color="hsl(52, 100%, 94%)"/></linearGradient><linearGradient id="ca-flurry_of_blows-wrath" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(326, 96%, 60%)" stop-opacity="0.12"/><stop offset="72%" stop-color="hsl(338, 98%, 64%)"/><stop offset="100%" stop-color="hsl(48, 100%, 88%)"/></linearGradient><radialGradient id="ca-flurry_of_blows-burst" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 97%)"/><stop offset="50%" stop-color="hsl(44, 100%, 66%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(308, 92%, 52%)" stop-opacity="0"/></radialGradient>`
  ),
  flying_sleeves: wrapArtSvg(
    'flying_sleeves',
    'hsl(276, 56%, 22%)',
    'hsl(246, 52%, 9%)',
    `<path d="M10 18 Q26 10 38 18 Q46 12 56 18 M76 58 Q92 50 104 58 Q112 52 122 58" fill="none" stroke="hsl(282, 66%, 72%)" stroke-width="1.3" opacity="0.46"/>
     <path d="M10 42 Q34 10 66 20 Q88 28 106 14 Q94 34 68 34 Q38 34 16 52 Z" fill="hsl(266, 62%, 10%)" opacity="0.58" transform="translate(2,2.5)"/>
     <path d="M10 40 Q34 10 66 20 Q88 28 106 14 Q94 33 68 32 Q38 32 16 50 Z" fill="url(#ca-flying_sleeves-silk1)" stroke="hsl(48, 100%, 82%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M16 40 Q40 18 70 25 Q88 29 102 18" fill="none" stroke="hsl(52, 100%, 94%)" stroke-width="1.3" opacity="0.82"/>
     <path d="M16 60 Q46 38 74 48 Q96 56 112 40 Q100 62 72 60 Q44 58 22 66 Z" fill="hsl(266, 62%, 10%)" opacity="0.58" transform="translate(2,2.5)"/>
     <path d="M16 58 Q46 38 74 48 Q96 56 112 40 Q100 61 72 58 Q44 56 22 64 Z" fill="url(#ca-flying_sleeves-silk2)" stroke="hsl(48, 100%, 84%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M24 58 Q50 45 76 52 Q94 57 108 44" fill="none" stroke="hsl(52, 100%, 94%)" stroke-width="1.3" opacity="0.82"/>
     <path d="M78 12 Q102 8 118 22 Q104 20 86 24 Z" fill="url(#ca-flying_sleeves-arc)"/>
     <path d="M84 36 Q108 32 120 48 Q106 46 90 48 Z" fill="url(#ca-flying_sleeves-arc)"/>
     <path d="M104 14 L118 22 M110 40 L120 48" stroke="hsl(56, 100%, 98%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="96" cy="28" r="2" fill="hsl(50, 100%, 92%)"/>
     <circle cx="48" cy="12" r="1.6" fill="hsl(292, 96%, 82%)"/>
     <circle cx="42" cy="64" r="1.8" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(292, 92%, 64%, 0.28)',
    `<linearGradient id="ca-flying_sleeves-silk1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(288, 72%, 86%)"/><stop offset="48%" stop-color="hsl(282, 74%, 56%)"/><stop offset="100%" stop-color="hsl(262, 62%, 26%)"/></linearGradient><linearGradient id="ca-flying_sleeves-silk2" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(268, 62%, 30%)"/><stop offset="52%" stop-color="hsl(296, 82%, 62%)"/><stop offset="100%" stop-color="hsl(50, 96%, 90%)"/></linearGradient><linearGradient id="ca-flying_sleeves-arc" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(48, 100%, 84%)" stop-opacity="0.2"/><stop offset="65%" stop-color="hsl(48, 100%, 78%)"/><stop offset="100%" stop-color="hsl(56, 100%, 98%)"/></linearGradient>`
  ),
  follow_up: wrapArtSvg(
    'follow_up',
    'hsl(280, 58%, 20%)',
    'hsl(36, 52%, 9%)',
    `<path d="M10 56 Q34 18 76 16" fill="none" stroke="hsl(292, 84%, 66%)" stroke-width="1.4" stroke-dasharray="4 3" opacity="0.58"/>
     <path d="M12 54 Q30 22 66 18 L58 28 Q34 32 18 58 Z" fill="url(#ca-follow_up-echo)" stroke="hsl(296, 90%, 76%)" stroke-width="1.1"/>
     <path d="M22 62 Q58 58 98 28" fill="none" stroke="hsl(46, 100%, 76%)" stroke-width="1.5" opacity="0.65"/>
     <circle cx="96" cy="28" r="22" fill="url(#ca-follow_up-orb)"/>
     <path d="M24 58 L84 26 L98 24 L89 36 L30 64 Z" fill="hsl(276, 62%, 12%)" opacity="0.62" transform="translate(2,2.5)"/>
     <path d="M22 57 L84 25 L99 23 L89 35 L29 63 Z" fill="url(#ca-follow_up-strike)" stroke="hsl(54, 100%, 96%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M30 57 L92 27" stroke="hsl(56, 100%, 99%)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="96" cy="28" r="10.5" fill="none" stroke="hsl(50, 100%, 88%)" stroke-width="1.8"/>
     <polygon points="96,17 100,25 108,28 100,31 96,39 92,31 84,28 92,25" fill="hsl(56, 100%, 98%)"/>
     <path d="M54 14 L66 12 M64 56 L82 48 M16 32 L26 24" stroke="hsl(48, 100%, 84%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="72" cy="14" r="2" fill="hsl(304, 96%, 78%)"/>
     <circle cx="114" cy="20" r="2.1" fill="hsl(50, 100%, 92%)"/>
     <circle cx="88" cy="54" r="1.8" fill="hsl(46, 100%, 82%)"/>`,
    'hsla(46, 98%, 62%, 0.30)',
    `<linearGradient id="ca-follow_up-echo" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(284, 82%, 52%)" stop-opacity="0.16"/><stop offset="100%" stop-color="hsl(304, 94%, 72%)" stop-opacity="0.72"/></linearGradient><linearGradient id="ca-follow_up-strike" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(36, 98%, 54%)"/><stop offset="56%" stop-color="hsl(48, 100%, 78%)"/><stop offset="100%" stop-color="hsl(56, 100%, 98%)"/></linearGradient><radialGradient id="ca-follow_up-orb" cx="42%" cy="38%" r="58%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="48%" stop-color="hsl(46, 100%, 66%)"/><stop offset="100%" stop-color="hsl(34, 94%, 44%)" stop-opacity="0"/></radialGradient>`
  ),
  just_lucky: wrapArtSvg(
    'just_lucky',
    'hsl(268, 54%, 20%)',
    'hsl(214, 52%, 9%)',
    `<path d="M18 22 Q34 12 46 22 Q34 32 18 22 Z" fill="hsl(252, 54%, 24%)" stroke="hsl(194, 96%, 78%)" stroke-width="1.3"/>
     <circle cx="32" cy="22" r="3.6" fill="hsl(192, 100%, 82%)"/>
     <path d="M24 44 Q42 62 56 48 Q72 22 98 34" fill="none" stroke="hsl(48, 100%, 80%)" stroke-width="1.8" stroke-dasharray="4 3" stroke-linecap="round"/>
     <circle cx="48" cy="52" r="14" fill="url(#ca-just_lucky-ward)" stroke="hsl(192, 100%, 84%)" stroke-width="1.6"/>
     <path d="M40 50 Q48 44 56 50" fill="none" stroke="hsl(190, 100%, 94%)" stroke-width="1.2" opacity="0.8"/>
     <rect x="52" y="20" width="22" height="22" rx="4" fill="hsl(262, 60%, 10%)" opacity="0.6" transform="rotate(-16 63 31) translate(2,2.5)"/>
     <rect x="52" y="20" width="22" height="22" rx="4" fill="url(#ca-just_lucky-die)" stroke="hsl(54, 100%, 96%)" stroke-width="1.4" transform="rotate(-16 63 31)"/>
     <circle cx="59" cy="27" r="1.8" fill="hsl(276, 66%, 24%)"/>
     <circle cx="67" cy="25" r="1.8" fill="hsl(276, 66%, 24%)"/>
     <circle cx="63" cy="31" r="1.9" fill="hsl(342, 92%, 52%)"/>
     <circle cx="59" cy="37" r="1.8" fill="hsl(276, 66%, 24%)"/>
     <circle cx="67" cy="35" r="1.8" fill="hsl(276, 66%, 24%)"/>
     <circle cx="98" cy="36" r="18" fill="url(#ca-just_lucky-spark)"/>
     <polygon points="98,20 102,32 114,36 102,40 98,52 94,40 82,36 94,32" fill="hsl(54, 100%, 94%)" stroke="hsl(344, 94%, 64%)" stroke-width="1.1"/>
     <polygon points="22,52 24,56 28,58 24,60 22,64 20,60 16,58 20,56" fill="hsl(50, 100%, 90%)"/>
     <circle cx="84" cy="16" r="2" fill="hsl(50, 100%, 92%)"/>`,
    'hsla(48, 98%, 64%, 0.28)',
    `<linearGradient id="ca-just_lucky-die" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 94%)"/><stop offset="56%" stop-color="hsl(44, 96%, 64%)"/><stop offset="100%" stop-color="hsl(32, 82%, 40%)"/></linearGradient><radialGradient id="ca-just_lucky-ward" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(192, 100%, 90%)" stop-opacity="0.58"/><stop offset="100%" stop-color="hsl(204, 92%, 56%)" stop-opacity="0.1"/></radialGradient><radialGradient id="ca-just_lucky-spark" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="55%" stop-color="hsl(342, 96%, 62%)" stop-opacity="0.62"/><stop offset="100%" stop-color="hsl(296, 80%, 34%)" stop-opacity="0"/></radialGradient>`
  ),
  sash_whip: wrapArtSvg(
    'sash_whip',
    'hsl(304, 58%, 20%)',
    'hsl(266, 54%, 8%)',
    `<path d="M12 22 Q44 6 82 18 M20 62 Q64 68 108 50" fill="none" stroke="hsl(312, 82%, 62%)" stroke-width="1.3" opacity="0.45"/>
     <circle cx="102" cy="24" r="20" fill="url(#ca-sash_whip-snap)"/>
     <path d="M12 58 Q30 66 44 46 Q56 26 42 20 Q28 16 32 34 Q36 52 68 46 Q92 42 102 24" fill="none" stroke="hsl(280, 68%, 10%)" stroke-width="9" stroke-linecap="round" opacity="0.6" transform="translate(2,3)"/>
     <path d="M12 58 Q30 66 44 46 Q56 26 42 20 Q28 16 32 34 Q36 52 68 46 Q92 42 102 24" fill="none" stroke="url(#ca-sash_whip-fabric)" stroke-width="7.2" stroke-linecap="round"/>
     <path d="M12 58 Q30 66 44 46 Q56 26 42 20 Q28 16 32 34 Q36 52 68 46 Q92 42 102 24" fill="none" stroke="url(#ca-sash_whip-trim)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M98 24 L112 14 L115 24 L106 32 Z" fill="url(#ca-sash_whip-trim)" stroke="hsl(54, 100%, 96%)" stroke-width="1"/>
     <path d="M90 12 Q104 8 114 16 M96 36 Q110 38 118 28" fill="none" stroke="hsl(50, 100%, 88%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M100 12 L103 21 L113 18 L106 25 L114 33 L103 28 L99 36 L98 26 L90 23 L98 20 Z" fill="hsl(56, 100%, 98%)"/>
     <path d="M62 28 Q74 22 86 24 M58 56 Q72 58 84 52" fill="none" stroke="hsl(326, 96%, 74%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="82" cy="14" r="1.9" fill="hsl(50, 100%, 92%)"/>
     <circle cx="116" cy="40" r="2" fill="hsl(46, 100%, 82%)"/>
     <circle cx="24" cy="44" r="1.6" fill="hsl(324, 96%, 76%)"/>`,
    'hsla(320, 94%, 60%, 0.28)',
    `<linearGradient id="ca-sash_whip-fabric" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(282, 66%, 30%)"/><stop offset="52%" stop-color="hsl(324, 90%, 54%)"/><stop offset="100%" stop-color="hsl(44, 100%, 72%)"/></linearGradient><linearGradient id="ca-sash_whip-trim" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 94%)"/><stop offset="100%" stop-color="hsl(38, 96%, 54%)"/></linearGradient><radialGradient id="ca-sash_whip-snap" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="48%" stop-color="hsl(46, 100%, 68%)" stop-opacity="0.74"/><stop offset="100%" stop-color="hsl(322, 94%, 54%)" stop-opacity="0"/></radialGradient>`
  ),
  crescendo: wrapArtSvg(
    'crescendo',
    'hsl(338, 70%, 22%)',
    'hsl(296, 58%, 9%)',
    `<ellipse cx="92" cy="36" rx="40" ry="30" fill="url(#ca-crescendo-glow)"/>
     <path d="M16 36 Q26 26 26 36 Q26 46 16 36 Z" fill="hsl(296, 86%, 68%)" opacity="0.7"/>
     <path d="M36 27 Q44 36 36 45" fill="none" stroke="hsl(326, 94%, 68%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M54 20 Q65 36 54 52" fill="none" stroke="hsl(344, 98%, 64%)" stroke-width="3" stroke-linecap="round"/>
     <path d="M74 13 Q88 36 74 59" fill="none" stroke="hsl(24, 100%, 66%)" stroke-width="3.6" stroke-linecap="round"/>
     <path d="M96 8 Q114 36 96 64" fill="none" stroke="hsl(48, 100%, 86%)" stroke-width="4.2" stroke-linecap="round"/>
     <path d="M112 10 L16 36 L112 62" fill="none" stroke="hsl(312, 70%, 14%)" stroke-width="5.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.62" transform="translate(1.5,2)"/>
     <path d="M112 10 L16 36 L112 62" fill="none" stroke="url(#ca-crescendo-wave)" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M112 10 L16 36 L112 62" fill="none" stroke="hsl(54, 100%, 96%)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M84 52 Q88 34 102 22 Q100 34 114 24 Q108 42 114 54 Q98 46 84 52 Z" fill="url(#ca-crescendo-flame)" opacity="0.82"/>
     <circle cx="116" cy="18" r="2.2" fill="hsl(52, 100%, 94%)"/>
     <circle cx="118" cy="36" r="2.6" fill="hsl(50, 100%, 90%)"/>
     <circle cx="116" cy="54" r="2.2" fill="hsl(46, 100%, 84%)"/>
     <circle cx="64" cy="14" r="1.6" fill="hsl(344, 98%, 74%)"/>
     <circle cx="64" cy="58" r="1.6" fill="hsl(344, 98%, 74%)"/>`,
    'hsla(346, 98%, 58%, 0.32)',
    `<linearGradient id="ca-crescendo-wave" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(296, 86%, 56%)"/><stop offset="48%" stop-color="hsl(344, 96%, 58%)"/><stop offset="100%" stop-color="hsl(50, 100%, 84%)"/></linearGradient><linearGradient id="ca-crescendo-flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(326, 92%, 48%)"/><stop offset="56%" stop-color="hsl(14, 98%, 58%)"/><stop offset="100%" stop-color="hsl(52, 100%, 92%)"/></linearGradient><radialGradient id="ca-crescendo-glow" cx="76%" cy="50%" r="48%"><stop offset="0%" stop-color="hsl(48, 100%, 88%)" stop-opacity="0.78"/><stop offset="56%" stop-color="hsl(344, 98%, 54%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(304, 70%, 16%)" stop-opacity="0"/></radialGradient>`
  ),
  empty_body: wrapArtSvg(
    'empty_body',
    'hsl(226, 42%, 20%)',
    'hsl(252, 44%, 9%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-empty_body-aura)"/>
     <path d="M10 58 Q36 50 64 56 Q92 62 118 54" fill="none" stroke="hsl(206, 66%, 78%)" stroke-width="1.3" opacity="0.48"/>
     <path d="M40 16 A27 27 0 1 1 36 48" fill="none" stroke="url(#ca-empty_body-enso)" stroke-width="3.2" stroke-linecap="round" opacity="0.82"/>
     <circle cx="64" cy="36" r="21" fill="none" stroke="hsl(200, 84%, 88%)" stroke-width="1" stroke-dasharray="3 3" opacity="0.65"/>
     <path d="M64 24 Q72 26 74 37 L82 48 Q86 55 76 58 H52 Q42 55 46 48 L54 37 Q56 26 64 24 Z" fill="url(#ca-empty_body-figure)" stroke="hsl(52, 82%, 96%)" stroke-width="1.4" stroke-linejoin="round"/>
     <circle cx="64" cy="18" r="5.5" fill="url(#ca-empty_body-figure)" stroke="hsl(52, 84%, 96%)" stroke-width="1.3"/>
     <path d="M56 36 Q64 41 72 36 M52 54 Q64 48 76 54" fill="none" stroke="hsl(54, 90%, 96%)" stroke-width="1.2" stroke-linecap="round" opacity="0.82"/>
     <path d="M40 60 Q54 54 64 60 Q74 66 88 60" fill="none" stroke="hsl(202, 88%, 88%)" stroke-width="1.8" stroke-linecap="round" opacity="0.78"/>
     <path d="M22 26 Q30 30 34 38 M26 42 Q32 46 38 46" fill="none" stroke="hsl(338, 72%, 72%)" stroke-width="1.4" stroke-linecap="round" opacity="0.54"/>
     <path d="M106 26 Q98 30 94 38 M102 42 Q96 46 90 46" fill="none" stroke="hsl(194, 88%, 78%)" stroke-width="1.4" stroke-linecap="round" opacity="0.62"/>
     <circle cx="24" cy="18" r="1.8" fill="hsl(336, 78%, 78%)" opacity="0.7"/>
     <circle cx="104" cy="18" r="1.8" fill="hsl(192, 92%, 82%)" opacity="0.78"/>
     <circle cx="64" cy="7" r="1.8" fill="hsl(52, 90%, 96%)"/>`,
    'hsla(204, 62%, 78%, 0.26)',
    `<linearGradient id="ca-empty_body-figure" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 72%, 96%)" stop-opacity="0.92"/><stop offset="56%" stop-color="hsl(204, 72%, 82%)" stop-opacity="0.58"/><stop offset="100%" stop-color="hsl(256, 54%, 44%)" stop-opacity="0.08"/></linearGradient><linearGradient id="ca-empty_body-enso" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 68%, 94%)"/><stop offset="55%" stop-color="hsl(198, 76%, 80%)"/><stop offset="100%" stop-color="hsl(276, 56%, 72%)"/></linearGradient><radialGradient id="ca-empty_body-aura" cx="50%" cy="46%" r="50%"><stop offset="0%" stop-color="hsl(204, 90%, 92%)" stop-opacity="0.46"/><stop offset="100%" stop-color="hsl(250, 50%, 20%)" stop-opacity="0"/></radialGradient>`
  ),
  evaluate: wrapArtSvg(
    'evaluate',
    'hsl(256, 56%, 20%)',
    'hsl(214, 58%, 10%)',
    `<circle cx="64" cy="34" r="32" fill="url(#ca-evaluate-halo)"/>
     <path d="M12 66 Q64 56 116 66 L128 72 H0 Z" fill="hsla(244, 54%, 14%, 0.65)"/>
     <path d="M24 58 Q64 10 104 58" fill="none" stroke="hsla(272, 74%, 72%, 0.22)" stroke-width="1.2" stroke-dasharray="3 3"/>
     <ellipse cx="64" cy="63" rx="22" ry="4" fill="hsla(240, 60%, 6%, 0.55)"/>
     <path d="M52 63 L60 56 H68 L76 63 Z" fill="url(#ca-evaluate-gold)" stroke="hsl(32, 68%, 24%)" stroke-width="1"/>
     <rect x="62" y="18" width="4" height="39" rx="1.6" fill="url(#ca-evaluate-gold)" stroke="hsl(32, 68%, 24%)" stroke-width="0.9"/>
     <path d="M24 27 Q64 19 104 27" fill="none" stroke="url(#ca-evaluate-gold)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M28 26 L21 44 M28 26 L37 44 M100 26 L91 44 M100 26 L107 44" stroke="hsla(46, 94%, 76%, 0.72)" stroke-width="1"/>
     <path d="M18 44 Q29 53 40 44 Z" fill="url(#ca-evaluate-gold)" stroke="hsl(32, 66%, 26%)" stroke-width="1"/>
     <path d="M88 44 Q99 53 110 44 Z" fill="url(#ca-evaluate-gold)" stroke="hsl(32, 66%, 26%)" stroke-width="1"/>
     <circle cx="29" cy="40" r="6.5" fill="url(#ca-evaluate-orb)" stroke="hsl(190, 100%, 84%)" stroke-width="1"/>
     <polygon points="99,31 106,39 99,45 92,39" fill="hsl(48, 100%, 82%)" stroke="hsl(286, 78%, 62%)" stroke-width="1.1"/>
     <path d="M57 18 Q64 11 71 18 Q64 25 57 18 Z" fill="hsl(276, 64%, 28%)" stroke="hsl(48, 100%, 80%)" stroke-width="1.2"/>
     <circle cx="64" cy="18" r="2.6" fill="hsl(192, 100%, 76%)"/>
     <circle cx="26" cy="38" r="1.4" fill="hsl(0, 0%, 100%)" opacity="0.88"/>
     <circle cx="46" cy="14" r="1.4" fill="hsl(48, 100%, 86%)"/>
     <circle cx="84" cy="15" r="1.2" fill="hsl(192, 100%, 84%)"/>`,
    'hsla(198, 94%, 62%, 0.28)',
    `<radialGradient id="ca-evaluate-halo" cx="50%" cy="46%" r="48%"><stop offset="0%" stop-color="hsla(46, 98%, 70%, 0.34)"/><stop offset="100%" stop-color="hsla(260, 70%, 20%, 0)"/></radialGradient><linearGradient id="ca-evaluate-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 84%)"/><stop offset="55%" stop-color="hsl(42, 92%, 58%)"/><stop offset="100%" stop-color="hsl(32, 76%, 34%)"/></linearGradient><radialGradient id="ca-evaluate-orb" cx="38%" cy="35%" r="65%"><stop offset="0%" stop-color="hsl(188, 100%, 92%)"/><stop offset="55%" stop-color="hsl(198, 94%, 58%)"/><stop offset="100%" stop-color="hsl(228, 76%, 30%)"/></radialGradient>`
  ),
  halt: wrapArtSvg(
    'halt',
    'hsl(338, 60%, 20%)',
    'hsl(248, 56%, 10%)',
    `<path d="M0 12 L70 20 V56 L0 64 Z" fill="hsla(344, 88%, 42%, 0.28)"/>
     <path d="M0 64 H128 V72 H0 Z" fill="hsla(252, 48%, 10%, 0.72)"/>
     <path d="M8 22 Q38 18 68 30 Q42 36 12 34 Z" fill="url(#ca-halt-wrath)" opacity="0.82"/>
     <path d="M6 48 Q36 38 68 42 Q40 54 10 56 Z" fill="url(#ca-halt-wrath)" opacity="0.72"/>
     <path d="M24 35 Q48 28 69 36 Q48 44 24 37 Z" fill="hsl(44, 100%, 76%)" opacity="0.9"/>
     <path d="M70 6 H96 Q106 36 96 66 H70 Z" fill="url(#ca-halt-wall)" opacity="0.58"/>
     <rect x="67" y="7" width="7" height="58" rx="3" fill="url(#ca-halt-gold)" stroke="hsl(32, 68%, 24%)" stroke-width="1"/>
     <line x1="69" y1="10" x2="69" y2="62" stroke="hsl(50, 100%, 94%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="88" cy="36" r="14" fill="hsla(194, 96%, 58%, 0.24)" stroke="hsl(190, 100%, 80%)" stroke-width="1.5"/>
     <path d="M84 30 V42 M88 27 V43 M92 29 V42 M80 35 L84 42 H93 L95 36" fill="none" stroke="hsl(48, 100%, 86%)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M67 24 Q55 15 48 10 M67 48 Q56 56 46 62" fill="none" stroke="hsl(22, 100%, 66%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M66 30 Q58 26 54 20 M66 42 Q58 46 53 53" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="44" cy="14" r="1.8" fill="hsl(348, 100%, 70%)"/>
     <circle cx="52" cy="58" r="1.6" fill="hsl(36, 100%, 74%)"/>
     <circle cx="109" cy="24" r="1.8" fill="hsl(192, 100%, 84%)"/>
     <circle cx="114" cy="48" r="1.4" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(344, 94%, 58%, 0.28)',
    `<linearGradient id="ca-halt-wrath" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsl(348, 96%, 54%)"/><stop offset="65%" stop-color="hsl(16, 98%, 58%)"/><stop offset="100%" stop-color="hsl(48, 100%, 82%)"/></linearGradient><linearGradient id="ca-halt-wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(48, 100%, 88%)"/><stop offset="35%" stop-color="hsl(192, 98%, 68%)"/><stop offset="100%" stop-color="hsla(210, 92%, 44%, 0.2)"/></linearGradient><linearGradient id="ca-halt-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 86%)"/><stop offset="50%" stop-color="hsl(42, 92%, 58%)"/><stop offset="100%" stop-color="hsl(32, 74%, 34%)"/></linearGradient>`
  ),
  prostrate: wrapArtSvg(
    'prostrate',
    'hsl(274, 54%, 20%)',
    'hsl(36, 54%, 11%)',
    `<circle cx="64" cy="30" r="34" fill="url(#ca-prostrate-sun)"/>
     <circle cx="64" cy="28" r="21" fill="none" stroke="hsla(48, 100%, 78%, 0.45)" stroke-width="1.2" stroke-dasharray="4 3"/>
     <circle cx="64" cy="28" r="13" fill="hsla(48, 100%, 76%, 0.24)" stroke="hsl(48, 100%, 84%)" stroke-width="1.4"/>
     <path d="M64 10 L67 24 L81 28 L67 32 L64 46 L61 32 L47 28 L61 24 Z" fill="hsl(50, 100%, 90%)" opacity="0.88"/>
     <path d="M0 54 H128 V72 H0 Z" fill="url(#ca-prostrate-floor)"/>
     <path d="M10 66 L36 54 M118 66 L92 54 M44 70 L54 54 M84 70 L74 54" stroke="hsla(44, 78%, 68%, 0.22)" stroke-width="1"/>
     <ellipse cx="64" cy="61" rx="34" ry="4.2" fill="hsla(256, 62%, 5%, 0.65)"/>
     <path d="M36 59 Q44 43 60 44 Q74 45 84 55 L96 58 Q99 60 95 61 H42 Q34 61 36 59 Z" fill="url(#ca-prostrate-robe)" stroke="hsl(46, 94%, 72%)" stroke-width="1.2"/>
     <circle cx="80" cy="54" r="4.8" fill="hsl(274, 48%, 22%)" stroke="hsl(48, 100%, 78%)" stroke-width="1.1"/>
     <path d="M40 54 Q52 46 69 48" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.5" stroke-linecap="round" opacity="0.86"/>
     <path d="M56 59 Q64 52 74 58" fill="none" stroke="hsl(292, 82%, 68%)" stroke-width="1.4" opacity="0.72"/>
     <path d="M22 14 L42 30 M106 14 L86 30" stroke="hsla(48, 100%, 82%, 0.34)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="34" cy="24" r="1.7" fill="hsl(48, 100%, 86%)"/>
     <circle cx="94" cy="22" r="1.9" fill="hsl(48, 100%, 88%)"/>
     <circle cx="48" cy="40" r="1.4" fill="hsl(46, 100%, 82%)"/>
     <circle cx="82" cy="38" r="1.4" fill="hsl(46, 100%, 82%)"/>`,
    'hsla(46, 98%, 62%, 0.32)',
    `<radialGradient id="ca-prostrate-sun" cx="50%" cy="38%" r="48%"><stop offset="0%" stop-color="hsl(48, 100%, 86%)"/><stop offset="42%" stop-color="hsla(42, 98%, 58%, 0.48)"/><stop offset="100%" stop-color="hsla(276, 62%, 22%, 0)"/></radialGradient><linearGradient id="ca-prostrate-robe" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(278, 56%, 34%)"/><stop offset="55%" stop-color="hsl(268, 54%, 18%)"/><stop offset="100%" stop-color="hsl(254, 52%, 10%)"/></linearGradient><linearGradient id="ca-prostrate-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(266, 38%, 22%)"/><stop offset="100%" stop-color="hsl(252, 44%, 9%)"/></linearGradient>`
  ),
  protect: wrapArtSvg(
    'protect',
    'hsl(232, 58%, 20%)',
    'hsl(268, 54%, 10%)',
    `<circle cx="64" cy="36" r="30" fill="none" stroke="hsla(192, 96%, 72%, 0.25)" stroke-width="1.2" stroke-dasharray="6 4"/>
     <path d="M10 66 Q64 58 118 66 L128 72 H0 Z" fill="hsla(248, 56%, 9%, 0.7)"/>
     <ellipse cx="64" cy="64" rx="26" ry="4" fill="hsla(244, 68%, 5%, 0.6)"/>
     <path d="M64 8 L90 17 V37 C90 52 78 60 64 65 C50 60 38 52 38 37 V17 Z" fill="url(#ca-protect-dome)" stroke="url(#ca-protect-gold)" stroke-width="2.2"/>
     <path d="M64 14 L83 21 V36 C83 47 74 54 64 58 C54 54 45 47 45 36 V21 Z" fill="url(#ca-protect-amethyst)" stroke="hsl(192, 100%, 78%)" stroke-width="1.2"/>
     <path d="M64 19 Q72 29 64 41 Q56 29 64 19 Z" fill="hsl(48, 100%, 84%)" stroke="hsl(34, 82%, 44%)" stroke-width="0.9"/>
     <path d="M51 35 Q58 31 64 42 Q70 31 77 35 Q70 46 64 48 Q58 46 51 35 Z" fill="hsla(192, 100%, 76%, 0.72)" stroke="hsl(48, 100%, 82%)" stroke-width="1"/>
     <path d="M44 21 Q54 17 64 14" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.6" stroke-linecap="round" opacity="0.72"/>
     <path d="M22 24 L31 28 M18 39 L30 39 M106 24 L97 28 M110 39 L98 39" stroke="hsl(192, 100%, 78%)" stroke-width="1.8" stroke-linecap="round" opacity="0.75"/>
     <polygon points="24,14 27,18 24,22 21,18" fill="hsl(48, 100%, 82%)"/>
     <polygon points="104,14 107,18 104,22 101,18" fill="hsl(48, 100%, 82%)"/>
     <circle cx="64" cy="31" r="2.6" fill="hsl(0, 0%, 100%)" opacity="0.9"/>
     <circle cx="32" cy="54" r="1.6" fill="hsl(192, 100%, 82%)"/>
     <circle cx="96" cy="54" r="1.6" fill="hsl(192, 100%, 82%)"/>`,
    'hsla(196, 96%, 62%, 0.30)',
    `<radialGradient id="ca-protect-dome" cx="50%" cy="38%" r="55%"><stop offset="0%" stop-color="hsla(190, 100%, 84%, 0.65)"/><stop offset="55%" stop-color="hsla(202, 92%, 48%, 0.42)"/><stop offset="100%" stop-color="hsla(262, 72%, 24%, 0.72)"/></radialGradient><linearGradient id="ca-protect-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 86%)"/><stop offset="50%" stop-color="hsl(42, 92%, 58%)"/><stop offset="100%" stop-color="hsl(30, 74%, 34%)"/></linearGradient><linearGradient id="ca-protect-amethyst" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(280, 68%, 48%)"/><stop offset="100%" stop-color="hsl(258, 62%, 22%)"/></linearGradient>`
  ),
  third_eye: wrapArtSvg(
    'third_eye',
    'hsl(268, 60%, 22%)',
    'hsl(216, 58%, 10%)',
    `<circle cx="64" cy="35" r="35" fill="url(#ca-third_eye-glow)"/>
     <circle cx="64" cy="35" r="27" fill="none" stroke="hsla(192, 100%, 76%, 0.3)" stroke-width="1.2"/>
     <circle cx="64" cy="35" r="36" fill="none" stroke="hsla(48, 96%, 72%, 0.22)" stroke-width="1" stroke-dasharray="5 4"/>
     <path d="M64 2 V13 M64 57 V70 M16 14 L34 25 M112 14 L94 25 M16 56 L34 45 M112 56 L94 45" stroke="hsla(48, 100%, 80%, 0.55)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M24 68 Q34 42 64 40 Q94 42 104 68 Z" fill="hsla(266, 52%, 14%, 0.72)" stroke="hsla(288, 72%, 62%, 0.45)" stroke-width="1.2"/>
     <path d="M20 35 Q64 9 108 35 Q64 61 20 35 Z" fill="hsl(258, 56%, 16%)" stroke="url(#ca-third_eye-lid)" stroke-width="2.2"/>
     <path d="M31 35 Q64 17 97 35 Q64 53 31 35 Z" fill="hsla(196, 86%, 72%, 0.24)"/>
     <circle cx="64" cy="35" r="13.5" fill="url(#ca-third_eye-iris)" stroke="hsl(48, 100%, 82%)" stroke-width="1.5"/>
     <ellipse cx="64" cy="35" rx="3.4" ry="8.5" fill="hsl(264, 72%, 14%)" stroke="hsl(190, 100%, 86%)" stroke-width="0.9"/>
     <circle cx="59" cy="30" r="2.6" fill="hsl(0, 0%, 100%)" opacity="0.92"/>
     <polygon points="18,35 23,31 28,35 23,39" fill="hsl(48, 100%, 82%)"/>
     <polygon points="100,35 105,31 110,35 105,39" fill="hsl(48, 100%, 82%)"/>
     <rect x="44" y="54" width="8" height="11" rx="1.4" transform="rotate(-14 48 59)" fill="hsla(286, 80%, 62%, 0.65)" stroke="hsl(48, 100%, 82%)" stroke-width="1"/>
     <rect x="60" y="55" width="8" height="11" rx="1.4" fill="hsla(192, 92%, 62%, 0.7)" stroke="hsl(48, 100%, 84%)" stroke-width="1"/>
     <rect x="76" y="54" width="8" height="11" rx="1.4" transform="rotate(14 80 59)" fill="hsla(286, 80%, 62%, 0.65)" stroke="hsl(48, 100%, 82%)" stroke-width="1"/>`,
    'hsla(192, 98%, 64%, 0.32)',
    `<radialGradient id="ca-third_eye-glow" cx="50%" cy="46%" r="52%"><stop offset="0%" stop-color="hsla(190, 100%, 82%, 0.45)"/><stop offset="55%" stop-color="hsla(282, 86%, 52%, 0.25)"/><stop offset="100%" stop-color="hsla(238, 60%, 14%, 0)"/></radialGradient><radialGradient id="ca-third_eye-iris" cx="46%" cy="44%" r="55%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="45%" stop-color="hsl(190, 100%, 66%)"/><stop offset="100%" stop-color="hsl(268, 84%, 38%)"/></radialGradient><linearGradient id="ca-third_eye-lid" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 84%)"/><stop offset="55%" stop-color="hsl(40, 92%, 56%)"/><stop offset="100%" stop-color="hsl(282, 74%, 44%)"/></linearGradient>`
  ),
  tranquility: wrapArtSvg(
    'tranquility',
    'hsl(204, 62%, 20%)',
    'hsl(240, 58%, 10%)',
    `<path d="M0 44 Q32 35 64 42 Q96 34 128 43 V48 H0 Z" fill="hsla(230, 52%, 14%, 0.78)"/>
     <rect x="0" y="45" width="128" height="27" fill="url(#ca-tranquility-pond)"/>
     <circle cx="64" cy="24" r="22" fill="hsla(192, 100%, 74%, 0.16)"/>
     <path d="M72 9 A15 15 0 1 0 72 39 A11.5 11.5 0 1 1 72 9 Z" fill="url(#ca-tranquility-moon)" stroke="hsl(190, 100%, 92%)" stroke-width="0.8"/>
     <circle cx="64" cy="25" r="7.5" fill="url(#ca-tranquility-orb)"/>
     <path d="M64 19 Q68 25 64 31 Q60 25 64 19 Z" fill="hsl(50, 100%, 94%)" opacity="0.92"/>
     <ellipse cx="64" cy="56" rx="28" ry="6.5" fill="none" stroke="hsla(190, 100%, 80%, 0.65)" stroke-width="1.3"/>
     <ellipse cx="64" cy="56" rx="15" ry="3.4" fill="hsla(190, 100%, 82%, 0.28)" stroke="hsl(188, 100%, 88%)" stroke-width="1.1"/>
     <path d="M54 49 H74 M58 53 H70 M60 61 H68" stroke="hsl(190, 100%, 88%)" stroke-width="1.3" stroke-linecap="round" opacity="0.72"/>
     <path d="M10 6 Q18 22 14 40 M20 6 Q25 18 23 32 M118 6 Q110 22 114 40" fill="none" stroke="hsla(196, 68%, 62%, 0.42)" stroke-width="1.4" stroke-linecap="round"/>
     <ellipse cx="14" cy="30" rx="2" ry="4" fill="hsla(188, 90%, 74%, 0.5)"/>
     <ellipse cx="114" cy="28" rx="2" ry="4" fill="hsla(188, 90%, 74%, 0.5)"/>
     <circle cx="34" cy="18" r="1.4" fill="hsl(52, 100%, 90%)"/>
     <circle cx="94" cy="16" r="1.6" fill="hsl(190, 100%, 88%)"/>
     <circle cx="42" cy="36" r="1.2" fill="hsl(192, 100%, 84%)"/>
     <circle cx="88" cy="38" r="1.3" fill="hsl(52, 100%, 88%)"/>`,
    'hsla(192, 98%, 66%, 0.30)',
    `<radialGradient id="ca-tranquility-moon" cx="42%" cy="40%" r="58%"><stop offset="0%" stop-color="hsl(52, 100%, 96%)"/><stop offset="65%" stop-color="hsl(190, 92%, 82%)"/><stop offset="100%" stop-color="hsl(206, 84%, 56%)"/></radialGradient><linearGradient id="ca-tranquility-pond" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(202, 74%, 26%)"/><stop offset="100%" stop-color="hsl(236, 64%, 11%)"/></linearGradient><radialGradient id="ca-tranquility-orb" cx="42%" cy="38%" r="60%"><stop offset="0%" stop-color="hsl(0, 0%, 100%)"/><stop offset="55%" stop-color="hsl(188, 100%, 72%)"/><stop offset="100%" stop-color="hsla(202, 94%, 50%, 0.2)"/></radialGradient>`
  ),
  pressure_points: wrapArtSvg(
    'pressure_points',
    'hsl(292, 62%, 20%)',
    'hsl(334, 58%, 10%)',
    `<circle cx="70" cy="36" r="31" fill="url(#ca-pressure_points-pulse)" opacity="0.65"/>
     <circle cx="70" cy="36" r="24" fill="none" stroke="hsla(322, 100%, 68%, 0.45)" stroke-width="1.3" stroke-dasharray="6 3"/>
     <circle cx="70" cy="36" r="15" fill="none" stroke="hsl(326, 100%, 74%)" stroke-width="1.6"/>
     <path d="M52 68 L55 34 Q56 26 63 24 Q63 14 70 12 Q77 14 77 24 Q84 26 85 34 L88 68 Z" fill="url(#ca-pressure_points-body)" stroke="hsla(304, 86%, 70%, 0.65)" stroke-width="1.3"/>
     <path d="M70 18 V62 M58 32 Q70 36 82 32 M60 48 Q70 52 80 48" fill="none" stroke="hsla(48, 100%, 76%, 0.65)" stroke-width="1.2" stroke-dasharray="2 2"/>
     <circle cx="70" cy="20" r="3" fill="hsl(322, 100%, 68%)" stroke="hsl(50, 100%, 90%)" stroke-width="1"/>
     <circle cx="60" cy="33" r="2.7" fill="hsl(322, 100%, 66%)" stroke="hsl(50, 100%, 88%)" stroke-width="0.9"/>
     <circle cx="80" cy="33" r="2.7" fill="hsl(322, 100%, 66%)" stroke="hsl(50, 100%, 88%)" stroke-width="0.9"/>
     <circle cx="70" cy="52" r="3.2" fill="hsl(322, 100%, 68%)" stroke="hsl(50, 100%, 90%)" stroke-width="1"/>
     <circle cx="70" cy="36" r="6.2" fill="url(#ca-pressure_points-pulse)" stroke="hsl(50, 100%, 92%)" stroke-width="1.3"/>
     <path d="M12 22 L42 32 L64 35 L40 39 L12 33 Z" fill="url(#ca-pressure_points-hand)" stroke="hsl(286, 62%, 28%)" stroke-width="1.1"/>
     <path d="M88 22 L108 16 M92 36 L114 36 M88 50 L108 56" stroke="hsl(324, 100%, 74%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="102" cy="26" r="1.8" fill="hsl(50, 100%, 88%)"/>
     <circle cx="98" cy="48" r="1.6" fill="hsl(322, 100%, 76%)"/>`,
    'hsla(318, 98%, 62%, 0.32)',
    `<radialGradient id="ca-pressure_points-pulse" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(50, 100%, 94%)"/><stop offset="40%" stop-color="hsl(320, 100%, 64%)"/><stop offset="100%" stop-color="hsla(304, 92%, 44%, 0)"/></radialGradient><linearGradient id="ca-pressure_points-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsla(276, 56%, 34%, 0.85)"/><stop offset="100%" stop-color="hsla(256, 60%, 14%, 0.92)"/></linearGradient><linearGradient id="ca-pressure_points-hand" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 96%, 86%)"/><stop offset="100%" stop-color="hsl(320, 86%, 64%)"/></linearGradient>`
  ),
  carve_reality: wrapArtSvg(
    'carve_reality',
    'hsl(276, 58%, 20%)',
    'hsl(232, 56%, 10%)',
    `<path d="M0 18 L48 24 M0 42 L34 46 M82 28 L128 22 M90 52 L128 48" stroke="hsla(282, 76%, 68%, 0.24)" stroke-width="1.1"/>
     <ellipse cx="64" cy="36" rx="34" ry="26" fill="url(#ca-carve_reality-core)"/>
     <path d="M18 65 Q54 34 108 6 Q76 42 26 67 Z" fill="url(#ca-carve_reality-rift)" stroke="hsl(48, 100%, 92%)" stroke-width="1.4"/>
     <path d="M26 63 Q60 36 102 10" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M64 18 L70 34 L64 52 L58 34 Z" fill="hsl(50, 100%, 88%)" stroke="hsl(34, 92%, 48%)" stroke-width="1.2"/>
     <rect x="59" y="48" width="10" height="3" rx="1" fill="hsl(44, 96%, 64%)"/>
     <path d="M16 20 Q42 30 78 52 L84 46 Q50 23 22 14 Z" fill="url(#ca-carve_reality-blade)" stroke="hsl(48, 100%, 84%)" stroke-width="1.3"/>
     <line x1="23" y1="18" x2="76" y2="48" stroke="hsl(0, 0%, 100%)" stroke-width="1.2" opacity="0.85"/>
     <polygon points="32,42 40,36 42,46" fill="hsl(274, 58%, 32%)" stroke="hsl(48, 100%, 78%)" stroke-width="0.9"/>
     <polygon points="86,44 96,38 92,50" fill="hsl(274, 58%, 32%)" stroke="hsl(48, 100%, 78%)" stroke-width="0.9"/>
     <polygon points="44,18 52,13 50,23" fill="hsl(268, 60%, 34%)" stroke="hsl(296, 92%, 78%)" stroke-width="0.9"/>
     <circle cx="96" cy="20" r="2.2" fill="hsl(50, 100%, 90%)"/>
     <circle cx="32" cy="56" r="1.9" fill="hsl(48, 100%, 84%)"/>
     <circle cx="108" cy="36" r="1.5" fill="hsl(296, 100%, 82%)"/>`,
    'hsla(46, 98%, 64%, 0.30)',
    `<linearGradient id="ca-carve_reality-rift" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(38, 100%, 56%)"/><stop offset="50%" stop-color="hsl(50, 100%, 90%)"/><stop offset="100%" stop-color="hsl(44, 100%, 64%)"/></linearGradient><linearGradient id="ca-carve_reality-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(296, 90%, 84%)"/><stop offset="55%" stop-color="hsl(274, 72%, 52%)"/><stop offset="100%" stop-color="hsl(248, 66%, 24%)"/></linearGradient><radialGradient id="ca-carve_reality-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(48, 100%, 86%, 0.75)"/><stop offset="100%" stop-color="hsla(40, 100%, 54%, 0)"/></radialGradient>`
  ),
  conclude: wrapArtSvg(
    'conclude',
    'hsl(298, 56%, 20%)',
    'hsl(246, 58%, 10%)',
    `<circle cx="64" cy="32" r="25" fill="url(#ca-conclude-eclipse)"/>
     <circle cx="64" cy="32" r="15.5" fill="hsl(258, 58%, 11%)" stroke="hsl(48, 100%, 80%)" stroke-width="1.3"/>
     <path d="M0 72 V56 L22 47 L46 55 L74 46 L104 56 L128 49 V72 Z" fill="hsla(256, 52%, 11%, 0.88)"/>
     <path d="M6 42 Q64 25 122 36 Q64 33 6 46 Z" fill="hsla(326, 96%, 60%, 0.62)"/>
     <path d="M8 40 Q64 27 120 35 Q64 31 8 42 Z" fill="url(#ca-conclude-slash)"/>
     <path d="M16 39 Q64 28 116 35" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M92 64 L96 42 Q100 35 106 39 L112 64 Z" fill="hsl(274, 52%, 18%)" stroke="hsl(46, 94%, 74%)" stroke-width="1.1"/>
     <circle cx="101" cy="34" r="4.2" fill="hsl(274, 50%, 16%)" stroke="hsl(48, 100%, 82%)" stroke-width="1"/>
     <path d="M84 44 L116 30" stroke="hsl(48, 100%, 82%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M36 20 L38 48 M64 14 L64 52 M86 22 L84 46" stroke="hsla(48, 100%, 86%, 0.25)" stroke-width="1.1" stroke-dasharray="3 3"/>
     <ellipse cx="26" cy="26" rx="3" ry="1.4" transform="rotate(-25 26 26)" fill="hsl(328, 100%, 76%)"/>
     <ellipse cx="48" cy="52" rx="3.2" ry="1.4" transform="rotate(20 48 52)" fill="hsl(48, 100%, 82%)"/>
     <ellipse cx="78" cy="18" rx="2.8" ry="1.3" transform="rotate(-18 78 18)" fill="hsl(326, 100%, 78%)"/>
     <circle cx="118" cy="35" r="2.6" fill="hsl(0, 0%, 100%)"/>`,
    'hsla(328, 92%, 60%, 0.28)',
    `<radialGradient id="ca-conclude-eclipse" cx="50%" cy="50%" r="50%"><stop offset="56%" stop-color="hsl(260, 62%, 10%)"/><stop offset="82%" stop-color="hsl(44, 100%, 70%)"/><stop offset="100%" stop-color="hsla(326, 94%, 56%, 0)"/></radialGradient><linearGradient id="ca-conclude-slash" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsla(322, 98%, 62%, 0.1)"/><stop offset="40%" stop-color="hsl(48, 100%, 88%)"/><stop offset="78%" stop-color="hsl(0, 0%, 100%)"/><stop offset="100%" stop-color="hsl(326, 100%, 68%)"/></linearGradient>`
  ),
  fear_no_evil: wrapArtSvg(
    'fear_no_evil',
    'hsl(224, 56%, 19%)',
    'hsl(344, 54%, 10%)',
    `<rect x="0" y="0" width="70" height="72" fill="url(#ca-fear_no_evil-evil)"/>
     <circle cx="88" cy="36" r="34" fill="url(#ca-fear_no_evil-calm)"/>
     <path d="M14 18 L24 22 L16 25 Z M32 16 L24 22 L33 23 Z" fill="hsl(354, 100%, 62%)"/>
     <path d="M8 52 Q26 30 56 34 L63 39 L48 42 L61 48 L42 49 L54 57 Q30 58 8 64 Z" fill="url(#ca-fear_no_evil-claw)" stroke="hsl(352, 92%, 58%)" stroke-width="1.3"/>
     <path d="M62 12 Q54 36 62 60" fill="none" stroke="hsl(190, 100%, 80%)" stroke-width="3" stroke-linecap="round"/>
     <path d="M67 16 Q60 36 67 56" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M80 65 L84 34 Q88 26 95 28 L104 65 Z" fill="hsl(246, 52%, 20%)" stroke="hsl(192, 96%, 76%)" stroke-width="1.3"/>
     <circle cx="91" cy="21" r="5" fill="hsl(246, 48%, 22%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.1"/>
     <path d="M84 34 L63 36" stroke="hsl(48, 100%, 88%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M62 24 L62 48 M50 36 H74" stroke="hsl(0, 0%, 100%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="62" cy="36" r="4.8" fill="hsl(190, 100%, 86%)" opacity="0.9"/>
     <path d="M46 24 L36 16 M48 52 L36 60" stroke="hsl(350, 96%, 64%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="106" cy="22" r="2" fill="hsl(190, 100%, 84%)"/>
     <circle cx="112" cy="46" r="1.6" fill="hsl(48, 100%, 86%)"/>
     <circle cx="42" cy="26" r="1.5" fill="hsl(354, 100%, 68%)"/>`,
    'hsla(194, 96%, 62%, 0.28)',
    `<linearGradient id="ca-fear_no_evil-evil" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsl(350, 74%, 22%)"/><stop offset="100%" stop-color="hsla(344, 62%, 12%, 0)"/></linearGradient><radialGradient id="ca-fear_no_evil-calm" cx="72%" cy="46%" r="48%"><stop offset="0%" stop-color="hsla(190, 100%, 76%, 0.52)"/><stop offset="100%" stop-color="hsla(210, 88%, 40%, 0)"/></radialGradient><linearGradient id="ca-fear_no_evil-claw" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(346, 62%, 28%)"/><stop offset="100%" stop-color="hsl(276, 54%, 12%)"/></linearGradient>`
  ),
  sands_of_time: wrapArtSvg(
    'sands_of_time',
    'hsl(258, 56%, 20%)',
    'hsl(34, 58%, 11%)',
    `<circle cx="64" cy="36" r="30" fill="none" stroke="hsla(46, 94%, 72%, 0.24)" stroke-width="1.2" stroke-dasharray="3 4"/>
     <ellipse cx="64" cy="36" rx="44" ry="12" transform="rotate(-16 64 36)" fill="none" stroke="hsla(286, 86%, 72%, 0.44)" stroke-width="1.5"/>
     <ellipse cx="64" cy="65" rx="22" ry="3.5" fill="hsla(256, 62%, 5%, 0.62)"/>
     <path d="M46 12 H82 Q82 28 67 36 Q82 44 82 60 H46 Q46 44 61 36 Q46 28 46 12 Z" fill="url(#ca-sands_of_time-glass)" stroke="hsl(48, 96%, 78%)" stroke-width="1.3"/>
     <path d="M51 22 H77 Q74 30 64 35 Q54 30 51 22 Z" fill="url(#ca-sands_of_time-sand)"/>
     <path d="M50 60 Q64 43 78 60 Z" fill="url(#ca-sands_of_time-sand)"/>
     <line x1="64" y1="35" x2="64" y2="52" stroke="hsl(52, 100%, 92%)" stroke-width="2" stroke-dasharray="3 1.5" stroke-linecap="round"/>
     <rect x="40" y="7" width="48" height="5.5" rx="2.4" fill="url(#ca-sands_of_time-gold)" stroke="hsl(28, 72%, 26%)" stroke-width="1"/>
     <rect x="40" y="59.5" width="48" height="5.5" rx="2.4" fill="url(#ca-sands_of_time-gold)" stroke="hsl(28, 72%, 26%)" stroke-width="1"/>
     <line x1="44" y1="12.5" x2="44" y2="59.5" stroke="url(#ca-sands_of_time-gold)" stroke-width="2.2"/>
     <line x1="84" y1="12.5" x2="84" y2="59.5" stroke="url(#ca-sands_of_time-gold)" stroke-width="2.2"/>
     <path d="M51 15 Q51 24 58 31 M51 56 Q51 47 58 41" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.3" stroke-linecap="round" opacity="0.72"/>
     <circle cx="24" cy="24" r="1.8" fill="hsl(48, 100%, 86%)"/>
     <circle cx="104" cy="22" r="2.1" fill="hsl(50, 100%, 90%)"/>
     <circle cx="30" cy="52" r="1.5" fill="hsl(292, 94%, 78%)"/>
     <circle cx="98" cy="48" r="1.7" fill="hsl(46, 100%, 84%)"/>`,
    'hsla(44, 98%, 64%, 0.32)',
    `<linearGradient id="ca-sands_of_time-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 88%)"/><stop offset="50%" stop-color="hsl(42, 94%, 58%)"/><stop offset="100%" stop-color="hsl(28, 76%, 32%)"/></linearGradient><linearGradient id="ca-sands_of_time-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(206, 94%, 82%, 0.45)"/><stop offset="50%" stop-color="hsla(266, 72%, 34%, 0.28)"/><stop offset="100%" stop-color="hsla(48, 100%, 84%, 0.35)"/></linearGradient><radialGradient id="ca-sands_of_time-sand" cx="50%" cy="55%" r="55%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="55%" stop-color="hsl(42, 100%, 62%)"/><stop offset="100%" stop-color="hsl(24, 92%, 44%)"/></radialGradient>`
  ),
  talk_to_the_hand: wrapArtSvg(
    'talk_to_the_hand',
    'hsl(236, 56%, 20%)',
    'hsl(284, 54%, 10%)',
    `<circle cx="72" cy="36" r="34" fill="url(#ca-talk_to_the_hand-wave)"/>
     <ellipse cx="76" cy="36" rx="28" ry="26" fill="none" stroke="hsla(190, 100%, 78%, 0.42)" stroke-width="1.4" stroke-dasharray="7 4"/>
     <ellipse cx="72" cy="36" rx="20" ry="19" fill="hsla(192, 98%, 62%, 0.16)" stroke="hsl(190, 100%, 82%)" stroke-width="1.8"/>
     <path d="M10 68 L28 46 L46 58 L32 72 Z" fill="hsl(278, 54%, 26%)" stroke="hsl(46, 92%, 70%)" stroke-width="1.3"/>
     <path d="M36 52 L42 30 Q43 26 47 28 L49 38 L52 17 Q54 13 58 16 L59 34 L63 14 Q66 11 69 15 L68 35 L74 18 Q77 16 79 20 L75 40 L84 32 Q88 31 87 36 L74 52 Q64 60 48 58 Z" fill="url(#ca-talk_to_the_hand-palm)" stroke="hsl(274, 58%, 24%)" stroke-width="1.4" stroke-linejoin="round"/>
     <circle cx="61" cy="43" r="6" fill="hsl(190, 100%, 78%)" stroke="hsl(48, 100%, 90%)" stroke-width="1.3"/>
     <circle cx="61" cy="43" r="2.4" fill="hsl(0, 0%, 100%)"/>
     <path d="M92 16 Q106 36 92 56 M100 12 Q117 36 100 60" fill="none" stroke="hsl(190, 100%, 80%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M88 22 Q98 36 88 50" fill="none" stroke="hsl(48, 100%, 86%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="108,24 113,28 108,32 103,28" fill="hsl(190, 100%, 84%)"/>
     <polygon points="110,44 114,48 110,52 106,48" fill="hsl(48, 100%, 84%)"/>
     <circle cx="24" cy="24" r="1.8" fill="hsl(292, 92%, 78%)"/>
     <circle cx="34" cy="16" r="1.4" fill="hsl(192, 100%, 82%)"/>`,
    'hsla(192, 98%, 64%, 0.30)',
    `<radialGradient id="ca-talk_to_the_hand-wave" cx="55%" cy="46%" r="50%"><stop offset="0%" stop-color="hsla(190, 100%, 84%, 0.56)"/><stop offset="65%" stop-color="hsla(198, 94%, 56%, 0.24)"/><stop offset="100%" stop-color="hsla(266, 76%, 34%, 0)"/></radialGradient><linearGradient id="ca-talk_to_the_hand-palm" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 90%)"/><stop offset="55%" stop-color="hsl(42, 90%, 66%)"/><stop offset="100%" stop-color="hsl(288, 62%, 44%)"/></linearGradient>`
  ),
  tantrum: wrapArtSvg(
    'tantrum',
    'hsl(338, 68%, 22%)',
    'hsl(284, 58%, 10%)',
    `<path d="M0 58 L26 52 L48 59 L78 51 L104 58 L128 53 V72 H0 Z" fill="hsl(278, 48%, 13%)" stroke="hsl(344, 88%, 54%)" stroke-width="1.2"/>
     <path d="M10 6 L46 42 L36 48 L4 14 Z" fill="url(#ca-tantrum-trail)"/>
     <path d="M46 4 L72 48 L60 52 L36 8 Z" fill="url(#ca-tantrum-trail)"/>
     <path d="M84 6 L102 44 L91 48 L74 10 Z" fill="url(#ca-tantrum-trail)"/>
     <path d="M32 38 L46 34 L50 45 L38 51 L30 46 Z" fill="url(#ca-tantrum-fist)" stroke="hsl(48, 100%, 86%)" stroke-width="1.3"/>
     <path d="M58 43 L74 39 L78 51 L65 57 L55 51 Z" fill="url(#ca-tantrum-fist)" stroke="hsl(48, 100%, 90%)" stroke-width="1.5"/>
     <path d="M86 38 L100 34 L104 45 L92 50 L84 45 Z" fill="url(#ca-tantrum-fist)" stroke="hsl(48, 100%, 86%)" stroke-width="1.3"/>
     <ellipse cx="66" cy="59" rx="38" ry="6" fill="none" stroke="hsl(342, 100%, 66%)" stroke-width="1.8"/>
     <ellipse cx="66" cy="59" rx="22" ry="3.4" fill="hsla(48, 100%, 78%, 0.45)"/>
     <polygon points="22,52 28,44 31,53" fill="hsl(288, 44%, 26%)" stroke="hsl(344, 90%, 64%)" stroke-width="1"/>
     <polygon points="104,50 112,42 114,52" fill="hsl(288, 44%, 26%)" stroke="hsl(344, 90%, 64%)" stroke-width="1"/>
     <polygon points="48,62 54,55 57,64" fill="hsl(292, 46%, 24%)" stroke="hsl(46, 98%, 74%)" stroke-width="0.9"/>
     <path d="M18 38 L10 30 M112 34 L120 26 M64 14 L64 26" stroke="hsl(48, 100%, 82%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="24" cy="24" r="2" fill="hsl(48, 100%, 86%)"/>
     <circle cx="106" cy="22" r="2" fill="hsl(344, 100%, 72%)"/>
     <circle cx="80" cy="62" r="1.8" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(344, 98%, 58%, 0.34)',
    `<linearGradient id="ca-tantrum-trail" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(328, 100%, 62%, 0.1)"/><stop offset="65%" stop-color="hsl(344, 100%, 58%)"/><stop offset="100%" stop-color="hsl(48, 100%, 86%)"/></linearGradient><radialGradient id="ca-tantrum-fist" cx="45%" cy="45%" r="55%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="50%" stop-color="hsl(342, 100%, 60%)"/><stop offset="100%" stop-color="hsl(296, 84%, 34%)"/></radialGradient>`
  ),
  wallop: wrapArtSvg(
    'wallop',
    'hsl(270, 56%, 20%)',
    'hsl(206, 58%, 11%)',
    `<path d="M0 57 H128 V72 H0 Z" fill="hsla(244, 52%, 11%, 0.8)"/>
     <circle cx="68" cy="56" r="32" fill="url(#ca-wallop-impact)"/>
     <path d="M22 57 A46 36 0 0 1 114 57" fill="none" stroke="hsl(190, 100%, 76%)" stroke-width="2" stroke-dasharray="10 4"/>
     <path d="M36 57 A32 25 0 0 1 100 57" fill="hsla(192, 98%, 62%, 0.18)" stroke="hsl(190, 100%, 84%)" stroke-width="1.8"/>
     <ellipse cx="68" cy="58" rx="34" ry="5.5" fill="none" stroke="hsl(48, 100%, 80%)" stroke-width="1.5"/>
     <path d="M18 10 Q42 20 62 46" fill="none" stroke="hsla(48, 100%, 80%, 0.48)" stroke-width="4" stroke-linecap="round"/>
     <path d="M38 6 L72 52 L65 57 L31 11 Z" fill="url(#ca-wallop-staff)" stroke="hsl(28, 72%, 24%)" stroke-width="1.2"/>
     <line x1="36" y1="10" x2="67" y2="52" stroke="hsl(52, 100%, 94%)" stroke-width="1.3" stroke-linecap="round" opacity="0.88"/>
     <circle cx="42" cy="18" r="5" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.6"/>
     <circle cx="34" cy="23" r="3.2" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.4"/>
     <path d="M68 42 L72 53 L83 56 L72 59 L68 68 L64 59 L53 56 L64 53 Z" fill="hsl(52, 100%, 92%)"/>
     <path d="M78 44 L98 28 M84 50 L108 42 M54 46 L34 36" stroke="hsl(48, 100%, 84%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="98" cy="24" r="2" fill="hsl(190, 100%, 86%)"/>
     <circle cx="28" cy="34" r="1.8" fill="hsl(190, 100%, 84%)"/>
     <circle cx="106" cy="48" r="1.6" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(44, 98%, 64%, 0.32)',
    `<linearGradient id="ca-wallop-staff" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 86%)"/><stop offset="48%" stop-color="hsl(38, 90%, 54%)"/><stop offset="100%" stop-color="hsl(278, 62%, 34%)"/></linearGradient><radialGradient id="ca-wallop-impact" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(0, 0%, 100%)"/><stop offset="38%" stop-color="hsl(46, 100%, 70%)"/><stop offset="76%" stop-color="hsla(192, 100%, 62%, 0.45)"/><stop offset="100%" stop-color="hsla(206, 92%, 44%, 0)"/></radialGradient>`
  ),
  weave: wrapArtSvg(
    'weave',
    'hsl(278, 56%, 20%)',
    'hsl(214, 56%, 11%)',
    `<path d="M6 36 C24 6 50 6 64 36 C78 66 104 66 122 36" fill="none" stroke="hsla(292, 92%, 68%, 0.26)" stroke-width="10" stroke-linecap="round"/>
     <path d="M6 36 C24 66 50 66 64 36 C78 6 104 6 122 36" fill="none" stroke="hsla(192, 98%, 64%, 0.26)" stroke-width="10" stroke-linecap="round"/>
     <path d="M10 36 C26 10 50 10 64 36 C78 62 102 62 118 36" fill="none" stroke="url(#ca-weave-violet)" stroke-width="4.4" stroke-linecap="round"/>
     <path d="M10 36 C26 62 50 62 64 36 C78 10 102 10 118 36" fill="none" stroke="url(#ca-weave-cyan)" stroke-width="4.4" stroke-linecap="round"/>
     <path d="M10 36 C26 10 50 10 64 36 C78 62 102 62 118 36" fill="none" stroke="hsl(48, 100%, 86%)" stroke-width="1.1" stroke-dasharray="10 6"/>
     <path d="M36 22 L52 14 L44 28 Z" fill="url(#ca-weave-blade)" stroke="hsl(276, 62%, 28%)" stroke-width="1"/>
     <path d="M92 50 L76 58 L84 44 Z" fill="url(#ca-weave-blade)" stroke="hsl(276, 62%, 28%)" stroke-width="1"/>
     <path d="M54 36 Q64 26 74 36 Q64 46 54 36 Z" fill="hsl(264, 62%, 18%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.4"/>
     <circle cx="64" cy="36" r="4.2" fill="hsl(190, 100%, 74%)"/>
     <circle cx="64" cy="36" r="1.6" fill="hsl(0, 0%, 100%)"/>
     <circle cx="34" cy="52" r="2.2" fill="hsl(190, 100%, 84%)"/>
     <circle cx="94" cy="20" r="2.2" fill="hsl(48, 100%, 86%)"/>
     <circle cx="16" cy="20" r="1.4" fill="hsl(304, 100%, 82%)"/>
     <circle cx="112" cy="54" r="1.4" fill="hsl(192, 100%, 82%)"/>`,
    'hsla(292, 92%, 64%, 0.28)',
    `<linearGradient id="ca-weave-violet" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(304, 96%, 76%)"/><stop offset="55%" stop-color="hsl(278, 84%, 54%)"/><stop offset="100%" stop-color="hsl(252, 74%, 34%)"/></linearGradient><linearGradient id="ca-weave-cyan" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(188, 100%, 84%)"/><stop offset="55%" stop-color="hsl(198, 94%, 56%)"/><stop offset="100%" stop-color="hsl(232, 78%, 36%)"/></linearGradient><linearGradient id="ca-weave-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(0, 0%, 100%)"/><stop offset="55%" stop-color="hsl(48, 96%, 76%)"/><stop offset="100%" stop-color="hsl(288, 76%, 54%)"/></linearGradient>`
  ),
  wheel_kick: wrapArtSvg(
    'wheel_kick',
    'hsl(294, 58%, 21%)',
    'hsl(244, 58%, 10%)',
    `<ellipse cx="64" cy="64" rx="42" ry="5" fill="hsla(256, 62%, 6%, 0.62)"/>
     <circle cx="64" cy="36" r="27" fill="none" stroke="hsla(316, 94%, 64%, 0.24)" stroke-width="8"/>
     <path d="M40 50 A26 26 0 1 1 88 26" fill="none" stroke="url(#ca-wheel_kick-arc)" stroke-width="7.5" stroke-linecap="round"/>
     <path d="M44 48 A22 22 0 1 1 85 24" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M68 12 A24 24 0 0 1 88 38" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.6" stroke-linecap="round" opacity="0.88"/>
     <path d="M52 44 L62 32 L78 24 L82 29 L66 40 L58 55 L50 53 Z" fill="url(#ca-wheel_kick-monk)" stroke="hsl(48, 100%, 80%)" stroke-width="1.2"/>
     <circle cx="56" cy="30" r="4.6" fill="hsl(274, 54%, 20%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.1"/>
     <path d="M54 36 Q42 38 34 30" fill="none" stroke="hsl(322, 96%, 68%)" stroke-width="2.4" stroke-linecap="round"/>
     <polygon points="84,18 96,24 86,32" fill="hsl(50, 100%, 90%)"/>
     <rect x="96" y="34" width="11" height="15" rx="1.8" transform="rotate(18 101 41)" fill="hsla(282, 78%, 54%, 0.72)" stroke="hsl(48, 100%, 84%)" stroke-width="1.2"/>
     <rect x="104" y="44" width="10" height="14" rx="1.8" transform="rotate(32 109 51)" fill="hsla(192, 94%, 60%, 0.68)" stroke="hsl(48, 100%, 84%)" stroke-width="1.1"/>
     <circle cx="24" cy="26" r="2" fill="hsl(48, 100%, 86%)"/>
     <circle cx="96" cy="14" r="1.8" fill="hsl(322, 100%, 76%)"/>
     <circle cx="34" cy="56" r="1.5" fill="hsl(48, 100%, 82%)"/>`,
    'hsla(318, 96%, 62%, 0.32)',
    `<linearGradient id="ca-wheel_kick-arc" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 88%)"/><stop offset="48%" stop-color="hsl(322, 100%, 64%)"/><stop offset="100%" stop-color="hsla(276, 86%, 46%, 0.15)"/></linearGradient><linearGradient id="ca-wheel_kick-monk" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(280, 62%, 34%)"/><stop offset="100%" stop-color="hsl(252, 62%, 12%)"/></linearGradient>`
  ),
  deceive_reality: wrapArtSvg(
    'deceive_reality',
    'hsl(262, 58%, 20%)',
    'hsl(204, 56%, 11%)',
    `<path d="M14 6 L54 66 M74 6 L114 66" stroke="hsla(192, 100%, 78%, 0.16)" stroke-width="6"/>
     <polygon points="18,16 46,10 50,58 22,64" fill="hsla(276, 68%, 36%, 0.42)" stroke="hsla(292, 92%, 74%, 0.72)" stroke-width="1.2"/>
     <polygon points="78,10 106,16 102,64 74,58" fill="hsla(204, 72%, 34%, 0.42)" stroke="hsla(190, 96%, 76%, 0.72)" stroke-width="1.2"/>
     <path d="M30 56 Q34 32 39 30 Q43 32 45 56 Z" fill="hsla(296, 88%, 70%, 0.35)"/>
     <path d="M84 56 Q88 32 92 30 Q97 32 99 56 Z" fill="hsla(190, 96%, 72%, 0.35)"/>
     <polygon points="44,8 84,8 88,64 40,64" fill="url(#ca-deceive_reality-glass)" stroke="hsl(48, 100%, 84%)" stroke-width="1.6"/>
     <line x1="48" y1="14" x2="64" y2="58" stroke="hsla(0, 0%, 100%, 0.38)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="64,19 77,27 77,44 64,53 51,44 51,27" fill="url(#ca-deceive_reality-ward)" stroke="hsl(50, 100%, 92%)" stroke-width="1.4"/>
     <polygon points="64,26 71,36 64,46 57,36" fill="hsl(258, 62%, 18%)" stroke="hsl(48, 100%, 86%)" stroke-width="1"/>
     <circle cx="64" cy="36" r="2.6" fill="hsl(0, 0%, 100%)"/>
     <polygon points="14,34 19,30 22,38" fill="hsl(190, 100%, 80%)" opacity="0.8"/>
     <polygon points="114,36 108,32 106,40" fill="hsl(296, 94%, 78%)" opacity="0.8"/>
     <circle cx="34" cy="22" r="1.6" fill="hsl(48, 100%, 86%)"/>
     <circle cx="94" cy="24" r="1.6" fill="hsl(190, 100%, 86%)"/>`,
    'hsla(278, 94%, 66%, 0.28)',
    `<linearGradient id="ca-deceive_reality-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(192, 100%, 84%, 0.56)"/><stop offset="50%" stop-color="hsla(284, 86%, 58%, 0.34)"/><stop offset="100%" stop-color="hsla(238, 72%, 24%, 0.65)"/></linearGradient><linearGradient id="ca-deceive_reality-ward" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 86%)"/><stop offset="55%" stop-color="hsl(190, 100%, 66%)"/><stop offset="100%" stop-color="hsl(274, 82%, 48%)"/></linearGradient>`
  ),
  empty_mind: wrapArtSvg(
    'empty_mind',
    'hsl(248, 44%, 20%)',
    'hsl(224, 50%, 10%)',
    `<path d="M0 16 Q24 36 18 64 L0 72 Z" fill="hsla(344, 84%, 52%, 0.18)"/>
     <path d="M128 16 Q104 36 110 64 L128 72 Z" fill="hsla(192, 92%, 58%, 0.18)"/>
     <circle cx="64" cy="36" r="28" fill="url(#ca-empty_mind-void)"/>
     <path d="M78 15 A23 23 0 1 0 85 45" fill="none" stroke="url(#ca-empty_mind-enso)" stroke-width="5.2" stroke-linecap="round"/>
     <path d="M76 16 A21 21 0 1 0 83 44" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.3" stroke-linecap="round" opacity="0.82"/>
     <path d="M84 44 Q88 37 86 30" fill="none" stroke="hsla(48, 92%, 82%, 0.55)" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="3 2"/>
     <circle cx="64" cy="36" r="10" fill="hsla(0, 0%, 100%, 0.14)" stroke="hsla(50, 100%, 92%, 0.45)" stroke-width="1"/>
     <rect x="18" y="38" width="12" height="17" rx="2" transform="rotate(-14 24 46)" fill="hsla(246, 44%, 28%, 0.72)" stroke="hsl(50, 100%, 88%)" stroke-width="1.2"/>
     <rect x="98" y="38" width="12" height="17" rx="2" transform="rotate(14 104 46)" fill="hsla(216, 48%, 28%, 0.72)" stroke="hsl(196, 94%, 84%)" stroke-width="1.2"/>
     <path d="M26 62 Q64 56 102 62" fill="none" stroke="hsla(210, 82%, 86%, 0.32)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="34" cy="20" r="1.6" fill="hsl(344, 92%, 74%)" opacity="0.65"/>
     <circle cx="96" cy="20" r="1.6" fill="hsl(192, 100%, 82%)" opacity="0.65"/>
     <circle cx="64" cy="36" r="2.2" fill="hsl(0, 0%, 100%)"/>
     <circle cx="48" cy="14" r="1.3" fill="hsl(50, 100%, 92%)"/>`,
    'hsla(206, 84%, 82%, 0.28)',
    `<radialGradient id="ca-empty_mind-void" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(50, 100%, 96%, 0.45)"/><stop offset="62%" stop-color="hsla(214, 72%, 74%, 0.16)"/><stop offset="100%" stop-color="hsla(236, 54%, 14%, 0)"/></radialGradient><linearGradient id="ca-empty_mind-enso" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 92%)"/><stop offset="55%" stop-color="hsl(210, 62%, 82%)"/><stop offset="100%" stop-color="hsla(44, 88%, 68%, 0.35)"/></linearGradient>`
  ),
  inner_peace: wrapArtSvg(
    'inner_peace',
    'hsl(206, 64%, 20%)',
    'hsl(244, 56%, 10%)',
    `<rect x="0" y="38" width="128" height="34" fill="url(#ca-inner_peace-water)"/>
     <circle cx="64" cy="34" r="26" fill="url(#ca-inner_peace-core)" opacity="0.58"/>
     <path d="M0 39 Q24 27 48 36 Q78 24 108 35 Q118 32 128 36 V40 H0 Z" fill="hsla(238, 52%, 14%, 0.72)"/>
     <ellipse cx="64" cy="54" rx="48" ry="11" fill="none" stroke="hsla(190, 100%, 78%, 0.35)" stroke-width="1.3"/>
     <ellipse cx="64" cy="52" rx="34" ry="8" fill="none" stroke="hsla(190, 100%, 82%, 0.62)" stroke-width="1.5"/>
     <ellipse cx="64" cy="50" rx="20" ry="4.8" fill="hsla(190, 100%, 80%, 0.24)" stroke="hsl(188, 100%, 88%)" stroke-width="1.3"/>
     <path d="M46 58 Q64 66 82 58 Q64 62 46 58 Z" fill="hsla(292, 82%, 72%, 0.28)"/>
     <path d="M64 46 Q42 46 34 36 Q48 34 64 44 Z" fill="url(#ca-inner_peace-petal)" stroke="hsl(190, 100%, 86%)" stroke-width="1"/>
     <path d="M64 46 Q86 46 94 36 Q80 34 64 44 Z" fill="url(#ca-inner_peace-petal)" stroke="hsl(190, 100%, 86%)" stroke-width="1"/>
     <path d="M64 46 Q48 34 46 21 Q58 26 64 42 Z" fill="url(#ca-inner_peace-petal)" stroke="hsl(50, 100%, 90%)" stroke-width="1"/>
     <path d="M64 46 Q80 34 82 21 Q70 26 64 42 Z" fill="url(#ca-inner_peace-petal)" stroke="hsl(50, 100%, 90%)" stroke-width="1"/>
     <path d="M64 14 Q74 28 64 46 Q54 28 64 14 Z" fill="hsl(52, 100%, 92%)" stroke="hsl(46, 94%, 64%)" stroke-width="1.2"/>
     <circle cx="64" cy="34" r="3.4" fill="hsl(48, 100%, 74%)"/>
     <circle cx="32" cy="18" r="1.6" fill="hsl(190, 100%, 88%)"/>
     <circle cx="96" cy="16" r="1.8" fill="hsl(50, 100%, 90%)"/>
     <circle cx="22" cy="48" r="1.4" fill="hsl(190, 100%, 84%)"/>
     <circle cx="106" cy="48" r="1.4" fill="hsl(190, 100%, 84%)"/>`,
    'hsla(190, 98%, 64%, 0.32)',
    `<linearGradient id="ca-inner_peace-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(202, 76%, 28%)"/><stop offset="100%" stop-color="hsl(242, 62%, 10%)"/></linearGradient><linearGradient id="ca-inner_peace-petal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 96%)"/><stop offset="55%" stop-color="hsl(296, 84%, 78%)"/><stop offset="100%" stop-color="hsl(194, 92%, 58%)"/></linearGradient><radialGradient id="ca-inner_peace-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(50, 100%, 92%)"/><stop offset="100%" stop-color="hsla(190, 100%, 66%, 0)"/></radialGradient>`
  ),
  pray: wrapArtSvg(
    'pray',
    'hsl(268, 56%, 20%)',
    'hsl(40, 54%, 11%)',
    `<polygon points="44,0 84,0 104,72 24,72" fill="url(#ca-pray-beam)"/>
     <circle cx="64" cy="20" r="14" fill="hsla(48, 100%, 82%, 0.28)" stroke="hsla(50, 100%, 88%, 0.62)" stroke-width="1.2"/>
     <path d="M64 8 L67 17 L76 20 L67 23 L64 32 L61 23 L52 20 L61 17 Z" fill="hsl(52, 100%, 94%)"/>
     <path d="M44 68 L52 44 Q55 30 63 24 L64 56 L50 68 Z" fill="url(#ca-pray-hand)" stroke="hsl(32, 68%, 24%)" stroke-width="1.2"/>
     <path d="M84 68 L76 44 Q73 30 65 24 L64 56 L78 68 Z" fill="url(#ca-pray-hand)" stroke="hsl(32, 68%, 24%)" stroke-width="1.2"/>
     <line x1="64" y1="25" x2="64" y2="56" stroke="hsl(52, 100%, 96%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M51 54 Q64 68 77 54" fill="none" stroke="hsl(44, 96%, 64%)" stroke-width="1.8" stroke-dasharray="1 4.2" stroke-linecap="round"/>
     <circle cx="53" cy="56" r="2.2" fill="hsl(46, 98%, 74%)" stroke="hsl(28, 70%, 26%)" stroke-width="0.8"/>
     <circle cx="64" cy="61" r="2.5" fill="hsl(48, 100%, 82%)" stroke="hsl(28, 70%, 26%)" stroke-width="0.8"/>
     <circle cx="75" cy="56" r="2.2" fill="hsl(46, 98%, 74%)" stroke="hsl(28, 70%, 26%)" stroke-width="0.8"/>
     <path d="M22 60 Q28 44 20 30 Q14 20 24 10" fill="none" stroke="hsla(292, 80%, 80%, 0.42)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M106 60 Q100 44 108 30 Q114 20 104 10" fill="none" stroke="hsla(292, 80%, 80%, 0.42)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="38" cy="28" r="1.7" fill="hsl(48, 100%, 86%)"/>
     <circle cx="90" cy="28" r="1.7" fill="hsl(48, 100%, 86%)"/>
     <circle cx="44" cy="46" r="1.3" fill="hsl(50, 100%, 90%)"/>
     <circle cx="84" cy="46" r="1.3" fill="hsl(50, 100%, 90%)"/>`,
    'hsla(46, 98%, 66%, 0.32)',
    `<linearGradient id="ca-pray-beam" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="hsla(50, 100%, 88%, 0.65)"/><stop offset="65%" stop-color="hsla(44, 98%, 62%, 0.24)"/><stop offset="100%" stop-color="hsla(276, 62%, 22%, 0)"/></linearGradient><linearGradient id="ca-pray-hand" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 90%)"/><stop offset="55%" stop-color="hsl(42, 86%, 64%)"/><stop offset="100%" stop-color="hsl(276, 56%, 32%)"/></linearGradient>`
  ),
  simmering_fury: wrapArtSvg(
    'simmering_fury',
    'hsl(330, 62%, 19%)',
    'hsl(14, 62%, 10%)',
    `<circle cx="64" cy="44" r="34" fill="url(#ca-simmering_fury-magma)"/>
     <path d="M0 60 H128 V72 H0 Z" fill="hsla(292, 46%, 9%, 0.85)"/>
     <path d="M40 42 Q34 22 48 12 Q46 24 54 32 Q60 12 68 8 Q68 24 76 32 Q84 18 90 14 Q92 28 84 42 Z" fill="url(#ca-simmering_fury-flame)" opacity="0.88"/>
     <path d="M52 40 Q56 26 64 16 Q72 26 74 40 Z" fill="hsl(48, 100%, 84%)" opacity="0.82"/>
     <path d="M36 40 H92 L84 62 Q64 68 44 62 Z" fill="url(#ca-simmering_fury-vessel)" stroke="hsl(22, 86%, 54%)" stroke-width="1.5"/>
     <ellipse cx="64" cy="40" rx="28" ry="5" fill="hsl(18, 100%, 58%)" stroke="hsl(46, 100%, 80%)" stroke-width="1.2"/>
     <path d="M48 45 L56 54 L52 62 M78 44 L71 53 L75 61 M63 45 L65 56" fill="none" stroke="hsl(46, 100%, 78%)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M24 38 Q30 26 24 14 M104 38 Q98 26 104 14" fill="none" stroke="hsla(344, 96%, 62%, 0.62)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="34" cy="22" r="2.1" fill="hsl(44, 100%, 76%)"/>
     <circle cx="94" cy="20" r="2.2" fill="hsl(16, 100%, 66%)"/>
     <circle cx="64" cy="28" r="2.4" fill="hsl(52, 100%, 92%)"/>
     <circle cx="42" cy="12" r="1.4" fill="hsl(344, 100%, 70%)"/>
     <circle cx="84" cy="10" r="1.5" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(12, 98%, 56%, 0.34)',
    `<radialGradient id="ca-simmering_fury-magma" cx="50%" cy="62%" r="52%"><stop offset="0%" stop-color="hsl(48, 100%, 84%)"/><stop offset="45%" stop-color="hsl(14, 100%, 56%)"/><stop offset="80%" stop-color="hsla(342, 96%, 44%, 0.42)"/><stop offset="100%" stop-color="hsla(292, 60%, 14%, 0)"/></radialGradient><linearGradient id="ca-simmering_fury-vessel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(288, 34%, 26%)"/><stop offset="100%" stop-color="hsl(276, 42%, 11%)"/></linearGradient><linearGradient id="ca-simmering_fury-flame" x1="0.5" y1="1" x2="0.5" y2="0"><stop offset="0%" stop-color="hsl(48, 100%, 82%)"/><stop offset="45%" stop-color="hsl(14, 100%, 56%)"/><stop offset="100%" stop-color="hsl(336, 98%, 54%)"/></linearGradient>`
  ),
  worship: wrapArtSvg(
    'worship',
    'hsl(276, 56%, 21%)',
    'hsl(42, 60%, 12%)',
    `<circle cx="64" cy="29" r="33" fill="url(#ca-worship-halo)"/>
     <path d="M64 29 L14 6 M64 29 L114 6 M64 29 L6 32 M64 29 L122 32" stroke="hsla(48, 100%, 82%, 0.28)" stroke-width="2.4"/>
     <rect x="14" y="10" width="9" height="58" fill="hsla(272, 48%, 14%, 0.72)" stroke="hsla(44, 78%, 60%, 0.35)" stroke-width="1"/>
     <rect x="105" y="10" width="9" height="58" fill="hsla(272, 48%, 14%, 0.72)" stroke="hsla(44, 78%, 60%, 0.35)" stroke-width="1"/>
     <circle cx="64" cy="28" r="16" fill="none" stroke="url(#ca-worship-gold)" stroke-width="2.2"/>
     <polygon points="64,7 68,22 83,28 68,34 64,49 60,34 45,28 60,22" fill="url(#ca-worship-gold)" stroke="hsl(52, 100%, 92%)" stroke-width="1"/>
     <circle cx="64" cy="28" r="6" fill="hsl(52, 100%, 94%)" stroke="hsl(286, 78%, 54%)" stroke-width="1.3"/>
     <path d="M32 66 L38 56 H90 L96 66 Z" fill="hsl(274, 48%, 22%)" stroke="url(#ca-worship-gold)" stroke-width="1.4"/>
     <rect x="44" y="49" width="40" height="7" rx="1.5" fill="url(#ca-worship-gold)" stroke="hsl(28, 70%, 26%)" stroke-width="1"/>
     <path d="M35 55 Q31 46 37 40 Q42 47 38 55 Z" fill="hsl(42, 100%, 72%)"/>
     <path d="M93 55 Q89 46 95 40 Q100 47 96 55 Z" fill="hsl(42, 100%, 72%)"/>
     <circle cx="44" cy="18" r="1.8" fill="hsl(52, 100%, 92%)"/>
     <circle cx="84" cy="18" r="1.8" fill="hsl(52, 100%, 92%)"/>
     <circle cx="34" cy="34" r="1.5" fill="hsl(48, 100%, 86%)"/>
     <circle cx="94" cy="34" r="1.5" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(46, 100%, 66%, 0.34)',
    `<radialGradient id="ca-worship-halo" cx="50%" cy="38%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="45%" stop-color="hsla(44, 100%, 62%, 0.52)"/><stop offset="100%" stop-color="hsla(276, 68%, 24%, 0)"/></radialGradient><linearGradient id="ca-worship-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 88%)"/><stop offset="50%" stop-color="hsl(42, 94%, 56%)"/><stop offset="100%" stop-color="hsl(28, 76%, 30%)"/></linearGradient>`
  ),
  fasting: wrapArtSvg(
    'fasting',
    'hsl(264, 48%, 18%)',
    'hsl(28, 52%, 10%)',
    `<polygon points="40,0 88,0 100,66 28,66" fill="hsla(44, 92%, 68%, 0.14)"/>
     <path d="M10 56 H118 L128 72 H0 Z" fill="hsla(258, 42%, 13%, 0.82)"/>
     <ellipse cx="64" cy="60" rx="28" ry="4.5" fill="hsla(260, 62%, 5%, 0.65)"/>
     <path d="M58 42 C46 28 52 16 64 8 C60 18 68 26 62 42 Z" fill="url(#ca-fasting-str)" opacity="0.9"/>
     <path d="M70 42 C82 28 76 16 64 8 C68 18 60 26 66 42 Z" fill="url(#ca-fasting-dex)" opacity="0.88"/>
     <path d="M36 40 H92 C92 54 79 61 64 61 C49 61 36 54 36 40 Z" fill="url(#ca-fasting-bowl)" stroke="hsl(44, 92%, 68%)" stroke-width="1.6"/>
     <ellipse cx="64" cy="40" rx="28" ry="5.2" fill="hsl(268, 46%, 14%)" stroke="hsl(48, 98%, 78%)" stroke-width="1.4"/>
     <path d="M42 46 Q52 55 68 56" fill="none" stroke="hsla(48, 100%, 84%, 0.55)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="104" cy="24" r="8" fill="hsla(266, 38%, 22%, 0.55)" stroke="hsla(44, 62%, 58%, 0.45)" stroke-width="1.2" stroke-dasharray="3 2"/>
     <path d="M100 20 L108 28 M108 20 L100 28" stroke="hsla(348, 84%, 64%, 0.65)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="46" cy="22" r="1.8" fill="hsl(22, 100%, 68%)"/>
     <circle cx="82" cy="22" r="1.8" fill="hsl(188, 100%, 78%)"/>
     <circle cx="64" cy="14" r="2.2" fill="hsl(52, 100%, 92%)"/>
     <circle cx="24" cy="34" r="1.4" fill="hsl(46, 98%, 78%)"/>`,
    'hsla(40, 96%, 60%, 0.28)',
    `<linearGradient id="ca-fasting-bowl" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(36, 56%, 44%)"/><stop offset="50%" stop-color="hsl(24, 52%, 22%)"/><stop offset="100%" stop-color="hsl(262, 48%, 12%)"/></linearGradient><linearGradient id="ca-fasting-str" x1="0.5" y1="1" x2="0.5" y2="0"><stop offset="0%" stop-color="hsl(48, 100%, 84%)"/><stop offset="55%" stop-color="hsl(18, 98%, 58%)"/><stop offset="100%" stop-color="hsl(344, 96%, 56%)"/></linearGradient><linearGradient id="ca-fasting-dex" x1="0.5" y1="1" x2="0.5" y2="0"><stop offset="0%" stop-color="hsl(50, 100%, 90%)"/><stop offset="55%" stop-color="hsl(188, 100%, 66%)"/><stop offset="100%" stop-color="hsl(276, 86%, 64%)"/></linearGradient>`
  ),
  foresight: wrapArtSvg(
    'foresight',
    'hsl(246, 58%, 20%)',
    'hsl(202, 58%, 10%)',
    `<path d="M0 64 Q24 52 46 58 Q74 48 98 58 Q114 52 128 60 V72 H0 Z" fill="hsla(246, 56%, 14%, 0.78)"/>
     <path d="M64 34 L16 14 M64 34 L112 14 M64 34 L118 44" stroke="hsla(190, 100%, 78%, 0.5)" stroke-width="1.6" stroke-dasharray="4 3"/>
     <circle cx="64" cy="34" r="24" fill="none" stroke="url(#ca-foresight-brass)" stroke-width="2"/>
     <ellipse cx="64" cy="34" rx="34" ry="12" transform="rotate(-18 64 34)" fill="none" stroke="url(#ca-foresight-brass)" stroke-width="1.6"/>
     <ellipse cx="64" cy="34" rx="34" ry="12" transform="rotate(18 64 34)" fill="none" stroke="hsla(192, 100%, 76%, 0.65)" stroke-width="1.3"/>
     <circle cx="64" cy="34" r="14" fill="url(#ca-foresight-lens)" stroke="hsl(48, 100%, 84%)" stroke-width="1.5"/>
     <path d="M53 34 Q64 25 75 34 Q64 43 53 34 Z" fill="hsl(258, 62%, 16%)" stroke="hsl(50, 100%, 88%)" stroke-width="1.1"/>
     <circle cx="64" cy="34" r="3.6" fill="hsl(190, 100%, 78%)"/>
     <circle cx="62" cy="32" r="1.4" fill="hsl(0, 0%, 100%)"/>
     <polygon points="18,14 22,10 26,14 22,18" fill="hsl(50, 100%, 88%)"/>
     <polygon points="106,14 110,10 114,14 110,18" fill="hsl(190, 100%, 86%)"/>
     <polygon points="112,44 116,40 120,44 116,48" fill="hsl(48, 100%, 86%)"/>
     <circle cx="24" cy="48" r="1.6" fill="hsl(48, 100%, 84%)"/>
     <circle cx="88" cy="14" r="1.4" fill="hsl(190, 100%, 86%)"/>`,
    'hsla(196, 98%, 64%, 0.30)',
    `<linearGradient id="ca-foresight-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 86%)"/><stop offset="55%" stop-color="hsl(42, 90%, 56%)"/><stop offset="100%" stop-color="hsl(28, 70%, 34%)"/></linearGradient><radialGradient id="ca-foresight-lens" cx="44%" cy="40%" r="58%"><stop offset="0%" stop-color="hsl(188, 100%, 94%)"/><stop offset="48%" stop-color="hsl(196, 98%, 62%)"/><stop offset="100%" stop-color="hsl(268, 82%, 36%)"/></radialGradient>`
  ),
  like_water: wrapArtSvg(
    'like_water',
    'hsl(198, 66%, 20%)',
    'hsl(228, 56%, 10%)',
    `<path d="M0 54 Q64 46 128 54 V72 H0 Z" fill="hsla(216, 64%, 14%, 0.85)"/>
     <path d="M6 12 C28 14 34 38 62 34 C90 30 96 52 124 48" fill="none" stroke="hsla(190, 100%, 72%, 0.28)" stroke-width="14" stroke-linecap="round"/>
     <ellipse cx="44" cy="54" rx="22" ry="11" fill="url(#ca-like_water-stone)" stroke="hsl(192, 92%, 68%)" stroke-width="1.2"/>
     <ellipse cx="86" cy="57" rx="18" ry="9" fill="url(#ca-like_water-stone)" stroke="hsl(192, 92%, 68%)" stroke-width="1.1"/>
     <ellipse cx="64" cy="48" rx="13" ry="7" fill="url(#ca-like_water-stone)" stroke="hsl(188, 100%, 76%)" stroke-width="1.1"/>
     <path d="M4 14 C28 14 34 40 62 34 C92 28 96 54 124 46" fill="none" stroke="url(#ca-like_water-stream)" stroke-width="6.5" stroke-linecap="round"/>
     <path d="M4 26 C26 24 38 52 68 44 C94 37 102 62 124 58" fill="none" stroke="url(#ca-like_water-stream)" stroke-width="4.2" stroke-linecap="round" opacity="0.86"/>
     <path d="M12 13 C30 14 36 37 62 32 C88 27 96 50 118 45" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.5" stroke-linecap="round" opacity="0.85"/>
     <path d="M32 48 Q42 44 54 47" fill="none" stroke="hsla(188, 100%, 88%, 0.65)" stroke-width="1.4" stroke-linecap="round"/>
     <ellipse cx="64" cy="64" rx="34" ry="4" fill="none" stroke="hsla(188, 100%, 82%, 0.55)" stroke-width="1.2"/>
     <path d="M52 22 Q54 16 56 22 A2 2 0 1 1 52 22 Z" fill="hsl(188, 100%, 88%)"/>
     <path d="M98 28 Q100 22 102 28 A2 2 0 1 1 98 28 Z" fill="hsl(188, 100%, 88%)"/>
     <circle cx="24" cy="36" r="2" fill="hsl(0, 0%, 100%)" opacity="0.85"/>
     <circle cx="80" cy="24" r="1.6" fill="hsl(188, 100%, 86%)"/>
     <circle cx="110" cy="34" r="1.4" fill="hsl(48, 100%, 88%)"/>`,
    'hsla(188, 100%, 64%, 0.32)',
    `<linearGradient id="ca-like_water-stream" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(184, 100%, 88%)"/><stop offset="50%" stop-color="hsl(196, 98%, 58%)"/><stop offset="100%" stop-color="hsl(216, 88%, 40%)"/></linearGradient><radialGradient id="ca-like_water-stone" cx="38%" cy="32%" r="65%"><stop offset="0%" stop-color="hsl(220, 32%, 44%)"/><stop offset="60%" stop-color="hsl(232, 34%, 22%)"/><stop offset="100%" stop-color="hsl(240, 40%, 11%)"/></radialGradient>`
  ),
  nirvana: wrapArtSvg(
    'nirvana',
    'hsl(274, 58%, 22%)',
    'hsl(208, 56%, 11%)',
    `<circle cx="64" cy="32" r="34" fill="url(#ca-nirvana-aura)"/>
     <circle cx="64" cy="31" r="25" fill="none" stroke="hsla(48, 100%, 84%, 0.52)" stroke-width="1.4"/>
     <circle cx="64" cy="31" r="31" fill="none" stroke="hsla(192, 100%, 78%, 0.34)" stroke-width="1.2" stroke-dasharray="4 3"/>
     <path d="M0 64 Q18 48 38 56 Q56 46 74 56 Q96 46 116 56 Q122 52 128 58 V72 H0 Z" fill="url(#ca-nirvana-cloud)" stroke="hsla(48, 100%, 84%, 0.36)" stroke-width="1.1"/>
     <path d="M64 46 Q38 45 28 33 Q46 31 64 43 Z" fill="url(#ca-nirvana-petal)" stroke="hsl(48, 100%, 86%)" stroke-width="1.1"/>
     <path d="M64 46 Q90 45 100 33 Q82 31 64 43 Z" fill="url(#ca-nirvana-petal)" stroke="hsl(48, 100%, 86%)" stroke-width="1.1"/>
     <path d="M64 45 Q44 33 42 18 Q56 24 64 41 Z" fill="url(#ca-nirvana-petal)" stroke="hsl(52, 100%, 92%)" stroke-width="1.1"/>
     <path d="M64 45 Q84 33 86 18 Q72 24 64 41 Z" fill="url(#ca-nirvana-petal)" stroke="hsl(52, 100%, 92%)" stroke-width="1.1"/>
     <path d="M64 10 Q75 26 64 46 Q53 26 64 10 Z" fill="hsl(52, 100%, 94%)" stroke="hsl(44, 96%, 62%)" stroke-width="1.3"/>
     <polygon points="64,23 69,30 64,37 59,30" fill="hsl(48, 100%, 74%)" stroke="hsl(0, 0%, 100%)" stroke-width="0.9"/>
     <ellipse cx="26" cy="20" rx="3.4" ry="1.5" transform="rotate(-24 26 20)" fill="hsl(48, 100%, 86%)"/>
     <ellipse cx="102" cy="20" rx="3.4" ry="1.5" transform="rotate(24 102 20)" fill="hsl(48, 100%, 86%)"/>
     <circle cx="22" cy="40" r="1.8" fill="hsl(190, 100%, 84%)"/>
     <circle cx="106" cy="40" r="1.8" fill="hsl(190, 100%, 84%)"/>
     <circle cx="44" cy="12" r="1.5" fill="hsl(52, 100%, 92%)"/>
     <circle cx="84" cy="12" r="1.5" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(48, 100%, 72%, 0.34)',
    `<radialGradient id="ca-nirvana-aura" cx="50%" cy="42%" r="52%"><stop offset="0%" stop-color="hsl(52, 100%, 94%)"/><stop offset="46%" stop-color="hsla(46, 100%, 68%, 0.44)"/><stop offset="80%" stop-color="hsla(192, 98%, 62%, 0.22)"/><stop offset="100%" stop-color="hsla(272, 64%, 20%, 0)"/></radialGradient><linearGradient id="ca-nirvana-petal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 96%)"/><stop offset="55%" stop-color="hsl(304, 88%, 80%)"/><stop offset="100%" stop-color="hsl(276, 74%, 52%)"/></linearGradient><linearGradient id="ca-nirvana-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(268, 48%, 36%)"/><stop offset="100%" stop-color="hsl(238, 54%, 14%)"/></linearGradient>`
  ),
  rushdown: wrapArtSvg(
    'rushdown',
    'hsl(332, 64%, 20%)',
    'hsl(272, 56%, 10%)',
    `<circle cx="96" cy="20" r="22" fill="url(#ca-rushdown-moon)"/>
     <path d="M52 54 L88 26 L128 52 V72 H52 Z" fill="hsla(272, 48%, 16%, 0.58)"/>
     <path d="M0 16 L36 32 L68 48 L112 66 L128 72 H0 Z" fill="url(#ca-rushdown-ridge)" stroke="hsla(340, 88%, 62%, 0.45)" stroke-width="1.2"/>
     <path d="M12 8 L66 30 M24 6 L84 28 M6 22 L48 40" stroke="hsla(48, 100%, 80%, 0.52)" stroke-width="2" stroke-linecap="round"/>
     <path d="M22 22 Q44 10 68 20 Q84 26 96 36 L104 42 L94 46 L102 54 L86 48 L74 38 L52 36 L36 46 L26 42 L38 30 Q26 28 22 22 Z" fill="url(#ca-rushdown-tiger)" stroke="hsl(48, 100%, 84%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M36 18 Q54 14 78 26" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="1.4" stroke-linecap="round" opacity="0.82"/>
     <path d="M46 18 L52 26 M58 18 L62 28 M69 22 L71 31" stroke="hsl(276, 68%, 16%)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="88,34 95,36 90,39" fill="hsl(52, 100%, 92%)"/>
     <path d="M98 44 L112 52 M94 49 L106 58 M102 38 L116 44" stroke="hsl(48, 100%, 86%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M16 18 Q28 8 44 12" fill="none" stroke="hsl(344, 100%, 66%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M62 12 L78 18 L72 22 L92 28" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="108" cy="24" r="2" fill="hsl(48, 100%, 86%)"/>
     <circle cx="34" cy="54" r="1.8" fill="hsl(344, 100%, 70%)"/>
     <circle cx="114" cy="58" r="1.6" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(348, 98%, 60%, 0.34)',
    `<radialGradient id="ca-rushdown-moon" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(48, 100%, 84%, 0.55)"/><stop offset="60%" stop-color="hsla(344, 96%, 56%, 0.28)"/><stop offset="100%" stop-color="hsla(276, 60%, 16%, 0)"/></radialGradient><linearGradient id="ca-rushdown-tiger" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 82%)"/><stop offset="48%" stop-color="hsl(334, 96%, 56%)"/><stop offset="100%" stop-color="hsl(278, 72%, 28%)"/></linearGradient><linearGradient id="ca-rushdown-ridge" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(274, 52%, 24%)"/><stop offset="100%" stop-color="hsl(258, 56%, 10%)"/></linearGradient>`
  ),
  indignation: wrapArtSvg(
    'indignation',
    'hsl(344, 64%, 21%)',
    'hsl(276, 56%, 11%)',
    `<path d="M64 38 L10 8 M64 38 L118 8 M64 38 L6 42 M64 38 L122 42" stroke="hsla(44, 100%, 76%, 0.25)" stroke-width="2.6"/>
     <path d="M34 66 Q24 38 42 18 Q46 30 54 24 Q60 6 64 5 Q68 6 74 24 Q82 30 86 18 Q104 38 94 66 Z" fill="url(#ca-indignation-flame)" opacity="0.88"/>
     <path d="M44 64 Q40 42 54 28 Q60 18 64 14 Q68 18 74 28 Q88 42 84 64 Z" fill="hsl(48, 100%, 82%)" opacity="0.72"/>
     <path d="M40 68 L48 42 Q64 35 80 42 L88 68 Z" fill="url(#ca-indignation-figure)" stroke="hsl(46, 98%, 74%)" stroke-width="1.4"/>
     <circle cx="64" cy="31" r="8.5" fill="hsl(276, 56%, 18%)" stroke="hsl(48, 100%, 80%)" stroke-width="1.3"/>
     <path d="M58 29 L62 31 L59 33 Z M70 29 L66 31 L69 33 Z" fill="hsl(52, 100%, 94%)"/>
     <path d="M48 48 L64 42 L80 48" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M12 24 L28 30 L22 36 L38 42" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M116 24 L100 30 L106 36 L90 42" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="24" cy="54" r="2" fill="hsl(344, 100%, 68%)"/>
     <circle cx="104" cy="54" r="2" fill="hsl(344, 100%, 68%)"/>
     <circle cx="44" cy="14" r="1.6" fill="hsl(50, 100%, 90%)"/>
     <circle cx="84" cy="14" r="1.6" fill="hsl(50, 100%, 90%)"/>`,
    'hsla(14, 98%, 58%, 0.32)',
    `<linearGradient id="ca-indignation-flame" x1="0.5" y1="1" x2="0.5" y2="0"><stop offset="0%" stop-color="hsl(48, 100%, 86%)"/><stop offset="48%" stop-color="hsl(14, 100%, 56%)"/><stop offset="100%" stop-color="hsl(340, 96%, 50%)"/></linearGradient><linearGradient id="ca-indignation-figure" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(282, 58%, 34%)"/><stop offset="100%" stop-color="hsl(264, 58%, 13%)"/></linearGradient>`
  ),
  sanctity: wrapArtSvg(
    'sanctity',
    'hsl(212, 58%, 22%)',
    'hsl(258, 54%, 11%)',
    `<circle cx="64" cy="34" r="34" fill="url(#ca-sanctity-light)"/>
     <path d="M30 68 V34 C30 14 48 6 64 6 C80 6 98 14 98 34 V68 Z" fill="hsla(216, 62%, 18%, 0.52)" stroke="url(#ca-sanctity-arch)" stroke-width="2"/>
     <path d="M38 68 V35 C38 20 52 13 64 13 C76 13 90 20 90 35 V68" fill="none" stroke="hsla(50, 100%, 88%, 0.58)" stroke-width="1.2"/>
     <circle cx="64" cy="35" r="15" fill="none" stroke="hsl(48, 100%, 86%)" stroke-width="1.5" stroke-dasharray="5 3"/>
     <circle cx="64" cy="35" r="9.5" fill="url(#ca-sanctity-pearl)" stroke="hsl(48, 100%, 86%)" stroke-width="1.3"/>
     <path d="M64 18 L66.5 32.5 L81 35 L66.5 37.5 L64 52 L61.5 37.5 L47 35 L61.5 32.5 Z" fill="hsl(0, 0%, 100%)" opacity="0.9"/>
     <path d="M46 66 L52 57 H76 L82 66 Z" fill="hsl(236, 48%, 26%)" stroke="hsl(48, 96%, 80%)" stroke-width="1.2"/>
     <path d="M56 57 Q64 51 72 57" fill="none" stroke="hsl(190, 100%, 86%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M16 24 Q22 20 26 28 Q20 30 16 24 Z" fill="hsl(52, 100%, 92%)" opacity="0.82"/>
     <path d="M112 24 Q106 20 102 28 Q108 30 112 24 Z" fill="hsl(52, 100%, 92%)" opacity="0.82"/>
     <circle cx="20" cy="48" r="1.7" fill="hsl(190, 100%, 88%)"/>
     <circle cx="108" cy="48" r="1.7" fill="hsl(190, 100%, 88%)"/>
     <circle cx="48" cy="22" r="1.4" fill="hsl(0, 0%, 100%)"/>
     <circle cx="80" cy="22" r="1.4" fill="hsl(0, 0%, 100%)"/>`,
    'hsla(48, 100%, 78%, 0.32)',
    `<radialGradient id="ca-sanctity-light" cx="50%" cy="44%" r="52%"><stop offset="0%" stop-color="hsl(52, 100%, 96%)"/><stop offset="48%" stop-color="hsla(192, 100%, 80%, 0.42)"/><stop offset="100%" stop-color="hsla(246, 62%, 20%, 0)"/></radialGradient><linearGradient id="ca-sanctity-arch" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 88%)"/><stop offset="55%" stop-color="hsl(194, 92%, 74%)"/><stop offset="100%" stop-color="hsl(268, 56%, 36%)"/></linearGradient><radialGradient id="ca-sanctity-pearl" cx="40%" cy="34%" r="62%"><stop offset="0%" stop-color="hsl(0, 0%, 100%)"/><stop offset="55%" stop-color="hsl(48, 92%, 86%)"/><stop offset="100%" stop-color="hsl(198, 86%, 64%)"/></radialGradient>`
  ),
  windmill_strike: wrapArtSvg(
    'windmill_strike',
    'hsl(284, 58%, 21%)',
    'hsl(238, 56%, 10%)',
    `<circle cx="64" cy="36" r="30" fill="none" stroke="hsla(296, 92%, 68%, 0.25)" stroke-width="5" stroke-dasharray="12 6"/>
     <circle cx="64" cy="36" r="20" fill="none" stroke="hsla(48, 100%, 78%, 0.32)" stroke-width="2" stroke-dasharray="8 5"/>
     <path d="M64 36 Q66 12 94 10 Q80 26 64 36 Z" fill="url(#ca-windmill_strike-blade)" stroke="hsl(52, 100%, 92%)" stroke-width="1.2"/>
     <path d="M64 36 Q62 60 34 62 Q48 46 64 36 Z" fill="url(#ca-windmill_strike-blade)" stroke="hsl(52, 100%, 92%)" stroke-width="1.2"/>
     <path d="M64 36 Q38 34 36 8 Q54 20 64 36 Z" fill="url(#ca-windmill_strike-violet)" stroke="hsl(308, 100%, 84%)" stroke-width="1.1"/>
     <path d="M64 36 Q90 38 92 64 Q74 52 64 36 Z" fill="url(#ca-windmill_strike-violet)" stroke="hsl(308, 100%, 84%)" stroke-width="1.1"/>
     <line x1="22" y1="54" x2="106" y2="18" stroke="hsl(46, 96%, 72%)" stroke-width="3.2" stroke-linecap="round"/>
     <line x1="26" y1="52" x2="102" y2="20" stroke="hsl(0, 0%, 100%)" stroke-width="1.1" stroke-linecap="round" opacity="0.86"/>
     <circle cx="64" cy="36" r="6.5" fill="hsl(48, 100%, 88%)" stroke="hsl(288, 78%, 48%)" stroke-width="1.6"/>
     <circle cx="64" cy="36" r="2.5" fill="hsl(0, 0%, 100%)"/>
     <path d="M98 14 L112 10 M30 58 L16 62 M24 22 L14 14 M104 50 L114 58" stroke="hsl(48, 100%, 84%)" stroke-width="1.7" stroke-linecap="round"/>
     <circle cx="110" cy="24" r="1.9" fill="hsl(50, 100%, 90%)"/>
     <circle cx="18" cy="46" r="1.9" fill="hsl(308, 100%, 80%)"/>`,
    'hsla(46, 98%, 64%, 0.32)',
    `<linearGradient id="ca-windmill_strike-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="50%" stop-color="hsl(42, 98%, 62%)"/><stop offset="100%" stop-color="hsla(296, 92%, 58%, 0.2)"/></linearGradient><linearGradient id="ca-windmill_strike-violet" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(312, 100%, 76%)"/><stop offset="55%" stop-color="hsl(282, 86%, 54%)"/><stop offset="100%" stop-color="hsla(252, 76%, 32%, 0.18)"/></linearGradient>`
  ),
  reach_heaven: wrapArtSvg(
    'reach_heaven',
    'hsl(246, 56%, 19%)',
    'hsl(282, 54%, 11%)',
    `<polygon points="48,0 80,0 74,72 54,72" fill="hsla(46, 100%, 72%, 0.24)"/>
     <path d="M0 32 Q18 22 36 30 Q46 34 48 44 Q32 54 0 50 Z" fill="url(#ca-reach_heaven-cloud)" stroke="hsla(48, 96%, 78%, 0.45)" stroke-width="1.2"/>
     <path d="M128 32 Q110 22 92 30 Q82 34 80 44 Q96 54 128 50 Z" fill="url(#ca-reach_heaven-cloud)" stroke="hsla(48, 96%, 78%, 0.45)" stroke-width="1.2"/>
     <path d="M0 64 Q36 58 64 62 Q92 58 128 64 V72 H0 Z" fill="hsla(266, 54%, 11%, 0.85)"/>
     <polygon points="64,4 73,22 68,22 69,68 59,68 60,22 55,22" fill="url(#ca-reach_heaven-beam)" stroke="hsl(38, 92%, 44%)" stroke-width="1.1"/>
     <line x1="64" y1="8" x2="64" y2="66" stroke="hsl(0, 0%, 100%)" stroke-width="2.2" stroke-linecap="round"/>
     <ellipse cx="64" cy="40" rx="22" ry="5" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.6"/>
     <ellipse cx="64" cy="26" rx="14" ry="3.5" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="1.4"/>
     <path d="M42 28 L30 22 L34 15 M86 28 L98 22 L94 15" fill="none" stroke="hsl(304, 96%, 76%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M52 10 L56 14 M76 10 L72 14" stroke="hsl(52, 100%, 94%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="26" cy="12" r="1.8" fill="hsl(52, 100%, 92%)"/>
     <circle cx="102" cy="12" r="1.8" fill="hsl(52, 100%, 92%)"/>
     <circle cx="46" cy="54" r="1.7" fill="hsl(48, 100%, 84%)"/>
     <circle cx="82" cy="54" r="1.7" fill="hsl(48, 100%, 84%)"/>`,
    'hsla(46, 100%, 68%, 0.34)',
    `<linearGradient id="ca-reach_heaven-beam" x1="0.5" y1="1" x2="0.5" y2="0"><stop offset="0%" stop-color="hsl(38, 100%, 58%)"/><stop offset="55%" stop-color="hsl(48, 100%, 86%)"/><stop offset="100%" stop-color="hsl(0, 0%, 100%)"/></linearGradient><linearGradient id="ca-reach_heaven-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(256, 48%, 30%)"/><stop offset="100%" stop-color="hsl(248, 56%, 12%)"/></linearGradient>`
  ),
  wave_of_the_hand: wrapArtSvg(
    'wave_of_the_hand',
    'hsl(228, 54%, 20%)',
    'hsl(270, 54%, 11%)',
    `<path d="M42 18 Q70 8 92 22 T124 20" fill="none" stroke="hsla(192, 98%, 74%, 0.26)" stroke-width="9" stroke-linecap="round"/>
     <path d="M44 40 Q74 28 96 42 T124 40" fill="none" stroke="hsla(286, 86%, 70%, 0.26)" stroke-width="9" stroke-linecap="round"/>
     <path d="M46 18 Q72 8 92 22 T122 20" fill="none" stroke="url(#ca-wave_of_the_hand-wave)" stroke-width="3.6" stroke-linecap="round"/>
     <path d="M46 36 Q74 24 94 38 T122 36" fill="none" stroke="url(#ca-wave_of_the_hand-wave)" stroke-width="4.2" stroke-linecap="round"/>
     <path d="M44 54 Q72 44 92 56 T120 54" fill="none" stroke="url(#ca-wave_of_the_hand-wave)" stroke-width="3.4" stroke-linecap="round"/>
     <path d="M48 36 Q74 25 94 38 T120 36" fill="none" stroke="hsl(50, 100%, 90%)" stroke-width="1.1" stroke-linecap="round" opacity="0.82"/>
     <path d="M6 68 L14 34 Q22 26 36 30 L42 54 Q26 62 14 70 Z" fill="url(#ca-wave_of_the_hand-sleeve)" stroke="hsl(46, 94%, 74%)" stroke-width="1.4"/>
     <path d="M32 31 Q42 20 50 22 Q48 27 42 30 Q50 27 54 31 Q48 34 41 35 Q48 35 51 39 Q42 42 32 39 Z" fill="hsl(48, 96%, 86%)" stroke="hsl(274, 54%, 26%)" stroke-width="1.1"/>
     <path d="M16 42 Q26 36 36 44" fill="none" stroke="hsl(190, 100%, 82%)" stroke-width="1.3" opacity="0.72"/>
     <circle cx="88" cy="16" r="2.2" fill="hsl(190, 100%, 86%)"/>
     <circle cx="106" cy="30" r="2" fill="hsl(48, 100%, 86%)"/>
     <circle cx="84" cy="48" r="1.9" fill="hsl(296, 94%, 80%)"/>
     <circle cx="110" cy="54" r="1.5" fill="hsl(190, 100%, 84%)"/>`,
    'hsla(198, 94%, 64%, 0.28)',
    `<linearGradient id="ca-wave_of_the_hand-wave" x1="0" y1="0.5" x2="1" y2="0.5"><stop offset="0%" stop-color="hsl(188, 100%, 86%)"/><stop offset="55%" stop-color="hsl(278, 86%, 68%)"/><stop offset="100%" stop-color="hsla(202, 92%, 52%, 0.14)"/></linearGradient><linearGradient id="ca-wave_of_the_hand-sleeve" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(278, 62%, 38%)"/><stop offset="100%" stop-color="hsl(246, 58%, 16%)"/></linearGradient>`
  ),
  battle_hymn: wrapArtSvg(
    'battle_hymn',
    'hsl(276, 54%, 20%)',
    'hsl(32, 56%, 11%)',
    `<circle cx="60" cy="44" r="32" fill="url(#ca-battle_hymn-ring)"/>
     <circle cx="60" cy="44" r="24" fill="none" stroke="hsla(48, 100%, 80%, 0.42)" stroke-width="1.5" stroke-dasharray="7 4"/>
     <circle cx="60" cy="44" r="34" fill="none" stroke="hsla(296, 88%, 74%, 0.28)" stroke-width="1.2" stroke-dasharray="5 5"/>
     <rect x="10" y="7" width="108" height="6" rx="2" fill="hsl(344, 46%, 22%)" stroke="hsl(44, 92%, 64%)" stroke-width="1.1"/>
     <rect x="56" y="13" width="8" height="6" rx="1.5" fill="hsl(44, 92%, 60%)"/>
     <path d="M44 28 C44 19 52 17 60 17 C68 17 76 19 76 28 L83 54 H37 Z" fill="url(#ca-battle_hymn-bell)" stroke="hsl(30, 74%, 22%)" stroke-width="1.4"/>
     <ellipse cx="60" cy="54" rx="23" ry="4.6" fill="hsl(28, 62%, 16%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.3"/>
     <circle cx="60" cy="57" r="3.8" fill="hsl(48, 100%, 82%)" stroke="hsl(28, 70%, 24%)" stroke-width="1"/>
     <path d="M43 44 H77 M46 31 H74" stroke="hsl(48, 100%, 88%)" stroke-width="1.3" opacity="0.78"/>
     <path d="M49 23 Q46 36 43 48" fill="none" stroke="hsl(52, 100%, 94%)" stroke-width="1.6" stroke-linecap="round" opacity="0.72"/>
     <path d="M22 36 V24 L31 21 V33" fill="none" stroke="hsl(48, 100%, 86%)" stroke-width="1.7" stroke-linecap="round"/>
     <circle cx="20" cy="36" r="2.4" fill="hsl(48, 100%, 86%)"/>
     <circle cx="29" cy="33" r="2.4" fill="hsl(48, 100%, 86%)"/>
     <path d="M104 20 L108 38 L104 54 L100 38 Z" fill="hsl(50, 100%, 90%)" stroke="hsl(38, 96%, 54%)" stroke-width="1.1"/>
     <rect x="98" y="48" width="12" height="2.8" rx="1" fill="hsl(44, 96%, 64%)"/>
     <circle cx="94" cy="24" r="1.7" fill="hsl(296, 94%, 82%)"/>`,
    'hsla(44, 98%, 64%, 0.32)',
    `<linearGradient id="ca-battle_hymn-bell" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 84%)"/><stop offset="46%" stop-color="hsl(40, 88%, 52%)"/><stop offset="100%" stop-color="hsl(26, 72%, 24%)"/></linearGradient><radialGradient id="ca-battle_hymn-ring" cx="50%" cy="55%" r="50%"><stop offset="0%" stop-color="hsla(48, 100%, 84%, 0.5)"/><stop offset="100%" stop-color="hsla(40, 96%, 54%, 0)"/></radialGradient>`
  ),
  meditate: wrapArtSvg(
    'meditate',
    'hsl(216, 60%, 20%)',
    'hsl(264, 56%, 10%)',
    `<circle cx="64" cy="30" r="28" fill="url(#ca-meditate-halo)"/>
     <circle cx="64" cy="26" r="17" fill="none" stroke="hsl(190, 100%, 82%)" stroke-width="1.6"/>
     <ellipse cx="64" cy="61" rx="34" ry="5.5" fill="hsla(210, 82%, 44%, 0.24)" stroke="hsla(190, 100%, 80%, 0.55)" stroke-width="1.2"/>
     <ellipse cx="64" cy="40" rx="38" ry="12" transform="rotate(-12 64 40)" fill="none" stroke="hsla(46, 94%, 70%, 0.45)" stroke-width="1.2" stroke-dasharray="3 3"/>
     <circle cx="64" cy="21" r="6.2" fill="url(#ca-meditate-monk)" stroke="hsl(190, 100%, 84%)" stroke-width="1.2"/>
     <path d="M51 44 L56 30 Q64 26 72 30 L77 44 L88 51 Q76 56 64 55 Q52 56 40 51 Z" fill="url(#ca-meditate-monk)" stroke="hsl(190, 100%, 80%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M56 38 Q64 45 72 38" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="29" cy="46" r="3" fill="hsl(44, 98%, 68%)" stroke="hsl(28, 72%, 26%)" stroke-width="0.9"/>
     <circle cx="40" cy="34" r="2.6" fill="hsl(48, 100%, 78%)" stroke="hsl(28, 72%, 26%)" stroke-width="0.8"/>
     <circle cx="88" cy="46" r="2.6" fill="hsl(48, 100%, 78%)" stroke="hsl(28, 72%, 26%)" stroke-width="0.8"/>
     <circle cx="99" cy="34" r="3" fill="hsl(44, 98%, 68%)" stroke="hsl(28, 72%, 26%)" stroke-width="0.9"/>
     <circle cx="64" cy="51" r="2.8" fill="hsl(50, 100%, 86%)" stroke="hsl(28, 72%, 26%)" stroke-width="0.8"/>
     <circle cx="22" cy="20" r="1.6" fill="hsl(190, 100%, 86%)"/>
     <circle cx="106" cy="18" r="1.6" fill="hsl(190, 100%, 86%)"/>
     <circle cx="64" cy="10" r="1.8" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(192, 98%, 64%, 0.30)',
    `<radialGradient id="ca-meditate-halo" cx="50%" cy="38%" r="50%"><stop offset="0%" stop-color="hsla(190, 100%, 84%, 0.55)"/><stop offset="60%" stop-color="hsla(214, 90%, 54%, 0.2)"/><stop offset="100%" stop-color="hsla(262, 60%, 16%, 0)"/></radialGradient><linearGradient id="ca-meditate-monk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(274, 58%, 34%)"/><stop offset="100%" stop-color="hsl(248, 60%, 14%)"/></linearGradient>`
  ),
  perseverance: wrapArtSvg(
    'perseverance',
    'hsl(232, 50%, 19%)',
    'hsl(272, 50%, 10%)',
    `<path d="M6 12 L42 26 M4 28 L38 40 M8 44 L36 54 M90 14 L124 26 M92 34 L124 44" stroke="hsla(204, 84%, 74%, 0.42)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M0 62 L24 56 L104 56 L128 62 V72 H0 Z" fill="hsla(248, 46%, 10%, 0.86)"/>
     <polygon points="44,64 49,18 64,9 79,18 84,64" fill="url(#ca-perseverance-stone)" stroke="hsl(46, 94%, 72%)" stroke-width="1.7" stroke-linejoin="round"/>
     <polygon points="49,18 64,9 64,64 44,64" fill="hsla(0, 0%, 100%, 0.08)"/>
     <path d="M47 29 H81 M46 41 H82 M45 53 H83" stroke="url(#ca-perseverance-gold)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M64 17 Q70 24 64 33 Q58 24 64 17 Z" fill="hsl(48, 100%, 86%)" stroke="hsl(32, 74%, 36%)" stroke-width="0.9"/>
     <path d="M42 22 C36 32 36 46 42 56" fill="none" stroke="hsl(190, 100%, 80%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M86 22 C92 32 92 46 86 56" fill="none" stroke="hsl(190, 100%, 80%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M36 28 L26 22 M36 40 L24 44 M38 50 L28 56" stroke="hsl(48, 100%, 84%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="64" cy="24" r="2.2" fill="hsl(0, 0%, 100%)"/>
     <circle cx="96" cy="24" r="1.8" fill="hsl(48, 100%, 86%)"/>
     <circle cx="102" cy="50" r="1.6" fill="hsl(190, 100%, 82%)"/>
     <circle cx="24" cy="16" r="1.5" fill="hsl(192, 100%, 84%)"/>`,
    'hsla(42, 94%, 60%, 0.28)',
    `<linearGradient id="ca-perseverance-stone" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(262, 34%, 38%)"/><stop offset="55%" stop-color="hsl(248, 38%, 22%)"/><stop offset="100%" stop-color="hsl(244, 44%, 11%)"/></linearGradient><linearGradient id="ca-perseverance-gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(48, 100%, 86%)"/><stop offset="50%" stop-color="hsl(42, 94%, 58%)"/><stop offset="100%" stop-color="hsl(192, 98%, 66%)"/></linearGradient>`
  ),
  swivel: wrapArtSvg(
    'swivel',
    'hsl(254, 56%, 20%)',
    'hsl(202, 58%, 10%)',
    `<ellipse cx="64" cy="60" rx="44" ry="7" fill="none" stroke="hsla(192, 98%, 74%, 0.32)" stroke-width="1.5" stroke-dasharray="8 4"/>
     <ellipse cx="64" cy="60" rx="26" ry="4.2" fill="hsla(246, 62%, 8%, 0.56)"/>
     <path d="M22 46 C20 22 46 12 72 16 C96 20 108 38 94 52 C80 64 46 62 34 52" fill="none" stroke="url(#ca-swivel-cloak)" stroke-width="6.5" stroke-linecap="round"/>
     <path d="M28 42 C30 22 54 18 76 24 C92 28 96 42 84 50 C72 58 48 56 42 48" fill="none" stroke="hsl(190, 100%, 80%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M56 58 L59 32 Q64 26 70 32 L73 58 Z" fill="hsl(264, 58%, 18%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.2"/>
     <circle cx="64" cy="21" r="5.2" fill="hsl(268, 54%, 20%)" stroke="hsl(190, 100%, 84%)" stroke-width="1.2"/>
     <path d="M30 20 A36 22 0 0 1 102 26" fill="none" stroke="url(#ca-swivel-gold)" stroke-width="3.2" stroke-linecap="round"/>
     <polygon points="104,27 94,20 96,31" fill="hsl(50, 100%, 90%)"/>
     <path d="M12 30 L24 34 L14 40" fill="none" stroke="hsl(190, 100%, 82%)" stroke-width="1.8" stroke-linecap="round"/>
     <polygon points="104,42 109,46 104,50 99,46" fill="hsl(48, 100%, 86%)"/>
     <circle cx="24" cy="18" r="1.8" fill="hsl(190, 100%, 84%)"/>
     <circle cx="110" cy="20" r="2.1" fill="hsl(50, 100%, 92%)"/>
     <circle cx="40" cy="60" r="1.5" fill="hsl(296, 92%, 78%)"/>`,
    'hsla(196, 96%, 64%, 0.30)',
    `<linearGradient id="ca-swivel-cloak" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(286, 86%, 66%)"/><stop offset="55%" stop-color="hsl(254, 72%, 44%)"/><stop offset="100%" stop-color="hsl(194, 96%, 56%)"/></linearGradient><linearGradient id="ca-swivel-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="55%" stop-color="hsl(44, 98%, 62%)"/><stop offset="100%" stop-color="hsla(36, 94%, 48%, 0.2)"/></linearGradient>`
  ),
};
