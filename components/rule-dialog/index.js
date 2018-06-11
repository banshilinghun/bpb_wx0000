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
    ruleList: ['1．当日在线时长小于2小时，广告收益为0元;',
      '2．当日在线时长2-5小时，广告保底收益为10元; ',
      '3．当日在线时长6-11小时，在保底收益10元基础上，每小时增加3元;',
      '4．当日在线时长大于或等于12小时，获得每日28 元收益；',
      '5．在线时长数值向下取整数，例如车主在线6.8小时，以6小时计算；',
      '6．当日收益将于第二日中午12时前计入车主【我的】-【待收收益】内，车主可关注【奔跑宝】微信公众号及时查看昨日收益。'],
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
