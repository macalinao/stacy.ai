var socket = io();

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

  $urlRouterProvider.otherwise('/');

})

.controller('HomeCtrl', function($scope, $location) {

  $scope.go = function() {
    if (!$scope.destination) return;
    $location.path('/chat').search('place=' + $scope.destination);
  };

})

.controller('ChatCtrl', function($scope, $location) {

  $scope.messages = [];

  $scope.sendMsg = function() {
    if (!$scope.chatMsg) return;
    sendMsg($scope.chatMsg);
    $scope.chatMsg = '';
  };

  socket.on('msg', function(msg){
    addMsg('to', msg);
    $scope.$apply();
  });

  function sendMsg(msg) {
    addMsg('from', msg);
    socket.emit('msg', msg);
  }

  function addMsg(who, msg) {
    $scope.messages.push({
      who: who,
      msg: msg
    });
    onUpdateMsg();
  }

  function onUpdateMsg() {
    var el = $('#chatMessages')[0];
    setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 0);
  }

  var place = $location.search().place;
  sendMsg('Plan my trip to ' + place + '.');

});
