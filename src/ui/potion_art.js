/**
 * Complete bespoke inline SVG illustration library for all 28 potions in POTION_LIBRARY.
 * Every single potion has its own distinct bottle silhouette, liquid gradient, and iconic
 * emblem so no two potions share the same shape or look alike in HUD, Rewards, Shop, or Compendium.
 */

export const POTION_ACCENT_COLORS = Object.freeze({
  fire_potion: 'hsl(18, 94%, 58%)',
  block_potion: 'hsl(204, 88%, 60%)',
  strength_potion: 'hsl(354, 88%, 58%)',
  energy_potion: 'hsl(46, 98%, 62%)',
  swift_potion: 'hsl(190, 92%, 60%)',
  fear_potion: 'hsl(338, 86%, 58%)',
  weak_potion: 'hsl(276, 68%, 64%)',
  dexterity_potion: 'hsl(148, 82%, 54%)',
  regen_potion: 'hsl(356, 92%, 58%)',
  explosive_potion: 'hsl(28, 96%, 58%)',
  poison_potion: 'hsl(112, 86%, 52%)',
  cunning_potion: 'hsl(166, 80%, 56%)',
  heart_of_iron: 'hsl(34, 68%, 58%)',
  fury_potion: 'hsl(8, 94%, 58%)',
  miracle_potion: 'hsl(48, 98%, 72%)',
  ambrosia: 'hsl(286, 88%, 68%)',
  ancient_potion: 'hsl(42, 82%, 62%)',
  speed_potion: 'hsl(164, 88%, 56%)',
  flex_potion: 'hsl(14, 90%, 60%)',
  gamblers_brew: 'hsl(246, 82%, 68%)',
  duplication_potion: 'hsl(308, 86%, 66%)',
  essence_of_steel: 'hsl(210, 56%, 70%)',
  blood_surge_potion: 'hsl(352, 92%, 56%)',
  elixir_potion: 'hsl(44, 86%, 72%)',
  ghost_in_a_jar: 'hsl(190, 86%, 74%)',
  phantom_draught: 'hsl(196, 76%, 64%)',
  stance_potion: 'hsl(280, 80%, 66%)',
  mantra_elixir: 'hsl(278, 86%, 68%)',
  focus_potion: 'hsl(196, 96%, 64%)',
  potion_of_capacity: 'hsl(208, 92%, 66%)',
  essence_of_darkness: 'hsl(282, 86%, 60%)',
  liquid_plasma: 'hsl(42, 98%, 64%)',
});

function wrapPotionSvg(id, defs, body) {
  return `<svg viewBox="0 0 28 28" class="potion-icon-svg" data-potion-icon="${id}" fill="none" aria-hidden="true">${defs ? `<defs>${defs}</defs>` : ''}${body}</svg>`;
}

