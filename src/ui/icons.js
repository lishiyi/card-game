/**
 * Hand-crafted inline SVG illustrations and iconography for characters, monsters, nodes, and HUD.
 */

import { getEnemySvg } from './enemy_art.js';

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
