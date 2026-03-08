import fs from 'fs';

const files = [
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\app\\dashboard\\profile\\actions.ts",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\app\\dashboard\\memories\\actions.ts",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\app\\dashboard\\mood\\actions.ts",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\app\\dashboard\\notes\\actions.ts",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\app\\dashboard\\calendar\\actions.ts",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\app\\api\\upload\\route.ts",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\app\\dashboard\\expenses\\actions.ts",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\app\\api\\invite\\route.ts"
];

let count = 0;
for (const file of files) {
    if (fs.existsSync(file)) {
        let text = fs.readFileSync(file, 'utf8');

        // Rename the injected NextAuth session variable to avoid collisions with the DB-fetched session variable
        text = text.replace(/const session = await getAuthSession\(\);/g, 'const authSession = await getAuthSession();');
        text = text.replace(/const userId = session\?\.user\?\.id;/g, 'const userId = authSession?.user?.id;');

        fs.writeFileSync(file, text);
        console.log(`Renamed in ${file}`);
        count++;
    }
}
console.log(`Fixed ${count} files.`);
