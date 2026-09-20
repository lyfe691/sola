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
      description:
        "专注于可扩展、快速且精心设计的系统，涉及基础设施、身份与访问以及界面设计。",
    },
    about: {
      description:
        "了解我的背景、价值观，以及用于构建快速、干净、极简软件的工具。",
    },
    projects: {
      description: "精选项目合集：全栈、前端、后端与工具。",
    },
    skills: {
      description: "技术与工具：React、TypeScript、Spring Boot、Docker 等。",
    },
    experience: {
      description: "教育与岗位时间线，包含职责、成就与使用技术。",
    },
    contact: {
      description: "关于项目、合作或机会，欢迎联系。",
    },
    services: {
      description: "按需提供全栈、前端、后端开发与技术咨询。",
    },
    privacy: {
      description: "关于托管、分析、数据处理方与您的权利的隐私信息。",
    },
    notFound: {
      description: "未找到请求的资源。",
    },
    certifications: {
      description: "证书与资质，附验证链接。",
    },
    changelog: {
      description: "sola 的 git log — 来自 GitHub 历史的提交、文件树和补丁。",
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
    present: "至今",
    back: "返回",
    overview: "概览",
    a11y: {
      openMenu: "打开菜单",
      closeMenu: "关闭菜单",
      primaryNav: "主导航",
      toggleLanguage: "切换语言",
      toggleTheme: "切换主题",
      commandPalette: "命令面板",
      commandPaletteHint: "搜索命令…",
      scrollToTop: "回到顶部",
    },
    menu: {
      themes: "主题",
      customThemes: "自定义主题",
      background: "背景",
    },
    diff: {
      showDiff: "显示 git diff",
      exit: "隐藏 git diff",
      hint: "显示最近一次更改当前页面的提交。",
      deployed: "本次部署基于的提交。",
      noChanges: "此页面暂无更改记录。",
      viewOnGitHub: "在 GitHub 上查看",
      error: "无法加载 diff。",
      retry: "重试",
      unavailable: "此文件没有可显示的文本 diff。",
      truncated: "已截断——完整 diff 请在 GitHub 查看。",
      file: "个文件",
      files: "个文件",
    },
    backgroundHints: {
      section: "部分背景在深色模式下效果更佳。",
    },
    callout: {
      background: {
        title: "打造你的风格",
        content: "我选择了{background}和{theme}主题 — 随时可在此菜单中更换。",
      },
      done: "知道了",
    },
    none: "无",
    search: "搜索",
    copied: "已复制。",
    copyCode: "复制代码",
    copyFailed: "复制失败。",
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
    sourcePrivate: "源代码未公开。",
    sourcePrivateClient: "这是为客户开发的项目，源代码未公开。",
    linkPrivate: "线上应用未公开。",
    linkPrivateClient: "该应用在客户公司内部使用，因此线上版本未公开。",
    demo: "演示",
    moreProjects: "更多项目",
    onThisPage: "本页内容",
    linkToSection: "链接到章节：{title}",
    close: "关闭",
    expandImage: "放大图片",
    expandImageNamed: "放大图片：{alt}",
    expandedImage: "已放大的图片",
    previousImage: "上一张图片",
    nextImage: "下一张图片",
    imageOf: "第 {current} 张，共 {total} 张",
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
    lastEvents: "最近 {count} 条",
    noActivity: "暂无活动",
    loadError: "无法加载最近动态",
    checkBack: "请稍后再查看",
    moreSuffix: "条",
    commit: "{count} 次提交",
    commits: "{count} 次提交",
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
    nameSwitch: "切换名字",
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
    viewDetails: "查看详情",
    viewGithub: "查看代码",
    sortBy: "排序",
    sortOptions: {
      featured: "精选",
      newest: "最新",
      oldest: "最早",
      name: "名称（A–Z）",
    },
    kind: {
      label: "项目类型",
      all: "全部",
      personal: "个人",
      commercial: "商业",
    },
    empty: "暂无内容",
    emptyDescription: "此类项目上线后将显示在这里。",
    visitProject: "访问项目",
    list: {
      codeExtractor: {
        title: "网站代码提取器",
        tagline: "把任何网站的代码打包成一个 ZIP",
        description:
          "[Website Code Extractor](https://chromewebstore.google.com/detail/website-code-extractor/foppgeakfpkdghmmmflmblcidoofpohm) 是一款 Chrome 和 Edge 扩展，可以把网站的 HTML、CSS、JavaScript 和图片连同目录结构一起下载为一个 ZIP 文件。一键完成，无需设置。它在 Chrome 应用商店有 6000 名用户，对静态网站效果最好。",
      },
      applicare: {
        title: "AppliCare",
        tagline: "所有求职申请，集中在一处",
        description:
          "[AppliCare](https://applicare.app) 帮你管理求职申请。为每一份申请记录状态，从已投递到收到录用；给它关联带截止日期的任务；在带成功率和时间线的仪表盘上查看进展。使用 React、Ant Design、Spring Boot 和 MongoDB 构建。",
      },
      osint: {
        title: "OSINT网站",
        tagline: "磨炼你的调查直觉",
        description:
          "[OSINT Exercises](https://osint.ysz.life) 是一个练习开源情报（OSINT）的网站，也就是从公开来源中查找信息。每道练习都有背景说明和一组任务，难度从简单到专家级，任何人都可以通过网站提交新的练习。",
      },
      chatapp: {
        title: "聊天应用",
        tagline: "基于Spring Boot的实时聊天室",
        description:
          "ChatApp 是一个实时聊天平台：注册账号、验证邮箱后，就可以在自己创建或加入的聊天室里交流。消息通过 WebSocket 传输，后端是 Spring Boot 和 MongoDB。这是为学校的一个模块课程而做的项目。",
      },
      vmDetector: {
        title: "虚拟机检测器",
        tagline: "判断是否运行在虚拟机中",
        description:
          "一个小型 Java 工具，用来判断自己是否运行在虚拟机里。它会检查 BIOS、CPU、网卡的 MAC 地址以及 Windows 注册表，寻找虚拟机管理程序留下的痕迹。",
      },
      viewCounter: {
        title: "访问计数器",
        tagline: "基于Redis的页面访问计数器",
        description:
          "一个页面访问计数器：每次访问首页就加一，计数保存在 Redis 里，重启后也不会丢失。这是一个小型 Spring Boot 项目，用来学习 Redis 如何融入 Java Web 应用。",
      },
      dockerService: {
        title: "Docker服务部署",
        tagline: "用Compose部署MediaWiki、Nextcloud和Gogs",
        description:
          "一套 Docker Compose 配置，让 MediaWiki、Nextcloud 和 Gogs 并行运行，数据持久化保存，并用 Portainer 进行监控。这是和 Benicio Von Felten 一起搭建并撰写文档的学校项目。",
      },
      phishing: {
        title: "钓鱼网站教程",
        tagline: "了解钓鱼网页的运作方式",
        description:
          "一步步讲解钓鱼页面是如何搭建出来的，目的是让你在遇到时能够识别它。仅供学习使用。",
      },
      otw: {
        title: "OverTheWire指南",
        tagline: "Bandit，逐关攻略",
        description:
          "[OverTheWire 的 Bandit](https://overthewire.org/wargames/bandit/) 战争游戏的逐关攻略，并简要介绍每一关用到的 Linux 命令。",
      },
      sola: {
        title: "Sola",
        tagline: "React与TypeScript打造的现代作品集",
        description:
          "Sola 是我的个人网站。基于 React、TypeScript 与 Tailwind CSS 构建，用以以干净、现代的方式展示我的项目、技能与经验。",
      },
      kinoa: {
        title: "Kinoa",
        tagline: "免费观影，纯净无扰",
        description:
          "[Kinoa](https://kinoa.to) 是一个免费的电影和剧集流媒体网站。浏览热门内容，打开一部作品，在同一页面直接播放，无需账号；登录后，片单和观看记录会在多台设备间同步。使用 Next.js、Supabase 和 TMDB 的数据构建。",
      },
      self: {
        title: "Self",
        tagline: "为Windows重塑的Neofetch",
        description:
          "Self 会在终端里把系统信息和一张图片或 ASCII 艺术并排显示，就像 Linux 上的 Neofetch，只不过面向 Windows。一条 PowerShell 命令即可安装，图片可以用彩色方块或盲文点阵渲染，主题也可以自行配置。用 Python 编写。",
      },
      taco: {
        title: "Taco",
        tagline: "一只狗的网站，做成了可复用的模板",
        description:
          "[Taco](https://takitwo.vercel.app) 是一个介绍我哥哥的狗的网站，同时也是一套我可以复用的模板：提供英语、西班牙语和日语页面并自动识别语言，还有博客、相册和联系页面。使用 Next.js、TypeScript 和 Tailwind CSS 构建。",
      },
      thoughts: {
        title: "Thoughts",
        tagline: "思绪、片段与笔记",
        description:
          "[Thoughts](https://thoughts.ysz.life) 是一个小网站，我在那里写下一些思考、片段和笔记，和这个作品集分开。文章是 MDX 文件，访客还可以在留言簿里留下自己的话。灵感来自 [Shu Ding](https://shud.in) 的个人网站。",
      },
      magi: {
        title: "magi",
        tagline: "以正确性为先的异步端口扫描器",
        description:
          "[magi](https://magi.ysz.life) 是一款用 Rust 编写的快速 TCP/UDP 端口扫描器。它用普通连接进行扫描，因此不需要 root，而且只报告真正观察到的结果：无法测试的端口会标记为 untestable，而不是 closed。在 Linux、macOS 或 Windows 上一条命令即可安装。",
      },
      luma: {
        title: "Luma",
        tagline: "自带密钥，畅聊任意模型",
        description:
          "[Luma](https://luma.ysz.life) 是一款支持各大 AI 模型的聊天应用：填入自己的 API 密钥，就能在同一段对话里切换 Claude、GPT、Gemini、Grok 等模型。编辑之前的任意一条消息，对话就会分支，两条路径都会保留。密钥在存储前会先加密。",
      },
      perspectas: {
        title: "perspectas.ch",
        tagline: "围绕一个黄点做的咨询公司网站",
        description:
          "苏黎世附近的咨询与招聘公司 [perspectas gmbh](https://www.perspectas.ch) 的网站，我用 Next.js 和 Sanity 重新搭建。所有文案和图片都放在 CMS 里，两位合伙人可以自己发布改动。设计只有一个亮点：logo 上的黄点，它同时也是标题的句号。",
      },
      ura: {
        title: "Ura",
        tagline: "离线雪地摩托导航，还分得清许可路线",
        description:
          "Ura 是面向芬兰拉普兰的雪地摩托导航，支持 iOS 和 Android。它把 2595 条路线和 3388 个地点（加油站、咖啡馆、小屋等）存在手机里，没有信号也能用。它会告诉你是否在路线上，以及这条路线可以自由骑行，还是需要先取得许可。",
      },
      montu: {
        title: "Montu",
        tagline: "由GPX绘出地图与海拔的登山日志",
        description:
          "[Montu](https://montu.ch) 是一个瑞士德语的登山日志网站，为一位自己写路线、自己拍照的客户而做。他上传一个 GPX 文件，页面就会在地形图上画出路线和海拔剖面。路线、照片和其他所有文字都在 CMS 里编辑，发布新路线不需要开发者。",
      },
      qr: {
        title: "QR",
        tagline: "定制样式的QR码，当场验证可扫",
        description:
          "[qr.ysz.life](https://qr.ysz.life) 是一个完全在浏览器里运行的 QR 码生成器。可以设置点和角的样式，加上渐变和 logo，然后导出为 PNG、SVG、JPEG 或 WebP。内置的扫码测试会把生成的二维码重新读一遍，让你在打印之前就知道它还能扫。",
      },
      vault: {
        title: "Vault",
        tagline: "Keycloak加FastAPI，realm由Terraform定义",
        description:
          "Vault 是一个用来学习 OpenID Connect 的本地沙盒。Keycloak 签发令牌，FastAPI 服务验证令牌，Next.js 前端展示按角色限制的面板。身份配置用 Terraform 声明，所以一条命令就能把整套环境拆掉再重建。",
      },
      fleetmap: {
        title: "fleetmap",
        tagline: "货车GPS实时投送到办公室大屏",
        description:
          "fleetmap 是一张配送车队的实时地图。每辆货车的手机上报位置，办公室的大屏显示每辆车的移动，以及停靠点、ETA 和延误情况。任何一天的行程都可以根据记录的轨迹回放。使用 Next.js、Supabase 和 MapLibre 构建。",
      },
    },
  },
  skills: {
    title: "技能",
    subtitle: "我日常使用的技术和工具。",
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
  colophon: {
    // deliberately Traditional in a Simplified file: it's the page's identity
    // line, and Shippori Mincho B1 (a Japanese face) has no glyph for 这
    title: "這個網站是怎麼造出來的",
    lede: "旧书的最后一页，往往写着这本书是如何做成的。这里就是那一页。",
    built:
      "这是用 [React](https://react.dev) 和 [TypeScript](https://www.typescriptlang.org) 写的，用 [Vite](https://vite.dev) 搭建，好让保存到上屏的距离看不见。颜色和留白来自 [Tailwind CSS](https://tailwindcss.com) 和 [shadcn/ui](https://ui.shadcn.com) — 只用 token，不用生的色板。动的东西，界面是 [Motion](https://motion.dev)，天是 [GSAP](https://gsap.com)。两套时钟，按钮不向背景借拍子。",
    faces:
      "字体是阅读和名字都用的 [Geist](https://vercel.com/font)，代码用的 [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)，这一页的墨是 [Shippori Mincho B1](https://fonts.google.com/specimen/Shippori+Mincho+B1)。住在 [Vercel](https://vercel.com)；源码在 [GitHub](https://github.com/lyfe691/sola)。",
    close: "于苏黎世手工排版。感谢到访。",
    back: "返回",
  },
  changelog: {
    title: "更新日志",
    subtitle: "本站的实时 git 历史。展开一条提交即可阅读说明、文件树和补丁。",
    empty: "暂无提交可显示。",
    error: "无法加载 git 历史。",
    retry: "重试",
    older: "加载更早的记录",
    viewOnGitHub: "在 GitHub 上查看",
    thisDeploy: "本次部署",
    truncated: "diff 已截断。完整提交见 GitHub。",
    unavailable: "已省略补丁（二进制或体积过大）。",
    files: "{count} 个文件",
    expand: "显示提交",
    collapse: "隐藏提交",
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
    changelog: "更新日志",
  },
  about: {
    title: "关于",
    intro:
      "我是 Yanis Sebastian Zürcher，18 岁，住在苏黎世的软件开发者。在 [WISS](https://www.wiss.ch) 学了两年计算机科学。作为同一课程的一部分，我现在在 [nadlo](https://nadlo.ch) 实习，做到 2027 年 7 月。",
    hobbies:
      "我做全栈，但喜欢的是 UI 和设计。喜欢琢磨东西该长什么样、用起来该是什么感觉——工作里我真正想花时间的就是这块。",
    philosophy: {
      title: "怎么做事",
      clean: "代码半年后还得能看懂。机灵的写法我会重写到无聊为止。",
      simplicity:
        "一个功能如果需要一整段解释，多半其实是两个。砍到剩下的部分一目了然。",
      learning: "靠做下一件还不会的东西来学。文档、仓库，以及公开把东西弄坏。",
    },
    interests: {
      title: "兴趣",
      nature: {
        title: "户外",
        description:
          "我尽量经常出门——多半是徒步，有时只是没有目的地的长走。住在瑞士这件事很容易：阿尔卑斯很近，在屏幕前坐太久之后，在山路上走几个小时仍然是我最管用的清头方式之一。",
      },
      tech: {
        title: "开源",
        description:
          "只有真的感兴趣的项目我才会参与开源，不是为了凑清单。内容多半是性能、无障碍，或者我日常已经在用的工具上的小改进。",
      },
      learning: {
        title: "学习",
        description:
          "课堂之外我会继续学，书、文档，遇到新东西时也会上课程。最近主要在看系统相关的内容，以及浏览器底层是怎么跑的——这些会直接用回我自己做的项目里。",
      },
      workspace: {
        title: "设备",
        description:
          "桌子故意保持简单：双屏、机械键盘，东西不多。比起堆外设，我更在意环境别挡路，坐下来就能干活，不用先把半间屋子重新摆一遍。",
      },
    },
    testimonials: {
      title: "一起工作过的人",
      link: "与我合作",
      viewMore: "查看更多",
      visitWebsite: "访问网站",
      website: "网站",
      roleAtCompany: "{company}·{role}",
      viewLinkedIn: "查看 LinkedIn",
      modalTitle: "推荐",
      modalDescription: "来自 {author} 的完整推荐",
      items: {
        koenitzer: {
          quote:
            "和 Yanis 一起完成每一门软件工程（IT）科目，都是一段真正难忘的经历。他的技术能力、可靠性和解决问题的能力完全在另一个层次。一位真正出色的开发者和队友。",
          role: "实习生",
        },
        bichsel: {
          quote:
            "与 Yanis 合作是一段非常棒的经历。每一门科目都是他带着我完成的，他总能为复杂的问题带来富有创意的解决方案，而且一切都按时交付。一位真正出色的开发者。",
          role: "学生",
        },
        venzin: {
          quote:
            "Yanis 难得地兼具技术实力与设计感。他为我们打造的 WISS Forum 超出了所有预期，并显著提升了我们的线上形象。",
          role: "教师",
        },
      },
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
      totalCount: "{{year}} 年共 {{count}} 次贡献",
      totalCountLastYear: "过去一年共 {{count}} 次贡献",
      legendLess: "少",
      legendMore: "多",
      dayTooltip: "{date}：{count} 次贡献",
      loadError: "暂时无法加载贡献数据。",
    },
    philosophyLabels: {
      clean: "可读代码",
      simplicity: "少，而不是多",
      learning: "做中学",
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
      subject: "定制开发需求",
      message:
        "你好 Yanis，\n\n我有一些不属于标准服务类别的特殊需求，想讨论一个定制方案。\n\n项目详情：\n- \n- \n- \n\n期待与你进一步沟通！",
    },
  },
  errorBoundary: {
    title: "出错了",
    message: "发生了意外错误。刷新页面通常可以解决。",
    reload: "刷新",
  },
} satisfies Translation;
