
function substringStr(target) {
  if (target && target.length > 12) {
    target = target.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
    if (!target) {
      return '匿名';
    } else {
      return target.slice(0, 12) + '...';
    }
  }
  return target;
}

function substringName(nickname) {
  if (!nickname) {
    nickname = '好友';
  } else if (GetLength(nickname) > 6) {
    nickname = cutstr(nickname, 6);
  }
  return nickname;
}

var GetLength = function (str) {
  ///<summary>获得字符串实际长度，中文2，英文1</summary>
  ///<param name="str">要获得长度的字符串</param>
  var realLength = 0, len = str.length, charCode = -1;
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) realLength += 1;
    else realLength += 2;
  }
  return realLength;
};

//js截取字符串，中英文都能用  
//如果给定的字符串大于指定长度，截取指定长度返回，否者返回源字符串。  
//字符串，长度  

/** 
 * js截取字符串，中英文都能用 
 * @param str：需要截取的字符串 
 * @param len: 需要截取的长度 
 */
function cutstr(str, len) {
  var str_length = 0;
  var str_len = 0;
  var str_cut = new String();
  str_len = str.length;
  for (var i = 0; i < str_len; i++) {
    var a = str.charAt(i);
    str_length++;
    if (escape(a).length > 4) {
      //中文字符的长度经编码之后大于4  
      str_length++;
    }
    str_cut = str_cut.concat(a);
    if (str_length >= len) {
      str_cut = str_cut.concat("...");
      return str_cut;
    }
  }
  //如果给定字符串小于指定长度，则返回源字符串；  
  if (str_length < len) {
    return str;
  }
}

module.exports = {
  substringStr: substringStr,
  substringName: substringName
}