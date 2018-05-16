
function substringStr(target) {
  if (target && target.length > 9) {
    return target.slice(0, 9) + '...';
  }
  return target;
}

module.exports = {
  substringStr: substringStr
}