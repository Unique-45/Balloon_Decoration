import sys
import re

css_path = r'c:\Users\Karan Minj\Downloads\Balloon\Balloon_Decoration\css\style.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

# Replace .footer__grid { grid-template-columns: 1fr; gap: 28px; } with the responsive side-by-side layout
css_content = re.sub(
    r'\.footer__grid\s*{\s*grid-template-columns:\s*1fr;\s*gap:\s*28px;\s*}',
    '.footer__grid {\n      grid-template-columns: 1fr 1fr;\n      gap: 28px;\n    }\n    .footer__col:nth-child(1),\n    .footer__col:nth-child(4) {\n      grid-column: span 2;\n    }',
    css_content
)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css_content)

print("Updated footer CSS")
