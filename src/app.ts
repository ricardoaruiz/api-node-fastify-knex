import cookie from '@fastify/cookie'
import fastify from 'fastify'
import {
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod'
import env from './env/index.js'
import { errorHandler } from './middleware/error-handler.js'
import { routes } from './routes/index.js'

const app = fastify()
app.register(cookie, {
	secret: env.COOKIE_SECRET,
})
app.setErrorHandler(errorHandler)
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

for (const route of routes) {
	app.register(route)
}

export default app
