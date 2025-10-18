import knex from 'knex'
import config from '../knexfile.js'
import env from './env/index.js'

const db = knex(config[env.NODE_ENV])

export default db
