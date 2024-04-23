import express from 'express'
import cors from 'cors'

import userRoutes from './routes/users.routes.js'
import medicalHistoryRoutes from './routes/medicalHistory.routes.js'
import patientRoutes from './routes/patient.routes.js'
import appointmentRoutes from './routes/appointment.routes.js'
import authRoutes from './routes/auth.routes.js'
import appointmentTypeRoutes from "./routes/appointmentType.routes.js";
import genderRoutes from './routes/gender.routes.js'
import specialtyRoutes from './routes/specialty.routes.js'
import turnRoutes from './routes/turn.routes.js'
import userTypeRoutes from './routes/userType.routes.js'



import { notFound } from './controllers/404.controllers.js'

const app = express()

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:3000']
}))

app.use('/api', userRoutes)
app.use('/api', patientRoutes)
app.use('/api', medicalHistoryRoutes)
app.use('/api', appointmentRoutes)
app.use('/api', genderRoutes)
app.use('/api', appointmentTypeRoutes)
app.use('/api', specialtyRoutes)
app.use('/api', turnRoutes)
app.use('/api', userTypeRoutes)
app.use('/api', authRoutes)

app.use(notFound)

export default app