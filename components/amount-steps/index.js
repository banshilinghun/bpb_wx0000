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

    className: String
  },

  methods: {
    handleTap: function (e) {
      //console.log(e);
      var myEventDetail = { step: e.target.dataset.step, index: e.target.dataset.index };// detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('action', myEventDetail, myEventOption);
    },
    goRecommend:function(e){
      wx.navigateTo({
        url: '../recommend/recommend',
      })
    }
  }
});
