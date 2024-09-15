import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, NavDropdown, Table, Modal, Form, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getBookLoans, updateBookLoan, deleteBookLoan } from '../../services/BookLoansService';
import { FaEdit, FaTrash } from 'react-icons/fa';

export function BookLoanList() {
  const [loans, setLoans] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentLoan, setCurrentLoan] = useState<any>(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Carrega a lista de empréstimos quando o componente é montado
    const fetchLoans = async () => {
      try {
        const fetchedLoans = await getBookLoans();
        setLoans(fetchedLoans);
      } catch (error) {
        console.error('Erro ao carregar empréstimos:', error);
      }
    };

    fetchLoans();
  }, []);

  const handleEditClick = (loan: any) => {
    setCurrentLoan(loan);
    setStatus(loan.status);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (currentLoan) {
      const payload = {
        loanId: currentLoan.id,
        status,
        actualReturnDate: status === 'devolvido' ? new Date(currentLoan.actualReturnDate).toISOString().split('T')[0] : null
      };
  
      try {
        await updateBookLoan(payload);
        const updatedLoans = await getBookLoans();
        console.log('Empréstimos atualizados:', updatedLoans);
        setLoans(updatedLoans);
        setShowEditModal(false);
      } catch (error) {
        console.error('Erro ao atualizar o empréstimo:', error);
      }
    }
  };

  const handleDelete = async (loanId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este empréstimo?')) {
      try {
        await deleteBookLoan(loanId);
        const updatedLoans = await getBookLoans();
        setLoans(updatedLoans);
        
      } catch (error) {
        console.error('Erro ao excluir o empréstimo:', error);
      }
    }
  };

  // Função para formatar a data 
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
  
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
  
    return `${formattedDay}/${formattedMonth}/${year}`;
  };
  

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Livro</th>
            <th>Data do Empréstimo</th>
            <th>Data Prevista do Retorno</th>
            <th>Data Real do Retorno</th>
            <th>Status</th>
            <th>Multa</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {loans.map(loan => (
            <tr key={loan.id}>
              <td>{loan.id}</td>
              <td>{loan.customer}</td>
              <td>{loan.title}</td>
              <td>{new Date(loan.loan_date).toLocaleDateString()}</td>
              <td>{new Date(loan.return_date).toLocaleDateString()}</td>
              <td>
                {loan.actual_return_date 
                  ? formatDate(loan.actual_return_date) 
                  : 'Não devolvido'}
              </td>
              <td>{loan.status}</td>
              <td>                
                {loan.status === 'devolvido'
                  ? (typeof loan.penalty === 'string' ? parseFloat(loan.penalty) : loan.penalty) 
                    ? `R$ ${(typeof loan.penalty === 'string' ? parseFloat(loan.penalty) : loan.penalty).toFixed(2)}` 
                    : 'Multa não calculada' 
                  : 'Multa não calculada'}
              </td>

              <td>
                <FaEdit 
                  onClick={() => handleEditClick(loan)}
                  style={{ cursor: 'pointer', marginRight: '10px' }}
                />
                <FaTrash 
                  onClick={() => handleDelete(loan.id)}
                  style={{ cursor: 'pointer' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Empréstimo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="emprestado">Emprestado</option>
                <option value="devolvido">Devolvido</option>
                <option value="extraviado">Extraviado</option>
              </Form.Control>
            </Form.Group>
            {status === 'devolvido' && (
              <Form.Group>
                <Form.Label>Data de Devolução</Form.Label>
                <Form.Control
                  type="date"
                  value={currentLoan?.actualReturnDate || ''}
                  onChange={e => setCurrentLoan({ ...currentLoan, actualReturnDate: e.target.value })}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
