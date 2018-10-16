// components/share-detail/index.js
const app = getApp();
const stringUtil = require('../../utils/string/stringUtil');
const ApiConst = require("../../utils/api/ApiConst.js");
var windowWidth;
var windowHeight;
const TEXT_COLOR = '#000000';
const WHITE = '#FFFFFF';
const THEME_COLOR = '#FD500D';
const GRAY_COLOR = '#333333';
const NORMAL_COLOR = '#666666';
const TINT_COLOR = '#747474';
const GOLD_COLOR = '#ffdb12';
const LINE_COLOR = '#DDDDDD';
const DIVIDER_COLOR = '#F7F7F7';

const temp = 0.01;
//图片长宽比
const scale = 1.78;
//头像和宽的比
const avatarWidthScale = 0.085;
const avatarHeightScale = 0.006;
const avatarLeftMarginScale = 0.0533;
//头像白色圆形背景
const avatarStrokeWidth = 2;
//昵称高度比
const nicknameHeightScale = 0.04;
const nicknameWidthScale = 0.165;
//邀请加入
const inviteWidthScale = 0.7;
const inviteHeightScale = 0.04;

//广告图高度
const adScale = 0.315;
const adTopMargin = 0.06;
//广告名称
const adNameHeightScale = 0.42;
const adLineHeightScale = 0.451;
const adLineWidthScale = 0.533;
//收益
const incomeTitleScale = 0.5;
const incomeMoneyWidthScale = 0.28;
const incomeMoneyHeightScale = 0.502;
//时间
const timeTitleHeightScale = 0.54;
const timeDetailWidthScale = 0.28;
//间隔
const dividerHeightTopScale = 0.571;
const dividerHeightBottomScale = 0.661;
const dividerHeight = 0.015;
//已参与
const joinTitleHeightScale = 0.62;
const joinNumberHeightScale = 0.645;
const joinNumberWidthScale = 0.08;
//分割线
const joinLineWidthScale = 0.21;
const joinLineHeightTopScale = 0.60;
const joinLineHeightBottomScale = 0.65;
//参与用户头像
const joinAvatarRadiusScale = 0.08;
const joinAvatarWidthBaseScale = 0.25;
const joinAvatarHeightBaseScale = 0.602;
const joinAvatarDividerScale = 0.013;

