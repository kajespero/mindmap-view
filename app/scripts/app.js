'use strict';

/**
 * @ngdoc overview
 * @name mindmapViewApp
 * @description
 * # mindmapViewApp
 *
 * Main module of the application.
 */
angular.module('mindmapModule', ['firebase']);
angular
  .module('mindmapViewApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
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
