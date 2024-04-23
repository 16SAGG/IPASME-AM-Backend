export const getTurn = async (req, res) =>{
    try{
        const [rows] = await pool.query('SELECT * FROM turn')
    
        res.json(rows)
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}