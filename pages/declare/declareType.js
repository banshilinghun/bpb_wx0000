
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