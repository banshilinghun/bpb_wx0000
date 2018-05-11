// components/dialog/bpb-dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showDialog: {
      type: Boolean,
      value: false
    },
    //预约成功
    title: {
      type: String,
      value: ''
    },
    //分享给微信好友，让你的朋友们 一起赚钱吧!
    description: {
      type: String,
      value: ''
    },
    //按钮文字
    btnText: {
      type: String,
      value: '确定'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showDialog: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTap: function(){
      var myEventDetail = {};// detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('btnclick', myEventDetail, myEventOption);
      this.hideDialog();
    },

    hideDialog: function(){
      this.setData({
        showDialog: false
      })
    }
  }
})
