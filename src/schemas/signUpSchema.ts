import {z} from "zod";

export const UsernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 characters")
  .max(10, "Username cannot exceeds 10 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");

export const SignUpSchema = z.object({
  username: UsernameValidation,
  email: z.string().email({message: "Invalid email address"}),
  password: z.string().min(6, {message: "Password must be atleast of 6 characters"}),
  name: z.string().min(1, {message: "Enter valid fullname"})
})