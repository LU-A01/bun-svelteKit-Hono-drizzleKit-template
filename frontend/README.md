# フロントエンド (SvelteKit)

このディレクトリにはSvelteKit + TailwindCSSを使用したフロントエンド実装が含まれています。

## 技術スタック

- **フレームワーク**: SvelteKit v2.19.0
- **UIライブラリ**: TailwindCSS v4.0
- **状態管理**: Svelte Runes ($state, $derived)
- **API通信**: Fetch API

## ディレクトリ構造

```txt
frontend/
├── src/
│   ├── lib/            # 共通コンポーネントとロジック
│   │   ├── components/ # UIコンポーネント
│   │   │   ├── ui/     # 基本UIコンポーネント (Button, Card, Input 等)
│   │   │   ├── layout/ # レイアウト関連コンポーネント (Header, ThemeToggle 等)
│   │   │   └── todo/   # Todo関連のコンポーネント
│   ├── routes/         # ページルート
│   └── app.css         # グローバルスタイルとテーマ変数
└── static/             # 静的ファイル
```

## テーマシステム

アプリケーションはCSSカスタムプロパティ（変数）を使用したテーマシステムを実装しています。

### テーマ変数

`app.css`でテーマ変数が定義されています：

```css
:root {
  /* ライトモード用の変数 */
  --color-bg-primary: #f9fafb;
  --color-bg-secondary: #ffffff;
  --color-bg-accent: #0d99ff;
  /* 他の変数... */
}

.dark {
  /* ダークモード用の変数 */
  --color-bg-primary: #1e1e1e;
  --color-bg-secondary: #252525;
  /* 他の変数... */
}
```

### テーマ変数の使用方法

#### Tailwindユーティリティクラスでの使用

基本ユーティリティクラス:
```html
<div class="bg-theme-primary text-theme-secondary border-theme"></div>
```

#### ホバー効果での使用

ホバー効果を実装するには、以下のように直接CSS変数を参照します：

```html
<button class="hover:bg-[var(--color-bg-button-hover)]">ボタン</button>
```

> **注意**: `hover:bg-theme-button-hover`のような間接参照は正しく機能しないため、必ず`hover:bg-[var(--color-bg-button-hover)]`のような直接参照を使用してください。

## テーマの切り替え

アプリケーションはライトモード、ダークモード、システム設定に基づく自動切り替えをサポートしています。

```javascript
// ダークモードの切り替え
function toggleDarkMode() {
  darkMode = !darkMode;
  document.documentElement.classList.toggle('dark', darkMode);
  localStorage.setItem('darkMode', darkMode.toString());
}
```

## コンポーネント一覧

主要なUIコンポーネント：

- **Button**: 一般的なボタン
- **Card**: コンテンツを包むカードコンポーネント
- **Input**: フォーム入力要素
- **Checkbox**: カスタムスタイルのチェックボックス
- **ThemeToggle**: テーマ切り替えボタン
- **TodoItem**: Todoアイテムの表示と操作

## 開発

```bash
# 開発サーバーの起動
bun run dev

# プロダクションビルド
bun run build
```

## トラブルシューティング

### ホバー効果が機能しない場合

Tailwindでテーマ変数を使用したホバー効果が機能しない場合は、以下の形式を使用してください：

```html
<!-- 推奨 -->
<button class="hover:bg-[var(--color-bg-button-hover)]">ボタン</button>

<!-- 機能しない -->
<button class="hover:bg-theme-button-hover">ボタン</button>
```
