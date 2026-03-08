import fs from 'fs';

const files = [
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\components\\features\\profile\\ProfileHeader.tsx",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\components\\features\\profile\\AccountSettings.tsx",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\components\\features\\navigation\\Navigation.tsx",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\components\\features\\mood\\MoodTracker.tsx",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\components\\features\\expenses\\ExpenseTracker.tsx",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\components\\features\\chat\\ChatRoom.tsx",
    "c:\\Users\\akash\\OneDrive\\Documents\\cursor_files\\New folder\\bondly\\apps\\frontend\\src\\app\\dashboard\\onboarding\\page.tsx"
];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        content = content.replace(/import \{ useUser \} from "@clerk\/nextjs";/g, 'import { useSession } from "next-auth/react";');
        content = content.replace(/import \{ useClerk \} from "@clerk\/nextjs";/g, 'import { signOut } from "next-auth/react";');

        content = content.replace(/const \{ user \} = useUser\(\);/g, 'const { data: session } = useSession();\n    const user = session?.user;');
        content = content.replace(/const \{ signOut \} = useClerk\(\);\n/g, '');

        content = content.replace(/signOut\(\{ redirectUrl: "\/sign-in" \}\)/g, 'signOut({ callbackUrl: "/sign-in" })');

        content = content.replace(/user\?\.imageUrl/g, 'user?.image');
        content = content.replace(/user\?\.fullName/g, 'user?.name');

        fs.writeFileSync(file, content, 'utf8');
        console.log(`Patched ${file}`);
    }
}
