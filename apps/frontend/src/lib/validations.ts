import { z } from "zod";

export const SignUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const InvitePartnerSchema = z.object({
    inviteCode: z.string().min(5, "Invite code must be valid"),
});

export const MemorySchema = z.object({
    imageUrl: z.string().url("Must be a valid URL"),
    caption: z.string().optional(),
});

export const ExpenseSchema = z.object({
    amount: z.coerce.number().positive("Amount must be positive"),
    description: z.string().min(2, "Description is required"),
    splitType: z.enum(["EQUAL", "FULL", "CUSTOM"]),
});
