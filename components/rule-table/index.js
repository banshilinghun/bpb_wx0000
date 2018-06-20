
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

  },

  /**
   * 组件的初始数据
   */
  data: {
    tableRuleList: [{ content: '车主当日在线时长', isTitle: true },
    { content: '车主当日广告收入', isTitle: true },
    { content: '小于2小时' },
    { content: '0元' },
    { content: '大于等于2小时小于6小时' },
    { content: '10元' },
    { content: '大于等于6小时小于12小时' },
    { content: '10元+每增加1小时多得3元' },
    { content: '大于等于12小时' },
    { content: '28元' }]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
