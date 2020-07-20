const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const TAU = Math.PI * 2;
const TAU_SEGMENTS = 60;

/**
 *
 *
 * @param {*} x0
 * @param {*} y0
 * @param {*} radiusX
 * @param {*} radiusY
 * @param {*} startAngle
 * @param {*} endAngle
 */
function ellipse(x0, y0, radiusX, radiusY, startAngle = 0, endAngle = Math.PI * 2) {
  const angle = Math.min(TAU, endAngle - startAngle);
  const points = angle === TAU ? [] : [[x0, y0]];
  const segements = Math.round(angle * TAU_SEGMENTS / TAU);

  for (let i = 0; i < segements; i ++) {
    const tempX = x0 + radiusX * Math.cos(startAngle + angle * (i / segements));
    const tempY = y0 + radiusY * Math.sin(startAngle + angle * (i / segements));
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

draw(ellipse(250, 250, 200, 100))