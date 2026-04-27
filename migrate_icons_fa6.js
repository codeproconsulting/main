const fs = require('fs');
const path = require('path');

const mapping = {
    "PiGraduationCap": "FaGraduationCap",
    "PiAirplaneTilt": "FaPlane",
    "PiArrowRight": "FaArrowRightLong",
    "PiHeadphones": "FaHeadphones",
    "PiLightning": "FaBolt",
    "PiArrowsClockwise": "FaArrowsRotate",
    "PiClipboardText": "FaClipboardCheck",
    "PiFolderStar": "FaFolderOpen",
    "PiStamp": "FaStamp",
    "PiUsers": "FaUsers",
    "PiStarFill": "FaStar",
    "PiSpinnerGap": "FaSpinner",
    "PiArrowUpRight": "FaArrowUpRightFromSquare",
    "PiCheckCircle": "FaCertificate",
    "PiList": "FaBarsStaggered",
    "PiX": "FaXmark",
    "PiCaretRight": "FaChevronRight",
    "PiFacebookLogo": "FaFacebook",
    "PiInstagramLogo": "FaInstagram",
    "PiLinkedinLogo": "FaLinkedin",
    "PiEnvelope": "FaEnvelope",
    "PiMapPin": "FaLocationDot",
    "PiPhone": "FaPhone",
    "PiArrowLeft": "FaArrowLeft",
    "PiQuotes": "FaQuoteLeft",
    "PiCrosshair": "FaBullseye",
    "PiEye": "FaEye",
    "PiHandshake": "FaHandshake",
    "PiMedal": "FaAward",
    "PiScales": "FaScaleBalanced",
    "PiHeart": "FaHeart"
};

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    const importRegex = /import\s+\{([^}]+)\}\s+from\s+["']react-icons\/pi["'];?/m;
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

        let faName = mapping[origName];
        if (!faName) {
            console.log(`WARNING: Unknown mapping for ${origName} in ${filePath}`);
            faName = origName;
        }
            
        if (alias) {
            newImports.push(`${faName} as ${alias}`);
        } else {
            newImports.push(faName);
            replacements.push([origName, faName]);
        }
    }
            
    let newImportLine;
    if (newImports.length > 3) {
        newImportLine = "import {\n  " + newImports.join(",\n  ") + "\n} from 'react-icons/fa6';";
    } else {
        newImportLine = "import { " + newImports.join(", ") + " } from 'react-icons/fa6';";
    }
        
    content = content.replace(match[0], newImportLine);
    
    for (const [oldName, newName] of replacements) {
        const regex = new RegExp(`\\b${oldName}\\b`, 'g');
        content = content.replace(regex, newName);
    }
        
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated to Fa6: ${filePath}`);
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