//二维码直径
const qrCodeWidthScale = 0.341;
//二维码高度
const qrCodeHeightScale = 0.69;
//奔跑宝文字
const bpbScale = 0.92 + temp * 2;
//识别文字
const decodeScale = 0.95 + temp * 2;
//二维码地址
const QR_CODE_URL = ApiConst.QR_CODE;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
   
    //头像 url (必须)
    avatar: {
      type: String,
      value: null
    },

    //收益 (必须)
    incomeMoney: {
      type: Number,
      value: 0
    },

    //昵称 (必须)
    nickname: {
      type: String,
      value: '',
    },

    //参与人数 (必须)
    joinNumber: {
      type: Number,
      value: 0
    },

    //参与用户头像列表 (必须)
    joinAvatarList: {
      type: Array,
      value: []
    },

    //广告 banner (必须)
    adImageUrl: {
      type: String,
      value: null
    },

    //广告名称
    adName: {
      type: String,
      value: ''
    },

    //广告时间
    adTime: {
      type: String,
      value: ''
    },

    //广告id
    adId: {
      type: String,
      value: ''
    },

    //隐藏显示，会触发事件 (必须)
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
      invite: '邀请您赚钱',
      bpbMini: '奔跑宝小程序',
      clickToMini: '(长按进入赚钱)',
      incomeTitle: '预计收益：',
      timeTitle: '投放时间：',
      joinTitle: '已参与'
    },
    targetSharePath: null,
    QRPath: null,
    avatarPath: null,
    adPath: null,
    joinPathList: [],
    canvasHeight: 0,
    imageWidth: 0,
    imageHeight: 0,
    realShow: false
  },

  ready: function(){
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
      console.log('targetSharePath------------->' + this.data.targetSharePath);
      if (newVal) {
        if (!this.data.targetSharePath) {
          this.shareImage();
        } else {
          this.setData({
            realShow: true
          })
        }
      }
    },
    /**
     * 生成分享图
     */
    shareImage: function () {
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
          scene: 'type=3&adId=' + that.data.adId,
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
        },
        fail: function () {
          that.showErrorModel();
        }
      })
    },

    /**
     * 下载头像
     */
    downloadAvatar: function () {
      let that = this;
      wx.downloadFile({
        url: that.data.avatar,
        success: function (res) {
          that.setData({
            avatarPath: res.tempFilePath
          })
          that.downloadAdImage();
        },
        fail: function () {
          that.showErrorModel();
        }
      })
    },

    /**
     * 下载广告图
     */
    downloadAdImage: function () {
      let that = this;
      let adImg = that.data.adImageUrl;
      if (adImg.indexOf('http:') != -1) {
        adImg = adImg.replace('http:', 'https:');
      }
      that.setData({
        adImageUrl: adImg
      })
      wx.downloadFile({
        url: that.data.adImageUrl,
        success: function (res) {
          that.setData({
            adPath: res.tempFilePath
          })
          if (!that.data.joinAvatarList || that.data.joinAvatarList.length == 0){
            that.drawCanvas();
          }else{
            that.downloadJoinAvatarList();
          }
        },
        fail: function () {
          that.showErrorModel();
        }
      })
    },

    /**
     * 下载加入列表用户头像
     */
    downloadJoinAvatarList: function () {
      let that = this;
      if (that.data.joinAvatarList.length > 7){
        that.setData({
          joinAvatarList: that.data.joinAvatarList.slice(0, 7)
        })
      }
      let count = 0;
      let tempPathList = [];
      for (let avatar of that.data.joinAvatarList) {
        if (avatar.indexOf('http:') != -1){
          avatar = avatar.replace('http:', 'https:');
        }
        wx.downloadFile({
          url: avatar,
          success: function (res) {
            tempPathList.push(res.tempFilePath);
          },
          complete: function () {
            count++;
            if (count == that.data.joinAvatarList.length) {
              that.setData({
                joinPathList: tempPathList
              })
              that.drawCanvas();
            }
          }
        })
      }
    },

    showErrorModel: function (content) {
      this.hideLoading();
      if (!content) {
        content = '网络错误';
      }
      wx.showModal({
        title: '提示',
        content: content,
      })
      this.setData({
        showShareModel: false
      })
    },

    showLoading: function () {
      wx.showLoading({
        title: '奔跑中🚗...',
      })
    },

    hideLoading: function () {
      wx.hideLoading();
    },

    drawCanvas: function () {
      var that = this;
      const ctx = wx.createCanvasContext('myCanvas', this);
      ctx.setFillStyle(WHITE);
      ctx.fillRect(0, 0, windowWidth, windowHeight);

      //绘制广告图片
      ctx.drawImage(that.data.adPath, 0, adTopMargin * windowHeight, windowWidth, windowHeight * adScale);

      //先绘制圆，裁剪成圆形图片
      ctx.save();
      ctx.beginPath();
      //圆的原点x坐标，y坐标，半径，起始弧度，终止弧度
      ctx.arc(windowWidth * avatarLeftMarginScale + avatarWidthScale * windowWidth * 0.5, avatarWidthScale / 2 * windowWidth + avatarHeightScale * windowHeight, (avatarWidthScale / 2) * windowWidth, 0, 2 * Math.PI);
      ctx.setStrokeStyle(WHITE);
      ctx.stroke();
      ctx.clip();
      //绘制头像 图片路径，左上角x坐标，左上角y坐标，宽，高
      var avatarWidth = avatarWidthScale * windowWidth;//头像半径
      ctx.drawImage(that.data.avatarPath, windowWidth * avatarLeftMarginScale, avatarHeightScale * windowHeight, avatarWidth, avatarWidth);
      ctx.restore();

      //-----------------------------------------先绘制不加粗文字
      //绘制 按压提示文字
      ctx.setFillStyle(TINT_COLOR);
      ctx.setFontSize(14);
      ctx.setTextAlign('center');
      ctx.fillText(that.data.detailStr.clickToMini, windowWidth / 2, decodeScale * windowHeight);

      //绘制收益
      ctx.setFillStyle(NORMAL_COLOR);
      ctx.setFontSize(16);
      ctx.setTextAlign('left');
      ctx.fillText(that.data.detailStr.incomeTitle, adTopMargin * windowWidth, incomeTitleScale * windowHeight);

      //绘制时间
      ctx.setFillStyle(NORMAL_COLOR);
      ctx.setFontSize(16);
      ctx.setTextAlign('left');
      ctx.fillText(that.data.detailStr.timeTitle, adTopMargin * windowWidth, timeTitleHeightScale * windowHeight);

      //具体时间
      ctx.setFillStyle(NORMAL_COLOR);
      ctx.setFontSize(16);
      ctx.setTextAlign('left');
      ctx.fillText(that.data.adTime, timeDetailWidthScale * windowWidth, timeTitleHeightScale * windowHeight);

      //已参与绘制
      ctx.setFillStyle(NORMAL_COLOR);
      ctx.setFontSize(16);
      ctx.setTextAlign('left');
      ctx.fillText(that.data.detailStr.joinTitle, adTopMargin * windowWidth, joinTitleHeightScale * windowHeight);
      //已参与人数
      ctx.setFillStyle(NORMAL_COLOR);
      ctx.setFontSize(12);
      ctx.setTextAlign('left');
      ctx.fillText(that.data.joinNumber + '人', joinNumberWidthScale * windowWidth, joinNumberHeightScale * windowHeight);

      //邀请
      ctx.setFillStyle(NORMAL_COLOR);
      ctx.setFontSize(16);
      ctx.setTextAlign('left'); 
      if (wx.canIUse('canvasContext.measureText')){
        let metrics = ctx.measureText(stringUtil.substringStr(that.data.nickname));
        ctx.fillText(that.data.detailStr.invite, nicknameWidthScale * windowWidth + metrics.width + 10, inviteHeightScale * windowHeight);
      }else{
        ctx.fillText(that.data.detailStr.invite, inviteWidthScale * windowWidth, inviteHeightScale * windowHeight);
      }

      //-----------------------------------------绘制加粗文字
      //绘制广告名称
      that.setFontStyle(ctx, 'bold', '16px');
      ctx.setFillStyle(GRAY_COLOR);
      ctx.setFontSize(20);
      ctx.setTextAlign('left');
      ctx.fillText(that.data.adName, adTopMargin * windowWidth, adNameHeightScale * windowHeight);

      //绘制线
      ctx.setStrokeStyle(LINE_COLOR); 
      //ctx.setLineDash([10, 20], 5);
      ctx.setLineWidth(0.5);
      ctx.moveTo(adTopMargin * windowWidth, adLineHeightScale * windowHeight);
      ctx.lineTo(windowWidth * (1 - adTopMargin), adLineHeightScale * windowHeight);
      ctx.stroke();

      //绘制昵称
      ctx.setFillStyle(THEME_COLOR);
      ctx.setFontSize(16);
      ctx.setTextAlign('left');
      ctx.fillText(stringUtil.substringStr(that.data.nickname), nicknameWidthScale * windowWidth, nicknameHeightScale * windowHeight);

      //绘制金额
      ctx.setFillStyle(THEME_COLOR);
      ctx.setFontSize(24);
      ctx.setTextAlign('left');
      ctx.fillText(that.data.incomeMoney == 0 ? '300+' : that.data.incomeMoney + '元', incomeMoneyWidthScale * windowWidth, incomeMoneyHeightScale * windowHeight);

      //绘制间隔
      ctx.setFillStyle(DIVIDER_COLOR);
      ctx.fillRect(0, dividerHeightBottomScale * windowHeight, windowWidth, dividerHeight * windowHeight);
      //绘制线
      ctx.setStrokeStyle(LINE_COLOR);
      //ctx.setLineDash([10, 5], 5);
      ctx.setLineWidth(0.5);
      ctx.moveTo(adTopMargin * windowWidth, dividerHeightTopScale * windowHeight);
      ctx.lineTo(windowWidth * (1 - adTopMargin), dividerHeightTopScale * windowHeight);
      ctx.stroke();

      //绘制二维码
      ctx.drawImage(that.data.QRPath, windowWidth * (0.5 - qrCodeWidthScale / 2), qrCodeHeightScale * windowHeight, qrCodeWidthScale * windowWidth, qrCodeWidthScale * windowWidth);

      //绘制 奔跑宝小程序
      ctx.setFillStyle(GRAY_COLOR);
      ctx.setFontSize(16);
      ctx.setTextAlign('center');
      ctx.fillText(that.data.detailStr.bpbMini, windowWidth / 2, bpbScale * windowHeight);
      console.log('font------------>' + wx.canIUse('canvasContext.font'));

      //参与用户头像列表
      for (let key in that.data.joinPathList) {
        let avatarTempPath = that.data.joinPathList[key];
        console.log('avatarTempPath--------->' + avatarTempPath);
        let x = windowWidth * joinAvatarWidthBaseScale + joinAvatarRadiusScale * windowWidth * 0.5 + joinAvatarRadiusScale * windowWidth * key + joinAvatarDividerScale * windowWidth * key;
        let y = joinAvatarRadiusScale * 0.5 * windowWidth + joinAvatarHeightBaseScale * windowHeight;
        let radius = joinAvatarRadiusScale * 0.5 * windowWidth;

        //先绘制圆，裁剪成圆形图片
        // ctx.save();
        // ctx.beginPath();
        // //圆的原点x坐标，y坐标，半径，起始弧度，终止弧度
        // ctx.arc(x, y, radius, 0, 2 * Math.PI);
        // ctx.setStrokeStyle(WHITE);
        // ctx.stroke();
        // ctx.clip();
        //绘制头像 图片路径，左上角x坐标，左上角y坐标，宽，高
        let imageX = windowWidth * joinAvatarWidthBaseScale + joinAvatarRadiusScale * windowWidth * key + joinAvatarDividerScale * windowWidth * key;
        let imageY = joinAvatarHeightBaseScale * windowHeight;
        ctx.drawImage(avatarTempPath, imageX, imageY, 2 * radius, 2 * radius);
        // ctx.restore();
      }

      console.log('start--------draw----->');

      //绘制到 canvas 上
      ctx.draw(false, function (res) {
        console.log('callback--------------->');
        console.log(res);
        that.saveCanvasImage();
      });
    },

    /**
     * 改变字体样式
     */
    setFontStyle: function (ctx, fontWeight, fontSize) {
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
    requestAlbumScope: function () {
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
                            console.log('用户未同意获取用户信息权限-------->success');
                          }
                        },
                        fail: function () {
                          console.log('用户未同意获取用户信息权限-------->fail');
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

    saveImageToPhotosAlbum: function () {
      var that = this;
      wx.saveImageToPhotosAlbum({
        filePath: that.data.targetSharePath,
        success: function () {
          wx.showModal({
            title: '',
            content: '✌️图片保存成功',
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
        showShareModel: false,
        realShow: false
      })
    },
  }
})
