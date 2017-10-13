/*
* @Author: fourMe
* @Date:   2017-10-12 16:02:41
* @Last Modified by:   fourMe
* @Last Modified time: 2017-10-12 16:13:06
*/
define(["jquery","form","cookie"],function ($) {
  $(function () {
    //这里因为提交按钮没有设置合适的类名, 加上用户体验方面所以可以给整个表单注册一个提交事件
    $('form').submit(function (e) {
      
      //在这里还要进行表单响应的校验 即用户名和密码不能为空
      
      if ($('input[name=tc_name]').val().trim() == "") {
//            $.trim() 函数用于去除字符串两端的空白字符。
        alert("请输入用户名");
        return false;
      }
      if ($('input[name=tc_pass]').val() == "") {
        alert("请输入密码");
        return false;
      }
      
      // var data = $(this).serialize();
      
      // console.log(data);
      
      $(this).ajaxSubmit({
        url: "/api/login",
        type: "post",
        //在这里因为利用到了jq的插件jquery-form suoy,所以它会自动去获取表单里的有关input的值 所以就不需要用到了下面的的data了
        // data: data,
        
        success: function (data) {
          //这里表示如果返回值的状态码为200 表示登录成功也就是可以进行后续的操作的判定条件
          if (data.code == 200) {
//                 这里需要在成功的回调之后把用户的信息存储到cookie里面, 又因为cookie中的信息需要做到各个页面的
//                 的共享,所以要在存储cookie信息的时候把cookie的路径设置成根目录即可;
            console.log(data);
            
            //又因为cookie中只能存储字符串,所以要把返回回来的对象转变成字符串存入,用的时候在再转换成对象取出即可
            
            $.cookie("userinfo",JSON.stringify(data.result),{path:"/",expires:365});

//            如果用户登录成功,就把页面跳转到首页面  因为是window的属性所以可以省略Window;
            
            location.href='/';
            
          }
        }
      })
      //因为这里需要我们自己发送ajax请求,所以需要阻止掉浏览区的默认事件
      return false;
    })
  })
  
  
})


 