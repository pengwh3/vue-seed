export function getByteLen(val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/gi) != null) {
      len += 1
    } else {
      len += 0.5
    }
  }
  return Math.floor(len)
}

export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**检查有没有调用某url资源的权限*/
export function checkResources(url) {
  let resourceArray = JSON.parse(localStorage.resource);
  for (let i = 0; i < resourceArray.length; i ++){
    if (resourceArray[i].url === url) {
      return false;
    }
  }
  return true;
}
