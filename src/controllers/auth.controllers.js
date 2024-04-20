import { pool } from "../db.js"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { ENV } from "../config.js";

export const signIn = async (req, res) =>{
    try{
        const {email, password} = req.body
        const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email])

        if (rows.length <= 0) return res.status(404).json({
            message: 'User Not Found.'
        })

        const comparePassword = async (password, hashPassword) =>{
            return await bcrypt.compare(password, hashPassword)
        }

        const matchPassword = await comparePassword(password, rows[0].password)

        if (!matchPassword) return res.status(401).json({
            message: 'Invalid Password'
        })

        const token = jwt.sign({id: email}, ENV.SECRET_TOKEN_KEY, {expiresIn: 86400})

        res.json({
            token
        })
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        }) 
    }
}

export const signUp = async (req, res) =>{
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