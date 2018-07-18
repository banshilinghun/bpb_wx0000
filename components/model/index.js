// components/model/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: '提示'
    },
    cancelText: {
      type: String,
      value: '取消'
    },
    confirmText: {
      type: String,
      value: '确认'
    },
    showCancel: {
      type: Boolean,
      value: true
    },
    showConfirm: {
      type: Boolean,
      value: true
    },
    cancelLoading: {
      type: Boolean,
      value: false
    },
    confirmLoading: {
      type: Boolean,
      value: false
    },
    cancelTextColor: {
      type: String,
      value: ''
    },
    confirmTextColor: {
      type: String,
      value: ''
    },
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

    handleCilckCancel() {
      this.triggerEvent('cancel');
    },

    handleClickConfirm() {
      this.triggerEvent('confirm');
    }
  }
})
