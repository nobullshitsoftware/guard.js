const guard1 = require('../guard')();
const guard2 = require('../guard')();

const guarantee = require('../guarantee')();

guarantee.ok(!guard2.token, 'second guard.init() should not expose token');
