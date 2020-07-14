const dataSource = "https://s5.ssl.qhres.com/static/b0695e2dd30daa64.json";

/*
* 遗留优化：鼠标移动到某市级，显示提示文字：省级-市级
*/


void async function() {
  // 从数据源获取 JSON 数据
  const data = await (await fetch(dataSource)).json();
  // console.log(data);

  // d3-hierarchy 转成图形信息
  // console.log(d3.hierarchy(data)); // d3.hierarchy 数据
  // console.log(d3.hierarchy(data).sum(d => 1)); // 统计省级下市级数据
  // console.log(d3.hierarchy(data).sum(d => 1).sort((a, b) => b.value - a.value)); // 根据数据降序排列
  const regions = d3.hierarchy(data).sum(d => 1).sort((a, b) => b.value - a.value); // 降序
  const pack = d3.pack().size([1600, 1600]).padding(3);
  const root = pack(regions); // 映射成圆形
  console.log(root);


  // 获取 canvas 上下文
  // 1. 获取 canvas 元素
  const canvas = document.querySelector("canvas");
  // 2. 通过 getContext 拿到上下文对象
  const context = canvas.getContext("2d");


  const TAU = 2 * Math.PI; // 结束角 整圆 2π
  function draw(ctx, node, {fillStyle = 'rgba(0, 0, 0, 0.2)', textColor = 'pink'} = {}) {
    const children = node.children;
    const {x , y, r} = node; // 外圆
    ctx.fillStyle = fillStyle; // 设置绘图状态 
    ctx.beginPath(); // 调用 beginPath 指令开始绘制图形
    ctx.arc(x, y, r, 0, TAU); // 调用绘图指令，绘制圆形 arc
    ctx.fill(); // 调用 fill 指令，将绘制内容输出到画布
    if (children) {
      for (let child of children) {
        draw(ctx, child)
      }
    } else {
      // 绘制子节点 文字
      const name = node.data.name;
      ctx.fillStyle = textColor;
      ctx.font = "1.5 rem Aril";
      ctx.textAlign = "center";
      ctx.fillText(name, x, y);
    }
  }
  // 用 context -- canvas 上下文对象绘制图形
  draw(context, root);

}();