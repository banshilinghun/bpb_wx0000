
//设计模式

//subscribed: 已预约未签到 | subscribeOvertime 预约中，已超时 | signedWaitInstall: 已签到未安装 | installing: 安装中 | installed: 安装完成待上画 | rework: 返工预约 
//installAudit: 安装审核 | installFail: 安装审核失败 | runingFixed: 投放中固定收益  | runingByTime: 投放中按时计费 | needCheck: 待检测 | checkAudit: 检测审核中 | checkfail: 审核失败
let taskStrategy = {
  //预约中
  "1": function(){
    return "subscribed";
  },

  //已超时未签到
  "2": function(){
    return "subscribeOvertime";
  },

  //已签到，未安装
  "3": function(){
    return "signedWaitInstall";
  },

  //已签到，安装中
  "4": function(){
    return "installing";
  },

  //审核失败，需要返工
  "5": function(){
    return "rework";
  },

  //安装完成待上画
  "6": function(){
    return "installed";
  },

  //已提交登记信息, 但有审核中、审核失败（不需要返工）状态
  "7": function(runningTask){
    if(runningTask.status == 1){
      return "installAudit";
    } else if(runningTask.status == 2) {
      return "installFail";
    }
  },

  //投放中，固定收益
  "8": function(){
    return "runingFixed";
  },

  //投放中，按时计费
  "9": function(){
    return "runingByTime";
  },
  
  //广告处于检测中
  "10": function(runningTask){
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
    console.error("runningTask is null or undefind");
    return;
  }
  return taskStrategy[runningTask.process](runningTask);
}