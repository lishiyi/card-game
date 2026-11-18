import { nextRandom, pickDistinct } from '../engine/rng.js';

function deepFreeze(obj) {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    for (const val of Object.values(obj)) {
      deepFreeze(val);
    }
  }
  return obj;
}

export const TOTAL_FLOORS = 16;
export const MAP_COLUMNS = 4;

export const EVENT_LIBRARY = deepFreeze({
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
  ancient_forge: {
    id: 'ancient_forge',
    title: '遗落锻炉',
    description:
      '石室深处伫立着一座尚未熄灭的矮人锻炉，暗红余烬与残存的风箱仍能为你淬炼随身武具。',
    choices: [
      {
        id: 'temper_blade',
        label: '余烬淬火',
        detail: '借助炉膛余温，免费随机升级牌组中的 1 张卡牌。',
      },
      {
        id: 'overclock_forge',
        label: '鼓风猛锻',
        detail: '失去 6 点生命并花费 30 金币，随机升级牌组中的 2 张卡牌。',
      },
      {
        id: 'scavenge_slag',
        label: '搜集精铁',
        detail: '安全拾取锻台旁的精铁锭，获得 40 金币。',
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
  golden_idol: {
    id: 'golden_idol',
    title: '黄金神像',
    description:
      '机关基座上供奉着一尊璀璨纯金神像。四周岩壁布满暗孔与咒文，强行取走必会触发古老禁制。',
    choices: [
      {
        id: 'smash_trap',
        label: '硬抗机关夺宝',
        detail: '获得 135 金币，但被滚石擦伤失去 14 点生命。',
      },
      {
        id: 'accept_curse_gold',
        label: '背负神像诅咒',
        detail: '获得 175 金币，但将 1 张诅咒【悔恨】加入你的牌组。',
      },
      {
        id: 'leave_idol',
        label: '谨慎退避',
        detail: '不触碰神像，毫发无伤离开。',
      },
    ],
  },
  living_wall: {
    id: 'living_wall',
    title: '活体石墙',
    description:
      '走廊尽头矗立着一堵镶嵌三张石雕面孔的高墙，低沉的声音在甬道回荡：“遗忘、蜕变、或是成长——做出你的抉择。”',
    choices: [
      {
        id: 'wall_forget',
        label: '遗忘（移除卡牌）',
        detail: '从牌组中自选并永久移除 1 张卡牌。',
      },
      {
        id: 'wall_change',
        label: '蜕变（变化卡牌）',
        detail: '从牌组中自选 1 张牌，将其变化为 1 张随机非基础铁甲战士卡牌。',
      },
      {
        id: 'wall_grow',
        label: '成长（指定升级）',
        detail: '从牌组中自选 1 张可升级卡牌永久强化。',
      },
    ],
  },
  cursed_tome: {
    id: 'cursed_tome',
    title: '禁忌魔典',
    description:
      '黑曜石讲台上摊开着一卷自行翻页的赤红羊皮魔典，字里行间流淌着狂暴战技，却在不断汲取读者的生命力。',
    choices: [
      {
        id: 'read_final_chapter',
        label: '强读终章秘奥',
        detail: '失去 14 点生命，随机获得 1 张【稀有】卡牌加入牌组！',
      },
      {
        id: 'skim_preface',
        label: '速览前篇战技',
        detail: '失去 5 点生命，随机获得 1 张【罕见】卡牌加入牌组。',
      },
      {
        id: 'close_tome',
        label: '合上魔典',
        detail: '克制贪念，安全离开讲台。',
      },
    ],
  },
  potion_alchemist: {
    id: 'potion_alchemist',
    title: '尖塔炼金师',
    description:
      '身穿防毒皮袍的怪癖炼金师正搅动着沸腾坩埚：“来点浓缩秘药，还是替我试一口新配方？”',
    choices: [
      {
        id: 'buy_potions',
        label: '采购秘药补给',
        detail: '花费 35 金币，随机获得药水直至填满空药水栏。',
      },
      {
        id: 'drink_mutagen',
        label: '试饮强体秘剂',
        detail: '永久提升 6 点最大生命值，并立即回复 6 点生命。',
      },
      {
        id: 'rob_alchemist',
        label: '洗劫炼金摊',
        detail: '强夺 60 金币，但沾染怨念将 1 张诅咒【疑虑】加入牌组。',
      },
    ],
  },
  mushroom_grotto: {
    id: 'mushroom_grotto',
    title: '荧光蘑菇窟',
    description:
      '潮湿洞窟中生长着散发幽蓝与赤红荧光的奇异菌群，空气中弥漫着令人精神振奋却又隐含麻痹的孢子香气。',
    choices: [
      {
        id: 'eat_blue_cap',
        label: '大口吞食蓝伞菌',
        detail: '回复 35% 最大生命值，但将 1 张虚无诅咒【笨拙】加入牌组。',
      },
      {
        id: 'refine_red_spore',
        label: '淬炼赤红菌核',
        detail: '失去 7 点当前生命，永久增加 5 点最大生命值。',
      },
      {
        id: 'bypass_grotto',
        label: '捂鼻绕行',
        detail: '避开孢子雾区，继续攀登。',
      },
    ],
  },
  library_sanctum: {
    id: 'library_sanctum',
    title: '静谧藏书阁',
    description:
      '尘封千年的塔内书阁隔绝了外界厮杀，无数前代攀登者的武学手札静静陈列在楠木书架之上。',
    choices: [
      {
        id: 'study_manuals',
        label: '潜心研读手札',
        detail: '从 3 张精选卡牌中任选 1 张加入你的牌组。',
      },
      {
        id: 'nap_in_library',
        label: '倚靠书案小憩',
        detail: '放松紧绷的神经，回复 20 点生命。',
      },
    ],
  },
});

export const EVENT_IDS = Object.freeze(Object.keys(EVENT_LIBRARY));

export const NODE_TYPE_META = deepFreeze({
  combat: { type: 'combat', label: '普通战斗', shortLabel: '战斗' },
  elite: { type: 'elite', label: '精英强敌', shortLabel: '精英' },
  rest: { type: 'rest', label: '篝火营地', shortLabel: '营地' },
  shop: { type: 'shop', label: '神秘商人', shortLabel: '商店' },
  event: { type: 'event', label: '未知事件', shortLabel: '事件' },
  treasure: { type: 'treasure', label: '远古宝箱', shortLabel: '宝箱' },
  boss: { type: 'boss', label: '尖塔首领', shortLabel: '首领' },
});

function pickWeightedType(state, weights) {
  const entries = Object.entries(weights).filter(([, w]) => w > 0);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  if (total <= 0) return 'combat';
  let roll = nextRandom(state) * total;
  for (const [type, w] of entries) {
    roll -= w;
    if (roll <= 0) return type;
  }
  return entries[entries.length - 1][0];
}

function wirePlanarRowEdges(state, curr, next) {
  const m = curr.length;
  const n = next.length;
  const addEdge = (u, v) => {
    if (!u.nextIds.includes(v.id)) {
      u.nextIds.push(v.id);
    }
  };

  if (n === 1) {
    for (let i = 0; i < m; i += 1) addEdge(curr[i], next[0]);
    return;
  }
  if (m === 1) {
    for (let j = 0; j < n; j += 1) addEdge(curr[0], next[j]);
    return;
  }

  // Strictly restrict edges between multi-column floors to adjacent columns (|ΔslotCol| <= 1)
  // so edges NEVER shoot across intermediate columns or visually collide behind other nodes!
  const isLocalPair = (i, j) => Math.abs(curr[i].slotCol - next[j].slotCol) <= 1;

  const canReach = Array.from({ length: m }, () => Array(n).fill(false));
  for (let i = m - 1; i >= 0; i -= 1) {
    for (let j = n - 1; j >= 0; j -= 1) {
      if (!isLocalPair(i, j)) continue;
      if (i === m - 1 && j === n - 1) {
        canReach[i][j] = true;
      } else {
        canReach[i][j] =
          (i + 1 < m && canReach[i + 1][j]) ||
          (j + 1 < n && canReach[i][j + 1]) ||
          (i + 1 < m && j + 1 < n && canReach[i + 1][j + 1]);
      }
    }
  }

  let i = 0;
  let j = 0;
  addEdge(curr[0], next[0]);

  while (i < m - 1 || j < n - 1) {
    const canRight = j + 1 < n && canReach[i][j + 1];
    const canDown = i + 1 < m && canReach[i + 1][j];
    const canDiag = i + 1 < m && j + 1 < n && canReach[i + 1][j + 1];

    const options = [];
    if (canRight) options.push('right');
    if (canDown) options.push('down');
    if (canDiag) options.push('diag');

    if (options.length === 0) {
      // Defensive fallback (mathematically unreachable for all 3-4 column subsets of {0,1,2,3})
      if (i < m - 1) i += 1;
      else j += 1;
      addEdge(curr[i], next[j]);
      continue;
    }

    const pick = options[Math.floor(nextRandom(state) * options.length)];
    if (pick === 'right') {
      j += 1;
      addEdge(curr[i], next[j]);
    } else if (pick === 'down') {
      i += 1;
      addEdge(curr[i], next[j]);
    } else {
      // Optional single local non-crossing branch inside cell (i, j) -> (i+1, j+1)
      const extraRight = isLocalPair(i, j + 1);
      const extraDown = isLocalPair(i + 1, j);
      const bridgeRoll = nextRandom(state);
      if (extraRight && bridgeRoll < 0.28) {
        addEdge(curr[i], next[j + 1]);
      } else if (extraDown && bridgeRoll >= 0.28 && bridgeRoll < 0.56) {
        addEdge(curr[i + 1], next[j]);
      }
      i += 1;
      j += 1;
      addEdge(curr[i], next[j]);
    }
  }
}

/**
 * Generates a 16-floor planar, multi-column (3-4 lanes) branching Spire map:
 * - Floor 1: 3 starting combat nodes
 * - Floors 1-5: NEVER contain Elites (P0 #1 early curve smoothing)
 * - Floor 9: Guaranteed mid-Spire Treasure Chests
 * - Floor 15: Guaranteed Rest Campfire
 * - Floor 16: Act Boss
 * - Zero orphan nodes, zero crossing edges, and no back-to-back Elites/Rests/Shops along edges.
 */
export function generateSpireMap(state) {
  const allCols = [0, 1, 2, 3];
  const asc = state?.ascension ?? 0;

  const rowCols = [];
  for (let r = 0; r < TOTAL_FLOORS; r += 1) {
    const floor = r + 1;
    if (floor === 15 || floor === 16) {
      rowCols.push([1.5]);
    } else if (floor === 1) {
      const picked = pickDistinct(state, allCols, 3).sort((a, b) => a - b);
      rowCols.push(picked);
    } else if (floor === 9) {
      const picked = pickDistinct(state, allCols, 3).sort((a, b) => a - b);
      rowCols.push(picked);
    } else {
      const count = nextRandom(state) < 0.62 ? 3 : 4;
      const picked =
        count === 4 ? [...allCols] : pickDistinct(state, allCols, 3).sort((a, b) => a - b);
      rowCols.push(picked);
    }
  }

  const rows = rowCols.map((cols, rIdx) => {
    const floor = rIdx + 1;
    return cols.map((slotCol, cIdx) => ({
      id: `f${floor}_c${cIdx}`,
      floor,
      row: rIdx,
      col: cIdx,
      slotCol,
      type: 'combat',
      nextIds: [],
      visited: false,
    }));
  });

  // 1. Wire strictly planar, orphan-free branching edges across all 16 floors
  for (let r = 0; r < rows.length - 1; r += 1) {
    wirePlanarRowEdges(state, rows[r], rows[r + 1]);
  }

  // Build parent lookup for consecutive-node constraints
  const parentsById = new Map();
  for (let r = 0; r < rows.length; r += 1) {
    for (const node of rows[r]) {
      if (!parentsById.has(node.id)) parentsById.set(node.id, []);
    }
    if (r < rows.length - 1) {
      for (const parent of rows[r]) {
        for (const childId of parent.nextIds) {
          if (!parentsById.has(childId)) parentsById.set(childId, []);
          parentsById.get(childId).push(parent);
        }
      }
    }
  }

  // 2. Assign node types respecting Spire pacing & parent rules
  for (let r = 0; r < rows.length; r += 1) {
    const floor = r + 1;
    const row = rows[r];

    if (floor === 1) {
      row.forEach((n) => {
        n.type = 'combat';
      });
      continue;
    }
    if (floor === 9) {
      row.forEach((n) => {
        n.type = 'treasure';
      });
      continue;
    }
    if (floor === 15) {
      row[0].type = 'rest';
      continue;
    }
    if (floor === 16) {
      row[0].type = 'boss';
      continue;
    }

    for (const node of row) {
      const parents = parentsById.get(node.id) || [];
      const parentTypes = new Set(parents.map((p) => p.type));

      const weights = {
        combat: floor <= 2 ? 55 : 42,
        event: floor <= 2 ? 45 : 24,
        shop: floor >= 3 && !parentTypes.has('shop') ? 9 : 0,
        rest: floor >= 4 && floor <= 13 && !parentTypes.has('rest') ? 14 : 0,
        elite:
          floor >= 6 && floor <= 14 && !parentTypes.has('elite')
            ? asc >= 1
              ? 25
              : 17
            : 0,
      };

      node.type = pickWeightedType(state, weights);
    }

    // Ensure parallel choices on the same floor aren't completely uniform
    if (row.length >= 3 && new Set(row.map((n) => n.type)).size === 1) {
      const pivot = row[Math.floor(nextRandom(state) * row.length)];
      const parents = parentsById.get(pivot.id) || [];
      const parentTypes = new Set(parents.map((p) => p.type));
      if (floor >= 6 && pivot.type !== 'elite' && !parentTypes.has('elite')) {
        pivot.type = 'elite';
      } else if (floor >= 4 && floor <= 13 && pivot.type !== 'rest' && !parentTypes.has('rest')) {
        pivot.type = 'rest';
      } else {
        pivot.type = pivot.type === 'combat' ? 'event' : 'combat';
      }
    }
  }

  // 3. Enforce minimum Act quotas so every seed has rich shops, campfires, and F6+ elites
  const canAssignType = (node, targetType) => {
    const parents = parentsById.get(node.id) || [];
    const children = node.nextIds
      .map((cid) => rows[node.row + 1]?.find((x) => x.id === cid))
      .filter(Boolean);
    if (['elite', 'rest', 'shop'].includes(targetType)) {
      if (parents.some((p) => p.type === targetType)) return false;
      if (children.some((c) => c.type === targetType)) return false;
    }
    return true;
  };

  const countType = (t, minFloor = 1, maxFloor = 14) =>
    rows
      .slice(minFloor - 1, maxFloor)
      .flat()
      .filter((n) => n.type === t).length;

  const ensureMinimum = (targetType, minCount, candidateFloors) => {
    let current = countType(targetType, Math.min(...candidateFloors), Math.max(...candidateFloors));
    if (current >= minCount) return;
    const candidates = candidateFloors
      .flatMap((fl) => rows[fl - 1])
      .filter((n) => n.type === 'combat' || n.type === 'event');
    const ordered = pickDistinct(state, candidates, candidates.length);
    for (const node of ordered) {
      if (current >= minCount) break;
      if (canAssignType(node, targetType)) {
        node.type = targetType;
        current += 1;
      }
    }
  };

  ensureMinimum('shop', 2, [3, 4, 5, 7, 11, 13, 14]);
  ensureMinimum('rest', 3, [4, 5, 7, 8, 10, 12, 13]);
  ensureMinimum('elite', asc >= 1 ? 5 : 3, [6, 7, 8, 10, 11, 12, 13, 14]);

  return rows;
}
