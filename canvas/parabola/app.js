const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");


const LINE_SEGMENTS = 60;
function parabola(x0, y0, p, min, max) {
  const ret = [];
  for(let i = 0; i <= LINE_SEGMENTS; i++) {
    const s = i / 60;
    const t = min * (1 - s) + max * s;
    const x = x0 + 2 * p * t ** 2;
    const y = y0 + 2 * p * t;
    ret.push([x, y]);
  }
  return ret;
}
function draw(points, strokeStyle = "black") {
  ctx.strokeStyle = strokeStyle;
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (let i = 1; i < points.length; i ++) {
    ctx.lineTo(...points[i]);
  }
  ctx.closePath();
  ctx.stroke();
}

draw(parabola(250, 250, 5.5, -10, 10));