$(function () {
    new Category();
});
var Category=function () {
    this.$topBox=$('.lt_cateTop');
    this.$secondBox=$('.lt_cateSecond');
    this.init();
    this.bindEvent();
}
/*入口文件*/
Category.prototype.init=function () {
this.render();
};
/*渲染功能*/
Category.prototype.render=function () {
var that=this;
that.renderTop(function (data) {
that.rendSecond(data.rows[0].id) ;
})
};
/*顶级分类渲染*/
Category.prototype.renderTop=function (callback) {
var that=this;
$.ajax({
    type:'get',
    url:'/category/queryTopCategory',
    data:'',
    dataType:'json',
    success:function (data) {
        that.$topBox.html(template('top',data));
        // console.log(data);
        callback && callback(data);
    }
});
};
/*二级分类渲染*/
Category.prototype.rendSecond=function (id) {
    var that=this;
    $.ajax({
        type:'get',
        url:'/category/querySecondCategory',
        data:{
            id:id
        },
        dataType:'json',
        success:function (data) {
            that.$secondBox.html(template('second',data));
        }
    })
};

/*绑定事件*/
Category.prototype.bindEvent=function () {
var that=this;
that.$topBox.on('tap','li',function () {
    that.toggleCategory(this);
})
};
/*切换分类*/
Category.prototype.toggleCategory=function (li) {
var that=this;
if($(li).hasClass('now'))return false;
that.$topBox.find('li').removeClass('now');
$(li).addClass('now');
that.rendSecond(li.dataset.id);

};