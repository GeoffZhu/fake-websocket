
class WebSocket extends EventTarget {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  static isFake = true;

  readyState = 0;
  constructor(url, protocol) {
    super();
    this.url = url;
    this.protocol = protocol;

    setTimeout(() => {
      this.#connect(url, protocol);
    }, 0);
  }
  #connect(url, protocol) {
    let { port1, port2 } = new MessageChannel();
    this.port1 = port1;
    this.port2 = port2;

    this.port1.onmessage = msg => {
      const event = new MessageEvent('message', { data: msg.data });
      this.onmessage && this.onmessage(event);
      this.dispatchEvent(event);
    };

    // 将连接保存在全局变量中，方便server取
    if (window.__fakeWebSocket__[url]) {
      window.__fakeWebSocket__[url].connect(port2, protocol);
      this.readyState = 1;
    } else {
      const event = new MessageEvent('error', { data: new Error(`Not have server ${url}`) });
      this.onerror && this.onerror(event);
      this.dispatchEvent(event);
      this.close();
      return;
    }

    const event = new MessageEvent('open');
    this.onopen && this.onopen(event);
    this.dispatchEvent(event);
  }
  send(data) {
    this.port1 && this.port1.postMessage(data);
  }
  close() {
    this.readyState = 2;
    
    // 移除连接通道
    if (window.__fakeWebSocket__[this.url]) {
      window.__fakeWebSocket__[this.url].close(this.port2);
    };

    const event = new MessageEvent('close');
    this.onclose && this.onclose(event);
    this.dispatchEvent(event);

    this.readyState = 3;
  }
}

export {
  WebSocket
}