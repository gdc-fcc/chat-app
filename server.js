import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

import path from "path";

const PORT = 3001;

const server = http.createServer((request, response) => {
  var filePath = '.' + request.url;
  if (filePath == "./") {
    filePath = "./public/index.html"
  } else {{
    filePath = "./public" + request.url
  }}
  console.log(filePath)

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

wss.on('connection', (socket, req) => {
  const username = new URL(req.url, "http://localhost").searchParams.get(
    "username",
  );
  const message = { "type": "system", "text": username + " joined" }
  console.log(message)
  socket.on('error', console.error);
  socket.on('message', data => {
    const {username, text} = JSON.parse(data.toString())
    const message_out = JSON.stringify({type: "chat", username, text})
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message_out);
      }
    });
  });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  })
});

server.listen(3001, () => console.log("http://localhost:" + 3001))
