import { config } from "dotenv";

config()

export const ENV = {
    PORT : process.env.PORT || 3000,
    DB_PORT : process.env.DB_PORT || 3306,
    DB_HOST : process.env.DB_HOST || 'localhost',
    DB_USER : process.env.DB_USER || 'root',
    DB_PASSWORD : process.env.DB_PASSWORD || 'S#amu3425',
    DB_DATABASE : process.env.DB_DATABASE || 'ipasmedb',
    SECRET_TOKEN_KEY : process.env.SECRET_TOKEN_KEY || 'ipasmedb'
}