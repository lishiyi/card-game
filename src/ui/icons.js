/**
 * Hand-crafted inline SVG illustrations and iconography for characters, monsters, nodes, and HUD.
 */

import { getEnemySvg } from './enemy_art.js';
import { getPotionAccentColor, getPotionIconSvg, getUndiscoveredPotionSvg } from './potion_art.js';

function scopeSvgIds(svg, suffix) {
  if (!svg || !suffix) return svg;
  return svg
    .replace(/\bid="([^"]+)"/g, (_, id) => `id="${id}-${suffix}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${id}-${suffix})`);
}

export function getCharacterSvg(artKey, mode = 'normal', idSuffix = '') {
  const raw = renderCharacterSvgRaw(artKey, mode);
  return idSuffix ? scopeSvgIds(raw, idSuffix) : raw;
}

function renderCharacterSvgRaw(artKey, mode = 'normal') {
  switch (artKey) {
    case 'ironclad':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg hero-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ic-aura" cx="52%" cy="54%" r="48%">
              <stop offset="0%" stop-color="hsla(12, 92%, 52%, 0.28)" />
              <stop offset="65%" stop-color="hsla(6, 78%, 34%, 0.1)" />
              <stop offset="100%" stop-color="hsla(0, 0%, 0%, 0)" />
            </radialGradient>
            <linearGradient id="ic-cape" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stop-color="hsl(6, 68%, 34%)" />
              <stop offset="55%" stop-color="hsl(2, 62%, 22%)" />
              <stop offset="100%" stop-color="hsl(354, 58%, 12%)" />
            </linearGradient>
            <linearGradient id="ic-armor" x1="0.15" y1="0" x2="0.85" y2="1">
              <stop offset="0%" stop-color="hsl(14, 56%, 50%)" />
              <stop offset="48%" stop-color="hsl(8, 52%, 34%)" />
              <stop offset="100%" stop-color="hsl(2, 48%, 16%)" />
            </linearGradient>
            <linearGradient id="ic-steel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(38, 28%, 88%)" />
              <stop offset="48%" stop-color="hsl(30, 14%, 58%)" />
              <stop offset="100%" stop-color="hsl(24, 16%, 26%)" />
            </linearGradient>
            <linearGradient id="ic-horn" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(42, 48%, 90%)" />
              <stop offset="60%" stop-color="hsl(34, 34%, 64%)" />
              <stop offset="100%" stop-color="hsl(24, 28%, 34%)" />
            </linearGradient>
            <linearGradient id="ic-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(46, 94%, 74%)" />
              <stop offset="55%" stop-color="hsl(36, 78%, 48%)" />
              <stop offset="100%" stop-color="hsl(26, 66%, 26%)" />
            </linearGradient>
            <linearGradient id="ic-blade" x1="0" y1="0" x2="1" y2="0.6">
              <stop offset="0%" stop-color="hsl(38, 34%, 94%)" />
              <stop offset="48%" stop-color="hsl(28, 16%, 68%)" />
              <stop offset="100%" stop-color="hsl(22, 18%, 34%)" />
            </linearGradient>
          </defs>
          <circle cx="58" cy="60" r="52" fill="url(#ic-aura)" class="svg-pulse" />
          <ellipse cx="58" cy="109" rx="40" ry="7" fill="hsla(0,0%,0%,0.54)" />
          <ellipse cx="58" cy="109" rx="44" ry="8.5" fill="none" stroke="hsla(18, 96%, 58%, 0.44)" stroke-width="1.2" stroke-dasharray="7 5" />
          <!-- Tattered crimson war-cape -->
          <path d="M35 46 Q18 68 15 103 L28 98 L36 105 L48 97 L58 102 L48 48 Z" fill="url(#ic-cape)" stroke="hsl(6, 56%, 44%)" stroke-width="1.3" />
          <path d="M27 64 Q23 82 22 98" stroke="hsla(0,0%,0%,0.35)" stroke-width="2.2" fill="none" />
          <path d="M77 48 L90 98 L76 101 L68 52 Z" fill="hsl(356, 56%, 18%)" opacity="0.88" />
          <!-- Armored greaves & waist tassets -->
          <path d="M42 88 L54 88 L52 106 L40 105 Z" fill="url(#ic-steel)" stroke="hsl(24, 22%, 18%)" stroke-width="1.4" />
          <path d="M62 88 L74 88 L76 105 L64 106 Z" fill="url(#ic-steel)" stroke="hsl(24, 22%, 18%)" stroke-width="1.4" />
          <!-- Layered demonic cuirass -->
          <g class="svg-breathe">
            <path d="M35 47 Q58 37 81 47 L77 92 Q58 97 39 92 Z" fill="url(#ic-armor)" stroke="hsl(36, 46%, 64%)" stroke-width="1.9" />
            <!-- Cuirass rim-light & chest plates -->
            <path d="M39 50 Q58 42 77 50" stroke="hsla(42, 92%, 82%, 0.52)" stroke-width="1.7" fill="none" />
            <path d="M44 55 L58 63 L72 55 M46 65 L58 72 L70 65" stroke="hsl(36, 62%, 56%)" stroke-width="1.8" fill="none" stroke-linecap="round" />
            <path d="M58 46 L58 76" stroke="hsla(0,0%,0%,0.34)" stroke-width="2" />
            <!-- War belt & blazing ember buckle -->
            <rect x="39" y="77" width="38" height="9" rx="2.5" fill="hsl(20, 32%, 16%)" stroke="url(#ic-gold)" stroke-width="1.5" />
            <polygon points="58,74 64,81.5 58,89 52,81.5" fill="url(#ic-gold)" stroke="hsl(24, 48%, 20%)" stroke-width="1.2" />
            <circle cx="58" cy="81.5" r="2.6" fill="hsl(18, 100%, 62%)" />
            <!-- Spiked layered pauldrons -->
            <path d="M21 54 Q30 35 47 45 L42 63 Q28 65 21 54 Z" fill="url(#ic-steel)" stroke="hsl(24, 24%, 20%)" stroke-width="1.6" />
            <path d="M26 47 Q35 41 44 46" stroke="hsla(42, 86%, 92%, 0.65)" stroke-width="1.6" fill="none" />
            <polygon points="24,43 18,34 31,40" fill="url(#ic-horn)" stroke="hsl(26, 26%, 22%)" stroke-width="1.1" />
            <path d="M95 54 Q86 35 69 45 L74 63 Q88 65 95 54 Z" fill="url(#ic-steel)" stroke="hsl(24, 24%, 20%)" stroke-width="1.6" />
            <path d="M90 47 Q81 41 72 46" stroke="hsla(42, 86%, 92%, 0.5)" stroke-width="1.5" fill="none" />
            <polygon points="92,43 98,34 85,40" fill="url(#ic-horn)" stroke="hsl(26, 26%, 22%)" stroke-width="1.1" />
            <!-- Curved demon-ironclad horns with ridges & specular gleam -->
            <path d="M44 26 Q28 10 21 20 Q28 34 44 37 Z" fill="url(#ic-horn)" stroke="hsl(24, 28%, 22%)" stroke-width="1.4" />
            <path d="M41 25 Q30 14 23 20" stroke="hsla(46, 86%, 94%, 0.52)" stroke-width="1.2" fill="none" />
            <path d="M35 23 L32 30 M29 21 L27 27" stroke="hsla(24, 30%, 22%, 0.45)" stroke-width="1.3" />
            <path d="M72 26 Q88 10 95 20 Q88 34 72 37 Z" fill="url(#ic-horn)" stroke="hsl(24, 28%, 22%)" stroke-width="1.4" />
            <path d="M75 25 Q86 14 93 20" stroke="hsla(46, 86%, 94%, 0.45)" stroke-width="1.2" fill="none" />
            <path d="M81 23 L84 30 M87 21 L89 27" stroke="hsla(24, 30%, 22%, 0.45)" stroke-width="1.3" />
            <!-- Ironclad war-helm & glowing molten eyes -->
            <path d="M42 22 Q58 11 74 22 L76 44 Q58 52 40 44 Z" fill="url(#ic-steel)" stroke="hsl(24, 24%, 18%)" stroke-width="1.9" />
            <path d="M46 21 Q58 14 70 21" stroke="hsla(44, 78%, 94%, 0.72)" stroke-width="1.8" fill="none" />
            <path d="M58 15 L58 31" stroke="hsl(36, 70%, 58%)" stroke-width="2" stroke-linecap="round" />
            <path d="M45 31 L71 31 L67 42 L49 42 Z" fill="hsl(14, 48%, 12%)" stroke="hsl(34, 40%, 42%)" stroke-width="1.1" />
            <path d="M49 35 L56 37 L50 39 Z M67 35 L60 37 L66 39 Z" fill="hsl(38, 100%, 66%)" class="svg-pulse" />
            <path d="M53 42 L53 47 M58 42 L58 48 M63 42 L63 47" stroke="hsl(24, 22%, 24%)" stroke-width="1.5" />
          </g>
          <!-- Runed greatsword with fuller, molten edge & sparks -->
          <g>
            <path d="M92 14 L102 10 L98 78 L86 78 Z" fill="url(#ic-blade)" stroke="hsl(24, 24%, 20%)" stroke-width="1.5" />
            <path d="M101 12 L97.5 74" stroke="hsla(24, 100%, 64%, 0.75)" stroke-width="1.6" stroke-linecap="round" />
            <path d="M96 16 L93 74" stroke="hsla(0,0%,100%,0.68)" stroke-width="1.6" />
            <path d="M92 26 L96 29 M91 37 L95 40 M90 48 L94 51 M89 59 L93 62" stroke="hsl(22, 98%, 62%)" stroke-width="1.5" stroke-linecap="round" opacity="0.9" />
            <path d="M79 75 Q92 71 106 75 L104 82 Q92 80 81 82 Z" fill="url(#ic-gold)" stroke="hsl(24, 44%, 22%)" stroke-width="1.3" />
            <rect x="89" y="82" width="6.5" height="14" rx="2" fill="hsl(14, 42%, 24%)" stroke="hsl(34, 44%, 44%)" stroke-width="1.1" />
            <circle cx="92.2" cy="98" r="4.2" fill="url(#ic-gold)" stroke="hsl(24, 44%, 22%)" stroke-width="1.2" />
          </g>
          <!-- Floating battle embers & flame wisps -->
          <circle cx="20" cy="72" r="2.2" fill="hsl(26, 100%, 64%)" opacity="0.85" class="svg-float" />
          <circle cx="105" cy="34" r="2" fill="hsl(38, 100%, 74%)" opacity="0.85" class="svg-float" />
          <circle cx="108" cy="54" r="1.4" fill="hsl(16, 100%, 62%)" opacity="0.8" class="svg-float" />
          <circle cx="28" cy="28" r="1.6" fill="hsl(14, 100%, 62%)" opacity="0.75" />
        </svg>
      `;

    case 'silent':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg hero-svg" aria-hidden="true">
          <defs>
            <radialGradient id="sl-aura" cx="50%" cy="54%" r="48%">
              <stop offset="0%" stop-color="hsla(146, 86%, 44%, 0.28)" />
              <stop offset="68%" stop-color="hsla(162, 72%, 22%, 0.1)" />
              <stop offset="100%" stop-color="hsla(0, 0%, 0%, 0)" />
            </radialGradient>
            <linearGradient id="sl-cloak" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stop-color="hsl(152, 50%, 38%)" />
              <stop offset="52%" stop-color="hsl(160, 48%, 22%)" />
              <stop offset="100%" stop-color="hsl(168, 52%, 10%)" />
            </linearGradient>
            <linearGradient id="sl-bone" x1="0" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stop-color="hsl(44, 38%, 94%)" />
              <stop offset="65%" stop-color="hsl(38, 24%, 72%)" />
              <stop offset="100%" stop-color="hsl(32, 20%, 46%)" />
            </linearGradient>
            <linearGradient id="sl-blade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(160, 44%, 94%)" />
              <stop offset="50%" stop-color="hsl(166, 22%, 64%)" />
              <stop offset="100%" stop-color="hsl(172, 24%, 30%)" />
            </linearGradient>
            <linearGradient id="sl-venom" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(126, 100%, 70%)" />
              <stop offset="100%" stop-color="hsl(148, 88%, 40%)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="52" fill="url(#sl-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="109" rx="39" ry="7" fill="hsla(0,0%,0%,0.54)" />
          <ellipse cx="60" cy="109" rx="44" ry="8.5" fill="none" stroke="hsla(146, 92%, 54%, 0.42)" stroke-width="1.2" stroke-dasharray="6 5" />
          <!-- Windswept tattered shadow scarf -->
          <path d="M74 44 Q98 46 108 62 Q94 60 88 70 Q80 58 72 56 Z" fill="hsl(158, 46%, 18%)" stroke="hsl(148, 54%, 44%)" stroke-width="1.2" class="svg-float" />
          <g class="svg-breathe">
            <!-- Flowing hooded assassin mantle with layered folds -->
            <path d="M35 44 Q16 68 18 103 L36 96 L46 104 L60 98 L74 104 L85 96 L100 101 Q96 66 83 44 Z" fill="url(#sl-cloak)" stroke="hsl(148, 52%, 50%)" stroke-width="1.8" />
            <path d="M32 62 Q28 80 26 97 M86 62 Q90 80 93 96" stroke="hsla(0,0%,0%,0.36)" stroke-width="2" fill="none" />
            <path d="M40 48 Q60 40 78 48 L74 96 L44 96 Z" fill="hsl(168, 38%, 11%)" />
            <!-- Leather bandolier with poison vials & throwing shivs -->
            <path d="M43 52 L77 82" stroke="hsl(28, 38%, 36%)" stroke-width="4.2" stroke-linecap="round" />
            <path d="M77 52 L43 82" stroke="hsl(28, 34%, 28%)" stroke-width="3.2" stroke-linecap="round" />
            <!-- Glowing venom vials strapped to chest -->
            <rect x="49" y="57" width="4.5" height="9" rx="2" transform="rotate(-38 51 61)" fill="url(#sl-venom)" stroke="hsl(144, 80%, 80%)" stroke-width="0.9" />
            <rect x="59" y="65" width="4.5" height="9" rx="2" transform="rotate(-38 61 69)" fill="url(#sl-venom)" stroke="hsl(144, 80%, 80%)" stroke-width="0.9" />
            <polygon points="69,56 75,52 72,61" fill="url(#sl-blade)" />
            <!-- Layered assassin hood with lunar rim highlight -->
            <path d="M34 42 Q38 12 60 10 Q82 12 86 42 Q72 54 60 54 Q48 54 34 42 Z" fill="url(#sl-cloak)" stroke="hsl(146, 56%, 54%)" stroke-width="1.9" />
            <path d="M41 21 Q60 12 79 21" stroke="hsla(146, 92%, 82%, 0.55)" stroke-width="1.7" fill="none" />
            <!-- Curved hunter skull-horns -->
            <path d="M47 21 Q35 6 29 16 Q37 26 47 29 Z" fill="url(#sl-bone)" stroke="hsl(160, 26%, 20%)" stroke-width="1.3" />
            <path d="M73 21 Q85 6 91 16 Q83 26 73 29 Z" fill="url(#sl-bone)" stroke="hsl(160, 26%, 20%)" stroke-width="1.3" />
            <!-- Detailed Nemesis-style bone hunter skull mask -->
            <path d="M44 24 Q60 16 76 24 L73 43 Q66 50 60 49 Q54 50 47 43 Z" fill="url(#sl-bone)" stroke="hsl(164, 30%, 16%)" stroke-width="1.8" />
            <path d="M48 24 Q60 19 72 24" stroke="hsla(50, 90%, 98%, 0.7)" stroke-width="1.3" fill="none" />
            <path d="M60 19 L58 26 L61 28" stroke="hsl(164, 24%, 34%)" stroke-width="1.1" fill="none" opacity="0.65" />
            <!-- Eye sockets & piercing emerald slit glow -->
            <path d="M47 32 L58 34 L50 39 Z" fill="hsl(166, 52%, 10%)" />
            <path d="M73 32 L62 34 L70 39 Z" fill="hsl(166, 52%, 10%)" />
            <path d="M49 33 L56 35 L51 37.5 Z" fill="hsl(136, 100%, 64%)" class="svg-pulse" />
            <path d="M71 33 L64 35 L69 37.5 Z" fill="hsl(136, 100%, 64%)" class="svg-pulse" />
            <path d="M58 39 L60 43 L62 39 Z" fill="hsl(164, 34%, 22%)" />
            <path d="M53 45 L55 48 M58 45 L58 49 M62 45 L62 49 M66 45 L65 48" stroke="hsl(164, 28%, 26%)" stroke-width="1.2" />
          </g>
          <!-- Left curved kris dagger dripping venom with blade sheen -->
          <path d="M10 58 Q21 42 39 55 L31 65 Q21 58 10 58 Z" fill="url(#sl-blade)" stroke="hsl(164, 34%, 20%)" stroke-width="1.4" />
          <path d="M12 57 Q22 48 34 55" stroke="url(#sl-venom)" stroke-width="2.6" stroke-linecap="round" fill="none" />
          <path d="M15 54 Q23 47 32 52" stroke="hsla(0,0%,100%,0.7)" stroke-width="1" stroke-linecap="round" fill="none" />
          <path d="M31 62 L38 68" stroke="hsl(32, 46%, 44%)" stroke-width="3.2" stroke-linecap="round" />
          <path d="M16 64 Q14 70 17 72 Q20 70 16 64 Z" fill="url(#sl-venom)" class="svg-float" />
          <!-- Right curved venom kris -->
          <path d="M110 46 Q97 32 81 53 L89 61 Q99 52 110 46 Z" fill="url(#sl-blade)" stroke="hsl(164, 34%, 20%)" stroke-width="1.4" />
          <path d="M107 46 Q97 40 87 51" stroke="url(#sl-venom)" stroke-width="2.6" stroke-linecap="round" fill="none" />
          <path d="M104 43 Q96 38 88 47" stroke="hsla(0,0%,100%,0.65)" stroke-width="1" stroke-linecap="round" fill="none" />
          <path d="M88 58 L81 65" stroke="hsl(32, 46%, 44%)" stroke-width="3.2" stroke-linecap="round" />
          <path d="M101 56 Q99 63 102 65 Q105 63 101 56 Z" fill="url(#sl-venom)" class="svg-float" />
          <!-- Floating venom mist motes -->
          <circle cx="14" cy="40" r="1.8" fill="hsl(134, 100%, 68%)" opacity="0.78" class="svg-float" />
          <circle cx="106" cy="74" r="1.7" fill="hsl(148, 100%, 70%)" opacity="0.72" class="svg-float" />
        </svg>
      `;

    case 'watcher':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg hero-svg" aria-hidden="true">
          <defs>
            <radialGradient id="wt-aura" cx="52%" cy="50%" r="50%">
              <stop offset="0%" stop-color="hsla(286, 86%, 60%, 0.3)" />
              <stop offset="65%" stop-color="hsla(266, 72%, 34%, 0.12)" />
              <stop offset="100%" stop-color="hsla(0, 0%, 0%, 0)" />
            </radialGradient>
            <linearGradient id="wt-robe" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stop-color="hsl(278, 56%, 46%)" />
              <stop offset="52%" stop-color="hsl(270, 52%, 28%)" />
              <stop offset="100%" stop-color="hsl(262, 56%, 13%)" />
            </linearGradient>
            <linearGradient id="wt-sash" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(48, 96%, 76%)" />
              <stop offset="55%" stop-color="hsl(38, 86%, 54%)" />
              <stop offset="100%" stop-color="hsl(28, 72%, 34%)" />
            </linearGradient>
            <linearGradient id="wt-staff" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(48, 96%, 78%)" />
              <stop offset="55%" stop-color="hsl(34, 68%, 48%)" />
              <stop offset="100%" stop-color="hsl(24, 52%, 24%)" />
            </linearGradient>
            <linearGradient id="wt-silk" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(46, 48%, 94%)" />
              <stop offset="100%" stop-color="hsl(36, 28%, 70%)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="58" r="52" fill="url(#wt-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="109" rx="39" ry="7" fill="hsla(0,0%,0%,0.54)" />
          <ellipse cx="60" cy="109" rx="44" ry="8.5" fill="none" stroke="hsla(46, 96%, 72%, 0.45)" stroke-width="1.2" stroke-dasharray="5 4" />
          <!-- Sacred mandala halo behind head -->
          <g class="svg-spin-slow">
            <circle cx="60" cy="36" r="28" fill="none" stroke="hsla(46, 94%, 72%, 0.36)" stroke-width="1.3" stroke-dasharray="4 4" />
            <circle cx="60" cy="36" r="22" fill="none" stroke="hsla(292, 90%, 74%, 0.24)" stroke-width="1" />
            <polygon points="60,8 63,16 57,16" fill="hsla(48, 98%, 76%, 0.55)" />
            <polygon points="60,64 63,56 57,56" fill="hsla(48, 98%, 76%, 0.4)" />
            <polygon points="32,36 40,33 40,39" fill="hsla(48, 98%, 76%, 0.48)" />
            <polygon points="88,36 80,33 80,39" fill="hsla(48, 98%, 76%, 0.48)" />
          </g>
          <!-- Orbiting stance talismans: Calm (cyan), Divinity (gold), Wrath (crimson) -->
          <g class="svg-float">
            <circle cx="19" cy="44" r="6.5" fill="hsla(198, 92%, 64%, 0.24)" stroke="hsl(194, 96%, 72%)" stroke-width="1.5" />
            <polygon points="19,39.5 22.5,44 19,48.5 15.5,44" fill="hsl(194, 100%, 84%)" />
            <circle cx="24" cy="21" r="5.2" fill="hsla(46, 98%, 68%, 0.28)" stroke="hsl(46, 98%, 74%)" stroke-width="1.4" />
            <circle cx="24" cy="21" r="2.2" fill="hsl(50, 100%, 90%)" />
            <circle cx="101" cy="28" r="5.6" fill="hsla(352, 92%, 58%, 0.26)" stroke="hsl(352, 94%, 68%)" stroke-width="1.4" />
            <polygon points="101,24 104,28 101,32 98,28" fill="hsl(10, 100%, 76%)" />
          </g>
          <g class="svg-breathe">
            <!-- Flowing amethyst robe & wide monastic sleeves -->
            <path d="M35 46 Q17 68 22 103 L47 99 L60 106 L74 99 L96 103 Q93 68 79 46 Z" fill="url(#wt-robe)" stroke="hsl(284, 62%, 62%)" stroke-width="1.8" />
            <path d="M33 64 Q30 82 32 99 M85 64 Q88 82 86 99" stroke="hsla(0,0%,0%,0.34)" stroke-width="2" fill="none" />
            <path d="M38 48 Q60 41 78 48" stroke="hsla(292, 92%, 86%, 0.52)" stroke-width="1.6" fill="none" />
            <!-- Inner tunic, brocade sash & prayer-bead belt -->
            <path d="M44 48 Q60 43 74 48 L71 99 L47 99 Z" fill="hsl(266, 42%, 12%)" />
            <path d="M43 49 L75 68 L71 77 L45 58 Z" fill="url(#wt-sash)" stroke="hsl(32, 62%, 32%)" stroke-width="0.9" />
            <path d="M46 72 L73 72 L70 80 L48 80 Z" fill="hsl(338, 76%, 48%)" stroke="url(#wt-sash)" stroke-width="1.1" />
            <path d="M54 80 L51 98 M66 80 L69 98" stroke="url(#wt-sash)" stroke-width="2.2" stroke-linecap="round" />
            <circle cx="51" cy="76" r="2" fill="hsl(48, 96%, 78%)" /><circle cx="60" cy="76" r="2.4" fill="hsl(48, 96%, 82%)" /><circle cx="69" cy="76" r="2" fill="hsl(48, 96%, 78%)" />
            <!-- Hood & cowl -->
            <path d="M37 44 Q41 14 60 11 Q79 14 83 44 Q71 53 60 53 Q49 53 37 44 Z" fill="url(#wt-robe)" stroke="hsl(286, 64%, 66%)" stroke-width="1.8" />
            <path d="M44 20 Q60 13 76 20" stroke="hsla(296, 94%, 86%, 0.55)" stroke-width="1.6" fill="none" />
            <!-- Face & iconic embroidered silk blindfold -->
            <ellipse cx="60" cy="34" rx="13" ry="14" fill="hsl(30, 36%, 78%)" stroke="hsl(26, 24%, 42%)" stroke-width="1" />
            <path d="M45 29 Q60 25 75 29 L74 38 Q60 40 46 38 Z" fill="url(#wt-silk)" stroke="hsl(278, 52%, 48%)" stroke-width="1.4" />
            <!-- Windswept blindfold silk tails -->
            <path d="M45 31 Q30 34 21 43" stroke="url(#wt-silk)" stroke-width="3.2" stroke-linecap="round" fill="none" />
            <path d="M46 36 Q32 41 26 51" stroke="hsl(42, 34%, 76%)" stroke-width="2.2" stroke-linecap="round" fill="none" />
            <!-- Luminous Third-Eye lotus sigil -->
            <ellipse cx="60" cy="33" rx="6.5" ry="4.4" fill="hsla(294, 96%, 68%, 0.28)" class="svg-pulse" />
            <path d="M60 27.5 L65 33 L60 38.5 L55 33 Z" fill="hsl(294, 96%, 72%)" stroke="hsl(48, 100%, 82%)" stroke-width="1.2" />
            <circle cx="60" cy="33" r="1.8" fill="hsl(50, 100%, 92%)" />
          </g>
          <!-- Ornate gilded lotus martial staff with swirling mantra ribbon -->
          <path d="M98 30 Q107 48 92 64 Q82 76 96 90" fill="none" stroke="hsla(294, 94%, 74%, 0.55)" stroke-width="1.8" stroke-linecap="round" class="svg-float" />
          <line x1="95" y1="19" x2="84" y2="103" stroke="url(#wt-staff)" stroke-width="4.4" stroke-linecap="round" />
          <line x1="94" y1="22" x2="83.5" y2="100" stroke="hsla(50, 100%, 92%, 0.58)" stroke-width="1.3" />
          <path d="M95 9 Q106 16 101 27 Q95 22 95 9 Z" fill="hsl(294, 90%, 72%)" stroke="hsl(46, 98%, 74%)" stroke-width="1.3" />
          <path d="M95 9 Q84 16 89 27 Q95 22 95 9 Z" fill="hsl(294, 90%, 72%)" stroke="hsl(46, 98%, 74%)" stroke-width="1.3" />
          <circle cx="95" cy="20" r="5" fill="url(#wt-sash)" stroke="hsl(294, 88%, 76%)" stroke-width="1.2" />
          <circle cx="95" cy="20" r="2" fill="hsl(52, 100%, 94%)" />
          <circle cx="88" cy="35" r="2.2" fill="hsl(48, 96%, 76%)" />
          <circle cx="96" cy="37" r="2" fill="hsl(48, 96%, 76%)" />
        </svg>
      `;

    default: {
      const enemySvg = getEnemySvg(artKey, mode);
      if (enemySvg) return enemySvg;
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <circle cx="60" cy="60" r="36" fill="hsl(28, 20%, 32%)" stroke="hsl(36, 40%, 64%)" stroke-width="2" />
        </svg>
      `;
    }
  }
}

export function getNodeIconSvg(type) {
  switch (type) {
    case 'combat':
      // 普通战斗：圆润史莱姆/小怪兽（触角 + 圆眼 + 小尖牙）
      return `<svg viewBox="0 0 24 24" width="20" height="20" data-node-icon="combat" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 7L7.5 4M15 7l1.5-3"/><path d="M4 18c0-5.2 3.4-9 8-9s8 3.8 8 9c-2.4 1.2-5 1.5-8 1.5S6.4 19.2 4 18z" fill="currentColor" fill-opacity="0.16"/><circle cx="9.2" cy="13.5" r="1.3" fill="currentColor"/><circle cx="14.8" cy="13.5" r="1.3" fill="currentColor"/><path d="M9.5 16.6q2.5 1.4 5 0"/></svg>`;
    case 'elite':
      // 精英强敌：双角恶魔巨怪（威猛弯角 + 凶戾斜眼 + 獠牙，与普通小怪明显区分）
      return `<svg viewBox="0 0 24 24" width="20" height="20" data-node-icon="elite" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 9C3.5 7.5 2.5 4.2 4 2.8c1.2 2 2.8 3.2 4.8 3.7"/><path d="M17.5 9c3-1.5 4-4.8 2.5-6.2-1.2 2-2.8 3.2-4.8 3.7"/><path d="M6 10.5c0-2.5 2.7-4.5 6-4.5s6 2 6 4.5v5.5c0 2.2-2.7 4-6 4s-6-1.8-6-4z" fill="currentColor" fill-opacity="0.2"/><path d="M8.5 11.8l2.5 1.2M15.5 11.8L13 13"/><path d="M8.8 18.5l1.2-2.6 1.2 2.4M15.2 18.5L14 15.9l-1.2 2.4"/></svg>`;
    case 'rest':
      // 篝火营地：跃动火焰与交叉木柴
      return `<svg viewBox="0 0 24 24" width="20" height="20" data-node-icon="rest" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c2.6 3.2 4.8 5.8 4.8 9a4.8 4.8 0 0 1-9.6 0C7.2 8.8 9.4 6.2 12 3z" fill="currentColor" fill-opacity="0.2"/><path d="M12 9.5c1 1.4 1.8 2.4 1.8 3.6a1.8 1.8 0 0 1-3.6 0c0-1.2.8-2.2 1.8-3.6z"/><path d="M4.5 20.5l15-3M4.5 17.5l15 3"/></svg>`;
    case 'shop':
      // 神秘商人：束口金币钱袋
      return `<svg viewBox="0 0 24 24" width="20" height="20" data-node-icon="shop" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3.5h6l-1.3 3.2h-3.4L9 3.5z"/><path d="M6 12.2C6 8.8 8.7 6.7 12 6.7s6 2.1 6 5.5c0 4.4-2.2 7.8-6 7.8s-6-3.4-6-7.8z" fill="currentColor" fill-opacity="0.16"/><path d="M12 10.2v5.6M10.2 11.8c0-.9.8-1.4 1.8-1.4s1.8.5 1.8 1.3-.8 1.2-1.8 1.4-1.8.5-1.8 1.4.8 1.4 1.8 1.4 1.8-.5 1.8-1.4"/></svg>`;
    case 'event':
      // 未知事件：秘仪菱纹与问号
      return `<svg viewBox="0 0 24 24" width="20" height="20" data-node-icon="event" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12,2.5 21.5,12 12,21.5 2.5,12" fill="currentColor" fill-opacity="0.14"/><path d="M9.8 9.4a2.3 2.3 0 0 1 4.4.8c0 1.5-2.2 2-2.2 3.5"/><circle cx="12" cy="16.8" r="0.9" fill="currentColor"/></svg>`;
    case 'treasure':
      // 远古宝箱：镶金宝箱与锁扣
      return `<svg viewBox="0 0 24 24" width="20" height="20" data-node-icon="treasure" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 10.5C3.5 7.5 6.5 5.5 12 5.5s8.5 2 8.5 5H3.5z" fill="currentColor" fill-opacity="0.22"/><rect x="3.5" y="10.5" width="17" height="8.5" rx="1.8" fill="currentColor" fill-opacity="0.14"/><rect x="10.3" y="9.2" width="3.4" height="4" rx="0.8" fill="currentColor"/></svg>`;
    case 'boss':
      // 尖塔首领：王冠首领魔像
      return `<svg viewBox="0 0 24 24" width="22" height="22" data-node-icon="boss" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5L6.5 4l3.5 3 2-4 2 4 3.5-3L20 9.5z" fill="currentColor" fill-opacity="0.24"/><path d="M5 9.5h14l-1.4 8.5L12 21l-5.6-3z" fill="currentColor" fill-opacity="0.14"/><circle cx="9.4" cy="14" r="1.2" fill="currentColor"/><circle cx="14.6" cy="14" r="1.2" fill="currentColor"/></svg>`;
    default:
      return '';
  }
}

