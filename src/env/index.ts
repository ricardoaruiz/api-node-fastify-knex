/** biome-ignore-all lint/suspicious/noConsole: not is important here */
import { config } from 'dotenv'
import { z } from 'zod'
import { envSchema } from './schema.js'

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
config({
	...(process.env.NODE_ENV ? { path: envFile } : {}),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
	const fieldErrors = z.flattenError(_env.error).fieldErrors

	console.log('❌ Invalid environment variables:')
	console.log('---------------------------------')
	console.log(
		Object.entries(fieldErrors)
			.map(([field, errors]) => `👉 ${field}: ${errors.join(', ')}`)
			.join('\n')
	)
	console.log('---------------------------------')
	console.log('ℹ️  See your .env file or the README.md for more information.')

	throw new Error('Invalid environment variables.')
}

export default _env.data
