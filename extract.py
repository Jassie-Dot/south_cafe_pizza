import re
import os

source_file = r"c:\Users\jassi\Documents\south cafe pizza\components\HomePage.jsx"
dest_dir = r"c:\Users\jassi\Documents\south cafe pizza\components"

# Define the components to extract and their target directories
components_to_extract = {
    'layout': ['SiteHeader', 'SiteFooter', 'BrandLockup'],
    'home': ['Hero', 'FeaturedMenu', 'DoughCraftSection', 'MealSuggestionsSection', 'AboutSection', 'BeachExperience', 'SpecialsSection', 'GallerySection', 'TestimonialsSection', 'LocationContact'],
    'ui': ['Icon', 'ButtonLink', 'ButtonAction', 'ThemeToggle', 'SectionReveal', 'OrderToast']
}

with open(source_file, 'r', encoding='utf-8') as f:
    content = f.read()

# We will just write a simple script that grabs function components
# based on simple parsing. 
# Better: Just copy HomePage.jsx and manually do it later if script fails.
# Since python parsing might break JSX if it has unbalanced braces, let's use ast or simply split by "function "

functions = {}
lines = content.split('\n')
current_func = None
brace_count = 0
func_content = []

for line in lines:
    if line.startswith('function ') and current_func is None:
        match = re.search(r'function\s+([A-Za-z0-9_]+)\s*\(', line)
        if match:
            current_func = match.group(1)
            func_content = [line]
            brace_count = line.count('{') - line.count('}')
            if brace_count == 0 and '{' in line:
                # One line function
                functions[current_func] = '\n'.join(func_content)
                current_func = None
            continue
            
    if current_func is not None:
        func_content.append(line)
        brace_count += line.count('{') - line.count('}')
        if brace_count == 0:
            functions[current_func] = '\n'.join(func_content)
            current_func = None

for category, names in components_to_extract.items():
    cat_dir = os.path.join(dest_dir, category)
    os.makedirs(cat_dir, exist_ok=True)
    for name in names:
        if name in functions:
            file_path = os.path.join(cat_dir, f"{name}.jsx")
            with open(file_path, 'w', encoding='utf-8') as out_f:
                # Add basic imports that might be needed
                out_f.write('''"use client";\nimport { motion, AnimatePresence, useReducedMotion } from "framer-motion";\nimport * as Icons from "lucide-react";\n\n''')
                out_f.write(functions[name])
                out_f.write(f"\n\nexport default {name};\n")
            print(f"Extracted {name} to {file_path}")

print("Done extracting!")
