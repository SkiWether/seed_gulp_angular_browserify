//main.js

(function () {

    'use strict';

    //Find modules: https://www.npmjs.com/
    //include them
    require('angular');
    require('angular-route');
    require('angular-animate');
    var mainCtrl = require('./controllers/mainController');

    angular.module('SampleApp', ['ngRoute', 'ngAnimate'])

    .config([
        '$locationProvider',
        '$routeProvider',
        function($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');
            // routes
            $routeProvider
            .when("/", {
                templateUrl: "./partials/partial1.html",
                controller: "MainController"
            })
            .otherwise({
                redirectTo: '/'
            });
        }
    ])

    //Load controller
    .controller('MainController', ['$scope', mainCtrl]);
    /*
    angular.module('SampleApp')
    .controller('MainController', [
        '$scope',
        function($scope) {
            $scope.test = "Testing... this content is located in main.js";
        }
    ]);
    */

}());