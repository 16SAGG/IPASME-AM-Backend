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

export const getAppointmentsWithDoctorAndPatient = async (req, res) =>{
    try{
        const [rows] = await pool.query(`
            SELECT 
                a.id, 
                a.date, 
                a.specialty,
                s.name AS specialty_name,
                a.turn, 
                u.ci AS doctor_id, 
                u.name AS doctor_name, 
                u.lastName AS doctor_last, 
                p.ci AS patient_id, 
                p.name AS patient_name, 
                p.lastName AS patient_last 
            FROM appointment AS a 
            JOIN patient AS p ON a.patient = p.id 
            JOIN user AS u ON a.doctor = u.id 
            JOIN specialty AS s ON a.specialty = s.id
            ORDER BY id DESC`)
    
        res.json(rows)
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const getAppointmentsWithDoctorAndPatientByID = async (req, res) =>{
    try{
        const {id} = req.params
        const [rows] = await pool.query('SELECT a.id, a.date, a.specialty, a.turn, u.ci AS doctor_id, u.name AS doctor_name, u.lastName AS doctor_last, p.ci AS patient_id, p.name AS patient_name, p.lastName AS patient_last FROM appointment AS a JOIN patient AS p ON a.patient = p.id JOIN user AS u ON a.doctor = u.id WHERE a.id = ?',
        [id])
    
        res.json(rows[0])
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const getAppointmentsNotIncludesInAMedicalHistory = async (req, res) =>{
    try{
        const [rows] = await pool.query(`SELECT a.id
        FROM appointment AS a
        WHERE NOT EXISTS (
            SELECT *
            FROM medicalHistory AS mh
            WHERE mh.appointment = a.id
        )`)
    
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
        const {doctor_id, year, month, day} = req.params
        const [doctorRows] = await pool.query('SELECT * FROM user WHERE id = ? AND userType = 1', [doctor_id])
        
        if (doctorRows.length <= 0) return res.status(404).json({
            message: 'Doctor Not Found.'
        })
        
        const dateFormat = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

        const [appointmentRows] = await pool.query(`
        SELECT a.id, a.date, s.name AS specialty_name, a.specialty, a.turn, u.ci AS doctor_id, u.name AS doctor_name, u.lastName AS doctor_last, p.ci AS patient_id, p.name AS patient_name, p.lastName AS patient_last 
        FROM appointment AS a 
        JOIN patient AS p ON a.patient = p.id 
        JOIN user AS u ON a.doctor = u.id
        JOIN specialty AS s On s.id = a.specialty
        WHERE a.doctor = ?
        AND NOT EXISTS (
            SELECT *
            FROM medicalHistory AS mh
            WHERE mh.appointment = a.id
        )
        AND a.date = ?
        ORDER BY a.date ASC
        `, 
        [doctor_id, dateFormat])
    
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
        const {date, doctor, patient, appointmentType, specialty, turn} = req.body
        const [rows] = await pool.query(
            'INSERT INTO appointment (date, doctor, patient, type, specialty, turn) VALUES (?, ?, ?, ?, ?, ?)',
            [date, doctor, patient, appointmentType, specialty, turn]
        )
        res.send({
            id: rows.insertId,
            date, 
            doctor, 
            patient, 
            appointmentType, 
            specialty,
            turn
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
        const {date, doctor, patient, appointmentType, specialty, turn} = req.body
        const [rows] = await pool.query(
            'UPDATE appointment SET date = IFNULL(?, date), doctor = IFNULL(?, doctor), patient = IFNULL(?, patient), type = IFNULL(?, type), specialty = IFNULL(?, specialty), turn = IFNULL(?, turn) WHERE id = ?',
            [date, doctor, patient, appointmentType, specialty, turn, id]
        )

        if (rows.affectedRows <= 0) return res.status(404).json({
            message: 'Appointment Not Found.'
        })

        const [updatedRows] = await pool.query('SELECT * FROM appointment WHERE id = ?', [id])

        res.send(updatedRows[0])
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