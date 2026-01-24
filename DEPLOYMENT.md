# Cloudflare Pages デプロイメントガイド

このプロジェクトは Cloudflare Pages にデプロイするように設定されています。

## 自動デプロイメント (推奨)

### GitHub連携による自動デプロイ

1. **Cloudflare Dashboardにアクセス**
   - https://dash.cloudflare.com/ にログイン
   - "Workers & Pages" を選択

2. **新しいプロジェクトを作成**
   - "Create application" → "Pages" → "Connect to Git" を選択
   - GitHubアカウントを接続
   - `Alpha9n/hew-yacht` リポジトリを選択

3. **ビルド設定**
   以下の設定を入力してください：

   ```
   Production branch: main (またはデプロイしたいブランチ)
   
   Build command: npm run build
   Build output directory: dist
   
   Environment variables:
   NODE_VERSION = 20
   ```

4. **デプロイ開始**
   - "Save and Deploy" をクリック
   - 自動的にビルドとデプロイが開始されます

### 自動デプロイの動作

- `main` ブランチへのプッシュで自動的に本番環境にデプロイ
- プルリクエストごとにプレビュー環境を自動生成
- ビルドエラーがあればデプロイは停止

## 手動デプロイメント

### 前提条件

```bash
# Wranglerのインストール
npm install -g wrangler

# Cloudflareにログイン
wrangler login
```

### デプロイ手順

1. **ビルドの実行**
   ```bash
   npm run build
   ```

2. **デプロイ**
   ```bash
   npm run pages:deploy
   # または
   wrangler pages deploy dist
   ```

3. **プロジェクト名の設定（初回のみ）**
   初回デプロイ時にプロジェクト名を聞かれます：
   ```
   ? Enter the name of your new project: hew-yacht
   ```

## Wrangler設定 (`wrangler.toml`)

プロジェクトには `wrangler.toml` が含まれており、以下の設定が含まれています：

```toml
name = "hew-yacht"
compatibility_date = "2024-12-13"

[site]
bucket = "./dist"

[build]
command = "npm run build"
cwd = "."

[build.upload]
format = "service-worker"
dir = "./dist"
```

## ビルド設定の詳細

### Vite設定

`vite.config.js` は React アプリケーション用に設定されています：

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### 出力ディレクトリ

- ビルド出力: `dist/`
- 静的アセット: `public/` → `dist/` にコピー

### 環境変数

必要に応じて Cloudflare Pages の環境変数を設定できます：

1. Cloudflare Dashboard → Pages → プロジェクト → Settings → Environment variables
2. 変数を追加（例：API_KEY, API_URLなど）

## トラブルシューティング

### ビルドエラー

**問題**: Node.js バージョンが古い

```
Error: The engine "node" is incompatible with this module
```

**解決策**:
- `.node-version` ファイルで Node 20 が指定されています
- Cloudflare Pages の環境変数で `NODE_VERSION = 20` を設定

### ルーティングエラー

**問題**: React Router が404を返す

**解決策**:
Cloudflare Pages は自動的に SPA のルーティングを処理しますが、
必要に応じて `_redirects` ファイルを作成：

```bash
# public/_redirects
/* /index.html 200
```

### アセットが見つからない

**問題**: 画像やフォントが読み込めない

**解決策**:
- アセットは `public/` ディレクトリに配置
- パスは絶対パス（`/images/...`）を使用
- `src/styles/` のCSSで画像パスが正しいか確認

## カスタムドメイン

1. Cloudflare Pages Dashboard → プロジェクト → Custom domains
2. "Set up a custom domain" をクリック
3. ドメイン名を入力
4. DNS設定を確認・更新

## パフォーマンス最適化

Cloudflare Pages では以下が自動的に提供されます：

- ✅ グローバルCDN
- ✅ 自動HTTPS
- ✅ HTTP/2 & HTTP/3
- ✅ 自動圧縮（Brotli, Gzip）
- ✅ DDoS保護

## プレビューデプロイメント

プルリクエストごとに自動的にプレビューURLが生成されます：

```
https://[commit-hash].hew-yacht.pages.dev
```

- プルリクエストのコメントにURLが投稿されます
- 本番環境に影響を与えずにテスト可能

## ロールバック

1. Cloudflare Pages Dashboard → プロジェクト → Deployments
2. 過去のデプロイメントを選択
3. "Rollback to this deployment" をクリック

## 参考リンク

- [Cloudflare Pages ドキュメント](https://developers.cloudflare.com/pages/)
- [Wrangler CLI リファレンス](https://developers.cloudflare.com/workers/wrangler/)
- [Vite デプロイメントガイド](https://vitejs.dev/guide/static-deploy.html)

## サポート

デプロイメントに関する問題は以下で報告してください：

- GitHub Issues: https://github.com/Alpha9n/hew-yacht/issues
- Cloudflare Community: https://community.cloudflare.com/
