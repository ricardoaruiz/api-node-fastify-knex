import z from 'zod'

const DEFAULT_PORT = 3333

export const envSchema = z.object({
	NODE_ENV: z
		.enum(['test', 'local', 'development', 'staging', 'production'])
		.default('production'),
	PORT: z.coerce.number().default(DEFAULT_PORT),
	DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
	COOKIE_SECRET: z.string().min(1, 'COOKIE_SECRET is required'),
})