export function getCardTypeIconSvg(cardType) {
  switch (cardType) {
    case 'attack':
      // 攻击牌：利剑图标 🗡
      return `<svg viewBox="0 0 16 16" width="13" height="13" class="card-type-icon" data-card-type-icon="attack" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11.8 2.2L13.8 2.2 13.8 4.2 6.6 11.4 4.6 9.4z" fill="currentColor" fill-opacity="0.28"/><path d="M3.4 8.4l4.2 4.2"/><path d="M4.8 11.2L2.3 13.7"/></svg>`;
    case 'skill':
      // 技能牌：纹章护盾图标 🛡
      return `<svg viewBox="0 0 16 16" width="13" height="13" class="card-type-icon" data-card-type-icon="skill" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 1.8l5 2v4.1c0 3.3-2.1 5.4-5 6.5-2.9-1.1-5-3.2-5-6.5V3.8L8 1.8z" fill="currentColor" fill-opacity="0.24"/><path d="M8 4.8v6.2M5.8 7.4h4.4"/></svg>`;
    case 'power':
      // 能力牌：雷霆威能图标 ⚡
      return `<svg viewBox="0 0 16 16" width="13" height="13" class="card-type-icon" data-card-type-icon="power" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="9.2,1.6 3.8,8.8 7.8,8.8 6.8,14.4 12.2,7.2 8.2,7.2"/></svg>`;
    case 'status':
      // 状态牌：暗蚀咒印图标
      return `<svg viewBox="0 0 16 16" width="13" height="13" class="card-type-icon" data-card-type-icon="status" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="8" r="5.5"/><path d="M5.8 5.8l4.4 4.4M10.2 5.8l-4.4 4.4"/></svg>`;
    case 'curse':
      // 诅咒牌：深渊骷髅咒印图标
      return `<svg viewBox="0 0 16 16" width="13" height="13" class="card-type-icon" data-card-type-icon="curse" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.2 8.2a3.8 3.8 0 1 1 7.6 0c0 1.4-.6 2.3-1.3 2.9v2.1H5.5v-2.1c-.7-.6-1.3-1.5-1.3-2.9z" fill="currentColor" fill-opacity="0.26"/><circle cx="6.6" cy="7.8" r="0.8" fill="currentColor"/><circle cx="9.4" cy="7.8" r="0.8" fill="currentColor"/></svg>`;
    default:
      return '';
  }
}

