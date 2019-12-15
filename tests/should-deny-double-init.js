const guard = require('../guard');

const assert = require('assert');

guard.init();
assert.throws(() => guard.init(), 'second guard.init should throw');
