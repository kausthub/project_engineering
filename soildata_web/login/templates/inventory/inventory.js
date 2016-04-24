'use strict';

angular.module('myApp.inventory', ['ngRoute'])

.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
  $routeProvider.when('/inventory', {
    templateUrl: 'inventory/inventory.html',
    controller: 'InvntCtrl'
  });
  $locationProvider.html5Mode(true);
}])

.controller('InvntCtrl', function($scope,$http,authentication) {
	$http.get('https://farmalytics-backend.herokuapp.com/web/inventory').success(function(data){
		console.log(data)
		displayData(data)
	}).error(function(e){
		console.log(e);
	});
	$('#signout').click(function(){
		localStorage.removeItem('credentials');
		window.location.href="http://www.farmalytics.com"
	});
	$('#submit').click(function(){
		var item = $('#itemName').val();
		var qty = $('#itemqty').val();
		if(item != null && qty != null){
			$http.post('https://farmalytics-backend.herokuapp.com/web/updateitem',{'item':item,'qty':qty}).success(function(data){
				$('#itemName').val("");
				$('#itemqty').val("");
				$http.get('https://farmalytics-backend.herokuapp.com/web/inventory').success(function(data){
        				displayData(data);
        			}).error(function(e){
        				alert("Couldn't refresh page");
        			});
			}).error(function(e){
				alert("Couldn't add item");
			});
		}
		else{
			alert('Invalid inputs');
		}
	});
	function displayData(data){
		var str = "";
		var i;
		for(i=0;i<data.length;i++)
		{
			str+="<h3>"+data[i].item+" : "+data[i].qty+"</h3><button class='btn btn-default' onclick="+"editItem"+"("+"\'"+data[i].item+"\'"+","+data[i].qty+")"+">Edit</button><br>"
		}
		$('#items').html(str);
	}
	window.editItem = function(item,qty)
	{
		var changedItemvalue;
		bootbox.prompt({
        title: 'Edit item quantity',
        placeholder: 'quantity',
        value: qty,
        buttons: {
            confirm: {
                label: 'Submit'
            }
        },
        callback: function(value){
            changedItemvalue = value;
        	console.log(typeof(value));
        	$http.post('https://farmalytics-backend.herokuapp.com/web/updateitem',{'item':item,'qty':value}).success(function(data){
        		if(data == "success"){
        			$http.get('https://farmalytics-backend.herokuapp.com/web/inventory').success(function(data){
        				displayData(data);
        			}).error(function(e){
        				alert("Couldn't refresh page");
        			});
        		}
        	}).error(function(e){
        		alert("Couldn't update Item");
        	})
        }
    });
	}
});