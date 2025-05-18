import openai
import os

def send_to_openai(schema_info, azure_endpoint, api_key, deployment_name, api_version="2023-05-15"):
    openai.api_type = "azure"
    openai.api_base = azure_endpoint
    openai.api_key = api_key
    openai.api_version = api_version

    # Format schema into readable prompt
    schema_prompt = "Database schema:\n"
    for table, columns in schema_info.items():
        schema_prompt += f"\nTable: {table}\n"
        for col in columns:
            schema_prompt += f"  - {col['name']} ({col['type']})\n"

    # Send prompt
    response = openai.ChatCompletion.create(
        engine=deployment_name,
        messages=[
            {"role": "system", "content": "You are a helpful database assistant."},
            {"role": "user", "content": f"Here is my database schema:\n{schema_prompt}\nHow can I use it effectively?"}
        ],
        temperature=0.5,
        max_tokens=500
    )
    
    return response['choices'][0]['message']['content']
