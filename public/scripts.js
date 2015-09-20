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

  $scope.sendMsg = function() {
    if (!$scope.chatMsg) return;
    addMsg('from', $scope.chatMsg);
    socket.emit('msg', $scope.chatMsg);
    $scope.chatMsg = '';
  };

  socket.on('msg', function(msg){
    addMsg('to', msg);
    $scope.$apply();
  });

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

});
