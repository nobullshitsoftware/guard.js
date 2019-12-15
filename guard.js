const http = require('http');
//..etc

let currentPerms = {} // ALL_PERMS;

let sharedToken;

function setup() {
  const origFetch = http.fetch;
  http.fetch = function proxyFetch() {
    if (currentPerms?.http?.fetch === 'allow') {
      return origFetch.call(http, arguments);
    } else {
      throw new SecurityError('not allowed');
    }
  }
}

class SecurityError extends Error { }

function withPerm(token, perms, cb) {
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

export default function init() {
  const ret = {
    withPerm,
  };
  if (!sharedToken) {
    ret.token = sharedToken = new Symbol('guard.js-token');
  }
  return ret;
}
