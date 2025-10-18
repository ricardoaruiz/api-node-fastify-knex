import type { Knex } from 'knex'
import env from './src/env/index.js'

type Keys = 'test' | 'local' | 'development' | 'staging' | 'production'
type DatabaseConfig = Record<Keys, Knex.Config>

const migrations = {
	extension: 'ts',
	directory: './db/migrations',
}

const config: DatabaseConfig = {
	// Test
	test: {
		client: 'sqlite',
		useNullAsDefault: true,
		connection: {
			filename: env.DATABASE_URL,
		},
		debug: false,
		migrations,
	},

	// Local
	local: {
		client: 'sqlite',
		useNullAsDefault: true,
		connection: {
			filename: env.DATABASE_URL,
		},
		debug: false,
		migrations,
	},

	// Development
	development: {},

	// Staging
	staging: {},

	// Production
	production: {
		client: 'pg',
		useNullAsDefault: true,
		connection: env.DATABASE_URL,
		migrations,
	},
}

export default config
