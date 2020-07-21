import {earcut} from "../../common/lib/earcut.js";
import {Vector2D} from '../../common/lib/vector2d.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const {width, height} = canvas;
ctx.translate(0.5 * width, 0.5 * height);
ctx.scale(1, -1);

const positions = [
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
const vertices = positions.map(([x, y]) => [x * 256, y * 256]);
const points = vertices.flat(); // 扁平化顶点数组
const triangles = earcut(points); // 返回的结果是一个数组，这个数组的值是顶点数据的 index
const cells = new Uint16Array(triangles);

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

draw(ctx, vertices, 'transparent', 'red');

const {left, top} = canvas.getBoundingClientRect();
canvas.addEventListener("mousemove", (event) => {
  const {x, y} = event;
  // 坐标转换
  const offsetX = x - left;
  const offsetY = y - top;

  ctx.clearRect(-256, -256, 512, 512);
  
  // canvas 原生 isPointInPath 只能对当前绘制的图形生效，当有两个及两个以上的图像时，只能识别最后一个图形
  if (isPointInPath({vertices, cells}, new Vector2D(offsetX, offsetY))) { 
    draw(ctx, vertices, 'transparent', 'pink');
  } else {
    draw(ctx, vertices, 'transparent', 'red');
  }
});


function inTriangle(p1, p2, p3, point) {
  const a = p2.copy().sub(p1);
  const b = p3.copy().sub(p2);
  const c = p1.copy().sub(p3);

  const u1 = point.copy().sub(p1);
  const u2 = point.copy().sub(p2);
  const u3 = point.copy().sub(p3);

  // he Math.sign() function returns either a positive or negative +/- 1

  const s1 = Math.sign(a.cross(u1));
  let _p1 = a.dot(u1) / (a.length ** 2);
  if (s1 === 0 && _p1 >= 0 && _p1 <=1) return true;

  const s2 = Math.sign(b.cross(u2));
  let _p2 = b.dot(u2) / (b.length ** 2);
  if (s2 === 0 && _p2 >= 0 && _p2 <=1) return true;

  const s3 = Math.sign(c.cross(u3));
  let _p3 = c.dot(u3) / (c.length ** 2);
  if (s3 === 0 && _p3 >= 0 && _p3 <=1) return true;

  return s1 === s2 && s2 === s3;
}

function isPointInPath({vertices, cells}, point) {
  let res = false;
  for (let i = 0; i < cells.length; i += 3) {
    const p1 = new Vector2D(...vertices[cells[i]]);
    const p2 = new Vector2D(...vertices[cells[i + 1]]);
    const p3 = new Vector2D(...vertices[cells[i + 2]]);
    if (inTriangle(p1, p2, p3, point)) {
      res = true;
      break; 
    }
  }
  return res;
}