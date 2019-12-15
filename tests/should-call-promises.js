const guard = require('../guard')();
const token = guard.token;

const guarantee = require('../guarantee')();


const myfunc = guard.wrap(['myfunc'], () => 123);

async function sub() {
  return 123;
}

async function main() {
  await guard.withPerm(token, {myfunc: true}, async () => {
    const val = await sub();
    guarantee.equal(val, myfunc(), 'call myfunc after await');
  });

  guarantee.calls({
      equal: 1,
  })
}


main();

// Copyright © 2019 guard.js authors (see AUTHORS)
// This program is licensed under the AGPL v3
