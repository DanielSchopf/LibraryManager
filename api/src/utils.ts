
// Função para calcular a data de retorno
export const calculateReturnDate = (startDate: Date): Date => {
    let returnDate = new Date(startDate);
    returnDate.setDate(returnDate.getDate() + 30);
    return returnDate;
};

// Ajuste da data em caso de finais de semana
export const adjustToNextMonday = (date: Date): Date => {
    const adjustedDate = new Date(date); // Faz uma cópia da data original
    const day = adjustedDate.getDay();
    
    if (day === 0) {
        adjustedDate.setDate(adjustedDate.getDate() + 1);
    } else if (day === 6) {
        adjustedDate.setDate(adjustedDate.getDate() + 2);
    }
    
    return adjustedDate;
};

// Função para calcular a multa de atraso
export const calculateFine = (expectedReturnDate: Date, actualReturnDate: Date): number => {
    const ONE_DAY = 24 * 60 * 60 * 1000; 

    // Calcula a diferença em dias entre a data de devolução real e a data esperada
    const overdueDays = Math.ceil((actualReturnDate.getTime() - expectedReturnDate.getTime()) / ONE_DAY);
    
    // Nenhuma multa se a devolução foi até o dia seguinte do prazo
    if (overdueDays < 1) {
        return 0;
    }

    // Multa começa a partir do segundo dia após o prazo
    const daysForFine = overdueDays + 1 ; 
    return daysForFine * 0.50; // Multa de 0,50 por dia de atraso
};