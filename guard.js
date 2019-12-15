const http = require('http');
const process = require('process');
//..etc

// TODO: This file is susceptible to hijacking of some global prototype chains!
// E.g. Array.prototype.reduce or Array.prototype.slice. Should stop using
// those!

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

const realSetImmediate = setImmediate;
global.setImmediate = function guardWrappedSetImmediate(f) {
  return realSetImmediate(keepState(f));
};

const realSetTimeout = setTimeout;
global.setTimeout = function guardWrappedSetTimeout(f, ms) {
  return realSetTimeout(keepState(f), ms);
};

const realNextTick = process.nextTick;
process.nextTick = function guardWrappedNextTick() {
  const args = Array.from(arguments);
  args[0] = keepState(args[0]);
  return realNextTick.apply(this, args);
};

// Hack Node's native Promise because it directly manipulates the event queue.
const realThen = Promise.prototype.then;
Promise.prototype.then = function guardWrappedPromiseThen(good, bad) {
  return realThen.call(this, keepState(good), keepState(bad));
}

function keepState(f) {
  if (!f) { return f; }
  // this looks SO dodgy. Must check properly.
  const token = sharedToken;
  const perms = currentPerms;
  return function() {
    return withPerm(token, perms, () => f.apply(this, arguments));
  };
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
  Object.defineProperty(obj, key, { get: wrap(path, () => oldval) });
}

function setup() {
  // TODO: Check node version; if > our supported API then we don't guard
  // potential new functions. Warn.
  http.fetch = wrap(['http', 'request'], http.request);
  http.get = wrap(['http', 'get'], http.get);
  process.abort = wrap(['process', 'abort'], process.abort);
  //wrapProp(['process', 'argv'], process, 'argv')
  // Already a property. TODO: Need fixing or harmless?
  //wrapProp(['process', 'argv0'], process, 'argv0')
  process.chdir = wrap(['process', 'chdir'], process.chdir);
  // This is accessed purely on require, so can't protect this
  //wrapProp(['process', 'config'], process, 'config');
  process.cwd = wrap(['process', 'cwd'], process.cwd);
  //wrapProp(['process', 'env'], process, 'env');
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
    if (ret && ret.then) {
      return {
        then(ok, fail) {
          return ret.then(
            (v) => withPerm(token, perms, () => ok(v)),
            (e) => withPerm(token, perms, () => fail(e))
          );
        },
      };
    }
    return ret;
  } finally {
    currentPerms = oldPerms;
  }
}

module.exports = function init() {
  const ret = {
    withPerm,
    wrap,
  };
  if (!sharedToken) {
    ret.token = sharedToken = Symbol('guard.js-token');
    setup();
  }
  return ret;
}
