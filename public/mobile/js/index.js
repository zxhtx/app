$(function () {
   /*区域滚动 mui提供*/
   mui('.mui-scroll-wrapper').scroll({
       indicators:false,
        deceleration: 0.0006
});
   /*轮播图*/
   mui('.mui-slider').slider({
       interval:3000
   })

});