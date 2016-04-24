'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.analytics',
  'myApp.scheduler',
  'myApp.inventory',
  'myApp.version'
]).
config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
  $routeProvider.otherwise({redirectTo: '/view2'});
  $locationProvider.html5Mode(true);
}])
.factory('authentication', function($http){
  return {
    isLoggedIn: function(){
      if(JSON.parse(localStorage.getItem('credentials')) == undefined)
      {
        return false;
      }
      else
      {
        var cr = JSON.parse(localStorage.getItem('credentials'));
        return cr.loggedIn;
      }
    },
    login: function(){
      var creds = JSON.parse(localStorage.getItem('credentials'));
      var email = creds.email;
      console.log(email)
      localStorage.removeItem('credentials');
      $http.get('https://farmalytics-backend.herokuapp.com/web/gettoken/'+email+'').success(function(data){
      		localStorage.setItem('credentials',JSON.stringify({'loggedIn':true,'email':email,'access_token':data.access_token}));
      	}).error( function(e){
      		alert('couldn\'t login');
      	})
    },
    logout: function(){
      localStorage.removeItem('credentials');
      localStorage.setItem('credentials',JSON.stringify({'loggedIn':false,'access_token':'','email':''}))
    }
  }
});