function scopePotionSvgIds(svg, suffix) {
  if (!svg || !suffix) return svg;
  const safe = String(suffix).replace(/[^a-zA-Z0-9_-]/g, '_');
  return svg
    .replace(/\bid="([^"]+)"/g, (_, id) => `id="${id}-${safe}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${id}-${safe})`);
}

const GLASS = 'hsla(42, 54%, 92%, 0.84)';
const DARK_GLASS = 'hsla(24, 18%, 12%, 0.72)';

export const POTION_SVG_ART = Object.freeze({
  // 1. Fire Potion — Flame-teardrop bottle with roaring fire tongue & ember sparks
  fire_potion: wrapPotionSvg(
    'fire_potion',
    `<linearGradient id="pt-fire_potion-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(44, 100%, 66%)"/><stop offset="55%" stop-color="hsl(14, 96%, 54%)"/><stop offset="100%" stop-color="hsl(354, 92%, 40%)"/></linearGradient>`,
    `<rect x="11.4" y="2.2" width="5.2" height="2.6" rx="1" fill="hsl(28, 54%, 44%)" stroke="hsl(38, 66%, 72%)" stroke-width="0.9"/>
     <path d="M12 4.8 H16 V7.4 C19.5 10.2 21.8 14 21.2 18.2 A7.2 7.2 0 0 1 6.8 18.2 C6.2 14 8.5 10.2 12 7.4 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M14 9.2 Q19.2 14.5 18.8 18.4 A4.9 4.9 0 1 1 9.2 18.4 Q8.8 14.5 14 9.2 Z" fill="url(#pt-fire_potion-g)"/>
     <path d="M14 13.8 Q16.4 16.8 16 19.2 A2.1 2.1 0 1 1 12 19.2 Q11.6 16.8 14 13.8 Z" fill="hsl(52, 100%, 84%)"/>
     <circle cx="7.2" cy="8.2" r="1.1" fill="hsl(38, 100%, 68%)"/><circle cx="21" cy="9.4" r="0.9" fill="hsl(22, 100%, 64%)"/>`
  ),

  // 2. Block Potion — Hexagonal castle-shield cobalt bottle with iron cross crest
  block_potion: wrapPotionSvg(
    'block_potion',
    `<linearGradient id="pt-block_potion-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(194, 98%, 72%)"/><stop offset="100%" stop-color="hsl(210, 88%, 44%)"/></linearGradient>`,
    `<rect x="11" y="2.2" width="6" height="2.6" rx="1" fill="hsl(212, 34%, 56%)" stroke="hsl(204, 70%, 82%)" stroke-width="0.9"/>
     <path d="M11.6 4.8 H16.4 V7.2 L21.4 9.8 V15.4 C21.4 19.6 18.3 22.8 14 24.4 C9.7 22.8 6.6 19.6 6.6 15.4 V9.8 L11.6 7.2 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M8 12.2 H20 V15.4 C20 18.8 17.5 21.4 14 22.8 C10.5 21.4 8 18.8 8 15.4 Z" fill="url(#pt-block_potion-g)"/>
     <path d="M14 13.5 V20.4 M10.6 16.6 H17.4" stroke="hsla(198, 100%, 94%, 0.88)" stroke-width="1.6" stroke-linecap="round"/>`
  ),

  // 3. Strength Potion — Broad squat crimson warrior jug with gold upward power chevron
  strength_potion: wrapPotionSvg(
    'strength_potion',
    `<linearGradient id="pt-strength_potion-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(14, 96%, 62%)"/><stop offset="100%" stop-color="hsl(352, 90%, 38%)"/></linearGradient>`,
    `<rect x="10.4" y="2.4" width="7.2" height="2.8" rx="1" fill="hsl(28, 50%, 42%)" stroke="hsl(38, 64%, 72%)" stroke-width="0.9"/>
     <path d="M11 5.2 H17 V8 L21.8 11.4 V19.6 C21.8 22.4 19.6 24.2 16.8 24.2 H11.2 C8.4 24.2 6.2 22.4 6.2 19.6 V11.4 L11 8 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M7.6 13.4 H20.4 V19.4 C20.4 21.4 18.8 22.8 16.8 22.8 H11.2 C9.2 22.8 7.6 21.4 7.6 19.4 Z" fill="url(#pt-strength_potion-g)"/>
     <path d="M10.4 19 L14 15 L17.6 19 M11.4 21.6 L14 18.8 L16.6 21.6" fill="none" stroke="hsl(48, 100%, 78%)" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/>`
  ),

  // 4. Energy Potion — Faceted golden crystal diamond bottle with electric bolt
  energy_potion: wrapPotionSvg(
    'energy_potion',
    `<linearGradient id="pt-energy_potion-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(54, 100%, 78%)"/><stop offset="100%" stop-color="hsl(36, 98%, 48%)"/></linearGradient>`,
    `<rect x="11.4" y="2" width="5.2" height="2.4" rx="1" fill="hsl(38, 72%, 52%)" stroke="hsl(50, 100%, 84%)" stroke-width="0.9"/>
     <polygon points="12,4.4 16,4.4 16,6.8 22,14.8 14,24.6 6,14.8 12,6.8" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <polygon points="8,14.8 14,9.8 20,14.8 14,22.8" fill="url(#pt-energy_potion-g)"/>
     <polygon points="15.2,11.2 10.6,16.4 13.8,16.4 12.8,21.2 17.4,15.4 14.2,15.4" fill="hsl(26, 62%, 14%)"/>`
  ),

  // 5. Swift Potion — Tall aerodynamic sky-cyan bottle with soaring white wind-wings
  swift_potion: wrapPotionSvg(
    'swift_potion',
    `<linearGradient id="pt-swift_potion-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(182, 100%, 78%)"/><stop offset="100%" stop-color="hsl(198, 92%, 44%)"/></linearGradient>`,
    `<path d="M5.2 11.4 Q8.2 9.2 10.2 12.4 L8.4 14.4 Z M22.8 11.4 Q19.8 9.2 17.8 12.4 L19.6 14.4 Z" fill="hsl(192, 100%, 88%)" opacity="0.9"/>
     <rect x="11.6" y="2.2" width="4.8" height="2.4" rx="1" fill="hsl(30, 48%, 48%)" stroke="hsl(36, 62%, 74%)" stroke-width="0.9"/>
     <path d="M11.6 4.6 H16.4 V7.4 L18.4 10.4 V20.4 A4.4 4.4 0 0 1 14 24.6 A4.4 4.4 0 0 1 9.6 20.4 V10.4 L11.6 7.4 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M10.8 12.4 H17.2 V20.2 A3.2 3.2 0 0 1 10.8 20.2 Z" fill="url(#pt-swift_potion-g)"/>
     <path d="M11.4 15.8 H16.4 M12.2 18.6 H15.8" stroke="hsla(0, 0%, 100%, 0.84)" stroke-width="1.3" stroke-linecap="round"/>`
  ),

  // 6. Fear Potion — Jagged dark-crimson spiked bottle with cracked Vulnerable emblem
  fear_potion: wrapPotionSvg(
    'fear_potion',
    `<linearGradient id="pt-fear_potion-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(348, 94%, 64%)"/><stop offset="100%" stop-color="hsl(326, 86%, 32%)"/></linearGradient>`,
    `<rect x="11.4" y="2.2" width="5.2" height="2.5" rx="1" fill="hsl(338, 42%, 34%)" stroke="hsl(348, 72%, 68%)" stroke-width="0.9"/>
     <polygon points="12,4.7 16,4.7 16,7.6 21,11.6 18.8 16.2 21.4 20.4 14 24.6 6.6 20.4 9.2 16.2 7 11.6 12 7.6" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.25" stroke-linejoin="round"/>
     <polygon points="9.2,13.2 18.8,13.2 17.6,16.4 19.6,19.6 14,23.2 8.4,19.6 10.4,16.4" fill="url(#pt-fear_potion-g)"/>
     <path d="M14.6 13.6 L12.4 17.4 L15.4 18.4 L13 22.4" fill="none" stroke="hsl(48, 100%, 84%)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`
  ),

  // 7. Weak Potion — Crooked slouching violet-mauve bottle with drooping downward arrow
  weak_potion: wrapPotionSvg(
    'weak_potion',
    `<linearGradient id="pt-weak_potion-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(286, 78%, 70%)"/><stop offset="100%" stop-color="hsl(268, 66%, 36%)"/></linearGradient>`,
    `<rect x="12.4" y="2.2" width="5" height="2.4" rx="1" transform="rotate(14 14.9 3.4)" fill="hsl(28, 42%, 44%)" stroke="hsl(38, 56%, 70%)" stroke-width="0.9"/>
     <path d="M12.2 4.8 L16.8 5.8 L15.8 8.6 C19.8 11 21 15.6 19.4 19.8 C18 23.2 14.2 24.8 10.6 23.8 C6.8 22.8 5.6 18.6 7.4 14.4 C8.8 11 11.2 9.4 12 7.6 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M8.4 14.8 C11.8 13.8 15.2 15.6 18.6 14.8 C19.6 17.8 18.2 21.8 14.4 22.6 C10.4 23.4 7.4 20.6 8.4 14.8 Z" fill="url(#pt-weak_potion-g)"/>
     <path d="M13.6 16 V20.8 M11.4 18.8 L13.6 21 L15.8 18.8" fill="none" stroke="hsl(44, 100%, 82%)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`
  ),

  // 8. Dexterity Potion — Graceful emerald amphora with twin golden handles & agile chevron
  dexterity_potion: wrapPotionSvg(
    'dexterity_potion',
    `<linearGradient id="pt-dexterity_potion-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(142, 92%, 68%)"/><stop offset="100%" stop-color="hsl(158, 84%, 34%)"/></linearGradient>`,
    `<path d="M9.8 10.2 C6.4 10.2 5.6 14.2 8.2 16.4 M18.2 10.2 C21.6 10.2 22.4 14.2 19.8 16.4" fill="none" stroke="hsl(148, 86%, 64%)" stroke-width="1.5" stroke-linecap="round"/>
     <rect x="11.5" y="2.2" width="5" height="2.4" rx="1" fill="hsl(30, 48%, 46%)" stroke="hsl(42, 66%, 72%)" stroke-width="0.9"/>
     <path d="M11.6 4.6 H16.4 V7.4 C19.4 9.8 20.2 14.4 18.6 19 C17.5 22.2 15.8 24.2 14 24.4 C12.2 24.2 10.5 22.2 9.4 19 C7.8 14.4 8.6 9.8 11.6 7.4 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M9.8 13.4 H18.2 C18.4 16.6 17.2 20.6 14 23 C10.8 20.6 9.6 16.6 9.8 13.4 Z" fill="url(#pt-dexterity_potion-g)"/>
     <path d="M11.5 18.4 L14 15.2 L16.5 18.4" fill="none" stroke="hsl(136, 100%, 88%)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`
  ),

  // 9. Regen / Blood Potion — Iconic heart-shaped ruby phial with white healing cross
  regen_potion: wrapPotionSvg(
    'regen_potion',
    `<linearGradient id="pt-regen_potion-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(356, 98%, 64%)"/><stop offset="100%" stop-color="hsl(348, 92%, 36%)"/></linearGradient>`,
    `<rect x="11.6" y="2" width="4.8" height="2.6" rx="1" fill="hsl(34, 52%, 48%)" stroke="hsl(42, 68%, 76%)" stroke-width="0.9"/>
     <path d="M12.2 4.6 H15.8 V7.4 C18.2 6.2 21.8 7.8 21.8 11.8 C21.8 16.6 17.6 20.8 14 24.2 C10.4 20.8 6.2 16.6 6.2 11.8 C6.2 7.8 9.8 6.2 12.2 7.4 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M7.6 12.4 C7.6 16.2 11 19.6 14 22.6 C17 19.6 20.4 16.2 20.4 12.4 Z" fill="url(#pt-regen_potion-g)"/>
     <path d="M14 14.4 V19.6 M11.4 17 H16.6" stroke="hsl(0, 0%, 100%)" stroke-width="1.75" stroke-linecap="round"/>`
  ),

  // 10. Explosive Potion — Round iron bomb-flask with glowing fuse & sizzling star spark
  explosive_potion: wrapPotionSvg(
    'explosive_potion',
    `<radialGradient id="pt-explosive_potion-g" cx="38%" cy="35%" r="65%"><stop offset="0%" stop-color="hsl(44, 100%, 66%)"/><stop offset="65%" stop-color="hsl(18, 96%, 50%)"/><stop offset="100%" stop-color="hsl(354, 86%, 34%)"/></radialGradient>`,
    `<path d="M15.4 6.2 Q18 3.2 21.2 4.2" fill="none" stroke="hsl(36, 72%, 68%)" stroke-width="1.5" stroke-linecap="round"/>
     <polygon points="21.8,2.2 22.6,4 24.4,4.4 22.6,5.2 21.8,7 21,5.2 19.2,4.4 21,4" fill="hsl(48, 100%, 72%)"/>
     <rect x="11.6" y="5.4" width="4.8" height="2.4" rx="0.8" fill="hsl(220, 20%, 34%)" stroke="${GLASS}" stroke-width="1"/>
     <circle cx="13.8" cy="16.2" r="7.8" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.35"/>
     <circle cx="13.8" cy="16.4" r="6.1" fill="url(#pt-explosive_potion-g)"/>
     <polygon points="13.8,12.2 15,15.2 18,16.4 15,17.6 13.8,20.6 12.6,17.6 9.6,16.4 12.6,15.2" fill="hsl(52, 100%, 84%)"/>`
  ),

  // 11. Poison Potion — Bubbling acid-lime retort flask with toxic skull droplets
  poison_potion: wrapPotionSvg(
    'poison_potion',
    `<linearGradient id="pt-poison_potion-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(98, 100%, 66%)"/><stop offset="100%" stop-color="hsl(124, 92%, 34%)"/></linearGradient>`,
    `<rect x="11.4" y="2.2" width="5.2" height="2.4" rx="1" fill="hsl(114, 48%, 36%)" stroke="hsl(104, 82%, 70%)" stroke-width="0.9"/>
     <path d="M11.6 4.6 H16.4 V8.4 L21.4 16.4 A5.6 5.6 0 0 1 16.6 24.4 H11.4 A5.6 5.6 0 0 1 6.6 16.4 L11.6 8.4 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M8.4 15.8 H19.6 A4.6 4.6 0 0 1 16.4 23 H11.6 A4.6 4.6 0 0 1 8.4 15.8 Z" fill="url(#pt-poison_potion-g)"/>
     <circle cx="12" cy="19.2" r="1.25" fill="hsl(136, 62%, 14%)"/><circle cx="16" cy="19.2" r="1.25" fill="hsl(136, 62%, 14%)"/>
     <circle cx="15" cy="12.6" r="1.2" fill="hsl(104, 100%, 72%)"/><circle cx="12.4" cy="10.2" r="0.85" fill="hsl(104, 100%, 78%)"/>`
  ),

  // 12. Cunning Potion — Faceted emerald assassin vial with crossed shiv blades
  cunning_potion: wrapPotionSvg(
    'cunning_potion',
    `<linearGradient id="pt-cunning_potion-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(168, 92%, 68%)"/><stop offset="100%" stop-color="hsl(176, 84%, 32%)"/></linearGradient>`,
    `<rect x="11.4" y="2.2" width="5.2" height="2.4" rx="1" fill="hsl(168, 42%, 34%)" stroke="hsl(168, 80%, 72%)" stroke-width="0.9"/>
     <polygon points="11.8,4.6 16.2,4.6 16.2,7.4 21,12.2 19.2,22.8 14,24.8 8.8,22.8 7,12.2 11.8,7.4" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <polygon points="8.6,13.6 19.4,13.6 18,21.8 14,23.4 10,21.8" fill="url(#pt-cunning_potion-g)"/>
     <path d="M10.4 20.6 L17.6 14.4 M17.6 20.6 L10.4 14.4" stroke="hsl(0, 0%, 98%)" stroke-width="1.65" stroke-linecap="round"/>`
  ),

  // 13. Heart of Iron — Forged bronze-steel armored canteen with glowing iron core
  heart_of_iron: wrapPotionSvg(
    'heart_of_iron',
    `<linearGradient id="pt-heart_of_iron-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(40, 76%, 72%)"/><stop offset="55%" stop-color="hsl(28, 54%, 44%)"/><stop offset="100%" stop-color="hsl(214, 34%, 34%)"/></linearGradient>`,
    `<rect x="11.2" y="2.2" width="5.6" height="2.6" rx="1" fill="hsl(214, 24%, 46%)" stroke="hsl(40, 74%, 76%)" stroke-width="0.9"/>
     <path d="M11.8 4.8 H16.2 V7.4 L21 10.6 V19.6 L14 24.4 L7 19.6 V10.6 L11.8 7.4 Z" fill="url(#pt-heart_of_iron-g)" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M14 19.6 C14 19.6 9.8 16.8 9.8 13.8 C9.8 12.2 11 11.2 12.4 11.2 C13.2 11.2 13.7 11.6 14 12.2 C14.3 11.6 14.8 11.2 15.6 11.2 C17 11.2 18.2 12.2 18.2 13.8 C18.2 16.8 14 19.6 14 19.6 Z" fill="hsl(206, 62%, 78%)" stroke="hsl(216, 48%, 24%)" stroke-width="0.9"/>`
  ),

  // 14. Fury Potion — Horned volcanic demon-goblet overflowing with blazing wrath flame
  fury_potion: wrapPotionSvg(
    'fury_potion',
    `<linearGradient id="pt-fury_potion-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(38, 100%, 64%)"/><stop offset="100%" stop-color="hsl(4, 94%, 42%)"/></linearGradient>`,
    `<path d="M7.8 4.4 Q8.4 7.8 10.4 8.2 M20.2 4.4 Q19.6 7.8 17.6 8.2" fill="none" stroke="hsl(36, 98%, 68%)" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M8.6 8 H19.4 L17.4 17.6 C17 19.6 15.6 20.6 14 20.6 C12.4 20.6 11 19.6 10.6 17.6 Z" fill="url(#pt-fury_potion-g)" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M14 20.6 V23.6 M10.2 24 H17.8" stroke="hsl(40, 88%, 66%)" stroke-width="1.9" stroke-linecap="round"/>
     <path d="M14 4.2 Q16.6 6.8 16 9.4 H12 Q11.4 6.8 14 4.2 Z" fill="hsl(48, 100%, 72%)"/>`
  ),

  // 15. Miracle Potion — Cathedral star-topped radiant bottle with golden miracle star
  miracle_potion: wrapPotionSvg(
    'miracle_potion',
    `<linearGradient id="pt-miracle_potion-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(56, 100%, 92%)"/><stop offset="100%" stop-color="hsl(44, 96%, 56%)"/></linearGradient>`,
    `<polygon points="14,1.6 15.2,4.2 17.8,5.2 15.2,6.2 14,8.6 12.8,6.2 10.2,5.2 12.8,4.2" fill="hsl(50, 100%, 78%)"/>
     <path d="M11 8.4 H17 L19.6 12.4 V21.4 A3.2 3.2 0 0 1 16.4 24.6 H11.6 A3.2 3.2 0 0 1 8.4 21.4 V12.4 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M9.8 13.6 H18.2 V21.2 A2 2 0 0 1 16.2 23.2 H11.8 A2 2 0 0 1 9.8 21.2 Z" fill="url(#pt-miracle_potion-g)"/>
     <polygon points="14,14.8 15.1,17.4 17.6,18.4 15.1,19.4 14,22 12.9,19.4 10.4,18.4 12.9,17.4" fill="hsl(0, 0%, 100%)"/>`
  ),

  // 16. Ambrosia — Royal violet-gold divinity chalice with radiant lotus halo
  ambrosia: wrapPotionSvg(
    'ambrosia',
    `<linearGradient id="pt-ambrosia-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(48, 100%, 76%)"/><stop offset="48%" stop-color="hsl(286, 90%, 62%)"/><stop offset="100%" stop-color="hsl(268, 86%, 40%)"/></linearGradient>`,
    `<ellipse cx="14" cy="5.4" rx="6.4" ry="2" fill="none" stroke="hsl(48, 100%, 78%)" stroke-width="1.3"/>
     <path d="M7.6 9.4 H20.4 C20.2 15.4 17.8 19.6 14 20 C10.2 19.6 7.8 15.4 7.6 9.4 Z" fill="url(#pt-ambrosia-g)" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M14 20 V23.8 M9.8 24.2 H18.2" stroke="hsl(46, 98%, 70%)" stroke-width="2" stroke-linecap="round"/>
     <path d="M14 11.4 Q16 14 14 16.6 Q12 14 14 11.4 Z" fill="hsl(52, 100%, 88%)"/>`
  ),

  // 17. Ancient Potion — Ornate golden-bronze relic urn with clockwork Artifact gear
  ancient_potion: wrapPotionSvg(
    'ancient_potion',
    `<linearGradient id="pt-ancient_potion-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(48, 96%, 76%)"/><stop offset="100%" stop-color="hsl(32, 74%, 40%)"/></linearGradient>`,
    `<rect x="10.6" y="2.2" width="6.8" height="2.4" rx="1" fill="hsl(42, 84%, 60%)" stroke="hsl(50, 100%, 84%)" stroke-width="0.9"/>
     <path d="M11.6 4.6 H16.4 V7.4 C20 9 21.4 13.6 19.6 18.8 L17.6 24.2 H10.4 L8.4 18.8 C6.6 13.6 8 9 11.6 7.4 Z" fill="url(#pt-ancient_potion-g)" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <circle cx="14" cy="15.4" r="3.4" fill="hsl(28, 56%, 20%)" stroke="hsl(50, 100%, 84%)" stroke-width="1.2"/>
     <path d="M14 10.6 V12 M14 18.8 V20.2 M9.2 15.4 H10.6 M17.4 15.4 H18.8" stroke="hsl(50, 100%, 84%)" stroke-width="1.35" stroke-linecap="round"/>`
  ),

  // 18. Speed Potion — Leaning teal-mint gale bottle wrapped in swirling wind ribbons
  speed_potion: wrapPotionSvg(
    'speed_potion',
    `<linearGradient id="pt-speed_potion-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(152, 100%, 74%)"/><stop offset="100%" stop-color="hsl(174, 88%, 38%)"/></linearGradient>`,
    `<g transform="rotate(14 14 14)">
       <rect x="11.6" y="2.2" width="4.8" height="2.4" rx="1" fill="hsl(30, 50%, 48%)" stroke="hsl(38, 66%, 76%)" stroke-width="0.9"/>
       <path d="M11.6 4.6 H16.4 V8.4 L19.6 19.6 A3.4 3.4 0 0 1 16.4 24 H11.6 A3.4 3.4 0 0 1 8.4 19.6 L11.6 8.4 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.25" stroke-linejoin="round"/>
       <path d="M10.4 14.4 H17.6 L18.4 19.4 A2.2 2.2 0 0 1 16.2 22.6 H11.8 A2.2 2.2 0 0 1 9.6 19.4 Z" fill="url(#pt-speed_potion-g)"/>
     </g>
     <path d="M4.2 13.4 Q9.4 10.8 14.8 13.2 T24 12.2 M5 18.2 Q10.4 16 15.6 18.2 T23.6 17.4" fill="none" stroke="hsl(156, 100%, 82%)" stroke-width="1.45" stroke-linecap="round"/>`
  ),

  // 19. Flex Potion — Twin-handled burnt-orange dumbbell tonic jug with power burst ring
  flex_potion: wrapPotionSvg(
    'flex_potion',
    `<linearGradient id="pt-flex_potion-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(32, 100%, 66%)"/><stop offset="100%" stop-color="hsl(8, 92%, 44%)"/></linearGradient>`,
    `<rect x="11.2" y="2.2" width="5.6" height="2.6" rx="1" fill="hsl(28, 52%, 44%)" stroke="hsl(42, 72%, 74%)" stroke-width="0.9"/>
     <path d="M11.4 4.8 H16.6 V8.6 L19 10.6 C21.8 11.4 22.4 15.8 19.6 17.4 L19 21.8 C18.8 23.4 17.4 24.4 15.6 24.4 H12.4 C10.6 24.4 9.2 23.4 9 21.8 L8.4 17.4 C5.6 15.8 6.2 11.4 9 10.6 L11.4 8.6 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M9.6 14.2 H18.4 L17.8 21.4 C17.6 22.4 16.8 23 15.6 23 H12.4 C11.2 23 10.4 22.4 10.2 21.4 Z" fill="url(#pt-flex_potion-g)"/>
     <path d="M10.8 18.4 H17.2 M11.8 16.4 V20.4 M16.2 16.4 V20.4" stroke="hsl(48, 100%, 84%)" stroke-width="1.55" stroke-linecap="round"/>`
  ),

  // 20. Gambler's Brew — Deep indigo fortune crystal sphere with white 6-pip die inside
  gamblers_brew: wrapPotionSvg(
    'gamblers_brew',
    `<radialGradient id="pt-gamblers_brew-g" cx="38%" cy="32%" r="68%"><stop offset="0%" stop-color="hsl(256, 90%, 72%)"/><stop offset="100%" stop-color="hsl(242, 76%, 34%)"/></radialGradient>`,
    `<rect x="11.4" y="2" width="5.2" height="2.5" rx="1" fill="hsl(42, 80%, 56%)" stroke="hsl(50, 100%, 84%)" stroke-width="0.9"/>
     <path d="M11.6 4.5 H16.4 V7.4 A8.4 8.4 0 1 1 11.6 7.4 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <circle cx="14" cy="15.8" r="7" fill="url(#pt-gamblers_brew-g)"/>
     <rect x="10.2" y="12" width="7.6" height="7.6" rx="1.6" fill="hsl(44, 62%, 94%)" stroke="hsl(246, 56%, 24%)" stroke-width="0.9"/>
     <circle cx="12.2" cy="14" r="0.85" fill="hsl(246, 62%, 22%)"/><circle cx="15.8" cy="14" r="0.85" fill="hsl(246, 62%, 22%)"/>
     <circle cx="14" cy="15.8" r="0.85" fill="hsl(354, 88%, 52%)"/><circle cx="12.2" cy="17.6" r="0.85" fill="hsl(246, 62%, 22%)"/><circle cx="15.8" cy="17.6" r="0.85" fill="hsl(246, 62%, 22%)"/>`
  ),

  // 21. Duplication Potion — Iconic TWIN-NECKED magenta & cyan mirrored double-flask
  duplication_potion: wrapPotionSvg(
    'duplication_potion',
    `<linearGradient id="pt-duplication_potion-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(312, 96%, 72%)"/><stop offset="100%" stop-color="hsl(292, 86%, 44%)"/></linearGradient><linearGradient id="pt-duplication_potion-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(188, 98%, 74%)"/><stop offset="100%" stop-color="hsl(204, 88%, 44%)"/></linearGradient>`,
    `<rect x="7.4" y="2.6" width="3.6" height="2.2" rx="0.8" fill="hsl(310, 72%, 58%)"/><rect x="17" y="2.6" width="3.6" height="2.2" rx="0.8" fill="hsl(192, 82%, 58%)"/>
     <path d="M8 4.8 H10.4 V8.4 L13.8 13.8 V22.2 A4.6 4.6 0 0 1 4.8 18.6 C4.8 15 6.8 12.2 8 9.2 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M17.6 4.8 H20 V9.2 C21.2 12.2 23.2 15 23.2 18.6 A4.6 4.6 0 0 1 14.2 22.2 V13.8 L17.6 8.4 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.2" stroke-linejoin="round"/>
     <path d="M6.2 15.8 H12.6 V21.2 A3.4 3.4 0 0 1 6.2 18.6 Z" fill="url(#pt-duplication_potion-a)"/>
     <path d="M15.4 15.8 H21.8 V18.6 A3.4 3.4 0 0 1 15.4 21.2 Z" fill="url(#pt-duplication_potion-b)"/>`
  ),

  // 22. Essence of Steel — Layered silver-blue armored prism flask with steel scales
  essence_of_steel: wrapPotionSvg(
    'essence_of_steel',
    `<linearGradient id="pt-essence_of_steel-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(206, 72%, 86%)"/><stop offset="100%" stop-color="hsl(214, 42%, 44%)"/></linearGradient>`,
    `<rect x="11.2" y="2.2" width="5.6" height="2.5" rx="1" fill="hsl(212, 30%, 58%)" stroke="hsl(206, 78%, 88%)" stroke-width="0.9"/>
     <polygon points="11.6,4.7 16.4,4.7 16.4,7.4 21.4,11.6 19.8,22.4 14,24.8 8.2,22.4 6.6,11.6 11.6,7.4" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M8.2 12.6 Q14 10.6 19.8 12.6 L19.2 15.8 Q14 17.8 8.8 15.8 Z" fill="url(#pt-essence_of_steel-g)"/>
     <path d="M9 17.4 Q14 19.4 19 17.4 L18.4 21.4 L14 23.4 L9.6 21.4 Z" fill="hsl(212, 48%, 62%)" stroke="hsl(204, 84%, 86%)" stroke-width="0.8"/>`
  ),

  // 23. Blood Surge Potion — Spiked gothic crimson blood-vial with power lightning surge
  blood_surge_potion: wrapPotionSvg(
    'blood_surge_potion',
    `<linearGradient id="pt-blood_surge_potion-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(358, 96%, 62%)"/><stop offset="100%" stop-color="hsl(344, 92%, 30%)"/></linearGradient>`,
    `<rect x="11.6" y="2" width="4.8" height="2.4" rx="1" fill="hsl(352, 54%, 38%)" stroke="hsl(14, 86%, 70%)" stroke-width="0.9"/>
     <path d="M12 4.4 H16 V7.6 L19.8 11 L17.6 14.2 L20.4 18 L14 24.8 L7.6 18 L10.4 14.2 L8.2 11 L12 7.6 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.25" stroke-linejoin="round"/>
     <polygon points="10.6,13.6 17.4,13.6 18.8,17.8 14,23.2 9.2,17.8" fill="url(#pt-blood_surge_potion-g)"/>
     <path d="M14.8 13.8 L12 18 H14.4 L13.2 21.6 L16.4 17 H14 Z" fill="hsl(48, 100%, 82%)"/>`
  ),

  // 24. Elixir Potion — Luminous ivory-gold purifying lotus decanter with cleansing sparkles
  elixir_potion: wrapPotionSvg(
    'elixir_potion',
    `<linearGradient id="pt-elixir_potion-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(52, 100%, 92%)"/><stop offset="100%" stop-color="hsl(40, 88%, 56%)"/></linearGradient>`,
    `<path d="M14 2.2 Q16.6 4.4 14 6.6 Q11.4 4.4 14 2.2 Z" fill="hsl(50, 100%, 84%)"/>
     <path d="M11.6 6.4 H16.4 V9.2 C19.8 10.6 21.4 14.4 20.6 18.6 C19.8 22.2 17.2 24.4 14 24.4 C10.8 24.4 8.2 22.2 7.4 18.6 C6.6 14.4 8.2 10.6 11.6 9.2 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M9 15.2 Q14 13.8 19 15.2 C19.4 19.2 17.4 23 14 23 C10.6 23 8.6 19.2 9 15.2 Z" fill="url(#pt-elixir_potion-g)"/>
     <path d="M5.4 8.2 L6.4 9.8 L8 10.4 L6.4 11 L5.4 12.6 L4.4 11 L2.8 10.4 L4.4 9.8 Z M22.2 9.4 L23 10.8 L24.4 11.4 L23 12 L22.2 13.4 L21.4 12 L20 11.4 L21.4 10.8 Z" fill="hsl(52, 100%, 86%)"/>`
  ),

  // 25. Ghost in a Jar — Wide corked mason jar containing a translucent glowing ghost
  ghost_in_a_jar: wrapPotionSvg(
    'ghost_in_a_jar',
    `<linearGradient id="pt-ghost_in_a_jar-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(192, 100%, 94%)"/><stop offset="100%" stop-color="hsl(196, 86%, 64%)"/></linearGradient>`,
    `<rect x="9.4" y="2.4" width="9.2" height="3" rx="1.1" fill="hsl(30, 48%, 46%)" stroke="hsl(38, 62%, 72%)" stroke-width="0.9"/>
     <rect x="7" y="5.6" width="14" height="18.6" rx="4.2" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3"/>
     <path d="M14 9.2 C11.2 9.2 9.6 11.4 9.6 14.4 V21.4 L11.8 19.8 L14 21.6 L16.2 19.8 L18.4 21.4 V14.4 C18.4 11.4 16.8 9.2 14 9.2 Z" fill="url(#pt-ghost_in_a_jar-g)" opacity="0.94"/>
     <circle cx="12.4" cy="14" r="1.15" fill="hsl(216, 56%, 20%)"/><circle cx="15.6" cy="14" r="1.15" fill="hsl(216, 56%, 20%)"/>`
  ),

  // 26. Phantom Draught — Twilight crescent-moon phial with ghostly shadow wisps
  phantom_draught: wrapPotionSvg(
    'phantom_draught',
    `<linearGradient id="pt-phantom_draught-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(174, 92%, 70%)"/><stop offset="100%" stop-color="hsl(216, 76%, 40%)"/></linearGradient>`,
    `<rect x="11.4" y="2.2" width="5.2" height="2.4" rx="1" fill="hsl(206, 42%, 44%)" stroke="hsl(186, 82%, 78%)" stroke-width="0.9"/>
     <path d="M11.8 4.6 H16.2 V7.6 A8 8 0 1 1 11.8 7.6 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3"/>
     <path d="M16.2 10.4 A6.2 6.2 0 1 0 18.8 20.2 A5.2 5.2 0 1 1 16.2 10.4 Z" fill="url(#pt-phantom_draught-g)"/>
     <circle cx="17.4" cy="14.2" r="1.15" fill="hsl(176, 100%, 84%)"/><circle cx="15.6" cy="11.6" r="0.75" fill="hsl(192, 100%, 88%)"/>`
  ),

  // 27. Stance Potion — Split half-blue Calm / half-crimson Wrath dual-chamber bottle
  stance_potion: wrapPotionSvg(
    'stance_potion',
    `<linearGradient id="pt-stance_potion-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(196, 96%, 72%)"/><stop offset="100%" stop-color="hsl(216, 88%, 46%)"/></linearGradient><linearGradient id="pt-stance_potion-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(12, 98%, 64%)"/><stop offset="100%" stop-color="hsl(350, 92%, 40%)"/></linearGradient>`,
    `<rect x="11.2" y="2.2" width="5.6" height="2.5" rx="1" fill="hsl(276, 52%, 46%)" stroke="hsl(46, 94%, 76%)" stroke-width="0.9"/>
     <path d="M11.6 4.7 H16.4 V7.4 L21 12.6 V19.4 A5 5 0 0 1 16 24.4 H12 A5 5 0 0 1 7 19.4 V12.6 L11.6 7.4 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M8.4 13.4 H14 V23 H12 A3.6 3.6 0 0 1 8.4 19.4 Z" fill="url(#pt-stance_potion-c)"/>
     <path d="M14 13.4 H19.6 V19.4 A3.6 3.6 0 0 1 16 23 H14 Z" fill="url(#pt-stance_potion-w)"/>
     <line x1="14" y1="12.6" x2="14" y2="23.4" stroke="hsl(48, 100%, 82%)" stroke-width="1.2"/>`
  ),

  // 28. Mantra Elixir — Tall amethyst lotus-bud bottle with golden third-eye mantra sigil
  mantra_elixir: wrapPotionSvg(
    'mantra_elixir',
    `<linearGradient id="pt-mantra_elixir-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(296, 96%, 76%)"/><stop offset="100%" stop-color="hsl(272, 84%, 40%)"/></linearGradient>`,
    `<path d="M14 1.8 L16.2 4.6 H11.8 Z" fill="hsl(46, 100%, 74%)"/>
     <path d="M11.8 4.6 H16.2 V7.6 C19.8 10 21 14.8 19.4 19.8 C18.2 22.8 16.2 24.4 14 24.6 C11.8 24.4 9.8 22.8 8.6 19.8 C7 14.8 8.2 10 11.8 7.6 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <path d="M9.6 12.6 H18.4 C19 16.4 17.6 21 14 23.2 C10.4 21 9 16.4 9.6 12.6 Z" fill="url(#pt-mantra_elixir-g)"/>
     <path d="M10.2 17.2 Q14 14.2 17.8 17.2 Q14 20.2 10.2 17.2 Z" fill="hsl(46, 100%, 76%)"/>
     <circle cx="14" cy="17.2" r="1.25" fill="hsl(274, 72%, 22%)"/>`
  ),

  // 29. Focus Potion — Spherical optical-lens azure flask with concentric focus crosshair
  focus_potion: wrapPotionSvg(
    'focus_potion',
    `<radialGradient id="pt-focus_potion-g" cx="42%" cy="38%" r="64%"><stop offset="0%" stop-color="hsl(188, 100%, 88%)"/><stop offset="56%" stop-color="hsl(198, 96%, 56%)"/><stop offset="100%" stop-color="hsl(220, 88%, 34%)"/></radialGradient>`,
    `<rect x="11.4" y="2" width="5.2" height="2.4" rx="1" fill="hsl(42, 72%, 52%)" stroke="hsl(48, 96%, 80%)" stroke-width="0.9"/>
     <path d="M12 4.4 H16 V7.6 A8 8 0 1 1 12 7.6 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <circle cx="14" cy="15.8" r="6.3" fill="url(#pt-focus_potion-g)"/>
     <circle cx="14" cy="15.8" r="3.4" fill="none" stroke="hsl(52, 100%, 86%)" stroke-width="1.2"/>
     <circle cx="14" cy="15.8" r="1.2" fill="hsl(54, 100%, 96%)"/>
     <path d="M14 10.6 V12.4 M14 19.2 V21 M8.8 15.8 H10.6 M17.4 15.8 H19.2" stroke="hsl(50, 100%, 86%)" stroke-width="1.1" stroke-linecap="round"/>`
  ),

  // 30. Potion of Capacity — Wide cylindrical cobalt canister ringed with triple orb sockets
  potion_of_capacity: wrapPotionSvg(
    'potion_of_capacity',
    `<linearGradient id="pt-potion_of_capacity-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(196, 98%, 74%)"/><stop offset="100%" stop-color="hsl(222, 86%, 40%)"/></linearGradient>`,
    `<rect x="10.8" y="2.2" width="6.4" height="2.5" rx="1" fill="hsl(210, 44%, 56%)" stroke="hsl(196, 92%, 82%)" stroke-width="0.9"/>
     <path d="M11.6 4.7 H16.4 V7.4 H19.6 C20.8 7.4 21.6 8.4 21.6 9.6 V21.4 C21.6 23.2 20.2 24.4 18.4 24.4 H9.6 C7.8 24.4 6.4 23.2 6.4 21.4 V9.6 C6.4 8.4 7.2 7.4 8.4 7.4 H11.6 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <rect x="7.8" y="12.2" width="12.4" height="10.8" rx="2.4" fill="url(#pt-potion_of_capacity-g)"/>
     <circle cx="10.6" cy="17.6" r="1.7" fill="none" stroke="hsl(52, 100%, 86%)" stroke-width="1.2"/>
     <circle cx="14" cy="17.6" r="1.7" fill="none" stroke="hsl(52, 100%, 86%)" stroke-width="1.2"/>
     <circle cx="17.4" cy="17.6" r="1.7" fill="none" stroke="hsl(52, 100%, 86%)" stroke-width="1.2"/>`
  ),

  // 31. Essence of Darkness — Teardrop obsidian-violet eclipse vial with dark vortex core
  essence_of_darkness: wrapPotionSvg(
    'essence_of_darkness',
    `<radialGradient id="pt-essence_of_darkness-g" cx="46%" cy="44%" r="64%"><stop offset="0%" stop-color="hsl(290, 96%, 68%)"/><stop offset="52%" stop-color="hsl(272, 82%, 34%)"/><stop offset="100%" stop-color="hsl(258, 76%, 10%)"/></radialGradient>`,
    `<polygon points="11.6,2 16.4,2 15.6,4.8 12.4,4.8" fill="hsl(278, 52%, 44%)" stroke="hsl(290, 88%, 76%)" stroke-width="0.9"/>
     <path d="M12.2 4.8 H15.8 V7.6 C19.4 9.8 21.8 13.8 21.2 18.2 A7.2 7.2 0 0 1 6.8 18.2 C6.2 13.8 8.6 9.8 12.2 7.6 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <circle cx="14" cy="16.8" r="5.6" fill="url(#pt-essence_of_darkness-g)"/>
     <circle cx="14" cy="16.8" r="2.7" fill="hsl(256, 76%, 8%)" stroke="hsl(292, 98%, 78%)" stroke-width="1.1"/>
     <circle cx="17.8" cy="12.2" r="0.9" fill="hsl(292, 100%, 86%)"/>`
  ),

  // 32. Liquid Plasma — Twin-ringed golden-cyan fusion decanter radiating plasma arcs
  liquid_plasma: wrapPotionSvg(
    'liquid_plasma',
    `<radialGradient id="pt-liquid_plasma-g" cx="44%" cy="40%" r="62%"><stop offset="0%" stop-color="hsl(54, 100%, 96%)"/><stop offset="48%" stop-color="hsl(40, 100%, 62%)"/><stop offset="100%" stop-color="hsl(192, 96%, 46%)"/></radialGradient>`,
    `<rect x="11.2" y="2" width="5.6" height="2.4" rx="1" fill="hsl(44, 90%, 58%)" stroke="hsl(52, 100%, 88%)" stroke-width="0.9"/>
     <path d="M11.8 4.4 H16.2 V7.6 L21.4 15.4 L18.2 24 H9.8 L6.6 15.4 L11.8 7.6 Z" fill="${DARK_GLASS}" stroke="${GLASS}" stroke-width="1.3" stroke-linejoin="round"/>
     <polygon points="8.4,15.4 14,10.2 19.6,15.4 17.2,22.4 10.8,22.4" fill="url(#pt-liquid_plasma-g)"/>
     <ellipse cx="14" cy="16.6" rx="5.2" ry="2.1" transform="rotate(-24 14 16.6)" fill="none" stroke="hsl(54, 100%, 96%)" stroke-width="1.1"/>
     <circle cx="14" cy="16.6" r="1.6" fill="hsl(54, 100%, 98%)"/>`
  ),
});

