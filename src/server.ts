import fastify from 'fastify'

const app = fastify()

app.get('/ping', async (_request, _reply) => 'pong\n')

app
	.listen({ port: 3333 })
	.then(() => {
		// biome-ignore lint/suspicious/noConsole: here is fine
		console.log('Server listening on http://localhost:3333')
	})
	.catch((_err) => {
		process.exit(1)
	})
