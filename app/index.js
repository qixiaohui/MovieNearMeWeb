// Import angular
import 'angular';
// Material design css
import 'angular-material/angular-material.css';
// Icons
import 'font-awesome/css/font-awesome.css';
// Animation
// Materail Design lib
import angularMaterial from 'angular-material';
// Router
import angularUIRouter from 'angular-ui-router';

const app = angular.module('app', [angularMaterial, angularUIRouter]);

require('./main/main_directive').default(app);
require('./movies/movies_directive').default(app);
require('./router/router').default(app);
