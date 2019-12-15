const guard = require('../guard')();
const token = guard.token;

const assert = require('assert');


const myfunc = guard.wrap(['myfunc'], () => 123);

guard.withPerm(token, {myfunc: true}, async () => {
  assert.equal(123, myfunc(), 'call myfunc when allowed');
  // TODO: Assert this was called
});

assert.throws(myfunc, 'should not cache the permissions');

