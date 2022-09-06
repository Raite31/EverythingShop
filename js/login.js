// nizhenshuai
// 890890

$("form").on("submit", function (e) {
  // 1. 组织默认行为
  e.preventDefault();
  // 2. 采集用户信息
  //    serialize()：序列化表单值
  const data = $("form").serialize();
  // console.log(data)
  // 3. 发送请求
  $.post("http://localhost:8888/users/login", data, (res) => {
    // console.log(res)
    // 4. 登录判断
    if (res.code === 0) {
      $("form > span").css("display", "block");
      return;
    }
    // 5.1. 把登录过的“凭证”存储起来
    // 5.2. 把用户的id信息也存储起来
    // 5.3. 跳转页面
    window.localStorage.setItem("token", res.token);
    window.localStorage.setItem("id", res.user.id);
    window.location.href = "./index.html";
  });
});
