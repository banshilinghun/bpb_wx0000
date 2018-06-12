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
      value: 316
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ruleList: [
      '备注：在线时长数值向下取整数，例如车主在线6.8小时，以6小时计算。当日收益将于第二日中午12时前计入车主【我的】-【待收收益】内。'],
    tableRuleList: [{ content: '车主当日在线时长', isTitle: true },
    { content: '车主当日广告收入', isTitle: true },
    { content: '2小时以内' },
    { content: '0元' },
    { content: '2小时至5小时' },
    { content: '10元' },
    { content: '6小时至11小时' },
    { content: '10元+3元/小时' },
    { content: '12小时以上' },
    { content: '28元' }]
  },

  ready: function () {
    var that = this;

  },

  /**
   * 组件的方法列表
   */
  methods: {

    _propertyChange: function (newVal, oldVal) {
      var that = this;
      if (newVal) {
        // wx.createSelectorQuery().in(this)
        //   .select('.rule-image')
        //   .boundingClientRect(function (res) {
        //     console.log(res);
        //     that.setData({
        //       imageHeight: res.width * 0.564 + 'px'
        //     })
        //   }).exec();
      }
    },

    hideDialogListener: function () {
      this.setData({
        showRuleDialog: false
      })
    }
  }
})
