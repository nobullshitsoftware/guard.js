const guard = require('../guard')();
const token = guard.token;

const guarantee = require('../guarantee')();


const myfunc = guard.wrap(['myfunc'], () => 144);

const p = guard.withPerm(token, {myfunc: true}, () => {
  return Promise.resolve('unimportant');
});

p.then(() => 12)
 .then(x => x * x)
 .then(x => {
  guarantee.throws(myfunc, 'promise should not keep permission ctx');
});

guarantee.calls({equal: 1}, 100)
