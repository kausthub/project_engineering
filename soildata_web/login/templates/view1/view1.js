'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
  $routeProvider.when('/', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
  $locationProvider.html5Mode(true);
}])

.controller('View1Ctrl', function($http,$location,$scope,authentication) {
    $scope.loggedin = authentication.isLoggedIn();
    console.log($scope.loggedin)
    console.log(location.href)
    if($scope.loggedin == true)
    {
        //window.location.replace('http://www.farmalytics.com/#/view2')
        $location.path('/view2')
    }
    else
    {
        if(location.href == 'http://www.farmalytics.com/')
    {
        //$('#login').append('<br><br><br><center><a>Sign In With Google!</a><p></p></center>');
        var opts = {client_id: '678963801746-0ft3o0kehg7lejehqt67q7rjr7qdq4hf.apps.googleusercontent.com',
            client_secret: 'SlJCqJ5yKhmHygSUfSr3CtuE',
            redirect_uri: 'http://www.farmalytics.com/',
            scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://mail.google.com https://www.googleapis.com/auth/calendar'
        }
        var googleapi = {
            authorize: function(options) {
            //var deferred = $.Deferred();
                var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
                    client_id: options.client_id,
                    redirect_uri: options.redirect_uri,
                    response_type: 'code',
                    scope: options.scope,
                    access_type: 'offline'
                });
                location.replace(authUrl);
            }
        };
        var $loginButton = $('.login');
        var $loginStatus = $('#login p');
        $loginButton.on('click', function() {
            googleapi.authorize(opts);
        });
    }
    else
    {
        var loc = location.href;
        var code = loc.split('=');
        code = code[1];
        code = code.replace('%2F','/')
        console.log("code is : ",code)
        $.ajax({
            method: 'POST',
            url: 'https://farmalytics-backend.herokuapp.com/web/setcode',
            data: {'code':code},
            success: function(data){
                console.log(data)
                localStorage.setItem('credentials',JSON.stringify({'loggedIn':true,'email':data.email,'access_token':data.access_token}));
                window.location.replace('http://www.farmalytics.com/#/view2')
            },
            error: function(err){
                console.log(err)
            }
        });
    }
    }
    
});
