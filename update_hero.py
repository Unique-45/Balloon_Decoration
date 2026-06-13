import sys
import re

css_path = r'c:\Users\Karan Minj\Downloads\Balloon\Balloon_Decoration\css\style.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

# Replace mobile category-hero padding and sizes
old_mobile_hero = """@media (max-width: 600px) {
  .category-hero {
    padding: 24px 0 20px;
  }
  .category-hero h1 {
    font-size: 1.5rem;
  }
  .category-hero-icon {
    width: 72px;
    height: 72px;
  }
}"""
new_mobile_hero = """@media (max-width: 600px) {
  .category-hero {
    padding: 16px 0 12px;
  }
  .category-hero h1 {
    font-size: 1.25rem;
    margin-bottom: 4px;
  }
  .category-hero p {
    font-size: 0.85rem;
    line-height: 1.3;
    margin-bottom: 4px;
  }
  .category-hero-icon {
    width: 60px;
    height: 60px;
  }
  .category-hero-content {
    gap: 8px;
  }
}"""

if old_mobile_hero in css_content:
    css_content = css_content.replace(old_mobile_hero, new_mobile_hero)
else:
    print("Could not find exact block, using regex")
    css_content = re.sub(r'@media \(max-width: 600px\)\s*{\s*\.category-hero\s*{[^}]*}\s*\.category-hero h1\s*{[^}]*}\s*\.category-hero-icon\s*{[^}]*}\s*}', new_mobile_hero, css_content)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css_content)

print("Updated category hero CSS")
