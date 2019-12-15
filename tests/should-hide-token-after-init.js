const guard1 = require('../guard')();
const guard2 = require('../guard')();

const assert = require('assert');

assert.ok(!guard2.token, 'second guard.init() should not expose token');
