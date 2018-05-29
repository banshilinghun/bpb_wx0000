// components/attendGroup-view/index.js
var timer = null;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //数据
    teamInfo: {
      type: Array,
      value: []
    },

    //是否显示查看更多
    showSeeMore: {
      type: Boolean,
      value: false
    },

    //开启或者关闭计时
    openInterval: {
      type: Boolean,
      value: false,
      observer: '_propertyChange'
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

    _propertyChange: function (newVal, oldVal){
      if (newVal){
        this.countDownTime();
      }else{
        clearInterval(timer);
      }
    },

    countDownTime: function(){
      let that = this;
      //获取当前时间
      let timestamp = Date.parse(new Date());
      //剩余秒数
      let dataList = that.data.teamInfo;
      for (let dataBean of dataList) {
        dataBean.diffTime = dataBean.time - timestamp / 1000;
      }
      that.setData({
        teamInfo: dataList
      })
      //计时器
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        let tempList = that.data.teamInfo;
        for (let dataBean of tempList) {
          if (dataBean.diffTime > 0) {
            dataBean.diffTime = dataBean.diffTime - 1;
            dataBean.remainTime = that.formatTime(dataBean.diffTime);
          } else {
            dataBean.remainTime = '时间已截止';
          }
        }
        that.setData({
          teamInfo: tempList
        })
      }, 1000);
    },

    formatTime: function (time) {
      //小时数
      let hour = Math.floor(time / 3600);
      //分钟数
      let minute = Math.floor((time - hour * 3600) / 60);
      //秒数
      let second = time - hour * 3600 - minute * 60;
      //设置数据
      return this.fill_zero_prefix(hour) + ":" + this.fill_zero_prefix(minute) + ":" + this.fill_zero_prefix(second);
    },

    // 位数不足补零
    fill_zero_prefix: function (num) {
      return num < 10 ? "0" + num : num
    },

    /**
     * 显示更多
     */
    showTeamWorkList: function(e){
      wx.navigateTo({
        url: '../../pages/teamworkList/index',
      })
    },

    /**
     * 去参团
     */
    goJoinTeamwork: function(e){
      var myEventDetail = {};// detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('goJoin', myEventDetail, myEventOption);
    }
  }
})
