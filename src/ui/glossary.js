/**
 * Onboarding 3-step tutorial & categorized Keyword / Status Glossary dictionary.
 */

import { STATUS_METADATA } from '../data/relics.js';

export const TUTORIAL_STEPS = Object.freeze([
  {
    step: 1,
    badge: '第一步 · 回合与意图预判',
    title: '观察敌方本回合意图与下回合预测',
    body: '每回合默认拥有 3 点能量并抽 5 张手牌。出牌前先看敌人头顶：红色剑标代表即将攻击（注意多次连击如 4×6），盾标代表叠甲，紫色代表强化或塞状态牌。意图下方还会显示【下回合预测】，助你提前留牌或抢血斩杀！',
  },
  {
    step: 2,
    badge: '第二步 · 精简牌组与锻造减费',
    title: '宁缺毋滥，善用篝火升级与商店删牌',
    body: '战后三选一卡牌并非必拿——跳过平庸牌能让牌组保持在 15–22 张黄金厚度，更快循环抽到核心卡。在篝火优先【铁砧锻造】减费或质变卡（如盛怒+、全身撞击+、武装+），在神秘商人处移除基础【打击】或【诅咒】。',
  },
  {
    step: 3,
    badge: '第三步 · 尖塔路线与双职业流派',
    title: '稳度前五层，构筑战士与猎手核心流派',
    body: '第 1–5 层无精英可稳步攒牌；第 6 层起挑战【精英】赢取强力遗物；第 9 层开启【远古宝箱】。铁甲战士可走【力量多段 / 腐化消耗 / 壁垒叠盾】；静默猎手可走【剧毒催化 / 零费小刀 / 主动弃牌】！',
  },
]);

const CORE_MECHANIC_ENTRIES = [
  {
    id: 'kw_block',
    name: '格挡 (Block)',
    category: 'mechanics',
    tag: '核心机制',
    description: '优先抵消受到的攻击伤害。默认在你的下回合开始时自动清零（拥有能力【壁垒】或遗物【船锚/号角夹板/船长舵轮】时可保留或自动获得）。',
  },
  {
    id: 'kw_poison',
    name: '中毒与毒杀 (Poison)',
    category: 'mechanics',
    tag: '静默猎手 · 毒流',
    description: '敌人在其回合开始时无视格挡直接失去等同于中毒层数的生命，随后层数 -1。若中毒足以致死，敌人将直接倒下而不执行攻击意图！可配合【催化剂】倍增、【尸爆术】清场与【异蛇头骨】额外叠层。',
  },
  {
    id: 'kw_shiv',
    name: '小刀 (Shiv)',
    category: 'mechanics',
    tag: '静默猎手 · 小刀流',
    description: '0 费 4 伤（升级 6 伤）的衍生攻击牌，打出后自动【消耗】。可受【精准】、【腕刃】大幅增伤，并极速触发【手里剑】、【苦无】、【余像】、【凌迟】、【涂毒】与【终结技】！',
  },
  {
    id: 'kw_discard',
    name: '主动弃牌 (Discard)',
    category: 'mechanics',
    tag: '静默猎手 · 弃牌流',
    description: '通过【幸存者】、【杂技】、【早有准备】、【计算下注】等卡牌主动弃置手牌时，可触发【战术大师】回能、【本能反应】抽牌、【坚韧绷带】叠甲、【铜钹】砸伤，并降低【内脏切除】费用与触发【隐秘打击】返能（回合结束自然弃牌不触发）。',
  },
  {
    id: 'kw_upgrade',
    name: '升级 (+)',
    category: 'mechanics',
    tag: '卡牌强化',
    description: '卡牌名称后缀“+”且变为翠绿色，提升伤害/格挡/抽牌数值或降低能量消耗（如费用 1 → 0）。普通卡牌每张最多升级 1 次。',
  },
  {
    id: 'kw_exhaust',
    name: '消耗 (Exhaust)',
    category: 'mechanics',
    tag: '卡牌词条',
    description: '打出或触发消耗后移入【消耗堆】，本场战斗内不再进入洗牌循环，战斗结束后恢复。可触发【无惧疼痛】叠甲、【黑暗之拥】抽牌与【卡戎之灰】全体轰炸。',
  },
  {
    id: 'kw_innate',
    name: '固有 (Innate)',
    category: 'mechanics',
    tag: '卡牌词条',
    description: '每场战斗第 1 回合必定优先抽到起手手牌中（如【先制猛袭】、【无尽刀刃+】、【余像+】）。',
  },
  {
    id: 'kw_retain',
    name: '保留 (Retain)',
    category: 'mechanics',
    tag: '卡牌词条',
    description: '回合结束时若仍留在手中，不会进入弃牌堆，而是直接保留至下一回合（如【磐石守备】）。',
  },
  {
    id: 'kw_ethereal',
    name: '虚无 (Ethereal)',
    category: 'mechanics',
    tag: '卡牌词条',
    description: '回合结束时若仍留在手牌中未打出，将自动【消耗】移出本场战斗（如【幽灵铠甲】、【晕眩】、【笨拙】）。',
  },
  {
    id: 'kw_xcost',
    name: 'X 费卡牌',
    category: 'mechanics',
    tag: '卡牌词条',
    description: '打出时消耗当前剩余的全部能量 X（0 点能量时也可打出，生效 0 次），效果随消耗能量次数线性释放（如【旋风斩】）。',
  },
  {
    id: 'kw_status_curse',
    name: '状态牌与诅咒牌',
    category: 'mechanics',
    tag: '干扰机制',
    description: '【状态牌】（伤口/黏液/晕眩/灼伤）仅限本场战斗临时塞入牌堆；【诅咒牌】（笨拙/疑虑/悔恨）会永久留在总牌组中，需通过商店移除服务或净化事件清除。',
  },
  {
    id: 'kw_rare_pity',
    name: '稀有度动态保底',
    category: 'mechanics',
    tag: '掉落机制',
    description: '战后抽卡未出现金色【稀有】牌时，后续战斗稀有牌掉率每次自动累加 +4%（最高 +40%），一旦刷出稀有牌即重置保底。',
  },
  {
    id: 'kw_neow',
    name: '鲸鱼赐福 (第 0 层)',
    category: 'mechanics',
    tag: '开局机制',
    description: '每局第 1 幕开局先在地图顶部进行 4 选 1 赐福（稳健 / 实用 / 高风险高回报 / 放弃初始遗物换随机首领遗物），可先观察全图路线与首领再做决定。',
  },
  {
    id: 'kw_challenge',
    name: 'URL 种子直连挑战',
    category: 'mechanics',
    tag: '同图分享',
    description: '点击顶部种子徽章或战绩按钮可一键复制带 ?seed=...&asc=...&char=... 的挑战链接。好友打开后自动临时对齐角色、全图鉴与进阶难度，体验 100% 相同的地图、赐福与掉落。',
  },
];

export function getGlossaryEntries() {
  const statusEntries = Object.values(STATUS_METADATA).map((meta) => {
    const isDebuff = meta.polarity === 'debuff';
    return {
      id: `status_${meta.id}`,
      name: meta.name,
      category: isDebuff ? 'debuffs' : 'buffs',
      tag: isDebuff ? '负面状态 (Debuff)' : '正面状态 (Buff)',
      description: meta.describe(2),
    };
  });
  return [...CORE_MECHANIC_ENTRIES, ...statusEntries];
}
