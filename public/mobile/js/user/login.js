$(function () {
    $('form').on('submit',function (e) {
        e.preventDefault();
        var data=lt.getParamsByUrl($(this).serialize());
        // console.log(data);

        if (!data.username){
            mui.toast('请输入用户名');
            return false;

        }

        if (!data.password){
            mui.toast('请输入密码');
            return false;
        }

        $.ajax({
           type:'post',
           url:'/user/login',
            data:data,
            dataType:'json',
            success:function (data) {
                if(data.success){
                    var returnUrl=lt.getParamsByUrl().returnUrl;
                    if (returnUrl){
                        location.href=returnUrl;

                    }else{
                        location.href='/mobile/user/index.html';
                    }

                }else{
                    mui.toast(data.message);
                }
            }
        });

    })
})