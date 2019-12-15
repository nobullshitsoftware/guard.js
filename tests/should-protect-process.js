const guard = require('../guard')();
const token = guard.token;

const assert = require('assert');
const process = require('process');

assert.throws(() => process.cwd(), 'process.cwd should be protected');

// Copyright © 2019 guard.js authors (see AUTHORS)
// This program is licensed under the AGPL v3
