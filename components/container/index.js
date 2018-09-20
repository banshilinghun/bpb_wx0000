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

  ready(){
    this.setScrollHeight();
  },

  /**
   * 组件的方法列表
   */
  methods: {

    setScrollHeight() {
      const that = this;
      let proSystem = new Promise(function (resolve, reject) {
        wx.getSystemInfo({
          success: function (res) {
            resolve(res);
          }
        });
      })
      Promise.all([proSystem]).then(results => {
        that.setData({
          scrollHeight: results[0].windowHeight - 74
        });
      })
    },

    formSubmit(event) {
      this.triggerEvent('submit', event);
    }
  }
})