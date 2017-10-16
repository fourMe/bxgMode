/*
* @Author: fourMe
* @Date:   2017-10-12 16:08:13
* @Last Modified by:   fourMe
* @Last Modified time: 2017-10-12 16:11:53
*/
require.config({
  //意思就是设置一个基础路径,以后引用文件的标准就是依据这个标准来找文件;
	baseUrl:"/views/assets",
	paths:{
	  //就是器一个别名;
		"jquery":"jquery/jquery",
		"cookie":"jquery-cookie/jquery.cookie",
		"template":"artTemplate/template-web",
    "form":"jquery-form/jquery.form",
		"bootstrap":"bootstrap/js/bootstrap",
    "utils":"../static/lib/utils",
    "datepicker":"bootstrap-datepicker/js/bootstrap-datepicker",
    "datepickerCN":"bootstrap-datepicker/locales/bootstrap-datepicker.zh-CN.min",
    "nprogress":"nprogress/nprogress",
    "validate":"jquery-validate/jquery-validate"
	},
  shim: {
    "bootstrap": {
      //deps是用来设置依赖项的
      deps: ["jquery"]
    },
    "datepickerCN":{
      deps: ["jquery"]
    },
    "validate":{
      deps: ["jquery"]
    }
    
  }
})