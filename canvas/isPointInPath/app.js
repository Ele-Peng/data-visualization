const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const {width, height} = canvas;
ctx.translate(0.5 * width, 0.5 * height);
ctx.scale(1, -1);

const vertices = [
  [-0.7, 0.5],
  [-0.4, 0.3],
  [-0.25, 0.71],
  [-0.1, 0.56],
  [-0.1, 0.13],
  [0.4, 0.21],
  [0, -0.6],
  [-0.3, -0.3],
  [-0.6, -0.3],
  [-0.45, 0.0],
];
const littleVertices = [[100, 100], [100, 200], [150, 200]];
const poitions = vertices.map(([x, y]) => [x * 256, y * 256]);

function draw(ctx, points, strokeStyle = 'black', fillStyle = null) {
  ctx.strokeStyle = strokeStyle;
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for(let i = 1; i < points.length; i++) {
    ctx.lineTo(...points[i]);
  }
  ctx.closePath();
  if(fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  ctx.stroke();
}

/**
 *重新创建一个 Canvas 对象，并且再绘制一遍多边形 c 和小三角形
 *在绘制的过程中获取每个图形的 isPointInPath 结果
 * @param {*} ctx
 * @param {*} x
 * @param {*} y
 */
function isPointInPath(ctx, x, y) {
  console.log('222')
  const cloned = ctx.canvas.cloneNode().getContext("2d");
  cloned.translate(0.5 * width, 0.5 * height);
  cloned.scale(1, -1);

  let res = false;
  draw(cloned, poitions, 'transparent', 'red');
  res |= cloned.isPointInPath(x, y); // |= 将 Boolean 转为 Number
  if (!res) {
    draw(cloned, littleVertices, 'transparent', 'blue');
    res |= cloned.isPointInPath(x, y);
  }
  return res;
}

draw(ctx, poitions, 'transparent', 'red');
draw(ctx, littleVertices, 'transparent', 'blue');

const {left, top} = canvas.getBoundingClientRect();
canvas.addEventListener("mousemove", (event) => {
  const {x, y} = event;
  // 坐标转换
  const offsetX = x - left;
  const offsetY = y - top;

  ctx.clearRect(-256, -256, 512, 512);
  
  // canvas 原生 isPointInPath 只能对当前绘制的图形生效，当有两个及两个以上的图像时，只能识别最后一个图形
  if (isPointInPath(ctx, offsetX, offsetY)) { 
    draw(ctx, poitions, 'transparent', 'pink');
    draw(ctx, littleVertices, 'transparent', 'pink');
  } else {
    draw(ctx, poitions, 'transparent', 'red');
    draw(ctx, littleVertices, 'transparent', 'blue');
  }
});