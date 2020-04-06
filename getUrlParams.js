/**
 * 获取url地址中"?"号传值的参数
 * @param {String} key  url地址中参数的值
 */
export default function getUrlParams(key) {
  let search = decodeURIComponent(location.search)
  let pattern = new RegExp('(?:\\?|&)' + key + '=((?:.|\n|\r)*?)(&|\\?|$)')
  let ret = pattern.exec(search)
  if (ret && ret[1]) {
    return ret[1]
  } else {
    return ''
  }
}