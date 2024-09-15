import { json, Request, Response } from "express"
import { Pool } from 'pg'

const pool = new Pool ({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
})


export const listBookLoans = async (req: Request, res: Response) => {
    try {
        console.log('Received request to list book loans');
        const result = await pool.query(`
             SELECT
                bl.id,
                b.title,
                bl.customer,
                bl.loan_date,
                bl.return_date,
                bl.actual_return_date,
                bl.status,
                bl.penalty
            FROM book_loans bl
            JOIN books b ON bl.book_id = b.id
        `);
        console.log('Query result:', result.rows);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error executing query:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

