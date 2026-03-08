import fs from 'fs';
import path from 'path';

const filesToPatch = [
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

for (const filePath of filesToPatch) {
    if (!fs.existsSync(filePath)) {
        console.log("File not found:", filePath);
        continue;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // Replace the import
    content = content.replace(
        /import { getAuthSession } from "@\/lib\/auth\/session";/g,
        'import { auth } from "@clerk/nextjs/server";\nimport { db } from "@/lib/db";'
    );

    // Replace the session fetch
    content = content.replace(
        /const session = await getAuthSession\(\);/g,
        'const { userId } = await auth();\n    const user = userId ? await db.user.findUnique({ where: { id: userId } }) : null;\n    const session = user ? { user } : null;'
    );

    // Clean up duplicate db imports if any arose
    const dbImportRegex = /import { db } from "@\/lib\/db";/g;
    let dbMatch;
    let matchCount = 0;
    while ((dbMatch = dbImportRegex.exec(content)) !== null) {
        matchCount++;
    }
    if (matchCount > 1) {
        content = content.replace('import { auth } from "@clerk/nextjs/server";\nimport { db } from "@/lib/db";', 'import { auth } from "@clerk/nextjs/server";');
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log("Patched", filePath);
}
