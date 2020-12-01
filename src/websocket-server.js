import mitt from 'mitt';

const emitter = mitt();

class WebSocketServer {
  constructor(url, protocol) {
    this.clients = [];

    this.clients.connect = port => {
      const client = mitt();
      client.send = (data) => {
        port.postMessage(data);
      }

      port.onmessage = (msg) => {
        client.emit('message', { data: msg.data });
      }

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
    emitter.on(type, callback);
  }
  off(type, callback) {
    emitter.off(type, callback);
  }
  emit(type, data) {
    emitter.emit(type, data);
  }
}

export {
  WebSocketServer
}