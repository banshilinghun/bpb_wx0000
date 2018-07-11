
const ApiConst = require("../../utils/api/ApiConst.js");
const ApiManager = require('../../utils/api/ApiManager.js');
var app = getApp()

Page({
  data: {
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    // tHeight: 0,
    // bHeight: 0,
    carList: [],
    isShowLetter: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    flag: 1, //1：表示补充车型，2：表示注册选择车型
  },

  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var sysInfo = wx.getSystemInfoSync();
    var winHeight = sysInfo.windowHeight;
    this.setData({
      winHeight: winHeight
    })
    this.setData({
      flag: options.flag || 1
    })
    this.requestAllBrands();
  },

  //请求所有车型信息
  requestAllBrands: function(){
    var that = this;
    let requestData = {
      url: ApiConst.getAllBrands(),
      data: {},
      header: app.globalData.header,
      success: res => {
        console.log(res);
        let letterList = that.getLetterList(res);
        let carList = that.divideGroup(res);
        that.setData({
          carList: carList,
          searchLetter: letterList,
        })
      },
      complete: res => {

      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  //首字母列表
  getLetterList: function (targetList) {
    let letterList = this.sortLetter(targetList);
    let tempLetter = [];
    for (let i = 0; i < letterList.length; i++) {
      let temp = {};
      temp.name = letterList[i];
      tempLetter.push(temp)
    }
    return tempLetter;
  },

  //分组
  divideGroup: function(targetList){
    let letterList = this.sortLetter(targetList);
    let tempList = [];
    for (let i = 0; i < letterList.length; i++) {
      let tempObj = {};
      tempObj.carInfo = [];
      tempObj.initial = letterList[i];
      for(let j = 0; j < targetList.length; j++){
        if (letterList[i] == targetList[j].initial){
          targetList[j].brandId = targetList[j].id;
          tempObj.carInfo.push(targetList[j]);
        }
      }
      tempList.push(tempObj);
    }
    return tempList;
  },

  /**
   * 首字母数组
   */
  sortLetter: function(targetList){
    let letterList = [];
    for (let i = 0; i < targetList.length; i++) {
      let dataBean = targetList[i];
      if (letterList.indexOf(dataBean.initial) === -1) {
        letterList.push(dataBean.initial);
      }
    }
    //排序
    letterList.sort();
    console.log(letterList);
    this.setData({
      searchLetter: letterList
    })
    return letterList;
  },

  clickLetter: function (e) {
    console.log(e.currentTarget.dataset.letter)
    var showLetter = e.currentTarget.dataset.letter;
    this.setData({
      showLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 1000)
  },

  //选择车型
  bindCarBrand: function (e) {
    var that = this;
    console.log(e);
    //厂商id， 厂商logo，厂商名, flag标识
    wx.navigateTo({
      url: '../brandDetail/brandDetail?brand_id=' + e.currentTarget.dataset.brand.brandId + '&brand_logo=' + e.currentTarget.dataset.brand.logo + '&brand_name=' + e.currentTarget.dataset.brand.name + '&flag=' + that.data.flag
    })
  },

  //点击热门城市回到顶部
  hotCity: function () {
    this.setData({
      scrollTop: 0,
    })
  }
})