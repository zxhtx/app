$(function () {
    lt.ajax({
    type:'get',
    url:'/user/queryUserMessage',
        data:'',
        dataType:'json',
        success:function (data) {
            $('.mui-media-body').html(data.username+" <p class='mui-ellipsis'>手机号："+data.mobile+"</p>");

        }


    });


    //2退出登录
    $('.logout').on('tap',function () {
        lt.ajax({
           type:'get',
           url:'/user/logout',
            data:'',
            dataType:'json',
            success:function (data) {
                if (data.success){
                    location.href='/mobile/user/login.html';
                }
            }
        });
    })
});