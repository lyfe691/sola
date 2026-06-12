/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */
import type { Translation } from "./en";

export const zh = {
  seo: {
    home: {
      title: "Yanis Sebastian Zürcher • 苏黎世软件开发者",
      description:
        "专注于可扩展、快速且精心设计的系统，涉及基础设施、身份与访问以及界面设计。",
    },
    about: {
      title: "关于我 • Yanis Sebastian Zürcher",
      description:
        "了解我的背景、价值观，以及用于构建快速、干净、极简软件的工具。",
    },
    projects: {
      title: "项目 • Yanis Sebastian Zürcher",
      description: "精选项目合集：全栈、前端、后端与工具。",
    },
    skills: {
      title: "技能 • Yanis Sebastian Zürcher",
      description: "技术与工具：React、TypeScript、Spring Boot、Docker 等。",
    },
    experience: {
      title: "经历 • Yanis Sebastian Zürcher",
      description: "教育与岗位时间线，包含职责、成就与使用技术。",
    },
    contact: {
      title: "联系 • Yanis Sebastian Zürcher",
      description: "关于项目、合作或机会，欢迎联系。",
    },
    services: {
      title: "服务 • Yanis Sebastian Zürcher",
      description: "按需提供全栈、前端、后端开发与技术咨询。",
    },
    privacy: {
      title: "隐私政策 • sola.ysz.life",
      description: "关于托管、分析、数据处理方与您的权利的隐私信息。",
    },
    notFound: {
      title: "404 • 未找到",
      description: "未找到请求的资源。",
    },
  },
  certifications: {
    title: "证书",
    empty: "尚未发布任何证书。",
    verify: "验证",
    expired: "已过期",
    credentialId: "证书编号",
    expires: "到期",
    viewPdf: "查看 PDF",
  },
  common: {
    home: "首页",
    overview: "概览",
    menu: {
      themes: "主题",
      customThemes: "自定义主题",
      background: "背景",
    },
    backgroundHints: {
      section: "部分背景在深色模式下效果更佳。",
    },
    callout: {
      background: {
        title: "打造你的风格",
        content: "打开此菜单，挑选一个适合你的背景——有很多可以尝试。",
      },
      done: "知道了",
    },
    none: "无",
    search: "搜索",
    command: {
      placeholder: "输入命令或搜索...",
      noResults: "没有结果",
      groups: {
        navigation: "导航",
        theme: "主题",
        language: "语言",
        background: "背景",
      },
      footer: {
        navigate: "导航",
        select: "选择",
        close: "关闭",
      },
    },
    techStack: "技术栈",
    links: "链接",
    chromeStore: "Chrome 商店",
    visitSite: "访问网站",
    sourceCode: "源代码",
    demo: "演示",
    moreProjects: "更多项目",
    moreOnGithub: "在 GitHub 上查看更多",
    view: "查看",
    update: {
      title: "网站更新了",
      description: "刷新一下页面就能看到最新内容。",
      later: "稍后",
      refresh: "刷新",
      dismiss: "关闭",
    },
  },
  feed: {
    recentActivity: "最新活动",
    lastEvents: "最近 20 条",
    noActivity: "暂无活动",
    checkBack: "请稍后再查看",
    moreSuffix: "条",
  },
  hire: {
    hirebtn: "雇佣我",
  },
  nav: {
    about: "关于我",
    experience: "经验",
    projects: "项目",
    skills: "技能",
    contact: "联系",
    services: "服务",
  },
  i18n: {
    detectedNote: "检测到: {lang}",
  },
  index: {
    greeting: "你好，我是 ",
    description1: "来自瑞士苏黎世的18岁软件开发者。",
    description2: "构建可扩展、高速、结构清晰的系统。",
    description3: "涉及基础设施、身份管理和界面设计。",
    description4: "注重结构、清晰性和精确性。",
    currentlyWorkingOn: "目前正在进行",
    contactMe: "联系我",
    viewProjects: "查看项目",
  },
  experience: {
    title: "经验",
    subtitle: "塑造我技术专长的职业历程和教育经历。",
    sections: {
      work: "工作",
      education: "教育",
    },
    chips: {
      onsite: "现场",
      remote: "远程",
      hybrid: "混合",
      internship: "实习",
      full_time: "全职",
      part_time: "兼职",
      contract: "合同",
      freelance: "自由职业",
    },
    period: {
      nadlo: "2026年5月 - 至今",
      gz: "2025年8月 - 2026年3月",
      freelance: "2025年7月 - 至今",
      wiss: "2023年8月 - 至今",
      sek: "2020年 - 2023年",
    },
    nadlo: {
      role: "全栈软件开发工程师",
      company: "nadlo",
      location: "巴登, 瑞士",
      description:
        "在整个技术栈上构建生产级 Web 应用，从响应式、可访问的界面到支撑它们的 API 与数据模型，注重类型安全、性能与快速交付。",
      achievements: [
        "使用 Next.js、React、TypeScript 开发全栈功能，并以 Tailwind CSS 进行样式设计。",
        "使用 NestJS 构建后端服务与 REST API，依托 Supabase（Postgres、认证与存储）。",
        "使用 Docker 将服务容器化，并通过 GitHub Actions 自动化构建、测试与部署流程。",
        "负责从概念到部署的完整功能，注重可维护、强类型与高性能的代码。",
      ],
    },
    freelance: {
      role: "自由职业 Web 开发者",
      company: "自由职业",
      location: "苏黎世, 瑞士",
      description:
        "为客户交付现代化 Web 方案，从落地页到全栈功能，注重清晰体验、性能与可维护性。",
      achievements: [
        "使用 React、Next.js、TypeScript、Tailwind CSS 构建与交付项目。",
        "以 Spring Boot 与 Java 实现后端功能；使用 Git 进行版本管理与自动化。",
      ],
    },
    gz: {
      role: "IAM 开发工程师",
      company: "Gesundheitswelt Zollikerberg",
      location: "瑞士，佐利孔",
      description:
        "作为IAM工程实习生，我协助维护和优化公司的IT基础设施，重点在于自动化身份与访问管理流程。该公司为佐利孔居民提供医疗服务。",
      achievements: [
        "使用PowerShell和Python协助自动化IAM工作流程。",
        "参与公司内部IT基础设施优化的实施。",
        "协助维护Active Directory并处理用户管理任务。",
      ],
    },
    wiss: {
      role: "学生 - 计算机科学",
      company: "WISS",
      location: "瑞士，苏黎世",
      description:
        "我目前在WISS计算机科学学校就读，接受全面的计算机科学教育。我的学习涵盖广泛的领域，包括编程、系统分析、数据库管理、软件开发和项目管理。这些经验为我在计算机科学领域打下了坚实的基础，为我未来在软件工程领域的发展做好准备。",
      achievements: [
        "使用现代技术开发全栈Web应用",
        "使用敏捷方法论参与团队项目协作",
      ],
    },
    sek: {
      role: "Sek A",
      company: "Lachenzelg",
      location: "瑞士，苏黎世",
      description:
        "获得了技术发展道路上的基础知识。作为最终项目，我创建了一个虚幻引擎环境。",
      achievements: [
        "使用虚幻引擎创建沉浸式3D环境",
        "培养了强大的问题解决和分析能力",
        "参与MINT相关项目和活动",
      ],
    },
  },
  projects: {
    title: "项目",
    other: "其他项目",
    otherInfo: "非精选项目：小型工具与实验项目。",
    viewDetails: "查看详情",
    viewAll: "查看所有项目",
    viewGithub: "查看代码",
    satoriAttribution:
      "图像由 [Vercel Satori](https://og-playground.vercel.app/) 生成",
    sortBy: "排序",
    sortOptions: {
      priority: "优先级",
      dateNewest: "日期（最新）",
      dateOldest: "日期（最旧）",
      nameAsc: "名称（A–Z）",
      nameDesc: "名称（Z–A）",
    },
    selectSorting: "选择排序...",
    visitProject: "访问项目",
    list: {
      codeExtractor: {
        title: "网站代码提取器",
        description:
          "一款简单的 Chrome 扩展，可从网站提取 HTML、CSS、JavaScript 和图片，并用 JSZip 打包为 ZIP。适用于小型网站，便于快速获取网页代码；对严重依赖服务端代码的大型网站存在一定限制。",
      },
      applicare: {
        title: "AppliCare",
        description:
          "AppliCare是一个现代求职申请管理平台，后端使用Spring Boot，数据存储使用MongoDB Atlas，前端使用React（Vite）和Ant Design。它提供了一个直观且高效的方式来组织和监控求职申请，具有时尚的响应式界面。",
      },
      osint: {
        title: "OSINT网站",
        description:
          "这个OSINT网站是一个源于我对开源情报和不断发展的数字调查世界兴趣的项目。它提供互动练习，旨在提升调查技能并鼓励批判性思维。",
      },
      chatapp: {
        title: "聊天应用",
        description:
          "ChatApp是一个用户友好的聊天平台，用户可以创建账户并在各种聊天室中与他人联系。使用Spring Boot构建，由MongoDB提供高效的数据存储，为实时通信提供无缝体验。",
      },
      vmDetector: {
        title: "虚拟机检测器",
        description: "这是一个检测机器是否为虚拟机的工具。",
      },
      viewCounter: {
        title: "访问计数器",
        description:
          "这是一个简单的访问计数器应用程序，用于统计页面被查看的次数。使用Spring Boot和Redis构建。",
      },
      dockerService: {
        title: "Docker服务部署",
        description:
          "这个Docker Compose项目部署了MediaWiki、Nextcloud和Gogs，注重团队协作、容器化和文档编写。与Benicio Von Felten共同开发。",
      },
      phishing: {
        title: "钓鱼网站教程",
        description:
          "这是一个关于如何创建钓鱼网站的教程。使用HTML、CSS和JavaScript构建。",
      },
      otw: {
        title: "OverTheWire指南",
        description: "这是一个关于如何解决OverTheWire战争游戏的指南。",
      },
      sola: {
        title: "Sola",
        description:
          "Sola 是我的个人网站。基于 React、TypeScript 与 Tailwind CSS 构建，用以以干净、现代的方式展示我的项目、技能与经验。",
      },
      kinoa: {
        title: "Kinoa",
        description:
          "Kinoa 是基于 Next.js、shadcn/ui 和 Supabase 构建的免费流媒体网站。无需订阅 — 浏览电影和剧集，通过第三方提供商内嵌播放，服务器自动切换，简洁好用。",
      },
      self: {
        title: "Self",
        description:
          "Self 是一个可自定义的 Windows 系统信息显示工具，受 Neofetch 启发，并使用 Python 构建。它可在终端中显示系统信息，并配合图像或 ASCII 艺术显示。支持方块或盲文渲染模式、可定制主题，以及简洁的 PowerShell 安装程序，为 Windows 带来清爽的类 Unix 风格美学。",
      },
      taco: {
        title: "Taco",
        description:
          "围绕我弟弟的狗狗 Taco 打造的生产级模板网站——基于 Next.js、TypeScript、Tailwind CSS。内置带自动检测的本地化、博客系统，以及适用于真实项目的干净模块化架构。",
      },
      thoughts: {
        title: "Thoughts",
        description:
          "一个极简的个人网站，用来分享我的思考、片段与笔记。受 [Shu Ding](https://shud.in) 个人网站启发，使用 Next.js、MDX 和 Tailwind 构建。包含自定义留言簿功能，访客可以留下自己的想法。",
      },
      luma: {
        title: "Luma",
        description:
          "自带 API 密钥，与 Claude、GPT、Gemini、Grok 等顶级 AI 模型在同一平台对话的多模型 AI 平台。基于 Next.js 16、Vercel AI SDK 和 Supabase 构建。",
      },
    },
  },
  skills: {
    title: "技能",
    subtitle: "我日常使用的技术和工具。",
    backHome: "返回首页",
    groups: {
      languages: "编程语言",
      frontend: "前端",
      backend: "后端",
      infrastructure: "基础设施",
      security: "安全",
      tools: "工具",
    },
  },
  notFound: {
    backHome: "返回首页",
  },
  footer: {
    atw: "关于这个网站",
    madeWith: "由",
    by: "制作",
    rights: "保留所有权利。",
    navigation: "导航",
    connect: "连接",
    contact: "联系",
    contactForm: "通过表单",
    privacy: "隐私政策",
    legal: "法律的",
  },
  about: {
    title: "关于我",
    intro:
      "我是Yanis Sebastian Zürcher，一名来自瑞士苏黎世的18岁软件开发者。我在[WISS](https://www.wiss.ch)学习计算机科学，但我大部分的知识都是通过自己做项目学来的，而不是在学校里。",
    hobbies:
      "我专注于构建快速、简洁和极简风格的网页应用。无论是全栈平台还是精致的前端界面，我都注重清晰度、性能和良好的用户体验。我不断推动自己的创意前进，打造既美观又实用的数字产品。",
    philosophy: {
      title: "我的方法",
      clean:
        "我相信干净、可维护的代码是可持续软件开发的基础。我所写的每一行代码都体现了我对卓越的承诺。",
      simplicity:
        "复杂问题需要优雅的解决方案。我努力在功能性、性能和用户体验之间找到完美平衡。",
      learning:
        "技术领域快速发展，我也与之共同进化。持续学习和适应是我职业身份的重要组成部分。",
    },
    interests: {
      title: "热情与活动",
      nature: {
        title: "自然探索者",
        description:
          "我在大自然中寻找平静与灵感。无论是在瑞士阿尔卑斯山徒步，还是发现隐藏的小径，每次旅程都带来新的视角和想法。",
      },
      tech: {
        title: "技术爱好者",
        description:
          "在工作之外，我热衷于探索新技术并为开源项目做贡献。不断发展的技术领域让我保持好奇和投入。",
      },
      learning: {
        title: "技术文献",
        description:
          "我坚信终身学习的理念。从技术书籍到在线课程，我始终在寻求扩展知识和技能的机会。",
      },
      workspace: {
        title: "创意空间",
        description:
          "我的工作空间是想法成真的地方。通过极简的设置和合适的工具，我创造了一个促进生产力和创造力的环境。",
      },
    },
    testimonials: {
      title: "人们的声音",
      link: "与我合作",
      viewMore: "查看更多",
      visitWebsite: "访问网站",
      viewLinkedIn: "查看 LinkedIn",
      modalTitle: "推荐",
      modalDescription: "来自 {author} 的完整推荐",
    },
    certifications: {
      link: "证书",
    },
    resume: {
      title: "申请完整简历",
      description:
        "我的简历公开版本审查了一些敏感信息。如果您需要完整版本，请[联系我](https://sola.ysz.life/contact)或发送邮件至 [yanis.sebastian.zuercher@gmail.com](mailto:yanis.sebastian.zuercher@gmail.com)。",
      viewButton: "查看审查版本",
      downloadButton: "下载审查版本",
      languageLabel: "语言:",
      buttonLabel: "简历",
    },
    github: {
      title: "GitHub 活动",
      overview: "概览",
    },
    philosophyLabels: {
      clean: "干净代码",
      simplicity: "简洁",
      learning: "持续学习",
    },
  },
  contact: {
    title: "联系我",
    description: "有问题或想一起合作？随时联系我！",
    formTitle: "发送消息",
    reachOut: "或直接联系我",
    expectations: {
      title: "您可以期待",
      items: [
        "一两天内回复",
        "就您的想法进行清晰、无压力的交流",
        "关于范围、时间和契合度的坦诚意见",
        "您的信息将保密 — 只会直接回复",
      ],
    },
    nameLabel: "姓名",
    namePlaceholder: "您的姓名",
    emailLabel: "电子邮件",
    emailPlaceholder: "your.email@example.com",
    messageLabel: "消息",
    messagePlaceholder: "在这里输入您的消息...",
    send: "发送消息",
    sending: "发送中...",
    successMessage: "感谢您的消息！我会尽快回复您。",
    errorMessage: "出现错误，请重试。",
    subjectLabel: "主题",
    subjectPlaceholder: "输入主题",
    attachmentPlaceholder: "点击选择或拖拽文件",
    uploadedLabel: "已上传",
    cloudinaryLinkLabel: "Cloudinary 链接",
    dropOverlay: "拖放到此处以附加",
    fileTooLarge: "文件过大（最大 {max}）。",
    unsupportedFileType:
      "不支持的文件类型。允许：PNG、JPG、WEBP、PDF、DOC、DOCX。",
    validation: {
      nameRequired: "请输入您的姓名。",
      emailRequired: "请输入您的电子邮件。",
      emailInvalid: "请输入有效的电子邮件地址。",
      subjectRequired: "请输入主题。",
      messageRequired: "请输入消息。",
    },
  },
  services: {
    badges: {
      mostPopular: "最受欢迎",
    },
    title: "服务",
    subtitle: "根据您的需求定制的全面软件开发服务。",
    getStarted: "开始",
    services: {
      fullstack: {
        title: "全栈开发",
        description: "使用现代技术进行端到端的Web开发。",
        price: "CHF 75/小时起",
        features: [
          "响应式Web应用",
          "RESTful API开发",
          "数据库设计和实现",
          "性能优化",
        ],
      },
      frontend: {
        title: "前端开发",
        description: "创建美观、响应式和用户友好的界面。",
        price: "CHF 65/小时起",
        features: ["React开发", "UI/UX实现", "动画和交互", "移动优先设计"],
      },
      backend: {
        title: "后端开发",
        description: "强大且可扩展的服务器端解决方案。",
        price: "CHF 70/小时起",
        features: ["API设计", "数据库管理", "服务器优化", "安全实现"],
      },
      consulting: {
        title: "技术咨询",
        description: "为您的技术决策提供专业指导。",
        price: "CHF 60/小时起",
        features: ["架构规划", "技术栈选择", "性能审计", "安全评估"],
      },
    },
    contactTemplate: {
      inquiry: "咨询",
      greeting: "你好 Yanis，",
      interested: "我对您的{service}服务感兴趣。",
      discuss: "我想讨论以下内容：",
      closing: "期待您的回复！",
    },
    customRequirements: {
      title: "有特定需求？",
      description:
        "有特定项目想法？我可以帮助您实现愿景。让我们讨论您的需求，为您创建量身定制的解决方案。",
      button: "联系我",
    },
  },
} satisfies Translation;
