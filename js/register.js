$("form").on("submit", function (e) {
  // 1. 阻止默认行为
  e.preventDefault();
  // 2. 采集用户信息
  const data = $("form").serialize();
  // console.log(data)
  // 3. 发送请求 带参 回调函数
  $.post("http://localhost:8888/users/register", data, (res) => {
    console.log(res);
    // 4. 判断结果，决定是否提示错误
    if (res.code === 0) {
      // 提示错误
      $("form > span").css("display", "block");
      return;
    }
    // 5. 跳转页面
    // window.alert("恭喜注册成功，点击确定跳转到登录页");  // 现在的弹窗会影响后面的跳转
    window.location.href = "./login.html";
  });
});
