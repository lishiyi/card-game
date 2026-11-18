/**
 * Hand-crafted inline SVG illustrations and iconography for characters, monsters, nodes, and HUD.
 */

export function getCharacterSvg(artKey, mode = 'normal') {
  switch (artKey) {
    case 'ironclad':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ic-armor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(12, 52%, 44%)" />
              <stop offset="100%" stop-color="hsl(10, 48%, 24%)" />
            </linearGradient>
            <linearGradient id="ic-steel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(34, 18%, 78%)" />
              <stop offset="100%" stop-color="hsl(28, 10%, 42%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="38" ry="7" fill="hsla(0,0%,0%,0.45)" />
          <!-- Cape -->
          <path d="M32 48 L20 102 L52 98 Z" fill="hsl(8, 58%, 26%)" />
          <!-- Torso -->
          <path d="M36 48 Q60 40 82 48 L76 96 L42 96 Z" fill="url(#ic-armor)" stroke="hsl(32, 28%, 62%)" stroke-width="2" />
          <!-- Pauldrons -->
          <path d="M26 52 Q36 38 48 48 L42 62 Q30 62 26 52 Z" fill="url(#ic-steel)" stroke="hsl(26, 15%, 22%)" stroke-width="1.5" />
          <path d="M92 52 Q82 38 70 48 L76 62 Q88 62 92 52 Z" fill="url(#ic-steel)" stroke="hsl(26, 15%, 22%)" stroke-width="1.5" />
          <!-- Helmet & Horns -->
          <path d="M44 26 Q32 14 28 24 Q34 34 45 36 Z" fill="hsl(36, 35%, 74%)" />
          <path d="M76 26 Q88 14 92 24 Q86 34 75 36 Z" fill="hsl(36, 35%, 74%)" />
          <path d="M45 22 Q60 14 75 22 L77 44 Q60 50 43 44 Z" fill="url(#ic-steel)" stroke="hsl(25, 16%, 20%)" stroke-width="2" />
          <path d="M49 34 L71 34 L67 40 L53 40 Z" fill="hsl(38, 92%, 62%)" />
          <!-- Broadsword -->
          <path d="M88 22 L96 18 L92 78 L84 78 Z" fill="url(#ic-steel)" stroke="hsl(28, 16%, 20%)" stroke-width="1.5" />
          <rect x="79" y="76" width="22" height="5" rx="2" fill="hsl(38, 65%, 52%)" />
          <rect x="87" y="81" width="6" height="12" rx="2" fill="hsl(24, 35%, 28%)" />
        </svg>
      `;

    case 'cultist':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="34" ry="6" fill="hsla(0,0%,0%,0.45)" />
          <path d="M34 46 Q60 36 86 46 L92 104 L28 104 Z" fill="hsl(206, 36%, 24%)" stroke="hsl(204, 28%, 42%)" stroke-width="2" />
          <!-- Feathered Crest -->
          <path d="M48 22 L40 8 L55 18 L62 6 L68 18 L80 10 L72 24 Z" fill="hsl(192, 52%, 46%)" />
          <!-- Beak Mask -->
          <path d="M44 24 Q60 16 74 26 L68 46 L34 42 Z" fill="hsl(38, 34%, 80%)" stroke="hsl(28, 18%, 26%)" stroke-width="1.8" />
          <circle cx="54" cy="32" r="3.2" fill="hsl(38, 92%, 56%)" />
          <!-- Ritual Dagger -->
          <path d="M22 58 Q14 42 28 32 Q24 46 32 56 Z" fill="hsl(34, 24%, 78%)" stroke="hsl(38, 65%, 52%)" stroke-width="1.5" />
        </svg>
      `;

    case 'jaw_worm':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="106" rx="42" ry="7" fill="hsla(0,0%,0%,0.45)" />
          <path d="M24 88 Q22 52 56 44 Q92 40 96 78 Q98 98 72 100 L34 100 Z" fill="hsl(198, 28%, 32%)" stroke="hsl(32, 24%, 58%)" stroke-width="2" />
          <!-- Plated Back -->
          <path d="M44 44 L52 30 L62 42 L74 32 L80 46" fill="hsl(34, 32%, 68%)" />
          <!-- Jaws & Teeth -->
          <path d="M24 72 Q44 62 62 74 Q44 90 24 84 Z" fill="hsl(8, 52%, 28%)" />
          <polygon points="30,72 34,80 38,71" fill="hsl(40, 35%, 88%)" />
          <polygon points="42,70 46,79 50,71" fill="hsl(40, 35%, 88%)" />
          <polygon points="34,85 38,78 42,86" fill="hsl(40, 35%, 88%)" />
          <circle cx="48" cy="56" r="4" fill="hsl(38, 90%, 58%)" />
        </svg>
      `;

    case 'red_louse':
    case 'green_louse': {
      const shellFill = artKey === 'red_louse' ? 'hsl(10, 58%, 42%)' : 'hsl(146, 44%, 36%)';
      const trimFill = artKey === 'red_louse' ? 'hsl(24, 68%, 62%)' : 'hsl(152, 52%, 58%)';
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="104" rx="36" ry="6" fill="hsla(0,0%,0%,0.42)" />
          <path d="M24 94 Q26 54 60 52 Q94 54 96 94 Z" fill="${shellFill}" stroke="${trimFill}" stroke-width="2.2" />
          <path d="M42 55 Q46 92 44 94 M60 52 Q62 92 60 94 M78 56 Q76 92 76 94" stroke="hsla(0,0%,0%,0.35)" stroke-width="2.5" fill="none" />
          <circle cx="36" cy="78" r="3.5" fill="hsl(42, 92%, 64%)" />
          <path d="M26 76 L16 66 M30 72 L22 58" stroke="${trimFill}" stroke-width="2.2" stroke-linecap="round" />
        </svg>
      `;
    }

    case 'acid_slime':
    case 'spike_slime': {
      const bodyFill = artKey === 'acid_slime' ? 'hsl(138, 42%, 34%)' : 'hsl(204, 34%, 36%)';
      const hiFill = artKey === 'acid_slime' ? 'hsl(132, 58%, 56%)' : 'hsl(200, 52%, 62%)';
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="105" rx="40" ry="6" fill="hsla(0,0%,0%,0.42)" />
          ${
            artKey === 'spike_slime'
              ? '<polygon points="38,54 44,36 52,52 60,32 68,52 76,38 82,56" fill="hsl(200, 42%, 68%)" />'
              : ''
          }
          <path d="M20 96 Q20 50 60 50 Q100 50 100 96 Q80 102 60 100 Q40 102 20 96 Z" fill="${bodyFill}" stroke="${hiFill}" stroke-width="2" />
          <circle cx="45" cy="74" r="4.5" fill="hsl(42, 95%, 64%)" />
          <circle cx="73" cy="74" r="4.5" fill="hsl(42, 95%, 64%)" />
          <path d="M44 86 Q59 92 74 86" stroke="hsl(38, 30%, 86%)" stroke-width="2.5" fill="none" stroke-linecap="round" />
        </svg>
      `;
    }

    case 'gremlin_nob':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="42" ry="7" fill="hsla(0,0%,0%,0.48)" />
          <!-- Muscular Body -->
          <path d="M26 44 Q60 28 94 44 L86 102 L34 102 Z" fill="hsl(10, 54%, 34%)" stroke="hsl(24, 42%, 56%)" stroke-width="2" />
          <!-- Horns & Head -->
          <path d="M42 28 Q26 10 20 24 Q30 36 44 36 Z" fill="hsl(38, 32%, 78%)" />
          <path d="M78 28 Q94 10 100 24 Q90 36 76 36 Z" fill="hsl(38, 32%, 78%)" />
          <rect x="44" y="22" width="32" height="26" rx="8" fill="hsl(8, 56%, 40%)" stroke="hsl(26, 30%, 22%)" stroke-width="2" />
          <circle cx="53" cy="33" r="3.5" fill="hsl(44, 96%, 60%)" />
          <circle cx="67" cy="33" r="3.5" fill="hsl(44, 96%, 60%)" />
          <!-- Tusks -->
          <polygon points="48,46 52,38 55,46" fill="hsl(40, 40%, 88%)" />
          <polygon points="65,46 68,38 72,46" fill="hsl(40, 40%, 88%)" />
          <!-- Bone Club -->
          <path d="M92 28 L106 24 L98 86 L88 84 Z" fill="hsl(36, 26%, 74%)" stroke="hsl(28, 20%, 30%)" stroke-width="1.8" />
        </svg>
      `;

    case 'sentry':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="28" ry="5" fill="hsla(0,0%,0%,0.42)" />
          <polygon points="60,14 84,56 60,100 36,56" fill="hsl(36, 38%, 42%)" stroke="hsl(40, 62%, 68%)" stroke-width="2.2" />
          <polygon points="60,26 74,56 60,86 46,56" fill="hsl(28, 22%, 22%)" />
          <circle cx="60" cy="56" r="10" fill="hsl(192, 78%, 56%)" />
          <circle cx="60" cy="56" r="4.5" fill="hsl(42, 95%, 88%)" />
        </svg>
      `;

    case 'the_guardian':
      if (mode === 'defensive') {
        return `
          <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
            <ellipse cx="60" cy="108" rx="42" ry="7" fill="hsla(0,0%,0%,0.5)" />
            <!-- Spiked Defensive Sphere -->
            <polygon points="60,12 67,26 53,26" fill="hsl(38, 56%, 66%)" />
            <polygon points="60,104 67,90 53,90" fill="hsl(38, 56%, 66%)" />
            <polygon points="14,58 28,51 28,65" fill="hsl(38, 56%, 66%)" />
            <polygon points="106,58 92,51 92,65" fill="hsl(38, 56%, 66%)" />
            <polygon points="26,26 40,32 32,40" fill="hsl(38, 56%, 66%)" />
            <polygon points="94,26 80,32 88,40" fill="hsl(38, 56%, 66%)" />
            <circle cx="60" cy="58" r="34" fill="hsl(32, 32%, 32%)" stroke="hsl(38, 62%, 64%)" stroke-width="3" />
            <circle cx="60" cy="58" r="14" fill="hsl(188, 68%, 48%)" />
          </svg>
        `;
      }
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="110" rx="46" ry="7" fill="hsla(0,0%,0%,0.52)" />
          <!-- Bronze Automaton Frame -->
          <polygon points="28,36 60,16 92,36 86,96 60,104 34,96" fill="hsl(34, 36%, 34%)" stroke="hsl(38, 64%, 64%)" stroke-width="2.5" />
          <!-- Blade Arms -->
          <path d="M26 38 L10 64 L22 92 L32 68 Z" fill="hsl(36, 44%, 64%)" stroke="hsl(28, 22%, 20%)" stroke-width="1.8" />
          <path d="M94 38 L110 64 L98 92 L88 68 Z" fill="hsl(36, 44%, 64%)" stroke="hsl(28, 22%, 20%)" stroke-width="1.8" />
          <!-- Glowing Core -->
          <polygon points="60,36 74,56 60,76 46,56" fill="hsl(188, 76%, 52%)" stroke="hsl(42, 90%, 82%)" stroke-width="2" />
          <circle cx="60" cy="56" r="5" fill="hsl(44, 100%, 88%)" />
        </svg>
      `;

    default:
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <circle cx="60" cy="60" r="36" fill="hsl(28, 20%, 32%)" stroke="hsl(36, 40%, 64%)" stroke-width="2" />
        </svg>
      `;
  }
}

export function getNodeIconSvg(type) {
  switch (type) {
    case 'combat':
      return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M9.5 17.5L21 6V3h-3L6.5 14.5"/><path d="M11 19l-6-6"/><path d="M8 16l-4 4"/></svg>`;
    case 'elite':
      return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4l3 4h8l3-4"/><rect x="5" y="8" width="14" height="10" rx="4"/><circle cx="9.5" cy="13" r="1.5"/><circle cx="14.5" cy="13" r="1.5"/><path d="M9 18v3M12 18v3M15 18v3"/></svg>`;
    case 'rest':
      return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c2.5 3.5 5 6.2 5 9.5a5 5 0 0 1-10 0C7 9.2 9.5 6.5 12 3z"/><path d="M4 20l16-3M4 17l16 3"/></svg>`;
    case 'shop':
      return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4h6l-1.5 3h-3L9 4z"/><path d="M6 11a6 6 0 0 1 12 0c0 4-2 9-6 9s-6-5-6-9z"/><path d="M12 11v5M10 13.5h4"/></svg>`;
    case 'event':
      return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4.5"/><circle cx="12" cy="18.5" r="0.8" fill="currentColor"/></svg>`;
    case 'boss':
      return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18h18l-2-11-5 4-2-6-2 6-5-4-2 11z"/><path d="M4 21h16"/></svg>`;
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
  return `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="M7 7l6 6M13 7l-6 6"/></svg>`;
}
