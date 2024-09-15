import { Api } from "./Api";

interface BookLoan {
    id: string;
    title: string;
    customer: string;
    author: string;
    publication_year: string;
    loan_date: string;
    return_date: string | null;
    actual_return_date: string | null;
    status: string;
}

interface UpdateBookLoanPayload {
    loanId: number;
    status: string;
    actualReturnDate?: string | null ;
}

interface CreateBookLoanPayload {
    bookId: number;
    startDate: string;
    customer: string;
}

interface Book {
    id: number;
    title: string;
}

// Função para obter os empréstimos
export async function getBookLoans(): Promise<BookLoan[]>{
    const {data} = await Api.get("/book-loans")
    return data
}

// Função para criar um empréstimo
export async function createBookLoan(payload: CreateBookLoanPayload) {
    const { bookId, startDate, customer } = payload;
    try {
        const response = await Api.post('/book-loan-create', {
            bookId,
            startDate,
            customer
        });

        if (response.status !== 201) {
            throw new Error('Erro ao criar o empréstimo');
        }

        return response.data;
    } catch (error) {
        console.error('Erro ao criar empréstimo:', error);
    }
}

// Função para buscar os livros disponíveis
export async function getAvailableBooks(): Promise<Book[]> {
    try {
        const { data } = await Api.get('/books-available');
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || 'Erro ao obter livros disponíveis');
        } else {
            throw new Error('Erro desconhecido');
        }
    }
}

// Função para atualizar um empréstimo
export async function updateBookLoan(payload: UpdateBookLoanPayload) {
    const { loanId, status, actualReturnDate } = payload;
    // Envia a requisição PUT para atualizar o status do empréstimo
    await Api.put(`/book-loan-update`, {
        loanId,
        status,
        actualReturnDate
    });
}

// Função para excluir um empréstimo
export async function deleteBookLoan(loanId: number) {
    try {
        // Envia a requisição DELETE para remover o empréstimo pelo ID
        const response = await Api.delete(`/book-loan-delete/${loanId}`);
        
        // Verifica se a resposta foi bem-sucedida
        if (response.status !== 200) {
            throw new Error('Erro ao excluir o empréstimo');
        }

        return response.data;  // Retorna a resposta da API
    } catch (error) {
        if(error instanceof Error) {
            // Lida com qualquer erro ocorrido durante a requisição
            throw new Error(error.message || 'Erro ao excluir o empréstimo');
        } else {
            throw new Error('Erro desconhecido')
        }
        
    }
}