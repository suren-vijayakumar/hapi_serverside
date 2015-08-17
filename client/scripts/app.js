
var myApp = angular.module('myApp', []);

myApp.controller("NiceController", ['$scope', '$http', function($scope, $http){


    angular.extend($scope, {
        stuff: {},
        metaStuff: {},

        getStuff: function () {
        $http.get('/todos').success(function(data) {
                $scope.metaStuff = data;
                })

        },

        deleteStuff: function (stuffID) {
        $http.delete('/todos/' + stuffID).success(function(data) {
                $scope.metaStuff = data;

            })

        },

        createStuff: function () {
        $http.post('/todos', $scope.stuff).success(function (data) {
                $scope.metaStuff = data;

            });

        $scope.getStuff();
        },

        completeTask: function (stuffID, stuffText, stuffComplete) {
        $http.put('/todos/' + stuffID, {"text": stuffText, "complete": !stuffComplete}).success(function (data) {
                $scope.metaStuff = data;

        })

    }
});
}]);