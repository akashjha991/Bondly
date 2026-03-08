import fs from 'fs';
import path from 'path';

const files = [
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\app\\dashboard\\calendar\\actions.ts",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\app\\dashboard\\profile\\page.tsx",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\app\\dashboard\\profile\\actions.ts",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\app\\dashboard\\notes\\actions.ts",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\app\\dashboard\\mood\\actions.ts",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\app\\dashboard\\memories\\actions.ts",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\app\\api\\upload\\route.ts",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\app\\dashboard\\expenses\\actions.ts",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\app\\api\\invite\\route.ts"
];

let replaced = 0;

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        if (content.includes('import { auth } from "@clerk/nextjs/server";')) {
            content = content.replace('import { auth } from "@clerk/nextjs/server";', 'import { getAuthSession } from "@/lib/auth/session";');
            // sometimes it's multiple instances
            content = content.replace(/import \{ auth \} from "@clerk\/nextjs\/server";/g, 'import { getAuthSession } from "@/lib/auth/session";');
        }

        if (content.includes('const { userId } = await auth();')) {
            content = content.replace(/const \{ userId \} = await auth\(\);/g, 'const session = await getAuthSession();\n    const userId = session?.user?.id;');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Patched ${file}`);
            replaced++;
        }
    }
}

console.log(`\nSuccessfully patched ${replaced} files.`);
