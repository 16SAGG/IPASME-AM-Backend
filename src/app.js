import express from 'express'

import userRoutes from './routes/users.routes.js'
import medicalHistoryRoutes from './routes/medicalHistory.routes.js'
import patientRoutes from './routes/patient.routes.js'
import appointmentRoutes from './routes/appointment.routes.js'

import { notFound } from './controllers/404.controllers.js'

const app = express()

app.use(express.json())

app.use('/api', userRoutes)
app.use('/api', patientRoutes)
app.use('/api', medicalHistoryRoutes)
app.use('/api', appointmentRoutes)

app.use(notFound)

export default app