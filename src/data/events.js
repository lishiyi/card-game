import { hasDailyModifier } from '../engine/daily.js';
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
    maxAct: 2,
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
    maxAct: 2,
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
    maxAct: 2,
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
    maxAct: 1,
    description:
      '机关基座上供奉着一尊璀璨纯金神像。四周岩壁布满暗孔与咒文，强行取走必会触发古老禁制。',
    choices: [
      {
        id: 'smash_trap',
        label: '硬抗机关夺宝',
        detail: '获得 135 金币与事件遗物【黄金神像】（战斗掉落金币 +25%），但被滚石擦伤失去 14 点生命。',
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
    maxAct: 2,
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
        detail: '从牌组中自选 1 张牌，将其变化为 1 张随机非基础职业卡牌。',
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
    maxAct: 1,
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
  scrap_ooze: {
    id: 'scrap_ooze',
    title: '废料软泥',
    minAct: 1,
    maxAct: 1,
    description:
      '角落里盘踞着一团冒着酸泡的巨型金属软泥，半透明的胶质体内隐约闪烁着一件远古遗物的金属微光。',
    choices: [
      {
        id: 'reach_ooze',
        label: '伸手探入软泥',
        detail: '失去 5 点生命，有 45% 概率掏出 1 件随机遗物（失败可继续尝试，每次生命代价 +1、成功率 +15%）。',
      },
      {
        id: 'leave_ooze',
        label: '转身离开',
        detail: '放弃冒险，毫发无伤离开。',
      },
    ],
  },
  wing_statue: {
    id: 'wing_statue',
    title: '翼龙石像',
    minAct: 1,
    maxAct: 2,
    description:
      '一座展翼欲飞的古铜翼龙石像矗立在圣坛中央，基座暗格中嵌满金币，而翼尖散发着洗涤杂念的微光。',
    choices: [
      {
        id: 'pray_wing',
        label: '虔诚祈祷',
        detail: '失去 7 点生命，自选并永久移除牌组中的 1 张卡牌。',
      },
      {
        id: 'destroy_wing',
        label: '全力震碎石像',
        detail: '需要牌组中有基础伤害 ≥ 10 的攻击牌：震碎石像，安全获得 65 金币。',
      },
      {
        id: 'leave_wing',
        label: '径直离开',
        detail: '不打扰石像的沉眠。',
      },
    ],
  },
  masked_bandits: {
    id: 'masked_bandits',
    title: '蒙面强盗团',
    minAct: 2,
    description:
      '几名戴着猩红面罩的盗匪从阴影中蜂拥而出，堵住了去路：“把钱袋交出来，或者尝尝我们的刀刃！”',
    options: [
      {
        id: 'pay_gold',
        label: '交出全部金币买路',
        detail: '失去当前全部金币，安全离开。',
      },
      {
        id: 'fight_bandits',
        label: '迎战蒙面强盗团',
        detail: '击败强盗团后固定获得 75 金币与事件遗物【红面具】（战斗开场使全体敌人获得 1 层虚弱）。',
      },
    ],
  },
  council_of_ghosts: {
    id: 'council_of_ghosts',
    title: '幽灵议会',
    minAct: 2,
    maxAct: 2,
    description:
      '数道苍白半透明的身影浮现在城邦废墟上空，齐声向你发出邀约：“献出凡胎生机，换取穿越刀剑的幽冥之躯吧。”',
    choices: [
      {
        id: 'accept_ghosts',
        label: '接受幽灵赐福',
        detail: '永久失去 35% 最大生命（最低保留 20 点），获得 3 张【幽灵化】（1 费虚无消耗，获得 1 层无实体）！',
      },
      {
        id: 'refuse_ghosts',
        label: '谢绝邀约',
        detail: '守住生者之躯，安全离开。',
      },
    ],
  },
  forgotten_altar: {
    id: 'forgotten_altar',
    title: '遗忘祭坛',
    minAct: 2,
    maxAct: 2,
    description:
      '被藤蔓吞噬的暗红祭坛中央刻着一尊缺损神像的凹槽，干涸的血迹仍在石纹间隐隐脉动。',
    choices: [
      {
        id: 'offer_golden_idol',
        label: '献祭【黄金神像】',
        detail: '需要持有【黄金神像】：将其升华为事件遗物【染血神像】（每次获得金币回复 5 点生命）并立即回满生命！',
      },
      {
        id: 'shed_blood_altar',
        label: '割腕滴血献祭',
        detail: '失去 25% 最大生命的当前生命，永久获得 +6 最大生命并随机升级 1 张卡牌。',
      },
      {
        id: 'desecrate_altar',
        label: '亵渎祭坛掠金',
        detail: '搜刮 105 金币，但将 1 张诅咒【悔恨】加入你的牌组。',
      },
    ],
  },
  augmenter: {
    id: 'augmenter',
    title: '炼体改造师',
    minAct: 2,
    maxAct: 3,
    description:
      '一名背负炼金药箱的怪异医者拦住去路：“想让你的武技发生脱胎换骨的质变吗？只需一点小小的代价……”',
    choices: [
      {
        id: 'augment_rare_transform',
        label: '接受秘术蜕变',
        detail: '从牌组中自选 1 张卡牌，将其定向重塑为 1 张随机金色【稀有】职业卡牌！',
      },
      {
        id: 'augment_serum',
        label: '注射强化血清',
        detail: '失去 12 点生命，永久提升 7 点最大生命，并随机获得 1 张罕见/稀有职业卡牌。',
      },
      {
        id: 'augment_leave',
        label: '谢绝实验',
        detail: '不信任未知药剂，转身离开。',
      },
    ],
  },
  mind_bloom: {
    id: 'mind_bloom',
    title: '心花怒放',
    minAct: 3,
    maxAct: 3,
    description:
      '深渊圣殿的腐朽壁画前，一朵洁白却令人不安的幻象之花悄然绽放，向你低语三种扭曲的愿景。',
    options: [
      {
        id: 'war_memory',
        label: '「我即战争」：迎战第 1 幕首领幻影',
        detail: '立即与一位第 1 幕首领展开死斗，获胜固定奖励 100 金币与 1 件稀有遗物。',
      },
      {
        id: 'awake_memory',
        label: '「我即清醒」：灵魂升华',
        detail: '升级牌组中全部可升级的卡牌，但永久失去 15% 最大生命（最低保留 25 点）。',
      },
      {
        id: 'rich_memory',
        label: '「我即富足」：索取贪婪宝库',
        detail: '获得 450 金币，但将 2 张【疑虑】诅咒加入你的牌组。',
      },
    ],
  },
  sensory_stone: {
    id: 'sensory_stone',
    title: '记忆晶石',
    minAct: 3,
    maxAct: 3,
    description:
      '一块悬浮在虚空中的多面体水晶不断折射出尖塔昔日英雄的记忆碎片，触碰越深，涌来的秘传越耀眼。',
    choices: [
      {
        id: 'recall_1',
        label: '轻触表层残忆',
        detail: '无损免费：从 3 张跨职业【无色牌】中任选 1 张加入牌组。',
      },
      {
        id: 'recall_2',
        label: '潜入深层幻境',
        detail: '失去 5 点生命：从 3 张已升级的【无色牌+】中任选 1 张加入牌组！',
      },
      {
        id: 'recall_3',
        label: '直面尖塔真相',
        detail: '失去 12 点生命：直接获得 1 张金色【无色稀有牌+】与 1 件随机遗物！',
      },
    ],
  },
  winding_halls: {
    id: 'winding_halls',
    title: '曲折回廊',
    minAct: 3,
    maxAct: 3,
    description:
      '深渊圣殿的走廊忽然开始无限扭曲折叠，低语在耳畔回响，每一条岔路都要求你付出不同的神智或体魄代价。',
    choices: [
      {
        id: 'embrace_madness',
        label: '拥抱疯狂灵感',
        detail: '失去 12 点生命，获得 2 张随机 0 费【无色罕见牌】加入牌组！',
      },
      {
        id: 'retrace_steps',
        label: '驻足回溯心神',
        detail: '回复 25% 最大生命值，但将 1 张诅咒【疑虑】加入牌组。',
      },
      {
        id: 'push_through_halls',
        label: '强行破壁前行',
        detail: '永久失去 6% 最大生命（最低保留 25 点），不带任何诅咒安全脱身。',
      },
    ],
  },
});

