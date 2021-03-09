import mitt from 'mitt';


class WebSocketServer {
  constructor(url) {
    this.emitter = mitt();
    this.clients = [];

    this.clients.connect = (port, protocol) => {
      const client = mitt();

      client.protocol = protocol;
      client.send = (data) => port.postMessage(data);
      port.onmessage = (msg) => client.emit('message', msg.data);

      this.clients.push(client);
      this.emit('connection', client);
    }

    this.clients.close = port => {
      let index = this.clients.findIndex(item => item._port === port);
      this.clients[index].emit('close');
      if (~index) this.clients.splice(index, 1);
    };

    window.__fakeWebSocket__[url] = this.clients;
  }
  on(type, callback) {
    this.emitter.on(type, callback);
  }
  off(type, callback) {
    this.emitter.off(type, callback);
  }
  emit(type, data) {
    this.emitter.emit(type, data);
  }
  destory() {
    window.__fakeWebSocket__ = {};
  }
}

export {
  WebSocketServer
}