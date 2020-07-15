// 创建 webgl 上下文
const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");





// 创建 webgl 程序（webgl program） --> 为 GPU 最终运行着色器的程序
// attribue 声明变量
// vec2 变量类型 二维向量
// position 变量名
const vertex = `
  attribute vec2 position;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(position, 1.0, 1.0);
  }
` // 顶点着色器
// 通过 gl_Position 设置顶点
// 通过定义 varying 变量，向片元着色器传递数据


// 光栅化 --> webgl 从顶点着色器和图元提取像素点给片元着色器执行代码的过程
// 图元 --> webgl 可直接处理的图形单元，由 webgl 的绘图模式决定，有 点、线、三角形等


// gl_FragColor 定义和改变图形颜色
const fragment = `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
` // 片元着色器
// 片元着色器对像素点着色这个过程是并行的

// 2.1 分别为 顶点着色器 和 片元着色器 创建 shader 对象
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertex);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragment);
gl.compileShader(fragmentShader);

// 2.2 创建 WebGLProgramn 对象，并将这两个 shader 关联上 WebGLProgramn，再将 WebGLProgramn 链接到 WebGL 上下文对象上
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// 2.3 通过 useProgram 启用这个 WebGLProgram 对象
gl.useProgram(program);




// 将数据存入缓冲区
// 三角形在坐标系顶点坐标分别是 (-1, -1), (0, 1), (1, -1)
// 3.1 定义三角形的三个顶点
const points = new Float32Array([
  -1, -1,
  0, 1,
  1, -1
])
// 3.2 将定义好的数据写入 webgl 的缓冲区
// 创建一个缓存对象
const bufferId = gl.createBuffer();
// 将缓存对象绑定为当前操作对象
gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
// 讲数据写入缓存对象
gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);




// 将缓冲区数据读取到 GPU
// 4.1 获取顶点着色器中的 position 变量的地址
const vPosition = gl.getAttribLocation(program, 'position'); 
// 4.2 给变量设置长度和类型
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
// 4.3 激活变量
gl.enableVertexAttribArray(vPosition);




// GPU 执行 webgl 程序，输出结果 --> 执行着色器程序完成绘制
// 5.1 当前画布内容清除
gl.clear(gl.COLOR_BUFFER_BIT);
// 5.2 调用 gl.drawArrays 传入绘制模式
// 选择 gl.TRIANGLES 表示以三角形为图元绘制，再传入绘制的偏移量和顶点数据
// WebGL 就会将对应的 buffer 数组传给对应着色器，并开始绘制
gl.drawArrays(gl.TRIANGLES, 0, points.length / 2);
