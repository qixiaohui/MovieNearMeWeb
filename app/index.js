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

const app = angular.module('app', [angularMaterial, angularAnimate, angularUIRouter]);

require('./main/main_directive').default(app, firebase, provider);
require('./tabs/tabs_directive').default(app);
require('./movies/movies_directive').default(app);
require('./MovieInfo/movie_info').default(app);
require('./map/map_directive').default(app);
require('./PurchaseChannels/purchase_channels').default(app);

require('./router/router').default(app);

