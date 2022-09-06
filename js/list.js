// 1. 请求分类列表，渲染分类位置内容
getCateList();
function getCateList() {
  $.get("http://localhost:8888/goods/category", (res) => {
    // console.log(res);
    // 1-2. 渲染分类内容
    let str = `<li class="active">全部</li>`;

    res.list.forEach((item) => {
      str += `<li>${item}</li>`;
    });
    $(".category").html(str);
  });
}

// 2. 请求商品列表渲染页面
// 2-1. 准备请求需要用到的参数
const info = {
  current: 1,
  pagesize: 12,
  search: "",
  saleType: 10,
  sortType: "id",
  sortMethod: "ASC",
  category: "",
};

// 提前准备变量，接收一共多少也;
let totalPage = 1;

// 2-2. 请求列表数据
getGoodsList();
function getGoodsList() {
  $.get("http://localhost:8888/goods/list", info, (res) => {
    // console.log(res);
    totalPage = res.total;
    // console.log(totalPage);
    bindHtml(res);
  });
}

// 2-3. 渲染页面
function bindHtml(res) {
  //   console.log(res);
  //   1. 判断当前页如果是第一页 那么left按钮有disable类名;
  if (info.current === 1) $(".left").addClass("disable");
  else $(".left").removeClass("disable");
  //   2. 判断当前页如果是最后一页 则right按钮有disable类名;
  if (info.current === res.total) $(".right").addClass("disable");
  else $(".right").removeClass("disable");
  //   3. 渲染统计位置
  $(".totle").text(`${info.current} / ${res.total}`);
  //   4. 渲染一页显示多少条
  $("select").val(info.pagesize);
  // 5. 渲染当前页
  $(".page").text(info.current);
  //   6. 渲染商品列表
  let str = ``;
  res.list.forEach((item) => {
    str += `
    <li goodsId= "${item.goods_id}">
        <div class="show">
            <img src="${item.img_big_logo}" alt="">
            ${item.is_hot ? '<div class="hot">hot</div>' : ""}
            ${item.is_sale ? '<div class="sale">sale</div>' : ""}
        </div>
        <div class="info">
            <p class="title">${item.title}</p>
            <p class="price">
                <span class="current">￥${item.current_price}</span>
                <span class="old">￥ ${item.price}</span>
            </p>
            <button goodsId= ${item.goods_id}>加入购物车</button>
        </div>
    </li> `;
  });
  $(".list").html(str);
}

// 3. 各种事件的渲染
// 3.1 分类类的按钮
$(".category").on("click", "li", function () {
  // 1. 切换分类
  $(this).addClass("active").siblings().removeClass("active");
  // 2. 修改info中的数据
  info.category = $(this).text() === "全部" ? "" : $(this).text();
  //   因为切换分类会影响到一共多少也，所以最好把当前页面回归到第一页;
  info.current = 1;
  //   3. 重新请求数据
  getGoodsList(); // 会info进去了
});

// 3.2 筛选类的
$(".filter").on("click", "li", function () {
  // 1. 切换类名
  $(this).addClass("active").siblings().removeClass("active");
  //   2. 修改info中的数据
  info.filter = $(this).attr("type");
  info.current = 1;
  //   3. 重新渲染页面
  getGoodsList();
});

// 3.3 折扣类的
$(".sale").on("click", "li", function () {
  // 1. 切换类名
  $(this).addClass("active").siblings().removeClass("active");
  //   2. 修改info中的数据
  info.saleType = $(this).attr("type");
  info.current = 1;
  //   3. 重新渲染页面
  getGoodsList();
});

// 3.4 排序类的
$(".sort").on("click", "li", function () {
  // 1. 切换类名
  $(this).addClass("active").siblings().removeClass("active");
  //   2. 修改info中的数据
  info.sortType = $(this).attr("type");
  info.sortMethod = $(this).attr("method");
  // 3. 重新渲染页面
  getGoodsList();
});

// 3.5 模糊搜索;
$(".search").on("input", function () {
  // 1. 修改info信息;
  info.search = $(this).val().trim();
  info.current = 1;
  // 2. 重新渲染页面
  getGoodsList();
});

// 3.6 各种分页信息
$(".left").on("click", function () {
  if ($(this).hasClass("disable")) return;
  // 1. 修改info信息
  info.current--;
  // 2.重新渲染页面
  getGoodsList();
});
$(".right").on("click", function () {
  if ($(this).hasClass("disable")) return;
  // 1. 修改info信息
  info.current++;
  // 2.重新渲染页面
  getGoodsList();
});

$("select").on("change", function () {
  // 1. 修改info信息
  info.pagesize = $(this).val();
  info.current = 1;
  // 2. 重新渲染页面
  getGoodsList();
});

$(".jump").on("click", function () {
  // 1. 拿到文本框中的文本内容
  let page = $(".page").val();
  // 对page进行一些判断
  // 判断非数字，我们直接使用1
  if (isNaN(page)) {
    page = 1;
  }
  // 判断小于1，直接使用1
  if (page <= 1) {
    page = 1;
  }
  // 判断大于总页数，直接使用总页数
  if (page >= totalPage) {
    page = totalPage;
  }

  // 2. 修改info中的数据
  info.current = page;
  // 3. 重新渲染页面
  getGoodsList();
});

// 4. 加入购物车
$(".list").on("click", "button", function (e) {
  // 1. 阻止事件传播
  e.stopPropagation();

  // // // 2. 验证登录
  const token = window.localStorage.getItem("token");
  const id = window.localStorage.getItem("id");
  if (!token || !id) {
    window.alert("您还没登陆，请登陆后再操作 ");
    return;
  }

  console.log("加入购物车");
  $.ajax({
    url: "http://localhost:8888/cart/add",
    method: "POST",
    headers: { authorization: token },
    data: { id: id, goodsId: $(this).attr("goodsId") },
    success(res) {
      // console.log(res);
      if (res.code !== 1) {
        return;
      }
      window.alert("加入购物车成功");
    },
  });
});

// 5. 切换详情页面
$(".list").on("click", "li", function () {
  console.log("跳转到详情页面");
  // 拿到商品id，存储在localStorage内。
  // 在详情页就知道是点击哪个商品跳转的
  window.localStorage.setItem("goodsId", $(this).attr("goodsId"));
  // 跳转页面
  window.location.href = "./detail.html";
});
