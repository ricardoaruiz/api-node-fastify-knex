import type { Knex } from 'knex'
import env from './src/env/index.js'

type Keys = 'test' | 'local' | 'development' | 'staging' | 'production'
type DatabaseConfig = Record<Keys, Knex.Config>

const config: DatabaseConfig = {
	test: {
		client: 'sqlite3',
		useNullAsDefault: true,
		connection: {
			filename: env.DATABASE_URL,
		},
		migrations: {
			extension: 'ts',
			directory: './db/migrations',
		},
		debug: false,
	},

	local: {
		client: 'sqlite3',
		useNullAsDefault: true,
		connection: {
			filename: env.DATABASE_URL,
		},
		migrations: {
			extension: 'ts',
			directory: './db/migrations',
		},
		debug: false,
	},

	development: {},
	staging: {},
	// staging: {
	// 	client: 'postgresql',
	// 	connection: {
	// 		database: 'my_db',
	// 		user: 'username',
	// 		password: 'password',
	// 	},
	// 	pool: {
	// 		min: 2,
	// 		max: 10,
	// 	},
	// 	migrations: {
	// 		tableName: 'knex_migrations',
	// 	},
	// },

	production: {},
	// production: {
	// 	client: 'postgresql',
	// 	connection: {
	// 		database: 'my_db',
	// 		user: 'username',
	// 		password: 'password',
	// 	},
	// 	pool: {
	// 		min: 2,
	// 		max: 10,
	// 	},
	// 	migrations: {
	// 		extension: 'ts',
	// 		directory: './db/migrations',
	// 	},
	// },
}

export default config
