const guard = require('../guard')();
const token = guard.token;

const guarantee = require('../guarantee')();


const myfunc = guard.wrap(['myfunc'], () => 44);

guard.withPerm(token, {myfunc: true}, () => {
  setImmediate(() => {
    guarantee.equal(44, myfunc(), 'setImmediate should keep permission context');
  });
});

guarantee.calls({equal: 1}, 100)
