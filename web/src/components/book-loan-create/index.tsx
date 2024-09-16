import React, { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { getAvailableBooks, createBookLoan } from '../../services/BookLoansService';

// Definindo interfaces para os tipos de livro
interface Book {
    id: number;
    title: string;
}

// Definindo interface para o payload de criação de empréstimos
interface CreateBookLoanPayload {
    bookId: number;
    startDate: string;
    customer: string;
}

export function CreateBookLoan() {
    const [books, setBooks] = useState<Book[]>([]); // Livros disponíveis
    const [selectedBookId, setSelectedBookId] = useState<string>(''); // Id do livro selecionado
    const [customer, setCustomer] = useState<string>(''); // Nome do cliente
    const [loanDate, setLoanDate] = useState<string>(''); // data do empréstimo
    const [error, setError] = useState<string>(''); // Mensagem de erro
    const [success, setSuccess] = useState<string>(''); // Mensagem de sucesso

    // Busca livros disponíveis
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

    // Função para o envio do formulário
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Verifica se os campos foram preenchidos
        if (!selectedBookId || !customer || !loanDate) {
            setError('Todos os campos são obrigatórios');
            return;
        }

        try {
            // cria o empréstimo
            await createBookLoan({
                bookId: parseInt(selectedBookId),
                startDate: loanDate,
                customer
            });

            // Em caso de sucesso, exibe mensagem e limpa os campos
            setSuccess('Empréstimo criado com sucesso');
            setError('');
            setCustomer('');
            setLoanDate('');
            setSelectedBookId('');
        } catch (error) {
            // Em caso de erro, exibe a mensagem de erro
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
