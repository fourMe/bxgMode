define(function () {
  //将url中的参数信息转换成对应的对象那个
  //获取指定参数内容的时候,直接访问对象的属性即可
  //主要利用字符串的slice()功能去截取 split()方法去拆分成字符串数组
  
  return {
    getIDobj: function () {
      // location.search 获取到的是一个去掉路径名之后的字符串
      var loaurl = location.search.slice(1).split("&");
      var result = {};
      for (var i = 0; i < loaurl.length; i++) {
        var tmp = loaurl[i].split("=");
        result[tmp[0]] = tmp[1];
      }
      return result;
    },
    
    getIDkey: function (key) {
      // 因为上面返的返回值是一个对象所以直接中括号键名就可以取出里面的值
      return this.getIDobj()[key];
      
    }
    
  }
  
})