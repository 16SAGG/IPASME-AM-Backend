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