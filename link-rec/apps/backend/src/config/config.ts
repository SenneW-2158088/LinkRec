export const CONFIG = {
  PORT: Number(process.env.BACKEND_PORT) || 4000,
  JWT_SECRET: "super_secret_linkrec_key"
} as const;
