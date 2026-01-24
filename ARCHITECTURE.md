# アーキテクチャ設計書

## システム概要

このプロジェクトは、将来的なマルチプレイヤー対応を想定したReactベースのヨットダイスゲームです。

## アーキテクチャ図

```
┌─────────────────────────────────────────────────────────┐
│                    Browser / Client                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │              React Application                     │ │
│  │                                                    │ │
│  │  ┌──────────────┐        ┌──────────────────┐    │ │
│  │  │    Router    │        │   GameContext    │    │ │
│  │  │ (react-router)│───────│  (State Mgmt)    │    │ │
│  │  └──────────────┘        └──────────────────┘    │ │
│  │         │                         │               │ │
│  │         ├─── Home Page            │               │ │
│  │         └─── Game Page ───────────┘               │ │
│  │                 │                                 │ │
│  │                 ├─── ScoreBoard                   │ │
│  │                 ├─── DiceArea                     │ │
│  │                 ├─── TurnInfo                     │ │
│  │                 └─── ResultScreen                 │ │
│  │                                                    │ │
│  └────────────────────────────────────────────────────┘ │
│                         │                                │
│                         ▼                                │
│  ┌────────────────────────────────────────────────────┐ │
│  │             Game Logic Layer                       │ │
│  │                                                    │ │
│  │  ┌────────────────┐    ┌──────────────────────┐  │ │
│  │  │  handJudge.js  │    │   gameLogic.js       │  │ │
│  │  │  (役判定)       │    │  (ゲームロジック)     │  │ │
│  │  └────────────────┘    └──────────────────────┘  │ │
│  │                                                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
└─────────────────────────────────────────────────────────┘
                          │
                          │ (将来の拡張)
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 Network Layer (未実装)                    │
│  ┌────────────────────────────────────────────────────┐ │
│  │  WebSocket / HTTP Client                           │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               Backend Server (未実装)                     │
│  ┌────────────────────────────────────────────────────┐ │
│  │  - Room Management                                 │ │
│  │  - Player Matching                                 │ │
│  │  - Game State Sync                                 │ │
│  │  - Database                                        │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## レイヤー構成

### 1. Presentation Layer (UI層)

**責務**: ユーザーインターフェースの表示とユーザー操作の受付

**コンポーネント**:
- `src/pages/`: ページレベルのコンポーネント
  - `Home.jsx`: メニュー画面
  - `Game.jsx`: ゲーム画面のコンテナ
- `src/components/`: 再利用可能なUIコンポーネント
  - `ScoreBoard.jsx`: 得点表示
  - `DiceArea.jsx`: サイコロ操作UI
  - `TurnInfo.jsx`: ターン情報表示
  - `ResultScreen.jsx`: 結果画面

### 2. State Management Layer (状態管理層)

**責務**: アプリケーション全体の状態管理

**実装**:
- `src/contexts/GameContext.jsx`
  - React Context APIを使用
  - ゲーム状態の一元管理
  - アクション（サイコロを振る、スコア登録など）の提供

**状態構造**:
```javascript
{
  gameMode: 'local' | 'online',
  currentPlayer: 1 | 2,
  turnNum: number,
  rollRemain: number,
  hand: number[],          // 手持ちのサイコロ
  field: number[],         // フィールドのサイコロ
  player1Scores: Object,   // プレイヤー1のスコア
  player2Scores: Object,   // プレイヤー2のスコア
  tempScores: Object,      // 仮スコア
  gameStarted: boolean,
  gameEnded: boolean,
  winner: string | null
}
```

### 3. Business Logic Layer (ビジネスロジック層)

**責務**: ゲームルールとロジックの実装

**モジュール**:
- `src/utils/handJudge.js`
  - 役の判定ロジック
  - 各役のスコア計算
  - UIに依存しない純粋関数

- `src/utils/gameLogic.js`
  - サイコロ操作ロジック
  - ゲーム進行制御
  - スコア計算補助関数

## データフロー

### ローカルゲームモード

```
User Action (サイコロを振る)
    ↓
Component Event Handler
    ↓
GameContext Action (handleRollDice)
    ↓
Game Logic (rollDice)
    ↓
