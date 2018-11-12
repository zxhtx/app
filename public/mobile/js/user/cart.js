$(function () {
    window.app=new App();
});

var App=function () {
    this.$el=$('#list');
    this.init();
};

App.prototype.init=function () {
    this.initPullRefresh();
    this.bindEvent();
};

App.prototype.initPullRefresh=function () {
    var that =this;
    mui.init({
        pullRefresh: {
            container: '.mui-scroll-wrapper',
            indicators: false,
            down: {
                auto: true,
                callback: function () {
                    var _self = this;
                    that.render(function () {
                        _self.endPulldownToRefresh();
                    });
                }
            }
        }
    });
};


App.prototype.render=function (callback) {

    var that=this;
    if (this.list){
        that.$el.html(template('cart', {list: that.list}));
        callback && callback();
    }else{
        lt.ajax({
            type:'get',
            url:'/cart/queryCart',
            data:'',
            dataType:'json',
            success:function (data) {
                that.list=data;
                that.$el.html(template('cart',{list:that.list}));

                callback && callback();
            }
        });
    }

    
};


App.prototype.bindEvent=function () {

    var that=this;
    that.$el.on('tap','.fa-edit',function () {
        that.edit(this);
    }).on('tap','.fa-trash',function () {
        that.delete(this);
    }).on('change','input',function () {
        var isChecked=$(this).prop('checked');
        var index=this.dataset.index;
        var product=that.list[index];
        product.isChecked=isChecked;
        that.calcAmount();

    });

    //选择尺码  选择数量
    $('body').on('tap', '.pro_size span', function () {
        that.changeSize(this);
    }).on('tap', '.pro_num .change span', function () {
        that.changeNum(this);
    });

};

App.prototype.edit=function (btn) {
    var that=this;
    var index=btn.dataset.index;
    //当前编辑的商品信息
    var product=that.list[index];
    console.log(product);

    var html=template('edit',{product:product});
    mui.confirm(html.replace(/\n/g,''),'编辑商品',['取消','确认'],function (e) {
        if (e.index==1){
            var size=$('.pro_size span.now').data('value');
            var num=$('.pro_num input').val();
            lt.ajax({
               type:'post',
                url:'/cart/updateCart',
                data:{
                  id:product.id,
                  size:size,
                  num:num
                },
                dateType:'json',
                success:function (data) {
                    if(data.success){
                        //列表更新
                        product.size=size;
                        product.num=num;
                        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
                        that.calcAmount();
                    }
                }
            });
        }
    })
};

App.prototype.delete=function (btn) {
    var that=this;
    var index=btn.dataset.index;
    var product=that.list[index];
    //删除
    mui.confirm('您是否删除该商品？', '温馨提示', ['取消', '确认'], function (e) {
    lt.ajax({
        type:'get',
        url:'/cart/deleteCart',
        data:{id:product.id},
        dataType:'json',
        success:function (data){
            if(data.success){
                //删除数据
                that.list.splice(index,1)
            }
            mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
            that.calcAmount();

        }
    })

    });

};

App.prototype.calcAmount=function () {
var amountCount=0;
this.list.forEach(function (item,i) {
    if (item.isChecked){
        amountCount+=item.num*item.price;
    }

});

$('.lt_amount span').html(amountCount.toFixed(2));

};


App.prototype.changeSize = function (btn) {
    $(btn).addClass('now').siblings().removeClass('now');
};
App.prototype.changeNum = function (btn) {
    //自定义数据获取的方式： div ==>  data-type="ok"
    // dom.dataset.type
    // jquery.data('type')  提供的获取自定义属性的函数
    //判断按钮的类型
    var type = btn.dataset.type;
    //当前的数量
    var $input = $(btn).siblings('input');
    var num = $input.val();
    var max = $input.data('max');
    //如果是减  不能小于1
    if (type == 0) {
        if (num <= 1) {
            mui.toast('至少一件');
            return false;
        }
        num--;
    }
    //如果是加  不能大于库存
    else {
        if (num >= max) {
            mui.toast('库存不足');
            return false;
        }
        num++;
    }
    //操作的当前数量
    $input.val(num);
};
