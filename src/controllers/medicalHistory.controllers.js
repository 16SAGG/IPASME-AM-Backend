import { pool } from "../db.js";

export const getMedicalHistories = async (req, res) =>{
    try{
        const [rows] = await pool.query('SELECT * FROM medicalHistory')
    
        res.json(rows)
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const getMedicalHistoriesWithPatientCIAndSpecialty = async (req, res) =>{
    try{
        const [rows] = await pool.query(`SELECT 
        mh.id, a.date, p.ci, s.name 
        FROM medicalHistory AS mh 
        JOIN appointment AS a ON mh.appointment = a.id
        JOIN patient AS p ON a.patient = p.id
        JOIN specialty AS s ON a.specialty = s.id`)
    
        res.json(rows)
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const getMedicalHistoriesByPatient = async (req, res) =>{
    try{
        const {patient_id} = req.params

        const [patientRows] = await pool.query('SELECT * FROM patient WHERE id = ?', [patient_id])

        if (patientRows.length <= 0) return res.status(404).json({
            message: 'Patient Not Found.'
        })

        const [medicalHistoryRows] = await pool.query(
            `SELECT a.appointment_date, mh.description, u.name AS doctor_name, u.last_name, u.ci, s.name AS specialty_name FROM medicalHistory AS mh 
            JOIN appointment AS a ON mh.appointment = a.id 
            JOIN user AS u ON a.doctor = u.id
            JOIN specialty AS s ON a.specialty = s.id
            WHERE patient = ?`
            , [patient_id])

        res.json(medicalHistoryRows)
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const getMedicalHistory = async (req, res) =>{
    try{
        const {id} = req.params
        const [rows] = await pool.query('SELECT * FROM medicalHistory WHERE id = ?', [id])

        if (rows.length <= 0) return res.status(404).json({
            message: 'Medical History Not Found.'
        })

        res.json(rows[0])
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        }) 
    }
}

export const createMedicalHistory = async (req, res) =>{
    try{
        const {appointment, description} = req.body
        const [rows] = await pool.query(
            'INSERT INTO medicalHistory (appointment, description) VALUES ( ?, ?)',
            [appointment, description]
        )
        res.send({
            id: rows.insertId,
            appointment,  
            description
        })
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const updateMedicalHistory= async (req, res) => {
    try{
        const {id} = req.params
        const {description} = req.body
        const [rows] = await pool.query(
            'UPDATE medicalHistory SET description = IFNULL(?, description) WHERE id = ?',
            [description, id]
        )

        if (rows.affectedRows <= 0) return res.status(404).json({
            message: 'Medical History Not Found.'
        })

        const [updatedRows] = await pool.query('SELECT * FROM medicalHistory WHERE id = ?', [id])

        res.send(updatedRows[0])
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const deleteMedicalHistory = async (req, res) =>{
    try{
        const {id} = req.params
        const [rows] = await pool.query('DELETE FROM medicalHistory WHERE id = ?', [id])

        if (rows.affectedRows <= 0) return res.status(404).json({
            message: 'Medical History Not Found.'
        })

        res.sendStatus(204)
    }
    catch{
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}