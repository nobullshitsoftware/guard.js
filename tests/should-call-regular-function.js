const guard = require('../guard')();
const token = guard.token;

const assert = require('assert');


const myfunc = guard.wrap(['myfunc'], () => 123);

guard.withPerm(token, {myfunc: true}, () => {
  assert.equal(123, myfunc(), 'permitted function should return 123');
});

assert.throws(myfunc, 'function should be denied by default');
