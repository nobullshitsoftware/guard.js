const guard = require('../guard')();
const token = guard.token;

const guarantee = require('../guarantee')();

const myfunc = guard.wrap(['myfunc'], () => 123);

guard.withPerm(token, {myfunc: true}, () => {
  guarantee.equal(123, myfunc(), 'permitted function should return 123');
});

guarantee.throws(myfunc, 'function should be denied by default');

guarantee.calls({
    equal: 1,
    throws: 1,
});

// Copyright © 2019 guard.js authors (see AUTHORS)
// This program is licensed under the AGPL v3
