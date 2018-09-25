// components/container/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    btnSubmitText: {
      type: String,
      value: '提交'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    report: true
  },
  
  /**
   * 组件的方法列表
   */
  methods: {

    formSubmit(event) {
      this.triggerEvent('submit', event);
    }
  }
})