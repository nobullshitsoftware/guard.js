const guard = require('../guard')();
const token = guard.token;

const assert = require('assert');


function foo() {
  guard.withPerm(token, {}, () => {
    throw 432;
  });
}


try {
  foo();
  assert.fail('foo should have thrown');
} catch (e) {
  assert.equal(e, 432, 'should pass error through verbatim');
}

// Copyright © 2019 guard.js authors (see AUTHORS)
// This program is licensed under the AGPL v3
