# oazo合同会社 コーポレートサイト

大阪・大東市を拠点とするアパレル試作縫製・二次加工・卸売企業「[oazo合同会社](https://oazo-oazo.com)」のコーポレートサイト。**Astro × Cloudflare Pages** による高速・高SEO・低運用コストの静的サイトとして構築してございます。

---

## 採用技術

| 領域 | 採用技術 |
|------|---------|
| フレームワーク | [Astro 4.x](https://astro.build/) |
| ホスティング | [Cloudflare Pages](https://pages.cloudflare.com/) |
| お問い合わせフォーム | Cloudflare Pages Functions + [Resend](https://resend.com/) API |
| OGP画像生成 | [sharp](https://sharp.pixelplumbing.com/)（SVG→PNG自動変換） |
| サイトマップ | [@astrojs/sitemap](https://docs.astro.build/ja/guides/integrations-guide/sitemap/) |
| フォント | Noto Sans JP / Nunito（Google Fonts） |

---

## 制作方針と技術的ハイライト

### 🚀 パフォーマンス
- 完全静的出力＋Cloudflare CDN配信
- ページ重量の軽量化（画像ナシ・SVG＋CSSグラデーションで世界観構築）
- HTML圧縮・CSSインライン化・アセットの長期キャッシュ制御

### 🔍 SEO
- 構造化データ: `Organization` / `BreadcrumbList` / `FAQPage`
- sitemap.xml 自動生成
- OGP・Twitter Card 対応（1200×630 自動生成）
- canonical URL ・robots meta 完備

### ♿ アクセシビリティ
- skip-link（キーボードユーザー向けスキップナビ）
- `:focus-visible` で全対話要素にフォーカス可視化
- `prefers-reduced-motion` でモーション制御を尊重
- モバイルメニュー：`aria-expanded` / Escキー閉じ / 背景オーバーレイ

### 🔒 セキュリティ
- Content-Security-Policy・Strict-Transport-Security・X-Frame-Options 等のHTTPヘッダー設定
- お問い合わせフォーム：サーバーサイドバリデーション＋入力サニタイズ
- 秘密情報は環境変数で管理（リポジトリに一切含まない）

---

## ページ構成（全8ページ）

| パス | 内容 |
|------|------|
| `/` | トップページ（ヒーロー＋事業三本柱ナビ） |
| `/about/` | 会社概要・代表メッセージ |
| `/services/` | 事業内容（試作縫製・二次加工・卸売） |
| `/strengths/` | 選ばれる理由（4つの強み） |
| `/process/` | ご依頼の流れ（5ステップ） |
| `/faq/` | よくあるご質問 |
| `/contact/` | お問い合わせフォーム |
| `/404.html` | カスタム404ページ |

---

## ローカル開発

### 必要環境
- Node.js 20 以上
- npm 10 以上

### セットアップ

```bash
npm install
npm run dev      # http://localhost:4321
```

### ビルド

```bash
npm run build    # dist/ に本番用ファイルを出力
npm run preview  # ビルド成果物をローカル確認
```

### OGP画像の再生成

```bash
npm run build:og  # scripts/og-image.svg → public/og-image.png
```

---

## デプロイ（Cloudflare Pages）

### 1. GitHub連携

Cloudflare Dashboard → **Workers & Pages** → **Create a project** → **Connect to Git** → リポジトリを選択

### 2. ビルド設定

| 項目 | 値 |
|------|------|
| Framework preset | **Astro** |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | （空欄） |

### 3. 環境変数の設定

**Settings** → **Environment variables** で以下を設定：

| 変数名 | 必須 | 内容 |
|--------|------|------|
| `RESEND_API_KEY` | ✅ | [Resend](https://resend.com/) で発行した API キー |
| `CONTACT_FROM` | 任意 | 送信元アドレス（例: `oazo contact <noreply@oazo-oazo.com>`） |
| `CONTACT_TO` | 任意 | 受信先アドレス（デフォルト: `oazo.tamura@gmail.com`） |

### 4. 独自ドメイン接続

**Custom domains** → `oazo-oazo.com` を追加 → Cloudflare DNS に自動設定

---

## ディレクトリ構成

```
oazo-website/
├── src/
│   ├── components/      # Nav / Footer / CtaBand など共通部品
│   ├── layouts/         # Base レイアウト（SEO・構造化データ集約）
│   ├── pages/           # 各ページ（ファイルパスがそのままURLに）
│   └── styles/          # global.css（カラーシステム・共通スタイル）
├── functions/
│   └── api/
│       └── contact.js   # お問い合わせフォーム Pages Function
├── public/              # 静的ファイル（_headers, robots.txt, og-image.png）
├── scripts/             # ビルド補助スクリプト（OGP生成など）
├── astro.config.mjs     # Astro 設定（sitemap integration 含む）
└── package.json
```

---

## 制作

- **Design & Development**: ito — Celestial Stories HP制作部
- **Tooling**: Claude Code（開発補助）
- **Launch**: 2026年

お問い合わせ・類似案件のご相談は [oazo-oazo.com/contact/](https://oazo-oazo.com/contact/) へ。

---

© 2026 oazo合同会社 All rights reserved.
