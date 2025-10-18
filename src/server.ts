/** biome-ignore-all lint/suspicious/noConsole: here is fine */
import app from './app.js'
import env from './env/index.js'

app
	.listen({ port: env.PORT, host: '0.0.0.0' })
	.then(() => {
		console.log(`Server listening on port: ${env.PORT}`)
	})
	.catch((_err) => {
		process.exit(1)
	})
