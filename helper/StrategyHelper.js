//策略模式

const TimeUtil = require('../utils/time/timeUtil');

// 登记 检测
export const REGIST = 'regist';
export const CHECK = 'check';

let actionStrategy = {
  regist: function(){
    return REGIST;
  },
  check: function(){
    return CHECK;
  }
}

export function getActionType(flag){
  return actionStrategy[flag]();
}


//subscribed: 已预约未签到 | subscribeOvertime 预约中，已超时 | signedWaitInstall: 已签到未安装 | installing: 安装中 | installed: 安装完成待上画 | rework: 返工预约 
//installAudit: 安装审核 | installFail: 安装审核失败 | runingFixed: 投放中固定收益  | runingByTime: 投放中按时计费 | needCheck: 待检测 | checkAudit: 检测审核中 | checkfail: 审核失败
let taskStrategy = {
  //预约中
  1: function(){
    return "subscribed";
  },

  //已超时未签到
  2: function(){
    return "subscribeOvertime";
  },

  //已签到，未安装
  3: function(){
    return "signedWaitInstall";
  },

  //已签到，安装中
  4: function(){
    return "installing";
  },

  //审核失败，需要返工
  5: function(){
    return "rework";
  },

  //安装完成待上画
  6: function(){
    return "installed";
  },

  //已提交登记信息, 但有审核中、审核失败（不需要返工）状态
  7: function(runningTask){
    if(!runningTask.registInfo){
      console.error('登记信息 field "registInfo" to null or undefined is invalid')
    }
    if(runningTask.registInfo.status == 1){
      return "installAudit";
    } else if(runningTask.registInfo.status == 2) {
      return "installFail";
    }
  },

  //投放中，固定收益
  8: function(){
    return "runingFixed";
  },

  //投放中，按时计费
  9: function(){
    return "runingByTime";
  },
  
  //广告处于检测中
  10: function(runningTask){
    //未提交审核
    if(runningTask.status == 0){
      return "needCheck";
    } else if(runningTask.status == 1) {
      return "checkAudit";
    } else if(runningTask.status == 2) {
      return "checkfail";
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
 * 首页我的任务标题
 */
let taskTitleStrategy = {
  //预约中
  1: function(runningTask){
    let date = TimeUtil.formatDateTime(runningTask.reserveDate.date);
    return `预约时间: ${ date }${ runningTask.reserveDate.begin_time }${ runningTask.reserveDate.end_time }`;
  },

  //已超时未签到
  2: function(runningTask){ 
    let date = TimeUtil.formatDateTime(runningTask.reserveDate.date);
    return `预约时间: ${ date }${ runningTask.reserveDate.begin_time }${ runningTask.reserveDate.end_time }`;
  },

  //已签到，未安装
  3: function(){
    return "请及时关注网点安装进度";
  },

  //已签到，安装中
  4: function(){
    return "请耐心等待广告安装完成";
  },

  //审核失败，需要返工
  5: function(){
    return "安装审核未通过，请重新安装";
  },

  //安装完成待上画
  6: function(){
    return "请及时上传车辆上画照片";
  },

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
  8: function(){
    return "广告投放中";
  },

  //投放中，按时计费
  9: function(){
    return "广告投放中";
  },
  
  //广告处于检测中
  10: function(runningTask){
    //未提交审核
    if(runningTask.status == 0){
      return "广告已结束，检测领取收益";
    } else if(runningTask.status == 1) {
      return "检测审核中，通过后可提取收益";
    } else if(runningTask.status == 2) {
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
  subscribed: function(){
    return '待安装';
  },
  subscribeOvertime: function(){
    return this.subscribed();
  },
  signedWaitInstall: function(){
    return this.subscribed();
  },
  installing: function(){
    return '安装中';
  },
  installed: function(){
    return '安装完成';
  },
  installAudit: function(){
    return '审核中';
  },
  installFail: function(){
    return '投放异常';
  },
  rework: function(){
    return this.installFail();
  },
  needCheck: function(){
    return '待检测';
  },
  checkAudit: function(){
    return '检测中';
  },
  checkfail: function(){
    return '检测异常';
  }
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

