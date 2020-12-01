# Fake-websocket

> 在浏览器中模拟WebScoket服务端和客户端


## 使用方法

### 模拟WS服务端

``` javascript
import { WebSocketServer } from 'fake-websocket';

let server = new WebSocketServer('ws://127.0.0.1:8080');

server.on('message', (e) => {
  console.log('server get message', e.data);
  server.send({ b: 2 });
});

```

### 模拟WS客户端

``` javascript
import { WebSocket } from 'fake-websocket';

let ws = new WebSocket('ws://127.0.0.1:8080');

ws.onmessage = (e) => { 
  console.log('client get message', e.data);
}; 

ws.onopen = (e) => {
  ws.send({ a: 1 });
}

ws.onerror = (e) => {
  console.error(e);
}

```

## 干什么用

- e2e测试，替换浏览器环境中WebSocket对象，实现Websocket本地模拟，无需启动server跑真实socket服务
- 一些逆向工作需要，例如微信开发者工具中，appservice(逻辑层)，pageframe(渲染层)和native交互采用websocket，替换后可浏览器内模拟并替换通信消息
