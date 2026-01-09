const http = require("http");
const url = require("url");
const crypto = require("crypto");

let cache = {};

// Example using crypto.scryptSync with a salt (synchronous example)
function slowHash(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  // scrypt output length 64 bytes
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  // store salt and derived value together (e.g. salt:derived) when persisting
  return salt + ':' + derived;
}
// Prefer async APIs in production and a proper password library like bcrypt or argon2.

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