export const EVENT_IDS = Object.freeze(Object.keys(EVENT_LIBRARY));

export function getEventIdsForAct(act = 1) {
  const safeAct = Math.max(1, Number(act) || 1);
  return EVENT_IDS.filter((id) => {
    const ev = EVENT_LIBRARY[id];
    const minAct = ev?.minAct ?? 1;
    const maxAct = ev?.maxAct ?? 3;
    return safeAct >= minAct && safeAct <= maxAct;
  });
}

export function getEventTuning(ascension = 0) {
  const isA8 = (ascension ?? 0) >= 8;
  return {
    isA8,
    shiningLightHpLoss: isA8 ? 16 : 12,
    forgeOverclockHpLoss: isA8 ? 9 : 6,
    forgeOverclockGold: isA8 ? 40 : 30,
    forgeScavengeGold: isA8 ? 35 : 40,
    shrineSpringHealPct: isA8 ? 20 : 25,
    shrineGatherGold: isA8 ? 50 : 65,
    thornOpenHpLoss: isA8 ? 11 : 8,
    thornCoinsGold: isA8 ? 35 : 45,
    idolSmashHpLoss: isA8 ? 18 : 14,
    idolSmashGold: isA8 ? 120 : 135,
    idolCurseGold: isA8 ? 150 : 175,
    tomeFinalHpLoss: isA8 ? 18 : 14,
    tomeSkimHpLoss: isA8 ? 8 : 5,
    alchemistBuyGold: isA8 ? 45 : 35,
    alchemistMutagenMaxHp: isA8 ? 4 : 6,
    alchemistRobGold: isA8 ? 50 : 60,
    grottoBlueHealPct: isA8 ? 25 : 35,
    grottoRedHpLoss: isA8 ? 10 : 7,
    grottoRedMaxHp: isA8 ? 4 : 5,
    libraryNapHeal: isA8 ? 15 : 20,
    oozeBaseHpLoss: isA8 ? 7 : 5,
    oozeBaseChancePct: isA8 ? 35 : 45,
    wingPrayHpLoss: isA8 ? 10 : 7,
    wingDestroyGold: isA8 ? 50 : 65,
    banditsFightGold: isA8 ? 60 : 75,
    ghostsMaxHpLossPct: isA8 ? 42 : 35,
    altarShedHpPct: isA8 ? 30 : 25,
    altarShedMaxHpGain: isA8 ? 5 : 6,
    altarDesecrateGold: isA8 ? 85 : 105,
    augmentSerumHpLoss: isA8 ? 16 : 12,
    augmentSerumMaxHpGain: isA8 ? 5 : 7,
    mindBloomWarGold: isA8 ? 80 : 100,
    mindBloomAwakeMaxHpPct: isA8 ? 22 : 15,
    mindBloomRichGold: isA8 ? 360 : 450,
    sensoryRecall2HpLoss: isA8 ? 8 : 5,
    sensoryRecall3HpLoss: isA8 ? 16 : 12,
    windingMadnessHpLoss: isA8 ? 16 : 12,
    windingRetraceHealPct: isA8 ? 20 : 25,
    windingPushMaxHpPct: isA8 ? 9 : 6,
  };
}

