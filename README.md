# Team Facilitator Roulette 🎯

チームミーティングのファシリテータをランダムかつ楽しく決定するWebアプリケーション

## 🌟 特徴

- **インタラクティブな選択**: メンバーをクリックして参加者を選択
- **楽しいルーレット演出**: ダーツ盤風の回転アニメーション
- **祝福エフェクト**: 当選者決定時の紙吹雪アニメーション
- **レスポンシブデザイン**: PC・タブレット・スマートフォン対応
- **サウンドエフェクト**: ON/OFF切り替え可能な効果音

## 🚀 デモ

[https://[your-username].github.io/team-facilitator-roulette/](https://[your-username].github.io/team-facilitator-roulette/)

## 📦 セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/[your-username]/team-facilitator-roulette.git
cd team-facilitator-roulette
```

### 2. メンバーリストのカスタマイズ

`members.json`を編集してチームメンバーを設定:

```json
{
  "team": "あなたのチーム名",
  "members": [
    {
      "id": 1,
      "name": "メンバー名",
      "avatar": "😊"
    }
  ]
}
```

### 3. GitHub Pagesの設定

1. GitHubリポジトリの Settings > Pages へ移動
2. Source を "GitHub Actions" に設定
3. mainブランチにプッシュすると自動デプロイ

## 💻 ローカル開発

```bash
# シンプルなHTTPサーバーで起動
python -m http.server 8000
# または
npx serve .
```

ブラウザで `http://localhost:8000` にアクセス

## 🎮 使い方

1. **メンバー選択**: 参加するメンバーをクリックで選択（最低2名）
2. **ルーレット開始**: 「ルーレットスタート」ボタンをクリック
3. **結果確認**: アニメーション終了後、ファシリテータが決定
4. **再実行**: 「もう一度」ボタンで再度ルーレット可能

### キーボードショートカット

- **スペースキー**: ルーレット開始（メンバー選択済みの場合）

## 📱 対応環境

- Chrome, Firefox, Safari, Edge の最新版
- iOS Safari, Android Chrome
- タブレット・スマートフォン対応

## 🛠 技術スタック

- **フロントエンド**: Vanilla JavaScript, HTML5, CSS3
- **アニメーション**: CSS Transitions, Canvas API
- **デプロイ**: GitHub Pages, GitHub Actions

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずイシューを開いて変更内容を議論してください。

## 📮 お問い合わせ

イシューまたはディスカッションでお気軽にお問い合わせください。