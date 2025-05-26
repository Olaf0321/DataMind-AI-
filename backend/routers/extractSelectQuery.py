import re

def extract_select_query(text: str) -> str:
    """
    Extracts the first SELECT query from text and returns it as a single line.
    """
    # 正規表現で SELECT で始まり ; で終わる文を抽出（改行やスペースも含む）
    pattern = r"(SELECT\b[\s\S]*?;)"
    match = re.search(pattern, text, re.IGNORECASE)

    if match:
        # クエリを1行に整形（空白と改行を削除せず、余分な空白だけを除去）
        query = match.group(1)
        query = re.sub(r"\s+", " ", query)  # 複数空白・改行をスペース1つに
        return query.strip()
    else:
        return None

# 使用例
text = """
AIからの応答: 山田太郎の販売情報を取得するためのSELECTクエリは以下の通りです。

SELECT *
FROM 売上情報
WHERE 顧客名 = '山田太郎';

このクエリを実行すると、山田太郎に関連するすべての販売情報が抽出されます。
"""

sql_query = extract_select_query(text)
print(sql_query)
