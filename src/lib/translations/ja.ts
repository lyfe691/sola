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
      description:
        "スケーラブルで高速、丁寧に設計されたシステムに注力。インフラ、アイデンティティ、UI などの領域で活動。",
    },
    about: {
      description: "背景、価値観、使用ツールなど、私について詳しく紹介します。",
    },
    projects: {
      description:
        "フルスタック、フロントエンド、バックエンド、ツールなどの制作物。",
    },
    skills: {
      description:
        "React、TypeScript、Spring Boot、Docker などの技術スタック。",
    },
    experience: {
      description: "学歴と職歴のタイムライン。責務、実績、使用技術を記載。",
    },
    contact: {
      description: "案件、コラボレーション等のご連絡はこちらから。",
    },
    services: {
      description:
        "フルスタック/フロントエンド/バックエンド開発、技術コンサルティング。",
    },
    privacy: {
      description: "ホスティング、分析、処理者、ユーザーの権利に関する詳細。",
    },
    notFound: {
      description: "要求されたリソースは見つかりませんでした。",
    },
    certifications: {
      description: "資格と認定の一覧。検証リンク付き。",
    },
    changelog: {
      description:
        "sola の git log — GitHub 履歴のコミット、ファイルツリー、パッチ。",
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
    present: "現在",
    back: "戻る",
    overview: "概要",
    a11y: {
      openMenu: "メニューを開く",
      closeMenu: "メニューを閉じる",
      primaryNav: "メインナビゲーション",
      toggleLanguage: "言語を切り替える",
      toggleTheme: "テーマを切り替える",
      commandPalette: "コマンドパレット",
      commandPaletteHint: "コマンドを検索…",
      scrollToTop: "トップへ戻る",
    },
    menu: {
      themes: "テーマ",
      customThemes: "カスタムテーマ",
      background: "背景",
    },
    diff: {
      showDiff: "git diff を表示",
      exit: "git diff を非表示",
      hint: "現在のページを最後に変更したコミットを表示します。",
      deployed: "このデプロイの元になったコミットです。",
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
    copied: "コピーしました。",
    copyCode: "コードをコピー",
    copyFailed: "コピーできませんでした。",
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
    sourcePrivate: "ソースコードは非公開です。",
    sourcePrivateClient:
      "クライアント向けに制作したため、ソースコードは非公開です。",
    linkPrivate: "ライブアプリは非公開です。",
    linkPrivateClient:
      "クライアントの社内で使われているため、ライブアプリは非公開です。",
    demo: "デモ",
    moreProjects: "他のプロジェクト",
    onThisPage: "目次",
    linkToSection: "セクションへのリンク: {title}",
    close: "閉じる",
    expandImage: "画像を拡大",
    expandImageNamed: "画像を拡大: {alt}",
    expandedImage: "拡大画像",
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
    lastEvents: "直近{count}件",
    noActivity: "最近のアクティビティはありません",
    loadError: "最近のアクティビティを読み込めませんでした",
    checkBack: "後でもう一度ご確認ください",
    moreSuffix: "件",
    commit: "{count}件のコミット",
    commits: "{count}件のコミット",
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
    nameSwitch: "名前を切り替える",
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
    viewDetails: "詳細を見る",
    viewGithub: "コードを見る",
    sortBy: "並べ替え",
    sortOptions: {
      featured: "おすすめ",
      newest: "新しい順",
      oldest: "古い順",
      name: "名前（A–Z）",
    },
    kind: {
      label: "プロジェクトの種類",
      all: "すべて",
      personal: "個人",
      commercial: "商用",
    },
    empty: "まだ何もありません",
    emptyDescription:
      "この種類のプロジェクトは、公開され次第ここに表示されます。",
    visitProject: "プロジェクトを見る",
    list: {
      codeExtractor: {
        title: "ウェブサイトコード抽出ツール",
        tagline: "どんなサイトのコードも ZIP ひとつに",
        description:
          "[Website Code Extractor](https://chromewebstore.google.com/detail/website-code-extractor/foppgeakfpkdghmmmflmblcidoofpohm) は、Web サイトの HTML、CSS、JavaScript、画像をフォルダ構成を保ったまま 1 つの ZIP ファイルとしてダウンロードする Chrome / Edge 拡張機能です。ワンクリックで、設定は不要です。Chrome ウェブストアで 6000 人のユーザーがいて、静的なサイトでもっともよく動作します。",
      },
      applicare: {
        title: "AppliCare",
        tagline: "すべての応募をひとつの場所で",
        description:
          "[AppliCare](https://applicare.app) は就職・転職活動の応募状況を管理するアプリです。応募ごとに「応募済み」から「内定」までのステータスを記録し、期限つきのタスクを紐づけ、成功率と推移のグラフが並ぶダッシュボードで進み具合を確認できます。React、Ant Design、Spring Boot、MongoDB で構築しました。",
      },
      osint: {
        title: "OSINT ウェブサイト",
        tagline: "調査スキルを磨く",
        description:
          "[OSINT Exercises](https://osint.ysz.life) は、公開情報から情報を見つけ出すオープンソース・インテリジェンス（OSINT）を練習するためのサイトです。各演習には背景説明といくつかの課題があり、難易度は初級からエキスパートまで。新しい演習は誰でもサイトから投稿できます。",
      },
      chatapp: {
        title: "ChatApp",
        tagline: "Spring Boot製のリアルタイムチャット",
        description:
          "ChatApp はリアルタイムのチャットプラットフォームです。アカウントを作成してメールアドレスを確認すれば、自分で作ったルームや参加したルームで会話できます。メッセージは WebSocket でやり取りされ、裏側では Spring Boot と MongoDB が動いています。学校のモジュールの課題として制作しました。",
      },
      vmDetector: {
        title: "仮想マシン検出ツール",
        tagline: "仮想マシン上かどうかを判定",
        description:
          "自分が仮想マシンの中で動いているかどうかを判定する、小さな Java 製ツールです。BIOS、CPU、ネットワークカードの MAC アドレス、Windows レジストリを調べ、ハイパーバイザーが残す痕跡を探します。",
      },
      viewCounter: {
        title: "ビューカウンター",
        tagline: "Redisで動くページビューカウンター",
        description:
          "ページの閲覧数カウンターです。トップページが開かれるたびに 1 ずつ増え、カウントは Redis に保存されるので再起動しても消えません。Java の Web アプリで Redis をどう使うかを学ぶための、小さな Spring Boot プロジェクトです。",
      },
      dockerService: {
        title: "Dockerサービスデプロイメント",
        tagline: "ComposeでMediaWiki・Nextcloud・Gogsを構築",
        description:
          "MediaWiki、Nextcloud、Gogs を並べて動かす Docker Compose 構成です。データは永続化され、Portainer で監視します。Benicio Von Felten と一緒に構築し、ドキュメントを書いた学校のプロジェクトです。",
      },
      phishing: {
        title: "フィッシングウェブサイトチュートリアル",
        tagline: "フィッシングページの仕組みを学ぶ",
        description:
          "フィッシングページがどのように作られているかを順を追って解説し、実物を見たときに見抜けるようにするためのチュートリアルです。教育目的に限ります。",
      },
      otw: {
        title: "OverTheWireガイド",
        tagline: "Banditをレベルごとに攻略",
        description:
          "[OverTheWire の Bandit](https://overthewire.org/wargames/bandit/) というウォーゲームを、レベルごとに解説した攻略ガイドです。各レベルで必要になる Linux コマンドの簡単な紹介もついています。",
      },
      sola: {
        title: "Sola",
        tagline: "ReactとTypeScriptで作るモダンなポートフォリオ",
        description:
          "Sola は私の個人サイトです。React・TypeScript・Tailwind CSS で構築し、プロジェクトやスキル、経験をクリーンかつモダンに紹介します。",
      },
      kinoa: {
        title: "Kinoa",
        tagline: "無料でストリーミング、ノイズなし",
        description:
          "[Kinoa](https://kinoa.to) は映画とドラマの無料ストリーミングサイトです。トレンドを眺めて作品を開き、同じページでそのまま再生できます。アカウントは不要で、ログインすればウォッチリストと視聴履歴が端末間で同期されます。Next.js、Supabase、TMDB のデータで構築しました。",
      },
      self: {
        title: "Self",
        tagline: "Windows向けに再構築したNeofetch",
        description:
          "Self は、Linux の Neofetch のように、システム情報を画像や ASCII アートと並べてターミナルに表示する Windows 向けツールです。PowerShell のコマンド 1 つでインストールでき、画像はカラーブロックまたは点字で描画され、テーマも設定できます。Python で書かれています。",
      },
      taco: {
        title: "Taco",
        tagline: "犬のサイトを、再利用できるテンプレートとして",
        description:
          "[Taco](https://takitwo.vercel.app) は兄の犬を紹介するサイトで、使い回せるテンプレートとして作りました。英語・スペイン語・日本語のページと言語の自動判定、ブログ、ギャラリー、問い合わせページがあります。Next.js、TypeScript、Tailwind CSS で構築しました。",
      },
      thoughts: {
        title: "Thoughts",
        tagline: "思索、断片、そしてメモ",
        description:
          "[Thoughts](https://thoughts.ysz.life) は、このポートフォリオとは別に、考えたことや断片、メモを書き留めている小さなサイトです。記事は MDX ファイルで、ゲストブックには訪れた人が自分の言葉を残せます。[Shu Ding](https://shud.in) さんの個人サイトに影響を受けました。",
      },
      magi: {
        title: "magi",
        tagline: "正確さを重視した非同期ポートスキャナ",
        description:
          "[magi](https://magi.ysz.life) は Rust で書かれた高速な TCP/UDP ポートスキャナーです。通常の接続でスキャンするので root は不要で、実際に観測したことだけを報告します。テストできなかったポートは closed ではなく untestable と表示されます。Linux、macOS、Windows にコマンド 1 つでインストールできます。",
      },
      luma: {
        title: "Luma",
        tagline: "自分のキーで、どのモデルとも",
        description:
          "[Luma](https://luma.ysz.life) は主要な AI モデルをまとめて使えるチャットアプリです。自分の API キーを登録すれば、ひとつの会話の中で Claude、GPT、Gemini、Grok などを切り替えられます。過去のメッセージを編集すると会話が分岐し、どちらの流れも残ります。キーは暗号化してから保存されます。",
      },
      perspectas: {
        title: "perspectas.ch",
        tagline: "黄色い点を軸にしたコンサルティングサイト",
        description:
          "チューリッヒ近郊のコンサルティング・採用支援会社 [perspectas gmbh](https://www.perspectas.ch) のウェブサイトを、Next.js と Sanity で作り直しました。テキストも画像もすべて CMS にあるため、2 人のパートナーが自分たちで変更を公開できます。デザインのアクセントはひとつだけで、ロゴの黄色い点が見出しの句点も兼ねています。",
      },
      ura: {
        title: "Ura",
        tagline: "オフラインで許可も分かるスノーモービル・ナビ",
        description:
          "Ura はフィンランド・ラップランド向けのスノーモービル用ナビで、iOS と Android に対応しています。2595 本のルートと、給油所・カフェ・山小屋など 3388 か所を端末に保存するので、電波の届かない場所でも使えます。いまルート上にいるかどうか、そのルートが自由に走れるのか、先に許可が必要なのかを教えてくれます。",
      },
      montu: {
        title: "Montu",
        tagline: "GPXから地図と標高を描く山行記録",
        description:
          "[Montu](https://montu.ch) はスイスドイツ語の山行記録サイトで、自分でツアーを書き写真を撮るクライアントのために制作しました。GPX ファイルをアップロードすると、ページが地形図上のルートと標高プロファイルを描きます。ツアーも写真もその他のテキストも CMS で編集できるので、新しいツアーの公開に開発者は必要ありません。",
      },
      qr: {
        title: "QR",
        tagline: "装飾したQRコードを、その場でスキャン検証",
        description:
          "[qr.ysz.life](https://qr.ysz.life) は、すべてブラウザ内で動作する QR コードジェネレーターです。ドットやコーナーのスタイルを選び、グラデーションやロゴを加えて、PNG・SVG・JPEG・WebP で書き出せます。内蔵のスキャンテストが完成したコードを読み取り直すので、印刷する前にちゃんと読み取れることを確認できます。",
      },
      vault: {
        title: "Vault",
        tagline: "KeycloakとFastAPI、realmはTerraformで定義",
        description:
          "Vault は OpenID Connect を学ぶためのローカルサンドボックスです。Keycloak がトークンを発行し、FastAPI のサービスがそれを検証し、Next.js のフロントエンドがロールで制限されたダッシュボードを表示します。ID 設定は Terraform で宣言されているので、コマンド 1 つで全体を壊して作り直せます。",
      },
      fleetmap: {
        title: "fleetmap",
        tagline: "配送車のGPSを事務所のモニターへ",
        description:
          "fleetmap は配送車両のライブマップです。各車両のスマートフォンが位置を送信し、オフィスの画面に全車両の動きが停車地・ETA・遅延とともに表示されます。過去の任意の日を、記録された走行データから再生できます。Next.js、Supabase、MapLibre で構築しました。",
      },
    },
  },
  skills: {
    title: "スキル",
    subtitle: "日常的に使用している技術とツール。",
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
  colophon: {
    title: "このサイトができるまで",
    lede: "本の巻末には、どう作られたかを記した奥付があります。ここは、このサイトの奥付です。",
    built:
      "[React](https://react.dev) と [TypeScript](https://www.typescriptlang.org) のアプリで、保存から画面までの距離を消すために [Vite](https://vite.dev) で組んでいます。色と余白は [Tailwind CSS](https://tailwindcss.com) と [shadcn/ui](https://ui.shadcn.com) — トークンだけ、生のパレットは使いません。動くものは、界面が [Motion](https://motion.dev)、空が [GSAP](https://gsap.com)。時計は二つ。ボタンが背景の拍を借りないように。",
    faces:
      "書体は、本文が [Onest](https://fonts.google.com/specimen/Onest)、名前が [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque)、コードが [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)、そしてこの頁の墨が [Shippori Mincho B1](https://fonts.google.com/specimen/Shippori+Mincho+B1)。住まいは [Vercel](https://vercel.com)。源は [GitHub](https://github.com/lyfe691/sola)。",
    close: "チューリッヒにて、手組み。ご覧いただきありがとうございます。",
    back: "戻る",
  },
  changelog: {
    title: "Changelog",
    subtitle:
      "このサイトのライブな git 履歴。コミットを開くとメッセージ、ファイルツリー、パッチを読めます。",
    empty: "表示するコミットはありません。",
    error: "git 履歴を読み込めませんでした。",
    retry: "再試行",
    older: "さらに読み込む",
    viewOnGitHub: "GitHub で見る",
    thisDeploy: "このデプロイ",
    truncated: "diff は省略されています。完全なコミットは GitHub で。",
    unavailable: "パッチは省略（バイナリまたはサイズ超過）。",
    files: "{count} ファイル",
    expand: "コミットを表示",
    collapse: "コミットを非表示",
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
    changelog: "Changelog",
  },
  about: {
    title: "私について",
    intro:
      "ヤニス・セバスチャン・ズルヒャー（Yanis Sebastian Zürcher）。18歳、チューリッヒ在住のソフトウェア開発者です。[WISS](https://www.wiss.ch)でコンピュータサイエンスを2年間学びました。その一環として、[nadlo](https://nadlo.ch)でインターンシップをしており、2027年7月まで続きます。",
    hobbies:
      "フルスタックで仕事をしています。でも楽しいのはUIとデザインです。見た目と使い心地を考えるのが好きで、仕事のなかで本当に時間を使いたいのはそこです。",
    philosophy: {
      title: "働き方",
      clean:
        "半年後も読めるコードがいい。賢い書き方は、退屈になるまで書き直します。",
      simplicity:
        "説明に段落が要る機能は、たぶん機能が二つ。残りが当たり前になるまで削ります。",
      learning:
        "まだ作れない次のものを作って学びます。ドキュメント、リポジトリ、公開で壊すこと。",
    },
    interests: {
      title: "興味",
      nature: {
        title: "アウトドア",
        description:
          "できるだけ定期的に外に出るようにしています。主にハイキングで、ときどき行き先のない長い散歩もします。スイスに住んでいるとそれがしやすく、アルプスも近いです。画面の前に長くいたあと、トレイルで数時間過ごすのは、頭をリセットするのにとても向いています。",
      },
      tech: {
        title: "オープンソース",
        description:
          "オープンソースへの貢献は、本当に気になるプロジェクトがあるときに限っています。チェックリストのためではありません。内容はだいたいパフォーマンス、アクセシビリティ、あるいは日常的に使っているツールの小さな使い勝手の改善です。",
      },
      learning: {
        title: "学習",
        description:
          "学校の外でも、本・ドキュメント・必要ならコースを混ぜながら学び続けています。最近はシステム寄りの話と、ブラウザが内部でどう動いているかが中心で、その知識はそのまま自分のプロダクトに返ってきます。",
      },
      workspace: {
        title: "環境",
        description:
          "机まわりは意図的にシンプルです。モニタ二枚、メカニカルキーボード、それ以外はあまり置きません。ガジェットを集めるより、邪魔にならない環境のほうが大事で、座ったらすぐ作業に入れるようにしています。",
      },
    },
    testimonials: {
      title: "一緒に働いた人から",
      link: "一緒に働く",
      viewMore: "もっと見る",
      visitWebsite: "ウェブサイトを見る",
      website: "ウェブサイト",
      roleAtCompany: "{company}・{role}",
      viewLinkedIn: "LinkedIn を見る",
      modalTitle: "推薦文",
      modalDescription: "{author} からの全文推薦",
      items: {
        koenitzer: {
          quote:
            "ソフトウェアエンジニアリング（IT）のすべての科目で Yanis と一緒に働けたのは、本当に印象的な経験でした。彼の技術力、信頼性、問題解決能力は別次元でした。本当に卓越した開発者であり、最高のチームメイトです。",
          role: "インターン",
        },
        bichsel: {
          quote:
            "Yanis と一緒に働けたのは素晴らしい経験でした。すべての科目で私を支え、複雑な問題にいつも創造的な解決策をもたらし、すべてを期限どおりに仕上げてくれました。本当に卓越した開発者です。",
          role: "学生",
        },
        venzin: {
          quote:
            "Yanis は技術力とデザインセンスを兼ね備えた、まれな人材です。彼が私たちのために作った WISS Forum はあらゆる期待を超え、オンラインでの存在感を大きく高めてくれました。",
          role: "講師",
        },
      },
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
      clean: "読めるコード",
      simplicity: "足すより減らす",
      learning: "作って学ぶ",
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
      subject: "カスタム開発のご相談",
      message:
        "Yanisさん\n\n標準のサービスカテゴリに当てはまらない特別な要件があります。カスタムソリューションについてご相談したいです。\n\nプロジェクトの詳細:\n- \n- \n- \n\nご連絡をお待ちしています。",
    },
  },
  errorBoundary: {
    title: "問題が発生しました",
    message:
      "予期しないエラーが発生しました。ページを再読み込みすると解決することがほとんどです。",
    reload: "再読み込み",
  },
} satisfies Translation;
