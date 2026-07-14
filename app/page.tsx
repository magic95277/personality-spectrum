"use client";

import { useEffect, useMemo, useState } from "react";

type DimensionKey = "EI" | "SN" | "TF" | "JP";

type Question = {
  id: number;
  text: string;
  dimension: DimensionKey;
  reverse: boolean;
};

type TypeProfile = {
  name: string;
  tagline: string;
  summary: string;
  strengths: string[];
  blindSpots: string[];
  environment: string;
  relationship: string;
  growth: string;
};

const dimensions: Record<
  DimensionKey,
  { left: string; right: string; leftName: string; rightName: string; question: string }
> = {
  EI: { left: "E", right: "I", leftName: "外向", rightName: "内向", question: "能量从哪里来" },
  SN: { left: "S", right: "N", leftName: "实感", rightName: "直觉", question: "如何接收信息" },
  TF: { left: "T", right: "F", leftName: "思考", rightName: "情感", question: "如何作出判断" },
  JP: { left: "J", right: "P", leftName: "判断", rightName: "感知", question: "如何安排生活" },
};

const questions: Question[] = [
  { id: 1, text: "参加多人活动后，我通常会感到精神被重新点亮。", dimension: "EI", reverse: false },
  { id: 2, text: "面对新任务，我会先寻找已经验证过的具体做法。", dimension: "SN", reverse: false },
  { id: 3, text: "作决定时，即使结论不讨喜，我也更看重逻辑是否一致。", dimension: "TF", reverse: false },
  { id: 4, text: "开始一天前，我喜欢大致知道事情会按什么顺序发生。", dimension: "JP", reverse: false },
  { id: 5, text: "长时间社交后，我需要一段不被打扰的时间恢复状态。", dimension: "EI", reverse: true },
  { id: 6, text: "听到一个观点时，我常会联想到它未来可能发展成什么。", dimension: "SN", reverse: true },
  { id: 7, text: "两种方案都可行时，我会优先考虑它们对相关人的感受。", dimension: "TF", reverse: true },
  { id: 8, text: "旅行时，临时改变路线常让我觉得更有趣。", dimension: "JP", reverse: true },
  { id: 9, text: "在陌生场合，我往往愿意先开口打破安静。", dimension: "EI", reverse: false },
  { id: 10, text: "比起抽象框架，我更容易记住例子、步骤和细节。", dimension: "SN", reverse: false },
  { id: 11, text: "讨论分歧时，我会主动指出论证中不成立的部分。", dimension: "TF", reverse: false },
  { id: 12, text: "把待办事项逐项完成，会给我明显的轻松感。", dimension: "JP", reverse: false },
  { id: 13, text: "我更习惯先在心里把想法想清楚，再拿出来讨论。", dimension: "EI", reverse: true },
  { id: 14, text: "我容易被隐喻、趋势和事物背后的共同模式吸引。", dimension: "SN", reverse: true },
  { id: 15, text: "给别人反馈时，我会调整表达，避免让对方感到被否定。", dimension: "TF", reverse: true },
  { id: 16, text: "只要方向大致正确，我愿意边做边决定后面的细节。", dimension: "JP", reverse: true },
  { id: 17, text: "有一个新点子时，我常通过说出来与别人碰撞来完善它。", dimension: "EI", reverse: false },
  { id: 18, text: "我信任亲自观察到的事实，胜过尚未验证的推测。", dimension: "SN", reverse: false },
  { id: 19, text: "评价规则时，我首先会看它对所有人是否一致和公平。", dimension: "TF", reverse: false },
  { id: 20, text: "临近截止时间才集中处理事情，会让我感到不够踏实。", dimension: "JP", reverse: false },
  { id: 21, text: "比起认识很多人，我更享受与少数人进行深入交流。", dimension: "EI", reverse: true },
  { id: 22, text: "我常会追问：如果换一种假设，事情还可能怎样发展？", dimension: "SN", reverse: true },
  { id: 23, text: "看到别人为难时，我常先理解他的处境，再讨论解决办法。", dimension: "TF", reverse: true },
  { id: 24, text: "即使已经有计划，我也希望保留根据状态随时调整的空间。", dimension: "JP", reverse: true },
  { id: 25, text: "在团队讨论中，持续的互动通常能让我保持投入。", dimension: "EI", reverse: false },
  { id: 26, text: "学习新技能时，我偏好先照着清晰示范实际操作。", dimension: "SN", reverse: false },
  { id: 27, text: "解决冲突时，我倾向先厘清责任和因果，再处理情绪。", dimension: "TF", reverse: false },
  { id: 28, text: "我喜欢提早做完重要事项，以免最后出现意外。", dimension: "JP", reverse: false },
  { id: 29, text: "如果一天里没有独处空间，我会觉得思绪变得嘈杂。", dimension: "EI", reverse: true },
  { id: 30, text: "一个新概念是否有想象空间，常比它眼下是否实用更吸引我。", dimension: "SN", reverse: true },
  { id: 31, text: "即使没有明确收益，我也愿意支持一件符合自己价值观的事。", dimension: "TF", reverse: true },
  { id: 32, text: "比起严格照表执行，我更喜欢跟随当下最有动力的方向。", dimension: "JP", reverse: true },
  { id: 33, text: "认识新朋友时，我通常能较快找到可以聊的话题。", dimension: "EI", reverse: false },
  { id: 34, text: "描述一件事时，我倾向提供准确的信息，而不是延伸很多可能。", dimension: "SN", reverse: false },
  { id: 35, text: "当资源有限时，我会选择整体效率更高的方案。", dimension: "TF", reverse: false },
  { id: 36, text: "明确的决定比一直保留所有选项更让我安心。", dimension: "JP", reverse: false },
  { id: 37, text: "在重要会议前，我更愿意先准备好观点，而不是现场即兴形成。", dimension: "EI", reverse: true },
  { id: 38, text: "我经常从看似无关的信息之间发现新的联系。", dimension: "SN", reverse: true },
  { id: 39, text: "我判断一个选择是否合适时，会认真考虑它是否符合内心认同。", dimension: "TF", reverse: true },
  { id: 40, text: "突然而来的空闲时间，比被预先安排好的空闲更令我兴奋。", dimension: "JP", reverse: true },
  { id: 41, text: "遇到压力时，与可信任的人聊一聊常能帮助我恢复行动力。", dimension: "EI", reverse: false },
  { id: 42, text: "我会自然留意环境中的变化、遗漏和可立即处理的问题。", dimension: "SN", reverse: false },
  { id: 43, text: "面对批评，我更容易接受有证据的直白意见，而非含蓄暗示。", dimension: "TF", reverse: false },
  { id: 44, text: "我会为长期目标设置阶段节点，并定期检查是否偏离。", dimension: "JP", reverse: false },
  { id: 45, text: "我可以长时间沉浸在自己的兴趣中，而不需要外界参与。", dimension: "EI", reverse: true },
  { id: 46, text: "当别人解释‘是什么’时，我常更想知道‘为什么’以及‘还能怎样’。", dimension: "SN", reverse: true },
  { id: 47, text: "如果一种做法伤害了彼此的信任，即使高效我也会重新考虑。", dimension: "TF", reverse: true },
  { id: 48, text: "我更愿意让选择保持开放，直到确实需要定下来的时刻。", dimension: "JP", reverse: true },
];

