import { pool } from "../db.js";

export const getAppointments= async (req, res) =>{
    try{
        const [rows] = await pool.query('SELECT * FROM appointment')
    
        res.json(rows)
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const getAppointmentsByDoctor = async (req, res) =>{
    try{
        const {doctor_id} = req.params
        const [doctorRows] = await pool.query('SELECT * FROM user WHERE id = ? AND user_type = 1', [doctor_id])
        
        if (doctorRows.length <= 0) return res.status(404).json({
            message: 'Doctor Not Found.'
        })
        
        const [appointmentRows] = await pool.query('SELECT * FROM appointment WHERE doctor = ?', [doctor_id])
    
        res.json(appointmentRows)
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const getAppointment = async (req, res) =>{
    try{
        const {id} = req.params
        const [rows] = await pool.query('SELECT * FROM appointment WHERE id = ?', [id])

        if (rows.length <= 0) return res.status(404).json({
            message: 'Appointment Not Found.'
        })

        res.json(rows[0])
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        }) 
    }
}




export const createAppointment= async (req, res) =>{
    try{
        console.log(req.body)
        const {appointment_date, doctor, patient, appointment_type, was_executed} = req.body
        const [rows] = await pool.query(
            'INSERT INTO appointment (appointment_date, doctor, patient, appointment_type, was_executed) VALUES (?, ?, ?, ?, ?)',
            [appointment_date, doctor, patient, appointment_type, was_executed]
        )
        res.send({
            id: rows.insertId,
            appointment_date, 
            doctor, 
            patient, 
            appointment_type, 
            was_executed
        })
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const updateAppointment = async (req, res) => {
    try{
        const {id} = req.params
        const {appointment_date, doctor, patient, appointment_type, was_executed} = req.body
        const [rows] = await pool.query(
            'UPDATE appointment SET appointment_date = IFNULL(?, appointment_date), doctor = IFNULL(?, doctor), patient = IFNULL(?, patient), appointment_type = IFNULL(?, appointment_type), was_executed = IFNULL(?, was_executed) WHERE id = ?',
            [appointment_date, doctor, patient, appointment_type, was_executed, id]
        )

        if (rows.affectedRows <= 0) return res.status(404).json({
            message: 'Appointment Not Found.'
        })

        const [updatedRows] = await pool.query('SELECT * FROM appointment WHERE id = ?', [id])

        res.send(updatedRows)
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const deleteAppointment = async (req, res) =>{
    try{
        const {id} = req.params
        const [rows] = await pool.query('DELETE FROM appointment WHERE id = ?', [id])

        if (rows.affectedRows <= 0) return res.status(404).json({
            message: 'Appointment Not Found.'
        })

        res.sendStatus(204)
    }
    catch{
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}