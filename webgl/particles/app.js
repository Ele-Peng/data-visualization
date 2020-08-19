// 简单的粒子动画
const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");


// 创建 webgl 程序 --> 为 GPU 最终运行着色器的程序
// 顶点着色器
const vertex = `
  attribute vec2 position;
  varying vec3 color;

  void main() {
    gl_PointSize = 1.0;
    color = vec3(0.5 + position * 0.5, 0.0);
    gl_Position = vec4(position, 1.0, 1.0);
  }
`

// 片元着色器
const fragment = `
  precision mediump float;
  varying vec3 color;

  void main() {
    gl_FragColor = vec4(color, 1.0);
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
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, points.length / 2);
