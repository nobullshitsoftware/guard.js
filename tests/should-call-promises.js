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
}


main();

guarantee.calls({
    equal: 1,
})
