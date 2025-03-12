# E2Eテスト

このディレクトリにはSvelte Todoアプリケーションに対するE2E（エンドツーエンド）テストが含まれています。これらのテストはPlaywrightを使用して実装され、実際のブラウザ環境でアプリケーション全体の機能をテストします。

## テスト実行方法

E2Eテストを実行するには、以下のコマンドを使用します：

```bash
# プロジェクトルートから実行
bun run test:e2e

# または、frontendディレクトリ内で直接実行
cd frontend && bun run test:e2e
```

`test:e2e`コマンドは自動的にバックエンドを起動し、準備ができるのを待ってからテストを実行します。

## デバッグ方法

テストが失敗した場合は、以下の方法でデバッグできます：

```bash
# デバッグモードでテストを実行
cd frontend && bunx playwright test --debug

# 特定のテストファイルのみ実行
cd frontend && bunx playwright test todo.test.ts

# UIモードでテストを実行（対話的な操作が可能）
cd frontend && bunx playwright test --ui
```

## テスト結果の確認

テスト実行後にレポートを表示するには：

```bash
cd frontend && bunx playwright show-report
```

## トラブルシューティング

1. **バックエンドの接続問題**

E2Eテストは実際のバックエンドAPIと通信するため、バックエンドが起動していることを確認してください。バックエンドの状態を確認するには：

```bash
curl http://localhost:3000/health
```

2. **セレクターがマッチしない問題**

テスト内のセレクターが要素を見つけられない場合は、Playwrightのデバッグツールを使って要素を検証します：

```bash
cd frontend && bunx playwright codegen http://localhost:5173
```

3. **テスト実行が遅い場合**

テストを並列実行するために、playwright.config.tsの設定を調整できます：

```typescript
// playwright.config.ts
export default defineConfig({
  // ...
  workers: 3, // 並列実行するワーカー数を増やす
  // ...
});
```

## CI/CD統合

GitHub Actionsでの自動テスト実行は`.github/workflows/e2e.yml`で設定されています。このワークフローは以下の手順を実行します：

1. バックエンドの起動と健全性確認
2. フロントエンドの起動
3. E2Eテストの実行
4. 失敗時のスクリーンショットとログの収集 