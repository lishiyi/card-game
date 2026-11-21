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

    case 'silent':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="sl-cloak" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(154, 48%, 32%)" />
              <stop offset="100%" stop-color="hsl(164, 46%, 14%)" />
            </linearGradient>
            <linearGradient id="sl-blade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(156, 30%, 88%)" />
              <stop offset="100%" stop-color="hsl(168, 20%, 48%)" />
            </linearGradient>
            <linearGradient id="sl-venom" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(132, 92%, 62%)" />
              <stop offset="100%" stop-color="hsl(148, 84%, 40%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="38" ry="7" fill="hsla(0,0%,0%,0.48)" />
          <!-- Flowing dark assassin mantle -->
          <path d="M36 44 Q18 68 20 102 L48 96 L60 103 L74 96 L96 100 Q92 64 80 44 Z" fill="url(#sl-cloak)" stroke="hsl(152, 42%, 44%)" stroke-width="1.8" />
          <!-- Inner cowl & leather harness -->
          <path d="M40 48 Q60 40 78 48 L74 94 L44 94 Z" fill="hsl(168, 34%, 13%)" />
          <path d="M44 54 L76 80 M76 54 L44 80" stroke="hsl(32, 34%, 42%)" stroke-width="2.4" opacity="0.8" />
          <!-- Hood -->
          <path d="M36 42 Q40 14 60 12 Q80 14 84 42 Q72 52 60 52 Q48 52 36 42 Z" fill="url(#sl-cloak)" stroke="hsl(150, 48%, 48%)" stroke-width="1.8" />
          <!-- Pale bone skull hunter mask & horns -->
          <path d="M48 20 Q38 8 34 17 Q41 25 48 27 Z" fill="hsl(42, 26%, 82%)" />
          <path d="M72 20 Q82 8 86 17 Q79 25 72 27 Z" fill="hsl(42, 26%, 82%)" />
          <path d="M45 25 Q60 18 75 25 L72 44 Q60 49 48 44 Z" fill="hsl(42, 24%, 84%)" stroke="hsl(160, 26%, 18%)" stroke-width="1.8" />
          <!-- Glowing jade eye slits -->
          <path d="M49 33 L57 35 L51 38 Z" fill="hsl(142, 95%, 58%)" />
          <path d="M71 33 L63 35 L69 38 Z" fill="hsl(142, 95%, 58%)" />
          <!-- Left curved venom dagger -->
          <path d="M16 56 Q24 44 38 56 L30 64 Q22 58 16 56 Z" fill="url(#sl-blade)" stroke="hsl(162, 28%, 22%)" stroke-width="1.3" />
          <path d="M16 56 Q22 51 28 55" stroke="url(#sl-venom)" stroke-width="2.6" stroke-linecap="round" fill="none" />
          <circle cx="19" cy="64" r="2.2" fill="hsl(134, 92%, 58%)" />
          <!-- Right curved venom dagger -->
          <path d="M104 46 Q94 34 82 54 L90 60 Q98 52 104 46 Z" fill="url(#sl-blade)" stroke="hsl(162, 28%, 22%)" stroke-width="1.3" />
          <path d="M104 46 Q96 42 90 50" stroke="url(#sl-venom)" stroke-width="2.6" stroke-linecap="round" fill="none" />
          <circle cx="99" cy="57" r="2.4" fill="hsl(134, 92%, 58%)" />
        </svg>
      `;

    case 'watcher':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="wt-robe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(276, 52%, 40%)" />
              <stop offset="100%" stop-color="hsl(268, 52%, 17%)" />
            </linearGradient>
            <linearGradient id="wt-sash" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(44, 90%, 66%)" />
              <stop offset="100%" stop-color="hsl(32, 76%, 44%)" />
            </linearGradient>
            <linearGradient id="wt-staff" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(46, 92%, 72%)" />
              <stop offset="100%" stop-color="hsl(28, 52%, 34%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="38" ry="7" fill="hsla(0,0%,0%,0.48)" />
          <!-- Orbiting stance aura petals (Calm cyan / Wrath crimson / Divinity gold) -->
          <circle cx="22" cy="40" r="6" fill="hsla(198, 90%, 64%, 0.24)" stroke="hsl(196, 92%, 68%)" stroke-width="1.4" />
          <circle cx="22" cy="40" r="2.3" fill="hsl(196, 96%, 80%)" />
          <circle cx="26" cy="22" r="4.5" fill="hsla(44, 94%, 64%, 0.25)" stroke="hsl(44, 94%, 68%)" stroke-width="1.3" />
          <circle cx="96" cy="24" r="5" fill="hsla(352, 86%, 58%, 0.26)" stroke="hsl(352, 88%, 66%)" stroke-width="1.3" />
          <!-- Flowing amethyst robe & wide sleeves -->
          <path d="M36 46 Q20 68 24 102 L48 99 L60 104 L74 99 L94 102 Q90 68 78 46 Z" fill="url(#wt-robe)" stroke="hsl(282, 54%, 56%)" stroke-width="1.8" />
          <!-- Golden monastery sash & inner tunic -->
          <path d="M44 48 Q60 43 74 48 L70 98 L48 98 Z" fill="hsl(266, 36%, 14%)" />
          <path d="M44 50 L74 68 L70 76 L46 58 Z" fill="url(#wt-sash)" opacity="0.92" />
          <path d="M47 72 L72 72 L69 78 L49 78 Z" fill="hsl(338, 72%, 52%)" />
          <!-- Cowl & hood -->
          <path d="M38 44 Q42 15 60 13 Q78 15 82 44 Q71 52 60 52 Q49 52 38 44 Z" fill="url(#wt-robe)" stroke="hsl(284, 58%, 60%)" stroke-width="1.8" />
          <!-- Face & iconic silk blindfold -->
          <ellipse cx="60" cy="34" rx="13" ry="14" fill="hsl(32, 34%, 76%)" />
          <path d="M45 29 Q60 26 75 29 L74 37 Q60 39 46 37 Z" fill="hsl(44, 34%, 88%)" stroke="hsl(276, 44%, 44%)" stroke-width="1.3" />
          <!-- Floating blindfold ribbon tails -->
          <path d="M45 31 Q32 34 26 42" stroke="hsl(44, 36%, 86%)" stroke-width="3" stroke-linecap="round" fill="none" />
          <path d="M46 35 Q34 40 30 49" stroke="hsl(44, 32%, 78%)" stroke-width="2.2" stroke-linecap="round" fill="none" />
          <!-- Third-eye lotus sigil on blindfold -->
          <path d="M60 28 L64 33 L60 37 L56 33 Z" fill="hsl(292, 92%, 70%)" stroke="hsl(44, 96%, 76%)" stroke-width="1.1" />
          <!-- Martial lotus staff on right -->
          <line x1="94" y1="20" x2="84" y2="102" stroke="url(#wt-staff)" stroke-width="4.2" stroke-linecap="round" />
          <path d="M94 12 Q103 18 99 26 Q94 22 94 12 Z" fill="hsl(292, 86%, 72%)" stroke="hsl(44, 94%, 70%)" stroke-width="1.2" />
          <path d="M94 12 Q85 18 89 26 Q94 22 94 12 Z" fill="hsl(292, 86%, 72%)" stroke="hsl(44, 94%, 70%)" stroke-width="1.2" />
          <circle cx="94" cy="21" r="4.2" fill="hsl(44, 96%, 72%)" />
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

    case 'fungi_beast':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="106" rx="38" ry="6" fill="hsla(0,0%,0%,0.44)" />
          <!-- Beast Body -->
          <path d="M28 96 Q30 62 60 60 Q90 62 92 96 Z" fill="hsl(268, 24%, 28%)" stroke="hsl(274, 34%, 48%)" stroke-width="2" />
          <!-- Mushroom Cap -->
          <path d="M20 62 Q60 18 100 62 Q60 72 20 62 Z" fill="hsl(342, 58%, 40%)" stroke="hsl(346, 72%, 62%)" stroke-width="2.2" />
          <circle cx="44" cy="46" r="5" fill="hsl(44, 88%, 76%)" />
          <circle cx="62" cy="38" r="6" fill="hsl(44, 88%, 76%)" />
          <circle cx="78" cy="49" r="4.5" fill="hsl(44, 88%, 76%)" />
          <!-- Glowing Eyes -->
          <circle cx="48" cy="78" r="4" fill="hsl(42, 95%, 62%)" />
          <circle cx="72" cy="78" r="4" fill="hsl(42, 95%, 62%)" />
        </svg>
      `;

    case 'slaver_blue':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="36" ry="6" fill="hsla(0,0%,0%,0.46)" />
          <!-- Cobalt Cloak & Armor -->
          <path d="M32 42 Q60 30 84 44 L90 104 L28 104 Z" fill="hsl(214, 48%, 28%)" stroke="hsl(208, 62%, 52%)" stroke-width="2" />
          <!-- Hood & Mask -->
          <path d="M42 18 Q60 10 76 20 L78 44 Q60 50 40 44 Z" fill="hsl(216, 42%, 22%)" stroke="hsl(206, 48%, 54%)" stroke-width="1.8" />
          <circle cx="53" cy="32" r="3" fill="hsl(38, 92%, 62%)" />
          <circle cx="66" cy="32" r="3" fill="hsl(38, 92%, 62%)" />
          <!-- Hooked Polearm -->
          <line x1="92" y1="18" x2="84" y2="102" stroke="hsl(32, 26%, 56%)" stroke-width="3" />
          <path d="M92 18 L104 28 L90 36 Q98 44 84 46" fill="none" stroke="hsl(204, 30%, 78%)" stroke-width="2.6" stroke-linecap="round" />
        </svg>
      `;

    case 'looter':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="34" ry="6" fill="hsla(0,0%,0%,0.45)" />
          <!-- Rogue Cloak -->
          <path d="M34 46 Q60 36 86 46 L82 102 L36 102 Z" fill="hsl(28, 24%, 22%)" stroke="hsl(34, 38%, 46%)" stroke-width="2" />
          <!-- Bandana & Hood -->
          <circle cx="60" cy="30" r="14" fill="hsl(26, 20%, 26%)" stroke="hsl(34, 34%, 52%)" stroke-width="1.8" />
          <path d="M46 31 Q60 36 74 31 L71 43 Q60 47 49 43 Z" fill="hsl(8, 56%, 36%)" />
          <circle cx="54" cy="27" r="2.8" fill="hsl(44, 96%, 64%)" />
          <circle cx="66" cy="27" r="2.8" fill="hsl(44, 96%, 64%)" />
          <!-- Twin Daggers -->
          <path d="M22 68 L36 56 L30 74 Z" fill="hsl(206, 26%, 82%)" stroke="hsl(32, 40%, 48%)" stroke-width="1.4" />
          <path d="M98 64 L84 54 L90 72 Z" fill="hsl(206, 26%, 82%)" stroke="hsl(32, 40%, 48%)" stroke-width="1.4" />
        </svg>
      `;

    case 'mad_gremlin':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="106" rx="28" ry="5" fill="hsla(0,0%,0%,0.42)" />
          <!-- Imp Horns -->
          <polygon points="40,42 26,20 48,36" fill="hsl(36, 40%, 76%)" />
          <polygon points="80,42 94,20 72,36" fill="hsl(36, 40%, 76%)" />
          <!-- Imp Body -->
          <path d="M36 52 Q60 34 84 52 L78 100 L42 100 Z" fill="hsl(12, 62%, 38%)" stroke="hsl(20, 74%, 58%)" stroke-width="2" />
          <!-- Angry Eyes & Jagged Mouth -->
          <polygon points="45,56 56,61 46,64" fill="hsl(46, 98%, 62%)" />
          <polygon points="75,56 64,61 74,64" fill="hsl(46, 98%, 62%)" />
          <polyline points="46,76 53,71 60,77 67,71 74,76" fill="none" stroke="hsl(42, 40%, 90%)" stroke-width="2.2" />
        </svg>
      `;

    case 'lagavulin':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="46" ry="7" fill="hsla(0,0%,0%,0.5)" />
          <!-- Spiked Bronze Carapace -->
          <polygon points="36,36 44,18 54,34 64,16 74,34 84,20 88,40" fill="hsl(36, 56%, 58%)" />
          <path d="M18 92 Q22 34 62 32 Q100 34 102 92 Z" fill="hsl(28, 36%, 28%)" stroke="hsl(38, 62%, 60%)" stroke-width="2.5" />
          <!-- Inner Shadow Cavity & Glowing Eyes -->
          <ellipse cx="56" cy="72" rx="22" ry="15" fill="hsl(16, 30%, 10%)" stroke="hsl(34, 42%, 46%)" stroke-width="1.8" />
          <circle cx="48" cy="71" r="4" fill="hsl(8, 92%, 60%)" />
          <circle cx="64" cy="71" r="4" fill="hsl(8, 92%, 60%)" />
          <!-- Heavy Pincer Claws -->
          <path d="M12 88 Q8 70 26 72 L32 96 Z" fill="hsl(12, 56%, 40%)" stroke="hsl(36, 54%, 64%)" stroke-width="1.8" />
          <path d="M108 88 Q112 70 94 72 L88 96 Z" fill="hsl(12, 56%, 40%)" stroke="hsl(36, 54%, 64%)" stroke-width="1.8" />
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

    case 'hexaghost':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="109" rx="38" ry="6" fill="hsla(160,60%,8%,0.55)" />
          <!-- Six Ghost Flames -->
          <path d="M60 8 Q66 16 60 24 Q54 16 60 8 Z" fill="hsl(154, 86%, 62%)" />
          <path d="M96 28 Q102 36 96 44 Q90 36 96 28 Z" fill="hsl(154, 86%, 62%)" />
          <path d="M96 72 Q102 80 96 88 Q90 80 96 72 Z" fill="hsl(154, 86%, 62%)" />
          <path d="M60 92 Q66 100 60 108 Q54 100 60 92 Z" fill="hsl(154, 86%, 62%)" />
          <path d="M24 72 Q30 80 24 88 Q18 80 24 72 Z" fill="hsl(154, 86%, 62%)" />
          <path d="M24 28 Q30 36 24 44 Q18 36 24 28 Z" fill="hsl(154, 86%, 62%)" />
          <!-- Hexagonal Iron Cage & Spectral Core -->
          <polygon points="60,24 90,41 90,75 60,92 30,75 30,41" fill="hsl(168, 36%, 18%)" stroke="hsl(156, 62%, 52%)" stroke-width="2.4" />
          <circle cx="60" cy="58" r="18" fill="hsl(156, 78%, 46%)" opacity="0.88" />
          <circle cx="53" cy="55" r="3.5" fill="hsl(48, 100%, 88%)" />
          <circle cx="67" cy="55" r="3.5" fill="hsl(48, 100%, 88%)" />
        </svg>
      `;

    case 'slime_boss':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="48" ry="8" fill="hsla(0,0%,0%,0.5)" />
          <!-- Colossal Slime Body -->
          <path d="M12 98 Q10 38 60 36 Q110 38 108 98 Q84 106 60 103 Q36 106 12 98 Z" fill="hsl(134, 48%, 30%)" stroke="hsl(128, 66%, 56%)" stroke-width="2.6" />
          <!-- Dapper Bowler Hat -->
          <ellipse cx="60" cy="36" rx="28" ry="6" fill="hsl(24, 18%, 16%)" stroke="hsl(38, 52%, 54%)" stroke-width="1.6" />
          <path d="M40 35 Q42 14 60 14 Q78 14 80 35 Z" fill="hsl(24, 16%, 20%)" stroke="hsl(38, 52%, 54%)" stroke-width="1.6" />
          <!-- Glowing Eyes & Grin -->
          <circle cx="43" cy="66" r="5.5" fill="hsl(46, 98%, 62%)" />
          <circle cx="77" cy="66" r="5.5" fill="hsl(46, 98%, 62%)" />
          <path d="M36 84 Q60 96 84 84" stroke="hsl(124, 72%, 78%)" stroke-width="3" fill="none" stroke-linecap="round" />
        </svg>
      `;

    case 'centurion':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="38" ry="6" fill="hsla(0,0%,0%,0.48)" />
          <!-- Plumed Crest -->
          <path d="M44 20 Q60 4 78 20 L70 28 L50 28 Z" fill="hsl(8, 68%, 44%)" />
          <!-- Plate Armor -->
          <path d="M34 44 Q60 36 84 44 L80 102 L38 102 Z" fill="hsl(214, 18%, 34%)" stroke="hsl(210, 26%, 64%)" stroke-width="2" />
          <rect x="46" y="22" width="28" height="22" rx="5" fill="hsl(212, 20%, 44%)" stroke="hsl(215, 18%, 20%)" stroke-width="1.8" />
          <rect x="51" y="31" width="18" height="4" fill="hsl(38, 92%, 62%)" />
          <!-- Tower Shield & Flail -->
          <rect x="16" y="46" width="24" height="50" rx="5" fill="hsl(28, 38%, 32%)" stroke="hsl(38, 62%, 62%)" stroke-width="2.2" />
          <line x1="92" y1="32" x2="92" y2="86" stroke="hsl(30, 22%, 52%)" stroke-width="3" />
          <circle cx="98" cy="30" r="8" fill="hsl(210, 18%, 52%)" stroke="hsl(210, 28%, 78%)" stroke-width="1.6" />
        </svg>
      `;

    case 'mystic':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="34" ry="6" fill="hsla(0,0%,0%,0.45)" />
          <!-- Mystic Robes -->
          <path d="M36 44 Q60 34 84 44 L90 104 L30 104 Z" fill="hsl(328, 36%, 26%)" stroke="hsl(332, 54%, 56%)" stroke-width="2" />
          <!-- Hood -->
          <path d="M44 18 Q60 8 76 18 L78 44 Q60 48 42 44 Z" fill="hsl(326, 38%, 20%)" stroke="hsl(38, 62%, 62%)" stroke-width="1.8" />
          <circle cx="54" cy="33" r="2.8" fill="hsl(182, 90%, 68%)" />
          <circle cx="66" cy="33" r="2.8" fill="hsl(182, 90%, 68%)" />
          <!-- Orb Staff -->
          <line x1="24" y1="26" x2="28" y2="104" stroke="hsl(34, 38%, 48%)" stroke-width="2.8" />
          <circle cx="24" cy="22" r="7" fill="hsl(152, 76%, 56%)" stroke="hsl(44, 92%, 78%)" stroke-width="1.8" />
        </svg>
      `;

    case 'byrd':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="28" ry="5" fill="hsla(0,0%,0%,0.35)" />
          <!-- Sweeping dark wings -->
          <path d="M56 54 Q26 16 10 38 Q22 50 18 64 Q38 60 56 66 Z" fill="hsl(246, 32%, 28%)" stroke="hsl(274, 52%, 62%)" stroke-width="1.8" />
          <path d="M64 54 Q94 16 110 38 Q98 50 102 64 Q82 60 64 66 Z" fill="hsl(246, 32%, 28%)" stroke="hsl(274, 52%, 62%)" stroke-width="1.8" />
          <!-- Plumage body -->
          <ellipse cx="60" cy="58" rx="18" ry="22" fill="hsl(258, 36%, 22%)" stroke="hsl(38, 62%, 58%)" stroke-width="2" />
          <path d="M50 76 L46 92 M70 76 L74 92" stroke="hsl(36, 72%, 56%)" stroke-width="2.4" stroke-linecap="round" />
          <!-- Razor beak & fiery eye -->
          <polygon points="44,44 26,52 46,54" fill="hsl(38, 86%, 58%)" stroke="hsl(24, 50%, 24%)" stroke-width="1.4" />
          <circle cx="53" cy="46" r="4.2" fill="hsl(8, 92%, 58%)" />
          <circle cx="52" cy="46" r="1.8" fill="hsl(48, 100%, 92%)" />
          <path d="M56 32 L64 20 L66 35 L74 26 L70 39" fill="hsl(278, 56%, 54%)" />
        </svg>
      `;

    case 'spheric_guardian':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="34" ry="5.5" fill="hsla(0,0%,0%,0.42)" />
          <!-- Orbiting barrier ring -->
          <ellipse cx="60" cy="56" rx="46" ry="16" fill="none" stroke="hsl(192, 86%, 64%)" stroke-width="3" opacity="0.82" transform="rotate(-14 60 56)" />
          <!-- Armored floating sphere -->
          <circle cx="60" cy="56" r="30" fill="hsl(214, 26%, 28%)" stroke="hsl(196, 72%, 66%)" stroke-width="2.6" />
          <path d="M36 42 Q60 54 84 42 M34 68 Q60 56 86 68" fill="none" stroke="hsl(42, 74%, 58%)" stroke-width="2.2" />
          <circle cx="60" cy="56" r="12" fill="hsl(206, 48%, 16%)" stroke="hsl(42, 80%, 62%)" stroke-width="2" />
          <circle cx="60" cy="56" r="6" fill="hsl(188, 96%, 68%)" />
          <circle cx="60" cy="56" r="2.5" fill="hsl(190, 100%, 95%)" />
        </svg>
      `;

    case 'snake_plant':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="40" ry="6.5" fill="hsla(0,0%,0%,0.48)" />
          <!-- Coiled thorny vines -->
          <path d="M58 104 Q30 92 34 66 Q38 44 62 44 Q86 44 86 70 Q86 94 58 104 Z" fill="hsl(134, 42%, 24%)" stroke="hsl(118, 56%, 48%)" stroke-width="2.4" />
          <path d="M22 86 Q34 70 46 82 M98 84 Q86 68 74 82" fill="none" stroke="hsl(126, 52%, 44%)" stroke-width="4" stroke-linecap="round" />
          <!-- Carnivorous serpent blossom head -->
          <path d="M28 46 Q46 14 78 24 Q96 34 90 58 Q68 68 42 58 Z" fill="hsl(312, 46%, 30%)" stroke="hsl(122, 64%, 54%)" stroke-width="2.2" />
          <!-- Fangs & glowing eyes -->
          <path d="M30 48 Q52 40 72 52 Q52 66 30 56 Z" fill="hsl(348, 62%, 20%)" />
          <polygon points="36,47 41,56 46,46" fill="hsl(44, 52%, 90%)" />
          <polygon points="50,45 55,55 60,47" fill="hsl(44, 52%, 90%)" />
          <polygon points="42,60 47,52 52,61" fill="hsl(44, 52%, 90%)" />
          <circle cx="56" cy="33" r="3.8" fill="hsl(52, 98%, 62%)" />
          <circle cx="72" cy="36" r="3.4" fill="hsl(52, 98%, 62%)" />
        </svg>
      `;

    case 'gremlin_leader':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="40" ry="6.5" fill="hsla(0,0%,0%,0.5)" />
          <!-- War Banner & Cape -->
          <line x1="22" y1="16" x2="26" y2="104" stroke="hsl(32, 46%, 44%)" stroke-width="3" />
          <polygon points="24,18 52,24 26,42" fill="hsl(6, 72%, 42%)" stroke="hsl(42, 86%, 62%)" stroke-width="1.6" />
          <path d="M34 48 Q60 36 86 48 L92 104 L30 104 Z" fill="hsl(14, 56%, 28%)" stroke="hsl(42, 74%, 58%)" stroke-width="2.2" />
          <!-- Horned Gremlin Commander Head -->
          <path d="M40 34 L22 24 L38 44 Z" fill="hsl(14, 54%, 44%)" />
          <path d="M80 34 L98 24 L82 44 Z" fill="hsl(14, 54%, 44%)" />
          <circle cx="60" cy="38" r="16" fill="hsl(14, 54%, 42%)" stroke="hsl(42, 72%, 58%)" stroke-width="2" />
          <polygon points="48,24 54,12 60,22 66,12 72,24" fill="hsl(42, 88%, 58%)" />
          <circle cx="53" cy="37" r="3.2" fill="hsl(48, 98%, 64%)" />
          <circle cx="67" cy="37" r="3.2" fill="hsl(48, 98%, 64%)" />
          <!-- Jagged Halberd -->
          <line x1="94" y1="22" x2="90" y2="102" stroke="hsl(30, 34%, 36%)" stroke-width="3.2" />
          <path d="M94 22 L110 34 L92 48 Z" fill="hsl(208, 22%, 78%)" stroke="hsl(42, 70%, 56%)" stroke-width="1.6" />
        </svg>
      `;

    case 'book_of_stabbing':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="34" ry="5" fill="hsla(0,0%,0%,0.45)" />
          <!-- Thrusting Daggers -->
          <polygon points="14,38 42,46 38,54" fill="hsl(206, 30%, 84%)" stroke="hsl(210, 20%, 38%)" stroke-width="1.4" />
          <polygon points="10,60 40,60 38,68" fill="hsl(206, 30%, 84%)" stroke="hsl(210, 20%, 38%)" stroke-width="1.4" />
          <polygon points="16,82 42,72 40,80" fill="hsl(206, 30%, 84%)" stroke="hsl(210, 20%, 38%)" stroke-width="1.4" />
          <!-- Levitating Crimson Grimoire -->
          <polygon points="38,24 88,18 96,86 46,94" fill="hsl(352, 62%, 32%)" stroke="hsl(38, 72%, 62%)" stroke-width="2.4" />
          <polygon points="44,28 84,23 90,81 50,88" fill="hsl(38, 36%, 82%)" opacity="0.2" />
          <circle cx="68" cy="54" r="9" fill="hsl(42, 94%, 58%)" stroke="hsl(10, 70%, 28%)" stroke-width="2" />
          <ellipse cx="68" cy="54" rx="2.5" ry="6" fill="hsl(10, 70%, 16%)" />
        </svg>
      `;

    case 'slaver_taskmaster':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="38" ry="6" fill="hsla(0,0%,0%,0.48)" />
          <path d="M30 42 Q60 28 88 42 L92 104 L28 104 Z" fill="hsl(8, 52%, 28%)" stroke="hsl(36, 56%, 56%)" stroke-width="2" />
          <path d="M42 18 Q60 10 78 18 L80 42 Q60 48 40 42 Z" fill="hsl(22, 18%, 22%)" stroke="hsl(36, 52%, 58%)" stroke-width="2" />
          <circle cx="54" cy="31" r="3.2" fill="hsl(8, 92%, 62%)" />
          <circle cx="66" cy="31" r="3.2" fill="hsl(8, 92%, 62%)" />
          <!-- Barbed Whip -->
          <path d="M88 54 Q112 34 102 68 Q92 94 112 92" fill="none" stroke="hsl(24, 58%, 54%)" stroke-width="3" stroke-linecap="round" />
        </svg>
      `;

    case 'bronze_automaton':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="110" rx="46" ry="7" fill="hsla(0,0%,0%,0.54)" />
          <!-- Floating Bronze Orbs -->
          <circle cx="20" cy="30" r="9" fill="hsl(38, 66%, 52%)" stroke="hsl(188, 82%, 66%)" stroke-width="2" />
          <circle cx="100" cy="30" r="9" fill="hsl(38, 66%, 52%)" stroke="hsl(188, 82%, 66%)" stroke-width="2" />
          <!-- Towering Golden Chassis -->
          <polygon points="32,30 60,14 88,30 84,102 36,102" fill="hsl(36, 48%, 36%)" stroke="hsl(43, 82%, 66%)" stroke-width="2.5" />
          <rect x="46" y="20" width="28" height="16" rx="4" fill="hsl(34, 34%, 24%)" stroke="hsl(43, 76%, 64%)" stroke-width="1.8" />
          <rect x="50" y="26" width="20" height="4" fill="hsl(186, 92%, 66%)" />
          <!-- Hyperbeam Core -->
          <circle cx="60" cy="58" r="13" fill="hsl(38, 96%, 62%)" stroke="hsl(24, 42%, 22%)" stroke-width="2.2" />
          <circle cx="60" cy="58" r="6" fill="hsl(48, 100%, 90%)" />
        </svg>
      `;

    case 'the_collector':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="110" rx="46" ry="7" fill="hsla(0,0%,0%,0.54)" />
          <!-- Throne Backrest & Emerald Soul Flames -->
          <polygon points="24,22 36,18 40,98 22,98" fill="hsl(268, 22%, 20%)" stroke="hsl(40, 56%, 52%)" stroke-width="1.6" />
          <polygon points="96,22 84,18 80,98 98,98" fill="hsl(268, 22%, 20%)" stroke="hsl(40, 56%, 52%)" stroke-width="1.6" />
          <path d="M29 8 Q35 15 29 22 Q23 15 29 8 Z" fill="hsl(152, 88%, 58%)" />
          <path d="M91 8 Q97 15 91 22 Q85 15 91 8 Z" fill="hsl(152, 88%, 58%)" />
          <!-- Collector Cloak & Crown -->
          <path d="M34 46 Q60 36 86 46 L92 104 L28 104 Z" fill="hsl(274, 38%, 22%)" stroke="hsl(154, 60%, 52%)" stroke-width="2" />
          <polygon points="46,28 52,14 60,24 68,14 74,28" fill="hsl(42, 86%, 60%)" />
          <circle cx="60" cy="35" r="11" fill="hsl(270, 28%, 14%)" stroke="hsl(42, 70%, 58%)" stroke-width="1.8" />
          <circle cx="55" cy="35" r="2.8" fill="hsl(152, 95%, 64%)" />
          <circle cx="65" cy="35" r="2.8" fill="hsl(152, 95%, 64%)" />
        </svg>
      `;

    case 'the_champ':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <!-- Crimson Arena Cape -->
          <path d="M24 52 Q60 40 96 52 L106 112 L14 112 Z" fill="hsl(354, 58%, 26%)" stroke="hsl(42, 74%, 56%)" stroke-width="2" />
          <!-- Heavy Steel Torso & Pauldrons -->
          <path d="M20 56 Q34 42 48 54 L46 74 L22 72 Z" fill="hsl(212, 16%, 38%)" stroke="hsl(42, 70%, 58%)" stroke-width="2" />
          <path d="M100 56 Q86 42 72 54 L74 74 L98 72 Z" fill="hsl(212, 16%, 38%)" stroke="hsl(42, 70%, 58%)" stroke-width="2" />
          <rect x="38" y="48" width="44" height="54" rx="8" fill="hsl(212, 14%, 30%)" stroke="hsl(212, 22%, 62%)" stroke-width="2.2" />
          <!-- Champion Golden Belt -->
          <rect x="36" y="78" width="48" height="12" rx="3" fill="hsl(42, 82%, 48%)" stroke="hsl(42, 95%, 72%)" stroke-width="1.8" />
          <circle cx="60" cy="84" r="5" fill="hsl(4, 78%, 52%)" stroke="hsl(44, 96%, 78%)" stroke-width="1.5" />
          <!-- Crowned Gladiator Helmet -->
          <polygon points="44,24 50,10 60,20 70,10 76,24" fill="hsl(42, 88%, 56%)" stroke="hsl(44, 96%, 76%)" stroke-width="1.5" />
          <rect x="44" y="24" width="32" height="24" rx="7" fill="hsl(212, 16%, 40%)" stroke="hsl(42, 74%, 58%)" stroke-width="2" />
          <line x1="50" y1="35" x2="70" y2="35" stroke="hsl(220, 30%, 10%)" stroke-width="4" />
          <circle cx="55" cy="35" r="2.2" fill="hsl(8, 95%, 60%)" />
          <circle cx="65" cy="35" r="2.2" fill="hsl(8, 95%, 60%)" />
          <!-- Giant Greatsword -->
          <polygon points="94,16 102,16 104,76 92,76" fill="hsl(210, 22%, 72%)" stroke="hsl(215, 25%, 30%)" stroke-width="2" />
          <rect x="86" y="74" width="24" height="6" rx="2" fill="hsl(42, 82%, 52%)" />
          <rect x="95" y="80" width="6" height="16" rx="2" fill="hsl(24, 38%, 28%)" />
        </svg>
      `;

    case 'orb_walker':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="110" rx="34" ry="6" fill="hsla(0,0%,0%,0.5)" />
          <path d="M40 74 L26 106 L34 106 L48 76 Z" fill="hsl(28, 32%, 28%)" stroke="hsl(38, 60%, 54%)" stroke-width="1.8" />
          <path d="M80 74 L94 106 L86 106 L72 76 Z" fill="hsl(28, 32%, 28%)" stroke="hsl(38, 60%, 54%)" stroke-width="1.8" />
          <circle cx="60" cy="52" r="28" fill="hsl(220, 18%, 22%)" stroke="hsl(38, 68%, 58%)" stroke-width="2.4" />
          <circle cx="60" cy="52" r="20" fill="hsl(220, 22%, 14%)" stroke="hsl(28, 48%, 42%)" stroke-width="1.4" />
          <circle cx="60" cy="52" r="10" fill="hsl(12, 92%, 56%)" />
          <circle cx="60" cy="52" r="4" fill="hsl(44, 100%, 84%)" />
          <path d="M36 32 L24 22 M84 32 L96 22" stroke="hsl(38, 72%, 56%)" stroke-width="3" stroke-linecap="round" />
        </svg>
      `;

    case 'spiker':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="36" ry="6" fill="hsla(0,0%,0%,0.48)" />
          <polygon points="60,8 68,30 96,18 82,42 110,56 84,68 98,94 72,82 60,104 48,82 22,94 36,68 10,56 38,42 24,18 52,30" fill="hsl(206, 48%, 34%)" stroke="hsl(194, 82%, 68%)" stroke-width="2" />
          <polygon points="60,26 84,56 60,86 36,56" fill="hsl(210, 56%, 22%)" stroke="hsl(196, 86%, 72%)" stroke-width="1.8" />
          <circle cx="60" cy="56" r="8" fill="hsl(192, 96%, 68%)" />
          <circle cx="60" cy="56" r="3" fill="hsl(0, 0%, 100%)" />
        </svg>
      `;

    case 'exploder':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="36" ry="6" fill="hsla(0,0%,0%,0.52)" />
          <path d="M58 14 Q68 6 76 16" fill="none" stroke="hsl(32, 92%, 62%)" stroke-width="3" stroke-linecap="round" />
          <circle cx="78" cy="16" r="5" fill="hsl(38, 100%, 66%)" />
          <polygon points="44,24 76,24 96,46 96,76 76,96 44,96 24,76 24,46" fill="hsl(8, 54%, 24%)" stroke="hsl(14, 82%, 58%)" stroke-width="2.4" />
          <circle cx="60" cy="60" r="18" fill="hsl(14, 90%, 46%)" stroke="hsl(40, 96%, 68%)" stroke-width="2" />
          <circle cx="60" cy="60" r="8" fill="hsl(44, 100%, 82%)" />
          <path d="M36 44 L44 50 M84 44 L76 50 M36 76 L44 70 M84 76 L76 70" stroke="hsl(38, 86%, 64%)" stroke-width="2.2" />
        </svg>
      `;

    case 'repulsor':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="34" ry="5" fill="hsla(0,0%,0%,0.45)" />
          <ellipse cx="60" cy="56" rx="44" ry="14" fill="none" stroke="hsl(268, 76%, 64%)" stroke-width="2" stroke-dasharray="6 4" transform="rotate(-18 60 56)" />
          <ellipse cx="60" cy="56" rx="44" ry="14" fill="none" stroke="hsl(44, 82%, 62%)" stroke-width="1.8" transform="rotate(18 60 56)" />
          <polygon points="60,18 86,56 60,94 34,56" fill="hsl(262, 42%, 28%)" stroke="hsl(44, 86%, 64%)" stroke-width="2.4" />
          <circle cx="60" cy="56" r="9" fill="hsl(278, 92%, 72%)" />
        </svg>
      `;

    case 'maw':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="110" rx="44" ry="7" fill="hsla(0,0%,0%,0.54)" />
          <path d="M22 40 Q12 18 32 16 Q42 26 44 38 Z" fill="hsl(38, 44%, 72%)" stroke="hsl(28, 30%, 30%)" stroke-width="1.8" />
          <path d="M98 40 Q108 18 88 16 Q78 26 76 38 Z" fill="hsl(38, 44%, 72%)" stroke="hsl(28, 30%, 30%)" stroke-width="1.8" />
          <path d="M22 48 Q60 22 98 48 L94 102 Q60 112 26 102 Z" fill="hsl(268, 28%, 24%)" stroke="hsl(276, 48%, 52%)" stroke-width="2.2" />
          <circle cx="44" cy="48" r="4.5" fill="hsl(288, 92%, 70%)" />
          <circle cx="76" cy="48" r="4.5" fill="hsl(288, 92%, 70%)" />
          <ellipse cx="60" cy="78" rx="26" ry="18" fill="hsl(348, 58%, 16%)" stroke="hsl(278, 36%, 44%)" stroke-width="2" />
          <polygon points="40,66 46,78 52,64" fill="hsl(42, 48%, 88%)" />
          <polygon points="56,62 60,76 64,62" fill="hsl(42, 48%, 88%)" />
          <polygon points="68,64 74,78 80,66" fill="hsl(42, 48%, 88%)" />
          <polygon points="44,92 50,80 56,94" fill="hsl(42, 48%, 88%)" />
          <polygon points="64,94 70,80 76,92" fill="hsl(42, 48%, 88%)" />
        </svg>
      `;

    case 'giant_head':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="112" rx="46" ry="6" fill="hsla(0,0%,0%,0.56)" />
          <path d="M26 22 Q60 8 94 22 L98 98 Q60 112 22 98 Z" fill="hsl(214, 12%, 34%)" stroke="hsl(214, 18%, 58%)" stroke-width="2.6" />
          <rect x="34" y="34" width="52" height="10" rx="3" fill="hsl(214, 12%, 24%)" />
          <ellipse cx="46" cy="48" rx="7" ry="4" fill="hsl(188, 86%, 64%)" />
          <ellipse cx="74" cy="48" rx="7" ry="4" fill="hsl(188, 86%, 64%)" />
          <polygon points="55,50 65,50 68,72 52,72" fill="hsl(214, 12%, 26%)" stroke="hsl(214, 16%, 46%)" stroke-width="1.6" />
          <rect x="42" y="82" width="36" height="6" rx="2" fill="hsl(214, 14%, 18%)" />
          <path d="M30 62 L40 66 L34 74 M88 28 L78 36" fill="none" stroke="hsl(192, 74%, 56%)" stroke-width="1.6" />
        </svg>
      `;

    case 'nemesis':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="110" rx="38" ry="6" fill="hsla(0,0%,0%,0.52)" />
          <path d="M96 18 Q54 6 24 44" fill="none" stroke="hsl(352, 86%, 62%)" stroke-width="5" stroke-linecap="round" />
          <line x1="88" y1="20" x2="36" y2="106" stroke="hsl(240, 14%, 44%)" stroke-width="3.5" />
          <path d="M36 42 Q60 22 84 42 L94 104 Q60 94 26 104 Z" fill="hsl(252, 34%, 20%)" stroke="hsl(276, 62%, 58%)" stroke-width="2" />
          <circle cx="60" cy="34" r="14" fill="hsl(40, 24%, 82%)" stroke="hsl(268, 30%, 28%)" stroke-width="2" />
          <circle cx="55" cy="34" r="3" fill="hsl(352, 92%, 58%)" />
          <circle cx="65" cy="34" r="3" fill="hsl(352, 92%, 58%)" />
        </svg>
      `;

    case 'reptomancer':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="110" rx="40" ry="6" fill="hsla(0,0%,0%,0.5)" />
          <polygon points="18,30 24,18 30,30 24,52" fill="hsl(286, 72%, 58%)" />
          <polygon points="102,30 96,18 90,30 96,52" fill="hsl(286, 72%, 58%)" />
          <path d="M34 42 Q60 28 86 42 L92 104 L28 104 Z" fill="hsl(162, 42%, 22%)" stroke="hsl(148, 70%, 52%)" stroke-width="2" />
          <circle cx="60" cy="32" r="13" fill="hsl(152, 38%, 32%)" stroke="hsl(44, 78%, 58%)" stroke-width="2" />
          <circle cx="55" cy="31" r="2.6" fill="hsl(48, 96%, 64%)" />
          <circle cx="65" cy="31" r="2.6" fill="hsl(48, 96%, 64%)" />
          <path d="M22 24 L22 104" stroke="hsl(36, 56%, 48%)" stroke-width="3" />
          <circle cx="22" cy="22" r="5" fill="hsl(146, 92%, 58%)" />
        </svg>
      `;

    case 'dagger':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="22" ry="5" fill="hsla(0,0%,0%,0.46)" />
          <polygon points="60,12 72,56 60,72 48,56" fill="hsl(214, 24%, 76%)" stroke="hsl(292, 86%, 66%)" stroke-width="2.4" />
          <rect x="42" y="70" width="36" height="7" rx="2" fill="hsl(290, 62%, 44%)" stroke="hsl(44, 86%, 64%)" stroke-width="1.6" />
          <rect x="56" y="77" width="8" height="18" rx="2" fill="hsl(268, 36%, 24%)" />
          <circle cx="60" cy="48" r="4" fill="hsl(312, 92%, 68%)" />
        </svg>
      `;

    case 'time_eater':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="110" rx="46" ry="7" fill="hsla(0,0%,0%,0.54)" />
          <circle cx="76" cy="54" r="30" fill="hsl(268, 36%, 24%)" stroke="hsl(188, 72%, 58%)" stroke-width="2.6" />
          <circle cx="76" cy="54" r="20" fill="hsl(232, 34%, 14%)" stroke="hsl(44, 82%, 60%)" stroke-width="2" />
          <line x1="76" y1="54" x2="76" y2="38" stroke="hsl(44, 96%, 72%)" stroke-width="2.6" stroke-linecap="round" />
          <line x1="76" y1="54" x2="88" y2="58" stroke="hsl(188, 92%, 68%)" stroke-width="2.4" stroke-linecap="round" />
          <path d="M22 48 Q46 32 66 50 L68 104 L20 104 Z" fill="hsl(184, 42%, 24%)" stroke="hsl(180, 74%, 56%)" stroke-width="2.2" />
          <circle cx="44" cy="36" r="14" fill="hsl(178, 32%, 28%)" stroke="hsl(184, 72%, 58%)" stroke-width="2" />
          <circle cx="38" cy="35" r="2.8" fill="hsl(176, 98%, 72%)" />
          <circle cx="48" cy="35" r="2.8" fill="hsl(176, 98%, 72%)" />
        </svg>
      `;

    case 'awakened_one':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="110" rx="48" ry="7" fill="hsla(0,0%,0%,0.56)" />
          <path d="M8 46 Q32 22 52 54 L20 84 Z" fill="hsl(220, 22%, 18%)" stroke="hsl(186, 68%, 52%)" stroke-width="2" />
          <path d="M112 46 Q88 22 68 54 L100 84 Z" fill="hsl(220, 22%, 18%)" stroke="hsl(186, 68%, 52%)" stroke-width="2" />
          <path d="M40 44 Q60 30 80 44 L86 104 L34 104 Z" fill="hsl(224, 24%, 14%)" stroke="hsl(188, 74%, 58%)" stroke-width="2.2" />
          <polygon points="44,24 52,10 60,22 68,10 76,24" fill="hsl(186, 86%, 56%)" />
          <circle cx="60" cy="34" r="14" fill="hsl(40, 18%, 78%)" stroke="hsl(188, 72%, 52%)" stroke-width="2" />
          <polygon points="56,36 64,36 60,46" fill="hsl(220, 18%, 16%)" />
          <circle cx="53" cy="31" r="2.8" fill="hsl(182, 98%, 68%)" />
          <circle cx="67" cy="31" r="2.8" fill="hsl(182, 98%, 68%)" />
          <circle cx="60" cy="24" r="2.5" fill="hsl(8, 94%, 60%)" />
        </svg>
      `;

    case 'donu':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="40" ry="6" fill="hsla(0,0%,0%,0.5)" />
          <circle cx="60" cy="56" r="38" fill="hsl(38, 64%, 44%)" stroke="hsl(44, 90%, 68%)" stroke-width="3" />
          <circle cx="60" cy="56" r="15" fill="hsl(222, 24%, 12%)" stroke="hsl(44, 88%, 68%)" stroke-width="2.6" />
          <circle cx="60" cy="56" r="7" fill="hsl(186, 94%, 66%)" />
          <path d="M60 22 L60 32 M60 80 L60 90 M26 56 L36 56 M84 56 L94 56" stroke="hsl(44, 92%, 74%)" stroke-width="2.6" stroke-linecap="round" />
        </svg>
      `;

    case 'deca':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <ellipse cx="60" cy="108" rx="40" ry="6" fill="hsla(0,0%,0%,0.5)" />
          <polygon points="60,14 102,56 60,98 18,56" fill="hsl(224, 34%, 28%)" stroke="hsl(42, 78%, 60%)" stroke-width="3" />
          <rect x="42" y="38" width="36" height="36" rx="4" fill="hsl(222, 38%, 18%)" stroke="hsl(192, 82%, 62%)" stroke-width="2.2" />
          <circle cx="60" cy="56" r="9" fill="hsl(192, 94%, 66%)" />
          <circle cx="60" cy="56" r="4" fill="hsl(0, 0%, 100%)" />
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