export function getIntentIconSvg(intentType) {
  if (intentType && intentType.startsWith('attack')) {
    return `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M14 3l3 3-9 9H5v-3l9-9z"/><path d="M3 17l3-3"/></svg>`;
  }
  if (intentType === 'defend' || intentType === 'defend_buff') {
    return `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M10 2l6 2.5v5c0 4.2-2.6 6.9-6 8.5-3.4-1.6-6-4.3-6-8.5v-5L10 2z"/></svg>`;
  }
  if (intentType === 'buff') {
    return `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M10 16V4M5 9l5-5 5 5"/></svg>`;
  }
  if (intentType === 'sleep') {
    return `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.8 13.4A5.8 5.8 0 0 1 6.6 6.2a5.8 5.8 0 1 0 7.2 7.2z" fill="currentColor" fill-opacity="0.22"/><path d="M12.2 4.2h3.4l-3.4 3.4h3.4"/></svg>`;
  }
  return `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="M7 7l6 6M13 7l-6 6"/></svg>`;
}

export function getLootIconSvg(kind) {
  switch (kind) {
    case 'gold':
      // 战利品金币：层叠闪烁金币与星芒
      return `<svg viewBox="0 0 28 28" width="28" height="28" data-loot-icon="gold" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <ellipse cx="11.5" cy="18.5" rx="7" ry="3.2" fill="currentColor" fill-opacity="0.28"/>
        <path d="M4.5 18.5v3.2c0 1.8 3.1 3.2 7 3.2s7-1.4 7-3.2v-3.2" fill="currentColor" fill-opacity="0.18"/>
        <ellipse cx="16.5" cy="12.5" rx="7" ry="3.2" fill="currentColor" fill-opacity="0.34"/>
        <path d="M9.5 12.5v3.2c0 1.8 3.1 3.2 7 3.2s7-1.4 7-3.2v-3.2" fill="currentColor" fill-opacity="0.22"/>
        <ellipse cx="14" cy="7.2" rx="6.5" ry="2.9" fill="currentColor" fill-opacity="0.42"/>
        <path d="M23.5 4.2v3.2M21.9 5.8h3.2" stroke-width="1.6"/>
      </svg>`;
    case 'relic':
      // 战利品遗物：镶宝远古圣徽与光环
      return `<svg viewBox="0 0 28 28" width="28" height="28" data-loot-icon="relic" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polygon points="14,2.8 20.5,8.2 18.2,17.2 9.8,17.2 7.5,8.2" fill="currentColor" fill-opacity="0.26"/>
        <polygon points="14,6.4 17.4,9.5 16.1,14.2 11.9,14.2 10.6,9.5" fill="currentColor" fill-opacity="0.45"/>
        <path d="M9.5 20.5h9l1.8 3.8H7.7l1.8-3.8z" fill="currentColor" fill-opacity="0.24"/>
        <path d="M14 17.2v3.3M4.2 11.5l2-0.5M23.8 11.5l-2-0.5"/>
      </svg>`;
    case 'potion':
      // 战利品药水：圆底炼金魔药瓶与气泡
      return `<svg viewBox="0 0 28 28" width="28" height="28" data-loot-icon="potion" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="11" y="3" width="6" height="3.2" rx="1" fill="currentColor" fill-opacity="0.38"/>
        <path d="M12 6.2v3.6l-5.6 7.8a6.2 6.2 0 0 0 5.1 9.7h5a6.2 6.2 0 0 0 5.1-9.7L16 9.8V6.2" fill="currentColor" fill-opacity="0.16"/>
        <path d="M6.8 17.5q3.6-1.8 7.2 0t7.2 0a5.8 5.8 0 0 1-5 6.8h-4.4a5.8 5.8 0 0 1-5-6.8z" fill="currentColor" fill-opacity="0.38"/>
        <circle cx="12" cy="20.5" r="1.1" fill="currentColor"/>
        <circle cx="16.2" cy="19.2" r="0.9" fill="currentColor"/>
      </svg>`;
    case 'chest':
      // 远古秘宝宝箱：镶金古铜宝箱与星芒
      return `<svg viewBox="0 0 28 28" width="28" height="28" data-loot-icon="chest" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4.5 11.5h19v11a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2v-11z" fill="currentColor" fill-opacity="0.22"/>
        <path d="M4 11.5V9.2C4 6.6 8.2 5 14 5s10 1.6 10 4.2v2.3H4z" fill="currentColor" fill-opacity="0.36"/>
        <path d="M10 5.6v18.9M18 5.6v18.9" stroke-opacity="0.65"/>
        <rect x="12" y="10.2" width="4" height="4.8" rx="1" fill="currentColor" fill-opacity="0.72"/>
        <path d="M23.5 3.4v2.8M22.1 4.8h2.8" stroke-width="1.5"/>
      </svg>`;
    default:
      return '';
  }
}

