import { pool } from "../db.js";

export const getPatients = async (req, res) =>{
    try{
        const [rows] = await pool.query('SELECT * FROM patient')
    
        res.json(rows)
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const getPatient = async (req, res) =>{
    try{
        const {id} = req.params
        const [rows] = await pool.query('SELECT * FROM patient WHERE id = ?', [id])

        if (rows.length <= 0) return res.status(404).json({
            message: 'Patient Not Found.'
        })

        res.json(rows[0])
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        }) 
    }
}

export const getPatientsSeenBySpecialtyOnADate = async (req, res) =>{
    try{
        const {id_specialty, month, year} = req.params
        
        const [rows] = await pool.query(
            `SELECT p.id, p.birthdate, p.gender FROM medicalHistory AS mh 
            JOIN appointment AS a ON mh.appointment = a.id
            JOIN patient AS p ON a.patient = p.id 
            WHERE a.specialty = ? AND MONTH(a.date) = ? AND YEAR(a.date) = ?`,
            [id_specialty, month, year]
        )//
    
        res.json(rows)
    }
    catch{
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const createPatient = async (req, res) =>{
    try{
        const {name, lastName, ci, email, phone, birthdate, address, gender} = req.body
        const [rows] = await pool.query(
            'INSERT INTO patient (name, lastName, ci, email, phone, birthdate, address, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, lastName, ci, email, phone, birthdate, address, gender]
        )
        res.send({
            id: rows.insertId,
            name, 
            lastName, 
            ci, 
            email, 
            phone, 
            birthdate, 
            address, 
            gender
        })
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const updatePatient = async (req, res) => {
    try{
        const {id} = req.params
        const {name, lastName, ci, email, phone, birthdate, address, gender} = req.body
        const [rows] = await pool.query(
            'UPDATE patient SET name = IFNULL(?, name), lastName = IFNULL(?, lastName), ci = IFNULL(?, ci), email = IFNULL(?, email), phone = IFNULL(?, phone), birthdate = IFNULL(?, birthdate), address = IFNULL(?, address), gender = IFNULL(?, gender) WHERE id = ?',
            [name, lastName, ci, email, phone, birthdate, address, gender, id]
        )

        if (rows.affectedRows <= 0) return res.status(404).json({
            message: 'Patient Not Found.'
        })

        const [updatedRows] = await pool.query('SELECT * FROM patient WHERE id = ?', [id])

        res.send(updatedRows[0])
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const deletePatient = async (req, res) =>{
    try{
        const {id} = req.params
        const [rows] = await pool.query('DELETE FROM patient WHERE id = ?', [id])

        if (rows.affectedRows <= 0) return res.status(404).json({
            message: 'Patient Not Found.'
        })

        res.sendStatus(204)
    }
    catch{
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}