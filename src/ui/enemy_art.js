/**
 * Hero-tier hand-crafted inline SVG illustrations for all 61 Spire enemies
 * (Act 1, Act 2, and Act 3 normal enemies, elites, and bosses).
 * Every enemy uses globally unique gradient IDs (`ea-<key>-*`) so multiple enemies
 * in the same combat DOM never collide.
 */

export function getEnemySvg(artKey, mode = 'normal') {
  switch (artKey) {
    // =========================================================================
    // ACT 1 NORMAL ENEMIES
    // =========================================================================
    case 'cultist':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-cult-aura" cx="56%" cy="52%" r="48%">
              <stop offset="0%" stop-color="hsla(192, 86%, 54%, 0.24)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-cult-robe" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stop-color="hsl(210, 54%, 42%)" />
              <stop offset="55%" stop-color="hsl(220, 50%, 24%)" />
              <stop offset="100%" stop-color="hsl(228, 54%, 11%)" />
            </linearGradient>
            <linearGradient id="ea-cult-plume" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stop-color="hsl(184, 84%, 72%)" />
              <stop offset="55%" stop-color="hsl(198, 66%, 44%)" />
              <stop offset="100%" stop-color="hsl(212, 58%, 20%)" />
            </linearGradient>
            <linearGradient id="ea-cult-beak" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(44, 52%, 94%)" />
              <stop offset="60%" stop-color="hsl(36, 32%, 72%)" />
              <stop offset="100%" stop-color="hsl(28, 26%, 44%)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="58" r="50" fill="url(#ea-cult-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="109" rx="38" ry="6.5" fill="hsla(0,0%,0%,0.54)" />
          <g class="svg-breathe">
            <!-- Flowing ritual robe with folded shadows & hem runes -->
            <path d="M35 44 Q60 33 85 44 L97 105 Q84 99 72 105 Q60 100 48 105 Q36 99 23 105 Z" fill="url(#ea-cult-robe)" stroke="hsl(196, 62%, 58%)" stroke-width="1.8" />
            <path d="M39 58 Q35 80 31 101 M81 58 Q85 80 89 101" stroke="hsla(0,0%,0%,0.36)" stroke-width="2.2" fill="none" />
            <path d="M40 46 Q60 38 80 46" stroke="hsla(192, 92%, 82%, 0.42)" stroke-width="1.5" fill="none" />
            <!-- Embroidered gilded ritual stole -->
            <path d="M50 45 L45 99 L55 96 L58 46 Z" fill="hsl(42, 78%, 56%)" stroke="hsl(30, 56%, 28%)" stroke-width="0.9" />
            <path d="M70 45 L75 99 L65 96 L62 46 Z" fill="hsl(42, 78%, 56%)" stroke="hsl(30, 56%, 28%)" stroke-width="0.9" />
            <path d="M51 60 L54 64 L51 68 M69 60 L66 64 L69 68 M50 78 L53 82 L50 86 M70 78 L67 82 L70 86" stroke="hsl(220, 54%, 18%)" stroke-width="1.4" fill="none" />
            <!-- Layered crow-plume crest -->
            <path d="M42 28 L30 9 L50 18 L59 4 L67 18 L86 8 L76 28 Z" fill="url(#ea-cult-plume)" stroke="hsl(188, 86%, 78%)" stroke-width="1.3" />
            <path d="M48 22 L40 13 M59 20 L59 8 M70 22 L78 13" stroke="hsla(186, 100%, 92%, 0.45)" stroke-width="1.2" />
            <!-- Deep feathered cowl & hooked raven skull mask -->
            <path d="M41 24 Q60 13 79 26 L76 47 Q60 54 43 46 Z" fill="hsl(222, 48%, 16%)" stroke="hsl(198, 56%, 50%)" stroke-width="1.5" />
            <path d="M44 25 Q61 17 75 28 L69 46 L27 42 Q36 33 44 25 Z" fill="url(#ea-cult-beak)" stroke="hsl(28, 26%, 24%)" stroke-width="1.6" />
            <path d="M27 42 Q44 38 66 42" stroke="hsl(28, 28%, 28%)" stroke-width="1.4" fill="none" />
            <path d="M45 27 Q58 21 71 29" stroke="hsla(48, 80%, 96%, 0.65)" stroke-width="1.3" fill="none" />
            <!-- Blazing amber ritual eye -->
            <circle cx="55" cy="31" r="5.2" fill="hsla(38, 100%, 60%, 0.36)" class="svg-pulse" />
            <circle cx="55" cy="31" r="2.8" fill="hsl(44, 100%, 68%)" />
            <circle cx="54.2" cy="30.4" r="1" fill="hsl(0, 0%, 100%)" />
          </g>
          <!-- Curved sacrificial ritual kris & cyan sigil motes -->
          <path d="M21 65 Q7 43 26 25 Q22 43 34 59 Z" fill="url(#ea-cult-beak)" stroke="hsl(42, 86%, 62%)" stroke-width="1.4" />
          <path d="M16 48 Q19 36 25 28" stroke="hsl(188, 96%, 72%)" stroke-width="1.5" fill="none" />
          <rect x="22" y="60" width="13" height="4.5" rx="1.6" transform="rotate(-24 28 62)" fill="hsl(42, 82%, 56%)" stroke="hsl(28, 48%, 24%)" stroke-width="1" />
          <circle cx="17" cy="34" r="2.2" fill="hsl(188, 96%, 72%)" class="svg-float" />
          <circle cx="96" cy="40" r="1.9" fill="hsl(192, 92%, 70%)" opacity="0.75" class="svg-float" />
        </svg>
      `;

    case 'jaw_worm':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-jw-aura" cx="55%" cy="66%" r="48%">
              <stop offset="0%" stop-color="hsla(204, 62%, 44%, 0.22)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-jw-body" x1="0.1" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stop-color="hsl(200, 38%, 50%)" />
              <stop offset="52%" stop-color="hsl(208, 36%, 32%)" />
              <stop offset="100%" stop-color="hsl(218, 38%, 16%)" />
            </linearGradient>
            <linearGradient id="ea-jw-plate" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stop-color="hsl(42, 48%, 88%)" />
              <stop offset="60%" stop-color="hsl(34, 34%, 60%)" />
              <stop offset="100%" stop-color="hsl(26, 28%, 34%)" />
            </linearGradient>
            <radialGradient id="ea-jw-maw" cx="38%" cy="50%" r="62%">
              <stop offset="0%" stop-color="hsl(6, 82%, 48%)" />
              <stop offset="65%" stop-color="hsl(354, 72%, 26%)" />
              <stop offset="100%" stop-color="hsl(346, 68%, 12%)" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="68" r="48" fill="url(#ea-jw-aura)" />
          <ellipse cx="60" cy="106" rx="46" ry="7.5" fill="hsla(0,0%,0%,0.52)" />
          <g class="svg-breathe">
            <!-- Jagged dorsal bone-plate crest -->
            <polygon points="37,48 48,22 59,43" fill="url(#ea-jw-plate)" stroke="hsl(26, 28%, 22%)" stroke-width="1.5" />
            <polygon points="55,42 69,19 78,43" fill="url(#ea-jw-plate)" stroke="hsl(26, 28%, 22%)" stroke-width="1.5" />
            <polygon points="73,44 89,27 93,53" fill="url(#ea-jw-plate)" stroke="hsl(26, 28%, 22%)" stroke-width="1.5" />
            <path d="M48 25 L52 40 M69 22 L72 39 M87 30 L88 46" stroke="hsla(46, 80%, 96%, 0.55)" stroke-width="1.2" />
            <!-- Armored segmented worm body -->
            <path d="M20 86 Q18 44 58 38 Q98 34 102 76 Q104 99 76 102 L30 102 Q20 99 20 86 Z" fill="url(#ea-jw-body)" stroke="hsl(38, 38%, 66%)" stroke-width="2" />
            <!-- Rim highlight & armored segments -->
            <path d="M32 48 Q62 39 90 50" stroke="hsla(198, 72%, 82%, 0.42)" stroke-width="2" fill="none" stroke-linecap="round" />
            <path d="M67 43 Q75 72 67 99 M83 47 Q90 73 82 98" stroke="hsla(214, 48%, 10%, 0.55)" stroke-width="2.8" fill="none" />
            <path d="M70 46 Q77 72 70 97 M86 50 Q92 73 85 96" stroke="hsla(40, 44%, 76%, 0.3)" stroke-width="1.2" fill="none" />
            <!-- Underbelly chitin ridge -->
            <path d="M32 97 Q60 93 92 96" stroke="hsl(36, 36%, 56%)" stroke-width="2.2" fill="none" opacity="0.7" />
            <!-- Gaping crimson maw with curved interlocking fangs -->
            <path d="M20 67 Q47 54 68 72 Q47 95 21 87 Z" fill="url(#ea-jw-maw)" stroke="hsl(352, 56%, 22%)" stroke-width="1.9" />
            <polygon points="25,67 31,80 36,65" fill="hsl(44, 52%, 94%)" stroke="hsl(28, 24%, 36%)" stroke-width="0.7" />
            <polygon points="38,63 44,78 49,64" fill="hsl(44, 52%, 94%)" stroke="hsl(28, 24%, 36%)" stroke-width="0.7" />
            <polygon points="51,65 56,77 61,68" fill="hsl(44, 52%, 94%)" stroke="hsl(28, 24%, 36%)" stroke-width="0.7" />
            <polygon points="28,87 34,76 39,89" fill="hsl(44, 52%, 94%)" stroke="hsl(28, 24%, 36%)" stroke-width="0.7" />
            <polygon points="42,89 48,77 54,88" fill="hsl(44, 52%, 94%)" stroke="hsl(28, 24%, 36%)" stroke-width="0.7" />
            <!-- Fierce slit eye & brow ridge -->
            <path d="M44 47 L58 50" stroke="hsl(214, 46%, 14%)" stroke-width="2.6" stroke-linecap="round" />
            <circle cx="51" cy="53" r="6.6" fill="hsla(38, 100%, 58%, 0.32)" class="svg-pulse" />
            <circle cx="51" cy="53" r="4" fill="hsl(44, 100%, 66%)" />
            <ellipse cx="50" cy="53" rx="1.3" ry="3.1" fill="hsl(10, 82%, 20%)" />
            <circle cx="52.4" cy="51.6" r="1" fill="hsl(0, 0%, 100%)" />
          </g>
        </svg>
      `;

    case 'red_louse':
    case 'green_louse': {
      const isRed = artKey === 'red_louse';
      const id = isRed ? 'rl' : 'gl';
      const topC = isRed ? 'hsl(12, 78%, 58%)' : 'hsl(148, 60%, 52%)';
      const midC = isRed ? 'hsl(7, 68%, 40%)' : 'hsl(154, 56%, 34%)';
      const botC = isRed ? 'hsl(2, 64%, 20%)' : 'hsl(162, 58%, 16%)';
      const rimC = isRed ? 'hsl(30, 90%, 72%)' : 'hsl(142, 78%, 70%)';
      const spotC = isRed ? 'hsl(34, 96%, 74%)' : 'hsl(118, 86%, 70%)';
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-${id}-shell" x1="0.1" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stop-color="${topC}" />
              <stop offset="55%" stop-color="${midC}" />
              <stop offset="100%" stop-color="${botC}" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="105" rx="40" ry="6.5" fill="hsla(0,0%,0%,0.5)" />
          <!-- Articulated legs -->
          <path d="M34 92 L29 103 M46 95 L44 104 M60 95 L60 105 M74 95 L76 104 M86 92 L91 103" stroke="${rimC}" stroke-width="2.8" stroke-linecap="round" />
          <g class="svg-breathe">
            <!-- Segmented pill-bug carapace -->
            <path d="M20 93 Q22 44 61 44 Q100 44 100 93 Q60 100 20 93 Z" fill="url(#ea-${id}-shell)" stroke="${rimC}" stroke-width="2.2" />
            <!-- Iridescent specular gloss -->
            <path d="M35 55 Q60 46 85 55" stroke="hsla(0,0%,100%,0.38)" stroke-width="3.2" stroke-linecap="round" fill="none" />
            <!-- Layered carapace segments with depth bevels -->
            <path d="M43 48 Q47 72 44 96 M61 45 Q65 72 61 97 M79 49 Q81 72 78 95" stroke="hsla(0,0%,0%,0.42)" stroke-width="2.6" fill="none" />
            <path d="M45 50 Q49 72 46 94 M63 47 Q67 72 63 95 M81 51 Q83 72 80 93" stroke="hsla(0,0%,100%,0.22)" stroke-width="1.2" fill="none" />
            <!-- Antennae & glowing bug eye -->
            <path d="M25 74 Q14 63 11 52 M30 68 Q22 55 23 45" stroke="${rimC}" stroke-width="2.2" stroke-linecap="round" fill="none" />
            <circle cx="11" cy="52" r="2.6" fill="${spotC}" />
            <circle cx="23" cy="45" r="2.6" fill="${spotC}" />
            <circle cx="33" cy="77" r="5.6" fill="hsla(44, 100%, 64%, 0.34)" />
            <circle cx="33" cy="77" r="3.4" fill="hsl(48, 100%, 70%)" />
            <circle cx="32" cy="77" r="1.4" fill="hsl(20, 64%, 14%)" />
            <circle cx="34.2" cy="75.8" r="0.9" fill="hsl(0, 0%, 100%)" />
            <!-- Carapace pattern spots -->
            <circle cx="52" cy="64" r="3.4" fill="${spotC}" opacity="0.72" />
            <circle cx="70" cy="65" r="3.8" fill="${spotC}" opacity="0.72" />
            <circle cx="88" cy="74" r="2.6" fill="${spotC}" opacity="0.6" />
          </g>
        </svg>
      `;
    }

    case 'acid_slime':
    case 'spike_slime': {
      const isSpike = artKey === 'spike_slime';
      const id = isSpike ? 'ss' : 'as';
      const topC = isSpike ? 'hsl(200, 62%, 58%)' : 'hsl(130, 68%, 52%)';
      const midC = isSpike ? 'hsl(210, 56%, 36%)' : 'hsl(142, 60%, 32%)';
      const botC = isSpike ? 'hsl(222, 54%, 16%)' : 'hsl(156, 58%, 14%)';
      const rimC = isSpike ? 'hsl(194, 88%, 76%)' : 'hsl(124, 90%, 70%)';
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-${id}-body" cx="40%" cy="34%" r="68%">
              <stop offset="0%" stop-color="${topC}" />
              <stop offset="56%" stop-color="${midC}" />
              <stop offset="100%" stop-color="${botC}" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="106" rx="44" ry="6.8" fill="hsla(0,0%,0%,0.48)" />
          <g class="svg-breathe">
            ${
              isSpike
                ? `<polygon points="28,57 35,31 46,50 59,20 71,50 85,31 92,57" fill="hsl(196, 72%, 76%)" stroke="hsl(208, 72%, 30%)" stroke-width="1.6" />
                   <path d="M59 23 L62 47 M36 35 L41 49 M84 35 L79 49" stroke="hsla(0,0%,100%,0.55)" stroke-width="1.3" />`
                : `<circle cx="28" cy="44" r="4.4" fill="hsl(124, 92%, 64%)" opacity="0.78" class="svg-float" />
                   <circle cx="90" cy="40" r="3.4" fill="hsl(124, 92%, 64%)" opacity="0.72" class="svg-float" />
                   <circle cx="72" cy="30" r="2.2" fill="hsl(124, 98%, 76%)" opacity="0.75" />`
            }
            <!-- Translucent gelatinous slime mass -->
            <path d="M16 96 Q15 46 60 45 Q105 46 104 96 Q82 104 60 100 Q38 104 16 96 Z" fill="url(#ea-${id}-body)" stroke="${rimC}" stroke-width="2.2" />
            <!-- Suspended inner nucleus & rising bubbles -->
            <ellipse cx="60" cy="80" rx="26" ry="12" fill="hsla(0,0%,0%,0.18)" />
            <path d="M31 61 Q41 51 58 52" stroke="hsla(0,0%,100%,0.48)" stroke-width="3.4" stroke-linecap="round" fill="none" />
            <circle cx="84" cy="69" r="4.5" fill="hsla(0,0%,100%,0.22)" stroke="hsla(0,0%,100%,0.35)" stroke-width="0.8" />
            <circle cx="77" cy="85" r="2.8" fill="hsla(0,0%,100%,0.24)" />
            <circle cx="33" cy="84" r="3.4" fill="hsla(0,0%,100%,0.2)" />
            <!-- Glowing eyes & mischievous grin -->
            <circle cx="44" cy="74" r="6" fill="hsla(48, 100%, 64%, 0.32)" />
            <circle cx="44" cy="74" r="3.8" fill="hsl(48, 100%, 70%)" />
            <circle cx="43.2" cy="74" r="1.4" fill="hsl(150, 62%, 14%)" />
            <circle cx="74" cy="74" r="6" fill="hsla(48, 100%, 64%, 0.32)" />
            <circle cx="74" cy="74" r="3.8" fill="hsl(48, 100%, 70%)" />
            <circle cx="73.2" cy="74" r="1.4" fill="hsl(150, 62%, 14%)" />
            <path d="M43 86 Q59 94 75 86" stroke="hsl(48, 66%, 90%)" stroke-width="2.6" fill="none" stroke-linecap="round" />
          </g>
        </svg>
      `;
    }

    case 'fungi_beast':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-fb-aura" cx="50%" cy="48%" r="48%">
              <stop offset="0%" stop-color="hsla(140, 82%, 48%, 0.2)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-fb-cap" x1="0.1" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stop-color="hsl(338, 78%, 58%)" />
              <stop offset="58%" stop-color="hsl(330, 68%, 38%)" />
              <stop offset="100%" stop-color="hsl(320, 64%, 20%)" />
            </linearGradient>
            <linearGradient id="ea-fb-body" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stop-color="hsl(272, 36%, 44%)" />
              <stop offset="100%" stop-color="hsl(266, 40%, 16%)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="58" r="50" fill="url(#ea-fb-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="107" rx="41" ry="6.5" fill="hsla(0,0%,0%,0.52)" />
          <!-- Floating bioluminescent toxic spores -->
          <g class="svg-float">
            <circle cx="20" cy="34" r="3.4" fill="hsl(142, 92%, 64%)" opacity="0.8" />
            <circle cx="98" cy="30" r="2.8" fill="hsl(142, 92%, 64%)" opacity="0.75" />
            <circle cx="88" cy="18" r="2.2" fill="hsl(48, 98%, 74%)" opacity="0.8" />
            <circle cx="32" cy="20" r="2" fill="hsl(292, 86%, 72%)" opacity="0.7" />
          </g>
          <g class="svg-breathe">
            <!-- Stocky fungal beast torso & claws -->
            <path d="M25 96 Q27 56 60 54 Q93 56 95 96 Q76 103 60 99 Q44 103 25 96 Z" fill="url(#ea-fb-body)" stroke="hsl(280, 48%, 60%)" stroke-width="1.8" />
            <path d="M35 96 L30 104 M43 97 L41 104 M77 97 L79 104 M85 96 L90 104" stroke="hsl(42, 46%, 82%)" stroke-width="2.6" stroke-linecap="round" />
            <!-- Giant spotted toadstool cap with gill ridges -->
            <path d="M14 62 Q60 10 106 62 Q60 76 14 62 Z" fill="url(#ea-fb-cap)" stroke="hsl(344, 86%, 72%)" stroke-width="2" />
            <path d="M24 63 Q60 72 96 63" stroke="hsl(42, 56%, 76%)" stroke-width="2.2" opacity="0.8" fill="none" />
            <path d="M36 65 L39 70 M48 67 L50 72 M60 68 L60 73 M72 67 L70 72 M84 65 L81 70" stroke="hsl(326, 48%, 22%)" stroke-width="1.2" opacity="0.7" />
            <circle cx="41" cy="44" r="5.8" fill="hsl(46, 94%, 82%)" stroke="hsl(340, 62%, 34%)" stroke-width="1" />
            <circle cx="62" cy="33" r="6.8" fill="hsl(46, 94%, 82%)" stroke="hsl(340, 62%, 34%)" stroke-width="1" />
            <circle cx="81" cy="46" r="5" fill="hsl(46, 94%, 82%)" stroke="hsl(340, 62%, 34%)" stroke-width="1" />
            <circle cx="52" cy="52" r="3.2" fill="hsl(46, 94%, 82%)" opacity="0.85" />
            <!-- Glowing eyes & sharp fangs -->
            <circle cx="47" cy="78" r="5.8" fill="hsla(44, 100%, 64%, 0.34)" />
            <circle cx="47" cy="78" r="3.6" fill="hsl(46, 100%, 68%)" />
            <circle cx="73" cy="78" r="5.8" fill="hsla(44, 100%, 64%, 0.34)" />
            <circle cx="73" cy="78" r="3.6" fill="hsl(46, 100%, 68%)" />
            <path d="M48 88 Q60 93 72 88" stroke="hsl(268, 48%, 12%)" stroke-width="2.4" fill="none" />
            <polygon points="51,88 54,95 57,88" fill="hsl(44, 54%, 92%)" />
            <polygon points="63,88 66,95 69,88" fill="hsl(44, 54%, 92%)" />
          </g>
        </svg>
      `;

    case 'slaver_blue':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-sb-cloak" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(214, 62%, 44%)" />
              <stop offset="100%" stop-color="hsl(224, 58%, 17%)" />
            </linearGradient>
            <linearGradient id="ea-sb-steel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(206, 26%, 88%)" />
              <stop offset="100%" stop-color="hsl(214, 22%, 44%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="36" ry="6" fill="hsla(0,0%,0%,0.48)" />
          <!-- Cobalt mantle & sash -->
          <path d="M32 42 Q60 30 84 44 L92 104 L26 104 Z" fill="url(#ea-sb-cloak)" stroke="hsl(206, 74%, 62%)" stroke-width="1.8" />
          <path d="M40 50 L80 86 M40 60 L76 92" stroke="hsl(32, 46%, 48%)" stroke-width="2.5" opacity="0.85" />
          <!-- Hooded helm -->
          <path d="M42 20 Q60 11 76 22 L74 44 Q60 49 44 44 Z" fill="url(#ea-sb-cloak)" stroke="hsl(206, 74%, 62%)" stroke-width="1.8" />
          <rect x="46" y="26" width="26" height="14" rx="4" fill="hsl(224, 48%, 12%)" />
          <circle cx="53" cy="33" r="2.8" fill="hsl(192, 98%, 68%)" />
          <circle cx="65" cy="33" r="2.8" fill="hsl(192, 98%, 68%)" />
          <!-- Wicked polearm pike -->
          <line x1="90" y1="22" x2="86" y2="104" stroke="hsl(30, 32%, 52%)" stroke-width="4" stroke-linecap="round" />
          <path d="M90 10 L102 26 L90 36 L82 26 Z" fill="url(#ea-sb-steel)" stroke="hsl(212, 34%, 26%)" stroke-width="1.4" />
          <path d="M88 34 Q78 36 78 46" stroke="hsl(206, 26%, 76%)" stroke-width="2.2" fill="none" />
        </svg>
      `;

    case 'looter':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-lt-coat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(30, 44%, 38%)" />
              <stop offset="100%" stop-color="hsl(24, 38%, 17%)" />
            </linearGradient>
            <linearGradient id="ea-lt-blade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(40, 22%, 90%)" />
              <stop offset="100%" stop-color="hsl(30, 14%, 46%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="34" ry="6" fill="hsla(0,0%,0%,0.48)" />
          <!-- Loot sack on back -->
          <path d="M74 44 Q98 48 96 78 Q88 92 72 86 Z" fill="hsl(36, 48%, 34%)" stroke="hsl(44, 72%, 58%)" stroke-width="1.6" />
          <circle cx="84" cy="56" r="3" fill="hsl(46, 96%, 64%)" />
          <circle cx="89" cy="61" r="2.5" fill="hsl(46, 96%, 64%)" />
          <!-- Bandit coat & scarf -->
          <path d="M36 46 Q58 38 78 48 L82 102 L34 102 Z" fill="url(#ea-lt-coat)" stroke="hsl(36, 48%, 54%)" stroke-width="1.8" />
          <path d="M38 46 Q58 54 78 46 L74 56 Q58 62 40 56 Z" fill="hsl(8, 62%, 38%)" />
          <!-- Masked bandit head -->
          <circle cx="58" cy="31" r="14" fill="hsl(26, 36%, 24%)" stroke="hsl(38, 56%, 58%)" stroke-width="1.8" />
          <path d="M44 31 Q58 27 72 31 L71 39 Q58 43 45 39 Z" fill="hsl(8, 58%, 30%)" />
          <circle cx="53" cy="29" r="2.6" fill="hsl(46, 98%, 64%)" />
          <circle cx="63" cy="29" r="2.6" fill="hsl(46, 98%, 64%)" />
          <!-- Twin thief blades -->
          <path d="M36 60 L12 46 L26 68 Z" fill="url(#ea-lt-blade)" stroke="hsl(34, 48%, 48%)" stroke-width="1.3" />
          <path d="M78 64 L104 54 L90 74 Z" fill="url(#ea-lt-blade)" stroke="hsl(34, 48%, 48%)" stroke-width="1.3" />
        </svg>
      `;

    case 'mad_gremlin':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-mg-skin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(14, 76%, 50%)" />
              <stop offset="100%" stop-color="hsl(6, 66%, 24%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="30" ry="6" fill="hsla(0,0%,0%,0.48)" />
          <!-- Wild spiked horns & ears -->
          <path d="M40 42 L20 20 L48 34 Z" fill="hsl(38, 38%, 84%)" stroke="hsl(24, 28%, 32%)" stroke-width="1.4" />
          <path d="M80 42 L100 20 L72 34 Z" fill="hsl(38, 38%, 84%)" stroke="hsl(24, 28%, 32%)" stroke-width="1.4" />
          <!-- Hunched feral torso -->
          <path d="M36 46 Q60 32 84 46 L78 100 L42 100 Z" fill="url(#ea-mg-skin)" stroke="hsl(30, 82%, 62%)" stroke-width="1.8" />
          <!-- Ragged loincloth -->
          <path d="M42 82 L78 82 L74 98 L60 92 L46 98 Z" fill="hsl(28, 34%, 22%)" />
          <!-- Angry slanted eyes & jagged toothy grin -->
          <path d="M44 52 L55 58 L46 61 Z" fill="hsl(48, 100%, 66%)" />
          <path d="M76 52 L65 58 L74 61 Z" fill="hsl(48, 100%, 66%)" />
          <path d="M46 72 L52 67 L58 73 L64 67 L70 73 L74 69" stroke="hsl(44, 62%, 90%)" stroke-width="2.6" stroke-linecap="round" fill="none" />
          <!-- Flailing clawed hands -->
          <path d="M36 62 L22 54 L26 68 Z" fill="hsl(14, 70%, 44%)" />
          <path d="M84 62 L98 54 L94 68 Z" fill="hsl(14, 70%, 44%)" />
        </svg>
      `;

    // =========================================================================
    // ACT 1 ELITES
    // =========================================================================
    case 'gremlin_nob':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-gn-aura" cx="50%" cy="54%" r="50%">
              <stop offset="0%" stop-color="hsla(8, 92%, 48%, 0.28)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-gn-body" x1="0.1" y1="0" x2="0.85" y2="1">
              <stop offset="0%" stop-color="hsl(14, 74%, 52%)" />
              <stop offset="52%" stop-color="hsl(8, 66%, 34%)" />
              <stop offset="100%" stop-color="hsl(2, 62%, 16%)" />
            </linearGradient>
            <linearGradient id="ea-gn-club" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(42, 46%, 90%)" />
              <stop offset="55%" stop-color="hsl(32, 32%, 62%)" />
              <stop offset="100%" stop-color="hsl(24, 28%, 34%)" />
            </linearGradient>
          </defs>
          <circle cx="58" cy="58" r="52" fill="url(#ea-gn-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="109" rx="46" ry="7.2" fill="hsla(0,0%,0%,0.56)" />
          <!-- Colossal spiked bone war-club -->
          <path d="M90 12 L110 10 L102 88 L86 86 Z" fill="url(#ea-gn-club)" stroke="hsl(24, 28%, 22%)" stroke-width="1.8" />
          <path d="M97 14 L92 84" stroke="hsla(46, 80%, 96%, 0.45)" stroke-width="1.4" />
          <polygon points="107,18 116,16 106,25" fill="hsl(216, 20%, 74%)" stroke="hsl(24, 24%, 22%)" stroke-width="1" />
          <polygon points="105,34 114,35 104,42" fill="hsl(216, 20%, 74%)" stroke="hsl(24, 24%, 22%)" stroke-width="1" />
          <polygon points="90,26 82,22 89,33" fill="hsl(216, 20%, 74%)" stroke="hsl(24, 24%, 22%)" stroke-width="1" />
          <path d="M88 64 L103 65 M87 72 L102 73" stroke="hsl(14, 52%, 28%)" stroke-width="2.6" />
          <g class="svg-breathe">
            <!-- Hulking muscular brute torso & scarred chest -->
            <path d="M20 44 Q58 24 94 44 L86 104 L28 104 Z" fill="url(#ea-gn-body)" stroke="hsl(26, 62%, 62%)" stroke-width="2" />
            <path d="M28 48 Q58 34 86 48" stroke="hsla(36, 92%, 78%, 0.35)" stroke-width="1.8" fill="none" />
            <path d="M40 54 Q58 64 76 54" stroke="hsla(0,0%,0%,0.35)" stroke-width="2.2" fill="none" />
            <path d="M30 50 L84 86 M34 86 L82 52" stroke="hsl(26, 40%, 18%)" stroke-width="5.2" opacity="0.82" />
            <path d="M32 52 L82 84" stroke="hsl(38, 66%, 54%)" stroke-width="1.2" stroke-dasharray="4 6" opacity="0.7" />
            <!-- Riveted war-belt & iron skull buckle -->
            <rect x="31" y="83" width="54" height="10" rx="2.5" fill="hsl(24, 34%, 16%)" stroke="hsl(40, 72%, 60%)" stroke-width="1.6" />
            <circle cx="58" cy="88" r="5" fill="url(#ea-gn-club)" stroke="hsl(24, 32%, 20%)" stroke-width="1.2" />
            <circle cx="56.3" cy="87.5" r="1" fill="hsl(10, 62%, 16%)" /><circle cx="59.7" cy="87.5" r="1" fill="hsl(10, 62%, 16%)" />
            <!-- Swept ringed brute horns -->
            <path d="M39 26 Q18 6 12 24 Q24 39 41 37 Z" fill="url(#ea-gn-club)" stroke="hsl(24, 28%, 24%)" stroke-width="1.5" />
            <path d="M26 22 L23 30 M32 25 L30 33" stroke="hsla(24, 30%, 22%, 0.45)" stroke-width="1.4" />
            <path d="M77 26 Q98 6 104 24 Q92 39 75 37 Z" fill="url(#ea-gn-club)" stroke="hsl(24, 28%, 24%)" stroke-width="1.5" />
            <path d="M90 22 L93 30 M84 25 L86 33" stroke="hsla(24, 30%, 22%, 0.45)" stroke-width="1.4" />
            <!-- Furious snarling face, brow & jutting tusks -->
            <rect x="38" y="19" width="40" height="30" rx="9" fill="url(#ea-gn-body)" stroke="hsl(18, 48%, 20%)" stroke-width="2" />
            <path d="M43 28 L55 33 M73 28 L61 33" stroke="hsl(8, 66%, 14%)" stroke-width="3" stroke-linecap="round" />
            <circle cx="49" cy="34" r="5" fill="hsla(44, 100%, 62%, 0.35)" class="svg-pulse" />
            <circle cx="49" cy="34" r="3.2" fill="hsl(48, 100%, 68%)" />
            <circle cx="67" cy="34" r="5" fill="hsla(44, 100%, 62%, 0.35)" class="svg-pulse" />
            <circle cx="67" cy="34" r="3.2" fill="hsl(48, 100%, 68%)" />
            <path d="M44 43 Q58 39 72 43" stroke="hsl(6, 62%, 14%)" stroke-width="3.2" fill="none" stroke-linecap="round" />
            <polygon points="44,49 48,37 53,49" fill="hsl(44, 58%, 94%)" stroke="hsl(26, 24%, 28%)" stroke-width="0.9" />
            <polygon points="63,49 68,37 72,49" fill="hsl(44, 58%, 94%)" stroke="hsl(26, 24%, 28%)" stroke-width="0.9" />
          </g>
        </svg>
      `;

    case 'sentry':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-st-aura" cx="50%" cy="56%" r="48%">
              <stop offset="0%" stop-color="hsla(192, 96%, 58%, 0.28)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-st-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(44, 66%, 68%)" />
              <stop offset="50%" stop-color="hsl(36, 48%, 42%)" />
              <stop offset="100%" stop-color="hsl(26, 40%, 18%)" />
            </linearGradient>
            <radialGradient id="ea-st-core" cx="46%" cy="44%" r="54%">
              <stop offset="0%" stop-color="hsl(186, 100%, 96%)" />
              <stop offset="48%" stop-color="hsl(192, 96%, 62%)" />
              <stop offset="100%" stop-color="hsl(208, 88%, 26%)" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="56" r="48" fill="url(#ea-st-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="110" rx="30" ry="5.5" fill="hsla(0,0%,0%,0.52)" />
          <!-- Twin orbiting arcane rune rings -->
          <ellipse cx="60" cy="56" rx="44" ry="13" fill="none" stroke="hsla(192, 94%, 68%, 0.52)" stroke-width="1.6" stroke-dasharray="6 4" class="svg-float" />
          <ellipse cx="60" cy="56" rx="34" ry="9" fill="none" stroke="hsla(44, 92%, 72%, 0.35)" stroke-width="1.2" stroke-dasharray="3 5" />
          <!-- Levitating faceted golden obelisk -->
          <g class="svg-float">
            <polygon points="60,8 90,56 60,104 30,56" fill="url(#ea-st-body)" stroke="hsl(46, 86%, 78%)" stroke-width="2.2" />
            <!-- Facet light/shadow planes -->
            <polygon points="60,8 90,56 60,56" fill="hsla(48, 96%, 88%, 0.22)" />
            <polygon points="60,104 30,56 60,56" fill="hsla(220, 48%, 10%, 0.28)" />
            <polygon points="60,22 78,56 60,90 42,56" fill="hsl(218, 42%, 13%)" stroke="hsl(42, 68%, 60%)" stroke-width="1.6" />
            <!-- Engraved arcane notches -->
            <path d="M46 36 L52 40 M74 36 L68 40 M46 76 L52 72 M74 76 L68 72" stroke="hsl(44, 88%, 74%)" stroke-width="1.4" stroke-linecap="round" />
            <!-- Blazing laser plasma lens -->
            <circle cx="60" cy="56" r="15.5" fill="hsla(192, 98%, 62%, 0.3)" class="svg-pulse" />
            <circle cx="60" cy="56" r="10.2" fill="url(#ea-st-core)" stroke="hsl(188, 100%, 84%)" stroke-width="1.4" />
            <circle cx="60" cy="56" r="4" fill="hsl(0, 0%, 100%)" />
            <!-- Floating resonance shards -->
            <polygon points="60,2 64,8 60,13 56,8" fill="hsl(192, 100%, 76%)" />
            <polygon points="60,100 64,105 60,110 56,105" fill="hsl(192, 100%, 76%)" />
          </g>
        </svg>
      `;

    case 'lagavulin':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-lg-aura" cx="50%" cy="62%" r="50%">
              <stop offset="0%" stop-color="hsla(12, 90%, 48%, 0.26)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-lg-shell" x1="0.1" y1="0" x2="0.85" y2="1">
              <stop offset="0%" stop-color="hsl(32, 58%, 50%)" />
              <stop offset="52%" stop-color="hsl(24, 50%, 30%)" />
              <stop offset="100%" stop-color="hsl(16, 46%, 14%)" />
            </linearGradient>
            <linearGradient id="ea-lg-claw" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(12, 78%, 56%)" />
              <stop offset="55%" stop-color="hsl(6, 68%, 36%)" />
              <stop offset="100%" stop-color="hsl(2, 62%, 18%)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="64" r="52" fill="url(#ea-lg-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="109" rx="49" ry="7.2" fill="hsla(0,0%,0%,0.58)" />
          <g class="svg-breathe">
            <!-- Crown of armored ridge spikes -->
            <polygon points="30,40 39,14 51,33 61,10 71,33 84,14 92,40" fill="hsl(38, 70%, 68%)" stroke="hsl(22, 44%, 20%)" stroke-width="1.6" />
            <path d="M40 19 L44 33 M61 14 L63 31 M83 19 L78 33" stroke="hsla(46, 92%, 90%, 0.55)" stroke-width="1.3" />
            <!-- Heavy domed ridged bronze carapace -->
            <path d="M14 94 Q18 28 60 26 Q102 28 106 94 Q60 102 14 94 Z" fill="url(#ea-lg-shell)" stroke="hsl(40, 78%, 68%)" stroke-width="2.4" />
            <path d="M24 46 Q60 34 96 46" stroke="hsla(44, 88%, 84%, 0.42)" stroke-width="2.2" fill="none" />
            <path d="M19 60 Q60 48 101 60" stroke="hsla(14, 48%, 10%, 0.5)" stroke-width="2.4" fill="none" />
            <path d="M36 33 Q33 56 30 88 M84 33 Q87 56 90 88" stroke="hsla(14, 48%, 10%, 0.35)" stroke-width="2" fill="none" />
            <!-- Deep furnace cavity & smoldering crimson eyes -->
            <ellipse cx="60" cy="73" rx="26" ry="17" fill="hsl(10, 48%, 7%)" stroke="hsl(38, 64%, 52%)" stroke-width="2.2" />
            <circle cx="49" cy="72" r="7" fill="hsla(10, 100%, 58%, 0.38)" class="svg-pulse" />
            <circle cx="49" cy="72" r="3.8" fill="hsl(18, 100%, 66%)" />
            <circle cx="48.5" cy="71.2" r="1.2" fill="hsl(52, 100%, 92%)" />
            <circle cx="71" cy="72" r="7" fill="hsla(10, 100%, 58%, 0.38)" class="svg-pulse" />
            <circle cx="71" cy="72" r="3.8" fill="hsl(18, 100%, 66%)" />
            <circle cx="70.5" cy="71.2" r="1.2" fill="hsl(52, 100%, 92%)" />
            <path d="M46 82 L52 79 L56 83 L60 79 L64 83 L68 79 L74 82" stroke="hsl(34, 62%, 56%)" stroke-width="1.6" fill="none" />
            <!-- Wicked articulated scythe-pincers -->
            <path d="M8 89 Q2 62 27 65 L36 96 Q20 102 8 89 Z" fill="url(#ea-lg-claw)" stroke="hsl(40, 74%, 70%)" stroke-width="1.8" />
            <path d="M13 76 Q20 69 29 73" stroke="hsla(44, 92%, 88%, 0.45)" stroke-width="1.6" fill="none" />
            <path d="M112 89 Q118 62 93 65 L84 96 Q100 102 112 89 Z" fill="url(#ea-lg-claw)" stroke="hsl(40, 74%, 70%)" stroke-width="1.8" />
            <path d="M107 76 Q100 69 91 73" stroke="hsla(44, 92%, 88%, 0.45)" stroke-width="1.6" fill="none" />
          </g>
        </svg>
      `;

    // =========================================================================
    // ACT 1 BOSSES
    // =========================================================================
    case 'the_guardian':
      if (mode === 'defensive') {
        return `
          <svg viewBox="0 0 120 120" class="unit-svg boss-svg" aria-hidden="true">
            <defs>
              <radialGradient id="ea-gd-aura" cx="50%" cy="58%" r="50%">
                <stop offset="0%" stop-color="hsla(190, 94%, 58%, 0.34)" />
                <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
              </radialGradient>
              <radialGradient id="ea-gd-orb" cx="38%" cy="34%" r="66%">
                <stop offset="0%" stop-color="hsl(40, 58%, 58%)" />
                <stop offset="58%" stop-color="hsl(32, 46%, 34%)" />
                <stop offset="100%" stop-color="hsl(24, 44%, 14%)" />
              </radialGradient>
              <radialGradient id="ea-gd-core" cx="46%" cy="44%" r="54%">
                <stop offset="0%" stop-color="hsl(184, 100%, 96%)" />
                <stop offset="55%" stop-color="hsl(188, 94%, 58%)" />
                <stop offset="100%" stop-color="hsl(206, 86%, 24%)" />
              </radialGradient>
            </defs>
            <circle cx="60" cy="58" r="54" fill="url(#ea-gd-aura)" class="svg-pulse" />
            <ellipse cx="60" cy="110" rx="44" ry="7" fill="hsla(0,0%,0%,0.58)" />
            <ellipse cx="60" cy="110" rx="50" ry="8.5" fill="none" stroke="hsla(190, 96%, 68%, 0.5)" stroke-width="1.3" stroke-dasharray="7 4" />
            <!-- Spinning spiked fortress barrier -->
            <g class="svg-spin-slow">
              <polygon points="60,5 69,26 51,26" fill="hsl(42, 82%, 74%)" stroke="hsl(24, 34%, 20%)" stroke-width="1.4" />
              <polygon points="60,111 69,90 51,90" fill="hsl(42, 82%, 74%)" stroke="hsl(24, 34%, 20%)" stroke-width="1.4" />
              <polygon points="7,58 28,49 28,67" fill="hsl(42, 82%, 74%)" stroke="hsl(24, 34%, 20%)" stroke-width="1.4" />
              <polygon points="113,58 92,49 92,67" fill="hsl(42, 82%, 74%)" stroke="hsl(24, 34%, 20%)" stroke-width="1.4" />
              <polygon points="22,20 41,29 30,41" fill="hsl(42, 80%, 70%)" stroke="hsl(24, 34%, 20%)" stroke-width="1.2" />
              <polygon points="98,20 79,29 90,41" fill="hsl(42, 80%, 70%)" stroke="hsl(24, 34%, 20%)" stroke-width="1.2" />
              <polygon points="22,96 41,87 30,75" fill="hsl(42, 80%, 70%)" stroke="hsl(24, 34%, 20%)" stroke-width="1.2" />
              <polygon points="98,96 79,87 90,75" fill="hsl(42, 80%, 70%)" stroke="hsl(24, 34%, 20%)" stroke-width="1.2" />
            </g>
            <!-- Interlocked armored sphere plates -->
            <circle cx="60" cy="58" r="35" fill="url(#ea-gd-orb)" stroke="hsl(44, 86%, 72%)" stroke-width="3" />
            <path d="M32 42 Q60 52 88 42 M32 74 Q60 64 88 74" stroke="hsl(24, 42%, 18%)" stroke-width="2.4" fill="none" />
            <circle cx="60" cy="58" r="23" fill="none" stroke="hsl(190, 92%, 68%)" stroke-width="2" stroke-dasharray="8 5" opacity="0.72" />
            <circle cx="60" cy="58" r="15" fill="url(#ea-gd-core)" stroke="hsl(44, 96%, 84%)" stroke-width="2" class="svg-pulse" />
            <circle cx="60" cy="58" r="5.5" fill="hsl(0, 0%, 100%)" />
          </svg>
        `;
      }
      return `
        <svg viewBox="0 0 120 120" class="unit-svg boss-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-gu-aura" cx="50%" cy="56%" r="52%">
              <stop offset="0%" stop-color="hsla(192, 94%, 56%, 0.3)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-gu-frame" x1="0.1" y1="0" x2="0.85" y2="1">
              <stop offset="0%" stop-color="hsl(40, 58%, 54%)" />
              <stop offset="52%" stop-color="hsl(32, 46%, 32%)" />
              <stop offset="100%" stop-color="hsl(24, 44%, 14%)" />
            </linearGradient>
            <linearGradient id="ea-gu-blade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(44, 62%, 86%)" />
              <stop offset="55%" stop-color="hsl(34, 42%, 54%)" />
              <stop offset="100%" stop-color="hsl(26, 36%, 28%)" />
            </linearGradient>
            <radialGradient id="ea-gu-core" cx="46%" cy="44%" r="54%">
              <stop offset="0%" stop-color="hsl(184, 100%, 96%)" />
              <stop offset="55%" stop-color="hsl(190, 94%, 58%)" />
              <stop offset="100%" stop-color="hsl(206, 86%, 24%)" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="58" r="54" fill="url(#ea-gu-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="111" rx="48" ry="7.2" fill="hsla(0,0%,0%,0.58)" />
          <ellipse cx="60" cy="111" rx="53" ry="8.8" fill="none" stroke="hsla(44, 92%, 68%, 0.45)" stroke-width="1.3" stroke-dasharray="8 5" />
          <g class="svg-breathe">
            <!-- Twin articulated scythe-blade wings -->
            <path d="M27 34 L5 64 L18 99 L34 69 Z" fill="url(#ea-gu-blade)" stroke="hsl(24, 30%, 18%)" stroke-width="1.8" />
            <path d="M25 40 L11 64 L19 88" stroke="hsla(48, 92%, 94%, 0.65)" stroke-width="1.6" fill="none" />
            <path d="M93 34 L115 64 L102 99 L86 69 Z" fill="url(#ea-gu-blade)" stroke="hsl(24, 30%, 18%)" stroke-width="1.8" />
            <path d="M95 40 L109 64 L101 88" stroke="hsla(48, 92%, 94%, 0.55)" stroke-width="1.6" fill="none" />
            <!-- Faceted gilded titan chassis -->
            <polygon points="27,34 60,9 93,34 87,97 60,108 33,97" fill="url(#ea-gu-frame)" stroke="hsl(44, 84%, 72%)" stroke-width="2.5" />
            <polygon points="60,9 93,34 60,34" fill="hsla(46, 96%, 88%, 0.26)" />
            <polygon points="33,97 60,108 60,86" fill="hsla(220, 48%, 10%, 0.34)" />
            <!-- Riveted shoulder plates & glowing plasma vents -->
            <path d="M32 50 L46 56 M88 50 L74 56 M34 82 L47 76 M86 82 L73 76" stroke="hsl(190, 96%, 68%)" stroke-width="2" stroke-linecap="round" opacity="0.85" />
            <!-- Armored visor slit & twin scanner eyes -->
            <path d="M38 33 L82 33 L75 43 L45 43 Z" fill="hsl(218, 42%, 11%)" stroke="hsl(42, 74%, 62%)" stroke-width="1.4" />
            <circle cx="51" cy="38" r="2.8" fill="hsl(190, 100%, 74%)" class="svg-pulse" />
            <circle cx="69" cy="38" r="2.8" fill="hsl(190, 100%, 74%)" class="svg-pulse" />
            <!-- Crystal furnace core -->
            <polygon points="60,44 79,66 60,88 41,66" fill="hsl(216, 48%, 12%)" stroke="hsl(44, 88%, 74%)" stroke-width="2" />
            <polygon points="60,48 75,66 60,84 45,66" fill="url(#ea-gu-core)" stroke="hsl(188, 100%, 86%)" stroke-width="1.4" class="svg-pulse" />
            <circle cx="60" cy="66" r="5.8" fill="hsl(0, 0%, 100%)" />
          </g>
          <circle cx="16" cy="26" r="1.8" fill="hsl(188, 100%, 78%)" opacity="0.82" class="svg-float" />
          <circle cx="104" cy="28" r="1.8" fill="hsl(46, 100%, 76%)" opacity="0.82" class="svg-float" />
        </svg>
      `;

    case 'hexaghost':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg boss-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-hx-aura" cx="50%" cy="56%" r="54%">
              <stop offset="0%" stop-color="hsla(158, 96%, 56%, 0.34)" />
              <stop offset="65%" stop-color="hsla(170, 84%, 30%, 0.12)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <radialGradient id="ea-hx-body" cx="46%" cy="40%" r="58%">
              <stop offset="0%" stop-color="hsl(156, 98%, 78%)" />
              <stop offset="52%" stop-color="hsl(164, 78%, 42%)" />
              <stop offset="100%" stop-color="hsl(178, 72%, 14%)" />
            </radialGradient>
            <linearGradient id="ea-hx-flame" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="hsl(166, 92%, 44%)" />
              <stop offset="55%" stop-color="hsl(152, 98%, 68%)" />
              <stop offset="100%" stop-color="hsl(142, 100%, 92%)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="58" r="56" fill="url(#ea-hx-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="112" rx="42" ry="6" fill="hsla(164, 74%, 12%, 0.65)" />
          <ellipse cx="60" cy="112" rx="50" ry="7.8" fill="none" stroke="hsla(154, 98%, 68%, 0.48)" stroke-width="1.3" stroke-dasharray="6 4" />
          <!-- Rotating spectral hexagram & 6 roaring soul-flames -->
          <g class="svg-spin-slow">
            <polygon points="60,15 97,36.5 97,79.5 60,101 23,79.5 23,36.5" fill="none" stroke="hsl(160, 88%, 60%)" stroke-width="2" stroke-dasharray="6 4" opacity="0.82" />
            <circle cx="60" cy="58" r="42" fill="none" stroke="hsla(156, 96%, 74%, 0.34)" stroke-width="1.3" />
            <path d="M60 4 Q69 15 60 26 Q51 15 60 4 Z" fill="url(#ea-hx-flame)" />
            <path d="M98 25 Q107 36 98 46 Q89 36 98 25 Z" fill="url(#ea-hx-flame)" />
            <path d="M98 69 Q107 80 98 90 Q89 80 98 69 Z" fill="url(#ea-hx-flame)" />
            <path d="M60 90 Q69 101 60 112 Q51 101 60 90 Z" fill="url(#ea-hx-flame)" />
            <path d="M22 69 Q31 80 22 90 Q13 80 22 69 Z" fill="url(#ea-hx-flame)" />
            <path d="M22 25 Q31 36 22 46 Q13 36 22 25 Z" fill="url(#ea-hx-flame)" />
          </g>
          <!-- Central spectral inferno visage -->
          <g class="svg-float">
            <path d="M44 38 Q52 24 60 32 Q68 22 76 38 Q87 48 85 64 Q80 86 60 88 Q40 86 35 64 Q33 48 44 38 Z" fill="url(#ea-hx-body)" stroke="hsl(152, 100%, 78%)" stroke-width="2.4" />
            <circle cx="60" cy="59" r="20" fill="none" stroke="hsla(152, 100%, 88%, 0.5)" stroke-width="1.5" />
            <!-- Haunting hollow eye sockets & wailing spectral maw -->
            <path d="M45 50 L56 54 L47 61 Z" fill="hsl(180, 72%, 9%)" />
            <path d="M75 50 L64 54 L73 61 Z" fill="hsl(180, 72%, 9%)" />
            <circle cx="50" cy="55" r="2.4" fill="hsl(148, 100%, 88%)" class="svg-pulse" />
            <circle cx="70" cy="55" r="2.4" fill="hsl(148, 100%, 88%)" class="svg-pulse" />
            <path d="M49 69 Q54 75 60 71 Q66 75 71 69 Q66 79 60 77 Q54 79 49 69 Z" fill="hsl(180, 72%, 9%)" />
          </g>
        </svg>
      `;

    case 'slime_boss':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg boss-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-slb-aura" cx="50%" cy="66%" r="52%">
              <stop offset="0%" stop-color="hsla(128, 86%, 46%, 0.28)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <radialGradient id="ea-slb-body" cx="42%" cy="34%" r="68%">
              <stop offset="0%" stop-color="hsl(126, 74%, 56%)" />
              <stop offset="56%" stop-color="hsl(138, 62%, 34%)" />
              <stop offset="100%" stop-color="hsl(154, 62%, 14%)" />
            </radialGradient>
            <linearGradient id="ea-slb-hat" x1="0" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stop-color="hsl(40, 56%, 44%)" />
              <stop offset="55%" stop-color="hsl(30, 48%, 24%)" />
              <stop offset="100%" stop-color="hsl(22, 46%, 12%)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="68" r="54" fill="url(#ea-slb-aura)" />
          <ellipse cx="60" cy="109" rx="50" ry="7.8" fill="hsla(0,0%,0%,0.58)" />
          <ellipse cx="60" cy="109" rx="54" ry="9" fill="none" stroke="hsla(124, 90%, 56%, 0.44)" stroke-width="1.3" stroke-dasharray="7 5" />
          <g class="svg-breathe">
            <!-- Colossal dripping gelatinous boss mass -->
            <path d="M10 96 Q10 35 60 35 Q110 35 110 96 Q94 106 78 101 Q60 108 42 101 Q24 106 10 96 Z" fill="url(#ea-slb-body)" stroke="hsl(124, 86%, 68%)" stroke-width="2.6" />
            <!-- Suspended inner bubbles & specular gloss -->
            <ellipse cx="60" cy="84" rx="34" ry="13" fill="hsla(154, 70%, 10%, 0.26)" />
            <path d="M24 55 Q38 42 56 44" stroke="hsla(0,0%,100%,0.56)" stroke-width="4.2" stroke-linecap="round" fill="none" />
            <circle cx="90" cy="67" r="5.5" fill="hsla(0,0%,100%,0.26)" stroke="hsla(0,0%,100%,0.4)" stroke-width="0.9" />
            <circle cx="27" cy="84" r="4.4" fill="hsla(0,0%,100%,0.22)" />
            <circle cx="84" cy="88" r="3" fill="hsla(0,0%,100%,0.24)" />
            <!-- Dapper bowler hat with golden band & feather -->
            <path d="M78 24 Q92 14 96 19 Q88 26 78 28 Z" fill="hsl(352, 82%, 58%)" stroke="hsl(44, 92%, 72%)" stroke-width="1" />
            <ellipse cx="60" cy="36" rx="31" ry="7" fill="hsl(28, 46%, 18%)" stroke="hsl(44, 84%, 64%)" stroke-width="1.9" />
            <path d="M38 35 Q40 13 60 13 Q80 13 82 35 Z" fill="url(#ea-slb-hat)" stroke="hsl(44, 84%, 64%)" stroke-width="1.9" />
            <path d="M40 30 Q60 34 80 30" stroke="hsl(46, 96%, 68%)" stroke-width="3.4" fill="none" />
            <!-- Boss eyes, golden monocle + dangling chain & jagged grin -->
            <circle cx="43" cy="68" r="6.8" fill="hsl(48, 100%, 68%)" stroke="hsl(148, 64%, 14%)" stroke-width="1.6" />
            <circle cx="77" cy="68" r="7.4" fill="hsl(48, 100%, 68%)" stroke="hsl(46, 96%, 72%)" stroke-width="2.4" />
            <path d="M84 70 Q92 80 88 94" stroke="hsl(44, 88%, 64%)" stroke-width="1.6" stroke-dasharray="2 2" fill="none" />
            <circle cx="44" cy="68" r="2.5" fill="hsl(150, 66%, 12%)" />
            <circle cx="76" cy="68" r="2.5" fill="hsl(150, 66%, 12%)" />
            <path d="M35 82 Q60 97 85 82 Q60 90 35 82 Z" fill="hsl(156, 68%, 12%)" stroke="hsl(48, 76%, 90%)" stroke-width="2" />
            <polygon points="44,85 48,91 52,86" fill="hsl(48, 72%, 94%)" />
            <polygon points="68,86 72,91 76,85" fill="hsl(48, 72%, 94%)" />
          </g>
          <circle cx="18" cy="48" r="2.2" fill="hsl(124, 100%, 72%)" opacity="0.78" class="svg-float" />
          <circle cx="104" cy="54" r="1.9" fill="hsl(132, 100%, 70%)" opacity="0.72" class="svg-float" />
        </svg>
      `;

    // =========================================================================
    // ACT 2 NORMAL ENEMIES
    // =========================================================================
    case 'centurion':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-cn-armor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(214, 24%, 56%)" />
              <stop offset="100%" stop-color="hsl(220, 26%, 24%)" />
            </linearGradient>
            <linearGradient id="ea-cn-shield" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(38, 66%, 56%)" />
              <stop offset="100%" stop-color="hsl(26, 54%, 26%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="38" ry="6.5" fill="hsla(0,0%,0%,0.5)" />
          <!-- Crimson legion crest -->
          <path d="M46 18 Q62 8 76 18 L72 26 L50 26 Z" fill="hsl(6, 76%, 46%)" stroke="hsl(36, 70%, 62%)" stroke-width="1.2" />
          <!-- Heavy steel plate torso -->
          <path d="M40 44 Q62 36 82 44 L80 102 L42 102 Z" fill="url(#ea-cn-armor)" stroke="hsl(212, 30%, 76%)" stroke-width="1.8" />
          <path d="M44 68 L78 68 M44 82 L78 82" stroke="hsl(220, 28%, 18%)" stroke-width="2" />
          <!-- Legion helmet -->
          <rect x="46" y="21" width="28" height="23" rx="6" fill="url(#ea-cn-armor)" stroke="hsl(212, 32%, 78%)" stroke-width="1.8" />
          <rect x="50" y="30" width="20" height="5" rx="2" fill="hsl(44, 96%, 64%)" />
          <!-- Tower bronze shield -->
          <rect x="16" y="44" width="27" height="52" rx="6" fill="url(#ea-cn-shield)" stroke="hsl(44, 82%, 72%)" stroke-width="2.2" />
          <path d="M29.5 52 L29.5 88 M21 70 L38 70" stroke="hsl(44, 86%, 76%)" stroke-width="2.4" stroke-linecap="round" />
          <!-- Flanged morningstar mace -->
          <line x1="92" y1="36" x2="90" y2="96" stroke="hsl(32, 32%, 52%)" stroke-width="4" stroke-linecap="round" />
          <circle cx="92" cy="30" r="9" fill="url(#ea-cn-armor)" stroke="hsl(44, 78%, 68%)" stroke-width="1.8" />
          <path d="M92 18 L92 42 M80 30 L104 30" stroke="hsl(44, 82%, 74%)" stroke-width="2" stroke-linecap="round" />
        </svg>
      `;

    case 'mystic':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-my-robe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(318, 48%, 42%)" />
              <stop offset="100%" stop-color="hsl(304, 48%, 18%)" />
            </linearGradient>
            <radialGradient id="ea-my-orb" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="hsl(144, 100%, 88%)" />
              <stop offset="60%" stop-color="hsl(148, 86%, 52%)" />
              <stop offset="100%" stop-color="hsl(160, 74%, 26%)" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="34" ry="6" fill="hsla(0,0%,0%,0.48)" />
          <!-- Glowing healing staff -->
          <line x1="28" y1="28" x2="32" y2="102" stroke="hsl(40, 56%, 54%)" stroke-width="4" stroke-linecap="round" />
          <circle cx="28" cy="24" r="11" fill="hsla(148, 92%, 58%, 0.28)" />
          <circle cx="28" cy="24" r="7" fill="url(#ea-my-orb)" stroke="hsl(44, 88%, 74%)" stroke-width="1.6" />
          <!-- Embroidered mystic cloak -->
          <path d="M36 46 Q62 34 86 46 L94 104 L30 104 Z" fill="url(#ea-my-robe)" stroke="hsl(326, 62%, 62%)" stroke-width="1.8" />
          <path d="M56 46 L62 102 L68 46 Z" fill="hsl(42, 76%, 58%)" opacity="0.82" />
          <!-- Deep priestess hood -->
          <path d="M42 44 Q46 14 62 14 Q78 14 82 44 Q62 52 42 44 Z" fill="url(#ea-my-robe)" stroke="hsl(326, 66%, 66%)" stroke-width="1.8" />
          <ellipse cx="62" cy="34" rx="11" ry="9" fill="hsl(296, 46%, 12%)" />
          <circle cx="57" cy="34" r="2.8" fill="hsl(148, 96%, 66%)" />
          <circle cx="67" cy="34" r="2.8" fill="hsl(148, 96%, 66%)" />
          <!-- Floating emerald blessing glyph -->
          <path d="M96 48 L100 54 L96 60 L92 54 Z" fill="hsl(148, 92%, 64%)" />
        </svg>
      `;

    case 'byrd':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-by-wing" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(270, 48%, 48%)" />
              <stop offset="100%" stop-color="hsl(262, 46%, 20%)" />
            </linearGradient>
            <radialGradient id="ea-by-body" cx="46%" cy="40%" r="60%">
              <stop offset="0%" stop-color="hsl(278, 44%, 44%)" />
              <stop offset="100%" stop-color="hsl(258, 44%, 18%)" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="107" rx="30" ry="5" fill="hsla(0,0%,0%,0.38)" />
          <!-- Wide sweeping dark wings -->
          <path d="M56 56 Q28 24 8 44 Q18 62 28 70 Q42 66 56 64 Z" fill="url(#ea-by-wing)" stroke="hsl(276, 62%, 66%)" stroke-width="1.8" />
          <path d="M64 56 Q92 24 112 44 Q102 62 92 70 Q78 66 64 64 Z" fill="url(#ea-by-wing)" stroke="hsl(276, 62%, 66%)" stroke-width="1.8" />
          <path d="M18 52 L38 56 M102 52 L82 56" stroke="hsla(282, 80%, 78%, 0.45)" stroke-width="1.6" />
          <!-- Plumaged raptor body -->
          <ellipse cx="60" cy="58" rx="17" ry="20" fill="url(#ea-by-body)" stroke="hsl(278, 56%, 64%)" stroke-width="1.8" />
          <!-- Crown feathers -->
          <path d="M52 38 L48 25 L59 35 L65 24 L68 38 Z" fill="hsl(286, 62%, 58%)" />
          <!-- Razor hooked beak & fierce red eyes -->
          <polygon points="56,52 64,52 60,65" fill="hsl(42, 92%, 62%)" stroke="hsl(28, 42%, 24%)" stroke-width="1.2" />
          <circle cx="52" cy="49" r="3.2" fill="hsl(8, 98%, 62%)" />
          <circle cx="68" cy="49" r="3.2" fill="hsl(8, 98%, 62%)" />
          <!-- Sharp talons -->
          <path d="M52 78 L46 92 M55 78 L53 91 M68 78 L74 92 M65 78 L67 91" stroke="hsl(40, 80%, 62%)" stroke-width="2.4" stroke-linecap="round" />
        </svg>
      `;

    case 'spheric_guardian':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-sg-sphere" cx="38%" cy="34%" r="64%">
              <stop offset="0%" stop-color="hsl(214, 40%, 56%)" />
              <stop offset="65%" stop-color="hsl(220, 44%, 28%)" />
              <stop offset="100%" stop-color="hsl(228, 48%, 14%)" />
            </radialGradient>
            <radialGradient id="ea-sg-eye" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="hsl(190, 100%, 92%)" />
              <stop offset="60%" stop-color="hsl(196, 94%, 58%)" />
              <stop offset="100%" stop-color="hsl(212, 86%, 32%)" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="34" ry="5.5" fill="hsla(0,0%,0%,0.48)" />
          <!-- Tilted gyroscope brass rings -->
          <ellipse cx="60" cy="56" rx="46" ry="15" transform="rotate(-18 60 56)" fill="none" stroke="hsl(42, 76%, 62%)" stroke-width="2.8" />
          <ellipse cx="60" cy="56" rx="44" ry="14" transform="rotate(24 60 56)" fill="none" stroke="hsl(196, 84%, 64%)" stroke-width="2" opacity="0.85" />
          <!-- Armored floating core sphere -->
          <circle cx="60" cy="56" r="28" fill="url(#ea-sg-sphere)" stroke="hsl(42, 78%, 68%)" stroke-width="2.4" />
          <path d="M36 48 Q60 36 84 48" stroke="hsla(42, 92%, 78%, 0.4)" stroke-width="2" fill="none" />
          <circle cx="60" cy="56" r="14" fill="hsl(224, 48%, 12%)" stroke="hsl(196, 86%, 62%)" stroke-width="2" />
          <circle cx="60" cy="56" r="8.5" fill="url(#ea-sg-eye)" />
          <circle cx="60" cy="56" r="3.4" fill="hsl(0, 0%, 100%)" />
        </svg>
      `;

    case 'snake_plant':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-sp-stem" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(136, 56%, 44%)" />
              <stop offset="100%" stop-color="hsl(150, 56%, 18%)" />
            </linearGradient>
            <linearGradient id="ea-sp-head" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(296, 62%, 48%)" />
              <stop offset="100%" stop-color="hsl(282, 58%, 22%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="40" ry="6.5" fill="hsla(0,0%,0%,0.5)" />
          <!-- Coiling spiked vine tendrils -->
          <path d="M36 98 Q14 82 22 64 Q28 72 40 78" stroke="hsl(134, 64%, 44%)" stroke-width="4.5" stroke-linecap="round" fill="none" />
          <path d="M84 98 Q106 82 98 64 Q92 72 80 78" stroke="hsl(134, 64%, 44%)" stroke-width="4.5" stroke-linecap="round" fill="none" />
          <!-- Armored leafy stem & calyx -->
          <path d="M40 100 Q34 72 48 54 L72 54 Q86 72 80 100 Z" fill="url(#ea-sp-stem)" stroke="hsl(126, 72%, 58%)" stroke-width="2" />
          <path d="M34 62 Q60 72 86 62 L76 50 L44 50 Z" fill="hsl(142, 58%, 32%)" stroke="hsl(126, 74%, 60%)" stroke-width="1.6" />
          <!-- Carnivorous serpent bulb & fanged jaws -->
          <path d="M26 52 Q32 16 64 18 Q94 20 96 54 Q76 62 60 56 Q44 62 26 52 Z" fill="url(#ea-sp-head)" stroke="hsl(312, 74%, 68%)" stroke-width="2" />
          <path d="M32 42 Q62 34 88 46 Q62 64 32 52 Z" fill="hsl(344, 66%, 18%)" />
          <polygon points="38,42 42,52 46,40" fill="hsl(44, 64%, 92%)" />
          <polygon points="52,39 56,50 60,39" fill="hsl(44, 64%, 92%)" />
          <polygon points="66,40 70,51 74,42" fill="hsl(44, 64%, 92%)" />
          <polygon points="46,56 50,48 54,57" fill="hsl(44, 64%, 92%)" />
          <polygon points="60,57 64,49 68,56" fill="hsl(44, 64%, 92%)" />
          <!-- Venomous yellow eyes -->
          <circle cx="48" cy="29" r="3.4" fill="hsl(52, 100%, 64%)" />
          <circle cx="72" cy="29" r="3.4" fill="hsl(52, 100%, 64%)" />
        </svg>
      `;

    // =========================================================================
    // ACT 2 ELITES
    // =========================================================================
    case 'book_of_stabbing':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-bk-aura" cx="60%" cy="56%" r="50%">
              <stop offset="0%" stop-color="hsla(352, 92%, 52%, 0.28)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-bk-cover" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(354, 70%, 50%)" />
              <stop offset="55%" stop-color="hsl(348, 66%, 32%)" />
              <stop offset="100%" stop-color="hsl(342, 68%, 14%)" />
            </linearGradient>
            <linearGradient id="ea-bk-blade" x1="0" y1="0" x2="1" y2="0.4">
              <stop offset="0%" stop-color="hsl(204, 54%, 96%)" />
              <stop offset="55%" stop-color="hsl(212, 26%, 68%)" />
              <stop offset="100%" stop-color="hsl(218, 28%, 34%)" />
            </linearGradient>
          </defs>
          <circle cx="62" cy="58" r="52" fill="url(#ea-bk-aura)" class="svg-pulse" />
          <ellipse cx="62" cy="110" rx="36" ry="5.8" fill="hsla(0,0%,0%,0.54)" />
          <g class="svg-float">
            <!-- Bursting fan of levitating stabbing daggers -->
            <polygon points="5,31 41,42 39,49" fill="url(#ea-bk-blade)" stroke="hsl(214, 34%, 26%)" stroke-width="1.1" />
            <polygon points="2,55 41,54 41,61" fill="url(#ea-bk-blade)" stroke="hsl(214, 34%, 26%)" stroke-width="1.1" />
            <polygon points="7,82 42,67 43,74" fill="url(#ea-bk-blade)" stroke="hsl(214, 34%, 26%)" stroke-width="1.1" />
            <polygon points="116,45 87,49 88,56" fill="url(#ea-bk-blade)" stroke="hsl(214, 34%, 26%)" stroke-width="1.1" />
            <polygon points="113,68 89,64 89,71" fill="url(#ea-bk-blade)" stroke="hsl(214, 34%, 26%)" stroke-width="1.1" />
            <!-- Glowing parchment pages fanning behind cover -->
            <path d="M44 17 L90 13 L97 92 L50 96 Z" fill="hsl(42, 46%, 84%)" stroke="hsl(32, 34%, 44%)" stroke-width="1.2" />
            <path d="M47 20 L92 17 M49 90 L94 87" stroke="hsl(34, 30%, 56%)" stroke-width="1" />
            <!-- Ornate leather grimoire cover -->
            <path d="M38 20 L85 16 L92 95 L45 99 Z" fill="url(#ea-bk-cover)" stroke="hsl(44, 86%, 68%)" stroke-width="2.4" />
            <path d="M38 20 L47 22 L54 97 L45 99 Z" fill="hsl(344, 58%, 13%)" stroke="hsl(42, 72%, 52%)" stroke-width="1" />
            <!-- Spine bands & gilded corner clasps -->
            <path d="M40 34 L48 35 M42 56 L50 57 M44 78 L52 79" stroke="hsl(44, 86%, 66%)" stroke-width="2.4" stroke-linecap="round" />
            <path d="M49 24 L81 21 L87 90 L55 93 Z" fill="none" stroke="hsl(44, 80%, 62%)" stroke-width="1.3" opacity="0.78" />
            <polygon points="75,20 84,19 85,29" fill="hsl(44, 88%, 68%)" />
            <polygon points="81,91 90,91 89,81" fill="hsl(44, 88%, 68%)" />
            <!-- Malicious slit eye on cover -->
            <ellipse cx="67" cy="56" rx="15" ry="19" fill="hsl(346, 62%, 10%)" stroke="hsl(44, 92%, 70%)" stroke-width="2.2" />
            <ellipse cx="67" cy="56" rx="9" ry="12" fill="hsl(38, 100%, 60%)" class="svg-pulse" />
            <rect x="65.4" y="46" width="3.2" height="20" rx="1.6" fill="hsl(348, 78%, 12%)" />
            <circle cx="70" cy="51" r="2" fill="hsl(52, 100%, 94%)" />
          </g>
        </svg>
      `;

    case 'slaver_taskmaster':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-tm-aura" cx="50%" cy="54%" r="50%">
              <stop offset="0%" stop-color="hsla(12, 84%, 44%, 0.24)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-tm-coat" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stop-color="hsl(14, 58%, 44%)" />
              <stop offset="55%" stop-color="hsl(10, 52%, 26%)" />
              <stop offset="100%" stop-color="hsl(4, 52%, 12%)" />
            </linearGradient>
            <linearGradient id="ea-tm-iron" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(30, 26%, 62%)" />
              <stop offset="100%" stop-color="hsl(20, 28%, 22%)" />
            </linearGradient>
          </defs>
          <circle cx="56" cy="58" r="50" fill="url(#ea-tm-aura)" />
          <ellipse cx="56" cy="109" rx="40" ry="6.8" fill="hsla(0,0%,0%,0.56)" />
          <!-- Cracking barbed leather bullwhip -->
          <path d="M84 62 Q111 49 102 75 Q92 95 113 96" stroke="hsl(32, 74%, 58%)" stroke-width="3.6" stroke-linecap="round" fill="none" />
          <path d="M97 57 L101 52 M103 74 L109 73 M97 89 L103 87" stroke="hsl(40, 48%, 82%)" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="113" cy="96" r="4" fill="hsla(14, 100%, 60%, 0.4)" class="svg-pulse" />
          <circle cx="113" cy="96" r="2.2" fill="hsl(44, 100%, 72%)" />
          <g class="svg-breathe">
            <!-- Heavy studded taskmaster coat & iron pauldrons -->
            <path d="M24 42 Q56 27 86 42 L90 105 L22 105 Z" fill="url(#ea-tm-coat)" stroke="hsl(30, 70%, 60%)" stroke-width="2" />
            <path d="M22 45 Q36 31 51 44 L45 58 Q30 58 22 45 Z" fill="url(#ea-tm-iron)" stroke="hsl(34, 48%, 68%)" stroke-width="1.5" />
            <path d="M88 45 Q74 31 59 44 L65 58 Q80 58 88 45 Z" fill="url(#ea-tm-iron)" stroke="hsl(34, 48%, 68%)" stroke-width="1.5" />
            <!-- Heavy chain baldric & spiked belt -->
            <path d="M34 52 L78 88" stroke="hsl(36, 42%, 62%)" stroke-width="3.6" stroke-dasharray="5 3" stroke-linecap="round" />
            <rect x="29" y="67" width="54" height="8" rx="2" fill="hsl(22, 34%, 15%)" stroke="hsl(40, 78%, 62%)" stroke-width="1.5" />
            <circle cx="56" cy="71" r="3.4" fill="hsl(42, 88%, 64%)" />
            <!-- Horned iron executioner mask & burning eyes -->
            <path d="M36 20 Q56 10 76 20 L75 45 Q56 51 37 45 Z" fill="url(#ea-tm-iron)" stroke="hsl(36, 68%, 62%)" stroke-width="1.9" />
            <polygon points="42,19 47,8 53,19" fill="hsl(40, 42%, 82%)" stroke="hsl(24, 30%, 24%)" stroke-width="1.1" />
            <polygon points="59,19 65,8 70,19" fill="hsl(40, 42%, 82%)" stroke="hsl(24, 30%, 24%)" stroke-width="1.1" />
            <rect x="42" y="28" width="28" height="8" rx="3" fill="hsl(12, 54%, 10%)" />
            <circle cx="49" cy="32" r="4.6" fill="hsla(12, 100%, 58%, 0.36)" class="svg-pulse" />
            <circle cx="49" cy="32" r="2.8" fill="hsl(14, 100%, 66%)" />
            <circle cx="63" cy="32" r="4.6" fill="hsla(12, 100%, 58%, 0.36)" class="svg-pulse" />
            <circle cx="63" cy="32" r="2.8" fill="hsl(14, 100%, 66%)" />
            <path d="M47 40 L47 45 M56 40 L56 46 M65 40 L65 45" stroke="hsl(24, 32%, 14%)" stroke-width="1.6" />
          </g>
        </svg>
      `;

    case 'gremlin_leader':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-gl-aura" cx="55%" cy="54%" r="50%">
              <stop offset="0%" stop-color="hsla(24, 92%, 52%, 0.26)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-gl-cape" x1="0.1" y1="0" x2="0.85" y2="1">
              <stop offset="0%" stop-color="hsl(20, 68%, 48%)" />
              <stop offset="55%" stop-color="hsl(14, 60%, 30%)" />
              <stop offset="100%" stop-color="hsl(8, 56%, 14%)" />
            </linearGradient>
            <linearGradient id="ea-gl-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(48, 98%, 76%)" />
              <stop offset="55%" stop-color="hsl(38, 84%, 52%)" />
              <stop offset="100%" stop-color="hsl(28, 72%, 28%)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="58" r="52" fill="url(#ea-gl-aura)" />
          <ellipse cx="60" cy="109" rx="42" ry="6.8" fill="hsla(0,0%,0%,0.56)" />
          <!-- Tattered crimson war-standard banner -->
          <line x1="22" y1="10" x2="22" y2="105" stroke="url(#ea-gl-gold)" stroke-width="3.8" stroke-linecap="round" />
          <polygon points="22,6 26,13 18,13" fill="url(#ea-gl-gold)" />
          <path d="M22 16 L50 24 L43 32 L50 40 L22 44 Z" fill="hsl(4, 82%, 46%)" stroke="url(#ea-gl-gold)" stroke-width="1.5" />
          <polygon points="33,24 38,30 33,36 28,30" fill="hsl(48, 98%, 74%)" />
          <!-- Curved gilded commander scimitar -->
          <path d="M84 56 Q107 38 110 16 Q94 23 78 48 Z" fill="hsl(40, 38%, 90%)" stroke="url(#ea-gl-gold)" stroke-width="1.5" />
          <path d="M85 49 Q98 35 106 20" stroke="hsla(0,0%,100%,0.65)" stroke-width="1.3" fill="none" />
          <g class="svg-breathe">
            <!-- Armored warlord mantle & plated cuirass -->
            <path d="M33 46 Q60 33 87 46 L92 105 L28 105 Z" fill="url(#ea-gl-cape)" stroke="hsl(42, 78%, 64%)" stroke-width="2" />
            <path d="M39 50 L81 50 L75 90 L45 90 Z" fill="hsl(14, 48%, 17%)" stroke="hsl(36, 56%, 44%)" stroke-width="1.2" />
            <path d="M44 58 L60 66 L76 58 M45 70 L75 70" stroke="url(#ea-gl-gold)" stroke-width="3" fill="none" stroke-linecap="round" />
            <!-- Long goblin ears & jagged golden war-crown -->
            <polygon points="44,32 29,24 39,40" fill="url(#ea-gl-cape)" stroke="hsl(38, 66%, 56%)" stroke-width="1.2" />
            <polygon points="76,32 91,24 81,40" fill="url(#ea-gl-cape)" stroke="hsl(38, 66%, 56%)" stroke-width="1.2" />
            <polygon points="41,26 47,10 55,21 60,7 65,21 73,10 79,26" fill="url(#ea-gl-gold)" stroke="hsl(26, 48%, 22%)" stroke-width="1.3" />
            <circle cx="60" cy="19" r="2.2" fill="hsl(354, 92%, 58%)" />
            <rect x="43" y="25" width="34" height="23" rx="7" fill="url(#ea-gl-cape)" stroke="hsl(44, 78%, 64%)" stroke-width="1.8" />
            <circle cx="52.5" cy="35" r="4.4" fill="hsla(48, 100%, 66%, 0.35)" class="svg-pulse" />
            <circle cx="52.5" cy="35" r="2.8" fill="hsl(48, 100%, 70%)" />
            <circle cx="67.5" cy="35" r="4.4" fill="hsla(48, 100%, 66%, 0.35)" class="svg-pulse" />
            <circle cx="67.5" cy="35" r="2.8" fill="hsl(48, 100%, 70%)" />
            <path d="M51 43 L54 40 L57 43 L60 40 L63 43 L66 40 L69 43" stroke="hsl(44, 58%, 92%)" stroke-width="1.5" fill="none" />
          </g>
        </svg>
      `;

    // =========================================================================
    // ACT 2 BOSSES
    // =========================================================================
    case 'bronze_automaton':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg boss-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-ba-aura" cx="50%" cy="58%" r="54%">
              <stop offset="0%" stop-color="hsla(190, 96%, 58%, 0.3)" />
              <stop offset="65%" stop-color="hsla(40, 86%, 46%, 0.12)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-ba-brass" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stop-color="hsl(44, 72%, 64%)" />
              <stop offset="48%" stop-color="hsl(35, 56%, 40%)" />
              <stop offset="100%" stop-color="hsl(25, 48%, 16%)" />
            </linearGradient>
            <radialGradient id="ea-ba-beam" cx="46%" cy="44%" r="54%">
              <stop offset="0%" stop-color="hsl(52, 100%, 96%)" />
              <stop offset="48%" stop-color="hsl(188, 98%, 62%)" />
              <stop offset="100%" stop-color="hsl(206, 88%, 24%)" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="56" fill="url(#ea-ba-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="111" rx="48" ry="7.2" fill="hsla(0,0%,0%,0.58)" />
          <ellipse cx="60" cy="111" rx="53" ry="8.8" fill="none" stroke="hsla(188, 96%, 68%, 0.48)" stroke-width="1.3" stroke-dasharray="8 5" />
          <!-- Twin hovering bronze sentry orbs with tether arcs -->
          <g class="svg-float">
            <path d="M22 44 Q30 48 34 52 M98 44 Q90 48 86 52" stroke="hsla(188, 96%, 68%, 0.56)" stroke-width="1.5" stroke-dasharray="3 3" fill="none" />
            <circle cx="15" cy="40" r="10" fill="url(#ea-ba-brass)" stroke="hsl(188, 96%, 72%)" stroke-width="2" />
            <circle cx="15" cy="40" r="4.5" fill="url(#ea-ba-beam)" />
            <circle cx="105" cy="40" r="10" fill="url(#ea-ba-brass)" stroke="hsl(188, 96%, 72%)" stroke-width="2" />
            <circle cx="105" cy="40" r="4.5" fill="url(#ea-ba-beam)" />
          </g>
          <g class="svg-breathe">
            <!-- Ornate back gear halo -->
            <circle cx="60" cy="46" r="34" fill="none" stroke="hsl(42, 68%, 54%)" stroke-width="3" stroke-dasharray="6 6" opacity="0.48" class="svg-spin-slow" />
            <!-- Colossal broad-shouldered clockwork colossus -->
            <polygon points="22,31 98,31 87,104 33,104" fill="url(#ea-ba-brass)" stroke="hsl(48, 90%, 76%)" stroke-width="2.4" />
            <polygon points="22,31 60,31 60,104 33,104" fill="hsla(48, 96%, 88%, 0.14)" />
            <!-- Articulated bronze shoulder guards & rivets -->
            <path d="M18 34 L34 26 L38 48 L22 50 Z" fill="url(#ea-ba-brass)" stroke="hsl(46, 86%, 74%)" stroke-width="1.6" />
            <path d="M102 34 L86 26 L82 48 L98 50 Z" fill="url(#ea-ba-brass)" stroke="hsl(46, 86%, 74%)" stroke-width="1.6" />
            <!-- Crowned automaton head & blazing visor -->
            <polygon points="48,15 60,7 72,15" fill="hsl(46, 88%, 68%)" stroke="hsl(28, 46%, 22%)" stroke-width="1.2" />
            <rect x="43" y="14" width="34" height="19" rx="5" fill="url(#ea-ba-brass)" stroke="hsl(48, 90%, 76%)" stroke-width="2" />
            <rect x="48" y="20.5" width="24" height="6" rx="2.5" fill="hsl(214, 48%, 12%)" />
            <rect x="50" y="22" width="20" height="3" rx="1.5" fill="hsl(188, 100%, 72%)" class="svg-pulse" />
            <!-- Hyperbeam chest core with filigree ring -->
            <circle cx="60" cy="64" r="20" fill="hsl(218, 46%, 12%)" stroke="hsl(46, 88%, 72%)" stroke-width="2.6" />
            <circle cx="60" cy="64" r="15.5" fill="none" stroke="hsl(188, 92%, 68%)" stroke-width="1.3" stroke-dasharray="4 3" class="svg-spin-slow" />
            <circle cx="60" cy="64" r="12.5" fill="url(#ea-ba-beam)" class="svg-pulse" />
            <circle cx="60" cy="64" r="4.8" fill="hsl(0, 0%, 100%)" />
            <!-- Riveted waist plates -->
            <path d="M37 89 L83 89 M39 96 L81 96" stroke="hsl(24, 46%, 16%)" stroke-width="2.4" />
            <circle cx="44" cy="92.5" r="1.4" fill="hsl(48, 94%, 78%)" /><circle cx="60" cy="92.5" r="1.4" fill="hsl(48, 94%, 78%)" /><circle cx="76" cy="92.5" r="1.4" fill="hsl(48, 94%, 78%)" />
          </g>
        </svg>
      `;

    case 'the_collector':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg boss-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-tc-aura" cx="50%" cy="54%" r="54%">
              <stop offset="0%" stop-color="hsla(156, 92%, 48%, 0.28)" />
              <stop offset="65%" stop-color="hsla(276, 72%, 34%, 0.14)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-tc-cloak" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stop-color="hsl(270, 58%, 40%)" />
              <stop offset="55%" stop-color="hsl(262, 54%, 22%)" />
              <stop offset="100%" stop-color="hsl(252, 58%, 10%)" />
            </linearGradient>
            <linearGradient id="ea-tc-fire" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="hsl(164, 96%, 44%)" />
              <stop offset="55%" stop-color="hsl(152, 98%, 68%)" />
              <stop offset="100%" stop-color="hsl(142, 100%, 92%)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="58" r="56" fill="url(#ea-tc-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="111" rx="46" ry="7.2" fill="hsla(0,0%,0%,0.58)" />
          <ellipse cx="60" cy="111" rx="53" ry="8.8" fill="none" stroke="hsla(156, 94%, 62%, 0.46)" stroke-width="1.3" stroke-dasharray="6 4" />
          <!-- Twin towering gothic soul-braziers -->
          <rect x="17" y="34" width="13" height="70" rx="3" fill="hsl(260, 42%, 16%)" stroke="hsl(160, 76%, 56%)" stroke-width="1.6" />
          <path d="M14 34 L33 34 L30 41 L17 41 Z" fill="hsl(44, 78%, 54%)" stroke="hsl(28, 48%, 22%)" stroke-width="1.1" />
          <rect x="90" y="34" width="13" height="70" rx="3" fill="hsl(260, 42%, 16%)" stroke="hsl(160, 76%, 56%)" stroke-width="1.6" />
          <path d="M87 34 L106 34 L103 41 L90 41 Z" fill="hsl(44, 78%, 54%)" stroke="hsl(28, 48%, 22%)" stroke-width="1.1" />
          <g class="svg-float">
            <path d="M23.5 9 Q33 23 23.5 35 Q14 23 23.5 9 Z" fill="url(#ea-tc-fire)" />
            <path d="M96.5 9 Q106 23 96.5 35 Q87 23 96.5 9 Z" fill="url(#ea-tc-fire)" />
            <circle cx="38" cy="19" r="2.2" fill="hsl(154, 100%, 74%)" opacity="0.85" />
            <circle cx="82" cy="19" r="2.2" fill="hsl(154, 100%, 74%)" opacity="0.85" />
          </g>
          <g class="svg-breathe">
            <!-- Royal necromancer cloak with embroidered gold trim -->
            <path d="M30 42 Q60 28 90 42 L96 105 Q78 100 60 107 Q42 100 24 105 Z" fill="url(#ea-tc-cloak)" stroke="hsl(280, 72%, 66%)" stroke-width="2" />
            <path d="M36 46 Q60 36 84 46" stroke="hsla(286, 94%, 84%, 0.5)" stroke-width="1.7" fill="none" />
            <path d="M45 45 L60 100 L75 45" fill="none" stroke="hsl(46, 88%, 66%)" stroke-width="2.2" opacity="0.88" />
            <polygon points="60,64 67,74 60,84 53,74" fill="hsl(158, 94%, 56%)" stroke="hsl(46, 92%, 72%)" stroke-width="1.4" class="svg-pulse" />
            <!-- Horned golden monarch crown & abyssal shadow visage -->
            <polygon points="41,25 47,7 55,19 60,6 65,19 73,7 79,25" fill="hsl(46, 94%, 66%)" stroke="hsl(28, 48%, 22%)" stroke-width="1.3" />
            <ellipse cx="60" cy="36" rx="15" ry="14" fill="hsl(262, 58%, 9%)" stroke="hsl(284, 68%, 62%)" stroke-width="1.9" />
            <circle cx="53.5" cy="35" r="5.2" fill="hsla(154, 100%, 64%, 0.38)" class="svg-pulse" />
            <circle cx="53.5" cy="35" r="3.2" fill="hsl(152, 100%, 72%)" />
            <circle cx="66.5" cy="35" r="5.2" fill="hsla(154, 100%, 64%, 0.38)" class="svg-pulse" />
            <circle cx="66.5" cy="35" r="3.2" fill="hsl(152, 100%, 72%)" />
          </g>
        </svg>
      `;

    case 'the_champ':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg boss-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-ch-aura" cx="52%" cy="54%" r="54%">
              <stop offset="0%" stop-color="hsla(42, 92%, 56%, 0.24)" />
              <stop offset="65%" stop-color="hsla(4, 82%, 40%, 0.12)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-ch-steel" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stop-color="hsl(214, 30%, 74%)" />
              <stop offset="52%" stop-color="hsl(216, 26%, 44%)" />
              <stop offset="100%" stop-color="hsl(222, 30%, 18%)" />
            </linearGradient>
            <linearGradient id="ea-ch-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(48, 98%, 78%)" />
              <stop offset="55%" stop-color="hsl(38, 86%, 52%)" />
              <stop offset="100%" stop-color="hsl(28, 72%, 28%)" />
            </linearGradient>
            <linearGradient id="ea-ch-cape" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stop-color="hsl(6, 82%, 48%)" />
              <stop offset="55%" stop-color="hsl(358, 74%, 30%)" />
              <stop offset="100%" stop-color="hsl(350, 72%, 14%)" />
            </linearGradient>
          </defs>
          <circle cx="58" cy="58" r="56" fill="url(#ea-ch-aura)" />
          <ellipse cx="60" cy="111" rx="48" ry="7.2" fill="hsla(0,0%,0%,0.58)" />
          <ellipse cx="60" cy="111" rx="53" ry="8.8" fill="none" stroke="hsla(44, 96%, 68%, 0.48)" stroke-width="1.3" stroke-dasharray="8 4" />
          <!-- Sweeping royal arena crimson cape -->
          <path d="M22 44 L10 104 L30 99 L44 105 L74 105 L90 99 L106 104 L94 44 Z" fill="url(#ea-ch-cape)" stroke="url(#ea-ch-gold)" stroke-width="1.6" />
          <g class="svg-breathe">
            <!-- Plated gladiator cuirass & spiked pauldrons -->
            <path d="M29 42 Q58 31 87 42 L83 102 L33 102 Z" fill="url(#ea-ch-steel)" stroke="hsl(212, 42%, 84%)" stroke-width="2" />
            <path d="M35 46 Q58 38 81 46" stroke="hsla(0,0%,100%,0.55)" stroke-width="1.7" fill="none" />
            <path d="M18 48 Q28 33 43 43 L38 59 Q24 60 18 48 Z" fill="url(#ea-ch-steel)" stroke="url(#ea-ch-gold)" stroke-width="1.6" />
            <path d="M98 48 Q88 33 73 43 L78 59 Q92 60 98 48 Z" fill="url(#ea-ch-steel)" stroke="url(#ea-ch-gold)" stroke-width="1.6" />
            <!-- Battle scar across breastplate & gilded Champion's Belt -->
            <path d="M44 50 L68 65" stroke="hsl(222, 32%, 16%)" stroke-width="2.2" stroke-linecap="round" />
            <rect x="32" y="70" width="52" height="12" rx="3" fill="url(#ea-ch-gold)" stroke="hsl(26, 46%, 20%)" stroke-width="1.5" />
            <polygon points="58,68 65,76 58,84 51,76" fill="hsl(4, 88%, 52%)" stroke="hsl(48, 98%, 84%)" stroke-width="1.4" />
            <!-- Crowned arena war-helm with crimson crest plume -->
            <path d="M58 4 Q42 8 38 20 Q52 14 58 14 Q64 14 78 20 Q74 8 58 4 Z" fill="url(#ea-ch-cape)" stroke="hsl(44, 82%, 64%)" stroke-width="1" />
            <polygon points="42,22 49,7 58,17 67,7 74,22" fill="url(#ea-ch-gold)" stroke="hsl(26, 48%, 22%)" stroke-width="1.3" />
            <rect x="41" y="20" width="34" height="25" rx="7" fill="url(#ea-ch-steel)" stroke="url(#ea-ch-gold)" stroke-width="1.9" />
            <rect x="46" y="29" width="24" height="7" rx="2.5" fill="hsl(224, 48%, 10%)" />
            <circle cx="52.5" cy="32.5" r="2.6" fill="hsl(46, 100%, 70%)" class="svg-pulse" />
            <circle cx="63.5" cy="32.5" r="2.6" fill="hsl(46, 100%, 70%)" class="svg-pulse" />
          </g>
          <!-- Colossal double-edged arena greatsword -->
          <path d="M97 10 L106 6 L104 79 L92 79 Z" fill="hsl(212, 32%, 90%)" stroke="hsl(216, 26%, 30%)" stroke-width="1.5" />
          <path d="M100 13 L98 75" stroke="hsla(0,0%,100%,0.82)" stroke-width="1.9" />
          <path d="M84 76 Q98 72 112 76 L110 83 Q98 81 86 83 Z" fill="url(#ea-ch-gold)" stroke="hsl(26, 46%, 22%)" stroke-width="1.3" />
          <rect x="94.5" y="83" width="7" height="15" rx="2" fill="hsl(10, 56%, 26%)" stroke="url(#ea-ch-gold)" stroke-width="1" />
          <circle cx="98" cy="100" r="4.5" fill="url(#ea-ch-gold)" stroke="hsl(26, 46%, 22%)" stroke-width="1.2" />
          <circle cx="109" cy="24" r="1.9" fill="hsl(48, 100%, 82%)" opacity="0.85" class="svg-float" />
          <circle cx="18" cy="34" r="1.8" fill="hsl(16, 100%, 64%)" opacity="0.78" class="svg-float" />
        </svg>
      `;

    // =========================================================================
    // ACT 3 NORMAL ENEMIES
    // =========================================================================
    case 'orb_walker':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-ow-core" cx="44%" cy="40%" r="58%">
              <stop offset="0%" stop-color="hsl(48, 100%, 84%)" />
              <stop offset="50%" stop-color="hsl(16, 94%, 54%)" />
              <stop offset="100%" stop-color="hsl(354, 72%, 22%)" />
            </radialGradient>
            <linearGradient id="ea-ow-leg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(40, 58%, 62%)" />
              <stop offset="100%" stop-color="hsl(28, 42%, 26%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="38" ry="6" fill="hsla(0,0%,0%,0.5)" />
          <!-- Mechanical bronze spider-walker legs -->
          <path d="M44 68 L26 102 M76 68 L94 102 M42 40 L26 24 M78 40 L94 24" stroke="url(#ea-ow-leg)" stroke-width="5.2" stroke-linecap="round" />
          <!-- Outer brass chassis & blazing volcanic orb -->
          <circle cx="60" cy="54" r="27" fill="hsl(28, 36%, 20%)" stroke="hsl(42, 78%, 64%)" stroke-width="2.6" />
          <circle cx="60" cy="54" r="19" fill="url(#ea-ow-core)" />
          <circle cx="60" cy="54" r="7" fill="hsl(52, 100%, 92%)" />
          <circle cx="26" cy="24" r="3.5" fill="hsl(18, 96%, 60%)" />
          <circle cx="94" cy="24" r="3.5" fill="hsl(18, 96%, 60%)" />
        </svg>
      `;

    case 'spiker':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-sk-body" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stop-color="hsl(198, 86%, 72%)" />
              <stop offset="55%" stop-color="hsl(206, 72%, 40%)" />
              <stop offset="100%" stop-color="hsl(220, 62%, 18%)" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="109" rx="32" ry="5.5" fill="hsla(0,0%,0%,0.48)" />
          <!-- 8-point crystalline thorn star -->
          <polygon points="60,8 70,34 98,22 86,48 112,58 86,68 98,94 70,82 60,108 50,82 22,94 34,68 8,58 34,48 22,22 50,34" fill="url(#ea-sk-body)" stroke="hsl(192, 96%, 80%)" stroke-width="2" />
          <circle cx="60" cy="58" r="16" fill="hsl(222, 52%, 14%)" stroke="hsl(194, 92%, 72%)" stroke-width="2" />
          <circle cx="60" cy="58" r="8" fill="hsl(192, 100%, 74%)" />
          <circle cx="60" cy="58" r="3.5" fill="hsl(0, 0%, 100%)" />
        </svg>
      `;

    case 'exploder':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-ex-bomb" cx="44%" cy="40%" r="58%">
              <stop offset="0%" stop-color="hsl(22, 82%, 48%)" />
              <stop offset="65%" stop-color="hsl(8, 66%, 26%)" />
              <stop offset="100%" stop-color="hsl(354, 58%, 14%)" />
            </radialGradient>
            <radialGradient id="ea-ex-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="hsl(54, 100%, 92%)" />
              <stop offset="60%" stop-color="hsl(28, 98%, 58%)" />
              <stop offset="100%" stop-color="hsl(6, 92%, 42%)" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="109" rx="34" ry="5.5" fill="hsla(0,0%,0%,0.5)" />
          <!-- Burning fuse & sparks -->
          <path d="M60 24 Q64 12 78 14" stroke="hsl(38, 86%, 66%)" stroke-width="3.2" stroke-linecap="round" fill="none" />
          <circle cx="80" cy="14" r="5" fill="hsla(46, 100%, 66%, 0.4)" />
          <circle cx="80" cy="14" r="2.6" fill="hsl(54, 100%, 84%)" />
          <!-- Octagonal blast shell -->
          <polygon points="44,24 76,24 94,42 94,74 76,92 44,92 26,74 26,42" fill="url(#ea-ex-bomb)" stroke="hsl(24, 92%, 64%)" stroke-width="2.4" />
          <!-- Glowing fissure lines & volatile furnace core -->
          <path d="M60 28 L60 88 M30 58 L90 58" stroke="hsl(32, 98%, 62%)" stroke-width="2.2" opacity="0.7" />
          <circle cx="60" cy="58" r="18" fill="url(#ea-ex-core)" stroke="hsl(48, 98%, 78%)" stroke-width="1.8" />
          <circle cx="60" cy="58" r="6" fill="hsl(0, 0%, 100%)" />
        </svg>
      `;

    case 'repulsor':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-rp-gem" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(286, 76%, 62%)" />
              <stop offset="100%" stop-color="hsl(260, 68%, 24%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="34" ry="5.5" fill="hsla(0,0%,0%,0.48)" />
          <!-- Magnetic repulsor orbit rings -->
          <ellipse cx="60" cy="56" rx="44" ry="15" transform="rotate(-28 60 56)" fill="none" stroke="hsl(46, 94%, 66%)" stroke-width="2.2" />
          <ellipse cx="60" cy="56" rx="44" ry="15" transform="rotate(28 60 56)" fill="none" stroke="hsl(288, 88%, 72%)" stroke-width="2.2" />
          <!-- Floating crystal prism -->
          <polygon points="60,16 86,56 60,96 34,56" fill="url(#ea-rp-gem)" stroke="hsl(292, 90%, 78%)" stroke-width="2.2" />
          <polygon points="60,16 86,56 60,56" fill="hsla(292, 100%, 88%, 0.2)" />
          <circle cx="60" cy="56" r="10" fill="hsl(46, 100%, 72%)" />
          <circle cx="60" cy="56" r="4.5" fill="hsl(0, 0%, 100%)" />
          <circle cx="22" cy="38" r="3" fill="hsl(46, 100%, 72%)" />
          <circle cx="98" cy="74" r="3" fill="hsl(290, 96%, 76%)" />
        </svg>
      `;

    case 'maw':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-mw-skin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(282, 48%, 40%)" />
              <stop offset="100%" stop-color="hsl(268, 52%, 18%)" />
            </linearGradient>
            <radialGradient id="ea-mw-gullet" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stop-color="hsl(344, 72%, 34%)" />
              <stop offset="100%" stop-color="hsl(332, 68%, 10%)" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="44" ry="7" fill="hsla(0,0%,0%,0.54)" />
          <!-- Curved bone horns -->
          <path d="M32 34 Q18 10 34 14 Q42 22 44 32 Z" fill="hsl(42, 62%, 74%)" stroke="hsl(28, 36%, 28%)" stroke-width="1.4" />
          <path d="M88 34 Q102 10 86 14 Q78 22 76 32 Z" fill="hsl(42, 62%, 74%)" stroke="hsl(28, 36%, 28%)" stroke-width="1.4" />
          <!-- Hulking abyssal head-body -->
          <path d="M20 42 Q60 22 100 42 L94 98 Q60 108 26 98 Z" fill="url(#ea-mw-skin)" stroke="hsl(294, 68%, 64%)" stroke-width="2.2" />
          <!-- Glowing slit eyes -->
          <circle cx="43" cy="48" r="5" fill="hsla(48, 98%, 62%, 0.3)" />
          <circle cx="43" cy="48" r="3" fill="hsl(48, 100%, 66%)" />
          <circle cx="77" cy="48" r="5" fill="hsla(48, 98%, 62%, 0.3)" />
          <circle cx="77" cy="48" r="3" fill="hsl(48, 100%, 66%)" />
          <!-- Enormous abyssal gullet with double rows of fangs -->
          <ellipse cx="60" cy="77" rx="28" ry="19" fill="url(#ea-mw-gullet)" stroke="hsl(320, 62%, 44%)" stroke-width="2" />
          <polygon points="38,63 43,75 48,62" fill="hsl(44, 62%, 92%)" />
          <polygon points="50,60 55,74 60,60" fill="hsl(44, 62%, 92%)" />
          <polygon points="62,60 67,74 72,60" fill="hsl(44, 62%, 92%)" />
          <polygon points="74,62 78,74 82,64" fill="hsl(44, 62%, 92%)" />
          <polygon points="44,93 49,81 54,94" fill="hsl(44, 62%, 92%)" />
          <polygon points="56,95 61,82 66,95" fill="hsl(44, 62%, 92%)" />
          <polygon points="68,94 73,81 78,92" fill="hsl(44, 62%, 92%)" />
        </svg>
      `;

    // =========================================================================
    // ACT 3 ELITES
    // =========================================================================
    case 'giant_head':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-gh-aura" cx="50%" cy="54%" r="52%">
              <stop offset="0%" stop-color="hsla(192, 92%, 58%, 0.24)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-gh-stone" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stop-color="hsl(214, 22%, 62%)" />
              <stop offset="52%" stop-color="hsl(220, 20%, 36%)" />
              <stop offset="100%" stop-color="hsl(226, 24%, 15%)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="58" r="52" fill="url(#ea-gh-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="110" rx="44" ry="6.8" fill="hsla(0,0%,0%,0.58)" />
          <!-- Levitating chipped basalt rubble -->
          <g class="svg-float">
            <polygon points="12,50 18,44 21,53 14,56" fill="hsl(216, 18%, 44%)" stroke="hsl(192, 82%, 66%)" stroke-width="0.9" />
            <polygon points="102,40 109,35 111,45 104,47" fill="hsl(216, 18%, 44%)" stroke="hsl(192, 82%, 66%)" stroke-width="0.9" />
            <polygon points="16,84 22,80 23,88 17,90" fill="hsl(220, 18%, 34%)" />
          </g>
          <g class="svg-breathe">
            <!-- Monumental carved stone monolith head -->
            <path d="M24 22 Q60 9 96 22 L91 99 Q60 110 29 99 Z" fill="url(#ea-gh-stone)" stroke="hsl(210, 28%, 76%)" stroke-width="2.4" />
            <path d="M26 24 Q60 12 94 24" stroke="hsla(204, 80%, 92%, 0.45)" stroke-width="1.6" fill="none" />
            <path d="M60 13 L94 24 L89 98 L60 108 Z" fill="hsla(226, 40%, 8%, 0.22)" />
            <!-- Chiseled heavy brow, nose bridge & cheekbones -->
            <path d="M32 39 L88 39" stroke="hsl(224, 28%, 14%)" stroke-width="4.6" stroke-linecap="round" />
            <path d="M60 39 L60 73 L52 73" stroke="hsl(224, 28%, 14%)" stroke-width="3.6" stroke-linecap="round" fill="none" />
            <path d="M34 62 Q44 68 50 64 M86 62 Q76 68 70 64" stroke="hsl(224, 24%, 18%)" stroke-width="1.8" fill="none" />
            <!-- Luminous glowing rune fissures -->
            <path d="M28 67 L41 74 L34 86 M90 56 L77 65 L83 75 M46 18 L52 27 L48 34" stroke="hsl(192, 98%, 68%)" stroke-width="1.8" fill="none" class="svg-pulse" />
            <!-- Deep recessed eyes with icy cyan pupils -->
            <rect x="38" y="45" width="16" height="8.5" rx="2.8" fill="hsl(224, 42%, 10%)" stroke="hsl(214, 24%, 44%)" stroke-width="1" />
            <rect x="66" y="45" width="16" height="8.5" rx="2.8" fill="hsl(224, 42%, 10%)" stroke="hsl(214, 24%, 44%)" stroke-width="1" />
            <circle cx="46" cy="49.2" r="4.6" fill="hsla(192, 100%, 66%, 0.35)" class="svg-pulse" />
            <circle cx="46" cy="49.2" r="2.8" fill="hsl(190, 100%, 74%)" />
            <circle cx="74" cy="49.2" r="4.6" fill="hsla(192, 100%, 66%, 0.35)" class="svg-pulse" />
            <circle cx="74" cy="49.2" r="2.8" fill="hsl(190, 100%, 74%)" />
            <!-- Solemn carved monolith mouth -->
            <path d="M41 84 L79 84" stroke="hsl(224, 30%, 12%)" stroke-width="4.6" stroke-linecap="round" />
            <path d="M46 89 L74 89" stroke="hsl(214, 22%, 52%)" stroke-width="1.4" stroke-linecap="round" opacity="0.65" />
          </g>
        </svg>
      `;

    case 'nemesis':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-nm-aura" cx="50%" cy="54%" r="52%">
              <stop offset="0%" stop-color="hsla(352, 92%, 52%, 0.24)" />
              <stop offset="65%" stop-color="hsla(276, 78%, 36%, 0.14)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-nm-shroud" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stop-color="hsl(274, 48%, 40%)" />
              <stop offset="55%" stop-color="hsl(266, 52%, 22%)" />
              <stop offset="100%" stop-color="hsl(258, 60%, 8%)" />
            </linearGradient>
            <linearGradient id="ea-nm-scythe" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(356, 100%, 76%)" />
              <stop offset="55%" stop-color="hsl(348, 92%, 52%)" />
              <stop offset="100%" stop-color="hsl(334, 84%, 26%)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="58" r="54" fill="url(#ea-nm-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="110" rx="38" ry="6" fill="hsla(276, 68%, 10%, 0.62)" />
          <g class="svg-float">
            <!-- Sweeping spectral crimson crescent scythe -->
            <line x1="25" y1="20" x2="91" y2="102" stroke="hsl(274, 34%, 58%)" stroke-width="3.8" stroke-linecap="round" />
            <path d="M12 44 Q45 5 96 20 Q56 19 25 51 Z" fill="url(#ea-nm-scythe)" stroke="hsl(358, 100%, 86%)" stroke-width="1.5" />
            <path d="M22 38 Q48 14 86 21" stroke="hsla(0,0%,100%,0.55)" stroke-width="1.3" fill="none" />
            <!-- Ethereal smoky reaper shroud & tattered hem -->
            <path d="M33 43 Q60 18 87 43 L97 103 L82 95 L72 106 L60 97 L48 106 L38 95 L23 103 Z" fill="url(#ea-nm-shroud)" stroke="hsl(286, 76%, 70%)" stroke-width="2" />
            <path d="M40 58 Q36 78 32 95 M80 58 Q84 78 88 95" stroke="hsla(0,0%,0%,0.42)" stroke-width="2.2" fill="none" />
            <!-- Spectral bone ribs peeking through shroud -->
            <path d="M49 62 Q60 67 71 62 M51 70 Q60 74 69 70 M53 78 Q60 81 67 78" stroke="hsla(44, 42%, 86%, 0.45)" stroke-width="1.8" stroke-linecap="round" fill="none" />
            <!-- Detailed bone skull visage & glowing crimson eye sockets -->
            <path d="M46 36 Q46 21 60 21 Q74 21 74 36 Q74 47 67 51 L53 51 Q46 47 46 36 Z" fill="hsl(44, 42%, 90%)" stroke="hsl(276, 40%, 22%)" stroke-width="1.8" />
            <path d="M50 34 L58 37 L51 41 Z M70 34 L62 37 L69 41 Z" fill="hsl(354, 100%, 56%)" class="svg-pulse" />
            <path d="M58 41 L60 44 L62 41 Z" fill="hsl(276, 42%, 20%)" />
            <path d="M54 47 L54 51 M58 47 L58 51 M62 47 L62 51 M66 47 L66 51" stroke="hsl(276, 40%, 24%)" stroke-width="1.3" />
          </g>
        </svg>
      `;

    case 'reptomancer':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-rm-aura" cx="52%" cy="54%" r="52%">
              <stop offset="0%" stop-color="hsla(148, 86%, 44%, 0.24)" />
              <stop offset="65%" stop-color="hsla(290, 82%, 44%, 0.12)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-rm-robe" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stop-color="hsl(150, 58%, 42%)" />
              <stop offset="55%" stop-color="hsl(160, 56%, 24%)" />
              <stop offset="100%" stop-color="hsl(170, 60%, 10%)" />
            </linearGradient>
            <linearGradient id="ea-rm-dag" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stop-color="hsl(300, 100%, 86%)" />
              <stop offset="55%" stop-color="hsl(288, 90%, 60%)" />
              <stop offset="100%" stop-color="hsl(270, 78%, 34%)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="58" r="54" fill="url(#ea-rm-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="110" rx="40" ry="6.2" fill="hsla(0,0%,0%,0.56)" />
          <!-- Coiled golden serpent staff -->
          <line x1="20" y1="22" x2="25" y2="104" stroke="hsl(42, 72%, 58%)" stroke-width="4.2" stroke-linecap="round" />
          <path d="M12 24 Q20 10 30 20 Q23 30 12 24 Z" fill="hsl(134, 92%, 58%)" stroke="hsl(46, 94%, 72%)" stroke-width="1.4" />
          <circle cx="21" cy="19" r="1.8" fill="hsl(48, 100%, 74%)" />
          <!-- Twin orbiting arcane crystal daggers -->
          <g class="svg-float">
            <polygon points="100,18 107,37 100,56 93,37" fill="url(#ea-rm-dag)" stroke="hsl(48, 96%, 82%)" stroke-width="1.3" />
            <line x1="100" y1="23" x2="100" y2="51" stroke="hsla(0,0%,100%,0.65)" stroke-width="1.2" />
            <polygon points="106,62 111,74 106,86 101,74" fill="url(#ea-rm-dag)" stroke="hsl(48, 96%, 82%)" stroke-width="1.1" opacity="0.88" />
          </g>
          <g class="svg-breathe">
            <!-- Scaled emerald cobra mantle & gilded ritual sash -->
            <path d="M32 44 Q60 30 88 44 L94 105 L26 105 Z" fill="url(#ea-rm-robe)" stroke="hsl(144, 74%, 60%)" stroke-width="2" />
            <path d="M43 46 L60 98 L77 46" fill="none" stroke="hsl(46, 88%, 64%)" stroke-width="2.2" opacity="0.88" />
            <path d="M48 64 L60 72 L72 64 M45 78 L60 86 L75 78" stroke="hsla(142, 86%, 68%, 0.35)" stroke-width="1.4" fill="none" />
            <!-- Flared cobra-crest hood & glowing golden serpent eyes -->
            <path d="M35 43 Q40 11 60 11 Q80 11 85 43 Q60 54 35 43 Z" fill="url(#ea-rm-robe)" stroke="hsl(142, 78%, 64%)" stroke-width="1.9" />
            <path d="M42 20 Q60 13 78 20" stroke="hsla(46, 94%, 76%, 0.55)" stroke-width="1.4" fill="none" />
            <ellipse cx="60" cy="35" rx="12" ry="10" fill="hsl(168, 60%, 8%)" />
            <ellipse cx="54.5" cy="35" rx="3.5" ry="2.4" fill="hsl(48, 100%, 68%)" class="svg-pulse" />
            <ellipse cx="65.5" cy="35" rx="3.5" ry="2.4" fill="hsl(48, 100%, 68%)" class="svg-pulse" />
            <line x1="54.5" y1="33" x2="54.5" y2="37" stroke="hsl(166, 62%, 10%)" stroke-width="1.1" />
            <line x1="65.5" y1="33" x2="65.5" y2="37" stroke="hsl(166, 62%, 10%)" stroke-width="1.1" />
          </g>
        </svg>
      `;

    case 'dagger':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-dg-blade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(300, 100%, 92%)" />
              <stop offset="50%" stop-color="hsl(288, 90%, 64%)" />
              <stop offset="100%" stop-color="hsl(268, 78%, 32%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="107" rx="24" ry="5" fill="hsla(286, 74%, 16%, 0.54)" />
          <g class="svg-float">
            <!-- Arcane glow halo -->
            <polygon points="60,6 81,66 60,78 39,66" fill="hsla(292, 98%, 68%, 0.24)" class="svg-pulse" />
            <!-- Levitating runic crystal blade -->
            <polygon points="60,10 73,66 60,73 47,66" fill="url(#ea-dg-blade)" stroke="hsl(300, 100%, 90%)" stroke-width="1.8" />
            <line x1="60" y1="16" x2="60" y2="67" stroke="hsl(0, 0%, 100%)" stroke-width="2" opacity="0.78" />
            <path d="M55 34 L65 34 M53 48 L67 48" stroke="hsl(48, 100%, 82%)" stroke-width="1.2" opacity="0.7" />
            <!-- Gilded crossguard & pommel -->
            <rect x="40" y="68" width="40" height="7.5" rx="3" fill="hsl(46, 94%, 64%)" stroke="hsl(28, 48%, 24%)" stroke-width="1.4" />
            <rect x="55.5" y="75.5" width="9" height="18" rx="2" fill="hsl(276, 52%, 30%)" stroke="hsl(44, 86%, 68%)" stroke-width="1.2" />
            <circle cx="60" cy="97" r="5" fill="hsl(48, 100%, 72%)" stroke="hsl(28, 48%, 24%)" stroke-width="1.2" />
          </g>
        </svg>
      `;

    // =========================================================================
    // ACT 3 BOSSES
    // =========================================================================
    case 'time_eater':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg boss-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-te-aura" cx="56%" cy="54%" r="54%">
              <stop offset="0%" stop-color="hsla(192, 94%, 56%, 0.3)" />
              <stop offset="65%" stop-color="hsla(276, 70%, 34%, 0.14)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-te-cloak" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stop-color="hsl(206, 58%, 46%)" />
              <stop offset="55%" stop-color="hsl(216, 56%, 26%)" />
              <stop offset="100%" stop-color="hsl(228, 60%, 11%)" />
            </linearGradient>
            <radialGradient id="ea-te-clock" cx="48%" cy="46%" r="54%">
              <stop offset="0%" stop-color="hsl(48, 92%, 90%)" />
              <stop offset="65%" stop-color="hsl(214, 52%, 26%)" />
              <stop offset="100%" stop-color="hsl(226, 58%, 12%)" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="58" r="56" fill="url(#ea-te-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="111" rx="48" ry="7.2" fill="hsla(0,0%,0%,0.58)" />
          <ellipse cx="60" cy="111" rx="54" ry="8.8" fill="none" stroke="hsla(192, 96%, 68%, 0.48)" stroke-width="1.3" stroke-dasharray="6 4" />
          <!-- Colossal astral pocket-watch with 12-tick rune halo -->
          <g>
            <circle cx="82" cy="48" r="27" fill="url(#ea-te-clock)" stroke="hsl(46, 94%, 70%)" stroke-width="3" />
            <circle cx="82" cy="48" r="21" fill="none" stroke="hsl(192, 96%, 72%)" stroke-width="1.5" stroke-dasharray="2.5 5.2" class="svg-spin-slow" />
            <circle cx="82" cy="19" r="3.6" fill="none" stroke="hsl(46, 94%, 70%)" stroke-width="2" />
            <path d="M68 35 L77 45 L73 53" stroke="hsl(226, 56%, 12%)" stroke-width="1.6" fill="none" opacity="0.7" />
            <line x1="82" y1="48" x2="82" y2="32" stroke="hsl(48, 100%, 78%)" stroke-width="2.8" stroke-linecap="round" />
            <line x1="82" y1="48" x2="96" y2="55" stroke="hsl(192, 100%, 76%)" stroke-width="2.3" stroke-linecap="round" />
            <circle cx="82" cy="48" r="3.4" fill="hsl(48, 100%, 84%)" />
          </g>
          <g class="svg-breathe">
            <!-- Cloaked eldritch chronomancer slug-sage -->
            <path d="M15 103 Q17 44 48 38 Q76 40 80 103 Q64 98 48 105 Q32 98 15 103 Z" fill="url(#ea-te-cloak)" stroke="hsl(196, 84%, 66%)" stroke-width="2" />
            <path d="M24 55 Q48 65 72 55" stroke="hsl(46, 90%, 68%)" stroke-width="2.4" fill="none" />
            <path d="M22 72 Q48 82 74 72" stroke="hsla(192, 96%, 70%, 0.65)" stroke-width="1.8" fill="none" />
            <!-- Slimy slug-tentacles clutching time warp -->
            <path d="M22 86 Q11 94 17 101 M36 90 Q32 101 40 104" stroke="hsl(276, 46%, 54%)" stroke-width="3.4" stroke-linecap="round" fill="none" />
            <!-- Hooded eldritch visage & piercing golden eyes -->
            <path d="M26 42 Q30 14 48 14 Q66 14 70 42 Q48 51 26 42 Z" fill="url(#ea-te-cloak)" stroke="hsl(196, 86%, 70%)" stroke-width="1.9" />
            <ellipse cx="48" cy="34" rx="12" ry="10" fill="hsl(226, 60%, 8%)" />
            <circle cx="42.5" cy="34" r="4.6" fill="hsla(48, 100%, 68%, 0.36)" class="svg-pulse" />
            <circle cx="42.5" cy="34" r="2.8" fill="hsl(48, 100%, 72%)" />
            <circle cx="53.5" cy="34" r="4.6" fill="hsla(48, 100%, 68%, 0.36)" class="svg-pulse" />
            <circle cx="53.5" cy="34" r="2.8" fill="hsl(48, 100%, 72%)" />
          </g>
          <circle cx="18" cy="24" r="1.9" fill="hsl(48, 100%, 80%)" opacity="0.82" class="svg-float" />
          <circle cx="107" cy="24" r="1.8" fill="hsl(192, 100%, 76%)" opacity="0.82" class="svg-float" />
        </svg>
      `;

    case 'awakened_one':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg boss-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-aw-aura" cx="50%" cy="52%" r="55%">
              <stop offset="0%" stop-color="hsla(190, 98%, 62%, 0.32)" />
              <stop offset="65%" stop-color="hsla(216, 82%, 30%, 0.14)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-aw-wing" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stop-color="hsl(194, 82%, 58%)" />
              <stop offset="55%" stop-color="hsl(214, 68%, 34%)" />
              <stop offset="100%" stop-color="hsl(232, 64%, 14%)" />
            </linearGradient>
            <linearGradient id="ea-aw-body" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stop-color="hsl(210, 60%, 44%)" />
              <stop offset="55%" stop-color="hsl(224, 58%, 24%)" />
              <stop offset="100%" stop-color="hsl(236, 62%, 11%)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="54" r="56" fill="url(#ea-aw-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="111" rx="48" ry="7.2" fill="hsla(198, 76%, 10%, 0.62)" />
          <ellipse cx="60" cy="111" rx="54" ry="8.8" fill="none" stroke="hsla(188, 98%, 72%, 0.5)" stroke-width="1.3" stroke-dasharray="7 4" />
          <!-- Eldritch rotating ritual halo -->
          <circle cx="60" cy="40" r="36" fill="none" stroke="hsla(190, 96%, 68%, 0.42)" stroke-width="1.6" stroke-dasharray="5 5" class="svg-spin-slow" />
          <g class="svg-breathe">
            <!-- Layered sweeping obsidian-cyan crow wings -->
            <path d="M44 48 L4 22 L12 52 L6 66 L22 72 L16 84 L40 77 Z" fill="url(#ea-aw-wing)" stroke="hsl(188, 96%, 76%)" stroke-width="1.8" />
            <path d="M38 54 L13 38 M37 64 L16 62" stroke="hsla(186, 100%, 88%, 0.55)" stroke-width="1.4" />
            <path d="M76 48 L116 22 L108 52 L114 66 L98 72 L104 84 L80 77 Z" fill="url(#ea-aw-wing)" stroke="hsl(188, 96%, 76%)" stroke-width="1.8" />
            <path d="M82 54 L107 38 M83 64 L104 62" stroke="hsla(186, 100%, 88%, 0.55)" stroke-width="1.4" />
            <!-- Armored feathered torso -->
            <path d="M36 42 Q60 30 84 42 L88 105 L32 105 Z" fill="url(#ea-aw-body)" stroke="hsl(190, 90%, 72%)" stroke-width="2" />
            <path d="M42 52 L60 62 L78 52 M42 88 L60 96 L78 88" stroke="hsla(188, 96%, 76%, 0.48)" stroke-width="1.5" fill="none" />
            <!-- Pierced glowing crimson ritual dagger in chest -->
            <circle cx="60" cy="68" r="14" fill="hsla(354, 96%, 54%, 0.28)" class="svg-pulse" />
            <polygon points="60,50 66,70 60,86 54,70" fill="hsl(354, 96%, 62%)" stroke="hsl(46, 100%, 80%)" stroke-width="1.4" />
            <rect x="52" y="54" width="16" height="3.6" rx="1.5" fill="hsl(46, 94%, 68%)" />
            <!-- Crowned pale crow-god skull & blazing crimson eyes -->
            <polygon points="45,19 52,4 60,16 68,4 75,19" fill="hsl(186, 98%, 72%)" stroke="hsl(214, 58%, 22%)" stroke-width="1.2" />
            <path d="M44 20 Q60 11 76 20 L71 43 L60 50 L49 43 Z" fill="hsl(44, 46%, 92%)" stroke="hsl(216, 44%, 22%)" stroke-width="1.8" />
            <circle cx="60" cy="21" r="2.2" fill="hsl(190, 100%, 72%)" class="svg-pulse" />
            <circle cx="53.5" cy="31" r="5" fill="hsla(354, 100%, 58%, 0.38)" class="svg-pulse" />
            <circle cx="53.5" cy="31" r="3" fill="hsl(354, 100%, 62%)" />
            <circle cx="66.5" cy="31" r="5" fill="hsla(354, 100%, 58%, 0.38)" class="svg-pulse" />
            <circle cx="66.5" cy="31" r="3" fill="hsl(354, 100%, 62%)" />
          </g>
        </svg>
      `;

    case 'donu':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg boss-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-dn-aura" cx="50%" cy="56%" r="54%">
              <stop offset="0%" stop-color="hsla(44, 98%, 58%, 0.32)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <radialGradient id="ea-dn-gold" cx="36%" cy="30%" r="70%">
              <stop offset="0%" stop-color="hsl(50, 98%, 78%)" />
              <stop offset="52%" stop-color="hsl(38, 82%, 50%)" />
              <stop offset="100%" stop-color="hsl(24, 68%, 20%)" />
            </radialGradient>
            <radialGradient id="ea-dn-core" cx="46%" cy="44%" r="54%">
              <stop offset="0%" stop-color="hsl(186, 100%, 96%)" />
              <stop offset="55%" stop-color="hsl(188, 98%, 62%)" />
              <stop offset="100%" stop-color="hsl(208, 88%, 26%)" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="56" r="56" fill="url(#ea-dn-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="110" rx="44" ry="6.8" fill="hsla(0,0%,0%,0.58)" />
          <ellipse cx="60" cy="110" rx="50" ry="8.4" fill="none" stroke="hsla(48, 98%, 72%, 0.48)" stroke-width="1.3" stroke-dasharray="6 4" />
          <!-- Orbiting solar rune ring -->
          <circle cx="60" cy="56" r="47" fill="none" stroke="hsla(46, 98%, 72%, 0.48)" stroke-width="1.8" stroke-dasharray="6 5" class="svg-spin-slow" />
          <g class="svg-float">
            <!-- Floating geometric sandstone arms -->
            <path d="M12 46 Q4 56 12 66 L20 62 L20 50 Z" fill="url(#ea-dn-gold)" stroke="hsl(48, 98%, 80%)" stroke-width="1.4" />
            <path d="M108 46 Q116 56 108 66 L100 62 L100 50 Z" fill="url(#ea-dn-gold)" stroke="hsl(48, 98%, 80%)" stroke-width="1.4" />
            <!-- Radiant carved ancient torus body -->
            <circle cx="60" cy="56" r="39" fill="url(#ea-dn-gold)" stroke="hsl(50, 100%, 82%)" stroke-width="2.8" />
            <circle cx="60" cy="56" r="31" fill="none" stroke="hsla(26, 60%, 18%, 0.45)" stroke-width="1.6" />
            <!-- Relief spokes & ancient glyphs -->
            <path d="M60 17 L60 32 M60 80 L60 95 M21 56 L36 56 M84 56 L99 56" stroke="hsl(50, 98%, 86%)" stroke-width="3.2" stroke-linecap="round" />
            <path d="M33 29 L43 39 M87 29 L77 39 M33 83 L43 73 M87 83 L77 73" stroke="hsl(28, 60%, 24%)" stroke-width="2.4" stroke-linecap="round" />
            <!-- Hollow torus cavity & blazing plasma core -->
            <circle cx="60" cy="56" r="17" fill="hsl(224, 48%, 9%)" stroke="hsl(48, 98%, 78%)" stroke-width="2.6" />
            <circle cx="60" cy="56" r="10.5" fill="url(#ea-dn-core)" class="svg-pulse" />
            <circle cx="60" cy="56" r="4" fill="hsl(0, 0%, 100%)" />
          </g>
        </svg>
      `;

    case 'deca':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg boss-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-dc-aura" cx="50%" cy="56%" r="54%">
              <stop offset="0%" stop-color="hsla(194, 98%, 60%, 0.32)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-dc-shell" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(216, 52%, 54%)" />
              <stop offset="52%" stop-color="hsl(224, 48%, 30%)" />
              <stop offset="100%" stop-color="hsl(234, 54%, 13%)" />
            </linearGradient>
            <radialGradient id="ea-dc-core" cx="46%" cy="44%" r="54%">
              <stop offset="0%" stop-color="hsl(192, 100%, 96%)" />
              <stop offset="55%" stop-color="hsl(194, 98%, 62%)" />
              <stop offset="100%" stop-color="hsl(214, 88%, 28%)" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="56" r="56" fill="url(#ea-dc-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="110" rx="44" ry="6.8" fill="hsla(0,0%,0%,0.58)" />
          <ellipse cx="60" cy="110" rx="50" ry="8.4" fill="none" stroke="hsla(194, 98%, 70%, 0.48)" stroke-width="1.3" stroke-dasharray="6 4" />
          <!-- Orbiting diamond rune halo -->
          <polygon points="60,5 111,56 60,107 9,56" fill="none" stroke="hsla(194, 96%, 70%, 0.48)" stroke-width="1.8" stroke-dasharray="6 5" class="svg-spin-slow" />
          <g class="svg-float">
            <!-- Faceted ancient bastion octahedron with light/shadow planes -->
            <polygon points="60,11 105,56 60,101 15,56" fill="url(#ea-dc-shell)" stroke="hsl(46, 92%, 72%)" stroke-width="2.8" />
            <polygon points="60,11 105,56 60,56" fill="hsla(198, 92%, 82%, 0.24)" />
            <polygon points="60,101 15,56 60,56" fill="hsla(234, 62%, 8%, 0.34)" />
            <!-- Corner shield plates -->
            <polygon points="60,16 68,26 52,26" fill="hsl(46, 92%, 70%)" />
            <polygon points="60,96 68,86 52,86" fill="hsl(46, 92%, 70%)" />
            <polygon points="20,56 30,48 30,64" fill="hsl(46, 92%, 70%)" />
            <polygon points="100,56 90,48 90,64" fill="hsl(46, 92%, 70%)" />
            <!-- Inner gilded bastion frame & glowing plasma eye -->
            <rect x="39" y="35" width="42" height="42" rx="6" fill="hsl(226, 54%, 11%)" stroke="hsl(194, 96%, 70%)" stroke-width="2.4" />
            <rect x="44" y="40" width="32" height="32" rx="3.5" fill="none" stroke="hsla(46, 92%, 72%, 0.55)" stroke-width="1.2" />
            <circle cx="60" cy="56" r="12" fill="url(#ea-dc-core)" class="svg-pulse" />
            <circle cx="60" cy="56" r="4.6" fill="hsl(0, 0%, 100%)" />
          </g>
        </svg>
      `;

    case 'chosen':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-ch-robe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(272, 46%, 44%)" />
              <stop offset="60%" stop-color="hsl(268, 44%, 24%)" />
              <stop offset="100%" stop-color="hsl(262, 48%, 12%)" />
            </linearGradient>
            <linearGradient id="ea-cho-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(46, 94%, 74%)" />
              <stop offset="100%" stop-color="hsl(32, 72%, 40%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="34" ry="6" fill="hsla(0,0%,0%,0.52)" />
          <!-- Arcane Hex halo -->
          <circle cx="60" cy="40" r="32" fill="none" stroke="hsla(292, 86%, 68%, 0.4)" stroke-width="1.6" stroke-dasharray="5 4" />
          <!-- Winged avian cult mantle -->
          <path d="M22 48 Q38 30 60 36 Q82 30 98 48 L88 96 L60 104 L32 96 Z" fill="url(#ea-ch-robe)" stroke="hsl(286, 62%, 58%)" stroke-width="2" />
          <!-- Gold breastplate sash -->
          <path d="M44 46 L76 46 L69 88 L51 88 Z" fill="hsl(264, 42%, 15%)" stroke="url(#ea-cho-gold)" stroke-width="2" />
          <path d="M60 52 L66 64 L60 76 L54 64 Z" fill="hsl(296, 92%, 68%)" />
          <!-- Beaked golden bird mask & twin plumes -->
          <path d="M44 26 Q34 12 40 10 Q48 16 52 24 Z" fill="url(#ea-cho-gold)" />
          <path d="M76 26 Q86 12 80 10 Q72 16 68 24 Z" fill="url(#ea-cho-gold)" />
          <path d="M45 24 Q60 15 75 24 L72 44 L60 54 L48 44 Z" fill="url(#ea-cho-gold)" stroke="hsl(30, 56%, 24%)" stroke-width="1.8" />
          <path d="M52 33 L58 35 L53 38 Z" fill="hsl(304, 100%, 72%)" />
          <path d="M68 33 L62 35 L67 38 Z" fill="hsl(304, 100%, 72%)" />
          <!-- Ritual halberd / hex wand -->
          <line x1="94" y1="18" x2="86" y2="100" stroke="url(#ea-cho-gold)" stroke-width="3.2" stroke-linecap="round" />
          <polygon points="94,10 103,24 94,32 85,24" fill="hsl(298, 92%, 66%)" stroke="hsl(48, 95%, 76%)" stroke-width="1.4" />
        </svg>
      `;

    case 'shelled_parasite':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-sp-shell" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(38, 42%, 58%)" />
              <stop offset="55%" stop-color="hsl(32, 34%, 34%)" />
              <stop offset="100%" stop-color="hsl(26, 32%, 18%)" />
            </linearGradient>
            <linearGradient id="ea-sp-flesh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(340, 62%, 52%)" />
              <stop offset="100%" stop-color="hsl(332, 54%, 26%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="107" rx="44" ry="7" fill="hsla(0,0%,0%,0.52)" />
          <!-- Segmented armored carapace -->
          <path d="M22 80 Q24 28 62 24 Q98 28 100 76 Q88 94 56 92 Q28 92 22 80 Z" fill="url(#ea-sp-shell)" stroke="hsl(42, 58%, 70%)" stroke-width="2.4" />
          <!-- Plated armor ridge bands -->
          <path d="M36 36 Q62 46 92 42" fill="none" stroke="hsl(28, 36%, 20%)" stroke-width="3" />
          <path d="M28 56 Q62 66 96 60" fill="none" stroke="hsl(28, 36%, 20%)" stroke-width="3" />
          <path d="M40 28 L44 48 M64 25 L66 48 M84 32 L82 52" stroke="hsl(42, 46%, 64%)" stroke-width="1.6" opacity="0.65" />
          <!-- Fleshy parasitic tendrils & toothy maw emerging left -->
          <path d="M18 76 Q28 62 48 68 L44 92 Q26 94 18 76 Z" fill="url(#ea-sp-flesh)" stroke="hsl(344, 72%, 68%)" stroke-width="1.8" />
          <path d="M20 82 Q12 92 18 98 M28 88 Q24 100 32 103 M38 90 Q38 101 46 102" stroke="hsl(342, 64%, 56%)" stroke-width="3.2" stroke-linecap="round" fill="none" />
          <circle cx="32" cy="74" r="3.4" fill="hsl(52, 98%, 70%)" />
          <circle cx="32" cy="74" r="1.4" fill="hsl(338, 70%, 16%)" />
          <path d="M24 83 L28 86 L32 82 L36 86 L40 82" stroke="hsl(44, 34%, 88%)" stroke-width="1.8" fill="none" />
        </svg>
      `;

    case 'snecko':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-sn-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(148, 56%, 44%)" />
              <stop offset="55%" stop-color="hsl(162, 54%, 26%)" />
              <stop offset="100%" stop-color="hsl(172, 56%, 14%)" />
            </linearGradient>
            <radialGradient id="ea-sn-eye" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="hsl(52, 100%, 84%)" />
              <stop offset="55%" stop-color="hsl(38, 98%, 56%)" />
              <stop offset="100%" stop-color="hsl(282, 82%, 44%)" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="40" ry="6.5" fill="hsla(0,0%,0%,0.52)" />
          <!-- Hypnotic Confusion spiral rings -->
          <circle cx="52" cy="36" r="24" fill="none" stroke="hsla(290, 90%, 70%, 0.42)" stroke-width="1.8" stroke-dasharray="4 4" />
          <circle cx="52" cy="36" r="32" fill="none" stroke="hsla(154, 88%, 58%, 0.28)" stroke-width="1.4" stroke-dasharray="6 5" />
          <!-- Coiled serpent body & sweeping whip tail -->
          <path d="M30 98 Q22 76 46 72 Q76 66 80 82 Q84 96 62 98 Q44 100 30 98 Z" fill="url(#ea-sn-body)" stroke="hsl(142, 66%, 56%)" stroke-width="2" />
          <path d="M80 80 Q104 72 106 52 Q100 62 88 64" fill="none" stroke="hsl(146, 62%, 48%)" stroke-width="6" stroke-linecap="round" />
          <!-- Curved neck & crested serpent head -->
          <path d="M46 76 Q38 52 52 34 Q68 24 76 38 Q78 52 62 56 Q56 64 62 76 Z" fill="url(#ea-sn-body)" stroke="hsl(142, 68%, 58%)" stroke-width="2" />
          <!-- Spined crest -->
          <path d="M54 26 L58 14 L64 24 L72 16 L73 28" fill="hsl(44, 86%, 58%)" stroke="hsl(28, 56%, 24%)" stroke-width="1.4" />
          <!-- Giant hypnotic Snecko eye -->
          <circle cx="56" cy="39" r="8.5" fill="url(#ea-sn-eye)" stroke="hsl(288, 76%, 64%)" stroke-width="1.8" />
          <ellipse cx="56" cy="39" rx="2.4" ry="6.2" fill="hsl(276, 70%, 14%)" />
          <!-- Forked tongue & fangs -->
          <path d="M36 46 L46 44 M38 49 L44 46" stroke="hsl(352, 92%, 62%)" stroke-width="2" stroke-linecap="round" />
          <path d="M44 48 L47 54 L50 48" fill="hsl(48, 30%, 92%)" />
        </svg>
      `;

    case 'darkling':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-dk-body" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stop-color="hsl(262, 34%, 34%)" />
              <stop offset="65%" stop-color="hsl(258, 38%, 16%)" />
              <stop offset="100%" stop-color="hsl(256, 46%, 8%)" />
            </radialGradient>
            <linearGradient id="ea-dk-glow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(182, 96%, 68%)" />
              <stop offset="100%" stop-color="hsl(282, 86%, 60%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="104" rx="38" ry="6.5" fill="hsla(0,0%,0%,0.55)" />
          <!-- Shadowy Life Link aura wisps -->
          <path d="M22 72 Q16 50 32 38 M98 72 Q104 50 88 38" stroke="url(#ea-dk-glow)" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.55" />
          <!-- Hunched obsidian beetle-blob body -->
          <path d="M24 88 Q20 46 58 34 Q96 36 96 86 Q78 98 60 96 Q38 98 24 88 Z" fill="url(#ea-dk-body)" stroke="hsl(276, 56%, 54%)" stroke-width="2.2" />
          <!-- Dorsal shadow spines -->
          <path d="M42 38 L46 22 L54 34 L62 20 L68 35 L78 25 L80 42" fill="hsl(266, 44%, 22%)" stroke="hsl(186, 86%, 62%)" stroke-width="1.4" />
          <!-- Glowing teal eyes -->
          <ellipse cx="44" cy="64" rx="5.5" ry="4" fill="hsl(182, 98%, 66%)" />
          <ellipse cx="68" cy="64" rx="5.5" ry="4" fill="hsl(182, 98%, 66%)" />
          <circle cx="44" cy="64" r="2" fill="hsl(260, 60%, 10%)" />
          <circle cx="68" cy="64" r="2" fill="hsl(260, 60%, 10%)" />
          <!-- Jagged chomping jaw -->
          <path d="M36 78 L44 85 L52 78 L60 86 L68 78 L76 84" stroke="hsl(44, 34%, 88%)" stroke-width="2.2" fill="none" stroke-linejoin="round" />
        </svg>
      `;

    case 'spire_growth':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-sg-vine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(286, 48%, 42%)" />
              <stop offset="55%" stop-color="hsl(272, 42%, 22%)" />
              <stop offset="100%" stop-color="hsl(252, 40%, 12%)" />
            </linearGradient>
            <radialGradient id="ea-sg-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="hsl(148, 96%, 72%)" />
              <stop offset="70%" stop-color="hsl(164, 82%, 38%)" />
              <stop offset="100%" stop-color="hsl(274, 52%, 18%)" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="44" ry="7" fill="hsla(0,0%,0%,0.54)" />
          <!-- Twisting constricting tentacles -->
          <path d="M18 96 Q14 62 34 48 Q22 28 42 20" stroke="url(#ea-sg-vine)" stroke-width="9" stroke-linecap="round" fill="none" />
          <path d="M102 96 Q106 62 86 48 Q98 28 78 20" stroke="url(#ea-sg-vine)" stroke-width="9" stroke-linecap="round" fill="none" />
          <path d="M24 88 Q44 98 60 88 Q76 98 96 88" stroke="hsl(292, 56%, 48%)" stroke-width="6" stroke-linecap="round" fill="none" />
          <!-- Central thorny bulb & bioluminescent eyes -->
          <path d="M36 86 Q30 44 60 28 Q90 44 84 86 Q60 98 36 86 Z" fill="url(#ea-sg-vine)" stroke="hsl(154, 72%, 52%)" stroke-width="2.2" />
          <circle cx="60" cy="58" r="14" fill="url(#ea-sg-core)" stroke="hsl(148, 92%, 70%)" stroke-width="1.8" />
          <circle cx="60" cy="58" r="5" fill="hsl(268, 56%, 12%)" />
          <circle cx="44" cy="46" r="3.2" fill="hsl(146, 96%, 68%)" />
          <circle cx="76" cy="46" r="3.2" fill="hsl(146, 96%, 68%)" />
        </svg>
      `;

    case 'transient':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-tr-void" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(240, 26%, 34%)" />
              <stop offset="60%" stop-color="hsl(252, 34%, 15%)" />
              <stop offset="100%" stop-color="hsla(260, 44%, 8%, 0.15)" />
            </linearGradient>
            <radialGradient id="ea-tr-mask" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stop-color="hsl(220, 24%, 88%)" />
              <stop offset="70%" stop-color="hsl(236, 18%, 54%)" />
              <stop offset="100%" stop-color="hsl(252, 26%, 24%)" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="34" ry="5.5" fill="hsla(276,60%,40%,0.32)" />
          <!-- Fading spectral dissipation rings -->
          <circle cx="60" cy="52" r="44" fill="none" stroke="hsla(282, 86%, 72%, 0.34)" stroke-width="1.6" stroke-dasharray="4 6" />
          <!-- Towering shifting shadow-cloak figure -->
          <path d="M28 96 Q24 52 44 28 Q60 14 76 28 Q96 52 92 96 L76 86 L60 102 L44 86 Z" fill="url(#ea-tr-void)" stroke="hsl(268, 54%, 58%)" stroke-width="2" />
          <!-- Colossal floating stone-void visage -->
          <path d="M40 30 Q60 18 80 30 L76 66 Q60 76 44 66 Z" fill="url(#ea-tr-mask)" stroke="hsl(276, 62%, 70%)" stroke-width="2" />
          <!-- Hollow glowing spectral eyes & fissure -->
          <path d="M46 44 L56 48 L48 53 Z" fill="hsl(292, 100%, 74%)" />
          <path d="M74 44 L64 48 L72 53 Z" fill="hsl(292, 100%, 74%)" />
          <path d="M52 61 Q60 66 68 61" stroke="hsl(260, 44%, 14%)" stroke-width="2.6" fill="none" stroke-linecap="round" />
          <!-- Orbiting temporal shards -->
          <polygon points="18,46 24,38 26,48" fill="hsl(288, 84%, 72%)" opacity="0.8" />
          <polygon points="102,42 96,34 94,46" fill="hsl(194, 88%, 72%)" opacity="0.8" />
          <polygon points="24,78 30,72 31,82" fill="hsl(288, 84%, 72%)" opacity="0.65" />
        </svg>
      `;

    case 'writhing_mass':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-wm-mass" cx="48%" cy="46%" r="54%">
              <stop offset="0%" stop-color="hsl(312, 48%, 42%)" />
              <stop offset="60%" stop-color="hsl(296, 46%, 22%)" />
              <stop offset="100%" stop-color="hsl(280, 48%, 11%)" />
            </radialGradient>
            <linearGradient id="ea-wm-arm" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(324, 54%, 50%)" />
              <stop offset="100%" stop-color="hsl(290, 46%, 20%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="44" ry="7" fill="hsla(0,0%,0%,0.54)" />
          <!-- Writhing coiled tendrils radiating outward -->
          <path d="M24 52 Q10 38 22 24 M96 52 Q110 38 98 24 M20 82 Q8 90 18 98 M100 82 Q112 90 102 98 M60 22 Q54 8 66 10" stroke="url(#ea-wm-arm)" stroke-width="6.5" stroke-linecap="round" fill="none" />
          <!-- Organic tangled eldritch knot -->
          <path d="M26 76 Q18 44 44 30 Q62 18 82 32 Q104 48 92 80 Q76 100 56 96 Q34 100 26 76 Z" fill="url(#ea-wm-mass)" stroke="hsl(326, 66%, 58%)" stroke-width="2.2" />
          <path d="M34 54 Q58 42 84 56 M32 72 Q60 84 86 68" stroke="hsl(286, 52%, 14%)" stroke-width="3.2" fill="none" stroke-linecap="round" />
          <!-- Multiple reactive glowing eyes -->
          <circle cx="46" cy="48" r="5" fill="hsl(48, 100%, 72%)" /><circle cx="46" cy="48" r="2" fill="hsl(312, 62%, 16%)" />
          <circle cx="72" cy="46" r="6" fill="hsl(48, 100%, 72%)" /><circle cx="72" cy="46" r="2.4" fill="hsl(312, 62%, 16%)" />
          <circle cx="58" cy="68" r="7" fill="hsl(352, 96%, 66%)" stroke="hsl(48, 96%, 72%)" stroke-width="1.4" /><circle cx="58" cy="68" r="2.6" fill="hsl(292, 62%, 12%)" />
          <circle cx="38" cy="70" r="3.6" fill="hsl(148, 92%, 64%)" />
          <circle cx="80" cy="70" r="3.6" fill="hsl(148, 92%, 64%)" />
        </svg>
      `;

    // =========================================================================
    // LARGE & SMALL SLIMES
    // =========================================================================
    case 'acid_slime_l':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-asl-aura" cx="50%" cy="58%" r="52%">
              <stop offset="0%" stop-color="hsla(128, 92%, 52%, 0.28)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <radialGradient id="ea-asl-body" cx="38%" cy="30%" r="72%">
              <stop offset="0%" stop-color="hsl(124, 78%, 58%)" />
              <stop offset="54%" stop-color="hsl(138, 66%, 34%)" />
              <stop offset="100%" stop-color="hsl(154, 62%, 13%)" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="54" fill="url(#ea-asl-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="109" rx="50" ry="7.5" fill="hsla(0,0%,0%,0.54)" />
          <g class="svg-float">
            <circle cx="22" cy="30" r="5" fill="hsl(122, 96%, 64%)" opacity="0.82" />
            <circle cx="96" cy="26" r="4.2" fill="hsl(122, 96%, 64%)" opacity="0.78" />
            <circle cx="62" cy="16" r="3.4" fill="hsl(88, 98%, 74%)" opacity="0.84" />
          </g>
          <g class="svg-breathe">
            <!-- Towering gelatinous large acid slime -->
            <path d="M10 98 Q8 30 60 28 Q112 30 110 98 Q86 108 60 103 Q34 108 10 98 Z" fill="url(#ea-asl-body)" stroke="hsl(118, 94%, 72%)" stroke-width="2.4" />
            <path d="M26 48 Q42 34 64 36" stroke="hsla(0,0%,100%,0.5)" stroke-width="4" stroke-linecap="round" fill="none" />
            <!-- Split-ready shimmering fissure line -->
            <path d="M60 32 Q56 54 62 72 Q58 88 60 100" stroke="hsla(84, 100%, 76%, 0.34)" stroke-width="2" stroke-dasharray="4 4" fill="none" />
            <circle cx="90" cy="60" r="6" fill="hsla(0,0%,100%,0.2)" stroke="hsla(120, 96%, 82%, 0.4)" stroke-width="1" />
            <circle cx="28" cy="78" r="4.6" fill="hsla(0,0%,100%,0.22)" />
            <circle cx="82" cy="86" r="3.8" fill="hsla(0,0%,100%,0.2)" />
            <!-- Fierce glowing yellow-lime eyes & wide dripping maw -->
            <circle cx="42" cy="66" r="7.5" fill="hsla(52, 100%, 62%, 0.36)" />
            <circle cx="42" cy="66" r="4.8" fill="hsl(52, 100%, 72%)" />
            <circle cx="41" cy="66" r="1.9" fill="hsl(152, 68%, 12%)" />
            <circle cx="78" cy="66" r="7.5" fill="hsla(52, 100%, 62%, 0.36)" />
            <circle cx="78" cy="66" r="4.8" fill="hsl(52, 100%, 72%)" />
            <circle cx="77" cy="66" r="1.9" fill="hsl(152, 68%, 12%)" />
            <path d="M36 82 Q60 95 84 82 Q60 88 36 82 Z" fill="hsl(154, 72%, 12%)" stroke="hsl(88, 92%, 74%)" stroke-width="1.8" />
          </g>
        </svg>
      `;

    case 'spike_slime_l':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-ssl-aura" cx="50%" cy="56%" r="52%">
              <stop offset="0%" stop-color="hsla(198, 92%, 58%, 0.28)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <radialGradient id="ea-ssl-body" cx="38%" cy="32%" r="72%">
              <stop offset="0%" stop-color="hsl(198, 72%, 62%)" />
              <stop offset="56%" stop-color="hsl(210, 62%, 38%)" />
              <stop offset="100%" stop-color="hsl(224, 58%, 15%)" />
            </radialGradient>
            <linearGradient id="ea-ssl-spike" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stop-color="hsl(190, 94%, 92%)" />
              <stop offset="100%" stop-color="hsl(206, 74%, 46%)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="54" fill="url(#ea-ssl-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="109" rx="50" ry="7.5" fill="hsla(0,0%,0%,0.54)" />
          <g class="svg-breathe">
            <!-- Towering crystalline dorsal spike crown -->
            <polygon points="16,60 22,22 36,46 47,12 60,40 73,12 84,46 98,22 104,60" fill="url(#ea-ssl-spike)" stroke="hsl(210, 76%, 26%)" stroke-width="1.8" stroke-linejoin="round" />
            <path d="M47 16 L51 40 M73 16 L69 40 M23 26 L30 46 M97 26 L90 46" stroke="hsla(0,0%,100%,0.6)" stroke-width="1.4" />
            <!-- Colossal armored slime body -->
            <path d="M11 98 Q10 38 60 36 Q110 38 109 98 Q85 108 60 103 Q35 108 11 98 Z" fill="url(#ea-ssl-body)" stroke="hsl(194, 92%, 78%)" stroke-width="2.4" />
            <path d="M27 52 Q44 41 64 43" stroke="hsla(0,0%,100%,0.48)" stroke-width="3.6" stroke-linecap="round" fill="none" />
            <!-- Split-ready shimmering fissure -->
            <path d="M60 40 Q64 60 58 78 Q62 90 60 101" stroke="hsla(192, 100%, 84%, 0.36)" stroke-width="2" stroke-dasharray="4 4" fill="none" />
            <!-- Piercing slanted eyes & jagged icy grin -->
            <polygon points="36,64 51,69 40,74" fill="hsl(48, 100%, 72%)" />
            <polygon points="84,64 69,69 80,74" fill="hsl(48, 100%, 72%)" />
            <path d="M38 85 L46 80 L54 87 L60 80 L66 87 L74 80 L82 85" stroke="hsl(192, 92%, 90%)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          </g>
        </svg>
      `;

    case 'acid_slime_s':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-ass-body" cx="42%" cy="36%" r="66%">
              <stop offset="0%" stop-color="hsl(126, 78%, 58%)" />
              <stop offset="60%" stop-color="hsl(142, 64%, 34%)" />
              <stop offset="100%" stop-color="hsl(156, 62%, 15%)" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="104" rx="28" ry="5" fill="hsla(0,0%,0%,0.44)" />
          <g class="svg-float">
            <circle cx="42" cy="52" r="3" fill="hsl(122, 94%, 68%)" opacity="0.82" />
            <circle cx="78" cy="48" r="2.4" fill="hsl(90, 96%, 72%)" opacity="0.76" />
          </g>
          <g class="svg-breathe">
            <path d="M32 96 Q30 62 60 61 Q90 62 88 96 Q74 102 60 99 Q46 102 32 96 Z" fill="url(#ea-ass-body)" stroke="hsl(122, 92%, 72%)" stroke-width="2" />
            <path d="M42 71 Q50 65 62 66" stroke="hsla(0,0%,100%,0.54)" stroke-width="2.8" stroke-linecap="round" fill="none" />
            <circle cx="50" cy="81" r="3.6" fill="hsl(50, 100%, 72%)" />
            <circle cx="49.4" cy="81" r="1.4" fill="hsl(154, 68%, 14%)" />
            <circle cx="70" cy="81" r="3.6" fill="hsl(50, 100%, 72%)" />
            <circle cx="69.4" cy="81" r="1.4" fill="hsl(154, 68%, 14%)" />
            <path d="M51 90 Q60 95 69 90" stroke="hsl(50, 82%, 90%)" stroke-width="2.2" fill="none" stroke-linecap="round" />
          </g>
        </svg>
      `;

    case 'spike_slime_s':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-sss-body" cx="42%" cy="36%" r="66%">
              <stop offset="0%" stop-color="hsl(198, 70%, 62%)" />
              <stop offset="60%" stop-color="hsl(210, 58%, 38%)" />
              <stop offset="100%" stop-color="hsl(224, 58%, 16%)" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="104" rx="28" ry="5" fill="hsla(0,0%,0%,0.44)" />
          <g class="svg-breathe">
            <polygon points="39,69 44,49 53,63 60,42 67,63 76,49 81,69" fill="hsl(194, 84%, 82%)" stroke="hsl(210, 74%, 28%)" stroke-width="1.5" stroke-linejoin="round" />
            <path d="M32 96 Q31 64 60 63 Q89 64 88 96 Q74 102 60 99 Q46 102 32 96 Z" fill="url(#ea-sss-body)" stroke="hsl(194, 90%, 78%)" stroke-width="2" />
            <path d="M42 73 Q50 67 61 68" stroke="hsla(0,0%,100%,0.5)" stroke-width="2.6" stroke-linecap="round" fill="none" />
            <polygon points="46,79 55,82 48,85" fill="hsl(48, 100%, 72%)" />
            <polygon points="74,79 65,82 72,85" fill="hsl(48, 100%, 72%)" />
            <path d="M51 91 L56 88 L60 92 L64 88 L69 91" stroke="hsl(194, 88%, 92%)" stroke-width="2.1" fill="none" stroke-linecap="round" />
          </g>
        </svg>
      `;

    // =========================================================================
    // RED SLAVER & GREMLIN FAMILY
    // =========================================================================
    case 'slaver_red':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-sr-cloak" x1="0" y1="0" x2="0.2" y2="1">
              <stop offset="0%" stop-color="hsl(356, 70%, 46%)" />
              <stop offset="60%" stop-color="hsl(352, 66%, 28%)" />
              <stop offset="100%" stop-color="hsl(344, 64%, 13%)" />
            </linearGradient>
            <linearGradient id="ea-sr-iron" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(28, 22%, 86%)" />
              <stop offset="100%" stop-color="hsl(14, 24%, 38%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="38" ry="6.2" fill="hsla(0,0%,0%,0.5)" />
          <g class="svg-breathe">
            <!-- Coiled iron entangling net on left arm -->
            <ellipse cx="22" cy="70" rx="13" ry="16" fill="hsla(24, 32%, 22%, 0.45)" stroke="hsl(30, 38%, 62%)" stroke-width="1.6" />
            <path d="M13 62 L31 78 M13 78 L31 62 M22 54 V86 M10 70 H34" stroke="hsl(32, 34%, 72%)" stroke-width="1.1" opacity="0.85" />
            <!-- Crimson hooded cloak -->
            <path d="M32 42 Q60 28 84 44 L92 104 L26 104 Z" fill="url(#ea-sr-cloak)" stroke="hsl(8, 82%, 64%)" stroke-width="1.9" />
            <path d="M40 50 L80 86 M40 60 L76 92" stroke="hsl(34, 48%, 52%)" stroke-width="2.4" opacity="0.82" />
            <path d="M42 20 Q60 10 76 22 L74 44 Q60 49 44 44 Z" fill="url(#ea-sr-cloak)" stroke="hsl(8, 82%, 64%)" stroke-width="1.8" />
            <rect x="46" y="26" width="26" height="14" rx="4" fill="hsl(348, 52%, 10%)" />
            <circle cx="53" cy="33" r="2.8" fill="hsl(44, 100%, 66%)" />
            <circle cx="65" cy="33" r="2.8" fill="hsl(44, 100%, 66%)" />
            <!-- Wicked barbed trident -->
            <line x1="94" y1="26" x2="90" y2="104" stroke="hsl(26, 36%, 48%)" stroke-width="4" stroke-linecap="round" />
            <path d="M84 12 L86 28 H102 L104 12 M94 8 L94 28" stroke="url(#ea-sr-iron)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            <polygon points="94,5 98,14 90,14" fill="url(#ea-sr-iron)" />
          </g>
        </svg>
      `;

    case 'fat_gremlin':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-fg-skin" cx="44%" cy="38%" r="64%">
              <stop offset="0%" stop-color="hsl(74, 44%, 52%)" />
              <stop offset="60%" stop-color="hsl(68, 42%, 32%)" />
              <stop offset="100%" stop-color="hsl(58, 44%, 15%)" />
            </radialGradient>
            <linearGradient id="ea-fg-club" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(34, 52%, 56%)" />
              <stop offset="100%" stop-color="hsl(24, 46%, 22%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="40" ry="6.6" fill="hsla(0,0%,0%,0.5)" />
          <g class="svg-breathe">
            <!-- Heavy wooden mallet -->
            <line x1="92" y1="42" x2="84" y2="90" stroke="hsl(28, 42%, 38%)" stroke-width="4.5" stroke-linecap="round" />
            <rect x="78" y="24" width="28" height="20" rx="5" transform="rotate(-14 92 34)" fill="url(#ea-fg-club)" stroke="hsl(38, 62%, 70%)" stroke-width="1.6" />
            <!-- Stubby horns & wide ears -->
            <polygon points="42,36 30,24 48,30" fill="hsl(40, 40%, 82%)" stroke="hsl(26, 28%, 30%)" stroke-width="1.2" />
            <polygon points="74,36 86,24 68,30" fill="hsl(40, 40%, 82%)" stroke="hsl(26, 28%, 30%)" stroke-width="1.2" />
            <!-- Rotund heavy belly torso -->
            <ellipse cx="58" cy="70" rx="34" ry="32" fill="url(#ea-fg-skin)" stroke="hsl(78, 56%, 64%)" stroke-width="2" />
            <path d="M26 76 Q58 86 90 76 L88 86 Q58 95 28 86 Z" fill="hsl(24, 42%, 22%)" stroke="hsl(38, 58%, 54%)" stroke-width="1.2" />
            <!-- Dopey fierce eyes & underbite fangs -->
            <circle cx="47" cy="52" r="4.5" fill="hsl(46, 100%, 72%)" /><circle cx="47" cy="52" r="2" fill="hsl(40, 62%, 12%)" />
            <circle cx="69" cy="52" r="4.5" fill="hsl(46, 100%, 72%)" /><circle cx="69" cy="52" r="2" fill="hsl(40, 62%, 12%)" />
            <path d="M44 64 Q58 70 72 64" stroke="hsl(42, 54%, 14%)" stroke-width="3" fill="none" stroke-linecap="round" />
            <polygon points="47,66 50,59 53,66" fill="hsl(44, 62%, 92%)" />
            <polygon points="63,66 66,59 69,66" fill="hsl(44, 62%, 92%)" />
          </g>
        </svg>
      `;

    case 'shield_gremlin':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-shg-skin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(168, 48%, 48%)" />
              <stop offset="100%" stop-color="hsl(178, 50%, 20%)" />
            </linearGradient>
            <linearGradient id="ea-shg-shield" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stop-color="hsl(210, 54%, 64%)" />
              <stop offset="52%" stop-color="hsl(216, 48%, 38%)" />
              <stop offset="100%" stop-color="hsl(224, 52%, 18%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="34" ry="6" fill="hsla(0,0%,0%,0.48)" />
          <g class="svg-breathe">
            <!-- Little gremlin ears & iron helm peeking over shield -->
            <polygon points="40,36 22,26 44,28" fill="url(#ea-shg-skin)" stroke="hsl(168, 58%, 66%)" stroke-width="1.3" />
            <polygon points="80,36 98,26 76,28" fill="url(#ea-shg-skin)" stroke="hsl(168, 58%, 66%)" stroke-width="1.3" />
            <path d="M40 36 Q60 16 80 36 L78 46 H42 Z" fill="hsl(214, 34%, 44%)" stroke="hsl(206, 56%, 76%)" stroke-width="1.8" />
            <circle cx="51" cy="40" r="3" fill="hsl(48, 100%, 72%)" />
            <circle cx="69" cy="40" r="3" fill="hsl(48, 100%, 72%)" />
            <!-- Oversized riveted tower shield -->
            <path d="M24 44 L60 36 L96 44 L90 88 L60 105 L30 88 Z" fill="url(#ea-shg-shield)" stroke="hsl(44, 82%, 70%)" stroke-width="2.4" stroke-linejoin="round" />
            <path d="M60 38 V103 M28 66 H92" stroke="hsl(44, 78%, 64%)" stroke-width="2.2" opacity="0.72" />
            <circle cx="60" cy="66" r="10" fill="hsl(42, 76%, 54%)" stroke="hsl(48, 96%, 86%)" stroke-width="1.8" />
            <circle cx="34" cy="52" r="2" fill="hsl(48, 92%, 82%)" /><circle cx="86" cy="52" r="2" fill="hsl(48, 92%, 82%)" />
            <circle cx="37" cy="84" r="2" fill="hsl(48, 92%, 82%)" /><circle cx="83" cy="84" r="2" fill="hsl(48, 92%, 82%)" />
          </g>
        </svg>
      `;

    case 'sneaky_gremlin':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-sng-skin" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stop-color="hsl(268, 54%, 52%)" />
              <stop offset="100%" stop-color="hsl(258, 56%, 18%)" />
            </linearGradient>
            <linearGradient id="ea-sng-blade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(190, 42%, 94%)" />
              <stop offset="100%" stop-color="hsl(214, 24%, 44%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="30" ry="5.6" fill="hsla(0,0%,0%,0.48)" />
          <g class="svg-breathe">
            <!-- Long swept pointy ears -->
            <path d="M44 42 L14 26 L48 34 Z" fill="url(#ea-sng-skin)" stroke="hsl(276, 74%, 72%)" stroke-width="1.4" />
            <path d="M76 42 L106 26 L72 34 Z" fill="url(#ea-sng-skin)" stroke="hsl(276, 74%, 72%)" stroke-width="1.4" />
            <!-- Lean crouched agile silhouette -->
            <path d="M40 46 Q60 30 80 46 L74 98 L46 98 Z" fill="url(#ea-sng-skin)" stroke="hsl(278, 72%, 70%)" stroke-width="1.8" />
            <path d="M45 78 L75 78 L72 96 L60 90 L48 96 Z" fill="hsl(246, 36%, 14%)" />
            <!-- Sly squinting glowing eyes & smirk -->
            <path d="M46 53 Q52 49 57 54 L47 57 Z" fill="hsl(48, 100%, 70%)" />
            <path d="M74 53 Q68 49 63 54 L73 57 Z" fill="hsl(48, 100%, 70%)" />
            <path d="M50 67 Q60 72 72 65" stroke="hsl(46, 84%, 88%)" stroke-width="2.2" fill="none" stroke-linecap="round" />
            <!-- Wicked curved assassin dagger -->
            <path d="M78 66 L108 42 L94 74 Z" fill="url(#ea-sng-blade)" stroke="hsl(268, 48%, 34%)" stroke-width="1.4" />
            <path d="M42 68 L20 56 L30 74 Z" fill="url(#ea-sng-blade)" stroke="hsl(268, 48%, 34%)" stroke-width="1.3" />
          </g>
        </svg>
      `;

    case 'gremlin_wizard':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-gw-aura" cx="56%" cy="48%" r="50%">
              <stop offset="0%" stop-color="hsla(296, 94%, 60%, 0.3)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-gw-robe" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stop-color="hsl(266, 62%, 44%)" />
              <stop offset="100%" stop-color="hsl(248, 60%, 16%)" />
            </linearGradient>
            <radialGradient id="ea-gw-orb" cx="44%" cy="40%" r="58%">
              <stop offset="0%" stop-color="hsl(52, 100%, 96%)" />
              <stop offset="50%" stop-color="hsl(304, 98%, 64%)" />
              <stop offset="100%" stop-color="hsl(268, 86%, 32%)" />
            </radialGradient>
          </defs>
          <circle cx="62" cy="56" r="52" fill="url(#ea-gw-aura)" class="svg-pulse" />
          <ellipse cx="58" cy="108" rx="34" ry="5.8" fill="hsla(0,0%,0%,0.5)" />
          <g class="svg-breathe">
            <!-- Arcane robe & starry trim -->
            <path d="M32 54 Q58 44 82 54 L90 104 L26 104 Z" fill="url(#ea-gw-robe)" stroke="hsl(288, 78%, 68%)" stroke-width="1.8" />
            <path d="M36 96 L84 96" stroke="hsl(46, 92%, 68%)" stroke-width="2" stroke-dasharray="4 4" />
            <!-- Shadowed face under brim with glowing magenta eyes -->
            <ellipse cx="58" cy="52" rx="14" ry="11" fill="hsl(258, 56%, 12%)" />
            <circle cx="52" cy="52" r="3.2" fill="hsl(308, 100%, 72%)" class="svg-pulse" />
            <circle cx="64" cy="52" r="3.2" fill="hsl(308, 100%, 72%)" class="svg-pulse" />
            <!-- Oversized tilted wizard hat -->
            <path d="M18 48 Q58 34 96 48 Q58 55 18 48 Z" fill="hsl(258, 60%, 26%)" stroke="hsl(46, 92%, 68%)" stroke-width="1.6" />
            <path d="M34 44 L54 8 L78 44 Z" fill="url(#ea-gw-robe)" stroke="hsl(288, 78%, 68%)" stroke-width="1.8" />
            <polygon points="56,22 58,27 63,27 59,30 61,35 56,32 51,35 53,30 49,27 54,27" fill="hsl(48, 100%, 74%)" />
            <!-- Glowing blast staff -->
            <line x1="94" y1="36" x2="90" y2="104" stroke="hsl(32, 48%, 48%)" stroke-width="3.6" stroke-linecap="round" />
            <circle cx="94" cy="30" r="11" fill="url(#ea-gw-orb)" stroke="hsl(190, 96%, 78%)" stroke-width="1.6" class="svg-pulse" />
          </g>
        </svg>
      `;

    // =========================================================================
    // ACT 2 BOSS MINIONS (BRONZE ORB & TORCH HEAD)
    // =========================================================================
    case 'bronze_orb':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-bo-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="hsla(188, 98%, 60%, 0.34)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-bo-brass" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stop-color="hsl(44, 78%, 68%)" />
              <stop offset="52%" stop-color="hsl(34, 58%, 40%)" />
              <stop offset="100%" stop-color="hsl(24, 52%, 16%)" />
            </linearGradient>
            <radialGradient id="ea-bo-eye" cx="44%" cy="42%" r="58%">
              <stop offset="0%" stop-color="hsl(54, 100%, 96%)" />
              <stop offset="50%" stop-color="hsl(186, 100%, 62%)" />
              <stop offset="100%" stop-color="hsl(208, 86%, 24%)" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="56" r="50" fill="url(#ea-bo-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="106" rx="28" ry="5.2" fill="hsla(0,0%,0%,0.48)" />
          <g class="svg-float">
            <!-- Gyroscopic outer bronze rings -->
            <ellipse cx="60" cy="56" rx="42" ry="15" transform="rotate(-24 60 56)" fill="none" stroke="hsl(44, 84%, 66%)" stroke-width="3.2" />
            <ellipse cx="60" cy="56" rx="42" ry="15" transform="rotate(24 60 56)" fill="none" stroke="hsl(188, 92%, 70%)" stroke-width="2" stroke-dasharray="7 4" />
            <!-- Core bronze mechanical sphere -->
            <circle cx="60" cy="56" r="27" fill="url(#ea-bo-brass)" stroke="hsl(48, 92%, 78%)" stroke-width="2.4" />
            <circle cx="60" cy="56" r="18" fill="hsl(216, 48%, 12%)" stroke="hsl(46, 86%, 68%)" stroke-width="2" />
            <circle cx="60" cy="56" r="12" fill="url(#ea-bo-eye)" class="svg-pulse" />
            <circle cx="60" cy="56" r="4.4" fill="hsl(0, 0%, 100%)" />
            <!-- Four cardinal brass stabilizers -->
            <rect x="57" y="21" width="6" height="9" rx="1.5" fill="hsl(44, 82%, 62%)" />
            <rect x="57" y="82" width="6" height="9" rx="1.5" fill="hsl(44, 82%, 62%)" />
            <rect x="25" y="53" width="9" height="6" rx="1.5" fill="hsl(44, 82%, 62%)" />
            <rect x="86" y="53" width="9" height="6" rx="1.5" fill="hsl(44, 82%, 62%)" />
          </g>
        </svg>
      `;

    case 'torch_head':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-th-aura" cx="50%" cy="38%" r="48%">
              <stop offset="0%" stop-color="hsla(154, 98%, 54%, 0.34)" />
              <stop offset="100%" stop-color="hsla(0,0%,0%,0)" />
            </radialGradient>
            <linearGradient id="ea-th-cloak" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stop-color="hsl(264, 46%, 32%)" />
              <stop offset="100%" stop-color="hsl(254, 52%, 11%)" />
            </linearGradient>
            <linearGradient id="ea-th-flame" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="hsl(164, 96%, 42%)" />
              <stop offset="56%" stop-color="hsl(150, 98%, 68%)" />
              <stop offset="100%" stop-color="hsl(136, 100%, 92%)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="44" r="46" fill="url(#ea-th-aura)" class="svg-pulse" />
          <ellipse cx="60" cy="108" rx="32" ry="5.6" fill="hsla(0,0%,0%,0.5)" />
          <g class="svg-breathe">
            <!-- Tattered collector-minion robe -->
            <path d="M36 52 Q60 44 84 52 L90 104 L74 98 L60 106 L46 98 L30 104 Z" fill="url(#ea-th-cloak)" stroke="hsl(160, 74%, 56%)" stroke-width="1.8" />
            <!-- Iron brazier collar -->
            <path d="M42 46 H78 L72 56 H48 Z" fill="hsl(42, 68%, 48%)" stroke="hsl(28, 46%, 20%)" stroke-width="1.4" />
            <!-- Blazing emerald skull flame head -->
            <path d="M60 10 Q80 28 74 47 H46 Q40 28 60 10 Z" fill="url(#ea-th-flame)" class="svg-float" />
            <ellipse cx="60" cy="36" rx="11" ry="10" fill="hsl(166, 78%, 16%)" opacity="0.72" />
            <circle cx="55" cy="35" r="2.8" fill="hsl(142, 100%, 84%)" />
            <circle cx="65" cy="35" r="2.8" fill="hsl(142, 100%, 84%)" />
            <path d="M55 42 H65" stroke="hsl(142, 92%, 78%)" stroke-width="2" stroke-linecap="round" />
          </g>
        </svg>
      `;

    // =========================================================================
    // ACT 2 MASKED BANDITS TRIO (POINTY, ROMEO, BEAR)
    // =========================================================================
    case 'bandit_pointy':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-bp-cloak" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stop-color="hsl(352, 62%, 40%)" />
              <stop offset="100%" stop-color="hsl(342, 54%, 14%)" />
            </linearGradient>
            <linearGradient id="ea-bp-steel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(44, 26%, 94%)" />
              <stop offset="100%" stop-color="hsl(214, 18%, 44%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="32" ry="5.6" fill="hsla(0,0%,0%,0.48)" />
          <g class="svg-breathe">
            <!-- Slim roguish body -->
            <path d="M40 48 Q60 40 80 48 L82 102 L38 102 Z" fill="url(#ea-bp-cloak)" stroke="hsl(8, 76%, 62%)" stroke-width="1.8" />
            <!-- Pointed crimson cowl & red bandit mask -->
            <path d="M42 42 L60 10 L78 42 Q60 48 42 42 Z" fill="url(#ea-bp-cloak)" stroke="hsl(8, 76%, 62%)" stroke-width="1.8" />
            <path d="M46 32 Q60 28 74 32 L73 41 Q60 45 47 41 Z" fill="hsl(356, 78%, 36%)" />
            <circle cx="54" cy="36" r="2.6" fill="hsl(48, 100%, 70%)" />
            <circle cx="66" cy="36" r="2.6" fill="hsl(48, 100%, 70%)" />
            <!-- Twin crossed stiletto daggers -->
            <path d="M38 66 L10 44 L26 72 Z" fill="url(#ea-bp-steel)" stroke="hsl(34, 48%, 46%)" stroke-width="1.3" />
            <path d="M82 66 L110 44 L94 72 Z" fill="url(#ea-bp-steel)" stroke="hsl(34, 48%, 46%)" stroke-width="1.3" />
          </g>
        </svg>
      `;

    case 'bandit_romeo':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-br-cape" x1="0" y1="0" x2="0.6" y2="1">
              <stop offset="0%" stop-color="hsl(354, 74%, 48%)" />
              <stop offset="100%" stop-color="hsl(340, 68%, 16%)" />
            </linearGradient>
            <linearGradient id="ea-br-rapier" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(48, 92%, 88%)" />
              <stop offset="100%" stop-color="hsl(36, 70%, 44%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="36" ry="6" fill="hsla(0,0%,0%,0.5)" />
          <g class="svg-breathe">
            <!-- Flowing flamboyant crimson cape -->
            <path d="M30 46 Q60 36 88 46 L96 104 L24 104 Z" fill="url(#ea-br-cape)" stroke="hsl(44, 86%, 64%)" stroke-width="1.9" />
            <path d="M46 48 L60 98 L74 48" fill="none" stroke="hsl(44, 90%, 66%)" stroke-width="2" />
            <!-- Feathered scarlet tricorne hat & red domino mask -->
            <path d="M74 22 Q94 8 100 18 Q88 26 74 28 Z" fill="hsl(46, 98%, 68%)" stroke="hsl(28, 72%, 44%)" stroke-width="1.1" />
            <path d="M34 30 Q60 12 86 30 Q60 36 34 30 Z" fill="hsl(348, 66%, 24%)" stroke="hsl(44, 86%, 64%)" stroke-width="1.6" />
            <circle cx="60" cy="38" r="12" fill="hsl(28, 42%, 68%)" stroke="hsl(348, 56%, 24%)" stroke-width="1.4" />
            <path d="M48 35 Q60 31 72 35 L71 42 Q60 45 49 42 Z" fill="hsl(356, 82%, 40%)" />
            <circle cx="55" cy="38" r="2.4" fill="hsl(48, 100%, 76%)" />
            <circle cx="65" cy="38" r="2.4" fill="hsl(48, 100%, 76%)" />
            <!-- Gilded duelist rapier -->
            <line x1="84" y1="68" x2="112" y2="28" stroke="url(#ea-br-rapier)" stroke-width="3" stroke-linecap="round" />
            <circle cx="84" cy="68" r="5" fill="hsl(44, 88%, 60%)" stroke="hsl(26, 48%, 22%)" stroke-width="1.2" />
          </g>
        </svg>
      `;

    case 'bandit_bear':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-bb-body" x1="0.1" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stop-color="hsl(24, 46%, 42%)" />
              <stop offset="56%" stop-color="hsl(18, 42%, 26%)" />
              <stop offset="100%" stop-color="hsl(14, 44%, 13%)" />
            </linearGradient>
            <linearGradient id="ea-bb-mask" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(356, 80%, 48%)" />
              <stop offset="100%" stop-color="hsl(348, 74%, 26%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="109" rx="45" ry="7" fill="hsla(0,0%,0%,0.54)" />
          <g class="svg-breathe">
            <!-- Hulking broad-shouldered brute torso -->
            <path d="M18 44 Q60 24 102 44 L92 104 L28 104 Z" fill="url(#ea-bb-body)" stroke="hsl(32, 52%, 56%)" stroke-width="2.2" />
            <!-- Fur-trimmed heavy pauldrons & leather cross-harness -->
            <ellipse cx="26" cy="48" rx="12" ry="9" fill="hsl(28, 36%, 24%)" stroke="hsl(36, 48%, 54%)" stroke-width="1.6" />
            <ellipse cx="94" cy="48" rx="12" ry="9" fill="hsl(28, 36%, 24%)" stroke="hsl(36, 48%, 54%)" stroke-width="1.6" />
            <path d="M32 46 L88 86 M88 46 L32 86" stroke="hsl(24, 38%, 16%)" stroke-width="5.5" />
            <circle cx="60" cy="66" r="6" fill="hsl(42, 76%, 56%)" stroke="hsl(24, 42%, 18%)" stroke-width="1.4" />
            <!-- Red-masked strongman head -->
            <rect x="42" y="18" width="36" height="28" rx="10" fill="hsl(24, 42%, 58%)" stroke="hsl(18, 44%, 20%)" stroke-width="1.8" />
            <path d="M42 26 Q60 22 78 26 L77 38 Q60 42 43 38 Z" fill="url(#ea-bb-mask)" />
            <circle cx="52" cy="32" r="2.8" fill="hsl(48, 100%, 74%)" />
            <circle cx="68" cy="32" r="2.8" fill="hsl(48, 100%, 74%)" />
            <!-- Massive iron-studded gauntlets -->
            <circle cx="20" cy="76" r="11" fill="hsl(212, 22%, 34%)" stroke="hsl(40, 74%, 64%)" stroke-width="1.8" />
            <circle cx="100" cy="76" r="11" fill="hsl(212, 22%, 34%)" stroke="hsl(40, 74%, 64%)" stroke-width="1.8" />
          </g>
        </svg>
      `;

    default:
      return null;
  }
}
