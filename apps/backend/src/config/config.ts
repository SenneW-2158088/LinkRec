export const CONFIG = {
  ENVIRONMENT: process.env.ENVIRONMENT || "devevlopment",
  PORT: Number(process.env.BACKEND_PORT) || 4000,
  JWT_SECRET: process.env.JWT_SECRET || "super_secret_linkrec_key"
} as const;
