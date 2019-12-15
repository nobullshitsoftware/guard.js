const guard = require('./guard');
const token = guard.init();

const http = require('http');

const request = guard.mixinPerms(token, {}, require('request'));

function main() {
  // by default everything is denied
  http.fetch('http://evil.com/foo') // denied

  guard.withPerm(token, {http: {fetch: ['allow']}}, () => {
    http.fetch('http://good.com/yay'); // but .syscall was a passthrough which checked the outer withPerm context
  })
}
