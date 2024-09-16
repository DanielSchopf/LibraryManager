import { Request, Response } from 'express';
import { Pool } from 'pg';
import { calculateReturnDate, adjustToNextMonday } from '../utils';

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432"),
});

// EndPoint para criar novos empréstimos
export const createBookLoan = async (req: Request, res: Response) => {

    const { bookId, startDate, customer } = req.body;

    if (!bookId || !startDate || !customer) {
        return res.status(400).json({ error: "Parâmetros bookId, startDate e customer são obrigatórios" });
    }

    // Calculos para definir o dia de entrega e ajustar caso seja no final de semana
    let returnDate = calculateReturnDate(new Date(startDate));
    returnDate = adjustToNextMonday(returnDate);

    try {
        // Inicia transação
        await pool.query('BEGIN');

        // Verifica disponibilidade do livro
        const checkBook = await pool.query(
            `SELECT available FROM books WHERE id = $1`,
            [bookId]
        );

        // Verifica se o livro existe
        if (!checkBook.rows.length) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ error: 'Livro não encontrado' });
        }

        // Verifica se o livro está disponível
        if (!checkBook.rows[0].available) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ error: 'Livro não está disponível para empréstimo' });
        }

        // Insere o empréstimo na tabela book_loans
        const result = await pool.query(
            `INSERT INTO book_loans (book_id, customer, loan_date, return_date, status) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [bookId, customer, startDate, returnDate, "emprestado"]
        );

        // Atualiza situação de disponibilidade do livro para FALSE
        await pool.query(
            `UPDATE books SET available = false WHERE id = $1`,
            [bookId]
        );

        // Confirma empréstimo
        await pool.query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Reverte empréstimo em caso de erro
        await pool.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    }
};
