import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';
import path from "path";

const PORT = 3001;

const server = http.createServer((request, response) => {
  const filePath = request.url == "/" ?  "./public/index.html" : "./public" + request.url
  fs.readFile(filePath, function(error, content) {
    if (error) {
      response.writeHead(500);
      response.end('a helpful error message');
    } else {
      const contentType = filePath.endsWith(".js") ? "application/javascript" : "text/html"
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(content, 'utf-8');
    }
  })
})

const wss = new WebSocketServer({server})

const broadcast = message => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

wss.on('connection', (socket, req) => {
  const username = new URL(req.url, "http://localhost").searchParams.get(
    "username",
  );
  socket.on('error', console.error);
  socket.on('message', data => {
    const {username, text} = JSON.parse(data.toString())
    broadcast({type: "chat", username, text})
  });
  broadcast({"type": "system", "text": username + " joined"})
  socket.on("close", data => broadcast({ type: 'system', text: `${username} left` }))
});

server.listen(PORT, () => console.log(`launching chat on http://localhost:${PORT}`))
