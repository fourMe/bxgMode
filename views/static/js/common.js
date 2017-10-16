//定义一个模块
//首先这里面运用了三个第三方插件  分别是jquery  cookie template
//所以在接受参数的时候也要接收三个参数的路径
define(["jquery", "template", "nprogress","cookie"], function ($, template,NProgress) {
  NProgress.start();  //在页面一开始的时候就进行加载
  
  $(function () {
    NProgress.done();   //表示的在页面结构加载完成后在停止
    
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
  
  //给导航栏菜单添加点击事件,实现点击父菜单显示下面的子菜单;
  //因为导航栏中只要有子菜单那么结构就是一样的,所以我们通过子菜单去向上找它的父元素注册事件可以给导航栏中所有拥有子菜单的父元素都注册事件
  $(".navs>ul>li>ul").parent().click(function () {
    $(this).children("ul").slideToggle("fast");
  })
  
  
  //需要给侧边导航栏注册点击事件来实现导航列表的高亮显示功能
  
  //思路就是  让当前页面导航栏中所有对应的a标签添加上active的样式
   var activeA=$(".navs a[href='"+location.pathname+"']");
   activeA.addClass('active');
  
  //做完上述操作还会有一个bug 就是在页面刷新的时候,之前显示的子菜单又会再一次关闭
  //因为上面是给所有的a都注册了active的切换
  //思路就是    我们只需要依据子菜单的a 向上找他的父元素的父元素看它有没有一个a的兄弟元素,
  //以此作为判断的依据,显示对应的子菜单ul即可.
  if(activeA.parent().parent().siblings('a').length>0){
    activeA.parent().parent().show();
  }
  
  
  
  // (但是有一个不好的用户体验上就是在ajax的没有拿到的数据展示在页面的时候进度条就加载完了,所以需要解决这个问题 但是又不可能在每个ajax函数的中书写代码 这个时候运用了到了ajax全局事件)
  //ajax全局事件：
  //所有的ajax请求，都会触发注册的ajax全局事件，所以如果想要在所有的ajax请求发送开始到结束期间做某些事情的话，ajax全局事件，可以帮助我们统一实现
  
  //注册ajax全局事件实现所有ajax加载的进度条加载
  $(document).ajaxStart(function(){
    NProgress.start();
    $('#mask').show();
  });
  $(document).ajaxStop(function(){
    NProgress.done();
    $('#mask').hide();
  });
  
  
  //需要实现一个全网页的遮罩层动画, 还是要在ajax的全局事件去做,因为是遮罩层肯定是一个固定定位,所以需要在公共部分区域找到一个父元素是body的盒子去做.(只会在有ajax的请求的页面显示动画加载图)
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
})

