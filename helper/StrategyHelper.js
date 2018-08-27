//策略模式

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