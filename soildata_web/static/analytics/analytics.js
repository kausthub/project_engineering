'use strict';

angular.module('myApp.analytics', ['ngRoute'])

.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
  $routeProvider.when('/analytics', {
    templateUrl: 'analytics/analytics.html',
    controller: 'AnltcsCtrl'
  });
  $locationProvider.html5Mode(true);
}])

.controller('AnltcsCtrl', function($scope,$http,authentication) {
	$(document).on('click','.searchbychar', function(event) {
	    event.preventDefault();
	    var target = "#" + this.getAttribute('data-target');
	    $('html, body').animate({
	        scrollTop: $(target).offset().top
	    }, 500);
	});
});