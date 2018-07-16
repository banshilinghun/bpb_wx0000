// 信息确认弹窗

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //取消按钮文字
    cancelText: {
      type: String,
      value: '不接受'
    },
    //确认按钮文字
    confirmText: {
      type: String,
      value: '接受'
    },
    //是否显示弹窗
    showInfoDialog: {
      type: Boolean,
      value: false
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
    handleCancel: function(){
      this.triggerEvent('cancel', {}, {});
    },

    handleConfirm: function(){
      this.triggerEvent('confirm', {}, {});
    }
  }
})
