//定义一个模块
//首先这里面运用了三个第三方插件  分别是jquery  cookie template
//所以在接受参数的时候也要接收三个参数的路径
define(["jquery", "template", "cookie"], function ($, template) {
  
  $(function () {
    //在进行模板的时候需要进行一下用户页面的判断 因为在登陆页面并不需要进行模板的添加,只有不是登录页面才需要获取cookie的数据进行模板的渲染;
    
    if (location.pathname != "/dashboard/login") {
      // 这里的location.pathname是location的一个属性,存放的是当前页面的路径地址;
      
      //而且在这里会有一个bug,因为打开网站的默认连接就是index页面,再加上后台没有提供对应的判断用户是否登录的接口,所以我们自己要利用发送请求中cookie中是否带有服务器颁发的令牌去判断用户的登录状态,如果没有登录就把当前页面的连接跳转到login的页面
      if (!$.cookie("PHPSESSID")) {
        //需要跳转到login页面
        location.href = "/dashboard/login";
      }
      
      //从cookie中获取user的信息
      var userinfo = $.cookie("userinfo");
      userinfo = JSON.parse(userinfo);
      
      
      //需要使用模板引擎进行侧边栏的渲染
      var html = template("profile-tpl", userinfo);
      $("#user-info").html(html);
    }
  })
  
  //jquery的两种事件的注册方式,  利用on主要用来注册委托事件,其他简单的点击事件 主要还是用.事件名的方式来创建注册.
  $("#btn-logout").click(function () {
    //点击向后台发送ajax请求
    $.ajax({
      url: "/api/logout",
      type: "post",
      success: function (data) {
        if (data.code == 200) {
          console.log(data);
          //说明后台实现了退出登录操作,在这里后台只是把cookie的过期时间进一步提前,
          //显示如下 查看就把下面的连接注释  点击按钮去看响应的ajax请求
          //Set-Cookie:PHPSESSID=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/
          location.href = "/dashboard/login";
        }
      }
    })
  })
})

