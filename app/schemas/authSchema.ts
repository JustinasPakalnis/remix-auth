import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const registrationSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format "),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmpassword: z.string().min(1, "Confirmation password is required"),
    admin: z
      .string()
      .refine(
        (val) => val === "true" || val === "false",
        "Select a valid user type"
      )
      .transform((val) => val === "true"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
