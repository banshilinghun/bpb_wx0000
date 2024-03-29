/**
 * 红点帮助类
 */

const app = getApp();
const Api = require("../../utils/api/ApiConst.js");

/**
 * 改变红点状态
 */
function requestDotStatus() {
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: Api.GET_DOT_URL,
      header: app.globalData.header,
      success: function (res) {
        let dataBean = res.data;
        if (dataBean.code == 1000) {
          if (dataBean.data) {
            showTabBarRedDot();
            resolve(true);
          } else {
            hideTabBarRedDot();
            reject(false);
          }
        }
      }
    });
  });
  return promise;
}

/**
 * 有可领取奖励显示消息红点
 */
function showTabBarRedDot() {
  if (wx.canIUse('showTabBarRedDot')) {
    wx.showTabBarRedDot({
      index: 3,
    })
  }
}

/**
 * 隐藏消息红点
 */
function hideTabBarRedDot() {
  if (wx.canIUse('hideTabBarRedDot')) {
    wx.hideTabBarRedDot({
      index: 3,
    })
  }
}

module.exports = {
  requestDotStatus: requestDotStatus
}