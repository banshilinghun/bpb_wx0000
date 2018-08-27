//策略模式

// 登记 检测
export const REGIST = 'regist';
export const CHECK = 'check';

let actionStrategy = {
  '3': function(){
    return REGIST;
  },
  '4': function(){
    return CHECK;
  }
}

export function getActionType(classify){
  return actionStrategy[classify]();
}