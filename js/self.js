// 1. 验证登录，若每日登录，不会展示该页面
const token = window.localStorage.getItem("token");
const id = window.localStorage.getItem("id");

// 2. 判断token和id是否存在
if (!token || !id) {
  window.location.href = "./login.html";
} else {
  getInfo();
}

// 3. 获取用户信息
function getInfo() {
  // 3.1 发送请求用户信息
  $.ajax({
    url: "http://localhost:8888/users/info",
    methods: "GET",
    data: { id: id },
    headers: { authorization: token },
    success(res) {
      //   console.log(res);
      // 3.2 判断已经注销过一次登录
      if (res.code !== 1) {
        window.location.href = "./login.html";
        return;
      } else {
        // console.log(res);

        // 展示用户信息
        $("form .username").val(res.info.username);
        $("form [name=nickname]").val(res.info.nickname);
        $("form [name=age]").val(res.info.age);
        $("form [name=gender]").val(res.info.gender);
      }
    },
  });
}

// 4. 修改个人信息
$("form").on("submit", function (e) {
  e.preventDefault();
  //   4.1 采集用户信息
  const data = $("form").serialize(); // serialize()：序列化表单值
  //   4.2 发送请求
  $.ajax({
    url: "http://localhost:8888/users/update",
    methods: "POST",
    data: data + "&id=" + id,
    headers: { authorization: token },
    success(res) {
      console.log(res);
      if (res.code === 1) {
        window.alert("修改成功");
      }
    },
  });
});