const profiles: Record<string, TypeProfile> = {
  INTJ: { name: "战略构筑者", tagline: "把复杂变成一条可抵达的路径", summary: "你习惯从整体结构出发，独立推演长期走向，并把想法组织成可以执行的系统。你通常不满足于“照旧”，更想理解机制并持续优化。", strengths: ["看见长期趋势与系统关系", "独立思考，不轻易随波逐流", "能为复杂目标建立清晰结构"], blindSpots: ["可能低估情绪与关系成本", "标准较高，容易对低效失去耐心", "想清楚前不易让别人参与"], environment: "拥有自主空间、目标清楚且允许改进方法的环境，会让你的判断力得到充分发挥。", relationship: "你重视深度、坦诚与彼此成长，表达关心时常更偏向解决问题和提供长期支持。", growth: "在方案尚未完全成熟时就邀请反馈；把“对人有何影响”列为与效率同等重要的决策指标。" },
  INTP: { name: "逻辑探寻者", tagline: "为每个答案打开下一扇门", summary: "你被原理、模型和未解问题吸引，享受拆解假设并寻找更简洁的解释。你重视思想自由，也乐于在脑海中同时保留多种可能。", strengths: ["善于发现逻辑漏洞与新模型", "对复杂概念保持开放好奇", "能从独特角度重新定义问题"], blindSpots: ["可能停留在分析而延迟行动", "容易忽略重复但必要的收尾", "想法跳跃时别人不一定跟得上"], environment: "问题有探索空间、允许试验、少有无意义流程的环境，最能激活你的创造力。", relationship: "你通过分享观点、尊重边界和认真讨论表达亲近，需要既能交流思想又不压缩独处的关系。", growth: "为探索设置一个可交付的终点；在解释逻辑之前，先确认对方此刻需要理解还是陪伴。" },
  ENTJ: { name: "目标统筹者", tagline: "让愿景获得方向、资源与速度", summary: "你自然关注目标、资源和决策效率，擅长调动人和系统向前推进。面对挑战，你往往迅速建立优先级并承担组织责任。", strengths: ["快速看清目标与关键杠杆", "敢于决策并推动协作", "能在压力中维持大局视角"], blindSpots: ["速度过快可能压缩他人参与感", "容易把脆弱误解为缺乏能力", "休息与情感需求常被后置"], environment: "目标有挑战、权责明确且能产生真实影响的环境，会让你持续投入。", relationship: "你重视可靠、直接和共同进步，常用规划未来、解决难题和兑现承诺来表达在意。", growth: "在给方案前多问一个开放问题；刻意给不同节奏的人留下表达与消化的时间。" },
  ENTP: { name: "创想破局者", tagline: "在碰撞中发现还没人走过的路", summary: "你善于连接不同想法，在交流中迅速生成可能性。规则对你而言更像可以检验的假设，而不是不可移动的边界。", strengths: ["快速产生多种创新方案", "敢于质疑默认前提", "适应变化并带动讨论活力"], blindSpots: ["新鲜感消退后可能难以收尾", "辩论兴奋时会忽略对方感受", "选择过多导致承诺被推迟"], environment: "变化快、鼓励试验、可以跨领域协作的环境，能让你的灵活性变成成果。", relationship: "你喜欢有来有往、彼此启发的关系，需要自由，也珍惜能接住玩笑与深层问题的人。", growth: "每次创新只保留一个主实验；把完成和复盘也设计成有挑战感的游戏。" },
  INFJ: { name: "洞察引路人", tagline: "看见人心，也看见意义的远方", summary: "你常从细微线索中理解人的动机，并将这些洞察与长期价值连接起来。你温和但有坚定内核，希望行动能带来真实而持续的改善。", strengths: ["理解复杂情绪与潜在动机", "能把价值愿景组织成方向", "专注而有耐心地支持成长"], blindSpots: ["容易承担过多情绪责任", "理想与现实落差会带来消耗", "不满累积后可能突然抽离"], environment: "使命清楚、关系真诚并允许深度工作的环境，会让你的洞察转化为影响。", relationship: "你追求真诚与精神层面的连接，会认真记住细节，也需要安全空间整理自己的感受。", growth: "更早说出边界和小的不适；允许“足够好”的现实步骤承载长期理想。" },
  INFP: { name: "价值守望者", tagline: "忠于内心，也为世界保留温柔", summary: "你重视真实、意义与个体独特性，常能察觉语言背后的情感。丰富的内在世界让你对故事、可能性和人的成长保持敏感。", strengths: ["价值感清晰且富有同理心", "想象丰富，表达具有感染力", "尊重差异并看见个人潜力"], blindSpots: ["冲突中可能推迟表达真实需要", "理想标准过高导致难以开始", "容易把外部评价内化"], environment: "价值一致、允许个性表达并有安静专注空间的环境，更容易让你稳定创造。", relationship: "你需要被理解而非被定义，通常以倾听、共情和记住对方在意之事来表达爱。", growth: "把价值转化成可观察的小行动；练习用具体请求替代等待别人自行理解。" },
  ENFJ: { name: "共鸣组织者", tagline: "让一群人因为共同意义而靠近", summary: "你对群体气氛和个体需要都很敏锐，擅长把共同目标说得清楚而有温度。你往往愿意主动协调，让每个人看见自己的位置。", strengths: ["凝聚关系并激发他人投入", "清晰表达共同愿景", "能兼顾组织推进与人际氛围"], blindSpots: ["可能过度依赖外界反馈", "为了和谐而接下过多责任", "替别人决定什么对他最好"], environment: "合作紧密、反馈及时且目标对人有意义的环境，会让你的领导力自然出现。", relationship: "你热情投入、重视回应，也期待彼此明确表达需要并共同维护关系。", growth: "帮助前先确认对方是否需要；把自己的休息和偏好写进计划，而不是留到最后。" },
  ENFP: { name: "灵感联结者", tagline: "把好奇、热情与人连接起来", summary: "你容易被新可能和鲜活的人吸引，常能用热情让一件事获得起点。你看重真实感，希望选择既有自由也有意义。", strengths: ["快速发现人与想法的潜力", "富有感染力并善于建立连接", "在变化中保持创造与乐观"], blindSpots: ["兴趣很多，精力容易分散", "重复流程会迅速消耗动力", "可能高估当下热情的持久度"], environment: "有人际连接、探索空间和可见影响的环境，最能保持你的投入。", relationship: "你珍惜坦诚、活力与共同体验，需要被回应，也需要保留探索个人兴趣的自由。", growth: "用少量固定习惯保护最重要的创意；做承诺前给兴奋感一个短暂冷静期。" },
  ISTJ: { name: "稳健执行者", tagline: "让承诺经得起时间和细节", summary: "你重视事实、责任和可预测的质量，擅长把要求转化为可靠步骤。你的稳定并不张扬，却常是团队能够放心前进的基础。", strengths: ["细致可靠，重视承诺", "善于建立清楚流程与标准", "能长期维持稳定产出"], blindSpots: ["变化缺乏依据时容易抗拒", "可能把责任全留给自己", "不易及时表达认可与情绪"], environment: "职责明确、标准可信且努力能形成长期积累的环境，会让你发挥最好。", relationship: "你用守时、兑现承诺和处理具体事务表达关心，重视忠诚与相互尊重。", growth: "在变化中先寻找可试行的小范围；别让别人只能从行动猜测你的感受。" },
  ISFJ: { name: "温和守护者", tagline: "把在意放进每一个具体细节", summary: "你敏锐留意他人的实际需要，并愿意用稳定行动维护关系和秩序。你通常记得细节，也希望熟悉的人和事得到妥善照顾。", strengths: ["体贴细致，能捕捉实际需要", "耐心可靠，善于维持日常", "重视合作并保护群体稳定"], blindSpots: ["不愿麻烦别人而过度承担", "面对突然变化容易焦虑", "付出未被看见时不易开口"], environment: "关系互信、节奏稳定且贡献被具体认可的环境，会让你安心成长。", relationship: "你通过照顾日常、记住偏好和持续陪伴表达亲近，也需要自己的付出被看见。", growth: "把边界说在疲惫之前；允许别人用不同于你的方式表达可靠与关心。" },
  ESTJ: { name: "秩序推进者", tagline: "让标准清楚，让事情落地", summary: "你关注现实结果、职责和执行节奏，善于快速组织资源并维护可运行的秩序。遇到混乱时，你倾向站出来明确下一步。", strengths: ["组织高效，责任边界清晰", "果断务实，善于推动落地", "能够维护稳定标准"], blindSpots: ["可能过快否定未经验证的新思路", "直接表达容易带来压迫感", "把休息视为效率不足"], environment: "规则清楚、结果可衡量且拥有相应决定权的环境，能释放你的执行力。", relationship: "你重视诚实、可靠与共同承担，往往用解决现实问题和规划未来表达承诺。", growth: "在纠正前先说明共同目标；为探索留出小块安全空间，不要求每个想法立即证明价值。" },
  ESFJ: { name: "关系营造者", tagline: "让每个人都感到被欢迎、被记得", summary: "你关注人与人之间的回应和实际需要，善于创造有温度的秩序。你往往主动维护联系，让合作更顺畅、生活更有仪式感。", strengths: ["热心周到，善于促进合作", "能把关心落实到具体行动", "组织活动并维护群体节奏"], blindSpots: ["可能把不同意见理解为不认可", "过度照顾而忽略个人需求", "对含糊关系和冷淡反馈敏感"], environment: "互动频繁、贡献可见且强调互相支持的环境，能让你持续获得能量。", relationship: "你乐于分享生活、提供支持并确认彼此状态，也期待清晰回应和稳定投入。", growth: "区分“别人有不同选择”和“别人否定我”；把自己的需要说得同样具体。" },
  ISTP: { name: "冷静解题者", tagline: "在真实世界里找到最简答案", summary: "你习惯观察系统如何运作，并在问题出现时迅速抓住关键变量。你重视自由、实用和直接经验，常在行动中校准判断。", strengths: ["临场冷静，迅速定位问题", "动手能力强，重视有效方案", "独立灵活，不被形式束缚"], blindSpots: ["长期规划容易被眼前问题打断", "表达情绪和承诺可能偏少", "厌烦解释已在脑中清楚的步骤"], environment: "问题具体、行动自主且反馈直接的环境，最能发挥你的判断与技巧。", relationship: "你尊重空间，常用实际帮助和共同体验表达在意，不喜欢被频繁追问感受。", growth: "在需要长期协作时主动同步思路；把沉默无法传达的关心说出一小部分。" },
  ISFP: { name: "感知创作者", tagline: "用细腻感受回应此刻真实", summary: "你对美感、氛围和个体感受十分敏锐，倾向以真实而低调的方式行动。你重视选择自由，也常用作品或具体照顾表达内心价值。", strengths: ["审美细腻，对当下变化敏感", "包容真诚，尊重个体差异", "能把感受转化为具体体验"], blindSpots: ["不喜欢冲突而延迟重要沟通", "长期结构不足时容易被动", "外界强硬要求会让你迅速退缩"], environment: "氛围友善、允许亲手创造且不过度控制的环境，能让你自然投入。", relationship: "你在意真实陪伴与细微回应，偏爱用行动、体验和温柔空间表达亲近。", growth: "把不舒服转化为及时而具体的边界；用轻量计划保护真正重要的创作与关系。" },
  ESTP: { name: "现场行动者", tagline: "读懂现场，然后让机会发生", summary: "你对环境变化和现实机会反应迅速，倾向先接触、尝试，再根据反馈调整。你的直接与活力常能让停滞的局面重新流动。", strengths: ["行动果断，临场适应力强", "善于读取现场与现实资源", "沟通直接，能带动节奏"], blindSpots: ["可能低估长期后果与重复维护", "追求刺激时承担过多风险", "耐心倾听抽象或缓慢过程较难"], environment: "反馈及时、目标具体且需要快速应对的环境，会让你保持专注。", relationship: "你喜欢坦率、轻松和共同经历，常以陪伴行动和解决眼前问题表达关心。", growth: "重要决定加入一次延迟确认；把未来成本也当成现场信息的一部分。" },
  ESFP: { name: "氛围点亮者", tagline: "让真实的快乐在当下被看见", summary: "你敏锐感知现场情绪，乐于通过互动、体验和自然表达让人靠近。你重视生活的质感，也常能鼓励别人放松并参与其中。", strengths: ["亲和有感染力，善于营造氛围", "对人和环境的需要反应及时", "务实灵活，能享受并创造体验"], blindSpots: ["可能回避沉重但必要的长期问题", "容易受即时评价影响", "规划与财务等延迟回报事项易拖延"], environment: "人际友好、变化丰富且成果能被直接感受的环境，最能激发你的能量。", relationship: "你重视陪伴、回应与共同体验，常用热情、礼物或实际行动表达喜欢。", growth: "为未来的自己预留固定资源；允许不愉快的对话成为关系更真实的一部分。" },
};

