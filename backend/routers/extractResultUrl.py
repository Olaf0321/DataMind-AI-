import re
from outputs.csv import csv_output

def extract_result_url(text: str, output: str) -> str:
    if (output == 'CSV'):
        return csv_output(text)
