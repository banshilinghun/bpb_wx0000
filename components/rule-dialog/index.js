// components/rule-dialog/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showRuleDialog: {
      type: Boolean,
      value: false,
      observer: '_propertyChange'
    },
    imageHeight: {
      type: Number,
      value: 158
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ruleList: [
      '备注：在线时长数值向下取整数，例如车主在线6.8小时，以6小时计算。当日收益将于第二日中午12时前计入车主【我的】-【待收收益】内。'],
    status: false,
    text: '3'
  },

  ready: function () {
    let that = this;
    let count = 3;
    //倒计时
    setInterval(function(){
      if(count > 0){
        count--;
        that.setData({
          text: count,
          status: false
        })
      }else{
        that.setData({
          text: '知道了',
          status: true
        })
      }
    }, 1000);
    //改变高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          imageHeight: (res.windowWidth * (1- 0.08) - 30) * 0.564
        })
        console.log('imageHeight----------->' + that.data.imageHeight);
      }
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

    _propertyChange: function (newVal, oldVal) {
      var that = this;
      if (newVal) {
        
      }
    },

    hideDialogListener: function () {
      var myEventDetail = {};// detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      //console.log('openType-------->' + this.data.openType);
        this.triggerEvent('btnclick', myEventDetail, myEventOption);
      this.setData({
        showRuleDialog: false
      })
    },
    goRuleDetail:function(){
      var myEventDetail = {};// detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      //console.log('openType-------->' + this.data.openType);
      this.triggerEvent('btnclickDetail', myEventDetail, myEventOption);
    }
  }
})
