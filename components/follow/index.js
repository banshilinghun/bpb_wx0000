
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shareit: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    shareit: false
  },
  ready:function(){
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight;
        var windowscale = windowHeight / windowWidth;//屏幕高宽比  
        var imageWidth = windowWidth*0.677;
        var imageHeight = imageWidth*1.988;
        that.setData({
          imageWidth: imageWidth,
          imageHeight: imageHeight
        })
      }
      })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideShare: function () {
      this.setData({
        shareit: false
      })
    }
  }
})
