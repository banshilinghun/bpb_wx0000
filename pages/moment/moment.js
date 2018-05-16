// pages/moment/moment.js
const app = getApp();

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



Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailStr: {
      invite: '你的好友邀请你加入',
      bpbMini: '奔跑宝小程序',
      clickToMini: '(长按进入赚钱)',
      awardTitle: '我刚领取广告奖励',
      awardContent: '开车不顺手赚广告费是你的损失!'
    },
    targetSharePath: null,
    avatar: 'https://wx.qlogo.cn/mmopen/vi_32/Is9WGKAc9WE8lVyUNBWeGaEHgLg889UPQ2xxsicdu6y01ArKXyyxWEdT68iaEG7nMAib4lPKUVX2HW5icRp9PfhNuw/132',
    QRPath: null,
    avatarPath: null,
    canvasHeight: 0,
    imageWidth: 0,
    imageHeight: 0,
    showShareModel: false,
    awardMoney: '350元',
    nickname: '狗腿🌲狗腿'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        windowWidth = res.windowWidth;
        windowHeight = res.windowWidth * scale;
        that.setData({
          canvasHeight: windowHeight,
          imageWidth: windowWidth * 0.7,
          imageHeight: windowHeight *  0.7
        })
        console.log('imageHeight---------->' + that.data.imageHeight);
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.shareMoments();
  },

  /**
   * 生成分享图到朋友圈
   */
  shareMoments: function () {
    var that = this;
    //没有分享图先用 canvas 生成，否则直接预览
    if (that.data.targetSharePath) {
      that.setData({
        showShareModel: true,        
      })
    } else {
      wx.showLoading({
        title: '奔跑中🏃...'
      })
      that.getQRCode();
    }
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
        scene: 'id=1',
        page: 'pages/index/index'
      },
      success: function (res) {
        console.log(res);
        that.downloadQrCode(res.data.data.img_url);
      },
      fail: function (res) {
        that.showModel(res.data.msg);
      }
    })
  },

  /**
   * 下载二维码到本地
   */
  downloadQrCode: function (imageUrl) {
    console.log(imageUrl);
    var that = this;
    wx.downloadFile({
      url: imageUrl,
      success: function (res) {
        console.log(res.tempFilePath);
        that.setData({
          QRPath: res.tempFilePath
        })
        that.downloadAvatar();
      }
    })
  },

  /**
   * 下载头像
   */
  downloadAvatar: function () {
    var that = this;
    wx.downloadFile({
      url: that.data.avatar,
      success: function (res) {
        that.setData({
          avatarPath: res.tempFilePath
        })
        that.drawImage();
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
    that.setFontStyle(ctx, 'bold', '16px');
    ctx.setFillStyle(GRAY_COLOR);
    ctx.setFontSize(16);
    ctx.setTextAlign('left');
    ctx.fillText(that.data.detailStr.invite, inviteTextScale * windowWidth, inviteTextHeightScale * windowHeight);

    //绘制昵称
    ctx.setFillStyle(WHITE);
    ctx.setFontSize(20);
    ctx.setTextAlign('center');
    ctx.fillText(that.data.nickname, 0.5 * windowWidth, nicknameHeightScale * windowHeight);

    //绘制广告奖励
    ctx.setFillStyle(NORMAL_COLOR);
    ctx.setFontSize(14);
    ctx.setTextAlign('left');
    ctx.fillText(that.data.detailStr.awardTitle, adAwardWidthScale * windowWidth, adAwardHeightScale * windowHeight);

    //绘制金额
    ctx.setFillStyle(THEME_COLOR);
    ctx.setFontSize(36);
    ctx.setTextAlign('left');
    ctx.fillText(that.data.awardMoney, awardWidthScale * windowWidth, awardScale * windowHeight);

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
  setFontStyle: function(ctx, fontWeight, fontSize){
    if (wx.canIUse('canvasContext.font')) {
      ctx.font = 'normal ' + fontWeight + ' ' + fontSize + ' sans-serif';
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
          showShareModel: true,          
        })
      },
      complete: function(){
        wx.hideLoading();
      }
    }, this)
  },

  /**
   * 保存到相册
   */
  saveImageTap: function(){
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.targetSharePath,
      success: function(){
        wx.showModal({
          title: '提示',
          content: '✌️图片保存成功，\n快去分享到朋友圈吧',
          showCancel: false
        })
        that.hideDialog();
      }
    })
  },

  closeModel: function(){
    this.hideDialog();
  },

  hideDialog: function(){
    this.setData({
      showShareModel: false
    })
  },
})