import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Menu } from './components/menu';
import { BookLoanList } from './components/book-loan-list';
import { CreateBookLoan } from './components/book-loan-create';

function App() {
  return (
    <Router>
      <Menu />
      <Container className="mt-3">
        <Row>
          <Col>
            <Routes>
              <Route path="/" element={<BookLoanList />} />
              <Route path="/create-book-loan" element={<CreateBookLoan />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
