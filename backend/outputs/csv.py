import re
import csv
from io import StringIO
from datetime import datetime
import os

def csv_output(text):
    # Extract CSV from triple backticks
    match = re.search(r"```(.*?)```", text, re.DOTALL)
    if match:
        csv_data_str = match.group(1).strip()
        
        
        # Remove leading "csv" keyword if present
        if csv_data_str.lower().startswith('csv'):
            csv_data_str = csv_data_str[3:].lstrip()

        # Convert to list of rows
        csv_file_like = StringIO(csv_data_str)
        rows = list(csv.reader(csv_file_like))

        # Generate filename with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'csv_data_{timestamp}.csv'
        output_dir = os.path.join(os.path.dirname(__file__), 'generated')
        os.makedirs(output_dir, exist_ok=True)  # Ensure folder exists
        file_path = os.path.join(output_dir, filename)

        # Write to file
        with open(file_path, 'w', newline='', encoding='utf-8') as f:
            csv.writer(f).writerows(rows)

        print(f"CSV file '{filename}' has been created successfully.")
        return filename  # return the name so frontend can fetch it
    else:
        print("No data found between triple backticks.")
        return None
