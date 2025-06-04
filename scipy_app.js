// Conversor de Unidades Científicas
function convertUnits() {
  const val = parseFloat(document.getElementById('unit-value').value);
  const from = document.getElementById('unit-from').value;
  const to = document.getElementById('unit-to').value;
  let res = '';
  if (isNaN(val)) {
    res = 'Ingresa un valor numérico.';
  } else if (from === to) {
    res = `${val} ${from} = ${val} ${to}`;
  } else if (from === 'moles' && to === 'joules') {
    res = `${val} moles = ${val * 96485} J (Faraday)`;
  } else if (from === 'joules' && to === 'moles') {
    res = `${val} J = ${(val / 96485).toFixed(5)} moles (Faraday)`;
  } else if (from === 'pascals' && to === 'joules') {
    res = `${val} Pa = ${val} J/m³`;
  } else if (from === 'joules' && to === 'pascals') {
    res = `${val} J = ${val} Pa·m³`;
  } else {
    res = 'Conversión no implementada.';
  }
  document.getElementById('unit-result').textContent = res;
}

// Simulador de Caída Libre (MRU/MRUV)
function simulateFreeFall() {
  const h = parseFloat(document.getElementById('height').value);
  const g = parseFloat(document.getElementById('gravity').value);
  const dot = document.getElementById('sim-dot');
  const plot = document.getElementById('sim-plot');
  if (isNaN(h) || isNaN(g) || h <= 0 || g <= 0) {
    document.getElementById('fall-result').textContent = 'Ingresa valores válidos.';
    return;
  }
  const t = Math.sqrt(2 * h / g);
  document.getElementById('fall-result').textContent = `Tiempo de caída: ${t.toFixed(2)} s`;
  // Animación
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

// Juego de Adivinanza (Consola)
let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
let gameActive = true;
const box = document.getElementById('console-box');
box.textContent = 'Adivina el número secreto (1-100):';
function makeGuess() {
  if (!gameActive) return;
  const input = document.getElementById('guess-input');
  const val = parseInt(input.value);
  if (isNaN(val)) {
    box.textContent += '\nIngresa un número válido.';
  } else {
    attempts++;
    if (val === secretNumber) {
      box.textContent += `\n¡Correcto! El número era ${secretNumber}. Intentos: ${attempts}`;
      gameActive = false;
    } else if (val < secretNumber) {
      box.textContent += `\n${val} es muy bajo.`;
    } else {
      box.textContent += `\n${val} es muy alto.`;
    }
  }
  input.value = '';
  box.scrollTop = box.scrollHeight;
}
function resetGame() {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  gameActive = true;
  box.textContent = 'Adivina el número secreto (1-100):';
}
document.getElementById('guess-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') makeGuess();
});
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar el texto del juego de adivinanza solo cuando el DOM esté listo
  const box = document.getElementById('console-box');
  if (box) box.textContent = 'Adivina el número secreto (1-100):';
});
