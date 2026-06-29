function calculateEMI(principal, annualRate, tenureMonths) {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return (principal / tenureMonths).toFixed(2);
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
}

function formatEMIBreakdown(principal, annualRate, tenureYears) {
  const months = tenureYears * 12;
  const emi = calculateEMI(principal, annualRate, months);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;
  return {
    emi,
    totalPayment,
    totalInterest,
    principal,
    tenureMonths: months
  };
}

module.exports = { calculateEMI, formatEMIBreakdown };
