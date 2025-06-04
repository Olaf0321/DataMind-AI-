# import re
# import csv
# from io import StringIO
# from datetime import datetime

# def csv_output(text):
#     # Step 1: Extract CSV string from triple backticks
#     match = re.search(r"```(.*?)```", text, re.DOTALL)
#     if match:
#         csv_data_str = match.group(1).strip()
        
#         # Step 2: Convert string data to a list of rows
#         csv_file_like = StringIO(csv_data_str)
#         reader = csv.reader(csv_file_like)
#         rows = list(reader)
        
#         # Step 3: Generate filename with current date and time
#         timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')  # e.g., 20250604_123456
#         filename = f'csv_data_{timestamp}.csv'
        
#         # Step 4: Write to actual CSV file
#         with open(filename, 'w', newline='', encoding='utf-8') as f:
#             writer = csv.writer(f)
#             writer.writerows(rows)
        
#         return filename
#     else:
#         return "No data"

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
