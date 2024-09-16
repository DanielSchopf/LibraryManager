import { Request, Response } from 'express';
import { Pool } from 'pg';
import { calculateFine } from '../utils';

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432"),
});

// EndPoint para atualizar status de um empréstimo
export const updateBookLoan = async (req: Request, res: Response) => {
    const { loanId, status, actualReturnDate } = req.body;

    try {
        await pool.query('BEGIN');

        // Busca o empréstimo pelo ID
        const loanResult = await pool.query(`
            SELECT book_id, return_date, status, penalty
            FROM book_loans
            WHERE id = $1
        `, [loanId]);

        const loan = loanResult.rows[0];

        if (!loan) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ error: 'Empréstimo não encontrado' });
        }

        // Verifica se o estado é válido (emprestado, devolvido, extraviado)
        if (!['emprestado','devolvido', 'extraviado'].includes(status)) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ error: 'Estado inválido.' });
        }

        // Se o status for "devolvido", calcular multa e atualizar disponibilidade
        let fine = 0;
        let actualReturn = actualReturnDate ? new Date(actualReturnDate) : null;

        if (status === 'devolvido') {
            if (!actualReturnDate) {
                await pool.query('ROLLBACK');
                return res.status(400).json({ error: 'Data de devolução é necessária.' });
            }

            const expectedReturnDate = new Date(loan.return_date);
            const actualReturnDateObj = new Date(actualReturnDate);

            // Calcula a multa, se houver atraso
            fine = calculateFine(expectedReturnDate, actualReturnDateObj);

            // Atualiza a disponibilidade do livro
            await pool.query(`
                UPDATE books
                SET available = true
                WHERE id = $1
            `, [loan.book_id]);
        } else if (status === 'emprestado') {
            // Se o status for alterado para "emprestado", zera a multa e a data real de devolução
            fine = 0;
            actualReturn = null;
        }

        // Atualiza o estado do empréstimo, a data real de devolução e a multa
        await pool.query(`
            UPDATE book_loans
            SET status = $1, actual_return_date = $2, penalty = $3
            WHERE id = $4
        `, [status, actualReturn, fine, loanId]);

        // Confirma a transação
        await pool.query('COMMIT');

        res.status(200).json({ message: 'Empréstimo atualizado com sucesso', fine });
    } catch (error) {
        // Reverte em caso de erro
        await pool.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    }
};
