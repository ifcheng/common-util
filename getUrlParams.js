/**
 * 获取url地址中"?"号传值的参数
 * @param {string} key  url地址中参数的值
 */
export default function getUrlParams(key) {
  const search = decodeURIComponent(location.search)
  const pattern = new RegExp('(?:\\?|&)' + key + '=((?:.|\n|\r)*?)(&|\\?|$)')
  const ret = pattern.exec(search)
  if (ret && ret[1]) return ret[1]
  return ''
}
