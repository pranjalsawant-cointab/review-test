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
