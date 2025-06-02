from openai import OpenAI
import os

def send_schema_to_openai(schema_info, api_key):
    client = OpenAI(api_key=api_key)
        

    # # Format schema into readable prompt
    # schema_prompt = "データベーススキーマ:\n"
    # for table, columns in schema_info.items():
    #     schema_prompt += f"\nテーブル: {table}\n"
    #     for col in columns:
    #         schema_prompt += f"  - {col['table']} ({col['name']})\n"
    schema_prompt = "以下はデータベースのスキーマ情報です。\n"
    
    for table, columns in schema_info.items():
        schema_prompt += f"\n■ テーブル名: {table}\n"
        for col in columns:
            name = col.get("name", "不明")
            type_ = col.get("type", "型不明")
            schema_prompt += f"  - カラム名: {name}（型: {type_}）\n"
            
    # print("スキーマプロンプト:", schema_prompt)

    total_prompt = "あなたはSQLの専門家です。ユーザーが提供するデータベーススキーマを記憶し、以降はそれに基づいてSQLのSELECT文を作成してください。"
    total_prompt += f"これが私のデータベーススキーマです:\n{schema_prompt}\nこのスキーマに基づいて、今後ユーザーの要望に応じたデータ抽出クエリを生成してください。"
    
    # Send prompt
    response = client.responses.create(
        model='gpt-4o-mini',
        input=total_prompt,
    )
    
    # Extract and return the output text
    return response.output_text

def send_select_prompt_to_openai(schema_info, selectPrompts, prompt, api_key):
    client = OpenAI(api_key=api_key)
    
    totalPrompt = f'あなたはSQL専門家です。\n私はあなたがデータベースから材料を抽出するためのクエリを提案したいと思います。\nデータベースのスキーマ情報は次のとおりです。\n'
    totalPrompt += f"***********\n{schema_info}\n***********\n"
    totalPrompt += f"これまであなたと私との会話履歴です。\n"
    totalPrompt += f"************\n"
    # Add previous prompts to the total prompt
    for selectPrompt in selectPrompts:
        totalPrompt += f"私： {selectPrompt.プロンプト}\n"
        totalPrompt += f"AI: {selectPrompt.抽出データ数}件のデータを抽出するクエリを生成しました。\n"
    totalPrompt += f"************\n"
    
    totalPrompt += f"上記の内容に基づいて、次のデータを抽出するためのSELECTクエリを作成してください。\n"
    totalPrompt += f"************\n私： {prompt}\n************\n"
    
    totalPrompt += f"**注意事項**：純粋な SELECT クエリのみをコード編集ウィンドウと同じ形で出力しないで、本文形式で出力してください。\nあなたが提案する内容をすべてコピーして実行します。"
    # Send prompt
    response = client.responses.create(
        model='gpt-4o-mini',
        input=totalPrompt,
    )
    
    # Extract and return the output text
    return response.output_text

def send_artifact_prompt_to_openai(artifactPrompts, data, prompt, api_key):
    client = OpenAI(api_key=api_key)
    totalPrompt = ""
    
    totalPrompt += f"これまであなたと私との会話履歴です。\n"
    totalPrompt += f"************\n"
    # Add previous prompts to the total prompt
    for artifactPrompt in artifactPrompts:
        totalPrompt += f"私： {artifactPrompt.プロンプト}\n"
        totalPrompt += f"AI: {artifactPrompt.AI応答}\n"
    totalPrompt += f"************\n"
    
    totalPrompt += f"データ: {data}\n"
    totalPrompt += prompt
    
    print('totalPrompt', totalPrompt)
    
    # Send prompt
    response = client.responses.create(
        model='gpt-4o-mini',
        input=totalPrompt,
    )
    
    # Extract and return the output text
    return response.output_text