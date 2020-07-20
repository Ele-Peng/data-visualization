const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const TAU = Math.PI * 2;
const TAU_SEGMENTS = 60;

/**
 * 
 *
 * @param {*} x0 初始圆心坐标x
 * @param {*} y0 初始圆心坐标y
 * @param {*} radius 半径
 * @param {number} [startAngle=0]
 * @param {*} [endAngle=Math.PI * 2]
 */
function arc(x0, y0, radius, startAngle = 0, endAngle = Math.PI * 2) {
  const ang = Math.min(TAU, endAngle - startAngle);
  const points = ang === TAU ? [] : [[x0, y0]];
  const segments = Math.round(ang * TAU_SEGMENTS / TAU);
  for (let i = 0; i < segments; i ++) {
    let tempX = x0 + radius * Math.cos(startAngle + ang * (i / segments));
    let tempY = y0 + radius * Math.sin(startAngle + ang * (i / segments));
    points.push([tempX, tempY]);
  }
  return points;
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

draw(arc(250, 250, 100));
