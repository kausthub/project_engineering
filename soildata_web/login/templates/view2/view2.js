'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
  $locationProvider.html5Mode(true);
}])

.controller('View2Ctrl', function($scope,$http,$location,$route) {
	console.log('works')
	// ---------     global variables ---------
	var sensorData = [];
	var map;
    // var infoWindow;
    var heatmap;
	//-----------------------------------------
	// ---------     function declarations ----
	$scope.gotoScheduler = function($location){
		window.location.replace('http://www.farmalytics.com/#/scheduler')
	}
	$('#signout').click(function(){
		localStorage.removeItem('credentials');
		window.location.href="http://www.farmalytics.com/"
	});
	function initialize($scope){
		var coords = {"perimeter": [[12.788324, 77.383892], [12.788427, 77.384207], [12.788578, 77.384553], [12.788583, 77.385134], [12.788463, 77.386152], [12.788422, 77.387939], [12.788069, 77.388177], [12.787543, 77.388386], [12.787351, 77.388108], [12.787285, 77.387573], [12.787059, 77.386422], [12.786988, 77.385668], [12.787151, 77.384395], [12.787164, 77.384054], [12.787257, 77.38359], [12.787471, 77.383566], [12.787998, 77.383746]], "sensors": [[12.788122, 77.384082], [12.788136, 77.38454], [12.788161, 77.384946], [12.788147, 77.38545], [12.788144, 77.385978], [12.788141, 77.386402], [12.788099, 77.386837], [12.788124, 77.387186], [12.788172, 77.387529], [12.788175, 77.387878], [12.787689, 77.387981], [12.787597, 77.387632], [12.787528, 77.387255], [12.787483, 77.386861], [12.787402, 77.386447], [12.787384, 77.385777], [12.787445, 77.38524], [12.787479, 77.384817], [12.787489, 77.384438], [12.787491, 77.383966]]}
  		var mapOptions = {
		    disableDefaultUI: true,
    		zoom: 17,
    		center: new google.maps.LatLng(12.788141, 77.386402),
    		mapTypeId: google.maps.MapTypeId.SATELLITE
  		};
  		var farmcords;
		var cp = coords.perimeter;
   		var triangleCoords = [];
   		var i;
   		var cs = coords.sensors;
    	var sensorCoords = [];
    	var marker = [];
    	var flightPlanCoordinates1 = [
		    new google.maps.LatLng(12.787019,77.385995),
		    new google.maps.LatLng(12.788463,77.386207)
  		];
  		var flightPlanCoordinates2 = [
		    new google.maps.LatLng(12.788006,77.3882),
		    new google.maps.LatLng(12.787843,77.383677)
  		];
  		var flightPath1 = new google.maps.Polyline({
		    path: flightPlanCoordinates1,
		    geodesic: true,
		    strokeColor: '#FF0000',
		    strokeOpacity: 1.0,
		    strokeWeight: 2
  		});
  		var flightPath2 = new google.maps.Polyline({
		    path: flightPlanCoordinates2,
		    geodesic: true,
		    strokeColor: '#FF0000',
		    strokeOpacity: 1.0,
		    strokeWeight: 2
  		});
   		for(i=0;i<cp.length;i++)
      	{
        	triangleCoords[i] = new google.maps.LatLng(cp[i][0], cp[i][1])
      	}
	    for(i=0;i<cs.length;i++)
	    {
	        sensorCoords[i] = new google.maps.LatLng(cs[i][0], cs[i][1])
	    }
	  	farmcords = new google.maps.Polygon({
		    paths: triangleCoords,
		    strokeColor: '#FF0000',
		    strokeOpacity: 0.8,
		    strokeWeight: 3,
		    fillColor: '#FF0000',
		    fillOpacity: 0.0
	  	});
  		// infoWindow = new google.maps.InfoWindow();
  		var redraw = function(){
  			map = new google.maps.Map(document.getElementById('map-canvas'),
      		mapOptions);
      		flightPath1.setMap(map);
      		flightPath2.setMap(map);
  		  	farmcords.setMap(map);
		  	for(i=0;i<sensorCoords.length;i++)
		  	{
			    marker[i] = new google.maps.Marker({
				    position: sensorCoords[i],
				    map: map,
				    title: ''
			    });
		    	marker[i].set('id',i)
		    	google.maps.event.addListener(marker[i], 'click', function(event){
			        var id = this.get('id')*4
			        var j
			        var processedData = []
			        var count = 0
			        for(j=id;j<id+4;j++)
			        {
			            processedData[count] = sensorData[j]
			            count++ 
			        }
			        google.load('visualization', '1', {packages: ['corechart']});
			        var data = new google.visualization.DataTable();
				    data.addColumn('number', 'X');
				    data.addColumn('number', 'soil moisture');
				    data.addColumn('number', 'temperature');
				    data.addColumn('number', 'air moisture');
				    data.addColumn('number', 'ph');
				    data.addColumn('number', 'ec');
		      		var rowdata = [[]]
				    for(i=0;i<4;i++)
				    {
				    	rowdata[i] = [i,processedData[i].soil_moisture,processedData[i].temperature,processedData[i].air_moisture,processedData[i].ph,processedData[i].ec]
				    }
				    var _w_ = window.innerWidth - 50;
				    if(_w_ > 400){
				    	_w_ = 400;
				    }
		      		data.addRows(rowdata)
		      		var options = {
				        width: _w_,
				        height: 200,
				        hAxis: {
				          title: 'Time'
				        },
				        vAxis: {
				          title: 'Popularity'
				        },
				        series: {
				          1: {curveType: 'function'}
				        }
		      		};
				    var node = document.createElement('center');
				    var chart = new google.visualization.LineChart(node);
		      		chart.draw(data, options);

		    		// BootstrapDialog.alert(node);
		    		BootstrapDialog.show({
            			title: 'Visual View',
            			message: node,
            			type : BootstrapDialog.TYPE_SUCCESS
        			});

				    // infoWindow.setContent(node);
				    // console.log(node.text());
				    // infoWindow.setPosition(event.latLng);
			        // infoWindow.open(map);
		   		});
			}
  		}
  		redraw();
  		// var gradient = [
		  //   'rgba(255, 0, 25, 0)',
		  //   'rgba(255, 0, 25, 1)',
		  //   'rgba(255, 0, 25, 1)',
		  //   'rgba(255, 0, 25, 1)',
		  //   'rgba(255, 0, 25, 1)',
		  //   'rgba(255, 0, 25, 1)',
		  //   'rgba(255, 0, 25, 1)',
		  //   'rgba(255, 0, 25, 1)',
		  //   'rgba(255, 0, 25, 1)',
		  //   'rgba(255, 0, 25, 1)',
		  //   'rgba(255, 0, 25, 1)',
		  //   'rgba(255, 0, 25, 1)',
		  //   'rgba(255, 0, 25, 1)',
		  //   'rgba(255, 0, 25, 1)'
  		// ]
  		$scope.air_moisture = function(){
  			redraw();
  				var pointArray,count=0;
	        for(i=0;i<20;i++)
	        {
	            pointArray = new google.maps.MVCArray([sensorCoords[i]]);
	            heatmap = new google.maps.visualization.HeatmapLayer({
	                data: pointArray
	            });
	            heatmap.set('radius', heatmap.get('radius') ? null : 40);
	            heatmap.set('opacity', heatmap.get('opacity') ? null : 0.5);
	            var gradient1 = []
	            var p=0;
	            for(p=0;p<14;p++)
	            {
	            		gradient1[p] = sensorData[count].air_moisture_color;
	            }
	            gradient1[0] = gradient1[0].replace('1\)','0)');
	            console.log(gradient1);
	            heatmap.set('gradient', heatmap.get('gradient') ? null : gradient1);
	            heatmap.setMap(map);
	            count+=4;
	        }
  		}
  		$scope.soil_moisture = function(){
  			redraw();
  				var pointArray,count=0;
	        for(i=0;i<20;i++)
	        {
	            pointArray = new google.maps.MVCArray([sensorCoords[i]]);
	            heatmap = new google.maps.visualization.HeatmapLayer({
	                data: pointArray
	            });
	            heatmap.set('radius', heatmap.get('radius') ? null : 40);
	            heatmap.set('opacity', heatmap.get('opacity') ? null : 0.5);
	            var gradient1 = []
	            var p=0;
	            for(p=0;p<14;p++)
	            {
	            		gradient1[p] = sensorData[count].soil_moisture_color;
	            }
	            gradient1[0] = gradient1[0].replace('1\)','0)');
	            console.log(gradient1);
	            heatmap.set('gradient', heatmap.get('gradient') ? null : gradient1);
	            heatmap.setMap(map);
	            count+=4;
	        }
  		}
  		$scope.temperature = function(){
  			redraw();
	        var pointArray,count=0;
	        for(i=0;i<20;i++)
	        {
	            pointArray = new google.maps.MVCArray([sensorCoords[i]]);
	            heatmap = new google.maps.visualization.HeatmapLayer({
	                data: pointArray
	            });
	            heatmap.set('radius', heatmap.get('radius') ? null : 40);
	            heatmap.set('opacity', heatmap.get('opacity') ? null : 0.5);
	            var gradient1 = []
	            var p=0;
	            for(p=0;p<14;p++)
	            {
	            		gradient1[p] = sensorData[count].temperature_color;
	            }
	            gradient1[0] = gradient1[0].replace('1\)','0)');
	            console.log(gradient1);
	            heatmap.set('gradient', heatmap.get('gradient') ? null : gradient1);
	            heatmap.setMap(map);
	            count+=4;
	        }
  		} 
  		$scope.ph = function(){
  			redraw();
	        var pointArray,count=0;
	        for(i=0;i<20;i++)
	        {
	            pointArray = new google.maps.MVCArray([sensorCoords[i]]);
	            heatmap = new google.maps.visualization.HeatmapLayer({
	                data: pointArray
	            });
	            heatmap.set('radius', heatmap.get('radius') ? null : 40);
	            heatmap.set('opacity', heatmap.get('opacity') ? null : 0.5);
	            var gradient1 = []
	            var p=0;
	            for(p=0;p<14;p++)
	            {
	            		gradient1[p] = sensorData[count].ph_color;
	            }
	            gradient1[0] = gradient1[0].replace('1\)','0)');
	            console.log(gradient1);
	            heatmap.set('gradient', heatmap.get('gradient') ? null : gradient1);
	            heatmap.setMap(map);
	            count+=4;
	        }
  		}
  		$scope.ec = function(){
  			redraw();
	        var pointArray,count=0;
	        for(i=0;i<20;i++)
	        {
	            pointArray = new google.maps.MVCArray([sensorCoords[i]]);
	            heatmap = new google.maps.visualization.HeatmapLayer({
	                data: pointArray
	            });
	            heatmap.set('radius', heatmap.get('radius') ? null : 40);
	            heatmap.set('opacity', heatmap.get('opacity') ? null : 0.5);
	            var gradient1 = []
	            var p=0;
	            for(p=0;p<14;p++)
	            {
	            		gradient1[p] = sensorData[count].ec_color;
	            }
	            gradient1[0] = gradient1[0].replace('1\)','0)');
	            console.log(gradient1);
	            heatmap.set('gradient', heatmap.get('gradient') ? null : gradient1);
	            heatmap.setMap(map);
	            count+=4;
	        }
  		}
	}
	//-----------------------------------------
	$http.get('https://farmalytics.herokuapp.com/?n=5').success(function(data){
		//console.log(data)
		var i,j,count=0;
    	for(i=0;i<20;i++)
    	{
        	for(j=i;j<80;j+=20)
        	{
            	sensorData[count] = data[j];
            	count++;
        	}
    	}
    	sensorData = sensorData.reverse()
    	//console.log(sensorData)
    	initialize($scope);
	}).error(function(e){
		alert('Check your internet connection');
	});
});