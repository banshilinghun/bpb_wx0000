// components/share-popup/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showPop: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showPop: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 关闭
     */
    toggleBottomPopup: function(){
      this.setData({
        showPop: false
      })
    },

    /**
     * 分享到朋友圈
     */
    toggleShareMoments: function(){
      var myEventDetail = {};// detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('shareMoment', myEventDetail, myEventOption);
    }
  }
})