export function getPotionAccentColor(potionId) {
  if (!potionId) return 'hsla(36, 18%, 48%, 0.45)';
  return POTION_ACCENT_COLORS[potionId] || 'hsl(196, 78%, 62%)';
}

export function getPotionIconSvg(potionId, size = 20, options = {}) {
  const s = Number(size) || 20;
  if (!potionId) {
    return `<svg viewBox="0 0 28 28" width="${s}" height="${s}" class="potion-icon-svg is-empty" data-potion-icon="empty" fill="none" aria-hidden="true"><rect x="11" y="2.8" width="6" height="2.6" rx="1" stroke="hsla(36, 22%, 68%, 0.48)" stroke-width="1.3"/><path d="M11.8 5.4 V9 L6.6 16.6 A6 6 0 0 0 11.6 25 H16.4 A6 6 0 0 0 21.4 16.6 L16.2 9 V5.4" stroke="hsla(36, 22%, 70%, 0.48)" stroke-width="1.45" stroke-linejoin="round" fill="hsla(34, 16%, 24%, 0.28)"/><path d="M9.6 17.4 Q14 16 18.4 17.4" stroke="hsla(36, 20%, 66%, 0.28)" stroke-width="1.2" stroke-dasharray="2.2 2.2" stroke-linecap="round"/></svg>`;
  }

  let svg = POTION_SVG_ART[potionId] || POTION_SVG_ART.fire_potion;
  svg = svg.replace('<svg viewBox="0 0 28 28"', `<svg viewBox="0 0 28 28" width="${s}" height="${s}"`);
  if (options.scope) {
    svg = scopePotionSvgIds(svg, options.scope);
  }
  if (options.className) {
    svg = svg.replace('class="potion-icon-svg"', `class="potion-icon-svg ${options.className}"`);
  }
  if (options.lootIcon) {
    svg = svg.replace('<svg ', '<svg data-loot-icon="potion" ');
  }
  return svg;
}

