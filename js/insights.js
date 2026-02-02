const data = JSON.parse(localStorage.getItem('baltrixData'));

if (!data) {
  document.body.innerHTML = '<h2 style="text-align:center;color:#fff;">No data available</h2>';
} else {
  const { flatmates, expenses, balances, total } = data;

  // Overview
  const highest = Object.entries(balances).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById('overview').innerHTML = `
    <h2>Monthly Overview</h2>
    <p>Total Spend: ₹${total.toFixed(2)}</p>
    <p>Average per person: ₹${(total / flatmates.length).toFixed(2)}</p>
    <p>Highest contributor: ${highest[0]} (₹${highest[1].toFixed(2)})</p>
  `;

  // Category Breakdown
  const categoryMap = {};
  expenses.forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  let catHtml = '<h2>Category Breakdown</h2>';
  Object.entries(categoryMap).forEach(([c, v]) => {
    catHtml += `<p>${c}: ₹${v.toFixed(2)}</p>`;
  });
  document.getElementById('categories').innerHTML = catHtml;

  // Smart Insights
  let warnings = '<h2>Smart Insights</h2>';
  if (highest[1] > total * 0.4) {
    warnings += `<p>⚠ ${highest[0]} paid more than 40% of total expenses</p>`;
  }
  if (Object.keys(categoryMap).length > 3) {
    warnings += `<p>💡 Expenses are spread across many categories</p>`;
  }
  document.getElementById('warnings').innerHTML = warnings;
}
