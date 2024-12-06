import { z } from "zod"

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;
const BIO_MAX_LENGTH = 500;
const PASSWORD_MIN_LENGTH = 8;

export const employerloginInputSchema = z.object({
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email name must be a string",
  }),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  }),
});

export type EmployerLoginInput = z.infer<typeof employerloginInputSchema>;

export const employerInputSchema = z.object({
  name: z
    .string({
      required_error: "Company name is required",
      invalid_type_error: "Company name must be a string",
    })
    .min(1, `Company name be at least ${1} characters`)
    .max(NAME_MAX_LENGTH, `Company name cannot exceed ${NAME_MAX_LENGTH} characters`)
    .regex(/^[a-zA-Z\s-']+$/, "First name can only contain letters, spaces, hyphens, and apostrophes")
    .transform(name => name.trim()),

  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .max(72, "Password cannot exceed 72 characters") // bcrypt's maximum length
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Please enter a valid email address")
    .max(320, "Email address is too long")
    .transform(email => email.toLowerCase().trim()),

  phoneNumber: z
    .string({
      required_error: "Phone number is required",
      invalid_type_error: "Phone number must be a string",
    })
    .regex(
      /^\+?[\d\s-()]{10,}$/,
      "Please enter a valid phone number with optional country code"
    )
    .transform(phone => phone.replace(/\s+/g, '')), // Remove spaces

  webPage: z
    .string()
    .url("Please enter a valid URL")
    .max(255, "Web page URL is too long")
    .optional()
    .nullable()
    .transform(url => url?.trim() || null),

  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location cannot exceed 100 characters")
    .optional()
    .nullable()
    .transform(loc => loc?.trim() || null),
});

export type EmployerInput = z.infer<typeof employerInputSchema>;
