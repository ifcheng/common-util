/**
 * 并行加载图片
 * @param  {(string | false | null | undefined)[]} imgsUrl 待加载图片url数组
 * @returns {Promise<(HTMLImageElement | null)[]>}
 */
export default function loadImages(imgsUrl) {
  return Promise.all(
    imgsUrl.map(url => {
      if (!url) return Promise.resolve(null)
      const img = new Image()
      img.crossOrigin = ''
      img.referrerPolicy = 'no-referrer'
      img.src = url
      return new Promise((resolve, reject) => {
        img.onload = () => resolve(img)
        img.onerror = err => reject(err)
      })
    })
  )
}