export function getEventChoicesForAscension(eventId, ascension = 0) {
  const evDef = EVENT_LIBRARY[eventId];
  if (!evDef) return [];
  const rawList = Array.isArray(evDef.choices)
    ? evDef.choices
    : Array.isArray(evDef.options)
      ? evDef.options
      : [];
  const t = getEventTuning(ascension);
  if (!t.isA8) {
    return rawList.map((ch) => ({ ...ch }));
  }

  const detailOverrides = {
    shining_light: {
      enter_light: `失去 ${t.shiningLightHpLoss} 点生命，随机升级牌组中的 2 张卡牌。`,
    },
    ancient_forge: {
      overclock_forge: `失去 ${t.forgeOverclockHpLoss} 点生命并花费 ${t.forgeOverclockGold} 金币，随机升级牌组中的 2 张卡牌。`,
      scavenge_slag: `安全拾取锻台旁的精铁锭，获得 ${t.forgeScavengeGold} 金币。`,
    },
    ancient_shrine: {
      drink_spring: `回复 ${t.shrineSpringHealPct}% 最大生命值。`,
      gather_gold: `获得 ${t.shrineGatherGold} 金币。`,
    },
    thorn_reliquary: {
      open_reliquary: `失去 ${t.thornOpenHpLoss} 点生命，获得 1 件随机遗物。`,
      take_coins: `安全获得 ${t.thornCoinsGold} 金币。`,
    },
    golden_idol: {
      smash_trap: `获得 ${t.idolSmashGold} 金币与事件遗物【黄金神像】（战斗掉落金币 +25%），但被滚石擦伤失去 ${t.idolSmashHpLoss} 点生命。`,
      accept_curse_gold: `获得 ${t.idolCurseGold} 金币，但将 1 张诅咒【悔恨】加入你的牌组。`,
    },
    cursed_tome: {
      read_final_chapter: `失去 ${t.tomeFinalHpLoss} 点生命，随机获得 1 张【稀有】卡牌加入牌组！`,
      skim_preface: `失去 ${t.tomeSkimHpLoss} 点生命，随机获得 1 张【罕见】卡牌加入牌组。`,
    },
    potion_alchemist: {
      buy_potions: `花费 ${t.alchemistBuyGold} 金币，随机获得药水直至填满空药水栏。`,
      drink_mutagen: `永久提升 ${t.alchemistMutagenMaxHp} 点最大生命值，并立即回复 ${t.alchemistMutagenMaxHp} 点生命。`,
      rob_alchemist: `强夺 ${t.alchemistRobGold} 金币，但沾染怨念将 1 张诅咒【疑虑】加入牌组。`,
    },
    mushroom_grotto: {
      eat_blue_cap: `回复 ${t.grottoBlueHealPct}% 最大生命值，但将 1 张虚无诅咒【笨拙】加入牌组。`,
      refine_red_spore: `失去 ${t.grottoRedHpLoss} 点当前生命，永久增加 ${t.grottoRedMaxHp} 点最大生命值。`,
    },
    library_sanctum: {
      nap_in_library: `放松紧绷的神经，回复 ${t.libraryNapHeal} 点生命。`,
    },
    scrap_ooze: {
      reach_ooze: `失去 ${t.oozeBaseHpLoss} 点生命，有 ${t.oozeBaseChancePct}% 概率掏出 1 件随机遗物（失败可继续尝试，每次生命代价 +1、成功率 +15%）。`,
    },
    wing_statue: {
      pray_wing: `失去 ${t.wingPrayHpLoss} 点生命，自选并永久移除牌组中的 1 张卡牌。`,
      destroy_wing: `需要牌组中有基础伤害 ≥ 10 的攻击牌：震碎石像，安全获得 ${t.wingDestroyGold} 金币。`,
    },
    masked_bandits: {
      fight_bandits: `击败强盗团后固定获得 ${t.banditsFightGold} 金币与事件遗物【红面具】（战斗开场使全体敌人获得 1 层虚弱）。`,
    },
    council_of_ghosts: {
      accept_ghosts: `永久失去 ${t.ghostsMaxHpLossPct}% 最大生命（最低保留 20 点），获得 3 张【幽灵化】（1 费虚无消耗，获得 1 层无实体）！`,
    },
    forgotten_altar: {
      shed_blood_altar: `失去 ${t.altarShedHpPct}% 最大生命的当前生命，永久获得 +${t.altarShedMaxHpGain} 最大生命并随机升级 1 张卡牌。`,
      desecrate_altar: `搜刮 ${t.altarDesecrateGold} 金币，但将 1 张诅咒【悔恨】加入你的牌组。`,
    },
    augmenter: {
      augment_serum: `失去 ${t.augmentSerumHpLoss} 点生命，永久提升 ${t.augmentSerumMaxHpGain} 点最大生命，并随机获得 1 张罕见/稀有职业卡牌。`,
    },
    mind_bloom: {
      war_memory: `立即与一位第 1 幕首领展开死斗，获胜固定奖励 ${t.mindBloomWarGold} 金币与 1 件稀有遗物。`,
      awake_memory: `升级牌组中全部可升级的卡牌，但永久失去 ${t.mindBloomAwakeMaxHpPct}% 最大生命（最低保留 25 点）。`,
      rich_memory: `获得 ${t.mindBloomRichGold} 金币，但将 2 张【疑虑】诅咒加入你的牌组。`,
    },
    sensory_stone: {
      recall_2: `失去 ${t.sensoryRecall2HpLoss} 点生命：从 3 张已升级的【无色牌+】中任选 1 张加入牌组！`,
      recall_3: `失去 ${t.sensoryRecall3HpLoss} 点生命：直接获得 1 张金色【无色稀有牌+】与 1 件随机遗物！`,
    },
    winding_halls: {
      embrace_madness: `失去 ${t.windingMadnessHpLoss} 点生命，获得 2 张随机 0 费【无色罕见牌】加入牌组！`,
      retrace_steps: `回复 ${t.windingRetraceHealPct}% 最大生命值，但将 1 张诅咒【疑虑】加入牌组。`,
      push_through_halls: `永久失去 ${t.windingPushMaxHpPct}% 最大生命（最低保留 25 点），不带任何诅咒安全脱身。`,
    },
  }[eventId];

  return rawList.map((ch) => ({
    ...ch,
    detail: detailOverrides?.[ch.id] ?? ch.detail,
  }));
}

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
  const wouldTrapAnyParentInElite = (node) => {
    if (node.floor < 6 || node.floor > 14) return false;
    const parents = parentsById.get(node.id) || [];
    for (const p of parents) {
      const siblingIds = p.nextIds;
      const hasOtherNonElite = siblingIds.some((cid) => {
        if (cid === node.id) return false;
        const child = rows[node.row]?.find((x) => x.id === cid);
        return child && child.type !== 'elite';
      });
      if (!hasOtherNonElite) return true;
    }
    return false;
  };

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

      const bigGame = hasDailyModifier(state, 'big_game_hunter');
      const allowElite = floor >= 6 && floor <= 14 && !wouldTrapAnyParentInElite(node);
      const weights = {
        combat: floor <= 2 ? 55 : 44,
        event: floor <= 2 ? 45 : 24,
        shop: floor >= 3 && !parentTypes.has('shop') ? 9 : 0,
        rest: floor >= 4 && floor <= 13 && !parentTypes.has('rest') ? 14 : 0,
        elite:
          allowElite && !parentTypes.has('elite')
            ? bigGame
              ? 30
              : asc >= 1
                ? 19
                : 13
            : 0,
      };

      node.type = pickWeightedType(state, weights);
    }

    // Ensure parallel choices on the same floor aren't completely uniform
    if (row.length >= 3 && new Set(row.map((n) => n.type)).size === 1) {
      const pivot = row[Math.floor(nextRandom(state) * row.length)];
      const parents = parentsById.get(pivot.id) || [];
      const parentTypes = new Set(parents.map((p) => p.type));
      if (
        floor >= 6 &&
        pivot.type !== 'elite' &&
        !parentTypes.has('elite') &&
        !wouldTrapAnyParentInElite(pivot)
      ) {
        pivot.type = 'elite';
      } else if (floor >= 4 && floor <= 13 && pivot.type !== 'rest' && !parentTypes.has('rest')) {
        pivot.type = 'rest';
      } else {
        pivot.type = pivot.type === 'combat' ? 'event' : 'combat';
      }
    }
  }

  // 3. Enforce minimum Act quotas so every seed has rich shops, campfires, and F6+ elites
  const canAssignType = (node, targetType, enforceNoTrap = true) => {
    const parents = parentsById.get(node.id) || [];
    const children = node.nextIds
      .map((cid) => rows[node.row + 1]?.find((x) => x.id === cid))
      .filter(Boolean);
    if (['elite', 'rest', 'shop'].includes(targetType)) {
      if (parents.some((p) => p.type === targetType)) return false;
      if (children.some((c) => c.type === targetType)) return false;
    }
    if (targetType === 'elite' && enforceNoTrap && wouldTrapAnyParentInElite(node)) {
      return false;
    }
    return true;
  };

  const countType = (t, minFloor = 1, maxFloor = 14) =>
    rows
      .slice(minFloor - 1, maxFloor)
      .flat()
      .filter((n) => n.type === t).length;

  const ensureMinimum = (targetType, minCount, candidateFloors, preserveOrder = false) => {
    let current = countType(targetType, Math.min(...candidateFloors), Math.max(...candidateFloors));
    if (current >= minCount) return;
    const candidates = candidateFloors
      .flatMap((fl) => rows[fl - 1])
      .filter((n) => n.type === 'combat' || n.type === 'event');
    const ordered = preserveOrder
      ? candidateFloors.flatMap((fl) => {
          const rowCands = rows[fl - 1].filter((n) => n.type === 'combat' || n.type === 'event');
          return pickDistinct(state, rowCands, rowCands.length);
        })
      : pickDistinct(state, candidates, candidates.length);
    for (const node of ordered) {
      if (current >= minCount) break;
      if (node.type === targetType) continue;
      if (canAssignType(node, targetType, true)) {
        node.type = targetType;
        current += 1;
      }
    }
    if (current < minCount && targetType === 'elite') {
      for (const node of ordered) {
        if (current >= minCount) break;
        if (node.type === targetType) continue;
        if (canAssignType(node, targetType, false)) {
          node.type = targetType;
          current += 1;
        }
      }
    }
    if (current < minCount && targetType === 'elite') {
      const nodeById = new Map(rows.flat().map((n) => [n.id, n]));
      for (const node of ordered) {
        if (current >= minCount) break;
        if (node.type === targetType) continue;
        if (node.floor < 6 || node.floor === 9 || node.floor > 14) continue;
        const parentRow = rows[node.floor - 2] || [];
        const hasEliteParent = parentRow.some((p) => p.nextIds?.includes(node.id) && p.type === 'elite');
        const hasEliteChild = (node.nextIds || []).some((cid) => nodeById.get(cid)?.type === 'elite');
        if (!hasEliteParent && !hasEliteChild) {
          node.type = targetType;
          current += 1;
        }
      }
    }
  };

  const bigGameHunter = hasDailyModifier(state, 'big_game_hunter');
  ensureMinimum('shop', 2, [3, 4, 5, 7, 11, 13, 14]);
  ensureMinimum('rest', 3, [4, 5, 7, 8, 10, 12, 13]);
  ensureMinimum('elite', bigGameHunter ? 6 : asc >= 1 ? 5 : 3, [7, 8, 10, 11, 12, 13, 14, 6], true);

  return rows;
}
