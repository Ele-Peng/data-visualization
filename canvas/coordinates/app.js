const canvas = document.querySelector("canvas");
const rc = rough.canvas(canvas);
const ctx = rc.ctx;
ctx.translate(256, 256); // 平移至中间
ctx.scale(1, -1); // 翻转Y坐标轴 --> X 轴向右， Y 轴向上

const hillOpts = {roughness: 2.8, strokeWidth: 2, fill: "blue", fillStyle: "zigzag"};
rc.path("M-180 0L-80 100L20 0", hillOpts); // 等腰三角形
rc.path("M-20 0L80 100L180 0", hillOpts); // 等腰三角形
rc.circle(256, 106, 105, {
  stroke: "red",
  strokeWidth: 4,
  fill: "rgba(255, 255, 0, 0.4)",
  fillStyle: "solid"
}) // 圆