State Update (setField)
    ↓
Component Re-render
```

### スコア登録フロー

```
User Click (役を選択)
    ↓
ScoreBoard onClick Handler
    ↓
GameContext.registerScore(handName)
    ↓
├─ Validate (already scored?)
├─ Calculate Score (tempScores[handName])
├─ Update Player Scores
├─ Switch Player
└─ Check Game Over
    ↓
Component Re-render
```

## マルチプレイヤー対応のための設計

### 現在の構造の利点

1. **ゲームロジックとUIの分離**
   - `utils/`のロジックはUIに依存しない
   - サーバーサイドでも同じロジックを再利用可能

2. **状態の構造化**
   - プレイヤーごとに独立した状態管理
   - 複数プレイヤーへの拡張が容易

3. **モード切り替え機構**
   - `gameMode`による動作の切り替え
   - 条件分岐でローカル/オンラインを制御

### 将来の拡張計画

#### Phase 1: ネットワーク層の追加

```javascript
// src/services/NetworkService.js
class NetworkService {
  constructor() {
    this.socket = null;
  }

  connect(roomId) {
    this.socket = new WebSocket(`wss://server/rooms/${roomId}`);
    // イベントハンドラーの設定
  }

  sendAction(action) {
    this.socket.send(JSON.stringify(action));
  }

  onGameStateUpdate(callback) {
    this.socket.on('state', callback);
  }
}
```

#### Phase 2: GameContextの拡張

```javascript
// GameContext.jsx に追加
const [networkService, setNetworkService] = useState(null);

useEffect(() => {
  if (gameMode === 'online' && networkService) {
    networkService.onGameStateUpdate((newState) => {
      // サーバーからの状態更新を反映
      updateGameState(newState);
    });
  }
}, [gameMode, networkService]);
```

#### Phase 3: バックエンドAPI

予定されるエンドポイント:
- `POST /api/rooms` - ルーム作成
- `GET /api/rooms` - ルーム一覧
- `POST /api/rooms/:id/join` - ルーム参加
- `WebSocket /ws/rooms/:id` - リアルタイム通信

## セキュリティ考慮事項

### 現在のローカルゲーム
- XSS対策: Reactの自動エスケープ
- CSP (Content Security Policy) の設定可能

### 将来のオンライン機能
- 認証・認可の実装
- ゲーム状態の検証（サーバーサイド）
- レート制限
- 不正操作の検知

## パフォーマンス最適化

### 現在の最適化
- React.memo による不要な再レンダリング防止（必要に応じて）
- useCallback によるコールバックの最適化
- Vite の高速ビルド

### 将来の最適化案
- Code Splitting (react-router の lazy loading)
- Service Worker によるオフライン対応
- アニメーションの最適化

## テスト戦略

### ユニットテスト
- `utils/` のロジック関数
- `handJudge.js` の各役判定メソッド
- `gameLogic.js` の計算関数

### 統合テスト
- GameContext の状態遷移
- コンポーネント間の連携

### E2Eテスト
- ゲームプレイの完全なフロー
- マルチプレイヤーシナリオ

## デプロイメント

### 現在の対応
- 静的サイトホスティング
  - Vercel
  - Netlify
  - GitHub Pages

### 将来の対応
- フロントエンド: CDN配信
- バックエンド: Node.js サーバー
- データベース: PostgreSQL / MongoDB
- WebSocket: Socket.io / ws

## 依存関係

### プロダクション
- `react`: UI フレームワーク
- `react-dom`: DOM レンダリング
- `react-router-dom`: ルーティング

### 開発
- `vite`: ビルドツール
- `eslint`: コード品質管理
- `@vitejs/plugin-react`: React サポート

## まとめ

このアーキテクチャは、以下の原則に基づいて設計されています：

1. **関心の分離**: UI、状態管理、ビジネスロジックを明確に分離
2. **拡張性**: 新機能の追加が容易
3. **保守性**: モジュール化されたコード構造
4. **テスタビリティ**: 各レイヤーが独立してテスト可能
5. **スケーラビリティ**: マルチプレイヤーへの拡張を考慮

これにより、将来的なオンライン対応やその他の機能追加がスムーズに行えます。
