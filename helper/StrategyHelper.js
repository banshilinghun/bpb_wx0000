//策略模式

const TimeUtil = require('../utils/time/timeUtil');

// 登记 检测
export const REGIST = 'regist';
export const CHECK = 'check';

//任务状态
export const SUBSCRIBED = 'subscribed';
export const SUBSCRIBE_OVER_TIME = 'subscribeOvertime';
export const SIGNED_WAIT_INSTALL = 'signedWaitInstall';
export const INSTALLING = 'installing';
export const REWORK = 'rework';
export const INSTALLED = 'installed';
export const INSTALL_AUDIT = 'installAudit';
export const INSTALL_FAIL = 'installFail';
export const RUNNING_FIXED = 'runingFixed';
export const RUNNING_BY_TIME = 'runingByTime';
export const NEED_CHECK = 'needCheck';
export const CHECK_AUDIT = 'checkAudit';
export const CHECK_FAIL = 'checkfail';


//subscribed: 已预约未签到 | subscribeOvertime 预约中，已超时 | signedWaitInstall: 已签到未安装 | installing: 安装中 | installed: 安装完成待上画 | rework: 返工预约 
//installAudit: 安装审核 | installFail: 安装审核失败 | runingFixed: 投放中固定收益  | runingByTime: 投放中按时计费 | needCheck: 待检测 | checkAudit: 检测审核中 | checkfail: 审核失败
let taskStrategy = {
  //预约中
  1: () => SUBSCRIBED,

  //已超时未签到
  2: () => SUBSCRIBE_OVER_TIME,

  //已签到，未安装
  3: () => SIGNED_WAIT_INSTALL,

  //已签到，安装中
  4: () => INSTALLING,

  //审核失败，需要返工
  5: () => REWORK,

  //安装完成待上画
  6: () => INSTALLED,

  //已提交登记信息, 但有审核中、审核失败（不需要返工）状态
  7: function(runningTask){
    if(!runningTask.registInfo){
      console.error('登记信息 field "registInfo" to null or undefined is invalid')
    }
    if(Number(runningTask.registInfo.status) === 1){
      return INSTALL_AUDIT;
    } else if(Number(runningTask.registInfo.status) == 2) {
      return INSTALL_FAIL;
    }
  },

  //投放中，固定收益
  8: () => RUNNING_FIXED,

  //投放中，按时计费
  9: () => RUNNING_BY_TIME,
  
  //广告处于检测中
  10: function(runningTask){
    //未提交审核
    if(Number(runningTask.detectionInfo.status) === 0){
      return NEED_CHECK;
    } else if(Number(runningTask.detectionInfo.status) === 1) {
      return CHECK_AUDIT;
    } else if(Number(runningTask.detectionInfo.status) === 2) {
      return CHECK_FAIL;
    }
  }
}

/**
 * 获取当前状态
 *
 * @param {*} runningTask 运行中广告信息
 * @returns 状态
 */
export function getCurrentStatus(runningTask){
  if(!runningTask){
    console.error("runningTask to null or undefind is invalid");
    return;
  }
  return taskStrategy[runningTask.process](runningTask);
}

/**
 *  判断当前可见视图
 * 
 * @param {*} status 当前状态
 */
export function getTaskActionDisplay(runningTask){
  let status = getCurrentStatus(runningTask);
  let action = {};
  action.subscribed = status === SUBSCRIBED;
  action.subscribeOvertime = status === SUBSCRIBE_OVER_TIME;
  action.signedWaitInstall = status === SIGNED_WAIT_INSTALL;
  action.installing = status === INSTALLING;
  action.rework = status === REWORK;
  action.installed = status === INSTALLED;
  action.installAudit = status === INSTALL_AUDIT;
  action.installFail = status === INSTALL_FAIL;
  action.runingFixed = status === RUNNING_FIXED;
  action.runingByTime = status === RUNNING_BY_TIME;
  action.needCheck = status === NEED_CHECK;
  action.checkAudit = status === CHECK_AUDIT;
  action.checkfail = status === CHECK_FAIL;
  return action;
}

/**
 * 首页我的任务标题
 */
let taskTitleStrategy = {
  //预约中
  1: function(runningTask){
    let date = TimeUtil.formatDateTime(runningTask.reserveDate.date);
    return `预约时间: ${ date } ${ runningTask.reserveDate.begin_time }-${ runningTask.reserveDate.end_time }`;
  },

  //已超时未签到
  2: function(runningTask){ 
    let date = TimeUtil.formatDateTime(runningTask.reserveDate.date);
    return `预约时间: ${ date } ${ runningTask.reserveDate.begin_time }-${ runningTask.reserveDate.end_time }`;
  },

  //已签到，未安装
  3: () => "请及时关注网点安装进度",

  //已签到，安装中
  4: () => "请耐心等待广告安装完成",

  //审核失败，需要返工
  5: () => "安装审核未通过，请重新安装",

  //安装完成待上画
  6: () => "请及时上传车辆上画照片",

  //已提交登记信息, 但有审核中、审核失败（不需要返工）状态
  7: function(runningTask){
    if(!runningTask.registInfo){
      console.error('登记信息 field "registInfo" to null or undefined is invalid')
    }
    if(runningTask.registInfo.status == 1){
      return "登记审核中，通过后自动投放广告";
    } else if(runningTask.registInfo.status == 2) {
      return "安装审核未通过，请重新拍照审核";
    }
  },

  //投放中，固定收益
  8: () => "广告投放中",

  //投放中，按时计费
  9: () => "广告投放中",
  
  //广告处于检测中
  10: function(runningTask){
    //未提交审核
    if(runningTask.detectionInfo.status == 0){
      return "广告已结束，检测领取收益";
    } else if(runningTask.detectionInfo.status == 1) {
      return "检测审核中，通过后可提取收益";
    } else if(runningTask.detectionInfo.status == 2) {
      return "广告检测未通过，请重新检测";
    }
  }
}

/**
 * 获取当前任务描述
 *
 * @param {*} runningTask 运行中广告信息
 * @returns 状态
 */
export function getMyTaskDesc(runningTask){
  if(!runningTask){
    console.error("runningTask to null or undefind is invalid");
    return;
  }
  return taskTitleStrategy[runningTask.process](runningTask);
}

let taskStatusStrategy = {
  subscribed: () => '待安装',
  subscribeOvertime: () => taskStatusStrategy.subscribed(),
  signedWaitInstall: () => taskStatusStrategy.subscribed(),
  installing: () => '安装中',
  installed: () => '安装完成',
  installAudit: () => '审核中',
  installFail: () => '投放异常',
  rework: () => taskStatusStrategy.installFail(),
  runingFixed: ()=> '投放中',
  runingByTime: () => taskStatusStrategy.runingFixed(),
  needCheck: () => '待检测',
  checkAudit: () => '检测中',
  checkfail: () => '检测异常'
}

/**
 * 任务状态文字信息
 */
export function getTaskStatusStr(taskStatus){
  if(!taskStatus){
    console.error("taskStatus to null or undefind is invalid");
    return;
  }
  return taskStatusStrategy[taskStatus]();
}

/**
 * 提现状态
 */
const withDrawStrategy = {
  1: () => '审核中',
  2: () => '审核失败',
  3: () => '审核通过',
  4: () => '正在转账',
  5: () => '转账成功',
  6: () => '转账失败',
}

export function getWithdrawStatus(status){
  return withDrawStrategy[status]();
}