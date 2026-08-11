/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */
import type { Translation } from "./en";

export const ko = {
  seo: {
    home: {
      description:
        "취리히에 본사를 둔 소프트웨어 개발자로, 인프라, ID 및 인터페이스 전반에 걸쳐 확장 가능하고 빠르며 신중하게 설계된 시스템에 중점을 두고 있습니다.",
    },
    about: {
      description:
        "빠르고 깨끗하며 최소한의 소프트웨어를 구축하는 데 사용하는 배경, 가치 및 도구에 대해 자세히 알아보세요.",
    },
    projects: {
      description:
        "풀 스택, 프런트엔드, 백엔드, 도구 전반에 걸쳐 선별된 내 프로젝트 모음입니다.",
    },
    skills: {
      description:
        "React와 TypeScript부터 Spring Boot와 Docker까지 제가 사용하는 기술과 도구입니다.",
    },
    experience: {
      description:
        "책임, 성과 및 기술을 강조하는 교육 및 역할의 타임라인입니다.",
    },
    contact: {
      description: "프로젝트, 협업 또는 기회에 대해 문의하세요.",
    },
    services: {
      description:
        "귀하의 요구에 맞는 풀스택, 프런트엔드, 백엔드 개발 및 기술 컨설팅을 제공합니다.",
    },
    privacy: {
      description:
        "호스팅, 분석, 프로세서 및 귀하의 권리를 다루는 sola.ysz.life의 개인정보 보호 세부정보입니다.",
    },
    notFound: {
      description: "요청한 리소스를 찾을 수 없습니다.",
    },
    certifications: {
      description: "확인 링크가 포함된 인증 및 자격 증명입니다.",
    },
  },
  certifications: {
    title: "인증",
    empty: "아직 공개된 인증이 없습니다.",
    verify: "확인",
    expired: "만료됨",
    credentialId: "자격 증명 ID",
    expires: "만료",
    viewPdf: "PDF 보기",
  },
  common: {
    home: "홈",
    back: "뒤로",
    overview: "개요",
    menu: {
      themes: "테마",
      customThemes: "맞춤 테마",
      background: "배경",
    },
    diff: {
      showDiff: "Git diff 표시",
      exit: "Git diff 숨기기",
      hint: "현재 페이지를 변경한 마지막 커밋을 표시합니다.",
      deployed: "이 배포가 빌드된 커밋입니다.",
      noChanges: "이 페이지에 기록된 변경사항이 없습니다.",
      viewOnGitHub: "GitHub에서 보기",
      error: "차이점을 로드할 수 없습니다.",
      retry: "다시 시도하세요",
      unavailable: "이 파일에는 텍스트 차이점이 없습니다.",
      truncated: "잘림 — GitHub에서 전체 차이점을 확인하세요.",
      file: "파일",
      files: "파일",
    },
    backgroundHints: {
      section: "일부 배경은 어두운 모드에서 훨씬 더 좋아 보입니다.",
    },
    callout: {
      background: {
        title: "당신의 것으로 만드세요",
        content:
          "저는 {theme} 테마로 {background}를 선택했습니다. 이 메뉴를 열어 더 자세히 살펴보세요.",
      },
      done: "알았어요",
    },
    none: "없음",
    search: "검색",
    copied: "복사되었습니다.",
    copyCode: "코드 복사",
    copyFailed: "코드를 복사할 수 없습니다.",
    command: {
      placeholder: "명령을 입력하거나 검색하세요...",
      noResults: "검색된 결과가 없습니다.",
      groups: {
        navigation: "탐색",
        theme: "테마",
        language: "언어",
        background: "배경",
      },
      footer: {
        navigate: "탐색",
        select: "선택",
        close: "닫기",
      },
    },
    techStack: "기술 스택",
    links: "링크",
    chromeStore: "Chrome Store",
    visitSite: "사이트 방문",
    sourceCode: "소스 코드",
    demo: "Demo",
    moreProjects: "더 많은 프로젝트",
    onThisPage: "목차",
    linkToSection: "섹션 링크: {title}",
    close: "닫기",
    expandImage: "이미지 확대",
    expandImageNamed: "이미지 확대: {alt}",
    expandedImage: "확대된 이미지",
    moreOnGithub: "GitHub에서 더 보기",
    view: "보기",
    update: {
      title: "사이트가 업데이트되었습니다",
      description: "새로운 내용을 보려면 페이지를 새로 고치세요.",
      later: "나중에",
      refresh: "새로 고침",
      dismiss: "닫기",
    },
  },
  feed: {
    recentActivity: "최근 활동",
    lastEvents: "지난 20개 이벤트",
    noActivity: "최근 활동 없음",
    checkBack: "나중에 다시 업데이트를 확인하세요.",
    moreSuffix: "더",
  },
  nav: {
    about: "소개",
    experience: "경력",
    projects: "프로젝트",
    skills: "기술",
    contact: "문의",
    services: "서비스",
  },
  i18n: {
    detectedNote: "감지됨: {lang}",
  },
  index: {
    greeting: "안녕하세요, 저는 ",
    description1: "스위스 취리히에 거주하는 18세 소프트웨어 개발자입니다.",
    description2:
      "저는 확장 가능하고 빠르며 신중하게 설계된 시스템을 구축합니다.",
    description3: "인프라, ID, 인터페이스 전반에 걸쳐 작업합니다.",
    description4: "구조, 명확성, 정확성에 중점을 둡니다.",
    nameSwitch: "이름 전환",
    currentlyWorkingOn: "현재 작업 중",
    contactMe: "저에게 문의하기",
    viewProjects: "프로젝트 보기",
  },
  experience: {
    title: "경력",
    subtitle: "나의 기술 전문성을 형성한 나의 직업적 여정과 교육 경험.",
    sections: {
      work: "경력",
      education: "교육",
    },
    chips: {
      onsite: "현장",
      remote: "원격",
      hybrid: "하이브리드",
      internship: "인턴십",
      full_time: "풀타임",
      part_time: "파트타임",
      contract: "계약",
      freelance: "프리랜서",
    },
    period: {
      nadlo: "2026년 5월~현재",
      gz: "2025년 8월 ~ 2026년 3월",
      freelance: "2025년 7월~현재",
      wiss: "2023년 8월 ~ 현재",
      sek: "2020년 - 2023년",
    },
    nadlo: {
      role: "풀스택 소프트웨어 개발자",
      company: "nadlo",
      location: "Baden, Switzerland",
      description:
        "전체 스택에 걸쳐 프로덕션 웹 애플리케이션을 구축합니다. 타입 안정성, 성능 및 빠른 출시에 중점을 두고 이를 지원하는 API 및 데이터 모델과 함께 응답성이 뛰어나고 접근 가능한 인터페이스를 설계합니다.",
      achievements: [
        "Tailwind CSS로 스타일이 지정된 Next.js, React 및 TypeScript를 사용하여 엔드투엔드 풀 스택 기능을 개발했습니다.",
        "Supabase(Postgres, 인증 및 스토리지)가 지원하는 NestJS를 사용하여 백엔드 서비스와 REST API를 설계하고 구축했습니다.",
        "Docker로 서비스를 컨테이너화하고 GitHub Actions로 파이프라인 빌드, 테스트, 배포를 자동화했습니다.",
        "유지 관리가 가능하고 형식이 잘 지정되었으며 성능이 뛰어난 코드에 중점을 두고 개념부터 배포까지 기능을 책임집니다.",
      ],
    },
    freelance: {
      role: "프리랜서 웹 개발자",
      company: "자영업자",
      location: "Zürich, Switzerland",
      description:
        "깔끔한 UX, 성능, 유지 관리 가능한 코드에 중점을 두고 랜딩 페이지부터 풀 스택 기능까지 클라이언트를 위한 최신 웹 솔루션을 제공합니다.",
      achievements: [
        "React, Next.js, TypeScript, Tailwind CSS를 사용하여 프로젝트를 구축하고 출시했습니다.",
        "Spring Boot 및 Java를 사용하여 백엔드 기능을 구현했습니다. Git으로 버전화하고 자동화했습니다.",
      ],
    },
    gz: {
      role: "IAM 개발자",
      company: "Gesundheitswelt Zollikerberg",
      location: "Zollikon, Switzerland",
      description:
        "IAM 엔지니어링 인턴으로서 저는 ID 및 액세스 관리 프로세스 자동화에 중점을 두고 IT 인프라의 유지 관리 및 최적화에 기여하고 있습니다. 이 회사는 Zollikon 주민들에게 의료 서비스를 제공합니다.",
      achievements: [
        "PowerShell 및 Python을 사용하여 IAM(ID 및 액세스 관리) 워크플로 자동화를 지원합니다.",
        "내부 IT 인프라 개선 구현에 참여했습니다.",
        "Active Directory 유지 관리 및 사용자 프로비저닝 작업에 기여했습니다.",
      ],
    },
    wiss: {
      role: "학생 - 컴퓨터 공학",
      company: "WISS",
      location: "Zürich, Switzerland",
      description:
        "저는 현재 컴퓨터 과학 학교인 WISS에 재학 중이며 종합적인 컴퓨터 과학 교육을 받고 있습니다. 제가 공부하는 분야는 프로그래밍, 시스템 분석, 데이터베이스 관리, 소프트웨어 개발, 프로젝트 관리 등 광범위한 테마입니다. 이 경험은 저에게 컴퓨터 과학 분야에서 광범위하고 탄탄한 기반을 제공하고 소프트웨어 엔지니어링 분야의 미래를 준비할 수 있게 해주었습니다.",
      achievements: [
        "최신 기술을 사용하여 풀스택 웹 애플리케이션 개발",
        "애자일 방법론을 사용하여 팀 프로젝트에 협력했습니다.",
      ],
    },
    sek: {
      role: "Sek A",
      company: "Lachenzelg",
      location: "Zürich, Switzerland",
      description:
        "기술 여정을 위한 기본 지식을 수집했습니다. 최종 프로젝트로 언리얼 엔진 환경을 만들었습니다.",
      achievements: [
        "Unreal Engine을 사용하여 몰입형 3D 환경 구축",
        "강력한 문제 해결 및 분석 기술 개발",
        "MINT 중심 프로젝트 및 활동 참여",
      ],
    },
  },
  projects: {
    title: "프로젝트",
    other: "기타 프로젝트",
    otherInfo: "비특집 프로젝트: 소규모 도구, 실험 및 유틸리티.",
    viewDetails: "세부정보 보기",
    viewAll: "모든 프로젝트 보기",
    viewGithub: "코드 보기",
    satoriAttribution:
      "[Vercel Satori](https://og-playground.vercel.app/)로 만든 이미지",
    sortBy: "정렬 기준",
    sortOptions: {
      priority: "우선순위",
      dateNewest: "날짜(최신)",
      dateOldest: "날짜(가장 오래된 것)",
      nameAsc: "이름(A~Z)",
      nameDesc: "이름(Z-A)",
    },
    selectSorting: "정렬 선택...",
    visitProject: "프로젝트 방문하기",
    list: {
      codeExtractor: {
        title: "웹사이트 코드 추출기",
        description:
          "웹사이트에서 HTML, CSS, JavaScript, 이미지를 추출하고 JSZip을 사용하여 zip 파일로 패키징하는 간단한 Chrome 확장 프로그램입니다. 소규모 사이트에 이상적이며 웹 코드에 빠르게 액세스할 수 있지만 서버 측 코드에 크게 의존하는 대규모 사이트에서는 어려움을 겪을 수 있습니다.",
      },
      applicare: {
        title: "AppliCare",
        description:
          "AppliCare는 백엔드용 Spring Boot, 데이터 저장용 MongoDB Atlas, 프론트엔드용 Ant Design이 포함된 React(Vite)를 사용하여 구축된 현대적인 입사 지원 관리 플랫폼입니다. 세련되고 반응성이 뛰어난 인터페이스를 통해 입사 지원을 정리하고 추적하는 직관적이고 효율적인 방법을 제공합니다.",
      },
      osint: {
        title: "OSINT 웹사이트",
        description:
          "이 OSINT 웹사이트는 오픈 소스 인텔리전스(Open Source Intelligence)와 끊임없이 진화하는 디지털 조사 세계소개 나의 관심에서 영감을 받은 열정적인 프로젝트입니다. 조사 기술을 연마하고 비판적 사고를 장려하도록 고안된 대화형 연습이 특징입니다.",
      },
      chatapp: {
        title: "ChatApp",
        description:
          "ChatApp은 개인이 계정을 만들고 다양한 채팅방에서 다른 사람들과 연결할 수 있는 사용자 친화적인 채팅 플랫폼입니다. 효율적인 데이터 저장을 위해 Spring Boot로 구축되고 MongoDB의 지원을 받는 ChatApp은 실시간 통신을 위한 원활한 환경을 제공합니다.",
      },
      vmDetector: {
        title: "가상 머신 탐지기",
        description: "이는 머신이 가상 머신인지 감지하는 도구입니다.",
      },
      viewCounter: {
        title: "조회수 카운터",
        description:
          "이것은 페이지를 본 횟수를 계산하는 간단한 조회 카운터 응용 프로그램입니다. Spring Boot와 Redis로 구축되었습니다.",
      },
      dockerService: {
        title: "Docker 서비스 배포",
        description:
          "이 Docker Compose 프로젝트는 팀워크, 컨테이너화 및 문서화에 중점을 두고 MediaWiki, Nextcloud 및 Gogs를 배포합니다. Benicio Von Felten과 함께 개발했습니다.",
      },
      phishing: {
        title: "피싱 웹사이트 튜토리얼",
        description:
          "피싱사이트를 만드는 방법소개 튜토리얼입니다. HTML, CSS, JavaScript로 제작되었습니다.",
      },
      otw: {
        title: "OverTheWire 가이드",
        description: "OverTheWire 워게임을 해결하는 방법소개 가이드입니다.",
      },
      sola: {
        title: "Sola",
        description:
          "Sola는 여러분이 지금 접속하고 있는 제 개인 웹사이트입니다. React, TypeScript 및 Tailwind CSS로 제작되었으며 내 프로젝트, 기술 및 경험을 깔끔하고 현대적인 방식으로 선보이도록 설계되었습니다.",
      },
      kinoa: {
        title: "Kinoa",
        description:
          "Kinoa는 Next.js, shadcn/ui 및 Supabase로 구축된 무료 스트리밍 사이트입니다. 구독이 필요하지 않습니다. 영화와 시리즈를 탐색하고, 타사 호스팅 업체의 인라인 재생으로 시청하고, 자동 서버 장애 조치가 나머지를 처리하도록 하세요.",
      },
      self: {
        title: "Self",
        description:
          "Self는 Python으로 구축된 Neofetch에서 영감을 받아 사용자 정의 가능한 Windows 시스템 정보 표시 도구입니다. 터미널에 직접 이미지 또는 ASCII 아트와 함께 시스템 통계를 표시합니다. 블록 및 점자 렌더링 모드, 테마 사용자 정의, 간단한 PowerShell 설치 프로그램을 지원하여 Windows에 깔끔한 Unix 스타일의 미학을 선사합니다.",
      },
      taco: {
        title: "Taco",
        description:
          "내 동생의 개 Taco를 중심으로 한 프로덕션 준비 템플릿 사이트 — Next.js, TypeScript 및 Tailwind CSS를 사용하여 구축되었습니다. 여기에는 자동 감지 기능을 갖춘 현지화, 블로그 시스템 및 실제 프로젝트에 적합한 깔끔한 모듈식 아키텍처가 포함됩니다.",
      },
      thoughts: {
        title: "Thoughts",
        description:
          "나의 반성, 단편, 메모를 공유하는 미니멀 개인 사이트입니다. [Shu Ding](https://shud.in)의 개인 웹사이트에서 영감을 받아 Next.js, MDX 및 Tailwind로 구축되었습니다. 방문자가 자신의 생각을 남길 수 있는 맞춤형 방명록 기능이 포함되어 있습니다.",
      },
      magi: {
        title: "magi",
        description:
          "magi는 Rust로 작성된 빠른 비동기식 TCP 및 UDP 포트 스캐너입니다. 포트당 일반적인 핸드셰이크인 연결 스캔(포트마다 일반 핸드셰이크)을 수행하므로 루트가 필요 없으며 tokio가 있는 곳 어디에서나 실행됩니다. 실제로 설정되지 않은 포트 상태는 절대 보고하지 않습니다. 프로브를 실행할 수 없으면 닫힌 것으로 추측되기보다는 테스트할 수 없는 것으로 표시됩니다. 제한된 동시성은 배너 잡기, UDP 검색 및 스크립팅을 위한 JSON 출력을 통해 단일 호스트에서 전체 /16까지 메모리 사용량을 일정하게 유지합니다.",
      },
      luma: {
        title: "Luma",
        description:
          "자신의 API 키를 가져와 Claude, GPT, Gemini, Grok 등 최고의 모델과 모두 한 곳에서 대화할 수 있는 다중 모델 AI 플랫폼입니다. Next.js 16, Vercel AI SDK 및 Supabase로 구축되었습니다.",
      },
    },
  },
  skills: {
    title: "기술",
    subtitle: "정기적으로 사용하는 기술과 도구입니다.",
    backHome: "홈으로 돌아가기",
    groups: {
      languages: "언어",
      frontend: "프런트엔드",
      backend: "백엔드",
      infrastructure: "인프라",
      security: "보안",
      tools: "도구",
    },
  },
  notFound: {
    backHome: "홈으로 돌아가기",
  },
  colophon: {
    title: "이 웹사이트는 어떻게 만들어졌나요?",
    intro:
      "오래된 책에서는 마지막 페이지에 그 물건이 어떻게 만들어졌는지 알려줍니다. 이것이 바로 그 페이지입니다.",
    setByHand: "취리히에서 직접 만들었습니다.",
    thanks: "들러주셔서 감사합니다.",
    back: "돌아가기",
  },
  footer: {
    atw: "이 웹사이트에 대해",
    madeWith: "제작 도구",
    by: "제작자",
    rights: "모든 권리 보유.",
    navigation: "탐색",
    connect: "소셜",
    contact: "문의",
    contactForm: "문의 양식",
    privacy: "개인 정보 보호 정책",
    legal: "법적 고지",
  },
  about: {
    title: "소개",
    intro:
      "Yanis Sebastian Zürcher — 18살, 취리히. [WISS](https://www.wiss.ch)에서 컴퓨터 과학을 공부하지만, 아는 건 대부분 강의가 아니라 직접 프로젝트를 내면서 배웠습니다.",
    hobbies:
      "길을 막지 않는 웹앱을 만듭니다. 빠르고, 최소한이고, 느낌이 어떤지에 조금 집착합니다. 필요할 때 풀스택, 인터페이스가 제품일 때 프론트엔드.",
    philosophy: {
      title: "일하는 방식",
      clean:
        "코드는 반년 뒤에도 읽혀야 합니다. 똑똑해 보이는 부분은 지루해질 때까지 다시 씁니다.",
      simplicity:
        "기능을 설명하는 데 문단이 필요하면 아마 두 개입니다. 남은 게 뻔해질 때까지 깎습니다.",
      learning:
        "아직 못 만드는 다음 걸 만들면서 배웁니다. 문서, 레포, 그리고 공개적으로 부수기.",
    },
    interests: {
      title: "그 외",
      nature: {
        title: "산",
        description:
          "스위스에서는 쉽습니다. 긴 하이킹이 커피 한 잔보다 반쯤 쌓인 아이디어 줄을 더 잘 비웁니다.",
      },
      tech: {
        title: "오픈 소스",
        description:
          "할 수 있는 데 손댑니다 — 주로 성능과 접근성. 더 나은 코드에게 혼나는 좋은 방법입니다.",
      },
      learning: {
        title: "읽기",
        description:
          "인내심 있으면 기술 서적, 없으면 딥다이브와 강의. 요즘은 시스템과 웹 플랫폼의 이상한 가장자리.",
      },
      workspace: {
        title: "책상",
        description:
          "모니터 두 대, 시끄러운 키보드, 나머지는 거의 없음. 만질 게 적을수록 일에 더 오래 남습니다.",
      },
    },
    testimonials: {
      title: "같이 일해본 사람들",
      link: "함께 일하기",
      viewMore: "더 보기",
      visitWebsite: "웹사이트 방문",
      website: "웹사이트",
      roleAtCompany: "{company}의 {role}",
      viewLinkedIn: "링크드인 보기",
      modalTitle: "추천사",
      modalDescription: "{author}의 전체 평가",
      items: {
        koenitzer: {
          quote:
            "Yanis는 모든 소프트웨어 엔지니어링(IT) 과목을 안내해 주었습니다. 저는 정말 아무것도 하지 않았습니다. 그의 기술력, 신뢰성, 문제 해결력은 차원이 달랐습니다. 정말 뛰어난 개발자이자 팀원입니다.",
          role: "인턴",
        },
        bichsel: {
          quote:
            "Yanis와 함께 일하는 것은 환상적인 경험이었습니다. 그는 모든 테마를 안내하면서 복잡한 문제소개 창의적인 해결책을 지속적으로 제시하고 모든 것을 제 시간에 전달했습니다. 정말 뛰어난 개발자입니다.",
          role: "학생",
        },
        venzin: {
          quote:
            "야니스는 기술력과 디자인 감성을 겸비한 보기 드문 브랜드입니다. 그가 우리를 위해 만든 WISS 포럼은 모든 기대를 뛰어넘었고 우리의 온라인 존재감을 크게 향상시켰습니다.",
          role: "선생님",
        },
      },
    },
    certifications: {
      link: "인증",
    },
    resume: {
      title: "전체 이력서 요청",
      description:
        "내 이력서의 공개 버전에는 일부 민감한 정보가 검열되어 있습니다. 정식 버전이 필요하신 경우 [연락처](https://sola.ysz.life/contact) 또는 [yanis.sebastian.zuercher@gmail.com](mailto:yanis.sebastian.zuercher@gmail.com)로 이메일을 보내주세요.",
      viewButton: "검열된 버전 보기",
      downloadButton: "검열된 버전 다운로드",
      languageLabel: "언어:",
      buttonLabel: "이력서",
    },
    github: {
      title: "GitHub 활동",
      overview: "개요",
      totalCount: "{{year}}년 {{count}}회 기여",
      totalCountLastYear: "지난 1년간 {{count}}회 기여",
      legendLess: "적음",
      legendMore: "더",
      dayTooltip: "{date}소개 {count} 기여",
      loadError: "지금은 참여 데이터를 로드할 수 없습니다.",
    },
    philosophyLabels: {
      clean: "읽히는 코드",
      simplicity: "더 적게",
      learning: "만들며 배우기",
    },
  },
  contact: {
    title: "문의하기",
    description: "질문이 있거나 함께 일하고 싶나요? 언제든지 문의하세요!",
    formTitle: "메시지 보내기",
    reachOut: "아니면 저한테 직접 연락주세요",
    expectations: {
      title: "무엇을 기대해야 할까요?",
      items: [
        "하루 이틀 안에 답변이 옵니다",
        "귀하의 아이디어소개 명확하고 압박감 없는 대화",
        "범위, 일정, 적합성소개 솔직한 생각",
        "귀하의 세부 정보는 비공개로 유지됩니다. 직접적인 답변만 가능합니다.",
      ],
    },
    nameLabel: "이름",
    namePlaceholder: "이름을 입력하세요",
    emailLabel: "이메일",
    emailPlaceholder: "your.email@example.com",
    messageLabel: "메시지",
    messagePlaceholder: "메시지를 입력하세요...",
    send: "메시지 보내기",
    sending: "전송 중...",
    successMessage: "메시지를 보내주셔서 감사합니다! 곧 다시 연락드리겠습니다.",
    errorMessage: "문제가 발생했습니다. 다시 시도해 주세요.",
    subjectLabel: "테마",
    subjectPlaceholder: "테마를 입력하세요",
    validation: {
      nameRequired: "이름을 입력해주세요.",
      emailRequired: "이메일을 입력해주세요.",
      emailInvalid: "유효한 이메일 주소를 입력하세요.",
      subjectRequired: "제목을 입력하세요.",
      messageRequired: "메시지를 입력해주세요.",
    },
  },
  services: {
    badges: {
      mostPopular: "가장 인기 있음",
    },
    title: "서비스",
    subtitle: "귀하의 요구에 맞는 포괄적인 소프트웨어 개발 서비스입니다.",
    getStarted: "시작하기",
    services: {
      fullstack: {
        title: "풀스택 개발",
        description: "최신 기술을 사용한 엔드투엔드 웹 애플리케이션 개발.",
        price: "CHF 75/시간부터",
        features: [
          "반응형 웹 애플리케이션",
          "RESTful API 개발",
          "데이터베이스 설계 및 구현",
          "성능 최적화",
        ],
      },
      frontend: {
        title: "프론트엔드 개발",
        description:
          "아름답고 반응성이 뛰어나며 사용자 친화적인 인터페이스를 만듭니다.",
        price: "CHF 65/시간부터",
        features: [
          "React 개발",
          "UI/UX 구현",
          "애니메이션과 상호작용",
          "모바일 우선 디자인",
        ],
      },
      backend: {
        title: "백엔드 개발",
        description: "강력하고 확장 가능한 서버측 솔루션.",
        price: "CHF 70/시간부터",
        features: [
          "API 아키텍처",
          "데이터베이스 관리",
          "서버 최적화",
          "보안 구현",
        ],
      },
      consulting: {
        title: "기술 컨설팅",
        description: "기술적인 결정을 위한 전문가의 안내.",
        price: "CHF 60/시간부터",
        features: ["아키텍처 설계", "기술 스택 선택", "성능 감사", "보안 평가"],
      },
    },
    contactTemplate: {
      inquiry: "문의",
      greeting: "안녕하세요 야니스님,",
      interested: "귀하의 {service} 서비스에 관심이 있습니다.",
      discuss: "다음 내용을 논의하고 싶습니다:",
      closing: "답변 기다리겠습니다!",
    },
    customRequirements: {
      title: "맞춤 요구 사항이 있으신가요?",
      description:
        "특정 프로젝트를 염두에 두고 있나요? 나는 당신의 비전을 현실로 바꾸는 데 도움을 주기 위해 왔습니다. 귀하의 요구 사항에 대해 논의하고 귀하의 필요에 맞는 맞춤형 솔루션을 만들어 보겠습니다.",
      button: "문의하기",
    },
  },
} satisfies Translation;
