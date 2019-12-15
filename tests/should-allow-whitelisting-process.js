const guard = require('../guard')();
const token = guard.token;

const assert = require('assert');
const process = require('process');

function readCwd() {
  return guard.withPerm(guard.token, {process: {cwd: true}}, () => process.cwd());
}

assert.ok(readCwd(), 'can whitelist process.cwd');
