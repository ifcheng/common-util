const formatSet = ['yyyy-MM-dd', 'yyyy-MM-dd HH:mm', 'yyyy-MM-dd HH:mm:ss']

function padding(val) {
  return String(val).padStart(2, '0')
}

/**
 * 格式化时间戳
 * @param {number} val 时间戳
 * @param {'yyyy-MM-dd' | 'yyyy-MM-dd HH:mm' | 'yyyy-MM-dd HH:mm:ss'} format 格式
 */
export function timestampToDateStr(val, format = 'yyyy-MM-dd HH:mm:ss') {
  const datetime = new Date(val)
  const y = datetime.getFullYear()
  const M = datetime.getMonth() + 1
  const d = datetime.getDate()
  const H = datetime.getHours()
  const m = datetime.getMinutes()
  const s = datetime.getSeconds()
  const date = `${y}-${padding(M)}-${padding(d)}`
  switch (formatSet.indexOf(format)) {
    case 0:
      return date
    case 1:
      return `${date} ${padding(H)}:${padding(m)}`
    default:
      return `${date} ${padding(H)}:${padding(m)}:${padding(s)}`
  }
}

/**
 * 日期格式化
 * @param {*} val 待格式化的值
 * @param {'yyyy-MM-dd' | 'yyyy-MM-dd HH:mm' | 'yyyy-MM-dd HH:mm:ss'} format 格式
 */
export default function(val, format = 'yyyy-MM-dd HH:mm:ss') {
  if (typeof val === 'number') return timestampToDateStr(val, format)
  if (typeof val !== 'string' || !val) return ''
  const normalizedStr = val.replace(/\s|-|:/g, '')
  const regexp = /^(\d{4})(\d{2})(\d{2})(?:(\d{2})(\d{2})(\d{2})?)?$/
  if (!regexp.test(normalizedStr)) return ''
  return normalizedStr.replace(regexp, (...matchs) => {
    const date = matchs.slice(1, 4).join('-')
    const time = matchs
      .slice(4, 7)
      .map(t => t || '00')
      .join(':')
    switch (formatSet.indexOf(format)) {
      case 0:
        return date
      case 1:
        return `${date} ${time.slice(0, -3)}`
      default:
        return `${date} ${time}`
    }
  })
}