export function getUndiscoveredPotionSvg(size = 24) {
  const s = Number(size) || 24;
  return `<svg viewBox="0 0 28 28" width="${s}" height="${s}" class="potion-icon-svg is-undiscovered" data-potion-icon="undiscovered" fill="none" aria-hidden="true"><rect x="11" y="2.6" width="6" height="2.6" rx="1" stroke="hsla(36, 26%, 58%, 0.45)" stroke-width="1.2"/><path d="M11.6 5.2 H16.4 V8.8 L21.2 16.2 A5.8 5.8 0 0 1 16.2 24.8 H11.8 A5.8 5.8 0 0 1 6.8 16.2 L11.6 8.8 Z" fill="hsl(24, 16%, 13%)" stroke="hsla(36, 28%, 52%, 0.46)" stroke-width="1.3" stroke-dasharray="2.8 2.2"/><path d="M12.1 14.5 C12.1 13.1 13 12.2 14.2 12.2 C15.4 12.2 16.2 13 16.2 14.1 C16.2 15 15.6 15.6 14.8 16.2 C14.2 16.6 14 17 14 17.8" stroke="hsla(38, 36%, 68%, 0.72)" stroke-width="1.65" stroke-linecap="round"/><circle cx="14" cy="20.4" r="1.15" fill="hsla(38, 36%, 68%, 0.72)"/></svg>`;
}
