import React, { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { getAvailableBooks, createBookLoan } from '../../services/BookLoansService'; // Atualize o caminho conforme necessário

// Definindo interfaces para os tipos
interface Book {
    id: number;
    title: string;
}

interface CreateBookLoanPayload {
    bookId: number;
    startDate: string;
    customer: string;
}

export function CreateBookLoan() {
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBookId, setSelectedBookId] = useState<string>('');
    const [customer, setCustomer] = useState<string>('');
    const [loanDate, setLoanDate] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const availableBooks = await getAvailableBooks();
                setBooks(availableBooks);
            } catch (error) {
                setError('Erro ao carregar livros disponíveis');
            }
        };

        fetchBooks();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedBookId || !customer || !loanDate) {
            setError('Todos os campos são obrigatórios');
            return;
        }

        try {
            await createBookLoan({
                bookId: parseInt(selectedBookId),
                startDate: loanDate,
                customer
            });
            setSuccess('Empréstimo criado com sucesso');
            setError('');
            setCustomer('');
            setLoanDate('');
            setSelectedBookId('');
        } catch (error) {
            setError('Erro ao criar o empréstimo');
            setSuccess('');
        }
    };

    return (
        <div>
            <h2>Criar Empréstimo</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="customer">
                    <Form.Label>Nome do Cliente</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Digite o nome do cliente" 
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)} 
                    />
                </Form.Group>

                <Form.Group controlId="loanDate">
                    <Form.Label>Data do Empréstimo</Form.Label>
                    <Form.Control 
                        type="date" 
                        value={loanDate}
                        onChange={(e) => setLoanDate(e.target.value)} 
                    />
                </Form.Group>

                <Form.Group controlId="book">
                    <Form.Label>Selecione o Livro</Form.Label>
                    <Form.Control 
                        as="select"
                        value={selectedBookId}
                        onChange={(e) => setSelectedBookId(e.target.value)}
                    >
                        <option value="">Selecione um livro</option>
                        {books.map(book => (
                            <option key={book.id} value={book.id}>
                                {book.title}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Criar Empréstimo
                </Button>
            </Form>
        </div>
    );
}
