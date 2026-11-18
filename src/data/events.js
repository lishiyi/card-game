import { nextRandom } from '../engine/rng.js';

export const EVENT_LIBRARY = Object.freeze({
  shining_light: {
    id: 'shining_light',
    title: '闪耀圣光',
    description:
      '你踏入一间悬浮着炽白光束的古老回廊。光束中蕴含着淬炼兵刃的力量，但靠近它亦会灼伤血肉。',
    choices: [
      {
        id: 'enter_light',
        label: '步入光束',
        detail: '失去 12 点生命，随机升级牌组中的 2 张卡牌。',
      },
      {
        id: 'leave',
        label: '屏息离开',
        detail: '不冒风险，继续攀登尖塔。',
      },
    ],
  },
  ancient_shrine: {
    id: 'ancient_shrine',
    title: '远古净坛',
    description:
      '青石祭坛中央涌动着微光泉水，石壁上的铭文记载着洗礼身心与净化杂念的秘仪。',
    choices: [
      {
        id: 'pray_purge',
        label: '虔诚净化',
        detail: '从牌组中永久移除 1 张卡牌。',
      },
      {
        id: 'drink_spring',
        label: '饮下圣泉',
        detail: '回复 25% 最大生命值。',
      },
      {
        id: 'gather_gold',
        label: '拾取供奉金砂',
        detail: '获得 65 金币。',
      },
    ],
  },
  thorn_reliquary: {
    id: 'thorn_reliquary',
    title: '荆棘秘匣',
    description:
      '铁荆棘缠绕的青铜秘匣中散发着远古遗物的共鸣。唯有以鲜血浸染铁刺，方能取出匣中之物。',
    choices: [
      {
        id: 'open_reliquary',
        label: '徒手破荆',
        detail: '失去 8 点生命，获得 1 件随机遗物。',
      },
      {
        id: 'take_coins',
        label: '拾取散落钱币',
        detail: '安全获得 45 金币。',
      },
    ],
  },
});

export const EVENT_IDS = Object.freeze(Object.keys(EVENT_LIBRARY));

export const NODE_TYPE_META = Object.freeze({
  combat: { type: 'combat', label: '普通战斗', shortLabel: '战斗' },
  elite: { type: 'elite', label: '精英强敌', shortLabel: '精英' },
  rest: { type: 'rest', label: '篝火营地', shortLabel: '营地' },
  shop: { type: 'shop', label: '神秘商人', shortLabel: '商店' },
  event: { type: 'event', label: '未知事件', shortLabel: '事件' },
  boss: { type: 'boss', label: '尖塔首领', shortLabel: '首领' },
});

/**
 * Generates a 7-floor non-crossing, fully connected Spire map.
 */
export function generateSpireMap(state) {
  const rowTemplates = [
    ['combat', 'combat'],
    nextRandom(state) < 0.5 ? ['combat', 'event'] : ['event', 'combat'],
    nextRandom(state) < 0.5 ? ['rest', 'shop'] : ['shop', 'rest'],
    nextRandom(state) < 0.5 ? ['elite', 'combat'] : ['combat', 'elite'],
    nextRandom(state) < 0.5 ? ['shop', 'event'] : ['event', 'shop'],
    ['rest'],
    ['boss'],
  ];

  const rows = rowTemplates.map((types, floorIdx) =>
    types.map((type, colIdx) => ({
      id: `f${floorIdx + 1}_c${colIdx}`,
      floor: floorIdx + 1,
      row: floorIdx,
      col: colIdx,
      type,
      nextIds: [],
      visited: false,
    }))
  );

  for (let r = 0; r < rows.length - 1; r += 1) {
    const curr = rows[r];
    const next = rows[r + 1];

    if (curr.length === 2 && next.length === 2) {
      curr[0].nextIds.push(next[0].id);
      curr[1].nextIds.push(next[1].id);
      if (nextRandom(state) < 0.5) {
        curr[0].nextIds.push(next[1].id);
      } else {
        curr[1].nextIds.push(next[0].id);
      }
    } else if (curr.length === 2 && next.length === 1) {
      curr[0].nextIds.push(next[0].id);
      curr[1].nextIds.push(next[0].id);
    } else if (curr.length === 1 && next.length === 1) {
      curr[0].nextIds.push(next[0].id);
    }
  }

  return rows;
}