const scale = [
  { value: 1, label: "非常不符合" },
  { value: 2, label: "比较不符合" },
  { value: 3, label: "不确定" },
  { value: 4, label: "比较符合" },
  { value: 5, label: "非常符合" },
];

const dimensionNarratives: Record<DimensionKey, Record<string, string>> = {
  EI: {
    E: "你更容易通过外部互动激活思路。交流并不一定意味着喧闹，而是外界反馈常能帮助你形成方向。",
    I: "你更容易在内部空间里整理能量。独处并不等于疏离，而是安静思考能让你的表达更完整。",
  },
  SN: {
    S: "你倾向先信任可观察的事实与直接经验，擅长看见细节、条件以及下一步真正能做什么。",
    N: "你倾向先捕捉模式、含义与未来可能，擅长越过眼前细节发现不同信息之间的联系。",
  },
  TF: {
    T: "你倾向用一致的原则与因果关系校准选择，希望结论经得起推理，也能对不同人保持标准一致。",
    F: "你倾向把价值、关系和具体处境纳入选择，希望结果不仅合理，也能照顾人真正重视的东西。",
  },
  JP: {
    J: "你更喜欢通过计划与决定获得掌控感。结构让你能够放心投入，也便于提前处理可能的风险。",
    P: "你更喜欢通过开放与调整保持适应力。保留选择让你能够跟随新信息，并在变化中发现机会。",
  },
};

