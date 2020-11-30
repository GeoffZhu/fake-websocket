class WebSocketServer extends EventTarget {
  constructor(url, protocol) {
    super();
    this.clients = [];

    this.clients._push = this.clients.push;
    this.clients.push = port => {
      port.onmessage = msg => {
        const event = new MessageEvent('message', { data: msg.data });
        this.onmessage && this.onmessage(event);
        this.dispatchEvent(event);
      }
      this.clients._push(port);
    }

    window.__fakeWebSocket__[url] = this.clients;
  }
  on (type, callback) {
    this.addEventListener(type, callback);
  }

  send (data) {
    this.clients.forEach(port => {
      port.postMessage(data);
    });
  }
}

export {
  WebSocketServer
}