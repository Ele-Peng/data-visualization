const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;
ctx.translate(0.5 * width, 0.5 * height);
ctx.scale(1, -1);

function draw(
  points, 
  context, 
  {
    fillStyle = null,
    strokeStyle = "black",
    close = false
  } = {}
) {
  context.strokeStyle = strokeStyle;
  context.beginPath();
  context.moveTo(...points[0]);
  for (let i = 1; i < points.length; i ++) {
    context.lineTo(...points[i]);
  }
  if (fillStyle) {
    context.fillStyle = fillStyle;
    context.fill();
  }
  context.closePath();
  context.stroke();
}

function parametric(xFunc, yFunc) {
  console.log('22')
  return function (start, end, seg = 100, ...args) {
    const points = [];
    console.log('22', seg)
    for (let i = 0; i <= seg; i ++) {
      const p = i / seg;
      const t = start * (1 - p) + end * p;
      console.log(...args);
      const xTemp = xFunc(t, ...args); // 计算x
      const yTemp = yFunc(t, ...args); // 计算y
      points.push([xTemp, yTemp]);
    }
    return {
      draw: draw.bind(null, points),
      points
    };
  }
}

const para = parametric(
  t => 25 * t,
  t => 25 * t ** 2
)
para(-5, 5).draw(ctx);