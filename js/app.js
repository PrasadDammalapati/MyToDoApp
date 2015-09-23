/*!
** Todo-Sortable-List Example App
** Licensed under the Apache License v2.0
** http://www.apache.org/licenses/LICENSE-2.0
** Built by Jay Kanakiya ( @techiejayk )
**/
"use strict";

var App = angular.module("todo", ["ngRoute", "ui.sortable", "LocalStorageModule"]);

App.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/', {
            templateUrl: 'pages/listview.html',
            controller: 'TodoCtrl'
        }).
        when('/ShowDetails/:name', {
            templateUrl: 'pages/detailsview.html',
            controller: 'ShowListController'
        }).
        otherwise({
            redirectTo: '/'
        });
  }]);

App.factory("tasks", function () {
    return {};
});


App.controller('ShowListController', function ($scope, tasks) {
    $scope.taskName = tasks.taskName;
    $scope.tasks = tasks;
    
    //$scope.tname = "here we can display task details";
});


App.controller("TodoCtrl", function ($scope, localStorageService, tasks) {

    

    $scope.tasksDetails = function (tododetails) {
        $scope.tasks = tasks;
        $scope.tasks.taskName = tododetails.taskName;
        $scope.tasks.taskStatus = tododetails.isDone;
    }


	$scope.init = function () {
		if (!localStorageService.get("todoList")) {
		    $scope.model = [
				{
				    name: "Primary", list: [
						{ taskName: "Create an Angular-js TodoList", isDone: false },
						{ taskName: "Understanding Angular-js Directives", isDone: true }
				    ]
				},
				{
				    name: "Secondary", list: [
						{ taskName: "Build an open-source website builder", isDone: false },
						{ taskName: "BUild an Email Builder", isDone: false }
				    ]
				}
		    ];
		}else{
			$scope.model = localStorageService.get("todoList");
		}
		$scope.show = "All";
		$scope.currentShow = 0;
	};

	$scope.addTodo = function () {
		/*Should prepend to array*/
		$scope.model[$scope.currentShow].list.splice(0, 0, {taskName: $scope.newTodo, isDone: false });
		/*Reset the Field*/
		$scope.newTodo = "";
	};

	$scope.deleteTodo = function (item) {
		var index = $scope.model[$scope.currentShow].list.indexOf(item);
		$scope.model[$scope.currentShow].list.splice(index, 1);
	};
    
	$scope.todoSortable = {
		containment: "parent",//Dont let the user drag outside the parent
		cursor: "move",//Change the cursor icon on drag
		tolerance: "pointer"//Read http://api.jqueryui.com/sortable/#option-tolerance
	};

	

	$scope.changeTodo = function (i) {
		$scope.currentShow = i;
	};

	/* Filter Function for All | Incomplete | Complete */
	$scope.showFn = function (todo) {
		if ($scope.show === "All") {
			return true;
		}else if(todo.isDone && $scope.show === "Complete"){
			return true;
		}else if(!todo.isDone && $scope.show === "Incomplete"){
			return true;
		}else{
			return false;
		}
	};

	$scope.$watch("model",function (newVal,oldVal) {
		if (newVal !== null && angular.isDefined(newVal) && newVal!==oldVal) {
			localStorageService.add("todoList",angular.toJson(newVal));
		}
	},true);

});