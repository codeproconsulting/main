import os
import re

mapping = {
    "GraduationCap": "PiGraduationCap",
    "Plane": "PiAirplaneTilt",
    "ArrowRight": "PiArrowRight",
    "Headphones": "PiHeadphones",
    "Zap": "PiLightning",
    "RefreshCw": "PiArrowsClockwise",
    "ClipboardCheck": "PiClipboardText",
    "FolderCheck": "PiFolderStar",
    "Stamp": "PiStamp",
    "Users": "PiUsers",
    "Star": "PiStarFill",
    "Loader2": "PiSpinnerGap",
    "ExternalLink": "PiArrowUpRight",
    "BadgeCheck": "PiCheckCircle",
    "Menu": "PiList",
    "X": "PiX",
    "ChevronRight": "PiCaretRight",
    "Facebook": "PiFacebookLogo",
    "Instagram": "PiInstagramLogo",
    "Linkedin": "PiLinkedinLogo",
    "Mail": "PiEnvelope",
    "MapPin": "PiMapPin",
    "Phone": "PiPhone",
    "ArrowLeft": "PiArrowLeft",
    "Quote": "PiQuotes",
    "Target": "PiCrosshair",
    "Eye": "PiEye",
    "Handshake": "PiHandshake",
    "Award": "PiMedal",
    "Scale": "PiScales",
    "Heart": "PiHeart"
}

def process_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the lucide-react import
    # This regex handles single or multi-line imports
    import_regex = re.compile(r"import\s+\{([^}]+)\}\s+from\s+[\"']lucide-react[\"'];?", re.MULTILINE)
    
    match = import_regex.search(content)
    if not match:
        return
    
    imports_str = match.group(1)
    
    # Extract imported names
    # Handle aliases like "Menu as MenuIcon"
    imported_items = [i.strip() for i in imports_str.split(',')]
    
    new_imports = []
    replacements = [] # list of (old_usage, new_usage)
    
    for item in imported_items:
        if not item:
            continue
        parts = item.split(' as ')
        orig_name = parts[0].strip()
        alias = parts[1].strip() if len(parts) > 1 else None
        
        pi_name = mapping.get(orig_name)
        if not pi_name:
            print(f"WARNING: Unknown mapping for {orig_name} in {file_path}")
            pi_name = orig_name # fallback
            
        if alias:
            # We will generate `import { PiName as AliasName }`
            new_imports.append(f"{pi_name} as {alias}")
        else:
            new_imports.append(pi_name)
            replacements.append((orig_name, pi_name))
            
    # Create the new import string
    if len(new_imports) > 3:
        new_import_line = "import {\n  " + ",\n  ".join(new_imports) + "\n} from 'react-icons/pi';"
    else:
        new_import_line = "import { " + ", ".join(new_imports) + " } from 'react-icons/pi';"
        
    # Replace the import statement
    content = content[:match.start()] + new_import_line + content[match.end():]
    
    # Replace usages in the code
    # We must be careful to match components like <Plane or Plane className
    # Or as variables like { name: "xyz", icon: Plane }
    for old_name, new_name in replacements:
        # Avoid replacing partial words by using word boundaries
        content = re.sub(r'\b' + old_name + r'\b', new_name, content)
        
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {file_path}")

def main():
    src_dir = r"f:\Proconsulting Website\proconsulting_main\src"
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(".tsx") or file.endswith(".ts"):
                process_file(os.path.join(root, file))
                
if __name__ == "__main__":
    main()
