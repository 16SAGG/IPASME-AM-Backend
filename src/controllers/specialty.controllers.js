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