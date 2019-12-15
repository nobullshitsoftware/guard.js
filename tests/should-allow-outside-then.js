const guard = require('../guard')();
const token = guard.token;

const assert = require('assert');


const myfunc = guard.wrap(['myfunc'], () => 123);

const p = guard.withPerm(token, {myfunc: true}, () => {
  return Promise.resolve('unimportant');
});


p.then(() => {
  // withPerm returned a promise; they must carry the permission context
  assert.equal(myfunc(), 123, 'promise should keep the permission context');
  // TODO: Assert it actually got here
});
