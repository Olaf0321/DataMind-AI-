from openai import OpenAI
import os

def send_to_openai(schema_info, azure_endpoint, api_key, deployment_name, api_version="2023-05-15"):
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
            
    print("スキーマプロンプト:", schema_prompt)

    total_prompt = "あなたはSQLの専門家です。ユーザーが提供するデータベーススキーマを記憶し、以降はそれに基づいてSQLのSELECT文を作成してください。"
    total_prompt += f"これが私のデータベーススキーマです:\n{schema_prompt}\nこのスキーマに基づいて、今後ユーザーの要望に応じたデータ抽出クエリを生成してください。"
    
    # Send prompt
    response = client.responses.create(
        model='gpt-4o-mini',
        input=total_prompt,
    )
    
    # return response['choices'][0]['message']['content']
    return response.output_text