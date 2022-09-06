// 1. 通过local.storage里的凭证判断登录成功没
const token = window.localStorage.getItem("token");
const id = window.localStorage.getItem("id");
// 2. 判断token和id是否存在
if (!token || !id) {
  // 没登陆，不显示登录信息
  $(".off").addClass("active");
  $(".on").removeClass("active");
} else {
  // 登陆过
  getInfo();
}
// 3. 请求用户信息
function getInfo() {
  // 3-1. 发送请求
  $.ajax({
    url: "http://localhost:8888/users/info",
    methods: "GET",
    data: { id: id },
    headers: {
      authorization: token,
    },
    success(res) {
      // console.log(res)
      // 3-2. 判断是否登录
      if (res.code !== 1) {
        $(".off").addClass("active");
        $(".on").removeClass("active");
        return;
      } else {
        $(".on").addClass("active").find("span").text(res.info.nickname);
        $(".off").removeClass("active");
      }
    },
  });
}

// 4. 个人中心的跳转
$(document).ready(function () {
  // 现在的on()方法需要加上document.ready
  $(".self").on("click", function () {
    // alert("你真帅");
    // console.log("qqqq");
    window.location.href = "./self.html";
  });
});

// 5. 退出登录
$(document).ready(function () {
  $("button.logout").on("click", function () {
    $.get("http://localhost:8888/users/logout", { id: id }, (res) => {
      window.location.reload();
    });
  });
});
