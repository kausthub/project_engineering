'use strict';

angular.module('myApp.scheduler', ['ngRoute'])

.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
  $routeProvider.when('/scheduler', {
    templateUrl: 'scheduler/scheduler.html',
    controller: 'SchdCtrl'
  });
  $locationProvider.html5Mode(true);
}])

.controller('SchdCtrl', function($scope,$http,authentication) {
	getEvents();
	// var access_token;
	// $scope.items=[];
	// $http.get('https://farmalytics-backend.herokuapp.com/web/gettoken/'+JSON.parse(localStorage.getItem('credentials')).email+'').success(function(data){
 //      	access_token = data.access_token;
 //      	console.log(access_token)
 //      	getEvents(data.access_token);
 //    }).error( function(e){
 //      	alert('couldn\'t login');
 //    });
    $('#signout').click(function(){
		localStorage.removeItem('credentials');
		window.location.href="http://www.farmalytics.com"
	});
	$('#addEvent').click(function(){
		var sum = document.getElementById('summary').value;
		var desc = document.getElementById('description').value;
		var dt = document.getElementById('dt').value;
		$.ajax({
			url: 'https://farmalytics-backend.herokuapp.com/web/addevent',
			method: 'POST',
			data: {'summary': sum,'desc': desc,'dt': dt},
			success: function(data)
			{
				console.log(data);
			},
			error: function(err)
			{
				console.log(err);
			}
		});
	});
	function getEvents(at)
	{
		$.ajax({
			url:'https://farmalytics-backend.herokuapp.com/web/events',
			method: 'GET',
			//data: {'access_token':at,'authorization':'Bearer '+at+''},
			success: function(data){
				var i;
				var str="";
				for(i=0;i<data.length;i++)
				{
					str += "<div class='jumbotron'>";
					str += "<h3>Summary : "+data[i].summary+"</h3>";
					str += "<h3>Description : "+data[i].description+"</h3>"
					str += "<h3>Date : "+data[i].datetime+"</h3>"
					str += "</div>"
				}
				console.log(str)
				$('#events').append(str);
			},
			error: function(e){
				console.log(e)
			}
		})
	}

});