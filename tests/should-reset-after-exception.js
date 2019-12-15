const guard = require('../guard')();
const token = guard.token;

const assert = require('assert');


const myfunc = guard.wrap(['myfunc'], () => 123);

try {
  guard.withPerm(token, {myfunc: true}, () => {
    assert.equal(myfunc(), 123, 'should allow call before the exception');
    throw 432;
  });
  assert.fail('foo should have thrown');
} catch (e) {
  assert.equal(e, 432, 'should pass error through verbatim');
}

assert.throws(myfunc, 'should not cache the permissions');

// Copyright © 2019 guard.js authors (see AUTHORS)
// This program is licensed under the AGPL v3
