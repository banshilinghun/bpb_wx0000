
// 损坏申报、掉漆申报、违章申报

const titleMap = new Map();
const typeArr = ['damage', 'drop', 'violate'];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: typeArr[0],
    declareInfo: {},
    visiblePicker: false,
    adList: ['奈雪的茶', "京基kkmail"],
    index: 0,
    startDate: '2018-01-01',
    currentDate: '',
    date: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      type: options.type
    })
    that.initData();
    that.getDate();
  },

  initData(){
    let that = this;
    titleMap.set(typeArr[0], '损坏申报');
    titleMap.set(typeArr[1], '掉漆申报');
    titleMap.set(typeArr[2], '违章申报');
    switch(that.data.type){
      case typeArr[0]:
        that.setData({
          declareInfo: {
            adName: '广告名称',
            date: '损坏日期',
            evidenceImage: '拍摄图片',
            evidenceTip: '拍摄车辆广告损坏位置图片',
            reason: '损坏原因',
            reasonTip: '简短语言描述广告损坏原因'
          }
        })
        break;
      case typeArr[1]:
        that.setData({
          declareInfo: {
            adName: '广告名称',
            date: '掉漆日期',
            evidenceImage: '拍摄图片',
            evidenceTip: '拍摄车辆掉漆位置图片',
            reason: '掉漆原因',
            reasonTip: '简短语言描述车辆掉漆原因'
          }
        })
        break;
      default:
        that.setData({
          declareInfo: {
            adName: '广告名称',
            date: '违章日期',
            address: '违章地点',
            price: '违章成本',
            evidenceImage: '违章凭证',
            evidenceTip: '拍摄车辆违章通知单',
            reason: '违章原因',
            reasonTip: '简短语言描述车辆违章原因'
          }
        })
        break;
    }
    that.setNavigationBarTitle();
  },

  setNavigationBarTitle(){
    let that = this;
    wx.setNavigationBarTitle({
      title: titleMap.get(that.data.type)
    })
  },

  getDate(){
    // 获取当前日期
    let date = new Date();
    // 获取当前月份
    let nowMonth = date.getMonth() + 1;
    // 获取当前是几号
    let strDate = date.getDate();
    // 添加分隔符“-”
    let seperator = "-";
    // 对月份进行处理，1-9月在前面添加一个“0”
    if (nowMonth >= 1 && nowMonth <= 9) {
      nowMonth = "0" + nowMonth;
    }
    // 对月份进行处理，1-9号在前面添加一个“0”
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
    let nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;
    this.setData({
      currentDate: nowDate,
      date: nowDate
    })
  },

  pickerChange(event){
    console.log(event);
    const index = event.detail.value;
    this.setData({
      index
    })
  },

  bindDateChange(event){
    console.log(event);
    this.setData({
      date: event.detail.value
    })
  }

})