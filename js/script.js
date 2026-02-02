let flatName = '';
let flatmates = [];
let expenses = [];
let latestData = null;

const flatNameDisplay = document.getElementById('flat-name-display');
const flatmatesList = document.getElementById('flatmates-list');
const expensesList = document.getElementById('expenses-list');
const totalSoFarEl = document.getElementById('total-so-far');
const fairShareEl = document.getElementById('fair-share');
const paidBySelect = document.getElementById('exp-paidby');
const categorySelect = document.getElementById('exp-category');
const nextToExpensesBtn = document.getElementById('next-to-expenses');
const nextToSummaryBtn = document.getElementById('next-to-summary');

function showStep(id) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function addFlatName() {
  const input = document.getElementById('flat-name');
  flatName = input.value.trim();
  if (!flatName) return alert('Enter flat name');
  flatNameDisplay.textContent = flatName;
  flatNameDisplay.style.display = 'block';
  showStep('step-flatmates');
}

function addFlatmate() {
  const input = document.getElementById('new-flatmate');
  const name = input.value.trim();
  if (!name || flatmates.includes(name)) return;
  flatmates.push(name);
  input.value = '';
  renderFlatmates();
}

function renderFlatmates() {
  flatmatesList.innerHTML = flatmates
    .map(n => `<span class="flatmate-tag">${n}</span>`)
    .join('');

  paidBySelect.innerHTML = '<option value="">Paid by</option>';
  flatmates.forEach(n => {
    const o = document.createElement('option');
    o.value = n;
    o.textContent = n;
    paidBySelect.appendChild(o);
  });

  nextToExpensesBtn.disabled = flatmates.length < 2;
}

function goToExpenses() {
  showStep('step-expenses');
}

function addExpense() {
  const desc = document.getElementById('exp-desc').value.trim();
  const amount = Number(document.getElementById('exp-amount').value);
  const paidBy = paidBySelect.value;
  const category = categorySelect.value.trim() || 'Other';

  if (!desc || amount <= 0 || !paidBy) {
    return alert('Fill all fields');
  }

  expenses.push({ desc, amount, paidBy, category });

  document.getElementById('exp-desc').value = '';
  document.getElementById('exp-amount').value = '';
  paidBySelect.value = '';
  categorySelect.value = '';

  renderExpenses();
}

function renderExpenses() {
  expensesList.innerHTML = expenses.map(e => `
    <div class="expense-item">
      <strong>${e.desc}</strong>
      <span>₹${e.amount.toFixed(2)}</span>
      <span>${e.category}</span>
      <span>Paid by ${e.paidBy}</span>
    </div>
  `).join('');

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const share = total / flatmates.length;

  totalSoFarEl.textContent = total.toFixed(2);
  fairShareEl.textContent = share.toFixed(2);

  nextToSummaryBtn.disabled = expenses.length === 0;
}

function goToSummary() {
  showStep('step-summary');
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const share = total / flatmates.length;

  const balances = {};
  flatmates.forEach(n => balances[n] = -share);
  expenses.forEach(e => balances[e.paidBy] += e.amount);

  let html = `
    <div class="card">
      <div>Total: ₹${total.toFixed(2)}</div>
      <div>Per Person: ₹${share.toFixed(2)}</div>
    </div>
    <h3>Who Pays Whom</h3>
  `;

  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([n, b]) => {
    if (b > 0) creditors.push({ n, b });
    if (b < 0) debtors.push({ n, b: Math.abs(b) });
  });

  html += `<div class="card"><ul class="settlement-list">`;

  creditors.forEach(c => {
    debtors.forEach(d => {
      if (c.b > 0 && d.b > 0) {
        const pay = Math.min(c.b, d.b);
        c.b -= pay;
        d.b -= pay;
        html += `<li>${d.n} pays ₹${pay.toFixed(2)} to ${c.n}</li>`;
      }
    });
  });

  html += `</ul></div>`;
  document.getElementById('settlement-result').innerHTML = html;

  localStorage.setItem('baltrixData', JSON.stringify({ flatmates, expenses, balances, total, share }));
}

function downloadSummary() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const data = JSON.parse(localStorage.getItem('baltrixData'));
  if (!data) return alert('No data to download');

  doc.setFontSize(16);
  doc.text('Baltrix Settlement', 14, 16);
  doc.setFontSize(12);

  doc.text(`Flat Name: ${flatName}`, 14, 26);
  doc.text(`Total: ₹${data.total.toFixed(2)}`, 14, 34);
  doc.text(`Per Person: ₹${data.share.toFixed(2)}`, 14, 42);

  let y = 52;
  doc.text('Settlements:', 14, y);
  y += 8;

  const creditors = [];
  const debtors = [];

  Object.entries(data.balances).forEach(([n, b]) => {
    if (b > 0) creditors.push({ n, b });
    if (b < 0) debtors.push({ n, b: Math.abs(b) });
  });

  creditors.forEach(c => {
    debtors.forEach(d => {
      if (c.b > 0 && d.b > 0) {
        const pay = Math.min(c.b, d.b);
        c.b -= pay;
        d.b -= pay;
        doc.text(`${d.n} pays ₹${pay.toFixed(2)} to ${c.n}`, 14, y);
        y += 8;
      }
    });
  });

  doc.save('baltrix-settlement.pdf');
}

function resetApp() {
  localStorage.removeItem('baltrixData');
  location.reload();
}

function goToInsights() {
  window.location.href = 'insights.html';
}
