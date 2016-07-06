const angular = require("angular");
const angularUiRouter = require('angular-ui-router');

const app = angular.module('app', [angularUiRouter]);

require('./router/router').default(app);
require('./main/main_directive').default(app);
