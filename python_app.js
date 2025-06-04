// python_app.js
// Scientific Computing with Python (JS Demo)

// --- Unit Converter ---
function convertUnit() {
  const val = parseFloat(document.getElementById('convInput').value);
  const from = document.getElementById('convFrom').value;
  const to = document.getElementById('convTo').value;
  let res = '';
  if (isNaN(val)) {
    res = 'Enter a numeric value.';
  } else if (from === to) {
    res = `${val} ${from} = ${val} ${to}`;
  } else if (from === 'mol' && to === 'j') {
    res = `${val} mol = ${val * 96485} J (Faraday)`;
  } else if (from === 'j' && to === 'mol') {
    res = `${val} J = ${(val / 96485).toFixed(5)} mol (Faraday)`;
  } else if (from === 'pa' && to === 'j') {
    res = `${val} Pa = ${val} J/m³`;
  } else if (from === 'j' && to === 'pa') {
    res = `${val} J = ${val} Pa·m³`;
  } else {
    res = 'Conversion not implemented.';
  }
  document.getElementById('convResult').textContent = res;
}

// --- Free Fall Simulator (MRU/MRUV) ---
function simulateFall() {
  const h = parseFloat(document.getElementById('simHeight').value);
  const g = parseFloat(document.getElementById('simGravity').value);
  const dot = document.getElementById('simDot');
  const plot = document.getElementById('simPlot');
  if (isNaN(h) || isNaN(g) || h <= 0 || g <= 0) {
    document.getElementById('simResult').textContent = 'Enter valid values.';
    return;
  }
  const t = Math.sqrt(2 * h / g);
  document.getElementById('simResult').textContent = `Fall time: ${t.toFixed(2)} s`;
  // Animation
  let start = null;
  const plotHeight = plot.clientHeight - 18;
  function animate(ts) {
    if (!start) start = ts;
    const elapsed = (ts - start) / 1000;
    let y = h - 0.5 * g * elapsed * elapsed;
    if (y < 0) y = 0;
    const top = (1 - y / h) * plotHeight;
    dot.style.top = `${top}px`;
    if (y > 0) requestAnimationFrame(animate);
  }
  dot.style.top = '0px';
  requestAnimationFrame(animate);
}

// --- Text Console Game: Guess the Number ---
let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
let gameActive = true;
const box = document.getElementById('consoleBox');
box.textContent = 'Guess the secret number (1-100):';
function sendAnswer() {
  if (!gameActive) return;
  const input = document.getElementById('consoleInput');
  const val = parseInt(input.value);
  if (isNaN(val)) {
    box.textContent += '\nEnter a valid number.';
  } else {
    attempts++;
    if (val === secretNumber) {
      box.textContent += `\nCorrect! The number was ${secretNumber}. Attempts: ${attempts}`;
      gameActive = false;
    } else if (val < secretNumber) {
      box.textContent += `\n${val} is too low.`;
    } else {
      box.textContent += `\n${val} is too high.`;
    }
  }
  input.value = '';
  box.scrollTop = box.scrollHeight;
}
document.getElementById('consoleInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') sendAnswer();
});
