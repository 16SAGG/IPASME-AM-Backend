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
        const {date, doctor, patient, description} = req.body
        const [rows] = await pool.query(
            'INSERT INTO medical_history (date, doctor, patient, description) VALUES (?, ?, ?, ?)',
            [date, doctor, patient, description]
        )
        res.send({
            id: rows.insertId,
            date, 
            doctor, 
            patient, 
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
        const {date, doctor, patient, description} = req.body
        const [rows] = await pool.query(
            'UPDATE medical_history SET date = IFNULL(?, date), doctor = IFNULL(?, doctor), patient = IFNULL(?, patient), description = IFNULL(?, description) WHERE id = ?',
            [date, doctor, patient, description]
        )

        if (rows.affectedRows <= 0) return res.status(404).json({
            message: 'Medical History Not Found.'
        })

        const [updatedRows] = await pool.query('SELECT * FROM medical_history WHERE id = ?', [id])

        res.send(updatedRows)
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