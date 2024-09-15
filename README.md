# Visão Geral

Este projeto tem como objetivo desenvolver uma aplicação de gerenciamento de empréstimos de livros. Nele, é permitido que o usuário registrem, atualizem, visualizem e deletem empréstimos de livros. Além disso, ele também calcula multas por devoluções atrasadas. A aplicação utiliza **React** para front-end e **Node.js** com **PostgreSQL** para o back-end, sendo executada em conteiners Docker.

A fase atual do projeto apresenta apenas 3 livros no seu banco de dados, uma vez que o objetivo dessa primeira versão era implementar as funcionalidades de CRUD para o sistema em questão.

## Estrutura do Front-End

O front-end foi desenvolvido em React, utilizando componentes para organizar as funcionalidades.
- CreateBookLoan: Esse componente é o formulário onde o usuário poderá criar um novo empréstimo. Nesse formulário, é possível selecionar apenas os livros disponíveis, necessitando apenas do nome do cliente e da data em que o empréstimo foi realizado.

- BookLoanList: Esse componente exibe a lista de todos os empréstimos de livros. Para cada empréstimo, mostra o ID, nome do cliente, livro emprestado, data de empréstimo, data de devolução, data real em que o livro foi devolvido e a multa. Também nesse componente é possível acessar a edição e exclusão através de botões presentes na coluna ações.

## Estrutura do Back-End

O banco de dados **library** contém as seguintes tabelas:

- Books: É a tabela onde os livros disponíveis na biblioteca são armazenados.

    - **id**: Identificador único do livro.
    - **title**: Título do livro.
    - **author**: Autor do livro.
    - **publication_year**: Ano de publicação.
    - **available**: Status de disponibilidade do livro (true para disponível, false para indisponível).


- book_loans: É a tabela onde as informações sobre os emprestimos realizados são armazenados.

    - **id**: Identificador único do empréstimo.
    - **book_id**: Referência ao livro emprestado.
    - **customer**: Nome do cliente que realizou o empréstimo.
    - **start_date**: Data de início do empréstimo.
    - **due_date**: Data limite de devolução.
    - **actual_return_date**: Data real de devolução, quando o empréstimo é finalizado.
    - **penalty**: Multa calculada para devoluções atrasadas.