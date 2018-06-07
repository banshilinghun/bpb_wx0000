
let app = getApp();
const util = require('../../utils/util.js');
const ad_server_list = app.globalData.baseUrl + 'app/get/ad_server_list';
const mapId = 'myMap';
const defaultScale = 14;

let windowHeight;
let windowWidth;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mapHeight: 0,
    longitude: '',
    latitude: '',
    scale: defaultScale,
    markers: [],
    controls: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        windowHeight = res.windowHeight;
        windowWidth = res.windowWidth;
        that.setData({
          mapHeight: 0.9 * windowHeight
        })
        that.createControl();
      },
    })
    that.requestLocation();
  },

  /**
   * 中间 control 图标
   */
  createControl: function(){
    var that = this;
    var controlsWidth = 40;
    var controlsHeight = 48;
    that.setData({
      controls: [{
        id: 1,
        iconPath: '../../image/center-location.png',
        position: {
          left: (windowWidth - controlsWidth) / 2,
          top: (that.data.mapHeight) / 2 - controlsHeight * 3 / 4,
          width: controlsWidth,
          height: controlsHeight
        },
        clickable: false
      }]
    })
  },

  //请求地理位置
  requestLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        //第一次加载，如果是分享链接点入，需要跳转到指定marker
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
          })
          that.moveTolocation();
          that.requestAllServerList();
      },
    })
  },

  /**
   * 移动到中心点
   */
  moveTolocation: function () {
    var mapCtx = wx.createMapContext(mapId);
    mapCtx.moveToLocation();
  },

  /**
   * 请求服务网点列表
   */
  requestAllServerList: function(){
    var that = this;
    wx.request({
      url: ad_server_list,
      data: {
        ad_id: 28
      },
      header: app.globalData.header,
      success: res => {
        if(res.data.code == 1000){
          that.createMarker(res.data.data);
        }else{
          that.showModal(res.data.msg);
        }
      },
      fail: res => {
        that.showModal(res.data.msg);
      }
    })
  },

  /**
   * 创建marker点
   */
  createMarker: function(serverList){
    for(let marker of serverList){
      marker.latitude = marker.lat;
      marker.longitude = marker.lng;
      marker.width = 40;
      marker.height = 40;
      marker.iconPath = '../../image/dog-select.png';
      marker.callout = this.createCallout(marker);
      marker.label = this.createLabel(marker);
    }
    console.log(serverList);
    this.setData({
      markers: serverList
    })
  },

  /**
   * marker上的气泡
   */
  createCallout: function(marker){
    let callout = {};
    callout.color = '#ffffff';
    callout.content = marker.name + '\n' + marker.address;
    callout.fontSize = 12;
    callout.borderRadius = 5;
    callout.bgColor = '#ff555c';
    callout.padding = 5;
    callout.textAlign = 'left';
    callout.display = 'BYCLICK';
    return callout;
  },

  createLabel: function (marker) {
    let distance = util.getDistance(this.data.latitude, this.data.longitude, marker.lat, marker.lng);
    console.log('distance----------->' + distance.toFixed(2));
    let label = {};
    label.color = '#ffffff';
    label.content = distance.toFixed(2) + '公里';
    label.fontSize = 10;
    label.borderRadius = 5;
    label.borderWidth = 1;
    label.borderColor = '#ffffff';
    label.bgColor = '#7A7E83';
    label.padding = 5;
    label.textAlign = 'left';
    return label;
  },

  showModal: function(msg){
    wx.showModal({
      content: msg,
      showCancel: false
    })
  },

  /**
   * 点击marker事件
   */
  bindMarkertap: function(e){
    console.log(e);
    for (let marker of this.data.markers){
      if(e.markerId == marker.id){
        this.setData({
          longitude: marker.longitude,
          latitude: marker.latitude
        })
      }
    }
  },

  /**
   * 点击control事件
   */
  controlTap: function(){

  },

  /**
   * 拖动地图事件
   */
  regionChange: function(){

  },

  /**
   * 点击地图事件
   */
  bindMapTap: function(){

  },

  moveToSelfLocation: function(){
    this.setData({
      scale: defaultScale
    })
    this.requestLocation();
  },
})