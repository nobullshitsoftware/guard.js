const guard = require('../guard')();

const guarantee = require('../guarantee')();

guarantee.ok(guard.token, 'guard.init() should return a token');

// Copyright © 2019 guard.js authors (see AUTHORS)
// This program is licensed under the AGPL v3
