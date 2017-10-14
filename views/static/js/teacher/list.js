//如果接口的地址为get,那么就不用写type类型 因为是默认值为get
define(["jquery", "template", "bootstrap"], function ($, template) {
  $(function () {
    //在教师列表的模板中有一个需求就是要计算出教师的年龄 但是从后台得到的数据就只有教师注册的出生日期这一项数据,所以就需要依据当前时间去计算得出教师的年龄,
    //在template模板中拥有一个过滤器的功能  但是注意的是过滤功能只支持最新的template-web版本
    
    // 标准语法
    // {{value | filter(自定义的函数名)}} 过滤器语法类似管道操作符，它的上一个输出作为下一个输入。
    
    //注册过滤器
    template.defaults.imports.getAge = function (value) {
      //这里在new date()传入一个参数意思就是初始化了一个时间对象 拿到数据的年份
      return new Date().getFullYear() - new Date(value).getFullYear();
    };
    
    $.ajax({
      url: "/api/teacher",
      success: function (data) {
        if (data.code == 200) {
          // console.log(data);
          var html = template("teacher-list-tpl", data);
          $("#teacher-list").html(html);
        }
      }
    })
    
    //点击列表信息中的查看按钮 需要弹出一个模态框 里面要展示出你当前点击项的教师信息
    //给所有的查看按钮注册点击事件 这里运用委托事件的方式
    $("#teacher-list").on("click", ".btn-checkinfo", function () {
      //在这里为了用户体验,让用户拿到最新的数据,所以我们需要发送ajax请求去拿到后台的数据,然后通过触发模态框去渲染出来
      // 请求数据  请求数据传参我们需要获取到你点击的当前讲师的id 所以在模板渲染的时候就需要我们去获取父元素的id
      // console.log(this);  //这里的this还是指向你要注册的元素
      var id = $(this).parent().data("id");
      // console.log(id);
      $.ajax({
        url: "/api/teacher/view",
        data: {
          tc_id: id,
        },
        success: function (data) {
          console.log(data);
          if (data.code == 200) {
            var html = template("teacher-info-tpl", data.result);
            $("#teacher-info").html(html);
            
            //打开模态框一共有两种方式 一种是原始的通过data-target="#id"用来指向被控制的模态框  一种是通过下面js的方式,直接让选择的元素调用
            $("#teacherModal").modal("show");
            
          }
        }
      })
    })
    
    //  讲师的注销和启用功能
    // 点击的时候需要改变按钮的颜色和文本状态
    // 思路就是在模板中利用三元表达式去做判断输出
    //讲师账号的状态：
    //已启用： tc_status == 0     按钮： 注销
    //已注销： tc_status == 1     按钮： 启用
    
    //给状态按钮注册点击事件
    $('#teacher-list').on("click", ".btn-status", function () {
      var id = $(this).parent().data("id");
      var status = $(this).data("status");
      var that = this;  //用来缓存指针的指向
      $.ajax({
        url: "/api/teacher/handle",
        type: "post",
        data: {
          tc_id: id,
          tc_status: status
        },
        success: function (data) {
          //这里需要拿到后台的状态码 根据状态码用三元表达式去修改状态按钮的所要显示的状态,并且同时把新的状态码设置给当前的按钮状态
          if (data.code == 200) {
            console.log(data);
            //属性名错误
            var isflag = data.result.tc_status == 0;
            $(that).text(isflag ? "注销" : "启用")
              .removeClass(isflag ? "btn-success" : "btn-warning")
              .addClass(isflag ? "btn-warning" : "btn-success")
              .data("status", data.result.tc_status)
          }
        }
      })
    })
    
  })
  
})