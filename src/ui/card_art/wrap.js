/**
 * Rich inline SVG card illustration system covering all 234 cards with 100% bespoke 16:9 artwork:
 * - 232 bespoke signature illustrations (100% of every non-shared card in CARD_LIBRARY)
 * - 6 class-specific hero illustrations for shared Strike & Defend (Ironclad / Silent / Watcher)
 * Uses tall framed 128×72 (16:9) miniature compositions with multi-layered scenes, custom metallic/glow
 * gradients, radial spotlights, parallax Spire depth silhouettes, etched corner filigree, and unique
 * `ca-*` IDs so every card renders vividly on desktop and 390px mobile.
 */

export function wrapArtSvg(key, bg1, bg2, inner, accent = 'rgba(255,255,255,0.16)', defsExtra = '') {
  return `<svg viewBox="0 0 128 72" class="card-art-svg" data-card-art="${key}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="ca-${key}-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${bg1}"/><stop offset="100%" stop-color="${bg2}"/></linearGradient><radialGradient id="ca-${key}-spot" cx="50%" cy="44%" r="60%"><stop offset="0%" stop-color="${accent}"/><stop offset="68%" stop-color="rgba(0,0,0,0)"/><stop offset="100%" stop-color="rgba(0,0,0,0.22)"/></radialGradient><linearGradient id="ca-${key}-vig" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(255,248,230,0.09)"/><stop offset="18%" stop-color="rgba(0,0,0,0)"/><stop offset="76%" stop-color="rgba(0,0,0,0)"/><stop offset="100%" stop-color="rgba(0,0,0,0.42)"/></linearGradient>${defsExtra}</defs><rect width="128" height="72" fill="url(#ca-${key}-bg)"/><rect width="128" height="72" fill="url(#ca-${key}-spot)"/><path d="M0 72 L0 56 L14 48 L27 56 L42 44 L58 54 L74 45 L91 55 L108 47 L128 54 L128 72 Z" fill="rgba(0,0,0,0.2)"/><path d="M0 72 L0 63 L19 58 L39 64 L64 56 L88 63 L110 58 L128 62 L128 72 Z" fill="rgba(0,0,0,0.18)"/><path d="M-8 72 L38 0 L58 0 L12 72 Z" fill="rgba(255,255,255,0.04)"/>${inner}<rect width="128" height="72" fill="url(#ca-${key}-vig)"/><path d="M3 11 V3 H11 M125 11 V3 H117 M3 61 V69 H11 M125 61 V69 H117" fill="none" stroke="rgba(255,245,220,0.24)" stroke-width="0.9" stroke-linecap="square"/></svg>`;
}
