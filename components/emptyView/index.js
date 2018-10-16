// components/emptyView/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //上边距
    topMargin: {
      type: Number,
      value: 50
    },
    //第一行文字
    title: {
      type: String,
      value: ''
    },
    //第二行文字
    content: {
      type: String,
      value: ''
    },
    //图片src
    emptySrc: {
      type: String,
      value: '../../image/empty-list-icon.png'
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

  }
})
