// Bespoke 16:9 SVG card illustrations for Defect cards (part C: 25 cards).
import { wrapArtSvg } from './wrap.js';

export const DEFECT_CARD_ART_C = {
  capacitor: wrapArtSvg(
    'capacitor',
    'hsl(214, 62%, 19%)',
    'hsl(226, 56%, 8%)',
    `<circle cx="64" cy="37" r="30" fill="url(#ca-capacitor-aura)" opacity="0.65"/>
     <ellipse cx="64" cy="37" rx="52" ry="23" fill="none" stroke="hsl(194, 90%, 62%)" stroke-width="0.9" stroke-dasharray="3 3" opacity="0.45"/>
     <ellipse cx="64" cy="39" rx="44" ry="18.5" fill="none" stroke="hsl(220, 62%, 8%)" stroke-width="4.2" opacity="0.6"/>
     <ellipse cx="64" cy="37" rx="44" ry="18.5" fill="none" stroke="url(#ca-capacitor-brass)" stroke-width="3"/>
     <ellipse cx="64" cy="37" rx="40.5" ry="15.5" fill="none" stroke="hsl(194, 96%, 72%)" stroke-width="0.9" opacity="0.65"/>
     <path d="M12 37 L17 34 M12 37 L17 40 M7 37 L12 34 M7 37 L12 40 M116 37 L111 34 M116 37 L111 40 M121 37 L116 34 M121 37 L116 40" fill="none" stroke="hsl(46, 98%, 74%)" stroke-width="1.3" stroke-linecap="round" opacity="0.85"/>
     <circle cx="64" cy="37" r="9" fill="hsl(218, 58%, 14%)" stroke="url(#ca-capacitor-brass)" stroke-width="1.6"/>
     <circle cx="64" cy="37" r="5" fill="url(#ca-capacitor-core)"/>
     <path d="M64 25 V29 M64 45 V49 M52 37 H56 M72 37 H76" stroke="hsl(192, 98%, 76%)" stroke-width="1.1" stroke-linecap="round"/>
     <g>
       <circle cx="42" cy="21" r="6.2" fill="url(#ca-capacitor-well)" stroke="url(#ca-capacitor-brass)" stroke-width="1.6"/>
       <circle cx="42" cy="21" r="3.6" fill="none" stroke="hsl(192, 100%, 76%)" stroke-width="0.8" stroke-dasharray="2 1.8"/>
       <circle cx="86" cy="21" r="6.2" fill="url(#ca-capacitor-well)" stroke="url(#ca-capacitor-brass)" stroke-width="1.6"/>
       <circle cx="86" cy="21" r="3.6" fill="none" stroke="hsl(192, 100%, 76%)" stroke-width="0.8" stroke-dasharray="2 1.8"/>
       <circle cx="21" cy="38" r="7.2" fill="url(#ca-capacitor-well)" stroke="url(#ca-capacitor-brass)" stroke-width="1.8"/>
       <circle cx="21" cy="38" r="4.3" fill="none" stroke="hsl(190, 100%, 82%)" stroke-width="0.9" stroke-dasharray="2.4 1.8"/>
       <path d="M18.5 38 L21 35.5 L23.5 38 L21 40.5 Z" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="0.8" opacity="0.75"/>
       <circle cx="107" cy="38" r="7.2" fill="url(#ca-capacitor-well)" stroke="url(#ca-capacitor-brass)" stroke-width="1.8"/>
       <circle cx="107" cy="38" r="4.3" fill="none" stroke="hsl(190, 100%, 82%)" stroke-width="0.9" stroke-dasharray="2.4 1.8"/>
       <path d="M104.5 38 L107 35.5 L109.5 38 L107 40.5 Z" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="0.8" opacity="0.75"/>
       <circle cx="43" cy="54" r="8" fill="url(#ca-capacitor-well)" stroke="url(#ca-capacitor-brass)" stroke-width="2"/>
       <circle cx="43" cy="54" r="4.8" fill="none" stroke="hsl(188, 100%, 86%)" stroke-width="1" stroke-dasharray="2.8 1.8"/>
       <path d="M40 54 H46 M43 51 V57" stroke="hsl(190, 100%, 86%)" stroke-width="0.9" opacity="0.85"/>
       <circle cx="85" cy="54" r="8" fill="url(#ca-capacitor-well)" stroke="url(#ca-capacitor-brass)" stroke-width="2"/>
       <circle cx="85" cy="54" r="4.8" fill="none" stroke="hsl(188, 100%, 86%)" stroke-width="1" stroke-dasharray="2.8 1.8"/>
       <path d="M82 54 H88 M85 51 V57" stroke="hsl(190, 100%, 86%)" stroke-width="0.9" opacity="0.85"/>
     </g>
     <path d="M51 54 Q64 58 77 54" fill="none" stroke="hsl(192, 100%, 78%)" stroke-width="1.2" opacity="0.7"/>
     <circle cx="64" cy="14" r="1.5" fill="hsl(48, 100%, 88%)"/>
     <circle cx="31" cy="13" r="1.2" fill="hsl(190, 100%, 82%)"/>
     <circle cx="97" cy="13" r="1.2" fill="hsl(190, 100%, 82%)"/>`,
    'hsla(194, 96%, 62%, 0.28)',
    `<radialGradient id="ca-capacitor-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(192, 100%, 78%)" stop-opacity="0.75"/><stop offset="55%" stop-color="hsl(206, 92%, 52%)" stop-opacity="0.25"/><stop offset="100%" stop-color="hsl(224, 64%, 14%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-capacitor-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 98%, 82%)"/><stop offset="48%" stop-color="hsl(38, 86%, 56%)"/><stop offset="100%" stop-color="hsl(204, 72%, 54%)"/></linearGradient><radialGradient id="ca-capacitor-well" cx="44%" cy="38%" r="60%"><stop offset="0%" stop-color="hsl(196, 86%, 34%)"/><stop offset="68%" stop-color="hsl(220, 68%, 14%)"/><stop offset="100%" stop-color="hsl(230, 68%, 8%)"/></radialGradient><radialGradient id="ca-capacitor-core" cx="42%" cy="38%" r="60%"><stop offset="0%" stop-color="hsl(52, 100%, 96%)"/><stop offset="52%" stop-color="hsl(192, 100%, 70%)"/><stop offset="100%" stop-color="hsl(214, 88%, 42%)"/></radialGradient>`
  ),
  defragment: wrapArtSvg(
    'defragment',
    'hsl(218, 60%, 19%)',
    'hsl(232, 54%, 8%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-defragment-glow)" opacity="0.75"/>
     <path d="M16 36 H112 M64 6 V66" stroke="hsl(194, 90%, 66%)" stroke-width="0.7" stroke-dasharray="2.5 2.5" opacity="0.45"/>
     <path d="M14 16 L46 28 M12 56 L46 44 M114 16 L82 28 M116 56 L82 44" stroke="hsl(190, 96%, 72%)" stroke-width="1" stroke-dasharray="3 2" opacity="0.58"/>
     <polygon points="10,14 19,10 23,18 14,22" fill="url(#ca-defragment-shard)" stroke="hsl(192, 100%, 84%)" stroke-width="0.9" opacity="0.78"/>
     <polygon points="106,11 116,15 112,23 102,19" fill="url(#ca-defragment-shard)" stroke="hsl(192, 100%, 84%)" stroke-width="0.9" opacity="0.78"/>
     <polygon points="13,52 22,49 25,58 16,61" fill="url(#ca-defragment-shard)" stroke="hsl(268, 92%, 82%)" stroke-width="0.9" opacity="0.72"/>
     <polygon points="105,49 115,52 111,61 101,57" fill="url(#ca-defragment-shard)" stroke="hsl(268, 92%, 82%)" stroke-width="0.9" opacity="0.72"/>
     <polygon points="27,31 35,28 38,37 30,40" fill="url(#ca-defragment-crystal)" stroke="hsl(190, 100%, 86%)" stroke-width="1" opacity="0.9"/>
     <polygon points="93,28 101,31 98,40 90,37" fill="url(#ca-defragment-crystal)" stroke="hsl(190, 100%, 86%)" stroke-width="1" opacity="0.9"/>
     <polygon points="64,11 88,36 64,61 40,36" fill="hsl(226, 62%, 10%)" opacity="0.6" transform="translate(2,2)"/>
     <g stroke="hsl(190, 100%, 88%)" stroke-width="1" stroke-linejoin="round">
       <polygon points="64,13 73,22 64,31 55,22" fill="url(#ca-defragment-crystal)"/>
       <polygon points="64,41 73,50 64,59 55,50" fill="url(#ca-defragment-crystal)"/>
       <polygon points="41,36 50,27 59,36 50,45" fill="url(#ca-defragment-crystal)"/>
       <polygon points="69,36 78,27 87,36 78,45" fill="url(#ca-defragment-crystal)"/>
     </g>
     <polygon points="64,23 77,36 64,49 51,36" fill="url(#ca-defragment-gold)" stroke="hsl(52, 100%, 94%)" stroke-width="1.4" stroke-linejoin="round"/>
     <polygon points="64,28 71,36 64,44 57,36" fill="hsl(54, 100%, 96%)" opacity="0.9"/>
     <path d="M51 22 L54 25 M77 22 L74 25 M51 50 L54 47 M77 50 L74 47" stroke="hsl(50, 100%, 88%)" stroke-width="1.3" stroke-linecap="round"/>
     <circle cx="64" cy="8" r="1.4" fill="hsl(50, 100%, 92%)"/>
     <circle cx="64" cy="64" r="1.4" fill="hsl(50, 100%, 92%)"/>
     <circle cx="34" cy="18" r="1.3" fill="hsl(190, 100%, 86%)"/>
     <circle cx="94" cy="54" r="1.3" fill="hsl(190, 100%, 86%)"/>`,
    'hsla(188, 96%, 64%, 0.28)',
    `<radialGradient id="ca-defragment-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(188, 100%, 82%)" stop-opacity="0.72"/><stop offset="55%" stop-color="hsl(210, 90%, 54%)" stop-opacity="0.24"/><stop offset="100%" stop-color="hsl(230, 60%, 12%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-defragment-crystal" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(184, 100%, 82%)"/><stop offset="55%" stop-color="hsl(204, 92%, 56%)"/><stop offset="100%" stop-color="hsl(224, 78%, 34%)"/></linearGradient><linearGradient id="ca-defragment-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="52%" stop-color="hsl(44, 98%, 64%)"/><stop offset="100%" stop-color="hsl(194, 92%, 60%)"/></linearGradient><linearGradient id="ca-defragment-shard" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(268, 90%, 74%)"/><stop offset="100%" stop-color="hsl(204, 88%, 50%)"/></linearGradient>`
  ),
  heatsinks: wrapArtSvg(
    'heatsinks',
    'hsl(216, 48%, 18%)',
    'hsl(18, 52%, 10%)',
    `<ellipse cx="64" cy="48" rx="48" ry="18" fill="url(#ca-heatsinks-heat)" opacity="0.65"/>
     <path d="M24 26 Q30 18 24 10 M40 24 Q46 15 40 7 M56 22 Q62 13 56 5 M72 22 Q78 13 72 5 M88 24 Q94 15 88 7 M104 26 Q110 18 104 10" fill="none" stroke="url(#ca-heatsinks-cool)" stroke-width="1.6" stroke-linecap="round" opacity="0.82"/>
     <path d="M32 28 Q37 21 32 14 M64 25 Q69 17 64 9 M96 28 Q101 21 96 14" fill="none" stroke="hsl(32, 100%, 68%)" stroke-width="1.3" stroke-linecap="round" opacity="0.72"/>
     <polygon points="16,56 112,56 118,64 10,64" fill="url(#ca-heatsinks-base)" stroke="hsl(194, 94%, 68%)" stroke-width="1.2" stroke-linejoin="round"/>
     <line x1="20" y1="60" x2="108" y2="60" stroke="hsl(190, 100%, 76%)" stroke-width="1.3" stroke-dasharray="6 4"/>
     <g stroke-linejoin="round">
       <path d="M22 56 L22 28 L29 24 L29 56 Z" fill="url(#ca-heatsinks-copper)" stroke="hsl(38, 96%, 76%)" stroke-width="1"/>
       <path d="M35 56 L35 25 L42 21 L42 56 Z" fill="url(#ca-heatsinks-copper)" stroke="hsl(38, 96%, 76%)" stroke-width="1"/>
       <path d="M48 56 L48 22 L55 18 L55 56 Z" fill="url(#ca-heatsinks-copper)" stroke="hsl(42, 100%, 82%)" stroke-width="1.1"/>
       <path d="M61 56 L61 20 L68 16 L68 56 Z" fill="url(#ca-heatsinks-copper)" stroke="hsl(44, 100%, 86%)" stroke-width="1.2"/>
       <path d="M74 56 L74 22 L81 18 L81 56 Z" fill="url(#ca-heatsinks-copper)" stroke="hsl(42, 100%, 82%)" stroke-width="1.1"/>
       <path d="M87 56 L87 25 L94 21 L94 56 Z" fill="url(#ca-heatsinks-copper)" stroke="hsl(38, 96%, 76%)" stroke-width="1"/>
       <path d="M100 56 L100 28 L107 24 L107 56 Z" fill="url(#ca-heatsinks-copper)" stroke="hsl(38, 96%, 76%)" stroke-width="1"/>
     </g>
     <path d="M31 54 V34 M44 54 V30 M57 54 V28 M70 54 V28 M83 54 V30 M96 54 V34" stroke="hsl(24, 100%, 66%)" stroke-width="2" stroke-linecap="round" opacity="0.72"/>
     <path d="M20 44 H108" stroke="hsl(192, 100%, 76%)" stroke-width="2" opacity="0.75"/>
     <path d="M20 44 H108" stroke="hsl(52, 100%, 92%)" stroke-width="0.8"/>
     <circle cx="38" cy="11" r="1.4" fill="hsl(190, 100%, 84%)"/>
     <circle cx="64" cy="7" r="1.6" fill="hsl(38, 100%, 84%)"/>
     <circle cx="91" cy="12" r="1.4" fill="hsl(190, 100%, 84%)"/>`,
    'hsla(26, 98%, 58%, 0.28)',
    `<radialGradient id="ca-heatsinks-heat" cx="50%" cy="62%" r="55%"><stop offset="0%" stop-color="hsl(26, 100%, 64%)" stop-opacity="0.85"/><stop offset="52%" stop-color="hsl(14, 94%, 48%)" stop-opacity="0.32"/><stop offset="100%" stop-color="hsl(216, 60%, 14%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-heatsinks-copper" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(192, 92%, 74%)"/><stop offset="32%" stop-color="hsl(34, 92%, 64%)"/><stop offset="72%" stop-color="hsl(22, 86%, 48%)"/><stop offset="100%" stop-color="hsl(14, 72%, 28%)"/></linearGradient><linearGradient id="ca-heatsinks-cool" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(28, 100%, 66%)"/><stop offset="50%" stop-color="hsl(194, 100%, 74%)"/><stop offset="100%" stop-color="hsl(186, 100%, 88%)" stop-opacity="0.15"/></linearGradient><linearGradient id="ca-heatsinks-base" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(216, 54%, 22%)"/><stop offset="50%" stop-color="hsl(204, 62%, 34%)"/><stop offset="100%" stop-color="hsl(216, 54%, 22%)"/></linearGradient>`
  ),
  hello_world: wrapArtSvg(
    'hello_world',
    'hsl(198, 64%, 18%)',
    'hsl(222, 58%, 8%)',
    `<circle cx="64" cy="36" r="36" fill="url(#ca-hello_world-glow)" opacity="0.72"/>
     <rect x="27" y="13" width="76" height="48" rx="7" fill="hsl(224, 62%, 7%)" opacity="0.68"/>
     <rect x="25" y="11" width="76" height="48" rx="7" fill="url(#ca-hello_world-frame)" stroke="hsl(44, 88%, 68%)" stroke-width="1.6"/>
     <rect x="30" y="16" width="66" height="38" rx="4" fill="url(#ca-hello_world-screen)" stroke="hsl(186, 98%, 74%)" stroke-width="1.2"/>
     <path d="M31 22 H95 M31 28 H95 M31 34 H95 M31 40 H95 M31 46 H95" stroke="hsl(178, 96%, 72%)" stroke-width="0.45" opacity="0.22"/>
     <path d="M36 22 L40 25 L36 28 M42 28 H47" fill="none" stroke="hsl(158, 100%, 76%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     <rect x="50" y="24" width="5" height="5" rx="1" fill="hsl(184, 100%, 88%)"/>
     <rect x="71" y="24" width="5" height="5" rx="1" fill="hsl(184, 100%, 88%)"/>
     <path d="M51 37 Q63 46 75 37" fill="none" stroke="hsl(50, 100%, 86%)" stroke-width="2.4" stroke-linecap="round"/>
     <rect x="57" y="45" width="4" height="3" fill="hsl(168, 100%, 74%)" opacity="0.85"/>
     <rect x="63" y="45" width="4" height="3" fill="hsl(188, 100%, 78%)" opacity="0.85"/>
     <rect x="69" y="45" width="4" height="3" fill="hsl(48, 100%, 80%)" opacity="0.85"/>
     <path d="M84 23 L87 20 M86 27 L91 25 M84 31 L88 32" stroke="hsl(48, 100%, 84%)" stroke-width="1.3" stroke-linecap="round"/>
     <rect x="54" y="59" width="18" height="4.5" rx="1.5" fill="url(#ca-hello_world-frame)" stroke="hsl(44, 86%, 64%)" stroke-width="0.9"/>
     <circle cx="95" cy="56" r="1.4" fill="hsl(148, 100%, 66%)"/>
     <g fill="hsl(182, 100%, 82%)">
       <rect x="12" y="16" width="3.2" height="3.2" rx="0.5"/>
       <rect x="16" y="48" width="2.8" height="2.8" rx="0.5" fill="hsl(48, 100%, 82%)"/>
       <rect x="110" y="18" width="3.5" height="3.5" rx="0.5" fill="hsl(48, 100%, 82%)"/>
       <rect x="113" y="44" width="3" height="3" rx="0.5" fill="hsl(158, 100%, 76%)"/>
     </g>
     <path d="M15 32 L17 36 L21 38 L17 40 L15 44 L13 40 L9 38 L13 36 Z M112 29 L113.5 32 L116.5 33.5 L113.5 35 L112 38 L110.5 35 L107.5 33.5 L110.5 32 Z" fill="hsl(52, 100%, 94%)"/>`,
    'hsla(176, 98%, 58%, 0.28)',
    `<radialGradient id="ca-hello_world-glow" cx="50%" cy="48%" r="52%"><stop offset="0%" stop-color="hsl(178, 100%, 74%)" stop-opacity="0.72"/><stop offset="56%" stop-color="hsl(198, 92%, 48%)" stop-opacity="0.24"/><stop offset="100%" stop-color="hsl(222, 60%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-hello_world-frame" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(210, 42%, 34%)"/><stop offset="55%" stop-color="hsl(216, 48%, 22%)"/><stop offset="100%" stop-color="hsl(224, 52%, 14%)"/></linearGradient><radialGradient id="ca-hello_world-screen" cx="48%" cy="42%" r="65%"><stop offset="0%" stop-color="hsl(182, 76%, 24%)"/><stop offset="72%" stop-color="hsl(198, 72%, 14%)"/><stop offset="100%" stop-color="hsl(214, 70%, 9%)"/></radialGradient>`
  ),
  loop: wrapArtSvg(
    'loop',
    'hsl(212, 64%, 19%)',
    'hsl(228, 58%, 8%)',
    `<circle cx="64" cy="36" r="30" fill="url(#ca-loop-aura)" opacity="0.75"/>
     <circle cx="64" cy="36" r="22" fill="none" stroke="hsl(190, 96%, 72%)" stroke-width="0.9" stroke-dasharray="3 3" opacity="0.5"/>
     <g transform="rotate(-18 64 36)">
       <path d="M22 36 A42 15 0 0 1 102 31" fill="none" stroke="url(#ca-loop-gold)" stroke-width="3.2" stroke-linecap="round"/>
       <polygon points="105,33 96,26 98,35" fill="hsl(50, 100%, 88%)"/>
       <path d="M106 36 A42 15 0 0 1 26 41" fill="none" stroke="url(#ca-loop-cyan)" stroke-width="3.2" stroke-linecap="round"/>
       <polygon points="23,39 32,46 30,37" fill="hsl(188, 100%, 88%)"/>
     </g>
     <g transform="rotate(18 64 36)">
       <path d="M26 36 A38 13 0 0 1 98 31" fill="none" stroke="url(#ca-loop-cyan)" stroke-width="2.2" stroke-linecap="round" opacity="0.88"/>
       <polygon points="101,33 93,27 95,35" fill="hsl(190, 100%, 90%)"/>
       <path d="M102 36 A38 13 0 0 1 30 41" fill="none" stroke="url(#ca-loop-gold)" stroke-width="2.2" stroke-linecap="round" opacity="0.88"/>
       <polygon points="27,39 35,45 33,37" fill="hsl(48, 100%, 88%)"/>
     </g>
     <circle cx="64" cy="36" r="14" fill="hsl(222, 66%, 10%)" opacity="0.55" transform="translate(1.5,1.5)"/>
     <circle cx="64" cy="36" r="13" fill="url(#ca-loop-orb)" stroke="hsl(50, 100%, 88%)" stroke-width="1.5"/>
     <circle cx="64" cy="36" r="7.5" fill="none" stroke="hsl(190, 100%, 92%)" stroke-width="1" opacity="0.75"/>
     <circle cx="59.5" cy="31.5" r="3.2" fill="hsl(54, 100%, 98%)" opacity="0.9"/>
     <circle cx="24" cy="22" r="1.7" fill="hsl(48, 100%, 88%)"/>
     <circle cx="104" cy="50" r="1.7" fill="hsl(188, 100%, 86%)"/>
     <circle cx="88" cy="14" r="1.4" fill="hsl(192, 100%, 84%)"/>
     <circle cx="40" cy="58" r="1.4" fill="hsl(46, 100%, 82%)"/>`,
    'hsla(46, 98%, 62%, 0.28)',
    `<radialGradient id="ca-loop-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(192, 100%, 82%)" stop-opacity="0.76"/><stop offset="52%" stop-color="hsl(46, 96%, 58%)" stop-opacity="0.26"/><stop offset="100%" stop-color="hsl(226, 62%, 12%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-loop-orb" cx="38%" cy="34%" r="62%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="38%" stop-color="hsl(188, 100%, 72%)"/><stop offset="76%" stop-color="hsl(210, 92%, 48%)"/><stop offset="100%" stop-color="hsl(232, 74%, 22%)"/></radialGradient><linearGradient id="ca-loop-gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(42, 92%, 52%)" stop-opacity="0.25"/><stop offset="55%" stop-color="hsl(46, 98%, 68%)"/><stop offset="100%" stop-color="hsl(54, 100%, 92%)"/></linearGradient><linearGradient id="ca-loop-cyan" x1="1" y1="0" x2="0" y2="0"><stop offset="0%" stop-color="hsl(206, 90%, 48%)" stop-opacity="0.25"/><stop offset="55%" stop-color="hsl(192, 100%, 66%)"/><stop offset="100%" stop-color="hsl(182, 100%, 92%)"/></linearGradient>`
  ),
  self_repair: wrapArtSvg(
    'self_repair',
    'hsl(184, 54%, 17%)',
    'hsl(212, 54%, 8%)',
    `<circle cx="58" cy="38" r="30" fill="url(#ca-self_repair-emerald)" opacity="0.68"/>
     <polygon points="34,16 82,16 94,38 82,60 34,60 22,38" fill="hsl(216, 56%, 8%)" opacity="0.68" transform="translate(2,2)"/>
     <polygon points="34,16 82,16 94,38 82,60 34,60 22,38" fill="url(#ca-self_repair-armor)" stroke="hsl(194, 72%, 58%)" stroke-width="1.5" stroke-linejoin="round"/>
     <circle cx="58" cy="38" r="14" fill="url(#ca-self_repair-core)" stroke="hsl(158, 96%, 72%)" stroke-width="1.4"/>
     <path d="M35 20 L48 31 L43 38 L58 43 L54 51 L71 58" fill="none" stroke="hsl(152, 100%, 76%)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.42"/>
     <path d="M35 20 L48 31 L43 38 L58 43 L54 51 L71 58" fill="none" stroke="hsl(156, 100%, 88%)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M39 27 L45 23 M42 35 L49 34 M49 44 L55 39 M56 52 L63 48" stroke="hsl(52, 100%, 92%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M116 14 L82 34" stroke="hsl(150, 100%, 72%)" stroke-width="3.6" opacity="0.32" stroke-linecap="round"/>
     <path d="M114 15 L63 39 M114 15 L53 45" stroke="hsl(154, 100%, 82%)" stroke-width="1.3" stroke-linecap="round"/>
     <g transform="translate(95,21) rotate(-32)">
       <rect x="-4" y="-3.5" width="26" height="7" rx="2" fill="url(#ca-self_repair-metal)" stroke="hsl(44, 92%, 74%)" stroke-width="1.1"/>
       <path d="M-3 -7 A8 8 0 1 0 -3 7 L-3 3 L-9 3 L-9 -3 L-3 -3 Z" fill="url(#ca-self_repair-metal)" stroke="hsl(44, 92%, 74%)" stroke-width="1.1" stroke-linejoin="round"/>
     </g>
     <path d="M14 48 H20 M17 45 V51 M102 50 H108 M105 47 V53 M25 14 H29 M27 12 V16" stroke="hsl(152, 100%, 76%)" stroke-width="1.7" stroke-linecap="round"/>
     <circle cx="48" cy="31" r="2.2" fill="hsl(152, 100%, 94%)"/>
     <circle cx="58" cy="43" r="2.5" fill="hsl(152, 100%, 96%)"/>
     <circle cx="88" cy="54" r="1.4" fill="hsl(164, 100%, 82%)"/>`,
    'hsla(152, 94%, 56%, 0.28)',
    `<radialGradient id="ca-self_repair-emerald" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(154, 100%, 74%)" stop-opacity="0.82"/><stop offset="56%" stop-color="hsl(168, 90%, 44%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(212, 60%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-self_repair-armor" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(208, 52%, 34%)"/><stop offset="55%" stop-color="hsl(216, 54%, 20%)"/><stop offset="100%" stop-color="hsl(224, 56%, 12%)"/></linearGradient><radialGradient id="ca-self_repair-core" cx="44%" cy="40%" r="58%"><stop offset="0%" stop-color="hsl(154, 100%, 92%)"/><stop offset="48%" stop-color="hsl(168, 94%, 56%)"/><stop offset="100%" stop-color="hsl(206, 78%, 24%)"/></radialGradient><linearGradient id="ca-self_repair-metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(48, 92%, 82%)"/><stop offset="55%" stop-color="hsl(36, 76%, 52%)"/><stop offset="100%" stop-color="hsl(214, 42%, 28%)"/></linearGradient>`
  ),
  static_discharge: wrapArtSvg(
    'static_discharge',
    'hsl(216, 66%, 19%)',
    'hsl(236, 60%, 8%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-static_discharge-flash)" opacity="0.88"/>
     <circle cx="64" cy="36" r="24" fill="none" stroke="hsl(190, 100%, 76%)" stroke-width="1.2" opacity="0.65"/>
     <circle cx="64" cy="36" r="33" fill="none" stroke="hsl(204, 96%, 64%)" stroke-width="0.9" stroke-dasharray="5 4" opacity="0.5"/>
     <g fill="url(#ca-static_discharge-plate)" stroke="hsl(192, 96%, 76%)" stroke-width="1.3" stroke-linejoin="round">
       <polygon points="36,12 60,12 56,28 42,29"/>
       <polygon points="68,12 92,12 86,29 72,28"/>
       <polygon points="22,25 41,31 41,42 21,47"/>
       <polygon points="106,25 87,31 87,42 107,47"/>
       <polygon points="40,44 56,44 58,60 34,58"/>
       <polygon points="72,44 88,44 94,58 70,60"/>
     </g>
     <path d="M64 36 L44 21 L32 23 L14 8 M64 36 L84 22 L97 19 L116 9 M64 36 L46 47 L28 49 L9 62 M64 36 L85 48 L101 51 L119 63 M64 36 L61 17 L66 5 M64 36 L67 54 L62 67" fill="none" stroke="url(#ca-static_discharge-bolt)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.45"/>
     <path d="M64 36 L44 21 L32 23 L14 8 M64 36 L84 22 L97 19 L116 9 M64 36 L46 47 L28 49 L9 62 M64 36 L85 48 L101 51 L119 63 M64 36 L61 17 L66 5 M64 36 L67 54 L62 67" fill="none" stroke="hsl(52, 100%, 96%)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
     <polygon points="64,26 73,36 64,46 55,36" fill="hsl(190, 100%, 94%)" stroke="hsl(48, 100%, 84%)" stroke-width="1.2"/>
     <circle cx="64" cy="36" r="4" fill="hsl(54, 100%, 98%)"/>
     <circle cx="24" cy="14" r="1.4" fill="hsl(52, 100%, 92%)"/>
     <circle cx="105" cy="16" r="1.5" fill="hsl(190, 100%, 88%)"/>
     <circle cx="18" cy="56" r="1.4" fill="hsl(190, 100%, 88%)"/>
     <circle cx="110" cy="56" r="1.5" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(192, 100%, 66%, 0.30)',
    `<radialGradient id="ca-static_discharge-flash" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="34%" stop-color="hsl(188, 100%, 72%)" stop-opacity="0.88"/><stop offset="72%" stop-color="hsl(214, 92%, 48%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(236, 62%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-static_discharge-plate" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(208, 56%, 38%)"/><stop offset="55%" stop-color="hsl(218, 58%, 22%)"/><stop offset="100%" stop-color="hsl(230, 60%, 12%)"/></linearGradient><linearGradient id="ca-static_discharge-bolt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(186, 100%, 84%)"/><stop offset="50%" stop-color="hsl(48, 100%, 76%)"/><stop offset="100%" stop-color="hsl(196, 100%, 72%)"/></linearGradient>`
  ),
  storm: wrapArtSvg(
    'storm',
    'hsl(222, 58%, 16%)',
    'hsl(238, 62%, 7%)',
    `<ellipse cx="64" cy="24" rx="58" ry="22" fill="url(#ca-storm-glow)" opacity="0.72"/>
     <path d="M12 64 L18 40 L24 64 Z M54 68 L64 26 L74 68 Z M102 65 L110 42 L117 65 Z" fill="url(#ca-storm-spire)" stroke="hsl(196, 86%, 64%)" stroke-width="1"/>
     <path d="M0 14 Q14 4 28 11 Q42 1 60 9 Q78 0 96 10 Q112 3 128 13 L128 29 Q114 35 100 28 Q84 36 66 29 Q48 36 30 28 Q14 35 0 27 Z" fill="url(#ca-storm-cloud)" stroke="hsl(196, 90%, 66%)" stroke-width="1.1"/>
     <path d="M8 22 Q24 14 40 21 Q58 12 78 21 Q98 13 118 22" fill="none" stroke="hsl(192, 100%, 82%)" stroke-width="1.1" opacity="0.65"/>
     <path d="M36 24 L29 36 L34 38 L22 52 M64 20 L58 34 L66 36 L64 46 M92 24 L98 35 L93 38 L108 50 M24 26 L46 31 L64 26 L84 31 L104 26" fill="none" stroke="url(#ca-storm-bolt)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.45"/>
     <path d="M36 24 L29 36 L34 38 L22 52 M64 20 L58 34 L66 36 L64 46 M92 24 L98 35 L93 38 L108 50 M24 26 L46 31 L64 26 L84 31 L104 26" fill="none" stroke="hsl(190, 100%, 96%)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="64" cy="27" r="4.5" fill="hsl(190, 100%, 88%)" opacity="0.85"/>
     <circle cx="18" cy="40" r="2.6" fill="hsl(190, 100%, 88%)"/>
     <circle cx="110" cy="42" r="2.6" fill="hsl(190, 100%, 88%)"/>
     <path d="M10 38 L6 48 M28 48 L24 58 M48 44 L44 54 M82 44 L78 54 M98 48 L94 58 M120 38 L116 48" stroke="hsl(198, 92%, 74%)" stroke-width="0.9" stroke-linecap="round" opacity="0.48"/>`,
    'hsla(198, 98%, 64%, 0.28)',
    `<radialGradient id="ca-storm-glow" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="hsl(194, 100%, 76%)" stop-opacity="0.72"/><stop offset="55%" stop-color="hsl(216, 88%, 48%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(236, 62%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-storm-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(228, 48%, 12%)"/><stop offset="68%" stop-color="hsl(224, 52%, 22%)"/><stop offset="100%" stop-color="hsl(204, 78%, 36%)"/></linearGradient><linearGradient id="ca-storm-bolt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="50%" stop-color="hsl(190, 100%, 74%)"/><stop offset="100%" stop-color="hsl(212, 96%, 58%)"/></linearGradient><linearGradient id="ca-storm-spire" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(198, 86%, 54%)"/><stop offset="50%" stop-color="hsl(222, 58%, 22%)"/><stop offset="100%" stop-color="hsl(236, 62%, 10%)"/></linearGradient>`
  ),
  all_for_one: wrapArtSvg(
    'all_for_one',
    'hsl(220, 66%, 19%)',
    'hsl(236, 60%, 8%)',
    `<circle cx="66" cy="36" r="32" fill="url(#ca-all_for_one-vortex)" opacity="0.82"/>
     <ellipse cx="66" cy="36" rx="44" ry="22" fill="none" stroke="hsl(192, 100%, 72%)" stroke-width="1.1" stroke-dasharray="6 4" opacity="0.58" transform="rotate(-14 66 36)"/>
     <ellipse cx="66" cy="36" rx="34" ry="16" fill="none" stroke="hsl(46, 98%, 74%)" stroke-width="1" stroke-dasharray="4 3" opacity="0.62" transform="rotate(16 66 36)"/>
     <path d="M12 16 Q38 18 56 32 M10 54 Q36 52 55 40 M116 14 Q92 18 76 31 M118 54 Q94 52 77 41" fill="none" stroke="hsl(190, 100%, 78%)" stroke-width="1.3" stroke-linecap="round" opacity="0.72"/>
     <g transform="translate(15,12) rotate(-24)">
       <rect x="0" y="0" width="13" height="17" rx="1.8" fill="url(#ca-all_for_one-card)" stroke="hsl(190, 100%, 86%)" stroke-width="1"/>
       <circle cx="3" cy="3" r="2.6" fill="hsl(48, 100%, 76%)" stroke="hsl(224, 62%, 14%)" stroke-width="0.6"/>
       <circle cx="3" cy="3" r="1" fill="hsl(224, 66%, 18%)"/>
     </g>
     <g transform="translate(13,46) rotate(20)">
       <rect x="0" y="0" width="13" height="17" rx="1.8" fill="url(#ca-all_for_one-card)" stroke="hsl(190, 100%, 86%)" stroke-width="1"/>
       <circle cx="3" cy="3" r="2.6" fill="hsl(48, 100%, 76%)" stroke="hsl(224, 62%, 14%)" stroke-width="0.6"/>
       <circle cx="3" cy="3" r="1" fill="hsl(224, 66%, 18%)"/>
     </g>
     <g transform="translate(101,10) rotate(22)">
       <rect x="0" y="0" width="13" height="17" rx="1.8" fill="url(#ca-all_for_one-card)" stroke="hsl(190, 100%, 86%)" stroke-width="1"/>
       <circle cx="3" cy="3" r="2.6" fill="hsl(48, 100%, 76%)" stroke="hsl(224, 62%, 14%)" stroke-width="0.6"/>
       <circle cx="3" cy="3" r="1" fill="hsl(224, 66%, 18%)"/>
     </g>
     <g transform="translate(99,45) rotate(-18)">
       <rect x="0" y="0" width="13" height="17" rx="1.8" fill="url(#ca-all_for_one-card)" stroke="hsl(190, 100%, 86%)" stroke-width="1"/>
       <circle cx="3" cy="3" r="2.6" fill="hsl(48, 100%, 76%)" stroke="hsl(224, 62%, 14%)" stroke-width="0.6"/>
       <circle cx="3" cy="3" r="1" fill="hsl(224, 66%, 18%)"/>
     </g>
     <path d="M51 34 L53 23 L60 22 L63 20 L71 21 L77 24 L80 35 L77 48 L72 56 L57 56 L52 46 Z" fill="hsl(228, 66%, 8%)" opacity="0.68" transform="translate(2,2)"/>
     <g stroke-linejoin="round">
       <path d="M52 34 L54 24 L60 24 L60 35 Z M60 22 L66 21 L66 34 L60 34 Z M66 22 L72 23 L72 35 L66 35 Z M72 25 L78 27 L77 37 L72 36 Z" fill="url(#ca-all_for_one-fist)" stroke="hsl(190, 100%, 82%)" stroke-width="1.1"/>
       <path d="M52 35 L78 36 L75 49 L71 57 L57 57 L53 47 Z" fill="url(#ca-all_for_one-fist)" stroke="url(#ca-all_for_one-gold)" stroke-width="1.3"/>
       <path d="M54 34 L66 34 L68 41 L55 41 Z" fill="url(#ca-all_for_one-gold)" stroke="hsl(52, 100%, 92%)" stroke-width="1"/>
     </g>
     <circle cx="65" cy="45" r="4" fill="hsl(188, 100%, 88%)"/>
     <circle cx="65" cy="45" r="1.8" fill="hsl(54, 100%, 98%)"/>
     <circle cx="42" cy="14" r="1.4" fill="hsl(48, 100%, 90%)"/>
     <circle cx="90" cy="58" r="1.5" fill="hsl(190, 100%, 88%)"/>`,
    'hsla(196, 100%, 64%, 0.32)',
    `<radialGradient id="ca-all_for_one-vortex" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(188, 100%, 84%)" stop-opacity="0.88"/><stop offset="48%" stop-color="hsl(210, 96%, 54%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(236, 64%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-all_for_one-fist" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(202, 74%, 48%)"/><stop offset="52%" stop-color="hsl(218, 66%, 26%)"/><stop offset="100%" stop-color="hsl(232, 62%, 14%)"/></linearGradient><linearGradient id="ca-all_for_one-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(194, 96%, 68%)"/><stop offset="100%" stop-color="hsl(224, 72%, 28%)"/></linearGradient><linearGradient id="ca-all_for_one-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 88%)"/><stop offset="58%" stop-color="hsl(42, 94%, 58%)"/><stop offset="100%" stop-color="hsl(30, 82%, 38%)"/></linearGradient>`
  ),
  core_surge: wrapArtSvg(
    'core_surge',
    'hsl(212, 62%, 18%)',
    'hsl(232, 58%, 8%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-core_surge-halo)" opacity="0.85"/>
     <path d="M64 2 V70 M24 36 H104 M38 10 L90 62 M90 10 L38 62" stroke="hsl(48, 100%, 84%)" stroke-width="1.2" opacity="0.45"/>
     <path d="M8 18 Q20 24 28 24 M120 18 Q108 24 100 24 M8 54 Q20 48 28 48 M120 54 Q108 48 100 48" fill="none" stroke="hsl(288, 72%, 52%)" stroke-width="2" stroke-linecap="round" opacity="0.58"/>
     <path d="M27 21 L32 24 L27 27 M101 21 L96 24 L101 27 M27 45 L32 48 L27 51 M101 45 L96 48 L101 51" fill="none" stroke="hsl(50, 100%, 86%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="64" cy="36" r="28" fill="none" stroke="url(#ca-core_surge-gold)" stroke-width="2.2"/>
     <circle cx="64" cy="36" r="23.5" fill="none" stroke="hsl(190, 100%, 78%)" stroke-width="1.1" stroke-dasharray="6 3"/>
     <g fill="url(#ca-core_surge-gold)" stroke="hsl(54, 100%, 94%)" stroke-width="0.9">
       <polygon points="64,4 68,11 64,15 60,11"/>
       <polygon points="64,68 68,61 64,57 60,61"/>
       <polygon points="32,36 39,32 43,36 39,40"/>
       <polygon points="96,36 89,32 85,36 89,40"/>
     </g>
     <polygon points="54,20 74,20 82,36 74,52 54,52 46,36" fill="url(#ca-core_surge-housing)" stroke="url(#ca-core_surge-gold)" stroke-width="1.8" stroke-linejoin="round"/>
     <circle cx="64" cy="36" r="12" fill="url(#ca-core_surge-core)" stroke="hsl(54, 100%, 96%)" stroke-width="1.5"/>
     <polygon points="64,27 68,36 64,45 60,36" fill="hsl(54, 100%, 98%)" opacity="0.92"/>
     <circle cx="20" cy="36" r="1.5" fill="hsl(48, 100%, 88%)"/>
     <circle cx="108" cy="36" r="1.5" fill="hsl(48, 100%, 88%)"/>`,
    'hsla(46, 100%, 64%, 0.32)',
    `<radialGradient id="ca-core_surge-halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 94%)" stop-opacity="0.9"/><stop offset="44%" stop-color="hsl(46, 100%, 64%)" stop-opacity="0.4"/><stop offset="76%" stop-color="hsl(192, 98%, 60%)" stop-opacity="0.18"/><stop offset="100%" stop-color="hsl(232, 60%, 10%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-core_surge-core" cx="44%" cy="40%" r="58%"><stop offset="0%" stop-color="hsl(54, 100%, 98%)"/><stop offset="44%" stop-color="hsl(48, 100%, 74%)"/><stop offset="82%" stop-color="hsl(190, 100%, 62%)"/><stop offset="100%" stop-color="hsl(214, 88%, 38%)"/></radialGradient><linearGradient id="ca-core_surge-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 92%)"/><stop offset="52%" stop-color="hsl(44, 98%, 62%)"/><stop offset="100%" stop-color="hsl(32, 86%, 40%)"/></linearGradient><linearGradient id="ca-core_surge-housing" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(206, 56%, 34%)"/><stop offset="100%" stop-color="hsl(226, 58%, 14%)"/></linearGradient>`
  ),
  hyperbeam: wrapArtSvg(
    'hyperbeam',
    'hsl(214, 70%, 16%)',
    'hsl(230, 68%, 6%)',
    `<rect x="18" y="8" width="110" height="56" fill="url(#ca-hyperbeam-outer)" opacity="0.72"/>
     <polygon points="22,26 128,12 128,60 22,46" fill="url(#ca-hyperbeam-beam)" opacity="0.9"/>
     <polygon points="24,31 128,23 128,49 24,41" fill="hsl(188, 100%, 88%)" opacity="0.92"/>
     <polygon points="26,34 128,31 128,41 26,38" fill="hsl(60, 100%, 98%)"/>
     <ellipse cx="44" cy="36" rx="5.5" ry="18" fill="none" stroke="hsl(190, 100%, 88%)" stroke-width="2" opacity="0.88"/>
     <ellipse cx="72" cy="36" rx="7" ry="24" fill="none" stroke="hsl(192, 100%, 84%)" stroke-width="1.8" opacity="0.78"/>
     <ellipse cx="104" cy="36" rx="8.5" ry="30" fill="none" stroke="hsl(196, 100%, 80%)" stroke-width="1.5" opacity="0.62"/>
     <path d="M28 24 Q54 16 82 28 T126 18 M28 48 Q58 58 88 44 T126 54" fill="none" stroke="hsl(186, 100%, 92%)" stroke-width="1.5" stroke-linecap="round" opacity="0.82"/>
     <circle cx="24" cy="36" r="16" fill="url(#ca-hyperbeam-flare)"/>
     <path d="M0 18 L18 22 L24 27 L16 32 L16 40 L24 45 L18 50 L0 54 Z" fill="url(#ca-hyperbeam-cannon)" stroke="hsl(46, 94%, 72%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M6 25 L14 27 M6 47 L14 45" stroke="hsl(190, 100%, 82%)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="84,8 92,12 87,16 81,13" fill="hsl(214, 58%, 36%)" stroke="hsl(190, 100%, 84%)" stroke-width="0.9"/>
     <polygon points="108,61 117,57 120,64 111,67" fill="hsl(214, 58%, 36%)" stroke="hsl(190, 100%, 84%)" stroke-width="0.9"/>
     <polygon points="56,60 63,56 66,62 59,65" fill="hsl(192, 100%, 84%)" opacity="0.85"/>
     <circle cx="116" cy="10" r="1.6" fill="hsl(54, 100%, 96%)"/>
     <circle cx="64" cy="10" r="1.4" fill="hsl(190, 100%, 92%)"/>`,
    'hsla(190, 100%, 72%, 0.36)',
    `<linearGradient id="ca-hyperbeam-outer" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(206, 100%, 54%)" stop-opacity="0"/><stop offset="50%" stop-color="hsl(192, 100%, 66%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(206, 100%, 54%)" stop-opacity="0"/></linearGradient><linearGradient id="ca-hyperbeam-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(204, 100%, 56%)" stop-opacity="0.35"/><stop offset="50%" stop-color="hsl(188, 100%, 76%)"/><stop offset="100%" stop-color="hsl(204, 100%, 56%)" stop-opacity="0.35"/></linearGradient><radialGradient id="ca-hyperbeam-flare" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="48%" stop-color="hsl(188, 100%, 78%)" stop-opacity="0.8"/><stop offset="100%" stop-color="hsl(204, 96%, 54%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-hyperbeam-cannon" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(210, 56%, 36%)"/><stop offset="52%" stop-color="hsl(222, 58%, 20%)"/><stop offset="100%" stop-color="hsl(232, 62%, 11%)"/></linearGradient>`
  ),
  meteor_strike: wrapArtSvg(
    'meteor_strike',
    'hsl(236, 56%, 16%)',
    'hsl(14, 58%, 9%)',
    `<path d="M128 0 L52 36 L26 60 L64 62 L128 18 Z" fill="url(#ca-meteor_strike-wake)" opacity="0.72"/>
     <ellipse cx="32" cy="59" rx="28" ry="11" fill="url(#ca-meteor_strike-fire)" opacity="0.82"/>
     <ellipse cx="32" cy="60" rx="22" ry="6.5" fill="none" stroke="hsl(44, 100%, 82%)" stroke-width="1.3" opacity="0.78"/>
     <path d="M114 4 Q82 20 44 46 M124 14 Q92 32 52 54" fill="none" stroke="hsl(32, 100%, 72%)" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
     <path d="M22 48 L36 33 L54 35 L58 49 L44 60 L26 58 Z" fill="url(#ca-meteor_strike-rock)" stroke="hsl(36, 100%, 74%)" stroke-width="1.5" stroke-linejoin="round"/>
     <path d="M28 48 L38 40 L48 45 M34 55 L45 50" fill="none" stroke="hsl(46, 100%, 86%)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M18 54 Q26 42 40 32 Q25 49 26 62 Q42 62 56 50 Q42 66 20 63 Z" fill="hsl(42, 100%, 82%)" opacity="0.78"/>
     <g>
       <circle cx="72" cy="31" r="7.5" fill="url(#ca-meteor_strike-plasma)" stroke="hsl(182, 100%, 88%)" stroke-width="1.3"/>
       <path d="M72 25 L73.6 29.4 L78 31 L73.6 32.6 L72 37 L70.4 32.6 L66 31 L70.4 29.4 Z" fill="hsl(54, 100%, 98%)"/>
       <circle cx="94" cy="21" r="6.5" fill="url(#ca-meteor_strike-plasma)" stroke="hsl(182, 100%, 88%)" stroke-width="1.2"/>
       <path d="M94 16 L95.3 19.7 L99 21 L95.3 22.3 L94 26 L92.7 22.3 L89 21 L92.7 19.7 Z" fill="hsl(54, 100%, 98%)"/>
       <circle cx="112" cy="12" r="5.4" fill="url(#ca-meteor_strike-plasma)" stroke="hsl(182, 100%, 88%)" stroke-width="1.1"/>
       <path d="M112 8 L113.1 10.9 L116 12 L113.1 13.1 L112 16 L110.9 13.1 L108 12 L110.9 10.9 Z" fill="hsl(54, 100%, 98%)"/>
     </g>
     <circle cx="18" cy="14" r="1.3" fill="hsl(196, 100%, 90%)"/>
     <circle cx="44" cy="12" r="1.1" fill="hsl(50, 100%, 92%)"/>
     <circle cx="28" cy="24" r="1.4" fill="hsl(44, 100%, 86%)"/>
     <circle cx="88" cy="54" r="1.6" fill="hsl(32, 100%, 76%)"/>`,
    'hsla(28, 100%, 60%, 0.32)',
    `<linearGradient id="ca-meteor_strike-wake" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(182, 100%, 72%)" stop-opacity="0.3"/><stop offset="45%" stop-color="hsl(34, 100%, 62%)" stop-opacity="0.65"/><stop offset="100%" stop-color="hsl(14, 100%, 50%)" stop-opacity="0.9"/></linearGradient><radialGradient id="ca-meteor_strike-fire" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="48%" stop-color="hsl(32, 100%, 60%)" stop-opacity="0.85"/><stop offset="100%" stop-color="hsl(12, 92%, 40%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-meteor_strike-rock" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(44, 100%, 78%)"/><stop offset="42%" stop-color="hsl(18, 82%, 44%)"/><stop offset="100%" stop-color="hsl(246, 36%, 22%)"/></linearGradient><radialGradient id="ca-meteor_strike-plasma" cx="42%" cy="38%" r="58%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="46%" stop-color="hsl(172, 100%, 68%)"/><stop offset="82%" stop-color="hsl(204, 96%, 52%)"/><stop offset="100%" stop-color="hsl(268, 76%, 36%)"/></radialGradient>`
  ),
  thunder_strike: wrapArtSvg(
    'thunder_strike',
    'hsl(220, 66%, 17%)',
    'hsl(238, 62%, 7%)',
    `<rect x="0" y="0" width="128" height="22" fill="url(#ca-thunder_strike-sky)" opacity="0.72"/>
     <ellipse cx="64" cy="60" rx="54" ry="12" fill="url(#ca-thunder_strike-impact)" opacity="0.82"/>
     <path d="M22 0 L18 19 L25 22 L19 42 L24 44 L20 59 M43 0 L47 16 L40 19 L46 37 L41 40 L45 58 M85 0 L81 17 L88 21 L82 39 L87 42 L83 58 M106 0 L110 18 L103 22 L109 41 L104 44 L108 59" fill="none" stroke="url(#ca-thunder_strike-bolt)" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
     <path d="M22 0 L18 19 L25 22 L19 42 L24 44 L20 59 M43 0 L47 16 L40 19 L46 37 L41 40 L45 58 M85 0 L81 17 L88 21 L82 39 L87 42 L83 58 M106 0 L110 18 L103 22 L109 41 L104 44 L108 59" fill="none" stroke="hsl(190, 100%, 94%)" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M64 0 L57 18 L68 22 L59 41 L69 45 L64 62" fill="none" stroke="url(#ca-thunder_strike-main)" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>
     <path d="M64 0 L57 18 L68 22 L59 41 L69 45 L64 62" fill="none" stroke="hsl(52, 100%, 88%)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M64 0 L57 18 L68 22 L59 41 L69 45 L64 62" fill="none" stroke="hsl(60, 100%, 99%)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
     <ellipse cx="64" cy="61" rx="18" ry="5" fill="none" stroke="hsl(50, 100%, 88%)" stroke-width="1.4"/>
     <ellipse cx="20" cy="59" rx="8" ry="2.6" fill="none" stroke="hsl(190, 100%, 84%)" stroke-width="1.1"/>
     <ellipse cx="108" cy="59" rx="8" ry="2.6" fill="none" stroke="hsl(190, 100%, 84%)" stroke-width="1.1"/>
     <path d="M51 58 L46 51 M77 58 L82 51 M31 58 L28 53 M97 58 L100 53" stroke="hsl(52, 100%, 92%)" stroke-width="1.3" stroke-linecap="round"/>`,
    'hsla(48, 100%, 68%, 0.30)',
    `<linearGradient id="ca-thunder_strike-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(194, 100%, 82%)" stop-opacity="0.72"/><stop offset="100%" stop-color="hsl(220, 66%, 17%)" stop-opacity="0"/></linearGradient><linearGradient id="ca-thunder_strike-main" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 88%)"/><stop offset="50%" stop-color="hsl(190, 100%, 74%)"/><stop offset="100%" stop-color="hsl(48, 100%, 76%)"/></linearGradient><linearGradient id="ca-thunder_strike-bolt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(190, 100%, 82%)"/><stop offset="100%" stop-color="hsl(214, 96%, 58%)"/></linearGradient><radialGradient id="ca-thunder_strike-impact" cx="50%" cy="55%" r="52%"><stop offset="0%" stop-color="hsl(54, 100%, 94%)"/><stop offset="44%" stop-color="hsl(192, 100%, 68%)" stop-opacity="0.7"/><stop offset="100%" stop-color="hsl(232, 64%, 10%)" stop-opacity="0"/></radialGradient>`
  ),
  amplify: wrapArtSvg(
    'amplify',
    'hsl(224, 62%, 18%)',
    'hsl(248, 56%, 8%)',
    `<ellipse cx="64" cy="36" rx="54" ry="26" fill="url(#ca-amplify-core)" opacity="0.52"/>
     <path d="M52 24 A16 16 0 0 1 52 48" fill="none" stroke="url(#ca-amplify-wave1)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M57 21 A20 20 0 0 1 57 51" fill="none" stroke="url(#ca-amplify-wave2)" stroke-width="1.6" stroke-linecap="round" opacity="0.88"/>
     <path d="M68 16 A27 27 0 0 1 68 56" fill="none" stroke="url(#ca-amplify-wave1)" stroke-width="2.8" stroke-linecap="round"/>
     <path d="M74 13 A31 31 0 0 1 74 59" fill="none" stroke="url(#ca-amplify-wave2)" stroke-width="1.9" stroke-linecap="round" opacity="0.9"/>
     <path d="M87 9 A39 39 0 0 1 87 63" fill="none" stroke="url(#ca-amplify-wave1)" stroke-width="3.1" stroke-linecap="round"/>
     <path d="M94 6 A43 43 0 0 1 94 66" fill="none" stroke="url(#ca-amplify-wave2)" stroke-width="2.1" stroke-linecap="round" opacity="0.92"/>
     <path d="M108 4 A51 51 0 0 1 108 68" fill="none" stroke="url(#ca-amplify-wave1)" stroke-width="2.4" stroke-linecap="round" opacity="0.75"/>
     <path d="M114 3 A55 55 0 0 1 114 69" fill="none" stroke="url(#ca-amplify-wave2)" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>
     <path d="M12 58 L24 44 L28 58 Z" fill="hsl(228, 54%, 14%)" stroke="hsl(44, 88%, 62%)" stroke-width="1.1"/>
     <path d="M36 12 Q12 36 36 60 Q28 36 36 12 Z" fill="url(#ca-amplify-dish)" stroke="hsl(46, 96%, 76%)" stroke-width="1.6" stroke-linejoin="round"/>
     <path d="M34 16 L47 36 L34 56 M24 36 H47" fill="none" stroke="hsl(44, 92%, 72%)" stroke-width="1.1"/>
     <circle cx="47" cy="36" r="5" fill="hsl(190, 100%, 84%)" stroke="hsl(52, 100%, 94%)" stroke-width="1.2"/>
     <circle cx="47" cy="36" r="2.1" fill="hsl(54, 100%, 98%)"/>
     <circle cx="84" cy="24" r="1.4" fill="hsl(50, 100%, 92%)"/>
     <circle cx="96" cy="48" r="1.5" fill="hsl(188, 100%, 88%)"/>`,
    'hsla(192, 98%, 64%, 0.30)',
    `<radialGradient id="ca-amplify-core" cx="38%" cy="50%" r="58%"><stop offset="0%" stop-color="hsl(190, 100%, 80%)" stop-opacity="0.82"/><stop offset="55%" stop-color="hsl(268, 86%, 54%)" stop-opacity="0.26"/><stop offset="100%" stop-color="hsl(244, 60%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-amplify-dish" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(204, 68%, 44%)"/><stop offset="52%" stop-color="hsl(222, 62%, 24%)"/><stop offset="100%" stop-color="hsl(38, 78%, 42%)"/></linearGradient><linearGradient id="ca-amplify-wave1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(186, 100%, 88%)" stop-opacity="0.3"/><stop offset="50%" stop-color="hsl(190, 100%, 76%)"/><stop offset="100%" stop-color="hsl(186, 100%, 88%)" stop-opacity="0.3"/></linearGradient><linearGradient id="ca-amplify-wave2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 82%)" stop-opacity="0.25"/><stop offset="50%" stop-color="hsl(48, 100%, 74%)"/><stop offset="100%" stop-color="hsl(288, 92%, 72%)" stop-opacity="0.25"/></linearGradient>`
  ),
  fission: wrapArtSvg(
    'fission',
    'hsl(228, 64%, 17%)',
    'hsl(204, 62%, 8%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-fission-flash)" opacity="0.9"/>
     <g stroke="url(#ca-fission-ray)" stroke-linecap="round">
       <line x1="64" y1="36" x2="64" y2="3" stroke-width="2.6"/>
       <line x1="64" y1="36" x2="64" y2="69" stroke-width="2.6"/>
       <line x1="64" y1="36" x2="18" y2="8" stroke-width="1.8"/>
       <line x1="64" y1="36" x2="110" y2="64" stroke-width="1.8"/>
       <line x1="64" y1="36" x2="110" y2="8" stroke-width="1.8"/>
       <line x1="64" y1="36" x2="18" y2="64" stroke-width="1.8"/>
       <line x1="64" y1="36" x2="8" y2="36" stroke-width="1.4" opacity="0.78"/>
       <line x1="64" y1="36" x2="120" y2="36" stroke-width="1.4" opacity="0.78"/>
     </g>
     <ellipse cx="64" cy="36" rx="44" ry="15" fill="none" stroke="url(#ca-fission-ring)" stroke-width="1.3" stroke-dasharray="10 4" transform="rotate(-24 64 36)"/>
     <ellipse cx="64" cy="36" rx="44" ry="15" fill="none" stroke="url(#ca-fission-ring)" stroke-width="1.3" stroke-dasharray="10 4" transform="rotate(24 64 36)"/>
     <path d="M55 18 A18 18 0 1 0 55 54 L59 42 L53 36 L59 30 Z" fill="url(#ca-fission-half)" stroke="hsl(188, 100%, 86%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M73 18 A18 18 0 1 1 73 54 L69 42 L75 36 L69 30 Z" fill="url(#ca-fission-half)" stroke="hsl(188, 100%, 86%)" stroke-width="1.4" stroke-linejoin="round"/>
     <polygon points="64,14 68,36 64,58 60,36" fill="hsl(54, 100%, 98%)"/>
     <circle cx="64" cy="36" r="5.5" fill="hsl(56, 100%, 98%)"/>
     <circle cx="30" cy="22" r="2" fill="hsl(50, 100%, 92%)"/>
     <circle cx="98" cy="50" r="2" fill="hsl(50, 100%, 92%)"/>
     <circle cx="96" cy="18" r="1.7" fill="hsl(188, 100%, 88%)"/>
     <circle cx="32" cy="54" r="1.7" fill="hsl(188, 100%, 88%)"/>
     <circle cx="16" cy="30" r="1.3" fill="hsl(190, 100%, 84%)"/>
     <circle cx="112" cy="42" r="1.3" fill="hsl(190, 100%, 84%)"/>`,
    'hsla(50, 100%, 72%, 0.34)',
    `<radialGradient id="ca-fission-flash" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="32%" stop-color="hsl(48, 100%, 72%)" stop-opacity="0.85"/><stop offset="68%" stop-color="hsl(192, 100%, 58%)" stop-opacity="0.3"/><stop offset="100%" stop-color="hsl(224, 64%, 10%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-fission-half" cx="44%" cy="38%" r="62%"><stop offset="0%" stop-color="hsl(186, 100%, 82%)"/><stop offset="56%" stop-color="hsl(210, 90%, 48%)"/><stop offset="100%" stop-color="hsl(246, 72%, 24%)"/></radialGradient><linearGradient id="ca-fission-ray" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(188, 100%, 84%)" stop-opacity="0.3"/><stop offset="50%" stop-color="hsl(54, 100%, 94%)"/><stop offset="100%" stop-color="hsl(188, 100%, 84%)" stop-opacity="0.3"/></linearGradient><linearGradient id="ca-fission-ring" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(190, 100%, 76%)"/><stop offset="50%" stop-color="hsl(50, 100%, 84%)"/><stop offset="100%" stop-color="hsl(276, 92%, 74%)"/></linearGradient>`
  ),
  multi_cast: wrapArtSvg(
    'multi_cast',
    'hsl(216, 66%, 18%)',
    'hsl(242, 60%, 8%)',
    `<polygon points="24,30 126,12 126,60 24,42" fill="url(#ca-multi_cast-beam)" opacity="0.58"/>
     <line x1="24" y1="36" x2="124" y2="36" stroke="hsl(54, 100%, 96%)" stroke-width="2.2" opacity="0.9"/>
     <g fill="none">
       <ellipse cx="42" cy="36" rx="5.5" ry="13" stroke="hsl(186, 100%, 84%)" stroke-width="2.2"/>
       <ellipse cx="58" cy="36" rx="7" ry="17.5" stroke="url(#ca-multi_cast-ring1)" stroke-width="2.3"/>
       <ellipse cx="76" cy="36" rx="8.5" ry="22" stroke="hsl(48, 100%, 78%)" stroke-width="2.4"/>
       <ellipse cx="96" cy="36" rx="10" ry="26.5" stroke="url(#ca-multi_cast-ring2)" stroke-width="2.3"/>
       <ellipse cx="116" cy="36" rx="11" ry="30" stroke="hsl(190, 100%, 76%)" stroke-width="1.8" opacity="0.72"/>
     </g>
     <circle cx="58" cy="36" r="5" fill="hsl(190, 100%, 82%)" opacity="0.34"/>
     <circle cx="76" cy="36" r="5.5" fill="hsl(48, 100%, 82%)" opacity="0.34"/>
     <circle cx="96" cy="36" r="6" fill="hsl(282, 92%, 76%)" opacity="0.34"/>
     <path d="M16 18 A18 18 0 0 0 16 54" fill="none" stroke="hsl(44, 92%, 66%)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="24" cy="36" r="11" fill="url(#ca-multi_cast-orb)" stroke="hsl(188, 100%, 92%)" stroke-width="1.6"/>
     <circle cx="21" cy="32" r="3" fill="hsl(56, 100%, 98%)"/>
     <path d="M36 18 L46 21 M66 13 L78 16 M88 58 L100 55 M108 10 L118 14" stroke="hsl(52, 100%, 92%)" stroke-width="1.3" stroke-linecap="round" opacity="0.8"/>`,
    'hsla(192, 100%, 66%, 0.30)',
    `<radialGradient id="ca-multi_cast-orb" cx="38%" cy="34%" r="60%"><stop offset="0%" stop-color="hsl(54, 100%, 98%)"/><stop offset="44%" stop-color="hsl(188, 100%, 72%)"/><stop offset="82%" stop-color="hsl(214, 92%, 46%)"/><stop offset="100%" stop-color="hsl(248, 78%, 24%)"/></radialGradient><linearGradient id="ca-multi_cast-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(188, 100%, 82%)" stop-opacity="0.9"/><stop offset="55%" stop-color="hsl(48, 100%, 74%)" stop-opacity="0.48"/><stop offset="100%" stop-color="hsl(282, 92%, 68%)" stop-opacity="0.1"/></linearGradient><linearGradient id="ca-multi_cast-ring1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(190, 100%, 84%)"/><stop offset="50%" stop-color="hsl(206, 98%, 62%)"/><stop offset="100%" stop-color="hsl(190, 100%, 84%)"/></linearGradient><linearGradient id="ca-multi_cast-ring2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(286, 96%, 78%)"/><stop offset="50%" stop-color="hsl(196, 100%, 74%)"/><stop offset="100%" stop-color="hsl(286, 96%, 78%)"/></linearGradient>`
  ),
  rainbow: wrapArtSvg(
    'rainbow',
    'hsl(232, 58%, 18%)',
    'hsl(216, 56%, 8%)',
    `<path d="M4 58 Q36 8 64 20 Q92 32 124 14" fill="none" stroke="url(#ca-rainbow-ribbon)" stroke-width="11" stroke-linecap="round" opacity="0.28"/>
     <path d="M8 54 Q36 14 64 22 Q92 30 120 52" fill="none" stroke="url(#ca-rainbow-ribbon)" stroke-width="6.4" stroke-linecap="round" opacity="0.88"/>
     <path d="M10 51 Q37 11 64 19 Q91 27 118 49" fill="none" stroke="hsl(52, 100%, 88%)" stroke-width="1.3" stroke-linecap="round" opacity="0.82"/>
     <path d="M10 57 Q37 17 64 25 Q91 33 118 55" fill="none" stroke="hsl(284, 92%, 74%)" stroke-width="1.2" stroke-linecap="round" opacity="0.72"/>
     <g>
       <circle cx="26" cy="44" r="12.5" fill="hsl(230, 62%, 8%)" opacity="0.55" transform="translate(1.5,2)"/>
       <circle cx="26" cy="44" r="12" fill="url(#ca-rainbow-lightning)" stroke="hsl(52, 100%, 88%)" stroke-width="1.5"/>
       <path d="M27 36 L22 44 L26 44 L24 52 L31 43 L27 43 Z" fill="hsl(56, 100%, 98%)"/>
     </g>
     <g>
       <circle cx="64" cy="23" r="12.5" fill="hsl(230, 62%, 8%)" opacity="0.55" transform="translate(1.5,2)"/>
       <circle cx="64" cy="23" r="12" fill="url(#ca-rainbow-frost)" stroke="hsl(186, 100%, 92%)" stroke-width="1.5"/>
       <polygon points="64,14 71,23 64,32 57,23" fill="hsl(186, 100%, 94%)" opacity="0.72"/>
       <path d="M64 15 V31 M56 23 H72" stroke="hsl(190, 100%, 98%)" stroke-width="1.1"/>
     </g>
     <g>
       <circle cx="102" cy="44" r="12.5" fill="hsl(230, 62%, 8%)" opacity="0.55" transform="translate(1.5,2)"/>
       <circle cx="102" cy="44" r="12" fill="url(#ca-rainbow-dark)" stroke="hsl(288, 96%, 76%)" stroke-width="1.5"/>
       <circle cx="102" cy="44" r="6.5" fill="hsl(268, 72%, 10%)" stroke="hsl(296, 98%, 74%)" stroke-width="1"/>
       <path d="M97 41 Q102 36 107 41 Q102 48 97 44" fill="none" stroke="hsl(292, 100%, 84%)" stroke-width="1.1"/>
     </g>
     <path d="M44 12 L45.5 15 L48.5 16.5 L45.5 18 L44 21 L42.5 18 L39.5 16.5 L42.5 15 Z M84 13 L85.3 15.6 L88 17 L85.3 18.4 L84 21 L82.7 18.4 L80 17 L82.7 15.6 Z" fill="hsl(54, 100%, 96%)"/>
     <circle cx="64" cy="54" r="1.6" fill="hsl(188, 100%, 88%)"/>`,
    'hsla(196, 98%, 68%, 0.28)',
    `<linearGradient id="ca-rainbow-ribbon" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(48, 100%, 72%)"/><stop offset="28%" stop-color="hsl(342, 96%, 72%)"/><stop offset="52%" stop-color="hsl(176, 100%, 72%)"/><stop offset="76%" stop-color="hsl(214, 100%, 66%)"/><stop offset="100%" stop-color="hsl(286, 96%, 70%)"/></linearGradient><radialGradient id="ca-rainbow-lightning" cx="38%" cy="34%" r="62%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="52%" stop-color="hsl(44, 100%, 62%)"/><stop offset="100%" stop-color="hsl(28, 92%, 38%)"/></radialGradient><radialGradient id="ca-rainbow-frost" cx="38%" cy="34%" r="62%"><stop offset="0%" stop-color="hsl(184, 100%, 98%)"/><stop offset="52%" stop-color="hsl(190, 96%, 68%)"/><stop offset="100%" stop-color="hsl(212, 86%, 40%)"/></radialGradient><radialGradient id="ca-rainbow-dark" cx="42%" cy="38%" r="62%"><stop offset="0%" stop-color="hsl(292, 92%, 68%)"/><stop offset="52%" stop-color="hsl(274, 78%, 32%)"/><stop offset="100%" stop-color="hsl(258, 72%, 12%)"/></radialGradient>`
  ),
  reboot: wrapArtSvg(
    'reboot',
    'hsl(204, 66%, 18%)',
    'hsl(224, 60%, 8%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-reboot-glow)" opacity="0.78"/>
     <circle cx="64" cy="36" r="28" fill="none" stroke="url(#ca-reboot-ring)" stroke-width="1.3" stroke-dasharray="6 4" opacity="0.72"/>
     <g transform="translate(17,22) rotate(-28)" opacity="0.52">
       <rect x="0" y="0" width="12" height="16" rx="1.6" fill="hsl(214, 58%, 26%)" stroke="hsl(194, 88%, 64%)" stroke-width="0.9"/>
     </g>
     <g transform="translate(24,47) rotate(22)" opacity="0.65">
       <rect x="0" y="0" width="12" height="16" rx="1.6" fill="hsl(210, 62%, 30%)" stroke="hsl(192, 92%, 70%)" stroke-width="0.9"/>
     </g>
     <g transform="translate(94,12) rotate(24)">
       <rect x="0" y="0" width="13" height="17" rx="1.8" fill="url(#ca-reboot-card)" stroke="hsl(50, 100%, 86%)" stroke-width="1.1"/>
       <line x1="3" y1="6" x2="10" y2="6" stroke="hsl(54, 100%, 92%)" stroke-width="1"/>
       <line x1="3" y1="10" x2="8" y2="10" stroke="hsl(188, 100%, 86%)" stroke-width="1"/>
     </g>
     <g transform="translate(99,39) rotate(-16)">
       <rect x="0" y="0" width="13" height="17" rx="1.8" fill="url(#ca-reboot-card)" stroke="hsl(186, 100%, 88%)" stroke-width="1.1"/>
       <line x1="3" y1="6" x2="10" y2="6" stroke="hsl(54, 100%, 92%)" stroke-width="1"/>
       <line x1="3" y1="10" x2="8" y2="10" stroke="hsl(188, 100%, 86%)" stroke-width="1"/>
     </g>
     <path d="M26 16 Q46 5 74 11 M102 56 Q80 67 52 61" fill="none" stroke="hsl(188, 100%, 78%)" stroke-width="1.4" stroke-linecap="round"/>
     <polygon points="78,12 71,7 72,14" fill="hsl(50, 100%, 88%)"/>
     <polygon points="48,60 55,65 54,58" fill="hsl(188, 100%, 86%)"/>
     <circle cx="64" cy="36" r="19" fill="hsl(222, 62%, 11%)" stroke="hsl(194, 88%, 58%)" stroke-width="1.6"/>
     <path d="M74.5 24.5 A15.5 15.5 0 1 1 53.5 24.5" fill="none" stroke="url(#ca-reboot-icon)" stroke-width="4.2" stroke-linecap="round"/>
     <line x1="64" y1="19" x2="64" y2="34" stroke="hsl(54, 100%, 96%)" stroke-width="4.2" stroke-linecap="round"/>
     <line x1="64" y1="19" x2="64" y2="34" stroke="hsl(186, 100%, 88%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="38" cy="14" r="1.4" fill="hsl(188, 100%, 88%)"/>
     <circle cx="90" cy="58" r="1.4" fill="hsl(48, 100%, 88%)"/>`,
    'hsla(186, 100%, 64%, 0.30)',
    `<radialGradient id="ca-reboot-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(186, 100%, 80%)" stop-opacity="0.78"/><stop offset="56%" stop-color="hsl(204, 92%, 48%)" stop-opacity="0.26"/><stop offset="100%" stop-color="hsl(224, 62%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-reboot-icon" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="48%" stop-color="hsl(184, 100%, 74%)"/><stop offset="100%" stop-color="hsl(206, 96%, 56%)"/></linearGradient><linearGradient id="ca-reboot-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(188, 96%, 66%)"/><stop offset="100%" stop-color="hsl(220, 72%, 28%)"/></linearGradient><linearGradient id="ca-reboot-ring" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(190, 100%, 72%)"/><stop offset="100%" stop-color="hsl(48, 100%, 78%)"/></linearGradient>`
  ),
  seek: wrapArtSvg(
    'seek',
    'hsl(206, 66%, 17%)',
    'hsl(224, 60%, 7%)',
    `<g fill="none" stroke="hsl(192, 92%, 62%)" opacity="0.4">
       <circle cx="46" cy="40" r="14" stroke-width="0.9"/>
       <circle cx="46" cy="40" r="28" stroke-width="0.9"/>
       <circle cx="46" cy="40" r="42" stroke-width="0.9" stroke-dasharray="4 3"/>
       <circle cx="46" cy="40" r="56" stroke-width="0.8"/>
       <line x1="4" y1="40" x2="112" y2="40" stroke-width="0.7"/>
       <line x1="46" y1="2" x2="46" y2="70" stroke-width="0.7"/>
     </g>
     <path d="M46 40 L94 4 L114 38 Z" fill="url(#ca-seek-sweep)" opacity="0.78"/>
     <line x1="46" y1="40" x2="114" y2="38" stroke="hsl(186, 100%, 88%)" stroke-width="1.6" stroke-linecap="round"/>
     <g fill="hsl(216, 56%, 22%)" stroke="hsl(198, 72%, 48%)" stroke-width="0.9" opacity="0.65">
       <rect x="14" y="20" width="11" height="15" rx="1.4" transform="rotate(-14 19 27)"/>
       <rect x="24" y="47" width="11" height="15" rx="1.4" transform="rotate(12 29 54)"/>
       <rect x="52" y="51" width="11" height="15" rx="1.4" transform="rotate(-8 57 58)"/>
       <rect x="74" y="49" width="11" height="15" rx="1.4" transform="rotate(14 79 56)"/>
     </g>
     <circle cx="46" cy="40" r="3.8" fill="hsl(188, 100%, 84%)" stroke="hsl(54, 100%, 96%)" stroke-width="1"/>
     <circle cx="91" cy="27" r="20" fill="url(#ca-seek-aura)" opacity="0.85"/>
     <rect x="83" y="16" width="16" height="22" rx="2.2" fill="url(#ca-seek-card)" stroke="hsl(54, 100%, 94%)" stroke-width="1.5"/>
     <polygon points="91,20 95,27 91,34 87,27" fill="hsl(56, 100%, 98%)"/>
     <path d="M77 18 V12 H83 M99 12 H105 V18 M77 36 V42 H83 M99 42 H105 V36" fill="none" stroke="url(#ca-seek-gold)" stroke-width="1.6" stroke-linecap="square"/>
     <circle cx="91" cy="27" r="14.5" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1" stroke-dasharray="3 2.5"/>
     <circle cx="66" cy="21" r="1.4" fill="hsl(188, 100%, 88%)"/>
     <circle cx="112" cy="18" r="1.4" fill="hsl(50, 100%, 92%)"/>`,
    'hsla(190, 98%, 60%, 0.28)',
    `<linearGradient id="ca-seek-sweep" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(192, 100%, 66%)" stop-opacity="0.12"/><stop offset="68%" stop-color="hsl(188, 100%, 72%)" stop-opacity="0.52"/><stop offset="100%" stop-color="hsl(184, 100%, 86%)" stop-opacity="0.82"/></linearGradient><radialGradient id="ca-seek-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 90%)" stop-opacity="0.9"/><stop offset="55%" stop-color="hsl(44, 100%, 58%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(206, 70%, 16%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-seek-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 86%)"/><stop offset="55%" stop-color="hsl(42, 98%, 58%)"/><stop offset="100%" stop-color="hsl(28, 88%, 38%)"/></linearGradient><linearGradient id="ca-seek-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 94%)"/><stop offset="100%" stop-color="hsl(42, 96%, 62%)"/></linearGradient>`
  ),
  biased_cognition: wrapArtSvg(
    'biased_cognition',
    'hsl(254, 60%, 18%)',
    'hsl(224, 62%, 8%)',
    `<path d="M0 16 L64 36 L0 56 Z M128 16 L64 36 L128 56 Z" fill="url(#ca-biased_cognition-beam)" opacity="0.65"/>
     <circle cx="64" cy="36" r="29" fill="none" stroke="hsl(284, 84%, 64%)" stroke-width="1.2" stroke-dasharray="10 4 3 4" opacity="0.68"/>
     <path d="M18 36 Q64 7 110 36 Q64 65 18 36 Z" fill="hsl(244, 62%, 8%)" opacity="0.72" transform="translate(1.5,2)"/>
     <path d="M18 36 Q64 7 110 36 Q64 65 18 36 Z" fill="url(#ca-biased_cognition-metal)" stroke="hsl(46, 96%, 72%)" stroke-width="1.8" stroke-linejoin="round"/>
     <circle cx="64" cy="36" r="17.5" fill="hsl(246, 56%, 12%)" stroke="hsl(192, 94%, 70%)" stroke-width="1.3"/>
     <g stroke="hsl(46, 92%, 68%)" stroke-width="1.1" opacity="0.8">
       <line x1="64" y1="18.5" x2="64" y2="25"/>
       <line x1="64" y1="47" x2="64" y2="53.5"/>
       <line x1="46.5" y1="36" x2="53" y2="36"/>
       <line x1="75" y1="36" x2="81.5" y2="36"/>
       <line x1="51.5" y1="23.5" x2="56" y2="28"/>
       <line x1="76.5" y1="48.5" x2="72" y2="44"/>
     </g>
     <circle cx="64" cy="36" r="12.5" fill="url(#ca-biased_cognition-iris)" stroke="hsl(52, 100%, 92%)" stroke-width="1.4"/>
     <circle cx="64" cy="36" r="4.8" fill="hsl(56, 100%, 98%)"/>
     <path d="M72 26 L84 18 L92 22 L106 12 M56 46 L44 54 L36 50 L22 60 M76 39 L94 46 L108 42" fill="none" stroke="url(#ca-biased_cognition-crack)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M72 26 L84 18 L92 22 L106 12 M56 46 L44 54 L36 50 L22 60" fill="none" stroke="hsl(304, 100%, 90%)" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="28" cy="18" r="1.5" fill="hsl(48, 100%, 88%)"/>
     <circle cx="102" cy="56" r="1.5" fill="hsl(292, 100%, 80%)"/>`,
    'hsla(46, 100%, 64%, 0.30)',
    `<linearGradient id="ca-biased_cognition-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(286, 92%, 62%)" stop-opacity="0.18"/><stop offset="50%" stop-color="hsl(48, 100%, 74%)" stop-opacity="0.88"/><stop offset="100%" stop-color="hsl(286, 92%, 62%)" stop-opacity="0.18"/></linearGradient><radialGradient id="ca-biased_cognition-iris" cx="46%" cy="44%" r="58%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="44%" stop-color="hsl(46, 100%, 66%)"/><stop offset="78%" stop-color="hsl(286, 90%, 56%)"/><stop offset="100%" stop-color="hsl(252, 74%, 22%)"/></radialGradient><linearGradient id="ca-biased_cognition-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(214, 52%, 34%)"/><stop offset="55%" stop-color="hsl(232, 54%, 20%)"/><stop offset="100%" stop-color="hsl(258, 56%, 14%)"/></linearGradient><linearGradient id="ca-biased_cognition-crack" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 86%)"/><stop offset="55%" stop-color="hsl(294, 96%, 68%)"/><stop offset="100%" stop-color="hsl(272, 92%, 52%)"/></linearGradient>`
  ),
  buffer_card: wrapArtSvg(
    'buffer_card',
    'hsl(214, 62%, 18%)',
    'hsl(232, 58%, 8%)',
    `<path d="M0 24 L54 33 L54 39 L0 48 Z" fill="url(#ca-buffer_card-strike)" opacity="0.85"/>
     <path d="M4 36 H52" stroke="hsl(46, 100%, 92%)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M52 36 Q46 18 22 6 M52 36 Q46 54 22 66 M50 32 Q38 22 18 18 M50 40 Q38 50 18 54" fill="none" stroke="hsl(18, 100%, 68%)" stroke-width="1.8" stroke-linecap="round" opacity="0.88"/>
     <circle cx="54" cy="36" r="15" fill="url(#ca-buffer_card-impact)" opacity="0.92"/>
     <polygon points="78,7 104,36 78,65 52,36" fill="hsl(226, 68%, 8%)" opacity="0.55" transform="translate(2,2)"/>
     <polygon points="78,7 104,36 78,65 52,36" fill="url(#ca-buffer_card-shield)" stroke="hsl(186, 100%, 90%)" stroke-width="2" stroke-linejoin="round"/>
     <polygon points="78,14 96,36 78,58 60,36" fill="url(#ca-buffer_card-facet)" stroke="hsl(190, 100%, 86%)" stroke-width="1.1" stroke-linejoin="round" opacity="0.85"/>
     <path d="M78 7 V65 M52 36 H104 M65 21.5 L91 50.5 M91 21.5 L65 50.5" stroke="hsl(186, 100%, 94%)" stroke-width="0.9" opacity="0.58"/>
     <polygon points="78,26 85,36 78,46 71,36" fill="hsl(188, 100%, 96%)" opacity="0.85"/>
     <path d="M52 29 A10 10 0 0 1 52 43" fill="none" stroke="hsl(54, 100%, 96%)" stroke-width="2.2" stroke-linecap="round"/>
     <circle cx="38" cy="14" r="1.5" fill="hsl(36, 100%, 82%)"/>
     <circle cx="36" cy="58" r="1.5" fill="hsl(36, 100%, 82%)"/>
     <circle cx="110" cy="22" r="1.5" fill="hsl(188, 100%, 88%)"/>
     <circle cx="112" cy="50" r="1.4" fill="hsl(188, 100%, 88%)"/>`,
    'hsla(188, 100%, 68%, 0.30)',
    `<linearGradient id="ca-buffer_card-shield" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(186, 100%, 86%)" stop-opacity="0.86"/><stop offset="48%" stop-color="hsl(202, 96%, 56%)" stop-opacity="0.52"/><stop offset="100%" stop-color="hsl(224, 86%, 34%)" stop-opacity="0.72"/></linearGradient><linearGradient id="ca-buffer_card-facet" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(184, 100%, 94%)" stop-opacity="0.58"/><stop offset="100%" stop-color="hsl(208, 92%, 44%)" stop-opacity="0.2"/></linearGradient><linearGradient id="ca-buffer_card-strike" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(352, 92%, 46%)" stop-opacity="0.18"/><stop offset="68%" stop-color="hsl(12, 100%, 58%)" stop-opacity="0.85"/><stop offset="100%" stop-color="hsl(48, 100%, 88%)"/></linearGradient><radialGradient id="ca-buffer_card-impact" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 98%)"/><stop offset="45%" stop-color="hsl(188, 100%, 78%)" stop-opacity="0.78"/><stop offset="100%" stop-color="hsl(206, 94%, 52%)" stop-opacity="0"/></radialGradient>`
  ),
  creative_ai: wrapArtSvg(
    'creative_ai',
    'hsl(236, 62%, 18%)',
    'hsl(210, 60%, 8%)',
    `<circle cx="64" cy="40" r="32" fill="url(#ca-creative_ai-aura)" opacity="0.78"/>
     <circle cx="64" cy="40" r="24" fill="none" stroke="hsl(192, 96%, 68%)" stroke-width="0.9" stroke-dasharray="3 3" opacity="0.55"/>
     <path d="M44 40 Q32 30 24 20 M64 26 V13 M84 40 Q96 30 104 20" fill="none" stroke="url(#ca-creative_ai-gold)" stroke-width="1.3" stroke-dasharray="2.5 2"/>
     <path d="M46 49 Q37 46 38 36 Q39 27 49 25 Q55 20 64 23 Q73 20 79 25 Q89 27 90 36 Q91 46 82 49 Q76 56 64 54 Q52 56 46 49 Z" fill="url(#ca-creative_ai-brain)" stroke="hsl(188, 100%, 82%)" stroke-width="1.4"/>
     <g stroke="hsl(186, 100%, 88%)" stroke-width="1" opacity="0.88">
       <line x1="46" y1="36" x2="56" y2="30"/>
       <line x1="56" y1="30" x2="64" y2="38"/>
       <line x1="64" y1="38" x2="72" y2="30"/>
       <line x1="72" y1="30" x2="82" y2="36"/>
       <line x1="46" y1="36" x2="54" y2="46"/>
       <line x1="54" y1="46" x2="64" y2="38"/>
       <line x1="64" y1="38" x2="74" y2="46"/>
       <line x1="74" y1="46" x2="82" y2="36"/>
       <line x1="64" y1="25" x2="64" y2="51"/>
     </g>
     <g fill="hsl(52, 100%, 92%)">
       <circle cx="46" cy="36" r="2.1"/>
       <circle cx="56" cy="30" r="2.2"/>
       <circle cx="72" cy="30" r="2.2"/>
       <circle cx="82" cy="36" r="2.1"/>
       <circle cx="54" cy="46" r="2"/>
       <circle cx="74" cy="46" r="2"/>
       <circle cx="64" cy="38" r="3.2" fill="hsl(186, 100%, 96%)"/>
     </g>
     <g>
       <circle cx="22" cy="19" r="8.5" fill="url(#ca-creative_ai-sigil)" stroke="hsl(48, 100%, 84%)" stroke-width="1.3"/>
       <polygon points="22,13 26,19 22,25 18,19" fill="hsl(54, 100%, 96%)"/>
       <circle cx="64" cy="11" r="7.5" fill="url(#ca-creative_ai-sigil)" stroke="hsl(186, 100%, 88%)" stroke-width="1.3"/>
       <path d="M64 6 L65.8 9.2 L69 11 L65.8 12.8 L64 16 L62.2 12.8 L59 11 L62.2 9.2 Z" fill="hsl(54, 100%, 96%)"/>
       <circle cx="106" cy="19" r="8.5" fill="url(#ca-creative_ai-sigil)" stroke="hsl(286, 96%, 82%)" stroke-width="1.3"/>
       <polygon points="106,13 111,22 101,22" fill="none" stroke="hsl(52, 100%, 94%)" stroke-width="1.3"/>
     </g>
     <circle cx="26" cy="54" r="1.4" fill="hsl(188, 100%, 86%)"/>
     <circle cx="102" cy="54" r="1.4" fill="hsl(48, 100%, 88%)"/>`,
    'hsla(192, 98%, 66%, 0.30)',
    `<radialGradient id="ca-creative_ai-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(188, 100%, 80%)" stop-opacity="0.78"/><stop offset="56%" stop-color="hsl(268, 86%, 54%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(224, 62%, 10%)" stop-opacity="0"/></radialGradient><radialGradient id="ca-creative_ai-brain" cx="50%" cy="42%" r="58%"><stop offset="0%" stop-color="hsl(196, 96%, 46%)" stop-opacity="0.85"/><stop offset="65%" stop-color="hsl(224, 78%, 26%)" stop-opacity="0.9"/><stop offset="100%" stop-color="hsl(252, 68%, 16%)"/></radialGradient><linearGradient id="ca-creative_ai-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 90%)"/><stop offset="100%" stop-color="hsl(188, 100%, 76%)"/></linearGradient><radialGradient id="ca-creative_ai-sigil" cx="42%" cy="38%" r="60%"><stop offset="0%" stop-color="hsl(190, 100%, 76%)"/><stop offset="65%" stop-color="hsl(236, 76%, 34%)"/><stop offset="100%" stop-color="hsl(262, 68%, 18%)"/></radialGradient>`
  ),
  echo_form: wrapArtSvg(
    'echo_form',
    'hsl(216, 68%, 18%)',
    'hsl(240, 62%, 7%)',
    `<ellipse cx="64" cy="36" rx="52" ry="28" fill="url(#ca-echo_form-aura)" opacity="0.78"/>
     <ellipse cx="64" cy="36" rx="44" ry="24" fill="none" stroke="hsl(190, 100%, 76%)" stroke-width="1" opacity="0.45"/>
     <ellipse cx="64" cy="36" rx="32" ry="18" fill="none" stroke="hsl(268, 92%, 76%)" stroke-width="1" stroke-dasharray="4 3" opacity="0.52"/>
     <path d="M52 24 H98 M56 38 H104 M50 52 H96" stroke="hsl(188, 100%, 84%)" stroke-width="1.2" stroke-dasharray="5 3" opacity="0.58"/>
     <g transform="translate(46,0)" opacity="0.34">
       <path d="M40 16 L48 11 L56 16 L54 29 L64 38 L60 66 L36 66 L32 38 L42 29 Z" fill="none" stroke="hsl(186, 100%, 86%)" stroke-width="1.3" stroke-linejoin="round"/>
       <circle cx="48" cy="21" r="2.6" fill="hsl(186, 100%, 92%)"/>
     </g>
     <g transform="translate(26,0)">
       <path d="M40 16 L48 11 L56 16 L54 29 L65 38 L61 66 L35 66 L31 38 L42 29 Z" fill="url(#ca-echo_form-ghost)" stroke="hsl(186, 100%, 90%)" stroke-width="1.5" stroke-linejoin="round"/>
       <circle cx="48" cy="21" r="3.4" fill="hsl(186, 100%, 96%)"/>
       <polygon points="48,37 52,44 48,51 44,44" fill="hsl(188, 100%, 92%)" opacity="0.88"/>
     </g>
     <g>
       <path d="M40 16 L48 11 L56 16 L54 29 L65 38 L61 66 L35 66 L31 38 L42 29 Z" fill="hsl(232, 68%, 8%)" opacity="0.6" transform="translate(2,2)"/>
       <path d="M40 16 L48 11 L56 16 L54 29 L65 38 L61 66 L35 66 L31 38 L42 29 Z" fill="url(#ca-echo_form-body)" stroke="hsl(192, 100%, 82%)" stroke-width="1.6" stroke-linejoin="round"/>
       <path d="M34 40 L48 34 L62 40" fill="none" stroke="hsl(46, 98%, 74%)" stroke-width="1.4"/>
       <circle cx="48" cy="21" r="3.8" fill="url(#ca-echo_form-eye)" stroke="hsl(52, 100%, 94%)" stroke-width="0.9"/>
       <polygon points="48,37 52.5,44 48,51 43.5,44" fill="url(#ca-echo_form-eye)" stroke="hsl(54, 100%, 96%)" stroke-width="1"/>
     </g>
     <circle cx="20" cy="24" r="1.4" fill="hsl(188, 100%, 88%)"/>
     <circle cx="110" cy="24" r="1.5" fill="hsl(188, 100%, 88%)"/>
     <circle cx="18" cy="54" r="1.3" fill="hsl(278, 96%, 80%)"/>`,
    'hsla(194, 100%, 68%, 0.32)',
    `<radialGradient id="ca-echo_form-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(188, 100%, 78%)" stop-opacity="0.72"/><stop offset="56%" stop-color="hsl(216, 94%, 48%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(240, 64%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-echo_form-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(206, 70%, 42%)"/><stop offset="55%" stop-color="hsl(222, 66%, 22%)"/><stop offset="100%" stop-color="hsl(236, 66%, 12%)"/></linearGradient><linearGradient id="ca-echo_form-ghost" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(186, 100%, 82%)" stop-opacity="0.58"/><stop offset="55%" stop-color="hsl(202, 98%, 56%)" stop-opacity="0.34"/><stop offset="100%" stop-color="hsl(268, 88%, 52%)" stop-opacity="0.18"/></linearGradient><radialGradient id="ca-echo_form-eye" cx="45%" cy="42%" r="58%"><stop offset="0%" stop-color="hsl(56, 100%, 98%)"/><stop offset="55%" stop-color="hsl(48, 100%, 72%)"/><stop offset="100%" stop-color="hsl(190, 100%, 62%)"/></radialGradient>`
  ),
  electrodynamics: wrapArtSvg(
    'electrodynamics',
    'hsl(224, 66%, 17%)',
    'hsl(244, 62%, 7%)',
    `<circle cx="64" cy="24" r="34" fill="url(#ca-electrodynamics-glow)" opacity="0.78"/>
     <g>
       <rect x="20" y="34" width="6" height="34" fill="url(#ca-electrodynamics-coil)" stroke="hsl(194, 86%, 64%)" stroke-width="0.9"/>
       <path d="M17 44 H29 M17 50 H29 M17 56 H29" stroke="url(#ca-electrodynamics-copper)" stroke-width="1.6" stroke-linecap="round"/>
       <ellipse cx="23" cy="31" rx="8.5" ry="3.8" fill="url(#ca-electrodynamics-toroid)" stroke="hsl(188, 100%, 86%)" stroke-width="1.1"/>
       <rect x="102" y="34" width="6" height="34" fill="url(#ca-electrodynamics-coil)" stroke="hsl(194, 86%, 64%)" stroke-width="0.9"/>
       <path d="M99 44 H111 M99 50 H111 M99 56 H111" stroke="url(#ca-electrodynamics-copper)" stroke-width="1.6" stroke-linecap="round"/>
       <ellipse cx="105" cy="31" rx="8.5" ry="3.8" fill="url(#ca-electrodynamics-toroid)" stroke="hsl(188, 100%, 86%)" stroke-width="1.1"/>
       <rect x="60" y="23" width="8" height="46" fill="url(#ca-electrodynamics-coil)" stroke="hsl(192, 96%, 72%)" stroke-width="1.1"/>
       <path d="M55 34 H73 M55 41 H73 M55 48 H73 M55 55 H73" stroke="url(#ca-electrodynamics-copper)" stroke-width="2" stroke-linecap="round"/>
       <ellipse cx="64" cy="20" rx="12" ry="5" fill="url(#ca-electrodynamics-toroid)" stroke="hsl(52, 100%, 92%)" stroke-width="1.4"/>
     </g>
     <path d="M25 29 L38 19 L44 25 L56 18 M72 18 L84 25 L91 19 L103 29 M23 31 L42 38 L58 26 M105 31 L86 38 L70 26 M20 28 L8 18 M108 28 L120 18 M64 15 L59 6 L67 3" fill="none" stroke="hsl(192, 100%, 66%)" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.48"/>
     <path d="M25 29 L38 19 L44 25 L56 18 M72 18 L84 25 L91 19 L103 29 M23 31 L42 38 L58 26 M105 31 L86 38 L70 26 M20 28 L8 18 M108 28 L120 18 M64 15 L59 6 L67 3" fill="none" stroke="hsl(54, 100%, 97%)" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="64" cy="20" r="3.4" fill="hsl(56, 100%, 98%)"/>
     <circle cx="23" cy="31" r="2.2" fill="hsl(188, 100%, 96%)"/>
     <circle cx="105" cy="31" r="2.2" fill="hsl(188, 100%, 96%)"/>`,
    'hsla(196, 100%, 66%, 0.32)',
    `<radialGradient id="ca-electrodynamics-glow" cx="50%" cy="46%" r="54%"><stop offset="0%" stop-color="hsl(188, 100%, 84%)" stop-opacity="0.82"/><stop offset="52%" stop-color="hsl(214, 94%, 52%)" stop-opacity="0.3"/><stop offset="100%" stop-color="hsl(244, 62%, 10%)" stop-opacity="0"/></radialGradient><linearGradient id="ca-electrodynamics-coil" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(214, 54%, 22%)"/><stop offset="50%" stop-color="hsl(204, 64%, 40%)"/><stop offset="100%" stop-color="hsl(226, 56%, 14%)"/></linearGradient><linearGradient id="ca-electrodynamics-copper" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(28, 86%, 44%)"/><stop offset="50%" stop-color="hsl(46, 100%, 76%)"/><stop offset="100%" stop-color="hsl(24, 82%, 38%)"/></linearGradient><radialGradient id="ca-electrodynamics-toroid" cx="44%" cy="35%" r="60%"><stop offset="0%" stop-color="hsl(186, 100%, 94%)"/><stop offset="55%" stop-color="hsl(204, 88%, 54%)"/><stop offset="100%" stop-color="hsl(228, 72%, 24%)"/></radialGradient>`
  ),
  machine_learning: wrapArtSvg(
    'machine_learning',
    'hsl(210, 64%, 18%)',
    'hsl(228, 60%, 8%)',
    `<path d="M8 14 H120 M8 36 H120 M8 58 H120 M34 6 V66 M66 6 V66 M98 6 V66" stroke="hsl(196, 86%, 62%)" stroke-width="0.45" opacity="0.22"/>
     <circle cx="102" cy="36" r="28" fill="url(#ca-machine_learning-gold)" opacity="0.62"/>
     <g fill="none" stroke="url(#ca-machine_learning-trace)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
       <path d="M16 36 H30 L38 20 H46 M16 36 H30 L38 52 H46"/>
       <path d="M46 20 H58 L66 13 H76 M46 20 H58 L66 36 H76 M46 52 H58 L66 36 H76 M46 52 H58 L66 59 H76"/>
       <path d="M76 13 H88 L98 24 H108 M76 36 H108 M76 59 H88 L98 48 H108"/>
     </g>
     <path d="M58 20 L66 36 H108 M88 13 L98 24 H108 M88 59 L98 48 H108" fill="none" stroke="hsl(54, 100%, 92%)" stroke-width="1.2" stroke-linecap="round" opacity="0.88"/>
     <polygon points="16,31 21,36 16,41 11,36" fill="url(#ca-machine_learning-node1)" stroke="hsl(200, 90%, 66%)" stroke-width="1.1"/>
     <polygon points="46,15 51,20 46,25 41,20" fill="url(#ca-machine_learning-node1)" stroke="hsl(194, 96%, 74%)" stroke-width="1.2"/>
     <polygon points="46,47 51,52 46,57 41,52" fill="url(#ca-machine_learning-node1)" stroke="hsl(194, 96%, 74%)" stroke-width="1.2"/>
     <polygon points="76,8 82,13 76,18 70,13" fill="url(#ca-machine_learning-node2)" stroke="hsl(186, 100%, 88%)" stroke-width="1.3"/>
     <polygon points="76,30 83,36 76,42 69,36" fill="url(#ca-machine_learning-node2)" stroke="hsl(52, 100%, 92%)" stroke-width="1.4"/>
     <polygon points="76,54 82,59 76,64 70,59" fill="url(#ca-machine_learning-node2)" stroke="hsl(186, 100%, 88%)" stroke-width="1.3"/>
     <circle cx="108" cy="24" r="5" fill="hsl(50, 100%, 84%)" stroke="hsl(56, 100%, 98%)" stroke-width="1.2"/>
     <circle cx="108" cy="48" r="5" fill="hsl(50, 100%, 84%)" stroke="hsl(56, 100%, 98%)" stroke-width="1.2"/>
     <polygon points="108,28 116,36 108,44 100,36" fill="hsl(54, 100%, 94%)" stroke="hsl(44, 100%, 68%)" stroke-width="1.5"/>
     <circle cx="108" cy="36" r="2.5" fill="hsl(56, 100%, 99%)"/>
     <circle cx="34" cy="28" r="1.5" fill="hsl(190, 100%, 86%)"/>
     <circle cx="62" cy="44" r="1.6" fill="hsl(186, 100%, 90%)"/>
     <circle cx="92" cy="36" r="1.8" fill="hsl(54, 100%, 96%)"/>`,
    'hsla(184, 98%, 62%, 0.28)',
    `<linearGradient id="ca-machine_learning-trace" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(210, 76%, 40%)"/><stop offset="48%" stop-color="hsl(190, 98%, 66%)"/><stop offset="100%" stop-color="hsl(48, 100%, 78%)"/></linearGradient><radialGradient id="ca-machine_learning-node1" cx="42%" cy="38%" r="60%"><stop offset="0%" stop-color="hsl(194, 98%, 74%)"/><stop offset="100%" stop-color="hsl(218, 76%, 30%)"/></radialGradient><radialGradient id="ca-machine_learning-node2" cx="42%" cy="38%" r="60%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="55%" stop-color="hsl(186, 100%, 70%)"/><stop offset="100%" stop-color="hsl(206, 88%, 42%)"/></radialGradient><radialGradient id="ca-machine_learning-gold" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(50, 100%, 86%)" stop-opacity="0.82"/><stop offset="55%" stop-color="hsl(188, 100%, 64%)" stop-opacity="0.28"/><stop offset="100%" stop-color="hsl(224, 62%, 10%)" stop-opacity="0"/></radialGradient>`
  ),
};
