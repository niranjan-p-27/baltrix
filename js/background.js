//background.js
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lines = [];
const lineCount = 40;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Initialize lines
for (let i = 0; i < lineCount; i++) {
  lines.push({
    x: random(0, canvas.width),
    y: random(0, canvas.height),
    vx: random(-0.5, 0.5),
    vy: random(0.5, 1.5),
    length: random(50, 200),
    alpha: random(0.1, 0.5),
  });
}

// Animate
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  lines.forEach(line => {
    ctx.beginPath();
    ctx.moveTo(line.x, line.y);
    ctx.lineTo(line.x + line.length, line.y);
    ctx.strokeStyle = `rgba(0, 208, 130, ${line.alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    line.x += line.vx;
    line.y += line.vy;

    if (line.y > canvas.height || line.x > canvas.width) {
      line.x = random(0, canvas.width);
      line.y = -line.length;
    }
  });
  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
