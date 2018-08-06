// components/share-popup/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showPop: {
      type: Boolean,
      value: false
    },

    //广告id，有需要可以设置（可选）
    adId: {
      type: String,
      value: ''
    },

    //分享好友类型，normal-普通拉新，award-奖励， ad-广告
    shareFriendType: {
      type: String,
      value: 'normal'
    },

    isOpen: {
      type: Boolean,
      value: true
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

    toggleShareMoments: function(){
      this.setData({
        showPop: false
      })
      var myEventDetail = {};// detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('shareMoment', myEventDetail, myEventOption);
    }
  }
})