export function getVitalIconSvg(kind) {
  switch (kind) {
    case 'hp':
      return `<svg viewBox="0 0 20 20" width="16" height="16" class="vital-icon-svg" data-vital-icon="hp" aria-hidden="true">
        <defs>
          <radialGradient id="hud-vital-hp-grad" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stop-color="hsl(6, 100%, 74%)" />
            <stop offset="55%" stop-color="hsl(356, 88%, 54%)" />
            <stop offset="100%" stop-color="hsl(346, 82%, 32%)" />
          </radialGradient>
        </defs>
        <path
          d="M10 17.6C9.6 17.6 3 13 3 7.6A3.9 3.9 0 0 1 10 5.1a3.9 3.9 0 0 1 7 2.5C17 13 10.4 17.6 10 17.6Z"
          fill="url(#hud-vital-hp-grad)"
          stroke="hsl(8, 92%, 78%)"
          stroke-width="1.2"
          stroke-linejoin="round"
        />
        <path d="M5.6 7.4a1.9 1.9 0 0 1 2.2-1.7" fill="none" stroke="hsla(0, 0%, 100%, 0.72)" stroke-width="1.3" stroke-linecap="round" />
      </svg>`;
    case 'gold':
      return `<svg viewBox="0 0 20 20" width="16" height="16" class="vital-icon-svg" data-vital-icon="gold" aria-hidden="true">
        <defs>
          <radialGradient id="hud-vital-gold-grad" cx="36%" cy="32%" r="68%">
            <stop offset="0%" stop-color="hsl(50, 100%, 82%)" />
            <stop offset="55%" stop-color="hsl(42, 92%, 56%)" />
            <stop offset="100%" stop-color="hsl(32, 76%, 32%)" />
          </radialGradient>
        </defs>
        <circle cx="10" cy="10" r="7.5" fill="url(#hud-vital-gold-grad)" stroke="hsl(48, 96%, 78%)" stroke-width="1.2" />
        <circle cx="10" cy="10" r="5" fill="none" stroke="hsl(28, 62%, 28%)" stroke-width="1.1" opacity="0.72" />
        <polygon points="10,6.6 12.6,10 10,13.4 7.4,10" fill="hsl(48, 100%, 84%)" stroke="hsl(28, 60%, 28%)" stroke-width="0.9" />
      </svg>`;
    default:
      return '';
  }
}

export { getPotionAccentColor, getPotionIconSvg, getUndiscoveredPotionSvg };
