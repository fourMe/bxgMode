define(["utils", "jquery", "template", "form", "datepicker", "datepickerCN","validate"], function (utils, $, template) {
  
  $(function () {
    //功能需求分析:
    //通过分析我们发现教师的添加和编辑功能的页面几乎是一模一样,差别只是多了一个密码框和按钮得文本不同 ,所以会在实际工作中把这两个功能在同一个页面上实现
    
    //思路分析:
    // 因为如果是点击添加讲师的功能我们只需要把页面原样展示出来即可
    //如果是点击编辑按钮 我们需要在编辑的页面上展示之前你点击的教师信息即可(通过你按钮的a连接href属性传入当前点击教师的id)
    
    //获取id
    var id = utils.getIDkey("id");
    var data = {};  //用来储存页面的信息
    
    if (id) {
      //说明是编辑页面
      // alert("编辑页面");
      data.title = "讲师编辑";
      data.btnText = " 保 存 ";
      data.url = "/api/teacher/update";   //这里的url表达的是form表单action  的数据要提交的地址
      
      $.ajax({
        url: "/api/teacher/edit",
        data: {tc_id: id},
        //需要注意的是在这里因为上面的对象模拟了返回数据的data ;然而又因为后台返回的有效数据是存储在data.result的对象中的, 所以这就造成了一个矛盾,应该用哪个数据去当做渲染模板的对象,老师的做法就是利用了一个中间量data.teacher去代替掉了msg.result;所以就能在模板函数中使用了同一个对象data;,但是注意在渲染模板时里面的变量.
        success: function (msg) {
          if (msg.code == 200) {
            // console.log(msg);
            data.teacher = msg.result;
            // 因为ajax是异步的所以模板渲染必须要在成功的回调里面去做
            renderMode();
          }
        }
      })
    } else {
      // alert("添加功能");
      
      data.title = "讲师添加";
      data.btnText = " 添 加 ";
      data.url = "/api/teacher/add";
      data.teacher = {
        tc_gender:"0",   //添加讲师的时候默认讲师性别为0;
      };
      renderMode();
    }
    
    //因为两个功能都要进行渲染模板所以要创建一个渲染模板的函数
    function renderMode() {
      var html = template("teacher-manage-tpl", data);
      $(".body.teacher").html(html);
      
      //实现入职日期的插件点选功能  因为要在模板生成之后才能选择到input 文本框  所以添加日期插件这一步也要在模板的渲染功能中去做.
      $("input[name='tc_join_date']").datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        //关于插件的语言格式问题,需要看下载语言包中的 dates = $.fn.datepicker.dates["zh-CN"]中的参数什么在语言参数中就写什么参数
        // 而语言文件最后传入得参数是(jQuery)就说明语言包是依赖jq的;
        language: "zh-CN",
        
      })
      
      //利用表单验证插件去实现表单的验证功能; (之前用委托事件做的表单提交在这里因为模板已经渲染,所以可以直接选择)
      $('form').validate({
        onBlur: true,     //表单内开启失去焦点验证
        onChange: true,   //开启表单值改变的验证
        sendForm: false, //阻止表单默认提交,使用ajax异步提交
        conditional: {
          stopName: function (value) {
            return value != "前端学院";
          }
        },
        description: {
          username: {
            required: "用户名不能为空",
            conditional: "不能使用前端学院"
          },
          password: {
            required: "密码不能为空",
            pattern: "密码必须为6-15位的字母或数字"
          },
          joindate: {
            required: "入职日期不能为空"
          }
        },
        valid: function () {
          //this就是这个表单的jquery对象！
          this.ajaxSubmit({
            success: function (data) {
              // console.log(data);
              if (data.code == 200) {
                location.href = "/teacher/list"
              }
            }
          })
        },
        eachValidField: function(){
          //这个函数会在，验证时，每一个通过验证的字段都会调用一次这个函数
         //通过的元素让它的输入框变成绿色,它的方法就是让它的父元素的父元素拥有has-success类并且去掉has-error; 在bootstorp中全局样式中的表单验证中可以查到
          this.parent().parent().addClass("has-success").removeClass("has-error")
        },
        eachInvalidField: function(){
          //这个函数会在，验证时，每一个不通过验证的字段都会调用一次这个函数
          this.parent().parent().addClass("has-error").removeClass("has-success")
        }
      })
      
      
    }
    
    
    //注册提交事件
    //因为这里面用到的插件form会自动获取表单元素action属性栏地址 以及表单各个input里的值(前提是input中要有name属性)
    //还是因为ajax的异步性,不能直接给btn注册事件, 因为有可能在执行注册事件的时候还没生成模板
    //所以要注册委托事件的形式 (给整个form注册了提交事件,又因为btn的默认type就是submit,所以都会提交)
    
    
    //需要特别注意的是:在如果没有成功实现讲师的添加一定要要看是否传入了指定的参数类型(在模板中下拉菜单的 name属性是否都正常填写).
    
    // $(".body.teacher").on("submit", "form", function () {
    //
    //   return false;
    // })
  })
  
})
