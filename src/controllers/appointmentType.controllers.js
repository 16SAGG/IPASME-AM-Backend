import { pool } from "../db.js";

export const getAppointmentTypes = async (req, res) =>{
    try{
        const [rows] = await pool.query('SELECT * FROM appointment_type')
    
        res.json(rows)
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}