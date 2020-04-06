class Socket {
  /**
   * @param {String} url 测试用例：'wss://echo.websocket.org'
   * @param {Object} config
   *  - config.reconnectTimeout 断线重连间隔，默认2s
   *  - config.reconnectLimit 最大重连次数，默认无限制
   *  - config.pingTimeout 客户端心跳检测间隔，默认15s
   *  - config.pongTimeout 服务器心跳响应超时时间，默认10s
   *  - config.heartbeatMsg 心跳消息，建议前后端保持一致
   */
  constructor(url, config) {
    const defaultConfig = {
      reconnectTimeout: 2000,
      reconnectLimit: 0,
      pingTimeout: 15000,
      pongTimeout: 10000,
      heartbeatMsg: 'heartbeat'
    }
    this.config = { ...defaultConfig, ...config, url }
    this.native = null
    this.reconnectCount = 0

    //init hook function
    this.onclose = null
    this.onerror = null
    this.onopen = null
    this.onmessage = null

    this.initSocket()
  }

  initSocket() {
    if ('WebSocket' in window) {
      this.native = new WebSocket(this.config.url)
    } else if ('MozWebSocket' in window) {
      this.native = new window.MozWebSocket(this.config.url)
    } else {
      throw new Error('该浏览器不支持websocket')
    }
    this.bindEvent()
  }

  bindEvent() {
    this.native.onclose = event => {
      const { reconnectLimit } = this.config
      // 超出次数，不再重连
      if (reconnectLimit > 0 && this.reconnectCount >= reconnectLimit) {
        this.forbidReconnect = true
      }
      event.fullyClosed = this.forbidReconnect
      this.onclose && this.onclose(event)
      this.reconnect()
    }
    this.native.onerror = event => {
      this.onerror && this.onerror(event)
    }
    this.native.onopen = event => {
      if (this.reconnectCount > 0) {
        this.reconnectCount = 0
        event.reconnected = true
      }
      this.onopen && this.onopen(event)
      //心跳检测重置
      this.heartReset()
    }
    this.native.onmessage = event => {
      //忽略心跳信息
      event.data !== this.config.heartbeatMsg &&
        this.onmessage &&
        this.onmessage(event)
      //如果获取到消息，心跳检测重置
      //拿到任何消息都说明当前连接是正常的
      this.heartReset()
    }
  }

  reconnect() {
    if (this.forbidReconnect) return
    this.reconnectCount++
    //没连接上会一直重连，设置延迟避免请求过多
    setTimeout(() => {
      this.initSocket()
    }, this.config.reconnectTimeout)
  }

  send(data) {
    if (typeof data !== 'string') data = JSON.stringify(data)
    this.native.send(data)
  }

  close() {
    //如果手动关闭连接，不再重连
    this.forbidReconnect = true
    this.heartClear()
    this.native.close()
  }

  heartReset() {
    this.heartClear()
    this.heartStart()
  }

  heartClear() {
    clearTimeout(this._pingId)
    clearTimeout(this._pongId)
  }

  heartStart() {
    const { heartbeatMsg, pingTimeout, pongTimeout } = this.config
    this._pingId = setTimeout(() => {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      this.native.send(heartbeatMsg)
      //如果超过一定时间还没重置，说明后端主动断开了
      this._pongId = setTimeout(() => {
        this.native.close()
      }, pongTimeout)
    }, pingTimeout)
  }
}

export default Socket
