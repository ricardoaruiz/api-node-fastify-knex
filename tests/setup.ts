import { execSync } from 'node:child_process'
import { afterAll, beforeAll } from 'vitest'
import app from '../src/app.js'
import db from '../src/db.js'
import env from '../src/env/index.js'

beforeAll(async () => {
	// Espera o app ficar pronto antes de rodar os testes
	await app.ready()

	// Como o teste usa um banco SQLite, podemos simplesmente remover o arquivo antes de rodar as migrations
	execSync(`rm -rf ${env.DATABASE_URL}`)

	// Aqui podemos utilizar o comando do Knex via execSync ou chamar a função de migração diretamente
	// execSync('npm run knex migrate:latest')
	await db.migrate.latest()
})

afterAll(async () => {
	// Fecha o app depois que todos os testes terminarem
	await app.close()

	// Remove o arquivo do banco de dados de teste
	execSync('rm -rf ./db/test.sqlite')
})
