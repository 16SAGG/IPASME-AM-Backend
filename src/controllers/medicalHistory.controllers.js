import XlsxPopulate from "xlsx-populate";
import { pool } from "../db.js";

export const getMedicalHistories = async (req, res) =>{
    try{
        const [rows] = await pool.query('SELECT * FROM medicalHistory')
    
        res.json(rows)
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const getMedicalHistoriesWithPatientCIAndSpecialty = async (req, res) =>{
    try{
        const [rows] = await pool.query(`SELECT 
        mh.id, a.date, p.ci, p.name, p.lastName, s.name AS specialty, t.name AS turn
        FROM medicalHistory AS mh 
        JOIN appointment AS a ON mh.appointment = a.id
        JOIN patient AS p ON a.patient = p.id
        JOIN specialty AS s ON a.specialty = s.id
        JOIN turn AS t ON a.turn = t.id
        ORDER BY id DESC
        `)
        //
        res.json(rows)
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const getMedicalHistoriesByPatient = async (req, res) =>{
    try{
        const {patient_id} = req.params

        const [patientRows] = await pool.query('SELECT * FROM patient WHERE id = ?', [patient_id])

        if (patientRows.length <= 0) return res.status(404).json({
            message: 'Patient Not Found.'
        })

        const [medicalHistoryRows] = await pool.query(
            `SELECT a.date, mh.description, u.name AS doctor_name, u.lastName, u.ci, s.name AS specialty_name, t.name AS turn FROM medicalHistory AS mh 
            JOIN appointment AS a ON mh.appointment = a.id 
            JOIN user AS u ON a.doctor = u.id
            JOIN specialty AS s ON a.specialty = s.id
            JOIN turn AS t ON a.turn = t.id
            WHERE patient = ?
            ORDER BY id DESC`
            , [patient_id])

        res.json(medicalHistoryRows)
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const getMedicalHistory = async (req, res) =>{
    try{
        const {id} = req.params
        const [rows] = await pool.query('SELECT * FROM medicalHistory WHERE id = ?', [id])

        if (rows.length <= 0) return res.status(404).json({
            message: 'Medical History Not Found.'
        })

        res.json(rows[0])
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        }) 
    }
}

export const createMedicalHistory = async (req, res) =>{
    try{
        const {appointment, description} = req.body
        const [rows] = await pool.query(
            'INSERT INTO medicalHistory (appointment, description) VALUES ( ?, ?)',
            [appointment, description]
        )
        res.send({
            id: rows.insertId,
            appointment,  
            description
        })
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const updateMedicalHistory= async (req, res) => {
    try{
        const {id} = req.params
        const {description} = req.body
        const [rows] = await pool.query(
            'UPDATE medicalHistory SET description = IFNULL(?, description) WHERE id = ?',
            [description, id]
        )

        if (rows.affectedRows <= 0) return res.status(404).json({
            message: 'Medical History Not Found.'
        })

        const [updatedRows] = await pool.query('SELECT * FROM medicalHistory WHERE id = ?', [id])

        res.send(updatedRows[0])
    }
    catch {
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const deleteMedicalHistory = async (req, res) =>{
    try{
        const {id} = req.params
        const [rows] = await pool.query('DELETE FROM medicalHistory WHERE id = ?', [id])

        if (rows.affectedRows <= 0) return res.status(404).json({
            message: 'Medical History Not Found.'
        })

        res.sendStatus(204)
    }
    catch{
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}

export const exportReportToExcel = async(req, res) =>{
    try{
        const year = new Date().getFullYear()
        const month = new Date().getMonth() + 1
        const day = new Date().getDate()

        const workbook = await XlsxPopulate.fromBlankAsync()
        
        const sheet = workbook.sheet(0)

        const yearHead = sheet.cell("A1")
        yearHead.value(`${year}`)

        const specialtyHead = sheet.cell("A2")
        specialtyHead.value("ESPECIALIDAD")

        const JAN_MAR_rangeHead = sheet.range("B1:F1");
        JAN_MAR_rangeHead.merged(true)
        JAN_MAR_rangeHead.value('ENERO-MARZO')
        const JAN_MAR_manHead = sheet.cell("B2")
        JAN_MAR_manHead.value("Hombres")
        const JAN_MAR_womanHead = sheet.cell("C2")
        JAN_MAR_womanHead.value("Mujeres")
        const JAN_MAR_childrenHead = sheet.cell("D2")
        JAN_MAR_childrenHead.value("Niños")
        const JAN_MAR_adultsHead = sheet.cell("E2")
        JAN_MAR_adultsHead.value("Adultos")
        const JAN_MAR_oldmanHead = sheet.cell("F2")
        JAN_MAR_oldmanHead.value("Tercera Edad")
        
        const APR_JUN_rangeHead = sheet.range("G1:K1");
        APR_JUN_rangeHead.merged(true)
        APR_JUN_rangeHead.value('ABRIL-JUNIO')
        const APR_JUN_manHead = sheet.cell("G2")
        APR_JUN_manHead.value("Hombres")
        const APR_JUN_womanHead = sheet.cell("H2")
        APR_JUN_womanHead.value("Mujeres")
        const APR_JUN_childrenHead = sheet.cell("I2")
        APR_JUN_childrenHead.value("Niños")
        const APR_JUN_adultsHead = sheet.cell("J2")
        APR_JUN_adultsHead.value("Adultos")
        const APR_JUN_oldmanHead = sheet.cell("K2")
        APR_JUN_oldmanHead.value("Tercera Edad")

        const JUL_SEP_rangeHead = sheet.range("L1:P1");
        JUL_SEP_rangeHead.merged(true)
        JUL_SEP_rangeHead.value('JULIO-SEPTIEMBRE')
        const JUL_SEP_manHead = sheet.cell("L2")
        JUL_SEP_manHead.value("Hombres")
        const JUL_SEP_womanHead = sheet.cell("M2")
        JUL_SEP_womanHead.value("Mujeres")
        const JUL_SEP_childrenHead = sheet.cell("N2")
        JUL_SEP_childrenHead.value("Niños")
        const JUL_SEP_adultsHead = sheet.cell("O2")
        JUL_SEP_adultsHead.value("Adultos")
        const JUL_SEP_oldmanHead = sheet.cell("P2")
        JUL_SEP_oldmanHead.value("Tercera Edad")

        const OCT_DEC_rangeHead = sheet.range("Q1:U1");
        OCT_DEC_rangeHead.merged(true)
        OCT_DEC_rangeHead.value('OCTUBRE-DICIEMBRE')
        const OCT_DEC_manHead = sheet.cell("Q2")
        OCT_DEC_manHead.value("Hombres")
        const OCT_DEC_womanHead = sheet.cell("R2")
        OCT_DEC_womanHead.value("Mujeres")
        const OCT_DEC_childrenHead = sheet.cell("S2")
        OCT_DEC_childrenHead.value("Niños")
        const OCT_DEC_adultsHead = sheet.cell("T2")
        OCT_DEC_adultsHead.value("Adultos")
        const OCT_DEC_oldmanHead = sheet.cell("U2")
        OCT_DEC_oldmanHead.value("Tercera Edad")

        const total_rangeHead = sheet.range("V1:Z1");
        total_rangeHead.merged(true)
        total_rangeHead.value('TOTAL')
        const total_manHead = sheet.cell("V2")
        total_manHead.value("Hombres")
        const total_womanHead = sheet.cell("W2")
        total_womanHead.value("Mujeres")
        const total_childrenHead = sheet.cell("X2")
        total_childrenHead.value("Niños")
        const total_adultsHead = sheet.cell("Y2")
        total_adultsHead.value("Adultos")
        const total_oldmanHead = sheet.cell("Z2")
        total_oldmanHead.value("Tercera Edad")

        const [specialtiesRows] = await pool.query('SELECT * FROM specialty')

        const specialtiesResults = specialtiesRows.map(async(specialty, index) =>{
            let JAN_MAR = {
                man: 0,
                woman: 0,
                children: 0,
                adults: 0,
                oldmans: 0,
            }
            let APR_JUN = {
                man: 0,
                woman: 0,
                children: 0,
                adults: 0,
                oldmans: 0,
            }
            let JUL_SEP = {
                man: 0,
                woman: 0,
                children: 0,
                adults: 0,
                oldmans: 0,
            }
            let OCT_DEC = {
                man: 0,
                woman: 0,
                children: 0,
                adults: 0,
                oldmans: 0,
            }
            
            const [rowsJAN_MAR] = await pool.query(
                `SELECT p.id, p.birthdate, p.gender FROM medicalHistory AS mh 
                JOIN appointment AS a ON mh.appointment = a.id
                JOIN patient AS p ON a.patient = p.id 
                WHERE a.specialty = ? AND MONTH(a.date) BETWEEN ? AND ? AND YEAR(a.date) = ?`,
                [specialty.id, 1, 3, year]
            )
            await rowsJAN_MAR.map((result) =>{
                const age = year - new Date(result.birthdate).getFullYear()
                JAN_MAR.man += (result.gender === 0) ? 1 : 0
                JAN_MAR.woman += (result.gender !== 0) ? 1 : 0
                JAN_MAR.children += (age < 18) ? 1 : 0
                JAN_MAR.adults += (age >= 18 && age < 65) ? 1 : 0
                JAN_MAR.oldmans += (age >= 65) ? 1 : 0
            })

            const [rowsAPR_JUN] = await pool.query(
                `SELECT p.id, p.birthdate, p.gender FROM medicalHistory AS mh 
                JOIN appointment AS a ON mh.appointment = a.id
                JOIN patient AS p ON a.patient = p.id 
                WHERE a.specialty = ? AND MONTH(a.date) BETWEEN ? AND ? AND YEAR(a.date) = ?`,
                [specialty.id, 4, 6, year]
            )
            await rowsAPR_JUN.map((result) =>{
                const age = year - new Date(result.birthdate).getFullYear()
                APR_JUN.man += (result.gender === 0) ? 1 : 0
                APR_JUN.woman += (result.gender !== 0) ? 1 : 0
                APR_JUN.children += (age < 18) ? 1 : 0
                APR_JUN.adults += (age >= 18 && age < 65) ? 1 : 0
                APR_JUN.oldmans += (age >= 65) ? 1 : 0
            })

            const [rowsJUL_SEP] = await pool.query(
                `SELECT p.id, p.birthdate, p.gender FROM medicalHistory AS mh 
                JOIN appointment AS a ON mh.appointment = a.id
                JOIN patient AS p ON a.patient = p.id 
                WHERE a.specialty = ? AND MONTH(a.date) BETWEEN ? AND ? AND YEAR(a.date) = ?`,
                [specialty.id, 7, 9, year]
            )
            await rowsJUL_SEP.map((result) =>{
                const age = year - new Date(result.birthdate).getFullYear()
                JUL_SEP.man += (result.gender === 0) ? 1 : 0
                JUL_SEP.woman += (result.gender !== 0) ? 1 : 0
                JUL_SEP.children += (age < 18) ? 1 : 0
                JUL_SEP.adults += (age >= 18 && age < 65) ? 1 : 0
                JUL_SEP.oldmans += (age >= 65) ? 1 : 0
            })

            const [rowsOCT_DEC] = await pool.query(
                `SELECT p.id, p.birthdate, p.gender FROM medicalHistory AS mh 
                JOIN appointment AS a ON mh.appointment = a.id
                JOIN patient AS p ON a.patient = p.id 
                WHERE a.specialty = ? AND MONTH(a.date) BETWEEN ? AND ? AND YEAR(a.date) = ?`,
                [specialty.id, 10, 12, year]
            )
            await rowsOCT_DEC.map((result) =>{
                const age = year - new Date(result.birthdate).getFullYear()
                OCT_DEC.man += (result.gender === 0) ? 1 : 0
                OCT_DEC.woman += (result.gender !== 0) ? 1 : 0
                OCT_DEC.children += (age < 18) ? 1 : 0
                OCT_DEC.adults += (age >= 18 && age < 65) ? 1 : 0
                OCT_DEC.oldmans += (age >= 65) ? 1 : 0
            })

            return {JAN_MAR, APR_JUN, JUL_SEP, OCT_DEC}
        })

        specialtiesResults.map(async (result, index) =>{
            const res = await result
            specialtiesRows[index]['name']

            sheet.cell(`A${index + 3}`).value(specialtiesRows[index]['name'])
            sheet.cell(`B${index + 3}`).value(res['JAN_MAR']['man'])
            sheet.cell(`C${index + 3}`).value(res['JAN_MAR']['woman'])
            sheet.cell(`D${index + 3}`).value(res['JAN_MAR']['children'])
            sheet.cell(`E${index + 3}`).value(res['JAN_MAR']['adults'])
            sheet.cell(`F${index + 3}`).value(res['JAN_MAR']['oldmans'])

            sheet.cell(`G${index + 3}`).value(res['APR_JUN']['man'])
            sheet.cell(`H${index + 3}`).value(res['APR_JUN']['woman'])
            sheet.cell(`I${index + 3}`).value(res['APR_JUN']['children'])
            sheet.cell(`J${index + 3}`).value(res['APR_JUN']['adults'])
            sheet.cell(`K${index + 3}`).value(res['APR_JUN']['oldmans'])

            sheet.cell(`L${index + 3}`).value(res['JUL_SEP']['man'])
            sheet.cell(`M${index + 3}`).value(res['JUL_SEP']['woman'])
            sheet.cell(`N${index + 3}`).value(res['JUL_SEP']['children'])
            sheet.cell(`O${index + 3}`).value(res['JUL_SEP']['adults'])
            sheet.cell(`P${index + 3}`).value(res['JUL_SEP']['oldmans'])

            sheet.cell(`Q${index + 3}`).value(res['OCT_DEC']['man'])
            sheet.cell(`R${index + 3}`).value(res['OCT_DEC']['woman'])
            sheet.cell(`S${index + 3}`).value(res['OCT_DEC']['children'])
            sheet.cell(`T${index + 3}`).value(res['OCT_DEC']['adults'])
            sheet.cell(`U${index + 3}`).value(res['OCT_DEC']['oldmans'])

            sheet.cell(`V${index + 3}`).value(res['JAN_MAR']['man'] + res['APR_JUN']['man'] + res['JUL_SEP']['man'] + res['OCT_DEC']['man'])
            sheet.cell(`W${index + 3}`).value(res['JAN_MAR']['woman'] + res['APR_JUN']['woman'] + res['JUL_SEP']['woman'] + res['OCT_DEC']['woman'])
            sheet.cell(`X${index + 3}`).value(res['JAN_MAR']['children'] + res['APR_JUN']['children'] + res['JUL_SEP']['children'] + res['OCT_DEC']['children'])
            sheet.cell(`Y${index + 3}`).value(res['JAN_MAR']['adults'] + res['APR_JUN']['adults'] + res['JUL_SEP']['adults'] + res['OCT_DEC']['adults'])
            sheet.cell(`Z${index + 3}`).value(res['JAN_MAR']['oldmans'] + res['APR_JUN']['oldmans'] + res['JUL_SEP']['oldmans'] + res['OCT_DEC']['oldmans'])

            workbook.toFileAsync('./src/media/report.xlsx')
        })

        

        res.sendStatus(204)
    }
    catch{
        return res.status(500).json({
            message : 'Something Goes Wrong'
        })
    }
}