/** 分享工具类 */

const app = getApp();
const stringUtil = require('stringUtil.js');

/**
 * 普通拉新分享title
 */
function getShareNormalTitle() {
  return '[' + stringUtil.substringName(app.globalData.userInfo.nickName) + '@我]' + ' 贴车身广告，有钱一起赚';
}

/**
 * 领取奖励分享title
 */
function getShareAwardTitle(award, awardType) {
  let awardTypeStr;
  if (awardTypeStr == 1){
    awardTypeStr = '新手红包';
  } else if (awardType == 2) {
    awardTypeStr = '推荐奖励';
  } else if (awardType == 3) {
    awardTypeStr = '广告收入';
  } else{
    awardTypeStr = '奖励';
  }
  return '[' + stringUtil.substringName(app.globalData.userInfo.nickName) + '@我]' + ' 我刚领取' + awardTypeStr + award + '元，你还不来?';
}

/**
 * 广告分享title
 */
function getShareAdTitle() {
  return '[' + stringUtil.substringName(app.globalData.userInfo.nickName) + '@我]' + ' 开车还能赚广告费，不来是你的损失！';
}

module.exports = {
  getShareNormalTitle: getShareNormalTitle,
  getShareAwardTitle: getShareAwardTitle,
  getShareAdTitle: getShareAdTitle
}