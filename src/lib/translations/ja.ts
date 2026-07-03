/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */
import type { Translation } from "./en";

export const ja = {
  seo: {
    home: {
      title: "Yanis Sebastian Zürcher • チューリッヒのソフトウェア開発者",
      description:
        "スケーラブルで高速、丁寧に設計されたシステムに注力。インフラ、アイデンティティ、UI などの領域で活動。",
    },
    about: {
      title: "概要 • Yanis Sebastian Zürcher",
      description: "背景、価値観、使用ツールなど、私について詳しく紹介します。",
    },
    projects: {
      title: "プロジェクト • Yanis Sebastian Zürcher",
      description:
        "フルスタック、フロントエンド、バックエンド、ツールなどの制作物。",
    },
    skills: {
      title: "スキル • Yanis Sebastian Zürcher",
      description:
        "React、TypeScript、Spring Boot、Docker などの技術スタック。",
    },
    experience: {
      title: "経験 • Yanis Sebastian Zürcher",
      description: "学歴と職歴のタイムライン。責務、実績、使用技術を記載。",
    },
    contact: {
      title: "お問い合わせ • Yanis Sebastian Zürcher",
      description: "案件、コラボレーション等のご連絡はこちらから。",
    },
    services: {
      title: "サービス • Yanis Sebastian Zürcher",
      description:
        "フルスタック/フロントエンド/バックエンド開発、技術コンサルティング。",
    },
    privacy: {
      title: "プライバシーポリシー",
      description: "ホスティング、分析、処理者、ユーザーの権利に関する詳細。",
    },
    notFound: {
      title: "404 • 見つかりません",
      description: "要求されたリソースは見つかりませんでした。",
    },
  },
  certifications: {
    title: "認定・資格",
    empty: "公開中の認定はまだありません。",
    verify: "検証",
    expired: "有効期限切れ",
    credentialId: "資格 ID",
    expires: "有効期限",
    viewPdf: "PDF を表示",
  },
  common: {
    home: "ホーム",
    overview: "概要",
    menu: {
      themes: "テーマ",
      customThemes: "カスタムテーマ",
      background: "背景",
    },
    diff: {
      showDiff: "git diff を表示",
      exit: "git diff を非表示",
      pageChange: "このページの最新の変更",
      latest: "最新のコミット",
      noChanges: "このページの変更履歴はありません。",
      viewOnGitHub: "GitHub で見る",
      error: "diff を読み込めませんでした。",
      retry: "再試行",
      unavailable: "このファイルのテキスト diff はありません。",
      truncated: "一部省略 — 完全な diff は GitHub で。",
      file: "ファイル",
      files: "ファイル",
    },
    backgroundHints: {
      section: "一部の背景はダークモードの方が見栄えが良いです。",
    },
    callout: {
      background: {
        title: "自分好みに",
        content:
          "{background}と{theme}テーマを選びました — このメニューからいつでも変更できます。",
      },
      done: "了解",
    },
    none: "なし",
    search: "検索",
    command: {
      placeholder: "コマンドまたは検索を入力...",
      noResults: "該当なし",
      groups: {
        navigation: "ナビゲーション",
        theme: "テーマ",
        language: "言語",
        background: "背景",
      },
      footer: {
        navigate: "移動",
        select: "選択",
        close: "閉じる",
      },
    },
    techStack: "技術スタック",
    links: "リンク",
    chromeStore: "Chrome ストア",
    visitSite: "サイトを見る",
    sourceCode: "ソースコード",
    demo: "デモ",
    moreProjects: "他のプロジェクト",
    moreOnGithub: "GitHub で見る",
    view: "表示",
    update: {
      title: "ちょっと更新しました",
      description: "ページを再読み込みしてね。",
      later: "後で",
      refresh: "更新",
      dismiss: "閉じる",
    },
  },
  feed: {
    recentActivity: "最近のアクティビティ",
    lastEvents: "直近20件",
    noActivity: "最近のアクティビティはありません",
    checkBack: "後でもう一度ご確認ください",
    moreSuffix: "件",
  },
  hire: {
    hirebtn: "採用する",
  },
  nav: {
    about: "私について",
    experience: "経験",
    projects: "プロジェクト",
    skills: "スキル",
    contact: "お問い合わせ",
    services: "サービス",
  },
  i18n: {
    detectedNote: "検出: {lang}",
  },
  index: {
    greeting: "こんにちは、私は ",
    description1: "スイス・チューリッヒ在住、18歳のソフトウェア開発者。",
    description2: "スケーラブルで高速、考え抜かれたシステムを構築します。",
    description3: "インフラ、認証、インターフェースに取り組んでいます。",
    description4: "構造・明瞭さ・精度に重点を置いています。",
    currentlyWorkingOn: "現在取り組んでいること",
    contactMe: "お問い合わせ",
    viewProjects: "プロジェクトを見る",
  },
  experience: {
    title: "経験",
    subtitle: "私の技術的専門知識を形成してきた職業経験と教育経験です。",
    sections: {
      work: "職務",
      education: "学歴",
    },
    chips: {
      onsite: "オンサイト",
      remote: "リモート",
      hybrid: "ハイブリッド",
      internship: "インターンシップ",
      full_time: "フルタイム",
      part_time: "パートタイム",
      contract: "契約",
      freelance: "フリーランス",
    },
    period: {
      nadlo: "2026年5月 - 現在",
      gz: "2025年8月 - 2026年3月",
      freelance: "2025年7月 - 現在",
      wiss: "2023年8月 - 現在",
      sek: "2020年 - 2023年",
    },
    nadlo: {
      role: "フルスタック ソフトウェアエンジニア",
      company: "nadlo",
      location: "スイス、バーデン",
      description:
        "フロントからバックまで、本番運用の Web アプリケーションを開発。レスポンシブでアクセシブルな UI と、それを支える API・データモデルを設計し、型安全性・性能・スピーディーなリリースを重視。",
      achievements: [
        "Next.js / React / TypeScript でフルスタック機能を開発し、Tailwind CSS でスタイリング。",
        "NestJS でバックエンドサービスと REST API を構築し、Supabase（Postgres・認証・ストレージ）を活用。",
        "Docker でサービスをコンテナ化し、GitHub Actions でビルド・テスト・デプロイのパイプラインを自動化。",
        "企画からデプロイまで機能を一貫して担当し、保守性・型安全性・性能を重視。",
      ],
    },
    freelance: {
      role: "フリーランス Web エンジニア",
      company: "フリーランス",
      location: "スイス、チューリッヒ",
      description:
        "ランディングからフルスタック機能まで、モダンな Web ソリューションを提供。クリーンなUX、性能、保守性を重視。",
      achievements: [
        "React / Next.js / TypeScript / Tailwind CSS を用いた制作・運用。",
        "Spring Boot と Java によるバックエンド機能、Git によるバージョン管理。",
      ],
    },
    gz: {
      role: "IAM デベロッパー",
      company: "Gesundheitswelt Zollikerberg",
      location: "スイス、ツォリコン",
      description:
        "IAMエンジニアリングのインターンとして、ITインフラの保守・最適化に取り組み、特にIDおよびアクセス管理（IAM）プロセスの自動化に焦点を当てています。この企業はツォリコンの住民に医療サービスを提供しています。",
      achievements: [
        "PowerShellとPythonを使用してIAMワークフローの自動化を支援。",
        "社内のITインフラ改善の導入に参加。",
        "Active Directoryの保守やユーザー管理業務をサポート。",
      ],
    },
    wiss: {
      role: "学生 - コンピュータサイエンス",
      company: "WISS",
      location: "スイス、チューリッヒ",
      description:
        "現在、WISSというコンピュータサイエンス学校で包括的な情報技術教育を受けています。プログラミング、システム分析、データベース管理、ソフトウェア開発、プロジェクト管理など、幅広い分野を学んでいます。この経験は、ソフトウェアエンジニアリングの将来に向けて、広範な基盤を提供しています。",
      achievements: [
        "最新技術を使用したフルスタックWebアプリケーションの開発",
        "アジャイル手法を用いたチームプロジェクトでの協働",
      ],
    },
    sek: {
      role: "Sek A",
      company: "Lachenzelg",
      location: "スイス、チューリッヒ",
      description:
        "技術的な道のりの基礎知識を習得。最終プロジェクトとしてUnreal Engineの環境を作成しました。",
      achievements: [
        "Unreal Engineを使用した没入型3D環境の作成",
        "強力な問題解決力と分析スキルの開発",
        "MINT重点プロジェクトや活動への参加",
      ],
    },
  },
  projects: {
    title: "プロジェクト",
    other: "その他のプロジェクト",
    otherInfo: "注目外のプロジェクト：小さなツールや実験的なもの。",
    viewDetails: "詳細を見る",
    viewAll: "すべてのプロジェクトを見る",
    viewGithub: "コードを見る",
    satoriAttribution:
      "この画像は [Vercel Satori](https://og-playground.vercel.app/) で生成",
    sortBy: "並べ替え",
    sortOptions: {
      priority: "優先度",
      dateNewest: "日付（新しい順）",
      dateOldest: "日付（古い順）",
      nameAsc: "名前（A–Z）",
      nameDesc: "名前（Z–A）",
    },
    selectSorting: "並べ替えを選択...",
    visitProject: "プロジェクトを見る",
    list: {
      codeExtractor: {
        title: "ウェブサイトコード抽出ツール",
        description:
          "ウェブサイトから HTML、CSS、JavaScript、画像を抽出し、JSZip で ZIP にまとめるシンプルな Chrome 拡張です。小規模サイトに最適でコードへ素早くアクセスできますが、サーバー側コードに依存する大規模サイトでは制限があります。",
      },
      applicare: {
        title: "AppliCare",
        description:
          "AppliCareは、バックエンドにSpring Boot、データストレージにMongoDB Atlas、フロントエンドにReact（Vite）とAnt Designを使用して構築された最新の求職管理プラットフォームです。洗練されたレスポンシブなインターフェースで、求職活動を直感的かつ効率的に整理・監視する方法を提供します。",
      },
      osint: {
        title: "OSINT ウェブサイト",
        description:
          "このOSINTウェブサイトは、オープンソースインテリジェンスと不断に進化するデジタル調査の世界への関心から生まれたプロジェクトです。調査スキルを磨き、批判的思考を促す対話型の演習を提供しています。",
      },
      chatapp: {
        title: "ChatApp",
        description:
          "ChatAppは、ユーザーがアカウントを作成し、様々なチャットルームで他のユーザーとつながることができるユーザーフレンドリーなチャットプラットフォームです。Spring Bootで構築され、MongoDBによる効率的なデータストレージを備え、リアルタイムコミュニケーションのためのシームレスな体験を提供します。",
      },
      vmDetector: {
        title: "仮想マシン検出ツール",
        description: "マシンが仮想マシンであるかどうかを検出するツールです。",
      },
      viewCounter: {
        title: "ビューカウンター",
        description:
          "ページの閲覧回数をカウントするシンプルなビューカウンターアプリケーションです。Spring BootとRedisで構築されています。",
      },
      dockerService: {
        title: "Dockerサービスデプロイメント",
        description:
          "このDocker Composeプロジェクトは、MediaWiki、Nextcloud、Gogsをデプロイし、チームワーク、コンテナ化、ドキュメンテーションに焦点を当てています。Benicio Von Feltenと共同開発。",
      },
      phishing: {
        title: "フィッシングウェブサイトチュートリアル",
        description:
          "これは、フィッシングウェブサイトの作成方法に関するチュートリアルです。HTML、CSS、JavaScriptで構築されています。",
      },
      otw: {
        title: "OverTheWireガイド",
        description: "OverTheWireウォーゲームの解決方法に関するガイドです。",
      },
      sola: {
        title: "Sola",
        description:
          "Sola は私の個人サイトです。React・TypeScript・Tailwind CSS で構築し、プロジェクトやスキル、経験をクリーンかつモダンに紹介します。",
      },
      kinoa: {
        title: "Kinoa",
        description:
          "Kinoa は Next.js、shadcn/ui、Supabase で構築した無料ストリーミングサイトです。サブスク不要 — 映画やドラマをサードパーティホスターからインライン再生でき、サーバーが落ちても自動で切り替わります。",
      },
      self: {
        title: "Self",
        description:
          "Self は、Neofetch にインスパイアされたカスタマイズ可能な Windows 用のシステム情報表示ツールで、Python で構築されています。システム情報を画像や ASCII アートと共にターミナル上に表示します。ブロックと点字の描画モード、テーマのカスタマイズ、簡単な PowerShell インストーラーに対応し、Windows にクリーンで Unix ライクな美しさをもたらします。",
      },
      taco: {
        title: "Taco",
        description:
          "弟の犬 Taco を題材にしたプロダクション品質のテンプレート。Next.js・TypeScript・Tailwind CSS により、言語自動検出付きのローカリゼーション、ブログ機能、モジュール化されたクリーンなアーキテクチャを備えています。",
      },
      thoughts: {
        title: "Thoughts",
        description:
          "考えや断片、メモを共有するミニマルな個人サイトです。[Shu Ding](https://shud.in) の個人サイトに触発され、Next.js・MDX・Tailwind CSS で構築しました。訪問者が自分の想いを書き残せる独自のゲストブック機能を備えています。",
      },
      magi: {
        title: "magi",
        description:
          "magi は Rust で書かれた高速・非同期の TCP/UDP ポートスキャナーです。コネクトスキャン（各ポートへの通常のハンドシェイク）を行うため root は不要で、tokio が動く環境ならどこでも動作します。実際に確立していないポート状態を報告することは決してありません。プローブを実行できない場合は closed と決めつけず untestable として扱います。有界な並行処理により、単一ホストから /16 全体までメモリ使用量を一定に保ち、バナー取得、UDP スキャン、スクリプト連携向けの JSON 出力に対応します。",
      },
      luma: {
        title: "Luma",
        description:
          "自分の API キーを持ち込み、Claude・GPT・Gemini・Grok など最高の AI モデルとひとつの場所で対話できるマルチモデル AI プラットフォーム。Next.js 16、Vercel AI SDK、Supabase で構築。",
      },
    },
  },
  skills: {
    title: "スキル",
    subtitle: "日常的に使用している技術とツール。",
    backHome: "ホームに戻る",
    groups: {
      languages: "言語",
      frontend: "フロントエンド",
      backend: "バックエンド",
      infrastructure: "インフラ",
      security: "セキュリティ",
      tools: "ツール",
    },
  },
  notFound: {
    backHome: "ホームに戻る",
  },
  footer: {
    atw: "このウェブサイトについて",
    madeWith: "制作",
    by: "作成者",
    rights: "全著作権所有。",
    navigation: "ナビゲーション",
    connect: "接続",
    contact: "連絡先",
    contactForm: "フォームを介して",
    privacy: "プライバシーポリシー",
    legal: "法的",
  },
  about: {
    title: "私について",
    intro:
      "ヤニス・セバスチャン・ズルヒャー（Yanis Sebastian Zürcher）と申します。スイスのチューリッヒを拠点とする18歳のソフトウェア開発者です。[WISS](https://www.wiss.ch)でコンピュータサイエンスを学んでいますが、私の知識のほとんどは学校ではなく、自分でプロジェクトを作りながら身につけたものです。",
    hobbies:
      "高速でクリーン、かつミニマルなWebアプリケーションの開発に注力しています。フルスタックのプラットフォームでも洗練されたフロントエンドでも、明快さ、パフォーマンス、洗練されたユーザー体験を大切にしています。常に自分のアイデアを形にし、使い心地と機能性を兼ね備えたプロダクトを作り続けています。",
    philosophy: {
      title: "開発アプローチ",
      clean:
        "クリーンで保守可能なコードは持続可能なソフトウェア開発の基盤だと信じています。私が書く一行一行が卓越性への取り組みを反映しています。",
      simplicity:
        "複雑な問題には洗練されたソリューションが必要です。機能性、パフォーマンス、ユーザー体験の間の完璧なバランスを見つけることを目指しています。",
      learning:
        "テクノロジーの風景は急速に進化し、私もそれに合わせて進化します。継続的な学習と適応は私のプロフェッショナルアイデンティティの不可欠な要素です。",
    },
    interests: {
      title: "情熱と追求",
      nature: {
        title: "アルプス探検",
        description:
          "スイスに住むことで自然への素晴らしいアクセスが可能です。定期的にアルプスをハイキングし、挑戦と自然の美しさの組み合わせが、技術的な仕事のための精神的な明晰さと創造的なインスピレーションの両方を提供していると感じています。",
      },
      tech: {
        title: "オープンソース貢献",
        description:
          "複数のオープンソースプロジェクトに積極的に貢献し、特にパフォーマンスの最適化とアクセシビリティの向上に焦点を当てています。このコミュニティへの参加により、最先端の技術を維持しながら、私が価値を置くエコシステムに還元しています。",
      },
      learning: {
        title: "技術文献",
        description:
          "厳選された技術書のコレクションを維持し、定期的にオンラインコースに参加しています。現在、分散システムの高度なパターンと、プロジェクトに応用している関数型プログラミングのパラダイムを探求しています。",
      },
      workspace: {
        title: "最適化された環境",
        description:
          "私の作業環境は生産性と創造性を最大化するために慎重に設計されています。カスタムメカニカルキーボードと人間工学に基づいたソリューションを備えたミニマリストなデュアルモニターセットアップを使用し、長時間の集中した開発セッションを可能にしています。",
      },
    },
    testimonials: {
      title: "人々の声",
      link: "私と働く",
      viewMore: "もっと見る",
      visitWebsite: "ウェブサイトを見る",
      viewLinkedIn: "LinkedIn を見る",
      modalTitle: "推薦文",
      modalDescription: "{author} からの全文推薦",
    },
    certifications: {
      link: "認定資格",
    },
    resume: {
      title: "完全版履歴書のリクエスト",
      description:
        "公開版の履歴書には、機密情報の一部が検閲されています。完全版が必要な場合は、[お問い合わせ](https://sola.ysz.life/contact)いただくか、[yanis.sebastian.zuercher@gmail.com](mailto:yanis.sebastian.zuercher@gmail.com) までメールをお送りください。",
      viewButton: "検閲版を表示",
      downloadButton: "検閲版をダウンロード",
      languageLabel: "言語:",
      buttonLabel: "履歴書",
    },
    github: {
      title: "GitHub アクティビティ",
      overview: "概要",
      totalCount: "{{year}}年のコントリビューション {{count}} 件",
      totalCountLastYear: "過去1年のコントリビューション {{count}} 件",
      legendLess: "少",
      legendMore: "多",
      dayTooltip: "{date}: {count} 件",
      loadError: "コントリビューションデータを読み込めませんでした。",
    },
    philosophyLabels: {
      clean: "クリーンコード",
      simplicity: "シンプルさ",
      learning: "継続的な学習",
    },
  },
  contact: {
    title: "お問い合わせ",
    description:
      "ご質問や協力のご提案などございましたら、お気軽にご連絡ください。",
    formTitle: "メッセージを送る",
    reachOut: "直接連絡する",
    expectations: {
      title: "期待できること",
      items: [
        "1〜2日以内の返信",
        "あなたのアイデアについての気軽で明確な会話",
        "範囲・スケジュール・相性についての率直な意見",
        "あなたの情報は非公開 — 直接お返事するだけです",
      ],
    },
    nameLabel: "お名前",
    namePlaceholder: "あなたのお名前",
    emailLabel: "メールアドレス",
    emailPlaceholder: "your.email@example.com",
    messageLabel: "メッセージ",
    messagePlaceholder: "メッセージを入力してください...",
    send: "送信",
    sending: "送信中...",
    successMessage:
      "メッセージをお送りいただき、ありがとうございます。近日中にご連絡させていただきます。",
    errorMessage: "問題が発生しました。もう一度お試しください。",
    subjectLabel: "件名",
    subjectPlaceholder: "件名を入力",
    attachmentPlaceholder: "クリックして選択、またはファイルをドロップ",
    uploadedLabel: "アップロード済み",
    cloudinaryLinkLabel: "Cloudinary リンク",
    dropOverlay: "ここにドロップして添付",
    fileTooLarge: "ファイルサイズが大きすぎます（最大 {max}）。",
    unsupportedFileType:
      "未対応のファイル形式です。PNG, JPG, WEBP, PDF, DOC, DOCX が使用できます。",
    validation: {
      nameRequired: "お名前を入力してください。",
      emailRequired: "メールアドレスを入力してください。",
      emailInvalid: "有効なメールアドレスを入力してください。",
      subjectRequired: "件名を入力してください。",
      messageRequired: "メッセージを入力してください。",
    },
  },
  services: {
    badges: {
      mostPopular: "一番人気",
    },
    title: "サービス",
    subtitle: "お客様のニーズに合わせた包括的なソフトウェア開発サービス。",
    getStarted: "今すぐ始める",
    services: {
      fullstack: {
        title: "フルスタック開発",
        description: "最新技術を使用したエンドツーエンドのWeb開発。",
        price: "CHF 75/時〜",
        features: [
          "レスポンシブWebアプリケーション",
          "RESTful API開発",
          "データベース設計と実装",
          "パフォーマンス最適化",
        ],
      },
      frontend: {
        title: "フロントエンド開発",
        description: "美しく使いやすいインターフェースの作成。",
        price: "CHF 65/時〜",
        features: [
          "React開発",
          "UI/UX実装",
          "アニメーションと対話",
          "モバイルファースト設計",
        ],
      },
      backend: {
        title: "バックエンド開発",
        description: "堅牢でスケーラブルなサーバーサイドソリューション。",
        price: "CHF 70/時〜",
        features: [
          "API設計",
          "データベース管理",
          "サーバー最適化",
          "セキュリティ実装",
        ],
      },
      consulting: {
        title: "技術コンサルティング",
        description: "技術的な意思決定のための専門家によるガイダンス。",
        price: "CHF 60/時〜",
        features: [
          "アーキテクチャ計画",
          "技術スタックの選定",
          "パフォーマンス監査",
          "セキュリティ評価",
        ],
      },
    },
    contactTemplate: {
      inquiry: "お問い合わせ",
      greeting: "Yanisさん、こんにちは。",
      interested: "{service}サービスに興味があります。",
      discuss: "以下について相談したいです：",
      closing: "お返事をお待ちしております！",
    },
    customRequirements: {
      title: "カスタム要件をお持ちですか？",
      description:
        "具体的なプロジェクトをお考えですか？あなたのビジョンを実現するお手伝いをさせていただきます。ご要件についてご相談させていただき、ニーズに合わせたソリューションを作成いたしましょう。",
      button: "お問い合わせ",
    },
  },
} satisfies Translation;
