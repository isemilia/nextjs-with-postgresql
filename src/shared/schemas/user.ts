import * as z from 'zod';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

export const userSchema = z.object({
    id: z.string(), // uuid
    name: z.string(),
    email: z.string(),
    role: z.enum(UserRole)
})

export type User = z.infer<typeof userSchema>