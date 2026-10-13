const form = document.getElementById('cableForm');
const tableBody = document.getElementById('cableTable');
const message = document.getElementById('message');
let cableRuns = [];

function calculateLength(distance, allowance) {
  return distance * (1 + allowance / 100);
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? 'message error' : 'message';
}

function render() {
  if (cableRuns.length === 0) {
    tableBody.innerHTML = '<tr class="empty-row"><td colspan="7">No cable runs yet. Add your first connection above.</td></tr>';
  } else {
    tableBody.innerHTML = cableRuns.map((run, index) => `
      <tr>
        <td>${index + 1}</td>
        <td><span class="connection">${escapeHTML(run.source)} → ${escapeHTML(run.destination)}</span><span class="subtext">${run.allowance}% extra allowance</span></td>
        <td><span class="pill">${escapeHTML(run.cableType)}</span></td>
        <td>${escapeHTML(run.location || 'Not specified')}</td>
        <td>${run.distance.toFixed(1)} m</td>
        <td><strong>${run.total.toFixed(1)} m</strong></td>
        <td><button class="delete-btn" data-delete="${run.id}" type="button">Remove</button></td>
      </tr>`).join('');
  }
  document.getElementById('runCount').textContent = cableRuns.length;
  document.getElementById('measuredTotal').textContent =
    cableRuns.reduce((sum, run) => sum + run.distance, 0).toFixed(1);
  document.getElementById('purchaseTotal').textContent =
    cableRuns.reduce((sum, run) => sum + run.total, 0).toFixed(1);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const source = document.getElementById('source').value.trim();
  const destination = document.getElementById('destination').value.trim();
  const cableType = document.getElementById('cableType').value;
  const distance = Number(document.getElementById('distance').value);
  const allowance = Number(document.getElementById('allowance').value);
  const location = document.getElementById('location').value.trim();

  if (!source || !destination || !Number.isFinite(distance) || distance <= 0 ||
      !Number.isFinite(allowance) || allowance < 0 || allowance > 100) {
    showMessage('Please enter valid devices, a positive distance, and allowance from 0–100%.', true);
    return;
  }
  const total = calculateLength(distance, allowance);
  if (cableType !== 'Fiber' && total > 100) {
    showMessage('Warning: this copper Ethernet run is over 100 m including allowance. Consider a shorter run or network switch.', true);
  } else {
    showMessage('Cable run added successfully.');
  }
  cableRuns.push({ id: Date.now() + Math.random(), source, destination, cableType, distance, allowance, location, total });
  render();
  form.reset();
  document.getElementById('allowance').value = '10';
});

tableBody.addEventListener('click', event => {
  const button = event.target.closest('[data-delete]');
  if (!button) return;
  cableRuns = cableRuns.filter(run => String(run.id) !== button.dataset.delete);
  render();
  showMessage('Cable run removed.');
});

document.getElementById('sampleBtn').addEventListener('click', () => {
  cableRuns = [
    { id: 1, source: 'Main Router', destination: 'Lab Switch', cableType: 'Cat6', distance: 12, allowance: 10, location: 'Network Room', total: 13.2 },
    { id: 2, source: 'Lab Switch', destination: 'Student PC 01', cableType: 'Cat6', distance: 18, allowance: 10, location: 'Computer Lab', total: 19.8 },
    { id: 3, source: 'Lab Switch', destination: 'Printer', cableType: 'Cat5e', distance: 24, allowance: 15, location: 'Office', total: 27.6 }
  ];
  render();
  showMessage('Sample cable runs loaded. You can remove them or add your own.');
});

document.getElementById('exportBtn').addEventListener('click', () => {
  if (!cableRuns.length) {
    showMessage('Add at least one cable run before exporting.', true);
    return;
  }
  const rows = [
    ['No.', 'Source', 'Destination', 'Cable Type', 'Location', 'Distance (m)', 'Allowance (%)', 'Required Cable (m)'],
    ...cableRuns.map((run, index) => [
      index + 1, run.source, run.destination, run.cableType, run.location,
      run.distance.toFixed(1), run.allowance, run.total.toFixed(1)
    ])
  ];
  const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'network-cable-plan.csv';
  link.click();
  URL.revokeObjectURL(url);
  showMessage('CSV plan exported.');
});

render();