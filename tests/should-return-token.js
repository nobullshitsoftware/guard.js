const guard = require('./guard');

const assert = require('assert');

const token = guard.init();
assert.ok(token, 'init() should return a token');
