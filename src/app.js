import express from 'express'
import userRoutes from './routes/users.routes.js'
import { notFound } from './controllers/404.controllers.js'

const app = express()

app.use(express.json())

app.use('/api', userRoutes)

app.use(notFound)

export default app