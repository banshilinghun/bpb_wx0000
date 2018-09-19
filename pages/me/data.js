
export const WITHDRAW = 'withdraw';
export const WITHDRAW_RECORD = 'withdrawRecord';
export const EARNINNG_RECORD = 'earningRecord';
export const DAMAGE = 'damage';
export const DROP = 'drop';
export const TRAFFIC = 'traffic';
export const RECOMMEND = 'recommend';
export const COURSE = 'course';
export const AUTH = 'auth';
export const CAR_MODAL = 'carModel';

/**
 * 收益
 */
export let incomeCells = [{
  type: WITHDRAW,
  text: '提现',
  icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-withdraw-icon.png',
  url: '../withdraw/withdraw',
  visible: true
}, {
  type: WITHDRAW_RECORD,
  text: '提现记录',
  icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-withdraw-record.png',
  url: '../withdrawRecord/withdrawRecord',
  visible: true
}, {
  type: EARNINNG_RECORD,
  text: '收益记录',
  icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-income-record.png',
  url: '../earningRecord/earningRecord',
  visible: false
}]

/**
 * 异常处理
 */
export let ExceptionCells = [{
  type: DAMAGE,
  text: '损坏申报',
  icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-damage-icon.png',
  url: '../declare/declare?type=damage',
  visible: true
},{
  type: DROP,
  text: '掉漆申报',
  icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-drop-icon.png',
  url: '../declare/declare?type=drop',
  visible: true
}, {
  type: TRAFFIC,
  text: '违章申报',
  icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-traffic-icon.png',
  url: '../declare/declare?type=violate',
  visible: true
}]

/**
 * 常用工具
 * 
 */
export let actionCells = [{
  type: RECOMMEND,
  text: '推荐有奖',
  icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-recommend-icon.png',
  url: '../recommend/recommend?flag=recommend',
  visible: true
}, {
  type: COURSE,
  text: '新手教程',
  icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-user-course.png',
  url: '../teaching/teaching',
  visible: true
}, {
  type: AUTH,
  text: '注册认证',
  icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-auth-icon.png',
  url: '../auth/auth',
  visible: true
}]

/**
 * 车型补充cell
 */
export let carModelCell = {
  type: 'carModel',
  text: '车型补充',
  icon: 'https://wxapi.benpaobao.com/static/app_img/v2/b-add-car-model.png',
  url: '../brandList/brandList?flag=1',
  visible: true
}
