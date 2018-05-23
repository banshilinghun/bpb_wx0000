// components/share-arawd/index.js

const app = getApp();
const stringUtil = require('../../utils/stringUtil.js');

var windowWidth;
var windowHeight;
const TEXT_COLOR = '#000000';
const WHITE = '#FFFFFF';
const THEME_COLOR = '#FF555C';
const GRAY_COLOR = '#333333';
const NORMAL_COLOR = '#666666';
const TINT_COLOR = '#747474';
const GOLD_COLOR = '#ffdb12';

const temp = 0.01;
//图片长宽比
const scale = 1.78;
//背景图高度
const bgScale = 0.6506;
//头像和宽的比
const avatarWidthScale = 0.213;
const avatarHeightScale = 0.45;
//头像白色圆形背景
const avatarStrokeWidth = 2;
//昵称高度比
const nicknameHeightScale = 0.615;

//邀请加入
const inviteTextScale = 0.187;
const inviteTextHeightScale = 0.27;
//分享内容
const adAwardHeightScale = 0.338;
const adAwardWidthScale = 0.187;
const contentHeightScale = 0.38;
const awardScale = 0.34;
const awardWidthScale = 0.51;
//二维码直径
const qrCodeWidthScale = 0.341;
//二维码高度
const qrCodeHeightScale = 0.69;
//奔跑宝文字
const bpbScale = 0.92 + temp * 2;
//识别文字
const decodeScale = 0.95 + temp * 2;
//二维码地址
const QR_CODE_URL = app.globalData.baseUrl + 'app/get/wx_code';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //头像 url
    avatar: {
      type: String,
      value: null
    },

    //昵称
    nickname: {
      type: String,
      value: null
    },

    //金额
    awardMoney: {
      type: Number,
      value: 0
    },

    //奖励类型 1-新手奖励，2-推荐奖励，3-广告奖励
    awardType: {
      type: Number,
      value: 3
    },

    //隐藏显示，会触发事件
    showShareModel: {
      type: Boolean,
      value: false,
      observer: '_propertyChange'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    detailStr: {
      invite: '你的好友邀请你加入',
      bpbMini: '奔跑宝小程序',
      clickToMini: '(长按进入赚钱)',
      awardContent: '开车不顺手赚广告费是你的损失!'
    },
    awardStr: [
      '我刚领取新手奖励',
      '我刚领取推荐奖励',
      '我刚领取广告奖励'
    ],
    targetSharePath: null,
    QRPath: null,
    avatarPath: null,
    canvasHeight: 0,
    imageWidth: 0,
    imageHeight: 0,
    realShow: false
  },

  ready: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        windowWidth = res.windowWidth;
        windowHeight = res.windowWidth * scale;
        that.setData({
          canvasHeight: windowHeight,
          imageWidth: windowWidth * 0.7,
          imageHeight: windowHeight * 0.7
        })
        console.log('imageHeight---------->' + that.data.imageHeight);
      },
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 控件显示并且没有生成图片时，使用 canvas 生成图片
     */
    _propertyChange: function (newVal, oldVal) {
      console.log('_propertyChange---------->' + newVal);
      if (newVal) {
        if (!this.data.targetSharePath){
          this.shareMoments();
        }else{
          this.setData({
            realShow: true
          })
        }
      }
    },

    /**
     * 生成分享图到朋友圈
     */
    shareMoments: function () {
      var that = this;
      that.showLoading();
      that.getQRCode();
    },

    /**
   * 请求二维码图片
   */
    getQRCode: function () {
      var that = this;
      wx.request({
        url: QR_CODE_URL,
        header: app.globalData.header,
        data: {
          scene: 'type=2',
          page: 'pages/index/index'
        },
        success: function (res) {
          if (res.data.code == 1000) {
            that.downloadQrCode(res.data.data.img_url);
          } else {
            that.showErrorModel(res.data.msg);
          }
        },
        fail: function (res) {
          that.showErrorModel(res.data.msg);
        }
      })
    },

    /**
     * 下载二维码到本地
     */
    downloadQrCode: function (imageUrl) {
      console.log('award------------>' + imageUrl);
      var that = this;
      wx.downloadFile({
        url: imageUrl,
        success: function (res) {
          console.log(res.tempFilePath);
          that.setData({
            QRPath: res.tempFilePath
          })
          that.downloadAvatar();
        },
        fail: function(){
          that.showErrorModel('网络错误');
        }
      })
    },

    showErrorModel: function(content){
      this.hideLoading();
      if(!content){
        content = '网络错误';
      }
      wx.showModal({
        title: '提示',
        content: content,
      })
      //改变状态
      this.setData({
        showShareModel: false
      })
    },

    showLoading: function(){
      wx.showLoading({
        title: '奔跑中🏃...',
      })
    },

    hideLoading: function(){
      wx.hideLoading();
    },

    /**
     * 下载头像
     */
    downloadAvatar: function () {
      console.log('award--avatar-------->' + this.data.avatar)
      var that = this;
      wx.downloadFile({
        url: that.data.avatar,
        success: function (res) {
          that.setData({
            avatarPath: res.tempFilePath
          })
          that.drawImage();
        },
        fail: function(){
          that.showErrorModel('网络错误');
        }
      })
    },

    drawImage: function () {
      var that = this;
      const ctx = wx.createCanvasContext('myCanvas', this);
      var bgPath = '../../image/share-award-bg.png';
      ctx.setFillStyle(WHITE);
      ctx.fillRect(0, 0, windowWidth, windowHeight);

      //绘制背景图片
      ctx.drawImage(bgPath, 0, 0, windowWidth, windowHeight * bgScale);

      //头像背景圆
      ctx.arc(windowWidth / 2, avatarWidthScale / 2 * windowWidth + avatarHeightScale * windowHeight, (avatarWidthScale / 2) * windowWidth + avatarStrokeWidth, 0, 2 * Math.PI);
      ctx.setFillStyle(GOLD_COLOR);
      ctx.fill();

      //先绘制圆，裁剪成圆形图片
      ctx.save();
      ctx.beginPath();
      //圆的原点x坐标，y坐标，半径，起始弧度，终止弧度
      ctx.arc(windowWidth / 2, avatarWidthScale / 2 * windowWidth + avatarHeightScale * windowHeight, (avatarWidthScale / 2) * windowWidth, 0, 2 * Math.PI);
      ctx.setStrokeStyle(GOLD_COLOR);
      ctx.stroke();
      ctx.clip();
      //绘制头像
      //图片路径，左上角x坐标，左上角y坐标，宽，高
      var avatarWidth = avatarWidthScale * windowWidth;//头像半径
      ctx.drawImage(that.data.avatarPath, windowWidth * (0.5 - avatarWidthScale / 2), avatarHeightScale * windowHeight, avatarWidth, avatarWidth);
      ctx.restore();

      //-----------------------------------------先绘制不加粗文字
      //绘制 按压提示文字
      ctx.setFillStyle(TINT_COLOR);
      ctx.setFontSize(14);
      ctx.setTextAlign('center');
      ctx.fillText(that.data.detailStr.clickToMini, windowWidth / 2, decodeScale * windowHeight);

      //-----------------------------------------绘制加粗文字
      //绘制邀请加入
      that.setFontStyle(ctx, 'bold');
      ctx.setFillStyle(GRAY_COLOR);
      ctx.setFontSize(16);
      ctx.setTextAlign('left');
      ctx.fillText(that.data.detailStr.invite, inviteTextScale * windowWidth, inviteTextHeightScale * windowHeight);

      //绘制昵称
      ctx.setFillStyle(WHITE);
      ctx.setFontSize(20);
      ctx.setTextAlign('center');
      ctx.fillText(stringUtil.substringStr(that.data.nickname), 0.5 * windowWidth, nicknameHeightScale * windowHeight);

      //绘制广告奖励
      ctx.setFillStyle(NORMAL_COLOR);
      ctx.setFontSize(14);
      ctx.setTextAlign('left');
      ctx.fillText(that.data.awardStr[that.data.awardType - 1], adAwardWidthScale * windowWidth, adAwardHeightScale * windowHeight);

      //绘制金额
      ctx.setFillStyle(THEME_COLOR);
      ctx.setFontSize(36);
      ctx.setTextAlign('left');
      ctx.fillText(that.data.awardMoney + '元', awardWidthScale * windowWidth, awardScale * windowHeight);

      //绘制描述 
      ctx.setFillStyle(NORMAL_COLOR);
      ctx.setFontSize(16);
      ctx.setTextAlign('left');
      ctx.fillText(that.data.detailStr.awardContent, adAwardWidthScale * windowWidth, contentHeightScale * windowHeight);

      //绘制二维码
      ctx.drawImage(that.data.QRPath, windowWidth * (0.5 - qrCodeWidthScale / 2), qrCodeHeightScale * windowHeight, qrCodeWidthScale * windowWidth, qrCodeWidthScale * windowWidth);

      //绘制 奔跑宝小程序
      ctx.setFillStyle(GRAY_COLOR);
      ctx.setFontSize(16);
      ctx.setTextAlign('center');
      ctx.fillText(that.data.detailStr.bpbMini, windowWidth / 2, bpbScale * windowHeight);
      console.log('font------------>' + wx.canIUse('canvasContext.font'));

      //绘制到 canvas 上
      ctx.draw(false, function () {
        console.log('callback--------------->');
        that.saveCanvasImage();
      });
    },

    /**
     * 改变字体样式
     */
    setFontStyle: function (ctx, fontWeight) {
      if (wx.canIUse('canvasContext.font')) {
        ctx.font = 'normal ' + fontWeight + ' ' + '14px' + ' sans-serif';
      }
    },

    //转化为图片
    saveCanvasImage: function () {
      var that = this;
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function (res) {
          console.log(res.tempFilePath);
          that.setData({
            targetSharePath: res.tempFilePath,
            realShow: true,
          })
          //设置事件回调
          var myEventDetail = {};// detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          that.triggerEvent('hideDialog', myEventDetail, myEventOption);
        },
        complete: function () {
          that.hideLoading();
        }
      }, this)
    },

    /**
     * 保存到相册
     */
    saveImageTap: function () {
      var that = this; 
      that.requestAlbumScope();
    },

    /**
     * 检测相册权限
     */
    requestAlbumScope: function(){
      var that = this;
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.writePhotosAlbum']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            that.saveImageToPhotosAlbum();
          } else {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success(res) {
                that.saveImageToPhotosAlbum();
              },
              fail() {
                wx.showModal({
                  title: '提示',
                  content: '你需要授权才能保存图片到相册',
                  success: function (res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success: function (res) {
                          if (res.authSetting['scope.writePhotosAlbum']) {
                            that.saveImageToPhotosAlbum();
                          } else {
                            consoleUtil.log('用户未同意获取用户信息权限-------->success');
                          }
                        },
                        fail: function(){
                          consoleUtil.log('用户未同意获取用户信息权限-------->fail');
                        }
                      })
                    }
                  }
                })
              }
            })
          }
        }
      })
    },

    saveImageToPhotosAlbum: function(){
      var that = this;
      wx.saveImageToPhotosAlbum({
        filePath: that.data.targetSharePath,
        success: function () {
          wx.showModal({
            title: '提示',
            content: '✌️图片保存成功，\n快去分享到朋友圈吧',
            showCancel: false
          })
          that.hideDialog();
        }
      })
    },

    closeModel: function () {
      this.hideDialog();
    },

    hideDialog: function () {
      this.setData({
        realShow: false,
        showShareModel: false
      })
    },
  }
})
