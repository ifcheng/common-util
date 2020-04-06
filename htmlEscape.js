/**
 * html字符串转义
 * @param {String} text
 */
export default function htmlEscape(text) {
  return text.replace(/[<>"&]/g, match => {
    switch (match) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      case '&':
        return '&amp;'
    }
  })
}
