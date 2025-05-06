# DataMind-AI

DataMind-AIは、データベースをAIで分析するためのシステムです。

## システム概要

このシステムは以下の機能を提供します：

1. 外部データベースの接続
2. AIを使用したデータ抽出と分析
3. 対話形式でのデータ確認と処理
4. 最終的な分析結果の生成

## 技術スタック

- フロントエンド: Next.js
- バックエンド: Python (FastAPI)
- データベース: SQLite

## セットアップ手順

### バックエンドのセットアップ

1. Pythonの仮想環境を作成して有効化：
```bash
python -m venv venv
source venv/bin/activate  # Linuxの場合
.\venv\Scripts\activate   # Windowsの場合
```

2. 必要なパッケージをインストール：
```bash
cd backend
pip install -r requirements.txt
```

3. アプリケーションの起動：
```bash
uvicorn main:app --reload
```

### 初期管理者アカウント

システム起動時に以下の初期管理者アカウントが作成されます：

- メールアドレス: admin@datamind.ai
- パスワード: admin123

## API エンドポイント

### 認証関連

- POST `/token` - ログイン（アクセストークンの取得）
- POST `/ユーザー登録` - 新規ユーザー登録
- GET `/ユーザー/me` - 現在のユーザー情報の取得

## 開発環境

- Python 3.8以上
- Node.js 16以上
- npm 7以上

## セキュリティ注意事項

- 本番環境では必ず`SECRET_KEY`を環境変数から取得するように設定してください
- 初期管理者パスワードは必ず変更してください 