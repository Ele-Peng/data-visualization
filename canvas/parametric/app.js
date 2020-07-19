import { Vector2D } from "../../common/lib/vector2d.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const {width, height} = canvas;
ctx.translate(0.5 * width, 0.5 * height);
ctx.scale(1, -1);


function regularShape(edges = 3, x, y, step) {
  const ret = [];
  const delta = Math.PI * 2 / edges; // edges 必须大于 2
  let p = new Vector2D(x, y);
  const dir = new Vector2D(step, 0);
  ret.push(p);
  for (let i = 0; i < edges; i ++) {
    p = p.copy().add(dir.rotate(delta));
    ret.push(p);
  }
  return ret;
}

function draw(points, strokeStyle = "black", fillStyle = null) {
  ctx.strokeStyle = strokeStyle;
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (let i = 1; i < points.length; i ++) {
    ctx.lineTo(...points[i]);
  }
  ctx.closePath();
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  ctx.stroke();
}



draw(regularShape(3, 128, 128, 100));  // 绘制三角形
draw(regularShape(6, -64, 128, 50));  // 绘制六边形
draw(regularShape(11, -64, -64, 30));  // 绘制十一边形
draw(regularShape(60, 128, -62, 6));  // 绘制六十边形

