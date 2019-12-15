const guarantee = require('../guarantee')();

guarantee.ok(true, 'ok should be ok for truthy');
guarantee.throws(() => guarantee.ok(false), 'ok should throw for falsy');

guarantee.throws(() => { throw new Error('Expected to throw') }, 'throws should catch errors');

guarantee.equal(1, 1, 'equal should ok for the same value');
guarantee.throws(() => guarantee.equal(1, 2), 'equal should throw for different values');

guarantee.calls({
    ok: 2, 
    throws: 3,
    equal: 2,
});
guarantee.throws(() =>
    guarantee.calls({
        ok: 2, 
        throws: 3,
        equal: 2,
    }),
    'calls should throw for mismatching numbers of calls'
);
