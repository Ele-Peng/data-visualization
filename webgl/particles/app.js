// 简单的粒子动画
const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");


// 创建 webgl 程序 --> 为 GPU 最终运行着色器的程序
// 顶点着色器
const vertex = `
  attribute vec2 position;

  uniform float u_rotation;
  uniform float u_time;
  uniform float u_duration;
  uniform float u_scale;
  uniform vec2 u_dir;

  varying float vP;

  void main() {
    float p = min(1.0, u_time / u_duration);
    float rad = u_rotation + 3.14 * 10.0 * p;
    float scale = u_scale * p * (2.0 - p);
    vec2 offset = 2.0 * u_dir * p * p;
    mat3 translateMatrix = mat3(
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      offset.x, offset.y, 1.0
    );
    mat3 rotateMatrix = mat3(
      cos(rad), sin(rad), 0.0,
      -sin(rad), cos(rad), 0.0,
      0.0, 0.0, 1.0
    );
    mat3 scaleMatrix = mat3(
      scale, 0.0, 0.0,
      0.0, scale, 0.0,
      0.0, 0.0, 1.0
    );
    gl_PointSize = 1.0;
    vec3 pos = translateMatrix * rotateMatrix * scaleMatrix * vec3(position, 1.0);
    gl_Position = vec4(pos, 1.0);
    vP = p;
  }
`

// 片元着色器
const fragment = `
  precision mediump float;
  
  uniform vec4 u_color;

  varying float vP;

  void main()
  {
    gl_FragColor.xyz = u_color.xyz;
    gl_FragColor.a = (1.0 - vP) * u_color.a;
  }  
`

// 为着色器创造 shader 对象
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertex);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragment);
gl.compileShader(fragmentShader);



// 创建 webglprogram 对象，并将这两个 shader 关联上 webglprogram, 再将 webglprogram 链接到 webgl 上下文对象上
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// 启用 webglprogram 对象
gl.useProgram(program);


/****** 创建随机三角形 ********/
function randomTriangles() {
  const u_color = [Math.random(), Math.random(), Math.random(), 1.0]; // 随机颜色
  const u_rotation = Math.random() * Math.PI; // 初始旋转角度
  const u_scale = Math.random() * 0.05 + 0.03; // 初始大小
  const u_time = 0; // 初始时间
  const u_duration = 3.0; // 持续3秒钟

  const rad = Math.random() * Math.PI * 2;
  const u_dir = [Math.cos(rad), Math.sin(rad)]; // 运动方向
  const startTime = performance.now();

  return {u_color, u_rotation, u_scale, u_time, u_duration, u_dir, startTime};
}


/****** 创建随机三角形 ********/
function setUniforms(gl, {u_color, u_rotation, u_scale, u_time, u_duration, u_dir}) {
  // gl.getUniformLocation 拿到 uniform 变量的指针
  let loc = gl.getUniformLocation(program, "u_color");
  // 将数据传给 uniform 变量的地址
  gl.uniform4fv(loc, u_color);

  loc = gl.getUniformLocation(program, "u_rotation");
  gl.uniform1f(loc, u_rotation);

  loc = gl.getUniformLocation(program, "u_scale");
  gl.uniform1f(loc, u_scale);

  loc = gl.getUniformLocation(program, "u_time");
  gl.uniform1f(loc, u_time);

  loc = gl.getUniformLocation(program, 'u_duration');
  gl.uniform1f(loc, u_duration);

  loc = gl.getUniformLocation(program, "u_dir");
  gl.uniform2fv(loc, u_dir);
}



/****** 创建三角形 ********/
// 将数据存入缓冲区
const points = new Float32Array([
  -1, -1,
  0, 1,
  1, -1
])
// 将定义好的数据写入 webgl 缓冲区
const bufferId = gl.createBuffer(); // 创建一个缓冲对象
gl.bindBuffer(gl.ARRAY_BUFFER, bufferId); // 将缓冲对象绑定为当前操作对象
gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW); // 将数据写入缓冲对象

// 将数据读取到 GPU
const vPosition = gl.getAttribLocation(program, "position"); // 获取顶点着色器中 position 变量的地址
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPosition);


// 执行着色器程序完成绘制
// gl.clear(gl.COLOR_BUFFER_BIT);
// gl.drawArrays(gl.TRIANGLES, 0, points.length / 2);



/****** 用 requestAnimationFrame 实现动画 ********/
let triangles = [];
function update(t) {
  for (let i = 0; i < 5 * Math.random(); i ++) {
    triangles.push(randomTriangles());
  }
  gl.clear(gl.COLOR_BUFFER_BIT);
  // 对每个三角形重新设置 u_time
  triangles.forEach((triangle) => {
    triangle.u_time = (performance.now() - triangle.startTime) / 1000;
    setUniforms(gl, triangle);
    gl.drawArrays(gl.TRIANGLES, 0, position.length / 2);
  });
  // 移除已经结束动画的三角形
  triangles = triangles.filter((triangle) => {
    return triangle.u_time <= triangle.u_duration;
  });
  requestAnimationFrame(update);
}
requestAnimationFrame(update);
