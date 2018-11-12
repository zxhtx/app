$(function () {
    new Search();
});
var Search = function () {
    this.init();
};
Search.prototype.init = function () {
    //初始化好常用的变量
    this.$history = $('.lt_history');
    this.$input = $('.lt_search input').val('');
    this.$button = $('.lt_search a');
    this.key = 'lt_history_search';
    this.list = JSON.parse(localStorage.getItem(this.key) || '[]');//如果没有数据默认一个空数组
    this.render();
    this.bindEvent();
};
Search.prototype.render = function () {
     
   this.$history.html(template('history',{list:this.list,euc:encodeURIComponent}))
};
Search.prototype.bindEvent = function () {
  var that =this;
  that.$button.on('tap',function () {
      var value=that.$input.val().trim();
      if (!value){
          mui.toast('请输入搜索关键字');
          return;
      }
      that.push(value);
      location.href='searchList.html?key='+encodeURIComponent(value);
  });
      that.$history.on('tap','li span',function () {
          // alert(1)
          that.delete(this.dataset.index);
          
      }).on('tap','.head a',function () {
          that.clear();

       
  })
 
  
};
//追加历史
Search.prototype.push = function (value) {
    /*1. 遇到相同的  删掉之前的 追加新的*/
    /*2. 超过了10条  删掉第一条 追加新的*/
    /*3. 正常情况  追加新的*/
    var that=this;
    isSame=false;
    var isSameIndex = null;
    that.list.forEach(function (item,i) {
        if (item==value){
            isSame=true;
            isSameIndex=i;
        }
    });
    if (isSame){
        that.list.splice(isSameIndex,1);
    }else if(that.list.length>=10){
        that.list.splice(0,1);
    }
    that.list.push(value);
    localStorage.setItem(that.key,JSON.stringify(that.list));

};
//删除历史
Search.prototype.delete = function (index) {
var that=this;
that.list.splice(index,1);
that.render();
localStorage.getItem(that.key,JSON.stringify(that.list));

};
//清空历史
Search.prototype.clear = function () {
var that=this;
localStorage.setItem(that.key,'[]');
that.list=[];
that.render();
};