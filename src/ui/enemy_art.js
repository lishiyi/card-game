/**
 * Hero-tier hand-crafted inline SVG illustrations for all 40 Spire enemies
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
            <linearGradient id="ea-cult-robe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(212, 48%, 36%)" />
              <stop offset="100%" stop-color="hsl(224, 48%, 15%)" />
            </linearGradient>
            <linearGradient id="ea-cult-plume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(188, 72%, 62%)" />
              <stop offset="100%" stop-color="hsl(206, 56%, 30%)" />
            </linearGradient>
            <linearGradient id="ea-cult-beak" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(44, 42%, 90%)" />
              <stop offset="100%" stop-color="hsl(34, 24%, 60%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="36" ry="6.5" fill="hsla(0,0%,0%,0.5)" />
          <!-- Flowing hooded ritual robe -->
          <path d="M36 44 Q60 34 84 44 L95 104 Q76 100 60 105 Q44 100 25 104 Z" fill="url(#ea-cult-robe)" stroke="hsl(198, 52%, 52%)" stroke-width="1.8" />
          <!-- Gold ritual stole -->
          <path d="M51 44 L47 98 L56 96 L59 46 Z" fill="hsl(42, 72%, 54%)" opacity="0.88" />
          <path d="M69 44 L73 98 L64 96 L61 46 Z" fill="hsl(42, 72%, 54%)" opacity="0.88" />
          <!-- Feathered raven crest -->
          <path d="M44 26 L34 10 L51 19 L59 6 L66 19 L82 9 L75 26 Z" fill="url(#ea-cult-plume)" stroke="hsl(192, 76%, 72%)" stroke-width="1.2" />
          <!-- Cowl & hooked raven beak mask -->
          <path d="M42 24 Q60 14 78 26 L75 46 Q60 52 44 45 Z" fill="hsl(220, 44%, 18%)" stroke="hsl(200, 46%, 44%)" stroke-width="1.5" />
          <path d="M45 25 Q61 18 74 28 L68 45 L30 41 Q38 33 45 25 Z" fill="url(#ea-cult-beak)" stroke="hsl(28, 22%, 26%)" stroke-width="1.6" />
          <path d="M30 41 Q45 38 64 41" stroke="hsl(28, 22%, 30%)" stroke-width="1.3" fill="none" />
          <!-- Glowing amber ritual eye -->
          <circle cx="55" cy="31" r="4.4" fill="hsla(38, 96%, 58%, 0.35)" />
          <circle cx="55" cy="31" r="2.6" fill="hsl(44, 100%, 66%)" />
          <!-- Curved sacrificial kris dagger -->
          <path d="M22 64 Q10 44 27 28 Q22 44 33 58 Z" fill="url(#ea-cult-beak)" stroke="hsl(42, 80%, 58%)" stroke-width="1.4" />
          <rect x="23" y="59" width="12" height="4" rx="1.5" transform="rotate(-24 29 61)" fill="hsl(42, 76%, 54%)" />
          <circle cx="19" cy="40" r="2" fill="hsl(188, 92%, 68%)" />
        </svg>
      `;

    case 'jaw_worm':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-jw-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(202, 34%, 44%)" />
              <stop offset="100%" stop-color="hsl(214, 34%, 20%)" />
            </linearGradient>
            <linearGradient id="ea-jw-plate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(40, 42%, 82%)" />
              <stop offset="100%" stop-color="hsl(30, 28%, 46%)" />
            </linearGradient>
            <radialGradient id="ea-jw-maw" cx="40%" cy="50%" r="60%">
              <stop offset="0%" stop-color="hsl(6, 72%, 44%)" />
              <stop offset="100%" stop-color="hsl(354, 62%, 18%)" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="105" rx="44" ry="7" fill="hsla(0,0%,0%,0.48)" />
          <!-- Dorsal armored bone plates -->
          <polygon points="40,46 49,26 58,43" fill="url(#ea-jw-plate)" stroke="hsl(28, 22%, 26%)" stroke-width="1.4" />
          <polygon points="56,42 68,24 76,43" fill="url(#ea-jw-plate)" stroke="hsl(28, 22%, 26%)" stroke-width="1.4" />
          <polygon points="73,44 86,31 90,52" fill="url(#ea-jw-plate)" stroke="hsl(28, 22%, 26%)" stroke-width="1.4" />
          <!-- Segmented armored worm torso -->
          <path d="M22 86 Q20 46 58 40 Q96 36 100 76 Q102 98 76 101 L32 101 Q22 98 22 86 Z" fill="url(#ea-jw-body)" stroke="hsl(36, 32%, 62%)" stroke-width="2" />
          <path d="M68 44 Q74 72 68 98 M84 48 Q89 74 82 97" stroke="hsla(210, 40%, 10%, 0.45)" stroke-width="2.5" fill="none" />
          <!-- Gaping crimson maw & interlocking fangs -->
          <path d="M22 68 Q46 56 66 72 Q46 94 23 86 Z" fill="url(#ea-jw-maw)" stroke="hsl(352, 52%, 24%)" stroke-width="1.8" />
          <polygon points="27,68 32,79 37,66" fill="hsl(44, 46%, 92%)" />
          <polygon points="39,65 44,78 49,65" fill="hsl(44, 46%, 92%)" />
          <polygon points="51,66 55,76 60,69" fill="hsl(44, 46%, 92%)" />
          <polygon points="30,86 35,76 40,88" fill="hsl(44, 46%, 92%)" />
          <polygon points="43,88 48,77 53,86" fill="hsl(44, 46%, 92%)" />
          <!-- Fierce glowing eye -->
          <circle cx="51" cy="53" r="6" fill="hsla(38, 96%, 56%, 0.3)" />
          <circle cx="51" cy="53" r="3.8" fill="hsl(44, 98%, 64%)" />
          <circle cx="50" cy="53" r="1.5" fill="hsl(12, 80%, 24%)" />
        </svg>
      `;

    case 'red_louse':
    case 'green_louse': {
      const isRed = artKey === 'red_louse';
      const id = isRed ? 'rl' : 'gl';
      const topC = isRed ? 'hsl(12, 74%, 54%)' : 'hsl(148, 56%, 48%)';
      const botC = isRed ? 'hsl(4, 62%, 26%)' : 'hsl(158, 54%, 20%)';
      const rimC = isRed ? 'hsl(28, 86%, 68%)' : 'hsl(144, 72%, 66%)';
      const spotC = isRed ? 'hsl(32, 92%, 70%)' : 'hsl(120, 78%, 66%)';
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-${id}-shell" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${topC}" />
              <stop offset="100%" stop-color="${botC}" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="104" rx="38" ry="6.5" fill="hsla(0,0%,0%,0.46)" />
          <!-- Tiny legs -->
          <path d="M36 94 L32 102 M50 95 L48 103 M66 95 L68 103 M80 94 L84 102" stroke="${rimC}" stroke-width="2.6" stroke-linecap="round" />
          <!-- Segmented pill-bug carapace -->
          <path d="M22 93 Q24 46 61 46 Q98 46 98 93 Q60 99 22 93 Z" fill="url(#ea-${id}-shell)" stroke="${rimC}" stroke-width="2.2" />
          <!-- Specular shell highlight -->
          <path d="M36 58 Q60 49 84 58" stroke="hsla(0,0%,100%,0.28)" stroke-width="3.2" stroke-linecap="round" fill="none" />
          <!-- Carapace plates -->
          <path d="M44 50 Q48 72 45 95 M62 47 Q65 72 62 96 M80 51 Q80 72 78 94" stroke="hsla(0,0%,0%,0.38)" stroke-width="2.4" fill="none" />
          <!-- Antennae & bright eyes -->
          <path d="M26 74 Q16 64 13 54 M31 69 Q24 56 24 47" stroke="${rimC}" stroke-width="2.2" stroke-linecap="round" fill="none" />
          <circle cx="13" cy="54" r="2.2" fill="${spotC}" />
          <circle cx="24" cy="47" r="2.2" fill="${spotC}" />
          <circle cx="34" cy="77" r="5" fill="hsla(44, 98%, 62%, 0.3)" />
          <circle cx="34" cy="77" r="3.2" fill="hsl(48, 100%, 68%)" />
          <circle cx="33" cy="77" r="1.3" fill="hsl(20, 60%, 16%)" />
          <!-- Back spots -->
          <circle cx="53" cy="64" r="3" fill="${spotC}" opacity="0.65" />
          <circle cx="71" cy="66" r="3.5" fill="${spotC}" opacity="0.65" />
        </svg>
      `;
    }

    case 'acid_slime':
    case 'spike_slime': {
      const isSpike = artKey === 'spike_slime';
      const id = isSpike ? 'ss' : 'as';
      const topC = isSpike ? 'hsl(204, 56%, 54%)' : 'hsl(134, 62%, 48%)';
      const botC = isSpike ? 'hsl(218, 52%, 22%)' : 'hsl(150, 56%, 18%)';
      const rimC = isSpike ? 'hsl(196, 84%, 72%)' : 'hsl(126, 86%, 66%)';
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-${id}-body" cx="42%" cy="35%" r="65%">
              <stop offset="0%" stop-color="${topC}" />
              <stop offset="100%" stop-color="${botC}" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="105" rx="42" ry="6.5" fill="hsla(0,0%,0%,0.45)" />
          ${
            isSpike
              ? `<polygon points="32,56 38,34 48,51 59,25 70,51 82,34 88,56" fill="hsl(198, 62%, 72%)" stroke="hsl(206, 68%, 34%)" stroke-width="1.5" />`
              : `<circle cx="30" cy="46" r="4" fill="hsl(124, 86%, 62%)" opacity="0.7" /><circle cx="88" cy="42" r="3" fill="hsl(124, 86%, 62%)" opacity="0.6" />`
          }
          <!-- Gelatinous translucent slime body -->
          <path d="M18 96 Q17 48 60 47 Q103 48 102 96 Q82 103 60 100 Q38 103 18 96 Z" fill="url(#ea-${id}-body)" stroke="${rimC}" stroke-width="2.2" />
          <!-- Glossy highlights & floating bubbles -->
          <path d="M33 62 Q42 53 56 54" stroke="hsla(0,0%,100%,0.42)" stroke-width="3.2" stroke-linecap="round" fill="none" />
          <circle cx="82" cy="70" r="4" fill="hsla(0,0%,100%,0.18)" />
          <circle cx="76" cy="84" r="2.5" fill="hsla(0,0%,100%,0.22)" />
          <circle cx="34" cy="85" r="3" fill="hsla(0,0%,100%,0.18)" />
          <!-- Expressive glowing eyes & gooey grin -->
          <circle cx="45" cy="74" r="5.5" fill="hsla(48, 98%, 62%, 0.28)" />
          <circle cx="45" cy="74" r="3.6" fill="hsl(48, 100%, 68%)" />
          <circle cx="73" cy="74" r="5.5" fill="hsla(48, 98%, 62%, 0.28)" />
          <circle cx="73" cy="74" r="3.6" fill="hsl(48, 100%, 68%)" />
          <path d="M44 86 Q59 93 74 86" stroke="hsl(48, 56%, 88%)" stroke-width="2.4" fill="none" stroke-linecap="round" />
        </svg>
      `;
    }

    case 'fungi_beast':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-fb-cap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(338, 72%, 54%)" />
              <stop offset="100%" stop-color="hsl(326, 62%, 26%)" />
            </linearGradient>
            <linearGradient id="ea-fb-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(272, 32%, 38%)" />
              <stop offset="100%" stop-color="hsl(268, 36%, 18%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="106" rx="40" ry="6.5" fill="hsla(0,0%,0%,0.48)" />
          <!-- Floating toxic spore motes -->
          <circle cx="22" cy="34" r="3" fill="hsl(142, 86%, 62%)" opacity="0.7" />
          <circle cx="96" cy="30" r="2.5" fill="hsl(142, 86%, 62%)" opacity="0.65" />
          <circle cx="88" cy="20" r="2" fill="hsl(48, 96%, 72%)" opacity="0.75" />
          <!-- Beast body & claws -->
          <path d="M26 96 Q28 58 60 56 Q92 58 94 96 Q76 102 60 99 Q44 102 26 96 Z" fill="url(#ea-fb-body)" stroke="hsl(278, 42%, 56%)" stroke-width="1.8" />
          <path d="M36 96 L32 103 M44 97 L42 103 M76 97 L78 103 M84 96 L88 103" stroke="hsl(42, 42%, 78%)" stroke-width="2.4" stroke-linecap="round" />
          <!-- Giant spotted mushroom cap -->
          <path d="M16 62 Q60 12 104 62 Q60 74 16 62 Z" fill="url(#ea-fb-cap)" stroke="hsl(344, 82%, 68%)" stroke-width="2" />
          <path d="M24 62 Q60 70 96 62" stroke="hsl(42, 52%, 72%)" stroke-width="2" opacity="0.75" fill="none" />
          <circle cx="42" cy="45" r="5.5" fill="hsl(46, 92%, 78%)" />
          <circle cx="62" cy="35" r="6.5" fill="hsl(46, 92%, 78%)" />
          <circle cx="80" cy="47" r="4.8" fill="hsl(46, 92%, 78%)" />
          <circle cx="52" cy="53" r="3" fill="hsl(46, 92%, 78%)" opacity="0.8" />
          <!-- Glowing eyes & fangs -->
          <circle cx="47" cy="78" r="5.2" fill="hsla(44, 98%, 62%, 0.32)" />
          <circle cx="47" cy="78" r="3.4" fill="hsl(46, 100%, 66%)" />
          <circle cx="73" cy="78" r="5.2" fill="hsla(44, 98%, 62%, 0.32)" />
          <circle cx="73" cy="78" r="3.4" fill="hsl(46, 100%, 66%)" />
          <polygon points="52,88 55,94 58,88" fill="hsl(42, 48%, 88%)" />
          <polygon points="62,88 65,94 68,88" fill="hsl(42, 48%, 88%)" />
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
            <linearGradient id="ea-gn-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(12, 68%, 46%)" />
              <stop offset="100%" stop-color="hsl(4, 58%, 20%)" />
            </linearGradient>
            <linearGradient id="ea-gn-club" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(40, 38%, 86%)" />
              <stop offset="100%" stop-color="hsl(28, 24%, 48%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="109" rx="44" ry="7" fill="hsla(0,0%,0%,0.52)" />
          <!-- Massive bone war-club -->
          <path d="M90 16 L108 14 L100 86 L86 84 Z" fill="url(#ea-gn-club)" stroke="hsl(26, 26%, 24%)" stroke-width="1.8" />
          <circle cx="98" cy="24" r="3" fill="hsl(12, 62%, 38%)" />
          <circle cx="96" cy="40" r="2.5" fill="hsl(12, 62%, 38%)" />
          <!-- Hulking brute torso & leather harness -->
          <path d="M22 44 Q58 26 92 44 L84 103 L30 103 Z" fill="url(#ea-gn-body)" stroke="hsl(26, 54%, 58%)" stroke-width="2" />
          <path d="M32 52 L82 86 M36 86 L80 54" stroke="hsl(28, 36%, 22%)" stroke-width="5" opacity="0.7" />
          <rect x="33" y="84" width="50" height="9" rx="2" fill="hsl(28, 32%, 20%)" stroke="hsl(40, 62%, 56%)" stroke-width="1.4" />
          <!-- Swept brute horns -->
          <path d="M40 26 Q20 8 15 24 Q26 38 42 36 Z" fill="url(#ea-gn-club)" stroke="hsl(26, 24%, 28%)" stroke-width="1.4" />
          <path d="M76 26 Q96 8 101 24 Q90 38 74 36 Z" fill="url(#ea-gn-club)" stroke="hsl(26, 24%, 28%)" stroke-width="1.4" />
          <!-- Snarling head, brow & tusks -->
          <rect x="40" y="20" width="36" height="28" rx="9" fill="url(#ea-gn-body)" stroke="hsl(20, 44%, 22%)" stroke-width="2" />
          <path d="M45 29 L55 33 M71 29 L61 33" stroke="hsl(10, 60%, 16%)" stroke-width="2.6" stroke-linecap="round" />
          <circle cx="50" cy="34" r="3.4" fill="hsl(48, 100%, 64%)" />
          <circle cx="66" cy="34" r="3.4" fill="hsl(48, 100%, 64%)" />
          <polygon points="45,48 49,38 53,48" fill="hsl(44, 52%, 92%)" />
          <polygon points="63,48 67,38 71,48" fill="hsl(44, 52%, 92%)" />
        </svg>
      `;

    case 'sentry':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-st-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(42, 56%, 62%)" />
              <stop offset="55%" stop-color="hsl(34, 42%, 38%)" />
              <stop offset="100%" stop-color="hsl(26, 36%, 20%)" />
            </linearGradient>
            <radialGradient id="ea-st-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="hsl(186, 100%, 92%)" />
              <stop offset="55%" stop-color="hsl(192, 92%, 58%)" />
              <stop offset="100%" stop-color="hsl(206, 86%, 30%)" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="109" rx="28" ry="5.5" fill="hsla(0,0%,0%,0.48)" />
          <!-- Orbiting arcane rings -->
          <ellipse cx="60" cy="56" rx="40" ry="12" fill="none" stroke="hsla(192, 90%, 64%, 0.45)" stroke-width="1.6" stroke-dasharray="6 4" />
          <!-- Faceted ancient obelisk body -->
          <polygon points="60,10 88,56 60,102 32,56" fill="url(#ea-st-body)" stroke="hsl(44, 78%, 74%)" stroke-width="2.2" />
          <polygon points="60,10 88,56 60,56" fill="hsla(44, 90%, 84%, 0.16)" />
          <polygon points="60,24 76,56 60,88 44,56" fill="hsl(216, 34%, 14%)" stroke="hsl(40, 56%, 54%)" stroke-width="1.5" />
          <!-- Blazing plasma eye -->
          <circle cx="60" cy="56" r="14" fill="hsla(192, 96%, 62%, 0.25)" />
          <circle cx="60" cy="56" r="9.5" fill="url(#ea-st-core)" />
          <circle cx="60" cy="56" r="3.8" fill="hsl(0, 0%, 100%)" />
          <!-- Top & bottom resonance tips -->
          <circle cx="60" cy="16" r="2.4" fill="hsl(192, 96%, 72%)" />
          <circle cx="60" cy="96" r="2.4" fill="hsl(192, 96%, 72%)" />
        </svg>
      `;

    case 'lagavulin':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-lg-shell" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(32, 52%, 44%)" />
              <stop offset="100%" stop-color="hsl(20, 44%, 18%)" />
            </linearGradient>
            <linearGradient id="ea-lg-claw" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(12, 70%, 50%)" />
              <stop offset="100%" stop-color="hsl(4, 60%, 24%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="48" ry="7" fill="hsla(0,0%,0%,0.54)" />
          <!-- Crown of jagged bronze shell spikes -->
          <polygon points="32,38 40,16 51,33 61,13 71,33 83,16 90,39" fill="hsl(38, 64%, 64%)" stroke="hsl(24, 38%, 22%)" stroke-width="1.5" />
          <!-- Heavy domed bronze carapace -->
          <path d="M16 93 Q20 30 60 28 Q100 30 104 93 Q60 100 16 93 Z" fill="url(#ea-lg-shell)" stroke="hsl(40, 72%, 64%)" stroke-width="2.4" />
          <path d="M26 52 Q60 40 94 52" stroke="hsla(42, 80%, 76%, 0.35)" stroke-width="2.4" fill="none" />
          <!-- Deep furnace cavity & burning eyes -->
          <ellipse cx="60" cy="72" rx="24" ry="16" fill="hsl(12, 40%, 8%)" stroke="hsl(36, 56%, 48%)" stroke-width="2" />
          <circle cx="50" cy="71" r="6" fill="hsla(8, 98%, 58%, 0.32)" />
          <circle cx="50" cy="71" r="3.6" fill="hsl(14, 100%, 62%)" />
          <circle cx="70" cy="71" r="6" fill="hsla(8, 98%, 58%, 0.32)" />
          <circle cx="70" cy="71" r="3.6" fill="hsl(14, 100%, 62%)" />
          <!-- Massive crab pincers -->
          <path d="M10 88 Q4 66 25 68 L34 96 Q20 100 10 88 Z" fill="url(#ea-lg-claw)" stroke="hsl(38, 64%, 66%)" stroke-width="1.8" />
          <path d="M110 88 Q116 66 95 68 L86 96 Q100 100 110 88 Z" fill="url(#ea-lg-claw)" stroke="hsl(38, 64%, 66%)" stroke-width="1.8" />
        </svg>
      `;

    // =========================================================================
    // ACT 1 BOSSES
    // =========================================================================
    case 'the_guardian':
      if (mode === 'defensive') {
        return `
          <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
            <defs>
              <radialGradient id="ea-gd-orb" cx="42%" cy="38%" r="62%">
                <stop offset="0%" stop-color="hsl(38, 52%, 52%)" />
                <stop offset="100%" stop-color="hsl(26, 40%, 18%)" />
              </radialGradient>
              <radialGradient id="ea-gd-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="hsl(186, 100%, 92%)" />
                <stop offset="60%" stop-color="hsl(188, 86%, 54%)" />
                <stop offset="100%" stop-color="hsl(204, 80%, 28%)" />
              </radialGradient>
            </defs>
            <ellipse cx="60" cy="109" rx="42" ry="7" fill="hsla(0,0%,0%,0.54)" />
            <!-- 8 Spiked armor barbs -->
            <polygon points="60,8 68,26 52,26" fill="hsl(40, 74%, 70%)" stroke="hsl(24, 30%, 22%)" stroke-width="1.3" />
            <polygon points="60,108 68,90 52,90" fill="hsl(40, 74%, 70%)" stroke="hsl(24, 30%, 22%)" stroke-width="1.3" />
            <polygon points="10,58 28,50 28,66" fill="hsl(40, 74%, 70%)" stroke="hsl(24, 30%, 22%)" stroke-width="1.3" />
            <polygon points="110,58 92,50 92,66" fill="hsl(40, 74%, 70%)" stroke="hsl(24, 30%, 22%)" stroke-width="1.3" />
            <polygon points="24,22 40,30 31,40" fill="hsl(40, 74%, 70%)" />
            <polygon points="96,22 80,30 89,40" fill="hsl(40, 74%, 70%)" />
            <polygon points="24,94 40,86 31,76" fill="hsl(40, 74%, 70%)" />
            <polygon points="96,94 80,86 89,76" fill="hsl(40, 74%, 70%)" />
            <circle cx="60" cy="58" r="34" fill="url(#ea-gd-orb)" stroke="hsl(42, 78%, 68%)" stroke-width="3" />
            <circle cx="60" cy="58" r="22" fill="none" stroke="hsl(28, 34%, 22%)" stroke-width="2.5" stroke-dasharray="8 5" />
            <circle cx="60" cy="58" r="14" fill="url(#ea-gd-core)" stroke="hsl(42, 92%, 82%)" stroke-width="1.8" />
            <circle cx="60" cy="58" r="5" fill="hsl(0, 0%, 100%)" />
          </svg>
        `;
      }
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-gu-frame" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(38, 52%, 48%)" />
              <stop offset="100%" stop-color="hsl(26, 40%, 18%)" />
            </linearGradient>
            <linearGradient id="ea-gu-blade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(42, 54%, 80%)" />
              <stop offset="100%" stop-color="hsl(30, 32%, 38%)" />
            </linearGradient>
            <radialGradient id="ea-gu-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="hsl(186, 100%, 92%)" />
              <stop offset="60%" stop-color="hsl(190, 90%, 56%)" />
              <stop offset="100%" stop-color="hsl(206, 84%, 28%)" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="110" rx="46" ry="7" fill="hsla(0,0%,0%,0.54)" />
          <!-- Twin scythe blade arms -->
          <path d="M26 36 L8 64 L20 96 L33 68 Z" fill="url(#ea-gu-blade)" stroke="hsl(26, 26%, 20%)" stroke-width="1.8" />
          <path d="M94 36 L112 64 L100 96 L87 68 Z" fill="url(#ea-gu-blade)" stroke="hsl(26, 26%, 20%)" stroke-width="1.8" />
          <!-- Faceted armored hull -->
          <polygon points="28,34 60,12 92,34 86,96 60,106 34,96" fill="url(#ea-gu-frame)" stroke="hsl(42, 78%, 68%)" stroke-width="2.5" />
          <polygon points="60,12 92,34 60,34" fill="hsla(44, 92%, 82%, 0.16)" />
          <!-- Armored visor slit & chest plates -->
          <path d="M40 34 L80 34 L74 42 L46 42 Z" fill="hsl(216, 36%, 12%)" stroke="hsl(40, 62%, 56%)" stroke-width="1.2" />
          <circle cx="52" cy="38" r="2.2" fill="hsl(190, 98%, 70%)" />
          <circle cx="68" cy="38" r="2.2" fill="hsl(190, 98%, 70%)" />
          <!-- Glowing crystal core -->
          <polygon points="60,46 76,66 60,86 44,66" fill="url(#ea-gu-core)" stroke="hsl(44, 92%, 82%)" stroke-width="2.2" />
          <circle cx="60" cy="66" r="5.5" fill="hsl(0, 0%, 100%)" />
        </svg>
      `;

    case 'hexaghost':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-hx-body" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stop-color="hsl(162, 92%, 72%)" />
              <stop offset="55%" stop-color="hsl(166, 72%, 38%)" />
              <stop offset="100%" stop-color="hsl(178, 66%, 14%)" />
            </radialGradient>
            <linearGradient id="ea-hx-flame" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="hsl(160, 88%, 48%)" />
              <stop offset="100%" stop-color="hsl(152, 100%, 84%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="110" rx="40" ry="6" fill="hsla(164, 70%, 12%, 0.6)" />
          <!-- Spectral hexagram ring -->
          <polygon points="60,16 96,37 96,79 60,100 24,79 24,37" fill="none" stroke="hsl(162, 78%, 54%)" stroke-width="2" stroke-dasharray="6 4" opacity="0.7" />
          <!-- 6 Blazing ghost flames at vertices -->
          <path d="M60 6 Q67 16 60 25 Q53 16 60 6 Z" fill="url(#ea-hx-flame)" />
          <path d="M97 26 Q104 36 97 44 Q90 36 97 26 Z" fill="url(#ea-hx-flame)" />
          <path d="M97 70 Q104 80 97 88 Q90 80 97 70 Z" fill="url(#ea-hx-flame)" />
          <path d="M60 92 Q67 101 60 110 Q53 101 60 92 Z" fill="url(#ea-hx-flame)" />
          <path d="M23 70 Q30 80 23 88 Q16 80 23 70 Z" fill="url(#ea-hx-flame)" />
          <path d="M23 26 Q30 36 23 44 Q16 36 23 26 Z" fill="url(#ea-hx-flame)" />
          <!-- Central spectral orb -->
          <circle cx="60" cy="58" r="27" fill="url(#ea-hx-body)" stroke="hsl(156, 94%, 74%)" stroke-width="2.4" />
          <circle cx="60" cy="58" r="18" fill="none" stroke="hsla(156, 100%, 84%, 0.4)" stroke-width="1.5" />
          <!-- Hollow haunting eyes -->
          <ellipse cx="51" cy="54" rx="4.2" ry="6" fill="hsl(178, 60%, 10%)" />
          <ellipse cx="69" cy="54" rx="4.2" ry="6" fill="hsl(178, 60%, 10%)" />
          <circle cx="51" cy="53" r="1.8" fill="hsl(156, 100%, 86%)" />
          <circle cx="69" cy="53" r="1.8" fill="hsl(156, 100%, 86%)" />
          <path d="M51 67 Q60 73 69 67" stroke="hsl(178, 60%, 10%)" stroke-width="2.6" stroke-linecap="round" fill="none" />
        </svg>
      `;

    case 'slime_boss':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-slb-body" cx="44%" cy="35%" r="65%">
              <stop offset="0%" stop-color="hsl(130, 68%, 52%)" />
              <stop offset="65%" stop-color="hsl(140, 58%, 32%)" />
              <stop offset="100%" stop-color="hsl(154, 56%, 16%)" />
            </radialGradient>
            <linearGradient id="ea-slb-hat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(42, 62%, 44%)" />
              <stop offset="100%" stop-color="hsl(30, 48%, 20%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="48" ry="7.5" fill="hsla(0,0%,0%,0.54)" />
          <!-- Huge colossal gelatinous boss -->
          <path d="M12 96 Q12 36 60 36 Q108 36 108 96 Q84 106 60 102 Q36 106 12 96 Z" fill="url(#ea-slb-body)" stroke="hsl(126, 82%, 64%)" stroke-width="2.6" />
          <!-- Glossy rim & dripping slime -->
          <path d="M26 56 Q38 44 54 45" stroke="hsla(0,0%,100%,0.38)" stroke-width="3.6" stroke-linecap="round" fill="none" />
          <circle cx="88" cy="68" r="5" fill="hsla(0,0%,100%,0.18)" />
          <circle cx="28" cy="84" r="4" fill="hsla(0,0%,100%,0.16)" />
          <!-- Dapper gentleman bowler hat & gold band -->
          <ellipse cx="60" cy="36" rx="28" ry="6.5" fill="hsl(32, 46%, 22%)" stroke="hsl(44, 78%, 60%)" stroke-width="1.8" />
          <path d="M40 35 Q42 15 60 15 Q78 15 80 35 Z" fill="url(#ea-slb-hat)" stroke="hsl(44, 78%, 60%)" stroke-width="1.8" />
          <path d="M41 31 Q60 34 79 31" stroke="hsl(44, 92%, 64%)" stroke-width="3" fill="none" />
          <!-- Boss eyes, monocle & fierce grin -->
          <circle cx="44" cy="68" r="6" fill="hsl(48, 100%, 66%)" stroke="hsl(148, 60%, 16%)" stroke-width="1.5" />
          <circle cx="76" cy="68" r="6" fill="hsl(48, 100%, 66%)" stroke="hsl(44, 92%, 68%)" stroke-width="2" />
          <circle cx="45" cy="68" r="2.2" fill="hsl(150, 60%, 14%)" />
          <circle cx="75" cy="68" r="2.2" fill="hsl(150, 60%, 14%)" />
          <path d="M38 83 Q60 95 82 83" stroke="hsl(48, 72%, 90%)" stroke-width="3" stroke-linecap="round" fill="none" />
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
            <linearGradient id="ea-bk-cover" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(354, 64%, 44%)" />
              <stop offset="100%" stop-color="hsl(346, 62%, 20%)" />
            </linearGradient>
            <linearGradient id="ea-bk-blade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="hsl(206, 42%, 94%)" />
              <stop offset="100%" stop-color="hsl(214, 24%, 52%)" />
            </linearGradient>
          </defs>
          <ellipse cx="62" cy="109" rx="34" ry="5.5" fill="hsla(0,0%,0%,0.5)" />
          <!-- Fan of levitating stabbing daggers -->
          <polygon points="8,36 38,44 38,49" fill="url(#ea-bk-blade)" stroke="hsl(212, 32%, 34%)" stroke-width="1" />
          <polygon points="4,56 38,56 38,61" fill="url(#ea-bk-blade)" stroke="hsl(212, 32%, 34%)" stroke-width="1" />
          <polygon points="10,78 38,68 38,73" fill="url(#ea-bk-blade)" stroke="hsl(212, 32%, 34%)" stroke-width="1" />
          <polygon points="112,48 88,52 88,57" fill="url(#ea-bk-blade)" stroke="hsl(212, 32%, 34%)" stroke-width="1" />
          <!-- Floating leather grimoire -->
          <path d="M40 20 L86 16 L92 94 L46 98 Z" fill="url(#ea-bk-cover)" stroke="hsl(42, 82%, 64%)" stroke-width="2.4" />
          <path d="M40 20 L48 22 L54 96 L46 98 Z" fill="hsl(344, 52%, 14%)" />
          <!-- Gold corner clasps -->
          <path d="M48 24 L82 21 L87 90 L53 93 Z" fill="none" stroke="hsl(42, 76%, 60%)" stroke-width="1.3" opacity="0.7" />
          <!-- Glowing cursed eye on cover -->
          <ellipse cx="68" cy="56" rx="14" ry="18" fill="hsl(346, 54%, 12%)" stroke="hsl(42, 86%, 66%)" stroke-width="2" />
          <ellipse cx="68" cy="56" rx="8" ry="11" fill="hsl(38, 98%, 58%)" />
          <rect x="66.5" y="47" width="3" height="18" rx="1.5" fill="hsl(348, 72%, 14%)" />
        </svg>
      `;

    case 'slaver_taskmaster':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-tm-coat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(14, 54%, 38%)" />
              <stop offset="100%" stop-color="hsl(8, 48%, 16%)" />
            </linearGradient>
          </defs>
          <ellipse cx="56" cy="108" rx="38" ry="6.5" fill="hsla(0,0%,0%,0.52)" />
          <!-- Cracking leather bullwhip -->
          <path d="M84 62 Q108 52 100 76 Q92 94 112 96" stroke="hsl(32, 68%, 56%)" stroke-width="3.2" stroke-linecap="round" fill="none" />
          <circle cx="112" cy="96" r="2.8" fill="hsl(12, 98%, 62%)" />
          <!-- Heavy crimson-brown taskmaster armor -->
          <path d="M26 42 Q56 28 84 42 L88 104 L24 104 Z" fill="url(#ea-tm-coat)" stroke="hsl(28, 66%, 58%)" stroke-width="2" />
          <path d="M26 44 Q40 34 52 44 M60 44 Q72 34 84 44" stroke="hsl(34, 42%, 68%)" stroke-width="3.5" stroke-linecap="round" fill="none" />
          <path d="M32 68 L80 68" stroke="hsl(38, 72%, 58%)" stroke-width="4" />
          <!-- Iron executioner hood & burning eyes -->
          <path d="M38 20 Q56 12 74 20 L74 44 Q56 49 38 44 Z" fill="hsl(16, 36%, 20%)" stroke="hsl(34, 62%, 58%)" stroke-width="1.8" />
          <polygon points="44,19 48,10 52,19" fill="hsl(36, 32%, 74%)" />
          <polygon points="60,19 64,10 68,19" fill="hsl(36, 32%, 74%)" />
          <circle cx="49" cy="32" r="3.2" fill="hsl(10, 98%, 62%)" />
          <circle cx="63" cy="32" r="3.2" fill="hsl(10, 98%, 62%)" />
        </svg>
      `;

    case 'gremlin_leader':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-gl-cape" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(20, 62%, 44%)" />
              <stop offset="100%" stop-color="hsl(12, 54%, 18%)" />
            </linearGradient>
            <linearGradient id="ea-gl-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(48, 96%, 72%)" />
              <stop offset="100%" stop-color="hsl(32, 76%, 40%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="108" rx="40" ry="6.5" fill="hsla(0,0%,0%,0.52)" />
          <!-- War standard banner on left -->
          <line x1="24" y1="14" x2="24" y2="104" stroke="hsl(34, 42%, 56%)" stroke-width="3.6" stroke-linecap="round" />
          <path d="M24 18 L48 26 L24 38 Z" fill="hsl(6, 78%, 46%)" stroke="hsl(44, 88%, 66%)" stroke-width="1.4" />
          <!-- Curved commander saber on right -->
          <path d="M84 56 Q104 38 106 20 Q92 26 78 48 Z" fill="hsl(38, 28%, 84%)" stroke="hsl(42, 76%, 58%)" stroke-width="1.4" />
          <!-- Armored commander cloak & torso -->
          <path d="M34 46 Q60 34 86 46 L90 104 L30 104 Z" fill="url(#ea-gl-cape)" stroke="hsl(40, 72%, 62%)" stroke-width="2" />
          <path d="M40 50 L80 50 L74 88 L46 88 Z" fill="hsl(14, 44%, 20%)" />
          <path d="M44 62 L76 62" stroke="url(#ea-gl-gold)" stroke-width="4" />
          <!-- Warlord crown & horned visage -->
          <polygon points="42,26 48,12 56,22 60,10 64,22 72,12 78,26" fill="url(#ea-gl-gold)" stroke="hsl(26, 46%, 24%)" stroke-width="1.2" />
          <rect x="44" y="25" width="32" height="22" rx="7" fill="url(#ea-gl-cape)" stroke="hsl(42, 74%, 60%)" stroke-width="1.8" />
          <circle cx="53" cy="35" r="3" fill="hsl(48, 100%, 66%)" />
          <circle cx="67" cy="35" r="3" fill="hsl(48, 100%, 66%)" />
        </svg>
      `;

    // =========================================================================
    // ACT 2 BOSSES
    // =========================================================================
    case 'bronze_automaton':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-ba-brass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(40, 62%, 56%)" />
              <stop offset="55%" stop-color="hsl(34, 50%, 36%)" />
              <stop offset="100%" stop-color="hsl(26, 44%, 18%)" />
            </linearGradient>
            <radialGradient id="ea-ba-beam" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="hsl(52, 100%, 92%)" />
              <stop offset="55%" stop-color="hsl(188, 94%, 60%)" />
              <stop offset="100%" stop-color="hsl(204, 84%, 30%)" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="110" rx="46" ry="7" fill="hsla(0,0%,0%,0.54)" />
          <!-- Twin hovering bronze orbs -->
          <circle cx="16" cy="40" r="9.5" fill="url(#ea-ba-brass)" stroke="hsl(188, 92%, 68%)" stroke-width="2" />
          <circle cx="16" cy="40" r="4" fill="hsl(188, 100%, 76%)" />
          <circle cx="104" cy="40" r="9.5" fill="url(#ea-ba-brass)" stroke="hsl(188, 92%, 68%)" stroke-width="2" />
          <circle cx="104" cy="40" r="4" fill="hsl(188, 100%, 76%)" />
          <!-- Colossal broad-shouldered mecha chassis -->
          <polygon points="24,32 96,32 86,102 34,102" fill="url(#ea-ba-brass)" stroke="hsl(46, 86%, 72%)" stroke-width="2.4" />
          <rect x="44" y="16" width="32" height="18" rx="5" fill="url(#ea-ba-brass)" stroke="hsl(46, 86%, 72%)" stroke-width="2" />
          <rect x="49" y="22" width="22" height="5" rx="2" fill="hsl(188, 98%, 68%)" />
          <!-- Hyperbeam chest reactor -->
          <circle cx="60" cy="64" r="18" fill="hsl(216, 40%, 14%)" stroke="hsl(46, 84%, 68%)" stroke-width="2.4" />
          <circle cx="60" cy="64" r="12" fill="url(#ea-ba-beam)" />
          <circle cx="60" cy="64" r="4.5" fill="hsl(0, 0%, 100%)" />
          <!-- Riveted waist plates -->
          <path d="M38 88 L82 88 M40 95 L80 95" stroke="hsl(26, 40%, 18%)" stroke-width="2.2" />
        </svg>
      `;

    case 'the_collector':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-tc-cloak" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(268, 52%, 34%)" />
              <stop offset="100%" stop-color="hsl(252, 54%, 12%)" />
            </linearGradient>
            <linearGradient id="ea-tc-fire" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="hsl(162, 92%, 48%)" />
              <stop offset="100%" stop-color="hsl(148, 100%, 84%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="110" rx="44" ry="7" fill="hsla(0,0%,0%,0.54)" />
          <!-- Twin towering throne torch pillars with green flames -->
          <rect x="20" y="34" width="12" height="68" rx="3" fill="hsl(260, 38%, 18%)" stroke="hsl(164, 72%, 52%)" stroke-width="1.6" />
          <rect x="88" y="34" width="12" height="68" rx="3" fill="hsl(260, 38%, 18%)" stroke="hsl(164, 72%, 52%)" stroke-width="1.6" />
          <path d="M26 12 Q34 24 26 35 Q18 24 26 12 Z" fill="url(#ea-tc-fire)" />
          <path d="M94 12 Q102 24 94 35 Q86 24 94 12 Z" fill="url(#ea-tc-fire)" />
          <!-- Sovereign shadow robe -->
          <path d="M32 42 Q60 30 88 42 L94 104 L26 104 Z" fill="url(#ea-tc-cloak)" stroke="hsl(278, 66%, 62%)" stroke-width="2" />
          <path d="M46 46 L60 98 L74 46" fill="none" stroke="hsl(44, 82%, 62%)" stroke-width="2" opacity="0.75" />
          <!-- Horned golden crown & shadow face -->
          <polygon points="44,24 50,10 60,20 70,10 76,24" fill="hsl(44, 92%, 64%)" stroke="hsl(28, 46%, 24%)" stroke-width="1.3" />
          <ellipse cx="60" cy="36" rx="14" ry="13" fill="hsl(262, 54%, 11%)" stroke="hsl(282, 62%, 58%)" stroke-width="1.8" />
          <circle cx="54" cy="35" r="3.4" fill="hsl(154, 100%, 66%)" />
          <circle cx="66" cy="35" r="3.4" fill="hsl(154, 100%, 66%)" />
        </svg>
      `;

    case 'the_champ':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-ch-steel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(214, 24%, 64%)" />
              <stop offset="100%" stop-color="hsl(220, 26%, 24%)" />
            </linearGradient>
            <linearGradient id="ea-ch-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(48, 96%, 72%)" />
              <stop offset="100%" stop-color="hsl(34, 78%, 42%)" />
            </linearGradient>
            <linearGradient id="ea-ch-cape" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(6, 76%, 46%)" />
              <stop offset="100%" stop-color="hsl(354, 68%, 22%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="110" rx="46" ry="7" fill="hsla(0,0%,0%,0.54)" />
          <!-- Royal arena crimson cape -->
          <path d="M24 44 L14 102 L102 102 L92 44 Z" fill="url(#ea-ch-cape)" stroke="hsl(44, 78%, 58%)" stroke-width="1.6" />
          <!-- Knight cuirass & champion belt -->
          <path d="M30 42 Q58 32 86 42 L82 100 L34 100 Z" fill="url(#ea-ch-steel)" stroke="hsl(212, 34%, 80%)" stroke-width="2" />
          <rect x="33" y="70" width="50" height="11" rx="2.5" fill="url(#ea-ch-gold)" stroke="hsl(28, 42%, 22%)" stroke-width="1.4" />
          <circle cx="58" cy="75.5" r="4.5" fill="hsl(6, 86%, 52%)" stroke="hsl(48, 96%, 80%)" stroke-width="1.3" />
          <!-- Crowned gladiator helm -->
          <polygon points="44,22 50,8 58,18 66,8 72,22" fill="url(#ea-ch-gold)" stroke="hsl(28, 42%, 24%)" stroke-width="1.2" />
          <rect x="42" y="20" width="32" height="24" rx="7" fill="url(#ea-ch-steel)" stroke="hsl(44, 80%, 66%)" stroke-width="1.8" />
          <rect x="47" y="29" width="22" height="6" rx="2" fill="hsl(224, 42%, 12%)" />
          <circle cx="53" cy="32" r="2.2" fill="hsl(46, 100%, 68%)" />
          <circle cx="63" cy="32" r="2.2" fill="hsl(46, 100%, 68%)" />
          <!-- Colossal greatsword -->
          <path d="M96 14 L104 10 L102 78 L92 78 Z" fill="hsl(212, 26%, 88%)" stroke="hsl(216, 24%, 34%)" stroke-width="1.5" />
          <rect x="85" y="76" width="26" height="6" rx="2" fill="url(#ea-ch-gold)" />
          <rect x="94" y="82" width="7" height="14" rx="2" fill="hsl(14, 52%, 28%)" />
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
            <linearGradient id="ea-gh-stone" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(216, 16%, 54%)" />
              <stop offset="60%" stop-color="hsl(220, 16%, 32%)" />
              <stop offset="100%" stop-color="hsl(224, 18%, 18%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="109" rx="40" ry="6.5" fill="hsla(0,0%,0%,0.54)" />
          <!-- Colossal carved stone monolith -->
          <path d="M26 24 Q60 12 94 24 L89 98 Q60 108 31 98 Z" fill="url(#ea-gh-stone)" stroke="hsl(212, 22%, 72%)" stroke-width="2.4" />
          <!-- Deep chiseled brow, nose ridge & stone cracks -->
          <path d="M34 40 L86 40" stroke="hsl(222, 22%, 16%)" stroke-width="4" stroke-linecap="round" />
          <path d="M60 40 L60 72 L53 72" stroke="hsl(222, 22%, 16%)" stroke-width="3.2" stroke-linecap="round" fill="none" />
          <path d="M30 68 L42 74 L35 84 M88 58 L78 66" stroke="hsl(192, 92%, 64%)" stroke-width="1.8" opacity="0.85" fill="none" />
          <!-- Glowing arcane eyes -->
          <rect x="40" y="46" width="14" height="7" rx="2.5" fill="hsl(222, 34%, 12%)" />
          <rect x="66" y="46" width="14" height="7" rx="2.5" fill="hsl(222, 34%, 12%)" />
          <circle cx="47" cy="49.5" r="2.8" fill="hsl(192, 98%, 70%)" />
          <circle cx="73" cy="49.5" r="2.8" fill="hsl(192, 98%, 70%)" />
          <!-- Solemn stone mouth -->
          <path d="M44 84 L76 84" stroke="hsl(222, 24%, 14%)" stroke-width="4.2" stroke-linecap="round" />
        </svg>
      `;

    case 'nemesis':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-nm-shroud" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(274, 42%, 34%)" />
              <stop offset="100%" stop-color="hsl(262, 54%, 10%)" />
            </linearGradient>
            <linearGradient id="ea-nm-scythe" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(354, 96%, 68%)" />
              <stop offset="100%" stop-color="hsl(340, 82%, 36%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="109" rx="36" ry="6" fill="hsla(276, 60%, 10%, 0.56)" />
          <!-- Sweeping ghostly crimson scythe -->
          <line x1="28" y1="22" x2="88" y2="100" stroke="hsl(272, 28%, 54%)" stroke-width="3.6" stroke-linecap="round" />
          <path d="M16 42 Q46 8 92 22 Q54 20 26 48 Z" fill="url(#ea-nm-scythe)" stroke="hsl(356, 100%, 82%)" stroke-width="1.4" />
          <!-- Ethereal floating reaper shroud -->
          <path d="M36 42 Q60 20 84 42 L94 102 Q76 94 60 104 Q44 94 26 102 Z" fill="url(#ea-nm-shroud)" stroke="hsl(284, 72%, 68%)" stroke-width="2" />
          <!-- Pale bone skull mask -->
          <circle cx="60" cy="38" r="14" fill="hsl(44, 34%, 88%)" stroke="hsl(276, 36%, 24%)" stroke-width="1.8" />
          <path d="M51 35 L57 38 L52 41 Z M69 35 L63 38 L68 41 Z" fill="hsl(354, 96%, 54%)" />
          <path d="M55 46 L65 46" stroke="hsl(276, 36%, 24%)" stroke-width="2" stroke-linecap="round" />
        </svg>
      `;

    case 'reptomancer':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-rm-robe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(152, 54%, 38%)" />
              <stop offset="100%" stop-color="hsl(164, 56%, 14%)" />
            </linearGradient>
            <linearGradient id="ea-rm-dag" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(296, 94%, 78%)" />
              <stop offset="100%" stop-color="hsl(274, 76%, 44%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="109" rx="38" ry="6" fill="hsla(0,0%,0%,0.52)" />
          <!-- Coiled serpent staff -->
          <line x1="22" y1="24" x2="26" y2="102" stroke="hsl(40, 62%, 56%)" stroke-width="4" stroke-linecap="round" />
          <path d="M16 26 Q22 14 29 22 Q24 30 16 26 Z" fill="hsl(136, 86%, 56%)" stroke="hsl(46, 88%, 68%)" stroke-width="1.3" />
          <!-- Orbiting arcane crystal dagger -->
          <polygon points="98,22 104,38 98,54 92,38" fill="url(#ea-rm-dag)" stroke="hsl(48, 92%, 78%)" stroke-width="1.3" />
          <!-- Scaled emerald robe & hood -->
          <path d="M34 44 Q60 32 86 44 L92 104 L28 104 Z" fill="url(#ea-rm-robe)" stroke="hsl(146, 68%, 58%)" stroke-width="2" />
          <path d="M44 46 L60 94 L76 46" fill="none" stroke="hsl(44, 82%, 60%)" stroke-width="2" opacity="0.8" />
          <path d="M40 44 Q44 14 60 14 Q76 14 80 44 Q60 52 40 44 Z" fill="url(#ea-rm-robe)" stroke="hsl(144, 72%, 62%)" stroke-width="1.8" />
          <ellipse cx="60" cy="35" rx="11" ry="9" fill="hsl(166, 54%, 10%)" />
          <!-- Glowing golden serpent eyes -->
          <ellipse cx="55" cy="35" rx="3" ry="2.2" fill="hsl(48, 100%, 66%)" />
          <ellipse cx="65" cy="35" rx="3" ry="2.2" fill="hsl(48, 100%, 66%)" />
        </svg>
      `;

    case 'dagger':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-dg-blade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(300, 100%, 88%)" />
              <stop offset="50%" stop-color="hsl(288, 86%, 62%)" />
              <stop offset="100%" stop-color="hsl(268, 72%, 34%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="106" rx="22" ry="5" fill="hsla(286, 70%, 16%, 0.5)" />
          <!-- Arcane glow halo -->
          <polygon points="60,8 78,66 60,76 42,66" fill="hsla(292, 96%, 68%, 0.2)" />
          <!-- Levitating runic crystal blade -->
          <polygon points="60,12 72,66 60,72 48,66" fill="url(#ea-dg-blade)" stroke="hsl(300, 100%, 88%)" stroke-width="1.8" />
          <line x1="60" y1="18" x2="60" y2="66" stroke="hsl(0, 0%, 100%)" stroke-width="1.8" opacity="0.7" />
          <!-- Gilded crossguard & pommel -->
          <rect x="42" y="68" width="36" height="7" rx="3" fill="hsl(44, 92%, 62%)" stroke="hsl(28, 46%, 26%)" stroke-width="1.3" />
          <rect x="56" y="75" width="8" height="18" rx="2" fill="hsl(276, 48%, 32%)" stroke="hsl(44, 82%, 64%)" stroke-width="1.2" />
          <circle cx="60" cy="96" r="4.5" fill="hsl(46, 98%, 68%)" />
        </svg>
      `;

    // =========================================================================
    // ACT 3 BOSSES
    // =========================================================================
    case 'time_eater':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-te-cloak" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(206, 52%, 40%)" />
              <stop offset="100%" stop-color="hsl(224, 54%, 15%)" />
            </linearGradient>
            <radialGradient id="ea-te-clock" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="hsl(48, 86%, 86%)" />
              <stop offset="70%" stop-color="hsl(214, 48%, 26%)" />
              <stop offset="100%" stop-color="hsl(224, 54%, 14%)" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="110" rx="46" ry="7" fill="hsla(0,0%,0%,0.54)" />
          <!-- Giant astral timepiece behind shoulder -->
          <circle cx="82" cy="48" r="24" fill="url(#ea-te-clock)" stroke="hsl(44, 90%, 66%)" stroke-width="3" />
          <circle cx="82" cy="48" r="18" fill="none" stroke="hsl(192, 92%, 68%)" stroke-width="1.4" stroke-dasharray="3 3" />
          <line x1="82" y1="48" x2="82" y2="34" stroke="hsl(46, 98%, 74%)" stroke-width="2.6" stroke-linecap="round" />
          <line x1="82" y1="48" x2="94" y2="54" stroke="hsl(192, 98%, 74%)" stroke-width="2.2" stroke-linecap="round" />
          <circle cx="82" cy="48" r="3" fill="hsl(48, 100%, 76%)" />
          <!-- Cloaked chronomancer snail-body -->
          <path d="M18 102 Q20 46 48 40 Q74 42 78 102 Z" fill="url(#ea-te-cloak)" stroke="hsl(196, 78%, 62%)" stroke-width="2" />
          <path d="M28 56 Q48 64 68 56" stroke="hsl(44, 84%, 64%)" stroke-width="2.2" fill="none" />
          <!-- Hooded eldritch head & glowing eyes -->
          <path d="M28 42 Q32 16 48 16 Q64 16 68 42 Q48 49 28 42 Z" fill="url(#ea-te-cloak)" stroke="hsl(196, 82%, 66%)" stroke-width="1.8" />
          <ellipse cx="48" cy="34" rx="11" ry="9" fill="hsl(224, 54%, 10%)" />
          <circle cx="43" cy="34" r="2.8" fill="hsl(48, 100%, 68%)" />
          <circle cx="53" cy="34" r="2.8" fill="hsl(48, 100%, 68%)" />
          <!-- Floating cyan time-warp rings -->
          <path d="M16 74 Q32 82 48 74" stroke="hsl(192, 92%, 66%)" stroke-width="2" opacity="0.7" fill="none" />
        </svg>
      `;

    case 'awakened_one':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-aw-wing" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(196, 72%, 52%)" />
              <stop offset="100%" stop-color="hsl(224, 58%, 18%)" />
            </linearGradient>
            <linearGradient id="ea-aw-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(212, 54%, 38%)" />
              <stop offset="100%" stop-color="hsl(232, 56%, 14%)" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="110" rx="46" ry="7" fill="hsla(198, 70%, 10%, 0.56)" />
          <!-- Eldritch cyan ritual aura -->
          <circle cx="60" cy="54" r="44" fill="hsla(192, 92%, 62%, 0.1)" />
          <!-- Sweeping spectral crow wings -->
          <path d="M44 48 L8 28 L16 68 L40 76 Z" fill="url(#ea-aw-wing)" stroke="hsl(188, 92%, 72%)" stroke-width="2" />
          <path d="M76 48 L112 28 L104 68 L80 76 Z" fill="url(#ea-aw-wing)" stroke="hsl(188, 92%, 72%)" stroke-width="2" />
          <!-- Armored feathered torso -->
          <path d="M38 42 Q60 32 82 42 L86 104 L34 104 Z" fill="url(#ea-aw-body)" stroke="hsl(192, 86%, 68%)" stroke-width="2" />
          <!-- Embedded crimson ritual dagger in chest -->
          <polygon points="60,52 65,70 60,84 55,70" fill="hsl(354, 92%, 60%)" stroke="hsl(44, 96%, 76%)" stroke-width="1.3" />
          <!-- Crowned pale raven-skull head -->
          <polygon points="48,18 54,6 60,16 66,6 72,18" fill="hsl(188, 94%, 68%)" />
          <path d="M46 20 Q60 12 74 20 L70 42 L60 48 L50 42 Z" fill="hsl(44, 38%, 88%)" stroke="hsl(216, 40%, 24%)" stroke-width="1.8" />
          <circle cx="54" cy="30" r="3.4" fill="hsl(354, 98%, 58%)" />
          <circle cx="66" cy="30" r="3.4" fill="hsl(354, 98%, 58%)" />
        </svg>
      `;

    case 'donu':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <radialGradient id="ea-dn-gold" cx="38%" cy="32%" r="68%">
              <stop offset="0%" stop-color="hsl(48, 96%, 72%)" />
              <stop offset="55%" stop-color="hsl(38, 76%, 48%)" />
              <stop offset="100%" stop-color="hsl(26, 62%, 22%)" />
            </radialGradient>
            <radialGradient id="ea-dn-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="hsl(186, 100%, 94%)" />
              <stop offset="60%" stop-color="hsl(188, 96%, 60%)" />
              <stop offset="100%" stop-color="hsl(206, 86%, 30%)" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="109" rx="42" ry="6.5" fill="hsla(0,0%,0%,0.54)" />
          <!-- Outer cosmic aura -->
          <circle cx="60" cy="56" r="45" fill="none" stroke="hsla(46, 94%, 68%, 0.35)" stroke-width="1.6" stroke-dasharray="6 5" />
          <!-- Radiant gilded torus body -->
          <circle cx="60" cy="56" r="38" fill="url(#ea-dn-gold)" stroke="hsl(48, 98%, 78%)" stroke-width="2.8" />
          <!-- Ornate ancient relief spokes -->
          <path d="M60 18 L60 32 M60 80 L60 94 M22 56 L36 56 M84 56 L98 56" stroke="hsl(48, 96%, 82%)" stroke-width="3" stroke-linecap="round" />
          <path d="M34 30 L43 39 M86 30 L77 39 M34 82 L43 73 M86 82 L77 73" stroke="hsl(30, 56%, 28%)" stroke-width="2.2" stroke-linecap="round" />
          <!-- Hollow torus eye & plasma core -->
          <circle cx="60" cy="56" r="16" fill="hsl(224, 42%, 11%)" stroke="hsl(48, 94%, 74%)" stroke-width="2.6" />
          <circle cx="60" cy="56" r="9" fill="url(#ea-dn-core)" />
          <circle cx="60" cy="56" r="3.5" fill="hsl(0, 0%, 100%)" />
        </svg>
      `;

    case 'deca':
      return `
        <svg viewBox="0 0 120 120" class="unit-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ea-dc-shell" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="hsl(220, 44%, 46%)" />
              <stop offset="55%" stop-color="hsl(226, 44%, 26%)" />
              <stop offset="100%" stop-color="hsl(232, 48%, 14%)" />
            </linearGradient>
            <radialGradient id="ea-dc-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="hsl(192, 100%, 94%)" />
              <stop offset="60%" stop-color="hsl(194, 96%, 60%)" />
              <stop offset="100%" stop-color="hsl(214, 86%, 32%)" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="109" rx="42" ry="6.5" fill="hsla(0,0%,0%,0.54)" />
          <!-- Orbiting square rune halo -->
          <polygon points="60,8 108,56 60,104 12,56" fill="none" stroke="hsla(194, 92%, 66%, 0.35)" stroke-width="1.6" stroke-dasharray="6 5" />
          <!-- Faceted ancient steel octahedron -->
          <polygon points="60,13 103,56 60,99 17,56" fill="url(#ea-dc-shell)" stroke="hsl(44, 86%, 68%)" stroke-width="2.8" />
          <polygon points="60,13 103,56 60,56" fill="hsla(204, 86%, 78%, 0.14)" />
          <!-- Inner gilded bastion frame & glowing core -->
          <rect x="40" y="36" width="40" height="40" rx="5" fill="hsl(226, 48%, 13%)" stroke="hsl(194, 90%, 66%)" stroke-width="2.2" />
          <circle cx="60" cy="56" r="11" fill="url(#ea-dc-core)" />
          <circle cx="60" cy="56" r="4.5" fill="hsl(0, 0%, 100%)" />
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

    default:
      return null;
  }
}
