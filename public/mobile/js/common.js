/*公用功能*/
if(!window.lt){
    window.lt = {};
}
//1. 获取地址栏数据
lt.getParamsByUrl = function (url) {
    var searchStr = url || location.search;
    //预制空对象 准备接数据
    var obj = {};
    if(searchStr){
        searchStr = searchStr.replace(/^\?/,'');s
        var arr = searchStr.split('&');
        arr.forEach(function (item,i) {
        
            var itemArr = item.split('='); //[key,4]
            //存数据
            //encodeURIComponent 转换成URL编码
            //decodeURIComponent 解析URL编码字符串
            obj[itemArr[0]] = decodeURIComponent(itemArr[1]);
        })
    }
    return obj;
};

//2. 可以拦截未登录状态调整去登录页面,跟中间件一样
lt.ajax = function (options) {
    //把需要处理的事情封装进去
    var success = options.success; //保存的是登录成功后的业务
    //重新定义
    options.success = function(data){
        //遇见未登录 拦截
        if(data.error == 400){
            //携带当前的地址跳转去登录页面
            location.href = '/mobile/user/login.html?returnUrl='+encodeURIComponent(location.href);
            return;
        }
    
        success && success(data);
    };
    $.ajax(options);
};