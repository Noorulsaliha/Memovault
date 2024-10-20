import { z } from 'zod'

const UserSchema = z.object({
    name : z.string().min(5, 'Username must be at least 5 characters'),
    email : z.string().email({message : "Please enter valid email address"}),
    password : z.string().min(8, "Password must be atleast 8 characters long").max(20, "Password must be no longer than 20 characters").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[@$!%*?&]/, "Password must contain at least one special character (@, $, !, %, *, ?, &)")
})

export const emailSchema = UserSchema.shape.email;
export const nameSchema = UserSchema.shape.name;
export const passwordSchema = UserSchema.shape.password;
