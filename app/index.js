const angular = require("angular");

const app = angular.module('app', []);

require('./main/main_directive').default(app);