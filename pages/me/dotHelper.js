
/**
 * 红点帮助类
 */

const app = getApp();
const Api = require("../../utils/Api.js");

/**
 * 改变红点状态
 */
function requestDotStatus() {
  wx.request({
    url: Api.dotUrl,
    header: app.globalData.header,
    success: function (res) {
      let dataBean = res.data;
      if (dataBean.code == 1000) {
        if (dataBean.data) {
          showTabBarRedDot();
        } else {
          hideTabBarRedDot();
        }
      }
    }
  })
}

/**
 * 有可领取奖励显示消息红点
 */
function showTabBarRedDot() {
  if (wx.canIUse('showTabBarRedDot')) {
    wx.showTabBarRedDot({
      index: 1,
    })
  }
}

/**
 * 隐藏消息红点
 */
function hideTabBarRedDot() {
  if (wx.canIUse('hideTabBarRedDot')) {
    wx.hideTabBarRedDot({
      index: 1,
    })
  }
}

module.exports = {
  requestDotStatus: requestDotStatus
}