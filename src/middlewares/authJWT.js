import jwt from 'jsonwebtoken';
import { ENV } from "../config.js"
import { pool } from '../db.js';

export const verifyToken = async (req, res, next) =>{
    const token = req.headers["x-access-token"]

    if (!token) return res.status(403).json({message: "No Token Provided"})

    try{
        const decodedEmail = jwt.verify(token, ENV.SECRET_TOKEN_KEY).id
        req.user_email = decodedEmail

        try{
            const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [decodedEmail])

            if (rows.length <= 0) return res.status(404).json({
                message: 'User Not Found.'
            })
        }
        catch{
            return res.status(500).json({
                message : 'Something Goes Wrong'
            })
        }
    }
    catch{
        return res.status(404).json({
            message: 'Invalid Token'
        })
    }
        
    next()
}

export const isAdmin = async (req, res, next) => {
    try{
        const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [req.user_email])

        if (rows.length <= 0) return res.status(404).json({
            message: 'User Not Found.'
        })

        const userIsAdmin = rows[0].user_type === 0
        if (!userIsAdmin) return res.status(403).json({
            message: "It's Required To Be An Administrator"
        })
    }
    catch{
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }

    next()
}

export const isReceptionist = async(req, res, next) =>{
    try{
        const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [req.user_email])

        if (rows.length <= 0) return res.status(404).json({
            message: 'User Not Found.'
        })

        const userIsReceptionist = rows[0].user_type === 2
        if (!userIsReceptionist) return res.status(403).json({
            message: "It's Required To Be An Receptionist"
        })
    }
    catch{
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }

    next()
}

export const isReceptionistOrIsDoctor = async(req, res, next) =>{
    try{
        const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [req.user_email])

        if (rows.length <= 0) return res.status(404).json({
            message: 'User Not Found.'
        })

        const userIsReceptionist = rows[0].user_type === 2
        const userIsDoctor = rows[0].user_type === 1
        
        if (userIsReceptionist || userIsDoctor) return next()
        
        return res.status(403).json({
            message: "It's Required To Be An Receptionist OR Be An Doctor"
        })
    }
    catch{
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const isReceptionistOrIsDoctorOwnerAppointment = async(req, res, next) =>{
    try{
        const [userRows] = await pool.query('SELECT * FROM user WHERE email = ?', [req.user_email])

        if (userRows.length <= 0) return res.status(404).json({
            message: 'User Not Found.'
        })

        const userIsReceptionist = userRows[0].user_type === 2
        const userIsDoctor = userRows[0].user_type === 1
        
        const [appointmentRows] = await pool.query('SELECT * FROM appointment WHERE id = ?', [req.params.id])

        if (appointmentRows.length <= 0) return res.status(404).json({
            message: 'Appointment Not Found.'
        })

        const doctorIsOwner = appointmentRows[0].doctor === userRows.id

        if (userIsReceptionist || (userIsDoctor && doctorIsOwner)) return next()
        
        return res.status(403).json({
            message: "It's Required To Be An Receptionist OR Be The Doctor In Charge Of The Appointment"
        })
    }
    catch{
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const isReceptionistOrIsDoctorOwnerMedicalHistory = async(req, res, next) =>{
    try{
        const [userRows] = await pool.query('SELECT * FROM user WHERE email = ?', [req.user_email])

        if (userRows.length <= 0) return res.status(404).json({
            message: 'User Not Found.'
        })

        const userIsReceptionist = userRows[0].user_type === 2
        const userIsDoctor = userRows[0].user_type === 1
        
        const [medicalHistoryRows] = await pool.query('SELECT * FROM medical_history WHERE id = ?', [req.params.id])

        if (medicalHistoryRows.length <= 0) return res.status(404).json({
            message: 'Medical History Not Found.'
        })

        const doctorIsOwner = medicalHistoryRows[0].doctor === userRows.id

        if (userIsReceptionist || (userIsDoctor && doctorIsOwner)) return next()
        
        return res.status(403).json({
            message: "It's Required To Be An Receptionist OR Be The Doctor In Charge Of The Medical History"
        })
    }
    catch{
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}