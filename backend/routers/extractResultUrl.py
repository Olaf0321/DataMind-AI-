import re
from outputs.csv import csv_output
from outputs.svg import svg_output
from outputs.html import html_output
from outputs.json import json_output

def extract_result_url(text: str, output: str) -> str:
    if (output == 'CSV'):
        return csv_output(text)
    elif (output == 'SVG'):
        return svg_output(text)
    elif (output == 'HTML'):
        return html_output(text)
    else :
        return json_output(text)
