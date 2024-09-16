import { Request, Response } from 'express';
import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

// EndPoint para deletar um empréstimo

export const deleteBookLoan = async (req: Request, res: Response) => {
    const { loanId } = req.params;

    try {
        await pool.query('BEGIN');

        // Verifica se o empréstimo existe
        const loanCheck = await pool.query(
            `SELECT book_id, status FROM book_loans WHERE id = $1`,
            [loanId]
        );
        
        if (!loanCheck.rows.length) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ error: 'Empréstimo não encontrado' });
        }

        const { book_id, status } = loanCheck.rows[0];

        // Se o status for 'emprestado', o livro deve ser marcado como disponível
        if (status === 'emprestado') {
            await pool.query(
                `UPDATE books SET available = true WHERE id = $1`,
                [book_id]
            );
        }

        // Exclui o empréstimo
        await pool.query(
            `DELETE FROM book_loans WHERE id = $1`,
            [loanId]
        );

        // Confirma a transação
        await pool.query('COMMIT');
        res.status(200).json({ message: 'Empréstimo excluído com sucesso' });
    } catch (error) {
        // Reverte transação em caso de erro
        await pool.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    }
};
