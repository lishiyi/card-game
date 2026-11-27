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
    badge: '第三步 · 尖塔路线与四职业流派',
    title: '稳度前五层，驾驭四大英雄核心流派',
    body: '第 1–5 层无精英可稳步攒牌；第 6 层起挑战【精英】赢取强力遗物；第 9 层开启【远古宝箱】。铁甲战士擅长【力量/消耗/壁垒】；静默猎手擅长【剧毒/小刀/弃牌】；观者擅长【平静↔愤怒姿舞 / 真言神格】；故障机器人擅长【闪电/冰霜/黑暗/等离子充能球与集中】！',
  },
]);

const CORE_MECHANIC_ENTRIES = [
  {
    id: 'kw_block',
    name: '格挡 (Block)',
    category: 'mechanics',
    tag: '核心机制',
    description: '优先抵消受到的攻击伤害。默认在你的下回合开始时自动清零（拥有能力【壁垒】或遗物【锚/船夹板/舵盘】时可保留或自动获得）。',
  },
  {
    id: 'kw_stances',
    name: '姿态：平静 / 愤怒 / 神格 (Stances)',
    category: 'mechanics',
    tag: '观者 · 姿态切换',
    description: '观者核心机制！同一时间只能处于一种姿态：【平静】退出时立刻 +2 能量（紫色莲花 +3）；【愤怒】造成与受到的攻击伤害均翻倍（2×），切记回合结束前退出或备足格挡；【神格】进入时 +3 能量且攻击伤害 ×3，下回合开始自动退出！配合【心灵堡垒】与【猛虎下山】可在切换姿态间叠盾抽牌。',
  },
  {
    id: 'kw_mantra',
    name: '真言与神格 (Mantra & Divinity)',
    category: 'mechanics',
    tag: '观者 · 真言流',
    description: '通过【五体投地】【祈祷】【敬拜】【虔信】【手鼓】等累积真言，每集满 10 层立即消耗 10 层并进入【神格】（立刻 +3 能量、本回合攻击伤害 ×3），并能叠加【光辉】伤害！',
  },
  {
    id: 'kw_mark',
    name: '印记 (Mark)',
    category: 'mechanics',
    tag: '观者 · 点穴流',
    description: '【点穴】对目标施加印记并立刻引爆全场所有带印记敌人的生命流失（无视格挡与脆弱，持续叠加越打越痛）。',
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
    description: '0 费 4 伤（升级 6 伤）的衍生攻击牌，打出后自动【消耗】。可受【精准】、【袖剑】大幅增伤，并极速触发【手里剑】、【苦无】、【余像】、【凌迟】、【涂毒】与【终结技】！',
  },
  {
    id: 'kw_discard',
    name: '主动弃牌 (Discard)',
    category: 'mechanics',
    tag: '静默猎手 · 弃牌流',
    description: '通过【生存者】、【杂技】、【早有准备】、【计算下注】等卡牌主动弃置手牌时，可触发【战术大师】回能、【本能反应】抽牌、【结实绷带】叠甲、【铜钹】砸伤，并降低【内脏切除】费用与触发【隐秘打击】返能（回合结束自然弃牌不触发）。',
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
    id: 'kw_fatal',
    name: '斩杀 (Fatal)',
    category: 'mechanics',
    tag: '卡牌词条',
    description: '仅当使用带有【斩杀】词条的卡牌（如【狂宴】、【贪婪之手】、【勤学精进】、【仪式匕首】）彻底击败一名非【爪牙】敌人时触发永久奖励。击杀爪牙单位（地精首领随从、青铜球、火炬头、魔刃飞刀）、可复活的暗影虫或一阶段觉醒者均不会触发斩杀效果。',
  },
  {
    id: 'kw_card_choice',
    name: '自选消耗 / 自选升级 / 预见 (Scry)',
    category: 'mechanics',
    tag: '交互选牌',
    description: '【坚毅+】可自选消耗 1 张手牌，【武装】可自选升级 1 张手牌；【预见】可检视抽牌堆顶若干张牌并勾选弃置不需要的牌（【黄金眼】预见 +2，【涅槃】每弃置 1 张提供格挡，【迂回】预见后自动回到手牌）。',
  },
  {
    id: 'kw_innate',
    name: '固有 (Innate)',
    category: 'mechanics',
    tag: '卡牌词条',
    description: '每场战斗第 1 回合必定优先抽到起手手牌中（如【背刺】、【启动流程】、【无限刀刃+】、【余像+】、【战歌+】）。',
  },
  {
    id: 'kw_retain',
    name: '保留 (Retain)',
    category: 'mechanics',
    tag: '卡牌词条',
    description: '回合结束时若仍留在手中，不会进入弃牌堆，而是直接保留至下一回合（如【奇迹】【惩恶】【平安】【时之沙】【坚韧】；观者能力【确立基础】可在保留时永久减费）。',
  },
  {
    id: 'kw_ethereal',
    name: '虚无 (Ethereal)',
    category: 'mechanics',
    tag: '卡牌词条',
    description: '回合结束时若仍留在手牌中未打出，将自动【消耗】移出本场战斗（如【幽灵铠甲】、【天人形态】、【晕眩】、【笨拙】）。',
  },
  {
    id: 'kw_xcost',
    name: 'X 费卡牌',
    category: 'mechanics',
    tag: '卡牌词条',
    description: '打出时消耗当前剩余的全部能量 X（0 点能量时也可打出，生效 0 次），效果随消耗能量次数线性释放（如【旋风斩】、【萎靡】、【串刺】）。',
  },
  {
    id: 'kw_status_curse',
    name: '状态牌与诅咒牌（10 随机 + 4 特殊）',
    category: 'mechanics',
    tag: '干扰机制',
    description: '【状态牌】（伤口/黏液/晕眩/灼伤/虚空）仅限本场战斗生效；【随机诅咒池】（10 种：笨拙/疑虑/悔恨/寄生/受伤/苦恼/羞耻/腐朽，以及极高危的【凡庸】每回合限打 3 张牌与【疼痛】每出其他牌掉 1 血）会永久留在牌组，需在商店或事件移除；另有【进阶之灾】【死灵诅咒】【铃铛的诅咒】不可移除。',
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
  {
    id: 'kw_daily',
    name: '每日挑战与战绩评分',
    category: 'mechanics',
    tag: '每日限定',
    description: '每天自动生成一套全球同图的日期种子、指定角色与 3 条随机规则词条（构筑增益 + 节奏变化 + 高分挑战）。结算出分与评级（C 至 S+），支持复制战绩卡与 ?daily=YYYY-MM-DD 直连分享。',
  },
  {
    id: 'kw_colorless',
    name: '商店专属无色牌',
    category: 'mechanics',
    tag: '神秘商人',
    description: '共有 35 张跨职业无色牌（20 罕见 + 15 稀有，含神化、贪婪之手、残虐天性、战略大师、万能药、黑暗镣铐、炸弹、心灵震慑、应急按钮、秘密技法、秘密武器、乱战等）。可在神秘商店无色货架（每间商店固定刷出 2 罕见 + 1 稀有）或特定无色事件中获取，不会出现在普通战斗掉落中。',
  },
  {
    id: 'kw_relic_tiers',
    name: '遗物池严格分层与宝箱规模',
    category: 'mechanics',
    tag: '遗物体系',
    description: '全部 113 件遗物严格划分初始/普通/罕见/稀有/商店专属/事件专属/首领 7 大池（含壶铃/铲子/宁静烟斗三大营火遗物，每局至多获得其中 2 件）；宝箱分小/中/大三种规格对应不同稀罕掉率；神秘商店固定刷出一般遗物与商店专属遗物。',
  },
  {
    id: 'kw_chemical_x',
    name: '化学物X / X费强化',
    category: 'mechanics',
    tag: '商店遗物',
    description: '持有商店专属遗物【化学物X】时，所有消耗全部剩余能量的 X 费卡牌（如旋风斩、串刺、萎靡、硬化机体、暴风雨、多重释放）在结算时都会额外 +2 次效果！',
  },
  {
    id: 'kw_watcher_guide',
    name: '观者实战指南 · 安全切态与保留斩杀',
    category: 'mechanics',
    tag: '观者技巧',
    description: '【愤怒】下敌方伤害也会翻倍，切忌无退路硬吃高伤：优先升级【暴怒】降至 1 费，并在进入愤怒前确保手牌留有【警惕】【内心宁静】【不惧妖邪】【化拳/化体/化智为空】或【停顿】兜底，或先精算本回合能否直接斩杀；离开【平静】回复的 +2 能量配合【猛虎下山】【心灵堡垒】即可形成高速低伤循环。',
  },
  {
    id: 'kw_defect_orbs',
    name: '充能球 · 充能 / 激发（故障机器人）',
    category: 'mechanics',
    tag: '故障机器人机制',
    description: '故障机器人初始拥有 3 个充能球槽位（上限 10 个），按从右到左顺序排列，最右侧金框标示的队首充能球将在下次【激发】或满槽溢出时最先触发，其余充能球依次右移！四大球种：⚡闪电球（回合结束 3 伤 / 激发 8 伤）、❄️冰霜球（回合结束 2 盾 / 激发 5 盾）、🌑黑暗球（初始 6 伤，每回合 +6 蓄能，激发打击生命最低的敌人）、☀️等离子球（回合开始 +1 能量 / 激发 +2 能量，不受集中影响）。',
  },
  {
    id: 'kw_focus_lockon',
    name: '集中（Focus）与锁定（Lock-On）',
    category: 'mechanics',
    tag: '故障机器人机制',
    description: '【集中】提高闪电、冰霜、黑暗充能球的被动与激发数值（可为负值，最低降至 0，不影响等离子球）；敌方身上的【锁定】使闪电球与黑暗球对其造成的伤害提高 50%（×1.5），且可被人工制品抵消。',
  },
  {
    id: 'kw_act3',
    name: '第三幕 · 深渊圣殿',
    category: 'mechanics',
    tag: '终极攀登',
    description: '击败第二幕首领后可继续攀登第三幕（涵盖暗影虫群、尖塔蔓生体、瞬息、蠕动之块、圆球行者、巨型石首、复仇女神、爬虫术士等 17 种强敌），并在第 16 层挑战时间吞噬者、觉醒者或多努与德卡双首领！',
  },
];

export function getGlossaryEntries() {
  const statusEntries = Object.values(STATUS_METADATA).map((meta) => {
    const isDebuff = meta.polarity === 'debuff';
    return {
      id: `status_${meta.id}`,
      statusKey: meta.id,
      polarity: meta.polarity,
      name: meta.name,
      category: isDebuff ? 'debuffs' : 'buffs',
      tag: isDebuff ? '负面状态 (Debuff)' : '正面状态 (Buff)',
      description: meta.describe(2),
    };
  });
  return [...CORE_MECHANIC_ENTRIES, ...statusEntries];
}
