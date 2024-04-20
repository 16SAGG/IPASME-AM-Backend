import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { ENV } from "../config.js";

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

export const createUser = async (req, res) =>{
    try{
        const {name, last_name, ci, email, password, user_type, specialty, turn, birthdate, gender} = req.body
        const encryptPassword = async (password) =>{
            const salt = await bcrypt.genSalt(10)
            return await bcrypt.hash(password, salt)
        }
        const encryptedPassword = await encryptPassword(password)

        const [rows] = await pool.query(
            'INSERT INTO user (name, last_name, ci, email, password, user_type, specialty, turn, birthdate, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, last_name, ci, email, encryptedPassword, user_type, specialty, turn, birthdate, gender]
        )

        const token = jwt.sign({id: email}, ENV.SECRET_TOKEN_KEY, {expiresIn: 86400})

        res.send({
            id: rows.insertId,
            name,
            last_name,
            ci,
            email,
            encryptedPassword,
            user_type,
            specialty,
            turn,
            birthdate,
            gender,
            token
        })
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
        const {name, last_name, ci, email, password, user_type, specialty, turn, birthdate, gender} = req.body
        const [rows] = await pool.query(
            'UPDATE user SET name = IFNULL(?, name), last_name = IFNULL(?, last_name), ci = IFNULL(?, ci), email = IFNULL(?, email), password = IFNULL(?, password), user_type = IFNULL(?, user_type), specialty = IFNULL(?, specialty), turn = IFNULL(?, turn), birthdate = IFNULL(?, birthdate), gender = IFNULL(?, gender) WHERE id = ?',
            [name, last_name, ci, email, password, user_type, specialty, turn, birthdate, gender, id]
        )

        if (rows.affectedRows <= 0) return res.status(404).json({
            message: 'User Not Found.'
        })

        const [updatedRows] = await pool.query('SELECT * FROM user WHERE id = ?', [id])

        res.send(updatedRows)
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