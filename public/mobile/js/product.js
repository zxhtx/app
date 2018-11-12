$(function () {
   new App();
});


var App=function () {
   //待渲染的元素
    this.$el=$('.mui-scroll');
    //商品id
    this.productId=lt.getParamsByUrl().id;
    this.init();
};

App.prototype.init=function () {
    //初始化下拉刷新
    this.initPullRefresh();
    //绑定事件
    this.bindEvent();
};

App.prototype.initPullRefresh=function () {
    var that=this;
    mui.init({
       pullRefresh:{
           container: '.mui-scroll-wrapper',
           indicators: false,

           down: {
               auto: true,
               callback: function () {
                  var self=this;

                  that.render(function () {
                      self.endPulldownToRefresh();
                  })

               }
           }
       }
    });
};

App.prototype.render=function (callback) {

   var that=this;
   $.ajax({
       type:'get',
       url:'/product/queryProductDetail',
       data:{id:that.productId},
       dataType:'json',
       success:function (data) {
           that.$el.html(template('product',{product:data}));
           //初始化轮播图
           mui('.mui-slider').slider({interval: 1000});
           callback && callback();
       }
   });
};

App.prototype.bindEvent=function () {
    var  that=this;
    that.$el.on('tap','.pro_size span',function () {
        that.changSize(this);
    }).on('tap','.pro_num .change span',function () {
        that.changNum(this);
    });


    $('.addCart').on('tap',function () {
        that.addCart();
    });
};

App.prototype.changSize=function (btn) {
    $(btn).addClass('now').siblings().removeClass('now');
    // console.log(1);

};

App.prototype.changNum=function (btn) {
    //判断按钮是加还是减
    var type=btn.dataset.type;
    var $input=$(btn).siblings('input');
    var num=$input.val();
    var max=$input.data('max');

    if (type==0){
        if(num<=1){
            mui.toast('至少一件');
            return false;
        }
        num--;
    }else{
        if(num>=max){
            mui.toast('库存不足');
            return false;
        }
        num++;
    }
    $input.val(num);

};

App.prototype.addCart=function () {

    var that=this;


    var size=$('.pro_size span.now').data('value');
    // console.log(size);
    if (!size){
        mui.toast('请选择尺码');
        return false;
    }

    lt.ajax({
        type:'post',
        url:'/cart/addCart',
        data:{
            productId:that.productId,
            size:size,
            num:$('.pro_num  .change input').val()
        },
        dataType:'json',
        success:function (data) {
            mui.confirm('添加成功,去购物车看看?','温馨提示',['取消','确认'],function (e) {
                if (e.index==1){
                    location.href='/mobile/user/cart.html';
                }
            })
        }
    })



};