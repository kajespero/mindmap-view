'use strict';

/**
 * @ngdoc overview
 * @name mindmapViewApp
 * @description
 * # mindmapViewApp
 *
 * Main module of the application.
 */
angular.module('mindmapModule', []);
angular
  .module('mindmapViewApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'mindmapModule'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MindmapCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
