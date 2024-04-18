import { createPool } from "mysql2/promise";

import { ENV } from "./config.js";

console.log(ENV)

export const pool = createPool({
    host: ENV.DB_HOST,
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    port: ENV.DB_PORT,
    database: ENV.DB_DATABASE
})