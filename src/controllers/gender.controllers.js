import { pool } from "../db.js";

export const getGenders = async (req, res) =>{
    try{
        const [rows] = await pool.query('SELECT * FROM gender')
    
        res.json(rows)
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}