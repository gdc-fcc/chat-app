# Build a Chat App

https://www.freecodecamp.org/learn/back-end-development-and-apis-v9/lab-chat-app/lab-chat-app

In this project, you will implement the server side of a real-time chat application using Node.js.

The boilerplate gives you:

- public/index.html - a complete chat UI (no edits needed)
- public/script.js - a complete browser WebSocket client (no edits needed)
- server.js - the imports and PORT constant are already written; you must implement the rest

Open a terminal, navigate into the project directory, and install the dependencies:

```
cd build-a-chat-app
npm install
Work within server.js.
```

Once your server is running, open http://localhost:3001 in a browser to use the chat UI.

**Objective**: Fulfill the user stories below and get all the tests to pass to complete the lab.

**User Stories**:

- You should create an HTTP server using http.createServer that reads ./public/index.html and responds with status 200 and Content-Type: text/html. Store it in a variable named server.
- You should create a WebSocketServer from the ws package, passing { server } as the option, and store it in a variable named wss.
- You should register a 'connection' listener on wss. The listener receives the socket and the upgrade request as arguments: wss.on('connection', (socket, req) => { ... }).
- On connection, you should parse the connecting client's username from the URL query string:

```js
const username = new URL(req.url, "http://localhost").searchParams.get(
  "username",
);
```
and immediately broadcast a system message to all connected clients:
```json
{ "type": "system", "text": "<username> joined" }
```
- You should register a 'message' listener on socket that parses the incoming JSON { username, text } and broadcasts { type: 'chat', username, text } to all connected clients (including the sender).
- You should register a 'close' listener on socket that broadcasts { type: 'system', text: '<username> left' } to all remaining connected clients.
- You should start the server by calling server.listen(PORT, callback). The callback should log Chat server running at http://localhost:3001.
