/*
    app.js
    code for our demo application
 */

"use strict";

//this is the base URL for all task objects managed by your application
//requesting this with a GET will get all tasks objects
//sending a POST to this will insert a new task object
//sending a PUT to this URL + '/' + task.objectId will update an existing task
//sending a DELETE to this URL + '/' + task.objectId will delete an existing task

angular.module('toDoApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        //Parse required two extra headers sent with every HTTP request: X-Parse-Application-Id, X-Parse-REST-API-Key
        //the first needs to be set to your application's ID value
        //the second needs to be set to your application's REST API key
        //both of these are generated by Parse when you create your application via their web site
        //the following lines will add these as default headers so that they are sent with every
        //HTTP request we make in this application
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'MUs8nrZr6aSPwky8pEDQsnK0qVjfN8z465LYENon';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'ALkSGeG7Xhs9JHLFnP9O3YXlY2qd9k7KKxYsX1Nq';
    })
    .controller('TasksController', function($scope, $http) {
        var tasksUrl = 'https://api.parse.com/1/classes/tasks';

        $scope.refreshTasks = function(){
            $scope.loading = true;
            $http.get(tasksUrl + '?where={"done":false}')
                .success(function(data){
                    $scope.tasks = data.results;
                })
                .error(function(err){
                    $scope.errorMessage = err;
                })
                .finally(function(){
                    $scope.loading = false;
                });
        };
        $scope.refreshTasks();

        $scope.newTask = {done: false};

        $scope.addTask = function(){
            $http.post(tasksUrl, $scope.newTask)
                .success(function(responseData){
                    $scope.newTask.objectID = responseData.objectID;
                    $scope.tasks.push($scope.newTask);
                    $scope.newTask = {done: false};
                })
                .error(function(err){
                    $scope.errorMessage = err;
                });
        };

        $scope.updateTask = function(task){
            $http.put(tasksUrl + '/' + task.objectID, task)
                .success(function(){

                })
                .error(function(err){
                    $scope.errorMessage = err;
                });
        };
        $scope.incrementVotes = function(task, amount){
            $http.put(tasksUrl + '/' + task.objectID, {
                votes: {
                    __op: 'Increment',
                    amount: amount
                }
            })
                .success(function(responseData){
                    console.log(responseData);
                    task.votes = responseData.votes;
                })
                .error(function(err){
                    console.log(err);
                })
                .finally(function(){
                    $scope.updatng = false;
                })
        };
    });
