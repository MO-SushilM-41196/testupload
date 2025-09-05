function formatINR(amount) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  } catch (e) {
    return '₹' + Math.round(amount).toLocaleString('en-IN');
  }
}

function calculateEMI(principal, annualRatePct, years, frequency) {
  const paymentsPerYear = frequency === 'quarterly' ? 4 : 12;
  const totalPayments = Math.round(years * paymentsPerYear);
  const periodicRate = (annualRatePct / 100) / paymentsPerYear;

  if (periodicRate === 0) {
    const emiZero = principal / totalPayments;
    return { emi: emiZero, totalPayable: emiZero * totalPayments, totalInterest: 0 };
  }

  const factor = Math.pow(1 + periodicRate, totalPayments);
  const emi = principal * periodicRate * factor / (factor - 1);
  const totalPayable = emi * totalPayments;
  const totalInterest = totalPayable - principal;
  return { emi, totalPayable, totalInterest };
}

function drawPieChart(canvas, principal, interest) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const total = principal + interest;
  const radius = Math.min(canvas.width, canvas.height) / 2 - 6;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // principal slice
  const anglePrincipal = (principal / total) * Math.PI * 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.fillStyle = '#7b7fff';
  ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + anglePrincipal);
  ctx.closePath();
  ctx.fill();

  // interest slice
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.fillStyle = '#ff7e6e';
  ctx.arc(centerX, centerY, radius, -Math.PI / 2 + anglePrincipal, -Math.PI / 2 + Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function updateCalculator() {
  const amount = Number(document.getElementById('amount').value || 0);
  const years = Number(document.getElementById('years').value || 0);
  const rate = Number(document.getElementById('rate').value || 0);
  const frequency = document.getElementById('frequency').value;
  const { emi, totalPayable, totalInterest } = calculateEMI(amount, rate, years, frequency);

  const monthlyDisplay = document.getElementById('emi');
  const totalDisplay = document.getElementById('total');
  const interestDisplay = document.getElementById('interest');
  monthlyDisplay.textContent = formatINR(emi);
  totalDisplay.textContent = formatINR(totalPayable);
  interestDisplay.textContent = formatINR(totalInterest);

  drawPieChart(document.getElementById('pie'), amount, totalInterest);
}

document.addEventListener('DOMContentLoaded', () => {
  updateCalculator();
  document.getElementById('calc-btn').addEventListener('click', updateCalculator);
  document.getElementById('frequency').addEventListener('change', updateCalculator);
});

