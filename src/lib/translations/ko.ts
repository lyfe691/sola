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
    changelog: {
      description: "sola의 git log — GitHub 기록의 커밋, 파일 트리, 패치.",
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
    present: "현재",
    back: "뒤로",
    overview: "개요",
    a11y: {
      openMenu: "메뉴 열기",
      closeMenu: "메뉴 닫기",
      primaryNav: "기본 내비게이션",
      toggleLanguage: "언어 전환",
      toggleTheme: "테마 전환",
      commandPalette: "명령 팔레트",
      commandPaletteHint: "명령 검색…",
      scrollToTop: "맨 위로",
    },
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
    sourcePrivate: "소스 코드는 비공개입니다.",
    sourcePrivateClient:
      "클라이언트를 위해 제작한 프로젝트라 소스 코드는 비공개입니다.",
    linkPrivate: "라이브 앱은 비공개입니다.",
    linkPrivateClient:
      "클라이언트 회사 내부에서 사용되기 때문에 라이브 앱은 비공개입니다.",
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
    lastEvents: "지난 {count}개 이벤트",
    noActivity: "최근 활동 없음",
    loadError: "최근 활동을 불러오지 못했습니다",
    checkBack: "나중에 다시 업데이트를 확인하세요.",
    moreSuffix: "더",
    commit: "커밋 {count}개",
    commits: "커밋 {count}개",
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

    nadlo: {
      role: "풀스택 소프트웨어 개발자",
      company: "nadlo",
      location: "바덴, 스위스",
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
      location: "취리히, 스위스",
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
      location: "촐리콘, 스위스",
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
      location: "취리히, 스위스",
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
      location: "취리히, 스위스",
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
    viewDetails: "세부정보 보기",
    viewGithub: "코드 보기",
    sortBy: "정렬 기준",
    sortOptions: {
      featured: "추천",
      newest: "최신순",
      oldest: "오래된순",
      name: "이름(A~Z)",
    },
    kind: {
      label: "프로젝트 유형",
      all: "전체",
      personal: "개인",
      commercial: "상업",
    },
    empty: "아직 항목이 없습니다",
    emptyDescription: "이 유형의 프로젝트는 준비되는 대로 여기에 표시됩니다.",
    visitProject: "프로젝트 방문하기",
    list: {
      codeExtractor: {
        title: "웹사이트 코드 추출기",
        tagline: "어떤 웹사이트의 코드든 ZIP 하나로",
        description:
          "[Website Code Extractor](https://chromewebstore.google.com/detail/website-code-extractor/foppgeakfpkdghmmmflmblcidoofpohm)는 웹사이트의 HTML, CSS, JavaScript, 이미지를 폴더 구조 그대로 ZIP 파일 하나로 내려받는 Chrome·Edge 확장 프로그램입니다. 클릭 한 번이면 되고 설정은 필요 없습니다. Chrome 웹 스토어 사용자 6,000명이 쓰고 있으며, 정적 사이트에서 가장 잘 동작합니다.",
      },
      applicare: {
        title: "AppliCare",
        tagline: "모든 지원 현황을 한곳에서",
        description:
          "[AppliCare](https://applicare.app)는 입사 지원 현황을 관리해 줍니다. 지원 건마다 '지원함'부터 '오퍼'까지의 상태를 기록하고, 기한이 있는 할 일을 연결하고, 성공률과 추이 그래프가 있는 대시보드에서 진행 상황을 확인할 수 있습니다. React, Ant Design, Spring Boot, MongoDB로 만들었습니다.",
      },
      osint: {
        title: "OSINT 웹사이트",
        tagline: "조사 감각을 날카롭게",
        description:
          "[OSINT Exercises](https://osint.ysz.life)는 공개된 출처에서 정보를 찾아내는 오픈소스 인텔리전스(OSINT)를 연습하는 사이트입니다. 각 연습에는 배경 설명과 여러 과제가 있고 난이도는 쉬움부터 전문가까지이며, 누구나 사이트를 통해 새 연습을 제출할 수 있습니다.",
      },
      chatapp: {
        title: "ChatApp",
        tagline: "Spring Boot 기반 실시간 채팅방",
        description:
          "ChatApp은 실시간 채팅 플랫폼입니다. 계정을 만들고 이메일을 인증하면 직접 만들거나 참여한 방에서 대화할 수 있습니다. 메시지는 WebSocket으로 오가고, 그 뒤에는 Spring Boot와 MongoDB가 있습니다. 학교 모듈 과제로 만들었습니다.",
      },
      vmDetector: {
        title: "가상 머신 탐지기",
        tagline: "가상 머신에서 실행 중인지 감지",
        description:
          "자신이 가상 머신 안에서 실행 중인지 알려 주는 작은 Java 도구입니다. BIOS, CPU, 네트워크 카드의 MAC 주소, Windows 레지스트리를 확인해 하이퍼바이저가 남기는 흔적을 찾습니다.",
      },
      viewCounter: {
        title: "조회수 카운터",
        tagline: "Redis 기반 페이지 조회수 카운터",
        description:
          "페이지 조회수 카운터입니다. 홈 페이지를 방문할 때마다 1씩 늘고, 값은 Redis에 저장되어 재시작해도 유지됩니다. Java 웹 앱에서 Redis를 어떻게 쓰는지 배우기 위한 작은 Spring Boot 프로젝트입니다.",
      },
      dockerService: {
        title: "Docker 서비스 배포",
        tagline: "Compose로 MediaWiki, Nextcloud, Gogs 배포",
        description:
          "MediaWiki, Nextcloud, Gogs를 나란히 실행하는 Docker Compose 구성입니다. 데이터는 영구 저장되고 Portainer로 모니터링합니다. Benicio Von Felten과 함께 만들고 문서화한 학교 프로젝트입니다.",
      },
      phishing: {
        title: "피싱 웹사이트 튜토리얼",
        tagline: "피싱 페이지의 작동 원리 배우기",
        description:
          "피싱 페이지가 어떻게 만들어지는지 단계별로 살펴보고, 실제로 마주쳤을 때 알아볼 수 있도록 쓴 튜토리얼입니다. 교육 목적으로만 제공됩니다.",
      },
      otw: {
        title: "OverTheWire 가이드",
        tagline: "Bandit, 레벨별 공략",
        description:
          "[OverTheWire의 Bandit](https://overthewire.org/wargames/bandit/) 워게임을 레벨별로 풀어 가는 가이드입니다. 각 레벨에 필요한 Linux 명령어에 대한 짧은 소개도 담았습니다.",
      },
      sola: {
        title: "Sola",
        tagline: "React와 TypeScript로 만든 모던 포트폴리오",
        description:
          "Sola는 여러분이 지금 접속하고 있는 제 개인 웹사이트입니다. React, TypeScript 및 Tailwind CSS로 제작되었으며 내 프로젝트, 기술 및 경험을 깔끔하고 현대적인 방식으로 선보이도록 설계되었습니다.",
      },
      kinoa: {
        title: "Kinoa",
        tagline: "무료 스트리밍, 군더더기 없이",
        description:
          "[Kinoa](https://kinoa.to)는 영화와 시리즈를 위한 무료 스트리밍 사이트입니다. 인기작을 둘러보고 작품을 열어 같은 페이지에서 바로 재생할 수 있으며 계정도 필요 없습니다. 로그인하면 관심 목록과 시청 기록이 기기 간에 동기화됩니다. Next.js, Supabase, TMDB 데이터로 만들었습니다.",
      },
      self: {
        title: "Self",
        tagline: "Windows를 위해 다시 만든 Neofetch",
        description:
          "Self는 Linux의 Neofetch처럼 시스템 정보를 이미지나 ASCII 아트와 나란히 터미널에 보여 주는 Windows용 도구입니다. PowerShell 명령 하나로 설치되고, 이미지를 컬러 블록이나 점자로 렌더링하며, 테마도 설정할 수 있습니다. Python으로 작성했습니다.",
      },
      taco: {
        title: "Taco",
        tagline: "재사용할 수 있는 템플릿으로 만든 강아지 웹사이트",
        description:
          "[Taco](https://takitwo.vercel.app)는 형의 강아지를 소개하는 웹사이트로, 다시 쓸 수 있는 템플릿으로 만들었습니다. 영어, 스페인어, 일본어 페이지와 자동 언어 감지, 블로그, 갤러리, 연락처 페이지가 있습니다. Next.js, TypeScript, Tailwind CSS로 만들었습니다.",
      },
      thoughts: {
        title: "Thoughts",
        tagline: "생각, 조각, 그리고 메모",
        description:
          "[Thoughts](https://thoughts.ysz.life)는 이 포트폴리오와 별개로 생각과 단상, 메모를 적어 두는 작은 사이트입니다. 글은 MDX 파일이고, 방명록에는 방문자가 자신의 글을 남길 수 있습니다. [Shu Ding](https://shud.in)의 개인 사이트에서 영감을 받았습니다.",
      },
      magi: {
        title: "magi",
        tagline: "정확함을 우선한 비동기 포트 스캐너",
        description:
          "[magi](https://magi.ysz.life)는 Rust로 작성된 빠른 TCP·UDP 포트 스캐너입니다. 일반적인 연결로 스캔하기 때문에 루트 권한이 필요 없고, 실제로 관찰한 것만 보고합니다. 테스트하지 못한 포트는 closed가 아니라 untestable로 표시됩니다. Linux, macOS, Windows에 명령 하나로 설치할 수 있습니다.",
      },
      luma: {
        title: "Luma",
        tagline: "내 키로 어떤 모델과도 대화",
        description:
          "[Luma](https://luma.ysz.life)는 주요 AI 모델을 모두 쓸 수 있는 채팅 앱입니다. 본인의 API 키를 등록하면 하나의 대화 안에서 Claude, GPT, Gemini, Grok 등을 오갈 수 있습니다. 이전 메시지를 수정하면 대화가 갈라지고 두 흐름이 모두 유지됩니다. 키는 저장 전에 암호화됩니다.",
      },
      perspectas: {
        title: "perspectas.ch",
        tagline: "노란 점 하나를 중심으로 만든 컨설팅 사이트",
        description:
          "취리히 근교의 컨설팅·채용 회사 [perspectas gmbh](https://www.perspectas.ch)의 웹사이트를 Next.js와 Sanity로 다시 만들었습니다. 모든 문구와 이미지가 CMS에 있어서 두 파트너가 직접 변경 사항을 게시합니다. 디자인의 포인트는 하나뿐입니다. 로고의 노란 점이 헤드라인의 마침표 역할도 합니다.",
      },
      ura: {
        title: "Ura",
        tagline: "허가 여부까지 알려주는 오프라인 스노모빌 내비",
        description:
          "Ura는 핀란드 라플란드를 위한 스노모빌 내비게이션으로, iOS와 Android를 지원합니다. 2,595개의 경로와 주유소, 카페, 산장 등 3,388곳을 휴대폰에 담아 두기 때문에 신호가 없는 곳에서도 작동합니다. 지금 경로 위에 있는지, 그 경로가 자유롭게 달릴 수 있는지 아니면 먼저 허가가 필요한지 알려 줍니다.",
      },
      montu: {
        title: "Montu",
        tagline: "GPX로 지도와 고도를 그리는 산행 기록",
        description:
          "[Montu](https://montu.ch)는 스위스 독일어로 쓰인 산행 기록 사이트로, 직접 투어를 쓰고 사진을 찍는 클라이언트를 위해 만들었습니다. GPX 파일을 올리면 페이지가 지형도 위에 경로와 고도 프로필을 그려 줍니다. 투어와 사진, 그 밖의 모든 문구를 CMS에서 편집하므로 새 투어를 올릴 때 개발자가 필요 없습니다.",
      },
      qr: {
        title: "QR",
        tagline: "꾸민 QR 코드를 그 자리에서 스캔 검증",
        description:
          "[qr.ysz.life](https://qr.ysz.life)는 브라우저 안에서만 동작하는 QR 코드 생성기입니다. 점과 모서리 스타일을 고르고 그라데이션과 로고를 더한 뒤 PNG, SVG, JPEG, WebP로 내보낼 수 있습니다. 내장된 스캔 테스트가 완성된 코드를 다시 읽어 주기 때문에 인쇄하기 전에 제대로 스캔되는지 확인할 수 있습니다.",
      },
      vault: {
        title: "Vault",
        tagline: "Keycloak과 FastAPI, realm은 Terraform으로 정의",
        description:
          "Vault는 OpenID Connect를 익히기 위한 로컬 샌드박스입니다. Keycloak이 토큰을 발급하고, FastAPI 서비스가 이를 검증하며, Next.js 프런트엔드가 역할별로 제한된 대시보드를 보여 줍니다. ID 설정이 Terraform으로 선언되어 있어 명령 하나로 전체를 지우고 다시 세울 수 있습니다.",
      },
      fleetmap: {
        title: "fleetmap",
        tagline: "차량 GPS를 사무실 화면으로 실시간 전송",
        description:
          "fleetmap은 배송 차량의 실시간 지도입니다. 각 차량의 휴대폰이 위치를 보내면 사무실 화면에 모든 차량의 움직임이 정류지, ETA, 지연과 함께 표시됩니다. 지난 날의 운행도 기록된 경로로 다시 재생할 수 있습니다. Next.js, Supabase, MapLibre로 만들었습니다.",
      },
    },
  },
  skills: {
    title: "기술",
    subtitle: "정기적으로 사용하는 기술과 도구입니다.",
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
    title: "이 웹사이트는 어떻게 만들어졌나요",
    lede: "오래된 책에서는 마지막 페이지에 그 물건이 어떻게 만들어졌는지 알려줍니다. 이것이 바로 그 페이지입니다.",
    built:
      "[React](https://react.dev)와 [TypeScript](https://www.typescriptlang.org)로 만든 앱이고, 저장에서 화면까지의 거리가 보이지 않게 [Vite](https://vite.dev)로 짓습니다. 색과 여백은 [Tailwind CSS](https://tailwindcss.com)와 [shadcn/ui](https://ui.shadcn.com) — 토큰만, 날것의 팔레트는 쓰지 않습니다. 움직이는 것은 인터페이스가 [Motion](https://motion.dev), 하늘이 [GSAP](https://gsap.com). 시계는 둘입니다. 버튼이 배경의 박자를 빌려 쓰지 않게.",
    faces:
      "글자는 읽기용 [Onest](https://fonts.google.com/specimen/Onest), 이름용 [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque), 코드용 [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono), 그리고 이런 먹색에는 [Shippori Mincho B1](https://fonts.google.com/specimen/Shippori+Mincho+B1). [Vercel](https://vercel.com)에 살고, 원본은 [GitHub](https://github.com/lyfe691/sola)에 있습니다.",
    close: "취리히에서 손으로 짰습니다. 들러주셔서 감사합니다.",
    back: "돌아가기",
  },
  changelog: {
    title: "Changelog",
    subtitle:
      "이 사이트의 실시간 git 기록입니다. 커밋을 펼치면 메시지, 파일 트리, 패치를 볼 수 있습니다.",
    empty: "표시할 커밋이 없습니다.",
    error: "git 기록을 불러올 수 없습니다.",
    retry: "다시 시도",
    older: "이전 기록 불러오기",
    viewOnGitHub: "GitHub에서 보기",
    thisDeploy: "이 배포",
    truncated: "diff가 잘렸습니다. 전체 커밋은 GitHub에서 확인하세요.",
    unavailable: "패치 생략 (바이너리이거나 너무 큼).",
    files: "{count}개 파일",
    expand: "커밋 표시",
    collapse: "커밋 숨기기",
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
    changelog: "Changelog",
  },
  about: {
    title: "소개",
    intro:
      "저는 Yanis Sebastian Zürcher, 18살, 취리히에 사는 소프트웨어 개발자입니다. [WISS](https://www.wiss.ch)에서 컴퓨터 과학을 2년 공부했습니다. 그 과정의 일환으로 [nadlo](https://nadlo.ch)에서 인턴십 중이고, 2027년 7월까지입니다.",
    hobbies:
      "풀스택으로 일합니다. 하지만 즐거운 건 UI와 디자인입니다. 어떻게 보여야 하고 어떻게 쓰여야 하는지를 정하는 게 좋고, 일에서 진짜 시간을 쓰고 싶은 부분이 거기입니다.",
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
      title: "관심사",
      nature: {
        title: "야외",
        description:
          "되도록 자주 밖에 나가려고 합니다. 주로 하이킹이고, 가끔은 목적지 없는 긴 산책이기도 합니다. 스위스에 살면 그게 쉽고 알프스도 가깝습니다. 화면 앞에서 너무 오래 앉아 있은 뒤, 트레일에서 몇 시간을 보내는 건 머리를 비우는 데 여전히 가장 좋은 방법 중 하나입니다.",
      },
      tech: {
        title: "오픈 소스",
        description:
          "오픈 소스는 체크리스트가 아니라, 정말 관심 가는 프로젝트가 있을 때만 기여합니다. 대개 성능, 접근성, 또는 이미 매일 쓰는 도구의 작은 사용성 개선 쪽입니다.",
      },
      learning: {
        title: "학습",
        description:
          "학교 밖에서도 책, 문서, 새로운 내용일 때는 강의를 섞어 계속 배웁니다. 요즘은 시스템 쪽과 브라우저가 내부에서 어떻게 동작하는지에 시간을 쓰고 있고, 그게 그대로 제가 만드는 프로젝트로 이어집니다.",
      },
      workspace: {
        title: "환경",
        description:
          "책상은 일부러 단순합니다. 모니터 두 대, 기계식 키보드, 잡동사니는 거의 없습니다. 가젯을 모으기보다 방해되지 않는 환경이 더 중요해서, 앉으면 방을 다시 정리할 필요 없이 바로 일할 수 있게 맞춰 둡니다.",
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
            "모든 소프트웨어 엔지니어링(IT) 과목에서 Yanis와 함께 일한 것은 정말 인상적인 경험이었습니다. 그의 기술력, 신뢰성, 문제 해결력은 차원이 달랐습니다. 정말 뛰어난 개발자이자 팀원입니다.",
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
      subject: "맞춤 개발 문의",
      message:
        "안녕하세요 Yanis님,\n\n표준 서비스 카테고리에 맞지 않는 특별한 요구 사항이 있어 맞춤 솔루션에 대해 논의하고 싶습니다.\n\n프로젝트 세부 정보:\n- \n- \n- \n\n연락 기다리겠습니다!",
    },
  },
  errorBoundary: {
    title: "문제가 발생했습니다",
    message:
      "예기치 않은 오류가 발생했습니다. 페이지를 새로고침하면 대부분 해결됩니다.",
    reload: "새로고침",
  },
} satisfies Translation;
