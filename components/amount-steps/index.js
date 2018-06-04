Component({
  properties: {
    type: {
      type: String,
      value: 'horizon'
    },

    hasDesc: {
      type: Boolean,
      value: false
    },

    steps: { // 必须
      type: Array,
      value: []
    },

    openType: {
      type: String,
      value: ''
    },

    className: String
  },

  methods: {
    handleTap: function (e) {
      console.log(e);
      if(this.data.openType){
        return;
      }
      var myEventDetail = { step: e.target.dataset.step, index: e.target.dataset.index };// detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('action', myEventDetail, myEventOption);
    },
    goRecommend:function(e){
      wx.navigateTo({
        url: '../recommend/recommend',
      })
    },
    goTip:function(e){
      console.log(e.currentTarget.dataset.step)
      var myEventDetail = { step: e.currentTarget.dataset.step };// detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('tip', myEventDetail, myEventOption);
    }
  }
});