function Logo() {
  return (
    <div className="brand" aria-label="人格光谱">
      <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
      <span>人格光谱</span>
    </div>
  );
}

export default function Home() {
  const [phase, setPhase] = useState<"intro" | "test" | "result">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [hasSaved, setHasSaved] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("spectrum-test-progress");
      if (!raw) return;
      const saved = JSON.parse(raw) as { answers: Record<number, number>; currentIndex: number };
      if (saved.answers && Object.keys(saved.answers).length > 0) {
        setAnswers(saved.answers);
        setCurrentIndex(Math.min(saved.currentIndex ?? 0, questions.length - 1));
        setHasSaved(true);
      }
    } catch {
      localStorage.removeItem("spectrum-test-progress");
    }
  }, []);

  useEffect(() => {
    if (phase !== "test" || Object.keys(answers).length === 0) return;
    localStorage.setItem("spectrum-test-progress", JSON.stringify({ answers, currentIndex }));
  }, [answers, currentIndex, phase]);

  const result = useMemo(() => {
    const scores: Record<DimensionKey, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
    for (const question of questions) {
      const answer = answers[question.id];
      if (!answer) continue;
      const centered = answer - 3;
      scores[question.dimension] += question.reverse ? -centered : centered;
    }

    const detail = (Object.keys(dimensions) as DimensionKey[]).map((key) => {
      const meta = dimensions[key];
      const itemCount = questions.filter((question) => question.dimension === key).length;
      const maximum = itemCount * 2;
      const leftPercent = Math.round(((scores[key] + maximum) / (maximum * 2)) * 100);
      const rightPercent = 100 - leftPercent;
      const preferredLetter = scores[key] >= 0 ? meta.left : meta.right;
      const preferredName = scores[key] >= 0 ? meta.leftName : meta.rightName;
      const distance = Math.abs(leftPercent - 50);
      const clarity = distance <= 4 ? "边界平衡" : distance <= 12 ? "轻度偏好" : distance <= 24 ? "明显偏好" : "鲜明偏好";
      return { key, ...meta, leftPercent, rightPercent, preferredLetter, preferredName, clarity };
    });

    const type = detail.map((item) => item.preferredLetter).join("");
    return { type, scores, detail, profile: profiles[type] ?? profiles.INFP };
  }, [answers]);

  const startFresh = () => {
    setAnswers({});
    setCurrentIndex(0);
    setHasSaved(false);
    setPhase("test");
    localStorage.removeItem("spectrum-test-progress");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resume = () => {
    setPhase("test");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chooseAnswer = (value: number) => {
    if (isAdvancing) return;
    const question = questions[currentIndex];
    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);
    setIsAdvancing(true);

    window.setTimeout(() => {
      if (currentIndex === questions.length - 1) {
        localStorage.removeItem("spectrum-test-progress");
        setHasSaved(false);
        setPhase("result");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setCurrentIndex((index) => index + 1);
      }
      setIsAdvancing(false);
    }, 220);
  };

  const goBack = () => {
    if (currentIndex === 0) {
      setPhase("intro");
      return;
    }
    setCurrentIndex((index) => index - 1);
  };

  const shareResult = async () => {
    const text = `我的人格光谱是 ${result.type} · ${result.profile.name}：${result.profile.tagline}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "我的人格光谱", text, url: window.location.href });
        setShareStatus("已打开分享");
      } else {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        setShareStatus("结果已复制");
      }
    } catch {
      setShareStatus("");
    }
  };

  if (phase === "test") {
    const question = questions[currentIndex];
    const answeredCount = Object.keys(answers).length;
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
      <main className="test-shell">
        <header className="test-header">
          <button className="brand-button" onClick={() => setPhase("intro")} aria-label="返回介绍页"><Logo /></button>
          <span className="save-hint"><i />进度仅保存在本机</span>
        </header>

        <section className="test-stage" aria-labelledby="question-title">
          <div className="progress-meta">
            <span>第 {currentIndex + 1} 题</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="测评进度"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div style={{ width: `${progress}%` }} />
          </div>

          <div className={`question-card ${isAdvancing ? "is-leaving" : ""}`}>
            <div className="question-kicker">凭第一反应作答</div>
            <h1 id="question-title">{question.text}</h1>
            <p className="question-note">想象大多数日常情境，而不是某一次特殊经历。</p>

            <div className="answer-list" role="radiogroup" aria-label="请选择符合程度">
              {scale.map((option, index) => {
                const selected = answers[question.id] === option.value;
                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`answer-option ${selected ? "selected" : ""}`}
                    key={option.value}
                    onClick={() => chooseAnswer(option.value)}
                    disabled={isAdvancing}
                  >
                    <span className={`answer-dot dot-${index + 1}`} aria-hidden="true" />
                    <span>{option.label}</span>
                    <span className="answer-check" aria-hidden="true">✓</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="test-actions">
            <button className="text-button" type="button" onClick={goBack}>← 上一题</button>
            <span>已回答 {answeredCount} / {questions.length}</span>
          </div>
        </section>
      </main>
    );
  }

  if (phase === "result") {
    return (
      <main className="result-shell">
        <header className="site-header compact">
          <Logo />
          <button className="outline-button small" onClick={shareResult}>分享结果</button>
        </header>

        <section className="result-hero">
          <div className="result-label">你的四维人格光谱</div>
          <div className="type-code" aria-label={`人格类型 ${result.type}`}>
            {result.type.split("").map((letter, index) => <span key={`${letter}-${index}`}>{letter}</span>)}
          </div>
          <h1>{result.profile.name}</h1>
          <p className="result-tagline">“{result.profile.tagline}”</p>
          <p className="result-summary">{result.profile.summary}</p>
          <div className="result-actions">
            <button className="primary-button" onClick={shareResult}>分享我的光谱</button>
            <button className="outline-button" onClick={startFresh}>重新测一次</button>
          </div>
          {shareStatus && <div className="share-status" role="status">{shareStatus}</div>}
        </section>

        <section className="result-section spectrum-section" aria-labelledby="spectrum-title">
          <div className="section-heading">
            <div><span className="eyebrow">YOUR SPECTRUM</span><h2 id="spectrum-title">四个维度，不是四个标签</h2></div>
            <p>比例代表本次回答呈现的偏好强度。靠近 50% 意味着你会更灵活地使用两端方式。</p>
          </div>

          <div className="dimension-list">
            {result.detail.map((item) => (
              <article className="dimension-card" key={item.key}>
                <div className="dimension-topline">
                  <div><span className="dimension-question">{item.question}</span><strong>{item.preferredLetter} · {item.preferredName}</strong></div>
                  <span className="clarity-pill">{item.clarity}</span>
                </div>
                <div className="dimension-labels">
                  <span><b>{item.left}</b> {item.leftName} {item.leftPercent}%</span>
                  <span>{item.rightPercent}% {item.rightName} <b>{item.right}</b></span>
                </div>
                <div className="dimension-track" aria-label={`${item.leftName} ${item.leftPercent}%，${item.rightName} ${item.rightPercent}%`}>
                  <div className="dimension-left" style={{ width: `${item.leftPercent}%` }} />
                  <span className="midpoint" />
                </div>
                <p>{dimensionNarratives[item.key][item.preferredLetter]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="result-section profile-grid" aria-label="人格详细解析">
          <article className="insight-card strengths-card">
            <span className="card-number">01</span><h2>自然优势</h2>
            <ul>{result.profile.strengths.map((item) => <li key={item}><span>+</span>{item}</li>)}</ul>
          </article>
          <article className="insight-card blind-card">
            <span className="card-number">02</span><h2>可能的盲点</h2>
            <ul>{result.profile.blindSpots.map((item) => <li key={item}><span>↗</span>{item}</li>)}</ul>
          </article>
          <article className="insight-card wide">
            <span className="card-number">03</span><h2>容易发光的环境</h2><p>{result.profile.environment}</p>
          </article>
          <article className="insight-card">
            <span className="card-number">04</span><h2>关系中的你</h2><p>{result.profile.relationship}</p>
          </article>
          <article className="insight-card accent-card">
            <span className="card-number">05</span><h2>成长提示</h2><p>{result.profile.growth}</p>
          </article>
        </section>

        <section className="result-section closing-card">
          <span className="eyebrow">ONE MORE THOUGHT</span>
          <h2>类型是一张地图，不是一堵墙</h2>
          <p>人格偏好会随角色、环境与人生阶段呈现不同侧面。把结果当作观察自己的语言，而不是限制选择的结论。</p>
          <button className="primary-button dark" onClick={startFresh}>再次探索</button>
        </section>

        <footer className="site-footer">
          <Logo />
          <p>独立原创的四维人格倾向体验，不是 MBTI® 官方测评，也不能替代专业心理评估。</p>
        </footer>
      </main>
    );
  }

  return (
    <main className="intro-shell">
      <header className="site-header">
        <Logo />
        <div className="header-note">免费体验 · 无需登录</div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="hero-badge"><span />独立原创题目 · 四维人格倾向</div>
          <h1>看见你的<br /><em>人格光谱</em></h1>
          <p className="hero-lead">48 个日常选择，勾勒你获取能量、感知世界、作出判断与安排生活的自然偏好。</p>
          <div className="hero-actions">
            <button className="primary-button large" onClick={startFresh}>开始探索 <span>→</span></button>
            {hasSaved && <button className="resume-button" onClick={resume}>继续上次进度</button>}
          </div>
          <div className="hero-facts">
            <span><b>48</b> 道原创题</span><i /><span><b>约 8</b> 分钟</span><i /><span><b>4</b> 维量化</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="四维人格光谱示意">
          <div className="orbit orbit-one"><span>E</span><span>I</span></div>
          <div className="orbit orbit-two"><span>S</span><span>N</span></div>
          <div className="orbit orbit-three"><span>T</span><span>F</span></div>
          <div className="visual-core"><small>YOUR</small><b>TYPE</b><small>SPECTRUM</small></div>
          <div className="visual-caption"><span>四维不是对错</span><strong>而是你更自然的方向</strong></div>
        </div>
      </section>

      <section className="intro-section preview-section">
        <div className="section-heading light">
          <div><span className="eyebrow">MORE THAN 4 LETTERS</span><h2>不只给你四个字母</h2></div>
          <p>结果会呈现每个维度的具体比例，并解释它如何出现在思考、关系和生活中。</p>
        </div>
        <div className="preview-card">
          <div className="preview-type"><span>示例光谱</span><strong>INFP</strong><p>价值守望者</p></div>
          <div className="preview-bars">
            {[
              ["E", "I", 68], ["S", "N", 72], ["T", "F", 64], ["J", "P", 58],
            ].map(([left, right, percent]) => (
              <div className="mini-dimension" key={`${left}${right}`}>
                <div><span>{left}</span><b>{right}</b></div>
                <div className="mini-track"><span style={{ width: `${100 - Number(percent)}%` }} /></div>
                <em>{percent}% {right}</em>
              </div>
            ))}
          </div>
          <div className="preview-quote">“忠于内心，也为世界保留温柔。”</div>
        </div>
      </section>

      <section className="intro-section how-section">
        <div className="section-heading light">
          <div><span className="eyebrow">HOW IT WORKS</span><h2>跟随第一反应</h2></div>
          <p>没有好答案，也没有坏答案。想象日常状态，而不是你希望成为的样子。</p>
        </div>
        <div className="step-grid">
          <article><span>01</span><h3>一次一题</h3><p>减少前后比较，让回答更接近自然倾向。</p></article>
          <article><span>02</span><h3>五级选择</h3><p>从“非常不符合”到“非常符合”，保留细微差异。</p></article>
          <article><span>03</span><h3>完整报告</h3><p>获得比例、优势、盲点、关系与成长建议。</p></article>
        </div>
      </section>

      <section className="intro-section start-card">
        <div><span className="eyebrow">READY WHEN YOU ARE</span><h2>给自己八分钟，认真看见自己。</h2></div>
        <button className="primary-button light-button" onClick={startFresh}>开始人格探索 <span>→</span></button>
      </section>

      <footer className="site-footer intro-footer">
        <Logo />
        <p>本测评为独立原创的性格倾向体验，不是 MBTI® 官方题库，不用于医疗、招聘或重大人生决策。</p>
      </footer>
    </main>
  );
}
