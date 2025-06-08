import re
from datetime import datetime
import os

def svg_output(text):
    # Extract SVG from triple backticks
    match = re.search(r"```(.*?)```", text, re.DOTALL)
    if match:
        svg_data_str = match.group(1).strip()
        
        
        # Remove leading "svg" keyword if present
        if svg_data_str.lower().startswith('svg'):
            svg_data_str = svg_data_str[3:].lstrip()

        # Generate filename with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'svg_data_{timestamp}.svg'
        output_dir = os.path.join(os.path.dirname(__file__), 'generated')
        os.makedirs(output_dir, exist_ok=True)  # Ensure folder exists
        file_path = os.path.join(output_dir, filename)

         # SVGコードを書き込む
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(svg_data_str)

        print(f"SVGファイル '{filename}' を作成しました。")
        return filename
    else:
        print("No data found between triple backticks.")
        return None
