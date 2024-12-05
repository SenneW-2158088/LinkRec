import { z } from "zod"

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;
const BIO_MAX_LENGTH = 500;
const PASSWORD_MIN_LENGTH = 8;

export const loginInputSchema = z.object({
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email name must be a string",
  }),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  }),
});

export type loginInput = z.infer<typeof loginInputSchema>;

export const userInputSchema = z.object({
  firstName: z
    .string({
      required_error: "First name is required",
      invalid_type_error: "First name must be a string",
    })
    .min(NAME_MIN_LENGTH, `First name must be at least ${NAME_MIN_LENGTH} characters`)
    .max(NAME_MAX_LENGTH, `First name cannot exceed ${NAME_MAX_LENGTH} characters`)
    .regex(/^[a-zA-Z\s-']+$/, "First name can only contain letters, spaces, hyphens, and apostrophes")
    .transform(name => name.trim()),

  lastName: z
    .string({
      required_error: "Last name is required",
      invalid_type_error: "Last name must be a string",
    })
    .min(NAME_MIN_LENGTH, `Last name must be at least ${NAME_MIN_LENGTH} characters`)
    .max(NAME_MAX_LENGTH, `Last name cannot exceed ${NAME_MAX_LENGTH} characters`)
    .regex(/^[a-zA-Z\s-']+$/, "Last name can only contain letters, spaces, hyphens, and apostrophes")
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

  bio: z
    .string()
    .max(BIO_MAX_LENGTH, `Bio cannot exceed ${BIO_MAX_LENGTH} characters`)
    .optional()
    .nullable()
    .transform(bio => bio?.trim() || null),
});

export type UserInput = z.infer<typeof userInputSchema>;
