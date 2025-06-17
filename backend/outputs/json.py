import re
from datetime import datetime
import os

def json_output(text):
    # Extract JSON from triple backticks
    match = re.search(r"{(.*?)}", text, re.DOTALL)
    if match:
        json_data_str = match.group(1).strip()

        print(f"JSON '{json_data_str}' を作成しました。")
        return json_data_str
    else:
        print("No data found between triple backticks.")
        return None