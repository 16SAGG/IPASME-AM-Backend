import { pool } from "../db.js";

export const getMedicalHistories = async (req, res) =>{
    try{
        const [rows] = await pool.query('SELECT * FROM medical_history')
    
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
        const [rows] = await pool.query('SELECT mh.mh_date, p.ci, specialty FROM medical_history AS mh JOIN patient AS p ON p.id = mh.patient JOIN specialty AS s ON mh.specialty = s.id')
    
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

        const [medicalHistoryRows] = await pool.query('SELECT * FROM medical_history WHERE patient = ?', [patient_id])

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
        const [rows] = await pool.query('SELECT * FROM medical_history WHERE id = ?', [id])

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
        const {mh_date, doctor, patient, description, specialty} = req.body
        const [rows] = await pool.query(
            'INSERT INTO medical_history (mh_date, doctor, patient, description, specialty) VALUES (?, ?, ?, ?)',
            [mh_date, doctor, patient, description, specialty]
        )
        res.send({
            id: rows.insertId,
            mh_date, 
            doctor, 
            patient, 
            description,
            specialty
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
        const {mh_date, doctor, patient, description, specialty} = req.body
        const [rows] = await pool.query(
            'UPDATE medical_history SET mh_date = IFNULL(?, mh_date), doctor = IFNULL(?, doctor), patient = IFNULL(?, patient), description = IFNULL(?, description), specialty = IFNULL(?, specialty) WHERE id = ?',
            [mh_date, doctor, patient, description, specialty, id]
        )

        if (rows.affectedRows <= 0) return res.status(404).json({
            message: 'Medical History Not Found.'
        })

        const [updatedRows] = await pool.query('SELECT * FROM medical_history WHERE id = ?', [id])

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
        const [rows] = await pool.query('DELETE FROM medical_history WHERE id = ?', [id])

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