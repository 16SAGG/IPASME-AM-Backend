export const getUserTypes = async (req, res) =>{
    try{
        const [rows] = await pool.query('SELECT * FROM user_type')
    
        res.json(rows)
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}