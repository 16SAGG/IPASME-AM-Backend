import { pool } from "../db.js";

export const getUsers = async (req, res) =>{
    try{
        const [rows] = await pool.query('SELECT * FROM user')
    
        res.json(rows)
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const getUser = async (req, res) =>{
    try{
        const {id} = req.params
        const [rows] = await pool.query('SELECT * FROM user WHERE id = ?', [id])

        if (rows.length <= 0) return res.status(404).json({
            message: 'User Not Found.'
        })

        res.json(rows[0])
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        }) 
    }
}

export const getDoctors = async (req, res) =>{
    try{
        const {id} = req.params
        const [rows] = await pool.query('SELECT * FROM user WHERE userType = 1', [id])

        res.json(rows)
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        }) 
    }
}

export const getDoctorsBySpecialtyAndTurn = async (req, res) =>{
    try{
        const {specialty, turn} = req.params
        const [rows] = await pool.query('SELECT * FROM user WHERE userType = 1 AND specialty = ? AND turn = ?', [specialty, turn])

        res.json(rows)
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        }) 
    }
}


export const updateUser = async (req, res) => {
    try{
        const {id} = req.params
        const {name, lastName, userType, specialty, turn, birthdate, gender} = req.body
        const [rows] = await pool.query(
            'UPDATE user SET name = IFNULL(?, name), lastName = IFNULL(?, lastName), userType = IFNULL(?, userType), specialty = IFNULL(?, specialty), turn = IFNULL(?, turn), birthdate = IFNULL(?, birthdate), gender = IFNULL(?, gender) WHERE id = ?',
            [name, lastName, userType, specialty, turn, birthdate, gender, id]
        )

        if (rows.affectedRows <= 0) return res.status(404).json({
            message: 'User Not Found.'
        })

        const [updatedRows] = await pool.query('SELECT * FROM user WHERE id = ?', [id])

        res.send(updatedRows[0])
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const deleteUser = async (req, res) =>{
    try{
        const {id} = req.params
        const [rows] = await pool.query('DELETE FROM user WHERE id = ?', [id])

        if (rows.affectedRows <= 0) return res.status(404).json({
            message: 'User Not Found.'
        })

        res.sendStatus(204)
    }
    catch{
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}