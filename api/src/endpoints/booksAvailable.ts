import { Request, Response } from 'express';
import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

// Endpoint para obter livros disponíveis
export const getAvailableBooks = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT id, title FROM books WHERE available = true`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
