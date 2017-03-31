angular.module('ag.gulp.one.home', [])
    .controller('homeCtrl', function($scope){
        $scope.homeText = 'This is home text: gulp take 1';
        $scope.obj = {
            name: "ashish"
        };
    });