// 1. 验证登录
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
  $.ajax({
    url: "http://localhost:8888/users/info",
    method: "GET",
    data: { id: id },
    headers: { authorization: token },
    success(res) {
      //   console.log(res);
      // 3.2 判断错误
      if (res.code !== 1) {
        window.location.href = "./login.html";
        return;
      }
    },
  });
}

// 4. 表单提交发送请求，修改密码
$("form").on("submit", function (e) {
  e.preventDefault();
  const data = $("form").serialize();
  //   console.log(data);
  $.ajax({
    url: "http://localhost:8888/users/rpwd",
    method: "POST",
    data: data + "&id=" + id,
    headers: { authorization: token },
    success(res) {
      console.log(res);
      //   4.1 根据返回的结果，进行错误提示
      if (res.code !== 1) {
        $("form > span").css("display", "block");
        return;
      }
      //   4.2 提示用户修改密码成功
      window.alert("修改密码成功");
      window.location.href = "./login.html";
    },
  });
});
