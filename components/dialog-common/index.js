// components/dialog-common/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //显示隐藏弹窗
    showDialog: {
      type: Boolean,
      value: false
    },
    //图片路径
    imageSrc: {
      type: String,
      value: 'https://wxapi.benpaobao.com/static/app_img/auth-icon.png'
    },
    content: {
      type: String,
      value: ''
    },
    //按钮文字
    btnStr: {
      type: String,
      value: ''
    },
    //按钮状态
    status: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageHeight: 0
  },

  ready: function(){
    let that = this;
    //改变高度
    wx.getSystemInfo({
      success: function (res) {
        console.log("windowWidth------>" + res.windowWidth);
        that.setData({
          imageHeight: (res.windowWidth * (1 - 0.3)) * 0.564
        })
        console.log('imageHeight----------->' + that.data.imageHeight);
      }
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    actionListener: function (event) {
      console.log(event);
      var myEventDetail = { data: event.currentTarget.dataset};// detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('action', myEventDetail, myEventOption);
      this.setData({
        showDialog: false
      })
    },

    hideDialog: function(){
      this.setData({
        showDialog: false
      })
    }
  }
})
