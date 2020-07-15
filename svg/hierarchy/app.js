const dataSource = "https://s5.ssl.qhres.com/static/b0695e2dd30daa64.json";

// 获取 SVG 图像
const svgroot = document.querySelector("svg");

void async function() {
  // 利用 d3-hierarchy 处理数据源
  const data = await (await fetch(dataSource)).json();
  const regions = d3.hierarchy(data).sum(d => 1).sort((a, b) => { return b.value - a.value});
  const pack = d3.pack().size([1600, 1600]).padding(3);
  const root = pack(regions);

  function draw(parent, node, {fillStyle = 'rgba(0, 0, 0, 0.2)', textColor = 'pink'} = {}) {
    const {x, y, r} = node;
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", r);
    circle.setAttribute("fill", fillStyle);
    circle.setAttribute("data-name", node.data.name);
    console.log("circle ================= node.data.name", node.data.name)
    parent.appendChild(circle);

    // 绘制 group
    // SVG 的 g 元素表示一个分组，可以用它来对 SVG 元素建立起层级结构
    const children = node.children;
    if (children) {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      for (let child of children) {
        draw(group, child)
      }
      group.setAttribute("data-name", node.data.name);
      console.log("group ================= node.data.name", node.data.name)
      parent.appendChild(group);
    } else {
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("fill", textColor);
      text.setAttribute("font-familiy", "Arial");
      text.setAttribute("font-size", "1.5rem");
      text.setAttribute("text-anchor", "middle"); // 文字居中
      text.setAttribute("x", x);
      text.setAttribute("y", y);
      const name = node.data.name;
      text.textContent = name;
      parent.appendChild(text);
    }
  }

  draw(svgroot, root);

}();

const titleEle = document.getElementById("title");
function getTitle(target) {
  const name = target.getAttribute("data-name");
  if (target.parentNode && target.parentNode.nodeName === "g") {
    const parentName = target.parentNode.getAttribute("data-name");
    return `${parentName} - ${name}`;
  }
  return name;
}


// 实现交互：当鼠标移到某个区域时，高亮区域，且显示出对应的省-市信息
// 事件冒泡处理 mousemove 事件
let activeTarget = null;
svgroot.addEventListener("mousemove", (evt) => {
  let target = evt.target;
  if (target.nodeName === 'text') {
    target = target.previousSibling; // fix mousemove 至文字显示 省-第一市级
  }
  if (activeTarget !== target) {
    if (activeTarget) {
      activeTarget.setAttribute('fill', 'rgba(0, 0, 0, 0.2)');
    }
    target.setAttribute('fill', 'rgba(0, 128, 0, 0.1)');
    activeTarget = target;
  }
  titleEle.textContent = getTitle(target);
})