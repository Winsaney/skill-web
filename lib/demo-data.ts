import type { Skill } from "@/types";

export const demoSkills: Skill[] = [
  {
    id: "demo-prompt-layering",
    name: "Prompt 分层架构法",
    slug: "prompt-fen-ceng-jia-gou-fa",
    category: "提示词工程",
    summary:
      "把复杂提示词拆成角色、目标、上下文、约束和输出协议，让 AI 输出更稳定可复用。",
    icon: null,
    githubUrl: "https://github.com/",
    xhsUrl: "https://www.xiaohongshu.com/",
    createdAt: "2026-04-22T09:00:00.000Z",
    status: "Published",
    demoSections: [
      {
        title: "介绍",
        body: [
          "这个 Skill 适合把临时灵感沉淀成可维护的提示词模板。它不会把提示词写得更长，而是让每一层的职责更清楚。",
          "当任务涉及多轮输入、固定输出格式或团队协作时，分层结构可以显著降低返工。"
        ]
      },
      {
        title: "使用场景",
        body: [
          "为内容选题、脚本、复盘报告建立稳定模板。",
          "把业务专家的经验封装成可交付的 AI 工作流。",
          "让同一个提示词在不同模型之间更容易迁移。"
        ]
      },
      {
        title: "使用示例",
        body: ["下面是一个适合改写成团队模板的基础结构："],
        code:
          "角色：你是资深内容策略顾问\n目标：根据用户主题输出小红书选题方案\n上下文：账号面向 AI 学习者\n约束：避免空泛建议，每条都要包含可执行角度\n输出：用表格列出标题、钩子、正文结构"
      },
      {
        title: "我的实践",
        body: [
          "我通常先固定输出协议，再补上下文和约束。这样最容易看出模型偏题的位置，也方便快速迭代。"
        ]
      }
    ]
  },
  {
    id: "demo-workflow-audit",
    name: "AI 工作流体检表",
    slug: "ai-gong-zuo-liu-ti-jian-biao",
    category: "工作流自动化",
    summary:
      "用一张检查表判断一个流程是否值得自动化，并识别最容易被 AI 放大的薄弱环节。",
    icon: null,
    githubUrl: null,
    xhsUrl: "https://www.xiaohongshu.com/",
    createdAt: "2026-04-18T09:00:00.000Z",
    status: "Published",
    demoSections: [
      {
        title: "介绍",
        body: [
          "很多 AI 自动化失败，不是模型能力不够，而是流程本身没有被定义清楚。这个 Skill 用输入、判断、输出、校验四个维度做体检。"
        ]
      },
      {
        title: "使用场景",
        body: [
          "准备把重复运营动作交给 AI 之前。",
          "评估一个团队流程是否适合接入 Zapier、Dify 或自建 Agent。",
          "定位自动化输出不稳定的根因。"
        ]
      },
      {
        title: "使用示例",
        body: [
          "先列出流程中的每个节点，再为每个节点打标签：确定性输入、人工判断、外部依赖、质量校验。"
        ]
      },
      {
        title: "我的实践",
        body: [
          "真正适合自动化的往往不是最耗时的步骤，而是最容易标准化、最容易验证的步骤。先自动化这些地方，收益更稳。"
        ]
      }
    ]
  },
  {
    id: "demo-content-agent",
    name: "内容选题 Agent",
    slug: "nei-rong-xuan-ti-agent",
    category: "内容创作",
    summary:
      "把账号定位、读者痛点和近期热点组合成一个选题生成器，持续产出可筛选的内容池。",
    icon: null,
    githubUrl: "https://github.com/",
    xhsUrl: null,
    createdAt: "2026-04-11T09:00:00.000Z",
    status: "Published",
    demoSections: [
      {
        title: "介绍",
        body: [
          "这个 Skill 不是让 AI 替你拍脑袋，而是把选题判断标准前置，让 AI 负责生成和初筛，人负责最终判断。"
        ]
      },
      {
        title: "使用场景",
        body: [
          "每周批量规划小红书选题。",
          "把粉丝评论整理成内容机会。",
          "为同一个主题生成不同深度的内容切口。"
        ]
      },
      {
        title: "使用示例",
        body: ["输入账号定位、目标读者和近期高频问题，输出候选选题表。"],
        code:
          "主题：AI Skills\n目标读者：正在学习 AI 提效的职场人\n筛选标准：可落地、可演示、能体现方法论\n输出字段：标题、读者痛点、内容结构、演示素材"
      },
      {
        title: "我的实践",
        body: [
          "我会让 Agent 先产出 30 个粗选题，再用人工标准筛到 5 个。数量先打开，质量再收束，效果更好。"
        ]
      }
    ]
  }
];
