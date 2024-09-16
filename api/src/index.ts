import express from "express"
import cors from "cors"
import { listBookLoans } from "./endpoints/listBookLoans"
import { updateBookLoan } from "./endpoints/updateBookLoan"
import { createBookLoan } from "./endpoints/createBookLoans"
import { Client } from 'pg'
import dotenv from 'dotenv'
import { deleteBookLoan } from "./endpoints/deleteBookLoan"
import { getAvailableBooks } from "./endpoints/booksAvailable"

// Carrega variáveis de ambiente
dotenv.config();

// Configura porta da API
const API_PORT = 8080
const api = express()


// Configura o cliente do postgreSQL usando as variáveis de ambiente
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
})

client.connect().catch(err => console.error('Connection error', err.stack))

api.use(cors({
    origin: "*",
}))

api.use(express.json());

api.get("/", (request, response) => {
    response.send("API is up")
})

// Endpoits 
api.get('/book-loans', listBookLoans);
api.post('/book-loan-create', createBookLoan)
api.put('/book-loan-update', updateBookLoan)
api.delete('/book-loan-delete/:loanId', deleteBookLoan)
api.get('/books-available', getAvailableBooks);


api.listen(API_PORT, "0.0.0.0", () => {
    console.log(`API running on port ${API_PORT}`)
})