const guard = require('../guard')();

const guarantee = require('guarantee')();

guarantee.ok(guard.token, 'guard.init() should return a token');
