export type RepaymentStrategy = 'snowball' | 'avalanche' | 'custom';

export interface Debt {
  id: number;
  name: string;
  principal: number;
  interestRate: number;
  minimumPayment: number;
}

interface Payment {
  month: number;
  balance: number;
  interestPaid: number;
  principalPaid: number;
}

export function calculateRepayment(
  debts: Debt[],
  strategy: RepaymentStrategy,
  extraPayment: number,
  oneTimePayment: number
) {
  // Validate inputs
  debts.forEach(debt => {
    if (debt.principal <= 0) throw new Error('Principal must be greater than 0');
    if (debt.interestRate < 0) throw new Error('Interest rate cannot be negative');
    if (debt.minimumPayment <= 0) throw new Error('Minimum payment must be greater than 0');
    
    const monthlyInterest = (debt.interestRate / 100 / 12) * debt.principal;
    if (debt.minimumPayment <= monthlyInterest) {
      throw new Error(`Minimum payment for ${debt.name || 'a debt'} must be greater than monthly interest`);
    }
  });

  // Sort debts based on strategy
  const sortedDebts = [...debts].sort((a, b) => {
    if (strategy === 'snowball') return a.principal - b.principal;
    if (strategy === 'avalanche') return b.interestRate - a.interestRate;
    return 0; // custom order
  });

  let currentDebts = sortedDebts.map(debt => ({
    ...debt,
    balance: debt.principal,
  }));

  const payments: Payment[] = [];
  let month = 0;
  let totalInterestPaid = 0;
  let totalPrincipalPaid = 0;

  // Apply one-time payment to highest priority debt
  if (oneTimePayment > 0 && currentDebts.length > 0) {
    const firstDebt = currentDebts[0];
    const paymentAmount = Math.min(oneTimePayment, firstDebt.balance);
    firstDebt.balance -= paymentAmount;
    totalPrincipalPaid += paymentAmount;
  }

  while (currentDebts.some(debt => debt.balance > 0)) {
    month++;
    let monthlyInterestPaid = 0;
    let monthlyPrincipalPaid = 0;
    let remainingExtra = extraPayment;

    for (const debt of currentDebts) {
      if (debt.balance <= 0) continue;

      const monthlyInterest = (debt.interestRate / 100 / 12) * debt.balance;
      let payment = debt.minimumPayment;

      // Add extra payment to highest priority non-zero debt
      if (remainingExtra > 0 && debt === currentDebts.find(d => d.balance > 0)) {
        payment += remainingExtra;
        remainingExtra = 0;
      }

      const interestPortion = Math.min(monthlyInterest, debt.balance);
      const principalPortion = Math.min(payment - interestPortion, debt.balance - interestPortion);

      debt.balance -= principalPortion;
      monthlyInterestPaid += interestPortion;
      monthlyPrincipalPaid += principalPortion;
    }

    totalInterestPaid += monthlyInterestPaid;
    totalPrincipalPaid += monthlyPrincipalPaid;

    payments.push({
      month,
      balance: currentDebts.reduce((sum, debt) => sum + debt.balance, 0),
      interestPaid: monthlyInterestPaid,
      principalPaid: monthlyPrincipalPaid,
    });

    // Safety check to prevent infinite loops
    if (month > 600) { // 50 years
      throw new Error('Repayment period exceeds 50 years. Please review your debt details.');
    }
  }

  return {
    totalMonths: month,
    totalInterest: totalInterestPaid,
    totalPaid: totalInterestPaid + totalPrincipalPaid,
    monthlyPayments: payments,
  };
}