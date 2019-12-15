const guard = require('../guard')();

const assert = require('assert');

assert.ok(guard.token, 'guard.init() should return a token');
