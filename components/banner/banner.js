// components/banner/banner.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bannerWidth: {
      type: Number,
      value: 375
    },

    //banner 高度
    bannerHeight: {
      type: Number,
      value: 465.75/2
    },

    //是否自动轮播
    autoplay: {
      type: Boolean,
      value: true
    },

    //每张轮播图停留时间
    interval: {
      type: Number,
      value: 3000
    },

    //切换动画时间
    duration: {
      type: Number,
      value: 800
    },

    //图片数组
    banners: {
      type: Array,
      value: []
    },

    //是否显示banner
    showBanner: {
      type: Boolean,
      value: true
    },

    //图片缩放方式 默认 scaleToFill
    imageMode: {
      type: String,
      value: 'scaleToFill'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    bannerClick: function(e){
      var myEventDetail = {};
      this.triggerEvent('bannerClick', myEventDetail);
    }
  }
})
