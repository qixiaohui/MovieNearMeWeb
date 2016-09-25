import 'bootstrap/dist/css/bootstrap.css';
// Import angular
import 'angular';
// Material design css
import 'angular-material/angular-material.css';
// Icons
import 'font-awesome/css/font-awesome.css';
// Animation
import angularAnimate from 'angular-animate'

// Materail Design lib
import angularMaterial from 'angular-material';
// Router
import angularUIRouter from 'angular-ui-router';
//ng sanitize
import angularSanitize from 'angular-sanitize';

/**
 * initialize firebase
 */
const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
require("firebase/storage");

var config = {
    apiKey: "AIzaSyDgY5Gm7VLSiy83zLSSlmcVNhNFgAP7JQ0",
    authDomain: "movienearme.firebaseapp.com",
    databaseURL: "https://movienearme.firebaseio.com",
    storageBucket: "movienearme.appspot.com",
};
firebase.initializeApp(config);

const provider = new firebase.auth.FacebookAuthProvider();
const database = new firebase.database();

const app = angular.module('app', [angularMaterial, angularAnimate, angularUIRouter, angularSanitize]);

require('./main/main_directive').default(app, firebase, provider, database);
require('./tabs/tabs_directive').default(app, firebase, database);
require('./movies/movies_directive').default(app);
require('./MovieInfo/movie_info').default(app, firebase, database);
require('./map/map_directive').default(app);
require('./PurchaseChannels/purchase_channels').default(app);
require('./signin/signin_directive').default(app);
require('./register/register_directive.js').default(app);
require('./search/search_directive').default(app);
require('./mycollection/mycollection_directive').default(app, firebase, database);
require('./reviews/reviews_directive').default(app);

require('./router/router').default(app);

