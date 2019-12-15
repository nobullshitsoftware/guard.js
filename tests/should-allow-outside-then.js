const guard = require('../guard')();
const token = guard.token;

const guarantee = require('../guarantee')();


const myfunc = guard.wrap(['myfunc'], () => 123);

const p = guard.withPerm(token, {myfunc: true}, () => {
  return Promise.resolve('unimportant');
});


p.then(() => {
  // withPerm returned a promise; they must carry the permission context
  guarantee.equal(123, myfunc(), 'promise should keep the permission context');
});


guarantee.calls({equal: 1})
