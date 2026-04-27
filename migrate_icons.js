const fs = require('fs');
const path = require('path');

const mapping = {
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
};

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Find the lucide-react import
    const importRegex = /import\s+\{([^}]+)\}\s+from\s+["']lucide-react["'];?/m;
    const match = content.match(importRegex);
    
    if (!match) return;

    const importsStr = match[1];
    
    const importedItems = importsStr.split(',').map(i => i.trim()).filter(Boolean);
    
    const newImports = [];
    const replacements = [];
    
    for (const item of importedItems) {
        let origName, alias;
        
        if (item.includes(' as ')) {
            const parts = item.split(' as ');
            origName = parts[0].trim();
            alias = parts[1].trim();
        } else {
            origName = item;
            alias = null;
        }

        let piName = mapping[origName];
        if (!piName) {
            console.log(`WARNING: Unknown mapping for ${origName} in ${filePath}`);
            piName = origName;
        }
            
        if (alias) {
            newImports.push(`${piName} as ${alias}`);
        } else {
            newImports.push(piName);
            replacements.push([origName, piName]);
        }
    }
            
    let newImportLine;
    if (newImports.length > 3) {
        newImportLine = "import {\n  " + newImports.join(",\n  ") + "\n} from 'react-icons/pi';";
    } else {
        newImportLine = "import { " + newImports.join(", ") + " } from 'react-icons/pi';";
    }
        
    // Replace the import statement
    content = content.replace(match[0], newImportLine);
    
    // Replace usages in the code
    for (const [oldName, newName] of replacements) {
        const regex = new RegExp(`\\b${oldName}\\b`, 'g');
        content = content.replace(regex, newName);
    }
        
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

const srcDir = path.join(__dirname, 'src');
walkDir(srcDir);
