
const { $Toast } = require('../../components/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    visibleSubscribe: false,
    hasSeverSelect: false, 
    selectServerIndex: -1, //默认下标-1，表示未选择服务网点
    hasDateSelect: false,
    selectDateIndex: -1, //默认下标-1，表示未选择日期
    hasTimeSelect: false,
    selectTimeIndex: -1, //默认下标-1，表示未选择时间段
    totalCount: 0, //剩余总数
    remainCount: 0, //选择条件过滤后的剩余数
    selectStatusStr: '',
    carColor: '黑色',
    serverList: [{
        logo: '',
        name: '奔跑宝',
        distance: '12.78km',
        address: '深圳市南山区腾讯大厦',
        remain: 8,
        colors: ['白色', '红色']
      },
      {
        logo: '',
        name: '奔跑宝',
        distance: '12.78km',
        address: '深圳市南山区腾讯大厦',
        remain: 3,
        colors: ['白色', '黑色']
      },
      {
        logo: '',
        name: '奔跑宝',
        distance: '12.78km',
        address: '深圳市南山区腾讯大厦',
        remain: 4,
        colors: ['蓝色', '红色']
      },
      {
        logo: '',
        name: '奔跑宝',
        distance: '12.78km',
        address: '深圳市南山区腾讯大厦',
        remain: 0,
        colors: ['白色', '橘色']
      }
    ],
    colorList: [],
    dateList: [{ date: '2018-7-18', enable: true }, { date: '2018-7-19', enable: false }, { date: '2018-7-20', enable: true}, { date: '2018-7-21', enable: false}],
    timeList: [{ time: '8:00-9:00', enable: false }, { time: '9:00-10:00', enable: true }, { time: '10:00-11:00', enable: true }, { time: '11:00-12:00', enable: true }],
    visibleAnnual: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.mergeColor();
    that.changeRemainCount();
    that.initSelectStatus();
  },

  /**
   * 颜色去重
   */
  mergeColor() {
    let that = this;
    let colorList = [];
    that.data.serverList.forEach(element => {
      element.colors.forEach(color => {
        //不存在数组则添加
        console.log(color);
        console.log(colorList.indexOf(color) === -1);
        if (colorList.indexOf(color) === -1) {
          colorList.push(color);
        } else {
          //do nothing
        }
      })
    });
    let colorArray = [];
    let containColor = false;
    colorList.forEach(color => {
      let colorObj = {};
      colorObj.color = color;
      if (color === that.data.carColor){
        containColor = true;
      }
      colorObj.select = (color === that.data.carColor)
      colorArray.push(colorObj);
    })
    that.setData({
      colorList: colorArray,
      carColorOk: containColor
    })
  },

  /**
   * 预约剩余数
   */
  changeRemainCount(){
    let that = this;
    let count = 0;
    let serverList = that.data.serverList;
    serverList.forEach(element => {
      count += element.remain;
    });
    that.setData({
      totalCount: count,
      remainCount: count
    })
  },

  handleSubscribe() {
    this.setData({
      visibleSubscribe: true
    })
  },

  handleSubscribeClose() {
    this.setData({
      visibleSubscribe: false
    })
  },

  /**
   * 选择服务网点
   */
  handleServerClick(event) {
    console.log(event);
    let that = this;
    let index = event.currentTarget.dataset.index;
    let hasSelect = that.data.hasSeverSelect;
    if(!hasSelect){
      that.setData({
        selectServerIndex: index,
        hasSeverSelect: true
      })
      let serverList = that.data.serverList;
      that.setRemainCount(serverList[index].remain);
    }else{
      that.setData({
        selectServerIndex: -1,
        hasSeverSelect: false,
        selectDateIndex: -1,
        hasDateSelect: false,
        selectTimeIndex: -1,
        hasTimeSelect: false
      })
      that.setRemainCount(that.data.totalCount);
    }
    that.initSelectStatus();
  },

  /** 更新剩余数量 */
  setRemainCount(count){
    this.setData({
      remainCount: count
    });
  },

  /** 选择日期 */
  handleDateClick(event){
    console.log(event);
    let that = this;
    let index = event.currentTarget.dataset.index;
    let hasSelect = that.data.hasDateSelect;
    if (!hasSelect) {
      that.setData({
        selectDateIndex: index,
        hasDateSelect: true
      })
    } else {
      that.setData({
        selectDateIndex: -1,
        hasDateSelect: false,
        selectTimeIndex: -1,
        hasTimeSelect: false
      })
    }
    that.initSelectStatus();
  },

  /** 选择时间段 */
  handleTimeClick(event){
    console.log(event);
    let that = this;
    let index = event.currentTarget.dataset.index;
    let hasSelect = that.data.hasTimeSelect;
    if (!hasSelect) {
      that.setData({
        selectTimeIndex: index,
        hasTimeSelect: true
      })
    } else {
      that.setData({
        selectTimeIndex: -1,
        hasTimeSelect: false
      })
    }
    that.initSelectStatus();
  },

  initSelectStatus(){
    let that =this;
    let selectServerIndex = that.data.selectServerIndex;
    let selectDateIndex = that.data.selectDateIndex;
    let selectTimeIndex = that.data.selectTimeIndex;
    let serverList = that.data.serverList;
    let dateList = that.data.dateList;
    let timeList = that.data.timeList;
    if (selectServerIndex !== -1 && selectDateIndex !== -1 && selectTimeIndex !== -1) { //全选
      that.setData({
        selectStatusStr: '已选: ' + "\"" + serverList[selectServerIndex].name + "\" " + "\"" + dateList[selectDateIndex].date + "\" " + "\"" + timeList[selectTimeIndex].time + "\" " + "\"" + that.data.carColor + "\""
      })
    } else { //有选项未选择
      that.setData({
        selectStatusStr: '请选择 ' + (selectServerIndex !== -1 ? "" : "服务网点 ") + (selectDateIndex !== -1 ? "" : "预约日期 ") + (selectTimeIndex !== -1 ? "" : "预约时间段")
      })
    }
  },

  /** 确认预约 */
  handleConfirmSubscribe(){
    let that = this;
    //车身颜色不满足
    if(!that.data.carColorOk){
      return;
    }
    let selectServerIndex = that.data.selectServerIndex;
    let selectDateIndex = that.data.selectDateIndex;
    let selectTimeIndex = that.data.selectTimeIndex;
    if (selectServerIndex === -1){
      $Toast({
        content: '请选择 服务网点',
        type: 'warning'
      });
      return;
    }
    if (selectDateIndex === -1) {
      $Toast({
        content: '请选择 预约日期',
        type: 'warning'
      });
      return;
    }
    if (selectTimeIndex === -1) {
      $Toast({
        content: '请选择 预约时间段',
        type: 'warning'
      });
      return;
    }
  }

})