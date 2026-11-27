// Bespoke 16:9 SVG card illustrations for Colorless, Status, Curse, and Theme fallback cards.
import { wrapArtSvg } from './wrap.js';

export const COLORLESS_SPECIAL_CARD_ART = {
  the_bomb: wrapArtSvg(
    'the_bomb',
    'hsl(24, 34%, 18%)',
    'hsl(14, 46%, 7%)',
    `<ellipse cx="90" cy="22" rx="28" ry="20" fill="url(#ca-the_bomb-spark)" opacity="0.45"/>
     <ellipse cx="54" cy="63" rx="26" ry="5.5" fill="rgba(0,0,0,0.52)"/>
     <path d="M12 66 Q32 58 58 63 Q86 67 116 61 L128 72 L0 72 Z" fill="rgba(0,0,0,0.28)"/>
     <path d="M62 20 L70 15 L76 23 L68 28 Z" fill="hsl(220, 14%, 28%)" stroke="hsl(36, 48%, 48%)" stroke-width="1.1"/>
     <circle cx="54" cy="41" r="21" fill="url(#ca-the_bomb-iron)" stroke="hsl(222, 22%, 12%)" stroke-width="1.5"/>
     <path d="M40 31 A16 16 0 0 1 56 23" fill="none" stroke="hsla(210, 42%, 86%, 0.55)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M68 27 A18 18 0 0 1 70 53" fill="none" stroke="url(#ca-the_bomb-rim)" stroke-width="2" stroke-linecap="round" opacity="0.88"/>
     <path d="M35 44 Q54 50 73 43" fill="none" stroke="hsl(222, 20%, 14%)" stroke-width="1.8"/>
     <path d="M71 19 Q82 9 93 18" fill="none" stroke="hsl(34, 48%, 54%)" stroke-width="3" stroke-linecap="round"/>
     <path d="M72 19 Q82 10 92 18" fill="none" stroke="hsl(46, 96%, 72%)" stroke-width="1.1" stroke-dasharray="2.4 2" stroke-linecap="round"/>
     <circle cx="94" cy="19" r="9.5" fill="url(#ca-the_bomb-spark)"/>
     <polygon points="94,7 96.5,15 105,13 98.5,19 104,26 96,23 93,31 91,22 83,23 89.5,18 85,11 92,15" fill="hsl(48, 100%, 84%)"/>
     <path d="M94 4 V8 M108 19 H114 M104 9 L109 6 M103 28 L108 32 M84 29 L80 33" stroke="hsl(34, 100%, 66%)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="111" cy="12" r="1.6" fill="hsl(48, 100%, 82%)"/>
     <circle cx="106" cy="36" r="1.4" fill="hsl(26, 100%, 64%)"/>
     <circle cx="83" cy="37" r="1.3" fill="hsl(42, 100%, 74%)"/>`,
    'hsla(36, 98%, 56%, 0.30)',
    `<radialGradient id="ca-the_bomb-iron" cx="36%" cy="32%" r="68%"><stop offset="0%" stop-color="hsl(216, 18%, 54%)"/><stop offset="42%" stop-color="hsl(220, 18%, 24%)"/><stop offset="100%" stop-color="hsl(224, 24%, 9%)"/></radialGradient><radialGradient id="ca-the_bomb-spark" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="48%" stop-color="hsl(38, 100%, 60%)"/><stop offset="100%" stop-color="hsla(14, 100%, 48%, 0)"/></radialGradient><linearGradient id="ca-the_bomb-rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(44, 100%, 78%)"/><stop offset="100%" stop-color="hsl(18, 96%, 50%)"/></linearGradient>`
  ),
  apotheosis: wrapArtSvg(
    'apotheosis',
    'hsl(224, 48%, 18%)',
    'hsl(38, 44%, 10%)',
    `<ellipse cx="64" cy="34" rx="48" ry="28" fill="hsla(44, 100%, 66%, 0.18)"/>
     <polygon points="48,0 80,0 98,72 30,72" fill="url(#ca-apotheosis-beam)"/>
     <polygon points="58,0 70,0 76,72 52,72" fill="hsla(52, 100%, 96%, 0.42)"/>
     <path d="M0 16 Q16 12 28 20 Q38 15 46 24 Q34 32 18 30 Q8 34 0 30 Z" fill="url(#ca-apotheosis-cloud)" opacity="0.88"/>
     <path d="M128 16 Q112 12 100 20 Q90 15 82 24 Q94 32 110 30 Q120 34 128 30 Z" fill="url(#ca-apotheosis-cloud)" opacity="0.88"/>
     <path d="M10 28 Q28 24 44 23 M118 28 Q100 24 84 23" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.2" opacity="0.72"/>
     <ellipse cx="64" cy="37" rx="22" ry="22" fill="none" stroke="hsla(48, 100%, 82%, 0.55)" stroke-width="1.3" stroke-dasharray="4 3"/>
     <polygon points="24,34 38,30 43,51 29,55" fill="url(#ca-apotheosis-card)" stroke="hsl(52, 100%, 90%)" stroke-width="1.1" opacity="0.86"/>
     <polygon points="90,30 104,34 99,55 85,51" fill="url(#ca-apotheosis-card)" stroke="hsl(52, 100%, 90%)" stroke-width="1.1" opacity="0.86"/>
     <rect x="53" y="21" width="22" height="32" rx="2.5" fill="url(#ca-apotheosis-card)" stroke="hsl(54, 100%, 96%)" stroke-width="1.6"/>
     <rect x="56" y="24" width="16" height="26" rx="1.4" fill="hsla(224, 48%, 16%, 0.42)" stroke="hsl(48, 100%, 80%)" stroke-width="0.9"/>
     <path d="M64 31 V43 M58 37 H70" stroke="hsl(142, 100%, 76%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M64 7 L66 13 L72 15 L66 17 L64 23 L62 17 L56 15 L62 13 Z" fill="hsl(54, 100%, 94%)"/>
     <path d="M35 20 L36.4 23.6 L40 25 L36.4 26.4 L35 30 L33.6 26.4 L30 25 L33.6 23.6 Z" fill="hsl(48, 100%, 86%)"/>
     <path d="M93 20 L94.4 23.6 L98 25 L94.4 26.4 L93 30 L91.6 26.4 L88 25 L91.6 23.6 Z" fill="hsl(48, 100%, 86%)"/>
     <path d="M46 61 V54 M64 65 V58 M82 61 V54" stroke="hsl(50, 100%, 86%)" stroke-width="1.4" stroke-linecap="round" opacity="0.78"/>`,
    'hsla(46, 100%, 68%, 0.34)',
    `<linearGradient id="ca-apotheosis-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsla(52, 100%, 96%, 0.94)"/><stop offset="52%" stop-color="hsla(44, 100%, 66%, 0.56)"/><stop offset="100%" stop-color="hsla(36, 94%, 48%, 0.08)"/></linearGradient><linearGradient id="ca-apotheosis-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(42, 62%, 52%)"/><stop offset="100%" stop-color="hsl(228, 44%, 16%)"/></linearGradient><linearGradient id="ca-apotheosis-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="50%" stop-color="hsl(42, 96%, 62%)"/><stop offset="100%" stop-color="hsl(32, 86%, 38%)"/></linearGradient>`
  ),
  hand_of_greed: wrapArtSvg(
    'hand_of_greed',
    'hsl(36, 48%, 16%)',
    'hsl(240, 32%, 8%)',
    `<ellipse cx="66" cy="36" rx="44" ry="26" fill="hsla(44, 100%, 56%, 0.16)"/>
     <path d="M8 72 Q26 56 50 61 Q74 52 100 60 Q114 57 126 72 Z" fill="hsl(32, 72%, 22%)" opacity="0.88"/>
     <ellipse cx="64" cy="64" rx="34" ry="6" fill="rgba(0,0,0,0.45)"/>
     <path d="M22 65 L34 45 L50 51 L41 69 Z" fill="url(#ca-hand_of_greed-gold)" stroke="hsl(28, 76%, 22%)" stroke-width="1.3"/>
     <path d="M35 45 L46 28 L66 26 L75 38 L62 52 L48 51 Z" fill="url(#ca-hand_of_greed-gold)" stroke="hsl(28, 76%, 20%)" stroke-width="1.3"/>
     <path d="M47 28 Q50 14 59 16 L61 28 M58 26 Q64 11 73 16 L71 30 M68 28 Q78 16 84 24 L76 37 M74 36 Q86 29 88 38 L74 46 M46 42 Q38 33 45 27" fill="url(#ca-hand_of_greed-gold)" stroke="hsl(26, 78%, 18%)" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M49 32 L63 30 M52 21 L57 20 M64 18 L70 19 M75 23 L80 25" stroke="hsl(54, 100%, 92%)" stroke-width="1.4" stroke-linecap="round" opacity="0.85"/>
     <polygon points="55,35 61,39 56,45 50,41" fill="url(#ca-hand_of_greed-gem)" stroke="hsl(52, 100%, 84%)" stroke-width="0.9"/>
     <ellipse cx="89" cy="46" rx="6.5" ry="4.5" transform="rotate(-18 89 46)" fill="url(#ca-hand_of_greed-coin)" stroke="hsl(30, 78%, 26%)" stroke-width="1"/>
     <ellipse cx="99" cy="54" rx="7" ry="4.6" transform="rotate(14 99 54)" fill="url(#ca-hand_of_greed-coin)" stroke="hsl(30, 78%, 26%)" stroke-width="1"/>
     <ellipse cx="80" cy="57" rx="6.5" ry="4.2" transform="rotate(-8 80 57)" fill="url(#ca-hand_of_greed-coin)" stroke="hsl(30, 78%, 26%)" stroke-width="1"/>
     <ellipse cx="95" cy="34" rx="5.5" ry="3.8" transform="rotate(24 95 34)" fill="url(#ca-hand_of_greed-coin)" stroke="hsl(30, 78%, 26%)" stroke-width="0.9"/>
     <polygon points="106,38 112,43 107,50 101,45" fill="url(#ca-hand_of_greed-gem)" stroke="hsl(50, 100%, 86%)" stroke-width="0.9"/>
     <polygon points="73,10 78,14 74,19 69,15" fill="hsl(154, 88%, 54%)" stroke="hsl(148, 100%, 84%)" stroke-width="0.8"/>
     <path d="M104 20 L105.6 24.4 L110 26 L105.6 27.6 L104 32 L102.4 27.6 L98 26 L102.4 24.4 Z" fill="hsl(54, 100%, 92%)"/>
     <path d="M31 20 L32.2 23.2 L35.5 24.5 L32.2 25.8 L31 29 L29.8 25.8 L26.5 24.5 L29.8 23.2 Z" fill="hsl(50, 100%, 88%)"/>`,
    'hsla(44, 100%, 58%, 0.30)',
    `<linearGradient id="ca-hand_of_greed-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 86%)"/><stop offset="48%" stop-color="hsl(42, 94%, 52%)"/><stop offset="100%" stop-color="hsl(28, 80%, 24%)"/></linearGradient><radialGradient id="ca-hand_of_greed-coin" cx="35%" cy="35%" r="65%"><stop offset="0%" stop-color="hsl(54, 100%, 88%)"/><stop offset="65%" stop-color="hsl(42, 96%, 52%)"/><stop offset="100%" stop-color="hsl(30, 82%, 30%)"/></radialGradient><linearGradient id="ca-hand_of_greed-gem" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(348, 100%, 74%)"/><stop offset="55%" stop-color="hsl(352, 88%, 46%)"/><stop offset="100%" stop-color="hsl(342, 80%, 22%)"/></linearGradient>`
  ),
  apparition: wrapArtSvg(
    'apparition',
    'hsl(216, 44%, 17%)',
    'hsl(232, 48%, 7%)',
    `<circle cx="92" cy="19" r="24" fill="url(#ca-apparition-moon)"/>
     <circle cx="92" cy="19" r="10.5" fill="hsl(202, 78%, 92%)" opacity="0.88"/>
     <path d="M0 58 Q30 50 64 56 Q96 62 128 52 L128 72 L0 72 Z" fill="hsla(210, 64%, 72%, 0.14)"/>
     <path d="M52 65 Q54 34 66 15 Q78 14 82 32 Q87 49 91 64 Q81 55 74 63 Q66 54 52 65 Z" fill="none" stroke="hsla(192, 94%, 82%, 0.32)" stroke-width="1.4"/>
     <path d="M36 67 Q40 36 48 18 Q58 7 68 18 Q77 36 80 65 Q70 55 62 65 Q53 55 46 66 Q41 61 36 67 Z" fill="url(#ca-apparition-cloak)" stroke="hsla(192, 100%, 88%, 0.72)" stroke-width="1.3"/>
     <path d="M51 24 Q58 13 65 24 Q62 32 58 33 Q54 32 51 24 Z" fill="hsla(228, 56%, 12%, 0.82)"/>
     <path d="M47 56 Q52 38 58 35 Q64 39 69 57" fill="none" stroke="hsla(192, 100%, 92%, 0.48)" stroke-width="1.5"/>
     <ellipse cx="55.2" cy="24.5" rx="2.1" ry="1.3" fill="hsl(186, 100%, 90%)"/>
     <ellipse cx="61.2" cy="24.5" rx="2.1" ry="1.3" fill="hsl(186, 100%, 90%)"/>
     <path d="M46 39 Q34 38 27 45 M70 39 Q82 36 89 42" fill="none" stroke="hsla(192, 96%, 86%, 0.62)" stroke-width="2" stroke-linecap="round"/>
     <path d="M8 46 Q40 34 68 43 Q96 52 122 36" fill="none" stroke="url(#ca-apparition-veil)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M16 56 Q48 48 76 54 Q102 60 120 48" fill="none" stroke="url(#ca-apparition-veil)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="30" cy="24" r="1.8" fill="hsl(190, 100%, 88%)" opacity="0.8"/>
     <circle cx="80" cy="48" r="1.5" fill="hsl(190, 100%, 88%)" opacity="0.72"/>
     <circle cx="40" cy="14" r="1.3" fill="hsl(200, 100%, 92%)" opacity="0.75"/>`,
    'hsla(194, 88%, 76%, 0.26)',
    `<radialGradient id="ca-apparition-moon" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(198, 96%, 94%, 0.92)"/><stop offset="46%" stop-color="hsla(204, 84%, 76%, 0.34)"/><stop offset="100%" stop-color="hsla(220, 64%, 40%, 0)"/></radialGradient><linearGradient id="ca-apparition-cloak" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsla(192, 92%, 90%, 0.84)"/><stop offset="54%" stop-color="hsla(208, 72%, 64%, 0.44)"/><stop offset="100%" stop-color="hsla(224, 54%, 34%, 0.04)"/></linearGradient><linearGradient id="ca-apparition-veil" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(194, 92%, 82%, 0)"/><stop offset="50%" stop-color="hsla(192, 96%, 86%, 0.58)"/><stop offset="100%" stop-color="hsla(210, 80%, 72%, 0)"/></linearGradient>`
  ),
  master_of_strategy: wrapArtSvg(
    'master_of_strategy',
    'hsl(218, 28%, 20%)',
    'hsl(226, 36%, 9%)',
    `<ellipse cx="64" cy="28" rx="46" ry="22" fill="hsla(44, 88%, 62%, 0.14)"/>
     <polygon points="24,42 104,42 118,67 10,67" fill="url(#ca-master_of_strategy-board)" stroke="hsl(42, 56%, 52%)" stroke-width="1.2"/>
     <path d="M44 42 H64 L64 53 H39 Z M84 42 H104 L110 53 H87 Z M18 53 H39 L33 67 H10 Z M64 53 H87 L92 67 H64 Z" fill="hsla(224, 34%, 11%, 0.78)"/>
     <path d="M10 67 L118 67 L118 70 L10 70 Z" fill="hsl(36, 48%, 30%)"/>
     <path d="M88 45 L91 31 L88 28 H99 L96 31 L99 45 Z" fill="hsl(226, 26%, 18%)" stroke="hsl(218, 22%, 44%)" stroke-width="1"/>
     <ellipse cx="47" cy="57" rx="13" ry="4" fill="rgba(0,0,0,0.48)"/>
     <path d="M36 57 L39 51 L41 34 L37 26 L44 27 L47 22 L50 27 L57 26 L53 34 L55 51 L58 57 Z" fill="url(#ca-master_of_strategy-king)" stroke="hsl(220, 28%, 22%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M47 11 V22 M43 15 H51" stroke="hsl(46, 92%, 78%)" stroke-width="2.1" stroke-linecap="round"/>
     <path d="M42 52 L43.5 34 L41 28" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.4" opacity="0.72" stroke-linecap="round"/>
     <path d="M39 51 H55 M40 34 H54" stroke="hsl(42, 74%, 56%)" stroke-width="1.1"/>
     <ellipse cx="95" cy="57" rx="11" ry="4.2" fill="none" stroke="hsl(46, 100%, 72%)" stroke-width="1.3" stroke-dasharray="3 2"/>
     <path d="M56 26 Q82 14 96 48" fill="none" stroke="url(#ca-master_of_strategy-arrow)" stroke-width="3" stroke-linecap="round"/>
     <polygon points="97,54 89,45 101,44" fill="hsl(50, 100%, 84%)"/>
     <path d="M90 57 H100 M95 54 V60" stroke="hsl(48, 100%, 82%)" stroke-width="1.1"/>
     <circle cx="75" cy="21" r="1.7" fill="hsl(50, 100%, 88%)"/>
     <circle cx="88" cy="28" r="1.3" fill="hsl(46, 100%, 80%)"/>`,
    'hsla(44, 86%, 64%, 0.24)',
    `<linearGradient id="ca-master_of_strategy-board" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(218, 22%, 34%)"/><stop offset="100%" stop-color="hsl(222, 26%, 16%)"/></linearGradient><linearGradient id="ca-master_of_strategy-king" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(46, 48%, 94%)"/><stop offset="56%" stop-color="hsl(212, 22%, 72%)"/><stop offset="100%" stop-color="hsl(220, 26%, 34%)"/></linearGradient><linearGradient id="ca-master_of_strategy-arrow" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(46, 100%, 76%, 0.22)"/><stop offset="65%" stop-color="hsl(44, 100%, 66%)"/><stop offset="100%" stop-color="hsl(52, 100%, 88%)"/></linearGradient>`
  ),
  sadistic_nature: wrapArtSvg(
    'sadistic_nature',
    'hsl(342, 54%, 17%)',
    'hsl(292, 46%, 7%)',
    `<circle cx="64" cy="34" r="29" fill="hsla(348, 92%, 46%, 0.20)"/>
     <path d="M4 18 Q24 28 40 24 M124 18 Q104 28 88 24 M6 58 Q26 48 44 54 M122 58 Q102 48 84 54" fill="none" stroke="hsl(326, 44%, 18%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M10 14 L118 58 M118 14 L10 58" fill="none" stroke="url(#ca-sadistic_nature-chain)" stroke-width="4" stroke-dasharray="9 4" stroke-linecap="round"/>
     <path d="M22 19 L19 12 L27 17 M106 19 L109 12 L101 17 M24 52 L18 56 L24 46 M104 52 L110 56 L104 46" fill="hsl(346, 76%, 48%)"/>
     <path d="M64 46 Q59 56 64 69" fill="none" stroke="url(#ca-sadistic_nature-stem)" stroke-width="4.2" stroke-linecap="round"/>
     <polygon points="61,52 51,49 60,57" fill="hsl(344, 78%, 42%)"/>
     <polygon points="66,57 76,54 66,62" fill="hsl(344, 78%, 42%)"/>
     <path d="M44 33 Q42 16 64 14 Q86 16 84 33 Q82 48 64 49 Q46 48 44 33 Z" fill="hsl(340, 82%, 18%)" stroke="hsl(346, 86%, 44%)" stroke-width="1.2"/>
     <path d="M48 31 Q51 17 64 19 Q77 17 80 31 Q76 44 64 45 Q52 44 48 31 Z" fill="url(#ca-sadistic_nature-rose)"/>
     <path d="M55 31 Q57 22 65 23 Q73 25 71 34 Q68 41 60 39 Q54 36 58 29 Q62 25 67 29 Q68 33 63 34" fill="none" stroke="hsl(348, 100%, 74%)" stroke-width="1.7" stroke-linecap="round"/>
     <path d="M50 25 Q56 18 64 20 M78 26 Q73 19 66 20" fill="none" stroke="hsl(352, 100%, 84%)" stroke-width="1.2" opacity="0.72"/>
     <path d="M50 56 Q48 62 51 64 Q54 62 50 56 Z" fill="hsl(352, 96%, 54%)"/>
     <path d="M77 60 Q75 65 78 67 Q81 65 77 60 Z" fill="hsl(352, 96%, 54%)"/>
     <path d="M64 48 Q62 53 64 55 Q66 53 64 48 Z" fill="hsl(352, 100%, 64%)"/>
     <path d="M36 16 L37.3 19.7 L41 21 L37.3 22.3 L36 26 L34.7 22.3 L31 21 L34.7 19.7 Z" fill="hsl(354, 100%, 82%)"/>
     <path d="M92 46 L93.2 49.2 L96.5 50.5 L93.2 51.8 L92 55 L90.8 51.8 L87.5 50.5 L90.8 49.2 Z" fill="hsl(354, 100%, 82%)"/>`,
    'hsla(348, 92%, 52%, 0.28)',
    `<radialGradient id="ca-sadistic_nature-rose" cx="42%" cy="38%" r="62%"><stop offset="0%" stop-color="hsl(348, 98%, 62%)"/><stop offset="52%" stop-color="hsl(342, 86%, 34%)"/><stop offset="100%" stop-color="hsl(336, 78%, 14%)"/></radialGradient><linearGradient id="ca-sadistic_nature-chain" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(342, 22%, 62%)"/><stop offset="50%" stop-color="hsl(334, 24%, 30%)"/><stop offset="100%" stop-color="hsl(312, 30%, 12%)"/></linearGradient><linearGradient id="ca-sadistic_nature-stem" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(338, 46%, 24%)"/><stop offset="100%" stop-color="hsl(296, 44%, 10%)"/></linearGradient>`
  ),
  panache: wrapArtSvg(
    'panache',
    'hsl(214, 46%, 19%)',
    'hsl(246, 42%, 9%)',
    `<polygon points="18,0 74,0 112,72 48,72" fill="hsla(46, 100%, 70%, 0.10)"/>
     <path d="M12 58 Q36 16 74 28 Q106 38 118 14" fill="none" stroke="hsla(46, 100%, 70%, 0.34)" stroke-width="5.5" stroke-linecap="round"/>
     <path d="M14 58 Q38 18 74 29 Q106 38 117 15" fill="none" stroke="hsl(48, 100%, 82%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M18 63 L106 19" stroke="hsl(210, 42%, 88%)" stroke-width="2.1" stroke-linecap="round"/>
     <path d="M16 58 Q26 51 31 61 Q23 68 16 58 Z" fill="none" stroke="url(#ca-panache-gold)" stroke-width="2"/>
     <path d="M62 34 Q76 9 102 10 Q108 18 96 26 Q82 32 66 39 Z" fill="url(#ca-panache-plume)" stroke="hsl(48, 100%, 84%)" stroke-width="1.1"/>
     <path d="M65 36 Q81 18 100 13" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="1.3" stroke-linecap="round"/>
     <ellipse cx="56" cy="54" rx="30" ry="7.5" transform="rotate(-8 56 54)" fill="rgba(0,0,0,0.44)"/>
     <path d="M24 51 Q54 41 88 47 Q76 58 55 58 Q34 58 24 51 Z" fill="url(#ca-panache-hat)" stroke="url(#ca-panache-gold)" stroke-width="1.4"/>
     <path d="M38 48 L43 27 Q56 21 69 27 L72 45 Z" fill="url(#ca-panache-hat)" stroke="hsl(224, 48%, 54%)" stroke-width="1.1"/>
     <path d="M39 44 Q55 39 71 42 L72 46 Q55 43 38 48 Z" fill="url(#ca-panache-gold)"/>
     <rect x="52" y="40.5" width="7" height="5.5" rx="1" fill="hsl(228, 48%, 20%)" stroke="hsl(52, 100%, 86%)" stroke-width="1.2"/>
     <path d="M44 30 Q54 26 64 29" fill="none" stroke="hsla(214, 70%, 82%, 0.45)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M107 12 L108.8 16.2 L113 18 L108.8 19.8 L107 24 L105.2 19.8 L101 18 L105.2 16.2 Z" fill="hsl(52, 100%, 92%)"/>
     <path d="M24 22 L25.6 25.4 L29 27 L25.6 28.6 L24 32 L22.4 28.6 L19 27 L22.4 25.4 Z" fill="hsl(168, 100%, 80%)"/>
     <path d="M96 48 L97.3 51.2 L100.5 52.5 L97.3 53.8 L96 57 L94.7 53.8 L91.5 52.5 L94.7 51.2 Z" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(46, 98%, 66%, 0.28)',
    `<linearGradient id="ca-panache-hat" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(226, 48%, 38%)"/><stop offset="100%" stop-color="hsl(240, 52%, 14%)"/></linearGradient><linearGradient id="ca-panache-plume" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(176, 84%, 44%)"/><stop offset="56%" stop-color="hsl(166, 92%, 62%)"/><stop offset="100%" stop-color="hsl(48, 100%, 82%)"/></linearGradient><linearGradient id="ca-panache-gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(38, 86%, 46%)"/><stop offset="50%" stop-color="hsl(50, 100%, 82%)"/><stop offset="100%" stop-color="hsl(34, 80%, 38%)"/></linearGradient>`
  ),
  thinking_ahead: wrapArtSvg(
    'thinking_ahead',
    'hsl(210, 44%, 19%)',
    'hsl(228, 46%, 9%)',
    `<circle cx="52" cy="36" r="28" fill="hsla(194, 94%, 60%, 0.16)"/>
     <circle cx="52" cy="36" r="23" fill="none" stroke="hsla(44, 86%, 64%, 0.36)" stroke-width="1" stroke-dasharray="3 3"/>
     <ellipse cx="52" cy="36" rx="28" ry="11" transform="rotate(-24 52 36)" fill="none" stroke="url(#ca-thinking_ahead-brass)" stroke-width="1.3" opacity="0.8"/>
     <path d="M17 16 Q7 36 17 56 Q24 48 24 36 Q24 24 17 16 Z" fill="hsla(196, 86%, 62%, 0.32)" stroke="hsl(190, 96%, 78%)" stroke-width="1.6"/>
     <path d="M29 36 Q41 21 52 21 Q63 21 75 36 Q63 51 52 51 Q41 51 29 36 Z" fill="hsl(222, 46%, 14%)" stroke="url(#ca-thinking_ahead-brass)" stroke-width="1.7"/>
     <circle cx="52" cy="36" r="9.5" fill="url(#ca-thinking_ahead-orb)" stroke="hsl(190, 100%, 84%)" stroke-width="1"/>
     <circle cx="52" cy="36" r="4" fill="hsl(226, 62%, 12%)"/>
     <circle cx="49.5" cy="33.5" r="2" fill="hsl(0, 0%, 100%)"/>
     <path d="M74 36 L90 25 M74 36 L92 48" stroke="hsl(48, 100%, 78%)" stroke-width="1.2" stroke-dasharray="2.5 2.5"/>
     <polygon points="86,13 103,10 107,33 90,36" fill="url(#ca-thinking_ahead-card)" stroke="hsl(188, 100%, 88%)" stroke-width="1.3"/>
     <polygon points="94,35 111,38 106,61 89,58" fill="url(#ca-thinking_ahead-card)" stroke="hsl(48, 100%, 82%)" stroke-width="1.3"/>
     <path d="M93 21 L101 19 M94 26 L100 25 M98 46 L105 48 M97 51 L103 52" stroke="hsl(52, 100%, 92%)" stroke-width="1.3" stroke-linecap="round"/>
     <polygon points="52,11 54.5,17 49.5,17" fill="hsl(48, 96%, 76%)"/>
     <polygon points="52,61 54.5,55 49.5,55" fill="hsl(48, 96%, 76%)"/>
     <path d="M81 12 L82.3 15.2 L85.5 16.5 L82.3 17.8 L81 21 L79.7 17.8 L76.5 16.5 L79.7 15.2 Z" fill="hsl(50, 100%, 90%)"/>
     <circle cx="28" cy="56" r="1.6" fill="hsl(190, 100%, 84%)"/>`,
    'hsla(192, 92%, 62%, 0.26)',
    `<radialGradient id="ca-thinking_ahead-orb" cx="46%" cy="46%" r="54%"><stop offset="0%" stop-color="hsl(186, 100%, 88%)"/><stop offset="48%" stop-color="hsl(198, 92%, 52%)"/><stop offset="100%" stop-color="hsl(224, 68%, 22%)"/></radialGradient><linearGradient id="ca-thinking_ahead-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(48, 96%, 78%)"/><stop offset="55%" stop-color="hsl(38, 82%, 48%)"/><stop offset="100%" stop-color="hsl(28, 66%, 24%)"/></linearGradient><linearGradient id="ca-thinking_ahead-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(192, 96%, 84%, 0.85)"/><stop offset="100%" stop-color="hsla(216, 72%, 44%, 0.45)"/></linearGradient>`
  ),
  violence: wrapArtSvg(
    'violence',
    'hsl(6, 52%, 18%)',
    'hsl(352, 48%, 8%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-violence-fury)"/>
     <polygon points="64,6 71,21 90,14 78,29 102,36 79,43 92,59 71,50 64,66 57,50 36,59 49,43 26,36 50,29 38,14 57,21" fill="hsla(356, 86%, 32%, 0.42)"/>
     <path d="M18 20 Q64 4 110 22" fill="none" stroke="url(#ca-violence-blood)" stroke-width="2.4" opacity="0.72" stroke-linecap="round"/>
     <path d="M22 55 L86 12 L97 19 L34 62 Z" fill="url(#ca-violence-steel)" stroke="hsl(356, 62%, 22%)" stroke-width="1.3"/>
     <path d="M15 62 L28 52 L34 59 L21 67 Z" fill="hsl(24, 48%, 24%)" stroke="hsl(40, 74%, 56%)" stroke-width="1.1"/>
     <path d="M26 15 L98 54 L90 63 L21 24 Z" fill="url(#ca-violence-steel)" stroke="hsl(356, 62%, 22%)" stroke-width="1.3"/>
     <path d="M94 52 L110 61 L105 67 L89 58 Z" fill="hsl(24, 48%, 24%)" stroke="hsl(40, 74%, 56%)" stroke-width="1.1"/>
     <path d="M58 10 L70 10 L67 52 L64 62 L61 52 Z" fill="url(#ca-violence-steel)" stroke="hsl(220, 26%, 16%)" stroke-width="1.2"/>
     <path d="M29 55 L88 15 M30 22 L90 54" stroke="hsl(0, 0%, 100%)" stroke-width="1.4" opacity="0.82" stroke-linecap="round"/>
     <path d="M51 35 L77 35" stroke="hsl(354, 100%, 62%)" stroke-width="2.4" stroke-linecap="round"/>
     <polygon points="64,26 67,33 75,36 67,39 64,46 61,39 53,36 61,33" fill="hsl(46, 100%, 84%)"/>
     <polygon points="24,38 32,35 28,43" fill="hsl(20, 96%, 62%)"/>
     <polygon points="103,32 95,35 100,41" fill="hsl(20, 96%, 62%)"/>
     <path d="M16 42 Q40 58 64 56 Q88 58 112 42" fill="none" stroke="url(#ca-violence-blood)" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
     <circle cx="44" cy="14" r="1.8" fill="hsl(44, 100%, 78%)"/>
     <circle cx="84" cy="58" r="1.7" fill="hsl(22, 100%, 68%)"/>`,
    'hsla(10, 96%, 54%, 0.30)',
    `<radialGradient id="ca-violence-fury" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(24, 100%, 62%, 0.68)"/><stop offset="56%" stop-color="hsla(356, 92%, 44%, 0.28)"/><stop offset="100%" stop-color="hsla(350, 80%, 20%, 0)"/></radialGradient><linearGradient id="ca-violence-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(210, 26%, 90%)"/><stop offset="50%" stop-color="hsl(216, 18%, 48%)"/><stop offset="100%" stop-color="hsl(222, 22%, 18%)"/></linearGradient><linearGradient id="ca-violence-blood" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(354, 96%, 56%)"/><stop offset="100%" stop-color="hsl(16, 100%, 60%)"/></linearGradient>`
  ),
  flash_of_steel: wrapArtSvg(
    'flash_of_steel',
    'hsl(208, 44%, 19%)',
    'hsl(224, 48%, 8%)',
    `<polygon points="0,56 96,0 128,0 26,72 0,72" fill="hsla(200, 96%, 76%, 0.11)"/>
     <path d="M14 50 Q52 14 116 12 Q78 32 32 58 Z" fill="url(#ca-flash_of_steel-slash)"/>
     <path d="M8 62 L24 51 L29 58 L13 69 Z" fill="hsl(222, 32%, 18%)" stroke="hsl(42, 62%, 56%)" stroke-width="1.2"/>
     <polygon points="36,48 114,12 103,23 41,54" fill="hsl(216, 26%, 32%)"/>
     <polygon points="34,45 114,12 97,16 36,48" fill="url(#ca-flash_of_steel-blade)" stroke="hsl(198, 90%, 92%)" stroke-width="0.9"/>
     <line x1="39" y1="47" x2="103" y2="17" stroke="hsl(218, 34%, 22%)" stroke-width="1.1"/>
     <line x1="35" y1="44" x2="112" y2="12" stroke="hsl(0, 0%, 100%)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M27 39 L44 57" stroke="hsl(206, 36%, 78%)" stroke-width="3.4" stroke-linecap="round"/>
     <path d="M18 57 L34 49" stroke="hsl(222, 28%, 26%)" stroke-width="5.2" stroke-linecap="round"/>
     <circle cx="17" cy="58" r="3" fill="hsl(44, 78%, 64%)" stroke="hsl(220, 32%, 18%)" stroke-width="1"/>
     <circle cx="80" cy="27" r="14" fill="url(#ca-flash_of_steel-gleam)"/>
     <path d="M80 7 L82.4 24.6 L104 27 L82.4 29.4 L80 47 L77.6 29.4 L56 27 L77.6 24.6 Z" fill="hsl(0, 0%, 100%)"/>
     <path d="M18 28 L46 16 M74 56 L108 42" stroke="hsla(196, 100%, 86%, 0.56)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="98" cy="40" r="1.7" fill="hsl(196, 100%, 90%)"/>
     <circle cx="58" cy="14" r="1.5" fill="hsl(196, 100%, 90%)"/>`,
    'hsla(198, 96%, 76%, 0.32)',
    `<linearGradient id="ca-flash_of_steel-blade" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsl(214, 34%, 44%)"/><stop offset="52%" stop-color="hsl(202, 58%, 86%)"/><stop offset="100%" stop-color="hsl(0, 0%, 100%)"/></linearGradient><radialGradient id="ca-flash_of_steel-gleam" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(0, 0%, 100%)"/><stop offset="38%" stop-color="hsla(196, 100%, 78%, 0.85)"/><stop offset="100%" stop-color="hsla(206, 94%, 56%, 0)"/></radialGradient><linearGradient id="ca-flash_of_steel-slash" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsla(198, 96%, 74%, 0.04)"/><stop offset="58%" stop-color="hsla(194, 100%, 78%, 0.42)"/><stop offset="100%" stop-color="hsla(0, 0%, 100%, 0.88)"/></linearGradient>`
  ),
  finesse: wrapArtSvg(
    'finesse',
    'hsl(188, 38%, 19%)',
    'hsl(214, 42%, 9%)',
    `<ellipse cx="64" cy="36" rx="46" ry="24" fill="hsla(178, 88%, 62%, 0.14)"/>
     <path d="M12 52 C26 14 54 14 64 36 C74 58 102 58 116 20" fill="none" stroke="url(#ca-finesse-silk)" stroke-width="7.5" stroke-linecap="round"/>
     <path d="M10 18 L55 34 L34 20" fill="none" stroke="hsla(352, 74%, 56%, 0.64)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M40 57 Q44 26 68 18 Q58 38 66 56 Q52 60 40 57 Z" fill="hsla(190, 52%, 34%, 0.56)" stroke="url(#ca-finesse-silver)" stroke-width="1.5"/>
     <path d="M45 53 Q48 30 65 23" fill="none" stroke="hsl(46, 92%, 74%)" stroke-width="1.2" opacity="0.8"/>
     <line x1="24" y1="58" x2="108" y2="14" stroke="url(#ca-finesse-silver)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M21 52 Q34 45 38 56 Q28 65 21 52 Z" fill="none" stroke="hsl(46, 94%, 72%)" stroke-width="1.8"/>
     <circle cx="22" cy="59" r="2.6" fill="hsl(46, 96%, 76%)"/>
     <circle cx="62" cy="38" r="12" fill="url(#ca-finesse-spark)"/>
     <path d="M62 27 L64 36 L73 38 L64 40 L62 49 L60 40 L51 38 L60 36 Z" fill="hsl(52, 100%, 94%)"/>
     <path d="M18 48 C34 22 52 24 64 36 C76 48 94 50 112 24" fill="none" stroke="hsl(172, 100%, 86%)" stroke-width="1.5" stroke-linecap="round"/>
     <polygon points="94,40 107,38 110,55 97,57" fill="hsla(176, 86%, 76%, 0.36)" stroke="hsl(174, 96%, 84%)" stroke-width="1.2"/>
     <path d="M99 47 L105 46" stroke="hsl(52, 100%, 90%)" stroke-width="1.4" stroke-linecap="round"/>
     <circle cx="86" cy="20" r="1.7" fill="hsl(174, 100%, 88%)"/>
     <circle cx="42" cy="16" r="1.5" fill="hsl(48, 100%, 86%)"/>`,
    'hsla(176, 86%, 68%, 0.26)',
    `<linearGradient id="ca-finesse-silk" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(172, 96%, 82%, 0.85)"/><stop offset="56%" stop-color="hsla(192, 84%, 56%, 0.44)"/><stop offset="100%" stop-color="hsla(212, 74%, 34%, 0.08)"/></linearGradient><linearGradient id="ca-finesse-silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(0, 0%, 100%)"/><stop offset="55%" stop-color="hsl(194, 34%, 76%)"/><stop offset="100%" stop-color="hsl(212, 34%, 36%)"/></linearGradient><radialGradient id="ca-finesse-spark" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(52, 100%, 94%)"/><stop offset="50%" stop-color="hsla(174, 100%, 72%, 0.65)"/><stop offset="100%" stop-color="hsla(192, 92%, 52%, 0)"/></radialGradient>`
  ),
  dramatic_entrance: wrapArtSvg(
    'dramatic_entrance',
    'hsl(28, 52%, 18%)',
    'hsl(240, 38%, 8%)',
    `<circle cx="64" cy="33" r="34" fill="url(#ca-dramatic_entrance-burst)"/>
     <polygon points="64,34 20,0 44,0" fill="hsla(48, 100%, 84%, 0.22)"/>
     <polygon points="64,34 84,0 108,0" fill="hsla(48, 100%, 84%, 0.22)"/>
     <polygon points="64,34 128,16 128,40" fill="hsla(46, 100%, 78%, 0.18)"/>
     <polygon points="10,10 38,16 32,62 6,54" fill="url(#ca-dramatic_entrance-door)" stroke="hsl(38, 66%, 54%)" stroke-width="1.3"/>
     <polygon points="118,10 90,16 96,62 122,54" fill="url(#ca-dramatic_entrance-door)" stroke="hsl(38, 66%, 54%)" stroke-width="1.3"/>
     <path d="M12 24 L35 28 M10 44 L33 48 M116 24 L93 28 M118 44 L95 48" stroke="hsl(220, 18%, 22%)" stroke-width="2.2"/>
     <ellipse cx="64" cy="61" rx="32" ry="6" fill="none" stroke="hsl(44, 100%, 74%)" stroke-width="1.8" opacity="0.82"/>
     <path d="M56 26 Q38 30 30 50 Q48 48 61 44 Q78 52 96 46 Q84 28 70 25 Z" fill="url(#ca-dramatic_entrance-cape)" stroke="hsl(48, 100%, 80%)" stroke-width="1.2"/>
     <path d="M64 17 C68 17 70 21 67 25 L73 39 L67 57 L62 45 L55 56 L58 37 L53 26 L61 24 C59 20 61 17 64 17 Z" fill="hsl(236, 42%, 12%)" stroke="hsl(50, 100%, 86%)" stroke-width="1.3" stroke-linejoin="round"/>
     <polygon points="36,12 46,16 40,21" fill="hsl(30, 58%, 48%)"/>
     <polygon points="91,13 82,17 88,22" fill="hsl(30, 58%, 48%)"/>
     <polygon points="44,54 52,58 46,63" fill="hsl(42, 90%, 66%)"/>
     <polygon points="84,54 76,58 82,63" fill="hsl(42, 90%, 66%)"/>
     <path d="M64 6 L65.8 10.2 L70 12 L65.8 13.8 L64 18 L62.2 13.8 L58 12 L62.2 10.2 Z" fill="hsl(54, 100%, 96%)"/>
     <path d="M24 62 Q44 58 64 62 Q84 58 104 62" fill="none" stroke="hsla(48, 100%, 86%, 0.65)" stroke-width="1.4" stroke-linecap="round"/>`,
    'hsla(44, 100%, 66%, 0.34)',
    `<radialGradient id="ca-dramatic_entrance-burst" cx="50%" cy="44%" r="54%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="44%" stop-color="hsla(42, 100%, 64%, 0.72)"/><stop offset="100%" stop-color="hsla(24, 96%, 46%, 0)"/></radialGradient><linearGradient id="ca-dramatic_entrance-door" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(26, 46%, 34%)"/><stop offset="100%" stop-color="hsl(20, 44%, 13%)"/></linearGradient><linearGradient id="ca-dramatic_entrance-cape" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(352, 82%, 44%)"/><stop offset="100%" stop-color="hsl(246, 42%, 14%)"/></linearGradient>`
  ),
  blind: wrapArtSvg(
    'blind',
    'hsl(46, 36%, 20%)',
    'hsl(230, 34%, 8%)',
    `<polygon points="64,3 72,22 98,8 82,29 120,36 82,43 98,64 72,50 64,69 56,50 30,64 46,43 8,36 46,29 30,8 56,22" fill="hsla(48, 100%, 76%, 0.18)"/>
     <path d="M18 36 Q42 13 64 13 Q86 13 110 36 Q86 59 64 59 Q42 59 18 36 Z" fill="hsl(232, 34%, 11%)" stroke="hsl(46, 62%, 58%)" stroke-width="1.5"/>
     <path d="M24 36 Q44 18 64 18 Q84 18 104 36 Q84 54 64 54 Q44 54 24 36 Z" fill="url(#ca-blind-sclera)"/>
     <circle cx="64" cy="36" r="14" fill="hsl(232, 42%, 22%)" stroke="hsl(48, 86%, 72%)" stroke-width="1.4"/>
     <circle cx="64" cy="36" r="7.5" fill="hsl(234, 52%, 9%)"/>
     <path d="M24 26 Q64 10 104 26" fill="none" stroke="hsl(234, 42%, 10%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M26 48 Q64 62 102 48" fill="none" stroke="hsl(234, 42%, 10%)" stroke-width="2.6" stroke-linecap="round"/>
     <polygon points="10,58 112,8 118,16 16,66" fill="url(#ca-blind-beam)"/>
     <circle cx="64" cy="36" r="18" fill="url(#ca-blind-flash)"/>
     <path d="M64 8 L67.2 32.8 L96 36 L67.2 39.2 L64 64 L60.8 39.2 L32 36 L60.8 32.8 Z" fill="hsl(56, 100%, 98%)"/>
     <path d="M40 20 L88 52 M88 20 L40 52" stroke="hsla(54, 100%, 94%, 0.72)" stroke-width="1.3" stroke-linecap="round"/>
     <circle cx="34" cy="24" r="3" fill="none" stroke="hsla(52, 100%, 90%, 0.65)" stroke-width="1.2"/>
     <circle cx="94" cy="48" r="3.5" fill="none" stroke="hsla(52, 100%, 90%, 0.65)" stroke-width="1.2"/>
     <circle cx="96" cy="22" r="1.8" fill="hsl(56, 100%, 96%)"/>
     <circle cx="32" cy="50" r="1.8" fill="hsl(56, 100%, 96%)"/>`,
    'hsla(50, 100%, 82%, 0.34)',
    `<radialGradient id="ca-blind-flash" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(0, 0%, 100%)"/><stop offset="38%" stop-color="hsl(52, 100%, 78%)"/><stop offset="100%" stop-color="hsla(40, 100%, 54%, 0)"/></radialGradient><linearGradient id="ca-blind-beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsla(54, 100%, 96%, 0.15)"/><stop offset="50%" stop-color="hsla(54, 100%, 96%, 0.96)"/><stop offset="100%" stop-color="hsla(44, 100%, 68%, 0.15)"/></linearGradient><linearGradient id="ca-blind-sclera" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(48, 42%, 88%)"/><stop offset="100%" stop-color="hsl(228, 22%, 44%)"/></linearGradient>`
  ),
  trip: wrapArtSvg(
    'trip',
    'hsl(34, 34%, 19%)',
    'hsl(218, 32%, 9%)',
    `<path d="M0 50 L128 50 L128 72 L0 72 Z" fill="url(#ca-trip-ground)"/>
     <path d="M12 58 H38 M52 63 H84 M96 57 H120 M24 67 H56" stroke="rgba(0,0,0,0.34)" stroke-width="1.4" stroke-linecap="round"/>
     <ellipse cx="66" cy="59" rx="30" ry="6" fill="rgba(0,0,0,0.46)"/>
     <polygon points="15,44 21,42 23,60 17,61" fill="hsl(26, 46%, 30%)" stroke="hsl(36, 56%, 52%)" stroke-width="1"/>
     <polygon points="107,42 113,44 111,61 105,60" fill="hsl(26, 46%, 30%)" stroke="hsl(36, 56%, 52%)" stroke-width="1"/>
     <path d="M40 16 Q60 12 78 24 M34 24 Q52 21 68 32" fill="none" stroke="hsla(42, 92%, 72%, 0.42)" stroke-width="2" stroke-linecap="round"/>
     <path d="M52 10 L71 14 L63 40 L89 47 L85 57 L47 47 L52 34 Z" fill="url(#ca-trip-boot)" stroke="hsl(220, 26%, 12%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M57 14 L65 16 L60 36 L81 48" fill="none" stroke="hsla(210, 48%, 88%, 0.62)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M51 34 L64 38" stroke="hsl(36, 76%, 54%)" stroke-width="2"/>
     <path d="M20 51 L56 44 L108 51" fill="none" stroke="url(#ca-trip-rope)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M20 51 L56 44 L108 51" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="0.9" stroke-dasharray="3 2"/>
     <path d="M56 35 L58 42 L65 40 L60 46 L66 51 L58 49 L55 56 L54 48 L47 48 L53 44 L50 38 L55 42 Z" fill="hsl(46, 100%, 82%)"/>
     <polygon points="94,54 100,52 98,58" fill="hsl(32, 32%, 52%)"/>
     <polygon points="88,62 94,61 91,66" fill="hsl(32, 32%, 44%)"/>
     <circle cx="98" cy="46" r="2.4" fill="hsla(38, 46%, 72%, 0.65)"/>
     <circle cx="105" cy="41" r="1.6" fill="hsla(42, 76%, 76%, 0.72)"/>`,
    'hsla(38, 92%, 60%, 0.26)',
    `<linearGradient id="ca-trip-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(32, 24%, 26%)"/><stop offset="100%" stop-color="hsl(220, 26%, 11%)"/></linearGradient><linearGradient id="ca-trip-boot" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(216, 20%, 62%)"/><stop offset="48%" stop-color="hsl(220, 22%, 30%)"/><stop offset="100%" stop-color="hsl(224, 26%, 14%)"/></linearGradient><linearGradient id="ca-trip-rope" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(36, 72%, 44%)"/><stop offset="50%" stop-color="hsl(48, 100%, 78%)"/><stop offset="100%" stop-color="hsl(36, 72%, 44%)"/></linearGradient>`
  ),
  bandage_up: wrapArtSvg(
    'bandage_up',
    'hsl(156, 46%, 17%)',
    'hsl(178, 44%, 8%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-bandage_up-aura)"/>
     <ellipse cx="64" cy="62" rx="38" ry="6" fill="rgba(0,0,0,0.40)"/>
     <path d="M18 51 L88 19 L97 34 L27 64 Z" fill="url(#ca-bandage_up-linen)" stroke="hsl(36, 24%, 40%)" stroke-width="1.2"/>
     <path d="M22 25 L92 54 L84 65 L15 39 Z" fill="url(#ca-bandage_up-linen)" stroke="hsl(36, 24%, 40%)" stroke-width="1.2"/>
     <path d="M28 53 L86 27 M24 34 L82 56" stroke="hsla(34, 24%, 42%, 0.36)" stroke-width="1.2" stroke-dasharray="3 3"/>
     <path d="M88 30 L106 30 A7 14 0 0 1 106 58 L88 58 Z" fill="url(#ca-bandage_up-linen)" stroke="hsl(36, 26%, 38%)" stroke-width="1.2"/>
     <ellipse cx="88" cy="44" rx="6.5" ry="14" fill="hsl(40, 38%, 84%)" stroke="hsl(36, 26%, 40%)" stroke-width="1.2"/>
     <ellipse cx="88" cy="44" rx="3" ry="7.5" fill="none" stroke="hsl(36, 24%, 48%)" stroke-width="1.1"/>
     <path d="M24 27 L58 40" stroke="hsl(0, 0%, 100%)" stroke-width="1.4" opacity="0.72" stroke-linecap="round"/>
     <circle cx="55" cy="41" r="14" fill="hsla(146, 98%, 54%, 0.28)"/>
     <path d="M51 30 H59 V37 H66 V45 H59 V52 H51 V45 H44 V37 H51 Z" fill="url(#ca-bandage_up-cross)" stroke="hsl(136, 100%, 88%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M55 33 V49 M47 41 H63" stroke="hsl(132, 100%, 92%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M26 14 V22 M22 18 H30" stroke="hsl(142, 100%, 78%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M98 12 V20 M94 16 H102" stroke="hsl(142, 100%, 78%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="42" cy="14" r="1.7" fill="hsl(138, 100%, 86%)"/>
     <circle cx="76" cy="13" r="1.5" fill="hsl(138, 100%, 86%)"/>`,
    'hsla(146, 94%, 58%, 0.28)',
    `<radialGradient id="ca-bandage_up-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(146, 98%, 62%, 0.44)"/><stop offset="65%" stop-color="hsla(158, 86%, 42%, 0.16)"/><stop offset="100%" stop-color="hsla(170, 74%, 22%, 0)"/></radialGradient><linearGradient id="ca-bandage_up-linen" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(44, 52%, 95%)"/><stop offset="56%" stop-color="hsl(38, 34%, 76%)"/><stop offset="100%" stop-color="hsl(34, 26%, 48%)"/></linearGradient><linearGradient id="ca-bandage_up-cross" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(138, 100%, 78%)"/><stop offset="100%" stop-color="hsl(154, 92%, 42%)"/></linearGradient>`
  ),
  dark_shackles: wrapArtSvg(
    'dark_shackles',
    'hsl(268, 42%, 16%)',
    'hsl(240, 44%, 7%)',
    `<ellipse cx="64" cy="36" rx="48" ry="26" fill="url(#ca-dark_shackles-rune)" opacity="0.56"/>
     <path d="M0 16 Q22 24 34 16 M128 16 Q106 24 94 16 M0 60 Q26 52 44 64 M128 60 Q102 52 84 64" fill="none" stroke="hsla(276, 84%, 44%, 0.34)" stroke-width="2.4" stroke-linecap="round"/>
     <ellipse cx="26" cy="37" rx="14" ry="18" fill="none" stroke="url(#ca-dark_shackles-iron)" stroke-width="6.5"/>
     <ellipse cx="102" cy="37" rx="14" ry="18" fill="none" stroke="url(#ca-dark_shackles-iron)" stroke-width="6.5"/>
     <path d="M16 25 A12 16 0 0 1 28 21 M92 25 A12 16 0 0 1 104 21" fill="none" stroke="hsla(278, 86%, 82%, 0.56)" stroke-width="1.6" stroke-linecap="round"/>
     <ellipse cx="45" cy="37" rx="8.5" ry="5" fill="none" stroke="url(#ca-dark_shackles-iron)" stroke-width="3.6"/>
     <ellipse cx="83" cy="37" rx="8.5" ry="5" fill="none" stroke="url(#ca-dark_shackles-iron)" stroke-width="3.6"/>
     <path d="M55 34 V24 A9 9 0 0 1 73 24 V29" fill="none" stroke="url(#ca-dark_shackles-iron)" stroke-width="4.2" stroke-linecap="round"/>
     <rect x="50" y="32" width="28" height="25" rx="4" fill="url(#ca-dark_shackles-lock)" stroke="hsl(276, 62%, 58%)" stroke-width="1.4"/>
     <path d="M53 35 H75" stroke="hsla(270, 52%, 82%, 0.45)" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M64 37.5 A3.6 3.6 0 1 0 64 44.7 A3.6 3.6 0 1 0 64 37.5 Z M62 43 L66 43 L67.5 52 L60.5 52 Z" fill="hsl(284, 100%, 78%)"/>
     <path d="M74 28 L79 24 L75 33" fill="none" stroke="hsl(286, 100%, 84%)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <ellipse cx="26" cy="37" rx="18" ry="22" fill="none" stroke="hsla(280, 96%, 68%, 0.42)" stroke-width="1.1" stroke-dasharray="4 3"/>
     <ellipse cx="102" cy="37" rx="18" ry="22" fill="none" stroke="hsla(280, 96%, 68%, 0.42)" stroke-width="1.1" stroke-dasharray="4 3"/>
     <circle cx="77" cy="21" r="2" fill="hsl(286, 100%, 88%)"/>
     <circle cx="64" cy="63" r="1.6" fill="hsl(282, 100%, 80%)"/>`,
    'hsla(278, 92%, 62%, 0.28)',
    `<linearGradient id="ca-dark_shackles-iron" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(258, 22%, 52%)"/><stop offset="48%" stop-color="hsl(254, 28%, 22%)"/><stop offset="100%" stop-color="hsl(248, 34%, 9%)"/></linearGradient><radialGradient id="ca-dark_shackles-rune" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(284, 100%, 82%)"/><stop offset="52%" stop-color="hsla(274, 96%, 56%, 0.45)"/><stop offset="100%" stop-color="hsla(266, 86%, 32%, 0)"/></radialGradient><linearGradient id="ca-dark_shackles-lock" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(256, 24%, 40%)"/><stop offset="100%" stop-color="hsl(248, 34%, 12%)"/></linearGradient>`
  ),
  panacea: wrapArtSvg(
    'panacea',
    'hsl(196, 52%, 19%)',
    'hsl(226, 46%, 9%)',
    `<circle cx="64" cy="28" r="27" fill="url(#ca-panacea-halo)"/>
     <circle cx="64" cy="28" r="20" fill="none" stroke="hsla(50, 100%, 84%, 0.56)" stroke-width="1.3"/>
     <path d="M64 4 V9 M38 28 H43 M85 28 H90 M45 10 L49 14 M83 10 L79 14" stroke="hsl(50, 100%, 84%)" stroke-width="1.4" stroke-linecap="round"/>
     <ellipse cx="64" cy="64" rx="22" ry="4.5" fill="rgba(0,0,0,0.44)"/>
     <path d="M47 63 L57 57 L60 47 H68 L71 57 L81 63 Z" fill="url(#ca-panacea-gold)" stroke="hsl(34, 72%, 24%)" stroke-width="1.2"/>
     <path d="M44 24 C34 24 33 37 44 39 M84 24 C94 24 95 37 84 39" fill="none" stroke="url(#ca-panacea-gold)" stroke-width="2.4" stroke-linecap="round"/>
     <path d="M44 21 H84 L80 39 C78 46 71 49 64 49 C57 49 50 46 48 39 Z" fill="hsla(192, 92%, 86%, 0.24)" stroke="hsl(190, 100%, 88%)" stroke-width="1.5"/>
     <path d="M47 28 H81 L78 39 C76 45 70 47 64 47 C58 47 52 45 50 39 Z" fill="url(#ca-panacea-elixir)"/>
     <ellipse cx="64" cy="28" rx="17" ry="3.4" fill="hsl(52, 100%, 92%)" opacity="0.92"/>
     <ellipse cx="64" cy="21" rx="20" ry="3.2" fill="none" stroke="url(#ca-panacea-gold)" stroke-width="1.8"/>
     <path d="M51 27 L53 42" stroke="hsl(0, 0%, 100%)" stroke-width="2" stroke-linecap="round" opacity="0.72"/>
     <path d="M64 25 Q60 17 65 11 Q69 17 64 25 Z" fill="hsla(52, 100%, 94%, 0.72)"/>
     <path d="M32 14 L33.4 17.6 L37 19 L33.4 20.4 L32 24 L30.6 20.4 L27 19 L30.6 17.6 Z" fill="hsl(52, 100%, 92%)"/>
     <path d="M96 14 L97.4 17.6 L101 19 L97.4 20.4 L96 24 L94.6 20.4 L91 19 L94.6 17.6 Z" fill="hsl(180, 100%, 86%)"/>
     <circle cx="58" cy="18" r="1.7" fill="hsl(176, 100%, 88%)"/>
     <circle cx="71" cy="15" r="1.5" fill="hsl(52, 100%, 92%)"/>`,
    'hsla(48, 100%, 72%, 0.30)',
    `<radialGradient id="ca-panacea-halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(50, 100%, 84%, 0.65)"/><stop offset="56%" stop-color="hsla(182, 96%, 64%, 0.28)"/><stop offset="100%" stop-color="hsla(198, 86%, 40%, 0)"/></radialGradient><linearGradient id="ca-panacea-elixir" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 88%)"/><stop offset="48%" stop-color="hsl(176, 94%, 64%)"/><stop offset="100%" stop-color="hsl(198, 86%, 40%)"/></linearGradient><linearGradient id="ca-panacea-gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(36, 78%, 40%)"/><stop offset="50%" stop-color="hsl(50, 100%, 82%)"/><stop offset="100%" stop-color="hsl(34, 76%, 34%)"/></linearGradient>`
  ),
  burn: wrapArtSvg(
    'burn',
    'hsl(14, 76%, 20%)',
    'hsl(354, 62%, 7%)',
    `<circle cx="64" cy="38" r="34" fill="hsla(22, 100%, 54%, 0.24)"/>
     <path d="M0 57 L22 52 L42 58 L66 51 L92 58 L112 52 L128 57 L128 72 L0 72 Z" fill="url(#ca-burn-crust)"/>
     <path d="M16 66 L34 57 L52 65 L74 56 L96 66 L114 58" fill="none" stroke="hsl(32, 100%, 62%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M36 58 C26 42 36 22 50 18 C48 26 52 28 56 20 C62 8 72 6 70 18 C80 14 90 22 86 35 C95 34 98 48 88 58 Z" fill="hsla(352, 84%, 24%, 0.65)"/>
     <path d="M40 58 C31 44 40 26 54 20 C52 30 57 31 63 11 C71 21 75 28 82 22 C89 34 92 48 84 58 Z" fill="url(#ca-burn-outer)" stroke="hsl(42, 100%, 72%)" stroke-width="1"/>
     <path d="M49 58 C44 47 50 34 62 24 C67 33 70 36 74 32 C79 42 79 51 75 58 Z" fill="url(#ca-burn-core)"/>
     <path d="M57 58 C55 50 59 42 64 36 C69 43 71 50 69 58 Z" fill="hsl(58, 100%, 96%)"/>
     <polygon points="24,42 31,38 29,46" fill="hsl(14, 42%, 16%)" stroke="hsl(32, 100%, 64%)" stroke-width="1"/>
     <polygon points="98,38 105,35 103,43" fill="hsl(14, 42%, 16%)" stroke="hsl(32, 100%, 64%)" stroke-width="1"/>
     <path d="M28 30 Q22 20 30 11 M100 28 Q106 18 98 9" fill="none" stroke="hsl(38, 100%, 68%)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="42" cy="14" r="2" fill="hsl(48, 100%, 82%)"/>
     <circle cx="88" cy="15" r="1.8" fill="hsl(36, 100%, 72%)"/>
     <circle cx="20" cy="24" r="1.5" fill="hsl(26, 100%, 64%)"/>
     <circle cx="108" cy="26" r="1.6" fill="hsl(46, 100%, 78%)"/>
     <circle cx="64" cy="6" r="1.6" fill="hsl(52, 100%, 88%)"/>`,
    'hsla(26, 100%, 56%, 0.34)',
    `<linearGradient id="ca-burn-outer" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(354, 90%, 34%)"/><stop offset="48%" stop-color="hsl(14, 98%, 52%)"/><stop offset="100%" stop-color="hsl(40, 100%, 68%)"/></linearGradient><linearGradient id="ca-burn-core" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="hsl(24, 100%, 54%)"/><stop offset="56%" stop-color="hsl(46, 100%, 72%)"/><stop offset="100%" stop-color="hsl(58, 100%, 95%)"/></linearGradient><linearGradient id="ca-burn-crust" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(14, 34%, 18%)"/><stop offset="100%" stop-color="hsl(354, 42%, 8%)"/></linearGradient>`
  ),
  wound: wrapArtSvg(
    'wound',
    'hsl(350, 56%, 16%)',
    'hsl(228, 32%, 8%)',
    `<ellipse cx="64" cy="36" rx="46" ry="26" fill="hsla(354, 92%, 42%, 0.22)"/>
     <path d="M12 10 L108 10 L114 58 L20 62 Z" fill="url(#ca-wound-armor)" stroke="hsl(218, 20%, 38%)" stroke-width="1.3"/>
     <circle cx="24" cy="19" r="2.4" fill="hsl(220, 18%, 16%)" stroke="hsl(212, 22%, 62%)" stroke-width="0.9"/>
     <circle cx="101" cy="19" r="2.4" fill="hsl(220, 18%, 16%)" stroke="hsl(212, 22%, 62%)" stroke-width="0.9"/>
     <circle cx="28" cy="54" r="2.4" fill="hsl(220, 18%, 16%)" stroke="hsl(212, 22%, 62%)" stroke-width="0.9"/>
     <circle cx="104" cy="52" r="2.4" fill="hsl(220, 18%, 16%)" stroke="hsl(212, 22%, 62%)" stroke-width="0.9"/>
     <path d="M22 14 L50 24 L66 30 L88 42 L106 55 L82 47 L60 40 L42 30 Z" fill="hsl(346, 84%, 11%)" stroke="hsl(212, 26%, 78%)" stroke-width="1.6" stroke-linejoin="round"/>
     <path d="M27 16 L52 26 L70 33 L90 45 L102 53 L80 45 L60 38 L44 29 Z" fill="url(#ca-wound-gash)"/>
     <path d="M40 24 L66 34 L88 46" fill="none" stroke="hsl(356, 100%, 66%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M48 16 L76 52" fill="none" stroke="hsl(352, 86%, 38%)" stroke-width="2" stroke-linecap="round" opacity="0.72"/>
     <path d="M45 31 Q43 44 46 53 Q49 58 46 66" fill="none" stroke="url(#ca-wound-blood)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M65 39 Q63 50 66 59 Q68 64 65 69" fill="none" stroke="url(#ca-wound-blood)" stroke-width="3.6" stroke-linecap="round"/>
     <path d="M84 47 Q83 56 86 63" fill="none" stroke="url(#ca-wound-blood)" stroke-width="2.8" stroke-linecap="round"/>
     <path d="M55 49 Q52 55 55 58 Q58 55 55 49 Z" fill="hsl(354, 96%, 48%)"/>
     <path d="M75 56 Q72 62 75 65 Q78 62 75 56 Z" fill="hsl(354, 96%, 48%)"/>
     <path d="M44 43 V49 M64 49 V56" stroke="hsl(356, 100%, 82%)" stroke-width="1" stroke-linecap="round" opacity="0.8"/>`,
    'hsla(354, 94%, 46%, 0.30)',
    `<linearGradient id="ca-wound-armor" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(216, 18%, 48%)"/><stop offset="52%" stop-color="hsl(222, 20%, 24%)"/><stop offset="100%" stop-color="hsl(228, 24%, 12%)"/></linearGradient><linearGradient id="ca-wound-blood" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(354, 98%, 54%)"/><stop offset="56%" stop-color="hsl(350, 90%, 32%)"/><stop offset="100%" stop-color="hsl(344, 84%, 14%)"/></linearGradient><linearGradient id="ca-wound-gash" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(348, 92%, 22%)"/><stop offset="50%" stop-color="hsl(354, 96%, 44%)"/><stop offset="100%" stop-color="hsl(344, 86%, 14%)"/></linearGradient>`
  ),
  dazed: wrapArtSvg(
    'dazed',
    'hsl(248, 52%, 20%)',
    'hsl(228, 56%, 8%)',
    `<circle cx="64" cy="36" r="34" fill="url(#ca-dazed-vortex)"/>
     <ellipse cx="64" cy="36" rx="44" ry="18" transform="rotate(-16 64 36)" fill="none" stroke="hsla(256, 92%, 72%, 0.34)" stroke-width="1.4" stroke-dasharray="5 4"/>
     <ellipse cx="64" cy="36" rx="38" ry="14" transform="rotate(14 64 36)" fill="none" stroke="hsla(196, 100%, 76%, 0.38)" stroke-width="1.4"/>
     <path d="M64 36 C64 31 70 30 71 36 C72 44 60 47 55 40 C49 31 58 21 69 22 C83 23 87 40 77 50 C65 62 43 56 39 40 C35 23 50 10 69 11" fill="none" stroke="hsl(238, 64%, 14%)" stroke-width="5.6" stroke-linecap="round"/>
     <path d="M64 36 C64 31 70 30 71 36 C72 44 60 47 55 40 C49 31 58 21 69 22 C83 23 87 40 77 50 C65 62 43 56 39 40 C35 23 50 10 69 11" fill="none" stroke="url(#ca-dazed-spiral)" stroke-width="3" stroke-linecap="round"/>
     <path d="M64 36 C64 41 58 42 57 36 C56 28 68 25 73 32 C79 41 70 51 59 50 C45 49 41 32 51 22 C63 10 85 16 89 32 C93 49 78 62 59 61" fill="none" stroke="hsla(196, 100%, 82%, 0.62)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="64" cy="36" r="4.2" fill="hsl(278, 100%, 86%)"/>
     <path d="M26 24 Q34 14 46 14" fill="none" stroke="hsla(52, 100%, 84%, 0.56)" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M102 48 Q94 58 82 58" fill="none" stroke="hsla(52, 100%, 84%, 0.56)" stroke-width="1.6" stroke-linecap="round"/>
     <polygon points="24,25 26.5,31 33,31 28,35 30,41 24,37 18,41 20,35 15,31 21.5,31" fill="url(#ca-dazed-star)"/>
     <polygon points="103,18 105,23 110,23 106,26 107.5,31 103,28 98.5,31 100,26 96,23 101,23" fill="url(#ca-dazed-star)"/>
     <polygon points="94,48 95.6,52 100,52 96.5,54.5 97.8,58.5 94,56 90.2,58.5 91.5,54.5 88,52 92.4,52" fill="url(#ca-dazed-star)"/>
     <circle cx="38" cy="54" r="2" fill="hsl(196, 100%, 86%)"/>
     <circle cx="88" cy="14" r="1.8" fill="hsl(276, 100%, 86%)"/>
     <circle cx="48" cy="60" r="1.5" fill="hsl(52, 100%, 86%)"/>`,
    'hsla(264, 96%, 68%, 0.30)',
    `<radialGradient id="ca-dazed-vortex" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(268, 100%, 78%, 0.65)"/><stop offset="52%" stop-color="hsla(236, 86%, 46%, 0.28)"/><stop offset="100%" stop-color="hsla(228, 66%, 14%, 0)"/></radialGradient><linearGradient id="ca-dazed-spiral" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(196, 100%, 78%)"/><stop offset="52%" stop-color="hsl(262, 96%, 72%)"/><stop offset="100%" stop-color="hsl(292, 92%, 64%)"/></linearGradient><linearGradient id="ca-dazed-star" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 94%)"/><stop offset="100%" stop-color="hsl(44, 100%, 62%)"/></linearGradient>`
  ),
  slimed: wrapArtSvg(
    'slimed',
    'hsl(104, 54%, 17%)',
    'hsl(148, 50%, 7%)',
    `<ellipse cx="64" cy="38" rx="48" ry="26" fill="hsla(98, 96%, 50%, 0.18)"/>
     <path d="M0 0 H128 V14 Q116 14 114 27 Q112 34 107 26 Q103 14 90 16 Q82 18 80 32 Q76 38 72 28 Q68 13 54 14 Q44 15 41 26 Q37 33 33 23 Q28 13 16 16 Q10 18 8 28 Q4 32 0 24 Z" fill="url(#ca-slimed-drip)" opacity="0.82"/>
     <path d="M6 68 Q26 54 50 58 Q74 53 98 59 Q114 56 124 68 L128 72 L0 72 Z" fill="hsl(124, 72%, 22%)"/>
     <path d="M52 24 Q55 34 52 44 M78 24 Q74 36 78 48" fill="none" stroke="hsl(102, 90%, 46%)" stroke-width="4.6" stroke-linecap="round"/>
     <path d="M32 45 C24 34 36 22 50 25 C56 16 74 16 80 26 C95 24 104 36 96 47 C99 57 86 63 75 58 C68 65 56 64 50 58 C38 62 28 55 32 45 Z" fill="url(#ca-slimed-ooze)" stroke="hsl(126, 78%, 20%)" stroke-width="1.5"/>
     <path d="M36 51 C46 57 78 58 92 49 C84 58 68 61 52 57 C42 58 36 55 36 51 Z" fill="hsla(138, 78%, 14%, 0.45)"/>
     <path d="M40 34 Q46 26 56 28 M64 23 Q72 22 78 28" fill="none" stroke="hsl(78, 100%, 88%)" stroke-width="2.4" stroke-linecap="round" opacity="0.85"/>
     <circle cx="52" cy="40" r="6.5" fill="url(#ca-slimed-bubble)" stroke="hsl(122, 76%, 28%)" stroke-width="1"/>
     <circle cx="75" cy="43" r="5" fill="url(#ca-slimed-bubble)" stroke="hsl(122, 76%, 28%)" stroke-width="1"/>
     <circle cx="64" cy="31" r="3.4" fill="url(#ca-slimed-bubble)"/>
     <circle cx="50" cy="38" r="1.6" fill="hsl(0, 0%, 100%)" opacity="0.9"/>
     <circle cx="73.5" cy="41.5" r="1.3" fill="hsl(0, 0%, 100%)" opacity="0.9"/>
     <path d="M22 44 Q19 52 23 55 Q27 52 22 44 Z" fill="url(#ca-slimed-ooze)"/>
     <path d="M107 40 Q104 48 108 51 Q112 48 107 40 Z" fill="url(#ca-slimed-ooze)"/>
     <circle cx="34" cy="60" r="2.6" fill="url(#ca-slimed-bubble)"/>
     <circle cx="95" cy="61" r="2.2" fill="url(#ca-slimed-bubble)"/>`,
    'hsla(96, 98%, 54%, 0.30)',
    `<radialGradient id="ca-slimed-ooze" cx="38%" cy="32%" r="66%"><stop offset="0%" stop-color="hsl(86, 100%, 74%)"/><stop offset="50%" stop-color="hsl(104, 88%, 44%)"/><stop offset="100%" stop-color="hsl(132, 74%, 20%)"/></radialGradient><linearGradient id="ca-slimed-drip" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(124, 72%, 24%)"/><stop offset="68%" stop-color="hsl(102, 90%, 46%)"/><stop offset="100%" stop-color="hsl(86, 100%, 66%)"/></linearGradient><radialGradient id="ca-slimed-bubble" cx="34%" cy="30%" r="66%"><stop offset="0%" stop-color="hsl(78, 100%, 88%)"/><stop offset="56%" stop-color="hsl(98, 92%, 52%)"/><stop offset="100%" stop-color="hsl(126, 78%, 26%)"/></radialGradient>`
  ),
  void: wrapArtSvg(
    'void',
    'hsl(268, 54%, 14%)',
    'hsl(252, 62%, 5%)',
    `<ellipse cx="64" cy="36" rx="54" ry="30" fill="hsla(274, 90%, 40%, 0.20)"/>
     <path d="M6 10 L32 22 L24 30 M122 10 L96 22 L104 30 M8 64 L36 52 L30 44 M120 64 L92 52 L98 44" fill="none" stroke="hsla(282, 100%, 74%, 0.44)" stroke-width="1.3" stroke-linecap="round"/>
     <ellipse cx="64" cy="36" rx="38" ry="14" transform="rotate(-18 64 36)" fill="none" stroke="url(#ca-void-ring)" stroke-width="2" stroke-dasharray="14 5 7 4" opacity="0.82"/>
     <ellipse cx="64" cy="36" rx="28" ry="11" transform="rotate(20 64 36)" fill="none" stroke="hsla(282, 100%, 76%, 0.64)" stroke-width="1.6" stroke-dasharray="10 4"/>
     <circle cx="64" cy="36" r="22" fill="url(#ca-void-hole)"/>
     <circle cx="64" cy="36" r="12.5" fill="hsl(262, 84%, 3%)" stroke="hsl(286, 100%, 78%)" stroke-width="1.3"/>
     <path d="M22 26 Q42 22 52 33 M106 46 Q86 50 76 39" fill="none" stroke="url(#ca-void-ring)" stroke-width="2" stroke-linecap="round"/>
     <path d="M40 58 Q48 44 58 46 M88 14 Q80 28 70 26" fill="none" stroke="hsla(198, 100%, 78%, 0.66)" stroke-width="1.5" stroke-linecap="round"/>
     <polygon points="18,16 35,24 27,31" fill="url(#ca-void-shard)" stroke="hsl(286, 100%, 84%)" stroke-width="0.9"/>
     <polygon points="110,18 93,26 100,33" fill="url(#ca-void-shard)" stroke="hsl(286, 100%, 84%)" stroke-width="0.9"/>
     <polygon points="22,58 38,48 31,42" fill="url(#ca-void-shard)" stroke="hsl(198, 100%, 80%)" stroke-width="0.9"/>
     <polygon points="106,56 90,46 97,40" fill="url(#ca-void-shard)" stroke="hsl(198, 100%, 80%)" stroke-width="0.9"/>
     <circle cx="48" cy="18" r="1.7" fill="hsl(286, 100%, 86%)"/>
     <circle cx="80" cy="54" r="1.7" fill="hsl(198, 100%, 84%)"/>
     <circle cx="86" cy="20" r="1.4" fill="hsl(316, 100%, 80%)"/>`,
    'hsla(276, 98%, 58%, 0.32)',
    `<radialGradient id="ca-void-hole" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(260, 80%, 2%)"/><stop offset="54%" stop-color="hsl(264, 78%, 6%)"/><stop offset="76%" stop-color="hsl(280, 100%, 66%)"/><stop offset="100%" stop-color="hsla(266, 92%, 38%, 0)"/></radialGradient><linearGradient id="ca-void-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(196, 100%, 74%)"/><stop offset="50%" stop-color="hsl(284, 100%, 72%)"/><stop offset="100%" stop-color="hsl(316, 96%, 60%)"/></linearGradient><linearGradient id="ca-void-shard" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(282, 86%, 72%)"/><stop offset="100%" stop-color="hsl(258, 64%, 16%)"/></linearGradient>`
  ),
  clumsy: wrapArtSvg(
    'clumsy',
    'hsl(28, 28%, 17%)',
    'hsl(232, 22%, 8%)',
    `<ellipse cx="64" cy="52" rx="52" ry="18" fill="url(#ca-clumsy-dust)"/>
     <path d="M0 54 L128 54 L128 72 L0 72 Z" fill="hsla(228, 28%, 9%, 0.62)"/>
     <path d="M18 60 Q46 54 78 60 Q98 63 110 66 Q80 69 44 67 Q22 66 18 60 Z" fill="hsla(24, 34%, 14%, 0.72)"/>
     <ellipse cx="46" cy="57" rx="22" ry="5.5" fill="rgba(0,0,0,0.48)"/>
     <path d="M24 44 C24 30 40 24 54 30 L64 36 L66 32 L72 37 L63 48 L58 54 C46 60 24 56 24 44 Z" fill="url(#ca-clumsy-clay)" stroke="hsl(16, 46%, 14%)" stroke-width="1.4" stroke-linejoin="round"/>
     <ellipse cx="66" cy="40" rx="4.2" ry="7.5" transform="rotate(26 66 40)" fill="hsl(18, 42%, 12%)" stroke="hsl(24, 48%, 48%)" stroke-width="1.1"/>
     <path d="M38 30 L44 39 L40 46 L48 53" fill="none" stroke="hsl(18, 46%, 10%)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M30 37 Q37 30 47 32" fill="none" stroke="hsla(32, 68%, 74%, 0.56)" stroke-width="1.7" stroke-linecap="round"/>
     <polygon points="58,56 68,53 65,61" fill="url(#ca-clumsy-clay)" stroke="hsl(16, 44%, 14%)" stroke-width="0.9"/>
     <polygon points="48,60 55,62 50,66" fill="url(#ca-clumsy-clay)" stroke="hsl(16, 44%, 14%)" stroke-width="0.9"/>
     <path d="M98 14 L106 20 L82 47 L75 51 L78 43 Z" fill="url(#ca-clumsy-blade)" stroke="hsl(220, 24%, 14%)" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M95 12 L109 22 M101 16 L109 9" stroke="hsl(28, 44%, 38%)" stroke-width="3.2" stroke-linecap="round"/>
     <path d="M84 16 Q92 22 86 30 M112 28 Q114 38 104 44" fill="none" stroke="hsla(38, 62%, 72%, 0.55)" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="72" cy="54" r="3" fill="hsla(34, 34%, 64%, 0.45)"/>
     <circle cx="84" cy="58" r="2.2" fill="hsla(34, 34%, 64%, 0.38)"/>
     <circle cx="22" cy="52" r="2.2" fill="hsla(34, 34%, 64%, 0.35)"/>`,
    'hsla(32, 56%, 48%, 0.24)',
    `<radialGradient id="ca-clumsy-dust" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(34, 42%, 52%, 0.34)"/><stop offset="100%" stop-color="hsla(230, 26%, 12%, 0)"/></radialGradient><linearGradient id="ca-clumsy-clay" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(22, 52%, 54%)"/><stop offset="52%" stop-color="hsl(18, 46%, 32%)"/><stop offset="100%" stop-color="hsl(16, 42%, 14%)"/></linearGradient><linearGradient id="ca-clumsy-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(212, 18%, 78%)"/><stop offset="100%" stop-color="hsl(220, 22%, 30%)"/></linearGradient>`
  ),
  doubt: wrapArtSvg(
    'doubt',
    'hsl(252, 34%, 16%)',
    'hsl(232, 40%, 7%)',
    `<circle cx="64" cy="36" r="30" fill="hsla(268, 82%, 48%, 0.18)"/>
     <path d="M0 14 Q24 22 34 14 Q22 34 32 48 Q16 56 0 64 Z M128 14 Q104 22 94 14 Q106 34 96 48 Q112 56 128 64 Z" fill="url(#ca-doubt-smoke)"/>
     <polygon points="24,11 63,9 59,37 31,56 18,36" fill="url(#ca-doubt-mirror)" stroke="hsl(232, 24%, 72%)" stroke-width="1.3"/>
     <polygon points="67,10 106,15 110,44 69,40 64,25" fill="url(#ca-doubt-mirror)" stroke="hsl(232, 24%, 72%)" stroke-width="1.3"/>
     <polygon points="36,59 62,41 99,48 86,64 46,66" fill="url(#ca-doubt-mirror)" stroke="hsl(232, 24%, 66%)" stroke-width="1.2"/>
     <path d="M30 16 L44 26 M96 19 L82 32 M50 59 L68 51" stroke="hsla(0, 0%, 100%, 0.36)" stroke-width="2" stroke-linecap="round"/>
     <path d="M36 35 Q50 22 64 23 Q78 24 91 37 Q76 49 62 48 Q48 48 36 35 Z" fill="hsl(246, 52%, 10%)" stroke="hsl(268, 72%, 62%)" stroke-width="1.4"/>
     <path d="M42 35 Q52 26 63 27 Q74 28 85 37 Q73 45 62 44 Q51 44 42 35 Z" fill="hsl(240, 26%, 80%)" opacity="0.88"/>
     <circle cx="62" cy="36" r="8.5" fill="url(#ca-doubt-eye)"/>
     <ellipse cx="62" cy="36" rx="2.4" ry="6.8" fill="hsl(252, 72%, 7%)"/>
     <circle cx="60" cy="33" r="1.4" fill="hsl(52, 100%, 92%)"/>
     <path d="M78 21 Q86 16 94 22 Q86 27 78 21 Z" fill="hsl(248, 52%, 12%)" stroke="hsl(272, 76%, 64%)" stroke-width="0.9"/>
     <circle cx="86" cy="21.5" r="2.2" fill="hsl(276, 94%, 68%)"/>
     <path d="M64 8 L60 36 L34 57 M60 36 L104 45" fill="none" stroke="hsl(248, 58%, 7%)" stroke-width="2.4"/>
     <path d="M65 8 L61 36 L35 57 M61 36 L104 46" fill="none" stroke="hsla(216, 62%, 90%, 0.72)" stroke-width="0.9"/>
     <circle cx="24" cy="54" r="1.6" fill="hsl(276, 90%, 76%)"/>`,
    'hsla(268, 76%, 56%, 0.26)',
    `<linearGradient id="ca-doubt-mirror" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(224, 28%, 74%)"/><stop offset="48%" stop-color="hsl(242, 26%, 38%)"/><stop offset="100%" stop-color="hsl(252, 34%, 15%)"/></linearGradient><radialGradient id="ca-doubt-eye" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(48, 96%, 72%)"/><stop offset="56%" stop-color="hsl(276, 88%, 54%)"/><stop offset="100%" stop-color="hsl(256, 68%, 18%)"/></radialGradient><linearGradient id="ca-doubt-smoke" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(262, 62%, 34%, 0.56)"/><stop offset="50%" stop-color="hsla(256, 54%, 22%, 0.10)"/><stop offset="100%" stop-color="hsla(262, 62%, 34%, 0.56)"/></linearGradient>`
  ),
  regret: wrapArtSvg(
    'regret',
    'hsl(262, 38%, 16%)',
    'hsl(236, 44%, 7%)',
    `<ellipse cx="64" cy="60" rx="50" ry="14" fill="hsla(266, 76%, 40%, 0.24)"/>
     <circle cx="50" cy="30" r="24" fill="hsla(272, 82%, 54%, 0.16)"/>
     <path d="M62 66 Q72 48 86 38 Q94 34 98 38" fill="none" stroke="hsl(264, 28%, 22%)" stroke-width="2.6" stroke-linecap="round"/>
     <path d="M32 30 C30 14 42 8 54 10 C66 12 72 22 69 36 L64 46 L59 53 L43 51 L38 43 Z" fill="url(#ca-regret-skull)" stroke="hsl(252, 34%, 18%)" stroke-width="1.4" stroke-linejoin="round"/>
     <path d="M38 18 Q48 12 60 17" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.8" opacity="0.62" stroke-linecap="round"/>
     <path d="M39 29 Q44 26 48 31 Q44 36 39 33 Z" fill="hsl(252, 52%, 10%)"/>
     <path d="M54 31 Q59 27 64 31 Q62 36 55 35 Z" fill="hsl(252, 52%, 10%)"/>
     <polygon points="51,37 54,42 48,42" fill="hsl(252, 52%, 10%)"/>
     <path d="M44 47 V52 M49 47 V53 M54 48 V53 M58 48 V52" stroke="hsl(252, 42%, 16%)" stroke-width="1.5" stroke-linecap="round"/>
     <path d="M42 33 Q40 46 37 57 M59 34 Q58 47 61 58" fill="none" stroke="url(#ca-regret-tear)" stroke-width="2.3" stroke-linecap="round"/>
     <path d="M36 59 Q33 64 36 67 Q39 64 36 59 Z" fill="url(#ca-regret-tear)"/>
     <path d="M62 59 Q59 64 62 67 Q65 64 62 59 Z" fill="url(#ca-regret-tear)"/>
     <path d="M84 36 C82 26 95 22 103 30 C108 37 104 48 94 47 C86 46 84 42 84 36 Z" fill="url(#ca-regret-rose)" stroke="hsl(342, 44%, 52%)" stroke-width="1.1"/>
     <path d="M89 35 Q94 30 99 35 Q96 42 90 40" fill="none" stroke="hsl(346, 56%, 62%)" stroke-width="1.2"/>
     <path d="M80 56 Q85 52 89 56 Q85 60 80 56 Z" fill="hsl(340, 44%, 38%)"/>
     <path d="M96 58 Q101 54 106 58 Q101 62 96 58 Z" fill="hsl(340, 44%, 32%)"/>`,
    'hsla(276, 82%, 60%, 0.26)',
    `<linearGradient id="ca-regret-skull" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(246, 26%, 86%)"/><stop offset="56%" stop-color="hsl(250, 22%, 52%)"/><stop offset="100%" stop-color="hsl(256, 30%, 22%)"/></linearGradient><linearGradient id="ca-regret-rose" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(344, 48%, 46%)"/><stop offset="55%" stop-color="hsl(24, 38%, 26%)"/><stop offset="100%" stop-color="hsl(260, 32%, 14%)"/></linearGradient><linearGradient id="ca-regret-tear" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(276, 100%, 84%)"/><stop offset="100%" stop-color="hsl(254, 92%, 52%)"/></linearGradient>`
  ),
  parasite: wrapArtSvg(
    'parasite',
    'hsl(326, 48%, 15%)',
    'hsl(272, 46%, 7%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-parasite-slime)"/>
     <path d="M6 16 Q22 28 34 26 M122 54 Q104 48 92 54 M12 62 Q28 54 40 58" fill="none" stroke="hsla(328, 76%, 34%, 0.48)" stroke-width="2" stroke-linecap="round"/>
     <path d="M36 16 C18 24 18 52 40 62 C52 67 74 66 88 58 C108 46 106 20 84 14 C72 10 52 10 36 16 Z" fill="hsl(282, 48%, 11%)" stroke="hsl(32, 22%, 34%)" stroke-width="1.3"/>
     <path d="M36 17 C20 26 22 50 42 60 L49 54 C35 46 33 30 45 23 Z" fill="url(#ca-parasite-bone)" stroke="hsl(24, 26%, 18%)" stroke-width="1.1"/>
     <path d="M88 15 C106 24 106 48 86 58 L79 52 C92 44 93 29 80 21 Z" fill="url(#ca-parasite-bone)" stroke="hsl(24, 26%, 18%)" stroke-width="1.1"/>
     <path d="M27 36 L36 39 M98 35 L90 38" stroke="hsl(276, 48%, 10%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M34 52 C46 60 66 56 64 42 C62 28 42 36 46 24 C50 13 76 14 86 24" fill="none" stroke="hsl(284, 56%, 12%)" stroke-width="12" stroke-linecap="round"/>
     <path d="M34 52 C46 60 66 56 64 42 C62 28 42 36 46 24 C50 13 76 14 86 24" fill="none" stroke="url(#ca-parasite-worm)" stroke-width="9" stroke-linecap="round"/>
     <path d="M40 55 L44 48 M52 57 L53 49 M61 48 L67 44 M54 35 L58 29 M46 24 L53 26 M61 16 L63 23 M74 16 L73 23" stroke="hsl(284, 56%, 14%)" stroke-width="1.7" stroke-linecap="round"/>
     <path d="M37 49 C47 55 61 52 60 42 M49 21 C56 15 73 16 82 22" fill="none" stroke="hsla(342, 100%, 78%, 0.64)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="88" cy="26" r="6.5" fill="hsl(334, 82%, 22%)" stroke="hsl(338, 92%, 62%)" stroke-width="1.3"/>
     <path d="M84 22 L87 25 M92 22 L89 25 M84 30 L87 27 M92 30 L89 27" stroke="hsl(44, 62%, 90%)" stroke-width="1.3" stroke-linecap="round"/>
     <path d="M84 32 Q98 34 112 28 M34 52 Q22 50 14 44" fill="none" stroke="hsl(332, 86%, 54%)" stroke-width="1.9" stroke-linecap="round"/>
     <polygon points="62,60 70,58 67,65" fill="url(#ca-parasite-bone)"/>
     <circle cx="102" cy="18" r="1.8" fill="hsl(334, 96%, 64%)"/>
     <circle cx="24" cy="24" r="1.6" fill="hsl(304, 92%, 66%)"/>`,
    'hsla(332, 88%, 48%, 0.28)',
    `<radialGradient id="ca-parasite-slime" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(332, 92%, 48%, 0.36)"/><stop offset="62%" stop-color="hsla(294, 78%, 32%, 0.16)"/><stop offset="100%" stop-color="hsla(274, 62%, 12%, 0)"/></radialGradient><linearGradient id="ca-parasite-bone" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(40, 34%, 84%)"/><stop offset="56%" stop-color="hsl(32, 22%, 48%)"/><stop offset="100%" stop-color="hsl(24, 24%, 20%)"/></linearGradient><linearGradient id="ca-parasite-worm" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(338, 86%, 54%)"/><stop offset="50%" stop-color="hsl(304, 68%, 30%)"/><stop offset="100%" stop-color="hsl(276, 58%, 13%)"/></linearGradient>`
  ),
  deep_breath: wrapArtSvg(
    'deep_breath',
    'hsl(198, 48%, 19%)',
    'hsl(222, 46%, 9%)',
    `<circle cx="64" cy="36" r="32" fill="url(#ca-deep_breath-orb)"/>
     <path d="M0 62 L24 50 L48 59 L74 47 L102 58 L128 48 L128 72 L0 72 Z" fill="hsla(218, 44%, 12%, 0.55)"/>
     <path d="M12 42 C24 12 62 12 78 30 C92 46 112 40 118 22" fill="none" stroke="url(#ca-deep_breath-wind)" stroke-width="6" stroke-linecap="round"/>
     <path d="M116 32 C104 60 66 60 50 42 C36 26 16 32 10 50" fill="none" stroke="url(#ca-deep_breath-wind)" stroke-width="5" stroke-linecap="round"/>
     <path d="M22 39 C34 19 60 19 74 33 C84 43 102 42 110 28" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="1.4" stroke-linecap="round" opacity="0.82"/>
     <circle cx="64" cy="36" r="10.5" fill="hsla(186, 96%, 76%, 0.34)" stroke="hsl(182, 100%, 90%)" stroke-width="1.4"/>
     <circle cx="64" cy="36" r="4.5" fill="hsl(180, 100%, 94%)"/>
     <polygon points="34,13 45,10 48,24 37,27" fill="url(#ca-deep_breath-card)" stroke="hsl(182, 100%, 92%)" stroke-width="1.1"/>
     <polygon points="82,45 93,42 96,56 85,59" fill="url(#ca-deep_breath-card)" stroke="hsl(182, 100%, 92%)" stroke-width="1.1"/>
     <polygon points="97,15 108,18 104,31 93,28" fill="url(#ca-deep_breath-card)" stroke="hsl(182, 100%, 92%)" stroke-width="1.1" opacity="0.86"/>
     <path d="M74 16 Q82 12 88 18 Q81 20 74 16 Z" fill="hsl(176, 100%, 84%)" opacity="0.8"/>
     <path d="M40 54 Q48 50 54 56 Q47 58 40 54 Z" fill="hsl(176, 100%, 84%)" opacity="0.8"/>
     <circle cx="24" cy="24" r="1.7" fill="hsl(184, 100%, 92%)"/>
     <circle cx="106" cy="48" r="1.6" fill="hsl(184, 100%, 92%)"/>
     <circle cx="64" cy="14" r="1.4" fill="hsl(0, 0%, 100%)"/>`,
    'hsla(184, 92%, 72%, 0.28)',
    `<radialGradient id="ca-deep_breath-orb" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(182, 100%, 88%, 0.54)"/><stop offset="56%" stop-color="hsla(198, 90%, 58%, 0.22)"/><stop offset="100%" stop-color="hsla(216, 78%, 34%, 0)"/></radialGradient><linearGradient id="ca-deep_breath-wind" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsla(196, 92%, 74%, 0.14)"/><stop offset="50%" stop-color="hsla(180, 100%, 88%, 0.92)"/><stop offset="100%" stop-color="hsla(196, 92%, 74%, 0.14)"/></linearGradient><linearGradient id="ca-deep_breath-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(186, 86%, 90%)"/><stop offset="100%" stop-color="hsl(206, 62%, 52%)"/></linearGradient>`
  ),
  swift_strike: wrapArtSvg(
    'swift_strike',
    'hsl(212, 42%, 18%)',
    'hsl(228, 44%, 8%)',
    `<path d="M6 44 L76 18 M14 64 L96 34 M28 18 L86 6" stroke="hsla(202, 92%, 76%, 0.34)" stroke-width="1.5" stroke-linecap="round"/>
     <polygon points="8,58 106,18 112,24 18,65" fill="url(#ca-swift_strike-trail)"/>
     <ellipse cx="46" cy="44" rx="7" ry="18" transform="rotate(-21 46 44)" fill="none" stroke="hsla(46, 100%, 78%, 0.44)" stroke-width="1.6"/>
     <ellipse cx="76" cy="32" rx="6" ry="15" transform="rotate(-21 76 32)" fill="none" stroke="hsla(196, 100%, 84%, 0.62)" stroke-width="1.8"/>
     <polygon points="48,38 116,16 88,36 53,46" fill="hsl(220, 32%, 26%)"/>
     <polygon points="46,35 116,16 86,28 49,40" fill="url(#ca-swift_strike-blade)" stroke="hsl(0, 0%, 100%)" stroke-width="0.9"/>
     <line x1="14" y1="56" x2="112" y2="17" stroke="hsl(54, 100%, 94%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="110" cy="18" r="13" fill="url(#ca-swift_strike-impact)"/>
     <path d="M110 4 L112 15 L123 18 L112 21 L110 32 L108 21 L97 18 L108 15 Z" fill="hsl(56, 100%, 96%)"/>
     <path d="M22 44 L36 39 L30 51 M54 29 L68 24 L62 36" fill="none" stroke="hsl(46, 100%, 80%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M36 62 L66 50" stroke="hsl(42, 100%, 72%)" stroke-width="1.8" stroke-linecap="round"/>
     <circle cx="96" cy="38" r="1.8" fill="hsl(48, 100%, 86%)"/>
     <circle cx="88" cy="11" r="1.6" fill="hsl(200, 100%, 88%)"/>
     <circle cx="32" cy="59" r="1.5" fill="hsl(44, 100%, 78%)"/>`,
    'hsla(44, 98%, 68%, 0.28)',
    `<linearGradient id="ca-swift_strike-trail" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="hsla(204, 92%, 62%, 0.04)"/><stop offset="56%" stop-color="hsla(40, 100%, 64%, 0.62)"/><stop offset="100%" stop-color="hsl(54, 100%, 94%)"/></linearGradient><linearGradient id="ca-swift_strike-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(0, 0%, 100%)"/><stop offset="55%" stop-color="hsl(206, 42%, 78%)"/><stop offset="100%" stop-color="hsl(218, 36%, 34%)"/></linearGradient><radialGradient id="ca-swift_strike-impact" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsl(56, 100%, 96%)"/><stop offset="48%" stop-color="hsla(40, 100%, 62%, 0.72)"/><stop offset="100%" stop-color="hsla(22, 96%, 50%, 0)"/></radialGradient>`
  ),
  good_instincts: wrapArtSvg(
    'good_instincts',
    'hsl(206, 46%, 19%)',
    'hsl(224, 48%, 9%)',
    `<circle cx="68" cy="37" r="32" fill="url(#ca-good_instincts-pulse)"/>
     <circle cx="68" cy="37" r="24" fill="none" stroke="hsla(194, 96%, 78%, 0.34)" stroke-width="1.2" stroke-dasharray="4 3"/>
     <ellipse cx="68" cy="64" rx="22" ry="4.5" fill="rgba(0,0,0,0.44)"/>
     <path d="M12 16 L43 27" stroke="hsl(354, 72%, 56%)" stroke-width="2.2" stroke-linecap="round"/>
     <polygon points="46,28 38,22 40,30" fill="hsl(210, 26%, 78%)"/>
     <path d="M46 27 L32 10" stroke="hsl(48, 100%, 80%)" stroke-width="1.5" stroke-dasharray="3 2" stroke-linecap="round"/>
     <path d="M46 16 Q68 10 90 16 L88 41 C86 53 77 61 68 64 C59 61 50 53 48 41 Z" fill="url(#ca-good_instincts-shield)" stroke="url(#ca-good_instincts-rim)" stroke-width="2.2" stroke-linejoin="round"/>
     <path d="M68 13 L90 16 L88 41 C86 53 77 61 68 64 Z" fill="hsla(226, 56%, 12%, 0.34)"/>
     <path d="M51 20 Q60 17 67 17" fill="none" stroke="hsl(0, 0%, 100%)" stroke-width="2" stroke-linecap="round" opacity="0.72"/>
     <polygon points="68,24 76,36 68,48 60,36" fill="url(#ca-good_instincts-rim)" stroke="hsl(52, 100%, 92%)" stroke-width="1"/>
     <circle cx="68" cy="36" r="3.8" fill="hsl(194, 100%, 84%)"/>
     <path d="M45 19 L46.6 25.4 L53 27 L46.6 28.6 L45 35 L43.4 28.6 L37 27 L43.4 25.4 Z" fill="hsl(52, 100%, 94%)"/>
     <path d="M36 32 Q31 44 40 54 M98 22 Q105 36 96 52" fill="none" stroke="hsla(194, 100%, 82%, 0.62)" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="29" cy="18" r="1.8" fill="hsl(50, 100%, 88%)"/>
     <circle cx="99" cy="16" r="1.6" fill="hsl(194, 100%, 88%)"/>`,
    'hsla(198, 92%, 68%, 0.28)',
    `<radialGradient id="ca-good_instincts-pulse" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(194, 100%, 76%, 0.44)"/><stop offset="60%" stop-color="hsla(206, 90%, 54%, 0.16)"/><stop offset="100%" stop-color="hsla(220, 74%, 28%, 0)"/></radialGradient><linearGradient id="ca-good_instincts-shield" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(202, 54%, 86%)"/><stop offset="50%" stop-color="hsl(212, 44%, 48%)"/><stop offset="100%" stop-color="hsl(224, 48%, 20%)"/></linearGradient><linearGradient id="ca-good_instincts-rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 84%)"/><stop offset="100%" stop-color="hsl(36, 78%, 42%)"/></linearGradient>`
  ),
  impatience: wrapArtSvg(
    'impatience',
    'hsl(18, 48%, 18%)',
    'hsl(242, 36%, 9%)',
    `<circle cx="56" cy="36" r="30" fill="url(#ca-impatience-aura)"/>
     <path d="M18 14 L26 20 M14 36 H22 M18 58 L26 52 M88 12 L82 18" stroke="hsla(38, 100%, 70%, 0.58)" stroke-width="2" stroke-linecap="round"/>
     <ellipse cx="52" cy="64" rx="22" ry="4.5" fill="rgba(0,0,0,0.44)"/>
     <path d="M40 15 Q40 29 53 35 Q40 42 36 57 L64 61 Q66 46 57 36 Q71 31 74 19 Z" fill="hsla(210, 48%, 84%, 0.18)" stroke="hsl(44, 72%, 78%)" stroke-width="1.4"/>
     <path d="M45 21 L68 24 Q63 32 55 35 Q49 30 45 21 Z" fill="url(#ca-impatience-sand)"/>
     <path d="M55 35 L51 54" stroke="hsl(48, 100%, 82%)" stroke-width="2.2" stroke-linecap="round"/>
     <path d="M39 56 Q51 45 62 59 Z" fill="url(#ca-impatience-sand)"/>
     <polygon points="35,11 79,17 78,21 34,15" fill="url(#ca-impatience-brass)" stroke="hsl(26, 70%, 22%)" stroke-width="1"/>
     <polygon points="30,55 72,61 71,65 29,59" fill="url(#ca-impatience-brass)" stroke="hsl(26, 70%, 22%)" stroke-width="1"/>
     <path d="M62 24 L56 29 L61 31 L58 35" fill="none" stroke="hsl(52, 100%, 92%)" stroke-width="1.3" stroke-linecap="round"/>
     <polygon points="84,18 102,15 106,36 88,39" fill="hsla(36, 92%, 62%, 0.38)" stroke="hsl(46, 100%, 82%)" stroke-width="1.3"/>
     <polygon points="94,35 113,32 117,53 98,56" fill="hsla(24, 96%, 56%, 0.42)" stroke="hsl(46, 100%, 82%)" stroke-width="1.3"/>
     <path d="M74 27 H85 M80 45 H93" stroke="hsl(46, 100%, 82%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M26 24 L20 20 M24 31 L16 30" stroke="hsl(24, 100%, 66%)" stroke-width="2" stroke-linecap="round"/>
     <circle cx="52" cy="44" r="1.6" fill="hsl(52, 100%, 90%)"/>
     <circle cx="80" cy="56" r="1.5" fill="hsl(38, 100%, 74%)"/>`,
    'hsla(34, 98%, 58%, 0.30)',
    `<radialGradient id="ca-impatience-aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="hsla(34, 100%, 60%, 0.44)"/><stop offset="62%" stop-color="hsla(14, 92%, 44%, 0.16)"/><stop offset="100%" stop-color="hsla(246, 56%, 16%, 0)"/></radialGradient><linearGradient id="ca-impatience-brass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="hsl(32, 74%, 36%)"/><stop offset="50%" stop-color="hsl(46, 98%, 74%)"/><stop offset="100%" stop-color="hsl(28, 70%, 28%)"/></linearGradient><linearGradient id="ca-impatience-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(50, 100%, 84%)"/><stop offset="100%" stop-color="hsl(22, 98%, 50%)"/></linearGradient>`
  ),
};
