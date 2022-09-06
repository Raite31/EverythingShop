// 1.验证是否是从列表页跳转来的
const goodsId = window.localStorage.getItem("goodsId");

if (!goodsId) window.location.href = "./list.html";
// 2. 根据商品id 请求商品信息
getInfo();
function getInfo() {
  $.get("http://localhost:8888/goods/item", { id: goodsId }, (res) => {
    // console.log(res);
    // 渲染页面
    $(".show>img").prop("src", res.info.img_big_logo);
    $(".info>.title").text(res.info.title);
    $(".info > .price").text("￥" + res.info.current_price);
  });
}
