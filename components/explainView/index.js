// components/explainView/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showExplain: {
      type: Boolean,
      value: false
    },
    // 1:预约排队说明 2:车身颜色说明
    state: {
      type: Number,
      value: 1,

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    subscribeList: ["1、若该广告的所有服务网点都已经预约满，系统开放预约排队机制。", "2、参与排队，等待预约。", "3、当有车主取消预约，系统会根据排队顺序依次提示车主确认预约。", "4、车主需在5分钟内确认是否预约；若确认则预约成功。"],
    colorExplainList: ["1、不同的广告对车身颜色有不同的要求。", "2、预约时系统根据车主车辆颜色判断是否可参加。", "3、请提前核实车辆颜色是否符合要求再进行预约操作。", "4、若有其他疑问，请联系客服。"]
  },

  ready: function(){
    
  },

  /**
   * 组件的方法列表
   */
  methods: {

    handleDescClose: function () {
      this.setData({
        showExplain: false
      })
    }
  }
})
