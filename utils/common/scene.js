
//从扫二维码场景（场景值1011）打开时
export const SCENE_ONE = 1011;

//从扫小程序码场景（场景值1047）打开时
export const SCENE_TWO = 1047;

//从聊天顶部场景（场景值1089）中的“最近使用”内打开时
export const SCENE_THREE = 1089;

//从其他小程序返回小程序（场景值1038）时
export const SCENE_FOUR = 1038;

/**
 * 判断是否显示关注公众号组件
 * @param {场景值} scene 
 */
export function checkSceneOfficial(scene){
  if(SCENE_ONE === parseInt(scene)){
    return true;
  }
  if(SCENE_TWO === parseInt(scene)){
    return true;
  }
  return false;
}