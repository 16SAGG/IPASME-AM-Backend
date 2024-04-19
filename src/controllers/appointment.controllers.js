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
        const {date, doctor, patient, appointment_type, wasExecuted} = req.body
        const [rows] = await pool.query(
            'INSERT INTO appointment (date, doctor, patient, appointment_type, wasExecuted) VALUES (?, ?, ?, ?, ?)',
            [date, doctor, patient, appointment_type, wasExecuted]
        )
        res.send({
            id: rows.insertId,
            date, 
            doctor, 
            patient, 
            appointment_type, 
            wasExecuted
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
        const {date, doctor, patient, appointment_type, wasExecuted} = req.body
        const [rows] = await pool.query(
            'UPDATE appointment SET date = IFNULL(?, date), doctor = IFNULL(?, doctor), patient = IFNULL(?, patient), appointment_type = IFNULL(?, appointment_type), wasExecuted = IFNULL(?, wasExecuted) WHERE id = ?',
            [date, doctor, patient, appointment_type, wasExecuted]
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