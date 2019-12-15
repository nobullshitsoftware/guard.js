const guard = require('../guard')();
const token = guard.token;

const guarantee = require('../guarantee')();

// This works if you do:
//const Promise = require('bluebird');
//
// So we're running into a node.js native Promise issue here.

const myfunc = guard.wrap(['myfunc'], () => 144);

const p = guard.withPerm(token, {myfunc: true}, () => {
  Promise.resolve('unimportant')
   .then(() => 12)
   .then(x => x * x)
   .then(x => {
    // withPerm returned a promise; they must carry the permission context
    guarantee.equal(x, myfunc(), 'promise should keep the permission context');
  });
});

guarantee.calls({equal: 1}, 100)
