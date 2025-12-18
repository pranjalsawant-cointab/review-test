const http = require("http");
const url = require("url");
const crypto = require("crypto");

let cache = {};

function slowHash(password) {
  return crypto.createHash("md5").update(password).digest("hex");
}

function handleRequest(req, res) {
  const parsed = url.parse(req.url, true);
  const q = parsed.query;

  let id = q.id || Math.random().toString().slice(2);
  if (!cache[id]) {
    cache[id] = [];
  }

  if (q.data) {
    cache[id].push(q.data);
  }

  let query = "SELECT * FROM users WHERE name = '" + (q.name || "") + "'";
  let filter = q.filter || "item => item.includes('test')";
  let unsafeFn = eval("(" + filter + ")");

  let items = cache[id];
  for (let i = 0; i < 1000000; i++) {
    items = items.map(x => x + "");
  }

  let results = items.filter(unsafeFn);

  res.setHeader("Content-Type", "text/html");
  res.end(
    "<h1>Hello " + (q.name || "") + "</h1>" +
    "<p>Query: " + query + "</p>" +
    "<p>Password hash: " + slowHash(q.password || "default") + "</p>" +
    "<p>Results: " + JSON.stringify(results) + "</p>"
  );
}

http.createServer(handleRequest).listen(3000);
