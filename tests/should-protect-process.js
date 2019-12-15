const guard = require('../guard')();
const token = guard.token;

const assert = require('assert');
const process = require('process');

assert.throws(() => process.cwd(), 'process.cwd should be protected');
