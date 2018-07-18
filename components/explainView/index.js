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
    },
    title: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    subscribeList: ["1、若该广告的所有服务网点都已经预约满，系统开放预约排队机制。", "2、参与排队，等待预约。", "3、当有车主取消预约，系统会根据排队顺序依次提示车主确认预约。", "4、车主需在5分钟内确认是否预约；若确认则预约成功。"],
    colorExplainList: ["1、代表广告对车辆的特定要求，例如（深圳，白色/黑色，双证，家庭轿车；代表该广告需要深圳车牌，白色和黑色车辆，有双证的家庭轿车）。", "2、请提前核实车辆颜色是否符合要求再进行预约操作。", "3、若有其他疑问，请联系客服！"]
  },

  ready: function(){
    
  },

  /**
   * 组件的方法列表
   */
  methods: {

//state === 1? '预约排队说明' : '车身颜色说明'
    handleDescClose: function () {
      wx.navigateBack({
        delta: 1,
      });
    }
  }
})
