/** 分享工具类 */

const app = getApp();

/**
 * 普通拉新分享title
 */
function getShareNormalTitle() {
  return '[' + app.globalData.userInfo.nickName + '@我]' + ' 贴车身广告，有钱一起赚';
}

/**
 * 领取奖励分享title
 */
function getShareAwardTitle(award, awardType) {
  let awardTypeStr;
  if (awardType == 2) {
    awardTypeStr = '推荐奖励';
  } else if (awardType == 3) {
    awardTypeStr = '广告奖励';
  } else {
    awardTypeStr = '新手专享奖励';
  }
  return '[' + app.globalData.userInfo.nickName + '@我]' + ' 我已领取' + awardTypeStr + award + '元，你还不来';
}

/**
 * 广告分享title
 */
function getShareAdTitle() {
  return '[' + app.globalData.userInfo.nickName + '@我]' + ' 开车还能赚广告费，不来是你的损失！';
}

module.exports = {
  getShareNormalTitle: getShareNormalTitle,
  getShareAwardTitle: getShareAwardTitle,
  getShareAdTitle: getShareAdTitle
}