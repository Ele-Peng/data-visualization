import { Vector2D } from "../../common/lib/vector2d.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const {width, height} = canvas;
ctx.translate(0.5 * width, 0.5 * height);
ctx.scale(1, -1);

// 构建五角形顶点
const points = [new Vector2D(0, 100)];
for (let i = 1; i <= 4; i ++) {
  const tempPoint = points[0].copy().rotate(i * Math.PI * 0.4);
  points.push(tempPoint);
}
const polygon = [...points];
ctx.save();
ctx.translate(-128, 128);
draw(polygon, ctx, {fillStyle: "black"}); // default is nonzero, you can try "evenodd"
ctx.restore();


const pentagon = [
  points[0],
  points[2],
  points[4],
  points[1],
  points[3]
]
ctx.save();
ctx.translate(128, 128);
draw(pentagon, ctx, {fillStyle: "black"});
ctx.restore();

function draw(points, context, {strokeStyle = "black", fillStyle = null, rule = 'nonzero'} = {}) {
  context.strokeStyle = strokeStyle;
  context.beginPath();
  context.moveTo(...points[0]);
  for (let i = 1; i < points.length; i ++) {
    context.lineTo(...points[i]);
  }
  if (fillStyle) {
    context.fillStyle = fillStyle;
    context.fill(rule);
  }
  context.closePath();
  context.stroke();
}