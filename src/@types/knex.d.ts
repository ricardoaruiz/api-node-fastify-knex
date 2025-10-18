/** biome-ignore-all lint/nursery/useConsistentTypeDefinitions: disabled */
import 'knex'

declare module 'knex/types/tables.js' {
	export interface Tables {
		transactions: {
			id: string
			title: string
			amount: number
			session_id?: string | undefined
			created_at?: string
		}
	}
}
