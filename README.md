# DataMind-AI

> **自然言語 → SQL → ピンポイント抽出（Key&Value） → 生成AI**  
> RAGに依存しないデータ利活用フローで、分析・可視化・資料化までを正確に自動化。

[![CI](https://img.shields.io/github/actions/workflow/status/<your-org>/DataMind-AI/ci.yml?branch=main)](../../actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![OpenAI](https://img.shields.io/badge/OpenAI-Assistants%20API-blue)](#技術スタック)
[![Made with FastAPI](https://img.shields.io/badge/API-FastAPI-009688)](#バックエンド)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB)](#フロントエンド)

---

## 概要

**DataMind-AI** は、生成AIを用いたナレッジ活用において主流の **RAG**（Retrieval-Augmented Generation）とは別のアプローチで、  
**自然言語の検索意図 → 正規化DBへの `SELECT` 生成 → 必要なデータのみを Key&Value でAIへ渡す** という精密なフローを採用します。  
これにより、**検索→加工→保存** のサイクルを確実に回し、RAGが苦手としがちな **数値集計・条件分析・構造化加工** に強みを発揮します。  
タスクとして登録可能で、**月次バッチ**や**外部サービス連携**も容易です。将来的に **MCP（Model Context Protocol）** に対応予定。

---

## なぜRAGではなくこの方式か

- **RAG** は *ベクトル検索* による文書類似で「ナレッジ検索」に強い一方、  
  数値計算や結合・集計など **DB前提の加工・分析** は不得手になりがち。
- **DataMind-AI** は自然言語を **SQL（主に `SELECT`）** に変換し、  
  **正規化DB** から “条件指定のピンポイント” で **Key&Value** を抽出 → 生成AIに最小限の文脈を渡すことで、  
  **正確・再現性の高い** 応答やドキュメント生成を実現します。

---

## 主な機能

- 自然言語の指示から **安全なSQL（SELECT）** を自動生成
- DBから **必要最小限のKey&Value** を抽出してLLMに渡す
- 生成結果（要約/分析/レポート）を **DBへ保存**（Key&Value/JSON）
- **スレッド文脈管理** と **壁打ち**（フリープロンプト）両対応
- **タスク登録** により、外部サービスから変数を差し替えて **月次や定期バッチ**を実行
- （計画）**MCP対応**：外部サービスやツールをUSB感覚で接続、RAG連携やワークフロー自動化

---

## 技術スタック

- **フロントエンド**：React
- **バックエンド**：FastAPI
- **AIエンジン**：OpenAI Assistants API
- **データベース／ストレージ**：Firebase（ユーザ/履歴）、RDB（業務データ）
- **その他**：Docker / Docker Compose（任意）

---

## アーキテクチャ

```mermaid
flowchart LR
  U[User] --> FE[React Frontend]
  FE -->|自然言語指示| API[FastAPI Backend]
  API --> INTENT[意図解析 & スキーマ理解]
  INTENT --> SQL[安全なSELECT生成]
  SQL --> DB[(RDB)]
  DB --> KVS[Key&Value抽出/整形]
  KVS --> LLM[OpenAI Assistants API]
  LLM --> OUT[分析/要約/資料生成]
  OUT --> SAVE[(結果保存: DB/JSON)]
  SAVE --> TASK[タスク登録/スケジューラ]
  TASK --> API
  API --> FE
