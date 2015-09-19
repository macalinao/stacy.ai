angular.module('stacy', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  }).state('chat', {
    url: '/chat',
    templateUrl: 'templates/chat.html',
    controller: 'ChatCtrl'
  });

  $urlRouterProvider.otherwise('/chat');

})

.controller('HomeCtrl', function($scope) {
})

.controller('ChatCtrl', function($scope) {

  $scope.messages = [{
    who: 'from',
    msg: 'Test'
  }, {
    who: 'to',
    msg: 'Test'
  }, {
    who: 'from',
    msg: 'Test'
  }, {
    who: 'to',
    msg: 'Test'
  }, {
    who: 'from',
    msg: 'Test'
  }, {
    who: 'from',
    msg: 'Test'
  }];

});
