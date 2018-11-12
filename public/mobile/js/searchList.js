$(function () {
    new App();
});

var App = function () {
    //地址栏的搜索关键字
    this.proName = lt.getParamsByUrl().key;
    console.log(this.proName);
    this.page = 1;
    this.pageSize =4;
    //输入框
    this.$input = $('.lt_search input').val(this.proName);
    //搜索按钮
    this.$button = $('.lt_search a');
    //待渲染的容器
    this.$product = $('.lt_product');
    //排序容器
    this.$order = $('.lt_order');
    this.init();
};
App.prototype.init = function () {
    this.initPullRefresh();
    this.bindEvent();
};
App.prototype.render = function (callback) {
    var that = this;
    //获取数据
    $.ajax({
        type: 'get',
        url: '/product/queryProduct',
        data: $.extend({
            proName: that.proName,
            page: that.page,
            pageSize: that.pageSize
        },that.orderObject),
        dataType: 'json',
        success: function (data) {
            //这里只是测试使用 工作当中速度越快越好
            setTimeout(function () {
                callback && callback(data);
            }, 500);
        }
    });
};
App.prototype.bindEvent = function () {
    var that = this;
    that.$button.on('tap', function () {
        that.search();
    });
    that.$order.on('tap', 'a', function () {
        that.order(this);
    });
};
App.prototype.initPullRefresh = function () {
    var that = this;
    mui.init({
        pullRefresh: {
            container: '.mui-scroll-wrapper',
            indicators: false,
            down: {
                auto: true,
                callback: function () {
                    that.page = 1;
                    that.render(function (data) {
                        //完成渲染  html替换
                        that.$product.html(template('productList', data));
                        //完毕之后 结束下拉刷新效果
                        mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                        //重置下拉刷新
                        mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
                    });
                }
            },
            up: {
                callback: function () {
                    //翻页
                    that.page++;
                    that.render(function (data) {
                        //完成渲染  append 追加
                        that.$product.append(template('productList', data));
                        //完毕之后 结束上啦加载效果
                        mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(!data.data.length);
                    });
                }
            }
        }
    });
};
App.prototype.search = function () {
    //搜索业务

    var value = this.$input.val().trim();
    if (!value) {
        mui.toast('请输入关键字');
        return;
    }
    //正常去搜索
    this.proName = value;
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();//主动去触发下拉刷新效果
};
App.prototype.order = function (orderBtn) {
    var that = this;
    //排序
    var $orderBtn = $(orderBtn);
    /*1. 样式的切换*/
    //判断是否已经选中
    if ($orderBtn.hasClass('now')) {
        var $span = $orderBtn.find('span');
        if ($span.hasClass('fa-angle-down')) {
            $span.attr('class', 'fa fa-angle-up');
        } else {
            $span.attr('class', 'fa fa-angle-down');
        }
    } else {
        //其他选中的需要重置
        that.$order.find('a').removeClass('now').find('span').attr('class', 'fa fa-angle-down');
        //当前的选中
        $orderBtn.addClass('now');
    }
    /*2. 根据当前的排序状态  重新渲染页面*/
    //获取排序的数据
    var orderType = orderBtn.dataset.type; // price num time sale
    var orderValue = $orderBtn.find('span').hasClass('fa-angle-down') ? 2 : 1;
    //排序对象
    that.orderObject = {};
    that.orderObject[orderType] = orderValue;
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();//主动去触发下拉刷新效果
};


