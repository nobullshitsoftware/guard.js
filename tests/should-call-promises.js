const guard = require('../guard')();
const token = guard.token;

const assert = require('assert');


const myfunc = guard.wrap(['myfunc'], () => 123);

async function sub() {
  return 123;
}

async function main() {
  await guard.withPerm(token, {myfunc: true}, async () => {
    const val = await sub();
    assert.equal(val, myfunc(), 'call myfunc after await');
    // TODO: Assert this was called
  });
}


main();
