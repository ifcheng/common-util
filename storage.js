class SmartStorage {
  constructor(storage) {
    this.native = storage
  }
  /**
   * @param {string} key
   */
  get(key) {
    let res = this.native.getItem(key)
    try {
      res = JSON.parse(res).value
    } catch {}
    return res
  }
  /**
   * @param {string} key
   * @param {*} value 
   */
  set(key, value) {
    if (typeof value !== string) value = JSON.stringify({ value })
    this.native.setItem(key, value)
  }
  /**
   * @param {string | string[]} key
   */
  remove(key) {
    Array.isArray(key)
      ? key.forEach(item => this.native.removeItem(item))
      : this.native.removeItem(key)
  }
  clear() {
    this.native.clear()
  }
}

export const local = new SmartStorage(localStorage)
export const session = new SmartStorage(sessionStorage)
