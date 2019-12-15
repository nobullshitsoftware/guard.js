const http = require('http');
const process = require('process');
//..etc

let currentPerms = {} // ALL_PERMS;

let sharedToken;

class SecurityError extends Error { }

function get(obj, path) {
  if (!obj || !path || !path.length) {
    return obj;
  }
  return get(obj[path[0]], path.slice(1));
}

function get2(obj, path) {
  return path.reduce((o, k) => o && o[k], obj);
}

function wrap(path, f) {
  return function() {
    if (get(currentPerms, path)) {
      return f.apply(this, arguments);
    } else {
      const pathstr = path.join('.');
      throw new SecurityError(`guard: ${pathstr} not allowed`);
    }
  }
}

function wrapProp(path, obj, key) {
  const oldval = obj[key];
  Object.defineProperty(obj, key, { get: wrap(path, () => oldval); });
}

function setup() {
  // TODO: Check node version; if > our supported API then we don't guard
  // potential new functions. Warn.
  http.fetch = wrap(['http', 'request'], http.request);
  http.get = wrap(['http', 'get'], http.get);
  process.abort = wrap(['process', 'abort'], process.abort);
  wrapProp(['process', 'argv'], process, 'argv')
  wrapProp(['process', 'argv0'], process, 'argv0')
  process.chdir = wrap(['process', 'chdir'], process.chdir);
  wrapProp(['process', 'config'], process, 'config');
  process.cwd = wrap(['process', 'cwd'], process.cwd);
}

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
    wrap,
  };
  if (!sharedToken) {
    ret.token = sharedToken = new Symbol('guard.js-token');
    setup();
  }
  return ret;
}
