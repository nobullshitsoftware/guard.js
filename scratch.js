
// permdrop.js
let currentPerms = {} // ALL_PERMS;
const http = require('http');
function init() {
  const origFetch = http.fetch;
  http.fetch = function proxyFetch() {
    if (currentPerms?.http?.fetch === 'allow') {
      return origFetch.call(http, arguments);
    } else {
      throw new SecurityError('not allowed');
    }
  }
}
export default function withPerm(token, perms, cb) {
  if (!sharedToken) {
    throw new Error('please call .setToken with a secret symbol first');
  }
  if (sharedToken !== token) {
    throw new SecurityError('wrong token');
  }
  const oldPerms = currentPerms;
  try {
    currentPerms = perms;
    const ret = cb();
    if (ret.then) {
      return {
        then(ok) {
          return withPerm(token, perms, ok);
        },
      };
    }
    return ret;
  } finally {
    currentPerms = oldPerms;
  }
}
let sharedToken;
export setToken(s) {
  if (sharedToken) {
    throw SecurityError('token already set');
  }
  sharedToken = s;
}

init();

// myapp.js
const http = require('http');

const request = mixinPerms(require('request'));
function main() {
  // by default everything is denied
  http.fetch('http://evil.com/foo') // denied

  withPerm({http: {fetch: ['allow']}}, () => {
    http.fetch('http://good.com/yay'); // but .syscall was a passthrough which checked the outer withPerm context
  })
}
