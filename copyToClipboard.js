/**
 * 复制文本到剪贴板
 * @param {string} text 待复制文本
 */
export default function copyToClipboard(text) {
  const input = document.createElement('input')
  input.style.position = 'absolute'
  input.style.left = '9999px'
  input.value = text
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  input.remove()
}
