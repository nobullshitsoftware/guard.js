const guard = require('../guard')();
const token = guard.token;

const guarantee = require('../guarantee')();


const myfunc = guard.wrap(['myfunc'], () => 123);

const p = guard.withPerm(token, {myfunc: true}, () => {
  return Promise.resolve('unimportant');
});


p.then(() => {
  guarantee.throws(myfunc, 'promise should not keep permission ctx');
});


guarantee.calls({equal: 1})

// Copyright © 2019 guard.js authors (see AUTHORS)
// This program is licensed under the AGPL v3
