const guard1 = require('../guard')();
const guard2 = require('../guard')();

const guarantee = require('../guarantee')();

guarantee.ok(!guard2.token, 'second guard.init() should not expose token');

// Copyright © 2019 guard.js authors (see AUTHORS)
// This program is licensed under the AGPL v3
