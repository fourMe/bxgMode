
$(function () {
	//在进行模板的时候需要进行一下用户页面的判断 因为在登陆页面并不需要进行模板的添加,只有不是登录页面才需要获取cookie的数据进行模板的渲染;
  if(location.pathname!="/dashboard/login"){
    // 这里的location.pathname是location的一个属性,存放的是当前页面的路径地址;
    
    //从cookie中获取user的信息
    var userinfo=$.cookie("userinfo");
    userinfo=JSON.parse(userinfo);
    
    
    //需要使用模板引擎进行侧边栏的渲染
    var html =template("profile-tpl",userinfo);
    $("#user-info").html(html);
  }
})