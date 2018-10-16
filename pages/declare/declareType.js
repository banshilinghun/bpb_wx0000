
// 申报类型

//损坏申报
export const DAMAGE = 1;

//掉漆申报
export const DROP = 2;

//违章申报
export const VIOLATE = 3;

export const titleMap = {
  1: () => '损坏申报',
  2: () => '掉漆申报',
  3: () => '违章申报',
}

export function getDeclareDate(type){
  const dateTitle = {
    1: () => '损坏日期: ',
    2: () => '掉漆日期: ',
    3: () => '违章日期: ',
  }
  return dateTitle[type]();
}

export function getDeclareReason(type){
  const reasonTitle = {
    1: () => '损坏原因: ',
    2: () => '掉漆原因: ',
    3: () => '违章原因: ',
  }
  return reasonTitle[type]();
}