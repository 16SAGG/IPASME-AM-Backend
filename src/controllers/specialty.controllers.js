import { pool } from "../db.js";

export const getSpecialties = async (req, res) =>{
    try{
        const [rows] = await pool.query('SELECT * FROM specialty')
    
        res.json(rows)
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const getSpecialty = async (req, res) =>{
    try{
        const {id} = req.params
        const [rows] = await pool.query('SELECT * FROM specialty WHERE id = ?', [id])

        if (rows.length <= 0) return res.status(404).json({
            message: 'Specialty Not Found.'
        })

        res.json(rows[0])
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        }) 
    }
}