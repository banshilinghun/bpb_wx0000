
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * true: 字体24rpx(用于弹框), false: 字体28rpx
     */
    textSmall: {
      type: Boolean,
      value: true
    },

    /**
     * 表格高度，默认为300rpx（弹框中）
     */
    tableHeight: {
      type: Number,
      value: 300
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
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

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
